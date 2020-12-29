<template>
	<el-dialog :visible="ifShow" title="空运出口报价单" fullscreen :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<div v-if="ifValid" class="inquireQuotationEditPage" style="margin: 0 auto;width: 1075px;">
			<span>询价信息</span>
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
					<!-- <el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input readOnly v-model="ruleForm.inquiryAgentNames" style="width:935px;">
									<template slot="prepend">
										<span>询盘代理</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row> -->
				</el-form>
			</div>
			<br />
			<span>报价信息</span>
			<el-button type="text" size="small" v-if=showQuotationFlag v-on:click="showQuotationFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
			<el-button type="text" size="small" v-if=!showQuotationFlag v-on:click="showQuotationFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
			<div v-show="showQuotationFlag" style="margin: 0 auto;width: 1075px;">
				<el-form :model="quotationRuleForm" :rules="rules" :inline="true" ref="quotationRuleForm" class="demo-ruleForm">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item prop="quotationCompanyName">
								<el-input class="widthWithFourWithXing" maxlength="100" v-model="quotationRuleForm.quotationCompanyName" auto-complete="off" placeholder="请输入报价公司名称" clearable style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span style="color: red;">*</span>
										<span>报价公司</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item prop="quotationContacts">
								<el-input class="widthWithFiveWithXing" maxlength="100" v-model="quotationRuleForm.quotationContacts" auto-complete="off" placeholder="请输入联系人姓名及电话" clearable style="width:385px;margin-right: 15px;">
									<template slot="prepend">
										<span style="color: red;">*</span>
										<span>联系人信息</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item prop="quotationEndDate">
								<el-input class="widthWithFiveWithXing" style="width:295px;">
									<template slot="prepend">
										<span style="color: red;">*</span>
										<span>价格有效期</span>
									</template>
									<el-date-picker class="quotationEndDateClass" slot="suffix" v-model="quotationRuleForm.quotationEndDate" clearable type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:00" placeholder="选择日期" style="width: 174px;margin-right: -5px;">
									</el-date-picker>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-table :data="orderInquiryQuotations" style="width: 1025px;">
						<el-table-column label="航司" align="center" width="65">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.carrierCode" @input="scope.row.carrierCode = scope.row.carrierCode.toUpperCase()" maxlength="2"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="始发港" align="center" width="64">
							<template slot-scope="scope">
								<el-input style="width: 58px;" size="small" v-model="scope.row.departureStation" @input="scope.row.departureStation = scope.row.departureStation.toUpperCase()" maxlength="3"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="中转港" align="center" width="64">
							<template slot-scope="scope">
								<el-input style="width: 58px;" size="small" v-model="scope.row.transitStation" @input="scope.row.transitStation = scope.row.transitStation.toUpperCase()" maxlength="3"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="ETD" align="center" width="140">
							<template slot-scope="scope">
								<el-date-picker v-model="scope.row.expectDeparture" clearable type="date" value-format="yyyy-MM-dd" style="width: 135px;"></el-date-picker>
							</template>
						</el-table-column>
						<el-table-column label="分批信息" align="center" width="135">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.batchRemark" maxlength="100" style="width: 130px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column align="center" width="170">
							<template slot="header">
								<span style="color: red;">*</span>
								<span>价格</span>
							</template>
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.price" maxlength="8" @input="checkFloat(scope.row,'price')" style="width: 75px;"></el-input>
								<el-select v-model="scope.row.priceType" placeholder="请选择" style="width: 80px;">
									<el-option label="单价" value="单价">
									</el-option>
									<el-option label="总价" value="总价">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="重量等级" align="center" width="75">
							<template slot-scope="scope">
								<el-input size="small" maxlength="20" v-model="scope.row.weightClass" style="width: 70px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="密度等级" align="center" width="75">
							<template slot-scope="scope">
								<el-input size="small" maxlength="20" v-model="scope.row.densityClass" style="width: 70px;"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="备注" align="center">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.quotationRemark" maxlength="200"></el-input>
							</template>
						</el-table-column>
						<el-table-column fixed width="60" align="center">
							<template slot="header">
								<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
							</template>
							<template slot-scope="scope">
								<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
			</div>
			<el-row>
				<el-button :loading="loading" type="primary" size="mini" @click="submitForm('quotationRuleForm')" style="margin-top: 10px;">报价</el-button>
			</el-row>
			<el-row type="flex" justify="center">
				<el-col class="elementWidth">
					<a href="http://www.efreight.cn/" target="_blank">
						<el-image :src="qr001" style="width: 140px;"></el-image>
					</a>
				</el-col>
			</el-row>
		</div>
		<div v-else style="margin:0 auto;width: 400px;height: 100px;">
			<font style="color: red;font-size: xx-large;font-weight: 700;">该询价已超时失效</font>
		</div>
	</el-dialog>
