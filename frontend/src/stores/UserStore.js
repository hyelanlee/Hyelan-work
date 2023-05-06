import { makeObservable, observable, action, toJS } from 'mobx';

class UserStore {
  constructor() {
    this.user = {
      userid: '',
      username: '',
      accunit: '',
      factory: '',
      factorynm: '',
      deptcd: '',
      deptnm: '',
      custcd: '',
      custnm: '',
      custtype: '',
      superuser: '',
      orderyn: '',
    };
    this.auth = [];
    this.storekey = '';

    this.fSetUser = (info) => {
      this.user = info;
    };

    this.fClearUser = () => {
      this.user = {
        userid: '',
        username: '',
        accunit: '',
        factory: '',
        factorynm: '',
        deptcd: '',
        deptnm: '',
        custcd: '',
        custnm: '',
        custtype: '',
        superuser: '',
        orderyn: '',
      };
    };

    this.fSetAuth = (info) => {
      this.auth = info;
    };

    this.fGetAuth = () => {
      return toJS(this.auth);
    };

    this.fCheckAuth = (info) => {
      if (info === 'NONE' || info.startsWith('NONE|') || this.user.superuser === 'Y') {
        return true;
      }
      return this.auth.some((item) => item.authid === info);
    };

    this.fCheckPgmGb = (info) => {
      if (this.user.superuser === 'Y') {
        return true;
      }
      return this.auth.some((item) => item.pgmgb === info && item.authtype === 'M');
    };

    this.fSetKey = (info) => {
      this.storekey = info;
    };

    makeObservable(this, {
      user: observable,
      auth: observable,
      storekey: observable,
      fSetUser: action,
      fSetAuth: action,
      fGetAuth: action,
      fCheckAuth: action,
      fCheckPgmGb: action,
      fClearUser: action,
      fSetKey: action,
    });
  }
}

export default UserStore;
