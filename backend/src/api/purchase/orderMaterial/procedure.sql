USE [Han_Eng_Back]
GO

/****** Object:  StoredProcedure [dbo].[Sc_Order_WEB]    Script Date: 2023-09-21 오후 4:33:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER proc [dbo].[Sc_Order_WEB]

    @iTag             varchar(1   ) = null,
    @iTagSave         varchar(1   ) = null,
    @iSort            varchar(1   ) = null,
    @iChk_ApprDocProg varchar(1   ) = null,
    @iAccunit         varchar(3   ) = null,
    @iFactory         varchar(3   ) = null,
    @iUserId          varchar(5   ) = null,
    @iDocSource       varchar(20  ) = null,

    @iExportYn       varchar(1   ) = null,
    @iBalNo          varchar(14  ) = null,
    @iBalDate        varchar(8   ) = null,
    @iDeptCd         varchar(6   ) = null,
    @iPno            varchar(5   ) = null,
    @iCustCd         varchar(5   ) = null,
    @iPaymentType    varchar(10  ) = null,
    @iRemarkM        varchar(120 ) = null,
    @iURGENCY        varchar(6   ) = null,
    @iVatcd          varchar(6   ) = null,
    @iContractno     varchar(20  ) = null,
    @iFileno         varchar(20  ) = null,
    @iTotalWeight    numeric (18,5) = null,
    @iTotalVat       numeric (18,5) = null,
    @iTotalAmt       numeric (18,5) = null,
    @iCrePno         char    (8   ) = null,
    @iCreDate        char    (10  ) = null,
    @iModPno         char    (8   ) = null,
    @iModDate        char    (10  ) = null,
    @iStBalDate      char    (8   ) = null,
    @iAnBalDate      char    (8   ) = null,
    @iClstype        char    (6   ) = null,

-- 단위 변환 파라미터
    @iConvertUnit     varchar (2   ) = null,
    @iConvertValue    numeric (18,2) = null,
    @iGoodcd          varchar (8   ) = null,
    @returnValue      numeric(18,2)  = null,

    @TOrderItemInfo   dbo.TOrderItemInfo readonly,

    @BalNo           char    (14  ) output,
    @ErrMess         char    (100 ) output

as

 DECLARE @WCount           integer,
         @DocSource        varchar(20)

    select
           @iAccunit        = ISNULL(ltrim(rtrim(@iAccunit        )),''),
           @iFactory        = ISNULL(ltrim(rtrim(@iFactory        )),''),
           @iExportYn       = ISNULL(ltrim(rtrim(@iExportYn       )),''),
           @iBalNo          = ISNULL(ltrim(rtrim(@iBalNo          )),''),
           @iBalDate        = ISNULL(ltrim(rtrim(@iBalDate        )),''),
           @iDeptCd         = ISNULL(ltrim(rtrim(@iDeptCd         )),''),
           @iPno            = ISNULL(ltrim(rtrim(@iPno            )),''),
           @iCustCd         = ISNULL(ltrim(rtrim(@iCustCd         )),''),
           @iPaymentType    = ISNULL(ltrim(rtrim(@iPaymentType    )),''),
           @iRemarkM        = ISNULL(ltrim(rtrim(@iRemarkM        )),''),
           @ivatcd          = ISNULL(ltrim(rtrim(@ivatcd          )),''),
           @iContractNo     = ISNULL(ltrim(rtrim(@iContractNo     )),''),
           @iFileNo         = ISNULL(ltrim(rtrim(@iFileNo         )),''),
           @iTotalWeight    = ISNULL(ltrim(rtrim(@iTotalWeight    )), 0),
           @iTotalVat       = ISNULL(ltrim(rtrim(@iTotalVat       )), 0),
           @iTotalAmt       = ISNULL(ltrim(rtrim(@iTotalAmt       )), 0),
           @iAccunit        = ISNULL(ltrim(rtrim(@iAccunit        )),''),
           @iExportYn       = ISNULL(ltrim(rtrim(@iExportYn       )),''),
           @iBalNo          = ISNULL(ltrim(rtrim(@iBalNo          )),''),
           @iCrePno         = ISNULL(ltrim(rtrim(@iCrePno         )),''),
           @iCreDate        = ISNULL(ltrim(rtrim(@iCreDate        )),''),
           @iModPno         = ISNULL(ltrim(rtrim(@iModPno         )),''),
           @iModDate        = ISNULL(ltrim(rtrim(@iModDate        )),''),
           @iClstype        = ISNULL(ltrim(rtrim(@iClstype        )),'160001'),

           @DocSource       = 'OD'

         if @iTag    = 'Q'   goto select_statement
    else if @iTag    = 'I'   goto save_statement
    else if @iTag    = 'D'   goto delete_header_statement
    else if @iTag    = 'E'   goto delete_detail_statement
    else if @iTag    = 'B'   goto convert_value_statement

 return

/************************************************/
convert_value_statement:
    BEGIN
        select @returnValue =[dbo].[Fn_MaterialUnitConvert] (@iGoodcd, @iConvertUnit, @iConvertValue)
        select @returnValue as returnValue
    END

