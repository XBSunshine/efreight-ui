<template>
	<el-dialog :title="'单证制作 - '+name" width="45%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-form :inline="false" :model="query" label-width="100px" class="demo-ruleForm">

				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="助记码" label-width="80px">
							<el-input v-model="query.scMnemonic" clearable auto-complete="off" style="width: 100px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item :label="name+'名称'">
							<el-input v-model="query.scName" clearable auto-complete="off" style="width: 150px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button size="small" type="primary" icon="el-icon-search" @click="queryList">搜索</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1">
				<el-table-column prop="scMnemonic" label="助记码" width="120" align="center"></el-table-column>
				<el-table-column prop="scName" :label="name+'名称'" header-align="center"></el-table-column>
				<el-table-column label="操作" width="60" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doSelect(scope.row)">选择</el-button>

					</template>
				</el-table-column>
				<!-- :formatter="formatter1" -->
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
				name: '',
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
					scType: '',
					scMnemonic: '',
					scName: '',
					isValid: true
				},
				saveVisible: false
			}
		},

		inject: ['callback'],
		created: function() {

			this.query.scType = this.frow.scType;
			if(this.frow.scType === 1) {
				this.name = "收货人";
			} else {
				this.name = "发货人";
			}
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
				let data = {}
				data.print = rrow.scPrintRemark
				data.type = this.frow.scType
				data.scId = rrow.scId
				this.callback(data, 'sc');
				this.handleClose();
			},
			queryList() {

				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode
				let that = this;
				this.$axios.get2('/afbase/shipperConsignee?' + param, this.query).then(function(response) {
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
				let param = "size=" + this.pageConf.pageSize + "&current=" + current
				let that = this;
				this.$axios.get2('/afbase/shipperConsignee?' + param, this.query).then(function(response) {
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

			//--------------------- 

		}
	}
</script>
<style type="text/css">

</style>