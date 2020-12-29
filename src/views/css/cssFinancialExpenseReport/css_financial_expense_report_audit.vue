<template>
  <el-dialog title="财务审核" width="457px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" >
    <div class="reportEditPageAudit">
    <el-form :model="ruleForm2" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label=""  prop="financialDate">
            <el-input style="width:375px;margin-right: 5px;">
              <template slot="prepend"><font style="color: red;">*</font>财务月度</template>
              <el-date-picker slot="suffix" style="width: 300px;margin-right: -5px;"  v-model="ruleForm2.financialDate" type="month" value-format="yyyy-MM-01" placeholder="">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
        	<el-form-item label-width="10px" prop="expenseName">
        		<el-input style="width:375px;">
        			<template slot="prepend"><font style="color: red;">*</font>费用科目</template>
        			<el-select slot="suffix" v-model="ruleForm2.expenseName" style="width:306px;margin-right: -5px;" >
        				<el-option v-for="item in oneList" :key="item.paramRanking" @click.native="expenseClick(item)" :label="item.paramText" :value="item.paramText">
        				</el-option>
        			</el-select>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
        	<el-form-item label-width="10px" prop="bankName">
        		<el-input style="width:375px;">
        			<template slot="prepend"><font style="color: red;">*</font>付款科目</template>
        			<el-select slot="suffix" v-model="ruleForm2.bankName" style="width:306px;margin-right: -5px;" >
        				<el-option v-for="item in twoList" :key="item.paramCode" @click.native="bankClick(item)" :label="item.paramText" :value="item.paramText">
        				</el-option>
        			</el-select>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-button type="primary"  size="medium"  @click="submit('ruleForm')" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">审核</el-button>
      </el-row>
      <el-row style="margin-top: 10px;"></el-row>
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
        oneList:[],
        twoList:[],
        ruleForm2: {
         expenseReportIdStr:this.frow.expenseReportIdStr,
         bankName:'',
         expenseName:'',
         bankFinancialAccountName:'',
         expenseFinancialAccountName:'',
         bankFinancialAccountCode:'',
         expenseFinancialAccountCode:'',
         financialDate:'',
         expenseFinancialId:'',
         expenseFinancialType:'',
         bankFinancialId:'',
         bankFinancialType:''
        },
        rules: {
        	financialDate: [{
        		required: true,
        		message: '请选择财务月度',
        		trigger: ['blur', 'change']
        	}],
        	expenseName: [{
        		required: true,
        		message: '请选择费用科目',
        		trigger: ['blur', 'change']
        	}],
          bankName: [{
          	required: true,
          	message: '请选择付款科目',
          	trigger: ['blur', 'change']
          }]
        }
      }
    },
    inject: ['findByPage'],
    created: function(){
      if(this.frow.id){
        this.$axios.get2('/afbase/cssFinancialExpenseReport/subject').then((response) => {
          //费用科目
        	this.oneList = response.data.data.oneList;
          //银行科目
          this.twoList = response.data.data.twoList;
        }).catch((error) => {
        	console.log(error);
        });
        this.$axios.get2('/afbase/cssFinancialExpenseReport/view/'+this.frow.id).then((response) => {
        	this.ruleForm2.bankName = response.data.data.bankFinancialAccountName+" "+response.data.data.bankFinancialAccountCode;
          this.ruleForm2.expenseName = response.data.data.expenseFinancialAccountName+" "+response.data.data.expenseFinancialAccountCode;
          this.ruleForm2.bankFinancialAccountName = response.data.data.bankFinancialAccountName;
          this.ruleForm2.expenseFinancialAccountName = response.data.data.expenseFinancialAccountName;
          this.ruleForm2.bankFinancialAccountCode = response.data.data.bankFinancialAccountCode;
          this.ruleForm2.expenseFinancialAccountCode = response.data.data.expenseFinancialAccountCode;
          this.ruleForm2.expenseFinancialId = response.data.data.expenseFinancialId;
          this.ruleForm2.expenseFinancialType = response.data.data.expenseFinancialType;
          this.ruleForm2.bankFinancialId = response.data.data.bankFinancialId;
          this.ruleForm2.bankFinancialType = response.data.data.bankFinancialType;
          this.ruleForm2.financialDate = response.data.data.financialDate;
        }).catch((error) => {
        	console.log(error);
        });
      }else{
        this.$axios.get2('/afbase/cssFinancialExpenseReport/subject').then((response) => {
          //费用科目
        	this.oneList = response.data.data.oneList;
          //银行科目
          this.twoList = response.data.data.twoList;
          if(this.oneList){
          this.expenseClick(this.oneList[0]);
          }
          if(this.twoList){
          this.bankClick(this.twoList[0]);
          }
        }).catch((error) => {
        	console.log(error);
        });

        this.ruleForm2.financialDate = this.getDateTime();
      }
    },

    methods: {
      getDateTime() {
      	let theDate = new Date()
      	let _year = theDate.getFullYear();
      	let _month = theDate.getMonth();
      	// let _date = theDate.getDate();
      	_month = _month + 1;
      	if (_month < 10) {
      		_month = "0" + _month;
      	}
      	// if (_date < 10) {
      	// 	_date = "0" + _date;
      	// }
      	return _year + "-" + _month+"-01";
      },
      expenseClick(row){
        this.ruleForm2.expenseName = row.paramText;
        this.ruleForm2.expenseFinancialAccountName = row.paramName;
        this.ruleForm2.expenseFinancialAccountCode = row.paramCode;
        this.ruleForm2.expenseFinancialAccountId = row.id;
        this.ruleForm2.expenseFinancialAccountType = row.type;
      },
       bankClick(row){
         this.ruleForm2.bankName =row.paramText;
         this.ruleForm2.bankFinancialAccountName = row.paramName;
         this.ruleForm2.bankFinancialAccountCode = row.paramCode;
         this.ruleForm2.bankFinancialAccountId =  row.id;
         this.ruleForm2.bankFinancialAccountType = row.type;
       },
       submit(formName){
         // this.ruleForm2.financialDate = this.ruleForm2.financialDate+"-01";
         this.$refs[formName].validate((valid) => {
         	if (valid) {
               this.loading = true
               this.$axios.post2('/afbase/cssFinancialExpenseReport/audit', this.ruleForm2)
                .then((response) => {
                  if (response.data.code == 0) {
                    this.openSuccess("审核成功")
                    this.findByPage();
                    this.handleClose()
                  } else {
                    this.openError(response.data.messageInfo)
                  }
                  this.loading = false
                }).catch((error) => {
                  this.openError(error.response.data.messageInfo)
                  this.loading = false
                });
             }
           });
       },

      handleClose() {
      	this.$emit('update:visible', false);
      },
      openError(info) {
      	this.$notify({
      		title: '',
      		message: info,
      		type: 'error',
      		position: 'bottom-right'
      	});
      },
      openSuccess(info) {
      	this.$notify({
      		title: '',
      		message: info,
      		type: 'success',
      		position: 'bottom-right'
      	});
      }

    }
  }
</script>
<style type="text/css">
	.reportEditPageAudit .el-input__icon {
		line-height: 30px !important;
	}

	.reportEditPageAudit .el-form-item__content {
		line-height: 40px !important;
	}

	.reportEditPageAudit .el-input-group__prepend {
		padding: 0 6px;
	}

	.reportEditPageAudit .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.reportEditPageAudit .el-button {
		margin-top: -5px !important
	}
</style>
