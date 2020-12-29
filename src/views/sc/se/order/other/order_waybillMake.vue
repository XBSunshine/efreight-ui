<template>
	<el-dialog title="单证制作" :fullscreen="true" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<div style="width: 1330px;margin: 0 auto;" class="seOrderWaybillMake">
			<el-row>
				<el-col :span="4">
					<ul style="margin-top: 53px;margin-right: 10px;">
						<li v-for="(item,index) in data" :key="index" style="margin-bottom: 20px;">
							<template v-if="!item.checked">
								<span v-if="index===0">
									<div style="font-size: 15px;margin-bottom: 10px;">主单</div>
									<span style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="view(item.orderId,'MBL');checkItem(index)">{{item.blNumber}}</span>
									<div style="font-size: 15px;margin-top: 20px;">分单</div>
								</span>
								<span v-else style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="view(item.orderId,'HBL');checkItem(index)">
									{{item.blNumber.split(' ')[0]}}<br />{{item.blNumber.split(' ')[1]}}
								</span>
							</template>
							<template v-else>
								<span v-if="index===0">
									<div style="font-size: 15px;margin-bottom: 10px;">主单</div>
									<span style="cursor: pointer;font-size: 15px;color: #409EFF;background-color: #7ed2df;" @click="view(item.orderId,'MBL');checkItem(index)">{{item.blNumber}}</span>
									<div style="font-size: 15px;margin-top: 20px;">分单</div>
								</span>
								<span v-else style="cursor: pointer;font-size: 15px;color: #409EFF;background-color: #7ed2df;" @click="view(item.orderId,'HBL');checkItem(index)">
									{{item.blNumber.split(' ')[0]}}<br />{{item.blNumber.split(' ')[1]}}
								</span>
							</template>
						</li>
					</ul>
				</el-col>
				<el-col :span="20" v-loading="pageLoading">
					<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="110px" :disabled="disabled">
						<el-row>
							<el-form-item>
								<el-button :loading="loadingSave" type="primary" size="small" @click="doSave" v-if="create&&((permissionButtonForWaybillMakeAwbSave&&flag=='MBL')||(permissionButtonForWaybillMakeHawbSave&&flag=='HBL'))">保存</el-button>
								<el-button :loading="loadingUpdate" type="primary" size="small" @click="doUpdate" v-if="!create&&((permissionButtonForWaybillMakeAwbEdit&&flag=='MBL')||(permissionButtonForWaybillMakeHawbEdit&&flag=='HBL'))">保存</el-button>
								<el-button :loading="loadingPG" type="primary" size="small" @click="printG" v-if="!create">格打</el-button>
								<el-button :loading="loadingPT" type="primary" size="small" @click="printT" v-if="!create">套打</el-button>
							</el-form-item>
						</el-row>
						<el-row>
							<el-col class="table_col" :span="12" style="height: 150px;">
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">Shipper Insert Name,Address and Phone</el-col>
								</el-row>
								<div style="margin-top: 10px;margin-left: 10px;">
									<el-form-item>
										<el-input style="width: 450px;" type="textarea" rows="4" v-model="ruleForm.shipperPrint" maxlength="500"></el-input>
									</el-form-item>
									<el-button type="primary" size="mini" @click="gotoShipperConsigneePage(0)">选择</el-button>
								</div>
							</el-col>
							<el-col class="table_col_top table_col_right table_col_bottom" :span="12" style="height: 150px;">
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">Booking No.</el-col>
								</el-row>
								<el-row style="height: 42px;">
									<el-col style="margin-left: 25px;margin-top: 7px;">
										<el-input v-model="ruleForm.bookingNumber" style="width:500px" maxlength="50" clearable></el-input>
									</el-col>
								</el-row>
								<el-row class="table_col_bottom table_col_top" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">SO No.</el-col>
								</el-row>
								<el-row>
									<el-col style="margin-left: 25px;margin-top: 7px;">
										<el-input v-model="ruleForm.soNumber" style="width:500px" maxlength="50" clearable></el-input>
									</el-col>
								</el-row>
								<!-- <div style="margin-left: 25px;margin-top: 15px;">
									<el-form-item>
										<el-input style="width: 500px;" type="textarea" rows="5" v-model="ruleForm.companyName" maxlength="500"></el-input>
									</el-form-item>
								</div> -->
							</el-col>
						</el-row>
						<el-row>
							<el-col class="table_col_left table_col_right table_col_bottom" :span="12" style="height: 150px;">
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">Consignee Insert Name,Address and Phone</el-col>
								</el-row>
								<div style="margin-top: 10px;margin-left: 10px;">
									<el-form-item>
										<el-input style="width: 450px;" type="textarea" rows="4" v-model="ruleForm.consigneePrint" maxlength="500"></el-input>
									</el-form-item>
									<el-button type="primary" size="mini" @click="gotoShipperConsigneePage(1)">选择</el-button>
								</div>
							</el-col>
							<el-col class="table_col_right table_col_bottom" :span="12" style="height: 150px;">
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">B/L No.</el-col>
								</el-row>
								<el-row class="table_col_bottom" style="height: 45px;">
									<el-col style="margin-left: 25px;margin-top: 7px;">
										<el-input v-model="ruleForm.blNumber" style="width:500px" maxlength="50" disabled></el-input>
									</el-col>
								</el-row>
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">Reference No.</el-col>
								</el-row>
								<el-row style="height: 50px;">
									<el-col style="margin-left: 25px;margin-top: 7px;">
										<el-input v-model="ruleForm.referenceNo" style="width:500px" maxlength="50" clearable></el-input>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" style="height: 200px;" class="table_col_left table_col_right table_col_bottom">
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">Notify Party Insert Name,Address and Phone</el-col>
								</el-row>
								<el-row>
									<div style="margin-top: 15px;margin-left: 10px;">
										<el-form-item>
											<el-input style="width: 530px;" type="textarea" rows="6" v-model="ruleForm.notify" maxlength="500"></el-input>
										</el-form-item>
									</div>
								</el-row>
							</el-col>
							<el-col style="height: 200px;" class="table_col_right table_col_bottom" :span="12">
								<el-row class="table_col_bottom" style="height: 30px;">
									<el-col style="margin-left: 10px;margin-top: 5px;">Destination Agent</el-col>
								</el-row>
								<el-row>
									<div style="margin-top: 15px;margin-left: 10px;">
										<el-form-item>
											<el-input style="width: 530px;" type="textarea" rows="6" v-model="ruleForm.destinationAgent" maxlength="500"></el-input>
										</el-form-item>
									</div>
								</el-row>
							</el-col>
						</el-row>
						<el-row style="margin-top: 20px;height: 150px;" class="table_col">
							<el-row class="table_col_bottom">
								<el-col :span="8" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">PRE CARRIAGE BY</div>
								</el-col>
								<el-col :span="8" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">PORT OF RECEIPT</div>
								</el-col>
								<el-col :span="8" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">PORT OF LOADING</div>
								</el-col>
							</el-row>
							<el-row class="table_col_bottom">
								<el-col :span="8" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.preCarriageBy" style="width:345px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="8" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.portOfReceipt" style="width:345px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="8" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.portOfLoading" style="width:345px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
							</el-row>
							<el-row class="table_col_bottom">
								<el-col :span="8" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">OCEAN VESSEL / VOYAGE NO.</div>
								</el-col>
								<el-col :span="8" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">PORT OF DISCHARGE</div>
								</el-col>
								<el-col :span="8" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">PLACE OF DELIVERY</div>
								</el-col>
							</el-row>
							<el-row class="table_col_bottom">
								<el-col :span="8" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.shipName" style="width:165px" maxlength="50" clearable></el-input>
										<el-input v-model="ruleForm.shipVoyageNumber" style="width:165px;margin-left: 10px;" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="8" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.portOfDischarge" style="width:345px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="8" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.placeOfDelivery" style="width:345px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
							</el-row>
						</el-row>

						<el-row style="margin-top: 20px;" class="table_col">
							<el-col>
								<el-row style="margin-top: 20px;margin-bottom: 20px;">
									<el-col class="elementWidth" style="margin-left:5px;text-align: center;"><i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i></el-col>
									<el-col class="elementWidth" style="margin-left:5px;width:240px;text-align: center;">Container. seal No. or marks and Nos.</el-col>
									<el-col class="elementWidth" style="margin-left:10px;width:240px;text-align: center;">Number and kind of package</el-col>
									<el-col class="elementWidth" style="margin-left:10px;width:280px;text-align: center;">Description of goods</el-col>
									<el-col class="elementWidth" style="margin-left:10px;width:120px;text-align: center;">Gross weight</el-col>
									<el-col class="elementWidth" style="margin-left:10px;width:120px;text-align: center;">Measurement</el-col>
								</el-row>
								<el-row style="margin-bottom: 10px;" v-for="(row,index) in ruleForm.waybillPrintDetailsList" :key="index">
									<el-col class="elementWidth" style="margin-left:5px;">
										<i class="iconfont el-icon-myjianhao" @click="doDelete(index)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
									</el-col>
									<el-col class="elementWidth" style="margin-left:5px">
										<el-input type="textarea" class="containerSealNo" v-model="row.containerSealNo" :rows="1" style="width:240px;" maxlength="50" clearable></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:25px">
										<el-input class="containerSealNo" type="textarea" v-model="row.number" :rows="1" style="width:100px" maxlength="20" clearable></el-input>
										<el-select v-model="row.kindOfPackage" style="width:100px;margin-left: 10px;" clearable>
											<el-option v-for="(item,index) in packageTypes" :key="index" :label="item.edicode1" :value="item.edicode1">
											</el-option>
										</el-select>
									</el-col>
									<el-col class="elementWidth" style="margin-left:20px">
										<el-input class="containerSealNo" type="textarea" v-model="row.descriptionOfGoods" :rows="1" style="width:280px" maxlength="50" clearable></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:20px">
										<el-input class="containerSealNo" type="textarea" v-model="row.grossWeight" :rows="1" style="width:120px" maxlength="50" clearable></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:20px">
										<el-input class="containerSealNo" type="textarea" v-model="row.volume" :rows="1" style="width:120px" maxlength="50" clearable></el-input>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<el-row style="height: 100px;" class="table_col_left table_col_right table_col_bottom">
							<div style="margin-left: 10px;margin-top: 10px;">
								<el-input type="textarea" v-model="ruleForm.goodsSize" style="width: 1080px;" maxlength="500" :rows="3"></el-input>
							</div>
						</el-row>
						<el-row style="height: 100px;" class="table_col_left table_col_right table_col_bottom">
							<el-row>
								<div style="margin-left: 10px;margin-top: 10px;">
									Total No. of Containers or Packages (in Words)
								</div>
							</el-row>
							<div style="margin-left: 10px;margin-top: 10px;">
								<el-input type="textarea" v-model="ruleForm.containersRemark" style="width: 1080px;" maxlength="500" :rows="2"></el-input>
							</div>
						</el-row>
						<el-row style="margin-top: 20px;height: 150px;" class="table_col">
							<el-row class="table_col_bottom">
								<el-col :span="6" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">Shipping Space</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">Payment</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">Freight</div>
								</el-col>
								<el-col :span="6" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">Trade Terms</div>
								</el-col>
							</el-row>
							<el-row class="table_col_bottom">
								<el-col :span="6" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.shippingSpace" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.payment" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.freight" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="6" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.tradeTerms" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
							</el-row>
							<el-row class="table_col_bottom">
								<el-col :span="6" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">EX.RATE</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">Prepaid at</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">Payable at</div>
								</el-col>
								<el-col :span="6" style="height: 30px;">
									<div style="margin-left: 15px;margin-top: 8px;">No.of original B(s)/LY</div>
								</el-col>
							</el-row>
							<el-row class="table_col_bottom">
								<el-col :span="6" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.exRate" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.prepaidAt" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="6" class="table_col_right" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.payableAt" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
								<el-col :span="6" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.ofOriginalNumber" style="width:255px" maxlength="50" clearable></el-input>
									</div>
								</el-col>
							</el-row>
						</el-row>
						<el-row class="table_col_right table_col_left">
							<el-col :span="12" class="table_col_right" style="height: 30px;">
								<div style="margin-left: 10px;margin-top: 8px;">Place and Date of Issue</div>
							</el-col>
							<el-col :span="12" style="height: 30px;">
								<div style="margin-left: 10px;margin-top: 8px;">Signed for The Carrier</div>
							</el-col>
						</el-row>
						<el-row class="table_col">
							<el-col :span="12" class="table_col_right" style="height: 110px;">
								<el-row class="table_col_bottom" style="height: 40px;">
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.placeOfIssue" style="width:360px" maxlength="50" clearable></el-input>
										<el-date-picker v-model="ruleForm.dateOfIssue" clearable type="date" value-format="yyyy-MM-dd" style="width:146px;margin-left: 20px;">
										</el-date-picker>
									</div>
								</el-row>
								<el-row class="table_col_bottom" style="height: 30px;">
									<div style="margin-left: 10px;margin-top: 5px;">Remarks:</div>
								</el-row>
								<el-row>
									<div style="margin-left: 10px;margin-top: 5px;">
										<el-input v-model="ruleForm.remarks" style="width:530px" maxlength="50" clearable></el-input>
									</div>
								</el-row>
							</el-col>
							<el-col :span="12" style="height: 110px;">
								<div style="margin-left: 10px;margin-top: 8px;">
									<el-form-item>
										<el-input style="width: 530px;" type="textarea" rows="4" v-model="ruleForm.carrierSignature" maxlength="500"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
				<shipperConsignee ref="addMission" v-if="shipperAndConsigneeVisible" :visible.sync="shipperAndConsigneeVisible" :frow="ffrow"></shipperConsignee>
			</el-row>
		</div>
	</el-dialog>
