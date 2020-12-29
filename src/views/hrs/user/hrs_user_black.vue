<template>
	<el-dialog title="用户管理 - 黑名单" width="670px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="form" ref="form"  class="hrsUserBlack-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<!--<el-form-item label="黑名单日期" prop="blacklistDate" label-width="95px">
						<el-date-picker v-model="form.blacklistDate" style="width: 150px;" type="date" :editable="false" :clearable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>-->

          <el-form-item prop="blacklistDate" label-width="15px">
            <el-input class="" style="width:245px;">
              <template slot="prepend">
                <span>黑名单日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="form.blacklistDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 162px;margin-right: -5px;" :editable="false" :clearable="false">
              </el-date-picker>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<!--<el-form-item label="黑名单原因" prop="blacklistReason" label-width="95px">
						<el-input v-model="form.blacklistReason" auto-complete="off" maxlength="50" show-word-limit style="width: 300px;">
						</el-input>
					</el-form-item>-->

          <el-form-item prop="blacklistReason" label-width="15px">
            <el-input v-model="form.blacklistReason" style="width:345px;margin-right: 15px;" auto-complete="off" maxlength="50" show-word-limit>
              <template slot="prepend">
                <span>黑名单原因</span>
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
					blacklistDate: '',
					blacklistReason: ''
				}
			};
		},
		inject: ['findByPage'],
		created() {
			this.form.userId = this.frow.userId
			this.$axios.get('/hrs/user/' + this.frow.userId)
				.then(function(response) {
					if(response.data.code == 0) {
						if(response.data.data.blacklistDate == null || response.data.data.blacklistDate == 'null') {
							this.form.blacklistDate = this.getCurrDate();
						} else {
							this.form.blacklistDate = response.data.data.blacklistDate;
						}
						if(response.data.data.blacklistReason == null || response.data.data.blacklistReason == 'null') {
							this.form.blacklistReason = "";
						} else {
							this.form.blacklistReason = response.data.data.blacklistReason;
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
				if(this.form.blacklistDate == '') {
					this.openError("黑名单时间不能为空")
				} else if(this.form.blacklistReason == '') {
					this.openError("黑名单原因不能为空")
				} else {
					this.$confirm('列入黑名单后将不可恢复, 是否继续?', '注意', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.$axios.put('/hrs/user/black', this.form)
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
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消列入黑名单'
						});
					});

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

  .hrsUserBlack-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .hrsUserBlack-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsUserBlack-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
