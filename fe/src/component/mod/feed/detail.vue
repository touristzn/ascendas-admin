<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box" v-loading="loading">
      <div class="sma-detail-a" v-if="detail&&!showEditInfo">
        <div class="sma-info">
          <div class="content">
            <dl>
              <dt>{{__('content')}}：</dt>
               <dd>{{detail.content}}</dd>
            </dl>
            <dl>
              <dt>{{__('likeNum')}}：</dt>
              <dd>{{detail.likeNum}}</dd>
            </dl>
            <dl>
              <dt>{{__('commentNum')}}：</dt>
              <dd>{{detail.commentNum}}</dd>
            </dl>
            <dl>
              <dt>{{__('utterer')}}：</dt>
              <dd>{{detail.user||''}}</dd>
            </dl>
            <dl>
              <dt>{{__('category')}}：</dt>
              <dd>{{detail.category}}</dd>
            </dl>
            <dl>
              <dt>{{__('status')}}：</dt>
              <dd>{{detail.status}}</dd>
            </dl>
          </div>
        </div>

        <div class="f-button">
          <el-button
            size="mini"
            type="primary"
            @click="editInfo"
            v-if="!showEditInfo">{{__('btn.edit')}}</el-button>
        </div>
      </div>
          <!--修改动态详情-->
       <div class="sma-detail-a" v-if="form&&showEditInfo">
  
      <el-form :model="form" :rules="rules" ref="form" label-width="auto" class="content">
        <el-form-item :label="__('category') + '：'" prop="category">
          <el-select v-model="form.category" :placeholder="__('all')">
            <el-option
            v-for="item in enums.feedCategory"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.category == 'COMMERCIAL'" :label="__('status') + '：'" prop="status">
          <el-select v-model="form.status" :placeholder="__('all')">
            <el-option
            v-for="item in enums.feedStatus"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="__('content') + '：'" prop="content">
          
          <el-input  type="textarea" v-model="form.content"  ></el-input>
        </el-form-item>
      </el-form>

        <div class="f-button">
          <el-button
            type="primary"
            size="mini"
            @click="saveInfo('form')">{{__('btn.save')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="cancelEditInfo">{{__('btn.cancel')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mod-feed-detail',
  data() {
    return {
      activeTab: 'first',
      loading: true,

      feedId: this.$route.params.id,
      detail: null,
      form: null,
      showEditInfo: false,
      rules: {
        category: [
          {required: true, message: this.__('required'), trigger: 'change'}
        ],
        status: [
          {required: true, message: this.__('required'), trigger: 'change'},
          ],
        content:[
          {required: true, message: this.__('required'), trigger: 'blur'},
          ]
      },


    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: vm.__('feedDetail')
      });
    });
  },
  created() {
    this.initData();
  },
  computed:{
    enums() {
      return this.$state.enums.all;
    }
  },
  methods: {
    editInfo() {
      this.resetForm();
      this.showEditInfo = true;
     
    },
    saveInfo(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id:this.form.id,
              category:this.form.category,
              content: this.form.content,
              status:this.form.status
            }
              
              this.$unsubscribe('feedEditInfo');
              this.$subs.feedEditInfo = this.$hub.flow([params])
                .use('feed.editInfo')
                .subscribe(
                  (res) => {
                    this.initData();
                    this.$message.success(this.__('message.editSuccess'));
                    this.showEditInfo = false;
                  },
                  (err) => {
                    this.$message.error(err.message);
                  }
                );
          } else {
            return false;
          }
        });
    
    },
    cancelEditInfo() {
      this.showEditInfo = false;
    },
    initData() {
      let params = {
        id: this.feedId
      };

      this.$unsubscribe('feedDetail');
      this.$subs.feedDetail = this.$hub.flow([params])
        .use('feed.detail')
        .subscribe(
          (res) => {
            this.detail = res;
            this.loading = false;
          },
          (err) => {
            //this.$message.error(err.message);
          }
        );
    },
    resetForm() {
      this.form = {
        id:this.feedId,
        category: this.detail.category,
        status: this.detail.status,
        content: this.detail.content,
       
      }
    }
  }
}
</script>
