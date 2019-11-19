<template>
  <el-dialog
    title="添加资源"
    :visible.sync="visible"
    width="500"
    class="sma-dialog-wrapper"
    custom-class="sma-add-dialog"
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
        label="名称："
        prop="name"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>

      <el-form-item
        label="数量："
        prop="value"
        :rules="[
          {required: true}
        ]"
      >
        <el-input-number v-model="form.value" :min="0" label="数量："></el-input-number>
      </el-form-item>

      <el-form-item
        label="楼层："
        prop="floor"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.floor" placeholder="楼层"></el-input>
      </el-form-item>

      <el-form-item
        label="在app端是否显示："
        prop="displayInApp"
        :rules="[
          {required: true}
        ]"
      >
        <el-select clearable :placeholder="__('select')" v-model="form.displayInApp">
          <el-option
            v-for="item in enums.yesOrNo"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="显示序列："
        prop="displayOrder"
        :rules="[
          {required: true}
        ]"
      >
        <el-input-number v-model="form.displayOrder" label="显示序列"></el-input-number>
      </el-form-item>

      <el-form-item
        label="描述："
      >
        <el-input type="textarea" v-model="form.description" placeholder="描述："></el-input>
      </el-form-item>

      <el-form-item
        label="设施："
      >
        <el-checkbox-group v-model="form.facilityIds" class="sma-checkbox-group">
          <el-checkbox 
            :key="item.id"
            :label="item.id" 
            v-for="item in facilities"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="图片："
      >
        <img-box
          v-model="form.picture"
          :edit="true"
          :upload-options="{}"
        ></img-box>
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
import ImgBox from '../form/img';

export default {
  name: 'com-resource-add',
  components: {
    ImgBox
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

      facilities: [],
      form: {
        name: '',
        value: 0,
        displayInApp: true,
        displayOrder: 0,
        description: '',
        picture: '',
        floor: '1',

        facilityIds: []
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
        .use('resource.add')
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
      let facilitiesOb = this.$hub.flow([{
        page: 1,
        count: 100
      }])
        .use('resource.facilities'); 

      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flowAll([
        facilitiesOb
      ])
        .subscribe(
          ([facilities]) => {
            this.loading = false;
            this.facilities = facilities.rows;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
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
