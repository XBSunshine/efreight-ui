<template>
	<div class="warp-main" v-loading="exportLoading" :element-loading-text="loadingText">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<div ref="af_debit_note_list_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" style="width:141px;margin-right: -5px;" @change="businessScopeChange">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerName" auto-complete="off" clearable style="width:240px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:220px;">
								<template slot="prepend">清单日期</template>
								<el-date-picker slot="suffix" v-model="query.statementDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 151px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.statementDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
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
					<el-col class="elementWidth" v-if="awbNumberFlag">
						<el-form-item v-if="query.businessScope!='IO'" label-width="10px">
							<el-input class="widthWithThree" v-model="query.awbNumber" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">主单号</template>
							</el-input>
						</el-form-item>
						<el-form-item v-if="query.businessScope=='IO'" label-width="10px">
							<el-input class="widthWithThree" v-model="query.customerNumber" auto-complete="off" clearable style="width:210px;" @input="query.customerNumber=query.customerNumber.toUpperCase()">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.debitNoteNum" auto-complete="off" clearable style="width:240px;" @input="query.debitNoteNum=query.debitNoteNum.toUpperCase()">
								<template slot="prepend">账单编号</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.orderCode" auto-complete="off" clearable style="width:220px;" @input="query.orderCode=query.orderCode.toUpperCase()">
								<template slot="prepend">订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="404px" v-if="query.businessScope=='LC'">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
						<el-form-item label-width="185px" v-if="query.businessScope!='LC'">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.invoiceNum" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">发票号码</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
								<!-- <el-input v-model="query.invoiceTitle" auto-complete="off" clearable style="width:300px;">
									<template slot="prepend">发票抬头</template>
								</el-input> -->
						    <el-input v-model="query.invoiceCreatorName" auto-complete="off" clearable style="width:300px;">
						    	<template slot="prepend">申请人</template>
						    </el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px">
								<el-input style="width:255px;">
									<template slot="prepend">申请日期</template>
									<el-date-picker slot="suffix" v-model="query.invoiceCreateTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始日期" style="width: 186px;margin-right: -5px;">
									</el-date-picker>
								</el-input>
								<span>-</span>
								<el-date-picker v-model="query.invoiceCreateTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束日期" style="width: 185px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
				</el-row>

				<el-row v-if=showFlag>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">清单状态</template>
								<el-select slot="suffix" v-model="query.statementStatus" style="width:141px;margin-right: -5px;" clearable>
									<el-option label="已制清单" :value="-1"></el-option>
                  <el-option label="待开票" value="待开票"></el-option>
                  <el-option label="部分开票" value="部分开票"></el-option>
                  <el-option label="开票完毕" value="开票完毕"></el-option>
									<el-option label="部分核销" :value="0"></el-option>
									<el-option label="核销完毕" :value="1"></el-option>
									<el-option label="未核销完毕" :value="-2"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.statementNum" auto-complete="off" clearable style="width:240px;" @input="query.statementNum=query.statementNum.toUpperCase()">
								<template slot="prepend">清单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.creatorName" auto-complete="off" clearable style="width:220px;">
								<template slot="prepend">制单人</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope!='IO'">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:220px;" @input="query.customerNumber=query.customerNumber.toUpperCase()">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<!-- <el-table v-loading="loading" stripe :data="data" border @selection-change="handleSelectionChange"> -->
		<el-table v-loading="loading" stripe :data="data" border :max-height="tableHeight" @header-dragend="cellWidth">

			<el-table-column fixed type="index" align="center" label="操作" width="50">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" v-if="scope.row.statementNum!='合计'" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="openInvoiceFlag" command="openInvoice" >开票申请</el-dropdown-item>
              <el-dropdown-item command="invoiceAutoWriteoff" v-if="invoiceAutoWriteoffFlag">核销</el-dropdown-item>
							<!-- <el-dropdown-item command="writeoff" v-if="listButtonFlag">核销</el-dropdown-item> -->
							<el-dropdown-item command="print">预览</el-dropdown-item>
							<el-dropdown-item>
								<el-dropdown placement="right-start" @command="handleCommand" @visible-change="handleChange(scope.row)">
									<span class="el-dropdown-link">导出<i class="el-icon-arrow-right el-icon--right"></i></span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="exportExcelDebitnoteStatementCH">账单清单-中文</el-dropdown-item>
										<el-dropdown-item command="exportExcelDebitnoteStatementEN">账单清单-英文</el-dropdown-item>
										<el-dropdown-item v-if="scope.row.businessScope=='AE'" command="exportExcelSettleStatement">结算清单</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-dropdown-item>
							<el-dropdown-item command="send">发送</el-dropdown-item>
							<el-dropdown-item command="edit" v-if="editFlag&&scope.row.invoiceId==null">修改</el-dropdown-item>
							<el-dropdown-item command="delete" v-if="deleteFlag&&scope.row.invoiceId==null">删除</el-dropdown-item>
							<!-- <el-dropdown-item command="remark">发票信息</el-dropdown-item> -->
              <el-dropdown-item v-if="cancelInvoiceFlag" command="cancelInvoice" >撤销发票申请</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<span v-else>合计</span>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">

				<el-table-column v-if="item.label=='清单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber55">
				</el-table-column>
				<el-table-column v-if="item.label=='清单状态'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>
				<el-table-column v-if="item.label=='清单日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>

				<el-table-column v-if="item.label=='收款客户'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
				</el-table-column>

				<el-table-column v-if="item.label=='清单金额（原币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>

				<el-table-column v-if="item.label=='已核销金额（原币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<p v-for="(item,index) in scope.row.currencyAmount2.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>

				<el-table-column v-if="item.label=='清单金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber5">
				</el-table-column>
				<el-table-column v-if="item.label=='已核销金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber6">
				</el-table-column>
				<el-table-column v-if="item.label=='未核销金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber7">
				</el-table-column>
				<el-table-column v-if="item.label=='核销单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope" v-if="scope.row.writeoffNum">
						<p v-for="(item,index) in scope.row.writeoffNum.split('  ')" :key="index">
              <span>{{item.split(' ')[1]}}</span>
							<!-- <a href="javascript:void(0)" @click="doView2(item.split(' ')[0],scope.row.statementNum)" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a> -->
						</p>
					</template>
				</el-table-column>
				<el-table-column v-if="item.label=='清单备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>
			<!-- 	<el-table-column v-if="item.label=='发票日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column> -->
				 <el-table-column v-if="item.label=='发票号码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				   <template slot-scope="scope" v-if="scope.row.invoiceNum">
				   	<p v-for="(item,index) in scope.row.invoiceNum.split('  ')" :key="index">
                        <span>{{item.split(' ')[1]}}</span>
				   	</p>
				   </template>
         </el-table-column>
			   <el-table-column v-if="item.label=='开票申请备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
			   </el-table-column>
			<!-- 	<el-table-column v-if="item.label=='发票抬头'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
				</el-table-column>
				<el-table-column v-if="item.label=='发票备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
				</el-table-column> -->
				<el-table-column v-if="item.label=='开票申请人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_creatorName_invoice">
				</el-table-column>
				<el-table-column v-if="item.label=='开票申请时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>
				<el-table-column v-if="item.label=='制单人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_creatorName">
				</el-table-column>
				<el-table-column v-if="item.label=='清单制作时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>
			 </template>



			<!-- 	<el-table-column align="center" prop="statementNum" width="135" label="清单号" :formatter="formatterNumber55"></el-table-column>
			<el-table-column align="center" prop="statementStatus" width="80" label="清单状态"></el-table-column>
			<el-table-column align="center" prop="statementDate" width="90" label="清单日期"></el-table-column>
			<el-table-column align="left" prop="customerName" width="400" label="收款客户"></el-table-column> -->

			<!--<el-table-column align="center" label="币种">
				<template slot-scope="scope">
					<span v-if="scope.row.currency!=null&&scope.row.currency.length>3" style="font-weight: 600;color: red;">{{scope.row.currency}}</span>
					<span v-else>{{scope.row.currency}}</span>
				</template>
			</el-table-column>-->
			<!-- <el-table-column align="right" label="清单金额（原币）" width="140">
				<template slot-scope="scope">
					<p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
						<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
						<font v-else style="color: red;">{{item}}</font>
					</p>
				</template>
			</el-table-column>
			<el-table-column align="right" label="已核销金额（原币）" width="140">
				<template slot-scope="scope">
					<p v-for="(item,index) in scope.row.currencyAmount2.split('  ')" :key="index">
						<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
						<font v-else style="color: red;">{{item}}</font>
					</p>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="functionalAmount" label="清单金额（本币）" :formatter="formatterNumber5" width="140"></el-table-column>

			<el-table-column align="center" prop="functionalAmountWriteoff" label="已核销金额（本币）" :formatter="formatterNumber6"
			 width="140"></el-table-column>
			<el-table-column align="center" prop="functionalAmountNoWriteoff" label="未核销金额（本币）" :formatter="formatterNumber7"
			 width="160"></el-table-column>
			<el-table-column align="center" label="核销单号" width="140">
				<template slot-scope="scope" v-if="scope.row.writeoffNum">
					<p v-for="(item,index) in scope.row.writeoffNum.split('  ')" :key="index">
						<a href="javascript:void(0)" @click="doView2(item.split(' ')[0],scope.row.statementNum)" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a>
					</p>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="statementRemark" width="400" label="清单备注"></el-table-column>
			<el-table-column align="center" prop="invoiceRemark" width="400" label="发票备注"></el-table-column>
			<el-table-column align="center" prop="creatorName" width="100" label="制单人" :formatter="formatter_creatorName"></el-table-column>

				<el-table-column align="center" prop="createTime" width="150" label="清单制作时间"></el-table-column> -->

			<!-- <el-table-column align="center" prop="editorName" label="操作人" width="200"></el-table-column>
			<el-table-column align="center" prop="editTime" label="操作时间" width="200"></el-table-column> -->
		</el-table>
		<div ref="af_debit_note_list_footer">
			<el-progress v-if="progressShow" :text-inside="true" :stroke-width="13" :percentage="percentage" :color="customColors"></el-progress>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<print ref="addMission" v-if="printVisible" :visible.sync="printVisible" :frow="frow"></print>
		<billViewIncome ref="addMission" v-if="billViewIncome" :visible.sync="billViewIncome" :frow="frow"></billViewIncome>
		<billViewIncome2 ref="addMission" v-if="billViewIncome2" :visible.sync="billViewIncome2" :frow="frow"></billViewIncome2>
		<billSend ref="addMission" v-if="billSend" :visible.sync="billSend" :frow="frow"></billSend>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		<writeoffVisibleTag ref="addMission" v-if="writeoffVisible" :visible.sync="writeoffVisible" :frow="frow"></writeoffVisibleTag>
		<remarkVisible ref="addMission" v-if="remarkVisible" :visible.sync="remarkVisible" :frow="frow"></remarkVisible>
    <invoiceVisibleTag ref="addMission" v-if="invoiceVisible" :visible.sync="invoiceVisible" :frow="frow"></invoiceVisibleTag>
    <invoiceAutoTag ref="addMission" v-if="invoiceAutoVisible" :visible.sync="invoiceAutoVisible" :frow="frow"></invoiceAutoTag>
	</div>
