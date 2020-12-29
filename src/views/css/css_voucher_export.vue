<template>
	<el-tabs v-model="query.activeName" type="card" @tab-click="handleClick">
		<el-tab-pane label="收入挂账" name="income">
			<div class="warp-main">
				<el-form :inline="false" :model="query" label-width="10px" class="cssVoucherExport">
					<div ref="css_voucher_export_header0">
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:134px;">
										<template slot="prepend">业务范畴</template>
										<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:65px;margin-right: -5px;">
											<el-option v-for="item in businessScopes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:150px;">
										<template slot="prepend">已转凭证</template>
										<el-select slot="suffix" v-model="query.voucherStatus" style="width:81px;margin-right: -5px;">
											<el-option label="全部" value="">
											</el-option>
											<el-option label="是" value="true">
											</el-option>
											<el-option label="否" value="false">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.awbNumber" clearable auto-complete="off">
										<template slot="prepend">
											<span v-if="query.businessScope=='IO'||query.businessScope=='LC'||query.businessScope=='TE'">客户单号/订单号</span>
											<span v-else>提单号/订单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">锁账日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.lockDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.lockDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
									<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
									<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showVoucherGenerate">批量生成</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="voucherCallback">退回</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.customerName" clearable auto-complete="off">
										<template slot="prepend">收款客户</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.voucherCreatorName" clearable auto-complete="off">
										<template slot="prepend">操作人</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">凭证日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.voucherDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.voucherDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="38px">
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.coopName" clearable auto-complete="off">
										<template slot="prepend">订单客户</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<el-table v-loading="loading" :data="data" border :summary-method="getSummaries" show-summary stripe highlight-current-row @header-dragend="cellWidth" @selection-change="handleSelectionChange" :max-height="tableHeight">
					<el-table-column fixed type="selection" align="center" width="50">
					</el-table-column>
					<template v-for="(item,index) in tableColumns">
						<el-table-column v-if="item.prop=='voucherCreatorName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='voucherNumber'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVoucherNumber">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='incomeFunctionalAmount'||item.prop=='costFunctionalAmount'" header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						</el-table-column>
					</template>
				</el-table>
				<div class="pagination" ref="css_voucher_export_footer0">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="成本挂账" name="cost">
			<div class="warp-main">
				<el-form :inline="false" :model="query" label-width="10px" class="cssVoucherExport">
					<div ref="css_voucher_export_header1">
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:134px;">
										<template slot="prepend">业务范畴</template>
										<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:65px;margin-right: -5px;">
											<el-option v-for="item in businessScopes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:150px;">
										<template slot="prepend">已转凭证</template>
										<el-select slot="suffix" v-model="query.voucherStatus" style="width:81px;margin-right: -5px;">
											<el-option label="全部" value="">
											</el-option>
											<el-option label="是" value="true">
											</el-option>
											<el-option label="否" value="false">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.awbNumber" clearable auto-complete="off">
										<template slot="prepend">
											<span v-if="query.businessScope=='IO'||query.businessScope=='LC'||query.businessScope=='TE'">客户单号/订单号</span>
											<span v-else>提单号/订单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">锁账日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.lockDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.lockDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
									<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
									<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showVoucherGenerate">批量生成</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="voucherCallback">退回</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.customerName" clearable auto-complete="off">
										<template slot="prepend">供应商</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.voucherCreatorName" clearable auto-complete="off">
										<template slot="prepend">操作人</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">凭证日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.voucherDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.voucherDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="38px">
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.coopName" clearable auto-complete="off">
										<template slot="prepend">订单客户</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<el-table v-loading="loading" :data="data" border :summary-method="getSummaries" show-summary stripe highlight-current-row @header-dragend="cellWidth" @selection-change="handleSelectionChange" :max-height="tableHeight">
					<el-table-column fixed type="selection" align="center" width="50">
					</el-table-column>
					<template v-for="(item,index) in tableColumns">
						<el-table-column v-if="item.prop=='voucherCreatorName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='voucherNumber'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVoucherNumber">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='incomeFunctionalAmount'||item.prop=='costFunctionalAmount'" header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						</el-table-column>
					</template>
				</el-table>
				<div class="pagination" ref="css_voucher_export_footer1">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="应收核销" name="incomeWriteoff">
			<div class="warp-main">
				<el-form :inline="false" :model="query" label-width="10px" class="cssVoucherExport">
					<div ref="css_voucher_export_header2">
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:134px;">
										<template slot="prepend">业务范畴</template>
										<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:65px;margin-right: -5px;">
											<el-option v-for="item in businessScopes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:150px;">
										<template slot="prepend">已转凭证</template>
										<el-select slot="suffix" v-model="query.voucherStatus" style="width:81px;margin-right: -5px;">
											<el-option label="全部" value="">
											</el-option>
											<el-option label="是" value="true">
											</el-option>
											<el-option label="否" value="false">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.awbNumber" clearable auto-complete="off">
										<template slot="prepend">
											<span v-if="query.businessScope=='IO'||query.businessScope=='LC'||query.businessScope=='TE'">客户单号/订单号</span>
											<span v-else>提单号/订单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">核销日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.writeoffDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.writeoffDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
									<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
									<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showVoucherGenerate">批量生成</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="voucherCallback">退回</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.coopName" clearable auto-complete="off">
										<template slot="prepend">收款客户</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.debitnoteNumber" clearable auto-complete="off">
										<template slot="prepend">账单/清单号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">凭证日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.voucherDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.voucherDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="38px">
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.writeoffNumber" clearable auto-complete="off">
										<template slot="prepend">核销单号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.invoiceNumber" clearable auto-complete="off">
										<template slot="prepend">发票号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">发票日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.invoiceDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.invoiceDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.writeoffCreatorName" clearable auto-complete="off">
										<template slot="prepend">核销人</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.voucherCreatorName" clearable auto-complete="off">
										<template slot="prepend">操作人</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<el-table v-loading="loading" :data="data" :summary-method="getSummaries" :cell-style="addCellStyle" show-summary border stripe highlight-current-row @header-dragend="cellWidth" @selection-change="handleSelectionChange" :max-height="tableHeight">
					<el-table-column fixed type="selection" align="center" width="50">
					</el-table-column>
					<template v-for="(item,index) in tableColumns">
						<el-table-column v-if="item.prop=='voucherCreatorName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='voucherNumber'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVoucherNumber">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='writeoffAmount'" header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						</el-table-column>
					</template>
				</el-table>
				<div class="pagination" ref="css_voucher_export_footer2">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="应付核销" name="costWriteoff">
			<div class="warp-main">
				<el-form :inline="false" :model="query" label-width="10px" class="cssVoucherExport">
					<div ref="css_voucher_export_header3">
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:134px;">
										<template slot="prepend">业务范畴</template>
										<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:65px;margin-right: -5px;">
											<el-option v-for="item in businessScopes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:150px;">
										<template slot="prepend">已转凭证</template>
										<el-select slot="suffix" v-model="query.voucherStatus" style="width:81px;margin-right: -5px;">
											<el-option label="全部" value="">
											</el-option>
											<el-option label="是" value="true">
											</el-option>
											<el-option label="否" value="false">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.awbNumber" clearable auto-complete="off">
										<template slot="prepend">
											<span v-if="query.businessScope=='IO'||query.businessScope=='LC'||query.businessScope=='TE'">客户单号/订单号</span>
											<span v-else>提单号/订单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">核销日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.writeoffDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.writeoffDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
									<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
									<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showVoucherGenerate">批量生成</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="voucherCallback">退回</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.coopName" clearable auto-complete="off">
										<template slot="prepend">供应商</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.debitnoteNumber" clearable auto-complete="off">
										<template slot="prepend">对账单编号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">凭证日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.voucherDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.voucherDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="38px">
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.writeoffNumber" clearable auto-complete="off">
										<template slot="prepend">核销单号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.invoiceNumber" clearable auto-complete="off">
										<template slot="prepend">发票号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">发票日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.invoiceDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.invoiceDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 294px;" v-model="query.writeoffCreatorName" clearable auto-complete="off">
										<template slot="prepend">核销人</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 240px;" v-model="query.voucherCreatorName" clearable auto-complete="off">
										<template slot="prepend">操作人</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<el-table v-loading="loading" :data="data" :summary-method="getSummaries" :cell-style="addCellStyle" show-summary border stripe highlight-current-row @header-dragend="cellWidth" @selection-change="handleSelectionChange" :max-height="tableHeight">
					<el-table-column fixed type="selection" align="center" width="50">
					</el-table-column>
					<template v-for="(item,index) in tableColumns">
						<el-table-column v-if="item.prop=='voucherCreatorName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='voucherNumber'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVoucherNumber">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='writeoffAmount'" header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						</el-table-column>
					</template>
				</el-table>
				<div class="pagination" ref="css_voucher_export_footer3">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="费用核销" name="feeWriteoff">
			<div class="warp-main">
				<el-form :inline="false" :model="query" label-width="10px" class="cssVoucherExport">
					<div ref="css_voucher_export_header4">
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:150px;">
										<template slot="prepend">已转凭证</template>
										<el-select slot="suffix" v-model="query.voucherStatus" style="width:81px;margin-right: -5px;">
											<el-option label="全部" value="">
											</el-option>
											<el-option label="是" value="true">
											</el-option>
											<el-option label="否" value="false">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">凭证日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.voucherDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.voucherDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:204px;">
										<template slot="prepend">报销日期</template>
										<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.expenseReportDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 135px;" v-model="query.expenseReportDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
									<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
									<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showVoucherGenerate">批量生成</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="voucherCallback">退回</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 220px;" v-model="query.expenseReportNum" clearable auto-complete="off">
										<template slot="prepend">
											<span>报销单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 200px;" v-model="query.expensesUse" clearable auto-complete="off">
										<template slot="prepend">费用用途</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 210px;" v-model="query.expenseCreatorName" clearable auto-complete="off">
										<template slot="prepend">申请人</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width: 213px;" v-model="query.voucherCreatorName" clearable auto-complete="off">
										<template slot="prepend">操作人</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="38px">
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:220px;">
										<template slot="prepend">付款方式</template>
										<el-select slot="suffix" v-model="query.paymentMethod" style="width:151px;margin-right: -5px;" clearable>
											<el-option label="现金" value="现金">
											</el-option>
											<el-option label="支票" value="支票">
											</el-option>
											<el-option label="转账" value="转账">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input style="width:200px;">
										<template slot="prepend">报销性质</template>
										<el-select slot="suffix" v-model="query.expenseReportMode" style="width:131px;margin-right: -5px;" clearable>
											<el-option label="对公" value="对公">
											</el-option>
											<el-option label="个人" value="个人">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<el-table v-loading="loading" :data="data" :summary-method="getSummaries" show-summary border stripe highlight-current-row @header-dragend="cellWidth" @selection-change="handleSelectionChange" :max-height="tableHeight">
					<el-table-column fixed type="selection" align="center" width="50">
					</el-table-column>
					<template v-for="(item,index) in tableColumns">
						<el-table-column v-if="item.prop=='voucherCreatorName'||item.prop=='expenseCreatorName'||item.prop=='approvalFinancialUserName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='voucherNumber'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVoucherNumber">
						</el-table-column>
						<el-table-column v-else-if="item.prop=='expenseAmount'" header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
						</el-table-column>
						<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						</el-table-column>
					</template>
				</el-table>
				<div class="pagination" ref="css_voucher_export_footer4">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-dialog title="凭证生成" width="350px" :visible="voucherVisible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="closeVoucher">
			<el-form label-width="50px" class="cssVoucherExportDialog">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:237px;" class="widthWithFourWithXing">
								<template slot="prepend">
									<span style="color: red;">*</span>
									<span>凭证日期</span>
								</template>
								<el-date-picker slot="suffix" style="width: 140px;margin-right: -5px;" clearable v-model="voucher.voucherDate" type="date" value-format="yyyy-MM-dd" placeholder="凭证日期">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="8" style="width: 237px;" class="widthWithThreeWithXing" v-model="voucher.voucherNumber" clearable auto-complete="off">
								<template slot="prepend">
									<span style="color: red;">*</span>
									<span>凭证号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-radio v-model="voucher.voucherIsDetail" :label=0>汇总生成</el-radio>
							<el-radio v-model="voucher.voucherIsDetail" :label=1>明细生成</el-radio>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-button type="primary" size="mini" @click="confirmVoucher" :loading="buttonLoading">确认</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
	</el-tabs>
