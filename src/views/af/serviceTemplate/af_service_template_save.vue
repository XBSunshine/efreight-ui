<template>
	<el-dialog title="服务模板 - 新增" width="1290px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
			<div class="templateEditPage">
				<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<el-row >
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="ruleForm.businessScope" auto-complete="off" clearable style="width:206px;" disabled>
								<template slot="prepend">业务范畴</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
		                <el-form-item label-width="10px">
		                  <el-input style="width:185px;">
		                    <template slot="prepend">模板类型</template>
		                    <el-select slot="suffix" @change="changeTemplateType" v-model="ruleForm.templateType" placeholder="请选择" style="width:88px;margin-right: -5px;" disabled>
		                      <el-option label="应收" :value="1"></el-option>
		                      <el-option label="应付" :value="0"></el-option>
		                    </el-select>
		                  </el-input>
		                </el-form-item>
		            </el-col>
            <el-col class="elementWidth">
            	<el-form-item prop="templateName">
            		<el-input class="showWordLimit" show-word-limit maxlength="20" v-model="ruleForm.templateName" auto-complete="off" clearable style="width:456px;">
            			<template slot="prepend">模板名称</template>
            		</el-input>
            	</el-form-item>
            </el-col>
		            <el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="ruleForm.portCode" auto-complete="off" clearable style="width:206px;margin-right: 7px;" maxlength="10" @input="ruleForm.portCode=ruleForm.portCode.toUpperCase()">
								<template slot="prepend" v-if="ruleForm.businessScope=='AE'||ruleForm.businessScope=='SE'">始发港</template>
							<template slot="prepend" v-else>目的港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px" class="templateEditPage33">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="doSelect('ruleForm')" :disabled="doSelectFlag">保存模板</el-button>

						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
          	<el-form-item label-width="10px" class="templateEditPage33">
          		<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="clearData" plain>清空服务</el-button>
          	</el-form-item>
          </el-col>
				</el-row>

				<el-row style="top:-15px">
					<el-col class="elementWidth">
						<el-form-item>
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>模板备注</el-button>
							</el-row>
							<el-input class="showWordLimit" type="textarea" :rows="3" show-word-limit maxlength="500" v-model="ruleForm.templateRemark" auto-complete="off" style="width:1250px">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div style="margin:0px 10px 10px 10px;">
			<el-table :data="data1" :header-cell-style="{background:'oldlace'}" :row-class-name="tableRowClassName" >
				<el-table-column  width="40" align="center" >
					<template slot="header" slot-scope="scope">
						<i class="iconfont el-icon-myyuanquanjiahao" @click="doAddIncome" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
					<template slot-scope="scope" >
						<i class="iconfont el-icon-myjianhao" @click="doDeleteIncome(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>
				<el-table-column label="应收服务" width="195" v-if="ruleForm.templateType==1">
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectserviceId'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceId','receive')" :default-first-option=true v-model="scope.row.serviceId" filterable placeholder="请选择服务" style="width:185px">
							<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+' - '+item.serviceNameCn" :value="item.serviceId">
                <span style="float: left">{{item.value}}</span>
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="应付服务" width="195" v-else>
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectserviceId'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceId','receive')" :default-first-option=true v-model="scope.row.serviceId" filterable placeholder="请选择服务" style="width:185px">
							<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+' - '+item.serviceNameCn" :value="item.serviceId">
                <span style="float: left">{{item.value}}</span>
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="收款客户" width="290" v-if="ruleForm.templateType==1">
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectcustomerId'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'customerId','receive')" :default-first-option=true v-model="scope.row.customerId" filterable clearable placeholder="请选择客户" style="width:280px;">
							<el-option v-for="item in customerNameOptions" :key="item.coopIdV" :label="item.value" :value="item.coopIdV">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="付款客户" width="290" v-else>
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectcustomerId'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'customerId','receive')" :default-first-option=true v-model="scope.row.customerId" filterable clearable placeholder="请选择客户" style="width:280px;">
							<el-option v-for="item in customerNameOptions" :key="item.coopIdV" :label="item.value" :value="item.coopIdV">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="收费标准" width="150px" v-if="ruleForm.templateType==1">
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectserviceChargeStandard'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceChargeStandard','receive')" :default-first-option=true v-model="scope.row.serviceChargeStandard" filterable placeholder="请选择标准" style="width:140px;">
							<el-option v-for="item in chargeStandardOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="付费标准" width="150px" v-else>
					<template slot-scope="scope">
						<el-select :ref="'receiveSelectserviceChargeStandard'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceChargeStandard','receive')" :default-first-option=true v-model="scope.row.serviceChargeStandard" filterable placeholder="请选择标准" style="width:140px;">
							<el-option v-for="item in chargeStandardOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</template>
				</el-table-column>

				<el-table-column align="center" label="收费单价" width="100px" :formatter="formatterNumber22" v-if="ruleForm.templateType==1">
					<template slot-scope="scope">
						<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.serviceUnitPrice" @input="formatToFloat(scope.row,'serviceUnitPrice')" maxlength="11" ></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="付费单价" width="100px" :formatter="formatterNumber22" v-else>
					<template slot-scope="scope">
						<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.serviceUnitPrice" @input="formatToFloat(scope.row,'serviceUnitPrice')" maxlength="11" ></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="币种" width="90px" >
					<template slot-scope="scope">
						<div v-if="scope.row.serviceCurrency=='CNY'">
						<el-select :ref="'receiveSelectserviceCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceCurrency','receive')" :default-first-option=true v-model="scope.row.serviceCurrency" filterable placeholder="选择" >
							<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code" >
							</el-option>
						</el-select>

						</div>
						<div v-if="scope.row.serviceCurrency!='CNY'">
						<el-select class="currencyRedColor" :ref="'receiveSelectserviceCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceCurrency','receive')" :default-first-option=true v-model="scope.row.serviceCurrency"  filterable placeholder="选择" >
							<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code" >
							</el-option>
						</el-select>

						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="最低收费" width="100px" >
					<template slot-scope="scope">
						<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.serviceAmountMin" @input="formatToFloat(scope.row,'serviceAmountMin')" maxlength="11" ></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="最高收费" width="100px" >
					<template slot-scope="scope">
						<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.serviceAmountMax" @input="formatToFloat(scope.row,'serviceAmountMax')" maxlength="11" ></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="小数位" width="70px" >
				  <template slot-scope="scope">
				    <el-select slot="append" v-model="scope.row.serviceAmountDigits" placeholder="" >
				      <el-option label="0" value="0"></el-option>
				      <el-option label="1" value="1"></el-option>
				      <el-option label="2" value="2"></el-option>
				    </el-select>
				  </template>
				</el-table-column>
				<el-table-column align="center" label="进位方式" width="115px" placeholder="">
				  <template slot-scope="scope">
				    <el-select slot="append" v-model="scope.row.serviceAmountCarry" >
				    	<el-option label="四舍五入" value="四舍五入"></el-option>
				    	<el-option label="向上进位" value="向上进位"></el-option>
				    </el-select>
				  </template>
				</el-table-column>

				</el-table>
			</div>


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
				incomeValue: 0,
				costValue: 0,
				incomeMap:[],
				costMap: [],
				incomeValueStr: '',
				costValueStr: '',
				inputDoms: "",
				totalCost: 0,
				data1: [],
				data2: [],
				row2: '',
				rrow2:'',
				serviceOptions: [],
				currencyCodeOptions: [],
				customerNameOptions: [],
				customerNameOptions1:[],
				customerNameOptions2: [],
				chargeStandardOptions: [],
				incomeChargeStandardOptions:[],
				costChargeStandardOptions:[],
				ffrow: {
					coopFlag: ''
				},
				editList:{
					businessScope: this.frow.businessScope,
					orderUuid: this.frow.orderUuid,
					incomeList:[],
					costList:[],
					incomeDeleteList:[],
					costDeleteList:[]
				},
				ruleForm:{
					businessScope: '',
					templateType: '',
					portCode: '',
					templateName: '',
					templateRemark: '',
					addTemplate:[]
				},
				rules: {
					templateName: [{
						required: true,
						message: '请输入模板名称',
						trigger: ['blur', 'change']
					}],
				},
				doSelectFlag: false,

			}
		},

		inject: ['findByPage'],

		created: function() {
			this.ruleForm.businessScope=this.frow.businessScope;
			this.ruleForm.templateType=this.frow.templateType;
			if (this.frow.businessScope=='SE' || this.frow.businessScope=='SI') {
				this.frow.coopName=this.frow.customerName;
			}
			this.$nextTick(() => {
				this.initInputDOM();
			});
			// this.data1 = [{
			// 	orderId: this.frow.orderId,
			// 	orderUuid: this.frow.orderUuid,
			// 	businessScope: this.frow.businessScope,
			// 	customerId: '',
			// 	customerName: '',
			// 	serviceId: '',
			// 	serviceName: '',
			// 	incomeQuantity: '',
			// 	serviceUnitPrice: '',
			// 	serviceCurrency: '',
			// 	incomeExchangeRate: '',
			// 	incomeAmount: '',
			// 	incomeFunctionalAmount: '',
			// 	incomeAmountTaxRate: '0',
			// 	incomeAmountNotTax: '',
			// 	incomeAmountTax: '',
			// 	costs: []
			// }]

			this.$axios.get2('/afbase/service/queryList', {
				businessScope: this.frow.businessScope
			}).then(function(response) {
				this.serviceOptions = response.data.data;
        this.serviceOptions = this.serviceOptions.filter(port => port.isSys != true)
			}.bind(this)).catch(function(error) {});

			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'外部客户','互为代理','业务类结算对象'",
				awbFromName: this.frow.businessScope
			}).then(function(response) {
				this.customerNameOptions1 = response.data.data;
				this.setvalue1();
			}.bind(this)).catch(function(error) {});
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'干线承运人','互为代理','延伸服务供应商','业务类结算对象'",
				awbFromName: this.frow.businessScope
			}).then(function(response) {
				this.customerNameOptions2 = response.data.data;
				this.setvalue1();
			}.bind(this)).catch(function(error) {});

			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
			}.bind(this));

			this.$axios.get('/afbase/awb/selectCategory/收费标准/'+this.frow.businessScope).then(function(response) {
				this.incomeChargeStandardOptions = response.data.data;
				this.setvalue2();
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory/收费标准/'+this.frow.businessScope).then(function(response) {
				this.costChargeStandardOptions = response.data.data;
				this.setvalue2();
			}.bind(this));
			// let params = {
			// 	orderId: this.frow.orderId,
			// 	businessScope: this.frow.businessScope
			// }
			// this.$axios.get2('/afbase/afIncomeCost/getIncomeCostList', params).then(function(response) {
			// 	this.data1 = response.data.data.incomeList;
			// 	this.data2 = response.data.data.costList;
			// 	this.setTotalCost();
			// }.bind(this));
		},

		methods: {
			changeTemplateType(){
				this.clearData();
				this.setvalue1();
				this.setvalue2();
			},
			setvalue1(){
				if (this.ruleForm.templateType===1) {
					this.customerNameOptions=this.customerNameOptions1;
				}else{
					this.customerNameOptions=this.customerNameOptions2;
				}
			},
			setvalue2(){
				if (this.ruleForm.templateType===1) {
					this.chargeStandardOptions=this.incomeChargeStandardOptions;
				}else{
					this.chargeStandardOptions=this.costChargeStandardOptions;
				}
			},
			initInputDOM() {
				const inputDoms = document.querySelectorAll(
					"#table-form .el-input__inner"
				);
				let arr = []
				for(let i = 0; i < inputDoms.length; i++) {
					// console.log(inputDoms[i].name)
					if(inputDoms[i].name == "disabled") {
						continue
					} else {
						arr.push(inputDoms[i])
					}
				}
				arr.forEach((item, index) => {
					item.setAttribute("data-index", index);
				});
				// console.log(arr)
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

					this.$refs['receiveSelect' + prop + row.index].blur()
				}

			},
			blurPay(row, prop) {
				if(row[prop] == null || row[prop] === '') {

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
			clearData(){
				this.data1=[];
			},
			doAddIncome(){
				let j = {
					customerId: '',
					serviceId: '',
					serviceChargeStandard: '',
					serviceUnitPrice: '',
					serviceCurrency: 'CNY',
          serviceAmountMin: '',
          serviceAmountMax:'',
          serviceAmountDigits:2,
          serviceAmountCarry:'四舍五入'
				};

				this.data1.push(j);
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			doDeleteIncome(index, rrow) {
				if (rrow.incomeId) {
					this.editList.incomeDeleteList.push(rrow);
				}
				this.data1.splice(index, 1);
				// this.setTotalCost();
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},

			doSelect(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid){
					if (this.data1.length==0) {
						this.openError("请选择服务明细");
						return;
					}
					for(var i = 0; i < this.data1.length; i++) {
						if(this.data1[i].serviceId) {

						} else {
							this.openError("请选择服务");
							return;
						}

						if(this.data1[i].serviceChargeStandard === '') {
							this.openError("请选择标准");
							return;
						}
						if(this.data1[i].serviceUnitPrice === '') {
							this.openError("请录入单价");
							return;
						}
						if(this.data1[i].serviceCurrency) {

						} else {
							this.openError("请选择币种");
							return;
						}


					}
					// this.data1[0].costs = this.data2;
					this.doSelectFlag = true;
					this.ruleForm.addTemplate=this.data1;
					this.doSave();
					}
				});


			},
			doSave(){
				this.$axios.post2('/afbase/servicetemplate/doSave', this.ruleForm)
				.then(function(response) {
					if(response.data.code == 0) {
						this.openSuccess();
						this.findByPage();
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
			formatToFloat(row2,item) {
				if(item == 'incomeQuantity') {
					row2.incomeQuantity = row2.incomeQuantity.replace(/[^0123456789.]/g, "");
					var t = row2.incomeQuantity.split('.');
					if(t.length > 1) {
						row2.incomeQuantity = t[0] + "." + t[1].substr(0, 1);
					}

				} else if(item == 'serviceUnitPrice') {

					row2.serviceUnitPrice = row2.serviceUnitPrice.replace(/[^0123456789.-]/g, "");
					if(row2.serviceUnitPrice.indexOf("-") > 0) {
						row2.serviceUnitPrice = row2.serviceUnitPrice.substr(0, row2.serviceUnitPrice.indexOf("-"));
					}
					let t = row2.serviceUnitPrice.split('.');
					if(t.length > 1) {
						row2.serviceUnitPrice = t[0] + "." + t[1].substr(0, 3);

					}
					// if (row2.serviceUnitPrice) {
					// 	row2.serviceUnitPrice=this.getNumber2(parseFloat(row2.serviceUnitPrice))
					// }
				} else if(item == 'incomeAmount') {
					// this.$forceUpdate();
					row2.incomeAmount = row2.incomeAmount.replace(/[^0123456789.]/g, "");
					let t = row2.incomeAmount.split('.');
					if(t.length > 1) {
						row2.incomeAmount = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'incomeAmountTaxRate') {
					row2.incomeAmountTaxRate = row2.incomeAmountTaxRate.replace(/[^0123456789]/g, "");
					var t = row2.incomeAmountTaxRate.split('.');
					if(t.length > 1) {
						row2.incomeAmountTaxRate = t[0];
					}
				}
			},

			formatterNumber22(row, column) {
				if(row.serviceUnitPrice === '' || row.serviceUnitPrice === 'null' || row.serviceUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(parseFloat(row.serviceUnitPrice));
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getNumber2(data) {
				return data.toFixed(2);
			},

			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>
<style type="text/css">
	.templateEditPage .el-input__icon {
		line-height: 30px !important;
	}
	.templateEditPage33 .el-form-item__content {
		line-height: 30px !important;
	}
	.currencyRedColor input {
		color: red !important;
	}
	.blackColor input {
		color: #606266 !important
	}

	.redColor input {
		color: red !important
	}
	.widthWithFive .el-input-group__prepend {
		padding: 0 15px;
	}
	.widthWithFive2 .el-input-group__prepend {
		padding: 0 16px;
	}
	.widthWithFive3 .el-input-group__prepend {
		padding: 0 13px;
	}
	.widthWithThree .el-input-group__prepend {
		padding: 0 27px;
	}

	.widthWithThreeWithXing .el-input-group__prepend {
		padding: 0 22px;
	}

	.widthWithTwo .el-input-group__prepend {
		padding: 0 34px;
	}

	.templateEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
	.orderEditPage222 .el-input__inner {
		text-align:right !important;
	}

</style>
