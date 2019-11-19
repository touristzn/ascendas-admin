<template lang="html">
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" size="small" @click="addRole">添加角色</el-button>
      </div>

      <div class="content sma-margin-top-30">
        <div class="sma-table-list">
          <el-table
            :data="list"
            border
          >
            <el-table-column
              prop="name"
              label="角色名称"
              min-width="200">
            </el-table-column>

            <el-table-column
              label="状态"
              width="180"
            >
              <template slot-scope="scope">
                {{scope.row.isValid == 0 ? '已禁用' : '已启用'}}
              </template>
            </el-table-column>

            <el-table-column
              :label="__('operation')"
              fixed="right"
              width="230"
            >
              <template slot-scope="scope">
                <div>
                  <el-button size="mini" plain
                    :type="scope.row.isValid == 0 ? 'success' : 'danger'"
                    @click="disabled(scope.row)"
                  >
                    {{scope.row.isValid == 0 ? __('enabled') : __('disabled')}}
                  </el-button>

                  <el-button size="mini" type="primary" plain @click="editPermission(scope.row)">权限</el-button>
                  <el-button size="mini" type="danger" plain @click="delPermission(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="sma-margin-top-20 sma-text-c" v-if="list">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">  
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {showAddRole, showEditPermission} from '../../helper/role';
import {copyJson} from '../../../lib/utils';

export default {
  name: 'mod-user-list',
  data() {
    return {
      loading:false,
      page: 1,
      pageSize: 20,
      total: 0,
      list: null
    }
  },
  computed:{
    enums() {
      return this.$state.enums.all;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '角色列表'
      });
      vm.refreshMod();
    });
  },
  mounted() {
    this.refreshMod();
  },
  methods: {
    refreshMod() {
      this.updateList();
    },
    addRole() {
      let self = this;
      showAddRole({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    editPermission(item) {
      let self = this;
      showEditPermission({
        id: item.id,
        roleName: item.name
      }, {
        ['edit-back'](data) {
          self.updateList()
        }
      });
    },
    delPermission(item) {
      this.$confirm(this.__('del.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出成功的提示
        let params = {
          id: item.id
        }
        let data = copyJson(params);
        this.$unsubscribe('updateInfo');
        this.$subs.updateInfo = this.$hub.flow([data])
          .use('role.del')
          .subscribe(
            (res) => {
              this.updateList();
              this.$message.success(this.__('message.operationSuccess'));
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      })
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    updateList() {
      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([{}])
        .use('role.list')
        .subscribe(
          (res) => {
            this.list = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    disabled(item) {
      this.$confirm(this.__('edit.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出成功的提示
        let params = {
          id: item.id,
          isValid: item.isValid == 0 ? 1 : 0
        }
        let data = copyJson(params);
        this.$unsubscribe('updateInfo');
        this.$subs.updateInfo = this.$hub.flow([data])
          .use('role.update')
          .subscribe(
            (res) => {
              this.updateList();
              this.$message.success(this.__('message.editSuccess'));
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.updateList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateList();
    },
  }
}
</script>

