<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="orderListPage">
			<div ref="lc_order_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.coopName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">客户名称</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">运输方式</template>
								<el-select slot="suffix" v-model="query.shippingMethod" clearable placeholder="请选择" style="width:131px;margin-right: -5px;">
									<el-option v-for="(item,index) in shippingMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
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
							<el-input v-model="query.orderCode" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">业务单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.orderCodeAssociated" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">关联单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.departureStation" auto-complete="off" clearable style="width:200px;" @input="query.departureStation=query.departureStation.toUpperCase()">
								<template slot="prepend">始发城市</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.arrivalStation" auto-complete="off" clearable style="width:200px;" @input="query.arrivalStation=query.arrivalStation.toUpperCase()">
								<template slot="prepend">目的城市</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="189px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList" v-if="exportButtonFlag">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show='showFlag'>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.orderCodeVl" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">派车单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" v-model="query.driverNumber" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">车牌号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.driverName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">司机姓名</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.driverTel" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">司机电话</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show='showFlag'>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.servicerName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">责任客服</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.salesName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">责任销售</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.creatorName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">责任操作</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:204px;">
								<template slot="prepend">创建日期</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">收入完成</template>
								<el-select slot="suffix" v-model="query.incomeRecorded" placeholder="请选择" style="width:131px;margin-right: -5px;">
									<el-option label="全部" value=""></el-option>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">成本完成</template>
								<el-select slot="suffix" v-model="query.costRecorded" placeholder="请选择" style="width:131px;margin-right: -5px;">
									<el-option label="全部" value=""></el-option>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-show="orderFinanceLockViewFlag">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">财务锁账</template>
								<el-select slot="suffix" v-model="query.orderStatus" clearable placeholder="请选择" style="width:131px;margin-right: -5px;">
									<el-option label="已锁账" value="已锁账">
									</el-option>
									<el-option label="未锁账" value="未锁账">
									</el-option>
								</el-select>
							</el-input>
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
							<el-dropdown-item v-if="permissionButtonForEdit" command="edit">编辑订单</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForInbound" command="inbound">操作出重</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForService" command="incomeCost">费用录入</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForFile" command="orderFiles">附件上传</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForTwoCode" command="shareTwoCode">二维码
								<!-- <el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">二维码<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item v-if="permissionButtonForViewTwoCode" command="checkTwoCode">订单跟踪码</el-dropdown-item>
										<el-dropdown-item command="deliveryNotice">送货通知码</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown> -->
							</el-dropdown-item>
							<el-dropdown-item v-if="permissionButtonForSpecialHandle">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link ">特殊处理<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item v-if="permissionButtonForSpecialHandleCopy" command="copySave">复制新增</el-dropdown-item>
										<el-dropdown-item v-if="scope.row.orderStatus!='强制关闭'&&permissionButtonForSpecialHandleForceStop" command="forceStop">强制关闭</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>

			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label!='订单号'&&item.label!='收入完成'&&item.label!='成本完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-if="item.label=='收入完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortIncomeRecorded">
				</el-table-column>
				<el-table-column v-if="item.label=='成本完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostRecorded">
				</el-table-column>
				<el-table-column v-if="item.label=='订单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div class="pagination" ref="lc_order_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
		<viewDetail ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewDetail>
		<copy ref="addMission" v-if="copyVisible" :visible.sync="copyVisible" :frow="frow"></copy>
		<!-- <amountBillPrint ref="addMission" v-if="printAmountBillVisible" :visible.sync="printAmountBillVisible" :frow="frow"></amountBillPrint> -->
		<!-- <amountBillPrintMore ref="addMission" v-if="printAmountBillMoreVisible" :visible.sync="printAmountBillMoreVisible" :frow="frow"></amountBillPrintMore> -->
		<!-- <amountBillSend ref="addMission" v-if="amountBillSendVisible" :visible.sync="amountBillSendVisible" :frow="frow"></amountBillSend> -->
		<!-- <amountBillSendList ref="addMission" v-if="amountBillSendListVisible" :visible.sync="amountBillSendListVisible" :frow="frow"></amountBillSendList> -->
		<!-- <trackVisibleTag ref="addMission" v-if="trackVisible" :visible.sync="trackVisible" :frow="frow"></trackVisibleTag> -->
		<!-- <qrCodeViewVisibleTab ref="addMission" v-if="qrCodeViewVisible" :visible.sync="qrCodeViewVisible" :frow="frow"></qrCodeViewVisibleTab> -->
		<!-- <hawMake ref="addMission" v-if="hawMakeVisible" :visible.sync="hawMakeVisible" :frow="frow"></hawMake> -->
		<forceStop ref="addMission" v-if="forceStopVisible" :visible.sync="forceStopVisible" :frow="frow"></forceStop>
		<!-- <orderLetter ref="addMission" v-if="orderLetterVisible" :visible.sync="orderLetterVisible" :frow="frow"></orderLetter> -->
		<!-- <deliveryNotice ref="addMission" v-if="deliveryNoticeVisible" :visible.sync="deliveryNoticeVisible" :frow="frow"></deliveryNotice> -->
		<!-- <deliveryNoticeShare ref="addMission" v-if="deliveryNoticeShareVisible" :visible.sync="deliveryNoticeShareVisible" :frow="frow"></deliveryNoticeShare> -->
	</div>
