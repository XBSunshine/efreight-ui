<template>
	<el-dialog title="主运单 - 日志" width="1092px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-form :inline="false" :model="query">
			</el-form>
		</div>
		<div>
			<el-table border :data="data1">
				<el-table-column prop="pageName" label="操作页面" align="center" width="90px"></el-table-column>
        <el-table-column prop="pageFunction" label="操作功能" align="center" width="80px"></el-table-column>
        <el-table-column prop="logRemark" label="日志明细" align="center" width="500px"></el-table-column>
        <el-table-column prop="creatorName" label="操作人" align="center" width="250px"></el-table-column>
        <el-table-column prop="creatTime" label="操作时间" align="center" width="150px"></el-table-column>
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
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
            awbNumber: '',
				},
			}
		},

		//inject: ['setValue'],
		created: function() {
      this.query.awbNumber = this.frow.awbNumber
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
			queryList() {

				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&awbNumber=" + this.query.awbNumber;
				let that = this;
				this.$axios.get('/afbase/awb/awbLogPage?' + param).then(function(response) {
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
					 "&awbNumber=" + this.query.awbNumber;
				let that = this;
				this.$axios.get('/afbase/aforder/selectCoop?' + param).then(function(response) {
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
		}
	}
</script>
<style type="text/css">
</style>
