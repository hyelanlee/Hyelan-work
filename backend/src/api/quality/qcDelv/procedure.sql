USE [Han_Eng_Back]
GO

/****** Object:  StoredProcedure [dbo].[Sc_QcDelv]    Script Date: 2023-09-21 오후 4:36:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Hyelan>
-- Create date: <2023-07-10>
-- Description:	<검사실적등록>
-- =============================================
ALTER PROCEDURE [dbo].[Sc_QcDelv]
    @iTag           char(1)   = NULL,
    @iAccunit       char(3)   = NULL,
    @iFactory       char(3)   = NULL,
    @iFrDate        char(8)   = NULL,
    @iToDate        char(8)   = NULL,
    @iQcDate        char(8)   = NULL,
    @iSupNo         char(12)  = NULL,
    @iGuBun         char(1)   = NULL,
    @iPno           char(5)   = NULL,
    @iCustCd        char(5)   = NULL,

    @TSupplyItemQc dbo.TSupplyItemQc READONLY,
    @SupNo         char(12) OUTPUT,
    @ErrMess       char(100) OUTPUT
AS
SELECT @iAccunit    = ISNULL(RTRIM(@iAccunit), ''),
       @iFactory    = ISNULL(RTRIM(@iFactory), ''),
       @iFrDate     = ISNULL(RTRIM(@iFrDate), ''),
       @iToDate     = ISNULL(RTRIM(@iToDate), ''),
       @iQcDate     = ISNULL(RTRIM(@iQcDate), ''),
       @iSupNo      = ISNULL(RTRIM(@iSupNo), ''),
       @iGuBun      = ISNULL(RTRIM(@iGuBun), ''),
       @iPno        = ISNULL(RTRIM(@iPno), ''),
       @iCustCd     = ISNULL(RTRIM(@iCustCd), '')

     IF @iTag = 'Q' GOTO select_statement
ELSE IF @iTag = 'I' GOTO save_statement
ELSE IF @iTag = 'D' GOTO delete_statement

/************************************************/
select_statement:
    BEGIN
        SELECT
            ISNULL(RTRIM(c.CustNm), '')      AS CustNm,
            ISNULL(RTRIM(a.CustCd), '')      AS CustCd,
            ISNULL(RTRIM(a.SupNo), '')       AS SupNo,
            ISNULL(RTRIM(a.SupSeq), '')      AS SupSeq,
            ISNULL(RTRIM(a.BalNo), '')       AS BalNo,
            ISNULL(RTRIM(a.BalSeq), '')      AS BalSeq,
            ISNULL(RTRIM(a.SupplyDate), '')  AS SupplyDate,
            ISNULL(RTRIM(g.GoodCd), '')      AS GoodCd,
            ISNULL(RTRIM(g.GoodNo), '')      AS GoodNo,
            ISNULL(RTRIM(g.GoodNm), '')      AS GoodNm,
            ISNULL(RTRIM(a.Spec), '')        AS Spec,
            ISNULL(RTRIM(m.MinorNm), '')     AS UnitNm,
            CASE WHEN ISNULL(a.QcDate, '') <> '' THEN QcQty ELSE  IIF(a.UnitCd = '064047', ISNULL(RTRIM(a.Su), 0), ISNULL(RTRIM(a.Qty), 0))  END AS NapQty,
            ISNULL(RTRIM(a.Qty), 0)          AS Qty,
            ISNULL(RTRIM(a.Su), 0)           AS Su,
            IIF(a.UnitCd = '064047', ISNULL(RTRIM(a.Su), 0), ISNULL(RTRIM(a.Qty), 0)) AS QcOkQty,
            ISNULL(a.Weight, 0)              AS RealWeight,
            ISNULL(RTRIM(a.QcErrorQty), 0)   AS QcErrorQty,
            ISNULL(RTRIM(a.QcErrorDesc), '') AS QcErrorDesc,
            ISNULL(RTRIM(m2.MinorNm), '')    AS QcErrorDescNm,
            ISNULL(RTRIM(a.QcDate), '')      AS QcDate,
            IIF(ISNULL(RTRIM(a.QcDate), '') = '', '미검사', '검사완료') AS Complate
        INTO #temp
        FROM TSupplyItem a
        LEFT OUTER JOIN TOrderH oh on a.BalNo = oh.BalNo and a.CustCd = oh.CustCd
        LEFT OUTER JOIN TOrderItem oi on a.BalNo = oi.BalNo and a.BalSeq = oi.BalSeq
        LEFT OUTER JOIN TGood g on a.GoodCd = g.GoodCd
        LEFT OUTER JOIN TCust c on a.CustCd = c.CustCd
        LEFT OUTER JOIN TMinor m on a.UnitCd = m.MinorCd
        LEFT OUTER JOIN TMinor m2 on a.QcErrorDesc = m2.MinorCd
        WHERE SupplyDate BETWEEN @iFrDate AND @iToDate
        AND ((a.SupNo = @iSupNo) OR (@iSupNo = ''))
        AND ((a.CustCd = @iCustCd) OR (@iCustCd = ''))
        ORDER BY a.SupNo

        IF (@iGuBun = '0')
        BEGIN
            SELECT * FROM #temp
        END
        IF (@iGuBun = '1')
        BEGIN
            SELECT * FROM #temp WHERE ISNULL(QcDate, '') = ''
        END
        IF (@iGuBun = '2')
        BEGIN
            SELECT * FROM #temp WHERE ISNULL(QcDate, '') <> ''
        END
    END
