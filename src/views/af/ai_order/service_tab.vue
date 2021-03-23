<template>
	<div>
		<el-row style="height:45px;" v-if="viewFlag">
			<el-col :span="22">
				<el-button type="primary" size="small" @click="showsaveIncome" v-if="incomeServicePermissionButton||costServicePermissionButton">编辑费用</el-button>
				<el-button type="primary" size="small" @click="showBill" v-if="incomeServicePermissionButton">制作账单</el-button>
				<el-button type="primary" size="small" @click="printBill" v-if="incomeServicePermissionButton">账单预览</el-button>
				<el-button type="primary" size="small" @click="sendBill" v-if="incomeServicePermissionButton">发送账单</el-button>
				<el-button type="primary" size="small" @click="deleteBill" v-if="incomeServicePermissionButton">删除账单</el-button>
				<el-button type="primary" size="small" @click="doIncome" v-if="incomeServicePermissionButton">收入完成</el-button>
				<el-button type="primary" size="small" @click="doCost" v-if="costServicePermissionButton">成本完成</el-button>
				<el-button type="primary" size="small" @click="printBusinessCalculationBill" v-if="incomeServicePermissionButton&&costServicePermissionButton&&this.frow.businessScope!='AE'">核算单预览</el-button>
        <el-button type="primary" size="small" @click="printBusinessCalculationBill" v-if="incomeServicePermissionButton&&costServicePermissionButton&&this.frow.businessScope=='AE'&&printBusinessCalculationBillButton">核算单预览</el-button>
			</el-col>
		</el-row>
		<div style="margin:10px 10px 10px 22px;">
			<template v-if="(incomeServicePermissionButton||incomeFindServicePermissionButton)&&(costServicePermissionButton||costFindServicePermissionButton)">
				<span style="margin-left: 20px;" align="center">毛利：</span>
				<span style="color:red" v-if="(incomeValue-costValue)<0">{{getNumber(incomeValue-costValue)}}</span>
				<span v-if="(incomeValue-costValue)>=0">{{getNumber(incomeValue-costValue)}}</span>
				<span>元 </span>
			</template>
			<template v-if="incomeServicePermissionButton||incomeFindServicePermissionButton">
				<span style="margin-left: 20px;">收入：{{getNumber(parseFloat(incomeValue))}}</span>
				<span>元 </span>
				<span>
					(
					<span v-for="(key,index) in incomeMap.keys()" :key="index">
						<span v-if="index!=0"> + </span>
						<span v-if="key!='CNY'" style="color:red">{{key}}</span>
						<span v-if="key=='CNY'">{{key}}</span>
						<span>{{getNumber(incomeMap.get(key))}}</span>
					</span>
					)
				</span>
			</template>
			<template v-if="costServicePermissionButton||costFindServicePermissionButton">
				<span style="margin-left: 20px;">成本：{{getNumber(parseFloat(costValue))}}</span>
				<span>元 </span>
				<span>
					(
					<span v-for="(key2,index) in costMap.keys()" :key="index">
						<span v-if="index!=0"> + </span>
						<span v-if="key2!='CNY'" style="color:red">{{key2}}</span>
						<span v-if="key2=='CNY'">{{key2}}</span>
						<span>{{getNumber(costMap.get(key2))}}</span>
					</span>
					)
				</span>
			</template>
			<template v-if="incomeServicePermissionButton||incomeFindServicePermissionButton">
				<span style="margin-left: 20px;">收入完成：
					<span v-if="frow.incomeRecorded" style="color:#67C23A;">✓</span>
					<span v-if="!frow.incomeRecorded&&frow.incomeStatus!='未录收入'" style="color:red;">✓</span>
					<!-- <span v-else style="color:red">✗</span> -->
				</span>
			</template>
			<template v-if="costServicePermissionButton||costFindServicePermissionButton">
				<span style="margin-left: 20px;">成本完成：
					<span v-if="frow.costRecorded" style="color:#67C23A">✓</span>
					<span v-if="!frow.costRecorded&&frow.costStatus!='未录成本'" style="color:red">✓</span>
					<!-- <span v-else style="color:red">✗</span> -->
				</span>
			</template>
		</div>
		<el-table v-if="incomeServicePermissionButton||incomeFindServicePermissionButton" ref="topicTable" :data="incomeCosts.data" style="width: 100%;margin-bottom: 20px;" border @cell-click="handlerOrderCellClick" @selection-change="handleSelectionChange" :header-cell-style="{background:'oldlace'}" :row-class-name="tableRowClassName">
			<el-table-column :selectable="checkSelectable" type="selection" width="40" v-if="viewFlag">
			</el-table-column>


			<el-table-column prop="serviceName" label="应收服务" width="170"></el-table-column>
			<el-table-column prop="customerName" label="收款客户" min-width="230"></el-table-column>
			<el-table-column prop="serviceNote" label="备注" min-width="100"></el-table-column>
			<el-table-column align="right" prop="incomeQuantity" label="数量" width="110"></el-table-column>
			<el-table-column align="right" prop="incomeUnitPrice" label="单价" :formatter="formatterNumber1" width="110"></el-table-column>
			<el-table-column align="center" label="币种" width="55">
				<template slot-scope="scope">
					<span v-if="scope.row.incomeCurrency!='CNY'" style="color:red">{{scope.row.incomeCurrency}}</span>
					<span v-else>{{scope.row.incomeCurrency}}</span>
				</template>
			</el-table-column>
			<el-table-column align="right" prop="incomeAmount" label="应收金额" width="110" :formatter="formatterNumber2">
			</el-table-column>
			<el-table-column align="right" prop="incomeFunctionalAmount" label="应收本币金额" :formatter="formatterNumber3" width="110"></el-table-column>
			<el-table-column align="center" label="账单号" width="150">
				<template slot-scope="scope">
					<span style="text-decoration: underline;">{{scope.row.debitNoteNum}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="financialDate" label="锁账日期" width="90" :formatter="formatterNumber111"></el-table-column>
		</el-table>
		<el-table v-if="costServicePermissionButton||costFindServicePermissionButton" ref="topicTable2" :data="incomeCosts.data2" style="width: 100%;margin-bottom: 20px;" border :header-cell-style="{background:'#d2f4c0'}" :row-class-name="tableRowClassName">
			<el-table-column width="40" v-if="viewFlag">
				<template slot-scope="scope">
					<i></i>
				</template>
			</el-table-column>

			<el-table-column prop="serviceName" label="应付服务" width="170"></el-table-column>
			<el-table-column prop="customerName" label="付款对象" min-width="230"></el-table-column>
			<el-table-column prop="serviceNote" label="备注" min-width="100"></el-table-column>
			<el-table-column align="right" prop="costQuantity" label="数量" width="110"></el-table-column>
			<el-table-column align="right" prop="costUnitPrice" label="单价" :formatter="formatterNumbercost1" width="110"></el-table-column>
			<el-table-column align="center" label="币种" width="55">
				<template slot-scope="scope">
					<span v-if="scope.row.costCurrency!='CNY'" style="color:red">{{scope.row.costCurrency}}</span>
					<span v-else>{{scope.row.costCurrency}}</span>
				</template>
			</el-table-column>
			<el-table-column align="right" prop="costAmount" label="应付金额" width="110" :formatter="formatterNumbercost2">
			</el-table-column>
			<el-table-column align="right" prop="costFunctionalAmount" label="应付本币金额" :formatter="formatterNumbercost3" width="110"></el-table-column>
			<el-table-column align="center" label="对账单号" width="150">
				<template slot-scope="scope" v-if="scope.row.paymentNum">
					<p v-for="(item,index) in scope.row.paymentNum.split(',')" :key="index">
						<font>{{item}}</font>
					</p>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="financialDate" label="锁账日期" width="90" :formatter="formatterNumber111"></el-table-column>
		</el-table>
		<saveIncome ref="addMission" v-if="saveIncome" :visible.sync="saveIncome" :frow="ffrow"></saveIncome>
		<billIncome ref="addMission" v-if="billIncome" :visible.sync="billIncome" :frow="ffrow"></billIncome>
		<billEditIncome ref="addMission" v-if="billEditIncome" :visible.sync="billEditIncome" :frow="ffrow"></billEditIncome>
		<orderDate ref="addMission" v-if="orderDate" :visible.sync="orderDate" :frow="ffrow"></orderDate>
		<billSelectIncome ref="addMission" v-if="billSelectIncome" :visible.sync="billSelectIncome" :frow="ffrow"></billSelectIncome>
		<print ref="addMission" v-if="printVisible" :visible.sync="printVisible" :frow="ffrow"></print>
		<operationMore ref="addMission" v-if="operationMore" :visible.sync="operationMore" :frow="ffrow"></operationMore>
		<printMore ref="addMission" v-if="printMoreVisible" :visible.sync="printMoreVisible" :frow="ffrow"></printMore>
		<billSend ref="addMission" v-if="billSendVisible" :visible.sync="billSendVisible" :frow="ffrow"></billSend>
		<selectSendOrPrint ref="addMission" v-if="selectSendOrPrint" :visible.sync="selectSendOrPrint"></selectSendOrPrint>
		<billSendList ref="addMission" v-if="billSendListVisible" :visible.sync="billSendListVisible" :frow="ffrow"></billSendList>
	</div>

</template>
<style>
	.el-table .warning-row2 {
		background: oldlace;
		color: #409EFF;
		font-weight: bold !important;
	}

	.el-table .warning-row1 {
		background: oldlace;
		font-weight: bold !important;
	}

	.el-table .warning-row0 {
		color: #409EFF;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}
</style>
<script>
	import saveIncome from './order_income_save'
	import billIncome from '../order/af_order_bill_save'
	import billEditIncome from '../order/af_order_bill_edit'
	import orderDate from '../order/af_order_base_date'

	import billSelectIncome from '../order/af_order_bill_select'

	//账单打印
	import Print from '../cssDebitNote/af_debit_note_print'
	import PrintMore from '../order/cssDebitNotePrint/af_css_debit_note_select'
	import operationMore from '../order/cssDebitNotePrint/af_css_debit_note_select_operation'

	//发送账单
	import billSend from '../order/cssDebitNoteSend/af_css_debit_note_send'
	import selectSendOrPrint from '../order/show_select_send_or_print'
	import billSendList from '../order/cssDebitNoteSend/af_css_debit_note_send_list'


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
				incomeValue: 0,
				costValue: 0,
				incomeMap: [],
				costMap: [],
				viewFlag: true,
				finishButtonFlag: false,
				cancelButtonFlag: false,
				editButtonFlag: false,
				editButtonFlag2: false,
				letterButtonFlag: false,
				letterButtonFlag2: false,
				servicesButtonFlag: false,
				weighttagButtonFlag: false,
				weighttagButtonFlag2: false,
				logtagButtonFlag: false,
				incomeServicePermissionButton: false,
				costServicePermissionButton: false,
				incomeFindServicePermissionButton: false,
				costFindServicePermissionButton: false,
        printBusinessCalculationBillButton:false,
				activeName: 'first',
				currRow: '',
				currRow2: '',
				data1: [],
				options2: [],
				selections: [],
				useroptions: [],
				orderContacts: [],
				contactsOptions: [],
				productOptions: [],
				transitClauseOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				arrivalMethodOptions: [],
				customsDeclaresTypeOptions: [],
				cargoFlowTypeOptions: [],
				departureWarehouseOptions: [],
				departureStorehouseOptions: [],
				packageTypeOptions: [],
				paymentMethodOptions: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions: [],
				codeOptions: [],
				showFlag1: false,
				showFlag2: false,
				showFlag3: false,
				checkFlag1: false,
				checkFlag2: false,
				checkFlag3: false,
				checkFlag4: false,
				shipperConsignee2: false,
				showFlagConAndShipper: false,
				save: false,
				save2: false,
				saveawb: false,
				saveIncome: false,
				billIncome: false,
				billEditIncome: false,
				orderDate: false,
				billSelectIncome: false,
				printVisible: false,
				printMoreVisible: false,
				operationMore: false,
				billSendVisible: false,
				selectSendOrPrint: false,
				billSendListVisible: false,
				editVisible: false,
				disabledFlag: false,
				priceValueFlag: false,
				disabledFlag2: false,
				disabledFlag3: false,
				letterFlag: true,
				ffrow: {
					selections: [],
					awbFromType: ''
				},
				planVolume1: '',
				//incomeCosts---延伸服务开始-----
				debitNoteIdFlag: true,
				paymentIdFlag: true,
				incomeCosts: {
					data: [],
					data2: []
				}
				//incomeCosts---延伸服务结束-----
			};
		},
		inject: ['findByPage'],
		components: {
			'saveIncome': saveIncome,
			// 'editIncome': editIncome,
			'billIncome': billIncome,
			'billEditIncome': billEditIncome,
			'orderDate': orderDate,
			'billSelectIncome': billSelectIncome,
			'operationMore': operationMore,
			'print': Print,
			'printMore': PrintMore,
			'billSend': billSend,
			'selectSendOrPrint': selectSendOrPrint,
			'billSendList': billSendList
		},
		provide() {
			return {
				queryLogList: this.queryLogList,
				queryIncomeCostList: this.queryIncomeCostList,
				queryStatus: this.queryStatus,
				printBill: this.printBill,
				sendBill: this.sendBill,
				showSelectSendOrPrint: this.showSelectSendOrPrint
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
			inboundSuccess(info) {
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
			openError1(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},


			//延伸服务开始
			handleCommand(command) {
				if (command == 'edit') {
					this.showeditIncome(this.currRow)
				} else if (command == 'delete') {
					this.doDelete(this.currRow)
				} else if (command == 'addCost') {
					this.showsaveCost(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			showsaveIncome() {
				if (this.frow.businessScope.startsWith('A')) {
					this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
						.then((resp) => {
							this.frow.incomeRecorded = resp.data.data.incomeRecorded
							this.frow.incomeStatus = resp.data.data.incomeStatus
							this.frow.costRecorded = resp.data.data.costRecorded
							this.frow.costStatus = resp.data.data.costStatus

							if (this.incomeServicePermissionButton && this.costServicePermissionButton) {
								if (this.frow.incomeRecorded == true && this.frow.costRecorded == true) {
									this.openError("费用已经全部完成");
									return;
								}
							} else if (this.incomeServicePermissionButton) {
								if (this.frow.incomeRecorded == true) {
									this.openError("收入已完成，不能编辑费用");
									return;
								}
							} else if (this.costServicePermissionButton) {
								if (this.frow.costRecorded == true) {
									this.openError("成本已完成，不能编辑费用");
									return;
								}
							}
							let params = {
								orderUuid: this.frow.orderUuid,
								businessScope: this.frow.businessScope
							}
							this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
								if (response.data.code == 0) {
									if (response.data.data.length > 0) {
										this.openError("已经做过财务锁账");
										return;
									} else {
										this.ffrow = resp.data.data;
										this.ffrow.incomeServicePermissionButton = this.incomeServicePermissionButton
										this.ffrow.costServicePermissionButton = this.costServicePermissionButton
										this.saveIncome = true;
									}
								} else {
									this.openError(response.data.messageInfo);
								}
							}).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
						});
				} else if (this.frow.businessScope.startsWith('S')) {
					this.$axios.get('/sc/scOrder/' + this.frow.orderId).then((resp) => {
						this.frow.incomeRecorded = resp.data.data.incomeRecorded
						this.frow.incomeStatus = resp.data.data.incomeStatus
						this.frow.costRecorded = resp.data.data.costRecorded
						this.frow.costStatus = resp.data.data.costStatus
						if (this.incomeServicePermissionButton && this.costServicePermissionButton) {
							if (this.frow.incomeRecorded == true && this.frow.costRecorded == true) {
								this.openError("费用已经全部完成");
								return;
							}
						} else if (this.incomeServicePermissionButton) {
							if (this.frow.incomeRecorded == true) {
								this.openError("收入已完成，不能编辑费用");
								return;
							}
						} else if (this.costServicePermissionButton) {
							if (this.frow.costRecorded == true) {
								this.openError("成本已完成，不能编辑费用");
								return;
							}
						}
						let params = {
							orderUuid: this.frow.orderUuid,
							businessScope: this.frow.businessScope
						}
						this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
							if (response.data.code == 0) {
								if (response.data.data.length > 0) {
									this.openError("已经做过财务锁账");
									return;
								} else {
									this.ffrow = resp.data.data;
									this.ffrow.incomeServicePermissionButton = this.incomeServicePermissionButton
									this.ffrow.costServicePermissionButton = this.costServicePermissionButton
									this.saveIncome = true;
								}
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}.bind(this));
					})
				} else if (this.frow.businessScope.startsWith('T')) {
					this.$axios.get('/sc/tcOrder/' + this.frow.orderId).then((resp) => {
						this.frow.incomeRecorded = resp.data.data.incomeRecorded
						this.frow.incomeStatus = resp.data.data.incomeStatus
						this.frow.costRecorded = resp.data.data.costRecorded
						this.frow.costStatus = resp.data.data.costStatus
						if (this.incomeServicePermissionButton && this.costServicePermissionButton) {
							if (this.frow.incomeRecorded == true && this.frow.costRecorded == true) {
								this.openError("费用已经全部完成");
								return;
							}
						} else if (this.incomeServicePermissionButton) {
							if (this.frow.incomeRecorded == true) {
								this.openError("收入已完成，不能编辑费用");
								return;
							}
						} else if (this.costServicePermissionButton) {
							if (this.frow.costRecorded == true) {
								this.openError("成本已完成，不能编辑费用");
								return;
							}
						}
						let params = {
							orderUuid: this.frow.orderUuid,
							businessScope: this.frow.businessScope
						}
						this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
							if (response.data.code == 0) {
								if (response.data.data.length > 0) {
									this.openError("已经做过财务锁账");
									return;
								} else {
									this.ffrow = resp.data.data;
									this.ffrow.incomeServicePermissionButton = this.incomeServicePermissionButton
									this.ffrow.costServicePermissionButton = this.costServicePermissionButton
									this.saveIncome = true;
								}
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}.bind(this));
					})
				} else if (this.frow.businessScope == 'LC') {
					this.$axios.get('/sc/lcOrder/' + this.frow.orderId).then((resp) => {
						this.frow.incomeRecorded = resp.data.data.incomeRecorded
						this.frow.incomeStatus = resp.data.data.incomeStatus
						this.frow.costRecorded = resp.data.data.costRecorded
						this.frow.costStatus = resp.data.data.costStatus
						if (this.incomeServicePermissionButton && this.costServicePermissionButton) {
							if (this.frow.incomeRecorded == true && this.frow.costRecorded == true) {
								this.openError("费用已经全部完成");
								return;
							}
						} else if (this.incomeServicePermissionButton) {
							if (this.frow.incomeRecorded == true) {
								this.openError("收入已完成，不能编辑费用");
								return;
							}
						} else if (this.costServicePermissionButton) {
							if (this.frow.costRecorded == true) {
								this.openError("成本已完成，不能编辑费用");
								return;
							}
						}
						this.$axios.get('/sc/lcOrder/' + this.frow.orderId).then((response) => {
							if (response.data.code == 0) {
								if (response.data.data && response.data.data.orderStatus == '财务锁账') {
									this.openError("已经做过财务锁账");
									return;
								} else {
									this.ffrow = resp.data.data;
									this.ffrow.incomeServicePermissionButton = this.incomeServicePermissionButton
									this.ffrow.costServicePermissionButton = this.costServicePermissionButton
									this.saveIncome = true;
								}
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}.bind(this));
					})
				} else if (this.frow.businessScope == 'IO') {
					this.$axios.get('/sc/ioOrder/' + this.frow.orderId).then((resp) => {
						this.frow.incomeRecorded = resp.data.data.incomeRecorded
						this.frow.incomeStatus = resp.data.data.incomeStatus
						this.frow.costRecorded = resp.data.data.costRecorded
						this.frow.costStatus = resp.data.data.costStatus
						if (this.incomeServicePermissionButton && this.costServicePermissionButton) {
							if (this.frow.incomeRecorded == true && this.frow.costRecorded == true) {
								this.openError("费用已经全部完成");
								return;
							}
						} else if (this.incomeServicePermissionButton) {
							if (this.frow.incomeRecorded == true) {
								this.openError("收入已完成，不能编辑费用");
								return;
							}
						} else if (this.costServicePermissionButton) {
							if (this.frow.costRecorded == true) {
								this.openError("成本已完成，不能编辑费用");
								return;
							}
						}
						this.$axios.get('/sc/ioOrder/' + this.frow.orderId).then((response) => {
							if (response.data.code == 0) {
								if (response.data.data && response.data.data.orderStatus == '财务锁账') {
									this.openError("已经做过财务锁账");
									return;
								} else {
									this.ffrow = resp.data.data;
									this.ffrow.incomeServicePermissionButton = this.incomeServicePermissionButton
									this.ffrow.costServicePermissionButton = this.costServicePermissionButton
									this.saveIncome = true;
								}
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}.bind(this));
					})
				}
			},
			showeditIncome(currRow) {
				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.openError("已经做过财务锁账");
							return;
						} else {
							if (currRow.sstype == 1) {
								this.ffrow.businessScope = this.frow.businessScope;
								this.ffrow.orderId = this.frow.orderId;
								this.ffrow.orderUuid = this.frow.orderUuid;
								this.ffrow.debitNoteIdFlag = this.debitNoteIdFlag;
								this.ffrow.paymentIdFlag = this.paymentIdFlag;
								this.ffrow.incomeId = currRow.incomeId
								this.editIncome = true;
							} else {
								this.ffrow.businessScope = this.frow.businessScope;
								this.ffrow.orderId = this.frow.orderId;
								this.ffrow.orderUuid = this.frow.orderUuid;
								this.ffrow.debitNoteIdFlag = this.debitNoteIdFlag;
								this.ffrow.paymentIdFlag = this.paymentIdFlag;
								this.ffrow.incomeId = currRow.incomeId
								this.editIncome = true;
							}
						}

					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));


			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (row.sstype == 1) {
					if (row.paymentId || row.debitNoteId) {
						return 'warning-row2';
					} else {
						return 'warning-row1';
					}
				} else {
					if (row.paymentId || row.paymentNum || row.debitNoteId) {
						return 'warning-row0';
					}
				}
			},
			handleSelectionChange(val) {
				this.selections = val;
			},

			showSelectSendOrPrint(debitNoteId) {
				this.$confirm('是否发送/账单预览?', '注意选择', {
					distinguishCancelAndClose: true,
					confirmButtonText: '账单预览',
					cancelButtonText: '发送账单',
					type: 'warning',
					center: true
				}).then(() => {
					this.printBill2(debitNoteId);
				}).catch((action) => {
					if (action === 'cancel') {
						this.sendBill2(debitNoteId);
					} else {}

				});
			},
			showBill() {
				this.ffrow.selections = this.selections;
				if (this.ffrow.selections.length == 0) {
					this.openError("请勾选应收服务");
					return;
				}
				if (this.ffrow.selections.length > 1) {
					let a = this.ffrow.selections[0].customerName;
					let b = this.ffrow.selections[0].incomeCurrency;
					let c = this.ffrow.selections[0].incomeAmountTaxRate;
					let aFlag = 0;
					let bFlag = 0;
					let cFlag = 0;
					this.ffrow.selections.forEach((row) => {
						if (a != row.customerName) {
							aFlag = 1;
						}
						if (b != row.incomeCurrency) {
							bFlag = 1;
						}
						if (c != row.incomeAmountTaxRate) {
							cFlag = 1;
						}
					})
					if (aFlag === 1) {
						this.openError("请选择相同收款客户");
						return;
					}
					if (cFlag === 1) {
						this.openError("请选择相同税率");
						return;
					}
				}
				this.ffrow.orderId = this.frow.orderId;
				this.ffrow.orderUuid = this.frow.orderUuid
				this.ffrow.businessScope = this.frow.businessScope;

        let params = {
          customerName:this.ffrow.selections[0].customerName,
          currency:this.ffrow.selections[0].incomeCurrency,
          amountTaxRate:this.ffrow.selections[0].amountTaxRate,
          orderUuid:this.ffrow.orderUuid
        };
        //
				// let params = '{"customerName":"' + this.ffrow.selections[0].customerName.replace('韵航	6052','韵航6052') + '","currency":"' + this.ffrow.selections[
				// 		0].incomeCurrency + '","amountTaxRate":"' + this.ffrow.selections[0].incomeAmountTaxRate + '","orderUuid":"' +
				// 	this.frow.orderUuid + '"}';
				this.$axios.post2('/afbase/cssDebitNote/queryHavedBill', params)
					.then(function(response) {
						if (response.data.code == 0) {
							if (response.data.data.length === 0) {
								this.billIncome = true;
							} else {
								this.$confirm('是否将收入加入已有账单？?', '提示', {
									confirmButtonText: '是',
									cancelButtonText: '否',
									type: 'warning',
									center: true
								}).then(() => {
									this.ffrow.dataList = response.data.data;
									this.billSelectIncome = true;
								}).catch(() => {
									this.billIncome = true;
								});
							}

						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this));
			},
			deleteBill() {
				this.ffrow.operationName = "删除";
				this.ffrow.orderCode = this.frow.orderCode;
				this.ffrow.orderUuid = this.frow.orderUuid;
				this.ffrow.awbNumber = this.frow.awbNumber;
				this.ffrow.awbUuid = this.frow.awbUuid;
				this.ffrow.businessScope = this.frow.businessScope;
				this.operationMore = true;
			},
			doIncome() {
				let flag = 1;
				for (var i = 0; i < this.incomeCosts.data.length; i++) {
					if (parseFloat(this.incomeCosts.data[i].incomeAmount) === 0) {
						flag = 0;
						break;
					}
				}
				if (flag === 0) {
					this.openError("有应收金额为0的数据，不允许收入完成");
					return;
				}
				this.$confirm('将该业务设为收入完成状态，是否继续？', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {

					this.$axios.post2('/afbase/aforder/doIncome', this.frow).then((response) => {
						if (response.data.code == 0) {
							this.openSuccess("操作成功");
							this.findByPage();
							this.frow.incomeRecorded = true;
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						if (errorinfo.indexOf('该业务收入已经录入完毕') > -1) {
							this.openError(errorinfo);
						}
						if (errorinfo.indexOf('该订单已经收入完成') > -1) {
							this.openError(errorinfo);
						}
					}.bind(this));
				}).catch(() => {

				});
			},
			doCost() {
        if(this.frow.businessScope=='AE'){
          //成本完成 判断是否签单
          this.$axios.get2('/afbase/rountingsign/check/costRecord/'+this.frow.orderId).then((response)=> {
            if(response.data.code==0){
                 this.$confirm('将该业务设为成本完成状态，是否继续？', '注意', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                   type: 'warning',
                   center: false
                 }).then(() => {
                   this.$axios.post2('/afbase/aforder/doCost', this.frow).then((response) => {
                     if (response.data.code == 0) {
                       this.openSuccess("操作成功");
                       this.findByPage();
                       this.frow.costRecorded = true;
                     } else {
                       this.openError(response.data.messageInfo);
                     }
                   }).catch(function(error) {
                     let errorinfo = error.response.data.messageInfo;
                     if (errorinfo.indexOf('该业务成本已经录入完毕') > -1) {
                       this.openError(errorinfo);
                     }
                     if (errorinfo.indexOf('该订单已经成本完成') > -1) {
                       this.openError(errorinfo);
                     }
                   }.bind(this));
                 }).catch(() => {

                 });
            }else{
              this.openError(response.data.messageInfo);
            }
            });
        }else{
           this.$confirm('将该业务设为成本完成状态，是否继续？', '注意', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
             center: false
           }).then(() => {
             this.$axios.post2('/afbase/aforder/doCost', this.frow).then((response) => {
               if (response.data.code == 0) {
                 this.openSuccess("操作成功");
                 this.findByPage();
                 this.frow.costRecorded = true;
               } else {
                 this.openError(response.data.messageInfo);
               }
             }).catch(function(error) {
               let errorinfo = error.response.data.messageInfo;
               if (errorinfo.indexOf('该业务成本已经录入完毕') > -1) {
                 this.openError(errorinfo);
               }
               if (errorinfo.indexOf('该订单已经成本完成') > -1) {
                 this.openError(errorinfo);
               }
             }.bind(this));
           }).catch(() => {

           });
        }


			},
			finishBill() {
				if (this.incomeCosts.data.length == 0 && this.incomeCosts.data2.length == 0) {
					this.openError("订单无收入和成本");
					return;
				}
				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.openError("已经做过财务锁账");
							return;
						} else {
							this.checkFinishBill();
						}

					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));


			},
			doFinishBill() {
				// this.ffrow.orderUuid = this.frow.orderUuid;
				// this.ffrow.businessScope = this.frow.businessScope;
				this.ffrow = this.frow;
				this.orderDate = true;
			},
			isDoFinishBill() {
				this.$confirm('应收没有制作过账单，是否继续财务锁账？', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					this.doFinishBill();
				}).catch(() => {});
			},
			checkFinishBill() {
				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderIncomeStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.doFinishBill();
						} else {
							this.isDoFinishBill();
						}

					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));

			},
			cancelBill() {
				this.$confirm('请确认,是否财务解锁?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let params = {
						orderUuid: this.frow.orderUuid,
						orderCode: this.frow.orderCode,
						orderId: this.frow.orderId,
						businessScope: this.frow.businessScope
					}
					this.$axios.post2('/afbase/aforder/doCancel', params).then((response) => {
						if (response.data.code == 0) {
							this.openSuccess("操作成功");
							this.findByPage();
							// this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						if (errorinfo.indexOf('未做财务锁账') > -1) {
							this.openError(errorinfo);
						}
					}.bind(this));
				}).catch(() => {});
			},
			printBill2(debitNoteId) {
				if (!debitNoteId) {
					debitNoteId = null;
				}
				let queryP = {
					orderCode: this.frow.orderCode,
					businessScope: this.frow.businessScope,
					debitNoteId: debitNoteId
				}
				this.$axios.get2('/afbase/debitNote/selectOperation2', queryP).then((response) => {
					if (response.data.data.length === 1) {
						this.ffrow.data = response.data.data;
						this.ffrow.businessScope = this.frow.businessScope;
						this.printVisible = true;
					} else if (response.data.data.length > 1) {
						this.inboundSuccess("账单太多，请选择")
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});

			},
			printBill() {
				let queryP = {
					orderCode: this.frow.orderCode,
					businessScope: this.frow.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if (response.data.data.length === 1) {
						this.ffrow.data = response.data.data;
						this.ffrow.businessScope = this.frow.businessScope;
						this.printVisible = true;
					} else if (response.data.data.length > 1) {
						this.ffrow.orderCode = this.frow.orderCode;
						this.ffrow.businessScope = this.frow.businessScope;
						this.printMoreVisible = true;
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});

			},
			sendBill2(debitNoteId) {
				if (!debitNoteId) {
					debitNoteId = null;
				}
				let queryP = {
					orderCode: this.frow.orderCode,
					businessScope: this.frow.businessScope,
					debitNoteId: debitNoteId
				}
				this.$axios.get2('/afbase/debitNote/selectOperation2', queryP).then((response) => {
					if (response.data.data.length === 1) {

						this.ffrow = this.frow
						this.ffrow.data = response.data.data[0]
						this.ffrow.count = "one"
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
						this.billSendVisible = true;
					} else if (response.data.data.length > 1) {
						this.inboundSuccess("账单太多，请选择")
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});

			},
			sendBill() {
				let queryP = {
					orderCode: this.frow.orderCode,
					businessScope: this.frow.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if (response.data.data.length === 1) {
						this.ffrow = this.frow
						this.ffrow.data = response.data.data[0]
						this.ffrow.count = "one"
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
						this.billSendVisible = true;
					} else if (response.data.data.length > 1) {
						this.ffrow = this.frow
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
						this.billSendListVisible = true
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});
			},
			printBusinessCalculationBill() {
				this.$axios.get('/afbase/aforder/printBusinessCalculationBill/' + this.frow.businessScope + '/' + this.frow.orderId)
					.then((response) => {
						window.open(response.data.data)
					}).catch(function(error) {
						console.log(error);
					})
			},
			showsaveCost(currRow) {
				this.ffrow.orderId = currRow.orderId;
				this.ffrow.orderUuid = currRow.orderUuid;
				this.ffrow.incomeId = currRow.incomeId;
				this.ffrow.coopId = currRow.customerId;
				this.ffrow.coopName = currRow.customerName;
				this.ffrow.serviceId = currRow.serviceId;
				this.ffrow.serviceName = currRow.serviceName;
				this.saveCost = true;
			},
			showTax() {
				this.taxFalg = !this.taxFalg;
			},
			doDelete(row) {
				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.openError("已经做过财务锁账");
							return;
						} else {
							if (row.sstype == 1) {
								this.doDeleteIncome(row);
							} else {
								this.doDeleteCost(row);
							}
						}

					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));

			},
			doDeleteIncome(row) {

				this.$axios.get('/afbase/income/view/' + row.incomeId + '/' + row.businessScope)
					.then(function(response) {
						if (response.data.data.debitNoteId) {
							this.openError("已出账");
							return;
						}
						if (response.data.data.financialDate) {
							this.openError("应收已关账");
							return;
						}

						for (var j = 0; j < response.data.data.costs.length; j++) {
							//						if(response.data.data.costs[j].paymentId ) {
							if (response.data.data.costs[j].costAmountPayment != null && response.data.data.costs[j].costAmountPayment > 0) {
								this.openError("已对账");
								return;
							}
							if (response.data.data.costs[j].financialDate) {
								this.openError("成本已关账");
								return;
							}
						}

						this.$confirm('你确定要删除吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
							center: true
						}).then(() => {
							let params = {
								incomeId: row.incomeId,
								businessScope: row.businessScope
							}
							this.$axios.post2('/afbase/income/doDelete', params)
								.then(function(response) {
									if (response.data.code == 0) {
										this.openSuccess();
										this.queryIncomeCostList(false);
									} else {
										this.openError(response.data.messageInfo);
									}
								}.bind(this));
						}).catch(() => {});

					}.bind(this));
			},
			doDeleteCost(row) {
				if (row.costAmountPayment != null && row.costAmountPayment > 0) {
					this.openError("已对账");
					return;
				}
				if (row.financialDate) {
					this.openError("已关账");
					return;
				}
				this.$confirm('你确定要删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					let params = {
						costId: row.costId,
						businessScope: row.businessScope
					}
					this.$axios.post2('/afbase/cost/doDelete', params)
						.then(function(response) {
							if (response.data.code == 0) {
								this.openSuccess();
								this.queryIncomeCostList(false);
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {});
			},
			formatter222(row, column) {
				if (row.sstype == 1) {
					return "(收)" + row.serviceName;
				} else if (row.sstype == 2) {
					return "(付)" + row.serviceName;
				} else {
					return "";
				}

			},
			formatter2(row, column) {
				if (row.sstype == 1) {
					return row.customerName;
				} else if (row.sstype == 2) {
					return row.customerName;
				} else {
					return "";
				}

			},

			formatter3(row, column) {
				if (row.sstype == 2) {
					return row.customerName;
				} else {
					return "";
				}

			},
			formatterNumber111(row, column) {
				if (row.financialDate) {
					return row.financialDate.substr(0, 10);
				}

			},
			formatterNumber1(row, column) {
				if (row.incomeUnitPrice === '' || row.incomeUnitPrice === 'null' || row.incomeUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(row.incomeUnitPrice);
				}
			},
			formatterNumbercost1(row, column) {
				if (row.costUnitPrice === '' || row.costUnitPrice === 'null' || row.costUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(row.costUnitPrice);
				}
			},
			formatterNumber2(row, column) {
				if (row.incomeAmount === '' || row.incomeAmount === 'null' || row.incomeAmount == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmount);
				}
			},
			formatterNumbercost2(row, column) {
				if (row.costAmount === '' || row.costAmount === 'null' || row.costAmount == null) {
					return "";
				} else {
					return this.getNumber(row.costAmount);
				}
			},
			formatterNumber3(row, column) {
				if (row.treeId == -1) {
					return "(收)" + this.getNumber(row.incomeFunctionalAmount) + "\n(付)" + this.getNumber(row.costFunctionalAmount)
				} else if (row.incomeFunctionalAmount === '' || row.incomeFunctionalAmount === 'null' || row.incomeFunctionalAmount ==
					null) {
					return "";
				} else {
					return this.getNumber(row.incomeFunctionalAmount);
				}
			},
			formatterNumbercost3(row, column) {
				if (row.costFunctionalAmount === '' || row.costFunctionalAmount === 'null' || row.costFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.costFunctionalAmount);
				}
			},
			formatterNumber4(row, column) {
				if (row.incomeAmountNotTax === '' || row.incomeAmountNotTax === 'null' || row.incomeAmountNotTax == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmountNotTax);
				}
			},
			formatterNumber5(row, column) {
				if (row.incomeAmountTax === '' || row.incomeAmountTax === 'null' || row.incomeAmountTax == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmountTax);
				}
			},
			formatterNumber6(row, column) {
				if (row.costUnitPrice === '' || row.costUnitPrice === 'null' || row.costUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(row.costUnitPrice);
				}
			},
			formatterNumber7(row, column) {
				if (row.costAmount === '' || row.costAmount === 'null' || row.costAmount == null) {
					return "";
				} else {
					return this.getNumber(row.costAmount);
				}
			},
			formatterNumber8(row, column) {
				if (row.costFunctionalAmount === '' || row.costFunctionalAmount === 'null' || row.costFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.costFunctionalAmount);
				}
			},
			formatterNumber9(row, column) {
				if (row.costAmountNotTax === '' || row.costAmountNotTax === 'null' || row.costAmountNotTax == null) {
					return "";
				} else {
					return this.getNumber(row.costAmountNotTax);
				}
			},
			formatterNumber10(row, column) {
				if (row.costAmountTax === '' || row.costAmountTax === 'null' || row.costAmountTax == null) {
					return "";
				} else {
					return this.getNumber(row.costAmountTax);
				}
			},
			formatterNumber11(row, column) {
				if (row.profitAmount === '' || row.profitAmount === 'null' || row.profitAmount == null) {
					return "";
				} else {
					return this.getNumber(row.profitAmount);
				}
			},
			formatterNumber12(row, column) {
				if (row.noTaxProfitAmount === '' || row.noTaxProfitAmount === 'null' || row.noTaxProfitAmount == null) {
					return "";
				} else {
					return this.getNumber(row.noTaxProfitAmount);
				}
			},
			formatterNumber13(row, column) {
				if (row.inboundVolumeWeight === '' || row.inboundVolumeWeight === 'null' || row.inboundVolumeWeight == null) {
					return "";
				} else {
					return parseFloat(row.inboundVolumeWeight).toFixed(1);
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			checkSelectable(row, index) {
				if (row.debitNoteId == null) {
					return true;
				} else {
					return false;
				}

			},
			queryStatus() {
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(
					response) {
					if (!response.data.data) {
						this.editButtonFlag2 = true;
						this.letterButtonFlag2 = true;
					} else {
						this.editButtonFlag2 = false;
						this.letterButtonFlag2 = false;
					}
				}.bind(this));
			},
			queryIncomeCostList(flag) {
				if (flag) {
					//更新成本收入完成状态
					if (this.frow.businessScope.startsWith('A')) {
						this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
							.then((response) => {
								this.frow.incomeRecorded = response.data.data.incomeRecorded
								this.frow.incomeStatus = response.data.data.incomeStatus
								this.frow.costRecorded = response.data.data.costRecorded
								this.frow.costStatus = response.data.data.costStatus
								this.$forceUpdate()
							});
					} else if (this.frow.businessScope.startsWith('S')) {
						this.$axios.get('/sc/scOrder/' + this.frow.orderId).then((response) => {
							this.frow.incomeRecorded = response.data.data.incomeRecorded
							this.frow.incomeStatus = response.data.data.incomeStatus
							this.frow.costRecorded = response.data.data.costRecorded
							this.frow.costStatus = response.data.data.costStatus
							this.$forceUpdate()
						})
					} else if (this.frow.businessScope.startsWith('T')) {
						this.$axios.get('/sc/tcOrder/' + this.frow.orderId).then((response) => {
							this.frow.incomeRecorded = response.data.data.incomeRecorded
							this.frow.incomeStatus = response.data.data.incomeStatus
							this.frow.costRecorded = response.data.data.costRecorded
							this.frow.costStatus = response.data.data.costStatus
							this.$forceUpdate()
						})
					} else if (this.frow.businessScope.startsWith('L')) {
						this.$axios.get('/sc/lcOrder/' + this.frow.orderId).then((response) => {
							this.frow.incomeRecorded = response.data.data.incomeRecorded
							this.frow.incomeStatus = response.data.data.incomeStatus
							this.frow.costRecorded = response.data.data.costRecorded
							this.frow.costStatus = response.data.data.costStatus
							this.$forceUpdate()
						})
					} else if (this.frow.businessScope == 'IO') {
						this.$axios.get('/sc/ioOrder/' + this.frow.orderId).then((response) => {
							this.frow.incomeRecorded = response.data.data.incomeRecorded
							this.frow.incomeStatus = response.data.data.incomeStatus
							this.frow.costRecorded = response.data.data.costRecorded
							this.frow.costStatus = response.data.data.costStatus
							this.$forceUpdate()
						})
					}

				}
				if (this.frow.orderId) {

				} else {
					this.incomeCosts.data = [];
					this.incomeCosts.data2 = [];
				}
				let params = {
					orderId: this.frow.orderId,
					businessScope: this.frow.businessScope
				}
				this.$axios.get2('/afbase/afIncomeCost/getIncomeCostList', params).then(function(response) {
					this.incomeCosts.data = response.data.data.incomeList;
					this.incomeCosts.data2 = response.data.data.costList;
					this.setTotalCost();
				}.bind(this));
			},
			setTotalCost() {
				this.incomeValue = 0;
				this.costValue = 0;
				var map = new Map();
				var map2 = new Map();
				for (var i = 0; i < this.incomeCosts.data.length; i++) {
					this.incomeValue = this.incomeValue + parseFloat(this.incomeCosts.data[i].incomeFunctionalAmount)
					if (map.has(this.incomeCosts.data[i].incomeCurrency)) {
						map.set(this.incomeCosts.data[i].incomeCurrency, map.get(this.incomeCosts.data[i].incomeCurrency) + parseFloat(
							this.incomeCosts.data[i].incomeAmount));
					} else {
						map.set(this.incomeCosts.data[i].incomeCurrency, parseFloat(this.incomeCosts.data[i].incomeAmount));
					}
				}

				for (var i = 0; i < this.incomeCosts.data2.length; i++) {
					this.costValue = this.costValue + parseFloat(this.incomeCosts.data2[i].costFunctionalAmount)
					if (map2.has(this.incomeCosts.data2[i].costCurrency)) {
						map2.set(this.incomeCosts.data2[i].costCurrency, map2.get(this.incomeCosts.data2[i].costCurrency) + parseFloat(
							this.incomeCosts.data2[i].costAmount));
					} else {
						map2.set(this.incomeCosts.data2[i].costCurrency, parseFloat(this.incomeCosts.data2[i].costAmount));
					}
				}
				this.incomeMap = map;
				this.costMap = map2;
			},
			sychronizeWareAndStore() {
				if (this.ruleForm.departureStation != null && this.ruleForm.departureStation !== '') {
					this.ruleForm.departureStation = this.ruleForm.departureStation.trim().toUpperCase()
					this.$axios.get('/afbase/warehouse/getByDeparture?type=货站&departureStation=' + this.ruleForm.departureStation).then(
						function(response) {
							this.departureWarehouseOptions = response.data.data;
						}.bind(this));
					this.$axios.get('/afbase/warehouse/getByDeparture?type=库房&departureStation=' + this.ruleForm.departureStation).then(
						function(response) {
							this.departureStorehouseOptions = response.data.data;
						}.bind(this));
				}
			},
			handlerOrderCellClick(row, column, cell, event) {
				if ("账单号" == column['label']) {
					if (row.debitNoteNum) {
						let rows = [];
						row.awbNumber = this.frow.awbNumber
						row.orderCode = this.frow.orderCode
						rows.push(row);
						this.ffrow.data = rows;
						this.ffrow.businessScope = this.frow.businessScope;
						this.printVisible = true;
					}
				}
			},
			sychronizeWareAndStore1() {
				this.ruleForm.departureStorehouseId = '';
				this.ruleForm.departureWarehouseId = '';
			},

			//延伸服务结束




		},
		created() {
			this.viewFlag = this.frow.viewFlag;
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
			}.bind(this));
			let params = {
				coopId: this.frow.coopId
			}
			this.$axios.get2('/prm/coop/queryContactsIsValid',
					params)
				.then(function(response) {
					this.contactsOptions = response.data.data;
					if (this.contactsOptions != null && this.contactsOptions.length > 0) {
						this.orderContacts.push(this.contactsOptions[0].contacts_id)
					}
				}.bind(this));
			//按钮权限开始
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('af-order-bill-finish') > -1) {
				this.finishButtonFlag = true;
			}
			if (buttonInfo.indexOf('af-order-bill-cancel') > -1) {
				this.cancelButtonFlag = true;
			}
			//权限按钮区分成本录入和收入录入incomeServicePermissionButton
			if (this.frow.businessScope == 'AE') {
        if(buttonInfo.indexOf('"af-order-services-income-calculation-bill"') > -1){
          this.printBusinessCalculationBillButton = true;
        }
				if (buttonInfo.indexOf('"af-order-services-income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"af-order-services-cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('af-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('af-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'AI') {
				if (buttonInfo.indexOf('"ai-order-services-income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"ai-order-services-cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('ai-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('ai-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'SE') {
				if (buttonInfo.indexOf('"se_order_service_income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"se_order_service_cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('se-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('se-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'SI') {
				if (buttonInfo.indexOf('"si_order_service_income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"si_order_service_cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('si-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('si-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'TE') {
				if (buttonInfo.indexOf('"te_order_service_income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"te_order_service_cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('te-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('te-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'TI') {
				if (buttonInfo.indexOf('"ti_order_service_income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"ti_order_service_cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('ti-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('ti-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'LC') {
				if (buttonInfo.indexOf('"lc_order_service_income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"lc_order_service_cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('lc-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('lc-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			} else if (this.frow.businessScope == 'IO') {
				if (buttonInfo.indexOf('"io_order_service_income"') > -1) {
					this.incomeServicePermissionButton = true
				}
				if (buttonInfo.indexOf('"io_order_service_cost"') > -1) {
					this.costServicePermissionButton = true
				}
				if (buttonInfo.indexOf('io-order-services-income-find') > -1) {
					this.incomeFindServicePermissionButton = true
				}
				if (buttonInfo.indexOf('io-order-services-cost-find') > -1) {
					this.costFindServicePermissionButton = true
				}
			}

			//延伸服务开始
			this.queryIncomeCostList(true);

			//延伸服务结束
		}
	}
</script>
