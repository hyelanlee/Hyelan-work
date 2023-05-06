import { makeObservable, observable, action, toJS } from 'mobx';

class TabStore {
  constructor() {
    this.tabs = [];
    this.tabSel = '';

    this.fSetTab = (info) => {
      this.tabs = info;
    };

    this.fGetTab = () => {
      return toJS(this.tabs);
    };

    this.fSetTabSel = (info) => {
      this.tabSel = info;
    };

    this.fGetTabSel = () => {
      return toJS(this.tabSel);
    };

    makeObservable(this, {
      tabs: observable,
      tabSel: observable,
      fSetTab: action,
      fGetTab: action,
      fSetTabSel: action,
      fGetTabSel: action,
    });
  }
}

export default TabStore;
