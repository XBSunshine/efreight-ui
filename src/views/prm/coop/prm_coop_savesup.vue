<template>
	<el-dialog title="新建上级分组" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
			<el-row>
				<el-col :span="7">
					<el-form-item label="客商资料代码">
						<el-input v-model="father_coop_code" auto-complete="off" :disabled="true" style="width:130px;text-align: right;">
						</el-input>
						<span class="el-icon-arrow-right"></span>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item prop="mid_coop_code" required style="margin-left: -100px;">
						<el-input v-model="ruleForm.mid_coop_code" auto-complete="off" style="width:120px;" @input="ruleForm.mid_coop_code = toFormatCoopCodeValue(ruleForm.mid_coop_code)">
						</el-input>
						<span class="el-icon-arrow-right"></span>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item prop="son_coop_code" required style="margin-left: -100px;">
						<el-input v-model="ruleForm.son_coop_code" auto-complete="off" style="width:120px;" @input="ruleForm.son_coop_code = toFormatCoopCodeValue(ruleForm.son_coop_code)" :disabled="true">
						</el-input>
					</el-form-item>
				</el-col>

			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="中文全称" prop="coop_name" required>
						<el-input v-model="ruleForm.coop_name" @change="ruleForm.coop_name=strTrim(ruleForm.coop_name)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="中文简称" prop="short_name" required>
						<el-input v-model="ruleForm.short_name" @change="ruleForm.short_name=strTrim(ruleForm.short_name)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="英文全称" prop="coop_ename" required>
						<el-input v-model="ruleForm.coop_ename" @change="ruleForm.coop_ename=strTrim(ruleForm.coop_ename)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="英文简称" prop="short_ename" required>
						<el-input v-model="ruleForm.short_ename" @change="ruleForm.short_ename=strTrim(ruleForm.short_ename)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
			let numberAndCharacterValidator = (rule, value, callback) => {
				if(!value) {
					return callback();
				}
				let regE = /^[0-9a-zA-Z]*$/g;
				if(!regE.test(value)) {
					callback(new Error('请输入字母或数字'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					coop_code: '',
					coop_mnemonic: '',
					coop_name: '',
					short_name: '',
					coop_ename: '',
					short_ename: '',
					coop_status: '1',
					blackwhite_valid: '1',
					son_coop_code: '',
					mid_coop_code: ''
				},
				rules: {
					// coop_code: [
					//   { required: true, message: '请输入客商资料代码', trigger: ['blur', 'change']  },
					//   { min: 3, max: 3, message: '长度为 3', trigger: ['blur', 'change']  }
					// ],
					son_coop_code: [{
							required: true,
							message: '请输入客商资料代码',
							trigger: ['blur', 'change']
						},
						{
							min: 3,
							max: 3,
							message: '长度为 3',
							trigger: ['blur', 'change']
						},
						{
							validator: numberAndCharacterValidator,
							trigger: ['blur', 'change']
						}
					],
					mid_coop_code: [{
							required: true,
							message: '请输入分组代码',
							trigger: ['blur', 'change']
						},
						{
							min: 3,
							max: 3,
							message: '长度为 3',
							trigger: ['blur', 'change']
						},
						{
							validator: numberAndCharacterValidator,
							trigger: ['blur', 'change']
						}
					],
					coop_name: [{
							required: true,
							message: '请输入中文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					short_name: [{
							required: true,
							message: '请输入中文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					coop_ename: [{
							required: true,
							message: '请输入英文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					short_ename: [{
							required: true,
							message: '请输入英文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					lock_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					blacklist_reason: [{
						min: 0,
						max: 4000,
						message: '长度不超过 4000',
						trigger: ['blur', 'change']
					}],
					whitelist_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}]
				},
				father_coop_code: ''

			};
		},
		created: function() {
			let i = this.frow.coop_code.length;
			this.father_coop_code = this.frow.coop_code.substr(0, i - 3);
			this.ruleForm.son_coop_code = this.frow.coop_code.substring(i - 3, i);
		},
		inject: ['queryCoopList'],
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
						// alert('submit!');
						// ruleForm.coop_code = this.father_coop_code+ruleForm.coop_code;
						let params = this.ruleForm;
						params.coop_code = this.father_coop_code + this.ruleForm.mid_coop_code + this.ruleForm.son_coop_code;
						// console.log(params.coop_code.length);
						if(params.coop_code.length > 15) {
							this.openError('超过层级限制');
							return;
						}
						this.$axios.post('/prm/coop/saveSup',
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.queryCoopList();
									this.handleClose();
								} else {
									let errorinfo = response.data.messageInfo;
									//唯一性错误
									if(errorinfo.indexOf('Duplicate entry') > -1) {
										if(errorinfo.indexOf('IDU_prm_coop_code') > -1)
											this.openError('客商资料代码不可重复');
										else if(errorinfo.indexOf('IDU_prm_coop_name') > -1)
											this.openError('客商资料中文名称不可重复');
										else if(errorinfo.indexOf('IDU_prm_short_name') > -1)
											this.openError('客商资料中文简称不可重复');
										else if(errorinfo.indexOf('IDU_prm_coop_ename') > -1)
											this.openError('客商资料英文全称不可重复');
										else if(errorinfo.indexOf('IDU_prm_short_ename') > -1)
											this.openError('客商资料英文简称不可重复');
										else
											this.openError(errorinfo);
									} else {
										this.openError(errorinfo);
									}
								}

							}.bind(this)).catch(function(error) {
								if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
									this.openError(error.response.data.messageInfo);
								}
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			toFormatCoopCodeValue(val) {
				return val.replace("0", "").replace("1", "").toUpperCase();
			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">

</style>
