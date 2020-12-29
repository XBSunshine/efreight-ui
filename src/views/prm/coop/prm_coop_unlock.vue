<template>
	<el-dialog title="解锁客商资料" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="form" :model="form" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="coop_code" label-width="15px">
						<el-input v-model="form.coop_code" disabled style="width: 250px;margin-right: 15px;">
              <template slot="prepend">客商资料代码</template>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="reason" :rules="[{required:true,message:'请录入解锁原因',trigger:['blur','change']}]" label-width="15px">
            <el-input v-model="form.reason" maxlength="100" show-word-limit style="width: 450px;">
              <template slot="prepend">解锁原因</template>
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
					coop_id: '',
					coop_code: '',
					reason: ''
				}
			}
		},
		created: function() {
			this.form.coop_id = this.frow.coop_id;
			this.form.coop_code = this.frow.coop_code;
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
			submitForm() {
				if(this.form.coop_code == '') {
					this.openError("请录入客商资料代码")
					return
				}
				if(this.form.reason == '') {
					this.openError("请录入解锁原因")
					return
				}
				this.$axios.put('/prm/coop/lockOrUnlock/1', this.form)
					.then(function(response) {
						if(response.data.code == 200) {
							this.openSuccess();
							this.queryCoopList();
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
