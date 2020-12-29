<template>
	<el-dialog title="用户管理 - 兼职部门" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-row>
			<el-form :model="form" ref="form" class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="用户名称" prop="userName" label-width="85px">
							<el-input v-model="form.userName" disabled style="width: 150px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="所属部门" prop="deptId" :rules="[{ required: true, message: '部门不能为空',trigger:'blur'}]" label-width="95px">
							<el-select v-model="form.deptId" filterable placeholder="" style="width: 330px;">
								<el-option v-for="item in depts" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="岗位" prop="jobPosition" :rules="[{ required: true, message: '岗位不能为空',trigger:'blur'}]" label-width="85px">
							<el-input v-model="form.jobPosition" style="width: 150px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="95px">
							<el-button size="small" type="primary" @click="submitForm">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-row>
		<el-table :data="data" border>
      <el-table-column label="操作" width="60" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-on:click="doDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
			<el-table-column prop="deptName" label="部门名称"></el-table-column>
			<el-table-column prop="deptCode" label="部门编码"></el-table-column>
			<el-table-column prop="creatorName" label="创建人" width="70"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="145"></el-table-column>
			<el-table-column prop="isMain" label="是否主部门" :formatter="formatIsMain" width="85"></el-table-column>
			<el-table-column prop="deptStatus" label="状态" :formatter="formatDeptStatus" width="40"></el-table-column>
			<el-table-column prop="jobPosition" label="岗位"></el-table-column>
		</el-table>
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
				form: {
					userId: '',
					userName: '',
					deptId: '',
					jobPosition: ""
				},
				data: [],
				depts: []
			};
		},
		created() {
			this.form.userId = this.frow.userId
			this.form.userName = this.frow.userName
			this.findByPage();
			this.$axios.post('/prm/coopagreement/selectDept')
				.then(function(response) {
					this.depts = response.data.data.dataList;
				}.bind(this));
		},
		methods: {
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
			optionAfter() {
				this.form.deptId = ''
				this.form.jobPosition = ''
			},
			submitForm() {
				if(this.form.deptId == '') {
					this.openError("部门不能为空")
				} else if(this.form.jobPosition == '') {
					this.openError("岗位不能为空")
				} else {
					this.$axios.post2('/hrs/userDept', this.form)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
								this.optionAfter();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this)).catch(function(error) {
							if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}
						}.bind(this));
				}
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			formatDeptStatus(row, column) {
				return row.deptStatus == true ? "生效" : row.deptStatus == false ? "失效" : "";
			},
			formatIsMain(row, column) {
				return row.isMain == true ? "主部门" : row.isMain == false ? "兼职部门" : "-";
			},
			doDelete(row) {
				this.$axios.deletes('/hrs/userDept/' + this.form.userId + '/' + row.deptId)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}
					}.bind(this));
			},
			findByPage() {
				this.$axios.get('/hrs/userDept/' + this.form.userId)
					.then(function(response) {
						if(response.data.code == 0) {
							this.data = response.data.data;
						}
					}.bind(this));
			}
		}
	}
</script>
<style type="text/css">

</style>
