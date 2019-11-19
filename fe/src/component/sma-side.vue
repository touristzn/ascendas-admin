<template>
  <div class="side" :class="{'is-folded': isFolded}">

    <!-- logo -->
    <a class="logo">
      <span class="img">
        <img src="../asset/image/logo.png" alt="">
      </span>
      {{__('title')}}
    </a>

    <!-- top -->
    <div class="nav-toggle" @click="toggleNav">
      <i class="fa fa-bars"></i>
    </div>

    <!-- tip -->
    <div
      class="nav-tip"
      v-show="isFolded && isTipShow"
      :style="{top: tipTop + 'px'}"
    >
      {{tipText}}
    </div>

    <!-- navs -->
    <div class="nav-wrapper" ref="wrapper">
      <div>
        <div class="nav-list" v-for="(nav, navIndex) in menus" :key="navIndex">

          <a
            class="nav-title a"
            :class="{
              'is-active': menuPath[0] == navIndex,
              'is-parent': nav.children.length,
              'is-folded': nav.isFolded
            }"
            @click="menuClick(nav, navIndex)"
            @mouseenter="enterItem($event, nav)"
            @mouseleave="leaveItem($event)"
          >
            <!-- <span class="nav-icon" v-if="nav.children.length">
              <i class="fa fa-caret-right" aria-hidden="true"></i>
            </span> -->
            <span class="nav-icon">
              <i class="fa" aria-hidden="true" :class="nav.icon"></i>
            </span>
            <span class="nav-tc">
              {{nav.title}}
            </span>
            <span class="nav-icon-tg" v-if="nav.children.length">
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </span>
          </a>

          <ul
            v-if="nav.children.length"
            :class="{'is-folded': nav.isFolded}"
            :style="{'max-height': 50 * nav.children.length + 'px'}"
          >
            <li v-for="(navItem, navItemIndex) in nav.children" :key="navItemIndex">
              <a
                class="a"
                :class="{
                  'is-active': menuPath[0] == navIndex && menuPath[1] == navItemIndex,
                }"
                @click="menuClick(navItem, navIndex, navItemIndex)"
                @mouseenter="enterItem($event, navItem)"
                @mouseleave="leaveItem($event)"
              >
                <span class="nav-icon">
                  <!-- <i class="fa" aria-hidden="true" :class="navItem.icon"></i> -->
                </span>

                <span class="nav-tc">
                  {{navItem.title}}
                </span>
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>

    <!-- sub nav -->
    <div class="snav-wc" v-if="subMenus.length">
      <div class="snav" :class="{'is-folded': isSubFolded}">

        <div class="snav-toggle" @click="toggleSubNav">
          <i class="fa fa-outdent" aria-hidden="true"></i>
        </div>

        <div class="snav-wrapper" ref="wrapper">
          <div>
            <div class="snav-list" v-for="(nav, navIndex) in subMenus" :key="navIndex">

              <a
                class="snav-title"
                :class="{
                  'is-active': menuPath[2] == navIndex,
                  'is-parent': nav.children.length,
                  'is-folded': nav.isFolded
                }"
                @click="subMenuClick(nav)"
              >
                <span class="snav-icon" v-if="nav.children.length">
                  <i class="fa fa-caret-right" aria-hidden="true"></i>
                </span>
                <span class="snav-icon" v-if="!nav.children.length"></span>
                <span class="snav-tc">
                  {{nav.title}}
                </span>
              </a>

              <ul
                v-if="nav.children.length"
                :class="{'is-folded': nav.isFolded}"
                :style="{'max-height': 50 * nav.children.length + 'px'}"
              >
                <li v-for="(navItem, navItemIndex) in nav.children" :key="navItemIndex">
                  <a
                    :class="{
                      'is-active': menuPath[2] == navIndex && menuPath[3] == navItemIndex,
                    }"
                    @click="subMenuClick(navItem)"
                  >
                    <span class="snav-tc">
                      <span class="snav-icon"></span>
                      {{navItem.title}}
                    </span>
                  </a>
                </li>
              </ul>

            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import catchError from '../lib/catchError';

/**
 * sidebar component description
 * @vuedoc
 * @exports component/side-bar
 */
