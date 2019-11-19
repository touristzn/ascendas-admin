<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box" v-loading="loading">

      <!--detail-->
      <div class="sma-detail-a" v-if="detail && !showEdit">
        <div class="sma-info">
          <div class="content">
            <dl v-for="lang in langs" :key="'benefitsHeadline' + lang.key">
              <dt>{{__('titleTxt')}}({{lang.label}})：</dt>
              <dd>{{detail.benefitsHeadline[lang.key]}}</dd>
            </dl>

            <dl v-for="lang in langs" :key="'introText' + lang.key">
              <dt>{{__('introduce')}}({{lang.label}})：</dt>
              <dd>{{detail.introText[lang.key]}}</dd>
            </dl>

            <dl v-for="lang in langs" :key="'partnerName' + lang.key">
              <dt>{{__('partner')}}({{lang.label}})：</dt>
              <dd>{{detail.partnerName[lang.key]}}</dd>
            </dl>

            <dl v-for="lang in langs" :key="'address' + lang.key">
              <dt>{{__('address')}}({{lang.label}})：</dt>
              <dd>{{detail.address[lang.key]}}</dd>
            </dl>

            <dl>
              <dt>{{__('type')}}：</dt>
              <dd>{{detail.type}}</dd>
            </dl>

            <dl>
              <dt>{{__('category')}}：</dt>
              <dd>{{detail.categoryName}}</dd>
            </dl>

            <dl>
              <dt>{{__('serviceTo')}}：</dt>
              <dd>{{detail.serviceTo}}</dd>
            </dl>

            <dl>
              <dt>{{__('discountType')}}：</dt>
              <dd>{{detail.discountType}}</dd>
            </dl>

            <dl>
              <dt>经度：</dt>
              <dd>{{detail.longitude}}</dd>
            </dl>

            <dl>
              <dt>纬度：</dt>
              <dd>{{detail.latitude}}</dd>
            </dl>

            <dl>
              <dt>{{__('pcLogo')}}：</dt>
              <dd><img class="sma-w100" :src="detail.pcLogo" alt=""></dd>
            </dl>

            <dl>
              <dt>{{__('mobileLogo')}}：</dt>
              <dd><img class="sma-w100" :src="detail.mobileLogo" alt=""></dd>
            </dl>

            <dl>
              <dt>{{__('listLogo')}}：</dt>
              <dd><img class="sma-w100" :src="detail.listLogo" alt=""></dd>
            </dl>

            <dl>
              <dt>{{__('addDate')}}：</dt>
              <dd>{{detail.addDate !== '' ? formatTime(detail.addDate) : ''}}</dd>
            </dl>
          </div>
        </div>

        <div class="f-button"> 
          <el-button type="primary" size="mini" @click="editDetail">{{__('btn.edit')}}</el-button>
        </div>
      </div>

      <!--edit-->
      <div class="sma-detail-a" v-if="showEdit">
        <div class="sma-info">
          <el-form :model="editForm" ref="editForm" label-width="auto" class="content">
            <el-form-item
              v-for="lang in langs"
              :key="'benefitsHeadline' + lang.key"
              :label="__('titleTxt') + '('+ lang.label +')：'"
              :prop="'benefitsHeadline.' + lang.key"
              :rules="[
                {required: true, message: __('required')}
              ]"
            >
              <el-input v-model="editForm.benefitsHeadline[lang.key]"></el-input>
            </el-form-item>

            <el-form-item
              v-for="lang in langs"
              :key="'introText' + lang.key"
              :label="__('introduce') + '('+ lang.label +')：'"
              :prop="'introText.' + lang.key"
              :rules="[
                {required: true, message: __('required')}
              ]"
            >
              <el-input v-model="editForm.introText[lang.key]"></el-input>
            </el-form-item>

            <el-form-item
              v-for="lang in langs"
              :key="'partnerName' + lang.key"
              :label="__('partner') + '('+ lang.label +')：'"
              :prop="'partnerName.' + lang.key"
              :rules="[
                {required: true, message: __('required')}
              ]"
            >
              <el-input v-model="editForm.partnerName[lang.key]"></el-input>
            </el-form-item>

            <el-form-item
              v-for="lang in langs"
              :key="'address' + lang.key"
              :label="__('address') + '('+ lang.label +')：'"
              :prop="'address.' + lang.key"
              :rules="[
                {required: true, message: __('required')}
              ]"
            >
              <el-input v-model="editForm.address[lang.key]"></el-input>
            </el-form-item>

            <el-form-item :label="__('type') + '：'" prop="type" :rules="[
                {required: true, message: __('required')}
              ]">
              <div class="sma-w420">
                <el-select v-model="editForm.type" :placeholder="__('selectType')">
                  <el-option
                    v-for="item in enums.benefitType"
                    :key="item[0]"
                    :label="item[1]"
                    :value="item[0]">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item :label="__('serviceTo') + '：'" prop="serviceTo" :rules="[
                {required: true, message: __('required')}
              ]">
              <div class="sma-w420">
                <el-select v-model="editForm.serviceTo" :placeholder="__('selectServiceTo')">
                  <el-option
                    v-for="item in enums.benefitServiceTo"
                    :key="item[0]"
                    :label="item[1]"
                    :value="item[0]">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item :label="__('discountType') + '：'" prop="discountType" :rules="[
                {required: true, message: __('required')}
              ]">
              <div class="sma-w420">
                <el-select v-model="editForm.discountType" :placeholder="__('selectDiscountType')">
                  <el-option
                    v-for="item in enums.benefitDiscountType"
                    :key="item[0]"
                    :label="item[1]"
                    :value="item[0]">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item label="折扣值"
              v-show="editForm.discountType && editForm.discountType != 'FREE_GIFT'"
              prop="discount"
              :rules="[
                {required: true, message: __('required')},
                {pattern: /^[0-9.]*$/, message: '格式错误'}
              ]"
            >
              <el-input v-model="editForm.discount">
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>

            <el-form-item label="折扣限制"
              v-show="editForm.discountType == 'FULL_X_REDUCE_Y'"
              prop="discountLimit"
              :rules="[
                {required: true, message: __('required')},
                {pattern: /^[0-9.]*$/, message: '格式错误'}
              ]"
            >
              <el-input v-model="editForm.discountLimit">
                <template slot="append">RMB</template>
              </el-input>
            </el-form-item>

            <el-form-item label="经度"
              prop="longitude"
              :rules="[
                {pattern: /^[0-9.]*$/, message: '格式错误'}
              ]"
            >
              <el-input v-model="editForm.longitude" placeholder="经度"></el-input>
            </el-form-item>

            <el-form-item label="纬度"
              prop="latitude"
              :rules="[
                {pattern: /^[0-9.]*$/, message: '格式错误'}
              ]"
            >
              <el-input v-model="editForm.latitude" placeholder="纬度"></el-input>
            </el-form-item>

            <el-form-item :label="__('pcLogo') + '(432*300px)：'" prop="pcLogo" :rules="[
                {required: true, message: __('required')}
              ]">
              <img-box water="water" :edit="true" v-model="editForm.pcLogo"></img-box>
            </el-form-item>

            <el-form-item :label="__('mobileLogo') + '(748*260px)：'" prop="mobileLogo" :rules="[
                {required: true, message: __('required')}
              ]">
              <img-box water="water" :edit="true" v-model="editForm.mobileLogo"></img-box>
            </el-form-item>

            <el-form-item :label="__('listLogo') + '(300*300px)：'" prop="listLogo" :rules="[
                {required: true, message: __('required')}
              ]">
              <img-box water="water" :edit="true" v-model="editForm.listLogo"></img-box>
            </el-form-item>

            <el-form-item :label="__('addDate') + '：'" prop="addDate" :rules="[
                {required: true, message: __('required')}
              ]">
              <el-date-picker
                v-model="editForm.addDate"
                type="date"
                :placeholder="__('selectDate')"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>

        <div class="f-button"> 
          <el-button type="primary" size="mini" @click="saveEdit">{{__('btn.save')}}</el-button>
          <el-button type="primary" size="mini" plain @click="cancelEdit">{{__('btn.cancel')}}</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {copyJson} from '../../../lib/utils';
