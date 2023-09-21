import { ValueType } from 'realgrid';

// 재고장 - 상품, 제품, 반제품
export const GridFields1_1 = [
  { fieldName: 'Goodtypenm', dataType: ValueType.TEXT },
  { fieldName: 'Class2nm', dataType: ValueType.TEXT },
  { fieldName: 'Class3nm', dataType: ValueType.TEXT },
  { fieldName: 'Class4nm', dataType: ValueType.TEXT },
  { fieldName: 'Class5nm', dataType: ValueType.TEXT },
  { fieldName: 'Goodno', dataType: ValueType.TEXT },
  { fieldName: 'Goodnm', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'Acceptqty', dataType: ValueType.NUMBER },
  { fieldName: 'Stockqty', dataType: ValueType.NUMBER },
  { fieldName: 'SafeStock', dataType: ValueType.NUMBER },
  { fieldName: 'Possqty', dataType: ValueType.NUMBER },
  { fieldName: 'GoodCd', dataType: ValueType.TEXT },
  { fieldName: 'Body_Stockqty', dataType: ValueType.NUMBER },
  { fieldName: 'MiProdqty', dataType: ValueType.NUMBER },
  { fieldName: 'MiOrderqty', dataType: ValueType.NUMBER },
  { fieldName: 'MiPmsqty', dataType: ValueType.NUMBER },
  { fieldName: 'BoxingQty', dataType: ValueType.NUMBER },
  { fieldName: 'RealQty', dataType: ValueType.NUMBER },
  { fieldName: 'Avg_Qty_12', dataType: ValueType.NUMBER },
  { fieldName: 'Avg_Qty_6', dataType: ValueType.NUMBER },
  { fieldName: 'Avg_Qty_3', dataType: ValueType.NUMBER },
  { fieldName: 'Itemno', dataType: ValueType.TEXT },
  { fieldName: 'check', dataType: ValueType.TEXT },
];

export const GridColumns1_1 = [
  {
    fieldName: 'check',
    type: 'data',
    width: 40,
    styleName: 'center-column',
    header: {
      text: '발행',
    },
    renderer: {
      type: 'check',
      trueValues: 'Y',
      falseValues: 'N',
    },
  },
  {
    fieldName: 'Goodtypenm',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '구분',
    },
  },
  {
    fieldName: 'Class2nm',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '대분류',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class3nm',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '중분류',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class4nm',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '소분류',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class5nm',
    type: 'data',
    width: 130,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '강종',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Goodno',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '품명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Goodnm',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Spec',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '규격',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Acceptqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수주량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Stockqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '현재고량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'SafeStock',
    type: 'data',
    width: 70,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '안전재고량',
    },
  },
  {
    fieldName: 'Possqty',
    type: 'data',
    width: 70,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '가용재고량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Body_Stockqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '바디재고',
    },
  },
  {
    fieldName: 'MiProdqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '미생산량',
    },
  },
  {
    fieldName: 'MiOrderqty',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '미입고량(발주)',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'MiPmsqty',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '미입고량(외주)',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'BoxingQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '포장수량',
    },
  },
  {
    fieldName: 'RealQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '실제수량',
    },
  },
  {
    fieldName: 'Avg_Qty_12',
    type: 'data',
    width: 110,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '평균출고량(12개월)',
    },
  },
  {
    fieldName: 'Avg_Qty_6',
    type: 'data',
    width: 110,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '평균출고량(6개월)',
    },
  },
  {
    fieldName: 'Avg_Qty_3',
    type: 'data',
    width: 110,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '평균출고량(3개월)',
    },
  },
  {
    fieldName: 'Itemno',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '바디품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
];

// 재고장 - 원재료, 단조
export const GridFields1_2 = [
  { fieldName: 'GoodTypeNm', dataType: ValueType.TEXT },
  { fieldName: 'Class2Nm', dataType: ValueType.TEXT },
  { fieldName: 'Class3Nm', dataType: ValueType.TEXT },
  { fieldName: 'Class4Nm', dataType: ValueType.TEXT },
  { fieldName: 'Class5Nm', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'GoodNm', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'StkQty', dataType: ValueType.NUMBER },
  { fieldName: 'reqqty', dataType: ValueType.NUMBER },
  { fieldName: 'possQty', dataType: ValueType.NUMBER },
  { fieldName: 'SafeStock', dataType: ValueType.NUMBER },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'MiOrderqty', dataType: ValueType.NUMBER },
  { fieldName: 'Avg_Qty_12', dataType: ValueType.NUMBER },
  { fieldName: 'Avg_Qty_6', dataType: ValueType.NUMBER },
  { fieldName: 'Avg_Qty', dataType: ValueType.NUMBER },
  { fieldName: 'Custcd', dataType: ValueType.TEXT },
  { fieldName: 'Custnm', dataType: ValueType.TEXT },
  { fieldName: 'check', dataType: ValueType.TEXT },
];

