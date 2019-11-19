<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="700"
    custom-class="sma-add-dialog sma-upload-popup"
    @close="onClose"
  >

    <div v-loading="loading">
      <div v-show="!uploading"> 
        <dl>
          <dt>图片上传</dt>
          <dd>
            <a class="el-button el-button--primary is-plain" ref="uploadBtn">
              选择图片
            </a>
          </dd>
        </dl>
      </div>

      <div class="img-box">
        <div class="cropper">
          <img :src="img" alt="" ref="img">
        </div>
      </div>

      <div class="err-box" v-if="error">
        <el-alert
          :title="error"
          type="error"
          :closable="false"
        >
        </el-alert>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <span v-if="percent > 0 && percent < 1">
        {{ percent * 100 + '%' }}
      </span>
      <el-button type="primary" @click="onSure">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
import $ from 'jquery';
import qq from 'fine-uploader/lib/core';
import Cropper from 'cropperjs';
import {copyJson} from '../../../lib/utils';
import 'cropperjs/dist/cropper.css';
import { setTimeout } from 'timers';

// https://help.aliyun.com/document_detail/31988.html?spm=a2c4g.11186623.2.5.hDMTwz
export default {
  name: 'com-uploader-oss',
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    // 标题
    title: {
      type: String,
      default: '上传图片',
    },

    // 长宽比
    aspectRatio: {
      type: [Number],
      default: NaN,
    },

    // 指定宽度
    width: {
      type: [Number],
      default: 0,
    },

    // 指定高度
    height: {
      type: [Number],
      default: 0,
    },

    // limit (kb)
    sizeLimit: {
      type: [Number],
      default: 1024,
    },

    // accept files
    acceptFiles: {
      type: String,
      default: 'image/*'
    },

    // allowedExtensions
    allowedExtensions: {
      type: Array,
      default: () => ['jpg', 'png', 'jpeg']
    },

    // 压缩质量 1 - 100
    quality: {
      type: Number,
      default: 80
    },

    // oss图片样式
    ossStyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,

      fileId: '',
      img: '',
      error: '',
      percent: 0,
      uploading: false,

      cropStr: '',
      cropInfo: null,

      // 上传额外信息
      meta: {},
    }
  },
  computed: {
    //
  },
  mounted() {
    this.updateMeta((meta) => {
      this.$nextTick(() => {
        this.initUploader();
      });
    });
  },
  methods: {
    updateMeta(callback) {
      // 获取上传信息
      // https://help.aliyun.com/document_detail/31926.html?spm=a2c4g.11186623.2.4.SXdruV

      if (
        this.meta
        && this.meta.expire 
        && (this.meta.expire + 120000 < Date.now())
      ) {
        callback(this.meta);
        return;
      }

      this.$unsubscribe('updateMeta');
      this.loading = true;
      this.$subs.updateMeta = this.$hub.flow([{
        ossCase: this.ossStyle ? 'ORIGINAL_IMAGE_PROTECT' : 'UPLOAD_IMAGE'
      }])
        .use('com.ossConfig')
        .subscribe(
          (res) => {
            this.loading = false;

            let meta = {
              "OSSAccessKeyId": res.accessKeyId,
              "policy": res.policy, 
              "signature": res.signature,
              "success_action_status": 201,
              "bucket": res.dir,
              "bucketUrl": res.host,
              "expire": res.expire
            }

            this.meta = meta;
            callback(meta);
          },
          (error) => {
            this.loading = false;
            this.$message.error(error.message);
          }
        );
    },
    initUploader() {
      let self = this;
      let uploader = new qq.FineUploaderBasic({
        debug: false, //process.env.NODE_ENV === 'development',
        button: this.$refs.uploadBtn,
        autoUpload: false,
        multiple: false,
        request: {
          endpoint: this.meta.bucketUrl,
          forceMultipart: true,
          inputName: 'file',
          requireSuccessJson: false,
          omitDefaultParams: true,
          totalFileSizeName: 'size'
        },
        validation: {
          acceptFiles: self.acceptFiles,
          allowedExtensions: self.allowedExtensions,
          sizeLimit: self.sizeLimit * 1024
        },
        scaling: {
          sendOriginal: true,
          quality: self.quality
        },
        callbacks: {
          onStatusChange(id, oldStatus, newStatus) {
            if (newStatus == 'submitted') {
              self.makeThumb(id);
            }
          },
          onUpload(id, name) {
            let file = self.uploader.getFile(id);
          },
          onProgress(id, name, uploaded, total) {
            let percent = (uploaded / total).toFixed(2);
            self.percent = percent;
          },
          onComplete(id, name, res, xhr) {
            self.loading = false;
            self.percent = 1;

            let parser=new DOMParser();
            let $doc= $($.parseXML(xhr.responseText));
            let location = $doc.find('Location').text();
            let message = $doc.find('Message').text();

            if (location) {
              self.uploader.uploadStoredFiles();
              self.$emit('upload-back', location + self.cropStr);
              self.visible = false;
            } else {
              self.error = message || 'upload error';
              self.img = '';
              self.uploader.clearStoredFiles();
            }
          },
          onError(id, name, error, xhr) {
            self.loading = false;
            self.percent = 1;
            self.error = error;
            // self.uploader.clearStoredFiles();
          }
        }
      });

      this.uploader = uploader;
    },
    makeThumb(id) {
      if (this.cropper) {
        this.cropper.destroy();
      }

      this.fileId = id;
      this.loading = true;
      this.error = '';
      this.percent = 0;
      this.uploader.drawThumbnail(id, this.$refs.img)
        .then(
          (res) => {
            this.loading = false;
            this.img = this.$refs.img.getAttribute('src');
            this.resetCropper();
          },
          (error) => {
            this.loading = false;
            this.error = '预览错误';
            this.uploader.clearStoredFiles();
          }
        );
    },
    resetCropper() {
      if (this.ossStyle) return false;

      let aspectRatio = this.aspectRatio;

      this.cropper = new Cropper(this.$refs.img, {
        aspectRatio: aspectRatio,
        scalable: false,
        zoomOnTouch: false,
        zoomable: false,
        rotatable: false,
        viewMode: 1,
        autoCropArea: 1,
        crop: function(e) {
          // console.log(e.detail.x);
          // console.log(e.detail.y);
          // console.log(e.detail.width);
          // console.log(e.detail.height);
          // console.log(e.detail.rotate);
          // console.log(e.detail.scaleX);
          // console.log(e.detail.scaleY);
        }
      });
    },
    onClose() {
      this.$emit('close');
    },
    onSure() {
      if (this.fileId === '') return;
      
      this.updateMeta((meta) => {
        this.meta = meta;
        this.ossStyle ? this.startUploadWithStyle() : this.startUpload();
      });
    },
    startUploadWithStyle() {
      let file = this.uploader.getFile(this.fileId);
      let ext = file.ext || 'jpg';
      let filename = new Date()
          .getTime()
          .toString() + '-' + Math.floor(Math.random() * 1000) + '.' + ext;

      // oss style
      this.cropStr = '?x-oss-process=style/' + this.ossStyle;

      this.uploader.setParams(Object.assign({}, this.meta, {
        'key': 'caas-ascendas/' + filename,
        'success_action_status': 201,
        'x-oss-object-acl': 'public-read'
      }));
      this.loading = true;
      this.uploader.uploadStoredFiles();
    },
    startUpload() {
      let imageData = this.cropper.getImageData();
      let canVasData = this.cropper.getCanvasData();
      let data = this.cropper.getData(true);
      let cropInfo, cropStr;
      let file = this.uploader.getFile(this.fileId);
      let ext = file.ext || 'jpg';
      let filename = new Date()
          .getTime()
          .toString() + '-' + Math.floor(Math.random() * 1000) + '.' + ext;

      cropInfo = {
        width: Math.round(imageData.naturalWidth),
        height: Math.round(imageData.naturalHeight),
        x: Math.round(data.x),
        y: Math.round(data.y),
        w: Math.round(data.width),
        h: Math.round(data.height),
      }

      cropStr = '?x-oss-process=image/crop,x_' + cropInfo.x + ',y_' + cropInfo.y + ',w_' + cropInfo.w + ',h_' + cropInfo.h + ',g_nw';

      if (this.width) {
        cropStr += '/resize,m_mfit,w_' + this.width;
      } else if (this.height) {
        cropStr += '/resize,m_mfit,h_' + this.height;
      }

      this.cropStr = cropStr;
      this.cropInfo = cropInfo;
      this.uploader.setParams(Object.assign({}, this.meta, {
        'key': 'caas-ascendas/' + filename,
        'success_action_status': 201,
        'x-oss-object-acl': 'public-read'
      }));
      this.loading = true;
      this.uploader.uploadStoredFiles();
    }
  }
}
</script>

<style lang="scss" scoped>
.up { 
  margin-top: 30px;
  .up-btn {
    width: 100%;
  }
}
</style>
