import React from 'react';
import { makeObservable, observable } from 'mobx';
import loadable from '@loadable/component';
import MainMenu from '@pages/main/MainMenu';

/* 공통 (Common) ---------------------------------------------- */
const Main = loadable(() => import('@pages/main/Main'));
const Profile = loadable(() => import('@pages/common/Profile'));
/* ----------------------------------------------------------- */

/* 영업 (Business) -------------------------------------------- */
const KsAcceptLedger = loadable(() => import('@pages/business/KsAcceptLedger'));
const KsAcceptSaleLedger = loadable(() => import('@pages/business/KsAcceptSaleLedger'));
const KsAcceptSaleLedgerDetail = loadable(() => import('@pages/business/KsAcceptSaleLedgerDetail'));
const AcceptLedgerList = loadable(() => import('@pages/business/AcceptLedgerList'));
const ActnoLedgerList = loadable(() => import('@pages/business/ActnoLedgerList'));
const NoComAcceptLedgerList = loadable(() => import('@pages/business/NoComAcceptLedgerList'));
const KsAcceptExpDateModList = loadable(() => import('@pages/business/KsAcceptExpDateModList'));
const EstimateSheet = loadable(() => import('@pages/business/EstimateSheet'));
const EstimateCalculation = loadable(() => import('@pages/business/EstimateCalculation'));
const TechEstimateSheet = loadable(() => import('@pages/business/TechEstimateSheet'));
const EstimateList = loadable(() => import('@pages/business/EstimateList'));
const CollectionManage = loadable(() => import('@pages/business/CollectionManage'));
const OrderStatusBY = loadable(() => import('@pages/business/OrderStatusBY'));
const SalesStatusBY = loadable(() => import('@pages/business/SalesStatusBY'));
const MonthlySalesClosingData = loadable(() => import('@pages/business/MonthlySalesClosingData'));
const SalesStatusList = loadable(() => import('@pages/business/SalesStatusList'));
const KsInspectDateModList = loadable(() => import('@pages/business/KsInspectDateModList'));
const DeliveryRequestForm = loadable(() => import('@pages/business/DeliveryRequestForm'));
const PackingPrint = loadable(() => import('@pages/business/PackingPrint'));
const KsPackingList = loadable(() => import('@pages/business/KsPackingList'));
const KsExoffer = loadable(() => import('@pages/business/KsExoffer'));
const PublishTaxInvoice = loadable(() => import('@pages/business/PublishTaxInvoice'));
const ExInvoice = loadable(() => import('@pages/business/ExInvoice'));
const EstimateCalc = loadable(() => import('@root/pages/business/estimateCalc/main/EstimateCalc'));
const ProductType = loadable(() => import('@root/pages/business/productType/main/ProductType'));
const RequestSample = loadable(() => import('@pages/business/RequestSample'));
const ReturnSales = loadable(() => import('@pages/business/returnSales/main/ReturnSales'));
/* ----------------------------------------------------------- */

/* 생산 (Product) -------------------------------------------- */
const InsufficientQuantityList = loadable(() => import('@pages/product/InsufficientQuantityList'));
const InsufficientQuantityPublishing = loadable(() => import('@pages/product/InsufficientQuantityPublishing'));
const PmsOrder = loadable(() => import('@pages/product/PmsOrder'));
const WorkReport = loadable(() => import('@pages/product/WorkReport'));
const WorkReportProcessRecordLedger = loadable(() => import('@pages/product/WorkReportProcessRecordLedger'));
const ManufacturingManageCard = loadable(() => import('@pages/product/ManufacturingManageCard'));
const JigtoolManagementCard = loadable(() => import('@pages/product/JigtoolManagementCard'));
const KsGoodPartsCard = loadable(() => import('@pages/product/KsGoodPartsCard'));
const KsIncompleteList = loadable(() => import('@pages/product/KsIncompleteList'));
const ProductSchedule = loadable(() => import('@pages/product/ProductSchedule'));
const ProductShipmentPro = loadable(() => import('@pages/product/ProductShipmentPro'));
const ProductWorkReportResult = loadable(() => import('@pages/product/ProductWorkReportResult'));
const ProductAssemReportResult = loadable(() => import('@pages/product/ProductAssemReportResult'));
const ProductHydraulicTestResult = loadable(() => import('@pages/product/ProductHydraulicTestResult'));
const ProductPackingTestResult = loadable(() => import('@pages/product/ProductPackingTestResult'));
const ProductPackingReportResult = loadable(() => import('@pages/product/ProductPackingReportResult'));
const MRP = loadable(() => import('@pages/product/MRP'));
const ManufactureBom = loadable(() => import('@pages/product/ManufactureBom'));
/* ----------------------------------------------------------- */

