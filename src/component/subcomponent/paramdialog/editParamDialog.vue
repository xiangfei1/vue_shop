<template>
     <el-dialog
    :title="'添加'+titleName"
    :visible.sync="editParamDialogVisible.value"
    width="50%"
  >
    <el-form label-width="80px" :model="paramInfo" ref="editFormRef" :rules="editFormRules">
        <el-form-item :label="titleName" prop="attr_name">
            <el-input v-model="paramInfo.attr_name"></el-input>
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
    editParamDialogVisible: Object,
    paramInfo: Object,
    titleName: String
  },
  data () {
    return {
      editFormRules: {
        attr_name: [{ required: true, message: '名称不能为空', trigger: blur }]
      }
    }
  },
  methods: {
    closeForm () {
      this.$emit('closeEditParam')
    },
    // 编辑提交事件
    editForm () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {

        }
        const { data: res } = await this.$http.put(`categories/${this.paramInfo.cat_id}/attributes/${this.paramInfo.attr_id}`, {
          attr_name: this.paramInfo.attr_name,
          attr_sel: this.paramInfo.attr_sel,
          attr_vals: this.paramInfo.attr_vals
        })
        if (res.meta.status !== 200) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.closeForm()
        this.$emit('getParamsData')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
