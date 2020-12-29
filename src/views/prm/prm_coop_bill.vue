<template>
	<div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
			<el-form>
				<el-row v-show="true">
          <el-col class="elementWidth">
            <el-form-item label="客户名称" label-width="85px">
              <el-input v-model="query.coopName" clearable style="width: 135px;">
              </el-input>
            </el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item label="账单月份" label-width="85px">
							<el-date-picker v-model="query.billName" type="month" value-format="yyyy-MM" style="width: 120px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="收费项目" label-width="95px">
							<el-input v-model="query.serviceName" clearable style="width: 145px;">
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label="业务区域" label-width="75px">
              <el-select v-model="query.billTemplate" style="width: 85px;">
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
            <el-form-item style="margin-left: 15px;">
              <el-button type="text" v-if="showFlag" @click="showFlag=false">收起</el-button>
              <el-button type="text" v-if="!showFlag" @click="showFlag=true">展开</el-button>
              <el-button type="primary" size="small" v-on:click="findCoopBillList">查询</el-button>
              <el-button type="primary" size="small" v-on:click="save" v-if="addButtonFlag">生成账单</el-button>
              <el-button type="primary" size="small" v-on:click="repair" v-if="repairButtonFlag">修复账单</el-button>
            </el-form-item>
          </el-col>
				</el-row>
				<el-row v-show="showFlag">
          <el-col class="elementWidth">
            <el-form-item label="数据填充人" label-width="85px">
              <el-input v-model="query.quantityConfirmName" clearable style="width: 135px;">
              </el-input>
            </el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item label="状态" label-width="85px">
							<el-select v-model="query.billStatus" clearable placeholder="请选择" style="width: 120px;">
                <el-option label="全部" value=""></el-option>
								<el-option label="数据未填充" value="数据未填充"></el-option>
								<el-option label="数据已填充" value="数据已填充"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label="销售确认人" label-width="95px">
              <el-input v-model="query.billConfirmName" clearable style="width: 145px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单编号" label-width="75px">
              <el-input v-model="query.billNumber" clearable style="width: 85px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="IT编码" label-width="70px">
              <el-input v-model="query.itCode" clearable style="width: 140px;">
              </el-input>
            </el-form-item>
          </el-col>
				</el-row>
			</el-form>
		</el-col>
		<div>
			<el-table row-key="id" default-expand-all  :tree-props="{children: 'coopUnConfirmBillDetail'}" :data="data" border>
        <el-table-column align="center" label="操作" width="60" type="index" fixed="left">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)" v-if="scope.row.isParent!='1'">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="fill" v-if="fillButtonFlag">数据填充</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="serviceName" label="账单名称/收费项目" width="500" fixed>
          <template slot-scope="scope">
            <span>{{ formatter22(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="billStatus" label="状态" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.billStatus=='数据未填充'" style="color:red">{{ formatter11(scope.row) }}</span>
            <span v-else>{{ formatter11(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="billName" label="账单月份" width="80">
        </el-table-column>
        <el-table-column align="left" prop="departureStation" label="口岸" width="70">
        </el-table-column>
        <el-table-column align="center" prop="settlementType" label="结算周期/计费模式" :formatter="settlementTypeFormat" width="160">
        </el-table-column>
        <el-table-column align="center" prop="needEmail" label="发送明细" width="70">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.needEmail"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="quantityConfirmName" label="数据填充人" width="85">
        </el-table-column>
        <el-table-column align="center" prop="billConfirmName" label="销售确认人" width="85">
        </el-table-column>
        <el-table-column align="center" prop="headOfficeConfirmName" label="总部确认人" width="85">
        </el-table-column>
        <el-table-column align="left" prop="remark" label="备注" width="400">
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
		</el-row>
		<create ref="addMission" v-if="createVisible" :visible.sync="createVisible"></create>
    <repair ref="addMission" v-if="repairVisible" :visible.sync="repairVisible"></repair>
		<invoice ref="addMission" v-if="invoiceVisible" :visible.sync="invoiceVisible" :frow="frow"></invoice>
		<fill ref="addMission" v-if="fillVisible" :visible.sync="fillVisible" :frow="frow"></fill>
	</div>
</template>

<script>
	import Create from './bill/prm_coop_bill_create'
  import Repair from './bill/prm_coop_bill_repair'
	import Invoice from './bill/prm_coop_bill_invoice'
	import Fill from './bill/prm_coop_bill_fill'
	export default {
		data() {
			return {
				addButtonFlag:false,
        repairButtonFlag: false,
				fillButtonFlag:false,
				data: [],
				loading: false,
				currentPage: 1,
				pageSize: 10,
				totalNum: 0,
				query: {
					invoiceNo:'',
					billName:'',
					coopName:'',
					agreementId: '',
          billNumber: '',
					billStatus: '数据未填充',
					createTimeStart: '',
					createTimeEnd: '',
          serviceName: '',
          quantityConfirmName: '',
          billConfirmName: '',
          billTemplate: '',
          itCode: '',
				},
				showFlag: false,
				createVisible: false,
        repairVisible: false,
				invoiceVisible: false,
				fillVisible: false,
        frow:{},
				currRow: '',
			}
		},
		provide() {
			return {
				findCoopBillList: this.findCoopBillList,
          callback1: this.callback1,
			}
		},
		components: {
			'create': Create,
      'repair': Repair,
			'invoice': Invoice,
			'fill': Fill,
		},
		created() {
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('sys_coop_bill_add')>-1) {
				this.addButtonFlag=true;
			}
			if (buttonInfo.indexOf('sys_coop_bill_fill')>-1) {
				this.fillButtonFlag=true;
			}
      if (buttonInfo.indexOf('sys_coop_bill_repair')>-1) {
        this.repairButtonFlag=true;
      }
			this.query.billName = this.getDateTime(new Date());
		},
		methods: {
      toUpperCaseValue(val) {
          return val.toUpperCase();
      },
      formatter11(row, column) {
          return row.billStatus;
      },
      formatter22(row, column) {
          if(row.isParent=='1'){
              return row.coopName+" ("+row.serviceName+")";
          }else{
              return row.serviceName;
          }

      },
      callback1(billId,invoiceAmount,discount) {
      },
			save() {
        this.createVisible = true;
      },
      repair() {
        this.repairVisible = true;
      },
			handleInvoice(row) {
				this.frow = row
				this.invoiceVisible = true;
			},
			cancelVisible() {
				this.createVisible = false;
				this.invoiceVisible = false;
				this.fillVisible = false;
			},
			handleFill(row) {
				this.frow = row;
        this.frow.source='detail';
				this.fillVisible = true;
			},
			handleConfirm(row) {
				let currthis = this
				currthis.$confirm('是否账单确认操作?', '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					currthis.$axios.put('/prm/coopBill/confirm/' + row.billId).then((response) => {
						if(response.data.code == '0') {
							currthis.$notify({
								title: '成功',
								message: '确认成功',
								type: 'success'
							});
							currthis.findCoopBillList();
						} else {
							currthis.$notify.error({
								title: '确认失败',
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

			},
			handleVerify(row) {
				let currthis = this
				currthis.$confirm('确定要核销账单么, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					currthis.$axios.put('/prm/coopBill/verify/' + row.billId).then((response) => {
						if(response.data.code == '0') {
							currthis.$notify({
								title: '成功',
								message: '核销成功',
								type: 'success'
							});
							currthis.findCoopBillList();
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
						message: '已取消核销'
					});
				});

			},
			handleDelete(row) {
				let currthis = this
				currthis.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					currthis.$axios.deletes('/prm/coopBill/' + row.billId).then((response) => {
						if(response.data.code == '0') {
							currthis.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							currthis.findCoopBillList();
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
			handleSizeChange(val) {
				this.findCoopBillList();
			},
			handleCurrentChange(val) {
				this.findCoopBillList();
			},
			findCoopBillList() {
          this.loading = true;
          let coopName1 = "";
          if(this.query.coopName){
              coopName1 = this.query.coopName.toUpperCase();
          }
          let itCode1 = "";
          if(this.query.itCode){
              itCode1 = this.query.itCode.toUpperCase();
          }
          this.$axios.post('/prm/coopBill/searchUnConfirmBill_detail', {
              billName: this.query.billName,
              coopName: coopName1,
              settlementModName: this.query.settlementModName,
              billNumber: this.query.billNumber,
              billConfirmName: this.query.billConfirmName,
              quantityConfirmName: this.query.quantityConfirmName,
              billStatus: this.query.billStatus,
              serviceName: this.query.serviceName,
              billTemplate: this.query.billTemplate,
              itCode: itCode1,
              currentPage: this.currentPage,
              pageSize: this.pageSize
          }, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).then(function(response) {
              if(response.status = '200') {
                  this.loading = false
                  this.data = response.data.paramList
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
			invoiceAmountFormat(row, column) {
				if (row.invoiceAmount) {
					return row.invoiceAmount+"("+row.discount*10+"%)";
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
          let planCharge='';
          let discount='';
          if(row.planCharge==null){

          }else if(row.planCharge==0){
              planCharge='0.00';
          }else{
              row.planCharge = Number(row.planCharge)
              if(isNaN(row.planCharge)){
                  planCharge='';
              }else{
                  planCharge = row.planCharge.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
          }
          if(row.discount){
              discount=row.discount*10+"%";
              discount="("+discount+")";
          }
          if(planCharge!=''){
              return planCharge+discount;
          }
      },
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if(command == 'fill') {
					this.handleFill(this.currRow)
				} else if(command == 'confirm') {
					this.handleConfirm(this.currRow)
				} else if(command == 'verify') {
					this.handleVerify(this.currRow)
				} else if(command == 'invoice') {
					this.handleInvoice(this.currRow)
				} else if(command == 'delete') {
					this.handleDelete(this.currRow)
				}
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
    }
  }
</script>
