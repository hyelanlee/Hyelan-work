export const GridFields = [
  { fieldName: 'ApprSeq' },
  { fieldName: 'ApprId' },
  { fieldName: 'ApprNm' },
  { fieldName: 'ApprPos' },
  { fieldName: 'ApprPosNm' },
  { fieldName: 'CloseFlag' },
  { fieldName: 'ProcessYmd' },
  { fieldName: 'Seq' },
];

export const GridColumns = [
  {
    name: 'ApprSeq',
    fieldName: 'ApprSeq',
    type: 'data',
    width: '45',
    header: {
      text: '순서',
    },
    editable: false,
  },
  {
    name: 'ApprNm',
    fieldName: 'ApprNm',
    type: 'data',
    width: '70',
    header: {
      text: '결재자',
    },
    button: 'action',
    editable: true,
  },
  {
    name: 'ApprPosNm',
    fieldName: 'ApprPosNm',
    type: 'data',
    width: '70',
    header: {
      text: '직책',
    },
    styleName: 'left-column',
    button: 'action',
    editable: true,
  },

  {
    name: 'CloseFlag',
    fieldName: 'CloseFlag',
    type: 'data',
    width: '40',
    header: {
      text: '전결',
    },
    renderer: {
      type: 'check',
      editable: true,
      trueValues: 'Y',
      falseValues: 'N',
    },
    styleName: 'checkBox',
  },
  {
    name: 'ProcessYmd',
    fieldName: 'ProcessYmd',
    type: 'data',
    width: '120',
    header: {
      text: '처리일시',
    },
    editable: false,
  },
];
