<template>
	<el-dialog title="修复账单" width="400px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="form" :model="form" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="选择月份" label-width="85px">
						<el-date-picker v-model="form.createTimeStart" type="month" value-format="yyyy-MM-dd" placeholder="选择月份" style="width: 120px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 89px;">
					    <el-button size="small" type="primary" @click="submitForm" :disabled="disabledFlag2">修复</el-button>
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
				form: {
					createTimeStart: '',
					createTimeEnd: ''
				},
        disabledFlag2: false,
			}
		},
		created: function() {

		},
		inject: ['findCoopBillList'],
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
				if (this.form.createTimeStart) {

				}else{
					this.openError("请选择月份");
					return;
				}
        this.disabledFlag2 = true;
				this.$axios.post('/prm/coopBill/repairBill',this.form)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							//是否自动发送账单
                let currthis = this
                currthis.$confirm('是否自动发送账单？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning',
                    center: true
                }).then(() => {
                    currthis.$axios.put('/prm/coopBill/autoSendBill/' + currthis.form.createTimeStart).then((response) => {
                        if(response.data.code == '0') {
                            currthis.$notify({
                                title: '成功',
                                message: '发送成功',
                                type: 'success'
                            });
                            currthis.findCoopBillList();
                            currthis.handleClose();
                        } else {
                            currthis.$notify.error({
                                title: '错误',
                                message: response.data.messageInfo
                            });
                        }
                    }).catch((error) => {
                        currthis.$notify.error({
                            title: '错误',
                            message: error.response.data.messageInfo
                        });
                    });
                }).catch(() => {
                    currthis.findCoopBillList();
                    currthis.handleClose();
                });




							//this.findCoopBillList();
							//this.handleClose();
						} else {
							let errorinfo = response.data.messageInfo;
							this.openError(errorinfo);
						}

					}.bind(this)).catch(function(error) {
						this.openError(error.response.data.messageInfo);

					}.bind(this));
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
