<template>
  <el-dialog :title="titleName" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" >
    <div class="reportEditPage">
    <el-form :model="ruleForm2" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.expenseReportNum"  disabled style="width:384px;margin-right: 5px;">
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
      <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="uploadOrderFiles" >附件上传</el-button>
      <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="uploadBatchOrderFiles" >批量上传</el-button>
      </el-row>
      <el-row>
      <el-table  :data="dataTwo" border>
      	<el-table-column align="center" label="操作" width="60" type="index" >
      		<template slot-scope="scope">
      			<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
      				<i class="el-icon-s-operation"></i>
      				<el-dropdown-menu slot="dropdown">
      					<el-dropdown-item></el-dropdown-item>
      					<el-dropdown-item command="delete" >删除</el-dropdown-item>
      				</el-dropdown-menu>
      			</el-dropdown>
      		</template>
      	</el-table-column>
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
      <el-row style="margin-top: 15px;">
        <el-button type="primary" v-if="operType!='edit'" size="medium"  @click='save'   style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">暂存</el-button>
        <el-button type="primary" v-if="operType=='edit'" size="medium"  @click="edit('ruleForm')" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">保存</el-button>
        <el-button type="primary"  size="medium"  @click='submit' style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">提交</el-button>
      </el-row>
      <el-row style="margin-top: 10px;"></el-row>
    </el-form>
    <orderFilesSave ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="ffrow"></orderFilesSave>
    <batchOrderFilesSave ref="addMission" v-if="saveBatchVisible" :visible.sync="saveBatchVisible" :frow="ffrow"></batchOrderFilesSave>
  </div>

  </el-dialog>
</template>
<script>
  import OrderFilesSave from './file_save'
  import BatchOrderFilesSave from './batch_file_save'
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
        saveVisible:false,
        saveBatchVisible:false,
        dataTwo:[],
        titleName:'报销单-新增',
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
    components: {
    	'orderFilesSave': OrderFilesSave,
    	'batchOrderFilesSave': BatchOrderFilesSave
    },
    provide() {
    	return {
    		queryFiles: this.queryFiles,
        queryBatchFiles: this.queryBatchFiles,
    	}
    },
    created: function(){
      this.operType = this.frow.operType;
      if(this.operType=='edit'){
        this.titleName = '报销单-编辑';
         //查询数据
         this.$axios.get2('/afbase/cssFinancialExpenseReport/view/'+this.frow.expenseReportId).then((response) => {
         	this.ruleForm2 = response.data.data;
          this.dataTwo = response.data.data.listFiles;
          this.dataTwo.forEach((column, index) => {
             column.index = index;
          });
          this.ruleForm2.listFiles = [];
          this.amountMax();
         }).catch((error) => {
         	console.log(error);
         });
      }else{
        //获取 当前 用户的名称 部门 以及部门负责人
        this.$axios.get2('/afbase/cssFinancialExpenseReport/deptInfo').then((response) => {
          if(response.data.data){
            this.ruleForm2.deptName = response.data.data.dept_name;
            this.ruleForm2.creatorName=response.data.data.user_name;
            this.ruleForm2.approvalDeptManagerName=response.data.data.dept_user_name;
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    },

    methods: {
      queryFiles(p){
        p.index = this.dataTwo.length;
        this.dataTwo.push(p);
        this.ruleForm2.attachedDocument = this.dataTwo.length;
      },
      queryBatchFiles(p){
        p.forEach((column, index) => {
            column.index = this.dataTwo.length;
            this.dataTwo.push(column);
        });
        this.ruleForm2.attachedDocument = this.dataTwo.length;
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
          if(this.ruleForm2.expenseAmount.indexOf(".")>-1){
            let t = this.ruleForm2.expenseAmount.split('.');
            if (t.length > 1) {
            	this.ruleForm2.expenseAmount = t[0] + "." + t[1].substr(0,2);
            }
          }
          this.amountMax();
        }
      },
      edit(formName){
        this.$refs[formName].validate((valid) => {
        	if (valid) {
        		this.loading = true
            if(this.dataTwo&&this.dataTwo.length>0){
               this.ruleForm2.fileStrs = JSON.stringify(this.dataTwo);
            }
        		this.$axios.post2('/afbase/cssFinancialExpenseReport/modify', this.ruleForm2)
        			.then((response) => {
        				if (response.data.code == 0) {
        					this.openSuccess("编辑成功")
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
      submit(){
        this.ruleForm2.expenseReportStatus='已提交';
        if(this.operType=='edit'){
          this.edit('ruleForm');
        }else{
          this.sureSubmit('ruleForm');
        }
      },
      save(){
        this.ruleForm2.expenseReportStatus='已暂存';
        this.sureSubmit('ruleForm');
      },
      sureSubmit(formName){
        this.$refs[formName].validate((valid) => {
        	if (valid) {
            if(this.dataTwo&&this.dataTwo.length>0){
              this.ruleForm2.fileStrs = JSON.stringify(this.dataTwo);
            }
        		this.loading = true
        		this.$axios.post2('/afbase/cssFinancialExpenseReport/doSave', this.ruleForm2)
        			.then((response) => {
        				if (response.data.code == 0) {
        					this.openSuccess("保存成功")
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
       //订单附件
       uploadOrderFiles() {
       	this.saveVisible = true
       },
       uploadBatchOrderFiles() {
       	this.saveBatchVisible = true
       },
       deleteOrderFiles(row) {
       	this.$prompt('您将删除' + row.fileName + '附件,此操作不可恢复 , 是否继续?', '提示', {
       		showInput: false,
       		cancelButtonText: '取消',
       		confirmButtonText: '确定',
       		type: 'warn',
       		center: true
       	}).then(() => {
            this.$delete(this.dataTwo,row.index);
            this.dataTwo.forEach((column, index) => {
               column.index = index;
            });
            this.ruleForm2.attachedDocument = this.dataTwo.length;
            this.openSuccess("删除成功！")
       	}).catch(() => {
       		this.$message({
       			type: 'info',
       			message: '已取消删除'
       		});
       	});
       },
       orderFileView(row) {
      	window.open(row.fileUrl)
      },
      handleChange(command,index) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'delete') {
					this.deleteOrderFiles(this.currRow)
				// } else if (command == 'showFile') {
				// 	this.showFile(this.currRow)
				// } else if (command == 'unShowFile') {
				// 	this.unShowFile(this.currRow)
				}
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