export const GridColumns1_2 = [
  {
    fieldName: 'check',
    type: 'data',
    width: 40,
    styleName: 'center-column',
    header: {
      text: '발주',
    },
    renderer: {
      type: 'check',
      trueValues: 'Y',
      falseValues: 'N',
    },
  },
  {
    fieldName: 'GoodTypeNm',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '구분',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class2Nm',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '대분류',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class3Nm',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '중분류',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class4Nm',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '소분류',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Class5Nm',
    type: 'data',
    width: 130,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '강종',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '품명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'GoodNm',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Spec',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '규격',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'StkQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '현재고량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'reqqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '출고요청량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'possQty',
    type: 'data',
    width: 70,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '가용재고량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'SafeStock',
    type: 'data',
    width: 70,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '안전재고량',
    },
  },
  {
    fieldName: 'MiOrderqty',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '미입고량(발주)',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Avg_Qty_12',
    type: 'data',
    width: 110,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '평균출고량(12개월)',
    },
  },
  {
    fieldName: 'Avg_Qty_6',
    type: 'data',
    width: 110,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '평균출고량(6개월)',
    },
  },
  {
    fieldName: 'Avg_Qty',
    type: 'data',
    width: 110,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '평균출고량(3개월)',
    },
  },
];

// 구매발주내역(전체)
export const GridFields2 = [
  { fieldName: 'Balno', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER },
  { fieldName: 'BalPrice', dataType: ValueType.NUMBER },
  { fieldName: 'BalAmount', dataType: ValueType.NUMBER },
  { fieldName: 'BalDate', dataType: ValueType.TEXT },
  { fieldName: 'NapDate', dataType: ValueType.TEXT },
  { fieldName: 'DelvQty', dataType: ValueType.NUMBER },
  { fieldName: 'DelvPrice', dataType: ValueType.NUMBER },
  { fieldName: 'DelvAmount', dataType: ValueType.NUMBER },
  { fieldName: 'DelvDate', dataType: ValueType.TEXT },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'MiAmount', dataType: ValueType.NUMBER },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'clstype', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
  { fieldName: 'check', dataType: ValueType.TEXT },
];

export const GridColumns2 = [
  {
    fieldName: 'Balno',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '발주번호',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 100,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '거래처명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'BalPrice',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'BalAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '금액',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'BalDate',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '발주일자',
    },
  },
  {
    fieldName: 'NapDate',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '납기일자',
    },
  },
  {
    fieldName: 'DelvQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'DelvPrice',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'DelvAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '금액',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'DelvDate',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '최종입고날짜',
    },
  },
  {
    fieldName: 'MiQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Price',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'MiAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '금액',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'check',
    type: 'data',
    width: 40,
    styleName: 'center-column',
    header: {
      text: '선택',
    },
    renderer: {
      type: 'check',
      trueValues: 'Y',
      falseValues: 'N',
    },
  },
];

// 외주발주내역(전체)
export const GridFields3 = [
  { fieldName: 'Balno', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
  { fieldName: 'Workno', dataType: ValueType.TEXT },
  { fieldName: 'ContractYn', dataType: ValueType.TEXT },
  { fieldName: 'PmsProcesscd', dataType: ValueType.TEXT },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'Clstype', dataType: ValueType.TEXT },
  { fieldName: 'ProductGubun', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'Custnm', dataType: ValueType.TEXT },
  { fieldName: 'ProcNm', dataType: ValueType.TEXT },
  { fieldName: 'Acceptqty', dataType: ValueType.NUMBER },
  { fieldName: 'StockQty', dataType: ValueType.NUMBER },
  { fieldName: 'Possqty', dataType: ValueType.NUMBER },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER },
  { fieldName: 'BalPrice', dataType: ValueType.NUMBER },
  { fieldName: 'BalAmount', dataType: ValueType.NUMBER },
  { fieldName: 'Baldate', dataType: ValueType.TEXT },
  { fieldName: 'NapDate', dataType: ValueType.TEXT },
  { fieldName: 'DelvQty', dataType: ValueType.NUMBER },
  { fieldName: 'DelvPrice', dataType: ValueType.NUMBER },
  { fieldName: 'DelvAmount', dataType: ValueType.NUMBER },
  { fieldName: 'Delvdate', dataType: ValueType.TEXT },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'MiAmount', dataType: ValueType.NUMBER },
  { fieldName: 'check', dataType: ValueType.TEXT },
];

