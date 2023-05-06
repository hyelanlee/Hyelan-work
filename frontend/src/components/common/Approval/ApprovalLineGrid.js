import { ValueType } from 'realgrid';

export const GridFields = [
  {
    fieldName: 'ApprGubun',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'ApprId',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'ApprNm',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'ApprPos',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'ApprPosNm',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'ApprSeq',
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: 'CloseFlag',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'ProcessYmd',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'Seq',
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: 'isNewFlag',
    dataType: ValueType.TEXT,
  },
];

export const GridColumns = [
  {
    name: 'ApprSeq',
    fieldName: 'ApprSeq',
    width: 35,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '순번',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    numberFormat: '#,##0',
  },
  {
    name: 'ApprNm',
    fieldName: 'ApprNm',
    width: 70,
    styleName: 'left-column',
    button: 'action',
    editable: true,
    header: {
      text: '결재자',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'ApprPosNm',
    fieldName: 'ApprPosNm',
    width: 90,
    styleName: 'left-column',
    button: 'action',
    editable: true,
    header: {
      text: '직책',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'CloseFlag',
    fieldName: 'CloseFlag',
    width: 35,
    editable: false,
    styleName: 'center-column',
    header: {
      text: '전결',
      showTooltip: true,
    },
    renderer: {
      type: 'check',
      trueValues: 'Y',
      falseValues: 'N',
    },
  },
  {
    name: 'ProcessYmd',
    fieldName: 'ProcessYmd',
    width: 90,
    styleName: 'center-column',
    editable: false,
    header: {
      text: '처리일시',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
];
