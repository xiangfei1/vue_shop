<template>
  <!-- 对话框组件 -->
  <!-- 添加用户对话框 -->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible.value"
    @close="addFormClose"
    width="50%"
  >
    <el-form
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
      ref="addFormRef"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input type="password" v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="childCloseAddDialog">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate.js'
export default {
  props: {
    addDialogVisible: Object
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
      //   用户输入规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '用户名在5~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          },
          { min: 6, max: 15, message: '密码在6~15个字符之间', trigger: 'blur' }
        ],
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
      },
      //   添加用户
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    // 对话框关闭事件
    addFormClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户事件
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.childCloseAddDialog()
        // 这里改造一下 调用父组件的事件
        this.$emit('getUserList')
      })
    },
    // 关闭添加用户弹框
    childCloseAddDialog () {
      this.$emit('childCloseAddDialog')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