import ImgBox from "../../com/form/img";

export default {
  name: 'mod-benefits-detail',
  props: ['id'],
  components: {
    ImgBox
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      loading: true,
      detail: null,
      editForm:null,
      showEdit: false,
      category: null
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path,
        title: vm.__('benefitsDetail')
      });
    });
  },
  created() {
    this.initPage();
  },
  methods:{
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD');
    },
    saveEdit(){
      this.$refs['editForm'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.updateInfo();
      });
    },
    updateInfo() {
      let form = this.editForm;
      form.addDate = moment(form.addDate).format('YYYY-MM-DD');

      let param = copyJson(form);
      this.$unsubscribe('add');
      this.$subs.add = this.$hub.flow([param])
        .use('benefits.addAndUpdate')
        .subscribe(
          (res) => {
            this.visible = false;
            this.cancelEdit();
            this.initPage();
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    cancelEdit(){
      this.showEdit = false;
    },
    editDetail(){
      this.resetForm();
      this.showEdit = true;
    },
    resetForm(){
      const detail = this.detail;
      this.editForm = {
        id: Number(this.id),
        benefitsHeadline: detail.benefitsHeadline,
        introText: detail.introText,
        partnerName: detail.partnerName,
        partnerId: detail.partnerId,
        address: detail.address,
        type: detail.type,
        serviceTo: detail.serviceTo,
        discountType: detail.discountType,
        discount: detail.discount,
        discountLimit: detail.discountLimit,
        longitude: detail.longitude,
        latitude: detail.latitude,
        pcLogo: detail.pcLogo,
        mobileLogo: detail.mobileLogo,
        listLogo: detail.listLogo,
        addDate: detail.addDate
      };
    },
    initPage(){
      let detail = this.$hub.flow([{
        id: Number(this.id)
      }]).use('benefits.detail');

      this.$unsubscribe('initData');
      this.$subs.initData = this.$hub.flowAll([detail])
        .subscribe(
          ([detailItem, categoryItem]) => {
            this.detail = detailItem;
            this.category = categoryItem;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>