<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="css_report_cost_list">
			<div ref="css_report_cost_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:140px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" style="width:71px;margin-right: -5px;" @change="changeBusinessScope">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:204px;">
								<template slot="prepend">{{flightDateName}}</template>
								<el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.flightDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker style="width: 135px;" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:233px;">
								<template slot="prepend">供应商类型</template>
								<el-select slot="suffix" v-model="query.customerType" style="width: 150px;margin-right: -5px;" clearable>
									<el-option label="互为代理" value="互为代理"></el-option>
									<el-option label="海外代理" value="海外代理"></el-option>
									<el-option label="干线承运人" value="干线承运人"></el-option>
									<el-option label="延伸服务供应商" value="延伸服务供应商"></el-option>
									<el-option label="业务类结算对象" value="业务类结算对象"></el-option>
									<el-option label="非业务结算对象" value="非业务结算对象"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width: 180px;" v-model="query.customerName" auto-complete="off" clearable>
								<template slot="prepend">供应商</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="mini" @click="queryList" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.orderCode" clearable auto-complete="off" style="width: 244px;">
								<template slot="prepend">提单/订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerNumber" clearable auto-complete="off" style="width: 245px;">
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:270px;">
								<template slot="prepend">服&nbsp;务&nbsp;类&nbsp;&thinsp;别</template>
								<el-select slot="suffix" v-model="query.serviceId" filterable clearable style="width:186px;margin-right: -5px;">
									<el-option v-for="item in serviceOptions" :key="item.serviceId" :label="item.serviceType+' - '+item.serviceNameCn" :value="item.serviceId">
										<span style="float: left">{{item.value}}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-checkbox v-model="ifOrigin" @change="originChange">显示原币</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="20px">
							<el-checkbox v-model="ifGroup" @change="groupChange">汇总</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="33px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" stripe :data="data" border :max-height="tableHeight">
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label=='订单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.orderCode}}</a>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='提单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span v-if="scope.row.hawbNumber&&scope.row.awbNumber">{{scope.row.awbNumber}}_{{scope.row.hawbNumber}}</span>
						<span v-if="scope.row.awbNumber&&!scope.row.hawbNumber">{{scope.row.awbNumber}}</span>
						<span v-if="!scope.row.awbNumber&&scope.row.hawbNumber">{{scope.row.hawbNumber}}</span>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='币种'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span v-if="scope.row.costCurrency!='CNY'" style="color: red;">{{scope.row.costCurrency}}</span>
						<span v-else>{{scope.row.costCurrency}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" v-else-if="item.label=='成本金额(原币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostAmountStr">
					<template slot-scope="scope">
						<span v-if="scope.row.costCurrency!='CNY'&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.costAmountStr}}</span>
						<span v-if="scope.row.costCurrency=='CNY'&&scope.row.businessScope!='合计'">{{scope.row.costAmountStr}}</span>
						<p v-if="scope.row.businessScope == '合计'" v-for="(item,index) in scope.row.costAmountStr.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>
				<el-table-column header-align="center" v-else-if="item.label=='成本金额(本币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostFunctionalAmountStr">
					<template slot-scope="scope">
						<span v-if="scope.row.costCurrency!='CNY'&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.costFunctionalAmountStr}}</span>
						<span v-else>{{scope.row.costFunctionalAmountStr}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" v-else-if="item.label=='已对账金额(原币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortAmountPaymentStr">
					<template slot-scope="scope">
						<span v-if="scope.row.amountPaymentStr!=scope.row.costAmountStr&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.amountPaymentStr}}</span>
						<span v-if="scope.row.amountPaymentStr==scope.row.costAmountStr&&scope.row.businessScope!='合计'">{{scope.row.amountPaymentStr}}</span>
						<p v-if="scope.row.businessScope == '合计'" v-for="(item,index) in scope.row.amountPaymentStr.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>

				<el-table-column header-align="center" v-else-if="item.label=='已对账金额(本币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortAmountFunctionalPaymentStr">
					<template slot-scope="scope">
						<span v-if="scope.row.amountFunctionalPaymentStr!=scope.row.costFunctionalAmountStr&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.amountFunctionalPaymentStr}}</span>
						<span v-else>{{scope.row.amountFunctionalPaymentStr}}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" v-else-if="item.label=='已核销金额(原币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostAmountWriteoffStr">
					<template slot-scope="scope">
						<span v-if="scope.row.costCurrency!='CNY'&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.costAmountWriteoffStr}}</span>
						<span v-if="scope.row.costCurrency=='CNY'&&scope.row.businessScope!='合计'">{{scope.row.costAmountWriteoffStr}}</span>
						<p v-if="scope.row.businessScope == '合计'" v-for="(item,index) in scope.row.costAmountWriteoffStr.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>

				<el-table-column header-align="center" v-else-if="item.label=='未付款金额(原币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostAmountNoWriteoffStr">
					<template slot-scope="scope">
						<span v-if="scope.row.costCurrency!='CNY'&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.costAmountNoWriteoffStr}}</span>
						<span v-if="scope.row.costCurrency=='CNY'&&scope.row.businessScope!='合计'">{{scope.row.costAmountNoWriteoffStr}}</span>
						<p v-if="scope.row.businessScope == '合计'" v-for="(item,index) in scope.row.costAmountNoWriteoffStr.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>
				<el-table-column header-align="center" v-else-if="item.label=='未付款金额(本币)'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostFunctionalAmountNoWriteoffStr">
					<template slot-scope="scope">
						<span v-if="scope.row.costAmountNoWriteoff!=0&&scope.row.businessScope!='合计'" style="color: red;">{{scope.row.costFunctionalAmountNoWriteoffStr}}</span>
						<span v-else>{{scope.row.costFunctionalAmountNoWriteoffStr}}</span>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='毛重'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span>{{ formatter11(scope.row) }}</span>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='体积'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span>{{ formatter22(scope.row) }}</span>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='计费重量'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span>{{ formatter33(scope.row) }}</span>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='计费吨'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span>{{ formatter44(scope.row) }}</span>
					</template>
				</el-table-column>
				<el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
				</el-table-column>
			</template>
		</el-table>
		<div ref="css_report_cost_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="frow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="frow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="frow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="frow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="frow"></viewVisibleTagTE>
    <viewVisibleTagTI ref="addMission" v-if="viewVisibleTI" :visible.sync="viewVisibleTI" :frow="frow"></viewVisibleTagTI>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="frow"></viewVisibleTagLC>
		<viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="frow"></viewVisibleTagIO>
		<viewVisibleTagSEForView ref="addMission" v-if="viewVisibleSEForView" :visible.sync="viewVisibleSEForView" :frow="frow"></viewVisibleTagSEForView>
		<viewVisibleTagSIForView ref="addMission" v-if="viewVisibleSIForView" :visible.sync="viewVisibleSIForView" :frow="frow"></viewVisibleTagSIForView>
		<viewVisibleTagTEForView ref="addMission" v-if="viewVisibleTEForView" :visible.sync="viewVisibleTEForView" :frow="frow"></viewVisibleTagTEForView>
    <viewVisibleTagTIForView ref="addMission" v-if="viewVisibleTIForView" :visible.sync="viewVisibleTIForView" :frow="frow"></viewVisibleTagTIForView>
		<viewVisibleTagLCForView ref="addMission" v-if="viewVisibleLCForView" :visible.sync="viewVisibleLCForView" :frow="frow"></viewVisibleTagLCForView>
		<viewVisibleTagIOForView ref="addMission" v-if="viewVisibleIOForView" :visible.sync="viewVisibleIOForView" :frow="frow"></viewVisibleTagIOForView>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
	</div>

</template>
<script>
	import setVisibleVue from './cssReportCost/css_report_cost_setting.vue'
	import columns from './cssReportCost/css_report_cost.json'
	import viewVisibleVueAE from '../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../sc/se/order/main/order_edit.vue'
	import viewVisibleVueSI from '../sc/si/order/main/order_edit.vue'
	import viewVisibleVueTE from '../tc/te/order/main/order_edit.vue'
  import viewVisibleVueTI from '../tc/ti/order/main/order_edit.vue'
	import viewVisibleVueLC from '../lc/order/main/order_edit.vue'
	import viewVisibleVueIO from '../io/order/main/order_edit.vue'
	import viewVisibleVueSEForView from '../sc/se/order/main/order_view.vue'
	import viewVisibleVueSIForView from '../sc/si/order/main/order_view.vue'
	import viewVisibleVueTEForView from '../tc/te/order/main/order_view.vue'
  import viewVisibleVueTIForView from '../tc/ti/order/main/order_view.vue'
	import viewVisibleVueLCForView from '../lc/order/main/order_view.vue'
	import viewVisibleVueIOForView from '../io/order/main/order_view.vue'

	export default {
		data() {
			return {
				tableHeight: '550px',
				loading: false,
				showFlag: false,
				data: [],
				tableColumns: [],
				frow: {},
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				businessCodes: [],
				serviceOptions: [],
				flightDateName: '开航日期',
				query: {
					businessScope: 'AE',
					flightDateStart: '',
					flightDateEnd: '',
					customerType: '',
					customerName: '',
					orderCode: '',
					customerNumber: '',
					serviceId: '',
					groupSum: true,
					showOrigin: false
				},
				ifOrigin: false,
				ifGroup: true,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
        viewVisibleTI: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				viewVisibleSEForView: false,
				viewVisibleSIForView: false,
				viewVisibleTEForView: false,
        viewVisibleTIForView: false,
				viewVisibleLCForView: false,
				viewVisibleIOForView: false,
				setVisible: false,
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'viewVisibleTagAE': viewVisibleVueAE,
			'viewVisibleTagAI': viewVisibleVueAI,
			'viewVisibleTagSE': viewVisibleVueSE,
			'viewVisibleTagSI': viewVisibleVueSI,
			'viewVisibleTagTE': viewVisibleVueTE,
      'viewVisibleTagTI': viewVisibleVueTI,
			'viewVisibleTagLC': viewVisibleVueLC,
			'viewVisibleTagIO': viewVisibleVueIO,
			'viewVisibleTagSEForView': viewVisibleVueSEForView,
			'viewVisibleTagSIForView': viewVisibleVueSIForView,
			'viewVisibleTagTEForView': viewVisibleVueTEForView,
      'viewVisibleTagTIForView': viewVisibleVueTIForView,
			'viewVisibleTagLCForView': viewVisibleVueLCForView,
			'viewVisibleTagIOForView': viewVisibleVueIOForView,
		},
		provide() {
			return {
				findByPage: this.queryList
			}
		},
		created: function() {
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;

			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//查询服务类别
			this.$axios.get2('/afbase/service/queryList', {
				businessScope: 'AE'
			}).then(function(response) {
				this.serviceOptions = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			});
			this.query.flightDateStart = this.getDateTime(new Date());
			//从数据库查询设置信息
			let pageName = '财务结算管理/成本明细查询/' + this.query.businessScope;
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then((response) => {
					if (response.data.code == 0) {
						this.tableColumns = response.data.data;
						if (!this.tableColumns || this.tableColumns.length == 0) {
							this.tableColumns = JSON.parse(JSON.stringify(columns.info))
						}
					} else {
						this.tableColumns = JSON.parse(JSON.stringify(columns.info))
					}
					this.setLabel(this.tableColumns)
				});
		},
		mounted() {
			this.setHeight();
		},
		methods: {
			sortCostAmountStr(a, b) {
				return a.costAmountStr.replace(/,/g, "") - b.costAmountStr.replace(/,/g, "")
			},
			sortCostFunctionalAmountStr(a, b) {
				return a.costFunctionalAmountStr.replace(/,/g, "") - b.costFunctionalAmountStr.replace(/,/g, "")
			},
			sortAmountPaymentStr(a, b) {
				return a.amountPaymentStr.replace(/,/g, "") - b.amountPaymentStr.replace(/,/g, "")
			},
			sortAmountFunctionalPaymentStr(a, b) {
				return a.amountFunctionalPaymentStr.replace(/,/g, "") - b.amountFunctionalPaymentStr.replace(/,/g, "")
			},
			sortCostAmountWriteoffStr(a, b) {
				return a.costAmountWriteoffStr.replace(/,/g, "") - b.costAmountWriteoffStr.replace(/,/g, "")
			},
			sortCostAmountNoWriteoffStr(a, b) {
				return a.costAmountNoWriteoffStr.replace(/,/g, "") - b.costAmountNoWriteoffStr.replace(/,/g, "")
			},
			sortCostFunctionalAmountNoWriteoffStr(a, b) {
				return a.costFunctionalAmountNoWriteoffStr.replace(/,/g, "") - b.costFunctionalAmountNoWriteoffStr.replace(/,/g, "")
			},
			setting() {
				this.frow.businessScope = this.query.businessScope
				this.setVisible = true;
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let css_report_cost_header = this.$refs.css_report_cost_header.offsetHeight;
					let css_report_cost_footer = this.$refs.css_report_cost_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - css_report_cost_header - css_report_cost_footer;
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
					localStorage.setItem(userId + '_af_list_column_width', JSON.stringify(arrayC))
				}
			},
			setLabel(tableColumns) {
				let indexDelete = [];
				for (let i = 0; i < tableColumns.length; i++) {
					if (this.query.businessScope.endsWith('E') && tableColumns[i].prop === 'flightDate') {
						tableColumns[i].label = "开航日期";
					}
					if ((this.query.businessScope == 'AI' || this.query.businessScope == 'SI') && tableColumns[i].prop === 'flightDate') {
						tableColumns[i].label = "到港日期";
					}
					if (this.query.businessScope.endsWith('C') && tableColumns[i].prop === 'flightDate') {
						tableColumns[i].label = "用车日期";
					}
					if (this.query.businessScope == 'TE' && tableColumns[i].prop === 'flightDate') {
						tableColumns[i].label = "发车日期";
					}
          if (this.query.businessScope == 'TI' && tableColumns[i].prop === 'flightDate') {
              tableColumns[i].label = "到达日期";
          }
					if (this.query.businessScope == 'IO' && tableColumns[i].prop === 'flightDate') {
						tableColumns[i].label = "业务日期";
					}
					if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope === 'IO') && tableColumns[i].prop === 'confirmChargeWeight') {
						tableColumns[i].label = "计费重量"
					} else if (tableColumns[i].prop === 'confirmChargeWeight') {
						tableColumns[i].label = "计费吨"
					}
					if (this.ifGroup && tableColumns[i].prop === 'serviceName') {
						indexDelete.push(i)
					}
					if (!this.ifOrigin && tableColumns[i].prop === 'costCurrency') {
						indexDelete.push(i)
					}
					if (!this.ifOrigin && tableColumns[i].prop === 'costAmountStr') {
						indexDelete.push(i)
					}
					if (!this.ifOrigin && tableColumns[i].prop === 'amountPaymentStr') {
						indexDelete.push(i)
					}
					if (!this.ifOrigin && tableColumns[i].prop === 'costAmountWriteoffStr') {
						indexDelete.push(i)
					}
					if (!this.ifOrigin && tableColumns[i].prop === 'costAmountNoWriteoffStr') {
						indexDelete.push(i)
					}
					if (tableColumns[i].prop == 'awbNumber') {
						if (this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
							indexDelete.push(i);
						}
					}
				}
				if (indexDelete.length > 0) {
					indexDelete.sort(function(a, b) {
						return a - b;
					});
					for (let i = 0; i < indexDelete.length; i++) {
						this.$delete(tableColumns, indexDelete[i] - i);
					}
				}
				tableColumns = this.sortBykey(tableColumns, 'index')
			},
			//标题样式
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {

			},
			//标题 stly
			addCellStayle(data) {
				if (data.column.property === "incomeAmountStr") {
					let k = '';
					if (data.row.incomeAmountStr.indexOf('CNY') == -1) {
						k = "color:red;"
					} else {
						k = "color:#606266;"
					}
					return k;
				} else {
					return "";
				}
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			formatter11(row, column) {
				let confirmWeight = '';

				if (row.confirmWeight) {
					confirmWeight = row.confirmWeight
				}
				if (row.confirmWeight == '0.0' || row.confirmWeight == '0.000') {
					return '0.0'
				}

				if (confirmWeight != '') {
					confirmWeight = this.getNumber1(confirmWeight);
				}
				return confirmWeight;
			},
			formatter22(row, column) {
				let confirmVolume = '';

				if (row.confirmVolume) {
					confirmVolume = row.confirmVolume
				}

				if (row.confirmVolume == '0.0' || row.confirmVolume == '0.000') {
					return '0.000'
				}

				if (confirmVolume != '') {
					confirmVolume = this.getNumber3(confirmVolume);
				}
				return confirmVolume;
			},
			formatter33(row, column) {
				let confirmChargeWeight = '';

				if (row.confirmChargeWeight) {
					confirmChargeWeight = row.confirmChargeWeight
				}

				if (row.confirmChargeWeight == '0.0' || row.confirmChargeWeight == '0.000') {
					return '0.0'
				}

				if (confirmChargeWeight != '') {
					confirmChargeWeight = this.getNumber1(confirmChargeWeight);
				}
				return confirmChargeWeight;
			},
			formatter44(row, column) {
				let confirmChargeWeight = '';

				if (row.confirmChargeWeight) {
					confirmChargeWeight = row.confirmChargeWeight
				}

				if (row.confirmChargeWeight == '0.0' || row.confirmChargeWeight == '0.000') {
					return '0.000'
				}

				if (confirmChargeWeight != '') {
					confirmChargeWeight = this.getNumber3(confirmChargeWeight);
				}
				return confirmChargeWeight;
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
			handlerCellClick(row, column, cell, event) {
				if ("订单号" == column['label']) {
					this.showView(row);
				}
			},
			cellClick(row) {
				this.showView(row);
			},

			showView(row) {
				this.frow = row;
				if (row.businessScope === 'AE') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('af-order-edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.activeName = "serviceTab";
					} else {
						this.frow.viewFlag = false;
						this.frow.activeName = "editTab";
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow, '/af_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleAE = true;
					}
				}
				if (row.businessScope === 'AI') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('ai-order-edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.activeName = "serviceTab";
					} else {
						this.frow.viewFlag = false;
						this.frow.activeName = "editTab";
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow, '/ai_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleAI = true;
					}
				}
				if (row.businessScope === 'SE') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('se_order_edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.jumpToTab = "third";
					} else {
						this.frow.viewFlag = false;
						this.frow.jumpToTab = "first";
					}
					if (buttonInfo.indexOf('se_order_edit') > -1) {
						this.frow.permissionButtonForEdit = true
					} else {
						this.frow.permissionButtonForEdit = false
					}
					if (buttonInfo.indexOf('se_order_service') > -1) {
						this.frow.permissionButtonForService = true
					} else {
						this.frow.permissionButtonForService = false
					}
					if (buttonInfo.indexOf('se_order_file') > -1) {
						this.frow.permissionButtonForFile = true
					} else {
						this.frow.permissionButtonForFile = false
					}
					if (buttonInfo.indexOf('se_order_log') > -1) {
						this.frow.permissionButtonForLog = true
					} else {
						this.frow.permissionButtonForLog = false
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						if (buttonInfo.indexOf('se_order_edit') > -1) {
							this.jumpToNewPage('edit', this.frow, '/se_order')
						} else {
							this.jumpToNewPage('view', this.frow, '/se_order')
						}
					} else {
						this.frow.ifFullscreen = false
						if (buttonInfo.indexOf('se_order_edit') > -1) {
							this.viewVisibleSE = true;
						} else {
							this.viewVisibleSEForView = true;
						}
					}
				}
				if (row.businessScope === 'SI') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('si_order_edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.jumpToTab = "third";
					} else {
						this.frow.viewFlag = false;
						this.frow.jumpToTab = "first";
					}
					if (buttonInfo.indexOf('si_order_edit') > -1) {
						this.frow.permissionButtonForEdit = true
					} else {
						this.frow.permissionButtonForEdit = false
					}
					if (buttonInfo.indexOf('si_order_service') > -1) {
						this.frow.permissionButtonForService = true
					} else {
						this.frow.permissionButtonForService = false
					}
					if (buttonInfo.indexOf('si_order_file') > -1) {
						this.frow.permissionButtonForFile = true
					} else {
						this.frow.permissionButtonForFile = false
					}
					if (buttonInfo.indexOf('si_order_log') > -1) {
						this.frow.permissionButtonForLog = true
					} else {
						this.frow.permissionButtonForLog = false
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						if (buttonInfo.indexOf('si_order_edit') > -1) {
							this.jumpToNewPage('edit', this.frow, '/si_order')
						} else {
							this.jumpToNewPage('view', this.frow, '/si_order')
						}
					} else {
						this.frow.ifFullscreen = false
						if (buttonInfo.indexOf('si_order_edit') > -1) {
							this.viewVisibleSI = true;
						} else {
							this.viewVisibleSIForView = true;
						}
					}
				}
				if (row.businessScope === 'TE') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('te_order_edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.jumpToTab = "third";
					} else {
						this.frow.viewFlag = false;
						this.frow.jumpToTab = "first";
					}
					if (buttonInfo.indexOf('te_order_edit') > -1) {
						this.frow.permissionButtonForEdit = true
					} else {
						this.frow.permissionButtonForEdit = false
					}
					if (buttonInfo.indexOf('te_order_service') > -1) {
						this.frow.permissionButtonForService = true
					} else {
						this.frow.permissionButtonForService = false
					}
					if (buttonInfo.indexOf('te_order_file') > -1) {
						this.frow.permissionButtonForFile = true
					} else {
						this.frow.permissionButtonForFile = false
					}
					if (buttonInfo.indexOf('te_order_log') > -1) {
						this.frow.permissionButtonForLog = true
					} else {
						this.frow.permissionButtonForLog = false
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						if (buttonInfo.indexOf('te_order_edit') > -1) {
							this.jumpToNewPage('edit', this.frow, '/te_order')
						} else {
							this.jumpToNewPage('view', this.frow, '/te_order')
						}
					} else {
						this.frow.ifFullscreen = false
						if (buttonInfo.indexOf('te_order_edit') > -1) {
							this.viewVisibleTE = true;
						} else {
							this.viewVisibleTEForView = true;
						}
					}
				}
        if (row.businessScope === 'TI') {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('ti_order_edit') > -1) {
                this.frow.viewFlag = true;
                this.frow.jumpToTab = "third";
            } else {
                this.frow.viewFlag = false;
                this.frow.jumpToTab = "first";
            }
            if (buttonInfo.indexOf('ti_order_edit') > -1) {
                this.frow.permissionButtonForEdit = true
            } else {
                this.frow.permissionButtonForEdit = false
            }
            if (buttonInfo.indexOf('ti_order_service') > -1) {
                this.frow.permissionButtonForService = true
            } else {
                this.frow.permissionButtonForService = false
            }
            if (buttonInfo.indexOf('ti_order_file') > -1) {
                this.frow.permissionButtonForFile = true
            } else {
                this.frow.permissionButtonForFile = false
            }
            if (buttonInfo.indexOf('ti_order_log') > -1) {
                this.frow.permissionButtonForLog = true
            } else {
                this.frow.permissionButtonForLog = false
            }
            if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
                this.frow.ifFullscreen = true
                if (buttonInfo.indexOf('ti_order_edit') > -1) {
                    this.jumpToNewPage('edit', this.frow, '/ti_order')
                } else {
                    this.jumpToNewPage('view', this.frow, '/ti_order')
                }
            } else {
                this.frow.ifFullscreen = false
                if (buttonInfo.indexOf('ti_order_edit') > -1) {
                    this.viewVisibleTI = true;
                } else {
                    this.viewVisibleTIForView = true;
                }
            }
        }
				if (row.businessScope === 'LC') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('lc_order_edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.jumpToTab = "third";
					} else {
						this.frow.viewFlag = false;
						this.frow.jumpToTab = "first";
					}
					if (buttonInfo.indexOf('lc_order_edit') > -1) {
						this.frow.permissionButtonForEdit = true
					} else {
						this.frow.permissionButtonForEdit = false
					}
					if (buttonInfo.indexOf('lc_order_service') > -1) {
						this.frow.permissionButtonForService = true
					} else {
						this.frow.permissionButtonForService = false
					}
					if (buttonInfo.indexOf('lc_order_file') > -1) {
						this.frow.permissionButtonForFile = true
					} else {
						this.frow.permissionButtonForFile = false
					}
					if (buttonInfo.indexOf('lc_order_log') > -1) {
						this.frow.permissionButtonForLog = true
					} else {
						this.frow.permissionButtonForLog = false
					}
					if (buttonInfo.indexOf('lc_order_inbound') > -1) {
						this.frow.permissionButtonForInbound = true
					} else {
						this.frow.permissionButtonForInbound = false
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						if (buttonInfo.indexOf('lc_order_edit') > -1) {
							this.jumpToNewPage('edit', this.frow, '/lc_order')
						} else {
							this.jumpToNewPage('view', this.frow, '/lc_order')
						}
					} else {
						this.frow.ifFullscreen = false
						if (buttonInfo.indexOf('lc_order_edit') > -1) {
							this.viewVisibleLC = true;
						} else {
							this.viewVisibleLCForView = true;
						}
					}
				}
				if (row.businessScope === 'IO') {
					let buttonInfo = window.localStorage.getItem('buttonInfo')
					if (buttonInfo.indexOf('io_order_edit') > -1) {
						this.frow.viewFlag = true;
						this.frow.jumpToTab = "third";
					} else {
						this.frow.viewFlag = false;
						this.frow.jumpToTab = "first";
					}
					if (buttonInfo.indexOf('io_order_edit') > -1) {
						this.frow.permissionButtonForEdit = true
					} else {
						this.frow.permissionButtonForEdit = false
					}
					if (buttonInfo.indexOf('io_order_service') > -1) {
						this.frow.permissionButtonForService = true
					} else {
						this.frow.permissionButtonForService = false
					}
					if (buttonInfo.indexOf('io_order_file') > -1) {
						this.frow.permissionButtonForFile = true
					} else {
						this.frow.permissionButtonForFile = false
					}
					if (buttonInfo.indexOf('io_order_log') > -1) {
						this.frow.permissionButtonForLog = true
					} else {
						this.frow.permissionButtonForLog = false
					}
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						if (buttonInfo.indexOf('io_order_edit') > -1) {
							this.jumpToNewPage('edit', this.frow, '/io_order')
						} else {
							this.jumpToNewPage('view', this.frow, '/io_order')
						}
					} else {
						this.frow.ifFullscreen = false
						if (buttonInfo.indexOf('io_order_edit') > -1) {
							this.viewVisibleIO = true;
						} else {
							this.viewVisibleIOForView = true;
						}
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
			originChange() {
				this.queryList();
			},
			groupChange() {
				this.queryList();
			},
			changeBusinessScope(val) {
				this.data = [];
				this.query.serviceId = ''
				this.$axios.get2('/afbase/service/queryList', {
					businessScope: this.query.businessScope
				}).then(function(response) {
					this.serviceOptions = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				});
				if (val == 'AE' || val == 'SE') {
					this.flightDateName = '开航日期'
				} else if (val == 'AI' || val == 'SI') {
					this.flightDateName = '到港日期'
				} else if (val == 'LC') {
					this.flightDateName = '用车日期';
				} else if (val == 'TE') {
					this.flightDateName = '发车日期'
				} else if (val == 'TI') {
            this.flightDateName = '到达日期'
        } else if (val == 'IO') {
					this.flightDateName = '业务日期'
				}

			},
			handleCommand(command) {
				if (command == 'editMawb') {
					this.showedit(this.currRow, "mawb")
				}

			},
			handleChange(command) {
				this.currRow = command
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
			queryList() {
				this.setHeight();
				//从数据库查询设置信息
				let pageName = '财务结算管理/成本明细查询/' + this.query.businessScope;
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						if (response.data.code == 0) {
							this.tableColumns = response.data.data;
							if (!this.tableColumns || this.tableColumns.length == 0) {
								this.tableColumns = JSON.parse(JSON.stringify(columns.info))
							}
						} else {
							this.tableColumns = JSON.parse(JSON.stringify(columns.info))
						}
						this.setLabel(this.tableColumns)


						this.query.groupSum = this.ifGroup;
						this.loading = true
						this.$axios.get2('/afbase/cost/page?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
							if (this.data.length == 0) {
								let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
								this.queryList2(current);
							} else {
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}.bind(this));
			},
			queryList2(current) {
				this.query.groupSum = this.ifGroup;
				this.$axios.get2('/afbase/cost/page?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch(function(error) {
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
				return _year + "-" + _month + "-01";
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					let pageName = '财务结算管理/成本明细查询/' + this.query.businessScope;
					this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
						.then((response) => {
							let arr = []
							if (response.data.code == 0) {
								arr = response.data.data
								if (!arr || arr.length == 0) {
									arr = JSON.parse(JSON.stringify(columns.info))
								}
							} else {
								arr = JSON.parse(JSON.stringify(columns.info))
							}
							this.setLabel(arr)
							this.query.columnStrs = JSON.stringify(arr)
							this.exportExcelSure()
						});
				}).catch(() => {
					let arr = JSON.parse(JSON.stringify(columns.info))
					this.setLabel(arr)
					this.query.columnStrs = JSON.stringify(arr)
					this.exportExcelSure()
				});
			},
			exportExcelSure() {
				this.query.groupSum = this.ifGroup;
				this.query.showOrigin = this.ifOrigin;

				if (this.data.length == 0) {
					this.openError("列表无数据，请查询")
					return
				}
				this.$axios.post3('/afbase/cost/exportExcel', this.query).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '成本查询导出.xlsx'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
					this.query.columnStrs = ''; //清空掉导出的列表字段
				}).catch((error) => {});
			},
		}
	}
</script>
<style>
	.css_report_cost_list .el-input__icon {
		line-height: 30px !important;
	}

	.css_report_cost_list .el-form-item__content {
		line-height: 30px !important;
	}

	.css_report_cost_list .el-input-group__prepend {
		padding: 0 6px;
	}

	.css_report_cost_list .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.css_report_cost_list .el-button {
		margin-top: -5px !important
	}
</style>
