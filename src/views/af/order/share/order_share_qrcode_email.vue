<template>
  <div class="order-qr-code-share">
  <el-dialog title="订单协作二维码 - 分享" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
    <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
      <el-form-item label="收件人" prop="toList">
        <el-select v-model="ruleForm.toList" multiple filterable placeholder="请选择收件人" style="width: 94%">
          <el-option v-for="item in toUserList" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.email"> </el-option>
        </el-select>
        <el-button type="primary" style="padding: 7px 5px;" @click="gotoAddPage('ruleForm')" size="mini">新增</el-button>
      </el-form-item>

      <el-form-item label="抄送" prop="ccList">
        <el-select v-model="ruleForm.ccList" multiple filterable placeholder="请选择抄送人" style="width: 100%">
          <el-option v-for="item in ccUserList" :key="item.value" :label="`${item.label}<${item.label4}>`" :value="item.label4"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="邮件标题" prop="subject">
          <el-input type="textarea" v-model="ruleForm.subject"></el-input>
      </el-form-item>

      <el-form-item label="邮件内容" prop="content">
          <el-input type="textarea" :rows="8" v-model="ruleForm.content"></el-input>
      </el-form-item>

      <el-form-item label="网址/二维码" prop="website">
        <el-row >
          <el-col :span="19">
            <el-input type="textarea" disabled :rows="6" v-model="ruleForm.website" ></el-input>
          </el-col>
          <el-col :span="5" style="text-align: center" id="order-qr-code-share">
            <vue-qr :text="ruleForm.website" :size="110" style="display: none" :margin="5" :callback="qrCodeCallBack"></vue-qr>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="submitSendEmail('ruleForm')" :loading="loading">确认发送</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <addUser ref="addMission" v-if="addUser" :visible.sync="addUser" :frow="ffrow"></addUser>
  </div>
</template>
<style type="text/css">
  .order-qr-code-share .el-textarea__inner{
    height: 151px;
  }
