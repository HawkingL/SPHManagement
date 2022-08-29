<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id" style="margin: 8px">
            <el-select value="" placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select value="" placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="照片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片信息
      spuImageList: [],
      //存储销售属性
      spuSaleAttrList: [],
      //存储平台属性
      attrInfoList: [],
      spu: {},
      //收集sku的字段
      skuInfo: {
        //第一类收集的数据：父组件收集给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类收集的数据：通过数据的双向绑定来收集
        skuName: "",
        price: "",
        skuDesc: "",
        weight: "",
        //第三类收集的数据：通过自己编写代码收集
        skuDefaultImg: "", //默认图片
        //平台属性
        skuAttrValueList: [
          /* {
            attrId: 0,
            valueId: 0,
          }, */
        ],
        skuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        //sku的销售属性列表
        skuSaleAttrValueList: [
          /* {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "",
            saleAttrValueId: 0,
            saleAttrValueName: "",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      //收集图片的字段(缺少default字段后期整理数据时需要手动添加)
      imageList: []
    };
  },
  methods: {
    //获取SkuForm的数据
    async getData(category1Id, category2Id, spu) {
      //收集父组件传过来的id
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //获取图片的数据
      let result = await this.$API.spu.reqSpuImgList(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //table表格复选框按钮事件
    handleSelectionChange(selection) {
      //收集数据
      this.imageList = selection;
    },
    //排他操作----切换为默认值
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消按钮
    cancel() {
      //切换场景
      this.$emit('changeScenes', 0)
      //清除上一次退出时残留数据
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的事件
    async save() {
      //整理平台属性
      const {attrInfoList, skuInfo, spuSaleAttrList, imageList} = this;
      let arr = [];
      //把收集到的数据进行整理
      attrInfoList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':');
          let obj = {valueId, attrId};
          arr.push(obj);
        }
      });
      //将整理之后的参数赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = arr

      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({saleAttrId, saleAttrValueId});
        }
        return prev;
      }, []);

      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      });
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({type: 'success', message: '添加sku成功'});
        this.$emit('changeScenes', 0);
      };
      //清除上一次退出时残留数据
      Object.assign(this._data, this.$options.data());
    }
  },
};
</script>

<style>
</style>