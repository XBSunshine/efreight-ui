<template>
	<el-dialog title="询价单 - 分享" :visible.sync="visible" width="400px" :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<div style="text-align: center" id="order-qr-code-view">
			<vue-qr :text="clipboardText" :callback="qrCodeCallBack" style="display: none"></vue-qr>
		</div>
		<div slot="footer" class="dialog-footer" style="text-align: center">
			<el-button type="primary" class="btn-clipboard" :data-clipboard-text="clipboardText">复制地址</el-button>
			<!-- <el-button type="primary" @click="shareQRCodeWithEmail">邮件分享</el-button> -->
		</div>
	</el-dialog>
</template>
<script>
	import ClipboardJS from 'clipboard'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		// inject: ['shareTwoCode'],
		data() {
			return {
				clipboardText: '',
				clipboard: null,
			}
		},
		methods: {
			handleClose() {
				this.$emit('update:visible', false);
			},
			initClipboard() {
				this.clipboard = new ClipboardJS('.btn-clipboard');
				let _this = this;
				this.clipboard.on('success', function() {
					_this.$message({
						message: '复制成功',
						type: 'success'
					});
				});
				this.clipboard.on('error', function() {
					_this.$message({
						message: '复制失败',
						type: 'error'
					});
				});
			},
			shareQRCodeWithEmail() {
				this.$emit('update:visible', false);
				this.shareTwoCode(this.frow);
			},
			qrCodeCallBack(imgDataBase64) {
				this.drawBorderQR(this.frow.orderInquiryCode, 206, 230, imgDataBase64);
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
					ctx.drawImage(img, 3, 3);
					//添加文字
					let fontSize = text.length > 12 ? '22px' : '24px';
					ctx.font = fontSize + ' Microsoft YaHei';
					ctx.textAlign = "center";
					ctx.fillStyle = "#000000";
					ctx.fillText(text, canvas.width / 2, canvas.height - 20);

					let htmlImg = document.createElement("img");
					htmlImg.id = "order-qr-img";
					htmlImg.src = canvas.toDataURL();
					document.getElementById("order-qr-code-view").append(htmlImg);
				}
			}
		},
		created() {
			this.clipboardText = location.origin + "/#/af_order_inquiry_quotation?orderInquiryUuid=" + this.frow.orderInquiryOrderUuid
			this.initClipboard()
		},
		destroyed() {
			if (this.clipboard) {
				this.clipboard.destroy();
			}
		}
	}
</script>
