<template>
  <div class="warp-main">
    <div>
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form>
          <el-row >
            <el-col class="elementWidth">
              <el-form-item label="账单月份" label-width="85px">
                <el-date-picker v-model="query.billName" type="month" value-format="yyyy-MM" style="width: 120px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="客户名称" label-width="105px">
                <el-input v-model="query.coopName" clearable style="width: 135px;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="账单状态" label-width="105px">
                <el-select v-model="query.billStatus" style="width: 150px;" multiple>
                  <el-option label="数据未填充" value="数据未填充"></el-option>
                  <el-option label="数据已填充" value="数据已填充"></el-option>
                  <el-option label="待总部确认" value="待总部确认"></el-option>
                  <el-option label="账单已发送" value="账单已发送"></el-option>
                  <el-option label="客户已确认" value="客户已确认"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="业务区域" label-width="105px">
                <el-select v-model="query.billTemplate" style="width: 120px;">
                  <el-option label="全部"   value=""></el-option>
                  <el-option label="华北" value="BJS"></el-option>
                  <el-option label="华南" value="CAN"></el-option>
                  <el-option label="华东" value="SHA"></el-option>
                  <el-option label="西北" value="XIY"></el-option>
                  <el-option label="总部" value="EFT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 50px;">
                <el-button type="primary" size="small" v-on:click="findUnmakeCoopBillList">查询</el-button>
                <el-button type="primary" size="small" v-on:click="manualBill" v-if="manualButtonFlag">人工账单</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col class="elementWidth">
              <el-form-item label="账单编号" label-width="85px">
                <el-input v-model="query.billNumber" clearable style="width: 120px;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="账单确认人" label-width="105px">
                <el-input v-model="query.billConfirmName" clearable style="width: 135px;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="数据填充人" label-width="105px">
                <el-input v-model="query.quantityConfirmName" clearable style="width: 150px;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="总部确认人" label-width="105px">
                <el-input v-model="query.headOfficeConfirmName" clearable style="width: 120px;">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </div>
    <div>
      <el-table row-key="id" :tree-props="{children: 'coopUnConfirmBillDetail'}"  :data="data1" style="width: 100%;" border>
        <el-table-column align="center" label="操作" width="60" type="index" fixed="left">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)" v-if="scope.row.isParent!=null">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="salerConfirm" v-if="(scope.row.billStatus=='数据已填充' || scope.row.billStatus=='账单已发送') && saleconfirmButtonFlag">销售确认</el-dropdown-item>
                <el-dropdown-item command="salerConfirm" v-if="scope.row.billStatus=='待总部确认' && baseconfirmButtonFlag">总部确认</el-dropdown-item>
                <el-dropdown-item command="customerConfirm" v-if="scope.row.billStatus=='账单已发送' && customerconfirmButtonFlag">客户确认</el-dropdown-item>
                <el-dropdown-item command="printBill" v-if="(scope.row.billStatus=='账单已发送' || scope.row.billStatus=='客户已确认') && printbillButtonFlag">账单预览</el-dropdown-item>
                <el-dropdown-item command="sendBill" v-if="(scope.row.billStatus=='账单已发送' || scope.row.billStatus=='客户已确认') && sendbillButtonFlag">发送账单</el-dropdown-item>
                <el-dropdown-item command="deleteBill" v-if="scope.row.billStatus=='数据未填充' && delbillButtonFlag">删除账单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="serviceName" label="账单名称/收费项目" width="500" fixed>
          <template slot-scope="scope">
            <span>{{ formatter33(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="billStatus" label="状态" width="85" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.billStatus=='数据未填充'" style="color:red">{{ formatter22(scope.row) }}</span>
            <span v-else>{{ formatter22(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="billName" label="账单月份" width="80" fixed>
        </el-table-column>
        <el-table-column align="left" prop="departureStation" label="口岸" width="70">
        </el-table-column>
        <el-table-column align="center" prop="settlementType" label="结算周期/计费模式" :formatter="settlementTypeFormat" width="160">
        </el-table-column>
        <el-table-column align="center" prop="acturalCharge" label="实收金额（折扣）" :formatter="acturalChargeFormat" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.modifySaler==1" style="color:red">{{ formatter11(scope.row) }}</span>
            <span v-else>{{ formatter11(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="needEmail" label="发送明细" width="70">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.needEmail"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="quantityConfirmName" label="数据填充人" width="85">
        </el-table-column>
        <el-table-column align="center" prop="billConfirmName" label="账单确认人" width="85">
        </el-table-column>
        <el-table-column align="center" prop="headOfficeConfirmName" label="总部确认人" width="85">
        </el-table-column>
        <el-table-column align="left"  label="备注" width="400">
          <template slot-scope="scope">
            <div v-if="ifRed(scope.row)" style="color:red">{{ formatter44(scope.row) }}</div>
            <span v-if="scope.row.remarkSaler!=''">{{ formatter55(scope.row) }}</span>
            <span v-else>{{ formatter44(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="arrivalDeparturType" label="进出港类型" width="90">
        </el-table-column>
        <el-table-column align="left" prop="aircraftClassification" label="航班性质" width="200">
        </el-table-column>
        <el-table-column align="left" prop="itCode" label="IT编码" width="100">
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 30, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
      </el-pagination>
    </div>
    <create ref="addMission" v-if="createVisible" :visible.sync="createVisible" :frow="frow"></create>
    <manual ref="addMission" v-if="manualBillVisible" :visible.sync="manualBillVisible" :frow="frow"></manual>
  </div>
</template>

<script>
   import Create from './prm_coop_bill_unmake'
   import Manual from './bill/prm_coop_manual_bill'
    export default {
        data() {
            return {
                data1: [],
                multipleSelection: [],
                currentPage: 1,
                pageSize: 10,
                totalNum: 0,
                query: {
                    billName: '',
                    coopName: '',
                    settlementModName: '',
                    billNumber: '',
                    quantityConfirmName: '',
                    billConfirmName: '',
                    coopId: '',
                    billStatus: ['数据未填充','数据已填充','待总部确认','账单已发送'],
                    headOfficeConfirmName: '',
                    billTemplate: ''
                },
                currRow: '',
                loading: false,
                frow:{},
                createVisible: false,
                makingBillButtonFlag: false,
                saleconfirmButtonFlag: false,
                baseconfirmButtonFlag: false,
                customerconfirmButtonFlag: false,
                printbillButtonFlag: false,
                sendbillButtonFlag:false,
                delbillButtonFlag: false,
                manualBillVisible: false,
                manualButtonFlag: false,
            }
        },
        created() {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('sys_coop_bill_makingbill')>-1) {
                this.makingBillButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_saleconfirm')>-1) {
                this.saleconfirmButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_baseconfirm')>-1) {
                this.baseconfirmButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_customerconfirm')>-1) {
                this.customerconfirmButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_printbill')>-1) {
                this.printbillButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_send')>-1) {
                this.sendbillButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_delete')>-1) {
                this.delbillButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_bill_manual')>-1) {
                this.manualButtonFlag=true;
            }
            this.query.billName=this.getDateTime(new Date());
        },
        components: {
            'create': Create,
            'manual': Manual,
        },
        provide() {
            return {
                findUnmakeCoopBillList: this.findUnmakeCoopBillList
            }
        },
        methods: {
            manualBill(){
                this.manualBillVisible = true;
            },
            ifRed(row){
                if(row.statementStatus=='待总部确认') {
                    if(row.remark != ''){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            formatter44(row, column) {
                return row.remark;
            },
            formatter55(row, column) {
                if(row.statementStatus == '待总部确认'){
                    return row.remarkSaler;
                }else{
                    return row.remark;
                }

            },
            toUpperCaseValue(val) {
                return val.toUpperCase();
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
                if(row.discount){
                    discount=row.discount*10+"%";
                    discount="("+discount+")";
                }
                if(acturalCharge!=''){
                    return acturalCharge+discount;
                }
            },
            formatter22(row, column) {
                return row.billStatus;
            },
            formatter33(row, column) {
                if(row.isParent=='1'){
                    return row.coopName+" ("+row.serviceName+")";
                }else{
                    return row.serviceName;
                }

            },
            handleCommand(command) {
                if(command == 'salerConfirm') {
                    this.handleSalerConfirm(this.currRow)
                } else if(command == 'customerConfirm') {
                    this.handleCustomerConfirm(this.currRow)
                } else if(command == 'sendBill') {
                    this.handleSendBill(this.currRow)
                } else if(command == 'printBill') {
                    this.handlePrintBill(this.currRow)
                } else if(command == 'deleteBill') {
                    this.handleDeleteBill(this.currRow)
                }
            },
            handleChange(command) {
                this.currRow = command
            },
            handleSalerConfirm(row) {
                this.frow = row;
                this.createVisible = true;
            },
            handleCustomerConfirm(row) {
                let currthis = this
                currthis.$confirm('客户确认账单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    currthis.$axios.post('/prm/coopBill/customerConfirmBill/' + row.statementId + '/' + row.settlementId + '/' + row.rowUuid).then((response) => {
                        if(response.data.code == '0') {
                            currthis.$notify({
                                title: '成功',
                                message: '确认成功',
                                type: 'success'
                            });
                            currthis.findUnmakeCoopBillList();
                        } else {
                            let errorinfo = response.data.messageInfo;
                            this.openError(errorinfo);
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
            },
            handleSendBill(row) {
                if(row.serviceName == '人工账单'){
                     if(row.billManualMailTo != null && row.billManualMailTo != ''){
                         this.$axios.post('/prm/coopBill/sendManualBill/', {
                             statementId: row.statementId,
                             toUsers: row.billManualMailTo.replace(/,/g, ";"),
                         }, {
                             headers: {
                                 'Content-Type': 'application/x-www-form-urlencoded'
                             }
                         }).then((response) => {
                             if(response.data.code == '0') {
                                 this.$notify({
                                     title: '成功',
                                     message: '发送成功',
                                     type: 'success'
                                 });
                                 this.loading = false
                                 this.findUnmakeCoopBillList()
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
                     }else{
                         this.$notify.error({
                             title: '错误',
                             message: "发送账单失败，该人工账单未选择联系人"
                         });
                         return;
                     }

                }else{

                    let currthis = this
                    currthis.$confirm('是否发送账单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        currthis.$axios.put('/prm/coopBill/sendBill/' + row.statementId).then((response) => {
                            if(response.data.code == '0') {
                                currthis.$notify({
                                    title: '成功',
                                    message: '发送成功',
                                    type: 'success'
                                });
                                currthis.findUnmakeCoopBillList();
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
                            message: '已取消发送'
                        });
                    });
                }

            },
            handlePrintBill(row){
                let host = window.location.host;
                let hostName=host.split(":")[0];
                this.query.billStyle1='';
                let statement_id = row.statementId;
                //let orgId=window.localStorage.getItem("orgId");
                //let url="http://"+hostName+"/prm/coopBill/printBill";
                //this.openPostWindow(url,statement_id);
                this.$axios.post('/prm/coopBill/printBill1/' + statement_id).then((response) => {
                    window.open(response.data.data)
                }).catch(function(error) {
                    console.log(error);
                });
            },
            openPostWindow(url,statement_id) {

                var newWin = window.open(),
                    formStr = '';
                //设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
                formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
                    '<input type="hidden" name="statement_id" value="' + statement_id + '" />' +
                    '</form>';
                newWin.document.body.innerHTML = formStr;
                newWin.document.forms[0].submit();
                return newWin;
            },
            handleDeleteBill(row) {
                let currthis = this
                currthis.$confirm('此操作将永久删除该账单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    currthis.$axios.deletes('/prm/coopBill/' + row.statementId).then((response) => {
                        if(response.data.code == '0') {
                            currthis.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            currthis.findUnmakeCoopBillList();
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
                        message: '已取消删除'
                    });
                });
            },
            getDateTime(theDate) {
                var _year = theDate.getFullYear();
                var _month = theDate.getMonth();
                var _date = theDate.getDate();
                _month = _month + 1;
                if(_month < 10){_month = "0" + _month;}
                if(_date<10){_date="0"+_date  ;}
                return  _year + "-" + _month;
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
                if(settlementPeriod!='' && settlementType!=''){
                    return row.paymentMethod+"/"+settlementPeriod+'/'+settlementType;
                }
            },
            acturalChargeFormat(row, column) {
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
            handleSizeChange(val) {
                this.findUnmakeCoopBillList();
            },
            handleCurrentChange(val) {
                this.findUnmakeCoopBillList();
            },
            findUnmakeCoopBillList() {
                this.loading = true;
                let coopName1 = "";
                if(this.query.coopName){
                    coopName1 = this.query.coopName.toUpperCase();
                }
                this.$axios.post('/prm/coopBill/searchUnConfirmBill', {
                    billName: this.query.billName,
                    coopName: coopName1,
                    billNumber: this.query.billNumber,
                    billConfirmName: this.query.billConfirmName,
                    quantityConfirmName: this.query.quantityConfirmName,
                    headOfficeConfirmName: this.query.headOfficeConfirmName,
                    billStatus1: this.query.billStatus,
                    billTemplate: this.query.billTemplate,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    if(response.status = '200') {
                        this.loading = false
                        this.data1 = response.data.paramList
                        this.totalNum = response.data.totalNum
                    } else {
                        this.loading = false
                        this.$notify.error({
                            title: '错误',
                            message: '查询失败'
                        });
                    }
                }.bind(this)).catch(function(error) {
                    this.loading = false
                    console.log(error)
                });
            },
            makingBill() {
                this.createVisible = true;
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

        }
    }
</script>


