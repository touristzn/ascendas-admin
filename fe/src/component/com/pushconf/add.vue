<template>
  <el-dialog
    title="添加推送用例"
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
        label="推送类型:"
        prop="skipCase"  
        :rules="[{ required: true, message: '不能为空'}]"
      >
        <el-select v-model="form.skipCase" placeholder="选择推送类型" >
          <el-option
            v-for="item in enums.skipCase"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        v-for="lang in langs" 
        :key="'name' + lang.key" 
        :label="'名称('+ lang.label +')：'" 
        :prop="'name.' + lang.key" 
        :rules="[{ required: true, message: '不能为空'}]"
      >
        <el-input v-model="form.name[lang.key]"></el-input>
      </el-form-item>

      <el-form-item 
        v-for="lang in langs"
        :key="'description' + lang.key"
        :label="'描述('+ lang.label +')：'"
        :prop="'description.' + lang.key"
        :rules="[{ required: true, message: '类型不能为空'}]"
      >
        <el-input type="textarea" v-model="form.description[lang.key]"></el-input>
      </el-form-item>

      <el-form-item 
        label="推送页面:" 
        v-if="form.skipCase=='NATIVE_PAGE'" 
        prop="clientPage" 
        :rules="[{ required: true, message: '不能为空'}]"
      >
        <el-select v-model="form.clientPage.id" placeholder="选择推送类型" >
          <el-option
          v-for="item in currencyList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        label="RefID类型:" 
        v-if="form.skipCase=='NATIVE_PAGE'" 
        prop="refId"
        :rules="[{ required: true, message: '请选择'}]"
      >
        <el-select v-model="form.refId" placeholder="选择RefID类型">
          <el-option v-for="item in enums.pushParams"
          :key="item[0]"
          :label="item[1]"
          :value="item[0]"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        v-for="lang in langs"
        v-if="form.skipCase=='WEB_PAGE'"
        :key="'link' + lang.key"
        :label="'页面链接('+ lang.label +')：'"
        :prop="'link.link.' + lang.key"
        :rules="[{ required: true, message: '类型不能为空'}]"
      >
        <el-input  v-model="form.link.link[lang.key]"></el-input>   
      </el-form-item>
      
      <el-form-item 
        v-for="lang in langs"
        v-if="form.skipCase=='WEB_PAGE'"
        :key="'title' + lang.key"
        :label="'页面标题('+ lang.label +')：'"
        :prop="'link.title.' + lang.key"
        :rules="[{ required: true, message: '不能为空'}]"
      >
        <el-input v-model="form.link.title[lang.key]"></el-input>
      </el-form-item>
    </el-form>

    <div 
      slot="footer" 
      class="dialog-footer" 
      v-loading="loading" 
    >
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSure('form')">{{__('btn.save')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {copyJson} from '../../../lib/utils';

export default {
  name: 'com-pushconf-add',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currencyList: [],
      form: {
        skipCase: "",
        name: this.getFieldLangsObj(),
        refId: "",
        link:{
          link: this.getFieldLangsObj(),
          title: this.getFieldLangsObj(),
        },
        description: this.getFieldLangsObj(),
        clientPage:{
          id:''
        },
      },
      labelPosition:'left',
      loading: false
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
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flow([{}])
        .use('apppage.list')
        .subscribe(
          (res) => {
            this.loading = false;
            this.currencyList = res.rows;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    onClose() {
      this.$emit('close');
    },
    onSure(form) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.save();
      });
    },
    save() {
      let form = this.form;
      let postData = {
        skipCase: form.skipCase,
        name: form.name,
  
        link: form.link,
        description: form.description,
        clientPage:form.clientPage
      };
      
      if(form.refId){
        let parameterTemplateObj = {};
        parameterTemplateObj.refId = form.refId;
        postData.parameterTemplate = JSON.stringify(parameterTemplateObj);
      }

      this.$subs.add = this.$hub.flow([postData])
        .use('pushconf.add')
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
  ready() {
    this.initData();
    
  }
}
</script>

<style lang="scss" scoped>
  .tit{
    font-weight: bold;
  }

</style>
