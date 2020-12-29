<template>

	<div>
		<el-row style="height:45px;" v-if="viewFlag">
			<el-col :span="22">
				<el-button type="primary" size="small" @click="showsaveIncome">增加费用</el-button>
				<!-- <el-button type="primary" size="small" @click="showTax">显示/隐藏详情</el-button> -->
				<el-button type="primary" size="small" @click="showBill">制作账单</el-button>
				<el-button type="primary" size="small" @click="printBill">账单预览</el-button>
				<el-button type="primary" size="small" @click="sendBill">发送账单</el-button>
				<el-button type="primary" size="small" @click="deleteBill">删除账单</el-button>
				<el-button type="primary" size="small" @click="finishBill" v-if="finishButtonFlag">财务锁账</el-button>
				<el-button type="primary" size="small" @click="cancelBill" v-if="cancelButtonFlag">财务解锁</el-button>
			</el-col>
		</el-row>
		<el-table ref="topicTable" :data="incomeCosts.data" style="width: 100%;margin-bottom: 20px;" border row-key="treeId" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
			<el-table-column :selectable="checkSelectable" type="selection" fixed width="40" v-if="viewFlag">
			</el-table-column>
			<el-table-column label="操作" width="50" fixed type="index" align="center" v-if="viewFlag">
				<template slot-scope="scope" v-if="scope.row.treeId!=-1">
					<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
							<el-dropdown-item command="delete">删除</el-dropdown-item>
							<el-dropdown-item></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

				</template>

			</el-table-column>

			</el-table-column>
			<el-table-column prop="serviceName" label="服务" fixed width="220" :formatter="formatter222"></el-table-column>
			<el-table-column prop="customerName" label="结算对象" :formatter="formatter2" min-width="240"></el-table-column>
			<el-table-column prop="financialDate" label="结算日期" width="90" :formatter="formatterNumber111"></el-table-column>
			<el-table-column prop="incomeQuantity" label="数量" width="110"></el-table-column>
			<el-table-column prop="incomeUnitPrice" label="单价" :formatter="formatterNumber1" width="110"></el-table-column>
			<el-table-column align="center" label="币种" width="55">
				<template slot-scope="scope">
					<span v-if="scope.row.incomeCurrency!='CNY'" style="color:red">{{scope.row.incomeCurrency}}</span>
					<span v-else>{{scope.row.incomeCurrency}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="incomeAmount" label="金额（原币）" width="110" :formatter="formatterNumber2">
			</el-table-column>
			<el-table-column prop="incomeFunctionalAmount" label="金额（本币）" :formatter="formatterNumber3" width="110"></el-table-column>
			<!-- <el-table-column prop="incomeAmountTaxRate" label="税率" v-if="taxFalg" width="50"></el-table-column>
			<el-table-column prop="incomeAmountNotTax" label="无税金额" v-if="taxFalg" :formatter="formatterNumber4" width="110"></el-table-column>
			<el-table-column prop="incomeAmountTax" label="税额" v-if="taxFalg" :formatter="formatterNumber5" width="110"></el-table-column>
-->
			<el-table-column prop="profitAmount" label="毛利" :formatter="formatterNumber11" width="110" fixed="right"></el-table-column>
			<!-- <el-table-column prop="noTaxProfitAmount" label="无税毛利" v-if="taxFalg" fixed="right" :formatter="formatterNumber12" width="110"></el-table-column> -->

		</el-table>
		<saveIncome ref="addMission" v-if="saveIncome" :visible.sync="saveIncome" :frow="ffrow"></saveIncome>
		<editIncome ref="addMission" v-if="editIncome" :visible.sync="editIncome" :frow="ffrow"></editIncome>
		<billIncome ref="addMission" v-if="billIncome" :visible.sync="billIncome" :frow="ffrow"></billIncome>
		<billEditIncome ref="addMission" v-if="billEditIncome" :visible.sync="billEditIncome" :frow="ffrow"></billEditIncome>
		<orderDate ref="addMission" v-if="orderDate" :visible.sync="orderDate" :frow="ffrow"></orderDate>
		<billSelectIncome ref="addMission" v-if="billSelectIncome" :visible.sync="billSelectIncome" :frow="ffrow"></billSelectIncome>
		<print ref="addMission" v-if="printVisible" :visible.sync="printVisible" :frow="ffrow"></print>
		<operationMore ref="addMission" v-if="operationMore" :visible.sync="operationMore" :frow="ffrow"></operationMore>
		<printMore ref="addMission" v-if="printMoreVisible" :visible.sync="printMoreVisible" :frow="ffrow"></printMore>
		<billSend ref="addMission" v-if="billSendVisible" :visible.sync="billSendVisible" :frow="ffrow"></billSend>
		<selectSendOrPrint ref="addMission" v-if="selectSendOrPrint" :visible.sync="selectSendOrPrint" ></selectSendOrPrint>
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

	import saveIncome from '../order/af_order_income_save'
	import editIncome from '../order/af_order_income_edit'
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
				helpDocumentUrl: '',
				firstUrl: '',
				fourthUrl: '',
				secondUrl: '',
				fifthUrl: '',
				viewFlag : true,
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
				activeName: 'first',
				currRow: '',
				currRow2: '',
				data1: [],
				options2: [],
				selections: [],
				useroptions:[],
				orderContacts:[],
				contactsOptions: [],
				productOptions: [],
				transitClauseOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				arrivalMethodOptions: [],
				customsDeclaresTypeOptions:[],
				cargoFlowTypeOptions:[],
				departureWarehouseOptions: [],
				departureStorehouseOptions: [],
				packageTypeOptions: [],
				paymentMethodOptions: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions:[],
				codeOptions: [],
				showFlag1: false,
				showFlag2: false,
				showFlag3: false,
				checkFlag1:false,
				checkFlag2:false,
				checkFlag3:false,
				checkFlag4:false,
				shipperConsignee2: false,
				showFlagConAndShipper: false,
				save: false,
				save2: false,
				saveawb: false,
				saveIncome: false,
				editIncome: false,
				billIncome: false,
				billEditIncome: false,
				orderDate:false,
				billSelectIncome: false,
				printVisible: false,
				printMoreVisible: false,
				operationMore: false,
				billSendVisible: false,
				selectSendOrPrint:false,
				billSendListVisible: false,
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
					data: []
				},
				//incomeCosts---延伸服务结束-----




			};
		},
		inject: ['findByPage'],
		components: {
			'saveIncome': saveIncome,
			'editIncome': editIncome,
			'billIncome': billIncome,
			'billEditIncome': billEditIncome,
			'orderDate': orderDate,
			'billSelectIncome': billSelectIncome,
			'operationMore': operationMore,
			'print': Print,
			'printMore': PrintMore,
			'billSend': billSend,
			'selectSendOrPrint':selectSendOrPrint,
			'billSendList': billSendList
		},
		provide() {
			return {
				queryLogList: this.queryLogList,
				queryIncomeCostList: this.queryIncomeCostList,
				queryStatus: this.queryStatus,
				printBill:this.printBill,
				sendBill:this.sendBill,
				showSelectSendOrPrint:this.showSelectSendOrPrint
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



			//延伸服务开始
			handleCommand(command) {
				if(command == 'edit') {
					this.showeditIncome(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			showsaveIncome() {
				let params = {
						orderUuid: this.frow.orderUuid,
						businessScope: this.frow.businessScope
					}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
						if(response.data.code == 0) {
							if (response.data.data.length>0) {
								this.openError("已经做过财务锁账");
								return;
							}else{
								this.ffrow.orderId = this.frow.orderId;
								this.ffrow.orderUuid = this.frow.orderUuid;
								this.ffrow.coopId = this.frow.coopId;
								this.ffrow.coopName = this.frow.coopName;
								this.ffrow.businessScope = this.frow.businessScope;
								this.saveIncome = true;
							}

						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
					}.bind(this));

			},
			showeditIncome(currRow) {
				let params = {
						orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
					}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
						if(response.data.code == 0) {
							if (response.data.data.length>0) {
								this.openError("已经做过财务锁账");
								return;
							}else{
								if(currRow.sstype == 1) {
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
				if(row.sstype == 1) {
					if(row.paymentId || row.debitNoteId) {
						return 'warning-row2';
					} else {
						return 'warning-row1';
					}
				} else {
					if(row.paymentId || row.debitNoteId) {
						return 'warning-row0';
					}
				}
			},
			handleSelectionChange(val) {
				this.selections = val;
			},

			showSelectSendOrPrint(){
				// this.selectSendOrPrint=true;
				this.$confirm('是否发送/账单预览?', '注意选择', {
					distinguishCancelAndClose: true,
					confirmButtonText: '账单预览',
					cancelButtonText: '发送账单',
					type: 'warning',
					center: true
				}).then(() => {
					this.printBill2();
				}).catch((action) => {
					if(action === 'cancel'){
	                  this.sendBill2();
		            }else{
		            }

				});
			},
			showBill() {
				this.ffrow.selections = this.selections;
				if(this.ffrow.selections.length == 0) {
					this.openError("请勾选应收服务");
					return;
				}
				if(this.ffrow.selections.length > 1) {
					let a = this.ffrow.selections[0].customerName;
					let b = this.ffrow.selections[0].incomeCurrency;
					let c = this.ffrow.selections[0].incomeAmountTaxRate;
					let aFlag = 0;
					let bFlag = 0;
					let cFlag = 0;
					this.ffrow.selections.forEach((row) => {
						if(a != row.customerName) {
							aFlag = 1;
						}
						if(b != row.incomeCurrency) {
							bFlag = 1;
						}
						if(c != row.incomeAmountTaxRate) {
							cFlag = 1;
						}
					})
					if(aFlag === 1) {
						this.openError("请选择相同收款客户");
						return;
					}
					// if(bFlag === 1) {
					// 	this.openError("请选择相同币种");
					// 	return;
					// }
					if(cFlag === 1) {
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
        // let params = '{"customerName":"' + this.ffrow.selections[0].customerName.replace('韵航	6052','韵航6052') + '","currency":"' + this.ffrow.selections[0].incomeCurrency + '","amountTaxRate":"' + this.ffrow.selections[0].incomeAmountTaxRate + '","orderUuid":"' + this.frow.orderUuid + '"}';
				this.$axios.post2('/afbase/cssDebitNote/queryHavedBill', params)
					.then(function(response) {
						if(response.data.code == 0) {
							if(response.data.data.length === 0) {
								this.billIncome = true;
							} else {
								this.$confirm('是否将收入加入已有账单？?', '提示', {
									confirmButtonText: '是',
									cancelButtonText: '否',
									type: 'warning',
									center: true
								}).then(() => {
									// if(response.data.data.length===1){
									// 	this.ffrow.dataBean=response.data.data[0];
									// 	this.billEditIncome = true;
									// }else if(response.data.data.length>1){
									this.ffrow.dataList = response.data.data;
									this.billSelectIncome = true;
									// }
								}).catch(() => {
									this.billIncome = true;
								});
							}

						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this));
				// this.billIncome = true;
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
			finishBill() {
				if (this.incomeCosts.data.length==0) {
					this.openError("订单无收入或成本");
					return;
				}
				let params = {
						orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
					}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
						if(response.data.code == 0) {
							if (response.data.data.length>0) {
								this.openError("已经做过财务锁账");
								return;
							}else{
								this.ffrow.orderUuid = this.frow.orderUuid;
								this.ffrow.businessScope = this.frow.businessScope;
								this.orderDate=true;
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
					businessScope: this.frow.businessScope
					}
					this.$axios.post2('/afbase/aforder/doCancel', params).then((response) => {
						if(response.data.code == 0) {
							this.openSuccess("操作成功");
							this.findByPage();
							// this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						if(errorinfo.indexOf('未做财务锁账') > -1) {
							this.openError(errorinfo);
						}
					}.bind(this));
				}).catch(() => {
					// this.$message({
					// 	type: 'info',
					// 	message: '已取消删除'
					// });
				});
			},
			printBill2() {
				let queryP = {
					orderCode: this.frow.orderCode,
					businessScope : this.frow.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation2', queryP).then((response) => {
					if(response.data.data.length === 1) {
						this.ffrow.data = response.data.data;
						this.printVisible = true;
					} else if(response.data.data.length > 1) {
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
					businessScope : this.frow.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if(response.data.data.length === 1) {
						this.ffrow.data = response.data.data;
						this.printVisible = true;
					} else if(response.data.data.length > 1) {
						this.ffrow.orderCode = this.frow.orderCode;
						this.ffrow.businessScope = this.frow.businessScope;
						this.printMoreVisible = true;
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});
				// this.$axios.get2('/afbase/debitNote?size=10&current=1', queryP).then((response) => {
				// 	if(response.data.data.records.length === 1 && response.data.data.records[0].children.length === 1) {
				// 		this.ffrow.data = response.data.data.records[0].children;
				// 		this.printVisible = true;
				// 	} else if(response.data.data.records.length > 1 || (response.data.data.records.length === 1 && response.data.data.records[0].children.length > 1)) {
				// 		this.ffrow.orderCode = this.frow.orderCode;
				// 		this.printMoreVisible = true;
				// 	} else {
				// 		this.inboundSuccess("该订单无账单")
				// 	}
				// }).catch((error) => {

				// });
			},
			sendBill2() {
				let queryP = {
					orderCode: this.frow.orderCode,
					businessScope : this.frow.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation2', queryP).then((response) => {
					if(response.data.data.length === 1) {

						// this.ffrow.awbNumber = this.frow.awbNumber
						// this.ffrow.customerNumber = this.frow.customerNumber
						// this.ffrow.awbNumber = this.frow.awbNumber
						// this.ffrow.coopName = this.frow.coopName
						this.ffrow = this.frow
						this.ffrow.data = response.data.data[0]
						this.ffrow.count = "one"
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
						this.billSendVisible = true;
					} else if(response.data.data.length > 1) {
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
					businessScope : this.frow.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if(response.data.data.length === 1) {
						// this.ffrow.awbNumber = this.frow.awbNumber
						// this.ffrow.customerNumber = this.frow.customerNumber
						// this.ffrow.awbNumber = this.frow.awbNumber
						// this.ffrow.coopName = this.frow.coopName
						this.ffrow = this.frow
						this.ffrow.data = response.data.data[0]
						this.ffrow.count = "one"
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
						this.billSendVisible = true;
					} else if(response.data.data.length > 1) {
						// this.ffrow.businessScope = this.frow.businessScope;
						// this.ffrow.awbNumber = this.frow.awbNumber
						// this.ffrow.customerNumber = this.frow.customerNumber
						// this.ffrow.coopName = this.frow.coopName
						// this.ffrow.orderCode = this.frow.orderCode
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
			showTax() {
				this.taxFalg = !this.taxFalg;
			},
			doDelete(row) {
				let params = {
						orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
					}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
						if(response.data.code == 0) {
							if (response.data.data.length>0) {
								this.openError("已经做过财务锁账");
								return;
							}else{
								if(row.sstype == 1) {
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

				this.$axios.get('/afbase/income/view/' + row.incomeId+'/'+row.businessScope)
					.then(function(response) {
						if(response.data.data.debitNoteId) {
							this.openError("已出账");
							return;
						}
						if(response.data.data.financialDate) {
							this.openError("应收已关账");
							return;
						}

						for(var j = 0; j < response.data.data.costs.length; j++) {
							//						if(response.data.data.costs[j].paymentId ) {
							if(response.data.data.costs[j].costAmountPayment != null && response.data.data.costs[j].costAmountPayment > 0) {
								this.openError("已对账");
								return;
							}
							if(response.data.data.costs[j].financialDate) {
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
								incomeId:row.incomeId,
								businessScope:row.businessScope
							}
							this.$axios.post2('/afbase/income/doDelete', params)
								.then(function(response) {
									if(response.data.code == 0) {
										this.openSuccess();
										this.queryIncomeCostList();
									} else {
										this.openError(response.data.messageInfo);
									}
								}.bind(this));
						}).catch(() => {
							// this.$message({
							//   type: 'info',
							//   message: '已取消'
							// });
						});

					}.bind(this));
			},
			doDeleteCost(row) {
				//				if (row.paymentId) {
				if(row.costAmountPayment != null && row.costAmountPayment > 0) {
					this.openError("已对账");
					return;
				}
				if(row.financialDate) {
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
								costId:row.costId,
								businessScope:row.businessScope
							}
					this.$axios.post2('/afbase/cost/doDelete', params)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.queryIncomeCostList();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					// this.$message({
					//   type: 'info',
					//   message: '已取消'
					// });
				});
			},
			formatter222(row, column) {
				if(row.sstype == 1) {
					return "(收)" + row.serviceName;
				} else if(row.sstype == 2) {
					return "(付)" + row.serviceName;
				} else {
					return "";
				}

			},
			formatter2(row, column) {
				if(row.sstype == 1) {
					return row.customerName;
				} else if(row.sstype == 2) {
					return row.customerName;
				} else {
					return "";
				}

			},

			formatter3(row, column) {
				if(row.sstype == 2) {
					return row.customerName;
				} else {
					return "";
				}

			},
			formatterNumber111(row, column) {
				if (row.financialDate) {
					return row.financialDate.substr(0,10);
				}

			},
			formatterNumber1(row, column) {
				if(row.incomeUnitPrice === '' || row.incomeUnitPrice === 'null' || row.incomeUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(row.incomeUnitPrice);
				}
			},
			formatterNumber2(row, column) {
				if(row.incomeAmount === '' || row.incomeAmount === 'null' || row.incomeAmount == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmount);
				}
			},
			formatterNumber3(row, column) {
				if(row.treeId == -1) {
					return "(收)" + this.getNumber(row.incomeFunctionalAmount) + "\n(付)" + this.getNumber(row.costFunctionalAmount)
				} else if(row.incomeFunctionalAmount === '' || row.incomeFunctionalAmount === 'null' || row.incomeFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.incomeFunctionalAmount);
				}
			},
			formatterNumber4(row, column) {
				if(row.incomeAmountNotTax === '' || row.incomeAmountNotTax === 'null' || row.incomeAmountNotTax == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmountNotTax);
				}
			},
			formatterNumber5(row, column) {
				if(row.incomeAmountTax === '' || row.incomeAmountTax === 'null' || row.incomeAmountTax == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmountTax);
				}
			},
			formatterNumber6(row, column) {
				if(row.costUnitPrice === '' || row.costUnitPrice === 'null' || row.costUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(row.costUnitPrice);
				}
			},
			formatterNumber7(row, column) {
				if(row.costAmount === '' || row.costAmount === 'null' || row.costAmount == null) {
					return "";
				} else {
					return this.getNumber(row.costAmount);
				}
			},
			formatterNumber8(row, column) {
				if(row.costFunctionalAmount === '' || row.costFunctionalAmount === 'null' || row.costFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.costFunctionalAmount);
				}
			},
			formatterNumber9(row, column) {
				if(row.costAmountNotTax === '' || row.costAmountNotTax === 'null' || row.costAmountNotTax == null) {
					return "";
				} else {
					return this.getNumber(row.costAmountNotTax);
				}
			},
			formatterNumber10(row, column) {
				if(row.costAmountTax === '' || row.costAmountTax === 'null' || row.costAmountTax == null) {
					return "";
				} else {
					return this.getNumber(row.costAmountTax);
				}
			},
			formatterNumber11(row, column) {
				if(row.profitAmount === '' || row.profitAmount === 'null' || row.profitAmount == null) {
					return "";
				} else {
					return this.getNumber(row.profitAmount);
				}
			},
			formatterNumber12(row, column) {
				if(row.noTaxProfitAmount === '' || row.noTaxProfitAmount === 'null' || row.noTaxProfitAmount == null) {
					return "";
				} else {
					return this.getNumber(row.noTaxProfitAmount);
				}
			},
			formatterNumber13(row, column) {
				if(row.inboundVolumeWeight === '' || row.inboundVolumeWeight === 'null' || row.inboundVolumeWeight == null) {
					return "";
				} else {
					return parseFloat(row.inboundVolumeWeight).toFixed(1);
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			checkSelectable(row, index) {
				if(row.sstype == 1 && row.debitNoteId == null) {
					return true;
				} else {
					return false;
				}

			},
			queryStatus() {
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if(!response.data.data) {
						this.editButtonFlag2 = true;
						this.letterButtonFlag2 = true;
					} else {
						this.editButtonFlag2 = false;
						this.letterButtonFlag2 = false;
					}
				}.bind(this));
			},
			queryIncomeCostList() {
				if(this.frow.orderId) {

				} else {
					this.incomeCosts.data = [];
				}
				let params = {
					orderId: this.frow.orderId,
					businessScope: this.frow.businessScope
				}
				this.$axios.get2('/afbase/afIncomeCost/getListTree', params).then(function(response) {
					this.incomeCosts.data = response.data.data;
					// for(var i = 0; i < this.incomeCosts.data.length; i++) {
					// 	if(this.incomeCosts.data[i].debitNoteId) {
					// 		this.debitNoteIdFlag = false;
					// 	}
					// 	if(this.incomeCosts.data[i].children) {
					// 		for(var j = 0; j < this.incomeCosts.data[i].children.length; j++) {
					// 			if(this.incomeCosts.data[i].children[j].paymentId) {
					// 				this.paymentIdFlag = false;
					// 			}
					// 		}
					// 	}

					// }
				}.bind(this));
			},
			sychronizeWareAndStore() {
				if(this.ruleForm.departureStation != null && this.ruleForm.departureStation !== '') {
					this.ruleForm.departureStation = this.ruleForm.departureStation.trim().toUpperCase()
					this.$axios.get('/afbase/warehouse/getByDeparture?type=货站&departureStation=' + this.ruleForm.departureStation).then(function(response) {
						this.departureWarehouseOptions = response.data.data;
					}.bind(this));
					this.$axios.get('/afbase/warehouse/getByDeparture?type=库房&departureStation=' + this.ruleForm.departureStation).then(function(response) {
						this.departureStorehouseOptions = response.data.data;
					}.bind(this));
				}
			},
      sychronizeWareAndStore1() {
        this.ruleForm.departureStorehouseId = '';
        this.ruleForm.departureWarehouseId = '';
      },

			//延伸服务结束




		},
		created() {
			this.viewFlag=this.frow.viewFlag;

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
				if(this.contactsOptions != null && this.contactsOptions.length > 0) {
					this.orderContacts.push(this.contactsOptions[0].contacts_id)
				}
			}.bind(this));
			//按钮权限开始
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('af-order-bill-finish') > -1) {
				this.finishButtonFlag = true;
			}
			if(buttonInfo.indexOf('af-order-bill-cancel') > -1) {
				this.cancelButtonFlag = true;
			}


			//延伸服务开始
			this.queryIncomeCostList();
			//延伸服务结束


		}
	}
</script>
