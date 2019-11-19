<template>
  <el-dialog title="选择资源"
    :visible.sync="visible"
    width="800px"
    custom-class="is-xxx"
    @close="onClose">

    <el-form :inline="true" size="small" @submit.native.prevent="searchList">
      <el-form-item label="资源名称：">
        <el-input
          v-model.trim="search.name"
          placeholder="资源名称"
          @keyup.enter.native="searchList">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchList">{{__('btn.search')}}</el-button>
      </el-form-item>
    </el-form>

    <div class="sma-table-list" v-loading="loading">
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
          width="70"
        >
        </el-table-column>

        <el-table-column
          prop="name"
          label="名称"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="description"
          label="描述"
          min-width="150"
        >
        </el-table-column>

        <el-table-column
          prop="value"
          label="数量"
          min-width="150"
        >
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
    }
  },
  data() {
    return {
      loading: false,

      page: 1,
      count: 20,
      total: 0,
      list: [],

      search: {
        name: '',
      },

      hubList: [],
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
        name: this.search.name
      };
      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('resource.list')
        .subscribe(
          (res) => {
            this.loading = false;
            this.list = res.rows;
            this.total = res.total;
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
