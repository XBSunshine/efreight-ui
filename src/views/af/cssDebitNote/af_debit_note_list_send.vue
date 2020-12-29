<template>
	<div>
	<el-dialog title="清单 - 发送邮件" width="480px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form ref="ruleForm" :inline="true" label-width="120px">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="清单模板类型" required>
						<el-select v-model="ruleForm.templateType" placeholder="请选择" style="width: 120px;" @change="changeTemlateType">
							<el-option v-for="(templateType,index) in templateTypes" :key="index" :label="templateType.name" :value="templateType.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth" v-if="statementfalg">
          <el-form-item label-width="20px">
            <el-checkbox v-model="ruleForm.isTrue">打印明细</el-checkbox>
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
					<el-form-item style="margin-left: -10px;width: 26px;">
							<el-button type="primary" style="padding: 7px 5px;" @click="gotoAddPage('ruleForm')" size="mini">新增</el-button>
						</el-form-item>
				</el-col>
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
				addUser:false,
				ffrow:{},
				ruleForm: {
					businessScope:'',
					templateType: 'C',
					receiver: '',
					ccUser: '',
					subject: '',
					content: '',
					statementId: '',
					orderFileIds: '',
          orgName: '',
          isTrue: true
				},
				templateTypes: [{
					name: '中文清单',
					value: 'C'
				}, {
					name: '英文清单',
					value: 'E'
				}],
				orderFileIds: [],
				receiver: [],
				receivers: [],
				ccUser: [],
				ccUsers: [],
				orderFiles: [],
				billNo: '',
				loading: false,
        statementfalg:true
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
      if(this.frow.businessScope=='AE'){
         this.templateTypes.push({name:'结算清单',value:'S'});
      }
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.ccUsers = response.data.data;
			/*	  let userId = window.localStorage.getItem('userId')
					if(userId != null && userId !== '') {
						this.ccUser.push(parseInt(userId))
					}
					if(this.frow.frow.servicerIdList != null && this.frow.frow.servicerIdList.length > 0){
					    let servicerIds = this.frow.frow.servicerIdList
              for(let j = 0,len=servicerIds.length; j < len; j++) {
                  if(servicerIds[j] != null && servicerIds[j] !== '' && servicerIds[j] !== userId){
                      this.ccUser.push(parseInt(servicerIds[j]))
                  }
              }
          }
          if(this.frow.frow.salesIdList != null && this.frow.frow.salesIdList.length > 0){
              let salesIds = this.frow.frow.salesIdList
              for(let i = 0,len=salesIds.length; i < len; i++) {
                  if(salesIds[i] != null && salesIds[i] !== '' && salesIds[i] !== userId){
                      this.ccUser.push(parseInt(salesIds[i]))
                  }
              }
          }*/
          //查询个人信息设置的送货通知码得默认抄送人
          let permissionName = '发送清单';
          this.$axios.get('/hrs/dept/selectOrderTrackCcUserId?permissionName=' + permissionName).then(function(response) {
              let orderTrackCcUser = response.data.data || [];
              orderTrackCcUser.forEach(item => {
                  this.ccUser.push(item);
              })
              this.ccUser = this.uniq(this.ccUser);//去掉重复的值
          }.bind(this));
          //this.ccUser = this.uniq(this.ccUser);//去掉重复的值
			}.bind(this));

			let params = {
				coopId: this.frow.frow.customerId
			}
			this.$axios.get2('/prm/coop/queryContactsIsValid',
					params)
				.then(function(response) {
					this.receivers = response.data.data;
					if(this.receivers != null && this.receivers.length > 0) {
						this.receiver.push(this.receivers[0].contacts_id)
					}
				}.bind(this));

				this.ruleForm.statementId =this.frow.frow.statementId
				this.billNo = this.frow.frow.statementNum
        let customerName = this.frow.frow.customerName

			this.ruleForm.content = customerName+ "，您好：\n\n"  + "附件是结算清单："+this.billNo+"，请您查收" + "\n\n" + "谢谢";
			this.ruleForm.subject = "结算清单：" + this.billNo
			this.ruleForm.businessScope=this.frow.frow.businessScope



		},
		methods: {
      uniq(array){
          var temp = [];
          for(var i = 0; i < array.length; i++) {
              //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
              if(array.indexOf(array[i]) == i){
                  temp.push(array[i])
              }
          }
          return temp;
      },
			gotoAddPage(){
				this.ffrow.coop_id = this.frow.frow.customerId;
				this.addUser = true
			},
			queryContactsList(){
				let params = {
				coopId: this.frow.frow.customerId
			}
			this.$axios.get2('/prm/coop/queryContactsIsValid',
					params)
				.then(function(response) {
					this.receivers = response.data.data;

				}.bind(this));
			},
			sendSubmit(formName) {
				if(this.ruleForm.statementId) {

				}else{
					this.openError("未发现清单信息，发送失败")
					return
				}
				if(this.receiver == null || this.receiver.length == 0) {
					this.openError("请选择收件人")
					return
				}
				if(this.ruleForm.templateType == null || this.ruleForm.templateType === '') {
					this.openError("请选择清单模板类型")
					return
				}
				if(this.ruleForm.subject == null || this.ruleForm.subject === '') {
					this.openError("请输入标题")
					return
				}

				//整理出收件人和抄送人
				let receiver = ''
				this.receiver.forEach((i) => {
					try {
						this.receivers.forEach((item) => {
							if(item.contacts_id == i) {
								if(receiver == '') {
									receiver = item.email
								} else {
									receiver += ',' + item.email
								}
								throw new Error('finish')
							}
						})
					} catch(e) {

					}
				})
				this.ruleForm.receiver = receiver

				let ccUser = ''
				if(this.ccUser.length > 0) {
					this.ccUser.forEach((i) => {
						try {
							this.ccUsers.forEach((item) => {
								if(item.value == i) {
									if(ccUser == '') {
										ccUser = item.label3.substring(item.label3.lastIndexOf(" ") + 1, item.label3.length)
									} else {
										ccUser += ',' + item.label3.substring(item.label3.lastIndexOf(" ") + 1, item.label3.length)
									}
									throw new Error('finish')
								}
							})
						} catch(e) {

						}
					})
				}
				this.ruleForm.ccUser = ccUser

				//整理附件
				// this.ruleForm.orderFileIds = this.orderFileIds.join()
				this.loading = true
        let orgName = window.localStorage.getItem('orgName')
        this.ruleForm.orgName = orgName
				this.$axios.post2('/afbase/statement/send/', this.ruleForm).then((response) => {
					if(response.data.code == 0) {
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
        let customerName = this.frow.frow.customerName
				if(val == 'C') {
            this.ruleForm.content = customerName+ "，您好：\n\n"  + "附件是结算清单："+this.billNo+"，请您查收" + "\n\n" + "谢谢";
            this.ruleForm.subject = "结算清单：" + this.billNo
            this.ruleForm.isTrue=true;
            this.statementfalg = true;
				} else if(val == 'E') {
					this.ruleForm.content = "Hi All,\n\n"+"Please see the attachment for the list." + "\n\n" + "Thanks";
					this.ruleForm.subject = "Statement: " + this.billNo
          this.ruleForm.isTrue=true;
          this.statementfalg = true;
				}else if(val == 'S'){
          this.ruleForm.content = customerName+ "，您好：\n\n"  + "附件是结算清单："+this.billNo+"，请您查收" + "\n\n" + "谢谢";
          this.ruleForm.subject = "结算清单：" + this.billNo
          this.ruleForm.isTrue=false;
          this.statementfalg = false;
        }
			}
		}
	}
</script>
<style type="text/css">

</style>
