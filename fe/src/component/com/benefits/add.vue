<template>
  <el-dialog
    :title="__('addBenefits')"
    :visible.sync="visible"
    width="800px"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form :model="form" ref="form" label-width="200px">
      <el-form-item
        v-for="lang in langs"
        :key="'benefitsHeadline' + lang.key"
        :label="__('titleTxt') + '('+ lang.label +')：'"
        :prop="'benefitsHeadline.' + lang.key"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.benefitsHeadline[lang.key]"></el-input>
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
        <el-input v-model="form.introText[lang.key]"></el-input>
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
        <el-input v-model="form.partnerName[lang.key]"></el-input>
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
        <el-input v-model="form.address[lang.key]"></el-input>
      </el-form-item>

      <el-form-item :label="__('type') + '：'" prop="type"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-select v-model="form.type" :placeholder="__('selectType')">
          <el-option
            v-for="item in enums.benefitType"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="__('serviceTo') + '：'" prop="serviceTo"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-select v-model="form.serviceTo" :placeholder="__('selectServiceTo')">
          <el-option
            v-for="item in enums.benefitServiceTo"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="__('discountType') + '：'" prop="discountType"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-select v-model="form.discountType" :placeholder="__('selectDiscountType')">
          <el-option
            v-for="item in enums.benefitDiscountType"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="折扣值"
        v-show="form.discountType && form.discountType != 'FREE_GIFT'"
        prop="discount"
        :rules="[
          {required: true, message: __('required')},
          {pattern: /^[0-9.]*$/, message: '格式错误'}
        ]"
      >
        <el-input v-model="form.discount">
          <template slot="append">RMB</template>
        </el-input>
      </el-form-item>

      <el-form-item label="折扣限制"
        v-show="form.discountType == 'FULL_X_REDUCE_Y'"
        prop="discountLimit"
        :rules="[
          {required: true, message: __('required')},
          {pattern: /^[0-9.]*$/, message: '格式错误'}
        ]"
      >
        <el-input v-model="form.discountLimit">
          <template slot="append">RMB</template>
        </el-input>
      </el-form-item>

      <el-form-item label="经度"
        prop="longitude"
        :rules="[
          {pattern: /^[0-9.]*$/, message: '格式错误'}
        ]"
      >
        <el-input v-model="form.longitude" placeholder="经度"></el-input>
      </el-form-item>

      <el-form-item label="纬度"
        prop="latitude"
        :rules="[
          {pattern: /^[0-9.]*$/, message: '格式错误'}
        ]"
      >
        <el-input v-model="form.latitude" placeholder="纬度"></el-input>
      </el-form-item>

      <el-form-item :label="__('pcLogo') + '(432*300px)：'" prop="pcLogo"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <img-box water="water" :edit="true" v-model="form.pcLogo"></img-box>
      </el-form-item>

      <el-form-item :label="__('mobileLogo') + '(748*260px)：'" prop="mobileLogo"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <img-box water="water" :edit="true" v-model="form.mobileLogo"></img-box>
      </el-form-item>

      <el-form-item :label="__('listLogo') + '(300*300px)：'" prop="listLogo"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <img-box water="water" :edit="true" v-model="form.listLogo"></img-box>
      </el-form-item>

      <el-form-item :label="__('addDate') + '：'" prop="addDate"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-date-picker
          v-model="form.addDate"
          type="date"
          :placeholder="__('selectDate')"
          :picker-options="pickerOptions"
          :rules="[
            {required: true, message: __('required')}
          ]"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="success" @click="onSave">{{__('btn.save')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import moment from 'moment';
import { copyJson } from "../../../lib/utils";
import ImgBox from "../form/img";

export default {
  name: 'com-benefits-add',
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
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        benefitsHeadline: {},
        introText: {},
        partnerName: {},
        address: {},
        type: '',
        serviceTo: '',
        discountType: '',
        discount: 0,
        discountLimit: 0,
        longitude: null,
        latitude: null,
        pcLogo: '',
        mobileLogo: '',
        listLogo: '',
        addDate: ''
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
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.addAjax();
      });
    },
    addAjax() {
      let form = this.form;
      form.addDate = moment(form.addDate).format('YYYY-MM-DD');

      let param = copyJson(form);
      this.$unsubscribe('add');
      this.$subs.add = this.$hub.flow([param])
        .use('benefits.addAndUpdate')
        .subscribe(
          (res) => {
            this.visible = false;
            this.$message.success(this.__('message.addSuccess'));
            this.$emit('add-back', res);
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    }
  }
}
</script>
