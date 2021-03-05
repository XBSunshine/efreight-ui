<template>
	<div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
			<el-form>
				<el-row >
					<el-col class="elementWidth">
						<el-form-item label="账单月份" label-width="100px">
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
						<el-form-item label="账单编号" label-width="105px">
							<el-input v-model="query.statementNumber" clearable style="width: 120px;">
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单名称" label-width="105px">
              <el-input v-model="query.statementName" clearable style="width: 120px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 50px;">
              <el-button type="primary" size="small" v-on:click="findMadeCoopBillList">查询</el-button>
              <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
            </el-form-item>
          </el-col>
				</el-row>
				<el-row >
					<el-col class="elementWidth">
						<el-form-item label="状态" label-width="100px">
							<el-select v-model="query.statementStatus" clearable style="width: 120px;">
								<el-option label="客户已确认" value="客户已确认"></el-option>
								<el-option label="发票已开具" value="发票已开具"></el-option>
								<el-option label="账单已核销" value="账单已核销"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" >
						<el-form-item label="发票号" label-width="105px">
							<el-input v-model="query.invoiceNumber" clearable style="width: 135px;">
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单确认人" label-width="105px">
              <el-input v-model="query.billConfirmName" clearable style="width: 120px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="业务区域" label-width="105px">
              <el-select v-model="query.billTemplate" style="width: 120px;" clearable>
                <el-option label="全部"   value=""></el-option>
                <el-option label="华北" value="BJS"></el-option>
                <el-option label="华南" value="CAN"></el-option>
                <el-option label="华东" value="SHA"></el-option>
                <el-option label="西北" value="XIY"></el-option>
                <el-option label="总部" value="EFT"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
				</el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="客户确认日期" label-width="100px">
              <el-date-picker v-model="query.confirmCustomerTime_begin"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
              </el-date-picker>
              <span>-</span>
              <el-date-picker v-model="query.confirmCustomerTime_end"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="核销日期" label-width="100px">
              <el-date-picker v-model="query.invoiceWriteoffDate_begin"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
              </el-date-picker>
              <span>-</span>
              <el-date-picker v-model="query.invoiceWriteoffDate_end"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="开票日期" label-width="100px">
              <el-date-picker v-model="query.invoiceDate_begin"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
              </el-date-picker>
              <span>-</span>
              <el-date-picker v-model="query.invoiceDate_end"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
		</el-col>
		<div>
			<el-table :data="data" border :summary-method="getSummaries" show-summary>
        <el-table-column align="center" label="操作" width="60" fixed="left">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="invoice" v-if="invoiceButtonFlag && (scope.row.statementStatus=='客户已确认' || scope.row.statementStatus=='发票已开具')">开具发票</el-dropdown-item>
                <el-dropdown-item command="verify" v-if="verifyButtonFlag && scope.row.statementStatus=='发票已开具'">发票核销</el-dropdown-item>
                <el-dropdown-item command="checkbill" v-if="checkbillButtonFlag">查看账单</el-dropdown-item>
                <el-dropdown-item command="printbill" v-if="printbillButtonFlag">账单预览</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="left" show-overflow-tooltip prop="serviceName" label="账单名称" width="500">
          <template slot-scope="scope">
            <span>{{ formatter22(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="statementStatus" label="状态" width="85">
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="billName" label="账单月份" width="80">
        </el-table-column>
        <el-table-column align="center" prop="invoiceAmount" label="账单金额" width="140" :formatter="acturalChargeFormat">
        </el-table-column>
        <el-table-column align="center" prop="billTemplate" label="业务区域" width="90">
        </el-table-column>
        <el-table-column align="center" prop="billConfirmName" label="账单确认人" width="180">
        </el-table-column>
        <el-table-column align="center" prop="confirmCustomerTime" label="客户确认时间" width="160">
        </el-table-column>
        <el-table-column align="center" prop="invoiceTitle" label="开票客户名称" width="400">
        </el-table-column>
        <el-table-column align="center" prop="invoiceType" label="发票类型" width="90">
        </el-table-column>
        <el-table-column align="center" prop="invoiceNumber" label="发票号" width="150">
        </el-table-column>
        <el-table-column align="center" prop="invoiceUserName" label="开票人" width="70">
        </el-table-column>
        <el-table-column align="center" prop="invoiceDate" label="开票日期" width="90" :formatter="formatstopDate">
        </el-table-column>
        <el-table-column align="center" prop="invoiceWriteoffUserName" label="核销人" width="70">
        </el-table-column>
        <el-table-column align="center" prop="invoiceWriteoffDate" label="核销日期" width="90" :formatter="formatstopDate1">
        </el-table-column>
        <el-table-column align="center" prop="expressNumber" label="快递号" width="150">
        </el-table-column>
        <el-table-column align="center" label="发送账单" width="70">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.statementMailDate"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="invoiceReceiveEmail" label="电子发票接收邮箱" width="200">
        </el-table-column>
        <el-table-column align="center">
        </el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 30, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
			</el-pagination>
		</div>
		</el-row>
		<create ref="addMission" v-if="createVisible" :visible.sync="createVisible"></create>
		<invoice ref="addMission" v-if="invoiceVisible" :visible.sync="invoiceVisible" :frow="frow"></invoice>
		<fill ref="addMission" v-if="fillVisible" :visible.sync="fillVisible" :frow="frow"></fill>
    <checkbill ref="addMission" v-if="checkVisible" :visible.sync="checkVisible" :frow="frow"></checkbill>
    <invoiceEmail ref="addMission" v-if="invoiceEmailVisible" :visible.sync="invoiceEmailVisible" :frow="frow"></invoiceEmail>
    <verify ref="addMission" v-if="verifyVisible" :visible.sync="verifyVisible" :frow="frow"></verify>
	</div>
</template>

<script>
	import Create from './bill/prm_coop_bill_create'
	import Invoice from './bill/prm_coop_bill_invoice'
	import Fill from './bill/prm_coop_bill_fill'
  import Checkbill from './prm_coop_bill_check'
  import InvoiceEmail from './prm_invoice_email'
  import Verify from './bill/prm_coop_verify'
	export default {
		data() {
			return {
				data: [],
        data2: [],
				loading: false,
				currentPage: 1,
				pageSize: 10,
				totalNum: 0,
				query: {
					billName:'',
					coopName:'',
          statementNumber: '',
          statementStatus: '客户已确认',
					createTimeStart: '',
					createTimeEnd: '',
          invoiceNumber: '',
          statementMailDate: '',
          billConfirmName: '',
          creatorName: '',
          billStyle: '',
          billStyle1:'',
          statementName: '',
          billTemplate: '',
          confirmCustomerTime_begin: '',
          confirmCustomerTime_end: '',
          invoiceWriteoffDate_begin: '',
          invoiceWriteoffDate_end: '',
          invoiceDate_begin: '',
          invoiceDate_end: '',
				},
				createVisible: false,
				invoiceVisible: false,
				fillVisible: false,
        checkVisible: false,
        dialogFormVisible: false,
        printbillVisible: false,
				frow: '',
				currRow: '',
        statement_id: '',
        sendButtonFlag: false,
        invoiceButtonFlag: false,
        verifyButtonFlag: false,
        checkbillButtonFlag: false,
        printbillButtonFlag: false,
        deleteButtonFlag: false,
        invoiceEmailVisible: false,
        verifyVisible: false,
			}
		},
		provide() {
			return {
          findMadeCoopBillList: this.findMadeCoopBillList,
          invoiceEmail: this.invoiceEmail,
			}
		},
		components: {
			'create': Create,
			'invoice': Invoice,
			'fill': Fill,
      'checkbill': Checkbill,
       'invoiceEmail': InvoiceEmail,
      'verify': Verify,
		},
		created() {
      let buttonInfo = window.localStorage.getItem('buttonInfo')
      if (buttonInfo.indexOf('sys_coop_bill_send')>-1) {
          this.sendButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_bill_invoice')>-1) {
          this.invoiceButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_bill_verify')>-1) {
          this.verifyButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_bill_checkbill')>-1) {
          this.checkbillButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_bill_printbill')>-1) {
          this.printbillButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_bill_delete')>-1) {
          this.deleteButtonFlag=true;
      }
			this.findMadeCoopBillList();
      this.query.billName=this.getDateTime(new Date());
		},
		methods: {
      getSummaries(param) {
          const sums = [];
          sums[0] = '合计';
          if(this.data2.length > 0) {
              sums[4] = this.getNumber1(this.data2[0].invoiceAmountTotal);
          }
          return sums;
      },
      getNumber1(data) {
          return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      invoiceEmail(row) {
          this.frow = row;
          this.invoiceEmailVisible = true;
      },
      toUpperCaseValue(val) {
          return val.toUpperCase();
      },
      formatter22(row, column) {
          return row.coopName+" ("+row.statementName+")";
      },
      formatstopDate(row, column) {
          if (row.invoiceDate) {
              return row.invoiceDate.substring(0,10);
          }else{
              return "";
          }
      },
      formatstopDate1(row, column) {
          if (row.invoiceWriteoffDate) {
              return row.invoiceWriteoffDate.substring(0,10);
          }else{
              return "";
          }
      },
      formatstopDate2(row, column) {
          if (row.confirmCustomerTime) {
              return row.confirmCustomerTime.substring(0,10);
          }else{
              return "";
          }
      },
      acturalChargeFormat(row, column) {
          let invoiceAmount='';
          if(row.invoiceAmount) {
              row.invoiceAmount = Number(row.invoiceAmount)
              if(isNaN(row.invoiceAmount)){
                  invoiceAmount='';
              } else {
                  invoiceAmount = row.invoiceAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
          }
          return invoiceAmount;
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
      isValidFormat(row, column) {
          if(row.statementMailDate) {
              return "生效"
          } else  {
              return "失效"
          }
      },
			save() {
				this.createVisible = true;
			},
			handleInvoice(row) {
				this.frow = row
				this.invoiceVisible = true;
			},
      handleCheck(row) {
          this.frow = row
          this.checkVisible = true;
      },
			cancelVisible() {
				this.createVisible = false;
				this.invoiceVisible = false;
				this.fillVisible = false;
        this.checkVisible = false;
			},
			handleFill(row) {
				this.frow = row;
				this.fillVisible = true;
			},
      handlePrint(row){
          let host = window.location.host;
          let hostName=host.split(":")[0];
          let statement_id = row.statement_id;
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
			handleSend(row) {
          if(row.statementStatus!='已制作'){
              this.$message.error('只有状态为已制作才可以发送');
              return;
          }
          this.dialogFormVisible = true;
          this.statement_id = row.statement_id;
      },
      sendBill(){
          //账单类型必须选择
          if(this.query.billStyle){

          }else{
              this.$message.error('请选择账单类型');
              return;
          }

          let currthis = this
          currthis.$axios.put('/prm/coopBill/confirm/' + this.statement_id + '/' + this.query.billStyle).then((response) => {
              if(response.data.code == '0') {
                  currthis.$notify({
                      title: '成功',
                      message: '发送成功',
                      type: 'success'
                  });
                  currthis.findMadeCoopBillList();
              } else {
                  currthis.$notify.error({
                      title: '发送失败',
                      message: response.data.messageInfo
                  });
              }
          })
          this.dialogFormVisible = false;
      },

			handleVerify(row) {
          this.frow = row;
          this.verifyVisible = true;
			},
			handleDelete(row) {
        if(row.statementStatus!='已制作'){
            this.$message.error('只有状态为已制作才可以删除');
            return;
        }
				let currthis = this
				currthis.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					currthis.$axios.deletes('/prm/coopBill/' + row.statement_id).then((response) => {
						if(response.data.code == '0') {
							currthis.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							currthis.findMadeCoopBillList();
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
				this.findMadeCoopBillList();
			},
			handleCurrentChange(val) {
				this.findMadeCoopBillList();
			},
			findMadeCoopBillList() {
				this.$axios.get2('/prm/coopBill/madeBill?current=' + this.currentPage + '&size=' + this.pageSize, this.query).then(function(response) {
					if(response.data.code == '0') {
						this.data = response.data.data.records
						this.totalNum = response.data.data.total
					} else {
						this.$notify.error({
							title: '错误',
							message: '查询失败'
						});
					}
				}.bind(this)).catch(function(error) {
					console.log(error)
				});

        this.$axios.get2('/prm/coopBill/getTotalMadeBill?', this.query).then(function(response) {
            this.data2 = response.data.data;
            this.getSummaries();
        }.bind(this));
			},
      exportExcel() {
          if(this.data.length == 0){
              this.$message.error('查询结果没有数据，不允许导出');
              return;
          }
          this.$axios.post3('/prm/coopBill/exportMadeBillExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '已确认账单' + '.xls'; // 下载后文件名
                  document.body.appendChild(downloadElement);
                  downloadElement.click(); // 点击下载
                  document.body.removeChild(downloadElement); // 下载完成移除元素
                  window.URL.revokeObjectURL(href); // 释放掉blob对象
              }.bind(this));

      },
			invoiceAmountFormat(row, column) {
				if (row.invoiceAmount) {
					return row.invoiceAmount+"("+row.discount*10+"%)";
				}
			},
			settlementTypeFormat(row, column) {
				var settlementType='';
				var settlementPeriod='';

				if(row.settlementType == '0') {
					settlementType= "包月计费";
				} else if(row.settlementType == '1') {
					settlementType=  "按量计费";
				}else{
					settlementType=  "包年计费";
				}
				if(row.settlementPeriod == '0') {
					settlementPeriod= "按月";
				} else{
					settlementPeriod=  "按年";
				}
				return settlementPeriod+'/'+settlementType;
			},
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if(command == 'fill') {
					this.handleFill(this.currRow)
				} else if(command == 'send') {
					this.handleSend(this.currRow)
				} else if(command == 'verify') {
					this.handleVerify(this.currRow)
				} else if(command == 'invoice') {
					this.handleInvoice(this.currRow)
				} else if(command == 'delete') {
					this.handleDelete(this.currRow)
				}else if(command == 'checkbill') {
            this.handleCheck(this.currRow)
        }else if(command == 'printbill') {
            this.handlePrint(this.currRow)
        }
			}
		}
	}
</script>

