<template>
  <el-dialog title="用户权限"
    :visible.sync="visible"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">

    <div class="sma-detail-a" v-loading="loading">
      <dl v-if="item.isAssign" v-for="(item,index) in userPermission" :key="index">
        <dt>{{item.name}}</dt>
        <dd v-if="item.isAssign" v-for="(el,i) in item.childrenList" :key="i">
          {{el.name}}
        </dd>
      </dl>
    </div>
  </el-dialog>
</template>

<script>
import { copyJson } from "../../../lib/utils";

export default {
  name: 'com-role-view',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      userPermission: null
    }
  },
  created() {
    this.getRolePermission();
  },
  methods: {
    getRolePermission() {
      this.$unsubscribe('initData');
      this.$subs.initData = this.$hub.flow([{
        id: this.id
      }])
        .use('role.rolePermission')
        .subscribe(
          (res) => {
            this.loading = false;
            this.userPermission = res;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    onClose() {
      this.$emit('close');
    }
  }
}
</script>