/************************************************/
select_statement:

    if @iTagSave = 'M'
    begin

        select ISNULL(a.Accunit       ,'') as Accunit         ,
               ISNULL(a.ExportYn      ,'') as ExportYn        ,
               ISNULL(a.BalNo         ,'') as BalNo           ,
               ISNULL(a.BalDate       ,'') as BalDate         ,
               ISNULL(a.DeptCd        ,'') as DeptCd          ,
               ISNULL(a.Pno           ,'') as Pno             ,
               ISNULL(a.CustCd        ,'') as CustCd          ,
               ISNULL(a.Remark        ,'') as Remark          ,
               ISNULL(a.URGENCY       ,'') as URGENCY         ,
               ISNULL(a.Vatcd         ,'') as Vatcd           ,
               ISNULL(a.ContractNo    ,'') as ContractNo      ,
               ISNULL(a.FileNo        ,'') as FileNo          ,
               ISNULL(a.TotalWeight   , 0) as TotalWeight     ,
               ISNULL(a.ToTalVat      , 0) as ToTalVat        ,
               ISNULL(a.TotalAmt      , 0) as TotalAmt        ,
               ISNULL(a.TotalVat,0) + ISNULL(a.TotalAmt,0) as TotalOkAmt,
               ISNULL(b2.KName        ,'') as PnoNm           ,
               ISNULL(b3.DeptNm       ,'') as DeptCDNm        ,
               ISNULL(b5.CustNm       ,'') as CustCdNm        ,
               ISNULL(b5.TruncNm      ,'') as TruncNm         ,
               ISNULL(b6.minornm      ,'') as URGENCYNM       ,
               ISNULL(b7.MinorNm      ,'') as VatNm           ,
               ISNULL(f1.Orderqty     , 0) as orderqty        ,
               ISNULL(pro.OrderProgressYN       ,'') as OrderProgressYN,
               ISNULL(dbo.fn_AcctApprDocProgFlag(a.BalNo, 'OD', a.Factory, a.Pno),'') ApprDocProg,
            --    case when isnull(T.DocStatus, '') = '' then '결재 · 미상신' else T.DocStatus end as DocStatus
               CASE WHEN a.BalDate >= '20230614' then case when isnull(T.DocStatus, '') = '' THEN '작성중' ELSE T.DocStatus  END else '결재대상 아님' end as DocStatus

        into #temp1
        from TOrderH a
        outer apply (
            select case when ISNULL(NotCompleteCnt, 0) = 0 and ISNULL(ProgressCnt, 0) = 0 then '완료'--'F'
                        when ISNULL(NotCompleteCnt, 0) <> 0 or ISNULL(ProgressCnt, 0) <> 0 then '미결'--'P' 
                        end as OrderProgressYN
            from (
                select SUM(case when Clstype = '160003' then 1 when Clstype = '160004' then 1 else 0 end) as CompleteCnt
                     , SUM(case when Clstype = '160001' then 1 else 0 end) as NotCompleteCnt
                     , SUM(case when Clstype = '160002' then 1 else 0 end) as ProgressCnt
                from TOrderItem
                where BalNo = a.BalNo and Factory = a.Factory
            ) complete
        ) pro
        outer apply (
            select SUM(Qty) as Orderqty
            from TOrderItem
            where Balno = a.BalNo
        ) f1
        outer apply (
        select DocStatus, ApprDocFlag
        from dbo.Fn_ksApprovalState(@DocSource, a.Balno , @iFactory, @iCrepno)
        ) as T
        left outer join TMan b2 on a.Pno = b2.Pno and a.Accunit = b2.Code
        left outer join TDept b3 on a.DeptCD = b3.DeptCd and a.Accunit = b3.Accunit
        left outer join TCust b5 on a.CustCd = b5.CustCD and a.Accunit = b5.Accunit and b5.DelStatus <> 'D'
        left outer join TMinor b6 on a.URGENCY = b6.MinorCd
        left outer join TMinor b7 on a.Vatcd = b7.MinorCd
        left outer join TMinor b8 on a.Termsofpricecd = b8.MinorCd
        where a.BalDate Between @iStBalDate and @iAnBalDate
        and a.Factory = @iFactory
        and a.Accunit = @iAccunit
        and ((@iClstype = '0') or (ISNULL(pro.OrderProgressYN,'') = case when @iClstype = '1' then '미결' when @iClstype = '2' then '완료' end))
        and ((b5.CustCD = @iCustCd) or (@iCustCd = ''))
        order by a.BalNo

        if ISNULL(@iChk_ApprDocProg, '') = 'Y'
        BEGIN
            select * from #temp1 where ApprDocProg in ('반려','작성중')
        END
        ELSE BEGIN 
            select * from #temp1
        END 

        return

    end
    else if @iTagSave = 'D'
    begin
        select ISNULL(a.Accunit     ,'') as Accunit     ,
               ISNULL(a.ExportYn    ,'') as ExportYn    ,
               ISNULL(a.BalNo       ,'') as BalNo       ,
               ISNULL(a.BalSeq      ,'') as BalSeq      ,
               ISNULL(a.GoodCd      ,'') as GoodCd      ,
               ISNULL(a.UnitCd      ,'') as UnitCd      ,
               ISNULL(a.Su          , 0) as Su          ,
               ISNULL(a.Weight      , 0) as Weight      ,
               ISNULL(a.BalQty      , 0) as BalQty      ,
               ISNULL(a.Qty         , 0) as Qty         ,
               ISNULL(a.Price       , 0) as Price       ,
               ISNULL(a.Amount      , 0) as Amount      ,
               ISNULL(a.NapDate     ,'') as NapDate     ,
               ISNULL(a.WonAmt      , 0) as WonAmt      ,
               ISNULL(a.StockUnitCd ,'') as StockUnitCd ,
               ISNULL(a.StockQty    , 0) as StockQty    ,
               ISNULL(a.ProgType    ,'') as ProgType    ,
               ISNULL(a.NapQty      , 0) as NapQty      ,
               ISNULL(a.No          ,'') as No          ,
               ISNULL(a.Remark      ,'') as Remark      ,
               ISNULL(a.Tax         , 0) as Tax         ,
               ISNULL(a.Okamt       , 0) as Okamt       ,
               ISNULL(b1.GoodNo     ,'') as GoodNo      ,
               ISNULL(b1.GoodNm     ,'') as GoodCdNm    ,
               ISNULL(a.Spec        ,'') as Spec        ,
               ISNULL(b1.Goodenm    ,'') as Goodenm     ,
               ISNULL(b2.MinorNm    ,'') as UnitCdNm    ,
               ISNULL(a.InQty       , 0) as InQty       ,
               ISNULL(a.InCnt       , 0) as InCnt       ,
               ISNULL(b1.Group10    ,'') as Priceunit   ,
               ISNULL(b1.KgPerM     , 0) as Kgperm      ,
               ISNULL(b1.GoodType   ,'') as Goodtype    ,
               ISNULL(a.Clstype     ,'') as Clstype     ,
               ISNULL(b1.Stockunit  ,'') as Stockunit   ,

               case when f.ExpType = '1' then ISNULL(i.Price   , 0) 
                    when f.ExpType = '2' then ISNULL(o.KORPRICE, 0)
               end                       as AcceptPrice   ,
               case when f.ExpType = '1' then ISNULL(i.Qty, 0) 
                    when f.ExpType = '2' then ISNULL(o.QTY, 0)
               end                       as AcceptQty     ,
               case when f.ExpType = '1' then ISNULL(i.DelvDate,'') 
                    when f.ExpType = '2' then ISNULL(o.DELVDATE,'')
               end                       as DelvdateA

        from TOrderitem a

          left outer join TGood b1 on a.GoodCd = b1.GoodCd and a.Accunit = b1.Accunit and ISNULL(b1.DelStatus,'') <> 'D'
          left outer join TMinor b2 on a.UnitCd = b2.MinorCd
          left outer join TMinor b4 on b1.color = b4.MinorCd
          left outer join TMinor m1 on b1.BoxUnit = m1.MinorCd
          left outer join TMinor m2 on b1.OutUnit = m2.MinorCd
          left outer join TMinor m3 on b1.StockUnit = m3.MinorCd
          left outer join TForReqItem_Order f on a.CtlNo = f.ForNo and a.CtlSeq = f.ForSeq and a.Factory = f.Factory
          left outer join TAcceptItem i on f.Acceptno = i.AcceptNo and f.Acceptseq = i.AcceptSeq and f.Factory = i.Factory
          left outer join TEXOFFERITEM o on f.Acceptno = o.EXOFFERNO and f.Acceptseq = o.EXOFFERSEQ and f.Accunit = o.ACCUNIT
        where a.Accunit = @iAccunit
          and a.Factory = @iFactory
          and a.BalNo = @iBalNo
    end

