<template>
  <div >
    <div>
      <el-form :inline="true" :model="query" label-width="120px" class="demo-ruleForm">
        <el-row>
          <el-col :span="11">
            <el-form-item label="城市代码">
              <el-input v-model="query.cityCode" @input="query.cityCode=query.cityCode.toUpperCase()" clearable auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="城市名称">
              <el-input v-model="query.cityName" clearable auto-complete="off">
              </el-input>
            </el-form-item></el-col>
            <el-col :span="2" style="text-align: center; margin-right: -12px;">
              <el-button type="primary" icon="el-icon-search" @click="queryList2">搜索</el-button></el-col>
            <el-col :span="4">          
              <el-upload
                class="upload-demo"
                ref="upload"
                action="/afbase/airport/importData"
                :http-request="uploadFile"
                :limit="1"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传.xlsx/.xls文件，且不超过500kb</div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-table :data="data1" >
          <el-table-column prop="cityCode" label="城市代码" width="100"></el-table-column>
          <el-table-column prop="nationCode" label="国家代码" width="100"></el-table-column>
          <el-table-column prop="cityName" label="城市名称"></el-table-column>
          <el-table-column prop="cityEname" label="城市英文名"></el-table-column>
          <el-table-column prop="cityTelcode" label="城市区号" width="100"></el-table-column>
          <el-table-column prop="cityStatus" label="生效状态" :formatter="formatStatus" width="100"></el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageConf.pageCode"
          :page-sizes="pageConf.pageOption"
          :page-size.sync="pageConf.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageConf.totalPage">
        </el-pagination>
      </div>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        loading: false,
        data1: [],
        pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录数
            totalPage: 0, //总记录数
            pageOption: [10, 50, 100], //分页选项
            handleCurrentChange: function () {
            console.log("页码改变了");
            }
        },
        fileList:[],
        query: {
          cityCode: '',
          cityName: ''
        }
      }
    },
    created: function(){
      this.queryList();
    },
    provide(){
        return{
            queryList:this.queryList
        }
    },
    components: {
    
    },
    methods: {
      queryList(){       
        let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
        +"&cityCode="+this.query.cityCode+"&cityName="+this.query.cityName;
        let that  = this;
        this.$axios.get('/afbase/city/page?'+param).then(function(response){
            that.data1 = response.data.data.records;
            that.pageConf.totalPage=response.data.data.total;
        }).catch(function (error) {
          console.log(error);
        });
      },
      queryList2(){  
      this.pageConf.pageCode = 1;     
        let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
        +"&cityCode="+this.query.cityCode+"&cityName="+this.query.cityName;
        let that  = this;
        this.$axios.get('/afbase/city/page?'+param).then(function(response){
            that.data1 = response.data.data.records;
            that.pageConf.totalPage=response.data.data.total;
        }).catch(function (error) {
          console.log(error);
        });
      },
      //pageSize改变时触发的函数
      handleSizeChange() {
        this.queryList();
      },
      //当前页改变时触发的函数
      handleCurrentChange() {
        this.queryList();
      },
      
      formatStatus(row, column){
        return row.cityStatus == true ? "生效" : row.cityStatus == false ? "失效" : "";
      },
      
    // 上传文件
    uploadFile (item) {
      console.log(item)
      const fileObj = item.file
      
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      form.append('comId', this.comId)
      console.log(JSON.stringify(form))
      // let formTwo = JSON.stringify(form)

      // EnterAPI.iExcel(form).then(response => {
      //   console.log('MediaAPI.upload')
      //   console.log(response)
      //   this.$message.info('文件：' + fileObj.name + '上传成功')
      // })
      this.$axios.post2('/afbase/city/importData',form)
      .then(function(response) {
        // this.$message.info('文件：' + fileObj.name + '上传成功');
        this.$message.info('文件正在导入请耐心等待');
      }.bind(this)).catch(function(error) {
        
      }.bind(this));
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
//--------------------- 

    }
  }
</script>

