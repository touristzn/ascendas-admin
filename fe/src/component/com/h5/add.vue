<template>
  <el-dialog
    title="添加H5页面"
    :visible.sync="visible"
    width="500"
    class="sma-dialog-wrapper"
    custom-class="sma-dialog"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form 
      :model="form" 
      ref="form" 
      label-width="150px" 
      class="form sma-loading-top" 
      @submit.native.prevent
      :disabled="loading"
    >
      <el-form-item
        label="类型："
        prop="type"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.type" placeholder="类型"></el-input>
      </el-form-item>

      <el-form-item
        label="简称："
        prop="shortName"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.shortName" placeholder="简称"></el-input>
      </el-form-item>

      <el-form-item
        label="显示名称："
        prop="name"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.name" placeholder="显示名称"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-loading="loading">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSure">{{__('btn.save')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {copyJson} from '../../../lib/utils';

export default {
  name: 'com-h5-add',
  components: {
    //
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,

      form: {
        name: '',
        type: '',
        shortName: '',
        content: '',
        status: 'ENABLE'
      }
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSure() {
      if (this.loading) return;
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.submit();
      });
    },
    submit() {
      let data = copyJson(this.form);

      this.$unsubscribe('add');
      this.loading = true;
      this.$subs.add = this.$hub.flow([data])
        .use('guide.add')
        .subscribe(
          (res) => {
            this.loading = false;
            this.visible = false;
            this.$message.success(this.__('message.addSuccess'));
            this.$emit('add-back', copyJson(res));
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    initData() {
      //
    },
    ready() {
      this.initData();
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding-right: 50px;
}
</style>