return

/************************************************/
save_statement:
    if (dbo.fn_AcctApprDocFlag(@iBalNo, @DocSource, @iFactory , @iPno)) <> 'A'
    begin
        set @ErrMess = '결재상신 된 자료입니다. 저장 할 수 없습니다.'
        return
    end

    IF EXISTS (
        select 1
        from TOrderH
        where @iBalDate < '20230614'
    )
    BEGIN
        set @ErrMess = '2023년 6월 14일 이전 자료는 수정할 수 없습니다.'
        return
    END

declare @wBalno VARCHAR(12), @wBalseq VARCHAR(3)
select @wBalno = balno from @TOrderItemInfo
select @wBalseq = balseq from @TOrderItemInfo
-- -- 구매입고 검사
    if (@wBalno <> '' and @wBalseq <> '')
    BEGIN
        if exists (
        select 1
        from TDelvItem delv
        inner join @TOrderItemInfo info on info.balno = delv.balno and info.BalSeq = delv.BalSerl
        WHERE info.balno = delv.balno and info.BalSeq = delv.BalSerl
        )
        begin
            select @ErrMess = '구매입고 내역이 작성된 발주자료입니다. 수정 할 수 없습니다'
            return
        end
    END

-- 날짜 유효성 검사
    if ISDATE(@iBalDate) = 0
    begin
        select @ErrMess = '발주일 입력오류'
        return
    end
    
    BEGIN TRY
        BEGIN TRAN