export const GridColumns3 = [
  {
    fieldName: 'Workno',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '작업지시번호',
    },
  },
  {
    fieldName: 'ContractYn',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '사급/도급',
    },
  },
  {
    fieldName: 'ProductGubun',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '계획분/수주분',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Custnm',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '거래처명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'ProcNm',
    type: 'data',
    width: 90,
    styleName: 'left-column',
    editable: false,
    header: {
      text: '공정명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Acceptqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수주량',
    },
  },
  {
    fieldName: 'StockQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '재고량',
    },
  },
  {
    fieldName: 'Possqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '가용재고',
    },
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'BalPrice',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'BalAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '금액',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Baldate',
    type: 'data',
    width: 90,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '발주일자',
    },
  },
  {
    fieldName: 'NapDate',
    type: 'data',
    width: 90,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '납기일자',
    },
  },
  {
    fieldName: 'DelvQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'DelvPrice',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'DelvAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '금액',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Delvdate',
    type: 'data',
    width: 90,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '최종입고일자',
    },
  },
  {
    fieldName: 'MiQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '수량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Price',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    editable: false,
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'MiAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '금액',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'check',
    type: 'data',
    width: 40,
    header: {
      text: '선택',
    },
    renderer: {
      type: 'check',
      trueValues: 'Y',
      falseValues: 'N',
    },
  },
];

// 생산입고대장(전체)
export const GridFields4 = [
  { fieldName: 'Goodtypenm', dataType: ValueType.TEXT },
  { fieldName: 'Workno', dataType: ValueType.TEXT },
  { fieldName: 'PmsYn', dataType: ValueType.TEXT },
  { fieldName: 'Acceptno', dataType: ValueType.TEXT },
  { fieldName: 'InoutDate', dataType: ValueType.TEXT },
  { fieldName: 'Class2nm', dataType: ValueType.TEXT },
  { fieldName: 'Class3nm', dataType: ValueType.TEXT },
  { fieldName: 'Class4nm', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'Prodqty', dataType: ValueType.NUMBER },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'GoodType', dataType: ValueType.TEXT },
  { fieldName: 'Gubun_Total', dataType: ValueType.TEXT },
  { fieldName: 'Class3_RG', dataType: ValueType.TEXT },
];

export const GridColumns4 = [
  {
    fieldName: 'Goodtypenm',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '구분',
    },
  },
  {
    fieldName: 'Workno',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '작업지시번호',
    },
  },
  {
    fieldName: 'PmsYn',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    header: {
      text: '외주유무',
    },
  },
  {
    fieldName: 'Acceptno',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    header: {
      text: '수주유무',
    },
  },
  {
    fieldName: 'InoutDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '입고일자',
    },
  },
  {
    fieldName: 'Class2nm',
    type: 'data',
    width: 100,
    styleName: 'left-column',
    header: {
      text: '대분류',
    },
  },
  {
    fieldName: 'Class3nm',
    type: 'data',
    width: 100,
    styleName: 'left-column',
    header: {
      text: '중분류',
    },
  },
  {
    fieldName: 'Class4nm',
    type: 'data',
    width: 100,
    styleName: 'left-column',
    header: {
      text: '소분류',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '품번',
    },
  },
  {
    fieldName: 'Spec',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '규격',
    },
    footers: [
      { text: '[피    팅]', styleName: 'right-column' },
      { text: '[밸    브]', styleName: 'right-column' },
      { text: '[사    내]', styleName: 'right-column' },
      { text: '[외    주]', styleName: 'right-column' },
      { text: '[외주(후가공)]', styleName: 'right-column' },
      { text: '[반제품계]', styleName: 'right-column' },
      { text: '[피    팅]', styleName: 'right-column' },
      { text: '[밸    브]', styleName: 'right-column' },
      { text: '[제 품 계]', styleName: 'right-column' },
    ],
  },
  {
    fieldName: 'Prodqty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '생산량',
    },
    footer: {
      numberFormat: '#,##0',
    },
  },
  {
    fieldName: 'Class3_RG',
    type: 'data',
    width: 80,
    styleName: 'left-column',
    header: {
      text: '소재정보',
    },
  },
];

