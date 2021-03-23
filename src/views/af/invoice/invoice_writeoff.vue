<template>
	<el-dialog title="发票 - 核销" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		<el-form :model="ruleForm" ref="ruleForm" label-width="15px" class="demo-ruleForm ef_input_icon">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:630px" v-model="ruleForm.customerName">
							<template slot="prepend">收款客户</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:305px" v-model="ruleForm.invoiceNum">
							<template slot="prepend">
								<span>发票号码</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.currency" style="width:165px" disabled :class="{currencyRedColor:ruleForm.currency!='CNY'}">
							<template slot="prepend">
								<span>发票金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-input v-model="ruleForm.amount" style="width:150px;margin-left: 15px;" disabled>
					</el-input>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFive" v-model="ruleForm.invoiceAmountWriteoff" style="width:285px" disabled>
							<template slot="prepend">
								<span>已核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFive" v-model="ruleForm.amountWriteoffNo" style="width:305px;" disabled>
							<template slot="prepend">
								<span>未核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithSix2" v-model="ruleForm.amountWriteoff" :disabled="disType" @input="amountWriteoff()" style="width:330px" auto-complete="off" clearable>
							<template slot="prepend">
								<span>本次核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithTwo" auto-complete="off" style="width:285px;">
							<template slot="prepend">
                <font style="color: red;">*</font>
								<span>科目</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.financialAccountName" placeholder="请选择" style="width:188px;margin-right: -5px;"   @change="setFinancialAccount">
								<el-option v-for="(item,index) in financialAccounts" :key="item.financialAccountId" :label="`${item.financialAccountName} ${item.financialAccountCode}`" :value="item.financialAccountId">
								    <span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
								  </el-option>
								</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="paymentDate">
						<el-input class="widthWithFourWithXing" style="width:305px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>核销日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="核销日期" style="width: 208px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.writeoffRemark" type="textarea" auto-complete="off" style="width:950px;" :rows="3"  show-word-limit maxlength="200">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
    <div style="margin:10px 10px 10px 10px;">
    	<el-button type="primary" size="small" :loading="loading" v-on:click="doSave('ruleForm')">确定</el-button>
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
        loading: false,
				invoiceDetailSaveVisible: false,
				currencyCodeOptions:[],
				financialAccounts: [],
				disType:false,
				ruleForm: {
					customerName: '',
					customerId: null,
					invoiceNum: '',
					currency: '',
					amount: null,
					amountWriteoff: null,
					financialAccountName: '',
					financialAccountCode: '',
					financialAccountType: '',
					writeoffDate: null,
					invoiceDetailId:null,
					invoiceRowUuid:'',
          writeoffRemark:''
				},
				ffrow: {}
			}
		},
		inject: ['queryList'],
		created: function() {
			this.ruleForm.customerId = this.frow.customerId;
			this.ruleForm.customerName = this.frow.customerName;
			this.ruleForm.invoiceNum = this.frow.invoiceNum;
			this.ruleForm.currency = this.frow.currency;
			this.ruleForm.amount = parseFloat(this.frow.amount);
			this.ruleForm.invoiceAmountWriteoff = this.frow.amountWriteoff;
      if(this.frow.amountWriteoff){
        this.ruleForm.amountWriteoffNo = (this.frow.amount-this.frow.amountWriteoff).toFixed(2);
      }else{
        this.ruleForm.amountWriteoffNo = this.frow.amount;
      }
      this.ruleForm.amountWriteoff = this.ruleForm.amountWriteoffNo;
      this.ruleForm.invoiceDetailId = this.frow.invoiceDetailId;
      this.ruleForm.writeoffDate = this.getDateTime(new Date());
      this.ruleForm.invoiceRowUuid = this.frow.rowUuid;
      if(this.ruleForm.amountWriteoffNo<0){
        this.disType=true;
      }else{
        this.disType=false;
      }
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
      //科目选择
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
      //时间
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
      //保存
			doSave(formName) {
        this.loading = true;
        if(!this.ruleForm.amountWriteoff&&this.ruleForm.amountWriteoff!=0){
          this.openError("本次核销金额不能为空")
          return
        }
				if (!this.disType&&this.ruleForm.amountWriteoff <= 0) {
					this.openError("本次核销金额不能小于或等于0")
					return
				}
        if(!this.ruleForm.financialAccountCode){
          this.openError("请选择科目")
          return
        }
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/afbase/cssIncomeInvoiceDetailWriteoff/doSave', this.ruleForm)
							.then((response) => {
                this.loading = false;
								if (response.data.code == 0) {
									this.openSuccess("保存成功");
									this.queryList();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}
							}).catch((error) => {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo)
                this.loading = false;
							});
					} else {
						console.log('error submit!!');
            this.loading = false;
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
      amountWriteoff() {
        if(this.disType){
          this.ruleForm.amountWriteoff = this.ruleForm.amountWriteoff.replace(/[^-0123456789.]/g, "");
        }else{
          this.ruleForm.amountWriteoff = this.ruleForm.amountWriteoff.replace(/[^0123456789.]/g, "");
        }
      	let t = this.ruleForm.amountWriteoff.split('.');
      	if (t.length > 1) {
      		if (t[0] == '') {
      			this.ruleForm.amountWriteoff = "0." + t[1].substr(0, 2);
      		} else {
      			this.ruleForm.amountWriteoff = t[0] + "." + t[1].substr(0, 2);
      		}
      	}
      },
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			handleClose() {
				this.$emit('update:visible', false);
        this.queryList();
			}
		}
	}
</script>
<style type="text/css">
	.currencyRedColor input {
		color: red !important;
	}
</style>
