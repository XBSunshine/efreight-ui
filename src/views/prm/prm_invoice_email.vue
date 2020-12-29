<template>
  <div>
  <el-dialog title="发送邮件" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
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
        <el-input v-model="ruleForm.subject" maxlength="100" show-word-limit style="width: 100%;"></el-input>
      </el-form-item>

      <el-form-item label="邮件内容" prop="content">
          <el-input type="textarea" :rows="8" v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="submitSendEmail('ruleForm')" :loading="loading">确认发送</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <addUser ref="addMission" v-if="addUser" :visible.sync="addUser" :frow="ffrow"></addUser>
  </div>
</template>
<script>
  import addUser from "./prm_invoice_sendemail";

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
        actionPath: 'http://up-z1.qiniu.com',
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

            //this.uploadQRCode();

            this.loading = true;
            let cc = this.ruleForm.ccList;
            if(cc && cc.length > 0){
              this.ruleForm.ccUsers = cc.join(";");
            }
            let to = this.ruleForm.toList;
            if(to && to.length > 0){
              this.ruleForm.toUsers = to.join(";");
            }

            this.$axios.post2('/prm/coopBill/sendInvoiceEmail', this.ruleForm)
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
            let userEmail = window.localStorage.getItem('userEmail')
            if(userEmail != null && userEmail !== '') {
                this.ruleForm.ccList.push(userEmail)
            }
        }.bind(this));
      },
      loadCcUserList(coopId){
        this.ruleForm.toList=[];
        let params = {
          coopId: coopId
        };
        this.$axios.get2('/prm/coop/queryContactsIsValid', params)
          .then(function(response) {
            this.toUserList = response.data.data;
            let contactsNameStr = this.frow.invoiceReceiveEmail;
            let distDIC = {};
            if(contactsNameStr){
              this.toUserList.forEach((item)=>{
                  //let email = item.contacts_name+ '<'+item.email+'>';
                let email = item.email
                if(contactsNameStr.indexOf(email)>-1){
                  distDIC[item.email] = "";
                }
              })
            }
            for(let key in distDIC){
              this.ruleForm.toList.push(key);
            }
            }.bind(this)
          );
      },
      initNormalData(){
        this.ruleForm.subject = "【翌飞锐特账单】 "+this.frow.invoiceTitle+" 发票寄出提醒";
        this.ruleForm.content = "您的本期发票已经寄出，请查收中通快递，单号： "+this.frow.expressNumber+"，发票号 "+this.frow.invoiceNo+"\n\n" +
          "如有发票或寄送问题，可联系财务：010-80467220-611" +
          "\n\n" +
          "请收到发票后及时付款，感谢配合"+
            "\n\n" +"\n\n"+
          "银行账户名称：翌飞锐特电子商务（北京）有限公司"+"\n\n"+"开户银行账号：340 260 312 520"+"\n\n"+"开户银行名称：中国银行股份有限公司北京空港支行"+"\n\n" +"\n\n"+"Web: www.efreight.cn";


        /*let url = location.origin+"/#/externalOrderTrack?o=" + (this.frow['orderUuid'] ||"");
        this.ruleForm.website = url;
        this.ruleForm.orgName = localStorage.getItem("orgName") || "";*/
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
      loadToken(){
        this.$axios.get('/hrs/org/getUpToken')
          .then(function(response) {
            this.upload.token = response.data.data;
            if(this.upload.token == null || this.upload.token == '') {
              this.$message.error('因缺失token，无法上传文件，故无法新增附件')
            }
          }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
      },
      qrCodeCallBack(data){
        this.upload.file = data;
      },
      uploadQRCode(){

        let formData = new FormData();
        formData.append("token", this.upload.token);
        formData.append("key", this.upload.key);
        formData.append("file", this.buildFile(this.upload.file));
        console.log(formData);

        this.$axios.post2(this.actionPath, formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(function(response){
          if(response.status == 200){
            console.log("upload order track QRCode success!");
          }
        }.bind(this))
        .catch(function(error){
          console.error(error);
        }.bind(this));

      },
      buildUploadKey(){
        this.upload.key = "Order_track_qrCode" + "_" + this.frow['orderUuid'].replace(/-/g, "") + ".png";
        this.ruleForm.imageURL = "http://doc.yctop.com/" + this.upload.key;
      },
      /**
       * Convert a base64 string in a Blob according to the data and contentType.
       *
       * @param b64Data {String} Pure base64 string without contentType
       * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
       * @param sliceSize {Int} SliceSize to process the byteCharacters
       * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
       * @return Blob
       */
      b64toBlob(b64Data, contentType, sliceSize){
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
      },
      buildFile(imageURL){
        let block = imageURL.split(";");
        let contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        let realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
        // Convert it to a blob to upload
        let blob = this.b64toBlob(realData, contentType);
        return blob;
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
      }
    },
    created() {

      this.initNormalData();
      this.loadToUserList();
      this.loadCcUserList(this.frow.coopId);
      //this.buildUploadKey();
      //this.loadToken();
    },
  }
</script>