/* 구매 (Purchase) ------------------------------------------- */
const OrderToDelv = loadable(() => import('@pages/purchase/OrderToDelv'));
const KsOrderLedger = loadable(() => import('@pages/purchase/KsOrderLedger'));
const KsOrderLedgerDetail = loadable(() => import('@pages/purchase/KsOrderLedgerDetail'));
const PurchaseStatusList = loadable(() => import('@pages/purchase/PurchaseStatusList'));
const OutsourcingProcessingOrderDetail = loadable(() => import('@pages/purchase/OutsourcingProcessingOrderDetail'));
const PurchaseStorage = loadable(() => import('@pages/purchase/PurchaseStorage'));
const Nego = loadable(() => import('@pages/purchase/Nego'));
const OrderMaterial = loadable(() => import('@pages/purchase/OrderMaterial'));
/* ----------------------------------------------------------- */

/* 경비 (Expense) ------------------------------------------- */
const CostAmount = loadable(() => import('@pages/expense/CostAmount'));
const ExportExpenses = loadable(() => import('@root/pages/expense/exportExpenses/main/ExportExpenses'));
const ImportExpenses = loadable(() => import('@pages/expense/ImportExpenses'));
const CostSettlementApproval = loadable(() => import('@pages/expense/CostSettlementApproval/main/CostSettlementApproval'));
/* ----------------------------------------------------------- */

/* 재고 (Stock) ------------------------------------------- */
const Alter = loadable(() => import('@pages/stock/Alter'));
const StockModify = loadable(() => import('@pages/stock/StockModify'));
/* ----------------------------------------------------------- */

/* 기술 (Technology) ----------------------------------------- */
const TcbLedger = loadable(() => import('@pages/technology/TcbLedger'));
const GoodsDrawingRevision = loadable(() => import('@pages/technology/GoodsDrawingRevision'));
const GoodsPartSearch = loadable(() => import('@pages/technology/GoodsPartSearch'));
const GoodNoManagement = loadable(() => import('@pages/technology/GoodNoManagement'));
const DrawingApproval = loadable(() => import('@pages/technology/DrawingApproval'));
const BomRegister = loadable(() => import('@pages/technology/BomRegister'));
const MinorHalfGoodsPartType = loadable(() => import('@pages/technology/MinorHalfGoodsPartType'));
const StandardBom = loadable(() => import('@pages/technology/StandardBom'));
const TypeCode = loadable(() => import('@pages/technology/typeCode/main/TypeCode'));
const UseCode = loadable(() => import('@pages/technology/useCode/main/UseCode'));
const UpperCode = loadable(() => import('@pages/technology/upperCode/main/UpperCode'));
const StandardProduct = loadable(() => import('@pages/technology/standardProduct/main/StandardProduct'));
const MultiUpperCode = loadable(() => import('@pages/technology/multiUpperCode/main/MultiUpperCode'));
const MultiDefaultCode = loadable(() => import('@pages/technology/multiDefaultCode/main/MultiDefaultCode'));
const SalesOrder = loadable(() => import('@pages/technology/salesOrder/main/SalesOrder'));
const SemiGoodKind = loadable(() => import('@pages/technology/semiGoodKind/main/SemiGoodKind'));
const UseCodeBySemiGood = loadable(() => import('@pages/technology/useCodeBySemiGood/main/UseCodeBySemiGood'));
const SemiGoodAdd = loadable(() => import('@pages/technology/semiGoodAdd/main/SemiGoodAdd'));
const RepresentationMaterial = loadable(() => import('@pages/technology/representationMaterial/main/RepresentationMaterial'));
const SemiGoodQuantity = loadable(() => import('@pages/technology/semiGoodQuantity/main/SemiGoodQuantity'));
const SemiGoodMake = loadable(() => import('@pages/technology/semiGoodMake/main/SemiGoodMake'));
const SemiGood = loadable(() => import('@pages/technology/semiGood/main/SemiGood'));
/* ----------------------------------------------------------- */

