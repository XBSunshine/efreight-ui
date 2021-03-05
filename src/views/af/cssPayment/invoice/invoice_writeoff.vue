<template>
	<el-dialog title="发票 - 核销" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :model="ruleForm" ref="ruleForm" label-width="15px" class="demo-ruleForm ef_input_icon">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:630px" v-model="ruleForm.customerName">
							<template slot="prepend">付款客户</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:305px" v-model="invoiceNum">
							<template slot="prepend">
								<span>发票号码</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.currency" style="width:165px" disabled :class="{currencyRedColor:ruleForm.currency!='CNY'}">
							<template slot="prepend">
								<span>发票金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-input v-model="amount" style="width:150px;margin-left: 15px;" disabled>
					</el-input>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFive" v-model="amountWriteoff" style="width:285px" disabled>
							<template slot="prepend">
								<span>已核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFive" v-model="amountNoWriteoff" style="width:305px;" disabled>
							<template slot="prepend">
								<span>未核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithSix2" @input="formatToFloat" v-model="ruleForm.amountWriteoff" style="width:330px" auto-complete="off" :disabled="flag" clearable>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>本次核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithTwo" auto-complete="off" style="width:285px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>科目</span>
							</template>
							<el-select slot="suffix" v-model="financialAccountId" @change="changeFinancialAccount" placeholder="请选择" style="width:188px;margin-right: -5px;">
								<el-option v-for="item in financialAccounts" :key="item.financialAccountId" :label="item.financialAccountName+' '+item.financialAccountCode" :value="item.financialAccountId">
									<span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="paymentDate">
						<el-input class="widthWithFourWithXing" style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>核销日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="核销日期" style="width: 208px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.writeoffRemark" type="textarea" auto-complete="off" style="width:950px;" :rows="3" show-word-limit maxlength="500">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
		<div style="margin:10px 10px 10px 10px;">
			<el-button :loading="loading" type="primary" size="small" v-on:click="doSave">确定</el-button>
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
				loading: true,
				flag: true,
				invoiceNum: '',
				amount: '',
				amountWriteoff: '',
				amountNoWriteoff: '',
				financialAccountId: '',
				ruleForm: {
					invoiceDetailId:this.frow.invoiceDetailId,
					customerId: '',
					customerName: '',
					currency: '',
					amountWriteoff: '',
					financialAccountName: '',
					financialAccountCode: '',
					financialAccountType: '',
					writeoffDate: this.getDateTime(new Date()),
					writeoffRemark: '',
					rowUuid: ''
				},
				financialAccounts: []
			}
		},
		inject: ['queryList'],
		created: function() {
			//科目
			this.$axios.post('/afbase/cssIncomeWriteoff/getFinancialAccount/' + this.frow.businessScope + '/' + this.frow.customerId).then((response) => {
				this.financialAccounts = response.data.data.filter(item => item.financialAccountCode != '')
				if(this.financialAccounts&&this.financialAccounts.length>0){
					this.financialAccountId = this.financialAccounts[0].financialAccountId
				this.changeFinancialAccount(this.financialAccountId)
				}
			})
			this.$axios.get('/afbase/cssCostInvoiceDetail/view/' + this.frow.invoiceDetailId).then((response) => {
				this.ruleForm.customerId = response.data.data.customerId
				this.ruleForm.customerName = response.data.data.customerName
				this.invoiceNum = response.data.data.invoiceNum
				this.ruleForm.currency = response.data.data.currency
				this.ruleForm.rowUuid = response.data.data.invoiceRowUuid
				this.amount = response.data.data.amount.toFixed(2)
				this.amountWriteoff = response.data.data.amountWriteoff.toFixed(2)
				this.amountNoWriteoff = response.data.data.amountNoWriteoff.toFixed(2)
					this.ruleForm.amountWriteoff = this.amountNoWriteoff
				if (response.data.data.amountNoWriteoff < 0) {
					this.flag = true
				} else {
					this.flag = false
				}
				this.loading=false
			}).catch((error) => {
				this.openError(error.response.data.messageInfo)
			})
		},
		methods: {
			changeFinancialAccount(financialAccountId) {
				let financialAccount = this.financialAccounts.filter(item => item.financialAccountId == financialAccountId)[0]
				this.ruleForm.financialAccountName = financialAccount.financialAccountName
				this.ruleForm.financialAccountCode = financialAccount.financialAccountCode
				this.ruleForm.financialAccountType = financialAccount.financialAccountType
			},
			formatToFloat() {
				this.ruleForm.amountWriteoff = this.ruleForm.amountWriteoff.replace(/[^0123456789.]/g, "");
				let t = this.ruleForm.amountWriteoff.split('.');
				if (t.length > 1) {
					this.ruleForm.amountWriteoff = t[0] + "." + t[1].substr(0, 2)
				}
			},
			doSave(formName) {
				if (this.ruleForm.amountWriteoff == null || this.ruleForm.amountWriteoff === '') {
					this.openError("本次核销金额不能为空")
					return
				}
				if (this.ruleForm.amountWriteoff == 0) {
					this.openError("本次核销金额不能等于0")
					return
				}
				if (parseFloat(this.ruleForm.amountWriteoff) > parseFloat(this.amountNoWriteoff)) {
					this.openError("本次核销金额不能超过未核销金额")
					return
				}
				if(!this.ruleForm.writeoffDate){
					this.openError("核销日期不能为空")
					return
				}
				if(!this.financialAccountId){
					this.openError("科目不能为空")
					return
				}
				this.loading = true
				this.$axios.post2('/afbase/cssCostInvoiceDetailWriteoff', this.ruleForm)
					.then((response) => {
						this.openSuccess("保存成功");
						this.loading = false
						this.queryList();
						this.handleClose();
					}).catch((error) => {
						this.loading = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					});
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
	.currencyRedColor input {
		color: red !important;
	}
</style>
