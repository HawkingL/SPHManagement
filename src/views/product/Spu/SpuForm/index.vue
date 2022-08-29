<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select value="" placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片
              list-type：文件列表的类型 text/picture/picture-card	
              on-preview=""：图片预览时会触发
              on-remove=""：删除图片时会触发
              file-list：上传的文件列表
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}个未选择`">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin: 5px">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="100" align="center">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu的数据
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述信息
        description: "",
        //品牌的id
        tmId: '',
        //spu的名称
        spuName: "",
        //收集spu图片的信息
        spuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          }, */
        ],
        //平台属性与属性值的收集
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      },
      //品牌信息
      tradeMarkList: [],
      //存储spu图片的信息
      spuImageList: [],
      //存储平台所有的销售属性的信息
      saleAttrList: [],
      //收集未选择的销售属性的id
      attrIdAndAttrName: '',
    };
  },
  computed: {
    //计算还未选择的属性
    unSelectSaleAttr() {
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName;
        })
      })
    }
  },
  props: ['c3Id'],
  methods: {
    //照片墙图片上床成功的回调
    handlerSuccess(response, file, fileList) {
      //收集上传成功后的所有图片
      this.spuImageList = fileList;
    },
    //照片墙删除某个照片时会触发
    handleRemove(file, fileList) {
      //file：代表的是删除的那张图片；fileList：代表的是照片墙删除某一张图片后剩余的图片
      //收集照片墙剩余的照片信息
      this.spuImageList = fileList;
    },
    //照片墙图片预览功能的回调
    handlePictureCardPreview(file) {
      //将上传后的图片地址赋值给dialogImageUrl
      this.dialogImageUrl = file.url;
      //控制dialog的显示与隐藏
      this.dialogVisible = true;
    },
    //初始化数据
    async initSpuData(spu = '') {
      if (spu) {
        //获取spu的数据
        let spuResult = await this.$API.spu.reqSpu(spu.id);
        if (spuResult.code == 200) {
          this.spu = spuResult.data;
        }
        //获取spu图片的数据
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
        if (spuImageResult.code == 200) {
          let listArr = spuImageResult.data;
          //对服务器返回的数据进行二次处理
          listArr.forEach((item) => {
            item.name = item.imgName;
            item.url = item.imgUrl;
          });
          //将处理过的数据重新赋值给spuImageList
          this.spuImageList = listArr;
        }
      }
      if (this.c3Id) {
        this.spu.category3Id = this.c3Id;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMark();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      
      //获取平台所有的销售属性
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      //收集需要添加的销售属性
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':');
      //向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空残留的数据
      this.attrIdAndAttrName = '';
    },
    //添加按钮的回调
    addSaleAttrValue(row) {
      //点击销售属性值当中的添加按钮时，需要将button变为input
      //给实例身上添加响应式数据，控制input和button的显示与隐藏
      this.$set(row, 'inputVisible', true);
      //通过给实例身上添加inputValue字段，收集新增的销售属性的属性值
      this.$set(row, 'inputValue', '');
    },
    //el-input失去焦点事件
    handleInputConfirm(row) {
      //解构出销售属性当中收集的数据
      const {baseSaleAttrId, inputValue, saleAttrName, spuId} = row;
      //属性值不能为空
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空');
        return;
      };
      //属性值不能重复
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue);
      if (!result) {
        this.$message('属性值不能重复');
        return
      };
      //新增的销售属性值
      let newSaleAttrValue = {spuId, saleAttrName, baseSaleAttrId, saleAttrValueName: inputValue};
      //失去焦点后向服务器提交的数据中push新增的销售属性值
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible为false-----显示button
      row.inputVisible = false;
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          spuId: this.spu.id,
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      });
      //发请求保存spu
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code ==200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      };
      //返回场景0
      this.$emit('changeScene', {scene: 0, flag: this.spu.id ? '修改' : '添加'});
      //清除残留的数据
      Object.assign(this._data, this.$options.data());
    },
    //取消按钮
    cancel() {
      this.$emit('changeScene', {scene: 0, flag: ''});
      //清除残留的数据
      Object.assign(this._data, this.$options.data());
    }
  },
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>