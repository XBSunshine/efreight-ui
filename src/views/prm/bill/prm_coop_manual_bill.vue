<template>
	<el-dialog title="人工账单" width="700px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form label-position="center" ref="ruleForm" :model="ruleForm" :rules="rules">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="客户Id" prop="coopId" v-show="false" required>
						<el-input v-model="ruleForm.coopId"></el-input>
					</el-form-item>
					<el-form-item label="客户名称" prop="coopName" required label-width="105px">
						<el-input style="width: 240px;" v-model="ruleForm.coopName" :disabled=true></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
					   <el-button type="primary" size="small" @click="chooseAgreement">选择</el-button>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="账单名称" prop="statementName" label-width="105px">
            <el-input style="width: 143px;" v-model="ruleForm.statementName" clearable disabled>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="服务编码" prop="serviceId" v-show="false">
            <el-input v-model="ruleForm.serviceId"></el-input>
          </el-form-item>
          <el-form-item label="收费项目" prop="serviceName" label-width="105px" required>
            <el-input style="width: 240px;" v-model="ruleForm.serviceName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" size="small" @click="showservice">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="业务区域" prop="billTemplate" required label-width="105px">
            <el-select style="width: 143px;" v-model="ruleForm.billTemplate">
              <el-option label="华北" value="BJS"></el-option>
              <el-option label="华南" value="CAN"></el-option>
              <el-option label="华东" value="SHA"></el-option>
              <el-option label="西北" value="XIY"></el-option>
              <el-option label="总部" value="EFT"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item prop="baseQuantity" label="数量" label-width="105px" required>
            <el-input style="width: 145px;" v-model="ruleForm.baseQuantity" @input="formatToNumber('baseQuantity')" @change="setActuralChargeValue"></el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="unitPrice" label="单价" label-width="60px" required>
            <el-input style="width: 145px;" v-model="ruleForm.unitPrice" @input="formatToFloat('unitPrice')" @change="setActuralChargeValue"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="totalCharge" label="金额" label-width="60px">
            <el-input style="width: 154px;" v-model="ruleForm.totalCharge" disabled></el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="联系人" prop="billManualMailTo" label-width="105px">
            <el-select style="width: 282px;" v-model="ruleForm.billManualMailTo" filterable placeholder="请选择" multiple>
              <el-option v-for="item in contactoptions" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.contacts_id" :disabled="item.contacts_status!='1'">
                <span style="float: left">{{ item.contacts_name }}</span>
                <span style="float: left"><</span>
                <span style="float: left">{{ item.email }}</span>
                <span style="float: left">></span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" size="small" @click="addContactAgreement">新增</el-button>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="statementDate" label="账单月份" label-width="85px" required>
            <el-date-picker v-model="ruleForm.statementDate" type="month" value-format="yyyy-MM" placeholder="选择月份" style="width: 120px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="备注" prop="remark" label-width="105px">
            <el-input style="width: 565px;" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="105px">
            <el-upload      class="el-form-item__content3"
                            :action="actionPath"
                            :accept="accept3"
                            :data="uptoken"
                            :limit=1
                            :before-upload="beforeAvatarUpload3"
                            :on-remove="handleRemoveChange3"
                            :on-success="handleSuccessChange3"
                            :on-preview="downloadFile"
                            ref="upload3"
                            :auto-upload="true"
                            :file-list="formData3.smallModelPhoto">
              <el-button size="small" type="primary">上传附件</el-button>&nbsp;
              <font size="1px">只能上传.pdf.xls.xlsx.jpg.tar.zip.doc.docx文件，且不超过2M</font>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="开票客户名称" prop="invoiceTitle" label-width="105px">
            <el-input style="width: 565px;" v-model="ruleForm.invoiceTitle"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="发票票种" prop="invoiceType" label-width="105px" required>
            <el-select style="width: 143px;" v-model="ruleForm.invoiceType">
              <el-option label="电子票" value="电子票"></el-option>
              <el-option label="专票" value="专票"></el-option>
              <el-option label="普票" value="普票"></el-option>
              <el-option label="不开票" value="不开票"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="电子发票接收邮箱" prop="invoiceMailTo" label-width="133px">
            <el-select style="width: 210px;" v-model="ruleForm.invoiceMailTo" filterable placeholder="请选择" clearable>
              <el-option v-for="item in contactoptions" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.contacts_id" :disabled="item.contacts_status!='1'">
                <span style="float: left">{{ item.contacts_name }}</span>
                <span style="float: left"><</span>
                <span style="float: left">{{ item.email }}</span>
                <span style="float: left">></span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" size="small" @click="addContactAgreement">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="开票备注" prop="invoiceRemark" label-width="105px">
            <el-input style="width: 565px;" v-model="ruleForm.invoiceRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
					   <el-button :loading="loading" size="small" type="primary" @click="saveManualBill('ruleForm')" style="margin-right: 120px;" :disabled="disabledFlag2">保存</el-button>
          </el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<agreement ref="addMission" v-if="agreementVisible" :visible.sync="agreementVisible"></agreement>
    <contactVisible ref="addMission" v-if="contactVisible" :visible.sync="contactVisible" :inputName="ruleForm.coopId"></contactVisible>
    <serviceVisibleTag ref="addMission" v-if="serviceVisible" :visible.sync="serviceVisible"></serviceVisibleTag>
	</el-dialog>
