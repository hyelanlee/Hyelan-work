import { makeObservable, observable, action } from 'mobx';

class GlobalStore {
  constructor() {
    this.TxtValue = {};
    this.CbValue = {};

    this.fSetTxtValue = (info) => {
      this.TxtValue = info;
    };

    this.fSetCbValue = (info) => {
      this.TxtValue = info;
    };

    makeObservable(this, {
      TxtValue: observable,
      CbValue: observable,
      fSetTxtValue: action,
      fSetCbValue: action,
    });
  }
}

export default GlobalStore;
