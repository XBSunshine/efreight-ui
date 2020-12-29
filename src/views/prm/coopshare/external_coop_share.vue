<template>
 <el-container>
   <el-main >
     <div v-if="dateFlag">
       <el-row>
           <el-col  align="center">
             <p><span style="font-size:22px;margin-top:50%">当前链接已失效</span></p>
           </el-col>
       </el-row>
     </div>
     <div class="warp-main" v-if="!dateFlag">
       <el-row >
           <el-col align="left">
             <p><span style="font-size:22px;margin-left:20%">{{query.coopName}},您好</span></p>
             <p>&emsp;</p>
           </el-col>
       </el-row>
       <el-row>
           <el-col  align="left">
             <!-- {{query.coopName}} -->
             <p><span style="font-size:22px;margin-left:22%">{{orgName}} 正在进行协作公司的绑定设置，请点击 “确认”开始业务协作</span></p>
             <p>&emsp;</p>
             <p><span style="font-size:22px;margin-left:22%">（本地址 {{dataEnd}}前有效）</span></p>
             <p>&emsp;</p>
           </el-col>
       </el-row>
       <el-row style="margin-left:22%">
           <el-col align="left">
           		<el-input class="widthWithFourWithXing" readOnly v-model="query.customerName" style="width:615px;margin-right: 15px;">
           			<template slot="prepend">
           				<font style="color: red;">*</font>
           				<span>客商资料</span>
           			</template>
           			<el-button slot="append" @click="selectCustomer" icon="el-icon-search">查询</el-button>
           		</el-input>
           </el-col>
       </el-row>
       <el-row>
           <el-col  align="left">
             <p>&emsp;</p>
           </el-col>
       </el-row>
       <el-row>
         <el-col align="left" >
           <el-button style="margin-left:22%" type="primary" :disabled="disabledFalg" v-if="submitFlag" @click="submitShare" >确定</el-button>
         </el-col>
       </el-row>
       <customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="frow"></customerSelect>
     </div>
   </el-main>
 </el-container>
