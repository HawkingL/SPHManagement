<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <!-- 表格组件:
          data：将来需要展示的数据-----数组类型(以列的显示进行展示)
          border：添加表格的标签
     -->
    <el-table style="width: 100%" border :data="list">
      <!-- el-table-column代表表格中的一列：
            label：要显示的标题
            width：对应列的宽度
            align：标题文字的对齐方式
            type="index"：表示第一列是从1开始的序号
            prop：对应列内容的字段名
       -->
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 120px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器：
          current-page：当前第几页
          total：分页器要展示数据的总条数
          page-size：每一页需要展示的数据条数
          page-sizes：让用户设置每一页要展示多少条数据，值为数组，数组中的元素代用户自定义的值
          @size-change="handleSizeChange"：某一页要展示的数据条数发生改变时触发，返回一页展示的数据条数
          @current-change="handleCurrentChange"：当分页器的当前页发生变化时会触发该事件，并获取当前点击的页数
          layout：实现分页器的布局（->后面的元素都得贴到整个容器的最右边）
          pager-count：分页器数字按钮的数量
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="1"
      :page-sizes="[5, 10, 15]"
      :page-size="5"
      layout="prev, pager, next, jumper,->,sizes, total"
      :total="total"
      :pager-count="7"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!--对话框 
          visible.sync：控制对话框显示与隐藏
          rules：Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- from表单
            model：把表单的数据收集的到某个对象上，将来表单验证也需要这个属性
       -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片的组件
                :on-success=""：可以检测图片是否上传成功，如果上传成功会执行一次回调
                :before-upload=""：上传图片之前会执行一次
                action：设置你上传图片的地址
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      //代表分页器的第几页
      page: 1,
      //表示当前页默认要展示的数据条数
      limit: 5,
      //数据的总条数
      total: 0,
      //数据列表
      list: [],
      //对话框显示与隐藏的控制属性
      dialogFormVisible: false,
      //收集品牌的信息（属性值需要看文档）
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      //表单验证规则
      rules: {
        /* 表单验证规则（使用规则时要将from-item的prop属性设置为需要效验的字段名）
              required：设置是否为必填项
              min：规定最少需要输入多少个字符
              max：规定最多需要输入多少个字符
              message：输入信息不符合规则时的提示信息
              trigger：什么时候触发，失去焦点时触发还是文本改变时触发（blur|change）
        */
        //品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        //品牌logo的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ],
      }
    }
  },
  mounted() {
    //获取列表数据
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList(pager = 1) {
      //修改当前页
      this.page = pager;
      //解构参数
      const {page, limit} = this;
      //派发请求，获取商品数据
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //分页器某一页需要展示的数据条数发生改变时触发
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //清除上一次添加残留的数据
      this.tmForm = {tmName: '', logoUrl: ''};
    },
    //修改某个品牌
    updateTradeMark(row) {
      //row：用户当前选中的品牌信息
      //显示对话框
      this.dialogFormVisible = true;
      this.tmForm = {...row};
    },
    //上传图片相关的回调
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回给前端的数据（缩进版数据）
      //file：上传成功之后服务器返回给前端的数据（详细数据）
      //收集服务器返回的图片地址
      this.tmForm.logoUrl = res.data;
    },
    //判断图片格式大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //添加或修改品牌的按钮
    addOrUpdateTradeMark() {
      //判断表单是否效验成功
      this.$refs.ruleForm.validate(async (success) => {
        //表单验证成功时success为true失败时为false
        if (success) {
          this.dialogFormVisible = false;
          //发起请求（添加|修改品牌）
          let result = await this.$API.trademark.reqAddUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            //弹出提示信息
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            });
            //更新数据

            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //删除品牌信息
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //用户点击确定按钮的时候会触发
        //向服务器派发请求
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //再次更新数据
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        //用户点击取消按钮的时候会触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
