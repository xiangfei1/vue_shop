<template>
  <!-- 对话框组件 -->
  <!-- 编辑用户对话框 -->
  <el-dialog
    title="编辑角色"
    :visible.sync="editRoleDialogVisible.value"
    width="50%"
  >
    <el-form
      :model="roleinfo"
      :rules="editFormRules"
      label-width="100px"
      ref="editFormRef"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleinfo.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleinfo.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="editFormClose">取 消</el-button>
      <el-button type="primary" @click="editRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    editRoleDialogVisible: Object,
    roleinfo: Object
  },
  data () {
    return {
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //  编辑对话框关闭事件
    editFormClose () {
      this.$emit('childCloseEditDialog')
    },
    // 角色编辑事件
    editRole () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
        }
        const { data: res } = await this.$http.put(
          `roles/${this.roleinfo.roleId}`,
          this.roleinfo
        )
        if (res.meta.status !== 200) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success('更新成功')
        this.$emit('getRolesList')
        this.editFormClose()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
