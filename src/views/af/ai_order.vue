<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<div ref="ai_order_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.awbNumber" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">运单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.departureStation" auto-complete="off" clearable style="width:152px;" @input="query.departureStation=query.departureStation.toUpperCase()">
								<template slot="prepend">始发港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.arrivalStation" auto-complete="off" clearable style="width:152px;" @input="query.arrivalStation=query.arrivalStation.toUpperCase()">
								<template slot="prepend">目的港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">到港日期</template>
								<el-date-picker slot="suffix" v-model="query.flightDateBegin" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.flightDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>

							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" v-if="addButtonFlag">新增</el-button>

						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.orderCode" auto-complete="off" clearable style="width:210px;" @input="query.orderCode=query.orderCode.toUpperCase()">
								<template slot="prepend">订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.coopName" auto-complete="off" clearable style="width:220px;">
								<template slot="prepend">客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:220px;" @input="query.customerNumber=query.customerNumber.toUpperCase()">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.expectFlight" auto-complete="off" clearable style="width:220px;" @input="query.expectFlight=query.expectFlight.toUpperCase()">
								<template slot="prepend">航班号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="39px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel" v-if="excelButtonFlag">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row v-show="showFlag">
					<!-- <el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.servicerName" auto-complete="off" clearable style="width:190px;" >
							<template slot="prepend">责任客服</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.salesName" auto-complete="off" clearable style="width:190px;" >
							<template slot="prepend">责任销售</template>
						</el-input>
					</el-form-item>
				</el-col> -->
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">责任客服</template>
								<el-select slot="suffix" clearable v-model="query.servicerName" filterable placeholder="请选择" @change="setServicerName" style="width:141px;margin-right: -5px;">
									<el-option v-for="item in useroptions2" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:206px;">
								<template slot="prepend">责任销售</template>
								<el-select slot="suffix" clearable v-model="query.salesName" filterable placeholder="请选择" @change="setSalesName" style="width:137px;margin-right: -5px;">
									<el-option v-for="item in useroptions2" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:206px;">
								<template slot="prepend">责任操作</template>
								<el-select slot="suffix" clearable v-model="query.creatorName" filterable placeholder="请选择" @change="setCreatorName" style="width:137px;margin-right: -5px;">
									<el-option v-for="item in useroptions2" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:204px;">
								<template slot="prepend">创建日期</template>
								<el-date-picker slot="suffix" v-model="query.createTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 135px;margin-right: -5px;">
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
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">收入完成</template>
								<el-select slot="suffix" v-model="query.incomeRecorded" placeholder="请选择" style="width:141px;margin-right: -5px;">
									<el-option label="全部" value=""></el-option>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:206px;">
								<template slot="prepend">成本完成</template>
								<el-select slot="suffix" v-model="query.costRecorded" placeholder="请选择" style="width:137px;margin-right: -5px;">
									<el-option label="全部" value=""></el-option>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-show="orderFinanceLockViewFlag">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">财务锁账</template>
								<el-select slot="suffix" v-model="query.orderStatus" clearable placeholder="请选择" style="width:141px;margin-right: -5px;">
									<el-option label="已锁账" value="1">
									</el-option>
									<el-option label="未锁账" value="0">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>





			</div>
		</el-form>
		<el-table v-loading="loading" class="table_settle" highlight-current-row :data="data1" border stripe :summary-method="getSummaries" show-summary :max-height="tableHeight" ref="table" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
			<el-table-column label="操作" align="center" fixed width="45">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="view" v-if="viewButtonFlag">查看订单</el-dropdown-item>
							<el-dropdown-item command="edit" v-if="editButtonFlag">编辑订单</el-dropdown-item>
							<el-dropdown-item command="orderFiles" v-if="fileButtonFlag">附件上传</el-dropdown-item>
							<el-dropdown-item command="incomeCost" v-if="servicesButtonFlag">费用录入</el-dropdown-item>
							<el-dropdown-item v-if="twoCodeButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">二维码<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="checkTwoCode" v-if="twoCodeButtonFlag1">订单追踪</el-dropdown-item>
