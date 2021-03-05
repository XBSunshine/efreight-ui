<template>
	<el-dialog v-loading="loading" title="发票 - 收票" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :model="ruleForm" ref="ruleForm" label-width="15px" class="demo-ruleForm">
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
						<el-input auto-complete="off" disabled style="width:305px" v-model="ruleForm.paymentNum">
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
						<el-input v-model="ruleForm.currency" style="width:165px" disabled :class="{currencyRedColor:ruleForm.currency!='CNY'}">
							<template slot="prepend">
								<span>付款金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-input v-model="ruleForm.amountStr" style="width:150px;margin-left: 15px;" disabled>
					</el-input>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.currInvoiceAmount" style="width:285px" disabled>
							<template slot="prepend">
								<span>收票金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFive invoiceDetailNoWriteoff" v-model="ruleForm.noInvoiceAmount" style="width:305px;color: blue;" disabled>
							<template slot="prepend">
								<span style="color: blue;">未收票金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>付款申请</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.applyRemark" type="textarea" auto-complete="off" style="width:950px;" :rows="3" disabled>
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
		<el-row style="margin-left: 20px;margin-top: 10px;margin-bottom: 10px;">
			<i class="iconfont el-icon-myyuanquanjiahao" @click="showAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
			<span style="margin-left: 10px;cursor: pointer;" @click="showAdd">新增收票</span>
		</el-row>
		<div>
			<el-table :data="ruleForm.list" border stripe>
				<el-table-column v-if="cssCostInvoiceDeletePermission" fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.row.invoiceDetailId)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="invoiceNum" label="发票号" width="130">
				</el-table-column>
				<el-table-column align="center" prop="invoiceDate" label="发票日期" width="110">
				</el-table-column>
				<el-table-column align="center" prop="creatorName" label="收票人" width="100">
					<template slot-scope="scope">
						<span>{{scope.row.creatorName.split(' ')[0]}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="createTime" label="收票日期" width="110">
					<template slot-scope="scope">
					<span>{{scope.row.createTime.split(' ')[0]}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="invoiceType" label="发票类型" width="150"></el-table-column>
				<el-table-column header-align="center" align="right" label="金额">
					<template slot-scope="scope">
						<font v-if="scope.row.amountStr.indexOf('CNY')>-1">{{scope.row.amountStr}}</font>
						<font v-else style="color: red;">{{scope.row.amountStr}}</font>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="invoiceRemark" label="备注"></el-table-column>
			</el-table>
		</div>
		<!-- <div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="handleClose">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
		</div> -->
		<invoiceDetailSave ref="addMission" v-if="invoiceDetailSaveVisible" :visible.sync="invoiceDetailSaveVisible" :frow="ffrow"></invoiceDetailSave>
	</el-dialog>
</template>
<script>
	import InvoiceDetailSave from './invoice_detail_save'
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
				ifCanOpertion: false,
				invoiceDetailSaveVisible: false,
				ruleForm: {
					invoiceId: '',
					paymentId: '',
					paymentNum: '',
					amount: '',
					amountStr: '',
					currInvoiceAmount: '',
					noInvoiceAmount: '',
					customerId: null,
					customerName: null,
					currency: '',
					applyRemark: '',
					rowUuid: '',
					list: []
				},
				ffrow: {},
				cssCostInvoiceDeletePermission:false
			}
		},
		inject: ['queryList'],
		components: {
			'invoiceDetailSave': InvoiceDetailSave
		},
		provide() {
			return {
				'view': this.view
			}
		},
		created: function() {
			//按钮权限
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('css_cost_invoice_delete') > -1) {
				this.cssCostInvoiceDeletePermission = true
			}
			this.view()
		},
		methods: {
			view() {
				this.loading = true
				this.$axios.get("/afbase/cssCostInvoice/" + this.frow.invoiceId).then(response => {
					this.ruleForm = response.data.data
					this.count()
					this.loading = false
					this.ifCanOpertion = true
				}).catch(error => {
					this.openError(error.response.data.messageInfo)
					this.loading = false
					this.ifCanOpertion = false
				})
			},
			showAdd() {
				if (this.ifCanOpertion) {
					this.$axios.get("/afbase/cssCostInvoice/checkIfInvoiceCompleteWhenInsertInvoiceDetail/" + this.frow.invoiceId + "/" + this.ruleForm.rowUuid).then(response => {
						this.invoiceDetailSaveVisible = true
						this.ffrow.customerId = this.ruleForm.customerId
						this.ffrow.customerName = this.ruleForm.customerName
						this.ffrow.currency = this.ruleForm.currency
						this.ffrow.businessScope = this.ruleForm.businessScope
						this.ffrow.rowUuid = this.ruleForm.rowUuid
						this.ffrow.invoiceId = this.ruleForm.invoiceId
						this.ffrow.paymentId = this.ruleForm.paymentId
					}).catch(error => {
						this.openError(error.response.data.messageInfo)
					})
				}
			},
			doDelete(invoiceDetailId) {
				if (this.ifCanOpertion) {
					this.$confirm('请确认 是否删除 发票？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.$axios.deletes("/afbase/cssCostInvoiceDetail/" + invoiceDetailId + "/" + this.ruleForm.rowUuid).then(response => {
							this.openSuccess("删除成功")
							this.view()
						}).catch(error => {
							this.openError(error.response.data.messageInfo)
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}
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
			//计算对账单付款金额
			count() {
				let currInvoiceAmount = null
				this.ruleForm.list.forEach(row => {
					if (currInvoiceAmount == null) {
						currInvoiceAmount = row.amount
					} else {
						currInvoiceAmount += row.amount
					}
				})
				if (currInvoiceAmount) {
					this.ruleForm.currInvoiceAmount = this.getNumber(currInvoiceAmount)
					this.ruleForm.noInvoiceAmount = this.getNumber(this.ruleForm.amount - currInvoiceAmount)
					this.ffrow.noInvoiceAmount = parseFloat((this.ruleForm.amount - currInvoiceAmount).toFixed(2))
				} else {
					this.ruleForm.currInvoiceAmount = '0.00'
					this.ruleForm.noInvoiceAmount = this.getNumber(this.ruleForm.amount)
					this.ffrow.noInvoiceAmount = this.ruleForm.amount
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			handleClose() {
				this.queryList()
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
	.currencyRedColor input {
		color: red !important;
	}

	.invoiceDetailNoWriteoff input {
		color: blue !important;
	}
</style>