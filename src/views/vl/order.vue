<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="orderListPage">
			<div ref="vl_order_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.orderCode" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">派车单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.truckNumber" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">车牌号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.awbNumber" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">提单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:204px;">
								<template slot="prepend">用车日期</template>
								<el-date-picker slot="suffix" v-model="query.drivingTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.drivingTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" v-if="permissionButtonForSave">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show='showFlag'>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.coopName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">车队</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:204px;">
								<template slot="prepend">接单日期</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">完成状态</template>
								<el-select slot="suffix" v-model="query.orderStatus" clearable placeholder="请选择" style="width:131px;margin-right: -5px;">
									<el-option label="已完成" value="已完成"></el-option>
									<el-option label="未完成" value="未完成"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="38px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList" v-if="exportButtonFlag">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" :data="data" border :summary-method="getSummaries" show-summary ref="table" stripe class="table_settle" highlight-current-row :max-height="tableHeight" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
			<el-table-column label="操作" align="center" fixed width="60">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item></el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForView" command="view">查看订单</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForEdit&&scope.row.orderStatus != '强制关闭' && scope.row.orderStatus != '完成订单'" command="edit">编辑订单</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForFile" command="upload">上传附件</el-dropdown-item>
							<el-dropdown-item  command="intoArea">车辆入区</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForTwoCode" command="twoCode">二维码</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForDocumentPrint">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">打印单据<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item v-if="permissionButtonForPrint" command="printOrder">打印车单</el-dropdown-item>
										<el-dropdown-item v-if="permissionButtonForAccountBill" command="exportAccountBill">导出核算单</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForFinish" command="finish">完成车单</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForForceStop" command="forceStop">强制关闭</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>

			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label!='派车单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-else :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div class="pagination" ref="vl_order_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
		<viewDetail ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewDetail>
		<finish ref="addMission" v-if="finishVisible" :visible.sync="finishVisible" :frow="frow"></finish>
		<forceStop ref="addMission" v-if="forceStopVisible" :visible.sync="forceStopVisible" :frow="frow"></forceStop>
		<intoAreaVisible ref="addMission" v-if="intoAreaVisible" :visible.sync="intoAreaVisible" :frow="frow"></intoAreaVisible>
	</div>
