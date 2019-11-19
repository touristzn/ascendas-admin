<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box" v-loading="loading">
      <div class="sma-detail-a" v-if="info && !editForm">
        <div class="sma-info">
          <div class="content">
            <dl>
              <dt>名称：</dt>
              <dd>{{info.name}}</dd>
            </dl>
            <dl>
              <dt>数量：</dt>
              <dd>{{info.value}}</dd>
            </dl>
            <dl>
              <dt>楼层：</dt>
              <dd>{{info.floor}}</dd>
            </dl>
            <dl>
              <dt>在app端是否显示：</dt>
              <dd>{{info.displayInApp | enumText(enums, 'yesOrNo')}}</dd>
            </dl>
            <dl>
              <dt>显示序列：</dt>
              <dd>{{info.displayOrder}}</dd>
            </dl>
            <dl>
              <dt>描述：</dt>
              <dd>{{info.description}}</dd>
            </dl>
            <dl>
              <dt>设施：</dt>
              <dd>
                <el-tag 
                  style="margin: 5px;" 
                  type="info" 
                  size="mini" 
                  v-for="item in info.facilities" 
                  :key="item.id" 
                >
                  {{item.name}}
                </el-tag>
              </dd>
            </dl>
            <dl>
              <dt>图片：</dt>
              <dd>
                <img-box :size="100" :img="info.picture"></img-box>
              </dd>
            </dl>
          </div>
        </div>
        
        <div class="f-button">
          <el-button 
            size="mini"
            type="primary" 
            @click="startEdit"
          >编辑</el-button>
        </div>
      </div>

      <div class="sma-detail-a" v-if="editForm">
        <div class="sma-info">
          <el-form class="content"
            :model="editForm" 
            ref="form" 
            label-width="150px"
            @submit.native.prevent 
          >
            <el-form-item
              label="名称："
              prop="name"
              :rules="[
                {required: true, message: __('required')}
              ]"
            >
              <el-input v-model="editForm.name" placeholder="名称"></el-input>
            </el-form-item>

            <el-form-item
              label="数量："
              prop="value"
              :rules="[
                {required: true}
              ]"
            >
              <el-input-number v-model="editForm.value" :min="0" label="数量："></el-input-number>
            </el-form-item>

            <el-form-item
              label="楼层："
              prop="floor"
              :rules="[
                {required: true, message: __('required')}
              ]"
            >
              <el-input class="" v-model="editForm.floor" placeholder="楼层"></el-input>
            </el-form-item>

            <el-form-item
              label="在app端是否显示："
              prop="displayInApp"
              :rules="[
                {required: true}
              ]"
            >
              <el-select clearable :placeholder="__('select')" v-model="editForm.displayInApp">
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
              <el-input-number v-model="editForm.displayOrder" label="显示序列"></el-input-number>
            </el-form-item>

            <el-form-item
              label="描述："
            >
              <el-input class="" type="textarea" v-model="editForm.description" placeholder="描述："></el-input>
            </el-form-item>

            <el-form-item
              label="设施："
            >
              <el-checkbox-group v-model="editForm.facilityIds" class="sma-checkbox-group">
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
                v-model="editForm.picture"
                :edit="true"
              ></img-box>
            </el-form-item>
          </el-form>
        </div>

        <div class="f-button">
          <el-button 
            type="primary" 
            @click="saveEdit"
            size="mini"
          >{{__('btn.save')}}</el-button>

          <el-button 
            plain
            type="primary" 
            @click="cancelEdit"
            size="mini"
          >{{__('btn.cancel')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {copyJson} from '../../../lib/utils';
import ImgBox from '../../com/form/img';
/**
 * @vuedoc
 * @exports component/mod/user/Add
 */
export default {
  name: 'mod-resource-detail',
  components: {
    ImgBox
  },
  props: ['id'],
  data() {
    return {
      info: null,
      editForm: null,
      facilities: [],

      loading: false
    }
  },
  computed: {
    enums() {
      return this.$state.enums.all;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: `资源详情(${vm.id})`
      });
    });
  },
  mounted() {
    this.refreshMod();
  },
  methods:{
    refreshMod() {
      this.initData();
    },
    initData() {
      let infoOb = this.$hub.flow([{ id: this.id }])
        .use('resource.info');
      let facilitiesOb = this.$hub.flow([{ page: 1, count: 100 }])
        .use('resource.facilities');

      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flowAll([
        infoOb,
        facilitiesOb
      ])
        .subscribe(
          ([info, facilities]) => {
            this.loading = false;
            this.info = info;
            this.facilities = facilities.rows;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    updateInfo() {
      let params = {
        id: this.id
      };

      this.$unsubscribe('getInfo');
      this.loading = true;
      this.$subs.getInfo = this.$hub.flow([params])
        .use('resource.info')
        .subscribe(
          (res) => {
            this.loading = false;
            this.info = res;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    startEdit() {
      let info = this.info;
      this.editForm = {
        id: info.id,
        name: info.name || '',
        value: info.value || 0,
        floor: info.floor || '',
        displayInApp: info.displayInApp || false,
        displayOrder: info.displayOrder || 0,
        description: info.description || '',
        picture: info.picture || '',
        facilityIds: (info.facilities || []).map(item => item.id)
      };
    },
    saveEdit() {
      let data = copyJson(this.editForm);
      this.$unsubscribe('saveEdit');
      this.loading = true;
      this.$subs.saveEdit = this.$hub.flow([data])
        .use('resource.modify')
        .subscribe(
          (res) => {
            this.loading = false;
            this.$message.success(this.__('message.saveSuccess'));
            this.editForm = null;
            this.updateInfo();
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    cancelEdit() {
      this.editForm = null;
    }
  }
}
</script>

<style lang="css">
</style>
