<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="css_financial_expense_report">
			<div ref="css_financial_expense_report_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:280px;">
								<template slot="prepend">报销状态</template>
								<el-select slot="suffix" v-model="statusList" style="width:213px;margin-right: -5px;" multiple>
									<el-option label="已暂存" value="已暂存"></el-option>
									<el-option label="已提交" value="已提交"></el-option>
									<el-option label="已审批" value="已审批"></el-option>
									<el-option label="已审核" value="已审核"></el-option>
                  <el-option label="已付款" value="已付款"></el-option>
                  <el-option label="已退回" value="已退回"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
          	<el-form-item label-width="10px">
          		<el-input style="width: 180px;" v-model="query.expenseReportNum" auto-complete="off" clearable>
          			<template slot="prepend">报销单号</template>
          		</el-input>
          	</el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:204px;">
								<template slot="prepend">申请日期</template>
								<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.expenseReportDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker style="width: 135px;" v-model="query.expenseReportDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="mini" @click="queryList" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">查询</el-button>
              <el-button type="primary" size="mini" @click="save" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">新增</el-button>
              <el-button type="primary" size="mini" @click="printMore" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">打印</el-button>
              <el-button type="primary" size="mini" v-if="checkButtonFlag" @click="audit" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">财务审核</el-button>
              <el-button type="primary" size="mini" v-if="checkButtonFlag" @click="payment" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">付款</el-button>

						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:280px;">
								<template slot="prepend">申请人&emsp;</template>
								<el-select slot="suffix" v-model="query.creatorId" clearable :disabled="!checkButtonFlag" style="width:214px;margin-right: -5px;" >
									<el-option v-for="item in orgUserList" :key="item.code" :label="item.name" :value="item.code">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:280px;">
								<template slot="prepend">审批人&emsp;</template>
								<el-select slot="suffix" v-model="query.approvalDeptManagerId" clearable :disabled="!checkButtonFlag" style="width:214px;margin-right: -5px;" >
									<el-option v-for="item in orgUserList" :key="item.code" :label="item.name" :value="item.code">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="301px">
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" tooltip-effect="dark"  @selection-change="handleSelectionChange" :data="data" border :max-height="tableHeight" @header-dragend="cellWidth">
     <el-table-column
           type="selection"
           width="55">
         </el-table-column>
      <el-table-column fixed type="index" align="center" label="操作" width="50">
      	<template slot-scope="scope">
      		<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
      			<i class="el-icon-s-operation"></i>
      			<el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="view"  v-if="scope.row.creatorId==userId||checkButtonFlag||scope.row.approvalDeptManagerId==userId">查看</el-dropdown-item>
      				<el-dropdown-item command="edit"  v-if="scope.row.creatorId==userId">编辑</el-dropdown-item>
      				<el-dropdown-item command="print">打印</el-dropdown-item>
      				<el-dropdown-item command="back" v-if="scope.row.approvalDeptManagerId==userId">退回</el-dropdown-item>
              <el-dropdown-item command="approve" v-if="scope.row.approvalDeptManagerId==userId">审批</el-dropdown-item>
              <el-dropdown-item command="delete" v-if="scope.row.creatorId==userId||scope.row.approvalDeptManagerId==userId">删除</el-dropdown-item>
      			</el-dropdown-menu>
      		</el-dropdown>
      	</template>
      </el-table-column>

      <template v-for="(item,index) in tableColumns">
      <el-table-column  v-if="item.label!='报销金额'&&item.label!='费用科目'&&item.label!='银行科目'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
      <el-table-column  v-if="item.label=='报销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center" :formatter="expenseAmount"></el-table-column>
      <el-table-column  v-if="item.label=='费用科目'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center" :formatter="expenseFinancialAccountName"></el-table-column>
      <el-table-column  v-if="item.label=='银行科目'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center" :formatter="bankFinancialAccountName"></el-table-column>
      </template>
		</el-table>
		<div ref="css_financial_expense_report_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>

		<saveOrEdit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></saveOrEdit>
    <audit ref="addMission" v-if="viewVisibleAudit" :visible.sync="viewVisibleAudit" :frow="frow"></audit>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
    <viewTag ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewTag>
	</div>