/* 품질 (Quality) -------------------------------------------- */
const InspectAndTestequipManageCard = loadable(() => import('@pages/quality/InspectAndTestequipManageCard'));
const InspectAndTestequipManageCardDisposal = loadable(() => import('@pages/quality/InspectAndTestequipManageCardDisposal'));
const InspectAndTestequipManageCardIrregular = loadable(() => import('@pages/quality/InspectAndTestequipManageCardIrregular'));
const InspectAndTestequipManageCardValidity = loadable(() => import('@pages/quality/InspectAndTestequipManageCardValidity'));
const InspectAndTestequipManageCardQuarter1 = loadable(() => import('@pages/quality/InspectAndTestequipManageCardQuarter1'));
const InspectAndTestequipManageCardQuarter2 = loadable(() => import('@pages/quality/InspectAndTestequipManageCardQuarter2'));
const InspectAndTestequipManageCardQuarter3 = loadable(() => import('@pages/quality/InspectAndTestequipManageCardQuarter3'));
const InspectAndTestequipManageCardQuarter4 = loadable(() => import('@pages/quality/InspectAndTestequipManageCardQuarter4'));
const DocumentMpsLedger = loadable(() => import('@pages/quality/DocumentMpsLedger'));
const DocumentMpsLedgerList1 = loadable(() => import('@pages/quality/DocumentMpsLedgerList1'));
const DocumentMpsLedgerList2 = loadable(() => import('@pages/quality/DocumentMpsLedgerList2'));
const DocumentMpsLedgerList3 = loadable(() => import('@pages/quality/DocumentMpsLedgerList3'));
const DocumentMpsLedgerList4 = loadable(() => import('@pages/quality/DocumentMpsLedgerList4'));
const DocumentMpsLedgerList5 = loadable(() => import('@pages/quality/DocumentMpsLedgerList5'));
const DocumentMpsLedgerList6 = loadable(() => import('@pages/quality/DocumentMpsLedgerList6'));
const DocumentMpsLedgerList7 = loadable(() => import('@pages/quality/DocumentMpsLedgerList7'));
const InspectResultRegist = loadable(() => import('@pages/quality/InspectResultRegist'));
/* ----------------------------------------------------------- */

/* 외주 (Order) ---------------------------------------------- */
const TradingOrderList = loadable(() => import('@pages/order/TradingOrderList'));
const TradingOrderListCasting = loadable(() => import('@pages/order/TradingOrderListCasting'));
const TradingOrderProcess = loadable(() => import('@pages/order/TradingOrderProcess'));
const TradingOrderProcessCasting = loadable(() => import('@pages/order/TradingOrderProcessCasting'));
const TradingStatement = loadable(() => import('@pages/order/TradingStatement'));
const ManagerTradingStatement = loadable(() => import('@pages/order/ManagerTradingStatement'));
/* ----------------------------------------------------------- */

/* 관리 (Admin) ---------------------------------------------- */
const SalesSlip = loadable(() => import('@pages/admin/SalesSlip'));
const AuthInsert = loadable(() => import('@pages/admin/AuthInsert'));
const AuthChecker = loadable(() => import('@pages/admin/AuthChecker'));
const Template = loadable(() => import('@pages/admin/template/main/Template'));
const Menu = loadable(() => import('@pages/admin/menu/main/Menu'));
const MenuAuth = loadable(() => import('@pages/admin/menuAuth/main/MenuAuth'));
const RoleAuth = loadable(() => import('@pages/admin/roleAuth/main/RoleAuth'));
const MenuRoleAuth = loadable(() => import('@pages/admin/menuRoleAuth/main/MenuRoleAuth'));
const CodeHelper = loadable(() => import('@pages/admin/codeHelper/main/CodeHelper'));
const UserManager = loadable(() => import('@pages/admin/userManager/main/UserManager'));
/* ----------------------------------------------------------- */

const Common = [
  {
    path: '/main',
    title: '메뉴목록',
    component: () => <MainMenu />,
    pgmid: 'NONE',
  },
  {
    path: '/alarm_*',
    title: 'ALARM',
    component: () => <Main />,
    pgmid: 'NONE',
  },
  {
    path: '/profile',
    title: '사용자정보변경',
    component: () => <Profile />,
    pgmid: 'NONE',
  },
];

