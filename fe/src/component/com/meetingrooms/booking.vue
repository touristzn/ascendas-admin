<template>
  <el-dialog
    :title="__('bookingMeetingRoom')"
    :visible.sync="visible"
    width="500"
    custom-class="sma-add-dialog"
    @close="onClose">

    <div class="sma-booking" v-loading="loading">
      <el-form ref="form" :rules="rules" class="sma-form-b" :model="form" label-width="150px" v-if="list">
        <el-form-item :label="__('meetingRoom') + '：'" prop="roomId">
          <el-select class="sma-w100" v-model="form.roomId" :placeholder="__('all')">
            <el-option
              v-for="item in list"
              :key="item.roomId"
              :label="item.name"
              :value="item.roomId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="__('bookingForm.user') + '：'" prop="userName">
          <span @click="selectUser">
            <el-input v-model="form.userName" :placeholder="__('bookingForm.user')"></el-input>
          </span>
        </el-form-item>

        <el-form-item :label="__('bookingTime') + '：'" prop="bookingTime">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            align="right"
            :start-placeholder="__('StartTime')"
            :end-placeholder="__('EndTime')"
            :default-time="['05:30:00', '23:00:00']"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="__('summary') + '：'">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.back')}}</el-button>
      <el-button type="success" @click="onSure">{{__('btn.booking')}}</el-button>
    </span>

  </el-dialog>
</template>

<script>
import moment from 'moment';
import {showChooseUser} from '../../helper/user';
import {copyJson} from '../../../lib/utils';

export default {
  name: 'com-meetingrooms-booking',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let self = this;

    return {
      loading: true,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      list: null,
      page: 1,
      count: 100,
      form: {
        userId: '',
        userName: '',
        roomId: '',
        time: null,
        beginTime: '',
        endTime: '',
        remark: ''
      },

      rules: {
        roomId: [
          {required: true, message: this.__('required')}
        ],
        userName: [
          {required: true, message: this.__('required')}
        ],
        bookingTime: [
          {
            required: true,
            validator(rule, value, callback) {
            if (!self.form.time) {
              return callback(new Error(self.__('required')));
            }

            const startTime = moment(self.form.time[0]).format('HH:mm:ss');
            const endTime = moment(self.form.time[1]).format('HH:mm:ss');

            if(startTime < '05:30:00' || endTime > '23:00:00') {
              return callback(new Error(self.__('selectTimeError')));
            } else {
              self.form.beginTime = self.form.time[0];
              self.form.endTime = self.form.time[1];
            }
            
            callback();
          }}
        ]
      }
    }
  },
  created() {
    this.initData();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSure() {
      if (!this.form.roomId || !this.form.userId || !this.form.beginTime || !this.form.endTime) {
        this.$message.error(this.__('message.bookingError'));
        return;
      }

      let postForm = {
        userId: this.form.userId,
        roomId: this.form.roomId,
        beginTime: new Date(this.form.beginTime).getTime(),
        endTime: new Date(this.form.endTime).getTime(),
        remark: this.form.remark
      }

      let data = copyJson(postForm);
      this.$unsubscribe('booking');
      this.$subs.booking = this.$hub.flow([data])
        .use('meetingrooms.booking')
        .subscribe(
          (res) => {
            this.visible = false;
            this.$message.success(this.__('message.bookingSuccess'));
          },
          (error) => {
            this.$message.error(error.message);
          }
        );
    },
    initData() {
      this.getMeetingRoomsList();
    },
    selectUser(){
      let _this = this;
      showChooseUser({}, {
        ['choose-back'](data) {
          _this.form.userId = data.id;
          _this.form.userName = data.nickname;
        }
      });
    },
    getMeetingRoomsList() {
      let params = {
        page: this.page,
        count: this.count
      };
      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('meetingrooms.listMeetingRooms')
        .subscribe(
          (res) => {
            this.list = res.rows;
            this.loading = false;
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>
