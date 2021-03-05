<template>



	<el-dialog title="订单明细" width="1300px" higeht="300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
	<!-- @cell-click="handlerCellClick" -->
    <el-checkbox style="float: right;margin-right: 5px;margin-bottom: 5px;" @change="setConstituteFlag" v-model="query.showConstituteFlag">显示毛利构成</el-checkbox>
    <el-button style="float: left;margin-left: 5px;margin-bottom: 5px;" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
    <el-button style="float: left;margin-left: 5px;margin-bottom: 5px;" type="primary" size="small" v-on:click="setColumn">设置</el-button>
    <el-table border v-loading="loading" :max-height="500" :data="data" stripe @header-dragend="cellWidth">
			<el-table-column align="center" label="序号" width="60">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
      <template v-for="(item,index) in tableColumns">
        <el-table-column v-if="item.prop=='business_scope'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"></el-table-column>
        <el-table-column v-if="item.prop=='order_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
        	<template slot-scope="scope">
        		<a v-if="!otherOrgFlag" href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
            <span v-if="otherOrgFlag">{{scope.row.order_code}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="item.prop=='awb_number'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
        	<template slot-scope="scope">
        		<span v-if="frow.businessScope == 'AE'">{{scope.row.awb_number}}</span>
        		<span v-if="frow.businessScope == 'AI'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
        		<span v-if="frow.businessScope == 'SE'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
        		<span v-if="frow.businessScope == 'SI'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
        		<span v-if="frow.businessScope == 'TE'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
            <span v-if="frow.businessScope == 'TI'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
        		<span v-if="frow.businessScope == 'LC'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
            <span v-if="frow.businessScope == 'IO'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
        	</template>
        </el-table-column>
        <el-table-column v-if="item.prop=='customer_number'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='coop_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='coop_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='business_product'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='sales_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterName"></el-table-column>
        <el-table-column v-if="item.prop=='servicer_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterName"></el-table-column>
        <el-table-column v-if="item.prop=='expect_flight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='expect_departure'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='expect_arrival'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='departure_station'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='arrival_station'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='goods_source_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='routing_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='goods_type'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='awb_from'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
        <el-table-column v-if="item.prop=='plan_charge_weight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='income_functional_amount_count'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="income_functional_amount_count"></el-table-column>
        <el-table-column v-if="item.prop=='cost_functional_amount_count'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="cost_functional_amount_count"></el-table-column>
        <el-table-column v-if="item.prop=='gross_profit'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="gross_profit"></el-table-column>
        <el-table-column v-if="item.prop=='unit_cost_amount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="unit_formatter_amount"></el-table-column>
        <el-table-column v-if="item.prop=='unit_gross_profit'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="unit_formatter_gross"></el-table-column>
        <el-table-column v-if="item.prop=='gross_profit_margin'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="gross_profit_margin"></el-table-column>
        <el-table-column v-if="item.prop=='functional_amount_writeoff'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" ></el-table-column>
        <el-table-column v-if="item.prop=='functional_amount_no_writeoff'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :formatter="functional_amount_no_writeoff"></el-table-column>
      </template>

      <el-table-column align="center" label="毛利构成" width="100" v-if="constituteFlag">
      	<el-table-column align="right" prop="main_routing_income" label="干线收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.main_routing_income)" style="color: red;">{{scope.row.main_routing_income}}</span>
      			<span v-else>{{scope.row.main_routing_income}}</span>
            <!-- <span>{{scope.row.main_routing_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="main_routing_cost" label="干线成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.main_routing_cost)" style="color: red;">{{scope.row.main_routing_cost}}</span>
      			<span v-else>{{scope.row.main_routing_cost}}</span>
            <!-- <span >{{scope.row.main_routing_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="main_routing" label="干线毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.main_routing)" style="color: red;">{{scope.row.main_routing}}</span>
      			<span v-else>{{scope.row.main_routing}}</span>
            <!-- <span>{{scope.row.main_routing}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="feeder_income" label="支线收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.feeder_income)" style="color: red;">{{scope.row.feeder_income}}</span>
      			<span v-else>{{scope.row.feeder_income}}</span>
            <!-- <span>{{scope.row.feeder_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="feeder_cost" label="支线成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.feeder_cost)" style="color: red;">{{scope.row.feeder_cost}}</span>
      			<span v-else>{{scope.row.feeder_cost}}</span>
            <!-- <span>{{scope.row.feeder_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="feeder" label="支线毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.feeder)" style="color: red;">{{scope.row.feeder}}</span>
      			<span v-else>{{scope.row.feeder}}</span>
            <!-- <span >{{scope.row.feeder}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="center" prop="operation_income" label="操作收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.operation_income)" style="color: red;">{{scope.row.operation_income}}</span>
      			<span v-else>{{scope.row.operation_income}}</span>
            <!-- <span>{{scope.row.operation_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="operation_cost" label="操作成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.operation_cost)" style="color: red;">{{scope.row.operation_cost}}</span>
      			<span v-else>{{scope.row.operation_cost}}</span>
            <!-- <span >{{scope.row.operation_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="operation" label="操作毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.operation)" style="color: red;">{{scope.row.operation}}</span>
      			<span v-else>{{scope.row.operation}}</span>
            <!-- <span>{{scope.row.operation}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="packaging_income" label="包装收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.packaging_income)" style="color: red;">{{scope.row.packaging_income}}</span>
      			<span v-else>{{scope.row.packaging_income}}</span>
            <!-- <span>{{scope.row.packaging_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="packaging_cost" label="包装成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.packaging_cost)" style="color: red;">{{scope.row.packaging_cost}}</span>
      			<span v-else>{{scope.row.packaging_cost}}</span>
            <!-- <span>{{scope.row.packaging_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="packaging" label="包装毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.packaging)" style="color: red;">{{scope.row.packaging}}</span>
      			<span v-else>{{scope.row.packaging}}</span>
            <!-- <span>{{scope.row.packaging}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="storage_income" label="仓储收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.storage_income)" style="color: red;">{{scope.row.storage_income}}</span>
      			<span v-else>{{scope.row.storage_income}}</span>
            <!-- <span>{{scope.row.storage_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="storage_cost" label="仓储成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.storage_cost)" style="color: red;">{{scope.row.storage_cost}}</span>
      			<span v-else>{{scope.row.storage_cost}}</span>
            <!-- <span >{{scope.row.storage_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="storage" label="仓储毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.storage)" style="color: red;">{{scope.row.storage}}</span>
      			<span v-else>{{scope.row.storage}}</span>
            <!-- <span>{{scope.row.storage}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="postage_income" label="快递收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.postage_income)" style="color: red;">{{scope.row.postage_income}}</span>
      			<span v-else>{{scope.row.postage_income}}</span>
            <!-- <span >{{scope.row.postage_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="postage_cost" label="快递成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.postage_cost)" style="color: red;">{{scope.row.postage_cost}}</span>
      			<span v-else>{{scope.row.postage_cost}}</span>
            <!-- <span>{{scope.row.postage_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="postage" label="快递毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.postage)" style="color: red;">{{scope.row.postage}}</span>
      			<span v-else>{{scope.row.postage}}</span>
            <!-- <span >{{scope.row.postage}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="clearance_income" label="关检收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.clearance_income)" style="color: red;">{{scope.row.clearance_income}}</span>
      			<span v-else>{{scope.row.clearance_income}}</span>
            <!-- <span >{{scope.row.clearance_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="clearance_cost" label="关检成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.clearance_cost)" style="color: red;">{{scope.row.clearance_cost}}</span>
      			<span v-else>{{scope.row.clearance_cost}}</span>
            <!-- <span >{{scope.row.clearance_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="clearance" label="关检毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.clearance)" style="color: red;">{{scope.row.clearance}}</span>
      			<span v-else>{{scope.row.clearance}}</span>
            <!-- <span >{{scope.row.clearance}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="exchange_income" label="数据收入" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.exchange_income)" style="color: red;">{{scope.row.exchange_income}}</span>
      			<span v-else>{{scope.row.exchange_income}}</span>
            <!-- <span >{{scope.row.exchange_income}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="exchange_cost" label="数据成本" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.exchange_cost)" style="color: red;">{{scope.row.exchange_cost}}</span>
      			<span v-else>{{scope.row.exchange_cost}}</span>
            <!-- <span >{{scope.row.exchange_cost}}</span> -->
      		</template>
      	</el-table-column>
      	<el-table-column align="right" prop="exchange" label="数据毛利" width="100" header-align="center">
      		<template slot-scope="scope">
      			<span v-if="checkdata(scope.row.exchange)" style="color: red;">{{scope.row.exchange}}</span>
      			<span v-else>{{scope.row.exchange}}</span>
            <!-- <span >{{scope.row.exchange}}</span> -->
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
  import setColumnVue from './detail_setting.vue'
  import columns from './detail_column.json'
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
        tableColumns:[],
        otherOrgFlag:false,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
        viewVisibleTE: false,
        viewVisibleTI: false,
        viewVisibleLC: false,
        viewVisibleIO: false,
        containerMethodFlag:1,
        constituteFlag: true,
        setColumnFlag:false,
        flagAE:false,
        flagAI:false,
        flagSE:false,
        flagSI:false,
				ffrow: {},
				editTab: '',
				customerType: '0',
				businessCodes: [],
				loading: false,
				showFlag: false,
				dateFlag: false,
        query:{
          showConstituteFlag:true,
          columnStrs:''
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
      'setColumnTag':setColumnVue
		},
		provide() {
			return {
		    findByPage: this.findByPage,
        querCach:this.querCach
			}
		},
		created() {
			// if (this.frow.businessScope=='AE'||this.frow.businessScope=='SE') {
			// 	this.dateFlag=true;
			// }else{
			// 	this.dateFlag=false;
			// }
			//查询业务范畴
      // console.log(this.frow.businessScope);
      // if(this.frow.businessScope == 'AE'){
      //    this.flagAE = true;
      //    this.containerMethodFlag = 1;
      // }else{
      //   this.flagAE = false;
      // }
      // if(this.frow.businessScope == 'AI'){
      //    this.flagAI = true;
      //    this.containerMethodFlag = 1;
      // }else{
      //   this.flagAI = false;
      // }
      // if(this.frow.businessScope == 'SE'){
      //    this.flagSE = true;
      //    if(this.frow.containerMethod=='整箱'){
      //      this.containerMethodFlag = 2;
      //    }else{
      //      this.containerMethodFlag = 3;
      //    }
      // }else{
      //   this.flagSE = false;
      // }
      // if(this.frow.businessScope == 'SI'){
      //    this.flagSI = true;
      //    if(this.frow.containerMethod=='整箱'){
      //      this.containerMethodFlag = 2;
      //    }else{
      //      this.containerMethodFlag = 3;
      //    }
      // }else{
      //   this.flagSI = false;
      // }
      // if(this.frow.businessScope == 'TE'){
      //    this.flagTE = true;
      //    if(this.frow.containerMethod=='整箱'){
      //      this.containerMethodFlag = 2;
      //    }else{
      //      this.containerMethodFlag = 3;
      //    }
      // }else{
      //   this.flagTE = false;
      // }
      // if(this.frow.businessScope == 'LC'){
      //    this.flagLC = true;
      //    this.containerMethodFlag = 1;
      // }else{
      //   this.flagLC = false;
      // }
     if(this.frow.otherOrg){
        this.otherOrgFlag = true;
     }
     this.querCach();

		},
		methods: {
      querCach(){
         let pageName = '报表统计分析/客户贡献度分析/详情';
         this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName).then(function(response) {
             let af_list_column = response.data.data;
             if(af_list_column && af_list_column.length>0){
                 this.tableColumns = this.sortBykey(af_list_column, 'index');
             }else{
                 this.tableColumns = this.sortBykey(columns.info, 'index');
             }
             this.setLabel(this.tableColumns)
             this.queryInfo();
         }.bind(this));
      },
      queryInfo(){
        this.loading = true
        let url = '';
        if(this.frow.businessScope.startsWith('A')){
           url = '/afbase/customerContribution/af/detail';
        }else{
          url = '/afbase/customerContribution/sc/detail';
        }
        this.$axios.get2(url, this.frow).then(function(response) {
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
      setColumn(){
        this.ffrow.businessScope = this.frow.businessScope;
        this.ffrow.containerMethod = this.frow.containerMethod;
        this.setColumnFlag = true;
      },
      exportExcel(){
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
        	let excelList = this.sortBykey(columns.info, 'index');
          this.setLabel(excelList);
          this.query.columnStrs = JSON.stringify(excelList);
        	this.exportExcelSure();
        });
      },
      exportExcelSure() {
        let param=this.frow;
        param.columnStrs =  this.query.columnStrs;
        param.showConstituteFlag = this.query.showConstituteFlag;
      	this.$axios.post3('/afbase/customerContribution/exportExcelDetail', param)
      		.then((response) => {
      			var blob = new Blob([response.data], {
      				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      			});
      			var downloadElement = document.createElement('a');
      			var href = window.URL.createObjectURL(blob); // 创建下载的链接
      			downloadElement.href = href;
      			downloadElement.download = '客户贡献度票数明细' + '.xls'; // 下载后文件名
      			document.body.appendChild(downloadElement);
      			downloadElement.click(); // 点击下载
      			document.body.removeChild(downloadElement); // 下载完成移除元素
      			window.URL.revokeObjectURL(href); // 释放掉blob对象
      		});
        this.query.columnStrs ="";
        this.frow.columnStrs = "";
      },
			sortBykey(ary, key) {
				return JSON.parse(JSON.stringify(ary)).sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
      cellWidth(newWidth, oldWidth, column, event) {
      	let strColumn = JSON.stringify(columns.info);
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
      		localStorage.setItem(userId + '_customer_contribution_detail_column_width', JSON.stringify(arrayC))
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
            if(column.prop == 'awb_number'){
               if(this.frow.businessScope=='TE' || this.frow.businessScope=='TI'){
                  column.label = "运单号码";
               }else if(this.frow.businessScope=='LC'||this.frow.businessScope=='IO'){
                  indexDelete.push(index);
               }else{
                 column.label = "主单号";
               }
            }
           //服务产品
           if (column.prop == 'business_product') {
               if(this.frow.businessScope!='AE'){
                 indexDelete.push(index);
               }
           }
           //航班号
           if(column.prop == 'expect_flight'){
              if(this.frow.businessScope.startsWith('A')){
                 column.label = "航班号";
              }else if(this.frow.businessScope.startsWith('S')){
                 column.label = "船次号";
              }else{
                indexDelete.push(index);
              }
           }
           if(column.prop == 'expect_departure'||column.prop == 'expect_arrival'){
             if(this.frow.businessScope.startsWith('S')||this.frow.businessScope.startsWith('A')){
               if(this.frow.businessScope.endsWith('E')){
                 column.label = "开航日期";
               }else{
                 column.label = "到港日期";
                 column.prop = 'expect_arrival';
                 // indexDelete.push(index);
               }
             }else if(this.frow.businessScope=='TE'){
               column.label = "发车日期";
             }else if(this.frow.businessScope=='TI'){
               column.label = "到达日期";
               column.prop = 'expect_arrival';
             }else if(this.frow.businessScope=='LC'){
               column.label = "用车日期";
             }else if(this.frow.businessScope=='IO'){
               column.label = "业务日期";
             }
           }
           //运单来源
           if(column.prop =='awb_from'){
              if(this.frow.businessScope=='AE'){
                column.label = "运单来源";
              }else if(this.frow.businessScope=='TE' || this.frow.businessScope=='TI'){
                column.label = "订舱代理";
              }else{
                indexDelete.push(index);
              }
           }
           //航线
           if(column.prop == 'routing_name'){
             if(this.frow.businessScope == "TE" || this.frow.businessScope == "TI" || this.frow.businessScope == "LC"|| this.frow.businessScope == "IO"){
               indexDelete.push(index);
             }
           }
           //货源地
           if(column.prop == 'goods_source_code'){
             if(this.frow.businessScope != "AE"){
               indexDelete.push(index);
             }
           }
           //计重
           if(column.prop == 'plan_charge_weight'){
             if(this.frow.businessScope.startsWith('A')||this.frow.businessScope=='LC'|| this.frow.businessScope == "IO"){
               column.label = "计重";
             }else{
               if(this.frow.containerMethod=='整箱'){
                 column.label = "箱量";
               }else{
                 column.label = "计费吨";
               }

             }
           }
           if(column.prop == 'departure_station'){
             if(this.frow.businessScope=='LC'){
               column.label = "始发城市";
             }
           }
           if(column.prop == 'arrival_station'){
             if(this.frow.businessScope=='LC'){
               column.label = "目的城市";
             }
           }
           //件数
           if(column.prop == 'pieces'){
             if(this.frow.businessScope.startsWith('A')||this.frow.businessScope=='LC'|| this.frow.businessScope == "IO"){
               column.label = "件数";
             }else{
               column.label = "标箱数量";
             }
           }
      		});
          if(indexDelete.length>0){
             indexDelete.sort(function(a,b){
               return a-b;
             });
             for(let i = 0; i < indexDelete.length; i++){
               this.$delete(tableColumns,indexDelete[i]-i);
             }
          }
      	} catch (e) {}
      },
      gross_profit_margin(row, column){
        if(!row.gross_profit_margin||row.gross_profit==0){
          return "0.00%";
        }else{
          return row.gross_profit_margin+'%';
        }
      },
      unit_formatter_gross(row, column){
        if(row.plan_charge_weight==0||row.unit_gross_profit==0){
           return '0.0';
        }else{
          return row.unit_gross_profit;
        }
      },
      unit_formatter_amount(row, column){
        if(row.plan_charge_weight==0||row.unit_cost_amount==0){
           return '0.0';
        }else{
          return row.unit_cost_amount;
        }
      },
      formatterName(row, column){
        if(column.label == '责任销售'){
           if(row.sales_name){
              return row.sales_name.split(' ')[0];
           }
        }
        if(column.label == '责任客服'){
           if(row.servicer_name){
              return row.servicer_name.split(' ')[0];
           }
        }
      },
      returnAwb(row,a,b){
        if(row[a]&&row[b]){
          return row[a]+'_'+row[b];
        }else{
          if(row[a]){
            return row[a];
          }
          if(row[b]){
            return row[b];
          }
        }
      },
			findByPage(){

			},
			// handlerCellClick(row, column, cell, event) {
			// 	if ("订单号" == column['label']) {
			// 		this.showView(row);
			// 	}
			// },
      cellClick(row){
        this.showView(row);
      },
      income_functional_amount_count(row){
       return  row.income_functional_amount_count.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      cost_functional_amount_count(row){
        return  row.cost_functional_amount_count.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      functional_amount_no_writeoff(row){
        return  row.functional_amount_no_writeoff.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      gross_profit(row){
        return  row.gross_profit.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
			showView(row) {
        row.businessScope = row.business_scope;
				this.ffrow = row;
        this.ffrow.orderUuid = row.order_uuid;
        this.ffrow.orderId = row.order_id;
        this.ffrow.orderCode = row.order_code;
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
			}
		}
	}
</script>
<style>

</style>
