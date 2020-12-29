<template>
	<el-dialog title="派车单 - 增加订单" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top: -80px;" show-close append-to-body>
		<div class="warp-main">
			<el-form :inline="false" :model="query" label-width="10px" class="orderListPage">
				<div ref="vl_order_header">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input style="width:205px;">
									<template slot="prepend">业务范畴</template>
									<el-select slot="suffix" v-model="query.businessScope" @change="changeBusinessScope" style="width:136px;margin-right: -5px;">
										<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="query.orderCode" auto-complete="off" clearable style="width:200px;">
									<template slot="prepend">订单号</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth" v-if="query.businessScope.indexOf('LC')==-1">
							<el-form-item>
								<el-input v-model="query.awbNumber" auto-complete="off" clearable style="width:200px;">
									<template slot="prepend">提单号</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:200px;">
									<template slot="prepend">客户单号</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-button type="primary" size="small" v-on:click="findList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input style="width:204px;">
									<template slot="prepend">
										<span v-if="query.businessScope.endsWith('I')">到港日期</span>
										<span v-else-if="query.businessScope.endsWith('E')&&query.businessScope!='TE'">离港日期</span>
										<span v-else-if="query.businessScope.indexOf('TE')>-1">发车日期</span>
										<span v-else-if="query.businessScope.indexOf('LC')>-1">用车日期</span>
									</template>
									<el-date-picker slot="suffix" v-model="query.flightDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 135px;margin-right: -5px;">
									</el-date-picker>
								</el-input>
								<span>-</span>
								<el-date-picker v-model="query.flightDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 197px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input style="width:411px;" class="vl_order_list_service">
									<template slot="prepend">默认分摊服务</template>
									<el-select slot="suffix" v-model="serviceId" @change="changeServiceId" clearable placeholder="请选择" style="width:314px;margin-right: -5px;">
										<el-option v-for="item in services" :key="item.serviceId" :label="item.value" :value="item.serviceId">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
			<el-table height="500" v-loading="loading" :data="data" border stripe @selection-change="handleSelectionChange" :header-cell-style="headerCellStyle">
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="业务范畴" width="70" prop="businessScope"></el-table-column>
				<el-table-column align="center" label="订单号" width="120" prop="orderCode"></el-table-column>
				<el-table-column v-if="query.businessScope.indexOf('LC')==-1" align="center" label="提单号" width="120" prop="awbNumber"></el-table-column>
				<el-table-column align="center" label="客户单号" width="120" prop="customerNumber"></el-table-column>
				<el-table-column v-if="query.businessScope.endsWith('I')" align="center" label="到港日期" width="120" prop="flightDate"></el-table-column>
				<el-table-column v-else-if="query.businessScope.endsWith('E')&&query.businessScope!='TE'" align="center" label="离港日期" width="120" prop="flightDate"></el-table-column>
				<el-table-column v-else-if="query.businessScope.indexOf('TE')>-1" align="center" label="发车日期" width="120" prop="flightDate"></el-table-column>
				<el-table-column v-else-if="query.businessScope.indexOf('LC')>-1" align="center" label="用车日期" width="120" prop="flightDate"></el-table-column>
				<el-table-column align="center" label="预计信息">
					<el-table-column align="center" label="件数" width="100" prop="planPieces"></el-table-column>
					<el-table-column align="center" label="毛重" width="100" prop="planWeight"></el-table-column>
					<el-table-column align="center" label="体积" width="100" prop="planVolume"></el-table-column>
					<el-table-column align="center" label="计重(KG)" prop="planChargeWeight" width="100"></el-table-column>
				</el-table-column>
				<el-table-column align="center" label="实际信息">
					<el-table-column align="center" label="件数" width="100">
						<template slot-scope="scope">
							<span v-if="confirmRedCount(scope.row,'pieces')" style="color: red;">{{scope.row.confirmPieces}}</span>
							<span v-else>{{scope.row.confirmPieces}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="毛重" width="100">
						<template slot-scope="scope">
							<span v-if="confirmRedCount(scope.row,'weight')" style="color: red;">{{scope.row.confirmWeight}}</span>
							<span v-else>{{scope.row.confirmWeight}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="体积" width="100">
						<template slot-scope="scope">
							<span v-if="confirmRedCount(scope.row,'volume')" style="color: red;">{{scope.row.confirmVolume}}</span>
							<span v-else>{{scope.row.confirmVolume}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="计重(KG)" width="100">
						<template slot-scope="scope">
							<span v-if="confirmRedCount(scope.row,'chargeWeight')" style="color: red;">{{scope.row.confirmChargeWeight}}</span>
							<span v-else>{{scope.row.confirmChargeWeight}}</span>
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<el-row style="margin-top: 10px;">
				<el-button type="primary" size="small" @click="submit">保存</el-button>
				<el-button type="primary" size="small" @click="handleClose">取消</el-button>
			</el-row>
		</div>
	</el-dialog>
</template>

<script>
	import {
		orderDisplayRule
	} from "@/common/order/orderDisplayRule"
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
				query: {
					businessScope: 'AE',
					orderCode: '',
					awbNumber: '',
					flightDateStart: this.getDateTime(),
					flightDateEnd: '',
					customerNumber: '',
					noOrderIds: ''
				},
				serviceId: '',
				serviceName: '',
				loading: false,
				businessCodes: [],
				services: [],
				multipleSelection: []
			}
		},
		inject: ['orderListCallback'],
		methods: {
			findList() {
				this.loading = true
				if (this.query.businessScope.startsWith('A')) {
					this.query.noOrderIds = this.frow.noOrder.A
				} else if (this.query.businessScope.startsWith('S')) {
					this.query.noOrderIds = this.frow.noOrder.S
				} else if (this.query.businessScope.startsWith('T')) {
					this.query.noOrderIds = this.frow.noOrder.T
				} else if (this.query.businessScope.startsWith('L')) {
					this.query.noOrderIds = this.frow.noOrder.L
				}
				this.$axios.get2("/sc/vlOrder/getOrderList", this.query)
					.then((response) => {
						if (response.data.code == 0) {
							this.data = response.data.data;
						} else {
							this.openError(response.data.messageInfo)
						}
						this.loading = false
					}).catch((error) => {
						this.loading = false
						this.openError(error.response.data.messageInfo)
					})
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
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			formatQWF(row, column) {
				if (row[column.property]) {
					return row[column.property].toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
				} else {
					return ''
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			submit() {
				if (this.multipleSelection.length == 0) {
					this.openError("请勾选订单")
					return
				}
				if (!this.serviceId) {
					this.openError("请选择默认分摊服务")
					return
				}
				this.orderListCallback({
					orderList: this.multipleSelection,
					serviceId: this.serviceId,
					serviceName: this.serviceName
				})
				this.handleClose()
			},
			changeBusinessScope(val) {
				//查询服务
				this.serviceId = ''
				this.serviceName = ''
				this.$axios.get2('/afbase/service/queryList', {
					businessScope: val
				}).then((response) => {
					this.services = response.data.data
					let tempService = this.services.filter(service => service.serviceType == '支线')
					if (tempService.length > 0) {
						this.serviceId = tempService[0].serviceId
						this.serviceName = tempService[0].serviceType + ' - ' + tempService[0].serviceNameCn
					}
				})
				this.findList()
			},
			changeServiceId(val) {
				let servcie = this.services.filter(service => service.serviceId == val)[0]
				this.serviceName = servcie.serviceType + ' - ' + servcie.serviceNameCn
			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
				// _month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01";
			},
			headerCellStyle({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (this.query.businessScope == 'LC') {
					if ((rowIndex == 0 && columnIndex == 5) || (rowIndex == 1 && columnIndex == 0) || (rowIndex == 1 && columnIndex == 1) || (rowIndex == 1 && columnIndex == 2) || (rowIndex == 1 && columnIndex == 3)) {
						return 'background:#FDF5E6'
					}
					if ((rowIndex == 0 && columnIndex == 6) || (rowIndex == 1 && columnIndex == 4) || (rowIndex == 1 && columnIndex == 5) || (rowIndex == 1 && columnIndex == 6) || (rowIndex == 1 && columnIndex == 7)) {
						return 'background:#D2F4C0'
					}
				} else {
					if ((rowIndex == 0 && columnIndex == 6) || (rowIndex == 1 && columnIndex == 0) || (rowIndex == 1 && columnIndex == 1) || (rowIndex == 1 && columnIndex == 2) || (rowIndex == 1 && columnIndex == 3)) {
						return 'background:#FDF5E6'
					}
					if ((rowIndex == 0 && columnIndex == 7) || (rowIndex == 1 && columnIndex == 4) || (rowIndex == 1 && columnIndex == 5) || (rowIndex == 1 && columnIndex == 6) || (rowIndex == 1 && columnIndex == 7)) {
						return 'background:#D2F4C0'
					}
				}
			},
			confirmRedCount(row, flag) {
				if (flag == 'pieces') {
					return orderDisplayRule.checkPieces(row.planPieces, row.confirmPieces)
				} else if (flag == 'weight') {
					return orderDisplayRule.checkFlag(row.planWeight, row.confirmWeight)
				} else if (flag == 'chargeWeight') {
					return orderDisplayRule.checkFlag(row.planChargeWeight, row.confirmChargeWeight)
				} else if (flag == 'volume') {
					return orderDisplayRule.volumeFlag(row.planVolume, row.confirmVolume)
				}
			}
		},
		created() {
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then((response) => {
				this.businessCodes = response.data.data;
				if (this.businessCodes) {
					this.businessCodes = this.businessCodes.filter(businessScope => businessScope.paramText != 'VL')
				}
			})
			//查询服务
			this.changeBusinessScope('AE')
		}
	}
</script>
<style>
	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px;
	}

	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.vl_order_list_service .el-input-group__prepend {
		background-color: #fee1e3;
	}
</style>
