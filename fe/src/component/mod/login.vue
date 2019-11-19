<template>
  <div class="mod mod-login">
    <div class="panel">
      <div class="title">Ascendas Admin</div>
    </div>
    <div class="panel">
      <el-card class="login-card" v-loading="loading">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="手机号登录" name="mobile">
            <el-form 
              class="login-form" 
              :model="mobileForm" 
              ref="mobileForm" 
            >
              <el-form-item
                prop="mobile"
                :rules="[
                  { required: true, message: '请输入手机号'}
                ]"
              >
                <el-input type="text" v-model.trim="mobileForm.mobile" auto-complete="off" :placeholder="__('mobileNumber')">
                  <el-select class="mobile-code" slot="prepend" filterable v-model="mobileForm.mobileCode" :placeholder="__('mobileCode')">
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
                </el-input>
              </el-form-item>

              <el-form-item
                prop="validCode"
                :rules="[
                  { required: true, message: '请输入验证码'}
                ]"
              >
                <el-input type="text" v-model.trim="mobileForm.validCode" auto-complete="off" placeholder="验证码">
                  <el-button  class="vcode-btn" type="primary" v-if="!mobileForm.seconds" slot="prepend" @click="sendValidCode">
                    发送
                  </el-button>
                  <span class="vcode" v-if="mobileForm.seconds" slot="prepend">
                    {{mobileForm.seconds}}s
                  </span>
                </el-input>
              </el-form-item>

              <el-form-item style="margin: 30px 0 0 0;">
                <el-button 
                  type="primary" 
                  size="medium" 
                  @click="submitMobileForm('form')"
                >提交</el-button>
                <el-button size="medium" @click="resetForm('mobileForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码登录" name="pass">
            <el-form 
              class="login-form" 
              :model="form" 
              ref="form" 
            >
              <el-form-item
                prop="username"
                :rules="[
                  { required: true, message: '用户名不能为空', transform: tfTrim}
                ]"
              >
                <el-input type="text" v-model="form.username" auto-complete="off" :placeholder="__('username')"></el-input>
              </el-form-item>

              <el-form-item
                prop="password"
                :rules="[
                  { required: true, message: '密码不能为空', transform: tfTrim}
                ]"
              >
                <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
              </el-form-item>

              <el-form-item style="margin: 30px 0 0 0;">
                <el-button 
                  type="primary" 
                  size="medium" 
                  @click="submitForm('form')"
                >提交</el-button>
                <el-button size="medium" @click="resetForm('form')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'mobile',
      loading: false,

      countriesRegions: [],

      mobileForm: {
        mobile: '13524838094',
        mobileCode: '86',
        validCode: '',
        seconds: 0
      },

      form: {
        username: '13524838094',
        password: '12345678'
      }
    }
  },
  mounted() {
    if (this.$state.loginUser) {
      let path = this.$route.path;
      this.$router.replace('/home', () => {
        this.$root.$nextTick(() => {
          this.$root.closeMod(path);
        });
      });
      return;
    }

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
    sendValidCode() {
      if (!this.mobileForm.mobile) {
        this.$message.error(this.__('form.error'));
        return;
      }

      this.$unsubscribe('sendValidCode');
      this.loading = true;
      this.$subs.sendValidCode = this.$hub.flow([{
        mobileCode: this.mobileForm.mobileCode,
        mobile: this.mobileForm.mobile,
      }])
        .use('user.sendValidCode')
        .subscribe(
          (rst) => {
            this.loading = false;
            this.$message.success(this.__('message.sendSuccess'));
            this.startCountDown();
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    startCountDown() {
      clearInterval(this.countDownTimer);
      this.mobileForm.seconds = 60;
      this.countDownTimer = setInterval(() => {
        this.mobileForm.seconds --;
        if (this.mobileForm.seconds == 0) {
          clearInterval(this.countDownTimer);
        }
      }, 1000);
    },
    submitMobileForm(formName) {
      this.$refs['mobileForm'].validate((valid) => {
        if (!valid) {
          console.log('error submit!!');
          return false;
        }

        this.$unsubscribe('login');
        this.loading = true;
        this.$subs.login = this.$hub.flow([{
          mobileCode: this.mobileForm.mobileCode,
          mobile: this.mobileForm.mobile,
          validCode: this.mobileForm.validCode,
          loginType: 1
        }])
          .use('user.login')
          .subscribe(
            (rst) => {
              this.loading = false;
              this.$store.commit('setLoginUser', rst);

              let path = this.$route.path;
              this.$router.replace('/home', () => {
                this.$root.$nextTick(() => {
                  this.$root.closeMod(path);
                });
              });
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.log('error submit!!');
          return false;
        }

        this.$unsubscribe('login');
        this.loading = true;
        this.$subs.login = this.$hub.flow([{
          passport: this.form.username.trim(),
          password: this.form.password.trim(),
          loginType: 2
        }])
          .use('user.login')
          .subscribe(
            (rst) => {
              this.loading = false;
              this.$store.commit('setLoginUser', rst);

              let path = this.$route.path;
              this.$router.replace('/home', () => {
                this.$root.$nextTick(() => {
                  this.$root.closeMod(path);
                });
              });
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-login {
  background: url('../../asset/image/login-bg.jpeg');
  background-size: cover;
  flex: 1;
  display: flex;
  align-items: stretch;

  /deep/ .el-input-group__prepend {
    background: none;
  }

  .panel {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 50px;
    color: #fff;
  }

  .login-card {
    height: auto;
    border-radius: 4px;
  }

  .login-form {
    width: 300px;
    background: #fff; 
    padding: 12px;
  }

  .mobile-code {
    width: 85px;
  }

  .vcode-btn {
    width: 85px;
    color: #409EFF;
  }

  .vcode {
    width: 85px;
    display: block;
    margin: -10px -20px;
    text-align: center;
  }
}
</style>
