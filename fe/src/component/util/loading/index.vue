<template>
  <div class="loading">
      <i class="fa fa-cog fa-spin"></i>
      <p class="desc">{{text}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>

<style lang="less" scoped>
    .loading {
        width: 100%;
        text-align: center;
    }
</style>
