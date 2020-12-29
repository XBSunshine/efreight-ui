<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" label-width="80px" class="afCarrier-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.carrierCode" auto-complete="off" @input="query.carrierCode=query.carrierCode.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">航司代码</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.carrierNameCn" auto-complete="off" style="width: 200px;" clearable>
                <template slot="prepend">航司名称</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" v-on:click="findByPage" size="small">查询</el-button>
							<el-button style="margin-left: 4px;" type="primary" v-on:click="addCarrier" size="small" v-if="permission.sys_base_carrier_add.isShow">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-table v-loading="loading" :data="data" border>
				<el-table-column align="center" label="操作" width="60" v-if="operation.isShow">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="permission.sys_base_carrier_edit.isShow">编辑</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="permission.sys_base_carrier_del.isShow">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column prop="carrierCode" label="航司二字码" width="90" align="center"></el-table-column>
				<el-table-column prop="carrierPrefix" label="航司三字码" width="90" align="center"></el-table-column>
				<el-table-column prop="carrierNameCn" label="航司中文名称" width="300" align="left" header-align="center"></el-table-column>
				<el-table-column prop="carrierNameEn" label="航司英文名称" width="300" align="left" header-align="center"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</div>
		<add ref="addMission" v-if="addVisible" :visible.sync="addVisible"></add>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>
<script>
	import edit from './af_carrier_edit.vue'
	import add from './af_carrier_add.vue'
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
					carrierCode: '',
					carrierNameCn: ''
				},
				editVisible: false,
				addVisible: false,
				frow: {},
				fileList: [],
				loading: false,
				permission: {
					sys_base_carrier_add: {
						isShow: false
					},
					sys_base_carrier_edit: {
						isShow: false
					},
					sys_base_carrier_del: {
						isShow: false
					},
				},
        operation :{
            isShow: true
        }
			}
		},
		components: {
			'edit': edit,
			'add': add
		},
		provide() {
			return {
				findByPage: this.findByPage,
				findByPage2: this.findByPage2
			}
		},
		methods: {
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'delete') {
					this.handleDelete(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			addCarrier() {
				this.addVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			findByPage() {
				if(this.query.carrierCode.trim() == '' && this.query.carrierNameCn.trim() == '') {
					this.openError("请至少录入一个查询条件")
					this.data = []
					this.pageConf.totalPage = 0
					return
				}
				this.loading = true
				this.$axios.get2('/afbase/carrier?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2('/afbase/carrier?current=' + current + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.loading = false
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			handleDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/carrier/' + row.carrierId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage2(1);
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
			formatCarrierStatus(row, column) {
				return row.carrierStatus == "0" ? "失效" : row.carrierStatus == "1" ? "生效" : "-";
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
				this.$axios.post2('/afbase/carrier/importData', form)
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
			this.loadPermission(this.permission);
			if(this.permission.sys_base_carrier_edit.isShow == false && this.permission.sys_base_carrier_del.isShow == false){
        this.operation.isShow = false
      }
		},

	}
</script>
<style type="text/css">

  .afCarrier-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afCarrier-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afCarrier-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
