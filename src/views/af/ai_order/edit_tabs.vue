<template>
	<el-dialog :title="'空运进口订单 - '+titleName " :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :show-close="!ifFullscreen" :style="style">
		<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-38px;left:175px;height:1px;" v-if="helpDocumentUrl">
		</el-link>
		<div style="width: 1280px;">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="订单信息" name="editTab" v-if="editButtonFlag">
					<component :is="editTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="电子单证" name="fileTab" v-if="fileButtonFlag">
					<component :is="fileTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="费用录入" name="serviceTab" v-if="servicesButtonFlag">
					<component :is="serviceTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="操作日志" name="logTab" v-if="logButtonFlag">
					<component :is="logTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-dialog>
</template>
<script>
	const editTab = resolve => require(['@/views/af/ai_order/edit_tab.vue'], resolve)
	const fileTab = resolve => require(['@/views/af/ai_order/file_tab.vue'], resolve)
	const serviceTab = resolve => require(['@/views/af/ai_order/service_tab.vue'], resolve)
	const logTab = resolve => require(['@/views/af/ai_order/log_tab.vue'], resolve)

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
				helpUrl: '',
				helpUrl2: '',
				helpUrl3: '',
				helpUrl4: '',
				titleName: '',
				helpDocumentUrl: '',
				editButtonFlag: false,
				fileButtonFlag: false,
				servicesButtonFlag: false,
				logButtonFlag: false,
				ffrow: {},
				activeName: 'editTab',
				editTab: '',
				fileTab: '',
				serviceTab: '',
				logTab: '',
				ifFullscreen: false,
				style: {}
			};
		},
		inject: ['findByPage'],
		provide() {
			return {
				handleClose: this.handleClose,
			}
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.activeName = this.frow.activeName;
			if (this.frow.viewFlag == true) {
				this.titleName = "修改";
			} else {
				this.titleName = "详情";
			}
			this.$axios.get('/hrs/permission/' + 281).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 283).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl2 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 282).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl3 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 284).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl4 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			//			this.loadPermission()
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('ai-order-edit') > -1||buttonInfo.indexOf('ai-order-view') > -1) {
				this.editButtonFlag = true;
			}
			if (buttonInfo.indexOf('ai-order-file') > -1) {
				this.fileButtonFlag = true;
			}
			if (buttonInfo.indexOf('ai-order-services') > -1) {
				this.servicesButtonFlag = true;
			}
			if (buttonInfo.indexOf('ai-order-log') > -1) {
				this.logButtonFlag = true;
			}

		},
		methods: {

			// 关闭
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
					this.findByPage();
					this.$emit('update:visible', false)
				}
			},
			handleClick(tab, event) {
				this.checkVue(tab.name)
			},
			checkVue(name) {
				switch (name) {
					case 'editTab':
						this.ffrow = this.frow
						this.editTab = editTab
						this.helpDocumentUrl = this.helpUrl
						break
					case 'fileTab':
						this.ffrow = this.frow
						this.fileTab = fileTab
						this.helpDocumentUrl = this.helpUrl2
						break
					case 'serviceTab':
						this.ffrow = this.frow
						this.serviceTab = serviceTab
						this.helpDocumentUrl = this.helpUrl3
						break
					case 'logTab':
						this.ffrow = this.frow
						this.logTab = logTab
						this.helpDocumentUrl = this.helpUrl4
						break
				}
			}
		}
	};
</script>
