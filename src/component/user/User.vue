<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadCrumb :info="info"/>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 栅格布局 -->
      <!-- 搜索与添加区域 -->
      <el-row :gutter="15">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryUser()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible.value = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态">
          <template v-slot="{ row }">
            <el-switch v-model="row.mg_state" @change="userStateChanged(row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作按钮区域 -->
        <el-table-column label="操作" width="180px">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserInfo(row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <addDialog :addDialogVisible="addDialogVisible" @childCloseAddDialog="closeAddDialog" @getUserList="getUserList"/>
    <!-- 编辑用户对话框 -->
    <editDialog :editDialogVisible="editDialogVisible" @childCloseEditDialog="closeEditDialog" @getUserList="getUserList" :editForm="editForm"/>
    <!-- 分配角色对话框 -->
    <setRoleDialog @getUserList="getUserList" :setRoleDialogVisible="setRoleDialogVisible" @closeSetRoleDialog="closeSetRoleDialog" :userinfo="userinfo" :rolesList="rolesList"/>
  </div>
</template>

<script>
import addDialog from '@/component/subcomponent/userdialog/addDialog.vue'
import editDialog from '@/component/subcomponent/userdialog/editDialog.vue'
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
import setRoleDialog from '@/component/subcomponent/userdialog/setRoleDialog.vue'
export default {
  data () {
    return {
      queryParams: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 一页显示数据
        pagesize: 2
      },
      userList: [],
      //   页码总数
      total: 0,
      // 控制编辑用户对话框显示与隐藏
      editDialogVisible: { value: false },
      //   控制添加用户对话框显示于隐藏
      addDialogVisible: { value: false },
      // 单个用户信息
      editForm: {},
      // 面包屑数组
      info: ['用户管理', '用户列表'],
      // 控制 分配角色对话框显示与隐藏
      setRoleDialogVisible: { value: false },
      // 分配弹框用户信息
      userinfo: {},
      // 角色列表信息
      rolesList: [],
      // 角色ID
      roleID: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    //   获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 查询用户数据
    queryUser () {
      this.queryParams.pagenum = 1
      this.getUserList()
    },
    // 监听 pageSize 改变事件
    handleSizeChange (newSize) {
      this.queryParams.pagesize = newSize
      this.getUserList()
    },
    // 监听 页面值 改变事件
    handleCurrentChange (newCurrent) {
      this.queryParams.pagenum = newCurrent
      this.getUserList()
    },
    // 监听 switch 开关状态改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
    },
    // 关闭添加弹框
    closeAddDialog () {
      this.addDialogVisible.value = false
    },
    // 关闭编辑弹框
    closeEditDialog () {
      this.editDialogVisible.value = false
    },
    // 打开编辑用户弹框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible.value = true
    },
    // 删除用户信息
    async removeUserInfo (id) {
      const confirmRemove = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRemove !== 'confirm') {
        return this.$msg.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success('已删除')
      this.getUserList()
    },
    // 分配角色信息
    async setRole (role) {
      this.setRoleDialogVisible.value = true
      this.userinfo = role
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      console.log(role)
      res.data.forEach(item => {
        this.rolesList.push({ value: item.id, label: item.roleName })
      })
    },
    // 关闭分配角色对话框
    closeSetRoleDialog () {
      this.setRoleDialogVisible.value = false
      this.rolesList = []
    }
  },
  components: {
    addDialog,
    editDialog,
    breadCrumb,
    setRoleDialog
  }
}
</script>

<style lang="less" scoped>
</style>
