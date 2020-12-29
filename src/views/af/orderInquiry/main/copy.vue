<template>
	<el-dialog title="" width="975px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<div class="orderInquireCopyPage">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">空运出口询价单 - 复制</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
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
							<el-input class="widthWithThree" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>始发港</span>
								</template>
								<el-select slot="suffix" :filter-method="changeDepartureStation" filterable @visible-change="airportOptions = airportOptionsAll.slice(0, 30)" v-model="ruleForm.departureStation" placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="item in airportOptions" :key="item.code" :label="item.code" :value="item.code">
										<span>{{item.code}}&nbsp;-&nbsp;{{item.label.split(',')[1]}}&nbsp;-{{item.label.split('-')[1].split(',')[0]}}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="arrivalStation">
							<el-input class="widthWithThreeWithXing" style="width:295px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>目的港</span>
								</template>
								<el-select slot="suffix" :filter-method="changeDepartureStation" filterable @visible-change="airportOptions = airportOptionsAll.slice(0, 30)" v-model="ruleForm.arrivalStation" clearable placeholder="请选择" style="width:112px;margin-right: -5px;">
									<el-option v-for="item in airportOptions" :key="item.code" :label="item.code" :value="item.code">
										<span>{{item.code}}&nbsp;-&nbsp;{{item.label.split(',')[1]}}&nbsp;-{{item.label.split('-')[1].split(',')[0]}}</span>
									</el-option>
								</el-select>
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
										<span>{{item.carrierName.split(',')[0]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.carrierName.split(',')[1]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.carrierName.split(',')[2]}}</span>
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
							<el-input v-model="ruleForm.flightRemark" placeholder="请输入转运时间要求" maxlength="100" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">时间要求</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="planPieces">
							<el-input class="widthWithTwoWithXing" @change="ruleForm.planPieces=strTrim(ruleForm.planPieces)" @input="formatToFloat('planPieces')" maxlength="8" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
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
						<el-form-item prop="planWeight">
							<el-input class="widthWithTwoWithXing" @change="setPlanChargeWeight" @input="formatToFloat('planWeight')" maxlength="8" v-model="ruleForm.planWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>毛重</span>
								</template>
								<el-select slot="append" v-model="ruleForm.overWeight" clearable style="width:85px;color: red;">
									<el-option label="超重" value="超重">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="planVolume">
							<el-input class="widthWithTwoWithXing" @change="setPlanChargeWeight" @input="formatToFloat('planVolume')" maxlength="8" v-model="ruleForm.planVolume" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
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
								<el-button slot="append" @click="gotoSizePage" icon="el-icon-edit"></el-button>
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
								<el-select slot="append" v-model="ruleForm.goodsType" clearable style="width:85px;background-color:#FFF;color: #606266;height: 28px;margin-top: -5px;">
									<el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="goodsNameCn">
							<el-input class="widthWithFourWithXing" v-model="ruleForm.goodsNameCn" show-word-limit maxlength="200" auto-complete="off" clearable style="width:615px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
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
								<el-select slot="append" v-model="planPriceType" placeholder="请选择" style="width:85px;background-color:#FFF;color: #606266;height: 28px;margin-top: -5px;">
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
								<el-button slot="append" @click="selectInquiryAgent" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item>
						<el-button :loading="loading" type="primary" size="small" @click="submitForm('ruleForm')">复制并询价</el-button>
					</el-form-item>
				</el-row>
			</el-form>
			<inquiryAgent ref="addMission" v-if="inquiryAgentVisible" :visible.sync="inquiryAgentVisible" :frow="ffrow"></inquiryAgent>
			<size ref="addMission" v-if="sizeVisible" :visible.sync="sizeVisible" :frow="ffrow"></size>
		</div>

	</el-dialog>
