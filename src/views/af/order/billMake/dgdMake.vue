<template>
	<el-dialog title="单证制作 - DGD" :fullscreen="true" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<div style="width: 1330px;margin: 0 auto;">
			<el-row>
				<el-col :span="4">
					<ul style="margin-top: 53px;">
						<li style="margin-left: 50px;margin-bottom: 20px;">
							<i class="iconfont el-icon-myyuanquanjiahao" style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="toAdd" v-show="this.data.length!=0"></i>
							<span style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 30px;" @click="toAdd" v-show="this.data.length!=0">增加</span>
						</li>
						<li v-for="(item,index) in data" :key="index" style="margin-left: 50px;margin-bottom: 20px;">
							<i class="iconfont el-icon-myjianhao" @click="doDelete(item.dgdPrintId)" style="cursor: pointer;font-size: 15px;color: #409EFF;"></i>
							<span v-if="!item.checked" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 30px;" @click="view(item.dgdPrintId)">{{item.dgdPrintName}}</span>
							<span v-if="item.checked" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 30px;background-color: #7ed2df;" @click="view(item.dgdPrintId)">{{item.dgdPrintName}}</span>
						</li>
					</ul>
				</el-col>
				<el-col :span="20" v-loading="pageLoading">

					<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="110px" :disabled="additional">
						<el-row>
							<el-form-item>
								<el-button :loading="loadingSave" type="primary" size="small" @click="doSave" v-if="create">保存</el-button>
								<el-button :loading="loadingUpdate" type="primary" size="small" @click="doUpdate" v-if="!create">保存</el-button>
								<el-button :loading="loadingPG" type="primary" size="small" @click="printG" v-if="!create">格打</el-button>
								<el-button :loading="loadingPT" type="primary" size="small" @click="printT" v-if="!create">套打</el-button>
							</el-form-item>
						</el-row>
						<el-row class="table_col_top table_col_right table_col_left" style="height: 40px;text-align: center;line-height: 40px;">
							SHIPPER'S DECLARATION FOR DANGEROUS GOODS
						</el-row>
						<el-row>
							<el-col class="table_col" :span="12" style="height: 141px;">
								<div style="margin-top: 10px;">
									<el-form-item label="Shipper" label-width="100px">
										<el-input style="width: 360px;" type="textarea" rows="5" v-model="ruleForm.shipperPrint" maxlength="500"></el-input>
									</el-form-item>
									<el-button type="primary" size="mini" @click="gotoShipperConsigneePage(0)">选择</el-button>
								</div>
							</el-col>
							<el-col class="table_col_top table_col_right table_col_bottom" :span="12" style="height: 141px;">
								<div>
									<el-form-item label="Air Waybill No." label-width="125px">
										<el-input v-model="ruleForm.awbNumber" style="width: 220px;" disabled></el-input>
									</el-form-item>
									<div>
										<el-form-item label="Page" label-width="66px">
											<el-input v-model="ruleForm.pageNumber" style="width: 80px;" maxlength="10"></el-input>
										</el-form-item>
										<el-form-item label="of" label-width="40px">

										</el-form-item>
										<el-form-item label="">
											<el-input v-model="ruleForm.pagesNumber" style="width: 80px;" maxlength="10"></el-input>
										</el-form-item>
										<el-form-item label="Pages" label-width="55px">
										</el-form-item>
									</div>
									<div style="margin-left: 20px;">
										Shipper's Reference no.
									</div>
									<div style="margin-left: 20px;">
										(optional)
									</div>

								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="table_col_left table_col_right table_col_bottom" :span="12" style="height: 141px;">
								<div style="margin-top: 10px;">
									<el-form-item label="Consignee" label-width="100px">
										<el-input style="width: 360px;" type="textarea" rows="5" v-model="ruleForm.consigneePrint" maxlength="500"></el-input>
									</el-form-item>
									<el-button type="primary" size="mini" @click="gotoShipperConsigneePage(1)">选择</el-button>
								</div>
							</el-col>
							<el-col class="table_col_right table_col_bottom" :span="12" style="height: 141px;"></el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-row class="table_col_left table_col_right table_col_bottom" style="height: 50px;">
									<div style="margin-left: 20px;margin-top: 5px;">
										Two completed and signed copies of this Declaration
									</div>
									<div style="margin-left: 20px;margin-top: 5px;">
										must be handed to the operator
									</div>
								</el-row>
								<el-row class="table_col_left table_col_right table_col_bottom" style="height: 30px;">
									<div style="margin-left: 20px;margin-top: 5px;">
										TRANSPORT DETAILS
									</div>
								</el-row>
								<el-row>
									<el-col :span="14">
										<el-row class="table_col_left table_col_right table_col_bottom" style="height: 45px;">
											<div style="margin-left: 20px;margin-top: 5px;">
												This shipment is within the limitations prescribed for:(delete non-applicable)
											</div>
										</el-row>
										<el-row>
											<el-col style="height: 55px;" class="table_col_left table_col_right table_col_bottom" :span="12">
												<el-radio style="margin-left: 20px;margin-top: 5px;" v-model="ruleForm.aircraftType" :label="0">
													<div style="float: right;">
														<s v-if="ruleForm.aircraftType==1">
														<div>PASSENGER</div>
														<div>AND CARGO</div>
														<div>AIRCRAFT</div>
														</s>
														<div v-else>
															<div>PASSENGER</div>
															<div>AND CARGO</div>
															<div>AIRCRAFT</div>
														</div>
													</div>
												</el-radio>

											</el-col>
											<el-col style="height: 55px;" class="table_col_right table_col_bottom" :span="12">
												<el-radio style="margin-left: 20px;margin-top: 5px;" v-model="ruleForm.aircraftType" :label="1">
													<div style="float: right;">
														<s v-if="ruleForm.aircraftType==0"><div>CARGO</div>
														<div>AIRCRAFT</div>
														<div>ONLY</div></s>
														<div v-else>
															<div>CARGO</div>
															<div>AIRCRAFT</div>
															<div>ONLY</div>
														</div>

													</div>
												</el-radio>
											</el-col>
										</el-row>
									</el-col>
									<el-col style="height: 100px;" :span="10" class="table_col_right table_col_bottom">
										<div style="margin-left: 20px;margin-top: 5px;margin-bottom: 15px;">Airport of Departure</div>
										<el-form-item label=" " label-width="20px">
											<el-input type="textarea" rows="2" v-model="ruleForm.departureStationPrint" maxlength="200"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col style="height: 180px;" class="table_col_right table_col_bottom" :span="12">
								<div style="margin-left: 20px;margin-top: 5px;">
									<div>WARNING</div>
									<div>Failure to comply in all respects with the applicable </div>
									<div>Dangerous Goods Regulations may be in breach of </div>
									<div>the applicable law, subject to legal penalties</div>
								</div>
							</el-col>
						</el-row>

						<el-row>
							<el-col class="table_col_left table_col_right table_col_bottom" :span="12" style="height: 75px;">
								<div style="margin-left: 20px;margin-top: 5px;">Airport of Destination</div>
								<el-form-item label=" " label-width="20px">
									<el-input type="textarea" rows="1" v-model="ruleForm.arrivalStationPrint" style="width: 500px;" maxlength="200"></el-input>
								</el-form-item>
							</el-col>
							<el-col class="table_col_right table_col_bottom" :span="12">
								<el-row class="table_col_bottom" style="height: 30px;line-height: 30px;">
									<div style="margin-left: 20px;">Shipment type (delete non-applicable)</div>
								</el-row>
								<el-row>
									<el-col class="table_col_right" :span="12" style="height: 43px;line-height: 43px;">
										<el-radio style="margin-left: 20px;" v-model="ruleForm.shipmentType" :label="0">
											<s v-if="ruleForm.shipmentType==1">NON-RADIOACTIVE</s>
											<span v-else="">NON-RADIOACTIVE</span>
										</el-radio>
									</el-col>
									<el-col :span="12" style="height: 43px;line-height: 43px;">
										<el-radio style="margin-left: 20px;" v-model="ruleForm.shipmentType" :label="1">
											<s v-if="ruleForm.shipmentType==0">RADIOACTIVE</s>
											<span v-else="">RADIOACTIVE</span>
										</el-radio>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<el-row style="margin-top: 20px;height: 40px;line-height: 40px;" class="table_col">
							<div style="margin-left: 20px;">NATURE AND QUANTITY OF DANGEROUS GOODS</div>
						</el-row>
						<el-row>
							<el-col :span="16" class="table_col_left table_col_right table_col_bottom" style="height: 30px;">
								<div style="line-height: 30px;margin-left: 20px;">Dangerous Goods Identification</div>
							</el-col>
							<el-col :span="8" class="table_col_right table_col_bottom" style="height: 30px;line-height: 30;"></el-col>
						</el-row>
						<el-row class="table_col_left table_col_right table_col_bottom">
							<el-col>
								<el-row style="margin-top: 20px;margin-bottom: 20px;">
									<el-col class="elementWidth" style="width:85px;margin-left:10px;text-align: center;">UN or ID No.</el-col>
									<el-col class="elementWidth" style="margin-left:15px;width:240px;text-align: center;">Proper Shipping Name</el-col>
									<el-col class="elementWidth" style="margin-left:15px;width:120px;text-align: center;">Class or Division (SubsidiaryRisk)</el-col>
									<el-col class="elementWidth" style="margin-left:15px;width:120px;text-align: center;">Packing Group</el-col>
									<el-col class="elementWidth" style="margin-left:15px;width:180px;text-align: center;">Quantity and type of packing</el-col>
									<el-col class="elementWidth" style="margin-left:15px;width:120px;text-align: center;">PackingInst</el-col>
									<el-col class="elementWidth" style="margin-left:15px;width:120px;text-align: center;">Authorization</el-col>
								</el-row>
								<el-row style="margin-bottom: 10px;" v-for="(row,index) in dgdPrintList" :key="index">
									<el-col class="elementWidth" style="margin-left:10px">
										<el-input v-model="row.unIdNo" style="width:85px" maxlength="50"></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:15px">
										<el-input v-model="row.properShippingName" style="width:240px" maxlength="200"></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:15px">
										<el-input v-model="row.classOrDivision" style="width:120px" maxlength="50"></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:15px">
										<el-input v-model="row.packingGroup" style="width:120px" maxlength="50"></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:15px">
										<el-input v-model="row.quantityAndTypeOfPacking" style="width:180px" maxlength="100"></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:15px">
										<el-input v-model="row.packingInst" style="width:120px" maxlength="50"></el-input>
									</el-col>
									<el-col class="elementWidth" style="margin-left:15px">
										<el-input v-model="row.authorization" style="width:120px" maxlength="50"></el-input>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<el-row class="table_col_left table_col_right table_col_bottom">
							<div style="margin-left: 20px;margin-bottom: 10px;margin-top: 10px;">Additional Handing Information</div>
							<el-form-item label=" " label-width="20px">
								<el-input type="textarea" v-model="ruleForm.handlingInfo" style="width: 1065px;" maxlength="500"></el-input>
							</el-form-item>
						</el-row>
						<el-row>
							<el-col :span="16" class="table_col_left table_col_right table_col_bottom" style="height: 245px;">
								<div style="margin-left: 20px;margin-top: 10px;margin-right: 20px;">
									I hereby declare that the contents of this consignment are fully and accurately described above by the proper shipping name , and are classified, packaged ,marked and labelled/placarded.and are in all respects in proper condition for transport according to applicable International and national governmental regulations.I declare that all of the applicable air transport requirements have been met.
								</div>
							</el-col>
							<el-col :span="8" class="table_col_right table_col_bottom" style="height: 245px;">
								<div style="margin-left: 20px;margin-top: 10px;margin-bottom: 10px;">Name/Title of Signatory</div>
								<el-form-item label=" " label-width="20px">
									<el-input type="textarea" v-model="ruleForm.nameTitleOfSignatory" style="width: 327px;" maxlength="100"></el-input>
								</el-form-item>
								<div style="margin-left: 20px;margin-top: 10px;margin-bottom: 10px;">Place and Date</div>
								<el-form-item label=" " label-width="20px">
									<el-input type="textarea" v-model="ruleForm.placeAndDate" style="width: 327px;" maxlength="50"></el-input>
								</el-form-item>
								<div style="margin-left: 20px;margin-top: 10px;margin-bottom: 10px;">Signature(See warning above)</div>
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
				default: false
			},
			frow: Object
		},
		data() {
			var checkNumber1 = (rule, value, callback) => {
				let regE = /^[0-9]\d{2}$/;
				if(!regE.test(value)) {
					callback(new Error('请输入3位数字'));
				} else {
					callback();
				}
			};
			var checkNumber2 = (rule, value, callback) => {
				let regE = /^[0-9]\d{7}$/;
				if(!regE.test(value)) {
					callback(new Error('请输入8位数字'));
				} else {
					callback();
				}
			};
			var checkNumber3 = (rule, value, callback) => {
				let regE = /^[0-9]\d{0,3}$/;
				if(!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if(value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			};
			return {
				dgdPrintList: [],
				data: [],
				create: true,
				additional: true,
				loadingSave: false,
				loadingUpdate: false,
				loadingPG: false,
				loadingPT: false,
				pageLoading: false,
				shipperAndConsigneeVisible: false,
				ffrow: {
					awbFromType: ''
				},
				Shipper: {
					scType: 1,
					scName: '',
					scPrintRemark: ''
				},
				Consignee: {
					scType: 0,
					scName: '',
					scPrintRemark: ''
				},
				ruleForm: {
					awbNumber: '',
					orderId: '',
					orderUuid: '',
					shipperPrint: '',
					consigneePrint: '',
					pageNumber: '1',
					pagesNumber: '1',
					departureStationPrint: '',
					arrivalStationPrint: '',
					handlingInfo: '',
					aircraftType: 0,
					shipmentType: 0,
					nameTitleOfSignatory: '',
					placeAndDate: this.getCurrDateAndCurrMonthLastDay()
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
			queryList(flag) {
				this.$axios.get('/afbase/dgdPrint/list/' + this.frow.dgdMake.orderUuid)
					.then((response) => {
						if(response.data.code == 0) {
							this.data = response.data.data
							if(flag == 'choose') {
								this.data.forEach((row) => {
									if(row.dgdPrintId == this.ruleForm.dgdPrintId) {
										row.checked = true
									} else {
										row.checked = false
									}
								})
							} else if(flag == 'add'){
							    let num = this.data.length;
                  this.view(this.data[num-1].dgdPrintId)
              }
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch((error) => {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			queryOrderByOrderUuid() {
				this.pageLoading = true
				this.$axios.get('/afbase/aforder/queryOrderByOrderUuid/' + this.frow.dgdMake.orderUuid)
					.then((response) => {
						if(response.data.code == 0) {
							this.frow.dgdMake.awbNumber = response.data.data.awbNumber
							this.frow.dgdMake.orderUuid = response.data.data.orderUuid
							this.frow.dgdMake.orderId = response.data.data.orderId
							this.frow.dgdMake.departureStationPrint = response.data.data.departureWarehouseName
							this.frow.dgdMake.arrivalStationPrint = response.data.data.departureStorehouseName
							this.frow.dgdMake.handlingInfo = response.data.data.handlingInfo
							this.frow.dgdMake.goodsNameEn = response.data.data.goodsNameEn
							if(response.data.data.afOrderShipperConsignee1 != null) {
								this.frow.dgdMake.shipperPrint = response.data.data.afOrderShipperConsignee1.scPrintRemark
								this.ruleForm.shipperPrint = response.data.data.afOrderShipperConsignee1.scPrintRemark
							}
							if(response.data.data.afOrderShipperConsignee2 != null) {
								this.frow.dgdMake.consigneePrint = response.data.data.afOrderShipperConsignee2.scPrintRemark
								this.ruleForm.consigneePrint = response.data.data.afOrderShipperConsignee2.scPrintRemark
							}
							if(response.data.data.confirmPieces == null || response.data.data.confirmPieces === '') {
								this.frow.dgdMake.pieces = response.data.data.planPieces
							} else {
								this.frow.dgdMake.pieces = response.data.data.confirmPieces
							}
							this.dgdPrintList[0].properShippingName = response.data.data.goodsNameEn
							this.dgdPrintList[0].quantityAndTypeOfPacking = this.frow.dgdMake.pieces

							this.ruleForm.awbNumber = response.data.data.awbNumber
							this.ruleForm.orderUuid = response.data.data.orderUuid
							this.ruleForm.orderId = response.data.data.orderId
							this.ruleForm.departureStationPrint = response.data.data.departureWarehouseName
							this.ruleForm.arrivalStationPrint = response.data.data.departureStorehouseName
							this.ruleForm.handlingInfo = response.data.data.handlingInfo
							this.additional = false
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
			queryUserEnName() {
				this.$axios.get('/afbase/dgdPrint/userEnName')
					.then((response) => {
						if(response.data.code == 0) {
							this.frow.dgdMake.userEnName = response.data.data
							this.ruleForm.nameTitleOfSignatory = response.data.data
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch((error) => {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			submitForm(formName) {

				this.$refs[formName].validate((valid) => {
					if(valid) {
						let params = this.ruleForm;
						this.$axios.post2('/afbase/awb/checkAwbList', params)
							.then(function(response) {
								if(response.data.code == 0) {
									//   this.$confirm('是否继续保存?', '提示', {
									//   confirmButtonText: '确定',
									//   cancelButtonText: '取消',
									//   type: 'warning',
									//   center: true
									// }).then(() => {
									this.doSave();
									// }).catch(() => {

									// });

								} else {
									let errorinfo = response.data.messageInfo;
									if(errorinfo.indexOf('是否继续保存') > -1) {
										this.$confirm(errorinfo + '?', '提示', {
											confirmButtonText: '确定',
											cancelButtonText: '取消',
											type: 'warning',
											center: true
										}).then(() => {
											this.doSave();
										}).catch(() => {

										});
									} else {
										this.openError(errorinfo);
									}

								}

							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			doSave() {
				this.loadingSave = true
				this.ruleForm.dgdPrintList = this.dgdPrintList
				this.$axios.post2('/afbase/dgdPrint', this.ruleForm)
					.then(function(response) {
						if(response.data.code == 0) {
							this.queryList("add")
							//this.toAdd()
							this.openSuccess()
						} else {
							this.openError(response.data.messageInfo);
						}
						this.loadingSave = false
						this.loadingSave = false
					}.bind(this)).catch(function(error) {
						this.loadingSave = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					}.bind(this));
			},
			doUpdate() {
				this.ruleForm.dgdPrintList = this.dgdPrintList
				this.loadingUpdate = true
				this.$axios.put('/afbase/dgdPrint', this.ruleForm)
					.then(function(response) {
						if(response.data.code == 0) {
							this.view(this.ruleForm.dgdPrintId)
							this.openSuccess()
						} else {
							this.openError(response.data.messageInfo);
						}
						this.loadingUpdate = false
					}.bind(this)).catch(function(error) {
						this.loadingUpdate = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					}.bind(this));
			},
			doDelete(id) {
				this.$confirm('此操作不可恢复，确定要删除么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {

					this.$axios.deletes('/afbase/dgdPrint/' + id)
						.then((response) => {
							if(response.data.code == 0) {
								if(id == this.ruleForm.dgdPrintId) {
									this.queryList()
									this.toAdd()
								} else {
									this.queryList("choose")
								}
								this.openSuccess()
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}).catch(() => {

				});
			},
			view(id) {
				this.data.forEach((row) => {
					if(row.dgdPrintId == id) {
						row.checked = true
					} else {
						row.checked = false
					}
				})
				this.pageLoading = true
				this.$axios.get('/afbase/dgdPrint/view/' + id)
					.then((response) => {
						if(response.data.code == 0) {
							this.ruleForm = response.data.data
							this.ruleForm.awbNumber = this.frow.dgdMake.awbNumber
							this.dgdPrintList = this.ruleForm.dgdPrintList
							this.create = false
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
			toAdd() {
				this.data.forEach((row) => {
					row.checked = false
				})
				this.create = true
				this.ruleForm = {
					awbNumber: this.frow.dgdMake.awbNumber,
					orderId: this.frow.dgdMake.orderId,
					orderUuid: this.frow.dgdMake.orderUuid,
					shipperPrint: this.frow.dgdMake.shipperPrint,
					consigneePrint: this.frow.dgdMake.consigneePrint,
					pageNumber: '1',
					pagesNumber: '1',
					departureStationPrint: this.frow.dgdMake.departureStationPrint,
					arrivalStationPrint: this.frow.dgdMake.arrivalStationPrint,
					handlingInfo: this.frow.dgdMake.handlingInfo,
					aircraftType: 0,
					shipmentType: 0,
					nameTitleOfSignatory: this.frow.dgdMake.userEnName,
					placeAndDate: this.getCurrDateAndCurrMonthLastDay()
				}

				this.dgdPrintList = []
				for(let i = 0; i < 5; i++) {
					if(i == 0) {
						this.dgdPrintList.push({
							'unIdNo': '',
							'properShippingName': this.frow.dgdMake.goodsNameEn,
							'classOrDivision': '',
							'packingGroup': '',
							'quantityAndTypeOfPacking': this.frow.dgdMake.pieces,
							'packingInst': '',
							'authorization': ''
						})
					} else {
						this.dgdPrintList.push({
							'unIdNo': '',
							'properShippingName': '',
							'classOrDivision': '',
							'packingGroup': '',
							'quantityAndTypeOfPacking': '',
							'packingInst': '',
							'authorization': ''
						})
					}
				}

			},
			getCurrDateAndCurrMonthLastDay() {
				//获取当前日期
				let date = new Date();
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if(months < 10) {
					months = '0' + months
				}
				if(days < 10) {
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
					this.$axios.get('/afbase/dgdPrint/printG/' + this.ruleForm.dgdPrintId)
						.then((response) => {
							if(response.data.code == 0) {
								window.open(response.data.data)
							} else {
								this.openError(response.data.messageInfo);
							}
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
					this.$axios.get('/afbase/dgdPrint/printT/' + this.ruleForm.dgdPrintId)
						.then((response) => {
							if(response.data.code == 0) {
								window.open(response.data.data)
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}).catch(() => {

				});
			},
			gotoShipperConsigneePage(scType) {
				this.ffrow.scType = scType;
				if(scType === 0) {
					this.Shipper.scPrintRemark = this.ruleForm.shipperPrint
					this.ffrow.rowBean = this.Shipper
				} else {
					this.Consignee.scPrintRemark = this.ruleForm.consigneePrint
					this.ffrow.rowBean = this.Consignee
				}

				this.shipperAndConsigneeVisible = true;
			},
			setShipperConsigneePrint(rrow) {
				if(rrow.scType === 1) {
					this.ruleForm.consigneePrint = rrow.scPrintRemark;
				} else {
					this.ruleForm.shipperPrint = rrow.scPrintRemark;
				}

			},
			init() {
				for(let i = 0; i < 5; i++) {
					this.dgdPrintList.push({
						'unIdNo': '',
						'properShippingName': '',
						'classOrDivision': '',
						'packingGroup': '',
						'quantityAndTypeOfPacking': '',
						'packingInst': '',
						'authorization': ''
					})
				}
				this.queryOrderByOrderUuid()
				this.queryUserEnName()
				this.queryList()
			}
		},
		created() {
			this.init()
		}
	}
</script>
<style type="text/css" scoped="scoped">
	.table_col {
		border: 2px solid #DCDFE6;
	}

	.table_col_left {
		border-left: 2px solid #DCDFE6;
	}

	.table_col_top {
		border-top: 2px solid #DCDFE6;
	}

	.table_col_right {
		border-right: 2px solid #DCDFE6;
	}

	.table_col_bottom {
		border-bottom: 2px solid #DCDFE6;
	}
</style>