</template>
<script>
	import Save from './order/main/order_save'
	import Edit from './order/main/order_edit'
	import View from './order/main/order_view'
	import Finish from './order/main/component_view/order_finish_orderinfo'
	import setVisibleVue from './order/main/vl_order_setting.vue'
	import columns from './order/json/vl_order_column.json'
	import ForceStop from './order/other/order_force_stop'
	import intoAreaVisible from './intoArea/intoArea_tabs'

	export default {
		data() {
			return {
				tableHeight: '550px',
				permissionButtonForSave: false,
				permissionButtonForView: false,
				permissionButtonForEdit: false,
				permissionButtonForDocumentPrint: false,
				permissionButtonForPrint: false,
				permissionButtonForAccountBill: false,
				permissionButtonForFile: false,
				permissionButtonForLog: false,
				permissionButtonForTwoCode: false,
				permissionButtonForForceStop: false,
				permissionButtonForFinish: false,
				exportButtonFlag: false,
				data: [],
				tableColumns: [],
				total: null,
				pageConf: {
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100, 500] //分页选项
				},
				query: {
					orderCode: '',
					truckNumber: '',
					awbNumber: '',
					drivingTimeStart: this.getDateTime(),
					drivingTimeEnd: '',
					coopName: '',
					customerNumber: '',
					createTimeStart: '',
					createTimeEnd: '',
					orderStatus: '未完成',
					columnStrs: ''
				},
				saveVisible: false,
				editVisible: false,
				viewVisible: false,
				finishVisible: false,
				intoAreaVisible:false,
				showFlag: false,
				printAmountBillVisible: false,
				printAmountBillMoreVisible: false,
				amountBillSendVisible: false,
				amountBillSendListVisible: false,
				setVisible: false,
				orderLetterVisible: false,
				frow: {},
				currRow: '',
				loading: false,
				forceStopVisible: false,
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'save': Save,
			'edit': Edit,
			'viewDetail': View,
			'finish': Finish,
			'intoAreaVisible': intoAreaVisible,
			'forceStop': ForceStop
		},
		provide() {
			return {
				findByPage: this.findByPage,
				shareTwoCode: this.shareTwoCode,
				deliveryNoticeShare: this.deliveryNoticeShare,
			}
		},
		methods: {
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let vl_order_header = this.$refs.vl_order_header.offsetHeight;
					let vl_order_footer = this.$refs.vl_order_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - vl_order_header - vl_order_footer;
					this.tableHeight = heightS + "px";
				});
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
					localStorage.setItem(userId + '_vl_order_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.setVisible = true;
			},
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (column.property === "orderCode") {
					return "awbNumber"
				} else if (column.property === "incomeRecorded") {
					let k = '';
					if (row.incomeRecorded || (row.incomeStatus != null && row.incomeStatus != '未录收入')) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "costRecorded") {
					let k = '';
					if (row.costRecorded || (row.costStatus != null && row.costStatus != '未录成本')) {
						k = "duihao_af duihao_icn "
					}
					return k;
				} else {
					return ""
				}
			},
			addCellStayle(data) {
				if (data.column.property === "incomeRecorded") {
					let k = '';
					if (data.row.incomeRecorded) {
						k = "color:#67C23A;"
					} else if (data.row.incomeStatus != null && data.row.incomeStatus != '未录收入') {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "costRecorded") {
					let k = '';
					if (data.row.costRecorded) {
						k = "color:#67C23A;"
					} else if (data.row.costStatus != null && data.row.costStatus != '未录成本') {
						k = "color:red;"
					}
					return k;
				} else {
					return "";
				}
			},
			formatter_column(row, column) {
				return row[column.property];
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'view') {
					this.showView(this.currRow)
				} else if (command == 'forceStop') {
					this.doForceStop(this.currRow)
				} else if (command == 'upload') {
					this.showOrderFiles(this.currRow)
				} else if (command == 'printOrder') {
					this.printOrder(this.currRow)
				} else if (command == 'exportAccountBill') {
					this.exportAccountBill(this.currRow)
				} else if (command == 'twoCode') {
					this.showTwoCode(this.currRow)
				} else if (command == 'finish') {
					this.finish(this.currRow)
				} else if (command == 'intoArea') {
					this.intoArea(this.currRow)
				}
			},
			showsave() {
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.jumpToNewPage('save', {
						"ifFullscreen": true
					})
				} else {
					this.frow.ifFullscreen = false
					this.saveVisible = true;
				}
			},
			showedit(row) {
				this.frow = row
				this.frow.permissionButtonForEdit = this.permissionButtonForEdit
				this.frow.permissionButtonForFile = this.permissionButtonForFile
				this.frow.permissionButtonForLog = this.permissionButtonForLog
				this.frow.jumpToTab = 'first'
				this.frow.viewFlag = true
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true
				}
			},
			showView(row) {
				this.frow = row
				this.frow.jumpToTab = 'first'
				this.frow.viewFlag = false
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('view', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.viewVisible = true
				}
			},
			doForceStop(row) {
				this.frow = row;
				this.forceStopVisible = true
			},
			finish(row) {
				this.$axios.get('/sc/vlOrder/' + row.orderId).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data && response.data.data.orderStatus == '创建订单') {
							this.frow = row
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.frow.ifFullscreen = true
								this.jumpToNewPage('finish', this.frow)
							} else {
								this.frow.ifFullscreen = false
								this.finishVisible = true
							}
						} else {
							this.openError("当前订单无法执行完成操作")
						}
					} else {
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
				})

			},
			intoArea(row) {
				this.frow = row
				this.frow.jumpToTab = 'first'
				this.intoAreaVisible = true
			},
			showOrderFiles(row) {
				this.frow = row
				this.frow.jumpToTab = 'second'
				if (row.orderStatus == '完成订单') {
					this.frow.viewFlag = false
				} else {
					this.frow.viewFlag = true
					this.frow.permissionButtonForEdit = this.permissionButtonForEdit
					this.frow.permissionButtonForFile = this.permissionButtonForFile
					this.frow.permissionButtonForLog = this.permissionButtonForLog
				}
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					if (row.orderStatus == '完成订单') {
						this.jumpToNewPage('view', this.frow)
					} else {
						this.jumpToNewPage('edit', this.frow)
					}
				} else {
					this.frow.ifFullscreen = false
					if (row.orderStatus == '完成订单') {
						this.viewVisible = true
					} else {
						this.editVisible = true
					}
				}
			},
			printOrder(row) {
				this.openError("功能暂未开通，敬请期待...")
			},
			exportAccountBill(row) {
				this.openError("功能暂未开通，敬请期待...")
			},
			showTwoCode(row) {
				this.openError("功能暂未开通，敬请期待...");
			},
			findByPage() {
				this.query.columnStrs = '';
				this.setHeight();
				//从数据库查询设置信息
				let pageName = '订单操作管理/国内运输/车辆配载';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let vl_list_column = response.data.data;
						if (vl_list_column && vl_list_column.length > 0) {
							this.tableColumns = this.sortBykey(vl_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.vlInfo, 'index');
						}
						this.loading = true
						this.$axios.get2("/sc/vlOrder?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
							.then((response) => {
								if (response.data.code == 0) {
									this.data = response.data.data.records;
									this.pageConf.totalPage = response.data.data.total;
									if (this.data.length == 0) {
										let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
										this.findByPage2(current);
									} else {
										this.loading = false
									}
								} else {
									this.loading = false
									this.openError(response.data.messageInfo)
								}
							}).catch((error) => {
								this.loading = false
								this.openError(error.response.data.messageInfo)
							})

						this.$axios.get2("/sc/vlOrder/total", this.query)
							.then(function(response) {
								this.total = response.data.data;
								this.getSummaries();
							}.bind(this));
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/sc/vlOrder?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then((response) => {
						this.loading = false
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					})
			},
			exportExcelList() {
				if (this.data.length == 0) {
					this.openError("查询结果列表为空，不允许导出")
					return;
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
					this.query.columnStrs = JSON.stringify(columns.vlInfo);
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/sc/vlOrder/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '派车单' + '.xls'; // 下载后文件名
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
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			},
			formatDate(row, column) {
				if (row[column.property]) {
					return (row[column.property]).substr(0, 10)
				} else {
					return ""
				}

			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
        if (_month === 0) {
            _year = parseInt(_year) - 1;
            _month = 12;
        }
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01 00:00:00";
			},
			formatQWF(data) {
				return data.toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getSummaries(param) {
				const sums = [];
				sums[0] = "合计";
				let loaclJsonArray = this.tableColumns;
				if (loaclJsonArray) {
					for (let i = 0; i < loaclJsonArray.length; i++) {
						if (this.total != null) {

							if (loaclJsonArray[i].prop === "weightStr") {
								sums[i + 1] = this.total.weightStr
							}
							if (loaclJsonArray[i].prop === "volumeStr") {
								sums[i + 1] = this.total.volumeStr
							}
						}
					}
				}
				return sums;
			},
			init() {
				//按钮权限
				let buttonInfo = window.localStorage.getItem('buttonInfo')
				let buttonPermission = JSON.parse(buttonInfo)
				if (buttonInfo.indexOf('vl_order_save') > -1) {
					this.permissionButtonForSave = true
				}
				if (buttonInfo.indexOf('vl_order_view') > -1) {
					this.permissionButtonForView = true
				}
				if (buttonInfo.indexOf('vl_order_edit') > -1) {
					this.permissionButtonForEdit = true
				}
				if (buttonInfo.indexOf('vl_order_file') > -1) {
					this.permissionButtonForFile = true
				}
				if (buttonInfo.indexOf('vl_order_log') > -1) {
					this.permissionButtonForLog = true
				}
				if (buttonPermission.some(item => item == 'vl_order_twoCode')) {
					this.permissionButtonForTwoCode = true
				}
				if (buttonInfo.indexOf('vl_order_forceStop') > -1) {
					this.permissionButtonForForceStop = true
				}
				if (buttonInfo.indexOf('vl_order_finish') > -1) {
					this.permissionButtonForFinish = true
				}
				if (buttonInfo.indexOf('vl_order_document_print') > -1) {
					this.permissionButtonForDocumentPrint = true
				}
				if (buttonInfo.indexOf('vl_order_accountbillExport') > -1) {
					this.permissionButtonForAccountBill = true
				}
				if (buttonInfo.indexOf('vl_order_print') > -1) {
					this.permissionButtonForPrint = true
				}
				if (buttonInfo.indexOf('vl_order_export') > -1) {
					this.exportButtonFlag = true
				}
			},
			cellClick(row) {
				if (this.permissionButtonForEdit && row.orderStatus != '完成订单' && row.orderStatus != '强制关闭') {
					this.showedit(row)
				} else if (this.permissionButtonForView) {
					this.showView(row)
				} else {
					this.openError("您无权访问")
				}
			},
			jumpToNewPage(name, frow) {
				let param = {
					flag: true,
					name: name,
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: "/vl_order",
					query: param
				});
				window.open(routeUrl.href, '_blank');
			},
			base64Encode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
				let output = "";
				let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				let i = 0;
				input = this.utf8Encode(input);
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output +
						_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
						_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
				}
				return output;
			},
			base64Decode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
				let output = "";
				let chr1, chr2, chr3;
				let enc1, enc2, enc3, enc4;
				let i = 0;
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				while (i < input.length) {
					enc1 = _keyStr.indexOf(input.charAt(i++));
					enc2 = _keyStr.indexOf(input.charAt(i++));
					enc3 = _keyStr.indexOf(input.charAt(i++));
					enc4 = _keyStr.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
				}
				output = this.utf8Decode(output);
				return output;
			},
			utf8Decode(utftext) {
				let string = "";
				let i = 0
				let c = 0
				let c1 = 0
				let c2 = 0
				while (i < utftext.length) {
					c = utftext.charCodeAt(i);
					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					} else if ((c > 191) && (c < 224)) {
						c1 = utftext.charCodeAt(i + 1);
						string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
						i += 2;
					} else {
						c1 = utftext.charCodeAt(i + 1);
						c2 = utftext.charCodeAt(i + 2);
						string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
						i += 3;
					}
				}
				return string;
			},
			utf8Encode(string) {
				string = string.replace(/\r\n/g, "\n");
				let utftext = "";
				for (let n = 0; n < string.length; n++) {
					let c = string.charCodeAt(n);
					if (c < 128) {
						utftext += String.fromCharCode(c);
					} else if ((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					} else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}

				}
				return utftext;
			}
		},
		created() {
			//从数据库查询设置信息
			let pageName = '订单操作管理/国内运输/车辆配载';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let vl_list_column = response.data.data;
					if (vl_list_column && vl_list_column.length > 0) {
						this.tableColumns = this.sortBykey(vl_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.vlInfo, 'index');
					}
				}.bind(this));
			if (this.$route.query.flag) {
				if (this.$route.query.name == 'view') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.viewVisible = true;
				} else if (this.$route.query.name == 'edit') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.editVisible = true;
				} else if (this.$route.query.name == 'save') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.saveVisible = true;
				} else if (this.$route.query.name == 'finish') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.finishVisible = true;
				} else {
					this.init()
				}
			} else {
				this.init()
			}
		},
		mounted() {
			this.setHeight();
		}

	}
</script>
<style>
	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px;
	}

	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.afOrderListPageCheckBox .el-checkbox__inner {
		background-color: #FFF !important;
	}

	.awbNumber {
		text-decoration: underline;
	}

	.duihao_af {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		display: "table-cell" !important;
	}

	.duihao_icn :before {
		content: "\E608";
	}
</style>
