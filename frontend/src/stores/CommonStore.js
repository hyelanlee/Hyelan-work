import { makeObservable, observable, action } from 'mobx';

class CommonStore {
  constructor() {
    this.Dim = window.innerWidth;
    this.DimH = window.innerHeight;
    this.Loading = false;
    this.Codeclass = { selData: {} };
    this.CodeclassConfirm = { visible: false, desc: '', value: '', datas: {}, id: '', viewId: '', selectedData: {} };
    this.CodeclassConfirmFunc = new (function () {})();
    this.Parameter = {};
    this.HotKey = {};
    this.ChangeValue = {};
    this.ChangeDate = new Date();
    this.isPopup = false;
    this.isShift = false;
    this.isBinding = false;
    this.UserCondition = { Good: {} };

    this.fSetDim = (info) => {
      this.Dim = info;
    };

    this.fSetDimH = (info) => {
      this.DimH = info;
    };

    this.fGetResolution = () => {
      if (this.DimH > 1800) {
        return 'UHD';
      } else if (this.DimH > 1100) {
        return 'QHD';
      } else {
        return 'FHD';
      }
    };

    this.fSetLoading = (info) => {
      this.Loading = info;
    };

    this.fSetCodeclass = (info) => {
      this.Codeclass = info;
    };

    this.fSetCodeclassPopup = (info) => {
      this.isPopup = info;
    };

    this.fSetShift = (info) => {
      this.isShift = info;
    };

    this.fSetBinding = (info) => {
      this.isBinding = info;
    };

    this.fSetUserCondition = (target, info) => {
      this.UserCondition[target] = info;
    };

    this.fSetCodeclassConfirm = (info) => {
      this.CodeclassConfirm = info;
    };

    this.fSetCodeclassConfirmFunc = (info) => {
      this.CodeclassConfirmFunc = info;
    };

    this.fSetParameter = (info) => {
      this.Parameter = info;
    };

    this.fSetChangeValue = (info) => {
      this.ChangeValue = info;
    };

    this.fSetHotKey = (info) => {
      this.HotKey = info;
    };

    this.fSetChangeDate = (info) => {
      this.ChangeDate = info;
    };

    this.fGetShift = () => {
      return this.isShift;
    };

    this.fGetBinding = () => {
      return this.isBinding;
    };

    this.fGetUserCondition = (target) => {
      return this.UserCondition[target];
    };

    makeObservable(this, {
      Dim: observable,
      DimH: observable,
      Loading: observable,
      Codeclass: observable,
      CodeclassConfirm: observable,
      CodeclassConfirmFunc: observable,
      Parameter: observable,
      HotKey: observable,
      ChangeValue: observable,
      ChangeDate: observable,
      isPopup: observable,
      isShift: observable,
      isBinding: observable,
      fSetDim: action,
      fSetDimH: action,
      fGetResolution: action,
      fSetLoading: action,
      fSetCodeclass: action,
      fSetCodeclassPopup: action,
      fSetShift: action,
      fGetShift: action,
      fSetBinding: action,
      fGetBinding: action,
      fSetUserCondition: action,
      fGetUserCondition: action,
      fSetCodeclassConfirm: action,
      fSetCodeclassConfirmFunc: action,
      fSetParameter: action,
      fSetHotKey: action,
      fSetChangeValue: action,
      fSetChangeDate: action,
    });
  }
}

export default CommonStore;
