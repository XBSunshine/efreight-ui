<template>
	<div>
		<el-dialog title="账单 - 发送邮件" width="480px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
			<el-form ref="ruleForm" label-width="120px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="账单模板类型" required>
							<el-select v-model="ruleForm.templateType" placeholder="请选择" style="width: 120px;" @change="changeTemlateType">
								<el-option v-for="(templateType,index) in templateTypes" :key="index" :label="templateType.name" :value="templateType.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="收件人" required>
							<el-select v-model="receiver" filterable multiple clearable placeholder="请选择收件人" style="width: 260px;">
								<el-option v-for="(receiver,index) in receivers" :key="index" :label="`${receiver.contacts_name}<${receiver.email}>`" :value="receiver.contacts_id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-form-item style="margin-left: -10px;width: 26px;">
						<el-button type="primary" style="padding: 7px 5px;" @click="gotoAddPage('ruleForm')" size="mini">新增</el-button>
					</el-form-item>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="抄送人">
							<el-select v-model="ccUser" filterable multiple clearable placeholder="请选择抄送人" style="width: 300px;">
								<el-option v-for="(ccUser,index) in ccUsers" :key="index" :label="`${ccUser.label}<${ccUser.label4}>`" :value="ccUser.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="邮件标题" required>
							<el-input type="textarea" :rows="3" v-model="ruleForm.subject" auto-complete="off" placeholder="请录入邮件标题" style="width: 300px;">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="邮件正文">
							<el-input type="textarea" :rows="5" v-model="ruleForm.content" auto-complete="off" placeholder="请录入邮件正文" style="width: 300px;">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="附件">
							<el-select v-model="orderFileIds" filterable multiple clearable placeholder="请选择附件" style="width: 300px;">
								<el-option v-for="(orderFile,index) in orderFiles" :key="index" :label="'<'+orderFile.fileType+'>'+orderFile.fileName" :value="orderFile.orderFileId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="5px" style="margin-bottom: 5px;">
							<el-button :loading="loading" type="primary" size="small" @click="sendSubmit">确认发送</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<addUser ref="addMission" v-if="addUser" :visible.sync="addUser" :frow="ffrow"></addUser>
	</div>
