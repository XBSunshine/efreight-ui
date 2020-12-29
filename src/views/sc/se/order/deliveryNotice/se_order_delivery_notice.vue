<template>
  <el-dialog title="送货通知二维码" :visible.sync="visible" width="400px" :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
    <div style="text-align: center" id="order-delivery-notice">
      <vue-qr :text="clipboardText" :callback="qrCodeCallBack" style="display: none" ></vue-qr>
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
    data(){
      return{
        clipboardText:'',
        clipboard: null,
      }
    },
    inject: ['deliveryNoticeShare'],
    methods: {
      handleClose(){
        this.$emit('update:visible', false);
      },
      initClipboard(){
        this.clipboard = new ClipboardJS('.btn-clipboard');
        let _this = this;
        this.clipboard.on('success', function () {
          _this.$message({
            message: '复制成功',
            type: 'success'
          });
        });
        this.clipboard.on('error', function () {
          _this.$message({
            message: '复制失败',
            type: 'error'
          });
        });
      },
      shareQRCodeWithEmail(){
        this.$emit('update:visible', false);
        this.deliveryNoticeShare(this.frow);
      },
      qrCodeCallBack(imgDataBase64){
        this.drawBorderQR(this.frow['awbNumber'] || this.frow['orderCode'], 206, 230, imgDataBase64);
      },
      drawBorderQR(text, width, height, imgDataBase64){
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
        ctx.lineWidth=5;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        //添加图片
        let img = new Image();
        img.src = imgDataBase64;
        img.onload = ()=>{
          ctx.drawImage(img, 3, 3);
          //添加文字
          let fontSize = text.length > 12 ? '22px' : '24px';
          ctx.font = fontSize+' Microsoft YaHei';
          ctx.textAlign = "center";
          ctx.fillStyle = "#000000";
          ctx.fillText(text, canvas.width/2, canvas.height-20);

          let htmlImg = document.createElement("img");
          htmlImg.src = canvas.toDataURL();
          document.getElementById("order-delivery-notice").append(htmlImg);
        }
      }
    },
    created() {
      let scope = this.$route.path.substring(1,3) || 'un';
      let url = location.origin+"/#/seExternalOrderDeliveryNotice?o=" + scope+(this.frow['orderUuid'] ||"");
      this.frow['shareUrl'] = url;
      this.clipboardText = url;
      this.initClipboard();
    },
    destroyed() {
      if(this.clipboard){
        this.clipboard.destroy();
      }
    }
  }
</script>
