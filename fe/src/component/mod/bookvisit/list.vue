<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="addVisit">{{__('addBookVisit')}}</el-button>
        <!-- <el-button type="info" @click="exportBookVisit">{{__('btn.export')}}</el-button> -->
      </div>

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="80px" @keyup.enter.native="searchList">
          <el-form-item :label="__('keyword')">
            <el-input v-model="search.keyWord" :placeholder="__('name') + ' / ' + __('mobileNumber')"></el-input>
          </el-form-item>

          <el-form-item :label="__('visitTime')">
            <el-date-picker
              v-model="search.visitTime"
              type="date"
              :placeholder="__('visitTime')">
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item :label="__('createTime')">
            <el-date-picker
              v-model="search.createTime"
              type="date"
              :placeholder="__('createTime')">
            </el-date-picker>
          </el-form-item> -->

          <el-form-item :label="__('spaceType')">
            <el-select v-model="search.spaceType" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option
                v-for="item in enums.spaceType"
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
              prop="userName"
              :label="__('name')"
              width="100">
            </el-table-column>
            <el-table-column
              prop="mobile"
              :label="__('mobile')"
              width="150">
            </el-table-column>
            <el-table-column
              :label="__('visitTime')"
              width="150">
              <template slot-scope="scope">
                {{scope.row.visitTime ? moment(scope.row.visitTime) : ''}}
              </template>
            </el-table-column>
            <el-table-column
              :label="__('spaceType')"
              width="150">
              <template slot-scope="scope">
                {{enums.spaceType[scope.row.spaceType]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              :label="__('address')"
              width="200">
            </el-table-column>
            <el-table-column
              :label="__('createTime')"
              width="150">
              <template slot-scope="scope">
                {{moment(scope.row.createTime)}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              min-width="100"
              :label="__('operation')">
              <template slot-scope="scope">
                <el-button @click="onDel(scope.row)" type="danger" size="mini" plain>{{__('btn.del')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div class="sma-margin-top-20 sma-text-c" v-if="list">
            <el-pagination
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="count"
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
import moment from 'moment';
import {showAddVisit} from '../../helper/bookvisit';

export default {
  name: 'mod-booking-list',
  data() {
    return {
      loading:true,

      page: 1,
      count: 20,
      total: 0,
      list: null,
      
      search: {
        keyWord: '',
        visitTime: null,
        // createTime: null,
        spaceType: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: vm.__('bookvisitListTitle')
      });
      vm.refreshMod();
    });
  },
  created() {
    this.refreshMod();
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    moment(time) {
      return moment(time).format('YYYY-MM-DD hh:mm');
    },
    refreshMod() {
      this.updateList();
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    onDel(item) {
      this.$confirm(this.__('del.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出取消成功的提示
        this.$unsubscribe('addVisit');
        this.$subs.addVisit = this.$hub.flow([{
          id: item.id
        }])
          .use('bookvisit.del')
          .subscribe(
            (res) => {
              this.$message.success(this.__('message.delSuccess'));
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      })
    },
    addVisit() {
      let self = this;
      showAddVisit({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    exportBookVisit() {
      let params = {};
      this.$unsubscribe('download');
      this.$subs.download = this.$hub.flow([params])
        .use('bookvisit.download')
        .subscribe(
          (res) => {
            //
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },
    updateList() {
      let params = {
        keyWord: this.search.keyWord.trim(),
        visitTime: this.search.visitTime ? moment(this.search.visitTime).format('YYYY-MM-DD') : '',
        // createTime: this.search.createTime ? moment(this.search.createTime).format('YYYY-MM-DD') : '',
        spaceType: this.search.spaceType,
        page: this.page,
        count: this.count
      };

      this.$unsubscribe('visitList');
      this.$subs.visitList = this.$hub.flow([params])
        .use('bookvisit.list')
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
    sizeChange(val) {
      this.count = val;
      this.updateList();
    },
    currentChange(val) {
      this.page = val;
      this.updateList();
    }
  }
}
</script>