<!--										<el-dropdown-item command="shareTwoCode" v-if="twoCodeButtonFlag2">分享二维码</el-dropdown-item>-->
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item v-if="letterMakeButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">单证制作<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="shippingMake" v-if="letterMakeButtonFlag1">制作舱单</el-dropdown-item>
										<el-dropdown-item command="waybillMake" v-if="letterMakeButtonFlag2">分单制作</el-dropdown-item>

									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item v-if="printletterButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">打印单据<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="shippingMake" v-if="printletterButtonFlag1">派送签收单</el-dropdown-item>
										<el-dropdown-item command="printBill" v-if="printletterButtonFlag2&&incomeServicePermissionButton">账单预览</el-dropdown-item>
										<el-dropdown-item command="sendBill" v-if="printletterButtonFlag3&&incomeServicePermissionButton">发送账单</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item v-if="todoButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link ">特殊处理<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="showCopySave" v-if="todoButtonFlag1">复制新增</el-dropdown-item>
										<el-dropdown-item command="forceStop" v-if="todoButtonFlag2">强制关闭</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label!='订单号'&&item.label!='运单号'&&item.label!='收入完成'&&item.label!='成本完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-if="item.label=='收入完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortIncomeRecorded">
				</el-table-column>
				<el-table-column v-if="item.label=='成本完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostRecorded">
				</el-table-column>
				<el-table-column v-if="item.label=='订单号'||item.label=='运单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div class="pagination" ref="ai_order_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		<matchVisibleTag ref="addMission" v-if="matchVisible" :visible.sync="matchVisible" :frow="frow"></matchVisibleTag>
		<forceStop ref="addMission" v-if="forceStopVisible" :visible.sync="forceStopVisible" :frow="frow"></forceStop>
		<dgd ref="addMission" v-if="dgdVisible" :visible.sync="dgdVisible" :frow="frow"></dgd>
		<trackVisibleTag ref="addMission" v-if="trackVisible" :visible.sync="trackVisible" :frow="frow"></trackVisibleTag>
		<waybillMake ref="addMission" v-if="waybillMakeVisible" :visible.sync="waybillMakeVisible" :frow="frow"></waybillMake>
		<qrCodeShareVisibleTab ref="addMission" v-if="qrCodeShareVisible" :visible.sync="qrCodeShareVisible" :frow="frow"></qrCodeShareVisibleTab>
		<qrCodeViewVisibleTab ref="addMission" v-if="qrCodeViewVisible" :visible.sync="qrCodeViewVisible" :frow="frow"></qrCodeViewVisibleTab>

		<print ref="addMission" v-if="printVisible" :visible.sync="printVisible" :frow="ffrow"></print>
		<printMore ref="addMission" v-if="printMoreVisible" :visible.sync="printMoreVisible" :frow="ffrow"></printMore>
		<billSend ref="addMission" v-if="billSendVisible" :visible.sync="billSendVisible" :frow="ffrow"></billSend>
		<billSendList ref="addMission" v-if="billSendListVisible" :visible.sync="billSendListVisible" :frow="ffrow"></billSendList>

    <shipperLetter ref="addMission" v-if="shipperLetterVisible" :visible.sync="shipperLetterVisible" :frow="ffrow" @doSave="doSave" @shipperLetterCallback="shipperLetterCallback"></shipperLetter>
  </div>