// 발주/외주입고내역(전체)
export const GridFields6 = [
  { fieldName: 'workNo', dataType: ValueType.TEXT },
  { fieldName: 'ProductGubun', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'Procnm', dataType: ValueType.TEXT },
  { fieldName: 'InoutDate', dataType: ValueType.TEXT },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER },
  { fieldName: 'DelvQty', dataType: ValueType.NUMBER },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'Amount', dataType: ValueType.NUMBER },
  { fieldName: 'NapDate', dataType: ValueType.TEXT },
];

export const GridColumns6 = [
  {
    fieldName: 'workNo',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    header: {
      text: '작지/발주번호',
    },
  },
  {
    fieldName: 'ProductGubun',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '계획분/수주분',
    },
  },
  {
    fieldName: 'Goodno',
    type: 'data',
    width: 170,
    styleName: 'left-column',
    header: {
      text: '품번',
    },
  },
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 170,
    styleName: 'left-column',
    header: {
      text: '거래처',
    },
  },
  {
    fieldName: 'Procnm',
    type: 'data',
    width: 100,
    styleName: 'left-column',
    header: {
      text: '공정명',
    },
  },
  {
    fieldName: 'Inoutdate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '입고일',
    },
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '발주량',
    },
  },
  {
    fieldName: 'DelvQty',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '입고량',
    },
  },
  {
    fieldName: 'MiQty',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '미납량',
    },
  },
  {
    fieldName: 'Price',
    type: 'data',
    width: 90,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'Amount',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '공급가액',
    },
  },
  {
    fieldName: 'NapDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '납기일',
    },
  },
];

// 반제품입고내역(보고용) - 품번별입고내역
export const GridFields8_1 = [
  { fieldName: 'Goodtypenm', dataType: ValueType.TEXT },
  { fieldName: 'Gubun', dataType: ValueType.TEXT },
  { fieldName: 'InoutDate', dataType: ValueType.TEXT },
  { fieldName: 'Workno', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'ProdQty', dataType: ValueType.NUMBER },
];

export const GridColumns8_1 = [
  {
    fieldName: 'Gubun',
    type: 'data',
    width: 80,
    styleName: 'center-column',
    header: {
      text: '구분',
    },
  },
  {
    fieldName: 'InoutDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '생산일자',
    },
  },
  {
    fieldName: 'Workno',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '작업지시번호',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 170,
    styleName: 'left-column',
    header: {
      text: '품번',
    },
  },
  {
    fieldName: 'ProdQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '생산량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
];

// 반제품입고내역(보고용) - 기간별집계자료
export const GridFields8_2 = [
  { fieldName: 'InoutDate', dataType: ValueType.TEXT },
  { fieldName: '사내 BODY', dataType: ValueType.NUMBER },
  { fieldName: '사내 기타', dataType: ValueType.NUMBER },
  { fieldName: '외주 BODY (후가공)', dataType: ValueType.NUMBER },
  { fieldName: '외주 BODY', dataType: ValueType.NUMBER },
  { fieldName: 'FERRULE', dataType: ValueType.NUMBER },
  { fieldName: 'SLEEVE', dataType: ValueType.NUMBER },
  { fieldName: 'NUT', dataType: ValueType.NUMBER },
  { fieldName: 'VALVE ACCY', dataType: ValueType.NUMBER },
  { fieldName: 'VALVE ACCY(구매)', dataType: ValueType.NUMBER },
  { fieldName: '외주-기타', dataType: ValueType.NUMBER },
  { fieldName: '기타', dataType: ValueType.NUMBER },
  { fieldName: '일계', dataType: ValueType.NUMBER },
  { fieldName: '사내 BODY(포인트)', dataType: ValueType.NUMBER },
];

