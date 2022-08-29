<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table :data="records" style="width: 100%" border >
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU的名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU的描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          style="textAlign: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" :c3Id="category3Id"></SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table :data="skuList" style="width: 100%" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
          <el-table-column prop="price" label="价格" width="width"></el-table-column>
          <el-table-column prop="weight" label="重量" width="width"></el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //分页器当前第几页
      page: 1,
      //每一页需要展示多少条数据
      limit: 5,
      //spu列表的数据
      records: [],
      //分页器一共需要展示数据的条数
      total: 0,
      //场景的切换---0：spu数据列表，1：添加spu|修改spu，2：添加sku
      scene: 0,
      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      //spu信息
      spu: {},
      //存储sku列表的数据
      skuList: [],
      //loading加载效果
      loading: true,
    };
  },
  components: {SpuForm, SkuForm},
  methods: {
    //获取产品属性列表的方法
    async getSpuList(pages = 1) {
      //点击分页器的第几页按钮的回调
      this.page = pages;
      const {page, limit, category3Id} = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    getCategoryId(cForm) {
      //结构出每级分类的id
      const { category1Id, category2Id, category3Id } = cForm;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      //获取产品属性列表
      this.getSpuList();
    },
    //分页器每页展示数据条数改变时的条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      //切换场景
      this.scene = 1;
      this.$refs.spu.initSpuData();
    },
    //修改spu
    updateSpu(row) {
      this.scene = 1;
      //获取子组件的方法并使用该方法
      this.$refs.spu.initSpuData(row);
    },
    //changeScene场景切换的回调
    changeScene(scene, flag) {
      this.scene = scene.scene;
      //更新数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //删除spu的按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        //删除成功后显示提示信息
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        //更新页面
        this.getSpuList(this.records.length > 1 ? this.page : this.page-1);
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      //切换为场景2------添加sku的页面
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求（一共要发三个请求）
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //skuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看sku列表按钮的的回调
    async handler(spu) {
      //点击按钮后显示对话框
      this.dialogTableVisible = true;
      //保存spu信息
      this.spu = spu;
      //发请求获取sku列表
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //让loading效果隐藏
        this.loading = false;
      }
    },
    //关闭dialog对话框的回调
    close(done) {
      //开启loading效果
      this.loading = true;
      //清除残留数据
      this.skuList = [];
      //关闭对话框
      done();
    }
  },
};
</script>

<style>
</style>