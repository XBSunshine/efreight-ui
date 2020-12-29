<template>
	<el-dialog title="版本管理 - 修改" width="590px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm hrs-version-edit">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item  prop="versionCode" required class="version-code">
            <el-input v-model="ruleForm.versionCode" auto-complete="off" style="width:230px">
              <template slot="prepend"><span style="color:red">*</span>版本编码</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item  prop="versionDate" required>
            <el-input style="width: 330px; margin-left: 10px">
              <template slot="prepend"><span style="color:red">*</span>版本更新时间</template>
              <el-date-picker slot="suffix" style="width:200px; margin-right: -5px" v-model="ruleForm.versionDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" clearable>
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="versionText" required>
            <el-input v-model="ruleForm.versionText" maxlength="10" show-word-limit auto-complete="off" clearable style="width:568px">
              <template slot="prepend"><span style="color:red">*</span>版本更新内容</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 15px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">修改</el-button>
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
			//只能录入数字和字母
			let checkNumberCharacter = (rule, value, callback) => {
				if(value) {
					if(value.replace(/[A-Za-z0-9]/g, "").length != 0) {
						callback(new Error('请输入数字和字母'));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					versionId: '',
					versionCode: '',
					versionDate: '',
					versionText: ''
				},
				rules: {
					versionCode: [{
						required: true,
						message: '请录入版本编号',
						trigger: ['blur', 'change']
					}, {
						max: 8,
						message: '最大长度为8',
						trigger: ['blur', 'change']
					}, {
						validator: checkNumberCharacter,
						trigger: ['blur', 'change']
					}],
					versionDate: [{
						required: true,
						message: '请录入版本更新时间',
						trigger: ['blur', 'change']
					}],
					versionText: [{
						required: true,
						message: '请录入版本更新内容',
						trigger: ['blur', 'change']
					}]
				}
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
						let params = this.ruleForm;
						this.$axios.put('/hrs/version', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.message;
								this.openError(errorinfo);
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
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		},
		created() {
			this.ruleForm.versionId = this.frow.versionId
			this.$axios.get("/hrs/version/" + this.ruleForm.versionId).then((response) => {
				if(response.data.code == "0") {
					this.ruleForm.versionCode = response.data.data.versionCode
					this.ruleForm.versionDate = response.data.data.versionDate
					this.ruleForm.versionText = response.data.data.versionText
				} else {
					this.openError(response.data.messageInfo);
				}
			}).catch((error) => {
				let errorinfo = error.response.data.message;
				this.openError(errorinfo);
			})
		}
	}
</script>
<style type="text/css">
  .hrs-version-edit .version-code .el-input-group__prepend{
    width: 130px;
  }
</style>