export const GridColumns8_2 = [
  {
    fieldName: 'InoutDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '생산일자',
    },
  },
  {
    fieldName: '사내 BODY',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '사내 BODY',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '사내 기타',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '사내 기타',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '외주 BODY (후가공)',
    type: 'data',
    width: 120,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '외주 BODY(후가공)',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '외주 BODY',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '외주 BODY',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'FERRULE',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: 'FERRULE',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'SLEEVE',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: 'SLEEVE',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'NUT',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: 'NUT',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'VALVE ACCY',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: 'VALVE ACCY',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'VALVE ACCY(구매)',
    type: 'data',
    width: 120,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: 'VALVE ACCY(구매)',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '외주-기타',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '외주-기타',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '기타',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '기타',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '일계',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '일계',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: '사내 BODY(포인트)',
    type: 'data',
    width: 120,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '사내 BODY(포인트)',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 수주동향 // 재고장 - 상품, 제품, 반제품 - 출고동향 // 재고장 - 원재료, 단조 - 출고동향
export const GridFields10_1 = [
  { fieldName: 'Be_11_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_10_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_09_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_08_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_07_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_06_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_05_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_04_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_03_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_02_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_01_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Be_00_Month', dataType: ValueType.NUMBER },
  { fieldName: 'Totalqty', dataType: ValueType.NUMBER },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'T_11_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_10_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_09_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_08_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_07_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_06_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_05_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_04_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_03_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_02_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_01_Month', dataType: ValueType.TEXT },
  { fieldName: 'T_00_Month', dataType: ValueType.TEXT },
];

export const GridColumns10_1 = [
  {
    fieldName: 'Be_11_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_10_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_09_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_08_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_07_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_06_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_05_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_04_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_03_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_02_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_01_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Be_00_Month',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '월',
    },
  },
  {
    fieldName: 'Totalqty',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '합계',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 작업지시서발행내역
export const GridFields10_3 = [
  { fieldName: 'Workno', dataType: ValueType.TEXT },
  { fieldName: 'DeliveryDate', dataType: ValueType.TEXT },
  { fieldName: 'Pmsyn', dataType: ValueType.TEXT },
  { fieldName: 'Progressnm', dataType: ValueType.TEXT },
  { fieldName: 'orderqty', dataType: ValueType.NUMBER },
  { fieldName: 'Rm_outyn', dataType: ValueType.TEXT },
  { fieldName: 'proc_010', dataType: ValueType.TEXT },
  { fieldName: 'cnc', dataType: ValueType.TEXT },
  { fieldName: 'proc_019', dataType: ValueType.TEXT },
  { fieldName: 'proc_014', dataType: ValueType.TEXT },
  { fieldName: 'proc_015', dataType: ValueType.TEXT },
  { fieldName: 'prodqty', dataType: ValueType.NUMBER },
];

export const GridColumns10_3 = [
  {
    fieldName: 'Workno',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '작업지시번호',
    },
  },
  {
    fieldName: 'DeliveryDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '납기일',
    },
  },
  {
    fieldName: 'Pmsyn',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '생산/외주',
    },
  },
  {
    fieldName: 'Progressnm',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '진행상태',
    },
  },
  {
    fieldName: 'orderqty',
    type: 'data',
    width: 70,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '지시량',
    },
  },
  {
    fieldName: 'Rm_outyn',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '소재출고',
    },
  },
  {
    fieldName: 'proc_010',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '절단',
    },
  },
  {
    fieldName: 'cnc',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: 'CNC',
    },
  },
  {
    fieldName: 'proc_019',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '전조',
    },
  },
  {
    fieldName: 'proc_014',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '사상',
    },
  },
  {
    fieldName: 'proc_015',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '마킹',
    },
  },
  {
    fieldName: 'prodqty',
    type: 'data',
    width: 70,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '생산입고',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 구매발주내역
export const GridFields10_4 = [
  { fieldName: 'Balno', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER },
  { fieldName: 'BalPrice', dataType: ValueType.NUMBER },
  { fieldName: 'BalAmount', dataType: ValueType.NUMBER },
  { fieldName: 'BalDate', dataType: ValueType.TEXT },
  { fieldName: 'NapDate', dataType: ValueType.TEXT },
  { fieldName: 'DelvQty', dataType: ValueType.NUMBER },
  { fieldName: 'DelvPrice', dataType: ValueType.NUMBER },
  { fieldName: 'DelvAmount', dataType: ValueType.NUMBER },
  { fieldName: 'DelvDate', dataType: ValueType.TEXT },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'MiAmount', dataType: ValueType.NUMBER },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'clstype', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
];

