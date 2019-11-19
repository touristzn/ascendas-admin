<template lang="html">
  <div class="mod sma-padding-sm">
    <el-row>
      <el-col :span="24" class="sma-padding-sm">
        <el-card>
          <template slot="header" class="clearfix">
            <span>Hello</span>
          </template>
          <div>
            欢迎使用 Ascendas 后台管理系统！
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getMessages} from '../../data/validate/messages';

/**
 * @vuedoc
 * @exports component/mod/Home
 */
export default {
  name: 'mod-home',
  data() {
    return {}
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '首页'
      });
    });
  },
  mounted() {
    // this.$emit('set-meta', {
    //   path: this.$route.path,
    //   title: '首页'
    // });

    // console.log(getMessages())
  },
  methods: {
    refreshMod() {
      console.log('refresh home mod...');
    }
  }
}
</script>

<style lang="css">
</style>
