<template>
  <el-dialog title="选择类别"
    :visible.sync="visible"
    custom-class="is-xxx"
    @close="onClose">

    <div class="sma-choose-company" v-loading="loading">
      <div class="sma-table-list sma-margin-top-20">
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
            prop="id"
            label="ID"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="name"
            :label=__('theName')
            min-width="200">
          </el-table-column>
        </el-table>

        <div class="sma-margin-top-20 sma-text-c" v-if="list && list.length > count">
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
  name: 'com-company-choose',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: 1,
      count: 20,
      total: 0,
      list: null,

      selectedRow: null,
      selectedRows: [],

      loading: true
    }
  },
  created() {
    this.initData();
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
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
      let params = {};
      this.$unsubscribe('categories');
      this.$subs.categories = this.$hub.flow([params])
        .use('event.categories')
        .subscribe(
          (res) => {
            this.list = res;
            this.loading = false;
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
