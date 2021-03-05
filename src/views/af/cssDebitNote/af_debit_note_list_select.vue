<template>
  <el-dialog title="账单 - 选择" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose"  append-to-body>
    <el-form :model="query" label-width="80px">
      <el-row>

        <el-col class="elementWidth">
          <el-form-item label="收款客户">
            <el-input v-model="query.customerName" disabled auto-complete="off" style="width:283px;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="账单编号">
            <el-input v-model="query.debitNoteNum" clearable auto-complete="off" style="width: 175px;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item :label="awbNumberLabel" label-width="60px">
            <el-input style="width: 135px;margin-left: -5px;" v-model="query.awbNumber" clearable auto-complete="off">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="订单号" label-width="75px">
            <el-input style="width: 150px;margin-left: -5px;" v-model="query.orderCode" clearable auto-complete="off">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
          <el-form-item label-width="40px">
            <el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
            <el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
            <el-button style="padding: 9px 7px;margin-left: 0px;" type="primary" size="small" @click="queryList2">查询</el-button>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="showFlag">
        <el-col class="elementWidth">
          <el-form-item :label="flightDateLabel">
            <el-date-picker style="width: 135px" v-model="query.flightDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
            </el-date-picker>
            <span>-</span>
            <el-date-picker style="width: 135px" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="账单日期">
            <el-date-picker style="width: 175px;" v-model="query.debitNoteDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
            </el-date-picker>
            <span>-</span>
            <el-date-picker style="width: 175px;" v-model="query.debitNoteDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="客户单号" label-width="75px">
            <el-input style="width: 150px;margin-left: -5px;" v-model="query.customerNumber" clearable auto-complete="off">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div>
      <el-table :data="data3" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" fixed width="40">
        </el-table-column>
        <el-table-column prop="debitNoteNum" label="账单编号" width="150" ></el-table-column>
        <el-table-column prop="awbNumber" v-if="chenckBusCode()" :label="awbNumberLabel" width="150"></el-table-column>
        <el-table-column prop="orderCode" label="订单号" width="150"></el-table-column>
        <el-table-column prop="customerNumber" label="客户单号" width="150"></el-table-column>
        <el-table-column prop="flightDate" :label="flightDateLabel" width="150"></el-table-column>
        <el-table-column align="right" label="账单金额" >
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
              <font v-if="item.indexOf('CNY')>-1">{{item}}</font>
              <font v-else style="color: red;">{{item}}</font>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="functionalAmount" label="本币金额" :formatter="formatterNumber3"></el-table-column>
      </el-table>
    </div>
    <div style="margin:10px 10px 10px 10px;">
      <el-button type="primary" size="small" v-on:click="doSelect">确定</el-button>
      <el-button type="primary" size="small" v-on:click="handleClose" >取消</el-button>
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
        data3: [],
        showFlag: false,
        selections2: [],
        awbNumberLabel:'主单号',
        flightDateLabel:'开航日期',
        query: {
          businessScope: '',
          debitNoteNum: '',
          awbNumber: '',
          orderCode: '',
          customerName: '',
          customerNumber: '',
          debitNoteDateStart: '',
          debitNoteDateEnd: '',
          flightDateStart: '',
          flightDateEnd: ''
        },
      }
    },

     inject:['setData1'],

    created: function(){
      if(this.frow.businessScope.startsWith('T')){
         this.awbNumberLabel = "运单号";
         if(this.frow.businessScope=='TE'){
           this.flightDateLabel = "发车日期";
         }else{
           this.flightDateLabel = "到达日期";
         }
      }else if(this.frow.businessScope.startsWith('A')||this.frow.businessScope.startsWith('S')){
         this.awbNumberLabel = "主单号";
         if(this.frow.businessScope.endsWith('E')){
           this.flightDateLabel = "开航日期";
         }else{
           this.flightDateLabel = "到港日期";
         }
      }else if(this.frow.businessScope=='LC'){
         this.awbNumberLabel = "";
         this.flightDateLabel = "用车日期";
      }else if(this.frow.businessScope=='IO'){
         this.awbNumberLabel = "";
         this.flightDateLabel = "业务日期";
      }
      this.query.amountTaxRate=this.frow.amountTaxRate;
      this.query.customerName=this.frow.customerName;
      this.query.debitNoteIds=this.frow.debitNoteIds;
      this.query.businessScope=this.frow.businessScope;
      this.queryList2();
    },

    methods: {
      chenckBusCode() {
      	if (this.query.businessScope == 'IO' ||this.query.businessScope == 'LC') {
      		return false;
      	} else {
      		return true;
      	}
      },
      queryList2() {
        this.$axios.get2('/afbase/debitNote/select2', this.query).then(function(response){
          this.data3=response.data.data;
        }.bind(this));
      },
      doSelect(){
        this.setData1(this.selections2);
        this.handleClose();
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
      handleSelectionChange(val) {
        this.selections2 = val;
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
        let awbNumber='';
        if (row.awbNumber && row.hawbNumber) {
          awbNumber=row.awbNumber+'-'+row.hawbNumber
        }else if(row.awbNumber){
          awbNumber=row.awbNumber;
        }else{
          awbNumber=row.hawbNumber
        }
        return awbNumber;
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
