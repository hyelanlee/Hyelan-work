import { ValueType } from 'realgrid';

export const GridFields = [
  {
    fieldName: 'FileSeq',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'SortSeq',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'FilePath',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'FileName',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'OriginalFileName',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'FileSize',
    dataType: ValueType.NUMBER,
  },
];

export const GridColumns = [
  {
    name: 'SortSeq',
    fieldName: 'SortSeq',
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
    name: 'FilePath',
    fieldName: 'FilePath',
    width: 100,
    styleName: 'left-column',
    editable: true,
    visible: false,
    header: {
      text: '파일경로',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'FileName',
    fieldName: 'FileName',
    width: 200,
    styleName: 'left-column',
    editable: true,
    header: {
      text: '파일명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'OriginalFileName',
    fieldName: 'OriginalFileName',
    width: 150,
    editable: false,
    styleName: 'left-column',
    header: {
      text: '원본 파일명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'FileSize',
    fieldName: 'FileSize',
    width: 100,
    styleName: 'right-column',
    editable: false,
    numberFormat: '#,###,###,##0',
    header: {
      text: '파일크기(KB)',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'Download',
    fieldName: 'Download',
    type: 'data',
    width: 50,
    header: {
      text: '다운로드',
    },
    editable: false,
    styleName: 'center-column center_custom_renderer',
    renderer: 'Renderer_FileBtn',
  },
  {
    name: 'FileDelete',
    fieldName: 'FileDelete',
    type: 'data',
    width: 50,
    header: {
      text: '삭제',
    },
    editable: false,
    styleName: 'center-column center_custom_renderer',
    renderer: 'Renderer_FileDeleteBtn',
  },
];
