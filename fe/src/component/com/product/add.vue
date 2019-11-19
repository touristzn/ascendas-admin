<template>
  <el-dialog
    title="添加产品"
    :visible.sync="visible"
    width="800px"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form v-if="form" :model="form" ref="form" label-width="200px" class="content sma-loading-top" :disabled="loading">

      <el-form-item 
        :label="__('theName') + '：'"
        prop="name"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item 
        v-for="lang in langs"
        :key="'i18nDisplayName' + lang.key"
        :label="'官方名称('+ lang.label +')：'"
        :prop="'i18nDisplayName.' + lang.key"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input v-model="form.i18nDisplayName[lang.key]"></el-input>
      </el-form-item>

      <el-form-item 
        label="组合数量："
        prop="quantity"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input-number :min="1" v-model="form.quantity"></el-input-number>
      </el-form-item>

      <el-form-item 
        :label="__('productCategory') + '：'"
        prop="category"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-select  :placeholder="__('select')" v-model="form.category" @change="getSaleUnits">
          <el-option :label="item[1]" :value="item[0]" v-for="item in enums.category" :key="item[0]"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        v-if="form.category != 'COIN'"
        label="资源："
        prop="resources"
        :rules="rules.resources"
      >
        <el-tag
          size="small"
          class="sma-margin-3"
          v-for="res in form.resources"
          :key="res.id"
          closable
          @close="delResource(res)"
        >
          {{res.name}}
        </el-tag>
        <el-button size="mini" type="primary" @click="addResource">+</el-button>
      </el-form-item>

      <el-form-item 
        label="支持价格："
        prop="priceList"
        :rules="rules.prices"
      >
        <div>
          <el-checkbox 
            v-for="obj in form.priceList"  
            v-model="obj.checked"
            :key="obj.currency.id"
          >{{obj.currency.name}}</el-checkbox>
        </div>
        <table class="price-list">
          <tbody>
            <template 
              v-for="obj in form.priceList"
            >
              <tr 
                v-if="obj.checked" 
                v-for="item in obj.items" 
                :key="obj.currency.id + '-' + item.unit"
              >
                <td>
                  <el-checkbox v-model="item.checked">选择</el-checkbox>
                </td>
                <td>
                  <div v-if="obj.checked" class="ins">
                    <el-input v-model="item.price" :disabled="!item.checked"></el-input>
                  </div>
                </td>
                <td>
                  <span>{{obj.currency.sign}} / {{item.unit | enumText(enums, 'saleUnit')}}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </el-form-item>

      <el-form-item 
        label="有效天数："
        prop="validDays"
        :rules="[
          {required: true, message: __('required')}
        ]"
      >
        <el-input-number :min="1" v-model="form.validDays"></el-input-number>
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
import {showChooseSaleType} from '../../helper/sale-type';
import {showChooseResource} from '../../helper/resource';

export default {
  name: 'com-product-add',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currencyList: [],
      form: null,

      loading: false,

      rules: {
        prices: [
          {validator(rule, value, callback) {
            let checkCount = 0;
            value.forEach(obj => {
              if (!obj.checked) return;
              obj.items.forEach(item => {
                if (!item.checked) return;
                checkCount ++;
              })
            });
            if (checkCount > 0) return callback();
            callback(new Error('价格填写不正确'));
          }}
        ],
        resources: [
          {validator(rule, value, callback) {
            if (!value.length) {
              return callback(new Error(__('required')));
            }
            return callback();
          }}
        ]
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
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flow([{}])
        .use('product.currencies')
        .subscribe(
          (res) => {
            this.loading = false;
            this.currencyList = res.rows;
            this.initForm();
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    initForm() {
      let units = [];

      this.form = {
        name: '',
        i18nDisplayName: this.getFieldLangsObj(),
        category: '',
        resources: [],
        quantity: 1,
        validDays: 1,
        zoneId: '',

        city: '',

        // 价格单元
        saleUnits: [],

        priceList: [],
      };
    },
    resetPriceList() {
      let units = [];
      let priceList = [];

      this.currencyList.forEach(currency => {
        let items = [];
        this.form.saleUnits.forEach(unit => {
          items.push({
            unit: unit,
            price: 0,
            checked: false,
          });
        });
        priceList.push({
          currency: currency,
          items: items,
          checked: true
        });
      });

      this.form.priceList = priceList;
    },
    getSaleUnits() {
      this.$unsubscribe('getSaleUnits');
      this.loading = true;
      this.$subs.getSaleUnits = this.$hub.flow([{
        category: this.form.category
      }])
        .use('product.saleUnits')
        .subscribe(
          (res) => {
            this.loading = false;
            this.form.saleUnits = res;
            this.resetPriceList();
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    addResource() {
      let self = this;
      let ids = this.form.resources.map(item => item.id);
      showChooseResource({
        isMulti: true
      }, {
        ['choose-back'](list) {
          list.forEach(item => {
            if (ids.indexOf(item.id) != -1) return;
            self.form.resources.push(item);
            self.$refs['form'].validateField('resources');
          });
        }
      });
    },
    delResource(item) {
      let index = this.form.resources.indexOf(item);
      this.form.resources.splice(index, 1);
      this.$refs['form'].validateField('resources');
    },
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
      let form = this.form;
      let postData = {
        category: form.category,
        name: form.name,
        quantity: form.quantity,
        i18nDisplayName: form.i18nDisplayName,
        validDays: form.validDays,
        resourceIds: form.resources.map(item => item.id)
      };

      let productPrices = [];
      // productPrices
      form.priceList.forEach(obj => {
        if (!obj.checked) return;
        obj.items.forEach(item => {
          if (!item.checked) return;
          productPrices.push({
            price: item.price,
            saleUnit: item.unit,
            currencyId: obj.currency.id
          });
        })
      });
      postData.prices = productPrices;

      this.$unsubscribe('add');
      this.loading = true;
      this.$subs.add = this.$hub.flow([postData])
        .use('product.add')
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
.content {
  padding-right: 100px;
}

.price-list {
  border: 1px solid #ddd;
  width: auto;

  td {
    border: 1px solid #ddd;
    padding: 5px;
  }
}
</style>
