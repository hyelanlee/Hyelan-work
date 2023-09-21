USE [Han_Eng_Back]
GO

/****** Object:  StoredProcedure [dbo].[Sc_Supply]    Script Date: 2023-09-21 오후 4:35:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Hyelan>
-- Create date: <2023-06-16>
-- Description:	<주문발주처리>
-- =============================================
CREATE PROCEDURE [dbo].[Sc_Supply]
    @iTag           varchar(2)     = NULL,
    @iAccunit       char(4)        = NULL,
    @iFactory       char(4)        = NULL,
    @iCustCd        varchar(5)     = NULL,
    @iGoodNo        varchar(50)    = NULL,
    @iStatus        varchar(1)     = NULL,
    @iBalNo         varchar(12)    = NULL,
    @iBalSeq        varchar(3)     = NULL,
    @iFrDate        varchar(8)     = NULL,
    @iToDate        varchar(8)     = NULL,
    @iSupplyDate    char(8)        = NULL,
    @iSupNo         varchar(12)    = NULL,
    @iDateType      varchar(8)     = NULL,
    @iInputQty      numeric(18, 5) = NULL,
    @iInputSu       numeric(18, 5) = NULL,

    @TSupplyItemInfo dbo.TSupplyItemInfo READONLY,
    @TSupplyValueUpdate dbo.TSupplyValueUpdate READONLY,
    @SupNo          varchar(12)  OUTPUT,
    @ErrMess        varchar(100) OUTPUT

    AS
SELECT  @iTag       = ISNULL(LTRIM(RTRIM(@iTag        )),''),
        @iAccunit   = ISNULL(LTRIM(RTRIM(@iAccunit    )),''),
        @iFactory   = ISNULL(LTRIM(RTRIM(@iFactory    )),''),
        @iCustCd    = ISNULL(LTRIM(RTRIM(@iCustCd     )),''),
        @iGoodNo    = ISNULL(LTRIM(RTRIM(@iGoodNo     )),''),
        @iStatus    = ISNULL(LTRIM(RTRIM(@iStatus     )),''),
        @iBalNo     = ISNULL(LTRIM(RTRIM(@iBalNo      )),''),
        @iFrDate    = ISNULL(LTRIM(RTRIM(@iFrDate     )),''),
        @iToDate    = ISNULL(LTRIM(RTRIM(@iToDate     )),''),
        @iSupplyDate= ISNULL(LTRIM(RTRIM(@iSupplyDate )),''),
        @iSupNo     = ISNULL(LTRIM(RTRIM(@iSupNo      )),''),
        @iDateType  = ISNULL(LTRIM(RTRIM(@iDateType   )),'')


     IF @iTag = 'Q' GOTO select_statement -- 발주리스트 조회
ELSE IF @iTag = 'B' GOTO search_supply_item_list -- 납품 상세리스트 조회
ELSE IF @iTag = 'U' GOTO save_statement -- 납품 저장
ELSE IF @iTag = 'D' GOTO delete_statement --납품 삭제
ELSE IF @iTag = 'A' GOTO search_supNo_list -- 납품번호리스트 조회
ELSE IF @iTag = 'C' GOTO calculate_minap --미납 계산
ELSE IF @iTag = 'G' GOTO incomplate_supply_count -- 납품업체 미납리스트 카운트
ELSE IF @iTag = 'P' GOTO print_statement -- 출력 조회
ELSE IF @iTag = 'F' GOTO select_isDelv -- 구매입고에 저장 여부 확인 (X)
ELSE IF @iTag = 'M' GOTO multiple_convert --(X)
ELSE IF @iTag = 'L' GOTO select_supply_list --거래명세서조회

/************************************************/
select_supply_list: --거래명세서조회
    BEGIN
        SELECT a.CustCd     AS CustCd,
            a.SupNo         AS SupNo,
            a.SupplyDate    AS SupplyDate,
            count(a.SupNo)  AS Count,
            SUM(a.Amount)   AS Amount,
            SUM(a.Tax)      AS Tax,
            SUM(a.OkAmt)    AS OkAmt
        FROM TSupplyItem a
        WHERE a.CustCd = @iCustcd
        AND a.SupplyDate BETWEEN @iFrDate AND @iToDate
        AND a.Accunit = @iAccunit
        and a.Factory = @iFactory
        GROUP BY a.SupNo, a.CustCd, a.SupplyDate
    END
RETURN