const Business = [
  {
    path: '/ksexoffer',
    title: 'OFFERSHEET',
    component: () => <KsExoffer />,
    pgmid: 'KSEXOFFER',
  },
  {
    path: '/ksacceptledger',
    title: '수주현황조회',
    component: () => <KsAcceptLedger />,
    pgmid: 'KSACCEPTLEDGER',
  },
  {
    path: '/ksacceptsaleledger',
    title: '영업매출현황조회',
    component: () => <KsAcceptSaleLedger />,
    pgmid: 'KSACCEPTSALELEDGER',
  },
  {
    path: '/ksacceptsaleledgerdetail',
    title: '영업매출상세현황조회',
    component: () => <KsAcceptSaleLedgerDetail />,
    pgmid: 'KSACCEPTSALELEDGERDETAIL',
  },
  {
    path: '/acceptledgerlist',
    title: '수주대장',
    component: () => <AcceptLedgerList />,
    pgmid: 'ACCEPTLEDGER',
  },
  {
    path: '/actnoledgerlist',
    title: '수주생산결의서대장',
    component: () => <ActnoLedgerList />,
    pgmid: 'ACTNOLEDGER',
  },
  {
    path: '/nocomacceptledgerlist',
    title: '미납현황조회',
    component: () => <NoComAcceptLedgerList />,
    pgmid: 'NOCOMACCEPTLEDGERLIST',
  },
  {
    path: '/ksacceptexpdatemodList',
    title: '출고예정일변경내역',
    component: () => <KsAcceptExpDateModList />,
    pgmid: 'KSACCEPTEXPECTDATEMODIFYLIST',
  },
  {
    path: '/estimatesheet',
    title: '견적서',
    component: () => <EstimateSheet />,
    pgmid: 'ESTIMATESHEET',
  },
  {
    path: '/estimateCalculation',
    title: '견적서산출설계서',
    component: () => <EstimateCalculation />,
    pgmid: 'ESTIMATECALCULATION',
  },
  {
    path: '/techestimatesheet',
    title: '견적서(연구개발팀)',
    component: () => <TechEstimateSheet />,
    pgmid: 'TECHESTIMATESHEET',
  },
  {
    path: '/estimatelist',
    title: '견적내역조회',
    component: () => <EstimateList />,
    pgmid: 'ESTIMATELIST',
  },
  {
    path: '/collectionmanage',
    title: '수금관리',
    component: () => <CollectionManage />,
    pgmid: 'COLLECTIONMANAGE',
  },
  {
    path: '/orderstatusby',
    title: '연도별업체수주현황',
    component: () => <OrderStatusBY />,
    pgmid: 'ORDERSTATUSBY',
  },
  {
    path: '/salesstatusby',
    title: '연도별업체매출현황',
    component: () => <SalesStatusBY />,
    pgmid: 'SALESSTATUSBY',
  },
  {
    path: '/monthlysalesclosingdata',
    title: '월매출마감자료조회',
    component: () => <MonthlySalesClosingData />,
    pgmid: 'MONTHLYSALESCLOSINGDATA',
  },
  {
    path: '/salesstatuslist',
    title: '거래처별매출현황',
    component: () => <SalesStatusList />,
    pgmid: 'SALESSTATUSLIST',
  },
  {
    path: '/ksinspectdatemodlist',
    title: '품질검사일정변경내역',
    component: () => <KsInspectDateModList />,
    pgmid: 'KSINSPECTDATEMODLIST',
  },
  {
    path: '/deliveryrequestform',
    title: '출하요청서입력',
    component: () => <DeliveryRequestForm />,
    pgmid: 'DELIVERYREQUESTFORM',
  },
  {
    path: '/packingprint',
    title: 'Packing Print',
    component: () => <PackingPrint />,
    pgmid: 'PACKINGPRINT',
  },
  {
    path: '/kspackinglist',
    title: 'PackingList',
    component: () => <KsPackingList />,
    pgmid: 'KSPACKINGLIST',
  },
  {
    path: '/exinvoice',
    title: '수출송장',
    component: () => <ExInvoice />,
    pgmid: 'EXINVOICE',
  },
  {
    path: '/estimateCalc/main/estimateCalc',
    title: '견적서 산출 설계서(컴포넌트)',
    component: () => <EstimateCalc />,
    pgmid: 'ESTIMATECALC',
  },
  {
    path: '/publishtaxinvoice',
    title: '세금계산서발행',
    component: () => <PublishTaxInvoice />,
    pgmid: 'PUBLISHTAXINVOICE',
  },

  {
    path: '/productType/main/ProductType',
    title: '테스트',
    component: () => <ProductType />,
    pgmid: 'PRODUCTTYPE',
  },
  {
    path: '/requestsample',
    title: '샘플요청서',
    component: () => <RequestSample />,
    pgmid: 'REQUESTSAMPLE',
  },
  {
    path: '/returnsales',
    title: '반품대장',
    component: () => <ReturnSales />,
    pgmid: 'RETURNSALES',
  },
];

