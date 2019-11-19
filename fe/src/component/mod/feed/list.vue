<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" @keyup.enter.native="searchList" label-width="100px" >
          <el-form-item :label="__('category')">
            <el-select v-model="search.category" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option
                v-for="item in enums.feedCategory"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="__('status')">
            <el-select v-model="search.status" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option
                v-for="item in enums.feedStatus"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="__('keyword')">
            <el-input v-model="search.keyword" :placeholder="__('keyword')" ></el-input>
          </el-form-item>

          <el-form-item :label="__('startTime')">
            <el-date-picker
              v-model="search.begin"
              type="date"
              :placeholder="__('startTime')">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="__('endTime')">
            <el-date-picker
              v-model="search.end"
              type="date"
              :placeholder="__('endTime')">
            </el-date-picker>
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
              prop="content"
              :label="__('introduce')"
              min-width="300">
            </el-table-column>
            <el-table-column
              prop="likeNum"
              :label="__('likeNum')"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="commentNum"
              :label="__('commentNum')"
              min-width="150">
            </el-table-column>
            <el-table-column
              prop="poster"
              :label="__('utterer')"
              min-width="200">
            </el-table-column>
            <el-table-column
              :label="__('category')"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.category| enumText(enums, 'feedCategory')}}
              </template>
            </el-table-column>
            <el-table-column
              :label="__('status')"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.status| enumText(enums, 'feedStatus')}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="__('operation')"
              width="150">
              <template slot-scope="scope">
                <router-link :to="{ path: 'detail/'+scope.row.id}" >
                  <el-button type="primary" size="mini" plain>{{__('btn.detail')}}</el-button>
                </router-link>
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
export default {
  name: 'mod-feed-list',
  data() {
    return {
      loading: true,
      total: 0,
      page: 1,
      count: 20, 
      list: null,
      search:{
        keyword: '',
        category: '',
        status: '',
        begin: '',
        end: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: vm.__('feedListTitle')
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
    
  },
  methods: {
    refreshMod() {
      this.updateList();
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    updateList() {
      let params = {
        page: this.page,
        count: this.count,
        keyword: this.search.keyword.trim(),
        category: this.search.category,
        status:this.search.status,
        begin:new Date(this.search.begin).getTime()||'',
        end:new Date(this.search.end).getTime()||'' 
      };

      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('feed.list')
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



