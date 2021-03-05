<template>
	<el-dialog :title="titleName" width="750px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="15px" class="demo-ruleForm ef_input_icon invoiceDeatailSave">
      <el-row>
      	<el-col class="elementWidth">
      		<el-form-item prop="customerName">
      			<el-input class="widthWithFourWithXing" auto-complete="off" disabled v-model="ruleForm.customerName" style="width:704px" show-word-limit maxlength="100">
      				<template slot="prepend">
      					<span>&nbsp;&thinsp;收款客户</span>
      				</template>
      			</el-input>
      		</el-form-item>
      	</el-col>
      </el-row>
      <el-row>
      	<el-col class="elementWidth">
      		<el-form-item prop="invoiceTitle">
      			<el-input class="widthWithFourWithXing" auto-complete="off" clearable v-model="ruleForm.invoiceTitle" style="width:704px" show-word-limit maxlength="200">
      				<template slot="prepend">
      					<font style="color: red;">*</font>
      					<span>发票抬头</span>
      				</template>
      			</el-input>
      		</el-form-item>
      	</el-col>
      </el-row>
      <el-row>
				<el-col class="elementWidth">
					<el-form-item prop="invoiceNum">
						<el-input class="widthWithFourWithXing" auto-complete="off" clearable v-model="ruleForm.invoiceNum" style="width:455px" show-word-limit maxlength="100">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票号码</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="invoiceDate">
						<el-input class="widthWithFourWithXing" style="width:235px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.invoiceDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" style="width: 138px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="currency">
						<el-input class="widthWithTwoWithXing" v-model="ruleForm.currency" style="width:165px" disabled :class="{currencyRedColor:ruleForm.currency!='CNY'}">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>币种</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFourWithXing" v-model="ruleForm.amountWriteoff" style="width:275px" disabled>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="invoiceType">
						<el-input class="widthWithFourWithXing" auto-complete="off" style="width:235px;" clearable>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票类型</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.invoiceType" placeholder="请选择" style="width:138px;margin-right: -5px;" clearable>
								<el-option v-for="item,index in invoiceTypes" :key="index" :label="item.paramText" :value="item.paramText">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithSix2" v-model="ruleForm.taxpayerNum" auto-complete="off" clearable style="width:705px;" maxlength="30">
							<template slot="prepend">
								<span>社会信用代码</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithTwo" v-model="ruleForm.address" style="width:345px" auto-complete="off" clearable maxlength="100">
							<template slot="prepend">
								<span>地址</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithTwo" v-model="ruleForm.phoneNumber" style="width:345px" auto-complete="off" clearable maxlength="50">
							<template slot="prepend">
								<span>电话</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithThree" v-model="ruleForm.bankName" style="width:345px" auto-complete="off" clearable maxlength="100">
							<template slot="prepend">
								<span>开户行</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.bankNumber" style="width:345px" auto-complete="off" clearable maxlength="50">
							<template slot="prepend">
								<span>银行账号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>发票备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.invoiceRemark" type="textarea" auto-complete="off" style="width:705px;" :rows="3" show-word-limit maxlength="500">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithTwoWithXing" auto-complete="off" style="width:455px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>科目</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.financialAccountName" placeholder="请选择" style="width:358px;margin-right: -5px;"   @change="setFinancialAccount">
								<el-option v-for="(item,index) in financialAccounts" :key="item.financialAccountId" :label="`${item.financialAccountName} ${item.financialAccountCode}`" :value="item.financialAccountId">
								    <span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
								  </el-option>
								</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="writeoffDate">
						<el-input style="width:235px;" class="widthWithFourWithXing">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>核销日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="核销日期" style="width: 138px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" clearable v-model="ruleForm.writeoffRemark" style="width:705px" show-word-limit maxlength="200">
							<template slot="prepend">
								<span>核销备注</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div style="padding:0px 0px 10px 0px">
			<HR color="#eee" size="5">
			</HR>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button :loading="loading" type="primary" size="small" v-on:click="doSave('ruleForm')">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
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
					invoiceNum: '',
					invoiceDate: this.getDateTime(new Date()),
					currency: this.frow.currency,
					businessScope: this.frow.businessScope,
					customerId: this.frow.customerId,
					customerName: this.frow.customerName,
          invoiceTitle: this.frow.customerName,
					amountWriteoff: this.frow.currencyAmount.substr(0,this.frow.currencyAmount.indexOf('(')).replace(",",''),
          businessScope:this.frow.businessScope,
					invoiceType: '',
					taxpayerNum: '',
					address: '',
					phoneNumber: '',
					bankName: '',
					bankNumber: '',
					invoiceRemark: '',
          debitNoteId:this.frow.debitNoteId,
          statementId:this.frow.statementId,
					writeoffDate: this.getDateTime(new Date()),
					writeoffRemark: '',
					financialAccountName:'',
					financialAccountCode:'',
					financialAccountType:'',
					invoiceRowUuid:this.frow.rowUuid,
          titleName:this.frow.titleName,
				},
        titleName:'',
				invoiceTypes: [],
				financialAccounts: [],
				financialAccountId: '',
				rules: {
          invoiceTitle: [{
          	required: true,
          	message: '请选择发票抬头',
          	trigger: ['blur', 'change']
          }],
					currency: [{
						required: true,
						message: '请选择币种',
						trigger: ['blur', 'change']
					}],
					invoiceType: [{
						required: true,
						message: '请选择发票类型',
						trigger: ['blur', 'change']
					}],
					invoiceNum: [{
						required: true,
						message: '请录入发票号码',
						trigger: ['blur', 'change']
					}],
					amount: [{
							required: true,
							message: '请录入发票金额',
							trigger: ['blur', 'change']
						}
					],
					invoiceDate: [{
						required: true,
						message: '请录入发票日期',
						trigger: ['blur', 'change']
					}],
					writeoffDate: [{
						required: true,
						message: '请录入核销日期',
						trigger: ['blur', 'change']
					}]
				}

			}
		},
		inject: ['queryList'],
		created: function() {
      this.titleName=this.frow.titleName+"-核销";
			//发票类型
			this.$axios.get('/afbase/category/queryCategoryByCategoryType/28')
				.then((response) => {
					this.invoiceTypes = response.data.data
				})
			//科目
			this.$axios.post('/afbase/cssIncomeWriteoff/getFinancialAccount/' + this.frow.businessScope + '/' + this.frow.customerId).then((response) => {
				this.financialAccounts = response.data.data.filter(item => item.financialAccountCode != '')
				if(this.financialAccounts.length > 0){
				    for (var i = 0; i < this.financialAccounts.length; i++) {
				        if(this.financialAccounts[i].financialAccountName === '银行存款'){
				            this.ruleForm.financialAccountName = this.financialAccounts[i].financialAccountName + " " + this.financialAccounts[i].financialAccountCode;
				            this.ruleForm.financialAccountCode = this.financialAccounts[i].financialAccountCode;
				            this.ruleForm.financialAccountType = this.financialAccounts[i].financialAccountType;
				        }
				    }
				    if(!this.ruleForm.financialAccountName){
				        this.ruleForm.financialAccountName = this.financialAccounts[0].financialAccountName + " " + this.financialAccounts[0].financialAccountCode;
				        this.ruleForm.financialAccountCode = this.financialAccounts[0].financialAccountCode;
				        this.ruleForm.financialAccountType = this.financialAccounts[0].financialAccountType;
				    }
				}
			})
			//查询付款客户
			this.$axios.get('/prm/coop/'+this.frow.customerId)
				.then((response) => {
					if(response.data.code==0){
					this.ruleForm.taxpayerNum = response.data.data.social_credit_code
					this.ruleForm.address = response.data.data.coop_address
					this.ruleForm.phoneNumber = response.data.data.phone_number
					this.ruleForm.bankName = response.data.data.bank_name
					this.ruleForm.bankNumber = response.data.data.bank_number
					}
				})
			if(this.frow.currency=='CNY'){
				this.ruleForm.invoiceType = '增值税普票'
			}else{
				this.ruleForm.invoiceType = 'DebitNote'
			}
		},
		methods: {
			//科目选择
			setFinancialAccount(vId) {
			      let obj = {};
			      obj = this.financialAccounts.find((item) => {
			          return item.financialAccountId === vId;
			      });
			      if (obj) {
			          this.ruleForm.financialAccountName = obj.financialAccountName + " " + obj.financialAccountCode;
			          this.ruleForm.financialAccountCode = obj.financialAccountCode;
			          this.ruleForm.financialAccountType = obj.financialAccountType;
			      }
			  },
			doSave(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						if(!this.ruleForm.financialAccountCode){
              this.loading = false;
							this.openError('科目不能为空')
							return false
						}
						this.$axios.post2('/afbase/cssIncomeInvoiceDetailWriteoff/invoiceAuto', this.ruleForm)
							.then((response) => {
                  this.loading = false
                  if (response.data.code == 0) {
                  	this.openSuccess("核销成功");
                  	this.queryList();
                  	this.handleClose();
                  } else {
                  	this.openError(response.data.messageInfo);
                  }
							}).catch((error) => {
								this.loading = false
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo)
							});
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
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
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date;
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
	.invoiceDeatailSave .el-form-item__error {
		margin-top: -5px;
	}

	.currencyRedColor input {
		color: red !important;
	}
</style>