const Product = [
  {
    path: '/insufficientquantitylist',
    title: '반제품월별필요수량기준가부족수량조회',
    component: () => <InsufficientQuantityList />,
    pgmid: 'INSUFFICIENTQUANTITYLIST',
  },
  {
    path: '/insufficientquantitypublishing',
    title: '반제품월별필요수량기준원재료BOM미등록자료조회',
    component: () => <InsufficientQuantityPublishing />,
    pgmid: 'INSUFFICIENTQUANTITYPUBLISHING',
  },
  {
    path: '/pmsorder',
    title: '외주임가공발주입력',
    component: () => <PmsOrder />,
    pgmid: 'PMSORDER',
  },
  {
    path: '/workreport',
    title: '작업지시서',
    component: () => <WorkReport />,
    pgmid: 'WORKREPORT',
  },
  {
    path: '/workreportprocessrecordledger',
    title: '작업일보(가공반)',
    component: () => <WorkReportProcessRecordLedger />,
    pgmid: 'WORKREPORTPROCESSRECORDLEDGER',
  },
  {
    path: '/manufacturingmanagecard',
    title: '제조설비관리카드',
    component: () => <ManufacturingManageCard />,
    pgmid: 'MANUFACTURINGMANAGECARD',
  },
  {
    path: '/jigtoolmanagementcard',
    title: '치공구관리카드',
    component: () => <JigtoolManagementCard />,
    pgmid: 'JIGTOOLMANAGEMENTCARD',
  },
  {
    path: '/ksgoodpartscard',
    title: '부품카드등록/조회',
    component: () => <KsGoodPartsCard />,
    pgmid: 'KSGOODPARTSCARD',
  },
  {
    path: '/ksincompletelist',
    title: '미납수주자료조회(생산)',
    component: () => <KsIncompleteList />,
    pgmid: 'KSINCOMPLETELIST',
  },
  {
    path: '/productschedule',
    title: '생산일정표',
    component: () => <ProductSchedule />,
    pgmid: 'PRODUCTSCHEDULE',
  },
  {
    path: '/productshipmentpro',
    title: '생산출하진행현황',
    component: () => <ProductShipmentPro />,
    pgmid: 'PRODUCTSHIPMENTPRO',
  },
  {
    path: '/productworkreportresult',
    title: '작업지시서실적',
    component: () => <ProductWorkReportResult />,
    pgmid: 'PRODUCTWORKREPORTRESULT',
  },
  {
    path: '/productassemreportresult',
    title: '조립지시서실적',
    component: () => <ProductAssemReportResult />,
    pgmid: 'PRODUCTASSEMREPORTRESULT',
  },
  {
    path: '/producthydraulictestresult',
    title: '수압입회검사실적',
    component: () => <ProductHydraulicTestResult />,
    pgmid: 'PRODUCTHYDRAULICTESTRESULT',
  },
  {
    path: '/productpackingtestresult',
    title: '포장입회검사실적',
    component: () => <ProductPackingTestResult />,
    pgmid: 'PRODUCTPACKINGTESTRESULT',
  },
  {
    path: '/productpackingreportresult',
    title: '포장지시서실적',
    component: () => <ProductPackingReportResult />,
    pgmid: 'PRODUCTPACKINGREPORTRESULT',
  },
  {
    path: '/mrp',
    title: '자재소요량 계산',
    component: () => <MRP />,
    pgmid: 'MRP',
  },
  {
    path: '/manufacturebom',
    title: '생산 BOM 등록',
    component: () => <ManufactureBom />,
    pgmid: 'MANUFACTUREBOM',
  },
];

