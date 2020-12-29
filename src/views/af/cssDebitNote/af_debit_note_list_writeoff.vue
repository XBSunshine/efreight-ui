<template>
  <el-dialog title="清单 - 核销" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-50px;" >
    <div class="orderEditPage">
    <el-form :model="ruleForm2" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.customerName" disabled style="width:635px;margin-right: 15px;">
              <template slot="prepend">收款客户</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.statementNum" disabled style="width:300px;">
              <template slot="prepend">清单编号</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input auto-complete="off" v-model="ruleForm2.amountWriteoff" style="width:325px;margin-right: 275px;" @input="formatToFloat('amountWriteoff')" @change="change00" :disabled="flag3">
              <template slot="prepend">核销金额</template>

              <el-select slot="append" v-model="ruleForm2.currency" placeholder="请选择" style="width:91px" @change="changeCurrency" :disabled="flag3">
                <el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item>
            <el-input style="width:295px;margin-left: -270px;">
              <template slot="prepend">
                <span>科目</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm2.financialAccountName" filterable placeholder="请选择" style="width:226px;margin-right: -5px;" @change="setFinancialAccount">
                <el-option v-for="(item,index) in financialAccounts" :key="item.financialAccountId" :label="`${item.financialAccountName} ${item.financialAccountCode}`" :value="item.financialAccountId">
                  <span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>

      <!--   <el-col class="elementWidth">
          <el-form-item label="核销金额" >
            <el-select v-model="ruleForm2.currency" filterable placeholder="请选择" style="width:91px" @change="changeCurrency" :disabled="flag3">
              <el-option
                v-for="item in currencyCodeOptions"
                :key="item.currency_code"
                :label="item.currency_code"
                :value="item.currency_code">
              </el-option>
            </el-select>
            <el-input  auto-complete="off" v-model="ruleForm2.amountWriteoff" style="width:175px" @input="formatToFloat('amountWriteoff')" @change="change00" :disabled="flag3">
            </el-input>
          </el-form-item>
        </el-col> -->

        <el-col class="elementWidth">
          <el-form-item label="">
            <el-input style="width:300px;margin-left: 15px;">
              <template slot="prepend"><b style="color:red">*</b>核销日期</template>
              <el-date-picker slot="suffix" v-model="ruleForm2.writeoffDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 203px; margin-right:-5px">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth" style="margin-top: -20px;">
          <el-row>
            <el-button type="text" style="margin-left: 20px;" disabled>备注</el-button>
          </el-row>
          <el-row>
            <el-form-item>
              <el-input type="textarea" show-word-limit maxlength="200" v-model="ruleForm2.writeoffRemark" auto-complete="off" :rows="2" style="width:960px" show-word-limit>
              </el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
    <div style="margin:10px 10px 10px 10px;">
      <!-- <div style="position: relative;left: 21px;top: 30px;z-index: 10;">
        <el-checkbox v-model="allCheck" @change="changeAllCheck"></el-checkbox>
      </div> -->
      <el-table :data="data1" border >
        <el-table-column fixed type="index" label=" " width="40" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checkBox" @change="changeRowCheck(scope.row)" :disabled="flag3"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="right" label="应收金额">
          <template slot-scope="scope">
              <font v-if="scope.row.currency=='CNY'">{{formatterNumber1(scope.row)+'('+scope.row.currency+')'}}</font>
              <font v-else style="color: red;">{{formatterNumber1(scope.row)+'('+scope.row.currency+')'}}</font>
          </template>
        </el-table-column>
        <el-table-column align="right" label="已核销金额">
          <template slot-scope="scope">
              <font v-if="scope.row.currency=='CNY'">{{formatterNumber2(scope.row)+'('+scope.row.currency+')'}}</font>
              <font v-else style="color: red;">{{formatterNumber2(scope.row)+'('+scope.row.currency+')'}}</font>
          </template>
        </el-table-column>
        <el-table-column align="right" label="未核销金额">
          <template slot-scope="scope">
              <font v-if="scope.row.currency=='CNY'">{{formatterNumber3(scope.row)+'('+scope.row.currency+')'}}</font>
              <font v-else style="color: red;">{{formatterNumber3(scope.row)+'('+scope.row.currency+')'}}</font>
          </template>
        </el-table-column>
        <el-table-column align="right" label="未核销金额（本币）" width="150">
          <template slot-scope="scope">
              <font v-if="scope.row.currency=='CNY'">{{formatterNumber4(scope.row)}}</font>
              <font v-else style="color: red;">{{formatterNumber4(scope.row)}}</font>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="exchangeRate" label="汇率" width="60"></el-table-column>
        <el-table-column align="center" label="本次核销金额" width="160">
          <template slot-scope="scope">
          <el-input class="orderEditPage222" v-model="scope.row.amountWriteoff2" align="right" maxlength="11" @input="formatToFloat2(scope.row,'amountWriteoff2')" :disabled="flag3||scope.row.currency!=ruleForm2.currency" @change="change11(scope.row)" style="width:115px">
          </el-input>
          <font v-if="scope.row.currency=='CNY'">{{scope.row.currency}}</font>
          <font v-else style="color: red;">{{scope.row.currency}}</font>
          </template>
        </el-table-column>
        <el-table-column align="right" label="本次核销金额（本币）" width="160">
          <template slot-scope="scope">
          <el-input class="orderEditPage222" v-model="scope.row.functionalAmountWriteoff2" align="right"  maxlength="11" @input="formatToFloat2(scope.row,'functionalAmountWriteoff2')" disabled @change="change22(scope.row)">
          </el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin:10px 10px 10px 10px;">
      <el-button type="primary" size="small" v-on:click="doSave" >确定</el-button>
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
        data1: [],
        functionalAmountNo:0,
        flag1:false,
        flag2:false,
        flag3:false,
        allCheck: false,
        total2:0,
        data222: [],
        currencyCodeOptions:[],
        financialAccounts: [],
        ruleForm3: {
          amountTax:'',
          amountNotTax:'',
          functionalAmount:'',
          amount:''
        },
        ruleForm2: {
          rowUuid:'',
          statementId:'',
          businessScope:'',
          customerId:'',
          customerName:'',
          writeoffDate:'',
          currency:'',
          statementNum:'',
          amountWriteoff:'',
          writeoffRemark:'',
          listCurrencyList:[],
          financialAccountName: '',
          financialAccountCode: '',
          financialAccountType: '',
        }
      }
    },

    inject:['queryList'],

    created: function(){
      // this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
      //     this.currencyCodeOptions=response.data.data;
      //  }.bind(this)
      // );

      this.functionalAmountNo=this.frow.functionalAmountNo;

      this.ruleForm2.writeoffDate = this.getDateTime(new Date());
      this.ruleForm2.statementId=this.frow.statementId;
      this.ruleForm2.rowUuid=this.frow.rowUuid;
      this.ruleForm2.customerId=this.frow.customerId;
      this.ruleForm2.customerName=this.frow.customerName;
      this.ruleForm2.businessScope=this.frow.businessScope;
      this.ruleForm2.statementNum=this.frow.statementNum;
      this.$axios.post('/afbase/cssIncomeWriteoff/queryListCurrency/'+this.frow.statementId)
      .then(function(response) {
        this.data1 = response.data.data;
        let isHaved=0;
        let k=0;
        let total=0;
        let exchangeRate=0;
        for (var i = 0; i < this.data1.length; i++) {
          this.data1[i].amountWriteoff2=0;
          this.data1[i].functionalAmountWriteoff2=0;
          total=total+this.data1[i].functionalAmountWriteoffNo;

          if (this.data1[i].currency=='CNY') {
            isHaved=1;
          }
          if (Math.abs(this.data1[i].functionalAmountWriteoffNo)>0) {
            k=i;
          }
          this.currencyCodeOptions.push({currency_code:this.data1[i].currency});
        }
        //负数
        if (this.frow.functionalAmount<0) {
            if (isHaved==1) {
            }else{
              this.currencyCodeOptions.push({currency_code:'CNY'});
              isHaved=1;
            }
            this.flag3=true;
        }
        if (isHaved==1 && this.frow.functionalAmount<0) {
          this.ruleForm2.currency='CNY';
          exchangeRate=1;
          this.flag1=true;
          this.flag2=false;
          this.ruleForm2.amountWriteoff=(total/exchangeRate).toFixed(2);
          for (var i = 0; i < this.data1.length; i++) {
            this.data1[i].amountWriteoff2=this.data1[i].amountWriteoffNo;
            this.data1[i].functionalAmountWriteoff2=this.data1[i].functionalAmountWriteoffNo;
          }
        }else{
          this.ruleForm2.currency=this.data1[k].currency;
           exchangeRate=this.data1[k].exchangeRate;
          if (isHaved==1) {
            this.flag1=true;
            this.flag2=false;1
          }else{
            this.flag1=false;
            this.flag2=true;
          }
          this.ruleForm2.amountWriteoff=parseFloat(this.data1[k].amountWriteoffNo).toFixed(2);
          this.data1[k].amountWriteoff2=this.data1[k].amountWriteoffNo;
            this.data1[k].functionalAmountWriteoff2=this.data1[k].functionalAmountWriteoffNo;
        }
        // 格式
        for (var i = 0; i < this.data1.length; i++) {
          // if (this.data1[i].amountWriteoff2) {
            this.data1[i].amountWriteoff2=parseFloat(this.data1[i].amountWriteoff2).toFixed(2)
          // }
          // if (this.data1[i].functionalAmountWriteoff2) {
            this.data1[i].functionalAmountWriteoff2=parseFloat(this.data1[i].functionalAmountWriteoff2).toFixed(2)
          // }
        }
        this.setCheckBox();
      }.bind(this));

      //科目
      this.$axios.post('/afbase/cssIncomeWriteoff/getFinancialAccount/' + this.frow.businessScope + '/' + this.frow.customerId).then((response) => {
          this.financialAccounts = response.data.data;
          this.financialAccounts = this.financialAccounts.filter(item => item.financialAccountCode != '')
          if(this.financialAccounts.length > 0){
              for (var i = 0; i < this.financialAccounts.length; i++) {
                  if(this.financialAccounts[i].financialAccountName === '银行存款'){
                      this.ruleForm2.financialAccountName = this.financialAccounts[i].financialAccountName + " " + this.financialAccounts[i].financialAccountCode;
                      this.ruleForm2.financialAccountCode = this.financialAccounts[i].financialAccountCode;
                      this.ruleForm2.financialAccountType = this.financialAccounts[i].financialAccountType;
                  }
              }
              if(!this.ruleForm2.financialAccountName){
                  this.ruleForm2.financialAccountName = this.financialAccounts[0].financialAccountName + " " + this.financialAccounts[0].financialAccountCode;
                  this.ruleForm2.financialAccountCode = this.financialAccounts[0].financialAccountCode;
                  this.ruleForm2.financialAccountType = this.financialAccounts[0].financialAccountType;
              }
          }
      });

    },

    methods: {
      setFinancialAccount(vId) {
          let obj = {};
          obj = this.financialAccounts.find((item) => {
              return item.financialAccountId === vId;
          });
          if (obj) {
              this.ruleForm2.financialAccountName = obj.financialAccountName + " " + obj.financialAccountCode;
              this.ruleForm2.financialAccountCode = obj.financialAccountCode;
              this.ruleForm2.financialAccountType = obj.financialAccountType;
          }
      },
      changeAllCheck(selection) {
        alert(selection);
        this.data1.forEach((row) => {
          if(selection) {
            alert(1);
            row.checkBox = true
          } else {
            alert(2);
            row.checkBox = false
          }
          this.changeRowCheck(row)
        })
      },
      changeRowCheck(row) {
        if (row.checkBox) {
          if (row.currency==this.ruleForm2.currency ) {
            row.functionalAmountWriteoff2=row.functionalAmountWriteoffNo;
            this.change22(row);
            row.checkBox=true;
          }else{
            this.openError("请勾选相同核销币种");
            row.checkBox=false;
            return;
          }

        }else{
          row.functionalAmountWriteoff2=0;
          this.change22(row);
          row.checkBox=false;
        }
        row.functionalAmountWriteoff2=parseFloat(row.functionalAmountWriteoffNo).toFixed(2);
      },
      setValue(){
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].currency==this.ruleForm2.currency) {
            this.ruleForm2.amountWriteoff=parseFloat(this.data1[i].amountWriteoffNo).toFixed(2);
            this.data1[i].amountWriteoff2=this.data1[i].amountWriteoffNo;
            this.data1[i].functionalAmountWriteoff2=this.data1[i].functionalAmountWriteoffNo;;
          }else{
            this.data1[i].amountWriteoff2=0;
            this.data1[i].functionalAmountWriteoff2=0;
          }
          this.data1[i].amountWriteoff2=parseFloat(this.data1[i].amountWriteoff2).toFixed(2)
          this.data1[i].functionalAmountWriteoff2=parseFloat(this.data1[i].functionalAmountWriteoff2).toFixed(2)
        }
        this.setCheckBox();
      },
      changeCurrency(){
        if (this.ruleForm2.currency=='CNY') {
          this.flag1=true;
          this.flag2=false;
        }else{
          this.flag1=false;
          this.flag2=true;
        }
        this.setValue();
      },
      change00(){
        if (parseFloat(this.ruleForm2.amountWriteoff)) {
          this.ruleForm2.amountWriteoff=parseFloat(this.ruleForm2.amountWriteoff).toFixed(2)
        }else{
          this.ruleForm2.amountWriteoff=0
          this.ruleForm2.amountWriteoff=parseFloat(this.ruleForm2.amountWriteoff).toFixed(2)
        }
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].currency==this.ruleForm2.currency) {

                this.data1[i].amountWriteoff2=this.ruleForm2.amountWriteoff;
                this.data1[i].functionalAmountWriteoff2=(this.data1[i].amountWriteoff2*this.data1[i].exchangeRate).toFixed(2);

          }else{
            this.data1[i].amountWriteoff2=0;
            this.data1[i].functionalAmountWriteoff2=0;
          }
          this.data1[i].amountWriteoff2=parseFloat(this.data1[i].amountWriteoff2).toFixed(2);
          this.data1[i].functionalAmountWriteoff2=parseFloat(this.data1[i].functionalAmountWriteoff2).toFixed(2);
        }
        this.setCheckBox();
      },
      change002(){
        let total=this.ruleForm2.amountWriteoff;
        let exchangeRate=0;
        let j=0;
        if (this.ruleForm2.currency=='CNY') {
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].currency==this.ruleForm2.currency) {
            exchangeRate=this.data1[i].exchangeRate;
            j=i;
            total=total*exchangeRate;
            this.total2=total.toFixed(2);
            if (Math.abs(total)>0) {
              if (Math.abs(this.data1[i].functionalAmountWriteoffNo)>Math.abs(total)) {
                this.data1[i].functionalAmountWriteoff2=total.toFixed(2);
                this.data1[i].amountWriteoff2=(this.data1[i].functionalAmountWriteoff2/this.data1[i].exchangeRate).toFixed(2);
              }else{
                this.data1[i].functionalAmountWriteoff2=this.data1[i].functionalAmountWriteoffNo;
                this.data1[i].amountWriteoff2=(this.data1[i].functionalAmountWriteoff2/this.data1[i].exchangeRate).toFixed(2);
              }
              // total=total-this.data1[i].functionalAmountWriteoffNo;
              total=total-this.data1[i].functionalAmountWriteoff2;
            }else{
              this.data1[i].amountWriteoff2=0;
              this.data1[i].functionalAmountWriteoff2=0;
            }
          }

        }

        for (var i = 0; i < this.data1.length; i++) {
          if (j==i) {
            continue;
          }
          if (Math.abs(total)>0) {
            if (Math.abs(this.data1[i].functionalAmountWriteoffNo)>Math.abs(total)) {
                this.data1[i].functionalAmountWriteoff2=total.toFixed(2);
                this.data1[i].amountWriteoff2=(this.data1[i].functionalAmountWriteoff2/this.data1[i].exchangeRate).toFixed(2);
              }else{
                this.data1[i].functionalAmountWriteoff2=this.data1[i].functionalAmountWriteoffNo;
                this.data1[i].amountWriteoff2=(this.data1[i].functionalAmountWriteoff2/this.data1[i].exchangeRate).toFixed(2);
              }
              total=total-this.data1[i].functionalAmountWriteoff2;
          }else{
            this.data1[i].amountWriteoff2=0;
            this.data1[i].functionalAmountWriteoff2=0;
          }
        }
        }else{

          for (var i = 0; i < this.data1.length; i++) {
            if (this.data1[i].currency==this.ruleForm2.currency) {
              exchangeRate=this.data1[i].exchangeRate;
              j=i;
              total=(total*exchangeRate).toFixed(2);
              this.total2=total;
              // this.data1[i].amountWriteoff2=this.ruleForm2.amountWriteoff;
              // this.data1[i].functionalAmountWriteoff2=total;
              if (Math.abs(this.ruleForm2.amountWriteoff)>Math.abs(this.data1[i].amountWriteoffNo)) {
                this.data1[i].amountWriteoff2=this.data1[i].amountWriteoffNo;
                this.data1[i].functionalAmountWriteoff2=this.data1[i].functionalAmountWriteoffNo;
              }else{
                this.data1[i].amountWriteoff2=this.ruleForm2.amountWriteoff;
                this.data1[i].functionalAmountWriteoff2=total;
              }


            }
          }
          for (var i = 0; i < this.data1.length; i++) {
            if (j==i) {
              continue;
            }
            this.data1[i].amountWriteoff2=0.00;
            this.data1[i].functionalAmountWriteoff2=0.00;
          }
        }
        this.setCheckBox();
      },
      change11(row){
        if (parseFloat(row.amountWriteoff2)) {
          row.amountWriteoff2=parseFloat(row.amountWriteoff2).toFixed(2)
        }else{
          row.amountWriteoff2=0
          row.amountWriteoff2=parseFloat(row.amountWriteoff2).toFixed(2)
        }
        row.functionalAmountWriteoff2=(row.amountWriteoff2*row.exchangeRate).toFixed(2);
        this.setAmountWriteoff();
      },
      change22(row){
        row.amountWriteoff2=(row.functionalAmountWriteoff2/row.exchangeRate).toFixed(2);
        this.setAmountWriteoff();
      },
      setAmountWriteoff(){
        let total=0;
        let exchangeRate=0;
        for (var i = 0; i < this.data1.length; i++) {
          total=total+parseFloat(this.data1[i].functionalAmountWriteoff2);
          if (this.data1[i].currency==this.ruleForm2.currency) {
            exchangeRate=this.data1[i].exchangeRate;
          }
        }
        this.total2=total;
        this.ruleForm2.amountWriteoff=(total/exchangeRate).toFixed(2);
         this.setCheckBox();
      },
      setCheckBox(){
        for (var i = 0; i < this.data1.length; i++) {
          if (Math.abs(this.data1[i].functionalAmountWriteoff2)>0) {
            this.data1[i].checkBox=true;
          }else{
            this.data1[i].checkBox=false;
          }
        }
      },
      doSave(){
        if (!this.ruleForm2.writeoffDate) {
          this.openError("请选择核销日期");
          return;
        }
        if (!this.ruleForm2.financialAccountName) {
            this.openError("请选择科目");
            return;
        }
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].amountWriteoffNo>0) {
            if (this.data1[i].amountWriteoff2<0) {
              this.openError(this.data1[i].currency+"本次核销金额不能小于0");
              return;
            }
          }
          if (this.data1[i].amountWriteoffNo<0) {
            if (this.data1[i].amountWriteoff2>0) {
              this.openError(this.data1[i].currency+"本次核销金额不能大于0");
              return;
            }
          }

          if (Math.abs(this.data1[i].amountWriteoff2)>Math.abs(this.data1[i].amountWriteoffNo)){
            this.openError(this.data1[i].currency+"本次核销金额不能大于未核销金额");
            return;
          }

          if (Math.abs(this.data1[i].functionalAmountWriteoff2)>Math.abs(this.data1[i].functionalAmountWriteoffNo)){
            this.openError(this.data1[i].currency+"本次核销金额(本币)不能大于未核销金额(本币)");
            return;
          }
          if (this.data1[i].amountWriteoffNo<0&&this.data1[i].currency==this.ruleForm2.currency) {
            if (this.data1[i].amountWriteoff2!=this.data1[i].amountWriteoffNo) {
              this.openError(this.data1[i].currency+"负数核销金额必须全部核销");
              return;
            }
          }
        }

        if(Math.abs(this.ruleForm2.amountWriteoff)==0) {
          this.openError("核销金额不能等于0");
          return;
        }

        this.ruleForm2.listCurrencyList=this.data1;
        this.$axios.post2('/afbase/cssIncomeWriteoff/doListWriteoff', this.ruleForm2)
          .then(function(response) {
            if(response.data.code==0){
              this.openSuccess();
              this.queryList();
              this.ruleForm2.financialAccountName = '';
              this.ruleForm2.financialAccountCode = '';
              this.ruleForm2.financialAccountType = '';
              this.financialAccounts = [];
              this.handleClose();
            }else{
              this.openError(response.data.messageInfo);
            }

         }.bind(this)).catch(function(error) {
          // let errorinfo = error.response.data.messageInfo;
          // if (errorinfo.indexOf("已经制做过清单")>-1) {
            this.openError(errorinfo);
          // }

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

      formatterNumber1(row, column) {
        if(row.amount === '' || row.amount === 'null' || row.amount == null) {
          return "";
        } else {
          return this.getNumber(row.amount);
        }
      },
      formatterNumber2(row, column) {
        if(row.amountWriteoff === '' || row.amountWriteoff === 'null' || row.amountWriteoff == null) {
          return "0.00";
        } else {
          return this.getNumber(row.amountWriteoff);
        }
      },
      formatterNumber3(row, column) {
        if(row.amountWriteoffNo === '' || row.amountWriteoffNo === 'null' || row.amountWriteoffNo == null) {
          return "";
        } else {
          return this.getNumber(row.amountWriteoffNo);
        }
      },

      formatterNumber4(row, column) {
        if(row.functionalAmountWriteoffNo === '' || row.functionalAmountWriteoffNo === 'null' || row.functionalAmountWriteoffNo == null) {
          return "";
        } else {
          return this.getNumber(row.functionalAmountWriteoffNo);
        }
      },
      formatterNumber5(row, column) {
        if(row.incomeAmountTax === '' || row.incomeAmountTax === 'null' || row.incomeAmountTax == null) {
          return "";
        } else {
          return this.getNumber(row.incomeAmountTax);
        }
      },


      getNumber(data) {
        return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      formatToFloat(item) {
        if(item=='amountWriteoff'){
          this.ruleForm2.amountWriteoff =this.ruleForm2.amountWriteoff.replace(/[^-0123456789.]/g, "");
            var t = this.ruleForm2.amountWriteoff.split('.');
            if(t.length > 1) {
              this.ruleForm2.amountWriteoff = t[0]+ "." + t[1].substr(0, 2);
            }
        }

      },
      formatToFloat2(row2, item) {
        if(item == 'amountWriteoff2') {
          row2.amountWriteoff2 = row2.amountWriteoff2.replace(/[^-0123456789.]/g, "");
          var t = row2.amountWriteoff2.split('.');
          if(t.length > 1) {
            row2.amountWriteoff2 = t[0] + "." + t[1].substr(0, 2);
          }
        } else if(item == 'functionalAmountWriteoff2') {
          // this.$forceUpdate();
          row2.functionalAmountWriteoff2 = row2.functionalAmountWriteoff2.replace(/[^-0123456789.]/g, "");
          let t = row2.functionalAmountWriteoff2.split('.');
          if(t.length > 1) {
            row2.functionalAmountWriteoff2 = t[0] + "." + t[1].substr(0, 2);
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
<style>
  .orderEditPage222 .el-input__inner {
    text-align:right !important;
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

  .showWordLimit .el-input__inner {
    padding-right: 80px !important;
  }

  .showWordLimit .el-textarea__inner {
    padding-right: 50px;
  }

  .orderEditPage .el-form-item__error {
    margin-top: -5px;
    margin-left: 150px;
  }
</style>
