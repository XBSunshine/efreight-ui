<template>
	<el-dialog title="国家详情" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
			<el-row>
				<el-col :span="12">
					<el-form-item label="国家代码" prop="nationCode">
						<el-input v-model="ruleForm.nationCode" auto-complete="off" style="width: 100%;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="洲" prop="nationContinent">
						<el-input v-model="ruleForm.nationContinent" auto-complete="off" style="width: 100%;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="国家名称" prop="nationName" required>
						<el-input v-model="ruleForm.nationName" auto-complete="off" style="width: 100%;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="国家英文名称" prop="nationEname" required>
						<el-input v-model="ruleForm.nationEname" auto-complete="off" style="width: 100%;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="是否生效" prop="nationStatus" required>
						<el-select v-model="ruleForm.nationStatus" placeholder="请选择" style="width: 100%;">
							<el-option label="失效" :value=false></el-option>
							<el-option label="生效" :value=true></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<!--<el-row>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-row>-->
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
		data() {
			return {
				ruleForm: {
					id: '',
					nationCode: '',
					nationContinent: '',
					nationName: '',
					nationEname: '',
					nationStatus: ''
				},
				rules: {}
			};
		},
		inject: ['findByPage'],
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.ruleForm.pushType == '3' && this.ruleForm.pushOrg == '') {
							this.openError("当前推送级别为签约公司全部用户，组织机构为必填项");
							return;
						}
						let params = this.ruleForm;
						this.$axios.put('/hrs/notice', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									this.openError(response.data.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			init() {
				this.ruleForm.id = this.frow.id
				this.$axios.get('/afbase/nation/view/' + this.ruleForm.id)
					.then(function(response) {
						this.ruleForm = response.data.data;
					}.bind(this));
			}
		},
		created() {
			this.init();
		}
	}
</script>
<style type="text/css">

</style>