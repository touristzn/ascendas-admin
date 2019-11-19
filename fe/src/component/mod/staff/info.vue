<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box" v-loading="loading">

      <div class="sma-detail-a" v-if="detail && !showEditInfo">
        <div class="sma-tab-info">
          <div class="content">
            <dl>
              <dt>{{__('staffId')}}：</dt>
              <dd>{{detail.id}}</dd>
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
              <dt>{{__('genderEnum')}}：</dt>
              <dd>{{detail.genderEnum | enumText(enums, 'gender')}}</dd>
            </dl>

            <dl>
              <dt>{{__('email')}}：</dt>
              <dd>{{detail.email}}</dd>
            </dl>

            <dl>
              <dt>角色：</dt>
              <dd>{{detail.role ? detail.role.name : ''}}</dd>
            </dl>

            <dl>
              <dt>{{__('jobTitle')}}：</dt>
              <dd>{{detail.title}}</dd>
            </dl>

            <dl>
              <dt>{{__('createdAt')}}：</dt>
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

            <el-form-item :label="__('mobileNumber')" required prop="mobile">
                <div class="sma-w420">
                  <div class="sma-col sma-col-6">
                  <el-select filterable v-model="form.mobileCode" :placeholder="__('mobileCode')">
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
                  <el-input v-model="form.mobile" :placeholder="__('mobileNumber')"></el-input>
                </div>
              </div>
            </el-form-item>

            <el-form-item :label="__('nickname')" prop="nickname">
              <el-input v-model="form.nickname" :placeholder="__('nickname')"></el-input>
            </el-form-item>

            <el-form-item :label="__('realName')" prop="realName">
              <el-input v-model="form.realName" :placeholder="__('realName')"></el-input>
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

            <el-form-item label="角色" prop="role">
              <el-input @click.native="selectRole" :value="form.role ? form.role.name : ''" readonly placeholder="请选择">
                <el-button slot="append" icon="el-icon-close" @click.stop="removeRole"></el-button>
              </el-input>
            </el-form-item>

            <el-form-item :label="__('jobTitle')" prop="title">
              <el-input v-model="form.title" :placeholder="__('jobTitle')"></el-input>
            </el-form-item>

          </el-form>

          <div class="f-button">
            <el-button size="mini" type="primary" @click="saveInfo">{{__('btn.save')}}</el-button>
            <el-button size="mini" @click="cancelEditInfo">{{__('btn.cancel')}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { copyJson } from "../../../lib/utils";
import { showChooseRole } from '../../helper/role'

export default {
  name: 'mod-user-detail',
  props: ['id'],
  data() {
    let self = this;

    return {
      loading: false,

      countriesRegions: [],

      //用户信息
      form: null,
      detail: null,
      showEditInfo: false,
      
      rules: {
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
        title: `${vm.__('staffDetail')}(${vm.id})`
      });
      vm.refreshMod();
    });
  },
  created() {
    //
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    // init
    refreshMod() {
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

    // 详情
    resetForm() {
      let detail = this.detail;

      this.form = {
        id: detail.id,
        userType: detail.userType || 2,
        nickname: detail.nickname,
        realName: detail.realName,
        genderEnum: detail.genderEnum || '',
        mobileCode: detail.mobileCode || '',
        mobile: detail.mobile || '',
        title: detail.title,
        role: detail.role || null
      };
    },
    filterPhoneCode(val) {
      return this.countriesRegions.filter(item => {
        return item.countryName.indexOf(val) !== -1 
          || item.phoneCode.indexOf(val) !== -1;
      });
    },
    selectRole() {
      console.log('selectRole')
      let self = this;
      showChooseRole({}, {
        ['choose-back'](data) {
          self.form.role = data;
        }
      });
    },
    removeRole() {
      this.form.role = null;
    },
    editInfo() {
      this.resetForm();
      this.showEditInfo = true;
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

        if (data.role) data.roleId = data.role.id;
        delete data.role;

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
