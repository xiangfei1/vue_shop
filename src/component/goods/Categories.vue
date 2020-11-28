<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <!-- 卡片布局区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        border
        stripe
        index-text="#"
        :show-index="true"
        :data="cateList"
        :columns="column"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效模板列 -->
        <template v-slot:isok="{ row }">
          <i v-if="row.cat_deleted === false" class="el-icon-success sbg"></i>
          <i v-else class="el-icon-error red"></i>
        </template>
        <!-- 等级排序模板列 -->
        <template v-slot:order="{ row }">
          <el-tag v-if="row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template v-slot:setting="{row}">
          <div class="set-btn">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editOpen(row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(row)"
              >删除</el-button
            >
          </div>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 弹框 -->
    <addCateDialog @closeCate="closeCate" :addCateDialogVisible="addCateDialogVisible" :parentCateList="parentCateList" @getCategoriesList="getCategoriesList"/>
    <!-- 编辑弹框 -->
    <editCateDialog @getCategoriesList="getCategoriesList" :editCateDialogVisible="editCateDialogVisible" @closeEditDialog="closeEditDialog" :cateinfo="cateinfo"/>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
import addCateDialog from '@/component/subcomponent/catedialog/addCateDialog.vue'
import editCateDialog from '@/component/subcomponent/catedialog/editCateDialog.vue'
export default {
  data () {
    return {
      info: ['商品管理', '商品分类'],
      //   分类列表
      cateList: [],
      //   参数信息
      params: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据 长度
      total: 0,
      // 设置表头信息
      column: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 将当前列定义为 '是否有效' 模板列
          type: 'template',
          // 指定自定义模板列的名字
          template: 'isok'
        },
        {
          label: '等级排序',
          prop: 'cat_level',
          // 将当前列定义为 '等级排序' 模板列
          type: 'template',
          // 指定自定义模板列的名字
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为 '操作' 模板列
          type: 'template',
          // 指定自定义模板列的名字
          template: 'setting'
        }
      ],
      // 控制 添加分类 的显示与隐藏
      addCateDialogVisible: { value: false },
      // 父级分类列表
      parentCateList: [],
      // 控制编辑弹框的显示与隐藏
      editCateDialogVisible: { value: false },
      cateinfo: {}
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    //   获取商品分类信息
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.params
      })
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      // console.log(res.data)
      this.cateList = res.data.result
      // console.log(res)
      this.total = res.data.total
    },
    // 监听 pagesize 的改变
    handleSizeChange (newsize) {
      this.params.pagesize = newsize
      // console.log(newsize)
      this.getCategoriesList()
    },
    // 监听 当前页码的改变
    handleCurrentChange (current) {
      this.params.pagenum = current
      this.getCategoriesList()
    },
    // 添加弹框 关闭事件
    closeCate () {
      this.addCateDialogVisible.value = false
    },
    // 展示添加分类弹框事件
    showAddCateDialog () {
      this.addCateDialogVisible.value = true
      this.getParentCateList()
    },
    // 获取 父级分类数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    // 打开编辑 弹框
    async editOpen (row) {
      // const { data: res } = await this.$http.get(`categories/${row.cat_id}`)
      // console.log(res)
      this.editCateDialogVisible.value = true
      this.cateinfo = row
    },
    // 编辑弹框 关闭事件
    closeEditDialog () {
      this.editCateDialogVisible.value = false
    },
    // 监听删除事件
    async remove (row) {
      const confirm = await this.$confirm('请谨慎操作，删除是永久删除哦', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') {
        return this.$msg('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$msg.error('删除失败')
      }
      this.$msg.success(res.meta.msg)
      this.getCategoriesList()
    }
  },
  components: {
    breadCrumb,
    addCateDialog,
    editCateDialog
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
}
.sbg {
  color: #67c23a;
}
.ebg {
  color: red;
}
</style>
