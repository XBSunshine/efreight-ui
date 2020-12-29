<template>
	<div>
		<div v-if="false">
			<el-form :inline='true'>
				<el-form-item label="参数分类名称" label-width="108px">
					<el-input style="width: 200px;" placeholder="请输入参数分类名称" v-model="query.categoryName" clearable>
					</el-input>
				</el-form-item>
				<el-form-item label="参数名称" label-width="108px">
					<el-input style="width: 200px;" placeholder="请输入参数名称" v-model="query.paramText" clearable>
					</el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="query.isValid" placeholder="请选择" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="生效" value="true"></el-option>
						<el-option label="失效" value="false"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="getPage">搜索</el-button>
			</el-form>
		</div>
		<div>
			<el-table :indent="30" row-key="id" :tree-props="{children: 'params', hasChildren: true}" stripe :data="data1" style="width: 100%;overflow-y: hidden;" border>
				<el-table-column header-align="center" prop="paramText" label="参数名称" width="350">
				</el-table-column>
				<el-table-column align="center" prop="remarks" label="备注">
				</el-table-column>
				<el-table-column align="center" prop="edicode1" label="EDI编码1" width="180">
				</el-table-column>
				<el-table-column align="center" prop="edicode2" label="EDI编码2" width="180">
				</el-table-column>
				<el-table-column align="center" label="是否有效" width="200">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isValid"></i>
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
				data1: [],
				query: {
					categoryName: '',
					paramText: '',
					isValid: ''
				}
			}
		},
		created() {
			this.getPage();
			console.log('af_category');
		},
		methods: {
			handleSizeChange(val) {
				this.getPage();
			},
			handleCurrentChange(val) {
				this.getPage();
			},
			getPage() {
				this.$axios.get2('/afbase/category', this.query).then(function(response) {
					this.data1 = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				});
			},
			isValidFormat(row, column) {
				if(row.isValid == false) {
					return "失效"
				} else if(row.isValid == true) {
					return "生效"
				}
			}
		}
	}
</script>
<style scoped="scoped">
</style>