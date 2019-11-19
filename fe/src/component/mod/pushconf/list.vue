<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" size="small" @click="addPushconf()">添加推送用例</el-button>
      </div>

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @keyup.enter.native="searchList">
          <el-form-item label="推送类型">
            <el-select v-model="search.skipCase" :placeholder="__('select')">
              <el-option
                v-for="item in enums.skipCase"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="search.status" :placeholder="__('select')">
              <el-option
                v-for="item in enums.caseStatus"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键字">
            <el-input v-model="search.keyword" :placeholder="__('keyword')" ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button @click="searchList" type="primary">查询</el-button>
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
              label="名称"
              min-width="200">
            </el-table-column>

            <el-table-column
              label="类型"
              min-width="300">
              <template slot-scope="scope">
                {{ scope.row.skipCase | enumText(enums, 'skipCase') }}
              </template>
            </el-table-column>

            <el-table-column
              prop="description"
              label="描述"
              min-width="300">
            </el-table-column>

            <el-table-column
              label="状态"
              width="100">
              <template slot-scope="scope">
                {{scope.row.status| enumText(enums, 'caseStatus')}}
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              min-width="150">
              <template slot-scope="scope">
                <router-link :to="{ path: 'detail/'+scope.row.id}">
                <el-button type="primary" size="mini" plain >详情</el-button>
                </router-link>
                <el-button type="danger" size="mini" plain>删除</el-button>
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
import {showAddpushconf} from '../../helper/pushconf';

export default {
  name: 'mod-pushconf-list',
  data() {
    return {
      loading: true,
      total: 0,
      page: 1,
      count: 20, 
      list: null,
      search:{
        keyword:'',
        skipCase:'',
        status:'',
      },
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '推送用例配置'
      });
      vm.refreshMod();
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
    addPushconf() {
      let self = this;
      showAddpushconf({
        }, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    updateList() {
      let params = {
        keyword: this.search.keyword,
        skipCase: this.search.skipCase,
        status:this.search.status
      };

      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('pushconf.list')
        .subscribe(
          (res) => {
            this.list = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.msg);
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



