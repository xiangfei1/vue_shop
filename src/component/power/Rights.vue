<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightsInfo" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="{ row }">
            <el-tag v-if="row.level === '0'">标签一</el-tag>
            <el-tag v-else-if="row.level === '1'" type="success">标签二</el-tag>
            <el-tag v-else type="warning">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
export default {
  props: {},
  data () {
    return {
      info: ['权限管理', '权限列表'],
      // 权限列表
      rightsInfo: []
    }
  },
  created () {
    this.getRightsInfo()
  },
  methods: {
    async getRightsInfo () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.rightsInfo = res.data
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
</style>
