<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="orderLockUnlockList">
			<div ref="af_order_lock_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:155px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:86px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:159px;">
								<template slot="prepend">是否锁账</template>
								<el-select slot="suffix" v-model="query.orderStatus" style="width:92px;margin-right: -5px;">
									<el-option label="全部" value="全部">
									</el-option>
									<el-option label="是" value="是">
									</el-option>
									<el-option label="否" value="否">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:159px;">
								<template slot="prepend">收入完成</template>
								<el-select slot="suffix" v-model="query.incomeFinishStatus" clearable placeholder="请选择" style="width:92px;margin-right: -5px;">
									<el-option label="是" :value=true>
									</el-option>
									<el-option label="否" :value=false>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:159px;">
								<template slot="prepend">成本完成</template>
								<el-select slot="suffix" v-model="query.costFinishStatus" clearable placeholder="请选择" style="width:92px;margin-right: -5px;">
									<el-option label="是" :value=true>
									</el-option>
									<el-option label="否" :value=false>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 290px;" v-model="query.coopName" clearable auto-complete="off">
								<template slot="prepend">客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
							<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
							<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-if="orderBillFinish" v-on:click="showLock">财务锁账</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 205px;" v-model="query.orderCode" clearable auto-complete="off">
								<template slot="prepend">订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 205px;" v-model="query.awbNumber" clearable auto-complete="off">
								<template slot="prepend">
									<span v-if="query.businessScope=='IO'||query.businessScope=='LC'">客户单号</span>
									<span v-else>提单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope!='TE' && query.businessScope!='LC'&& query.businessScope!='IO'">
						<el-form-item>
							<el-input style="width: 175px;" v-model="query.flightNo" clearable auto-complete="off">
								<template v-if="query.businessScope.startsWith('A')" slot="prepend">航班号</template>
								<template v-else slot="prepend">航次号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:202px;">
								<template v-if="query.businessScope.endsWith('E')&&query.businessScope!=='TE'" slot="prepend">离港日期</template>
								<template v-if="query.businessScope.endsWith('I')" slot="prepend">到港日期</template>
								<template v-if="query.businessScope=='TE'" slot="prepend">发车日期</template>
								<template v-if="query.businessScope=='LC'" slot="prepend">用车日期</template>
								<template v-if="query.businessScope=='IO'" slot="prepend">业务日期</template>
								<el-date-picker slot="suffix" style="width: 133px;margin-right: -5px;" v-model="query.flightDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker style="width: 133px" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item v-if="query.businessScope!='TE'&&query.businessScope!='LC'&&query.businessScope!='IO'" label-width="38px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
						</el-form-item>
						<el-form-item v-if="query.businessScope=='TE' || query.businessScope=='LC'|| query.businessScope=='IO'" label-width="223px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" :data="data" border ref="table" stripe class="table_settle" highlight-current-row :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth" @selection-change="handleSelectionChange" :max-height="tableHeight">
			<el-table-column fixed type="selection" align="center" width="50">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed width="60">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="rollBackToFinishIncome">退回收入完成</el-dropdown-item>
							<el-dropdown-item command="rollBackToFinishCost">退回成本完成</el-dropdown-item>
							<el-dropdown-item v-if="orderBillCancel && scope.row.orderLockStatus" command="unLock">财务解锁</el-dropdown-item>
							<el-dropdown-item command="printBusinessCalculationBill">核算单预览</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>

			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label=='订单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.prop=='incomeFinishStatus'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortIncomeRecorded">
				</el-table-column>
				<el-table-column v-else-if="item.prop=='costFinishStatus'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostRecorded">
				</el-table-column>
				<el-table-column v-else-if="item.prop=='incomeAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-else-if="item.prop=='costAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-else-if="item.prop=='profitAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-else-if="item.prop=='salesName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-else-if="item.prop=='servicerName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>
			</template>
		</el-table>
		<div class="pagination" ref="af_order_lock_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<el-dialog title="财务日期" width="300px" :visible="lockVisible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="closeLock">
			<el-form label-width="50px" class="demo-ruleForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="日期">
							<el-date-picker style="width: 133px;" v-model="lockDate" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :offset="1" :span="2">
						<el-form-item>
							<el-button type="primary" size="mini" @click="confirmLock">确认</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="frow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="frow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="frow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="frow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="frow"></viewVisibleTagTE>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="frow"></viewVisibleTagLC>
		<viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="frow"></viewVisibleTagIO>
	</div>
