<template lang="html">
  <div class="mod sma-padding-lg" v-loading="loading">
    <div class="sma-box-card" v-if="info && !editForm">
      <div class="sma-detail-a">
        <div class="content">
          <dl>
            <dt>{{__('productName')}}：</dt>
            <dd>{{info.name}}</dd>
          </dl>

          <dl v-for="lang in langs" :key="'name' + lang.key">
            <dt>官方名称({{lang.label}})：</dt>
            <dd>{{info.i18nDisplayName[lang.key]}}</dd>
          </dl>

          <dl>
            <dt>组合数量：</dt>
            <dd>{{info.quantity}}</dd>
          </dl>

          <dl>
            <dt>{{__('productCategory')}}：</dt>
            <dd>{{info.category}}</dd>
          </dl>

          <dl>
            <dt>资源：</dt>
            <dd>
              <el-tag type="info" size="small" class="sma-margin-3" v-for="res in (info.resources || [])" :key="res.id">
                {{res.name}} 
              </el-tag>
            </dd>
          </dl>

          <dl>
            <dt>支持价格：</dt>
            <dd>
              <el-tag
                type="info"
                size="small"
                class="sma-margin-3"
                v-for="(item, index) in info.prices"
                :key="index"
              >
                {{item.currency.sign}} {{item.price}} / {{item.saleUnit | enumText(enums, 'saleUnit')}}
              </el-tag>
            </dd>
          </dl>

          <dl>
            <dt>有效天数：</dt>
            <dd>{{info.validDays}}</dd>
          </dl>
        </div>

        <div class="f-button">
          <el-button
            size="mini"
            type="primary"
            @click="startEdit()"
            v-if="!editForm">{{__('btn.edit')}}</el-button>
        </div>
      </div>
    </div>

    <div class="sma-box-card" v-if="editForm">
      <div class="sma-detail-a">
        <el-form :model="editForm" ref="form" label-width="200px" class="content" v-loading="loading">

          <el-form-item 
            :label="__('theName') + '：'"
            prop="name"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input v-model="editForm.name"></el-input>
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
            <el-input v-model="editForm.i18nDisplayName[lang.key]"></el-input>
          </el-form-item>

          <el-form-item 
            label="组合数量："
            prop="quantity"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input-number :min="1" v-model="editForm.quantity"></el-input-number>
          </el-form-item>

          <el-form-item 
            :label="__('productCategory') + '：'"
            prop="category"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-select disabled :placeholder="__('select')" v-model="editForm.category">
              <el-option :label="item[1]" :value="item[0]" v-for="item in enums.category" :key="item[0]"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            v-if="editForm.category != 'COIN'"
            label="资源："
            prop="resources"
            :rules="rules.resources"
          >
            <el-tag
              size="small"
              class="sma-margin-3"
              v-for="res in editForm.resources"
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
            <div class="sma-w420">
              <el-checkbox 
                v-for="obj in editForm.priceList"  
                v-model="obj.checked"
                :key="obj.currency.id"
              >{{obj.currency.name}}</el-checkbox>
            </div>
            <div class="sma-w420">
              <table class="price-list sma-col">
                <tbody>
                  <template 
                    v-for="obj in editForm.priceList"
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
                        <span>{{obj.currency.sign}}/{{item.unit | enumText(enums, 'saleUnit')}}</span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </el-form-item>

          <el-form-item 
            label="有效天数："
            prop="validDays"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input-number :min="1" v-model="editForm.validDays"></el-input-number>
          </el-form-item>
        </el-form>

        <div class="f-button">
          <el-button 
            size="mini"
            type="primary" 
            @click="saveEdit"
          >{{__('btn.save')}}</el-button>

          <el-button 
            size="mini"
            plain
            type="primary" 
            @click="cancelEdit"
          >{{__('btn.cancel')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {copyJson} from '../../../lib/utils';
import {showChooseResource} from '../../../component/helper/resource';
/**
 * @vuedoc
 * @exports component/mod/user/Add
 */
export default {
  name: 'mod-product-detail',
  props: ['id'],
  data() {
    let self = this;

    return {
      loading: false,
      currencyList: [],

      info: null,
      saleUnits: [],
      editForm: null,

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
            callback(new Error(self.__('message.priceError')));
          }}
        ],
        resources: [
          {validator(rule, value, callback) {
            if (!value.length) {
              return callback(new Error(self.__('required')));
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: `app页面详情(${vm.id})`
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
        .use('product.info');
      let currencyOb = this.$hub.flow([{}])
        .use('product.currencies');

      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flowAll([
        infoOb,
        currencyOb
      ])
        .subscribe(
          ([info, currencies]) => {
            this.loading = false;
            this.info = info;
            this.currencyList = currencies.rows;
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
      this.$subs.getInfo = this.$hub.flow([params])
        .use('product.info')
        .subscribe(
          (res) => {
            this.info = res;
          },
          (error) => {
            this.$message.error(error.message);
          }
        );
    },
    startEdit() {
      if (this.saleUnits.length) {
        this.updateEditForm();
        return;
      }

      this.$unsubscribe('getSaleUnits');
      this.loading = true;
      this.$subs.getSaleUnits = this.$hub.flow([{
        category: this.info.category
      }])
        .use('product.saleUnits')
        .subscribe(
          (res) => {
            this.loading = false;
            this.saleUnits = res;
            this.updateEditForm();
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    updateEditForm() {
      let editInfo = copyJson(this.info);
      let units = [];

      this.editForm = {
        id: editInfo.id,
        name: editInfo.name,
        i18nDisplayName: editInfo.i18nDisplayName,
        category: editInfo.category,
        quantity: editInfo.quantity,
        validDays: editInfo.validDays || 1,
        resources: editInfo.resources || [],
        zoneId: editInfo.zoneId || '',

        priceList: [],
      }

      // priceList
      let currencyList = this.currencyList;
      let priceList = [];
      let prdPriceObj = {};

      editInfo.prices.forEach(item => {
        if (!prdPriceObj[item.currency.id]) 
          prdPriceObj[item.currency.id] = {};
        prdPriceObj[item.currency.id][item.saleUnit] = item;
      });

      currencyList.forEach(currency => {
        let items = [];
        let existObj = prdPriceObj[currency.id];
        this.saleUnits.forEach(unit => {
          let existItem = existObj ? existObj[unit] : null;
          items.push({
            unit: unit,
            price: existItem ? existItem.price : 0,
            checked: !!existItem,
          });
        });
        priceList.push({
          currency: currency,
          items: items,
          checked: !!existObj,
          disabled: false,
        });
      });

      this.editForm.priceList = priceList;
    },
    saveEdit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }
        this.submitSave();
      });
    },
    submitSave() {
      let form = this.editForm;
      let postData = {
        id: form.id,
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

      this.$unsubscribe('saveEdit');
      this.loading = true;
      this.$subs.saveEdit = this.$hub.flow([postData])
        .use('product.modify')
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
    addResource() {
      let self = this;
      let ids = this.editForm.resources.map(item => item.id);
      showChooseResource({
        isMulti: true
      }, {
        ['choose-back'](list) {
          list.forEach(item => {
            if (ids.indexOf(item.id) != -1) return;
            self.editForm.resources.push(item);
          });
        }
      });
    },
    delResource(item) {
      let index = this.editForm.resources.indexOf(item);
      this.editForm.resources.splice(index, 1);
    },
    cancelEdit() {
      this.editForm = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.price-list {
  border: 1px solid #ddd;
  width: auto;

  td {
    border: 1px solid #ddd;
    padding: 5px;
  }
}
</style>
