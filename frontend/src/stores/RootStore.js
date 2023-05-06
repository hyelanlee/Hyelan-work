import UserStore from '@stores/UserStore';
import TabStore from '@stores/TabStore';
import RoutesStore from '@stores/RouteStore';
import CommonStore from '@stores/CommonStore';
import GlobalStore from '@stores/GlobalStore';

class RootStore {
  constructor() {
    this.$UserStore = new UserStore(this);
    this.$TabStore = new TabStore(this);
    this.$RouteStore = new RoutesStore(this);
    this.$CommonStore = new CommonStore(this);
    this.$GlobalStore = new GlobalStore(this);
  }
}

export default RootStore;
