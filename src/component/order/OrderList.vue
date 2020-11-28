<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <!-- 卡片布局区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-input
        placeholder="请输入内容"
        v-model="params.query"
        style="width:350px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 表格区域 -->
      <el-table border :data="orderLists">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="{row}">
            <el-tag v-if="row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
export default {
  data () {
    return {
      info: ['订单管理', '订单列表'],
      orderLists: [],
      // 订单数据参数对象
      params: {
        // 输入框变量
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单总条数
      total: 0
    }
  },
  created () {
    this.getOrderLists()
  },
  methods: {
    // 获取订单列表数据
    async getOrderLists () {
      const { data: res } = await this.$http.get('orders', {
        params: this.params
      })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.orderLists = res.data.goods
      console.log(res.data.goods)
      this.total = res.data.total
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
</style>
