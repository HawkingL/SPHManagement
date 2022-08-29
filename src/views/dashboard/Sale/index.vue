<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
        <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span>今日</span>
        <span>本周</span>
        <span>本月</span>
        <span>本年</span>
        <el-date-picker
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="data"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div>
            <h3>门店销售排名</h3>
            <ul>
              <li>
                <span class="rindex">0</span>
                <span>肯德基</span>
                <span class="rvalue">324442</span>
              </li>
              <li>
                <span class="rindex">1</span>
                <span>蜜雪冰城</span>
                <span class="rvalue">324442</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>海底捞</span>
                <span class="rvalue">324442</span>
              </li>
              <li>
                <span>3</span>
                <span>兰州牛肉面</span>
                <span class="rvalue">324442</span>
              </li>
              <li>
                <span>4</span>
                <span>周黑鸭</span>
                <span class="rvalue">324442</span>
              </li>
              <li>
                <span>5</span>
                <span>放哈</span>
                <span class="rvalue">324442</span>
              </li>
              <li>
                <span>6</span>
                <span>爱的礼物</span>
                <span class="rvalue">324442</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "销售额",
    };
  },
  computed: {
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    listState() {
      this.mycharts.setOption({
        title: {
          text: "销售额趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.userFullYear,
            color: "#ad6598",
          },
        ],
      });
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.listState.userFullYear,
          color: "#ad6598",
        },
      ],
    });
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.data {
  width: 200px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 8px 0;
}
ul li span {
  margin: 0 10px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: aliceblue;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>