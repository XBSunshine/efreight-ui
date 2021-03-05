<template>
	<el-dialog title="铁路进口订单 - 查看" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :show-close="!ifFullscreen" :style="style">
		<div style="width: 1280px;">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="订单信息" name="first">
					<component :is="first" :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="电子单证" name="second" v-if="permissionButtonForFile">
					<component :is="second" :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="费用录入" name="third" v-if="permissionButtonForService">
					<component :is="third" :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="操作日志" name="fourth" v-if="permissionButtonForLog">
					<component :is="fourth" :frow="ffrow"></component>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-dialog>
</template>
<script>
	const OrderInfo = resolve => require(['@/views/tc/ti/order/main/component_view/order_view_orderinfo.vue'], resolve)
	const FileUpload = resolve => require(['@/views/af/ai_order/file_tab.vue'], resolve)
	const CostService = resolve => require(['@/views/af/ai_order/service_tab.vue'], resolve)
	const Log = resolve => require(['@/views/af/ai_order/log_tab.vue'], resolve)
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
        permissionButtonForService: this.frow.permissionButtonForService,
        permissionButtonForFile: this.frow.permissionButtonForFile,
        permissionButtonForLog: this.frow.permissionButtonForLog,
				activeName: '',
				orderInfo: OrderInfo,
				fileUpload: FileUpload,
				costService: CostService,
				log: Log,
				first: '',
				second: '',
				third: '',
				fourth: '',
				ffrow: {},
				ifFullscreen: false,
				style: {}
			}
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.activeName = 'first'
			this.first = this.orderInfo
			this.ffrow = this.frow
		},
		methods: {
			handleClick(tab, event) {
				this.checkVue(tab.name)
				this.ffrow = this.frow
			},
			checkVue(name) {
				switch (name) {
					case 'first':
						this.first = ''
						this.$nextTick(() => {
							this.first = this.orderInfo
						})
						break
					case 'second':
						this.second = ''
						this.$nextTick(() => {
							this.second = this.fileUpload
						})
						break
					case 'third':
						this.third = ''
						this.$nextTick(() => {
							this.third = this.costService
						})
						break
					case 'fourth':
						this.fourth = ''
						this.$nextTick(() => {
							this.fourth = this.log
						})
						break
				}
			},
			handleClose() {
				if (this.ifFullscreen) {
					setTimeout(() => {
						let userAgent = navigator.userAgent;
						if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
							window.open('', '_self').close()
						} else {
							window.opener = null;
							window.open("about:blank", "_self");
							window.close();
						}
					}, 2000)
				} else {
					this.$emit('update:visible', false)
				}
			}
		}
	};
</script>
