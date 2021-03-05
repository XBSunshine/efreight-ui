<template>
	<el-dialog :title="'空运操作订单 - '+titleName " :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :show-close="!ifFullscreen" :style="style">
		<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-38px;left:175px;height:1px;" v-if="helpDocumentUrl">
		</el-link>
		<div style="width: 1280px;">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="订单信息" name="editTab" v-if="editButtonFlag">
					<component :is="editTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="鉴定证书" name="identifyTab" v-if="identifyButtonFlag">
					<!--<child1 v-if="isChildUpdate1"><component :is="identifyTab" keep-alive :frow="ffrow"></component></child1>-->
					<component :is="identifyTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="安检货物品名清单" name="goodsTab">
					<component :is="goodsTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<el-tab-pane label="操作出重" name="weightTab" v-if="weightButtonFlag">
					<component :is="weightTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane>
				<!-- <el-tab-pane label="费用录入" name="serviceTab" v-if="servicesButtonFlag">
					<component :is="serviceTab" keep-alive :frow="ffrow"></component>
				</el-tab-pane> -->
				<el-tab-pane label="电子单证" name="fileTab" v-if="fileButtonFlag">
					<component :is="fileTab" keep-alive :frow="ffrow" v-if="fileTabState" key="fileTabStates"></component>
					<component :is="fileTab" keep-alive :frow="ffrow" v-if="fileTabState1"></component>
				</el-tab-pane>
				<el-tab-pane label="操作日志" name="logTab" v-if="logButtonFlag">
					<component :is="logTab" keep-alive :frow="ffrow" v-if="logTabState" key="logTabStates"></component>
					<component :is="logTab" keep-alive :frow="ffrow" v-if="logTabState1"></component>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-dialog>
</template>
<script>
	const editTab = resolve => require(['@/views/af/order/af_oporder_edit_tab.vue'], resolve)
	const weightTab = resolve => require(['@/views/af/order/af_order_weight_tab.vue'], resolve)
	const identifyTab = resolve => require(['@/views/af/order/af_order_identify_tab.vue'], resolve)
	const goodsTab = resolve => require(['@/views/af/order/af_oporder_goods_tab.vue'], resolve)
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
				helpUrl5: '',
				helpDocumentUrl: '',
				editButtonFlag: false,
				fileButtonFlag: false,
				identifyButtonFlag: true,
				servicesButtonFlag: false,
				logButtonFlag: false,
				weightButtonFlag: false,
				ffrow: {},
				activeName: 'editTab',
				editTab: '',
				fileTab: '',
				goodsTab:'',
				serviceTab: '',
				weightTab: '',
				identifyTab:'',
				logTab: '',
				ifFullscreen: false,
				style:{},
				fileTabState:false,
				fileTabStates:0,
				fileTabState1:false,
				logTabState:false,
				logTabStates:0,
				logTabState1:false,
			};
		},
		inject: ['findByPage'],
		provide() {
			return {
				handleClose: this.handleClose,
			}
		},
		created() {
			this.$axios.get('/afbase/afoporder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
				this.frow.finishFlag=!response.data.data	
			}.bind(this));
			this.ifFullscreen = this.frow.ifFullscreen
			if(this.ifFullscreen){
				this.style.top = '0px'
			}else{
				this.style.top = '-80px'
			}
			this.activeName = this.frow.activeName;
			if (this.frow.viewFlag == true) {
				this.titleName = "修改";
			} else {
				this.titleName = "详情";
			}
			this.$axios.get('/hrs/permission/' + 160).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 285).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl2 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 164).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl3 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 170).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl4 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			this.$axios.get('/hrs/permission/' + 169).then(function(response) {
				if (response.data.code == 0) {
					this.helpUrl5 = response.data.data.helpDocumentUrl;
					this.checkVue(this.activeName);
				}
			}.bind(this));
			//			this.loadPermission()
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('af-oporder-edit') > -1||buttonInfo.indexOf('af-oporder-view') > -1) {
				this.editButtonFlag = true;
			}
			if (buttonInfo.indexOf('af-oporder-file') > -1) {
				this.fileButtonFlag = true;
			}
			if (buttonInfo.indexOf('af-oporder-services') > -1) {
				this.servicesButtonFlag = true;
			}
			if (buttonInfo.indexOf('af-oporder-logtag') > -1) {
				this.logButtonFlag = true;
			}
			if (buttonInfo.indexOf('af-oporder-weighttag') > -1) {
				this.weightButtonFlag = true;
			}
			this.$set(this.frow,'updateState',false);
			this.$set(this.frow,'updateLogTab',false);

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
					case 'identifyTab':
						this.ffrow = this.frow
						this.ffrow.pageName='操作订单'
						this.identifyTab = identifyTab
						this.helpDocumentUrl = ''
						if(!this.frow.updateState){
							this.fileTabState1=true
							this.fileTabStat=false
						}else{
							this.fileTabStates+=1;
							this.fileTabStat1=false
						}
						if(!this.frow.updateLogTab){
							this.logTabState1=true
							this.logTabState=false
						}else{
							this.logTabStates+=1
							this.logTabState1=false
						}
						break
					case 'goodsTab':
						this.ffrow = this.frow
						this.ffrow.pageName='操作订单'
						this.goodsTab = goodsTab
						this.helpDocumentUrl = ''
						if(!this.frow.updateLogTab){
							this.logTabState1=true
							this.logTabState=false
						}else{
							this.logTabStates+=1
							this.logTabState1=false
						}
						break
					case 'fileTab':
						this.ffrow = this.frow
						this.ffrow.pageName='操作订单'
						this.fileTab = fileTab
						this.helpDocumentUrl = this.helpUrl2
						if(this.frow.updateState){
							this.fileTabStates+=1;
							this.fileTabState=true
							this.fileTabState1=false
						}else{
							this.fileTabStates+=1;
							this.fileTabState=false
							this.fileTabState1=true
						}
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
						if(this.frow.updateLogTab){
							this.logTabStates+=1
							this.logTabState=true
							this.logTabState1=false
						}else{
							this.logTabStates+=1;
							this.logTabState=false
							this.logTabState1=true
						}
						break
					case 'weightTab':
						this.ffrow = this.frow
						this.ffrow.pageName='操作订单'
						this.weightTab = weightTab
						this.helpDocumentUrl = this.helpUrl5
						if(!this.frow.updateLogTab){
							this.logTabState1=true
							this.logTabState=false
						}else{
							this.logTabStates+=1
							this.logTabState1=false
						}
						break
				}
			}
		}
	};
</script>
