<template>
  <el-dialog title="选择员工"
    :visible.sync="visible"
    width="800px"
    custom-class="is-xxx"
    @close="onClose"
  >
    <el-form :inline="true" size="small" class="sma-search-a" @submit.native.prevent="searchList">

      <el-form-item :label="__('keyword')">
        <el-input
          v-model.trim="search.keyword"
          :placeholder="__('username') + ' / ' + __('mobileNumber')"
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
        @selection-change="listSelectChange"
        @current-change="listCurrentChange"
      >

        <el-table-column
          v-if="isMulti"
          type="selection"
          min-width="55">
        </el-table-column>

        <el-table-column
          prop="mobile"
          :label="__('mobileNumber')"
          min-width="150"
        >
        </el-table-column>

        <el-table-column
          prop="nickname"
          :label="__('nickname')"
          min-width="150"
        >
        </el-table-column>

        <el-table-column
          prop="realName"
          :label="__('realName')"
          min-width="150"
        >
        </el-table-column>
  
      </el-table>

      <div class="sma-margin-top-20 sma-text-c">
        <el-pagination
          @size-change="sizeChange"
          @current-change="pageChange"
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
  name: 'com-user-choose',
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
      list: [],

      search: {
        keyword: '',
        userType: 2
      },

      selectedRow: null,
      selectedRows: [],

      loading: false
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
    sizeChange(val) {
      this.count = val;
      this.updateList();
    },
    pageChange(val) {
      this.page = val;
      this.updateList();
    },
    listSelectChange(rows) {
      this.selectedRows = rows;
    },
    listCurrentChange(val) {
      this.selectedRow = val;
    },
    searchList() {
      this.page = 1;
      this.updateList();
    },
    updateList() {
      let search = this.search;
      let params = {
        page: this.page,
        count: this.count,
        keyword: search.keyword,
        userType: search.userType
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('user.list')
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