export default {
  name: 'sma-side',
  props: {
    //
  },
  data() {
    return {
      isFolded: false,
      isSubFolded: false,

      // tip
      tipText: '',
      tipTop: 100,
      isTipShow: false,

      clickMenuPath: [],
    }
  },
  computed: {
    // 当前导航的菜单路径: [一级Index, 二级Index, 三级Index, 四级Index]
    menuPath() {
      let path = this.$route.path;
      let menus = this.$state.config.menus;
      let paths = [];

      menus.forEach((a, aIndex) => {
        // 一级
        if (!a.children.length) {
          if (a.path == path) {
            paths = [aIndex];
          }
          return;
        }

        a.children.forEach((b, bIndex) => {
          // 二级
          if (!b.children.length) {
            if (b.path == path) {
              paths = [aIndex, bIndex];
            }
            return;
          }

          b.children.forEach((c, cIndex) => {
            // 三级
            if (!c.children.length) {
              if (c.path == path) {
                paths = [aIndex, bIndex, cIndex];
              }
              return;
            }

            // 四级
            c.children.forEach((d, dIndex) => {
              if (d.path == path) {
                paths = [aIndex, bIndex, cIndex, dIndex];
              }
            });
          })
        });
      });

      return paths;
    },
    // 一级菜单
    menus() {
      return this.$state.config.menus;
    },
    // 二级菜单
    subMenus() {
      let menus = this.$state.config.menus;
      let menuPath = this.menuPath;
      let clickPath = this.clickMenuPath;

      // 返回当前点击的菜单子菜单列表
      if (clickPath.length) {
        return menus[clickPath[0]].children[clickPath[1]].children;
      }

      if (menuPath.length <= 2) return [];

      return menus[menuPath[0]].children[menuPath[1]].children;
    }
  },
  created() {

  },
  mounted() {

  },
  beforeDestroy() {
    this.tipTimer && clearTimeout(this.tipTimer);
  },
  watch: {
    '$route'() {
      this.isSubFolded = true;
      this.clickMenuPath = [];
    },
    isSubFolded(val) {
      if (val === true) {
        this.clickMenuPath = [];
      }
    }
  },
  methods: {
    // 整个左侧栏展开收起
    toggleNav() {
      this.isFolded =  !this.isFolded;
    },
    //
    toggleSubNav() {
      this.isSubFolded =  !this.isSubFolded;
    },
    // 展开收起一个菜单
    toogleMenu(item) {
      item.isFolded = !item.isFolded;
    },
    // 点击菜单
    menuClick(item, aIndex, bIndex) {
      this.clickMenuPath = [];

      if (item.children.length) {
        // parent
        item.isFolded = !item.isFolded;

        if (bIndex !== undefined) {
          this.clickMenuPath = [aIndex, bIndex];
          this.isSubFolded = false;
        }
      } else if (item.path) {
        // path
        this.$router.push({
          path: item.path
        });
      } else if (item.link) {
        // link
        if (item.target == '_blank') {
          window.open(item.link);
        } else {
          location.href = item.link;
        }
      }
    },
    // 点击子菜单
    subMenuClick(item) {
      if (item.children.length) {
        // parent
        item.isFolded = !item.isFolded;
      } else if (item.path) {
        // path
        this.$router.push({
          path: item.path
        });
      } else if (item.link) {
        // link
        if (item.target == '_blank') {
          window.open(item.link);
        } else {
          location.href = item.link;
        }
      }
    },
    // 鼠标移到一个菜单
    enterItem($event, item) {
      if (!this.isFolded) return;

      this.tipTimer && clearTimeout(this.tipTimer);

      let $el = this.$el;
      let $target = $event.target;
      let elRect = $el.getBoundingClientRect();
      let targetReact = $target.getBoundingClientRect();
      let top = targetReact.top - elRect.top;

      this.isTipShow = true;
      this.tipTop = top;
      this.tipText = item.title;
    },
    // 鼠标离开菜单
    leaveItem() {
      this.tipTimer && clearTimeout(this.tipTimer);
      this.tipTimer = setTimeout(() => {
        this.isTipShow = false;
      }, 300);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/theme/_default.scss";
.side {
  height: 100%;
  width: 180px;
  background: $sma-side-bg;
  font-size: 0.75rem;
  position: relative;
  transition: width .3s ease;
  z-index: 10;
  box-shadow: $sma-side-shadow;

  .logo {
    width: 100%;
    background: $sma-side-bg-logo;
    line-height: 50px;
    display: block;
    white-space: nowrap;
    color: $sma-side-color-em;
    font-size: 20px;
    transition: all .3s ease;
    overflow: hidden;

    .img {
      display: block;
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      float: left;
    }

    img {
      display: inline-block;
      width: 30px;
      height: 30px;
      vertical-align: middle;
    }
  }

  .a {
    display: block;
    cursor: pointer;
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    color: $sma-side-color;

    &.is-active,
    &:hover {
      color: $sma-side-color-em;
    }

    &.is-active:not(.is-parent) {
      background: $sma-side-bg-active;
    }
  }

  .nav-toggle {
    line-height: 40px;
    background: $sma-side-bg-logo;
    border-top: 1px solid $sma-side-bg-children;
    border-bottom: 1px solid $sma-side-bg-children;
    text-align: center;
    cursor: pointer;
    color: $sma-side-color;

    i {
      transform: rotate(90deg);
    }
  }

  .nav-wrapper {
    position: absolute;
    width: 100%;
    top: 90px;
    bottom: 0;
    overflow: hidden;

    > div {
      position: absolute;
      left: 0;
      right: -30px;
      top: 0;
      bottom: 0;
      padding-right: 30px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  .nav-list {
    width: 180px;

    ul {
      background: $sma-side-bg-children;
      max-height: 1000px;
      transition: all .3s ease;
      overflow-y: hidden;

      &.is-folded {
        max-height: 0!important;
      }
    }

    li {
      line-height: 40px;
    }

    .nav-icon {
      display: inline-block;
      width: 30px;
      text-align: center;
    }

    .nav-icon-tg {
      display: inline-block;
      width: 30px;
      text-align: center;
      font-size: 12px;
      opacity: .7;
    }

    .nav-tc {
      flex: 1;
      overflow: hidden;
    }
  }

  &.is-folded {
    width: 50px;
    .nav-tc {
      display: none;
    }
    .nav-icon {
      width: 50px;
    }
    .nav-icon-tg {
      display: none;
    }
  }

  .nav-title {
    line-height: 40px;
    cursor: pointer;

    &.is-parent {
      .nav-icon-tg {
        transform: rotate(-90deg);
        transition: all .3s ease;
      }
      &.is-folded .nav-icon-tg {
        transform: rotate(90deg);
      }
    }
  }

  .nav-tip {
    position: absolute;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    background: $sma-side-bg;
    color: $sma-side-color-em;
    left: 60px;
    top: 100px;
    z-index: 3;
    transition: top .3s ease-in-out;
    min-width: 80px;
    max-width: 180px;
    white-space: nowrap;

    &::before {
      display: block;
      content: ' ';
      width: 0;
      height: 0;
      overflow: hidden;
      border-color: transparent $sma-side-bg transparent transparent;
      border-width: 8px 10px 8px 0;
      border-style: dashed solid dashed dashed;
      position: absolute;
      left: -10px;
      top: 14px;
    }
  }

  .snav-wc {
    position: absolute;
    right: 0;
    top: 51px;
    bottom: 0;
    width: 0;
    z-index: 2;
  }

  .snav {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 180px;
    background: $sma-snav-bg;
    font-size: 0.75rem;
    transition: width .3s ease;
    box-shadow: $sma-side-shadow;

    a {
      display: block;
      cursor: pointer;
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      color: $sma-snav-color;

      &:hover {
        color: $sma-snav-color-em;
      }

      &.is-active:not(.is-parent) {
        background: $sma-snav-bg-active;
        color: $sma-snav-color-active;
      }
    }

    .snav-toggle {
      position: absolute;
      width: 20px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: $sma-snav-bg-toggle;
      cursor: pointer;
      right: 0;
      top: 50%;
      margin-top: -15px;
      z-index: 5;
      transition: all .3s ease;
      transform: scaleX(.7);
      transform-origin: right center;

      &:hover {
        transform: scaleX(1.1);
        opacity: 1;
      }

      &::before,
      &::after {
        content: ' ';
        display: block;
        position: absolute;
        overflow: hidden;
      }

      &::before {
        width: 0;
        height: 0;
        left: 0;
        top: -10px;
        border-top: 0px dashed transparent;
        border-left: 20px dashed transparent;
        border-bottom: 10px solid $sma-snav-bg-toggle;
        border-right: 0px solid $sma-snav-bg-toggle;
      }

      &::after {
        width: 0;
        height: 0;
        left: 0;
        bottom: -10px;
        border-bottom: 0px dashed transparent;
        border-left: 20px dashed transparent;
        border-top: 10px solid $sma-snav-bg-toggle;
        border-right: 0px solid $sma-snav-bg-toggle;
      }
    }

    .snav-wrapper {
      position: absolute;
      width: 100%;
      top: 0px;
      bottom: 0;
      overflow: hidden;

      > div {
        position: absolute;
        left: 0;
        right: -30px;
        top: 0;
        bottom: 0;
        padding-right: 30px;
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }

    .snav-list {
      width: 180px;
    }

    .snav-title {
      line-height: 40px;
      cursor: pointer;

      &.is-active.is-parent {
        font-weight: bold;
      }

      &.is-parent {
        .snav-icon {
          transform: rotate(90deg);
          transition: all .3s ease;
        }
        &.is-folded .snav-icon {
          transform: rotate(0deg);
        }
      }
    }

    ul {
      max-height: 1000px;
      transition: all .3s ease;
      overflow-y: hidden;

      &.is-folded {
        max-height: 0!important;
      }
    }

    li {
      line-height: 40px;
    }

    .snav-icon {
      display: inline-block;
      width: 30px;
      text-align: center;
    }

    .snav-tc {
      flex: 1;
      overflow: hidden;
      display: flex;
    }

    &.is-folded {
      width: 0px;

      .snav-h,
      .snav-wrapper {
        width: 0px;
        padding: 0;
        overflow: hidden;
      }

      .snav-tc {
        display: none;
      }

      .snav-toggle {
        background: $sma-snav-bg-toggle-folded;
        transform: rotateY(180deg) scaleX(0.8);

        &:hover {
          transform: rotateY(180deg) scaleX(1.1);
        }

        &::before {
          border-bottom: 10px solid $sma-snav-bg-toggle-folded;
          border-right: 0px solid $sma-snav-bg-toggle-folded;
        }

        &::after {
          border-top: 10px solid $sma-snav-bg-toggle-folded;
          border-right: 0px solid $sma-snav-bg-toggle-folded;
        }
      }
    }
  }
}
</style>
