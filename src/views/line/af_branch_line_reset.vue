<template>
	<el-dialog title="支线管理 - 重置" width="980px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div class="orderEditPage" >
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="10px" class="demo-ruleForm" style="margin-left: 5px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="rearchid">
							<el-input v-model="ruleForm.rearchid" auto-complete="off" style="width:280px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>运抵编号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="totalpiecequantity">
							<el-input v-model="ruleForm.totalpiecequantity" auto-complete="off"  style="width:210px;" @input="formatToFloat('totalpiecequantity')">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>件数</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="totalgrossweight">
							<el-input v-model="ruleForm.totalgrossweight" auto-complete="off"  style="width:210px;" @input="formatToFloat('totalgrossweight')">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>重量</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="totalvolumnamount">
							<el-input v-model="ruleForm.totalvolumnamount" auto-complete="off"  style="width:210px;" @input="formatToFloat('totalvolumnamount')">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>体积</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-form-item>
						<el-button :loading="loading" type="primary" size="small" @click="submitForm('ruleForm')">确定</el-button>
						
					</el-form-item>
				</el-row>
			</el-form>
			
		</div>

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

				loading: false,
				
				ruleForm: {
					awbnumber:'',
					hwbnumber:'',
					rearchid:'',
					oldrearchid:'',
					totalpiecequantity:'',
					totalgrossweight:'',
					totalvolumnamount:'',
				},
				rules:{
					rearchid: [{
						required: true,
						message: '请输入运抵编号',
						trigger: ['blur', 'change']
					}],
					totalpiecequantity: [{
						required: true,
						message: '请输入件数',
						trigger: ['blur', 'change']
					}],
					totalgrossweight: [{
						required: true,
						message: '请输入毛重',
						trigger: ['blur', 'change']
					}],
					totalvolumnamount: [{
						required: true,
						message: '请输入体积',
						trigger: ['blur', 'change']
					}],
				}
			};
		},
		inject: ['queryList'],

		methods: {
			
			handleClose() {
				this.$emit("update:visible", false);
			},
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
			formatToFloat(item) {
				if (item == 'totalgrossweight') {
					this.ruleForm.totalgrossweight = this.ruleForm.totalgrossweight.replace(/[^0123456789.]/g, "");

					let t = this.ruleForm.totalgrossweight.split('.');
					if (t.length > 1) {
						this.ruleForm.totalgrossweight = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'totalvolumnamount') {					
					this.ruleForm.totalvolumnamount = this.ruleForm.totalvolumnamount.replace(/[^0123456789.]/g, "");

					let t = this.ruleForm.totalvolumnamount.split('.');
					if (t.length > 1) {
						this.ruleForm.totalvolumnamount = t[0] + "." + t[1].substr(0, 3);
					}
				} else if (item == 'totalpiecequantity') {
					this.ruleForm.totalpiecequantity = this.ruleForm.totalpiecequantity.replace(/[^0123456789]/g, "");
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.ruleForm.totalpiecequantity==0) {
							this.openError("件数不能为0");
							return;
						}
						if (this.ruleForm.totalgrossweight==0) {
							this.openError("重量不能为0");
							return;
						}
						if (this.ruleForm.totalvolumnamount==0) {
							this.openError("体积不能为0");
							return;
						}
						this.loading = true;
						this.$axios.post2('/afbase/fhl/doReset', this.ruleForm)
						.then(function(response) {
							if (response.data.code == 0) {
								this.openSuccess();
								this.queryList();
								this.handleClose();
							} else {
								this.loading = false
								this.openError(response.data.messageInfo);
							}
						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
							this.loading = false
						}.bind(this));
					} else {
						this.loading = false
						return false;
					}
				});
			}
			
			
		},
		created() {			
			this.ruleForm.awbnumber = this.frow.awbnumber;
			this.ruleForm.hwbnumber = this.frow.hwbnumber;
			this.ruleForm.rearchid = this.frow.rearchid;
			this.ruleForm.oldrearchid = this.frow.rearchid;

			this.ruleForm.totalpiecequantity = this.frow.totalpiecequantity;
			this.ruleForm.totalgrossweight = this.frow.totalgrossweight;
			this.ruleForm.totalvolumnamount = this.frow.totalvolumnamount;
			
		}
	}
</script>
<style>
	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
	.widthWithThree .el-input-group__prepend {
		padding: 0 27px;
	}
</style>
