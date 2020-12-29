<template>
	<el-dialog title="核销单 - 查看" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" append-to-body>
		<el-form disabled :model="ruleForm" ref="ruleForm" label-width="20px" class="demo-ruleForm writeoffPaymentViewPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" style="width:725px" v-model="ruleForm.customerName">
							<template slot="prepend">
								<span>付款客户</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" style="width:295px" v-model="ruleForm.paymentNum">
							<template slot="prepend">
								<span>对账编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>

			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-if="ruleForm.currency=='CNY'" v-model="ruleForm.currency" style="width:200px;">
							<template slot="prepend">
								<span>核销金额</span>
							</template>
						</el-input>
						<el-input v-else v-model="ruleForm.currency" class="currencyRedColor" style="width:200px;">
							<template slot="prepend">
								<span>核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="15px">
						<el-input v-model="ruleForm.amountWriteoffStr" style="width:200px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="35px">
						<el-input auto-complete="off"  style="width:275px" v-model="ruleForm.writeoffNum">
							<template slot="prepend">
								<span>核销编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:295px;">
							<template slot="prepend">
								<span>核销日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="核销日期" style="width: 218px;margin-right: -5px;">
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
							<el-input v-model="ruleForm.writeoffRemark" type="textarea" auto-complete="off" style="width:1040px;" :rows="3" show-word-limit maxlength="200">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>

		</el-form>
		<div style="margin:0px 20px 25px 20px;">
		<el-table ref="table" v-loading="loading" :data="ruleForm.cssCostWriteoffDetails" border stripe>
			<el-table-column align="center" prop="awbOrOrderNumber" width="125">
				<template slot="header">
					<span v-if="frow.businessScope=='LC'||frow.businessScope=='IO'">客户单号/订单号</span>
					<span v-else>提单号/订单号</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="flightDate" width="100">
				<template slot="header">
					<span v-if="frow.businessScope=='AE'||frow.businessScope=='SE'">开航日期</span>
					<span v-if="frow.businessScope=='AI'||frow.businessScope=='SI'">到港日期</span>
					<span v-if="frow.businessScope=='TE'">发车日期</span>
					<span v-if="frow.businessScope=='LC'">用车日期</span>
					<span v-if="frow.businessScope=='IO'">业务日期</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="serviceName" label="服务"></el-table-column>
			<el-table-column header-align="center" align="right" label="对账金额" width="140">
				<template slot-scope="scope">
					<font v-if="scope.row.amountPaymentStr!=null&&scope.row.amountPaymentStr.indexOf('CNY')>-1">{{scope.row.amountPaymentStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountPaymentStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="已核销金额" width="140">
				<template slot-scope="scope">
					<font v-if="scope.row.amountPaymentWriteoffStr!=null&&scope.row.amountPaymentWriteoffStr.indexOf('CNY')>-1">{{scope.row.amountPaymentWriteoffStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountPaymentWriteoffStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="未核销金额" width="140">
				<template slot-scope="scope">
					<font v-if="scope.row.amountPaymentNoWriteoffStr!=null&&scope.row.amountPaymentNoWriteoffStr.indexOf('CNY')>-1">{{scope.row.amountPaymentNoWriteoffStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountPaymentNoWriteoffStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="本次核销金额" width="150">
				<template slot-scope="scope">
					<font v-if="scope.row.amountWriteoffStr!=null&&scope.row.amountWriteoffStr.indexOf('CNY')>-1">{{scope.row.amountWriteoffStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountWriteoffStr}}</font>
				</template>
			</el-table-column>
		</el-table>
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
				ruleForm: {
					customerName: '',
					customerId: '',
					paymentId: '',
					paymentNum: '',
					amountWriteoff: '',
					businessScope: '',
					writeoffNum: '',
					currency: '',
					writeoffDate: '',
					writeoffRemark: '',
					cssCostWriteoffDetails: []
				},
				loading: false
			}
		},
		inject: ['queryList'],
		created: function() {
			this.queryPaymentDetailList()
		},
		methods: {
			queryPaymentDetailList() {
				this.loading = true
				this.$axios.get('/afbase/cssCostWriteoff/' + this.frow.costWriteoffId).then((response) => {
					if(response.data.code == '0') {
						this.ruleForm = response.data.data;
					} else {
						this.openError(response.data.messageInfo)
					}
					this.loading = false
				}).catch((error) => {
					this.loading = false
					this.openError(error.response.data.messageInfo)
					console.log(error);
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
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

			//--------------------- 

		}
	}
</script>
<style type="text/css">
	.writeoffPaymentViewPage .el-input__icon {
		line-height: 30px !important;
	}

	.writeoffPaymentViewPage .el-form-item__content {
		line-height: 30px !important;
	}

	.writeoffPaymentViewPage .el-input-group__prepend {
		padding: 0 10px;
	}

	.currencyRedColor input {
		color: red !important;
	}
</style>
