<template>
	<el-dialog title="版本管理 - 版本更新记录" width="720px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-row>
			<el-form class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
              <el-input style="width: 219px">
                <template slot="prepend">权限</template>
                <el-select slot="suffix" v-model="query.permissionId" filterable placeholder="" style="width: 150px; margin-right: -5px" clearable>
                  <el-option v-for="item in permissions" :key="item.permissionId" :label="item.permissionName" :value="item.permissionId">
                  </el-option>
                </el-select>
              </el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" style="margin-left: 10px">
						<el-form-item>
              <el-input style="width: 245px">
                <template slot="prepend">更新记录类型</template>
                <el-select slot="suffix" v-model="query.updateType" filterable placeholder="" style="width: 120px;margin-right: -5px" clearable>
                  <el-option v-for="item in updateTypes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item style="margin-left: 41px; margin-top: -3px">
							<el-button size="small" type="primary" @click="showsave">新增</el-button>
							<el-button size="small" type="primary" @click="findByPage2">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-row>

		<el-table :data="data" border>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-on:click="showedit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" v-on:click="doDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
			<el-table-column prop="recordId" label="更新记录号" width="90"></el-table-column>
			<el-table-column prop="versionId" label="版本号" width="60"></el-table-column>
			<el-table-column prop="updateType" label="更新记录类型" width="100"></el-table-column>
			<el-table-column prop="permissionName" label="权限" width="150"></el-table-column>
			<el-table-column prop="updateText" label="更新记录内容" width="160"></el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<save ref="addMission" v-if="save" :visible.sync="save" :frow="ffrow"></save>
		<edit ref="addMission" v-if="edit" :visible.sync="edit" :frow="ffrow"></edit>
	</el-dialog>
</template>
<script>
	import save from './hrs_version_record_save'
	import edit from './hrs_version_record_edit'
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
				query: {
					permissionId: '',
					updateType: ''
				},
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 5, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 30] //分页选项
				},
				data: [],
				updateTypes: [{
					label: "新增",
					value: "新增"
				}, {
					label: "需求变更",
					value: "需求变更"
				}, {
					label: "BUG",
					value: "BUG"
				}, {
					label: "性能优化",
					value: "性能优化"
				}],
				versionId: '',
				permissions: [],
				save: false,
				edit: false,
				ffrow: {}
			};
		},
		components: {
			'save': save,
			'edit': edit
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		created() {
			this.findPermissionList()
			this.versionId = this.frow.versionId
			this.findByPage()
		},
		methods: {
			showsave() {
				this.ffrow = this.versionId;
				this.save = true;
			},
			showedit(row) {
				this.ffrow = row;
				this.edit = true;
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
			handleClose() {
				this.$emit('update:visible', false);
			},
			doDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/hrs/version/child/' + row.recordId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			findByPage() {
				let param = {
					"current": this.pageConf.pageCode,
					"size": this.pageConf.pageSize,
					"versionId": this.versionId,
					"permissionId": this.query.permissionId,
					"updateType": this.query.updateType
				};
				this.$axios.get2('/hrs/version/children', param)
					.then(function(response) {
						if(response.data.code == 0) {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						}
					}.bind(this));
			},
			findByPage2() {
				let param = {
					"current": 1,
					"size": this.pageConf.pageSize,
					"versionId": this.versionId,
					"permissionId": this.query.permissionId,
					"updateType": this.query.updateType
				};
				this.$axios.get2('/hrs/version/children', param)
					.then(function(response) {
						if(response.data.code == 0) {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						}
					}.bind(this));
			},
			findPermissionList() {
				this.$axios.get('/hrs/permission/permissionList')
					.then(function(response) {
						if(response.data.code == 0) {
							this.permissions = response.data.data;
						}
					}.bind(this));
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			}
		}
	}
</script>
<style type="text/css">

</style>
