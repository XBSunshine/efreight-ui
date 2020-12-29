<template>
	<el-dialog title="" width="1120px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose"  append-to-body>
		<el-form :model="ruleForm" :inline="true" ref="ruleForm" class="demo-ruleForm" style="margin-left: 15px;">
			<div style="margin-top: -15px;margin-bottom: 20px;">
				<span style="font-size: 18px;margin-bottom: 20px;">安检货物品名 - 导入</span>
			</div>
			<el-row>
        <el-col>
          <el-upload class="upload-demo" ref="upload" action="/prm/coop/importData" :show-file-list="false" :http-request="uploadFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="true">
            <el-button slot="trigger" type="primary" size="small" :disabled="disabledFlag">上传模板</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" size="small" @click="downloadTemplate" plain>下载模板</el-button>
            <!-- <span style="font-weight: bold;color: red;margin-left: 10px;">提示：单个文件数据的最大行数为2000。</span> -->
            
          </el-upload>
        </el-col>
			</el-row>
			<el-row style="margin-top: 5px;">

				<el-table v-loading="loading" :data="data1" height="450px" style="width: 1620px;" border :row-class-name="setClassName" :default-expand-all="true" class="cooptable">
          <!-- <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand" v-if="scope.row.errorMessage!=''">
                <el-form-item label="" v-if="scope.row.errorMessage!=''">
                  <span style="color:red;padding:5px 100px;" >错误内容 : {{ scope.row.errorMessage }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column> -->
					<el-table-column prop="coop_code" label="中文品名" align="center" >
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.coopCodeErrorFlag=='2'" style="color:red">{{ formatter22(scope.row) }}</span>
              <span v-else>{{ formatter22(scope.row) }}</span> -->
              <span >{{ formatter22(scope.row) }}</span>
            </template>
          </el-table-column>
					<el-table-column prop="coop_type" align="center" label="英文品名" >
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.coopTypeErrorFlag=='2'" style="color:red">{{ formatter33(scope.row) }}</span>
              <span v-else>{{ formatter33(scope.row) }}</span> -->
              <span >{{ formatter33(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_name" label="件数" align="center" width="150">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.coopNameErrorFlag=='2'" style="color:red">{{ formatter44(scope.row) }}</span>
              <span v-else>{{ formatter44(scope.row) }}</span> -->
              <span >{{ formatter44(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_ename" align="center" label="货物类型" width="180">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.coopENameErrorFlag=='2'" style="color:red">{{ formatter55(scope.row) }}</span>
              <span v-else>{{ formatter55(scope.row) }}</span> -->
              <span >{{ formatter55(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_ename" align="center" label="鉴定编号" width="180">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.coopENameErrorFlag=='2'" style="color:red">{{ formatter55(scope.row) }}</span>
              <span v-else>{{ formatter55(scope.row) }}</span> -->
              <span >{{ formatter66(scope.row) }}</span>
            </template>
          </el-table-column>
				</el-table>

			</el-row>
			<el-row>
				<el-form-item style="height: 40px;">
					<el-button type="primary" size="small" @click="submitImport" :disabled="disabledFlag1">确认导入</el-button>
				</el-form-item>
			</el-row>
		</el-form>
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
				options2: [],
				save: false,
				disabledFlag: false,
        disabledFlag1: true,
				ffrow: {
					awbFromType: ''
				},
				ruleForm: {
				},
			};
		},
		inject: ['querylist'],
		components: {
			/*'save': save*/
		},
		/*provide() {
			return {
				setValue: this.setValue
			}
		},*/
		methods: {
      setClassName({row, index}){
          // 通过自己的逻辑返回一个class或者空
          if(row.errorMessage){

          }else{
              return 'expand';
          }
      },
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
      // 上传文件
      uploadFile(item) {
          this.loading = true;
			    this.disabledFlag = true;
          this.data1 = [];
          const fileObj = item.file

          // FormData 对象
          const form = new FormData()
          // 文件对象
          form.append('file', fileObj)
          //form.append('comId', this.comId)
          //console.log(JSON.stringify(form))
          this.$axios.post2('/afbase/goodsName/importData', form)
              .then(function(response) {
                  if(response.data.code == 0) {
                      this.data1 = response.data.data
                      this.disabledFlag = false;
                      if(response.data.messageInfo == 'haveError'){
                          this.disabledFlag1 = true;
                      }else{
                          this.disabledFlag1 = false;
                      }
                  } else {
                      this.disabledFlag = false;
                      this.openError(response.data.messageInfo);
                  }
                  this.loading = false;
              }.bind(this)).catch(function(error) {
              this.loading = false;
              this.openError(error.response.data.messageInfo);
          }.bind(this));
      },
      //确认导入
      submitImport(){
          if(this.data1.length == 0){
              this.openError("文件无数据，请重新上传");
              this.loading = false;
              this.disabledFlag1 = true;
              this.disabledFlag = false;
              return;
          }
          this.loading = true;
          this.disabledFlag1 = true;
          this.disabledFlag = true;
          for (var i = 0; i < this.data1.length; i++) {
            this.data1[i].orderId=this.frow.orderId
          }
          this.$axios.post2('/afbase/goodsName/submitImport', this.data1)
              .then(function(response) {
                  if(response.data.code == 0) {
                      this.data1 = [];
                      this.data1 = response.data.data
                      if(response.data.messageInfo == 'haveError'){
                          this.openError("数据有错误");
                      }else{
                          this.openSuccess();
                          this.querylist();
                          this.handleClose();
                      }
                      this.loading = false;
                      this.disabledFlag1 = false;
                  } else {
                      this.loading = false;
                      this.disabledFlag1 = false;
                      this.openError(response.data.messageInfo);
                  }
              }.bind(this)).catch(function(error) {
              this.loading = false;
              this.disabledFlag1 = false;
              this.disabledFlag = false;
              this.openError(error.response.data.messageInfo);
          }.bind(this));
      },
      downloadTemplate(){
          this.$axios.post('/afbase/goodsName/downloadTemplate').then((response) => {
              window.open(response.data.data)
          }).catch(function(error) {
              console.log(error);
          });
      },
      submitUpload() {
          this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
          console.log(file, fileList);
      },
      handlePreview(file) {
          console.log(file);
      },
      formatter22(row, column) {
          return row.goodsCnnames;
      },
        formatter33(row, column) {
            return row.goodsEnnames;
        },
        formatter44(row, column) {
            return row.quantity;
        },
        formatter55(row, column) {
            return row.cargoType;
        },
        formatter66(row, column) {
            return row.reportIssueNo;
        },
        formatter77(row, column) {
            return row.bank_name;
        },
        formatter88(row, column) {
            return row.bank_number;
        },
        formatter99(row, column) {
            return row.phone_number;
        },
        formatter10(row, column) {
            return row.coop_address;
        },
        formatter11(row, column) {
            return row.coop_remark;
        },
        formatter12(row, column) {
            return row.full_address;
        },
        formatter13(row, column) {
            return row.contacts_name1;
        },
        formatter14(row, column) {
            return row.email;
        },
        formatter15(row, column) {
            return row.phone_number1;
        },
        formatter16(row, column) {
            return row.dept_name;
        },
        formatter17(row, column) {
            return row.job_position;
        },
		},
		created() {
		}
	}
</script>
<style type="text/css">

</style>
