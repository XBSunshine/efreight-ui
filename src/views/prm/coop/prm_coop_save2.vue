<template>
	<el-dialog title="新建下级客商资料" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
			<!-- <el-row>
        <el-form-item>
          <span>新建一级客商资料</span>
        </el-form-item>
      </el-row> -->
			<el-row>
				<el-col :span="5">
					<el-form-item label="客商资料代码">
						<el-input v-model="father_coop_code" auto-complete="off" :disabled="true" style="width:130px;text-align: right;">
						</el-input>
						<span class="el-icon-arrow-right"></span>
					</el-form-item>
				</el-col>
				<el-col :span="2">
					<el-form-item prop="son_coop_code" required style="margin-left: -100px;">
						<el-input v-model="ruleForm.son_coop_code" auto-complete="off" style="width:120px;" @input="ruleForm.son_coop_code = toFormatCoopCodeValue(ruleForm.son_coop_code)">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="7">
					<el-form-item label="客商资料类型" prop="coop_type" required>
						<!--<el-select v-model="ruleForm.coop_type" placeholder="请选择类型">
							<el-option label="外部客户" value="外部客户"></el-option>
							<el-option label="互为代理" value="互为代理"></el-option>
							<el-option label="海外代理" value="海外代理"></el-option>
							<el-option label="干线承运人" value="干线承运人"></el-option>
							<el-option label="延伸服务供应商" value="延伸服务供应商"></el-option>
							<el-option label="业务类结算对象" value="业务类结算对象"></el-option>
							<el-option label="非业务结算对象" value="非业务结算对象"></el-option>
						</el-select>-->
						<el-select v-model="ruleForm.coop_type"  placeholder="请选择" >
								<el-option v-for="item in coopTypeOptions" :key="item.code" :label="item.label" :value="item.value">
                                </el-option>
							</el-select>
					</el-form-item>
				</el-col>
        <el-col :span="7">
          <el-form-item label="负责人" prop="transactor_id" required>
            <el-select style="width: 100%;" v-model="ruleForm.transactor_id" filterable placeholder="请选择">
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="助记符" prop="coop_mnemonic" required>
						<el-input v-model="ruleForm.coop_mnemonic" auto-complete="off" @input="ruleForm.coop_mnemonic=toUpperCaseValue(ruleForm.coop_mnemonic)">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="社会信用代码" prop="social_credit_code" required>
						<el-input v-model="ruleForm.social_credit_code" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="22">
					<el-form-item label="中文全称" prop="coop_name" required>
						<el-input v-model="ruleForm.coop_name" @change="ruleForm.coop_name=strTrim(ruleForm.coop_name)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="22">
					<el-form-item label="英文全称" prop="coop_ename" required>
						<el-input v-model="ruleForm.coop_ename" @change="ruleForm.coop_ename=strTrim(ruleForm.coop_ename)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="中文简称" prop="short_name" required>
						<el-input v-model="ruleForm.short_name" @change="ruleForm.short_name=strTrim(ruleForm.short_name)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="英文简称" prop="short_ename" required>
						<el-input v-model="ruleForm.short_ename" @change="ruleForm.short_ename=strTrim(ruleForm.short_ename)" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="开户行" prop="bank_name">
						<el-input v-model="ruleForm.bank_name" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="银行账号" prop="bank_number">
						<el-input v-model="ruleForm.bank_number" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="电话" prop="phone_number">
						<el-input v-model="ruleForm.phone_number" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="地址" prop="coop_address">
						<el-input v-model="ruleForm.coop_address" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="22">
					<el-form-item label="备注" prop="coop_remark">
						<el-input v-model="ruleForm.coop_remark" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
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
			},
			frow: Object
		},
		data() {
			let numberAndCharacterValidator = (rule, value, callback) => {
				if(!value) {
					return callback();
				}
				let regE = /^[0-9a-zA-Z]*$/g;
				if(!regE.test(value)) {
					callback(new Error('请输入字母或数字'));
				} else {
					callback();
				}
			};
			return {
          useroptions: [],
          coopTypeOptions:[],
				ruleForm: {
					coop_code: '',
					coop_type: '',
					coop_mnemonic: '',
					coop_name: '',
					short_name: '',
					coop_ename: '',
					short_ename: '',
					social_credit_code: '',
					bank_name: '',
					bank_number: '',
					phone_number: '',
					coop_address: '',
					coop_remark: '',
					coop_status: '1',
					blackwhite_valid: '1',
					son_coop_code: '',
          transactor_id: ''
				},
				rules: {
					// coop_code: [
					//   { required: true, message: '请输入客商资料代码', trigger: ['blur', 'change']  },
					//   { min: 3, max: 3, message: '长度为 3', trigger: ['blur', 'change']  }
					// ],
					son_coop_code: [{
							required: true,
							message: '请输入客商资料代码',
							trigger: ['blur', 'change']
						},
						{
							min: 3,
							max: 3,
							message: '长度为 3',
							trigger: ['blur', 'change']
						},
						{
							validator: numberAndCharacterValidator,
							trigger: ['blur', 'change']
						}
					],
					coop_type: [{
						required: true,
						message: '请选择客商资料类型',
						trigger: ['blur', 'change']
					}],
          transactor_id: [{
                required: true,
                message: '请选择负责人',
                trigger: ['blur', 'change']
            }],
					coop_mnemonic: [{
							required: true,
							message: '请输入助记符',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						},
					],
					coop_name: [{
							required: true,
							message: '请输入中文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					short_name: [{
							required: true,
							message: '请输入中文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					coop_ename: [{
							required: true,
							message: '请输入英文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					short_ename: [{
							required: true,
							message: '请输入英文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					social_credit_code: [{
							required: true,
							message: '请输入社会信用代码',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],
					bank_name: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					bank_number: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					phone_number: [{
						min: 0,
						max: 20,
						message: '长度不超过 20',
						trigger: ['blur', 'change']
					}],
					coop_address: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					coop_remark: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					lock_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					blacklist_reason: [{
						min: 0,
						max: 4000,
						message: '长度不超过 4000',
						trigger: ['blur', 'change']
					}],
					whitelist_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}]
				},
				father_coop_code: ''

			};
		},
		created: function() {
			this.father_coop_code = this.frow.coop_code;
        this.$axios.get('/hrs/dept/selectUser')
            .then(function(response) {
                this.useroptions = response.data.data;
            }.bind(this));
        this.$axios.get('/afbase/awb/selectVCategory?category=合作伙伴分类').then(function(response) {
			this.coopTypeOptions = response.data.data;
		    }.bind(this));
		},
		inject: ['queryCoopList','continueOperation'],
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
				this.$refs[formName].validate((valid) => {
					if(valid) {
						// alert('submit!');
						// ruleForm.coop_code = this.father_coop_code+ruleForm.coop_code;
						let params = this.ruleForm;
						params.coop_code = this.father_coop_code + this.ruleForm.son_coop_code;
						// console.log(params.coop_code.length);
						if(params.coop_code.length > 15) {
							this.openError('超过层级限制');
							return;
						}
						this.$axios.post('/prm/coop/saveCoop',
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.queryCoopList();
									this.continueOperation(response.data.data.coop_id);
									this.handleClose();
								} else {
									let errorinfo = response.data.messageInfo;
									//唯一性错误
									if(errorinfo.indexOf('Duplicate entry') > -1) {
										if(errorinfo.indexOf('IDU_prm_coop_code') > -1)
											this.openError('客商资料代码不可重复');
										else if(errorinfo.indexOf('IDU_prm_coop_name') > -1)
											this.openError('客商资料中文名称不可重复');
										else if(errorinfo.indexOf('IDU_prm_short_name') > -1)
											this.openError('客商资料中文简称不可重复');
										else if(errorinfo.indexOf('IDU_prm_coop_ename') > -1)
											this.openError('客商资料英文全称不可重复');
										else if(errorinfo.indexOf('IDU_prm_short_ename') > -1)
											this.openError('客商资料英文简称不可重复');
										else if(errorinfo.indexOf('IDU_prm_social_credit_code') > -1)
											this.openError('客商资料社会信用代码不可重复');
										else
											this.openError(errorinfo);
									} else {
										this.openError(errorinfo);
									}
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

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			toFormatCoopCodeValue(val) {
				return val.replace("0", "").replace("1", "").toUpperCase();
			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">

</style>
