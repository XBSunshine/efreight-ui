<template>
	<el-dialog title="车辆信息 - 新增" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
		<div class="lc_base_truck_save">
			<el-form v-loading="vLoad" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" style="margin-right: 10px;">
				<el-row>
					<el-col :span="12">
						<el-form-item prop="truckNumber">
							<el-input v-model="ruleForm.truckNumber" show-word-limit maxlength="20" clearable>
								<template slot="prepend"> <span style="color:red">*</span>车牌号</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item prop="length">
							<el-input maxlength="7" v-model="ruleForm.length" clearable @input="onlyNumber('length')">
								<template slot="prepend">车长</template>
								<template slot="append"><span>米</span></template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="ton">
							<el-input maxlength="7" v-model="ruleForm.ton" clearable @input="onlyNumber('ton')" @change="formatDecimalPlaces('ton')">
								<template slot="prepend">吨位</template>
								<template slot="append"><span>TON</span></template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item prop="weightLimit">
							<el-input maxlength="7" v-model="ruleForm.weightLimit" clearable @input="onlyNumber('weightLimit')" @change="formatDecimalPlaces('weightLimit')">
								<template slot="prepend">限重</template>
								<template slot="append"><span>KG</span></template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="volumeLimit">
							<el-input maxlength="7" v-model="ruleForm.volumeLimit" clearable @input="onlyNumber('volumeLimit')" @change="formatDecimalPlaces('volumeLimit')">
								<template slot="prepend">最大体积</template>
								<template slot="append"><span>CBM</span></template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item prop="driverName">
							<el-input v-model="ruleForm.driverName" clearable show-word-limit maxlength="20">
								<template slot="prepend">司机姓名</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="driverTel">
							<el-input v-model="ruleForm.driverTel" clearable show-word-limit maxlength="100">
								<template slot="prepend">司机电话</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item>
					<el-button type="primary" :loading="loading" size="small" @click="submitForm('ruleForm')">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		name: "lc_base_truck_save",
		props: {
			visible: {
				type: Boolean,
				default: false
			},
		},
		inject: ["findByPage"],
		data() {
			const checkLength = (rule, val, callback) => {
				console.log(rule);
				try {
					if (parseInt(val) <= 0) {
						callback(rule.message)
					}
				} catch (e) {}
				callback();
			}
			return {
				vLoad: false,
				loading: false,
				ruleForm: {
					truckNumber: '',
					length: '',
					ton: '',
					weightLimit: '',
					volumeLimit: '',
					driverName: '',
					driverTel: '',
				},
				rules: {
					truckNumber: [{
							required: true,
							message: '请输入车牌号',
							trigger: 'blur'
						},
						{
							max: 20,
							message: '最多20字符',
							trigger: 'blur'
						}
					],
					length: [{
						validator: checkLength,
						trigger: ['blur', 'change'],
						message: '不能小于或等于0'
					}],
					routingName: [{
						max: 50,
						message: '最大50字符',
						trigger: 'blur'
					}],
				}
			}
		},
		methods: {
			handleClose() {
				this.$emit('update:visible', false);
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
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						this.$axios.post2("/sc/lcTruck/saveLcTruck", this.ruleForm)
							.then(function(response) {
								if (response.data.code == 0) {
									this.$emit('update:visible', false);
									this.findByPage();
								} else {
									this.loading = false;
									this.openError(response.data.messageInfo || '操作失败');
								}
							}.bind(this))
							.catch(function(error) {
								this.loading = false;
								this.openError(error)
							}.bind(this))

					} else {
						return false;
					}
				});
			},
			onlyNumber(prop) {
				 if (prop == 'length') {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
					if (this.ruleForm[prop].startsWith("0")) {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
					}
				}else {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789.]/g, "");
					let t = this.ruleForm[prop].split('.');
					if (t.length > 1) {
						this.ruleForm[prop] = t[0] + "." + t[1].substr(0, 3);
					}
				}
			},
			formatDecimalPlaces(fieldName, precision) {
				precision = (precision || 3);
				if (this.ruleForm[fieldName]) {
					let t = this.ruleForm[fieldName].split('.');
					if (t.length > 1) {
						if (t[1].length < precision) {
							this.ruleForm[fieldName] = t[0] + "." + t[1] + "000".substr(0, precision - t[1].length);
						} else {
							this.ruleForm[fieldName] = parseFloat(t[0] + "." + t[1]).toFixed(precision);
						}
					} else {
						if (this.precision !== 0) {
							this.ruleForm[fieldName] = t[0] + "." + "000".substr(0, precision);
						}
					}
				}
			}
		},
		created() {

		}
	}
</script>
<style type="text/css">
	.lc_base_truck_save .el-input__icon {
		line-height: 30px !important;
	}

	.lc_base_truck_save .el-input-group__prepend {
		width: 100px;
		text-align: center;
	}
</style>
