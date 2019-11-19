<template>
  <el-dialog title="编辑角色"
    :visible.sync="visible"
    custom-class="sma-add-dialog"
    :close-on-click-modal="false"
    @close="onClose">

    <el-form :model="form" :rules="rules" ref="form" label-width="100px" :disabled="loading">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="角色名称"></el-input>
      </el-form-item>

      <el-form-item label="设置权限" class="sma-label-required">
        <dl v-if="permissionList.length > 0" v-for="(item,index) in permissionList" :key="index">
          <el-checkbox
            class="check-tit"
            :indeterminate="item.isIndeterminate"
            v-model="item.checkAll"
            @change="checkAll(item)"
          >{{item.name}}</el-checkbox>
          <el-checkbox-group v-model="item.checked" @change="checked(item)">
            <el-checkbox v-for="el in item.options" :label="el.id" :key="el.id">{{el.name}}</el-checkbox>
          </el-checkbox-group>
        </dl>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" v-loading="loading">
      <el-button @click="visible = false">{{__('btn.cancel')}}</el-button>
      <el-button type="primary" @click="onSave">{{__('btn.save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { copyJson } from "../../../lib/utils";

export default {
  name: 'com-role-edit',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: null
    },
    roleName: {
      type: String,
      default: ''
    }
  },
  data() {
    let self = this;

    return {
      loading: false,
      permissionList: [],
      form:{
        id: self.id,
        name: self.roleName,
        permissionIds: []
      },
      rules: {
        name: [
          { required: true, message: this.__('required') }
        ]
      }
    }
  },
  computed:{
    enums() {
      return this.$state.enums.all;
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$unsubscribe('initData');
      this.loading = true;
      this.$subs.initData = this.$hub.flow([{ id: this.id }])
        .use('role.rolePermission')
        .subscribe(
          (res) => {
            this.loading = false;
            res.forEach((item, index) => {
              let checkObj = {
                id: item.id,
                name: item.name,
                options: item.childrenList,
                checkAll: false,
                checked: [],
                isIndeterminate: true
              };

              if(item.isAssign && item.childrenList.length > 0) {
                item.childrenList.forEach(el => {
                  if(el.isAssign) {
                    checkObj.checked.push(el.id)
                  }
                })
              }

              this.permissionList.push(checkObj);
            });
          },
          (err) => {
            this.loading = false;
            this.$message.error(err.message);
          }
        );
    },
    checkAll(item) {
      let childrens = item.options.map((el) => {
        return el.id
      })
      item.checked = item.checkAll ? childrens : [];
      item.isIndeterminate = false;
    },
    checked(item) {
      let checkedCount = item.checked.length;
      item.checkAll = checkedCount === item.options.length;
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.options.length;
    },
    onClose() {
      this.$emit('close');
    },
    onSave() {
      this.permissionList.forEach((item) => {
        if(item.checked.length > 0) {
          this.form.permissionIds = this.form.permissionIds.concat(item.checked);
        }
      })

      this.$refs['form'].validate((valid) => {
        if (!valid || this.form.permissionIds.length == 0) {
          this.$message.error(this.__('form.error'));
          return false;
        }

        let data = copyJson(this.form);
        this.$unsubscribe('update');
        this.loading = true;
        this.$subs.update = this.$hub.flow([data])
          .use('role.update')
          .subscribe(
            (res) => {
              this.loading = false;
              this.visible = false;
              this.$message.success(this.__('message.editSuccess'));
              this.$emit('edit-back', res);
            },
            (error) => {
              this.loading = false;
              this.$message.error(error.message);
            }
          );
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.check-tit {
  font-weight: bold;
}
</style>
