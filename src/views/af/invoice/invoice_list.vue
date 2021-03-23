<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="invoiceListPage">
			<div ref="invoice_list_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope"  style="width:112px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
          	<el-form-item label="" label-width="10px">
          		<el-input style="width:210px;">
          			<template slot="prepend">发票状态</template>
          			<el-select slot="suffix" v-model="query.invoiceStatusStr"  style="width:141px;margin-right: -5px;" clearable>
                  <el-option label="待开票" value="待开票"></el-option>
                  <el-option label="部分开票" value="部分开票"></el-option>
                  <el-option label="开票完毕" value="开票完毕"></el-option>
                  <el-option label="部分核销" value="部分核销"></el-option>
                  <el-option label="核销完毕" value="核销完毕"></el-option>
                   <el-option label="未核销完毕" value="未核销完毕"></el-option>
          			</el-select>
          		</el-input>
          	</el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerName" maxlength="200"  auto-complete="off" clearable style="width:300px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">
									<span>申请日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>

						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.creatorName" maxlength="50" auto-complete="off" clearable style="width:180px;">
								<template slot="prepend">申请人</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.invoiceNum" maxlength="50" auto-complete="off" clearable style="width:260px;" >
								<template slot="prepend">发票号</template>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
          	<el-form-item label-width="10px">
          		<el-input class="widthWithThree" v-model="query.invoiceTitle" maxlength="50" auto-complete="off" clearable style="width:250px;" >
          			<template slot="prepend">发票抬头</template>
          		</el-input>
          	</el-form-item>
          </el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">开票日期</template>
								<el-date-picker slot="suffix" v-model="query.openInvoiceTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.openInvoiceTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="38px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.openInvoiceUserName" maxlength="50" auto-complete="off" clearable style="width:180px;">
								<template slot="prepend">开票人</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">发票类型</template>
								<el-select slot="suffix" v-model="query.invoiceType" style="width:141px;margin-right: -5px;" clearable>
					        <el-option v-for="item in invoiceTypeList" :key="item.param_ranking" :label="item.param_text" :value="item.param_text">
                  </el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.orderAwbNumber" maxlength="50" auto-complete="off" clearable style="width:210px;" >
								<template slot="prepend">主单/订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
          	<el-form-item label-width="10px">
          		<el-input class="widthWithThree" v-model="query.businessNum" maxlength="50" auto-complete="off" clearable style="width:210px;" >
          			<template slot="prepend">账单/清单号</template>
          		</el-input>
          	</el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">发票日期</template>
								<el-date-picker slot="suffix" v-model="query.invoiceDateStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.invoiceDateEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
    <!-- v-if="mapInfo&&mapInfo.size>0" -->
    <div style="margin: 1px 10px 10px 10px;" >
         <el-row  :gutter="2">
             <el-col :span="1" align="left"><span>勾选合计:</span></el-col>
             <el-col v-for="(item,index) in mapInfo" :key="index" :span="2">
               <span :class="{currencyRedColor:item[0]!='CNY'}">{{amountFormat(item[1],item[0])}}</span>
             </el-col>
         </el-row>
    </div>
		<div>
			<el-table :indent="0" v-loading="loading" stripe :data="data"   border highlight-current-row @selection-change="handleSelectionChange" :max-height="tableHeight" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column fixed type="selection" align="center" width="50">
				</el-table-column>
        <el-table-column fixed type="index" align="center" label="操作" width="50">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-if="openInvoiceFlag" command="openInvoice">开票</el-dropdown-item>
                <el-dropdown-item v-if="reviewInvoiceFlag" command="reviewInvoice" >核销</el-dropdown-item>
                <el-dropdown-item v-if="deleteInvoiceFlag" command="deleteInvoice" >删除</el-dropdown-item>
                <el-dropdown-item v-if="cancelInvoiceFlag" command="cancelInvoice" >退回</el-dropdown-item>
                <el-dropdown-item v-if="invoiceFilesFlag"  command="invoiceFiles" >附件</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<template v-for="(item,index) in tableColumns">
          <el-table-column v-if="item.label=='账单/清单金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          	<template slot-scope="scope">
          		<p v-for="(item,index) in scope.row.busniessAmount.split('  ')" :key="index">
                <font v-if="item.indexOf('CNY')>0">{{item}}</font>
                <font v-else style="color: red;">{{item}}</font>
          		</p>
          	</template>
          </el-table-column>
					<el-table-column  v-else-if="item.label=='发票金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
            <template slot-scope="scope">
            		<font v-if="scope.row.currency=='CNY'">{{amountFormat(scope.row.amount,scope.row.currency)}}</font>
            		<font v-else style="color: red;">{{amountFormat(scope.row.amount,scope.row.currency)}}</font>
            </template>
					</el-table-column>
          <el-table-column  v-else-if="item.label=='已核销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
            <template slot-scope="scope">
            		<span>{{getNumber(scope.row.amountWriteoff)}}</span>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.label=='未核销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
            <template slot-scope="scope">
            		<span>{{getNumber(scope.row.amountWriteoffNo)}}</span>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.label=='申请人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
            <template slot-scope="scope">
            		<span>{{nameFormat(scope.row.creatorName)}}</span>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.label=='开票人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
            <template slot-scope="scope">
            		<span>{{nameFormat(scope.row.openInvoiceUserName)}}</span>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.label=='附件'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
            <template slot-scope="scope" v-if="scope.row.files">
                <p v-for="(item,index) in scope.row.files.split('  ')" :key="index">
                  <a href="javascript:void(0)" @click="orderFileView(item.split(' ')[0])" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a>
                </p>
            </template>
          </el-table-column>
          <el-table-column  v-else :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" >
          </el-table-column>
				</template>

			</el-table>
		</div>
		<div ref="invoice_list_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    <invoiceVisibleTag ref="addMission" v-if="invoiceVisible" :visible.sync="invoiceVisible" :frow="frow"></invoiceVisibleTag>
    <reviewVisibleTag ref="addMission" v-if="reviewVisible" :visible.sync="reviewVisible" :frow="frow"></reviewVisibleTag>
    <settingVisibleTag ref="addMission" v-if="settingVisible" :visible.sync="settingVisible" :frow="frow"></settingVisibleTag>
    <invoiceFilesTag ref="addMission" v-if="invoiceFilesVisible" :visible.sync="invoiceFilesVisible" :frow="frow"></invoiceFilesTag>
	</div>
