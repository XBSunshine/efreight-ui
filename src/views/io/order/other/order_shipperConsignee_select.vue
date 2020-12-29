<template>
	<el-dialog :title="'其他业务订单 - '+name" width="1150px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body style="top:-80px;">
		<div class="shipperConsigneeSelectPage">
			<el-container style="height: 520px;">
				<el-aside width="565px">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="30px">
						<el-row>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFive" v-model="ruleForm.scName" auto-complete="off" maxlength="100" style="width:500px;" @change="ruleForm.scName=strTrim(ruleForm.scName).toUpperCase()">
										<template slot="prepend">{{name}}名称</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFive" v-model="ruleForm.scAddress" auto-complete="off" maxlength="150" style="width:500px;" @change="ruleForm.scAddress=strTrim(ruleForm.scAddress).toUpperCase()">
										<template slot="prepend">{{name}}地址</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFive" style="width:300px;" auto-complete="off">
										<template slot="prepend">
											<span>{{name}}代码</span>
										</template>
										<el-select slot="suffix" v-model="ruleForm.scCodeType" filterable placeholder="" style="width: 203px;margin-right: -5px;">
											<el-option v-for="(scCodeType,index) in scCodeTypes" :key="index" :label="scCodeType.paramText" :value="scCodeType.edicode1"></el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="0px">
									<el-input v-model="ruleForm.scCode" auto-complete="off" maxlength="50" style="width: 200px;" @change="ruleForm.scCode=strTrim(ruleForm.scCode).toUpperCase()">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item prop="aeoCode">
									<el-input class="widthWithAEOCode" v-model="ruleForm.aeoCode" @input="ruleForm.aeoCode = ruleForm.aeoCode.toUpperCase().trim()" auto-complete="off" style="width:500px;">
										<template slot="prepend">AEO编码</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item prop="nationCode">
									<el-input v-model="ruleForm.nationCode" @input="ruleForm.nationCode = ruleForm.nationCode.toUpperCase().trim()" auto-complete="off" style="width:240px;" @change="searchNationalName">
										<template slot="prepend">国家代码</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="20px">
									<el-input class="widthWithTwo" v-model="ruleForm.stateCode" maxlength="10" auto-complete="off" style="width:240px;" @change="ruleForm.stateCode=strTrim(ruleForm.stateCode).toUpperCase()">
										<template slot="prepend">省份</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input v-model="ruleForm.cityCode" @input="ruleForm.cityCode = ruleForm.cityCode.toUpperCase().trim()" maxlength="30" auto-complete="off" style="width:240px;" @change="searchCityName">
										<template slot="prepend">城市代码</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="20px">
									<el-input class="widthWithTwo" v-model="ruleForm.postCode" maxlength="20" auto-complete="off" style="width:240px;" @input="ruleForm.postCode = ruleForm.postCode.toUpperCase().trim()">
										<template slot="prepend">邮编</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithTwo" v-model="ruleForm.telNumber" maxlength="30" auto-complete="off" style="width:240px;" @input="ruleForm.telNumber = ruleForm.telNumber.toUpperCase().trim()">
										<template slot="prepend">电话</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="20px">
									<el-input class="widthWithTwo" v-model="ruleForm.faxNumber" maxlength="30" auto-complete="off" style="width:240px;" @input="ruleForm.faxNumber = ruleForm.faxNumber.toUpperCase().trim()">
										<template slot="prepend">传真</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-button type="text" style="margin-left: 50px;margin-top: -10px;" disabled>Print</el-button>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item label-width="30px">
									<el-input :rows="4" type="textarea" v-model="ruleForm.scPrintRemark" style="width: 500px;height: 120px;border: 1px solid #DCDFE6;" @change="ruleForm.scPrintRemark=strTrim(ruleForm.scPrintRemark).toUpperCase()">
									</el-input>
								</el-form-item>
								<el-button style="float:left;position: relative;left:385px;top:-40px;padding: 5px 15px;" round @click="emptyInputMany">清空</el-button>
								<el-button style="float:left;position: relative;left:380px;top:-40px;padding: 5px 15px;" round @click="synchronization">同步</el-button>
							</el-col>
						</el-row>
						<el-row>
							<el-form-item style="margin-left: 15px;margin-top: -25px;float:left">
								<el-button :loading="loading" size="small" type="primary" @click="doClean" plain style="background: #FFFFFF;color: #409EFF;">清空</el-button>
								<el-button :loading="loading" size="small" type="primary" @click="submitForm('ruleForm')" plain style="background: #FFFFFF;color: #409EFF;">保存到列表</el-button>
								<el-button :loading="loading" size="small" type="primary" @click="doFinish">完成</el-button>
							</el-form-item>
						</el-row>
					</el-form>
				</el-aside>
				<el-container style="height: 510px; border-left: 1px solid #eee">
					<el-main>
						<el-form :inline="false" :model="query" label-width="80px" class="demo-ruleForm" style="margin-top:-19px">
							<el-row>
								<el-col class="elementWidth">
									<el-form-item label="">
										<el-input v-model="query.scName" clearable auto-complete="off" style="width:200px;">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col class="elementWidth">
									<el-form-item label-width="20px">
										<el-button type="primary" size="small" style="padding: 7px 5px;" icon="el-icon-search" @click="queryList">搜索</el-button>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
						<el-table :data="data" :show-header="false" height="410px" @cell-click="doSelect">
							<el-table-column label="名称">
								<template slot-scope="scope">
									<i class="el-icon-s-custom" style="color: #66b1ff;" v-on:click="doSelect(scope.row)"></i>
									<el-button type="text" size="small" v-on:click="doSelect(scope.row)">{{scope.row.scName}}</el-button>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="60">
								<template slot-scope="scope">
									<el-button type="text" size="small" v-on:click="doCancel(scope.row)">作废</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div style="margin-left: 5px;margin-top:3px">
							<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, prev, pager, next" :total="pageConf.totalPage">
							</el-pagination>
						</div>
					</el-main>
				</el-container>
			</el-container>
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
				data: [],
				name: '',
				options: [],
				options2: [],
				scCodeTypes: [],
				cityNameEn: '',
				nationNameEn: '',
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10]
				},
				query: {
					isValid: true,
					scType: '',
					scMnemonic: '',
					scName: ''
				},
				ruleForm: {
					scId: '',
					isValid: true,
					scMnemonic: '',
					scType: '',
					scName: '',
					scAddress: '',
					scCodeType: '',
					scCode: '',
					aeoCode: '',
					nationCode: '',
					stateCode: '',
					cityName: '',
					postCode: '',
					telNumber: '',
					faxNumber: '',
					scPrintRemark: ''
				},
				rules: {
					nationCode: [{
						min: 2,
						message: '请输入两位字符',
						trigger: ['blur', 'change']
					}, {
						max: 2,
						message: '请输入两位字符',
						trigger: ['blur', 'change']
					}],
					aeoCode: [{
						min: 0,
						max: 50,
						message: 'AEO编码长度不超过 50',
						trigger: ['blur', 'change']
					}]
				},
				ffrow: {},

			}
		},
		inject: ['shipperConsigneeCallback'],
		created: function() {
			this.$axios.get2('/afbase/category/params', {
				categoryName: "收发货人代码"
			}).then((response) => {
				this.scCodeTypes = response.data.data;
			}).catch((error) => {
				console.log(error);
			})
			if (this.frow.scType == 'shipper') {
				this.query.scType = 0
				this.name = "发货人"
			} else if (this.frow.scType == 'consignee') {
				this.query.scType = 1
				this.name = "收货人"
			}
			var a = JSON.stringify(this.frow.shipperConsignee);
			this.ruleForm = JSON.parse(a);
			if (this.frow.scType == 'shipper') {
				this.ruleForm.scType = 0
			} else if (this.frow.scType == 'consignee') {
				this.ruleForm.scType = 1
			}
			this.ruleForm.isValid = true;
			this.searchCityName();
			this.searchNationalName();
			this.queryList();
		},

		methods: {
			searchCityName() {
				if (this.ruleForm.cityCode) {
					this.$axios.get2('/afbase/shipperConsignee/searchCityName', {
						cityCode: this.ruleForm.cityCode
					}).then(function(response) {
						this.cityNameEn = response.data.data;
					}.bind(this)).catch(function(error) {
						console.log(error);
					})
				} else {
					this.cityNameEn = ''
				}
			},
			searchNationalName() {
				if (this.ruleForm.nationCode) {
					this.$axios.get2('/afbase/shipperConsignee/searchNationalName', {
						nationCode: this.ruleForm.nationCode
					}).then(function(response) {
						this.nationNameEn = response.data.data;
					}.bind(this)).catch(function(error) {
						console.log(error);
					})
				} else {
					this.nationNameEn = ''
				}
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
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
				this.ruleForm.scName = this.ruleForm.scName.trim();
				this.ruleForm.scPrintRemark = this.ruleForm.scPrintRemark.trim();
				if (!this.ruleForm.scName) {
					this.openError("请输入" + this.name + "名称");
					return;
				}
				if (!this.ruleForm.scPrintRemark) {
					this.openError("请输入Print");
					return;
				}
				if (this.ruleForm.scId) {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							this.loading = true
							this.$axios.put('/afbase/shipperConsignee', this.ruleForm)
								.then(function(response) {
									if (response.data.code == 0) {
										this.openSuccess("修改成功！");
										this.queryList();
									} else {
										this.openError(response.data.messageInfo);
									}
									this.loading = false
								}.bind(this)).catch(function(error) {
									this.loading = false
									let errorinfo = error.response.data.messageInfo;
									this.openError(errorinfo)
								}.bind(this));
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							this.loading = true
							this.$axios.post2('/afbase/shipperConsignee', this.ruleForm)
								.then(function(response) {
									if (response.data.code == 0) {
										this.openSuccess("保存成功！");
										this.queryList();
									} else {
										this.openError(response.data.messageInfo);
									}
									this.loading = false
								}.bind(this)).catch(function(error) {
									this.loading = false
									let errorinfo = error.response.data.messageInfo;
									this.openError(errorinfo)
								}.bind(this));
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				}

			},
			doSelect(rrow) {
				var a = JSON.stringify(rrow);
				this.ruleForm = JSON.parse(a);
				this.searchCityName();
				this.searchNationalName();
			},
			doFinish() {
				this.shipperConsigneeCallback(this.ruleForm);
				this.handleClose();
			},
			doClean() {
				this.ruleForm = {
					scId: '',
					isValid: true,
					scMnemonic: '',
					scType: '',
					scName: '',
					scAddress: '',
					scCodeType: '',
					scCode: '',
					aeoCode: '',
					nationCode: '',
					stateCode: '',
					cityName: '',
					postCode: '',
					telNumber: '',
					faxNumber: '',
					scPrintRemark: ''
				};
				this.ruleForm.scType = this.query.scType
				this.ruleForm.isValid = true;
				this.cityNameEn = '';
				this.nationNameEn = '';
			},
			emptyInputMany() {
				this.ruleForm.scPrintRemark = ''
			},
			showAddPage() {
				this.ffrow.scType = this.frow.scType;
				this.saveVisible = true;
			},
			queryList() {
				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&scMnemonic=" + this.query.scMnemonic + "&scName=" + this.query.scName + "&scType=" + this.query.scType + "&isValid=" + this.query.isValid;
				let that = this;
				this.$axios.get('/afbase/shipperConsignee/page?' + param).then(function(response) {
					that.data = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					if (that.data.length == 0) {
						let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
						that.queryList2(current);
					}
				}).catch(function(error) {
					console.log(error);
				});

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&scMnemonic=" + this.query.scMnemonic + "&scName=" + this.query.scName + "&scType=" + this.query.scType + "&isValid=" + this.query.isValid;
				let that = this;
				this.$axios.get('/afbase/shipperConsignee/page?' + param).then(function(response) {
					that.data = response.data.data.records
					that.pageConf.totalPage = response.data.data.total
				}).catch(function(error) {
					console.log(error);
				})
			},
			doCancel(row) {
				let scTypeName = ''
				if (row.scType == '0') {
					scTypeName = '该发货人'
				} else if (row.scType == '1') {
					scTypeName = '该收货人'
				}
				this.$confirm('您将作废' + scTypeName + ', 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/afbase/shipperConsignee/cancel/' + row.scId).then((response) => {
						if (response.data.code == '0') {
							this.openSuccess("作废成功！")
							this.queryList();
						} else {
							this.openError("作废失败：" + response.data.data.messageInfo)
						}
					}).catch((error) => {
						this.openError("作废失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {
					// this.$message({
					//     type: 'info',
					//     message: '已取消作废'
					// });
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
			synchronization() {
				let result = ''
				if (this.ruleForm.scName) {
					result += this.ruleForm.scName + '\n'
				}
				if (this.ruleForm.scAddress) {
					if (result == '') {
						result += this.ruleForm.scAddress + '\n'
					} else {
						result += this.ruleForm.scAddress + '\n'
					}
				}
				if (this.cityNameEn) {
					if (result == '') {
						result += this.cityNameEn + ','
					} else {
						result += this.cityNameEn + ','
					}
				}
				if (this.ruleForm.stateCode) {
					if (result == '') {
						result += this.ruleForm.stateCode + ','
					} else {
						result += this.ruleForm.stateCode + ','
					}
				}
				if (this.ruleForm.postCode) {
					if (result == '') {
						result += this.ruleForm.postCode + ','
					} else {
						result += this.ruleForm.postCode + ','
					}
				}
				if (this.nationNameEn) {
					if (result == '') {
						result += this.nationNameEn
					} else {
						result += this.nationNameEn
					}
				}
				if (result.substring(result.length - 1, result.length) == ',' || result.substring(result.length - 1, result.length) == '\n') {
					result = result.substring(0, result.length - 1);
				}

				let result1 = '',
					tel = (this.ruleForm.telNumber || ""),
					fax = (this.ruleForm.faxNumber || "");
				if (tel.trim().length > 0) {
					result1 += '\nTEL:' + tel.trim();
				}
				if (fax.trim().length > 0) {
					let str = 'FAX:' + fax.trim();
					result1 += ((result1.length > 0 ? ',' : '\n') + str);
				}
				result += result1;
				if (result.substring(0, 1) == '\n') {
					result = result.substring(1, result.length);
				}
				if (result.substring(result.length - 1, result.length) == ',' || result.substring(result.length - 1, result.length) == '\n') {
					result = result.substring(0, result.length - 1);
				}
				this.ruleForm.scPrintRemark = result.toUpperCase()
			},
			formatter1(row, column) {
				return row.awbFromType + ' - ' + row.awbFromName;
			},
			formatter2(row, column) {
				if (row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
	.shipperConsigneeSelectPage .el-input__icon {
		line-height: 30px !important;
	}

	.shipperConsigneeSelectPage .el-form-item__content {
		line-height: 30px !important;
	}

	.widthWithAEOCode .el-input-group__prepend {
		padding: 0 19.5px;
	}

	.shipperConsigneeSelectPage textarea {
		border: none;
		resize: none;
	}
</style>
