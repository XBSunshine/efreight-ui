<template>
	<div v-loading="vLoad" class="vlOrderEditPage" style="width: 1280px;">
		<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="vehicleNo">
						<el-input v-model="ruleForm.vehicleNo" style="width:305px;" clearable>
							<template slot="prepend">
								<font style="color: red">*</font>
								<span>车牌号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>业务类型</span>
							</template>
							<el-select slot="suffix" v-model="businessType" filterable placeholder="请选择" style="width:208px;margin-right: -5px;">
								<el-option label="口岸业务" value="F"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="vehteamFlag">
						<el-input style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>车队标识</span>
							</template>
							<el-select slot="suffix" clearable v-model="ruleForm.vehteamFlag" filterable placeholder="请选择" style="width:208px;margin-right: -5px;">
								<el-option label="单车" :value="0"></el-option>
								<el-option label="车队" :value="1"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<!-- <el-col class="elementWidth">
					<el-form-item prop="warehouseCode">
						<el-input style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>货站代码</span>
							</template>
							<el-select slot="suffix" clearable v-model="ruleForm.warehouseCode" filterable placeholder="请选择" style="width:208px;margin-right: -5px;">
								<el-option label="南航货站" value="514101/5141"></el-option>
								<el-option label="国际1号货站" value="514102/5141"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col> -->
			</el-row>
			<el-row>
				<el-col class="elementWidth" v-if="ruleForm.vehteamFlag==1">
					<el-form-item prop="vehteamNo">
						<el-input v-model="ruleForm.vehteamNo" style="width:620px;" clearable >
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>车队车牌号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" v-show="ruleForm.vehteamFlag!=1">
					<el-form-item >
						<el-input v-model="ruleForm.vehteamNo" style="width:620px;" clearable >
							<template slot="prepend">
								<span>车队车牌号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="driverInfo">
						<el-input v-model="ruleForm.driverInfo" style="width:305px;" clearable>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>驾驶证号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="transInFlag">
						<el-input style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>转关标识</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.transInFlag" filterable placeholder="请选择" style="width:208px;margin-right: -5px;" @change="transInFlagChange">
								<el-option label="非转关" :value="0"></el-option>
								<el-option label="转关" :value="1"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>具体业务</span>
							</template>
							<el-select slot="suffix"  v-model="businessInfo" filterable placeholder="请选择" style="width:208px;margin-right: -5px;" @change="businessInfoChange">
								<el-option label="直出货物运抵国际货站" value="F11"></el-option>
								<el-option label="联程转关出口货物运抵国际货站" value="F12"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>运输类型</span>
							</template>
							<el-select slot="suffix" v-model="arrivalInfo" filterable placeholder="请选择" style="width:208px;margin-right: -5px;">
								<el-option label="重进空出（出口）" value="07"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.trailerNoIn" style="width:305px;" clearable>
							<template slot="prepend">
								<span>进区托架编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.trailerWeightIn" style="width:305px;" clearable @input="formatToFloat('trailerWeightIn')">
							<template slot="prepend">
								<span>进区托架重量</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.contWeightIn" style="width:305px;" clearable @input="formatToFloat('contWeightIn')">
							<template slot="prepend">
								<span>进区集装箱空重</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.trailerNoOut" style="width:305px;" clearable>
							<template slot="prepend">
								<span>出区托架编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.trailerWeightOut" style="width:305px;" clearable @input="formatToFloat('trailerWeightOut')">
							<template slot="prepend">
								<span>出区托架重量</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.contWeightOut" style="width:305px;" clearable @input="formatToFloat('contWeightOut')">
							<template slot="prepend">
								<span>出区集装箱空重</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="showWordLimit widthWithTwo" v-model="ruleForm.note" auto-complete="off" style="width:1255px;" show-word-limit maxlength="300" clearable>
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
			<el-table :data="ruleForm.vlEntryOrderDetails" stripe border style="width:1255px" >
				<el-table-column align="center" width="40">
					<template slot="header" slot-scope="scope">
						<i class="iconfont el-icon-myyuanquanjiahao" @click="addOrder" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" @click="deleteOrder(scope.$index)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>
				<el-table-column align="center" label="主单号" width="140px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.mawbNumber"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="分单号" width="140px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.hawbNumber"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="报关单号" width="140px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.docNo"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="件数" width="100px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.pieces" @input="formatToFloat2(scope.row,'pieces')"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="重量" width="100px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.totalWeight" @input="formatToFloat2(scope.row,'totalWeight')"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="货站代码" width="120px">
					<template slot-scope="scope">
						<el-select v-model="scope.row.warehouseCode" filterable placeholder="请选择">
							<el-option label="南航货站" value="514101/5141"></el-option>
							<el-option label="国际1号货站" value="514102/5141"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="货物分类" width="120px">
					<template slot-scope="scope">
						<el-select v-model="scope.row.classType" filterable placeholder="请选择" >
							<el-option v-for="item in classTypeOptions" :key="item.value" :label="item.label" :value="item.code">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="包裹大小" width="195px">
					<template slot-scope="scope">
						<el-select v-model="scope.row.packageSize" filterable placeholder="请选择">
							<el-option v-for="item in packageSizeOptions" :key="item.value" :label="item.label" :value="item.code">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="打板公司" width="120px">
					<template slot-scope="scope">
						<el-select v-model="scope.row.battleName" filterable placeholder="请选择" >
							<el-option v-for="item in battleNameOptions" :key="item.value" :label="item.label" :value="item.code">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="入仓公司" width="120px">
					<template slot-scope="scope">
						<el-select v-model="scope.row.wareName" filterable placeholder="请选择" >
							<el-option v-for="item in wareNameOptions" :key="item.value" :label="item.label" :value="item.code">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="航空公司" width="80px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.airlineName"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="货物名称" width="180px">
					<template slot-scope="scope">
						<el-input v-model="scope.row.goodsEname"></el-input>
					</template>
				</el-table-column>
			</el-table>
			<div style="padding:10px 0px 10px 0px">
				<HR color="#eee" size="5">
				</HR>
			</div>
			<el-row>
				<el-form-item>
					<el-button :loading="loading" v-if="ruleForm.entryOrderId" type="primary" size="small" @click="doEdit('ruleForm')">修改</el-button>
					<el-button :loading="loading" v-else type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
					<el-button :loading="loading" v-if="ruleForm.entryOrderId" type="primary" size="small" @click="doSend('ruleForm')">登记</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="ffrow"></customerSelect>
		<orderList ref="addMission" v-if="orderListVisible" :visible.sync="orderListVisible" :frow="ffrow"></orderList>
		<truckSave ref="addMission" v-if="truckSaveVisible" :visible.sync="truckSaveVisible"></truckSave>
	</div>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
	import OrderList from './order_selectOrder_list'
	import TruckSave from '../order/other/order_truck_save'
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
				vLoad:false,
				businessType:'F',
				businessInfo:'F11',
				arrivalInfo:'07',
				packageSizeOptions:[],
				classTypeOptions:[],
				battleNameOptions:[],
				wareNameOptions:[],
				departureStations: [],
				arrivalStations: [],
				currencyCodeOptions: [],
				trucks: [],
				shippingMethods: [],
				airportOptionsAll: [],
				customerSelectVisible: false,
				orderListVisible: false,
				truckSaveVisible: false,
				showFlag: false,
				ffrow: {},
				loading: false,
				ruleForm: {
					vlOrderId:this.frow.orderId,
					vehicleNo: '',
					vehteamFlag:'',
					warehouseCode:'',
					vehteamNo:'',
					driverInfo:'',
					transInFlag:0,
					trailerNoIn:'',
					trailerWeightIn:'',
					contWeightIn:'',
					trailerNoOut:'',
					trailerWeightOut:'',
					contWeightOut:'',
					note: '',
					vlEntryOrderDetails: []
				},
				rules: {
					vehteamFlag: [{
						required: true,
						message: '请选择车队标识',
						trigger: ['blur', 'change']
					}],
					warehouseCode: [{
						required: true,
						message: '请选择货站代码',
						trigger: ['blur', 'change']
					}],
					vehicleNo: [{
						required: true,
						message: '请录入车牌号',
						trigger: ['blur']
					}],
					vehteamNo: [{
						required: true,
						message: '请录入车队车牌号',
						trigger: ['blur', 'change']
					}],
					driverInfo: [{
						required: true,
						message: '请录入驾驶证号',
						trigger: ['blur', 'change']
					}],
					transInFlag: [{
						required: true,
						message: '请选择转关标识',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['findByPage', 'handleClose','queryEntryOrderList'],
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
			formatToFloat(item) {
		      if (item == "trailerWeightIn") {
		        this.ruleForm.trailerWeightIn = this.ruleForm.trailerWeightIn.replace(
		          /[^0123456789.]/g,
		          ""
		        );
		        let t = this.ruleForm.trailerWeightIn.split(".");
		        if (t.length > 1) {
		          this.ruleForm.trailerWeightIn = t[0] + "." + t[1].substr(0, 2);
		        }
		      } else if (item == "contWeightIn") {
		        this.ruleForm.contWeightIn = this.ruleForm.contWeightIn.replace(
		          /[^0123456789.]/g,
		          ""
		        );
		        let t = this.ruleForm.contWeightIn.split(".");
		        if (t.length > 1) {
		          this.ruleForm.contWeightIn = t[0] + "." + t[1].substr(0, 2);
		        }
		      } else if (item == "trailerWeightOut") {
		        this.ruleForm.trailerWeightOut = this.ruleForm.trailerWeightOut.replace(
		          /[^0123456789.]/g,
		          ""
		        );
		        let t = this.ruleForm.trailerWeightOut.split(".");
		        if (t.length > 1) {
		          this.ruleForm.trailerWeightOut = t[0] + "." + t[1].substr(0, 2);
		        }
		      }else if (item == "contWeightOut") {
		        this.ruleForm.contWeightOut = this.ruleForm.contWeightOut.replace(
		          /[^0123456789.]/g,
		          ""
		        );
		        let t = this.ruleForm.contWeightOut.split(".");
		        if (t.length > 1) {
		          this.ruleForm.contWeightOut = t[0] + "." + t[1].substr(0, 2);
		        }
		      }
		    },
		    formatToFloat2(row2, item) {
				if (item == 'pieces') {
					row2.pieces = row2.pieces.replace(/[^0123456789]/g,"");
				} else if (item == 'totalWeight') {
					row2.totalWeight = row2.totalWeight.replace(/[^0123456789.]/g, "");
					let t = row2.totalWeight.split('.');
					if (t.length > 1) {
						row2.totalWeight = t[0] + "." + t[1].substr(0, 2);
					}
				} 
			},
			addOrder(){
				let j = {
					// orderId: this.frow.orderId,
					// orderUuid: this.frow.orderUuid,
					// incomeId: '',
					// businessScope: this.frow.businessScope,
					// customerId: this.frow.coopId,
					// customerName: this.frow.coopName,
					// serviceId: '',
					// serviceName: '',
					// incomeQuantity: '',
					// incomeUnitPrice: '',
					// incomeCurrency: 'CNY',
					// incomeExchangeRate: 1,
					// incomeAmount: 0,
					// incomeFunctionalAmount: 0,
					// incomeAmountTaxRate: '0',
					// incomeAmountNotTax: '',
					// incomeAmountTax: '',
					// serviceRemark: '',
					// serviceNote: ''
				};
				
				this.ruleForm.vlEntryOrderDetails.push(j);
				// this.$nextTick(() => {
				// 	this.initInputDOM();
				// });
			},
			deleteOrder(index) {
				if (this.ruleForm.truckId) {
					this.$confirm('该订单已绑定车牌：' + (this.trucks.filter(truck => truck.truckId == this.ruleForm.truckId).length == 0 ? '' : this.trucks.filter(truck => truck.truckId == this.ruleForm.truckId)[0].truckNumber) + '，是否继续删除？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.ruleForm.vlEntryOrderDetails.splice(index, 1)
					}).catch(() => {

					})
				} else {
					this.ruleForm.vlEntryOrderDetails.splice(index, 1)
				}
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
			businessInfoChange(){
				if (this.businessInfo=='F11') {
					this.ruleForm.transInFlag='0'
				}else{
					this.ruleForm.transInFlag='1'
				}
			},
			transInFlagChange(){
				if (this.ruleForm.transInFlag=='0') {
					this.businessInfo='F11'
				}else{
					this.businessInfo='F12'
				}
			},
			doEdit(formName) {
				if (this.ruleForm.vlEntryOrderDetails.length == 0) {
					this.openError("请选择订单")
					return
				}
				let warehouseCode=this.ruleForm.vlEntryOrderDetails[0].warehouseCode
				let warehouseCodeFlag=0;
				for (var i = 0; i < this.ruleForm.vlEntryOrderDetails.length; i++) {
					if (warehouseCode!=this.ruleForm.vlEntryOrderDetails[i].warehouseCode) {
						warehouseCodeFlag=1;
						break;
					}

				}
				if (warehouseCodeFlag==1) {
					this.openError("订单货站信息必须一致")
					return
				}
				this.ruleForm.warehouseCode=warehouseCode;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.post2('/sc/vl-entry-order/doUpdate', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.queryEntryOrderList();
									this.openSuccess("保存成功")
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
			submitForm(formName) {
				if (this.ruleForm.vlEntryOrderDetails.length == 0) {
					this.openError("请选择订单")
					return
				}
				let warehouseCode=this.ruleForm.vlEntryOrderDetails[0].warehouseCode
				let warehouseCodeFlag=0;
				for (var i = 0; i < this.ruleForm.vlEntryOrderDetails.length; i++) {
					if (warehouseCode!=this.ruleForm.vlEntryOrderDetails[i].warehouseCode) {
						warehouseCodeFlag=1;
						break;
					}

				}
				if (warehouseCodeFlag==1) {
					this.openError("订单货站信息必须一致")
					return
				}
				this.ruleForm.warehouseCode=warehouseCode;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.post2('/sc/vl-entry-order/doSave', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.queryEntryOrderList();
									this.openSuccess("保存成功")
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
			doSend(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
				this.$confirm('此操作将登记卡口入区, 是否继续?', '注意', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true
				}).then(() => {
					this.checkSend();

      			}).catch(() => {});
				}
				});
			},
			send(){
				this.$axios.post("/afbase/send/doSendVEEntry/"+this.frow.entryOrderId).then(function (response) {
		            if (response.data.code == 0) {
		                if(response.data.data.status=='success'){
		                	this.queryEntryOrderList();
		                  this.openSuccess('登记成功');
			            }else{
			                  this.openError(response.data.data.message);
			            }
		            } else {
		                this.openError(response.data.messageInfo || "登记失败!");
		            }
	            }.bind(this));
			},
			checkSend() {
				this.$axios.post("/afbase/send/doVEEntryQuery/"+this.frow.entryOrderId).then(function (response2) {
	            if (response2.data.code == 0) {
	                if(response2.data.data.status=='success'){
	                	if (response2.data.data.Symbol=="P") {
	                		this.send();
	                	}else{
	                		this.openError("不允许重复登记");
	                	}
		            }
	            }else{
	            	if (response2.data.messageInfo=="MessageId不允许为空") {
	            		this.send();
	            	}else{ 
	            		this.openError(response2.data.messageInfo);
	            	}
	            }
	            }.bind(this));				
			},
			orderListCallback(row) {
				row.orderList.forEach(order => {
					this.ruleForm.vlEntryOrderDetails.push({
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
				this.ruleForm.vlEntryOrderDetails.forEach(order => {
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
							this.ruleForm.vlEntryOrderDetails.forEach(order => {
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
							this.ruleForm.vlEntryOrderDetails.forEach(order => {
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
							this.ruleForm.vlEntryOrderDetails.forEach((order, index) => {
								if (index === this.ruleForm.vlEntryOrderDetails.length - 1) {
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
			view() {
				// this.vLoad = true
				this.$axios.get('/sc/vl-entry-order/view/' + this.frow.entryOrderId).then((response) => {
					if (response.data.code == 0) {
						this.ruleForm = response.data.data
						if (this.ruleForm.transInFlag==1) {
							this.businessInfo='F12'
						}
						
						// this.vLoad = false

					} else {
						// this.vLoad = false
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					// this.vLoad = false
					this.openError(error.response.data.messageInfo)
				})
			},
			getVlOrderDetail() {
				this.vLoad = true
				this.ruleForm.vehicleNo = this.frow.truckNumber
				this.$axios.get('/sc/vl-entry-order/getVlOrder/' + this.frow.orderId).then((response) => {
					if (response.data.code == 0) {
						this.ruleForm.vehteamFlag = response.data.data.vehteamFlag
						this.ruleForm.vehteamNo = response.data.data.vehteamNo
						this.vLoad = false
						
					} else {
						this.vLoad = false
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.vLoad = false
					this.openError(error.response.data.messageInfo)
				})
				this.$axios.get('/sc/vl-entry-order/getVlOrderDetail/' + this.frow.orderId+'/FHL').then((response) => {
					if (response.data.code == 0) {
						this.ruleForm.vlEntryOrderDetails = response.data.data
						this.vLoad = false
						
					} else {
						this.vLoad = false
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.vLoad = false
					this.openError(error.response.data.messageInfo)
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
			this.$axios.get('/afbase/awb/selectCategory?category=包裹大小').then(function(response) {
				this.packageSizeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategoryPro/货物类型/CAN').then(function(response) {
				this.classTypeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategoryPro/打板代理/CAN').then(function(response) {
				this.battleNameOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategoryPro/入仓公司/CAN').then(function(response) {
				this.wareNameOptions = response.data.data;
			}.bind(this));

			if (this.frow.entryOrderId) {
				this.view()
			}else{
				this.getVlOrderDetail()
			}
	
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
