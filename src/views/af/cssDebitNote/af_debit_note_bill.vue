<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<div ref="af_debit_note_bill_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:280px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" @change="setServiceOptions" style="width:211px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerName" auto-complete="off" clearable style="width:300px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">
									<span v-if="query.businessScope.endsWith('E')&&query.businessScope.startsWith('T')">发车日期</span>
                  <span v-if="query.businessScope.endsWith('E')&&!query.businessScope.startsWith('T')">发车日期</span>
									<span v-if="query.businessScope.endsWith('I')&&query.businessScope.startsWith('T')">到达日期</span>
                  <span v-if="query.businessScope.endsWith('I')&&!query.businessScope.startsWith('T')">到港日期</span>
									<span v-if="query.businessScope.endsWith('C')">用车日期</span>
                  <span v-if="query.businessScope.endsWith('O')">业务日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="query.flightDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
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
							<el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button v-if="makeListFlag" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="makeList">制作清单</el-button>

						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.creatorName" auto-complete="off" clearable style="width:280px;">
								<template slot="prepend">制单人</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.statementNum" auto-complete="off" clearable style="width:300px;" @input="query.statementNum=query.statementNum.toUpperCase()">
								<template slot="prepend">清单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">账单日期</template>
								<el-date-picker slot="suffix" v-model="query.debitNoteDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.debitNoteDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
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
					<el-col class="elementWidth" v-if="awbNumberFlag">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.awbNumber" auto-complete="off" clearable style="width:280px;">
								<template slot="prepend">
                  <span v-if="query.businessScope!='TE' && query.businessScope!='TI'">主单号</span>
                  <span v-if="query.businessScope.startsWith('T')">运单号</span>
                </template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.orderCode" auto-complete="off" clearable style="width:300px;" @input="query.orderCode=query.orderCode.toUpperCase()">
								<template slot="prepend">订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerNumber" auto-complete="off" clearable style="width:210px;" @input="query.customerNumber=query.customerNumber.toUpperCase()">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="12px">
							<el-input v-model="query.debitNoteNum" auto-complete="off" clearable style="width:230px;" @input="query.debitNoteNum=query.debitNoteNum.toUpperCase()">
								<template slot="prepend">账单编号</template>
							</el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.invoiceNum" auto-complete="off" clearable style="width:280px;">
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
				<el-row v-show="showFlag">
					<el-col class="elementWidth" v-if="query.businessScope!='TE' && query.businessScope!='TI' && query.businessScope!='LC' && query.businessScope!='IO'">
						<el-form-item class="widthWithThree" label-width="10px">
							<el-input v-model="query.flightNo" auto-complete="off" clearable style="width:201px;" @input="query.flightNo=query.flightNo.toUpperCase()">
								<template slot="prepend">
									<span v-if="query.businessScope.startsWith('A')">航班号</span>
									<span v-if="query.businessScope.startsWith('S')">航次号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:379px;">
								<template slot="prepend">账单状态</template>
								<el-select slot="suffix" v-model="billStatus" style="width:310px;margin-right: -5px;" multiple>
									<el-option label="已制账单" value="已制账单"></el-option>
                  <el-option label="待开票" value="待开票"></el-option>
                  <el-option label="部分开票" value="部分开票"></el-option>
                  <el-option label="开票完毕" value="开票完毕"></el-option>
									<el-option label="已制清单" value="已制清单"></el-option>
									<el-option label="部分核销" value="部分核销"></el-option>
									<el-option label="核销完毕" value="核销完毕"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:451px;">
								<template slot="prepend">服务类别</template>
								<el-select slot="suffix" v-model="serviceIds" style="width:382px;margin-right: -5px;" clearable multiple filterable>
									<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+' - '+item.serviceNameCn" :value="item.serviceId">
										<span style="float: left">{{item.value}}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>


				</el-row>
			</div>
		</el-form>
    <div style="margin: 1px 1px 1px 10px;" >
         <el-row  :gutter="2">
             <el-col :span="1" align="left"><span>勾选合计:</span></el-col>
             <el-col v-for="(item,index) in mapInfo" :key="index" :span="2">
               <span :class="{currencyRedColor:item[0]!='CNY'}">{{amountFormat(item[1],item[0])}}</span>
             </el-col>
         </el-row>
    </div>
		<div>
			<div style="position: relative;left: 21px;top: 30px;z-index: 10;">
				<el-checkbox v-model="allCheck" @change="changeAllCheck"></el-checkbox>
			</div>
			<el-table :span-method="arraySpanMethod" :indent="0" v-loading="loading" stripe :data="data" row-key="debitNoteId" :expand-row-keys="expandRowKeys" border :tree-props="{children: 'children'}" :max-height="tableHeight" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column fixed type="index" label=" " width="50" align="center">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.checkBox" @change="changeRowCheck(scope.row)"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column fixed type="index" align="center" label="操作" width="50">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<!-- <el-dropdown-item command="writeoff" v-if="billButtonFlag">核销</el-dropdown-item> -->
								<el-dropdown-item command="print">预览</el-dropdown-item>
								<!-- <el-dropdown-item command="remark" v-if="!scope.row.statementId">发票信息</el-dropdown-item> -->
                <el-dropdown-item v-if="openInvoiceFlag" command="openInvoice" >开票申请</el-dropdown-item>
                <el-dropdown-item command="invoiceAutoWriteoff" v-if="invoiceAutoWriteoffFlag" >核销</el-dropdown-item>
                <el-dropdown-item v-if="cancelInvoiceFlag" command="cancelInvoice" >撤销发票申请</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column header-align="center" fixed width="200" label="账单编号">
					<template slot-scope="scope">
						<span v-if="scope.row.isParent===true" style="font-weight: bold;">{{scope.row.customerName}}</span>
						<span v-else style="margin-left: -20px;">{{scope.row.debitNoteNum}}</span>
					</template>
				</el-table-column>

				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.label=='账单状态'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='账单日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.prop=='awbNumber'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='订单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.prop=='flightNo'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.prop=='flightDate'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='账单金额（原币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
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
					<el-table-column v-if="item.label=='账单金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber5">
					</el-table-column>
					<el-table-column v-if="item.label=='已核销金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber6">
					</el-table-column>
					<el-table-column v-if="item.label=='未核销金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber7">
					</el-table-column>

					<el-table-column v-if="item.label=='客户单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='清单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='核销单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope" v-if="scope.row.writeoffNum">
							<p v-for="(item,index) in scope.row.writeoffNum.split('  ')" :key="index">
                <span>{{item.split(' ')[1]}}</span>
								<!-- <a href="javascript:void(0)" @click="doView2(item.split(' ')[0],scope.row.debitNoteNum,scope.row.statementNum)" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a> -->
							</p>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='账单备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<!-- <el-table-column v-if="item.label=='发票日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterInvoiceDate">
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
				<!-- 	<el-table-column v-if="item.label=='发票抬头'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterInvoiceTitle" header-align="center">
					</el-table-column> -->
					<!-- <el-table-column v-if="item.label=='发票备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber8" header-align="center">
					</el-table-column> -->
          <el-table-column v-if="item.label=='开票申请人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_creatorName_invoice">
          </el-table-column>

          <el-table-column v-if="item.label=='开票申请时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          </el-table-column>
					<el-table-column v-if="item.label=='制单人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_creatorName">
					</el-table-column>

					<el-table-column v-if="item.label=='账单制作时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
				</template>




				<!-- 	<el-table-column fixed align="center" prop="debitNoteStatus" width="80" label="账单状态"></el-table-column>
				<el-table-column fixed align="center" prop="debitNoteDate" label="账单日期" width="90"></el-table-column>
				<el-table-column align="center" prop="awbNumber" width="110" label="主单号"></el-table-column>
				<el-table-column align="center" prop="orderCode" label="订单号" width="120"></el-table-column>
				<el-table-column align="center" prop="flightDate" width="90" label="开航日期"></el-table-column> -->

				<!--<el-table-column align="right" prop="currencyAmount" label="账单金额" width="140" :formatter="currencyAmountFormat">-->
				<!-- <el-table-column align="right" label="账单金额（原币）" width="140">
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
				<el-table-column align="right" prop="functionalAmount" label="账单金额（本币）" width="140" :formatter="formatterNumber5"></el-table-column>
				<el-table-column align="right" prop="functionalAmountWriteoff" label="已核销金额（本币）" width="140" :formatter="formatterNumber6"></el-table-column>
				<el-table-column align="right" prop="functionalAmountWriteoff" label="未核销金额（本币）" width="160" :formatter="formatterNumber7"></el-table-column>
				<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column> -->
				<!--<el-table-column align="center" prop="customerName" label="收款客户" width="250"></el-table-column>-->
				<!--<el-table-column align="center" prop="currency" label="币种"></el-table-column>-->
				<!--<el-table-column align="center" prop="amountTaxRate" label="税率"></el-table-column>
				<el-table-column align="right" prop="amountNotTax" label="无税金额" :formatter="floatMountFormat"></el-table-column>
				<el-table-column align="center" prop="amountTax" label="税额" :formatter="floatMountFormat"></el-table-column>-->
				<!-- <el-table-column align="center" prop="statementNum" width="140" label="清单号"></el-table-column>
				<el-table-column align="center" label="核销单号" width="140">
					<template slot-scope="scope" v-if="scope.row.writeoffNum">
						<p v-for="(item,index) in scope.row.writeoffNum.split('  ')" :key="index">
							<a href="javascript:void(0)" @click="doView2(item.split(' ')[0],scope.row.debitNoteNum)" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a>
						</p>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="debitNoteRemark" width="400" label="账单备注"></el-table-column>
				<el-table-column align="center" prop="debitNoteRemark" width="400" label="发票备注" :formatter="formatterNumber8"></el-table-column>
				<el-table-column align="center" prop="creatorName" width="100" label="制单人" :formatter="formatter_creatorName"></el-table-column>
				<el-table-column align="center" prop="createTime" width="150" label="账单制作时间"></el-table-column> -->
				<!-- <el-table-column align="center" prop="editorName" label="操作人" min-width="200"></el-table-column>
				<el-table-column align="center" prop="editTime" label="操作时间" width="180"></el-table-column> -->
				<!-- <el-table-column align="center" prop="" label=""></el-table-column> -->
			</el-table>
		</div>
		<div ref="af_debit_note_bill_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
		<print ref="addMission" v-if="printVisible" :visible.sync="printVisible" :frow="frow"></print>
		<billViewIncome ref="addMission" v-if="billViewIncome" :visible.sync="billViewIncome" :frow="frow"></billViewIncome>
		<billViewIncome2 ref="addMission" v-if="billViewIncome2" :visible.sync="billViewIncome2" :frow="frow"></billViewIncome2>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisibleTag>
		<writeoffVisibleTag ref="addMission" v-if="writeoffVisible" :visible.sync="writeoffVisible" :frow="frow"></writeoffVisibleTag>
		<remarkVisible ref="addMission" v-if="remarkVisible" :visible.sync="remarkVisible" :frow="frow"></remarkVisible>
    <invoiceVisibleTag ref="addMission" v-if="invoiceVisible" :visible.sync="invoiceVisible" :frow="frow"></invoiceVisibleTag>
    <invoiceAutoTag ref="addMission" v-if="invoiceAutoVisible" :visible.sync="invoiceAutoVisible" :frow="frow"></invoiceAutoTag>
	</div>
