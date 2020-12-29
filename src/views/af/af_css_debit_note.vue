<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		<!--<el-tab-pane label="参数表" name="first" v-if="permission.sys_base_category.isShow">-->
		<el-tab-pane label="账单" v-if="billButtonFlag" name="bill">
			<component :is="bill" keep-alive></component>
		</el-tab-pane>
		<el-tab-pane label="清单" v-if="listButtonFlag" name="list">
			<component :is="list" keep-alive></component>
		</el-tab-pane>
		<el-tab-pane label="核销单" v-if="writeoffButtonFlag" name="writeoff">
			<component :is="writeoff" keep-alive></component>
		</el-tab-pane>
	</el-tabs>

</template>
<script>
	const bill = resolve => require(['@/views/af/cssDebitNote/af_debit_note_bill.vue'], resolve)
	const list = resolve => require(['@/views/af/cssDebitNote/af_debit_note_list.vue'], resolve)
	const writeoff = resolve => require(['@/views/af/cssDebitNote/af_debit_note_writeoff.vue'], resolve)
	export default {
		data() {
			return {
				billButtonFlag:false,
				listButtonFlag:false,
				writeoffButtonFlag:false,
				activeName: 'bill',
				bill: '',
				list: '',
				writeoff:''
				// permission: {
				// 	bill: {
				// 		isShow: false,
				// 		name: 'bill'
				// 	},
				// 	list: {
				// 		isShow: false,
				// 		name: 'list'
				// 	},
				// 	writeoff: {
				// 		isShow: false,
				// 		name: 'writeoff'
				// 	}
				// }
			};
		},
		created() {
			//			this.loadPermission()
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if(buttonInfo.indexOf('af-bill-page') > -1) {
				this.billButtonFlag = true;
			}
			if(buttonInfo.indexOf('af-list-page') > -1) {
				this.listButtonFlag = true;
			}
			if(buttonInfo.indexOf('af-writeoff-page') > -1) {
				this.writeoffButtonFlag = true;
			}
			this.checkVue(this.activeName);
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
					case 'bill':
						this.bill = bill
						break
					case 'list':
						this.list = list
						break
					case 'writeoff':
						this.writeoff = writeoff
						break
				}
			}
		}
	};
</script>