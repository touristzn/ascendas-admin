<template lang="html">
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="addProduct">添加产品</el-button>
      </div>

      <div class="content sma-margin-top-20">
        <el-form class="sma-form-search" :inline="true" size="mini" label-width="100px" @submit.native.prevent="searchList">
          <el-form-item :label="__('productName') + '：'">
            <el-input v-model.trim="search.name"  :placeholder="__('productName')"></el-input>
          </el-form-item>

          <el-form-item :label="__('productCategory') + '：'">
            <el-select  :placeholder="__('all')" v-model="search.category">
              <el-option value="">{{__('all')}}</el-option>
              <el-option 
                :label="item[1]" 
                :value="item[0]" 
                v-for="item in enums.category" 
                :key="item[0]"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchList">{{__('btn.search')}}</el-button>
          </el-form-item>
        </el-form>
    
        <div class="sma-table-list sma-margin-top-20">
          <el-table
            :data="list"
            border
            :fit="true"
          >
            <el-table-column
              :label="__('productName')"
              min-width="150"
            >
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>

            <el-table-column
              :label="__('productCategory')"
              min-width="200"
            >
              <template slot-scope="scope">
                {{scope.row.category | enumText(enums, 'category')}}
              </template>
            </el-table-column>

            <el-table-column
              label="资源"
              min-width="200"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.resources">
                  <el-tag 
                    class="sma-margin-3" 
                    size="mini" 
                    type="info" 
                    v-for="item in scope.row.resources.slice(0,2)" :key="item.id"
                  >
                    {{item.name}}
                  </el-tag>
                  <router-link 
                    v-if="scope.row.resources.length > 2"
                    tag="span" 
                    :to="{ path: '/product/detail/'+scope.row.id}"
                  >
                    <el-button size="mini" type="text">更多</el-button>
                  </router-link>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="支持价格"
              min-width="200"
            >
              <template slot-scope="scope">
                <el-tag class="sma-margin-3" size="mini" type="info" v-for="(price, index) in scope.row.prices" :key="index">
                  <span>{{price.currency.sign}} {{price.price}}</span>
                  <span>/</span>
                  <span>{{price.saleUnit | enumText(enums, 'saleUnit')}}</span>
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              label="组合数量"
              min-width="150"
            >
              <template slot-scope="scope">
                {{scope.row.quantity}}
              </template>
            </el-table-column>

            <el-table-column
              label="发布状态"
              min-width="200"
              :style="{'white-space': 'nowrap'}"
            >
              <template slot-scope="scope">
                <el-dropdown size="small" split-button type="info" trigger="click" @command="updateStatus">
                  {{ (scope.row.status || '无') | enumText(enums, 'productStatus') }}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in enums.productStatus"
                      :command="{ status: item[0], item: scope.row }"
                      :key="item[0]"
                    >{{item[1]}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                
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
                  type="danger"
                  @click="deleteItem(scope.row, scope.$index)"
                  plain
                >{{__('btn.del')}}</el-button>
                <router-link :to="{ path: '/product/detail/'+scope.row.id}">
                  <el-button 
                    size="mini" 
                    type="primary"
                    plain
                  >{{__('btn.detail')}}</el-button>
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
  </div>
</template>

<script>
import {showAddProduct} from '../../helper/product';

/**
 * @vuedoc
 * @exports component/mod/user/List
 */
export default {
  name: 'mod-product-list',
  data() {
    return {
      loading: false,

      page: 1,
      pageSize: 20,
      total: 0,
      list: null,
      
      search: {
        name: '',
        category: ''
      }
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '产品列表'
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
    updateStatus({status, item}) {
      this.$unsubscribe(`status-${item.id}`);
      this.$subs[`status-${item.id}`] = this.$hub.flow([{
        id: item.id,
        status: status
      }])
        .use('product.changeStatus')
        .subscribe(
          (res) => {
            this.$message.success(this.__('message.editSuccess'));
            item.status = status;
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },
    addProduct() {
      let self = this;
      showAddProduct({}, {
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
          .use('product.del')
          .subscribe(
            (res) => {
              this.loading = false;
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
              this.loading = false;
            }
          );
      });
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
    },
    updateList() {
      let params = {
        page: this.page,
        count: this.pageSize,
        name: this.search.name,
        category: this.search.category,
        viewType: 'NORMAL'
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('product.list')
        .subscribe(
          (res) => {
            this.loading = false;
            this.list = res.rows;
            this.total = res.total;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>