</template>
<script>
	import setVisibleVue from './af_debit_note_bill_setting'
	import Print from './af_debit_note_print'
	import billViewIncome from './af_order_bill_view'
	import billViewIncome2 from './af_debit_note_bill_writeoff_view'
	import saveVisibleVue from './af_debit_note_list_save'
	import writeoffVisibleVue from './af_debit_note_bill_writeoff'
	import remarkVisible from './af_debit_note_bill_remark'
	import columns from './af_debit_note_bill_column.json'
  import invoice from '../invoice/openInvoice.vue'
  import invoiceAuto from '../invoice/invoice_auto.vue'
	export default {
		data() {
			return {
				tableHeight: '800px',
				loading: false,
				billButtonFlag: false,
        makeListFlag:false,
        openInvoiceFlag:false,
        cancelInvoiceFlag:false,
        invoiceAutoVisible:false,
        invoiceAutoWriteoffFlag:false,
				data: [],
				tableColumns: [],
				serviceIds: [],
				expandRowKeys: [],
				serviceOptions: [],
				allCheck: false,
        mapInfo:null,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100, 500]
				},
				printVisible: false,
				billViewIncome: false,
				billViewIncome2: false,
				setVisible: false,
				saveVisible: false,
				remarkVisible: false,
				writeoffVisible: false,
				awbNumberFlag: true,
        invoiceVisible:false,
        excelColumns:'',
				frow: {},
				query: {
					businessScope: 'AE',
					serviceIdStr: '',
					debitNoteNum: '',
					awbNumber: '',
					orderCode: '',
					billStatus: '',
					customerName: '',
					customerNumber: '',
					debitNoteDateStart: '',
					debitNoteDateEnd: '',
					flightDateStart: '',
					flightDateEnd: '',
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
				selectionData: [],
				billStatus: ['已制账单'],
				debitNoteStatus: ['已制账单', '已制账单'],
				debitNoteStatuss: [{
					label: '已制账单',
					value: '已制账单'
				}, {
					label: '已制清单',
					value: '已制清单'
				}, {
					label: '部分核销',
					value: '部分核销'
				}, {
					label: '核销完毕',
					value: '核销完毕'
				}],
				showFlag: false
			}
		},
		created: function() {
      this.excelColumns = JSON.stringify(columns.info);
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('af-make-statemen') > -1) {
				this.makeListFlag = true;
			}
      if (buttonInfo.indexOf('af-debit-open-invoice') > -1) {
      	this.openInvoiceFlag = true;
      }
      if (buttonInfo.indexOf('af-debit-cancel-invoice') > -1) {
      	this.cancelInvoiceFlag = true;
      }
      if(buttonInfo.indexOf('af-debit-invoice-writeoff') > -1){
        this.invoiceAutoWriteoffFlag = true;
      }
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
        if(response.data.data){
          // this.businessCodes = response.data.data.filter(item=>{
          //   return item.paramText!='TI';
          // });
          this.businessCodes = response.data.data;
        }
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			this.setServiceOptions();
			this.query.flightDateEnd = this.getDateTime(new Date());

			//从数据库查询设置信息
			let pageName = '财务结算管理/收入对账/账单';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let af_debit_note_bill_column = response.data.data;
					if (af_debit_note_bill_column && af_debit_note_bill_column.length > 0) {
						this.tableColumns = this.sortBykey(af_debit_note_bill_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.info, 'index');
					}
					this.tableColumns = this.setLabel(this.tableColumns);
				}.bind(this));
			/*let userId = window.localStorage.getItem('userId');
			let list_column = window.localStorage.getItem(userId + '_af_debit_note_bill_column');
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
			'saveVisibleTag': saveVisibleVue,
			'remarkVisible': remarkVisible,
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
            	this.$axios.deletes('/afbase/cssIncomeInvoice/debitNoteId/' + row.debitNoteId+'/'+row.rowUuid).then((response) => {
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
            this.openError("您好，未开发票的账单 才可 撤销开票申请。");
            this.queryList();
         }
       },

      //invoice
      openInvoice(){
         this.$axios.get2('/afbase/debitNote/selectCheckDebit', {
         	debitNoteIds: this.frow.debitNoteId
         }).then(function(response) {
            let checkFlag = true;
         	if (response.data.data && response.data.data.length > 0) {
         		response.data.data.forEach((debitNote) => {
               if(debitNote.invoiceId){
                 this.openError("您好，账单号" + debitNote.debitNoteNum + "已做 开票申请 或 已开票 ，不能重复申请！");
                 checkFlag = false;
                 return false;
               }else if(debitNote.statementId){
                 this.openError("您好，账单号" + debitNote.debitNoteNum + "已制清单，请在清单页面进行开票申请。");
                 checkFlag = false;
                 return false;
               }
         		});
         	}else{
             checkFlag = false;
             this.openError("账单不是最新数据，请刷新页面再操作");
          }
         	if (checkFlag) {
            this.frow.invoiceType = 'debitNote';
         		this.invoiceVisible = true;
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
					localStorage.setItem(userId + '_af_debit_note_bill_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.setVisible = true;
				this.frow.businessScope = this.query.businessScope
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let af_debit_note_bill_header = this.$refs.af_debit_note_bill_header.offsetHeight;
					let af_debit_note_bill_footer = this.$refs.af_debit_note_bill_footer.offsetHeight;
					let heightS = window.innerHeight - 165 - af_debit_note_bill_header - af_debit_note_bill_footer;
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
			setServiceOptions() {
				this.businessScope = [];
				this.query.serviceIdStr = '';
				if (this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
					this.awbNumberFlag = false;
				} else {
					this.awbNumberFlag = true;
				}
				this.$axios.get2('/afbase/service/queryList', {
					businessScope: this.query.businessScope
				}).then(function(response) {
					this.serviceOptions = response.data.data;
				}.bind(this)).catch(function(error) {});
			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			handleCommand(command) {
				if (command == 'print') {
					// this.showPrint()
					this.printDebitNote();
				} else if (command == 'showBill') {
					this.showBill()
				} else if (command == 'writeoff') {
					this.doWriteoff()
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
          this.openError("您好，账单页面只支持单币种的账单进行核销，请开票后再进行核销。");
          return false
        }
        this.$axios.get2('/afbase/debitNote/selectCheckDebit', {
        	debitNoteIds: this.frow.debitNoteId
        }).then(function(response) {
           let checkFlag = true;
        	if (response.data.data && response.data.data.length > 0) {
        		response.data.data.forEach((debitNote) => {
              if(debitNote.invoiceId){
                this.openError("您好，账单号" + debitNote.debitNoteNum + "已申请开票或已开票，请在发票页面进行核销。");
                checkFlag = false;
                return false;
              }else if(debitNote.statementId){
                this.openError("您好，账单号" + debitNote.debitNoteNum + "已制清单，请到清单页面进行核销。");
                checkFlag = false;
                return false;
              }
        		});
        	}else{
            checkFlag = false;
            this.openError("账单不是最新数据，请刷新页面再操作");
         }
        	if (checkFlag) {
            this.frow.titleName="账单";
            this.invoiceAutoVisible = true;
        	}
        }.bind(this));
      },
			handleChange(command) {
				this.frow = command
			},
			showPrint() {
				this.printVisible = true;
			},
			showBill() {
				this.frow.dataBean = this.frow;
				this.billViewIncome = true;
			},
			showRemark() {
				this.frow.debitNoteId = this.frow.debitNoteId;
				this.frow.invoiceRemark = this.frow.invoiceRemark;
				this.frow.invoiceTitle = this.frow.invoiceTitle;
				this.frow.invoiceNum = this.frow.invoiceNum;
				this.frow.invoiceDate = this.frow.invoiceDate;
				this.frow.customerName = this.frow.customerName;
				this.remarkVisible = true;
			},
			doView2(incomeWriteoffId, debitNoteNum, statementNum) {
				this.frow.incomeWriteoffId = incomeWriteoffId;
				this.frow.debitNoteNum = debitNoteNum;
				this.frow.statementNum = statementNum;
				this.billViewIncome2 = true;
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
			doWriteoff() {
				this.$axios.get2('/afbase/debitNote/selectCheckDebit', {
					debitNoteIds: this.frow.debitNoteId
				}).then(function(response) {
					let checkFlag2 = true;
					let checkMsg = '';
					if (response.data.data && response.data.data.length > 0) {
						if (response.data.data[0].statementId) {
							checkMsg = checkMsg + "账单已做清单";
							checkFlag2 = false;
						}
						if (response.data.data[0].writeoffComplete == 1) {
							checkMsg = checkMsg + "账单已完成核销";
							checkFlag2 = false;
						}
					}
					if (!checkFlag2) {
						this.openError(checkMsg);
						return;
					} else {
						if (response.data.data && response.data.data.length > 0) {
							if (response.data.data[0].functionalAmountWriteoff) {
								this.frow.functionalAmountWriteoff = response.data.data[0].functionalAmountWriteoff;
							} else {
								this.frow.functionalAmountWriteoff = 0;
							}
							this.frow.functionalAmountNo = response.data.data[0].functionalAmount - response.data.data[0].functionalAmountWriteoff;
						}
						this.writeoffVisible = true;
					}
				}.bind(this));
			},
			doWriteoff2() {
				// if(this.selectionData.length != 1) {
				// 	this.openError("请选择一个账单");
				// 	return;
				// }
				this.frow.debitNoteId = this.selectionData[0].debitNoteId;
				this.frow.customerId = this.selectionData[0].customerId;
				this.frow.customerName = this.selectionData[0].customerName;

				this.frow.businessScope = this.selectionData[0].businessScope;
				this.frow.debitNoteNum = this.selectionData[0].debitNoteNum;

				this.frow.functionalAmount = this.selectionData[0].functionalAmount;
				if (this.selectionData[0].functionalAmountWriteoff) {
					this.frow.functionalAmountWriteoff = this.selectionData[0].functionalAmountWriteoff;
				} else {
					this.frow.functionalAmountWriteoff = 0;
				}

				this.frow.functionalAmountNo = this.frow.functionalAmount - this.frow.functionalAmountWriteoff;
				if (Math.abs(this.frow.functionalAmountNo) <= 0) {
					this.openError("账单已完成核销");
					return;
				}
				// if (this.frow.functionalAmount==this.frow.functionalAmountWriteoff) {
				// 	this.openError("账单已完成核销");
				// 	return;
				// }
				// alert(this.frow.debitNoteId);
				return;
				this.writeoffVisible = true;
			},
			makeList(row, flag) {
				this.frow.selections = this.selectionData;

				if (this.frow.selections.length == 0) {
					this.openError("请至少选择一个账单");
					return;
				}

				if (this.frow.selections.length > 1) {
					let a = this.frow.selections[0].customerName;
					let b = this.frow.selections[0].amountTaxRate;
					let aFlag = 0;
					let bFlag = 0;
					this.frow.selections.forEach((row) => {
						if (a != row.customerName) {
							aFlag = 1;
						}
						if (b != row.amountTaxRate) {
							bFlag = 1;
						}
					})
					if (aFlag === 1) {
						this.openError("请选择相同收款客户");
						return;
					}
					if (bFlag === 1) {
						this.openError("请选择相同税率");
						return;
					}

				}

				let cFlag = 0;
				let dFlag = 0;
				let eFlag = 0;
				let cMessage = '';
				let dMessage = '';
				let eMessage = '';
				let debitNoteIds = '';
				this.frow.selections.forEach((row) => {
					debitNoteIds = debitNoteIds + "," + row.debitNoteId;
				});

				this.$axios.get2('/afbase/debitNote/selectCheckDebit', {
					debitNoteIds: debitNoteIds
				}).then(function(response) {
					let checkFlag = true;
					if (response.data.data && response.data.data.length > 0) {
						response.data.data.forEach((debitNote) => {
							if (debitNote.statementId) {
								this.openError("编号" + debitNote.debitNoteNum + "已做清单");
								checkFlag = false;
								return false;
							}
							//if(dFlag === 1) {
							//	this.openError("编号" + dMessage + "已开发票");
							//	return;
							//}
							if (debitNote.writeoffComplete === 0 || debitNote.writeoffComplete === 1) {
								this.openError("编号" + debitNote.debitNoteNum + "已核销");
								checkFlag = false;
								return false;
							}

              if(debitNote.invoiceId){
                this.openError("您好，账单号" + debitNote.debitNoteNum + "已做 开票申请 或 已开票 ，不允许制作清单！");
                checkFlag = false;
                return false;
              }

						});
					}
					if (checkFlag) {
						this.saveVisible = true;
					}
				}.bind(this));
			},
			printDebitNote() {
				var map = [];
				map.push(this.frow);
				this.frow.data = map;
				this.printVisible = true
			},
			printDebitNote2() {
				if (this.selectionData == null || this.selectionData == 0) {
					this.openError('请至少选择一个账单')
					return
				}
				this.frow.data = this.selectionData
				this.printVisible = true
			},
			delete(row, type) {
				let typeName = ""
				let printId = ""
				if (type == 'mawb') {
					typeName = '主单'
					printId = row.awbPrintIdCopy
				} else if (type == 'hawb') {
					typeName = '分单'
					printId = row.awbPrintId
				}
				this.$confirm('您将删除' + typeName + ' ' + row.hawbNumber + ', 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/awbPrint/' + printId).then((response) => {
						if (response.data.code == '0') {
							this.openSuccess("删除成功！")
							this.queryList();
						} else {
							this.openError("作废失败：" + response.data.data.messageInfo)
						}
					}).catch((error) => {
						this.openError("作废失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
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
					let pageName = '财务结算管理/收入对账/账单';
					this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
						.then(function(response) {
							let af_debit_note_bill_column = response.data.data;
							if (af_debit_note_bill_column && af_debit_note_bill_column.length > 0) {
								this.query.columnStrs = JSON.stringify(af_debit_note_bill_column);
							} else {
								this.query.columnStrs = this.excelColumns;
							}
							this.exportExcelSure();
						}.bind(this));
					/*let userId = window.localStorage.getItem('userId');
					let list_column = window.localStorage.getItem(userId + '_af_debit_note_bill_column');
					if (list_column) {
						this.query.columnStrs = list_column;
					} else {
						this.query.columnStrs = '';
					}
					this.exportExcelSure();*/
				}).catch(() => {
					this.query.columnStrs = this.excelColumns;
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
        if(this.query.columnStrs){
           let columnList = JSON.parse(this.query.columnStrs);
           columnList = this.setLabel(columnList);
           this.query.columnStrs = JSON.stringify(columnList);
        }
				this.$axios.post3('/afbase/debitNote/exportExcelList', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '收入对账账单列表' + '.xls'; // 下载后文件名
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
				let pageName = '财务结算管理/收入对账/账单';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let af_debit_note_bill_column = response.data.data;
						if (af_debit_note_bill_column && af_debit_note_bill_column.length > 0) {
							this.tableColumns = this.sortBykey(af_debit_note_bill_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.info, 'index');
						}
						this.loading = true

						this.tableColumns = this.setLabel(this.tableColumns);
						let billStatusStr = '';
						for (var i = 0; i < this.billStatus.length; i++) {
							if (i == 0) {
								billStatusStr = this.billStatus[i];
							} else {
								billStatusStr = billStatusStr + ',' + this.billStatus[i]
							}

						}
						this.query.billStatus = billStatusStr;
						let serviceIdStr = '';
						for (var i = 0; i < this.serviceIds.length; i++) {
							if (i == 0) {
								serviceIdStr = this.serviceIds[i];
							} else {
								serviceIdStr = serviceIdStr + ',' + this.serviceIds[i]
							}

						}
						this.query.serviceIdStr = serviceIdStr;
						this.$axios.get2('/afbase/debitNote/page2?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
							if (this.data.length == 0) {
								let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
								this.queryList2(current);
							} else {
								this.data.forEach((row) => {
									if (row.isParent == true) {
										this.expandRowKeys.push(row.debitNoteId)
									}
								})
								this.selectionData = []
                this.sumAmountDobit();
								this.allCheck = false
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}.bind(this));

				/*	let userId = window.localStorage.getItem('userId');
					let list_column = window.localStorage.getItem(userId + '_af_debit_note_bill_column');
					if (list_column) {
						let arrayC = JSON.parse(list_column)
						if (arrayC && arrayC.length > 0) {
							this.tableColumns = this.sortBykey(arrayC, 'index');
						}
					} else {
						this.tableColumns = this.sortBykey(columns.info, 'index');
					}*/

			},
			queryList2(current) {
				this.$axios.get2('/afbase/debitNote/page2?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.data.forEach((row) => {
						if (row.isParent == true) {
							this.expandRowKeys.push(row.debitNoteId)
						}
					})
					this.selectionData = []
          this.sumAmountDobit();
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
			formatterNumber4(row, column) {
				let awbNumber = '';
				if (row.awbNumber && row.hawbNumber) {
					awbNumber = row.awbNumber + '-' + row.hawbNumber
				} else if (row.awbNumber) {
					awbNumber = row.awbNumber;
				} else {
					awbNumber = row.hawbNumber
				}
				return awbNumber;
			},
			formatterNumber5(row, column) {
				if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmount);
				}
			},
			formatterNumber6(row, column) {
				if (row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff == null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmountWriteoff);
				}
			},
			formatterNumber7(row, column) {
				if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
					return "";
				} else {
					let woff = row.functionalAmountWriteoff;
					if (row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff == null) {
						woff = 0;
					}
					let numW = row.functionalAmount - woff
					if (numW > 0 || numW < 0) {
						return this.getNumber(numW);
					} else {
						return "";
					}
				}
			},
			formatterNumber8(row, column) {
				if (row.statementId) {
					return row.invoiceRemark2;
				} else {
					return row.invoiceRemark;
				}
			},
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
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (row.isParent === true) {
					if (columnIndex === 2) {
						return [1, 2]
					} else if (columnIndex === 1) {
						return [1, 0]
					} else {
						return [1, 1]
					}
				}
			},
			changeAllCheck(selection) {
				this.data.forEach((row) => {
					if (selection) {
						row.checkBox = true
					} else {
						row.checkBox = false
					}
					// this.changeRowCheck(row)
            if (row.isParent) {
                row.children.forEach((child) => {
                  if (row.checkBox) {
                    child.checkBox = true
                  } else {
                    child.checkBox = false
                  }
                })
            }
				})
        this.fillSelectionData()
        //勾选合计

			},
			changeRowCheck(row) {
				if (row.isParent) {
					row.children.forEach((child) => {
						if (row.checkBox) {
							child.checkBox = true
						} else {
							child.checkBox = false
						}
					})
				}
				this.fillSelectionData();
			},
      sumAmountDobit(){
        let val = this.selectionData;
        let  map = new Map();
        if(val&&val.length>0){
            val.forEach(function(item, index) {
              if(item.mapAmountOne){
                let mapTran =eval("("+item.mapAmountOne+")")
                for(let p in mapTran){
                     if(map&&map.size>0){
                        if(map.has(p)){
                            map.set(p,map.get(p)+mapTran[p]);
                        }else{
                          map.set(p,mapTran[p]);
                        }
                     }else{
                       map.set(p,mapTran[p]);
                     }
                 }
              }
　　　　　 });
          this.mapInfo = map;
        }else{
          this.mapInfo = null
        }
     },
     amountFormat(amount,currency){
       if(amount){
          return this.getNumber(amount)+"("+currency+")";
       }else{
         return "";
       }
     },
			getDateTime1(theDate) {
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
			},
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
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
				var new_date = new Date(_year, _month, 1);
				_date = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
				return _year + "-" + _month + "-" + _date + " 23:59:59";
			},
			fillSelectionData() {
				let arr = []
				this.data.forEach((row) => {
					arr = arr.concat(row.children.filter(item => item.checkBox))
				})
				this.selectionData = arr
        this.sumAmountDobit();
			},
			setLabel(tableColumns) {
				let indexDelete = [];
				tableColumns.forEach((column, index) => {
					if (column.prop == 'flightDate' && this.query.businessScope.endsWith('I') && this.query.businessScope!='TI') {
						column.label = '到港日期'
					} else if (column.prop == 'flightDate' && this.query.businessScope=='TE') {
						column.label = '发车日期'
					}else if (column.prop == 'flightDate' && this.query.businessScope=='TI') {
						column.label = '到达日期'
					} else if (column.prop == 'flightDate' && this.query.businessScope.endsWith('E') && this.query.businessScope!='TE') {
						column.label = '开航日期'
					} else if (column.prop == 'flightDate' && this.query.businessScope.endsWith('C')) {
						column.label = '用车日期'
					}else if(column.prop == 'flightDate' && this.query.businessScope=='IO'){
            column.label = '业务日期'
          }
					if (column.prop == 'flightNo' && this.query.businessScope.startsWith('A')) {
						column.label = '航班号'
					} else if (column.prop == 'flightNo' && this.query.businessScope.startsWith('S')) {
						column.label = '航次号'
					} else if (column.prop == 'flightNo' && this.query.businessScope.startsWith('T')) {
						column.label = '产品类型'
						column.prop = 'productType';
					} else if (column.prop == 'flightNo' && this.query.businessScope.startsWith('L')) {
						column.label = '运输方式'
						column.prop = 'shippingMethod';
					}else if(column.prop == 'flightNo' && this.query.businessScope=='IO'){
            column.label = '业务分类'
            column.prop = 'business_method';
          }
					if (column.prop == 'awbNumber') {
						if (this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
							indexDelete.push(index);
						}else if(this.query.businessScope.startsWith('T')){
              column.label = '运单号'
            }else{
              column.label = '主单号'
            }
					}
				})
				if (indexDelete.length > 0) {
					indexDelete.sort(function(a, b) {
						return a - b;
					});
					for (let i = 0; i < indexDelete.length; i++) {
						this.$delete(tableColumns, indexDelete[i] - i);
					}
				}
        return tableColumns;
			}
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
  .currencyRedColor{
  	color: red !important;
  }
</style>