</template>
<script>
	import Agreement from '.././settlement/prm_coop_agreement_settlement_agreement'
  import contactVisible from '.././settlement/prm_coop_addContact'
  import serviceVisibleVue from '.././settlement/prm_coop_agreement_settlement_service_select'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
        useroptions: [],
				ruleForm: {
					coopId: '',
					coopName: '',
          serviceId: '',
          serviceName: '',
          billTemplate: '',
          statementName: '人工账单',
          billManualMailTo: '',
          remark: '',
          baseQuantity: '',
          unitPrice: '',
          totalCharge: '',
          statementDate: '',
          chBillTemplate: '',
          fillUrl: '',
          fillName: '',
          invoiceTitle: '',
          invoiceType: '电子票',
          invoiceMailTo: '',
          invoiceRemark: '',
				},
        billManualMailTo: "",
        statementId: '',
        toUsers:"",
        disabledFlag:false,
        disabledFlag2: false,
				rules: {
          coopName: [{
              required: true,
              message: '请选择客户',
              trigger: ['blur', 'change']
          }],
          billTemplate: [{
              required: true,
              message: '请选择业务区域',
              trigger: ['blur', 'change']
          }],
          serviceName: [{
              required: true,
              message: '请选择收费项目',
              trigger: ['blur', 'change']
          }],
          baseQuantity: [{
              required: true,
              message: '请输入数量',
              trigger: ['blur', 'change']
          }],
          unitPrice: [{
              required: true,
              message: '请输入单价',
              trigger: ['blur', 'change']
          }],
          statementDate: [{
              required: true,
              message: '请选择账单月份',
              trigger: ['blur', 'change']
          }],
          invoiceType: [{
              required: true,
              message: '请选择发票票种',
              trigger: ['blur', 'change']
          }],
				},
				isShow: false,
				contactoptions: [],
				agreementVisible: false,
        contactVisible:false,
				loading: false,
        serviceVisible: '',
        actionPath:'http://up-z1.qiniu.com',
        accept3: ".pdf,.xls,.xlsx,.jpg,.tar,.zip,.doc,.docx",
        uptoken: {
            token: '',
            key: ""
        },
        formData3: {
            smallModelPhoto: [],
            smallModelPhotoNames: [],
        }
			}
		},
		provide() {
			return {
				callback: this.callback,
        callback1: this.callback1,
        setServiceValue: this.setServiceValue
			}
		},
		components: {
			'agreement': Agreement,
      'contactVisible': contactVisible,
      'serviceVisibleTag': serviceVisibleVue
		},
		inject: ['findUnmakeCoopBillList'],
		created() {
      this.$axios.get('/hrs/dept/selectUser')
          .then(function(response) {
              this.useroptions = response.data.data;
          }.bind(this));
		},
    mounted: function () {
        this.$axios.get('/hrs/org/getUpToken')
            .then(function(response) {
                    this.uptoken.token=response.data.data;
                }.bind(this)
            );
    },
		methods: {
      showservice(){
          this.serviceVisible = true;
      },
      setServiceValue(rrow){
          this.ruleForm.serviceName=rrow.serviceName;
          this.ruleForm.serviceId=rrow.serviceId;
      },
      formatToFloat(item) {
          if(item == 'unitPrice') {
              this.ruleForm.unitPrice = this.ruleForm.unitPrice.replace(/[^0123456789.]/g, "");
              let t = this.ruleForm.unitPrice.split('.');
              if(t.length > 1) {
                  this.ruleForm.unitPrice = t[0] + "." + t[1].substr(0, 2);
              }
          }
      },
      formatToNumber(item) {
          if(item == 'baseQuantity') {
              this.ruleForm.baseQuantity = this.ruleForm.baseQuantity.replace(/[^0123456789]/g, "");
          }
      },
      setActuralChargeValue(){
          if(this.ruleForm.baseQuantity != null && this.ruleForm.baseQuantity != '' && this.ruleForm.unitPrice != null && this.ruleForm.unitPrice != ''){
              this.ruleForm.totalCharge = this.multiply(this.ruleForm.baseQuantity,this.ruleForm.unitPrice);
          }
      },
      multiply(num1,num2){//解决js乘法运算的小数问题
          let m = 0,s1=num1.toString(),
              s2 = num2.toString();
          try{
              m += s1.split(".")[1].length
          }catch(e){}
          try{
              m += s2.split(".")[1].length
          }catch(e){}
          return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
      },
      saveManualBill(formName) {
        let billManualMailTo = this.ruleForm.billManualMailTo;
        if(billManualMailTo && billManualMailTo.length > 0){
            this.billManualMailTo = billManualMailTo.join(",");
        }
        if(this.ruleForm.baseQuantity){
            if(this.ruleForm.baseQuantity == 0){
                this.openError('数量不能为0');
                return;
            }
        }

				this.$refs[formName].validate((valid) => {
					if(valid) {
            this.disabledFlag2 = true;
						this.loading = true
						this.$axios.post('/prm/coopBill/saveManualBill', {
							coopId: this.ruleForm.coopId,
              coopName: this.ruleForm.coopName,
              serviceId: this.ruleForm.serviceId,
              serviceName: this.ruleForm.serviceName,
              billTemplate: this.ruleForm.billTemplate,
              statementName: this.ruleForm.statementName,
              billManualMailTo: this.billManualMailTo,
              remark: this.ruleForm.remark,
              baseQuantity: this.ruleForm.baseQuantity,
              unitPrice: this.ruleForm.unitPrice,
              totalCharge: this.ruleForm.totalCharge,
              statementDate: this.ruleForm.statementDate,
              fillUrl: this.ruleForm.fillUrl,
              fillName: this.ruleForm.fillName,
              invoiceTitle: this.ruleForm.invoiceTitle,
              invoiceType: this.ruleForm.invoiceType,
              invoiceRemark: this.ruleForm.invoiceRemark,
              invoiceMailTo: this.ruleForm.invoiceMailTo,
						}, {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then((response) => {
							console.log(response)
							if(response.status == '200') {
								this.$notify({
									title: '成功',
									message: '创建成功',
									type: 'success'
								});
                this.handleClose()
								this.statementId = response.data.data;
                let cc = this.ruleForm.billManualMailTo;
                if(cc && cc.length > 0){
                    this.toUsers = cc.join(";");
                }
                  let currthis = this
                  currthis.$confirm('是否发送账单?', '提示', {
                      confirmButtonText: '是',
                      cancelButtonText: '否',
                      type: 'warning',
                      center: true
                  }).then(() => {
                      if(this.toUsers == '' || this.toUsers == null){
                          currthis.$notify.error({
                              title: '错误',
                              message: "发送账单失败，该人工账单未选择联系人"
                          });
                          return;
                      }
                      currthis.$axios.post('/prm/coopBill/sendManualBill/', {
                          statementId: this.statementId,
                          toUsers: this.toUsers,
                      }, {
                          headers: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                          }
                      }).then((response) => {
                          if(response.data.code == '0') {
                              currthis.$notify({
                                  title: '成功',
                                  message: '发送成功',
                                  type: 'success'
                              });
                              this.loading = false
                              this.findUnmakeCoopBillList()
                          } else {
                              currthis.$notify.error({
                                  title: '错误',
                                  message: response.data.messageInfo
                              });
                          }
                      }).catch((error) => {
                          currthis.$notify.error({
                              title: '错误',
                              message: error.response.data.messageInfo
                          });
                      });
                  }).catch(() => {
                      currthis.$message({
                          type: 'info',
                          message: '已取消发送'
                      });
                      this.loading = false
                      this.findUnmakeCoopBillList()
                  });
							} else {
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							this.$notify.error({
								title: '错误',
								message: error.response.data.messageInfo
							});
              this.disabledFlag2 = true;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.changeSettlementType();
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			//查询联系人
			queryContactsList(coopId) {
				let params = {
					coopId: coopId
				}
				this.$axios.get2('/prm/coop/queryContactsIsValid',
						params)
					.then(function(response) {
						this.contactoptions = response.data.data;
					}.bind(this));
			},
			callback(coopId, coopName,transactor_id,user_name) {
				this.ruleForm.coopId = coopId
				this.ruleForm.coopName = coopName
        this.ruleForm.invoiceTitle = coopName
				this.ruleForm.billManualMailTo = ''
        this.ruleForm.invoiceMailTo = ''
				this.queryContactsList(coopId)
			},
      callback1(coopId,contacts_id) {
          this.queryContactsList(coopId)
          var filelists = [];
          if(this.ruleForm.billConfirmContacts){
              filelists=this.ruleForm.billConfirmContacts;
          }
          filelists.push(contacts_id);
          this.ruleForm.billConfirmContacts=filelists;
      },
			cancelVisible() {
				this.agreementVisible = false;
        this.contactVisible = false;
			},
			chooseAgreement() {
				this.agreementVisible = true;
			},
      addContactAgreement() {

			    if(this.ruleForm.coopId == ''){
              this.openError('请先选择客户');
              return;
          }
        this.contactVisible = true;
      },
      openError(info) {
          this.$notify({
              title: '',
              message: info,
              type: 'warning',
              position: 'bottom-right'
          });
      },
      //上传附件
      beforeAvatarUpload3(file) {
          this.uptoken.key = window.localStorage.getItem("orgCode")+"_fillUrl_"+Date.now().toString(36)+file.name.substring(file.name.indexOf("."),file.name.length);
          const isLt10M = file.size < 2 * 1024 * 1024;
          const isJPG = file.type === 'image/jpeg';
          const isXLSX = file.type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const isXLS = file.type ==='application/vnd.ms-excel';
          const isZIP = file.type ==='application/zip';
          const isTAR = file.type ==='application/x-tar';
          const isDOCX = file.type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          const isDOC = file.type ==='application/msword';
          if (!isLt10M) {
              this.$message.error('上传模板大小不能超过 2MB!');
          }
          if (isLt10M) {
              this.ruleForm.chBillTemplate="http://doc.yctop.com/"+this.uptoken.key
          }
          return isLt10M;
      },
      handleRemoveChange3(file, fileList){
          var filelists = [];
          this.ruleForm.fillUrl='';
          this.ruleForm.fillName='';
          this.formData3.smallModelPhoto = filelists;
      },
      handleSuccessChange3(response, file, fileList) { //上传成功后在图片框显示图片
          this.ruleForm.fillUrl="http://doc.yctop.com/"+response.key;
          this.ruleForm.fillName=file.name;
      },
      //下载附件
      downloadFile(file){
          this.frow = file.url
          window.open(this.frow)
      },
		}
	}
</script>