</template>
<script>
	import qr001 from "@/assets/images/qr001.png";
	export default {
		data() {
			return {
				qr001: qr001,
				ifShow: false,
				ifValid: true,
				loading: false,
				showInquiryFlag: true,
				showQuotationFlag: true,
				planPrice: '',
				planPriceType: '',
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
				quotationRuleForm: {
					quotationContacts: localStorage.getItem('access_token') ? (localStorage.getItem('nickname') + ' ' + localStorage.getItem('phoneNumber')) : '',
					quotationCompanyName: localStorage.getItem('orgName') || '',
					quotationEndDate: this.getDateTime(new Date())
				},
				rules: {
					quotationContacts: [{
						required: true,
						message: '请录入联系人信息',
						trigger: ['blur', 'change']
					}],
					quotationCompanyName: [{
						required: true,
						message: '请录入报价公司',
						trigger: ['blur', 'change']
					}],
					quotationEndDate: [{
						required: true,
						message: '请选择价格有效期',
						trigger: ['blur', 'change']
					}]
				}
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
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.orderInquiryQuotations.length == 0) {
							this.openError('报价单至少有一条记录')
							this.loading = false
							return
						}
						if (this.orderInquiryQuotations.some(orderInquiryQuotation => orderInquiryQuotation.price == null || orderInquiryQuotation.price === '')) {
							this.openError('价格不能为空')
							this.loading = false
							return
						}
						this.orderInquiryQuotations.forEach(orderInquiryQuotation => {
							//1.插入询价单id
							orderInquiryQuotation.orderInquiryId = this.ruleForm.orderInquiryId
							//2.插入报价公司、联系人信息、价格有效期
							orderInquiryQuotation.quotationContacts = this.quotationRuleForm.quotationContacts
							orderInquiryQuotation.quotationCompanyName = this.quotationRuleForm.quotationCompanyName
							orderInquiryQuotation.quotationEndDate = this.quotationRuleForm.quotationEndDate
							//3.封装价格
							if (orderInquiryQuotation.priceType == '总价') {
								orderInquiryQuotation.quotationAmount = orderInquiryQuotation.price
								orderInquiryQuotation.quotationUnitprice = ''
							} else if (orderInquiryQuotation.priceType == '单价') {
								orderInquiryQuotation.quotationAmount = ''
								orderInquiryQuotation.quotationUnitprice = orderInquiryQuotation.price
							}
						})

						this.$axios.post2('/afbase/external/orderInquiryQuotation', this.orderInquiryQuotations)
							.then((response) => {
								if (response.data.code == 0) {
									this.openSuccess('报价已收到，非常感谢，稍后我司业务人员会和你联系');
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
									this.loading = false
								}
							}).catch((error) => {
								this.loading = false
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							});
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
				setTimeout(() => {
					let userAgent = navigator.userAgent;
					if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
						window.location.href = "about:blank";
						window.close();
					} else if (userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
						if (userAgent.indexOf('Android') > -1) {
							document.addEventListener('WeixinJSBridgeReady', function() {
								WeixinJSBridge.call('closeWindow');
							}, false)
						} else {
							WeixinJSBridge.call('closeWindow')
						}
					} else {
						window.opener = null;
						window.open("about:blank", "_self")
						window.close();
					}
				}, 2000)
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
					row[prop] = t[0] + "." + t[1].substr(0, 2);
				} else {
					if (row[prop].startsWith('0')) {
						row[prop] = '0'
					}
				}
			},
			doAdd() {
				let j = {
					orderInquiryId: '',
					carrierCode: '',
					departureStation: '',
					transitStation: '',
					expectDeparture: '',
					batchRemark: '',
					price: '',
					priceType: '单价',
					weightClass: '',
					densityClass: '',
					quotationRemark: '',
					quotationAmount: '',
					quotationUnitprice: '',
					quotationContacts: '',
					quotationCompanyName: '',
					quotationEndDate: ''
				};
				this.orderInquiryQuotations.push(j);
			},
			doDelete(index, row) {
				this.orderInquiryQuotations.splice(index, 1)
			},
			view() {
				if (this.$route.query.orderInquiryUuid) {
					this.loading = true
					this.$axios.get('/afbase/external/orderInquiry/' + this.$route.query.orderInquiryUuid)
						.then((response) => {
							if (response.data.code == 0) {
								if (response.data.data == null) {
									this.loading = false
									this.ifShow = true
									this.ifValid = false
								} else {
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
									this.loading = false
									this.ifShow = true
									this.ifValid = true

									//根据航司偏好添加报价方案
									this.carrierCode.forEach(row => {
										this.orderInquiryQuotations.push({
											orderInquiryId: '',
											carrierCode: row,
											departureStation: this.ruleForm.departureStation,
											transitStation: '',
											expectDeparture: '',
											batchRemark: '',
											price: '',
											priceType: '单价',
											weightClass: '',
											densityClass: '',
											quotationRemark: '',
											quotationAmount: '',
											quotationUnitprice: '',
											quotationContacts: '',
											quotationCompanyName: '',
											quotationEndDate: ''
										});
									})
								}
							} else {
								this.loading = false
								this.ifShow = false
								this.openError(response.data.messageInfo)
							}
						}).catch((error) => {
							this.loading = false
							this.ifShow = false
							this.openError(error.response.data.messageInfo)
						})

				} else {
					this.ifShow = true
					this.ifValid = false
				}
			},
			getDateTime(theDate) {
				var _year = theDate.getFullYear()
				var _month = theDate.getMonth()
				var _date = theDate.getDate()
				var _hour = theDate.getHours()
				_hour = _hour + 5;
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				if (_hour < 10) {
					_hour = "0" + _hour;
				}
				return _year + "-" + _month + "-" + _date + " " + _hour + ":00:00";
			}
		},
		created() {
			this.view()
		}
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

	.quotationEndDateClass input {
		color: red !important;
	}
</style>
