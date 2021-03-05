<template>



	<el-dialog title="订单明细" width="1300px" higeht="300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<!-- @cell-click="handlerCellClick" -->
		<el-checkbox style="float: right;margin-right: 5px;margin-bottom: 5px;" @change="setConstituteFlag" v-model="query.showConstituteFlag">显示毛利构成</el-checkbox>
		<el-button style="float: left;margin-left: 5px;margin-bottom: 5px;" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
		<el-button style="float: left;margin-left: 5px;margin-bottom: 5px;" type="primary" size="small" v-on:click="setColumn">设置</el-button>
		<el-table border v-loading="loading" :data="data" stripe @header-dragend="cellWidth">
			<el-table-column align="center" label="序号" width="60">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.prop=='orderCode'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a v-if="!otherOrgFlag" href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					  <span v-if="otherOrgFlag">{{scope.row[item.prop]}}</span>
          </template>
				</el-table-column>
				<el-table-column v-else :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="formatter"></el-table-column>
			</template>

			<el-table-column align="center" label="毛利构成" width="100" v-if="constituteFlag">
				<el-table-column header-align="center" align="right" label="干线收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.mainRoutingIncome)" style="color: red;">{{scope.row.mainRoutingIncome}}</span>
						<span v-else>{{scope.row.mainRoutingIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="干线成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.mainRoutingCost)" style="color: red;">{{scope.row.mainRoutingCost}}</span>
						<span v-else>{{scope.row.mainRoutingCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="干线毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.mainRouting)" style="color: red;">{{scope.row.mainRouting}}</span>
						<span v-else>{{scope.row.mainRouting}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="支线收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.feederIncome)" style="color: red;">{{scope.row.feederIncome}}</span>
						<span v-else>{{scope.row.feederIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="支线成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.feederCost)" style="color: red;">{{scope.row.feederCost}}</span>
						<span v-else>{{scope.row.feederCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="支线毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.feeder)" style="color: red;">{{scope.row.feeder}}</span>
						<span v-else>{{scope.row.feeder}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="操作收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.operationIncome)" style="color: red;">{{scope.row.operationIncome}}</span>
						<span v-else>{{scope.row.operationIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="操作成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.operationCost)" style="color: red;">{{scope.row.operationCost}}</span>
						<span v-else>{{scope.row.operationCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="操作毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.operation)" style="color: red;">{{scope.row.operation}}</span>
						<span v-else>{{scope.row.operation}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="包装收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.packagingIncome)" style="color: red;">{{scope.row.packagingIncome}}</span>
						<span v-else>{{scope.row.packagingIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="包装成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.packagingCost)" style="color: red;">{{scope.row.packagingCost}}</span>
						<span v-else>{{scope.row.packagingCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="包装毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.packaging)" style="color: red;">{{scope.row.packaging}}</span>
						<span v-else>{{scope.row.packaging}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="仓储收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.storageIncome)" style="color: red;">{{scope.row.storageIncome}}</span>
						<span v-else>{{scope.row.storageIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="仓储成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.storageCost)" style="color: red;">{{scope.row.storageCost}}</span>
						<span v-else>{{scope.row.storageCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="仓储毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.storage)" style="color: red;">{{scope.row.storage}}</span>
						<span v-else>{{scope.row.storage}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="快递收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.postageIncome)" style="color: red;">{{scope.row.postageIncome}}</span>
						<span v-else>{{scope.row.postageIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="快递成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.postageCost)" style="color: red;">{{scope.row.postageCost}}</span>
						<span v-else>{{scope.row.postageCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="快递毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.postage)" style="color: red;">{{scope.row.postage}}</span>
						<span v-else>{{scope.row.postage}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="关检收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.clearanceIncome)" style="color: red;">{{scope.row.clearanceIncome}}</span>
						<span v-else>{{scope.row.clearanceIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="关检成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.clearanceCost)" style="color: red;">{{scope.row.clearanceCost}}</span>
						<span v-else>{{scope.row.clearanceCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="关检毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.clearance)" style="color: red;">{{scope.row.clearance}}</span>
						<span v-else>{{scope.row.clearance}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="数据收入" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.exchangeIncome)" style="color: red;">{{scope.row.exchangeIncome}}</span>
						<span v-else>{{scope.row.exchangeIncome}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" label="数据成本" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.exchangeCost)" style="color: red;">{{scope.row.exchangeCost}}</span>
						<span v-else>{{scope.row.exchangeCost}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" prop="exchange" label="数据毛利" width="100">
					<template slot-scope="scope">
						<span v-if="checkdata(scope.row.exchange)" style="color: red;">{{scope.row.exchange}}</span>
						<span v-else>{{scope.row.exchange}}</span>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="ffrow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="ffrow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="ffrow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="ffrow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="ffrow"></viewVisibleTagTE>
    <viewVisibleTagTI ref="addMission" v-if="viewVisibleTI" :visible.sync="viewVisibleTI" :frow="ffrow"></viewVisibleTagTI>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="ffrow"></viewVisibleTagLC>
		<viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="ffrow"></viewVisibleTagIO>
		<setColumnTag ref="addMission" v-if="setColumnFlag" :visible.sync="setColumnFlag" :frow="ffrow"></setColumnTag>
	</el-dialog>

</template>
<script>
	import viewVisibleVueAE from '../../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../../sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '../../sc/si/order/main/order_view.vue'
	import viewVisibleVueTE from '../../tc/te/order/main/order_view.vue'
  import viewVisibleVueTI from '../../tc/ti/order/main/order_view.vue'
	import viewVisibleVueLC from '../../lc/order/main/order_view.vue'
	import viewVisibleVueIO from '../../io/order/main/order_view.vue'
	import setColumnVue from './css_p_report_supplier_procurement_detail_setting.vue'
	import columns from './css_p_report_supplier_procurement_detail.json'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			return {
				/*表数据*/
				data: [],
				column: [],
				tableColumns: [],
        otherOrgFlag:false,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
        viewVisibleTI: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				containerMethodFlag: 1,
				constituteFlag: true,
				setColumnFlag: false,
				flagAE: false,
				flagAI: false,
				flagSE: false,
				flagSI: false,
				ffrow: {},
				editTab: '',
				customerType: '0',
				businessCodes: [],
				loading: false,
				showFlag: false,
				dateFlag: false,
				query: {
					showConstituteFlag: true,
					columnStrs: ''
				}
			}


		},
		components: {
			'viewVisibleTagAE': viewVisibleVueAE,
			'viewVisibleTagAI': viewVisibleVueAI,
			'viewVisibleTagSE': viewVisibleVueSE,
			'viewVisibleTagSI': viewVisibleVueSI,
			'viewVisibleTagTE': viewVisibleVueTE,
      'viewVisibleTagTI': viewVisibleVueTI,
			'viewVisibleTagLC': viewVisibleVueLC,
			'viewVisibleTagIO': viewVisibleVueIO,
			'setColumnTag': setColumnVue
		},
		provide() {
			return {
				findByPage: this.findByPage,
				querCach: this.querCach
			}
		},
		created() {
      if(this.frow.otherOrg){
         this.otherOrgFlag = true;
      }
			this.querCach();
		},
		methods: {
			querCach() {
				let pageName = '报表统计分析/供应商采购分析/详情/' + this.frow.businessScope;
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName).then(function(response) {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						this.tableColumns = this.sortBykey(af_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.supplierDetail, 'index');
					}
					this.setLabel(this.tableColumns)
					this.queryInfo();
				}.bind(this));
			},
			queryInfo() {
				this.loading = true
				this.$axios.get2('/afbase/cssPReportSupplierProcurement/detail', this.frow).then(function(response) {
					this.data = response.data.data;
					this.loading = false
				}.bind(this)).catch(function(error) {
					this.loading = false
				})
			},
			setConstituteFlag() {
				if (this.query.showConstituteFlag == true) {
					this.constituteFlag = true;
				} else {
					this.constituteFlag = false;
				}
			},
			setColumn() {
				this.ffrow.businessScope = this.frow.businessScope;
				this.ffrow.containerMethod = this.frow.containerMethod;
				this.setColumnFlag = true;
			},
			exportExcel() {
				if (this.data.length == 0) {
					this.openError("列表为空，不允许导出")
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
					let excelList = this.sortBykey(columns.supplierDetail, 'index');
					this.setLabel(excelList);
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				let param = this.frow;
				param.columnStrs = this.query.columnStrs;
				param.showConstituteFlag = this.query.showConstituteFlag;
				this.$axios.post3('/afbase/cssPReportSupplierProcurement/exportExcelDetail', param)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '供应商采购分析明细' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});
				this.query.columnStrs = ""
				this.frow.columnStrs = ""
			},
			sortBykey(ary, key) {
				return JSON.parse(JSON.stringify(ary)).sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(columns.supplierDetail);
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
					localStorage.setItem(userId + '_supplier_procurement_detail_column_width', JSON.stringify(arrayC))
				}
			},
			checkdata(str) {
				if (!str) {
					return false;
				}
				if (str.indexOf('-') > -1) {
					return true;
				} else {
					return false;
				}
				// return false;
			},
			setLabel(tableColumns) {
				let indexDelete = [];
				try {
					tableColumns.forEach((column, index) => {
						if (column.prop == 'awbNumber' && (this.frow.businessScope == 'LC' || this.frow.businessScope == 'IO')) {
							indexDelete.push(index)
						}
						if (column.prop == 'arrivalStation') {
							if (this.frow.businessScope == 'IO') {
								column.label = '目的地'
							} else {
								column.label = '目的港'
							}
						}
						if (column.prop == 'departureStation') {
							if (this.frow.businessScope == 'IO') {
								column.label = '起运地'
							} else {
								column.label = '始发港'
							}
						}
						//服务产品
						if (column.prop == 'businessProduct') {
							if (this.frow.businessScope == 'AE') {
								column.label = '服务产品'
							} else if (this.frow.businessScope.startsWith('S') || this.frow.businessScope.startsWith('T')) {
								column.label = '装箱方式'
							} else if (this.frow.businessScope == 'LC') {
								column.label = '运输方式'
							} else if (this.frow.businessScope == 'IO') {
								column.label = '业务分类'
							} else if (this.frow.businessScope == 'AI') {
								indexDelete.push(index)
							}
						}
						//航班号
						if (column.prop == 'flightNo') {
							if (this.frow.businessScope.startsWith('A')) {
								column.label = "航班号"
							} else if (this.frow.businessScope.startsWith('S')) {
								column.label = "船次号"
							} else {
								indexDelete.push(index)
							}
						}
						//航班日期
						if (column.prop == 'flightDate') {
							if (this.frow.businessScope == 'AE' || this.frow.businessScope == 'SE') {
								column.label = "开航日期"
							} else if (this.frow.businessScope == 'AI' || this.frow.businessScope == 'SI') {
								column.label = "到港日期"
							} else if (this.frow.businessScope == 'TE') {
								column.label = "发车日期"
							} else if (this.frow.businessScope == 'TI') {
                column.label = "到达日期"
              } else if (this.frow.businessScope == 'LC') {
								column.label = "用车日期"
							} else if (this.frow.businessScope == 'IO') {
								column.label = "业务日期"
							}
						}
						//运单来源
						if (column.prop == 'awbFrom') {
							if (this.frow.businessScope == 'AE') {
								column.label = "运单来源"
							} else if (this.frow.businessScope == 'TE' || this.frow.businessScope == 'TI' || this.frow.businessScope == 'SE') {
								column.label = "订舱代理"
							} else {
								indexDelete.push(index)
							}
						}
						//航线
						if (column.prop == 'routingName') {
							if (this.frow.businessScope == "TE" || this.frow.businessScope == 'TI' || this.frow.businessScope == "LC" || this.frow.businessScope == "IO") {
								indexDelete.push(index)
							}
						}
						//货源地
						if (column.prop == 'goodsSourceCode') {
							if (this.frow.businessScope != "AE") {
								indexDelete.push(index)
							}
						}
						//货物类型
						if (column.prop == 'goodsType') {
							if (!(this.frow.businessScope.startsWith('S') || this.frow.businessScope == 'TE' || this.frow.businessScope == 'TI')) {
								indexDelete.push(index)
							}
						}

						//计重
						if (column.prop == 'chargeWeight') {
							if (this.frow.businessScope.startsWith('A') || this.frow.businessScope == 'LC' || this.frow.businessScope == 'IO') {
								column.label = "计重"
							} else {
								if (this.frow.containerMethod == '整箱') {
									column.label = "箱量"
								} else {
									column.label = "计费吨"
								}

							}
						}
					});
					if (indexDelete.length > 0) {
						indexDelete.sort(function(a, b) {
							return a - b;
						});
						for (let i = 0; i < indexDelete.length; i++) {
							this.$delete(tableColumns, indexDelete[i] - i);
						}
					}
				} catch (e) {}
			},
			formatter(row, column) {
				if (column.property == 'grossProfitRatio') {
					if (!row.grossProfitRatio || row.grossProfit == 0) {
						return "0.00%";
					} else {
						return row.grossProfitRatio + '%';
					}
				} else if (column.property == 'unitGrossProfit') {
					if (row.chargeWeight == 0 || row.unitGrossProfit == 0) {
						return '0.0';
					} else {
						return row.unitGrossProfit;
					}
				} else if (column.property == 'unitCostAmount') {
					if (row.chargeWeight == 0 || row.unitCostAmount == 0) {
						return '0.0';
					} else {
						return row.unitCostAmount;
					}
				} else if (column.label == '责任销售' || column.label == '责任客服') {
					if (row[column.property]) {
						return row[column.property].split(' ')[0]
					} else {
						return ''
					}
				} else if (column.property == 'incomeFunctionalAmount' || column.property == 'costFunctionalAmount' || column.property == 'grossProfit' || column.property == 'functionalAmountWriteoff' || column.property == 'functionalAmountNoWriteoff') {
					if (row[column.property] || row[column.property] === 0) {
						return row[column.property].toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
					} else {
						return ''
					}
				} else {
					return row[column.property]
				}
			},
			findByPage() {

			},
			cellClick(row) {
				this.showView(row);
			},
			showView(row) {
				this.ffrow = row;
				this.ffrow.orderUuid = row.orderUuid;
				this.ffrow.orderId = row.orderId;
				this.ffrow.orderCode = row.orderCode;
				this.ffrow.viewFlag = false;
				if (row.businessScope === 'AE') {
					this.$axios.get('/afbase/aforder/view/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "editTab";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('edit', this.ffrow, '/af_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleAE = true;
							}
						})
				}
				if (row.businessScope === 'AI') {
					this.$axios.get('/afbase/aforder/view/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "editTab";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('edit', this.ffrow, '/ai_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleAI = true;
							}
						})
				}
				if (row.businessScope === 'SE') {
					this.$axios.get('/sc/scOrder/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "first";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('view', this.ffrow, '/se_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleSE = true;
							}
						})
				}
				if (row.businessScope === 'SI') {
					this.$axios.get('/sc/scOrder/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "first";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('view', this.ffrow, '/si_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleSI = true;
							}
						})
				}
				if (row.businessScope === 'TE') {
					this.$axios.get('/sc/tcOrder/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "first";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('view', this.ffrow, '/te_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleTE = true;
							}
						})
				}
        if (row.businessScope === 'TI') {
            this.$axios.get('/sc/tcOrder/' + row.orderId)
                .then((response) => {
                    this.ffrow.incomeRecorded = response.data.data.incomeRecorded
                    this.ffrow.incomeStatus = response.data.data.incomeStatus
                    this.ffrow.costRecorded = response.data.data.costRecorded
                    this.ffrow.costStatus = response.data.data.costStatus
                    this.ffrow.activeName = "first";
                    if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
                        this.ffrow.ifFullscreen = true
                        this.jumpToNewPage('view', this.ffrow, '/ti_order')
                    } else {
                        this.ffrow.ifFullscreen = false
                        this.viewVisibleTI = true;
                    }
                })
        }
				if (row.businessScope === 'LC') {
					this.$axios.get('/sc/lcOrder/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "first";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('view', this.ffrow, '/lc_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleLC = true;
							}
						})
				}
				if (row.businessScope === 'IO') {
					this.$axios.get('/sc/ioOrder/' + row.orderId)
						.then((response) => {
							this.ffrow.incomeRecorded = response.data.data.incomeRecorded
							this.ffrow.incomeStatus = response.data.data.incomeStatus
							this.ffrow.costRecorded = response.data.data.costRecorded
							this.ffrow.costStatus = response.data.data.costStatus
							this.ffrow.activeName = "first";
							if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
								this.ffrow.ifFullscreen = true
								this.jumpToNewPage('view', this.ffrow, '/io_order')
							} else {
								this.ffrow.ifFullscreen = false
								this.viewVisibleIO = true;
							}
						})
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
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style>

</style>