</template>
<script>

	import saveOrEdit from './cssFinancialExpenseReport/css_financial_expense_report_save.vue'
  import audit from './cssFinancialExpenseReport/css_financial_expense_report_audit.vue'
  import columns from './cssFinancialExpenseReport/css_financial_expense_report_column.json'
  import setVisibleVue from './cssFinancialExpenseReport/css_financial_expense_report_setting'
  import view from './cssFinancialExpenseReport/css_financial_expense_report_view.vue'

	export default {
		data() {
			return {
				tableHeight: '550px',
        tableColumns: [],
				loading: false,
				showFlag: false,
        editVisible:false,
        viewVisibleAudit:false,
        checkButtonFlag:false,
        viewVisible:false,
        setVisible:false,
        orgName:'',
        currRow:'',
        userId:'',
				data: [],
				frow: {},
        orgUserList:[],
        reportSelection: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50]
				},
        statusList:['已暂存','已提交','已退回'],
				query: {
            expenseReportStatus:'',
            expenseReportNum:'',
            expenseReportDateStart:'',
            expenseReportDateEnd:'',
            creatorId:'',
            approvalDeptManagerId:'',
            auditType:'2',
            columnStrs:''
				},
			}
		},
		components: {
      'setVisibleTag': setVisibleVue,
			'saveOrEdit': saveOrEdit,
      'audit':audit,
      'viewTag':view
		},
		provide() {
			return {
				findByPage: this.queryList
			}
		},
		created: function() {
      //从数据库查询设置信息
      this.defInfo();

     this.userId = window.localStorage.getItem('userId');
     this.orgName = window.localStorage.getItem('orgName');
     let buttonInfo = window.localStorage.getItem('buttonInfo')
     if (buttonInfo.indexOf('css_financial_expense_report_audit') > -1) {
     	this.checkButtonFlag = true;
      this.query.auditType = '1';
     }
      //当前用户所在签约公司的有效用户 orgUserList
     let param = {
          auditType:this.query.auditType
     }
     this.$axios.get2('/afbase/cssFinancialExpenseReport/orguser',param).then((response) => {
     	this.orgUserList = response.data.data;
      if(this.query.auditType=='2'){
       this.query.creatorId = this.orgUserList[0].code;
       this.query.approvalDeptManagerId = this.orgUserList[0].code;
      }
     }).catch((error) => {
     	console.log(error);
     });
		},
		mounted() {
			this.setHeight();
		},
		methods: {
      setting(){
          this.setVisible = true;
      },
      save(){
        this.editVisible = true;
        this.frow.operType = 'save';
      },
      defInfo(){
        let pageName = '财务结算管理/费用报销';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
            let list_column = response.data.data;
            if (list_column && list_column.length > 0) {
              let arrayC = list_column
              if (arrayC && arrayC.length > 0) {
                this.tableColumns = this.sortBykey(arrayC, 'index');
              }
            } else {
              let str = JSON.stringify(columns.info);
              this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
            }
          }.bind(this));
      },
      cellWidth(newWidth, oldWidth, column, event) {
      	let strColumn = JSON.stringify(this.tableColumns);
      	let userId = window.localStorage.getItem('userId');
      	let arrayC = JSON.parse(strColumn);
      	if (arrayC && arrayC.length > 0) {
      		arrayC.forEach(function(item, index) {
      			if (column.label == item.label) {
      				item.width = newWidth;
      			}
      		});
      		arrayC = this.sortBykey(arrayC, 'index');
      		localStorage.setItem(userId + '_css_financial_expense_report_column_width', JSON.stringify(arrayC))
      	}
      },
      sortBykey(ary, key) {
      	return ary.sort(function(a, b) {
      		let x = a[key]
      		let y = b[key]
      		return ((x < y) ? -1 : (x > y) ? 1 : 0)
      	})
      },
      view(row){
        this.viewVisible = true;
        this.frow.expenseReportId = row.expenseReportId;
      },
      edit(row){
        if(row.expenseReportStatus!='已暂存'&&row.expenseReportStatus!='已退回'){
            this.openError("报销单只有已暂存、已退回状态才可以编辑");
        }else{
        this.editVisible = true;
        this.frow.operType = 'edit';
        this.frow.expenseReportId = row.expenseReportId;
        }
      },
      expenseFinancialAccountName(row){
        if(row.expenseFinancialAccountCode){
          return row.expenseFinancialAccountCode+" "+row.expenseFinancialAccountName;
        }else{
          return '';
        }
      },
      bankFinancialAccountName(row){
        if(row.bankFinancialAccountCode){
           return row.bankFinancialAccountCode+" "+row.bankFinancialAccountName;
        }else{
          return '';
        }
      },
			// sortCostAmountStr(a, b) {
			// 	return a.costAmountStr.replace(/,/g, "") - b.costAmountStr.replace(/,/g, "")
			// },
       handleSelectionChange(val) {
          this.reportSelection = val;
       },
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let css_financial_expense_report_header = this.$refs.css_financial_expense_report_header.offsetHeight;
					let css_financial_expense_report_footer = this.$refs.css_financial_expense_report_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - css_financial_expense_report_header - css_financial_expense_report_footer;
					this.tableHeight = heightS + "px";
				});
			},
      //退回
      back(row){
        if(row.expenseReportStatus=='已提交'||row.expenseReportStatus=='已审批'||row.expenseReportStatus=='已审核'){
          this.$confirm('是否退回 当前报销申请？', '提示', {
          	confirmButtonText: '确定',
          	cancelButtonText: '取消',
          	type: 'warning',
          	center: true
          }).then(() => {
              let param = {
                    expenseReportId:row.expenseReportId,
                    expenseReportStatus:'已退回'
              }
              this.$axios.post2('/afbase/cssFinancialExpenseReport/modify/status', param)
                .then((response) => {
                  if (response.data.code == 0) {
                    this.openSuccess("退回成功")
                    this.queryList();
                  } else {
                    this.openError(response.data.messageInfo)
                  }
                }).catch((error) => {
                  this.openError(error.response.data.messageInfo)
                });
          }).catch(() => {

          });
        }else{
          this.openError("报销单只有【已提交、已审批、已审核】状态才可以退回");
        }
      },
      //审批
      approve(row){
        if(row.expenseReportStatus=='已提交'||row.expenseReportStatus=='已退回'){
          this.$confirm('请确认，是否进行审批？', '提示', {
          	confirmButtonText: '确定',
          	cancelButtonText: '取消',
          	type: 'warning',
          	center: true
          }).then(() => {
               let param = {
                     expenseReportId:row.expenseReportId,
                     expenseReportStatus:'已审批'
               }
               this.$axios.post2('/afbase/cssFinancialExpenseReport/modify/status', param)
               	.then((response) => {
               		if (response.data.code == 0) {
               			this.openSuccess("审批成功")
                    this.queryList();
               		} else {
               			this.openError(response.data.messageInfo)
               		}
               	}).catch((error) => {
               		this.openError(error.response.data.messageInfo)
               	});
          }).catch(() => {

          });
        }else{
          this.openError("报销单只有【已提交、已退回】状态才可以审批");
        }
      },

      //删除
      delete(row){
        if(row.expenseReportStatus=='已提交'||row.expenseReportStatus=='已审批'||row.expenseReportStatus=='已暂存'||row.expenseReportStatus=='已退回'){
          this.$confirm('请确认，是否删除？', '提示', {
          	confirmButtonText: '确定',
          	cancelButtonText: '取消',
          	type: 'warning',
          	center: true
          }).then(() => {
              let param = {
                    expenseReportId:row.expenseReportId
              }
              this.$axios.post2('/afbase/cssFinancialExpenseReport/delete', param)
                .then((response) => {
                  if (response.data.code == 0) {
                    this.openSuccess("删除成功")
                    this.queryList();
                  } else {
                    this.openError(response.data.messageInfo)
                  }
                }).catch((error) => {
                  this.openError(error.response.data.messageInfo)
                });
          }).catch(() => {

          });
        }else{
          this.openError("报销单已提交财务，不允许删除！");
        }
      },
      print(row){
         let param ={
            expenseReportIdStr:row.expenseReportId,
            orgName:this.orgName
         }
         this.toPrint(param);
      },
      printMore(){
        if (this.reportSelection.length == 0) {
        	this.openError("请至少选择一个报销单");
        	return;
        }
        let idStr = '';
        this.reportSelection.forEach((row) => {
          if(idStr){
             idStr = idStr+","+row.expenseReportId;
          }else{
             idStr = row.expenseReportId;
          }

        });
       let param ={
         expenseReportIdStr:idStr,
         orgName:this.orgName
       }
       this.toPrint(param);
      },
      toPrint(param){
        this.$axios.post3('/afbase/cssFinancialExpenseReport/print', param).then((response) => {
        	var blob = new Blob([response.data], {
        		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        	});
        	var downloadElement = document.createElement('a');
        	var href = window.URL.createObjectURL(blob); // 创建下载的链接
        	downloadElement.href = href;
        	downloadElement.download = '报销单打印.xlsx'; // 下载后文件名
        	document.body.appendChild(downloadElement);
        	downloadElement.click(); // 点击下载
        	document.body.removeChild(downloadElement); // 下载完成移除元素
        	window.URL.revokeObjectURL(href); // 释放掉blob对象
        	this.query.columnStrs = ''; //清空掉导出的列表字段
        }).catch((error) => {});
      },
      //付款
      payment(){
        if (this.reportSelection.length == 0) {
        	this.openError("请至少选择一个报销单");
        	return;
        }
        let checkFlag = false;
        let idStr = '';
        this.reportSelection.forEach((row) => {
            if(row.expenseReportStatus!='已提交'&&row.expenseReportStatus!='已审批'&&row.expenseReportStatus!='已审核'){
               checkFlag = true;
            }else{
              if(idStr){
                 idStr = idStr+","+row.expenseReportId;
              }else{
                 idStr = row.expenseReportId;
              }
            }
        });
        if(checkFlag){
            this.openError("请检查选择的报销单，只有状态为【已提交、已审批、已审核】才可以付款");
        }else{
            this.$confirm('请确认，是否进行 付款？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
                let param = {
                      expenseReportIdStr:idStr
                }
                this.$axios.post2('/afbase/cssFinancialExpenseReport/payment', param)
                  .then((response) => {
                    if (response.data.code == 0) {
                      this.openSuccess("付款成功")
                      this.queryList();
                    } else {
                      this.openError(response.data.messageInfo)
                    }
                  }).catch((error) => {
                    this.openError(error.response.data.messageInfo)
                  });
            }).catch(() => {

            });
        }

      },

      //财务审核
      audit(){
        this.frow.id = '';
        if (this.reportSelection.length == 0) {
        	this.openError("请至少选择一个报销单");
        	return;
        }
        let checkFlag = false;
        let checkAuditFlag = true;
        let id = '';
        let idStr = '';
        this.reportSelection.forEach((row) => {
            if(row.expenseReportStatus!='已提交'&&row.expenseReportStatus!='已审批'&&row.expenseReportStatus!='已审核'&&row.expenseReportStatus!='已退回'){
               checkFlag = true;
            }else{
              if(row.expenseReportStatus=='已审核'){
                checkAuditFlag = false;
                if(!id){
                   id = row.expenseReportId;
                }
              }
              if(idStr){
                 idStr = idStr+","+row.expenseReportId;
              }else{
                 idStr = row.expenseReportId;
              }
            }
        });
        if(checkFlag){
            this.openError("请检查选择的报销单，只有状态为【已提交、已退回、已审批、已审核】才可以财务审核");
        }else{
          if(checkAuditFlag){
             this.$confirm('请确认，是否进行 财务审核？', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning',
               center: true
             }).then(() => {
                 this.frow.expenseReportIdStr = idStr;
                 this.viewVisibleAudit = true;
             }).catch(() => {

             });
          }else{
             this.$confirm('选中内容 包含已审核的 报销单，请确认是否继续？', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning',
               center: true
             }).then(() => {
                 this.frow.expenseReportIdStr = idStr;
                 this.frow.id = id;
                 this.viewVisibleAudit = true;
             }).catch(() => {

             });
          }
        }

      },
			expenseAmount(data) {
				return data.expenseAmount.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.edit(this.currRow)
				}else if(command == 'print'){
           this.print(this.currRow);
        }else if(command == 'back'){
          this.back(this.currRow);
        }else if(command == 'approve'){
          this.approve(this.currRow);
        }else if(command == 'delete'){
          this.delete(this.currRow);
        }else if(command == 'view'){
          this.view(this.currRow);
        }

			},
			handleChange(command) {
				this.currRow = command
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			queryList() {
        this.defInfo();
        let statusStr = '';
        if(this.statusList){
          this.statusList.forEach((row) => {
            if(statusStr){
          	statusStr = statusStr + ",'" + row+"'";
            }else{
              statusStr = "'"+row+"'";
            }
          });
        }
        this.query.expenseReportStatus = statusStr;
				this.setHeight();
						this.loading = true
						this.$axios.get2('/afbase/cssFinancialExpenseReport/page?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
							if (this.data.length == 0) {
								let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
								this.queryList2(current);
							} else {
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
			},
			queryList2(current) {
				this.query.groupSum = this.ifGroup;
				this.$axios.get2('/afbase/cssFinancialExpenseReport/page?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch(function(error) {
					this.loading = false
					console.log(error);
				});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
				// _month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01";
			},
			exportExcel() {
        if (this.data.length == 0) {
        	this.openError("列表无数据，请查询")
        	return
        }
      this.$confirm('是否根据结果字段导出数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.query.columnStrs = JSON.stringify(this.tableColumns);
        this.exportExcelSure();
      }).catch(() => {
        let str = JSON.stringify(columns.info);
        let excelList = this.sortBykey(JSON.parse(str), 'index');
        this.query.columnStrs = JSON.stringify(excelList);
        this.exportExcelSure();
      });
			},
			exportExcelSure() {
        let statusStr = '';
        if(this.statusList){
          this.statusList.forEach((row) => {
            if(statusStr){
          	statusStr = statusStr + ",'" + row+"'";
            }else{
              statusStr = "'"+row+"'";
            }
          });
        }
        this.query.expenseReportStatus = statusStr;
				this.$axios.post3('/afbase/cssFinancialExpenseReport/exportExcel', this.query).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '报销单查询导出.xls'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
					this.query.columnStrs = ''; //清空掉导出的列表字段
				}).catch((error) => {this.query.columnStrs = '';});
			},
		}
	}
</script>
<style>
	.css_financial_expense_report .el-input__icon {
		line-height: 30px !important;
	}

	.css_financial_expense_report .el-form-item__content {
		line-height: 30px !important;
	}

	.css_financial_expense_report .el-input-group__prepend {
		padding: 0 6px;
	}

	.css_financial_expense_report .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.css_financial_expense_report .el-button {
		margin-top: -5px !important
	}

</style>
