<template>
	<el-dialog title="公告——修改" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
			<el-row>
				<el-col :span="11">
					<el-form-item label="主题" prop="noticeTitle">
						<el-input v-model="ruleForm.noticeTitle" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="公告时间" prop="noticeDate" required>
						<el-date-picker v-model="ruleForm.noticeDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="22">
					<el-form-item label="内容" prop="noticeText" required>
						<el-input type="textarea" v-model="ruleForm.noticeText" maxlength="100" show-word-limit auto-complete="off" clearable>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="附件路径" prop="noticeFile">
						<el-input v-model="ruleForm.noticeFile" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="公告类型" prop="noticeType" required>
						<el-select v-model="ruleForm.noticeType" placeholder="请选择" style="width: 100%;">
							<el-option label="系统更新" value="XTGX"></el-option>
							<el-option label="系统维护" value="XTWH"></el-option>
							<el-option label="活动推广" value="HDTG"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="推送级别" prop="pushType" required>
						<el-select v-model="ruleForm.pushType" placeholder="请选择" @change="changePushType" style="width: 100%;">
							<el-option label="全部用户" value="1"></el-option>
							<el-option label="全部管理员" value="2"></el-option>
							<el-option label="签约公司全部用户" value="3"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="组织机构" prop="pushOrg" v-show="isShowPushOrg">
						<el-select v-model="ruleForm.pushOrg" filterable placeholder="请选择" style="width: 100%;">
							<el-option v-for="org in orgs" :key="org.orgId" :label="org.orgName" :value="org.orgId">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
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
		data() {
			var checkNumber = (rule, value, callback) => {
				if(value) {
					setTimeout(() => {
						if(!Number.isInteger(value)) {
							callback(new Error('请输入数字值'));
						} else {
							if(value < 0) {
								callback(new Error('必须大于0'));
							} else {
								callback();
							}
						}
					}, 1000);
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					noticeId: '',
					noticeTitle: '',
					noticeDate: '',
					noticeText: '',
					noticeFile: '',
					noticeType: '',
					pushType: '',
					pushOrg: ''
				},
				rules: {
					noticeTitle: [{
						required: true,
						message: '请录入主题',
						trigger: ['blur', 'change']
					},{
						max: 10,
						message: '最大长度为10',
						trigger: ['blur', 'change']
					}],
					noticeDate: [{
						required: true,
						message: '请录入公告日期',
						trigger: ['blur', 'change']
					}],
					noticeText: [{
						required: true,
						message: '请录入公告内容',
						trigger: ['blur', 'change']
					}],
					noticeType: [{
						required: true,
						message: '请选择公告类型',
						trigger: ['blur', 'change']
					}],
					pushType: [{
						required: true,
						message: '请选择推送级别',
						trigger: ['blur', 'change']
					}]
				},
				isShowPushOrg: false,
				orgs: []
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
			resetForm(formName) {
				this.init();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			init() {
				this.$axios.get('/hrs/org')
					.then(function(response) {
						this.orgs = response.data.data;
					}.bind(this));
				this.$axios.get('/hrs/notice/' + this.frow.noticeId)
					.then(function(response) {
						if(response.data.code == 0) {
							this.ruleForm = response.data.data;
							if(this.ruleForm.pushType == '3') {
								this.isShowPushOrg = true;
							}
						}
					}.bind(this));
			},
			changePushType() {
				if(this.ruleForm.pushType == '3') {
					this.isShowPushOrg = true
				} else {
					this.isShowPushOrg = false
				}
			}
		},
		created() {
			this.init();
		}
	}
</script>
<style type="text/css">

</style>