</template>
<script>
	import setVisibleVue from './ai_order/ai_order_setting'
	import saveVisibleVue from './ai_order/ai_order_base_save'
	import editVisibleVue from './ai_order/edit_tabs'
	import matchVisibleVue from './order/af_order_match'
	import ForceStop from './order/af_order_forceStop'
	import DGD from './order/billMake/dgdMake'
	import trackVisibleVue from './order/orderTrack/ai_order_track'
	import WaybillMake from './order/billMake/waybillMakeAi'
	import QRCodeShareVue from './order/qrCode/af_order_qrcode_share'
	import QRCodeViewVue from './order/qrCode/af_order_qrcode_view'

	import Print from './cssDebitNote/af_debit_note_print'
	import PrintMore from './order/cssDebitNotePrint/af_css_debit_note_select'
	import billSend from './order/cssDebitNoteSend/af_css_debit_note_send'
	import billSendList from './order/cssDebitNoteSend/af_css_debit_note_send_list'
	import columns from './ai_order/ai_order_column.json'

  import shipperLetter from './order/shipperLetter/ai_order_shipper_letter'
	export default {
		data() {
			return {
				tableHeight: '550px',
				addButtonFlag: false,
        orderFinanceLockViewFlag:false,
				excelButtonFlag: false,
				trackButtonFlag: true,
				viewButtonFlag: false,
				editButtonFlag: false,
				fileButtonFlag: false,
				letterButtonFlag: false,
				weighttagButtonFlag: false,
				servicesButtonFlag: false,
				matchButtonFlag: false,
				printletterButtonFlag: false,
				printletterButtonFlag1: false,
				printletterButtonFlag2: false,
				printletterButtonFlag3: false,
				twoCodeButtonFlag: false,
				twoCodeButtonFlag1: false,
				twoCodeButtonFlag2: false,
				letterMakeButtonFlag: false,
				letterMakeButtonFlag1: false,
				letterMakeButtonFlag2: false,
				todoButtonFlag: false,
				todoButtonFlag1: false,
				todoButtonFlag2: false,
				incomeServicePermissionButton: false,
				useroptions2: [],
				useroptions: [],
				orderContacts: [],
				contactsOptions: [],
				/*表数据*/
				data1: [],
				data2: [],
				tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50,100,500], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					businessScope: 'AI',
					incomeRecorded: '',
					costRecorded: '',
					orderStatus: '0',
					awbNumber: '',
					orderCode: '',
					customerNumber: '',
					businessProduct: '',
					departureStation: '',
					arrivalStation: '',
					expectFlight: '',
					flightDateBegin: '',
					flightDateEnd: '',
					createTimeBegin: '',
					createTimeEnd: '',
					servicerName: '',
					salesName: '',
					coopName: '',
					creatorName: '',
					columnStrs: '',
          orderPermission: '',
				},
        ruleForm: {
          slId:'',
          orderId:'',
          orderUuid:'',
          awbNumber: '',
          hawbNumber: '',
          departureStation: '',
          arrivalStation: '',
          expectFlight: '',
          expectDeparture: '',
          planPieces: '',
          planWeight: '',
          customsStatusCode: '',
          actualDatetime:'',
          completedDatetime:'',
          unloadingLocationDate:'',
          unloadingLocationCode:'',
          goodsNameEn: '',
        },
        shipperLetterVisible: false,
				setVisible: false,
				saveVisible: false,
				editVisible: false,
				matchVisible: false,
				forceStopVisible: false,
				dgdVisible: false,
				waybillMakeVisible: false,
				trackVisible: false,
				qrCodeShareVisible: false,
				qrCodeViewVisible: false,
				showFlag: false,
				frow: {},
				ffrow: {},
				currRow: '',
				printVisible: false,
				printMoreVisible: false,
				billSendVisible: false,
				billSendListVisible: false,
				loading: false,
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'saveVisibleTag': saveVisibleVue,
			'editVisibleTag': editVisibleVue,
			'matchVisibleTag': matchVisibleVue,
			'forceStop': ForceStop,
			'dgd': DGD,
			'waybillMake': WaybillMake,
			'trackVisibleTag': trackVisibleVue,
			'qrCodeShareVisibleTab': QRCodeShareVue,
			"qrCodeViewVisibleTab": QRCodeViewVue,
			'print': Print,
			'printMore': PrintMore,
			'billSend': billSend,
			'billSendList': billSendList,
      shipperLetter
		},
		provide() {
			return {
				findByPage: this.findByPage,
				continueOperation: this.continueOperation,
				awbSubmit: this.awbSubmit,
				shareTwoCode: this.shareTwoCode
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
					let ai_order_header = this.$refs.ai_order_header.offsetHeight;
					let ai_order_footer = this.$refs.ai_order_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - ai_order_header - ai_order_footer;
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
          localStorage.setItem(userId + '_ai_list_column_width', JSON.stringify(arrayC))
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
				// console.log(column)
				if (column.property === "awbNumber" || column.property === "orderCode") {
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
				} else if (column.property === "switchAwbService") {
					let k = '';
					if (row.switchAwbService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "warehouseService") {
					let k = '';
					if (row.warehouseService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "customsClearanceService") {
					let k = '';
					if (row.customsClearanceService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "deliveryService") {
					let k = '';
					if (row.deliveryService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else {
					return ""
				}
			},
			//标题 style
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
				} else if (data.column.property === "switchAwbService") {
					let k = '';
					if (data.row.switchAwbService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "warehouseService") {
					let k = '';
					if (data.row.warehouseService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "customsClearanceService") {
					let k = '';
					if (data.row.customsClearanceService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "deliveryService") {
					let k = '';
					if (data.row.deliveryService) {
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
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'view') {
					this.showView(this.currRow)
				} else if (command == 'incomeCost') {
					this.showincomeCost(this.currRow)
				} else if (command == 'forceStop') {
					this.doForceStop(this.currRow)
				} else if (command == 'showCopySave') {
					this.showCopySave(this.currRow)
				} else if (command == 'dgdMake') {
					this.dgdMake()
				} else if (command == 'orderFiles') {
					this.showOrderFiles(this.currRow)
				} else if (command == 'shippingMake') {
					this.shippingMake(this.currRow)
				} else if (command == 'checkTwoCode') {
					this.checkTwoCode(this.currRow)
				} else if (command == 'shareTwoCode') {
					this.shareTwoCode(this.currRow)
				} else if (command == 'waybillMake') {
					this.waybillMake(this.currRow)
				} else if (command == 'printLetter') {
					this.printLetter(this.currRow)
				} else if (command == 'printBill') {
					this.printBill(this.currRow)
				} else if (command == 'sendBill') {
					this.sendBillValue(this.currRow);
					this.sendBill(this.currRow)
				}
			},
			sendBillValue(row) {
				this.orderContacts = [];
				let params = {
					coopId: row.coopId
				}
				this.$axios.get2('/prm/coop/queryContactsIsValid',
						params)
					.then(function(response) {
						this.contactsOptions = response.data.data;
						if (this.contactsOptions != null && this.contactsOptions.length > 0) {
							this.orderContacts.push(this.contactsOptions[0].contacts_id)
						}
					}.bind(this));
				this.$axios.get('/hrs/dept/selectUser').then(function(response) {
					this.useroptions = response.data.data;
				}.bind(this));

			},
			printBill(row) {
				let queryP = {
					orderCode: row.orderCode,
					businessScope: row.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if (response.data.data.length === 1) {
						this.ffrow.data = response.data.data;
						this.ffrow.businessScope = row.businessScope
						this.printVisible = true;
					} else if (response.data.data.length > 1) {
						this.ffrow.orderCode = row.orderCode;
						this.ffrow.businessScope = row.businessScope;
						this.printMoreVisible = true;
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});
			},
			sendBill(row) {
				let queryP = {
					orderCode: row.orderCode,
					businessScope: row.businessScope
				}
				this.$axios.get2('/afbase/debitNote/selectOperation1', queryP).then((response) => {
					if (response.data.data.length === 1) {
						this.ffrow.awbNumber = row.awbNumber
						this.ffrow.customerNumber = row.customerNumber
						this.ffrow.awbNumber = row.awbNumber
						this.ffrow.coopName = row.coopName
            this.ffrow.servicerId = row.servicerId
            this.ffrow.salesId = row.salesId
						this.ffrow.data = response.data.data[0]
						this.ffrow.count = "one"
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
            this.ffrow.businessScope = row.businessScope;
						this.billSendVisible = true;
					} else if (response.data.data.length > 1) {
						this.ffrow.businessScope = row.businessScope;
						this.ffrow.awbNumber = row.awbNumber
						this.ffrow.customerNumber = row.customerNumber
						this.ffrow.coopName = row.coopName
            this.ffrow.servicerId = row.servicerId
            this.ffrow.salesId = row.salesId
						this.ffrow.orderCode = row.orderCode
						this.ffrow.contact = {}
						this.ffrow.employee = {}
						this.ffrow.contact.orderContacts = this.orderContacts
						this.ffrow.contact.contactsOptions = this.contactsOptions
						this.ffrow.employee.useroptions = this.useroptions
						this.billSendListVisible = true
					} else {
						this.inboundSuccess("该订单无账单")
					}
				}).catch((error) => {

				});
			},
			printLetter(row) {

				let flag = 1;
				let customerNumbers = '';
				let awbUUIds = row.awbUuid;
				if (row.awbNumber == null || row.awbNumber.length != 12) {
					flag = 0;
					if (customerNumbers == '') {
						customerNumbers = customerNumbers + row.customerNumber;
					} else {
						customerNumbers = customerNumbers + ',' + row.customerNumber;
					}
				}
				if (flag == 1) {
					//打印
					if (awbUUIds.length == 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}
					let host = window.location.host;
					let hostName = host.split(":")[0];
					let orgId = window.localStorage.getItem("orgId");

					let params = {
						"awbUUIds": awbUUIds
					};
					this.$axios.post2('/afbase/operationPlan/checkLetters', params)
						.then(function(response) {
							if (response.data.code == 0) {
								let url = "http://" + hostName + "/afbase/operationPlan/printLetters";
								this.openPostWindow1(url, orgId, awbUUIds);
							} else {

							}

						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							if (errorinfo.indexOf('没有托书模板') > -1) {
								this.$message.error(errorinfo + "不能打印");
							}

						}.bind(this));

				} else {
					this.$message.error(" 订单号" + customerNumbers + ',未配主单号');
				}
			},
			openPostWindow1(url, orgId, awbUUIds) {

				var newWin = window.open(),
					formStr = '';
				//设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
				formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
					'<input type="hidden" name="orgId" value="' + orgId + '" />' +
					'<input type="hidden" name="awbUUIds" value="' + awbUUIds + '" />' +
					'</form>';

				newWin.document.body.innerHTML = formStr;
				newWin.document.forms[0].submit();

				return newWin;
			},

			openPostWindow(url, orgId, orderUuid, userId) {
				var newWin = window.open(),
					formStr = '';
				//设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
				formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
					'<input type="hidden" name="orgId" value="' + orgId + '" />' +
					'<input type="hidden" name="orderUuid" value="' + orderUuid + '" />' +
					'<input type="hidden" name="userId" value="' + userId + '" />' +
					'</form>';
				newWin.document.body.innerHTML = formStr;
				newWin.document.forms[0].submit();
				return newWin;
			},
			handleChange(command) {
				this.currRow = command
			},
			showsave() {
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.jumpToNewPage('save', {
						"ifFullscreen": true,
						'orderId': null
					})
				} else {
					this.frow.ifFullscreen = false
					this.frow.orderId = null;
					this.saveVisible = true;
				}
			},
			showCopySave(row) {
				this.frow = row;
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('save', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.saveVisible = true;
				}
			},
			showedit(row) {
				this.frow = row;
				this.frow.viewFlag = true;
				this.frow.activeName = "editTab";
				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.openError("已经做过财务锁账");
							return;
						} else {
							this.frow.editButtonFlag2 = true;
							this.frow.letterButtonFlag2 = true;
							this.frow.weighttagButtonFlag2 = true;
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.frow.ifFullscreen = true
								this.jumpToNewPage('edit', this.frow)
							} else {
								this.frow.ifFullscreen = false
								this.editVisible = true;
							}
						}

					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));

			},
			showView(row) {
				this.frow = row;
				this.frow.viewFlag = false;
				this.frow.activeName = "editTab";
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true;
				}
			},
			jumpToNewPage(name, frow) {
				let param = {
					flag: true,
					name: name,
					// frow: encodeURIComponent(JSON.stringify(frow))
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: "/ai_order",
					query: param
				});
				window.open(routeUrl.href, '_blank');
			},
			showTrack(row) {
				this.frow = row;
				this.frow.activeName = 'editTab';
				this.trackVisible = true;
			},
			doForceStop(row) {
				this.frow = row;
				this.forceStopVisible = true;
			},

			showincomeCost(row) {
				this.frow = row;
				this.frow.viewFlag = true;
				this.frow.activeName = "serviceTab";

				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.frow.editButtonFlag2 = false;
							this.frow.letterButtonFlag2 = false;
							this.frow.weighttagButtonFlag2 = false;
						} else {
							this.frow.editButtonFlag2 = true;
							this.frow.letterButtonFlag2 = true;
							this.frow.weighttagButtonFlag2 = true;
						}
						if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
							this.frow.ifFullscreen = true
							this.jumpToNewPage('edit', this.frow)
						} else {
							this.frow.ifFullscreen = false
							this.editVisible = true;
						}
					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));
			},
			showOrderFiles(row) {
				this.frow = row;
				this.frow.viewFlag = true;
				this.frow.activeName = "fileTab";
				this.frow.editButtonFlag2 = true;
				this.frow.letterButtonFlag2 = true;
				this.frow.weighttagButtonFlag2 = true;
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('edit', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.editVisible = true;
				}
				// this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
				// 	if(!response.data.data) {
				// 		this.frow.editButtonFlag2 = true;
				// 		this.frow.letterButtonFlag2 = true;
				// 		this.frow.weighttagButtonFlag2 = true;
				// 		this.editVisible = true;
				// 	} else {
				// 		this.openError("订单已财务锁账");
				// 	}
				// }.bind(this));

			},

      shippingMake() {
        this.openError1("功能暂未开通，敬请期待");
        return;
        this.$axios.get('/afbase/aforder/getShippingData').then(function(response) {
          if (response.data.data) { //找到有效数据
            this.openError1("功能暂未开通，敬请期待");
          } else { //没有找到有效数据
            this.openError1("您好，未开通舱单接口功能，无法制作舱单");
          }
        }.bind(this));
      },
      /*TODO暂时不用，不要删
			shippingMake(row) {
        this.ffrow = row;
        let orderId = row['orderId']
        var uPath = '/afbase/aforder/ai/view/' + orderId ;

        this.$axios.get(uPath)
          .then(function(response) {
            this.ruleForm = response.data.data;
            this.ffrow.shipperLetter = {
              slId: this.ruleForm.slId,
              orderId: this.ruleForm.orderId,
              orderUuid: this.ruleForm.orderUuid,
              awbNumber: this.ruleForm.awbNumber,
              hawbNumber: this.ruleForm.hawbNumber,
              departureStation: this.ruleForm.departureStation,
              arrivalStation: this.ruleForm.arrivalStation,
              expectFlight: this.ruleForm.expectFlight,
              expectDeparture: this.ruleForm.expectDeparture,
              planPieces: this.ruleForm.planPieces,
              planWeight: this.ruleForm.planWeight,
              customsStatusCode: this.ruleForm.customsStatusCode,
              actualDatetime: this.ruleForm.actualDatetime,
              completedDatetime: this.ruleForm.completedDatetime,
              unloadingLocationDate: this.ruleForm.unloadingLocationDate,
              unloadingLocationCode: this.ruleForm.unloadingLocationCode,
              goodsNameEn: this.ruleForm.goodsNameEn
            }
            this.shipperLetterVisible = true
          }.bind(this));

			},*/

      shipperLetterCallback({
                              orderInfo
                            }) {
        this.ruleForm.slId = orderInfo.slId
        this.ruleForm.orderId = orderInfo.orderId
        this.ruleForm.orderUuid = orderInfo.orderUuid
        this.ruleForm.awbNumber = orderInfo.awbNumber
        this.ruleForm.hawbNumber = orderInfo.hawbNumber
        this.ruleForm.departureStation = orderInfo.departureStation
        this.ruleForm.arrivalStation = orderInfo.arrivalStation
        this.ruleForm.expectFlight = orderInfo.expectFlight
        this.ruleForm.expectDeparture = orderInfo.expectDeparture
        this.ruleForm.planPieces = orderInfo.planPieces
        this.ruleForm.planWeight = orderInfo.planWeight
        this.ruleForm.customsStatusCode = orderInfo.customsStatusCode
        this.ruleForm.actualDatetime = orderInfo.actualDatetime
        this.ruleForm.completedDatetime = orderInfo.completedDatetime
        this.ruleForm.customsStatusCode = orderInfo.customsStatusCode
        this.ruleForm.goodsNameEn = orderInfo.goodsNameEn
        this.ruleForm.unloadingLocationDate = orderInfo.unloadingLocationDate
        this.ruleForm.unloadingLocationCode = orderInfo.unloadingLocationCode
      },
      doSave(){
        this.$axios.post2('/afbase/aforder/ai/saveShippers', this.ruleForm)
          .then(function(response) {debugger
            if (response.data.code == 0) {
              this.openSuccess();
              this.shipperLetterVisible = false
              this.loading = false
            } else {
              this.openError(response.data.messageInfo);
              this.loading = false
            }
          }.bind(this)).catch(function(error) {
          let errorinfo = error.response.data.messageInfo;
          this.openError(errorinfo);
          this.loading = false
          //唯一性错误

        }.bind(this));
      },
			checkTwoCode(row) {
				this.frow = row;
				this.qrCodeViewVisible = true;
			},
			shareTwoCode(row) {
				this.openError1("功能暂未开通，敬请期待");
				return;
				this.frow = row;
				this.qrCodeShareVisible = true;
			},
			findByPage() {
        let orderPermission = window.localStorage.getItem('orderPermission');//当前用户的订单权限
        this.query.orderPermission = orderPermission;
				this.query.columnStrs = '';
				this.setHeight();
        //从数据库查询设置信息
        let pageName = '订单操作管理/空运进口/AI订单';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let ai_list_column = response.data.data;
                if(ai_list_column && ai_list_column.length>0){
                    this.tableColumns = this.sortBykey(ai_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.aiInfo, 'index');
                }
                this.loading = true
                this.$axios.get2("/afbase/aforder/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this
                    .query)
                    .then(function(response) {
                        this.data1 = response.data.data.records;
                        this.pageConf.totalPage = response.data.data.total;
                        if (this.data1.length == 0) {
                            let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                            this.findByPage2(current);
                        } else {
                            this.loading = false
                        }
                    }.bind(this));

                this.$axios.get2("/afbase/aforder/getTatol", this.query)
                    .then(function(response) {
                        this.data2 = response.data.data;
                        this.getSummaries();
                    }.bind(this));
            }.bind(this));
				/*let userId = window.localStorage.getItem('userId');
				let ai_list_column = window.localStorage.getItem(userId + '_ai_list_column');
				if (ai_list_column) {
					let arrayC = JSON.parse(ai_list_column)
					if (arrayC && arrayC.length > 0) {
						this.tableColumns = this.sortBykey(arrayC, 'index');
					}
				} else {
					this.tableColumns = this.sortBykey(columns.aiInfo, 'index');
				}
				this.loading = true
				this.$axios.get2("/afbase/aforder/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this
						.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if (this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));

				this.$axios.get2("/afbase/aforder/getTatol", this.query)
					.then(function(response) {
						this.data2 = response.data.data;
						this.getSummaries();
					}.bind(this));*/
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/aforder/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			doDelete(row) {
				let params = {
					orderUuid: this.frow.orderUuid,
					businessScope: this.frow.businessScope
				}
				this.$axios.post2('/afbase/aforder/getOrderStatus', params).then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.length > 0) {
							this.openError("已经做过财务锁账");
							return;
						} else {
							this.$confirm(row.awbNumber + '是否可再次使用？', '提示', {
								distinguishCancelAndClose: true,
								// cancelButtonClass: "btn-custom-cancel",
								cancelButtonText: '否',
								confirmButtonText: '是',
								type: 'warning',
								center: true
							}).then(() => {
								let params = '{"orderUuid":"' + row.orderUuid + '","awbId":' + row.awbId + '}';
								this.$axios.post2('/afbase/aforder/doUninstall', params)
									.then(function(response) {
										if (response.data.code == 0) {
											this.openSuccess();
											this.findByPage();
										} else {
											this.openError(response.data.messageInfo);
										}
									}.bind(this));
							}).catch(action => {
								if (action === 'cancel') {
									let params = '{"orderUuid":"' + row.orderUuid + '","awbId":' + row.awbId + '}';
									this.$axios.post2('/afbase/aforder/doStop', params)
										.then(function(response) {
											if (response.data.code == 0) {
												this.openSuccess();
												this.findByPage();
											} else {
												this.openError(response.data.messageInfo);
											}
										}.bind(this));
								}
							});
						}

					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo);
				}.bind(this));

			},
			doUninstall(row) {
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=货物出重&order_uuid=' + row.orderUuid).then(function(
					response) {
					if (!response.data.data) {
						this.$confirm('你确定要卸载主单吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
							center: true
						}).then(() => {
							let params = '{"orderUuid":"' + row.orderUuid + '","awbId":' + row.awbId + '}';
							this.$axios.post2('/afbase/aforder/doUninstall', params)
								.then(function(response) {
									if (response.data.code == 0) {
										this.openSuccess();
										this.findByPage();
									} else {
										this.openError(response.data.messageInfo);
									}
								}.bind(this));
						}).catch(() => {
							// this.$message({
							//   type: 'info',
							//   message: '已取消'
							// });
						});
					} else {
						this.openError("订单已出重");
					}
				}.bind(this));

			},
			doStop(row) {
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=货物出重&order_uuid=' + row.orderUuid).then(function(
					response) {
					if (!response.data.data) {
						this.$confirm('你确定要废除主单吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
							center: true
						}).then(() => {
							let params = '{"orderUuid":"' + row.orderUuid + '","awbId":' + row.awbId + '}';
							this.$axios.post2('/afbase/aforder/doStop', params)
								.then(function(response) {
									if (response.data.code == 0) {
										this.openSuccess();
										this.findByPage();
									} else {
										this.openError(response.data.messageInfo);
									}
								}.bind(this));
						}).catch(() => {
							// this.$message({
							//   type: 'info',
							//   message: '已取消'
							// });
						});
					} else {
						this.openError("订单已出重");
					}
				}.bind(this));

			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
          //从数据库查询设置信息
          let pageName = '订单操作管理/空运进口/AI订单';
          this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
              .then(function(response) {
                  let ai_list_column = response.data.data;
                  if(ai_list_column && ai_list_column.length>0){
                      this.query.columnStrs = JSON.stringify(ai_list_column);
                  }else{
                      this.query.columnStrs = '';
                  }
                  this.exportExcelSure();
              }.bind(this));
					/*let userId = window.localStorage.getItem('userId');
					let ai_list_column = window.localStorage.getItem(userId + '_ai_list_column');
					if (ai_list_column) {
						this.query.columnStrs = ai_list_column;
					} else {
						this.query.columnStrs = '';
					}
					this.exportExcelSure();*/
				}).catch(() => {
					this.query.columnStrs = '';
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/afbase/aforder/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = 'AI订单列表' + '.xls'; // 下载后文件名
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			inboundSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError1(info) {
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
			formatStatus(row, column) {
				return row.userStatus == true ? "生效" : row.userStatus == false ? "失效" : "";
			},
			formatter1(row, column) {
				return row.isConsol == true ? "√" : row.isConsol == false ? "" : "";
			},
			formatter11(row, column) {
				let planPieces = '-';
				let confirmPieces = '-';
				if (row.planPieces || row.planPieces === 0) {
					planPieces = row.planPieces
				}
				if (row.confirmPieces || row.confirmPieces === 0) {
					confirmPieces = row.confirmPieces
				}
				if (planPieces != '-') {
					planPieces = this.getNumber0(planPieces);
				}
				if (confirmPieces != '-') {
					confirmPieces = this.getNumber0(confirmPieces);
				}
				return planPieces + "/" + confirmPieces;
			},
			formatter22(row, column) {
				let planWeight = '-';
				let confirmWeight = '-';
				if (row.planWeight || row.planWeight === 0) {
					planWeight = row.planWeight
				}
				if (row.confirmWeight || row.confirmWeight === 0) {
					confirmWeight = row.confirmWeight
				}
				if (planWeight != '-') {
					planWeight = this.getNumber1(planWeight);
				}
				if (confirmWeight != '-') {
					confirmWeight = this.getNumber1(confirmWeight);
				}
				return planWeight + "/" + confirmWeight;
			},
			formatter33(row, column) {
				let planVolume = '-';
				let confirmVolume = '-';
				if (row.planVolume || row.planVolume === 0) {
					planVolume = row.planVolume
				}
				if (row.confirmVolume || row.confirmVolume === 0) {
					confirmVolume = row.confirmVolume
				}
				if (planVolume != '-') {
					planVolume = this.getNumber3(planVolume);
				}
				if (confirmVolume != '-') {
					confirmVolume = this.getNumber3(confirmVolume);
				}
				return planVolume + "/" + confirmVolume;
			},
			formatter44(row, column) {
				let planChargeWeight = '-';
				let confirmChargeWeight = '-';
				if (row.planChargeWeight || row.planChargeWeight === 0) {
					planChargeWeight = row.planChargeWeight
				}
				if (row.confirmChargeWeight || row.confirmChargeWeight === 0) {
					confirmChargeWeight = row.confirmChargeWeight
				}
				if (planChargeWeight != '-') {
					planChargeWeight = this.getNumber1(planChargeWeight);
				}
				if (confirmChargeWeight != '-') {
					confirmChargeWeight = this.getNumber1(confirmChargeWeight);
				}
				return planChargeWeight + "/" + confirmChargeWeight;
			},
			formatDate(row, column) {
				if (row[column.property]) {
					return (row[column.property]).substr(0, 10)
				} else {
					return ""
				}

			},
			getDateTime(theDate) {
				// theDate.setDate(theDate.getDate()-30);
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				// _month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01 00:00:00";
				// return _year + "-" + _month + "-" + _date;
			},
			continueOperation(data) {
				this.$confirm('是否继续录入 托书信息 等内容 ？', '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					//this.frow = {data:data,continue:true}
					this.frow = data;
					this.frow.activeName = "fourth";
					this.frow.editButtonFlag2 = true;
					this.frow.letterButtonFlag2 = true;
					this.frow.weighttagButtonFlag2 = true;
					this.editVisible = true;

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			getNumber0(data) {
				return data.toFixed(0).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getNumber1(data) {
				return data.toFixed(1).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getNumber3(data) {
				return data.toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			awbSubmit(row) {
				this.$axios.post('/afbase/aforder/awbSubmit/' + row.orderUuid)
					.then(function(response) {
						window.open(response.data.data)
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this));

			},
			getSummaries(param) {
				const sums = [];
				sums[0] = '总计';

				let loaclJsonArray = this.tableColumns;
				if (loaclJsonArray) {
					for (let i = 0; i < loaclJsonArray.length; i++) {
						if (this.data2.length > 0) {
							if (loaclJsonArray[i].prop === "planPieces") {
								sums[i + 1] = this.getNumber0(this.data2[0].planPieces);
							}
							if (loaclJsonArray[i].prop === "planWeight") {
								sums[i + 1] = this.getNumber1(this.data2[0].planWeight);
							}
							if (loaclJsonArray[i].prop === "planVolume") {
								sums[i + 1] = this.getNumber3(this.data2[0].planVolume);
							}
							if (loaclJsonArray[i].prop === "planChargeWeight") {
								sums[i + 1] = this.getNumber1(this.data2[0].planChargeWeight);
							}
						}
					}
				}
				return sums;
			},
			dgdMake() {
				let routeUrl = this.$router.resolve({
					path: "/af_order",
					query: {
						flag: true,
						data: this.currRow.orderUuid,
						name: 'dgdMake'
					}
				});
				window.open(routeUrl.href, '_blank');
			},
			waybillMake() {
				//this.openError1("功能暂未开通，敬请期待");
				//return;
				if (this.currRow.awbNumber) {
          let awbNumber;
          if(this.currRow.awbNumber.indexOf('/') !== -1){
              awbNumber = this.currRow.awbNumber.split('/')[0];
          }else{
              awbNumber = this.currRow.awbNumber;
          }
					let routeUrl = this.$router.resolve({
						path: "/ai_order",
						query: {
							flag: true,
							awbUuid: this.currRow.awbUuid,
							awbNumber: awbNumber,
							flightNumber: this.currRow.expectFlight,
							orderCode: this.currRow.orderCode,
							orderUuid: this.currRow.orderUuid,
							hawbNumber: this.currRow.hawbNumber,
							name: 'waybillMakeAi'
						}
					});
					window.open(routeUrl.href, '_blank');
				} else {
					this.openError1("未配主单号，不能制作运单");
				}
			},
			init() {

				//按钮权限开始
				let buttonInfo = window.localStorage.getItem('buttonInfo')
				if (buttonInfo.indexOf('ai-order-add') > -1) {
					this.addButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai-order-excel') > -1) {
					this.excelButtonFlag = true;
				}

				if (buttonInfo.indexOf('ai-order-view') > -1) {
					this.viewButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai-order-edit') > -1) {
					this.editButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai-order-services') > -1) {
					this.servicesButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai-order-file') > -1) {
					this.fileButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai-order-twoCode') > -1) {
					this.twoCodeButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai-order-twoCode-view') > -1) {
					this.twoCodeButtonFlag1 = true;
				}
				if (buttonInfo.indexOf('ai-order-twoCode-share') > -1) {
					this.twoCodeButtonFlag2 = true;
				}
				if (buttonInfo.indexOf('ai_order_letter_make') > -1) {
					this.letterMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai_order_letter_make_1') > -1) {
					this.letterMakeButtonFlag1 = true;
				}
				if (buttonInfo.indexOf('ai_order_letter_make_2') > -1) {
					this.letterMakeButtonFlag2 = true;
				}
				if (buttonInfo.indexOf('ai_order_print_letter') > -1) {
					this.printletterButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai_order_print_letter_1') > -1) {
					this.printletterButtonFlag1 = true;
				}
				if (buttonInfo.indexOf('ai_order_print_letter_2') > -1) {
					this.printletterButtonFlag2 = true;
				}
				if (buttonInfo.indexOf('ai_order_print_letter_3') > -1) {
					this.printletterButtonFlag3 = true;
				}
				if (buttonInfo.indexOf('ai_order_todo') > -1) {
					this.todoButtonFlag = true;
				}
				if (buttonInfo.indexOf('ai_order_todo_1') > -1) {
					this.todoButtonFlag1 = true;
				}
				if (buttonInfo.indexOf('ai_order_todo_2') > -1) {
					this.todoButtonFlag2 = true;
				}
				if (buttonInfo.indexOf('ai-order-services-income') > -1) {
					this.incomeServicePermissionButton = true
				}
				//按钮权限结束



				this.query.flightDateBegin = this.getDateTime(new Date());
				// this.query.createTimeBegin = this.getDateTime(new Date());
			},
			handlerOrderCellClick(row, column, cell, event) {
				if ("订单号" == column['label']) {
					this.showTrack(row);
				} else if ("主单号" == column['label']) {
					if (row.awbNumber) {
						this.checkTwoCode(row);
					}
				}
			},
			cellClick(row, label) {
				if ("订单号" == label) {
					if (this.editButtonFlag) {
						this.showedit(row)
					} else if (this.viewButtonFlag) {
						this.showView(row)
					} else {
						this.openError('当前用户无此权限，请联系管理员！')
					}
				} else if ("运单号" == label) {
					this.showTrack(row);
					// if (row.awbNumber) {
					// 	this.checkTwoCode(row);
					// }
				}
			},
			setSalesName(vId) {
				let obj = {};
				obj = this.useroptions2.find((item) => {
					return item.value === vId;
				});
				if (obj) {
					this.query.salesName = obj.label;
				}

			},
			setServicerName(vId) {
				let obj = {};
				obj = this.useroptions2.find((item) => {
					return item.value === vId;
				});
				if (obj) {
					this.query.servicerName = obj.label;
				}
			},
			setCreatorName(vId) {
				let obj = {};
				obj = this.useroptions2.find((item) => {
					return item.value === vId;
				});
				if (obj) {
					this.query.creatorName = obj.label;
				}
			},
			clickOrderCodeCell(row) {
				if (row['awbNumber']) {
					this.showTrack(row);
				}
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
      this.$axios.get('/hrs/org/getOrderFinanceLockView/AI').then(function(response) {
          // this.useroptions2 = response.data.data;
          if(response.data.data && response.data.data == true){
              this.orderFinanceLockViewFlag = true;
          }else{
              this.orderFinanceLockViewFlag = false;
          }
      }.bind(this))
      //从数据库查询设置信息
      let pageName = '订单操作管理/空运进口/AI订单';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let ai_list_column = response.data.data;
              if(ai_list_column && ai_list_column.length>0){
                  this.tableColumns = this.sortBykey(ai_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.aiInfo, 'index');
              }
          }.bind(this));
			/*let userId = window.localStorage.getItem('userId');
			let ai_list_column = window.localStorage.getItem(userId + '_ai_list_column');
			if (ai_list_column) {
				let arrayC = JSON.parse(ai_list_column)
				if (arrayC && arrayC.length > 0) {
					this.tableColumns = this.sortBykey(arrayC, 'index');
				}
			} else {
				this.tableColumns = this.sortBykey(columns.aiInfo, 'index');
			}*/
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions2 = response.data.data;
			}.bind(this));
			if (this.$route.query.flag) {
				let buttonInfo = window.localStorage.getItem('buttonInfo')
				if (this.$route.query.name == 'dgdMake') {
					if (buttonInfo == null || buttonInfo.indexOf('af-order-dgdMake') == -1) {
						this.$router.push("/noPermission")
						return
					}
					this.frow.dgdMake = {
						'orderUuid': this.$route.query.data
					}
					this.dgdVisible = true
				} else if (this.$route.query.name == 'waybillMakeAi') {
					if (buttonInfo == null || buttonInfo.indexOf('af-order-waybillMake') == -1) {
						this.$router.push("/noPermission")
						return
					}
					this.frow.waybillMake = {
						awbUuid: this.$route.query.awbUuid,
						awbNumber: this.$route.query.awbNumber,
						flightNumber: this.$route.query.flightNumber,
						orderUuid: this.$route.query.orderUuid,
						orderCode: this.$route.query.orderCode,
						hawbNumber: this.$route.query.hawbNumber,
					}
					this.waybillMakeVisible = true
				} else if (this.$route.query.name == 'edit') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.editVisible = true;
				} else if (this.$route.query.name == 'save') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.saveVisible = true;
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
<style type="text/css">
	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
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
