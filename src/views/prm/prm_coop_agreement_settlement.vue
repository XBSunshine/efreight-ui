<template>
	<div class="warp-main">
    <el-row >
      <el-col  class="toolbar" style="padding-bottom: 0;">
			<el-form >
				<el-row v-show="true" >
					<el-col class="elementWidth">
						<el-form-item label="客户名称" label-width="85px">
							<el-input v-model="coopName" clearable style="width: 135px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label="收费项目" label-width="85px">
              <el-input v-model="settlementModName" clearable style="width: 135px;">
              </el-input>
            </el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label="业务区域" label-width="85px">
              <el-select v-model="billTemplate" style="width: 105px;">
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
            <el-form-item label="模板状态" label-width="92px">
              <el-select v-model="settlementState" style="width: 100px;">
                <el-option label="全部"   value=""></el-option>
                <el-option label="待审核" value="待审核"></el-option>
                <el-option label="已审核" value="已生效"></el-option>
                <el-option label="已作废" value="未生效"></el-option>
                <el-option label="已超期" value="已超期"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 10px;">
              <el-button type="text" v-if="showFlag" @click="showFlag=false">收起</el-button>
              <el-button type="text" v-if="!showFlag" @click="showFlag=true">展开</el-button>
              <el-button type="primary" size="small" v-on:click="findCoopAgreementSettlementListCriteria">查询</el-button>
              <el-button type="primary" size="small" @click="showsave" v-if="addbillcustomerButtonFlag">
                新增账单客户
              </el-button>
              <el-button type="primary" size="small" @click="exportExcel" v-if="exportButtonFlag">导出</el-button>
            </el-form-item>
          </el-col>
				</el-row>
        <el-row v-show="showFlag">
          <el-col class="elementWidth">
            <el-form-item label="发送明细" label-width="85px">
              <el-select v-model="needEmail" style="width: 85px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="自动发送" label-width="85px">
              <el-select v-model="isSendMailAuto" style="width: 85px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="数据填充人" label-width="93px">
              <el-input  v-model="quantityConfirmName" clearable style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单确认人" label-width="93px">
              <el-input  v-model="billConfirmName" clearable style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="总部确认人" label-width="93px">
              <el-input  v-model="headOfficeConfirmName" clearable style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="销售负责人" label-width="95px">
              <el-input  v-model="userName" clearable style="width: 100px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
		</el-col>
		<div>
			<el-table v-loading="loading" :data="tableData" border row-key="id" :tree-props="{children: 'coopAgreementSettlementDetail'}">
        <el-table-column align="center" label="操作" width="60" type="index" fixed="left">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="create" v-if="scope.row.groupId==null && addbilltemplateButtonFlag">新增账单模板</el-dropdown-item>
                <el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
                <el-dropdown-item command="valid" v-if="validButtonFlag && scope.row.settlementState=='待审核'">财务审核</el-dropdown-item>
                <el-dropdown-item command="validIt" v-if="itvalidButtonFlag && scope.row.settlementState=='待审核'">IT审核</el-dropdown-item>
                <el-dropdown-item command="invalid" v-if="invalidButtonFlag">作废</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
                <el-dropdown-item command="check">查看</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
				<el-table-column  prop="settlementModName" label="账单名称/收费项目" width="500" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.settlementState=='待审核'" style="color:red">{{ formatter11(scope.row) }}</span>
            <span v-else>{{ formatter11(scope.row) }}</span>
          </template>
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
        <el-table-column align="center" prop="settlementState" label="审核" width="80">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-if="scope.row.settlementState=='已生效'"></i>
            <div style="color:red" v-if="scope.row.settlementState=='待审核'">{{ formatter22(scope.row) }}</div>
            <div style="color:red" v-if="scope.row.settlementState=='待审核'">{{ formatter33(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="needEmail" label="自动发送" width="70">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isSendMailAuto"></i>
          </template>
        </el-table-column>
				<el-table-column align="center" prop="quantityConfirmName" label="数据填充人" width="85">
				</el-table-column>
				<el-table-column align="center" prop="billConfirmName" label="账单确认人" width="85">
				</el-table-column>
	  		<el-table-column align="center" prop="headOfficeConfirmName" label="总部确认人" width="85">
				</el-table-column>
        <el-table-column align="left" prop="remark" label="备注" width="400">
        </el-table-column>
        <el-table-column align="left" prop="arrivalDeparturType" label="进出港类型 " width="90">
        </el-table-column>
        <el-table-column align="left" prop="paramText" label="航班性质" width="200">
        </el-table-column>
        <el-table-column align="left" prop="itCode" label="IT编码" width="100">
        </el-table-column>
        <el-table-column align="center" prop="startChargeTime" label="首次收费月份" width="100" :formatter="formatStartChargeTime">
        </el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 30, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
			</el-pagination>
		</div>
		</el-row>
		<save ref="addMission" v-if="savesVisible" :visible.sync="savesVisible"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
    <editgroup ref="addMission" v-if="editgroupVisible" :visible.sync="editgroupVisible" :frow="frow"></editgroup>
    <create ref="addMission" v-if="addVisible" :visible.sync="addVisible" :frow="frow"></create>
    <check ref="addMission" v-if="checkVisible" :visible.sync="checkVisible" :frow="frow"></check>
	</div>
</template>
<script>
	import Save from './settlement/prm_coop_agreement_settlement_createGroup'
	import Edit from './settlement/prm_coop_agreement_settlement_edit'
  import Create from './settlement/prm_coop_agreement_settlement_create'
  import Editgroup from './settlement/prm_coop_agreement_settlement_editGroup'
  import Check from './settlement/prm_coop_agreement_settlement_check'
	export default {
		data: function() {
			return {
        addbillcustomerButtonFlag:false,
        addbilltemplateButtonFlag: false,
        exportButtonFlag: false,
				editButtonFlag:false,
				delButtonFlag:false,
        validButtonFlag: false,
        invalidButtonFlag: false,
        itvalidButtonFlag: false,
				coopName: '',
        settlementModName: '',
				needEmail: '',
        isSendMailAuto: '',
        quantityConfirmName: '',
        billConfirmName: '',
        headOfficeConfirmName: '',
        settlementState: '',
        billTemplate: '',
        userName: '',
				show: false,
				showFlag: false,
				tableData: [],
				currentPage: 1,
				pageSize: 10,
				totalNum: 0,
				savesVisible: false,
				editVisible: false,
        addVisible:false,
        editgroupVisible: false,
        checkVisible: false,
				frow: {},
				loading: false,
        coopAgreementSettlementDetail: [],
			};
		},
		created() {
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('sys_coop_settlement_addbillcustomer')>-1) {
				this.addbillcustomerButtonFlag=true;
			}
			if (buttonInfo.indexOf('sys_coop_settlement_addbilltemplate')>-1) {
				this.addbilltemplateButtonFlag=true;
			}
			if (buttonInfo.indexOf('sys_coop_settlement_edit')>-1) {
				this.editButtonFlag=true;
			}
      if (buttonInfo.indexOf('sys_coop_settlement_valid')>-1) {
          this.validButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_settlement_invalid')>-1) {
          this.invalidButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_settlement_export')>-1) {
          this.exportButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_settlement_del')>-1) {
          this.delButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_settlement_itinvalid')>-1) {
          this.itvalidButtonFlag=true;
      }
			this.findCoopAgreementSettlementListCriteria();
		},
		provide() {
			return {
				findCoopAgreementSettlementListCriteria: this.findCoopAgreementSettlementListCriteria
			}
		},
		components: {
			'save': Save,
			'edit': Edit,
      'create': Create,
      'editgroup' : Editgroup,
      'check' : Check
		},
		methods: {
      formatStartChargeTime(row, column) {
          if (row.startChargeTime) {
              return row.startChargeTime.substring(0,7);
          }else{
              return "";
          }
      },
      toUpperCaseValue(val) {
          return val.toUpperCase();
      },
      formatter11(row, column) {
          if(row.settlementState1=='isParent'){
              return row.coopName+" ("+row.settlementModName+")";
          }else{
              return row.settlementModName;
          }
      },
      formatter22(row, column) {
          if(row.settlementState1=='isParent'){
          }else{
              let itUnReview = '';
              if(row.reviewIt != 1 && row.reviewItNeed1 == 1){
                  itUnReview = 'IT未审'
              }
              return itUnReview;
          }
      },
      formatter33(row, column) {
          if(row.settlementState1=='isParent'){
          }else{
              let financeUnReview = '';
              if(row.reviewFinance != 1){
                  financeUnReview = '财务未审'
              }
              return financeUnReview;
          }
      },
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'delete') {
					this.handleDelete(this.currRow)
				} else if(command == 'create') {
            this.handleCreate(this.currRow)
        } else if(command == 'valid') {
            this.handleValid(this.currRow)
        } else if(command == 'invalid') {
            this.handleInValid(this.currRow)
        } else if(command == 'check') {
            this.handleCheck(this.currRow)
        } else if(command == 'validIt') {
            this.handleValidIt(this.currRow)
        }
			},
			handleChange(command) {
				this.currRow = command
			},
			showsave() {
				this.savesVisible = true;
			},
			showedit(row) {
				this.frow = row;
        this.frow.operation='edit';
				if(row.groupId){
            this.editVisible = true;
        }else{
            this.editgroupVisible = true;
        }
			},
      handleCheck(row) {
          this.frow = row;
          this.frow.operation='check';
          if(row.groupId){
              this.checkVisible = true;
          }else{
              this.editgroupVisible = true;
          }
      },
      handleCreate(row) {
          this.frow = row;
          this.addVisible = true;
      },
			cancelVisible() {
				this.savesVisible = false;
				this.editVisible = false;
			},
			handleDelete(row) {
        if(row.groupId){//删除明细
            if(row.settlementState == '已生效'){
                this.$message.error('该收费明细已审核，不允许删除！');
                return;
            }else{
            }
        }else{//删除组
            if(row.haveChild){//有明细
                this.$message.error('该组账单下存在收费明细，不允许删除！');
                return;
            }else{//没有明细
            }
        }
				let currthis = this
				currthis.$confirm('请确认 是否删除?', '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					currthis.$axios.post('/prm/coopAgreementSettlement/deleteCoopAgreementSettlement', {
						settlementId: row.settlementId
					}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then((response) => {
						if(response.status = '200') {
							currthis.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							currthis.findCoopAgreementSettlementListCriteria();
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
      handleValid(row) {
          let settlementIdDetails='';
          if(row.coopAgreementSettlementDetail){
              for(let i=0;i<row.coopAgreementSettlementDetail.length;i++){
                  settlementIdDetails = settlementIdDetails + row.coopAgreementSettlementDetail[i].settlementId + ',';
              }
              if(settlementIdDetails){
                  settlementIdDetails = settlementIdDetails.substring(0,settlementIdDetails.length-1);
              }
          }
          let currthis = this
          currthis.$confirm('是否确认 财务审核?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              currthis.$axios.post('/prm/coopAgreementSettlement/validCoopAgreementSettlement', {
                  settlementId: row.settlementId,
                  groupId: row.groupId,
                  settlementIdDetails: settlementIdDetails,
              }, {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              }).then((response) => {
                  if(response.status = '200') {
                      currthis.$notify({
                          title: '成功',
                          message: '财务审核成功',
                          type: 'success'
                      });
                      currthis.findCoopAgreementSettlementListCriteria();
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
                  message: '已取消财务审核'
              });
          });

      },
      handleValidIt(row) {
          let settlementIdDetails='';
          if(row.coopAgreementSettlementDetail){
              for(let i=0;i<row.coopAgreementSettlementDetail.length;i++){
                  settlementIdDetails = settlementIdDetails + row.coopAgreementSettlementDetail[i].settlementId + ',';
              }
              if(settlementIdDetails){
                  settlementIdDetails = settlementIdDetails.substring(0,settlementIdDetails.length-1);
              }
          }
          if(row.groupId){
              if(row.reviewItNeed1 != 1){
                  this.$message.error('该模板不需要IT审核');
                  return;
              }
          }
          let currthis = this
          currthis.$confirm('是否确认 IT审核?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              currthis.$axios.post('/prm/coopAgreementSettlement/validItCoopAgreementSettlement', {
                  settlementId: row.settlementId,
                  groupId: row.groupId,
                  settlementIdDetails: settlementIdDetails,
              }, {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              }).then((response) => {
                  if(response.status = '200') {
                      currthis.$notify({
                          title: '成功',
                          message: 'IT审核成功',
                          type: 'success'
                      });
                      currthis.findCoopAgreementSettlementListCriteria();
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
                  message: '已取消IT审核'
              });
          });

      },
      handleInValid(row) {
          let settlementIdDetails='';
          if(row.coopAgreementSettlementDetail){
              for(let i=0;i<row.coopAgreementSettlementDetail.length;i++){
                  settlementIdDetails = settlementIdDetails + row.coopAgreementSettlementDetail[i].settlementId + ',';
              }
              if(settlementIdDetails){
                  settlementIdDetails = settlementIdDetails.substring(0,settlementIdDetails.length-1);
              }
          }
          let currthis = this
          currthis.$confirm('是否设置失效?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              currthis.$axios.post('/prm/coopAgreementSettlement/invalidCoopAgreementSettlement', {
                  settlementId: row.settlementId,
                  groupId: row.groupId,
                  settlementIdDetails: settlementIdDetails,
              }, {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              }).then((response) => {
                  if(response.status = '200') {
                      currthis.$notify({
                          title: '成功',
                          message: '设置失效成功',
                          type: 'success'
                      });
                      currthis.findCoopAgreementSettlementListCriteria();
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
                  message: '已取消设置'
              });
          });

      },
			handleSizeChange(val) {
				this.findCoopAgreementSettlementListCriteria();
			},
			handleCurrentChange(val) {
				this.findCoopAgreementSettlementListCriteria();
			},
			findCoopAgreementSettlementListCriteria() {
				this.loading = true
        let coopName1 = "";
        if(this.coopName){
            coopName1 = this.coopName.toUpperCase();
        }
				this.$axios.post('/prm/coopAgreementSettlement/findCoopAgreementSettlementListCriteria', {
					coopName: coopName1,
          settlementModName: this.settlementModName,
					needEmail: this.needEmail,
          quantityConfirmName: this.quantityConfirmName,
          billConfirmName: this.billConfirmName,
          headOfficeConfirmName: this.headOfficeConfirmName,
          settlementState: this.settlementState,
          billTemplate: this.billTemplate,
          userName: this.userName,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
          isSendMailAuto: this.isSendMailAuto
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(response) {
					if(response.status = '200') {
						this.loading = false
						this.tableData = response.data.paramList
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
			settlementPeriodFormat(row, column) {
				if(row.settlementPeriod == '0') {
					return "按月"
				} else if(row.settlementPeriod == '1') {
					return "按年"
				}else if(row.settlementPeriod == '2') {
            return "按季度"
        }else if(row.settlementPeriod == '3') {
            return "按半年"
        }
			},
			settlementTypeFormat(row, column) {
				if(row.settlementType == '0') {
					return "包月计费"
				} else if(row.settlementType == '1') {
					return "按量计费"
				} else if(row.settlementType == '2') {
            return "包年计费"
        }else if(row.settlementType == '4') {
            return "包季度计费"
        }else if(row.settlementType == '3') {
            return "包半年计费"
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
			needEmailFormat(row, column) {
				if(row.needEmail == '0') {
					return "否"
				} else if(row.needEmail == '1') {
					return "是"
				}
			},
      formatMoney(row, column){
          if(row.receiveCharge === '' || row.receiveCharge === 0) return ''
          row.receiveCharge = Number(row.receiveCharge)
          if(isNaN(row.receiveCharge)) return ''
          return row.receiveCharge.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      },
			exportExcel1() {
				let params = {
					"coopName": this.coopName,
					"agreementId": this.agreementId,
					"needEmail": this.needEmail
				}
				this.$axios.post3('/prm/coopAgreementSettlement/exportExcel', params)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '客户结算协议列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));

			},
      exportExcel() {
        if(this.tableData.length == 0){
            this.openError("查询结果没有数据，不允许导出","导出");
            return;
        }
        let coopName1 = "";
        if(this.coopName){
            coopName1 = this.coopName.toUpperCase();
        }
        let params = {
            "coopName": coopName1,
            "settlementModName": this.settlementModName,
            "needEmail": this.needEmail,
            "quantityConfirmName": this.quantityConfirmName,
            "billConfirmName": this.billConfirmName,
            "headOfficeConfirmName": this.headOfficeConfirmName,
            "settlementState": this.settlementState,
            "billTemplate": this.billTemplate,
            "userName": this.userName,
            "isSendMailAuto": this.isSendMailAuto
        }
        this.$axios.post3('/prm/coopAgreementSettlement/exportExcel', params)
            .then(function(response) {
                var blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                var downloadElement = document.createElement('a');
                var href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = '账单模板列表' + '.xls'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
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
      openError(info, flag) {
          this.$notify({
              title: '',
              message: flag + '失败，' + info,
              type: 'error',
              position: 'bottom-right'
          });
      },
		}
	}
</script>