-- set BalNo
        if (@iBalNo is null or @iBalNo = '')
        begin

            SELECT @iBalNo = MAX(SUBSTRING(Balno,11, 2))
            FROM TOrderH
            WHERE Baldate = @iBaldate
            AND Factory = @iFactory

            if (@iBalNo is null)
            begin
                select @iBalNo = 'PO' + SUBSTRING( @iBaldate, 1, 8) + '01'
            end
            else begin
                exec SC_NextSeq   @iBalNo  output, 2

                declare @noFirstPart char(10)
                select @noFirstPart = MAX(SUBSTRING(Balno,1,10))
                FROM TOrderH
                WHERE Accunit = @iAccunit
                AND Baldate = @iBaldate
                AND Factory = @iFactory

                select @iBalNo = CONCAT(@noFirstPart, @iBalNo )

                select @BalNo = @iBalNo
            end
        end

--set FileNo
        SELECT @iFileNo = MAX(SUBSTRING(FileNo,7, 3))
        FROM TOrderH
        WHERE Factory = @iFactory
        AND SUBSTRING(Baldate,3,4) = SUBSTRING(@iBaldate,3,4)

        if (@iFileNo is null)
        begin
            select @iFileNo = 'S' + SUBSTRING( @iBaldate, 3, 4) + '-001'
        end

        else begin
            exec SC_NextSeq   @iFileNo  output, 3
            select @noFirstPart = CONCAT('S',  SUBSTRING(@iBaldate,3,4) )

            select @iFileNo = TRIM(@noFirstPart) + '-' + @iFileNo

            select @BalNo = @iBalNo
        end

        merge TOrderH as target
        using (
            select
                   @iBalno            as Balno
                 , @iBaldate          as Baldate
                 , @iAccunit          as Accunit
                 , @iFactory          as Factory
                 , @iExportyn         as Exportyn
                 , @iDeptcd           as Deptcd
                 , @iPno              as Pno
                 , @iCustcd           as Custcd
                 , @iRemarkM          as Remark
                 , @iUrgency          as Urgency
                 , @iVatcd            as Vatcd
                 , @iContractno       as Contractno
                 , @iFileNo           as Fileno
                 , @iTotalweight      as Totalweight
                 , @iTotalvat         as Totalvat
                 , @iTotalamt         as Totalamt
                 , @iModPno           as Modpno
                 , @iModDate          as Moddate
            )as source
                on target.Balno  = source.Balno and target.Factory = source.Factory and target.Accunit = source.Accunit
        when not matched then
            insert(
                  Balno
                , Baldate
                , Accunit
                , Factory
                , Exportyn
                , Deptcd
                , Pno
                , Custcd
                , Remark
                , Urgency
                , Vatcd
                , Contractno
                , Fileno
                , Totalweight
                , Totalvat
                , Totalamt
                , Crepno
                , Credate
            )
            values(
                  Balno
                , Baldate
                , Accunit
                , Factory
                , '1'
                , Deptcd
                , Pno
                , Custcd
                , Remark
                , Urgency
                , Vatcd
                , Contractno
                , Fileno
                , Totalweight
                , Totalvat
                , Totalamt
                , @iUserId
                , CAST(GETDATE() AS SMALLDATETIME)
            )
        when matched then
            update
                set
                     target.Exportyn       = source.Exportyn
                    ,target.Deptcd         = source.Deptcd
                    ,target.Pno            = source.Pno
                    ,target.Custcd         = source.Custcd
                    ,target.Remark         = source.Remark
                    ,target.Urgency        = source.Urgency
                    ,target.Vatcd          = source.Vatcd
                    ,target.Contractno     = source.Contractno
                    --,target.Fileno         = source.Fileno --230419  overwise change at every update
                    ,target.Totalweight    = source.Totalweight
                    ,target.Totalvat       = source.Totalvat
                    ,target.Totalamt       = source.Totalamt
                    ,target.Modpno         = @iUserId
                    ,target.Moddate        = CAST(GETDATE() AS SMALLDATETIME)
        ;
        declare @MaxSeq char(3)

        select @MaxSeq = MAX(Balseq)
        from TOrderItem
        where Balno = @iBalNo
        and Factory = @iFactory
        and Accunit = @iAccunit;

        merge TOrderItem as target
        using (
            select
                case
                    when ISNULL(BalNo,'') = '' and ISNULL(BalSeq,'') = '' and ISNULL(@MaxSeq,'') = ''
                         then dbo.Fn_fillzero(CAST([No] as int), 3)
                    when ISNULL(BalNo,'') = '' and ISNULL(BalSeq,'') = '' and ISNULL(@MaxSeq,'') <> ''
                         then dbo.Fn_fillzero(CAST(@MaxSeq as int) + ROW_NUMBER() over (partition by BalNo order by[No]), 3)
                    else BalSeq
                end as MakeSeq
                    ,@iBalNo as Balno
                    ,Accunit
                    ,Factory
                    ,BalSeq
                    ,@iExportyn as Exportyn
                    ,GoodCd
                    ,Spec
                    ,UnitCd
                    ,Su
                    ,Weight
                    ,Qty
                    ,Price
                    ,Amount
                    ,NapDate
                    ,WonAmt
                    ,StockUnitCd
                    ,ProgType
                    ,NapQty
                    ,No
                    ,Remark
                    ,Inqty
                    ,Incnt
                    ,CrePno
                    ,CreDate
                    ,ModPno
                    ,ModDate
                    ,Tax
                    ,Okamt
                    ,Clstype as Clstype
                    ,BalQty

            from @TOrderItemInfo
        )as source
        on target.BalNo=source.Balno and target.BalSeq=source.MakeSeq
            when not matched then
                insert (
                      Accunit
                    , Factory
                    , BalNo
                    , BalSeq
                    , No
                    , Exportyn
                    , GoodCd
                    , Spec
                    , UnitCd
                    , Su
                    , Weight
                    , Qty
                    , Price
                    , Amount
                    , NapDate
                    , WonAmt
                    , StockUnitCd
                    , StockQty
                    , ProgType
                    -- , NapQty
                    , Remark
                    , Inqty
                    , Incnt
                    , CrePno
                    , CreDate
                    , Tax
                    , Okamt
                    , Clstype
                    , BalQty
                )
                values (
                      @iAccunit
                    , source.Factory
                    , @iBalNo
                    , source.MakeSeq
                    , source.[No]
                    , '1'
                    , source.GoodCd
                    , source.Spec
                    , source.UnitCd
                    , source.Su
                    , source.Weight
                    , source.Weight
                    , source.Price
                    , source.Amount
                    , source.NapDate
                    , source.Amount
                    , source.StockUnitCd
                    , source.Weight
                    , '3' --@ProgType
                    -- , source.NapQty
                    , source.Remark
                    , 0
                    , 0
                    , @iUserId
                    , CAST(GETDATE() AS SMALLDATETIME)
                    , source.Tax
                    , source.Okamt
                    , '160001' --source.Clstype
                    , source.BalQty
                )
            when matched then
                update
                    set 
                       GoodCd          =         source.GoodCd
                     , Spec            =         source.Spec
                     , UnitCd          =         source.UnitCd
                     , Su              =         source.Su
                     , Weight          =         source.Weight
                     , Qty             =         source.Weight
                     , Price           =         source.Price
                     , Amount          =         source.Amount
                     , NapDate         =         source.NapDate
                     , WonAmt          =         source.Amount
                     , StockUnitCd     =         source.StockUnitCd
                     , StockQty        =         source.Weight
                     , [No]            =         source.No
                     , Remark          =         source.Remark
                     , ModPno          =         @iUserId
                     , ModDate         =         CAST(GETDATE() AS SMALLDATETIME)
                     , Tax             =         source.Tax
                     , Okamt           =         source.Okamt
                     , BalQty          =         source.BalQty
                    --  , Inqty           =         source.Inqty
                    --  , Incnt           =         source.Incnt
                    --  , ProgType        =         source.ProgType
                    --  ,NapQty           =         source.NapQty
                    --  ,Clstype          =         source.Clstype

        ;
        -- RAISERROR('저장 test', 16, 1)
        select @BalNo = @iBalNo

