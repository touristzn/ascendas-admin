<template>
  <el-dialog title="重置密码"
    :visible.sync="visible"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">

    <el-form :model="form" status-icon ref="form" :rules="rules" label-width="100px" :disabled="loading">
      <el-form-item label="密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="primary" @click="onSubmit">{{__('btn.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { copyJson } from "../../../lib/utils";

export default {
  name: 'com-staff-reset',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.confirmPassword !== '') {
            this.$refs.form.validateField('confirmPassword');
          }
          callback();
        }
      };

    let validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      userType: 2,

      form:{
        userId: this.id,
        newPassword: '',
        confirmPassword: ''
      },

      rules: {
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        
        let data = copyJson(this.form);
        this.$unsubscribe('reset');
        this.loading = true;
        this.$subs.reset = this.$hub.flow([data])
          .use('user.reset')
          .subscribe(
            (res) => {
              this.loading = false;
              this.visible = false;
              this.$message.success(this.__('message.editSuccess'));
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