</template>
<script>
	import setVisibleVue from './af_debit_note_list_setting'
	import billViewIncome from './af_order_bill_view'
	import billViewIncome2 from './af_debit_note_bill_writeoff_view'
	import editVisibleVue from './af_debit_note_list_edit'
	import Print from './af_debit_note_list_print'
	import billSend from './af_debit_note_list_send'
	import writeoffVisibleVue from './af_debit_note_list_writeoff'
	import remarkVisible from './af_debit_note_list_remark'
	import columns from './af_debit_note_list_column.json'
  import invoice from '../invoice/openInvoice.vue'
  import invoiceAuto from '../invoice/invoice_auto.vue'
	export default {
		data() {
			return {
				tableHeight: '800px',
				loading: false,
				exportLoading: false,
				loadingText: '',
				listButtonFlag: false,
        openInvoiceFlag:false,
        editFlag:false,
        deleteFlag:false,
        cancelInvoiceFlag:false,
        invoiceAutoVisible:false,
        invoiceAutoWriteoffFlag:false,
				data: [],
				progressShow: false,
				percentage: 0,
				customColors: [{
						color: '#f56c6c',
						percentage: 20
					},
					{
						color: '#e6a23c',
						percentage: 40
					},
					{
						color: '#5cb87a',
						percentage: 60
					},
					{
						color: '#1989fa',
						percentage: 80
					},
					{
						color: '#6f7ad3',
						percentage: 100
					}
				],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50]
				},
				printVisible: false,
				billViewIncome: false,
				billViewIncome2: false,
				billSend: false,
				setVisible: false,
				editVisible: false,
				remarkVisible: false,
				writeoffVisible: false,
        invoiceVisible:false,
				awbNumberFlag: true,
				frow: {},
				query: {
					businessScope: 'AE',
					customerName: '',
					statementNum: '',
					debitNoteNum: '',
					statementStatus: '',
					awbNumber: '',
					orderCode: '',

					customerNumber: '',
					statementDateStart: '',
					statementDateEnd: '',
					creatorName: '',
					columnStrs: '',
					invoiceNum: '',
					invoiceTitle: '',
					invoiceDateStart: '',
					invoiceDateEnd: '',
          invoiceCreatorName:'',
          invoiceCreateTimeStart:'',
          invoiceCreateTimeEnd:''
				},
				businessCodes: [],
				multipleSelection: [],
				tableColumns: [],

				showFlag: false
			}
		},
		created: function() {
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('af-statement-open-invoice') > -1) {
				this.openInvoiceFlag = true;
			}
      if (buttonInfo.indexOf('af-statement-cancel-invoice') > -1) {
      	this.cancelInvoiceFlag = true;
      }
      if (buttonInfo.indexOf('af-statement-edit') > -1) {
      	this.editFlag = true;
      }
      if (buttonInfo.indexOf('af-statement-delete') > -1) {
      	this.deleteFlag = true;
      }
      if(buttonInfo.indexOf('af-debit-invoice-writeoff') > -1){
        this.invoiceAutoWriteoffFlag = true;
      }
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//
			this.query.statementStatus = -1;
			//从数据库查询设置信息
			let pageName = '财务结算管理/收入对账/清单';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let af_debit_note_list_column = response.data.data;
					if (af_debit_note_list_column && af_debit_note_list_column.length > 0) {
						this.tableColumns = this.sortBykey(af_debit_note_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.info, 'index');
					}
				}.bind(this));
			/*let userId = window.localStorage.getItem('userId');
			let list_column = window.localStorage.getItem(userId + '_af_debit_note_list_column');
			if (list_column) {
				let arrayC = JSON.parse(list_column)
				if (arrayC && arrayC.length > 0) {
					this.tableColumns = this.sortBykey(arrayC, 'index');
				}
			} else {
				this.tableColumns = this.sortBykey(columns.info, 'index');
			}*/
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
			'setVisibleTag': setVisibleVue,
			'billViewIncome': billViewIncome,
			'billViewIncome2': billViewIncome2,
			'billSend': billSend,
			'remarkVisible': remarkVisible,
			'editVisibleTag': editVisibleVue,
			'writeoffVisibleTag': writeoffVisibleVue,
			'print': Print,
      'invoiceVisibleTag':invoice,
      'invoiceAutoTag':invoiceAuto
		},
		methods: {
      //cancelInvoice
       cancelInvoice(row){
         if(row.invoiceStatus==-1){
            this.$confirm('请确认 是否撤销开票申请？', '提示', {
            	confirmButtonText: '是',
            	cancelButtonText: '否',
            	type: 'warning',
            	center: true
            }).then(() => {
            	this.$axios.deletes('/afbase/cssIncomeInvoice/statementId/' + row.statementId+'/'+row.rowUuid).then((response) => {
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
         }else{
            this.openError("您好，未开发票的清单 才可 撤销开票申请。");
         }
       },

      //invoice
      openInvoice(){
         this.$axios.get2('/afbase/statement/checkCssStatement', {
         	statementId: this.frow.statementId
         }).then(function(response) {
         	let checkFlag = true;
         	if (response.data.data) {
         		// response.data.data.forEach((statement) => {
               if(response.data.data.invoiceId){
                 this.openError("您好，清单号" + response.data.data.statementNum + "已做 开票申请 或 已开票 ，不能重复申请！");
                 checkFlag = false;
                 // return false;
               }
         		// });
         	}else{
             checkFlag = false;
             this.openError("清单不是最新数据，请刷新页面再操作");
          }
         	if (checkFlag) {
            this.frow.invoiceType = 'statement';
         		this.invoiceVisible = true;
         	}
         }.bind(this));
      },
			businessScopeChange() {
				if (this.query.businessScope == 'LC') {
					this.awbNumberFlag = false;
				} else {
					this.awbNumberFlag = true;
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
					localStorage.setItem(userId + '_af_debit_note_list_column_width', JSON.stringify(arrayC))
				}
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
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let af_debit_note_list_header = this.$refs.af_debit_note_list_header.offsetHeight;
					let af_debit_note_list_footer = this.$refs.af_debit_note_list_footer.offsetHeight;
					let heightS = window.innerHeight - 147 - af_debit_note_list_header - af_debit_note_list_footer;
					this.tableHeight = heightS + "px";
				});
			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showEdit()
				} else if (command == 'delete') {
					this.doDelete()
				} else if (command == 'writeoff') {
					this.doWriteoff()
				} else if (command == 'print') {
					this.printStatement()
				} else if (command == 'send') {
					this.doSend();
				} else if (command == 'exportExcelDebitnoteStatementCH') {
					this.exportExcelDebitnoteStatementCH();
				} else if (command == 'exportExcelDebitnoteStatementEN') {
					this.exportExcelDebitnoteStatementEN();
				} else if (command == 'exportExcelSettleStatement') {
					this.exportExcelSettleStatement();
				} else if (command == 'remark') {
					this.showRemark()
				}else if(command == 'openInvoice'){
          this.openInvoice();
        }else if(command == 'cancelInvoice'){
          this.cancelInvoice(this.frow);
        }else if(command == 'invoiceAutoWriteoff'){
           this.invoiceAuto();
        }

			},
      invoiceAuto(){
        if(this.frow.currency.indexOf(",")>0){
          this.openError("您好，清单页面只支持单币种的账单进行核销，请开票后再进行核销。");
          return false
        }
        this.$axios.get2('/afbase/statement/checkCssStatement', {
        	statementId: this.frow.statementId
        }).then(function(response) {
        	let checkFlag = true;
        	if (response.data.data) {
        		// response.data.data.forEach((statement) => {
              if(response.data.data.invoiceId){
                this.openError("您好，清单号" + response.data.data.statementNum + "已申请开票或已开票，请在发票页面进行核销。");
                checkFlag = false;
                // return false;
              }
        		// });
        	}else{
            checkFlag = false;
            this.openError("清单不是最新数据，请刷新页面再操作");
         }
        	if (checkFlag) {
           this.frow.titleName="清单";
           this.invoiceAutoVisible = true;
        	}
        }.bind(this));
      },
			handleChange(command) {
				this.frow = command
			},
			showRemark() {
				this.frow.statementId = this.frow.statementId;
				this.frow.invoiceRemark = this.frow.invoiceRemark;
				this.frow.invoiceTitle = this.frow.invoiceTitle;
				this.frow.invoiceNum = this.frow.invoiceNum;
				this.frow.invoiceDate = this.frow.invoiceDate;
				this.frow.customerName = this.frow.customerName;
				this.remarkVisible = true;
			},
			doView2(incomeWriteoffId, statementNum) {
				this.frow.incomeWriteoffId = incomeWriteoffId;
				this.frow.statementNum = statementNum
				this.billViewIncome2 = true;
			},
			showEdit() {

				this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
					.then(function(response) {
         if(!response.data.data){
           this.openError("清单不是最新数据，请刷新页面再操作");
         }else if(response.data.data.invoiceId){
           this.openError("您好，"+response.data.data.statementNum+" 清单 已申请开票 或 已开票 ，不能修改。");
           return;
         }else {
							this.frow.dataBean = this.frow;
							this.editVisible = true;
						}

					}.bind(this));
			},
			doDelete() {
				this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
					.then(function(response) {
						if(!response.data.data){
              this.openError("清单不是最新数据，请刷新页面再操作");
            }else if(response.data.data.invoiceId){
              this.openError("您好，"+response.data.data.statementNum+" 清单 已申请开票 或 已开票 ，不能删除。");
              return;
            }else {
							this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning',
								center: true
							}).then(() => {
								this.$axios.deletes('/afbase/statement/' + this.frow.statementId + '/' + this.frow.businessScope + '/' +
										this.frow.statementNum)
									.then(function(response) {
										if (response.data.code == 0) {
											this.openSuccess('删除成功');
											this.queryList();
										} else {
											this.openError(response.data.messageInfo);
										}
									}.bind(this));
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消删除'
								});
							});
						}
					}.bind(this));

			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
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
			doWriteoff() {
				this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
					.then(function(response) {
						if (response.data.data.writeoffComplete == 1) {
							this.openError("清单已核销");
							return;
						} else {
							if (this.frow.functionalAmountWriteoff) {
								this.frow.functionalAmountWriteoff = this.frow.functionalAmountWriteoff;
							} else {
								this.frow.functionalAmountWriteoff = 0;
							}

							this.frow.functionalAmountNo = this.frow.functionalAmount - this.frow.functionalAmountWriteoff;
							this.writeoffVisible = true;
						}
					}.bind(this));
			},
			doWriteoff2() {
				if (this.multipleSelection.length != 1) {
					this.openError("请选择一个清单");
					return;
				}
				this.frow.statementId = this.multipleSelection[0].statementId;
				this.frow.customerId = this.multipleSelection[0].customerId;
				this.frow.customerName = this.multipleSelection[0].customerName;

				this.frow.businessScope = this.multipleSelection[0].businessScope;
				this.frow.statementNum = this.multipleSelection[0].statementNum;

				this.frow.functionalAmount = this.multipleSelection[0].functionalAmount;
				if (this.multipleSelection[0].functionalAmountWriteoff) {
					this.frow.functionalAmountWriteoff = this.multipleSelection[0].functionalAmountWriteoff;
				} else {
					this.frow.functionalAmountWriteoff = 0;
				}

				this.frow.functionalAmountNo = this.frow.functionalAmount - this.frow.functionalAmountWriteoff;
				if (Math.abs(this.frow.functionalAmountNo) <= 0) {
					this.openError("清单已完成核销");
					return;
				}
				// if (this.frow.functionalAmount==this.frow.functionalAmountWriteoff) {
				// 	this.openError("账单已完成核销");
				// 	return;
				// }

				this.writeoffVisible = true;
			},
			queryList() {
				this.query.columnStrs = '';
				this.setHeight();
				//从数据库查询设置信息
				let pageName = '财务结算管理/收入对账/清单';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let af_debit_note_list_column = response.data.data;
						if (af_debit_note_list_column && af_debit_note_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_debit_note_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.info, 'index');
						}
						this.loading = true
						this.$axios.get2('/afbase/statement/page2?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode,
							this.query).then((response) => {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
							if (this.data.length == 0) {
								let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
								this.queryList2(current);
							} else {
								this.getTotal();
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}.bind(this));

				/*				this.loading = true;
								let userId = window.localStorage.getItem('userId');
								let list_column = window.localStorage.getItem(userId + '_af_debit_note_list_column');
								if (list_column) {
									let arrayC = JSON.parse(list_column)
									if (arrayC && arrayC.length > 0) {
										this.tableColumns = this.sortBykey(arrayC, 'index');
									}
								} else {
									this.tableColumns = this.sortBykey(columns.info, 'index');
								}
								this.$axios.get2('/afbase/statement/page2?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode,
									this.query).then((response) => {
									this.data = response.data.data.records;
									this.pageConf.totalPage = response.data.data.total;
									if (this.data.length == 0) {
										let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
										this.queryList2(current);
									} else {
										this.getTotal();
										this.loading = false
									}
								}).catch((error) => {
									this.loading = false
									console.log(error);
								});*/
			},
			queryList2(current) {
				this.$axios.get2('/afbase/statement/page2?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then(
					(response) => {
						this.data = response.data.data.records;
						if (this.data.length > 0) {
							this.getTotal();
						}
						this.pageConf.totalPage = response.data.data.total;
						this.loading = false
					}).catch(function(error) {
					this.loading = false
					console.log(error);
				});
			},
			getTotal() {
				this.$axios.get2("/afbase/statement/getTatol", this.query)
					.then(function(response) {
						if (this.data[this.data.length - 1].statementNum != '合计') { //避免当不在第一页的时候切换每页记录数时合计会有多个
							this.data = this.data.concat(response.data.data);
						}
						// this.getSummaries();
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
					let pageName = '财务结算管理/收入对账/清单';
					this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
						.then(function(response) {
							let af_debit_note_list_column = response.data.data;
							if (af_debit_note_list_column && af_debit_note_list_column.length > 0) {
								this.query.columnStrs = JSON.stringify(af_debit_note_list_column);
							} else {
								this.query.columnStrs = '';
							}
							this.exportExcelSure();
						}.bind(this));
					/*				let userId = window.localStorage.getItem('userId');
									let list_column = window.localStorage.getItem(userId + '_af_debit_note_list_column');
									if (list_column) {
										this.query.columnStrs = list_column;
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
				this.$axios.post3('/afbase/statement/exportExcelList', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '收入对账清单列表' + '.xls'; // 下载后文件名
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
			formatterNumber55(row, column) {
				if (row.statementNum == '合计') {
					return '';
				} else {
					return row.statementNum;
				}
			},
			formatterNumber5(row, column) {
				if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmount);
				}
			},
			formatterNumber6(row, column) {
				if (row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff ==
					null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmountWriteoff);
				}
			},
			formatterNumber7(row, column) {
				// if (row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff ==
				// 	null) {
				// 	return "";
				// } else if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
				// 	return "";
				// } else {
          let numW = "";
          if(row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff ==null){
            numW = row.functionalAmount;
          }else{
           numW = row.functionalAmount - row.functionalAmountWriteoff
          }
					if (numW > 0 || numW < 0) {
						return this.getNumber(numW);
					} else {
						return "";
					}
				// }
			},
			formatter_creatorName(row, column) {
				if (row.creatorName) {
					return row.creatorName.split(' ')[0];
				}
			},
      formatter_creatorName_invoice(row, column) {
      	if (row.invoiceCreatorName) {
      		return row.invoiceCreatorName.split(' ')[0];
      	}
      },
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			floatMountFormat(row, column) {
				if (row[column.property] === 0) {
					return '0.00'
				} else if (row[column.property] == null || row[column.property] == '') {
					return ''
				} else {
					return this.milliFormat(row[column.property].toString())
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
			changeCustomerId() {
				if (this.query.customerName == null || this.query.customerName === '') {
					this.query.customerId = null
				}
			},
			doSend() {
        this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
        					.then(function(response) {
                   if(!response.data.data){
                       this.openError("清单不是最新数据，请刷新页面再操作");
                    }else{
                     var map = [];
                     map.push(this.frow);
                     this.frow.data = map;
                     this.frow.frow = this.frow
                     this.billSend = true
                    }
          }.bind(this));
			},
			printStatement() {
        this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
        					.then(function(response) {
                   if(!response.data.data){
                       this.openError("清单不是最新数据，请刷新页面再操作");
                    }else{
                      var map = [];
                      map.push(this.frow);
                      this.frow.data = map;
                      this.frow.frow = this.frow
                      this.printVisible = true
                    }
          }.bind(this));
			},
			printStatement2() {
				if (this.multipleSelection.length == 0) {
					this.openError("请选择一个清单")
					return
				}
				this.frow.data = this.multipleSelection
				this.printVisible = true

			},
			exportExcelDebitnoteStatementCH() {
        this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
        					.then(function(response) {
                   if(!response.data.data){
                       this.openError("清单不是最新数据，请刷新页面再操作");
                    }else{
                      this.$confirm('您好，账单明细是否和清单一同导出？', '注意', {
                      	confirmButtonText: '是',
                      	cancelButtonText: '否',
                      	type: 'warning',
                      	center: true
                      }).then(() => {
                      	this.doExportExcelDebitnoteStatementCH(true)
                      }).catch(() => {
                      	this.doExportExcelDebitnoteStatementCH(false)
                      })
                    }
          }.bind(this));
			},
			doExportExcelDebitnoteStatementCH(ifDetail) {
				//下为开启进度条功能
				// this.progressShow = true
				this.percentage = 0
				let finishKey = setInterval(() => {
					this.percentage += 1
				}, 1500)
				if (ifDetail) {
					this.$axios.get2('/afbase/debitNote/select', {
							statementId: this.frow.statementId,
							businessScope: this.frow.businessScope
						})
						.then((resp) => {
							if (resp.data.data && resp.data.data.length > 10) {
								this.$message({
									message: '您打印的清单所含账单超过10条，打印需要一定的时长，请耐心等待',
									type: 'success'
								});
							}
						});
				}
				this.exportLoading = true
				this.loadingText = '下载中，请稍等...'
				this.$axios.post3('/afbase/statement/printExcel/' + this.frow.statementId + '/C/' + this.frow.businessScope + '/' +
						ifDetail)
					.then((response) => {
						this.exportLoading = false
						this.percentage = 100
						clearInterval(finishKey)
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = 'STATEMENT_' + this.frow.statementNum + '.xlsx'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
						setTimeout(() => {
							this.progressShow = false
						}, 1000)
					});
			},
			exportExcelDebitnoteStatementEN() {
        this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
        					.then(function(response) {
                   if(!response.data.data){
                       this.openError("清单不是最新数据，请刷新页面再操作");
                    }else{
                      this.$confirm('您好，账单明细是否和清单一同导出？', '注意', {
                      	confirmButtonText: '是',
                      	cancelButtonText: '否',
                      	type: 'warning',
                      	center: true
                      }).then(() => {
                      	this.doExportExcelDebitnoteStatementEN(true)
                      }).catch(() => {
                      	this.doExportExcelDebitnoteStatementEN(false)
                      })
                    }
          }.bind(this));

			},
			doExportExcelDebitnoteStatementEN(ifDetail) {
				if (ifDetail) {
					this.$axios.get2('/afbase/debitNote/select', {
							statementId: this.frow.statementId,
							businessScope: this.frow.businessScope
						})
						.then((resp) => {
							if (resp.data.data && resp.data.data.length > 10) {
								this.$message({
									message: '您打印的清单所含账单超过10条，打印需要一定的时长，请耐心等待',
									type: 'success'
								});
							}
						});
				}
				this.exportLoading = true
				this.loadingText = '下载中，请稍等...'
				this.$axios.post3('/afbase/statement/printExcel/' + this.frow.statementId + '/E/' + this.frow.businessScope +
						'/' + ifDetail)
					.then((response) => {
						this.exportLoading = false
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = 'STATEMENT_' + this.frow.statementNum + '.xlsx'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});
			},
			exportExcelSettleStatement() {
        this.$axios.get('/afbase/statement/checkCssStatement?statementId=' + this.frow.statementId)
        					.then(function(response) {
                if(!response.data.data){
                     this.openError("清单不是最新数据，请刷新页面再操作");
                }else{
                  this.$axios.post3('/afbase/statement/exportSettleStatementExcel/' + this.frow.statementId + '/C/AE')
                    .then(function(response) {
                      var blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                      });
                      var downloadElement = document.createElement('a');
                      var href = window.URL.createObjectURL(blob); // 创建下载的链接
                      downloadElement.href = href;
                      downloadElement.download = 'STATEMENT_LIST_' + this.frow.statementNum + '.xlsx'; // 下载后文件名
                      document.body.appendChild(downloadElement);
                      downloadElement.click(); // 点击下载
                      document.body.removeChild(downloadElement); // 下载完成移除元素
                      window.URL.revokeObjectURL(href); // 释放掉blob对象
                    }.bind(this));
                }
        }.bind(this));
			},
			handleSelectionChange(val) {
				this.multipleSelection = val
			}

		}
	}
</script>
