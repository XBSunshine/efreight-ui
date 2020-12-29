<template>
	<el-dialog title="账单生成" width="400px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
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
					    <el-button size="small" type="primary" @click="submitForm" :disabled="disabledFlag2">生成</el-button>
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
				this.$axios.post('/prm/coopBill',this.form)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findCoopBillList();
							this.handleClose();
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
