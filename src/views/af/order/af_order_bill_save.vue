<template>
	<el-dialog title="账单 - 新增" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" append-to-body>
		<el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<div v-show="false">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="收款客户">
							<el-input v-model="ruleForm2.customerName" auto-complete="off" disabled style="width:410px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="主单号">
							<el-input v-model="ruleForm.awbNumber" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="订单号">
							<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="客户单号">
							<el-input v-model="ruleForm.customerNumber" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col class="elementWidth">
          <el-form-item label="订单客户">
            <el-input v-model="ruleForm.coopName" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col> -->
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="账单编号">
							<el-input auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="账单日期">
							<el-input auto-complete="off" disabled v-model="ruleForm2.debitNoteDate" style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="航班">
							<el-input v-model="ruleForm.expectFlight+'/'+ruleForm.expectDeparture" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="始发港">
							<el-input v-model="ruleForm.departureStation" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="目的港">
							<el-input v-model="ruleForm.arrivalStation" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="账单本币金额">
							<el-input v-model="ruleForm3.functionalAmount" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="件数">
							<el-input v-model="ruleForm.confirmPieces===''||ruleForm.confirmPieces==null ?ruleForm.planPieces:ruleForm.confirmPieces" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="毛重">
							<el-input v-model="ruleForm.confirmWeight===''||ruleForm.confirmWeight==null ?ruleForm.planWeight:ruleForm.confirmWeight" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="体积">
							<el-input v-model="ruleForm.confirmVolume===''||ruleForm.confirmVolume==null ?ruleForm.planVolume:ruleForm.confirmVolume" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="计费重量">
							<el-input v-model="ruleForm.confirmChargeWeight===''||ruleForm.confirmChargeWeight==null ?ruleForm.planChargeWeight:ruleForm.confirmChargeWeight" auto-complete="off" disabled style="width:155px">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

				</el-row>
				<el-row v-show=false>
					<el-col class="elementWidth">
						<el-form-item label="税率">
							<el-input v-model="ruleForm2.amountTaxRate" auto-complete="off" disabled>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="无税金额">
							<el-input v-model="ruleForm3.amountNotTax" auto-complete="off" disabled>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="税额">
							<el-input v-model="ruleForm3.amountTax" auto-complete="off" disabled>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="" style="margin-left: 35px;">
						<el-input v-model="ruleForm2.customerName" disabled style="width:715px;margin-right: 5px;">
							<template slot="prepend">收款客户</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" style="margin-left: 20px;">
						<el-input v-model="ruleForm2.debitNoteNum" disabled style="width:270px;">
							<template slot="prepend">账单编号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" style="margin-left: 35px;">
						<el-input class="ef_input_icon" auto-complete="off" style="width:715px;margin-right: 5px;" clearable>
							<template slot="prepend">公司抬头</template>
							<el-select slot="suffix" v-model="ruleForm2.orgBankConfigId" placeholder="请选择公司抬头" style="width:618px;margin-right: -5px;" clearable>
								<el-option v-for="(item,index) in orgBankConfigs" :key="index" :label="item.titleCn" :value="item.orgBankConfigId">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" style="margin-left: 20px;">
						<el-input v-model="ruleForm2.debitNoteDate" disabled style="width:270px;">
							<template slot="prepend">账单日期</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="账单金额">
						<!-- :show-header='false' -->
						<el-table :data="data222" :show-header='false' style="width:410px">
							<el-table-column prop="amount" label="金额" :formatter="formatterNumber22"></el-table-column>
							<el-table-column align="center" label="币种" width="50">
								<template slot-scope="scope">
									<span v-if="scope.row.currency!='CNY'" style="color:red">{{scope.row.currency}}</span>
									<span v-else>{{scope.row.currency}}</span>
								</template>
							</el-table-column>
							<el-table-column align="right" :formatter="formatterName1" width="50"></el-table-column>
							<el-table-column label="汇率">
								<template slot-scope="scope">
									<el-input v-model="scope.row.exchangeRate" :disabled="scope.row.currency=='CNY'" @input="formatToFloat(scope.row,'exchangeRate')" maxlength="8" @change="setFunctionalAmount(scope.row)"></el-input>
								</template>
							</el-table-column>
							<el-table-column align="right" :formatter="formatterName2" width="50"></el-table-column>
							<el-table-column prop="functionalAmount" label="本币金额" :formatter="formatterNumber33"></el-table-column>

						</el-table>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="备注" label-width="50px">
						<el-input v-model="ruleForm2.debitNoteRemark" type="textarea" auto-complete="off" style="width:485px" :rows="3" maxlength="500">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div>
			<el-table :data="data1" border>
				<el-table-column prop="serviceName" label="服务" fixed width="280"></el-table-column>
				<el-table-column prop="incomeQuantity" label="数量"></el-table-column>
				<el-table-column prop="incomeUnitPrice" label="单价"></el-table-column>
				<el-table-column prop="incomeAmount" label="金额" :formatter="formatterNumber2"></el-table-column>
				<el-table-column align="center" label="币种">
					<template slot-scope="scope">
						<span v-if="scope.row.incomeCurrency!='CNY'" style="color:red">{{scope.row.incomeCurrency}}</span>
						<span v-else>{{scope.row.incomeCurrency}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="incomeFunctionalAmount" label="本币金额" :formatter="formatterNumber3"></el-table-column>
				<!--  <el-table-column prop="incomeAmountTaxRate" label="税率" ></el-table-column>
        <el-table-column prop="incomeAmountNotTax" label="无税金额" :formatter="formatterNumber4"></el-table-column>
        <el-table-column prop="incomeAmountTax" label="税额" :formatter="formatterNumber5"></el-table-column> -->
			</el-table>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="doSave">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
		</div>

	</el-dialog>
</template>
<script>
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
				data1: [],
				data222: [],
				currencyCodeOptions: [],
				orgBankConfigs: [],
				ruleForm: {
					orderId: '',
					orderUuid: '',
					orgId: '',
					orderCode: '',
					orderStatus: '',
					awbId: '',
					awbUuid: '',
					projectId: '',
					projectName: '',
					salesName: '',
					servicerName: '',
					coopId: '',
					coopName: '',
					servicerId: '',
					salesId: '',
					awbNumber: '',
					orderContacts: [],
					customerNumber: '',
					isConsol: 0,
					hawbFlag: '',
					hawbQuantity: 0,
					departureStation: '',
					transitStation: '',
					arrivalStation: '',
					expectFlight: '',
					expectDeparture: '',
					expectArrival: '',
					businessProduct: '',
					receiptDate: '',
					goodsType: '普货',
					goodsNameCn: '',
					batteryType: '',
					arrivalMethod: '',
					departureWarehouseId: '',
					departureStorehouseId: '',
					planPieces: '',
					packageType: '',
					planWeight: '',
					planChargeWeight: '',
					planVolume: '',
					planDimensions: '',
					currecnyCode: 'CNY',
					priceType: '',
					priceValue: '',
					freightUnitprice: '',
					freightAmount: '',
					priceType2: '',
					priceValue2: '',
					msrUnitprice: '',
					msrAmount: '',
					appraisalNote: '',
					orderRemark: ''
				},
				ffrow: {
					coopFlag: ''
				},
				ruleForm3: {
					amountTax: '',
					amountNotTax: '',
					functionalAmount: '',
					amount: ''
				},
				ruleForm2: {
					orgId: '',
					orgBankConfigId: -1,
					debitNoteNum: '',
					businessScope: '',
					debitNoteDate: '',
					orderId: '',
					orderUuid: '',
					customerId: '',
					customerName: '',
					currency: '',
					exchangeRate: '',
					amount: '',
					functionalAmount: '',
					amountTaxRate: '',
					amountNotTax: '',
					amountTax: '',
					debitNoteRemark: '',
					incomeIds: '',
					incomeRowUuids: '',
					debitCurrencyList: []
				}
			}
		},

		inject: ['queryIncomeCostList', 'queryStatus', 'showSelectSendOrPrint'],

		created: function() {
			this.ruleForm2.businessScope = this.frow.businessScope;
			this.ruleForm2.debitNoteDate = this.getDateTime(new Date());
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				this.init();
			}.bind(this));
			// this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
			//   .then(function(response) {
			//     this.ruleForm = response.data.data;
			//   }.bind(this));
			//incomeExchangeRate
			this.data1 = this.frow.selections;
			this.$axios.post2('/afbase/billcurrency/queryBill', JSON.stringify(this.data1))
				.then(function(response) {
					this.data222 = response.data.data;
					this.setTotalCost()
				}.bind(this));
            this.$axios.get('/hrs/orgBankConfig').then(response=>{
		           this.orgBankConfigs = response.data.data
	         })
		},

		methods: {
			init() {
				this.ruleForm2.orderId = this.frow.orderId;
				this.ruleForm2.orderUuid = this.frow.orderUuid;
				this.ruleForm2.customerName = this.frow.selections[0].customerName;
				this.ruleForm2.customerId = this.frow.selections[0].customerId;
				this.ruleForm2.currency = this.frow.selections[0].incomeCurrency;
				this.setExchangeRate(this.ruleForm2.currency);
				this.ruleForm2.amountTaxRate = this.frow.selections[0].incomeAmountTaxRate;
				// alert(this.ruleForm2.exchangeRate);
				this.ruleForm2.amount = 0;
				this.frow.selections.forEach((row) => {
					this.ruleForm2.amount = this.ruleForm2.amount + row.incomeFunctionalAmount;
					if (this.ruleForm2.incomeIds == '') {
						this.ruleForm2.incomeIds = row.incomeId;
						this.ruleForm2.incomeRowUuids = row.rowUuid;
					} else {
						this.ruleForm2.incomeIds = this.ruleForm2.incomeIds + ',' + row.incomeId;
						this.ruleForm2.incomeRowUuids = this.ruleForm2.incomeRowUuids + ',' + row.rowUuid;
					}
					if (this.ruleForm2.currency.indexOf(row.incomeCurrency) < 0) {
						this.ruleForm2.currency = this.ruleForm2.currency + "," + row.incomeCurrency;
					}
				})
				//  this.ruleForm2.functionalAmount=(this.ruleForm2.exchangeRate*this.ruleForm2.amount).toFixed(2);
				//  this.ruleForm2.amountNotTax=(this.ruleForm2.functionalAmount/((100+this.ruleForm2.amountTaxRate)/100)).toFixed(2);
				//  this.ruleForm2.amountTax=(this.ruleForm2.functionalAmount-this.ruleForm2.amountNotTax).toFixed(2);

				// this.ruleForm3.amountTax=this.getNumber(parseFloat(this.ruleForm2.amountTax));
				//  this.ruleForm3.amountNotTax=this.getNumber(parseFloat(this.ruleForm2.amountNotTax));
				//  this.ruleForm3.functionalAmount=this.getNumber(parseFloat(this.ruleForm2.functionalAmount));
				//  if (this.ruleForm2.currency.length>3) {
				//    this.ruleForm2.amount='';
				//    this.ruleForm3.amount='';
				//  }else{
				//    this.ruleForm3.amount=this.getNumber(this.ruleForm2.amount);
				//  }



			},
			doSave() {
				//费用明细去重判断不能超过20条限制
				let result = ''
				this.data1.forEach(row => {
					let val = row.serviceId + row.incomeCurrency + row.incomeUnitPrice
					if (result === '') {
						result = val
					} else {
						if (result.indexOf(val) == -1) {
							result += ',' + val
						}
					}
				})
				if (result.split(',').length > 20) {
					this.openError('您好，费用明细数量超出范围，最多支持20条费用明细。')
					return
				}
				this.ruleForm2.debitCurrencyList = this.data222;
				this.$axios.post2('/afbase/cssDebitNote/doSave', this.ruleForm2)
					.then(function(response) {
						if (response.data.code == 0) {
							this.openSuccess();
							this.queryStatus();
							this.queryIncomeCostList();
							this.showSelectSendOrPrint();
							this.handleClose();

						} else {
							this.openError(response.data.messageInfo);
						}

					}.bind(this));
			},
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
			getDateTime(theDate) {
				// theDate.setDate(theDate.getDate()-30);            
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				// return _year + "-" + _month + "-01";
				return _year + "-" + _month + "-" + _date;
			},
			setExchangeRate(vId) {
				let obj = {};
				obj = this.currencyCodeOptions.find((item) => {
					return item.currency_code === vId;
				});
				if (obj.currency_rate) {
					this.ruleForm2.exchangeRate = obj.currency_rate;
				} else {
					this.ruleForm2.exchangeRate = 0;
				}
			},
			formatterName1(row, column) {
				return "汇率:";
			},
			formatterName2(row, column) {
				return "本币:";
			},
			formatterNumber2(row, column) {
				if (row.incomeAmount === '' || row.incomeAmount === 'null' || row.incomeAmount == null) {
					return "";
				} else {
					return this.getNumber(row.incomeAmount);
				}
			},
			formatterNumber22(row, column) {
				if (row.amount === '' || row.amount === 'null' || row.amount == null) {
					return "";
				} else {
					return this.getNumber(row.amount);
				}
			},
			formatterNumber3(row, column) {
				if (row.incomeFunctionalAmount === '' || row.incomeFunctionalAmount === 'null' || row.incomeFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.incomeFunctionalAmount);
				}
			},
			formatterNumber33(row, column) {
				if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmount);
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

			//本币金额
			setFunctionalAmount(row2) {

				if (row2.exchangeRate === '' || row2.amount === '') {
					row2.functionalAmount = 0;
				} else {
					row2.functionalAmount = row2.exchangeRate * row2.amount;
				}
				this.setTotalCost();
				// this.setcostAmountNotTax(row2);    
			},
			//本币金额求和
			setTotalCost() {
				let totalCost2 = 0;
				for (var i = 0; i < this.data222.length; i++) {
					totalCost2 = totalCost2 + parseFloat(this.data222[i].functionalAmount);
				}
				this.ruleForm2.functionalAmount = totalCost2;
				this.ruleForm3.functionalAmount = this.getNumber(parseFloat(this.ruleForm2.functionalAmount));
				this.ruleForm2.amountNotTax = (this.ruleForm2.functionalAmount / ((100 + this.ruleForm2.amountTaxRate) / 100)).toFixed(2);
				this.ruleForm2.amountTax = (this.ruleForm2.functionalAmount - this.ruleForm2.amountNotTax).toFixed(2);
			},
			//无税金额
			setcostAmountNotTax(row2) {
				if (row2.functionalAmount === '' || row2.amountTaxRate === '') {
					row2.amountNotTax = 0;
				} else {
					row2.amountNotTax =
						(
							row2.functionalAmount /
							((100 + parseInt(row2.amountTaxRate)) / 100)
						).toFixed(2);
				}
				this.setcostAmountTax(row2);
			},
			//税额
			setcostAmountTax(row2) {
				if (row2.functionalAmount === '' || row2.amountNotTax === '') {
					row2.amountTax = 0;
				} else {
					row2.amountTax = (row2.functionalAmount - row2.amountNotTax).toFixed(2);
				}

			},

			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			formatToFloat(row2, item) {
				if (item == 'exchangeRate') {
					row2.exchangeRate = row2.exchangeRate.replace(/[^0123456789.]/g, "");
					var t = row2.exchangeRate.split('.');
					if (t.length > 1) {
						row2.exchangeRate = t[0] + "." + t[1].substr(0, 4);
					}
				}

			},
			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>
