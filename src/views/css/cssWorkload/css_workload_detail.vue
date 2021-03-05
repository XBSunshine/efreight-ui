<template>
	<el-dialog title="明细" width="1300px" higeht="300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-button style="margin-left: 10px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
		<el-button style="margin-left: 3px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
		<el-table border v-loading="loading" :data="data" stripe>
			<el-table-column align="center" label="序号" width="60">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.prop=='order_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.order_code}}</a>
					</template>
				</el-table-column>
				<el-table-column v-if="item.prop=='awb_number'&&(flagAE||flagAI||flagSE||flagSI||flagTE||flagTI)" :key="index" :prop="item.prop" label="主单号" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span v-if="flagAE||flagTE||flagTI">{{scope.row.awb_number}}</span>
						<span v-if="flagAI">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
						<span v-if="flagSE">{{returnAwb(scope.row,'mbl_number','hawb_number')}}</span>
						<span v-if="flagSI">{{returnAwb(scope.row,'mbl_number','hawb_number')}}</span>
					</template>
				</el-table-column>

        <el-table-column v-if="item.prop=='awb_number' && flagIO" :key="index" :prop="item.prop" label="客户单号" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='business_product' && flagAE" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='container_method' && (flagSE||flagSI||flagTE||flagTI)" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='coop_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>

				<el-table-column v-if="item.prop=='awb_from_name' && flagAE" :key="index" :prop="item.prop" label="运单来源" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='awb_from_name' && (flagSE||flagTE||flagTI)" :key="index" :prop="item.prop" label="订舱代理" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>

				<!--AE-->
				<el-table-column v-if="item.prop=='departure_station' && (flagAE||flagAI) " :key="index" :prop="item.prop" label="始发港" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='arrival_station'&& (flagLC)" :key="index" :prop="item.prop" label="目的城市" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='arrival_station'&& (flagIO)" :key="index" :prop="item.prop" label="目的地" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='arrival_station'&& (flagSE||flagSI||flagTE||flagTI||flagAE||flagAI)" :key="index" :prop="item.prop" label="目的港" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='expect_flight' && (flagAE||flagAI)" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='expect_departure' && flagAE" :key="index" :prop="item.prop" label="航班日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='expect_departure' && flagLC" :key="index" :prop="item.prop" label="用车日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='expect_departure' && flagTE" :key="index" :prop="item.prop" label="发车日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='expect_departure' && flagTI" :key="index" :prop="item.prop" label="到达日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='expect_departure' && flagIO" :key="index" :prop="item.prop" label="业务日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<!--AI-->
				<el-table-column v-if="item.prop=='expect_departure' && (flagAI||flagSI)" :key="index" :prop="item.prop" label="到港日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>

				<el-table-column v-if="item.prop=='pieces'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='weight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='volume'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='chargeWeight' && (flagAI||flagAE||flagLC||flagIO)" :key="index" :prop="item.prop" label="计费重量" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='salesName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='servicerName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='creatorName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>

				<!--SE or SI or TE-->
				<el-table-column v-if="item.prop=='departure_station' && (flagSE||flagSI||flagTE||flagTI) " :key="index" :prop="item.prop" label="起运港" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='departure_station' && (flagLC) " :key="index" :prop="item.prop" label="始发城市" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='departure_station' && (flagIO) " :key="index" :prop="item.prop" label="始发地" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='ship_name' && (flagSE||flagSI)" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<span>{{scope.row.ship_name}}/{{scope.row.ship_voyage_number}}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="item.prop=='expect_departure' && flagSE" :key="index" :prop="item.prop" label="离港日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='chargeWeight' && (flagSE||flagSI||flagTE||flagTI)" :key="index" :prop="item.prop" label="计费吨" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='containerList' && (flagSE||flagSI||flagTE||flagTI)" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.prop=='containerNumber' && (flagSE||flagSI||flagTE||flagTI)" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
			</template>
		</el-table>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="ffrow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="ffrow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="ffrow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="ffrow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="ffrow"></viewVisibleTagTE>
    <viewVisibleTagTI ref="addMission" v-if="viewVisibleTI" :visible.sync="viewVisibleTI" :frow="ffrow"></viewVisibleTagTI>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="ffrow"></viewVisibleTagLC>
    <viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="ffrow"></viewVisibleTagIO>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
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
	import columns from './css_workload_detail_column.json'
	import setVisibleVue from './css_workload_detail_setting'
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
				tableColumns: [],
				column: [],
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
        viewVisibleTI: false,
				viewVisibleLC: false,
        viewVisibleIO: false,
				flagAE: false,
				flagAI: false,
				flagSE: false,
				flagSI: false,
				flagTE: false,
        flagTI: false,
				flagLC: false,
        flagIO: false,
				setVisible: false,
				ffrow: {},
				editTab: '',
				customerType: '0',
				businessCodes: [],
				loading: false,
				showFlag: false,
				dateFlag: false
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
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		created() {
			if (this.frow.businessScope == 'AE') {
				this.flagAE = true;
			} else {
				this.flagAE = false;
			}
			if (this.frow.businessScope == 'AI') {
				this.flagAI = true;
			} else {
				this.flagAI = false;
			}
			if (this.frow.businessScope == 'SE') {
				this.flagSE = true;
			} else {
				this.flagSE = false;
			}
			if (this.frow.businessScope == 'SI') {
				this.flagSI = true;
			} else {
				this.flagSI = false;
			}
			if (this.frow.businessScope == 'TE') {
				this.flagTE = true;
			} else {
				this.flagTE = false;
			}
      if (this.frow.businessScope == 'TI') {
          this.flagTI = true;
      } else {
          this.flagTI = false;
      }
			if (this.frow.businessScope == 'LC') {
				this.flagLC = true;
			} else {
				this.flagLC = false;
			}
      if (this.frow.businessScope == 'IO') {
        this.flagIO = true;
      } else {
        this.flagIO = false;
      }

			//从数据库查询设置信息
			let pageName = '报表统计分析/工作量统计/明细';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let css_workload_detail_list_column = response.data.data;
					if (css_workload_detail_list_column && css_workload_detail_list_column.length > 0) {
						let arrayC = css_workload_detail_list_column
						if (arrayC && arrayC.length > 0) {
							this.tableColumns = this.sortBykey(arrayC, 'index');
						}
					} else {
						let str = JSON.stringify(columns.info);
						this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
					}
					this.loading = true
					this.$axios.get2('/afbase/workload/detial', this.frow).then(function(response) {
						this.data = response.data.data;
						this.loading = false
					}.bind(this)).catch(function(error) {
						this.loading = false
					})
				}.bind(this));
		},
		methods: {
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					let str = JSON.stringify(this.tableColumns);
					let arrayC = this.sortBykey(JSON.parse(str), 'index');
					let indexDelete = [];
					for (let i = 0; i < arrayC.length; i++) {
						if ((this.frow.businessScope === 'AE') && arrayC[i].prop === 'awb_from_name') {
							arrayC[i].label = "运单来源";
						}
						if ((this.frow.businessScope === 'SE' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'awb_from_name') {
							arrayC[i].label = "订舱代理";
						}
						if ((this.frow.businessScope === 'AE' || this.frow.businessScope === 'AI') && arrayC[i].prop === 'departure_station') {
							arrayC[i].label = "始发港";
						}
						if ((this.frow.businessScope === 'LC') && arrayC[i].prop === 'departure_station') {
							arrayC[i].label = "始发城市";
						}
            if ((this.frow.businessScope === 'IO') && arrayC[i].prop === 'departure_station') {
              arrayC[i].label = "始发地";
            }
						if ((this.frow.businessScope === 'SE' || this.frow.businessScope === 'SI' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'departure_station') {
							arrayC[i].label = "起运港";
						}
						if ((this.frow.businessScope === 'AE' || this.frow.businessScope === 'AI' || this.frow.businessScope === 'SE' || this.frow.businessScope === 'SI' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'arrival_station') {
							arrayC[i].label = "目的港";
						}
						if ((this.frow.businessScope === 'LC') && arrayC[i].prop === 'arrival_station') {
							arrayC[i].label = "目的城市";
						}
            if ((this.frow.businessScope === 'IO') && arrayC[i].prop === 'arrival_station') {
              arrayC[i].label = "目的地";
            }
						if ((this.frow.businessScope === 'AE') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "航班日期";
						}
						if ((this.frow.businessScope === 'LC') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "用车日期";
						}
						if ((this.frow.businessScope === 'AI' || this.frow.businessScope === 'SI') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "到港日期";
						}
						if ((this.frow.businessScope === 'TE') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "发车日期";
						}
            if ((this.frow.businessScope === 'TI') && arrayC[i].prop === 'expect_departure') {
                arrayC[i].label = "到达日期";
            }
						if ((this.frow.businessScope === 'SE') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "离港日期";
						}
            if ((this.frow.businessScope === 'IO') && arrayC[i].prop === 'expect_departure') {
              arrayC[i].label = "业务日期";
            }
						if ((this.frow.businessScope === 'AE' || this.frow.businessScope === 'AI' || this.frow.businessScope === 'LC' || this.frow.businessScope ==="IO") && arrayC[i].prop === 'chargeWeight') {
							arrayC[i].label = "计费重量";
						}
						if ((this.frow.businessScope === 'SE' || this.frow.businessScope === 'SI' || this.frow.businessScope === 'TE'|| this.frow.businessScope === 'TI') && arrayC[i].prop === 'chargeWeight') {
							arrayC[i].label = "计费吨";
						}
            if ((this.frow.businessScope === 'IO')) {
              if(arrayC[i].prop === 'awb_number'){
                arrayC[i].label = "客户单号";
              }
            }else{
              if(arrayC[i].prop === 'awb_number'){
                arrayC[i].label = "主单号";
              }
            }



						if ((this.frow.businessScope !== 'AE') && arrayC[i].prop === 'business_product') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'container_method') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'AE' && this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'awb_from_name') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'AE' && this.frow.businessScope !== 'AI') && arrayC[i].prop === 'expect_flight') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI') && arrayC[i].prop === 'ship_name') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'containerList') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'containerNumber') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope == 'LC') && arrayC[i].prop === 'awb_number') {
							indexDelete.push(i);
						}
					}
					if (indexDelete.length > 0) {
						indexDelete.sort(function(a, b) {
							return a - b;
						});
						for (let i = 0; i < indexDelete.length; i++) {
							this.$delete(arrayC, indexDelete[i] - i);
						}
					}
					this.frow.columnStrs = JSON.stringify(arrayC);
					this.exportExcelSure();
				}).catch(() => {
					let str = JSON.stringify(columns.info);
					let arrayC = this.sortBykey(JSON.parse(str), 'index');
					let indexDelete = [];
					for (let i = 0; i < arrayC.length; i++) {
						if ((this.frow.businessScope === 'AE') && arrayC[i].prop === 'awb_from_name') {
							arrayC[i].label = "运单来源";
						}
						if ((this.frow.businessScope === 'SE' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'awb_from_name') {
							arrayC[i].label = "订舱代理";
						}
						if ((this.frow.businessScope === 'AE' || this.frow.businessScope === 'AI') && arrayC[i].prop === 'departure_station') {
							arrayC[i].label = "始发港";
						}
						if ((this.frow.businessScope === 'LC') && arrayC[i].prop === 'departure_station') {
							arrayC[i].label = "始发城市";
						}
            if ((this.frow.businessScope === 'IO') && arrayC[i].prop === 'departure_station') {
              arrayC[i].label = "始发地";
            }
						if ((this.frow.businessScope === 'SE' || this.frow.businessScope === 'SI' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'departure_station') {
							arrayC[i].label = "起运港";
						}
						if ((this.frow.businessScope === 'AE' || this.frow.businessScope === 'AI' || this.frow.businessScope === 'SE' || this.frow.businessScope === 'SI' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'arrival_station') {
							arrayC[i].label = "目的港";
						}
						if ((this.frow.businessScope === 'LC') && arrayC[i].prop === 'arrival_station') {
							arrayC[i].label = "目的城市";
						}
            if ((this.frow.businessScope === 'IO') && arrayC[i].prop === 'arrival_station') {
              arrayC[i].label = "目的地";
            }
						if ((this.frow.businessScope === 'AE') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "航班日期";
						}
						if ((this.frow.businessScope === 'LC') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "用车日期";
						}
						if ((this.frow.businessScope === 'AI' || this.frow.businessScope === 'SI') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "到港日期";
						}
						if ((this.frow.businessScope === 'TE') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "发车日期";
						}
            if ((this.frow.businessScope === 'TI') && arrayC[i].prop === 'expect_departure') {
              arrayC[i].label = "到达日期";
            }
						if ((this.frow.businessScope === 'SE') && arrayC[i].prop === 'expect_departure') {
							arrayC[i].label = "离港日期";
						}
            if ((this.frow.businessScope === 'IO') && arrayC[i].prop === 'expect_departure') {
              arrayC[i].label = "业务日期";
            }
						if ((this.frow.businessScope === 'AE' || this.frow.businessScope === 'AI' || this.frow.businessScope === 'LC' || this.frow.businessScope === 'IO') && arrayC[i].prop === 'chargeWeight') {
							arrayC[i].label = "计费重量";
						}
						if ((this.frow.businessScope === 'SE' || this.frow.businessScope === 'SI' || this.frow.businessScope === 'TE' || this.frow.businessScope === 'TI') && arrayC[i].prop === 'chargeWeight') {
							arrayC[i].label = "计费吨";
						}
            if ((this.frow.businessScope === 'IO')) {
              if(arrayC[i].prop === 'awb_number'){
                arrayC[i].label = "客户单号";
              }
            }else{
              if(arrayC[i].prop === 'awb_number'){
                arrayC[i].label = "主单号";
              }
            }


						if ((this.frow.businessScope !== 'AE') && arrayC[i].prop === 'business_product') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'container_method') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'AE' && this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'awb_from_name') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'AE' && this.frow.businessScope !== 'AI') && arrayC[i].prop === 'expect_flight') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI') && arrayC[i].prop === 'ship_name') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'containerList') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope !== 'SE' && this.frow.businessScope !== 'SI' && this.frow.businessScope !== 'TE' && this.frow.businessScope !== 'TI') && arrayC[i].prop === 'containerNumber') {
							indexDelete.push(i);
						}
						if ((this.frow.businessScope == 'LC') && arrayC[i].prop === 'awb_number') {
							indexDelete.push(i);
						}
					}
					if (indexDelete.length > 0) {
						indexDelete.sort(function(a, b) {
							return a - b;
						});
						for (let i = 0; i < indexDelete.length; i++) {
							this.$delete(arrayC, indexDelete[i] - i);
						}
					}
					this.frow.columnStrs = JSON.stringify(arrayC);
					this.exportExcelSure();
				});

			},
			setting() {
				this.setVisible = true;
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
					localStorage.setItem(userId + '_css_workload_column_width', JSON.stringify(arrayC))
				}
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
				return "";
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			returnAwb(row, a, b) {
				if (row[b]) {
					return row[a] + '_' + row[b];
				} else {
					return row[a];
				}
			},
			findByPage() {
				//从数据库查询设置信息
				let pageName = '报表统计分析/工作量统计/明细';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let css_workload_detail_list_column = response.data.data;
						if (css_workload_detail_list_column && css_workload_detail_list_column.length > 0) {
							let arrayC = css_workload_detail_list_column
							if (arrayC && arrayC.length > 0) {
								this.tableColumns = this.sortBykey(arrayC, 'index');
							}
						} else {
							let str = JSON.stringify(columns.info);
							this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
						}
						this.loading = true
						this.frow.columnStrs = ''
						this.$axios.get2('/afbase/workload/detial', this.frow).then(function(response) {
							this.data = response.data.data;
							this.loading = false
						}.bind(this)).catch(function(error) {
							this.loading = false
						})
					}.bind(this));
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
				this.ffrow = row;
				this.ffrow.viewFlag = false;
				if (row.businessScope === 'AE') {
					this.ffrow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('edit', this.ffrow, '/af_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleAE = true;
					}
				}
				if (row.businessScope === 'AI') {
					this.ffrow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('edit', this.ffrow, '/ai_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleAI = true;
					}
				}
				if (row.businessScope === 'SE') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/se_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleSE = true;
					}
				}
				if (row.businessScope === 'SI') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/si_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleSI = true;
					}
				}
				if (row.businessScope === 'TE') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/te_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleTE = true;
					}
				}
        if (row.businessScope === 'TI') {
            this.ffrow.activeName = "first";
            if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
                this.ffrow.ifFullscreen = true
                this.jumpToNewPage('view', this.ffrow, '/ti_order')
            } else {
                this.ffrow.ifFullscreen = false
                this.viewVisibleTI = true;
            }
        }
				if (row.businessScope === 'LC') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/lc_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleLC = true;
					}
				}
        if (row.businessScope === 'IO') {
          this.ffrow.activeName = "first";
          if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
            this.ffrow.ifFullscreen = true
            this.jumpToNewPage('view', this.ffrow, '/io_order')
          } else {
            this.ffrow.ifFullscreen = false
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
			},

			exportExcelSure() {
				if (this.data.length == 0) {
					this.openError("查询结果没有数据，不允许导出");
					return;
				}
				this.$axios.post3('/afbase/workload/exportDetailExcel', this.frow)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '工作量统计列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
		}
	}
</script>
