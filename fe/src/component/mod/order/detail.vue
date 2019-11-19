<template>
  <div class="mod sma-padding-lg">
    <el-card class="box-card" v-if="detail && !form" v-loading="loading">
      <el-tabs v-model="activeTab" @tab-click="tabClick">
        <el-tab-pane label="订单信息" name="order">
          <div class="sma-detail-a" >
            <div class="content">
              <dl>
                <dt>订单号：</dt>
                <dd>{{detail.orderNo}}</dd>
              </dl>

              <dl>
                <dt>订单类型：</dt>
                <dd>{{detail.orderType | enumText(enums, 'orderType')}}</dd>
              </dl>

              <dl>
                <dt>订单状态：</dt>
                <dd>{{detail.orderStatus | enumText(enums, 'orderStatus')}}</dd>
              </dl>

              <dl>
                <dt>产品：</dt>
                <dd>
                  <router-link :to="{path: '/product/detail/' + detail.product.id}">
                    <el-tag type="primary" size="small">
                      {{ detail.product.name }}
                      / 
                      {{ detail.product.category | enumText(enums, 'category') }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl v-if="detail.children && detail.children.length">
                <dt>赠送产品信息：</dt>
                <dd>
                  <el-tag type="primary" size="small" v-for="item in detail.children" :key="item.product.id">
                    {{ item.product.name }}
                  </el-tag>
                </dd>
              </dl>

              <dl v-if="isMemberOrder">
                <dt>实际购买数量：</dt>
                <dd>
                  {{detail.quantity}}
                </dd>
              </dl>

              <dl v-if="isMemberOrder">
                <dt>合同时间：</dt>
                <dd>
                  <el-tag type="info">
                    {{detail.contractBegin | dateTime('YYYY-MM-DD HH:mm')}}
                  </el-tag>
                  <span> - </span>
                  <el-tag type="info">
                    {{detail.contractEnd | dateTime('YYYY-MM-DD HH:mm')}}
                  </el-tag>
                </dd>
              </dl>

              <dl>
                <dt>币种：</dt>
                <dd>
                  {{detail.currency.name}} {{detail.currency.sign}}
                </dd>
              </dl>

              <dl>
                <dt>原价：</dt>
                <dd>
                  {{detail.currency.sign}} {{detail.price}}
                </dd>
              </dl>

              <dl>
                <dt>折后价：</dt>
                <dd>
                  {{detail.currency.sign}} {{detail.amount}}
                </dd>
              </dl>

              <dl v-if="detail.depositFee">
                <dt>押金：</dt>
                <dd>
                  {{detail.currency.sign}} {{detail.depositFee}}
                </dd>
              </dl>

              <dl>
                <dt>使用有效期：</dt>
                <dd>
                  <el-tag type="info">
                    {{detail.effectiveBegin | dateTime('YYYY-MM-DD HH:mm')}}
                  </el-tag>
                  <span> - </span>
                  <el-tag type="info">
                    {{detail.effectiveEnd | dateTime('YYYY-MM-DD HH:mm')}}
                  </el-tag>
                  <el-button 
                    size="mini" 
                    type="primary" 
                    @click="editEffective"
                    v-if="!isPreOrder"
                  >
                    {{__('btn.edit')}}
                  </el-button>
                </dd>
              </dl>

              <dl>
                <dt>支付有效时间：</dt>
                <dd>
                  <el-tag type="info">
                    {{detail.paidBeginDate | dateTime('YYYY-MM-DD HH:mm')}}
                  </el-tag>
                  <span> - </span>
                  <el-tag type="info">
                    {{detail.paidEndDate | dateTime('YYYY-MM-DD HH:mm')}}
                  </el-tag>
                  <el-button 
                    size="mini" 
                    type="primary" 
                    @click="editPaidDate()"
                    v-if="!isPreOrder"
                  >
                    {{__('btn.edit')}}
                  </el-button>
                </dd>
              </dl>

              <dl>
                <dt>离开时间：</dt>
                <dd>
                  {{detail.leaveDate | dateTime('YYYY-MM-DD HH:mm')}}
                  <el-button 
                    size="mini" 
                    type="primary" 
                    @click="editLeaveDate()"
                    v-if="!isPreOrder"
                  >
                    {{__('btn.edit')}}
                  </el-button>
                </dd>
              </dl>

              <dl>
                <dt>下单人：</dt>
                <dd>
                  <router-link 
                    :to="{path: '/user/info/' + detail.orderer.id}" v-if="detail.orderer"
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.orderer.nickname }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl>
                <dt>制单人：</dt>
                <dd>
                  <router-link 
                    :to="{path: '/user/info/' + detail.operator.id}" v-if="detail.operator"
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.operator.nickname }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl>
                <dt>产品拥有者：</dt>
                <dd>
                  <router-link 
                    :to="{path: '/company/detail/' + detail.ownedCompany.id}" 
                    v-if="detail.ownedCompany"
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.ownedCompany.name }}
                    </el-tag>
                  </router-link>

                  <router-link 
                    :to="{path: '/user/info/' + detail.ownedUser.id}" 
                    v-if="detail.ownedUser"
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.ownedUser.nickname }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl v-if="detail.primaryUser">
                <dt>主要成员：</dt>
                <dd>
                  <router-link 
                    :to="{path: '/user/info/' + detail.primaryUser.id}" v-if="detail.primaryUser"
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.primaryUser.nickname }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl v-if="detail.payer">
                <dt>产品支付人：</dt>
                <dd>
                  <router-link 
                    :to="{path: '/user/info/' + detail.payer.id}" v-if="detail.payer"
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.payer.nickname }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl v-if="detail.users">
                <dt>产品使用人：</dt>
                <dd>
                  <router-link 
                    v-for="user in detail.users"
                    :key="user.id"
                    :to="{path: '/user/info/' + user.id}" 
                  >
                    <el-tag type="primary" size="small">
                      {{ detail.user.nickname }}
                    </el-tag>
                  </router-link>
                </dd>
              </dl>

              <dl>
                <dt>审批人：</dt>
                <dd>
                  {{detail.approver}}
                </dd>
              </dl>

              <dl>
                <dt>{{__('remark')}}：</dt>
                <dd>
                  {{detail.approveRemark}}
                </dd>
              </dl>

              <dl v-if="isMeetingRoomOrder">
                <dt>预订列表：</dt>
                <dd>
                  //
                </dd>
              </dl>

              <dl v-if="isMeetingRoomOrder">
                <dt>所属会议室：</dt>
                <dd>
                  {{detail.sourceOrderProductName}}
                </dd>
              </dl>

              <dl v-if="isMeetingRoomOrder">
                <dt>会议室订单号：</dt>
                <dd>
                  {{detail.sourceOrderNo}}
                </dd>
              </dl>

              <dl>
                <dt>下单时间：</dt>
                <dd>{{detail.createTime | dateTime}}</dd>
              </dl>

              <dl>
                <dt></dt>
                <dd>
                  <div class="sma-margin-top-50">
                    <el-button 
                      v-if="detail.orderType=='PREORDER'" 
                      type="primary" 
                      size="small" 
                      @click="convertOrder()"
                    >转换为正式订单</el-button>
                    <el-button 
                      v-if="detail.orderType=='PREORDER'" 
                      type="primary" 
                      size="small" 
                      @click="editOrder()"
                    >{{__('btn.edit')}}</el-button>
                  </div>
                </dd>
              </dl>
            </div>

            <!-- <div class="f-button">
              <el-button订单类型
                size="mini"
                type="primary"
                @click="editInfo()">{{__('btn.edit')}}</el-button>
            </div> -->
          </div>
        </el-tab-pane>

        <el-tab-pane label="订单使用人" name="users" v-loading="users.loading">
          <div>
            <el-button size="small" type="primary" @click="addUser">
              添加使用人
            </el-button>
          </div>
          <el-table
            class="sma-margin-top-20"
            :data="users.list"
            border
            :fit="true"
          >
            <el-table-column
              fixed
              prop="nickname"
              :label="__('nickname')"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="username"
              :label="__('username')"
              min-width="150"
            >
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机"
              min-width="150"
            >
            </el-table-column>
            <el-table-column
              prop="disabled"
              :label="__('status')"
              min-width="150"
            >
            </el-table-column>
            <el-table-column
              :label="__('operation')"
              fixed="right"
              min-width="150"
            >
              <template slot-scope="scope">
                <router-link :to="{ path: '/user/info/'+scope.row.id}">
                  <el-button size="mini" type="primary" plain>{{__('btn.detail')}}</el-button>
                </router-link>

                <el-button type="danger" size="mini" plain @click="removeUser(scope.row)">{{__('btn.remove')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="sma-margin-top-20 sma-text-c">
            <el-pagination
              @size-change="usersSizeChange"
              @current-change="usersCurrentChange"
              :current-page="users.page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="users.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="users.total">  
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="活动信息" name="event" v-if="isEventOrder">
          <div class="sma-detail-a" >
            <div class="content">
              <dl>
                <dt>活动类型：</dt>
                <dd>
                  <el-tag type="info" size="mini">
                    {{detail.eventInfo.typeGroupName}}
                  </el-tag>
                  <span>/</span>
                  <el-tag type="info" size="mini">
                    {{detail.eventInfo.typeName}}
                  </el-tag>
                </dd>
              </dl>

              <dl>
                <dt>活动名字：</dt>
                <dd>
                  {{ detail.eventInfo.title }}
                  <el-button type="primary" size="mini" plain @click="toEventInfo">
                    查看活动详情
                  </el-button> 
                </dd>
              </dl>

              <dl>
                <dt>活动参与人数：</dt>
                <dd>
                  {{detail.eventInfo.attendeesCount}}
                </dd>
              </dl>

              <dl>
                <dt>入场布置时间：</dt>
                <dd>
                  {{detail.eventInfo.setupTime | dateTime}}
                </dd>
              </dl>

              <dl>
                <dt>布置结束时间：</dt>
                <dd>
                  {{detail.eventInfo.setupEndTime | dateTime}}
                </dd>
              </dl>

              <dl>
                <dt>活动时间：</dt>
                <dd>
                  <div 
                    v-for="(time, index) in (detail.eventInfo.eventTimes || [])"
                    :key="index"
                    class="sma-margin-top-10"
                  >
                    <el-tag type="info">
                      {{time.startTime}}
                    </el-tag>
                    <span> - </span>
                    <el-tag type="info">
                      {{time.endTime}}
                    </el-tag>
                  </div>
                </dd>
              </dl>

              <dl>
                <dt>活动类目：</dt>
                <dd>
                  <table class="table">
                    <colgroup>
                      <col width="200">
                      <col width="200">
                      <col width="100">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>活动费用</th>
                        <th>说明</th>
                        <th>价格</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="(item, index) in detail.eventInfo.prices"
                        :key="index"
                      >
                        <td>{{item.category}}</td>
                        <td>{{item.description}}</td>
                        <td>{{detail.currency.sign}} {{item.price}}</td>
                      </tr>
                    </tbody>
                  </table>
                </dd>
              </dl>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="发票信息" name="fapiao">
          <div class="sma-detail-a" v-if="detail && !fapiaoForm">
            <div class="content" v-if="detail.fapiao">
              <dl>
                <dt>发票类型：</dt>
                <dd>
                  {{ detail.fapiao.type | enumText(enums, 'fapiaoType') }}
                </dd>
              </dl>

              <dl v-if="detail.fapiao.type!='NONE'">
                <dt>公司抬头：</dt>
                <dd>
                  {{ detail.fapiao.title }}
                </dd>
              </dl>

              <dl v-if="detail.fapiao.type!='NONE'">
                <dt>纳税人识别号：</dt>
                <dd>
                  {{ detail.fapiao.identificationNo }}
                </dd>
              </dl>

              <dl v-if="detail.fapiao.type=='VAT'">
                <dt>电话：</dt>
                <dd>
                  {{ detail.fapiao.mobile }}
                </dd>
              </dl>

              <dl v-if="detail.fapiao.type=='VAT'">
                <dt>地址：</dt>
                <dd>
                  {{ detail.fapiao.address }}
                </dd>
              </dl>

              <dl v-if="detail.fapiao.type=='VAT'">
                <dt>开户银行：</dt>
                <dd>
                  {{ detail.fapiao.bankName }}
                </dd>
              </dl>

              <dl v-if="detail.fapiao.type=='VAT'">
                <dt>开户账号：</dt>
                <dd>
                  {{ detail.fapiao.bankAccount }}
                </dd>
              </dl>
            </div>

            <div class="sma-margin-top-50">
              <el-button 
                type="primary" 
                size="small"
                @click="editFapiao"
              >{{__('btn.edit')}}</el-button>
            </div>
          </div>

          <el-form class="sma-form-c" ref="fapiao-form" label-width="120px" :model="fapiaoForm" v-if="fapiaoForm">
            <el-form-item 
              label="发票类型"
              prop="type"
              :rules="[
                {required: true}
              ]"
            >
              <el-select v-model="fapiaoForm.type">
                <el-option
                  v-for="item in enums.fapiaoType"
                  :key="item[0]"
                  :label="item[1]" 
                  :value="item[0]"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item 
              label="公司抬头" 
              prop="title" 
              v-if="fapiaoForm.type != 'NONE'"
              :rules="[
                {required: fapiaoForm.type != 'NONE', message: __('required')}
              ]"
            >
              <el-input 
                type="textarea" 
                v-model="fapiaoForm.title" 
                placeholder="公司抬头"
              ></el-input>
            </el-form-item>

            <el-form-item 
              label="纳税人识别号" 
              prop="identificationNo" 
              v-if="fapiaoForm.type != 'NONE'"
              :rules="[
                {required: fapiaoForm.type != 'NONE', message: __('required')}
              ]"
            >
              <el-input 
                type="textarea" 
                v-model="fapiaoForm.identificationNo" 
                placeholder="纳税人识别号"
              ></el-input>
            </el-form-item>

            <el-form-item 
              label="电话" 
              prop="mobile" 
              v-if="fapiaoForm.type == 'VAT'"
              :rules="[
                {required: fapiaoForm.type == 'VAT', message: __('required')}
              ]"
            >
              <el-input 
                type="textarea" 
                v-model="fapiaoForm.mobile" 
                placeholder="电话"
              ></el-input>
            </el-form-item>

            <el-form-item 
              label="地址" 
              prop="address" 
              v-if="fapiaoForm.type == 'VAT'"
              :rules="[
                {required: fapiaoForm.type == 'VAT', message: __('required')}
              ]"
            >
              <el-input 
                type="textarea" 
                v-model="fapiaoForm.address" 
                placeholder="地址"
              ></el-input>
            </el-form-item>

            <el-form-item 
              label="开户银行" 
              prop="bankName" 
              v-if="fapiaoForm.type == 'VAT'"
              :rules="[
                {required: fapiaoForm.type == 'VAT', message: __('required')}
              ]"
            >
              <el-input 
                type="textarea" 
                v-model="fapiaoForm.bankName" 
                placeholder="开户银行"
              ></el-input>
            </el-form-item>

            <el-form-item 
              label="开户账号" 
              prop="bankAccount" 
              v-if="fapiaoForm.type == 'VAT'"
              :rules="[
                {required: fapiaoForm.type == 'VAT', message: __('required')}
              ]"
            >
              <el-input 
                type="textarea" 
                v-model="fapiaoForm.bankAccount" 
                placeholder="开户账号"
              ></el-input>
            </el-form-item>

            <el-form-item size="large" class="sma-margin-top-50">
              <el-button 
                type="primary" 
                size="small"
                @click="saveEditFapiao"
              >保存更新</el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="cancelEditFapiao"
                plain
              >取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>     
    </el-card>

    <el-card class="box-card" v-if="form" v-loading="loading">
      <el-form class="sma-form-c" ref="form" label-width="120px" :model="form">
        <!-- 会员订单 -->
        <template v-if="isMemberOrder">
 
          <el-form-item 
            label="合同时间:"
            prop="contractBegin"
            :rules="rules.contract"
          >
            <el-date-picker
              v-model="form.contractBegin"
              align="right"
              type="date"
              placeholder="开始"
              :picker-options="contractBeginOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="form.contractEnd"
              align="right"
              type="date"
              placeholder="截止"
              :picker-options="contractEndOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="购买数量:">
            <el-input-number 
              v-model="form.quantity" 
              :min="1" 
              label="购买数量"
            ></el-input-number>
          </el-form-item>

          <el-form-item 
            label="是否需要押金:"
            prop="needDeposit"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-select :placeholder="__('select')" v-model="form.needDeposit">
              <el-option 
                :key="item[0]"
                :value="item[0]"
                v-for="item in enums.yesOrNo"
                :label="item[1]" 
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            v-if="form.needDeposit"
            label="押金总价:"
            prop="depositFee"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input 
              class="ins"
              v-model="form.depositFee" 
              auto-complete="off"
            >
              <template slot="append" v-if="curCurrency
              ">{{curCurrency.sign}}</template>
            </el-input>  
          </el-form-item>

          <el-form-item 
            label="折扣:"
            prop="discounts"
            :rules="rules.discounts"
          >
            <table class="table">
              <thead>
                <tr>
                  <th>{{__('StartTime')}}</th>
                  <th>{{__('EndTime')}}</th>
                  <th>折后总价</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.discounts" :key="index">
                  <td>
                    <el-date-picker
                      v-model="item.beginTime"
                      align="right"
                      type="date"
                      placeholder="开始"
                      :picker-options="discountBeginOptions"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </td>           
                  <td>
                    <el-date-picker
                      v-model="item.endTime"
                      align="right"
                      type="date"
                      placeholder="截止"
                      :picker-options="discountEndOptions"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-input 
                      v-model.number="item.discountedPrice" 
                      auto-complete="off"
                    >
                      <template slot="append" v-if="curCurrency
                      ">{{curCurrency.sign}}</template>
                    </el-input>  
                  </td>
                  <td>
                    <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      circle
                      size="mini"
                      @click="removeDiscount(item)"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="sma-margin-top-10">
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                circle
                size="mini"
                @click="addDiscount"
              ></el-button>
            </div>
          </el-form-item>

          <el-form-item label="审批人:">
            <el-checkbox-group v-model="form.approver">
              <el-checkbox 
                v-for="item in approverList"
                :key="item"
                :label="item"
              >
                <span>{{item}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>

        <!-- 会议室订单 -->
        <template v-if="isMeetingRoomOrder">
        
          <el-form-item 
            label="预订时间:"
            prop="mrDurations"
            :rules="rules.mrDurations"
          >
            <el-date-picker
              v-model="form.mrDurations[0].beginTime"
              align="right"
              type="datetime"
              placeholder="开始"
              :picker-options="mrBeginOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="form.mrDurations[0].endTime"
              align="right"
              type="datetime"
              placeholder="截止"
              :picker-options="mrEndOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>

          <el-form-item 
            label="预订房间:"
            prop="mrResourceId"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-radio-group v-model="form.mrResourceId">
              <el-radio 
                v-for="res in product.resources"
                :key="res.id"
                :label="res.id"
              >
                <span>{{res.name}}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item 
            label="折后总价:"
            prop="mrDiscountedPrice"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input
              v-model="form.mrDiscountedPrice" 
              label="折后总价"
              class="ins"
            >
              <template slot="append">
                <span v-if="curCurrency">
                  {{curCurrency.sign}}
                </span>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <!-- 活动订单 -->
        <template v-if="isEventOrder">
          
          <el-form-item 
            label="活动类型:"
            prop="eventTypeIds"
            :rules="[
              {required: true, type: 'array', min: 2, message: __('required')}
            ]"
          >
            <el-cascader
              :options="eventTypes"
              :props="{
                value: 'id',
                label: 'name'
              }"
              v-model="form.eventTypeIds"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item 
            label="活动名字:"
            prop="eventInfo.title"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input 
              v-model="form.eventInfo.title" 
              type="textarea"
              label="活动名字"
              class="ins"
            ></el-input>
          </el-form-item>

          <el-form-item 
            label="活动参与人数:"
            prop="eventInfo.attendeesCount"
            :rules="[
              {required: true, message: __('required')}
            ]"
          >
            <el-input-number
              :min="1"
              v-model="form.eventInfo.attendeesCount" 
              label="活动参与人数"
              class="ins"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="布置时间:">
            <el-date-picker
              v-model="form.eventInfo.setupTime"
              align="right"
              type="datetime"
              placeholder="入场布置时间"
              :picker-options="mrBeginOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
            <span> - </span>
            <el-date-picker
              v-model="form.eventInfo.setupEndTime"
              align="right"
              type="datetime"
              placeholder="布置结束时间"
              :picker-options="mrEndOptions"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>

          <el-form-item 
            label="活动时间:"
            prop="mrDurations"
            :rules="rules.eventDurations"
          >
            <table class="table">
              <thead>
                <tr>
                  <th>{{__('StartTime')}}</th>
                  <th>{{__('EndTime')}}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.mrDurations" :key="index">
                  <td>
                    <el-date-picker
                      v-model="item.beginTime"
                      align="right"
                      type="datetime"
                      placeholder="开始"
                      :picker-options="discountBeginOptions"
                      value-format="yyyy-MM-dd HH:mm"
                    ></el-date-picker>
                  </td>           
                  <td>
                    <el-date-picker
                      v-model="item.endTime"
                      align="right"
                      type="datetime"
                      placeholder="截止"
                      :picker-options="discountEndOptions"
                      value-format="yyyy-MM-dd HH:mm"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      circle
                      size="mini"
                      @click="removeMrDuration(item)"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                circle
                size="mini"
                @click="addMrDuration"
              ></el-button>
            </div>
          </el-form-item>

          <el-form-item 
            label="活动类目:"
            prop="eventInfo.prices"
            :rules="rules.eventPrices"
          >
            <table class="table">
              <thead>
                <tr>
                  <th>活动费用</th>
                  <th>活动价格</th>
                  <th>说明</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.eventInfo.prices" :key="index">
                  <td>
                    <el-input v-model="item.category"></el-input>
                  </td>           
                  <td>
                    <el-input v-model="item.price"></el-input>
                  </td>
                  <td>
                    <el-input type="textarea" v-model="item.description"></el-input>
                  </td>
                  <td>
                    <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      circle
                      size="mini"
                      @click="removeEventCategory(item)"
                    ></el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                circle
                size="mini"
                @click="addEventCategory"
              ></el-button>
            </div>
          </el-form-item>

          <el-form-item label="活动审批人:">
            <el-checkbox-group v-model="form.approver">
              <el-checkbox 
                v-for="item in eventApproverList"
                :key="item"
                :label="item"
              >
                <span>{{item}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item :label="__('remark') + ':'">
            <el-input 
              v-model="form.approveRemark" 
              type="textarea"
              :label="__('remark')"
              class="ins"
            ></el-input>
          </el-form-item>
        </template>

        <el-form-item size="large" class="sma-margin-top-50">
          <el-button 
            type="primary" 
            size="small"
            @click="saveOrder"
          >保存更新</el-button>
          <el-button 
            type="primary" 
            size="small"
            @click="cancelEditOrder"
            plain
          >取消</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        title="提示"
        :visible.sync="calcTipShow"
        width="640px">

        <el-form class="sma-form-c" label-width="120px" v-if="calcPriceResult" :disabled="calcLoading">
          <el-form-item label="标准总价：">
            {{calcPriceResult.currency.sign}} {{calcPriceResult.price}}
          </el-form-item>
          <el-form-item label="折后总价：">
            {{calcPriceResult.currency.sign}} {{calcPriceResult.amount}}
          </el-form-item>
          <el-form-item label="押金价格：">
            <span v-if="calcPriceResult.depositFee">
              {{calcPriceResult.currency.sign}} {{calcPriceResult.depositFee}}
            </span>
            <span v-if="!calcPriceResult.depositFee">
              无
            </span>
          </el-form-item>
          <el-form-item label="每月应付：">
            <el-table :data="calcPriceResult.pricePerMonth">
              <el-table-column label="开始">
                <template slot-scope="scope">
                  {{scope.row.beginTime | dateTime}}
                </template>
              </el-table-column>
              <el-table-column label="结束">
                <template slot-scope="scope">
                  {{scope.row.endTime | dateTime}}
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template slot-scope="scope">
                  {{calcPriceResult.currency.sign}}{{scope.row.amount}}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="折扣信息：">
            <span v-if="!calcPriceResult.discounts">
              无
            </span>
            <el-table v-if="calcPriceResult.discounts" :data="calcPriceResult.discounts">
              <el-table-column label="开始">
                <template slot-scope="scope">
                  {{scope.row.beginTime | dateTime}}
                </template>
              </el-table-column>
              <el-table-column label="结束">
                <template slot-scope="scope">
                  {{scope.row.endTime | dateTime}}
                </template>
              </el-table-column>
              <el-table-column label="折后总价">
                <template slot-scope="scope">
                  {{calcPriceResult.currency.sign}}{{scope.row.discountedPrice}}
                </template>
              </el-table-column>
              <el-table-column label="折扣率">
                <template slot-scope="scope">
                  {{(scope.row.discountRate * 100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
  
        <div slot="footer" class="dialog-footer" v-loading="calcLoading">
          <el-button @click="calcTipShow = false">取 消</el-button>
          <el-button type="primary" @click="ensureSave">确认更新</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment';
import {
  showEditEffective, 
  showEditPaidDate,
  showEditLeave
} from '../../helper/order';
import {copyJson} from '../../../lib/utils';
import * as BuyTool from '../../../util/buy-tool';
import { showChooseUser } from '../../helper/user';

export default {
  name: 'mod-order-detail',
  props: ['id'],
  data() {
    return {
      activeTab: 'order',

      loading: true,

      detail: null,

      users: {
        loading: false,
        page: 1,
        pageSize: 20,
        total: 0,
        list: [],
      },

      // 活动类别
      eventTypes: [],

      // 计算价格
      calcTipShow: false,
      calcPriceResult: null,
      calcData: null,
      calcLoading: false,

      // 审批人
      approverList: BuyTool.getApprovers(),
      eventApproverList: BuyTool.getApprovers('event'),

      form: null,
      fapiaoForm: null,

      contractBeginOptions: {
        disabledDate(time) {
          return false;
        }
      },

      contractEndOptions: {
        disabledDate(time) {
          return false;
        }
      },

      mrBeginOptions: {
        disabledDate(time) {
          return false;
        }
      },

      mrEndOptions: {
        disabledDate(time) {
          return false;
        }
      },

      discountBeginOptions: {
        disabledDate(time) {
          return false;
        }
      },

      discountEndOptions: {
        disabledDate(time) {
          return false;
        }
      }
    }
  },
  computed: {
    rules() {
      let self = this;
      
      return {
        discounts: [
          {validator(rule, value, callback) {
            let discounts = self.form.discounts;
            let error = '';

            discounts.forEach(item => {
              if (error) return;
              
              if (!item.beginTime || !item.endTime || !item.discountedPrice) {
                error = new Error('折扣信息填写错误');
                return;
              }

              let start = moment(item.beginTime).valueOf();
              let end = moment(item.endTime).valueOf();
              if (start >= end) {
                error = new Error('折扣信息填写错误');
                return;
              }
            });

            callback(error || undefined);
          }}
        ],
        contract: [
          {validator(rule, value, callback) {
            let beginTime = self.form.contractBegin;
            let endTime = self.form.contractEnd;
            let contractBegin = moment(beginTime).valueOf();
            let contractEnd = moment(endTime).valueOf();

            if (!beginTime || !endTime) {
              return callback(new Error('合同时间不完整'));
            }

            if (contractEnd <= contractBegin) {
              return callback(new Error('合同结束时间必须大于开始时间'));
            }

            callback();
          }}
        ],
        mrDurations: [
          {validator(rule, value, callback) {
            let beginTime = self.form.mrDurations[0].beginTime;
            let endTime = self.form.mrDurations[0].endTime;
            let begin = moment(beginTime).valueOf();
            let end = moment(endTime).valueOf();

            if (!beginTime || !endTime) {
              return callback(new Error('预订时间填写不正确'));
            }

            if (end <= begin) {
              return callback(new Error('预订时间填写不正确'));
            }

            callback();
          }}
        ],
        eventDurations: [
          {validator(rule, value, callback) {
            let discounts = self.form.mrDurations;
            let error = '';

            discounts.forEach(item => {
              if (error) return;

              if (!item.beginTime || !item.endTime) {
                error = new Error('活动时间填写不正确');
                return;
              }

              let start = moment(item.beginTime).valueOf();
              let end = moment(item.endTime).valueOf();
              if (start >= end) {
                error = new Error('活动时间填写不正确');
                return;
              }
            });

            if (!error && !self.form.mrDurations.length) {
              error = new Error(__('required'));
            }

            callback(error || undefined);
          }}
        ],
        eventPrices: [
          {validator(rule, value, callback) {
            let prices = self.form.eventInfo.prices;
            let error = '';

            prices.forEach(item => {
              if (error) return;

              if (!item.category) {
                error = new Error('活动类目填写不正确');
                return;
              }
            });

            if (!error && !self.form.eventInfo.prices.length) {
              error = new Error(__('required'));
            }

            callback(error || undefined);
          }}
        ],
      }
    },
    enums() {
      return this.$state.enums.all;
    },
    curCurrency() {
      return this.detail.currency;
    },
    isEventOrder() {
      if (!this.detail) return false;
      return this.detail.productGroup == 'EVENT';
    },
    isMeetingRoomOrder() {
      if (!this.detail) return false;
      return this.detail.productGroup == 'MEETINGROOM';
    },
    isMemberOrder() {
      if (!this.detail) return false;
      return this.detail.productGroup == 'MEMBERSHIP';
    },
    isPreOrder() {
      if (!this.detail) return false;
      return this.detail.orderType == 'PREORDER';
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: `订单详情(${vm.id})`
      });
    });
  },
  mounted() {
    this.refreshMod();
  },
  methods: {
    refreshMod() {
      let eventTypesOb = this.$hub.flow([{}])
        .use('order.eventTypes');
      let detailOb = this.$hub.flow([{ id: this.id }])
        .use('order.detail');

      this.loading = true;
      this.$unsubscribe('initData');
      this.$subs.initData = this.$hub.flowAll([
        eventTypesOb,
        detailOb
      ])
        .subscribe(
          ([eventTypes, detail]) => {
            this.eventTypes = eventTypes;
            this.detail = detail;
            this.loading = false;
          },
          (err) => {
            this.$message.error(err.message);
            this.loading = false;
          }
        );
    },
    tabClick(tab, event) {
      if (this.activeTab == 'users') {
        this.updateUserList();
      }
    },
    usersSizeChange(val) {
      this.users.pageSize = val;
      this.updateUserList();
    },
    usersCurrentChange(val) {
      this.users.page = val;
      this.updateUserList();
    },
    updateUserList() {
      let params = {
        page: this.users.page,
        id: Number(this.id),
        count: this.users.pageSize,
      };

      this.$unsubscribe('updateUserList');
      this.users.loading = true;
      this.$subs.updateUserList = this.$hub.flow([params])
        .use('order.listOrderUsers')
        .subscribe(
          (res) => {
            this.users.list = res.rows;
            this.users.total = res.total;
            this.users.loading = false;
          },
          (err) => {
            this.users.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    addUser() {
      let self = this;
      showChooseUser({isMulti: true}, {
        ['choose-back'](users) {
          let params = {
            id: Number(self.id),
            userIds: users.map(item => item.id),
            bindingOp: 'BIND'
          };

          self.$unsubscribe('addUser');
          self.users.loading = true;
          self.$subs.addUser = self.$hub.flow([params])
            .use('order.bindUser')
            .subscribe(
              (res) => {
                self.users.loading = false;
                self.updateUserList();
              },
              (err) => {
                self.users.loading = false;
                self.$message.error(err.message);
              }
            );
        }
      });
    },
    removeUser(item) {
      let self = this;
      let params = {
        id: Number(self.id),
        userIds: [item.id],
        bindingOp: 'UNBIND'
      };

      self.$unsubscribe('removeUser');
      self.users.loading = true;
      self.$subs.removeUser = self.$hub.flow([params])
        .use('order.bindUser')
        .subscribe(
          (res) => {
            self.users.loading = false;
            self.updateUserList();
          },
          (err) => {
            self.users.loading = false;
            self.$message.error(err.message);
          }
        );
    },
    editEffective(item, index) {
      let self = this;

      showEditEffective({ order: this.detail }, {
        ['edit-back'](data) {
          this.refreshMod();
        }
      });
    },
    editPaidDate(item, index) {
      let self = this;

      showEditPaidDate({ order: this.detail }, {
        ['edit-back'](data) {
          this.refreshMod();
        }
      });
    },
    editLeaveDate(item, index) {
      let self = this;

      showEditLeave({ order: this.detail }, {
        ['edit-back'](data) {
          this.refreshMod();
        }
      });
    },
    convertOrder() {
      this.$confirm('确定转为正式订单?', this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        this.$unsubscribe(`convertOrder`);
        this.loading = true;
        this.$subs[`convertOrder`] = this.$hub.flow([{
          id: this.detail.id
        }])
          .use('order.convertToNormal')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.editSuccess'));
              this.refreshMod();
            },
            (err) => {
              this.$message.error(err.message);
              this.loading = false;
            }
          );
      });
    },
    editFapiao() {
      // fapiao
      this.fapiaoForm = Object.assign({
        type: 'NONE',
        address: '',
        bankAccount: '',
        bankName: '',
        identificationNo: '',
        mobile: '',
        title: '',
      }, this.detail.fapiao || {});
    },
    cancelEditFapiao() {
      this.fapiaoForm = null;
    },
    saveEditFapiao() {
      console.log(this.$refs)
      this.$refs['fapiao-form'].validate((valid) => {
        if (!valid) {
          this.$message.error(this.__('form.error'));
          return false;
        }

        this.loading = true;
        this.$unsubscribe('saveEditFapiao');
        this.$subs.saveEditFapiao = this.$hub.flow([{
          id: this.detail.id,
          fapiao: this.fapiaoForm
        }])
          .use('order.selectiveUpdate')
          .subscribe(
            (res) => {
              this.loading = false;
              this.$message.success(this.__('message.updateSuccess'));
              this.fapiaoForm = null;
              this.detail.fapiao = res.fapiao;
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    },
    editOrder() {
      this.resetForm();
    },
    saveOrder() {
      this.computePrice();
    },
    cancelEditOrder() {
      this.form = null;
    },
    resetForm() {
      let detail = this.detail;

      let form = {
        // 使用时间（非meetingroom）
        contractBegin: '',
        contractEnd: '',

        // 预订时间段
        mrDurations: [
          {
            beginTime: '',
            endTime: '',
          }
        ],
        // 折后总价
        mrDiscountedPrice: '',
        // 资源
        mrResourceId: '',

        // 审批人
        approver: [],

        // 折扣时段
        discounts: [],

        // 是否需要押金
        needDeposit: false,
        // 自定义押金
        depositFee: 0,

        // 实际购买数量
        quantity: 1,

        // 活动信息
        // 活动备注
        approveRemark: '',
        eventInfo: {
          // 活动参与人数
          attendeesCount: '',
          // 活动名字
          title: '',
          // 入场布置时间
          setupTime: '',
          // 布置结束时间
          setupEndTime: '',
          // 活动类别
          eventTypeIds: [],
          // 活动细节
          prices: [
            {
              category: '场地 Venue',
              description: '',
              price: 0,
            }
          ]
        },

        fapiao: null
      };

      if (detail.deposit) {
        form.needDeposit = true;
        form.depositFee = detail.deposit;
      }

      form.quantity = detail.quantity;
      form.approveRemark = detail.approveRemark || '';

      // 会员订单
      if (detail.productGroup == 'MEMBERSHIP') {
        form.contractBegin = moment(detail.contractBegin).format('YYYY-MM-DD');
        form.contractEnd = moment(detail.contractEnd).format('YYYY-MM-DD');
        form.approver = detail.approver ? detail.approver.split(',') : [];
        form.discounts = detail.discounts || [];
        if (!form.discounts.length) {
          form.discounts.push({
            beginTime: '',
            endTime: '',
            discount: 1,
            discountedPrice: '',
          });
        }
      }
      
      // 会议室订单
      if (detail.productGroup == 'MEETINGROOM') {
        //
      }

      // 活动订单
      if (detail.productGroup == 'EVENT') {
        let event = detail.eventInfo;
        let eventTypeId = event.eventTypeId;
        let eventTypeIds = [];

        if (eventTypeId) {
          this.eventTypes.forEach(item => {
            item.children.forEach(item2 => {
              if (item2.id == eventTypeId) {
                eventTypeIds = [item.id, eventTypeId];
              }
            });
          });
        }

        form.eventInfo = {
          // 活动参与人数
          attendeesCount: event.attendeesCount || 1,
          // 活动名字
          title: event.title || '',
          // 入场布置时间
          setupTime: event.setupTime || '',
          // 布置结束时间
          setupEndTime: event.setupEndTime || '',
          // 活动类别
          eventTypeIds: eventTypeIds,
          // 活动细节
          prices: event.prices || []
        };

        if (!form.eventInfo.prices.length) {
          form.eventInfo.prices.push({
            category: '场地 Venue',
            description: '',
            price: 0,
          });
        }
      }

      this.form = form;
    },
    addDiscount() {
      this.form.discounts.push({
        beginTime: '',
        endTime: '',
        discount: 1,
        discountedPrice: ''
      });
    },
    removeDiscount(item) {
      let index = this.form.discounts.indexOf(item);
      this.form.discounts.splice(index, 1);
    },
    addMrDuration() {
      this.form.mrDurations.push({
        beginTime: '',
        endTime: ''
      });
    },
    addEventCategory() {
      this.form.eventInfo.prices.push({
        category: '场地 Venue',
        description: '',
        price: 0
      });
    },
    removeEventCategory(item) {
      let index = this.form.eventInfo.prices.indexOf(item);
      this.form.eventInfo.prices.splice(index, 1);
    },
    removeMrDuration(item) {
      let index = this.form.mrDurations.indexOf(item);
      this.form.mrDurations.splice(index, 1);
    },
    validateField(prop) {
      this.$refs['form'].validateField(prop);
    },
    computePrice() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitComputePrice();
        } else {
          this.$message.error(this.__('form.error'));
        }
      });
    },
    submitComputePrice() {
      let postData = {};

      // 活动订单
      if (this.isEventOrder) {
        postData.eventInfo = {
          title: this.form.eventInfo.title,
          attendeesCount: this.form.eventInfo.attendeesCount,
          prices: this.form.eventInfo.prices,
          eventTypeId: this.form.eventTypeIds[1]
        }
        // setup time
        if (
          this.form.eventInfo.setupTime 
          && this.form.eventInfo.setupEndTime
        ) {
          postData.eventInfo.setupTime = this.form.eventInfo.setupTime;
          postData.eventInfo.setupEndTime = this.form.eventInfo.setupEndTime;
        }

        // reservationPeriods
        postData.reservationPeriods = [];
        this.form.mrDurations.forEach(function(item) {
          postData.reservationPeriods.push({
            beginTime: moment(item.beginTime).startOf('minute').valueOf(),
            endTime: moment(item.endTime).startOf('minute').valueOf(),
          });
        }.bind(this));

        // resourceIds
        postData.resourceIds = this.product.resources.map(item=>item.id);
        postData.productGroup = 'EVENT';
      } 
      
      // 会议室订单
      if (this.isMeetingRoomOrder) {
        // 使用房间
        postData.resourceIds = [this.form.mrResourceId];
        // 预订时间
        postData.reservationPeriods = [];
        this.form.mrDurations.forEach((item) => {
          postData.reservationPeriods.push({
            beginTime: moment(item.beginTime).startOf('minute').valueOf(),
            endTime: moment(item.endTime).startOf('minute').valueOf(),
          });
        });
        // cm折扣
        postData.discounts = [];
        if (this.form.mrDiscountedPrice !== '') {
          postData.discounts.push({
            discountedPrice: this.form.mrDiscountedPrice
          });
        }
      } 

      // 会员订单
      if (this.isMemberOrder) {
        // 折扣
        postData.discounts = [];
        this.form.discounts.forEach((obj) => {
          if (!obj.beginTime || !obj.endTime || !obj.discountedPrice) {
            return;
          }

          postData.discounts.push({
            beginTime: moment(obj.beginTime).startOf('day').valueOf(),
            endTime: moment(obj.endTime).startOf('day').valueOf(),
            discountedPrice: obj.discountedPrice
          });
        });

        // 开始结束时间
        postData.contractBegin = moment(this.form.contractBegin).startOf('day').valueOf();
        postData.contractEnd = moment(this.form.contractEnd).startOf('day').valueOf();

        // 押金
        if (this.form.needDeposit) {
          postData.depositFee = this.form.depositFee;
        }
      }

      postData.orderId = this.detail.id;
      postData.quantity = this.form.quantity;
      postData.approver = this.form.approver.join(',');
      postData.fapiao = this.form.fapiao;

      this.loading = true;
      this.$unsubscribe('calculatePrice');
      this.$subs.calculatePrice = this.$hub.flow([postData])
        .use('order.reCalculatePrice')
        .subscribe(
          (data) => {
            this.calcData = postData;
            this.calcPriceResult = data;
            this.loading = false;
            this.calcTipShow = true;
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    ensureSave() {
      this.calcLoading = true;
      this.$unsubscribe('ensureSave');
      this.$subs.ensureSave = this.$hub.flow([this.calcData])
        .use('order.updatePreOrder')
        .subscribe(
          (res) => {
            this.calcLoading = false;
            this.calcTipShow = false;
            this.$message.success(this.__('message.updateSuccess'));
            this.form = null;
            this.refreshMod();
          },
          (error) => {
            this.calcLoading = false;
            this.$message.error(error.message);
          }
        );
    },
    toEventInfo() {
      this.$unsubscribe(`evetInfo`);
      this.$subs[`evetInfo`] = this.$hub.flow([{
        eventId: this.detail.id
      }])
        .use('event.getByOrder')
        .subscribe(
          (res) => {
            this.$router.push(`/event/detail/${res.eventId}`);
          },
          (err) => {
            this.$message.error(err.message);
          }
        );
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.table {
  width: auto;
  border: 1px solid #eee;
  table-layout: fixed;

  td, th {
    padding: 5px;
    border: 1px solid #eee;
  }
}

.el-input, 
.el-select,
.el-input-number,
.el-textarea {
  width: 250px;
}
</style>
