<template>
  <div class="top" :class="{'is-folded': folded}">
    <div class="center">
      <div class="open-mods">
        <ul ref="mods">
          <li
            class="item"
            :class="{'is-active': item.active}"
            :data-path="item.path"
            v-for="(item, index) in openMods"
            :key="item.path"
            @click="goToMod(item.path)"
            :ref="item.active ? 'activeItem' : 'item'"
          >
            <a
              title="refresh"
              class="refresh"
              @click.stop="refreshMod(item.path)"
            >
              <i class="fa fa-refresh"></i>
            </a>
            <span class="txt" :title="item.title">{{item.title}}</span>
            <a
              title="close"
              class="close"
              @click.stop="closeMod(item.path)"
            >
              <i class="fa fa-times"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- <a class="top-item">
      <el-dropdown trigger="click" class="drop">
        <span class="el-dropdown-link drop-link">
          语言 <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in feLanguages" :key="item.key">
            <a :href="'/' + item.key + '/app' + $route.fullPath">{{item.label}}</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </a> -->

    <a class="top-item">
      <el-dropdown trigger="click" class="drop">
        <span class="el-dropdown-link drop-link">
          {{loginUser.username}} 
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <a @click="logout">
              退出登录
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </a>
  </div>
</template>


<script>
/**
 * @vuedoc
 * @exports component/top-bar
 */
export default {
  name: 'sma-top',
  props: {
    folded: {
      type: Boolean,
      default: false,
    },
    openMods: {
      type: Array,
      default: () => [],
    }
  },
  computed: {
    loginUser() {
      return this.$state.loginUser;
    },
    feLanguages() {
      return this.$state.feLanguages;
    }
  },
  methods: {
    closeMod(path) {
      this.$emit('close-mod', path);
    },
    goToMod(path) {
      this.$emit('goto-mod', path);
    },
    refreshMod(path) {
      this.$emit('refresh-mod', path);
    },
    scrollToView() {
      let $activeItem = this.$refs.activeItem[0];
      let $mods = this.$refs.mods;
      let olActive = $activeItem.offsetLeft;
      let w = $mods.offsetWidth;
      let sl = Math.max(olActive - w / 2, 0);

      $mods.scrollLeft = sl;
    },
    logout() {
      this.$store.commit('setLoginUser', null);
      this.$router.push('/login');
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.scrollToView();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/theme/_default.scss";

.top {
  height: 50px;
  width: 100%;
  font-size: 0.75rem;
  display: flex;
  align-items: stretch;
  background: $sma-top-bg;
  box-shadow: $sma-top-shadow;

  &.is-folded .logo {
    width: 50px;
  }

  .center {
    flex: 1 0 0;
    width: 0;
    overflow: hidden;
  }

  .drop {
    color: $sma-top-color;
  }

  .drop-link {
    line-height: 50px;
    display: inline-block;
  }

  &-item {
    float: right;
    color: $sma-top-color;
    padding: 0 15px;
    line-height: 50px;
    margin-right: 1px;
    cursor: pointer;
    flex: 0 0 auto;

    &:hover {
      background: $sma-top-bg-hover;
      color: $sma-top-color-em;

      .drop {
        color: $sma-top-color-em;
      }
    }
  }

  .open-mods {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0 6px;
    border-right: 1px solid $sma-top-bg-hover;

    ul {
      height: 80px;
      white-space: nowrap;
      overflow-x: auto;
      display: block;
      margin: 0;
    }

    li {
      display: inline-flex;
      align-items: center;
      height: 30px;
      line-height: 30px;
      background: $sma-top-mod;
      overflow: hidden;
      margin: 10px 6px 0px;
      border-radius: 3px;
      color: $sma-top-color;
      padding: 0 5px;
      cursor: pointer;
      opacity: .9;

      &::before {
        content: ' ';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: $sma-top-color;
        overflow: hidden;
        margin-right: 5px;
      }

      &:hover {
        color: $sma-top-color-em;
        opacity: 1;
      }

      .txt {
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        overflow: hidden;
      }

      a.refresh {
        display: inline-block;
        overflow: hidden;
        width: 20px;
        height: 20px;
        font-weight: 100;
        line-height: 20px;
        border-radius: 50%;
        text-align: center;
        display: none;
        transition: all .3s ease;
        transform-origin: center center;

        &:hover {
          transform: scale(1.2);
        }
      }

      a.close {
        display: inline-block;
        overflow: hidden;
        width: 20px;
        height: 20px;
        font-weight: 100;
        line-height: 20px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s ease;
        transform-origin: center center;

        &:hover {
          transform: scale(1.2);
        }
      }

      &.is-active {
        opacity: 1;
        background: $sma-top-bg-active;
        color: $sma-top-color-active;

        &::before {
          display: none;
        }

        a.refresh {
          display: inline-block;
        }
      }
    }
  }
}
</style>
