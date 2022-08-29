<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'ProgressCharts',
  mounted() {
    //初始化echarts实例
    let progressCharts = echarts.init(this.$refs.charts);
    progressCharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [68],
          barWidth: 20,
          color: '#ee3f4d',
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          //文本标签
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
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