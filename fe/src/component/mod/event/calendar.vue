<template>
  <div class="mod sma-padding-lg">
    <div class="sma-flex-box">
      <div class="sma-calendar" ref="box" v-loading="loading">
        <div class="content">
          <div class="sma-margin-top-20">
            <div ref="calendar"></div>
          </div>
          <div v-show="showPopup">
            <div id="event-calendar-popup" class="box event-calendar-popup">
              <h3>{{eventText.title}}</h3>
              <p>{{eventText.start}} - {{eventText.end}}</p>
              <ul>
                <li>
                  <span>{{__('orderStatus')}}：</span>
                  <em>{{eventText.orderStatus}}</em>
                </li>
                <li>
                  <span>{{__('productName')}}：</span>
                  <em>{{eventText.productName}}</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import $ from 'jquery';
import cal from 'fullcalendar/dist/fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';

export default {
  name: 'mod-event-calendar',
  data() {
    return {
      loading: true,
      dimension: "MONTH",
      nowTime: moment(new Date()),
      dataList: null,
      eventList: [],
      showPopup: false,
      eventText: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path,
        title: vm.__('eventCalendar')
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.initCal();
    })
  },
  computed: {
    langs() {
      return this.$state.apiLanguages;
    }
  },
  methods: {
    initCal() {
      const _this = this;
      const $calendar = _this.$calendar = $(_this.$refs.calendar);
      const $box = $(_this.$refs.box);
      $calendar.fullCalendar({
        customButtons: {
          monthButton: {
            theme: "circle-triangle-e",
            text: _this.__('month'),
            click: () => {
              _this.dimension = "MONTH";
              $calendar.fullCalendar('changeView', "month");
            }
          },
          weekButton: {
            text: _this.__('week'),
            click: () => {
              _this.dimension = "WEEK";
              $calendar.fullCalendar('changeView', "agendaWeek");
            }
          },
          todayButton: {
            text: _this.__('today'),
            click: () => {
              $calendar.fullCalendar('today');
            }
          }
        },

        header: {
          left: 'prev,next todayButton',
          center: 'title',
          right: 'monthButton,weekButton'
        },
        // defaultView: "agendaWeek",   //进入组件默认渲染的视图，默认为month
        defaultDate: _this.nowTime.toDate(),
        nowIndicator: true,
        editable: true,
        allDayText: _this.__('allDay'),
        slotEventOverlap: false, //相同时间段的多个日程视觉上是否允许重叠
        timeFormat: 'H(:mm)', //全局的日期显示格式
        slotLabelFormat : "HH(:mm)", //日期视图左边那一列显示的每一格日期时间格式
        columnFormat: 'ddd',//设置显示日历每列表头信息的格式文本
        titleFormat: "YYYY.MM", //顶部title区域格式化
        displayEventTime: false, //每一个日程块中是否显示时间，默认true显示
        eventLimit: true, //数据条数太多时，限制显示条数
        eventLimitText: "more",       //当一块区域内容太多以"+2 more"格式显示时
        nextDayThreshold: '00:00:01', //跨天的时间从0点开始
        locale: _this.locale,

        eventClick: function (event) {
          let url = '/event/detail/' + event.id;
          _this.$router.push(url);
        },

        events: function (start, end, timezone, callback) {
          _this.nowTime = moment(start).format('YYYY-MM-DD');
          _this.queryEvents(callback);
        },

        viewRender: function (view, element) {
          if(view.name == "agendaWeek") {
            $box.find('.fc-day-header').each(function(){
              let weekData = $(this).data('date').split('-')[2];
              $(this).prepend('<span class="sma-weekDate">'+weekData+'</span>')
            });
          }

         const cls = {
            agendaWeek: '.fc-weekButton-button',
            month: '.fc-monthButton-button'
          }[view.type];

          $box.find('.fc-monthButton-button, .fc-weekButton-button').removeClass('active');
          $box.find(cls).addClass('active');
        },

        eventMouseover: function (event, jsEvent, view) {
          const d = document.getElementById('event-calendar-popup');

          $('.event-calendar-popup').css('border-top', 'solid 3px ' + event.color)

          _this.showPopup = true;
          _this.eventText = event;

          _this.dataList.forEach(item => {
            if(item.title == event.title) {
              _this.eventText.start = moment(item.startTime).format('YYYY.MM.DD H:mm a');
              _this.eventText.end = moment(item.endTime).format('YYYY.MM.DD H:mm a');
            }
          });

          d.style.position = "absolute";
          d.style.zIndex = 10;
          $box.on('mousemove.eventCalenDar', function (e) {
            d.style.left = (e.pageX - 185) + 'px';
            d.style.top = (e.pageY - 24) + 'px';
          })
        },

        eventMouseout: function (event, jsEvent, view) {
          _this.showPopup = false;
          _this.eventText = "";
          $box.off('mousemove.eventCalenDar');
        }
      });
    },
    queryEvents(callback) {
      setTimeout(() => {
        const view = this.$calendar.fullCalendar('getView'); //月视图时获取当前月
        const params = {
          nowTime: this.dimension == 'WEEK' ? this.nowTime : view.title.replace(/\./g, "-") + '-01',
          calendarType: this.dimension
        };
        this.$unsubscribe('queryEvents');
        this.$subs.queryEvents = this.$hub.flow([params])
          .use('event.calendar')
          .subscribe(
            (res) => {
              this.dataList = res;
              this.formatEvents(this.dataList);
              callback && callback(this.eventList);
              this.loading = false;
            },
            (err) => {
              this.loading = false;
              this.$message.error(err.message);
            }
          );
      }, 50);
    },
    formatEvents(eventList) {
      let parsedEvents = [];

      eventList.forEach(function(item) {
        const startDate = moment(item.startTime).format('YYYY-MM-DD');
        const endDate = moment(item.endTime).format('YYYY-MM-DD');

        let obj = {
          id: item.eventId,
          title: item.title,
          start: startDate !== endDate ? startDate : moment(item.startTime),
          end: endDate !== startDate ? moment(item.endTime).add(1, 'day').format('YYYY-MM-DD') : moment(item.endTime),
          orderStatus: item.orderStatus,
          productName: item.productName,
          color: ""
        };

        if (obj.orderStatus == "NOT_START") {
          obj.color = "#DCDFE6";
        } else if (obj.orderStatus == "ONGOING") {
          obj.color = "#409EFF";
        } else if (obj.orderStatus == "FINISHED") {
          obj.color = "#4CAF50";
        } else {
          obj.color = "#F56C6C";
        }
        
        parsedEvents.push(obj);
      });

      this.eventList = parsedEvents;
    },
    // renderEvents(events) { //重新渲染数据  有筛选条件可以调用此方法
    //   this.$calendar.fullCalendar('renderEvents', events)
    // },
    // removeEvents() {
    //   this.$calendar.fullCalendar('refetchEvents')
    // }
  }
}
</script>


