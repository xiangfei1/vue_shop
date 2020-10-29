<template>
  <!-- 对话框组件 -->
  <!-- 添加角色对话框 -->
  <el-dialog
    title="添加角色"
    :visible.sync="addRoleDialogVisible.value"
    @close="addFormClose"
    width="50%"
  >
    <el-form
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
      ref="addFormRef"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="childCloseAddDialog">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addRoleDialogVisible: Object,
    getRoleList: {
      type: Function
    }
  },
  data () {
    return {
      // 角色对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      //   角色验证规则
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //   表单关闭重置事件
    addFormClose () {
      this.childCloseAddDialog()
      this.$refs.addFormRef.resetFields()
    },
    // 弹框关闭事件
    childCloseAddDialog () {
      this.$emit('childCloseAddDialog')
    },
    // 添加角色事件
    addRole () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.childCloseAddDialog()
        this.$emit('getRolesList')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
