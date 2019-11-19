<template>
  <el-table
    class="order-list"
    :data="data"
    max-height="500"
    stripe
    border
    :fit="true"
    v-loading="loading"
  >
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left" inline class="expand-form" label-width="100px">
          <el-form-item label="产品:">
            <span>{{ scope.row.productName }}</span>
          </el-form-item>

          <el-form-item :label="__('productCategory') + '：'">
            <span>{{ scope.row.productCategory | enumText(enums, 'category') }}</span>
          </el-form-item>

          <el-form-item label="下单时间:">
            <span>{{ scope.row.createTime | dateTime }}</span>
          </el-form-item>

          <el-form-item label="拥有者:">
            <span v-if="scope.row.ownedCompany">
              {{ scope.row.ownedCompany.name }}
            </span>
            <span v-if="scope.row.ownedUser">
              {{ scope.row.ownedUser.nickname }}
            </span>
          </el-form-item>

          <el-form-item label="公司:">
            <span v-if="scope.row.ownedCompany">
              {{ scope.row.ownedCompany.name }}
            </span>
          </el-form-item>

          <el-form-item label="下单人:">
            <span v-if="scope.row.orderer">
              {{ scope.row.orderer.nickname }}
            </span>
          </el-form-item>
          
          <el-form-item label="合同时间:">
            <el-tag class="tag" type="info" size="small">
              {{ scope.row.contractBegin | dateTime('YYYY-MM-DD HH:mm')}}
            </el-tag>
            <span> - </span>
            <el-tag class="tag" type="info" size="small">
              {{ scope.row.contractEnd | dateTime('YYYY-MM-DD HH:mm')}}
            </el-tag>
          </el-form-item>

          <el-form-item label="使用有效期:">
            <el-tag class="tag" type="info" size="small">
              {{ scope.row.effectiveBegin | dateTime('YYYY-MM-DD HH:mm')}}
            </el-tag>
            <span> - </span>
            <el-tag class="tag" type="info" size="small">
              {{ scope.row.effectiveEnd | dateTime('YYYY-MM-DD HH:mm')}}
            </el-tag>
            <el-button 
              size="mini" 
              type="primary" 
              @click="editEffective(scope.row, scope.$index)" v-if="scope.row.orderType != 'PREORDER'"
            >
              {{__('btn.edit')}}
            </el-button>
          </el-form-item>

          <el-form-item label="支付有效期:">
            <el-tag class="tag" type="info" size="small">
              {{ scope.row.paidBeginDate | dateTime('YYYY-MM-DD HH:mm')}}
            </el-tag>
            <span> - </span>
            <el-tag class="tag" type="info" size="small">
              {{ scope.row.paidEndDate | dateTime('YYYY-MM-DD HH:mm')}}
            </el-tag>
            <el-button 
              size="mini" 
              type="primary" 
              @click="editPaidDate(scope.row, scope.$index)"
              v-if="scope.row.orderType != 'PREORDER'"
            >
              {{__('btn.edit')}}
            </el-button>
          </el-form-item>

          <el-form-item label="离开时间:">
            <span>{{ scope.row.leaveDate | dateTime('YYYY-MM-DD HH:mm') }}</span>
            <el-button 
              size="mini" 
              type="primary" 
              @click="editLeaveDate(scope.row, scope.$index)"
              v-if="scope.row.orderType != 'PREORDER'"
            >
              {{__('btn.edit')}}
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>

    <el-table-column
      :label="__('orderNumber')"
      min-width="150"
    >
      <template slot-scope="scope">
        {{scope.row.orderNo}}
      </template>
    </el-table-column>

    <el-table-column
      label="订单类型"
      min-width="150"
    >
      <template slot-scope="scope">
        {{scope.row.orderType | enumText(enums, 'orderType')}}
      </template>
    </el-table-column>

    <el-table-column
      label="产品"
      min-width="200"
    >
      <template slot-scope="scope">
        {{scope.row.productName}} / {{ scope.row.productCategory | enumText(enums, 'category') }}
      </template>
    </el-table-column>

    <el-table-column
      label="折后总价"
      min-width="150"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.currency">{{scope.row.currency.sign}}</span> 
        {{scope.row.amount}}
      </template>
    </el-table-column>

    <el-table-column
      label="实际购买数量"
      min-width="150"
    >
      <template slot-scope="scope">
        {{scope.row.quantity}}
      </template>
    </el-table-column>

    <el-table-column
      :label="__('status')"
      min-width="150"
    >
      <template slot-scope="scope">
        {{scope.row.orderStatus | enumText(enums, 'orderStatus')}}
      </template>
    </el-table-column>

    <el-table-column
      :label="__('operation')"
      min-width="200"
      fixed="right"
    >
      <template slot-scope="scope">
        <router-link :to="{path: '/order/detail/' + scope.row.id}">
          <el-button type="primary" size="mini" plain>{{__('btn.detail')}}</el-button>
        </router-link>

        <el-button type="danger" size="mini" @click="deleteOrder(scope.row)">{{__('btn.del')}}</el-button>

        <el-button type="primary" size="mini" plain v-if="scope.row.productGroup=='EVENT'" @click="toEventInfo(scope.row)">活动详情</el-button>

        <div>
          <el-button v-if="scope.row.orderType=='PREORDER'" type="primary" size="mini" @click="convertOrder(scope.row)">转换为正式订单</el-button>
        </div> 
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment';
import {
  showEditEffective, 
  showEditPaidDate,
  showEditLeave
} from '../../helper/order';

export default {
  name: 'com-order-list',
  props: {
    data: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    deleteOrder(item) {
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
          .use('order.del')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.delSuccess'));
              this.$emit('update-list');
            },
            (err) => {
              this.$message.error(err.message);
              this.loading = false;
            }
          );
      });
    },
    editEffective(item, index) {
      let self = this;

      showEditEffective({ order: item }, {
        ['edit-back'](data) {
          self.$emit('update-list');
          // self.data.splice(index, 1, data);
        }
      });
    },
    editPaidDate(item, index) {
      let self = this;

      showEditPaidDate({ order: item }, {
        ['edit-back'](data) {
          self.$emit('update-list');
          // self.data.splice(index, 1, data);
        }
      });
    },
    editLeaveDate(item, index) {
      let self = this;

      showEditLeave({ order: item }, {
        ['edit-back'](data) {
          self.$emit('update-list');
          // self.data.splice(index, 1, data);
        }
      });
    },
    convertOrder(item) {
      this.$confirm(this.__('order.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        this.$unsubscribe(`convertOrder`);
        this.loading = true;
        this.$subs[`convertOrder`] = this.$hub.flow([{
          id: item.id
        }])
          .use('order.convertToNormal')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.editSuccess'));
              this.$emit('update-list');
            },
            (err) => {
              this.$message.error(err.message);
              this.loading = false;
            }
          );
      });
    },
    toEventInfo(item) {
      this.$unsubscribe(`evetInfo-${item.id}`);
      this.$subs[`evetInfo-${item.id}`] = this.$hub.flow([{
        eventId: item.id
      }])
        .use('event.getByOrder')
        .subscribe(
          (res) => {
            this.$router.push(`/event/detail/${res.eventId}`);
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  .expand-form {
    display: flex;
    flex-wrap: wrap;
  }

  .expand-form /deep/ .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .expand-form /deep/ label {
    color: #99a9bf;
    text-align: right;
  }

  .tag {
    vertical-align: middle;
  }
}
</style>
