USE [KSBack]
GO

/****** Object:  StoredProcedure [dbo].[SC_Delv_WEB]    Script Date: 2023-05-06 오후 5:27:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[SC_Delv_WEB]

    @iTag             varchar (1   ) = null,
    @iTagSave         varchar (1   ) = null,
    @iSort            varchar (1   ) = null,
    @iChk_ApprDocProg varchar (1   ) = null,      -- 결재전+반려문서만 조회
    @iCustoutcd       varchar (10  ) = null,

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
    @iCustCd_Dir      Varchar (20  ) = null,
    @iReqDate         varchar (8   ) = null,
	@iProjectNo       Varchar (50  ) = null,
	@iProjectCustCd   varchar (5   ) = null,
	@iActNo           Varchar (8   ) = null,
    --수입- Head
    @iContractNo      varchar (20  ) = null,
    @iFileNo          varchar (20  ) = null,
    @iLc_No           varchar (20  ) = null,
    @iTotalForeign    numeric (18,5) = null,
    @iBL_No           varchar (20  ) = null,

    @iCurrdate        varchar (10  ) = null,
    @iTotalPrice      numeric (18,5) = null,      -- 공급가액
    @iTotalVat        numeric (18,5) = null,          -- 부가세
    @iTotalAmount     numeric (18,5) = null,    -- 입고총액
    @iTotalAmt        numeric (18,5) = null,
    @iiQty            numeric (18,5) = null,
    @iTotalWeight     numeric (18,5) = null,
    @iUnitPrice       numeric (18,5) = null,
    @iUnitPricew      numeric (18,5) = null,

    --수입끝- Head


    --item부분
    @iGuid            varchar (15  ) = null,
    @iDelvSeq         varchar (4   ) = null,
    @iGoodCD          varchar (8   ) = null,
    @iSpec            varchar (50  ) = null,
    @iDiv             varchar (50  ) = null,
    @iUnitCD          varchar (8   ) = null,
    @iPrice           numeric (15,5) = null,
    @iPriceTaxYn      varchar (1   ) = null,   -- 단가부가세여부
    @iWeight          numeric (15,5) = null,
    @iSu              numeric (15,5) = null,
    @iQty             numeric (15,5) = null,   -- 구매량
    @iInQty           numeric (15,5) = null,   -- 입고중량
    @iAmount          numeric (15,5) = null,
    @iKorAmt          numeric (15,5) = null,
    @iStockYn         varchar (1   ) = null,
    @iStockQty        numeric (15,5) = null,
    @iQcYn            varchar (1   ) = null,
    @iQcPno           varchar (8   ) = null,
    @iQcDate          varchar (8   ) = null,
    @iQcQty           numeric (15,5) = null,
    @iQcAmt           numeric (15,5) = null,
    @iOkQty           numeric (15,5) = null,
    @iOkAmt           numeric (15,5) = null,
    @iOkKorAmt        numeric (15,5) = null,
    @iOkStdUnitQty    numeric (15,5) = null,
    @iTax             numeric (15,5) = null,
    @iWhcd            varchar (8   ) = null,
    @iSttLitem        varchar (8   ) = null,
    @iWhCheckYn       varchar (1   ) = null,
    @iNo              varchar (3   ) = null,
    @iPono            varchar (12  ) = null,
    @iPoSerl          varchar (4   ) = null,
    @iLcNo            varchar (12  ) = null,
    @iLcSeq           varchar (4   ) = null,
    @iBalNo           varchar (14  ) = null,
    @iBalSerl         varchar (4   ) = null,
    @iSourceType      varchar (1   ) = null,
    @iCntlNo          varchar (20  ) = null,
    @iCntlSeq         varchar (4   ) = null,
    @iLotno           varchar (20  ) = null,
    @iToSerl          varchar (20  ) = null,
    @iFormSerl        varchar (20  ) = null,
    @iCrePno          varchar (8   ) = null,
    @iCreDate         varchar (10  ) = null,
    @iModPno          varchar (8   ) = null,
    @iModDate         varchar (10  ) = null,
    @iStBalDate       varchar (8   ) = null,
    @iAnBalDate       varchar (8   ) = null,
    @iTrackingNo      varchar (50  ) = null,
    @iOrderNo         varchar (20  ) = null,
    @iCi_No           varchar (20  ) = null,
    @iJukyocd         varchar (4   ) = null,
    @iTwistUnit       varchar (6   ) = null,
    @iBoxUnit         varchar (6   ) = null,
    @iCarno           varchar (6   ) = null,
	@iBalQty          numeric (15,5) = null,
    @iActgoodcd       varchar (8   ) = null,
    @iPriceunit       varchar (6   ) = null,
    @iUnitweight      numeric (15,5) = null,
    @iForeignamt      numeric (18,0) = null,
    @iBomchecksort    varchar (10  ) = null,

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
         , @iCustCd_Dir   = ISNULL(LTRIM(RTRIM(@iCustCd_Dir   )),'')
         , @iReqDate      = ISNULL(LTRIM(RTRIM(@iReqDate      )),'')
         , @iProjectNo    = ISNULL(LTRIM(RTRIM(@iProjectNo    )),'')
	     , @iProjectCustCd= ISNULL(LTRIM(RTRIM(@iProjectCustCd)),'')
         , @iActNo        = ISNULL(LTRIM(RTRIM(@iActNo        )),'')

           --수입
         , @iContractNo   = ISNULL(LTRIM(RTRIM(@iContractNo   )),'')
         , @iFileNo       = ISNULL(LTRIM(RTRIM(@iFileNo       )),'')
         , @iLc_No        = ISNULL(LTRIM(RTRIM(@iLc_No        )),'')
         , @iTotalForeign = ISNULL(LTRIM(RTRIM(@iTotalForeign )), 0)
         , @iBL_No        = ISNULL(LTRIM(RTRIM(@iBL_No        )),'')

         , @iCurrdate     = ISNULL(LTRIM(RTRIM(@iCurrdate     )),'')
         , @iTotalPrice   = ISNULL(LTRIM(RTRIM(@iTotalPrice   )), 0)
         , @iTotalVat     = ISNULL(LTRIM(RTRIM(@iTotalVat     )), 0)
         , @iTotalAmount  = ISNULL(LTRIM(RTRIM(@iTotalAmount  )), 0)
         , @iiQty         = ISNULL(LTRIM(RTRIM(@iiQty         )), 0)
         , @iTotalAmt     = ISNULL(LTRIM(RTRIM(@iTotalAmt     )), 0)
         , @iTotalWeight  = ISNULL(LTRIM(RTRIM(@iTotalWeight  )), 0)
         , @iUnitPrice    = ISNULL(LTRIM(RTRIM(@iUnitPrice    )), 0)
         , @iUnitPricew   = ISNULL(LTRIM(RTRIM(@iUnitPricew   )), 0)

           --수입

           --Item부분
         , @iDelvSeq      = ISNULL(LTRIM(RTRIM(@iDelvSeq      )),'')
         , @iGoodCD       = ISNULL(LTRIM(RTRIM(@iGoodCD       )),'')
         , @iSpec         = ISNULL(LTRIM(RTRIM(@iSpec         )),'')
         , @iDiv          = ISNULL(LTRIM(RTRIM(@iDiv          )),'')
         , @iUnitCD       = ISNULL(LTRIM(RTRIM(@iUnitCD       )),'')
         , @iPrice        = ISNULL(LTRIM(RTRIM(@iPrice        )), 0)
         , @iPriceTaxYn   = ISNULL(LTRIM(RTRIM(@iPriceTaxYn   )),'')
         , @iWeight       = ISNULL(LTRIM(RTRIM(@iWeight       )), 0)
         , @iSu           = ISNULL(LTRIM(RTRIM(@iSu           )), 0)
         , @iQty          = ISNULL(LTRIM(RTRIM(@iQty          )), 0)
         , @iInQty        = ISNULL(LTRIM(RTRIM(@iInQty        )), 0)
         , @iAmount       = ISNULL(LTRIM(RTRIM(@iAmount       )), 0)
         , @iKorAmt       = ISNULL(LTRIM(RTRIM(@iKorAmt       )), 0)
         , @iStockYn      = ISNULL(LTRIM(RTRIM(@iStockYn      )),'')
         , @iStockQty     = ISNULL(LTRIM(RTRIM(@iStockQty     )), 0)
         , @iQcYn         = ISNULL(LTRIM(RTRIM(@iQcYn         )),'')
         , @iQcPno        = ISNULL(LTRIM(RTRIM(@iQcPno        )),'')
         , @iQcDate       = ISNULL(LTRIM(RTRIM(@iQcDate       )),'')
         , @iQcQty        = ISNULL(LTRIM(RTRIM(@iQcQty        )), 0)
         , @iQcAmt        = ISNULL(LTRIM(RTRIM(@iQcAmt        )), 0)
         , @iOkQty        = ISNULL(LTRIM(RTRIM(@iOkQty        )), 0)
         , @iOkAmt        = ISNULL(LTRIM(RTRIM(@iOkAmt        )), 0)
         , @iOkKorAmt     = ISNULL(LTRIM(RTRIM(@iOkKorAmt     )), 0)
         , @iOkStdUnitQty = ISNULL(LTRIM(RTRIM(@iOkStdUnitQty )), 0)
         , @iTax          = ISNULL(LTRIM(RTRIM(@iTax          )), 0)
         , @iWhcd         = ISNULL(LTRIM(RTRIM(@iWhcd         )),'')
         , @iSttLitem     = ISNULL(LTRIM(RTRIM(@iSttLitem     )),'')
         , @iWhCheckYn    = ISNULL(LTRIM(RTRIM(@iWhCheckYn    )),'')
         , @iNo           = ISNULL(LTRIM(RTRIM(@iNo           )),'')
         , @iPono         = ISNULL(LTRIM(RTRIM(@iPono         )),'')
         , @iPoSerl       = ISNULL(LTRIM(RTRIM(@iPoSerl       )),'')
         , @iLcNo         = ISNULL(LTRIM(RTRIM(@iLcNo         )),'')
         , @iLcSeq        = ISNULL(LTRIM(RTRIM(@iLcSeq        )),'')
         , @iBalNo        = ISNULL(LTRIM(RTRIM(@iBalNo        )),'')
         , @iBalSerl      = ISNULL(LTRIM(RTRIM(@iBalSerl      )),'')
         , @iSourceType   = ISNULL(LTRIM(RTRIM(@iSourceType   )),'')
         , @iCntlNo       = ISNULL(LTRIM(RTRIM(@iCntlNo       )),'')
         , @iCntlSeq      = ISNULL(LTRIM(RTRIM(@iCntlSeq      )),'')
         , @iLotno        = ISNULL(LTRIM(RTRIM(@iLotno        )),'')
         , @iToSerl       = ISNULL(LTRIM(RTRIM(@iToSerl       )),'')
         , @iFormSerl     = ISNULL(LTRIM(RTRIM(@iFormSerl     )),'')
         , @iCrePno       = ISNULL(LTRIM(RTRIM(@iCrePno       )),'')
         , @iCreDate      = ISNULL(LTRIM(RTRIM(@iCreDate      )),'')
         , @iModPno       = ISNULL(LTRIM(RTRIM(@iModPno       )),'')
         , @iModDate      = ISNULL(LTRIM(RTRIM(@iModDate      )),'')
         , @iTrackingNo   = ISNULL(LTRIM(RTRIM(@iTrackingNo   )),'')
         , @iOrderNo      = ISNULL(LTRIM(RTRIM(@iOrderNo      )),'')
         , @iCi_No        = ISNULL(LTRIM(RTRIM(@iCi_No        )),'')
         , @iJukyocd      = ISNULL(LTRIM(RTRIM(@iJukyocd      )),'')
         , @iTwistUnit    = ISNULL(LTRIM(RTRIM(@iTwistUnit    )),'')
         , @iBoxUnit      = ISNULL(LTRIM(RTRIM(@iBoxUnit      )),'')
         , @iCarno        = ISNULL(LTRIM(RTRIM(@iCarno        )),'')
         , @iActgoodcd    = ISNULL(LTRIM(RTRIM(@iActgoodcd    )),'')
         , @iPriceunit    = ISNULL(LTRIM(RTRIM(@iPriceunit    )),'')
         , @iUnitweight   = ISNULL(LTRIM(RTRIM(@iUnitweight   )), 0)
         , @iForeignamt   = ISNULL(LTRIM(RTRIM(@iForeignamt   )), 0)
         , @iBomchecksort = ISNULL(LTRIM(RTRIM(@iBomchecksort )),'')
         , @DocSource = ''

    declare @wNapQty   numeric(15,5)    -- 납품량(입고)
    declare @wBalQty   numeric(15,5)    -- 발주량(발주)
   
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

return
/**********************************************************************************************/
select_statement:

    if @iTagSave = 'H'
    begin

        select ISNULL(a.Accunit    ,'') as Accunit  ,
               ISNULL(a.Factory    ,'') as Factory  ,
               ISNULL(a.ExportYn   ,'') as ExportYn ,
               ISNULL(a.DelvNo     ,'') as DelvNo   ,
               ISNULL(a.DelvDate   ,'') as DelvDate ,
               ISNULL(a.CustCd     ,'') as CustCd   ,
               ISNULL(a.Exchang    , 1) as Exchang  ,

               case ISNULL(a.Sliptyp,'') when '0' then case ISNULL(d1.slpdat,'') when '' then '구매입고'
                                                                                 else '회계처리' end
                                         when '1' then case ISNULL(d2.slpdat,'') when '' then '구매입고'
                                                                                 else '회계처리' end end
                                        as state,
               case when a.Sliptyp = '0' then a.DelvDate
                    when a.Sliptyp = '1' then CONVERT(varchar(8), DATEADD(dd, -1, DATEADD(mm, 1, SUBSTRING(a.DelvDate,1,6) + '01')),112) end as Billdate,
               ISNULL(a.TotalPrice , 0) as TotalPrice,
               ISNULL(a.TotalVat   , 0) as TotalVat,
               ISNULL(a.TotalAmount, 0) as TotalAmount,
               ISNULL(a.Qty        , 0) as Qty,
               ISNULL(a.FileNo     ,'') as FileNo   ,
               ISNULL(a.ProjectNo  ,'') as ProjectNo,
               ISNULL(a.ActNo      ,'') as ActNo,
               ISNULL(c.CustNm     ,'') as CustCdNm  ,
               ISNULL(ci.CustNm    ,'') as CustNm    ,
               ISNULL(c.Truncnm    ,'') as Truncnm ,
               ISNULL(b6.MinorNm   ,'') as VatNm,
               ISNULL(b7.Custcd    ,'') as ProjectCustCd   ,
               ISNULL(b7.Custnm    ,'') as ProjectCustNm   ,
               '' as Slpdat, --ISNULL(d2.SLPDAT    ,'') as slpdat
               case when isnull(a.Sliptyp,'') = '0' then 'PO' else 'PM' end DocSource,
               ISNULL(a.Pno     ,'') as Pno,
               case
                    when isnull(a.Sliptyp,'') = '0'
                        then a.DelvNo
                        else  substring(a.delvdate,1,6) + ltrim(rtrim(a.custcd)) + rtrim(a.Vatcd)
                end DocNo,                              
                ISNULL(a.Gendate   ,'') as Gendate  ,
                ISNULL(a.DeptCD    ,'') as DeptCD   ,
                ISNULL(a.CurrCd    ,'') as CurrCd   ,
                ISNULL(a.Remark    ,'') as Remark   ,
                ISNULL(a.Slipld    ,'') as Slipld   ,
                ISNULL(a.TaxDate   ,'') as TaxDate  ,
                ISNULL(a.PayDate   ,'') as PayDate  ,
                ISNULL(a.Blno      ,'') as Blno     ,
                ISNULL(a.Vatcd     ,'') as Vatcd    ,
                ISNULL(a.Mediator  ,'') as Mediator ,
                ISNULL(a.Sliptyp   ,'') as Sliptyp  ,
                case ISNULL(a.Sliptyp,'') when '0' then case ISNULL(d1.slpdat,'') when '' then ''
                                                                                 else d1.slpdat + '-' + d1.slipno end
                                         when '1' then case ISNULL(d2.slpdat,'') when '' then ''
                                                                                 else d2.slpdat + '-' + d2.slipno end end
                                       as slipno,
                case ISNULL(a.Sliptyp, '') when '0' then d1.LNKCOD
                                          when '1' then d2.LNKCOD end
                                       as LNKCOD,
                --수입
               ISNULL(a.ContractNo  ,'') as ContractNo  ,
               ISNULL(a.LCNo        ,'') as Lc_no       ,
               ISNULL(a.TotalForeign, 0) as TotalForeign,
               ISNULL(a.BL_No       ,'') as BL_No       ,
               ISNULL(a.Currdate    ,'') as Currdate    ,
               ISNULL(a.TotalAmt    , 0) as TotalAmt    ,
               ISNULL(a.TotalWeight , 0) as TotalWeight ,
               ISNULL(a.UnitPrice   , 0) as UnitPrice   ,
               ISNULL(a.UnitPricew  , 0) as UnitPricew  ,
               ISNULL(a.Custcd_dir  ,'') as Custcd_dir  ,
               ISNULL(c1.Custnm     ,'') as Custnm_dir  ,
               ISNULL(a.ReqDate     ,'') as ReqDate     ,
               ISNULL(b2.KName      ,'') as PnoNm       ,
               ISNULL(b3.DeptNm     ,'') as DeptCDNm    ,
               ISNULL(b4.MinorNm    ,'') as CurrCdNm    ,
               ISNULL(b5.Taxno      ,'') as Taxno       ,
               ISNULL(c2.shopnm     ,'') as Mediatornm  ,
               case when isnull(T.DocStatus  ,'') = '' then '결재 · 미상신' else T.DocStatus end as DocStatus,
               case when ISNULL(T.ApprDocProg,'') = '' then '작성중' else ISNULL(T.ApprDocProg,'') end as ApprDocProg
               --,
               --ISNULL(T.ApprDocFlag,'') as ApprDocFlag  ,
               --case when @iChk_ApprDocProg = 'Y' and ISNULL(T.DocStatus,'') = '작성중' then 'Y'
               --     when @iChk_ApprDocProg = 'Y' and ISNULL(T.DocStatus,'') = '반려'   then 'Y' else 'N' end
        --into  #Temp_DelvH1
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
        left outer join TCust b7 on a.ProjectCustCd = b7.CustCD
        left outer join TCust c1 on a.Custcd_dir = c1.Custcd
        left outer join TMan b2 on a.Pno = b2.Pno and a.Accunit = b2.Code
        left outer join TDept b3 on a.DeptCD = b3.DeptCd and a.Accunit = b3.Accunit
        left outer join TMinor b4 on a.CurrCd = b4.MinorCD
        left outer join TCust b5 on a.CustCd = b5.CustCD and a.Accunit = b5.Accunit
        left outer join TShop c2 on a.Mediator = c2.Shopcd and a.accunit  = c2.accunit

        outer apply (
            select DocStatus, ApprDocFlag, ApprDocProg
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
        and case when @iChk_ApprDocProg = 'Y' and ISNULL(T.ApprDocProg,'') = ''       then 'Y'
                 when @iChk_ApprDocProg = 'Y' and ISNULL(T.ApprDocProg,'') = '작성중' then 'Y'
                 when @iChk_ApprDocProg = 'Y' and ISNULL(T.ApprDocProg,'') = '반려'   then 'Y' else 'N' end = @iChk_ApprDocProg
        order by case when @iSort = '0' then a.DelvDate
                      when @iSort = '1' then a.DelvNo
                      when @iSort = '2' then c.Custnm
                      when @iSort = '3' then c.Truncnm
                      when @iSort = '4' then a.Fileno end, a.DelvDate, a.DelvNo, c.Custnm, a.Fileno

        --select * from #Temp_DelvH1 return

       -- -- 결재진행 상태값 계산
       -- select *,
       --     isnull(dbo.fn_AcctApprDocProgFlag(DocNo, DocSource, Factory, Pno),'') ApprDocProg

       -- into #Temp_DelvH
       -- from #Temp_DelvH1

       ---- 결재전+반려문서만 조회
       -- if isnull(@iChk_ApprDocProg,'') = 'Y'
       --     delete #Temp_DelvH Where ApprDocProg not in ('반려','작성중')

       -- -- 최종자료
       -- select * from #Temp_DelvH
       -- order by case when @iSort = '0' then DelvDate
       --               when @iSort = '1' then DelvNo
       --               when @iSort = '2' then CustCdNm
       --               when @iSort = '3' then TruncNm
       --               when @iSort = '4' then FileNo  end,
       --          case when @iSort = '2' then Delvdate
       --               else Delvno end

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
             , case when a.Priceunit = '220001' then ISNULL(a.[Weight], 0)
                    when a.Priceunit = '220002' then ISNULL(a.Su      , 0)
                    when a.Priceunit = '220003' then ISNULL(a.Qty     , 0)
                    when a.Priceunit = ''       then ISNULL(a.Qty, 0) end
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
             , ISNULL(a.Whcd         ,'') as Whcd          --창고
             , ISNULL(a.SttLitem     ,'') as SttLitem
             , ISNULL(a.WhCheckYn    ,'') as WhCheckYn
             , ISNULL(a.[No]         ,'') as [No]
             , ISNULL(a.Pono         ,'') as Pono
             , ISNULL(a.PoSerl       ,'') as PoSerl
             , ISNULL(a.LcNo         ,'') as LcNo
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
             , 0                          as GWeight
             , ISNULL(b1.KgPerM      , 1) as KgPerM
             --, case when ISNULL(b1.Group10,'') = '' then '220003'
             --       else ISNULL(b1.Group10,'') end
             --                             as PriceUnit
             , ISNULL(a.Priceunit    ,'') as Priceunit
             , ISNULL(m220.Minornm   ,'') as Priceunitnm
             , ISNULL(a.TwistUnit    ,'') as TwistUnit
             , ISNULL(g10.minornm    ,'') as TwistUnitNm
             , ISNULL(a.BoxUnit      ,'') as BoxUnit
             , ISNULL(g11.minornm    ,'') as BoxUnitNm
             , ISNULL(a.Carno        ,'') as Carno
             , ISNULL(m05.MinorNm    ,'') as Carnonm
             , ISNULL(a.Actno        ,'') as Actno
             , ISNULL(a.Actgoodcd    ,'') as Actgoodcd
             , ISNULL(g.Goodno       ,'') as Actgoodno
             , ISNULL(a.Unitweight   , 0) as Unitweight
             , ISNULL(a.ForeignAmt   , 0) as ForeignAmt
             , ISNULL(a.Remark       ,'') as Remark
             , ISNULL(a.Bomchecksort ,'') as Bomchecksort
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
          left outer join TMinor m05 on a.Carno = m05.MinorCd
          left outer join TGood g on a.Actgoodcd = g.Goodcd
          left outer join TMinor m220 on m220.Minor = '220' and a.Priceunit = m220.Minorcd
        where a.Accunit = @iAccunit
          and a.Factory  = @iFactory
          and a.ExportYn = @iExportYn
          and a.DelvNo = @iDelvNo
        order by a.[No], a.DelvSeq
    end
return

/**********************************************************************************************/
save_statement:
------------------------결재 여부 확인----------------------------------
    if (select dbo.fn_AcctApprDocFlag(
       case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end,
       case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end,
       @iFactory, @iPno)
       ) <> 'A'
    begin
        set @ErrMess = '결재 상신된 자료입니다. 저장할 수 없습니다.'
        return
    end

    --set @iDelvDate = '20221231'
    if exists(
        select 1
        from TCALC
        where YYMM = LEFT(@iDelvDate,6) and FLAG = 'Y'
    )
    begin
        set @ErrMess = '월마감 상태입니다. 신규입력/수정 처리 할 수 없습니다.'
        return
    end
-------------------------------------------------------------------------
    if ISDATE(@iDelvDate) = 0
    begin
        set @ErrMess = '입고일자 입력 오류입니다.'
        return
    end

    if ISDATE(@iGenDate) = 0
    begin
        set @ErrMess = '작성일자 입력 오류입니다'
        return
    end

    if ISDATE(@iTaxDate) = 0
    begin
        set @ErrMess = '세금계산서일자 입력 오류입니다'
        return
    end
-------------------------------------------------------------------------
------------------------공정 여부 확인 시작------------------------------
--    Header 자료 수정시 공정재고자료 유무에 따라 Header 자료 수정 유무 체크
    if not exists ( -- Update Header
        select Delvno
        from @TDelvItemInfo
    )
    begin
        if exists (
                select 1
                from TDelvH h
                inner join TDelvItem i on h.DelvNo = i.Delvno and h.Factory = i.Factory
                inner join TGood g on i.Goodcd = g.Goodcd
                outer apply (
                    select SUM(a.Qty) as ProcessDelvQty
                    from TKsProcessStockRecord a
                    left outer join TGood g on a.Goodcd = g.Goodcd
                    left outer join TGood ig on a.AlterGoodcd = ig.Goodcd
                    where a.RecordEntry = 'PURCHASE'
                    and a.SourceNo = i.Delvno and a.SourceSeq = i.Delvseq
                ) process
                where h.DelvNo = @iDelvNo and
                    ISNULL(ProcessDelvQty, 0) > 0
        )
        begin
            set @ErrMess = '공정재고 라벨 발행 자료는 수정 할 수 없습니다.'
            return
        end
    end

    if exists ( -- Update Items
        select Delvno
        from @TDelvItemInfo
    )
    begin
        if exists (
            select 1
            from TDelvH h
            inner join @TDelvItemInfo i on h.DelvNo = i.Delvno and h.Factory = i.Factory
            inner join TGood g on i.Goodcd = g.Goodcd
            outer apply (
                select SUM(a.Qty) as ProcessDelvQty
                from TKsProcessStockRecord a
                left outer join TGood g on a.Goodcd = g.Goodcd
                left outer join TGood ig on a.AlterGoodcd = ig.Goodcd
                where a.RecordEntry = 'PURCHASE'
                and a.SourceNo = i.Delvno and a.SourceSeq = i.Delvseq
            ) process
            where h.DelvNo = i.Delvno and i.Delvseq = i.Delvseq and ISNULL(ProcessDelvQty, 0) > 0
        )
        begin
            set @ErrMess = '공정재고 라벨 발행 자료는 수정 할 수 없습니다.'
            return
        end
------------------------Div 필드의 값 여부확인 시작-----------------------
        if exists(
            select 1
            from TDelvItem a
            inner join @TDelvItemInfo i on a.Delvno = i.Delvno
            and a.Delvseq = i.Delvseq
            and a.Qty <> i.Qty
            where a.Div <> ''
        )
        begin
            set @ErrMess = '발주업체 실적 등록 자료입니다. 입고 수량을 수정 할 수 없습니다.'
            return
        end

    end
------------------------Div 필드의 값 여부확인 끝-------------------------
------------------------공정 여부 확인 끝--------------------------------

    begin try
        begin tran
------------------------작성번호만들기-----------------------------------
            if(@iDelvNo is null or @iDelvNo ='')
            begin
                if @iExportYn ='0'
                begin
                    select @iDelvNo = MAX(SUBSTRING(DelvNo, 9, 4))
                    from TDelvH
                    where Accunit = @iAccunit
                    AND Factory = @iFactory
                    AND ExportYn  ='0'
                    AND DelvDate Like SUBSTRING(@iDelvDate, 1, 6) + '%'
                end
                else begin
                    select @iDelvNo = Max(SUBSTRING(DelvNo,9, 4)) from TDelvH
                    where Accunit = @iAccunit
                    and Factory = @iFactory
                    and  ExportYn  in ('1','2')
                    and DelvDate  Like  SUBSTRING(@iDelvDate, 1, 6) + '%'
                end

                if @iDelvNo is null
                begin
                    if @iExportYn ='0'
                    begin
                        select @iDelvNo = 'CL' + SUBSTRING(@iDelvDate, 1, 6) + '0001'
                    end
                    else begin
                        select @iDelvNo = 'PO' +  SUBSTRING( @iDelvDate, 1, 6) + '0001'
                    end
                end
                else begin
                    exec SC_NextSeq @iDelvNo output,4
                    if  @iExportYn ='0'
                    begin
                        select @iDelvNo = 'CL' +  SUBSTRING( @iDelvDate, 1, 6) + @iDelvNo
                    end
                    else begin
                        select @iDelvNo = 'PO' + SUBSTRING(@iDelvDate, 1, 6) + @iDelvNo
                    end
                end
            end

            set @DelvNo = @iDelvNo;
------------------------------------------------------------------
----------------------TDelvH 처리---------------------------------

            merge TDelvH as T
            using ( select @iAccunit as accunit
                          ,@iFactory as Factory
                          ,@iDelvNo  as DelvNo
            ) as Info
            on T.Accunit  = Info.Accunit
            and T.Factory = Info.Factory
            and T.DelvNo  = Info.DelvNo
            when matched then
                update
                    set
                        
                         T. ExportYn             = @iExportYn
                        ,T. Gendate              = @iGendate
                        ,T. DeptCD               = @iDeptCD
                        ,T. Pno                  = @iPno
                        ,T. CustCd               = @iCustCd
                        ,T. CurrCd               = @iCurrCd
                        ,T. Exchang              = @iExchang
                        ,T. ProjectNo            = @iProjectNo
                        ,T. ProjectCustCd        = @iProjectCustCd
                        ,T. ActNo                = @iActNo
                        ,T. Remark               = @iRemark
                        ,T. TaxDate              = @iTaxDate
                        ,T. Vatcd                = @iVatcd
                        ,T. TotalForeign         = @iTotalForeign
                        ,T. BL_No                = @iBL_No
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
                   
            when not matched then
                insert (  Accunit
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
                         ,ProjectNo
                         ,ProjectCustCd
                         ,ActNo
                         ,Remark
                         ,TaxDate
                         ,Vatcd
                         ,TotalForeign
                         ,BL_No
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
                values (  @iAccunit
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
                         ,@iProjectNo
                         ,@iProjectCustCd
                         ,@iActNo
                         ,@iRemark
                         ,@iTaxDate
                         ,@iVatcd
                         ,@iTotalForeign
                         ,@iBL_No
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
----------------------TDelvItem 처리---------------------------------

            declare @MaxSeq char(3)
            select @MaxSeq = MAX(Delvseq)
            from TDelvItem
            where Factory    = @iFactory
            and Accunit    = @iAccunit
            and DelvNo     = @iDelvNo;

            merge TDelvItem as T -- Target
            using (
              select
                  case
                      when ISNULL(DelvNo,'') = '' and ISNULL(DelvSeq,'') = '' and ISNULL(@MaxSeq,'') = ''
                          then FORMAT(CAST([No] as int), '000')
                      when ISNULL(DelvNo,'') = '' and ISNULL(DelvSeq,'') = '' and ISNULL(@MaxSeq,'') <>''
                          then FORMAT(CAST(@MaxSeq as int) + ROW_NUMBER() over (partition by DelvNo order by[No]), '000')
                      else DelvSeq
                  end as MakeSeq,

                  @iDelvNo as DelvNo,
                  @iFactory as Factory,
                  Accunit,
                  REPLACE(SUBSTRING(CONVERT(VARCHAR(40),NEWID()),2,15), '-',SUBSTRING(CAST(RAND()*10000 AS CHAR(8)),3,1)) as	NewGuid,
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
                  Projectno,
                  Projectcustcd,
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
                  Priceunit,
                  Unitweight,
                  Actno,
                  Actgoodcd,
                  Remark,
                  Distributecost,
                  Bomchecksort,
                  ForeignAmt
              from @TDelvItemInfo
            )as Info --source

            on T.DelvNo = Info.DelvNo and T.DelvSeq = Info.MakeSeq and T.Factory = Info.Factory and T.Guid = Info.Guid

            when matched then
                update
                    set
                         
                         Goodcd         = Info.Goodcd
                        ,Spec           = Info.Spec
                        ,Unitcd         = Info.Unitcd
                        ,Price          = Info.Price
                        ,Div            = Info.Div
                        ,Weight         = Info.Weight
                        ,Su             = Info.Su
                        ,Qty            = Info.Qty
                        ,InQty          = Info.InQty
                        ,Amount         = Info.Amount
                        ,KorAmt         = Info.Amount
                        ,Stockyn        = Info.Stockyn
                        ,Stockqty       = Info.Stockqty
                        ,Okamt          = Info.Okamt
                        ,Tax            = Info.Tax
                        ,Whcd           = Info.Whcd
                        ,No             = Info.No
                        ,Balno          = Info.Balno
                        ,Balserl        = Info.Balserl
                        ,Sourcetype     = Info.Sourcetype
                        ,Jukyocd        = Info.Jukyocd
                        ,Boxunit        = Info.Boxunit
                        ,Priceunit      = Info.Priceunit
                        ,Unitweight     = Info.Unitweight
                        ,Actno          = Info.Actno
                        ,Actgoodcd      = Info.Actgoodcd
                        ,Projectno      = Info.Projectno
                        ,Projectcustcd  = Info.projectcustcd
                        ,Remark	        = Info.Remark
                        ,Bomchecksort	= Info.Bomchecksort
                        ,ForeignAmt     = Info.ForeignAmt
                        ,ModPno         = @iCrePno
                        ,ModDate        = CONVERT(varchar(8), GETDATE(),112)

            when not matched then
                insert (
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
                        ,Priceunit
                        ,Unitweight
                        ,Actno
                        ,Actgoodcd
                        ,Projectno
                        ,Projectcustcd
                        ,Remark
                        ,Distributecost
                        ,Bomchecksort
                        ,ForeignAmt
                        ,CrePno
                        ,CreDate
                )
                values (
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
                        ,Info.InQty
                        ,Info.Amount
                        ,Info.Amount
                        ,Info.Stockyn
                        ,Info.Stockqty
                        ,Info.Okamt
                        ,Info.Tax
                        ,Info.Whcd
                        ,Info.No
                        ,Info.Balno
                        ,Info.Balserl
                        ,Info.Sourcetype
                        ,Info.Jukyocd
                        ,Info.Boxunit
                        ,Info.Priceunit
                        ,Info.Unitweight
                        ,Info.Actno
                        ,Info.Actgoodcd
                        ,Info.ProjectNo
                        ,Info.ProjectCustCd
                        ,Info.Remark
                        ,Info.Distributecost
                        ,Info.Bomchecksort
                        ,Info.ForeignAmt
                        ,@iCrePno
                        ,CONVERT(varchar(8), GETDATE(),112)
                );
------------------------------------------------------------------MaxNo와 CountRow 비교
            declare @wmaxno varchar(3)
            declare @wcountrow varchar(3)

            select @wmaxno = MAX(CAST(No as int))
            from TDelvItem
            where Delvno = @iDelvNo

            select @wcountrow = COUNT(*)
            from TDelvItem
            where Delvno = @iDelvNo

            if @wmaxno  <> @wcountrow
            begin
                RAISERROR('저장 중 오류가 발생했습니다.', 16, 1)
            end
------------------------------------------------------------------중복 No확인
            if exists(
                select 1
                from TDelvItem
                where Delvno = @iDelvNo
                group by [No]
                having COUNT(No) <> 1
            )
            begin
                RAISERROR('저장 중 오류가 발생했습니다!', 16, 1)
            end

            --select '자료확인', * from TDelvItem where Delvno = @iDelvNo
            --RAISERROR('무조건 에러발생시켜서 롤백 시켜요 save', 16, 1)

        commit tran
    end try
    begin catch

        set @ErrMess = ERROR_MESSAGE()
        rollback tran

    end catch
    set @DelvNo = @iDelvNo
return

/**********************************************************************************************/
header_delete_statement:

------------------------결재 여부 확인-----------------------
    if (select dbo.fn_AcctApprDocFlag(
        case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end,
        case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end,
        @iFactory, @iPno)
        ) <> 'A'

    begin
        set @ErrMess = '결재 상신된 자료입니다. 삭제할 수 없습니다.'
        return
    end

    --set @iDelvno = 'PO2022120001'
    if exists (
        select 1
        from TDelvH a
        inner join TCALC c on SUBSTRING(DelvNo,3,6) = c.YYMM
        where DelvNo = @iDelvno
        and FLAG = 'Y'
    )
    begin
        set @ErrMess = '월마감 상태입니다. 삭제 처리 할 수 없습니다.'
        return
    end

-------------------------------------------------------------
------------------------공정 여부 확인-----------------------
    if exists (
        select 1
        from TDelvH h
        inner join TDelvItem i on h.DelvNo = i.Delvno and h.Factory = i.Factory
        inner join TGood g on i.Goodcd = g.Goodcd
        outer apply (
            select SUM(a.Qty) as ProcessDelvQty
            from TKsProcessStockRecord a
            left outer join TGood g on a.Goodcd = g.Goodcd
            left outer join TGood ig on a.AlterGoodcd = ig.Goodcd
            where a.RecordEntry = 'PURCHASE' and a.SourceNo = i.Delvno and a.SourceSeq = i.Delvseq
        ) process
        where h.DelvNo = @iDelvNo and
            --i.Delvseq = i.Delvseq and
            ISNULL(ProcessDelvQty, 0) > 0
    )
    begin
        set @ErrMess = '공정재고 라벨 발행 자료는 삭제 할 수 없습니다.'
        return
    end
----------------------------------------------------------------
    begin try

        begin tran
    
            declare @Files as table (
                FileName varchar(200)
            )

            declare @Sliptyp varchar(1)
            select @Sliptyp = ISNULL(Sliptyp ,'')
            from TDelvH
            where DelvNo = @iDelvNo

            --    외주업체실적등록자료
            update b set Delv_Guid = ''
            from TDelvItem a
            inner join TPMS_ProdIn b on a.[Guid] = b.Delv_Guid
            where a.Delvno = @iDelvNo
            and a.Factory = @iFactory
            and a.Accunit = @iAccunit

            --   발주업체실적등록자료
            update b set Delv_Guid = ''
            from TDelvItem a
            inner join TOrderProdin b on a.[Guid] = b.Delv_Guid
            where a.Delvno = @iDelvNo
            and a.Factory = @iFactory
            and a.Accunit = @iAccunit

            delete from TDelvItem
            where Delvno = @iDelvNo
            and Factory = @iFactory
            and Accunit = @iAccunit

            delete from TDelvH
            where Accunit = @iAccunit
            and Factory   = @iFactory
            and DelvNo    = @iDelvNo

            if not exists (
                select 1
                from TDelvH
                where substring(DelvDate,1,6) = substring(@iDelvDate,1,6)
                and CustCd = @iCustCd
                and Vatcd = @iVatcd
                and Sliptyp = '1'
            ) OR (ISNULL(@Sliptyp,'') = '0')
            begin

                insert into @Files
                select Photo
                from TAcctPhotoWeb
                where Factory = @iFactory
                    and DocSource = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                    and DocNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                union

                select FileName
                from TAttachments
                where FileType = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                    and FileNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end
                ;

                delete from TAcctApprMasterDocSeq
                where Factory = @iFactory
                and DocSource = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                and DocNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                delete from TAcctApprMasterDoc
                where Factory = @iFactory
                and DocSource = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                and DocNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                delete from TAcctPhotoWeb
                where Factory = @iFactory
                and DocSource = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                and DocNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end

                delete from TAttachments
                where Factory = @iFactory
                and FileType = case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end
                and FileNo = case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end
            end

            set @DelvNo = @iDelvNo

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

    if exists (
        select 1
        from @TDelvItemInfo a
        inner join TOrderProdin b on a.[Guid] = b.Delv_Guid
    )
    begin

        select @ErrMess = '발주업체 실적 등록 자료입니다. 품목명세자료를 삭제 할 수 없습니다.'
        print @ErrMess
        return

    end

    if exists (
        select 1
        from @TDelvItemInfo a
        inner join TPMS_ProdIn b on a.[Guid] = b.Delv_Guid
    )
    begin

        select @ErrMess = '외주업체 실적 등록 자료입니다. 품목명세자료를 삭제 할 수 없습니다.'
        print @ErrMess
        return

    end


------------------------결재 여부 확인-----------------------
    if (select dbo.fn_AcctApprDocFlag(
        case when isnull(@iSliptyp,'') = '0' then @iDelvNo else  substring(@iDelvDate,1,6) + ltrim(rtrim(@iCustCd)) + rtrim(@iVatcd) end,
        case when isnull(@iSliptyp,'') = '0' then 'PO' else 'PM' end,
        @iFactory, @iPno)
        ) <> 'A'

    begin
        set @ErrMess = '결재상신 된 자료입니다. 삭제할 수 없습니다.'
        return
    end
-------------------------------------------------------------
------------------------공정 여부 확인-----------------------


    if exists (
            select 1
            from TDelvH h
            inner join @TDelvItemInfo i on h.DelvNo = i.Delvno and h.Factory = i.Factory
            inner join TGood g on i.Goodcd = g.Goodcd
            outer apply (
                select SUM(a.Qty) as ProcessDelvQty
                from TKsProcessStockRecord a
                left outer join TGood g on a.Goodcd = g.Goodcd
                left outer join TGood ig on a.AlterGoodcd = ig.Goodcd
                where a.RecordEntry = 'PURCHASE'
                and a.SourceNo = i.Delvno and a.SourceSeq = i.Delvseq
            ) process
            where h.DelvNo = i.DelvNo and i.Delvseq = i.Delvseq and ISNULL(ProcessDelvQty, 0) > 0
    )
    begin
        set @ErrMess = '공정재고 라벨 발행 자료는 삭제 할 수 없습니다.'
        return
    end
-------------------------------------------------------------

    begin try
        
        begin tran

            delete b
            from @TDelvItemInfo a
            inner join TDelvItem b on a.Delvno = b.Delvno and a.Delvseq = b.Delvseq

            ; with TReSeq as (
                select DelvNo, Delvseq, FORMAT(CAST(ROW_NUMBER() over (order by [No]) as int), '000') as NewSeq
                from TDelvItem
                where Delvno = @iDelvNo
            )

            update a set No = b.NewSeq
            from TDelvItem a
            inner join TReSeq b on a.Delvno = b.Delvno and a.Delvseq = b.Delvseq
            where a.Delvno = @iDelvNo

------------------------------------------------------------------MaxNo와 CountRow 비교
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
------------------------------------------------------------------중복 No확인
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

----------------------------------------------------------------
------------------------Update Header Sum-----------------------
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
----------------------------------------------------------------

            set @DelvNo = @iDelvNo

            -- select 'after', * from TDelvItem where Delvno = @iDelvNo
            --RAISERROR('무조건 에러발생시켜서 롤백 시켜요 delete item', 16, 1)

        commit tran

        set @DelvNo = @iDelvNo

    end try
    begin catch

        set @ErrMess = ERROR_MESSAGE()
        rollback tran

    end catch

return
GO