RETURN

/************************************************/
save_statement:

 -- 1. 구매입고 여부 확인
    IF EXISTS(
        SELECT 1
        FROM TSupplyItem a
        INNER JOIN @TSupplyItemQc b ON a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq AND a.CustCd = b.CustCd
        WHERE isnull(a.DelvGuid, '') != ''
    )
    BEGIN
        SET @ErrMess = '구매입고 처리된 자료는 검사실적을 저장할 수 없습니다.'
        RETURN
    END



    BEGIN TRY
        BEGIN TRAN

        select 'before',a.*, 'user', b.* from TSupplyItem a inner join @TSupplyItemQc b on a.SupNo = b.SupNo and a.SupSeq = b.SupSeq and a.CustCd = b.CustCd
        DECLARE @wQcDate VARCHAR(8), @Min int = 1, @Max int = 0
        SELECT @Max = count(*) FROM @TSupplyItemQc

        DECLARE @QcH AS TABLE (
            CustCd varchar(5) ,
	        SupNo varchar(12) ,
	        SupSeq varchar(3) ,
	        Su numeric(15, 5) ,
	        Qty numeric(15, 5) ,
	        QcDate varchar(8) ,
	        QcOkQty numeric(15, 5) ,
	        QcErrorQty numeric(15, 5) ,
	        QcErrorDesc varchar(6),
            Num int
        )
        INSERT into @QcH
        select u.CustCd, u.SupNo, u.SupSeq, u.Su, u.Qty, u.QcDate, u.QcOkQty, u.QcErrorQty, u.QcErrorDesc, ROW_NUMBER() OVER (ORDER by s.CustCd, s.SupplyDate) as Num
        from TSupplyItem as s
        inner join @TSupplyItemQc as u
        on s.CustCd = u.CustCd and s.SupNo = u.SupNo and s.SupSeq = u.SupSeq
        select 'temtable',* from @QcH

        WHILE (@Min <= @Max)
        BEGIN
            -- 2. 최조 저장
            IF (
                SELECT ISNULL(ii.QcDate,'') FROM @QcH i
                INNER JOIN TsupplyItem ii ON i.SupNo = ii.SupNo AND i.SupSeq = ii.SupSeq AND i.CustCd = ii.CustCd
                WHERE i.Num = @Min
            ) = ''
            BEGIN
            select '111', @Min
            SELECT 'hye',ISNULL(ii.QcDate,'') FROM @QcH i
                INNER JOIN TsupplyItem ii ON i.SupNo = ii.SupNo AND i.SupSeq = ii.SupSeq AND i.CustCd = ii.CustCd
                WHERE i.Num = @Min

                UPDATE aa SET QcQty = IIF(aa.UnitCd = '064047', aa.Su, aa.Qty)
                FROM TSupplyItem aa
                INNER JOIN @QcH bb ON aa.CustCd = bb.CustCd AND aa.SupNo = bb.SupNo AND aa.SupSeq = bb.SupSeq
                WHERE ISNULL(aa.QcDate, '') = ''
                AND bb.Num = @Min

                UPDATE a SET 
                    Qty = b.Qty,
                    Weight = b.Qty,
                    Su = b.Su,
                    QcDate = b.QcDate,
                    QcPno = @iPno,
                    QcErrorQty = b.QcErrorQty,
                    QcErrorDesc = b.QcErrorDesc,
                    Amount = Round(b.Qty * a.Price,0),
                    Tax = ROUND(b.Qty * a.Price * 0.1,0),
                    OkAmt = ROUND(b.Qty * a.Price * 1.1,0)
                FROM TSupplyItem a
                INNER JOIN @QcH b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
                WHERE ISNULL(a.QcDate, '') = ''
                and b.Num = @Min
            END

        -- 3. 이미 저장된 적이 있는 경우
            ELSE BEGIN
            select '222', @Min
            SELECT 'hye2',ISNULL(ii.QcDate,'') FROM @QcH i
                INNER JOIN TsupplyItem ii ON i.SupNo = ii.SupNo AND i.SupSeq = ii.SupSeq AND i.CustCd = ii.CustCd
                WHERE i.Num = @Min
        -- 3-1. 저장된 자료 원복
                UPDATE a SET
                    Qty = IIF(a.UnitCd = '064047', dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty), a.QcQty),
                    Weight = IIF(a.UnitCd = '064047', dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty), a.QcQty),
                    Su = IIF(a.UnitCd = '064047', a.QcQty, 0),
                    QcDate = '',
                    QcPno = '',
                    QcErrorQty = 0,
                    QcErrorDesc = '',
                    -- QcQty = 0,
                    Amount = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price, 0), Round(a.QcQty * a.Price, 0)),
                    Tax = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price * 0.1, 0), Round(a.QcQty * a.Price * 0.1, 0)),
                    OkAmt = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price * 1.1, 0), Round(a.QcQty * a.Price * 1.1, 0))
                FROM TsupplyItem a
                INNER JOIN @QcH b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
                WHERE ISNULL(a.QcDate, '') != ''
                and b.Num = @Min

        --3-2. 원복 후 자료 다시 업데이트
                UPDATE aa SET QcQty = IIF(aa.UnitCd = '064047', aa.Su, aa.Qty)
                FROM TSupplyItem aa
                INNER JOIN @QcH bb ON aa.CustCd = bb.CustCd AND aa.SupNo = bb.SupNo AND aa.SupSeq = bb.SupSeq
                WHERE bb.Num = @Min

                UPDATE a SET 
                    Qty = b.Qty,
                    Weight = b.Qty,
                    Su = b.Su,
                    QcDate = b.QcDate,
                    QcPno = @iPno,
                    QcErrorQty = b.QcErrorQty,
                    QcErrorDesc = b.QcErrorDesc,
                    Amount = Round(b.Qty * a.Price,0),
                    Tax = ROUND(b.Qty * a.Price * 0.1,0),
                    OkAmt = ROUND(b.Qty * a.Price * 1.1,0)
                FROM TSupplyItem a
                INNER JOIN @QcH b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
                AND b.Num = @Min
            END
            SET @Min = @Min + 1;
        END

        -- SELECT @wQcDate = u.QcDate from TSupplyItem i
        -- INNER JOIN @TSupplyItemQc u on i.SupNo = u.SupNo and i.SupSeq = u.SupSeq and i.CustCd = u.CustCd 

