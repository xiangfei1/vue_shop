<template>
    <div>
        <!-- 面包屑区域 -->
        <breadCrumb :info="info"/>
        <!-- 卡片区域 -->
        <el-card>
            <div ref="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import breadCrumb from '@/component/subcomponent/breadCrumb.vue'
import echarts from 'echarts'
export default {
  data () {
    return {
      info: ['数据统计', '数据报表'],
      // 合并折线统计图配置信息
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    const myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    //   获取统计图配置信息
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$msg.error(res.meta.msg)
    }
    const result = { ...this.options, ...res.data }
    myChart.setOption(result)
  },
  methods: {
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>

</style>
