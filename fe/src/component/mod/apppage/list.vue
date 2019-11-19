<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" size="small" @click="addApp()">添加</el-button>
      </div>
      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @keyup.enter.native="searchList">
          <el-form-item label="客户端类型">
            <el-select v-model="search.clientType" :placeholder="__('select')" >
              <el-option
                v-for="item in enums.clientType"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键字">
            <el-input v-model="search.keyword" :placeholder="__('keyword')" ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="searchList" type="primary">{{__('btn.search')}}</el-button>
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
              prop="name"
              :label="__('theName')"
              min-width="300">
            </el-table-column>
            <el-table-column
              prop="description"
              :label="__('introduce')"
              min-width="300">
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="__('operation')">
              <template slot-scope="scope">
                <router-link :to="{ path: 'detail/'+scope.row.id}">
                <el-button type="primary" size="mini" plain>{{__('btn.detail')}}</el-button>
                </router-link>
                <el-button type="danger" size="mini" plain>{{__('btn.del')}}</el-button>
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
import {showAddApppage} from '../../helper/apppage';

export default {
  name: 'mod-apppage-list',
  data() {
    return {
      loading: true,
      total: 0,
      page: 1,
      count: 20, 
      list: null,
      search:{
        clientType: '',
        keyword: '',

      },
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: 'App页面配置'
      });
    });
  },
  computed:{
    enums() {
      return this.$state.enums.all;
    }
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
    addApp() {
      let self = this;
      showAddApppage({
        }, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    updateList() {
      let params = {
        page: this.page,
        count: this.count,
        keyword: this.search.keyword.trim(),
        clientType: this.search.clientType,
      };

      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('apppage.list')
        .subscribe(
          (res) => {
            this.list = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
            this.$message.error(err.msg);
            this.loading = false;
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