</template>
<script>
	import setVisibleVue from './orderLockUnlockList/order_lock_unlock_list_setting.vue'
	import columns from './orderLockUnlockList/order_lock_unlock_list_column.json'
	import viewVisibleVueAE from './order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from './ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '../sc/si/order/main/order_view.vue'
	import viewVisibleVueTE from '../tc/te/order/main/order_view.vue'
	import viewVisibleVueLC from '../lc/order/main/order_view.vue'
	import viewVisibleVueIO from '../io/order/main/order_view.vue'
	export default {
		data() {
			return {
				businessCodes: [],
				/*表数据*/
				data: [],
				tableColumns: [],
				multipleSelection: [],
				orderBillCancel: false,
				orderBillFinish: false,
				total: null,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100, 500], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					businessScope: 'AE',
					orderStatus: '否',
					incomeFinishStatus: true,
					costFinishStatus: true,
					orderCode: '',
					awbNumber: '',
					coopName: '',
					flightNo: '',
					flightDateStart: '',
					flightDateEnd: '',
					columnStrs: ''
				},
				lockDate: this.getDateTime(new Date()),
				setVisible: false,
				amountBillSendListVisible: false,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				lockVisible: false,
				frow: {},
				loading: false,
				showFlag: false,
				useroptions: [],
				tableHeight: '550px'
			}
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'viewVisibleTagAE': viewVisibleVueAE,
			'viewVisibleTagAI': viewVisibleVueAI,
			'viewVisibleTagSE': viewVisibleVueSE,
			'viewVisibleTagSI': viewVisibleVueSI,
			'viewVisibleTagTE': viewVisibleVueTE,
			'viewVisibleTagLC': viewVisibleVueLC,
			'viewVisibleTagIO': viewVisibleVueIO
		},
		methods: {
			sortIncomeRecorded(a, b) {
				return a.incomeFinishStatusForSort - b.incomeFinishStatusForSort
			},
			sortCostRecorded(a, b) {
				return a.costFinishStatusForSort - b.costFinishStatusForSort
			},
			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(columns.lockInfo);
				let userId = window.localStorage.getItem('userId');
				let arrayC = JSON.parse(strColumn);
				if (arrayC && arrayC.length > 0) {
					try {
						arrayC.forEach((item, index) => {
							if (column.label == item.label) {
								item.width = newWidth
								throw Error('end')
							}
						})
					} catch (e) {
						//TODO handle the exception
					}
					arrayC = this.sortBykey(arrayC, 'index')
					localStorage.setItem(userId + '_lock_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.frow.businessScope = this.query.businessScope
				this.setVisible = true;
			},
			showLock() {
				if (this.multipleSelection.length == 0) {
					this.openError('请至少选择一条记录')
					return
				}
				let message = ""
				let flag = false
				let ifShowDate = true
        //如果启用了签单判断条件 且 服务产品 IN 签单配置的服务产品；且 当前订单 未签单；（签单表 签单状态=0）则不允许 做财务锁账
        if(localStorage.getItem("rountingSign") == 1 && this.query.businessScope == 'AE' ){
            let awbNumbers = "";
            this.multipleSelection.forEach((item) => {
                console.log(item);
                if(item.businessMethod && localStorage.getItem("rountingSignBusinessProduct").indexOf(item.businessMethod) !== -1 && item.signState === 0){
                    awbNumbers = awbNumbers + item.awbNumber + ',';
                }
            })
            if(awbNumbers){
                awbNumbers = awbNumbers.substring(0,awbNumbers.length-1);
                this.openError('您好，主单号 ' + awbNumbers + ' 未做航线签单，不能财务锁帐');
                return
            }
        }
				if (this.multipleSelection.every(row => row.incomeAmount === '')) {
					message = "所选记录没有费用录入,"
					flag = true
					ifShowDate = false
				} else if (this.multipleSelection.some(row => row.incomeAmount === '')) {
					message = "所选记录中含有未录入费用的订单,"
					flag = true
				}
				if (flag) {
					this.$confirm(message + '确定锁账么？', '提示', {
						distinguishCancelAndClose: true,
						cancelButtonText: '否',
						confirmButtonText: '是',
						type: 'warning',
						center: true
					}).then(() => {
						if (ifShowDate) {
							this.lockVisible = true;
						} else {
							this.$axios.put('/afbase/orderLockOrUnlock/lock/' + this.query.businessScope + '/' + Array.from(new Set(this.multipleSelection
								.map(row => row.orderId))).join() + '/' + this.lockDate).then((response) => {
								if (response.data.code == 0) {
									let orderIds = Array.from(new Set(this.multipleSelection.map(row => row.orderId))).join()
									this.openSuccess()
									this.findByPage()
									this.$confirm('是否打印核算单？', '提示', {
										distinguishCancelAndClose: true,
										cancelButtonText: '否',
										confirmButtonText: '是',
										type: 'warning',
										center: true
									}).then(() => {
										this.$axios.get('/afbase/orderLockOrUnlock/printBusinessCalculationBillMany/' + this.query.businessScope +
											'/' + orderIds).then((resp) => {
											window.open(resp.data.data)
										}).catch(function(error) {
											console.log(error);
										})
									}).catch(() => {

									})
								} else {
									this.openError(response.data.messageInfo)
								}
							}).catch((error) => {
								this.openError(error.response.data.messageInfo)
							})
						}
					}).catch(() => {

					})
				} else {
					this.lockVisible = true;
				}



			},
			//标题样式
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				// console.log(column)
				if (column.property === "incomeFinishStatus") {
					let k = '';
					if (row.incomeFinishStatus || (row.incomeStatus != null && row.incomeStatus != '未录收入')) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "costFinishStatus") {
					let k = '';
					if (row.costFinishStatus || (row.costStatus != null && row.costStatus != '未录成本')) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "orderLockStatus") {
					let k = '';
					if (row.orderLockStatus) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else {
					return ""
				}
			},
			addCellStayle(data) {
				if (data.column.property === "incomeFinishStatus") {
					let k = '';
					if (data.row.incomeFinishStatus) {
						k = "color:#67C23A;"
					} else if (data.row.incomeStatus != null && data.row.incomeStatus != '未录收入') {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "costFinishStatus") {
					let k = '';
					if (data.row.costFinishStatus) {
						k = "color:#67C23A;"
					} else if (data.row.costStatus != null && data.row.costStatus != '未录成本') {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "orderLockStatus") {
					let k = '';
					if (data.row.orderLockStatus) {
						k = "color:red;"
					}
					return k;
				} else {
					return "";
				}
			},
			formatter_column(row, column) {
				if (column.property === 'shipName') {
					return row.shipName + "/" + row.shipVoyageNumber;
				} else if (column.property === 'salesName') {
					if (row.salesName) {
						return row.salesName.split(' ')[0];
					} else {
						return "";
					}
				} else if (column.property === 'servicerName') {
					if (row.servicerName) {
						return row.servicerName.split(' ')[0];
					} else {
						return "";
					}
				} else if (column.property === 'creatorName') {
					if (row.creatorName) {
						return row.creatorName.split(' ')[0];
					} else {
						return "";
					}
				} else if (column.property === 'costAmount') {
					if (row[column.property] || row[column.property] === 0) {
						return row[column.property].toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
					} else {
						return "";
					}
				} else if (column.property === 'incomeAmount') {
					if (row[column.property] || row[column.property] === 0) {
						return row[column.property].toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
					} else {
						return "";
					}
				} else if (column.property === 'profitAmount') {
					if (row[column.property] || row[column.property] === 0) {
						return row[column.property].toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
					} else {
						return "";
					}
				} else {
					return row[column.property];
				}
			},
			sortBykey(ary, key) {
				return JSON.parse(JSON.stringify(ary)).sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date + " 00:00:00";
			},
			setLabel(tableColumns) {
				let indexDelete = [];
				try {
					tableColumns.forEach((column, index) => {
						if (column.prop == 'awbFromName' && this.query.businessScope == 'AE') {
							column.label = '运单来源'
						} else if (column.prop == 'awbFromName' && (this.query.businessScope == 'SE' || this.query.businessScope == 'TE')) {
							column.label = '订舱代理'
						} else if (column.prop == 'awbFromName') {
							indexDelete.push(index)
						}
						if (column.prop == 'awbNumber') {
							if (this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
								indexDelete.push(index);
							}
						}
						if (column.prop == 'departureStation' && this.query.businessScope == 'IO') {
							column.label = '起运地'
						}
						if (column.prop == 'arrivalStation' && this.query.businessScope == 'IO') {
							column.label = '目的地'
						}
						if (column.prop == 'flightNo' && this.query.businessScope.startsWith('A')) {
							column.label = '航班号'
						} else if (column.prop == 'flightNo' && this.query.businessScope.startsWith('S')) {
							column.label = '航次号'
						} else if (column.prop == 'flightNo') {
							indexDelete.push(index);
						}
						if (column.prop == 'flightDate' && this.query.businessScope.endsWith('I')) {
							column.label = '到港日期'
						} else if (column.prop == 'flightDate' && this.query.businessScope.endsWith('E')) {
							if (this.query.businessScope == 'TE') {
								column.label = '发车日期'
							} else {
								column.label = '离港日期'
							}
						} else if (column.prop == 'flightDate' && this.query.businessScope == 'LC') {
							column.label = '用车日期'
						} else if (column.prop == 'flightDate' && this.query.businessScope == 'IO') {
							column.label = '业务日期'
						}
						if (column.prop == 'businessMethod') {
							if (this.query.businessScope.startsWith('A')) {
								column.label = '服务产品'
							} else if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T')) {
								column.label = '装箱方式'
							} else if (this.query.businessScope.startsWith('L')) {
								column.label = '运输方式'
							} else if (this.query.businessScope.startsWith('I')) {
								column.label = '业务分类'
							}
						}
						if (column.prop == 'planChargeWeight' && (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T'))) {
							column.label = '计费吨'
						} else if (column.prop == 'planChargeWeight') {
							column.label = '计重'
						}
					})
				} catch (e) {}
				if (indexDelete.length > 0) {
					indexDelete.sort(function(a, b) {
						return a - b;
					});
					for (let i = 0; i < indexDelete.length; i++) {
						this.$delete(tableColumns, indexDelete[i] - i);
					}
				}
			},
			handleChange(command) {
				this.frow = command
			},
			handleCommand(command) {
				if (command == 'rollBackToFinishIncome') {
					this.rollBackToFinishIncome()
				} else if (command == 'rollBackToFinishCost') {
					this.rollBackToFinishCost()
				} else if (command == 'unLock') {
					this.unLock()
				} else if (command == 'printBusinessCalculationBill') {
					this.printBusinessCalculationBill()
				}

			},
			confirmLock() {
				this.$confirm('你确定要锁账么？', '提示', {
					distinguishCancelAndClose: true,
					cancelButtonText: '否',
					confirmButtonText: '是',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/afbase/orderLockOrUnlock/lock/' + this.query.businessScope + '/' + Array.from(new Set(this.multipleSelection
						.map(row => row.orderId))).join() + '/' + this.lockDate).then((response) => {
						if (response.data.code == 0) {
							let orderIds = Array.from(new Set(this.multipleSelection.map(row => row.orderId))).join()
							this.openSuccess()
							this.findByPage()
							this.closeLock()
							this.$confirm('是否打印核算单？', '提示', {
								distinguishCancelAndClose: true,
								cancelButtonText: '否',
								confirmButtonText: '是',
								type: 'warning',
								center: true
							}).then(() => {
								this.$axios.get('/afbase/orderLockOrUnlock/printBusinessCalculationBillMany/' + this.query.businessScope +
									'/' + orderIds).then((resp) => {
									window.open(resp.data.data)
								}).catch(function(error) {
									console.log(error);
								})
							}).catch(() => {

							})
						} else {
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
					})
				}).catch(() => {

				})
			},
			closeLock() {
				this.lockVisible = false
			},
			unLock() {
				this.$confirm('请确认，是否进行财务解锁？', '提示', {
					distinguishCancelAndClose: true,
					cancelButtonText: '否',
					confirmButtonText: '是',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/afbase/orderLockOrUnlock/unlock/' + this.query.businessScope + '/' + this.frow.orderId).then((
						response) => {
						if (response.data.code == 0) {
							this.openSuccess()
							this.findByPage()
						} else {
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
					})
				}).catch(() => {

				})

			},
			rollBackToFinishIncome() {
				this.$confirm('请确认，是否退回收入完成？', '提示', {
					distinguishCancelAndClose: true,
					cancelButtonText: '否',
					confirmButtonText: '是',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/afbase/orderLockOrUnlock/rollBackToFinishIncome/' + this.query.businessScope + '/' + this.frow
						.orderId).then((response) => {
						if (response.data.code == 0) {
							this.openSuccess()
							this.findByPage()
						} else {
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
					})
				}).catch(() => {

				})

			},
			rollBackToFinishCost() {
				this.$confirm('请确认，是否退回成本完成？', '提示', {
					distinguishCancelAndClose: true,
					cancelButtonText: '否',
					confirmButtonText: '是',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/afbase/orderLockOrUnlock/rollBackToFinishCost/' + this.query.businessScope + '/' + this.frow.orderId)
						.then((response) => {
							if (response.data.code == 0) {
								this.openSuccess()
								this.findByPage()
							} else {
								this.openError(response.data.messageInfo)
							}
						}).catch((error) => {
							this.openError(error.response.data.messageInfo)
						})
				}).catch(() => {

				})

			},
			findByPage() {
				this.setHeight()
				//从数据库查询设置信息
				let pageName = '财务结算管理/财务锁帐/' + this.query.businessScope;
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let lock_list_column = response.data.data;
						if (lock_list_column && lock_list_column.length > 0) {
							this.tableColumns = this.sortBykey(lock_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.lockInfo, 'index');
						}
						this.setLabel(this.tableColumns)
						this.loading = true
						this.$axios.get2("/afbase/orderLockOrUnlock?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode,
								this.query)
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
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/orderLockOrUnlock?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
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
					let excelList = this.sortBykey(columns.lockInfo, 'index');
					this.setLabel(excelList)
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				this.$axios.post3('/afbase/orderLockOrUnlock/exportExcel', this.query)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '财务锁账' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});

			},
			printBusinessCalculationBill() {
				this.$axios.get('/afbase/aforder/printBusinessCalculationBill/' + this.query.businessScope + '/' + this.frow.orderId)
					.then((response) => {
						window.open(response.data.data)
					}).catch(function(error) {
						console.log(error);
					})
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
							if (loaclJsonArray[i].prop === "containerNumber") {
								sums[i + 1] = this.total.containerNumber
							}
							if (loaclJsonArray[i].prop === "planPieces") {
								sums[i + 1] = this.total.planPieces
							}
							if (loaclJsonArray[i].prop === "planWeight") {
								sums[i + 1] = this.total.planWeightStr
							}
							if (loaclJsonArray[i].prop === "planVolume") {
								sums[i + 1] = this.total.planVolumeStr
							}
							if (loaclJsonArray[i].prop === "planChargeWeight") {
								sums[i + 1] = this.total.planChargeWeightStr
							}
						}
					}
				}
				return sums;
			},
			cellClick(row) {
				this.showView(row)
			},
			showView(row) {
				this.frow = row;
				this.frow.orderUuid = row.orderUuid;
				this.frow.orderId = row.orderId;
				this.frow.viewFlag = false;
				if (this.frow.incomeFinishStatus) {
					this.frow.incomeRecorded = true
				} else {
					this.frow.incomeRecorded = false
				}
				if (this.frow.costFinishStatus) {
					this.frow.costRecorded = true
				} else {
					this.frow.costRecorded = false
				}
				if (row.businessScope === 'AE') {
					this.frow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow, '/af_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleAE = true;
					}
				}
				if (row.businessScope === 'AI') {
					this.frow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow, '/ai_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleAI = true;
					}
				}
				if (row.businessScope === 'SE') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/se_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleSE = true;
					}
				}
				if (row.businessScope === 'SI') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/si_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleSI = true;
					}
				}
				if (row.businessScope === 'TE') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/te_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleTE = true;
					}
				}
				if (row.businessScope === 'LC') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/lc_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleLC = true;
					}
				}
				if (row.businessScope === 'IO') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/io_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleIO = true;
					}
				}
			},
			jumpToNewPage(name, frow, path) {
				let param = {
					flag: true,
					name: name,
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: path,
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
			},
			setHeight() {
				this.$nextTick(() => {
					let af_order_lock_header = this.$refs.af_order_lock_header.offsetHeight;
					let af_order_lock_footer = this.$refs.af_order_lock_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - af_order_lock_header - af_order_lock_footer;
					this.tableHeight = heightS + "px";
				});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			init() {
				//查询业务范畴
				this.$axios.get2('/afbase/category/paramsNew', {
					categoryName: "业务范畴"
				}).then(function(response) {
					this.businessCodes = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				})
			}

		},
		created() {
			//按钮权限开始
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('af-order-bill-finish') > -1) {
				this.orderBillFinish = true;
			}
			if (buttonInfo.indexOf('af-order-bill-cancel') > -1) {
				this.orderBillCancel = true;
			}
			//从数据库查询设置信息
			let pageName = '财务结算管理/财务锁帐/' + this.query.businessScope;
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let lock_list_column = response.data.data;
					if (lock_list_column && lock_list_column.length > 0) {
						this.tableColumns = this.sortBykey(lock_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.lockInfo, 'index');
					}
					this.setLabel(this.tableColumns)
				}.bind(this));
			this.init()
		}
	}
</script>
<style type="text/css">
	.orderLockUnlockList .el-input__icon {
		line-height: 30px !important;
	}

	.orderLockUnlockList .el-form-item__content {
		line-height: 30px !important;
	}

	.orderLockUnlockList .el-input-group__prepend {
		padding: 0 6px;
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
