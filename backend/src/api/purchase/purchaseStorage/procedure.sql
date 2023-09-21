USE [Han_Eng_Back]
GO

/****** Object:  StoredProcedure [dbo].[SC_Delv_WEB]    Script Date: 2023-09-21 오후 4:29:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE  PROC [dbo].[SC_Delv_WEB]

    @iTag             varchar (1   ) = null,
    @iTagSave         varchar (1   ) = null,
    @iSort            varchar (1   ) = null,
    @iChk_ApprDocProg varchar (1   ) = null,      -- 결재전+반려문서만 조회
    @iCustoutcd       varchar (10  ) = null,
    @iStBalDate       varchar (8   ) = null,
    @iAnBalDate       varchar (8   ) = null,
    @iCrePno          varchar (8   ) = null,

    --Head부분
    @iAccunit         varchar (4   ) = null,
    @iFactory         varchar (10  ) = null,
    @iExportYn        varchar (1   ) = null,
    @iDelvNo          varchar (12  ) = null,
    @iDelvDate        varchar (8   ) = null,
    @iGenDate         varchar (8   ) = null,
    @iMediator        varchar (8   ) = null,
    @iDeptCD          varchar (8   ) = null,
    @iPno             varchar (20  ) = null,
    @iCustCd          varchar (20  ) = null,
    @iCurrCd          varchar (20  ) = null,
    @iExchang         numeric (15,5) = null,
    @iRemark          varchar (200 ) = null,
    @iSlipld          varchar (8   ) = null,
    @iTaxDate         varchar (8   ) = null,
    @iPayDate         varchar (8   ) = null,
    @iBlno            varchar (40  ) = null,
    @iVatcd           varchar (6   ) = null,
    @iSliptyp         varchar (1   ) = null,
    @iContractNo      varchar (20  ) = null,
    @iTotalForeign    numeric (18,5) = null,

    @iCurrdate        varchar (10  ) = null,
    @iTotalPrice      numeric (18,5) = null,      -- 공급가액
    @iTotalVat        numeric (18,5) = null,      -- 부가세
    @iTotalAmount     numeric (18,5) = null,      -- 입고총액
    @iTotalAmt        numeric (18,5) = null,
    @iiQty            numeric (18,5) = null,
    @iTotalWeight     numeric (18,5) = null,
    @iUnitPrice       numeric (18,5) = null,
    @iUnitPricew      numeric (18,5) = null,
    @iQty             numeric (15,5) = null,      -- 구매량

    @iConvertUnit     varchar (2   ) = null,
    @iConvertValue    numeric (18,2) = null,
    @iGoodcd          varchar (8   ) = null,
    @returnValue      numeric(18,2)  = null,
    @TDelvItemInfo   dbo.TDelvItemInfo readonly,

    @DelvNo           varchar (12  )   output,
    @ErrMess          varchar (100 )   output

as

    declare 
            @DocSource     varchar(20),
            @wDelvSeq      varchar(5)

    select --Head부분
           @iAccunit      = ISNULL(LTRIM(RTRIM(@iAccunit      )),'')
         , @iFactory      = ISNULL(LTRIM(RTRIM(@iFactory      )),'')
         , @iExportYn     = ISNULL(LTRIM(RTRIM(@iExportYn     )),'')
         , @iDelvNo       = ISNULL(LTRIM(RTRIM(@iDelvNo       )),'')
         , @iDelvDate     = ISNULL(LTRIM(RTRIM(@iDelvDate     )),'')
         , @iGenDate      = ISNULL(LTRIM(RTRIM(@iGenDate      )),'')
         , @iDeptCD       = ISNULL(LTRIM(RTRIM(@iDeptCD       )),'')
         , @iPno          = ISNULL(LTRIM(RTRIM(@iPno          )),'')
         , @iCustCd       = ISNULL(LTRIM(RTRIM(@iCustCd       )),'')
         , @iCurrCd       = ISNULL(LTRIM(RTRIM(@iCurrCd       )),'')
         , @iExchang      = ISNULL(LTRIM(RTRIM(@iExchang      )), 0)
         , @iRemark       = ISNULL(LTRIM(RTRIM(@iRemark       )),'')
         , @iSlipld       = ISNULL(LTRIM(RTRIM(@iSlipld       )),'')
         , @iTaxDate      = ISNULL(LTRIM(RTRIM(@iTaxDate      )),'')
         , @iPayDate      = ISNULL(LTRIM(RTRIM(@iPayDate      )),'')
         , @iBlno         = ISNULL(LTRIM(RTRIM(@iBlno         )),'')
         , @iVatcd        = ISNULL(LTRIM(RTRIM(@iVatcd        )),'')
         , @iMediator     = ISNULL(LTRIM(RTRIM(@iMediator     )),'')
         , @iSliptyp      = ISNULL(LTRIM(RTRIM(@iSliptyp      )),'')
         , @iCustoutcd    = ISNULL(LTRIM(RTRIM(@iCustoutcd    )),'')

           --수입
         , @iContractNo   = ISNULL(LTRIM(RTRIM(@iContractNo   )),'')
         , @iTotalForeign = ISNULL(LTRIM(RTRIM(@iTotalForeign )), 0)

         , @iCurrdate     = ISNULL(LTRIM(RTRIM(@iCurrdate     )),'')
         , @iTotalPrice   = ISNULL(LTRIM(RTRIM(@iTotalPrice   )), 0)
         , @iTotalVat     = ISNULL(LTRIM(RTRIM(@iTotalVat     )), 0)
         , @iTotalAmount  = ISNULL(LTRIM(RTRIM(@iTotalAmount  )), 0)
         , @iiQty         = ISNULL(LTRIM(RTRIM(@iiQty         )), 0)
         , @iTotalAmt     = ISNULL(LTRIM(RTRIM(@iTotalAmt     )), 0)
         , @iTotalWeight  = ISNULL(LTRIM(RTRIM(@iTotalWeight  )), 0)
         , @iUnitPrice    = ISNULL(LTRIM(RTRIM(@iUnitPrice    )), 0)
         , @iUnitPricew   = ISNULL(LTRIM(RTRIM(@iUnitPricew   )), 0)
         , @iQty          = ISNULL(LTRIM(RTRIM(@iQty          )), 0)
         , @iCrePno       = ISNULL(LTRIM(RTRIM(@iCrePno       )),'')


    declare @ErrorNumber       int
    declare @ErrorSeverity     int
    declare @ErrorState        int
    declare @ErrorProcedure    varchar(126)
    declare @ErrorLine         int
    declare @ErrorMessage      varchar(500)

    set @ErrorNumber    = 0
    set @ErrorSeverity  = 0
    set @ErrorState     = 0
    set @ErrorProcedure = ''
    set @ErrorLine      = 0
    set @ErrorMessage   = ''

         if @iTag    = 'Q'   goto select_statement
    else if @iTag    = 'I'   goto save_statement
    else if @iTag    = 'D'   goto header_delete_statement
    else if @iTag    = 'E'   goto detail_delete_statement
    else if @iTag    = 'B'   goto convert_value_statement

return
/**********************************************************************************************/
convert_value_statement:
    BEGIN
        SELECT @returnValue =[dbo].[Fn_MaterialUnitConvert] (@iGoodcd, @iConvertUnit, @iConvertValue)
        SELECT @returnValue AS returnValue
    END
    RETURN

