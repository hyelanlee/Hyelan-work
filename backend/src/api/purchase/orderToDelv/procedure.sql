USE [Han_Eng_Back]
GO

/****** Object:  StoredProcedure [dbo].[SC_OrderToDelv]    Script Date: 2023-09-21 오후 4:39:30 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Hyelan>
-- Create date: <2023-07-10>
-- Description:	<발주자료경비처리>
-- =============================================
ALTER PROCEDURE [dbo].[SC_OrderToDelv]
	@iTag           varchar    (1   ) = null,
    @iAccunit       varchar    (3   ) = null,
    @iFactory       varchar    (3   ) = null,
    @iFrdate        varchar    (8   ) = null,
    @iTodate        varchar    (8   ) = null,
    @iGubun         varchar    (1   ) = null,
    @iCustcd        varchar    (5   ) = null,
    @iPno           varchar    (5   ) = null,
    @iDeptCd        varchar    (6   ) = null,
    @iSupNo         varchar    (12  ) = null,

    @OrderToDelv dbo.OrderToDelv readonly,

    @SupNo          varchar (20  ) output,
    @ErrMess        varchar (200 ) output

as

  select
         @iAccunit = ISNULL(LTRIM(RTRIM(@iAccunit   )), ''),
         @iFactory = ISNULL(LTRIM(RTRIM(@iFactory   )), ''),
         @iFrdate  = ISNULL(LTRIM(RTRIM(@iFrdate    )), ''),
         @iTodate  = ISNULL(LTRIM(RTRIM(@iTodate    )), ''),
         @iGubun   = ISNULL(LTRIM(RTRIM(@iGubun     )), ''),
         @iCustcd  = ISNULL(LTRIM(RTRIM(@iCustcd    )), ''),
         @iPno     = ISNULL(LTRIM(RTRIM(@iPno       )), ''),
         @iDeptCd  = ISNULL(LTRIM(RTRIM(@iDeptCd    )), ''),
         @iSupNo   = ISNULL(LTRIM(RTRIM(@iSupNo     )), '')

     if @iTag = 'H' goto select_header_statement
else if @iTag = 'D' goto select_detail_statement
else if @iTag = 'I' goto insert_statement

/************************************************/
select_header_statement:
    BEGIN
        SELECT ISNULL(RTRIM(si.SupplyDate), '') AS SupplyDate 
            ,ISNULL(RTRIM(c.CustNm), '')        AS CustNm 
            ,ISNULL(RTRIM(si.CustCd), '')       AS CustCd 
            ,ISNULL(RTRIM(si.SupNo), '')        AS SupNo 
            ,ISNULL(RTRIM(oh.Vatcd), '')        AS VatCd 
            ,ISNULL(RTRIM(m.MinorNm), '')       AS VatCdNm 
            ,SUM(ISNULL(si.Amount, 0))          AS Amount 
            ,SUM(ISNULL(si.Tax, 0))             AS Tax 
            ,SUM(ISNULL(si.OkAmt, 0))           AS OkAmt 
            ,ISNULL(RTRIM(di.DelvNo), '')       AS DelvNo 
            ,ISNULL(RTRIM(si.Accunit), '')      AS Accunit 
            ,ISNULL(RTRIM(si.Factory), '')      AS Factory 
            ,ISNULL(pro.CompleteQc, '')         AS Qcyn
        INTO #temp
        FROM TSupplyItem si
        LEFT OUTER JOIN TCust c ON si.Accunit = c.Accunit AND si.CustCd = c.CustCd
        LEFT OUTER JOIN TOrderH oh ON si.Accunit = c.Accunit AND si.CustCd = c.CustCd AND si.BalNo = oh.BalNo
        LEFT OUTER JOIN TDelvItem di ON si.Accunit = di.Accunit AND si.DelvGuid = di.Guid
        LEFT OUTER JOIN TMinor m ON oh.Vatcd = m.MinorCd
        OUTER APPLY (
            SELECT CASE WHEN ComPleteQc = 0 THEN '검사완료' ELSE '미검사' END AS CompleteQc
            FROM (
                SELECT SUM(CASE WHEN ISNULL(QcDate, '') != '' THEN 0 ELSE 1 END) AS CompleteQc
                FROM TSupplyItem
                WHERE SupNo = si.SupNo AND Factory = si.Factory and CustCd = si.CustCd
            ) CompleteQc
        ) pro
        WHERE si.SupplyDate BETWEEN @iFrdate AND @iTodate
        AND si.Accunit = @iAccunit
        AND si.Factory = @iFactory
        AND ((si.CustCd = @iCustcd) OR (@iCustcd = ''))
        GROUP BY si.CustCd, si.SupplyDate, c.CustNm, si.SupNo, di.DelvNo, si.Accunit, si.Factory, oh.Vatcd, m.MinorNm, pro.CompleteQc
        ORDER BY si.SupNo

        IF @iGubun = '0'
        BEGIN
            SELECT * FROM #temp
        END
        IF @iGubun = '1'
        BEGIN
            SELECT * FROM #temp WHERE DelvNo = ''
        END
        IF @iGubun = '2'
        BEGIN
            SELECT * FROM #temp WHERE DelvNo <> ''
        END
    END

