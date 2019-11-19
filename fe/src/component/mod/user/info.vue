<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box" v-loading="loading">

      <el-tabs v-model="activeTab" @tab-click="tabClick" v-loading="loading">
        <el-tab-pane :label="__('userInfo')" name="user">
          <div class="sma-detail-a" v-if="detail && !showEditInfo">
            <div class="sma-tab-info">
              <div class="content">
                <dl>
                  <dt>{{__('userID')}}：</dt>
                  <dd>{{detail.id}}</dd>
                </dl>

                <dl>
                  <dt>{{__('type')}}：</dt>
                  <dd>{{detail.userType | enumText(enums, 'userType')}}</dd>
                </dl>

                <dl>
                  <dt>{{__('mobileNumber')}}：</dt>
                  <dd>
                    <span v-if="detail.mobileCode">
                      ({{detail.mobileCode}})
                    </span>
                    {{detail.mobile}}
                  </dd>
                </dl>

                <dl>
                  <dt>{{__('nickname')}}：</dt>
                  <dd>{{detail.nickname}}</dd>
                </dl>

                <dl>
                  <dt>{{__('realName')}}：</dt>
                  <dd>{{detail.realName}}</dd>
                </dl>

                <dl>
                  <dt>{{__('company')}}：</dt>
                  <dd>{{detail.companyName}}</dd>
                </dl>

                <dl>
                  <dt>{{__('genderEnum')}}：</dt>
                  <dd>{{detail.genderEnum | enumText(enums, 'gender')}}</dd>
                </dl>

                <dl>
                  <dt>{{__('email')}}：</dt>
                  <dd>{{detail.email}}</dd>
                </dl>

                <dl>
                  <dt>{{__('phone')}}：</dt>
                  <dd>{{detail.telephone}}</dd>
                </dl>

                <dl>
                  <dt>{{__('fax')}}：</dt>
                  <dd>{{detail.fax}}</dd>
                </dl>

                <dl>
                  <dt>{{__('idCode')}}：</dt>
                  <dd>
                    <span v-if="detail.idCode">
                      {{detail.idCode.code}}
                    </span>
                  </dd>
                </dl>

                <!-- <dl>
                  <dt>{{__('dtTime')}}：</dt>
                  <dd>
                    <div v-if="detail.idCode">
                      {{detail.idCode.createTime | dateTime}}
                    </div>
                  </dd>
                </dl> -->

                <dl>
                  <dt>{{__('accessCard')}}：</dt>
                  <dd>
                    <div v-if="detail.cardInfo">
                      {{detail.cardInfo.cardNumber}}
                    </div>
                  </dd>
                </dl>
                
                <dl>
                  <dt>{{__('idCardFace')}}：</dt>
                  <dd>
                    <img-box :img="detail.idCardFace"></img-box>
                  </dd>
                </dl>
                
                <dl>
                  <dt>{{__('idCardBack')}}：</dt>
                  <dd>
                    <img-box :img="detail.idCardBack"></img-box>
                  </dd>
                </dl>
              
                <dl>
                  <dt>{{__('passport')}}：</dt>
                  <dd>
                    <img-box :img="detail.pass"></img-box>
                  </dd>
                </dl>
    
                <dl>
                  <dt>{{__('createTime')}}：</dt>
                  <dd>{{detail.createTime | dateTime}}</dd>
                </dl>
                
              </div>
            </div>

            <div class="f-button">
              <el-button
                size="mini"
                type="primary"
                @click="editInfo"
                v-if="!showEditInfo">{{__('btn.edit')}}</el-button>
            </div>
          </div>

          <!--修改用户信息-->
          <div class="sma-detail-a" v-if="form && showEditInfo">
            <div class="sma-tab-info">
              <el-form :model="form" :rules="rules" ref="form" class="content" :disabled="loading">
                <el-form-item :label="__('type')" prop="userType">
                  <el-select v-model="form.userType" :placeholder="__('select')">
                    <el-option
                      v-for="item in enums.userType"
                      :key="item[0]"
                      :label="item[1]"
                      :value="item[0]">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="__('mobileNumber')" required prop="mobile">
                  <div class="sma-w420">
                    <div class="sma-col sma-col-6">
                      <el-select disabled filterable v-model="form.mobileCode" :placeholder="__('mobileCode')">
                        <el-option
                          v-for="item in countriesRegions"
                          :key="item.phoneCode + item.countryName"
                          :label="'+' + item.phoneCode"
                          :value="item.phoneCode"
                          filter-method="filterPhoneCode"
                        >
                          <span style="display: inline-block; width: 50px;">
                            {{item.phoneCode}}
                          </span>
                          <span>
                            {{item.countryName}}
                          </span>
                        </el-option>
                      </el-select>
                    </div>
                  
                    <div class="sma-col sma-col-4">
                      <el-input disabled v-model="form.mobile" :placeholder="__('mobileNumber')"></el-input>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item :label="__('nickname')" prop="nickname">
                  <el-input v-model="form.nickname" :placeholder="__('nickname')"></el-input>
                </el-form-item>

                <el-form-item :label="__('realName')" prop="realName">
                  <el-input v-model="form.realName" :placeholder="__('realName')"></el-input>
                </el-form-item>

                <el-form-item :label="__('company')" prop="company">
                  <el-tag type="info" size="mini" v-if="form.company || detail.companyName">
                    {{ form.company ? form.company.shortName : detail.companyName }}
                  </el-tag>
                  <el-button type="primary" size="mini" @click="selectCompany">
                    {{__('btn.selectCompany')}}
                  </el-button>
                </el-form-item>

                <el-form-item :label="__('email')" prop="email" >
                  <el-input class="sma-w400" v-model="form.email" :placeholder="__('email')"></el-input>
                </el-form-item>

                <el-form-item :label="__('genderEnum')" prop="genderEnum">
                  <el-select v-model="form.genderEnum" :placeholder="__('genderEnum')">
                    <el-option
                      v-for="item in enums.genderStrict"
                      :key="item[0]"
                      :label="item[1]"
                      :value="item[0]">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="__('phone')" prop="telephone">
                  <el-input class="sma-w400" v-model="form.telephone" placeholder="座机"></el-input>
                </el-form-item>

                <el-form-item :label="__('fax')" prop="fax">
                  <el-input class="sma-w400" v-model="form.fax" placeholder="传真"></el-input>
                </el-form-item>

                <el-form-item :label="__('accessCard')" prop="doorCardNumber">
                  <el-input class="sma-w400" v-model="form.doorCardNumber" placeholder="门禁卡"></el-input>
                </el-form-item>

                <el-form-item :label="__('idCardFace')" prop="idCardFace">
                  <img-box water="water" :edit="true" v-model="form.idCardFace"></img-box>
                </el-form-item>

                <el-form-item :label="__('idCardBack')" prop="idCardBack">
                  <img-box water="water" :edit="true" v-model="form.idCardBack"></img-box>
                </el-form-item>

                <el-form-item :label="__('passport')" prop="pass">
                  <img-box water="water" :edit="true" v-model="form.pass"></img-box>
                </el-form-item>
              </el-form>

              <div class="f-button">
                <el-button
                  size="mini"
                  type="primary"
                  @click="saveInfo"
                >{{__('btn.save')}}</el-button>
                <el-button
                  size="mini"
                  @click="cancelEditInfo"
                >{{__('btn.cancel')}}</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="__('userOrder')" name="order">
          <div class="sma-tab-info" v-loading="orders.loading">
            <el-form :inline="true" size="mini" class="sma-form-search sma-margin-top-10" @submit.prevent="searchOrders">
              <el-form-item :label="__('checkType')">
                <el-select class="sma-margin-r-5"
                  :placeholder="__('all')"
                  v-model="orders.relation"
                  @change="searchOrders"
                >
                  <el-option value="USER" :label="__('userCheckType.USER')"></el-option>
                  <el-option value="OWNER" :label="__('userCheckType.OWNER')"></el-option>
                  <el-option value="PAYER" :label="__('userCheckType.PAYER')"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="__('productCategory')">
                <el-select
                  v-model="orders.productCategory"
                  :placeholder="__('all')"
                  @change="searchOrders">
                  <el-option
                    v-for="item in enums.category"
                    :key="item[1]"
                    :label="item[1]"
                    :value="item[1]">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="searchOrders">{{__('btn.search')}}</el-button>
              </el-form-item>
            </el-form>

            <div class="sma-order-list sma-margin-top-20" v-if="orders.rows">
              <!--订单列表-->
              <order-list class="sma-margin-top-20" :data="orders.rows"></order-list>

              <!--分页-->
              <div class="sma-margin-top-20 sma-text-c">
                <el-pagination
                  @size-change="ordersSizeChange"
                  @current-change="ordersCurrentChange"
                  :current-page="orders.page"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :page-size="orders.count"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="orders.total">  
                </el-pagination>
              </div> 
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="__('entranceGuard')" name="door">
          <div class="sma-tab-info">
            <el-table
              :data="doorlock.rows"
              class="sma-margin-top-20"
              max-height="500"
              border
              :fit="true"
            >
              <el-table-column
                prop="businessId"
                :label="__('orderNumber')"
                width="200">
              </el-table-column>
              <el-table-column
                :label="__('entranceGuard')"
                min-width="300">
                <template slot-scope="scope">
                  <ul class="sma-tab-list-style">
                    <li v-for="item in scope.row.permissionVos">
                      {{item.permissionName}}
                    </li>
                  </ul>
                </template>
              </el-table-column>
            </el-table>
        
            <div class="sma-margin-top-20 sma-text-c">
              <el-pagination
                @size-change="doorLockSizeChange"
                @current-change="doorLockCurrentChange"
                :current-page="doorlock.page"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="doorlock.count"
                layout="total, sizes, prev, pager, next, jumper"
                :total="doorlock.total">  
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ImgBox from "../../com/form/img";
import OrderList from '../../com/order/list';
import { copyJson } from "../../../lib/utils";
import { showChooseCompany } from "../../helper/company";

