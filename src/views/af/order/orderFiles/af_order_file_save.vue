<template>
	<el-dialog style="top:-80px;" title="附件 - 上传" width="640px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="附件名称" prop="fileName" required label-width="115px">
						<el-input v-model="ruleForm.fileName" auto-complete="off" clearable style="width:465px" :disabled="disabledFlag">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="附件类型" prop="fileType" required label-width="115px">
						<el-select v-model="ruleForm.fileType" placeholder="请选择" style="width: 115px;" :disabled="disabledFlag">
							<el-option label="照片" value="照片"></el-option>
							<el-option label="文件" value="文件"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="是否对外显示" prop="fileType" required label-width="115px">
						<el-select v-model="ruleForm.isDisplay" placeholder="请选择" style="width: 85px;" :disabled="disabledFlag">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
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
						<el-upload :action="actionPath" :accept="accept3" :show-file-list="false" :data="uptoken" :before-upload="beforeAvatarUpload3" :on-remove="handleRemoveChange3" :on-success="handleSuccessChange3" ref="upload3" :auto-upload="true">
							<el-button type="primary" size="mini" @click="clickSelect" :disabled="disabledFlag">选择</el-button>
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
						<el-input type="textarea" :rows="3" v-model="ruleForm.fileRemark" maxlength="200" show-word-limit auto-complete="off" clearable style="width:465px;margin-top: 8px;" :disabled="disabledFlag">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button :loading="loading" :disabled="uptoken.token==null||uptoken.token==''" size="mini" type="primary" @click="submitForm1('ruleForm')">保存</el-button>
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
					businessScope: '',
					orderId: '',
					fileType: '文件',
					fileName: '',
					fileUrl: '',
					fileRemark: '',
					isDisplay: '1',
					chBillTemplate: '',
				},
				fileList: [],
				actionPath: 'http://up-z1.qiniu.com',
				accept3: ".PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG",
				uptoken: {
					token: '',
					key: ""
				},
				formData: {
					smallModelPhoto: [],
				},
				disabledFlag: false,
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
					isDisplay: [{
						required: true,
						message: '请选择是否对外显示',
						trigger: ['blur', 'change']
					}],
				},
				noExecute: false,
				loading: false
			};
		},
		inject: ['queryOrderFiles'],
		created() {
			this.ruleForm.orderId = this.frow.orderId
			this.ruleForm.businessScope = this.frow.businessScope
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.uptoken.token = response.data.data;
					if (this.uptoken.token == null || this.uptoken.token == '') {
						this.$message.error('因缺失token，无法上传文件，故无法新增附件')
					}
				}.bind(this));
		},
		methods: {
			openSuccess() {
				this.$notify({
					title: '',
					message: '保存成功',
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
				this.disabledFlag = true
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$refs.upload.submit()
					} else {
						this.disabledFlag = false
						console.log('error submit!!');
						return false;
					}
				});
			},
			clickSelect() {
				//this.fileList = []
				if (this.ruleForm.fileType == '照片') {
					this.accept3 = '.JPG,.JPEG,.BMP,.PNG'
				} else {
					this.accept3 = '.PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG'
				}
			},
			checkFileType() {
				if (this.ruleForm.fileType == '照片') {
					if (this.ruleForm.fileUrl) {
						if ("JPG/JPEG/BMP/PNG".indexOf(this.ruleForm.fileUrl.substring(this.ruleForm.fileUrl.lastIndexOf('.') + 1).toUpperCase()) > -1) {

						} else {
							this.openError("附件类型只可选择文件")
							this.ruleForm.fileType = '文件'
							return
						}
					}
				} else {}
			},
			beforeAvatarUpload3(file) {
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				if (month < 10) {
					month = '0' + month
				}
				this.uptoken.key = "Order_attachment_" + year.toString().substring(2) + month + "_" + this.hexMD5(new Date().getTime()) + file.name.substring(file.name.lastIndexOf('.'));
				const isLt10M = file.size < 10 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if (isLt10M) {

					this.ruleForm.fileUrl = "http://doc.yctop.com/" + this.uptoken.key
					this.ruleForm.fileName = file.name.substring(0, file.name.lastIndexOf('.'));
				}
				return isLt10M;
			},
			handleSuccessChange3(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.fileUrl = "http://doc.yctop.com/" + response.key;
			},
			handleRemoveChange3(file, fileList) {
				var filelists = [];
				this.ruleForm.fileUrl = '';
				this.formData3.smallModelPhoto = filelists;
			},
			uploadChange(file, fileList) {
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				if (month < 10) {
					month = '0' + month
				}
				this.uptoken.key = "Order_attachment_" + year.toString().substring(2) + month + "_" + this.hexMD5(new Date().getTime()) + file.name.substring(file.name.lastIndexOf('.'));
				this.ruleForm.fileUrl = "http://doc.yctop.com/" + this.uptoken.key
				if (this.ruleForm.fileName == null || this.ruleForm.fileName == '') {
					this.ruleForm.fileName = file.name.substring(0, file.name.lastIndexOf('.'));
				}

				/*if("PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) > -1) {
				} else {
					this.openError("附件格式有误")
          this.ruleForm.fileName = ''
          this.ruleForm.fileUrl = ''
					return
				}
				if(this.ruleForm.fileType == '照片'){
            if("JPG/JPEG/BMP/PNG".indexOf(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()) > -1) {

            } else {
                this.openError("只可选择图片类型(JPG/JPEG/BMP/PNG)")
                this.ruleForm.fileName = ''
                this.ruleForm.fileUrl = ''
                return
            }
        }else{
        }
				if(file.size > 10 * 1024) {
            this.ruleForm.fileType = ''
            this.openError("上传模板大小不能超过 10MB")
            //return false
				} else {

            this.$message.success('选择成功')
				}*/

			},
			submitForm1(formName) { //上传成功后在图片框显示图片
				this.noExecute = true
				this.disabledFlag = true
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						if ("PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG".indexOf(this.ruleForm.fileUrl.substring(this.ruleForm.fileUrl.lastIndexOf('.') + 1).toUpperCase()) > -1) {} else {
							this.openError("附件格式有误")
							this.loading = false
							this.disabledFlag = false
							return
						}
						if (this.ruleForm.fileType == '照片') {
							if (this.ruleForm.fileUrl) {
								if ("JPG/JPEG/BMP/PNG".indexOf(this.ruleForm.fileUrl.substring(this.ruleForm.fileUrl.lastIndexOf('.') + 1).toUpperCase()) > -1) {

								} else {
									this.openError("附件类型只可选择照片")
									this.loading = false
									this.disabledFlag = false
									return
								}
							}
						} else {}
						this.$axios.post2('/afbase/orderFiles/doSave', this.ruleForm)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.queryOrderFiles();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
									this.fileList = []
									this.loading = false
									this.disabledFlag = false
									this.ruleForm.fileUrl = ''
									this.ruleForm.fileName = ''
								}
								this.loading = false
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.message;
								this.openError(errorinfo);
								this.fileList = []
								this.ruleForm.fileUrl = ''
								this.ruleForm.fileName = ''
								this.loading = false
								this.disabledFlag = false
							}.bind(this));
					} else {
						this.loading = false
						this.disabledFlag = false
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleErrorChange(err, file, fileList) { //上传成功后在图片框显示图片
				this.noExecute = true
				this.loading = false
				this.disabledFlag = false
				this.ruleForm.fileUrl = ''
				this.ruleForm.fileName = ''
				this.openError('保存失败，原因：附件上传失败！')
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			//MD5
			safeAdd(x, y) {
				let lsw = (x & 0xffff) + (y & 0xffff)
				let msw = (x >> 16) + (y >> 16) + (lsw >> 16)
				return (msw << 16) | (lsw & 0xffff)
			},

			bitRotateLeft(num, cnt) {
				return (num << cnt) | (num >>> (32 - cnt))
			},

			md5cmn(q, a, b, x, s, t) {
				return this.safeAdd(this.bitRotateLeft(this.safeAdd(this.safeAdd(a, q), this.safeAdd(x, t)), s), b)
			},

			md5ff(a, b, c, d, x, s, t) {
				return this.md5cmn((b & c) | (~b & d), a, b, x, s, t)
			},

			md5gg(a, b, c, d, x, s, t) {
				return this.md5cmn((b & d) | (c & ~d), a, b, x, s, t)
			},

			md5hh(a, b, c, d, x, s, t) {
				return this.md5cmn(b ^ c ^ d, a, b, x, s, t)
			},

			md5ii(a, b, c, d, x, s, t) {
				return this.md5cmn(c ^ (b | ~d), a, b, x, s, t)
			},

			binlMD5(x, len) {
				/* append padding */
				x[len >> 5] |= 0x80 << (len % 32)
				x[((len + 64) >>> 9 << 4) + 14] = len

				let i
				let olda
				let oldb
				let oldc
				let oldd
				let a = 1732584193
				let b = -271733879
				let c = -1732584194
				let d = 271733878

				for (i = 0; i < x.length; i += 16) {
					olda = a
					oldb = b
					oldc = c
					oldd = d

					a = this.md5ff(a, b, c, d, x[i], 7, -680876936)
					d = this.md5ff(d, a, b, c, x[i + 1], 12, -389564586)
					c = this.md5ff(c, d, a, b, x[i + 2], 17, 606105819)
					b = this.md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
					a = this.md5ff(a, b, c, d, x[i + 4], 7, -176418897)
					d = this.md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
					c = this.md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
					b = this.md5ff(b, c, d, a, x[i + 7], 22, -45705983)
					a = this.md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
					d = this.md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
					c = this.md5ff(c, d, a, b, x[i + 10], 17, -42063)
					b = this.md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
					a = this.md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
					d = this.md5ff(d, a, b, c, x[i + 13], 12, -40341101)
					c = this.md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
					b = this.md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

					a = this.md5gg(a, b, c, d, x[i + 1], 5, -165796510)
					d = this.md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
					c = this.md5gg(c, d, a, b, x[i + 11], 14, 643717713)
					b = this.md5gg(b, c, d, a, x[i], 20, -373897302)
					a = this.md5gg(a, b, c, d, x[i + 5], 5, -701558691)
					d = this.md5gg(d, a, b, c, x[i + 10], 9, 38016083)
					c = this.md5gg(c, d, a, b, x[i + 15], 14, -660478335)
					b = this.md5gg(b, c, d, a, x[i + 4], 20, -405537848)
					a = this.md5gg(a, b, c, d, x[i + 9], 5, 568446438)
					d = this.md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
					c = this.md5gg(c, d, a, b, x[i + 3], 14, -187363961)
					b = this.md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
					a = this.md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
					d = this.md5gg(d, a, b, c, x[i + 2], 9, -51403784)
					c = this.md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
					b = this.md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

					a = this.md5hh(a, b, c, d, x[i + 5], 4, -378558)
					d = this.md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
					c = this.md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
					b = this.md5hh(b, c, d, a, x[i + 14], 23, -35309556)
					a = this.md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
					d = this.md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
					c = this.md5hh(c, d, a, b, x[i + 7], 16, -155497632)
					b = this.md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
					a = this.md5hh(a, b, c, d, x[i + 13], 4, 681279174)
					d = this.md5hh(d, a, b, c, x[i], 11, -358537222)
					c = this.md5hh(c, d, a, b, x[i + 3], 16, -722521979)
					b = this.md5hh(b, c, d, a, x[i + 6], 23, 76029189)
					a = this.md5hh(a, b, c, d, x[i + 9], 4, -640364487)
					d = this.md5hh(d, a, b, c, x[i + 12], 11, -421815835)
					c = this.md5hh(c, d, a, b, x[i + 15], 16, 530742520)
					b = this.md5hh(b, c, d, a, x[i + 2], 23, -995338651)

					a = this.md5ii(a, b, c, d, x[i], 6, -198630844)
					d = this.md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
					c = this.md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
					b = this.md5ii(b, c, d, a, x[i + 5], 21, -57434055)
					a = this.md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
					d = this.md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
					c = this.md5ii(c, d, a, b, x[i + 10], 15, -1051523)
					b = this.md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
					a = this.md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
					d = this.md5ii(d, a, b, c, x[i + 15], 10, -30611744)
					c = this.md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
					b = this.md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
					a = this.md5ii(a, b, c, d, x[i + 4], 6, -145523070)
					d = this.md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
					c = this.md5ii(c, d, a, b, x[i + 2], 15, 718787259)
					b = this.md5ii(b, c, d, a, x[i + 9], 21, -343485551)

					a = this.safeAdd(a, olda)
					b = this.safeAdd(b, oldb)
					c = this.safeAdd(c, oldc)
					d = this.safeAdd(d, oldd)
				}
				return [a, b, c, d]
			},

			binl2rstr(input) {
				let i
				let output = ''
				let length32 = input.length * 32
				for (i = 0; i < length32; i += 8) {
					output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
				}
				return output
			},

			rstr2binl(input) {
				let i
				let output = []
				output[(input.length >> 2) - 1] = undefined
				for (i = 0; i < output.length; i += 1) {
					output[i] = 0
				}
				let length8 = input.length * 8
				for (i = 0; i < length8; i += 8) {
					output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
				}
				return output
			},

			rstrMD5(s) {
				return this.binl2rstr(this.binlMD5(this.rstr2binl(s), s.length * 8))
			},

			rstr2hex(input) {
				var hexTab = '0123456789abcdef'
				var output = ''
				var x
				var i
				for (i = 0; i < input.length; i += 1) {
					x = input.charCodeAt(i)
					output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
				}
				return output
			},

			str2rstrUTF8(input) {
				return unescape(encodeURIComponent(input))
			},

			hexMD5(s) {
				return this.rstr2hex(this.rawMD5(s))
			},
			rawMD5(s) {
				return this.rstrMD5(this.str2rstrUTF8(s))
			}
		}
	}
</script>
