<template>
  <div class="app">
    <div class="loading" v-show="loading">
      <vue-loading type="spiningDubbles" color="#409eff" :size="{ width: '30px', height: '30px' }"></vue-loading>
    </div>

    <el-form  v-if="!showTip" :model="form" :rules="rules" ref="form" :label-position="labelPosition" label-width="80px" :disabled="loading">
      <el-form-item label="姓名" prop="userName">
        <el-input  v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model.number="form.mobile"></el-input>
      </el-form-item>
      <el-form-item :label="__('selectDate')" prop="visitTime">
        <el-date-picker
          class="timepicker"
          v-model="form.visitTime"
          type="datetime"
          :placeholder="__('selectDate')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="__('spaceType')" prop="spaceType">
        <el-select v-model="form.spaceType" placeholder="请选择活动区域">
          <el-option label="移动工位" value="HD"></el-option>
          <el-option label="私有工位" value="PO"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="空间地点" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item :label="__('remark')" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <!-- <el-form-item >
        <h3>友情提示：</h3>
        <p>离会议开始时间少于两小时，将不再允许你取消或者修改。</p>
      </el-form-item> -->
      <el-form-item >
        <el-button type="primary" plain  @click="submit(form)">确定预定</el-button>
      </el-form-item>
    </el-form>

    
    <el-main v-if="showTip" class="showtip">
      <i class="el-icon-success"></i> 预定成功
    </el-main>
      
    
  </div>
</template>

<script>
import VueLoading from 'vue-loading-template'

export default {
  components: {
    VueLoading,
  },
  data() {
    let self = this;

    return {
      loading: false,
      labelPosition: 'top',
      form: {},
      showTip:false,
      rules:{
        userName:[
          { required: true, message: '不能为空' }
        ],
        mobile:[
          { required: true, message: '不能为空'},
          { type: 'number', message: '手机必须为数字值'},
          {validator(rule, value, callback) {
            let mobile = self.form.mobile;
            if (!mobile) {
              return callback(new Error('电话号码必填'));
            }
            if (!/^[0-9]*$/.test(mobile)) {
              return callback(new Error('电话号码格式错误'));
            }
            callback();
          }}
        ],
        visitTime:[
          { type: 'date', required: true, message: '不能为空'},
          // { type: 'datetime', message: '手机必须为数字值'}
        ],
        spaceType:[
          {required: true, message: '不能为空' },
          // { type: 'datetime', message: '手机必须为数字值'}
        ],
        address:[
          { required: true, message: '不能为空' },
          // { type: 'datetime', message: '手机必须为数字值'}
        ],
        remark:[
          { required: true, message: '不能为空' },
          // { type: 'datetime', message: '手机必须为数字值'}
        ],
      }
    }
  },
  mounted() {
    
  },
  methods: {
    submit(form) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error("验证失败");
          return false;
        }
      
        let errors = this.errors;
        let params = {
          "address": this.form.address,
          "spaceType": this.form.spaceType,
          "mobile": this.form.mobile,
          "remark": this.form.remark,
          "userName": this.form.userName,
          "visitTime": new Date(this.form.visitTime).getTime(),
          "email": this.form.email,
        };
        this.$unsubscribe('updateAdd');
        this.$subs.updateAdd = this.$hub.flow([params])
          .use('booktour.add')
          .subscribe(
            (res) => {
              this.loading = false;
              this.showTip = true;
            },
            (err) => {
              this.loading = false;
              this.$message.error(err.message);
            }
          );
      });
      
    }
  },
  watch: {
    
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.app {
  padding: 20px;
}
input{
  width: 100%;
}
.tit {
  padding: 50px 0;
  text-align: center;
  color: #ffb300;
  font-size: 26px;
}

.p {
  margin-bottom: 15px;
}

.tip {
  margin-top: 50px;
  text-align: center;
  color: #fff;
  a {
    color: #5ea8ff;
  }
}
</style>
