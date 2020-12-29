<template>
	<el-dialog title="海运船名 - 新增" width="560px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-left: 10px;">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item  prop="shipNameCn">
					   <el-input class="widthWithFourWithXingg" v-model="ruleForm.shipNameCn" clearable maxlength="100" auto-complete="off" style="width:500px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>船名(中文)</span>
							</template>
					   </el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item  prop="shipNameEn">
					   <el-input class="widthWithFourWithXingg" v-model="ruleForm.shipNameEn" clearable maxlength="100" auto-complete="off" style="width:500px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>船名(英文)</span>
							</template>
					   </el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
							<el-input class="widthWithThreee" clearable auto-complete="off" style="width:190px;margin-right: 0px;">
								<template slot="prepend">
									<span>是否生效</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.isValid"  placeholder="请选择" style="width:75px;margin-right: -5px;">
									<el-option label="是" key="1" value="true"></el-option>
							        <el-option label="否" key="0" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label-width="1px">
					<el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" size="small">保存</el-button>
					<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
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
			}
		},
		data() {
			return {
				loading: false,
				routingGroupNames: [],
				routingNames: [],
				ruleForm: {
					isValid:"true",
					shipNameEn:"",
					shipNameCn:""
				},
				rules: {
					shipNameEn: [{
						required: true,
						message: '请输入船名英文名称',
						trigger: ['blur', 'change']
					}, {
						max: 100,
						message: '长度不超过100',
						trigger: ['blur', 'change']
					}],
					shipNameCn: [{
						required: true,
						message: '请输入船名中文名称',
						trigger: ['blur', 'change']
					}, {
						max: 100,
						message: '长度不超过100',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			init() {
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2("/sc/orderShipInfo/doSave", params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.loading = false;
									this.openSuccess();
									this.handleClose();
								} else {
									this.loading = false;
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.loading = false;
								this.openError(response.data.messageInfo || "");
							}.bind(this))
					} else {
						return false;
					}
				});
			}
		},
		created() {
			this.init();
		}
	}

</script>

<style>
.widthWithThreee .el-input-group__prepend {
		padding: 0 30px !important;
	}
.widthWithFourWithXingg .el-input-group__prepend {
		padding: 0 20px;
	}


</style>
