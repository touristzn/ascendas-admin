<template>
  <el-dialog :title="__('selectCompanyTitle')"
    :visible.sync="visible"
    width="800px"
    custom-class="is-xxx"
    @close="onClose">

    <div class="sma-choose-company" v-loading="loading">
      <el-form :inline="true" size="small" class="sma-search-a" @submit.native.prevent="searchList">
        <el-form-item>
          <el-input
            v-model="search.companyName"
            :placeholder="__('companyName') + ' / ' + __('registeredName.company')"
            @keyup.enter.native="searchList">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">{{__('btn.search')}}</el-button>
        </el-form-item>
      </el-form>

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
            prop="shortName"
            :label="__('shortName.company')"
            min-width="100">
          </el-table-column>

          <el-table-column
            :label="__('admin')"
            min-width="150"
          >
            <template slot-scope="scope">
              {{scope.row.admin ? scope.row.admin.nickname || scope.row.admin.username : ''}}
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
      list: [],

      search: {
        companyName: ''
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
        companyName: this.search.companyName,
        page: this.page,
        count: this.count
      };

      this.$unsubscribe('updateList');
      this.loading = true;
      this.$subs.updateList = this.$hub.flow([params])
        .use('company.list')
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
