<template>
  <el-dialog title="账单 - 核销" width="950px" :visible.sync="visible" :close-on-press-escape="false"
             :close-on-click-modal="false" :before-close="handleClose">
    <el-form ref="form" :model="form" :rules="rules" class="demo-ruleForm">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="账单名称" label-width="100px">
            <el-input style="width: 463px;" v-model="fillData.statementName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="账单月份" label-width="90px">
            <el-input style="width: 270px;" v-model="fillData.statementDate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="发票抬头" label-width="100px">
            <el-input style="width: 463px;" v-model="fillData.invoiceTitle" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="发票号码" label-width="90px">
            <el-input style="width: 270px;" v-model="fillData.invoiceNumber" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="账单金额" label-width="100px">
            <el-input style="width: 64px;" value="CNY" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width: 150px;" v-model="fillData.invoiceAmount" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="已核销金额" label-width="90px">
            <el-input style="width: 150px;" v-model="fillData.invoiceWriteOffAmount" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="未核销金额" label-width="90px">
            <el-input style="width: 270px;" v-model="fillData.unwrittenAmount" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="本次核销金额" prop="amount" label-width="108px">
            <el-input style="width: 215px;" v-model="form.amount" @input="onlyNumber('amount')"
                      :disabled="amountDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="科目" prop="financialAccountCode" label-width="90px">
            <el-select :default-first-option=true v-model="form.financialAccountCode" filterable placeholder="请选择"
                       style="width:152px;margin-right: -5px;">
              <el-option v-for="item in financialAccount" :key="item.accountCode" :value="item.accountCode"
                         :label="item.accountName +' ' +item.accountCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="核销日期" prop="date" label-width="90px">
            <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder=""
                            style="width: 270px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="备注" label-width="100px">
            <el-input style="width: 820px" type="textarea" v-model="form.remark" row="3" show-word-limit
                      maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
            <el-button size="small" type="primary" :loading="loading" @click="submitForm">确定</el-button>
            <el-button size="small" type="primary" @click="cancelSubmitForm" plain>取消</el-button>
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
        amountDisabled: false,
        financialAccount: [],
        loading: false,
        form: {
          rowId: '',
          statementId: '',
          date: this.getCurrDate(),
          amount: '',
          remark: '',
          financialAccountName: '',
          financialAccountCode: '',
          financialAccountType: '',
        },
        fillData: {},
        rules: {
          amount: [{
            required: true,
            message: '请输入核销金额',
            trigger: ['blur', 'change']
          }],
          financialAccountCode: [{
            required: true,
            message: '请选择科目',
            trigger: ['blur', 'change']
          }],
          date: [{
            required: true,
            message: '请选择核销日期',
            trigger: ['blur', 'change']
          }],
        }
      }
    },
    created: function () {
      this.form.rowId = this.frow.rowUuid;
      this.form.statementId = this.frow.statement_id;
      this.loadAccount();
      this.initData();
    },
    inject: ['findMadeCoopBillList'],
    methods: {
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
      getFinancialAccount(code) {
        let result = {};
        this.financialAccount.forEach((item) => {
          if (item.accountCode == code) {
            result = item;
            return;
          }
        })
        return result;
      },
      submitForm() {

        this.$refs['form'].validate((valid) => {
          if (valid) {
            let currthis = this
            this.loading = true;
            let item = this.getFinancialAccount(this.form.financialAccountCode);
            this.form.financialAccountName = item.accountName;
            this.form.financialAccountType = item.accountType;
            currthis.$axios.post2('/prm/writeOff/confirm', this.form).then((response) => {
              this.loading = false;
              if (response.data.code == '0') {
                currthis.$notify({
                  title: '成功',
                  message: '核销成功',
                  type: 'success'
                });
                currthis.findMadeCoopBillList();
                currthis.handleClose();
              } else {
                currthis.$notify.error({
                  title: '错误',
                  message: response.data.messageInfo
                });
              }
            }).catch((error) => {
              this.loading = false;
              currthis.$notify.error({
                title: '错误',
                message: error.response.data.messageInfo
              });
            });
          }
        })
			},
      cancelSubmitForm(){
        this.handleClose();
      },
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
      getCurrDate() {
        //获取当前日期
        let date = new Date();
        let months = parseInt(date.getMonth() + 1);
        let days = date.getDate();
        if (months < 10) {
          months = '0' + months
        }
        if (days < 10) {
          days = '0' + days
        }
          let datas = date.getFullYear() + '-' + months + '-' + days + " 00:00:00";
        return datas;
      },
      loadAccount() {
        this.$axios.get("/afbase/financialAccount/listWriteOffAccount")
          .then(function (response) {
            if (response.data.code === 0) {
              this.financialAccount = response.data.data;
              if (this.financialAccount.length > 0) {
                let first = this.financialAccount[0];
                this.form.financialAccountCode = first.accountCode;
                this.form.financialAccountName = first.accountName;
                this.form.financialAccountType = first.accountType;
              }
            } else {
              this.openError(response.messageInfo || '科目加载失败')
            }
          }.bind(this))
          .catch(function (data) {
            console.error(data)
            this.openError("科目数据加载失败")
          }.bind(this))
      },
      initData() {
        let id = this.frow.statement_id;
        this.$axios.get("/prm/writeOff/info/" + id)
          .then(function (response) {
            if (response.data.code == 0) {

              this.fillData = response.data.data;
              if (this.fillData.invoiceAmount === "0.00" || parseInt(this.fillData.invoiceAmount) == 0) {
                this.form.amount = "0.00"
                this.amountDisabled = true
              }
            } else {
              this.openError(response.data.messageInfo || "数据加载失败");
            }
          }.bind(this))
          .catch(function (error) {
            console.error(error);
            this.openError("数据加载异常");
          }.bind(this))
      },
      onlyNumber(prop) {
        this.form[prop] = this.form[prop].replace(/[^0123456789.]/g, "");
        let t = this.form[prop].split('.');
        if (t.length > 1) {
          this.form[prop] = t[0] + "." + t[1].substr(0, 2);
        }
      },
    }
	}
</script>
