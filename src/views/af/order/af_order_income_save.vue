<template>
	<el-dialog title="服务 - 新增" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div id="table-form">
			<el-table :data="data1" :header-cell-style="{background:'oldlace'}" :row-class-name="tableRowClassName">
				<el-table-column label="" width="60">
					<template slot-scope="scope">
						<i></i>
					</template>
				</el-table-column>
				<el-table-column label="应收服务" width="255">
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectserviceName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceName','receive')" :default-first-option=true v-model="scope.row.serviceName" filterable placeholder="请选择应收服务" @change="setServiceName" style="width:245px;line-height: 30px;">
							<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.value" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="收款客户" width="340">
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectcustomerName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'customerName','receive')" :default-first-option=true v-model="scope.row.customerName" filterable placeholder="请选择应收服务" @change="setCoop" style="width: 330px;">
<!--						<el-select :ref="'receiveSelectcustomerName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row)" @blur="blurReceive(scope.row,'customerName')" :default-first-option=true v-model="scope.row.customerName" filterable placeholder="请选择应收服务" @change="setCoop" style="width: 330px;">-->
							<el-option v-for="item in customerNameOptions" :key="item.serviceId" :label="item.value" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="数量" width="110px">
					<template slot-scope="scope">
						<el-input @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.incomeQuantity" @input="formatToFloat('incomeQuantity')" maxlength="8" @change="setIncomeAmount"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="单价" width="97px">
					<template slot-scope="scope">
						<el-input @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.incomeUnitPrice" @input="formatToFloat('incomeUnitPrice')" maxlength="11" @change="setIncomeAmount"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="币种" width="97px">
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectincomeCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'incomeCurrency','receive')" :default-first-option=true v-model="scope.row.incomeCurrency" filterable placeholder="选择" @change="setIncomeExchangeRate">
							<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="应收金额">
					<template slot-scope="scope">
						<el-input v-model="scope.row.incomeAmount" @input="formatToFloat('incomeAmount')" maxlength="11" disabled name="disabled"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="应收本币金额">
					<template slot-scope="scope">
						<el-input v-model="scope.row.incomeFunctionalAmount" disabled name="disabled"></el-input>
					</template>
				</el-table-column>
				<!-- <el-table-column label="税率" >
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.incomeAmountTaxRate" @input="formatToFloat('incomeAmountTaxRate')" maxlength="2" @change="setIncomeAmountNotTax"></el-input>
          </template>
      </el-table-column>
      <el-table-column label="无税金额" >
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.incomeAmountNotTax" disabled></el-input>
          </template>
      </el-table-column>
      <el-table-column label="税额" >
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.incomeAmountTax" disabled></el-input>
          </template>
      </el-table-column> -->

			</el-table>
			<el-table :data="data2" :header-cell-style="{background:'#d2f4c0'}" :row-class-name="tableRowClassName">
				<el-table-column label="操作" width="60" align="center">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>

				<el-table-column label="应付服务" width="255">
					<template slot-scope="scope">
						<el-select :ref="'paySelectserviceName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceName','pay')" :default-first-option=true v-model="scope.row.serviceName" filterable placeholder="请选择应付服务" @change="setServiceName2(scope.row,scope.row.serviceName)" style="width:245px">
							<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.value" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="付款客户" width="340">
					<template slot-scope="scope">
						<el-select :ref="'paySelectcustomerName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'customerName','pay')" :default-first-option=true :class="scope.row.customerColorClass" v-model="scope.row.customerName" filterable placeholder="请选择付款客户" @change="setCoop2(scope.row,scope.row.customerName)" style="width:330px">
							<el-option v-for="item in customerNameOptions2" :key="item.serviceId" :label="item.value" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="数量" width="110px">
					<template slot-scope="scope">
						<el-input @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.costQuantity" @input="formatToFloat2(scope.row,'costQuantity')" maxlength="8" @change="setcostAmount(scope.row)"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="单价" width="97px">
					<template slot-scope="scope">
						<el-input @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.costUnitPrice" @input="formatToFloat2(scope.row,'costUnitPrice')" maxlength="11" @change="setcostAmount(scope.row)"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="币种" width="97px">
					<template slot-scope="scope">
						<el-select ref="'paySelectcostCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'costCurrency','pay')" :default-first-option=true v-model="scope.row.costCurrency" filterable placeholder="选择" @change="setcostExchangeRate(scope.row,scope.row.costCurrency)">
							<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="应付金额">
					<template slot-scope="scope">
						<el-input v-model="scope.row.costAmount" @input="formatToFloat2(scope.row,'costAmount')" maxlength="11" disabled name="disabled"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="应付本币金额">
					<template slot-scope="scope">
						<el-input v-model="scope.row.costFunctionalAmount" disabled name="disabled"></el-input>
					</template>
				</el-table-column>
				<!-- <el-table-column label="税率" >
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.costAmountTaxRate" @input="formatToFloat('costAmountTaxRate')" maxlength="2" @change="setcostAmountNotTax"></el-input>
          </template>
      </el-table-column>
      <el-table-column label="无税金额" >
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.costAmountNotTax" disabled></el-input>
          </template>
      </el-table-column>
      <el-table-column label="税额" >
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.costAmountTax" disabled></el-input>
          </template>
      </el-table-column> -->
			</el-table>
			<div style="margin:10px 10px 10px 22px;">
				<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				<span style="margin-left: 20px;">应收(本币)：{{getNumber(parseFloat(data1[0].incomeFunctionalAmount))}}</span>
				<span style="margin-left: 20px;">应付合计(本币)：{{getNumber(parseFloat(totalCost))}}</span>
				<span style="margin-left: 20px;" align="center">毛利：{{getNumber(data1[0].incomeFunctionalAmount-totalCost)}}</span>

			</div>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="doSelect" :disabled="doSelectFlag">确定</el-button>
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
				inputDoms: "",
				totalCost: 0,
				data1: [],
				data2: [],
				row2: '',
				serviceOptions: [],
				currencyCodeOptions: [],
				customerNameOptions: [],
				customerNameOptions2: [],
				ffrow: {
					coopFlag: ''
				},
				doSelectFlag: false
			}
		},
		inject: ['queryIncomeCostList'],
		provide() {
			return {
				setCoopValue: this.setCoopValue,
				setServiceValue: this.setServiceValue,
				setCoopValue2: this.setCoopValue2,
				setServiceValue2: this.setServiceValue2
			}
		},
		created: function() {
			this.$nextTick(() => {
				this.initInputDOM();
			});
			this.data1 = [{
				orderId: this.frow.orderId,
				orderUuid: this.frow.orderUuid,
				businessScope: this.frow.businessScope,
				customerId: '',
				customerName: '',
				serviceId: '',
				serviceName: '',
				incomeQuantity: '',
				incomeUnitPrice: '',
				incomeCurrency: '',
				incomeExchangeRate: '',
				incomeAmount: '',
				incomeFunctionalAmount: '',
				incomeAmountTaxRate: '0',
				incomeAmountNotTax: '',
				incomeAmountTax: '',
				costs: []
			}]
			// this.data2=[{
			//   orderId:this.frow.orderId,
			//   orderUuid:this.frow.orderUuid,
			//   incomeId:'',
			//   businessScope:'AE',
			//   customerId:'',
			//   customerName:'',
			//   serviceId:'',
			//   serviceName:'',
			//   costQuantity:'',
			//   costUnitPrice:'',
			//   costCurrency:'',
			//   costExchangeRate:'',
			//   costAmount:'',
			//   costFunctionalAmount:'',
			//   costAmountTaxRate:'0',
			//   costAmountNotTax:'',
			//   costAmountTax:''
			// }]
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: this.frow.businessScope
			}).then(function(response) {
				this.serviceOptions = response.data.data;
			}.bind(this)).catch(function(error) {});
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'外部客户','互为代理','业务类结算对象'"
			}).then(function(response) {
				this.customerNameOptions = response.data.data;
			}.bind(this)).catch(function(error) {});
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'干线承运人','互为代理','延伸服务供应商','业务类结算对象'"
			}).then(function(response) {
				this.customerNameOptions2 = response.data.data;
			}.bind(this)).catch(function(error) {});
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				this.data1[0].incomeCurrency = 'CNY';
				this.setIncomeExchangeRate('CNY');
				// this.data2[0].costCurrency='CNY';
				// this.row2=this.data2[0];
				// this.setcostExchangeRate(this.row2,'CNY');
			}.bind(this));
			// this.queryList();
			this.data1[0].customerId = this.frow.coopId;;
			this.data1[0].customerName = this.frow.coopName;

			// this.$axios.get('/afbase/service/detail?serviceId='+this.frow.serviceId).then(function(response) {
			// this.setServiceValue(response.data.data);
			//  }.bind(this)
			// );
			// this.data2[0].customerId=this.frow.coopId;
			// this.data2[0].customerName=this.frow.coopName;
			// this.row2.serviceId=this.frow.serviceId;
			// this.row2.serviceName=this.frow.serviceName;
		},

		methods: {
			initInputDOM() {
				const inputDoms = document.querySelectorAll(
					"#table-form .el-input__inner"
				);
				let arr = []
				for(let i = 0; i < inputDoms.length; i++) {
					console.log(inputDoms[i].name)
					if(inputDoms[i].name == "disabled") {
						continue
					} else {
						arr.push(inputDoms[i])
					}
				}
				arr.forEach((item, index) => {
					item.setAttribute("data-index", index);
				});
				console.log(arr)
				this.inputDoms = arr;
			},
			nextFocus(event, row, prop, flag) {
				const index = event.target.getAttribute("data-index");
				const nextIndex = parseInt(index) + 1;
				const length = this.inputDoms.length;
				if(nextIndex < length) {
					this.inputDoms[nextIndex].focus();
				} else {
					this.inputDoms[0].focus();
				}
				if(flag == 'receive') {
					this.blurReceive(row, prop)
				} else if(flag == 'pay') {
					this.blurPay(row, prop)
				}
			},
			blurReceive(row, prop) {
				if(row[prop] == null || row[prop] === '') {
					if(prop == 'serviceName') {
						if(this.serviceOptions.length != 0) {
							this.setServiceName(this.serviceOptions[0].value)
						}
					} else if(prop == 'customerName') {
						if(this.customerNameOptions.length != 0) {
							this.setCoop(this.customerNameOptions[0].value)
						}
					} else if(prop == 'incomeCurrency') {
						if(this.currencyCodeOptions.length != 0) {
							this.setIncomeExchangeRate(this.currencyCodeOptions[0].currency_code)
						}
					}
					this.$refs['receiveSelect' + prop + row.index].blur()
				}

			},
			blurPay(row, prop) {
				if(row[prop] == null || row[prop] === '') {
					if(prop == 'serviceName') {
						if(this.serviceOptions.length != 0) {
							this.setServiceName2(row, this.serviceOptions[0].value)
						}
					} else if(prop == 'customerName') {
						if(this.customerNameOptions2.length != 0) {
							this.setCoop2(row, this.customerNameOptions2[0].value)
						}
					} else if(prop == 'costCurrency') {
						if(this.currencyCodeOptions.length != 0) {
							this.setcostExchangeRate(row, this.currencyCodeOptions[0].currency_code)
						}
					}
					this.$refs['paySelect' + prop + row.index].blur()
				}
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				//把每一行的索引放进row
				row.index = rowIndex;
			},
			doAdd() {
				let j = {
					orderId: this.frow.orderId,
					orderUuid: this.frow.orderUuid,
					incomeId: '',
					businessScope: this.frow.businessScope,
					customerId: '',
					customerName: '',
					serviceId: this.data1[0].serviceId,
					serviceName: this.data1[0].serviceName,
					costQuantity: '',
					costUnitPrice: '',
					costCurrency: this.data1[0].incomeCurrency,
					costExchangeRate: '',
					costAmount: '',
					costFunctionalAmount: '',
					costAmountTaxRate: '0',
					costAmountNotTax: '',
					costAmountTax: '',
					customerColorClass: 'blackColor'
				};
				this.setcostExchangeRate(j, this.data1[0].incomeCurrency);
				if(this.data1[0].serviceId) {
					this.$axios.get('/afbase/service/detail?serviceId=' + this.data1[0].serviceId).then(function(response) {
						this.setServiceValue3(j, response.data.data);
					}.bind(this));
				}
				this.data2.push(j);
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			doDelete(index, rrow) {
				this.data2.splice(index, 1);
				this.setTotalCost();
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			setCoop(vId) {
				
				let obj = {};
				obj = this.customerNameOptions.find((item) => {
					return item.value === vId;
				});
				this.setCoopValue(obj);
				if(this.data1[0].customerId) {
					this.data2.forEach((row) => {
						if(row.customerId == this.data1[0].customerId) {
							row.customerColorClass = 'redColor'
						} else {
							row.customerColorClass = 'blackColor'
						}
					})
				}
			},
			setCoopValue(rrow) {
				this.data1[0].customerId = rrow.coopIdV;
				this.data1[0].customerName = rrow.coopNameV;
			},
			showservice() {
				this.ffrow.serviceFlag = 1;
				this.serviceVisible = true;
			},
			setServiceName(vId) {
				let obj = {};
				obj = this.serviceOptions.find((item) => {
					return item.value === vId;
				});
				this.setServiceValue(obj);
			},
			setServiceValue(rrow) {
				this.data1[0].incomeAmountTaxRate = rrow.vatOutput;
				this.data1[0].serviceId = rrow.serviceId;
				this.data1[0].serviceName = rrow.serviceType + " - " + rrow.serviceNameCn;
				this.setIncomeAmountNotTax();
			},
			setCoop2(row2, vId) {
				this.row2 = row2;
				let obj = {};
				obj = this.customerNameOptions2.find((item) => {
					return item.value === vId;
				});
				this.setCoopValue2(obj);
				if(obj.coopIdV == this.data1[0].customerId) {
					this.row2.customerColorClass = 'redColor'
				} else {
					this.row2.customerColorClass = 'blackColor'
				}
			},
			setCoopValue2(rrow) {
				this.row2.customerId = rrow.coopIdV;
				this.row2.customerName = rrow.coopNameV;
			},
			showservice2(row2) {
				this.row2 = row2;
				this.ffrow.serviceFlag = 2;
				this.serviceVisible = true;
			},
			setServiceName2(row2, vId) {
				this.row2 = row2;
				let obj = {};
				obj = this.serviceOptions.find((item) => {
					return item.value === vId;
				});
				this.setServiceValue2(obj);
			},
			setServiceValue2(rrow) {
				this.row2.costAmountTaxRate = rrow.vatInput;
				this.row2.serviceId = rrow.serviceId;
				this.row2.serviceName = rrow.serviceType + " - " + rrow.serviceNameCn;
				this.setcostAmountNotTax(this.row2);
			},
			setServiceValue3(j, rrow) {
				j.costAmountTaxRate = rrow.vatInput;
				j.serviceId = rrow.serviceId;
				j.serviceName = rrow.serviceType + " - " + rrow.serviceNameCn;
				this.setcostAmountNotTax(j);
			},
			doSelect() {
				if(this.data1[0].serviceId) {

				} else {
					this.openError("请选择应收服务");
					return;
				}
				if(this.data1[0].customerId) {
					try {
						this.data2.forEach((row) => {
							if(row.customerId == this.data1[0].customerId) {
								this.openError("[" + row.customerName + "]付款客户与收款客户相同")
								throw new Error('finish')
							}
						})

					} catch(e) {
						if(e.message == 'finish') {
							return
						}
					}

				} else {
					this.openError("请选择收款客户");
					return;
				}
				if(this.data1[0].incomeQuantity) {
					if(this.data1[0].incomeQuantity > 0) {

					} else {
						this.openError("数量必须大于0");
						return;
					}
				} else {
					this.openError("请录入数量");
					return;
				}
				if(this.data1[0].incomeUnitPrice === '') {
					this.openError("请录入单价");
					return;
				}
				if(this.data1[0].incomeCurrency) {

				} else {
					this.openError("请选择币种");
					return;
				}

				if(this.data1[0].incomeAmountTaxRate === '') {
					this.openError("请录入税率");
					return;
				}

				this.setFieldValue();
				this.setFieldValue2();
				for(var i = 0; i < this.data2.length; i++) {
					if(this.data2[i].serviceId) {

					} else {
						this.openError("请选择应付服务");
						return;
					}
					if(this.data2[i].customerId) {

					} else {
						this.openError("请选择付款客户");
						return;
					}
					if(this.data2[i].costQuantity) {
						if(this.data2[i].costQuantity > 0) {

						} else {
							this.openError("数量必须大于0");
							return;
						}
					} else {
						this.openError("请录入数量");
						return;
					}
					if(this.data2[i].costUnitPrice === '') {
						this.openError("请录入单价");
						return;
					}
					if(this.data2[i].costUnitPrice == 0) {
						this.openError("应付单价不能为0");
						return;
					}
					if(this.data2[i].costCurrency) {

					} else {
						this.openError("请选择币种");
						return;
					}

				}
				this.data1[0].costs = this.data2;
				this.doSelectFlag = true;
				this.$axios.post2('/afbase/income/doSave', this.data1[0])
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.queryIncomeCostList();
							this.handleClose();
						} else {
							this.doSelectFlag = false;
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
			formatToFloat(item) {
				if(item == 'incomeQuantity') {
					this.data1[0].incomeQuantity = this.data1[0].incomeQuantity.replace(/[^0123456789.]/g, "");
					var t = this.data1[0].incomeQuantity.split('.');
					if(t.length > 1) {
						this.data1[0].incomeQuantity = t[0] + "." + t[1].substr(0, 1);
					}
				} else if(item == 'incomeUnitPrice') {
					this.data1[0].incomeUnitPrice = this.data1[0].incomeUnitPrice.replace(/[^0123456789.-]/g, "");
					if(this.data1[0].incomeUnitPrice.indexOf("-") > 0) {
						this.data1[0].incomeUnitPrice = this.data1[0].incomeUnitPrice.substr(0, this.data1[0].incomeUnitPrice.indexOf("-"));
					}
					let t = this.data1[0].incomeUnitPrice.split('.');
					if(t.length > 1) {
						this.data1[0].incomeUnitPrice = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'incomeAmount') {
					// this.$forceUpdate();
					this.data1[0].incomeAmount = this.data1[0].incomeAmount.replace(/[^0123456789.]/g, "");
					let t = this.data1[0].incomeAmount.split('.');
					if(t.length > 1) {
						this.data1[0].incomeAmount = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'incomeAmountTaxRate') {
					this.data1[0].incomeAmountTaxRate = this.data1[0].incomeAmountTaxRate.replace(/[^0123456789]/g, "");
					var t = this.data1[0].incomeAmountTaxRate.split('.');
					if(t.length > 1) {
						this.data1[0].incomeAmountTaxRate = t[0];
					}
				}
			},
			setIncomeExchangeRate(vId) {
				let obj = {};
				obj = this.currencyCodeOptions.find((item) => {
					return item.currency_code === vId;
				});
				this.data1[0].incomeExchangeRate = obj.currency_rate;
				this.setIncomeFunctionalAmount();
			},
			//金额
			setIncomeAmount() {
				if(this.data1[0].incomeQuantity === '' || this.data1[0].incomeUnitPrice === '') {
					this.data1[0].incomeAmount = 0;
				} else {
					this.data1[0].incomeAmount = (this.data1[0].incomeQuantity * this.data1[0].incomeUnitPrice).toFixed(2);
				}
				this.setIncomeFunctionalAmount();
			},
			//本币金额
			setIncomeFunctionalAmount() {
				if(this.data1[0].incomeExchangeRate === '' || this.data1[0].incomeAmount === '') {
					this.data1[0].incomeFunctionalAmount = 0;
				} else {
					this.data1[0].incomeFunctionalAmount = (this.data1[0].incomeExchangeRate * this.data1[0].incomeAmount).toFixed(2);

				}
				this.setIncomeAmountNotTax();
			},
			//无税金额
			setIncomeAmountNotTax() {
				if(this.data1[0].incomeFunctionalAmount === '' || this.data1[0].incomeAmountTaxRate === '') {
					this.data1[0].incomeAmountNotTax = 0;
				} else {
					this.data1[0].incomeAmountNotTax =
						(
							this.data1[0].incomeFunctionalAmount /
							((100 + parseInt(this.data1[0].incomeAmountTaxRate)) / 100)
						).toFixed(2);
				}
				this.setIncomeAmountTax();
			},
			//税额
			setIncomeAmountTax() {
				if(this.data1[0].incomeFunctionalAmount === '' && this.data1[0].incomeAmountNotTax === '') {
					this.data1[0].incomeAmountTax = 0;
				} else {
					this.data1[0].incomeAmountTax = (this.data1[0].incomeFunctionalAmount - this.data1[0].incomeAmountNotTax).toFixed(2);

				}

			},
			setFieldValue() {
				if(this.data1[0].serviceName.indexOf('干线运输') > -1) {
					this.data1[0].mainRouting = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('支线运输') > -1) {
					this.data1[0].feeder = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('操作服务') > -1) {
					this.data1[0].operation = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('包装服务') > -1) {
					this.data1[0].packaging = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('仓储服务') > -1) {
					this.data1[0].storage = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('邮资快递') > -1) {
					this.data1[0].postage = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('政府检验') > -1) {
					this.data1[0].clearance = this.data1[0].incomeFunctionalAmount;
				} else if(this.data1[0].serviceName.indexOf('数据交换') > -1) {
					this.data1[0].exchange = this.data1[0].incomeFunctionalAmount;
				}
			},
			//
			formatToFloat2(row2, item) {
				if(item == 'costQuantity') {
					row2.costQuantity = row2.costQuantity.replace(/[^0123456789.]/g, "");
					var t = row2.costQuantity.split('.');
					if(t.length > 1) {
						row2.costQuantity = t[0] + "." + t[1].substr(0, 1);
					}
				} else if(item == 'costUnitPrice') {
					row2.costUnitPrice = row2.costUnitPrice.replace(/[^0123456789.-]/g, "");
					let t = row2.costUnitPrice.split('.');
					if(row2.costUnitPrice.indexOf("-") > 0) {
						row2.costUnitPrice = row2.costUnitPrice.substr(0, row2.costUnitPrice.indexOf("-"));
					}
					if(t.length > 1) {
						row2.costUnitPrice = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'costAmount') {
					// this.$forceUpdate();
					row2.costAmount = row2.costAmount.replace(/[^0123456789.]/g, "");
					let t = row2.costAmount.split('.');
					if(t.length > 1) {
						row2.costAmount = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'costAmountTaxRate') {
					row2.costAmountTaxRate = row2.costAmountTaxRate.replace(/[^0123456789]/g, "");
					var t = row2.costAmountTaxRate.split('.');
					if(t.length > 1) {
						row2.costAmountTaxRate = t[0];
					}
				}
			},
			setcostExchangeRate(row2, vId) {
				let obj = {};
				obj = this.currencyCodeOptions.find((item) => {
					return item.currency_code === vId;
				});
				row2.costExchangeRate = obj.currency_rate;
				this.setcostFunctionalAmount(row2);
			},
			//金额
			setcostAmount(row2) {
				if(row2.costQuantity === '' || row2.costUnitPrice === '') {
					row2.costAmount = 0;
				} else {
					row2.costAmount = (row2.costQuantity * row2.costUnitPrice).toFixed(2);
				}
				this.setcostFunctionalAmount(row2);
			},
			//本币金额
			setcostFunctionalAmount(row2) {
				if(row2.costExchangeRate === '' || row2.costAmount === '') {
					row2.costFunctionalAmount = 0;
				} else {
					row2.costFunctionalAmount = (row2.costExchangeRate * row2.costAmount).toFixed(2);
				}
				this.setcostAmountNotTax(row2);
				this.setTotalCost();
			},
			//无税金额
			setcostAmountNotTax(row2) {
				if(row2.costFunctionalAmount === '' || row2.costAmountTaxRate === '') {
					row2.costAmountNotTax = 0;
				} else {
					row2.costAmountNotTax =
						(
							row2.costFunctionalAmount /
							((100 + parseInt(row2.costAmountTaxRate)) / 100)
						).toFixed(2);
				}
				this.setcostAmountTax(row2);
			},
			//税额
			setcostAmountTax(row2) {
				if(row2.costFunctionalAmount === '' || row2.costAmountNotTax === '') {
					row2.costAmountTax = 0;
				} else {
					row2.costAmountTax = (row2.costFunctionalAmount - row2.costAmountNotTax).toFixed(2);
				}

			},
			setTotalCost() {
				let totalCost2 = 0;
				for(var i = 0; i < this.data2.length; i++) {
					totalCost2 = totalCost2 + parseFloat(this.data2[i].costFunctionalAmount);
				}
				this.totalCost = totalCost2.toFixed(2);
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			setFieldValue2() {
				for(var i = 0; i < this.data2.length; i++) {
					if(this.data2[i].serviceName.indexOf('干线运输') > -1) {
						this.data2[i].mainRouting = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('支线运输') > -1) {
						this.data2[i].feeder = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('操作服务') > -1) {
						this.data2[i].operation = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('包装服务') > -1) {
						this.data2[i].packaging = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('仓储服务') > -1) {
						this.data2[i].storage = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('邮资快递') > -1) {
						this.data2[i].postage = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('政府检验') > -1) {
						this.data2[i].clearance = this.data2[i].costFunctionalAmount;
					} else if(this.data2[i].serviceName.indexOf('数据交换') > -1) {
						this.data2[i].exchange = this.data2[i].costFunctionalAmount;
					}
				}

			},
			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>
<style>
	.blackColor input {
		color: #606266 !important
	}
	
	.redColor input {
		color: red !important
	}
</style>