const Purchase = [
  {
    path: '/ordertodelv',
    title: '발주자료경비처리',
    component: () => <OrderToDelv />,
    pgmid: 'ORDERTODELV',
  },
  {
    path: '/ksorderledger',
    title: '구매발주내역조회',
    component: () => <KsOrderLedger />,
    pgmid: 'KSORDERLEDGER',
  },
  {
    path: '/ksorderledgerdetail',
    title: '구매발주상세내역조회',
    component: () => <KsOrderLedgerDetail />,
    pgmid: 'KSORDERLEDGERDETAIL',
  },
  {
    path: '/purchasestatuslist',
    title: '거래처별매입현황',
    component: () => <PurchaseStatusList />,
    pgmid: 'PURCHASESTATUSLIST',
  },
  {
    path: '/outsourcingprocessingorderdetail',
    title: '외주임가공발주상세내역',
    component: () => <OutsourcingProcessingOrderDetail />,
    pgmid: 'OUTSOURCINGPROCESSINGORDERDETAIL',
  },
  {
    path: '/purchasestorage',
    title: '구매입고',
    component: () => <PurchaseStorage />,
    pgmid: 'PURCHASESTORAGE',
  },
  {
    path: '/nego',
    title: 'NEGO',
    component: () => <Nego />,
    pgmid: 'NEGO',
  },
  {
    path: '/ordermaterial',
    title: '발주자료입력',
    component: () => <OrderMaterial />,
    pgmid: 'ORDERMATERIAL',
  },
];

const Expense = [
  {
    path: '/costamount',
    title: '지출경비',
    component: () => <CostAmount />,
    pgmid: 'COSTAMOUNT',
  },
  {
    path: '/exportexpenses',
    title: '수출부대비용입력',
    component: () => <ExportExpenses />,
    pgmid: 'EXPORTEXPENSES',
  },
  {
    path: '/importexpenses',
    title: '수입부대비용입력',
    component: () => <ImportExpenses />,
    pgmid: 'IMPORTEXPENSES',
  },
  {
    path: '/costsettlementapproval',
    title: '비용정산결재처리',
    component: () => <CostSettlementApproval />,
    pgmid: 'COSTSETTLEMENTAPPROVAL',
  },
];

const Stock = [
  {
    path: '/alter',
    title: '대체처리',
    component: () => <Alter />,
    pgmid: 'ALTER',
  },
  {
    path: '/stockmodify',
    title: '재고조정요청서',
    component: () => <StockModify />,
    pgmid: 'STOCKMODIFY',
  },
];

const Technology = [
  {
    path: '/tcbledger',
    title: '기술문서관리등록/조회',
    component: () => <TcbLedger />,
    pgmid: 'TCBLEDGER',
  },
  {
    path: '/goodsdrawingrevision',
    title: '도면관리',
    component: () => <GoodsDrawingRevision />,
    pgmid: 'GOODSDRAWINGREVISION',
  },
  {
    path: '/goodspartsearch',
    title: '품번검색',
    component: () => <GoodsPartSearch />,
    pgmid: 'GOODsPARTSEARCH',
  },
  {
    path: '/goodnomanaged',
    title: '품번관리',
    component: () => <GoodNoManagement />,
    pgmid: 'GOODNOMANAGEMENT',
  },
  {
    path: '/drawingapproval',
    title: '승인도면작성',
    component: () => <DrawingApproval />,
    pgmid: 'DRAWINGAPPROVAL',
  },
  {
    path: '/bomregister',
    title: 'BOM등록',
    component: () => <BomRegister />,
    pgmid: 'BOMREGISTER',
  },
  {
    path: '/MinorHalfGoodsPartType',
    title: '반제품파트/타입등록',
    component: () => <MinorHalfGoodsPartType />,
    pgmid: 'MINORHALFGOODSPARTTYPE',
  },
  {
    path: '/StandardBom',
    title: '표준 BOM 등록',
    component: () => <StandardBom />,
    pgmid: 'STANDARDBOM',
  },
  {
    path: '/typeCode/main/TypeCode',
    title: '코드관리',
    component: () => <TypeCode />,
    pgmid: 'TYPECODE',
  },
  {
    path: '/useCode/main/UseCode',
    title: '밸브유형별 코드관리',
    component: () => <UseCode />,
    pgmid: 'USECODE',
  },
  {
    path: '/upperCode/main/UpperCode',
    title: '밸브유형별 상위코드관리',
    component: () => <UpperCode />,
    pgmid: 'UPPERCODE',
  },
  {
    path: '/standardProduct/main/StandardProduct',
    title: '표준품 기준정보',
    component: () => <StandardProduct />,
    pgmid: 'STANDARDPRODUCT',
  },
  {
    path: '/multiUpperCode/main/MultiUpperCode',
    title: '멀티 상위코드관리',
    component: () => <MultiUpperCode />,
    pgmid: 'MULTIUPPERCODE',
  },
  {
    path: '/multiDefaultCode/main/MultiDefaultCode',
    title: '멀티 표준코드관리',
    component: () => <MultiDefaultCode />,
    pgmid: 'MULTIDEFAULTCODE',
  },
  {
    path: '/salesOrder/main/SalesOrder',
    title: '수주관리 테스트',
    component: () => <SalesOrder />,
    pgmid: 'SALESORDER',
  },
  {
    path: '/semiGoodKind/main/SemiGoodKind',
    title: '반제품 분류 관리',
    component: () => <SemiGoodKind />,
    pgmid: 'SEMIGOODKIND',
  },
  {
    path: '/useCodeBySemiGood/main/UseCodeBySemiGood',
    title: '밸브유형별 반제품 관리',
    component: () => <UseCodeBySemiGood />,
    pgmid: 'USECODEBYSEMIGOOD',
  },
  {
    path: '/semiGoodAdd/main/SemiGoodAdd',
    title: '밸브유형별 추가 반제품 관리',
    component: () => <SemiGoodAdd />,
    pgmid: 'SEMIGOODADD',
  },
  {
    path: '/representationMaterial/main/RepresentationMaterial',
    title: '대표재질 관리',
    component: () => <RepresentationMaterial />,
    pgmid: 'REPRESENTATIONMATERIAL',
  },
  {
    path: '/semiGoodQuantity/main/SemiGoodQuantity',
    title: '반제품 구성량 관리',
    component: () => <SemiGoodQuantity />,
    pgmid: 'SEMIGOODQUANTITY',
  },
  {
    path: '/semiGoodMake/main/SemiGoodMake',
    title: '밸브유형별 반제품 생성항목 관리',
    component: () => <SemiGoodMake />,
    pgmid: 'SEMIGOODMAKE',
  },
  {
    path: '/semiGood/main/SemiGood',
    title: 'BOM 생성 관리',
    component: () => <SemiGood />,
    pgmid: 'SEMIGOOD',
  },
];

