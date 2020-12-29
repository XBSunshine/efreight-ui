<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.productCode" auto-complete="off" clearable style="width:206px;">
							<template slot="prepend">商品编码</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.productName" auto-complete="off" clearable style="width:206px;">
							<template slot="prepend">商品名称</template>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item label-width="10px">

						<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>



					</el-form-item>
				</el-col>

			</el-row>

		</el-form>

          <el-row style="margin-top: 8px;">
		<el-table v-loading="loading" :data="data1" border  ref="table" >

			<el-table-column align="center" label="商品编码" width="120">
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.productCode}}</a>
				</template>
			</el-table-column>
			<el-table-column align="left" prop="productName" label="商品名称" width="310" header-align="center"></el-table-column>
			<el-table-column align="center" prop="legalFirstUnit" label="计量单位" width="310" :formatter="formatterLegalFirstUnit"></el-table-column>
			<el-table-column align="center" prop="exportRebateRate" label="出口退税税率" width="120"></el-table-column>
			<el-table-column align="center" prop="regulatoryCondition" label="监管条件" width="160"></el-table-column>
			<el-table-column align="center" prop="testCategory" label="检验检疫类别" width="160"></el-table-column>
			<el-table-column align="center"  label="更多信息" width="100">
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">详情</a>
				</template>
			</el-table-column>

		</el-table>
		</el-row>
		<div class="pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    	<viewVisible ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewVisible>
	</div>
</template>
<script>
	import viewVisible from './af_tariff_details_view'
	export default {
		data() {
			return {
				viewVisible: false,
				frow: {},
				/*表数据*/
				data1: [],

				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					productCode: '',
					productName: ''
				},
				loading: false,
			}
		},
		components: {
			'viewVisible': viewVisible

		},
		methods: {



			findByPage() {
				if(this.query.productCode || this.query.productName) {

				} else {
					this.openError("请选择查询项");
					this.data1 = [];
					return;
				}

				this.loading = true
				this.$axios.get2("/afbase/tariff/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if (this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));

			},
			findByPage2(current) {
				this.$axios.get2("/afbase/tariff/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			inboundSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError1(info) {
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
			formatterLegalFirstUnit(row, column) {
		         let unitStr=row.legalFirstUnitCode+' '+row.legalFirstUnit;
		         if (row.secondUnit && row.secondUnit!='无') {
		         	unitStr=unitStr+' / '+row.secondUnitCode+' '+row.secondUnit
		         }
		         return unitStr
		    },
			cellClick(row,label){
				this.frow=row;
				this.viewVisible=true;
			},

		},
		created() {

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

  .awbNumber {
    text-decoration: underline;
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
