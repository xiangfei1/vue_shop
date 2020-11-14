<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <!-- 卡片布局趋于 -->
    <el-card>
      <!-- 提示区域 -->
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            :closable="false"
            type="warning"
            show-icon
          >
          </el-alert>
        </el-col>
      </el-row>
      <!-- 级联选择区域 -->
      <el-row>
        <el-col>
          选择商品的分类：
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
            size="medium"
            style="width: 260px"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 标签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamDialogVisible.value = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyArray" border stripe>
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <!-- 循环标签 -->
                <el-tag
                  :key="i"
                  v-for="(tag, i) in row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleTagClose(i,row)"
                >
                  {{ tag }}
                </el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 新增标签按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamDialogVisible.value = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyArray" border stripe>
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <!-- 循环标签 -->
                <el-tag
                  :key="i"
                  v-for="(tag, i) in row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleTagClose(i,row)"
                >
                  {{ tag }}
                </el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 新增标签按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加弹框 -->
    <addParamDialog
      :id="id"
      :attr_sel="activeName"
      @handleChange="handleChange"
      @closeAddParam="closeAddParam"
      :addParamDialogVisible="addParamDialogVisible"
      :titleName="titleName"
    />
    <!-- 编辑弹框 -->
    <editParamDialog
      @getParamsData="getParamsData"
      @closeEditParam="closeEditParam"
      :paramInfo="paramInfo"
      :editParamDialogVisible="editParamDialogVisible"
      :titleName="titleName"
    />
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
import addParamDialog from '@/component/subcomponent/paramdialog/addParamDialog.vue'
import editParamDialog from '@/component/subcomponent/paramdialog/editParamDialog.vue'
export default {
  data () {
    return {
      info: ['商品管理', '分类参数'],
      //   选中节点数组
      selectKeys: [],
      //   分类信息数组
      cateList: [],
      //   配置信息对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 标签栏默认选中对象
      activeName: 'many',
      // 保存动态参数数组
      manyArray: [],
      // 保存静态属性数组
      onlyArray: [],
      // 控制添加弹框的显示与隐藏
      addParamDialogVisible: { value: false },
      // 分类ID
      id: 0,
      // 控制编辑弹框的显示与隐藏
      editParamDialogVisible: { value: false },
      // 单个参数信息
      paramInfo: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 级联选择器 改变事件
    async handleChange () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyArray = []
        this.onlyArray = []
      }
      this.id = this.catID
      // console.log(this.id)
      this.getParamsData()
    },
    // 获取级联选择区域分类信息列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.cateList = res.data
    },
    // 标签页点击事件
    handleClick () {
      // console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData () {
      if (this.catID === null) {
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.catID}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 绑定输入框的显示
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(res.data)
      if (this.activeName === 'many') {
        this.manyArray = res.data
      } else {
        this.onlyArray = res.data
      }
    },
    // 添加弹框关闭事件
    closeAddParam () {
      this.addParamDialogVisible.value = false
    },
    // 修改弹框打开事件
    openEditDialog (row) {
      this.editParamDialogVisible.value = true
      this.paramInfo = row
      // console.log(row)
    },
    // 修改弹框关闭事件
    closeEditParam () {
      this.editParamDialogVisible.value = false
    },
    // 删除属性信息
    async removeParam (row) {
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
        `categories/${row.cat_id}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
      this.getParamsData()
    },
    // 处理标签的关闭事件
    handleTagClose (i, row) {
      row.attr_vals.splice(i, 1)
      // 将编辑后的数据提交到数据库中
      this.commitSelect(row)
    },
    //  enter键按下 、失去焦点触发
    handleInputConfirm (row) {
      const inputValue = row.inputValue
      if (inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 在此处将输入框中的值保存到数组中
      row.attr_vals.push(inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 将编辑后的数据提交到数据库中
      this.commitSelect(row)
    },
    // 显示输入框
    showInput (row) {
      row.inputVisible = true
      // 当页面被重新渲染后，才会执行回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 编辑 提交 可选项
    async commitSelect (row) {
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ') // 数据苦衷，该项为字符串
      })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
    }
  },
  components: {
    breadCrumb,
    addParamDialog,
    editParamDialog
  },
  computed: {
    // 按钮的禁用计算属性
    isBtnDisabled () {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取 当前选中三级分类的id
    catID () {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[this.selectKeys.length - 1]
      }
      return null
    },
    // 当前标签页的名字
    titleName () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-tag {
  margin-left: 15px;
}
.input-new-tag {
  width: 120px;
  margin-left: 15px;
}
.button-new-tag {
  margin-left: 15px;
}
</style>