RETURN

/************************************************/
select_detail_statement:
    BEGIN
        SELECT g.goodno         AS GoodNo,
            m.MinorNm           AS UnitNm,
            IIF(a.UnitCd = '064047', oi.Su, oi.Qty) AS BalQty,
            IIF(a.UnitCd = '064047', a.Su, a.Qty) AS NapQty,
            a.Weight            AS Weight,
            a.Su                AS Su,
            IIF(a.UnitCd = '064047', oi.Su - a.Su, oi.Qty - a.Qty) AS MiQty,
            a.Price             AS Price,
            a.Amount            AS Amount,
            a.BalNo             AS BalNo,
            a.BalSeq            AS BalSeq
        FROM TSupplyItem a
        LEFT OUTER JOIN TGood g ON a.GoodCd = g.GoodCd
        LEFT OUTER JOIN TOrderH oh ON a.CustCd = oh.CustCd AND a.BalNo = oh.BalNo
        LEFT OUTER JOIN TOrderItem oi ON a.BalNo = oi.BalNo AND a.BalSeq = oi.BalSeq
        LEFT OUTER JOIN TMinor m ON a.UnitCd = m.MinorCd
        WHERE a.Accunit = @iAccunit
        AND a.Factory = @iFactory
        AND a.CustCd = @iCustcd 
        AND a.SupNo = @iSupNo
    END
RETURN

/************************************************/
insert_statement:

BEGIN TRY
    BEGIN TRAN

-- 1. 변수선언, 테이블변수 선언
        DECLARE @Min int = 0, @Max int = 0, @iSupplyDate varchar(8), @DelNo varchar(12), @wCustcd varchar(5), @wVatCd varchar(6)
        SELECT @Max = count(*) FROM @OrderToDelv 

        DECLARE @SupplyH AS TABLE (
            SupplyDate varchar(12), 
            CustCd varchar(5), 
            SupNo varchar(12), 
            Num int,
            VatCd varchar(6),
            DelvNo varchar(12)
        )

-- 2. 같은월에 입고되었는지 확인
            IF (@Max > 1 )
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM @OrderToDelv
                    GROUP BY SupplyDa
                    HAVING COUNT(SupplyDa) = 1
                )
                BEGIN
                    RAISERROR('입고 월이 다른 경우 함께 처리할 수 없습니다.', 16, 1)
                END
            END

-- 2-1. Max DelvNo 찾음
            SELECT @iSupplyDate = SupplyDate FROM @OrderToDelv 
            SELECT @DelNo = Max(SUBSTRING(dh.DelvNo,9, 4)) 
            FROM TDelvH dh 
            WHERE dh.Accunit = @iAccunit
                AND dh.Factory = @iFactory
                AND dh.ExportYn  IN ('1','2')
                AND dh.DelvDate  LIKE  SUBSTRING(@iSupplyDate, 1, 6) + '%'

-- 3. 작성번호 생성 후 임시테이블에 저장
            INSERT INTO @SupplyH
            SELECT S.SupplyDate, S.CustCd, S.SupNo, Info.[No], Max(Info.VatCd),
                'PO' + SUBSTRING(Info.SupplyDate, 1, 6) + dbo.Fn_Fillzero(isnull(@DelNo, 0) + Info.No+1, 4) AS DelvNo
                
            FROM @OrderToDelv AS Info
            INNER JOIN TSupplyItem AS S ON S.SupplyDate = Info.SupplyDate AND S.CustCd = Info.CustCd AND S.SupNo = Info.SupNo
            GROUP BY S.SupplyDate, S.CustCd, S.SupNo, info.[No], Info.SupplyDate, Info.VatCd

