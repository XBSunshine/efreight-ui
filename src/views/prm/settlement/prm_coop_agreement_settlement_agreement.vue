<template>
	<el-dialog title="选择客户" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-form :inline='true'>
				<el-form-item label="客户名称" label-width="108px">
					<el-input style="width: 200px;" placeholder="请输入客户名称" v-model="coop_name">
					</el-input>
				</el-form-item>
        <el-form-item label="客户代码" label-width="108px">
          <el-input style="width: 200px;" placeholder="请输入客户代码" v-model="coop_code">
          </el-input>
        </el-form-item>
				<el-button type="primary" size="small" @click="findCoopagreementListCriteria">查询</el-button>
			</el-form>
		</div>
		<div>
			<el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="chooseAgreement(scope.$index, scope.row)">选择</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="coop_code" label="客户代码" width="100">
        </el-table-column>
        <el-table-column align="center" prop="coop_name" label="客户中文全称" width="369">
        </el-table-column>
        <el-table-column align="center" prop="coop_mnemonic" label="助记码" width="200">
        </el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
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
			}
		},
		data: function() {
			return {
				coop_name: '',
        coop_code: '',
				currentPage: 1,
				pageSize: 5,
				totalNum: 100,
				tableData: []
			};
		},
		inject: ['callback'],
		created() {
			this.findCoopagreementListCriteria();
		},
		methods: {
			chooseAgreement(index, row) {
				this.callback(row.coop_id, row.coop_name,row.transactor_id,row.user_name)
				this.handleClose()
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			handleSizeChange(val) {
				this.findCoopagreementListCriteria();
			},
			handleCurrentChange(val) {
				this.findCoopagreementListCriteria();
			},
			findCoopagreementListCriteria() {
				this.$axios.post('/prm/coopagreement/queryList1', {
					coop_name: this.coop_name,
          coop_code: this.coop_code,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then((response) => {
					if(response.status = '200') {
						this.tableData = response.data.data.dataList
						this.totalNum = response.data.data.totalNum
					}
				}).catch((error) => {
					this.$notify.error({
						title: '错误',
						message: error.response.data.message
					});
				});
			},
			isVolidFormat(row, column) {
				console.log(row.isVolid)
				if(row.isVolid == '0') {
					return "失效"
				} else if(row.isVolid == '1') {
					return "生效"
				}
			}
		}
	}
</script>
