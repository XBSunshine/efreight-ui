<template>
	<el-dialog title="" width="1120px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :inline="true" ref="ruleForm" class="demo-ruleForm" style="margin-left: 15px;">
			<div style="margin-top: -15px;margin-bottom: 20px;">
				<span style="font-size: 18px;margin-bottom: 20px;">客商资料 - 导入</span>
			</div>
			<el-row>
        <el-col>
          <el-upload class="upload-demo" ref="upload" action="/prm/coop/importData" :show-file-list="false" :http-request="uploadFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="true">
            <el-button slot="trigger" type="primary" size="small" :disabled="disabledFlag">上传模板</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" size="small" @click="downloadTemplate" plain>下载模板</el-button>
            <span style="font-weight: bold;color: red;margin-left: 10px;">提示：单个文件数据的最大行数为2000。</span>
            <!--<el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>-->
            <!--<div slot="tip" class="el-upload__tip">只能上传.xlsx/.xls文件，且不超过500kb</div>-->
          </el-upload>
        </el-col>
       <!-- <el-button type="primary" size="small">下载模板</el-button>-->
			</el-row>
			<el-row style="margin-top: 5px;">

				<el-table v-loading="loading" :data="data1" height="450px" style="width: 1620px;" border :row-class-name="setClassName" :default-expand-all="true" class="cooptable">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand" v-if="scope.row.errorMessage!=''">
                <el-form-item label="" v-if="scope.row.errorMessage!=''">
                  <span style="color:red;padding:5px 100px;" >错误内容 : {{ scope.row.errorMessage }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
					<el-table-column prop="coop_code" label="客商资料代码" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.coopCodeErrorFlag=='2'" style="color:red">{{ formatter22(scope.row) }}</span>
              <span v-else>{{ formatter22(scope.row) }}</span>
            </template>
          </el-table-column>
					<el-table-column prop="coop_type" align="center" label="客商资料类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.coopTypeErrorFlag=='2'" style="color:red">{{ formatter33(scope.row) }}</span>
              <span v-else>{{ formatter33(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_name" label="客商资料中文名称" align="center" width="330">
            <template slot-scope="scope">
              <span v-if="scope.row.coopNameErrorFlag=='2'" style="color:red">{{ formatter44(scope.row) }}</span>
              <span v-else>{{ formatter44(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_ename" align="center" label="客商资料英文名称" width="330">
            <template slot-scope="scope">
              <span v-if="scope.row.coopENameErrorFlag=='2'" style="color:red">{{ formatter55(scope.row) }}</span>
              <span v-else>{{ formatter55(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="social_credit_code" label="社会信用代码" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.socialCreditCodeErrorFlag=='2'" style="color:red">{{ formatter66(scope.row) }}</span>
              <span v-else>{{ formatter66(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bank_name" align="center" label="开户行" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.bankNameErrorFlag=='2'" style="color:red">{{ formatter77(scope.row) }}</span>
              <span v-else>{{ formatter77(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bank_number" label="银行账号" align="center" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.bankNumberErrorFlag=='2'" style="color:red">{{ formatter88(scope.row) }}</span>
              <span v-else>{{ formatter88(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone_number" align="center" label="手机号码" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.phoneNumberErrorFlag=='2'" style="color:red">{{ formatter99(scope.row) }}</span>
              <span v-else>{{ formatter99(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_address" label="地址" align="center" width="280">
            <template slot-scope="scope">
              <span v-if="scope.row.coopAddressErrorFlag=='2'" style="color:red">{{ formatter10(scope.row) }}</span>
              <span v-else>{{ formatter10(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coop_remark" align="center" label="备注" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.coopRemarkErrorFlag=='2'" style="color:red">{{ formatter11(scope.row) }}</span>
              <span v-else>{{ formatter11(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="full_address" label="注册地址" align="center" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.fullAddressErrorFlag=='2'" style="color:red">{{ formatter12(scope.row) }}</span>
              <span v-else>{{ formatter12(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contacts_name1" align="center" label="联系人_姓名" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.contactsName1ErrorFlag=='2'" style="color:red">{{ formatter13(scope.row) }}</span>
              <span v-else>{{ formatter13(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="联系人_邮箱" align="center" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.emailErrorFlag=='2'" style="color:red">{{ formatter14(scope.row) }}</span>
              <span v-else>{{ formatter14(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone_number1" align="center" label="联系人_电话" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.phoneNumber1ErrorFlag=='2'" style="color:red">{{ formatter15(scope.row) }}</span>
              <span v-else>{{ formatter15(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dept_name" label="联系人_部门" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.deptNameErrorFlag=='2'" style="color:red">{{ formatter16(scope.row) }}</span>
              <span v-else>{{ formatter16(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="job_position" align="center" label="联系人_职务" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.jobPositionErrorFlag=='2'" style="color:red">{{ formatter17(scope.row) }}</span>
              <span v-else>{{ formatter17(scope.row) }}</span>
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
		inject: ['queryCoopList'],
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
          this.$axios.post2('/prm/coop/importData', form)
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
          this.$axios.post2('/prm/coop/submitImport', this.data1)
              .then(function(response) {
                  if(response.data.code == 0) {
                      this.data1 = [];
                      this.data1 = response.data.data
                      if(response.data.messageInfo == 'haveError'){
                          this.openError("数据有错误");
                      }else{
                          this.openSuccess();
                          this.queryCoopList();
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
          this.$axios.post('/prm/coop/downloadTemplate').then((response) => {
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
          return row.coop_code;
      },
        formatter33(row, column) {
            return row.coop_type;
        },
        formatter44(row, column) {
            return row.coop_name;
        },
        formatter55(row, column) {
            return row.coop_ename;
        },
        formatter66(row, column) {
            return row.social_credit_code;
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
