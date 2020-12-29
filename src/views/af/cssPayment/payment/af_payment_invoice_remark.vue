<template>
	<el-dialog title="发票信息" width="650px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :inline="false" ref="ruleForm" label-width="10px" class="invoice-ruleForm">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="invoiceTitle" label-width="10px">
            <el-input v-model="ruleForm.invoiceTitle" style="width:598px;margin-right: 15px;" auto-complete="off" maxlength="200" show-word-limit>
              <template slot="prepend">
                <span>发票抬头</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="invoiceNum" label-width="10px">
            <el-input v-model="ruleForm.invoiceNum" style="width:345px;margin-right: 15px;" auto-complete="off" maxlength="100" show-word-limit>
              <template slot="prepend">
                <span>发票号码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="invoiceDate" label-width="10px">
            <el-input class="" style="width:230px;">
              <template slot="prepend">
                <span>发票日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="ruleForm.invoiceDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 161px;margin-right: -5px;" :clearable="false">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
            <el-row>
              <el-button type="text" style="margin-left: 5px;color: #909399" disabled>发票备注</el-button>
            </el-row>
						<el-input type="textarea" v-model="ruleForm.invoiceRemark" auto-complete="off" show-word-limit maxlength="500" rows="3" style="width: 598px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-button type="primary" size="small" @click="doSave('ruleForm')">保存</el-button>
						<el-button type="primary" size="small" @click="cancel" style="background-color:#FFF;color:#409EFF">取消</el-button>
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
				ruleForm: {
          paymentId: '',
					invoiceRemark: '',
          invoiceTitle: '',
          invoiceNum: '',
          invoiceDate: '',
				}
			}
		},
		created: function() {
			this.ruleForm.invoiceRemark = this.frow.invoiceRemark
      this.ruleForm.invoiceTitle = this.frow.invoiceTitle;
      this.ruleForm.invoiceNum = this.frow.invoiceNum;
      this.ruleForm.invoiceDate = this.frow.invoiceDate;
      //如果 发票抬头=空，则 默认为 收款客户名称
      if(this.ruleForm.invoiceTitle == null || this.ruleForm.invoiceTitle == ''){
          this.ruleForm.invoiceTitle = this.frow.customerName;
      }
      if(this.ruleForm.invoiceDate == null || this.ruleForm.invoiceDate == ''){
          this.ruleForm.invoiceDate = this.getDateTime();
      }
		},
		inject: ['queryList'],
		methods: {
      getDateTime() {
          let theDate = new Date()
          var _year = theDate.getFullYear()
          var _month = theDate.getMonth()
          _month++
          var _date = theDate.getDate()
          if (_month < 10) {
              _month = "0" + _month;
          }
          if (_date < 10) {
              _date = "0" + _date;
          }
          return _year + "-" + _month + "-" + _date
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
			doSave(formName) {
				// if(this.ruleForm.invoiceRemark==null||this.ruleForm.invoiceRemark===''){
				// 	this.openError("备注不能为空")
				// 	return
				// }
        this.ruleForm.paymentId = this.frow.paymentId
				this.$axios.post2('/afbase/cssPayment/invoiceRemark', this.ruleForm)
					.then((response) =>{
						if(response.data.code == 0) {
							this.openSuccess();
							this.queryList();
							this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch((error) =>{
						this.openError(error.response.data.messageInfo)
					});
			},
			cancel() {
				this.handleClose()
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>
<style type="text/css">
  .invoice-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .invoice-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .invoice-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }
</style>