export const GridColumns10_4 = [
  {
    fieldName: 'Balno',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '발주번호',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '거래처명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '수량',
    },
  },
  {
    fieldName: 'BalPrice',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'BalAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '금액',
    },
  },
  {
    fieldName: 'BalDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '발주일자',
    },
  },
  {
    fieldName: 'NapDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '납기일자',
    },
  },
  {
    fieldName: 'DelvQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '수량',
    },
  },
  {
    fieldName: 'DelvPrice',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'DelvAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '금액',
    },
  },
  {
    fieldName: 'DelvDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '최종입고일자',
    },
  },
  {
    fieldName: 'MiQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '수량',
    },
  },
  {
    fieldName: 'Price',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'MiAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '금액',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 외주발주내역 // 원재료, 단조 - 외주발주내역
export const GridFields10_5 = [
  { fieldName: 'Balno', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
  { fieldName: 'Workno', dataType: ValueType.TEXT },
  { fieldName: 'ContractYn', dataType: ValueType.TEXT },
  { fieldName: 'PmsProcesscd', dataType: ValueType.TEXT },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'Clstype', dataType: ValueType.TEXT },
  { fieldName: 'ProductGubun', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'ProcNm', dataType: ValueType.TEXT },
  { fieldName: 'Acceptqty', dataType: ValueType.TEXT },
  { fieldName: 'StockQty', dataType: ValueType.NUMBER },
  { fieldName: 'Possqty', dataType: ValueType.NUMBER },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER },
  { fieldName: 'BalPrice', dataType: ValueType.NUMBER },
  { fieldName: 'BalAmount', dataType: ValueType.NUMBER },
  { fieldName: 'BalDate', dataType: ValueType.TEXT },
  { fieldName: 'NapDate', dataType: ValueType.TEXT },
  { fieldName: 'DelvQty', dataType: ValueType.NUMBER },
  { fieldName: 'DelvPrice', dataType: ValueType.NUMBER },
  { fieldName: 'DelvAmount', dataType: ValueType.NUMBER },
  { fieldName: 'DelvDate', dataType: ValueType.TEXT },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'MiAmount', dataType: ValueType.NUMBER },
];

export const GridColumns10_5 = [
  {
    fieldName: 'Workno',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '작업지시번호',
    },
  },
  {
    fieldName: 'ContractYn',
    type: 'data',
    width: 60,
    styleName: 'center-column',
    header: {
      text: '사급/도급',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 180,
    styleName: 'left-column',
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 180,
    styleName: 'left-column',
    header: {
      text: '거래처명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'ProcNm',
    type: 'data',
    width: 100,
    styleName: 'left-column',
    header: {
      text: '공정명',
    },
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '수량',
    },
  },
  {
    fieldName: 'BalPrice',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'BalAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '금액',
    },
  },
  {
    fieldName: 'BalDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '발주일자',
    },
  },
  {
    fieldName: 'NapDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '납기일자',
    },
  },
  {
    fieldName: 'DelvQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '수량',
    },
  },
  {
    fieldName: 'DelvPrice',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'DelvAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '금액',
    },
  },
  {
    fieldName: 'DelvDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '최종입고일자',
    },
  },
  {
    fieldName: 'MiQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '수량',
    },
  },
  {
    fieldName: 'Price',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '단가',
    },
  },
  {
    fieldName: 'MiAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '금액',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 미결수주내역
export const GridFields10_6 = [
  { fieldName: 'AcceptDate', dataType: ValueType.TEXT },
  { fieldName: 'Napdate', dataType: ValueType.TEXT },
  { fieldName: 'acceptno', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'Acceptqty', dataType: ValueType.NUMBER },
  { fieldName: 'OutQty', dataType: ValueType.NUMBER },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'StockQty', dataType: ValueType.NUMBER },
  { fieldName: 'PossQty', dataType: ValueType.NUMBER },
  { fieldName: 'Cretime', dataType: ValueType.TEXT },
  { fieldName: 'Modtime', dataType: ValueType.TEXT },
  { fieldName: 'BoxingQty', dataType: ValueType.NUMBER },
  { fieldName: 'RealQty', dataType: ValueType.NUMBER },
  { fieldName: 'Remark', dataType: ValueType.TEXT },
];

