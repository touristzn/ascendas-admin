<template>
  <el-dialog
    :title="__('addBookVisit')"
    :visible.sync="visible"
    width="700px"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">

    <el-form class="sma-form-b" label-width="150px" :model="form" :rules="rules" ref="form">
      <el-form-item :label="__('name') + '：'" prop="userName">
        <el-input v-model="form.userName" :placeholder="__('name')"></el-input>
      </el-form-item>

      <el-form-item :label="__('mobile') + '：'" prop="mobile">
        <el-input v-model="form.mobile" :placeholder="__('mobile')"></el-input>
      </el-form-item>

      <el-form-item :label="__('email') + '：'" prop="email">
        <el-input v-model="form.email" :placeholder="__('email')"></el-input>
      </el-form-item>

      <el-form-item :label="__('spaceType') + '：'" prop="spaceType">
        <el-select v-model="form.spaceType" :placeholder="__('all')">
          <el-option
            v-for="item in enums.spaceType"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="__('visitTime') + '：'" prop="visitTime">
        <el-date-picker
          v-model="form.visitTime"
          type="date"
          :placeholder="__('visitTime')"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item :label="__('visitAddress') + '：'">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

      <el-form-item :label="__('remark') + '：'">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSave">{{__('btn.save')}}</el-button>
    </span>

  </el-dialog>
</template>

<script>
import moment from 'moment';

export default {
  name: 'com-bookvisit-add',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        userName: '',
        mobile: '',
        email: '',
        address: '',
        spaceType: '',
        visitTime: '',
        remark: ''
      },
      rules: {
        userName: [
          { required: true, message: this.__('required') }
        ],
        email: [
          { type: 'email', message: this.__('rules.email') }
        ],
        spaceType: [
          { required: true, message: this.__('required'), trigger: 'change' }
        ],
        visitTime: [
          { required: true, message: this.__('required') }
        ],
        mobile: [
          { required: true, message: this.__('required') },
          { pattern: /^[0-9]*$/, message: this.__('rules.phone') }
        ]
      }
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSave() {
      if (!this.form.userName || !this.form.mobile || !this.form.spaceType || !this.form.visitTime) {
        this.$message.error(this.__('form.error'));
        return;
      }

      this.form.visitTime = moment(this.form.visitTime).format('YYYY-MM-DD');
      const params = this.form;
      this.$unsubscribe('addVisit');
      this.$subs.addVisit = this.$hub.flow([params])
        .use('bookvisit.add')
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
    }
  }
}
</script>
