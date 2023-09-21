import { ValueType } from 'realgrid';

export const GridFields1 = [
  { fieldName: 'BalNo', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
  { fieldName: 'GoodCd', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'GoodNm', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'UnitCd', dataType: ValueType.TEXT },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER }, //발주량
  { fieldName: 'UnitNm', dataType: ValueType.TEXT }, //단위
  { fieldName: 'Weight', dataType: ValueType.NUMBER }, //중량
  { fieldName: 'Su', dataType: ValueType.NUMBER }, //길이
  { fieldName: 'NapQty', dataType: ValueType.NUMBER }, //납품량
  { fieldName: 'MiNapQty', dataType: ValueType.NUMBER }, //미납량
  { fieldName: 'MiWeight', dataType: ValueType.NUMBER }, //미납중량
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'Amount', dataType: ValueType.NUMBER },
  { fieldName: 'BalDate', dataType: ValueType.TEXT, datetimeFormat: 'yyyyMMdd' },
  { fieldName: 'NapDate', dataType: ValueType.TEXT, datetimeFormat: 'yyyyMMdd' },
  { fieldName: 'Remark', dataType: ValueType.TEXT },
  { fieldName: 'Clstype', dataType: ValueType.TEXT },
  { fieldName: 'isSelected', dataType: ValueType.TEXT },
];

