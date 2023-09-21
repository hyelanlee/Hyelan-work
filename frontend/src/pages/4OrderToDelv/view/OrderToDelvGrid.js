import { ValueType } from 'realgrid';

export const GridFields1 = [
  { fieldName: 'SupplyDate', dataType: ValueType.TEXT },
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'CustCd', dataType: ValueType.TEXT },
  { fieldName: 'SupNo', dataType: ValueType.TEXT },
  { fieldName: 'Amount', dataType: ValueType.NUMBER },
  { fieldName: 'Tax', dataType: ValueType.NUMBER },
  { fieldName: 'OkAmt', dataType: ValueType.NUMBER },
  { fieldName: 'DelvNo', dataType: ValueType.TEXT },
  { fieldName: 'VatCd', dataType: ValueType.TEXT },
  { fieldName: 'VatCdNm', dataType: ValueType.TEXT },
  { fieldName: 'Accunit', dataType: ValueType.TEXT },
  { fieldName: 'Factory', dataType: ValueType.TEXT },
  { fieldName: 'Qcyn', dataType: ValueType.TEXT },
];

export const GridColumns1 = [
  {
    name: 'SupplyDate',
    fieldName: 'SupplyDate',
    width: '100',
    header: {
      text: '입고일자',
      showTooltip: true,
    },
  },
  {
    name: 'CustNm',
    fieldName: 'CustNm',
    type: 'data',
    width: '150',
    styleName: 'center-column',
    header: {
      text: '거래처명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'SupNo',
    fieldName: 'SupNo',
    type: 'data',
    width: '100',
    header: {
      text: '명세서번호',
      showTooltip: true,
    },
  },
  // {
  //   name: 'VatCdNm',
  //   fieldName: 'VatCdNm',
  //   type: 'data',
  //   width: '150',
  //   header: {
  //     text: '부가세유형',
  //   },
  // },
  {
    name: 'Amount',
    fieldName: 'Amount',
    type: 'data',
    width: '100',
    styleName: 'right-column',
    header: {
      text: '공급가액',
      showTooltip: true,
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0',
    },
    numberFormat: '#,##0',
  },
  {
    name: 'Tax',
    fieldName: 'Tax',
    type: 'data',
    width: '100',
    styleName: 'right-column',
    header: {
      text: '부가세',
      showTooltip: true,
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0',
    },
    numberFormat: '#,##0',
  },
  {
    name: 'OkAmt',
    fieldName: 'OkAmt',
    type: 'data',
    width: '90',
    header: {
      text: '합계',
      showTooltip: true,
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0',
    },
    styleName: 'right-column',
    numberFormat: '#,##0',
  },
  {
    name: 'Qcyn',
    fieldName: 'Qcyn',
    type: 'data',
    width: '60',
    header: {
      text: '검사구분',
    },
  },
  {
    name: 'DelvNo',
    fieldName: 'DelvNo',
    type: 'data',
    width: '120',
    header: {
      text: '구매입고번호',
      showTooltip: true,
    },
  },
];

export const GridFields2 = [
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'UnitNm', dataType: ValueType.TEXT },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER },
  { fieldName: 'NapQty', dataType: ValueType.NUMBER },
  { fieldName: 'Weight', dataType: ValueType.NUMBER },
  { fieldName: 'Su', dataType: ValueType.NUMBER },
  { fieldName: 'MiQty', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'Amount', dataType: ValueType.NUMBER },
  { fieldName: 'BalNo', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
];

export const GridColumns2 = [
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: '300',
    header: {
      text: '품번',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    fieldName: 'UnitNm',
    type: 'data',
    width: '50',
    header: {
      text: '단위',
    },
  },
  {
    name: 'BalQty',
    fieldName: 'BalQty',
    type: 'data',
    width: '100',
    header: {
      text: '발주수량',
      showTooltip: true,
    },
    styleName: 'right-column',
    numberFormat: '#,##0.##',
  },
  {
    name: 'NapQty',
    fieldName: 'NapQty',
    type: 'data',
    width: '100',
    header: {
      text: '입고수량',
      showTooltip: true,
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0.##',
    },
    styleName: 'right-column',
    numberFormat: '#,##0.##',
  },
  {
    name: 'Weight',
    fieldName: 'Weight',
    type: 'data',
    width: '100',
    header: {
      text: '입고중량',
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0.##',
    },
    styleName: 'right-column',
    numberFormat: '#,##0.##',
  },
  {
    name: 'Su',
    fieldName: 'Su',
    type: 'data',
    width: '100',
    header: {
      text: '입고길이',
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0.##',
    },
    styleName: 'right-column',
    numberFormat: '#,##0.##',
  },
  {
    name: 'MiQty',
    fieldName: 'MiQty',
    type: 'data',
    width: '100',
    header: {
      text: '미입고량',
    },
    styleName: 'right-column',
    numberFormat: '#,##0.##',
  },
  {
    name: 'Price',
    fieldName: 'Price',
    type: 'data',
    width: '60',
    header: {
      text: '단가',
      showTooltip: true,
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0',
    },
    styleName: 'right-column',
    numberFormat: '#,##0',
  },
  {
    name: 'Amount',
    fieldName: 'Amount',
    type: 'data',
    width: '80',
    header: {
      text: '공급가액',
    },
    footer: {
      text: '',
      expression: 'sum',
      numberFormat: '#,##0',
    },
    styleName: 'right-column',
    numberFormat: '#,##0',
  },
  {
    name: 'BalNo',
    fieldName: 'BalNo',
    type: 'data',
    width: '120',
    header: {
      text: '발주번호',
      showTooltip: true,
    },
  },
  {
    name: 'BalSeq',
    fieldName: 'BalSeq',
    type: 'data',
    width: '80',
    header: {
      text: '발주순번',
      showTooltip: true,
    },
  },
];
