<template>
	<el-dialog title="客户项目——解锁" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="demo-ruleForm">
			<el-row>
				<el-col :span="18">
					<el-form-item label="项目名称" >
						<el-input v-model="ruleForm.projectName" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="18">
					<el-form-item label="解锁原因" required>
						<el-input v-model="ruleForm.openReason" placeholder="请录入解锁原因" clearable maxlength="100" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :offset="2" :span="2">
					<el-button type="primary" @click="submitForm">解锁</el-button>
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
					projectName:'',
					openReason:'',
					isLock:0,
					projectId: ''
				}
			}
		},
		created: function() {
			this.ruleForm.projectId = this.frow.projectId;
			this.ruleForm.projectName = this.frow.projectName;
			this.ruleForm.openReason = this.frow.openReason;
		},
		inject: ['queryList'],
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
				if(this.ruleForm.openReason) {
					
				}else{
					this.openError("请录入解锁原因")
					return;
				}
				this.$axios.post2('/afbase/coopProject/doStop', this.ruleForm)
                .then(function(response) {
                
	                if(response.data.code==0){
	                  
	                  this.openSuccess();
	                  this.queryList();
	                  this.handleClose();                 
	                }else{
	                  this.openError(response.data.messageInfo);
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