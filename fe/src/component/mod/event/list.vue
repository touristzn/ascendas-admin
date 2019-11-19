<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <!-- <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="exportReportForm">{{__('btn.export')}}</el-button>
      </div> -->

      <div class="content sma-margin-top-20">
        <!--搜索-->
        <el-form :inline="true" size="mini" class="sma-form-search" label-width="100px" @submit.native.prevent="handleQuery">
          <el-form-item :label="__('keyword')">
            <el-input 
              v-model="search.keyWords"
              :placeholder="__('titleTxt') + ' / ' + __('introduce')">
            </el-input>
          </el-form-item>

          <el-form-item :label="__('startTime')">
            <el-date-picker
              v-model="search.startTime"
              type="date"
              :placeholder="__('startTime')">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="__('endTime')">
            <el-date-picker
              v-model="search.endTime"
              type="date"
              :placeholder="__('endTime')">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="__('productCategory')">
            <el-select v-model="search.productName" :placeholder="__('all')">
              <el-option value="">{{__('all')}}</el-option>
              <el-option :key="__('livingRoom')" :label="__('livingRoom')" value="LIVING_ROOM"></el-option>
              <el-option :key="__('meetingRoom')" :label="__('meetingRoom')" value="MEETINGROOM"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="handleQuery" type="primary">{{__('btn.search')}}</el-button>
          </el-form-item>
        </el-form>

        <!--列表-->
        <div class="sma-table-list sma-margin-top-30" >
          <el-table
            :data="list"
            border
            :fit="true">
            <el-table-column
              prop="title"
              :label="__('titleTxt')"
              min-width="200">
            </el-table-column>
            <el-table-column
              prop="orderNo"
              :label="__('orderNumber')"
              width="150">
            </el-table-column>
            <el-table-column
              label="活动开始时间"
              width="160">
              <template slot-scope="scope">
                {{moment(scope.row.startTime)}}
              </template>
            </el-table-column>
            <el-table-column
              label="活动结束时间"
              width="160">
              <template slot-scope="scope">
                {{moment(scope.row.endTime)}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="__('operation')"
              width="240">
              <template slot-scope="scope">
                <router-link
                  :to="'/event/detail/'+ scope.row.eventId">
                  <el-button size="mini" type="primary" plain>{{__('btn.detail')}}</el-button>
                </router-link>
                <router-link
                  :to="'/event/attendees/'+ scope.row.eventId">
                  <el-button size="mini" type="warning" plain>{{__('eventParticipants')}}</el-button>
                </router-link>
                <el-button size="mini" plain
                  :type="!scope.row.disabled ? 'success' : 'danger'"
                  @click="modifyType(scope.row)">
                  {{scope.row.disabled ? __('btn.soldOut') : __('btn.publish')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div class="sma-margin-top-20 sma-text-c" v-if="list.length">
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

export default {
  name: 'mod-event-list',
  data() {
    return {
      loading: false,
      search: {
        keyWords:'',
        startTime: '',
        endTime: '',
        productName: ''
      },
      page: 1,
      count: 10,
      total: 0,
      list: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path,
        title: vm.__('eventListTitle')
      });
      vm.refreshMod();
    });
  },
  created() {
    this.refreshMod();
  },
  methods: {
    refreshMod() {
      this.initPage();
    },
    moment(time) {
      return moment(time).format('YYYY-MM-DD HH:MM:ss');
    },
    // exportReportForm(){
    //   let params = {};
    //   this.$unsubscribe('eventsListExport');
    //   this.$subs.eventsListExport = this.$hub.flow([params])
    //     .use('event.exportList')
    //     .subscribe(
    //       (res) => {
            
    //       },
    //       (err) => {
    //         this.$message.error(err.message);
    //       }
    //     );
    // },
    modifyType(item) {
      this.$confirm(this.__('edit.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        let params = {
          eventId: item.eventId
        };
        this.$unsubscribe('modifyType');
        this.$subs.modifyType = this.$hub.flow([params])
          .use('event.modifyType')
          .subscribe(
            (res) => {
              this.initPage();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      })
    },
    initPage(){
      this.queryEvents();
    },
    handleQuery(){
      this.page = 1;
      this.queryEvents();
    },
    queryEvents(){
      let search = this.search;
      let params = {
        startTime: search.startTime ? moment(search.startTime).format('YYYY-MM-DD HH:mm:ss') : ``,
        endTime: search.endTime ? moment(search.endTime).format('YYYY-MM-DD HH:mm:ss') : ``,
        productName: search.productName,
        keyWords: search.keyWords,
        page: this.page,
        count: this.count
      };
      this.$unsubscribe('fetchEvents');
      this.$subs.fetchEvents = this.$hub.flow([params])
        .use('event.list')
        .subscribe(
          (res) => {
            this.loading = false;
            this.list = res.rows || [];
            this.total = res.total;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    sizeChange(val) {
      this.count = val;
      this.queryEvents();
    },
    currentChange(val) {
      this.page = val;
      this.queryEvents();
    },
  }
}
</script>



