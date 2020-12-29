<template>
	<div class="order-qr-code-share">
		<el-dialog title="二维码 - 分享" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
			<el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
				<el-form-item label="收件人" prop="toList">
					<el-select v-model="ruleForm.toList" multiple filterable placeholder="请选择收件人" style="width: 100%">
						<el-option v-for="item in toUserList" :key="item.value" :label="`${item.label}<${item.label4}>`" :value="item.label4"> </el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="密送人">
					<el-select v-model="ruleForm.bccList" multiple filterable placeholder="请选择密送人" style="width: 100%">
						<el-option v-for="(item,index) in bccUserList" :key="index" :label="`${item.name}<${item.email}>`" :value="item.email"> </el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="邮件标题" prop="subject">
					<el-input type="textarea" v-model="ruleForm.subject"></el-input>
				</el-form-item>

				<el-form-item label="邮件内容" prop="content">
					<el-input type="textarea" :rows="8" v-model="ruleForm.content"></el-input>
				</el-form-item>

				<el-form-item label="网址/二维码" prop="website">
					<el-row>
						<el-col :span="19">
							<el-input type="textarea" disabled :rows="6" v-model="ruleForm.website"></el-input>
						</el-col>
						<el-col :span="5" style="text-align: center" id="order-qr-code-share">
							<vue-qr :text="ruleForm.website" :size="110" style="display: none" :margin="5" :callback="qrCodeCallBack"></vue-qr>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="submitSendEmail('ruleForm')" :loading="loading">确认发送</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<style type="text/css">
	.order-qr-code-share .el-textarea__inner {
		height: 151px;
	}
</style>
<script>
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
				ffrow: {},
				addUser: false,
				loading: false,
				ruleForm: {
					toUsers: "",
					bccUsers: "",
					subject: "",
					content: "",
					website: "",
					imageURL: "",
					toList: [],
					bccList: []
				},
				rules: {
					toList: [{
						required: true,
						message: '请选择收件人',
						trigger: ['blur', 'change']
					}],
					subject: [{
						required: true,
						message: '请输入邮件标题',
						trigger: ['blur', 'change']
					}]
				},
				toUserList: [],
				bccUserList: [],
				upload: {
					token: "",
					key: "",
					file: "",
				},
			}
		},
		methods: {
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			submitSendEmail(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.ruleForm.imageURL = document.getElementById("order-qr-code-image").src;
						this.loading = true;
						let bcc = this.ruleForm.bccList;
						if (bcc && bcc.length > 0) {
							this.ruleForm.bccUsers = bcc.join(";");
						}
						let to = this.ruleForm.toList;
						if (to && to.length > 0) {
							this.ruleForm.toUsers = to.join(";");
						}
						this.$axios.post2('/afbase/orderInquiry/sendQrcode', this.ruleForm).then((response) => {
							this.loading = false;
							if (0 == response.data.code) {
								this.openSuccess();
								this.handleClose();
							} else {
								this.openError(response.data.messageInfo || "邮件发送失败");
							}
						}).catch(() => {
							this.loading = false;
							this.openError("发送失败，请稍后再试");
						})
					}
				});
			},
			loadToUserList() {
				this.$axios.get('/hrs/dept/selectUser').then(function(response) {
					this.toUserList = response.data.data
					let userEmail = window.localStorage.getItem('userEmail')
					if (userEmail != null && userEmail !== '') {
						this.ruleForm.toList.push(userEmail)
					}
				}.bind(this));
			},
			loadBccUserList() {
				this.$axios.get('/afbase/orderInquiry/getInquryAgentContactList/' + this.frow.inquiryAgentIds)
					.then((response) => {
						this.bccUserList = response.data.data;
						if (this.bccUserList) {
							this.ruleForm.bccList = this.bccUserList.map(item => item.email)
						}
					})
			},
			initNormalData() {
				this.ruleForm.subject = "空运出口询价 ：" + this.frow.orderInquiryCode
				this.ruleForm.website = location.origin + "/#/af_order_inquiry_quotation?orderInquiryUuid=" + this.frow.orderInquiryOrderUuid
				if (this.frow.carrierCode) {
					this.ruleForm.content += this.frow.carrierCode + ","
				}
				this.ruleForm.content += this.frow.departureStation + "-" + this.frow.arrivalStation
				this.ruleForm.content += "\n" + this.frow.planPieces + this.frow.packageType + "/" + this.frow.planWeight + "KG/" + this.frow.planVolume + "CBM"
				if (this.frow.planDimensions) {
					this.ruleForm.content += "\n" + this.frow.planDimensions
				}
				this.ruleForm.content += "\n" + this.frow.goodsNameCn
				if (this.frow.goodsType && this.frow.batteryType) {
					this.ruleForm.content += "," + this.frow.goodsType + "," + this.frow.batteryType
				} else if (this.frow.goodsType) {
					this.ruleForm.content += "," + this.frow.goodsType
				} else if (this.frow.batteryType) {
					this.ruleForm.content += "," + this.frow.batteryType
				}
				if (this.frow.expectDeparture && this.frow.flightRemark) {
					this.ruleForm.content += "\n货好日期 : " + this.frow.expectDeparture + " , 时间要求 : " + this.frow.flightRemark
				} else if (this.frow.expectDeparture) {
					this.ruleForm.content += "\n货好日期 : " + this.frow.expectDeparture
				} else if (this.frow.flightRemark) {
					this.ruleForm.content += "\n时间要求 : " + this.frow.flightRemark
				}
				if (this.frow.planAmount || this.frow.planUnitprice) {
					this.ruleForm.content += "\n期望价格 : " + (this.frow.planAmount || this.frow.planUnitprice) + " 以下"
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
			qrCodeCallBack(data) {
				this.drawBorderQR(this.frow.orderInquiryCode, 130, 150, data);
			},
			getLoginUserEmail() {
				let userName = localStorage.getItem("username") || "";
				let email = userName.substring(userName.indexOf('_') + 1) || "";
				return email;
			},
			gotoAddPage() {
				this.ffrow['coop_id'] = this.frow.coopId;
				this.ffrow['contacts_type'] = '操作';
				this.addUser = true
			},
			drawBorderQR(text, width, height, imgDataBase64) {
				let canvas = document.createElement("canvas");
				canvas.id = "canvas";
				canvas.width = width;
				canvas.height = height;
				let ctx = canvas.getContext("2d");
				//背景色
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				//边框
				ctx.strokeStyle = "#409eff";
				ctx.lineWidth = 5;
				ctx.strokeRect(0, 0, canvas.width, canvas.height);
				//添加图片
				let img = new Image();
				img.src = imgDataBase64;
				img.onload = () => {
					ctx.drawImage(img, 10, 10);
					//添加文字
					let fontSize = text.length > 12 ? '14px' : '16px';
					ctx.font = fontSize + ' Microsoft YaHei';
					ctx.textAlign = "center";
					ctx.fillStyle = "#000000";
					ctx.fillText(text, canvas.width / 2, 140);

					let htmlImg = document.createElement("img");
					htmlImg.id = "order-qr-code-image";
					htmlImg.src = canvas.toDataURL();
					document.getElementById("order-qr-code-share").append(htmlImg);
				}
			}
		},
		created() {
			this.initNormalData();
			this.loadToUserList();
			this.loadBccUserList();
		},
	}
</script>
