<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card">
      <div class="block-header">
        <div class="block-tit">
          产品列表：
        </div>
      </div>
      <div class="block-con sma-margin-top-20" v-loading="loading">
        <el-table
          :data="cartItems"
          max-height="500"
          border
          :fit="true"
        >
          <el-table-column
            width="50"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" class="check"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column
            :label="__('productName')"
            min-width="200"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.product">
                {{ scope.row.product.name }} / {{ scope.row.product.category | enumText(enums, 'category') }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="购买数量"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.data.quantity }}
            </template>
          </el-table-column>

          <el-table-column
            label="标准总价"
            width="150"
          >
            <template slot-scope="scope">
              <div v-loading="scope.row.loading">
                <el-alert
                  v-if="scope.row.error"
                  :title="scope.row.error"
                  type="error"
                  :closable="false"
                ></el-alert>
                <div v-if="!scope.row.error && scope.row.result">
                  {{scope.row.result.currency.sign}} 
                  {{scope.row.result.price}}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="折后总价"
            width="150"
          >
            <template slot-scope="scope">
              <div v-loading="scope.row.loading">
                <div v-if="!scope.row.error && scope.row.result">
                  {{scope.row.result.currency.sign}} 
                  {{scope.row.result.amount}}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="__('operation')"
            fixed="right"
            width="150"
          >
            <template  slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="deleteItem(scope.row)"
                plain
              >移出购物车</el-button>
              <router-link :to="{ path: '/purchase/cart/' + scope.row.cartId}">
                <el-button 
                  size="mini" 
                  type="primary"
                  plain
                >{{__('btn.edit')}}</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="block-header sma-margin-top-50">
        <div class="block-tit">
          发票信息：
        </div>
      </div>
      <div class="block-con sma-margin-top-20">
        <el-form :model="fapiao" ref="fapiaoForm" label-width="120px" class="fapiao-form">

          <el-form-item 
            label="发票类型"
            prop="type"
            :rules="[
              {required: true}
            ]"
          >
            <el-select v-model="fapiao.type">
              <el-option
                v-for="item in enums.fapiaoType"
                :key="item[0]"
                :label="item[1]" 
                :value="item[0]"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            label="公司抬头" 
            prop="title" 
            v-if="fapiao.type != 'NONE'"
            :rules="[
              {required: fapiao.type != 'NONE', message: __('required')}
            ]"
          >
            <el-input 
              type="textarea" 
              v-model="fapiao.title" 
              placeholder="公司抬头"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="纳税人识别号" 
            prop="identificationNo" 
            v-if="fapiao.type != 'NONE'"
            :rules="[
              {required: fapiao.type != 'NONE', message: __('required')}
            ]"
          >
            <el-input 
              type="textarea" 
              v-model="fapiao.identificationNo" 
              placeholder="纳税人识别号"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="电话" 
            prop="mobile" 
            v-if="fapiao.type == 'VAT'"
            :rules="[
              {required: fapiao.type == 'VAT', message: __('required')}
            ]"
          >
            <el-input 
              type="textarea" 
              v-model="fapiao.mobile" 
              placeholder="电话"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="地址" 
            prop="address" 
            v-if="fapiao.type == 'VAT'"
            :rules="[
              {required: fapiao.type == 'VAT', message: __('required')}
            ]"
          >
            <el-input 
              type="textarea" 
              v-model="fapiao.address" 
              placeholder="地址"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="开户银行" 
            prop="bankName" 
            v-if="fapiao.type == 'VAT'"
            :rules="[
              {required: fapiao.type == 'VAT', message: __('required')}
            ]"
          >
            <el-input 
              type="textarea" 
              v-model="fapiao.bankName" 
              placeholder="开户银行"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="开户账号" 
            prop="bankAccount" 
            v-if="fapiao.type == 'VAT'"
            :rules="[
              {required: fapiao.type == 'VAT', message: __('required')}
            ]"
          >
            <el-input 
              type="textarea" 
              v-model="fapiao.bankAccount" 
              placeholder="开户账号"
            ></el-input>
          </el-form-item>

        </el-form>
      </div>

      <div class="block-con sma-margin-top-50">
        <el-button type="primary" @click="careteOrder(false)">提交订单</el-button>
        <el-button @click="careteOrder(true)">预存订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {showAddResource} from '../../helper/resource';