/************************************************/
select_statement: --@iTag = 'Q'
    BEGIN
        SELECT 
         ISNULL(RTRIM(oh.balNo),'')     AS BalNo
        ,ISNULL(RTRIM(oi.BalSeq),'')    AS BalSeq
        ,ISNULL(RTRIM(oi.GoodCd),'')    AS GoodCd
        ,ISNULL(RTRIM(g.GoodNo),'')     AS GoodNo
        ,ISNULL(RTRIM(g.GoodNm),'')     AS GoodNm
        ,IIF(ISNULL(RTRIM(oi.Spec), '') <> '', RTRIM(oi.Spec), RTRIM(g.Spec)) AS Spec
        ,ISNULL(RTRIM(oi.UnitCd),'')    AS UnitCd
        ,ISNULL(RTRIM(oi.BalQty), 0)    AS BalQty -- 발주량
        ,ISNULL(RTRIM(m1.minornm),'')   AS UnitNm --단위
        ,ISNULL(RTRIM(oi.Weight),0)     AS Weight --중량
        ,ISNULL(RTRIM(oi.Su),0)         AS Su --길이
        ,IIF(UnitCd = ' ', ISNULL(RTRIM(si.NapSu),0), ISNULL(RTRIM(si.NapQty),0)) AS NapQty --납품량
        ,CASE WHEN UnitCd = '064047' THEN IIF(ISNULL(oi.Su, 0) - ISNULL(si.NapSu, 0) < 0, 0, ISNULL(oi.Su, 0) - ISNULL(si.NapSu, 0))
            ELSE IIF(ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0) < 0, 0, ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0)) END MiNapQty --미납량
        ,ISNULL(RTRIM(oi.Qty),0) - ISNULL(si.NapQty, 0) AS MiWeight
        ,ISNULL(RTRIM(oi.Price),0)      AS Price
        ,ISNULL(RTRIM(oi.Amount),0)     AS Amount
        ,ISNULL(RTRIM(oh.BalDate),'')   AS BalDate
        ,ISNULL(RTRIM(oi.NapDate),'')   AS NapDate
        ,ISNULL(RTRIM(oi.Remark),'')    AS Remark
        ,CASE WHEN ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0) <= 0 OR oi.clstype = '160004' THEN '완료'
            WHEN oi.clstype = '160003' THEN '보류'
            WHEN (ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0) > 0 AND ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0) != ISNULL(oi.Qty, 0)) OR oi.clstype = '160002' THEN '진행'
            WHEN ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0) = ISNULL(oi.Qty, 0)  THEN '작성'
            END AS Clstype
        ,ISNULL(RTRIM(ta.ControlFlag), 'Z') AS ControlFlag

        INTO #TEMP
        FROM TOrderH oh

        LEFT OUTER JOIN TOrderItem oi ON oh.Balno = oi.Balno
        LEFT OUTER JOIN TGood g ON oi.GoodCd = g.GoodCd
        LEFT OUTER JOIN TMinor m1 ON oi.UnitCd = MinorCd
        LEFT OUTER JOIN TMinor m2 ON oi.Clstype = m2.MinorCd
        LEFT OUTER JOIN TAcctApprMasterDoc ta ON ta.DocNo = oh.BalNo AND ta.DocSource = 'OD' AND ta.Factory = @iFactory
        LEFT OUTER JOIN (
            SELECT BalNo, BalSeq, CustCd, SUM(ISNULL(si.Qty, 0)) NapQty, SUM(ISNULL(si.Su, 0)) NapSu
            FROM TSupplyItem si
            WHERE si.CustCd = @iCustCd
            GROUP BY CustCd, BalNo, BalSeq
        ) si ON oi.BalNo = si.BalNo AND oi.BalSeq = si.BalSeq AND oh.CustCd = si.CustCd
        WHERE IIF(@iDateType = 1, oh.BalDate, oi.NapDate) BETWEEN @iFrDate AND @iToDate
        AND oh.Factory = @iFactory
        AND oh.Accunit = @iAccunit
        AND ((oh.CustCd = @iCustCd) OR (@iCustCd = ''))
        AND ((g.GoodNo LIKE @iGoodNo + '%') OR (@iGoodNo = ''))
        AND ((oh.BalNo = @iBalNo) OR (@iBalNo = ''))

        SELECT * FROM #Temp
        WHERE ControlFlag LIKE IIF(BalDate >= '20230614', 'H', 'Z')
        AND Clstype  LIKE CASE WHEN @iStatus = '0' THEN '작성' WHEN @iStatus = '1' THEN '진행' WHEN @iStatus = '2' THEN '보류' WHEN @iStatus = '3' THEN '완료' ELSE '%' END
        ORDER BY BalDate DESC, BalNo DESC, BalSeq
        
    END
