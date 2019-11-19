<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box" v-loading="loading">

      <!--detail-->
      <div class="sma-detail-a" v-if="detail && !showEdit">
        <div class="sma-info">
          <div class="content">
            <dl v-for="lang in langs" :key="'title' + lang.key">
              <dt>{{__('titleTxt')}}({{lang.label}})：</dt>
              <dd>{{detail.title[lang.key]}}</dd>
            </dl>

            <dl v-for="lang in langs" :key="'description' + lang.key">
              <dt>{{__('introduce')}}({{lang.label}})：</dt>
              <dd>{{detail.description[lang.key]}}</dd>
            </dl>

            <dl>
              <dt>{{__('type')}}：</dt>
              <dd>{{detail.typeName}}</dd>
            </dl>

            <dl>
              <dt>{{__('category')}}：</dt>
              <dd>
                <el-tag type="info" size="small"
                  class="sma-margin-3"
                  v-if="detail.categories.length > 0"
                  v-for="(item, index) in detail.categories"
                  :key="index"
                >
                  {{item.name}}
                </el-tag>
              </dd>
            </dl>

            <dl>
              <dt>{{__('registrationStartDate')}}：</dt>
              <dd>{{detail.registrationStartDate ? moment(detail.registrationStartDate) : ''}}</dd>
            </dl>

            <dl>
              <dt>{{__('registrationEndDate')}}：</dt>
              <dd>{{detail.registrationEndDate ? moment(detail.registrationEndDate) : ''}}</dd>
            </dl>

            <dl>
              <dt>{{__('registration')}}：</dt>
              <dd>{{detail.registration}}</dd>
            </dl>

            <dl>
              <dt>{{__('isFee')}}：</dt>
              <dd>{{detail.fee ? __('yes') : __('no')}}</dd>
            </dl>

            <dl 
              v-if="detail.feeAmount && !detail.fee"
              v-for="lang in langs"
              :key="'feeAmount' + lang.key"
            >
              <dt>{{__('feeAmount')}}({{lang.label}})：</dt>
              <dd>{{detail.feeAmount[lang.key]}}</dd>
            </dl>

            <dl>
              <dt>{{__('noVacancy')}}:</dt>
              <dd>{{detail.noVacancy ? __('yes') : __('no')}}</dd>
            </dl>

            <dl>
              <dt>{{__('promotion')}}:</dt>
              <dd>{{detail.promotion ? __('yes') : __('no')}}</dd>
            </dl>

            <dl>
              <dt>{{__('poster')}}:</dt>
              <dd><img :src="detail.background" width="100" /></dd>
            </dl>

            <dl>
              <dt>{{__('eventTimeBucket')}}：</dt>
              <dd>
                <el-table
                  v-if="detail.eventTimeConfigs.length > 0"
                  :data="detail.eventTimeConfigs"
                  border
                  :fit="true"
                >
                  <el-table-column
                    type="index"
                    width="50">
                  </el-table-column>

                  <el-table-column
                    :label="__('StartTime')"
                    min-width="150">
                    <template slot-scope="scope">
                      <i class="el-icon-time sma-margin-r-5"></i>
                      <span>{{ moment(scope.row.startTime) }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="__('EndTime')"
                    min-width="150">
                    <template slot-scope="scope">
                      <i class="el-icon-time sma-margin-r-5"></i>
                      <span>{{ moment(scope.row.endTime) }}</span>
                    </template>
                  </el-table-column>
                </el-table>

                <el-table
                  v-else
                  :data="[detail]"
                  border
                  :fit="true"
                >
                  <el-table-column
                    type="index"
                    width="50">
                  </el-table-column>

                  <el-table-column
                    :label="__('StartTime')"
                    min-width="150">
                    <template slot-scope="scope">
                      <i class="el-icon-time sma-margin-r-5"></i>
                      <span>{{ moment(scope.row.startTime) }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="__('EndTime')"
                    min-width="150">
                    <template slot-scope="scope">
                      <i class="el-icon-time sma-margin-r-5"></i>
                      <span>{{ moment(scope.row.endTime) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </dd>
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
              class="sma-label-required"
              v-for="lang in langs"
              :key="lang.key"
              :label="__('titleTxt') + '('+ lang.label +')：'"
              :prop="'title' + lang.key"
            >
              <el-input v-model="editForm.title[lang.key]"></el-input>
            </el-form-item>

            <el-form-item
              class="sma-label-required"
              v-for="lang in langs"
              :key="'description' + lang.key"
              :label="__('introduce') + '('+ lang.label +')：'"
              :prop="lang.key"
            >
              <el-input v-model="editForm.description[lang.key]"></el-input>
            </el-form-item>

            <el-form-item :label="__('type') + '：'">
              <div class="sma-w420">
                <el-select :placeholder="__('select')" v-model="editForm.typeName">
                  <el-option
                    v-for="item in enums.eventType"
                    :key="item[0]"
                    :label="item[1]"
                    :value="item[0]">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item :label="__('category') + '：'">
              <div class="sma-display-ib sma-margin-3" v-if="chooseCategories">
                <el-tag size="small"
                  class="sma-margin-3"
                  v-for="(item,index) in chooseCategories"
                  closable
                  :key="item.name"
                  @close="delCategory(index)"
                >
                  {{item.name}}
                </el-tag>
              </div>

              <el-button size="small" type="primary"
                @click="addCategories">+</el-button>
            </el-form-item>

            <el-form-item :label="__('registrationStartDate') + '：'">
              <el-date-picker
                v-model="editForm.registrationStartDate"
                type="datetime"
                :placeholder="__('registrationStartDate')">
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="__('registrationEndDate') + '：'">
              <el-date-picker
                v-model="editForm.registrationEndDate"
                type="datetime"
                :placeholder="__('registrationEndDate')">
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="__('registration') + '：'">
              <el-input
                placeholder="请输入报名网址或邮箱"
                v-model="editForm.registration">
              </el-input>
            </el-form-item>

            <el-form-item :label="__('isFee') + '：'">
              <el-select  :placeholder="__('select')" v-model="editForm.fee">
                <el-option :label="__('yes')" :value="true"  :key="__('yes')"></el-option>
                <el-option :label="__('no')" :value="false" :key="__('no')"> </el-option>
              </el-select>
            </el-form-item>

            <el-form-item 
              v-if="editForm.fee"
              v-for="lang in langs"
              :key="'feeAmount' + lang.key"
              :label="__('feeAmount') + '('+ lang.label +')：'"
              :prop="lang.key"
            >
              <el-input v-model="editForm.feeAmount[lang.key]"></el-input>
            </el-form-item>

            <el-form-item :label="__('noVacancy') + '：'">
              <el-select :placeholder="__('select')" v-model="editForm.noVacancy">
                <el-option :label="__('yes')" :value="true"  :key="__('yes')"></el-option>
                <el-option :label="__('no')" :value="false" :key="__('no')"> </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="__('promotion') + '：'">
              <el-select :placeholder="__('select')" v-model="editForm.promotion">
                <el-option :label="__('yes')" :value="true"  :key="__('yes')"></el-option>
                <el-option :label="__('no')" :value="false" :key="__('no')"> </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="__('poster') + '：'">
              <img-box water="water" :edit="true" v-model="editForm.background"></img-box>
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
import {copyJson} from '../../../lib/utils';
import {showEventCategories, showChooseCategories} from '../../../component/helper/event';
import moment from 'moment';
import ImgBox from "../../com/form/img";

export default {
  name: 'mod-event-detail',
  props: ['id'],
  components: {
    ImgBox
  },
  data() {
    return {
      loading: true,
      detail: null,
      editForm:null,
      showEdit: false,
      chooseCategories: null
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
        title: vm.__('eventDetail')
      });
    });
  },
  mounted() {
    this.initPage();
  },
  methods:{
    moment(time) {
      return moment(time).format('YYYY-MM-DD HH:MM:ss');
    },
    saveEdit(){
      let languages = this.$state.apiLanguages;console.log(this.editForm)
      for(let lang of languages) {
        if(!this.editForm.title[lang.key] || !this.editForm.description[lang.key]) {
          this.$message.error(this.__('form.error'));
          return;
        }
      }

      this.chooseCategories.forEach(item => {
        if (this.editForm.categories.indexOf(item.id) == -1) {
          this.editForm.categories.push(item.id);
        }
      })

      let params = JSON.parse(JSON.stringify(this.editForm));
      params.registrationStartDate = params.registrationStartDate ? moment(params.registrationStartDate).format('YYYY-MM-DD HH:MM:ss') : null;
      params.registrationEndDate = params.registrationEndDate ? moment(params.registrationEndDate).format('YYYY-MM-DD HH:MM:ss') : null;
      this.$unsubscribe('eventManage');
      this.$subs.eventManage = this.$hub.flow([params])
        .use('event.manage')
        .subscribe(
          (res) => {
            this.showEdit = false;
            this.initPage();
            this.$message.success(this.__('message.editSuccess'));
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    },
    cancelEdit(){
      this.showEdit = false;
    },
    addCategories(){
      let self = this;
      showChooseCategories({
        isMulti: true
      }, {
        ['choose-back'](list) {
          list.forEach(item => {
            if (self.editForm.categories.indexOf(item.id) == -1) {
              self.chooseCategories.push(item);
              self.editForm.categories.push(item.id);
            }
          })
        }
      });
    },
    delCategory(index){
      this.chooseCategories.splice(index,1);
    },
    editDetail(){
      this.resetForm();
      this.showEdit = true;
    },
    resetForm(){
      let detail = this.detail,
          categories = [];
      detail.categories.forEach(item => {
        categories.push(item.id)
      });

      this.editForm = {
        eventId: detail.eventId,
        orderId: detail.orderId,
        title: detail.title,
        description: detail.description,
        background: detail.background,
        startTime: detail.startTime,
        endTime: detail.endTime,
        feeAmount: detail.feeAmount,
        fee: detail.fee,
        registration: detail.registration,
        promotion: detail.promotion,
        disabled: detail.disabled,
        disabledReason: detail.disabledReason,
        operatorId: detail.disabledReason,
        orderNo: detail.orderNo,
        noVacancy: detail.noVacancy,
        registrationStartDate: detail.registrationStartDate ? moment(detail.registrationStartDate).format('YYYY-MM-DD HH:MM') : null,
        registrationEndDate: detail.registrationEndDate ? moment(detail.registrationEndDate).format('YYYY-MM-DD HH:MM') : null,
        typeName: detail.typeName,
        setupTime: detail.setupTime,
        setupEndTime: detail.setupEndTime,
        attendeesCount: detail.attendeesCount,
        eventTimeConfigs: detail.eventTimeConfigs,
        categories: categories
      };
    },
    initPage(){
      this.$unsubscribe('detail');
      this.$subs.detail = this.$hub.flow([{
        eventId: Number(this.id)
      }])
        .use('event.detail')
        .subscribe(
          (res) => {
            this.detail = res;
            this.chooseCategories = res.categories;
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