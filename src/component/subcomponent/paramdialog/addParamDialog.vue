<template>
  <el-dialog
    :title="'添加'+titleName"
    :visible.sync="addParamDialogVisible.value"
    width="50%"
  >
    <el-form label-width="80px" :model="addForm" ref="addFormRef" :rules="addFormRules">
        <el-form-item :label="titleName" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addParamDialogVisible: Object,
    titleName: String,
    id: Number,
    attr_sel: String
  },
  data () {
    return {
      addForm: {
        attr_name: ''
      },
      //   校验规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: blur }]
      }
    }
  },
  methods: {
    //   监听弹框的事件
    closeForm () {
      this.$refs.addFormRef.resetFields()
      this.$emit('closeAddParam')
    },
    // 添加属性
    addCate () {
      // console.log(this.id)
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`categories/${this.id}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.attr_sel
        })
        if (res.meta.status !== 201) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.closeForm()
        this.$emit('handleChange')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
