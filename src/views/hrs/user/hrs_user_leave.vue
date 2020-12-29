<template>
	<el-dialog title="用户管理 - 离职" width="670px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="form" ref="form" class="hrsUserLeave-ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="leaveDate" label-width="15px">
            <el-input class="" style="width:230px;">
              <template slot="prepend">
                <span>离职日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="form.leaveDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 161px;margin-right: -5px;" :editable="false" :clearable="false">
              </el-date-picker>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="leaveReason" label-width="15px">
            <el-input v-model="form.leaveReason" style="width:345px;margin-right: 15px;" auto-complete="off" maxlength="50" show-word-limit>
              <template slot="prepend">
                <span>离职原因</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="submitForm">提交</el-button>
					<el-button size="small" type="primary" @click="resetForm('form')">重置</el-button>
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
			return {
				form: {
					userId: '',
					leaveDate: '',
					leaveReason: ''
				}
			};
		},
		inject: ['findByPage'],
		created() {
			this.form.userId = this.frow.userId
			this.$axios.get('/hrs/user/' + this.frow.userId)
				.then(function(response) {
					if(response.data.code == 0) {
						if(response.data.data.leaveDate == null || response.data.data.leaveDate == 'null') {
							this.form.leaveDate = this.getCurrDate();
						} else {
							this.form.leaveDate = response.data.data.leaveDate;
						}
						if(response.data.data.leaveReason == null || response.data.data.leaveReason == 'null') {
							this.form.leaveReason = "";
						} else {
							this.form.leaveReason = response.data.data.leaveReason;
						}
					}
				}.bind(this))
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
			submitForm() {
				if(this.form.leaveDate == '') {
					this.openError("离职时间不能为空")
				} else if(this.form.leaveReason == '') {
					this.openError("离职原因不能为空")
				} else {
					this.$axios.put('/hrs/user/leave', this.form)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
								this.handleClose();
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			getCurrDate() {
				//获取当前日期
				let date = new Date();
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if(months < 10) {
					months = '0' + months
				}
				if(days < 10) {
					days = '0' + days
				}
				return date.getFullYear() + '-' + months + '-' + days;
			}
		}
	}
</script>
<style type="text/css">

  .hrsUserLeave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .hrsUserLeave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsUserLeave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