</style>
<script>
  import addUser from "../../cssDebitNote/af_debit_note_list_send_add";

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      frow: Object
    },
    data(){
      return {
        ffrow:{},
        addUser:false,
        loading: false,
        ruleForm: {
          toUsers:"",
          ccUsers:"",
          subject: "",
          content: "",
          website:"",
          imageURL: "",
          orgName: '',
          ccList:[],
          toList:[],
        },
        rules: {
          toList: [
            {
              required: true,
              message: '请选择收件人',
              trigger: ['blur' ]
            },
          ],
          subject: [
            {
              required: true,
              message: '请输入邮件标题',
              trigger: ['blur']
            },
          ]
        },
        toUserList :[],
        ccUserList:[],
        upload:{
          token: "",
          key: "",
          file: "",
        },
      }
    },
    components: {
      'addUser': addUser
    },
    provide() {
      return {
        queryContactsList: this.queryContactsList,
      }
    },
    methods: {
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      submitSendEmail(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.ruleForm.imageURL = document.getElementById("order-qr-code-image").src;
            this.loading = true;
            let cc = this.ruleForm.ccList;
            if(cc && cc.length > 0){
              this.ruleForm.ccUsers = cc.join(";");
            }
            let to = this.ruleForm.toList;
            if(to && to.length > 0){
              this.ruleForm.toUsers = to.join(";");
            }
            let date = new Date(parseInt(this.frow.shareOrderEditTime)+24*60*60*1000);
            this.ruleForm.orderShareEndTime = this.formatDate(date,'yyyy-MM-dd')+" 23:59:59";
            this.$axios.post2('/afbase/aforder/orderTrackShare', this.ruleForm)
              .then(function(response){

                this.loading = false;
                if(0 == response.data.code){
                  this.openSuccess();
                  this.handleClose();
                }else{
                  this.openError(response.data.messageInfo || "邮件发送失败");
                }
              }.bind(this))
              .catch(function(){
                this.loading = false;
                this.openError("发送失败，请稍后再试");
              }.bind(this))
          }
        });
      },
      loadToUserList(){
        this.$axios.get('/hrs/dept/selectUser').then(function(response) {
          this.ccUserList= response.data.data;
        }.bind(this));
        let userEmail = window.localStorage.getItem('userEmail')
        // let salesEmail = this.frow.salesName
        // let servicerEmail = this.frow.servicerName
        if(userEmail != null && userEmail !== '') {
            this.ruleForm.ccList.push(userEmail)
        }
        // if(salesEmail != null && salesEmail !== '' && salesEmail.split(' ')[1] !== userEmail) {
        //     this.ruleForm.ccList.push(salesEmail.split(' ')[1])
        // }
        // if(servicerEmail != null && servicerEmail !== '' && servicerEmail !== salesEmail) {
        //     this.ruleForm.ccList.push(servicerEmail.split(' ')[1])
        // }

      },
      loadCcUserList(coopId){
        let params = {
          coopId: coopId
        };
        this.$axios.get2('/prm/coop/queryContactsIsValid', params)
          .then(function(response) {
            this.toUserList = response.data.data;
            // let contactsNameStr = this.frow.contactName;
            // let distDIC = {};
            // if(contactsNameStr){
            //   this.toUserList.forEach((item)=>{
            //     if(contactsNameStr.indexOf(item.contacts_name)>-1){
            //       distDIC[item.email] = "";
            //     }
            //   })
            // }
            // for(let key in distDIC){
            //   this.ruleForm.toList.push(key);
            // }
            }.bind(this)
          );
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
      initNormalData(){
        let numberNum = '';
        if(this.frow.awbNumber){
          numberNum = this.frow.awbNumber;
        }else{
          numberNum = this.frow.customerNumber;
        }
        this.ruleForm.subject = "协作订单信息：" +numberNum;
        this.ruleForm.content = this.frow['coopName']+"，您好：\n\n" +
          "新的协作订单已经创建完毕，请访问下面的链接地址接收订单信息" +
          "\n\n" +
          "谢谢";

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
        let url = location.origin + "/#/orderShareQrcodeTrack?o="+this.base64Encode(JSON.stringify(param))
        this.ruleForm.website = url;
        this.ruleForm.orgName = localStorage.getItem("orgName") || "";
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
      qrCodeCallBack(data){
        let text = this.frow['awbNumber'] || this.frow['orderCode'];
        this.drawBorderQR(text, 130, 150, data);
      },
      getLoginUserEmail(){
        let userName =  localStorage.getItem("username") || "";
        let email = userName.substring(userName.indexOf('_')+1) || "";
        return email;
      },
      gotoAddPage(){
        this.ffrow['coop_id'] = this.frow.coopId;
        this.ffrow['contacts_type'] = '操作';
        this.addUser = true
      },
      queryContactsList(){
        this.loadCcUserList(this.frow.coopId);
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
          ctx.drawImage(img, 10, 10);
          //添加文字
          let fontSize = text.length > 12 ? '14px' : '16px';
          ctx.font = fontSize+' Microsoft YaHei';
          ctx.textAlign = "center";
          ctx.fillStyle = "#000000";
          ctx.fillText(text, canvas.width/2, 140);

          let htmlImg = document.createElement("img");
          htmlImg.id = "order-qr-code-image";
          htmlImg.src  = canvas.toDataURL();
          document.getElementById("order-qr-code-share").append(htmlImg);
        }
      },
      formatDate (date, fmt) {
          if (/(y+)/.test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          }
          let o = {
              'M+': date.getMonth() + 1,
              'd+': date.getDate(),
              'h+': date.getHours(),
              'm+': date.getMinutes(),
              's+': date.getSeconds()
          };

          for (let k in o) {
              if (new RegExp(`(${k})`).test(fmt)) {
                  let str = o[k] + '';
                  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
              }
          }
          return fmt;
      },
      padLeftZero(str){
        return ('00' + str).substr(str.length);
      }
    },
    created() {
      this.initNormalData();
      this.loadToUserList();
      this.loadCcUserList(this.frow.coopId);
    },
  }
</script>
