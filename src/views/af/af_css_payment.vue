<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		<el-tab-pane label="对账单" name="payment">
			<component :is="payment" keep-alive></component>
		</el-tab-pane>
		<el-tab-pane label="核销单" name="writeoff">
			<component :is="writeoff" keep-alive></component>
		</el-tab-pane>
	</el-tabs>
</template>
<script>
	const payment = resolve => require(['@/views/af/cssPayment/af_payment_list.vue'], resolve)
	const writeoff = resolve => require(['@/views/af/cssPayment/af_payment_writeoff_list.vue'], resolve)
	export default {
		data() {
			return {
				activeName: 'payment',
				payment: payment,
				writeoff: ''
			};
		},
		created() {

		},
		methods: {
			loadPermission() {
				let privileges = localStorage.getItem("buttonInfo");
				for(let permissionKey in this.permission) {
					if(privileges.indexOf(permissionKey) > -1) {
						this.permission[permissionKey].isShow = true;
						if(!this.activeName) { //只赋值一次
							this.activeName = this.permission[permissionKey].name;
							this.checkVue(this.activeName);
						}
					}
				}
			},
			handleClick(tab, event) {
				this.checkVue(tab.name)
			},
			checkVue(name) {
				switch(name) {
					case 'payment':
						this.first = payment
						break
					case 'writeoff':
						this.writeoff = writeoff
						break
				}
			}
		}
	};
</script>