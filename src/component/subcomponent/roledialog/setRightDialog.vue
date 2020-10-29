<template>
  <!-- 对话框组件 -->
  <!-- 分配权限对话框 -->
  <el-dialog
    title="分配权限"
    :visible.sync="showSetRightDialogVisible.value"
    width="50%"
    @close="closeSetRightDialog"
  >
    <!-- 树形结构 -->
    <el-tree
      :data="rightsList"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      default-expand-all
      :default-checked-keys="defID"
      ref="rightTree"
    >
    </el-tree>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeSetRightDialog">取 消</el-button>
      <el-button type="primary" @click="commitRight">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showSetRightDialogVisible: Object,
    rightsList: Array,
    defID: Array,
    roleID: Number
  },
  data () {
    return {
      // 配置节点信息
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 关闭 分配权限弹框
    closeSetRightDialog () {
      this.$emit('initialDefID')
    },
    // 分配权限事件
    async commitRight () {
      // 使用es6扩展运算符，合并数组
      const rids = [...this.$refs.rightTree.getCheckedKeys(), ...this.$refs.rightTree.getHalfCheckedKeys()]
      const idStr = rids.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
      this.closeSetRightDialog()
      this.$emit('getRolesList')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
