<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <!-- 卡片布局区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary">添加分类</el-button>
      <el-table stripe :data="cateList">
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="" label="是否有效"></el-table-column>
        <el-table-column label="排序"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
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
      }
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
      //   console.log(res.data)
      this.cateList = res.data.result
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
</style>