--  -- 2. 최조 저장
--             IF EXISTS(
--                 SELECT 1 FROM @TSupplyItemQc i
--                 INNER JOIN TsupplyItem ii ON i.SupNo = ii.SupNo AND i.SupSeq = ii.SupSeq AND i.CustCd = ii.CustCd
--                 WHERE isnull(ii.QcDate, '') = ''
--             )
--             BEGIN
--             select '111'
--                 UPDATE aa SET QcQty = IIF(aa.UnitCd = '064047', aa.Su, aa.Qty)
--                 FROM TSupplyItem aa
--                 INNER JOIN @TSupplyItemQc bb ON aa.CustCd = bb.CustCd AND aa.SupNo = bb.SupNo AND aa.SupSeq = bb.SupSeq
--                 WHERE ISNULL(aa.QcDate, '') = ''

--                 UPDATE a SET 
--                     Qty = b.Qty,
--                     Weight = b.Qty,
--                     Su = b.Su,
--                     QcDate = b.QcDate,
--                     QcPno = @iPno,
--                     QcErrorQty = b.QcErrorQty,
--                     QcErrorDesc = b.QcErrorDesc,
--                     Amount = Round(b.Qty * a.Price,0),
--                     Tax = ROUND(b.Qty * a.Price * 0.1,0),
--                     OkAmt = ROUND(b.Qty * a.Price * 1.1,0)
--                 FROM TSupplyItem a
--                 INNER JOIN @TSupplyItemQc b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
--                 WHERE ISNULL(a.QcDate, '') = ''
--             END