-- MAXNO와 countRow 비교
        declare @wmaxno varchar(3)
        declare @wcountrow varchar(3)

        select @wmaxno = MAX(CAST(No as int))
        from TOrderItem
        where BalNo = @iBalNo

        select @wcountrow = COUNT(*)
        from TOrderItem
        where BalNo = @iBalNo

        if @wmaxno  <> @wcountrow
        begin
            RAISERROR('저장 중 순번 오류가 발생했습니다.', 16, 1)
        end

-- No중복 확인
        if exists(
            select 1
            from TOrderItem
            where BalNo = @iBalNo
            group by [No]
            having COUNT(No) <> 1
        )
        begin
            RAISERROR('저장 중 순번 오류가 발생했습니다!', 16, 1)
        end

        COMMIT TRAN
    END TRY
    BEGIN CATCH
        set @ErrMess = ERROR_MESSAGE()
        rollback tran
    END CATCH

return
/************************************************/
delete_header_statement:
    if (dbo.fn_AcctApprDocFlag(@iBalno, @iDocSource, @iFactory , @iPno)) <> 'A'
    begin
        set @ErrMess = '결재상신 된 자료입니다. 삭제 할 수 없습니다.'
        return
    end

    declare @wpaycon varchar(8)
    select @wpaycon = BalDate from TOrderH where BalNo = @iBalNo

    if EXISTS (
        select 1
        from TOrderH
        where @wpaycon < '20230614'
    )
    BEGIN
        set @ErrMess = '2023년 6월 14일 이전 자료는 삭제할 수 없습니다.!'
        return
    END

