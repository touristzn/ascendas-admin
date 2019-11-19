<template>
  <div class="guide">
    <h1 class="guide-title" v-if="info">
      {{info.name}}
    </h1>
    <div class="guide-content faq-format"  v-if="info" v-html="info.content"></div>
  </div>
</template>

<script>
import VueLoading from 'vue-loading-template';
import qs from 'qs';

let qsString = location.search.substring(1);
let query = qs.parse(qsString);
let language = query.language || 'zh-cn';

export default {
  components: {
    VueLoading,
  },
  data() {
    return {
      loading: false,
      shortName: `GUIDE-${language.toUpperCase()}`,
      info: null
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$subs.initData = this.$hub.flow([{
        shortName: this.shortName
      }])
        .use('guide.openInfo')
        .subscribe(
          (res) => {
            this.info = res;
          },
          (error) => {
            alert(error.message);
          }
        );
    }
  }
}
</script>