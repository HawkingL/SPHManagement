<template>
  <div>
    <!-- elementUI的栅格系统
          gutter；两个col之间的距离设置
     -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥12334">
            <template slot="charts">
              <div style="font-size: 15px;font-weight: 400; padding-top: 20px">
                <span>周同比56% <svg t="1648091034993" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3025" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="3026"></path></svg></span>
                <span>日同比56% <svg t="1648091235501" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8805" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="8806"></path></svg></span>
              </div>
            </template>
            <template slot="footer">
              <span>日销售量￥123442</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="2334">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日访问量1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="342342">
            <template slot="charts">
              <BarCharts/>
            </template>
            <template slot="footer">
              <span>转化率75%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="23%">
            <template slot="charts">
              <ProgressCharts />
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;&nbsp;34% <svg t="1648091034993" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3025" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="3026"></path></svg></span>
              &nbsp;&nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;&nbsp;23% <svg t="1648091235501" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8805" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="8806"></path></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Detail from './Detail';
  import LineCharts from './LineChart'
  import BarCharts from './BarCharts'
  import ProgressCharts from './ProgressCharts'
  export default {
    name: 'Card',
    components: {
      Detail,
      LineCharts,
      BarCharts,
      ProgressCharts,
    }
  }
</script>

<style>

</style>