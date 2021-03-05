<template>
	<el-dialog title="车辆入区信息" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :show-close="!ifFullscreen" :style="style">
		<!-- <el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-36px;left:136px;" v-if="helpDocumentUrl">
		</el-link> -->
		<div style="width: 1280px;">
			<el-table :data="entryOrderList.data" border highlight-current-row stripe class="table_settle" @row-click="gotoEditPage">
				<el-table-column label="登记操作" align="center" fixed width="100">
					<template slot="header" slot-scope="scope">
						<i class="iconfont el-icon-myyuanquanjiahao" @click="gotoAddPage" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						<span>登记操作</span>
					</template>
					<template slot-scope="scope">
						<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="scope.row.symbol=='P'">申请更改</el-dropdown-item>
								<el-dropdown-item command="twoCode" v-if="scope.row.symbol=='P'&&scope.row.seq">二维码</el-dropdown-item>
								<el-dropdown-item command="printVlOrder" v-if="scope.row.symbol=='P'&&scope.row.seq">打印配载单</el-dropdown-item>
								<el-dropdown-item command="cancel" v-if="scope.row.symbol!='P'&&scope.row.symbol!='C'">强制核销</el-dropdown-item>
		
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column prop="vehteamFlag" label="车队标识" width="100" align="center" :formatter="formatter_vehteamFlag"></el-table-column>
				<el-table-column prop="vehicleNo" label="车牌号" width="130" align="center"></el-table-column>
				<el-table-column prop="warehouseCode" label="货站" width="130" align="center" :formatter="formatter_warehouseCode"></el-table-column>
				<el-table-column prop="mawbNumbers" label="提单号" width="130" align="center" :formatter="formatter_mawbNumbers"></el-table-column>
				<el-table-column prop="declareDate" label="登记时间" align="center" ></el-table-column>
	
				<el-table-column prop="text" label="登记回执" width="130" align="center"></el-table-column>
				<el-table-column prop="appointDeclareDatetime" label="入区时间预约" align="center"></el-table-column>
				<el-table-column prop="appointDeclareStatus" label="预约状态" width="100" align="center"></el-table-column>
			</el-table>
			<div style="padding:10px 0px 10px 0px">
				<HR color="#eee" size="5">
				</HR>
			</div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="入区登记" name="first" >
					<component :is="first" keep-alive :frow="ffrow" v-if="firstState1"></component>
				</el-tab-pane>
				<el-tab-pane label="入区预约" name="second" >
					<component :is="second" keep-alive :frow="ffrow" v-if="secondState1"></component>
				</el-tab-pane>
			</el-tabs>
			<qrcodeVisible ref="addMission" v-if="qrcodeVisible" :visible.sync="qrcodeVisible" :frow="ffrow"></qrcodeVisible>
		</div>
	</el-dialog>
