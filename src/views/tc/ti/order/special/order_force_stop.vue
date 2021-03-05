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
          if (valid) {
            this.$axios.put('/sc/tcOrder/te/forceStop/' + this.frow.orderId, this.ruleForm).then((response) => {
              if (response.data.code == 0) {
                this.openSuccess()
                this.findByPage()
                this.handleClose();
              } else {
                this.openError(response.data.messageInfo)
              }
            }).catch((error) => {
              this.openError(error.response.data.messageInfo)
            })
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