</template>
<script>
	import setVisibleVue from './cssVoucherExport/css_voucher_export_setting.vue'
	import columns from './cssVoucherExport/css_voucher_export_column.json'
	export default {
		data() {
			return {
				data: [],
				tableColumns: [],
				businessScopes: [],
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
					activeName: 'income',
					businessScope: 'AE',
					voucherStatus: 'false',
					voucherDateStart: '',
					voucherDateEnd: '',
					invoiceDateStart: '',
					invoiceDateEnd: '',
					writeoffDateStart: this.getCurrMonthFirstDay(),
					writeoffDateEnd: this.getDateTime(new Date()),
					expenseReportDateStart: this.getCurrMonthFirstDay(),
					expenseReportDateEnd: this.getDateTime(new Date()),
					lockDateStart: this.getCurrMonthFirstDay(),
					lockDateEnd: this.getDateTime(new Date()),
					awbNumber: '',
					coopName: '',
					customerName: '',
					voucherCreatorName: '',
					writeoffNumber: '',
					invoiceNumber: '',
					writeoffCreatorName: '',
					debitnoteNumber: '',
					expenseReportNum: '',
					expensesUse: '',
					expenseCreatorName: '',
					paymentMethod: '',
					expenseReportMode: '',
					type: '1',
					columnStrs: ''
				},
				voucher: {
					businessScope: 'AE',
					voucherDate: this.getDateTime(new Date()),
					voucherNumber: '1',
					voucherIsDetail: 0,
					checkedList: []
				},
				setVisible: false,
				voucherVisible: false,
				frow: {},
				loading: false,
				buttonLoading: false,
				showFlag: false,
				total: null,
				tableHeight: '550px'
			}
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		components: {
			'setVisibleTag': setVisibleVue
		},
		created() {
			//从数据库查询设置信息
			let pageName = '财务结算管理/凭证导出/' + this.query.activeName + (this.query.activeName == 'feeWriteoff' ? '' : '/' + this.query.businessScope)
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let css_voucher_export_column = response.data.data;
					if (css_voucher_export_column && css_voucher_export_column.length > 0) {
						this.tableColumns = this.sortBykey(css_voucher_export_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.cssVoucherExport, 'index');
					}
					this.setLabel(this.tableColumns)
				}.bind(this));
			this.init()
		},
		methods: {
			handleClick(tab, event) {
				this.data = []
				this.pageConf.pageCode = 1
				this.pageConf.pageSize = 10
				this.pageConf.totalPage = 0
				this.total = null
				let pageName = '财务结算管理/凭证导出/' + this.query.activeName + (this.query.activeName == 'feeWriteoff' ? '' : '/' + this.query.businessScope)
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then((response) => {
						let css_voucher_export_column = response.data.data;
						if (css_voucher_export_column && css_voucher_export_column.length > 0) {
							this.tableColumns = this.sortBykey(css_voucher_export_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.cssVoucherExport, 'index');
						}
						this.setLabel(this.tableColumns)
					})
			},
			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(columns.cssVoucherExport);
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
					localStorage.setItem(userId + '_css_voucher_export_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.frow.businessScope = this.query.businessScope
				this.frow.activeName = this.query.activeName
				this.setVisible = true;
			},
			formatter_column(row, column) {
				if (column.property === 'voucherCreatorName' || column.property === 'expenseCreatorName' || column.property === 'approvalFinancialUserName') {
					if (row[column.property]) {
						return row[column.property].split(' ')[0];
					} else {
						return "";
					}
				} else if (column.property == 'incomeFunctionalAmount' || column.property == 'costFunctionalAmount' || column.property == 'writeoffAmount' || column.property == 'expenseAmount') {
					if (row[column.property] || row[column.property] === 0) {
						return row[column.property + 'Str']
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
				return _year + "-" + _month + "-" + _date
			},
			getCurrMonthFirstDay() {
				let theDate = new Date()
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				return _year + "-" + _month + "-01"
			},
			setLabel(tableColumns) {
				let indexDelete = [];
				try {
					tableColumns.forEach((column, index) => {
						if (this.query.activeName == 'income') {
							if (column.prop == 'awbNumber' && (this.query.businessScope == 'TE' || this.query.businessScope == 'LC' || this.query.businessScope == 'IO')) {
								indexDelete.push(index)
							}
							if (column.prop == 'coopName') {
								column.label = '客户名称'
							}
							if (column.prop == 'customerName') {
								column.label = '收款客户'
							}
							if (column.prop == 'costFunctionalAmount' ||column.prop == 'writeoffNumber' || column.prop == 'writeoffDate' || column.prop == 'writeoffAmount' || column.prop == 'currency' || column.prop == 'invoiceDate' || column.prop == 'invoiceNumber' || column.prop == 'invoiceTitle' || column.prop == 'invoiceRemark' || column.prop == 'expenseReportStatus' || column.prop == 'expenseReportNum' || column.prop == 'expenseReportDate' || column.prop == 'expenseCreatorName' || column.prop == 'approvalFinancialUserName' || column.prop == 'expenseAmount' || column.prop == 'expensesUse' || column.prop == 'expenseReportRemark'|| column.prop == 'financialAccount'|| column.prop == 'bankFinancialAccount') {
								indexDelete.push(index)
							}
						}else if (this.query.activeName == 'cost') {
							if (column.prop == 'awbNumber' && (this.query.businessScope == 'TE' || this.query.businessScope == 'LC' || this.query.businessScope == 'IO')) {
								indexDelete.push(index)
							}
							if (column.prop == 'coopName') {
								column.label = '客户名称'
							}
							if (column.prop == 'customerName') {
								column.label = '供应商'
							}
							if (column.prop == 'incomeFunctionalAmount' ||column.prop == 'writeoffNumber' || column.prop == 'writeoffDate' || column.prop == 'writeoffAmount' || column.prop == 'currency' || column.prop == 'invoiceDate' || column.prop == 'invoiceNumber' || column.prop == 'invoiceTitle' || column.prop == 'invoiceRemark' || column.prop == 'expenseReportStatus' || column.prop == 'expenseReportNum' || column.prop == 'expenseReportDate' || column.prop == 'expenseCreatorName' || column.prop == 'approvalFinancialUserName' || column.prop == 'expenseAmount' || column.prop == 'expensesUse' || column.prop == 'expenseReportRemark'|| column.prop == 'financialAccount'|| column.prop == 'bankFinancialAccount') {
								indexDelete.push(index)
							}
						} else if (this.query.activeName == 'incomeWriteoff') {
							if (column.prop == 'coopName') {
								column.label = '收款客户'
							}
							if (column.prop == 'customerName'||column.prop == 'orderCode' || column.prop == 'awbNumber' || column.prop == 'customerNumber' || column.prop == 'coopCode' || column.prop == 'lockDate' || column.prop == 'incomeFunctionalAmount' || column.prop == 'costFunctionalAmount' || column.prop == 'expenseReportStatus' || column.prop == 'expenseReportNum' || column.prop == 'expenseReportDate' || column.prop == 'expenseCreatorName' || column.prop == 'approvalFinancialUserName' || column.prop == 'expenseAmount' || column.prop == 'expensesUse' || column.prop == 'expenseReportRemark'|| column.prop == 'financialAccount') {
								indexDelete.push(index)
							}
						} else if (this.query.activeName == 'costWriteoff') {
							if (column.prop == 'coopName') {
								column.label = '供应商'
							}
							if (column.prop == 'customerName'||column.prop == 'orderCode' || column.prop == 'awbNumber' || column.prop == 'customerNumber' || column.prop == 'coopCode' || column.prop == 'lockDate' || column.prop == 'incomeFunctionalAmount' || column.prop == 'costFunctionalAmount' || column.prop == 'expenseReportStatus' || column.prop == 'expenseReportNum' || column.prop == 'expenseReportDate' || column.prop == 'expenseCreatorName' || column.prop == 'approvalFinancialUserName' || column.prop == 'expenseAmount' || column.prop == 'expensesUse' || column.prop == 'expenseReportRemark'|| column.prop == 'financialAccount') {
								indexDelete.push(index)
							}
						} else if (this.query.activeName == 'feeWriteoff') {
							if (column.prop == 'customerName'||column.prop == 'writeoffNumber' || column.prop == 'writeoffDate' || column.prop == 'coopName' || column.prop == 'writeoffAmount' || column.prop == 'currency' || column.prop == 'invoiceDate' || column.prop == 'invoiceNumber' || column.prop == 'invoiceTitle' || column.prop == 'invoiceRemark' || column.prop == 'orderCode' || column.prop == 'awbNumber' || column.prop == 'customerNumber' || column.prop == 'coopCode' || column.prop == 'lockDate' || column.prop == 'incomeFunctionalAmount' || column.prop == 'costFunctionalAmount') {
								indexDelete.push(index)
							}
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
			showVoucherGenerate() {
				if (this.voucher.checkedList.length == 0) {
					this.openError("请选择再操作")
					return
				}
				let voucherNumberList = this.voucher.checkedList.map(row => row.voucherNumber)
				if (voucherNumberList.every(val => val != null && val !== '')) {
					if (Array.from(new Set(voucherNumberList)).length != 1) {
						this.openError("选择项凭证号不一致")
						return
					}
				} else if (voucherNumberList.some(val => val == null || val === '') && voucherNumberList.some(val => val != null && val !== '')) {
					this.openError('选择项凭证号不一致')
					return
				}
				this.voucher.voucherDate = this.getDateTime(new Date())
				this.voucher.voucherIsDetail = 0
				this.$axios.get('/afbase/cssVoucherExport/getMaxVoucherNumber/'+this.getDateTime(new Date()).substr(0,7)).then((response) => {
					if (response.data.code == 0&&response.data.data) {
						this.voucher.voucherNumber = response.data.data
					} else {
						this.voucher.voucherNumber = '1'
					}
					this.voucherVisible = true
				}).catch((error) => {
					this.voucher.voucherNumber = '1'
					this.voucherVisible = true
				})
			},
			voucherCallback() {
				if (this.voucher.checkedList.length == 0) {
					this.openError("请选择再操作")
					return
				}
				if (this.voucher.checkedList.some(row => row.voucherDate == null)) {
					this.openError('只能回退已生成凭证的数据')
					return
				}
				this.$confirm('确定要回退凭证么？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.voucher.businessScope = this.query.businessScope
					this.voucher.type = this.query.type
					this.$axios.post2('/afbase/cssVoucherExport/voucherCallback', this.voucher).then((response) => {
						if (response.data.code == 0) {
							this.openSuccess()
							this.findByPage()
						} else {
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
					})
				}).catch(() => {});
			},
			closeVoucher() {
				this.voucherVisible = false
			},
			confirmVoucher() {
				this.buttonLoading = true
				if (this.voucher.voucherNumber) {
					let regx = /^([1-9][0-9]*)$/g
					if (!regx.test(this.voucher.voucherNumber)) {
						this.openError('凭证号格式有误')
						this.buttonLoading = false
						return
					}
				} else {
					this.openError('请录入凭证号')
					this.buttonLoading = false
					return
				}
				if (!this.voucher.voucherDate) {
					this.openError('请录入凭证日期')
					this.buttonLoading = false
					return
				}

				this.voucher.businessScope = this.query.businessScope
				this.voucher.type = this.query.type
				this.$axios.postRequestJSONResponseBlob('/afbase/cssVoucherExport/voucherGenerate', this.voucher).then((response) => {
					this.buttonLoading = false
					this.openSuccess()
					this.findByPage()
					this.closeVoucher()
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '凭证生成表' + '.xlsx'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
				}).catch((error) => {
					this.buttonLoading = false
					var reader = new FileReader();
					reader.onload = (event) => {
						var content = reader.result; //内容就在这里
						this.openError(JSON.parse(content).messageInfo)
					};
					reader.readAsText(error.response.data);
				})
			},
			findByPage() {
				this.query.columnStrs = ''
				if (this.query.activeName == 'income') {
					this.query.type = 0
				}else if (this.query.activeName == 'cost') {
					this.query.type = 1
				} else if (this.query.activeName == 'incomeWriteoff') {
					this.query.type = 2
				} else if (this.query.activeName == 'costWriteoff') {
					this.query.type = 3
				} else if (this.query.activeName == 'feeWriteoff') {
					this.query.type = 4
				}
				this.setHeight()
				//从数据库查询设置信息
				let pageName = '财务结算管理/凭证导出/' + this.query.activeName + (this.query.activeName == 'feeWriteoff' ? '' : '/' + this.query.businessScope)
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let css_voucher_export_column = response.data.data;
						if (css_voucher_export_column && css_voucher_export_column.length > 0) {
							this.tableColumns = this.sortBykey(css_voucher_export_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.cssVoucherExport, 'index');
						}
						this.setLabel(this.tableColumns)
						this.loading = true
						this.$axios.get2("/afbase/cssVoucherExport?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode,
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
						this.$axios.get2("/afbase/cssVoucherExport/total", this.query)
							.then((response) => {
								this.total = response.data.data;
								this.getSummaries();
							});
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/cssVoucherExport?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
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
					let excelList = this.sortBykey(columns.cssVoucherExport, 'index');
					this.setLabel(excelList)
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				this.$axios.post3('/afbase/cssVoucherExport/exportExcel', this.query)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '凭证导出' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});

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
							if (this.query.activeName == 'income') {
								if (loaclJsonArray[i].prop === "incomeFunctionalAmount") {
									sums[i + 1] = this.total.incomeFunctionalAmountStr
								}
							}else if (this.query.activeName == 'cost') {
								if (loaclJsonArray[i].prop === "costFunctionalAmount") {
									sums[i + 1] = this.total.costFunctionalAmountStr
								}
							} else if (this.query.activeName == 'incomeWriteoff') {
								if (loaclJsonArray[i].prop === "writeoffAmount") {
									let el = < div / >
										el.children = []
									sums[i + 1] = (() => {
										this.total.writeoffAmountStr.split('  ').forEach(item => {
											if (item.indexOf('CNY') > -1) {
												let p = < p / >
													p.text = item
												el.children.push(p)
											} else {
												let p = < p style = "color:red;" / >
													p.text = item
												el.children.push(p)
											}
										})
										return el
									})()
								}
							} else if (this.query.activeName == 'costWriteoff') {
								if (loaclJsonArray[i].prop === "writeoffAmount") {
									let el = < div / >
										el.children = []
									sums[i + 1] = (() => {
										this.total.writeoffAmountStr.split('  ').forEach(item => {
											if (item.indexOf('CNY') > -1) {
												let p = < p / >
													p.text = item
												el.children.push(p)
											} else {
												let p = < p style = "color:red;" / >
													p.text = item
												el.children.push(p)
											}
										})
										return el
									})()
								}
							} else if (this.query.activeName == 'feeWriteoff') {
								if (loaclJsonArray[i].prop === "expenseAmount") {
									sums[i + 1] = this.total.expenseAmountStr
								}
							}
						}
					}
				}
				return sums;
			},
			setHeight() {
				this.$nextTick(() => {
					let css_voucher_export_header = this.$refs['css_voucher_export_header' + this.query.type].offsetHeight;
					let css_voucher_export_footer = this.$refs['css_voucher_export_footer' + this.query.type].offsetHeight;
					let heightS = window.innerHeight - 150 - css_voucher_export_header - css_voucher_export_footer;
					this.tableHeight = heightS + "px";
				});
			},
			handleSelectionChange(val) {
				this.voucher.checkedList = val;
			},
			addCellStyle(data) {
				let k = '';
				if (data.row.currency != 'CNY' && (data.column.property === "currency" || data.column.property === "writeoffAmount")) {
					k = "color:red;"
				}
				return k;
			},
			sortVoucherNumber(a, b) {
				if (a.voucherNumber == null) {
					return -1
				}
				return parseInt(a.voucherNumber) - parseInt(b.voucherNumber)
			},
			init() {
				//查询业务范畴
				this.$axios.get2('/afbase/category/paramsNew', {
					categoryName: "业务范畴"
				}).then(function(response) {
					this.businessScopes = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				})
			}
		}
	};
</script>
<style type="text/css">
	.cssVoucherExport .el-input__icon {
		line-height: 30px !important;
	}

	.cssVoucherExport .el-form-item__content {
		line-height: 30px !important;
	}

	.cssVoucherExportDialog .el-input__icon {
		line-height: 30px !important;
	}

	.cssVoucherExportDialog .el-form-item__content {
		line-height: 30px !important;
	}

	.cssVoucherExport .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