/**********************************************************************************************/
select_statement:

    IF @iTagSave = 'H'
    BEGIN

        SELECT ISNULL(a.Accunit    ,'') AS Accunit  ,
               ISNULL(a.Factory    ,'') AS Factory  ,
               ISNULL(a.ExportYn   ,'') AS ExportYn ,
               ISNULL(a.DelvNo     ,'') AS DelvNo   ,
               ISNULL(a.DelvDate   ,'') AS DelvDate ,
               ISNULL(a.CustCd     ,'') AS CustCd   ,
               ISNULL(a.Exchang    , 1) AS Exchang  ,

               case ISNULL(a.Sliptyp,'') when '0' then case ISNULL(d1.slpdat,'') when '' then '구매입고'
                                                                                 else '회계처리' end
                                         when '1' then case ISNULL(d2.slpdat,'') when '' then '구매입고'
                                                                                 else '회계처리' end end
                                        as state,
               case when a.Sliptyp = '0' then a.DelvDate
                    when a.Sliptyp = '1' then CONVERT(varchar(8), DATEADD(dd, -1, DATEADD(mm, 1, SUBSTRING(a.DelvDate,1,6) + '01')),112) end as Billdate,
               ISNULL(a.TotalPrice , 0) AS TotalPrice,
               ISNULL(a.TotalVat   , 0) AS TotalVat,
               ISNULL(a.TotalAmount, 0) AS TotalAmount,
               ISNULL(a.Qty        , 0) AS Qty,
               ISNULL(c.CustNm     ,'') AS CustCdNm  ,
               ISNULL(ci.CustNm    ,'') AS CustNm    ,
               ISNULL(c.Truncnm    ,'') AS Truncnm ,
               ISNULL(b6.MinorNm   ,'') AS VatNm,
               '' as Slpdat, --ISNULL(d2.SLPDAT    ,'') as slpdat
               case when isnull(a.Sliptyp,'') = '0' then 'PO' else 'PM' end DocSource,
               ISNULL(a.Pno     ,'') as Pno,
               case
                    when isnull(a.Sliptyp,'') = '0'
                        then a.DelvNo
                        else  substring(a.delvdate,1,6) + ltrim(rtrim(a.custcd)) + rtrim(a.Vatcd)
                end DocNo,

                ISNULL(a.Gendate   ,'') AS Gendate  ,
                ISNULL(a.DeptCD    ,'') AS DeptCD   ,
                ISNULL(a.CurrCd    ,'') AS CurrCd   ,
                ISNULL(a.Remark    ,'') AS Remark   ,
                ISNULL(a.TaxDate   ,'') AS TaxDate  ,
                ISNULL(a.Blno      ,'') AS Blno     ,
                ISNULL(a.Vatcd     ,'') AS Vatcd    ,
                ISNULL(a.Sliptyp   ,'') AS Sliptyp  ,
                case ISNULL(a.Sliptyp,'') when '0' then case ISNULL(d1.slpdat,'') when '' then ''
                                                                                 else d1.slpdat + '-' + d1.slipno end
                                         when '1' then case ISNULL(d2.slpdat,'') when '' then ''
                                                                                 else d2.slpdat + '-' + d2.slipno end end
                                       as slipno,
                case ISNULL(a.Sliptyp, '') when '0' then d1.LNKCOD
                                          when '1' then d2.LNKCOD end
                                       as LNKCOD,
                --수입
               ISNULL(a.TotalForeign, 0) AS TotalForeign,
               ISNULL(a.BL_No       ,'') AS BL_No       ,
               ISNULL(a.Currdate    ,'') AS Currdate    ,
               ISNULL(a.TotalAmt    , 0) AS TotalAmt    ,
               ISNULL(a.TotalWeight , 0) AS TotalWeight ,
               ISNULL(a.UnitPrice   , 0) AS UnitPrice   ,
               ISNULL(a.UnitPricew  , 0) AS UnitPricew  ,
               ISNULL(b2.KName      ,'') AS PnoNm       ,
               ISNULL(b3.DeptNm     ,'') AS DeptCDNm    ,
               ISNULL(b4.MinorNm    ,'') AS CurrCdNm    ,
               ISNULL(b5.Taxno      ,'') AS Taxno       ,
               case when isnull(T.DocStatus  ,'') = '' then '결재 · 미상신' else T.DocStatus end as DocStatus
        into  #Temp_DelvH1
        from TDelvH a
        left outer join Acct100t d1
          on a.Accunit = d1.LOCATE and a.Factory = d1.FACTORY
         and d1.SLPDAT = a.TaxDate
         and d1.LNKCOD = a.DelvNo +  LTRIM(RTRIM(a.Factory))
         and d1.SLIPNO like '6%'
        left outer join Acct100t d2
          on a.Accunit = d2.LOCATE
         and a.Factory = d2.FACTORY
         and d2.SLPDAT = CONVERT(varchar(8), DATEADD(DD, -1, DATEADD(MM, 1, SUBSTRING(a.DelvDate,1,6)+'01')), 112)
         and SUBSTRING(d2.lnkcod,1,18) = 'PO' + SUBSTRING(a.delvdate,1,6) + LTRIM(RTRIM(a.custcd)) + SUBSTRING(a.vatcd,5,2) + @iFactory
         and d2.SLIPNO like '6%'
        left outer join TCust c on a.CustCd = c.CustCD and a.Accunit = c.Accunit
        left outer join TCust_FTA_Info ci on c.CustoutCd = ci.Custoutcd
        left outer join TMinor b6 on a.Vatcd = b6.Minorcd
        left outer join TMan b2 on a.Pno = b2.Pno and a.Accunit = b2.Code
        left outer join TDept b3 on a.DeptCD = b3.DeptCd and a.Accunit = b3.Accunit
        left outer join TMinor b4 on a.CurrCd = b4.MinorCD
        left outer join TCust b5 on a.CustCd = b5.CustCD and a.Accunit = b5.Accunit
        outer apply (
            select DocStatus, ApprDocFlag
            from dbo.Fn_ksApprovalState(case when isnull(a.Sliptyp,'') = '0' then 'PO' else 'PM' end,
                                        case when isnull(a.Sliptyp,'') = '0'
                                            then a.DelvNo else  substring(a.delvdate,1,6) + ltrim(rtrim(a.custcd)) + rtrim(a.Vatcd) end,
                                        a.Factory,
                                        @iPno)
        ) as T

        where a.DelvDate Between @iStBalDate and @iAnBalDate
        and a.Accunit = @iAccunit
        and a.Factory = @iFactory
        and ((c.CustoutCd = @iCustoutcd) or (@iCustoutcd = ''))
        and ((isnull(a.Pno,'') = isnull(@iCrePno,'')) or (isnull(@iCrePno,'') = ''))
        order by case when @iSort = '0' then a.DelvDate
                      when @iSort = '1' then a.DelvNo
                      when @iSort = '2' then c.Custnm
                      when @iSort = '3' then c.Truncnm end, a.DelvDate, a.DelvNo, c.Custnm

       -- -- 결재진행 상태값 계산
       select *,
           isnull(dbo.fn_AcctApprDocProgFlag(DocNo, DocSource, Factory, Pno),'') ApprDocProg

       into #Temp_DelvH
       from #Temp_DelvH1

       ---- 결재전+반려문서만 조회
       if isnull(@iChk_ApprDocProg,'') = 'Y'
           delete #Temp_DelvH Where ApprDocProg not in ('반려','작성중')

       -- -- 최종자료
       select * from #Temp_DelvH
       order by case when @iSort = '0' then DelvDate
                     when @iSort = '1' then DelvNo
                     when @iSort = '2' then CustCdNm
                     when @iSort = '3' then TruncNm end,
                case when @iSort = '2' then Delvdate
                     else Delvno end

    end
        ------------------------ Search Detail Proc --------------------------
    else if @iTagSave = 'D'
    begin
        select ISNULL(a.Accunit      ,'') as Accunit
             , ISNULL(a.[Guid]       ,'') as [Guid]
             , ISNULL(a.ExportYn     ,'') as ExportYn
             , ISNULL(a.DelvNo       ,'') as DelvNo
             , ISNULL(a.DelvSeq      ,'') as DelvSeq
             , ISNULL(a.GoodCD       ,'') as GoodCD
             , ISNULL(a.Div          ,'') as Div
             , ISNULL(a.Spec         ,'') as Spec
             , ISNULL(a.UnitCD       ,'') as UnitCD
             , ISNULL(a.Price        , 0) as Price
             , ISNULL(a.PriceTaxYn   ,'') as PriceTaxYn
             , case when b1.Group10 = '220001' then ISNULL(a.[Weight], 0)
                    when b1.Group10 = '220002' then ISNULL(a.Su      , 0)
                    when b1.Group10 = '220003' then ISNULL(a.Qty     , 0)
                    when b1.Group10 = ''       then ISNULL(a.Qty, 0) end
                                         as Delvqty
             , ISNULL(a.[Weight]     , 0) as [Weight]
             , ISNULL(a.Su           , 0) as Su
             , ISNULL(a.Qty          , 0) as Qty
             , ISNULL(a.InQty        , 0) as InQty
             , ISNULL(a.Amount       , 0) as Amount
             , ISNULL(a.KorAmt       , 0) as KorAmt
             , ISNULL(a.StockYn      ,'') as StockYn
             , ISNULL(a.StockQty     , 0) as StockQty
             , ISNULL(a.QcYn         ,'') as QcYn
             , ISNULL(a.QcPno        ,'') as QcPno
             , ISNULL(a.QcDate       ,'') as QcDate
             , ISNULL(a.QcQty        , 0) as QcQty
             , ISNULL(a.QcAmt        , 0) as QcAmt
             , ISNULL(a.OkQty        , 0) as OkQty
             , ISNULL(a.OkAmt        , 0) as OkAmt
             , ISNULL(a.OkKorAmt     , 0) as OkKorAmt
             , ISNULL(a.OkStdUnitQty , 0) as OkStdUnitQty
             , ISNULL(a.Tax          , 0) as Tax
             , ISNULL(a.Whcd         ,'') as Whcd
             , ISNULL(a.SttLitem     ,'') as SttLitem
             , ISNULL(a.WhCheckYn    ,'') as WhCheckYn
             , ISNULL(a.[No]         ,'') as [No]
             , ISNULL(a.Pono         ,'') as Pono
             , ISNULL(a.PoSerl       ,'') as PoSerl
             , ISNULL(a.LcSeq        ,'') as LcSeq
             , ISNULL(a.BalNo        ,'') as BalNo
             , ISNULL(a.BalSerl      ,'') as BalSerl
             , ISNULL(a.Sourcetype   ,'') as Sourcetype
             , ISNULL(a.CntlNo       ,'') as CntlNo
             , ISNULL(a.CntlSeq      ,'') as CntlSeq
             , ISNULL(a.Lotno        ,'') as Lotno
             , ISNULL(b4.TruncNm     ,'') as ToSerl
             , ISNULL(a.FormSerl     ,'') as FormSerl
             , ISNULL(a.CrePno       ,'') as CrePno
             , ISNULL(a.CreDate      ,'') as CreDate
             , ISNULL(a.ModPno       ,'') as ModPno
             , ISNULL(a.ModDate      ,'') as ModDate
             , ISNULL(c.NapQty       , 0) as NapQty
             , ISNULL(c.Qty          , 0) as BalQty
             , ISNULL(b1.GoodNo      ,'') as GoodNo
             , ISNULL(b1.GoodNm      ,'') as GoodCdNm
             , ISNULL(b5.Minornm     ,'') as color
             , ISNULL(b1.goodenm     ,'') as goodenm
             , ISNULL(b2.MinorNm     ,'') as UnitCdNm
             , ISNULL(b3.WrhNm       ,'') as WhCdNm
             , ISNULL(a.[Guid]       ,'') as [Guid]
             , ISNULL(a.Trackingno   ,'') as TrackingNo
             , ISNULL(a.OrderNo      ,'') as OrderNo
             , ISNULL(a.Ci_No        ,'') as Ci_No
             , ISNULL(a.jukyocd      ,'') as jukyocd
             , ISNULL(a7.jukyonm     ,'') as jukyonm
             , ISNULL(b1.Factory     ,'') as GFactory
             , ISNULL(b1.Goodtype    ,'') as goodtype
             , ISNULL(b1.KgPerM      , 1) as KgPerM
             , ISNULL(b1.Group10     ,'') as Priceunit
             , ISNULL(a.TwistUnit    ,'') as TwistUnit
             , ISNULL(g10.minornm    ,'') as TwistUnitNm
             , ISNULL(a.BoxUnit      ,'') as BoxUnit
             , ISNULL(g11.minornm    ,'') as BoxUnitNm
            --  , ISNULL(a.Carno        ,'') as CarNo
            --  , ISNULL(m05.MinorNm    ,'') as CarNoNm
             , ISNULL(a.Remark       ,'') as Remark
        from TDelvitem a
          left outer join TGood b1 on a.GoodCd = b1.GoodCd and a.Accunit = b1.Accunit
          left outer join TMinor b2 on a.UnitCd = b2.MinorCd
          left outer join TWh b3 on a.WhCd = b3.WrhCd and a.Accunit = b3.Accunit
          left outer join TCust b4 on a.FormSerl = b4.CustCD and a.Accunit = b4.Accunit
          left outer join TOrderitem c on a.Accunit = c.Accunit and a.factory = c.factory and a.balno = c.BalNo and a.balSerl =   c.BalSeq
          left outer join TMinor b5 on b1.color = b5.minorcd
          left outer join Acct700t a7 on a.Jukyocd = a7.jukyocd
          left outer join TMinor g10 on a.TwistUnit = g10.minorcd
          left outer join TMinor g11 on a.BoxUnit = g11.MinorCd
        --   left outer join TMinor m05 on a.Carno = m05.MinorCd
          left outer join TMinor m220 on m220.Minor = '220' and b1.Group10 = m220.Minorcd
          left outer join TMinor m307 on m307.Minor = '220' and a.Carno = m220.Minorcd
        where a.Accunit = @iAccunit
          and a.Factory  = @iFactory
          and a.ExportYn = @iExportYn
          and a.DelvNo = @iDelvNo
        order by a.[No], a.DelvSeq
    end
