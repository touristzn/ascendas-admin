<template lang="html">
  <div class="mod sma-padding-lg">
    <div class="sma-box-card">

      <div class="header">
        <el-button type="primary" @click="addResource">添加资源</el-button>
      </div>

      <el-form  :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="searchList">
        <el-form-item :label="__('keyword')">
          <el-input v-model="search.name" placeholder="资源名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchList">{{__('btn.search')}}</el-button>
        </el-form-item>
      </el-form>
  
      <div class="sma-table-list sma-margin-top-20" v-loading="loading">
        <el-table
          :data="list"
          border
          :fit="true"
        >
          <el-table-column
            prop="name"
            label="名称"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="description"
            label="描述"
            min-width="150">
          </el-table-column>
          
          <el-table-column
            prop="floor"
            label="楼层"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="value"
            label="数量"
            min-width="150"
          >
          </el-table-column>
          
          <el-table-column
            label="在app端是否显示"
            min-width="150"
          >
            <template slot-scope="item">
              {{item.row.displayInApp | enumText(enums, 'yesOrNo')}}
            </template>
          </el-table-column>

          <el-table-column
            :label="__('operation')"
            fixed="right"
            min-width="150"
          >
            <template  slot-scope="scope">
              <el-button
                size="mini"
                type="danger" plain
                @click="deleteItem(scope.row, scope.$index)"
              >{{__('btn.del')}}</el-button>
              <router-link :to="{ path: '/resource/detail/'+scope.row.id}">
                <el-button 
                  size="mini" 
                  type="primary" plain
                >{{__('btn.detail')}}</el-button>
              </router-link>
              <el-button 
                size="mini" 
                type="info" plain
                @click="doorLockInfo(scope.row)"
              >门禁详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="sma-margin-top-20 sma-text-c" v-if="list">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">  
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import {
  showAddResource, 
  showDoorlock
} from '../../helper/resource';

/**
 * @vuedoc
 * @exports component/mod/user/List
 */
export default {
  name: 'mod-resource-list',
  data() {
    return {
      loading:false,

      page: 1,
      pageSize: 20,
      total: 0,
      list: null,
      
      search: {
        name:'',
      },

      hubList: []
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '资源列表'
      });
    });
  },
  created() {
    this.refreshMod();  
  },
  methods: {
    refreshMod() {
      this.updateList();
    },
    addResource() {
      let self = this;
      showAddResource({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    deleteItem(item, index) {
      this.$confirm(this.__('del.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        this.$unsubscribe(`delete-${item.id}`);
        this.loading = true;
        this.$subs[`delete-${item.id}`] = this.$hub.flow([{
          id: item.id
        }])
          .use('resource.del')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.delSuccess'));
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
              this.loading = false;
            }
          );
      }).catch(() => {});
    },
    sizeChange(val) {
      this.pageSize = val;
      this.updateList();
    },
    currentChange(val) {
      this.page = val;
      this.updateList();
    },
    searchList() {
      this.page = 1;
      this.updateList();
      return false;
    },
    updateList() {
      let params = {
        page: this.page,
        count: this.pageSize,
        name: this.search.name.trim()
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('resource.list')
        .subscribe(
          (res) => {
            this.list = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
            this.$message.error(err.message);
            this.loading = false;
          }
        );
    },
    doorLockInfo(item) {
      showDoorlock({ id: item.id } ,{});
    }
  }
}
</script>

<style lang="css">
.header {
  border-bottom: 1px solid #ddd;
  padding: 0 0 10px 0;
  margin-bottom: 20px;
  text-align: right;
}
</style>
