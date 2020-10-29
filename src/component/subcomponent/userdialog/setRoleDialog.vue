<template>
  <!-- 对话框组件 -->
  <!-- 编辑用户对话框 -->
  <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible.value"
    width="50%"
  >
    <p>当前的用户：<span>{{ userinfo.username }}</span></p>
    <p>当前的角色：<span>{{ userinfo.role_name }}</span></p>
    <p>
      分配新角色：
      <el-select v-model="value" placeholder="请选择" size="mini"  ref="select">
        <el-option
          v-for="(item,index) in rolesList"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </p>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="setFormClose">取 消</el-button>
      <el-button type="primary" @click="setForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    setRoleDialogVisible: Object,
    userinfo: Object,
    rolesList: Array
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    //  监听分配角色弹框的关闭
    setFormClose () {
      this.$emit('closeSetRoleDialog')
      this.value = ''
    },
    // 分配角色事件
    async setForm () {
      if (!this.value) {
        return this.$msg.error('请选择要分配的新角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.value })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.setFormClose()
      this.$emit('getUserList')
      this.$msg.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.el-dialog {
    p {
        margin-bottom: 10px;
    }
}
</style>
