<template>
	<el-dialog title="对账单 - 服务" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" append-to-body>
		<el-form :model="query" ref="query" label-width="15px" class="demo-ruleForm paymentCostListPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:232px;">
							<template slot="prepend">
								<span v-if="frow.businessScope=='AE'||frow.businessScope=='SE'">开航日期</span>
								<span v-if="frow.businessScope=='AI'||frow.businessScope=='SI'">到港日期</span>
								<span v-if="frow.businessScope=='TE'">发车日期</span>
								<span v-if="frow.businessScope=='TI'">到达日期</span>
								<span v-if="frow.businessScope=='LC'">用车日期</span>
								<span v-if="frow.businessScope=='IO'">业务日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="query.flightDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.flightDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="提单/订单号" label-width="120px">
						<el-input v-model="query.awbOrOrderNumbers" type="textarea" placeholder="支持批量录入，以','分隔" auto-complete="off" style="width:480px;" :rows="5" show-word-limit maxlength="500">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="primary" size="mini" @click="queryCostList">查询</el-button>
					</el-form-item>
				</el-col>
			</el-row>

			<div style="position: relative;left: 0px;top: -85px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input @input="formatFloat2" v-model="query.automatchAmount" clearable auto-complete="off" style="width:290px;">
								<template slot="prepend">对账金额</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button size="mini" type="primary" @click="automatch">自动匹配</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:382px;">
								<template slot="prepend">
									<span>服务类别</span>
								</template>
								<el-select slot="suffix" v-model="serviceIds" clearable multiple filterable placeholder="服务类别" style="width:286px;margin-right: -5px;">
									<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+'-'+item.serviceNameCn" :value="item.serviceId">
										<span>{{item.value}}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>

			<div style="position: relative;left: 925px;top: -80px;">
				<span>本次对账总金额：</span>
				<span>{{sumCostCurrAmountPayment}}</span>
			</div>
		</el-form>
		<el-table style="position: relative;left: 0px;top: -70px;" ref="table" v-loading="loading" :data="data" border stripe @selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center" width="50"></el-table-column>
			<el-table-column align="center" prop="orderCode" width="130">
				<template slot="header">
					<span v-if="frow.businessScope=='LC'||frow.businessScope=='IO'">客户单号/订单号</span>
					<span v-else>提单号/订单号</span>
				</template>
			</el-table-column>
			<el-table-column v-if="frow.businessScope!='LC'&&frow.businessScope!='IO'" align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
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
			<el-table-column align="center" prop="serviceName" label="服务"></el-table-column>
			<el-table-column header-align="center" align="right" label="成本金额" width="150">
				<template slot-scope="scope">
					<font v-if="scope.row.costAmountStr!=null&&scope.row.costAmountStr.indexOf('CNY')>-1">{{scope.row.costAmountStr}}</font>
					<font v-else style="color: red;">{{scope.row.costAmountStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="已对账金额" width="150">
				<template slot-scope="scope">
					<font v-if="scope.row.costAmountPaymentStr!=null&&scope.row.costAmountPaymentStr.indexOf('CNY')>-1">{{scope.row.costAmountPaymentStr}}</font>
					<font v-else style="color: red;">{{scope.row.costAmountPaymentStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="未对账金额" width="150">
				<template slot-scope="scope">
					<font v-if="scope.row.costAmountNoPaymentStr!=null&&scope.row.costAmountNoPaymentStr.indexOf('CNY')>-1">{{scope.row.costAmountNoPaymentStr}}</font>
					<font v-else style="color: red;">{{scope.row.costAmountNoPaymentStr}}</font>
				</template>
			</el-table-column>
			<el-table-column align="center" label="本次对账金额" width="150">
				<template slot-scope="scope">
					<el-input @input="formatFloat2ForTableField(scope.row)" @change="changeCostCurrAmountPayment(scope.row)" v-model="scope.row.costCurrAmountPayment" clearable auto-complete="off" style="width:90px;"></el-input>
					<span v-if="scope.row.costCurrency!='CNY'" style="color: red;">({{scope.row.costCurrency}})</span>
					<span v-else>({{scope.row.costCurrency}})</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="submit">确定</el-button>
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
				data: [],
				multipleSelection: [],
				serviceOptions: [],
				serviceIds: [],
				query: {
					costCurrency: '',
					customerId: '',
					businessScope: '',
					flightDateStart: this.getDateTime(),
					flightDateEnd: '',
					awbOrOrderNumbers: '',
					noCostIds: '',
					deleteCostIds: '',
					paymentId: '',
					serviceIds: '',
					automatchAmount: ''
				},
				loading: false,
				initSelect: false,
				sumCostCurrAmountPayment: null
			}
		},

		inject: ['doAdd'],

		created: function() {
			this.query.noCostIds = this.frow.costIds
			this.query.deleteCostIds = this.frow.deleteCostIds
			this.query.paymentId = this.frow.paymentId
			this.query.customerId = this.frow.customerId
			this.query.businessScope = this.frow.businessScope
			this.query.costCurrency = this.frow.currency
			//查询服务类别
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: this.frow.businessScope
			}).then(function(response) {
				this.serviceOptions = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			});
		},

		methods: {
			automatch() {
				if (this.query.automatchAmount == '' || this.query.automatchAmount == 0 || parseFloat(this.query.automatchAmount) < 0) {
					this.openError("对账金额无法自动匹配")
					return
				}
				let sum = 0.00
				this.data.forEach(item => sum += item.costAmountNoPayment)
				if (parseFloat(this.query.automatchAmount) > sum) {
					this.$confirm('查询结果 不足对账匹配金额，是否继续', '提示', {
						confirmButtonText: '是',
						cancelButtonText: '否',
						type: 'warning',
						center: true
					}).then(() => {
						this.query.awbOrOrderNumbers = this.query.awbOrOrderNumbers.replace(/\n/g, '').replace(/ /g, '').replace(/　/g, '').replace(/，/g, ',').replace(/，/g, ',')
						this.query.serviceIds = this.serviceIds.join()
						this.loading = true
						this.$axios.get2('/afbase/cssPayment/automatch', this.query).then((response) => {
							this.$refs.table.clearSelection()
							this.data = response.data.data;
							this.$refs.table.toggleAllSelection()
							this.loading = false
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}).catch(() => {});
				} else {
					this.query.awbOrOrderNumbers = this.query.awbOrOrderNumbers.replace(/\n/g, '').replace(/ /g, '').replace(/　/g, '').replace(/，/g, ',').replace(/，/g, ',')
					this.query.serviceIds = this.serviceIds.join()
					this.loading = true
					this.$axios.get2('/afbase/cssPayment/automatch', this.query).then((response) => {
						this.$refs.table.clearSelection()
						this.data = response.data.data;
						//						this.$refs.table.toggleAllSelection()
						this.$nextTick(() => {
							this.initSelect = true
							this.data.forEach(row => {
								if (row.costCurrAmountPayment != 0) {
									this.$refs.table.toggleRowSelection(row, true)
								}
							})
							this.initSelect = false
						})
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
				}

			},
			submit() {
				if (this.multipleSelection.some(select => select.costCurrAmountPayment == null || select.costCurrAmountPayment === '')) {
					this.openError("请录入本次对账金额")
					return
				}

				if (this.multipleSelection.some(select => !/^(\-)?\d+(\.\d{1,2})?$/g.test(select.costCurrAmountPayment))) {
					this.openError("录入本次对账金额格式有误")
					return
				}
				try {
					this.multipleSelection.forEach(select => {
						if (select.costAmountNoPayment < 0) {
							if (parseFloat(select.costCurrAmountPayment) > 0) {
								this.openError('单号：' + select.orderCode + '本次对账金额不能>0')
								throw Error("end")
							} else {
								if (parseFloat(select.costCurrAmountPayment) < select.costAmountNoPayment) {
									this.openError('单号：' + select.orderCode + '本次对账金额不能超出未对账金额')
									throw Error("end")
								}
							}
						} else if (select.costAmountNoPayment > 0) {
							if (parseFloat(select.costCurrAmountPayment) < 0) {
								this.openError('单号：' + select.orderCode + '本次对账金额不能<0')
								throw Error("end")
							} else {
								if (parseFloat(select.costCurrAmountPayment) > select.costAmountNoPayment) {
									this.openError('单号：' + select.orderCode + '本次对账金额不能超出未对账金额')
									throw Error("end")
								}
							}
						} else {
							if (parseFloat(select.costCurrAmountPayment) != 0) {
								this.openError('单号：' + select.orderCode + '没有可对账金额')
								throw Error("end")
							}
						}
					})
				} catch (e) {
					if (e.message == 'end') {
						return
					}
				}
				this.doAdd(this.multipleSelection)
				this.handleClose()
			},
			queryCostList() {
				this.query.awbOrOrderNumbers = this.query.awbOrOrderNumbers.replace(/\n/g, '').replace(/ /g, '').replace(/　/g, '').replace(/，/g, ',').replace(/，/g, ',')
				this.query.serviceIds = this.serviceIds.join()
				this.loading = true
				if (this.query.businessScope == 'AI' || this.query.businessScope == 'AE') {
					this.$axios.get2('/afbase/cost', this.query).then((response) => {
						this.data = response.data.data;
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
				} else if (this.query.businessScope.startsWith('T')) {
					this.$axios.get2('/afbase/tc-cost/list', this.query).then((response) => {
						this.data = response.data.data;
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
				} else if (this.query.businessScope.startsWith('L')) {
					this.$axios.get2('/afbase/lc-cost/list', this.query).then((response) => {
						this.data = response.data.data;
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
				}  else if (this.query.businessScope=='IO') {
					this.$axios.get2('/afbase/io-cost/list', this.query).then((response) => {
						this.data = response.data.data;
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
				} else {
					this.$axios.get2('/afbase/afbase/sc-cost', this.query).then((response) => {
						this.data = response.data.data;
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
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
			formatFloat2() {
				this.query.automatchAmount = this.query.automatchAmount.replace(/[^0123456789.]/g, "");
				let t = this.query.automatchAmount.split('.');
				if (t.length > 1) {
					if (t[0] == '') {
						this.query.automatchAmount = "0." + t[1].substr(0, 2);
					} else {
						this.query.automatchAmount = t[0] + "." + t[1].substr(0, 2);
					}
				}
			},
			formatFloat2ForTableField(row) {
				row.costCurrAmountPayment = row.costCurrAmountPayment.replace(/[^-0123456789.]/g, "");
				row.costCurrAmountPayment = row.costCurrAmountPayment.substring(row.costCurrAmountPayment.lastIndexOf('-'))

				let t = row.costCurrAmountPayment.split('.');
				if (t.length > 1) {
					if (t[0] == '') {
						row.costCurrAmountPayment = "0." + t[1].substr(0, 2);
					} else if (t[0] == '-') {
						row.costCurrAmountPayment = "-0." + t[1].substr(0, 2);
					} else {
						row.costCurrAmountPayment = t[0] + "." + t[1].substr(0, 2);
					}
				} else {
					if (row.costCurrAmountPayment.startsWith("-0")) {
						row.costCurrAmountPayment = row.costCurrAmountPayment.substr(0, 2)
					} else if (row.costCurrAmountPayment.startsWith("0")) {
						row.costCurrAmountPayment = row.costCurrAmountPayment.substr(0, 1)
					}
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val
				this.data.filter(row => {
					if (this.multipleSelection.find(i => i.costId == row.costId) == null) {
						if (!this.initSelect) {
							row.costCurrAmountPayment = '0'
						}
					} else {
						if (row.costCurrAmountPayment == '' || row.costCurrAmountPayment == 0) {
							row.costCurrAmountPayment = row.costAmountNoPayment + ''
						}
					}
				})
				this.countSumCostCurrAmountPayment()
			},
			changeCostCurrAmountPayment(row) {
				if (row.costCurrAmountPayment !== '' && row.costCurrAmountPayment != 0) {
					this.$refs.table.toggleRowSelection(row, true)
				} else {
					this.$refs.table.toggleRowSelection(row, false)
				}
				this.countSumCostCurrAmountPayment()
			},
			countSumCostCurrAmountPayment() {
				this.sumCostCurrAmountPayment = null
				this.multipleSelection.forEach(row => {
					if (row.costCurrAmountPayment != null && row.costCurrAmountPayment !== '') {
						if (this.sumCostCurrAmountPayment == null) {
							this.sumCostCurrAmountPayment = parseFloat(row.costCurrAmountPayment)
						} else {
							this.sumCostCurrAmountPayment += parseFloat(row.costCurrAmountPayment)
						}
					}
				})
				if (this.sumCostCurrAmountPayment != null) {
					this.sumCostCurrAmountPayment = this.sumCostCurrAmountPayment.toFixed(2)
				}
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01";
			}

			//--------------------- 

		}
	}
</script>
<style type="text/css">
	.paymentCostListPage .el-input__icon {
		line-height: 30px !important;
	}

	.paymentCostListPage .el-form-item__content {
		line-height: 30px !important;
	}
</style>
