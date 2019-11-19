<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box">

      <el-tabs v-model="activeTab" @tab-click="tabClick" v-loading="loading">
        <el-tab-pane :label="__('companyInfo')" name="first">
          <div class="sma-detail-a" v-if="detail && !showEditInfo">
            <div class="sma-tab-info">
              <div class="content">
                <dl>
                  <dt>身份码：</dt>
                  <dd>{{detail.idCode ? detail.idCode.code : ''}}</dd>
                </dl>
                <dl>
                  <dt>创建时间：</dt>
                  <dd>{{moment(detail.createTime)}}</dd>
                </dl>
                <dl>
                  <dt>公司简称：</dt>
                  <dd>{{detail.shortName}}</dd>
                </dl>
                <dl>
                  <dt>公司注册名：</dt>
                  <dd>{{detail.registeredName}}</dd>
                </dl>
                <dl>
                  <dt>邮箱：</dt>
                  <dd>{{detail.email}}</dd>
                </dl>
                <dl>
                  <dt>电话：</dt>
                  <dd>{{detail.telephone}}</dd>
                </dl>
                <dl>
                  <dt>管理员：</dt>
                  <dd>{{detail.admin ? detail.admin.nickname || detail.admin.username : ''}}</dd>
                </dl>
                <dl>
                  <dt>联系人：</dt>
                  <dd>{{detail.contact ? detail.contact.nickname || detail.contact.username : ''}}</dd>
                </dl>
                <dl>
                  <dt>公司人数：</dt>
                  <dd>{{detail.personCount}}</dd>
                </dl>
                <dl>
                  <dt>Logo：</dt>
                  <dd>
                    <img :src="detail.logo" alt="" width="150" />
                  </dd>
                </dl>
                <dl>
                  <dt>公司营业执照：</dt>
                  <dd>
                    <img :src="detail.licence" alt="" width="150" />
                  </dd>
                </dl>
              </div>
            </div>

            <div class="f-button">
              <el-button
                size="mini"
                type="primary"
                @click="editInfo()"
                v-if="!showEditInfo">{{__('btn.edit')}}</el-button>
            </div>
          </div>

          <!--修改公司信息-->
          <div class="sma-detail-a" v-if="form && showEditInfo">
            <div class="sma-tab-info">
              <el-form :model="form" :rules="rules" ref="form" label-width="auto" class="content">
                <el-form-item label="公司简称：" prop="shortName">
                  <el-input v-model="form.shortName"></el-input>
                </el-form-item>
                <el-form-item label="公司注册名：" prop="registeredName">
                  <el-input v-model="form.registeredName"></el-input>
                </el-form-item>
                <el-form-item :label="__('email') + '：'" prop="email">
                  <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="telephone">
                  <el-input v-model.number="form.telephone"></el-input>
                </el-form-item>
                <el-form-item :label="__('admin') + '：'" class="sma-label-required">
                  <span @click="chooseAdmin">
                    <el-input v-model="adminName"></el-input>
                  </span>
                </el-form-item>
                <el-form-item label="联系人：" class="sma-label-required">
                  <span @click="chooseContact">
                    <el-input v-model="contactName"></el-input>
                  </span>
                </el-form-item>
                <el-form-item label="公司人数：" prop="personCount">
                  <el-input v-model.number="form.personCount"></el-input>
                </el-form-item>
                <el-form-item label="Logo：" prop="logo">
                  <img-box water="water" :edit="true" v-model="form.logo"></img-box>
                </el-form-item>
                <el-form-item label="公司营业执照：" prop="businessScope">
                  <img-box water="water" :edit="true" v-model="form.licence"></img-box>
                </el-form-item>
              </el-form>
            </div>

            <div class="f-button">
              <el-button
                size="mini"
                type="primary"
                @click="updateInfo">{{__('btn.save')}}</el-button>
              <el-button
                size="mini"
                @click="cancelEditInfo">{{__('btn.cancel')}}</el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="__('companyMember')" name="second">
          <div class="sma-detail-a">
            <div class="sma-tab-info">
              <!--公司管理-->
              <div class="section" v-if="detail && detail.admin">
                <h3 class="sma-margin-top-10">{{__('companyAdmin')}}</h3>
                <el-table
                  class="sma-margin-top-10"
                  :data="[detail.admin]"
                  border
                  :fit="true"
                >
                  <el-table-column
                    prop="nickname"
                    :label="__('nickname')"
                    fixed
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="mobile"
                    :label="__('mobileNumber')"
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="identityNumber"
                    :label="__('identityNumber')"
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    :label="__('jobTitle')"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    :label="__('operation')"
                    min-width="150">
                    <template slot-scope="scope">
                      <el-button size="mini" plain
                        :type="scope.row.isValid == 0 ? 'success' : 'danger'"
                        @click="disabled(scope.row)"
                      >
                        {{scope.row.isValid == 0 ? __('enabled') : __('disabled')}}
                      </el-button>
                        
                      <router-link :to="{ path: '/user/info/'+scope.row.id}">
                        <el-button size="mini" type="primary" plain>{{__('btn.detail')}}</el-button>
                      </router-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              
              <!--公司成员-->
              <div class="section" v-if="detail && detail.members.length > 0">
                <h3 class="sma-margin-top-10">{{__('companyMember')}}</h3>
                <el-table
                  class="sma-margin-top-10"
                  :data="detail.members"
                  border
                  :fit="true"
                >
                  <el-table-column
                    prop="nickname"
                    :label="__('nickname')"
                    fixed
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="mobile"
                    :label="__('mobileNumber')"
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="identityNumber"
                    :label="__('identityNumber')"
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    :label="__('jobTitle')"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    :label="__('operation')"
                    min-width="150">
                    <template slot-scope="scope">
                      <el-button size="mini" plain
                        :type="scope.row.isValid == 0 ? 'success' : 'danger'"
                        @click="disabled(scope.row)"
                      >
                        {{scope.row.isValid == 0 ? __('enabled') : __('disabled')}}
                      </el-button>
                        
                      <router-link :to="{ path: '/user/info/'+scope.row.id}">
                        <el-button size="mini" type="primary" plain>{{__('btn.detail')}}</el-button>
                      </router-link>

                      <el-button size="mini" type="danger" plain
                        @click="removeMember(scope.row)"
                      >{{__('btn.remove')}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="__('companyOrder')" name="third">
          <div class="sma-tab-info">
            <!--搜索-->
            <el-form :inline="true" size="mini" class="sma-form-search sma-margin-top-10" @submit.prevent="searchOrder">
              <el-form-item :label="__('productCategory')">
                <el-select v-model="order.productCategory" :placeholder="__('all')">
                  <el-option
                    v-for="item in enums.category"
                    :key="item[0]"
                    :label="item[1]"
                    :value="item[0]">
                  </el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item>
                <el-button @click="searchOrder" type="primary">{{__('btn.search')}}</el-button>
              </el-form-item>
            </el-form>

            <!--订单列表-->
            <div class="sma-order-list sma-margin-top-20 sma-pd-15" v-if="order.rows">
              <order-list :data="order.rows" @update-list="getOrderList"
              ></order-list>

              <!--分页-->
              <div class="sma-margin-top-20 sma-text-c" v-if="order.rows.length > order.count">
                <el-pagination
                  @size-change="orderSizeChange"
                  @current-change="orderCurrentChange"
                  :current-page="order.page"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :page-size="order.count"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="order.total">  
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- <el-tab-pane :label="__('entranceGuard')" name="five">
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">  
              </el-pagination>
            </div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {showChooseUser} from '../../helper/user';
import OrderList from '../../com/order/list';
import {copyJson} from '../../../lib/utils';
import ImgBox from "../../com/form/img";

export default {
  name: 'mod-company-detail',
  props: ['id'],
  components: {
    ImgBox,
    OrderList
  },
  data() {
    return {
      activeTab: 'first',
      loading: true,
      detail: null,

      form: null,
      adminName: null,
      contactName: null,
      showEditInfo: false,
      rules: {
        shortName: [
          {required: true, message: this.__('required'), trigger: 'change'}
        ],
        registeredName: [
          {required: true, message: this.__('required'), trigger: 'change'}
        ],
        email: [
          {required: true, message: this.__('required')},
          {type: 'email', message: this.__('rules.email')}
        ],
        telephone: [
          {type: 'number', message: this.__('rules.phone')}
        ],
        personCount: [
          {type: 'number', message: this.__('rules.personCount')}
        ]
      },
      
      order: {
        productCategory: null,
        page: 1,
        count: 20,
        total: 0,
        rows: null
      },

      entranceGuard: {
        rows: null,
        page: 1,
        count: 20
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: vm.__('companyDetail')
      });
    });
  },
  created() {
    this.refreshMod();
  },
  computed:{
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    refreshMod() {
      this.initData();
    },
    moment(time) {
      return moment(time).format('YYYY-MM-DD');
    },
    tabClick(tab, event) {
      this.showEditInfo = false;

      if(tab.label === this.__('companyMember')) {
        this.loading = true;
        this.searchOrder();
      }
      // if(tab.label === '门禁权限') {
      //   this.getEntranceGuard();
      // }
    },

    //公司信息
    editInfo() {
      this.resetForm();
      this.showEditInfo = true;
    },
    updateInfo() {
      if (!this.form.shortName || !this.form.registeredName || !this.form.email || !this.form.adminId || !this.form.contactId) {
        this.$message.error(this.__('form.error'));
        return false;
      }

      const params = {
        id: parseInt(this.id),
        shortName: this.form.shortName.trim(),
        registeredName: this.form.registeredName.trim(),
        email: this.form.email,
        telephone: this.form.telephone,
        adminId: this.form.adminId,
        contactId: this.form.contactId,
        personCount: this.form.personCount,
        logo: this.form.logo,
        licence: this.form.licence
      };
      this.$unsubscribe('updateInfo');
      this.$subs.updateInfo = this.$hub.flow([params])
        .use('company.update')
        .subscribe(
          (res) => {
            this.initData();
            this.showEditInfo = false;
            this.$message.success(this.__('message.editSuccess'));
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },
    cancelEditInfo() {
      this.showEditInfo = false;
    },
    chooseAdmin() {
      const _this = this;
      showChooseUser({ userType: 1 }, {
        ['choose-back'](data) {
          _this.form.adminId = data.id;
          _this.adminName = data.nickname || data.username;
        }
      });
    },
    chooseContact() {
      const _this = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          _this.form.contactId = data.id;
          _this.contactName = data.nickname || data.username;
        }
      });
    },
    resetForm() {
      this.form = {
        shortName: this.detail.shortName,
        registeredName: this.detail.registeredName,
        email: this.detail.email,
        telephone: this.detail.telephone,
        adminId: this.detail.admin ? this.detail.admin.id : '',
        contactId: this.detail.contact ? this.detail.contact.id : '',
        personCount: this.detail.personCount,
        logo: this.detail.logo,
        licence: this.detail.licence
      }
    },

    //公司成员
    disabled(item) {
      this.$confirm(this.__('edit.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出成功的提示
        let params = {
          id: item.id,
          isValid: item.isValid == 0 ? 1 : 0
        }
        let data = copyJson(params);
        this.$unsubscribe('valid');
        this.$subs.valid = this.$hub.flow([data])
          .use('user.modify')
          .subscribe(
            (res) => {
              this.initData();
              this.$message.success(this.__('message.editSuccess'));
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      });
    },
    removeMember(item) {
      let params = copyJson({
        companyId: item.companyId,
        memberId: item.id
      })
      this.$unsubscribe('removeMember');
      this.$subs.removeMember = this.$hub.flow([params])
        .use('company.removeMember')
        .subscribe(
          (res) => {
            this.initData();
            this.$message.success('移除成功！');
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },

    //公司订单
    searchOrder() {
      this.page = 1;
      this.getOrderList();
    },
    getOrderList() {
      const params = {
        page: this.order.page,
        count: this.order.count,
        productCategory: this.order.productCategory,
        companyId: this.detail.id
      };

      this.$unsubscribe('orderList');
      this.$subs.orderList = this.$hub.flow([params])
        .use('order.list')
        .subscribe(
          (res) => {
            this.loading = false;
            this.order.rows = res.rows;
            this.total = res.total;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    orderSizeChange(val) {
      this.pageSize = val;
      this.getOrderList();
    },
    orderCurrentChange(val) {
      this.page = val;
      this.getOrderList();
    },

    //门禁
    // getEntranceGuard() {
    //   this.loading = false;
    // },
    
    //详情
    initData() {
      this.$unsubscribe('companyDetail');
      this.$subs.companyDetail = this.$hub.flow([{id: this.id}])
        .use('company.detail')
        .subscribe(
          (res) => {
            this.detail = res;
            this.loading = false;
            this.contactName = res.contact !== null ? res.contact.nickname || res.contact.username : '';
            this.adminName =  res.admin !== null ? res.admin.nickname || res.admin.username : '';
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