export const GirdColumns1 = [
  {
    fieldName: 'BalNo',
    type: 'data',
    width: 95,
    header: {
      text: '발주번호',
    },
    styleName: 'center-column',
  },
  {
    fieldName: 'BalSeq',
    type: 'data',
    width: 60,
    header: {
      text: '발주순번',
    },
    styleName: 'center-column',
  },
  {
    fieldName: 'BalDate',
    type: 'data',
    width: 75,
    numberFormat: '#,##0',
    styleName: 'center-column',
    datetimeFormat: 'yyyy-MM-dd',
    header: {
      text: '발주일',
    },
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 180,
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
    width: 180,
    header: {
      text: '품명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    fieldName: 'Spec',
    type: 'data',
    width: 180,
    header: {
      text: '규격',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    header: {
      text: '발주량',
    },
    styleName: 'right-column rg-text-red-color',
  },
  {
    fieldName: 'UnitNm',
    type: 'data',
    width: 40,
    header: {
      text: '단위',
    },
    styleName: 'center-column',
  },
  {
    fieldName: 'Weight',
    type: 'data',
    width: 60,
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
    numberFormat: '#,##0.##',
    styleName: 'right-column ',
    header: {
      text: '길이',
    },
  },
  {
    fieldName: 'NapQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    styleName: 'right-column',
    header: {
      text: '납품량',
    },
  },
  {
    fieldName: 'MiNapQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    styleName: 'right-column rg-text-red-color',
    header: {
      text: '미납량',
    },
  },
  {
    fieldName: 'Price',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    styleName: 'right-column',
    header: {
      text: '발주단가',
    },
  },
  {
    fieldName: 'Amount',
    type: 'data',
    width: 70,
    numberFormat: '#,##0',
    styleName: 'right-column',
    header: {
      text: '발주금액',
    },
  },
  {
    fieldName: 'NapDate',
    type: 'data',
    width: 75,
    styleName: 'center-column',
    datetimeFormat: 'yyyy-MM-dd',
    header: {
      text: '납기일',
    },
  },
  {
    fieldName: 'Remark',
    type: 'data',
    width: 180,
    numberFormat: '#,##0',
    styleName: 'left-column',
    header: {
      text: '비고',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Clstype',
    type: 'data',
    width: 40,
    numberFormat: '#,##0',
    styleName: 'center-column',
    header: {
      text: '마감',
    },
  },
];

export const GridFields2 = [
  { fieldName: 'Accunit', dataType: ValueType.TEXT },
  { fieldName: 'Factory', dataType: ValueType.TEXT },
  { fieldName: 'No', dataType: ValueType.TEXT },
  { fieldName: 'SupNo', dataType: ValueType.TEXT },
  { fieldName: 'SupSeq', dataType: ValueType.TEXT },
  { fieldName: 'BalNo', dataType: ValueType.TEXT },
  { fieldName: 'BalSeq', dataType: ValueType.TEXT },
  { fieldName: 'DelvGuid', dataType: ValueType.TEXT },
  { fieldName: 'GoodCd', dataType: ValueType.TEXT },
  { fieldName: 'GoodNo', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'UnitCd', dataType: ValueType.TEXT },
  { fieldName: 'GoodNm', dataType: ValueType.TEXT },
  { fieldName: 'BalQty', dataType: ValueType.NUMBER }, //발주수량
  { fieldName: 'UnitNm', dataType: ValueType.TEXT }, //단위
  { fieldName: 'NapQty', dataType: ValueType.NUMBER }, //납품수량
  { fieldName: 'Qty', dataType: ValueType.NUMBER }, //중량
  { fieldName: 'Su', dataType: ValueType.NUMBER }, //길이
  { fieldName: 'MiNapQty', dataType: ValueType.NUMBER }, //미납량
  { fieldName: 'ErrorQty', dataType: ValueType.NUMBER }, //미납량
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'Tax', dataType: ValueType.NUMBER },
  { fieldName: 'Amount', dataType: ValueType.NUMBER },
  { fieldName: 'OkAmt', dataType: ValueType.NUMBER },
  { fieldName: 'BalAmount', dataType: ValueType.NUMBER },
  { fieldName: 'SupplyDate', dataType: ValueType.TEXT, datetimeFormat: 'yyyyMMdd' },
  { fieldName: 'Clstype', dataType: ValueType.TEXT },
  { fieldName: 'QcPno', dataType: ValueType.TEXT },
  { fieldName: 'QcDate', dataType: ValueType.TEXT },
  { fieldName: 'QcOkQty', dataType: ValueType.TEXT },
  { fieldName: 'isSelected', dataType: ValueType.TEXT },
  { fieldName: 'Remark', dataType: ValueType.TEXT },
  { fieldName: 'Hcn', dataType: ValueType.TEXT },
  { fieldName: 'RealWeight', dataType: ValueType.NUMBER },
];

export const GridColumns2 = [
  {
    fieldName: 'No',
    type: 'data',
    width: 30,
    editable: false,
    styleName: 'center-column ',
    header: {
      text: 'No',
    },
  },
  {
    fieldName: 'BalNo',
    type: 'data',
    width: 100,
    editable: false,
    styleName: 'center-column ',
    header: {
      text: '발주번호',
    },
  },
  {
    fieldName: 'BalSeq',
    type: 'data',
    width: 55,
    editable: false,
    header: {
      text: '발주순번',
    },
    styleName: 'center-column ',
  },
  {
    fieldName: 'GoodNo',
    type: 'data',
    width: 180,
    editable: false,
    header: {
      text: '품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column ',
  },
  {
    fieldName: 'GoodNm',
    type: 'data',
    width: 180,
    editable: false,
    header: {
      text: '품명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column ',
  },
  {
    fieldName: 'Spec',
    type: 'data',
    width: 180,
    editable: false,
    header: {
      text: '규격',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column ',
  },
  {
    fieldName: 'BalAmount',
    type: 'data',
    width: 80,
    styleName: 'right-column ',
    numberFormat: '#,##0',
    editable: false,
    header: {
      text: '발주금액',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'BalQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    editable: false,
    styleName: 'right-column  ',
    header: {
      text: '발주량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'UnitNm',
    type: 'data',
    width: 40,
    editable: false,
    header: {
      text: '단위',
    },
    renderer: {
      type: 'text',
    },
    styleName: 'center-column ',
  },
  {
    fieldName: 'NapQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    styleName: 'right-column rg-text-red-color',
    header: {
      template: "<span style='color:#ff6000'>납품량 *</span>",
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'RealWeight',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    styleName: 'right-column ',
    header: {
      template: "<span style='color:#ff6000'>실중량</span>",
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Qty',
    type: 'data',
    width: 60,
    editable: false,
    numberFormat: '#,##0.##',
    styleName: 'right-column ',
    header: {
      text: '중량',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Su',
    type: 'data',
    width: 60,
    editable: false,
    numberFormat: '#,##0.##',
    styleName: 'right-column ',
    header: {
      text: '길이',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'MiNapQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    editable: false,
    styleName: 'right-column ',
    header: {
      text: '미납량',
    },
    footer: {
      numberFormat: '#,##0.##',
      expression: 'sum',
    },
  },
  {
    fieldName: 'ErrorQty',
    type: 'data',
    width: 60,
    numberFormat: '#,##0.##',
    editable: false,
    styleName: 'right-column ',
    header: {
      text: '불량수량',
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
    numberFormat: '#,##0',
    editable: false,
    styleName: 'right-column ',
    header: {
      text: '발주단가',
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Amount',
    type: 'data',
    width: 80,
    editable: false,
    numberFormat: '#,##0',
    styleName: 'right-column ',
    header: {
      text: '납품금액',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    footer: {
      numberFormat: '#,##0',
      expression: 'sum',
    },
  },
  {
    fieldName: 'Hcn',
    type: 'data',
    width: 50,
    header: {
      template: "<span style='color:#ff6000'>HCN</span>",
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    editor: {
      maxLength: 5,
      textCase: 'upper',
    },
    styleName: 'center-column ',
  },
  {
    fieldName: 'Remark',
    type: 'data',
    width: 240,
    header: {
      template: "<span style='color:#ff6000'>비고</span>",
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    editor: {
      maxLength: 50,
    },
    styleName: 'left-column ',
  },
];
