<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width" align="center"></el-table-column>
      <el-table-column label="默认照片" width="110" align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" width="80" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center" >
        <template slot-scope="{row}">
          <el-button style="margin: 5px" type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale == 1" @click="cancel(row)"></el-button>
          <el-button style="margin: 5px" type="success" icon="el-icon-top" size="mini" v-else @click="sale(row)"></el-button>
          <el-button style="margin: 5px" type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button style="margin: 5px" type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button style="margin: 5px" type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[5, 10, 50]"
      :page-size="limit"
      layout="prev, pager, next, jumper, -> ,total, sizes"
      :total="total">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16"> {{skuInfo.skuName}} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16"> {{skuInfo.skuDesc}} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16"> {{skuInfo.price}}元 </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right: 10px"> {{attr.attrId}}-{{attr.attrValue}} </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width: 100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前页数
      page: 1,
      //总共有多少条数据
      limit: 5,
      //存储sku列表的数据
      records: [],
      //存储分页器一共展示的数据
      total: 0,
      //s商品详情
      skuInfo: {},
      //抽屉的显示与隐藏
      show: false,
    }
  },
  mounted() {
    //获取sku列表
    this.getSkuList();
  },
  methods: {
    //获取sku列表的方法
    async getSkuList(pages = 1) {
      this.page = pages;
      const {page, limit} = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //sku的上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({type: 'success', message: '上架成功'});
      }
    },
    //sku的下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({type: 'success', message: '下架成功'});
      }
    },
    edit() {
      this.$message('开发中')
    },
    //获取商品详情的方法
    async getSkuInfo(row) {
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      };
      //展示抽抽屉
      this.show = true;
    }
  },
};
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>

<style scoped>
 .el-row .el-col-5 {
   font-size: 18px;
   text-align: right;
 }
 .el-col {
   margin: 10px;
 }
</style>