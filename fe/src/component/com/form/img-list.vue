<template>
  <ul class="img-list">
    <li 
      class="img-item"
      :style="{width: itemSize + 'px', height: itemSize + 'px'}"
      v-for="(item, index) in currentImgs"
      :key="index"
    >
      <div class="img-show">
        <img
          :src="item" 
          alt=""
        >
        <div class="img-cover">
          <div>
            <el-button 
              class="btn"
              size="mini" 
              icon="el-icon-zoom-in"
              v-if="item" 
              @click="openImg(item)"
            ></el-button>
            <el-button 
              class="btn"
              size="mini" 
              icon="el-icon-delete"
              v-if="edit" 
              @click="deleteImg(item, index)"
            ></el-button>
            <el-button 
              class="btn"
              size="mini" 
              icon="el-icon-upload2"
              v-if="edit"
              @click="uploadImg(item, index)"
            ></el-button>
          </div>
        </div>
      </div>
    </li>
    <li 
      class="img-item" 
      :style="{width: itemSize + 'px', height: itemSize + 'px'}"
      v-if="edit && max > currentImgs.length"
    >
      <div class="img-upload" @click="uploadNewImg">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </li>
  </ul>
</template>

<script>
import { showOssUploader } from "../../helper/uploader";

export default {
  name: 'com-form-imglist',
  model: {
    prop: 'imgs',
    event: 'change'
  },
  props: {
    // 图片
    imgs: {
      type: Array,
      default: () => []
    },
    // 大小
    itemSize: {
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
    // 最大数量
    max: {
      type: Number,
      default: 1
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
      currentImgs: [],
    }
  },
  computed: {
    //
  },
  mounted() {
    this.currentImgs = this.value.slice();
  },
  methods: {
    openImg(url) {
      window.open(url);
    },
    deleteImg(item, index) {
      this.currentImgs.splice(index, 1);
      this.$emit('change', this.currentImgs.slice());
    },
    uploadNewImg() {
      let self = this;
      showOssUploader(this.uploadOptions, {
        ['upload-back'](url) {
          self.currentImgs.push(url);
          self.$emit('change', self.currentImgs.slice());
        }
      });
    },
    uploadImg(item, index) {
      let self = this;
      let options = Object.assign({}, this.uploadOptions, {
        ossStyle: this.water
      });
      showOssUploader(options, {
        ['upload-back'](url) {
          self.currentImgs.splice(index, 1, url);
          self.$emit('change', self.currentImgs.slice());
        }
      });
    }
  },
  watch: {
    imgs(value) {
      this.currentImgs = value.slice();
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
