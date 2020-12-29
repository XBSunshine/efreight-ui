<template>
	<el-dialog title="" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top: -80px;" show-close append-to-body>
		<div class="orderEditPage" style="width: 1280px;">
			<div style="margin-top: -15px;margin-bottom: 20px;margin-left: 15px;">
				<span style="font-size: large;margin-bottom: 20px;">舱单信息 - 修改</span>
				<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
				</el-link>
			</div>
			<el-container>
				<el-aside width="150px">
					<ul>
						<li style="margin-left: 30px;margin-bottom: 20px;">
							<span style="font-size: 16px;">主单：</span>
						</li>
						<li style="margin-left: 30px;margin-bottom: 20px;">
							<span v-if="!mawbChecked&&awbNumber===''" style="cursor: pointer;font-size: 15px;color: #409EFF;width:120px;display:inline-block;height: 20px;border: 1px solid #DCDFE6;border-radius: 4px;" @click="viewMawb">{{awbNumber}}</span>
							<span v-else-if="awbNumber===''" style="cursor: pointer;font-size: 15px;color: #409EFF;background-color: #7ed2df;display:inline-block;width:120px;height: 20px;border: 1px solid #DCDFE6;border-radius: 4px;" @click="viewMawb">{{awbNumber}}</span>
							<span v-else-if="mawbChecked" style="cursor: pointer;font-size: 15px;color: #409EFF;background-color: #7ed2df;" @click="viewMawb">{{awbNumber}}</span>
							<span v-else style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="viewMawb">{{awbNumber}}</span>
						</li>
						<li style="margin-left: 0px;margin-bottom: 20px;">
							<i class="iconfont el-icon-myyuanquanjiahao" style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="addHawb"></i>
							<span style="font-size: 16px;margin-left: 10px;">分单：</span>
						</li>
						<li v-for="(item,index) in hawbList" :key="index" style="margin-left: 0px;margin-bottom: 20px;">
							<i class="iconfont el-icon-myjianhao" @click="deleteHawb(index)" style="cursor: pointer;font-size: 15px;color: #409EFF;"></i>
							<span v-if="!item.hawbChecked&&item.hawbNumber===''" style="cursor: pointer;font-size: 15px;color: #409EFF;display:inline-block;margin-left: 10px; width:120px;height: 20px;border: 1px solid #DCDFE6;border-radius: 4px;" @click="viewHawb(index)">{{item.hawbNumber}}</span>
							<span v-if="item.hawbChecked&&item.hawbNumber===''" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 10px;background-color: #7ed2df;display:inline-block; width:120px;height: 20px;border: 1px solid #DCDFE6;border-radius: 4px;" @click="viewHawb(index)">{{item.hawbNumber}}</span>
							<span v-if="!item.hawbChecked&&item.hawbNumber!==''" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 10px; " @click="viewHawb(index)">{{item.hawbNumber}}</span>
							<span v-if="item.hawbChecked&&item.hawbNumber!==''" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 10px;background-color: #7ed2df;" @click="viewHawb(index)">{{item.hawbNumber}}</span>
						</li>
					</ul>
				</el-aside>
				<el-main style="overflow:hidden">
					<el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
						<el-row type="flex" justify="end" :gutter="100">
							<el-col v-show="ifHaveAwbNumberMake||ifHawbNumberMake" class="elementWidth" style="margin-left: 10px;margin-bottom: 10px;">
								<font style="font-size: medium;color: red;">系统检测到，{{ifHaveAwbNumberMake?'当前业务已制主单，':''}}{{ifHawbNumberMake?'当前业务已制分单，':''}}若主单或分单的制单信息有变，请到制单页面调整</font>
							</el-col>
							<el-col class="elementWidth" style="margin-bottom: 10px;">
								<font style="color: #409EFF;">提示：发送舱单必填项（红色星号<font style="color: red;">*</font>）</font>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" v-model="ruleForm.awbNumber" disabled style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>主运单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" v-model="ruleForm.hawbNumber" :disabled="mawbChecked" clearable auto-complete="off" maxlength="12" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>分运单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThreeWithXing" v-model="ruleForm.expectFlight" disabled style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>航班号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" style="width:250px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>航班日期</span>
										</template>
										<el-date-picker slot="suffix" v-model="ruleForm.expectDeparture" disabled type="date" value-format="yyyy-MM-dd" style="width: 153px;margin-right: -5px;">
										</el-date-picker>
									</el-input>
								</el-form-item>
							</el-col>

						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThreeWithXing" v-model="ruleForm.departureStation" disabled style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>始发港</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThreeWithXing" v-model="ruleForm.arrivalStation" clearable @change="ruleForm.arrivalStation=strTrim(ruleForm.arrivalStation).toUpperCase()" auto-complete="off" maxlength="4" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>目的港</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThree" v-model="ruleForm.transitStation" clearable @change="ruleForm.transitStation=strTrim(ruleForm.transitStation).toUpperCase()" auto-complete="off" maxlength="4" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<span>中转港</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" style="width:250px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>装载时间</span>
										</template>
										<el-date-picker slot="suffix" v-model="ruleForm.loadingDate" clearable type="datetime" value-format="yyyy-MM-dd HH:00:00" format="yyyyMMddHH" placeholder="选择装载时间" style="width: 153px;margin-right: -5px;">
										</el-date-picker>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithTwoWithXing" @change="ruleForm.planPieces=strTrim(ruleForm.planPieces)" @input="formatToFloat('planPieces')" maxlength="8" v-model="ruleForm.planPieces" auto-complete="off" style="width:250px;margin-right: 10px;" clearable>
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>件数</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithTwoWithXing" @input="formatToFloat('planWeight')" @change="formatDecimalPlaces('planWeight')" maxlength="10" v-model="ruleForm.planWeight" auto-complete="off" style="width:250px;margin-right: 10px;" clearable>
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>毛重</span>
										</template>
										<template slot="append">
											<span>KG</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithTwoWithXing" @input="formatToFloat('planVolume')" maxlength="10" @change="formatDecimalPlaces('planVolume')" v-model="ruleForm.planVolume" auto-complete="off" style="width:250px;margin-right: 10px;" clearable>
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>体积</span>
										</template>
										<template slot="append">
											<span>CBM</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" auto-complete="off" style="width:250px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>海关代码</span>
										</template>
										<el-select slot="suffix" v-model="ruleForm.customsStatusCode" placeholder="请选择" style="width:153px;margin-right: -5px;" clearable>
											<el-option v-for="item,index in codeOptions" :key="index" :label="item.label" :value="item.code">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col class="elementWidth">
								<template v-if="mawbChecked">
									<el-form-item>
										<el-input class="widthWithTwo" v-model="ruleForm.planDimensions" auto-complete="off" style="width:521px;margin-right: 10px;" readOnly>
											<template slot="prepend">
												<span>尺寸</span>
											</template>
											<el-button slot="append" @click="gotoSizePage" icon="el-icon-edit"></el-button>
										</el-input>
									</el-form-item>
								</template>
								<template v-else>
									<el-form-item>
										<el-input class="widthWithTwo" v-model="ruleForm.planDimensions" auto-complete="off" style="width:414px;" readOnly>
											<template slot="prepend">
												<span>尺寸</span>
											</template>
											<el-button slot="append" @click="gotoSizePage" icon="el-icon-edit"></el-button>
										</el-input>
									</el-form-item>
									<el-button type="primary" size="mini" @click="setAwbSize" style="margin-right: 20px;">取主单尺寸</el-button>
								</template>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" auto-complete="off" style="width:250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>是否分批</span>
										</template>
										<el-select slot="suffix" v-model="ruleForm.partialShipment" placeholder="请选择" style="width:153px;margin-right: -5px;" clearable>
											<el-option label="是" :value=true></el-option>
											<el-option label="否" :value=false></el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" auto-complete="off" style="width:250px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>支付方式</span>
										</template>
										<el-select slot="suffix" v-model="ruleForm.paymentMethod" placeholder="请选择" style="width:153px;margin-right: -5px;" clearable>
											<el-option label="PP" value="PP"></el-option>
											<el-option label="CC" value="CC"></el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-button type="text" style="margin-left: 20px;" disabled>危险品信息</el-button>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFive" v-model="ruleForm.undgCode" auto-complete="off" clearable style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<span>危险品编号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThree" v-model="ruleForm.undgContactName" auto-complete="off" clearable style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<span>联系人</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input auto-complete="off" style="width:250px;margin-right: 10px;">
										<template slot="prepend">
											<span>联系方式</span>
										</template>
										<el-select slot="suffix" v-model="ruleForm.undgContactCommunicationType" placeholder="请选择" style="width:153px;margin-right: -5px;" clearable>
											<el-option label="TE" value="TE"></el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input v-model="ruleForm.undgContactCommunicationNo" auto-complete="off" clearable style="width: 250px;">
										<template slot="prepend">
											<span>联系号码</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>
										<font style="color: red;">*</font>发货人信息
									</el-button>
									<el-button @click="gotoShipperConsigneePage(0)" icon="el-icon-edit" type="text">编辑</el-button>
								</el-row>
								<el-row>
									<el-form-item>
										<el-input type="textarea" v-model="ruleForm.afOrderShipperConsignee2.scPrintRemark" @input="ruleForm.afOrderShipperConsignee2.scPrintRemark = ruleForm.afOrderShipperConsignee2.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:521px">
										</el-input>
									</el-form-item>
								</el-row>
							</el-col>
							<el-col class="elementWidth" style="margin-left: 10px;">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>
										<font style="color: red;">*</font>收货人信息
									</el-button>
									<el-button @click="gotoShipperConsigneePage(1)" icon="el-icon-edit" type="text">编辑</el-button>
								</el-row>
								<el-row>
									<el-form-item>
										<el-input type="textarea" v-model="ruleForm.afOrderShipperConsignee1.scPrintRemark" @input="ruleForm.afOrderShipperConsignee1.scPrintRemark = ruleForm.afOrderShipperConsignee1.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:521px">
										</el-input>
									</el-form-item>
								</el-row>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-row>
										<el-button type="text" style="margin-left: 20px;" disabled>中文品名</el-button>
									</el-row>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameCn" @change="ruleForm.goodsNameCn=strTrim(ruleForm.goodsNameCn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 521px;" show-word-limit></el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item style="margin-left: 10px;">
									<el-row>
										<el-button type="text" style="margin-left: 20px;" disabled>
											<font style="color: red;">*</font>英文品名
										</el-button>
									</el-row>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameEn" @change="ruleForm.goodsNameEn=strTrim(ruleForm.goodsNameEn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 521px;" show-word-limit></el-input>
								</el-form-item>
							</el-col>

						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-row>
										<el-button type="text" style="margin-left: 20px;" disabled>唛头信息</el-button>
									</el-row>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.shippingMarks" auto-complete="off" :rows="3" maxlength="500" style="width: 521px;" show-word-limit @input="ruleForm.shippingMarks = ruleForm.shippingMarks.toUpperCase()"></el-input>
								</el-form-item>
							</el-col>

							<el-col class="elementWidth" style="margin-left: 10px;">
								<el-form-item>
									<el-row>
										<el-button type="text" style="margin-left: 20px;" disabled>Handling&nbsp;Info</el-button>
									</el-row>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.handlingInfo" auto-complete="off" :rows="3" maxlength="500" style="width: 521px;" show-word-limit @input="ruleForm.handlingInfo = ruleForm.handlingInfo.toUpperCase()"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-form-item>
								<el-button type="primary" size="small" @click="submitForm">保存</el-button>
							</el-form-item>
						</el-row>
					</el-form>
				</el-main>
			</el-container>
			<size ref="addMission" v-if="sizeVisible" :visible.sync="sizeVisible" :frow="ffrow"></size>
			<shipperConsignee ref="addMission" v-if="shipperConsigneeVisible" :visible.sync="shipperConsigneeVisible" :frow="ffrow"></shipperConsignee>
		</div>

	</el-dialog>
</template>
<script>
	import size from '@/views/public/size_edit'
	import shipperConsignee from '@/views/public/shipper_consignee_select'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			var checkNumber1 = (rule, value, callback) => {
				let regE = /^[1-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位大于0的整数'));
				} else {
					callback();
				}
			}
			var checkNumber3 = (rule, value, callback) => {
				let regE = /^[0-9]\d{0,3}$/;
				if (!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if (value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			}
			return {
				helpDocumentUrl: '',
				codeOptions: [],
				sizeVisible: false,
				shipperConsigneeVisible: false,
				disabledFlag: false,
				ifHawbNumberMake: false,
				ifHaveAwbNumberMake: false,
				mawbChecked: false,
				ffrow: {},
				orderAeDigitsWeight: 1,
				orderAeDigitsVolume: 3,
				orderAeDigitsChargeWeight: 2,
				ruleForm: {
					awbNumber: '',
					hawbNumber: '',
					departureStation: '',
					transitStation: '',
					arrivalStation: '',
					expectFlight: '',
					expectDeparture: '',
					loadingDate: this.getDateTime(new Date()),
					planPieces: '',
					planWeight: '',
					planVolume: '',
					customsStatusCode: '',
					planDimensions: '',
					partialShipment: false,
					paymentMethod: 'PP',
					undgCode: '',
					undgContactName: '',
					undgContactCommunicationType: 'TE',
					undgContactCommunicationNo: '',
					afOrderShipperConsignee1: {
						scType: 1,
						scName: '',
						scPrintRemark: ''
					},
					afOrderShipperConsignee2: {
						scType: 0,
						scName: '',
						scPrintRemark: ''
					},
					goodsNameCn: '',
					goodsNameEn: '',
					shippingMarks: '',
					handlingInfo: ''
				},
				awbForm: {},
				hawbList: [],
				awbNumber: ''
			}
		},
		inject: ['findByPage', 'continueOperation'],
		components: {
			size,
			shipperConsignee
		},
		provide() {
			return {
				sizeEditCallBack: this.sizeEditCallBack,
				setShipperConsigneeValue2: this.setShipperConsigneeValue2,
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
			gotoSizePage() {
				this.ffrow.planDimensions = this.ruleForm.planDimensions;
				this.ffrow.position = '舱单信息'
				this.sizeVisible = true;
			},
			sizeEditCallBack(row) {
				this.ruleForm.planDimensions = row.value
				this.ruleForm.planPieces = row.pieces
				this.ruleForm.planVolume = (row.volume / 1000000).toFixed(this.orderAeDigitsVolume);
			},
			gotoShipperConsigneePage(scType) {
				this.ffrow.scType = scType;
				if (scType === 1) {
					this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee1
				} else {
					this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee2
				}

				this.shipperConsigneeVisible = true
			},
			setShipperConsigneeValue2(rrow) {
				if (rrow.scType === 1) {
					this.ruleForm.afOrderShipperConsignee1.scType = 1;
					this.ruleForm.afOrderShipperConsignee1.scName = rrow.scName;
					this.ruleForm.afOrderShipperConsignee1.scMnemonic = rrow.scMnemonic;
					this.ruleForm.afOrderShipperConsignee1.scAddress = rrow.scAddress;
					this.ruleForm.afOrderShipperConsignee1.scCode = rrow.scCode;
					this.ruleForm.afOrderShipperConsignee1.scCodeType = rrow.scCodeType;
					this.ruleForm.afOrderShipperConsignee1.aeoCode = rrow.aeoCode;
					this.ruleForm.afOrderShipperConsignee1.nationCode = rrow.nationCode;
					this.ruleForm.afOrderShipperConsignee1.stateCode = rrow.stateCode;
					this.ruleForm.afOrderShipperConsignee1.cityCode = rrow.cityCode;
					this.ruleForm.afOrderShipperConsignee1.cityName = rrow.cityName;
					this.ruleForm.afOrderShipperConsignee1.postCode = rrow.postCode;
					this.ruleForm.afOrderShipperConsignee1.telNumber = rrow.telNumber;
					this.ruleForm.afOrderShipperConsignee1.faxNumber = rrow.faxNumber;
					this.ruleForm.afOrderShipperConsignee1.scPrintRemark = rrow.scPrintRemark;
				} else {
					this.ruleForm.afOrderShipperConsignee2.scType = 0;
					this.ruleForm.afOrderShipperConsignee2.scName = rrow.scName;
					this.ruleForm.afOrderShipperConsignee2.scMnemonic = rrow.scMnemonic;
					this.ruleForm.afOrderShipperConsignee2.scAddress = rrow.scAddress;
					this.ruleForm.afOrderShipperConsignee2.scCode = rrow.scCode;
					this.ruleForm.afOrderShipperConsignee2.scCodeType = rrow.scCodeType;
					this.ruleForm.afOrderShipperConsignee2.aeoCode = rrow.aeoCode;
					this.ruleForm.afOrderShipperConsignee2.nationCode = rrow.nationCode;
					this.ruleForm.afOrderShipperConsignee2.stateCode = rrow.stateCode;
					this.ruleForm.afOrderShipperConsignee2.cityCode = rrow.cityCode;
					this.ruleForm.afOrderShipperConsignee2.cityName = rrow.cityName;
					this.ruleForm.afOrderShipperConsignee2.postCode = rrow.postCode;
					this.ruleForm.afOrderShipperConsignee2.telNumber = rrow.telNumber;
					this.ruleForm.afOrderShipperConsignee2.faxNumber = rrow.faxNumber;
					this.ruleForm.afOrderShipperConsignee2.scPrintRemark = rrow.scPrintRemark;
				}

			},
			setAwbSize() {
				this.ruleForm.planDimensions = this.awbForm.planDimensions
			},

			submitForm() {
				//校验装载时间并提示
				if (this.ruleForm.loadingDate && this.getDateObj(this.ruleForm.loadingDate).getTime() < this.getCurrDateObj().getTime()) {
					this.$confirm('您录入的装载时间过早，如果继续发送有可能进入风险分析（海关罚款5W以下），继续提交点确认，返回修改点取消（建议装载时间在发送时间至少加4小时）', '提示', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						try {
							this.hawbList.forEach((hawb) => {
								if (hawb.hawbChecked) {
									hawb.hawbChecked = false
									throw Error()
								}
							})
						} catch (e) {

              }
              this.$emit("shipperLetterCallback", {
                orderInfo: this.awbForm,
                hawbList: this.hawbList
              })
            }).catch(() => {})
          } else {
            try {
              this.hawbList.forEach((hawb) => {
                if (hawb.hawbChecked) {
                  hawb.hawbChecked = false
                  throw Error()
                }
              })
            } catch (e) {

            }
            this.$emit("shipperLetterCallback", {
              orderInfo: this.awbForm,
              hawbList: this.hawbList
            })
          }
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
					if (this.orderAeDigitsWeight === 0) {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderAeDigitsWeight);
					}
				} else if (item == 'planVolume') {
					if (this.orderAeDigitsVolume === 0) {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderAeDigitsVolume);
					}
				} else if (item == 'priceValue') {
					this.ruleForm.priceValue = this.ruleForm.priceValue.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.priceValue.split('.');
					if (t.length > 1) {
						this.ruleForm.priceValue = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'priceValue2') {
					this.ruleForm.priceValue2 = this.ruleForm.priceValue2.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.priceValue2.split('.');
					if (t.length > 1) {
						this.ruleForm.priceValue2 = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'planPieces') {
					this.ruleForm.planPieces = this.ruleForm.planPieces.replace(/[^0123456789]/g, "");
				}
			},
			formatDecimalPlaces(item) {
				if (item == 'planWeight') {
					if (this.ruleForm.planWeight) {
						let t = this.ruleForm.planWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsWeight) {
								this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsWeight - t[1].length);
							}
						} else {
							if (this.orderAeDigitsWeight !== 0) {
								this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderAeDigitsWeight);
							}
						}
					}
				} else if (item == 'planVolume') {
					if (this.ruleForm.planVolume) {
						let t = this.ruleForm.planVolume.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsVolume) {
								this.ruleForm.planVolume = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsVolume - t[1].length);
							}
						} else {
							if (this.orderAeDigitsVolume !== 0) {
								this.ruleForm.planVolume = t[0] + "." + "000".substr(0, this.orderAeDigitsVolume);
							}
						}
					}
				}
			},
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				var _hour = theDate.getHours()
				_month = _month + 1
				_hour = _hour + 4
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				if (_hour < 10) {
					_hour = "0" + _hour;
				}
				return _year + "-" + _month + "-" + _date + " " + _hour + ":00:00"
			},
			getDateObj(dateStr) {
				//yyyy-MM-dd HH:00:00
				let theDate = new Date(dateStr.substr(0, 4), dateStr.substr(5, 2), dateStr.substr(8, 2), dateStr.substr(11, 2), 0, 0)
				let _year = theDate.getFullYear()
				let _month = theDate.getMonth()
				let _date = theDate.getDate()
				let _hour = theDate.getHours()
				_month = _month - 1
				return new Date(_year, _month, _date, _hour, 0, 0)
			},
			getCurrDateObj() {
				let theDate = new Date()
				let _year = theDate.getFullYear()
				let _month = theDate.getMonth()
				let _date = theDate.getDate()
				let _hour = theDate.getHours()
				_hour = _hour + 4
				return new Date(_year, _month, _date, _hour, 0, 0)
			},
			addHawb() {
				this.mawbChecked = false
				this.hawbList.forEach(hawb => {
					hawb.hawbChecked = false
				})

				let hawb = {
					hawbChecked: true,
					awbNumber: this.awbForm.awbNumber,
					hawbNumber: '',
					departureStation: this.awbForm.departureStation,
					transitStation: this.awbForm.transitStation,
					arrivalStation: this.awbForm.arrivalStation,
					expectFlight: this.awbForm.expectFlight,
					expectDeparture: this.awbForm.expectDeparture,
					loadingDate: this.getDateTime(new Date()),
					planPieces: '',
					planWeight: '',
					planVolume: '',
					customsStatusCode: this.awbForm.customsStatusCode,
					planDimensions: '',
					partialShipment: false,
					paymentMethod: 'PP',
					undgCode: '',
					undgContactName: '',
					undgContactCommunicationType: 'TE',
					undgContactCommunicationNo: '',
					afOrderShipperConsignee1: {
						scType: 1,
						scName: '',
						scPrintRemark: ''
					},
					afOrderShipperConsignee2: {
						scType: 0,
						scName: '',
						scPrintRemark: ''
					},
					goodsNameCn: '',
					goodsNameEn: '',
					shippingMarks: '',
					handlingInfo: ''
				}
				this.ruleForm = hawb
				this.hawbList.push(hawb)

			},
			deleteHawb(index, row) {
				this.hawbList.splice(index, 1)
			},
			viewMawb() {
				if (!this.mawbChecked) {
					try {
						this.hawbList.forEach((hawb) => {
							if (hawb.hawbChecked) {
								//赋值
								hawb.hawbChecked = false
								throw Error()
							}
						})
					} catch (e) {

					}
					this.mawbChecked = true
					if (!this.awbForm.loadingDate) {
						this.awbForm.loadingDate = this.getDateTime(new Date())
					}
					this.ruleForm = this.awbForm
				}
			},
			viewHawb(index) {
				if (this.mawbChecked) {
					this.awbForm = this.ruleForm
					this.mawbChecked = false
				} else {
					try {
						this.hawbList.forEach((hawb) => {
							if (hawb.hawbChecked) {
								hawb.hawbChecked = false
								throw Error()
							}
						})
					} catch (e) {

					}
				}
				this.hawbList[index].hawbChecked = true
				if (!this.hawbList[index].loadingDate) {
					this.hawbList[index].loadingDate = this.getDateTime(new Date())
				}
				this.ruleForm = this.hawbList[index]
			}
		},
		created() {
			if (this.frow.ifHaveAwbNumber) {
				this.ifHaveAwbNumberMake = this.frow.ifHaveAwbNumber
			}
			if (this.frow.ifHaveHawbNumber) {
				this.ifHawbNumberMake = this.frow.ifHaveHawbNumber
			}

			this.awbNumber = this.frow.shipperLetter.awbNumber
			this.awbForm = this.frow.shipperLetter

			this.hawbList = this.frow.hawbList

			this.mawbChecked = this.frow.mawbChecked
			if (this.frow.mawbChecked) {
				if (!this.awbForm.loadingDate) {
					this.awbForm.loadingDate = this.getDateTime(new Date())
				}
				this.ruleForm = this.awbForm
			} else {
				this.hawbList[this.frow.index].hawbChecked = true
				if (!this.hawbList[this.frow.index].loadingDate) {
					this.hawbList[this.frow.index].loadingDate = this.getDateTime(new Date())
				}
				this.ruleForm = this.hawbList[this.frow.index]
			}


			this.$axios.get('/hrs/permission/' + 159).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=货物海关代码').then(function(response) {
				this.codeOptions = response.data.data;
			}.bind(this));
			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces")
				.then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.orderAeDigitsWeight != null) {
							this.orderAeDigitsWeight = response.data.data.orderAeDigitsWeight
						}
						if (response.data.data.orderAeDigitsVolume != null) {
							this.orderAeDigitsVolume = response.data.data.orderAeDigitsVolume
						}
						if (response.data.data.orderAeDigitsChargeWeight != null) {
							this.orderAeDigitsChargeWeight = response.data.data.orderAeDigitsChargeWeight
						}
					} else {
						this.openError(response.data.messageInfo)
					}
				});
		}
	}
</script>
<style>
	.orderShipperLetterComponent .el-input__icon {
		line-height: 30px !important;
	}

	.orderShipperLetterComponent .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.afOrderLinkTwoInput .el-form-item__content {
		line-height: 30px !important;
	}

	.widthWithKG .el-input-group__append {
		padding: 0 10px;
	}

	.widthWithKG .el-input__inner {
		line-height: 29px !important;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.hawbQuantity .el-input-group__prepend {
		background-color: #409EFF;
		color: #FFF;
		border: 1px solid #409EFF;
	}
</style>
