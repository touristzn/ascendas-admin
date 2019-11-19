<template>
  <div class="sma-order-list">
    <dl>
      <dt>
        <ul>
          <li>
            <em>订单号：</em>
            <span>{{order.orderNo}}</span>
          </li>
          <li>
            <em>下单时间：</em>
            <span>{{ order.createTime }}</span>
          </li>
          <li>
            <em>订单状态：</em>
            <span>{{ order.orderStatus }}</span>
          </li>
          <li>
            <em>下单人：</em>
            <span v-if="order.orderer">{{ order.orderer.mobile }}</span>
          </li>
          <li>
            <em>制单人：</em>
            <span v-if="order.orderer">{{ order.orderer.mobile }}</span>
          </li>
          <li>
            
          </li>
        </ul>
      </dt>
      <dd>
        <el-table
          :data="order.details"
          max-height="500"
          border
          :fit="true"
        >
          <el-table-column
            :label="__('productName')"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.productVo.product.name}}
            </template>
          </el-table-column>

          <el-table-column
            label="折后总价"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.amount}}
            </template>
          </el-table-column>

          <el-table-column
            label="拥有者"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.productVo.product.name}}
            </template>
          </el-table-column>

          <el-table-column
            label="实际购买数量"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.quantity}}
            </template>
          </el-table-column>

          <el-table-column
            label="产品状态"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.productVo.product.name}}
            </template>
          </el-table-column>

          <el-table-column
            label="使用有效期"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.productVo.product.name}}
            </template>
          </el-table-column>

          <el-table-column
            label="支付有效期"
            min-width="200"
          >
            <template slot-scope="scope">
              {{scope.row.productVo.product.name}}
            </template>
          </el-table-column>

          <el-table-column
            :label="__('operation')"
            min-width="100"
            fixed="right"
          >
            <template slot-scope="scope">
              <router-link :to="{path: '/order/detail/' + scope.row.id}">
                <el-button type="primary" size="mini" plain>{{__('btn.detail')}}</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'com-order-list',
  props: {
    order: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.order-item-dt {
  padding: 10px 0;
}
.order-item-dh {
  white-space: nowrap;
  padding: 5px 0;
}
</style>
