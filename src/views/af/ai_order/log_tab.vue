<template>
	<div>
		<el-form :model="query" class="logTab">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="logName" label-width="6px">
						<el-input v-model="query.logName" style="width:180px;margin-right: 15px;" auto-complete="off" clearable>
							<template slot="prepend">
								<span>日志</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="creatorName" label-width="6px">
						<el-input v-model="query.creatorName" style="width:180px;margin-right: 15px;" auto-complete="off" clearable>
							<template slot="prepend">
								<span>操作人</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="6px">
						<el-input style="width:210px;">
							<template slot="prepend">操作日期</template>
							<el-date-picker slot="suffix" v-model="query.operationTimeStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.operationTimeEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item style="margin-left: 50px;">
						<el-button size="small" type="primary" v-on:click="queryLogList">查询</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="logInfo.data" border>
			<!--<el-table-column prop="awbNumber" label="主单号" width="120" align="center"></el-table-column>-->
			<el-table-column prop="orderNumber" label="订单号" width="130" align="center"></el-table-column>
			<!-- <el-table-column prop="projectName" label="客户项目" width="100" align="center"></el-table-column> -->
			<!--<el-table-column prop="logType" label="日志分类" width="85" align="center"></el-table-column>
			<el-table-column prop="nodeName" label="操作节点" width="85" align="center"></el-table-column>-->
			<el-table-column prop="pageName" label="操作页面" width="85" align="center"></el-table-column>
			<el-table-column prop="pageFunction" label="操作功能" width="85" align="center"></el-table-column>
			<el-table-column prop="logRemark" label="日志明细" min-width="300" align="center">
				<template slot-scope="scope">
					<p v-for="(item,index) in (scope.row.logRemark?scope.row.logRemark.split('  '):[])" :key="index">
						<font>{{item}}</font>
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="creatorName" label="操作人" width="120" align="center" :formatter="formatter_creatorName"></el-table-column>
			<el-table-column prop="creatTime" label="操作时间" width="155" align="center"></el-table-column>
		</el-table>
		<div class="pagination" style="width: 100%;margin-bottom: 20px;">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
	</div>

</template>
<style>
	.el-table .warning-row2 {
		background: oldlace;
		color: #409EFF;
		font-weight: bold !important;
	}

	.el-table .warning-row1 {
		background: oldlace;
		font-weight: bold !important;
	}

	.el-table .warning-row0 {
		color: #409EFF;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}

	.logTab .el-input__icon {
		line-height: 30px !important;
	}

	.logTab .el-form-item__content {
		line-height: 30px !important;
	}

	.logTab .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
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

				//日志开始-----
				logInfo: {
					data: []
				},
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 30] //分页选项
				},
				query: {
					businessScope: '',
					orderId: this.frow.orderId,
					orderNumber: '',
					logName: '',
					creatorName: '',
					operationTimeStart: '',
					operationTimeEnd: '',
				},
				//日志结束-----


			};
		},

		methods: {
			//日志开始
			queryLogList() {
				this.query.businessScope = this.frow.businessScope;
				this.query.orderNumber = this.frow.orderCode;
				if (this.frow.businessScope == 'LC') {
					this.$axios.get2('/sc/lcLog?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
						.then(function(response) {
							this.logInfo.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						}.bind(this));
				}else if (this.frow.businessScope == 'IO') {
					this.$axios.get2('/sc/ioLog?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
						.then(function(response) {
							this.logInfo.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						}.bind(this));
				}  else if (this.frow.businessScope == 'VL') {
					this.$axios.get2('/sc/vlLog?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
						.then(function(response) {
							this.logInfo.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						}.bind(this));
				} else {
					this.$axios.get2('/afbase/log?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
						.then(function(response) {
							this.logInfo.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						}.bind(this));
				}
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryLogList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryLogList();
			},
			formatter_creatorName(row, column) {
				return row.creatorName.split(' ')[0];
			}
			//日志结束
		},
		created() {

			//日志开始
			this.queryLogList();
			//日志结束

			if(this.frow.updateLogTab){
				this.frow.updateLogTab=false
			}
		}
	}
</script>
