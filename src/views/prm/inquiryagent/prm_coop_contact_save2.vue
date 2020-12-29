<template>
	<el-dialog title="客户联系人 - 新增" width="650px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :disabled="loading" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-left: 10px;" label-width="90px">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="姓名" prop="contacts_name">
						<el-input v-model="ruleForm.contacts_name" clearable auto-complete="off" style="width: 180px"></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="电话" prop="phone_number">
						<el-input v-model="ruleForm.phone_number" clearable auto-complete="off" style="width: 180px"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="ruleForm.email" clearable auto-complete="off" style="width: 180px"></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="部门" prop="dept_name">
						<el-input v-model="ruleForm.dept_name" clearable auto-complete="off" style="width: 180px"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="职务" prop="job_position">
						<el-input v-model="ruleForm.job_position" clearable auto-complete="off" style="width: 180px"></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="固话" prop="tel_number">
						<el-input v-model="ruleForm.tel_number" clearable auto-complete="off" style="width: 180px"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="类型" prop="contacts_type">
						<el-select v-model="ruleForm.contacts_type" clearable placeholder="请选择" style="width:180px;">
							<el-option label="订舱" value="订舱">
							</el-option>
							<el-option label="老板" value="老板">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label-width="10px">
					<el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">提交</el-button>
				</el-form-item>
			</el-row>
		</el-form>
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
		inject: ['queryContactsList2'],
		data() {
			return {
				loading: false,
				routingGroupNames: [],
				routingNames: [],
				ruleForm: {
					coop_id: '',
					contacts_type: '',
					contacts_name: '',
					phone_number: '',
					email: '',
					dept_name: '',
					job_position: '',
					tel_number: '',
					contacts_status: '1'
				},
				rules: {
					contacts_name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}, {
						max: 40,
						message: '长度不超过40',
						trigger: ['blur', 'change']
					}],
					phone_number: [{
						required: true,
						message: '请输入电话',
						trigger: ['blur', 'change']
					}, {
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: ['blur', 'change']
					}, {
						max: 80,
						message: '长度不超过80',
						trigger: ['blur', 'change']
					}],
					dept_name: [{
						max: 40,
						message: '长度不超过40',
						trigger: ['blur', 'change']
					}],
					job_position: [{
						max: 40,
						message: '长度不超过40',
						trigger: ['blur', 'change']
					}],
					tel_number: [{
						max: 40,
						message: '长度不超过40',
						trigger: ['blur', 'change']
					}],
					contacts_type: [{
						required: true,
						message: '请选择类型',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		methods: {

			handleClose() {
				this.$emit("update:visible", false);
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

			submitForm(formName) {
				let matchEmail = /^[a-zA-Z#0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
				if (!matchEmail.test(this.ruleForm.email)) {
					this.openError("请输入正确的邮箱地址");
					return;
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post("/prm/coop/saveCoopContacts", params)
							.then(function(response) {
								if (response.data.code == 200) {
									this.loading = false;
									this.openSuccess();
									this.handleClose();
									this.queryContactsList2(this.frow.coop_id);
								} else {
									this.loading = false;
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.loading = false;
								this.openError(response.data.messageInfo || "");
							}.bind(this))
					} else {
						return false;
					}
				});
			}
		},
		created() {
			// this.init();
			this.ruleForm.coop_id = this.frow.coop_id;
			this.ruleForm.contacts_type = '订舱';
		}
	}
</script>
