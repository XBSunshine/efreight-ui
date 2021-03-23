<template>
  <el-dialog title="查看账单" width="70%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <div>
      <el-form :inline="false" :model="query" class="demo-ruleForm">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="账单编号" label-width="105px">
              <label>{{billNumber}}</label>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单名称" label-width="105px">
              <label>{{serviceName}}</label>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="应收金额" label-width="105px">
              <el-input v-model="query.acturalCharge" clearable auto-complete="off" disabled style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
          <!--<el-col class="elementWidth">
            <el-form-item label="折扣" label-width="105px">
              <el-input v-model="query.discount" clearable auto-complete="off" @change="setInvoiceAmountValue" @input="formatToFloat('discount')" disabled style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="折后金额" label-width="115px">
              <el-input v-model="query.invoiceAmount" clearable auto-complete="off" @change="setDiscountValue" @input="formatToFloat('invoiceAmount')" disabled style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table :data="data1" height="400px" border>
        <el-table-column align="left" prop="serviceName" label="收费项目"  width="300"></el-table-column>
        <el-table-column align="center" prop="billName" label="账单月份"  width="80"></el-table-column>
        <el-table-column align="center" prop="settlementType" label="结算周期/计费模式" :formatter="settlementTypeFormat" width="160"></el-table-column>
        <el-table-column align="center" prop="acturalCharge" label="实收金额（折扣）" width="150" :formatter="acturalChargeFormat"></el-table-column>
        <el-table-column align="center" prop="fillName" label="附件" width="200">
          <template slot-scope="scope">
            <el-link @click="gotoAttachment(scope.row)">{{scope.row.fillName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="remark" label="备注" width="400">
        </el-table-column>
        <el-table-column align="left" prop="departureStation" label="口岸" width="70">
        </el-table-column>
        <el-table-column align="left" prop="arrivalDeparturType" label="进出港类型" width="90">
        </el-table-column>
        <el-table-column align="left" prop="aircraftClassification" label="航班性质" width="200">
        </el-table-column>
        <el-table-column align="left" prop="itCode" label="IT编码" width="100">
        </el-table-column>
      </el-table>
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
                billNumber: '',
                serviceName: '',
                loading: false,
                data1: [],
                options:[],
                options2:[],
                pageConf: {
                    //设置一些初始值(会被覆盖)
                    pageCode: 1, //当前页
                    pageSize: 10, //每页显示的记录数
                    totalPage: 0, //总记录数
                    pageOption: [10, 50, 100]
                },
                ruleForm: {
                    awbIds: '',
                    reservedCoopId: '',
                    reservedCoopName: ''
                },
                query: {
                    coopMnemonicV: '',
                    coopNameV: '',
                    awbFromType: '',
                    acturalCharge: '',
                    discount: '10',
                    invoiceAmount: '',
                    coopId: '',
                    billName: '',
                    billIds: '',
                    statement_id: ''
                },
                saveVisible:false
            }
        },

        created: function(){
            this.billNumber = this.frow.statementNumber;
            this.serviceName = this.frow.coopName+" ("+this.frow.statementName+")";
            this.query.acturalCharge=this.frow.acturalCharge
            //this.query.discount=this.frow.discount
            this.query.invoiceAmount=this.frow.invoiceAmount
            this.query.statement_id=this.frow.statement_id
            this.$axios.get('/prm/coopBill/checkBillByStatementId/' + this.query.statement_id).then(function(response) {
                if(response.data.code == '0') {
                    this.data1 = response.data.data;
                } else {
                    this.openError(response.data.messageInfo, "查询");
                }
                this.loading = false
            }.bind(this)).catch(function(error) {
                this.loading = false
                console.log(error);
            });

            this.data1=this.frow.awbIds;
            if(this.data1!=null && this.data1.length>0){
                this.query.coopId=this.data1[0].coopId;
                this.query.billName=this.data1[0].billName;
                let aucharge=0;
                let billIds="";
                for(let i=0;i<this.data1.length;i++){
                    aucharge=aucharge+this.data1[i].planCharge;
                    this.query.acturalCharge=aucharge;
                    this.query.invoiceAmount=aucharge;
                    //拼接账单号
                    if (billIds=='') {
                        if(this.data1[i].billId!=null && this.data1[i].billId!=''&& this.data1[i].billId!="undefined"){
                            billIds=billIds+this.data1[i].billId;
                        }
                    }else{
                        if(this.data1[i].billId!=null && this.data1[i].billId!=''&& this.data1[i].billId!="undefined"){
                            billIds=billIds+','+this.data1[i].billId;
                        }
                    }
                }
                this.query.billIds=billIds;
            }
        },
        /*inject:['findUnmakeCoopBillList'],*/
        methods: {
            acturalChargeFormat(row, column) {
                let acturalCharge='';
                let discount='';
                if(row.acturalCharge) {
                    row.acturalCharge = Number(row.acturalCharge)
                    if(isNaN(row.acturalCharge)){
                        acturalCharge='';
                    } else {
                        acturalCharge = row.acturalCharge.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                    }
                }
                if(row.discount){
                    discount=row.discount*10+"%";
                    discount="("+discount+")";
                }
                if(acturalCharge!=''){
                    return acturalCharge+discount;
                }
            },
            settlementTypeFormat(row, column) {
                let settlementType='';
                let settlementPeriod='';

                if(row.settlementType == '0') {
                    settlementType= "包月计费";
                } else if(row.settlementType == '1') {
                    settlementType=  "按量计费";
                }else if(row.settlementType == '2'){
                    settlementType=  "包年计费";
                }else if(row.settlementType == '3'){
                    settlementType=  "包半年计费";
                }else if(row.settlementType == '4'){
                    settlementType=  "包季度计费";
                }else if(row.settlementType == '99'){
                    return "人工账单";
                }


                 if(row.settlementPeriod == '0') {
                     settlementPeriod= "按月";
                 } else if(row.settlementPeriod == '1'){
                     settlementPeriod=  "按年";
                 }else if(row.settlementPeriod == '2'){
                     settlementPeriod=  "按季度";
                 }else if(row.settlementPeriod == '3'){
                     settlementPeriod=  "按半年";
                 }
                return row.paymentMethod+"/"+settlementPeriod+'/'+settlementType;
                //return settlementType;
            },
            setInvoiceAmountValue(){
                this.query.invoiceAmount=(this.query.acturalCharge * (this.query.discount/10)).toFixed(2);
            },
            setDiscountValue(){
                if(this.query.acturalCharge != null && this.query.acturalCharge != ''){
                    this.query.discount=((this.query.invoiceAmount/this.query.acturalCharge) * 10).toFixed(1);
                }
            },
            formatToFloat(item) {
                if(item == 'discount') {
                    this.query.discount = this.query.discount.replace(/[^0123456789.]/g, "");
                    var t = this.query.discount.split('.');
                    if(t.length > 1) {
                        this.query.discount = t[0] + "." + t[1].substr(0, 1);
                    }
                }else if(item == 'invoiceAmount'){
                    this.query.invoiceAmount = this.query.invoiceAmount.replace(/[^0123456789.]/g, "");
                    var t = this.query.invoiceAmount.split('.');
                    if(t.length > 1) {
                        this.query.invoiceAmount = t[0] + "." + t[1].substr(0, 2);
                    }
                }
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
            makeBill(){
                this.$axios.post('/prm/coopBill/makingBill', this.query)
                    .then(function(response) {
                            if(response.data.code==0){
                                this.openSuccess();
                                this.findUnmakeCoopBillList();
                                this.handleClose();
                            }else{
                                this.openError(response.data.messageInfo);
                            }

                        }.bind(this)
                    ).catch(function (error) {
                    let errorinfo = error.response.data.messageInfo;
                    this.openError(error);
                }.bind(this));
            },
            gotoAttachment(row){
                window.open(row.fillUrl)
            },
            handleClose() {
                this.$emit('update:visible', false);
            }
        }
    }
</script>
<style type="text/css">

</style>
