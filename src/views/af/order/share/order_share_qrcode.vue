<template>
  <el-dialog title="订单协作-二维码" :visible.sync="visible" width="400px" :close-on-press-escape="false"
    :close-on-click-modal="false" :before-close="handleClose" show-close>
    <div style="text-align: center" id="order-qr-code-view">
      <vue-qr :text="clipboardText" :callback="qrCodeCallBack" style="display: none"></vue-qr>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary" class="btn-clipboard" :data-clipboard-text="clipboardText">复制地址</el-button>
      <el-button type="primary" @click="shareQRCodeWithEmail">邮件分享</el-button>
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
    inject: ['orderShareQrcodeEmail'],
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
        this.orderShareQrcodeEmail(this.frow);
      },
      qrCodeCallBack(imgDataBase64) {
        this.drawBorderQR(this.frow.awbNumber || this.frow.orderCode, 206, 230, imgDataBase64);
      },
      base64Encode(input) {
        let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        let output = "";
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        input = this.utf8Encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
      },
      utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        let utftext = "";
        for (let n = 0; n < string.length; n++) {
          let c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }

        }
        return utftext;
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
      let code = this.frow.awbNumber || this.frow.orderCode;
      this.frow.shareOrderEditTime = Number(new Date())+"";
      //查询分享时间 并记录
      // this.$axios.get2('/afbase/afOrderShare/afOrderShareInfo/'+this.frow.orderId+'/'+rrow.coopId).then((response)=> {
      //   if(response.data.data!=null&&response.data.data.length>0){
      //     let dataT = response.data.data.editTime;
      //     this.frow.shareOrderEditTime = Number(new Date(dataT));
      //   }
      // }).catch((error)=> {
      // 	console.log(error);
      // });
      let shareCoopId = "";
      if(this.frow.shareCoopId){
        shareCoopId = this.frow.shareCoopId;
      }
      let shareOrgId = "";
      if(this.frow.shareOrgId){
        shareOrgId = this.frow.shareOrgId;
      }
      let coopOrgCoopId = "";
      if(this.frow.coopOrgCoopId){
        coopOrgCoopId = this.frow.coopOrgCoopId;
      }
      let param = {
        orderUuid: this.frow.orderUuid,
        shareScope: '订单协作',
        orderId: this.frow.orderId+"",
        orderOrgId: this.frow.orgId+"",
        shareCoopId: shareCoopId,
        shareOrgId:shareOrgId,
        coopOrgCoopId:coopOrgCoopId,
        shareOrderEditTime: this.frow.shareOrderEditTime
      }
      // console.log(param);
      // console.log(this.frow.shareOrgId);
      let url = location.origin + "/#/orderShareQrcodeTrack?o=" + this.base64Encode(JSON.stringify(param));
      this.clipboardText = url;
      this.initClipboard();
    },
    destroyed() {
      if (this.clipboard) {
        this.clipboard.destroy();
      }
    }
  }
</script>
