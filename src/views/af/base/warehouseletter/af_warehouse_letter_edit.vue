<template>
	<el-dialog title="货站托书 - 编辑" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="afWarehouseLetterEdit">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="apCode" label-width="15px">
            <el-input class="" v-model="ruleForm.apCode" clearable style="width:200px;margin-right: 15px;" auto-complete="off" @input="ruleForm.apCode = ruleForm.apCode.toUpperCase()" maxlength="4">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>机场代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="shipperTemplateName" label-width="15px">
            <el-input class="" v-model="ruleForm.shipperTemplateName" clearable style="width:600px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>托书名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="isValid">
            <el-input style="width:183px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>是否有效</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.isValid" placeholder="请选择" style="width:104px;margin-right: -5px;" clearable>
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
				<el-col class="elementWidth">
					<el-form-item label="托书模板 (PDF)" prop="shipperTemplateFile" label-width="138px" class="shipperTemplateFileColor">
						<el-input v-model="ruleForm.shipperTemplateFile" auto-complete="off" v-if="false">
						</el-input>
						<el-upload v-if="ruleForm.shipperTemplateFile==null||ruleForm.shipperTemplateFile==''" :action="actionPath" :accept="accept" :limit=1 :data="uptoken" :before-upload="beforeAvatarUpload" :on-remove="handleRemoveChange" :on-success="handleSuccessChange" ref="upload" :auto-upload="true" :show-file-list="true">
							<el-button size="mini" type="primary">上传托书模板</el-button>
						</el-upload>
						<ul class="el-upload-list el-upload-list--text" v-if="ruleForm.shipperTemplateFile!=null &&ruleForm.shipperTemplateFile!=''">
							<li class="el-upload-list__item is-success">
								<a class="el-upload-list__item-name">
									<i class="el-icon-document"></i> {{ruleForm.showName}}
								</a>
								<label class="el-upload-list__item-status-label">
                                    <i class="el-icon-upload-success el-icon-circle-check"></i>
                                </label>
								<i class="el-icon-close" @click="handleRemoveChange"></i>
							</li>
						</ul>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="托书模板 (EXCEL)" prop="shipperTemplateFileExcel" label-width="400px" class="shipperTemplateFileColor">
            <el-input v-model="ruleForm.shipperTemplateFileExcel" auto-complete="off" v-if="false">
            </el-input>
            <el-upload v-if="ruleForm.shipperTemplateFileExcel==null||ruleForm.shipperTemplateFileExcel==''" :action="actionPath" :accept="acceptExcel" :limit=1 :data="uptoken" :before-upload="beforeAvatarUploadExcel" :on-remove="handleRemoveChangeExcel" :on-success="handleSuccessChangeExcel" ref="upload" :auto-upload="true" :show-file-list="true">
              <el-button size="mini" type="primary">上传托书模板</el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.shipperTemplateFileExcel!=null &&ruleForm.shipperTemplateFileExcel!=''">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name">
                  <i class="el-icon-document"></i> {{ruleForm.showNameExcel}}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
                <i class="el-icon-close" @click="handleRemoveChangeExcel"></i>
              </li>
            </ul>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-table :data="airlineShipperLetterData">
          <el-table-column width="40" align="center">
            <template slot="header" slot-scope="scope" >
              <i class="iconfont el-icon-myyuanquanjiahao" @click="addTemplate" style="cursor: pointer;size: b5;color: #409EFF;"></i>
            </template>
            <template slot-scope="scope">
              <i class="iconfont el-icon-myjianhao" @click="deleteTemplate(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
            </template>
          </el-table-column>
          <el-table-column align="center" label="航司三字码" width="100px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.carrierPrefix"   maxlength="3"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="PDF模板" width="350px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.templateFilePdf" disabled maxlength="12" style="width: 250px"></el-input>
              <el-button type="primary" @click="removePdf(scope.$index,scope.row)" size="mini" style="background-color:#FFF;color:#409EFF">清空</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上传按钮" width="120px">
            <template slot-scope="scope">
              <el-upload :action="actionPath"
                         :accept="accept"
                         :limit=1
                         :data="uptoken"
                         :before-upload="beforeUploadPdf"
                         :on-success="handleSuccessUploadPdf"
                         ref="upload"
                         :show-file-list="false"
                         :auto-upload="true" >
                <el-button size="mini" type="primary" @click="updateTemplate(scope.$index)">上传PDF模板</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column align="center" label="EXCEL模板" width="350px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.templateFileExcel" disabled maxlength="12" style="width: 250px"></el-input>
              <el-button type="primary" @click="removeExcel(scope.$index,scope.row)" size="mini" style="background-color:#FFF;color:#409EFF">清空</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上传按钮" width="110px">
            <template slot-scope="scope">
              <el-upload :action="actionPath"
                         :accept="acceptExcel"
                         :limit=1
                         :data="uptoken"
                         :before-upload="beforeUpload"
                         :on-success="handleSuccessUpload"
                         ref="upload"
                         :show-file-list="false"
                         :auto-upload="true" >
                <el-button size="mini" type="primary" @click="updateTemplate(scope.$index)">上传EXCEL模板</el-button>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row >
				<el-form-item label-width="15px">
					<el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" size="small">修改</el-button>
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
				actionPath: 'http://up-z1.qiniu.com',
				accept: ".pdf",
        acceptExcel: ".xlsx",
				uptoken: {
					token: '',
					key: ""
				},
				loading: false,
				routingGroupNames: [],
				routingNames: [],
				ruleForm: {
					warehouseLetterId: '',
					apCode: '',
					shipperTemplateFile: '',
					shipperTemplateName: '',
          shipperTemplateFileExcel: '',
          shipperTemplateNameExcel: '',
					showName: '',
          showNameExcel: '',
					isValid: ''
				},
				rules: {
					apCode: [{
						required: true,
						message: '请输入机场代码',
						trigger: ['blur', 'change']
					}],
					shipperTemplateFile: [{
						required: true,
						message: '请选择托书模板',
						trigger: ['blur', 'change']
					}],
					shipperTemplateName: [{
						required: true,
						message: '请输入托书名称',
						trigger: ['blur', 'change']
					}],
					isValid: [{
						required: true,
						message: '请选择是否有效',
						trigger: ['blur', 'change']
					}]
				},
        airlineShipperLetterData: [],
        //当前操作的行index
        currentRowIndex: -1,
			}
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.uptoken.token = response.data.data;
				}.bind(this));
		},
		inject: ['queryList'],
		methods: {
			beforeAvatarUpload(file) {
				this.uptoken.key = window.localStorage.getItem("orgCode") + '_' + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if(!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if(isLt10M) {
					this.ruleForm.shipperTemplateFile = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange(file, fileList) {
				var filelists = [];
				this.ruleForm.showName = '';
				this.ruleForm.shipperTemplateFile = '';
			},
			handleSuccessChange(response, file, fileList) { //上传成功后在图片框显示图片
				this.ruleForm.shipperTemplateFile = "http://doc.yctop.com/" + response.key;
				this.ruleForm.showName = file.name;
			},
      beforeAvatarUploadExcel(file) {
          this.uptoken.key = window.localStorage.getItem("orgCode") + '_' + new Date().getTime() + "_" + file.name;
          const isLt10M = file.size < 10 * 1024 * 1024;
          if(!isLt10M) {
              this.$message.error('上传模板大小不能超过 10MB!');
          }
          if(isLt10M) {
              this.ruleForm.shipperTemplateFileExcel = "http://doc.yctop.com/" + this.uptoken.key
          }
          return isLt10M;
      },
      handleRemoveChangeExcel(file, fileList) {
          var filelists = [];
          this.ruleForm.showNameExcel = '';
          this.ruleForm.shipperTemplateFileExcel = '';
          this.ruleForm.shipperTemplateNameExcel = '';
      },
      handleSuccessChangeExcel(response, file, fileList) { //上传成功后在图片框显示图片
          this.ruleForm.shipperTemplateFileExcel = "http://doc.yctop.com/" + response.key;
          this.ruleForm.shipperTemplateNameExcel = file.name;
          this.ruleForm.showNameExcel = file.name;
      },
			handleClose() {
				this.$emit("update:visible", false);
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
			submitForm(formName) {
        this.ruleForm.warehouseLetterAttachFiles = this.getNotNullArr(this.airlineShipperLetterData);
        if(!this.checkAirlineShipperLetterData(this.ruleForm.warehouseLetterAttachFiles) && this.airlineShipperLetterData.length != 0){
          this.openError("航司三字码不能为空或PDF和EXCEL模板地址不能同时为空");
          return;
        }
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2('/afbase/warehouseLetter/doUpdate', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList();
									this.handleClose();
								} else {
									this.loading = false;
									this.openError(response.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								this.loading = false;
								let errorinfo = error.response.data.messageInfo;
								if(errorinfo.indexOf('IDU_shipper_template_name') > -1) {
									this.openError('托书名称不可重复');
                } else if(errorinfo.indexOf('af_warehouse_letter_attach_file.SY.00') > -1) {
                  this.openError('航司代码不可重复')
                }else {
									this.openError(errorinfo);
								}
							}.bind(this));
					} else {
						return false;
					}
				});
			},
      loadData(warehouseLetterId ){
			  this.$axios.get("/afbase/warehouseLetter/detail/"+warehouseLetterId).then(function(response){
			    if(response.data.code == 0){
			      for(let key in this.ruleForm){
			        this.ruleForm[key] = (response.data.data[key] || '');
            }
			      this.airlineShipperLetterData = response.data.data.warehouseLetterAttachFiles;
          }
        }.bind(this))
      },
      addTemplate(){
        let item = {
          carrierPrefix: '',
          templateFileExcel: '',
          templateFilePdf: '',
        }
        this.airlineShipperLetterData.push(item);
      },
      deleteTemplate(rowIndex, row){
        this.airlineShipperLetterData.splice(rowIndex, 1);
      },
      updateTemplate(rowIndex){
        this.currentRowIndex = rowIndex;
      },
      beforeUpload(file){
        this.uptoken.key = window.localStorage.getItem("orgCode") + '_warehouse_letter_' + new Date().getTime() + "_" + file.name;
        const isLt10M = file.size < 10 * 1024 * 1024;
        if(!isLt10M) {
          this.$message.error('上传模板大小不能超过 10MB!');
        }
        return isLt10M;
      },
      beforeUploadPdf(file){
          this.uptoken.key = window.localStorage.getItem("orgCode") + '_warehouse_letter_' + new Date().getTime() + "_" + file.name;
          const isLt10M = file.size < 10 * 1024 * 1024;
          if(!isLt10M) {
              this.$message.error('上传模板大小不能超过 10MB!');
          }
          return isLt10M;
      },
      handleSuccessUpload(response, file, fileList){
        this.airlineShipperLetterData[this.currentRowIndex]['templateFileExcel'] = "http://doc.yctop.com/" + response.key;
        this.airlineShipperLetterData[this.currentRowIndex]['templateNameExcel'] = file.name;
      },
      handleSuccessUploadPdf(response, file, fileList){
          this.airlineShipperLetterData[this.currentRowIndex]['templateFilePdf'] = "http://doc.yctop.com/" + response.key;
          this.airlineShipperLetterData[this.currentRowIndex]['templateNamePdf'] = file.name;
      },
      getNotNullArr(arr){
        let resultArray = [];
        for(let i=0; i<arr.length; i++){
          let item = arr[i];
          if((item.carrierPrefix).length != 0 || item.templateFileExcel.length != 0 || item.templateFilePdf.length != 0){
            resultArray.push(item);
          }
        }
        return resultArray;
      },
      checkAirlineShipperLetterData(arr) {
          if(arr.length == 0){
              return false;
          }else{
              for(let i = 0; i < arr.length; i++){
                  if(arr[i].carrierPrefix.length == 0 || (arr[i].templateFileExcel.length == 0 && arr[i].templateFilePdf.length == 0)){
                      return false;
                  }
              }
          }
          return true;
      },
      removeExcel(rowIndex, row){

          this.airlineShipperLetterData[rowIndex].templateFileExcel = "";
          this.airlineShipperLetterData[rowIndex].templateNameExcel = "";
      },
      removePdf(rowIndex, row){
          this.airlineShipperLetterData[rowIndex].templateFilePdf = "";
          this.airlineShipperLetterData[rowIndex].templateNamePdf = "";
      },
		},
		created() {
		  this.loadData(this.frow.warehouseLetterId);
		}
	}
</script>
<style type="text/css">

  .afWarehouseLetterEdit .el-input__icon {
    line-height: 30px !important;
  }

  .afWarehouseLetterEdit .el-form-item__content {
    line-height: 30px !important;
  }

  .afWarehouseLetterEdit .el-input-group__prepend {
    padding: 0 6px;
  }

  .afWarehouseLetterEdit .shipperTemplateFileColor .el-form-item__label {
    color: #909399;
  }

</style>
