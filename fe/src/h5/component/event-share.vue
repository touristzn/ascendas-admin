<template>
  <div class="page-event-share">
    <vue-loading
      v-show="loading"
      type="spiningDubbles"
      color="#409eff"
      :size="{width: '30px', height: '30px'}">
    </vue-loading>

    <div v-if="!loading && detail">
      <div class="info-title">
        <div class="img">
          <img :src="detail.background" alt=""/>
        </div>
        <h2>{{detail.title}}</h2>
        <div class="list">
          <dl>
            <dt>
              <i class="fa fa-clock-o"></i>
              <span>{{__('eventTime')}}：</span>
            </dt>
            <dd>{{formatTime(detail.startTime)}} - {{formatTime(detail.endTime)}}</dd>
          </dl>
          <dl>
            <dt>
              <i class="fa fa-map-marker"></i>
              <span>{{__('eventAddress')}}：</span>
            </dt>
            <dd>{{detail.eventArea.place}}</dd>
          </dl>
        </div>
      </div>

      <div class="info-content">
        <h6>{{__('eventIntroduce')}}</h6>
        <div class="introduce">
          <p>{{detail.description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueLoading from 'vue-loading-template';
import moment from 'moment';
import {getQueryString} from '../../util/getQueryString'

export default {
  components: {
    VueLoading,
  },
  data() {
    return {
      loading: true,
      detail: null
    }
  },
  created() {
    this.initData();
  },
  methods: {
    formatTime(time) {
      return moment(time).format('MM-DD h:mm');
    },
    initData() {
      let params = {
        eventId: getQueryString('eventId')
      };
      this.$unsubscribe('eventShare');
      this.$subs.eventShare = this.$hub.flow([params])
        .use('event.share')
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
    }
  }
}
</script>