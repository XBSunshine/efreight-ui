<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<div ref="ae_order_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.awbNumber" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">主运单号</template>
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
								<template slot="prepend">航班日期</template>
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
							<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
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
							<el-input v-model="query.coopName" auto-complete="off" clearable style="width:314px;">
								<template slot="prepend">客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.expectFlight" auto-complete="off" clearable style="width:190px;" @input="query.expectFlight=query.expectFlight.toUpperCase()">
								<template slot="prepend">航班号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:157px;">
								<template slot="prepend">航线</template>
								<el-select slot="suffix" clearable v-model="query.routingName" placeholder="请选择" style="width:116px;margin-right: -5px;">
									<el-option v-for="item in routingNames" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="39px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting" v-if="setButtonFlag">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel" v-if="excelButtonFlag">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:210px;" @input="query.customerNumber=query.customerNumber.toUpperCase()">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.awbFromName" auto-complete="off" clearable style="width:314px;">
								<template slot="prepend">运单来源</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:190px;">
								<template slot="prepend">服务产品</template>

								<el-select slot="suffix" clearable v-model="query.businessProduct" filterable placeholder="请选择" style="width:121px;margin-right: -5px;">
									<el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:171px;">
								<template slot="prepend">责任客服</template>
								<el-select slot="suffix" clearable v-model="query.servicerName" filterable placeholder="请选择" @change="setServicerName" style="width:103px;margin-right: -5px;">
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
							<el-input style="width:171px;">
								<template slot="prepend">责任销售</template>
								<el-select slot="suffix" clearable v-model="query.salesName" filterable placeholder="请选择" @change="setSalesName" style="width:103px;margin-right: -5px;">
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
							<el-input style="width:172px;">
								<template slot="prepend">责任操作</template>
								<el-select slot="suffix" clearable v-model="query.creatorName" filterable placeholder="请选择" style="width:103px;margin-right: -5px;">
									<el-option v-for="item in useroptions2" :key="item.value" :label="item.label" :value="item.label3">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:208px;">
								<template slot="prepend">创建日期</template>
								<el-date-picker slot="suffix" v-model="query.createTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 139px;margin-right: -5px;">
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
							<el-input style="width:171px;">
								<template slot="prepend">收入完成</template>
								<el-select slot="suffix" v-model="query.incomeRecorded" placeholder="请选择" style="width:103px;margin-right: -5px;">
									<el-option label="全部" value=""></el-option>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:171px;">
								<template slot="prepend">成本完成</template>
								<el-select slot="suffix" v-model="query.costRecorded" placeholder="请选择" style="width:103px;margin-right: -5px;">
									<el-option label="全部" value=""></el-option>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-show="orderFinanceLockViewFlag">
						<el-form-item label-width="10px">
							<el-input style="width:172px;">
								<template slot="prepend">财务锁账</template>
								<el-select slot="suffix" clearable v-model="query.orderStatus" filterable placeholder="请选择" style="width:103px;margin-right: -5px;">
									<el-option label="已锁账" value="1"></el-option>
									<el-option label="未锁账" value="0"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<!-- max- tableHeight -->
		<el-table v-loading="loading" :data="data1" show-summary class="AEOrderList table_settle" highlight-current-row :summary-method="getSummaries" stripe border :max-height="tableHeight" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
			<el-table-column label="操作" align="center" fixed width="45">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="view" v-if="viewButtonFlag">查看订单</el-dropdown-item>
							<el-dropdown-item command="edit" v-if="editButtonFlag">编辑订单</el-dropdown-item>
							<el-dropdown-item command="weight" v-if="weighttagButtonFlag">操作出重</el-dropdown-item>
							<el-dropdown-item command="orderFiles" v-if="fileButtonFlag">附件上传</el-dropdown-item>
							<el-dropdown-item command="incomeCost" v-if="servicesButtonFlag">费用录入</el-dropdown-item>
							<el-dropdown-item command="rountingSign" v-if="afRountingSignFlag">航线签单</el-dropdown-item>
							<el-dropdown-item v-if="twoCodeMakeButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">二维码<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="checkTwoCode" v-if="checkTwoCodeMakeButtonFlag">订单跟踪码</el-dropdown-item>
										<el-dropdown-item command="deliveryNotice-storehouse">送货通知码-普货库房</el-dropdown-item>
										<el-dropdown-item command="deliveryNotice-warehouse">送货通知码-交货货站</el-dropdown-item>
										<el-dropdown-item command="share" v-if="orderShareFlag">订单协作</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>

							<el-dropdown-item v-if="documentMakeButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">单证制作<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="shippingMake" v-if="shippingMakeButtonFlag">舱单制作</el-dropdown-item>
										<el-dropdown-item command="shippingSend" v-if="shippingSendButtonFlag">发送舱单</el-dropdown-item>
										<el-dropdown-item command="waybillMake" v-if="waybillMakeButtonFlag">运单制作</el-dropdown-item>
										<el-dropdown-item command="dgdMake" v-if="dgdMakeButtonFlag">DGD制作</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item v-if="printButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">打印单据<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="orderLetter" v-if="printletterButtonFlag">订舱托书</el-dropdown-item>
										<el-dropdown-item command="awbSubmit" v-if="awbsubmitButtonFlag">运单确认件</el-dropdown-item>
										<el-dropdown-item command="printLetter" v-if="deliveryButtonFlag">交货托书</el-dropdown-item>
										<el-dropdown-item command="printAirCargoManifest">货物舱单</el-dropdown-item>
										<el-dropdown-item command="tagMake" v-if="tagMakeButtonFlag">标签打印</el-dropdown-item>
										<el-dropdown-item command="amountBillPrint" v-if="amountBillPrintButtonFlag&&incomeServicePermissionButton">账单预览</el-dropdown-item>
										<el-dropdown-item command="amountBillSend" v-if="amountBillSendButtonFlag&&incomeServicePermissionButton">发送账单</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item v-if="specialButtonFlag">
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link ">特殊处理<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="copyOrderSave" v-if="copyOrderSaveButtonFlag">复制新增</el-dropdown-item>
										<el-dropdown-item command="uninstall" v-show="scope.row.awbNumber" v-if="uninstallButtonFlag">卸载主单</el-dropdown-item>
                    <el-dropdown-item command="concelSign" v-if="afCencelSignFlag">撤销签单</el-dropdown-item>
										<el-dropdown-item command="forceStop" v-if="forcestopButtonFlag">强制关闭</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label!='订单号'&&item.label!='主运单号'&&item.label!='收入完成'&&item.label!='成本完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
				<el-table-column v-if="item.label=='收入完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortIncomeRecorded">
				</el-table-column>
				<el-table-column v-if="item.label=='成本完成'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostRecorded">
				</el-table-column>
				<el-table-column v-if="item.label=='订单号'||item.label=='主运单号'" :key="index" :label="item.label" :prop="item.prop" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
			</template>

		</el-table>
		<!-- style=" position: fixed;bottom:0px; height:60px; " -->
		<div class="pagination" ref="ae_order_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		<viewVisibleTag ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewVisibleTag>
		<matchVisibleTag ref="addMission" v-if="matchVisible" :visible.sync="matchVisible" :frow="frow"></matchVisibleTag>
		<copyOrderSave ref="addMission" v-if="copyOrderSaveVisible" :visible.sync="copyOrderSaveVisible" :frow="frow"></copyOrderSave>
		<forceStop ref="addMission" v-if="forceStopVisible" :visible.sync="forceStopVisible" :frow="frow"></forceStop>
		<dgd ref="addMission" v-if="dgdVisible" :visible.sync="dgdVisible" :frow="frow"></dgd>
		<trackVisibleTag ref="addMission" v-if="trackVisible" :visible.sync="trackVisible" :frow="frow"></trackVisibleTag>
		<waybillMake ref="addMission" v-if="waybillMakeVisible" :visible.sync="waybillMakeVisible" :frow="frow"></waybillMake>
		<qrCodeShareVisibleTab ref="addMission" v-if="qrCodeShareVisible" :visible.sync="qrCodeShareVisible" :frow="frow"></qrCodeShareVisibleTab>
		<qrCodeViewVisibleTab ref="addMission" v-if="qrCodeViewVisible" :visible.sync="qrCodeViewVisible" :frow="frow"></qrCodeViewVisibleTab>
		<tagPrint ref="addMission" v-if="tagPrintVisible" :visible.sync="tagPrintVisible" :frow="frow"></tagPrint>
		<!--<selectTemplate ref="addMission" v-if="selectTemplateVisible" :visible.sync="selectTemplateVisible" :frow="frow"></selectTemplate>-->
		<selectPrintMethod ref="addMission" v-if="selectPrintMethodVisible" :visible.sync="selectPrintMethodVisible" :frow="frow"></selectPrintMethod>
		<amountBillPrint ref="addMission" v-if="printAmountBillVisible" :visible.sync="printAmountBillVisible" :frow="frow"></amountBillPrint>
		<amountBillPrintMore ref="addMission" v-if="printAmountBillMoreVisible" :visible.sync="printAmountBillMoreVisible" :frow="frow"></amountBillPrintMore>
		<amountBillSend ref="addMission" v-if="amountBillSendVisible" :visible.sync="amountBillSendVisible" :frow="frow"></amountBillSend>
		<amountBillSendList ref="addMission" v-if="amountBillSendListVisible" :visible.sync="amountBillSendListVisible" :frow="frow"></amountBillSendList>
		<deliveryNotice ref="addMission" v-if="deliveryNoticeVisible" :visible.sync="deliveryNoticeVisible" :frow="frow"></deliveryNotice>
		<deliveryNoticeShare ref="addMission" v-if="deliveryNoticeShareVisible" :visible.sync="deliveryNoticeShareVisible" :frow="frow"></deliveryNoticeShare>
		<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="frow"></customerSelect>
		<orderShareQrcodeTab ref="addMission" v-if="orderShareQrcodeVisible" :visible.sync="orderShareQrcodeVisible" :frow="frow"></orderShareQrcodeTab>
		<orderShareQrcodeEmailTab ref="addMission" v-if="orderShareQrcodeEmailVisible" :visible.sync="orderShareQrcodeEmailVisible" :frow="frow"></orderShareQrcodeEmailTab>
		<rountingSignTab ref="addMission" v-if="rountingSignVisible" :visible.sync="rountingSignVisible" :frow="frow"></rountingSignTab>
		</el-container>
	</div>