export const GridColumns10_6 = [
  {
    fieldName: 'AcceptDate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '수주일자',
    },
  },
  {
    fieldName: 'Napdate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '납기일자',
    },
  },
  {
    fieldName: 'acceptno',
    type: 'data',
    width: 150,
    styleName: 'center-column',
    header: {
      text: '수주번호',
    },
  },
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '거래처',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Acceptqty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '수주량',
    },
  },
  {
    fieldName: 'OutQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '출고량',
    },
  },
  {
    fieldName: 'MiQty',
    type: 'data',
    width: 60,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '미결수량',
    },
  },
  {
    fieldName: 'StockQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '재고량',
    },
  },
  {
    fieldName: 'PossQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '가용재고',
    },
  },
  {
    fieldName: 'Cretime',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '작성일',
    },
  },
  {
    fieldName: 'Modtime',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '수정일',
    },
  },
  {
    fieldName: 'BoxingQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '포장수량',
    },
  },
  {
    fieldName: 'RealQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '실제수량',
    },
  },
  {
    fieldName: 'Remark',
    type: 'data',
    width: 180,
    styleName: 'left-column',
    header: {
      text: '비고',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 출고요청내역(상품, 제품, 반제품)
export const GridFields10_7 = [
  { fieldName: 'Reqdate', dataType: ValueType.TEXT },
  { fieldName: 'Forno', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'Itemno', dataType: ValueType.TEXT },
  { fieldName: 'Stockqty', dataType: ValueType.NUMBER },
  { fieldName: 'Mi_Outqty', dataType: ValueType.TEXT },
  { fieldName: 'Requirement', dataType: ValueType.TEXT },
  { fieldName: 'Reqqty', dataType: ValueType.TEXT },
];

export const GridColumns10_7 = [
  {
    fieldName: 'Reqdate',
    type: 'data',
    width: 100,
    styleName: 'center-column',
    header: {
      text: '출고요청일자',
    },
  },
  {
    fieldName: 'Forno',
    type: 'data',
    width: 130,
    styleName: 'center-column',
    header: {
      text: '요청번호',
    },
  },
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 200,
    styleName: 'left-column',
    header: {
      text: '거래처',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 180,
    styleName: 'left-column',
    header: {
      text: '출고요청품번',
    },
  },
  {
    fieldName: 'Itemno',
    type: 'data',
    width: 180,
    styleName: 'left-column',
    header: {
      text: '반제품품번',
    },
  },
  {
    fieldName: 'Stockqty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '제품재고량',
    },
  },
  {
    fieldName: 'Mi_Outqty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '출고요청량',
    },
  },
  {
    fieldName: 'Requirement',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '반제품소요량',
    },
  },
  {
    fieldName: 'Reqqty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '출고예정량',
    },
  },
];

// 재고장 - 원재료, 단조 - 출고요청내역
export const GridFields11_3 = [
  { fieldName: 'Workdate', dataType: ValueType.TEXT },
  { fieldName: 'Workno', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'RM_Goodno', dataType: ValueType.TEXT },
  { fieldName: 'OrderQty', dataType: ValueType.NUMBER },
  { fieldName: 'Requirement', dataType: ValueType.NUMBER },
  { fieldName: 'TotalRequirement', dataType: ValueType.NUMBER },
  { fieldName: 'OutQty', dataType: ValueType.NUMBER },
  { fieldName: 'MiOutQty', dataType: ValueType.NUMBER },
];

export const GridColumns11_3 = [
  {
    fieldName: 'Workdate',
    type: 'data',
    width: 150,
    styleName: 'center-column',
    header: {
      text: '작업지시서발행일',
    },
  },
  {
    fieldName: 'Workno',
    type: 'data',
    width: 150,
    styleName: 'center-column',
    header: {
      text: '작업지시번호',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '생산품번',
    },
  },
  {
    fieldName: 'RM_Goodno',
    type: 'data',
    width: 150,
    styleName: 'left-column',
    header: {
      text: '소요자재',
    },
  },
  {
    fieldName: 'OrderQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '지시량',
    },
  },
  {
    fieldName: 'Requirement',
    type: 'data',
    width: 100,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '개당소요량',
    },
  },
  {
    fieldName: 'TotalRequirement',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '소요량',
    },
  },
  {
    fieldName: 'OutQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '출고량',
    },
  },
  {
    fieldName: 'MiOutQty',
    type: 'data',
    width: 80,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '미출고량',
    },
  },
];