</template>
<script>
	import addUser from './af_debit_note_list_send_add'
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
				addUser: false,
				ffrow: {},
				ruleForm: {
					businessScope: '',
					templateType: 'C',
					receiver: '',
					ccUser: '',
					subject: '',
					content: '',
					debitNoteId: '',
					orderFileIds: '',
					orgName: '',
				},
				templateTypes: [{
					name: '中文账单',
					value: 'C'
				}, {
					name: '英文账单',
					value: 'E'
				}],
				orderFileIds: [],
				receiver: [],
				receivers: [],
				ccUser: [],
				ccUsers: [],
				orderFiles: [],
				billNo: '',
				loading: false
			}
		},
		components: {
			'addUser': addUser
		},
		provide() {
			return {
				queryContactsList: this.queryContactsList
			}
		},
		created: function() {
			this.receiver = this.frow.contact.orderContacts
			this.receivers = this.frow.contact.contactsOptions
			//this.ccUsers = this.frow.employee.useroptions
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.ccUsers = response.data.data;
				/*		let userId = window.localStorage.getItem('userId')
						let servicerId = this.frow.servicerId
						let salesId = this.frow.salesId
						if (userId != null && userId !== '') {
							this.ccUser.push(parseInt(userId))
						}
						if (servicerId != null && servicerId !== '' && servicerId != userId) {
							this.ccUser.push(parseInt(servicerId))
						}
						if (salesId != null && salesId !== '' && salesId != servicerId && salesId != userId) {
							this.ccUser.push(parseInt(salesId))
						}*/
				//查询个人信息设置的发送账单得默认抄送人
				let permissionName = '发送账单';
				this.$axios.get('/hrs/dept/selectOrderTrackCcUserId?permissionName=' + permissionName).then(function(response) {
					let orderTrackCcUser = response.data.data || [];
					orderTrackCcUser.forEach(item => {
						this.ccUser.push(item);
					})
					this.ccUser = this.uniq(this.ccUser); //去掉重复的值
				}.bind(this));
			}.bind(this));

			let orderId = ''
			let businessScope = ''

			if (this.frow.count == "one") {
				this.ruleForm.debitNoteId = this.frow.data.debitNoteId
				this.billNo = this.frow.data.debitNoteNum
				orderId = this.frow.data.orderId
				businessScope = this.frow.data.businessScope
			} else if (this.frow.count == "many") {
				let billNo = ''
				this.frow.data.forEach((item) => {
					if (billNo == '') {
						billNo = item.debitNoteNum
					} else {
						billNo += '/' + item.debitNoteNum
					}
				})
				this.billNo = billNo
				this.ruleForm.debitNoteId = this.frow.data.map((i) => {
					return i.debitNoteId
				}).join();
				orderId = this.frow.data[0].orderId
				// businessScope = this.frow.data[0].businessScope
				businessScope = this.frow.businessScope
			}
			let code2 = "";
			let coopName = ''
			if (businessScope == 'AE') {
				coopName = this.frow.coopName;
				if (this.frow.awbNumber) {
					code2 = this.frow.awbNumber
				} else {
					code2 = this.frow.customerNumber
				}
			} else if (businessScope == 'SE') {
				coopName = this.frow.customerName;
				if (this.frow.mblNumber) {
					code2 = this.frow.mblNumber
				} else {
					code2 = this.frow.customerNumber
				}
			} else if (businessScope == 'AI') {
				coopName = this.frow.coopName;
				if (this.frow.awbNumber && this.frow.hawbNumber) {
					code2 = this.frow.awbNumber + '_' + this.frow.hawbNumber
				} else if (this.frow.awbNumber) {
					code2 = this.frow.awbNumber
				} else if (this.frow.hawbNumber) {
					code2 = this.frow.hawbNumber
				} else {
					code2 = this.frow.customerNumber
				}
			} else if (businessScope == 'SI') {
				coopName = this.frow.customerName;
				if (this.frow.mblNumber && this.frow.hblNumber) {
					code2 = this.frow.mblNumber + '_' + this.frow.hblNumber
				} else if (this.frow.mblNumber) {
					code2 = this.frow.mblNumber
				} else if (this.frow.hblNumber) {
					code2 = this.frow.hblNumber
				} else {
					code2 = this.frow.customerNumber
				}
			} else if (businessScope == 'TE') {
				coopName = this.frow.customerName;
				if (this.frow.rwbNumber) {
					code2 = this.frow.rwbNumber
				} else {
					code2 = this.frow.customerNumber
				}
			} else if (businessScope == 'LC') {
				coopName = this.frow.coopName;
				if (this.frow.orderCode) {
					code2 = this.frow.orderCode
				} else if (this.frow.customerNumber) {
					code2 = this.frow.customerNumber
				}
			} else if (businessScope == 'IO') {
				coopName = this.frow.coopName;
				if (this.frow.orderCode) {
					code2 = this.frow.orderCode
				} else if (this.frow.customerNumber) {
					code2 = this.frow.customerNumber
				}
			}

			this.ruleForm.content = coopName + "，您好：\n\n" + "附件是 " + code2 + "的账单，请您查收" + "\n\n" + "谢谢";
			this.ruleForm.subject = "账单：" + code2 + ""

			//查询附件列表
			let params = {
				orderId: orderId,
				businessScope: businessScope
			}
			this.$axios.post2('/afbase/orderFiles/getList', params)
				.then((response) => {
					if (response.data.code == '0') {
						this.orderFiles = response.data.data
					} else {
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
				});
		},
		methods: {
			uniq(array) {
				var temp = [];
				for (var i = 0; i < array.length; i++) {
					//如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
					if (array.indexOf(array[i]) == i) {
						temp.push(array[i])
					}
				}
				return temp;
			},
			gotoAddPage() {
				this.ffrow.coop_id = this.frow.coopId;
				this.addUser = true
			},
			queryContactsList() {
				let params = {
					coopId: this.frow.coopId
				}
				this.$axios.get2('/prm/coop/queryContactsIsValid',
						params)
					.then(function(response) {
						this.receivers = response.data.data;

					}.bind(this));
			},
			sendSubmit(formName) {
				if (this.ruleForm.debitNoteId == '') {
					this.openError("未发现账单信息，发送失败")
					return
				}
				if (this.receiver == null || this.receiver.length == 0) {
					this.openError("请选择收件人")
					return
				}
				if (this.ruleForm.templateType == null || this.ruleForm.templateType === '') {
					this.openError("模板类型")
					return
				}
				if (this.ruleForm.subject == null || this.ruleForm.subject === '') {
					this.openError("请输入标题")
					return
				}

				//整理出收件人和抄送人
				let receiver = ''
				this.receiver.forEach((i) => {
					try {
						this.receivers.forEach((item) => {
							if (item.contacts_id == i) {
								if (receiver == '') {
									receiver = item.email
								} else {
									receiver += ',' + item.email
								}
								throw new Error('finish')
							}
						})
					} catch (e) {

					}
				})
				this.ruleForm.receiver = receiver

				let ccUser = ''
				if (this.ccUser.length > 0) {
					this.ccUser.forEach((i) => {
						try {
							this.ccUsers.forEach((item) => {
								if (item.value == i) {
									if (ccUser == '') {
										ccUser = item.label3.substring(item.label3.lastIndexOf(" ") + 1, item.label3.length)
									} else {
										ccUser += ',' + item.label3.substring(item.label3.lastIndexOf(" ") + 1, item.label3.length)
									}
									throw new Error('finish')
								}
							})
						} catch (e) {

						}
					})
				}
				this.ruleForm.ccUser = ccUser

				//整理附件
				this.ruleForm.orderFileIds = this.orderFileIds.join()
				this.loading = true
				let orgName = window.localStorage.getItem('orgName')
				this.ruleForm.orgName = orgName
				this.ruleForm.businessScope = this.frow.businessScope
				this.$axios.post2('/afbase/debitNote/send/', this.ruleForm).then((response) => {
					if (response.data.code == 0) {
						this.openSuccess("发送成功")
						this.handleClose()
					} else {
						this.openError("发送失败,原因：" + response.data.messageInfo)
					}
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
					this.openError("发送失败,原因：" + error.response.data.messageInfo)
				});
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
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
			changeTemlateType(val) {
				let code2 = "";
				let coopName = ''
				let businessScope = ''

				if (this.frow.count == "one") {
					businessScope = this.frow.data.businessScope
				} else if (this.frow.count == "many") {
					// businessScope = this.frow.data[0].businessScope
					businessScope = this.frow.businessScope
				}
				if (businessScope == 'AE') {
					coopName = this.frow.coopName;
					if (this.frow.awbNumber) {
						code2 = this.frow.awbNumber
					} else {
						code2 = this.frow.customerNumber
					}
				} else if (businessScope == 'SE') {
					coopName = this.frow.customerName;
					if (this.frow.mblNumber) {
						code2 = this.frow.mblNumber
					} else {
						code2 = this.frow.customerNumber
					}
				} else if (businessScope == 'AI') {
					coopName = this.frow.coopName;
					if (this.frow.awbNumber && this.frow.hawbNumber) {
						code2 = this.frow.awbNumber + '_' + this.frow.hawbNumber
					} else if (this.frow.awbNumber) {
						code2 = this.frow.awbNumber
					} else if (this.frow.hawbNumber) {
						code2 = this.frow.hawbNumber
					} else {
						code2 = this.frow.customerNumber
					}
				} else if (businessScope == 'SI') {
					coopName = this.frow.customerName;
					if (this.frow.mblNumber && this.frow.hblNumber) {
						code2 = this.frow.mblNumber + '_' + this.frow.hblNumber
					} else if (this.frow.mblNumber) {
						code2 = this.frow.mblNumber
					} else if (this.frow.hblNumber) {
						code2 = this.frow.hblNumber
					} else {
						code2 = this.frow.customerNumber
					}
				} else if (businessScope == 'TE') {
					coopName = this.frow.customerName;
					if (this.frow.rwbNumber) {
						code2 = this.frow.rwbNumber
					} else if (!this.frow.rwbNumber && this.frow.customerNumber) {
						code2 = this.frow.customerNumber
					} else {
						code2 = this.frow.orderCode
					}
				} else if (businessScope == 'LC') {
					coopName = this.frow.coopName;
					if (this.frow.orderCode) {
						code2 = this.frow.orderCode
					} else if (this.frow.customerNumber) {
						code2 = this.frow.customerNumber
					}
				} else if (businessScope == 'IO') {
					coopName = this.frow.coopName;
					if (this.frow.orderCode) {
						code2 = this.frow.orderCode
					} else if (this.frow.customerNumber) {
						code2 = this.frow.customerNumber
					}
				}



				if (val == 'C') {
					this.ruleForm.content = coopName + "，您好：\n\n" + "附件是 " + code2 + "的账单，请您查收" + "\n\n" + "谢谢";
					this.ruleForm.subject = "账单：" + code2 + ""
				} else if (val == 'E') {
					// this.ruleForm.content = "Hello, please see the attachment for the bill."
					// this.ruleForm.subject = "DEBITNOTE:" + this.billNo
					this.ruleForm.content = "Hi All,\n\n" + "Please find the attachment." + "\n\n" + "Thanks";
					this.ruleForm.subject = "DEBITNOTE: " + code2 + ""
				}
			}
		}
	}
</script>
