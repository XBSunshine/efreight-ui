<template>
	<el-dialog title="清单 - 新增" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<div class="orderEditPage">
			<el-form :model="ruleForm2" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm2.customerName" disabled style="width:690px;margin-right: 5px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm2.statementNum" disabled style="width:255px;">
								<template slot="prepend">清单编号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input class="ef_input_icon" auto-complete="off" style="width:690px;margin-right: 5px;" clearable>
								<template slot="prepend">公司抬头</template>
								<el-select slot="suffix" v-model="ruleForm2.orgBankConfigId" placeholder="请选择公司抬头" style="width:593px;margin-right: -5px;" clearable>
									<el-option v-for="(item,index) in orgBankConfigs" :key="index" :label="item.titleCn" :value="item.orgBankConfigId">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm2.statementDate" disabled style="width:255px;">
								<template slot="prepend">清单日期</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
        <el-col class="elementWidth">
          <el-form-item label="收款客户" >
            <el-input v-model="ruleForm2.customerName" auto-complete="off" disabled style="width:410px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="清单编号">
            <el-input  auto-complete="off" disabled style="width:155px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="清单日期">
            <el-input  auto-complete="off" disabled v-model="ruleForm2.statementDate" style="width:115px">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->

				<el-row>



					<el-col class="elementWidth" style="margin-top: -20px;">
						<el-row>
							<el-button type="text" style="margin-left: 20px;" disabled>清单金额</el-button>
						</el-row>
						<el-row style="padding-left:10px;padding-right:10px">
							<el-form-item>
								<el-table :data="data222" :show-header='false' style="width:460px;">
									<el-table-column prop="amount" align="right" label="金额" :formatter="formatterNumber22"></el-table-column>
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
									<el-table-column prop="functionalAmount" align="right" label="本币金额" :formatter="formatterNumber33"></el-table-column>

								</el-table>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col class="elementWidth" style="margin-top: -20px;">
						<el-row>
							<el-button type="text" style="margin-left: 20px;" disabled>备注</el-button>
						</el-row>
						<el-row>
							<el-form-item>
								<el-input type="textarea" show-word-limit maxlength="200" v-model="ruleForm2.statementRemark" auto-complete="off" :rows="3" style="width:470px" show-word-limit>
								</el-input>
							</el-form-item>
						</el-row>
					</el-col>

				</el-row>
				<!-- <el-row>
        <el-col class="elementWidth">
          <el-form-item label="清单金额">
            <el-table :data="data222" :show-header='false' style="width:410px">
            <el-table-column prop="amount" label="金额" :formatter="formatterNumber22"></el-table-column>
            <el-table-column align="center" label="币种" width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.currency!='CNY'" style="color:red">{{scope.row.currency}}</span>
                <span v-else>{{scope.row.currency}}</span>
              </template>
            </el-table-column>
             <el-table-column align="right" :formatter="formatterName1" width="50"></el-table-column>
            <el-table-column label="汇率" >
              <template slot-scope="scope">
              <el-input  v-model="scope.row.exchangeRate" :disabled="scope.row.currency=='CNY'" @input="formatToFloat(scope.row,'exchangeRate')" maxlength="8" @change="setFunctionalAmount(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="right" :formatter="formatterName2" width="50"></el-table-column>
            <el-table-column prop="functionalAmount" label="本币金额" :formatter="formatterNumber33"></el-table-column>

          </el-table>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="备注">
            <el-input v-model="ruleForm2.statementRemark" type="textarea" auto-complete="off" style="width:370px" :rows="3" maxlength="200">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->

				<!-- <el-row >
        <el-form-item label="清单本币金额">
          <span>{{ruleForm3.functionalAmount}}</span>
        </el-form-item>
      </el-row> -->
				<el-row>
					<div style="margin:0px 10px 10px 22px;">

						<span>清单本币金额&nbsp;&nbsp;&nbsp;{{ruleForm3.functionalAmount}}</span>

					</div>


				</el-row>
			</el-form>
		</div>
		<div style="margin-left:10px;margin-right:10px">
			<el-table :data="data1" border>

				<el-table-column align="center" prop="debitNoteNum" label="账单编号" width="150"></el-table-column>
				<el-table-column v-if="chenckBusCode()" align="center" prop="awbNumber" :label="awbNumberLabel" width="150"></el-table-column>
				<el-table-column align="center" prop="orderCode" label="订单号" width="150"></el-table-column>
				<el-table-column align="center" prop="customerNumber" label="客户单号" width="150"></el-table-column>
				<el-table-column align="center" prop="flightDate" :label="flightDateLabel" width="150"></el-table-column>
				<el-table-column align="right" label="账单金额">
					<template slot-scope="scope">
						<p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" prop="functionalAmount" label="本币金额" :formatter="formatterNumber3"></el-table-column> -->
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
        currencyCodeOptions:[],
        awbNumberLabel:'主单号',
        flightDateLabel:'开航日期',
        orgBankConfigs:[],
        ruleForm3: {
          amountTax:'',
          amountNotTax:'',
          functionalAmount:'',
          amount:''
        },
        ruleForm2: {
          orgId:'',
          orgBankConfigId:-1,
          statementNum:'',
          businessScope:'',
          statementDate:'',
          customerId:'',
          customerName:'',
          currency:'',
          exchangeRate:'',
          amount:'',
          functionalAmount:'',
          amountTaxRate:'',
          amountNotTax:'',
          amountTax:'',
          statementRemark:'',
          debitNoteIds:'',
          currencyList:[],
          billList:[]
        }
      }
    },

    inject:['queryList'],

    created: function(){
      if(this.frow.selections[0].businessScope.startsWith('T')){
         this.awbNumberLabel = "运单号";
         if(this.frow.selections[0].businessScope=='TE'){
           this.flightDateLabel = "发车日期";
         }else{
           this.flightDateLabel = "到达日期";
         }
      }else if(this.frow.selections[0].businessScope.startsWith('A')||this.frow.selections[0].businessScope.startsWith('S')){
         this.awbNumberLabel = "主单号";
         if(this.frow.selections[0].businessScope.endsWith('E')){
           this.flightDateLabel = "开航日期";
         }else{
           this.flightDateLabel = "到港日期";
         }
      }else if(this.frow.selections[0].businessScope=='LC'){
         this.awbNumberLabel = "";
         this.flightDateLabel = "用车日期";
      }else if(this.frow.selections[0].businessScope=='IO'){
         this.awbNumberLabel = "";
         this.flightDateLabel = "业务日期";
      }
      this.ruleForm2.statementDate = this.getDateTime(new Date());
      this.init();
      // this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
      // this.currencyCodeOptions=response.data.data;

      //  }.bind(this)
      // );

      this.data1=this.frow.selections;
      this.ruleForm2.currencyList=this.data222;

      this.$axios.post2('/afbase/statement/queryBill',this.ruleForm2)
      .then(function(response) {
        this.data222 = response.data.data;
        this.setTotalCost()
      }.bind(this));
	  
	  this.$axios.get('/hrs/orgBankConfig').then(response=>{
		  this.orgBankConfigs = response.data.data
	  })

    },

    methods: {
      init(){
        this.ruleForm2.businessScope=this.frow.selections[0].businessScope;
        this.ruleForm2.customerName=this.frow.selections[0].customerName;
        this.ruleForm2.customerId=this.frow.selections[0].customerId;
        this.ruleForm2.currency=this.frow.selections[0].currency;
        // this.setExchangeRate(this.ruleForm2.currency);
        this.ruleForm2.amountTaxRate=this.frow.selections[0].amountTaxRate;
        this.ruleForm2.amount=0;
        this.frow.selections.forEach((row) => {
            this.ruleForm2.amount=this.ruleForm2.amount+row.functionalAmount;
            if(this.ruleForm2.debitNoteIds==''){
              this.ruleForm2.debitNoteIds=row.debitNoteId;
            }else{
               this.ruleForm2.debitNoteIds=this.ruleForm2.debitNoteIds+','+row.debitNoteId;
            }
            var currency=row.currency.split(',');
            for (var i = 0; i < currency.length; i++) {
              if (this.ruleForm2.currency.indexOf(currency[i])<0) {
                this.ruleForm2.currency=this.ruleForm2.currency+","+currency[i];
              }
            }

        })


      },
      chenckBusCode(){
        if(this.data1[0].debitNoteNum.startsWith('IO')||this.data1[0].debitNoteNum.startsWith('LC')){
           return false;
        }else{
          return true;
        }
      },
      doAdd() {
        let j = {
          orderId: this.frow.orderId,
          orderUuid: this.frow.orderUuid,
          incomeId: '',
          businessScope: 'AE',
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
      },
      doDelete(index, rrow) {
        this.data1.splice(index, 1);
        this.setTotalCost();
      },
      doSave(){
		  if(!this.ruleForm2.orgBankConfigId){
			  this.openError("请选择公司抬头")
			  return
		  }
        this.ruleForm2.currencyList=this.data222;
        this.ruleForm2.billList=this.data1;
        if(this.ruleForm2.billList[0]&&this.ruleForm2.billList[0].selections){
           this.ruleForm2.billList[0].selections = [];
        }
        if(this.ruleForm2.billList[0]&&this.ruleForm2.billList[0].data){
           this.ruleForm2.billList[0].data = [];
        }
        this.$axios.post2('/afbase/statement/doSave', this.ruleForm2)
          .then(function(response) {
            if(response.data.code==0){
              this.openSuccess();
              this.queryList();
              this.handleClose();
            }else{
              this.openError(response.data.messageInfo);
            }

         }.bind(this)).catch(function(error) {
          let errorinfo = error.response.data.messageInfo;
          if (errorinfo.indexOf("已经制做过清单")>-1) {
            this.openError(errorinfo);
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
          message: '操作失败，'+info,
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
        if(_month < 10) {
          _month = "0" + _month;
        }
        if(_date < 10) {
          _date = "0" + _date;
        }
        // return _year + "-" + _month + "-01";
        return _year + "-" + _month + "-" + _date;
      },
      setExchangeRate(vId){
        let obj = {};
        obj = this.currencyCodeOptions.find((item)=>{
            return item.currency_code === vId;
        });
        if (obj.currency_rate) {
          this.ruleForm2.exchangeRate=obj.currency_rate;
        }else{
          this.ruleForm2.exchangeRate=0;
        }
      },
      formatterName1(row, column) {
          return "汇率:";
      },
      formatterName2(row, column) {
          return "本币:";
      },
      formatterNumber2(row, column) {
        if(row.incomeAmount === '' || row.incomeAmount === 'null' || row.incomeAmount == null) {
          return "";
        } else {
          return this.getNumber(row.incomeAmount);
        }
      },
      formatterNumber22(row, column) {
        if(row.amount === '' || row.amount === 'null' || row.amount == null) {
          return "";
        } else {
          return this.getNumber(row.amount);
        }
      },
      formatterNumber3(row, column) {
        if(row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
          return "";
        } else {
          return this.getNumber(row.functionalAmount);
        }
      },
      formatterNumber33(row, column) {
        if(row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
          return "";
        } else {
          return this.getNumber(row.functionalAmount);
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

      //本币金额
      setFunctionalAmount(row2){

        if(row2.exchangeRate==='' || row2.amount===''){
          row2.functionalAmount=0;
        }else{
          row2.functionalAmount=row2.exchangeRate*row2.amount;
        }
        this.setTotalCost();
        // this.setcostAmountNotTax(row2);
      },
      //本币金额求和
      setTotalCost(){
        let totalCost2=0;
        for (var i = 0; i < this.data222.length; i++) {
          totalCost2=totalCost2+parseFloat(this.data222[i].functionalAmount);
        }
        this.ruleForm2.functionalAmount=totalCost2;
        this.ruleForm3.functionalAmount=this.getNumber(parseFloat(this.ruleForm2.functionalAmount));
        this.ruleForm2.amountNotTax=(this.ruleForm2.functionalAmount/((100+this.ruleForm2.amountTaxRate)/100)).toFixed(2);
        this.ruleForm2.amountTax=(this.ruleForm2.functionalAmount-this.ruleForm2.amountNotTax).toFixed(2);
      },
      //无税金额
      setcostAmountNotTax(row2){
        if(row2.functionalAmount==='' || row2.amountTaxRate===''){
          row2.amountNotTax=0;
        }else{
          row2.amountNotTax=
          (
            row2.functionalAmount/
            ((100+ parseInt(row2.amountTaxRate))/100)
            ).toFixed(2);
        }
        this.setcostAmountTax(row2);
      },
      //税额
      setcostAmountTax(row2){
        if(row2.functionalAmount==='' || row2.amountNotTax===''){
          row2.amountTax=0;
        }else{
          row2.amountTax=(row2.functionalAmount-row2.amountNotTax).toFixed(2);
        }

      },

      getNumber(data) {
        return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      formatToFloat(row2,item) {
        if(item=='exchangeRate'){
          row2.exchangeRate =row2.exchangeRate.replace(/[^0123456789.]/g, "");
            var t = row2.exchangeRate.split('.');
            if(t.length > 1) {
              row2.exchangeRate = t[0]+ "." + t[1].substr(0, 4);
            }
        }

      },
      handleClose() {
        this.$emit('update:visible', false);
      }

//---------------------

    }
  }
</script>
<style type="text/css">

</style>
