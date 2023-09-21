import { ValueType } from 'realgrid';

export const GridFields1 = [
  { fieldName: 'CustNm', dataType: ValueType.TEXT },
  { fieldName: 'CustCd', dataType: ValueType.TEXT },
  { fieldName: 'SupNo', dataType: ValueType.TEXT },
  { fieldName: 'SupSeq', dataType: ValueType.TEXT },
  { fieldName: 'BalNo', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
  { fieldName: 'SupplyDate', dataType: ValueType.TEXT },
  { fieldName: 'GoodCd', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'GoodNm', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'UnitNm', dataType: ValueType.TEXT },
  { fieldName: 'NapQty', dataType: ValueType.NUMBER },
  { fieldName: 'Qty', dataType: ValueType.NUMBER },
  { fieldName: 'Su', dataType: ValueType.NUMBER },
  { fieldName: 'QcOkQty', dataType: ValueType.NUMBER },
  { fieldName: 'QcErrorQty', dataType: ValueType.NUMBER },
  { fieldName: 'QcErrorDesc', dataType: ValueType.TEXT },
  { fieldName: 'QcErrorDescNm', dataType: ValueType.TEXT },
  { fieldName: 'QcDate', dataType: ValueType.TEXT },
  { fieldName: 'Complate', dataType: ValueType.TEXT },
];

export const GridColumns1 = [
  {
    fieldName: 'CustNm',
    type: 'data',
    width: 95,
    editable: false,
    styleName: 'center-column',
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    header: {
      text: '업체명',
    },
  },
  {
    fieldName: 'SupNo',
    type: 'data',
    width: 95,
    editable: false,
    header: {
      text: '납품번호',
    },
    styleName: 'center-column',
  },
  {
    fieldName: 'SupplyDate',
    type: 'data',
    width: 60,
    editable: false,
    header: {
      text: '납품일자',
    },
    styleName: 'center-column',
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 160,
    editable: false,
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    fieldName: 'GoodNm',
    type: 'data',
    width: 160,
    editable: false,
    header: {
      text: '품명',
    },
    styleName: 'left-column',
  },
  {
    fieldName: 'Spec',
    type: 'data',
    width: 160,
    editable: false,
    header: {
      text: '규격',
    },
    styleName: 'left-column',
  },
  {
    fieldName: 'UnitNm',
    type: 'data',
    width: 40,
    editable: false,
    header: {
      text: '단위',
    },
    styleName: 'center-column',
  },
  {
    fieldName: 'NapQty',
    type: 'data',
    width: 60,
    editable: false,
    numberFormat: '#,##0.##',
    header: {
      text: '납품량',
    },
    styleName: 'right-column',
  },
  {
    fieldName: 'Qty',
    type: 'data',
    width: 60,
    editable: false,
    numberFormat: '#,##0.##',
    header: {
      text: '중량',
    },
    styleName: 'right-column',
  },
  {
    fieldName: 'Su',
    type: 'data',
    width: 60,
    editable: false,
    numberFormat: '#,##0.##',
    header: {
      text: '길이',
    },
    styleName: 'right-column',
  },
  {
    fieldName: 'QcOkQty',
    type: 'data',
    width: 60,
    editable: false,
    numberFormat: '#,##0.##',
    header: {
      text: '합격수량',
    },
    styleName: 'right-column',
  },
  {
    fieldName: 'QcErrorQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    header: {
      text: '불량수량',
    },
    editor: {
      type: 'number',
      editFormat: '#,##0.##',
    },
    styleName: 'right-column rg-text-red-color',
  },
  {
    fieldName: 'QcErrorDescNm',
    type: 'data',
    width: 60,
    button: 'action',
    header: {
      text: '불량사유',
    },
    // renderer: {
    //   type: 'text',
    // },
    styleName: 'center-column rg-text-red-color',
  },
  {
    fieldName: 'QcDate',
    type: 'data',
    width: 60,
    editable: false,
    header: {
      text: '검사날짜',
    },
    styleName: 'center-column ',
  },
  {
    fieldName: 'Complate',
    type: 'data',
    width: 60,
    editable: false,
    header: {
      text: '완료구분',
    },
    styleName: 'center-column ',
  },
];
