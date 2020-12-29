<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="demo-ruleForm">
       <div ref="cssIncomeNodebitnote_header">
			<el-row class="cssIncomeNodebitnoteListPage">
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:150px;">
							<template slot="prepend">业务范畴</template>

							<el-select slot="suffix" v-model="query.businessScope"  @change="businessScopeChange" filterable placeholder="请选择" style="width: 81px;margin-right: -5px;">
								<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.awbNumber" auto-complete="off" clearable style="width:210px;">
							<template v-if="awbNumberFlag" slot="prepend">主运单号</template>
              <template v-if="!awbNumberFlag" slot="prepend">客户单号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input class="widthWithThree" v-model="query.orderCode" auto-complete="off" clearable style="width:210px;" @input="query.orderCode=query.orderCode.toUpperCase()">
							<template slot="prepend">订单号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input style="width:210px;">
							<template slot="prepend" v-if="query.businessScope === 'AE' || query.businessScope === 'SE'">离港日期</template>
							<template slot="prepend" v-if="query.businessScope.endsWith('I')">到港日期</template>
              <template slot="prepend" v-if="query.businessScope.endsWith('C')">用车日期</template>
              <template slot="prepend" v-if="query.businessScope === 'TE'">发车日期</template>
              <template slot="prepend" v-if="query.businessScope === 'IO'">业务日期</template>
							<el-date-picker slot="suffix" v-model="query.flightDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.flightDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						<el-button type="primary" size="small" v-on:click="exportExcelList" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF">导出</el-button>
            <el-button type="primary" size="small" v-on:click="setting" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF">设置</el-button>
					</el-form-item>
				</el-col>
			</el-row>
      </div>
		</el-form>
		<el-table border v-loading="loading" :data="data" stripe :max-height="tableHeight" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
      <template v-for="(item,index) in tableColumns">
        <el-table-column v-if="item.label!='订单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
        </el-table-column>
        <el-table-column v-else :key="index" :label="item.label" :prop="item.prop" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
          </template>
        </el-table-column>
      </template>
			<!--<el-table-column align="center" prop="businessScope" label="业务范畴" width="80"></el-table-column>
			<el-table-column align="center" prop="awbNumber" label="主单号" width="130"></el-table-column>
			<el-table-column align="center" label="订单号" width="125">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.orderCode}}</a>
        </template>
			</el-table-column>
			<el-table-column align="center" prop="flightDate" label="离港日期" width="100" v-if="businessScope.endsWith('E')"></el-table-column>
			<el-table-column align="center" prop="flightDate" label="到港日期" width="100" v-if="businessScope.endsWith('I')"></el-table-column>
      <el-table-column align="center" prop="flightDate" label="用车日期" width="100" v-if="businessScope.endsWith('C')"></el-table-column>
			<el-table-column header-align="center" align="left" prop="orderCustomerName" label="客户名称" width="250"></el-table-column>
			<el-table-column header-align="center" align="left" prop="salesName" label="责任销售" width="120" :formatter="slipName"></el-table-column>
			<el-table-column header-align="center" align="left" prop="servicerName" label="责任客服" width="120" :formatter="slipName"></el-table-column>
			<el-table-column header-align="center" align="left" prop="customerName" label="收款客户" width="250"></el-table-column>
			<el-table-column header-align="center" align="left" prop="serviceName" label="应收费用项目" width="200"></el-table-column>
			<el-table-column header-align="center" align="right" prop="incomeAmountStr" label="应收金额" width="150">
				<template slot-scope="scope">
					<span style="color: red;" v-if="scope.row.incomeAmountStr.indexOf('CNY')==-1">{{scope.row.incomeAmountStr}}</span>
					<span v-else>{{scope.row.incomeAmountStr}}</span>
				</template>
			</el-table-column>-->
		</el-table>
		<div class="pagination" ref="cssIncomeNodebitnote_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="frow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="frow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="frow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="frow"></viewVisibleTagSI>
    <viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="frow"></viewVisibleTagTE>
    <viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="frow"></viewVisibleTagLC>
    <viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="frow"></viewVisibleTagIO>
    <viewVisibleTagSEForView ref="addMission" v-if="viewVisibleSEForView" :visible.sync="viewVisibleSEForView" :frow="frow"></viewVisibleTagSEForView>
    <viewVisibleTagSIForView ref="addMission" v-if="viewVisibleSIForView" :visible.sync="viewVisibleSIForView" :frow="frow"></viewVisibleTagSIForView>
    <viewVisibleTagTEForView ref="addMission" v-if="viewVisibleTEForView" :visible.sync="viewVisibleTEForView" :frow="frow"></viewVisibleTagTEForView>
    <viewVisibleTagLCForView ref="addMission" v-if="viewVisibleLCForView" :visible.sync="viewVisibleLCForView" :frow="frow"></viewVisibleTagLCForView>
    <viewVisibleTagIOForView ref="addMission" v-if="viewVisibleIOForView" :visible.sync="viewVisibleIOForView" :frow="frow"></viewVisibleTagIOForView>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
	</div>