/**
 * @vuedoc
 * @exports component/mod/user/List
 */
export default {
  name: 'mod-product-cart',
  data() {
    return {
      loading: false,
      cartItems: [],

      fapiao: {
        type: 'NONE',
        address: '',
        bankAccount: '',
        bankName: '',
        identificationNo: '',
        mobile: '',
        title: '',
      }
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    },
    errorMessage() {
      let selectedItems = this.cartItems.filter(item=>item.checked);

      if (!selectedItems.length) {
        return '没有选中产品';
      }

      if (selectedItems.length > 1) {
        return '一次只能提交一个产品';
      }

      return '';
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '购物车'
      });
      vm.refreshMod();
    });
  },
  created() {
      
  },
  methods: {
    refreshMod() {
      this.initCartData();
    },
    initCartData() {
      let items = this.$state.cart.items;
      let cartItems = Object.keys(items).map(id => {
        return {
          cartId: id,
          loading: false,
          error: '',
          result: null,
          checked: false,
          product: null,
          productId: items[id].productId,
          data: items[id].data,
        }
      });

      if (cartItems.length == 1) {
        cartItems[0].checked = true;
      }

      this.cartItems = cartItems;
      this.updateProductInfo();
    },
    updateProductInfo() {
      let obList = [];
      this.cartItems.forEach(item => {
        let ob = this.$hub.flow([{ id: item.productId }])
          .use('product.info');
        obList.push(ob);
        this.calcPriceItem(item);
      });

      if (!obList.length) return;

      this.$unsubscribe('products');
      this.loading = true;
      this.$subs.products = this.$hub.flowAll(obList)
        .subscribe(
          (resList) => {
            this.loading = false;
            resList.forEach((res, index) => {
              this.cartItems[index].product = res;
            });
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    calcPriceItem(item) {
      let cartId = item.cartId;
      this.$unsubscribe(`calc-${cartId}`);
      item.loading = true;
      item.error = null;
      this.$subs[`calc-${cartId}`] = this.$hub.flow([item.data])
        .use('order.calculatePrice')
        .subscribe(
          (res) => {
            item.loading = false;
            item.result = res;
          },
          (error) => {
            item.loading = false;
            item.error = error.message;
          }
        );
    },
    careteOrder(isPreOrder) {
      if (this.errorMessage) {
        this.$message.error(this.errorMessage);
        return;
      }

      this.checkFapiao(() => {
        let postData = [];
        let items = [];

        this.cartItems.forEach(function(item, index) {
          if (!item.checked) return;
          items.push(item);
          postData.push(Object.assign({}, item.data, {
            orderType: isPreOrder ? 'PREORDER' : 'NORMAL',
            fapiao: this.fapiao
          }));
        }.bind(this));
 
        this.$unsubscribe('submitOrder');
        this.loading = true;
        console.log(JSON.stringify(postData[0]))
        this.$subs.submitOrder = this.$hub.flow([postData[0]])
          .use('order.purchase')
          .subscribe(
            (res) => {
              this.loading = false;
              items.forEach(item => {
                let idx = this.cartItems.indexOf(item);
                this.cartItems.splice(idx, 1);
                this.$store.commit('cart.removeCartItem', item.cartId);
              });
              let detailId = res.id;
              this.fapiao = {
                type: 'NONE',
                address: '',
                bankAccount: '',
                bankName: '',
                identificationNo: '',
                mobile: '',
                title: '',
              };
              this.$router.push(`/order/detail/${detailId}`);
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    },
    checkFapiao(callback) {
      this.$refs['fapiaoForm'].validate((valid) => {
        if (valid) {
          callback && callback();
        } else {
          this.$message.error('请检查发票输入')
          return false;
        }
      });
    },
    deleteItem(item) {
      let idx = this.cartItems.indexOf(item);
      this.cartItems.splice(idx, 1);
      this.$store.commit('cart.removeCartItem', item.cartId);
    }
  },
  watch: {
    //
  }
}
</script>

<style lang="scss" scoped>
.check {
  margin: 0;
}
.block-tit {
  line-height: 30px;
  font-size: 16px;
}
</style>