--  -- 3. 이미 저장된 적이 있는 경우
--             ELSE BEGIN
--             select '222'
--  -- 3-1. 저장된 자료 원복
--                 UPDATE a SET
--                     Qty = IIF(a.UnitCd = '064047', dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty), a.QcQty),
--                     Weight = IIF(a.UnitCd = '064047', dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty), a.QcQty),
--                     Su = IIF(a.UnitCd = '064047', a.QcQty, 0),
--                     QcDate = '',
--                     QcPno = '',
--                     QcErrorQty = 0,
--                     QcErrorDesc = '',
--                     -- QcQty = 0,
--                     Amount = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price, 0), Round(a.QcQty * a.Price, 0)),
--                     Tax = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price * 0.1, 0), Round(a.QcQty * a.Price * 0.1, 0)),
--                     OkAmt = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price * 1.1, 0), Round(a.QcQty * a.Price * 1.1, 0))
--                 FROM TsupplyItem a
--                 INNER JOIN @TSupplyItemQc b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
--                 WHERE ISNULL(a.QcDate, '') != ''

--  --3-2. 원복 후 자료 다시 업데이트
--                 UPDATE aa SET QcQty = IIF(aa.UnitCd = '064047', aa.Su, aa.Qty)
--                 FROM TSupplyItem aa
--                 INNER JOIN @TSupplyItemQc bb ON aa.CustCd = bb.CustCd AND aa.SupNo = bb.SupNo AND aa.SupSeq = bb.SupSeq

--                 UPDATE a SET 
--                     Qty = b.Qty,
--                     Weight = b.Qty,
--                     Su = b.Su,
--                     QcDate = b.QcDate,
--                     QcPno = @iPno,
--                     QcErrorQty = b.QcErrorQty,
--                     QcErrorDesc = b.QcErrorDesc,
--                     Amount = Round(b.Qty * a.Price,0),
--                     Tax = ROUND(b.Qty * a.Price * 0.1,0),
--                     OkAmt = ROUND(b.Qty * a.Price * 1.1,0)
--                 FROM TSupplyItem a
--                 INNER JOIN @TSupplyItemQc b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
--             END

 --4. 디버깅
            select 'after',a.*, 'user', b.* from TSupplyItem a inner join @TSupplyItemQc b on a.SupNo = b.SupNo and a.SupSeq = b.SupSeq and a.CustCd = b.CustCd

            -- RAISERROR('update Test',16,3)
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        SET @ErrMess = ERROR_MESSAGE()
        ROLLBACK
    END CATCH
RETURN

/************************************************/
delete_statement:

 -- 1. 구매입고 여부 확인
    IF EXISTS(
        SELECT 1
        FROM TSupplyItem a
        INNER JOIN @TSupplyItemQc b ON a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq AND a.CustCd = b.CustCd
        where isnull(a.DelvGuid, '') != ''
    )
    BEGIN
        SET @ErrMess = '구매입고 처리된 자료는 검사실적을 삭제할 수 없습니다.'
        RETURN
    END

    BEGIN TRY
        BEGIN TRAN

 -- 2. 자료 원복
                UPDATE a SET
                    Qty = IIF(a.UnitCd = '064047', dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty), a.QcQty),
                    Weight = IIF(a.UnitCd = '064047', dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty), a.QcQty),
                    Su = IIF(a.UnitCd = '064047', a.QcQty, 0),
                    QcDate = '',
                    QcPno = '',
                    QcErrorQty = 0,
                    QcErrorDesc = '',
                    QcQty = 0,
                    Amount = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price, 0), Round(a.QcQty * a.Price, 0)),
                    Tax = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price * 0.1, 0), Round(a.QcQty * a.Price * 0.1, 0)),
                    OkAmt = IIF(a.UnitCd = '064047', Round(dbo.Fn_MaterialUnitConvert(a.GoodCd, 'Kg', a.QcQty) * a.Price * 1.1, 0), Round(a.QcQty * a.Price * 1.1, 0))
                FROM TsupplyItem a
                INNER JOIN @TSupplyItemQc b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo AND a.SupSeq = b.SupSeq
                WHERE ISNULL(a.QcDate, '') <> ''

 -- 3. 디버깅
            -- select 'supplyitem',a.*, 'user', b.* from TSupplyItem a 
            --     INNER JOIN @TSupplyItemQc b ON a.CustCd = b.CustCd AND a.SupNo = b.SupNo and a.SupSeq = b.SupSeq
            -- RAISERROR('delete Test',16,3)
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        SET @ErrMess = ERROR_MESSAGE()
        ROLLBACK
    END CATCH
RETURN

GO

