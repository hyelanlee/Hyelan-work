import * as helper from '@components/common/helper/CodeClass';

export class CodeHelper {
  constructor() {
    // 공장
    this.helperFactory = { ...helper.Default };
    this.helperFactory.iInCode2 = '90175';

    // 계정과목
    this.helperActcode = { ...helper.Default };
    this.helperActcode.iInId = 'D005';
    this.helperActcode.iInCode1 = '001';

    // 거래처
    this.helperCust = { ...helper.Cust };
    this.helperCust.iAccunit = '001';

    // 거래처명
    this.helperExpenseCust = { ...helper.Cust };
    this.helperExpenseCust.iAccunit = '001';

    // 재고자산
    this.helperGoodType = { ...helper.Default };
    this.helperGoodType.iInId = 'A001';
    this.helperGoodType.iInCode1 = '055';

    // 국가코드
    this.helperNacode = { ...helper.Default };
    this.helperNacode.iInId = 'A001';
    this.helperNacode.iInCode1 = '018';

    // 통화
    this.helperCurrNm = { ...helper.Default };
    this.helperCurrNm.iInId = 'A001';
    this.helperCurrNm.iInCode1 = '057';

    // 투입단위
    this.helperProdunitnm = { ...helper.Default };
    this.helperProdunitnm.iInId = 'A001';
    this.helperProdunitnm.iInCode1 = '064';

    // 증빙종류
    this.helperProtypeNm = { ...helper.Default };
    this.helperProtypeNm.iInId = 'A001';
    this.helperProtypeNm.iInCode1 = '099';

    // 증빙종류
    this.helperGoodCdNm = { ...helper.Default };
    this.helperGoodCdNm.iInId = 'A001';
    this.helperGoodCdNm.iInCode1 = '사업장코드';
    this.helperGoodCdNm.iInCode2 = '공장코드';
    this.helperGoodCdNm.iInCode3 = '품번';

    //발주단위
    this.helperUnitCdNm = { ...helper.Default };
    this.helperUnitCdNm.iInId = 'A001';
    this.helperUnitCdNm.iInCode1 = '064';

    this.helperInvGubun = { ...helper.Default };
    this.helperInvGubun.iInId = 'A001';
    this.helperInvGubun.iInCode1 = '265';

    //단가단위 - Priceunitnm
    this.helperPriceunitnm = { ...helper.Default };
    this.helperPriceunitnm.iInId = 'A001';
    this.helperPriceunitnm.iInCode1 = '220';

    // 단가단위
    this.helperPriceUnit = { ...helper.Default };
    this.helperPriceUnit.iInId = 'A001';
    this.helperPriceUnit.iInCode1 = '220';

    //통관차수-ClearanceDegreenm
    this.helperClearanceDegreeNm = { ...helper.Default };
    this.helperClearanceDegreeNm.iInId = 'A001';
    this.helperClearanceDegreeNm.iInCode1 = '142';

    //공제여부
    this.helperSubtractcd = { ...helper.Default };
    this.helperSubtractcd.iInId = 'A001';
    this.helperSubtractcd.iInCode1 = '252';

    // 계산서구분
    this.helperVatNm = { ...helper.Default };
    this.helperVatNm.iInId = 'A001';
    this.helperVatNm.iInCode1 = '103';

    // 계산서종류
    this.helperVatTypeNm = { ...helper.Default };
    this.helperVatTypeNm.iInId = 'A0014';
    this.helperVatTypeNm.iInCode1 = '103';

    // 은행
    this.helperBankNm = { ...helper.Default };
    this.helperBankNm.iInId = 'A001';
    this.helperBankNm.iInCode1 = '106';

    // 발주구분
    this.helperURGENCYNM = { ...helper.Default };
    this.helperURGENCYNM.iInId = 'A001';
    this.helperURGENCYNM.iInCode1 = '130';

    // 송장상태
    this.helperExInvStGubun = { ...helper.Default };
    this.helperExInvStGubun.iInId = 'A001';
    this.helperExInvStGubun.iInCode1 = '144';

    // 선적항
    this.helperLoadport = { ...helper.Default };
    this.helperLoadport.iInId = 'A001';
    this.helperLoadport.iInCode1 = '145';

    // 도착항
    this.helperArrivalport = { ...helper.Default };
    this.helperArrivalport.iInId = 'A001';
    this.helperArrivalport.iInCode1 = '146';

    // 선적방법
    this.helperLoadType = { ...helper.Default };
    this.helperLoadType.iInId = 'A001';
    this.helperLoadType.iInCode1 = '147';

    // 인도장소
    this.helperDelivSpot = { ...helper.Default };
    this.helperDelivSpot.iInId = 'A001';
    this.helperDelivSpot.iInCode1 = '150';

    // 진행상태
    this.helperProgresscd = { ...helper.Default };
    this.helperProgresscd.iInId = 'A001';
    this.helperProgresscd.iInCode1 = '169';

    // L/C종류
    this.helperLcType = { ...helper.Default };
    this.helperLcType.iInId = 'A001';
    this.helperLcType.iInCode1 = '172';

    // 인도조건
    this.helperDelivCon = { ...helper.Default };
    this.helperDelivCon.iInId = 'A001';
    this.helperDelivCon.iInCode1 = '177';

    // 선적국가
    this.helperLoadCom = { ...helper.Default };
    this.helperLoadCom.iInId = 'A001';
    this.helperLoadCom.iInCode1 = '185';

    // 도착국가
    this.helperArrivalcom = { ...helper.Default };
    this.helperArrivalcom.iInId = 'A001';
    this.helperArrivalcom.iInCode1 = '186';

    // 거래형태
    this.helperTradeType = { ...helper.Default };
    this.helperTradeType.iInId = 'A001';
    this.helperTradeType.iInCode1 = '193';

    // 입금구분=Ingubun
    this.helperIngubun = { ...helper.Default };
    this.helperIngubun.iInId = 'A001';
    this.helperIngubun.iInCode1 = '194';

    // 결제조건
    this.helperPayCondition = { ...helper.Default };
    this.helperPayCondition.iInId = 'A001';
    this.helperPayCondition.iInCode1 = '198';

    // 결제형태
    this.helperPayType = { ...helper.Default };
    this.helperPayType.iInId = 'A001';
    this.helperPayType.iInCode1 = '199';

    // 포장종류
    this.helperPackType = { ...helper.Default };
    this.helperPackType.iInId = 'A001';
    this.helperPackType.iInCode1 = '200';

    // 수정코드
    this.helperModCode = { ...helper.Default };
    this.helperModCode.iInId = 'A001';
    this.helperModCode.iInCode1 = '279';

    // 검사조건
    this.helperInspectConditionnm = { ...helper.Default };
    this.helperInspectConditionnm.iInId = 'A001';
    this.helperInspectConditionnm.iInCode1 = '295';

    // 결재조건
    this.helperPmsPaymentnm = { ...helper.Default };
    this.helperPmsPaymentnm.iInId = 'A001';
    this.helperPmsPaymentnm.iInCode1 = '296';

    // 공정
    this.helperOperation = { ...helper.Default };
    this.helperOperation.iInId = 'A001';
    this.helperOperation.iInCode1 = '297';

    // 작업장
    this.helperShopnm = { ...helper.Default };
    this.helperShopnm.iInId = 'A001';
    this.helperShopnm.iInCode1 = '299';

    //차량번호
    this.helperCarno = { ...helper.Default };
    this.helperCarno.iInId = 'A001';
    this.helperCarno.iInCode1 = '307';

    // 지불조건
    this.helperPaymentCondNm = { ...helper.Default };
    this.helperPaymentCondNm.iInId = 'A001';
    this.helperPaymentCondNm.iInCode1 = '349';

    // 선적조건
    this.helperShippingCondNm = { ...helper.Default };
    this.helperShippingCondNm.iInId = 'A001';
    this.helperShippingCondNm.iInCode1 = '350';

    // 견적산출구분
    this.helperEstimateItemType = { ...helper.Default };
    this.helperEstimateItemType.iInId = 'A001';
    this.helperEstimateItemType.iInCode1 = '351';

    // 유보금대상
    this.helperResYnnm = { ...helper.Default };
    this.helperResYnnm.iInId = 'A001';
    this.helperResYnnm.iInCode1 = '451';

    // 부가세종류
    this.helperExpenseVatNm = { ...helper.Default };
    this.helperExpenseVatNm.iInId = 'A0013';
    this.helperExpenseVatNm.iInCode1 = '103';

    this.helperVatTyp = { ...helper.Default };
    this.helperVatTyp.iInId = 'A001';
    this.helperVatTyp.iInCode1 = '103';

    // 발주구분
    this.UrgencyNm = { ...helper.Default };
    this.UrgencyNm.iInId = 'A001';
    this.UrgencyNm.iInCode1 = '130';

    // 인도조건
    this.Deliverytermsnm = { ...helper.Default };
    this.Deliverytermsnm.iInId = 'A001';
    this.Deliverytermsnm.iInCode1 = '340';

    // 결재조건
    this.Paytermsnm = { ...helper.Default };
    this.Paytermsnm.iInId = 'A001';
    this.Paytermsnm.iInCode1 = '341';

    // 출고창고
    this.helperWhNm = { ...helper.Default };
    this.helperWhNm.iInId = 'A004';
    this.helperWhNm.iInCode1 = '001';

    // 반제품PART
    this.helperHalfGoodPart = { ...helper.Default };
    this.helperHalfGoodPart.iInId = 'A00048';
    this.helperHalfGoodPart.iInCode1 = '';

    // 수주결의품번
    this.helperGoodNoExoffer = { ...helper.Default };
    this.helperGoodNoExoffer.iInId = 'A111';
    this.helperGoodNoExoffer.iInCode1 = '001';
    this.helperGoodNoExoffer.iInCode2 = 'A00';

    // 대분류
    this.helperClass2 = { ...helper.Default };
    this.helperClass2.iInId = 'A0004';
    this.helperClass2.iInCode1 = '060';

    // 중분류
    this.helperClass3 = { ...helper.Default };
    this.helperClass3.iInId = 'A0004';
    this.helperClass3.iInCode1 = '061';

    // 소분류
    this.helperClass4 = { ...helper.Default };
    this.helperClass4.iInId = 'A0004';
    this.helperClass4.iInCode1 = '062';

    // 품번
    this.helperGoodNoHarf = { ...helper.Default };
    this.helperGoodNoHarf.iInId = 'A112';
    this.helperGoodNoHarf.iInCode1 = '001';
    this.helperGoodNoHarf.iInCode2 = 'A00';

    // 자재
    this.helperGoodNoMaterial = { ...helper.Default };
    this.helperGoodNoMaterial.iInId = 'A113';
    this.helperGoodNoMaterial.iInCode1 = '001';
    this.helperGoodNoMaterial.iInCode2 = 'A00';

    // 매출구분
    this.helperSaleType = { ...helper.Default };
    this.helperSaleType.iInId = 'ACCEPTSALETYPE';
    this.helperSaleType.iInCode1 = '344';
    this.helperSaleType.iInCode2 = 'S';

    // 전체품목
    this.helperAllGoodcd = { ...helper.Default };
    this.helperAllGoodcd.iInId = 'A118';
    this.helperAllGoodcd.iInCode1 = '001';
    this.helperAllGoodcd.iInCode2 = 'A00';

    // 수주품목
    this.helperSalesGoodcd = { ...helper.Default };
    this.helperSalesGoodcd.iInId = 'A119';
    this.helperSalesGoodcd.iInCode1 = '001';
    this.helperSalesGoodcd.iInCode2 = 'A00';

    // 사원
    this.helperPnoNm = { ...helper.Default };
    this.helperPnoNm.iInId = 'B001';
    this.helperPnoNm.iInCode1 = '001';

    // 사원 (외부인원 제외) /사원명
    this.helperPnoNm2 = { ...helper.Default };
    this.helperPnoNm2.iInId = 'B0011';
    this.helperPnoNm2.iInCode1 = '001';

    // 직책
    this.helperApprPosNm = { ...helper.Default };
    this.helperApprPosNm.iInId = 'A001';
    this.helperApprPosNm.iInCode1 = '313';

    // 부서/부서명
    this.helperDeptNm = { ...helper.Default };
    this.helperDeptNm.iInId = 'B002';
    this.helperDeptNm.iInCode1 = '001';

    // 대행자
    this.helperAssent = { ...helper.Cust };
    this.helperAssent.iInId = 'C001';
    this.helperAssent.iInCode1 = '001';

    // 매장명
    this.helperMediatornm = { ...helper.Default };
    this.helperMediatornm.iInId = 'C501';
    this.helperMediatornm.iInCode1 = '001';

    // 출고구분
    this.helperIntype = { ...helper.Default };
    this.helperIntype.iInId = 'C700';
    this.helperIntype.iInCode1 = '001';

    // 작업지시번호
    this.helperWorkNo = { ...helper.Default };
    this.helperWorkNo.iInId = 'PMS1';
    this.helperWorkNo.iInCode1 = '';

    // CINO
    this.helperCino = { ...helper.Default };
    this.helperCino.iInId = 'C514';
    this.helperCino.iInCode1 = '001';

    // BOM 복사품목
    this.helperBomGoodcd = { ...helper.Default };
    this.helperBomGoodcd.iInId = 'P251';
    this.helperBomGoodcd.iInCode1 = '001';
    this.helperBomGoodcd.iInCode2 = 'A00';

    // 송장관리항목
    this.helperSalemanagenmNm = { ...helper.Default };
    this.helperSalemanagenmNm.iInId = 'C520';
    this.helperSalemanagenmNm.iInCode1 = '001';
    this.helperSalemanagenmNm.iInCode2 = 'default 송장관리항목';
    this.helperSalemanagenmNm.iInCode3 = 'default거래처';

    // 회계처리코드
    this.helperJukyoNm = { ...helper.Default };
    this.helperJukyoNm.iInId = 'C512';
    this.helperJukyoNm.iInCode1 = '001';

    // 회계처리코드(명)
    this.helperJukyoNm2 = { ...helper.Default };
    this.helperJukyoNm2.iInId = 'C512';

    // 수출송장 품목명세 품번
    this.helperExGoodNm = { ...helper.Default };
    this.helperExGoodNm.iInId = 'EKSGOODNO';
    this.helperExGoodNm.iInCode1 = '001';

    // 출하요청내역
    this.helperFornoSearch = { ...helper.Default };
    this.helperFornoSearch.iInId = 'FORREQSEARCH';

    //LCNO
    this.helperImpExpeseLcno = { ...helper.Default };
    this.helperImpExpeseLcno.iInId = 'C513';
    this.helperImpExpeseLcno.iInCode1 = '001';

    //카드번호
    this.helperCardNo = { ...helper.Default };
    this.helperCardNo.iInId = 'D107';
    this.helperCardNo.iInCode1 = '001';

    //품명검색 임시용
    this.helperGoodTest = { ...helper.Default };
    this.helperGoodTest.iInId = 'T001';
    this.helperGoodTest.iInCode1 = '001';

    //품명검색 대분류
    this.helperSearchGoods1 = { ...helper.Default };
    this.helperSearchGoods1.iInId = 'A0004';
    this.helperSearchGoods1.iInCode1 = '060';

    //품명검색 중분류
    this.helperSearchGoods2 = { ...helper.Default };
    this.helperSearchGoods2.iInId = 'A0004';
    this.helperSearchGoods2.iInCode1 = '061';

    //품명검색 소분류
    this.helperSearchGoods3 = { ...helper.Default };
    this.helperSearchGoods3.iInId = 'A0004';
    this.helperSearchGoods3.iInCode1 = '062';

    //품명검색 강종
    this.helperSearchGoods4 = { ...helper.Default };
    this.helperSearchGoods4.iInId = 'CLASS5';
    this.helperSearchGoods4.iInCode1 = '063';

    //품명검색 반제품PART
    this.helperHalfGoodsPart = { ...helper.Default };
    this.helperHalfGoodsPart.iInId = 'HALFGOODSPART';
    this.helperHalfGoodsPart.iInCode1 = '499';

    //품명검색 반제품TYPE
    this.helperHalfGoodsType = { ...helper.Default };
    this.helperHalfGoodsType.iInId = 'HALFGOODSTYPE';
    this.helperHalfGoodsType.iInCode1 = '498';

    //품명검색 Seat
    this.helperSeatType = { ...helper.Default };
    this.helperSeatType.iInId = 'A00044';
    this.helperSeatType.iInCode1 = '501';

    //품명검색 BD-BT&Stam
    this.helperBdbtStem = { ...helper.Default };
    this.helperBdbtStem.iInId = 'A00045';
    this.helperBdbtStem.iInCode1 = '502';

    //품명검색 Disk
    this.helperDiskType = { ...helper.Default };
    this.helperDiskType.iInId = 'A00045';
    this.helperDiskType.iInCode1 = '503';

    //품명검색 Special
    this.helperSpecial = { ...helper.Default };
    this.helperSpecial.iInId = 'A001';
    this.helperSpecial.iInCode1 = '504';

    //품명검색 RatingType
    this.helperRatingType = { ...helper.Default };
    this.helperRatingType.iInId = 'A0004';
    this.helperRatingType.iInCode1 = '505';

    //품명검색 Bore
    this.helperBore = { ...helper.Default };
    this.helperBore.iInId = 'A001';
    this.helperBore.iInCode1 = '506';

    //품명검색 SizeType
    this.helperSizeType = { ...helper.Default };
    this.helperSizeType.iInId = 'SIZETYPE';
    this.helperSizeType.iInCode1 = '507';

    //품명검색 End
    this.helperEnd = { ...helper.Default };
    this.helperEnd.iInId = 'A001';
    this.helperEnd.iInCode1 = '508';

    //품명검색 Body 재질
    this.helperBody = { ...helper.Default };
    this.helperBody.iInId = 'A00044';
    this.helperBody.iInCode1 = '063';
    this.helperBody.iInCode2 = 'BODY';

    //품명검색 Trim 재질
    this.helperTrim = { ...helper.Default };
    this.helperTrim.iInId = 'A00044';
    this.helperTrim.iInCode1 = '063';
    this.helperTrim.iInCode2 = 'TRIM';

    //품명검색 Operator
    this.helperOperator = { ...helper.Default };
    this.helperOperator.iInId = 'A001';
    this.helperOperator.iInCode1 = '509';

    //발주품번조회 대분류
    this.searchBaljooBigCategory = { ...helper.Default };
    this.searchBaljooBigCategory.iInId = 'A001';
    this.searchBaljooBigCategory.iInCode1 = '088';

    //발주품번조회 중분류
    this.searchBaljooMiddleCategory = { ...helper.Default };
    this.searchBaljooMiddleCategory.iInId = 'A001';
    this.searchBaljooMiddleCategory.iInCode1 = '089';

    //발주품번조회 소분류
    this.searchBaljooSmallCategory = { ...helper.Default };
    this.searchBaljooSmallCategory.iInId = 'A001';
    this.searchBaljooSmallCategory.iInCode1 = '090';
  }

  /**
   * [Redefinition Helper]
   * @param {*Helper} helper
   * @param {*필드} items
   * @returns helper
   */
  fRedefHelper = (helper, items) => {
    for (const [key, value] of Object.entries(items)) {
      helper[key] = value;
    }
    return helper;
  };
}

export default CodeHelper;
