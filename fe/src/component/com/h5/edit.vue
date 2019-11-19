<template>
  <el-dialog
    title="编辑H5页面"
    :visible.sync="visible"
    width="500"
    class="sma-dialog-wrapper"
    custom-class="sma-dialog"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form 
      v-if="form"
      :model="form" 
      ref="form" 
      label-width="150px" 
      class="form sma-loading-top" 
      @submit.native.prevent
      :disabled="loading"
    >
      <el-form-item
        :label="__('type') + '：'"
        prop="type"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.type" :placeholder="__('type')"></el-input>
      </el-form-item>

      <el-form-item
        :label="__('shortName') + '：'"
        prop="shortName"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.shortName" :placeholder="__('shortName')"></el-input>
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

      <el-form-item
        :label="__('content') + '：'"
        prop="content"
      >
        <el-input :disabled="!canEditContent" type="textarea" v-model="form.content" :placeholder="__('content')"></el-input>
        <el-alert
          :closable="false"
          style="line-height: 20px; margin-top: 10px;"
          title="注意：这里内容修改仅供‘快速拷贝’，编辑内容请使用‘编辑内容’按钮！"
          type="warning">
          <div>
            <el-switch
              v-model="canEditContent"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>
        </el-alert>
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
    },
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      form: null,
      canEditContent: false
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
        .use('guide.update')
        .subscribe(
          (res) => {
            this.loading = false;
            this.visible = false;
            this.$message.success(this.__('message.saveSuccess'));
            this.$emit('edit-back', copyJson(res));
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    initData() {
      this.$unsubscribe(`initData`);
      this.loading = true;
      this.$subs[`initData`] = this.$hub.flow([{
        id: this.id
      }])
        .use('guide.info')
        .subscribe(
          (res) => {
            this.loading = false;
            this.form = {
              id: res.id,
              type: res.type || '',
              name: res.name || '',
              shortName: res.shortName || '',
              content: res.content || ''
            }
          },
          (err) => {
            this.$message.error(err.message);
            this.loading = false;
          }
        );
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
