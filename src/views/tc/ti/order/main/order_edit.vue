<template>
	<el-dialog title="铁路进口订单 - 编辑" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :show-close="!ifFullscreen" :style="style">
		<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-36px;left:136px;float: left;" v-if="helpDocumentUrl">
		</el-link>
		<div style="width: 1280px;">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="订单信息" name="first" v-if="permissionButtonForEdit">
					<component :is="first" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="电子单证" name="second" v-if="permissionButtonForFile">
					<component :is="second" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="费用录入" name="third" v-if="permissionButtonForService">
					<component :is="third" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="操作日志" name="fourth" v-if="permissionButtonForLog">
					<component :is="fourth" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-dialog>
</template>
<script>
	const OrderInfo = resolve => require(['@/views/tc/ti/order/main/component_edit/order_edit_orderinfo.vue'], resolve)
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
				permissionButtonForEdit: this.frow.permissionButtonForEdit,
				permissionButtonForService: this.frow.permissionButtonForService,
				permissionButtonForFile: this.frow.permissionButtonForFile,
				permissionButtonForLog: this.frow.permissionButtonForLog,
				activeName: '',
				helpDocumentUrl: '',
				helpDocumentUrlForOrderInfo: '',
				helpDocumentUrlForCost: '',
				helpDocumentUrlForFile: '',
				orderInfo: OrderInfo,
				fileUpload: FileUpload,
				costService: CostService,
				log: Log,
				first: '',
				second: '',
				third: '',
				fourth: '',
				ffrow: {},
				executeCount: 0,
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
      // this.executeCount = 3;
      // this.init();
			this.$axios.get('/hrs/permission/' + 402).then((response) => {
				if (response.data.code == 0) {
					this.helpDocumentUrlForOrderInfo = response.data.data.helpDocumentUrl
				}
				this.executeCount++
				this.init()
			}).catch((error) => {
				this.executeCount++
				this.init()
			});
			this.$axios.get('/hrs/permission/' + 401).then((response) => {
				if (response.data.code == 0) {
					this.helpDocumentUrlForCost = response.data.data.helpDocumentUrl
				}
				this.executeCount++
				this.init()
			}).catch((error) => {
				this.executeCount++
				this.init()
			});
			this.$axios.get('/hrs/permission/' + 403).then((response) => {
				if (response.data.code == 0) {
					this.helpDocumentUrlForFile = response.data.data.helpDocumentUrl
				}
				this.executeCount++
				this.init()
			}).catch((error) => {
				this.executeCount++
				this.init()
			});
		},
		inject:['findByPage'],
		provide() {
			return {
				handleClose: this.handleClose
			}
		},
		methods: {
			init() {
				if (this.executeCount == 3) {
					if (this.frow.jumpToTab == "second") {
						this.activeName = 'second'
						this.second = this.fileUpload
						this.helpDocumentUrl = this.helpDocumentUrlForFile
					} else if (this.frow.jumpToTab == "third") {
						this.activeName = 'third'
						this.third = this.costService
						this.helpDocumentUrl = this.helpDocumentUrlForCost
					} else {
						this.activeName = 'first'
						this.first = this.orderInfo
						this.helpDocumentUrl = this.helpDocumentUrlForOrderInfo
					}
					this.ffrow = this.frow
				}
			},
			handleClick(tab, event) {
				this.checkVue(tab.name)
				this.ffrow = this.frow
			},
			checkVue(name) {
				switch (name) {
					case 'first':
						this.first = ''
						this.helpDocumentUrl = this.helpDocumentUrlForOrderInfo
						this.$nextTick(() => {
							this.first = this.orderInfo
						})
						break
					case 'second':
						this.second = ''
						this.helpDocumentUrl = this.helpDocumentUrlForFile
						this.$nextTick(() => {
							this.second = this.fileUpload
						})
						break
					case 'third':
						this.third = ''
						this.helpDocumentUrl = this.helpDocumentUrlForCost
						this.$nextTick(() => {
							this.third = this.costService
						})
						break
					case 'fourth':
						this.fourth = ''
						this.helpDocumentUrl = ''
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
					this.findByPage()
					this.$emit('update:visible', false)
				}
			}
		}
	};
</script>
