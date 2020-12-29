<template>
  <el-dialog title="账单 - 详情" width="95%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" append-to-body>
    <el-form :model="ruleForm"  ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="账单编号">
            <el-input  auto-complete="off" disabled v-model="ruleForm2.debitNoteNum">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账单日期">
            <el-input  auto-complete="off" disabled v-model="ruleForm2.debitNoteDate">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主单号">
            <el-input v-model="ruleForm.awbNumber" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户单号">
            <el-input v-model="ruleForm.customerNumber" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收款客户" >
            <el-input v-model="ruleForm2.customerName" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号">
            <el-input v-model="ruleForm.orderCode" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单客户">
            <el-input v-model="ruleForm.coopName" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="航班号" >
            <el-input v-model="ruleForm.expectFlight" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="航班日期">
            <el-input v-model="ruleForm.expectDeparture" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="始发港">
            <el-input v-model="ruleForm.departureStation" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目的港">
            <el-input v-model="ruleForm.arrivalStation" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="件数" >
            <el-input v-model="ruleForm.confirmPieces===''||ruleForm.confirmPieces==null ?ruleForm.planPieces:ruleForm.confirmPieces" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="毛重">
            <el-input v-model="ruleForm.confirmWeight===''||ruleForm.confirmWeight==null ?ruleForm.planWeight:ruleForm.confirmWeight" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="体积">
            <el-input v-model="ruleForm.confirmVolume===''||ruleForm.confirmVolume==null ?ruleForm.planVolume:ruleForm.confirmVolume" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计费重量">
            <el-input v-model="ruleForm.confirmChargeWeight===''||ruleForm.confirmChargeWeight==null ?ruleForm.planChargeWeight:ruleForm.confirmChargeWeight" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="币种">
            <el-input v-model="ruleForm2.currency" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账单金额">
            <el-input v-model="ruleForm3.amount" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账单本币金额">
            <el-input v-model="ruleForm3.functionalAmount" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="税率">
            <el-input v-model="ruleForm2.amountTaxRate" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="无税金额">
            <el-input v-model="ruleForm3.amountNotTax" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="税额">
            <el-input v-model="ruleForm3.amountTax" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="ruleForm2.debitNoteRemark" auto-complete="off" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table :data="data1" border>
        <el-table-column prop="serviceName" label="服务" fixed width="200"></el-table-column>
        <el-table-column prop="incomeQuantity" label="数量" ></el-table-column>
        <el-table-column prop="incomeUnitPrice" label="单价" ></el-table-column>
        <el-table-column prop="incomeAmount" label="金额" :formatter="formatterNumber2"></el-table-column>
        <el-table-column prop="incomeFunctionalAmount" label="本币金额" :formatter="formatterNumber3"></el-table-column>
        <el-table-column prop="incomeAmountTaxRate" label="税率" ></el-table-column>
        <el-table-column prop="incomeAmountNotTax" label="无税金额" :formatter="formatterNumber4"></el-table-column>
        <el-table-column prop="incomeAmountTax" label="税额" :formatter="formatterNumber5"></el-table-column>
      </el-table>
    </div>
    <div align="center">   
      <el-button type="primary" size="medium" v-on:click="handleClose" >关闭</el-button>
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
        currencyCodeOptions:[],
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
        ffrow:{
          coopFlag:''
        },
        ruleForm3: {
          amountTax:'',
          amountNotTax:'',
          functionalAmount:'',
          amount:''
        },
        ruleForm2: {
          debitNoteId:'',
          orgId:'',
          debitNoteNum:'',
          businessScope:'AE',
          debitNoteDate:'',
          orderId:'',
          orderUuid:'',
          customerId:'',
          customerName:'',
          currency:'',
          exchangeRate:'',
          amount:'',
          functionalAmount:'',
          amountTaxRate:'',
          amountNotTax:'',
          amountTax:'',
          debitNoteRemark:'',
          incomeIds:''
        }
      }
    },

    created: function(){
        //查询
        let params = '{"debitNoteId":' + this.frow.dataBean.debitNoteId + '}';
        this.$axios.post2('/afbase/cssDebitNote/queryHavedBillDetail', params)
        .then(function(response) {
          if(response.data.code == 0) {
            this.data1=response.data.data;
            this.init();
          }
        }.bind(this));
       
       
      this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
        .then(function(response) {
          this.ruleForm = response.data.data;
        }.bind(this));
 
    },

    methods: {
      init(){
        this.ruleForm2.debitNoteId=this.frow.dataBean.debitNoteId;
        this.ruleForm2.debitNoteNum=this.frow.dataBean.debitNoteNum;
        this.ruleForm2.debitNoteDate=this.frow.dataBean.debitNoteDate;
        this.ruleForm2.debitNoteRemark=this.frow.dataBean.debitNoteRemark;

        this.ruleForm2.orderId=this.frow.orderId;
        this.ruleForm2.orderUuid=this.frow.orderUuid;
        this.ruleForm2.customerName=this.frow.dataBean.customerName;
        this.ruleForm2.customerId=this.frow.dataBean.customerId;
        this.ruleForm2.currency=this.frow.dataBean.currency;

        this.ruleForm2.amountTaxRate=this.frow.dataBean.amountTaxRate;


       this.ruleForm3.amountTax=this.frow.dataBean.amountTax;
        this.ruleForm3.amountNotTax=this.frow.dataBean.amountNotTax;
        this.ruleForm3.functionalAmount=this.frow.dataBean.functionalAmount;
        this.ruleForm3.amount=this.frow.dataBean.amount;

        

      },

 
      formatterNumber2(row, column) {
        if(row.incomeAmount === '' || row.incomeAmount === 'null' || row.incomeAmount == null) {
          return "";
        } else {
          return this.getNumber(row.incomeAmount);
        }
      },
      formatterNumber3(row, column) {
        if(row.incomeFunctionalAmount === '' || row.incomeFunctionalAmount === 'null' || row.incomeFunctionalAmount == null) {
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
      getNumber(data) {
        return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
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