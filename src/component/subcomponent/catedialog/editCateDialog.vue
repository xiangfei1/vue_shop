<template>
  <el-dialog
    title="编辑分类"
    :visible.sync="editCateDialogVisible.value"
    width="50%"
  >
  <el-form
      :model="cateinfo"
      :rules="editFormRule"
      label-width="100px"
      ref="editFormRef"
    >
    <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="cateinfo.cat_name"></el-input>
      </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取 消</el-button>
      <el-button type="primary" @click="editForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    editCateDialogVisible: Object,
    cateinfo: Object
  },
  data () {
    return {
      editFormRule: {
        cat_name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    closeForm () {
      this.$emit('closeEditDialog')
    },
    // 编辑 提交 分类事件
    async editForm () {
      const { data: res } = await this.$http.put(`categories/${this.cateinfo.cat_id}`, {
        cat_name: this.cateinfo.cat_name
      })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
      this.closeForm()
      this.$emit('getCategoriesList')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
