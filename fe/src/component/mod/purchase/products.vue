<template lang="html">
  <div class="mod sma-padding-lg" v-loading="loading">
    <div class="sma-box-card">

      <div class="header">
        <el-badge :value="cartProductCount + ''">
          <router-link :to="{ path: '/purchase/cart'}">
            <el-button size="small" type="success">购物车</el-button>
          </router-link>
        </el-badge>
      </div>

      <el-form :inline="true" size="mini" label-width="100px" @submit.native.prevent="searchList">
        <el-form-item :label="__('productName') + '：'">
          <el-input v-model.trim="search.name"  :placeholder="__('productName')"></el-input>
        </el-form-item>

        <el-form-item :label="__('productCategory') + '：'">
          <el-select  :placeholder="__('all')" v-model="search.category">
            <el-option value="">所有</el-option>
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
                <el-tag class="sma-margin-3" size="mini" type="info" v-for="item in scope.row.resources.slice(0,2)" :key="item.id">
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
              {{ (scope.row.status || '无') | enumText(enums, 'productStatus') }}
            </template>
          </el-table-column>

          <el-table-column
            :label="__('operation')"
            fixed="right"
            min-width="150"
          >
            <template  slot-scope="scope">
              <router-link :to="{ path: '/purchase/info/'+scope.row.id}">
                <el-button 
                  size="mini" 
                  type="primary"
                  plain
                >加入购物车</el-button>
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

/**
 * @vuedoc
 * @exports component/mod/user/List
 */
export default {
  name: 'mod-purchase-products',
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
    },
    cartProductCount() {
      return Object.keys(this.$state.cart.items).length;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '订购-产品列表'
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
        viewType: 'PURCHASE'
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

<style lang="css">
.header {
  border-bottom: 1px solid #ddd;
  padding: 0 0 10px 0;
  margin-bottom: 20px;
  text-align: right;
}
</style>
