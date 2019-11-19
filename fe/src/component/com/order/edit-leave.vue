<template>
  <el-dialog title="离开时间" :visible.sync="visible" width="400px">
    <el-form label-width="100px" :model="form" ref="form" :disabled="loading">
      <el-form-item 
        :label="__('StartTime')" 
        prop="contractBegin"
      >
        <el-input class="ins" :value="form.contractBegin" disabled></el-input>
      </el-form-item>
      <el-form-item 
        :label="__('EndTime')" 
        prop="leaveDate"
        :rules="[
          { required: true, message: __('required') }
        ]"
      >
        <el-date-picker
          class="ins"
          v-model="form.leaveDate"
          align="right"
          type="date"
          :placeholder="__('EndTime')"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item 
        label="离开原因" 
        prop="leaveReason"
        :rules="[
          { required: true, message: __('required') }
        ]"
      >
        <el-select class="sel" :placeholder="__('select')" v-model="form.leaveReason">
          <el-option 
            :key="item[0]"
            :value="item[0]"
            v-for="item in enums.orderLeaveReason"
            :label="item[1]" 
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item 
        v-if="form.leaveReason == 'EARLY_LEAVE'"
        label="离开跟进" 
        prop="leaveFollowUp"
        :rules="[
          { required: form.leaveReason == 'EARLY_LEAVE', message: __('required') }
        ]"
      >
        <el-select :placeholder="__('select')" v-model="form.leaveFollowUp">
          <el-option 
            :key="item"
            :value="item"
            v-for="item in leaveFollowUpEnum"
            :label="item" 
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-loading="loading">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="primary" @click="saveEdit">{{__('btn.confirm')}}</el-button>
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
        contractBegin: '',
        leaveDate: '',
        leaveReason: '',
        leaveFollowUp: ''
      },

      leaveFollowUpEnum: [
        'Move to another Hub',
        'Downgrade Product (PO -> OO/HD, OO -> HD)',
        'Upgrade Product (OO/HD -> PO, HD -> HD)'
      ]
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  mounted() {
    let order = this.order;

    this.form = {
      id: order.id,
      contractBegin: moment(order.contractBegin).format('YYYY-MM-DD'),
      leaveDate: moment(order.leaveDate).format('YYYY-MM-DD'),
      leaveReason: order.leaveReason || '',
      leaveFollowUp: order.leaveFollowUp || ''
    }
  },
  methods: {
    saveEdit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        
        this.$unsubscribe('saveEdit');
        this.loading = true;
        this.$subs.saveEdit = this.$hub.flow([{
          id: this.form.id,
          leaveDate: moment(this.form.leaveDate).startOf('day').valueOf(),
          leaveReason: this.form.leaveReason,
          leaveFollowUp: this.form.leaveFollowUp
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
.ins, .sel {
  width: 200px;
}
</style>
