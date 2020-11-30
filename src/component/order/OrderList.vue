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
        style="width: 350px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 表格区域 -->
      <el-table border :data="orderLists">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="{ row }">
            <el-tag v-if="row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="{row}">
            {{row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作按钮区域 -->
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 修改对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClose">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input
            v-model="addressForm.address2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
    <el-dialog
  title="查看物流进度"
  :visible.sync="progressDialog"
  width="50%">
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
import cityData from '@/component/order/citydata.js'
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
      total: 0,
      addressVisible: false,
      // 表单对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 表单检验规则对象
      addressFormRules: {
        address1: [{ required: true, message: '请输入省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细信息', trigger: 'blur' }]
      },
      // 级联选择配置信息对象
      props: {
        expandTrigger: 'hover',
        label: 'label',
        value: 'value',
        children: 'children'
      },
      cityData,
      progressDialog: false,
      // 物流信息对象
      activities: []
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
      this.total = res.data.total
    },
    // 页面实际显示大小 变化事件
    handleSizeChange (val) {
      this.params.pagesize = val
      this.getOrderLists()
    },
    // 当前页改变事件
    handleCurrentChange (val) {
      this.params.pagenum = val
      this.getOrderLists()
    },
    // 控制修改对话框的显示
    showEdit () {
      this.addressVisible = true
    },
    // 对话框关闭事件
    addressDialogClose () {
      this.$refs.addressFormRef.resetFields()
    },
    // 级联选择器改变事件
    handleChange () {},
    // 控制查看物流对话框
    async showProgress () {
      this.progressDialog = true
      const { data: res } = await this.$http.get(`/kuaidi/${1106975712662}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.activities = res.data
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
