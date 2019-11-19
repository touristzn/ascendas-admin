<template>
  <el-dialog title="添加用户"
    :visible.sync="visible"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" :disabled="loading">

      <el-form-item :label="__('mobileNumber')" required prop="mobile">
        <el-col :span="8" class="sma-margin-r-5">
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
        </el-col>
        <el-col :span="11">
          <el-input v-model="form.mobile" :placeholder="__('mobileNumber')"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item :label="__('nickname')" prop="nickname">
        <el-input v-model="form.nickname" :placeholder="__('nickname')"></el-input>
      </el-form-item>

      <el-form-item :label="__('realName')" prop="realName">
        <el-input v-model="form.realName" :placeholder="__('realName')"></el-input>
      </el-form-item>

      <el-form-item :label="__('company')" prop="company">
        <el-tag type="info" size="mini" v-if="form.company">
          {{ form.company.shortName }}
        </el-tag>
        <el-button type="primary" size="mini" @click="selectCompany">
          {{__('btn.selectCompany')}}
        </el-button>
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

      <!-- 会员 -->
      <el-form-item label="座机" prop="telephone">
        <el-input v-model="form.telephone" placeholder="座机"></el-input>
      </el-form-item>

      <el-form-item label="传真" prop="fax">
        <el-input v-model="form.fax" placeholder="传真"></el-input>
      </el-form-item>

      <el-form-item label="门禁卡" prop="doorCardNumber">
        <el-input v-model="form.doorCardNumber" placeholder="门禁卡"></el-input>
      </el-form-item>

      <el-form-item label="身份证正面" prop="idCardFace">
        <img-box water="water" :edit="true" v-model="form.idCardFace"></img-box>
      </el-form-item>

      <el-form-item label="身份证反面" prop="idCardBack">
        <img-box water="water" :edit="true" v-model="form.idCardBack"></img-box>
      </el-form-item>

      <el-form-item label="护照" prop="pass">
        <img-box water="water" :edit="true" v-model="form.pass"></img-box>
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
        userType: 1,

        // username: '',
        nickname: '',
        realName: '',

        genderEnum: '',

        mobileCode: '86',
        mobile: '',
        email: '',
        telephone: '',
        fax: '',

        company: null,
        doorCardNumber: '',

        idCardFace: '',
        idCardBack: '',
        pass: '',

        title: ''
      },
      rules: {
        userType: [
          { required: true, message: this.__('required') }
        ],
        username: [
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
    selectCompany() {
      let self = this;
      showChooseCompany({}, {
        ['choose-back'](res) {
          self.form.company = res;
          self.validateField('company');
        }
      });
    },
    validateField(field) {
      this.$refs['form'].validateField(field);
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