</template>
<script>
	import columns from './invoice_list_column.json'
  import invoice from './openInvoiceTwo.vue'
  import review from './invoice_writeoff.vue'
  import setting from './invoice_list_setting.vue'
  import invoiceFiles from './invoice_files.vue'
	export default {
		data() {
			return {
				tableHeight: '800px',
				loading: false,
				data: [],
				tableColumns: [],
        invoiceTypeList:[],
        mapInfo:null,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50]
				},
        invoiceVisible:false,
        reviewVisible:false,
        settingVisible:false,
        openInvoiceFlag:false,
        reviewInvoiceFlag:false,
        deleteInvoiceFlag:false,
        cancelInvoiceFlag:false,
        invoiceFilesFlag:false,
        invoiceFilesVisible:false,
        columnStrs:'',
				frow: {},
				query: {
					businessScope:'AE',
					invoiceStatusStr:'待开票',
					customerName:'',
					createTimeStart:this.getDateTime(new Date()),
					createTimeEnd:'',
					creatorName:'',
					invoiceNum:'',
					businessNum:'',
					openInvoiceTimeStart:'',
					openInvoiceTimeEnd:'',
					openInvoiceUserName:'',
					invoiceType:'',
					orderAwbNumber:'',
					invoiceDateStart:'',
					invoiceDateEnd:'',
          invoiceTitle:'',
          columnStrs:''
				},
				businessCodes: [],
				showFlag: false
			}
		},
		created: function() {
      this.columnStrs = JSON.stringify(columns.info);
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('af-invoice-open') > -1) {
				this.openInvoiceFlag = true;
			}
      if (buttonInfo.indexOf('af-invoice-writeoff') > -1) {
      	this.reviewInvoiceFlag = true;
      }
      if (buttonInfo.indexOf('af-invoice-delete') > -1) {
      	this.deleteInvoiceFlag = true;
      }
      if (buttonInfo.indexOf('af-invoicep-cencel') > -1) {
      	this.cancelInvoiceFlag = true;
      }
      if (buttonInfo.indexOf('af-invoicep-files') > -1) {
      	this.invoiceFilesFlag = true;
      }

			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
      this.$axios.get2('/afbase/vAfCategory/invoiceType').then((response) => {
        //发票类型
        this.invoiceTypeList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
			// this.setServiceOptions();
			// this.query.flightDateEnd = this.getDateTime(new Date());

			//从数据库查询设置信息
			let pageName = '财务结算管理/收入对账/发票';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let invoice_list_column = response.data.data;
					if (invoice_list_column && invoice_list_column.length > 0) {
						this.tableColumns = this.sortBykey(invoice_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.info, 'index');
					}
					this.tableColumns = this.setLabel(this.tableColumns);
				}.bind(this));
		},
		mounted() {
			this.setHeight();
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
      'invoiceVisibleTag':invoice,
      'reviewVisibleTag':review,
      'settingVisibleTag':setting,
      'invoiceFilesTag':invoiceFiles
		},
		methods: {
      orderFileView(fileUrl) {
      	window.open(fileUrl)
      },
      handleSelectionChange(val){
        let  map = new Map();
          if(val&&val.length>0){
              val.forEach(function(item, index) {
                     if(!item.amount){
                        return ;
                     }
　　　　　　　　　　　if(map&&map.size>0){
                         if(map.has(item.currency)){
                             map.set(item.currency,map.get(item.currency)+item.amount)
                         }else{
                           map.set(item.currency,item.amount)
                         }
                      }else{
                        map.set(item.currency,item.amount)
                      }
　　　　　　  });
            this.mapInfo = map;
          }else{
            this.mapInfo = null
          }
      },
      nameFormat(name){
        if(name){
         return name.split(" ")[0];
        }else{
          return "";
        }
      },
      amountFormat(amount,currency){
        if(amount){
           return this.getNumber(amount)+"("+currency+")";
        }else{
          return "";
        }
      },
       //cancelInvoice
       cancelInvoice(row){
         // if(row.invoiceStatus==-1){
           let checkName = "";
           if(row.debitNoteId){
              checkName = "debitNoteId";
           }else{
             checkName = "statementId";
           }
            this.$confirm('请确认 是否撤销开票申请？', '提示', {
            	confirmButtonText: '是',
            	cancelButtonText: '否',
            	type: 'warning',
            	center: true
            }).then(() => {
            	this.$axios.deletes('/afbase/cssIncomeInvoice/'+checkName+'/'+ (row.debitNoteId|row.statementId)+'/'+row.businessRowUuid).then((response) => {
            		if (response.data.code == '0') {
            			this.openSuccess("撤销成功！")
            			this.queryList();
            		} else {
            			this.openError("撤销失败：" + response.data.messageInfo)
            		}
            	}).catch((error) => {
            		this.openError("撤销失败：" + error.response.data.messageInfo)
            	});
            }).catch(() => {
            	this.$message({
            		type: 'info',
            		message: '已取消撤销'
            	});
            });
         // }else{
         //    this.openError("您好，未开发票 才可 撤销开票申请。");
         // }
       },

      //invoice
      openInvoice(){
         // this.$axios.get2('/afbase/debitNote/selectCheckDebit', {
         // 	debitNoteIds: this.frow.debitNoteId
         // }).then(function(response) {
         // 	let checkFlag = true;
         // 	if (response.data.data && response.data.data.length > 0) {
         // 		response.data.data.forEach((debitNote) => {
         //       if(debitNote.invoiceId || debitNote.statementId){
         //         this.openError("您好，账单号" + debitNote.debitNoteNum + "已做 开票申请 或 已开票 ，不能重复申请！");
         //         checkFlag = false;
         //         return false;
         //       }
         // 		});
         // 	}
         // 	if (checkFlag) {
         //    this.frow.invoiceType = 'debitNote';
         // 		this.invoiceVisible = true;
         // 	}
         // }.bind(this));
         this.invoiceVisible = true;
      },
      reviewInvoice(){
        if(this.frow.invoiceDetailId){
          this.$axios.get2('/afbase/cssIncomeInvoiceDetail/view/' + this.frow.invoiceDetailId)
          	.then(function(response) {
              if(response.data.data&&response.data.data.invoiceDetailId){
                if(response.data.data.writeoffComplete!=1){
                  this.frow.amount = response.data.data.amount;
                  this.frow.amountWriteoff = response.data.data.amountWriteoff;
                  this.reviewVisible = true;
                }else{
                  this.openError("您好，您选择的发票已核销完毕");
                }
              }else{
                this.openError("您好，发票号"+this.frow.invoiceNum+"信息异常");
              }
          	}.bind(this));
        }else{
           this.openError("未开票不能核销");
        }
     },
     deleteInvoice(row){
         if(row.invoiceDetailId){
            this.$confirm('您好，删除发票号'+row.invoiceNum+' ，是否继续？', '提示', {
            	confirmButtonText: '是',
            	cancelButtonText: '否',
            	type: 'warning',
            	center: true
            }).then(() => {
            	this.$axios.deletes('/afbase/cssIncomeInvoiceDetail/' + row.invoiceDetailId+'/'+row.rowUuid).then((response) => {
            		if (response.data.code == '0') {
            			this.openSuccess("删除成功！")
            			this.queryList();
            		} else {
            			this.openError("删除失败：" + response.data.messageInfo)
            		}
            	}).catch((error) => {
            		this.openError("删除失败：" + error.response.data.messageInfo)
            	});
            }).catch(() => {
            });
         }else{
           // if(row.invoiceNum){
           //   this.openError("您好，发票号 "+row.invoiceNum+"，已核销 或 未开票 不允许 删除。")
           // }else{
             this.openError("您好,账单/清单号 "+row.businessNum+"未开票 不允许 删除。")
             this.queryList();
           // }
         }
     },
     invoiceFiles(){
       if(this.frow.invoiceDetailId){
          this.frow.businessType='invoice';
          this.frow.invoiceDetailWriteoffId = null;
          this.invoiceFilesVisible = true;
       }else{
         this.openError("您好，开票后才可上传发票附件。")
       }
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
					localStorage.setItem(userId + '_invoice_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.settingVisible = true;
				this.frow.businessScope = this.query.businessScope
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let invoice_list_header = this.$refs.invoice_list_header.offsetHeight;
					let invoice_list_footer = this.$refs.invoice_list_footer.offsetHeight;
					let heightS = window.innerHeight - 165 - invoice_list_header - invoice_list_footer;
					this.tableHeight = heightS + "px";
				});
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return ""
			},
			//标题 style
			addCellStayle(data) {
				return "";
			},
      //时间
      getDateTime(theDate) {
      	var _year = theDate.getFullYear();
      	var _month = theDate.getMonth();
      	var _date = theDate.getDate();
      	_month = _month + 1;
        if(_month==13){
          _month = 1;
        }
      	if (_month < 10) {
      		_month = "0" + _month;
      	}
      	if (_date < 10) {
      		_date = "0" + _date;
      	}
      	return _year + "-" + _month + "-" + _date+" 00:00:00";
      },
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			handleCommand(command) {
			 if(command == 'cancelInvoice'){
          this.cancelInvoice(this.frow);
        }else if(command == 'openInvoice'){
           this.openInvoice();
        }else if(command == 'reviewInvoice'){
           this.reviewInvoice();
        }else if(command == 'deleteInvoice'){
           this.deleteInvoice(this.frow);
        }else if(command == 'invoiceFiles'){
           this.invoiceFiles();
        }

			},
			handleChange(command) {
				this.frow = command
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

			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					//从数据库查询设置信息
					let pageName = '财务结算管理/收入对账/发票';
					this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
						.then(function(response) {
							let invoice_list_column = response.data.data;
							if (invoice_list_column && invoice_list_column.length > 0) {
								this.query.columnStrs = JSON.stringify(invoice_list_column);
							} else {
								this.query.columnStrs = this.columnStrs;
							}
							this.exportExcelSure();
						}.bind(this));
				}).catch(() => {
					this.query.columnStrs = this.columnStrs;
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/afbase/cssIncomeInvoice/exportExcelList', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '收入对账发票列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			queryList() {
				this.query.columnStrs = '';
				this.setHeight()
				//从数据库查询设置信息
				let pageName = '财务结算管理/收入对账/发票';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let invoice_list_column = response.data.data;
						if (invoice_list_column && invoice_list_column.length > 0) {
							this.tableColumns = this.sortBykey(invoice_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.info, 'index');
						}
						this.loading = true

						this.tableColumns = this.setLabel(this.tableColumns);

						this.$axios.get2('/afbase/cssIncomeInvoice/invoiceList?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
							if (this.data.length == 0) {
								let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
								this.queryList2(current);
							} else {
                this.handleSelectionChange(null);
								this.allCheck = false
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}.bind(this));
			},
			queryList2(current) {
				this.$axios.get2('/afbase/cssIncomeInvoice/invoiceList?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					// this.data.forEach((row) => {
					// 	if (row.isParent == true) {
					// 		this.expandRowKeys.push(row.debitNoteId)
					// 	}
					// })
          this.handleSelectionChange(null);
					this.selectionData = []
					this.allCheck = false
					this.loading = false
				}).catch((error) => {
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
			formatter_creatorName(row, column) {
				if (row.creatorName) {
					return row.creatorName.split(' ')[0];
				}
			},

			getNumber(data) {
        if(data){
          return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }else{
          return "";
        }

			},

			setLabel(tableColumns) {
	       // todo
        return tableColumns;
			}
		}
	}
</script>
<style type="text/css">
	.invoiceListPage .el-input__icon {
		line-height: 30px !important;
	}

	.invoiceListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.invoiceListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.invoiceListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}
  .currencyRedColor{
  	color: red !important;
  }

</style>
