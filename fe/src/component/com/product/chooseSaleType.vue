<template>
  <el-dialog title="选择产品单元"
    :visible.sync="visible"
    width="800px"
    custom-class="is-xxx"
    @close="onClose">

    <div class="sma-table-list sma-loading-top" v-loading="loading">
      <el-table
        :data="list"
        border
        :fit="true"
        :highlight-current-row="!isMulti"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          v-if="isMulti"
          type="selection"
          min-width="55">
        </el-table-column>

        <el-table-column
          prop="saleType.name"
          label="单元名称"
          min-width="100"
        >
        </el-table-column>

        <el-table-column
          label="支持购买单位"
          min-width="150"
        >
          <template slot-scope="scope">
            <el-tag class="sma-margin-3" size="mini" type="info" v-for="up in scope.row.saleType.saleUnits" :key="up.unit">
              {{up.unit}}
            </el-tag>
          </template>
        </el-table-column>

      </el-table>

      <div class="sma-margin-top-20 sma-text-c">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="count"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">  
        </el-pagination>
      </div>
    </div>


    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="primary" @click="onSure">{{__('btn.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {copyJson} from '../../../lib/utils';


export default {
  name: 'com-resource-choose',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      default: false
    },
    // 产品类别
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,

      page: 1,
      count: 20,
      total: 0,
      list: [],

      selectedRow: null,
      selectedRows: []
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.updateList();
    },
    handleSizeChange(val) {
      this.count = val;
      this.updateList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateList();
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },
    handleCurrentChange(val) {
      this.selectedRow = val;
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    updateList() {
      let params = {
        page: this.page,
        count: this.count,
        category: this.category
      };
      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('product.saleUnits')
        .subscribe(
          (res) => {
            this.loading = false;
            this.list = res.rows;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    onClose() {
      this.$emit('close');
    },
    onSure() {
      if (this.isMulti) {
        let selectedRows = this.selectedRows;
        if (!selectedRows.length) return;
        this.visible = false;
        this.$emit('choose-back', copyJson(selectedRows));
      } else {
        let selectedRow = this.selectedRow;
        if (!selectedRow) return;
        this.visible = false;
        this.$emit('choose-back', copyJson(selectedRow));
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
