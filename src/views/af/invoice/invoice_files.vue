<template>
  <el-dialog :title="titleName" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" >
    <div class="income_files">
    <el-form :model="ruleForm2" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
     <el-row>
      <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="uploadOrderFiles" >附件上传</el-button>
      <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="uploadBatchOrderFiles" >批量上传</el-button>
      </el-row>
      <el-row>
      <el-table  :data="dataTwo" border>
      	<el-table-column align="center" label="操作" width="60" type="index" >
      		<template slot-scope="scope">
            <i class="iconfont el-icon-myjianhao" @click="deleteOrderFiles(scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
      		<!-- 	<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
      				<i class="iconfont el-icon-myjianhao"></i>
      				<el-dropdown-menu slot="dropdown">
      					<el-dropdown-item></el-dropdown-item>
      					<el-dropdown-item command="delete" >删除</el-dropdown-item>
      				</el-dropdown-menu>
      			</el-dropdown> -->
      		</template>
      	</el-table-column>
      	<el-table-column prop="fileType" label="附件类型" width="100" align="center"></el-table-column>
      	<!-- <el-table-column prop="createTime" label="上传日期" width="120" align="center"></el-table-column> -->
      	<el-table-column label="文件名称" width="380" align="left" header-align="center">
      		<template slot-scope="scope">
      			<span style="cursor: pointer;" @click="orderFileView(scope.row)">{{scope.row.fileName}}</span>
      		</template>
      	</el-table-column>
      	<el-table-column prop="fileRemark" label="备注" align="left" header-align="center"></el-table-column>
      </el-table>
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-button type="primary"  size="medium"  @click='handleClose' style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">取消</el-button>
      </el-row>
      <el-row style="margin-top: 10px;"></el-row>
    </el-form>
    <orderFilesSave ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="ffrow"></orderFilesSave>
    <batchOrderFilesSave ref="addMission" v-if="saveBatchVisible" :visible.sync="saveBatchVisible" :frow="ffrow"></batchOrderFilesSave>
  </div>

  </el-dialog>
</template>
<script>
  import OrderFilesSave from './invoice_file_save'
  import BatchOrderFilesSave from './invoice_batch_file_save'
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
        data: [],
        saveVisible:false,
        saveBatchVisible:false,
        loading:false,
        dataTwo:[],
        titleName:'发票-附件',
        ffrow:{},
        ruleForm2: {
         fileStrs:'',
         invoiceDetailId:this.frow.invoiceDetailId,
         invoiceDetailWriteoffId:this.frow.invoiceDetailWriteoffId,
         businessType:this.frow.businessType
        },
        rules: {
        }
      }
    },
    inject: ['queryList'],
    components: {
    	'orderFilesSave': OrderFilesSave,
    	'batchOrderFilesSave': BatchOrderFilesSave
    },
    provide() {
    	return {
    		queryFiles: this.queryFiles,
        queryBatchFiles: this.queryBatchFiles,
        queryListFile:this.queryListFile
    	}
    },
    created: function(){
      this.queryListFile();
    },

    methods: {
      queryListFile(){
        let ids = null;
        if(this.frow.businessType=='invoice'){
          this.titleName = '发票-附件';
          ids = this.frow.invoiceDetailId;
        }else{
          this.titleName = '核销单-附件';
          ids = this.frow.invoiceDetailWriteoffId;
        }
        //查询数据
        this.$axios.get2('/afbase/cssIncomeFiles/'+this.frow.businessType+'/'+ids).then((response) => {
         this.dataTwo = response.data.data;
         this.dataTwo.forEach((column, index) => {
            column.index = index;
         });
        }).catch((error) => {
        	console.log(error);
        });
      },
      queryFiles(p){
        p.index = this.dataTwo.length;
        this.dataTwo.push(p);
      },
      queryBatchFiles(p){
        p.forEach((column, index) => {
            column.index = this.dataTwo.length;
            this.dataTwo.push(column);
        });
      },

      submit(row){
         this.$axios.post2('/afbase/cssIncomeFiles/deleteFile',row)
          .then((response) => {
            if (response.data.code == 0) {
              // this.openSuccess("保存成功")
              this.queryListFile();
              // this.handleClose()
            } else {
              this.openError(response.data.messageInfo)
            }
          }).catch((error) => {
            this.openError(error.response.data.messageInfo)
          });
      },
      handleClose() {
        this.queryList();
      	this.$emit('update:visible', false);
      },
      openError(info) {
      	this.$notify({
      		title: '',
      		message: info,
      		type: 'error',
      		position: 'bottom-right'
      	});
      },
      openSuccess(info) {
      	this.$notify({
      		title: '',
      		message: info,
      		type: 'success',
      		position: 'bottom-right'
      	});
      },
       //附件
       uploadOrderFiles() {
         this.ffrow.businessType = this.frow.businessType;
         this.ffrow.invoiceDetailId =  this.frow.invoiceDetailId;
         this.ffrow.invoiceDetailWriteoffId = this.frow.invoiceDetailWriteoffId;
       	 this.saveVisible = true
       },
       uploadBatchOrderFiles() {
         this.ffrow.businessType = this.frow.businessType;
         this.ffrow.invoiceDetailId =  this.frow.invoiceDetailId;
         this.ffrow.invoiceDetailWriteoffId = this.frow.invoiceDetailWriteoffId;
       	 this.saveBatchVisible = true
       },
       deleteOrderFiles(row) {
       	// this.$prompt('您将删除' + row.fileName + '附件,此操作不可恢复 , 是否继续?', '提示', {
        this.$prompt('您好 , 删除附件后不可恢复 , 是否继续?', '提示', {
       		showInput: false,
       		cancelButtonText: '取消',
       		confirmButtonText: '确定',
       		type: 'warn',
       		center: true
       	}).then(() => {
            // this.$delete(this.dataTwo,row.index);
            // this.dataTwo.forEach((column, index) => {
            //    column.index = index;
            // });
            this.submit(row);
            // this.openSuccess("删除成功！")
       	}).catch(() => {
       		// this.$message({
       		// 	type: 'info',
       		// 	message: '已取消删除'
       		// });
       	});
       },
       orderFileView(row) {
      	window.open(row.fileUrl)
      },
      handleChange(command,index) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'delete') {
					this.deleteOrderFiles(this.currRow)
				}
			},
    }
  }
</script>
<style type="text/css">
	.income_files .el-input__icon {
		line-height: 30px !important;
	}

	.income_files .el-form-item__content {
		line-height: 40px !important;
	}

	.income_files .el-input-group__prepend {
		padding: 0 6px;
	}

	.income_files .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.income_files .el-button {
		margin-top: -5px !important
	}
  .income_files .showWordLimit .el-input__inner {
  	padding-right: 80px !important;
  }

  .income_files .showWordLimit .el-textarea__inner {
  	padding-right: 50px;
  }
</style>