RETURN

/************************************************/
search_supNo_list: --@iTag = 'A'

    WITH A AS(
        SELECT Ymd + dbo.Fn_FillZero(Seq, 4) + IIF(ISNULL(Del, '') <> '', '-삭제됨', '')  AS value
              ,Ymd + dbo.Fn_FillZero(Seq, 4) + IIF(ISNULL(Del, '') <> '', '-삭제됨', '')  AS text
        FROM TSupplySequence a
        WHERE Ymd    = @iSupplyDate
            AND Custcd = @iCustCd
            AND ISNULL(Del, '') <> ''

        UNION

        SELECT SupNo + IIF(ISNULL(DelvGuid, '') <> '', '-완료됨' , '') AS value
              ,SupNo + IIF(ISNULL(DelvGuid, '') <> '', '-완료됨' , '') AS text 
        FROM TSupplyItem
        WHERE SupplyDate = @iSupplyDate
        AND CustCd = @iCustCd
        GROUP BY SupNo, DelvGuid, SupSeq
    )
    SELECT * FROM A

RETURN

/************************************************/
select_isDelv:
    SELECT COUNT(*) AS isDelv
    FROM TSupplyItem
    WHERE SupNo = @iSupNo
    AND CustCd = @iCustCd
    AND DelvGuid <> ''
RETURN

/************************************************/
incomplate_supply_count:
    SELECT top 1 COUNT(SupNo) AS Cnt, SupNo
    FROM TSupplyItem a
    WHERE CustCd = @iCustCd
    AND ISNULL(DelvGuid, '') = ''
    AND ((a.SupplyDate = @iSupplyDate) OR (@iSupplyDate = ''))
    GROUP BY SupNo
    ORDER BY SupNo 
RETURN

/************************************************/
calculate_minap: --@iTag = 'C'

    DECLARE @rowCount int;
    SELECT @rowCount =  COUNT(*) FROM TSupplyItem WHERE BalNo = @iBalNo AND BalSeq = @iBalSeq AND CustCd = @iCustCd

 --1. 해당 BalNo,BalSeq에 대해 기존에 저장된 Row가 1개 또는 그 이상이고, 이번에 신규로 저장하는 경우
    IF ((@rowCount >= 1 AND @iSupNo = '') OR (@rowCount > 1)) 
    BEGIN
        SELECT 
            ISNULL(oi.Qty, 0) - si.TotalQty - ISNULL(@iInputQty, 0) AS CurrentMiQty,
            ISNULL(oi.Su, 0) - si.TotalSu - ISNULL(@iInputSu, 0) AS CurrentMiSu
            
        FROM TOrderH oh
        INNER JOIN TOrderItem oi ON oh.BalNo = oi.BalNo
        INNER JOIN (
            SELECT
                SUM(ISNULL(Qty, 0)) TotalQty,
                SUM(ISNULL(Su, 0)) TotalSu,
                CustCd,
                BalNo,
                BalSeq
            FROM TSupplyItem
            WHERE CustCd = @iCustCd AND BalNo = @iBalNo AND BalSeq = @iBalSeq and SupNo != @iSupNo
            GROUP BY CustCd, BalNo, BalSeq 
        ) si ON oh.CustCd = si.CustCd AND oi.BalNo = si.BalNo AND oi.BalSeq = si.BalSeq
    END

 --2. 해당 BalNo, BalSeq가 저장된 적이 딱 1번만 있거나, 전혀 없는 경우
    ELSE IF (@rowCount <= 1 ) 
    BEGIN
        SELECT 
            ISNULL(oi.Qty, 0) - ISNULL(@iInputQty, 0) as CurrentMiQty,
            ISNULL(oi.Su, 0) - ISNULL(@iInputSu, 0) as CurrentMiSu
            
        FROM TOrderH oh
        INNER JOIN TOrderItem oi ON oh.BalNo = oi.BalNo
        WHERE oi.BalNo = @iBalNo AND oi.BalSeq = @iBalSeq AND oh.CustCd = @iCustCd
    END
RETURN

/************************************************/
multiple_convert: --@iTag = 'M'
    SELECT a.BalNo, a.BalSeq, dbo.Fn_MaterialUnitConvert(GoodCD, 'M', Value) AS NewValue, No
    FROM @TSupplyValueUpdate a

