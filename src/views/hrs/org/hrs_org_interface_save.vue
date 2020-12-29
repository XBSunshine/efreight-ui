<template>
	<el-dialog title="接口 - 新增" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="接口类型" prop="apiType" label-width="100px">
						<el-select v-model="ruleForm.apiType" filterable placeholder="请选择" @change="selectGet" style="width: 240px;">
              <el-option v-for="item in this.apiTypeList" :key="item.edicode1"  :label="item.paramText" :value="item.edicode1"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label="是否生效" prop="enable" label-width="80px">
            <el-select v-model="ruleForm.enable" filterable placeholder="请选择" @change="selectGet" style="width: 140px;">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="备注" prop="apiRemark" label-width="100px">
            <el-input style="width: 460px" v-model="ruleForm.apiRemark" type="textarea"
                      :autosize="{ minRows: 1, maxRows: 2}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="App ID" prop="appid" label-width="100px">
						<el-input v-model="ruleForm.appid" auto-complete="off" style="width: 460px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="Auth Token" prop="authToken" label-width="100px">
            <el-input v-model="ruleForm.authToken" auto-complete="off" style="width: 460px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="Platform" prop="platform" label-width="100px">
            <el-input v-model="ruleForm.platform" auto-complete="off" style="width: 460px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="Function" prop="function" label-width="100px">
            <el-input v-model="ruleForm.function" auto-complete="off" style="width: 460px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="Url Auth" prop="urlAuth" label-width="100px">
            <el-input v-model="ruleForm.urlAuth" auto-complete="off" style="width: 460px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="Url Post" prop="urlPost" label-width="100px">
            <el-input v-model="ruleForm.urlPost" auto-complete="off" style="width: 460px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
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
				ruleForm: {
          apiType: '',
          enable: '1',
          apiRemark: '',
          appid: '',
          authToken: '',
          platform: '',
          function: '',
          urlAuth: '',
          urlPost: '',
          orgId : '',
				},
        apiTypeList: [],
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
					}
				},
				actionPath: 'http://up-z1.qiniu.com',
				accept: "image/jpeg,image/gif,image/png,image/bmp",
				formData: {
					smallModelPhoto: [],
				},
				uptoken: {
					token: '',
					key: ""
				},
				formData2: {
					smallModelPhoto: [],
				},
				accept3: ".xls,.xlsx,.pdf",
				formData3: {
					smallModelPhoto: [],
				},
				formData4: {
					smallModelPhoto: [],
				},
				formData5: {
					smallModelPhoto: [],
				},
				formData6: {
					smallModelPhoto: [],
				},
				options: [],
				orgEditions: [],
				orgSealUploadFileList: [],
				attachment: false,
				rules: {
					stopDate: [{
						required: true,
						message: '请选择失效时间',
						trigger: ['blur', 'change']
					}],
					orgName: [{
							required: true,
							message: '请选择客商资料',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					orgType: [{
							required: true,
							message: '请选择版本类型',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					orgUserCount: [{
							required: true,
							message: '请输入用户数量',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					coopId: [{
							required: true,
							message: '请选择客商资料',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					shortName: [{
							required: true,
							message: '请输入中文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					orgEname: [{
							required: true,
							message: '请输入英文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					shortEname: [{
							required: true,
							message: '请输入英文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					socialCreditCode: [{
							required: true,
							message: '请输入社会信用代码',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],

					adminName: [{
							required: true,
							message: '请输入签约客户管理员账户',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 20,
							message: '不可超过 20',
							trigger: ['blur', 'change']
						}
					],
					adminEmail: [{
							required: true,
							message: '请输入签约公司管理邮箱',
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					adminTel: [{
							required: true,
							message: '请输入签约公司管理员电话',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					rcEmail: [{
							required: true,
							message: '请输入签约公司风控邮箱',
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					]
				}
			};
		},
		inject: ['queryList'],
		created() {
		  console.log(this.frow);
		  this.apiTypeList = this.frow['apiTypeList'];
		  this.ruleForm.orgId = this.frow['orgId'];
		},

		methods: {
			changeOrgEditionId(val) {
				if(this.orgEditions != null && this.orgEditions.length > 0) {
					this.ruleForm.orgUserCount = this.orgEditions.find(org => org.orgId == val).orgUserCount
				}
			},
			//大logo
			beforeAvatarUpload(file) {
				this.uptoken.key = "OrgLogo_" + new Date().getTime() + "_" + file.name;
				let _this = this
				const isSize = new Promise(function(resolve, reject) {
					let width = 400;
					let height = 100;
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = function() {
						let valid = img.width === width && img.height === height;
						valid ? resolve() : reject();
					}
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					_this.$message.error('大Logo尺寸限制为400 x 100')
					return Promise.reject();
				});
				return isSize;
			},
			handleRemoveChange(file, fileList) {
				var filelists = [];
				this.ruleForm.orgLogo = '';
				this.formData.smallModelPhoto = filelists;
			},
			handleSuccessChange(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.orgLogo = "http://doc.yctop.com/" + response.key;
			},
			//小logo
			beforeAvatarUpload2(file) {
				this.uptoken.key = "OrgShortLogo_" + new Date().getTime() + "_" + file.name;
				let _this = this
				const isSize = new Promise(function(resolve, reject) {
					let width = 100;
					let height = 100;
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = function() {
						let valid = img.width === width && img.height === height;
						valid ? resolve() : reject();
					}
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					_this.$message.error('小Logo尺寸限制为100 x 100')
					return Promise.reject();
				});
				return isSize;
			},
			handleRemoveChange2(file, fileList) {
				var filelists = [];
				this.ruleForm.shortLogo = '';
				this.formData2.smallModelPhoto = filelists;
			},
			handleSuccessChange2(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.shortLogo = "http://doc.yctop.com/" + response.key;
			},
			//
			//chBillTemplate
			beforeAvatarUpload3(file) {
				this.uptoken.key = "BillTemplate_ch_" + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if(!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if(isLt10M) {
					this.ruleForm.chBillTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange3(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplate = '';
				this.formData3.smallModelPhoto = filelists;
			},
			handleSuccessChange3(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplate = "http://doc.yctop.com/" + response.key;
			},
			//
			//enBillTemplate
			beforeAvatarUpload4(file) {
				this.uptoken.key = "BillTemplate_en_" + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if(!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if(isLt10M) {
					this.ruleForm.enBillTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange4(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplate
				this.formData4.smallModelPhoto = filelists;
			},
			handleSuccessChange4(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplate = "http://doc.yctop.com/" + response.key;
			},
			//
			//chListTemplate
			beforeAvatarUpload5(file) {
				this.uptoken.key = "ListTemplate_ch_" + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if(!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if(isLt10M) {
					this.ruleForm.chListTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange5(file, fileList) {
				var filelists = [];
				this.ruleForm.chListTemplate = '';
				this.formData4.smallModelPhoto = filelists;
			},
			handleSuccessChange5(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chListTemplate = "http://doc.yctop.com/" + response.key;
			},
			//
			//enListTemplate
			beforeAvatarUpload6(file) {
				this.uptoken.key = "ListTemplate_en_" + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if(!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if(isLt10M) {
					this.ruleForm.enListTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange6(file, fileList) {
				var filelists = [];
				this.ruleForm.enListTemplate = '';

				this.formData4.smallModelPhoto = filelists;
			},
			handleSuccessChange6(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enListTemplate = "http://doc.yctop.com/" + response.key;
			},
			//
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
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let params = JSON.stringify(this.ruleForm);
						this.$axios.post2('/hrs/org/saveInterface',
								params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList();
									this.handleClose();
								} else {
									this.openError(response.data.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								//唯一性错误
								if(errorinfo.indexOf('Duplicate entry') > -1) {
									if(errorinfo.indexOf('IDU_hrs_org_org_code') > -1)
										this.openError('企业编码不可重复');
									else if(errorinfo.indexOf('IDU_hrs_org_org_name') > -1)
										this.openError('签约客户名称不可重复');
									else if(errorinfo.indexOf('IDU_hrs_org_short_name') > -1)
										this.openError('签约客户简称不可重复');
									else if(errorinfo.indexOf('IDU_hrs_org_org_ename') > -1)
										this.openError('签约客户英文名称不可重复');
									else if(errorinfo.indexOf('IDU_hrs_org_short_ename') > -1)
										this.openError('签约客户英文简称不可重复');
									else if(errorinfo.indexOf('IDU_hrs_org_social_creodeE6D8') > -1)
										this.openError('统一社会信用代码不可重复');
								} else {
									this.openError(errorinfo);
								}
							}.bind(this));

					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			selectGet(val) {
				let obj = {};
				obj = this.options.find((item) => {
					return item.value === val;
				});
				console.log(obj);
				this.ruleForm.socialCreditCode = obj.social_credit_code;
				this.ruleForm.orgName = obj.label;
				this.ruleForm.orgEname = obj.coop_ename;
				this.ruleForm.shortName = obj.short_name;
				this.ruleForm.shortEname = obj.short_ename;
				this.ruleForm.adminTel = obj.phone_number;
				this.ruleForm.coopId = obj.value;
				this.ruleForm.orgCode = obj.coop_code;
			},
			handleOrgSealUploadBefore(file) {
				//				if(this.ruleForm.orgCode == '' || this.ruleForm.orgCode == null) {
				//					this.openError("请填写企业编码后再上传印章")
				//					return false
				//				} else if(this.ruleForm.orgCode.length != 6) {
				//					this.openError("请正确填写企业编码后再上传印章")
				//					return false
				//				}

				if(file.type != 'image/png') {
					this.openError("上传印章格式为PNG")
					return false
				}
				this.uptoken.key = "OrgSeal_" + new Date().getTime() + "_" + file.name;
				let _this = this
				const isSize = new Promise(function(resolve, reject) {
					let width = 300;
					let height = 300;
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = function() {
						let valid = img.width === width && img.height === height;
						valid ? resolve() : reject();
					}
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					this.openError('印章尺寸限制为300 x 300')
					return Promise.reject();
				});
				return isSize;
			},
			handleRemoveOrgSeal(file, fileList) {
				this.ruleForm.orgSeal = '';
				this.orgSealUploadFileList = [];
			},
			handleSuccessOrgSeal(response, file, fileList) {
				this.$message.success('上传成功')
				this.ruleForm.orgSeal = "http://doc.yctop.com/" + response.key;
			},
			clickorgLogo() {
				if(this.ruleForm.orgLogo != null && this.ruleForm.orgLogo !== '') {
					this.$message.error('只能上传一个文件')
				}
			},
			clickshortLogo() {
				if(this.ruleForm.shortLogo != null && this.ruleForm.shortLogo !== '') {
					this.$message.error('只能上传一个文件')
				}
			},
			clickorgSeal() {
				if(this.ruleForm.orgSeal != null && this.ruleForm.orgSeal !== '') {
					this.$message.error('只能上传一个文件')
				}
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
		},
	}
</script>
<style scoped>
	.el-form-item__content3 {
		line-height: 8px !important;
		position: relative;
		font-size: 14px;
	}
</style>
