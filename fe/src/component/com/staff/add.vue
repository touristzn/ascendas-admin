<template>
  <el-dialog title="添加员工"
    :visible.sync="visible"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">

    <el-form :model="form" :rules="rules" ref="form" label-width="100px" :disabled="loading">
      
      <el-form-item :label="__('mobileNumber')" required prop="mobile">
        <dl class="sma-display-flex">
          <dt>
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
          </dt>
          <dd>
            <el-input v-model="form.mobile" :placeholder="__('mobileNumber')"></el-input>
          </dd>
        </dl>
      </el-form-item>

      <el-form-item :label="__('nickname')" prop="nickname">
        <el-input v-model="form.nickname" :placeholder="__('nickname')"></el-input>
      </el-form-item>

      <el-form-item :label="__('realName')" prop="realName">
        <el-input v-model="form.realName" :placeholder="__('realName')"></el-input>
      </el-form-item>

      <el-form-item :label="__('email')" prop="email" >
        <el-input v-model="form.email" :placeholder="__('email')"></el-input>
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

    <div slot="footer" class="dialog-footer" v-loading="loading">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="primary" @click="onSave">{{__('btn.save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImgBox from "../../com/form/img";
import { copyJson } from "../../../lib/utils";
import { showChooseCompany } from "../../helper/company";
import { showChooseRole } from '../../helper/role'

export default {
  name: 'com-user-add',
  components: {
    ImgBox
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let self = this;

    return {
      loading: false,

      countriesRegions: [],
      form:{
        userType: 2,

        nickname: '',
        realName: '',
        genderEnum: '',

        mobileCode: '86',
        mobile: '',
        email: '',

        role: null
      },
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
  computed:{
    enums() {
      return this.$state.enums.all;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flow([{}])
        .use('com.mobileCodeList')
        .subscribe(
          (res) => {
            this.loading = false;
            this.countriesRegions = res;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
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
    onClose() {
      this.$emit('close');
    },
    onSave() {
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
          .use('user.add')
          .subscribe(
            (res) => {
              this.loading = false;
              this.visible = false;
              this.$message.success(this.__('message.addSuccess'));
              this.$emit('add-back', res);
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    }
  }
}
</script>
