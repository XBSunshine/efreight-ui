<template>
	<div>
		<div v-if="false">
			<el-form label-width="108px">
				<el-row>
					<el-form-item class="pull-right">
						<el-button type="text" v-show="showFlag" @click="showFlag=false">收起</el-button>
						<el-button type="text" v-show="!showFlag" @click="showFlag=true">展开</el-button>
						<el-button type="primary" icon="el-icon-search" @click="findParamListCriteria">搜索</el-button>
						<!-- <router-link to="/prm_category_create">
					<el-button type="primary">新建</el-button>
				</router-link> -->
					</el-form-item>
				</el-row>
				<el-row v-show="showFlag">
					<el-col :span="8">
						<el-form-item label="参数分类名称">
							<el-input style="width: 80%;" placeholder="请输入参数分类名称" v-model="categoryName" clearable>
							</el-input>
						</el-form-item>

					</el-col>
					<el-col :span="8">
						<el-form-item label="参数名称">
							<el-input style="width: 80%;" placeholder="请输入参数名称" v-model="paramName" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否有效">
							<el-select v-model="isVolid" clearable placeholder="请选择" style="width: 30%;">
								<el-option label="全部" value=""></el-option>
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :indent="30" row-key="categoryId" :tree-props="{children: 'params', hasChildren: true}" stripe :data="tableData" style="width: 100%;overflow-y: hidden;" border>
				<el-table-column header-align="center" prop="paramText" label="参数名称" width="350">
				</el-table-column>
				<el-table-column align="center" prop="remark" label="备注">
				</el-table-column>
				<el-table-column align="center" prop="edicode1" label="EDI编码1" width="180">
				</el-table-column>
				<el-table-column align="center" prop="edicode2" label="EDI编码2" width="180">
				</el-table-column>
				<el-table-column align="center" label="是否有效" width="200">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isVolid"></i>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				categoryName: '',
				isVolid: '',
				paramName: '',
				showFlag: false,
				loading: false
			}
		},
		created() {
			this.findParamListCriteria();
		},
		methods: {
			handleEdit(index, row) {
				console.log(index, row);
				this.$router.push({
					path: '/prm_category_edit',
					query: {
						categoryId: row.categoryId,
						paramId: row.paramId
					}
				})
			},
			handleDelete(index, row) {
				let currthis = this
				currthis.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					currthis.$axios.post('/prm/category/deleteParam', {
						categoryId: row.categoryId,
						paramId: row.paramId
					}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then((response) => {
						if(response.status = '200') {
							currthis.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							currthis.findParamListCriteria();
						}
					}).catch((error) => {
						currthis.$notify.error({
							title: '错误',
							message: error.response.data.message
						});
					});
				}).catch(() => {
					currthis.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			findParamListCriteria() {
				this.loading = true
				this.$axios.get2('/prm/category', {
					categoryName: this.categoryName,
					paramText: this.paramName,
					isVolid: this.isVolid
				}).then(function(response) {
					if(response.data.code == '0') {
						this.loading = false
						this.tableData = response.data.data
					} else {
						this.loading = false
						this.$notify.error({
							title: '错误',
							message: '查询失败'
						});
					}
				}.bind(this)).catch(function(error) {
					if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
						this.$notify.error({
							title: '错误',
							message: '查询失败'
						});
					}
					this.loading = false
					console.log(error)
				});
			}
		}
	}
</script>