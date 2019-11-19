<template>
  <el-dialog
    :title="__('likeList')"
    :visible.sync="visible"
    custom-class="sma-add-dialog"
    @close="onClose">

    <div class="sma-table-list sma-margin-top-20" v-loading="loading">
      <el-table
        :data="list"
        border
        :fit="true"
      >
        <el-table-column
          prop="name"
          :label="__('name')"
          fixed
          width="200">
        </el-table-column>
        <el-table-column
          prop="phone"
          :label="__('phone')"
          width="150">
        </el-table-column>
        <el-table-column
          prop="companyName"
          :label="__('company')"
          min-width="200">
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
  name: 'com-benefits-like-list',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    id: {
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
    initData() {
      let params = {
        id: this.id,
        page: this.page,
        count: this.count
      };
      this.$unsubscribe('likeList');
      this.$subs.likeList = this.$hub.flow([params])
        .use('benefits.likeList')
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
