<<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'BarCharts',
  mounted() {
    //初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [4,2,5,2,3,6,4,7,3,9],
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