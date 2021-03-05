<template>
	<el-dialog :title="winTitle" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body style="top:-80px;">
		<div >
			<el-form :inline="false" :model="query" label-width="10px" class="demo-ruleForm">

				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.productName" clearable auto-complete="off" style="width: 350px;">
								<template slot="prepend">
									<span>产品名称</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item style="margin-left: 20px;margin-top: -6px;">
							<el-button type="primary" size="mini" icon="el-icon-search" @click="queryList">搜索</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table border :data="data1" stripe>
				<el-table-column prop="productName" label="产品名称" header-align="center"></el-table-column>
				<el-table-column prop="productType" label="产品类型" header-align="center"></el-table-column>
        <el-table-column prop="containerMethod" label="装箱方式" header-align="center"></el-table-column>
        <el-table-column prop="bookingAgentName" label="订舱代理" header-align="center"></el-table-column>
         <el-table-column prop="freightPrice" align="center" label="默认卖价" width="200">
           <template slot-scope="scope">
           	 <span v-if="scope.row.freightPrice!=null">{{scope.row.freightType}}:{{scope.row.freightPrice}} (<span v-if="scope.row.freightCurrecnyCode!='CNY'" style="color: red;">{{scope.row.freightCurrecnyCode}}</span>
           	<span v-else>{{scope.row.freightCurrecnyCode}}</span>)</span>
             <span else></span>
           </template>
         </el-table-column>
         <el-table-column prop="msrPrice" align="center" label="默认成本" width="200">
           <template slot-scope="scope">
           	<span v-if="scope.row.msrPrice!=null">{{scope.row.msrType}}:{{scope.row.msrPrice}} (<span v-if="scope.row.msrCurrecnyCode!='CNY'" style="color: red;">{{scope.row.msrCurrecnyCode}}</span>
           	<span v-else>{{scope.row.msrCurrecnyCode}}</span>)</span>
             <span else></span>
           </template>
         </el-table-column>
        v<el-table-column prop="departureStation" label="起运地" header-align="center"></el-table-column>
        <el-table-column prop="exitPort" :label="caliber" header-align="center"></el-table-column>
        <el-table-column prop="transitStation" label="中转地" header-align="center"></el-table-column>
        <el-table-column prop="arrivalStation" label="目的地" header-align="center"></el-table-column>
        <el-table-column prop="transitDays" align="center" label="转运天数" width="120"></el-table-column>
				<el-table-column fixed label="操作" width="80" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" v-on:click="doSelect(scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-top: 10px;">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next" :total="pageConf.totalPage">
			</el-pagination>
		</div>
	</el-dialog>
</template>
<script>
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
        caliber: '出境口岸',
        winTitle: '铁路出口订单 - 产品选择',
				loading: false,
				data1: [],
				options: [],
				options2: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
					businessScope: this.frow.businessScope
				},
				saveVisible: false
			}
		},

		inject: ['productCallBack'],
		created: function() {
      if (this.frow.businessScope == 'TI') {
        this.caliber = '进境口岸';
        this.winTitle = '铁路进口订单 - 产品选择';
      }
			this.queryList();
		},

		methods: {
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			doSelect(row) {
				this.productCallBack(row);
				this.handleClose();
			},
			queryList() {
        this.$axios.get2("/sc/tcProduct/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if(this.data1.length == 0) {
						let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
						this.queryList2(current);
					}
				}).catch((error) => {
					console.log(error);
				});

			},
			queryList2(current) {
        this.$axios.get2("/sc/tcProduct/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
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
			formatter1(row, column) {
				return row.awbFromType + ' - ' + row.awbFromName;
			},
			formatter2(row, column) {
				if(row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
/* 	.carrierSelectPage .el-form-item__content {
		line-height: 30px !important;
	} */
</style>
