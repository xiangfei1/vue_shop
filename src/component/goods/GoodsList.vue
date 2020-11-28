<template>
  <div>
    <!-- 面包屑区域 -->
    <breadCrumb :info="info" />
    <!-- 卡片布局区域 -->
    <el-card>
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="15">
        <el-col :span="16">
          <el-input
            v-model="input"
            placeholder="请输入内容"
            clearable
            @clear="clearInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="toAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="{ row }">
            {{ row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="open(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="param.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
export default {
  props: {},
  data () {
    return {
      info: ['商品管理', '商品列表'],
      // 输入框信息
      input: '',
      // 商品列表数据
      goodsList: [],
      // 获取商品列表参数
      param: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 数据总数
      total: 0
    }
  },
  created () {
    this.goodsData()
  },
  methods: {
    // 获取商品列表数据
    async goodsData () {
      const { data: res } = await this.$http.get('goods', {
        params: this.param
      })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 页面大小变化事件
    handleSizeChange (currentSize) {
      this.param.pagesize = currentSize
      this.goodsData()
    },
    // 当前页面改变事件
    handleCurrentChange (current) {
      this.param.pagenum = current
      this.goodsData()
    },
    // 搜索事件
    searchGoods () {
      if (this.input.trim() === '') {
        return this.$msg.info('不能输入空值搜索')
      }
      this.param.query = this.input
      this.pagenum = 1
      this.goodsData()
    },
    // 输入框清空事件
    clearInput () {
      this.param = {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
      this.goodsData()
    },
    // 删除商品事件
    async removeGood (id) {
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success(res.meta.msg)
      this.goodsData()
    },
    // 确认删除事件
    async open (row) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') {
        return this.$msg('已取消删除')
      }
      this.removeGood(row.goods_id)
    },
    // 跳转添加商品页面
    toAddGoods () {
      this.$router.push('goods/add')
    }
  },
  watch: {
    // 当输入框为空,重新获取商品列表数据
    input (val) {
      if (val === '') {
        this.param = {
          query: '',
          pagenum: 1,
          pagesize: 5
        }
        this.goodsData()
      }
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
.el-row {
  width: 500px;
}
</style>
