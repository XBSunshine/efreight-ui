<template>
	<div class="warp-main">
		<el-form :model="query" label-width="5px" class="paymentListPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:140px;">
							<template slot="prepend">业务范畴</template>
							<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:71px;margin-right: -5px;">
								<el-option v-for="item in businessScopes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="query.customerName" clearable auto-complete="off" clearable style="width:210px;">
							<template slot="prepend">供应商</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width: 230px;" v-model="query.awbNumberOrOrderCode" clearable auto-complete="off">
							<template v-if="query.businessScope=='IO'||query.businessScope=='LC'" slot="prepend">订单/客户单号</template>
							<template v-else slot="prepend">提单/订单号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:204px;">
							<template slot="prepend">对账日期</template>
							<el-date-picker slot="suffix" v-model="query.paymentDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.paymentDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button style="padding: 9px 7px;margin-left: 0px;" type="primary" size="small" @click="queryList">查询</el-button>
						<el-button style="margin-left: 2px;padding: 9px 7px;" type="primary" size="small" @click="showSave">新增</el-button>
						<el-button style="margin-left: 2px;padding: 9px 7px;" type="primary" size="small" v-if="batchEditButtonFlag&&query.businessScope=='AE'" @click="showBatchEdit">批量对账</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="query.invoiceNum" auto-complete="off" clearable style="width:295px;">
							<template slot="prepend">发票号码</template>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="query.invoiceTitle" auto-complete="off" clearable style="width:290px;">
							<template slot="prepend">发票抬头</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:204px;">
							<template slot="prepend">发票日期</template>
							<el-date-picker slot="suffix" v-model="query.invoiceDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.invoiceDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="33px">
						<el-button style="margin-left: 7px;padding: 9px 7px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
						<el-button style="margin-left: 2px;padding: 9px 7px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:123px;">
							<template slot="prepend">币种</template>
							<el-select slot="suffix" v-model="query.currency" placeholder="请选择" style="width:82px;margin-right: -5px;">
								<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width: 240px;" v-model="query.paymentNum" clearable auto-complete="off">
							<template slot="prepend">对账单编号</template>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:334px;">
							<template slot="prepend">对账单状态</template>
							<el-select class="statusSelect" slot="suffix" multiple v-model="writeoffCompletes" style="width:251px;margin-right: -5px;">
								<el-option label="已对账" value='2'>
								</el-option>
								<el-option label="部分核销" value='0'>
								</el-option>
								<el-option label="核销完毕" value='1'>
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="query.creatorName" clearable auto-complete="off" clearable style="width:235px;">
							<template slot="prepend">对账人</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div>
			<el-table v-loading="loading" stripe :data="data" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-dropdown v-if="scope.row.paymentDate!=null" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="writeoff" v-if="scope.row.writeoffComplete!==1">核销</el-dropdown-item>
								<el-dropdown-item command="edit" v-if="scope.row.writeoffComplete==null">编辑</el-dropdown-item>
								<el-dropdown-item command="view">查看</el-dropdown-item>
								<el-dropdown-item command="export">导出</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="scope.row.writeoffComplete==null">删除</el-dropdown-item>
								<el-dropdown-item command="invoiceRemark">发票信息</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<span v-else>合计</span>
					</template>
				</el-table-column>
				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.label=='对账单编号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.label=='对账单状态'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.label=='对账日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.label=='供应商'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
					<el-table-column v-if="item.label=='对账单金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.paymentDate!=null">
								<p v-if="scope.row.currency!='CNY'" style="color: red;">{{scope.row.amountPaymentStr}}</p>
								<p v-else>{{scope.row.amountPaymentStr}}</p>
							</span>
							<span v-else v-for="(item,index) in scope.row.amountPaymentStr.split('|')" :key="index">
								<p v-if="item.indexOf('CNY')==-1">{{item.substring(0,item.indexOf('('))}}
									<font style="color: red;">({{item.substr(item.indexOf('(')+1,3)}})</font>
								</p>
								<p v-else>{{item}}</p>
							</span>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='已核销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.paymentDate!=null">
								<p v-if="scope.row.currency!='CNY'" style="color: red;">{{scope.row.amountPaymentWriteoffStr}}</p>
								<p v-else>{{scope.row.amountPaymentWriteoffStr}}</p>
							</span>
							<span v-else v-for="(item,index) in scope.row.amountPaymentWriteoffStr.split('|')" :key="index">
								<p v-if="item.indexOf('CNY')==-1">{{item.substring(0,item.indexOf('('))}}
									<font style="color: red;">({{item.substr(item.indexOf('(')+1,3)}})</font>
								</p>
								<p v-else>{{item}}</p>
							</span>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='未核销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.paymentDate!=null">
								<p v-if="scope.row.amountPaymentNoWriteoffStr.indexOf('CNY')==-1">{{scope.row.amountPaymentNoWriteoffStr.substring(0,scope.row.amountPaymentNoWriteoffStr.indexOf('('))}}
									<font style="color: red;">({{scope.row.amountPaymentNoWriteoffStr.substr(scope.row.amountPaymentNoWriteoffStr.indexOf('(')+1,3)}})</font>
								</p>
								<p v-else>{{scope.row.amountPaymentNoWriteoffStr}}</p>
							</span>
							<span v-else v-for="(item,index) in scope.row.amountPaymentNoWriteoffStr.split('|')" :key="index">
								<p v-if="item.indexOf('CNY')==-1">{{item.substring(0,item.indexOf('('))}}
									<font style="color: red;">({{item.substr(item.indexOf('(')+1,3)}})</font>
								</p>
								<p v-else>{{item}}</p>
							</span>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='对账人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<span v-if="scope.row.creatorName!=null">{{scope.row.creatorName.substring(0,scope.row.creatorName.indexOf(' '))}}</span>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='对账时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.label=='核销单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope" v-if="scope.row.writeoffNum">
							<p v-for="(item,index) in scope.row.writeoffNum.split('  ')" :key="index">
								<a href="javascript:void(0)" @click="doView2(item.split(' ')[0])" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a>
							</p>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='发票日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterInvoiceDate">
					</el-table-column>
					<el-table-column v-if="item.label=='发票号码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterInvoiceNum">
					</el-table-column>
					<el-table-column v-if="item.label=='发票抬头'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterInvoiceTitle" header-align="center">
					</el-table-column>
					<el-table-column v-if="item.label=='发票备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
				</template>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
		<viewdetail ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewdetail>
		<writeoff ref="addMission" v-if="writeoffVisible" :visible.sync="writeoffVisible" :frow="frow"></writeoff>
		<writeoffMinus ref="addMission" v-if="writeoffMinusVisible" :visible.sync="writeoffMinusVisible" :frow="frow"></writeoffMinus>
		<viewdetailWriteoff ref="addMission" v-if="viewWriteoffVisible" :visible.sync="viewWriteoffVisible" :frow="frow"></viewdetailWriteoff>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<invoiceRemark ref="addMission" v-if="invoiceRemarkVisible" :visible.sync="invoiceRemarkVisible" :frow="frow"></invoiceRemark>
		<batchEdit ref="addMission" v-if="batchEditVisible" :visible.sync="batchEditVisible" :frow="frow"></batchEdit>
	</div>