</template>
<script>
	const OrderInfo = resolve => require(['@/views/vl/intoArea/order_edit_orderinfo.vue'], resolve)
	const FileUpload = resolve => require(['@/views/vl/intoArea/order_edit_orderinfo_entry.vue'], resolve)
	import qrcodeVisible from './qrcode_view'
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
				qrcodeVisible:false,
				firstState1:false,
				secondState1:false,
				activeName: '',
				helpDocumentUrl: '',
				helpDocumentUrlForOrderInfo: '',
				helpDocumentUrlForFile: '',
				orderInfo: OrderInfo,
				fileUpload: FileUpload,
				first: '',
				second: '',
				third: '',
				currRow:'',
				ffrow: {},
				executeCount: 0,
				ifFullscreen: false,
				style: {},
				entryOrderList: {
					data:[]
				}
			}
		},
		components: {
			'qrcodeVisible':qrcodeVisible
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.init()
			// this.$axios.get('/hrs/permission/' + 435).then((response) => {
			// 	if (response.data.code == 0) {
			// 		this.helpDocumentUrlForOrderInfo = response.data.data.helpDocumentUrl
			// 	}
			// 	this.executeCount++
			// 	this.init()
			// }).catch((error) => {
			// 	this.executeCount++
			// 	this.init()
			// });
			// this.$axios.get('/hrs/permission/' + 436).then((response) => {
			// 	if (response.data.code == 0) {
			// 		this.helpDocumentUrlForFile = response.data.data.helpDocumentUrl
			// 	}
			// 	this.executeCount++
			// 	this.init()
			// }).catch((error) => {
			// 	this.executeCount++
			// 	this.init()
			// });
		},
		inject: ['findByPage'],
		provide() {
			return {
				handleClose: this.handleClose,
				queryEntryOrderList:this.queryEntryOrderList
			}
		},
		methods: {
			init() {
				// if (this.executeCount == 2) {
					if (this.frow.jumpToTab == "second") {
						this.activeName = 'second'
						this.firstState1=false
						this.secondState1=true
						this.second = this.fileUpload
						this.helpDocumentUrl = this.helpDocumentUrlForFile
					} else {
						this.activeName = 'first'
						this.firstState1=true
						this.secondState1=false
						this.first = this.orderInfo
						this.helpDocumentUrl = this.helpDocumentUrlForOrderInfo
					}
					this.ffrow = this.frow
				// }
				this.queryEntryOrderList();
			},
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.doSend(this.currRow)
				} else if (command == 'twoCode') {
					this.doTwoCode(this.currRow)
				} else if (command == 'printVlOrder') {
					this.doPrintVlOrder(this.currRow)
				} else if (command == 'cancel') {
					this.doVEEntryConfirm(this.currRow)
				} 

			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
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
			doSend(row){
				this.$confirm('此操作将登记卡口入区, 是否继续?', '注意', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true
				}).then(() => {
					this.$axios.post("/afbase/send/doSendVEEntry/"+row.entryOrderId).then(function (response) {
			            if (response.data.code == 0) {
			                if(response.data.data.status=='success'){
			                  this.openSuccess('登记成功');
				            }else{
				                  this.openError(response.data.data.message);
				            }
			            } else {
			                this.openError(response.data.messageInfo || "登记失败!");
			            }
		            }.bind(this));

      			}).catch(() => {});
				
			},
			doTwoCode(row){
				// if (!row.seq) {
				// 	return;
				// }
				// row.seq='12345678901234567890'
				this.ffrow=row
				this.qrcodeVisible=true
			},
			doPrintVlOrder(row){
				// row.seq='1234567890'
				this.$axios.post2('/sc/vl-entry-order/doPrintVlOrder1/',row)
				.then(function(response) {
					window.open(response.data.data)
				}.bind(this)).catch(function(error) {
					let errorinfo = error.response.data.messageInfo;
					this.openError(errorinfo)
				}.bind(this));
				// let host = window.location.host;
				// let hostName = host.split(":")[0];
				// let orgId = window.localStorage.getItem("orgId");
				// let userId = window.localStorage.getItem("userId");
				// let url = "http://" + hostName + ":8084/sc/vl-entry-order/doPrintVlOrder";
				// let entryOrderId = row.entryOrderId;
				// this.openPostWindow(url, orgId, entryOrderId, userId);
			},
			openPostWindow(url, orgId, entryOrderId, userId) {
				var newWin = window.open(),
					formStr = '';
				//设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
				formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
					'<input type="hidden" name="orgId" value="' + orgId + '" />' +
					'<input type="hidden" name="entryOrderId" value="' + entryOrderId + '" />' +
					'<input type="hidden" name="userId" value="' + userId + '" />' +
					'</form>';
				newWin.document.body.innerHTML = formStr;
				newWin.document.forms[0].submit();
				return newWin;
			},
			doVEEntryConfirm(row){
				this.$confirm('此操作将强制核销登记卡口入区, 是否继续?', '注意', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true
				}).then(() => {
					this.$axios.post("/afbase/send/doVEEntryConfirm/"+row.entryOrderId).then(function (response) {
			            if (response.data.code == 0) {
			                if(response.data.data.status=='success'){
			                  this.openSuccess('强制核销成功');
				            }else{
				                  this.openError(response.data.data.message);
				            }
			            } else {
			                this.openError(response.data.messageInfo || "强制核销失败!");
			            }
		            }.bind(this));

      			}).catch(() => {});
			},
			formatter_vehteamFlag(row, column) {
				if (row.vehteamFlag===0) {
					return '单车';
				}else if (row.vehteamFlag===1) {
					return '车队';
				}
				return '';
			},
			formatter_warehouseCode(row, column) {
				if (row.warehouseCode=='514101/5141') {
					return '南航货站';
				}else if (row.warehouseCode=='514102/5141') {
					return '国际1号货站';
				}
				return '';
			},
			formatter_mawbNumbers(row, column) {
				if (row.mawbNumbers && row.mawbNumbers.indexOf(",")>0) {
					return row.mawbNumbers.split(",")[0]+"...";
				}else {
					return row.mawbNumbers;
				}
			},

			gotoEditPage(row, column, event){	
				this.ffrow.entryOrderId=row.entryOrderId
				this.firstState1=false
				this.secondState1=false
				this.checkVue(this.activeName);	
			},
			gotoAddPage(row, column, event){	
				this.ffrow.entryOrderId=''
				this.firstState1=false
				this.secondState1=false
				this.checkVue(this.activeName);	
			},
			queryEntryOrderList() {
				let params={
					vlOrderId:this.frow.orderId
				}
				this.$axios.get2("/sc/vl-entry-order/getListPage",params)
					.then((response) => {
						if(response.data.code == '0') {
							this.entryOrderList.data = response.data.data

							for (let i = 0; i<this.entryOrderList.data.length; i++) {
								if (this.entryOrderList.data[i].mft8802024MessageId) {
									this.$axios.post("/afbase/send/doVEEntryQuery/"+this.entryOrderList.data[i].entryOrderId).then(function (response2) {
						            if (response2.data.code == 0) {
						                if(response2.data.data.status=='success'){
											this.entryOrderList.data[i].symbol=response2.data.data.Symbol
								            this.entryOrderList.data[i].text=response2.data.data.Text
								            this.entryOrderList.data[i].seq=response2.data.data.IC_SEQ
								            this.entryOrderList.data[i].declareDate=response2.data.data.DeclareDate
 
							            }
						            } 
					            }.bind(this));
					            }
							}
							// this.entryOrderList.data = response.data.data
						} 
					}).catch((error) => {
						
					});
			},
			handleClick(tab, event) {
				this.checkVue(tab.name)
				this.ffrow = this.frow
			},
			checkVue(name) {
				switch (name) {
					case 'first':
						this.first = ''
						this.firstState1=true
						this.secondState1=false
						this.helpDocumentUrl = this.helpDocumentUrlForOrderInfo
						this.$nextTick(() => {
							this.first = this.orderInfo
						})
						break
					case 'second':
						this.second = ''
						this.firstState1=false
						this.secondState1=true
						this.helpDocumentUrl = this.helpDocumentUrlForFile
						this.$nextTick(() => {
							this.second = this.fileUpload
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
