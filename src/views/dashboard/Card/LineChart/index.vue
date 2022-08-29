<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'LineChart',
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          data: [4,2,5,2,3,6,4],
          //拐点的样式
          itemStyle: {
            opacity: 0
          },
          //线条的样式
          lineStyle: {
            color: '#ed5a65'
          },
          //填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: '#ed5a65' // 0% 处的颜色
              }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true,
        }
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    })
  },
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>