// 구매발주내역(전체) 레이아웃
export const GridLayout1_2 = [
  {
    name: 'GROUP0',
    direction: 'horizontal',
    items: ['Balno'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP1',
    direction: 'horizontal',
    items: ['GoodNo'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP2',
    direction: 'horizontal',
    items: ['CustNm'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP3',
    direction: 'horizontal',
    items: ['BalQty', 'BalPrice', 'BalAmount', 'BalDate', 'NapDate'],
    header: {
      text: '발주',
    },
  },
  {
    name: 'GROUP4',
    direction: 'horizontal',
    items: ['DelvQty', 'DelvPrice', 'DelvAmount', 'DelvDate'],
    header: {
      text: '입고',
    },
  },
  {
    name: 'GROUP5',
    direction: 'horizontal',
    items: ['MiQty', 'Price', 'MiAmount'],
    header: {
      text: '미납',
    },
  },
  {
    name: 'GROUP6',
    direction: 'horizontal',
    items: ['check'],
    header: {
      visible: false,
    },
  },
];

// 구매발주내역(전체) 레이아웃
export const GridLayout1_3 = [
  {
    name: 'GROUP0',
    direction: 'horizontal',
    items: ['Workno'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP1',
    direction: 'horizontal',
    items: ['ContractYn'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP2',
    direction: 'horizontal',
    items: ['ProductGubun'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP3',
    direction: 'horizontal',
    items: ['GoodNo'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP4',
    direction: 'horizontal',
    items: ['Custnm'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP5',
    direction: 'horizontal',
    items: ['ProcNm'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP6',
    direction: 'horizontal',
    items: ['Acceptqty', 'StockQty', 'Possqty'],
    header: {
      text: '재고',
    },
  },
  {
    name: 'GROUP7',
    direction: 'horizontal',
    items: ['BalQty', 'BalPrice', 'BalAmount', 'Baldate', 'NapDate'],
    header: {
      text: '발주',
    },
  },
  {
    name: 'GROUP8',
    direction: 'horizontal',
    items: ['DelvQty', 'DelvPrice', 'DelvAmount', 'Delvdate'],
    header: {
      text: '입고',
    },
  },
  {
    name: 'GROUP9',
    direction: 'horizontal',
    items: ['MiQty', 'Price', 'MiAmount'],
    header: {
      text: '미납',
    },
  },
  {
    name: 'GROUP10',
    direction: 'horizontal',
    items: ['check'],
    header: {
      visible: false,
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 구매발주내역 레이아웃
export const GridLayout10_4 = [
  {
    name: 'GROUP0',
    direction: 'horizontal',
    items: ['Balno'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP1',
    direction: 'horizontal',
    items: ['GoodNo'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP2',
    direction: 'horizontal',
    items: ['CustNm'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP3',
    direction: 'horizontal',
    items: ['BalQty', 'BalPrice', 'BalAmount', 'BalDate', 'NapDate'],
    header: {
      text: '발주',
    },
  },
  {
    name: 'GROUP4',
    direction: 'horizontal',
    items: ['DelvQty', 'DelvPrice', 'DelvAmount', 'DelvDate'],
    header: {
      text: '입고',
    },
  },
  {
    name: 'GROUP5',
    direction: 'horizontal',
    items: ['MiQty', 'Price', 'MiAmount'],
    header: {
      text: '미납',
    },
  },
];

// 재고장 - 상품, 제품, 반제품 - 외주발주내역 레이아웃
export const GridLayout10_5 = [
  {
    name: 'GROUP0',
    direction: 'horizontal',
    items: ['Workno'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP1',
    direction: 'horizontal',
    items: ['ContractYn'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP2',
    direction: 'horizontal',
    items: ['GoodNo'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP3',
    direction: 'horizontal',
    items: ['CustNm'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP4',
    direction: 'horizontal',
    items: ['ProcNm'],
    header: {
      visible: false,
    },
  },
  {
    name: 'GROUP5',
    direction: 'horizontal',
    items: ['BalQty', 'BalPrice', 'BalAmount', 'BalDate', 'NapDate'],
    header: {
      text: '발주',
    },
  },
  {
    name: 'GROUP6',
    direction: 'horizontal',
    items: ['DelvQty', 'DelvPrice', 'DelvAmount', 'DelvDate'],
    header: {
      text: '입고',
    },
  },
  {
    name: 'GROUP7',
    direction: 'horizontal',
    items: ['MiQty', 'Price', 'MiAmount'],
    header: {
      text: '미납',
    },
  },
];
