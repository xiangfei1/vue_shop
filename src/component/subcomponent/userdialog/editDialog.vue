<template>
  <!-- 对话框组件 -->
  <!-- 编辑用户对话框 -->
  <el-dialog
    title="编辑用户"
    :visible.sync="editDialogVisible.value"
    width="50%"
  >
    <el-form :model="editForm" :rules="editFormRules" label-width="100px" ref="editFormRef">
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="editFormClose">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate.js'
export default {
  props: {
    editDialogVisible: Object,
    editForm: Object
  },
  data () {
    //   邮箱校验规则
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    // 手机号校验规则
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      // 用户输入校验规则
      editFormRules: {
        email: [
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            validator: validateMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {},
  methods: {
    //   编辑对话框关闭事件
    editFormClose () {
      this.$emit('childCloseEditDialog')
    },
    // 编辑用户信息提交
    async editUser () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.$emit('getUserList')
        this.editFormClose()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