-- 입고 내역 검사
    if exists(
        select 1
        from TDelvItem
        where Accunit = @iAccunit
        and Factory = @iFactory
        and BalNo = @iBalNo
    )
    begin
        select @ErrMess = '납품된 자료 입니다. 삭제할 수 없습니다.'
        print '납품된 자료 입니다. 삭제할 수 없습니다.'
        return
    end

    declare @Files as table (
        FileName varchar(200)
    )

    insert into @Files
    select Photo
    from TAcctPhotoWeb
    where Factory = @iFactory
        and DocSource = @iDocSource
        and DocNo = @iBalNo

    union

    select FileName
    from TAttachments
    where FileType = @iDocSource
        and FileNo = @iBalNo
    ;

    begin try
        begin tran

            delete
            from TAcctApprMasterDocSeq
            where Factory = @iFactory
            and DocSource = @iDocSource
            and DocNo = @iBalNo

            delete
            from TAcctApprMasterDoc
            where Factory = @iFactory
            and DocSource = @iDocSource
            and DocNo = @iBalNo

            delete
            from TAcctPhotoWeb
            where Factory = @iFactory
            and DocSource = @iDocSource
            and DocNo = @iBalNo

            delete
            from TAttachments
            where Factory = @iFactory
            and FileType = @iDocSource
            and FileNo = @iBalNo

            -- DELETE
            -- FROM TPreOrderItem
            -- where Balno = @iBalNo

            DELETE
            FROM TOrderItem
            WHERE Accunit = @iAccunit
                AND Balno = @iBalno

            DELETE FROM TOrderH
            WHERE Accunit = @iAccunit
                AND Balno = @iBalno

            --set @iBalno = 'deleted by DH proc'

            select FileName
            from @Files
            ;
        -- RAISERROR('삭제테스트!', 16, 1)
        commit tran
    end try
    begin catch

        set @ErrMess = ERROR_MESSAGE()
        rollback tran
    end catch
