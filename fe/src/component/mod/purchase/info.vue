<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <el-form class="sma-form-c" ref="form" label-width="120px" :model="form" v-if="product">
        <el-form-item 
          label="产品信息:"
        >
          <router-link :to="{path: '/product/detail/' + product.id}">
            <el-tag size="small">
              {{product.name}} / {{product.category | enumText(enums, 'category')}}
            </el-tag>
          </router-link>
        </el-form-item>

        <el-form-item 
          v-if="product && product.freeBundle" 
          label="赠送产品信息:"
        >
          <el-tag size="small" v-for="item in product.freeBundle" :key="item.product.id">
            {{item.product.name}}
          </el-tag>
        </el-form-item>

        <el-form-item 
          label="公司:"
          prop="company"
          :rules="[]"
        >
          <el-tag 
            v-if="form.company"
            size="small" 
            closable
            @close="removeCompany"
          >{{form.company.shortName}}</el-tag>
          <el-button size="mini" type="primary" @click="selectCompany">{{__('btn.selectCompany')}}</el-button>
          <el-button size="mini" type="primary" @click="addCompany" plain>新增公司</el-button>
        </el-form-item>

        <el-form-item 
          label="主要成员:"
          prop="member"
          :rules="[]"
        >
          <el-tag 
            v-if="form.member"
            size="small" 
            closable
            @close="removeMember"
          >{{form.member.nickname}}</el-tag>
          <el-button size="mini" type="primary" @click="selectMember">{{__('btn.selectMember')}}</el-button>
          <el-button size="mini" type="primary" @click="addMember" plain>新增成员</el-button>
        </el-form-item>

        <el-form-item 
          label="支付人:"
          prop="payer"
          :rules="[
            {required: !form.payerSameWithMember, message: __('required')}
          ]"
        >
          <div>
            <el-switch
              v-model="form.payerSameWithMember"
              active-text="同主要成员"
              inactive-text="手动选择">
            </el-switch>
          </div>
          <div v-if="!form.payerSameWithMember">
            <el-tag 
              v-if="form.payer"
              size="small" 
              closable
              @close="removePayer"
            >{{form.payer.nickname}}</el-tag>
            <el-button size="mini" type="primary" @click="selectPayer">选择</el-button>
          </div>
        </el-form-item>

        <el-form-item 
          label="授权签字人:"
          prop="signer"
          :rules="[
            {required: !form.signerSameWithMember, message: __('required')}
          ]"
        >
          <div>
            <el-switch
              v-model="form.signerSameWithMember"
              active-text="同主要成员"
              inactive-text="手动选择">
            </el-switch>
          </div>
          <div v-if="!form.signerSameWithMember">
            <el-tag 
              v-if="form.signer"
              size="small" 
              closable
              @close="removeSigner"
            >{{form.signer.nickname}}</el-tag>
            <el-button size="mini" type="primary" @click="selectSigner">选择</el-button>
          </div> 
        </el-form-item>

        <el-form-item 
          label="下单客户:"
          prop="orderer"
          :rules="[
            {required: !form.ordererSameWithMember, message: __('required')}
          ]"
        >
          <div>
            <el-switch
              v-model="form.ordererSameWithMember"
              active-text="同主要成员"
              inactive-text="手动选择">
            </el-switch>
          </div>
          <div v-if="!form.ordererSameWithMember">
            <el-tag 
              v-if="form.orderer"
              size="small" 
              closable
              @close="removeOrderer"
            >{{form.orderer.nickname}}</el-tag>
            <el-button size="mini" type="primary" @click="selectOrderer">选择</el-button>
          </div> 
        </el-form-item>

        <el-form-item :label="__('bookingForm.user') + ':'">
          <div>
            <el-switch
              v-model="form.userSameWithMember"
              active-text="同主要成员"
              inactive-text="手动选择">
            </el-switch>
          </div>
          <div v-if="!form.userSameWithMember">
            <el-tag 
              v-for="item in form.users"
              :key="item.id"
              size="small" 
              closable
              class="tag"
              @close="removeUser(item)"
            >{{item.nickname}}</el-tag>
            <el-button size="mini" type="primary" @click="selectUser">选择</el-button>
          </div> 
        </el-form-item>

        <!-- 会员订单 -->
        <template v-if="isMemberOrder || isCoinOrder">
          <el-form-item 
            label="币种:"
            prop="currencyId"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-select :placeholder="__('select')" v-model="form.currencyId">
              <el-option 
                :key="item.id"
                :value="item.id"
                v-for="item in currencyList"
                :label="item.name" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            label="合同时间:"
            prop="contractBegin"
            :rules="rules.contract"
          >
            <el-date-picker
              v-model="form.contractBegin"
              align="right"
              type="date"
              placeholder="开始"
              :picker-options="contractBeginOptions"
              value-format="yyyy-MM-dd"
              @change="contractBeginChange"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="form.contractEnd"
              align="right"
              type="date"
              placeholder="截止"
              :picker-options="contractEndOptions"
              value-format="yyyy-MM-dd"
              :disabled="isCoinOrder"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="购买数量:">
            <el-input-number 
              v-model="form.quantity" 
              :min="1" 
              label="购买数量"
            ></el-input-number>
          </el-form-item>

          <el-form-item 
            v-if="isNeedDeposit"
            label="是否需要押金:"
            prop="needDeposit"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-select :placeholder="__('select')" v-model="form.needDeposit">
              <el-option 
                :key="item[0]"
                :value="item[0]"
                v-for="item in enums.yesOrNo"
                :label="item[1]" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            v-if="isNeedDeposit && form.needDeposit"
            label="押金总价:"
            prop="depositFee"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input 
              class="ins"
              v-model="form.depositFee" 
              auto-complete="off"
            >
              <template slot="append" v-if="curCurrency
              ">{{curCurrency.sign}}</template>
            </el-input>  
          </el-form-item>

          <el-form-item 
            label="折扣:"
            prop="discounts"
            :rules="rules.discounts"
          >
            <table class="table">
              <thead>
                <tr>
                  <th>{{__('StartTime')}}</th>
                  <th>{{__('EndTime')}}</th>
                  <th>折后总价</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.discounts" :key="index">
                  <td>
                    <el-date-picker
                      v-model="item.beginTime"
                      align="right"
                      type="date"
                      placeholder="开始"
                      :picker-options="discountBeginOptions"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </td>           
                  <td>
                    <el-date-picker
                      v-model="item.endTime"
                      align="right"
                      type="date"
                      placeholder="截止"
                      :picker-options="discountEndOptions"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-input 
                      v-model.number="item.discountedPrice" 
                      auto-complete="off"
                    >
                      <template slot="append" v-if="curCurrency
                      ">{{curCurrency.sign}}</template>
                    </el-input>  
                  </td>
                  <td>
                    <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      circle
                      size="mini"
                      @click="removeDiscount(item)"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="sma-margin-top-10">
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                circle
                size="mini"
                @click="addDiscount"
              ></el-button>
            </div>
          </el-form-item>

          <el-form-item label="审批人:">
            <el-checkbox-group v-model="form.approver">
              <el-checkbox 
                v-for="item in approverList"
                :key="item"
                :label="item"
              >
                <span>{{item}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>

        <!-- 会议室订单 -->
        <template v-if="isMeetingRoomOrder">
          <el-form-item 
            label="用途:"
            prop="purpose"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-select :placeholder="__('select')" v-model="form.purpose">
              <el-option 
                value="MEETING"
                label="会议" 
              ></el-option>
              <el-option 
                value="EVENT"
                label="活动" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            label="币种:"
            prop="currencyId"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-select :placeholder="__('select')" v-model="form.currencyId">
              <el-option 
                :key="item.id"
                :value="item.id"
                v-for="item in currencyList"
                :label="item.name" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            label="预订时间:"
            prop="mrDurations"
            :rules="rules.mrDurations"
          >
            <el-date-picker
              v-model="form.mrDurations[0].beginTime"
              align="right"
              type="datetime"
              placeholder="开始"
              :picker-options="mrBeginOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="form.mrDurations[0].endTime"
              align="right"
              type="datetime"
              placeholder="截止"
              :picker-options="mrEndOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>

          <el-form-item 
            label="预订房间:"
            prop="mrResourceId"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-radio-group v-model="form.mrResourceId">
              <el-radio 
                v-for="res in product.resources"
                :key="res.id"
                :label="res.id"
              >
                <span>{{res.name}}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item 
            label="折后总价:"
            prop="mrDiscountedPrice"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input
              v-model="form.mrDiscountedPrice" 
              label="折后总价"
              class="ins"
            >
              <template slot="append">
                <span v-if="curCurrency">
                  {{curCurrency.sign}}
                </span>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <!-- 活动订单 -->
        <template v-if="isEventOrder">
          
          <el-form-item 
            label="用途:"
            prop="purpose"
            :rules="[{
              required: true
            }]"
          >
            <el-select :placeholder="__('select')" v-model="form.purpose">
              <el-option 
                value="MEETING"
                label="会议" 
              ></el-option>
              <el-option 
                value="EVENT"
                label="活动" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            label="币种:"
            prop="currencyId"
            :rules="[
              {required: true, message: '请选择币种'}
            ]"
          >
            <el-select :placeholder="__('select')" v-model="form.currencyId">
              <el-option 
                :key="item.id"
                :value="item.id"
                v-for="item in currencyList"
                :label="item.name" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            label="活动类型:"
            prop="eventInfo.eventTypeIds"
            :rules="[
              {required: true, type: 'array', min: 2, message: __('required')}
            ]"
          >
            <el-cascader
              :options="eventTypes"
              :props="{
                value: 'id',
                label: 'name'
              }"
              v-model="form.eventInfo.eventTypeIds"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item 
            label="活动名字:"
            prop="eventInfo.title"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input 
              v-model="form.eventInfo.title" 
              type="textarea"
              label="活动名字"
              class="ins"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="活动参与人数:"
            prop="eventInfo.attendeesCount"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input-number
              :min="1"
              v-model="form.eventInfo.attendeesCount" 
              label="活动参与人数"
              class="ins"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="布置时间:">
            <el-date-picker
              v-model="form.eventInfo.setupTime"
              align="right"
              type="datetime"
              placeholder="入场布置时间"
              :picker-options="mrBeginOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="form.eventInfo.setupEndTime"
              align="right"
              type="datetime"
              placeholder="布置结束时间"
              :picker-options="mrEndOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>

          <el-form-item 
            label="活动时间:"
            prop="mrDurations"
            :rules="rules.eventDurations"
          >
            <table class="table">
              <thead>
                <tr>
                  <th>{{__('StartTime')}}</th>
                  <th>{{__('EndTime')}}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.mrDurations" :key="index">
                  <td>
                    <el-date-picker
                      v-model="item.beginTime"
                      align="right"
                      type="datetime"
                      placeholder="开始"
                      :picker-options="discountBeginOptions"
                      value-format="yyyy-MM-dd HH:mm"
                    ></el-date-picker>
                  </td>           
                  <td>
                    <el-date-picker
                      v-model="item.endTime"
                      align="right"
                      type="datetime"
                      placeholder="截止"
                      :picker-options="discountEndOptions"
                      value-format="yyyy-MM-dd HH:mm"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      circle
                      size="mini"
                      @click="removeMrDuration(item)"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                circle
                size="mini"
                @click="addMrDuration"
              ></el-button>
            </div>
          </el-form-item>

          <el-form-item 
            label="活动类目:"
            prop="eventInfo.prices"
            :rules="rules.eventPrices"
          >
            <table class="table">
              <thead>
                <tr>
                  <th>活动费用</th>
                  <th>活动价格</th>
                  <th>说明</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.eventInfo.prices" :key="index">
                  <td>
                    <el-input v-model="item.category"></el-input>
                  </td>           
                  <td>
                    <el-input v-model="item.price">
                      <template 
                        slot="append" 
                        v-if="curCurrency"
                      >
                        {{curCurrency.sign}}
                      </template>
                    </el-input>
                  </td>
                  <td>
                    <el-input type="textarea" v-model="item.description"></el-input>
                  </td>
                  <td>
                    <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      circle
                      size="mini"
                      @click="removeEventCategory(item)"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                circle
                size="mini"
                @click="addEventCategory"
              ></el-button>
            </div>
          </el-form-item>

          <el-form-item label="活动审批人:">
            <el-checkbox-group v-model="form.approver">
              <el-checkbox 
                v-for="item in eventApproverList"
                :key="item"
                :label="item"
              >
                <span>{{item}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item :label="__('remark') + ':'">
            <el-input 
              v-model="form.approveRemark" 
              type="textarea"
              :label="__('remark')"
              class="ins"
            ></el-input>
          </el-form-item>
        </template>

        <el-form-item size="large" class="sma-margin-top-50">
          <el-button 
            v-if="cartId"
            type="primary" 
            @click="computePrice"
          >保存更新</el-button>
          <el-button 
            v-if="productId"
            type="primary" 
            @click="computePrice"
          >添加到购物车</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="calcTipShow"
      width="640px">

      <el-form class="sma-form-c" label-width="120px" v-if="calcPriceResult">
        <el-form-item label="标准总价：">
          {{calcPriceResult.currency.sign}} {{calcPriceResult.price}}
        </el-form-item>
        <el-form-item label="折后总价：">
          {{calcPriceResult.currency.sign}} {{calcPriceResult.amount}}
        </el-form-item>
        <el-form-item label="押金价格：">
          <span v-if="calcPriceResult.depositFee">
            {{calcPriceResult.currency.sign}} {{calcPriceResult.depositFee}}
          </span>
          <span v-if="!calcPriceResult.depositFee">
            无
          </span>
        </el-form-item>
        <el-form-item label="每月应付：">
          <el-table :data="calcPriceResult.pricePerMonth">
            <el-table-column label="开始">
              <template slot-scope="scope">
                {{scope.row.beginTime | dateTime}}
              </template>
            </el-table-column>
            <el-table-column label="结束">
              <template slot-scope="scope">
                {{scope.row.endTime | dateTime}}
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                {{calcPriceResult.currency.sign}}{{scope.row.amount}}
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="折扣信息：">
          <span v-if="!calcPriceResult.discounts">
            无
          </span>
          <el-table v-if="calcPriceResult.discounts" :data="calcPriceResult.discounts">
            <el-table-column label="开始">
              <template slot-scope="scope">
                {{scope.row.beginTime | dateTime}}
              </template>
            </el-table-column>
            <el-table-column label="结束">
              <template slot-scope="scope">
                {{scope.row.endTime | dateTime}}
              </template>
            </el-table-column>
            <el-table-column label="折后总价">
              <template slot-scope="scope">
                {{calcPriceResult.currency.sign}}{{scope.row.discountedPrice}}
              </template>
            </el-table-column>
            <el-table-column label="折扣率">
              <template slot-scope="scope">
                {{(scope.row.discountRate * 100).toFixed(2) + '%'}}
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
 
      <div slot="footer" class="dialog-footer">
        <el-button @click="calcTipShow = false">取 消</el-button>
        <el-button type="primary" v-if="cartId" @click="saveToCart">保存到购物车</el-button>
        <el-button type="primary" v-if="productId" @click="addToCart">添加到购物车</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import ProductListSimple from '../../com/product/list-simple';
import {showAddCompany, showChooseCompany} from '../../helper/company';
import {showAddUser, showChooseUser} from '../../helper/user';
import * as BuyTool from '../../../util/buy-tool';

/**
 * @vuedoc
 * @exports component/mod/user/List
 */
export default {
  name: 'mod-purchase-info',
  props: {
    productId: {
      type: [Number, String]
    },
    cartId: {
      type: [Number, String]
    }
  },
  components: {
    ProductListSimple
  },
  data() {
    let self = this;

    return {
      loading: false,

      activeTab: 'order',
      // 模式
      // addCart, editCart, renew
      mode: 'addCart',

      // 活动类别
      eventTypes: [],

      // 计算价格
      calcTipShow: false,
      calcPriceResult: null,
      calcData: null,

      // 产品信息
      product: null,

      // 审批人
      approverList: BuyTool.getApprovers(),
      eventApproverList: BuyTool.getApprovers('event'),

      // form
      form: {

        // 公司
        company: null,

        // 主要成员
        member: null,

        // 使用者
        users: [],
        userSameWithMember: true,

        // 支付人
        payer: null,
        payerSameWithMember: true,

        // 签字人
        signer: null,
        signerSameWithMember: true,

        // 下单客户
        orderer: null,
        ordererSameWithMember: true,

        // 使用时间（非meetingroom）
        contractBegin: '',
        contractEnd: '',

        // purpose
        purpose: 'MEETING',

        // 预订时间段
        mrDurations: [
          {
            beginTime: '',
            endTime: '',
          }
        ],
        // 折后总价
        mrDiscountedPrice: '',
        // 资源
        mrResourceId: '',

        // 审批人
        approver: [],

        // 币种
        currencyId: '',

        // 折扣时段
        discounts: [
          {
            beginTime: '',
            endTime: '',
            discount: 1,
            discountedPrice: '',
          }
        ],

        // 是否需要押金
        needDeposit: false,
        // 自定义押金
        depositFee: 0,

        // 实际购买数量
        quantity: 1,

        // 活动信息
        // 活动备注
        approveRemark: '',
        eventInfo: {
          // 活动参与人数
          attendeesCount: '',
          // 活动名字
          title: '',
          // 入场布置时间
          setupTime: '',
          // 布置结束时间
          setupEndTime: '',
          // 活动类别
          eventTypeIds: [],
          // 活动细节
          prices: [
            {
              category: '场地 Venue',
              description: '',
              price: 0,
            }
          ]
        }
      },

      contractBeginOptions: {
        disabledDate(time) {
          return false;
        }
      },

      contractEndOptions: {
        disabledDate(time) {
          return false;
        }
      },

      mrBeginOptions: {
        disabledDate(time) {
          return false;
        }
      },

      mrEndOptions: {
        disabledDate(time) {
          return false;
        }
      },

      discountBeginOptions: {
        disabledDate(time) {
          return false;
        }
      },

      discountEndOptions: {
        disabledDate(time) {
          return false;
        }
      }
    }
  },
  beforeMount() {
    //
  },
  computed: {
    rules() {
      let self = this;
      
      return {
        discounts: [
          {validator(rule, value, callback) {
            let discounts = self.form.discounts;
            let error = '';

            discounts.forEach(item => {
              if (error) return;

              if (!item.beginTime && !item.endTime && !item.discountedPrice) {
                return;
              }
              
              if (!item.beginTime || !item.endTime || !item.discountedPrice) {
                error = new Error('折扣信息填写错误');
                return;
              }

              let start = moment(item.beginTime).valueOf();
              let end = moment(item.endTime).valueOf();
              if (start >= end) {
                error = new Error('折扣信息填写错误');
                return;
              }
            });

            callback(error || undefined);
          }}
        ],
        contract: [
          {validator(rule, value, callback) {
            let beginTime = self.form.contractBegin;
            let endTime = self.form.contractEnd;
            let contractBegin = moment(beginTime).valueOf();
            let contractEnd = moment(endTime).valueOf();

            if (!beginTime || !endTime) {
              return callback(new Error('合同时间不完整'));
            }

            if (contractEnd <= contractBegin) {
              return callback(new Error('合同结束时间必须大于开始时间'));
            }

            callback();
          }}
        ],
        mrDurations: [
          {validator(rule, value, callback) {
            let beginTime = self.form.mrDurations[0].beginTime;
            let endTime = self.form.mrDurations[0].endTime;
            let begin = moment(beginTime).valueOf();
            let end = moment(endTime).valueOf();

            if (!beginTime || !endTime) {
              return callback(new Error('预订时间填写不正确'));
            }

            if (end <= begin) {
              return callback(new Error('预订时间填写不正确'));
            }

            callback();
          }}
        ],
        eventDurations: [
          {validator(rule, value, callback) {
            let discounts = self.form.mrDurations;
            let error = '';

            discounts.forEach(item => {
              if (error) return;

              if (!item.beginTime || !item.endTime) {
                error = new Error('活动时间填写不正确');
                return;
              }

              let start = moment(item.beginTime).valueOf();
              let end = moment(item.endTime).valueOf();
              if (start >= end) {
                error = new Error('活动时间填写不正确');
                return;
              }
            });

            if (!error && !self.form.mrDurations.length) {
              error = new Error(__('required'));
            }

            callback(error || undefined);
          }}
        ],
        eventPrices: [
          {validator(rule, value, callback) {
            let prices = self.form.eventInfo.prices;
            let error = '';

            prices.forEach(item => {
              if (error) return;

              if (!item.category) {
                error = new Error('活动类目填写不正确');
                return;
              }
            });

            if (!error && !self.form.eventInfo.prices.length) {
              error = new Error(__('required'));
            }

            callback(error || undefined);
          }}
        ],
      }
    },
    enums() {
      return this.$state.enums.all;
    },
    // 产品支持的币种
    currencyList() {
      if (!this.product) return [];
      let currencyList = [];
      let ids = [];
      this.product.prices.forEach(item => {
        if (ids.indexOf(item.currency.id) == -1) {
          currencyList.push(item.currency);
          ids.push(item.currency.id);
        }
      });
      return currencyList;
    },
    isMeetingRoomOrder() {
      if (!this.product) return false;
      return BuyTool.isMeetingRoom(this.product.category) && this.form.purpose != 'EVENT';
    },
    isEventOrder() {
      if (!this.product) return false;
      return BuyTool.isMeetingRoom(this.product.category) && this.form.purpose == 'EVENT';
    },
    isCoinOrder() {
      if (!this.product) return false;
      return this.product.category == 'COIN';
    },
    isMemberOrder() {
      return !this.isMeetingRoomOrder 
        && !this.isEventOrder
        && !this.isCoinOrder;
    },
    isNeedHub() {
      if (!this.product) return false;
      return BuyTool.isCatHubWithOrder(this.product.category);
    },
    isNeedDeposit() {
      if (!this.product) return false;
      return BuyTool.isNeedDeposit(this.product.category);
    },
    curCurrency() {
      return this.currencyList.find(item => {
        return this.form.currencyId == item.id;
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.productId) {
        vm.$root.setMeta({
          path: vm.$route.path, 
          title: `加入购物车(${vm.productId})`
        });
      }
      
      if (vm.cartId) {
        vm.$root.setMeta({
          path: vm.$route.path, 
          title: `修改购物车(${vm.cartId})`
        });
      }
    });
  },
  created() {
    this.refreshMod();  
  },
  methods: {
    refreshMod() {
      // 初次购买
      if (this.productId) {
        this.initForPurchase();
      }

      // 修改购物车
      if (this.cartId) {
        this.initForCart();
      }
    },
    tabClick(tab, event) {
      //
    },
    eventTypeChange(val) {
      //
    },
    contractBeginChange() {
      let validDays = this.product.validDays;
      if (!this.isCoinOrder || !validDays) return;

      this.form.contractEnd = moment(this.form.contractBegin)
        .add(validDays, 'days')
        .format('YYYY-MM-DD');
    },
    initForCart() {
      let cartItems = this.$state.cart.items;
      let data = cartItems[this.cartId];

      if (!data) {
        this.$message.error('信息不存在！');

        let path = this.$route.path;
        this.$router.replace('/purchase/cart', () => {
          this.$root.$nextTick(() => {
            this.$root.closeMod(path);
          });
        });
        return;
      }

      this.form = data.form;

      let eventTypesOb = this.$hub.flow([{}])
        .use('order.eventTypes');
      let productOb = this.$hub.flow([{ id: data.productId }])
        .use('product.info');

      this.$unsubscribe('initForCart');
      this.$subs.initForCart = this.$hub.flowAll([
        eventTypesOb,
        productOb
      ])
        .subscribe(
          ([eventTypes, product]) => {
            this.eventTypes = eventTypes;
            this.product = product;
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },
    initForPurchase() {
      let eventTypesOb = this.$hub.flow([{}])
        .use('order.eventTypes');
      let productOb = this.$hub.flow([{ id: this.productId }])
        .use('product.info');
      
      this.$unsubscribe('initForPurchase');
      this.$subs.initForPurchase = this.$hub.flowAll([
        eventTypesOb,
        productOb
      ])
        .subscribe(
          ([eventTypes, product]) => {
            this.eventTypes = eventTypes;
            this.product = product;

            this.form.quantity = product.quantity;
            // 默认选中会议室
            if (product.resources && product.resources.length == 1) {
              this.form.mrResourceId = product.resources[0].id;
            }

            // event
            if (product.category == 'LIVING_ROOM') {
              this.form.purpose = 'EVENT';
            }
            
            this.form.currencyId = this.product.prices[0].currency.id;
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },
    addCompany() {
      let self = this;
      showAddCompany({}, {
        ['add-back'](data) {
          self.form.company = data;
          if (!self.form.member && data.admin) {
            self.form.member = data.admin;
            self.validateField('member');
          }
          self.validateField('company');
        }
      });
    },
    selectCompany() {
      let self = this;
      showChooseCompany({}, {
        ['choose-back'](data) {
          self.form.company = data;
          if (!self.form.member && data.admin) {
            self.form.member = data.admin;
            self.validateField('member');
          }
          self.validateField('company');
        }
      });
    },
    removeCompany() {
      this.form.company = null;
      this.validateField('company');
    },
    addMember() {
      let self = this;
      showAddUser({ userType: 1 }, {
        ['choose-back'](data) {
          self.form.member = data;
          self.validateField('member');
        }
      });
    },
    selectMember() {
      let self = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          self.form.member = data;
          self.validateField('member');
        }
      });
    },
    removeMember() {
      this.form.member = null;
      this.validateField('member');
    },
    selectPayer() {
      let self = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          self.form.payer = data;
          self.validateField('payer');
        }
      });
    },
    removePayer() {
      this.form.payer = null;
      this.validateField('payer');
    },
    selectSigner() {
      let self = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          self.form.signer = data;
          self.validateField('signer');
        }
      });
    },
    removeSigner() {
      this.form.signer = null;
      this.validateField('signer');
    },
    selectOrderer() {
      let self = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          self.form.orderer = data;
          self.validateField('orderer');
        }
      });
    },
    removeOrderer() {
      this.form.orderer = null;
      this.validateField('orderer');
    },
    selectUser() {
      let self = this;
      let ids = this.form.users.map(item => item.id);
      showChooseUser({ isMulti: true }, {
        ['choose-back'](list) {
          list.forEach(item => {
            if (ids.indexOf(item.id) == -1) {
              self.form.users.push(item);
            }
          });
        }
      });
    },
    removeUser(user) {
      let index = this.form.users.indexOf(user);
      this.form.users.splice(index, 1);
    },
    addDiscount() {
      this.form.discounts.push({
        beginTime: '',
        endTime: '',
        discount: 1,
        discountedPrice: ''
      });
    },
    removeDiscount(item) {
      let index = this.form.discounts.indexOf(item);
      this.form.discounts.splice(index, 1);
    },
    addMrDuration() {
      this.form.mrDurations.push({
        beginTime: '',
        endTime: ''
      });
    },
    addEventCategory() {
      this.form.eventInfo.prices.push({
        category: '场地 Venue',
        description: '',
        price: 0
      });
    },
    removeEventCategory(item) {
      let index = this.form.eventInfo.prices.indexOf(item);
      this.form.eventInfo.prices.splice(index, 1);
    },
    removeMrDuration(item) {
      let index = this.form.mrDurations.indexOf(item);
      this.form.mrDurations.splice(index, 1);
    },
    validateField(prop) {
      this.$refs['form'].validateField(prop);
    },
    addToCart() {
      this.calcTipShow = false;

      this.$store.commit('cart.addCartItem', {
        productId: this.calcData.productId,
        form: this.form,
        data: this.calcData
      });

      let path = this.$route.path;
      this.$router.replace('/purchase/cart', () => {
        this.$root.$nextTick(() => {
          this.$root.closeMod(path);
        });
      });
    },
    saveToCart() {
      this.calcTipShow = false;

      this.$store.commit('cart.updateCartItem', {
        cartId: this.cartId,
        info: {
          productId: this.calcData.productId,
          form: this.form,
          data: this.calcData
        }
      });

      let path = this.$route.path;
      this.$router.replace('/purchase/cart', () => {
        this.$root.$nextTick(() => {
          this.$root.closeMod(path);
        });
      });
    },
    computePrice() {
      if (!this.form.company && !this.form.member) {
        this.$message.error('公司和主要成员至少填一个');
        return;
      }

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitComputePrice();
        } else {
          this.$message.error(this.__('form.error'));
        }
      });
    },
    submitComputePrice() {
      let postData = {};

      // 活动订单
      if (this.isEventOrder) {
        postData.eventInfo = {
          title: this.form.eventInfo.title,
          attendeesCount: this.form.eventInfo.attendeesCount,
          prices: this.form.eventInfo.prices,
          eventTypeId: this.form.eventInfo.eventTypeIds[1],
        }
        // setup time
        if (
          this.form.eventInfo.setupTime 
          && this.form.eventInfo.setupEndTime
        ) {
          postData.eventInfo.setupTime = this.form.eventInfo.setupTime;
          postData.eventInfo.setupEndTime = this.form.eventInfo.setupEndTime;
        }

        // reservationPeriods
        postData.reservationPeriods = [];
        this.form.mrDurations.forEach(function(item) {
          postData.reservationPeriods.push({
            beginTime: moment(item.beginTime).startOf('minute').valueOf(),
            endTime: moment(item.endTime).startOf('minute').valueOf(),
          });
        }.bind(this));

        // resourceIds
        postData.resourceIds = this.product.resources.map(item=>item.id);
        postData.productGroup = 'EVENT';
      } 
      
      // 会议室订单
      if (this.isMeetingRoomOrder) {
        // 使用房间
        postData.resourceIds = [this.form.mrResourceId];
        // 预订时间
        postData.reservationPeriods = [];
        this.form.mrDurations.forEach((item) => {
          postData.reservationPeriods.push({
            beginTime: moment(item.beginTime).startOf('minute').valueOf(),
            endTime: moment(item.endTime).startOf('minute').valueOf(),
          });
        });
        // cm折扣
        postData.discounts = [];
        if (this.form.mrDiscountedPrice !== '') {
          postData.discounts.push({
            discountedPrice: this.form.mrDiscountedPrice
          });
        }
      } 

      // 会员订单
      if (this.isMemberOrder || this.isCoinOrder) {
        // 折扣
        postData.discounts = [];
        this.form.discounts.forEach((obj) => {
          if (!obj.beginTime || !obj.endTime || !obj.discountedPrice) {
            return;
          }

          postData.discounts.push({
            beginTime: moment(obj.beginTime).startOf('day').valueOf(),
            endTime: moment(obj.endTime).startOf('day').valueOf(),
            discountedPrice: obj.discountedPrice
          });
        });

        // 开始结束时间
        postData.contractBegin = moment(this.form.contractBegin).startOf('day').valueOf();
        postData.contractEnd = moment(this.form.contractEnd).startOf('day').valueOf();

        // 押金
        if (this.form.needDeposit) {
          postData.depositFee = this.form.depositFee;
        }
      }

      postData.productId = this.product.id;
      postData.quantity = this.form.quantity;
      postData.approver = this.form.approver.join(',');
      postData.currencyId = this.form.currencyId;

      // company
      if (this.form.company) {
        postData.ownerId = this.form.company.idCode.id;
        postData.ownerType = 'COMPANY';
      }

      // primary user
      if (this.form.member) {
        postData.primaryUserId = this.form.member.id;
        // no company
        if (!this.form.company) {
          postData.ownerId = this.form.member.idCode.id;
          postData.ownerType = 'USER';
        }
      }

      // payer
      if (this.form.payerSameWithMember) {
        if (this.form.member) {
          postData.payUserId = this.form.member.id;
        }
      } else {
        if (this.form.payer) {
          postData.payUserId = this.form.payer.id;
        }
      }

      // signer
      if (this.form.signerSameWithMember) {
        if (this.form.member) {
          postData.signerId = this.form.member.id;
        }
      } else {
        if (this.form.signer) {
          postData.signerId = this.form.signer.id;
        }
      }

      // orderer
      if (this.form.ordererSameWithMember) {
        if (this.form.member) {
          postData.ordererId = this.form.member.id;
        }
      } else {
        if (this.form.orderer) {
          postData.ordererId = this.form.orderer.id;
        }
      }

      // users
      if (this.form.userSameWithMember) {
        if (this.form.member) {
          postData.userIds = [this.form.member.id];
        }
      } else {
        postData.userIds = this.form.users.map(function(item) {
          return item.id;
        });
      }

      this.loading = true;
      this.$unsubscribe('calculatePrice');
      this.$subs.calculatePrice = this.$hub.flow([postData])
        .use('order.calculatePrice')
        .subscribe(
          (data) => {
            this.calcData = postData;
            this.calcPriceResult = data;
            this.loading = false;
            this.calcTipShow = true;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    }, 
  }       
}
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.table {
  width: auto;
  border: 1px solid #eee;
  table-layout: fixed;

  td, th {
    padding: 5px;
    border: 1px solid #eee;
  }
}

.el-input, 
.el-select,
.el-input-number,
.el-textarea,
.el-cascader {
  width: 250px;
}
</style>
