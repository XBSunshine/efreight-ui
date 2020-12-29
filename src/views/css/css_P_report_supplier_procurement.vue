<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="css_p_report_supplier_procurement">
			<div ref="supplier_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:160px;">
								<template slot="prepend">
									<font style="color: red;">*</font>业务范畴
								</template>
								<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:87px;margin-right: -5px;" @change="businessScopeChange">
									<el-option v-for="item in businessCodes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">
									<font style="color: red;">*</font>统计周期
								</template>
								<el-date-picker slot="suffix" v-model="query.statisticalPeriodStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="起" style="width: 136px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.statisticalPeriodEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="止" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<!-- <el-col class="elementWidth" v-if="busFlag">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">服务产品</template>
								<el-select slot="suffix" v-model="query.businessProduct" filterable placeholder="请选择" clearable style="width: 111px;margin-right: -5px">
									<el-option v-for="item in businessProducts" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col> -->
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:230px;">
								<template slot="prepend">
									供应商类型
								</template>
								<el-select slot="suffix" v-model="query.supplierType" placeholder="请选择" clearable style="width: 147px;margin-right: -5px">
									<el-option v-for="item in coopTypeOptions" :key="item.code" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope.startsWith('S')||query.businessScope.startsWith('T')">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">
									<font style="color: red;">*</font>装箱方式
								</template>
								<el-select slot="suffix" v-model="query.containerMethod" placeholder="请选择" style="width: 106px;margin-right: -5px">
									<el-option v-for="item in containerMethods" :key="item.paramText" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:160px;">
								<template slot="prepend">&nbsp;财务锁账</template>
								<el-select slot="suffix" v-model="query.isLock" placeholder="请选择" clearable style="width: 87px;margin-right: -5px">
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">
									<font style="color: red;">*</font>统计口径
								</template>
								<el-select slot="suffix" v-model="query.statisticalPeriodType" style="width: 106px;margin-right: -5px">
									<el-option v-if="query.businessScope=='AE'||query.businessScope=='SE'" label="开航日期" value="开航日期"></el-option>
									<el-option v-if="query.businessScope=='AI'||query.businessScope=='SI'" label="到港日期" value="到港日期"></el-option>
									<el-option v-if="query.businessScope=='TE'" label="发车日期" value="发车日期"></el-option>
									<el-option v-if="query.businessScope=='LC'" label="用车日期" value="用车日期"></el-option>
									<el-option v-if="query.businessScope=='IO'" label="业务日期" value="业务日期"></el-option>
									<el-option label="财务日期" value="财务日期"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:189px;">
								<template slot="prepend">货物类型</template>
								<el-select slot="suffix" v-model="query.goodsType" placeholder="请选择" clearable style="width: 120px;margin-right: -5px">
									<el-option v-if="!goodsTypeFlag" v-for="item in goodsTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
									<el-option v-if="goodsTypeFlag" v-for="item in goodsTypes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="20px">
							<el-checkbox v-model="query.isAll">全部客户</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item :label-width="setingMarginLeft">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" :data="data" border ref="table" stripe class="table_settle" highlight-current-row :cell-style="addCellStayle" @header-dragend="cellWidth" :max-height="tableH">
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.prop=='orderCount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClickOrderCount(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.prop=='orderCode'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClickOrderCode(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.prop=='coopCode'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClickCustomer(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
				<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
				</el-table-column>
			</template>
		</el-table>

		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
		<viewVisibleTagList ref="addMission" v-if="showListView" :visible.sync="showListView" :frow="frow"></viewVisibleTagList>
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
	import setVisibleVue from './cssPReportSupplierProcurement/css_p_report_supplier_procurement_setting.vue'
	import columns from './cssPReportSupplierProcurement/css_p_report_supplier_procurement.json'
	import viewVisibleVueAE from '../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '../sc/si/order/main/order_view.vue'
	import viewVisibleVueTE from '../tc/te/order/main/order_view.vue'
	import viewVisibleVueLC from '../lc/order/main/order_view.vue'
	import viewVisibleVueIO from '../io/order/main/order_view.vue'
	import showListVueView from './cssPReportSupplierProcurement/css_p_report_supplier_procurement_detail.vue'
	export default {
		data() {
			return {
				tableH: "750px",
				setingMarginLeft: '156px',
				businessCodes: [],
				/*表数据*/
				data: [],
				goodsTypeFlag: false,
				showListView: false,
				containerMethodFlag: true,
				tableColumns: [],
				multipleSelection: [],
				containerMethods: [],
				coopTypeOptions: [],
				// businessProducts: [],
				goodsTypes: [],
				query: {
					businessScope: 'AE',
					supplierType: '',
					statisticalPeriodStart:this.getDate('currYear1-1'),
					statisticalPeriodEnd: this.getDate('now'),
					// businessProduct: '',
					containerMethod: '整箱',
					statisticalPeriodType: '开航日期',
					isLock: '',
					goodsType: '',
					isAll: true,
					columnStrs: ''
				},
				setVisible: false,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				frow: {},
				loading: false,
				showFlag: false,
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
			'viewVisibleTagIO': viewVisibleVueIO,
			'viewVisibleTagList': showListVueView
		},
		methods: {
			sortOrderCountPer(a, b) {
				return parseFloat(a.order_count_per) - parseFloat(b.order_count_per)
			},
			sortPlanChargeWeightCountPer(a, b) {
				return parseFloat(a.plan_charge_weight_count_per) - parseFloat(b.plan_charge_weight_count_per)
			},
			sortIncomeFunctionalAmountCountPer(a, b) {
				return parseFloat(a.income_functional_amount_count_per) - parseFloat(b.income_functional_amount_count_per)
			},
			sortGrossProfitCountPer(a, b) {
				return parseFloat(a.gross_profit_count_per) - parseFloat(b.gross_profit_count_per)
			},
			sortGrossProfitMargin(a, b) {
				return parseFloat(a.gross_profit_margin) - parseFloat(b.gross_profit_margin)
			},
			getDate(type) {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _day = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month
				}
				if (_day < 10) {
					_day = "0" + _day
				}
				if (type == 'now') {
					return _year + "-" + _month + "-" + _day
				} else if (type == 'currYear1-1') {
					return _year + "-01-01"
				} else if (type == 'currMonth1-1') {
					return _year + "-" + _month + "-01"
				}
			},
			businessScopeChange() {
				if (this.query.statisticalPeriodType != '财务日期') {
					if (this.query.businessScope == 'AE' || this.query.businessScope == 'SE') {
						this.query.statisticalPeriodType = '开航日期'
					}
					if (this.query.businessScope == 'AI' || this.query.businessScope == 'SI') {
						this.query.statisticalPeriodType = '到港日期'
					}
					if (this.query.businessScope == 'TE') {
						this.query.statisticalPeriodType = '发车日期'
					}
					if (this.query.businessScope == 'LC') {
						this.query.statisticalPeriodType = '用车日期'
					}
					if (this.query.businessScope == 'IO') {
						this.query.statisticalPeriodType = '业务日期'
					}
				}
				if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T')) {
					this.setingMarginLeft = '346px'
				} else {
					this.setingMarginLeft = '156px'
				}

				if (this.query.businessScope.startsWith('A')) {
					//货物类型
					this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					}.bind(this));
					this.goodsTypeFlag = false;
				}
				if (this.query.businessScope.startsWith('S')) {
					this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					this.goodsTypeFlag = true;
				}
				if (this.query.businessScope.startsWith('L')) {
					this.$axios.get('/sc/vLcCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					this.goodsTypeFlag = true;
				}
				if (this.query.businessScope=='IO') {
					this.$axios.get('/sc/vIoCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					this.goodsTypeFlag = true;
				}
				if (this.query.businessScope.startsWith('T')) {
					this.$axios.get('/sc/tcCategory/装箱方式').then((response) => {
						this.containerMethods = response.data.data;
					})
					this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					this.goodsTypeFlag = true;
				}

			},

			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(columns.supplier);
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
					localStorage.setItem(userId + '_customer_contribution_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.frow.businessScope = this.query.businessScope;
				this.frow.containerMethod = this.query.containerMethod;
				this.setVisible = true;
			},
			addCellStayle(data) {
				let k = '';
				if (data.column.property === "coopName" && data.row.orderCount == 0) {
					k = "color:red;"
				}
				return k;
			},
			formatter_ratio(row) {
				if (row.order_count_per) {
					return row.order_count_per + '%';
				} else {
					return '';
				}
			},
			formatter_column(row, column) {
				if (column.property == 'orderCount' || column.property == 'chargeWeight' || column.property == 'costFunctionalAmount' || column.property == 'unitCostFunctionalAmount' || column.property == 'yearOrderCount' || column.property == 'yearChargeWeight'||column.property == 'yearCostFunctionalAmount') {
					if (row[column.property]||row[column.property]===0) {
						return (row[column.property]+'').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
					} else {
						return '';
					}
				} else if(column.property == 'orderCountRatio'||column.property == 'chargeWeightRatio'||column.property == 'costFunctionalAmountRatio'){
					if (row[column.property]||row[column.property]===0) {
						return row[column.property]+'%'
					} else {
						return '';
					}
				}else{
					return row[column.property]
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
				try {
					let count = 0
					tableColumns.forEach((column, index) => {
						if (column.prop == 'chargeWeight') {
							if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T')) {
								if (this.query.containerMethod != '整箱') {
									column.label = '计费吨';
								} else {
									column.label = '箱量';
								}
							} else {
								column.label = '计重';
							}
						}
						if (column.prop == 'chargeWeightRatio') {
							if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T')) {
								if (this.query.containerMethod != '整箱') {
									column.label = '计费吨占比';
								} else {
									column.label = '箱量占比';
								}
							} else {
								column.label = '计重占比';
							}
						}
					})
				} catch (e) {}
			},
			handleChange(command) {
				this.frow = command
			},
			handleCommand(command) {},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let supplier_header = this.$refs.supplier_header.offsetHeight;
					let heightS = window.innerHeight - 92 - supplier_header;
					this.tableH = heightS + "px";
				});
			},

			findByPage() {
				if (!this.query.statisticalPeriodStart || !this.query.statisticalPeriodStart) {
					this.openError("统计周期起止时间不能为空");
					return
				}
				this.setHeight();
				//从数据库查询设置信息
				this.query.columnStrs = ''
				let pageName = '报表统计分析/供应商采购分析';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let af_list_column = response.data.data;
						if (af_list_column && af_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.supplier, 'index');
						}
						this.setLabel(this.tableColumns)
						this.loading = true
						this.$axios.get2('/afbase/cssPReportSupplierProcurement', this.query)
							.then((response) => {
								if (response.data.code == 0) {
									this.data = response.data.data;
									this.loading = false
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
					let excelList = this.sortBykey(columns.supplier, 'index');
					this.setLabel(excelList)
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				this.$axios.post3('/afbase/cssPReportSupplierProcurement/exportExcel', this.query)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '供应商采购分析' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});
				this.query.columnStrs = "";
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
			formatQWF(data) {
				return data.toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			cellClickOrderCount(row) {
				this.frow = this.query;
				this.frow.supplierId = row.coopId;
				this.showListView = true
			},
			cellClickCustomer(row) {
				this.frow = this.query
				this.frow.coopName = row.coopName
				this.jumpToNewPage('supplier_procurement', this.frow, '/customer_info')
			},
			cellClickOrderCode(row) {
				let a = {
					orderCode: row.orderCode
				}
				if (this.query.businessScope == 'SE') {
					this.$axios.get2("/sc/scOrder/se?size=" + 10 + "&current=" + 1, a)
						.then(function(response) {
							row.orderUuid = response.data.data.records[0].orderUuid;
							row.orderId = response.data.data.records[0].orderId;
							this.showView(row)
						}.bind(this));
				}
				if (this.query.businessScope == 'SI') {
					this.$axios.get2("/sc/scOrder/si?size=" + 10 + "&current=" + 1, a)
						.then(function(response) {
							row.orderUuid = response.data.data.records[0].orderUuid;
							row.orderId = response.data.data.records[0].orderId;
							this.showView(row)
						}.bind(this));
				}
				if (this.query.businessScope == 'TE') {
					this.$axios.get2("/sc/tcOrder/te/page?size=" + 10 + "&current=" + 1, a)
						.then(function(response) {
							row.orderUuid = response.data.data.records[0].orderUuid;
							row.orderId = response.data.data.records[0].orderId;
							this.showView(row)
						}.bind(this));
				}
				if (this.query.businessScope == 'LC') {
					this.$axios.get2("/sc/lcOrder?size=" + 10 + "&current=" + 1, a)
						.then(function(response) {
							row.orderUuid = response.data.data.records[0].orderUuid;
							row.orderId = response.data.data.records[0].orderId;
							this.showView(row)
						}.bind(this));
				}
				if (this.query.businessScope == 'IO') {
					this.$axios.get2("/sc/ioOrder?size=" + 10 + "&current=" + 1, a)
						.then(function(response) {
							row.orderUuid = response.data.data.records[0].orderUuid;
							row.orderId = response.data.data.records[0].orderId;
							this.showView(row)
						}.bind(this));
				}
				if (this.query.businessScope.startsWith('A')) {
					this.$axios.get2("/afbase/aforder/page?size=" + 10 + "&current=" + 1, a)
						.then(function(response) {
							row.orderUuid = response.data.data.records[0].orderUuid;
							row.orderId = response.data.data.records[0].orderId;
							this.showView(row)
						}.bind(this));
				}


			},
			showView(row) {
				this.frow = row;
				this.frow.orderUuid = row.orderUuid;
				this.frow.orderId = row.orderId;
				this.frow.viewFlag = false;
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
			base64Decode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/="
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
				//服务产品
				// this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
				// 	this.businessProducts = response.data.data;
				// }.bind(this));
				//装箱方式
				this.$axios.get('/sc/vScCategory/装箱方式').then((response) => {
					this.containerMethods = response.data.data;
				})
				//客商资料类型
				this.$axios.get('/afbase/awb/selectVCategory?category=合作伙伴分类').then(function(response) {
					this.coopTypeOptions = response.data.data;
				}.bind(this))

				this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
					this.goodsTypes = response.data.data;
					this.goodsType = '';
				}.bind(this));
				this.goodsTypeFlag = false;
			}

		},
		created() {
      let a = this.$route.query.o;
      if(a){
        let b = JSON.parse(this.base64Decode(a));
        if(b.orderStatus&&b.orderStatus=='财务锁账'){
          this.query.orderStatus = '是';
        }
        if(b.orderStatus&&b.orderStatus=='未锁账'){
          this.query.orderStatus = '否';
        }
        // this.query.orderStatus=b.orderStatus;
        this.query.businessProduct=b.businessProduct;
        // if(b.containerMethod){
        //   this.query.containerMethod=b.containerMethod;
        // }
        this.query.statisticalPeriodType=b.countType;
        this.query.businessScope=b.businessScope;
        this.query.statisticalPeriodStart=b.startDate;
        this.query.statisticalPeriodEnd=b.endDate
        this.businessScopeChange();
      }
			//从数据库查询设置信息
			let pageName = '报表统计分析/供应商采购分析';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						this.tableColumns = this.sortBykey(af_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.supplier, 'index');
					}
					this.setLabel(this.tableColumns)
				}.bind(this));
			this.init()
		},
		mounted() {
			this.setHeight();
		}
	}
</script>
<style type="text/css">
	.css_p_report_supplier_procurement .el-input__icon {
		line-height: 30px !important;
	}

	.css_p_report_supplier_procurement .el-form-item__content {
		line-height: 30px !important;
	}

	.css_p_report_supplier_procurement .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