RETURN

/************************************************/
save_statement: --@iTag = 'U'

 -- 1. 납품일자 형식 확인
    IF ISDATE(@iSupplyDate) = 0
    BEGIN
        SET @ErrMess = '납품일자 입력 오류입니다.'
    END

 -- 2. 구매입고 처리 여부 확인
    IF EXISTS(
        SELECT 1
        FROM TSupplyItem si
        INNER JOIN @TSupplyItemInfo i ON si.SupNo = i.SupNo AND si.CustCd = @iCustCd AND i.BalNo = si.BalNo AND i.BalSeq = si.BalSeq
        WHERE ISNULL(si.DelvGuid, '') <> ''
    )
    BEGIN
        SET @ErrMess = '구매입고 처리된 자료는 수정할 수 없습니다.'
        RETURN
    END

 -- 3. 검사실적 등록 여부 확인
    IF EXISTS(
        SELECT 1
        FROM TSupplyItem si
        INNER JOIN @TSupplyItemInfo i ON si.SupNo = i.SupNo AND si.CustCd = @iCustCd AND si.SupSeq = i.SupSeq
        WHERE ISNULL(si.QcDate, '') <> ''
    )
    BEGIN
        SET @ErrMess = '검사실적 등록된 자료는 수정할 수 없습니다.'
        RETURN
    END

 -- 3-1. 같은 날짜에 같은발주가 저장된 적이 있는지 확인
    IF EXISTS(
        SELECT 'here',si.*
        FROM TSupplyItem si
        INNER JOIN @TSupplyItemInfo i ON si.BalNo = i.BalNo AND si.CustCd = @iCustCd AND si.BalSeq = i.BalSeq AND si.SupplyDate = @iSupplyDate
        WHERE si.SupNo != @iSupNo
    )
    BEGIN
        SET @ErrMess = '동일한 날짜에 같은 발주가 저장된 건이 있습니다.'
        RETURN
    END

 -- 3-2. 부가세코드가 다른 발주는 함께 납품서 저장 불가
    DECLARE @wcound int = 0
    SELECT @wcound = count(*) FROM @TSupplyItemInfo 
    IF (@wcound > 1)
    BEGIN
        IF EXISTS(
            SELECT Vatcd
            FROM @TSupplyItemInfo i
            INNER JOIN TOrderH oh ON i.BalNo = oh.BalNo AND oh.CustCd = @icustcd
            GROUP BY oh.Vatcd
            HAVING COUNT(oh.Vatcd) = 1
        )
        BEGIN
            SET @ErrMess = '부가세코드가 다른 발주입니다. 함께 납품서를 저장할 수 없습니다.'
            RETURN
        END
    END

 -- 4. Transaction 시작
    BEGIN TRY
        BEGIN TRAN

 -- 4-1. 납품번호 생성
            DECLARE @MaxSeq char(3)
            SELECT @MaxSeq = MAX(SupSeq)
            FROM TSupplyItem
            WHERE Factory = @iFactory
            AND Accunit = @iAccunit
            AND SupNo = @iSupNo
            AND CustCd = @iCustCd

            IF(@iSupNo IS null OR @iSupNo = '' OR @iSupNo= 'NEW')
            BEGIN
                DECLARE @Ymd char(8), @Pmsseq int, @MakeSupNo varchar(12)
                SELECT @Ymd = Max(Ymd)
                FROM TSupplySequence
                WHERE Ymd = @iSupplyDate
                AND Custcd = @iCustcd
                AND Factory = @iFactory
                AND Accunit = @iAccunit

                SELECT @Pmsseq = ISNULL(MAX(seq),0)
                FROM TSupplySequence
                WHERE Ymd = @iSupplyDate
                AND Custcd = @iCustcd
                AND Factory = @iFactory
                AND Accunit = @iAccunit

 -- 4-2. 해당 날짜에 납품이 처음인 경우
                IF (ISNULL(@Ymd, '') = '') 
                BEGIN
                    INSERT TSupplySequence (
                        Ymd
                        , Custcd
                        , Factory
                        , Accunit
                        , Seq
                    )
                    VALUES (
                        @iSupplyDate
                        , @iCustcd
                        , @iFactory
                        , @iAccunit
                        , 1
                    )
                    SELECT @MakeSupNo = Ymd FROM TSupplySequence
                    WHERE Custcd = @iCustCd AND Ymd = @iSupplyDate 
                    SELECT @iSupNo = @MakeSupNo + '0001'
                END
                
 -- 4-3. 해당 날짜에 이미 납품한 적이 있는 경우
                ELSE BEGIN 
                    INSERT TSupplySequence (
                                Ymd
                              , Custcd
                              , Factory
                              , Accunit
                              , Seq
                            )
                            VALUES (
                                @iSupplyDate
                              , @iCustcd
                              , @iFactory
                              , @iAccunit
                              , @Pmsseq +1
                            )
                    SELECT @MakeSupNo = Max(Seq) FROM TSupplySequence
                    WHERE Custcd = @iCustCd AND Ymd = @iSupplyDate 
                    SELECT @iSupNo = @iSupplyDate + dbo.Fn_FillZero(@MakeSupNo, 4)
                END
            END

 -- 5. TsupplyItem 자료 저장
            MERGE TSupplyItem AS T
            USING (
                SELECT 
                    CASE WHEN ISNULL(SupNo, '') = '' AND ISNULL(SupSeq, '') = '' AND ISNULL(@MaxSeq, '') = ''
                            THEN FORMAT(CAST(No AS int), '000')
                         WHEN ISNULL(SupNo, '') = '' AND ISNULL(SupSeq, '') = '' AND ISNULL(@MaxSeq, '') <>  ''
                            THEN FORMAT(CAST(@MaxSeq AS int) + ROW_NUMBER() OVER (PARTITION BY SupNo ORDER BY No), '000')
                         ELSE SupSeq END AS MakeSeq
                    ,@iAccunit AS Accunit
                    ,@iFactory AS Factory
                    ,@iCustCd AS CustCd
                    ,@iSupNo AS SupNo
                    ,BalNo
                    ,BalSeq
                    ,DelvGuid
                    ,GoodCd
                    ,Spec
                    ,UnitCd
                    ,Su
                    ,Weight
                    ,Qty
                    ,Price
                    ,Round(Amount * 0.1,0) AS Tax
                    ,Amount
                    ,Round(Amount * 1.1, 0) AS OkAmt
                    ,No
                    ,CreDate
                    ,ModDate
                    ,QcPno
                    ,QcDate
                    ,QcOkQty
                    ,SupplyDate
                    ,Remark
                    ,Hcn
                    ,RealWeight
                FROM @TSupplyItemInfo

            ) AS Info
            ON T.SupNo = Info.SupNo AND T.SupSeq = Info.MakeSeq AND T.Factory = Info.Factory AND T.CustCd = Info.CustCd AND T.Accunit = Info.Accunit 

            WHEN MATCHED THEN
                UPDATE
                    SET 
                         BalNo      = Info.BalNo
                        ,BalSeq     = Info.BalSeq
                        ,DelvGuid   = Info.DelvGuid
                        ,GoodCd     = Info.GoodCd
                        ,Spec       = Info.Spec
                        ,UnitCd     = Info.UnitCd
                        ,Su         = Info.Su
                        ,Weight     = Info.Qty
                        ,Qty        = Info.Qty
                        ,Price      = Info.Price
                        ,Tax        = Info.Tax
                        ,Amount     = Info.Amount
                        ,OkAmt      = Info.OkAmt
                        ,No         = Info.No
                        ,ModDate    = CONVERT(varchar(8), GETDATE(),112)
                        ,QcPno      = Info.QcPno
                        ,QcDate     = Info.QcDate
                        ,SupplyDate = Info.SupplyDate
                        ,Remark     = Info.Remark
                        ,Hcn        = Info.Hcn
                        ,RealWeight = Info.RealWeight

            WHEN NOT MATCHED THEN
                INSERT ( Accunit
                        ,Factory
                        ,CustCd
                        ,SupNo
                        ,SupSeq
                        ,BalNo
                        ,BalSeq
                        ,DelvGuid
                        ,GoodCd
                        ,Spec
                        ,UnitCd
                        ,Su
                        ,Weight
                        ,Qty
                        ,Price
                        ,Tax
                        ,Amount
                        ,OkAmt
                        ,No
                        ,CreDate
                        ,ModDate
                        ,QcPno
                        ,QcDate
                        ,SupplyDate
                        ,Remark
                        ,Hcn
                        ,RealWeight

                )
                values ( @iAccunit
                        ,@iFactory
                        ,@iCustCd
                        ,@iSupNo
                        ,Info.MakeSeq
                        ,Info.BalNo
                        ,Info.BalSeq
                        ,Info.DelvGuid
                        ,Info.GoodCd
                        ,Info.Spec
                        ,Info.UnitCd
                        ,Info.Su
                        ,Info.Qty
                        ,Info.Qty
                        ,Info.Price
                        ,Info.Tax
                        ,Info.Amount
                        ,Info.OkAmt
                        ,Info.No
                        ,CONVERT(varchar(8), GETDATE(),112)
                        ,Info.ModDate
                        ,Info.QcPno
                        ,Info.QcDate
                        ,@iSupplyDate
                        ,Info.Remark
                        ,Info.Hcn
                        ,Info.RealWeight

                );
                SET @SupNo = @iSupNo;

 -- 6. MaxNo와 CountRow 길이 비교
            DECLARE @wmaxno varchar(3), @wcountrow varchar(3)

            SELECT @wmaxno = MAX(CAST(No AS int))
            FROM TSupplyItem
            WHERE SupNo = @iSupNo
            AND CustCd = @iCustCd

            SELECT @wcountrow = COUNT(*) 
            FROM TSupplyItem
            WHERE SupNo = @iSupNo
            AND CustCd = @iCustCd

            IF @wmaxno <> @wcountrow
            BEGIN
                RAISERROR('저장 중 순번 오류가 발생했습니다.', 16, 1)
            END

 -- 7. 중복 No확인
            IF EXISTS(
                SELECT 1
                FROM TSupplyItem
                WHERE SupNo = @iSupNo
                AND CustCd = @iCustCd
                GROUP BY [No]
                HAVING COUNT(No) <> 1
            )
            BEGIN
                RAISERROR('저장 중 순번 오류가 발생했습니다!', 16, 1)
            END

 -- 8. 디버깅
                -- select 'TsupplyItem', * from TSupplyItem where SupNo = @iSupNo
                -- RAISERROR('test save', 16, 1)
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        SET @ErrMess = ERROR_MESSAGE()
        ROLLBACK
    END CATCH