return

/**********************************************************************************************/
save_statement:
 --1. 결재 여부 확인
    IF (SELECT dbo.fn_AcctApprDocFlag(
       CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) END,
       CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END,
       @iFactory, @iPno)
       ) <> 'A'
    BEGIN
        SET @ErrMess = '결재 상신된 자료입니다. 저장할 수 없습니다.'
        RETURN
    END

 --2. 월 마감상태 확인
    IF EXISTS(
        SELECT 1
        FROM TCALC
        WHERE YYMM = LEFT(@iDelvDate,6) AND FLAG = 'Y'
    )
    BEGIN
        SET @ErrMess = '월마감 상태입니다. 신규입력/수정 처리 할 수 없습니다.'
        RETURN
    END

 --3. 발주자료경비처리 통해서 생성된 자료의 헤더 수정 불가
    DECLARE @wcount int = 0
    SELECT @wcount = count(*) FROM @TdelvitemInfo
    IF EXISTS(
        SELECT 1
        FROM TDelvH dh
        INNER JOIN TDelvItem di ON dh.DelvNo = di.DelvNo AND di.DelvNo = @iDelvNo
        INNER JOIN TsupplyItem si ON di.Div = si.SupNo AND dh.CustCd = si.CustCd AND di.Guid = si.DelvGuid
        AND @wcount = 0
    )
    BEGIN
        SET @ErrMess = '발주자료 경비처리 통해 생성된 구매입고 자료는 수정할 수 없습니다.'
        RETURN
    END

 --4. 날짜 형식 확인
    IF ISDATE(@iDelvDate) = 0
    BEGIN
        SET @ErrMess = '입고일자 입력 오류입니다.'
        RETURN
    END

    IF ISDATE(@iGenDate) = 0
    BEGIN
        SET @ErrMess = '작성일자 입력 오류입니다'
        RETURN
    END

    IF ISDATE(@iTaxDate) = 0
    BEGIN
        SET @ErrMess = '세금계산서일자 입력 오류입니다'
        RETURN
    END

 --5. Transaction 시작
    BEGIN TRY
        BEGIN TRAN

 --6. 발주자료경비처리 통해서 입고된 자료의 Item Update인 경우 (단위가 M인경우)
            IF EXISTS(
                SELECT 1
                FROM TDelvH dh
                INNER JOIN  @TDelvItemInfo di on dh.DelvNo = di.DelvNo and di.DelvNo = @iDelvNo 
                INNER JOIN TsupplyItem si on di.Div = si.SupNo and dh.CustCd = si.CustCd and di.Guid = si.DelvGuid AND di.BalSerl = si.BalSeq
                where di.unitcd = '064047'
                and di.DelvNo = @iDelvNo
            )
            BEGIN
                UPDATE TDelvItem
                SET  Weight         = Info.Weight
                    ,Su             = Info.Su
                    ,Qty            = Info.Qty
                    ,InQty          = Info.Qty
                    ,Amount         = Info.Amount
                    ,KorAmt         = Info.Amount
                    ,Stockqty       = Info.Qty
                    ,Okamt          = Info.Okamt
                    ,Tax            = Info.Tax
                    ,Remark	        = Info.Remark
                    ,ModPno         = @iCrePno
                    ,ModDate        = CONVERT(varchar(8), GETDATE(),112)
                    FROM @TDelvItemInfo Info
                    INNER JOIN tdelvitem di ON di.delvno = @iDelvNo AND Info.delvno = di.delvno AND Info.Delvseq = di.DelvSeq
                    -- INNER JOIN TSupplyItem si ON di.Div = si.SupNo AND di.Guid = si.DelvGuid
                    WHERE info.Unitcd = '064047'

                UPDATE h
                SET  h.TotalVat       = sii.TotalVat
                    ,h.TotalAmt       = sii.TotalAmt
                    ,h.TotalPrice     = sii.TotalAmt
                    ,h.TotalAmount    = sii.TotalAmount
                    ,h.Qty            = sii.TotalQty
                    ,h.Totalweight    = sii.TotalQty
                FROM @TDelvItemInfo Info
                INNER JOIN TDelvItem di ON info.Delvno = di.DelvNo
                INNER JOIN (
                    SELECT DelvNo, SUM(Qty) TotalQty, Round(SUM(Tax),0) TotalVat, Round(SUM(Amount),0) TotalAmt, Round(SUM(Amount) + SUM(Tax),0) TotalAmount
                    FROM TDelvItem
                    GROUP BY DelvNo
                )sii ON Info.Delvno = sii.DelvNo
                inner join TDelvH h on info.Delvno = h.DelvNo and info.Factory = h.Factory

                UPDATE TSupplyItem
                SET  Tax            = di.Tax
                    ,Amount         = di.Amount
                    ,OkAmt          = di.OkAmt
                FROM TSupplyItem a
                INNER JOIN @TDelvItemInfo info ON a.DelvGuid = info.Guid
                INNER JOIN TDelvItem di ON info.Delvno = di.DelvNo AND a.BalNo = di.BalNo AND a.BalSeq = di.BalSerl
            END

 --6-1. 발주자료경비처리 통해서 입고된 자료의 Item Update인 경우 (단위가 M이 아닌 경우)
            ELSE IF EXISTS(
                SELECT 1
                FROM TDelvH dh
                INNER JOIN @TDelvItemInfo di ON dh.DelvNo = di.DelvNo AND di.DelvNo = @iDelvNo
                INNER JOIN TsupplyItem si ON di.Div = si.SupNo AND dh.CustCd = si.CustCd AND di.Guid = si.DelvGuid
                WHERE di.unitcd <> '064047'
                AND di.DelvNo = @iDelvNo
            )
            BEGIN
                UPDATE TDelvItem
                SET
                     Remark	        = Info.Remark
                    ,ModPno         = @iCrePno
                    ,ModDate        = CONVERT(varchar(8), GETDATE(),112)
                    FROM @TDelvItemInfo Info 
                    INNER JOIN TDelvitem di ON di.delvno = @iDelvNo AND Info.delvno = di.delvno AND Info.Delvseq = di.DelvSeq
            END

 --7. 구매입고메뉴에서 직접 입고 잡는 경우
            ELSE BEGIN

 --7-1. 작성번호 생성
            IF(@iDelvNo IS NULL OR @iDelvNo ='')
                BEGIN
                    IF @iExportYn ='0'
                    BEGIN
                        SELECT @iDelvNo = MAX(SUBSTRING(DelvNo, 9, 4))
                        FROM TDelvH
                        WHERE Accunit = @iAccunit
                        AND Factory = @iFactory
                        AND ExportYn  ='0'
                        AND DelvDate LIKE SUBSTRING(@iDelvDate, 1, 6) + '%'
                    END
                    ELSE BEGIN
                        SELECT @iDelvNo = Max(SUBSTRING(DelvNo,9, 4)) FROM TDelvH
                        WHERE Accunit = @iAccunit
                        AND Factory = @iFactory
                        AND  ExportYn  IN ('1','2')
                        AND DelvDate  LIKE  SUBSTRING(@iDelvDate, 1, 6) + '%'
                    END

                    IF @iDelvNo IS null
                    BEGIN
                        IF @iExportYn ='0'
                        BEGIN
                            SELECT @iDelvNo = 'CL' + SUBSTRING(@iDelvDate, 1, 6) + '0001'
                        END
                        ELSE BEGIN
                            SELECT @iDelvNo = 'PO' +  SUBSTRING( @iDelvDate, 1, 6) + '0001'
                        END
                    END
                    ELSE BEGIN
                        EXEC SC_NextSeq @iDelvNo OUTPUT,4
                        IF  @iExportYn ='0'
                        BEGIN
                            SELECT @iDelvNo = 'CL' +  SUBSTRING( @iDelvDate, 1, 6) + @iDelvNo
                        END
                        ELSE BEGIN
                            SELECT @iDelvNo = 'PO' + SUBSTRING(@iDelvDate, 1, 6) + @iDelvNo
                        END
                    END
                END
            SET @DelvNo = @iDelvNo;

 --7-2. TDelvH 처리
            MERGE TDelvH AS T
            USING ( SELECT @iAccunit AS accunit
                          ,@iFactory AS Factory
                          ,@iDelvNo  AS DelvNo
            ) as Info
            ON T.Accunit  = Info.Accunit AND T.Factory = Info.Factory AND T.DelvNo  = Info.DelvNo
            WHEN MATCHED THEN
                UPDATE
                    SET
                         T. ExportYn             = @iExportYn
                        ,T. Gendate              = @iGendate
                        ,T. DeptCD               = @iDeptCD
                        ,T. Pno                  = @iPno
                        ,T. CustCd               = @iCustCd
                        ,T. CurrCd               = @iCurrCd
                        ,T. Exchang              = @iExchang
                        ,T. Remark               = @iRemark
                        ,T. TaxDate              = @iTaxDate
                        ,T. Vatcd                = @iVatcd
                        ,T. TotalForeign         = @iTotalForeign
                        ,T. Currdate             = @iCurrdate
                        ,T. TotalVat             = @iTotalVat
                        ,T. TotalAmt             = @iTotalAmt
                        ,T. TotalWeight          = @iTotalWeight
                        ,T. Unitprice            = @iUnitprice
                        ,T. Unitpricew           = @iUnitpricew
                        ,T. Sliptyp              = @iSliptyp
                        ,T. TotalPrice           = @iTotalPrice
                        ,T. TotalAmount          = @iTotalAmount
                        ,T. Qty                  = @iQty
            WHEN NOT MATCHED THEN
                INSERT (  Accunit
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
                VALUES (  @iAccunit
                         ,@iFactory
                         ,@iExportYn
                         ,@iDelvNo
                         ,@iDelvDate
                         ,@iGendate
                         ,@iDeptCD
                         ,@iPno
                         ,@iCustCd
                         ,@iCurrCd
                         ,@iExchang
                         ,@iRemark
                         ,@iTaxDate
                         ,@iVatcd
                         ,@iTotalForeign
                         ,@iCurrdate
                         ,@iTotalVat
                         ,@iTotalAmt
                         ,@iTotalWeight
                         ,@iUnitprice
                         ,@iUnitpricew
                         ,@iSliptyp
                         ,@iTotalPrice
                         ,@iTotalAmount
                         ,@iQty
                );

 --7-3. TDelvItem 처리

            DECLARE @MaxSeq char(3)
            SELECT @MaxSeq = MAX(Delvseq)
            FROM TDelvItem
            WHERE Factory    = @iFactory
            AND Accunit    = @iAccunit
            AND DelvNo     = @iDelvNo;

            MERGE TDelvItem AS T
            USING (
              SELECT
                  CASE
                      WHEN ISNULL(DelvNo,'') = '' AND ISNULL(DelvSeq,'') = '' AND ISNULL(@MaxSeq,'') = ''
                          THEN FORMAT(CAST([No] AS int), '000')
                      WHEN ISNULL(DelvNo,'') = '' AND ISNULL(DelvSeq,'') = '' AND ISNULL(@MaxSeq,'') <>''
                          THEN FORMAT(CAST(@MaxSeq AS int) + ROW_NUMBER() OVER (partition by DelvNo order by[No]), '000')
                      ELSE DelvSeq
                  END AS MakeSeq,

                  @iDelvNo AS DelvNo,
                  @iFactory AS Factory,
                  Accunit,
                  REPLACE(SUBSTRING(CONVERT(VARCHAR(40),NEWID()),2,15), '-',SUBSTRING(CAST(RAND()*10000 AS CHAR(8)),3,1)) AS NewGuid,
                  Exportyn,
                  Guid,
                  Goodcd,
                  Spec,
                  Unitcd,
                  Price,
                  Div,
                  Weight,
                  Su,
                  Qty,
                  Okamt,
                  InQty,
                  Amount,
                  KorAmt,
                  Stockyn,
                  Stockqty,
                  Tax,
                  Whcd,
                  No,
                  Balno,
                  Balserl,
                  Sourcetype,
                  Jukyocd,
                  Boxunit,
                  Remark
                --   ,CarNo
              FROM @TDelvItemInfo
            )AS Info --source

            ON T.DelvNo = Info.DelvNo AND T.DelvSeq = Info.MakeSeq AND T.Factory = Info.Factory AND T.Guid = Info.Guid

            WHEN MATCHED THEN
                UPDATE
                    SET
                        --,Exportyn	    = Info.Exportyn
                         Goodcd         = Info.Goodcd
                        ,Spec           = Info.Spec
                        ,Unitcd         = Info.Unitcd
                        ,Price          = Info.Price
                        ,Div            = Info.Div
                        ,Weight         = Info.Weight
                        ,Su             = Info.Su
                        ,Qty            = Info.Qty
                        ,InQty          = Info.Qty
                        ,Amount         = Info.Amount
                        ,KorAmt         = Info.Amount
                        ,Stockyn        = Info.Stockyn
                        ,Stockqty       = Info.Qty
                        ,Okamt          = Info.Okamt
                        ,Tax            = Info.Tax
                        ,Whcd           = Info.Whcd
                        ,No             = Info.No
                        ,Balno          = Info.Balno
                        ,Balserl        = Info.Balserl
                        ,Sourcetype     = Info.Sourcetype
                        ,Jukyocd        = Info.Jukyocd
                        ,Boxunit        = Info.Boxunit
                        ,Remark	        = Info.Remark
                        -- ,CarNo	        = Info.CarNo
                        ,ModPno         = @iCrePno
                        ,ModDate        = CONVERT(varchar(8), GETDATE(),112)

            WHEN NOT MATCHED THEN
                INSERT (
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
                        -- ,CarNo
                        ,CrePno
                        ,CreDate
                )
                VALUES (
                         @iDelvNo
                        ,Info.MakeSeq
                        ,@iFactory
                        ,@iAccunit
                        ,Info.NewGuid
                        ,@iExportYn
                        ,Info.Goodcd
                        ,Info.Spec
                        ,Info.Unitcd
                        ,Info.Price
                        ,Info.Div
                        ,Info.Weight
                        ,Info.Su
                        ,Info.Qty
                        ,Info.Qty
                        ,Info.Amount
                        ,Info.Amount
                        ,Info.Stockyn
                        ,Info.Qty
                        ,Info.Okamt
                        ,Info.Tax
                        ,Info.Whcd
                        ,Info.No
                        ,Info.Balno
                        ,Info.Balserl
                        ,Info.Sourcetype
                        ,Info.Jukyocd
                        ,Info.Boxunit
                        ,Info.Remark
                        -- ,Info.CarNo
                        ,@iCrePno
                        ,CONVERT(varchar(8), GETDATE(),112)
                );

 --7-4. MaxNo와 CountRow 비교
                DECLARE @wmaxno varchar(3)
                DECLARE @wcountrow varchar(3)

                SELECT @wmaxno = MAX(CAST(No as int))
                FROM TDelvItem
                WHERE Delvno = @iDelvNo

                SELECT @wcountrow = COUNT(*)
                FROM TDelvItem
                WHERE Delvno = @iDelvNo

                IF @wmaxno  <> @wcountrow
                BEGIN
                    RAISERROR('저장 중 오류가 발생했습니다.', 16, 1)
                END

 --7-5. 중복 No확인
                IF EXISTS(
                    SELECT 1
                    FROM TDelvItem
                    WHERE Delvno = @iDelvNo
                    GROUP BY [No]
                    HAVING COUNT(No) <> 1
                )
                BEGIN
                    RAISERROR('저장 중 오류가 발생했습니다!', 16, 1)
                END
            END -- else begin 문 끝

 --8. 디버깅
            -- select 'item',* from TDelvItem where DelvNo = @iDelvNo
            -- select 'header', * from TDelvH where DelvNo = @iDelvNo
            -- select 'supplyitem',si.* from TSupplyItem si
            -- inner join tdelvitem di on di.DelvNo = @idelvno and si.SupNo = di.Div and si.BalSeq = di.BalSerl
            -- RAISERROR('무조건 에러발생시켜서 롤백 시켜요 save', 16, 1)
        COMMIT tran
    end try
    begin catch

        set @ErrMess = ERROR_MESSAGE()
        rollback tran

    end catch
    set @DelvNo = @iDelvNo
return

/**********************************************************************************************/
header_delete_statement:

-- 1. 월 마감상태 확인
    if EXISTS (
        SELECT 1
        FROM TDelvH a
        INNER JOIN TCALC c on SUBSTRING(DelvNo,3,6) = c.YYMM
        WHERE DelvNo = @iDelvno
        AND FLAG = 'Y'
    )
    BEGIN
        SET @ErrMess = '월마감 상태입니다. 삭제 처리 할 수 없습니다.'
        RETURN
    END

-- 2. 결재 여부 확인
    IF (SELECT dbo.fn_AcctApprDocFlag(
        CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end,
        CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END,
        @iFactory, @iPno)
        ) <> 'A'

    BEGIN
        SET @ErrMess = '결재 상신된 자료입니다. 삭제할 수 없습니다.'
        RETURN
    END

    BEGIN TRY
        BEGIN TRAN

-- 3. 폴더에있는 첨부파일 삭제를 위한 임시테이블 선언
            DECLARE @Files AS TABLE (
                FileName varchar(200)
            )

-- 4. 건별인지 월별인지 변수에 값 넣음
            DECLARE @Sliptyp varchar(1)
            SELECT @Sliptyp = ISNULL(Sliptyp ,'') -- 전표처리구분이 '0'(건별) 삭제가능
            FROM TDelvH
            WHERE DelvNo = @iDelvNo

-- 4-1. TSupplyItem의 Qty중량에 맞게 금액 계산 (중량을 바꿨을 수 있으니깐)
            IF EXISTS (
                SELECT 1
                FROM TSupplyItem a
                INNER JOIN TDelvH dh ON dh.DelvNo = @iDelvNo
                INNER JOIN TDelvItem di ON di.DelvNo = @iDelvNo AND di.Guid = a.DelvGuid
                WHERE a.UnitCd = '064047'
            )
            BEGIN
                UPDATE a SET 
                    Amount  = Round(a.Qty * a.Price, 0)
                    ,Tax    = ROUND(a.Qty * a.Price * 0.1, 0)
                    ,OkAmt  = ROUND(a.Qty * a.Price * 1.1, 0)
                FROM TSupplyItem a
                INNER JOIN TDelvH dh ON dh.DelvNo = @iDelvNo
                INNER JOIN TDelvItem di ON di.DelvNo = @iDelvNo AND di.Guid = a.DelvGuid
            END

-- 4-2. TSupplyItem테이블의 DelvGuid컬럼 업데이트
            Update a SET DelvGuid = ''
            FROM TSupplyItem a
            INNER JOIN TDelvH dh ON dh.DelvNo = @iDelvNo
            INNER JOIN TDelvItem di ON di.DelvNo = @iDelvNo AND di.Guid = a.DelvGuid

-- 4-3. TPMS_Prodin테이블의 DelvGuid컬럼 업데이트
            Update a SET Delv_Guid = ''
            FROM TPMS_Prodin a
            INNER JOIN TDelvH dh ON dh.DelvNo = @iDelvNo
            INNER JOIN TDelvItem di ON di.DelvNo = @iDelvNo AND di.Guid = a.Delv_Guid

-- 5. TDelvItem 테이블 삭제
            DELETE FROM TDelvItem
            WHERE Delvno = @iDelvNo
            AND Factory = @iFactory
            AND Accunit = @iAccunit

-- 6. TDelvH 테이블 삭제
            DELETE FROM TDelvH
            WHERE Accunit = @iAccunit
            AND Factory   = @iFactory
            AND DelvNo    = @iDelvNo

-- 7. TAcctApprMasterDocSeq, TAcctApprMasterDoc, TAcctPhotoWeb, TAttachments 테이블들의 관련자료 모두 삭제
            IF NOT EXISTS (
                SELECT 1
                FROM TDelvH
                WHERE substring(DelvDate,1,6) = substring(@iDelvDate,1,6)
                AND CustCd = @iCustCd
                AND Vatcd = @iVatcd
                AND Sliptyp = '1'
            ) OR (ISNULL(@Sliptyp,'') = '0')
            BEGIN

-- 7-1. 임시테이블에 첨부파일 이름 저장
                INSERT INTO @Files
                SELECT Photo
                FROM TAcctPhotoWeb
                WHERE Factory = @iFactory
                    AND DocSource = CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END
                    AND DocNo = CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                UNION

                SELECT FileName
                FROM TAttachments
                WHERE FileType = CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END
                    AND FileNo = CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end
                ;

                DELETE FROM TAcctApprMasterDocSeq
                WHERE Factory = @iFactory
                AND DocSource = CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END
                AND DocNo = CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                DELETE FROM TAcctApprMasterDoc
                WHERE Factory = @iFactory
                AND DocSource = CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END
                AND DocNo = CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                DELETE FROM TAcctPhotoWeb
                WHERE Factory = @iFactory
                AND DocSource = CASE WHEN isnull(@iSliptyp,'') = '0' THEN 'PO' ELSE 'PM' END
                AND DocNo = CASE WHEN isnull(@iSliptyp,'') = '0' THEN @iDelvNo ELSE substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                DELETE FROM TAttachments
                WHERE Factory = @iFactory
                and FileType = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                and FileNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end
            end

            set @DelvNo = @iDelvNo

--7-2. 첨부파일이름 반환
            select FileName
            from @Files

            -- select '@iDelvNo', @iDelvNo
            
            -- RAISERROR('무조건 에러발생시켜서 롤백 시켜요delete header', 16, 1)
        commit tran
    end try

    begin catch
        set @ErrMess = ERROR_MESSAGE()
        rollback tran
    end catch
return

/**********************************************************************************************/
detail_delete_statement:

 -- 1. 월마감 확인
    if exists (
        select 1
        from @TDelvItemInfo a
        inner join TCALC c on SUBSTRING(DelvNo,3,6) = c.YYMM
        where c.FLAG = 'Y'
    )
    begin
        set @ErrMess = '월마감 상태입니다. 삭제 처리 할 수 없습니다.'
        return
    end


 -- 2. 결재 여부 확인
    if (select dbo.fn_AcctApprDocFlag(
        case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end,
        case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end,
        @iFactory, @iPno)
        ) <> 'A'

    begin
        set @ErrMess = '결재상신 된 자료입니다. 삭제할 수 없습니다.'
        return
    end

 -- 2-1. 발주자료경비처리 통해 입고된 자료인지 확인
    if exists (
        select 1
        from @TDelvItemInfo a
        inner join TDelvItem b on a.Delvno = b.DelvNo and a.Delvseq = b.DelvSeq
        inner join TSupplyItem c on a.Guid = c.DelvGuid
        where isnull(b.Div, '') <> '' 
    )
    begin
        set @ErrMess = '발주자료 경비처리를 통해서 생성된 구매입고 자료는 개별 삭제할 수 없습니다.'
        return
    end

 -- 3. transaction 시작
    begin try
        begin tran

 -- 3-1. TDelvItem 테이블 삭제 시작
            delete b
            from @TDelvItemInfo a
            inner join TDelvItem b on a.Delvno = b.Delvno and a.Delvseq = b.Delvseq

            ; with TReSeq as (
                select DelvNo, Delvseq, FORMAT(CAST(ROW_NUMBER() over (order by [No]) as int), '000') as NewSeq
                from TDelvItem
                where Delvno = @iDelvNo
            )

 -- 3-2 No 필드 순번 정렬 
            update a set No = b.NewSeq
            from TDelvItem a
            inner join TReSeq b on a.Delvno = b.Delvno and a.Delvseq = b.Delvseq
            where a.Delvno = @iDelvNo

 -- 4. TSupplyItem테이블의 DelvGuid컬럼 업데이트
            UPDATE a set DelvGuid = ''
            from TSupplyItem a
            left JOIN @TDelvItemInfo c on c.Guid = a.DelvGuid
            WHERE a.DelvGuid = c.Guid

 -- 5. MaxNo와 CountRow가 같은지 확인
            select @wmaxno = MAX(CAST(No as int))
            from TDelvItem
            where Delvno = @iDelvNo

            select @wcountrow = COUNT(*)
            from TDelvItem
            where Delvno = @iDelvNo

            if @wmaxno  <> @wcountrow
            begin
                RAISERROR('삭제 중 오류가 발생했습니다.!!', 16, 1)
            end

 -- 6. 중복 No확인
            if exists(
                select 1
                from TDelvItem
                where Delvno = @iDelvNo
                group by [No]
                having COUNT(No) <> 1
            )
            begin
                RAISERROR('삭제 중 오류가 발생했습니다!', 16, 1)
            end

 -- 7. Update Header Sum
            declare @newTotalprice numeric(18, 5)
            declare @newTotalvat numeric(18, 5)
            declare @newTotalAmount numeric(18, 5)
            declare @newQty numeric(18, 5)
            declare @newWeight numeric(18, 5)

            select @newTotalprice = SUM(Amount) from TDelvItem where Delvno = @iDelvNo group by Delvno
            select @newTotalvat = SUM(Tax) from TDelvItem where Delvno = @iDelvNo group by Delvno
            select @newTotalAmount = SUM(OkAmt) from TDelvItem where Delvno = @iDelvNo group by Delvno
            select @newQty = SUM(Qty) from TDelvItem where Delvno = @iDelvNo group by Delvno
            select @newWeight = SUM(Weight) from TDelvItem where Delvno = @iDelvNo group by Delvno

            update TDelvH set Totalprice = @newTotalprice,
                              TotalVat = @newTotalvat,
                              TotalAmount = @newTotalAmount,
                              TotalAmt = @newTotalprice,
                              Qty = @newQty,
                              Totalweight = @newWeight
            where DelvNo = @iDelvNo

            set @DelvNo = @iDelvNo

            -- select 'after', * from TDelvItem where Delvno = @iDelvNo
            -- RAISERROR('무조건 에러발생시켜서 롤백 시켜요 delete item', 16, 1)

        commit tran

        set @DelvNo = @iDelvNo

    end try
    begin catch

        set @ErrMess = ERROR_MESSAGE()
        rollback tran

    end catch

return
GO

