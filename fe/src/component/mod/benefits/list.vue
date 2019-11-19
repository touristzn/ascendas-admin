<template lang="html">
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="addBenefits">{{__('addBenefits')}}</el-button>
      </div>

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="searchList">
          <el-form-item :label="__('keyword')">
            <el-input v-model="search.keyword" :placeholder="__('titleTxt') + ' / ' + __('partner')"></el-input>
          </el-form-item>

          <el-form-item :label="__('type')">
            <el-select v-model="search.type" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option
                v-for="item in enums.benefitType"
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
        <div class="sma-table-list sma-margin-top-20">
          <el-table
            :data="list"
            border
            :fit="true"
          >
            <el-table-column
              fixed
              prop="benefitsHeadline"
              :label="__('titleTxt')"
              width="200">
            </el-table-column>
            <el-table-column
              prop="companyName"
              :label="__('partner')"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="type"
              :label="__('type')"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="category.name"
              :label="__('category')"
              width="100"
            >
            </el-table-column>
            <el-table-column
              :label="__('createdAt')"
              width="150"
            >
              <template slot-scope="scope">
                {{formatTime(scope.row.createdAt)}}
              </template>
            </el-table-column>
            <el-table-column
              :label="__('updatedAt')"
              width="150"
            >
              <template slot-scope="scope">
                {{formatTime(scope.row.updatedAt)}}
              </template>
            </el-table-column>
            <el-table-column
              :label="__('likeNum')"
              width="100"
            >
              <template slot-scope="scope">
                <span @click="showLikeList(scope.row)">
                  <el-tag class="sma-min-w50 sma-text-c" size="mini" type="info">
                    {{scope.row.likeNum}}
                  </el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              :label="__('status')"
              width="100"
            >
            </el-table-column>
            <el-table-column
              :label="__('operation')"
              fixed="right"
              width="200"
            >
              <template slot-scope="scope">
                <router-link :to="{ path: 'detail/'+scope.row.id}">
                  <el-button size="mini" type="primary" plain>{{__('btn.detail')}}</el-button>
                </router-link>

                <el-button size="mini" plain
                  :type="scope.row.status == 'NEW' || scope.row.status == 'DISABLE' ? 'success' : 'danger'"
                  @click="disabled(scope.row)"
                >
                  {{scope.row.status == 'NEW' || scope.row.status == 'DISABLE' ? __('btn.publish') : __('btn.soldOut')}}
                </el-button>

                <el-button type="danger" size="mini" plain @click="onDel(scope.row)">{{__('btn.del')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="sma-margin-top-20 sma-text-c" v-if="list">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
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
import {showAddBenefits, showLikeBenefits} from '../../helper/benefits';

export default {
  name: 'mod-userManage-list',
  data() {
    return {
      loading:true,
      page: 1,
      count: 20,
      total: 0,
      list: null,
      search:{
        keyword:'',
        type:'',
        categoryId: null
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
        title: vm.__('benefitsList')
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
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD hh:mm');
    },
    addBenefits() {
      let self = this;
      showAddBenefits({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    showLikeList(item) {
      showLikeBenefits({
        id: item.id
      }, {
        ['add-back'](data) {}
      });
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
          status: item.status == 'NEW' ? 'PUBLISHED' : item.status == 'PUBLISHED' ? 'DISABLE' : 'PUBLISHED'
        }
        this.$unsubscribe('changeStatus');
        this.$subs.changeStatus = this.$hub.flow([params])
          .use('benefits.changeStatus')
          .subscribe(
            (res) => {
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      });
    },
    onDel(item) {
      this.$confirm(this.__('del.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出成功的提示
        let params = {
          id: item.id
        }
        this.$unsubscribe('del');
        this.$subs.del = this.$hub.flow([params])
          .use('benefits.del')
          .subscribe(
            (res) => {
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      });
    },
    updateList() {
      let params = {
        keyword: this.search.keyword,
        type:this.search.type,
        page: this.page,
        count: this.count,
      };
      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('benefits.list')
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
    searchList() {
      this.page = 1;
      this.updateList();
    },
    handleSizeChange(val) {
      this.count = val;
      this.updateList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateList();
    }
  }
}
</script>

