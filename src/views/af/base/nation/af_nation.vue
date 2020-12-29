<template>
	<div>
		<div>
			<el-row>
				<el-form :model="query" label-width="130px" class="demo-ruleForm">
					<el-row>
						<el-col :span="4">
							<el-form-item label="国家代码">
								<el-input v-model="query.nationCode" placeholder="请输入国家代码" auto-complete="off" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="国家名称">
								<el-input v-model="query.nationName" placeholder="请输入国家名称" auto-complete="off" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2">
							<el-form-item label-width="20px">
								<el-button type="primary" icon="el-icon-search" v-on:click="findByPage2">查询</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-upload class="upload-demo" ref="upload" action="/afbase/nation/importData" :http-request="uploadFile" :limit="1" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
								<el-button slot="trigger" type="primary">选取文件</el-button>
								<el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
								<div slot="tip" class="el-upload__tip">只能上传.xlsx/.xls文件，且不超过500kb</div>
							</el-upload>
						</el-col>
					</el-row>
				</el-form>
			</el-row>
			<el-table :data="data">

				<el-table-column prop="nationCode" label="国家代码" align="center"></el-table-column>
				<el-table-column prop="nationName" label="国家名称" align="center"></el-table-column>
				<el-table-column prop="nationEname" label="国家英文名称" align="center"></el-table-column>
				<el-table-column prop="nationContinent" label="洲" align="center"></el-table-column>
				<el-table-column prop="nationStatus" label="是否生效" :formatter="formatNationStatus" align="center"></el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="showedit(scope.row)">查看</el-button>
						<!--<el-button type="text" size="small" v-on:click="doDelete(scope.row)">删除</el-button>-->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</div>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>
<script>
	import edit from './af_nation_edit.vue'
	export default {
		data() {
			return {

				/*表数据*/
				data: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 30] //分页选项
				},
				query: {
					nationCode: '',
					nationName: ''
				},
				editVisible: false,
				frow: {},
				fileList: []
			}
		},
		components: {
			'edit': edit
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			findByPage() {
				this.$axios.get2('/afbase/nation?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			findByPage2() {
				this.pageConf.pageCode = 1
				this.$axios.get2('/afbase/nation?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			doDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/hrs/notice/' + row.noticeId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage2();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

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
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			},
			formatNationStatus(row, column) {
				return row.nationStatus == "0" ? "失效" : row.nationStatus == "1" ? "生效" : "-";
			},
			// 上传文件
			uploadFile(item) {
				console.log(item)
				const fileObj = item.file

				// FormData 对象
				const form = new FormData()
				// 文件对象
				form.append('file', fileObj)
				form.append('comId', this.comId)
				console.log(JSON.stringify(form))
				this.$axios.post2('/afbase/nation/importData', form)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage2();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						this.openError(error.response.data.messageInfo);
					}.bind(this));
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			}
		},
		created() {
			this.findByPage();
		}
	}
</script>
<style>

</style>