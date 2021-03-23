<template>
	<el-dialog style="top:-80px;" title="附件 - 上传" width="640px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="附件名称" prop="fileName" required label-width="115px">
						<el-input v-model="ruleForm.fileName" auto-complete="off" @change="ruleForm.fileName=strTrim(ruleForm.fileName)" clearable style="width:465px">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
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
					<el-form-item label="附件" prop="fileUrl" label-width="115px">
						<el-input v-model="ruleForm.fileUrl" style="width:395px" disabled>
						</el-input>
					</el-form-item>
					<el-form-item label-width="1px">
						<el-upload :disabled="disabled" :action="actionPath" :accept="accept" :show-file-list="false" :data="param" :on-success="handleSuccess" :on-error="handleError" :on-change="uploadChange" :before-upload="beforeUpload" ref="upload" :auto-upload="false">
							<el-button type="primary" size="mini" @click="clickSelect" :disabled="disabled">选择</el-button>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<span style="margin-left: 120px;font-size: smaller;">支持格式：PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG , 最大10M。</span>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="备注" label-width="115px">
						<el-input type="textarea" :rows="3" v-model="ruleForm.fileRemark" maxlength="200" show-word-limit auto-complete="off" clearable style="width:465px;margin-top: 8px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button :loading="loading" type="primary" size="mini" @click="submitForm('ruleForm')">保存</el-button>
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
					fileType: '文件',
					fileName: '',
					fileUrl: '',
					fileRemark: '',
					businessScope: this.frow.businessScope,
					paymentId: this.frow.paymentId,
					invoiceDetailId: this.frow.invoiceDetailId,
					invoiceDetailWriteoffId: this.frow.invoiceDetailWriteoffId
				},
				actionPath: 'http://up-z1.qiniu.com',
				accept: ".PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG",
				param: {
					token: '',
					key: ""
				},
				rules: {
					fileName: [{
							required: true,
							message: '请录入附件名称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 100,
							message: '附件名称长度为 100',
							trigger: ['blur', 'change']
						}
					],
					fileUrl: [{
						required: true,
						message: '请选择附件',
						trigger: ['blur', 'change']
					}],
					fileType: [{
						required: true,
						message: '请选择附件类型',
						trigger: ['blur', 'change']
					}],
				},
				disabled: false,
				loading: false
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
				})
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
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$refs.upload.submit()
					}
				});
			},
			clickSelect() {
				if (this.ruleForm.fileType == '照片') {
					this.accept = '.JPG,.JPEG,.BMP,.PNG'
				} else {
					this.accept = '.PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG'
				}
			},
			beforeUpload(file) {
				if (this.ruleForm.fileType == '照片') {
					if ("JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) == -1) {
						this.openError("附件类型与上传文件格式不相符，上传失败！")
						this.ruleForm.fileUrl = ''
						this.ruleForm.fileName = ''
						this.loading = false
						return false
					}
				}
			},
			handleSuccess(response, file, fileList) {
				this.$axios.post2("/afbase/cssCostFiles", this.ruleForm).then(response => {
					this.openSuccess("保存成功")
					this.loading = false
					this.queryUplaodFileList()
					this.handleClose()
				}).catch(error => {
					this.openError(error.response.data.messageInfo)
					this.ruleForm.fileUrl = ''
					this.ruleForm.fileName = ''
					this.loading = false
				})
			},
			handleError(error, file, fileList) {
				this.openError(error)
				this.ruleForm.fileUrl = ''
				this.ruleForm.fileName = ''
				this.loading = false
			},
			uploadChange(file, fileList) {
				if (file.status == 'ready') {
					if (file.size > 10 * 1024 * 1024) {
						this.openError('上传模板大小不能超过 10MB!')
						this.ruleForm.fileUrl = ''
						this.ruleForm.fileName = ''
						return
					}
					if ("PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) == -1) {
						this.openError("附件格式有误")
						this.ruleForm.fileUrl = ''
						this.ruleForm.fileName = ''
						return
					}
					if (this.ruleForm.fileType == '照片') {
						if ("JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) == -1) {
							this.openError("附件类型只可选择照片")
							this.ruleForm.fileUrl = ''
							this.ruleForm.fileName = ''
							return
						}
					}
					this.param.key = 'org/' + this.getYYMM() + '/' + localStorage.getItem("orgUuid") + '/cost_' + (this.frow.flag == "invoice" ? "invoice" : "invoice_writeoff") + '_' + this.getDDHHMMSS() + '_' + new Date().getTime() + file.name.substring(file.name.lastIndexOf('.'))
					this.ruleForm.fileUrl = "http://doc.yctop.com/" + this.param.key
					this.ruleForm.fileName = file.name.substring(0, file.name.lastIndexOf('.'))
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