</template>
<script>
  import setVisibleVue from './cssIncomeNodebitnote/css_income_nodebitnote_setting.vue'
  import columns from './cssIncomeNodebitnote/css_income_nodebitnote.json'
	import viewVisibleVueAE from '../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../sc/se/order/main/order_edit.vue'
	import viewVisibleVueSI from '../sc/si/order/main/order_edit.vue'
  import viewVisibleVueTE from '../tc/te/order/main/order_edit.vue'
  import viewVisibleVueLC from '../lc/order/main/order_edit.vue'
  import viewVisibleVueIO from '../io/order/main/order_edit.vue'

  import viewVisibleVueSEForView from '../sc/se/order/main/order_view.vue'
  import viewVisibleVueSIForView from '../sc/si/order/main/order_view.vue'
  import viewVisibleVueTEForView from '../tc/te/order/main/order_view.vue'
  import viewVisibleVueLCForView from '../lc/order/main/order_view.vue'
  import viewVisibleVueIOForView from '../io/order/main/order_view.vue'
	export default {
		data() {
			return {
        tableHeight: '550px',
				/*表数据*/
				data: [],
        tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
					businessScope: 'AE',
					orderCode: '',
					awbNumber: '',
					flightDateStart: this.getDateTime('start'),
					flightDateEnd: this.getDateTime('end'),
          columnStrs: '',
				},
				businessScope: 'AE',
				businessCodes: [],
				loading: false,
				frow: '',
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
        viewVisibleTE: false,
        setVisible: false,
        viewVisibleLC: false,
        viewVisibleIO: false,
        awbNumberFlag:true,
        viewVisibleSEForView: false,
        viewVisibleSIForView: false,
        viewVisibleTEForView: false,
        viewVisibleLCForView: false,
        viewVisibleIOForView: false
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
      'viewVisibleTagSEForView': viewVisibleVueSEForView,
      'viewVisibleTagSIForView': viewVisibleVueSIForView,
      'viewVisibleTagTEForView': viewVisibleVueTEForView,
      'viewVisibleTagLCForView': viewVisibleVueLCForView,
      'viewVisibleTagIOForView': viewVisibleVueIOForView,
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		created() {
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;

			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			let orgVersion = window.localStorage.getItem('orgVersion')
			if (orgVersion) {
				if (orgVersion != "专业版" && orgVersion != "试用版") {
					this.columnFlag = true;
				}
			}
      //从数据库查询设置信息
      let pageName = '财务结算管理/未出账单查询';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let af_list_column = response.data.data;
              if(af_list_column && af_list_column.length>0){
                  let arrayC = af_list_column
                  if (arrayC && arrayC.length > 0) {
                    let indexDelete = [];
                      for (let i = 0; i < arrayC.length; i++) {
                          if (this.query.businessScope.endsWith('E') && arrayC[i].prop === 'flightDate') {
                            if(this.query.businessScope.startsWith('T')){
                              arrayC[i].label = "发车日期";
                            }else{
                              arrayC[i].label = "离港日期";
                            }
                          }
                          if (this.query.businessScope.endsWith('I') && arrayC[i].prop === 'flightDate') {
                              arrayC[i].label = "到港日期";
                          }
                          if (this.query.businessScope.endsWith('C') && arrayC[i].prop === 'flightDate') {
                              arrayC[i].label = "用车日期";
                          }
                          if(arrayC[i].prop == 'awbNumber'){
                              arrayC[i].label = '主单号';
                             if(this.query.businessScope=='LC'){
                               indexDelete.push(i);
                             }
                          }
                      }
                      if(indexDelete.length>0){
                         indexDelete.sort(function(a,b){
                           return a-b;
                         });
                         for(let i = 0; i < indexDelete.length; i++){
                           this.$delete(arrayC,indexDelete[i]-i);
                         }
                      }
                      this.tableColumns = this.sortBykey(arrayC, 'index');
                  }
              }else{
                  let indexDelete = [];
                  let str = JSON.stringify(columns.info);
                  this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
                  for (let i = 0; i < this.tableColumns.length; i++) {
                      if (this.query.businessScope.endsWith('E') && this.tableColumns[i].prop === 'flightDate') {
                        if(this.query.businessScope.startsWith('T')){
                           this.tableColumns[i].label = "发车日期";
                         }else{
                            this.tableColumns[i].label = "离港日期";
                         }

                      }
                      if (this.query.businessScope.endsWith('I') && this.tableColumns[i].prop === 'flightDate') {
                          this.tableColumns[i].label = "到港日期";
                      }
                      if (this.query.businessScope.endsWith('C') && this.tableColumns[i].prop === 'flightDate') {
                          this.tableColumns[i].label = "用车日期";
                      }
                      if(this.tableColumns[i].prop == 'awbNumber'){
                        this.tableColumns[i].label = '主单号';
                        if(this.query.businessScope=='LC'){
                           indexDelete.push(i);
                         }
                      }
                  }
                  if(indexDelete.length>0){
                     indexDelete.sort(function(a,b){
                       return a-b;
                     });
                     for(let i = 0; i < indexDelete.length; i++){
                       this.$delete(this.tableColumns,indexDelete[i]-i);
                     }
                  }
              }
          }.bind(this));
		},
    mounted() {
      this.setHeight();
    },
		methods: {
      businessScopeChange(){
        if(this.query.businessScope=='LC' || this.query.businessScope=='IO'){
           this.awbNumberFlag = false;
        }else{
          this.awbNumberFlag = true;
        }
      },
      // showFlagSearch(){
      //    this.showFlag = !this.showFlag;
      //    // this.$refs.table.doLayout();
      //    this.setHeight();
      // },
      setting() {
          this.setVisible = true;
      },
      setHeight(){
         this.$nextTick(()=>{
           let cssIncomeNodebitnote_header = this.$refs.cssIncomeNodebitnote_header.offsetHeight;
           let cssIncomeNodebitnote_footer = this.$refs.cssIncomeNodebitnote_footer.offsetHeight;
           let heightS =  window.innerHeight-90-cssIncomeNodebitnote_header-cssIncomeNodebitnote_footer;
           this.tableHeight = heightS+"px";
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
              if (data.row.incomeAmountStr.indexOf('CNY')==-1) {
                  k = "color:red;"
              } else {
                  k = "color:#606266;"
              }
              return k;
          } else {
              return "";
          }
      },
      formatter_column(row, column) {
          if (column.property === "businessScope") {
              return row.businessScope;
          }
          if (column.property === "awbNumber") {
              return row.awbNumber;
          }
          if (column.property === "orderCode") {
              return row.orderCode;
          }
          if (column.property === "flightDate") {
              return row.flightDate;
          }
          if (column.property === "orderCustomerName") {
              return row.orderCustomerName;
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
          if (column.property === "customerName") {
              return row.customerName;
          }
          if (column.property === "serviceName") {
              return row.serviceName;
          }
          if (column.property === "incomeAmountStr") {
              return row.incomeAmountStr;
          }
      },
      sortBykey(ary, key) {
          return ary.sort(function(a, b) {
              let x = a[key]
              let y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
          })
      },
      slipName(row, column, cellValue, index){
         if(column.property=='salesName'){
            if(row['salesName']){
               return row['salesName'].split(' ')[0];
            }else{
              return '';
            }
         }else if(column.property=='servicerName'){
           if(row['servicerName']){
              return row['servicerName'].split(' ')[0];
           }else{
             return '';
           }
         }else{
           return '';
         }
      },
			findByPage() {
        this.setHeight();
        //从数据库查询设置信息
        let pageName = '财务结算管理/未出账单查询';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_list_column = response.data.data;
                if(af_list_column && af_list_column.length>0){
                    let arrayC = af_list_column
                    if (arrayC && arrayC.length > 0) {
                      let indexDelete = [];
                        for (let i = 0; i < arrayC.length; i++) {
                            if (this.query.businessScope.endsWith('E') && arrayC[i].prop === 'flightDate') {
                              if(this.query.businessScope.startsWith('T')){
                                arrayC[i].label = "发车日期";
                              }else{
                                arrayC[i].label = "离港日期";
                              }
                            }
                            if (this.query.businessScope.endsWith('I') && arrayC[i].prop === 'flightDate') {
                                arrayC[i].label = "到港日期";
                            }
                            if (this.query.businessScope.endsWith('C') && arrayC[i].prop === 'flightDate') {
                                arrayC[i].label = "用车日期";
                            }
                            if("IO" === this.query.businessScope){
                              if(arrayC[i].prop === 'flightDate'){
                                arrayC[i].label = "业务日期";
                              }
                              if(arrayC[i].prop === 'awbNumber'){
                                arrayC[i].label = "客户单号";
                              }
                            }else{
                              if(arrayC[i].prop === 'awbNumber'){
                                arrayC[i].label = "主单号";
                              }
                            }

                        if(arrayC[i].prop == 'awbNumber'){
                              if(this.query.businessScope=='LC'){
                                indexDelete.push(i);
                              }
                           }
                        }
                        if(indexDelete.length>0){
                           indexDelete.sort(function(a,b){
                             return a-b;
                           });
                           for(let i = 0; i < indexDelete.length; i++){
                             this.$delete(arrayC,indexDelete[i]-i);
                           }
                        }
                        this.tableColumns = this.sortBykey(arrayC, 'index');
                    }
                }else{
                    let indexDelete = [];
                    let str = JSON.stringify(columns.info);
                    this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
                    for (let i = 0; i < this.tableColumns.length; i++) {
                        if (this.query.businessScope.endsWith('E') && this.tableColumns[i].prop === 'flightDate') {
                          if(this.query.businessScope.startsWith('T')){
                             this.tableColumns[i].label = "发车日期";
                           }else{
                              this.tableColumns[i].label = "离港日期";
                           }

                        }
                        if (this.query.businessScope.endsWith('I') && this.tableColumns[i].prop === 'flightDate') {
                            this.tableColumns[i].label = "到港日期";
                        }
                        if (this.query.businessScope.endsWith('C') && this.tableColumns[i].prop === 'flightDate') {
                            this.tableColumns[i].label = "用车日期";
                        }
                        if("IO" === this.query.businessScope){
                          if(this.tableColumns[i].prop === "flightDate"){
                            this.tableColumns[i].label = "业务日期";
                          }
                          if(this.tableColumns[i].prop === "awbNumber"){
                            this.tableColumns[i].label = "客户单号";
                          }
                        }else{
                          if(this.tableColumns[i].prop === "awbNumber"){
                            this.tableColumns[i].label = "主单号";
                          }
                        }

                      if(this.tableColumns[i].prop == 'awbNumber'){
                           if(this.query.businessScope=='LC'){
                             indexDelete.push(i);
                           }
                        }
                    }
                    if(indexDelete.length>0){
                       indexDelete.sort(function(a,b){
                         return a-b;
                       });
                       for(let i = 0; i < indexDelete.length; i++){
                         this.$delete(this.tableColumns,indexDelete[i]-i);
                       }
                    }
                }
                this.businessScope = this.query.businessScope
                this.loading = true
                this.$axios.get2("/afbase/income?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
                    .then(function(response) {
                        this.data = response.data.data.records
                        this.pageConf.totalPage = response.data.data.total;
                        if (this.data.length == 0) {
                            let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                            this.findByPage2(current);
                        } else {
                            this.loading = false
                        }
                    }.bind(this)).catch((error) => {
                    this.loading = false
                });
            }.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/income?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then(function(response) {
						this.loading = false
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
      exportExcelList() {

          this.$confirm('是否根据结果字段导出数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              //从数据库查询设置信息
              let pageName = '财务结算管理/未出账单查询';
              this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
                  .then(function(response) {
                      let af_list_column = response.data.data;
                      if(af_list_column && af_list_column.length>0){
                          this.query.columnStrs = JSON.stringify(af_list_column);
                      }else{
                          this.query.columnStrs = '';
                      }
                      this.exportExcelSure();
                  }.bind(this));
          }).catch(() => {
              this.query.columnStrs = '';
              this.exportExcelSure();
          });
      },
      exportExcelSure() {
				this.$axios.post3('/afbase/income/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '未出账单应收费用明细' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			handlerCellClick(row, column, cell, event) {
				if ("订单号" == column['label']) {
					this.showView(row);
				}
			},
      cellClick(row, label){
          this.showView(row);
      },

			showView(row) {
				this.frow = row;
				if (row.businessScope === 'AE') {
          let buttonInfo = window.localStorage.getItem('buttonInfo')
          if (buttonInfo.indexOf('af-order-edit') > -1) {
              this.frow.viewFlag = true;
              this.frow.activeName = "serviceTab";
          }else{
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
          }else{
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
            }else{
                this.frow.viewFlag = false;
                this.frow.jumpToTab = "first";
            }
            if (buttonInfo.indexOf('se_order_edit') > -1) {
                this.frow.permissionButtonForEdit = true
            }else{
                this.frow.permissionButtonForEdit = false
            }
            if (buttonInfo.indexOf('se_order_service') > -1) {
                this.frow.permissionButtonForService = true
            }else{
                this.frow.permissionButtonForService = false
            }
            if (buttonInfo.indexOf('se_order_file') > -1) {
                this.frow.permissionButtonForFile = true
            }else{
                this.frow.permissionButtonForFile = false
            }
            if (buttonInfo.indexOf('se_order_log') > -1) {
                this.frow.permissionButtonForLog = true
            }else{
                this.frow.permissionButtonForLog = false
            }
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
            if (buttonInfo.indexOf('se_order_edit') > -1) {
                this.jumpToNewPage('edit', this.frow, '/se_order')
            }else{
                this.jumpToNewPage('view', this.frow, '/se_order')
            }
					} else {
						this.frow.ifFullscreen = false
            if (buttonInfo.indexOf('se_order_edit') > -1) {
                this.viewVisibleSE = true;
            }else{
                this.viewVisibleSEForView = true;
            }
					}
				}
				if (row.businessScope === 'SI') {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('si_order_edit') > -1) {
                this.frow.viewFlag = true;
                this.frow.jumpToTab = "third";
            }else{
                this.frow.viewFlag = false;
                this.frow.jumpToTab = "first";
            }
            if (buttonInfo.indexOf('si_order_edit') > -1) {
                this.frow.permissionButtonForEdit = true
            }else{
                this.frow.permissionButtonForEdit = false
            }
            if (buttonInfo.indexOf('si_order_service') > -1) {
                this.frow.permissionButtonForService = true
            }else{
                this.frow.permissionButtonForService = false
            }
            if (buttonInfo.indexOf('si_order_file') > -1) {
                this.frow.permissionButtonForFile = true
            }else{
                this.frow.permissionButtonForFile = false
            }
            if (buttonInfo.indexOf('si_order_log') > -1) {
                this.frow.permissionButtonForLog = true
            }else{
                this.frow.permissionButtonForLog = false
            }
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
            if (buttonInfo.indexOf('si_order_edit') > -1) {
                this.jumpToNewPage('edit', this.frow, '/si_order')
            }else{
                this.jumpToNewPage('view', this.frow, '/si_order')
            }
					} else {
						this.frow.ifFullscreen = false
            if (buttonInfo.indexOf('si_order_edit') > -1) {
                this.viewVisibleSI = true;
            }else{
                this.viewVisibleSIForView = true;
            }
					}
				}
        if (row.businessScope === 'TE') {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('te_order_edit') > -1) {
                this.frow.viewFlag = true;
                this.frow.jumpToTab = "third";
            }else{
                this.frow.viewFlag = false;
                this.frow.jumpToTab = "first";
            }
            if (buttonInfo.indexOf('te_order_edit') > -1) {
                this.frow.permissionButtonForEdit = true
            }else{
                this.frow.permissionButtonForEdit = false
            }
            if (buttonInfo.indexOf('te_order_service') > -1) {
                this.frow.permissionButtonForService = true
            }else{
                this.frow.permissionButtonForService = false
            }
            if (buttonInfo.indexOf('te_order_file') > -1) {
                this.frow.permissionButtonForFile = true
            }else{
                this.frow.permissionButtonForFile = false
            }
            if (buttonInfo.indexOf('te_order_log') > -1) {
                this.frow.permissionButtonForLog = true
            }else{
                this.frow.permissionButtonForLog = false
            }
        	if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
        		this.frow.ifFullscreen = true
            if (buttonInfo.indexOf('te_order_edit') > -1) {
                this.jumpToNewPage('edit', this.frow, '/te_order')
            }else{
                this.jumpToNewPage('view', this.frow, '/te_order')
            }
        	} else {
        		this.frow.ifFullscreen = false
            if (buttonInfo.indexOf('te_order_edit') > -1) {
                this.viewVisibleTE = true;
            }else{
                this.viewVisibleTEForView = true;
            }
        	}
        }
        if(row.businessScope === 'LC'){
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('lc_order_edit') > -1) {
                this.frow.viewFlag = true;
                this.frow.jumpToTab = "third";
            }else{
                this.frow.viewFlag = false;
                this.frow.jumpToTab = "first";
            }
            if (buttonInfo.indexOf('lc_order_edit') > -1) {
                this.frow.permissionButtonForEdit = true
            }else{
                this.frow.permissionButtonForEdit = false
            }
            if (buttonInfo.indexOf('lc_order_service') > -1) {
                this.frow.permissionButtonForService = true
            }else{
                this.frow.permissionButtonForService = false
            }
            if (buttonInfo.indexOf('lc_order_file') > -1) {
                this.frow.permissionButtonForFile = true
            }else{
                this.frow.permissionButtonForFile = false
            }
            if (buttonInfo.indexOf('lc_order_log') > -1) {
                this.frow.permissionButtonForLog = true
            }else{
                this.frow.permissionButtonForLog = false
            }
            if (buttonInfo.indexOf('lc_order_inbound') > -1) {
                this.frow.permissionButtonForInbound = true
            }else{
                this.frow.permissionButtonForInbound = false
            }
           if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
           	this.frow.ifFullscreen = true
             if (buttonInfo.indexOf('lc_order_edit') > -1) {
                 this.jumpToNewPage('edit', this.frow, '/lc_order')
             }else{
                 this.jumpToNewPage('view', this.frow, '/lc_order')
             }
           } else {
           	this.frow.ifFullscreen = false
             if (buttonInfo.indexOf('lc_order_edit') > -1) {
                 this.viewVisibleLC = true;
             }else{
                 this.viewVisibleLCForView = true;
             }
           }
        }

        if(row.businessScope === 'IO'){
          let buttonInfo = window.localStorage.getItem('buttonInfo')
          if (buttonInfo.indexOf('io_order_edit') > -1) {
            this.frow.viewFlag = true;
            this.frow.jumpToTab = "third";
          }else{
            this.frow.viewFlag = false;
            this.frow.jumpToTab = "first";
          }
          if (buttonInfo.indexOf('io_order_edit') > -1) {
            this.frow.permissionButtonForEdit = true
          }else{
            this.frow.permissionButtonForEdit = false
          }
          if (buttonInfo.indexOf('io_order_service') > -1) {
            this.frow.permissionButtonForService = true
          }else{
            this.frow.permissionButtonForService = false
          }
          if (buttonInfo.indexOf('io_order_file') > -1) {
            this.frow.permissionButtonForFile = true
          }else{
            this.frow.permissionButtonForFile = false
          }
          if (buttonInfo.indexOf('io_order_log') > -1) {
            this.frow.permissionButtonForLog = true
          }else{
            this.frow.permissionButtonForLog = false
          }
          if (buttonInfo.indexOf('io_order_inbound') > -1) {
            this.frow.permissionButtonForInbound = true
          }else{
            this.frow.permissionButtonForInbound = false
          }
          if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
            this.frow.ifFullscreen = true
            if (buttonInfo.indexOf('io_order_edit') > -1) {
              this.jumpToNewPage('edit', this.frow, '/io_order')
            }else{
              this.jumpToNewPage('view', this.frow, '/io_order')
            }
          } else {
            this.frow.ifFullscreen = false
            if (buttonInfo.indexOf('io_order_edit') > -1) {
              this.viewVisibleIO = true;
            }else{
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
			getDateTime(flag) {

				let theDate = new Date()
				var _year = theDate.getFullYear()
				var _month = ''
				var _date = ''
				if (flag == "start") {
					_month = theDate.getMonth()
					_date = theDate.getDate()
				} else if (flag == "end") {
					_month = theDate.getMonth() + 1
					_date = theDate.getDate() - 1
				}
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				if (flag == "start") {
					return _year + "-" + _month + "-01";
				} else if (flag == "end") {
					return _year + "-" + _month + "-" + _date
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
			}
		},

	}
</script>
<style>
	.cssIncomeNodebitnoteListPage .el-input__icon {
		line-height: 30px !important;
	}

	.cssIncomeNodebitnoteListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.cssIncomeNodebitnoteListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.cssIncomeNodebitnoteListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}
</style>
