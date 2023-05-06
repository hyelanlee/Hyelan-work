import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { StylesMain } from '@components/common/SearchGoods/SearchGoodsStyle';
import * as helper from '@components/common/helper/CodeClass';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dialog, Label, Layout, LayoutPanel, LinkButton, RadioButton, TextBox } from 'rc-easyui';
import Command from '@components/common/Utility/Command';
import axios from 'axios';
import Grid from '@components/common/Utility/Grid';
import { GridView, LocalDataProvider } from 'realgrid';
import CodeHelper from '@components/common/Utility/CodeHelper';
import CodeHelperPopup from '@components/common/helper/CodeHelperPopup';
import Common from '@components/common/Utility/Common';
import { Box } from '@material-ui/core';
import useStores from '@stores/useStores';
import imgKsMark from '@assets/images/img_ks_mark.png';
import { GridColumns1, GridFields1, GridColumns2, GridFields2 } from './SearchGoodsGrid';

const SearchGoods = ({ visible, pgmid, onConfirm, onClose }) => {
  const classes = Styles();
  const { $CommonStore, $UserStore } = useStores();
  const PGMID = pgmid + '_SEARCHGOODS';

  const refGrid00 = useRef(null);
  const refGrid01 = useRef(null);
  const refIndex = useRef(0);
  const refGoodsNo = useRef(null);

  //품명검색 대분류
  let helperSearchGoods1 = { ...helper.Default };
  helperSearchGoods1.iInId = 'A0004';
  helperSearchGoods1.iInCode1 = '060';

  //품명검색 중분류
  let helperSearchGoods2 = { ...helper.Default };
  helperSearchGoods2.iInId = 'A0004';
  helperSearchGoods2.iInCode1 = '061';

  //품명검색 소분류
  let helperSearchGoods3 = { ...helper.Default };
  helperSearchGoods3.iInId = 'A0004';
  helperSearchGoods3.iInCode1 = '062';

  let helperHalfGoodsPart = { ...helper.Default };
  helperHalfGoodsPart.iInId = 'HALFGOODSPART';
  helperHalfGoodsPart.iInCode1 = '499';

  //품명검색 Seat
  let helperSeatType = { ...helper.Default };
  helperSeatType.iInId = 'A001';
  helperSeatType.iInCode1 = '501';

  //품명검색 반제품TYPE
  let helperHalfGoodsType = { ...helper.Default };
  helperHalfGoodsType.iInId = 'JUMULHALFTYPE';

  //품명검색 BD-BT&Stam
  let helperBdbtStem = { ...helper.Default };
  helperBdbtStem.iInId = 'A00045';
  helperBdbtStem.iInCode1 = '502';

  //품명검색 Disk
  let helperDiskType = { ...helper.Default };
  helperDiskType.iInId = 'A00045';
  helperDiskType.iInCode1 = '503';

  const refHelperClass1 = useRef(helperSearchGoods1);
  const refHelperClass2 = useRef(helperSearchGoods2);
  const refHelperClass3 = useRef(helperSearchGoods3);
  const refHelperHalfGoodsPart = useRef(helperHalfGoodsPart);
  const refHelperSeatType = useRef(helperSeatType);
  const refHelperHalfGoodsType = useRef(helperHalfGoodsType);
  const refHelperBdbtStem = useRef(helperBdbtStem);
  const refHelperDiskType = useRef(helperDiskType);

  const [goodsVO, setGoodsVO] = useState({
    Accunit: $UserStore.user.accunit,
    Factory: $UserStore.user.factory,
    UserId: $UserStore.user.userid,
    Goodno: '',
    GoodType: '',
    GoodTypenm: '',
    SearchGoods1cd: '',
    SearchGoods1nm: '', // 대분류
    SearchGoods2cd: '',
    SearchGoods2nm: '', // 중분류
    SearchGoods3cd: '',
    SearchGoods3nm: '', // 소분류
    HalfGoodsPartcd: '',
    HalfGoodsPartnm: '',
    HalfGoodsPartRemark: '', // 반제품PART
    HalfGoodsTypecd: '',
    HalfGoodsTypenm: '', // 반제품TYPE
    SeatTypecd: '',
    SeatTypenm: '', // Seat
    BdbtStemcd: '',
    BdbtStemnm: '', // BD-BT-Stem
    DiskTypecd: '',
    DiskTypenm: '', // Disk
    Specialcd: '',
    Specialnm: '', // Special
    RatingTypecd: '',
    RatingTypenm: '', // RatingType
    Borecd: '',
    Borenm: '', // Bore
    SizeTypecd: '',
    SizeTypenm: '', //SizeType
    Endcd: '',
    Endnm: '', // End
    Bodycd: '',
    Bodynm: '', // Body 재질
    Trimcd: '',
    Trimnm: '', // Trim 재질
    Operatorcd: '',
    Operatornm: '', //Operator
    PivLength: '', //PIV Length
    PivSizecd: '',
    PivSizenm: '', //PIV Size
    PivSpeccd: '',
    PivSpecnm: '', //PIV Spec
    SearchGoods4cd: '',
    SearchGoods4nm: '', //강종
    Spec: '',
  });

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });

  const UtilCodeHelper = new CodeHelper();
  const UtilCommon = new Common(PGMID, setAlert);
  const UtilGrid = new Grid(setAlert);
  const UtilCommand = new Command(setAlert);

  const fInit = () => {
    setGoodsVO({
      ...goodsVO,
      GoodType: '',
      GoodTypenm: '',
      Goodno: '',
      SearchGoods1cd: '',
      SearchGoods1nm: '', // 대분류
      SearchGoods2cd: '',
      SearchGoods2nm: '', // 중분류
      SearchGoods3cd: '',
      SearchGoods3nm: '', // 소분류
      HalfGoodsPartcd: '',
      HalfGoodsPartnm: '',
      HalfGoodsPartRemark: '', // 반제품PART
      HalfGoodsTypecd: '',
      HalfGoodsTypenm: '', // 반제품TYPE
      SeatTypecd: '',
      SeatTypenm: '', // Seat
      BdbtStemcd: '',
      BdbtStemnm: '', // BD-BT-Stem
      DiskTypecd: '',
      DiskTypenm: '', // Disk
      Specialcd: '',
      Specialnm: '', // Special
      RatingTypecd: '',
      RatingTypenm: '', // RatingType
      Borecd: '',
      Borenm: '', // Bore
      SizeTypecd: '',
      SizeTypenm: '', //SizeType
      Endcd: '',
      Endnm: '', // End
      Bodycd: '',
      Bodynm: '', // Body 재질
      Trimcd: '',
      Trimnm: '', // Trim 재질
      Operatorcd: '',
      Operatornm: '', //Operator
      PivLength: '',
      PivSizecd: '',
      PivSizenm: '',
      PivSpeccd: '',
      PivSpecnm: '',
      SearchGoods4cd: '',
      SearchGoods4nm: '', //강종
      Spec: '',
    });
  };

  const fInit2 = () => {
    const localStorage2 = JSON.parse(localStorage.getItem('Good'));
    UtilCommon.fMultiFieldChange(setGoodsVO, {
      Goodno: localStorage2.Goodno === localStorage2.Goodno ? '' : localStorage2.Goodno,
      GoodType: localStorage2.GoodType,
      GoodTypenm: localStorage2.GoodTypenm,
      SearchGoods1cd: localStorage2.SearchGoods1cd,
      SearchGoods1nm: localStorage2.SearchGoods1nm,
      SearchGoods2cd: localStorage2.SearchGoods2cd,
      SearchGoods2nm: localStorage2.SearchGoods2nm,
      SearchGoods3cd: localStorage2.SearchGoods3cd,
      SearchGoods3nm: localStorage2.SearchGoods3nm,
      HalfGoodsPartcd: localStorage2.HalfGoodsPartcd,
      HalfGoodsPartnm: localStorage2.HalfGoodsPartnm,
      HalfGoodsPartRemark: localStorage2.HalfGoodsPartRemark,
      HalfGoodsTypecd: localStorage2.HalfGoodsTypecd,
      HalfGoodsTypenm: localStorage2.HalfGoodsTypenm,
      SeatTypecd: localStorage2.SeatTypecd,
      SeatTypenm: localStorage2.SeatTypenm,
      BdbtStemcd: localStorage2.BdbtStemcd,
      BdbtStemnm: localStorage2.BdbtStemnm,
      DiskTypecd: localStorage2.DiskTypecd,
      DiskTypenm: localStorage2.DiskTypenm,
      Specialcd: localStorage2.Specialcd,
      Specialnm: localStorage2.Specialnm,
      RatingTypecd: localStorage2.RatingTypecd,
      RatingTypenm: localStorage2.RatingTypenm,
      Borecd: localStorage2.Borecd,
      Borenm: localStorage2.Borenm,
      SizeTypecd: localStorage2.SizeTypecd,
      SizeTypenm: localStorage2.SizeTypenm,
      Endcd: localStorage2.Endcd,
      Endnm: localStorage2.Endnm,
      Bodycd: localStorage2.Bodycd,
      Bodynm: localStorage2.Bodynm,
      Trimcd: localStorage2.Trimcd,
      Trimnm: localStorage2.Trim,
      Operatorcd: localStorage2.Operatorcd,
      Operatornm: localStorage2.Operatornm,
      PivLength: localStorage2.PivLength,
      PivSizecd: localStorage2.PivSizecd,
      PivSizenm: localStorage2.PivSizenm,
      PivSpeccd: localStorage2.PivSpeccd,
      PivSpecnm: localStorage2.PivSpecnm,
      SearchGoods4cd: localStorage2.SearchGoods4cd,
      SearchGoods4nm: localStorage2.SearchGoods4nm, //강종
      Spec: localStorage2.Spec,
    });
  };

  const fConfirm2 = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (fSaveCondition) {
      fSaveCondition();
    }
  };

  const fClose2 = () => {
    if (onClose) {
      onClose();
    }
    if (goodsVO.GoodType !== '' || goodsVO.GoodType !== undefined || goodsVO.SearchGoods1cd !== '' || goodsVO.SearchGoods1cd !== undefined || goodsVO.Goodno !== '' || goodsVO.Goodno !== undefined) {
      if (fSaveCondition) {
        fSaveCondition();
      }
    } else {
      fDeleteCondition();
    }
  };

  const fSaveCondition = async () => {
    // $CommonStore.fSetUserCondition('Good', goodsVO);
    localStorage.setItem('Good', JSON.stringify(goodsVO));

    const restVO = { ...goodsVO };

    restVO.UserPno = $UserStore.user.userid;
    restVO.MenuType = 'Good';
    let items = [];

    Object.keys(goodsVO).forEach((id) => {
      items.push({ FieldID: id, InitValue: goodsVO[id] });
    });
    try {
      await axios.post('@api/common/userCondition/updateByCondition', {
        header: restVO,
        detail: items,
      });
    } catch (error) {
      setAlert({ visible: true, desc: `조건 저장 중 오류가 발생하였습니다. ${error}` });
      return;
    }
  };

  const fDeleteCondition = async () => {
    fInit();
    // $CommonStore.fSetUserConditionInit('Good');
    localStorage.removeItem('Good');

    const restVO = { ...goodsVO };

    restVO.UserPno = $UserStore.user.userid;
    restVO.MenuType = 'Good';

    try {
      await axios.post('@api/common/userCondition/deleteByCondition', {
        header: restVO,
      });
    } catch (error) {
      setAlert({ visible: true, desc: `초기화 중 오류가 발생하였습니다. ${error}` });
      return;
    }
  };

  const fsetValue = (id, value, name, currentData) => {
    switch (id) {
      case 'SearchGoods1':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          SearchGoods1cd: value,
          SearchGoods1nm: name,
        });
        break;
      case 'SearchGoods2':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          SearchGoods2cd: value,
          SearchGoods2nm: name,
        });
        break;
      case 'SearchGoods3':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          SearchGoods3cd: value,
          SearchGoods3nm: name,
        });
        break;
      case 'HalfGoodsPart':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          HalfGoodsPartcd: value,
          HalfGoodsPartnm: name,
          HalfGoodsPartRemark: currentData.Data.remark,
        });
        break;
      case 'HalfGoodsType':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          HalfGoodsTypecd: value,
          HalfGoodsTypenm: name,
        });
        break;
      case 'SeatType':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          SeatTypecd: value,
          SeatTypenm: name,
        });
        break;
      case 'BdbtStem':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          BdbtStemcd: value,
          BdbtStemnm: name,
        });
        break;
      case 'DiskType':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          DiskTypecd: value,
          DiskTypenm: name,
        });
        break;
      case 'Special':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          Specialcd: value,
          Specialnm: name,
        });
        break;
      case 'RatingType':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          RatingTypecd: value,
          RatingTypenm: name,
        });
        break;
      case 'Bore':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          Borecd: value,
          Borenm: name,
        });
        break;
      case 'SizeType':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          SizeTypecd: value,
          SizeTypenm: name,
        });
        break;
      case 'End':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          Endcd: value,
          Endnm: name,
        });
        break;
      case 'Body':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          Bodycd: value,
          Bodynm: name,
        });
        break;
      case 'Trim':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          Trimcd: value,
          Trimnm: name,
        });
        break;
      case 'Operator':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          Operatorcd: value,
          Operatornm: name,
        });
        break;
      case 'PivSize':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          PivSizecd: value,
          PivSizenm: name,
        });
        break;
      case 'PivSpec':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          PivSpeccd: value,
          PivSpecnm: name,
        });
        break;
      case 'SearchGoods4':
        UtilCommon.fMultiFieldChange(setGoodsVO, {
          SearchGoods4cd: value,
          SearchGoods4nm: name,
        });
        break;
      default:
        break;
    }
  };

  const fSearchChange = (key, value) => {
    setGoodsVO((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  const fHandleChangeGoodtype = (value, checked) => {
    if (checked) {
      goodsVO.GoodType = value;
      fSearchChange('GoodType', value);
    }
  };

  const fRadioTap = (event, rb) => {
    event.preventDefault();
    if (rb === UtilCommon.fMakeId('radioBox1')) {
      if (event.key === '1') {
        fHandleChangeGoodtype('055001', 'checked');
      }
      if (event.key === '2') {
        fHandleChangeGoodtype('055008', 'checked');
      }
      if (event.key === '3') {
        fHandleChangeGoodtype('055004', 'checked');
      }
      if (event.key === '4') {
        fHandleChangeGoodtype('055005', 'checked');
      }
      if (event.key === '5') {
        fHandleChangeGoodtype('', 'checked');
      }
      if (event.shiftKey && event.key === 'Tab') {
        document.getElementById(UtilCommon.fMakeId('Goodno')).focus();
      } else if (!event.shiftKey && event.key === 'Tab') {
        document.getElementById(UtilCommon.fMakeId('SearchGoods1')).focus();
      }

      const arr = ['055001', '055008', '055004', '055005', ''];

      if (event.key === 'ArrowRight') {
        let nextRdoChkIdx = arr.indexOf(goodsVO.GoodType);
        let nextRdoChk = nextRdoChkIdx + 1;
        if (nextRdoChk > 4) {
          nextRdoChk = 4;
        }
        goodsVO.GoodType = arr[nextRdoChk];
        fSearchChange('GoodType', arr[nextRdoChk]);
      } else if (event.key === 'ArrowLeft') {
        let prevRdoChkIdx = arr.indexOf(goodsVO.GoodType);
        let prevRdoChk = prevRdoChkIdx - 1;
        if (prevRdoChk < 0) {
          prevRdoChk = 0;
        }
        goodsVO.GoodType = arr[prevRdoChk];
        fSearchChange('GoodType', arr[prevRdoChk]);
      }
    }
  };

  const fDisabledControl = (value) => {
    // 반제품PART : BODY  선택시, BALL -> CAP 선택시
    try {
      if (
        (goodsVO.HalfGoodsPartnm.substring(0, 4).toLowerCase() === 'body' && goodsVO.HalfGoodsPartnm.substring(0, 9).toLowerCase() !== 'body seat') ||
        goodsVO.HalfGoodsPartcd === '499058' ||
        goodsVO.HalfGoodsPartcd === '499078' ||
        goodsVO.HalfGoodsPartcd === '499098' ||
        goodsVO.HalfGoodsPartcd === '499118' ||
        (goodsVO.HalfGoodsPartcd === '499267' && goodsVO.SearchGoods2cd === '061002') ||
        goodsVO.HalfGoodsPartcd === '499419'
      ) {
        if (
          value === 'SearchGoods2' ||
          value === 'SeatType' ||
          value === 'BdbtStem' ||
          value === 'DiskType' ||
          value === 'Special' ||
          value === 'Bore' ||
          value === 'End' ||
          value === 'Body' ||
          value === 'SearchGoods3' ||
          value === 'HalfGoodsPart' ||
          value === 'RatingType' ||
          value === 'SizeType'
        ) {
          return false;
        } else if (value === 'HalfGoodsType') {
          return true;
        }
      }
      if (
        goodsVO.HalfGoodsPartcd === '499335' ||
        goodsVO.HalfGoodsPartcd === '499333' ||
        goodsVO.HalfGoodsPartcd === '499329' ||
        goodsVO.HalfGoodsPartcd === '499331' ||
        goodsVO.HalfGoodsPartnm.substring(0, 5).toLowerCase() === 'globe' ||
        goodsVO.HalfGoodsPartnm.substring(0, 3).toLowerCase() === 'ram'
      ) {
        if (
          value === 'SearchGoods2' ||
          value === 'SeatType' ||
          value === 'BdbtStem' ||
          value === 'DiskType' ||
          value === 'Special' ||
          value === 'Bore' ||
          value === 'End' ||
          value === 'Body' ||
          value === 'SearchGoods3' ||
          value === 'HalfGoodsPart' ||
          value === 'RatingType' ||
          value === 'SizeType' ||
          value === 'Trim'
        ) {
          return false;
        }
      }
      //PIV -> PIV  선택시
      if (goodsVO.SearchGoods2cd === '061042') {
        if (value === 'PivLength' || value === 'SearchGoods2' || value === 'SearchGoods4' || value === 'SearchGoods3' || value === 'RatingType' || value === 'SizeType') {
          return false;
        }
        return true;
      }
      //PIV -> PIV(PART) 선택시
      else if (goodsVO.SearchGoods2cd === '061043') {
        if (value === 'HalfGoodsPart' || value === 'HalfGoodsType' || value === 'SearchGoods2' || value === 'SearchGoods4' || value === 'SearchGoods3') {
          return false;
        } else if (
          goodsVO.HalfGoodsPartcd === '499218' ||
          goodsVO.HalfGoodsPartcd === '499219' ||
          goodsVO.HalfGoodsPartcd === '499226' ||
          goodsVO.HalfGoodsPartcd === '499227' ||
          goodsVO.HalfGoodsPartcd === '499228' ||
          goodsVO.HalfGoodsPartcd === '499229' ||
          goodsVO.HalfGoodsPartcd === '499230' ||
          goodsVO.HalfGoodsPartcd === '499231' ||
          goodsVO.HalfGoodsPartcd === '499234' ||
          goodsVO.HalfGoodsPartcd === '499235' ||
          goodsVO.HalfGoodsPartcd === '499236' ||
          goodsVO.HalfGoodsPartcd === '499237' ||
          goodsVO.HalfGoodsPartcd === '499238' ||
          goodsVO.HalfGoodsPartcd === '499239' ||
          goodsVO.HalfGoodsPartcd === '499240' ||
          goodsVO.HalfGoodsPartcd === '499241' ||
          goodsVO.HalfGoodsPartcd === '499242' ||
          goodsVO.HalfGoodsPartcd === '499243' ||
          goodsVO.HalfGoodsPartcd === '499244' ||
          goodsVO.HalfGoodsPartcd === '499245' ||
          goodsVO.HalfGoodsPartcd === '499246' ||
          goodsVO.HalfGoodsPartcd === '499247' ||
          goodsVO.HalfGoodsPartcd === '499248' ||
          goodsVO.HalfGoodsPartcd === '499249' ||
          goodsVO.HalfGoodsPartcd === '499250' ||
          goodsVO.HalfGoodsPartcd === '499251'
        ) {
          if (value === 'PivSpec') {
            return false;
          }
        } else if (
          goodsVO.HalfGoodsPartcd === '499220' ||
          goodsVO.HalfGoodsPartcd === '499221' ||
          goodsVO.HalfGoodsPartcd === '499224' ||
          goodsVO.HalfGoodsPartcd === '499225' ||
          goodsVO.HalfGoodsPartcd === '499232' ||
          goodsVO.HalfGoodsPartcd === '499233' ||
          goodsVO.HalfGoodsPartcd === '499389' ||
          goodsVO.HalfGoodsPartcd === '499390' ||
          goodsVO.HalfGoodsPartcd === '499391' ||
          goodsVO.HalfGoodsPartcd === '499392'
        ) {
          if (value === 'PivLength') {
            return false;
          }
        } else if (goodsVO.HalfGoodsPartcd === '499222' || goodsVO.HalfGoodsPartcd === '499223') {
          if (value === 'PivSize') {
            return false;
          }
        }
        return true;
      }
      //재고자산 원재료 선택시
      else if (goodsVO.GoodType === '055001') {
        if (value === 'SearchGoods4' || value === 'SearchGoods2') {
          return false;
        } else if (goodsVO.SearchGoods1cd === '060004' || goodsVO.SearchGoods1cd === '060008') {
          if (value === 'SearchGoods3' || value === 'HalfGoodsPart' || value === 'HalfGoodsType' || value === 'RatingType' || value === 'SizeType' || value === 'SearchGoods4') {
            return false;
          } else if (goodsVO.HalfGoodsPartnm.substring(0, 6).toLowerCase() === 'bonnet' && goodsVO.HalfGoodsTypecd === '') {
            if (value === 'SeatType' || value === 'BdbtStem' || value === 'DiskType' || value === 'Special' || value === 'Bore' || value === 'End' || value === 'Body') {
              return false;
            }
          } else if (goodsVO.SearchGoods2cd === '061002') {
            if (value === 'SeatType') {
              return false;
            } else if (goodsVO.HalfGoodsPartnm.substring(0, 3).toLowerCase() === 'cap') {
              if (value === 'BdbtStem' || value === 'DiskType' || value === 'Special' || value === 'Bore' || value === 'End' || value === 'Body') {
                return false;
              }
            }
          }
        }
        return true;
      }
      //재고자산 반제품 선택시
      else if (goodsVO.GoodType === '055008') {
        if (value === 'SearchGoods4' || value === 'SearchGoods3' || value === 'SearchGoods2') {
          return false;
        } else if (goodsVO.SearchGoods1cd === '060002') {
          if (value === 'Spec') {
            return false;
          }
        } else if (goodsVO.SearchGoods2cd === '061001') {
          if (value === 'HalfGoodsPart' || value === 'HalfGoodsType' || value === 'RatingType' || value === 'SizeType' || value === 'SearchGoods4') {
            return false;
          }
        } else if (goodsVO.SearchGoods2cd === '061002' || goodsVO.SearchGoods2cd === '061003') {
          if (value === 'HalfGoodsPart' || value === 'HalfGoodsType' || value === 'RatingType' || value === 'SizeType' || value === 'SearchGoods4' || value === 'SeatType') {
            return false;
          } else if (goodsVO.HalfGoodsPartcd === '499388') {
            if (value === 'Bore') {
              return false;
            }
          } else if (goodsVO.HalfGoodsPartcd === '499336') {
            if (value === 'BdbtStem' || value === 'DiskType' || value === 'Special' || value === 'Bore' || value === 'End' || value === 'Body' || value === 'Trim') {
              return false;
            }
          }
        } else if (goodsVO.SearchGoods1cd === '060010') {
          if (
            value === 'SeatType' ||
            value === 'BdbtStem' ||
            value === 'DiskType' ||
            value === 'Special' ||
            value === 'RatingType' ||
            value === 'Bore' ||
            value === 'SizeType' ||
            value === 'End' ||
            value === 'Body' ||
            value === 'Trim' ||
            value === 'Operator'
          ) {
            return false;
          } else if (value === 'SearchGoods4') return true;
        }
        return true;
      }
      //재고자산 : 제품 선택시
      else if (goodsVO.GoodType === '055004') {
        if (value === 'HalfGoodsPart' || value === 'HalfGoodsType' || value === 'PivLength' || value === 'PivSize' || value === 'PivSpec' || value === 'SearchGoods4') {
          return true;
        }
        return false;
      }
      //재고자산 : 소모품 선택시
      else if (goodsVO.GoodType === '055005') {
        if (value === 'SearchGoods1' || value === 'SearchGoods2') {
          return false;
        }
        return true;
      }
      // 나머지
      else if (goodsVO.SearchGoods2cd !== '061002') {
        if (goodsVO.HalfGoodsPartnm.substring(0, 4).toLowerCase() === 'body') {
          if (value === 'SeatType' || value === 'BdbtStem' || value === 'DiskType' || value === 'Special') {
            return false;
          }
          return true;
        }
      }
    } catch (e) {
      setAlert({ visible: true, desc: e, type: 'E' });
    }
  };

  const fInitGrid = () => {
    UtilGrid.fContainerInit(UtilCommon.fMakeId('Grid00'));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid00.current);
    UtilGrid.fInitGridHeader(gridView, dataProvider, GridFields1, GridColumns1, 20, fOnCurrentRowChanged, fOnCellClicked, fKeyconfig);
    gridView.setDisplayOptions({ fitStyle: 'none' });
    gridView.onCellDblClicked = fDbClickData;
    gridView.setFixedOptions({
      colCount: 1,
    });
  };

  const fOnCurrentRowChanged = async (grid, oldRow, newRow) => {
    if (newRow >= 0) {
      gridView.commit();
      const currentRow = dataProvider.getJsonRow(newRow);

      refGoodsNo.current = currentRow.Goodno;
      goodsVO.GoodType = currentRow.GoodType;
      setTimeout(() => {
        gridView.setFocus();
      }, 0);
    }
  };

  const fOnCellClicked = async (grid, index) => {
    if (refIndex.current === index.dataRow && index.dataRow >= 0) {
      gridView.commit();
      const currentRow = dataProvider.getJsonRow(index.dataRow);

      refGoodsNo.current = currentRow.Goodno;
      goodsVO.GoodType = currentRow.GoodType;
      setTimeout(() => {
        gridView.setFocus();
      }, 0);
    }
  };

  const fKeyconfig = async (grid, event) => {
    const { itemIndex } = grid.getCurrent();
    const sameDataChk = selectDataProvider.getJsonRows();
    let jsonRow = grid.getDataSource().getJsonRow(itemIndex);
    const filtered = sameDataChk.filter((row) => row.Goodno === jsonRow.Goodno);
    switch (event.key) {
      case 'Enter':
        if (filtered.length > 0) {
          return;
        }
        gridView.commit();
        selectGridView.commit();
        selectDataProvider.addRow(jsonRow);
        $CommonStore.fSetParameter(selectDataProvider.getJsonRows());
        break;
      case 'Escape':
        fClose2();
        break;
      case 'Tab':
        setTimeout(() => {
          selectGridView.setFocus();
        }, 10);
        break;
      default:
        break;
    }
  };

  const fDbClickData = async (grid, clickData) => {
    const rowNum = clickData.itemIndex;
    const sameDataChk = selectDataProvider.getJsonRows();
    let jsonRow = grid.getDataSource().getJsonRow(rowNum);
    const filtered = sameDataChk.filter((row) => row.Goodno === jsonRow.Goodno);
    if (filtered.length > 0) {
      return;
    }
    gridView.commit();
    selectGridView.commit();
    selectDataProvider.addRow(jsonRow);
    $CommonStore.fSetParameter(selectDataProvider.getJsonRows());
  };

  const fInitselectGrid = () => {
    UtilGrid.fContainerInit(UtilCommon.fMakeId('Grid01'));
    selectDataProvider = new LocalDataProvider(false);
    selectGridView = new GridView(refGrid01.current);
    UtilGrid.fInitGridHeader(selectGridView, selectDataProvider, GridFields2, GridColumns2, 20, fOnCurrentRowChanged2, fOnCellClicked2, fKeyConfig2);
    selectGridView.setDisplayOptions({ fitStyle: 'none' });
    selectGridView.onCellDblClicked = fDbClickData2;
  };

  const fOnCurrentRowChanged2 = async (grid, oldRow, newRow) => {
    if (newRow >= 0) {
      selectGridView.commit();
      const currentRow = selectDataProvider.getJsonRow(newRow);

      refGoodsNo.current = currentRow.Goodno;
      goodsVO.GoodType = currentRow.GoodType;
      setTimeout(() => {
        selectGridView.setFocus();
      }, 0);
    }
  };

  const fOnCellClicked2 = async (grid, index) => {
    if (refIndex.current === index.dataRow && index.dataRow >= 0) {
      selectGridView.commit();
      const currentRow = selectDataProvider.getJsonRow(index.dataRow);

      refGoodsNo.current = currentRow.Goodno;
      goodsVO.GoodType = currentRow.GoodType;
      setTimeout(() => {
        selectGridView.setFocus();
      }, 0);
    }
  };

  const fKeyConfig2 = async (grid, event) => {
    const { itemIndex } = grid.getCurrent();
    switch (event.key) {
      case 'Enter':
        fConfirm2();
        break;
      case 'Escape':
        fClose2();
        break;
      case 'Tab':
        setTimeout(() => {
          document.getElementById(UtilCommon.fMakeId('radioBox1')).focus();
        }, 0);
        break;
      case 'Delete':
        setTimeout(() => {
          selectGridView.commit();
          selectDataProvider.removeRow(itemIndex);
          $CommonStore.fSetParameter(selectDataProvider.getJsonRows());
        }, 10);
        break;
      default:
        break;
    }
  };

  const fDbClickData2 = async (grid, clickData) => {
    const rowNum = clickData.itemIndex;
    gridView.commit();
    selectGridView.commit();
    selectDataProvider.removeRow(rowNum);
    $CommonStore.fSetParameter(selectDataProvider.getJsonRows());
  };

  const fnew = () => {
    fInit();
    fInitGrid();
  };

  const fSearch = async () => {
    fInitGrid();
    const restVO = { ...goodsVO };
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    try {
      await UtilCommand.fSearch(dataProvider, '/@api/common/searchgoods/selectByList', restVO, '제품검색');
    } catch (error) {
      setAlert({ visible: true, desc: `조회 중 오류가 발생하였습니다..${error}` });
    }
    gridView.setCurrent({ itemIndex: 0, dataRow: 0 });
  };

  const fTabGoodno = (e) => {
    if (e.shiftKey && e.key === 'Tab') {
      setTimeout(() => {
        document.getElementById(UtilCommon.fMakeId('Spec')).focus();
      }, 0);
    } else if (!e.shiftKey && e.key === 'Tab') {
      setTimeout(() => {
        gridView.setFocus();
        gridView.setCurrent({ itemIndex: 0, dataRow: 0 });
      }, 0);
    } else if (e.key === 'Enter') {
      fSearch();
      setTimeout(() => {
        gridView.setFocus();
      }, 0);
    }
  };

  //--------------------------------------------------------------------------------------------//

  useEffect(() => {
    if (goodsVO.GoodType || goodsVO.GoodType === '') {
      setGoodsVO({
        ...goodsVO,
        Goodno: '',
        SearchGoods1cd: '',
        SearchGoods1nm: '', // 대분류
        SearchGoods2cd: '',
        SearchGoods2nm: '', // 중분류
        SearchGoods3cd: '',
        SearchGoods3nm: '', // 소분류
        HalfGoodsPartcd: '',
        HalfGoodsPartnm: '',
        HalfGoodsPartRemark: '', // 반제품PART
        HalfGoodsTypecd: '',
        HalfGoodsTypenm: '', // 반제품TYPE
        SeatTypecd: '',
        SeatTypenm: '', // Seat
        BdbtStemcd: '',
        BdbtStemnm: '', // BD-BT-Stem
        DiskTypecd: '',
        DiskTypenm: '', // Disk
        Specialcd: '',
        Specialnm: '', // Special
        RatingTypecd: '',
        RatingTypenm: '', // RatingType
        Borecd: '',
        Borenm: '', // Bore
        SizeTypecd: '',
        SizeTypenm: '', //SizeType
        Endcd: '',
        Endnm: '', // End
        Bodycd: '',
        Bodynm: '', // Body 재질
        Trimcd: '',
        Trimnm: '', // Trim 재질
        Operatorcd: '',
        Operatornm: '', //Operator
        SearchGoods4cd: '',
        SearchGoods4nm: '', //강종
      });
    }
  }, [goodsVO.GoodType]);

  useEffect(() => {
    if (goodsVO.SearchGoods1cd) {
      if (goodsVO.GoodType === '055001' && goodsVO.SearchGoods1cd !== '060003') {
        refHelperClass2.current.iInId = 'A00044';
        refHelperClass2.current.iInCode2 = '060001';
      } else if ((goodsVO.GoodType === '055008' || goodsVO.GoodType === '055004') && goodsVO.SearchGoods1cd === '060008') {
        refHelperClass2.current.iInId = 'A00044';
        refHelperClass2.current.iInCode2 = '060001';
      } else {
        refHelperClass2.current.iInId = 'A00044';
        refHelperClass2.current.iInCode2 = goodsVO.SearchGoods1cd;
      }
    } else {
      refHelperClass2.current.iInId = 'A0004';
      refHelperClass2.current.iInCode2 = '';
    }
    setGoodsVO({
      ...goodsVO,
      Goodno: '',
      SearchGoods2cd: '',
      SearchGoods2nm: '', // 중분류
      SearchGoods3cd: '',
      SearchGoods3nm: '', // 소분류
      HalfGoodsPartcd: '',
      HalfGoodsPartnm: '',
      HalfGoodsPartRemark: '', // 반제품PART
      HalfGoodsTypecd: '',
      HalfGoodsTypenm: '', // 반제품TYPE
      SeatTypecd: '',
      SeatTypenm: '', // Seat
      BdbtStemcd: '',
      BdbtStemnm: '', // BD-BT-Stem
      DiskTypecd: '',
      DiskTypenm: '', // Disk
      Specialcd: '',
      Specialnm: '', // Special
      RatingTypecd: '',
      RatingTypenm: '', // RatingType
      Borecd: '',
      Borenm: '', // Bore
      SizeTypecd: '',
      SizeTypenm: '', //SizeType
      Endcd: '',
      Endnm: '', // End
      Bodycd: '',
      Bodynm: '', // Body 재질
      Trimcd: '',
      Trimnm: '', // Trim 재질
      Operatorcd: '',
      Operatornm: '', //Operator
      SearchGoods4cd: '',
      SearchGoods4nm: '', //강종
    });
  }, [goodsVO.SearchGoods1cd]);

  useEffect(() => {
    if (goodsVO.SearchGoods2cd) {
      refHelperClass3.current.iInId = 'A00044';
      refHelperClass3.current.iInCode2 = goodsVO.SearchGoods2cd;
    } else {
      refHelperClass3.current.iInId = 'A0004';
      refHelperClass3.current.iInCode2 = '';
    }
    setGoodsVO({
      ...goodsVO,
      Goodno: '',
      SearchGoods3cd: '',
      SearchGoods3nm: '', // 소분류
      HalfGoodsPartcd: '',
      HalfGoodsPartnm: '',
      HalfGoodsPartRemark: '', // 반제품PART
      HalfGoodsTypecd: '',
      HalfGoodsTypenm: '', // 반제품TYPE
      SeatTypecd: '',
      SeatTypenm: '', // Seat
      BdbtStemcd: '',
      BdbtStemnm: '', // BD-BT-Stem
      DiskTypecd: '',
      DiskTypenm: '', // Disk
      Specialcd: '',
      Specialnm: '', // Special
      RatingTypecd: '',
      RatingTypenm: '', // RatingType
      Borecd: '',
      Borenm: '', // Bore
      SizeTypecd: '',
      SizeTypenm: '', //SizeType
      Endcd: '',
      Endnm: '', // End
      Bodycd: '',
      Bodynm: '', // Body 재질
      Trimcd: '',
      Trimnm: '', // Trim 재질
      Operatorcd: '',
      Operatornm: '', //Operator
      SearchGoods4cd: '',
      SearchGoods4nm: '', //강종
    });
  }, [goodsVO.SearchGoods2cd]);

  useEffect(() => {
    if (goodsVO.SearchGoods3cd) {
      if (goodsVO.GoodType === '055001' && goodsVO.SearchGoods1cd === '060004') {
        refHelperHalfGoodsPart.current.iInCode2 = '060004';
        refHelperSeatType.current.iInId = 'A00044';
      } else if (goodsVO.GoodType === '055001' || goodsVO.GoodType === '055008') {
        if (goodsVO.SearchGoods1cd === '060008') {
          refHelperHalfGoodsPart.current.iInCode2 = '060008';
          refHelperSeatType.current.iInId = 'A00044';
        } else {
          refHelperHalfGoodsPart.current.iInCode2 = goodsVO.SearchGoods3cd;
          refHelperSeatType.current.iInId = 'A00044';
        }
      }
    } else {
      refHelperHalfGoodsPart.current.iInCode2 = '';
      refHelperSeatType.current.iInId = 'A001';
    }
    setGoodsVO({
      ...goodsVO,
      Goodno: '',
      HalfGoodsPartcd: '',
      HalfGoodsPartnm: '',
      HalfGoodsPartRemark: '', // 반제품PART
      HalfGoodsTypecd: '',
      HalfGoodsTypenm: '', // 반제품TYPE
      SeatTypecd: '',
      SeatTypenm: '', // Seat
      BdbtStemcd: '',
      BdbtStemnm: '', // BD-BT-Stem
      DiskTypecd: '',
      DiskTypenm: '', // Disk
      Specialcd: '',
      Specialnm: '', // Special
      RatingTypecd: '',
      RatingTypenm: '', // RatingType
      Borecd: '',
      Borenm: '', // Bore
      SizeTypecd: '',
      SizeTypenm: '', //SizeType
      Endcd: '',
      Endnm: '', // End
      Bodycd: '',
      Bodynm: '', // Body 재질
      Trimcd: '',
      Trimnm: '', // Trim 재질
      Operatorcd: '',
      Operatornm: '', //Operator
      SearchGoods4cd: '',
      SearchGoods4nm: '', //강종
    });
  }, [goodsVO.SearchGoods3cd]);

  useEffect(() => {
    if (!goodsVO.HalfGoodsPartcd) {
      UtilCommon.fMultiFieldChange(setGoodsVO, {
        HalfGoodsPartnm: '',
        HalfGoodsPartRemark: '',
      });
    }
    if (goodsVO.HalfGoodsPartnm.includes('BODY') || goodsVO.HalfGoodsPartnm.includes('CAP')) {
      refHelperSeatType.current.iInId = 'A00044';
      refHelperSeatType.current.iInCode2 = goodsVO.SearchGoods2cd;
      refHelperSeatType.current.iInCode3 = goodsVO.SearchGoods2cd === '061002' ? '' : '500001';
      refHelperBdbtStem.current.iInId = 'A00045';
      refHelperBdbtStem.current.iInCode2 = goodsVO.SearchGoods2cd;
      refHelperBdbtStem.current.iInCode3 = goodsVO.SearchGoods2cd === '061002' ? '' : '500001';
      refHelperDiskType.current.iInId = 'A00045';
      refHelperDiskType.current.iInCode2 = goodsVO.SearchGoods2cd;
      refHelperDiskType.current.iInCode3 = goodsVO.SearchGoods2cd === '061002' ? '' : '500001';
    } else {
      refHelperSeatType.current.iInId = 'A001';
      refHelperSeatType.current.iInCode2 = '';
      refHelperSeatType.current.iInCode3 = '';
      refHelperBdbtStem.current.iInId = 'A001';
      refHelperBdbtStem.current.iInCode2 = '';
      refHelperBdbtStem.current.iInCode3 = '';
      refHelperDiskType.current.iInId = 'A001';
      refHelperDiskType.current.iInCode2 = '';
      refHelperDiskType.current.iInCode3 = '';
    }
    // if (goodsVO.HalfGoodsPartcd === '499171') {
    //   refHelperHalfGoodsType.current.iInCode2 = '499004';
    // } else if (goodsVO.HalfGoodsPartcd === '499170') {
    //   refHelperHalfGoodsType.current.iInCode2 = '499002';
    // } else if (goodsVO.HalfGoodsPartcd === '499172') {
    //   refHelperHalfGoodsType.current.iInCode2 = '499007';
    // } else if (goodsVO.HalfGoodsPartcd === '499173') {
    //   refHelperHalfGoodsType.current.iInCode2 = '499008';
    // } else {
    //   refHelperHalfGoodsType.current.iInCode2 = goodsVO.HalfGoodsPartcd;
    // }
    // refHelperHalfGoodsType.current.iInCode3 = goodsVO.HalfGoodsPartRemark;
    refHelperHalfGoodsType.current.iInId = 'JUMULHALFTYPE';
    refHelperHalfGoodsType.current.iInCode1 = goodsVO.GoodType;
    refHelperHalfGoodsType.current.iInCode2 = goodsVO.SearchGoods1cd;
    refHelperHalfGoodsType.current.iInCode3 = goodsVO.SearchGoods2cd;
    refHelperHalfGoodsType.current.iInCode4 = goodsVO.SearchGoods3cd;
    refHelperHalfGoodsType.current.iInCode5 = goodsVO.HalfGoodsPartcd;

    setGoodsVO({
      ...goodsVO,
      Goodno: '',
      HalfGoodsTypecd: '',
      HalfGoodsTypenm: '', // 반제품TYPE
      SeatTypecd: '',
      SeatTypenm: '', // Seat
      BdbtStemcd: '',
      BdbtStemnm: '', // BD-BT-Stem
      DiskTypecd: '',
      DiskTypenm: '', // Disk
      Specialcd: '',
      Specialnm: '', // Special
      RatingTypecd: '',
      RatingTypenm: '', // RatingType
      Borecd: '',
      Borenm: '', // Bore
      SizeTypecd: '',
      SizeTypenm: '', //SizeType
      Endcd: '',
      Endnm: '', // End
      Bodycd: '',
      Bodynm: '', // Body 재질
      Trimcd: '',
      Trimnm: '', // Trim 재질
      Operatorcd: '',
      Operatornm: '', //Operator
      SearchGoods4cd: '',
      SearchGoods4nm: '', //강종
    });
  }, [goodsVO.HalfGoodsPartcd]);

  useEffect(() => {
    UtilCommon.fSetTabIndex();
    if (JSON.parse(localStorage.getItem('Good')).GoodType === undefined || JSON.parse(localStorage.getItem('Good')).GoodType === '' || JSON.parse(localStorage.getItem('Good')).GoodType === null) {
      fInit();
    } else {
      fInit2();
    }

    if (visible) {
      fInitGrid();
      fInitselectGrid();
      UtilCommon.fMakeFocus('Spec');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <Dialog
        title={
          <Box style={{ display: 'flex' }}>
            <img src={imgKsMark} alt="logo" style={{ width: '27px' }} />
            <Box style={{ marginLeft: 15 }}>품명 검색</Box>
          </Box>
        }
        style={{ width: '1200px', height: '840px' }}
        id="SearchDialog"
        bodyCls="f-column"
        closable
        draggable
        modal
        onClose={onClose}
      >
        <PerfectScrollbar className="mainCon">
          <Layout style={{ widtah: '100%', height: '275px' }}>
            <LayoutPanel split style={{ width: '100%', height: '100%' }}>
              <PerfectScrollbar>
                <Box style={{ marginLeft: 8, marginTop: 3, display: 'flex', alignItems: 'center' }}>
                  <Box className={classes.SA1} style={{ width: 100 }}>
                    <Box className={classes.SA2}>재고자산</Box>
                  </Box>
                  <Box
                    style={{ height: 25, border: '2px solid #bed7ff', color: '#434343', width: '332px', display: 'flex', padding: 2 }}
                    id={UtilCommon.fMakeId('radioBox1')}
                    name={UtilCommon.fMakeId('radioBox1')}
                    className="inputCls"
                    onKeyDown={(event) => fRadioTap(event, UtilCommon.fMakeId('radioBox1'))}
                  >
                    <Box style={{ width: '20%', marginLeft: 5, borderRadius: '5px', display: 'flex' }}>
                      <RadioButton
                        style={{ width: '15px', height: '15px' }}
                        idputId={UtilCommon.fMakeId('rdoGoodtype0')}
                        value="055001"
                        groupValue={goodsVO.GoodType}
                        onChange={(checked) => fHandleChangeGoodtype('055001', checked)}
                      />
                      <Label htmlFor={UtilCommon.fMakeId('rdoGoodtype0')} style={{ marginLeft: '3px', marginTop: '-7px', width: 80, fontSize: '12px' }}>
                        원재료
                      </Label>
                    </Box>
                    <Box style={{ width: '20%', borderRadius: '5px', display: 'flex' }}>
                      <RadioButton
                        style={{ width: '15px', height: '15px' }}
                        idputId={UtilCommon.fMakeId('rdoGoodtype1')}
                        value="055008"
                        groupValue={goodsVO.GoodType}
                        onChange={(checked) => fHandleChangeGoodtype('055008', checked)}
                      />
                      <Label htmlFor={UtilCommon.fMakeId('rdoGoodtype1')} style={{ marginLeft: '3px', marginTop: '-7px', width: 80, fontSize: '12px' }}>
                        반제품
                      </Label>
                    </Box>
                    <Box style={{ width: '20%', borderRadius: '5px', display: 'flex' }}>
                      <RadioButton
                        style={{ width: '15px', height: '15px' }}
                        idputId={UtilCommon.fMakeId('rdoGoodtype2')}
                        value="055004"
                        groupValue={goodsVO.GoodType}
                        onChange={(checked) => fHandleChangeGoodtype('055004', checked)}
                      />
                      <Label htmlFor={UtilCommon.fMakeId('rdoGoodtype2')} style={{ marginLeft: '3px', marginTop: '-7px', width: 80, fontSize: '12px' }}>
                        제품
                      </Label>
                    </Box>
                    <Box style={{ width: '20%', borderRadius: '5px', display: 'flex' }}>
                      <RadioButton
                        style={{ width: '15px', height: '15px' }}
                        idputId={UtilCommon.fMakeId('rdoGoodtype3')}
                        value="055005"
                        groupValue={goodsVO.GoodType}
                        onChange={(checked) => fHandleChangeGoodtype('055005', checked)}
                      />
                      <Label htmlFor={UtilCommon.fMakeId('rdoGoodtype3')} style={{ marginLeft: '3px', marginTop: '-7px', width: 80, fontSize: '12px' }}>
                        소모품
                      </Label>
                    </Box>
                    <Box style={{ width: '20%', borderRadius: '5px', display: 'flex' }}>
                      <RadioButton
                        style={{ width: '15px', height: '15px' }}
                        idputId={UtilCommon.fMakeId('rdoGoodtype3')}
                        value=""
                        groupValue={goodsVO.GoodType}
                        onChange={(checked) => fHandleChangeGoodtype('', checked)}
                      />
                      <Label htmlFor={UtilCommon.fMakeId('rdoGoodtype3')} style={{ marginLeft: '3px', marginTop: '-7px', width: 80, fontSize: '12px' }}>
                        전체
                      </Label>
                    </Box>
                  </Box>
                  <LinkButton style={{ width: 100, height: 30, marginLeft: 'auto', marginRight: 10, marginTop: 2 }} className="c11" onClick={fDeleteCondition}>
                    <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box style={{ fontSize: 14, fontWeight: 400 }}>조건초기화</Box>
                    </Box>
                  </LinkButton>
                </Box>

                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -5 }}>
                  <CodeHelperPopup
                    pgmid={PGMID}
                    inputCls="inputCls"
                    id="SearchGoods1"
                    inputType=""
                    title="대분류"
                    helper={refHelperClass1.current}
                    ComponentCode={goodsVO.SearchGoods1cd}
                    ComponentValue={goodsVO.SearchGoods1nm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '3px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                  />
                  <CodeHelperPopup
                    pgmid={PGMID}
                    inputCls="inputCls"
                    inputType=""
                    id="SearchGoods2"
                    title="중분류"
                    helper={refHelperClass2.current}
                    ComponentCode={goodsVO.SearchGoods2cd}
                    ComponentValue={goodsVO.SearchGoods2nm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('SearchGoods2')}
                  />
                  <CodeHelperPopup
                    pgmid={PGMID}
                    inputCls="inputCls"
                    inputType=""
                    id="SearchGoods3"
                    title="소분류"
                    helper={refHelperClass3.current}
                    ComponentCode={goodsVO.SearchGoods3cd}
                    ComponentValue={goodsVO.SearchGoods3nm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('SearchGoods3')}
                  />
                </Box>
                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -3 }}>
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="HalfGoodsPart"
                    title="반제품PART"
                    helper={refHelperHalfGoodsPart.current}
                    ComponentCode={goodsVO.HalfGoodsPartcd}
                    ComponentValue={goodsVO.HalfGoodsPartnm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('HalfGoodsPart')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="HalfGoodsType"
                    title="반제품TYPE"
                    helper={refHelperHalfGoodsType.current}
                    ComponentCode={goodsVO.HalfGoodsTypecd}
                    ComponentValue={goodsVO.HalfGoodsTypenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('HalfGoodsType')}
                  />
                </Box>

                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -3 }}>
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="SeatType"
                    title="Seat"
                    helper={refHelperSeatType.current}
                    ComponentCode={goodsVO.SeatTypecd}
                    ComponentValue={goodsVO.SeatTypenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('SeatType')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="BdbtStem"
                    title="BD-BT&Stem"
                    helper={refHelperBdbtStem.current}
                    ComponentCode={goodsVO.BdbtStemcd}
                    ComponentValue={goodsVO.BdbtStemnm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('BdbtStem')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="DiskType"
                    title="Disk"
                    helper={refHelperDiskType.current}
                    ComponentCode={goodsVO.DiskTypecd}
                    ComponentValue={goodsVO.DiskTypenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('DiskType')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="Special"
                    title="Special"
                    helper={UtilCodeHelper.helperSpecial}
                    ComponentCode={goodsVO.Specialcd}
                    ComponentValue={goodsVO.Specialnm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('Special')}
                  />
                </Box>
                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -3 }}>
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="RatingType"
                    title="Rating"
                    helper={UtilCodeHelper.helperRatingType}
                    ComponentCode={goodsVO.RatingTypecd}
                    ComponentValue={goodsVO.RatingTypenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('RatingType')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="Bore"
                    title="Bore"
                    helper={UtilCodeHelper.helperBore}
                    ComponentCode={goodsVO.Borecd}
                    ComponentValue={goodsVO.Borenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('Bore')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="SizeType"
                    title="Size"
                    helper={UtilCodeHelper.helperSizeType}
                    ComponentCode={goodsVO.SizeTypecd}
                    ComponentValue={goodsVO.SizeTypenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('SizeType')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="End"
                    title="End"
                    helper={UtilCodeHelper.helperEnd}
                    ComponentCode={goodsVO.Endcd}
                    ComponentValue={goodsVO.Endnm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('End')}
                  />
                </Box>
                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -3 }}>
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="Body"
                    title="Body 재질"
                    helper={UtilCodeHelper.helperBody}
                    ComponentCode={goodsVO.Bodycd}
                    ComponentValue={goodsVO.Bodynm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('Body')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="Trim"
                    title="Trim 재질"
                    helper={UtilCodeHelper.helperTrim}
                    ComponentCode={goodsVO.Trimcd}
                    ComponentValue={goodsVO.Trimnm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('Trim')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="Operator"
                    title="Operator"
                    helper={UtilCodeHelper.helperOperator}
                    ComponentCode={goodsVO.Operatorcd}
                    ComponentValue={goodsVO.Operatornm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, margin: '8px 3px 0px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180 }}
                    disabled={fDisabledControl('Operator')}
                  />
                </Box>
                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -3 }}>
                  <Box className={classes.SA1} style={{ width: 100, marginLeft: 10, marginTop: 10 }}>
                    <Box className={classes.SA2} style={{ width: 100 }}>
                      PIV(LENGTH)
                    </Box>
                  </Box>
                  <TextBox
                    inputCls="inputCls"
                    name="PivLength"
                    inputId={UtilCommon.fMakeId('PivLength')}
                    value={goodsVO.PivLength}
                    onChange={(value) => {
                      UtilCommon.fFieldChange(setGoodsVO, 'PivLength', value);
                    }}
                    className={classes.SC3}
                    style={{ marginTop: 10, width: 180 }}
                    disabled={fDisabledControl('PivLength')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="PivSize"
                    title="PIV(SIZE)"
                    helper={UtilCodeHelper.helperTrim}
                    ComponentCode={goodsVO.PivSizecd}
                    ComponentValue={goodsVO.PivSizenm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, marginLeft: 10, marginRight: 3, padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180, marginTop: -15 }}
                    disabled={fDisabledControl('PivSize')}
                  />
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="PivSpec"
                    title="PIV(SPEC)"
                    helper={UtilCodeHelper.helperOperator}
                    ComponentCode={goodsVO.PivSpeccd}
                    ComponentValue={goodsVO.PivSpecnm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, marginLeft: 10, marginRight: 3, padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180, marginTop: -15 }}
                    disabled={fDisabledControl('PivSpec')}
                  />
                </Box>
                <Box style={{ width: '100%', borderRadius: '5px', display: 'flex', marginTop: -5 }}>
                  <CodeHelperPopup
                    inputCls="inputCls"
                    pgmid={PGMID}
                    inputType=""
                    id="SearchGoods4"
                    title="강종"
                    helper={UtilCodeHelper.helperSearchGoods4}
                    ComponentCode={goodsVO.SearchGoods4cd}
                    ComponentValue={goodsVO.SearchGoods4nm}
                    SetValue={fsetValue}
                    labelStyles={{ width: 100, height: 25, marginLeft: 10, marginRight: 3, padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                    inputStyles={{ width: 180, marginTop: -15 }}
                    disabled={fDisabledControl('SearchGoods4')}
                  />
                  <Box
                    display="flex"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fSearch();
                        setTimeout(() => {
                          gridView.setFocus();
                        }, 0);
                      }
                    }}
                  >
                    <Box className={classes.SA1} style={{ width: 100, marginLeft: 10, marginTop: 10 }}>
                      <Box className={classes.SA2} style={{ width: 100 }}>
                        규격(SPEC)
                      </Box>
                    </Box>
                    <TextBox
                      inputCls="inputCls"
                      name="Spec"
                      inputId={UtilCommon.fMakeId('Spec')}
                      value={goodsVO.Spec}
                      onChange={(value) => {
                        UtilCommon.fFieldChange(setGoodsVO, 'Spec', value);
                      }}
                      className={classes.SC3}
                      style={{ marginTop: 10, width: 180 }}
                      disabled={fDisabledControl('Spec')}
                    />
                  </Box>
                  <Box display="flex" onKeyDown={(e) => fTabGoodno(e)}>
                    <Box className={classes.SA1} style={{ width: 100, marginTop: 10, marginLeft: 10 }}>
                      품목번호
                    </Box>
                    <TextBox
                      inputCls="inputCls"
                      name="Goodno"
                      inputId={UtilCommon.fMakeId('Goodno')}
                      value={goodsVO.Goodno}
                      onChange={(value) => {
                        UtilCommon.fFieldChange(setGoodsVO, 'Goodno', value);
                      }}
                      className={classes.SC3}
                      style={{ marginTop: 10, width: 180 }}
                    />
                  </Box>
                  <Box style={{ marginTop: 8 }}>
                    <LinkButton style={{ width: 100, height: 30, marginLeft: 80 }} id="SaveButton" className="c15" onClick={fSaveCondition}>
                      <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box style={{ fontSize: 14, fontWeight: 400 }}>조건저장</Box>
                      </Box>
                    </LinkButton>
                    <LinkButton style={{ width: 100, height: 30, marginLeft: 15 }} id="SearchButton" className="c12" onClick={fSearch}>
                      <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box style={{ fontSize: 14, fontWeight: 400 }}>검색</Box>
                      </Box>
                    </LinkButton>
                  </Box>
                </Box>
              </PerfectScrollbar>
            </LayoutPanel>
          </Layout>
          <Box ref={refGrid00} id={UtilCommon.fMakeId('Grid00')} style={{ width: '100%', height: 260 }} />
          <Box style={{ width: '100%', height: 20, background: '#eef4ff' }} />
          <Box ref={refGrid01} id={UtilCommon.fMakeId('Grid01')} style={{ width: '100%', height: 200, border: '2px solid #2984a4' }} />
          <Box styles={{ width: '100%' }}>
            <LinkButton style={{ width: 100, height: 30, marginLeft: 960, marginTop: 7, borderRadius: 3 }} className="c12" onClick={() => fConfirm2()}>
              <Box style={{ width: 120, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box style={{ fontSize: 14, paddingBottom: 2, fontWeight: 400 }}>완료</Box>
              </Box>
            </LinkButton>
            <LinkButton style={{ width: 100, height: 30, marginLeft: 10, marginTop: 7, borderRadius: 3 }} className="c11" onClick={() => fClose2()}>
              <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box style={{ fontSize: 14, paddingBottom: 2, fontWeight: 400 }}>닫기</Box>
              </Box>
            </LinkButton>
          </Box>
        </PerfectScrollbar>
      </Dialog>
    </>
  );
};

let dataProvider, selectDataProvider;
let gridView, selectGridView;

const Styles = createUseStyles(StylesMain);

export default SearchGoods;
