<template>
	<el-dialog title="废止合同" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="form" :model="form" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="coop_code" label-width="15px">
						<el-input v-model="form.serial_number" disabled style="width: 250px;margin-right: 15px;">
              <template slot="prepend">合同编号</template>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item :rules="[{required:true,message:'请录入废止备注',trigger:['blur','change']}]" label-width="15px">
            <el-input v-model="form.stop_remark" maxlength="100" show-word-limit style="width: 450px;">
              <template slot="prepend">废止备注</template>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
					    <el-button size="small" type="primary" @click="submitForm">提交</el-button>
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
					agreement_id: '',
          serial_number: '',
					stop_remark: ''
				}
			}
		},
		created: function() {
      this.form.agreement_id = this.frow.agreement_id;
			this.form.serial_number = this.frow.serial_number;
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
				if(this.form.stop_remark == '') {
					this.openError("请录入废止原因")
					return
				}
				let stop_remark = encodeURIComponent(this.form.stop_remark)
        let params = {
          "agreement_id": this.form.agreement_id,
          "stop_remark": stop_remark
        };
				this.$axios.post('/prm/coop/stopAgreement', params)
					.then(function(response) {
						if(response.data.code == 200) {
							this.openSuccess();
              this.$parent.queryCoopTabs('agreement');
							this.handleClose();
						} else {
							let errorinfo = response.data.messageInfo;
							this.openError(errorinfo);
						}

					}.bind(this)).catch(function(error) {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							this.openError(error.response.data.messageInfo);
						}
					}.bind(this));
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
