<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="addCompany">{{__('addCompany')}}</el-button>
      </div>

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="searchList">
          <el-form-item :label="__('company')">
            <el-input v-model="search.companyName" :placeholder="__('companyName') + ' / ' + __('registeredName.company')"></el-input>
          </el-form-item>

          <el-form-item :label="__('linkman')">
            <el-input v-model="search.contactInfo" :placeholder="__('linkman') + ' / ' + __('mobileNumber')"></el-input>
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
              prop="shortName"
              :label="__('shortName.company')"
              fixed
              width="150">
            </el-table-column>
            <el-table-column
              prop="registeredName"
              :label="__('registeredName.company')"
              width="200">
            </el-table-column>
            <el-table-column
              prop="address"
              :label="__('address')"
              width="200">
            </el-table-column>
            <el-table-column
              prop="industry"
              :label="__('industry')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="contact.nickname"
              :label="__('linkman')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="contact.mobile"
              :label="__('mobile')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="personCount"
              :label="__('personCount')"
              width="100">
            </el-table-column>
            <el-table-column
              prop="email"
              :label="__('email')"
              width="150">
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="__('operation')"
              width="150">
              <template slot-scope="scope">
                <el-button size="mini" plain
                  :type="scope.row.isValid == 0 ? 'success' : 'danger'"
                  @click="disabled(scope.row)"
                >
                  {{scope.row.isValid == 0 ? __('enabled') : __('disabled')}}
                </el-button>
                  
                <router-link :to="'/company/detail/'+ scope.row.id">
                  <el-button type="primary" size="mini" plain>{{__('btn.detail')}}</el-button>
                </router-link>

                <el-button size="mini" plain @click="roomUsageLog(scope.row)">{{__('roomUsageLog')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
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
import {showAddCompany} from '../../helper/company';
import {showBookingList} from '../../helper/meetingrooms'

export default {
  name: 'mod-company-list',
  data() {
    return {
      loading:true,
      page: 1,
      pageSize: 20,
      total: 0,
      list: null,
      search: {
        companyName: '',
        contactInfo: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: vm.__('companyListTitle')
      });
      vm.refreshMod();
    });
  },
  created() {
    this.refreshMod();
  },
  methods: {
    refreshMod() {
      this.updateList();
    },
    searchList() {
      this.page = 1;
      this.updateList();
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
        this.$unsubscribe('updateInfo');
        this.$subs.updateInfo = this.$hub.flow([params])
          .use('company.update')
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
    addCompany() {
      let self = this;
      showAddCompany({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    updateList() {
      let params = {
        companyName: this.search.companyName,
        contactInfo: this.search.contactInfo,
        page: this.page,
        count: this.pageSize
      };

      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('company.list')
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
    roomUsageLog(item) {
      let self = this;
      showBookingList({
        companyId: item.id
      }, {
        ['list-back'](data) {
          self.updateList();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.updateList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateList();
    }
  }
}
</script>



