<template>
	<el-dialog title="客户项目——新建——选择" width="45%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
      <el-form :inline="false" :model="query" label-width="100px" class="demo-ruleForm">
    
        <el-row>
          <el-col :span="8">
            <el-form-item label="助记码">
              <el-input v-model="query.coopMnemonicV" clearable auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中文全称" >
              <el-input v-model="query.coopNameV" clearable auto-complete="off" >
              </el-input>
            </el-form-item>
          </el-col>
           <el-col :span="2" style="text-align: center; margin-right: -12px;">
           <el-button type="primary" icon="el-icon-search" @click="queryList">搜索</el-button>
           </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
      <el-table :data="data1" height="400px">
        <el-table-column prop="coopCodeV" label="代码"  width="120"></el-table-column>
        <el-table-column prop="coopMnemonicV" label="助记码"  width="120"></el-table-column>
        <el-table-column prop="coopNameV" label="中文全称" ></el-table-column>
       
        <el-table-column  label="操作" width="100">
        	<template slot-scope="scope">
            <el-button type="text" size="small" v-on:click="doSelect(scope.row)" >选择</el-button>
            
          </template>
        </el-table-column>
        <!-- :formatter="formatter1" -->
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
	</el-dialog>
</template>
<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			return {
        loading: false,
        data1: [],
        options:[],
        options2:[],
        pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录数
            totalPage: 0, //总记录数
            pageOption: [10, 50, 100]
        },
        query: {
          coopMnemonicV: '',
          coopNameV: '',
          awbFromType: ''
        },
        saveVisible:false
      }
    },
   
    inject:['setValue'],
    created: function(){
    	this.query.awbFromType="'互为代理','外部客户','海外代理'";
     
      this.queryList();
    },

    methods: {
      openError(info) {
        this.$notify({
          title: '',
          message: '操作失败，'+info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      doSelect(rrow){
        this.setValue(rrow);
        this.handleClose();
      } ,
      queryList(){
    
          let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
          +"&coopMnemonicV="+this.query.coopMnemonicV+"&coopNameV="+this.query.coopNameV
          +"&awbFromType="+this.query.awbFromType;
          let that  = this;
          this.$axios.get('/afbase/awb/selectpage?'+param).then(function(response){
              that.data1 = response.data.data.records;
              that.pageConf.totalPage=response.data.data.total;
              if (that.data1.length==0) {
                let current=Math.ceil(that.pageConf.totalPage/that.pageConf.pageSize);
                that.queryList2(current);
              }
          }).catch(function (error) {
            console.log(error);
          });
             
        
      },
      queryList2(current){   
      let param = "size="+this.pageConf.pageSize+"&current="+current
          +"&coopMnemonicV="+this.query.coopMnemonicV+"&coopNameV="+this.query.coopNameV
          +"&awbFromType="+this.query.awbFromType;
        let that  = this;
        this.$axios.get('/afbase/awb/selectpage?'+param).then(function(response){
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
      
      formatter1(row, column){
          return row.awbFromType+' - '+row.awbFromName;
      },
      formatter2(row, column){
        if (row.apLongitude&&row.apLatitude) {
          return row.apLongitude+","+row.apLatitude;
        }else{
          return "";
        }
      },
	handleClose() {
		this.$emit('update:visible', false);
	}

//--------------------- 

    }
  }
</script>
<style type="text/css">

</style>