<template>
  <el-dialog title="核销 - 查看" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-50px;" >
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
            <el-input v-model="ruleForm2.debitNoteNum" disabled style="width:300px;">
              <template slot="prepend">{{name}}编号</template>
            </el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="">
            <el-input v-model="ruleForm2.amountWriteoff" style="width:350px;margin-right: 15px;" disabled>
              <template slot="prepend">核销金额</template>
              
              <el-input slot="suffix" v-model="ruleForm2.currency" style="width:91px;margin-right: -5px;" disabled>
              </el-input>
            </el-input>

          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.writeoffNum" disabled style="width:260px;margin-right: 15px;">
              <template slot="prepend">核销单号</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="">
            <el-input style="width:300px;">
              <template slot="prepend">核销日期</template>
              <el-date-picker slot="suffix" v-model="ruleForm2.writeoffDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 203px; margin-right:-5px" disabled>
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
              <el-input type="textarea" show-word-limit maxlength="200" v-model="ruleForm2.writeoffRemark" auto-complete="off" :rows="2" style="width:960px" show-word-limit disabled>
              </el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
    <div style="margin:10px 10px 10px 10px;">

      <el-table :data="data1" border >
        
        <el-table-column align="center" prop="currency" label="币种" width="60"></el-table-column>
        <el-table-column align="center" prop="amount" label="应收金额" ></el-table-column>
        <el-table-column align="center" prop="functionalAmount" label="应收金额（本币）" ></el-table-column>
        
        <el-table-column align="center" prop="exchangeRate" label="汇率" width="70"></el-table-column>

        <el-table-column align="center" prop="amountWriteoff2" label="本次核销金额"></el-table-column>
        <el-table-column align="center" prop="functionalAmountWriteoff2" label="本次核销金额（本币）" ></el-table-column>
      </el-table>
    </div>
    <div style="margin:10px 10px 10px 10px;">   
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
        name:'',
        data1: [],
        ruleForm2: {
          debitNoteId:'',
          businessScope:'',
          customerId:'',
          customerName:'',
          writeoffDate:'',
          currency:'',
          debitNoteNum:'',
          writeoffNum:'',
          amountWriteoff:'',
          writeoffRemark:''
        }
      }
    },

    inject:['queryList'],

    created: function(){
      let url='queryListDetail';
      this.name="清单";
      // this.functionalAmountNo=this.frow.functionalAmountNo;
      // this.ruleForm2.writeoffDate = this.frow.writeoffDate;
      // this.ruleForm2.debitNoteId=this.frow.debitNoteId;
      // this.ruleForm2.customerId=this.frow.customerId;
      // this.ruleForm2.customerName=this.frow.customerName;
      // this.ruleForm2.businessScope=this.frow.businessScope;
      this.ruleForm2.debitNoteNum=this.frow.statementNum;
      // this.ruleForm2.writeoffNum=this.frow.writeoffNum;
      // this.ruleForm2.currency = this.frow.currency;
      // this.ruleForm2.amountWriteoff = this.frow.amountWriteoff;
      // this.ruleForm2.writeoffRemark = this.frow.writeoffRemark;

      this.$axios.get2('/afbase/cssIncomeWriteoff/view/'+this.frow.incomeWriteoffId)
      .then(function(response) {
        //this.data1 = response.data.data;
        this.ruleForm2.writeoffDate = response.data.data.writeoffDate;
        this.ruleForm2.debitNoteId=response.data.data.debitNoteId;
        this.ruleForm2.customerId=response.data.data.customerId;
        this.ruleForm2.customerName=response.data.data.customerName;
        this.ruleForm2.businessScope=response.data.data.businessScope;
        // this.ruleForm2.debitNoteNum=response.data.data.debitNoteNumStatementNum;
        this.ruleForm2.writeoffNum=response.data.data.writeoffNum;
        this.ruleForm2.currency = response.data.data.currency;
        this.ruleForm2.amountWriteoff = response.data.data.amountWriteoff;
        this.ruleForm2.writeoffRemark = response.data.data.writeoffRemark;
      }.bind(this));
      this.$axios.post('/afbase/cssIncomeWriteoff/'+url+'/'+this.frow.incomeWriteoffId)
      .then(function(response) {
        this.data1 = response.data.data;
        
      }.bind(this));

    },

    methods: {
      
      handleClose() {
        this.$emit('update:visible', false);
      }

//--------------------- 

    }
  }
</script>
<style>
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