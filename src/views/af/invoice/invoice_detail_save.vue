<template>
	<el-dialog title="发票 - 新增开票" width="750px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" append-to-body>
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="15px" class="invoiceDeatailSaveTwo">
			<el-row>
        <el-col class="elementWidth">
        	<el-form-item>
        		<el-input auto-complete="off" disabled style="width:707px" v-model="ruleForm.customerName">
        			<template slot="prepend">收款客户</template>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth showl">
        	<el-form-item prop="invoiceTitle">
        		<el-input  auto-complete="off" maxlength="200" show-word-limit clearable style="width:707px" v-model="ruleForm.invoiceTitle">
        			<template slot="prepend"><font style="color: red;">*</font>发票抬头</template>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
				<el-col class="elementWidth showl">
					<el-form-item prop="invoiceNum">
						<el-input class="widthWithThree" auto-complete="off" maxlength="100" clearable v-model="ruleForm.invoiceNum" style="width:455px" show-word-limit>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票号码</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="invoiceDate">
						<el-input class="widthWithFourWithXing" style="width:235px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.invoiceDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" style="width: 137px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="currency">
						<el-input  auto-complete="off" style="width:160px">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>币种</span>
							</template>
              <el-select slot="suffix" v-model="ruleForm.currency"   style="width:80px;margin-right: -5px;" >
              	<el-option v-for="item in currencyList" :key="item.currency" :label="item.currency"   @click.native="checkCurrency(item)"  :value="item.currency">
              	</el-option>
              </el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="amount">
						<el-input class="widthWithFourWithXing" :disabled="disType" v-model="ruleForm.amount" @input="formatFloat4()" style="width:275px">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item  prop="invoiceType">
						<el-input class="widthWithFourWithXing" auto-complete="off" style="width:235px;" clearable>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>发票类型</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.invoiceType" placeholder="请选择发票类型" style="width:145px;margin-right: -5px;" clearable>
								<el-option v-for="item in invoiceTypeList" :key="item.param_text" :label="item.param_text" :value="item.param_text">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth showl">
					<el-row>
						<el-form-item>
							<el-input class="widthWithSix2" show-word-limit v-model="ruleForm.taxpayerNum" maxlength="50" auto-complete="off" clearable style="width:705px;">
								<template slot="prepend">
									<span>社会信用代码</span>
								</template>
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth showl">
					<el-form-item>
						<el-input class="widthWithTwo" show-word-limit v-model="ruleForm.address" maxlength="100" style="width:345px" auto-complete="off" clearable>
							<template slot="prepend">
								<span>地址</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth showl">
					<el-form-item>
						<el-input class="widthWithTwo" show-word-limit v-model="ruleForm.phoneNumber" maxlength="50" style="width:345px" auto-complete="off" clearable>
							<template slot="prepend">
								<span>电话</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth showl">
					<el-form-item>
						<el-input class="widthWithThree" show-word-limit v-model="ruleForm.bankName" maxlength="100" style="width:345px" auto-complete="off" clearable>
							<template slot="prepend">
								<span>开户行</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth showl">
					<el-form-item>
						<el-input v-model="ruleForm.bankNumber" show-word-limit style="width:345px" maxlength="50" auto-complete="off" clearable>
							<template slot="prepend">
								<span>银行账号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth showl">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>发票备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.invoiceRemark" type="textarea" auto-complete="off" maxlength="500" style="width:705px;" :rows="3" show-word-limit >
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
			<div style="padding:0px 0px 10px 0px">
				<HR color="#eee" size="5">
				</HR>
			</div>
			<div style="padding:0px 0px 10px 20px">
				<span>核销设置</span>
				<el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
				<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
				<el-row v-show="showFlag" style="margin-top: 10px;">
					<el-col class="elementWidth">
						您需要收票后由系统自动完成核销吗？
					</el-col>
					<el-col class="elementWidth">
						<el-radio style="margin-left: 50px;" v-model="ruleForm.isAutoWriteoff" label="1">不需要</el-radio>
					</el-col>
					<el-col class="elementWidth">
						<el-radio style="margin-left: 50px;" v-model="ruleForm.isAutoWriteoff" label="2">需要</el-radio>
					</el-col>
				</el-row>
				<el-row v-show="showFlag" style="margin-top: 20px;">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" auto-complete="off" style="width:385px;">
								<template slot="prepend">
									<span>科目</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.financialAccountName" placeholder="请选择" style="width:288px;margin-right: -5px;"   @change="setFinancialAccount">
									<el-option v-for="(item,index) in financialAccounts" :key="item.financialAccountId" :label="`${item.financialAccountName} ${item.financialAccountCode}`" :value="item.financialAccountId">
									    <span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
									  </el-option>
									</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="paymentDate">
							<el-input class="widthWithFourWithXing" style="width:265px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>核销日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" style="width: 167px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" clearable v-model="ruleForm.writeoffRemark" style="width:665px" show-word-limit maxlength="200">
								<template slot="prepend">
									<span>核销备注</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<div style="padding:0px 0px 10px 0px">
			<HR color="#eee" size="5">
			</HR>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="doSave('ruleForm')">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
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
				showFlag: false,
        currencyList:[],
        invoiceTypeList:[],
        financialAccounts: [],
        disType:false,
				ruleForm: {
					customerName: this.frow.customerName,
          customerId:this.frow.customerId,
					businessScope: this.frow.businessScope,
					invoiceDate: this.getDateTime(new Date()),
					invoiceTitle: '',
					invoiceNum: '',
					currency: 'CNY',
					amount: null,
					invoiceType: '',
					taxpayerNum:'',
          address:'',
          phoneNumber:'',
          invoiceRemark:'',
          bankNumber:'',
          bankName:'',
          rowUuid:this.frow.rowUuid,
          invoiceId:this.frow.invoiceId,
          financialAccountName:'',
          financialAccountCode:'',
          financialAccountType:'',
          writeoffDate: this.getDateTime(new Date()),
          isAutoWriteoff:'1',
          writeoffRemark:''
				},
				rules: {
					currency: [{
						required: true,
						message: '请选择币种',
						trigger: ['blur', 'change']
					}],
					invoiceTitle: [{
						required: true,
						message: '请录入发票抬头',
						trigger: ['blur', 'change']
					}],
          invoiceType: [{
          	required: true,
          	message: '请选择发票类型',
          	trigger: ['blur', 'change']
          }],
					invoiceNum: [{
						required: true,
						message: '请录入发票号',
						trigger: ['blur', 'change']
					}],
					amount: [{
						required: true,
						message: '请录入发票金额',
						trigger: ['blur', 'change']
					}]
				}

			}
		},
		inject: ['queryInfo'],
		created: function() {
          this.currencyList = this.frow.dataTwo;
          this.ruleForm.invoiceTitle = this.frow.openInvoiceTitle;
          this.ruleForm.taxpayerNum = this.frow.taxpayerNum;
          this.ruleForm.address = this.frow.address;
          this.ruleForm.phoneNumber = this.frow.phoneNumber;
          this.ruleForm.bankName = this.frow.bankName;
          this.ruleForm.bankNumber = this.frow.bankNumber;
          this.ruleForm.invoiceType = this.frow.openInvoiceType;
          if(this.currencyList&&this.currencyList.length>0){
             this.ruleForm.amount = this.currencyList[0].amountInvoiceNo;
             this.ruleForm.currency = this.currencyList[0].currency;
             if(this.ruleForm.amount<=0){
               this.disType=true;
             }else{
               this.disType=false;
             }
          }
       //invoiceTypeList
       this.$axios.get2('/afbase/vAfCategory/invoiceType').then((response) => {
         this.invoiceTypeList = response.data.data;
       }).catch((error) => {
         console.log(error);
       });
       //科目
       this.$axios.post('/afbase/cssIncomeWriteoff/getFinancialAccount/' + this.frow.businessScope + '/' + this.frow.customerId).then((response) => {
           this.financialAccounts = response.data.data;
           this.financialAccounts = this.financialAccounts.filter(item => item.financialAccountCode != '')
           if(this.financialAccounts.length > 0){
               for (var i = 0; i < this.financialAccounts.length; i++) {
                   if(this.financialAccounts[i].financialAccountName === '银行存款'){
                       this.ruleForm.financialAccountName = this.financialAccounts[i].financialAccountName + " " + this.financialAccounts[i].financialAccountCode;
                       this.ruleForm.financialAccountCode = this.financialAccounts[i].financialAccountCode;
                       this.ruleForm.financialAccountType = this.financialAccounts[i].financialAccountType;
                   }
               }
               if(!this.ruleForm.financialAccountName){
                   this.ruleForm.financialAccountName = this.financialAccounts[0].financialAccountName + " " + this.financialAccounts[0].financialAccountCode;
                   this.ruleForm.financialAccountCode = this.financialAccounts[0].financialAccountCode;
                   this.ruleForm.financialAccountType = this.financialAccounts[0].financialAccountType;
               }
           }
       });
		},

		methods: {
      setFinancialAccount(vId) {
            let obj = {};
            obj = this.financialAccounts.find((item) => {
                return item.financialAccountId === vId;
            });
            if (obj) {
                this.ruleForm.financialAccountName = obj.financialAccountName + " " + obj.financialAccountCode;
                this.ruleForm.financialAccountCode = obj.financialAccountCode;
                this.ruleForm.financialAccountType = obj.financialAccountType;
            }
        },
      checkCurrency(item){
        this.ruleForm.amount=item.amountInvoiceNo;
        if(this.ruleForm.amount<=0){
          this.disType=true;
        }else{
          this.disType=false;
        }
      },
			doSave(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
            let falgAmountTwo = true;
            if(!this.disType){
               if(this.ruleForm.amount<=0){
                  falgAmountTwo = false;
                  // return false;
               }
            }
            let falgAmount = true;
            //取对应币种的金额
            if(this.currencyList&&this.currencyList.length>0){
               this.currencyList.forEach(detail=>{
                  if(this.ruleForm.currency == detail.currency){
                     if(this.ruleForm.amount>detail.amountInvoiceNo){
                       falgAmount = false;
                        return false;
                     }
                  }
               });
            }

            let writeoffFlag = true;
            if(!this.ruleForm.writeoffDate){
               writeoffFlag = false;
            }
            if(falgAmount&&falgAmountTwo&&writeoffFlag){
              this.$axios.post2('/afbase/cssIncomeInvoiceDetail/doSave', this.ruleForm)
              	.then((response) => {
              		if (response.data.code == 0) {
              			this.openSuccess("保存成功");
              			this.queryInfo();
              			this.handleClose();
              		} else {
              			this.openError(response.data.messageInfo);
              		}

              	}).catch((error) => {
              		let errorinfo = error.response.data.messageInfo;
              		this.openError(errorinfo)
              	});
            }else{
              if(!falgAmount){
               this.openError("发票金额不能大于所选币种的未开票金额");
              }else if(!falgAmountTwo){
                this.openError("录入金额必须大于0");
              }else{
                this.openError("当前选择自动完成核销，核销时间不能为空");
              }
            }
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
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
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
        if(_month==13){
          _month = 1;
        }
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date;
			},
			formatFloat4() {
        if(this.disType){
          this.ruleForm.amount = this.ruleForm.amount.replace(/[^-0123456789.]/g, "");
        }else{
          this.ruleForm.amount = this.ruleForm.amount.replace(/[^0123456789.]/g, "");
        }
				let t = this.ruleForm.amount.split('.');
				if (t.length > 1) {
					if (t[0] == '') {
						this.ruleForm.amount = "0." + t[1].substr(0, 2);
					} else {
						this.ruleForm.amount = t[0] + "." + t[1].substr(0, 2);
					}
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
	.invoiceDeatailSaveTwo .el-input__icon {
		line-height: 30px !important;
	}

	.invoiceDeatailSaveTwo .el-form-item__content {
		line-height: 40px !important;
	}
  .invoiceDeatailSaveTwo .showl .el-input__inner {
  		padding-right: 65px;
  	}

/* 	.invoiceDeatailSaveTwo .el-input-group__prepend {
		padding: 0 6px;
	}

	.invoiceDeatailSaveTwo .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	} */

	.invoiceDeatailSaveTwo .el-button {
		margin-top: -5px !important
	}

</style>
