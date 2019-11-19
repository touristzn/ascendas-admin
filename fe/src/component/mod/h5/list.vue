<template lang="html">
  <div class="mod sma-padding-lg">
    <div class="sma-box-card">

      <div class="header">
        <el-button size="small" type="primary" @click="addH5">添加页面</el-button>
      </div>

      <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="searchList">
        <el-form-item label="页面类型:">
          <el-input v-model="search.type" placeholder="页面类型"></el-input>
        </el-form-item>
        <el-form-item label="页面简称:">
          <el-input v-model="search.shortName" placeholder="页面简称"></el-input>
        </el-form-item>
        <el-form-item label="页面名称:">
          <el-input v-model="search.name" placeholder="页面名称"></el-input>
        </el-form-item>
        <el-form-item label="页面状态:">
          <el-select  :placeholder="__('all')" v-model="search.status">
            <el-option value="">所有</el-option>
            <el-option 
              :label="item[1]" 
              :value="item[0]" 
              v-for="item in enums.guideStatus" 
              :key="item[0]"
            ></el-option>
          </el-select>
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
            prop="type"
            :label=__('type')
            min-with="150">
          </el-table-column>

          <el-table-column
            prop="shortName"
            :label=__('shortName')
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="name"
            :label=__('theName')
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="status"
            :label="__('status')"
            min-width="150">
            <template slot-scope="scope">
              {{scope.row.status | enumText(enums, 'guideStatus')}}
            </template>
          </el-table-column>

          <el-table-column
            :label="__('operation')"
            fixed="right"
            min-width="200"
          >
            <template  slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="editItem(scope.row, scope.$index)" 
              >编辑</el-button>
              <el-button
                size="mini"
                :type="scope.row.status == 'ENABLE' ? 'danger' : 'primary'"
                @click="changeStatus(scope.row, scope.$index)"
              >
                {{ scope.row.status == 'ENABLE' ? __('disabled') : __('enabled') }}
              </el-button>
              <router-link :to="{ path: '/h5/content/'+scope.row.id}">
                <el-button 
                  size="mini" 
                  type="primary" plain
                >编辑内容</el-button>
              </router-link>
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
import {showAddH5, showEditH5} from '../../helper/h5';

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
        shortName: '',
        type: '',
        status: ''
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
        title: 'H5页面列表'
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
    addH5() {
      let self = this;
      showAddH5({}, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    editItem(item, index) {
      let self = this;
      showEditH5({ id: item.id }, {
        ['edit-back'](data) {
          self.updateList();
        }
      });
    },
    changeStatus(item, index) {
      let status = item.status == 'ENABLE' ? 'DISABLE' : 'ENABLE';

      this.$unsubscribe(`changeStatus`);
      this.loading = true;
      this.$subs[`changeStatus`] = this.$hub.flow([{
        id: item.id,
        status: status
      }])
        .use('guide.changeStatus')
        .subscribe(
          (res) => {
            this.loading = false;
            this.$message.success(this.__('message.updateSuccess'));
            this.updateList();
          },
          (err) => {
            this.$message.error(err.message);
            this.loading = false;
          }
        );
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
        name: this.search.name,
        shortName: this.search.shortName,
        type: this.search.type,
        status: this.search.status,
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('guide.list')
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
