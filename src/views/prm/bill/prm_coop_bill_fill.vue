<template>
	<el-dialog title="数据填充" width="760px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-form>
				<el-row>
          <el-col class="elementWidth">
            <el-form-item label="收费项目" label-width="95px">
              <el-input v-model="ruleForm.serviceName" auto-complete="off" disabled style="width: 190px;">
              </el-input>
            </el-form-item>
          </el-col>
					<el-col class="elementWidth">
            <el-form-item label="客户名称" label-width="95px">
                <el-input v-model="ruleForm.coopName" auto-complete="off" disabled style="width: 350px;">
                </el-input>
            </el-form-item>
			    </el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label="结算方式" label-width="95px">
                <el-input v-model="ruleForm.settlementPeriodType" auto-complete="off" disabled style="width: 190px;">
                </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="账单月份" label-width="95px">
              <el-input v-model="ruleForm.billName" auto-complete="off" disabled style="width: 85px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="航班性质" label-width="85px">
              <el-input v-model="ruleForm.aircraftClassification" auto-complete="off" disabled style="width: 180px;">
              </el-input>
            </el-form-item>
          </el-col>
				</el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="口岸" label-width="95px">
              <el-input v-model="ruleForm.departureStation" auto-complete="off" disabled style="width: 150px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="进出港类型" label-width="135px">
              <el-input v-model="ruleForm.arrivalDeparturType" auto-complete="off" style="width: 85px;" disabled>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col class="elementWidth">
            <el-form-item label="IT编码" label-width="135px">
              <el-input v-model="ruleForm.itCode" auto-complete="off" disabled style="width: 130px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
				<el-row>
          <el-col class="elementWidth">
            <el-form-item label="单价" label-width="95px">
              <el-input v-model="ruleForm.unitPrice" auto-complete="off" disabled style="width: 150px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="填充数量" label-width="135px">
                <el-input v-model="ruleForm.fillNumber" auto-complete="off" :disabled="showFlagFillNumber" @change="setActuralChargeValue" style="width: 85px;">
                </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="填充金额" label-width="135px">
              <el-input v-model="ruleForm.planCharge" auto-complete="off" disabled style="width: 130px;">
              </el-input>
            </el-form-item>
          </el-col>
				</el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="折扣" v-show="showFlag1" label-width="95px">
              <el-input v-model="ruleForm.discount" @change="setInvoiceAmountValue" @input="formatToFloat('discount')" style="width: 150px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="折后金额" v-show="showFlag1" label-width="135px">
              <el-input v-model="ruleForm.acturalCharge" @change="setDiscountValue" @input="formatToFloat('invoiceAmount')" style="width: 85px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
				<el-row>
          <el-col class="elementWidth">
            <el-form-item label="" label-width="95px">
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
          <!--<el-col class="elementWidth">
            <el-form-item label-width="5px">
              <font size="1px">只能上传.pdf.xls.xlsx.jpg.tar.zip.doc.docx文件，且不超过2M</font>
            </el-form-item>
          </el-col>-->
				</el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="销售备注" v-show="showFlag2" label-width="95px">
              <el-input v-model="ruleForm.remarkSaler" style="width: 640px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
				<el-row>
					<el-col class="elementWidth">
            <el-form-item style="margin-left: 15px;">
						   <el-button size="small" type="primary" @click="submitForm" :disabled="disabledFlag2">确定填充</el-button>
            </el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 15px;">
                <font size="1px" v-show="!showFlag">(min:{{ruleForm.minCharge}}元-max:{{ruleForm.maxCharge}}元)</font>
                <font size="1px" v-show="isHaveBase">(基础数量:{{ruleForm.baseQuantity}},单价（超量）:{{ruleForm.unitPriceExcessive}}元)</font>
            </el-form-item>
          </el-col>
				</el-row>
			</el-form>
		</div>
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
				data: [],
				showFlag:false,
        showFlag1: true,
        showFlag2: true,
        showFlagFillNumber: false,
        isHaveBase: false,
        disabledFlag2: false,
				form: {
					totalCharge: 0
				},
				ruleForm: {
					billId:'',
          serviceName: '',
					coopName:'',
					settlementPeriod:'',
					settlementType:'',
					unitPrice:'',
					billName:'',
					settlementPeriodType:'',
					fillNumber:'',
					fillUrl:'',
          fillName: '',
					minCharge:'',
					maxCharge:'',
					acturalCharge:'',
          discount:'',
          planCharge: '',
          acturalChargeOld: '',
          statementId: '',
          isDetail: '',//用于判断是否是从账单明细进来的
          remarkSaler: '',
				},
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
		mounted: function () {
	      this.$axios.get('/hrs/org/getUpToken')
	      .then(function(response) {
	          this.uptoken.token=response.data.data;
	       }.bind(this)
	      );
        if (this.frow.fillUrl) {

            var filelists = [];
            var item = {
                name: this.frow.fillName,
                url: this.frow.fillUrl
            }
            filelists.push(item);
            this.formData3.smallModelPhoto = filelists;
            this.ruleForm.fillUrl=this.frow.fillUrl;
            this.ruleForm.fillName=this.frow.fillName;
        }

	    },
		created: function() {
      this.ruleForm.statementId = this.frow.statementId;
			this.ruleForm.billId = this.frow.billId;
      this.ruleForm.serviceName=this.frow.serviceName;
			this.ruleForm.coopName=this.frow.coopName;
			this.ruleForm.billName=this.frow.billName;
			this.ruleForm.fillNumber=this.frow.fillNumber;
			this.ruleForm.isDetail=this.frow.source;
      this.ruleForm.departureStation=this.frow.departureStation;
      this.ruleForm.arrivalDeparturType=this.frow.arrivalDeparturType;
      this.ruleForm.aircraftClassification=this.frow.aircraftClassification;
      this.ruleForm.itCode=this.frow.itCode;
      this.ruleForm.remarkSaler=this.frow.remarkSaler;

			this.ruleForm.settlementPeriodType= this.settlementTypeFormat(this.frow.paymentMethod,this.frow.settlementPeriod,this.frow.settlementType);
			if(this.frow.settlementType=='1'){//按量
				this.showFlag=false;
        this.showFlagFillNumber=false;
				if (this.frow.acturalCharge || this.frow.acturalCharge==0) {//填充过，相当于编辑
				    this.ruleForm.acturalCharge=this.frow.acturalCharge;
            this.ruleForm.acturalChargeOld=this.frow.acturalCharge;
            this.ruleForm.discount=this.frow.discount;
            this.ruleForm.planCharge=this.frow.planCharge;
				}else{////没填充过
            this.ruleForm.discount=10;
            this.ruleForm.acturalChargeOld=0;
				}
        this.ruleForm.unitPrice = this.frow.unitPrice;
				if(this.frow.minCharge ==0 && this.frow.maxCharge==0){
            this.showFlag=true;
        }else{
				    if(this.frow.minCharge== '' && this.frow.maxCharge==''){
                this.showFlag=true;
            }else{
                this.ruleForm.minCharge = this.frow.minCharge;
                this.ruleForm.maxCharge = this.frow.maxCharge;
            }
        }
        if(this.frow.baseQuantity && this.frow.unitPriceExcessive){
            this.isHaveBase = true;
            if(this.ruleForm.baseQuantity==0 || this.frow.unitPriceExcessive==0){
                this.isHaveBase = false;
            }else{
                this.ruleForm.baseQuantity = this.frow.baseQuantity;
                this.ruleForm.unitPriceExcessive = this.frow.unitPriceExcessive;
            }
        }
			}else{//不是按量
				this.showFlag=true;
        this.showFlagFillNumber=true;
				if (this.frow.acturalCharge) {//填充过
					  this.ruleForm.planCharge=this.frow.planCharge;
            this.ruleForm.discount=this.frow.discount;
            this.ruleForm.acturalCharge=this.frow.acturalCharge;
            this.ruleForm.acturalChargeOld=this.frow.acturalCharge;
				}else{//没填充过
					  this.ruleForm.planCharge=this.frow.planCharge;
					  this.ruleForm.discount=10;
            this.ruleForm.acturalCharge=this.frow.planCharge;
            this.ruleForm.acturalChargeOld=this.frow.planCharge;
				}
			}
			if(this.frow.source == 'detail'){//从账单明细菜单进来的
          this.showFlag1 = false;
          this.showFlag2 = false;
      }else if(this.frow.source == 'sale'){
          this.showFlag2 = true;
      }else if(this.frow.source == 'base'){
          this.showFlag2 = false;
      }
		},
		inject: ['findCoopBillList','callback1'],
		methods: {
          setInvoiceAmountValue(){
              this.ruleForm.acturalCharge=(this.ruleForm.planCharge * (this.ruleForm.discount/10)).toFixed(2);
          },
          setDiscountValue(){
              if(this.ruleForm.planCharge != null && this.ruleForm.planCharge != ''){
                  this.ruleForm.discount=((this.ruleForm.acturalCharge/this.ruleForm.planCharge) * 10).toFixed(1);
              }
          },
          formatToFloat(item) {
              if(item == 'discount') {
                  this.ruleForm.discount = this.ruleForm.discount.replace(/[^0123456789.]/g, "");
                  var t = this.ruleForm.discount.split('.');
                  if(t.length > 1) {
                      this.ruleForm.discount = t[0] + "." + t[1].substr(0, 1);
                  }
              }else if(item == 'invoiceAmount'){
                  this.ruleForm.acturalCharge = this.ruleForm.acturalCharge.replace(/[^0123456789.]/g, "");
                  var t = this.ruleForm.acturalCharge.split('.');
                  if(t.length > 1) {
                      this.ruleForm.acturalCharge = t[0] + "." + t[1].substr(0, 2);
                  }
              }
          },
          //下载附件
          downloadFile(file){
              this.frow = file.url
              window.open(this.frow)
          },
			    //上传附件
		      beforeAvatarUpload3(file) {
            //let fileHashcode=this.hashCode(file.name);Date.now().toString(36)
		        //this.uptoken.key = window.localStorage.getItem("orgCode")+"_fillUrl_"+fileHashcode+file.name.substring(file.name.indexOf("."),file.name.length);
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
		       /* if (!(isJPG||isXLSX||isXLS||isZIP||isTAR||isDOCX||isDOC)) {
		          this.$message.error('上传附件只能是 .pdf.xls.xlsx.jpg.tar.zip.doc.docx 格式的文件!');
		        }
		        return isLt10M&&(isJPG||isXLSX||isXLS||isZIP||isTAR||isDOCX||isDOC);*/
              return isLt10M;
		      },
		      handleRemoveChange3(file, fileList){
              /*var filelists = [];
              this.ruleForm.fillUrl='';
              this.ruleForm.fillName='';
              this.formData3.smallModelPhoto = filelists;
              this.formData3.smallModelPhotoNames=filelists;*/
              var filelists = [];
              this.ruleForm.fillUrl='';
              this.ruleForm.fillName='';
              this.formData3.smallModelPhoto = filelists;
		      },
		      handleSuccessChange3(response, file, fileList) { //上传成功后在图片框显示图片
             /* let files="http://doc.yctop.com/"+response.key;
              let fileName=file.name;
		          //this.ruleForm.fillUrl="http://doc.yctop.com/"+response.key;
              this.formData3.smallModelPhoto.push(files);
              this.formData3.smallModelPhotoNames.push(fileName);*/
              this.ruleForm.fillUrl="http://doc.yctop.com/"+response.key;
              this.ruleForm.fillName=file.name;
          },
			setActuralChargeValue() {
        let planCharge=0;
        /*if(this.ruleForm.baseQuantity && this.ruleForm.unitPriceExcessive && this.ruleForm.baseQuantity!=0 && this.ruleForm.unitPriceExcessive!=0){
            if(this.ruleForm.fillNumber>this.ruleForm.baseQuantity){
                planCharge = this.multiply(this.ruleForm.baseQuantity,this.ruleForm.unitPrice) +this.multiply(this.ruleForm.fillNumber-this.ruleForm.baseQuantity,this.ruleForm.unitPriceExcessive);
            }else{
                planCharge =this.multiply(this.ruleForm.unitPrice,this.ruleForm.fillNumber);
            }
        }else{
            //planCharge =this.ruleForm.unitPrice*this.ruleForm.fillNumber;
            planCharge =this.multiply(this.ruleForm.unitPrice,this.ruleForm.fillNumber);
        }*/
        if(this.frow.settlementType == '1' && parseFloat(this.frow.minCharge) > 0){
            if(this.ruleForm.fillNumber>this.frow.baseQuantity){
                if(this.frow.unitPriceExcessive){//超量单价存在
                    planCharge = this.multiply(this.ruleForm.fillNumber-this.frow.baseQuantity,this.frow.unitPriceExcessive) + this.frow.minCharge;
                }else{//超量单价不存在
                    planCharge = this.multiply(this.ruleForm.fillNumber-this.frow.baseQuantity,0) + this.frow.minCharge;
                }
            }else{
                planCharge = this.frow.minCharge;
            }
        }else if(this.frow.settlementType == '1' && parseFloat(this.frow.minCharge) == 0){
            if(this.frow.baseQuantity=='' || this.frow.baseQuantity==null || parseFloat(this.frow.baseQuantity) == 0){
                planCharge =this.multiply(this.frow.unitPrice,this.ruleForm.fillNumber);
            }else if(parseFloat(this.frow.baseQuantity) > 0 && (this.ruleForm.fillNumber>this.frow.baseQuantity)){
                if(this.frow.unitPriceExcessive){//超量单价存在
                    planCharge =this.multiply(this.frow.unitPriceExcessive,this.ruleForm.fillNumber);
                }else{//超量单价不存在
                    planCharge =this.multiply(0,this.ruleForm.fillNumber);
                }
            }else if(parseFloat(this.frow.baseQuantity) > 0 && (this.ruleForm.fillNumber<=this.frow.baseQuantity)){
                planCharge =this.multiply(this.frow.unitPrice,this.ruleForm.fillNumber);
            }
        }
        this.ruleForm.acturalCharge=(planCharge * (this.ruleForm.discount/10)).toFixed(2);
        this.ruleForm.planCharge=planCharge;
        /*if(this.ruleForm.minCharge){
            if (planCharge<this.ruleForm.minCharge) {
                this.ruleForm.planCharge=this.ruleForm.minCharge;
                this.ruleForm.acturalCharge=(this.ruleForm.minCharge * (this.ruleForm.discount/10)).toFixed(2);
            }
        }*/
				if(this.ruleForm.maxCharge){
            if (planCharge>this.ruleForm.maxCharge) {
                this.ruleForm.planCharge=this.ruleForm.maxCharge;
                this.ruleForm.acturalCharge=(this.ruleForm.maxCharge * (this.ruleForm.discount/10)).toFixed(2);
            }
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
			settlementTypeFormat(paymentMethod,settlementPeriod,settlementType) {
          if(settlementType == '0') {
              settlementType= "包月计费";
          } else if(settlementType == '1') {
              settlementType=  "按量计费";
          }else if(settlementType == '2'){
              settlementType=  "包年计费";
          }else if(settlementType == '3'){
              settlementType=  "包半年计费";
          }else if(settlementType == '4'){
              settlementType=  "包季度计费";
          }
         if(settlementPeriod == '0') {
             settlementPeriod= "按月";
         } else if(settlementPeriod == '1'){
             settlementPeriod=  "按年";
         }else if(settlementPeriod == '2'){
             settlementPeriod=  "按季度";
         }else if(settlementPeriod == '3'){
             settlementPeriod=  "按半年";
         }
				return paymentMethod+"/"+settlementPeriod+'/'+settlementType;
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
			submitForm() {
				if (!this.showFlag) {
					if (this.ruleForm.fillNumber) {
						let regE =/^[0-9]\d{0,9}$/;
						if (!regE.test(this.ruleForm.fillNumber)) {
				         this.openError('请输入1-10位整数');
				         return;
				        }
					}else{
						this.openError("请输入填充数量");
						return;
					}
				}
				if(this.ruleForm.discount){

        }else{
            this.openError("请输入折扣或折后金额");
            return;
        }
        if(this.ruleForm.acturalCharge){

        }else{
            this.openError("请输入折扣或折后金额");
            return;
        }
        this.disabledFlag2 = true;
				this.$axios.post('/prm/coopBill/doFill', this.ruleForm)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findCoopBillList();
              this.callback1(this.ruleForm.billId,this.ruleForm.acturalCharge,this.ruleForm.discount,this.ruleForm.fillNumber,this.ruleForm.planCharge,this.ruleForm.acturalChargeOld,this.ruleForm.fillUrl,this.ruleForm.fillName,this.ruleForm.remarkSaler);
							this.handleClose();
						} else {
							let errorinfo = response.data.messageInfo;
							this.openError(errorinfo);
						}

					}.bind(this)).catch(function(error) {
						this.openError(error.response.data.messageInfo);
					}.bind(this));
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
      hashCode(str) {
        var h = 0;
        var len = str.length;
        var t = 2147483648;
        for (var i = 0; i < len; i++) {
            h = 31 * h + str.charCodeAt(i);
            if (h > 2147483647) h %= t;
        }
        return h;
      },
			exportExcel() {
				this.$axios.post3('/prm/coopBill/exportExcel')
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = 'feeModel' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));

			}

		}
	}
</script>
<style scoped>
.el-form-item__content3 {
    line-height: 12px !important;
    position: relative;
    font-size: 14px;
}
</style>
