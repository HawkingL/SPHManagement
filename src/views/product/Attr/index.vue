<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 5px 10px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
          label-position="left"
          :model= "attrInfo"
        >
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{row, $index}">
              <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block"> {{row.valueName}} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{row, $index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受服务器属性的字段
      attrList: [],
      //是否展示table
      isShowTable: true,
      //收集新增|修改属性时使用
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //几级id
      },
    };
  },
  methods: {
    getCategoryId(cForm) {
      //结构出每级分类的id
      const { category1Id, category2Id, category3Id } = cForm;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      //获取产品属性列表
      this.getAttrList();
    },
    //获取产品属性列表的方法
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值中push元素------可以新添加一个input框
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,  //attrId就是产品id
        valueName: '',
        flag: true,
      });
      //让新添加的input框自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //清除残留的数据
      this.attrInfo = {
        attrName: "", 
        attrValueList: [], 
        categoryId: this.category3Id, 
        categoryLevel: 3,
      }
    },
    //修改某一个属性
    updateAttr(row) {
      //隐藏table
      this.isShowTable = false;
      //将slot插槽回传的attrList数组深拷贝到attrInfo身上
      this.attrInfo = cloneDeep(row);
      //当点击修改摸一个属性时，给相应的属性值元素上添加flag这个标签
      this.attrInfo.attrValueList.forEach(item => {
        //给VC身上的attrInfo.attrValueList中的每一个元素绑定一个flag属性，属性值为true（响应式绑定）
        this.$set(item, 'flag', false);
      });
    },
    //失去焦点的事件---切换查阅模式和编辑模式
    toLook(row) {
      //判断输入的值是否为空
      if (row.valueName.trim() == '') {
        this.$message('请输入一个正常的值');
        return;
      }
      //新增属性不能重复
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat)  {
        this.$message('属性值重复，请重新输入');
        return;
      }
      //失去焦点就隐藏input框
      row.flag = false;
    },
    //点击span的回调-----在变为编辑模式的同时自动获取焦点
    toEdit(row, index) {
      //变为编辑模式
      row.flag = true;
      //自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    //气泡确认框的确定按钮的回调-----删除属性值
    deleteAttrValue(index) {
      //删除数组中的某个元素
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮的回调
    async addOrUpdateAttr() {
      //整理参数---去掉空的属性值和flag标签
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueNama != '') {
          delete item.flag;
          return true;
        }
      });
      try {
        //将修改后的数据发送到服务器
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //保存成功后返回商品属性列表页面
        this.isShowTable = true;
        //保存成功后弹出提示框
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        //更新属性列表
        this.getAttrList();
      } catch (error) {
        //如果请求失败响应拦截器就会报错，因此这里不需要捕获错误
      }
    },
    async deleteAttr(row) {
      let result = await this.$API.attr.reqDeleteAttr(row.id);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
      this.getAttrList();
    }
  },
};
</script>

<style>
</style>