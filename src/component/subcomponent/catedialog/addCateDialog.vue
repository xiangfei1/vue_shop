<template>
  <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible.value"
    width="50%"
  >
    <el-form
      :model="cateinfo"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input type="input" v-model="cateinfo.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- options 指定数据源 -->
        <!-- props 指定配置对象 -->
        <el-cascader
          v-model="selectKeys"
          :options="parentCateList"
          :props="cascaderProps"
          @change="selectKeysChanged"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddCate">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addCateDialogVisible: Object,
    parentCateList: Array
  },
  data () {
    return {
      // 分类信息
      cateinfo: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //   校验规则
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的节点id数组
      selectKeys: []
    }
  },
  methods: {
    // 弹框关闭事件
    closeAddCate () {
      this.$emit('closeCate')
      this.$refs.ruleForm.resetFields()
      this.selectKeys = []
    },
    // 监听节点的变化
    selectKeysChanged () {
      if (this.selectKeys.length > 0) {
        // 如果 selectKeys 的长度 大于0，说明选中了父级分类
        // 则添加的分类的父级id 为selectKeys数组中的最后一项
        this.cateinfo.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.cateinfo.cat_level = this.selectKeys.length
      }
    },
    // 添加分类事件
    addCate () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('categories', this.cateinfo)
        if (res.meta.status !== 201) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success(res.meta.msg)
        this.closeAddCate()
        this.$emit('getCategoriesList')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
