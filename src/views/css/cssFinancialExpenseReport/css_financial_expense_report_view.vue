<template>
  <el-dialog :title="titleName" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" >
    <div class="reportEditPage">
    <el-form :model="ruleForm2" :rules="rules" :inline="true" disabled ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.expenseReportNum"   style="width:384px;margin-right: 5px;">
              <template slot="prepend">报销单号</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label=""  prop="expenseReportDate">
            <el-input style="width:302px;margin-right: 5px;">
              <template slot="prepend"><font style="color: red;">*</font>报销日期</template>
              <el-date-picker slot="suffix" style="width: 230px;margin-right: -5px;"  v-model="ruleForm2.expenseReportDate" type="date" value-format="yyyy-MM-dd" placeholder="">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.deptName" disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">申请部门</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.creatorName"  disabled style="width:278px;margin-right: 0px;">
              <template slot="prepend">申请人员</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:385px;margin-right: 5px;">
              <template slot="prepend">付款方式</template>
              <el-radio-group slot="suffix" style="width:300px;margin-top: 8px;" v-model="ruleForm2.paymentMethod">
                  <el-radio label="现金">现金</el-radio>
                  <el-radio label="支票">支票</el-radio>
                  <el-radio label="转账">转账</el-radio>
              </el-radio-group>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:300px;margin-right: 5px;">
              <template slot="prepend">报销性质</template>
              <el-radio-group slot="suffix" style="width:221px;margin-top: 8px;" v-model="ruleForm2.expenseReportMode">
                  <el-radio label="对公">对公</el-radio>
                  <el-radio label="个人">个人</el-radio>
                </el-radio-group>
            </el-input>
          </el-form-item>
        </el-col>


        <el-col class="elementWidth">
          <el-form-item label="" prop="attachedDocument">
            <el-input v-model="ruleForm2.attachedDocument" @input="formatToFloat('attachedDocument')" style="width:253px;">
              <template slot="prepend"><font style="color: red;">*</font>随附单据</template>
              <el-button slot="append" >张</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
        	<el-form-item label-width="10px">
        		<el-input style="width:280px;" v-model="ruleForm2.approvalDeptManagerName" disabled>
        			<template slot="prepend">审批人&emsp;</template>
        			<!-- <el-select slot="suffix" v-model="ruleForm2.approvalDeptManagerId" style="width:214px;margin-right: -5px;" >
        				<el-option v-for="item in orgUserList" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
        				</el-option>
        			</el-select> -->
        		</el-input>
        	</el-form-item>
        </el-col>

      </el-row>
       <el-row>
         <el-col class="elementWidth">
           <el-form-item label="" prop="expenseAmount">
             <el-input v-model="ruleForm2.expenseAmount"  @input="formatToFloat('expenseAmount')" style="width:386px;margin-right: 5px;">
               <template slot="prepend"><font style="color: red;">*</font>报销金额</template>
               <el-button slot="append" >￥</el-button>
             </el-input>
           </el-form-item>
         </el-col>
         <el-col class="elementWidth">
           <el-form-item label="" >
             <el-input v-model="ruleForm2.expenseAmountMax" disabled style="width:854px;margin-right: 5px;">
               <template slot="prepend">人民币大写</template>
             </el-input>
           </el-form-item>
         </el-col>
       </el-row>
        <el-row>
         <el-col class="elementWidth">
           <el-form-item  prop="expensesUse">
             <el-input class="showWordLimit" v-model="ruleForm2.expensesUse" @change="ruleForm2.expensesUse=strTrim(ruleForm2.expensesUse)"  show-word-limit maxlength="200"  clearable auto-complete="off" style="width:1255px;">
               <template slot="prepend"><font style="color: red;">*</font>费用用途</template>
             </el-input>
           </el-form-item>
         </el-col>
       </el-row>
      <el-row>
        <el-col class="elementWidth" style="margin-top: 3px;">
          <el-row>
            <el-button type="text" style="margin-left: 20px;" disabled>报销备注</el-button>
          </el-row>
          <el-row>
            <el-form-item>
              <el-input type="textarea" show-word-limit maxlength="200" v-model="ruleForm2.expenseReportRemark" auto-complete="off" :rows="3" style="width:1253px" >
              </el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
     <el-row>
      </el-row>
      <el-row>
      <el-table  :data="dataTwo" border>
      	<el-table-column prop="fileType" label="附件类型" width="100" align="center"></el-table-column>
      	<!-- <el-table-column prop="createTime" label="上传日期" width="120" align="center"></el-table-column> -->
      	<el-table-column label="文件名称" width="380" align="left" header-align="center">
      		<template slot-scope="scope">
      			<span style="cursor: pointer;" @click="orderFileView(scope.row)">{{scope.row.fileName}}</span>
      		</template>
      	</el-table-column>
      	<el-table-column prop="fileRemark" label="备注" align="left" header-align="center"></el-table-column>
      </el-table>
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
        orgUserList:[],
        dataTwo:[],
        titleName:'报销单-查看',
        ffrow:{},
        operType:'',
        ruleForm2: {
         expenseReportNum:'',
         expenseReportDate:this.getDate(),
         deptName:'',
         creatorName:'',
         attachedDocument:0,
         approvalDeptManagerName:'',
         expenseAmount:'',
         expenseAmountMax:'',
         expensesUse:'',
         expenseReportRemark:'',
         paymentMethod:'现金',
         expenseReportMode:'个人',
         expenseReportStatus:'',
         fileStrs:''
        },
        rules: {
        	expenseReportDate: [{
        		required: true,
        		message: '请选择报销日期',
        		trigger: ['blur', 'change']
        	}],
        	attachedDocument: [{
        		required: true,
        		message: '请填写随附单据',
        		trigger: ['blur', 'change']
        	}],
          expenseAmount: [{
          	required: true,
          	message: '请录入报销金额',
          	trigger: ['blur', 'change']
          }],
          expensesUse: [{
          	required: true,
          	message: '请填写费用用途',
          	trigger: ['blur', 'change']
          }]
        }
      }
    },
    inject: ['findByPage'],
    created: function(){
         //查询数据
         this.$axios.get2('/afbase/cssFinancialExpenseReport/view/'+this.frow.expenseReportId).then((response) => {
         	this.ruleForm2 = response.data.data;
          this.dataTwo = response.data.data.listFiles;
          this.ruleForm2.listFiles = [];
          this.amountMax();
         }).catch((error) => {
         	console.log(error);
         });
    },
    methods: {
      orderFileView(row) {
      	window.open(row.fileUrl)
      },
      getDate(){
        let theDate = new Date()
        let _year = theDate.getFullYear();
        let _month = theDate.getMonth();
        let _date = theDate.getDate();
        _month = _month + 1;
        if (_month < 10) {
        	_month = "0" + _month;
        }
        if (_date < 10) {
        	_date = "0" + _date;
        }
        return _year + "-" + _month+"-"+_date;
      },
      formatToFloat(a){
        if (a== 'attachedDocument') {
        	this.ruleForm2.attachedDocument = this.ruleForm2.attachedDocument.replace(/[^0123456789]/g, "");
        } else {
        	this.ruleForm2.expenseAmount = this.ruleForm2.expenseAmount.replace(/[^0123456789.]/g, "");
          this.amountMax();
        }
      },
      handleClose() {
      	this.$emit('update:visible', false);
      },
      amountMax(){
         this.ruleForm2.expenseAmountMax = this.smallToBig(this.ruleForm2.expenseAmount);
      },
      smallToBig(money) {
            //  将数字金额转换为大写金额
            var cnNums = new Array( "零","壹","贰","叁","肆","伍","陆","柒","捌", "玖");
            var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
            var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
            var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
            var cnInteger = "整"; //整数金额时后面跟的字符
            var cnIntLast = "元"; //整数完以后的单位
            //最大处理的数字
            var maxNum = 999999999999999.9999;
            var integerNum; //金额整数部分
            var decimalNum; //金额小数部分
            //输出的中文金额字符串
            var chineseStr = "";
            var parts; //分离金额后用的数组，预定义
            if (money == "") {
              return "";
            }

            money = parseFloat(money);
            if (money >= maxNum) {
              //超出最大处理数字
              return "超出最大处理数字";
            }
            if (money == 0) {
              chineseStr = cnNums[0] + cnIntLast + cnInteger;
              return chineseStr;
            }

            //四舍五入保留两位小数,转换为字符串
            money = Math.round(money * 100).toString();
            integerNum = money.substr(0, money.length - 2);
            decimalNum = money.substr(money.length - 2);
             // console.log(money);
            //获取整型部分转换
            if (parseInt(integerNum, 10) > 0) {
              var zeroCount = 0;
              var IntLen = integerNum.length;
              for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == "0") {
                  zeroCount++;
                } else {
                  if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                  }
                  //归零
                  zeroCount = 0;
                  chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                  chineseStr += cnIntUnits[q];
                }
              }
              chineseStr += cnIntLast;
            }
            //小数部分
            if (decimalNum != "") {
              var decLen = decimalNum.length;
              for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != "0") {
                  chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
              }
            }
            if (chineseStr == "") {
              chineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (decimalNum == "" || /^0*$/.test(decimalNum)) {
              chineseStr += cnInteger;
            }
            return chineseStr;
          },
    }
  }
</script>
<style type="text/css">
	.reportEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.reportEditPage .el-form-item__content {
		line-height: 40px !important;
	}

	.reportEditPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.reportEditPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.reportEditPage .el-button {
		margin-top: -5px !important
	}
  .reportEditPage .showWordLimit .el-input__inner {
  	padding-right: 80px !important;
  }

  .reportEditPage .showWordLimit .el-textarea__inner {
  	padding-right: 50px;
  }
</style>
