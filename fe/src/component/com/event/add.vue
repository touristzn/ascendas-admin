<template>
  <el-dialog
    title="添加活动参与者"
    :visible.sync="visible"
    custom-class="sma-add-dialog is-addCompany"
    @close="onClose">

    <el-form class="sma-form-a" :model="form" ref="form">
      <el-form-item :label="__('name') + '：'" class="sma-label-required">
        <span @click="chooseUser">
          <el-input v-model="form.memberName" placeholder="请填写参与者"></el-input>
        </span>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSure">{{__('btn.save')}}</el-button>
    </span>

  </el-dialog>
</template>

<script>
import {showChooseUser} from '../../helper/user';

export default {
  name: 'com-event-add',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    eventId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      form: {
        memberName: '',
        memberId: null
      }
    }
  },
  created() {},
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSure() {
      if(!this.form.memberName) {
        this.$message.error('请填写参与者!');
        return;
      }

      let params = {
        attendeesList: {
          eventId: Number(this.eventId),
          memberId: this.form.memberId
        }
      }
      this.$unsubscribe('addAttendees');
      this.$subs.addAttendees = this.$hub.flow([params])
        .use('event.addAttendees')
        .subscribe(
          (res) => {
            this.visible = false;
            this.$emit('add-back', res);
            this.$message.success(this.__('message.addSuccess'));
        },
        (err) => {
          this.$message.error(err.message);
        }
      );
    },
    chooseUser() {
      let self = this;
      showChooseUser({}, {
        ['choose-back'](res) {
          self.form.memberId = res.id;
          self.form.memberName = res.nickname || res.username;
        }
      });
    }
  }
}
</script>
