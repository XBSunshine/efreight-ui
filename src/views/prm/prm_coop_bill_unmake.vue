<template>
  <el-dialog title="确认账单" width="70%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
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
            <el-form-item label="账单应收金额" label-width="105px">
              <el-input v-model="query.planCharge" clearable auto-complete="off" disabled style="width: 100px;">
              </el-input>
              <label v-show="showFlag">(min:{{query.minCharge}}元)</label>
              <label v-show="showFlag1">-</label>
              <label v-show="showFlag1">(max:{{query.maxCharge}}元)</label>
            </el-form-item>
          </el-col>
          <!--<el-col class="elementWidth">
            <el-form-item label="账单折扣" label-width="105px">
              <el-input v-model="query.discount" clearable auto-complete="off" @change="setInvoiceAmountValue" @input="formatToFloat('discount')" style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单折后金额" label-width="115px">
              <el-input v-model="query.acturalCharge" clearable @change="setDiscountValue" @input="formatToFloat('acturalCharge')" WarningColor='warning' v-show="isModify1" style="width: 100px;">
              </el-input>
              <el-input v-model="query.acturalCharge" clearable @change="setDiscountValue" @input="formatToFloat('acturalCharge')" v-show="!isModify1" style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>-->
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 20px;">
              <el-button type="primary" size="small" @click="confirmBill" :disabled="disabledFlag2" v-if="billSta">发送账单</el-button>
              <el-button type="primary" size="small" @click="confirmBill" :disabled="disabledFlag2" v-if="!billSta">确认</el-button>
              <el-button type="primary" size="small" @click="refuseConfirmBill" :disabled="disabledFlag2" v-if="!billSta" plain>拒绝</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table :data="data1" height="400px" border>
        <el-table-column align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="fill">数据填充</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="serviceName" label="收费项目"  width="300"></el-table-column>
        <el-table-column align="center" prop="billName" label="账单月份"  width="80"></el-table-column>
        <el-table-column align="center" prop="settlementType" label="结算周期/计费模式" width="160" :formatter="settlementTypeFormat"></el-table-column>
        <el-table-column align="center" label="实收金额（折扣）" width="150" :formatter="acturalChargeFormat">
          <template slot-scope="scope">
            <span v-if="scope.row.modifySaler==1" style="color:red">{{ formatter11(scope.row) }}</span>
            <span v-else>{{ formatter11(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fillName" label="附件" width="200">
          <template slot-scope="scope">
            <el-link @click="gotoAttachment(scope.row)">{{scope.row.fillName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="remark" label="备注" width="400">
          <template slot-scope="scope">
            <div v-if="ifRed(scope.row)" style="color:red">{{ formatter22(scope.row) }}</div>
            <span v-if="scope.row.remarkSaler!=''">{{ formatter33(scope.row) }}</span>
            <span v-else>{{ formatter22(scope.row) }}</span>
          </template>
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
    <fill ref="addMission" v-if="fillVisible" :visible.sync="fillVisible" :frow="frow"></fill>
  </el-dialog>
</template>
<script>
    import Fill from './bill/prm_coop_bill_fill'
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
                    planCharge: '',
                    coopId: '',
                    billName: '',
                    billIds: '',
                    isModify: '',
                    statementId: '',
                    billStatus: '',
                    serviceName: '',
                    coopName: '',
                    acturalChargeAll: '',
                },
                saveVisible:false,
                currRow: '',
                fillVisible: false,
                showFlag: false,
                showFlag1: false,
                isModify: '',
                isModify1: false,
                disabledFlag2: false,
                billSta: false,
            }
        },
        provide() {
            return {
                callback1: this.callback1,
                findCoopBillList: this.findCoopBillList,
            }
        },
        components: {
            'fill': Fill,
        },
        created: function(){
            this.query.billName = this.frow.billName;
            this.query.serviceName = this.frow.serviceName;
            this.query.coopName = this.frow.coopName;
            this.billNumber = this.frow.billNumber;
            this.serviceName = this.frow.coopName+" ("+this.frow.serviceName+")";
            this.query.statementId=this.frow.statementId;
            this.query.billStatus=this.frow.billStatus;
            if(this.frow.billStatus == '待总部确认'){
                this.billSta = false;
            }else{
                this.billSta = true;
            }
            if(this.frow.minCharge){
                this.query.minCharge = this.frow.minCharge;
                this.showFlag=true;
            }
            if(this.frow.maxCharge){
                this.query.maxCharge = this.frow.maxCharge;
                this.showFlag1=true;
            }
            this.data1=this.frow.coopUnConfirmBillDetail;
            this.query.planCharge=this.frow.planCharge;
            this.query.acturalCharge=this.frow.acturalCharge;
            this.query.discount=this.frow.discount;
            if(this.frow.planCharge!=this.frow.acturalCharge){
                this.isModify1=true;
            }
        },
        inject:['findUnmakeCoopBillList'],
        methods: {
            ifRed(row){
                if(this.query.billStatus=='待总部确认') {//销售确认
                    if(row.remark != ''){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            formatter11(row, column) {
                let acturalCharge='';
                let discount='';
                if(row.acturalCharge==null){

                }else if(row.acturalCharge==0){
                    acturalCharge='0.00';
                }else{
                    row.acturalCharge = Number(row.acturalCharge)
                    if(isNaN(row.acturalCharge)){
                        acturalCharge='';
                    }else{
                        acturalCharge = row.acturalCharge.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                    }
                }
                /*if(row.acturalCharge) {
                    row.acturalCharge = Number(row.acturalCharge)
                    if(isNaN(row.acturalCharge)){
                        acturalCharge='';
                    } else {
                        acturalCharge = row.acturalCharge.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                    }
                }*/
                if(row.discount){
                    discount=row.discount*10+"%";
                    discount="("+discount+")";
                }
                if(acturalCharge!=''){
                    return acturalCharge+discount;
                }
            },
            formatter22(row, column) {
                return row.remark;
            },
            formatter33(row, column) {
                if(this.query.billStatus == '待总部确认'){
                    return row.remarkSaler;
                }else{
                    return row.remark;
                }

            },
            findCoopBillList(){

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
            },
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
            handleChange(command) {
                this.currRow = command
            },
            handleCommand(command) {
                if(command == 'fill') {
                    if(this.query.billStatus=='数据已填充' || this.query.billStatus=='账单已发送'){//销售确认
                        this.currRow.source = 'sale'
                    }else{//总部确认
                        this.currRow.source = 'base'
                    }
                    this.handleFill(this.currRow)
                }
            },
            handleFill(row) {
                this.frow = row;
                this.fillVisible = true;
            },
            setInvoiceAmountValue(){
                this.query.acturalCharge=(this.query.planCharge * (this.query.discount/10)).toFixed(2);
            },
            setDiscountValue(){
                if(this.query.planCharge != null && this.query.planCharge != ''){
                    this.query.discount=((this.query.acturalCharge/this.query.planCharge) * 10).toFixed(1);
                }
            },
            formatToFloat(item) {
                if(item == 'discount') {
                    this.query.discount = this.query.discount.replace(/[^0123456789.]/g, "");
                    var t = this.query.discount.split('.');
                    if(t.length > 1) {
                        this.query.discount = t[0] + "." + t[1].substr(0, 1);
                    }
                }else if(item == 'acturalCharge'){
                    this.query.acturalCharge = this.query.acturalCharge.replace(/[^0123456789.]/g, "");
                    var t = this.query.acturalCharge.split('.');
                    if(t.length > 1) {
                        this.query.acturalCharge = t[0] + "." + t[1].substr(0, 2);
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
            confirmBill(){
                //计算所有明细实收金额总和
                if(this.data1.length > 0){
                    let auchargeAll = 0;
                    for(let i=0;i<this.data1.length;i++){
                        if(this.data1[i].acturalCharge){
                            auchargeAll=auchargeAll+parseFloat(this.data1[i].acturalCharge);
                        }
                    }
                    this.query.acturalChargeAll=auchargeAll;
                }
                 //判断 如果 账单明细 的 数量、折后金额 与 原始 数量、原始 金额 不一致 则由 总部确认
                this.$axios.post('/prm/coopBill/checkIfModify', this.query).then((response) => {
                    if(response.data.code == '0') {
                         if(response.data.data == 'modify'){
                             this.query.isModify='1';//更改过
                         }else{
                             this.query.isModify='0';//未更改
                         }
                        let des = '';
                        if(this.query.billStatus=='数据已填充' || this.query.billStatus=='账单已发送'){//销售确认
                            if(this.query.isModify=='1'){
                                des = '账单有改动，由总部确认人确认后 将发送账单给客户，是否继续？';
                            }else{
                                des = '确认账单 将发送账单给客户，是否继续？';
                            }
                        }else{//总部确认
                            des = '确认账单 将发送账单给客户，是否继续？';
                        }

                        let currthis = this
                        currthis.$confirm(des, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(() => {
                            this.disabledFlag2 = true;
                            currthis.$axios.post('/prm/coopBill/confirmBill', this.query).then((response) => {
                                if(response.data.code == '0') {
                                    this.openSuccess();
                                    //this.findUnmakeCoopBillList();
                                    this.handleClose();
                                } else {
                                    currthis.$notify.error({
                                        title: '错误',
                                        message: response.data.messageInfo
                                    });
                                }
                            }).catch((error) => {
                                currthis.$notify.error({
                                    title: '错误',
                                    message: error.response.data.messageInfo
                                });
                            });
                        }).catch(() => {
                            currthis.$message({
                                type: 'info',
                                message: '已取消确认'
                            });
                        });

                    } else {
                        currthis.$notify.error({
                            title: '错误',
                            message: response.data.messageInfo
                        });
                    }
                }).catch((error) => {
                    currthis.$notify.error({
                        title: '错误',
                        message: error.response.data.messageInfo
                    });
                });
                /*if(this.query.planCharge != this.query.acturalCharge || this.isModify=='1'){
                    this.query.isModify='1';//已更改
                }else{
                    this.query.isModify='0';//未更改
                }*/

            },
            callback1(billId,invoiceAmount,discount,fillNumber,planCharge,acturalChargeOld,fillUrl,fillName,remarkSaler) {
                for(let i=0;i<this.data1.length;i++){
                    if(this.data1[i].billId==billId){
                        this.data1[i].acturalCharge=invoiceAmount;
                        this.data1[i].discount=discount;
                        this.data1[i].billStatus='数据已填充';
                        this.data1[i].fillNumber=fillNumber;
                        this.data1[i].planCharge=planCharge;
                        this.data1[i].fillUrl=fillUrl;
                        this.data1[i].fillName=fillName;
                        this.data1[i].remarkSaler=remarkSaler;
                        //this.data1[i].acturalChargeOld=acturalChargeOld;
                        if(invoiceAmount!=acturalChargeOld){
                            this.data1[i].modifySaler=1;
                            this.isModify='1';
                        }

                        if(this.query.billStatus=='待总部确认'){
                            //根据billId查询备注
                            this.$axios.post('/prm/coopBill/getRemarkByBillId/' + billId).then((response) => {
                                if(response.data.code == '0') {
                                    let re = response.data.data;
                                    let res = re.split(';');
                                    if(res[0] != '' && res[0] != null){
                                        this.data1[i].remark= res[0];
                                    }
                                    if(res[1] != '' && res[1] != null){
                                        this.data1[i].remarkSaler= res[1];
                                    }
                                } else {
                                    this.$notify.error({
                                        title: '错误',
                                        message: response.data.messageInfo
                                    });
                                }
                            }).catch((error) => {
                                this.$notify.error({
                                    title: '错误',
                                    message: error.response.data.messageInfo
                                });
                            });
                        }

                    }
                }
                let aucharge=0;
                for(let i=0;i<this.data1.length;i++){
                    if(this.data1[i].acturalCharge){
                        aucharge=aucharge+parseFloat(this.data1[i].acturalCharge);
                    }
                }
                this.query.planCharge=aucharge;
                if(this.query.minCharge && this.query.minCharge!=0){
                    if(aucharge<this.query.minCharge){
                        this.query.planCharge=this.query.minCharge;
                    }
                }
                if(this.query.maxCharge && this.query.maxCharge!=0){
                    if(aucharge>this.query.maxCharge){
                        this.query.planCharge=this.query.maxCharge;
                    }
                }
                this.query.discount='10';
                this.query.acturalCharge=this.query.planCharge;
                //更新prm_coop_statement表的amount_receivable
                this.$axios.post('/prm/coopBill/updateAmountReceivable', {
                    statementId: this.query.statementId,
                    planCharge: this.query.planCharge,
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    if(response.status = '200') {
                    } else {
                    }
                }.bind(this)).catch(function(error) {
                    this.loading = false
                    console.log(error)
                });
                //this.query.invoiceAmount=(this.query.planCharge * (this.query.discount/10)).toFixed(2);
            },
            handleClose() {
                this.findUnmakeCoopBillList();
                this.$emit('update:visible', false);
            },
            gotoAttachment(row){
                window.open(row.fillUrl)
            },

            refuseConfirmBill(){
                let currthis = this
                currthis.$axios.post('/prm/coopBill/refuseConfirmBill', this.query).then((response) => {
                    if(response.data.code == '0') {
                        this.openSuccess();
                        this.handleClose();
                    } else {
                        currthis.$notify.error({
                            title: '错误',
                            message: response.data.messageInfo
                        });
                    }
                }).catch((error) => {
                    currthis.$notify.error({
                        title: '错误',
                        message: error.response.data.messageInfo
                    });
                });
            }

//---------------------

        }
    }
</script>
<style type="text/css">

  .el-input__inner[WarningColor="warning"] {

    color:  #FF0000;

  }
</style>
