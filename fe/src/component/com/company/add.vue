<template>
  <el-dialog
    :title="__('addCompany')"
    :visible.sync="visible"
    width="700px"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">

    <el-form class="sma-form-a" :model="form" :rules="rules" ref="form">
      <el-form-item :label="__('shortName.company') + '：'" prop="shortName">
        <el-input v-model="form.shortName" :placeholder="__('shortName.company')"></el-input>
      </el-form-item>

      <el-form-item :label="__('registeredName.company') + '：'" prop="registeredName">
        <el-input v-model="form.registeredName" :placeholder="__('registeredName.company')"></el-input>
      </el-form-item>

      <dl>
        <dt class="sma-label-required">
          <label class="el-form-item__label">{{__('admin')}}：</label>
          <el-button type="primary" size="mini" plain @click="addAdmin">新增管理员</el-button>
        </dt>
        <dd>
          <span @click="chooseAdmin">
            <el-input :value="adminName" :placeholder="__('admin')"></el-input>
          </span>
        </dd>
      </dl>

      <el-form-item :label="__('linkman') + '：'" class="sma-label-required">
        <span @click="chooseContact">
          <el-input :value="contactName" :placeholder="__('linkman')"></el-input>
        </span>
      </el-form-item>

      <el-form-item :label="__('email') + '：'" prop="email">
        <el-input v-model="form.email" :placeholder="__('email')"></el-input>
      </el-form-item>

      <el-form-item :label="__('phone') + '：'" prop="telephone">
        <el-input v-model="form.telephone" :placeholder="__('phone')"></el-input>
      </el-form-item>

      <el-form-item :label="__('industry') + '：'" v-if="industryOptions">
        <el-cascader class="sma-w"
          :options="industryOptions"
        ></el-cascader>
      </el-form-item>

      <el-form-item :label="__('personCount') + '：'" prop="personCount">
        <el-input v-model="form.personCount"></el-input>
      </el-form-item>

      <el-form-item label="Logo：">
        <img-box water="water" :edit="true" v-model="form.logo"></img-box>
      </el-form-item>

      <el-form-item :label="__('licence') + '：'">
        <img-box water="water" :edit="true" v-model="form.licence"></img-box>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSave">{{__('btn.save')}}</el-button>
    </span>

  </el-dialog>
</template>

<script>
import $ from 'jquery';
import ImgBox from "../form/img";
import {showAddUser, showChooseUser} from '../../helper/user';

export default {
  name: 'com-user-add',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ImgBox
  },
  data() {
    return {
      industryOptions: null,
      adminName: '',
      contactName: '',
      form: {
        shortName: '',
        registeredName: '',
        industry: '',
        adminId: '',
        contactId: '',
        email: '',
        telephone: '',
        personCount: 0,
        logo: '',
        licence: ''
      },
      rules: {
        shortName: [
          { required: true, message: this.__('required') }
        ],
        registeredName: [
          { required: true, message: this.__('required') }
        ],
        email: [
          { required: true, message: this.__('required') },
          { type: 'email', message: this.__('rules.email') }
        ],
        telephone: [
          { pattern: /^[0-9]*$/, message: this.__('rules.phone') }
        ],
        personCount: [
          { pattern: /^[0-9]*$/, message: this.__('rules.personCount') }
        ]
      }
    }
  },
  created() {
    this.getIndustryOptions();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSave() {
      if (!this.form.shortName || !this.form.registeredName || !this.form.email || !this.form.adminId || !this.form.contactId) {
        this.$message.error(this.__('form.error'));
        return;
      }

      this.form.industry = $('.el-cascader__label').text().replace(/[\r\n\ +]/g,"");

      this.$unsubscribe('create');
      this.$subs.create = this.$hub.flow([this.form])
        .use('company.create')
        .subscribe(
          (res) => {
            this.visible = false;
            this.$message.success(this.__('message.addSuccess'));
            this.$emit('add-back', res);
          },
          (error) => {
            this.$message.error(error.message);
          }
        );
    },
    chooseAdmin() {
      let _this = this;
      showChooseUser({ userType: 1 }, {
        ['choose-back'](data) {
          _this.form.adminId = data.id;
          _this.adminName = data.nickname;
        }
      });
    },
    chooseContact() {
      let _this = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          _this.form.contactId = data.id;
          _this.contactName = data.nickname;
        }
      });
    },
    addAdmin() {
      let _this = this;
      showAddUser({ userType: 1 }, {
        ['add-back'](data) {
          _this.form.adminId = data.id;
          _this.adminName = data.nickname;
        }
      });
    },
    getIndustryOptions() {
      let params = {};
      this.$unsubscribe('industry');
      this.$subs.industry = this.$hub.flow([params])
        .use('industry.list')
        .subscribe(
          (res) => {
            this.industryOptions = res.map((item) => {
              return {
                label: item.name,
                value: item.id,
                children: item.industries.map((val) => {
                  return {
                    label: val.name,
                    value: val.id
                  }
                })
              }
            });
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>
