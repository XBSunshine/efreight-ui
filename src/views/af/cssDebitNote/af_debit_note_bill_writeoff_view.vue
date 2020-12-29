<template>
	<el-dialog title="核销 - 查看" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-50px;">
		<div class="orderEditPage">
			<el-form disabled :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm.customerName" style="width:775px;margin-right: 15px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm.debitNoteNum" style="width:255px;">
								<template slot="prepend">{{name}}编号</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm.writeoffNum" style="width:260px;margin-right: 15px;">
								<template slot="prepend">核销单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm.currency" style="width:235px;margin-right: 15px;">
								<template slot="prepend">币种</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm.exchangeRate" style="width:230px;margin-right: 15px;">
								<template slot="prepend">汇率</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input style="width:255px;">
								<template slot="prepend">核销日期</template>
								<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 158px; margin-right:-5px">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col class="elementWidth">
						<el-form-item label="">
							<el-input v-model="ruleForm.amount" style="width:260px;margin-right: 15px;">
								<template slot="prepend">应收金额</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item class='writeoffviewlabelwidth'>
							<el-input v-model="ruleForm.functionalAmount" style="width:235px;margin-right: 15px;">
								<template slot="prepend">应收金额(本币)</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item class='writeoffviewlabelwidth'>
							<el-input v-model="ruleForm.amountWriteoff" style="width:230px;margin-right: 15px;">
								<template slot="prepend">本次核销金额</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item class='writeoffviewlabelwidth'>
							<el-input v-model="ruleForm.functionalAmountWriteoff" style="width:255px;">
								<template slot="prepend">本次核销金额(本币)</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth" style="margin-top: -20px;">
						<el-row>
							<el-button type="text" style="margin-left: 20px;">备注</el-button>
						</el-row>
						<el-row>
							<el-form-item>
								<el-input type="textarea" show-word-limit maxlength="200" v-model="ruleForm.writeoffRemark" auto-complete="off" :rows="2" style="width:1055px" show-word-limit>
								</el-input>
							</el-form-item>
						</el-row>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-table :data="data" border stripe>
				<el-table-column align="center" prop="debitNoteNum" label="账单编号"></el-table-column>
				<el-table-column align="center" prop="awbNumber" label="运单号"></el-table-column>
				<el-table-column align="center" prop="amount" label="应收金额"></el-table-column>
				<el-table-column align="center" prop="functionalAmount" label="应收金额（本币）"></el-table-column>
				<el-table-column align="center" prop="amountWriteoff" label="本次核销金额"></el-table-column>
				<el-table-column align="center" prop="functionalAmountWriteoff" label="本次核销金额（本币）"></el-table-column>
			</el-table>
		</div>
		<div style="margin:10px 10px 10px 10px;">
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
				name: '',
				data: [],
				ruleForm: {
					customerName: '',
					debitNoteNum: '',
					writeoffNum: '',
					currency: '',
					exchangeRate: '',
					writeoffDate: '',
					amount: '',
					functionalAmount: '',
					amountWriteoff: '',
					functionalAmountWriteoff: '',
					writeoffRemark: ''
				}
			}
		},
		created: function() {
			if (this.frow.statementNum) {
				this.name = "清单"
				this.ruleForm.debitNoteNum = this.frow.statementNum
				this.$axios.get('/afbase/cssIncomeWriteoffStatementDetail/' + this.frow.incomeWriteoffId)
					.then((response) => {
						this.data = response.data.data;
					})
			} else {
				this.name = "账单"
				this.ruleForm.debitNoteNum = this.frow.debitNoteNum
				this.$axios.get('/afbase/cssIncomeWriteoffDetail/' + this.frow.incomeWriteoffId)
					.then((response) => {
						this.data.push(response.data.data)
					})
			}

			this.$axios.get2('/afbase/cssIncomeWriteoff/view/' + this.frow.incomeWriteoffId)
				.then(function(response) {
					this.ruleForm.writeoffDate = response.data.data.writeoffDate;
					this.ruleForm.customerName = response.data.data.customerName;
					this.ruleForm.writeoffNum = response.data.data.writeoffNum;
					this.ruleForm.currency = response.data.data.currency;
					if (this.frow.statementNum) {
						this.ruleForm.exchangeRate = response.data.data.listCurrencyList[0].exchangeRate;
						this.ruleForm.amount = response.data.data.listCurrencyList[0].amount;
						this.ruleForm.functionalAmount = response.data.data.listCurrencyList[0].functionalAmount;
					} else {
						this.ruleForm.exchangeRate = response.data.data.debitCurrencyList[0].exchangeRate;
						this.ruleForm.amount = response.data.data.debitCurrencyList[0].amount;
						this.ruleForm.functionalAmount = response.data.data.debitCurrencyList[0].functionalAmount;
					}
					this.ruleForm.amountWriteoff = response.data.data.cssIncomeWriteoffDetail.amountWriteoff;
					this.ruleForm.functionalAmountWriteoff = response.data.data.cssIncomeWriteoffDetail.functionalAmountWriteoff;
					this.ruleForm.writeoffRemark = response.data.data.writeoffRemark;
				}.bind(this));
		},

		methods: {
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style>
	.writeoffviewlabelwidth .el-input-group__prepend {
		padding: 0 5px;
	}

	.widthWithFive2 .el-input-group__prepend {
		padding: 0 16px;
	}

	.widthWithFive3 .el-input-group__prepend {
		padding: 0 13px;
	}

	.widthWithThree .el-input-group__prepend {
		padding: 0 27px;
	}

	.widthWithThreeWithXing .el-input-group__prepend {
		padding: 0 22px;
	}

	.widthWithTwo .el-input-group__prepend {
		padding: 0 34px;
	}

	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
</style>
