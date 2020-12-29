<template>
	<el-dialog title="开具发票" width="665px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="form" :model="form" class="demo-ruleForm">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="开票客户名称" prop="invoiceTitle" label-width="123px">
            <el-input style="width: 508px;" v-model="form.invoiceTitle" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="实收金额" required label-width="95px">
						<el-input v-model="form.acturalCharge" disabled style="width: 120px;"></el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="发票号" required label-width="73px">
            <el-input v-model="form.invoiceNo" clearable maxlength="20" show-word-limit style="width: 130px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="开票日期" required label-width="80px">
            <el-date-picker style="width: 133px;" v-model="form.invoiceDate" type="date" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="发票票种" prop="invoiceType" label-width="95px">
            <el-select style="width: 120px;" v-model="form.invoiceType" clearable>
              <el-option label="电子票" value="电子票"></el-option>
              <el-option label="专票" value="专票"></el-option>
              <el-option label="普票" value="普票"></el-option>
              <el-option label="不开票" value="不开票"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="电子发票接收邮箱" prop="invoiceReceiveEmail" label-width="140px">
            <el-input style="width: 275px;" v-model="form.invoiceReceiveEmail" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="开票备注" prop="invoiceRemark" label-width="95px">
            <el-input style="width: 536px;" v-model="form.invoiceRemark" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="快递公司" label-width="95px">
            <el-input v-model="form.expressCompany" clearable style="width: 120px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="快递单号" label-width="95px">
            <el-input v-model="form.expressNumber" clearable maxlength="20" style="width: 321px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
				    	<el-button size="small" type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
				</el-col>
			</el-row>
		</el-form>
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
				form: {
					acturalCharge:'',
          acturalCharge1: '',
					discount:'',
					invoiceAmount:'',
					invoiceNo: '',
					billId: '',
          statement_id:'',
          invoiceTitle: '',
          invoiceType: '',
          invoiceReceiveEmail: '',
          invoiceRemark: '',
          coopId: '',
          expressCompany: '中通',
          expressNumber: '',
          invoiceDate: '',
				},
        contactoptions: [],
        invoiceNoOld: '',
        invoiceTypeOld: '',
			}
		},
		created: function() {
			this.form.billId = this.frow.billId;
      this.form.acturalCharge = this.frow.invoiceAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      this.form.acturalCharge1 = this.frow.invoiceAmount;//用于保存到数据库
      this.form.statement_id = this.frow.statement_id;
			this.form.discount = this.frow.discount;
			this.form.invoiceNo = this.frow.invoiceNumber;
			this.form.invoiceAmount = this.frow.invoiceAmount;
      this.form.invoiceTitle = this.frow.invoiceTitle;
      this.form.invoiceType = this.frow.invoiceType;
      this.form.invoiceRemark = this.frow.invoiceRemark;
      this.form.coopId = this.frow.coopId;
      this.form.invoiceReceiveEmail = this.frow.invoiceReceiveEmail;
      if(this.frow.expressCompany == null || this.frow.expressCompany == ''){
          this.form.expressCompany = '中通';
      }else{
          this.form.expressCompany = this.frow.expressCompany;
      }

      this.form.expressNumber = this.frow.expressNumber;
      //有开票日期则显示，没有默认当前日期
      if(this.frow.invoiceDate){
          this.form.invoiceDate = this.frow.invoiceDate.substring(0,10);
      }else{
          this.form.invoiceDate = this.getDateTime(new Date());
      }
      this.invoiceNoOld = this.frow.invoiceNumber;
      this.invoiceTypeOld = this.frow.invoiceType;
      /*let params = {
          coopId: this.form.coopId
      }
      this.$axios.get2('/prm/coop/queryContactsIsValid',
          params)
          .then(function(response) {
              this.contactoptions = response.data.data;
              this.form.invoiceReceiveEmails = this.frow.invoiceReceiveEmails;
          }.bind(this));*/
		},
		inject: ['findMadeCoopBillList','invoiceEmail'],
		methods: {
      getDateTime(theDate) {
          let _year = theDate.getFullYear();
          let _month = theDate.getMonth();
          let _day = theDate.getDate();
          console.log(_day);
          _month = _month + 1;
          if (_month < 10) {
              _month = "0" + _month;
          }
          return _year + "-" + _month +"-"+ _day;
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
				if(this.form.invoiceNo) {

				}else{
            this.$message.error('请录入发票号');
            return;
        }
        if(this.form.invoiceDate) {

        }else{
            this.$message.error('请选择开票日期');
            return;
        }
        //当发票号或者发票票种有变化时在更新开票日期
        /*let isNeedUpdateInvoiceDate = 'unNeed';
        if((this.invoiceNoOld!=null && this.invoiceNoOld!='') && (this.form.invoiceNo!=null && this.form.invoiceNo!='') && (this.invoiceNoOld != this.form.invoiceNo)){
            isNeedUpdateInvoiceDate = 'need';
        }else if((this.invoiceNoOld!=null && this.invoiceNoOld!='') && (this.form.invoiceNo==null || this.form.invoiceNo=='')){
            isNeedUpdateInvoiceDate = 'need';
        }else if((this.invoiceNoOld==null || this.invoiceNoOld=='') && (this.form.invoiceNo!=null && this.form.invoiceNo!='')){
            isNeedUpdateInvoiceDate = 'need';
        }
        if((this.invoiceTypeOld!=null && this.invoiceTypeOld!='') && (this.form.invoiceType!=null && this.form.invoiceType!='') && (this.invoiceTypeOld != this.form.invoiceType)){
            isNeedUpdateInvoiceDate = 'need';
        }else if((this.invoiceTypeOld!=null && this.invoiceTypeOld!='') && (this.form.invoiceType==null || this.form.invoiceType=='')){
            isNeedUpdateInvoiceDate = 'need';
        }else if((this.invoiceTypeOld==null || this.invoiceTypeOld=='') && (this.form.invoiceType!=null && this.form.invoiceType!='')){
            isNeedUpdateInvoiceDate = 'need';
        }*/
				this.$axios.post('/prm/coopBill/invoice', {
            invoiceNumber: this.form.invoiceNo,
            statement_id: this.form.statement_id,
            acturalCharge: this.form.acturalCharge1,
            invoiceTitle: this.form.invoiceTitle,
            invoiceType: this.form.invoiceType,
            invoiceRemark: this.form.invoiceRemark,
            expressCompany: this.form.expressCompany,
            expressNumber: this.form.expressNumber,
            invoiceDate: this.form.invoiceDate,
            //isNeedUpdateInvoiceDate: isNeedUpdateInvoiceDate,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(response) {
						if(response.data.code == 0) {
							/*this.openSuccess();
							this.findMadeCoopBillList();
							this.handleClose();*/
                this.handleClose();
                let currthis = this
                currthis.$confirm('保存成功，是否给客户发送邮件？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.invoiceEmail(this.form);
                }).catch(() => {
                    currthis.$message({
                        type: 'info',
                        message: '已取消发送'
                    });
                    currthis.findMadeCoopBillList();
                    currthis.handleClose();
                });

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
			}
		}
	}
</script>
