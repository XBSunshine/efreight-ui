<template>
  <el-dialog title="发票-开票申请" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" >
    <div class="open_invoice">
    <el-form :model="ruleForm2" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
        	<el-form-item>
        		<el-input auto-complete="off" disabled style="width:760px" v-model="customerName">
        			<template slot="prepend">收款客户</template>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth show1">
          <el-form-item label=""  prop="invoiceTitle">
            <el-input style="width:760px;margin-right: 5px;" v-model="ruleForm2.invoiceTitle" maxlength="200"  clearable show-word-limit auto-complete="off">
              <template slot="prepend"><font style="color: red;">*</font>发票抬头</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth show1">
          <el-form-item label=""  prop="taxpayerNum">
            <el-input style="width:468px;margin-right: 5px;" maxlength="30" v-model="ruleForm2.taxpayerNum" clearable show-word-limit auto-complete="off">
              <template slot="prepend">纳税人识别码</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
        	<el-form-item label-width="10px" prop="invoiceType">
        		<el-input style="width:276px;">
        			<template slot="prepend"><font style="color: red;">*</font>开票类型</template>
        			<el-select slot="suffix" v-model="ruleForm2.invoiceType"  style="width:205px;margin-right: -5px;" >
        				<el-option v-for="item in oneList" :key="item.param_text" :label="item.param_text" :value="item.param_text">
        				</el-option>
        			</el-select>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth show1">
          <el-form-item label=""  prop="address">
            <el-input style="width:468px;margin-right: 5px;" maxlength="100" v-model="ruleForm2.address" clearable show-word-limit auto-complete="off">
              <template slot="prepend">地址</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth show1">
        	<el-form-item label-width="10px" prop="phoneNumber">
        		<el-input style="width:276px;" clearable maxlength="50"  v-model="ruleForm2.phoneNumber" show-word-limit auto-complete="off">
        			<template slot="prepend">电话</template>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth show1">
          <el-form-item label=""  prop="bankName">
            <el-input style="width:372px;margin-right: 5px;" maxlength="100" v-model="ruleForm2.bankName" clearable show-word-limit auto-complete="off">
              <template slot="prepend">开户行</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth show1">
        	<el-form-item label-width="10px" prop="bankNumber">
        		<el-input style="width:372px;" clearable maxlength="50" v-model="ruleForm2.bankNumber" show-word-limit auto-complete="off">
        			<template slot="prepend">银行账号</template>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth show1" style="margin-top: 1px;">
          <el-row>
            <el-button type="text" style="margin-left: 20px;" disabled>开票要求</el-button>
          </el-row>
          <el-row>
            <el-form-item>
              <el-input type="textarea" show-word-limit maxlength="500" v-model="ruleForm2.applyRemark" auto-complete="off" :rows="3" style="width:760px" >
              </el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-button type="primary"  size="small"  @click="submit('ruleForm')" >确定</el-button>
        <el-button type="primary"  size="small"  @click="submitTwo('ruleForm')" >确定并打印申请单</el-button>
        <el-button type="primary"  size="small"  @click="cancel()" >取消</el-button>
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
        customerName:'',
        ruleForm2: {
         invoiceTitle:'',
         taxpayerNum:'',
         invoiceType:'',
         address:'',
         phoneNumber:'',
         bankName:'',
         bankNumber:'',
         applyRemark:'',
         type:'',
         debitNoteId:'',
         statementId:'',
         checkRowUuid:''
        },
        rules: {
        	invoiceTitle: [{
        		required: true,
        		message: '请填写发票抬头',
        		trigger: ['blur', 'change']
        	}],
          invoiceType: [{
          	required: true,
          	message: '请选择发票类型',
          	trigger: ['blur', 'change']
          }]

        }
      }
    },
    inject: ['queryList'],
    created: function(){
      //判断当前 账单/清单是否有 一个币种
      if(this.frow.currencyStr){
        if(this.frow.currencyStr.indexOf(',')<0 && this.frow.currencyStr==='CNY'){
          this.ruleForm2.invoiceType = '增值税普票';
        }
        if(this.frow.currencyStr.indexOf(',')<0&&this.frow.currencyStr!=='CNY'){
           this.ruleForm2.invoiceType = 'DebitNote';
        }
      }
      if(this.frow.invoiceType=='debitNote'){
         this.ruleForm2.debitNoteId = this.frow.debitNoteId;
      }else{
        this.ruleForm2.statementId = this.frow.statementId;
      }
      this.ruleForm2.invoiceTitle = this.frow.customerName;
      this.customerName = this.frow.customerName;
      this.ruleForm2.taxpayerNum = this.frow.socialCreditCode;
      this.ruleForm2.address = this.frow.coopAddress;
      this.ruleForm2.bankName = this.frow.bankName;
      this.ruleForm2.bankNumber = this.frow.bankNumber;
      this.ruleForm2.phoneNumber = this.frow.phoneNumber;
      this.ruleForm2.type = this.frow.invoiceType;
      this.ruleForm2.checkRowUuid = this.frow.rowUuid;
      this.ruleForm2.applyRemark = this.frow.applyRemark;
      this.$axios.get2('/afbase/vAfCategory/invoiceType').then((response) => {
        //发票类型
        this.oneList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },

    methods: {
       submit(formName){
         this.$refs[formName].validate((valid) => {
         	if (valid) {
               this.loading = true
               this.$axios.post2('/afbase/cssIncomeInvoice/doSave', this.ruleForm2)
                .then((response) => {
                  if (response.data.code == 0) {
                    this.openSuccess("开票成功")
                    this.queryList();
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
      submitTwo(){
        this.openError("功能暂未开发，敬请期待");
      },
      cancel(){
         this.handleClose();
      },
      handleClose() {
      	this.$emit('update:visible', false);
        this.queryList();
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
	.open_invoice .el-input__icon {
		line-height: 30px !important;
	}

	.open_invoice .el-form-item__content {
		line-height: 40px !important;
	}

	.open_invoice .el-input-group__prepend {
		padding: 0 6px;
	}
  .open_invoice .show1 .el-input__inner {
  	padding-right: 65px;
  }

	.open_invoice .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.open_invoice .el-button {
		margin-top: -5px !important
	}
</style>