const Quality = [
  {
    path: '/inspectandtesteqipmanagecard',
    title: '검사및시험장비등록/조회',
    component: () => <InspectAndTestequipManageCard />,
    pgmid: 'INSPECTANDTESTEQIPMANAGECARD',
  },
  {
    path: '/inspectandtesteqipmanagedisposal',
    title: '폐기/분실장비조회',
    component: () => <InspectAndTestequipManageCardDisposal />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEDISPOSAL',
  },
  {
    path: '/inspectandtesteqipmanageirregular',
    title: '부정기시험장비조회',
    component: () => <InspectAndTestequipManageCardIrregular />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEIRREGULAR',
  },
  {
    path: '/inspectandtesteqipmanagevalidity',
    title: '유효기간만료장비조회',
    component: () => <InspectAndTestequipManageCardValidity />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEVALIDITY',
  },
  {
    path: '/inspectandtesteqipmanagequarter1',
    title: '검사및시험장비1분기',
    component: () => <InspectAndTestequipManageCardQuarter1 />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEQUARTER1',
  },
  {
    path: '/inspectandtesteqipmanagequarter2',
    title: '검사및시험장비2분기',
    component: () => <InspectAndTestequipManageCardQuarter2 />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEQUARTER2',
  },
  {
    path: '/inspectandtesteqipmanagequarter3',
    title: '검사및시험장비3분기',
    component: () => <InspectAndTestequipManageCardQuarter3 />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEQUARTER3',
  },
  {
    path: '/inspectandtesteqipmanagequarter4',
    title: '검사및시험장비4분기',
    component: () => <InspectAndTestequipManageCardQuarter4 />,
    pgmid: 'INSPECTANDTESTEQIPMANAGEQUARTER4',
  },
  {
    path: '/documentmpsledger',
    title: '매뉴얼,절차서및표준서등록/조회',
    component: () => <DocumentMpsLedger />,
    pgmid: 'DOCUMENTMPSLEDGER',
  },
  {
    path: '/documentmpsledgerlist1',
    title: '매뉴얼',
    component: () => <DocumentMpsLedgerList1 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST1',
  },
  {
    path: '/documentmpsledgerlist2',
    title: '절차서',
    component: () => <DocumentMpsLedgerList2 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST2',
  },
  {
    path: '/documentmpsledgerlist3',
    title: '작업표준서',
    component: () => <DocumentMpsLedgerList3 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST3',
  },
  {
    path: '/documentmpsledgerlist4',
    title: '검사표준서',
    component: () => <DocumentMpsLedgerList4 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST4',
  },
  {
    path: '/documentmpsledgerlist5',
    title: '제작표준서',
    component: () => <DocumentMpsLedgerList5 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST5',
  },
  {
    path: '/documentmpsledgerlist6',
    title: '환경/안전/보건표준서',
    component: () => <DocumentMpsLedgerList6 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST6',
  },
  {
    path: '/documentmpsledgerlist7',
    title: '품질/환경/환경/보건양식리스트',
    component: () => <DocumentMpsLedgerList7 />,
    pgmid: 'DOCUMENTMPSLEDGERLIST7',
  },
  {
    path: '/inspectresultregist',
    title: '입회검사실적등록',
    component: () => <InspectResultRegist />,
    pgmid: 'INSPECTRESULTREGIST',
  },
];

