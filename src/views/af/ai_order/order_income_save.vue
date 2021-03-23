<template>
	<el-dialog title="服务 - 编辑" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div id="table-form">
			<div class="orderEditPage">
				<el-row style="margin:-10px 0px 5px 0px;">
					<el-col class="elementWidth" v-if="frow.incomeServicePermissionButton">
						<el-input style="width:420px;margin-right: 35px;">
							<template slot="prepend">应收模板</template>
							<el-select slot="suffix" v-model="incomeTemplateType" placeholder="请选择" style="width:206px;margin-right: -5px;">
								<el-option label="默认模板" value="1">
								</el-option>
								<el-option v-for="item in incomeTemplateOptions" :key="item.templateCode" :label="item.templateName" :value="item.templateCode">
								</el-option>
							</el-select>

							<el-button slot="append" icon="el-icon-plus" @click="addIncomeTemplate" :disabled="!frow.incomeRecorded==false">预置应收</el-button>
						</el-input>
					</el-col>
					<el-col class="elementWidth" v-if="frow.costServicePermissionButton">
						<el-input style="width:420px;margin-right: 15px;">
							<template slot="prepend">应付模板</template>
							<el-select slot="suffix" v-model="costTemplateType" placeholder="请选择" style="width:206px;margin-right: -5px;">
								<el-option label="默认模板" value="1">
								</el-option>
								<el-option v-for="item in costTemplateOptions" :key="item.templateCode" :label="item.templateName" :value="item.templateCode">
								</el-option>
							</el-select>
							<el-button slot="append" icon="el-icon-plus" @click="addCostTemplate" :disabled="!frow.costRecorded==false">预置应付</el-button>
						</el-input>
					</el-col>
				</el-row>
				<el-table v-if="frow.incomeServicePermissionButton" :data="data1" :header-cell-style="{background:'oldlace'}" :row-class-name="tableRowClassName">
					<el-table-column width="40" align="center">
						<template slot="header" slot-scope="scope" v-if="frow.incomeRecorded==false">
							<i class="iconfont el-icon-myyuanquanjiahao" @click="doAddIncome" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
						<template slot-scope="scope" v-if="!(scope.row.debitNoteId !=null || scope.row.financialDate!=null||frow.incomeRecorded==true)">
							<i class="iconfont el-icon-myjianhao" @click="doDeleteIncome(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
					</el-table-column>
					<el-table-column label="应收服务" width="195">
						<template slot-scope="scope">
							<el-select :ref="'receiveSelectserviceName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceName','receive')" :default-first-option=true v-model="scope.row.serviceName" filterable placeholder="请选择应收服务" @change="setServiceName(scope.row,scope.row.serviceName)" v-if="!(scope.row.debitNoteId !=null || scope.row.financialDate!=null || frow.incomeRecorded==true)" style="width:185px">
								<el-option v-for="item in serviceOptionsIn" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
							<el-select name="disabled" :default-first-option=true v-model="scope.row.serviceName" filterable placeholder="请选择应收服务" disabled v-if="scope.row.debitNoteId !=null || scope.row.financialDate!=null || frow.incomeRecorded==true" style="width:185px">
								<el-option v-for="item in serviceOptionsIn" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="收款客户" width="290">
						<template slot-scope="scope">
							<el-select :ref="'receiveSelectcustomerName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'customerName','receive')" :default-first-option=true v-model="scope.row.customerName" filterable placeholder="请选择收款客户" @change="setCoop(scope.row,scope.row.customerName)" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null || frow.incomeRecorded==true)" style="width:280px;">
								<el-option v-for="item in customerNameOptions" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
							<el-select name="disabled" :default-first-option=true v-model="scope.row.customerName" filterable placeholder="请选择收款客户" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null || frow.incomeRecorded==true" style="width:280px;">
								<el-option v-for="item in customerNameOptions" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>

						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="收费标准" width="155px">
					<template slot-scope="scope">
						<span v-if="scope.row.serviceRemark.indexOf('CNY')==-1" style="color:red">{{scope.row.serviceRemark.substr(0,3)}}</span>

						<span v-else>{{scope.row.serviceRemark.substr(0,3)}}</span>
						<span >{{scope.row.serviceRemark.substr(3)}}</span>
					</template>
				</el-table-column> -->
					<!-- <el-table-column prop="serviceRemark" label="收费标准" width="145px"></el-table-column> -->
					<el-table-column align="center" label="收费标准" width="150px">
						<template slot-scope="scope">
							<el-input name="disabled" v-model="scope.row.serviceRemark" disabled></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" width="110px">
						<template slot-scope="scope">
							<el-input name="disabled" v-model="scope.row.serviceNote" maxlength="100" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true)"></el-input>
							<el-input name="disabled" v-model="scope.row.serviceNote" maxlength="100" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="数量" width="110px">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.incomeQuantity" @input="formatToFloat(scope.row,'incomeQuantity')" maxlength="8" @change="setIncomeAmount(scope.row)" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true)"></el-input>
							<el-input class="orderEditPage222" name="disabled" v-model="scope.row.incomeQuantity" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="单价" width="100px" :formatter="formatterNumber22">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.incomeUnitPrice" @input="formatToFloat(scope.row,'incomeUnitPrice')" maxlength="11" @change="setIncomeAmount(scope.row)" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true)"></el-input>
							<el-input class="orderEditPage222" name="disabled" v-model="scope.row.incomeUnitPrice" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="币种" width="90px">
						<template slot-scope="scope">
							<div v-if="scope.row.incomeCurrency=='CNY'">
								<el-select :ref="'receiveSelectincomeCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'incomeCurrency','receive')" :default-first-option=true v-model="scope.row.incomeCurrency" filterable placeholder="选择" @change="setIncomeExchangeRate(scope.row,scope.row.incomeCurrency)" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true)">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
								<el-select name="disabled" :default-first-option=true v-model="scope.row.incomeCurrency" placeholder="选择" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</div>
							<div v-if="scope.row.incomeCurrency!='CNY'">
								<el-select class="currencyRedColor" :ref="'receiveSelectincomeCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'incomeCurrency','receive')" :default-first-option=true v-model="scope.row.incomeCurrency" filterable placeholder="选择" @change="setIncomeExchangeRate(scope.row,scope.row.incomeCurrency)" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true)">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
								<el-select class="currencyRedColor" name="disabled" :default-first-option=true v-model="scope.row.incomeCurrency" placeholder="选择" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="应收金额" >
						<template slot-scope="scope">
							<el-input class="orderEditPage222"  @input="formatToFloat(scope.row,'incomeAmount')"  v-model="scope.row.incomeAmount"  @change="setIncomeFunctionalAmount(scope.row)"  :value="getNumber2(parseFloat(scope.row.incomeAmount))"  name="disabled" v-if="!(scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true)"></el-input>
              <el-input class="orderEditPage222"  v-model="scope.row.incomeAmount"   :value="getNumber(parseFloat(scope.row.incomeAmount))"  name="disabled" disabled v-if="scope.row.debitNoteId!=null || scope.row.financialDate!=null|| frow.incomeRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="应收本币金额">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" name="disabled" disabled :value="getNumber(parseFloat(scope.row.incomeFunctionalAmount))"></el-input>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="incomeAmount" label="应收金额" :formatter="formatterNumber2">
				</el-table-column>
				<el-table-column prop="incomeFunctionalAmount" label="应收本币金额" :formatter="formatterNumber3"></el-table-column> -->
				</el-table>

				<el-table v-if="frow.costServicePermissionButton" :data="data2" :header-cell-style="{background:'#d2f4c0'}" :row-class-name="tableRowClassName">
					<el-table-column width="40" align="center">
						<template slot="header" slot-scope="scope" v-if="frow.costRecorded==false">
							<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
						<template slot-scope="scope" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null || frow.costRecorded==true )">
							<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
					</el-table-column>
					<el-table-column label="应付服务" width="195">
						<template slot-scope="scope">
							<el-select :ref="'paySelectserviceName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'serviceName','pay')" :default-first-option=true v-model="scope.row.serviceName" filterable placeholder="请选择应付服务" @change="setServiceName2(scope.row,scope.row.serviceName)" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null || frow.costRecorded==true)" style="width:185px">
								<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
							<el-select name="disabled" :default-first-option=true v-model="scope.row.serviceName" filterable placeholder="请选择应付服务" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true" style="width:185px">
								<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="付款对象" width="290">
						<template slot-scope="scope">
							<el-select :ref="'paySelectcustomerName'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'customerName','pay')" :default-first-option=true :class="scope.row.customerColorClass" v-model="scope.row.customerName" filterable placeholder="请选择付款对象" @change="setCoop2(scope.row,scope.row.customerName)" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)" style="width:280px">
								<el-option v-for="item in customerNameOptions2" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
							<el-select name="disabled" :default-first-option=true :class="scope.row.customerColorClass" v-model="scope.row.customerName" filterable placeholder="请选择付款对象" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true" style="width:280px">
								<el-option v-for="item in customerNameOptions2" :key="item.serviceId" :label="item.value" :value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="收费标准" width="155px">
					<template slot-scope="scope">
						<span v-if="scope.row.serviceRemark.indexOf('CNY')==-1" style="color:red">{{scope.row.serviceRemark.substr(0,3)}}</span>

						<span v-else>{{scope.row.serviceRemark.substr(0,3)}}</span>
						<span >{{scope.row.serviceRemark.substr(3)}}</span>
					</template>
				</el-table-column> -->
					<el-table-column align="center" label="付费标准" width="150px">
						<template slot-scope="scope">
							<el-input name="disabled" v-model="scope.row.serviceRemark" disabled></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" width="110px">
						<template slot-scope="scope">
							<el-input name="disabled" v-model="scope.row.serviceNote" maxlength="100" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)"></el-input>
							<el-input name="disabled" v-model="scope.row.serviceNote" maxlength="100" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="数量" width="110px">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.costQuantity" @input="formatToFloat2(scope.row,'costQuantity')" maxlength="8" @change="setcostAmount(scope.row)" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)"></el-input>
							<el-input class="orderEditPage222" name="disabled" v-model="scope.row.costQuantity" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="单价" width="100px">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" @keyup.native.enter="nextFocus($event,scope.row)" v-model="scope.row.costUnitPrice" @input="formatToFloat2(scope.row,'costUnitPrice')" maxlength="11" @change="setcostAmount(scope.row)" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)"></el-input>
							<el-input class="orderEditPage222" name="disabled" v-model="scope.row.costUnitPrice" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="币种" width="90px">
						<template slot-scope="scope">
							<div v-if="scope.row.costCurrency=='CNY'">
								<el-select ref="'paySelectcostCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'costCurrency','pay')" :default-first-option=true v-model="scope.row.costCurrency" filterable placeholder="选择" @change="setcostExchangeRate(scope.row,scope.row.costCurrency)" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
								<el-select name="disabled" :default-first-option=true v-model="scope.row.costCurrency" filterable placeholder="选择" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</div>
							<div v-if="scope.row.costCurrency!='CNY'">
								<el-select class="currencyRedColor" ref="'paySelectcostCurrency'+scope.row.index" @keyup.native.enter="nextFocus($event,scope.row,'costCurrency','pay')" :default-first-option=true v-model="scope.row.costCurrency" filterable placeholder="选择" @change="setcostExchangeRate(scope.row,scope.row.costCurrency)" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
								<el-select class="currencyRedColor" name="disabled" :default-first-option=true v-model="scope.row.costCurrency" filterable placeholder="选择" disabled v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true">
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="应付金额">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" @input="formatToFloat2(scope.row,'costAmount')" v-model="scope.row.costAmount"  @change="setcostFunctionalAmount(scope.row)" :value="getNumber2(parseFloat(scope.row.costAmount))"  name="disabled" v-if="!((scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true)"></el-input>
					    <el-input class="orderEditPage222" v-model="scope.row.costAmount" :value="getNumber(parseFloat(scope.row.costAmount))" disabled name="disabled" v-if="(scope.row.costAmountPayment != null && scope.row.costAmountPayment != 0) || scope.row.financialDate!=null|| frow.costRecorded==true"></el-input>
            </template>
					</el-table-column>
					<el-table-column align="center" label="应付本币金额">
						<template slot-scope="scope">
							<el-input class="orderEditPage222" disabled name="disabled" :value="getNumber(parseFloat(scope.row.costFunctionalAmount))"></el-input>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="costAmount" label="应付金额" :formatter="formatterNumbercost2">
				</el-table-column>
				<el-table-column prop="costFunctionalAmount" label="应付本币金额" :formatter="formatterNumbercost3"></el-table-column> -->
				</el-table>
				<div style="margin:10px 10px 10px 22px;">

					<template v-if="frow.incomeServicePermissionButton&&frow.costServicePermissionButton">
						<span style="margin-left: 20px;" align="center">毛利：</span>
						<span style="color:red" v-if="(incomeValue-costValue)<0">{{getNumber(incomeValue-costValue)}}</span>
						<span v-if="(incomeValue-costValue)>=0">{{getNumber(incomeValue-costValue)}}</span>
						<span>元 </span>
					</template>
					<template v-if="frow.incomeServicePermissionButton">
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
					<template v-if="frow.costServicePermissionButton">
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
				</div>
				<!-- <div style="margin:10px 10px 10px 22px;">
				<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				<span style="margin-left: 20px;">应收(本币)：{{getNumber(parseFloat(data1[0].incomeFunctionalAmount))}}</span>
				<span style="margin-left: 20px;">应付合计(本币)：{{getNumber(parseFloat(totalCost))}}</span>
				<span style="margin-left: 20px;" align="center">毛利：{{getNumber(data1[0].incomeFunctionalAmount-totalCost)}}</span>

			</div> -->
			</div>
		</div>

		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="doSelect" :disabled="doSelectFlag">确定</el-button>
			<!-- <el-button type="primary" size="small" v-on:click="handleClose">取消</el-button> -->
			<el-button type="primary" size="small" @click="handleClose" plain>取消</el-button>
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
				incomeTemplateType: '1',
				costTemplateType: '1',
				incomeTemplateOptions: [],
				costTemplateOptions: [],
				incomeValue: 0,
				costValue: 0,
				incomeMap: [],
				costMap: [],
				incomeValueStr: '',
				costValueStr: '',
				inputDoms: "",
				totalCost: 0,
				data1: [],
				data2: [],
				row2: '',
				rrow2: '',
				serviceOptions: [],
        serviceOptionsIn: [],
				currencyCodeOptions: [],
				customerNameOptions: [],
				customerNameOptions2: [],
				ffrow: {
					coopFlag: ''
				},
				editList: {
					businessScope: this.frow.businessScope,
					orderUuid: this.frow.orderUuid,
					orderId: this.frow.orderId,
					incomeRecorded: this.frow.incomeRecorded,
					costRecorded: this.frow.costRecorded,
					incomeList: [],
					costList: [],
					incomeDeleteList: [],
					costDeleteList: []
				},
				doSelectFlag: false,
				// coopVisible: false,
				// serviceVisible: false
			}
		},
		// components: {
		// 	'coopVisibleTag': coopVisibleVue,
		// 	'serviceVisibleTag': serviceVisibleVue
		// },
		inject: ['queryIncomeCostList'],
		// provide() {
		// 	return {
		// 		setCoopValue: this.setCoopValue,
		// 		setServiceValue: this.setServiceValue,
		// 		setCoopValue2: this.setCoopValue2,
		// 		setServiceValue2: this.setServiceValue2
		// 	}
		// },
		created: function() {

			let portCode = "";
			if (this.frow.businessScope == 'AE' || this.frow.businessScope == 'SE') {
				portCode = this.frow.departureStation
			} else {
				portCode = this.frow.arrivalStation
			}

			let incomeparams = {
				businessScope: this.frow.businessScope,
				templateType: 1,
				portCode: portCode
			}
			this.$axios.post2('/afbase/servicetemplate/getServicetemplate', incomeparams).then(function(response) {
				this.incomeTemplateOptions = response.data.data;
			}.bind(this));

			let costparams = {
				businessScope: this.frow.businessScope,
				templateType: 0,
				portCode: portCode
			}
			this.$axios.post2('/afbase/servicetemplate/getServicetemplate', costparams).then(function(response) {
				this.costTemplateOptions = response.data.data;
			}.bind(this));
			//
			if (this.frow.businessScope == 'SE' || this.frow.businessScope == 'SI') {
				this.frow.coopName = this.frow.customerName;
			}
      if (this.frow.businessScope&&this.frow.businessScope.startsWith('T')) {
      	this.frow.coopName = this.frow.customerName;
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
			// 	incomeUnitPrice: '',
			// 	incomeCurrency: '',
			// 	incomeExchangeRate: '',
			// 	incomeAmount: '',
			// 	incomeFunctionalAmount: '',
			// 	incomeAmountTaxRate: '0',
			// 	incomeAmountNotTax: '',
			// 	incomeAmountTax: '',
			// 	costs: []
			// }]
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
      if(this.frow.businessScope=='AE'){
        this.$axios.get2('/afbase/service/queryListAE', {
        	businessScope: this.frow.businessScope,
          orderId:this.frow.orderId
        }).then(function(response) {
        	this.serviceOptions = response.data.data;
        }.bind(this)).catch(function(error) {});

        this.$axios.get2('/afbase/service/queryList', {
        	businessScope: this.frow.businessScope
        }).then(function(response) {
          this.serviceOptionsIn = response.data.data;
        }.bind(this)).catch(function(error) {});
      }else{
        this.$axios.get2('/afbase/service/queryList', {
        	businessScope: this.frow.businessScope
        }).then(function(response) {
        	this.serviceOptions = response.data.data;
          this.serviceOptionsIn = response.data.data;
        }.bind(this)).catch(function(error) {});
      }

			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'外部客户','互为代理','业务类结算对象'",
				awbFromName: this.frow.businessScope
			}).then(function(response) {
				this.customerNameOptions = response.data.data;
			}.bind(this)).catch(function(error) {});
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'干线承运人','互为代理','延伸服务供应商','业务类结算对象'",
				awbFromName: this.frow.businessScope
			}).then(function(response) {
				this.customerNameOptions2 = response.data.data;
			}.bind(this)).catch(function(error) {});
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				// this.data1[0].incomeCurrency = 'CNY';
				// this.setIncomeExchangeRate('CNY');
			}.bind(this));
			// this.data1[0].customerId = this.frow.coopId;;
			// this.data1[0].customerName = this.frow.coopName;
			let params = {
				orderId: this.frow.orderId,
				businessScope: this.frow.businessScope,
        signFlag:'sign'
			}
			this.$axios.get2('/afbase/afIncomeCost/getIncomeCostList', params).then(function(response) {
				this.data1 = response.data.data.incomeList;
				this.data2 = response.data.data.costList;
				this.setTotalCost();
			}.bind(this));
		},

		methods: {
			addIncomeTemplate() {
				let params = {
					templateCode: this.incomeTemplateType,
					orderId: this.frow.orderId,
					orderUuid: this.frow.orderUuid,
					customerId: this.frow.coopId,
					customerName: this.frow.coopName,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/afIncomeCost/addIncomeTemplate', params).then(function(response) {
					this.data1 = this.data1.concat(response.data.data);
					this.setTotalCost();
				}.bind(this));
			},
			addCostTemplate() {
				let params = {
					templateCode: this.costTemplateType,
					orderId: this.frow.orderId,
					orderUuid: this.frow.orderUuid,
					customerId: -1,
					customerName: '',
					businessScope: this.frow.businessScope
				}
				if (this.customerNameOptions2.length == 1) {
					params.customerId = this.customerNameOptions2[0].coopIdV
					params.customerName = this.customerNameOptions2[0].coopNameV
				}
				this.$axios.post2('/afbase/afIncomeCost/addCostTemplate', params).then(function(response) {
					this.data2 = this.data2.concat(response.data.data);
					this.setTotalCost();
				}.bind(this));
			},
			initInputDOM() {
				const inputDoms = document.querySelectorAll(
					"#table-form .el-input__inner"
				);
				let arr = []
				for (let i = 0; i < inputDoms.length; i++) {
					if (inputDoms[i].name == "disabled") {
						continue
					} else {
						arr.push(inputDoms[i])
					}
				}
				arr.forEach((item, index) => {
					item.setAttribute("data-index", index);
				});
				this.inputDoms = arr;
			},
			nextFocus(event, row, prop, flag) {
				const index = event.target.getAttribute("data-index");
				const nextIndex = parseInt(index) + 1;
				const length = this.inputDoms.length;
				if (nextIndex < length) {
					this.inputDoms[nextIndex].focus();
				} else {
					this.inputDoms[0].focus();
				}
				if (flag == 'receive') {
					this.blurReceive(row, prop)
				} else if (flag == 'pay') {
					this.blurPay(row, prop)
				}
			},
			blurReceive(row, prop) {
				if (row[prop] == null || row[prop] === '') {
					if (prop == 'serviceName') {
						if (this.serviceOptions.length != 0) {
							this.setServiceName(row, this.serviceOptions[0].value)
						}
					} else if (prop == 'customerName') {
						if (this.customerNameOptions.length != 0) {
							this.setCoop(row, this.customerNameOptions[0].value)
						}
					} else if (prop == 'incomeCurrency') {
						if (this.currencyCodeOptions.length != 0) {
							this.setIncomeExchangeRate(row, this.currencyCodeOptions[0].currency_code)
						}
					}
					this.$refs['receiveSelect' + prop + row.index].blur()
				}

			},
			blurPay(row, prop) {
				if (row[prop] == null || row[prop] === '') {
					if (prop == 'serviceName') {
						if (this.serviceOptions.length != 0) {
							this.setServiceName2(row, this.serviceOptions[0].value)
						}
					} else if (prop == 'customerName') {
						if (this.customerNameOptions2.length != 0) {
							this.setCoop2(row, this.customerNameOptions2[0].value)
						}
					} else if (prop == 'costCurrency') {
						if (this.currencyCodeOptions.length != 0) {
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
			doAddIncome() {
				let j = {
					orderId: this.frow.orderId,
					orderUuid: this.frow.orderUuid,
					incomeId: '',
					businessScope: this.frow.businessScope,
					customerId: this.frow.coopId,
					customerName: this.frow.coopName,
					serviceId: '',
					serviceName: '',
					incomeQuantity: '',
					incomeUnitPrice: '',
					incomeCurrency: 'CNY',
					incomeExchangeRate: 1,
					incomeAmount: 0,
					incomeFunctionalAmount: 0,
					incomeAmountTaxRate: '0',
					incomeAmountNotTax: '',
					incomeAmountTax: '',
					serviceRemark: '',
					serviceNote: ''
				};
				this.setIncomeExchangeRate(j, 'CNY');
				// this.setcostExchangeRate(j, this.data1[0].incomeCurrency);
				// if(this.data1[0].serviceId) {
				// 	this.$axios.get('/afbase/service/detail?serviceId=' + this.data1[0].serviceId).then(function(response) {
				// 		this.setServiceValue3(j, response.data.data);
				// 	}.bind(this));
				// }
				this.data1.push(j);
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			doAdd() {
				let j = {
					orderId: this.frow.orderId,
					orderUuid: this.frow.orderUuid,
					incomeId: '',
					businessScope: this.frow.businessScope,
					customerId: '',
					customerName: '',
					serviceId: '',
					serviceName: '',
					costQuantity: '',
					costUnitPrice: '',
					costCurrency: 'CNY',
					costExchangeRate: 1,
					costAmount: 0,
					costFunctionalAmount: 0,
					costAmountTaxRate: '0',
					costAmountNotTax: '',
					costAmountTax: '',
					customerColorClass: 'blackColor',
					serviceRemark: '',
					serviceNote: ''
				};

				if (this.customerNameOptions2.length == 1) {
					j.customerId = this.customerNameOptions2[0].coopIdV
					j.customerName = this.customerNameOptions2[0].coopNameV
				}
				for (var i = 0; i < this.data1.length; i++) {
					if (j.coopIdV == this.data1[i].customerId) {
						j.customerColorClass = 'redColor'
					}
				}
				this.setcostExchangeRate(j, 'CNY');
				// this.setcostExchangeRate(j, this.data1[0].incomeCurrency);
				// if(this.data1[0].serviceId) {
				// 	this.$axios.get('/afbase/service/detail?serviceId=' + this.data1[0].serviceId).then(function(response) {
				// 		this.setServiceValue3(j, response.data.data);
				// 	}.bind(this));
				// }
				this.data2.push(j);
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			doDelete(index, rrow) {
				if (rrow.costId) {
					this.editList.costDeleteList.push(rrow);
				}
				this.data2.splice(index, 1);
				this.setTotalCost();

				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			doDeleteIncome(index, rrow) {
				if (rrow.incomeId) {
					this.editList.incomeDeleteList.push(rrow);
				}
				this.data1.splice(index, 1);
				this.setTotalCost();
				this.$nextTick(() => {
					this.initInputDOM();
				});
			},
			showcoop() {
				this.ffrow.coopFlag = 1;
				this.coopVisible = true;
			},
			setCoop(row2, vId) {
				this.rrow2 = row2;
				let obj = {};
				obj = this.customerNameOptions.find((item) => {
					return item.value === vId;
				});
				this.setCoopValue(obj);
				// if(this.data1[0].customerId) {
				// 	this.data2.forEach((row) => {
				// 		if(row.customerId == this.data1[0].customerId) {
				// 			row.customerColorClass = 'redColor'
				// 		} else {
				// 			row.customerColorClass = 'blackColor'
				// 		}
				// 	})
				// }
			},
			setCoopValue(rrow) {
				this.rrow2.customerId = rrow.coopIdV;
				this.rrow2.customerName = rrow.coopNameV;
			},
			// showservice() {
			// 	this.ffrow.serviceFlag = 1;
			// 	this.serviceVisible = true;
			// },
			setServiceName(row2, vId) {
				this.rrow2 = row2;
				let obj = {};
				obj = this.serviceOptionsIn.find((item) => {
					return item.value === vId;
				});
				this.setServiceValue(obj);
			},
			setServiceValue(rrow) {
				//this.rrow2.incomeAmountTaxRate = rrow.vatOutput;
				this.rrow2.incomeAmountTaxRate = 0;
				this.rrow2.serviceId = rrow.serviceId;
				this.rrow2.serviceName = rrow.serviceType + " - " + rrow.serviceNameCn;
				// alert(this.frow.businessScope);
				// alert(this.rrow2.serviceName=='干线 - 空运费');
				if (this.frow.businessScope == 'AE' && this.rrow2.serviceName == '干线 - 空运费') {
					this.rrow2.serviceRemark = '';
					return;
				}
        if(!rrow.incomeUnitPrice){
          rrow.incomeUnitPrice = 0;
        }
				this.rrow2.incomeExchangeRate = rrow.incomeExchangeRate;
				this.rrow2.incomeUnitPrice = rrow.incomeUnitPrice;
				this.rrow2.incomeCurrency = rrow.incomeCurrency;
				this.rrow2.serviceRemark = rrow.incomeCurrency + ' ' + this.getNumber(rrow.incomeUnitPrice) + ' / ' + rrow.incomeChargeStandard
				if (rrow.incomeChargeStandard == '计重') {
					if (this.frow.confirmChargeWeight) {
						this.rrow2.incomeQuantity = this.frow.confirmChargeWeight;
					} else if (this.frow.planChargeWeight) {
						this.rrow2.incomeQuantity = this.frow.planChargeWeight;
					}
				} else if (rrow.incomeChargeStandard == '毛重') {
					if (this.frow.confirmWeight) {
						this.rrow2.incomeQuantity = this.frow.confirmWeight;
					} else if (this.frow.planWeight) {
						this.rrow2.incomeQuantity = this.frow.planWeight;
					}
				} else if (rrow.incomeChargeStandard == '件数') {
					if (this.frow.confirmPieces) {
						this.rrow2.incomeQuantity = this.frow.confirmPieces;
					} else if (this.frow.planPieces) {
						this.rrow2.incomeQuantity = this.frow.planPieces;
					}
				} else if (rrow.incomeChargeStandard == '订单') {
					this.rrow2.incomeQuantity = 1;
				} else if (rrow.incomeChargeStandard == '分单') {
					if (this.frow.hawbQuantity) {
						this.rrow2.incomeQuantity = this.frow.hawbQuantity;
					}
				} else if (rrow.incomeChargeStandard == '计费吨') {
					if (this.frow.planChargeWeight) {
						this.rrow2.incomeQuantity = this.frow.planChargeWeight;
					}
				} else if (rrow.incomeChargeStandard == '标箱') {
					if (this.frow.containerNumber) {
						this.rrow2.incomeQuantity = this.frow.containerNumber;
					}
				}else if (rrow.incomeChargeStandard == '体积') {
					if (this.frow.planVolume) {
						this.rrow2.incomeQuantity = this.frow.planVolume;
					}
				}
				if (this.rrow2.incomeQuantity && this.rrow2.incomeUnitPrice) {
					this.rrow2.incomeAmount = this.rrow2.incomeQuantity * this.rrow2.incomeUnitPrice
				} else {
					this.rrow2.incomeAmount = 0
				}
				if (this.rrow2.incomeAmount && this.rrow2.incomeExchangeRate) {
					this.rrow2.incomeFunctionalAmount = this.rrow2.incomeAmount * this.rrow2.incomeExchangeRate
				} else {
					this.rrow2.incomeFunctionalAmount = 0
				}

        //最高
        if(rrow.incomeAmountMax){
           if(rrow.incomeAmountMax<this.rrow2.incomeAmount){
              this.rrow2.incomeAmount = rrow.incomeAmountMax;
              this.rrow2.incomeQuantity = 1;
              this.rrow2.incomeUnitPrice = rrow.incomeAmountMax;
           }
        }
        //最低
        if(rrow.incomeAmountMin){
           if(rrow.incomeAmountMin>this.rrow2.incomeAmount){
              this.rrow2.incomeAmount = rrow.incomeAmountMin;
              this.rrow2.incomeQuantity = 1;
              this.rrow2.incomeUnitPrice = rrow.incomeAmountMin;
           }
        }
        //小数位
        if(rrow.incomeAmountCarry=='四舍五入'){
          // console.log();
           this.rrow2.incomeAmount = this.rrow2.incomeAmount.toFixed(parseInt(rrow.incomeAmountDigits));
           this.rrow2.incomeAmount = parseFloat(this.rrow2.incomeAmount).toFixed(2);
        }
        if(rrow.incomeAmountCarry=='向上进位'){
            if(rrow.incomeAmountDigits==1){
                let a = Math.ceil(this.rrow2.incomeAmount*10);
                a = a/10;
                this.rrow2.incomeAmount = parseFloat(a).toFixed(2);
            }else if(rrow.incomeAmountDigits==2){
                let a = Math.ceil(this.rrow2.incomeAmount*100);
                a = a/100;
                this.rrow2.incomeAmount = parseFloat(a).toFixed(2);
            }else{
              this.rrow2.incomeAmount = parseFloat(Math.ceil(this.rrow2.incomeAmount)).toFixed(2);
            }
        }
        // this.rrow2.incomeAmount = this.rrow2.incomeAmount.toFixed(2);
        if(this.rrow2.incomeExchangeRate){
          this.rrow2.incomeFunctionalAmount =  this.rrow2.incomeAmount * this.rrow2.incomeExchangeRate
        }
				this.setTotalCost();
				this.setIncomeAmountNotTax(this.rrow2);
			},
			// showcoop2(row2) {
			// 	this.row2 = row2;
			// 	this.ffrow.coopFlag = 2;
			// 	this.coopVisible = true;
			// },
			setCoop2(row2, vId) {
				this.row2 = row2;
				let obj = {};
				obj = this.customerNameOptions2.find((item) => {
					return item.value === vId;
				});
				this.setCoopValue2(obj);
				for (var i = 0; i < this.data1.length; i++) {
					if (obj.coopIdV == this.data1[i].customerId) {
						this.row2.customerColorClass = 'redColor'
					} else {
						this.row2.customerColorClass = 'blackColor'
					}
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

        if(this.frow.businessScope == 'SE'){
           if(this.frow.bookingAgentId){
              this.row2.customerId = this.frow.bookingAgentId;
              this.row2.customerName = this.frow.bookingAgentName;
           }
        }
				this.setServiceValue2(obj);
			},
			setServiceValue2(rrow) {
				//this.row2.costAmountTaxRate = rrow.vatInput;
				this.row2.costAmountTaxRate = 0;
				this.row2.serviceId = rrow.serviceId;
				this.row2.serviceName = rrow.serviceType + " - " + rrow.serviceNameCn;
				if (this.frow.businessScope == 'AE' && this.row2.serviceName == '干线 - 空运费') {
					this.row2.serviceRemark = '';
					return;
				}
        if(!rrow.costUnitPrice){
          rrow.costUnitPrice = 0;
        }
        if(this.row2.costId&&this.row2.costId==-1){
          this.row2.costId ='';
        }
				this.row2.costExchangeRate = rrow.costExchangeRate;
				this.row2.costUnitPrice = rrow.costUnitPrice;
				this.row2.costCurrency = rrow.costCurrency;
				this.row2.serviceRemark = rrow.costCurrency + ' ' + this.getNumber(rrow.costUnitPrice) + ' / ' + rrow.costChargeStandard
				if (rrow.costChargeStandard == '计重') {
					if (this.frow.confirmChargeWeight) {
						this.row2.costQuantity = this.frow.confirmChargeWeight;
					} else if (this.frow.planChargeWeight) {
						this.row2.costQuantity = this.frow.planChargeWeight;
					}
				} else if (rrow.costChargeStandard == '毛重') {
					if (this.frow.confirmWeight) {
						this.row2.costQuantity = this.frow.confirmWeight;
					} else if (this.frow.planWeight) {
						this.row2.costQuantity = this.frow.planWeight;
					}
				} else if (rrow.costChargeStandard == '件数') {
					if (this.frow.confirmPieces) {
						this.row2.costQuantity = this.frow.confirmPieces;
					} else if (this.frow.planPieces) {
						this.row2.costQuantity = this.frow.planPieces;
					}
				} else if (rrow.costChargeStandard == '订单') {
					this.row2.costQuantity = 1;
				} else if (rrow.costChargeStandard == '分单') {
					if (this.frow.hawbQuantity) {
						this.row2.costQuantity = this.frow.hawbQuantity;
					}
				} else if (rrow.costChargeStandard == '计费吨') {
					if (this.frow.planChargeWeight) {
						this.row2.costQuantity = this.frow.planChargeWeight;
					}
				} else if (rrow.costChargeStandard == '标箱') {
					if (this.frow.containerNumber) {
						this.row2.costQuantity = this.frow.containerNumber;
					}
				}else if (rrow.costChargeStandard == '体积') {
					if (this.frow.planVolume) {
						this.row2.costQuantity = this.frow.planVolume;
					}
				}
				if (this.row2.costQuantity && this.row2.costUnitPrice) {
					this.row2.costAmount = this.row2.costQuantity * this.row2.costUnitPrice
				} else {
					this.row2.costAmount = 0
				}
				if (this.row2.costAmount && this.row2.costExchangeRate) {
					this.row2.costFunctionalAmount = this.row2.costAmount * this.row2.costExchangeRate
				} else {
					this.row2.costFunctionalAmount = 0
				}
        //最高
        if(rrow.costAmountMax){
           if(rrow.costAmountMax<this.row2.costAmount){
              this.row2.costAmount = rrow.costAmountMax;
              this.row2.costQuantity = 1;
              this.row2.costUnitPrice = rrow.costAmountMax;
           }
        }
        //最低
        if(rrow.costAmountMin){
           if(rrow.costAmountMin>this.row2.costAmount){
              this.row2.costAmount = rrow.costAmountMin;
              this.row2.costQuantity = 1;
              this.row2.costUnitPrice = rrow.costAmountMin;
           }
        }
        //小数位
        if(rrow.costAmountCarry=='四舍五入'){
           this.row2.costAmount = this.row2.costAmount.toFixed(parseInt(rrow.costAmountDigits));
           this.row2.costAmount = parseFloat(this.row2.costAmount).toFixed(2);
        }
        if(rrow.costAmountCarry=='向上进位'){
            if(rrow.costAmountDigits==1){
                let a = Math.ceil(this.row2.costAmount*10);
                a = a/10;
                this.row2.costAmount = parseFloat(a).toFixed(2);
            }else if(rrow.costAmountDigits==2){
                let a = Math.ceil(this.row2.costAmount*100);
                a = a/100;
                this.row2.costAmount = parseFloat(a).toFixed(2);
            }else{
              this.row2.costAmount = parseFloat(Math.ceil(this.row2.costAmount)).toFixed(2);
            }
        }
        if(this.row2.costExchangeRate){
            this.row2.costFunctionalAmount =  this.row2.costAmount * this.row2.costExchangeRate
        }
				this.setTotalCost();
				this.setcostAmountNotTax(this.row2);
			},
			setServiceValue3(j, rrow) {
				// j.costAmountTaxRate = rrow.vatInput;
				j.costAmountTaxRate = 0;
				j.serviceId = rrow.serviceId;
				j.serviceName = rrow.serviceType + " - " + rrow.serviceNameCn;
				this.setcostAmountNotTax(j);
			},
			doSelect() {
				let yesOrNo = 0;
				let customerName = '';
				for (var i = 0; i < this.data1.length; i++) {
					if (this.data1[i].serviceId) {

					} else {
						this.openError("请选择应收服务");
						return;
					}
					if (this.data1[i].customerId && this.data1[i].customerId != -1) {
						try {
							this.data2.forEach((row) => {
								if (row.customerId == this.data1[i].customerId) {
									// this.openError("[" + row.customerName + "]付款对象与收款客户相同")
									// throw new Error('finish')
									customerName = this.data1[i].customerName;
									yesOrNo = 1;
									// break;
								}
							})

						} catch (e) {
							if (e.message == 'finish') {
								return
							}
						}

					} else {
						this.openError("请选择收款客户");
						return;
					}
					if (this.data1[i].incomeQuantity) {
						if (this.data1[i].incomeQuantity > 0) {

						} else {
							this.openError("数量必须大于0");
							return;
						}
					} else {
						this.openError("请录入数量");
						return;
					}
					if (this.data1[i].incomeUnitPrice === '') {
						this.openError("请录入单价");
						return;
					}
          if (!this.data1[i].incomeAmount) {
          	this.openError("请录入应收金额");
          	return;
          }
          if(this.data1[i].incomeAmount==0){
            this.openError("应收金额不能为0");
            return;
          }
					if (this.data1[i].incomeCurrency) {

					} else {
						this.openError("请选择币种");
						return;
					}

					if (this.data1[i].incomeAmountTaxRate === '') {
						this.openError("请录入税率");
						return;
					}
				}
				this.setFieldValue();
				this.setFieldValue2();
				for (var i = 0; i < this.data2.length; i++) {
					if (this.data2[i].serviceId) {

					} else {
						this.openError("请选择应付服务");
						return;
					}
					if (!this.data2[i].customerId || this.data2[i].customerId == -1) {
						this.openError("请选择付款对象");
						return;
					}
					if (this.data2[i].costQuantity) {
						if (this.data2[i].costQuantity > 0) {

						} else {
							this.openError("数量必须大于0");
							return;
						}
					} else {
						this.openError("请录入数量");
						return;
					}
					if (this.data2[i].costUnitPrice === '') {
						this.openError("请录入单价");
						return;
					}
					if (this.data2[i].costUnitPrice == 0) {
						this.openError("应付单价不能为0");
						return;
					}
          if (!this.data2[i].costAmount) {
          	this.openError("请录入应付金额");
          	return;
          }
          if(this.data2[i].costAmount==0){
            this.openError("应付金额不能为0");
            return;
          }
					if (this.data2[i].costCurrency) {

					} else {
						this.openError("请选择币种");
						return;
					}

				}
				// this.data1[0].costs = this.data2;
				this.doSelectFlag = true;
				this.editList.incomeList = this.data1;
				this.editList.costList = this.data2;

				if (yesOrNo == 1) {
					this.$confirm('[' + customerName + ']付款对象与收款客户相同  ，是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.doSave();
					}).catch(() => {
						this.doSelectFlag = false;
						// this.$message({
						//   type: 'info',
						//   message: '已取消'
						// });
					});
				} else {
					this.doSave();
				}


			},
			doSave() {
				this.$axios.post2('/afbase/afIncomeCost/doEdit', this.editList)
					.then(function(response) {
						if (response.data.code == 0) {
							this.openSuccess();
							this.queryIncomeCostList(true);
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
			formatToFloat(row2, item) {
				if (item == 'incomeQuantity') {
					row2.incomeQuantity = row2.incomeQuantity.replace(/[^0123456789.]/g, "");
					var t = row2.incomeQuantity.split('.');
					if (t.length > 1) {
						row2.incomeQuantity = t[0] + "." + t[1].substr(0, 3);
					}

				} else if (item == 'incomeUnitPrice') {

					row2.incomeUnitPrice = row2.incomeUnitPrice.replace(/[^0123456789.-]/g, "");
					if (row2.incomeUnitPrice.indexOf("-") > 0) {
						row2.incomeUnitPrice = row2.incomeUnitPrice.substr(0, row2.incomeUnitPrice.indexOf("-"));
					}
					let t = row2.incomeUnitPrice.split('.');
					if (t.length > 1) {
						row2.incomeUnitPrice = t[0] + "." + t[1].substr(0, 3);

					}
					// if (row2.incomeUnitPrice) {
					// 	row2.incomeUnitPrice=this.getNumber2(parseFloat(row2.incomeUnitPrice))
					// }
				} else if (item == 'incomeAmount') {
					// this.$forceUpdate();
					row2.incomeAmount = row2.incomeAmount.replace(/[^0123456789.]/g, "");
					let t = row2.incomeAmount.split('.');
					if (t.length > 1) {
						row2.incomeAmount = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'incomeAmountTaxRate') {
					row2.incomeAmountTaxRate = row2.incomeAmountTaxRate.replace(/[^0123456789]/g, "");
					var t = row2.incomeAmountTaxRate.split('.');
					if (t.length > 1) {
						row2.incomeAmountTaxRate = t[0];
					}
				}
			},
			setIncomeExchangeRate(row2, vId) {
				let obj = {};
				obj = this.currencyCodeOptions.find((item) => {
					return item.currency_code === vId;
				});
        if(obj&&obj.currency_rate){
				  row2.incomeExchangeRate = obj.currency_rate;
        }
				this.setIncomeFunctionalAmount(row2);
			},
			//金额
			setIncomeAmount(row2) {
        let obj = {};
        obj = this.serviceOptions.find((item) => {
        	return item.serviceId == row2.serviceId;
        });

        // if(row2.incomeQuantity==1){
        //    if(obj.incomeAmountMax){
        //       if(row2.incomeUnitPrice){
        //           if(row2.incomeUnitPrice<obj.incomeAmountMax){
        //             row2.incomeUnitPrice = obj.incomeAmountMax;
        //           }
        //       }else{
        //         row2.incomeUnitPrice = obj.incomeAmountMax;
        //       }
        //    }
        //    //最低
        //       if(obj.incomeAmountMin){
        //         if(row2.incomeUnitPrice){
        //            if(row2.incomeUnitPrice<obj.incomeAmountMin){
        //              row2.incomeUnitPrice = obj.incomeAmountMin;
        //            }
        //         }else{
        //           row2.incomeUnitPrice = obj.incomeAmountMin;
        //         }
        //       }
        // }

				if (row2.incomeQuantity === '' || row2.incomeUnitPrice === '') {
					row2.incomeAmount = 0;
				} else {
					row2.incomeAmount = row2.incomeQuantity * row2.incomeUnitPrice;
				}
        //最高
        if(obj&&obj.incomeAmountMax){
           if(obj.incomeAmountMax<row2.incomeAmount){
              row2.incomeAmount = obj.incomeAmountMax;
           }
        }
        //最低
        if(obj&&obj.incomeAmountMin){
           if(obj.incomeAmountMin>row2.incomeAmount){
              row2.incomeAmount = obj.incomeAmountMin;
           }
        }
        //小数位
        if(obj&&obj.incomeAmountCarry=='四舍五入'){
           row2.incomeAmount = parseFloat(row2.incomeAmount).toFixed(parseInt(obj.incomeAmountDigits));
        }
        if(obj&&obj.incomeAmountCarry=='向上进位'){
            if(obj.incomeAmountDigits==1){
                let a = Math.ceil(row2.incomeAmount*10);
                a = a/10;
                row2.incomeAmount = parseFloat(a);
            }else if(obj.incomeAmountDigits==2){
                let a = Math.ceil(row2.incomeAmount*100);
                a = a/100;
                row2.incomeAmount = parseFloat(a);
            }else{
              row2.incomeAmount = parseFloat(Math.ceil(row2.incomeAmount));
            }
        }
        if(row2.incomeExchangeRate){
          row2.incomeFunctionalAmount =  row2.incomeAmount * row2.incomeExchangeRate
        }
				this.setIncomeFunctionalAmount(row2);
			},
			//本币金额
			setIncomeFunctionalAmount(row2) {
				if (row2.incomeExchangeRate === '' || row2.incomeAmount === '') {
					row2.incomeFunctionalAmount = 0;
				} else {
					row2.incomeFunctionalAmount = (row2.incomeExchangeRate * row2.incomeAmount).toFixed(2);

				}
				this.setIncomeAmountNotTax(row2);
				this.setTotalCost();
			},
			//无税金额
			setIncomeAmountNotTax(row2) {
				if (row2.incomeFunctionalAmount === '' || row2.incomeAmountTaxRate === '') {
					row2.incomeAmountNotTax = 0;
				} else {
					row2.incomeAmountNotTax =
						(
							row2.incomeFunctionalAmount /
							((100 + parseInt(row2.incomeAmountTaxRate)) / 100)
						).toFixed(2);
				}
				this.setIncomeAmountTax(row2);
			},
			//税额
			setIncomeAmountTax(row2) {
				if (row2.incomeFunctionalAmount === '' && row2.incomeAmountNotTax === '') {
					row2.incomeAmountTax = 0;
				} else {
					row2.incomeAmountTax = (row2.incomeFunctionalAmount - row2.incomeAmountNotTax).toFixed(2);

				}

			},
			setFieldValue() {
				for (var i = 0; i < this.data1.length; i++) {
					this.setFieldValueNULL1(i);
					if (this.data1[i].serviceName.indexOf('干线') > -1) {
						this.data1[i].mainRouting = this.data1[i].incomeFunctionalAmount;

						this.data1[i].feeder = null;
						this.data1[i].operation = null;
						this.data1[i].packaging = null;
						this.data1[i].storage = null;
						this.data1[i].postage = null;
						this.data1[i].clearance = null;
						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('支线') > -1) {
						this.data1[i].feeder = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;

						this.data1[i].operation = null;
						this.data1[i].packaging = null;
						this.data1[i].storage = null;
						this.data1[i].postage = null;
						this.data1[i].clearance = null;
						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('操作') > -1) {
						this.data1[i].operation = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;
						this.data1[i].feeder = null;

						this.data1[i].packaging = null;
						this.data1[i].storage = null;
						this.data1[i].postage = null;
						this.data1[i].clearance = null;
						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('包装') > -1) {
						this.data1[i].packaging = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;
						this.data1[i].feeder = null;
						this.data1[i].operation = null;

						this.data1[i].storage = null;
						this.data1[i].postage = null;
						this.data1[i].clearance = null;
						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('仓储') > -1) {
						this.data1[i].storage = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;
						this.data1[i].feeder = null;
						this.data1[i].operation = null;
						this.data1[i].packaging = null;

						this.data1[i].postage = null;
						this.data1[i].clearance = null;
						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('快递') > -1) {
						this.data1[i].postage = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;
						this.data1[i].feeder = null;
						this.data1[i].operation = null;
						this.data1[i].packaging = null;
						this.data1[i].storage = null;

						this.data1[i].clearance = null;
						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('关检') > -1) {
						this.data1[i].clearance = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;
						this.data1[i].feeder = null;
						this.data1[i].operation = null;
						this.data1[i].packaging = null;
						this.data1[i].storage = null;
						this.data1[i].postage = null;

						this.data1[i].exchange = null;
					} else if (this.data1[i].serviceName.indexOf('数据') > -1) {
						this.data1[i].exchange = this.data1[i].incomeFunctionalAmount;
						this.data1[i].mainRouting = null;
						this.data1[i].feeder = null;
						this.data1[i].operation = null;
						this.data1[i].packaging = null;
						this.data1[i].storage = null;
						this.data1[i].postage = null;
						this.data1[i].clearance = null;

					}
				}
			},
			//
			formatToFloat2(row2, item) {
				if (item == 'costQuantity') {
					row2.costQuantity = row2.costQuantity.replace(/[^0123456789.]/g, "");
					var t = row2.costQuantity.split('.');
					if (t.length > 1) {
						row2.costQuantity = t[0] + "." + t[1].substr(0, 3);
					}

				} else if (item == 'costUnitPrice') {
					row2.costUnitPrice = row2.costUnitPrice.replace(/[^0123456789.-]/g, "");
					let t = row2.costUnitPrice.split('.');
					if (row2.costUnitPrice.indexOf("-") > 0) {
						row2.costUnitPrice = row2.costUnitPrice.substr(0, row2.costUnitPrice.indexOf("-"));
					}
					if (t.length > 1) {
						row2.costUnitPrice = t[0] + "." + t[1].substr(0, 3);
					}
					// if(row2.costUnitPrice){
					// 	row2.costUnitPrice=this.getNumber2(parseFloat(row2.costUnitPrice))
					// }
				} else if (item == 'costAmount') {
					// this.$forceUpdate();
					row2.costAmount = row2.costAmount.replace(/[^0123456789.]/g, "");
					let t = row2.costAmount.split('.');
					if (t.length > 1) {
						row2.costAmount = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'costAmountTaxRate') {
					row2.costAmountTaxRate = row2.costAmountTaxRate.replace(/[^0123456789]/g, "");
					var t = row2.costAmountTaxRate.split('.');
					if (t.length > 1) {
						row2.costAmountTaxRate = t[0];
					}
				}
			},
			setcostExchangeRate(row2, vId) {
				let obj = {};
				obj = this.currencyCodeOptions.find((item) => {
					return item.currency_code === vId;
				});
        if(obj&&obj.currency_rate){
				   row2.costExchangeRate = obj.currency_rate;
        }
				this.setcostFunctionalAmount(row2);
			},
			//金额
			setcostAmount(row2) {
        let obj = {};
        obj = this.serviceOptions.find((item) => {
       	 return item.serviceId == row2.serviceId;
        });

        // if(row2.costQuantity==1){
        //    if(obj.costAmountMax){
        //       if(row2.costUnitPrice){
        //           if(row2.costUnitPrice<obj.costAmountMax){
        //             row2.costUnitPrice = obj.costAmountMax;
        //           }
        //       }else{
        //         row2.costUnitPrice = obj.costAmountMax;
        //       }
        //    }
        //    //最低
        //       if(obj.costAmountMin){
        //         if(row2.costUnitPrice){
        //            if(row2.costUnitPrice<obj.costAmountMin){
        //              row2.costUnitPrice = obj.costAmountMin;
        //            }
        //         }else{
        //           row2.costUnitPrice = obj.costAmountMin;
        //         }
        //       }
        // }

				if (row2.costQuantity === '' || row2.costUnitPrice === '') {
					row2.costAmount = 0;
				} else {
					row2.costAmount = (row2.costQuantity * row2.costUnitPrice);
				}
        //最高
        if(obj&&obj.costAmountMax){
           if(obj.costAmountMax<row2.costAmount){
              row2.costAmount = obj.costAmountMax;
           }
        }
        //最低
        if(obj&&obj.costAmountMin){
           if(obj.costAmountMin>row2.costAmount){
              row2.costAmount = obj.costAmountMin;
           }
        }
        //小数位
        if(obj&&obj.costAmountCarry=='四舍五入'){
           row2.costAmount = row2.costAmount.toFixed(parseInt(obj.costAmountDigits));
        }
        if(obj&&obj.costAmountCarry=='向上进位'){
            if(obj.costAmountDigits==1){
                let a = Math.ceil(row2.costAmount*10);
                a = a/10;
                row2.costAmount = parseFloat(a);
            }else if(obj.costAmountDigits==2){
                let a = Math.ceil(row2.costAmount*100);
                a = a/100;
                row2.costAmount = parseFloat(a);
            }else{
              row2.costAmount = parseFloat(Math.ceil(row2.costAmount));
            }
        }
        if(row2.costExchangeRate){
          row2.costFunctionalAmount =  row2.costAmount * row2.costExchangeRate
        }
				this.setcostFunctionalAmount(row2);
			},
			//本币金额
			setcostFunctionalAmount(row2) {
				if (row2.costExchangeRate === '' || row2.costAmount === '') {
					row2.costFunctionalAmount = 0;
				} else {
					row2.costFunctionalAmount = (row2.costExchangeRate * row2.costAmount).toFixed(2);
				}
				this.setcostAmountNotTax(row2);
				this.setTotalCost();
			},
			//无税金额
			setcostAmountNotTax(row2) {
				if (row2.costFunctionalAmount === '' || row2.costAmountTaxRate === '') {
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
				if (row2.costFunctionalAmount === '' || row2.costAmountNotTax === '') {
					row2.costAmountTax = 0;
				} else {
					row2.costAmountTax = (row2.costFunctionalAmount - row2.costAmountNotTax).toFixed(2);
				}

			},
			setTotalCost() {
				// let totalCost2 = 0;
				// for(var i = 0; i < this.data2.length; i++) {
				// 	totalCost2 = totalCost2 + parseFloat(this.data2[i].costFunctionalAmount);
				// }
				// this.totalCost = totalCost2.toFixed(2);
				this.incomeValue = 0;
				this.costValue = 0;
				var map = new Map();
				var map2 = new Map();
				for (var i = 0; i < this.data1.length; i++) {
					if (parseFloat(this.data1[i].incomeUnitPrice)) {

					} else {
						this.data1[i].incomeUnitPrice = 0
					}
					this.incomeValue = this.incomeValue + parseFloat(this.data1[i].incomeFunctionalAmount)
					if (map.has(this.data1[i].incomeCurrency)) {
						map.set(this.data1[i].incomeCurrency, map.get(this.data1[i].incomeCurrency) + parseFloat(this.data1[i].incomeAmount));
					} else {
						map.set(this.data1[i].incomeCurrency, parseFloat(this.data1[i].incomeAmount));
					}
					if (this.data1[i].incomeUnitPrice) {
						this.data1[i].incomeUnitPrice = parseFloat(this.data1[i].incomeUnitPrice).toFixed(3)
					}
					if (this.data1[i].incomeQuantity) {
						this.data1[i].incomeQuantity = parseFloat(parseFloat(this.data1[i].incomeQuantity).toFixed(3))
					}
          if (this.data1[i].incomeAmount) {
          	this.data1[i].incomeAmount = parseFloat(this.data1[i].incomeAmount).toFixed(2)
          }

				}

				for (var i = 0; i < this.data2.length; i++) {
					if (parseFloat(this.data2[i].costUnitPrice)) {

					} else {
						this.data2[i].costUnitPrice = 0
					}
					this.costValue = this.costValue + parseFloat(this.data2[i].costFunctionalAmount)
					if (map2.has(this.data2[i].costCurrency)) {
						map2.set(this.data2[i].costCurrency, map2.get(this.data2[i].costCurrency) + parseFloat(this.data2[i].costAmount));
					} else {
						map2.set(this.data2[i].costCurrency, parseFloat(this.data2[i].costAmount));
					}
					if (this.data2[i].costUnitPrice) {
						this.data2[i].costUnitPrice = parseFloat(this.data2[i].costUnitPrice).toFixed(3)
					}
					if (this.data2[i].costQuantity) {
						this.data2[i].costQuantity = parseFloat(parseFloat(this.data2[i].costQuantity).toFixed(3))
					}
          if (this.data2[i].costAmount) {
          	this.data2[i].costAmount = parseFloat(this.data2[i].costAmount).toFixed(2)
          }

				}
				// for(var key of map.keys()){
				//     alert("属性：" + key + ",值："+ map.get(key));
				// }
				this.incomeMap = map;
				this.costMap = map2;
				// this.incomeValueStr=JSON.stringify(map);
				// this.costValueStr=JSON.stringify(map2);
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getNumber2(data) {
				return data.toFixed(2);
			},
      getNumber3(data) {
      	return data.toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
			setFieldValue2() {
				for (var i = 0; i < this.data2.length; i++) {
					this.setFieldValueNULL2(i);
					if (this.data2[i].serviceName.indexOf('干线') > -1) {
						this.data2[i].mainRouting = this.data2[i].costFunctionalAmount;
						this.data2[i].feeder = null;
						this.data2[i].operation = null;
						this.data2[i].packaging = null;
						this.data2[i].storage = null;
						this.data2[i].postage = null;
						this.data2[i].clearance = null;
						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('支线') > -1) {
						this.data2[i].feeder = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;

						this.data2[i].operation = null;
						this.data2[i].packaging = null;
						this.data2[i].storage = null;
						this.data2[i].postage = null;
						this.data2[i].clearance = null;
						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('操作') > -1) {
						this.data2[i].operation = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;
						this.data2[i].feeder = null;

						this.data2[i].packaging = null;
						this.data2[i].storage = null;
						this.data2[i].postage = null;
						this.data2[i].clearance = null;
						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('包装') > -1) {
						this.data2[i].packaging = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;
						this.data2[i].feeder = null;
						this.data2[i].operation = null;

						this.data2[i].storage = null;
						this.data2[i].postage = null;
						this.data2[i].clearance = null;
						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('仓储') > -1) {
						this.data2[i].storage = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;
						this.data2[i].feeder = null;
						this.data2[i].operation = null;
						this.data2[i].packaging = null;

						this.data2[i].postage = null;
						this.data2[i].clearance = null;
						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('快递') > -1) {
						this.data2[i].postage = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;
						this.data2[i].feeder = null;
						this.data2[i].operation = null;
						this.data2[i].packaging = null;
						this.data2[i].storage = null;

						this.data2[i].clearance = null;
						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('关检') > -1) {
						this.data2[i].clearance = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;
						this.data2[i].feeder = null;
						this.data2[i].operation = null;
						this.data2[i].packaging = null;
						this.data2[i].storage = null;
						this.data2[i].postage = null;

						this.data2[i].exchange = null;
					} else if (this.data2[i].serviceName.indexOf('数据') > -1) {
						this.data2[i].exchange = this.data2[i].costFunctionalAmount;
						this.data2[i].mainRouting = null;
						this.data2[i].feeder = null;
						this.data2[i].operation = null;
						this.data2[i].packaging = null;
						this.data2[i].storage = null;
						this.data2[i].postage = null;
						this.data2[i].clearance = null;

					}
				}

			},
			setFieldValueNULL2(i) {
				this.data2[i].mainRouting = null;
				this.data2[i].feeder = null;
				this.data2[i].operation = null;
				this.data2[i].exchange = null;
				this.data2[i].packaging = null;
				this.data2[i].storage = null;
				this.data2[i].postage = null;
				this.data2[i].clearance = null;
				this.data2[i].exchange = null;
			},
			setFieldValueNULL1(i) {
				this.data1[i].mainRouting = null;
				this.data1[i].feeder = null;
				this.data1[i].operation = null;
				this.data1[i].exchange = null;
				this.data1[i].packaging = null;
				this.data1[i].storage = null;
				this.data1[i].postage = null;
				this.data1[i].clearance = null;
				this.data1[i].exchange = null;
			},
			formatterNumber2(row, column) {
				if (row.incomeAmount === '' || row.incomeAmount === 'null' || row.incomeAmount == null) {
					return "";
				} else {
					return this.getNumber(parseFloat(row.incomeAmount));
				}
			},
			formatterNumber22(row, column) {
				if (row.incomeUnitPrice === '' || row.incomeUnitPrice === 'null' || row.incomeUnitPrice == null) {
					return "";
				} else {
					return this.getNumber(parseFloat(row.incomeUnitPrice));
				}
			},
			formatterNumber3(row, column) {
				if (row.incomeFunctionalAmount === '' || row.incomeFunctionalAmount === 'null' || row.incomeFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(parseFloat(row.incomeFunctionalAmount));
				}
			},
			formatterNumbercost2(row, column) {
				if (row.costAmount === '' || row.costAmount === 'null' || row.costAmount == null) {
					return "";
				} else {
					return this.getNumber(parseFloat(row.costAmount));
				}
			},
			formatterNumbercost3(row, column) {
				if (row.costFunctionalAmount === '' || row.costFunctionalAmount === 'null' || row.costFunctionalAmount == null) {
					return "";
				} else {
					return this.getNumber(parseFloat(row.costFunctionalAmount));
				}
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>
<style>
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

	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.orderEditPage222 .el-input__inner {
		text-align: right !important;
	}
</style>
