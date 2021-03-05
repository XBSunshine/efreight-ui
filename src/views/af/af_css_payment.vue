<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		<el-tab-pane label="对账单" name="payment" v-if="cssCostPayment">
			<component :is="payment" keep-alive></component>
		</el-tab-pane>
		<el-tab-pane label="发票" name="invoice" v-if="cssCostInvoice">
			<component :is="invoice" keep-alive></component>
		</el-tab-pane>
		<el-tab-pane label="核销单" name="writeoff" v-if="cssCostInvoiceWriteoff">
			<component :is="writeoff" keep-alive></component>
		</el-tab-pane>
	</el-tabs>
</template>
<script>
	const payment = resolve => require(['@/views/af/cssPayment/af_payment_list.vue'], resolve)
	const invoice = resolve => require(['@/views/af/cssPayment/css_cost_invoice_list.vue'], resolve)
	const writeoff = resolve => require(['@/views/af/cssPayment/css_invoice_writeoff_list.vue'], resolve)
	export default {
		data() {
			return {
				activeName: '',
				payment: payment,
				invoice: invoice,
				writeoff: writeoff,
				cssCostPayment: false,
				cssCostInvoice: false,
				cssCostInvoiceWriteoff: false
			};
		},
		created() {
			//按钮权限
			let buttonPermission = JSON.parse(window.localStorage.getItem('buttonInfo'))
			if (buttonPermission.some(item => item == 'css_cost_payment')) {
				this.activeName='payment'
				this.cssCostPayment = true
			}
			if (buttonPermission.some(item => item == 'css_cost_invoice')) {
				this.cssCostInvoice = true
				if(!this.activeName){
					this.activeName='invoice'
				}
			}
			if (buttonPermission.some(item => item == 'css_cost_invoice_writeoff')) {
				this.cssCostInvoiceWriteoff = true
				if(!this.activeName){
					this.activeName='writeoff'
				}
			}
		},
		methods: {
			handleClick(tab, event) {
				this.checkVue(tab.name)
			},
			checkVue(name) {
				switch (name) {
					case 'payment':
						this.payment = payment
						break
					case 'invoice':
						this.invoice = invoice
						break
					case 'writeoff':
						this.writeoff = writeoff
						break
				}
			}
		}
	};
</script>
