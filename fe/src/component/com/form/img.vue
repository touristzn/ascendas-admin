<template>
  <ul class="img-list">
    <li 
      class="img-item"
      :style="{width: size + 'px', height: size + 'px'}"
      v-if="currentImg || !edit"
    >
      <div class="img-show">
        <img
          :src="currentImg" 
          alt=""
        >
        <div class="img-cover">
          <div>
            <el-button 
              :circle="true"
              class="btn"
              size="mini" 
              icon="el-icon-zoom-in"
              @click="openImg()"
            ></el-button>
            <el-button 
              :circle="true"
              class="btn"
              size="mini" 
              icon="el-icon-delete"
              v-if="edit" 
              @click="deleteImg()"
            ></el-button>
            <el-button 
              :circle="true"
              class="btn"
              size="mini" 
              icon="el-icon-edit"
              v-if="edit"
              @click="uploadImg"
            ></el-button>
          </div>
        </div>
      </div>
    </li>
    <li 
      class="img-item" 
      :style="{width: size + 'px', height: size + 'px'}"
      v-if="!currentImg && edit"
    >
      <div class="img-upload" @click="uploadImg">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </li>
  </ul>
</template>

<script>
import { showOssUploader } from "../../helper/uploader";

export default {
  name: 'com-form-img',
  model: {
    prop: 'img',
    event: 'change'
  },
  props: {
    // 图片
    img: {
      type: String,
      default: ''
    },
    // 大小
    size: {
      type: Number,
      default: 100
    },
    // 是否可编辑
    edit: {
      type: Boolean,
      default: false
    },
    // 水印
    water: {
      type: String,
      default: ''
    },
    // 给上传组件的属性
    // 见 com/uploader/oss.vue props
    uploadOptions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentImg: ''
    }
  },
  computed: {
    //
  },
  mounted() {
    this.currentImg = this.img;
  },
  methods: {
    openImg() {
      window.open(this.currentImg);
    },
    deleteImg() {
      this.currentImg = '';
      this.$emit('change', this.currentImg);
    },
    uploadImg() {
      let self = this;
      let options = Object.assign({}, this.uploadOptions, {
        ossStyle: this.water
      });
      showOssUploader(options, {
        ['upload-back'](url) {
          self.currentImg = url;
          self.$emit('change', self.currentImg);
        }
      });
    }
  },
  watch: {
    img(value) {
      this.currentImg = value;
    }
  }
}
</script>

<style lang="scss" scoped>
.img-list {
  display: flex;
}

.img-item {
  cursor: pointer;
  position: relative;
  margin: 0 10px 10px 0;
}

.img-upload {
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-show {
  display: none;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  .img-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 9;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .5);

    .btn {
      padding: 5px;
      margin: 2px;
    }
  }

  &:hover .img-cover {
    display: flex;
  }
}
</style>