return
/************************************************/
delete_detail_statement:

    if (dbo.fn_AcctApprDocFlag(@iBalno, @iDocSource, @iFactory , @iPno)) <> 'A'
    begin
        set @ErrMess = '결재상신 된 자료입니다. 삭제 할 수 없습니다.'
        return
    end

    select @wpaycon = BalDate from TOrderH where BalNo = @iBalNo

    if EXISTS (
        select 1
        from TOrderH
        where @wpaycon < '20230614'
    )
    BEGIN
        set @ErrMess = '2023년 6월 14일 이전 자료는 삭제할 수 없습니다.!'
        return
    END

    if exists (
        select 1
        from @TOrderItemInfo info
        INNER join TDelvItem delv on info.balno = delv.balno and info.BalSeq = delv.BalSerl
        )
    begin
        select @ErrMess = '구매입고 내역이 작성된 발주자료입니다. 삭제 할 수 없습니다'
        print @ErrMess
        return
    end

    begin try

        begin tran

            delete b
            from @TOrderItemInfo a
            inner join TOrderItem b on a.Balno = b.Balno and a.Balseq = b.Balseq
            ;

            with TReSeq as (
                select Balno, Balseq
                     , dbo.Fn_FillZero(CAST(ROW_NUMBER() over (order by [No]) as int),3) as NewSeq
                from TOrderItem
                where Balno = @iBalno
            )
            update a set [No] = b.NewSeq
            from TOrderItem a
            inner join TReSeq b on a.Balno = b.Balno and a.Balseq = b.Balseq
            where a.Balno = @iBalno

-- 헤더의 합계 재계산
            DECLARE @newTotalvat numeric(18, 5);
            DECLARE @newTotalweight numeric(18, 5);
            DECLARE @newTotalamt numeric(18, 5);

            select @newTotalvat = SUM(Tax )from TOrderitem where Balno = @iBalno group by Balno
            select @newTotalweight = SUM(Weight) from TOrderItem where Balno = @iBalno group by Balno
            select @newTotalamt = SUM(Amount) from TOrderItem where Balno = @iBalno group by Balno

            update TOrderH
            set TotalVat = @newTotalvat,
                TotalWeight = @newTotalweight,
                TotalAmt = @newTotalamt
            where BalNo = @iBalno
            and Factory = @iFactory

-- MAXNO와 countRow 비교
            select @wmaxno = MAX(CAST(No as int))
            from tOrderItem
            where BalNo = @iBalNo

            select @wcountrow = COUNT(*)
            from tOrderItem
            where BalNo = @iBalNo

            if @wmaxno  <> @wcountrow
            begin
                RAISERROR('tOrderItem 저장 중 오류가 발생했습니다.', 16, 1)
            end

-- No 중복 확인
            if exists(
                select 1
                from tOrderItem
                where BalNo = @iBalNo
                group by [No]
                having COUNT(No) <> 1
            )
            begin
                RAISERROR('tOrderItem 저장 중 오류가 발생했습니다!', 16, 1)
            end

        commit tran
    end try
    begin catch
        set @ErrMess = ERROR_MESSAGE()
        rollback tran
    end catch

return
GO

