<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-card-header sma-border-bottom">
        <el-button type="primary" @click="addAttendees">{{__('addEventParticipants')}}</el-button>
      </div>

      <div class="content sma-margin-top-20">
        <!--列表-->
        <div class="sma-table-list">
          <el-table
            :data="list"
            border
            :fit="true"
          >
            <el-table-column
              prop="nickname"
              :label="__('nickname')">
            </el-table-column>
            <el-table-column
              prop="mobile"
              :label="__('mobile')">
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="__('operation')">
              <template slot-scope="scope">
                <el-button type="danger" size="mini"
                  @click="removeAttendees(scope.row)">{{__('btn.remove')}}</el-button>
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
import {showAddEventAttendees} from '../../helper/event';

export default {
  name: 'mod-event-attendees-list',
  props: ['id'],
  data() {
    return {
      loading: true,
      page: 1,
      count: 10,
      total: 0,
      list: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path,
        title: vm.__('eventParticipants')
      });
    });
  },
  created() {
    this.refreshMod();
  },
  methods: {
    refreshMod() {
      this.updateList();
    },
    addAttendees(){
      let self = this;
      showAddEventAttendees({
        eventId: this.id
      }, {
        ['add-back'](data) {
          self.updateList();
        }
      });
    },
    removeAttendees(item) {
      this.$confirm(this.__('del.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        let params = {
          attendeesList: {
            eventId: Number(this.id),
            memberId: item.memberId
          }
        }
        this.$unsubscribe('removeAttendees');
        this.$subs.removeAttendees = this.$hub.flow([params])
          .use('event.removeAttendees')
          .subscribe(
            (rpRes) => {
              this.updateList();
            },
            (err) => {
              this.$message.error(err.message);
            }
        );
      })
    },
    updateList() {
      let params = {
        eventId: this.id,
        page: this.page,
        count: this.count
      };
      this.$unsubscribe('attendeesList');
      this.$subs.attendeesList = this.$hub.flow([params])
        .use('event.attendeesList')
        .subscribe(
          (res) => {
            this.list = res;
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



