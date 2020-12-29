<template>
	<el-dialog title="空运出口报价方案" :fullscreen="ifFullscreen" width="1220px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div v-loading="pageLoading" class="inquireQuotationEditPage" style="margin: 0 auto;width: 1200px;">
			<span style="margin-left: 60px;">询价信息</span>
			<el-button type="text" size="small" v-if=showInquiryFlag v-on:click="showInquiryFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
			<el-button type="text" size="small" v-if=!showInquiryFlag v-on:click="showInquiryFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
			<div v-if="showInquiryFlag" style="margin: 0 auto;width: 975px;">
				<el-form disabled :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="ruleForm.orderInquiryCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
									<template slot="prepend">询价单号</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithThree" v-model="ruleForm.departureStation" @input="ruleForm.departureStation=ruleForm.departureStation.toUpperCase()" maxlength="3" auto-complete="off" style="width:295px;margin-right: 15px;">
									<template slot="prepend">始发港</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithThree" maxlength="3" v-model="ruleForm.arrivalStation" @input="ruleForm.arrivalStation=ruleForm.arrivalStation.toUpperCase()" auto-complete="off" style="width:295px;" clearable>
									<template slot="prepend">
										<span>目的港</span>
									</template>
									<el-select slot="append" v-model="ruleForm.directFlight" clearable style="width:85px;color: red;">
										<el-option label="直飞" value="直飞"></el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span>航司偏好</span>
									</template>
									<el-select slot="suffix" v-model="carrierCode" multiple filterable allow-create placeholder="请选择" style="width:198px;margin-right: -5px;">
										<el-option v-for="item in carriers" :key="item.value" :label="item.carrierCode" :value="item.carrierCode">
											<span>{{item.carrierName}}</span>
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span>货好日期</span>
									</template>
									<el-date-picker slot="suffix" v-model="ruleForm.expectDeparture" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择货好日期" style="width: 198px;margin-right: -5px;">
									</el-date-picker>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="ruleForm.flightRemark" auto-complete="off" style="width:295px;" clearable>
									<template slot="prepend">时间要求</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithTwo" @change="ruleForm.planPieces=strTrim(ruleForm.planPieces)" @input="formatToFloat('planPieces')" maxlength="8" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
									<template slot="prepend">
										<span>件数</span>
									</template>
									<el-select slot="append" v-model="ruleForm.packageType" clearable placeholder="包装" style="width:85px;">
										<el-option v-for="item in packageTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithTwo" v-model="ruleForm.planWeight" style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span>毛重</span>
									</template>
									<el-select slot="append" v-model="ruleForm.overWeight" style="width:85px;color: red;">
										<el-option label="超重" value="超重">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithTwo" v-model="ruleForm.planVolume" style="width:295px;">
									<template slot="prepend">
										<span>体积</span>
									</template>
									<el-select slot="append" v-model="ruleForm.overSize" clearable style="width:85px;color: red;">
										<el-option label="超尺" value="超尺">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithFourWithXG" v-model="ruleForm.planChargeWeight" disabled auto-complete="off" style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span>计重/密度</span>
									</template>
									<el-input slot="suffix" v-model="ruleForm.planDensity" auto-complete="off" style="width:87px;margin-right: -5px;" disabled>
									</el-input>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithTwo" v-model="ruleForm.planDimensions" auto-complete="off" style="width:615px;" readOnly>
									<template slot="prepend">
										<span>尺寸</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span>货物类型</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.batteryType" clearable placeholder="请选择" style="width:112px;margin-right: -5px;">
										<el-option v-for="item in batteryTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
									<el-select slot="append" v-model="ruleForm.goodsType" clearable style="width:85px;color: #606266;height: 28px;margin-top: -5px;">
										<el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithFour" v-model="ruleForm.goodsNameCn" show-word-limit maxlength="200" auto-complete="off" clearable style="width:615px;">
									<template slot="prepend">
										<span>中文品名</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="planPrice" @input="formatToFloat('planPrice')" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
									<template slot="prepend">
										<span>价格预期</span>
									</template>
									<el-select slot="append" v-model="planPriceType" clearable placeholder="请选择" style="width:85px;color: #606266;height: 28px;margin-top: -5px;">
										<el-option label="单价" value="单价">
										</el-option>
										<el-option label="总价" value="总价">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithTwo" v-model="ruleForm.inquiryRemark" auto-complete="off" style="width:615px" clearable show-word-limit maxlength="200">
									<template slot="prepend">
										<span>备注</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input readOnly v-model="ruleForm.inquiryAgentNames" style="width:935px;">
									<template slot="prepend">
										<span>询盘代理</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<br />
			<span style="margin-left: 60px;">报价信息</span>
			<el-button type="text" size="small" v-if=showQuotationFlag v-on:click="showQuotationFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
			<el-button type="text" size="small" v-if=!showQuotationFlag v-on:click="showQuotationFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
      &nbsp;&nbsp;<el-checkbox v-model="ifDelete" @change="deleteChange">显示删除的报价方案</el-checkbox>
			<div v-if="showQuotationFlag" style="margin: 0 auto;width: 1150px;">
				<el-form :inline="true" class="demo-ruleForm">
					<el-table :data="orderInquiryQuotations" style="width: 1150px;" :row-class-name="tableRowClassName">
						<el-table-column fixed width="40" align="center">
							<template slot-scope="scope">
								<el-checkbox :disabled="ruleForm.orderInquiryStatus=='已转订单'||ruleForm.orderInquiryStatus=='已关闭'" v-model="scope.row.quotationSelected" @change="handleSelectionChange(scope.$index,scope.row.quotationSelected)" v-if="scope.row.isValid"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column fixed width="40" align="center" v-if="!(ruleForm.orderInquiryStatus=='已转订单'||ruleForm.orderInquiryStatus=='已关闭')">
							<template slot="header">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;" v-if="scope.row.isValid"></i>
							</template>
						</el-table-column>
						<el-table-column label="报价公司" align="center" width="100">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.quotationCompanyName" style="width: 95px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="航司" align="center" width="65">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.carrierCode" @input="scope.row.carrierCode = scope.row.carrierCode.toUpperCase()" maxlength="2"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="始发港" align="center" width="64">
							<template slot-scope="scope">
								<el-input disabled style="width: 58px;" size="small" v-model="scope.row.departureStation" @input="scope.row.departureStation = scope.row.departureStation.toUpperCase()" maxlength="3"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="中转港" align="center" width="64">
							<template slot-scope="scope">
								<el-input disabled style="width: 58px;" size="small" v-model="scope.row.transitStation" @input="scope.row.transitStation = scope.row.transitStation.toUpperCase()" maxlength="3"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="ETD" align="center" width="140">
							<template slot-scope="scope">
								<el-date-picker disabled v-model="scope.row.expectDeparture" clearable type="date" value-format="yyyy-MM-dd" style="width: 135px;"></el-date-picker>
							</template>
						</el-table-column>
						<el-table-column label="分批信息" align="center" width="135">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.batchRemark" style="width: 130px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column align="center" width="170">
							<template slot="header">
								<span style="color: red;">*</span>
								<span>价格</span>
							</template>
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.price" @input="checkFloat(scope.row,'price')" style="width: 75px;"></el-input>
								<el-select disabled v-model="scope.row.priceType" clearable placeholder="请选择" style="width: 80px;">
									<el-option label="单价" value="单价">
									</el-option>
									<el-option label="总价" value="总价">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="价格有效期" align="center" width="180">
							<template slot-scope="scope">
								<el-date-picker disabled v-model="scope.row.quotationEndDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:00" style="width: 175px;"></el-date-picker>
							</template>
						</el-table-column>
						<el-table-column label="重量等级" align="center" width="75">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.weightClass" style="width: 70px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="密度等级" align="center" width="75">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.densityClass" style="width: 70px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="备注" align="center" width="300">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.quotationRemark" style="width: 295px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="联系人" align="center" width="300">
							<template slot-scope="scope">
								<el-input disabled size="small" v-model="scope.row.quotationContacts" style="width: 295px;"></el-input>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
			</div>
			<el-row style="margin-top: 10px;">
				<el-button :loading="loading" type="primary" size="mini" @click="save" style="background-color:#FFF;color:#409EFF;">暂存</el-button>
				<el-button type="primary" size="mini" @click="turnToOrder">转订单</el-button>
			</el-row>
		</div>
		<afOrderSave ref="addMission" v-if="orderSaveVisible" :visible.sync="orderSaveVisible" :frow="ffrow"></afOrderSave>
	</el-dialog>
