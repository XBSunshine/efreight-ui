<template>
	<el-dialog title="派车单 - 车辆新增" width="660px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" show-close append-to-body>
		<div class="vlOrderEditPage" style="width: 650px;">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="truckNumber">
							<el-input maxlength="20" class="widthWithThreeWithXing" v-model="ruleForm.truckNumber" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>车牌号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="isValid">
							<el-input class="widthWithFourWithXing" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>是否有效</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.isValid" placeholder="请选择" style="width:198px;margin-right: -5px;" clearable>
									<el-option label="是" value="true"></el-option>
									<el-option label="否" value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="7" class="widthWithTwo" v-model="ruleForm.length" @input="formatToFloat('length')" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">长度</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="7" class="widthWithTwo" v-model="ruleForm.ton" @input="formatToFloat('ton')" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">吨位</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="7" class="widthWithTwo" v-model="ruleForm.weightLimit" @input="formatToFloat('weightLimit')" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">限重</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="7" v-model="ruleForm.volumeLimit" @input="formatToFloat('volumeLimit')" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">最大体积</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="20" v-model="ruleForm.driverName" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>司机姓名</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="20" v-model="ruleForm.driverTel" style="width:295px;">
								<template slot="prepend">
									<span>司机电话</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
				</el-row>
				<div style="padding:0px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-form-item>
						<el-button :loading="loading" type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
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
					truckNumber: '',
					isValid: 'true',
					length: '',
					ton: '',
					weightLimit: '',
					volumeLimit: '',
					driverName: '',
					driverTel: ''
				},
				rules: {
					truckNumber: [{
						required: true,
						message: '请录入车牌号',
						trigger: ['blur', 'change']
					}],
					isValid: [{
						required: true,
						message: '请选择是否有效',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['truckCallback'],
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
			submitForm(formName) {
				if (this.ruleForm.length === '0') {
					this.openError('长度不能为0')
					return
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.post2('/sc/lcTruck', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.truckCallback()
									this.openSuccess("保存成功")
									this.handleClose()
								} else {
									this.openError(response.data.messageInfo)
								}
								this.loading = false
							}).catch((error) => {
								this.openError(error.response.data.messageInfo)
								this.loading = false
							});
					}
				});
			},
			formatToFloat(prop) {
				if (prop == 'length') {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
					if (this.ruleForm[prop].startsWith("0")) {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
					}
				} else {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789.]/g, "");
					let t = this.ruleForm[prop].split('.');
					if (t.length > 1) {
						this.ruleForm[prop] = t[0] + "." + t[1].substr(0, 3);
					}
				}
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		},
		created() {

		}
	}
</script>
<style>
	.vlOrderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.vlOrderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
</style>
