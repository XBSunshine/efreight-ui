<template>
	<el-dialog title="服务类别 - 编辑" width="850px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<div class="orderEditPage">
		<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
			<el-row>
<!--				<el-col class="elementWidth">
					<el-form-item label="" prop="serviceCode">
						<el-input v-model="ruleForm.serviceCode" disabled style="width:240px;margin-right: 15px;">
				    	<template slot="prepend">服务代码</template>
				  		</el-input>
					</el-form-item>
				</el-col>-->
        <el-col class="elementWidth">
          <el-form-item label="" prop="serviceMnemonic">
            <el-input class="widthWithThreeWithXing" clearable v-model="ruleForm.serviceMnemonic" style="width:240px;margin-right: 15px;" maxlength="10" @input="ruleForm.serviceMnemonic=ruleForm.serviceMnemonic.toUpperCase()">
              <template slot="prepend"><b style="color:red">*</b>助记码</template>
            </el-input>
          </el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="serviceNameCn">
						<el-input clearable v-model="ruleForm.serviceNameCn" class="widthWithFive2"  style="width:240px;margin-right: 15px;">
				    	<template slot="prepend"><b style="color:red">*</b>中文名称</template>
				  		</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="serviceNameEn">
						<el-input clearable v-model="ruleForm.serviceNameEn" class="widthWithFive2"  style="width:280px;">
				    	<template slot="prepend"><b style="color:red">*</b>英文名称</template>
				  		</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row style="height: 45px;margin-top: -20px;">
        <el-divider style="margin-top: 1px;"></el-divider>
      </el-row>
			<el-row class="A">
				<el-col class="elementWidth" >
					<el-form-item label="" prop="">
						<el-input style="width:240px;margin-right: 15px;">
				    	<template slot="prepend">默认应收</template>

						<el-select slot="suffix" v-model="ruleForm.defaultIncome" placeholder="请选择" style="width:143px; margin-right:-5px">
			          		<el-option label="是" :value="1">
								</el-option>
								<el-option label="否" :value="0">
								</el-option>
			        </el-select>
				  		</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" >
					<el-form-item label="" prop="">
						<el-input style="width:240px;margin-right: 15px;">
				    	<template slot="prepend">收费标准</template>

						<el-select slot="suffix" clearable v-model="ruleForm.incomeChargeStandard" placeholder="请选择" style="width:143px; margin-right:-5px">
			          <el-option
			            v-for="item in incomeChargeStandardOptions"
			            :key="item.value"
			            :label="item.label"
			            :value="item.value">
			          </el-option>
			        </el-select>
				  		</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="incomeUnitPrice">
						<el-input v-model="ruleForm.incomeUnitPrice" @change="ruleForm.incomeUnitPrice=strTrim(ruleForm.incomeUnitPrice)" @input="formatToFloat('incomeUnitPrice')" auto-complete="off" style="width:280px;">
				    	<template slot="prepend">收费单价</template>

				    	<el-select slot="append" v-model="ruleForm.incomeCurrency" filterable placeholder="请选择" style="width:80px">
							<el-option v-for="item in incomeCurrencyOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
							</el-option>
						</el-select>
				  		</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row class="A">
        <el-col class="elementWidth">
          <el-form-item label="" prop="incomeAmountMin">
            <el-input v-model="ruleForm.incomeAmountMin" style="width:240px;margin-right: 15px;" @input="formatToFloat('incomeAmountMin')">
              <template slot="prepend">最低收费</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="incomeAmountMax">
            <el-input v-model="ruleForm.incomeAmountMax" style="width:240px;margin-right: 15px;" @input="formatToFloat('incomeAmountMax')">
              <template slot="prepend">最高收费</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
         <el-form-item>
         	<el-input style="width:280px;">
         		<template slot="prepend">小数位&emsp;</template>
         		<el-select slot="suffix" v-model="ruleForm.incomeAmountDigits"  style="width:75px;margin-right: -5px;">
         			<el-option label="0" value="0"></el-option>
         			<el-option label="1" value="1"></el-option>
         			<el-option label="2" value="2"></el-option>
         		</el-select>
         		<el-select slot="append" v-model="ruleForm.incomeAmountCarry"  style="width:108px;background-color:#FFF;color: #606266;height: 28px;margin-top: -5px;">
         			<el-option label="四舍五入" value="四舍五入"></el-option>
         			<el-option label="向上进位" value="向上进位"></el-option>
         		</el-select>
         	</el-input>
         </el-form-item>
        </el-col>
      </el-row>
      <el-row style="height: 45px;margin-top: -20px;">
        <el-divider style="margin-top: 1px;"></el-divider>
      </el-row>
			<el-row class="B">
				<el-col class="elementWidth" >
					<el-form-item label="" prop="">
						<el-input style="width:240px;margin-right: 15px;">
				    	<template slot="prepend">默认应付</template>

						<el-select slot="suffix" v-model="ruleForm.defaultCost" placeholder="请选择" style="width:143px; margin-right:-5px">
			          		<el-option label="是" :value="1">
								</el-option>
								<el-option label="否" :value="0">
								</el-option>
			        </el-select>
				  		</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" >
					<el-form-item label="" prop="">
						<el-input style="width:240px;margin-right: 15px;">
				    	<template slot="prepend">付费标准</template>

						<el-select slot="suffix" clearable v-model="ruleForm.costChargeStandard" placeholder="请选择" style="width:143px; margin-right:-5px">
			          <el-option
			            v-for="item in costChargeStandardOptions"
			            :key="item.value"
			            :label="item.label"
			            :value="item.value">
			          </el-option>
			        </el-select>
				  		</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="costUnitPrice">
						<el-input v-model="ruleForm.costUnitPrice" @change="ruleForm.costUnitPrice=strTrim(ruleForm.costUnitPrice)" @input="formatToFloat('costUnitPrice')" auto-complete="off" style="width:280px;">
				    	<template slot="prepend">付费单价</template>

				    	<el-select slot="append" v-model="ruleForm.costCurrency" filterable placeholder="请选择" style="width:80px">
							<el-option v-for="item in incomeCurrencyOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
							</el-option>
						</el-select>
				  		</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row class="B">
        <el-col class="elementWidth">
          <el-form-item label="" prop="">
            <el-input v-model="ruleForm.costAmountMin" style="width:240px;margin-right: 15px;" @input="formatToFloat('costAmountMin')">
              <template slot="prepend">最低收费</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="">
            <el-input v-model="ruleForm.costAmountMax" style="width:240px;margin-right: 15px;" @input="formatToFloat('costAmountMax')">
              <template slot="prepend">最高收费</template>
            </el-input>
          </el-form-item>
        </el-col>
       <el-col class="elementWidth">
        <el-form-item>
        	<el-input style="width:280px;">
        		<template slot="prepend">小数位&emsp;</template>
        		<el-select slot="suffix" v-model="ruleForm.costAmountDigits"  style="width:75px;margin-right: -5px;">
        			<el-option label="0" value="0"></el-option>
        			<el-option label="1" value="1"></el-option>
        			<el-option label="2" value="2"></el-option>
        		</el-select>
        		<el-select slot="append" v-model="ruleForm.costAmountCarry"  style="width:108px;background-color:#FFF;color: #606266;height: 28px;margin-top: -5px;">
        			<el-option label="四舍五入" value="四舍五入"></el-option>
        			<el-option label="向上进位" value="向上进位"></el-option>
        		</el-select>
        	</el-input>
        </el-form-item>

       </el-col>
      </el-row>
      <el-row style="height: 45px;margin-top: -20px;">
        <el-divider style="margin-top: 1px;"></el-divider>
      </el-row>
			<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" prop="serviceRemark">
							<el-input v-model="ruleForm.serviceRemark" @change="ruleForm.serviceRemark=strTrim(ruleForm.serviceRemark)" auto-complete="off" style="width:810px" maxlength="100">
					    	<template slot="prepend">服务备注</template>

					  		</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			<!-- <el-row>
				<el-col class="elementWidth">
					<el-form-item label="操作人">
						<span>{{userName}}/{{editTime}}</span>
					</el-form-item>
				</el-col>
			</el-row> -->
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button size="small" type="primary" @click="submitForm('ruleForm')">修改</el-button>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" style="margin-left:450px">
					<el-form-item label="">
						<span>上次修改人员：{{userName}}<br />上次修改时间：{{editTime}}</span>
					</el-form-item>
				</el-col>
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
			let numberValidator = (rule, value, callback) => {
				if(value.length > 6) {
					return callback(new Error('最大输入6位'));
				}
				let regE = /^(0|[1-9]\d*)$/;
				if(!regE.test(value)) {
					callback(new Error('请输入整数'));
				} else {
					callback();
				}
			};
			return {
				userName: '',
				editTime: '',
				incomeChargeStandardOptions:[],
				costChargeStandardOptions:[],
				incomeCurrencyOptions:[],
				costCurrencyOptions:[],
				ruleForm: {
					serviceId: '',
					businessScope: '',
					serviceType: '',
					serviceCode: '',
					serviceNameCn: '',
					serviceNameEn: '',
					vatOutput: '',
					vatInput: '',
					isFrequent: "false",
					isValid: "1",
					defaultIncome:'',
					incomeChargeStandard:'',
					incomeCurrency:'CNY',
					incomeUnitPrice:'',
					defaultCost:'',
					costChargeStandard:'',
					costCurrency:'CNY',
					costUnitPrice:'',
					serviceRemark:'',
          incomeAmountMin: '',
          incomeAmountMax: '',
          incomeAmountDigits:2,
          incomeAmountCarry:'四舍五入',
          costAmountMin:'',
          costAmountMax:'',
          costAmountDigits:2,
          costAmountCarry:'四舍五入',
          serviceMnemonic:'',
				},
				rules: {
					serviceNameCn: [{
							required: true,
							message: '请输入服务中文名称',
							trigger: ['blur', 'change']
						},
						{
							max: 40,
							message: '最大长度为 40',
							trigger: ['blur', 'change']
						}
					],
					serviceNameEn: [{
							required: true,
							message: '请输入服务英文名称',
							trigger: ['blur', 'change']
						},
						{
							max: 60,
							message: '最大长度为 60',
							trigger: ['blur', 'change']
						}
					],
					vatOutput: [{
							required: true,
							message: '请输入销项税率',
							trigger: ['blur', 'change']
						},
						{
							validator: numberValidator,
							trigger: ['blur', 'change']
						}
					],
					vatInput: [{
							required: true,
							message: '请输入进项税率',
							trigger: ['blur', 'change']
						},
						{
							validator: numberValidator,
							trigger: ['blur', 'change']
						}

					],
					isFrequent: [{
						required: true,
						message: '请选择是否常用',
						trigger: ['blur', 'change']
					}],
					isValid: [{
						required: true,
						message: '请选择是否有效',
						trigger: ['blur', 'change']
					}],
          serviceMnemonic: [{
              required: true,
              message: '请输入助记码',
              trigger: ['blur', 'change']
          }]
				}
			};
		},
		inject: ['getPage'],
		created() {
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.incomeCurrencyOptions = response.data.data;
				// if(this.incomeCurrencyOptions && this.incomeCurrencyOptions[0]) {
				// 	if('CNY' != this.incomeCurrencyOptions[0].currency_code) {
				// 		// this.ruleForm.incomeCurrency = this.incomeCurrencyOptions[0].currency_code;
				// 		// this.ruleForm.costCurrency = this.incomeCurrencyOptions[0].currency_code;
				// 	}
        //
				// }
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory/收费标准/'+this.frow.businessScope).then(function(response) {
				this.incomeChargeStandardOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory/收费标准/'+this.frow.businessScope).then(function(response) {
				this.costChargeStandardOptions = response.data.data;
			}.bind(this));
			this.init()
		},
		methods: {
			init() {
				this.ruleForm.serviceId = this.frow.serviceId
				this.$axios.get2('/afbase/service/detail', {
					serviceId: this.ruleForm.serviceId
				}).then((response) => {
					if(response.data.code == '0') {
						this.ruleForm=response.data.data
						// this.ruleForm.businessScope = response.data.data.businessScope;
						// this.ruleForm.serviceType = response.data.data.serviceType;
						// this.ruleForm.serviceCode = response.data.data.serviceCode;
						// this.ruleForm.serviceNameCn = response.data.data.serviceNameCn;
						// this.ruleForm.serviceNameEn = response.data.data.serviceNameEn;
						// this.ruleForm.vatOutput = response.data.data.vatOutput;
						// this.ruleForm.vatInput = response.data.data.vatInput;
						// this.ruleForm.isFrequent = response.data.data.isFrequent;
						// this.ruleForm.isValid = response.data.data.isValid;
						if (this.ruleForm.editorName) {
							this.userName = response.data.data.editorName;
							this.editTime = response.data.data.editTime;
						}else{
							this.userName = response.data.data.creatorName;
							this.editTime = response.data.data.createTime;
						}

					} else {
						this.openError(response.data.messageInfo, "查询详情")
					}
				}).catch(function(error) {
					console.log(error);
				});
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$axios.put('/afbase/service',
								this.ruleForm)
							.then((response) => {
								if(response.data.code == 0) {
									this.openSuccess();
									this.getPage();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo)
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
			formatToFloat(item) {
				if(item == 'incomeUnitPrice') {
					this.ruleForm.incomeUnitPrice = this.ruleForm.incomeUnitPrice.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.incomeUnitPrice.split('.');
					if(t.length > 1) {
						this.ruleForm.incomeUnitPrice = t[0] + "." + t[1].substr(0, 3);
					}
				} else if(item == 'costUnitPrice') {
					this.ruleForm.costUnitPrice = this.ruleForm.costUnitPrice.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.costUnitPrice.split('.');
					if(t.length > 1) {
						this.ruleForm.costUnitPrice = t[0] + "." + t[1].substr(0, 3);
					}
				}else if(item == 'costAmountMax'){
          this.ruleForm.costAmountMax = this.ruleForm.costAmountMax.replace(/[^0123456789.]/g, "");
          let t = this.ruleForm.costAmountMax.split('.');
          if(t.length > 1) {
          	this.ruleForm.costAmountMax = t[0] + "." + t[1].substr(0, 2);
          }
        }else if(item == 'costAmountMin'){
          this.ruleForm.costAmountMin = this.ruleForm.costAmountMin.replace(/[^0123456789.]/g, "");
          let t = this.ruleForm.costAmountMin.split('.');
          if(t.length > 1) {
          	this.ruleForm.costAmountMin = t[0] + "." + t[1].substr(0, 2);
          }
        }else if(item == 'incomeAmountMax'){
          this.ruleForm.incomeAmountMax = this.ruleForm.incomeAmountMax.replace(/[^0123456789.]/g, "");
          let t = this.ruleForm.incomeAmountMax.split('.');
          if(t.length > 1) {
          	this.ruleForm.incomeAmountMax = t[0] + "." + t[1].substr(0, 2);
          }
        }else if(item == 'incomeAmountMin'){
          this.ruleForm.incomeAmountMin = this.ruleForm.incomeAmountMin.replace(/[^0123456789.]/g, "");
          let t = this.ruleForm.incomeAmountMin.split('.');
          if(t.length > 1) {
          	this.ruleForm.incomeAmountMin = t[0] + "." + t[1].substr(0, 2);
          }
        }

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