</template>
<script>
  import CustomerSelect from '@/views/af/order/share/customer_select_share'
  export default {
    data() {
      return {
        query: {
          customerName:'',
          coopId:'',
          coopName:'',
          orgUuid:'',
          orgCoopid:'',
          userId:'',
          userName:''
        },
        datastr:'',
        orgName:'',
        dataEnd:'',
        orgId:'',
        customerSelectVisible: false,
        frow:{},
        bingFlag:true,
        submitFlag:true,
        dateFlag:false,
        disabledFalg:false
      }
    },
    created: function(){
     let a = this.$route.query.o;
     let b = JSON.parse(this.base64Decode(a));
      this.query.orgUuid = b.orgId;
      this.query.orgCoopid = b.coopId;
      this.orgId = b.orgId;
      this.query.userId = b.userId;
      this.datastr = b.dateStr;
     //查询请求的ORG信息
     this.$axios.get('/prm/coopShare/coopShareInfo/'+this.orgId+'/'+ this.query.orgCoopid).then((response) => {
         if(response.data.data) {
             this.orgName = response.data.data.orgName;
             this.query.coopName = response.data.data.coopName;
         }
     }).catch((error) => {
         console.log(error);
     });
     let coopOrgIdNow = window.localStorage.getItem('orgId');
     //校验 申请的绑定公司是否已经与当前的签约公司绑定
     this.$axios.get('/prm/coopShare/'+this.orgId+'/'+ coopOrgIdNow).then((response) => {
         if(response.data.data) {
             this.bingFlag = true;
         }else{
             this.bingFlag = false;
         }
     }).catch((error) => {
         console.log(error);
     });
     // this.orgName = window.localStorage.getItem('orgName');
     //用户信息
     this.$axios.get('/hrs/user/' + this.query.userId)
     	.then(function(response) {
     		if(response.data.code == 0) {
     			this.query.userName = response.data.data.userName;
     		}
     	}.bind(this));
     //时间
     let date = new Date(parseInt(this.datastr)+10*60*1000);
     this.dataEnd = this.formatDate(date,'yyyy-MM-dd hh:mm')
     let dateEndLong =parseInt(this.datastr)+10*60*1000;
     if(Number(new Date())>=dateEndLong){
         //如果超出时间  则提示
         this.dateFlag = true;
     }
    },
    components: {
     'customerSelect': CustomerSelect
    },
    provide() {
    	return {
    		setValue: this.setValue
    	}
    },
    methods: {
      setValue(row){
        if(row.coopOrgId){
           this.openError("当前客商资料已被绑定");
           return false;
        }
        this.query.coopId = row.coopId;
        this.query.customerName = row.coopName;
        this.query.coopOrgCoopId = row.coopOrgCoopId
      },
      selectCustomer() {
      	this.frow.businessScope = 'AE'
        // this.frow.orderOrgId = window.localStorage.getItem('orgId');
        this.frow.coopOrgId = '';
      	this.customerSelectVisible = true
      },
      openError(info) {
      	this.$notify({
      		title: '',
      		message: '操作失败，' + info,
      		type: 'error',
      		position: 'bottom-right'
      	});
      },
      openSuccess() {
      	this.$notify({
      		title: '',
      		message: '操作成功',
      		type: 'success',
      		position: 'bottom-right'
      	});
      },
      submitShare(){
      let dateNum = parseInt(this.datastr)+10*60*1000;
      let date2 = Number(new Date());
      if(date2>=dateNum){
          this.openError("本次请求地址 于"+this.dataEnd+"前有效，已超时失效");
          return false;
      }
      if(!this.bingFlag){
         this.openError("申请协作的签约公司和当前的签约公司已经绑定");
         return false;
      }
       if(!this.query.coopId ){
           this.openError("请选择客商资料");
           return false;
       }
       let orgIdOper = window.localStorage.getItem('orgId');
       if(this.orgId == orgIdOper){
          this.openError("分享和协作公司不能为同一签约公司");
          return false;
       }
        let coopOrgIdNow = window.localStorage.getItem('orgId');
       //去绑定
       this.$axios.get('/prm/coopShare/'+this.orgId+'/'+ coopOrgIdNow).then((response) => {
           if(response.data.data) {
               this.$axios.get('/prm/coopShare/coopShareInfo/'+this.orgId+'/'+ this.query.orgCoopid).then((response) => {
                   if(response.data.data.coopOrgCoopId) {
                        this.openError("申请协作的签约公司下的协作公司已经与其他签约公司绑定");
                   }else{
                     this.$axios.post2('/prm/coopShare/coopShareBind', this.query)
                       .then(function(response){
                         if(0 == response.data.code){
                            // this.submitFlag = false;
                            this.openSuccess();
                            this.disabledFalg = true;
                            // this.winClose();
                         }else{
                           this.openError(response.data.messageInfo || "绑定失败");
                         }
                       }.bind(this))
                       .catch(function(){
                         this.openError("绑定失败，请稍后再试");
                       }.bind(this))
                   }
               }).catch((error) => {
                   console.log(error);
               });
           }else{
               this.openError("申请协作的签约公司和当前的签约公司已经绑定,无法重复绑定");
           }
       }).catch((error) => {
           console.log(error);
       });


     },
     winClose(){
       let userAgent = navigator.userAgent;
       if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
         // window.opener = null;
         // console.log(window);
        //  window.close = true;
       	// window.stop().close();
        // window.open("about:blank", "_self");

        // window.opener = window.frames;
        // window.origin = 'http://localhost:8003';
        window.close();
       } else {
       	window.opener = null;
       	window.open("about:blank", "_self");
       	window.close();
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
      },
      base64Decode(input) {
      	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      	let output = "";
      	let chr1, chr2, chr3;
      	let enc1, enc2, enc3, enc4;
      	let i = 0;
      	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      	while (i < input.length) {
      		enc1 = _keyStr.indexOf(input.charAt(i++));
      		enc2 = _keyStr.indexOf(input.charAt(i++));
      		enc3 = _keyStr.indexOf(input.charAt(i++));
      		enc4 = _keyStr.indexOf(input.charAt(i++));
      		chr1 = (enc1 << 2) | (enc2 >> 4);
      		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      		chr3 = ((enc3 & 3) << 6) | enc4;
      		output = output + String.fromCharCode(chr1);
      		if (enc3 != 64) {
      			output = output + String.fromCharCode(chr2);
      		}
      		if (enc4 != 64) {
      			output = output + String.fromCharCode(chr3);
      		}
      	}
      	output = this.utf8Decode(output);
      	return output;
      },
      utf8Decode(utftext) {
      	let string = "";
      	let i = 0
      	let c = 0
      	let c1 = 0
      	let c2 = 0
      	while (i < utftext.length) {
      		c = utftext.charCodeAt(i);
      		if (c < 128) {
      			string += String.fromCharCode(c);
      			i++;
      		} else if ((c > 191) && (c < 224)) {
      			c1 = utftext.charCodeAt(i + 1);
      			string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      			i += 2;
      		} else {
      			c1 = utftext.charCodeAt(i + 1);
      			c2 = utftext.charCodeAt(i + 2);
      			string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      			i += 3;
      		}
      	}
      	return string;
      }

    }
  }
</script>
<style type="text/css">

  .hrsRole .el-input__icon {
    line-height: 30px !important;
  }

  .hrsRole .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsRole .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
