<template>
  <div class="mod sma-padding-lg">
    <div class="sma-box-card" v-loading="loading">
      <div class="sma-detail-a" v-if="detail && !form">
        <div class="content">

          <dl v-for="lang in langs">
            <dt>名称({{lang.label}})：</dt>
              <dd>{{detail.name[lang.key] }}</dd>
          </dl>

          <dl v-for="lang in langs">
            <dt>描述({{lang.label}})：</dt>
              <dd>{{detail.description[lang.key] }}</dd>
          </dl>

          <dl>
            <dt>[Android] pageSign: </dt>
            <dd>{{detail.pageSigns[0].customData}}</dd>
          </dl>

          <dl>
            <dt>[IOS] pageSign: </dt>
            <dd>{{detail.pageSigns[1].customData}}</dd>
          </dl>
  
          <dl>
            <dt>图片：</dt>
            <dd>
              <img-box :img="detail.picture.path"></img-box>
            </dd>
          </dl>
          
          <dl>
            <dt></dt>
            <dd>
              <el-button
                class="sma-margin-top-30"
                size="mini"
                type="primary"
                @click="editInfo"
                v-if="!form"
              >{{__('btn.edit')}}</el-button>
            </dd>
          </dl>
        </div>
      </div>

      <!--修改动态详情-->
      <div class="sma-detail-a" v-if="form">

        <el-form :model="form" ref="form" label-width="200px" class="content sma-loading-top" >
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
import {copyJson} from '../../../lib/utils';

export default {
  name: 'mod-apppage-detail',
  props: ['id'],
  components: {
    ImgBox
  },
  data() {
    return {
      loading: true,
      detail: null,
      form: null
    }
  },
  
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: 'app页面详情'
      });
    });
  },
  created() {
    this.initData();
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
    editInfo() {
      this.resetForm();
    },
    cancelEditInfo() {
      this.form = null;
    },
    resetForm() {
      this.form = copyJson(this.detail);
    },
    saveInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('请填写所有必填项');
          return;
        }

        let params = {
          id: this.id,
          name: this.form.name,
          description: this.form.description,
          pageSigns: this.form.pageSigns,
          picture: this.form.picture
        }
          
        this.$unsubscribe('saveInfo');
        this.$subs.saveInfo = this.$hub.flow([params])
          .use('apppage.modify')
          .subscribe(
            (res) => {
              this.$message.success(this.__('message.editSuccess'));
              this.form = null;
              this.initData();
            },
            (err) => {
              this.$message.error(err.message);
            }
          );
      });
    },
    initData() {
      let params = {
        id: this.id
      };

      this.$unsubscribe('apppageDetail');
      this.$subs.apppageDetail = this.$hub.flow([params])
        .use('apppage.detail')
        .subscribe(
          (res) => {
            this.detail = res;
            this.loading = false;
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>