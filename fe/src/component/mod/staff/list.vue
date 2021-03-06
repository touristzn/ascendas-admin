<template lang="html">
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="addStaff">{{__('addStaff')}}</el-button>
      </div>

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="searchList">
          <el-form-item :label="__('keyword')">
            <el-input v-model="search.keyWord" :placeholder="__('keyword')"></el-input>
          </el-form-item>

          <el-form-item :label="__('genderEnum')">
            <el-select v-model="search.genderEnum" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option
                v-for="item in enums.genderStrict"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchList">{{__('btn.search')}}</el-button>
          </el-form-item>
        </el-form>

        <!--列表-->
        <div class="sma-table-list sma-margin-top-30">
          <el-table
            :data="list"
            border
            :fit="true"
          >

            <el-table-column
              prop="mobile"
              :label="__('mobileNumber')"
              min-width="100"
            >
            </el-table-column>

            <el-table-column
              prop="nickname"
              :label="__('nickname')"
              width="150">
            </el-table-column>

            <el-table-column
              label="角色"
              width="150">
              <template slot-scope="scope">
                <span class="sma-tag sma-tag-info" v-if="scope.row.role" @click="viewPermission(scope.row.role)">
                  {{scope.row.role.name}}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="realName"
              :label="__('realName')"
              width="150"
            >
            </el-table-column>

            <el-table-column
              prop="email"
              :label="__('email')"
              width="180"
            >
            </el-table-column>

            <el-table-column
              :label="__('genderEnum')"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.genderEnum | enumText(enums, 'gender') }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="__('operation')"
              fixed="right"
              width="240"
            >
              <template slot-scope="scope">
                <div>
                  <router-link :to="{ path: 'info/'+scope.row.id}">
                    <el-button size="mini" type="primary" plain>{{__('btn.detail')}}</el-button>
                  </router-link>

                  <el-button size="mini" plain
                    :type="scope.row.isValid == 0 ? 'success' : 'danger'"
                    @click="disabled(scope.row)"
                  >
                    {{scope.row.isValid == 0 ? __('enabled') : __('disabled')}}
                  </el-button>

                  <el-button size="mini" type="warning" plain @click="resetPassword(scope.row)">{{__('btn.resetPassword')}}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="sma-margin-top-20 sma-text-c" v-if="list.length > 0">
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
import { showAddStaff } from '../../helper/staff';
import { showResetPassWord } from '../../helper/staff';
import { showViewPermission } from '../../helper/role';
import { copyJson } from '../../../lib/utils';

/**
 * @vuedoc
 * @exports component/mod/staff/List
 */
export default {
  name: 'mod-user-list',
  data() {
    return {
      userType: 2,
      loading:false,

      page: 1,
      pageSize: 20,
      total: 0,
      keyWord:'',
      list: [],

      search:{
        keyWord:'',
        genderEnum:''
      }
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
        title: vm.__('staffListTitle')
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
    addStaff() {
      let self = this;
      showAddStaff({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    viewPermission(item) {console.log('sss',item)
      let self = this;
      showViewPermission({
        id: item.id
      }, {
        ['view-back'](data) {}
      });
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    updateList() {
      let params = {
        keyWord: this.search.keyWord,
        genderEnum: this.search.genderEnum,
        userType: this.userType,
        page: this.page,
        count: this.pageSize,
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('user.list')
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
          userType: this.userType,
          id: item.id,
          isValid: item.isValid == 0 ? 1 : 0
        }
        let data = copyJson(params);
        this.$unsubscribe('updateInfo');
        this.$subs.updateInfo = this.$hub.flow([data])
          .use('user.modify')
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
    resetPassword(item) {
      let self = this;
      showResetPassWord({
        id: item.id
      }, {
        ['list-back'](data) {}
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