-- 3-1. 결재여부 확인 
            WHILE (@Min <= @Max)
            BEGIN
                SELECT @wCustcd = CustCd FROM @SupplyH  WHERE [Num] = @Min
                SELECT @wVatCd = oh.VatCd FROM @SupplyH sh 
                INNER JOIN TSupplyItem si ON sh.SupNo = si.SupNo AND sh.CustCd = si.CustCd
                INNER JOIN TOrderH oh ON si.BalNo = oh.BalNo AND si.CustCd = si.CustCd
                WHERE Num = @Min

                IF (SELECT dbo.fn_AcctApprDocFlag(substring(@iSupplyDate,1,6) + @wCustcd + @wVatCd, 'PM', @iFactory, @iPno)) <> 'A'
                BEGIN
                    RAISERROR('결재 상신된 자료입니다. 저장할 수 없습니다.', 16, 1)
                END

                SET @Min = @Min + 1
            END

-- 3-2. 입고검사 여부 확인
            IF EXISTS (
                SELECT 1
                FROM TSupplyItem si
                INNER JOIN @OrderToDelv od ON si.CustCd = od.CustCd AND si.SupNo = od.SupNo
                WHERE isnull(QcDate, '') = ''
            )
            BEGIN
                RAISERROR('입고검사가 완료되지 않았습니다.', 16, 1)
            END

-- 4. TDelvH 테이블에 자료생성
            INSERT TDelvH (
                     Accunit
                    ,Factory
                    ,ExportYn
                    ,DelvNo
                    ,DelvDate
                    ,Gendate
                    ,DeptCD
                    ,Pno
                    ,CustCd
                    ,CurrCd
                    ,Exchang
                    ,Remark
                    ,TaxDate
                    ,Vatcd
                    ,TotalForeign
                    ,Currdate
                    ,TotalVat
                    ,TotalAmt
                    ,TotalWeight
                    ,Unitprice
                    ,Unitpricew
                    ,Sliptyp
                    ,TotalPrice
                    ,TotalAmount
                    ,Qty
                        )
            SELECT
                 @iAccunit          AS Accunit
                ,@iFactory          AS Factory
                ,'1'                AS ExportYn
                ,od.DelvNo          AS DelvNo
                ,od.SupplyDate      AS DelvDate
                ,CONVERT(varchar(8), GETDATE(), 112) AS Gendate
                ,@iDeptCd           AS DeptCD
                ,@iPno              AS Pno
                ,od.CustCd          AS CustCd
                ,'057001'           AS CurrCd
                ,1                  AS Exchang
                ,'발주자료경비처리'  AS Remark
                ,od.SupplyDate      AS TaxDate
                ,od.Vatcd           AS Vatcd
                ,0                  AS TotalForeign
                ,od.SupplyDate      AS Currdate
                ,sii.TotalVat       AS TotalVat
                ,sii.TotalAmt       AS TotalAmt
                ,sii.TotalWeight    AS TotalWeight
                ,0                  AS Unitprice
                ,0                  AS Unitpricew
                ,'1'                AS Sliptyp
                ,sii.TotalAmt       AS TotalPrice
                ,sii.TotalAmount    AS TotalAmount
                ,sii.TotalWeight    AS Qty
            FROM @SupplyH od
            INNER JOIN TSupplyItem si ON od.SupNo = si.SupNo AND od.CustCd = si.CustCd AND od.SupplyDate = si.SupplyDate
            INNER JOIN TOrderH oh ON  od.CustCd = oh.CustCd AND si.BalNo = oh.BalNo
            INNER JOIN (
                SELECT CustCd, SupNo, Round(SUM(Tax),0) TotalVat, Round(SUM(Amount),0) TotalAmt, SUM(Qty) TotalWeight, Round(SUM(Amount) + SUM(Tax),0) TotalAmount
                FROM TSupplyItem
                GROUP BY CustCd, SupNo
            )sii ON oh.CustCd = sii.CustCd AND od.SupNo = sii.SupNo
            GROUP BY od.Num, od.DelvNo, od.SupplyDate, od.CustCd, oh.Vatcd, od.SupNo, od.VatCd
                ,sii.TotalVat, sii.TotalAmt, sii.Totalweight, sii.TotalAmount