</template>
<script>
	import shipperConsignee from '@/views/public/shipper_consignee_select'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: true
			},
			frow: Object
		},
		data() {
			var checkNumber1 = (rule, value, callback) => {
				let regE = /^[0-9]\d{2}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入3位数字'));
				} else {
					callback();
				}
			};
			var checkNumber2 = (rule, value, callback) => {
				let regE = /^[0-9]\d{7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入8位数字'));
				} else {
					callback();
				}
			};
			var checkNumber3 = (rule, value, callback) => {
				let regE = /^[0-9]\d{0,3}$/;
				if (!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if (value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			};
			return {
				orderId: '',
				flag: '',
				data: [],
				packageTypes: [],
				create: true,
				loadingSave: false,
				loadingUpdate: false,
				loadingPG: false,
				loadingPT: false,
				pageLoading: false,
				disabled: true,
				shipperAndConsigneeVisible: false,
				permissionButtonForWaybillMakeAwbSave: false,
				permissionButtonForWaybillMakeAwbEdit: false,
				permissionButtonForWaybillMakeHawbSave: false,
				permissionButtonForWaybillMakeHawbEdit: false,
				ffrow: {},
				ruleForm: {
					shipperPrint: '',
					soNumber: '',
					bookingNumber: '',
					consigneePrint: '',
					blNumber: '',
					referenceNo: '',
					notify: '',
					preCarriageBy: '',
					portOfReceipt: '',
					portOfLoading: '',
					shipName: '',
					shipVoyageNumber: '',
					portOfDischarge: '',
					placeOfDelivery: '',
					destinationAgent: '',
					waybillPrintDetailsList: [],
					goodsSize: '',
					containersRemark: '',
					shippingSpace: '',
					payment: '',
					freight: '',
					tradeTerms: '',
					exRate: '',
					prepaidAt: '',
					payableAt: '',
					ofOriginalNumber: '',
					placeOfIssue: '',
					dateOfIssue: this.getCurrDateAndCurrMonthLastDay(),
					remarks: '',
					carrierSignature: '',
					shipper: {
						scType: 0,
						scPrintRemark: ''
					},
					consignee: {
						scType: 1,
						scPrintRemark: ''
					}
				},
				rules: {
					awbcount: [{
							required: true,
							message: '请输入数量',
							trigger: ['blur', 'change']
						},
						{
							validator: checkNumber3,
							trigger: ['blur', 'change']
						}
					]
				}
			};
		},
		components: {
			'shipperConsignee': shipperConsignee
		},
		provide() {
			return {
				setShipperConsigneeValue2: this.setShipperConsigneePrint
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
			doAdd(){
				if(this.ruleForm.waybillPrintDetailsList.length==5){
					this.openError('制单明细列表不能超过5条记录')
					return
				}
				this.ruleForm.waybillPrintDetailsList.push({
					containerSealNo:'',
					number:'',
					kindOfPackage:'',
					descriptionOfGoods:'',
					grossWeight:'',
					volume:''
				})
			},
			doDelete(index){
				this.ruleForm.waybillPrintDetailsList.splice(index,1)
			},
			queryList(orderId) {
				this.$axios.get('/sc/waybillPrint/list/' + orderId)
					.then((response) => {
						if (response.data.code == 0) {
							this.data = response.data.data
							this.view(this.data[0].orderId, 'MBL')
							this.checkItem(0)
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch((error) => {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			doSave() {
				this.loadingSave = true
				if(this.ruleForm.waybillPrintDetailsList.length>5){
					this.openError('制单明细列表不能超过5条记录')
					this.loadingSave = false
					return
				}
				this.$axios.post2('/sc/waybillPrint', this.ruleForm)
					.then((response) => {
						if (response.data.code == 0) {
							this.view(this.orderId, this.flag)
							this.openSuccess()
						} else {
							this.openError(response.data.messageInfo);
						}
						this.loadingSave = false
					}).catch((error) => {
						this.loadingSave = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			doUpdate() {
				this.loadingUpdate = true
				if(this.ruleForm.waybillPrintDetailsList.length>5){
					this.openError('制单明细列表不能超过5条记录')
					this.loadingUpdate = false
					return
				}
				this.$axios.put('/sc/waybillPrint', this.ruleForm)
					.then((response) => {
						if (response.data.code == 0) {
							this.view(this.orderId, this.flag)
							this.openSuccess()
						} else {
							this.openError(response.data.messageInfo);
						}
						this.loadingUpdate = false
					}).catch((error) => {
						this.loadingUpdate = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			view(id, flag) {
				this.orderId = id
				this.flag = flag
				this.pageLoading = true
				this.$axios.get('/sc/waybillPrint/view/' + id + '/' + flag)
					.then((response) => {
						if (response.data.code == 0) {
							this.ruleForm = response.data.data
							if (this.ruleForm.waybillPrintId) {
								this.create = false
							} else {
								this.create = true
							}
							this.disabled = false
						} else {
							this.openError(response.data.messageInfo);
						}
						this.pageLoading = false
					}).catch((error) => {
						this.pageLoading = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			checkItem(index) {
				this.data.forEach(item => item.checked = false)
				this.data[index].checked = true
			},
			getCurrDateAndCurrMonthLastDay() {
				//获取当前日期
				let date = new Date();
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if (months < 10) {
					months = '0' + months
				}
				if (days < 10) {
					days = '0' + days
				}
				let datas = date.getFullYear() + '-' + months + '-' + days;
				return datas
			},
			printG() {
				this.$confirm('只能打印保存后的数据，确定要继续么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.post3('/sc/waybillPrint/print/G/' + this.ruleForm.waybillPrintId)
						.then((response) => {
							var blob = new Blob([response.data], {
								type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
							});
							var downloadElement = document.createElement('a');
							var href = window.URL.createObjectURL(blob); // 创建下载的链接
							downloadElement.href = href;
							downloadElement.download = '格打-' + this.data.filter(item => item.checked == true)[0].blNumber + '.xlsx'; // 下载后文件名
							document.body.appendChild(downloadElement);
							downloadElement.click(); // 点击下载
							document.body.removeChild(downloadElement); // 下载完成移除元素
							window.URL.revokeObjectURL(href); // 释放掉blob对象
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}).catch(() => {

				});
			},
			printT() {
				this.$confirm('只能打印保存后的数据，确定要继续么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.post3('/sc/waybillPrint/print/T/' + this.ruleForm.waybillPrintId)
						.then((response) => {
							var blob = new Blob([response.data], {
								type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
							});
							var downloadElement = document.createElement('a');
							var href = window.URL.createObjectURL(blob); // 创建下载的链接
							downloadElement.href = href;
							downloadElement.download = '套打-' + this.data.filter(item => item.checked == true)[0].blNumber + '.xlsx'; // 下载后文件名
							document.body.appendChild(downloadElement);
							downloadElement.click(); // 点击下载
							document.body.removeChild(downloadElement); // 下载完成移除元素
							window.URL.revokeObjectURL(href); // 释放掉blob对象
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}).catch(() => {

				});
			},
			gotoShipperConsigneePage(scType) {
				this.ffrow.scType = scType;
				if (scType === 0) {
					this.ruleForm.shipper.scPrintRemark = this.ruleForm.shipperPrint
					this.ffrow.rowBean = this.ruleForm.shipper
				} else {
					this.ruleForm.consignee.scPrintRemark = this.ruleForm.consigneePrint
					this.ffrow.rowBean = this.ruleForm.consignee
				}

				this.shipperAndConsigneeVisible = true;
			},
			setShipperConsigneePrint(rrow) {
				if (rrow.scType === 1) {
					this.ruleForm.consigneePrint = rrow.scPrintRemark
					this.ruleForm.consignee = rrow
				} else {
					this.ruleForm.shipperPrint = rrow.scPrintRemark
					this.ruleForm.shipper = rrow
				}

			}
		},
		created() {
			//权限控制
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('se_order_waybillMake_awbSave') > -1) {
				this.permissionButtonForWaybillMakeAwbSave = true
			}
			if (buttonInfo.indexOf('se_order_waybillMake_awbEdit') > -1) {
				this.permissionButtonForWaybillMakeAwbEdit = true
			}
			if (buttonInfo.indexOf('se_order_waybillMake_hawbSave') > -1) {
				this.permissionButtonForWaybillMakeHawbSave = true
			}
			if (buttonInfo.indexOf('se_order_waybillMake_hawbEdit') > -1) {
				this.permissionButtonForWaybillMakeHawbEdit = true
			}
			this.$axios.get('/sc/vScCategory/包装类型').then((response) => {
				this.packageTypes = response.data.data;
			})
			this.queryList(this.$route.query.orderId)
		}
	}
</script>
<style type="text/css">
	.seOrderWaybillMake .table_col {
		border: 2px solid #DCDFE6;
	}

	.seOrderWaybillMake .table_col_left {
		border-left: 2px solid #DCDFE6;
	}

	.seOrderWaybillMake .table_col_top {
		border-top: 2px solid #DCDFE6;
	}

	.seOrderWaybillMake .table_col_right {
		border-right: 2px solid #DCDFE6;
	}

	.seOrderWaybillMake .table_col_bottom {
		border-bottom: 2px solid #DCDFE6;
	}

	.seOrderWaybillMake .containerSealNo textarea {
		height: 30px;
		overflow-y: hidden;
		min-height: 30px !important;
	}
</style>