RETURN

/************************************************/
search_supply_item_list: --@iTag = 'B'
    BEGIN
        SELECT
            ISNULL(a.Accunit, '')       AS Accunit,
            ISNULL(a.Factory, '')       AS Factory,
            ISNULL(a.CustCd, '')        AS CustCd,
            ISNULL(a.SupNo, '')         AS SupNo,
            ISNULL(a.SupSeq, '')        AS SupSeq,
            ISNULL(a.BalNo, '')         AS BalNo,
            ISNULL(a.BalSeq, '')        AS BalSeq,
            ISNULL(a.DelvGuid, '')      AS DelvGuid,
            ISNULL(a.GoodCd, '')        AS GoodCd,
            ISNULL(g.GoodNo, '')        AS GoodNo,
            ISNULL(g.GoodNm, '')        AS GoodNm,
            ISNULL(a.Spec, '')          AS Spec,
            ISNULL(a.UnitCd, '')        AS UnitCd,
            ISNULL(t1.MinorNm, '')      AS UnitNm,
            IIF(t1.MinorNm = 'M', ISNULL(oi.Su, 0), ISNULL(oi.Qty, 0)) AS BalQty, --발주수량
            CASE WHEN ISNULL(a.QcDate, '') <> '' THEN QcQty else IIF(t1.MinorNm = 'M', ISNULL(a.SU, 0), ISNULL(a.Qty, 0)) END AS NapQty, --납품량
            ISNULL(a.Qty, 0)            AS Qty, --현재건 납품 중량수량
            ISNULL(a.Weight, 0)         AS Weight, --현재건 납품 중량수량
            ISNULL(a.Su, 0)             AS Su, --현재 건 납품길이
            IIF(t1.MinorNm = 'M', ISNULL(oi.Su, 0) - ISNULL(si.NapSu, 0), ISNULL(oi.Qty, 0) - ISNULL(si.NapQty, 0)) AS MiNapQty, --미납량
            ISNULL(a.QcErrorQty, 0)     AS ErrorQty, --불량수량
            ISNULL(a.Price, 0)          AS Price,
            ISNULL(a.Tax, 0)            AS Tax,
            ISNULL(oi.Amount, 0)        AS BalAmount, --발주금액
            ISNULL(a.Amount, 0)         AS Amount, --납품금액
            ISNULL(a.OkAmt, 0)          AS OkAmt,
            ISNULL(a.No, '')            AS No,
            ISNULL(a.CreDate, '')       AS CreDate,
            ISNULL(a.ModDate, '')       AS ModDate,
            ISNULL(a.SupplyDate, '')    AS SupplyDate,
            ISNULL(oi.Clstype, '')      AS Clstype,
            ISNULL(a.Remark, '')        AS Remark,
            ISNULL(a.Hcn, '')           AS Hcn,
            ISNULL(a.RealWeight, 0)     AS RealWeight
        FROM TSupplyItem a
        LEFT OUTER JOIN TOrderItem oi on a.BalNo = oi.BalNo and a.BalSeq = oi.BalSeq
        LEFT OUTER JOIN TGood g on a.GoodCd = g.GoodCd
        LEFT OUTER JOIN TMinor t1 on a.UnitCd = t1.MinorCd
        LEFT OUTER JOIN (
            SELECT BalNo, BalSeq, CustCd, SUM(ISNULL(si.Qty, 0)) NapQty, SUM(ISNULL(si.Su, 0)) NapSu
            FROM TSupplyItem si
            WHERE si.CustCd = @iCustCd
            GROUP BY CustCd, BalNo, BalSeq
        ) si ON oi.BalNo = si.BalNo AND oi.BalSeq = si.BalSeq AND si.CustCd = @iCustcd
        WHERE a.CustCd = @iCustCd
        and a.SupplyDate = @iSupplyDate
        and a.SupNo = @iSupNo
    END
