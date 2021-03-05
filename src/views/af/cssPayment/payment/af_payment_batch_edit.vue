<template>
	<el-dialog title="对账单 - 批量" width="1255px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="10px" class="demo-ruleForm paymentEditPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:155px" v-model="ruleForm.businessScope">
							<template slot="prepend">
								<span>业务范畴</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="customerId">
						<el-input class="widthWithFourWithXing" style="width:440px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>付款客户</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.customerId" clearable filterable placeholder="请选择付款对象" style="width:345px;margin-right: -5px;" :disabled="headerDisabled">
								<el-option v-for="item in customers" :key="item.coopIdV" :label="item.value" :value="item.coopIdV">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="currency">
						<el-input style="width:180px;" class="widthWithFourWithXing">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>对账币种</span>
							</template>
							<el-select slot="suffix" v-if="ruleForm.currency=='CNY'" v-model="ruleForm.currency" placeholder="请选择币种" style="width: 85px;margin-right: -5px;" :disabled="headerDisabled" @change="changeCurrency">
								<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
							<el-select slot="suffix" v-else v-model="ruleForm.currency" class="currencyRedColor" placeholder="请选择币种" style="width: 85px;margin-right: -5px;" :disabled="headerDisabled" @change="changeCurrency">
								<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="exchangeRate">
						<el-input :disabled="ruleForm.currency=='CNY'" auto-complete="off" clearable v-model="ruleForm.exchangeRate" style="width:165px" @input="formatFloat4">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>汇率</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="paymentDate">
						<el-input class="widthWithFourWithXing" style="width:235px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>对账日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.paymentDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="对账日期" style="width: 138px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:970px;">
							<template slot="prepend">
								<span>服务类别</span>
							</template>
							<el-select slot="suffix" v-model="serviceIds" clearable multiple filterable placeholder="服务类别" style="width:874px;margin-right: -5px;" :disabled="headerDisabled">
								<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+'-'+item.serviceNameCn" :value="item.serviceId">
									<span>{{item.value}}</span>
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-upload style="display: inline;" action="/afbase/cssPayment/readExcel" :show-file-list="false" :data="getData()" :on-success="success" accept=".xls,.xlsx" :headers="headers" :before-upload="beforeUpload">
						<el-button style="margin-left: 10px;padding: 9px 7px;" type="success" size="small">上传对账文件</el-button>
					</el-upload>
					<el-button style="margin-left: 80px;padding: 9px 7px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="downloadModel">下载模板</el-button>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.paymentRemark" type="textarea" auto-complete="off" style="width:1215px;" :rows="3" show-word-limit maxlength="500">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>

			<div style="position: absolute;left: 20px;top: 285px;">
				<span>原成本总额</span>
				<span>{{amountSum}}</span>
			</div>
			<div style="position: absolute;left: 225px;top: 285px;">
				<span>可对账总额</span>
				<span style="color: blue;">{{noPaymentAmountSum}}</span>
			</div>
			<div style="position: absolute;left: 425px;top: 285px;">
				<span>供应商总额</span>
				<span style="color: red;">{{uploadAmountSum}}</span>
			</div>
			<div style="position: absolute;left: 625px;top: 285px;">
				<span>误差总额</span>
				<span style="color: red;">{{errorAmountSum}}</span>
			</div>
			<div style="position: absolute;left: 1197px;top: 285px;">
				<el-button style="padding: 6px 6px 6px 6px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
			</div>

		</el-form>
		<div style="margin-top: 50px;">
			<el-table v-loading="loading" :data="data" border stripe :cell-class-name="cellClass">
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>
				<el-table-column align="center" width="130">
					<template slot="header">
						<span v-if="frow.businessScope=='LC'||frow.businessScope=='IO'">客户单号/订单号</span>
						<span v-else>提单号/订单号</span>
					</template>
					<template slot-scope="scope">
						<span v-if="scope.row.amount==null" style="color: red;"><s>{{scope.row.code}}</s></span>
						<span v-else>{{scope.row.code}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="flightDate" width="110">
					<template slot="header">
						<span v-if="frow.businessScope=='AE'||frow.businessScope=='SE'">开航日期</span>
						<span v-if="frow.businessScope=='AI'||frow.businessScope=='SI'">到港日期</span>
						<span v-if="frow.businessScope=='TE'">发车日期</span>
						<span v-if="frow.businessScope=='TI'">到达日期</span>
						<span v-if="frow.businessScope=='LC'">用车日期</span>
						<span v-if="frow.businessScope=='IO'">业务日期</span>
					</template>
					<template slot-scope="scope">
						<span v-if="scope.row.amount==null" style="color: red;">未找到</span>
						<span v-else>{{scope.row.flightDate}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" prop="amountStr" label="原成本金额"></el-table-column>
				<el-table-column header-align="center" align="right" prop="noPaymentAmountStr" label="可对账金额"></el-table-column>
				<el-table-column header-align="center" align="right" prop="uploadAmountStr" label="供应商(Excel)金额"></el-table-column>
				<el-table-column header-align="center" align="right" prop="errorAmountStr" label="误差金额"></el-table-column>
			</el-table>
		</div>
		<div style="padding:10px 0px 10px 0px">
			<HR color="#eee" size="5">
			</HR>
		</div>
		<div style="padding:0px 0px 0px 10px">
			<span>调整设置</span>
			<el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
			<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
			<el-row v-show="showFlag" class="paymentEditPage">
				<el-col class="elementWidth">
					<span style="margin-left: 10px;">误差金额调整设置</span>
					<el-input style="width:270px;margin-left: 10px;">
						<template slot="prepend">
							<span>服务类别</span>
						</template>
						<el-select slot="suffix" v-model="ruleForm.serviceId" clearable filterable placeholder="服务类别" style="width:174px;margin-right: -5px;" :disabled="footer_single_disabled">
							<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+'-'+item.serviceNameCn" :value="item.serviceId">
								<span>{{item.value}}</span>
							</el-option>
						</el-select>
					</el-input>
					<el-radio style="margin-left: 30px;" v-model="ruleForm.ifAdjust" :label="true" :disabled="footerDisabled" @change="changeIfAdjust">调整(以供应商为准)</el-radio>
					<el-radio v-model="ruleForm.ifAdjust" :label="false" :disabled="footerDisabled" @change="changeIfAdjust">不调整(以系统为准)</el-radio>
					<span>，财务日期调整到</span>
					<el-date-picker v-model="ruleForm.financialDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="财务日期" style="width: 138px;margin-left: 10px;" :disabled="footer_single_disabled">
					</el-date-picker>
				</el-col>
			</el-row>
		</div>
		<div style="padding:10px 0px 10px 0px">
			<HR color="#eee" size="5">
			</HR>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button :loading="buttonLoading" type="primary" size="small" v-on:click="doSave('ruleForm')">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
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
				buttonLoading: false,
				loading: false,
				data: [],
				headers: {
					Authorization: 'Bearer ' + window.localStorage.getItem("access_token")
				},
				showFlag: false,
				footerDisabled: true,
				headerDisabled: false,
				footer_single_disabled: true,
				currencys: [],
				customers: [],
				serviceOptions: [],
				serviceIds: [],
				ruleForm: {
					businessScope: this.frow.businessScope,
					paymentDate: this.getDateTime(new Date()),
					customerId: null,
					currency: 'CNY',
					exchangeRate: '',
					paymentRemark: '',
					serviceIds: '',
					serviceId: '',
					ifAdjust: false,
					financialDate: '',
					list: []
				},
				amountSum: '',
				noPaymentAmountSum: '',
				uploadAmountSum: '',
				errorAmountSum: '',
				rules: {
					currency: [{
						required: true,
						message: '请选择币种',
						trigger: ['blur', 'change']
					}],
					exchangeRate: [{
						required: true,
						message: '请录入汇率',
						trigger: ['blur', 'change']
					}],
					customerId: [{
						required: true,
						message: '请选择付款对象',
						trigger: ['blur', 'change']
					}],
					paymentDate: [{
						required: true,
						message: '请录入对账日期',
						trigger: ['blur', 'change']
					}]
				}

			}
		},
		inject: ['queryList'],
		created: function() {
			//查询付款对象
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'干线承运人','互为代理','海外代理','延伸服务供应商','业务类结算对象'"
			}).then((response) => {
				this.customers = response.data.data;
			}).catch((error) => {
				console.log(error);
			});
			//查询币种
			this.$axios.get('/afbase/currency').then(function(response) {
				this.currencys = response.data.data;
				if (this.currencys != null && this.currencys.length > 0) {
					this.ruleForm.exchangeRate = this.currencys.filter(currency => currency.currencyCode == this.ruleForm.currency)[0].currencyRate + ''
				}
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//查询服务类别
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: this.frow.businessScope
			}).then(function(response) {
				this.serviceOptions = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
		},

		methods: {
			downloadModel() {
				this.$axios.post3('/afbase/cssPayment/downloadModel').then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '成本对账模板_' + this.ruleForm.businessScope + '.xlsx'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
				}).catch((error) => {})
			},
			exportExcel() {
				this.$axios.postRequestJSONResponseBlob('/afbase/cssPayment/exportBatchDetail', {
					list: this.data.map(item => {
						return {
							code: item.code,
							flightDate: item.flightDate,
							amount: item.amount,
							noPaymentAmount: item.noPaymentAmount,
							uploadAmount: item.uploadAmount,
							errorAmount: item.errorAmount
						}
					}),
					businessScope: this.ruleForm.businessScope
				}).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '批量账单费用明细表' + '.xls'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
				}).catch((error) => {})
			},
			getData() {
				return {
					serviceIds: this.serviceIds.join(),
					currency: this.ruleForm.currency,
					businessScope: this.ruleForm.businessScope,
					customerId: this.ruleForm.customerId
				}
			},
			success(response, file, fileList) {
				if (response.code == 0) {
					this.data = response.data

					//是否启动调整设置
					this.checkIfAdjust()
					this.headerDisabled = true
				} else {
					this.openError(response.messageInfo)
				}
				this.loading = false
			},
			checkIfAdjust() {
				if (this.data.some(item => item.amount != null && item.errorAmount !== 0)) {
					this.showFlag = true
					this.footerDisabled = false
				} else {
					this.footerDisabled = true
					this.ruleForm.ifAdjust = false
				}
				this.changeIfAdjust(this.ruleForm.ifAdjust)
				//计算求和
				let amountSum = 0
				let noPaymentAmountSum = 0
				let uploadAmountSum = 0
				let errorAmountSum = 0
				this.data.forEach(item => {
					if (item.amount) {
						amountSum += item.amount
					}
					if (item.noPaymentAmount) {
						noPaymentAmountSum += item.noPaymentAmount
					}
					if (item.uploadAmount) {
						uploadAmountSum += item.uploadAmount
					}
					if (item.errorAmount) {
						errorAmountSum += item.errorAmount
					}
				})
				this.amountSum = this.getNumber(amountSum)
				this.noPaymentAmountSum = this.getNumber(noPaymentAmountSum)
				this.uploadAmountSum = this.getNumber(uploadAmountSum)
				this.errorAmountSum = this.getNumber(errorAmountSum)
			},
			changeIfAdjust(val) {
				if (val) {
					if (!this.ruleForm.financialDate) {
						this.ruleForm.financialDate = this.getDateTime(new Date())
					}
				} else {
					this.ruleForm.financialDate = null
					this.ruleForm.serviceId = null
				}
				this.footer_single_disabled = !val
			},
			beforeUpload() {
				if (!this.ruleForm.customerId) {
					this.$refs.ruleForm.validateField("customerId", (error) => {

					})
					return false
				}
				this.loading = true
			},
			cellClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex == 4) {
					return 'cellBlue'
				} else if (columnIndex == 5) {
					if (row.noPaymentAmount == row.uploadAmount) {
						return 'cellBlue'
					} else {
						return 'cellRed'
					}
				} else if (columnIndex == 6 && row.errorAmount !== 0) {
					return 'cellRed'
				}
				return ''
			},
			doDelete(index, row) {
				this.data.splice(index, 1);
				this.checkIfAdjust();
			},
			doSave(formName) {
				this.buttonLoading = true
				if (this.data == null || this.data.length == 0) {
					this.openError("请上传对账文件")
					this.buttonLoading = false
					return
				}
				if(this.data.some(item => item.amount == null)){
					this.openError("对账列表中含有未找到记录，无法对账")
					this.buttonLoading = false
					return
				}
				if (this.ruleForm.ifAdjust && !this.ruleForm.serviceId) {
					this.openError("当前您设置为调整状态，调整设置中的服务类别不能为空")
					this.buttonLoading = false
					return
				}
				let noPaymentAmountSum = 0
				let uploadAmountSum = 0
				this.ruleForm.list = this.data.filter(item => item.amount != null).map(item => {
					noPaymentAmountSum += item.noPaymentAmount
					uploadAmountSum += item.uploadAmount
					return {
						id: item.id,
						isOrderCode: item.isOrderCode,
						errorAmount: item.errorAmount,
						orderRowUuid: item.orderRowUuid
					}
				})
				if (!this.ruleForm.ifAdjust && noPaymentAmountSum === 0) {
					this.openError("当前您设置为不调整状态，可对账金额不能为0")
					this.buttonLoading = false
					return
				}
				this.ruleForm.noPaymentAmountSum = noPaymentAmountSum
				this.ruleForm.uploadAmountSum = uploadAmountSum
				this.ruleForm.serviceIds = this.serviceIds.join()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/afbase/cssPayment/batch', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.openSuccess("保存成功");
									this.queryList();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}
								this.buttonLoading = false
							}).catch((error) => {
								this.buttonLoading = false
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo)
							});
					} else {
						this.buttonLoading = false
						console.log('error submit!!');
						return false;
					}
				})
			},
			changeCurrency(val) {
				if (val != null && val !== '') {
					let currencyRate = this.currencys.filter(currency => currency.currencyCode == val)[0].currencyRate
					if (currencyRate != null && currencyRate !== '') {
						this.ruleForm.exchangeRate = currencyRate + ''
					} else {
						this.ruleForm.exchangeRate = ''
					}
				} else {
					this.ruleForm.exchangeRate = ''
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
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date;
			},
			formatFloat2(prop) {
				if (prop == 'amountPayment') {
					if (this.ruleForm.amountPayment != null && this.ruleForm.amountPayment !== '') {
						this.amountPaymentStr = this.getNumber(this.ruleForm.amountPayment)
						this.ruleForm.amountPayment = this.ruleForm.amountPayment.toFixed(2)
					} else {
						this.amountPaymentStr = ''
					}
				} else if (prop == 'functionalAmountPayment') {
					if (this.ruleForm.functionalAmountPayment != null && this.ruleForm.functionalAmountPayment !== '') {
						this.functionalAmountPaymentStr = this.getNumber(this.ruleForm.functionalAmountPayment)
						this.ruleForm.functionalAmountPayment = this.ruleForm.functionalAmountPayment.toFixed(2)
					} else {
						this.functionalAmountPaymentStr = ''
					}
				}
			},
			formatFloat4() {
				this.ruleForm.exchangeRate = this.ruleForm.exchangeRate.replace(/[^0123456789.]/g, "");
				let t = this.ruleForm.exchangeRate.split('.');
				if (t.length > 1) {
					if (t[0] == '') {
						this.ruleForm.exchangeRate = "0." + t[1].substr(0, 4);
					} else {
						this.ruleForm.exchangeRate = t[0] + "." + t[1].substr(0, 4);
					}
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
	.paymentEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.currencyRedColor input {
		color: red !important;
	}

	.cellBlue {
		color: blue;
	}

	.cellRed {
		color: red;
	}
</style>