</template>
<script>
	import AfOrderSave from '../../order/af_order_base_save'
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
				pageLoading: false,
				loading: false,
				orderSaveVisible: false,
				showInquiryFlag: true,
				showQuotationFlag: true,
				planPrice: '',
				planPriceType: '',
				ffrow: {
					ifFullscreen: false,
					ifFromInquiry: true
				},
				ifFullscreen: false,
				style: {},
				carriers: [],
				carrierCode: [],
				packageTypeOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				ruleForm: {
					orderInquiryCode: '',
					departureStation: '',
					arrivalStation: '',
					directFlight: '',
					carrierCode: '',
					expectDeparture: '',
					flightRemark: '',
					planPieces: '',
					packageType: '',
					planWeight: '',
					overWeight: '',
					planVolume: '',
					overSize: '',
					planChargeWeight: '',
					planDensity: '',
					planDimensions: '',
					batteryType: '',
					goodsType: '',
					goodsNameCn: '',
					planAmount: '',
					planUnitprice: '',
					inquiryRemark: '',
					inquiryAgentIds: '',
					inquiryAgentNames: ''
				},
				orderInquiryQuotations: [],
        orderInquiryQuotationsForDelete: [],
        ifDelete: false,
			}
		},
		components: {
			'afOrderSave': AfOrderSave
		},
		inject: ['findByPage'],
		provide() {
			return {
				continueOperation: this.orderSaveCallBack
			}
		},
		methods: {
        tableRowClassName({row, rowIndex}) {
            return row.isValid ? '' : 'delete_color';
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
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			save() {
				this.loading = true
				if (this.orderInquiryQuotations.some(orderInquiryQuotation => orderInquiryQuotation.price == null || orderInquiryQuotation.price === '')) {
					this.openError('价格不能为空')
					this.loading = false
					return
				}
				let param = []
				if (this.orderInquiryQuotations.length == 0) {
					param.push({
						orderInquiryId: this.frow.orderInquiryId,
						rowUuid: this.ruleForm.rowUuid
					})
				} else {
					param = this.orderInquiryQuotations
					param[0].rowUuid = this.ruleForm.rowUuid
				}
				this.$axios.put('/afbase/orderInquiryQuotation', param)
					.then((response) => {
						if (response.data.code == 0) {
							this.openSuccess('保存成功');
							this.findByPage()
							if (localStorage.getItem("orderSaveClosePage") && localStorage.getItem("orderSaveClosePage") == 'true') {
								this.handleClose();
							}
						} else {
							this.openError(response.data.messageInfo);
						}
						this.loading = false
					}).catch((error) => {
						this.loading = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			orderSaveCallBack() {
				this.handleClose()
			},
			turnToOrder() {
				let buttonInfo = window.localStorage.getItem('buttonInfo')
				if (buttonInfo.indexOf('af-order-add') == -1) {
					this.openError("你没有空运出口订单新增权限，转订单失败，请联系管理员开通")
					return
				}
				if (this.ruleForm.orderInquiryStatus != '已创建') {
					this.openError('当前询价单状态为' + this.ruleForm.orderInquiryStatus + ',无法转单')
					return
				}
				if (this.orderInquiryQuotations.filter(orderInquiryQuotation => orderInquiryQuotation.quotationSelected).length == 0 || this.orderInquiryQuotations.filter(orderInquiryQuotation => orderInquiryQuotation.quotationSelected).length > 1) {
					this.openError('请选择一条报价方案')
					return
				}
				this.$confirm('是否确认转订单?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					let orderInquiryQuotation = this.orderInquiryQuotations.filter(orderInquiryQuotation => orderInquiryQuotation.quotationSelected)[0]
					let remark = orderInquiryQuotation.quotationCompanyName + ',' + orderInquiryQuotation.quotationContacts
					if (orderInquiryQuotation.batchRemark || orderInquiryQuotation.weightClass || orderInquiryQuotation.densityClass || orderInquiryQuotation.quotationRemark) {
						remark += '\n'
						if (orderInquiryQuotation.batchRemark) {
							remark += orderInquiryQuotation.batchRemark + ','
						}
						if (orderInquiryQuotation.weightClass) {
							remark += orderInquiryQuotation.weightClass + ','
						}
						if (orderInquiryQuotation.densityClass) {
							remark += '密度等级 : ' + orderInquiryQuotation.densityClass + ','
						}
						if (orderInquiryQuotation.quotationRemark) {
							remark += orderInquiryQuotation.quotationRemark
						}
						if (remark.endsWith(',')) {
							remark = remark.substr(0, remark.length - 1)
						}
					}

					let param = {
						flightNumber: orderInquiryQuotation.carrierCode,
						departureStation: orderInquiryQuotation.departureStation || this.ruleForm.departureStation,
						arrivalStation: this.ruleForm.arrivalStation,
						transitStation: orderInquiryQuotation.transitStation,
						planPieces: this.ruleForm.planPieces,
						planWeight: this.ruleForm.planWeight,
						planVolume: this.ruleForm.planVolume,
						expectDeparture: orderInquiryQuotation.expectDeparture || this.ruleForm.expectDeparture,
						planDimensions: this.ruleForm.planDimensions,
						batteryType: this.ruleForm.batteryType,
						goodsType: this.ruleForm.goodsType,
						goodsNameCn: this.ruleForm.goodsNameCn,
						price: orderInquiryQuotation.price || this.ruleForm.planPrice,
						priceType: orderInquiryQuotation.priceType || this.ruleForm.planPriceType,
						orderInquiryQuotationId: orderInquiryQuotation.orderInquiryQuotationId,
						orderInquiryId: orderInquiryQuotation.orderInquiryId,
						rowUuid: this.ruleForm.rowUuid,
						remark: remark
					}
					this.ffrow.inquiry = param
					this.orderSaveVisible = true
				}).catch(() => {

				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
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
			formatToFloat(item) {
				if (item == 'awbNumber') {
					this.ruleForm.awbNumber = this.ruleForm.awbNumber.replace(/[^0123456789.-]/g, "");
					var t = this.ruleForm.awbNumber.split('.');
					if (t.length > 1) {
						this.ruleForm.awbNumber = t[0];
					}
				} else if (item == 'planWeight') {
					this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, 1);
					}
				} else if (item == 'planVolume') {
					this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, 3);
					}
				} else if (item == 'planPrice') {
					this.planPrice = this.planPrice.replace(/[^0123456789.]/g, "");
					let t = this.planPrice.split('.');
					if (t.length > 1) {
						this.planPrice = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'planPieces') {
					this.ruleForm.planPieces = this.ruleForm.planPieces.replace(/[^0123456789]/g, "");
				}
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "")
				if (row[prop].startsWith('0')) {
					row[prop] = '0'
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if (t.length > 1) {
					row[prop] = t[0] + "." + t[1].substr(0, 1);
				} else {
					if (row[prop].startsWith('0')) {
						row[prop] = '0'
					}
				}
			},
			doDelete(index, row) {
				this.orderInquiryQuotations.splice(index, 1)
			},
			handleSelectionChange(index, val) {
				if (val) {
					if (this.orderInquiryQuotations.some(orderInquiryQuotation => orderInquiryQuotation.quotationSelected)) {
						this.orderInquiryQuotations.forEach(orderInquiryQuotation => {
							orderInquiryQuotation.quotationSelected = false
						})
						this.orderInquiryQuotations[index].quotationSelected = true
					}
				}
			},
			view(orderInquiryId) {
				this.pageLoading = true
				this.loading = true
				this.$axios.get('/afbase/orderInquiry/' + orderInquiryId)
					.then((response) => {
						if (response.data.code == 0) {
							this.ruleForm = response.data.data
							if (this.ruleForm.planAmount) {
								this.planPriceType = "总价";
								this.planPrice = this.ruleForm.planAmount;
							} else {
								this.planPriceType = "单价";
								this.planPrice = this.ruleForm.planUnitprice;
							}
							if (this.ruleForm.carrierCode) {
								this.carrierCode = this.ruleForm.carrierCode.split(",")
							}
							this.orderInquiryQuotations = response.data.data.orderInquiryQuotations
							this.orderInquiryQuotations.forEach(orderInquiryQuotation => {
								//封装价格
								if (orderInquiryQuotation.quotationAmount) {
									orderInquiryQuotation.price = orderInquiryQuotation.quotationAmount
									orderInquiryQuotation.priceType = '总价'
								} else if (orderInquiryQuotation.quotationUnitprice) {
									orderInquiryQuotation.price = orderInquiryQuotation.quotationUnitprice
									orderInquiryQuotation.priceType = '单价'
								}
							})
              this.orderInquiryQuotationsForDelete = this.orderInquiryQuotations;//保存所有数据包括有效的和无效的
              this.orderInquiryQuotations = this.orderInquiryQuotations.filter(orderInquiryQuotation => orderInquiryQuotation.isValid);
							this.pageLoading = false
							this.loading = false
						} else {
							this.pageLoading = false
							this.loading = false
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.pageLoading = false
						this.loading = false
						this.openError(error.response.data.messageInfo)
					})
			},
      deleteChange() {
          if(this.ifDelete){
              this.orderInquiryQuotations = this.orderInquiryQuotationsForDelete
          }else{
              this.orderInquiryQuotations = this.orderInquiryQuotationsForDelete.filter(orderInquiryQuotation => orderInquiryQuotation.isValid);
          }
      },
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.view(this.frow.orderInquiryId)
		},
	}
</script>
<style>
	.inquireQuotationEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.inquireQuotationEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
  .inquireQuotationEditPage .delete_color input {
    color: red !important;
  }
</style>
