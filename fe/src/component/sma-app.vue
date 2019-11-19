<template>
  <div class="sma-app" v-loading="loading">
    <template v-if="initialed && loginUser">
      <!-- side -->
      <div class="sma-side">
        <sma-side></sma-side>
      </div>
      <!-- end -->

      <!-- con -->
      <div class="sma-con">

        <!-- top -->
        <div class="sma-top">
          <sma-top
            @close-mod="closeMod"
            @goto-mod="goToMod"
            @refresh-mod="refreshMod"
            :open-mods="openMods"
          ></sma-top>
        </div>
        <!-- top end -->

        <!-- mod -->
        <div class="sma-mod">
          <transition name="mod">
            <keep-alive>
              <router-view
                @set-meta="setMeta"
                :key="routerViewKey"
                ref="router"
              ></router-view>
            </keep-alive>
          </transition>
        </div>
        <!-- mod end -->

      </div>
      <!-- con end-->
    </template>
    
    <keep-alive>
      <router-view
        v-if="!loginUser"
        @set-meta="setMeta"
        :key="routerViewKey"
        ref="router"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script>
import VueRouter from 'vue-router';
import Cache from '../lib/cache';
import Top from './sma-top';
import Side from './sma-side';
import routes from '../routes';
import store from '../data/stores/main';
import { getAppBaseUrl } from "../util/site";

const router = new VueRouter({
  mode: 'history',
  base: getAppBaseUrl(),
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

/**
* @vuedoc
* @exports component/App
*/
export default {
  router,
  name: 'sma-app',
  components: {
    SmaTop: Top,
    SmaSide: Side,
  },
  data() {
    return {
      openMods: [],

      initialed: false,
      loading: false
    }
  },
  methods: {
    setMeta({path, title}) {
      this.openMods.forEach(item => {
        if (item.path == path) {
          item.title = title;
        }
      });
    },
    // 新开一个模块
    openMod() {
      let path = this.$route.path;
      let findIndex = -1, mod;

      // open mods
      this.openMods.forEach((item, index) => {
        item.active = false;
        if (item.path == path) {
          findIndex = index;
          item.active = true;
        };
      });

      if (findIndex == -1) {
        this.openMods.push({
          path: path,
          title: path,
          active: true
        });
      }

      // 记录顺序，主要为了找到上一个mod
      let index = this.openModsLog.indexOf(path);
      if (index != -1) this.openModsLog.splice(index, 1);
      this.openModsLog.push(path);

      // vms
      this.$nextTick(() => {
        let vm = this.$refs.router;
        if (!vm) {
          this.$message.error(`路径 '${path}' 对应的页面不存在！`)
        }
        this.modInstances[vm.$route.path] = vm;
      });
    },
    // 关闭一个模块
    closeMod(path) {
      console.log('close mod')
      let findIndex = -1;
      let isActive = false;

      this.openMods.forEach((item, index) => {
        if (item.path == path) {
          findIndex = index;
          isActive = item.active;
        };
      });

      this.openMods.splice(findIndex, 1);

      // remove from log
      let index = this.openModsLog.indexOf(path);
      if (index != -1) this.openModsLog.splice(index, 1);

      // 如果删除的是当前mod，打开上一个mod
      if (isActive) {
        let newPath;

        if (this.openModsLog.length) {
          newPath = this.openModsLog[this.openModsLog.length - 1];
        } else {
          newPath = '/';
        }

        this.$router.push({path: newPath});
      }

      // 删除组件实例
      if (this.modInstances[path]) {
        this.modInstances[path].$destroy();
      }
    },
    // 跳转到一个已经打开的模块
    goToMod(path) {
      let index = this.openModsLog.indexOf(path);
      if (index != -1) this.openModsLog.splice(index, 1);
      this.openModsLog.push(path);
      this.$router.push({path: path});
    },
    refreshMod(path) {
      let vm = this.modInstances[path];
      if (typeof vm.refreshMod === 'function') {
        vm.refreshMod();
      }
    },
    checkLogin() {
      if (!this.loginUser) {
        if (this.$route.name != 'login') {
          return this.$router.push('/login');
        }
      } 

      if (this.$route.name != 'login') {
        if (!this.initialed) {
          this.initData(() => {
            this.openMod();
          })
        } else {
          this.openMod();
        }
      } 
    },
    initData(callback) {
      let menusOb = this.$hub.flow([{}])
        .use('config.menus');
      let enumsOb = this.$hub.flow([{}])
        .use('config.enums');
      // let userInfo = this.$hub.flow([{}])
      //   .use('user.loginInfo');

      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flowAll([
        menusOb,
        enumsOb,
        // userInfo
      ])
        .subscribe(
          ([menus, enums, user]) => {
            this.loading = false;
            // this.$store.commit('setLoginUser', user);
            this.$store.commit('setMenus', menus);
            this.$store.commit('enums.updateAll', enums);
            this.initialed = true;
            callback && callback();
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    }
  },
  computed: {
    routerViewKey() {
      let path = this.$route.path;
      return `${path}`;
    },
    loginUser() {
      return this.$state.loginUser
    }
  },
  beforeCreate() {
    this.modInstances = {};
    this.openModsLog = [];
  },
  created() {
    this.$msg = new Cache();
  },
  mounted() {
    // 模块实例
    // this.openMod();
    this.checkLogin();

    console.log('i18n', this.__('test.test'));
    console.log('i18n', this.__('testCom'));
    
  },
  beforeRouteEnter(to, from, next) {
    // console.log('beforeRouteEnter');
    next();
  },
  watch: {
    $route(route, lastRoute) {
      console.log('route change')
      // this.openMod();
      this.checkLogin();
    },
    loginUser() {
      console.log('login user change');
      this.checkLogin();
    }
  }
}
</script>

<style lang="scss">
.sma-app {
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  .sma-side {
    //
  }

  // com
  .sma-con {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
  }

  // top
  .sma-top {
    height: 50px;
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 99;
  }

  .sma-mod {
    flex: 1;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    > .mod {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;

      &.is-loading {
        overflow: hidden;
      }

      // mod transition
      &.mod-enter {
        transform: translateX(20px) translateY(0px);
      }
      &.mod-leave-active {
        transform: translateX(-20px) translateY(20px);
      }

      &.mod-enter-active,
      &.mod-leave-active {
        transition: transform .3s linear;
      }

      &.mod-leave-active {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
</style>