-- 5. TDelvItem 테이블에 자료 생성
            INSERT INTO TDelvItem(
                 DelvNo
                ,DelvSeq
                ,Factory
                ,Accunit
                ,Guid
                ,Exportyn
                ,Goodcd
                ,Spec
                ,Unitcd
                ,Price
                ,Div
                ,Weight
                ,Su
                ,Qty
                ,InQty
                ,Amount
                ,KorAmt
                ,Stockyn
                ,Stockqty
                ,Okamt
                ,Tax
                ,Whcd
                ,No
                ,Balno
                ,Balserl
                ,Sourcetype
                ,Jukyocd
                ,Boxunit
                ,Remark
                ,CrePno
                ,CreDate
            )
            SELECT
                 od.DelvNo                    AS DelvNo
                ,dbo.Fn_FillZero(si.[No], 3)  AS DelvSeq
                ,@iFactory                    AS Factory
                ,@iAccunit                    AS Accunit
                ,REPLACE(SUBSTRING(CONVERT(VARCHAR(40),NEWID()),2,15), '-',SUBSTRING(CAST(RAND()*10000 AS CHAR(8)),3,1)) AS DelvGuid
                ,'1'                          AS Exportyn
                ,RTRIM(si.GoodCd)             AS GoodCd
                ,RTRIM(si.Spec)               AS Spec
                ,RTRIM(si.UnitCd)             AS UnitCd
                ,si.Price                     AS Price
                ,RTRIM(si.SupNo)              AS Div
                ,si.Qty                       AS Weight
                ,si.Su                        AS Su
                ,si.Qty                       AS Qty
                ,si.Qty                       AS inQty
                ,si.Amount                    AS Amount
                ,si.Amount                    AS korAmount
                ,'Y'                          AS Stockyn
                ,si.Qty                       AS StockQty
                ,Round(si.Amount + si.Tax, 0) AS OkAmt
                ,Round(si.Tax, 0)             AS Tax
                ,RTRIM(g.Wrhcd)               AS Whcd
                ,RTRIM(si.No)                 AS No
                ,RTRIM(si.BalNo)              AS BalNo
                ,RTRIM(si.BalSeq)             AS Balserl
                ,''                           AS SourceType
                ,ISNULL(f.JUKYOCD, '')        AS Jukyocd
                ,RTRIM(g.Boxunit)             AS Boxunit
                ,RTRIM(si.Remark)             AS Remark
                ,@iPno                        AS CrePno
                ,CONVERT(varchar(8), GETDATE(), 112) AS CreDate
            FROM TSupplyItem si 
            INNER JOIN @SupplyH od ON od.SupNo = si.SupNo AND od.CustCd = si.CustCd AND od.SupplyDate = si.SupplyDate 
            INNER JOIN TOrderH oh ON si.BalNo = oh.BalNo
            INNER JOIN TOrderItem oi ON si.BalNo = oi.BalNo AND si.BalSeq = oi.BalSeq
            INNER JOIN TGood g ON oi.GoodCd = g.GoodCd
            INNER JOIN ACCT700T f ON g.Group12 = f.JUKYOCD

-- 6. TSupplyItem 테이블에 DelvGuid 저장
            UPDATE a SET DelvGuid = ISNULL(di.Guid, '')
            FROM TSupplyItem a
            INNER JOIN TDelvH dh ON a.CustCd = dh.CustCd
            INNER JOIN TDelvItem di ON a.BalNo = di.BalNo AND a.BalSeq = di.BalSerl AND di.Div = a.SupNo
            INNER JOIN @OrderToDelv od ON a.SupNo = od.SupNo AND od.CustCd = dh.CustCd AND a.SupplyDate = od.SupplyDate
            WHERE a.Accunit = @iAccunit
            AND a.Factory = @iFactory

-- 7. 디버깅
                -- select 'delvH',dh.* from TDelvH dh inner join @SupplyH sh on dh.DelvNo = sh.DelvNo order by dh.DelvNo desc
                -- select 'delvitem',di.* from TDelvItem di inner join @SupplyH sh on di.DelvNo = sh.DelvNo 
                -- select 'orderitem', oi.* From torderitem oi
                -- inner join TSupplyItem si on si.Balno = oi.BalNo and oi.Balseq = si.Balseq
                -- INNER JOIN TOrderH oh on si.CustCd = oh.CustCd and oh.BalNo = si.BalNo
                -- inner join @OrderToDelv od on si.SupNo = od.SupNo and oh.CustCd = od.CustCd and si.CustCd = od.CustCd
                -- select 'tgoodswh', g.* from TGoodsWH g 
                -- inner join TDelvItem di on g.LotNo = di.DelvNo and g.Guid = di.Guid
                -- inner join @SupplyH sh on di.DelvNo = sh.DelvNo
                -- select 'afterguid', * from TSupplyItem t inner join @OrderToDelv od on t.SupNo = od.SupNo and t.CustCd = od.CustCd
        -- RAISERROR('test save', 16, 1)
----------------------------------------------------------------------------------------------------

    COMMIT TRAN
END TRY
BEGIN CATCH
    SET @ErrMess = ERROR_MESSAGE()
    ROLLBACK
END CATCH

GO