export default {
  name: 'mod-user-detail',
  components: {
    ImgBox,
    OrderList
  },
  props: ['id'],
  data() {
    let self = this;

    return {
      activeTab: 'user',
      loading: false,

      countriesRegions: [],

      //用户信息
      form: null,
      detail: null,
      showEditInfo: false,

      //用户订单
      orders: {
        loading: false,

        productCategory: '',
        relation: 'USER',

        page: 1,
        count: 20,
        total: 0,
        rows: []
      },

      //门禁权限
      doorlock: {
        loading: false,

        rows: [],
        page: 1,
        count: 20,
        total: 0
      },

      rules: {
        userType: [
          { required: true, message: this.__('required') }
        ],
        username: [
          { required: true, message: this.__('required') }
        ],
        company: [
          { required: true, message: this.__('required') }
        ],
        nickname: [
          { required: true, message: this.__('required') }
        ],
        realName: [
          { required: true, message: this.__('required') }
        ],
        genderEnum: [
          { required: true, message: this.__('required') }
        ],
        mobile: [
          {validator(rule, value, callback) {
            let mobileCode = self.form.mobileCode;
            let mobile = self.form.mobile;
            if (!mobileCode) {
              return callback(new Error(self.__('rules.mobileCode')));
            }
            if (!mobile) {
              return callback(new Error(self.__('required')));
            }
            if (!/^[0-9]*$/.test(mobile)) {
              return callback(new Error(self.__('rules.phone')));
            }
            callback();
          }}
        ],
        email: [
          { required: true, message: this.__('required') },
          { type: 'email', message: this.__('rules.email') }
        ]
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: `${vm.__('userDetail')}(${vm.id})`
      });
    });
  },
  created() {
    this.initData();
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    // init
    initData() {
      let detailOb = this.$hub.flow([{ id: this.id }])
        .use('user.detail');
      let mobileCodeDb = this.$hub.flow([{}])
        .use('com.mobileCodeList');

      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flowAll([
        detailOb,
        mobileCodeDb
      ])
        .subscribe(
          ([detail, codes]) => {
            this.detail = detail;
            this.countriesRegions = codes;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    updateUserInfo() {
      this.$unsubscribe('updateUserInfo');
      this.loading = true;
      this.$subs.updateUserInfo = this.$hub.flow([{ id: this.detail.id }])
        .use('user.detail')
        .subscribe(
          (res) => {
            this.detail = res;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    // tab
    tabClick(tab, event) {
      this.showEditInfo = false;

      if(this.activeTab === 'order') {
        this.queryOrderList();
      }
      if(this.activeTab === 'door') {
        this.getDoorLock();
      }
    },

    // orders
    ordersSizeChange(val) {
      this.orders.count = val;
      this.queryOrderList();
    },
    ordersCurrentChange(val) {
      this.orders.page = val;
      this.queryOrderList();
    },
    searchOrders() {
      this.orders.page = 1;
      this.queryOrderList();
    },
    queryOrderList() {
      let params = {
        productCategory: this.orders.productCategory,
        relation: this.orders.relation,
        page: this.orders.page,
        count: this.orders.count,
        userId: this.detail.id
      }

      this.$unsubscribe('searchOrdersList');
      this.orders.loading = true;
      this.$subs.searchOrdersList = this.$hub.flow([params])
        .use('order.list')
        .subscribe(
          (res) => {
            this.orders.loading = false;
            this.orders.rows = res.rows;
            this.orders.total = res.total;
          },
          (err) => {
            this.orders.loading = false;
            this.$message.error(err.message);
          }
        );
    },

    // 门禁
    getDoorLock() {
      let params = {
        id: Number(this.id),
        page: this.doorlock.page,
        count: this.doorlock.count
      }

      this.$unsubscribe('doorlock');
      this.doorlock.loading = true;
      this.$subs.doorlock = this.$hub.flow([params])
        .use('user.doorlock')
        .subscribe(
          (res) => {
            this.doorlock.loading = false;
            this.doorlock.rows = res;
            this.doorlock.total = res.total;
          },
          (err) => {
            this.doorlock.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    doorLockSizeChange(val) {
      this.doorlock.count = val;
      this.getDoorLock();
    },
    doorLockCurrentChange(val) {
      this.doorlock.page = val;
      this.getDoorLock();
    },

    // 详情
    resetForm() {
      let detail = this.detail;

      this.form = {
        id: detail.id,

        userType: detail.userType || 1,
        nickname: detail.nickname || '',
        realName: detail.realName || '',
        genderEnum: detail.genderEnum || '',

        mobileCode: detail.mobileCode || '',
        mobile: detail.mobile || '',
        email: detail.email || '',
        telephone: detail.telephone || '',
        fax: detail.fax || '',

        company: detail.companyVo || null,
        doorCardNumber: detail.doorCardNumber || '',

        idCardFace: detail.idCardFace || '',
        idCardBack: detail.idCardBack || '',
        pass: detail.pass || '',

        title: detail.title || ''
      };
    },
    filterPhoneCode(val) {
      return this.countriesRegions.filter(item => {
        return item.countryName.indexOf(val) !== -1 
          || item.phoneCode.indexOf(val) !== -1;
      });
    },
    selectCompany() {
      let self = this;
      showChooseCompany({}, {
        ['choose-back'](res) {
          self.form.company = res;
          self.validateField('company');
        }
      });
    },
    editInfo() {
      this.resetForm();
      this.showEditInfo = true;
    },
    validateField(field) {
      this.$refs['form'].validateField(field);
    },
    saveInfo() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        
        let data = copyJson(this.form);
        if (data.company) data.companyId = data.company.id;
        delete data.company;

        this.$unsubscribe('add');
        this.loading = true;
        this.$subs.booking = this.$hub.flow([data])
          .use('user.modify')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.saveSuccess'));
              this.showEditInfo = false;
              this.updateUserInfo();
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    },
    cancelEditInfo() {
      this.showEditInfo = false;
    }
  }
}
</script>
