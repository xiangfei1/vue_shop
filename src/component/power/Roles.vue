<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible.value = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-row
              :class="['bdbottom', i === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, i) in row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  disable-transitions
                  closable
                  @close="removePowerByID(row, item.id)"
                >
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(itemChild, j) in item.children"
                  :key="itemChild.id"
                  :class="[
                    j === item.children.length - 1 ? '' : 'bdbottom',
                    'vcenter',
                  ]"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      disable-transitions
                      closable
                      @close="removePowerByID(row, itemChild.id)"
                    >
                      {{ itemChild.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="child in itemChild.children"
                      :key="child.id"
                      closable
                      @close="removePowerByID(row, child.id)"
                    >
                      {{ child.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 操作按钮区域 -->
          <template v-slot="{ row }">
            <el-row :gutter="10">
              <el-col :span="6"
                ><el-button
                  size="mini"
                  type="primary"
                  class="el-icon-edit"
                  @click="editRole(row.id)"
                  >编辑</el-button
                ></el-col
              >
              <el-col :span="6"
                ><el-button
                  size="mini"
                  type="danger"
                  class="el-icon-delete"
                  @click="deleteRole(row.id)"
                  >删除</el-button
                ></el-col
              >
              <el-col :span="6"
                ><el-button
                  size="mini"
                  type="warning"
                  class="el-icon-setting"
                  @click="showRightDialog(row)"
                  >分配权限</el-button
                ></el-col
              >
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框组件 -->
    <addRoleDialog
      :addRoleDialogVisible="addRoleDialogVisible"
      @getRolesList="getRolesList"
      @childCloseAddDialog="closeAddDialog"
    />
    <!-- 编辑角色弹框 -->
    <editRoleDialog
      :roleinfo="roleinfo"
      @getRolesList="getRolesList"
      @childCloseEditDialog="closeEditDialog"
      :editRoleDialogVisible="editRoleDialogVisible"
    />
    <!-- 分配权限对话框 -->
    <setRightDialog
      :defID="defID"
      :rightsList="rightsList"
      :showSetRightDialogVisible="showSetRightDialogVisible"
      @initialDefID="initialDefID"
      :roleID="roleID"
      @getRolesList="getRolesList"
    />
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
import addRoleDialog from '@/component/subcomponent/roledialog/addRoleDialog.vue'
import editRoleDialog from '@/component/subcomponent/roledialog/editRoleDialog.vue'
import setRightDialog from '@/component/subcomponent/roledialog/setRightDialog.vue'
export default {
  data () {
    return {
      info: ['权限管理', '角色列表'],
      //   角色列表
      rolesList: [],
      // 控制添加角色的显示与隐藏
      addRoleDialogVisible: { value: false },
      // 控制编辑角色的显示与隐藏
      editRoleDialogVisible: { value: false },
      // 控制分配权限弹框的显示与隐藏
      showSetRightDialogVisible: { value: false },
      //   单个角色信息
      roleinfo: {},
      // 所有权限列表
      rightsList: [],
      // 默认选中节点的 ID数组
      defID: [],
      // 角色ID
      roleID: 0
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //   获取角色列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    // 关闭添加角色 弹框
    closeAddDialog () {
      this.addRoleDialogVisible.value = false
    },
    // 根据ID获取单个角色数据，并打开编辑角色弹框
    async editRole (id) {
      this.editRoleDialogVisible.value = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.roleinfo = res.data
    },
    // 关闭编辑角色弹框
    closeEditDialog () {
      this.editRoleDialogVisible.value = false
    },
    // 删除角色事件
    async deleteRole (id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$msg.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
      this.getRolesList()
    },
    // 根据 角色ID、权限ID 删除对应的权限
    async removePowerByID (role, rightid) {
      // console.log(roleid + '====' + rightid)
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$msg.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      )
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      // 妙用双向数据绑定
      role.children = res.data
      this.$msg.success(res.meta.msg)
    },
    // 打开权限分配弹框事件
    // 获取所有权限列表
    async showRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.rightsList = res.data
      this.showSetRightDialogVisible.value = true
      this.getCheckedID(role, this.defID)
      this.roleID = role.id
    },
    // 获取三级权限中 选中节点 ID
    getCheckedID (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getCheckedID(item, arr)
      })
    },
    // 控制分配权限弹框显示与隐藏事件，同时初始化 选中节点ID数组
    initialDefID () {
      this.showSetRightDialogVisible.value = false
      this.defID = []
    }
  },
  components: {
    breadCrumb,
    addRoleDialog,
    editRoleDialog,
    setRightDialog
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 10px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
