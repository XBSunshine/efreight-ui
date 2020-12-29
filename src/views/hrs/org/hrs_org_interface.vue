<template>
	<el-dialog title="接口参数" width="850px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm"  ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="showsave">新增</el-button>
				</el-form-item>
			</el-row>
		</el-form>
    <el-row>
      <el-table ref="multipleTable" :data="address.data" height="300" style="width: 100%" row-key="addr_id" border>
        <el-table-column fixed="left" label="操作" width="60" align="center">
          <template slot-scope="scope">
            <el-button @click="showedit(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="apiType" label="接口类型" width="200px":formatter="settlementTypeFormat"></el-table-column>
        <el-table-column align="left" prop="apiRemark" label="备注" width="300px"></el-table-column>
        <el-table-column align="center" label="是否生效"  width="80px">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.enable"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="" ></el-table-column>
      </el-table>
    </el-row>
    <page-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="childRow"></page-save>
    <page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="childRow"></page-edit>
	</el-dialog>
</template>
<script>
  import save from './hrs_org_interface_save'
  import edit from './hrs_org_interface_edit'

  export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object,

		},
		data() {
			return {
			  childRow: Object,
				ruleForm: {
					orgCode: '',
					orgId: '',
					orgName: '',
					shortName: '',
					orgEname: '',
					shortEname: '',
					socialCreditCode: '',
					orgLogo: '',
					shortLogo: '',
					chBillTemplate: '',
					enBillTemplate: '',
					chListTemplate: '',
					enListTemplate: '',
					adminId: '',
					adminName: '',
					adminEmail: '',
					adminTel: '',
					rcEmail: '',
					orgStatus: true,
					stopDate: '',
					orgSeal: '',
					oneStopCode: '',
					orgType: '1',
					orgEditionId: '',
					orgUserCount: '',
					coopId: ''
				},
        orgId: '',
        address: {
          data: [],
        },
        apiTypeList: [],
        apiTypeMap: {},
        saveVisible : false,
        editVisible : false,
			};
		},
    provide() {
      return {
        queryList: this.queryList
      }
    },
    mounted: function() {
			let that = this;
			this.orgId = this.frow.orgId;
			//this.ruleForm.orgId = this.frow.orgId;
      let params = {
        orgId: this.orgId
      };
      this.$axios.get2("/hrs/org/listCategory/签约公司接口").then(function(response){
        let data = response.data;
        if(0 == data.code){
          this.apiTypeList = data['data'];
          for(let index in this.apiTypeList){
            let data = this.apiTypeList[index];
            this.apiTypeMap[data['edicode1']] = data['paramText'];
            //加载数据
            this.$axios.post('/hrs/org/queryInterfaceList', params).then((response) => {
              this.address.data = response.data.data;
            }).catch(err => {
            });
          }
        }else{
          this.openError(data.messageInfo || "接口类型加载失败!")
        }
      }.bind(this)).catch(function(error){
        console.error(error);
        this.openError("接口类型加载失败!")
      });


			this.$axios.get('/hrs/org/' + this.orgId).then(function(response) {
				that.ruleForm = response.data.data;
				that.ruleForm.orgStatus = that.ruleForm.orgStatus + '';
			}).catch(function(error) {
				console.error(error);
			});
		},

    components: {
      'page-save': save,
      'page-edit': edit,
    },

		methods: {
      showeditaddress(row) {
        // let coop_code = row.coop_code;
        this.address.params.addr_id = row.addr_id;
        this.address.params.coop_id = row.coop_id;
        this.address.params.addr_type = row.addr_type;
        this.address.params.short_name = row.short_name;
        this.address.params.full_address = row.full_address;
        this.address.params.addr_status = row.addr_status + '';
      },
      settlementTypeFormat(row) {
        let apiType = row['apiType'];
        return this.apiTypeMap[apiType] || apiType;
      },

      showsave() {
        this.saveVisible = true;
        this.childRow['apiTypeList'] = this.apiTypeList;
        this.childRow['orgId'] = this.frow['orgId'];
      },

      queryList(){
        let that = this;
        //this.orgId = this.frow.orgId;
        //alert(this.orgId);
        let params = {
          orgId: this.orgId
        }
        this.$axios.post('/hrs/org/queryInterfaceList', params).then((response) => {
          this.address.data = response.data.data;
        }).catch(err => {
          // console.log(err)
        })
      },

      showedit(row) {
        this.childRow = row;
        this.childRow['apiTypeList'] = this.apiTypeList;
        this.editVisible = true;
      },


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
				// var filelists = [];
				this.$message.success('上传成功')
				this.ruleForm.orgLogo = "http://doc.yctop.com/" + response.key;
				// fileList.forEach( (elem)=> {
				//   var item = {
				//     name: elem.name,
				//     url: this.ruleForm.orgLogo
				//   }
				//   filelists.push(item);
				// })
				// this.formData.smallModelPhoto = filelists;
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
				this.uptoken.key = +"ListTemplate_ch_" + new Date().getTime() + "_" + file.name;
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
			selectGet(val) {
				let obj = {};
				obj = this.options.find((item) => {
					return item.value === val;
				});
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
				// this.$refs.upload.submit();
				// this.$refs.upload2.submit();
				// this.$refs.upload3.submit();
				// this.$refs.upload4.submit();
				// this.$refs.upload5.submit();
				// this.$refs.upload6.submit();
				this.$refs[formName].validate((valid) => {
					if(valid) {
						// alert('submit!');
						let params = JSON.stringify(this.ruleForm);

						this.$axios.put('/hrs/org',
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
						console.error('error submit!!');
						return false;
					}
				});

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			handleClick(tab, event) {
			},
			resetPassward() {
				this.$confirm('你确定要重置密码么, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/hrs/org/resetPassward/' + this.user.data.userId).then((response) => {
						if(response.status = '200') {
							this.$notify({
								title: '成功',
								message: '重置成功,请查看您的邮件',
								type: 'success'
							});
						} else {
							this.$notify({
								title: '失败',
								message: '重置失败,原因：' + response.data.data.messageInfo,
								type: 'error'
							});
						}
					}).catch((error) => {
						this.$notify.error({
							title: '错误',
							message: error.response.data.message
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
		}
	}
</script>
<style scoped>
	.el-form-item__content3 {
		line-height: 8px !important;
		position: relative;
		font-size: 14px;
	}
</style>
