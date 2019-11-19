<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">

      <div class="sma-detail-a" v-if="detail && !form">
        <div class="content">
          <dl>
            <dt>推送类型:</dt>
              <dd>{{detail.skipCase| enumText(enums, 'skipCase')}}</dd>
          </dl>
          <dl v-for="lang in langs">
            <dt>名称({{lang.label}})：</dt>
              <dd>{{detail.name[lang.key] }}</dd>
          </dl>
          <dl v-for="lang in langs">
            <dt>描述({{lang.label}})：</dt>
              <dd>{{detail.description[lang.key] }}</dd>
          </dl>
          <dl v-if="detail.skipCase=='NATIVE_PAGE'"  >
            <dt>推送页面: </dt>
            <dd>{{detail.clientPage.name}}</dd>
          </dl>
          <dl v-if="detail.skipCase=='NATIVE_PAGE'" >
            <dt>参数模版: </dt>
            <dd>{{detail.parameterTemplate}}</dd>
          </dl>
          <dl v-for="lang in langs" v-if="detail.skipCase=='WEB_PAGE'" >
            <dt>页面链接({{lang.label}}): </dt>
            <dd>{{detail.link.link[lang.key]}}</dd>
          </dl>
          <dl v-for="lang in langs" v-if="detail.skipCase=='WEB_PAGE'" >
            <dt>页面标题({{lang.label}}): </dt>
            <dd>{{detail.link.title[lang.key]}}</dd>
          </dl>

          <dl>
            <dt></dt>
            <dd>
              <div class="sma-margin-top-20">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editInfo"
                  v-if="!form"
                >{{__('btn.edit')}}</el-button>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      
      <!--修改动态详情-->
      <div class="sma-detail-a" v-if="form">
        <el-form :model="form" ref="form" label-width="200px" class="sma-info" >
          <el-form-item
            label="推送类型："
            prop="skipCase"
            :rules="[{ required: true, message: '类型不能为空'}]"
          >
            <div class="sma-w420">
              <el-select v-model="form.skipCase" placeholder="选择推送类型" >
                <el-option
                  v-for="item in enums.skipCase"
                  :key="item[0]"
                  :label="item[1]"
                  :value="item[0]">
                </el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item   v-for="lang in langs" :key="'name' + lang.key" :label="'名称('+ lang.label +')：'" :prop="'name.' + lang.key" :rules="[{ required: true, message: '不能为空'}]">
            <el-input v-model="form.name[lang.key]"></el-input>
          </el-form-item>

          <el-form-item 
            v-for="lang in langs"
            :key="'description' + lang.key"
            :label="'描述('+ lang.label +')：'"
            :prop="'description.' + lang.key"
          >
            <el-input type="textarea" v-model="form.description[lang.key]"></el-input>
          </el-form-item>

          <el-form-item
            label="推送页面："
            prop="clientPage"
            v-if="form.skipCase=='NATIVE_PAGE'"
            :rules="[{ required: true, message: '不能为空'}]"
          >
            <div class="sma-w420">
              <el-select v-model="form.clientPage.id" placeholder="选择推送类型" >
                <el-option
                  v-for="item in pageList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item 
            label="RefID类型："
            prop="refId"
            v-if="form.skipCase=='NATIVE_PAGE'"
            :rules="[{ required: true, message: '请选择'}]"
           >
            <div class="sma-w420">
              <el-select v-model="form.refId" placeholder="选择RefID类型">
                <el-option v-for="item in enums.pushParams"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item 
          v-for="lang in langs"
          :key="'link' + lang.key"
          :label="'页面链接('+ lang.label +')：'" 
          :prop="'link.link.'+lang.key"
          :rules="[{ required: true, message: '不能为空'}]"
          v-if="form.skipCase=='WEB_PAGE'" 
          >
            <el-input v-if="form.link" v-model="form.link.link[lang.key]"></el-input>
           
          </el-form-item>
          <el-form-item 
            v-for="lang in langs"
            :key="'title' + lang.key"
            :label="'页面标题('+ lang.label +')：'"
            :prop="'link.title.'+lang.key"
            :rules="[{ required: true, message: '不能为空'}]"
            v-if="form.skipCase=='WEB_PAGE'" 
          >
            <el-input v-model="form.link.title[lang.key]"></el-input>
          </el-form-item>

          <el-form-item class="sma-margin-top-30">
            <el-button
              type="primary"
              size="mini"
              @click="saveInfo('form')">{{__('btn.save')}}</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="cancelEditInfo">{{__('btn.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import ImgBox from "../../com/form/img";
export default {
  name: 'mod-pushconf-detail',
  props: ['id'],
  components: {
    ImgBox
  },
  data() {
    return {
      loading: true,
      detail: null,
      form: null,
      pageList: []
    }
  },
  
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: '推送用例详情'
      });
      vm.refreshMod();
    });
  },
  created() {
    
  },
  computed:{
    enums() {
      return this.$state.enums.all;
    },
    langs() {
      return this.$state.apiLanguages;
    }
  },
  methods: {
    refreshMod() {
      this.initData();
    },
    editInfo() {
      this.resetForm();
      this.$unsubscribe('appList');
      this.loading = true;
      this.$subs.appList = this.$hub.flow([{}])
        .use('apppage.list')
        .subscribe(
          (res) => {
            this.pageList = res.rows;
            this.loading = false;
          },
          (err) => {
            this.$message.error(err.message);
            this.loading = false;
          }
        );
    },
    cancelEditInfo() {
      this.form = null;
    },
    saveInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('请填写所有必填项');
          return;
        }

        let form = this.form;
        let postData = {
          id: this.id,

          skipCase: form.skipCase,
          name: form.name,
    
          link: form.link,
          description: form.description,
          clientPage: form.clientPage
        };
        
        if(form.refId){
          let parameterTemplateObj = {};
          parameterTemplateObj.refId = form.refId;
          postData.parameterTemplate = JSON.stringify(parameterTemplateObj);
        }

        this.$unsubscribe('saveInfo');
        this.loading = true;
        this.$subs.add = this.$hub.flow([postData])
          .use('pushconf.modify')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success('保存成功');
              this.form = null;
              this.refreshMod();
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    },
    
    initData() {
      this.$unsubscribe('pushconfDetail');
      this.loading = true;
      this.$subs.pushconfDetail = this.$hub.flow([{ id: this.id }])
        .use('pushconf.detail')
        .subscribe(
          (res) => {
            this.detail = res;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    resetForm() {
      let refId = '';

      try {
        let obj = JSON.parse(this.detail.parameterTemplate);
        refId = obj.refId;
      } catch(e) {
        console.log('parameterTemplate error');
      }

      this.form = {
        id: this.id,
        name: this.detail.name || this.getFieldLangsObj(),
        description: this.detail.description || this.getFieldLangsObj(),
        skipCase: this.detail.skipCase,
        link: {
          link: this.detail.link.link || this.getFieldLangsObj(),
          title: this.detail.link.title || this.getFieldLangsObj()
        },
        refId: refId,
        clientPage: { id: this.detail.clientPage.id }
      }
    }
  }
}
</script>