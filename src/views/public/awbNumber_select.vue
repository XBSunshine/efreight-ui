<template>
	<el-dialog title="主单号 - 选择" width="680px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-form :inline="false" :model="query" label-width="10px" class="awbNumberSelectPage">

				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.awbNumber" auto-complete="off" clearable style="width:250px;">
								<template slot="prepend">主运单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.departureStation" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">始发港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="primary" size="mini" v-on:click="queryList" style="margin-left: 2px;">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.awbFromName" auto-complete="off" clearable style="width:470px;">
								<template slot="prepend">运单来源</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table border :data="data" stripe>
				<el-table-column prop="awbNumber" label="主运单号" width="135" align="center"></el-table-column>
				<el-table-column prop="departureStation" label="始发港" width="80" align="center"></el-table-column>
				<el-table-column prop="awbFromName" label="运单来源" header-align="center"></el-table-column>
				<el-table-column fixed label="操作" width="60" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doSelect(scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-bottom: 10px;" class="awbNumberSelectPage">
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
				loading: false,
				data: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
					awbNumber: '',
					departureStation: '',
					awbFromName: '',
					awbStatus: '未使用'
				}
			}
		},

		inject: ['awbNumberSelectCallBack'],
		created: function() {
			this.query.awbNumber = this.frow.awbNumber
			this.query.departureStation = this.frow.departureStation
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
			doSelect(rrow) {
				this.awbNumberSelectCallBack({
					awbNumber:rrow.awbNumber,
					departureStation:rrow.departureStation
				});
				this.handleClose();
			},
			queryList() {
				this.loading = true
				this.$axios.get2('/afbase/awb/page?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if(this.data.length == 0) {
						let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						this.queryList2(current);
					} else {
						this.loading = false
					}
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});

			},
			queryList2(current) {
				this.$axios.get2('/afbase/awb/page?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch((error) => {
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

			handleClose() {
				this.$emit('update:visible', false);
			}

			//--------------------- 

		}
	}
</script>
<style type="text/css">
	.awbNumberSelectPage .el-input__icon {
		line-height: 30px !important;
	}

	.awbNumberSelectPage .el-form-item__content {
		line-height: 30px !important;
	}
</style>
