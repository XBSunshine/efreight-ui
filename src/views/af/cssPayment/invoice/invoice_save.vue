<template>
	<el-dialog title="对账单 - 付款申请" width="760px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :model="ruleForm" label-width="15px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:710px" v-model="ruleForm.customerName">
							<template slot="prepend">付款客户</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.currency" style="width:205px" disabled :class="{currencyRedColor:ruleForm.currency!='CNY'}">
							<template slot="prepend">
								<span>付款金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-input v-model="ruleForm.amountPayment" style="width:180px;margin-left: 15px;" disabled>
					</el-input>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="exchangeRate">
						<el-input disabled v-model="ruleForm.paymentNum" style="width:295px">
							<template slot="prepend">
								<span>对账编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>付款申请备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.applyRemark" type="textarea" auto-complete="off" style="width:710px;" :rows="3" show-word-limit maxlength="500">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
		<div style="margin:10px 10px 10px 10px;">
			<el-button :loading="loading" type="primary" size="small" v-on:click="doSave">确定</el-button>
			<el-button type="primary" size="small" v-on:click="doSaveAndPrint">确定并打印申请单</el-button>
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
				loading:false,
				ruleForm: {
					paymentNum: '',
					customerId: null,
					customerName: null,
					currency: '',
					amountPayment: null,
					applyRemark: ''
				}
			}
		},
		inject: ['queryList'],
		created: function() {
			this.ruleForm.customerName = this.frow.customerName
			this.ruleForm.amountPayment = this.frow.amountPaymentStr.split(' ')[0]
			this.ruleForm.paymentNum = this.frow.paymentNum
			this.ruleForm.currency = this.frow.currency
			this.ruleForm.paymentId = this.frow.paymentId
			this.ruleForm.customerId = this.frow.customerId
			this.ruleForm.businessScope = this.frow.businessScope
			this.ruleForm.rowUuid = this.frow.rowUuid
			this.ruleForm.applyRemark = this.frow.invoiceInqurityRemark
		},
		methods: {
			doSave() {
				if (this.ruleForm.amountPayment == null || this.ruleForm.amountPayment === '') {
					this.openError("付款金额不能为空")
					return
				}
				if (this.ruleForm.amountPayment == 0) {
					this.openError("付款金额不能等于0")
					return
				}
				this.loading = true
				this.$axios.post2('/afbase/cssCostInvoice', this.ruleForm)
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
			doSaveAndPrint() {
				this.openError('功能暂未开发，敬请期待。')
				return
				if (this.ruleForm.amountPayment == null || this.ruleForm.amountPayment === '') {
					this.openError("对账金额不能为空")
					return
				}
				if (this.ruleForm.amountPayment == 0) {
					this.openError("对账金额不能等于0")
					return
				}
				this.$axios.post2('/afbase/cssCostInvoice', this.ruleForm)
					.then((response) => {
						if (response.data.code == 0) {
							this.openSuccess("保存成功");
							this.queryList();
							this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}

					}).catch((error) => {
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