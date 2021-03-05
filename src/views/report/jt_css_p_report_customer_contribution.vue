<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="orderLockUnlockList">
      <div ref="customer_header">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:160px;">
							<template slot="prepend"><font style="color: red;">*</font>业务范畴</template>
							<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:86px;margin-right: -5px;" @change="businessScopeChange">
                <el-option  v-for="item in businessCodes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
        	<el-form-item label-width="10px">
        		<el-input style="width:210px;">
        			<template slot="prepend"><font style="color: red;">*</font>统计周期</template>
        			<el-date-picker slot="suffix" v-model="query.startDate" clearable type="date" value-format="yyyy-MM-dd"
        			 placeholder="起" style="width: 135px;margin-right: -5px;">
        			</el-date-picker>
        		</el-input>
        		<span>-</span>
        		<el-date-picker v-model="query.endDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="止"
        		 style="width: 135px;">
        		</el-date-picker>
        	</el-form-item>
        </el-col>
				<el-col class="elementWidth" v-if="busFlag">
					<el-form-item label-width="10px">
						<el-input style="width:180px;">
							<template slot="prepend">服务产品</template>
							<el-select slot="suffix" v-model="query.businessProduct" filterable placeholder="请选择" clearable style="width: 111px;margin-right: -5px">
								<el-option v-for="item in businessProducts" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth" v-if="!busFlag&&query.businessScope!='AI'&&query.businessScope!='LC'&&query.businessScope!='IO'">
        	<el-form-item label-width="10px">
        		<el-input style="width:180px;">
        			<template slot="prepend"><font style="color: red;">*</font>装箱方式</template>
        			<el-select slot="suffix" v-model="query.containerMethod" filterable placeholder="请选择" clearable style="width: 106px;margin-right: -5px">
        				<el-option v-for="item in containerMethods" :key="item.paramText" :label="item.paramText" :value="item.paramText">
        				</el-option>
        			</el-select>
        		</el-input>
        	</el-form-item>
        </el-col>


				<el-col class="elementWidth" v-if="query.businessScope!='AI'&&query.businessScope!='LC'&&query.businessScope!='IO'">
					<el-form-item label-width="10px">
						<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
						<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
						<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth" v-if="query.businessScope=='AI'||query.businessScope=='LC'||query.businessScope=='IO'">
        	<el-form-item label-width="200px">
        		<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
        		<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
        		<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
        	</el-form-item>
        </el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth" >
					<el-form-item label-width="10px">
						<el-input style="width:180px;">
							<template slot="prepend"><font style="color: red;">*</font>统计口径</template>
							<el-select slot="suffix" v-model="query.countType" filterable placeholder="请选择"  style="width: 106px;margin-right: -5px">
							   <el-option v-if="query.businessScope=='AE'||query.businessScope=='SE'" label="开航日期" value="开航日期"></el-option>
                 <el-option v-if="query.businessScope=='AI'||query.businessScope=='SI'" label="到港日期" value="到港日期"></el-option>
                 <el-option v-if="query.businessScope=='TE'" label="发车日期" value="发车日期"></el-option>
                 <el-option v-if="query.businessScope=='TI'" label="到达日期" value="到达日期"></el-option>
                 <el-option v-if="query.businessScope=='LC'" label="用车日期" value="用车日期"></el-option>
                 <el-option v-if="query.businessScope=='IO'" label="业务日期" value="业务日期"></el-option>
                 <el-option label="财务日期" value="财务日期"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" >
					<el-form-item label-width="10px">
						<el-input style="width:175px;">
							<template slot="prepend">财务锁账</template>
							<el-select slot="suffix" v-model="query.orderStatus" filterable placeholder="请选择" clearable style="width: 106px;margin-right: -5px">
								<el-option label="是" value="是"></el-option>
								<el-option label="否" value="否"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input style="width:189px;">
							<template slot="prepend">货物类型</template>
							<el-select slot="suffix" v-model="query.goodsType" filterable placeholder="请选择" clearable style="width: 120px;margin-right: -5px">
								<el-option v-if="!goodsTypeFlag" v-for="item in goodsTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                <el-option v-if="goodsTypeFlag" v-for="item in goodsTypes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
        	<el-form-item label="" label-width="20px">
        		<el-checkbox v-model="query.isAllUserFlag" >全部客户</el-checkbox>
        	</el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="90px">
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary"
						 size="small" v-on:click="setting">设置</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary"
						 size="small" v-on:click="exportExcelList">导出</el-button>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row v-show="showFlag">
        <el-col class="elementWidth">
        	<el-form-item label-width="10px">
        		<el-input style="width:510px;">
        			<template slot="prepend">分公司&emsp;</template>
        			<el-select slot="suffix" v-model="query.otherOrg" filterable placeholder="请选择"  style="width: 442px;margin-right: -5px">
        				<el-option v-for="item in otherOrgs" :key="item.orgId" :label="item.orgName" :value="item.orgId">
        				</el-option>
        			</el-select>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      </div>
		</el-form>
		<el-table v-loading="loading" :data="data" border ref="table" stripe class="table_settle" highlight-current-row
		 :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth"  :max-height="tableH">
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.prop=='order_count'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"
				 :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClickOrderCount(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
          </template>
				</el-table-column>
        <el-table-column v-else-if="item.prop=='order_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"
         :sortable="item.sortable">
        <!-- 	<template slot-scope="scope">
        		<a href="javascript:void(0)" @click="cellClickOrderCode(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
        	</template> -->
        </el-table-column>
        <el-table-column v-else-if="item.prop=='order_count_year'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"
         :sortable="item.sortable">
        	<template slot-scope="scope">
        		<a href="javascript:void(0)" @click="cellClickOrderCountYear(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
        	</template>
        </el-table-column>
        <el-table-column v-else-if="item.prop=='coop_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"
         :sortable="item.sortable">
        	<!-- <template slot-scope="scope">
        		<a href="javascript:void(0)" @click="cellClickCustomer(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
        	</template> -->
        </el-table-column>
        <el-table-column v-else-if="item.prop=='order_count_per'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="order_count_per">
        </el-table-column>
        <el-table-column v-else-if="item.prop=='plan_charge_weight_count_per'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="plan_charge_weight_count_per">
        </el-table-column>
        <el-table-column v-else-if="item.prop=='income_functional_amount_count_per'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="income_functional_amount_count_per">
        </el-table-column>
        <el-table-column v-else-if="item.prop=='gross_profit_count_per'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="gross_profit_count_per">
        </el-table-column>
        <el-table-column v-else-if="item.prop=='gross_profit_margin'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"  :sortable="item.sortable" :formatter="gross_profit_margin" >
        </el-table-column>
        <el-table-column v-else :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"
         :sortable="item.sortable" :formatter="formatter_column" header-align="center">
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
    <viewVisibleTagTI ref="addMission" v-if="viewVisibleTI" :visible.sync="viewVisibleTI" :frow="frow"></viewVisibleTagTI>
    <viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="frow"></viewVisibleTagLC>
    <viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="frow"></viewVisibleTagIO>
	</div>
</template>
<script>
	import setVisibleVue from '.././css/customerContribution/css_p_report_customer_contribution_setting.vue'
	import columns from '.././css/customerContribution/customer_contribution.json'
	import viewVisibleVueAE from '../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '../sc/si/order/main/order_view.vue'
  import viewVisibleVueTE from '../tc/te/order/main/order_view.vue'
  import viewVisibleVueTI from '../tc/ti/order/main/order_view.vue'
  import viewVisibleVueLC from '../lc/order/main/order_view.vue'
  import viewVisibleVueIO from '../io/order/main/order_view.vue'
  import showListVueView from '.././css/customerContribution/css_p_report_customer_contribution_detail.vue'
	export default {
		data() {
			return {
        tableH: "750px",
				businessCodes: [],
				/*表数据*/
				data: [],
        busFlag:true,
        goodsTypeFlag:false,
        showListView:false,
        containerMethodFlag:true,
				tableColumns: [],
				multipleSelection: [],
        containerMethods:[],
        businessProducts:[],
        otherOrgs:[],
        goodsTypes:[],
				query: {
					businessScope: 'AE',
					orderStatus: '',
					startDate: '',
          endDate:'',
          businessProduct:'',
          containerMethod:'整箱',
          countType:'开航日期',
          goodsType:'',
          isAllUserFlag:true,
          isAllUser:'',
          otherOrg:-1
				},
				setVisible: false,
				amountBillSendListVisible: false,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
        viewVisibleTE: false,
        viewVisibleTI: false,
        viewVisibleLC: false,
        viewVisibleIO: false,
				lockVisible: false,
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
      'viewVisibleTagTI': viewVisibleVueTI,
      'viewVisibleTagLC': viewVisibleVueLC,
      'viewVisibleTagIO': viewVisibleVueIO,
      'viewVisibleTagList':showListVueView
		},
		methods: {
        sortOrderCountPer(a,b){
            return parseFloat(a.order_count_per) - parseFloat(b.order_count_per)
        },
        sortPlanChargeWeightCountPer(a,b){
            return parseFloat(a.plan_charge_weight_count_per) - parseFloat(b.plan_charge_weight_count_per)
        },
        sortIncomeFunctionalAmountCountPer(a,b){
            return parseFloat(a.income_functional_amount_count_per) - parseFloat(b.income_functional_amount_count_per)
        },
        sortGrossProfitCountPer(a,b){
            return parseFloat(a.gross_profit_count_per) - parseFloat(b.gross_profit_count_per)
        },
        sortGrossProfitMargin(a,b){
            return parseFloat(a.gross_profit_margin||0) - parseFloat(b.gross_profit_margin||0)
        },
      getDateDay(theDate) {
      	let _year = theDate.getFullYear();
      	let _month = theDate.getMonth();
        if (_month === 0) {
            _year = parseInt(_year) - 1;
            _month = 12;
        }
      	if (_month < 10) {
      		_month = "0" + _month;
      	}
      	return _year + "-" + _month + "-01";
      },
      getDateInfo(theDate) {
      	let _year = theDate.getFullYear();
      	let _month = theDate.getMonth();
        let _day = theDate.getDate();
      	_month = _month + 1;
      	if (_month < 10) {
      		_month = "0" + _month;
      	}
        if(_day<10){
          _day = "0"+_day;
        }
      	return _year + "-" + _month +"-"+_day;
      },
      businessScopeChange() {
        if(this.query.businessScope=='AE'){
           this.busFlag=true;
        }else{
          this.busFlag=false;
        }
        if(this.query.countType&&this.query.countType!='财务日期'){
           if(this.query.businessScope=='AE'||this.query.businessScope=='SE'){
              this.query.countType = '开航日期'
           }
           if(this.query.businessScope=='AI'||this.query.businessScope=='SI'){
             this.query.countType = '到港日期'
           }
           if(this.query.businessScope=='TE'){
             this.query.countType = '发车日期'
           }
           if(this.query.businessScope=='TI'){
             this.query.countType = '到达日期'
           }
           if(this.query.businessScope=='LC'){
             this.query.countType = '用车日期'
           }
           if(this.query.businessScope=='IO'){
             this.query.countType = '业务日期'
           }
        }

        if(this.query.businessScope.startsWith('A')){
            //货物类型
            this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
              this.goodsTypes = response.data.data;
              this.goodsType = '';
            }.bind(this));
            this.goodsTypeFlag = false;
            this.containerMethodFlag = true;
        }
        if(this.query.businessScope.startsWith('S')){
          	this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
          				this.goodsTypes = response.data.data;
                  this.goodsType = '';
          	});
            this.goodsTypeFlag = true;
            if(this.query.containerMethod=='整箱'){
              this.containerMethodFlag = true;
            }else{
              this.containerMethodFlag = false;
            }
        }
        if(this.query.businessScope.startsWith('L')){
          	this.$axios.get('/sc/vLcCategory/货物类型').then((response) => {
          				this.goodsTypes = response.data.data;
                  this.goodsType = '';
          	});
           this.goodsTypeFlag = true;
           this.containerMethodFlag = false;
        }
        if (this.query.businessScope=='IO') {
        	this.$axios.get('/sc/vIoCategory/货物类型').then((response) => {
        		this.goodsTypes = response.data.data;
        		this.goodsType = '';
        	});
        	this.goodsTypeFlag = true;
          this.containerMethodFlag = false;
        }
        if(this.query.businessScope.startsWith('T')){
            this.$axios.get('/sc/tcCategory/装箱方式').then((response) => {
              this.containerMethods = response.data.data;
            })
          	this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
          				this.goodsTypes = response.data.data;
                  this.goodsType = '';
          	});
            this.goodsTypeFlag = true;
            if(this.query.containerMethod=='整箱'){
              this.containerMethodFlag = true;
            }else{
              this.containerMethodFlag = false;
            }
        }

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
					localStorage.setItem(userId + '_customer_contribution_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.frow.businessScope = this.query.businessScope;
        this.frow.containerMethod = this.query.containerMethod;
				this.setVisible = true;
			},
			//标题样式
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
					return ""
			},
			addCellStayle(data) {
        	let k = '';
          if(data.column.property === "coop_code"&&data.row.order_count==0){
            k = "color:red;"
          }else if(data.column.property === "coop_name"&&data.row.order_count==0){
            k = "color:red;"
          }
          return k;
			},
      order_count_per(row){
        if(row.order_count_per){
          return row.order_count_per+'%';
        }else{
			row.order_count_per = 0;
          return 0+'%';
        }
      },
      plan_charge_weight_count_per(row){
        if(row.plan_charge_weight_count_per){
          return row.plan_charge_weight_count_per+'%';
        }else{
			row.plan_charge_weight_count_per = 0;
          return 0+'%';
        }
      },
      income_functional_amount_count_per(row){
        if(row.income_functional_amount_count_per){
          return row.income_functional_amount_count_per+'%';
        }else{
			row.income_functional_amount_count_per = 0;
          return 0+'%';
        }
      },
      gross_profit_count_per(row){
        if(row.gross_profit_count_per){
          return row.gross_profit_count_per+'%';
        }else{
			row.gross_profit_count_per = 0;
          return 0+'%';
        }
      },
      gross_profit_margin(row){
        if(row.gross_profit_margin){
          return row.gross_profit_margin+'%';
        }else{
			row.gross_profit_margin = 0;
          return 0+'%';
        }
      },
			formatter_column(row, column) {
        if(column.property=='plan_charge_weight_count'||column.property=='income_functional_amount_count'||column.property=='gross_profit_count'
        ||column.property=='unit_gross_profit'||column.property=='order_count_year'||column.property=='plan_charge_weight_count_year'||column.property=='gross_profit_year'
        ){
          if(row[column.property]){
            return  row[column.property].toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
          }else{
            return 0;
          }
        }else{
          return  row[column.property];
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
            if(column.prop == 'plan_charge_weight_count'){
              if ( this.query.businessScope.startsWith('S')||this.query.businessScope.startsWith('T')) {
                if(this.query.containerMethod!='整箱'){
                  column.label = '计费吨';
                }else{
                  column.label = '箱量';
                }
              } else{
                column.label = '计重';
              }
            }
            if(column.prop == 'plan_charge_weight_count_per'){
              if ( this.query.businessScope.startsWith('S')||this.query.businessScope.startsWith('T')) {
                  if(this.query.containerMethod!='整箱'){
                    column.label = '计费吨占比';
                  }else{
                    column.label = '箱量占比';
                  }
              } else{
                 column.label = '计重占比';
              }
            }
            if(column.prop == 'plan_charge_weight_count_year'){
              if ( this.query.businessScope.startsWith('S')||this.query.businessScope.startsWith('T')) {
                  if(this.query.containerMethod!='整箱'){
                     column.label = '年度合作计费吨';
                  }else{
                     column.label = '年度合作箱量';
                  }
              } else{
                column.label = '年度合作计重'
              }
            }
					})
				} catch (e) {}
			},
			handleChange(command) {
				this.frow = command
			},
			handleCommand(command) {
			},
      showFlagSearch() {
      	this.showFlag = !this.showFlag;
      	this.setHeight();
      },
      setHeight() {
      	this.$nextTick(() => {
      		let customer_header = this.$refs.customer_header.offsetHeight;
      		let heightS = window.innerHeight - 92 - customer_header;
      		this.tableH = heightS + "px";
      	});
      },

			findByPage() {
        if(!this.query.startDate||!this.query.endDate){
            this.openError("统计周期起止时间不能为空");
            return false;
        }
        if(this.query.businessScope.startsWith('S')&&!this.query.containerMethod){
            this.openError("海运查询装箱方式不能为空");
            return false;
        }
        this.setHeight();
        //从数据库查询设置信息
        let pageName = '报表统计分析/客户贡献度分析';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_list_column = response.data.data;
                if(af_list_column && af_list_column.length>0){
                    this.tableColumns = this.sortBykey(af_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
                this.setLabel(this.tableColumns)
                this.loading = true
                if(this.query.isAllUserFlag){
                    this.query.isAllUser = '否';
                }else{
                    this.query.isAllUser = '是';

                }
                let url = "";
                if(this.query.businessScope.startsWith('A')){
                    url = "/afbase/customerContribution/af?"
                }else{
                    url = "/afbase/customerContribution/sc?"
                }
                this.$axios.get2(url,
                    this.query)
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

/*				let userId = window.localStorage.getItem('userId');
				let list_column = window.localStorage.getItem(userId + '_customer_contribution_list_column');
				if (list_column) {
					let arrayC = JSON.parse(list_column)
					if (arrayC && arrayC.length > 0) {
						this.tableColumns = this.sortBykey(arrayC, 'index');
					}
				} else {
					this.tableColumns = this.sortBykey(columns.info, 'index');
				}
				this.setLabel(this.tableColumns)
				this.loading = true
        if(this.query.isAllUserFlag){
           this.query.isAllUser = '否';
        }else{
          this.query.isAllUser = '是';

        }
        let url = "";
        if(this.query.businessScope.startsWith('A')){
             url = "/afbase/customerContribution/af?"
        }
        if(this.query.businessScope.startsWith('S')){
             url = "/afbase/customerContribution/sc?"
        }
				this.$axios.get2(url,
						this.query)
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
					})*/
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
					let excelList = this.sortBykey(columns.info, 'index');
          this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				this.$axios.post3('/afbase/customerContribution/exportExcel', this.query)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '客户贡献度' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});
        this.query.columnStrs ="";
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
			cellClickOrderCount(row) {
				this.showViewOrderCount(row)
			},
      cellClickOrderCountYear(row) {
      	this.showViewOrderCountYear(row)
      },
      cellClickCustomer(row){
        this.frow = this.query;
        this.frow.endDateType = 'DAY';
        this.frow.coopId = row.coop_id;
        this.frow.customerName = row.coop_name;
        this.jumpToNewPage('view', this.frow, '/customer_info')
      },
      cellClickOrderCode(row) {
        let a={
           orderCode:row.order_code
        }
        if(this.query.businessScope=='SE'){
          this.$axios.get2("/sc/scOrder/se?size=" + 10 + "&current=" + 1, a)
          	.then(function(response) {
          		row.orderUuid = response.data.data.records[0].orderUuid;
          	  row.orderId = response.data.data.records[0].orderId;
              row.businessScope = row.business_scope;
              this.showView(row)
          	}.bind(this));
        }
        if(this.query.businessScope=='SI'){
          this.$axios.get2("/sc/scOrder/si?size=" + 10 + "&current=" + 1, a)
          	.then(function(response) {
          		row.orderUuid = response.data.data.records[0].orderUuid;
          	  row.orderId = response.data.data.records[0].orderId;
              row.businessScope = row.business_scope;
              this.showView(row)
          	}.bind(this));
        }
        if(this.query.businessScope=='TE'){
          this.$axios.get2("/sc/tcOrder/te/page?size=" + 10 + "&current=" + 1, a)
          	.then(function(response) {
          		row.orderUuid = response.data.data.records[0].orderUuid;
          	  row.orderId = response.data.data.records[0].orderId;
              row.businessScope = row.business_scope;
              this.showView(row)
          	}.bind(this));
        }
        if(this.query.businessScope=='TI'){
            this.$axios.get2("/sc/tcOrder/te/page?size=" + 10 + "&current=" + 1, a)
                .then(function(response) {
                    row.orderUuid = response.data.data.records[0].orderUuid;
                    row.orderId = response.data.data.records[0].orderId;
                    row.businessScope = row.business_scope;
                    this.showView(row)
                }.bind(this));
        }
        if(this.query.businessScope=='LC'){
          this.$axios.get2("/sc/lcOrder?size=" + 10 + "&current=" + 1, a)
          	.then(function(response) {
          		row.orderUuid = response.data.data.records[0].orderUuid;
          	  row.orderId = response.data.data.records[0].orderId;
              row.businessScope = row.business_scope;
              this.showView(row)
          	}.bind(this));
        }
        if (this.query.businessScope == 'IO') {
        	this.$axios.get2("/sc/ioOrder?size=" + 10 + "&current=" + 1, a)
        		.then(function(response) {
        			row.orderUuid = response.data.data.records[0].orderUuid;
        			row.orderId = response.data.data.records[0].orderId;
              row.businessScope = row.business_scope;
        			this.showView(row)
        		}.bind(this));
        }
        if(this.query.businessScope.startsWith('A')){
         this.$axios.get2("/afbase/aforder/page?size=" + 10 + "&current=" + 1, a)
         	.then(function(response) {
         		row.orderUuid = response.data.data.records[0].orderUuid;
         	  row.orderId = response.data.data.records[0].orderId;
             row.businessScope = row.business_scope;
             this.showView(row)
         	}.bind(this));
        }


      },
      showViewOrderCount(row){
        this.frow = this.query;
        this.frow.coopId = row.coop_id;
        this.frow.endDateType = 'DAY';
        this.frow.otherOrg = this.query.otherOrg;
        this.frow.otherOrgFlag = true;
        this.showListView = true;
      },
      showViewOrderCountYear(row){
        this.frow = this.query;
        this.frow.coopId = row.coop_id;
        this.frow.endDateType = 'YEAR';
        this.showListView = true;
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
        if (row.businessScope === 'TI') {
            this.frow.activeName = "first";
            if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
                this.frow.ifFullscreen = true
                this.jumpToNewPage('view', this.frow, '/ti_order')
            } else {
                this.frow.ifFullscreen = false
                this.viewVisibleTI = true;
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
        this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
        	this.businessProducts = response.data.data;
        }.bind(this));
        //装箱方式
        this.$axios.get('/sc/vScCategory/装箱方式').then((response) => {
        	this.containerMethods = response.data.data;
        	// if (this.containerMethods.length != 0) {
        	// 	this.query.containerMethod = '整箱'
        	// }
        })
        this.businessScopeChange();
        if(this.$route.query.o){
          this.findByPage();
        }
			}

		},
		created() {
      let param ={
         checkJt:'jt'
      }
      //分公司集合
      this.$axios.get2('/hrs/org/getOrgChild',param).then((response) => {
      	  if(response.data.data&&response.data.data.length>0){
            this.otherOrgs=response.data.data;
            this.otherOrgs.unshift(
            {
              orgId:-1,
              orgName:'全部'
            }
            );
          }else{
             this.otherOrgs.unshift(
             {
               orgId:-1,
               orgName:'全部'
             }
             );
          }
      })
      let a = this.$route.query.o;
      if(a){
        let b = JSON.parse(this.base64Decode(a));
        // console.log(b)
        if(b.orderStatus&&b.orderStatus=='财务锁账'){
          this.query.orderStatus = '是';
        }
        if(b.orderStatus&&b.orderStatus=='未锁账'){
          this.query.orderStatus = '否';
        }
        // this.query.orderStatus=b.orderStatus;
        this.query.businessProduct=b.businessProduct;
        if(b.containerMethod){
          this.query.containerMethod=b.containerMethod;
        }
        this.query.countType=b.countType;
        this.query.businessScope=b.businessScope;
        this.query.startDate=b.startDate;
        this.query.endDate=b.endDate
      }else{
        this.query.startDate = this.getDateDay(new Date());
        this.query.endDate = this.getDateInfo(new Date());
      }

		/*	let userId = window.localStorage.getItem('userId');
			let list_column = window.localStorage.getItem(userId + '_customer_contribution_list_column');
			if (list_column) {
				let arrayC = JSON.parse(list_column)
				if (arrayC && arrayC.length > 0) {
					this.tableColumns = this.sortBykey(arrayC, 'index');
				}
			} else {
				this.tableColumns = this.sortBykey(columns.info, 'index');
			}*/
      //从数据库查询设置信息
      let pageName = '报表统计分析/客户贡献度分析';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let af_list_column = response.data.data;
              if(af_list_column && af_list_column.length>0){
                  this.tableColumns = this.sortBykey(af_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.info, 'index');
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
	.orderLockUnlockList .el-input__icon {
		line-height: 30px !important;
	}

	.orderLockUnlockList .el-form-item__content {
		line-height: 30px !important;
	}

	.orderLockUnlockList .el-input-group__prepend {
		padding: 0 6px;
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
