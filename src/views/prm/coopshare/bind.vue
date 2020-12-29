<template>
  <div class="order-qr-code-share">
  <el-dialog title="协作公司-绑定设置" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
    <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
      <el-form-item label="收件人" prop="toList">
        <el-select v-model="ruleForm.toList" multiple filterable placeholder="请选择收件人" style="width: 94%">
          <el-option v-for="item in toUserList" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.email"> </el-option>
        </el-select>
        <el-button type="primary" style="padding: 7px 5px;" @click="gotoAddPage('ruleForm')" size="mini">新增</el-button>
      </el-form-item>
      <el-form-item label="邮件标题" prop="subject">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="ruleForm.subject"></el-input>
      </el-form-item>

      <el-form-item label="邮件内容" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="ruleForm.content"></el-input>
      </el-form-item>

      <el-form-item label="绑定地址" prop="website">
        <el-row >
          <el-col :span="20">
            <el-input type="textarea" disabled :autosize="{ minRows: 2, maxRows: 4}" v-model="ruleForm.website" ></el-input>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <el-button type="primary" class="btn-clipboard-coop" :data-clipboard-text="clipboardText">复制地址</el-button>
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
  import addUser from "../../af/cssDebitNote/af_debit_note_list_send_add.vue"
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
      return {
        clipboardText: '',
        clipboard: null,
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
      initClipboard() {
      	this.clipboard = new ClipboardJS('.btn-clipboard-coop');
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
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      submitSendEmail(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.loading = true;
            let cc = this.ruleForm.ccList;
            if(cc && cc.length > 0){
              this.ruleForm.ccUsers = cc.join(";");
            }
            let to = this.ruleForm.toList;
            if(to && to.length > 0){
              this.ruleForm.toUsers = to.join(";");
            }

            this.$axios.post2('/prm/coopShare/coopShareEmail', this.ruleForm)
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
      loadToUserList(coopId){
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
      initNormalData(){
        this.ruleForm.subject = "协作公司绑定设置";
        this.ruleForm.content = this.frow['coopName']+"，您好：\n\n" +
          "我正在进行协作公司的绑定设置，请点击如下链接地址，本地址10分钟内有效" +
          "\n\n" ;
        let dateStr = Number(new  Date())+"";
        let userId =  localStorage.getItem("userId");
        let orgId =  localStorage.getItem("orgId");
        let param = {
           orgUuid:this.frow.orgUuid,
           coopId:this.frow.coopId,
           orgId:orgId,
           userId:userId,
           dateStr:dateStr
        }
        let url = location.origin+"/#/externalCoopShare?o="+this.base64Encode(JSON.stringify(param));
        this.ruleForm.website = url;
        this.clipboardText = url;
        this.initClipboard();
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
      // qrCodeCallBack(data){
      //   let text = this.frow['awbNumber'] || this.frow['orderCode'];
      //   this.drawBorderQR(text, 130, 150, data);
      // },
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
        this.loadToUserList(this.frow.coopId);
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
    },
    created() {
      this.initNormalData();
      this.loadToUserList(this.frow.coopId);
    },
    destroyed() {
    	if (this.clipboard) {
    		this.clipboard.destroy();
    	}
    }
  }
</script>
