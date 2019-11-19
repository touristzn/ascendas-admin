<template lang="html">
  <div class="mod sma-padding-lg" v-loading="loading" :class="{'is-loading': loading}">
    <div class="sma-box-card">

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="searchList">
          <el-form-item :label="__('orderNumber')">
            <el-input v-model="search.orderNo"  placeholder="订单号"></el-input>
          </el-form-item>

          <el-form-item :label="__('keyword')">
            <el-input v-model="search.keyWord" :placeholder="__('username') + ' / ' + __('companyName')"></el-input>
          </el-form-item>

          <el-form-item :label="__('productName')">
            <el-input v-model="search.productName" :placeholder="__('productName')"></el-input>
          </el-form-item>  

          <el-form-item label="订单类型：">
            <el-select  :placeholder="__('all')" v-model="search.orderType">
              <el-option value="">{{__('all')}}</el-option>
              <el-option value="NORMAL" label="普通订单"></el-option>
              <el-option value="PREORDER" label="预存订单"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="__('productCategory') + '：'">
            <el-select  :placeholder="__('all')" v-model="search.productCategory">
              <el-option value="">{{__('all')}}</el-option>
              <el-option 
                :label="item[1]" 
                :value="item[0]" 
                v-for="item in enums.category" 
                :key="item[0]"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单状态">
            <el-select :placeholder="__('all')" v-model="search.orderStatusFilter">
              <el-option value="">{{__('all')}}</el-option>
              <el-option 
                :label="item[1]" 
                :value="item[0]" 
                v-for="item in enums.orderStatus" 
                :key="item[0]"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="制单人">
            <el-input v-model="search.operator"  placeholder="制单人"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="searchList" type="primary">{{__('btn.search')}}</el-button>
          </el-form-item>
        </el-form>

        <div class="sma-margin-top-30">
          <order-list 
            :data="list"
            @update-list="updateList"
          ></order-list>
        </div>

        <div class="sma-margin-top-20 sma-text-c" v-if="list.length > 0">
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
import OrderList from '../../com/order/list';

/**
 * @vuedoc
 * @exports component/mod/user/List
 */
export default {
  name: 'mod-order-list',
  components: {
    OrderList
  },
  props: {
    type: {
      type: String,
      default: 'membership'
    }
  },
  data() {
    return {
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      list: [],
      
      search: {
        orderStatusFilter: '',
        orderType: 'NORMAL',
        orderNo: '',
        keyWord: '',
        productName: '',
        productCategory: '',
        operator: ''
      }
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  created() {
    
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setTitle();
      vm.refreshMod();  
    });
  },
  methods: {
    setTitle() {
      let types = this.enums.orderGroup;
      let title = '订单列表';

      types.forEach(item => {
        if (item[0] == this.type.toUpperCase()) {
          title = item[1];
        }
      });

      this.$root.setMeta({
        path: this.$route.path, 
        title: title
      });
    },
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
        productGroup: this.type.toUpperCase(),
        orderNo: this.search.orderNo,
        orderType: this.search.orderType,
        orderStatusFilter: this.search.orderStatusFilter,
        keyWord: this.search.keyWord,
        productName: this.search.productName,
        productCategory: this.search.productCategory,
        operator: this.search.operator
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('order.list')
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
