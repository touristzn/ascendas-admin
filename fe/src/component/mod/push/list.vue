<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      
      <!--发送列表-->
      <div class="sma-collapse">
        <div class="sma-collapse-header">
          
          <dl class="sma-margin-top-10">
            <dt>
              <h3 class="sma-required">{{__('sendList')}}：</h3>
              <span>( <em>{{includeCompanies.length}}</em>{{__('company')}}，<em>{{includeUsers.length}}</em>{{__('user')}} )</span>
            </dt>
            <dd>
              <el-radio-group v-model="includeType">
                <el-radio :label="__('company')">{{__('company')}}</el-radio>
                <el-radio :label="__('user')">{{__('user')}}</el-radio>
              </el-radio-group>
              <el-button type="primary" @click="addIncludeList(includeType)" plain>{{__('add') + includeType}}</el-button>
            </dd>
          </dl>
        </div>

        <div class="sma-collapse-content sma-margin-top-10">
          <el-tabs class="sma-tabs-header-hidden" v-model="includeType">
            <el-tab-pane :name="__('company')">
              <table width="100%">
                <col width="30%" />
                <col width="40%" />
                <col width="30%" />

                <thead>
                  <tr>
                    <th>{{__('company')}}</th>
                    <th>{{__('admin')}}</th>
                    <th>{{__('operation')}}</th>
                  </tr>
                </thead>
                <tbody v-if="includeCompanies.length > 0">
                  <tr v-for="item of includeCompanies">
                    <td>{{item.shortName}}</td>
                    <td>{{item.admin.nickname}}</td>
                    <td>
                      <el-button type="danger" size="mini" @click="delIncludeCompany(item.id)">{{__('btn.del')}}</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-tab-pane>
            <el-tab-pane :name="__('user')">
              <table width="100%">
                <col width="30%" />
                <col width="20%" />
                <col width="20%" />
                <col width="30%" />

                <thead>
                  <tr>
                    <th>{{__('username')}}</th>
                    <th>{{__('mobileNumber')}}</th>
                    <th>{{__('userRoles')}}</th>
                    <th>{{__('operation')}}</th>
                  </tr>
                </thead>
                <tbody v-if="includeUsers.length > 0">
                  <tr v-for="item of includeUsers">
                    <td>{{item.nickname}}</td>
                    <td>{{item.mobile}}</td>
                    <td>{{item.role}}</td>
                    <td>
                      <el-button type="danger" size="mini" @click="delIncludeUser(item.id)">{{__('btn.del')}}</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!--排除列表-->
      <div class="sma-collapse sma-margin-top-50">
        <div class="sma-collapse-header">
          <dl>
            <dt>
              <h3>{{__('excludeList')}}：</h3>
              <span>( <em>{{excludeCompanies.length}}</em>{{__('company')}}，<em>{{excludeUsers.length}}</em>{{__('user')}} )</span>
            </dt>
            <dd>
              <el-radio-group v-model="excludeType">
                <el-radio :label="__('company')">{{__('company')}}</el-radio>
                <el-radio label="用户">用户</el-radio>
              </el-radio-group>
              <el-button type="primary" @click="addExcludeList(excludeType)" plain>{{__('add') + excludeType}}</el-button>
            </dd>
          </dl>
        </div>

        <div class="sma-collapse-content sma-margin-top-10">
          <el-tabs class="sma-tabs-header-hidden" v-model="excludeType">
            <el-tab-pane :name="__('company')">
              <table width="100%">
                <col width="30%" />
                <col width="40%" />
                <col width="30%" />

                <thead>
                  <tr>
                    <th>{{__('company')}}</th>
                    <th>{{__('admin')}}</th>
                    <th>{{__('operation')}}</th>
                  </tr>
                </thead>
                <tbody v-if="excludeCompanies.length > 0">
                  <tr v-for="item of excludeCompanies">
                    <td>{{item.name}}</td>
                    <td>{{item.owner.nickname}}</td>
                    <td>
                      <el-button type="danger" size="mini" @click="delExcludeCompany(item.id)">{{__('btn.del')}}</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-tab-pane>
            <el-tab-pane :name="__('user')">
              <table width="100%">
                <col width="30%" />
                <col width="20%" />
                <col width="20%" />
                <col width="30%" />

                <thead>
                  <tr>
                    <th>{{__('username')}}</th>
                    <th>{{__('mobileNumber')}}</th>
                    <th>{{__('userRoles')}}</th>
                    <th>{{__('operation')}}</th>
                  </tr>
                </thead>
                 <tbody v-if="excludeUsers.length > 0">
                  <tr v-for="item of excludeUsers">
                    <td>{{item.nickname}}</td>
                    <td>{{item.mobile}}</td>
                    <td>{{item.role}}</td>
                    <td>
                      <el-button type="danger" size="mini" @click="delExcludeUser(item.id)">{{__('btn.del')}}</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="sma-collapse sma-margin-top-50">
        <div class="sma-collapse-header msg-tit sma-required">
          推送用例
        </div>
        <div class="sma-collapse-content sma-margin-top-10">
          <el-select v-model="notificationCaseId" placeholder="请选择推送用例" size="medium" @change="caseChange">
            <el-option v-for="item in pushList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </div>
      </div>

      <div class="sma-collapse sma-margin-top-20" v-if="refIdType == 'EVENT_ID'">
        <div class="sma-collapse-header msg-tit sma-required">
          选择活动
        </div>
        <div class="sma-collapse-content sma-margin-top-10">
          <el-tag type="info" size="small" v-if="selEvent">
            {{selEvent.title}}
          </el-tag>

          <el-button type="primary" size="small" @click="selectEvent">
            选择
          </el-button>
        </div>
      </div>

      <div class="sma-collapse sma-margin-top-20" v-if="refIdType == 'BENEFIT_ID'">
        <div class="sma-collapse-header msg-tit sma-required">
          选择福利
        </div>
        <div class="sma-collapse-content sma-margin-top-10">
          <el-tag type="info" size="small" v-if="selBenefit">
            {{selBenefit.benefitsHeadline}}
          </el-tag>

          <el-button type="primary" size="small" @click="selectBenefit">
            选择
          </el-button>
        </div>
      </div>

      <div class="sma-collapse sma-margin-top-20" v-if="refIdType == 'USER_ID'">
        <div class="sma-collapse-header msg-tit sma-required">
          选择用户
        </div>
        <div class="sma-collapse-content sma-margin-top-10">
          <el-tag type="info" size="small" v-if="selUser">
            {{selUser.nickname}}
          </el-tag>

          <el-button type="primary" size="small" @click="selectUser">
            选择
          </el-button>
        </div>
      </div>

      <div class="sma-collapse sma-margin-top-20" v-if="refIdType == 'COMPANY_ID'">
        <div class="sma-collapse-header msg-tit sma-required">
          选择公司
        </div>
        <div class="sma-collapse-content sma-margin-top-10">
          <el-tag type="info" size="small" v-if="selCompany">
            {{selCompany.shortName}}
          </el-tag>

          <el-button type="primary" size="small" @click="selectCompany">
            选择
          </el-button>
        </div>
      </div>

      <div class="sma-collapse sma-margin-top-20" v-if="refIdType == 'FEED_ID'">
        <div class="sma-collapse-header msg-tit sma-required">
          选择动态
        </div>
        <div class="sma-collapse-content sma-margin-top-10">
          <el-tag type="info" size="small" v-if="selFeed">
            {{selFeed.content}}
          </el-tag>

          <el-button type="primary" size="small" @click="selectFeed">
            选择
          </el-button>
        </div>
      </div>

      <!--消息-->
      <div class="sma-message sma-margin-top-20">
        <div class="sma-message-header sma-border-bottom">
          <span class="sma-required">{{__('messageTxt')}}：</span>
        </div>
        <el-form ref="message" class="sma-form-b sma-margin-top-20" :model="message" label-width="150px">
          <el-form-item 
            v-for="lang in langs"
            :key="'message'+lang.key"
            :label="lang.label"
            :prop="lang.key"
            :rules="[{ required: true, message: '不能为空'}]"

          >
            <el-input v-model="message[lang.key]"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="sma-text-r">
        <el-button type="primary" @click="onSend">{{__('btn.send')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {copyJson} from '../../../lib/utils';
import {showChooseCompany} from '../../helper/company';
import {showChooseUser} from '../../helper/user';
import {showChooseEvent} from '../../helper/event';
import {showChooseBenefits} from '../../helper/benefits';
import {showChooseFeed} from '../../helper/feed';

export default {
  name: 'mod-sendmessage-list',
  data() {
    return {
      loading: false,

      includeType: this.__('company'),
      includeCompanies: [],
      includeUsers: [],

      excludeType: this.__('company'),
      excludeCompanies: [],
      excludeUsers: [],

      refIdType: '', // refId 类型： EVENT_ID, USER_ID 等等
      refId: '', // refId 的值
      notificationCaseId: null,
      message: {},

      selEvent: null,
      selBenefit: null,
      selUser: null,
      selCompany: null,
      selFeed: null,

      pushList: [],
    }
  },
  computed: {
    langs() {
      return this.$state.apiLanguages;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '消息推送'
      });
    });
  },
   created() {
    this.refreshMod();
  },
  methods: {
    refreshMod(){
      this.$unsubscribe('pushList');
      this.loading = true;
      this.$subs.pushList = this.$hub.flow([{}])
        .use('pushconf.list')
        .subscribe(
          (res) => {
            this.pushList = res.rows;
            this.loading = false;
          },
          (err) => {
            this.loading = true;
            this.$message.error(err.message);
          }
        );
    },
    caseChange() {
      this.refId = '';
      this.refIdType = '';

      this.$unsubscribe('pushconfDetail');
      this.loading = true;
      this.$subs.pushconfDetail = this.$hub.flow([{
        id: this.notificationCaseId
      }])
        .use('pushconf.detail')
        .subscribe(
          (res) => {
            let refIdType = '';

            try {
              let obj = JSON.parse(res.parameterTemplate);
              refIdType = obj.refId;
            } catch(e) {
              console.log('parameterTemplate error');
            }

            this.refIdType = refIdType;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    selectEvent() {
      let self = this;
      showChooseEvent({
        isMulti: false
      }, {
        ['choose-back'](res) {
          self.selEvent = res;
          self.refId = self.selEvent.eventId;
        }
      });
    },
    selectBenefit() {
      let self = this;
      showChooseBenefits({
        isMulti: false
      }, {
        ['choose-back'](res) {
          self.selBenefit = res;
          self.refId = self.selBenefit.id;
        }
      });
    },
    selectUser() {
      let self = this;
      showChooseUser({
        isMulti: false
      }, {
        ['choose-back'](user) {
          self.selUser = user;
          self.refId = self.selUser.id;
        }
      });
    },
    selectCompany() {
      let self = this;
      showChooseCompany({
        isMulti: false
      }, {
        ['choose-back'](res) {
          self.selCompany = res;
          self.refId = self.selCompany.id;
        }
      });
    },
    selectFeed() {
      let self = this;
      showChooseFeed({
        isMulti: false
      }, {
        ['choose-back'](res) {
          self.selFeed = res;
          self.refId = self.selFeed.id;
        }
      });
    },
    addIncludeList(type) {
      if(type == this.__('company')) {
        let self = this;
        let ids = this.includeCompanies.map(item=>item.id);
        showChooseCompany({
          isMulti: true
        }, {
          ['choose-back'](list) {
            list.forEach(item => {
              if (ids.indexOf(item.id) == -1) {
                self.includeCompanies.push(item);
              }
            });
          }
        });
      }

      if(type == this.__('user')) {
        let self = this;
        let ids = this.includeUsers.map(item=>item.id);
        showChooseUser({
          isMulti: true
        }, {
          ['choose-back'](list) {
            list.forEach(item => {
              if (ids.indexOf(item.id) == -1) {
                self.includeUsers.push(item);
              }
            });
          }
        });
      }
    },
    delIncludeCompany(id) {
      this.includeCompanies = this.includeCompanies.filter(item=>item.id != id);
    },
    delIncludeUser(id) {
      this.includeUsers = this.includeUsers.filter(item=>item.id != id);
    },
    addExcludeList(type) {
      if(type == this.__('company')) {
        let self = this;
        let ids = this.excludeCompanies.map(item=>item.id);
        showChooseCompany({
          isMulti: true
        }, {
          ['choose-back'](list) {
            list.forEach(item => {
              if (ids.indexOf(item.id) == -1) {
                self.excludeCompanies.push(item);
              }
            });
          }
        });
      }

      if(type == this.__('user')) {
        let self = this;
        let ids = this.includeUsers.map(item=>item.id);
        showChooseUser({
          isMulti: true
        }, {
          ['choose-back'](list) {
            list.forEach(item => {
              if (ids.indexOf(item.id) == -1) {
                self.excludeUsers.push(item);
              }
            });
          }
        });
      }
    },
    delExcludeCompany(id) {
      this.excludeCompanies = this.excludeCompanies.filter(item=>item.id != id);
    },
    delExcludeUser(id) {
      this.excludeUsers = this.excludeUsers.filter(item=>item.id != id);
    },
    onSend() {
      if (!this.notificationCaseId) {
        this.$message.error('请选择用例');
        return;
      }

      if (this.refIdType && !this.refId) {
        this.$message.error('请填写所有必填项');
        return;
      }

      if (!this.includeCompanies.length && !this.includeUsers.length) {
        this.$message.error(this.__('message.sendListError'));
        return;
      }

      let messageArr = Object.values(this.message);
      if(messageArr.length < this.langs.length) {
        this.$message.error(this.__('message.sendMessageError'));
        return;
      }

      let params = {};
      params.notificationCaseId = this.notificationCaseId;
      params.includeCompanies = this.includeCompanies.map(item=>item.id);
      params.includeUsers = this.includeUsers.map(item=>item.id);
      params.excludeCompanies = this.excludeCompanies.map(item=>item.id);
      params.excludeUsers = this.excludeUsers.map(item=>item.id);
      params.content = this.message;

      if (this.refId) {
        params.parameter = {
          refId: this.refId
        };
      } 

      this.$unsubscribe('batchsend');
      this.$subs.batchsend = this.$hub.flow([params])
        .use('push.batchnotify')
        .subscribe(
          (res) => {
            this.$message.success(this.__('message.sendSuccess'));
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
.msg-tit {
  font-size: 20px;
}
</style>


