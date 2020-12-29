<template>
  <div class="order-qr-code-share">
  <el-dialog title="二维码 - 分享" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
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
/*        let userEmail = window.localStorage.getItem('userEmail')
        let salesEmail = this.frow.salesName
        let servicerEmail = this.frow.servicerName
        if(userEmail != null && userEmail !== '') {
            this.ruleForm.ccList.push(userEmail)
        }
        if(salesEmail != null && salesEmail !== '' && salesEmail.split(' ')[1] !== userEmail) {
            this.ruleForm.ccList.push(salesEmail.split(' ')[1])
        }
        if(servicerEmail != null && servicerEmail !== '' && servicerEmail !== salesEmail) {
            this.ruleForm.ccList.push(servicerEmail.split(' ')[1])
        }*/
        //查询个人信息设置的订单跟踪码得默认抄送人
        let permissionName = '订单跟踪码';
        this.$axios.get('/hrs/dept/selectOrderTrackCcUser?permissionName=' + permissionName).then(function(response) {
            let orderTrackCcUser = response.data.data || [];
            orderTrackCcUser.forEach(item => {
                this.ruleForm.ccList.push(item);
            })
            this.ruleForm.ccList = this.uniq(this.ruleForm.ccList);//去掉重复的值
        }.bind(this));
      },
      uniq(array){
          let temp = [];
          for(let i = 0; i < array.length; i++) {
              //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
              if(array.indexOf(array[i]) == i){
                  temp.push(array[i])
              }
          }
          return temp;
      },
      loadCcUserList(coopId){
        let params = {
          coopId: coopId
        };
        this.$axios.get2('/prm/coop/queryContactsIsValid', params)
          .then(function(response) {
            this.toUserList = response.data.data;
            let contactsNameStr = this.frow.contactName;
            let distDIC = {};
            if(contactsNameStr){
              this.toUserList.forEach((item)=>{
                if(contactsNameStr.indexOf(item.contacts_name)>-1){
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
        this.ruleForm.subject = "订单状态跟踪：" + this.frow['awbNumber'];
        this.ruleForm.content = this.frow['coopName']+"，您好：\n\n" +
          "您的订单已经生成，请点击正文的链接，或者手机扫描二维码，自助跟踪您的订单状态。" +
          "\n\n" +
          "谢谢";

        let scope = this.$route.path.substring(1,3) || 'un';
        let url = location.origin+"/#/externalOrderTrack?o=" + scope + (this.frow['orderUuid'] ||"");
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
      }
    },
    created() {
      this.initNormalData();
      this.loadToUserList();
      this.loadCcUserList(this.frow.coopId);
    },
  }
</script>
