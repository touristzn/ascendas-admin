<template>
  <el-dialog
    :title="__('bookingListTitle')"
    :visible.sync="visible"
    width="700px"
    custom-class="sma-add-dialog"
    @close="onClose">

    <div class="sma-table-list sma-margin-top-20" v-loading="loading">
      <el-table
        :data="list"
        border
        :fit="true"
      >
        <el-table-column
          prop="meetingRoom"
          :label="__('meetingRoom')"
          fixed
          width="150">
        </el-table-column>
        <el-table-column
          prop="user.nickname"
          :label="__('personsBooking')"
          width="150">
        </el-table-column>
        <el-table-column
          prop="beginTime"
          :label="__('StartTime')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="endTime"
          :label="__('EndTime')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="cost.price"
          :label="__('payPrice')"
          width="150">
        </el-table-column>
        <el-table-column
          width="100">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain
              @click="cancelBookRoom(scope.row.id)">
              {{__('cancelBooking')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="sma-margin-top-20 sma-text-c" v-if="list && total > count">
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

  </el-dialog>
</template>

<script>
export default {
  name: 'com-meetingrooms-booking-list',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    userId: {
      type: Number,
      default: null
    },
    companyId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      page: 1,
      count: 10,
      total: 0,
      list: null
    }
  },
  created() {
    this.initData();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    cancelBookRoom(roomId) {
      this.$confirm(this.__('cancel.message'), this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        //调用接口并弹出取消成功的提示
        this.$unsubscribe('cancelBook');
        this.$subs.cancelBook = this.$hub.flow([{
          id: roomId
        }])
          .use('meetingrooms.cancelBooking')
          .subscribe(
            (res) => {
              this.$message.success(this.__('message.cancelSuccess'));
              this.initData();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      })
    },
    initData() {
      let params = {
        userId: this.userId,
        companyId: this.companyId,
        page: this.page,
        count: this.count
      };

      this.$unsubscribe('listReservations');
      this.$subs.listReservations = this.$hub.flow([params])
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
