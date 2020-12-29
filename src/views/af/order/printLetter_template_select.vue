<template>
	<el-dialog title="模板 - 选择" width="550px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div class="customerSelectPage">
			<el-form :inline="false" :model="query" class="demo-ruleForm">
			</el-form>
		</div>
		<div>
			<el-table border :data="data1">
				<el-table-column prop="shipperTemplateName" label="模板名称" align="center"></el-table-column>

				<el-table-column fixed label="操作" width="60" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doSelect(scope.row)">选择</el-button>

					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-bottom: 10px;">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
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
					//coopMnemonic: '',
					coopName: ''
				},
				saveVisible: false
			}
		},

		inject: ['setValue'],
		created: function() {
			this.queryList();
		},

		methods: {
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			doSelect(rrow) {
				this.setValue(rrow);
				this.handleClose();
			},
			queryList() {

				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&awbUuid=" + this.frow.awbUuid;
				let that = this;
				this.$axios.get('/afbase/operationPlan/selectTemplate?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					if(that.data1.length == 0) {
						let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
						that.queryList2(current);
					}
				}).catch(function(error) {
					console.log(error);
				});

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
            "&awbUuid=" + this.frow.awbUuid;
				let that = this;
				this.$axios.get('/afbase/operationPlan/selectTemplate?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
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
			handleClose() {
				this.$emit('update:visible', false);
			}

			//---------------------

		}
	}
</script>
<style type="text/css">
	.customerSelectPage .el-form-item__content {
		line-height: 30px !important;
	}
</style>
