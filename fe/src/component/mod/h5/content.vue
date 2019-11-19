<template>
  <div class="mod outer" v-loading="loading">
    <section class="phone-box" ref="phone-box">
      <div class="phone" v-if="info">
        <div class="phone-content faq-format" data-editable data-name="content" v-html="info.content">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ContentTools from '../../../lib/content-tools/content-tools';
import '../../../style/faq.scss';
 
export default {
  name: 'mod-h5-content',
  props: ['id'],
  data() {
    return {
      loading: false,
      info: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.setMeta({
        path: vm.$route.path, 
        title: `H5内容编辑(${vm.id})`
      });
    });
  },
  beforeRouteLeave (to, from, next) {
    if (this.editor && this.editor.getState() == 'editing') {
      this.$confirm('正在编辑，确认离开?', this.__('hint'), {
        confirmButtonText: this.__('btn.confirm'),
        cancelButtonText: this.__('btn.cancel'),
        type: 'warning'
      }).then(() => {
        next(true);
      }).catch(() => {
        next(false);    
      });
    } else {
      next(true);
    }
  },
  mounted() {
    this.refreshMod();
  },
  methods: {
    refreshMod() {
      this.getInfo();
    },
    getInfo() {
      this.$unsubscribe(`getInfo`);
      this.loading = true;
      this.$subs[`getInfo`] = this.$hub.flow([{
        id: this.id
      }])
        .use('guide.info')
        .subscribe(
          (res) => {
            this.loading = false;
            this.info = res;
            this.$nextTick(() => {
              this.intiEditor();
            });
          },
          (err) => {
            this.$message.error(err.message);
            this.loading = false;
          }
        );
    },
    intiEditor() {
      let self = this;
      let editor = ContentTools
        .EditorApp
        .get();

      self.editor = editor;
      editor.init('*[data-editable]', 'data-name', () => {
        //
      });
      this.$refs['phone-box'].appendChild(editor.domElement());

      editor.addEventListener('saved', function(ev) {
        var name,
          payload,
          regions,
          xhr;

        // Check that something changed
        regions = ev
          .detail()
          .regions;

        if (Object.keys(regions).length == 0) {
          return;
        }

        self.$unsubscribe(`save`);
        self.loading = true;
        self.$subs[`save`] = self.$hub.flow([{
          id: Number(self.id),
          content: regions['content'],
        }])
          .use('guide.update')
          .subscribe(
            (res) => {
              self.loading = false;
              self.$message.success(this.__('message.updateSuccess'));
            },
            (err) => {
              self.$message.error(err.message);
              self.loading = false;
            }
          );
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.outer {
  padding: 20px 0;
  position: relative;
}

.phone-box {
  margin: 0 20px;

  /deep/ .ct-widget {
    z-index: 99;
  }

  /deep/ .ct-toolbox {
    position: absolute;
    left: 400px;
    top: 80px;
  }

  /deep/ .ct-inspector {
    position: absolute;
    left: 400px;
    bottom: 0;
    padding-left: 0;
  }

  /deep/ .ct-ignition {
    position: absolute;
    left: 400px;
    top: 20px;
  }
}

.phone {
  width: 400px;
  padding: 50px 20px;
  background: rgb(35, 38, 51);
  border-radius: 20px;
  transform: scale(.9);
  transform-origin: 0% 0%;
}

.phone-content {
  width: 360px;
  height: 540px;
  background: #fff;
  overflow: auto;
}
</style>
