<template>
  <el-dialog title="使用有效期" :visible.sync="visible" width="400px">
    <el-form label-width="100px" :model="form" ref="form" :disabled="loading">
      <el-form-item 
        label="开始" 
        prop="effectiveBegin"
      >
        <el-input class="ins" :value="form.effectiveBegin" disabled></el-input>
      </el-form-item>
      <el-form-item 
        label="结束" 
        prop="effectiveEnd"
        :rules="[
          { required: true, message: __('required') }
        ]"
      >
        <el-date-picker
          class="ins"
          v-model="form.effectiveEnd"
          align="right"
          type="date"
          placeholder="结束"
          :picker-options="effectiveEndOptions"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-loading="loading">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="primary" @click="saveEffective">{{__('btn.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import {copyJson} from '../../../lib/utils';

export default {
  name: 'com-order-edit-effective',
  props: {
    visible: Boolean,
    order: Object
  },
  data() {
    let self = this;

    return {
      loading: false,

      form: {
        effectiveBegin: '',
        effectiveEnd: ''
      },

      effectiveEndOptions: {
        disabledDate(time) {
          let now = moment(self.form.effectiveBegin).startOf('day').valueOf();
          let ins = moment(time).startOf('day').valueOf();
          return ins <= now;
        }
      }
    }
  },
  mounted() {
    let order = this.order;

    this.form = {
      id: order.id,
      effectiveBegin: moment(order.effectiveBegin).format('YYYY-MM-DD'),
      effectiveEnd: moment(order.effectiveEnd).format('YYYY-MM-DD')
    }
  },
  methods: {
    saveEffective() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        
        this.$unsubscribe('saveEffective');
        this.loading = true;
        this.$subs.saveEffective = this.$hub.flow([{
          id: this.form.id,
          effectiveEnd: moment(this.form.effectiveEnd).startOf('day').valueOf()
        }])
          .use('order.selectiveUpdate')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.editSuccess'));
              this.visible = false;
              this.$emit('edit-back', copyJson(res));
            },
            (err) => {
              this.$message.error(err.message);
              this.loading = false;
            }
          );
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.ins {
  width: 200px;
}
</style>
