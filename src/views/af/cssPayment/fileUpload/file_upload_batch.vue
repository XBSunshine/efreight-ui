<template>
	<el-dialog style="top:-80px;" title="附件 - 批量上传" width="640px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="附件类型" prop="fileType" required label-width="115px">
						<el-select v-model="ruleForm.fileType" placeholder="请选择" style="width: 115px;">
							<el-option label="照片" value="照片"></el-option>
							<el-option label="文件" value="文件"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item style="margin-left: 35px;">
						<el-upload :disabled="disabled" class="el-form-item__content3" :action="actionPath" :accept="accept" :data="param" multiple :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handleError" :on-change="uploadChange" ref="upload" :show-file-list="false" :auto-upload="false">
							<el-button size="mini" type="primary" @click="clickSelect" :disabled="disabled">选择</el-button>&nbsp;
							<font size="1px" @click="clickSelect">支持格式：PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG , 最大10M。</font>
						</el-upload>
						<el-row v-for="item,index in fileList" :key='index'>
							<el-col :span="22">{{item.fileName}}</el-col>
							<el-col :span="2">
								<font style="color: blue;cursor: pointer;" @click="remove(index)">x</font>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button :loading="loading" size="mini" type="primary" @click="submitForm('ruleForm')">保存</el-button>
				</el-form-item>
			</el-row>
		</el-form>
	</el-dialog>
</template>
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
				ruleForm: {
					fileType: '文件'
				},
				list: [],
				fileList: [],
				actionPath: 'http://up-z1.qiniu.com',
				accept: ".PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG",
				param: {
					token: '',
					key: ""
				},
				disabled: false,
				loading: false,
				ifCanUpload: true,
				successCount: 0
			};
		},
		inject: ['queryUplaodFileList'],
		created() {
			this.$axios.get('/hrs/org/getUpToken')
				.then((response) => {
					this.param.token = response.data.data;
					if (!this.param.token) {
						this.openError('因缺失token，无法上传文件')
						this.disabled = true
					}
				});
		},
		methods: {
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			submitForm(formName) {
				this.loading = true
				this.successCount = 0
				if (this.fileList.length == 0) {
					this.openError("请上传附件")
					this.loading = false
					return
				}
				this.$refs.upload.submit()
			},
			clickSelect() {
				if (this.ruleForm.fileType == '照片') {
					this.accept = '.JPG,.JPEG,.BMP,.PNG'
				} else {
					this.accept = '.PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG'
				}
				this.ifCanUpload = true
			},
			//上传附件
			beforeUpload(file, fileList) {
				let fileItem = this.fileList.find(item => item.uid == file.uid)
				if (fileItem) {
					this.param.key = fileItem.key
				} else {
					return false
				}
			},
			handleError(error, file, fileList) {
				this.openError(error)
				this.loading = false
			},
			handleSuccess(response, file, fileList) {
				this.successCount++
				if (this.successCount == this.fileList.length) {
					this.$axios.post2("/afbase/cssCostFiles/batch", this.fileList).then(response => {
						this.openSuccess("保存成功")
						this.loading = false
						this.queryUplaodFileList()
						this.handleClose()
					}).catch(error => {
						this.openError(error.response.data.messageInfo)
						this.fileList = []
						this.loading = false
					})
				}
			},
			remove(index) {
				this.fileList.splice(index, 1)
			},
			uploadChange(file, fileList) {
				if (this.ifCanUpload) {
					if (file.status == 'ready') {
						if (file.size > 10 * 1024 * 1024) {
							this.openError('上传模板大小不能超过 10MB!')
							this.fileList = []
							this.$refs.upload.clearFiles()
							this.ifCanUpload = false
							return
						}
						if ("PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) == -1) {
							this.openError("附件格式有误")
							this.fileList = []
							this.$refs.upload.clearFiles()
							this.ifCanUpload = false
							return
						}
						if (this.ruleForm.fileType == '照片') {
							if ("JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) == -1) {
								this.openError("附件类型只可选择照片")
								this.fileList = []
								this.$refs.upload.clearFiles()
								this.ifCanUpload = false
								return
							}
						}
						let key = 'org/' + this.getYYMM() + '/' + localStorage.getItem("orgUuid") + '/cost_' + (this.frow.flag == "invoice" ? "invoice" : "invoice_writeoff") + '_' + this.getDDHHMMSS() + '_' + file.uid + file.name.substring(file.name.lastIndexOf('.'))
						// let key = 'css/cost/' + this.frow.flag + '/' + localStorage.getItem("orgUuid") + '/cost_' + this.frow.flag + '_' + file.uid + file.name.substring(file.name.lastIndexOf('.'))
						this.fileList.push({
							uid: file.uid,
							key: key,
							fileType: this.ruleForm.fileType,
							fileName: file.name.substring(0, file.name.lastIndexOf('.')),
							fileUrl: "http://doc.yctop.com/" + key,
							fileRemark: '',
							businessScope: this.frow.businessScope,
							paymentId: this.frow.paymentId,
							invoiceDetailId: this.frow.invoiceDetailId,
							invoiceDetailWriteoffId: this.frow.invoiceDetailWriteoffId
						})
					}
				}
			},
			getYYMM() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				_month++
				if (_month < 10) {
					_month = "0" + _month
				}
				_year = (_year + "").substr(2)
				return _year + '' + _month
			},
			getDDHHMMSS() {
				let theDate = new Date()
				let _date = theDate.getDate();
				let _hours = theDate.getHours()
				let _minutes = theDate.getMinutes()
				let _seconds = theDate.getSeconds()
				if (_date < 10) {
					_date = "0" + _date;
				}
				if (_hours < 10) {
					_hours = "0" + _hours;
				}
				if (_minutes < 10) {
					_minutes = "0" + _minutes;
				}
				if (_seconds < 10) {
					_seconds = "0" + _seconds;
				}
				return _date + '' + _hours + '' + _minutes + '' + _seconds
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">

</style>