RETURN

 /************************************************/
delete_statement: --@iTag = 'D'

 -- 1. 구매입고 여부 확인
    IF EXISTS(
        SELECT 1
        FROM TSupplyItem si
        INNER JOIN @TSupplyItemInfo i on si.SupNo = i.SupNo and si.CustCd = @iCustCd
        WHERE ISNULL(si.DelvGuid, '') <> ''
    )
    BEGIN
        SET @ErrMess = '구매입고 처리된 자료는 삭제할 수 없습니다.'
        RETURN
    END

 -- 1-1 검사실적 여부 확인
    IF EXISTS(
        SELECT 1
        FROM TSupplyItem si
        INNER JOIN @TSupplyItemInfo i on si.SupNo = i.SupNo and si.CustCd = @iCustCd
        WHERE ISNULL(si.QcDate, '') <> ''
    )
    BEGIN
        SET @ErrMess = '검사실적 등록된 자료는 삭제할 수 없습니다.'
        RETURN
    END

    BEGIN TRY
        BEGIN TRAN

 -- 2. 납품번호의 모든 명세를 다 삭제하는지 확인 후, 삭제하는 경우 TSupplySequence 테이블의 Del컬럼 업데이트
            DECLARE @countA int, @countB int, @wseq VARCHAR(4)
            SELECT @countA = count(*) FROM TSupplyItem WHERE SupNo = @iSupNo AND CustCd = @iCustCd
            SELECT @countB = count(*) FROM @TSupplyItemInfo
            SELECT @wseq = CONVERT(int, SUBSTRING(@iSupNo, 9, 4)) 
            IF (@countA <= @countB) 
            BEGIN
                UPDATE TSupplySequence SET Del = 'D' WHERE Ymd = @iSupplyDate AND Custcd = @iCustCd AND Seq = @wseq
            END

 -- 3. TSupplyItem 삭제
            DELETE b
            FROM @TSupplyItemInfo a
            INNER JOIN TSupplyItem b ON a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq and b.CustCd = @iCustCd;

            WITH TReSeq AS (
                SELECT SupNo, SupSeq, FORMAT(ROW_NUMBER() OVER (ORDER BY [No]), '000') AS NewSeq
                FROM TSupplyItem
                WHERE SupNo = @iSupNo
                AND CustCd = @iCustCd -- 조건 추가
            )

 -- 4. TSupplyItem테이블의 No필드 업데이트
            UPDATE a SET [No] = b.NewSeq
            FROM TSupplyItem a
            INNER JOIN TReSeq b ON a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq 
            WHERE a.SupNo = @iSupNo
            AND a.CustCd = @iCustCd

            SET @SupNo = @iSupNo;

 -- 5. MaxNo와 CountRow의 크기가 같은지 확인
            SELECT @wmaxno = MAX(CAST(No AS int))
            FROM TSupplyItem
            WHERE SupNo = @iSupNo
            AND CustCd = @iCustCd

            SELECT @wcountrow = COUNT(*)
            FROM TSupplyItem
            WHERE SupNo = @iSupNo
            AND CustCd = @iCustCd

            IF @wmaxno <> @wcountrow
            BEGIN
                RAISERROR('삭제 중 순번 오류가 발생했습니다.!!', 16, 1)
            END

 --6. 중복 No확인
            IF EXISTS(
                SELECT 1
                FROM TSupplyItem
                WHERE SupNo = @iSupNo
                AND CustCd = @iCustCd
                GROUP BY [No]
                HAVING COUNT(No) <> 1
            )
            BEGIN
                RAISERROR('삭제 중 오류가 발생했습니다!', 16, 1)
            END
 --7. 디버깅
            -- select 'afterDelete',* from TSupplyItem 
            --   RAISERROR('delete test', 16, 1)
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        SET @ErrMess = ERROR_MESSAGE()
        ROLLBACK
    END CATCH
