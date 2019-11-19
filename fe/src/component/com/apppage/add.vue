<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    width="800px"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form 
      :model="form" 
      ref="form" 
      label-width="200px" 
      class="content sma-loading-top" 
      :disabled="loading" 
      :label-position="labelPosition"
    >

      <el-form-item 
        v-for="lang in langs"
        :key="'name.' + lang.key"
        :label="'名称('+ lang.label +')：'"
        :prop="'name.' + lang.key"
        :rules="[
          { required: true, message: '必填' }
        ]"
      >
        <el-input v-model.trim="form.name[lang.key]"></el-input>
      </el-form-item>
    
      <el-form-item 
        v-for="lang in langs"
        :key="'description' + lang.key"
        :label="'描述('+ lang.label +')：'"
        :prop="'description.' + lang.key"
      >
        <el-input v-model.trim="form.description[lang.key]"></el-input>
      </el-form-item>

      <el-form-item label="[Android] pageSign: ">
       <el-input v-model.trim="form.pageSigns[0].customData"></el-input>
      </el-form-item>

      <el-form-item 
        label="[IOS] pageSign: ">
        <el-input v-model.trim="form.pageSigns[1].customData"></el-input>
      </el-form-item>

      <el-form-item 
        label="图片"
        prop="logo"
      >
        <img-box :edit="true" v-model="form.picture['path']"></img-box>
      </el-form-item>

    </el-form>

    <div 
      slot="footer" 
      class="dialog-footer" 
      v-loading="loading" 
    >
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSure">{{__('btn.save')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {copyJson} from '../../../lib/utils';
import ImgBox from "../form/img";
export default {
  name: 'com-apppage-add',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
   components: {
    ImgBox
  },
  data() {
    return {
      loading: false,
      labelPosition: 'left',
      form: {
        name: this.getFieldLangsObj(),
        description: this.getFieldLangsObj(),
        pageSigns: [
          { clientType: 'ANDROID' },
          { clientType: 'IOS' },
        ],
        picture: {
          path: ''
        }
      }
    }
  },
  computed: {
    langs() {
      return this.$state.apiLanguages;
    },
     enums() {
      return this.$state.enums.all;
    }
   
  },
  mounted(){
    
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSure() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.save();
      });
    },
    save() {
      let postData = {
        name: this.form.name,
        description: this.form.description,
        pageSigns: this.form.pageSigns,
        picture: this.form.picture
      };
       
      this.$unsubscribe('add');
      this.loading = true;
      this.$subs.add = this.$hub.flow([postData])
        .use('apppage.add')
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
    }
  },

} 
</script>

<style lang="scss" scoped>
.tit{
  font-weight: bold;
}
</style>
