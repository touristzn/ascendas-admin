<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="booking">{{__('bookingMeetingRoom')}}</el-button>
      </div>
      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @keyup.enter.native="searchList">
          <el-form-item :label="__('keyword')">
            <el-input v-model="search.keyword" :placeholder="__('username') + ' / ' + __('mobileNumber')"></el-input>
          </el-form-item>

          <el-form-item :label="__('companyName')">
            <el-input v-model="search.roomName" :placeholder="__('companyName')"></el-input>
          </el-form-item>

          <el-form-item :label="__('status')">
            <el-select v-model="search.range" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option
                v-for="item in enums.reservationRange"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item :label="__('visitDate')">
            <el-date-picker
                v-model="search.day"
                type="date"
                :placeholder="__('visitDate')">
              </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchList">{{__('btn.search')}}</el-button>
          </el-form-item>
        </el-form>

        <!--列表-->
        <div class="sma-table-list sma-margin-top-30">
          <el-table
            :data="list"
            border
            :fit="true"
          >
            <el-table-column
              prop="id"
              :label="__('serialNumber')"
              width="100">
            </el-table-column>
            <el-table-column
              prop="user.nickname"
              :label="__('personsBooking')"
              width="100">
            </el-table-column>
            <el-table-column
              prop="user.mobile"
              :label="__('mobileNumber')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="meetingRoom"
              :label="__('meetingRoom')"
              width="200">
            </el-table-column>
            <el-table-column
              prop="cost.price"
              :label="__('payPrice')"
              width="100">
            </el-table-column>
            <el-table-column
              :label="__('StartTime')"
              width="150">
              <template slot-scope="scope">
                {{moment(scope.row.beginTime)}}
              </template>
            </el-table-column>
            <el-table-column
              :label="__('EndTime')"
              width="150">
              <template slot-scope="scope">
                {{moment(scope.row.endTime)}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="100"
              :label="__('operation')">
              <template slot-scope="scope">
                <el-button @click="onCancel(scope.row.id)" type="warning" size="mini" plain>{{__('cancelBooking')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div class="sma-margin-top-20 sma-text-c" v-if="list">
            <el-pagination
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="count"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">  
            </el-pagination>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {showBooking} from '../../helper/meetingrooms';

export default {
  name: 'mod-booking-list',
  data() {
    return {
      loading:true,

      page: 1,
      count: 10,
      total: 0,
      list: null,
      
      search: {
        keyword: '',
        roomName: '',
        range: '',
        day: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: vm.__('bookingListTitle')
      });
      vm.refreshMod();
    });
  },
  created() {
    this.refreshMod();
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    moment(time) {
      return moment(time).format('YYYY-MM-DD hh:mm');
    },
    refreshMod() {
      this.updateList();
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    onCancel(roomId) {
      this.$confirm(this.__('cancelBookingMessageBox'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出取消成功的提示
        this.$unsubscribe('updateList');
        this.$subs.updateList = this.$hub.flow([{
          id: roomId
        }])
          .use('meetingrooms.cancelBooking')
          .subscribe(
            (res) => {
              this.$message.success(this.__('message.cancelSuccess'));
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      })
    },
    booking() {
      showBooking({}, {
        ['add-back'](data) {
          this.$message.success(this.__('message.bookingSuccess'));
          this.updateList();
        }
      });
    },
    updateList() {
      let params = {
        keyword: this.search.keyword.trim(),
        roomName: this.search.roomName.trim(),
        reservationRange: this.search.range,
        reserveDay: this.search.day,
        page: this.page,
        count: this.count
      };

      this.$unsubscribe('updateList');
      this.$subs.updateList = this.$hub.flow([params])
        .use('meetingrooms.listBooking')
        .subscribe(
          (res) => {
            this.list = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    sizeChange(val) {
      this.count = val;
      this.updateList();
    },
    currentChange(val) {
      this.page = val;
      this.updateList();
    }
  }
}
</script>