</template>
<script>
	import InquiryAgent from '../other/inquiry_agent_select'
	import Size from '@/views/public/size_edit'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			var checkPlanPieces = (rule, value, callback) => {
				let regE = /^[1-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位大于0的整数'));
				} else {
					callback();
				}
			};
			return {
				loading: false,
				planPrice: '',
				planPriceType: '',
				carriers: [],
				carrierCode: [],
				packageTypeOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				airportOptionsAll: [],
				airportOptions: [],
				ffrow: {},
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
				helpDocumentUrl: '',
				sizeVisible: false,
				inquiryAgentVisible: false,
				rules: {
					planPieces: [{
							required: true,
							message: '请录入件数',
							trigger: ['blur']
						},
						{
							validator: checkPlanPieces,
							trigger: ['blur']
						}
					],
					planWeight: [{
						required: true,
						message: '请录入毛重',
						trigger: ['blur']
					}],
					planVolume: [{
						required: true,
						message: '请录入体积',
						trigger: ['blur']
					}],
					goodsNameCn: [{
						required: true,
						message: '请录入中文品名',
						trigger: ['blur']
					}],
					arrivalStation: [{
						required: true,
						message: '请输入目的港',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['findByPage', 'ifShareQrcode'],
		components: {
			'inquiryAgent': InquiryAgent,
			'size': Size
		},
		provide() {
			return {
				sizeEditCallBack: this.sizeEditCallBack,
				selectInquiryAgentCallback: this.selectInquiryAgentCallback
			}
		},
		methods: {
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
			submitForm(formName) {
				this.loading = true
				this.ruleForm.carrierCode = this.carrierCode.join()
				if (this.planPriceType == '总价') {
					this.ruleForm.planAmount = this.planPrice
					this.ruleForm.planUnitprice = ''
				} else if (this.planPriceType == '单价') {
					this.ruleForm.planAmount = ''
					this.ruleForm.planUnitprice = this.planPrice
				} else {
					this.openError('请选择价格预期类型')
					this.loading = false
					return
				}
				if (this.ruleForm.overSize && (this.ruleForm.planDimensions === '' || this.ruleForm.planDimensions == null)) {
					this.openError('请录入尺寸')
					this.loading = false
					return
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.ruleForm.planDensity == null || this.ruleForm.planDensity === '') {
							this.ruleForm.planDensity = 0
						}
						if (parseFloat(this.ruleForm.planWeight) / parseInt(this.ruleForm.planPieces) >= 1000 && this.ruleForm.overWeight != '超重') {
							this.$confirm('该货物是否超重?', '提示', {
								confirmButtonText: '是',
								cancelButtonText: '否',
								type: 'warning',
								center: true
							}).then(() => {
								this.ruleForm.overWeight = '超重'
								this.$axios.post2('/afbase/orderInquiry', this.ruleForm)
									.then((response) => {
										if (response.data.code == 0) {
											this.openSuccess('保存成功');
											this.findByPage();
											this.handleClose();
											this.ifShareQrcode(response.data.data)
										} else {
											this.openError(response.data.messageInfo);
										}
										this.loading = false
									}).catch((error) => {
										this.loading = false
										let errorinfo = error.response.data.messageInfo;
										this.openError(errorinfo);
									})
							}).catch(() => {
								this.$axios.post2('/afbase/orderInquiry', this.ruleForm)
									.then((response) => {
										if (response.data.code == 0) {
											this.openSuccess('保存成功');
											this.findByPage();
											this.handleClose();
											this.ifShareQrcode(response.data.data)
										} else {
											this.openError(response.data.messageInfo);
										}
										this.loading = false
									}).catch((error) => {
										this.loading = false
										let errorinfo = error.response.data.messageInfo;
										this.openError(errorinfo);
									})
							})
						} else {
							this.$axios.post2('/afbase/orderInquiry', this.ruleForm)
								.then((response) => {
									if (response.data.code == 0) {
										this.openSuccess('保存成功');
										this.findByPage();
										this.handleClose();
										this.ifShareQrcode(response.data.data)
									} else {
										this.openError(response.data.messageInfo);
									}
									this.loading = false
								}).catch((error) => {
									this.loading = false
									let errorinfo = error.response.data.messageInfo;
									this.openError(errorinfo);
								})
						}
					} else {
						this.loading = false
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
			sizeEditCallBack(row) {
				this.ruleForm.planDimensions = row.value
				this.ruleForm.planPieces = row.pieces
				this.ruleForm.planVolume = row.volume / 1000000
				this.setPlanChargeWeight()
				this.ruleForm.planVolume = (row.volume / 1000000).toFixed(3);
				if (this.ruleForm.planDimensions) {
					if (this.ruleForm.planDimensions.split(";").some(row => parseFloat(row.split("*")[0]) >= 300 || parseFloat(row.split("*")[1]) >= 300 || parseFloat(row.split("*")[2]) >= 150) && this.ruleForm.overSize != '超尺') {
						this.$confirm('该货物是否超尺?', '提示', {
							confirmButtonText: '是',
							cancelButtonText: '否',
							type: 'warning',
							center: true
						}).then(() => {
							this.ruleForm.overSize = '超尺'
						}).catch(() => {})
					}
				}
			},
			setPlanChargeWeight() {
				let planChargeWeight = this.ruleForm.planVolume * 1000000 / 6000;
				if (this.ruleForm.planWeight > planChargeWeight) {
					this.ruleForm.planChargeWeight = this.ruleForm.planWeight;
				} else {
					this.ruleForm.planChargeWeight = planChargeWeight.toFixed(1);
				}
				if (this.ruleForm.planVolume != null && this.ruleForm.planVolume !== '' && parseFloat(this.ruleForm.planVolume + '') != 0 && this.ruleForm.planWeight != null && this.ruleForm.planWeight !== '') {
					this.ruleForm.planDensity = parseFloat(this.ruleForm.planWeight + '') / parseFloat(this.ruleForm.planVolume + '') + ''
					if (this.ruleForm.planDensity.indexOf('e') > -1) {
						this.ruleForm.planDensity = 0
					} else {
						this.ruleForm.planDensity = this.ruleForm.planDensity.split('.')[0]
					}
				} else {
					this.ruleForm.planDensity = ''
				}
			},
			gotoSizePage() {
				this.ffrow.planDimensions = this.ruleForm.planDimensions;
				this.ffrow.position = '询价单'
				this.sizeVisible = true;
			},
			selectInquiryAgent() {
				this.ffrow.carrierCode = this.carrierCode
				this.ffrow.arrivalStation = this.ruleForm.arrivalStation
				this.ffrow.departureStation = this.ruleForm.departureStation
				this.inquiryAgentVisible = true
			},
			selectInquiryAgentCallback(val) {
				this.ruleForm.inquiryAgentIds = val.inquiryAgentIds
				this.ruleForm.inquiryAgentNames = val.inquiryAgentNames
			},
			changeDepartureStation(val) {
				if (val) {
					this.airportOptions = this.airportOptionsAll.filter(port => port.code.indexOf(val.toUpperCase()) > -1 || port.label.indexOf(
						val.toUpperCase()) > -1).slice(0, 20)
				} else {
					this.airportOptions = this.airportOptionsAll.slice(0, 20)
				}
			},
			view(id) {
				this.$axios.get('/afbase/orderInquiry/' + this.frow.orderInquiryId)
					.then((response) => {
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
						this.ruleForm.orderInquiryCode = ''
						this.ruleForm.orderId = ''
						this.ruleForm.orderUuid = ''

					});
			}
		},
		created() {
			this.$axios.get('/hrs/permission/' + 257).then((response) => {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			});
			this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
				this.goodsTypeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=电池情况').then(function(response) {
				this.batteryTypeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=包装类型').then(function(response) {
				this.packageTypeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/carrier/getCarrierList').then((response) => {
				this.carriers = response.data.data;
			});
			this.$axios.post('/prm/inquiryAgent/selectAirport').then((response) => {
				this.airportOptionsAll = response.data.data.dataList;
				this.airportOptions = this.airportOptionsAll.slice(0, 20);
			});

			this.view(this.frow.orderInquiryId)
		}
	}
</script>
<style>
	.orderInquireCopyPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderInquireCopyPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
</style>
