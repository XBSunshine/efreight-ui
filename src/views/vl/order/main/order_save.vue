<template>
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div class="vlOrderEditPage" style="width: 1280px;">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">派车单&nbsp;-&nbsp;新增</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
								<template slot="prepend">派车单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="coopName">
							<el-input class="widthWithTwoWithXing" readOnly v-model="ruleForm.coopName" style="width:615px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>车队</span>
								</template>
								<el-button slot="append" @click="selectCustomer" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="drivingTime">
							<el-input class="widthWithFourWithXing" style="width:295px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>用车时间</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.drivingTime" clearable type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择用车日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>始发城市</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.departureStation" @visible-change="blurDepartureStation" :filter-method="changeDepartureStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="item,index in departureStations" :key="index" :label="item.cityNameCn" :value="item.cityCode">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="showWordLimit" v-model="ruleForm.departureAddress" auto-complete="off" style="width:935px;" show-word-limit maxlength="200" clearable>
								<template slot="prepend">
									<span>始发地址</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input clearable auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>目的城市</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.arrivalStation" :filter-method="changeArrivalStation" @visible-change="blurArrivalStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="item,index in arrivalStations" :key="index" :label="item.cityNameCn" :value="item.cityCode">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="showWordLimit" v-model="ruleForm.arrivalAddress" auto-complete="off" style="width:935px;" show-word-limit maxlength="200" clearable>
								<template slot="prepend">
									<span>目的地址</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth vlOrderLinkTwoInput">
						<el-form-item prop="costPriceAmount">
							<el-input class="widthWithFourWithXing" auto-complete="off" style="width:191px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>运费成本</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.costCurrecnyCode" @change="changeCostCurrecnyCode" placeholder="请选择" style="width:94px;margin-right: -5px;">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</el-input>
							<el-input v-model="ruleForm.costPriceAmount" auto-complete="off" @input="formatToFloat('costPriceAmount')" maxlength="13" style="width:105px;margin-left: -5px;margin-right: 15px;" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="costPriceType">
							<el-input class="widthWithFourWithXing" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>成本形式</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.costPriceType" placeholder="请选择" style="width:198px;margin-right: -5px;" clearable>
									<el-option label="单价" value="单价"></el-option>
									<el-option label="总价" value="总价"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="costShareMethod">
							<el-input class="widthWithFourWithXing" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>分摊标准</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.costShareMethod" placeholder="请选择" style="width:198px;margin-right: -5px;" clearable>
									<el-option label="计重" value="计重"></el-option>
									<el-option label="订单" value="订单"></el-option>
									<el-option label="毛重" value="毛重"></el-option>
									<el-option label="体积" value="体积"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-button type="primary" size="mini" @click="countCostAmount">预计算分摊成本</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" style="width:245px;">
								<template slot="prepend">
									<span>车牌号</span>
								</template>
								<el-select @change="changeTruck" slot="suffix" v-model="ruleForm.truckId" placeholder="请选择" style="width:148px;margin-right: -5px;" clearable>
									<el-option v-for="item in trucks" :key="item.truckId" :label="item.truckNumber" :value="item.truckId">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-button type="primary" size="mini" style="padding: 7px 7px;margin-right: 25px;" @click="showTruckSave">新增</el-button>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.driverName" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>司机姓名</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.driverTel" style="width:615px;" clearable>
								<template slot="prepend">
									<span>司机电话</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="showWordLimit widthWithTwo" v-model="ruleForm.orderRemark" auto-complete="off" style="width:1255px;" show-word-limit maxlength="300" clearable>
								<template slot="prepend">
									<span>备注</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div style="padding:0px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-table :data="ruleForm.detailOrderList" stripe border style="width:1255px" :header-cell-style="headerCellStyle">
					<el-table-column align="center" width="90">
						<template slot="header" slot-scope="scope">
							<i class="iconfont el-icon-myyuanquanjiahao" @click="selectOrderList" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
						<template slot-scope="scope">
							<i class="iconfont el-icon-myjianhao" @click="deleteOrder(scope.$index)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
					</el-table-column>
					<el-table-column align="center" label="订单号" width="125" prop="orderCode"></el-table-column>
					<el-table-column align="center" label="提单号" width="120" prop="awbNumber"></el-table-column>
					<el-table-column align="center" label="客户单号" width="120" prop="customerNumber"></el-table-column>
					<el-table-column align="center" label="分摊成本">
						<el-table-column align="center" label="成本服务" width="180">
							<template slot-scope="scope">
								<el-select v-model="scope.row.serviceId" @change="changeServiceId(scope.row)" clearable placeholder="请选择" style="width:160px;">
									<el-option v-for="item in scope.row.services" :key="item.serviceId" :label="item.value" :value="item.serviceId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column align="center" label="分摊金额" width="160">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmountStr.indexOf('CNY')==-1" style="color: red;">{{scope.row.costAmountStr}}</span>
								<span v-else>{{scope.row.costAmountStr}}</span>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column align="center" label="预计信息">
						<el-table-column align="center" label="件数" width="110" prop="planPieces"></el-table-column>
						<el-table-column align="center" label="毛重" width="110" prop="planWeight"></el-table-column>
						<el-table-column align="center" label="体积" width="110" prop="planVolume"></el-table-column>
						<el-table-column align="center" label="计重(KG)" prop="planChargeWeight" width="110"></el-table-column>
					</el-table-column>
					<el-table-column align="center" label="实际信息">
						<el-table-column align="center" label="件数" width="110" prop="confirmPieces"></el-table-column>
						<el-table-column align="center" label="毛重" width="110" prop="confirmWeight"></el-table-column>
						<el-table-column align="center" label="体积" width="110" prop="confirmVolume"></el-table-column>
						<el-table-column align="center" label="计重(KG)" prop="confirmChargeWeight" width="110"></el-table-column>
					</el-table-column>
				</el-table>
				<div style="padding:10px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-form-item>
						<el-button :loading="loading" type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-row>
			</el-form>
			<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="ffrow"></customerSelect>
			<orderList ref="addMission" v-if="orderListVisible" :visible.sync="orderListVisible" :frow="ffrow"></orderList>
			<truckSave ref="addMission" v-if="truckSaveVisible" :visible.sync="truckSaveVisible"></truckSave>
		</div>
	</el-dialog>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
	import OrderList from '../other/order_selectOrder_list'
	import TruckSave from '../other/order_truck_save'
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
				helpDocumentUrl: '',
				departureStations: [],
				arrivalStations: [],
				currencyCodeOptions: [],
				trucks: [],
				shippingMethods: [],
				airportOptionsAll: [],
				servicesAE: [],
				servicesAI: [],
				servicesSE: [],
				servicesSI: [],
				servicesTE: [],
				servicesTI: [],
				servicesLC: [],
				customerSelectVisible: false,
				orderListVisible: false,
				truckSaveVisible: false,
				showFlag: false,
				ffrow: {},
				loading: false,
				ifFullscreen: false,
				style: {},
				ruleForm: {
					orderCode: '',
					coopName: '',
					coopId: '',
					customerNumber: '',
					drivingTime: '',
					departureStation: '',
					arrivalStation: '',
					departureAddress: '',
					arrivalAddress: '',
					costShareMethod: '计重',
					truckNumber: '',
					driverNumber: '',
					driverName: '',
					driverTel: '',
					costCurrecnyCode: '',
					truckId: '',
					orderRemark: '',
					costPriceAmount: '0',
					costPriceType: '总价',
					detailOrderList: []
				},
				rules: {
					coopName: [{
						required: true,
						message: '请选择客户',
						trigger: ['blur', 'change']
					}],
					drivingTime: [{
						required: true,
						message: '请选择用车日期',
						trigger: ['blur', 'change']
					}],
					costPriceAmount: [{
						required: true,
						message: '请录入运费成本',
						trigger: ['blur']
					}],
					costPriceType: [{
						required: true,
						message: '请选择成本形式',
						trigger: ['blur', 'change']
					}],
					costShareMethod: [{
						required: true,
						message: '请选择分摊标准',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['findByPage'],
		components: {
			CustomerSelect,
			OrderList,
			TruckSave
		},
		provide() {
			return {
				setValue: this.setCoop,
				orderListCallback: this.orderListCallback,
				truckCallback: this.truckCallback
			}
		},
		methods: {
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
			selectOrderList() {
				this.orderListVisible = true
				this.ffrow.noOrder = {
					A: this.ruleForm.detailOrderList.filter(order => order.businessScope.startsWith('A')).map(order => order.orderId).join(),
					S: this.ruleForm.detailOrderList.filter(order => order.businessScope.startsWith('S')).map(order => order.orderId).join(),
					T: this.ruleForm.detailOrderList.filter(order => order.businessScope.startsWith('T')).map(order => order.orderId).join(),
					L: this.ruleForm.detailOrderList.filter(order => order.businessScope.startsWith('L')).map(order => order.orderId).join()
				}
			},
			deleteOrder(index) {
				this.ruleForm.detailOrderList.splice(index, 1)
			},
			selectCustomer() {
				this.ffrow.businessScope = 'VL'
				this.customerSelectVisible = true
			},
			changeDepartureStation(val) {
				if (val) {
					this.ruleForm.departureStation = val.toUpperCase()
					this.departureStations = this.airportOptionsAll.filter(port => port.cityCode.indexOf(val.toUpperCase()) > -1 || port.cityNameCn.indexOf(val.toUpperCase()) > -1).slice(0, 20)
				} else {
					this.ruleForm.departureStation = ''
					this.departureStations = this.airportOptionsAll.slice(0, 20)
				}
			},
			changeArrivalStation(val) {
				if (val) {
					this.ruleForm.arrivalStation = val.toUpperCase()
					this.arrivalStations = this.airportOptionsAll.filter(port => port.cityCode.indexOf(val.toUpperCase()) > -1 || port.cityNameCn.indexOf(val.toUpperCase()) > -1).slice(0, 20)
				} else {
					this.ruleForm.arrivalStation = ''
					this.arrivalStations = this.airportOptionsAll.slice(0, 20)
				}
			},
			blurDepartureStation(param) {
				if (!param) {
					if (!this.airportOptionsAll.some(port => port.cityCode == this.ruleForm.departureStation)) {
						this.ruleForm.departureStation = ''
						this.departureStations = this.airportOptionsAll.slice(0, 20)
					}
				}
			},
			blurArrivalStation(param) {
				if (!param) {
					if (!this.airportOptionsAll.some(port => port.cityCode == this.ruleForm.arrivalStation)) {
						this.ruleForm.arrivalStation = ''
						this.arrivalStations = this.airportOptionsAll.slice(0, 20)
					}
				}
			},
			setCoop(row) {
				this.ruleForm.coopId = row.coopId;
				this.ruleForm.coopName = row.coopName;
			},
			submitForm(formName) {
				if (this.ruleForm.detailOrderList.length == 0) {
					this.openError("请选择订单")
					return
				}

				if (this.ruleForm.costPriceType == '单价') {
					this.ruleForm.costUnitprice = this.ruleForm.costPriceAmount
					this.ruleForm.costAmount = null
				} else if (this.ruleForm.costPriceType == '总价') {
					this.ruleForm.costAmount = this.ruleForm.costPriceAmount
					this.ruleForm.costUnitprice = null
				}

				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.post2('/sc/vlOrder', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.findByPage()
									this.openSuccess("保存成功")
									this.handleClose()
								} else {
									this.openError(response.data.messageInfo)
								}
								this.loading = false
							}).catch((error) => {
								this.openError(error.response.data.messageInfo)
								this.loading = false
							});
					}
				});
			},
			// 关闭
			handleClose() {
				if (this.ifFullscreen) {
					setTimeout(() => {
						let userAgent = navigator.userAgent;
						if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
							window.open('', '_self').close()
						} else {
							window.opener = null;
							window.open("about:blank", "_self");
							window.close();
						}
					}, 2000)
				} else {
					this.$emit('update:visible', false);
				}
			},
			formatToFloat(prop) {
				if (prop == 'costPriceAmount') {
					this.ruleForm.costPriceAmount = this.ruleForm.costPriceAmount.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.costPriceAmount.split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							this.ruleForm.costPriceAmount = "0." + t[1].substr(0, 2);
						} else {
							this.ruleForm.costPriceAmount = t[0].substr(0, 7) + "." + t[1].substr(0, 2);
						}
					} else if (this.ruleForm.costPriceAmount.startsWith("0")) {
						this.ruleForm.costPriceAmount = this.ruleForm.costPriceAmount.substr(0, 1)
					} else {
						this.ruleForm.costPriceAmount = this.ruleForm.costPriceAmount.substr(0, 7)
					}
				}
			},
			orderListCallback(row) {
				row.orderList.forEach(order => {
					this.ruleForm.detailOrderList.push({
						orderId: order.orderId,
						businessScope: order.businessScope,
						serviceId: row.serviceId,
						serviceName: row.serviceName,
						services: this['services' + order.businessScope],
						costAmount: '',
						costAmountStr: '',
						costCurrecnyCode: this.ruleForm.costCurrecnyCode,
						planPieces: order.planPieces,
						planWeight: order.planWeight,
						planVolume: order.planVolume,
						planChargeWeight: order.planChargeWeight,
						confirmPieces: order.confirmPieces,
						confirmWeight: order.confirmWeight,
						confirmVolume: order.confirmVolume,
						confirmChargeWeight: order.confirmChargeWeight,
						awbNumber: order.awbNumber,
						orderCode: order.orderCode,
						orderUuid: order.orderUuid,
						customerNumber: order.customerNumber
					})
				})
			},
			showTruckSave() {
				this.truckSaveVisible = true
			},
			truckCallback() {
				this.$axios.get('/sc/lcTruck').then((response) => {
					this.trucks = response.data.data;
				})
			},
			changeTruck(val) {
				if (val) {
					this.ruleForm.driverName = this.trucks.filter(truck => truck.truckId == val)[0].driverName
					this.ruleForm.driverTel = this.trucks.filter(truck => truck.truckId == val)[0].driverTel
				}
			},
			changeCostCurrecnyCode(val) {
				this.ruleForm.detailOrderList.forEach(order => {
					order.costCurrecnyCode = val
				})
			},
			changeServiceId(row) {
				let servcie = row.services.filter(service => service.serviceId == row.serviceId)[0]
				row.serviceName = servcie.serviceType + ' - ' + servcie.serviceNameCn
			},
			countCostAmount() {
				let count = 0
				this.$refs['ruleForm'].validateField(['costPriceAmount', 'costPriceType', 'costShareMethod'], (valid) => {
					if (!valid) {
						count++
					}
					if (count === 3) {
						if (this.ruleForm.costPriceType == '单价') {
							this.ruleForm.detailOrderList.forEach(order => {
								if (this.ruleForm.costShareMethod == '计重') {
									let chargeWeight = order.confirmChargeWeight == null ? (order.planChargeWeight == null ? 0 : order.planChargeWeight) : order.confirmChargeWeight
									order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') * chargeWeight).toFixed(2)
									order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') * chargeWeight).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
								} else if (this.ruleForm.costShareMethod == '订单') {
									order.costAmount = this.ruleForm.costPriceAmount
									order.costAmountStr = this.ruleForm.costPriceAmount + '(' + this.ruleForm.costCurrecnyCode + ')'
								} else if (this.ruleForm.costShareMethod == '毛重') {
									let weight = order.confirmWeight == null ? (order.planWeight == null ? 0 : order.planWeight) : order.confirmWeight
									order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') * weight).toFixed(2)
									order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') * weight).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
								} else if (this.ruleForm.costShareMethod == '体积') {
									let volume = order.confirmVolume == null ? (order.planVolume == null ? 0 : order.planVolume) : order.confirmVolume
									order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') * volume).toFixed(2)
									order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') * volume).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
								}
							})
						} else if (this.ruleForm.costPriceType == '总价') {
							//求和
							let sum = 0
							this.ruleForm.detailOrderList.forEach(order => {
								if (this.ruleForm.costShareMethod == '计重') {
									let chargeWeight = order.confirmChargeWeight == null ? (order.planChargeWeight == null ? 0 : order.planChargeWeight) : order.confirmChargeWeight
									sum += chargeWeight
								} else if (this.ruleForm.costShareMethod == '订单') {
									sum++
								} else if (this.ruleForm.costShareMethod == '毛重') {
									let weight = order.confirmWeight == null ? (order.planWeight == null ? 0 : order.planWeight) : order.confirmWeight
									sum += weight
								} else if (this.ruleForm.costShareMethod == '体积') {
									let volume = order.confirmVolume == null ? (order.planVolume == null ? 0 : order.planVolume) : order.confirmVolume
									sum += volume
								}

							})
							let sumCostAmout = 0
							this.ruleForm.detailOrderList.forEach((order, index) => {
								if (index === this.ruleForm.detailOrderList.length - 1) {
									order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') - sumCostAmout).toFixed(2)
									order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') - sumCostAmout).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
								} else {
									if (this.ruleForm.costShareMethod == '计重') {
										let chargeWeight = order.confirmChargeWeight == null ? (order.planChargeWeight == null ? 0 : order.planChargeWeight) : order.confirmChargeWeight
										if (sum === 0) {
											order.costAmount = 0
											order.costAmountStr = '0(' + this.ruleForm.costCurrecnyCode + ')'
										} else {
											order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') * chargeWeight / sum).toFixed(2)
											order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') * chargeWeight / sum).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
											sumCostAmout += parseFloat((parseFloat(this.ruleForm.costPriceAmount + '') * chargeWeight / sum).toFixed(2))
										}
									} else if (this.ruleForm.costShareMethod == '订单') {
										order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') / sum).toFixed(2)
										order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') / sum).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
										sumCostAmout += parseFloat((parseFloat(this.ruleForm.costPriceAmount + '') / sum).toFixed(2))
									} else if (this.ruleForm.costShareMethod == '毛重') {
										let weight = order.confirmWeight == null ? (order.planWeight == null ? 0 : order.planWeight) : order.confirmWeight
										if (sum === 0) {
											order.costAmount = 0
											order.costAmountStr = '0(' + this.ruleForm.costCurrecnyCode + ')'
										} else {
											order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') * weight / sum).toFixed(2)
											order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') * weight / sum).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
											sumCostAmout += parseFloat((parseFloat(this.ruleForm.costPriceAmount + '') * weight / sum).toFixed(2))
										}
									} else if (this.ruleForm.costShareMethod == '体积') {
										let volume = order.confirmVolume == null ? (order.planVolume == null ? 0 : order.planVolume) : order.confirmVolume
										if (sum === 0) {
											order.costAmount = 0
											order.costAmountStr = '0(' + this.ruleForm.costCurrecnyCode + ')'
										} else {
											order.costAmount = (parseFloat(this.ruleForm.costPriceAmount + '') * volume / sum).toFixed(2)
											order.costAmountStr = (parseFloat(this.ruleForm.costPriceAmount + '') * volume / sum).toFixed(2) + '(' + this.ruleForm.costCurrecnyCode + ')'
											sumCostAmout += parseFloat((parseFloat(this.ruleForm.costPriceAmount + '') * volume / sum).toFixed(2))
										}
									}
								}
							})
						}
					}
				})

			},
			headerCellStyle({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if ((rowIndex == 0 && columnIndex == 4) || (rowIndex == 1 && columnIndex == 0) || (rowIndex == 1 && columnIndex == 1)) {
					return 'background:#fee1e3'
				}
				if ((rowIndex == 0 && columnIndex == 5) || (rowIndex == 1 && columnIndex == 2) || (rowIndex == 1 && columnIndex == 3) || (rowIndex == 1 && columnIndex == 4) || (rowIndex == 1 && columnIndex == 5)) {
					return 'background:#FDF5E6'
				}
				if ((rowIndex == 0 && columnIndex == 6) || (rowIndex == 1 && columnIndex == 6) || (rowIndex == 1 && columnIndex == 7) || (rowIndex == 1 && columnIndex == 8) || (rowIndex == 1 && columnIndex == 9)) {
					return 'background:#D2F4C0'
				}
			}
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.$axios.get('/hrs/permission/' + 434).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get2('/sc/afVprmCoop/list', {
				coopType: '互为代理,海外代理',
				businessScope: 'VL'
			}).then(function(response) {
				if (response.data.code == 0 && response.data.data.length === 1) {
					this.setCoop(response.data.data[0]);
				}
			}.bind(this));
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				if (this.currencyCodeOptions) {
					this.ruleForm.costCurrecnyCode = 'CNY';
				}
			}.bind(this));

			this.$axios.get('/afbase/airport/city').then((response) => {
				this.airportOptionsAll = response.data.data;
				this.departureStations = this.airportOptionsAll.slice(0, 20);
				this.arrivalStations = this.airportOptionsAll.slice(0, 20);
			})

			this.$axios.get('/sc/lcTruck').then((response) => {
				this.trucks = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'AE'
			}).then((response) => {
				this.servicesAE = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'AI'
			}).then((response) => {
				this.servicesAI = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'SE'
			}).then((response) => {
				this.servicesSE = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'SI'
			}).then((response) => {
				this.servicesSI = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'TE'
			}).then((response) => {
				this.servicesTE = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'TI'
			}).then((response) => {
				this.servicesTI = response.data.data;
			})
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'LC'
			}).then((response) => {
				this.servicesLC = response.data.data;
			})
		}
	}
</script>
<style>
	.vlOrderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.vlOrderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.vlOrderLinkTwoInput .el-form-item__error {
		margin-top: 6px !important;
		margin-left: 150px;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.vlOrderLinkTwoInput .el-form-item__content {
		line-height: 30px !important;
	}
</style>