</template>
<script>
	import setVisibleVue from './order/af_order_setting'
	import saveVisibleVue from './order/af_order_base_save'
	import editVisibleVue from './order/af_order_edit_tabs'
	// import editVisibleVue from './order/af_order_base_edit'
	import viewVisibleVue from './order/af_order_edit_tabs'
	import matchVisibleVue from './order/af_order_match'
	import ForceStop from './order/af_order_forceStop'
	import DGD from './order/billMake/dgdMake'
	import trackVisibleVue from './order/orderTrack/af_order_track'
	import WaybillMake from './order/billMake/waybillMake'
	import QRCodeShareVue from './order/qrCode/af_order_qrcode_share'
	import QRCodeViewVue from './order/qrCode/af_order_qrcode_view'
	import CopyOrderSave from './order/af_order_copyOrderSave'
	import {
		orderDisplayRule
	} from "../../common/order/orderDisplayRule";
	import TagPrint from './operationPlan/af_operationPlan_tagPrint'
	//import SelectTemplate from './order/printLetter_template_select'
	import SelectPrintMethod from './order/select_printLetter_method'
	import AmountBillPrint from './cssDebitNote/af_debit_note_print'
	import AmountBillPrintMore from './order/cssDebitNotePrint/af_css_debit_note_select'
	import AmountBillSend from './order/cssDebitNoteSend/af_css_debit_note_send'
	import AmountBillSendList from './order/cssDebitNoteSend/af_css_debit_note_send_list'
	import DeliveryNotice from './order/deliveryNotice/af_order_delivery_notice'
	import DeliveryNoticeShare from './order/deliveryNotice/af_order_delivery_notice_share'
	import columns from './order/af_order_column.json'
	import CustomerSelect from '@/views/af/order/share/coop_share_select'
	import OrderShareQrcode from '@/views/af/order/share/order_share_qrcode.vue'
	import OrderShareQrcodeEmail from '@/views/af/order/share/order_share_qrcode_email.vue'
	import rountingSignVisibleVue from './order/rountingSign/rountingSign.vue'
	export default {
		data() {
			return {
				rountingSignVisible:false,
				tableHeight: '550px',
				orderFinanceLockViewFlag: false,
				orderShareFlag: false,
				setButtonFlag: true,
				addButtonFlag: false,
				excelButtonFlag: false,
				trackButtonFlag: true,
				viewButtonFlag: false,
				editButtonFlag: false,
				fileButtonFlag: false,
				uninstallButtonFlag: false,
				letterButtonFlag: false,
				weighttagButtonFlag: false,
				servicesButtonFlag: false,
				forcestopButtonFlag: false,
				copyOrderSaveButtonFlag: false,
				matchButtonFlag: false,
				printletterButtonFlag: false,
				awbsubmitButtonFlag: false,
				dgdMakeButtonFlag: false,
				tagMakeButtonFlag: false,
				amountBillPrintButtonFlag: false,
				amountBillSendButtonFlag: false,
				twoCodeMakeButtonFlag: false,
				checkTwoCodeMakeButtonFlag: false,
				shareTwoCodeButtonFlag: false,
				shippingMakeButtonFlag: false,
				shippingSendButtonFlag: false,
				waybillMakeButtonFlag: false,
        afRountingSignFlag:false,
        afCencelSignFlag:false,
				printButtonFlag: false,
				deliveryButtonFlag: false,
				documentMakeButtonFlag: false,
				specialButtonFlag: false,
				incomeServicePermissionButton: false,
				customerSelectVisible: false,
				orderShareQrcodeVisible: false,
				orderShareQrcodeEmailVisible: false,
				productOptions: [],
				useroptions2: [],
				contactsOptions: [],
				orderContacts: [],
				routingNames: [],
				/*表数据*/
				data1: [],
				tableColumns: [],
				data2: [],
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
					orderStatus: '0',
					awbNumber: '',
					awbFromName: '',
					incomeRecorded: '',
					costRecorded: '',
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
                    routingName: ''
				},
				setVisible: false,
				saveVisible: false,
				editVisible: false,
				viewVisible: false,
				matchVisible: false,
				forceStopVisible: false,
				copyOrderSaveVisible: false,
				dgdVisible: false,
				waybillMakeVisible: false,
				trackVisible: false,
				qrCodeShareVisible: false,
				qrCodeViewVisible: false,
				showFlag: false,
				frow: {},
				currRow: '',
				loading: false,
				tagPrintVisible: false,
				//selectTemplateVisible: false,
				selectPrintMethodVisible: false,
				printAmountBillVisible: false,
				printAmountBillMoreVisible: false,
				amountBillSendVisible: false,
				amountBillSendListVisible: false,
				deliveryNoticeVisible: false,
				deliveryNoticeShareVisible: false,
				cancelButtonClass: 'btn-custom-cancel-hidden'
			}
		},
		components: {
			'customerSelect': CustomerSelect,
			'setVisibleTag': setVisibleVue,
			'saveVisibleTag': saveVisibleVue,
			'editVisibleTag': editVisibleVue,
			'viewVisibleTag': viewVisibleVue,
			'matchVisibleTag': matchVisibleVue,
			'forceStop': ForceStop,
			'copyOrderSave': CopyOrderSave,
			'dgd': DGD,
			'waybillMake': WaybillMake,
			'trackVisibleTag': trackVisibleVue,
			'qrCodeShareVisibleTab': QRCodeShareVue,
			"qrCodeViewVisibleTab": QRCodeViewVue,
			'tagPrint': TagPrint,
			/*'selectTemplate': SelectTemplate,*/
			'amountBillPrint': AmountBillPrint,
			'amountBillPrintMore': AmountBillPrintMore,
			'amountBillSend': AmountBillSend,
			'amountBillSendList': AmountBillSendList,
			'deliveryNotice': DeliveryNotice,
			'deliveryNoticeShare': DeliveryNoticeShare,
			'selectPrintMethod': SelectPrintMethod,
			'orderShareQrcodeTab': OrderShareQrcode,
			'orderShareQrcodeEmailTab': OrderShareQrcodeEmail,
			'rountingSignTab':rountingSignVisibleVue
		},
		provide() {
			return {
				setShareValue: this.setShareValue,
				findByPage: this.findByPage,
				columnSetCallback: this.columnSetCallback,
				continueOperation: this.continueOperation,
				awbSubmit: this.awbSubmit,
				shareTwoCode: this.shareTwoCode,
				setValue: this.setValue,
				deliveryNoticeShare: this.deliveryNoticeShare,
				orderShareQrcodeEmail: this.orderShareQrcodeEmail,
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
				// this.$refs.table.doLayout();
				this.setHeight();
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
					localStorage.setItem(userId + '_af_list_column_width', JSON.stringify(arrayC))
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
				} else if (column.property === "pickUpDeliveryService") {
					let k = '';
					if (row.pickUpDeliveryService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "warehouseService") {
					let k = '';
					if (row.warehouseService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "outfieldService") {
					let k = '';
					if (row.outfieldService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "customsClearanceService") {
					let k = '';
					if (row.customsClearanceService) {
						k = "duihao_af duihao_icn"
					}
					return k;
				} else if (column.property === "arrivalCustomsClearanceService") {
					let k = '';
					if (row.arrivalCustomsClearanceService) {
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
			//标题 stly
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
				} else if (data.column.property === "pickUpDeliveryService") {
					let k = '';
					if (data.row.pickUpDeliveryService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "warehouseService") {
					let k = '';
					if (data.row.warehouseService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "outfieldService") {
					let k = '';
					if (data.row.outfieldService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "customsClearanceService") {
					let k = '';
					if (data.row.customsClearanceService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "arrivalCustomsClearanceService") {
					let k = '';
					if (data.row.arrivalCustomsClearanceService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "deliveryService") {
					let k = '';
					if (data.row.deliveryService) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "confirmPieces") {
					let k = '';
					if (this.piecesFlag(data.row)) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "confirmWeight") {
					let k = '';
					if (this.weightFlag(data.row)) {
						k = "color:red;"
					}
					return k;

				} else if (data.column.property === "confirmVolume") {
					let k = '';
					if (this.volumeFlag(data.row)) {
						k = "color:red;"
					}
					return k;

				} else if (data.column.property === "confirmChargeWeight") {
					let k = '';
					if (this.chargeWeightFlag(data.row)) {
						k = "color:red;"
					}
					return k;
				} else if (data.column.property === "confirmDensity") {
					let k = '';
					if (this.densityFlag(data.row)) {
						k = "color:red;"
					}
					return k;
				} else {
					return "";
				}
			},
			formatter_column(row, column) {
				if (column.property === "awbNumber") {
					return row.awbNumber;
				}
				if (column.property === "orderCode") {
					return row.orderCode;
				}
				if (column.property === "orderStatus") {
					return row.orderStatus;
				}
				if (column.property === "planPieces") {
					let planPieces = "-";
					if (row.planPieces || row.planPieces == 0) {
						planPieces = this.getNumber4(row.planPieces)
					}
					return planPieces;
				}
				if (column.property === "planWeight") {
					let planWeight = "-";
					if (row.planWeight || row.planWeight == 0) {
						planWeight = this.getNumber4(row.planWeight);
					}
					return planWeight;
				}
				if (column.property === "planVolume") {
					let planVolume = "-";
					if (row.planVolume || row.planVolume == 0) {
						planVolume = this.getNumber4(row.planVolume);
					}
					return planVolume;
				}
				if (column.property === "planChargeWeight") {
					let planChargeWeight = "-";
					if (row.planChargeWeight || row.planChargeWeight == 0) {
						planChargeWeight = this.getNumber4(row.planChargeWeight);
					}
					return planChargeWeight;
				}
				if (column.property === "planDensity") {
					let planDensity = "-";
					if (row.planDensity || row.planDensity == 0) {
						planDensity = this.getNumber4(row.planDensity);
					}
					return planDensity;
				}
				if (column.property === "confirmPieces") {
					return this.formatter11(row, column);
				}
				if (column.property === "confirmWeight") {
					return this.formatter22(row, column);
				}
				if (column.property === "confirmVolume") {
					return this.formatter33(row, column);
				}
				if (column.property === "confirmChargeWeight") {
					return this.formatter44(row, column);
				}
				if (column.property === "confirmDensity") {
					return this.formatter55(row, column);
				}
				if (column.property === "expectFlight") {
					return row.expectFlight;
				}
				if (column.property === "expectDeparture") {
					return row.expectDeparture;
				}
				if (column.property === "departureStation") {
					return row.departureStation;
				}
				if (column.property === "arrivalStation") {
					return row.arrivalStation;
				}
				if (column.property === "goodsSourceCode") {
					return row.goodsSourceCode;
				}
				if (column.property === "coopName") {
					return row.coopName;
				}
				if (column.property === "awbFromName") {
					return row.awbFromName;
				}
				if (column.property === "customerNumber") {
					return row.customerNumber;
				}
				if (column.property === "businessProduct") {
					return row.businessProduct;
				}
				if (column.property === "hawbQuantity") {
					if (row.hawbQuantity == null || row.hawbQuantity === '' || row.hawbQuantity === '0' || row.hawbQuantity === 0) {
						return '直单';
					} else {
						return row.hawbQuantity;
					}
				}
				if (column.property === "departureWarehouseName") {
					if (row.departureWarehouseName == null || row.departureWarehouseName === "") {
						return '';
					} else {
						return row.departureWarehouseName;
					}
				}
				if (column.property === "departureStorehouseName") {
					if (row.departureStorehouseName == null || row.departureStorehouseName === "") {
						return '';
					} else {
						return row.departureStorehouseName;
					}
				}
				if (column.property === "goodsNameCn") {
					if (row.goodsNameCn != null && row.goodsNameCn != "" && row.goodsNameCn.length > 10) {
						return row.goodsNameCn.substr(0, 10) + "...";
					} else {
						return row.goodsNameCn;
					}
				}
				if (column.property === "goodsType") {
					return row.goodsType;
				}
				if (column.property === "batteryType") {
					return row.batteryType;
				}
				if (column.property === "salesName") {
					if (row.salesName) {
						return row.salesName.split(' ')[0];
					} else {
						return "";
					}
				}
				if (column.property === "servicerName") {
					if (row.servicerName) {
						return row.servicerName.split(' ')[0];
					} else {
						return "";
					}
				}
				if (column.property === "creatorName") {
					if (row.creatorName) {
						return row.creatorName.split(' ')[0];
					} else {
						return "";
					}
				}
				if (column.property === "orderRemark") {
					return row.orderRemark;
				}
				if (column.property === "customerCode") {
					return row.customerCode;
				}
				if (column.property === "supplierCode") {
					return row.supplierCode;
				}
				return row[column.property]
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},

			setting() {
				this.setVisible = true;

			},

			piecesFlag(row) {
				return orderDisplayRule.checkPieces(row.planPieces, row.confirmPieces);
			},
			weightFlag(row) {
				return orderDisplayRule.checkFlag(row.planWeight, row.confirmWeight);
			},
			chargeWeightFlag(row) {
				return orderDisplayRule.checkFlag(row.planChargeWeight, row.confirmChargeWeight);
			},
			volumeFlag(row) {
				return orderDisplayRule.volumeFlag(row.planVolume, row.confirmVolume)
			},
			densityFlag(row) {
				return orderDisplayRule.checkPieces(row.planDensity, row.confirmDensity);
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'view') {
					this.showView(this.currRow)
				} else if (command == 'letter') {
					this.showletter(this.currRow)
				} else if (command == 'weight') {
					this.showWeight(this.currRow)
				} else if (command == 'incomeCost') {
					this.showincomeCost(this.currRow)
				} else if (command == 'uninstall') {
					this.doDelete(this.currRow)
				} else if (command == 'stop') {
					this.doStop(this.currRow)
				} else if (command == 'orderMatch') {
					this.showOrderMatch(this.currRow)
				} else if (command == 'orderLetter') {
					this.printOrderLetter(this.currRow)
				} else if (command == 'awbSubmit') {
					this.awbSubmit(this.currRow)
				} else if (command == 'forceStop') {
					this.doForceStop(this.currRow)
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
				} else if (command == 'shippingSend') {
					this.shippingSend(this.currRow)
				} else if (command == 'printLetter') {
					this.printLetter(this.currRow)
				} else if (command == 'printAirCargoManifest') {
					this.printAirCargoManifest(this.currRow)
				} else if (command == 'copyOrderSave') {
					this.doCopyOrderSave(this.currRow)
				} else if (command == "tagMake") {
					this.tagMake(this.currRow);
				} else if (command == "amountBillPrint") {
					this.amountBillPrint(this.currRow);
				} else if (command == "amountBillSend") {
					this.amountBillSend(this.currRow);
				} else if (command == "deliveryNotice-warehouse") {
					this.deliveryNotice(this.currRow, 'warehouse');
				} else if (command == "deliveryNotice-storehouse") {
					this.deliveryNotice(this.currRow, 'storehouse');
				} else if (command == "share") {
					this.share(this.currRow);
				}else if(command == "rountingSign"){
					this.rountingSign(this.currRow);
				}else if(command == "concelSign"){
          this.concelSign(this.currRow);
        }

			},
			rountingSign(row){
        //校验 是否满足条件
        //签约公司设置了AE 是航线签约
        //当前订单的服务产品不为空 且 IN （启用签单功能支持的服务产品rounting_sign_business_product）
        //当前订单 配了主单号 （order表 主单uuid不为NULL）
        //当前订单 成本完成cost_recorded = 否
        //当前订单 cost表 服务=‘干线 – 空运费’ 的成本，从未对账 且 从未锁账日期 才可签单

        this.$axios.get2('/afbase/rountingsign/check/'+row.orderId).then((response)=> {
          if(response.data.code==0){
            this.frow = row;
            this.rountingSignVisible = true;
          }else{
            this.openError1(response.data.messageInfo);
          }
        }).catch((error)=> {
        	this.openError1(response.data.messageInfo);
        });
			},
      concelSign(row){
        //是否 已经签单
        this.$axios.get('/afbase/rountingsign/view/' + row.orderId+'/AE')
        	.then(function(response) {
            if(response.data.data&&response.data.data.signState==1){
                //已经签单
                this.$confirm('是否确认撤销签单?', '提示', {
                	confirmButtonText: '是',
                	cancelButtonText: '否',
                	type: 'warning',
                	center: true
                }).then(() => {
                    //未做成本完成 （订单成本完成=0)
                    //成本表 cost ，干线-空运费 从未锁账 且 从未对账
                    this.$axios.get2('/afbase/rountingsign/concelSign/'+row.orderId).then((response)=> {
                      if(response.data.code==0){
                           this.openSuccess();
                           this.findByPage();
                      }else{
                        this.openError1(response.data.messageInfo);
                      }
                    }).catch((error)=> {
                    	this.openError1(response.data.messageInfo);
                    });
                }).catch(() => {

                });
            }else{
               this.openError("订单尚未进行签单");
            }
        	}.bind(this));
      },
			share(row) {
				//分享之前做一次校验
				// this.$axios.get2('/afbase/afOrderShare/afOrderShareCheckOrder/'+row.orderId).then((response)=> {
				//   if(response.data.data){
				//     this.frow = row;
				//     this.frow.orderId = row.orderId;
				//     this.customerSelectVisible = true
				//   }else{
				//      this.openError1(row.orderCode+'订单已经做过分享，无法再次分享');
				//   }
				// }).catch((error)=> {
				// 	console.log(error);
				// });
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + row.orderUuid).then(function(response) {
					if (!response.data.data) {
						this.frow = row;
						this.frow.orderId = row.orderId;
						this.customerSelectVisible = true
					} else {
						this.openError("订单已财务锁账");
					}
				}.bind(this));

			},
			setShareValue(row) {
				// row.coopId
				this.frow = row;
				this.frow.orderOrgId = row.orgId;
				this.frow.shareCoopId = row.coopId;
				this.frow.shareOrgId = row.coopOrgId;
				this.customerSelectVisible = false;
				this.orderShareQrcodeVisible = true;
			},
			orderShareQrcodeEmail(row) {
				this.frow = row;
				this.orderShareQrcodeEmailVisible = true;
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
								if (response.data.data == '货站存在托书模板') {
									this.$axios.get('/afbase/operationPlan/printLetters1/' + row.awbUuid).then((response) => {
										this.frow.awbUuid = row.awbUuid
										this.frow.pdfUrl = response.data.data
                    this.frow.awbNumber = row.awbNumber;
										this.selectPrintMethodVisible = true;
										/*window.open(response.data.data)*/
									}).catch(function(error) {
										console.log(error);
									});
								} else if (response.data.data.indexOf('没有选择交货货站，无法打印交货托书') > -1 || response.data.data == '当前机场没有可使用的托书模板，请联系翌飞管理员' || response.data.data.indexOf('没有可使用的托书模板，无法打印交货托书') > -1) {
									this.openError1(response.data.data);
								} else if (response.data.data == '当前机场有一个可使用的托书模板') {
									this.$axios.get('/afbase/operationPlan/printLetters2/' + row.awbUuid).then((response) => {
										this.frow.awbUuid = row.awbUuid
										this.frow.pdfUrl = response.data.data
										this.selectPrintMethodVisible = true;
										/*window.open(response.data.data)*/
									}).catch(function(error) {
										console.log(error);
									});
								} else if (response.data.data == '当前机场有多个可使用的托书模板') {
									this.frow.awbUuid = row.awbUuid
									this.frow.flag = 'moreTemplate'
									this.selectPrintMethodVisible = true;
									//this.selectTemplateVisible = true;
								}
							} else {

							}
						}.bind(this)).catch(function(error) {
							this.openError1(response.data.messageInfo);

						}.bind(this));

				} else {
					this.$message.error(" 订单号" + customerNumbers + ',未配主单号');
				}
			},
			printAirCargoManifest(row) {
				this.$axios.post3('/afbase/aforder/airCargoManifestPrint/' + row.orderId).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '货物舱单' + '.xlsx'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象

				}).catch(function(error) {
					console.log(error);
				});
			},
			setValue(rrow) {
				this.$axios.get('/afbase/operationPlan/printLetters3?awbUuid=' + this.frow.awbUuid + '&shipperTemplateFile=' + rrow.shipperTemplateFile).then((response) => {
					/*this.$axios.get('/afbase/operationPlan/printLetters3/' + this.frow.awbUuid + '/' + rrow.shipperTemplateFile).then((response) => {*/
					window.open(response.data.data)
				}).catch(function(error) {
					console.log(error);
				});

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

			printOrderLetter(row) {
				/*let host = window.location.host;
				let hostName = host.split(":")[0];
				let orgId = window.localStorage.getItem("orgId");
				let userId = window.localStorage.getItem("userId");
				let url = "http://" + hostName + "/afbase/aforder/printOrderLetter";
				let orderUuid = row.orderUuid;
				this.openPostWindow(url, orgId, orderUuid, userId);*/
				let userId = window.localStorage.getItem("userId");
				this.$axios.post('/afbase/aforder/printOrderLetter1/' + row.orderUuid + '/' + userId).then((response) => {
					window.open(response.data.data)
				}).catch(function(error) {
					console.log(error);
				});
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
						"ifFullscreen": true
					})
				} else {
					this.frow.ifFullscreen = false
					this.saveVisible = true;
				}
			},
			showedit(row) {
				this.frow = row;
				this.frow.viewFlag = true;
				this.frow.activeName = "editTab";
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if (!response.data.data) {
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
					} else {
						this.openError("订单已财务锁账");
					}
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
					this.viewVisible = true;
				}
			},
			showTrack(row) {
				this.frow = row;
				this.frow.activeName = 'editTab';
				this.trackVisible = true;
			},
			doForceStop(row) {
				//				if(row.orderStatus != '订单创建') {
				//					this.openError("只能强制关闭状态为订单创建的订单")
				//					return
				//				}
				this.frow = row;
				this.forceStopVisible = true;
			},
			doCopyOrderSave(row) {
				this.frow = row;
				if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
					this.frow.ifFullscreen = true
					this.jumpToNewPage('copy', this.frow)
				} else {
					this.frow.ifFullscreen = false
					this.copyOrderSaveVisible = true;
				}
			},
			showletter(row) {
				this.frow = row;
				this.frow.activeName = "fourth";
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if (!response.data.data) {
						this.frow.editButtonFlag2 = true;
						this.frow.letterButtonFlag2 = true;
						this.frow.weighttagButtonFlag2 = true;
						this.editVisible = true;
					} else {
						this.openError("订单已财务锁账");
					}
				}.bind(this));

			},
			showWeight(row) {
				this.frow = row;
				this.frow.viewFlag = true;
				this.frow.activeName = "weightTab";
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if (!response.data.data) {
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
					} else {
						this.openError("订单已财务锁账");
					}
				}.bind(this));

			},
			showOrderMatch(row) {
				this.frow = row;
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if (!response.data.data) {
						this.matchVisible = true;
					} else {
						this.openError("订单已财务锁账");
					}
				}.bind(this));

			},
			showincomeCost(row) {
				this.frow = row;
				this.frow.viewFlag = true;
				this.frow.activeName = "serviceTab";
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if (!response.data.data) {
						this.frow.editButtonFlag2 = true;
						this.frow.letterButtonFlag2 = true;
						this.frow.weighttagButtonFlag2 = true;
					} else {
						this.frow.editButtonFlag2 = false;
						this.frow.letterButtonFlag2 = false;
						this.frow.weighttagButtonFlag2 = false;
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow)
					} else {
						this.frow.ifFullscreen = false
						this.editVisible = true;
					}
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

				/*this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if(!response.data.data) {
						this.frow.editButtonFlag2 = true;
						this.frow.letterButtonFlag2 = true;
						this.frow.weighttagButtonFlag2 = true;
						this.editVisible = true;
					} else {
						this.openError("订单已财务锁账");
					}
				}.bind(this));*/

			},

			shippingMake(row) {
				let orderUUID = row['orderUuid'],
					awbNumber = row['awbNumber'];
				if (!awbNumber) {
					this.openError1("未配置主单号，无法制作舱单");
					return;
				}

				this.$axios.get('/afbase/aforder/getShippingData/AE_CD_POST_MAWB ').then(function(response) {
					if (response.data.data) { //找到有效数据
						this.$axios.get("/afbase/aforder/shippingBillDataCheck/AE_CD_POST_MAWB/all/" + orderUUID).then(function(response) {
							function extracted() {
								this.$axios.get("/afbase/aforder/shippingBillData/" + orderUUID).then(function(response) {
									if (response.data.code == 0) {
										let data = response.data.data;
										if (data['url']) {
											this.openFormWind(data['url'], data, "_blank");
										} else {
											this.openError1("打开舱单制作页面失败!");
										}
									} else {
										console.error(response.data.messageInfo);
										this.openError1("打开舱单制作页面失败!");
									}
								}.bind(this));
							}

							if (response.data.code == 0) {
								if (response.data.data == null) {
									extracted.call(this);
								} else {
									this.$confirm(response.data.data, '提示', {
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										dangerouslyUseHTMLString: true,
										customClass: 'message-logout',
										distinguishCancelAndClose: true,
										cancelButtonClass: this.cancelButtonClass,
										confirmButtonClass: "btn-custom-confirm",
										type: 'warning',
										center: true
									}).then(() => {
										extracted.call(this);
									}).catch(() => {});
								}


							}
						}.bind(this));
					} else { //没有找到有效数据
						this.openError1("您好，未开通舱单接口功能，无法制作舱单");
					}
				}.bind(this));
			},
			openFormWind(url, params, target) {
				var tempForm = document.createElement("form");
				tempForm.id = "tempForm1";
				tempForm.method = "post";
				tempForm.action = url;
				tempForm.target = target; // _blank - URL加载到一个新的窗口
				//构建请求参数
				for (var key in params) {
					var value = params[key];
					var nextHideInput = document.createElement("input");
					nextHideInput.type = "hidden";
					nextHideInput.name = key;
					nextHideInput.value = value;
					tempForm.appendChild(nextHideInput);
				}

				document.body.appendChild(tempForm);
				//提交
				//tempForm.dispatchEvent(new Event("submit"));
				tempForm.submit();
				document.body.removeChild(tempForm);
			},

			checkTwoCode(row) {
				this.frow = row;
				this.qrCodeViewVisible = true;
			},
			shareTwoCode(row) {
				this.frow = row;
				this.qrCodeShareVisible = true;
			},
			setHeight() {
				this.$nextTick(() => {
					let ae_order_header = this.$refs.ae_order_header.offsetHeight;
					let ae_order_footer = this.$refs.ae_order_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - ae_order_header - ae_order_footer;
					// heightS = 810-ae_order_header-ae_order_footer-80;

					this.tableHeight = heightS + "px";
					// console.log(this.$refs.ae_order_body);
					// alert(heightS);
				});
			},
			findByPage() {
        let orderPermission = window.localStorage.getItem('orderPermission');//当前用户的订单权限
        this.query.orderPermission = orderPermission;
				this.query.columnStrs = '';
				this.setHeight();
						if (this.tableColumns.length == 0) {
							this.tableColumns = this.sortBykey(columns.afInfo, 'index');
						}
						this.loading = true
						this.$axios.get2("/afbase/aforder/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
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
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/aforder/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			columnSetCallback(){
				//从数据库查询设置信息
				let pageName = '订单操作管理/空运出口/AE订单';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then((response)=> {
						let af_list_column = response.data.data;
						if (af_list_column && af_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.afInfo, 'index');
						}
						this.findByPage()
					}).catch((error)=>{
					this.tableColumns = this.sortBykey(columns.afInfo, 'index')
					this.findByPage()
				})
			},
			doDelete(row) {
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + row.orderUuid).then(function(response) {
					if (!response.data.data) {
						let aa = '<div style="text-align: left"><div>当前主单号 ' + row.awbNumber + '将从当前订单上卸载，请选择该主单号后续是否继续使用</div><div>删除主单：卸载完成后，从运单库中删除该主单号信息</div><div>继续使用：卸载完成后，该主单号回归运单库，可继续使用</div></div>';
						let bb = '<div style="text-align: left"><div>提示: 请选择卸载主运单的方式</div></div>';
						this.$confirm(aa, '提示: 请选择卸载主运单的方式', {
							dangerouslyUseHTMLString: true,
							customClass: 'message-logout',
							distinguishCancelAndClose: true,
							cancelButtonClass: this.cancelButtonClass,
							confirmButtonClass: "btn-custom-confirm",
							cancelButtonText: '删除主单',
							confirmButtonText: '继续使用',
							type: 'warning',
							center: true
						}).then(() => {
              if(row.signState === 1){
                  let mes = "当前业务已由 " + row.routingPersonName.split(' ')[0] + " 签单，撤销签单后方可卸载主单号。";
                  this.openError(mes);
                  return;
              }
							this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + row.orderUuid).then(function(response) {
								if (!response.data.data) {
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
								} else {
									this.openError("订单已财务锁账");
								}
							}.bind(this));

						}).catch(action => {
							if (action === 'cancel') {
               if(row.signState === 1){
                    let mes = "当前业务已由 " + row.routingPersonName.split(' ')[0] + " 签单，撤销签单后方可卸载主单号。";
                    this.openError(mes);
                    return;
                }
								this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + row.orderUuid).then(function(response) {
									if (!response.data.data) {
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
									} else {
										this.openError("订单已财务锁账");
									}
								}.bind(this));

							}
						});
					} else {
						this.openError("订单已财务锁账");
					}
				}.bind(this));
			},
			doUninstall(row) {
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=货物出重&order_uuid=' + row.orderUuid).then(function(response) {
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
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=货物出重&order_uuid=' + row.orderUuid).then(function(response) {
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
					let pageName = '订单操作管理/空运出口/AE订单';
					this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
						.then(function(response) {
							let af_list_column = response.data.data;
							if (af_list_column && af_list_column.length > 0) {
								this.query.columnStrs = JSON.stringify(af_list_column);
							} else {
								this.query.columnStrs = '';
							}
							this.exportExcelSure();
						}.bind(this));
					/*let userId = window.localStorage.getItem('userId');
					let af_list_column = window.localStorage.getItem(userId + '_af_list_column');
					if (af_list_column) {
						this.query.columnStrs = af_list_column;
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
						downloadElement.download = 'AE订单列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
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
					planPieces = this.getNumber4(planPieces);
				}
				if (confirmPieces != '-') {
					confirmPieces = this.getNumber4(confirmPieces);
				}
				// return planPieces + " / " + confirmPieces;
				return confirmPieces;
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
					planWeight = this.getNumber4(planWeight);
				}
				if (confirmWeight != '-') {
					confirmWeight = this.getNumber4(confirmWeight);
				}
				// return planWeight + " / " + confirmWeight;
				return confirmWeight;
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
					planVolume = this.getNumber4(planVolume);
				}
				if (confirmVolume != '-') {
					confirmVolume = this.getNumber4(confirmVolume);
				}
				// return planVolume + " / " + confirmVolume;
				return confirmVolume;
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
					planChargeWeight = this.getNumber4(planChargeWeight);
				}
				if (confirmChargeWeight != '-') {
					confirmChargeWeight = this.getNumber4(confirmChargeWeight);
				}
				// return planChargeWeight + " / " + confirmChargeWeight;
				return confirmChargeWeight;
			},
			formatter55(row, column) {
				let planDensity = '-';
				let confirmDensity = '-';
				if (row.planDensity || row.planDensity === 0) {
					planDensity = row.planDensity
				}
				if (row.confirmDensity || row.confirmDensity === 0) {
					confirmDensity = row.confirmDensity
				}
				if (planDensity != '-') {
					planDensity = this.getNumber4(planDensity);
				}
				if (confirmDensity != '-') {
					confirmDensity = this.getNumber4(confirmDensity);
				}
				// return planDensity + " / " + confirmDensity;
				return confirmDensity;
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
			getNumber4(data) {
				return data.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
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
								sums[i + 1] = this.getNumber4(this.data2[0].planPieces);
							}
							if (loaclJsonArray[i].prop === "confirmPieces") {
								sums[i + 1] = this.getNumber4(this.data2[0].confirmPieces);
							}
							if (loaclJsonArray[i].prop === "planWeight") {
								sums[i + 1] = this.getNumber4(this.data2[0].planWeight);
							}
							if (loaclJsonArray[i].prop === "confirmWeight") {
								sums[i + 1] = this.getNumber4(this.data2[0].confirmWeight);
							}
							if (loaclJsonArray[i].prop === "planVolume") {
								sums[i + 1] = this.getNumber4(this.data2[0].planVolume);
							}
							if (loaclJsonArray[i].prop === "confirmVolume") {
								sums[i + 1] = this.getNumber4(this.data2[0].confirmVolume);
							}
							if (loaclJsonArray[i].prop === "planChargeWeight") {
								sums[i + 1] = this.getNumber4(this.data2[0].planChargeWeight);
							}
							if (loaclJsonArray[i].prop === "confirmChargeWeight") {
								sums[i + 1] = this.getNumber4(this.data2[0].confirmChargeWeight);
							}
						}
					}
				}


				return sums;
			},
			jumpToNewPage(name, frow) {
				let param = {
					flag: true,
					name: name,
					// frow: encodeURIComponent(JSON.stringify(frow))
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: "/af_order",
					query: param
				});
				window.open(routeUrl.href, '_blank');
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
				if (this.currRow.awbNumber) {
					this.$axios.get('/afbase/aforder/getShippingData/AE_DZ_POST_MAWB').then(function(response) {
						if (response.data.code == 0 && response.data.data) { //发送运单数据
							this.sendWaybill(this.currRow['orderUuid'])
						} else { //请求未成功或配置不存在跳转到自己舱单制作
							this.jumpToWaybillMak()
						}
					}.bind(this)).catch((error) => {
						this.openError(error.response.data.messageInfo)
					});
				} else {
					this.openError1("未配主单号，不能制作运单");
				}
			},
			shippingSend() { //发送舱单20200827
				if (this.currRow.awbNumber) {
					this.$axios.get('/afbase/aforder/getShippingData/AE_CD_AWB').then(function(response) {
						if (response.data.code == 0 && response.data.data) { //发送舱单数据
							var orderUUID = this.currRow['orderUuid'];
							this.$axios.get("/afbase/aforder/shippingSendCheckHasSend/" + orderUUID).then(function(response) {
								function extracted() {
									this.checkSendWaybill(orderUUID);
								}
								if (response.data.code == 0) {
									if (!response.data.data) { //为发送过舱单
										extracted.call(this);
									} else { //已发送过舱单
										this.$confirm('舱单已经发送，是否将 主单及所有分单 再次发送？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      center: true
										}).then(() => {
											extracted.call(this);
										}).catch(() => {});
									}

								}
							}.bind(this));

						} else { //请求未成功或配置不存在
							this.openError1("未获取到舱单相关信息!");
						}
					}.bind(this)).catch((error) => {
						this.openError(error.response.data.messageInfo)
					});
				} else {
					this.openError1("未配主单号，不能发送舱单");
				}
			},
			insertOrderLog(url, params, target) {
				var tempForm = document.createElement("form");
				tempForm.id = "tempForm1";
				tempForm.method = "post";
				tempForm.action = url;
				tempForm.target = target; // _blank - URL加载到一个新的窗口
				//构建请求参数
				for (var key in params) {
					var value = params[key];
					var nextHideInput = document.createElement("input");
					nextHideInput.type = "hidden";
					nextHideInput.name = key;
					nextHideInput.value = value;
					tempForm.appendChild(nextHideInput);
				}

				document.body.appendChild(tempForm);
				//提交
				//tempForm.dispatchEvent(new Event("submit"));
				tempForm.submit();
				document.body.removeChild(tempForm);
			},
			sendWaybillAndLog(orderUUID, data) {
				//TODO  调用接口发送成功后 插入日志  data['url'], data
				let params = {
					orderUuid: orderUUID,
					logRemarkLarge: JSON.stringify(data)
				}

				this.$axios.post("/afbase/aforder/insertLogAfterSendShipper", params).then(function(response) {
					if (response.data.code == 0) {
						this.openSuccess("发送成功!");
					} else {
						this.openError1("发送成功，记录日志失败!");
					}
				}.bind(this));
			},
      checkSendWaybill(orderUUID) {
        this.$axios.get("/afbase/aforder/shippingBillDataCheck/AE_CD_AWB/all/" + orderUUID).then(function(response) {
          function extracted() {
            this.$axios.post("/afbase/aforder/sendShippersData/all/"+orderUUID).then(function (response) {
              // 调用发送舱单后台接口
              if (response.data.code == 0) {
                if(response.data.data.status=='success'){
                  this.openSuccess('发送成功');
                }else{
                  this.openError(response.data.data.message);
                }
              } else {
                this.openError(response.data.messageInfo || "发送舱单失败!");
              }
            }.bind(this));
          }

          if (response.data.code == 0) {
            if (response.data.data == null) {
              extracted.call(this);
            }else{
              this.$alert(response.data.data, '提示', {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                showCancelButton:false,
                showConfirmButton:false,
                type: 'warning',
                center: true
              });
            }

          }
        }.bind(this));
      },

			sendWaybill(orderUUID) {
				this.$axios.get("/afbase/aforder/shippingBillDataCheck/AE_DZ_POST_MAWB/all/" + orderUUID).then(function(response) {
					function extracted() {
						this.$axios.get("/afbase/aforder/waybillData/" + orderUUID).then(function(response) {
							if (response.data.code == 0) {
								let data = response.data.data;
								if (data['url']) {
									this.openFormWind(data['url'], data, "_blank");
								} else {
									this.openError1("打开运单制作页面失败!");
								}
							} else {
								this.openError1(response.data.messageInfo || "打开运单制作页面失败!");
							}
						}.bind(this));
					}

					if (response.data.code == 0) {
						if (response.data.data == null) {
							extracted.call(this);
						} else {
							this.$confirm(response.data.data + '制作运单可能会出现数据错误，请确认是否继续？', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								dangerouslyUseHTMLString: true,
								customClass: 'message-logout',
								distinguishCancelAndClose: true,
								cancelButtonClass: this.cancelButtonClass,
								confirmButtonClass: "btn-custom-confirm",
								type: 'warning',
								center: true
							}).then(() => {
								extracted.call(this);
							}).catch(() => {});
						}

					}
				}.bind(this));
			},
			jumpToWaybillMak() {
				let routeUrl = this.$router.resolve({
					path: "/af_order",
					query: {
						flag: true,
						orderCode: this.currRow.orderCode,
						orderUuid: this.currRow.orderUuid,
						awbNumber: this.currRow.awbNumber,
						flightNumber: this.currRow.expectFlight,
						name: 'waybillMake'
					}
				});
				window.open(routeUrl.href, '_blank');
			},
			init() {
				//按钮权限开始
				let buttonInfo = window.localStorage.getItem('buttonInfo')
				if (buttonInfo.indexOf('af-order-add') > -1) {
					this.addButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-excel') > -1) {
					this.excelButtonFlag = true;
				}

				if (buttonInfo.indexOf('af-order-view') > -1) {
					this.viewButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-edit') > -1) {
					this.editButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-file') > -1) {
					this.fileButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-uninstall') > -1) {
					this.uninstallButtonFlag = true;
				}
				// if (buttonInfo.indexOf('af-order-stop')>-1) {
				// 	this.stopButtonFlag=true;
				// }
				if (buttonInfo.indexOf('af-order-letter') > -1) {
					this.letterButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-weighttag') > -1) {
					this.weighttagButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-services') > -1) {
					this.servicesButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-forcestop') > -1) {
					this.forcestopButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-match') > -1) {
					this.matchButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-printletter') > -1) {
					this.printletterButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-awbsubmit') > -1) {
					this.awbsubmitButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-dgdMake') > -1) {
					this.dgdMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-tagMake') > -1) {
					this.tagMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-amountBillPrint') > -1) {
					this.amountBillPrintButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-amountBillSend') > -1) {
					this.amountBillSendButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-twoCode') > -1) {
					this.twoCodeMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-checkTwoCode') > -1) {
					this.checkTwoCodeMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-shareTwoCode') > -1) {
					this.shareTwoCodeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-shippingMake') > -1) {
					this.shippingMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-shippingSend') > -1) {
					this.shippingSendButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-waybillMake') > -1) {
					this.waybillMakeButtonFlag = true;
				}

				if (buttonInfo.indexOf('af_order_copyOrderSave') > -1) {
					this.copyOrderSaveButtonFlag = true;
				}

				if (buttonInfo.indexOf('af-order-print') > -1) {
					this.printButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-delivery') > -1) {
					this.deliveryButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-documentMake') > -1) {
					this.documentMakeButtonFlag = true;
				}
				if (buttonInfo.indexOf('af-order-special') > -1) {
					this.specialButtonFlag = true;
				}

				//卸载主单：删除主单按钮添加权限判断
				if (buttonInfo.indexOf('sys_base_awb_del') > -1) {
					this.cancelButtonClass = 'btn-custom-cancel'
				}

				if (buttonInfo.indexOf('af-order-services-income') > -1) {
					this.incomeServicePermissionButton = true
				}

				if (buttonInfo.indexOf('af-order-share-ae') > -1) {
					this.orderShareFlag = true;
				}

        if(buttonInfo.indexOf('af-cenel-sign') > -1){
          this.afCencelSignFlag = true;
        }
        if(buttonInfo.indexOf('af-rounting-sign') > -1){
          this.afRountingSignFlag = true;
        }
				//按钮权限结束
				this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
					this.productOptions = response.data.data;
				}.bind(this));


				this.query.flightDateBegin = this.getDateTime(new Date());
				// this.query.createTimeBegin = this.getDateTime(new Date());
			},
			handlerOrderCellClick(row, column, cell, event) {
				if ("订单号" == column['label']) {
					this.showTrack(row);
				} else if ("主运单号" == column['label']) {
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
				} else if ("主运单号" == label) {
					// this.checkTwoCode(row)
					this.showTrack(row)
				}
			},
			tagMake(row) {
				let awbNumber = row['awbNumber'],
					orderUUID = row['orderUuid'];
				if (!awbNumber) {
					this.openError1("未配置主单号，无法制作标签");
					return;
				}
				let ele = {};
				ele['orderUuid'] = orderUUID;
				ele['awbNumber'] = awbNumber;
				this.frow.data = [ele];
        this.frow.pageName = 'AE订单';
				this.tagPrintVisible = true;
			},
			amountBillPrint(row) {
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
			amountBillSend(row) {
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
								this.frow.employee.useroptions = this.useroptions2
								this.amountBillSendVisible = true;
							} else if (response.data.data.length > 1) {
								this.frow = row
								this.frow.contact = {}
								this.frow.employee = {}
								this.frow.contact.orderContacts = this.orderContacts
								this.frow.contact.contactsOptions = this.contactsOptions
								this.frow.employee.useroptions = this.useroptions2
								this.amountBillSendListVisible = true
							} else {
								this.openError("该订单无账单")
							}
						}).catch((error) => {

						});
					})

			},
			deliveryNotice(row, flag) {
				this.$axios.get('/afbase/aforder/view/' + row.orderId)
					.then((response) => {
						if (response.data.code == 0) {
							if (flag === 'warehouse' && (response.data.data && !response.data.data.outfieldService)) {
								this.openError1("当前订单中，没有选择外场操作，不能分享货站送货通知。")
								return
							} else if (flag === 'storehouse' && (response.data.data && !response.data.data.warehouseService)) {
								this.openError1("当前订单中，没有选择库内操作，不能分享库房送货通知。")
								return
							}
							this.$axios.get("/afbase/aforder/checkOrderDeliveryNotice/" + row['orderUuid'] + "/" + flag).then((resp) => {
								if (resp.data.code == 0) {
									this.frow = row;
									this.frow.flag = flag
									this.deliveryNoticeVisible = true;
								} else {
									this.openError1(resp.data.messageInfo);
								}
							}).catch((error1) => {
								this.openError1(error1.response.data.messageInfo);
							})
						} else {
							this.openError1(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError1(error.response.data.messageInfo);
					})
			},
			//订单跟踪页面使用
			deliveryNoticeShare(row) {
				this.frow = row;
				this.deliveryNoticeShareVisible = true;
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
			this.$axios.get('/hrs/org/getOrderFinanceLockView/AE').then(function(response) {
				if (response.data.data && response.data.data == true) {
					this.orderFinanceLockViewFlag = true;
				} else {
					this.orderFinanceLockViewFlag = false;
				}
			}.bind(this))

			//从数据库查询设置信息
			let pageName = '订单操作管理/空运出口/AE订单';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then((response)=> {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						this.tableColumns = this.sortBykey(af_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.afInfo, 'index');
					}
				}).catch((error)=>{
					this.tableColumns = this.sortBykey(columns.afInfo, 'index')
				})

			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions2 = response.data.data;
			}.bind(this))

			this.$axios.get2('/afbase/category/find',{categoryName:'航线'}).then((response)=> {
				this.routingNames = response.data.data
			})

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
				} else if (this.$route.query.name == 'waybillMake') {
					if (buttonInfo == null || buttonInfo.indexOf('af-order-waybillMake') == -1) {
						this.$router.push("/noPermission")
						return
					}
					this.frow.waybillMake = {
						orderUuid: this.$route.query.orderUuid,
						orderCode: this.$route.query.orderCode,
						awbNumber: this.$route.query.awbNumber,
						flightNumber: this.$route.query.flightNumber
					}
					this.waybillMakeVisible = true
				} else if (this.$route.query.name == 'edit') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.editVisible = true;
				} else if (this.$route.query.name == 'save') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.saveVisible = true;
				} else if (this.$route.query.name == 'copy') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.copyOrderSaveVisible = true;
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
	.btn-custom-cancel {
		/*float: right;
		margin-left: 10px;*/
		background-color: red;
		color: white;
	}

	.btn-custom-cancel-hidden {
		display: none !important;
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

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
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
