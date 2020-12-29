<template>
	<el-dialog title="汇率 - 新增" width="335px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="currency-rate-save-ruleForm" style="margin-left: 33px;">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="currencyCode"  required>
						<el-input style="width: 246px;" v-model="ruleForm.currencyCode" @input="checkCurrencyCode" auto-complete="off">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>币种</span>
              </template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" prop="currencyRate"  required>
            <el-input style="width: 246px;" v-model="ruleForm.currencyRate" auto-complete="off">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>汇率</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="beginDate" required>
            <el-input style="width: 210px">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>生效日期</span>
              </template>
              <el-date-picker slot="suffix" style="width: 167px; margin-right: -41px" v-model="ruleForm.beginDate" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期"> </el-date-picker>
            </el-input>
					</el-form-item>
				</el-col>
				<!--<el-col class="elementWidth">
					<el-form-item label="失效日期" label-width="85px" prop="endDate">
						<el-date-picker style="width: 135px;" v-model="ruleForm.endDate" type="date" value-format="yyyy-MM-dd 00:00:00" v-bind:disabled="disabledInput" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
				</el-col>-->
			</el-row>
      <el-row>
      </el-row>
			<el-row>
				<el-form-item >
					<el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabled">保存</el-button>
					<el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
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
			var isPriceVlidator = (rule, value, callback) => {
				var pattern = /^\d+(?:\.\d{1,4})?$/;
				if(!pattern.test(value)) {
					return callback(new Error('录入数字，如果有小数，小数点后最多只能输入四位'))
				} else {
					return callback()
				}
			}
			var checkCurrenceRateCode = (rule, value, callback) => {
				if(value.length != 3) {
					return callback(new Error('币种代码必须录入三位'))
				} else {
					let regx = /^[a-zA-Z0-9]{3}$/;
					if(regx.test(value)) {
						if(value == "CNY") {
							return callback('CNY 汇率不允许维护');
						}
						return callback()
					} else {
						return callback('只能录入数字和字母')
					}
				}
			}
			var checkBeginDate = (rule, value, callback) => {
				if(this.lastBeginDate != "") {
					var beginLast = new Date(this.lastBeginDate).getTime();
					var beginDateD = new Date(value).getTime();
					if(beginLast < beginDateD) {
						return callback()
					} else {
						return callback(new Error('生效日期必须晚于' + this.lastBeginDate.substr(0, 10)))
					}
				} else {
					return callback()
				}
			}
			var checkendDate = (rule, value, callback) => {
				if(value != null && value != "") {
					var endTimeD = new Date(value).getTime();
					var beginDateD = new Date(this.ruleForm.beginDate).getTime();
					if(endTimeD < beginDateD) {
						return callback(new Error('失效日期不能早于生效日期'))
					} else {
						return callback()
					}
				} else {
					return callback()
				}
			}
			return {
				ruleForm: {
					crId: "",
					currencyCode: '',
					currencyRate: '',
					beginDate: '',
					endDate: ''
				},
				rules: {
					currencyCode: [{
							required: true,
							message: '请录入币种代码',
							trigger: ['blur', 'change']
						},
						{
							validator: checkCurrenceRateCode,
							trigger: ['blur', 'change']
						}
					],
					currencyRate: [{
							required: true,
							message: '请输汇率',
							trigger: ['blur', 'change']
						},
						{
							validator: isPriceVlidator,
							trigger: ['blur', 'change']
						}
					],
					beginDate: [{
							required: true,
							message: '请选择生效日期',
							trigger: ['blur', 'change']
						},
						{
							validator: checkBeginDate,
							trigger: ['blur', 'change']
						}
					],
					endDate: [{
						validator: checkendDate,
						trigger: ['blur', 'change']
					}]
				},
				disabledInput: false,
				disabled: false,
				lastBeginDate: "",
				lastCrId: "",
			};
		},
		inject: ['findPage'],
		created: function() {
			// this.initData();
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
			checkCurrencyCode() {
				this.ruleForm.currencyCode = this.ruleForm.currencyCode.toUpperCase()
				if(this.ruleForm.currencyCode.length == 3) {
					this.$axios.get('/afbase/currencyrate/currencyCode/' + this.ruleForm.currencyCode)
						.then((response) => {
							if(response.data.code == 0) {
								if(response.data.data == null || response.data.data == "") {
									this.ruleForm.endDate = ''
									this.lastBeginDate = ''
									this.lastCrId = ''
									this.disabledInput = true;
								} else {
									this.disabledInput = false
									this.lastBeginDate = response.data.data.beginDate;
									this.lastCrId = response.data.data.crId;
								}
							} else {
								this.openError(response.data.messageInfo);
								this.disabled = true
								setTimeout(() => {
									this.handleClose()
								}, 1000);
							}
						}).catch((error) => {
							if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
								this.openError(error.response.data.messageInfo);
							}
							this.disabled = true
							setTimeout(() => {
								this.handleClose()
							}, 1000);
						});
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.ruleForm.currencyCode = this.ruleForm.currencyCode.toUpperCase()
						this.$axios.get('/afbase/currencyrate/getCurrencyByCode/' + this.ruleForm.currencyCode).then((response) => {
							if(response.data.code == 0) {
								if(response.data.data == null || response.data.data == "") {
									this.$message.error('录入的币种不存在');
								} else {
									this.$refs[formName].validate((valid) => {
										if(valid) {
											if(this.lastCrId != "") {
												this.ruleForm.crId = this.lastCrId;
											}
											let params = this.ruleForm;
											this.$axios.post2('/afbase/currencyrate', params)
												.then(function(response) {
													if(response.data.code == 0) {
														this.openSuccess();
														this.findPage();
														this.handleClose();
													} else {
														this.openError(response.data.messageInfo);
													}
												}.bind(this)).catch(function(error) {
													if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
														this.openError(error.response.data.messageInfo);
													}
												}.bind(this));
										} else {
											console.log('error submit!!');
											return false;
										}
									});
								}
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch((error) => {
							if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
								this.openError(error.response.data.messageInfo);
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
}
</script>
<style>
  .currency-rate-save-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .currency-rate-save-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .currency-rate-save-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }
  .currency-rate-save-ruleForm .el-input-group__prepend{
    width: 79px;
    text-align: center;
  }
</style>