RETURN

 /************************************************/
print_statement: --@iTag = 'P'
    BEGIN
        SELECT SUBSTRING(c.TaxNo,1,3) + '-' + SUBSTRING(c.TaxNo,4,2) + '-' + SUBSTRING(c.TaxNo,6,5) AS Taxno,
            SUBSTRING(a.SupplyDate,1,4) + '-' + SUBSTRING(a.SupplyDate,5,2) + '-' + SUBSTRING(a.SupplyDate,7,2) AS SupplyDate,
            SUBSTRING(ISNULL(RTRIM(di.DelvDate), ''),1,4) + '-' + SUBSTRING(ISNULL(RTRIM(di.DelvDate), ''),5,2) + '-' + SUBSTRING(ISNULL(RTRIM(di.DelvDate), ''),7,2) AS DelvDate,
            ISNULL(c.CustNm, '')        AS CustNm,
            ISNULL(RTRIM(a.CustCd), '') AS CustoutCd,
            ISNULL(c.Owner, '')         AS Owner,
            ISNULL(c.HAddr1, '')        AS HAddr1,
            ISNULL(c.Type, '')          AS Type,
            ISNULL(c.Kind, '')          AS Kind,
            ISNULL(a.SupNo, '')         AS SupNo,
            ISNULL(a.BalNo, '')         AS BalNo,
            ISNULL(a.BalSeq, '')        AS BalSeq,
            ISNULL(g.GoodNo, '')        AS GoodNo,
            ISNULL(g.Spec, '')          AS Spec,
            ISNULL(m1.MinorNm, '')      AS UnitNm,
            ISNULL(a.Qty, 0)            AS Qty,
            ISNULL(a.Su, 0)             AS Su,
            ISNULL(a.Price, 0)          AS Price,
            ISNULL(a.Amount, 0)         AS Amount,
            ISNULL(a.Remark, 0)         AS Remark,
            ISNULL(MAX(a.Hcn), 0)       AS HCN,
            ISNULL(MAX(a.RealWeight), 0) AS RealWeight,
            RTRIM(a.CustCd) + RTRIM(a.supNo) AS CustCdSupNo,
            (SELECT SUM(ISNULL(Amount, 0)) FROM TSupplyItem WHERE SupNo = @iSupNo AND CustCd = @iCustCd) AS TotalAmt,
            ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS No

        FROM TSupplyItem a
        LEFT OUTER JOIN TCust c ON a.CustCd = c.CustCd
        LEFT OUTER JOIN TGood g ON a.GoodCd = g.GoodCd
        LEFT OUTER JOIN TMinor m1 ON a.UnitCd = m1.MinorCd
        LEFT OUTER JOIN (
            SELECT i.DelvNo, i.Guid, h.DelvDate
            FROM TdelvItem i
            INNER JOIN TDelvH h ON i.DelvNo = h.DelvNo
        ) di ON a.DelvGuid = di.Guid
        WHERE a.SupNo = @iSupNo
        AND a.CustCd = @iCustCd
        AND a.Accunit = @iAccunit
        AND a.Factory = @iFactory
        GROUP BY c.TaxNo, a.SupplyDate, c.CustNm, c.[Owner], c.HAddr1, c.[Type], c.Kind, a.SupNo,
            a.BalNo, a.BalSeq, g.GoodNo, g.Spec, m1.MinorNm, a.Qty, a.Su, a.Price, a.Amount, a.Amount, di.DelvDate, 
            a.Remark, a.CustCd, a.[No]
        ORDER BY a.SupNo, a.[No]
    END
RETURN
GO