</template>
<script>
	import setVisibleVue from './payment/af_payment_setting'
	import columns from './payment/af_payment_column'
	import Save from './payment/af_payment_save'
	import Edit from './payment/af_payment_edit'
	import View from './payment/af_payment_view'
	import Writeoff from './writeoff/af_writeoff_payment_detail_list_save'
	import WriteoffMinus from './writeoff/af_writeoff_minus_save'
	import ViewdetailWriteoff from './writeoff/af_writeoff_view'
	import InvoiceRemark from './payment/af_payment_invoice_remark'
	import BatchEdit from './payment/af_payment_batch_edit'
	export default {
		data() {
			return {
				loading: false,
				data: [],
				tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				editVisible: false,
				viewVisible: false,
				saveVisible: false,
				viewWriteoffVisible: false,
				writeoffVisible: false,
				writeoffMinusVisible: false,
				invoiceRemarkVisible: false,
				batchEditVisible: false,
				batchEditButtonFlag: false,
				writeoffCompletes: ['0', '2'],
				frow: {},
				query: {
					businessScope: 'AE',
					currency: '',
					customerName: '',
					paymentDateStart: this.getDateTime(),
					paymentDateEnd: '',
					paymentNum: '',
					writeoffCompletes: '',
					awbNumberOrOrderCode: '',
					creatorName: '',
					invoiceNum: '',
					invoiceTitle: '',
					invoiceDateStart: '',
					invoiceDateEnd: '',
				},
				businessScopes: [],
				currencys: [],
				showFlag: false,
				setVisible: false,
			}
		},
		created: function() {
			//按钮权限控制
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('af_css_payment_batch_edit') > -1) {
				this.batchEditButtonFlag = true;
			}
			
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessScopes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//查询币种
			this.$axios.get('/afbase/currency').then(function(response) {
				this.currencys = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//从数据库查询设置信息
			let pageName = '财务结算管理/成本对账/对账单';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						if (af_list_column && af_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_list_column, 'index');
						}
					} else {
						this.tableColumns = this.sortBykey(columns.afPaymentInfo, 'index');
					}
				}.bind(this));
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'save': Save,
			'edit': Edit,
			'viewdetail': View,
			'writeoff': Writeoff,
			'writeoffMinus': WriteoffMinus,
			'invoiceRemark': InvoiceRemark,
			'viewdetailWriteoff': ViewdetailWriteoff,
			'batchEdit': BatchEdit
		},
		methods: {
			formatterInvoiceDate(row, column) {
				if (row.statementId) {
					return row.invoiceDate2;
				} else {
					return row.invoiceDate;
				}
			},
			formatterInvoiceNum(row, column) {
				if (row.statementId) {
					return row.invoiceNum2;
				} else {
					return row.invoiceNum;
				}
			},
			formatterInvoiceTitle(row, column) {
				if (row.statementId) {
					return row.invoiceTitle2;
				} else {
					return row.invoiceTitle;
				}
			},
			setting() {
				this.setVisible = true;
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
					localStorage.setItem(userId + '_af_payment_list_column_width', JSON.stringify(arrayC))
				}
			},
			//标题样式
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {

			},
			//标题 stly
			addCellStayle(data) {
				if (data.column.property === "incomeAmountStr") {
					let k = '';
					if (data.row.incomeAmountStr.indexOf('CNY') == -1) {
						k = "color:red;"
					} else {
						k = "color:#606266;"
					}
					return k;
				} else {
					return "";
				}
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			doView2(costWriteoffId) {
				this.frow.costWriteoffId = costWriteoffId
				this.frow.businessScope = this.query.businessScope
				this.viewWriteoffVisible = true;
			},
			handleCommand(command) {
				if (command == 'writeoff') {
					this.showWriteoff()
				} else if (command == 'save') {
					this.showSave()
				} else if (command == 'edit') {
					this.showEdit()
				} else if (command == 'view') {
					this.showView()
				} else if (command == 'delete') {
					this.doDelete()
				} else if (command == 'export') {
					this.doExport()
				} else if (command == 'invoiceRemark') {
					this.invoiceRemark()
				}
			},
			handleChange(command) {
				this.frow = command
			},
			showPrint() {
				this.printVisible = true;
			},
			showSave() {
				this.frow.businessScope = this.query.businessScope;
				this.saveVisible = true;
			},
			showBatchEdit() {
				this.frow.businessScope = this.query.businessScope;
				this.batchEditVisible = true;
			},
			showEdit() {
				this.frow.businessScope = this.query.businessScope;
				this.editVisible = true;
			},
			showView() {
				this.frow.businessScope = this.query.businessScope;
				this.viewVisible = true;
			},
			showWriteoff() {
				this.$axios.get('/afbase/cssPayment/' + this.frow.paymentId).then((response) => {
					if (response.data.code == 0) {
						this.frow = response.data.data
						if (response.data.data.amountPaymentNoWriteoff < 0) {
							this.writeoffMinusVisible = true
						} else {
							this.writeoffVisible = true
						}
					} else {
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.openError('服务器有问题，请稍后再试')
				});

			},
			invoiceRemark() {
				this.invoiceRemarkVisible = true
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
			doDelete() {
				this.$confirm('您将删除' + this.frow.paymentNum + '对账单,此操作不可恢复 , 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/cssPayment/' + this.frow.paymentId + '/' + this.frow.rowUuid).then((response) => {
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
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			doExport() {
				this.$axios.post3('/afbase/cssPayment/exportExcel', {
					"paymentId": this.frow.paymentId
				}).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '成本对账单_' + this.frow.paymentNum + '.xls'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
				}).catch((error) => {});
			},
			queryList() {

				//从数据库查询设置信息
				let pageName = '财务结算管理/成本对账/对账单';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let af_list_column = response.data.data;
						if (af_list_column && af_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.afPaymentInfo, 'index');
						}
						this.query.writeoffCompletes = this.writeoffCompletes.join()
						this.loading = true
						this.$axios.get2('/afbase/cssPayment?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
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
					}.bind(this));
			},
			queryList2(current) {
				this.$axios.get2('/afbase/cssPayment?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.query.columnStrs = JSON.stringify(this.tableColumns)
					this.exportExcelSure()
				}).catch(() => {
					let excelList = this.sortBykey(columns.afPaymentInfo, 'index')
					this.query.columnStrs = JSON.stringify(excelList)
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.query.writeoffCompletes = this.writeoffCompletes.join()
				this.$axios.post3('/afbase/cssPayment/exportPaymentExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '成本对账对账单' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			countNoWriteoffAmount(row, column) {
				if (row.amountPayment == null) {
					return ''
				} else if (row.amountPaymentWriteoff == null) {
					return row.amountPayment
				} else {
					return ''
				}
			},
			milliFormat(s) { //添加千位符
				s = s.replace(/^(\d*)$/, "$1.")
				s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1")
				s = s.replace(".", ",")
				let re = /(\d)(\d{3},)/
				while (re.test(s)) {
					s = s.replace(re, "$1,$2")
				}
				s = s.replace(/,(\d\d)$/, ".$1")
				return s.replace(/^\./, "0.")
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
			getSummaries(param) {
				console.log(param)
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					if (column.property == 'amountPaymentStr' || column.property == 'amountPaymentWriteoffStr' || column.property == 'amountPaymentNoWriteoffStr') {
						let map = {}
						data.forEach(row => {
							if (row[column.property.replace("Str", "")] != null) {
								if (map[row.currency] == null) {
									map[row.currency] = row[column.property.replace("Str", "")]
								} else {
									map[row.currency] += row[column.property.replace("Str", "")]
								}
							}
						})
						for (let key in map) {
							if (sums[index] == null) {
								sums[index] = this.getNumber(map[key]) + ' (' + key + ')'
							} else {
								sums[index] += '\n' + this.getNumber(map[key]) + ' (' + key + ')'
							}
						}
					} else {
						sums[index] = ''
					}
				});

				return sums;
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			}
		}
	}
</script>
<style>
	.paymentListPage .el-input__icon {
		line-height: 30px !important;
	}

	.paymentListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.paymentListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.statusSelect .el-select__tags {
		overflow: hidden !important;
	}
</style>