</template>
<script>
	import Save from './order/main/order_save'
	import Edit from './order/main/order_edit'
	import View from './order/main/order_view'
	import Copy from './order/main/order_copy'
	// import AmountBillPrint from '../../af/cssDebitNote/af_debit_note_print'
	// import AmountBillPrintMore from '../../af/order/cssDebitNotePrint/af_css_debit_note_select'
	// import AmountBillSend from '../../af/order/cssDebitNoteSend/af_css_debit_note_send'
	// import AmountBillSendList from '../../af/order/cssDebitNoteSend/af_css_debit_note_send_list'
	// import trackVisibleVue from "../../sc/se/order/track/order_track";
	// import QRCodeViewVue from "../../af/order/qrCode/af_order_qrcode_view";
	import setVisibleVue from './order/main/lc_order_setting.vue'
	import columns from './order/json/lc_order_column.json'
	// import setVisibleVue from './order/main/se_order_setting'
	// import HawMake from './order/main/order_hawmake_print'
	import ForceStop from './order/other/order_force_stop'
	// import OrderLetter from './order/main/order_letter_print'
	// import DeliveryNotice from './order/deliveryNotice/se_order_delivery_notice.vue'
	// import DeliveryNoticeShare from './order/deliveryNotice/se_order_delivery_notice_share'
	import {
		orderDisplayRule
	} from "@/common/order/orderDisplayRule"
	export default {
		data() {
			return {
				tableHeight: '550px',
				orderFinanceLockViewFlag: false,
				permissionButtonForSave: false,
				permissionButtonForView: false,
				permissionButtonForEdit: false,
				permissionButtonForService: false,
				permissionButtonForServiceIncome: false,
				permissionButtonForServiceCost: false,
				permissionButtonForFile: false,
				permissionButtonForLog: false,
				permissionButtonForInbound: false,
				permissionButtonForTwoCode: false,
				permissionButtonForViewTwoCode: false,
				permissionButtonForShareTwoCode: false,
				permissionButtonForBillMake: false,
				permissionButtonForAwbMake: false,
				permissionButtonForHawbMake: false,
				permissionButtonForPrint: false,
				permissionButtonForPrintOrderLetter: false,
				permissionButtonForPrintPackageDetail: false,
				permissionButtonForPrintBillView: false,
				permissionButtonForPrintBillSend: false,
				permissionButtonForSpecialHandle: false,
				permissionButtonForSpecialHandleForceStop: false,
				permissionButtonForSpecialHandleCopy: false,
				exportButtonFlag: false,
				incomeServicePermissionButton: false,
				productOptions: [],
				billingTypes: [],
				shippingMethods: [],
				contactsOptions: [],
				orderContacts: [],
				/*表数据*/
				data: [],
				tableColumns: [],
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
					customerNumber: '',
					coopName: '',
					shippingMethod: '',
					drivingTimeStart: this.getDateTime(),
					drivingTimeEnd: '',
					orderCode: '',
					orderCodeAssociated: '',
					departureStation: '',
					arrivalStation: '',
					orderCodeVl: '',
					driverNumber: '',
					driverName: '',
					driverTel: '',
					servicerName: '',
					salesName: '',
					creatorName: '',
					createTimeStart: '',
					createTimeEnd: '',
					incomeRecorded: '',
					costRecorded: '',
					orderStatus: '未锁账',
					columnStrs: '',
          orderPermission: ''
				},
				setVisible: false,
				saveVisible: false,
				editVisible: false,
				viewVisible: false,
				copyVisible: false,
				trackVisible: false,
				qrCodeShareVisible: false,
				qrCodeViewVisible: false,
				deliveryNoticeVisible: false,
				deliveryNoticeShareVisible: false,
				showFlag: false,
				printAmountBillVisible: false,
				printAmountBillMoreVisible: false,
				amountBillSendVisible: false,
				amountBillSendListVisible: false,
				orderLetterVisible: false,
				frow: {},
				currRow: '',
				loading: false,
				useroptions: [],
				hawMakeVisible: false,
				forceStopVisible: false,
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'save': Save,
			'edit': Edit,
			'copy': Copy,
			'viewDetail': View,
			// 'trackVisibleTag': trackVisibleVue,
			// "qrCodeViewVisibleTab": QRCodeViewVue,
			// 'amountBillPrint': AmountBillPrint,
			// 'amountBillPrintMore': AmountBillPrintMore,
			// 'amountBillSend': AmountBillSend,
			// 'amountBillSendList': AmountBillSendList,
			// 'hawMake': HawMake,
			'forceStop': ForceStop,
			// 'orderLetter': OrderLetter,
			// 'deliveryNotice': DeliveryNotice,
			// 'deliveryNoticeShare': DeliveryNoticeShare,
		},
		provide() {
			return {
				findByPage: this.findByPage,
				shareTwoCode: this.shareTwoCode,
				deliveryNoticeShare: this.deliveryNoticeShare,
			}
		},
		methods: {
			sortIncomeRecorded(a, b) {
				return a.incomeRecordedForSort - b.incomeRecordedForSort
			},
			sortCostRecorded(a, b) {
				return a.costRecordedForSort - b.costRecordedForSort
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let lc_order_header = this.$refs.lc_order_header.offsetHeight;
					let lc_order_footer = this.$refs.lc_order_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - lc_order_header - lc_order_footer;
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
					localStorage.setItem(userId + '_lc_order_list_column_width', JSON.stringify(arrayC))
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
				} else if (data.column.property === "confirmPieces") {
					let k = '';
					if (this.confirmRedCount(data.row, 'pieces')) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "confirmWeight") {
					let k = '';
					if (this.confirmRedCount(data.row, 'weight')) {
						k = "color:red;"
					}
					return k;

				} else if (data.column.property === "confirmVolume") {
					let k = '';
					if (this.confirmRedCount(data.row, 'volume')) {
						k = "color:red;"
					}
					return k;

				} else if (data.column.property === "confirmChargeWeight") {
					let k = '';
					if (this.confirmRedCount(data.row, 'chargeWeight')) {
						k = "color:red;"
					}
					return k;
				} else {
					return "";
				}
			},
			formatter_column(row, column) {
				if (column.property === 'incomeRecorded') {
					return "";
				} else if (column.property === 'costRecorded') {
					return "";
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
				} else if (column.property === 'planWeight' || column.property === 'confirmWeight' || column.property === 'planVolume' || column.property === 'confirmVolume' || column.property === 'planChargeWeight' || column.property === 'confirmChargeWeight') {
					return row[column.property + 'Str'];
				} else {
					return row[column.property];
				}
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			setSalesName(vId) {
				if (vId) {
					this.query.salesName = this.useroptions.find((item) => {
						return item.value === vId
					}).label
				} else {
					this.query.salesName = ''
				}
			},
			setServicerName(vId) {
				if (vId) {
					this.query.servicerName = this.useroptions.find((item) => {
						return item.value === vId
					}).label
				} else {
					this.query.servicerName = ''
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'view') {
					this.showView(this.currRow)
				} else if (command == 'incomeCost') {
					this.showincomeCost(this.currRow)
				} else if (command == 'uninstall') {
					this.doDelete(this.currRow)
				} else if (command == 'forceStop') {
					this.doForceStop(this.currRow)
				} else if (command == 'copySave') {
					this.copySave(this.currRow)
				} else if (command == 'orderFiles') {
					this.showOrderFiles(this.currRow)
				} else if (command == 'inbound') {
					this.showInbound(this.currRow)
				} else if (command == 'packageDetail') {
					this.packageDetail(this.currRow)
				} else if (command == 'checkTwoCode') {
					this.checkTwoCode(this.currRow)
				} else if (command == 'shareTwoCode') {
					this.shareTwoCode(this.currRow)
				} else if (command == 'mawbMake') {
					this.mawbMake(this.currRow)
				} else if (command == 'hawbMake') {
					this.hawbMake(this.currRow)
				} else if (command == 'printBill') {
					this.printBill(this.currRow)
				} else if (command == 'sendBill') {
					this.sendBill(this.currRow)
				} else if (command == "deliveryNotice") {
					this.deliveryNotice(this.currRow);
				}
			},
			deliveryNotice(row) {
				if (!row.containerLoadWarehouseId) {
					this.openError("该订单没有维护 堆场/仓库 ，不能分享送货通知");
				} else {
					this.frow = row;
					this.deliveryNoticeVisible = true;
				}
			},
			//订单跟踪页面使用
			deliveryNoticeShare(row) {
				this.frow = row;
				this.deliveryNoticeShareVisible = true;
			},
			printBill(row) {
				let queryP = {
					orderCode: row.orderCode,
					businessScope: row.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if (response.data.data.length === 1) {
						this.frow.data = response.data.data;
						this.frow.businessScope = row.businessScope
						this.printAmountBillVisible = true;
					} else if (response.data.data.length > 1) {
						this.frow.orderCode = row.orderCode
						this.frow.businessScope = row.businessScope
						this.printAmountBillMoreVisible = true;
					} else {
						this.openError("该订单无账单")
					}
				}).catch((error) => {

				});

			},
			sendBill(row) {
				this.$axios.get2('/prm/coop/queryContactsIsValid', {
						coopId: row.coopId
					})
					.then((resp) => {
						this.contactsOptions = resp.data.data;
						if (this.contactsOptions != null && this.contactsOptions.length > 0) {
							this.orderContacts = []
							this.orderContacts.push(this.contactsOptions[0].contacts_id)
						}
						this.$axios.get2('/afbase/debitNote/selectOperation1', {
							orderCode: row.orderCode,
							businessScope: row.businessScope
						}).then((response) => {
							if (response.data.data.length === 1) {
								this.frow = row
								this.frow.data = response.data.data[0]
								this.frow.count = "one"
								this.frow.contact = {}
								this.frow.employee = {}
								this.frow.contact.orderContacts = this.orderContacts
								this.frow.contact.contactsOptions = this.contactsOptions
								this.frow.employee.useroptions = this.useroptions
								this.amountBillSendVisible = true;
							} else if (response.data.data.length > 1) {
								this.frow = row
								this.frow.contact = {}
								this.frow.employee = {}
								this.frow.contact.orderContacts = this.orderContacts
								this.frow.contact.contactsOptions = this.contactsOptions
								this.frow.employee.useroptions = this.useroptions
								this.amountBillSendListVisible = true
							} else {
								this.openError("该订单无账单")
							}
						}).catch((error) => {

						});
					})

			},
			openPostWindow(url, orgId, orderUuid, userId) {
				var newWin = window.open(),
					formStr = '';
				formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
					'<input type="hidden" name="orgId" value="' + orgId + '" />' +
					'<input type="hidden" name="orderUuid" value="' + orderUuid + '" />' +
					'<input type="hidden" name="userId" value="' + userId + '" />' +
					'</form>';
				newWin.document.body.innerHTML = formStr;
				newWin.document.forms[0].submit();
				return newWin;
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
				this.frow.permissionButtonForService = this.permissionButtonForService
				this.frow.permissionButtonForFile = this.permissionButtonForFile
				this.frow.permissionButtonForLog = this.permissionButtonForLog
				this.frow.permissionButtonForInbound = this.permissionButtonForInbound
				this.frow.jumpToTab = 'first'
				this.frow.viewFlag = true;
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true;
				}
			},
			showView(row) {
				this.frow = row;
				this.frow.viewFlag = false;
				this.frow.jumpToTab = "first";
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('view', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.viewVisible = true;
				}
			},
			doForceStop(row) {
				this.frow = row;
				this.forceStopVisible = true;
			},
			copySave(row) {
				this.frow = row
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('copy', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.copyVisible = true;
				}
			},
			showInbound(row) {
				this.frow = row
				this.frow.viewFlag = true;
				this.frow.jumpToTab = 'second'
				this.frow.permissionButtonForEdit = this.permissionButtonForEdit
				this.frow.permissionButtonForService = this.permissionButtonForService
				this.frow.permissionButtonForFile = this.permissionButtonForFile
				this.frow.permissionButtonForLog = this.permissionButtonForLog
				this.frow.permissionButtonForInbound = this.permissionButtonForInbound
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true;
				}
			},
			showincomeCost(row) {
				this.frow = row
				this.frow.viewFlag = true;
				this.frow.jumpToTab = 'third'
				this.frow.permissionButtonForEdit = this.permissionButtonForEdit
				this.frow.permissionButtonForService = this.permissionButtonForService
				this.frow.permissionButtonForFile = this.permissionButtonForFile
				this.frow.permissionButtonForLog = this.permissionButtonForLog
				this.frow.permissionButtonForInbound = this.permissionButtonForInbound
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true;
				}
			},
			showOrderFiles(row) {
				this.frow = row
				this.frow.viewFlag = true;
				this.frow.jumpToTab = 'fourth'
				this.frow.permissionButtonForEdit = this.permissionButtonForEdit
				this.frow.permissionButtonForService = this.permissionButtonForService
				this.frow.permissionButtonForFile = this.permissionButtonForFile
				this.frow.permissionButtonForLog = this.permissionButtonForLog
				this.frow.permissionButtonForInbound = this.permissionButtonForInbound
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true;
				}
			},

			orderLetter(row) {
				this.frow = row;
				this.orderLetterVisible = true;
			},
			packageDetail() {
				this.openError("功能暂未开通，敬请期待...")
			},

			checkTwoCode(row) {
				this.frow = row;
				this.qrCodeViewVisible = true;
			},
			shareTwoCode(row) {
				this.openError("功能暂未开通，敬请期待...");
			},
			findByPage() {
        let orderPermission = window.localStorage.getItem('orderPermission');//当前用户的订单权限
        this.query.orderPermission = orderPermission;
				this.query.columnStrs = '';
				this.setHeight();
				//从数据库查询设置信息
				let pageName = '订单操作管理/国内运输/运输订单';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let lc_list_column = response.data.data;
						if (lc_list_column && lc_list_column.length > 0) {
							this.tableColumns = this.sortBykey(lc_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.lcInfo, 'index');
						}
						this.loading = true
						this.$axios.get2("/sc/lcOrder?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
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

						this.$axios.get2("/sc/lcOrder/total", this.query)
							.then(function(response) {
								this.total = response.data.data;
								this.getSummaries();
							}.bind(this));
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/sc/lcOrder?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
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
					this.query.columnStrs = JSON.stringify(columns.lcInfo);
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/sc/lcOrder/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = 'LC订单' + '.xls'; // 下载后文件名
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
							if (loaclJsonArray[i].prop === "confirmPieces") {
								sums[i + 1] = this.total.confirmPieces
							}
							if (loaclJsonArray[i].prop === "confirmWeight") {
								sums[i + 1] = this.total.confirmWeightStr
							}
							if (loaclJsonArray[i].prop === "confirmVolume") {
								sums[i + 1] = this.total.confirmVolumeStr
							}
							if (loaclJsonArray[i].prop === "confirmChargeWeight") {
								sums[i + 1] = this.total.confirmChargeWeightStr
							}
						}
					}
				}
				return sums;
			},
			hawbMake(row) {
				this.frow = row;
				this.hawMakeVisible = true;
			},
			mawbMake() {
				this.openError("功能暂未开通，敬请期待")
			},
			init() {
				//按钮权限
				let buttonInfo = window.localStorage.getItem('buttonInfo')
				let buttonPermission = JSON.parse(buttonInfo)
				if (buttonInfo.indexOf('lc_order_save') > -1) {
					this.permissionButtonForSave = true
				}
				if (buttonInfo.indexOf('lc_order_view') > -1) {
					this.permissionButtonForView = true
				}
				if (buttonInfo.indexOf('lc_order_edit') > -1) {
					this.permissionButtonForEdit = true
				}
				if (buttonPermission.some(item => item == 'lc_order_service')) {
					this.permissionButtonForService = true
				}
				if (buttonInfo.indexOf('lc_order_service_income') > -1) {
					this.permissionButtonForServiceIncome = true
				}
				if (buttonInfo.indexOf('lc_order_service_cost') > -1) {
					this.permissionButtonForServiceCost = true
				}
				if (buttonInfo.indexOf('lc_order_file') > -1) {
					this.permissionButtonForFile = true
				}
				if (buttonInfo.indexOf('lc_order_log') > -1) {
					this.permissionButtonForLog = true
				}
				if (buttonInfo.indexOf('lc_order_inbound') > -1) {
					this.permissionButtonForInbound = true
				}
				if (buttonPermission.some(item => item == 'lc_order_twoCode')) {
					this.permissionButtonForTwoCode = true
				}
				if (buttonInfo.indexOf('lc_order_twoCode_view') > -1) {
					this.permissionButtonForViewTwoCode = true
				}
				if (buttonInfo.indexOf('lc_order_twoCode_share') > -1) {
					this.permissionButtonForShareTwoCode = true
				}
				if (buttonPermission.some(item => item == 'lc_order_specialHandle')) {
					this.permissionButtonForSpecialHandle = true
				}
				if (buttonInfo.indexOf('lc_order_specialHandle_copy') > -1) {
					this.permissionButtonForSpecialHandleForceStop = true
				}
				if (buttonInfo.indexOf('lc_order_specialHandle_forceStop') > -1) {
					this.permissionButtonForSpecialHandleCopy = true
				}
				if (buttonInfo.indexOf('lc_order_export') > -1) {
					this.exportButtonFlag = true
				}

				this.$axios.get('/sc/vLcCategory/运输方式').then((response) => {
					this.shippingMethods = response.data.data;
					if (this.shippingMethods.length != 0) {
						this.query.shippingMethod = "整车"
					}
				})
				this.$axios.get('/hrs/dept/selectUser').then(function(response) {
					this.useroptions = response.data.data;
				}.bind(this));
			},
			cellClick(row) {
				if (this.permissionButtonForEdit) {
					this.showedit(row)
				} else if (this.permissionButtonForView) {
					this.showView(row)
				} else {
					this.openError("您无权访问")
				}
			},
			showTrack(row) {
				this.frow = row;
				this.frow.activeName = 'editTab';
				this.trackVisible = true;
			},
			confirmRedCount(row, flag) {
				if (flag == 'pieces') {
					return orderDisplayRule.checkPieces(row.planPieces, row.confirmPieces)
				} else if (flag == 'weight') {
					return orderDisplayRule.checkFlag(row.planWeight, row.confirmWeight)
				} else if (flag == 'chargeWeight') {
					return orderDisplayRule.checkFlag(row.planChargeWeight, row.confirmChargeWeight)
				} else if (flag == 'volume') {
					return orderDisplayRule.volumeFlag(row.planVolume, row.confirmVolume)
				}
			},
			jumpToNewPage(name, frow) {
				let param = {
					flag: true,
					name: name,
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: "/lc_order",
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
			this.$axios.get('/hrs/org/getOrderFinanceLockView/LC').then(function(response) {
				if (response.data.data && response.data.data == true) {
					this.orderFinanceLockViewFlag = true;
				} else {
					this.orderFinanceLockViewFlag = false;
				}
			}.bind(this))
			//从数据库查询设置信息
			let pageName = '订单操作管理/国内运输/运输订单';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let lc_list_column = response.data.data;
					if (lc_list_column && lc_list_column.length > 0) {
						this.tableColumns = this.sortBykey(lc_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.lcInfo, 'index');
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
				} else if (this.$route.query.name == 'copy') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.copyVisible = true;
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