const Order = [
  {
    path: '/ordertradingorderlist',
    title: '주문발주내역조회',
    component: () => <TradingOrderList />,
    pgmid: 'ORDERTRADINGORDERLIST',
  },
  {
    path: '/ordertradingorderlistcasting',
    title: '주문발주내역조회(주물)',
    component: () => <TradingOrderListCasting />,
    pgmid: 'ORDERTRADINGORDERLISTCASTING',
  },
  {
    path: '/ordertradingorderprocess',
    title: '주문발주처리',
    component: () => <TradingOrderProcess />,
    pgmid: 'ORDERTRADINGORDERPROCESS',
  },
  {
    path: '/ordertradingorderprocesscasting',
    title: '주문발주처리(주물)',
    component: () => <TradingOrderProcessCasting />,
    pgmid: 'ORDERTRADINGORDERPROCESSCASTING',
  },
  {
    path: '/ordertradingstatement',
    title: '거래명세서조회',
    component: () => <TradingStatement />,
    pgmid: 'ORDERTRADINGSTATEMENT',
  },
  {
    path: '/ordermantradingstatement',
    title: '거래명세서조회(관리자)',
    component: () => <ManagerTradingStatement />,
    pgmid: 'ORDERMANTRADINGSTATEMENT',
  },
];

const Account = [
  {
    path: '/salesslip',
    title: '일일전표 관리',
    component: () => <SalesSlip />,
    pgmid: 'SALESSLIP',
  },
];

const Admin = [
  {
    path: '/authinsert',
    title: '메뉴권한생성(임시)',
    component: () => <AuthInsert />,
    pgmid: 'AUTHINSERT',
  },
  {
    path: '/authchecker',
    title: '사용자별권한확인(임시)',
    component: () => <AuthChecker />,
    pgmid: 'AUTHCHECKER',
  },
  {
    path: '/template/main/Template',
    title: '템플릿',
    component: () => <Template />,
    pgmid: 'TEMPLATE',
  },
  {
    path: '/menu/main/Menu',
    title: '메뉴관리',
    component: () => <Menu />,
    pgmid: 'MENU',
  },
  {
    path: '/menuAuth/main/MenuAuth',
    title: '사용자별 메뉴권한',
    component: () => <MenuAuth />,
    pgmid: 'MENUAUTH',
  },
  {
    path: '/roleAuth/main/RoleAuth',
    title: '사용자별 기능권한',
    component: () => <RoleAuth />,
    pgmid: 'ROLEAUTH',
  },
  {
    path: '/menuRoleAuth/main/MenuRoleAuth',
    title: '메뉴별 권한관리',
    component: () => <MenuRoleAuth />,
    pgmid: 'MENUROLEAUTH',
  },
  {
    path: '/codeHelper/main/CodeHelper',
    title: '코드등록',
    component: () => <CodeHelper />,
    pgmid: 'CODEHELPER',
  },
  {
    path: '/userManager/main/UserManager',
    title: '사용자 관리',
    component: () => <UserManager />,
    pgmid: 'USERMANAGER',
  },
];

class RouteStore {
  constructor() {
    this.routes = [...Common, ...Business, ...Product, ...Purchase, ...Expense, ...Stock, ...Technology, ...Quality, ...Order, ...Account, ...Admin];

    makeObservable(this, {
      routes: observable,
    });
  }
}

export default RouteStore;
