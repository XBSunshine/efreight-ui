<template>
	<el-dialog title="对账单 - 编辑" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :disabled="ifEdit" :model="ruleForm" ref="ruleForm" :rules="rules" label-width="15px" class="demo-ruleForm paymentEditPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="customerId">
						<el-input class="widthWithFourWithXing" style="width:440px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>付款客户</span>
							</template>
							<el-select slot="suffix" v-model="customerValueTemp" clearable filterable placeholder="请选择付款对象" @change="changecustomerValueTemp" style="width:345px;margin-right: -5px;">
								<el-option v-for="item in customers" :key="item.coopIdV" :label="item.value" :value="item.coopIdV">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:255px" v-model="ruleForm.paymentNum">
							<template slot="prepend">
								<span>对账编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="currency">
						<el-input style="width:220px;" class="widthWithFourWithXing">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>对账币种</span>
							</template>
							<el-select slot="suffix" v-if="ruleForm.currency=='CNY'" v-model="ruleForm.currency" placeholder="请选择币种" style="width: 125px;margin-right: -5px;" @change="changeCurrency">
								<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
							<el-select slot="suffix" v-else v-model="ruleForm.currency" class="currencyRedColor" placeholder="请选择币种" style="width: 125px;margin-right: -5px;" @change="changeCurrency">
								<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="exchangeRate">
						<el-input :disabled="ruleForm.currency=='CNY'" auto-complete="off" clearable v-model="ruleForm.exchangeRate" style="width:205px" @input="formatFloat4" @change="changeExchangeRate">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>汇率</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="paymentDate">
						<el-input class="widthWithFourWithXing" style="width:255px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>对账日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.paymentDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="对账日期" style="width: 158px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.paymentRemark" type="textarea" auto-complete="off" style="width:710px;" :rows="3" show-word-limit maxlength="500">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>

			<div style="position: absolute;left: 500px;top: 285px;">
				<span>对账金额</span>
				<span v-if="ruleForm.currency=='CNY'">{{amountPaymentStr}}</span>
				<span v-else style="color: red;width: 100px;">{{amountPaymentStr}}</span>
			</div>
			<div style="position: absolute;left: 725px;top: 285px;">
				<span>对账金额(本币)</span>
				<span>{{functionalAmountPaymentStr}}</span>
			</div>

		</el-form>
		<el-row style="margin-left: 20px;margin-top: 10px;margin-bottom: 10px;">
			<i class="iconfont el-icon-myyuanquanjiahao" @click="showAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
			<span style="margin-left: 10px;cursor: pointer;" @click="showAdd">增加服务</span>
		</el-row>
		<div>
			<el-table :data="ruleForm.details" border stripe>
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="awbOrOrderNumber" width="130">
					<template slot="header">
						<span v-if="frow.businessScope=='LC'||frow.businessScope=='IO'">客户单号/订单号</span>
						<span v-else>提单号/订单号</span>
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
				</el-table-column>
				
				<el-table-column align="center" prop="serviceName" label="服务" width="280"></el-table-column>
				<el-table-column header-align="center" align="right" label="成本金额">
					<template slot-scope="scope">
						<font v-if="scope.row.costAmountStr.indexOf('CNY')>-1">{{scope.row.costAmountStr}}</font>
						<font v-else style="color: red;">{{scope.row.costAmountStr}}</font>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="本次对账金额">
					<template slot-scope="scope">
						<font v-if="scope.row.amountPaymentStr.indexOf('CNY')>-1">{{scope.row.amountPaymentStr}}</font>
						<font v-else style="color: red;">{{scope.row.amountPaymentStr}}</font>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="doSave('ruleForm')" :disabled="ifEdit">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
		</div>
		<costList ref="addMission" v-if="costListVisible" :visible.sync="costListVisible" :frow="ffrow"></costList>
	</el-dialog>
