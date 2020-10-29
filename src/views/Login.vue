<template>
  <div class="login">
    <div>
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="formContent">
        <el-form
          status-icon
          ref="ruleForm"
          label-width="70px"
          class="demo-ruleForm"
          :model="user"
          :rules="rules"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="user.username"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="user.password"
              prefix-icon="el-icon-s-grid"
              type="password"
              autocomplete="off"
              show-password
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <div style="float: right">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button @click="reset('ruleForm')">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    setTimeout(() => {
      this.show = !this.show
    }, 800)
  },
  methods: {
    // 表单提交事件
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          console.log('请注意错误提示')
        } else {
          const { data: res } = await this.$http.post('login', this.user)
          // 用户登录验证
          if (res.meta.status === 200) {
            console.log(res.data.token)
            this.$msg.success(res.meta.msg)
            sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$msg.error(res.meta.msg)
          }
        }
      })
    },
    // 表单重置事件,将表单中的值重置为默认值
    reset (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes login {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.login {
  height: 100%;
  width: 100%;
  background: url("../assets/风景背景图.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  > div {
    opacity: 0;
    animation: login 1s forwards;
  }
  .avatar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 18%;
    z-index: 99;
    border-radius: 50%;
    border: 10px solid #fff;
    box-shadow: 0 0 15px #ccc;
    overflow: hidden;
    background-color: #eee;
    img {
      width: 150px;
      height: 150px;
    }
  }
  .formContent {
    width: 25%;
    height: 25%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    background: white;
    padding: 110px 20px 0 20px;
    border-radius: 15px;
  }
}
</style>
