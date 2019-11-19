<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card">
      <!--发送列表-->
      <div class="sma-collapse">
        <div class="sma-collapse-header">
          <dl>
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
                    <td>{{item.shortName || item.registeredName}}</td>
                    <td>{{item.admin ? item.admin.nickname : ''}}</td>
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
                <el-radio :label="__('user')">{{__('user')}}</el-radio>
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
                    <td>{{item.shortName || item.registeredName}}</td>
                    <td>{{item.admin ? item.admin.nickname : ''}}</td>
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

      <!--消息-->
      <div class="sma-message">
        <div class="sma-message-header sma-border-bottom sma-margin-top-50">
          <span class="sma-required">{{__('messageTxt')}}：</span>
        </div>
        <el-form ref="message" class="sma-form-b sma-margin-top-20" :model="message" label-width="150px">
          <el-form-item 
            v-for="lang in langs"
            :key="lang.key"
            :label="lang.label"
            :prop="lang.key"
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

export default {
  name: 'mod-sendmessage-list',
  data() {
    return {
      includeType: this.__('company'),
      includeCompanies: [],
      includeUsers: [],

      excludeType: this.__('company'),
      excludeCompanies: [],
      excludeUsers: [],

      message: {}
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
        title: vm.__('sendList')
      });
    });
  },
  methods: {
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
      params.includeCompanies = this.includeCompanies.map(item=>item.id);
      params.includeUsers = this.includeUsers.map(item=>item.id);
      params.excludeCompanies = this.excludeCompanies.map(item=>item.id);
      params.excludeUsers = this.excludeUsers.map(item=>item.id);
      params.content = this.message;

      this.$unsubscribe('batchsend');
      this.$subs.batchsend = this.$hub.flow([params])
        .use('msg.send')
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