</template>
<script>
	import CostList from './af_payment_cost_list'
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
				ifEdit:false,
				currencys: [],
				customers: [],
				customerValueTemp: '',
				costListVisible: false,
				ruleForm: {
					paymentNum: this.frow.businessScope,
					businessScope: this.frow.businessScope,
					paymentDate: '',
					customerId: null,
					customerName: null,
					currency: 'CNY',
					exchangeRate: '',
					amountPayment: null,
					functionalAmountPayment: null,
					paymentRemark: '',
					details: []
				},
				amountPaymentStr: '',
				functionalAmountPaymentStr: '',
				deleteDetails: [],
				ffrow: {},
				currencyOldVal: '',
				customerOldVal: '',
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
						message: '请录入付款日期',
						trigger: ['blur', 'change']
					}]
				}

			}
		},
		watch: {
			'ruleForm.currency': {
				handler(curVal, oldVal) {
					this.currencyOldVal = oldVal
				},
			},
			customerValueTemp: {
				handler(curVal, oldVal) {
					this.customerOldVal = oldVal
				},
			}
		},
		inject: ['queryList'],
		provide() {
			return {
				doAdd: this.doAdd
			}
		},
		components: {
			'costList': CostList
		},
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
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			this.init()
		},

		methods: {
			init() {
				this.$axios.get('/afbase/cssPayment/' + this.frow.paymentId).then((response) => {
					if(response.data.code==0){
				     	this.ruleForm = response.data.data
					    this.formatFloat2('amountPayment')
				     	this.formatFloat2('functionalAmountPayment')
					    if(this.ruleForm != null) {
						this.customerValueTemp = this.ruleForm.customerId + ''
					    }
					}else{
						this.ifEdit = true
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.ifEdit = true
					console.log(error.response.data.messageInfo);
				});
			},
			showAdd() {
				if(this.ruleForm.customerId == null || this.ruleForm.customerId === '') {
					this.openError('请选择付款对象')
					return
				}
				if(this.ruleForm.currency == null || this.ruleForm.currency === '') {
					this.openError('请选择付款币种')
					return
				}
				if(this.ruleForm.businessScope == null || this.ruleForm.businessScope === '') {
					this.openError('请选择业务范畴')
					return
				}
				this.ffrow.costIds = this.ruleForm.details.map(detail => detail.costId).join()
				this.ffrow.deleteCostIds = this.deleteDetails.map(deleteDetail => deleteDetail.costId).join()
				this.ffrow.paymentId = this.ruleForm.paymentId
				this.ffrow.businessScope = this.ruleForm.businessScope
				this.ffrow.currency = this.ruleForm.currency
				this.ffrow.customerId = this.ruleForm.customerId
				this.costListVisible = true
			},
			doAdd(details) {
				details.forEach(detail => {
					let row = {
						orderId: detail.orderId,
						awbOrOrderNumber: detail.orderCode,
            customerNumber: detail.customerNumber,
						flightDate: detail.flightDate,
						costId: detail.costId,
						currency: detail.costCurrency,
						//						amountPaymentStr: this.milliFormat(detail.costCurrAmountPayment) + ' (' + detail.costCurrency + ')',
						amountPaymentStr: this.getNumber(parseFloat(detail.costCurrAmountPayment)) + ' (' + detail.costCurrency + ')',
						amountPayment: parseFloat(detail.costCurrAmountPayment),
						costAmount: detail.costAmount,
						costAmountStr: detail.costAmountStr,
						serviceName: detail.serviceName,
						rowUuid:detail.rowUuid
					}
					this.ruleForm.details.push(row)
				})
				this.countAmountPayment()
			},
			doDelete(index, row) {
				if(row.paymentIdDetailId != null) {
					this.deleteDetails.push(row)
				}
				this.ruleForm.details.splice(index, 1);
				this.countAmountPayment();
			},
			doSave(formName) {
				if(this.ruleForm.amountPayment == null || this.ruleForm.amountPayment === '') {
					this.openError("对账金额不能为空")
					return
				}
				if(this.ruleForm.amountPayment == 0) {
					this.openError("对账金额不能等于0")
					return
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$axios.put('/afbase/cssPayment', this.ruleForm)
							.then((response) => {
								if(response.data.code == 0) {
									this.openSuccess("保存成功");
									this.queryList();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}

							}).catch((error) => {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo)
							});
					} else {
						console.log('error submit!!');
						return false;
					}
				})
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
				if(_month < 10) {
					_month = "0" + _month;
				}
				if(_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date;
			},
			//计算对账单付款金额
			countAmountPayment() {
				let paymentAmountSum = null
				this.ruleForm.details.forEach(row => {
					if(row.amountPayment != null && row.amountPayment !== '') {
						if(paymentAmountSum == null) {
							paymentAmountSum = row.amountPayment
						} else {
							paymentAmountSum += row.amountPayment
						}
					}
				})

				this.ruleForm.amountPayment = paymentAmountSum
				if(this.ruleForm.amountPayment != null && this.ruleForm.exchangeRate != null && this.ruleForm.exchangeRate !== '') {
					this.ruleForm.functionalAmountPayment = this.ruleForm.amountPayment * parseFloat(this.ruleForm.exchangeRate)
				} else {
					this.ruleForm.functionalAmountPayment = null
				}
				this.formatFloat2('amountPayment')
				this.formatFloat2('functionalAmountPayment')
			},
			changeExchangeRate() {
				if(this.ruleForm.amountPayment != null && this.ruleForm.exchangeRate != null && this.ruleForm.exchangeRate !== '') {
					this.ruleForm.functionalAmountPayment = this.ruleForm.amountPayment * parseFloat(this.ruleForm.exchangeRate)
				} else {
					this.ruleForm.functionalAmountPayment = null
				}
				this.formatFloat2('functionalAmountPayment')
			},
			changecustomerValueTemp(val) {
				if(this.ruleForm.details.length > 0) {
					this.$confirm('改变付款对象会清空对账明细，继续么？', '提示', {
						cancelButtonText: '取消',
						confirmButtonText: '确定',
						type: 'warning',
						center: true
					}).then(() => {
						if(val != null && val !== '') {
							this.ruleForm.customerId = this.customers.filter(customer => customer.coopIdV == val)[0].coopIdV
							this.ruleForm.customerName = this.customers.filter(customer => customer.coopIdV == val)[0].coopNameV
						} else {
							this.ruleForm.customerId = null
							this.ruleForm.customerName = null
						}
						this.ruleForm.details = []
						this.countAmountPayment()
					}).catch(() => {
						this.customerValueTemp = this.customerOldVal
					});
				} else {
					if(val != null && val !== '') {
						this.ruleForm.customerId = this.customers.filter(customer => customer.coopIdV == val)[0].coopIdV
						this.ruleForm.customerName = this.customers.filter(customer => customer.coopIdV == val)[0].coopNameV
					} else {
						this.ruleForm.customerId = null
						this.ruleForm.customerName = null
					}
				}
			},
			changeCurrency(val) {
				if(this.ruleForm.details.length > 0 && this.ruleForm.details[0].currency != val) {
					this.$confirm('币种与对账明细不符，确定会清空对账明细，继续么？', '提示', {
						cancelButtonText: '取消',
						confirmButtonText: '确定',
						type: 'warning',
						center: true
					}).then(() => {
						if(val != null && val !== '') {
							let currencyRate = this.currencys.filter(currency => currency.currencyCode == val)[0].currencyRate
							if(currencyRate != null && currencyRate !== '') {
								this.ruleForm.exchangeRate = currencyRate + ''
							} else {
								this.ruleForm.exchangeRate = ''
							}

						} else {
							this.ruleForm.exchangeRate = ''
						}
						this.ruleForm.details = []
						this.countAmountPayment()
					}).catch(() => {
						this.ruleForm.currency = this.currencyOldVal
					});
				} else {
					if(val != null && val !== '') {
						let currencyRate = this.currencys.filter(currency => currency.currencyCode == val)[0].currencyRate
						if(currencyRate != null && currencyRate !== '') {
							this.ruleForm.exchangeRate = currencyRate + ''
						} else {
							this.ruleForm.exchangeRate = ''
						}

					} else {
						this.ruleForm.exchangeRate = ''
					}
				}

			},
			formatFloat2(prop) {
				if(prop == 'amountPayment') {
					if(this.ruleForm.amountPayment != null && this.ruleForm.amountPayment !== '') {
						this.amountPaymentStr = this.getNumber(this.ruleForm.amountPayment)
						this.ruleForm.amountPayment = this.ruleForm.amountPayment.toFixed(2)
					} else {
						this.amountPaymentStr = ''
					}
				} else if(prop == 'functionalAmountPayment') {
					if(this.ruleForm.functionalAmountPayment != null && this.ruleForm.functionalAmountPayment !== '') {
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
				if(t.length > 1) {
					if(t[0] == '') {
						this.ruleForm.exchangeRate = "0." + t[1].substr(0, 4);
					} else {
						this.ruleForm.exchangeRate = t[0] + "." + t[1].substr(0, 4);
					}
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			milliFormat(s) { //添加千位符
				s = s.replace(/^(\d*)$/, "$1.")
				if(s.indexOf('.') > -1) {
					s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1")
				} else {
					s = s.replace(/(\d*\.\d\d)\d*/, "$1")
				}
				s = s.replace(".", ",")
				let re = /(\d)(\d{3},)/
				while(re.test(s)) {
					s = s.replace(re, "$1,$2")
				}
				s = s.replace(/,(\d\d)$/, ".$1")
				return s.replace(/^\./, "0.")
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

			//--------------------- 

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
</style>
