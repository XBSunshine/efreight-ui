<template>
	<el-dialog title="强制关闭" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="ruleForm" :rules="rules" :inline="false" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="原因" prop="reason" label-width="75px">
						<el-input type="textarea" v-model="ruleForm.reason" auto-complete="off" maxlength="100" style="width: 480px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item style="margin-left: -25px;">
						<el-button type="primary" size="small" @click="forceStop('ruleForm')">确定关闭</el-button>
            <el-button type="primary" size="small" @click="cancel" style="background-color:#FFF;color:#409EFF">取消</el-button>
					</el-form-item>
				</el-col>
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
				ruleForm: {
					reason: '',
					businessScope: '',
					orderUuid: ''
				},
				rules: {
					reason: [{
						required: true,
						message: '请输入关闭原因',
						trigger: ['blur', 'change']
					}],
				}
			}
		},
		created: function() {
			this.ruleForm.orderUuid = this.frow.orderUuid;
			this.ruleForm.businessScope = this.frow.businessScope
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
			forceStop(formName) {

				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$axios.put('/afbase/aforder/forceStop', this.ruleForm)
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
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			cancel() {
				this.handleClose()
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>
<style type="text/css">

</style>