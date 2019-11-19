<template>
  <el-dialog
    title="门禁详情"
    :visible.sync="visible"
    width="500"
    class="sma-dialog-wrapper"
    custom-class="sma-dialog"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <ul class="perms" v-loading="loading">
      <li>
        <div class="perms-tit">
          已绑定的门禁:
        </div>
        <el-table
          :data="resPermissions"
          border
          :fit="true"
          size="mini"
        >
          <el-table-column
            prop="permissionName"
            label="门禁名称"
            min-width="150">
          </el-table-column>
          <el-table-column
            :label="__('operation')"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="removeFromResource(scope.row, scope.$index)"
              >{{__('btn.remove')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li>
        <div class="perms-tit">
          未绑定门禁:
        </div>
        <el-table
          :data="freePermissions"
          border
          :fit="true"
          size="mini"
          style="width: 100%"
        >
          <el-table-column
            prop="permissionName"
            label="门禁名称"
            min-width="150">
          </el-table-column>
          <el-table-column
            :label="__('operation')"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="addToResource(scope.row, scope.$index)"
              >加入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
import {copyJson} from '../../../lib/utils';

export default {
  name: 'com-resource-doolock',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      permissions: [],
      resPermissions: []
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    },
    freePermissions() {
      let ids = this.resPermissions.map(item => item.permissionId);
      return this.permissions.filter(item => {
        return ids.indexOf(item.permissionId) == -1;
      });
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSure() {
      if (this.loading) return;
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.submit();
      });
    },
    submit() {
      let data = copyJson(this.form);

      this.$unsubscribe('add');
      this.loading = true;
      this.$subs.add = this.$hub.flow([data])
        .use('resource.add')
        .subscribe(
          (res) => {
            this.loading = false;
            this.visible = false;
            this.$message.success(this.__('message.addSuccess'));
            this.$emit('add-back', copyJson(res));
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    initData() {
      let permissionsOb = this.$hub.flow([{}])
        .use('doorlock.getThirdPermission'); 
      let resPermissionsOb = this.$hub.flow([{
        resourceId: this.id
      }])
        .use('doorlock.getResourcePermission'); 

      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flowAll([
        permissionsOb,
        resPermissionsOb
      ])
        .subscribe(
          ([permissions, resPermissions]) => {
            this.loading = false;
            this.permissions = permissions;
            this.resPermissions = resPermissions;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    removeFromResource(item) {
      this.$unsubscribe('removeFromResource');
      this.loading = true;
      this.$subs.removeFromResource = this.$hub.flow([{
        resourceId: this.id,
        permissionId: item.permissionId
      }])
        .use('doorlock.deleteResourcePermission')
        .subscribe(
          (res) => {
            this.loading = false;
            this.$message.success(this.__('message.operationSuccess'));
            this.updatePermissions();
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    addToResource(item) {
      this.$unsubscribe('addToResource');
      this.loading = true;
      this.$subs.addToResource = this.$hub.flow([{
        resourceId: this.id,
        permissionId: item.permissionId,
        permissionName: item.permissionName
      }])
        .use('doorlock.bindResourcePermission')
        .subscribe(
          (res) => {
            this.loading = false;
            this.$message.success(this.__('message.operationSuccess'));
            this.updatePermissions();
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    updatePermissions() {
      let resPermissionsOb = this.$hub.flow([{
        resourceId: this.id
      }])
        .use('doorlock.getResourcePermission'); 

      this.$unsubscribe('updatePermissions');
      this.loading = true;
      this.$subs.updatePermissions = this.$hub.flowAll([
        resPermissionsOb
      ])
        .subscribe(
          ([resPermissions]) => {
            this.loading = false;
            this.resPermissions = resPermissions;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    ready() {
      this.initData();
    }
  }
}
</script>

<style lang="scss" scoped>
.perms {
  display: flex;
  align-items: stretch;

  > li {
    flex: 1;
    width: 0;

    &:first-child {
      margin: 0 20px 0 0;
    }
  }
}

.perms-tit {
  line-height: 30px;
}
</style>
