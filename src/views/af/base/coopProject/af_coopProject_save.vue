<template>
  <el-dialog title="客户项目——新建"
              width="75%"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      
      <el-row>
        <el-col :span="8">
          <el-form-item label="业务范畴" prop="businessScope" required>
            <el-select v-model="ruleForm.businessScope" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="公司" prop="coopName" required>
              <el-input v-model="ruleForm.coopName" auto-complete="off" style="width:80%" disabled>
              </el-input>
              <el-button type="primary" @click="gotoSelectPage('ruleForm')" >查询</el-button>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="助记码" prop="projectCode" required>
              <el-input v-model="ruleForm.projectCode" auto-complete="off" maxlength="30" style="width:217px">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="项目名称" prop="projectName" required>
              <el-input v-model="ruleForm.projectName" auto-complete="off" maxlength="100">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="海外项目" prop="isOverseas" required>
              <el-select v-model="ruleForm.isOverseas"  placeholder="请选择" >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>               
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司项目" prop="isHeadquarters" required>
              <el-select v-model="ruleForm.isHeadquarters"  placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>               
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务产品" prop="businessProduct" required>
            <el-select v-model="ruleForm.businessProduct" filterable placeholder="请选择">
              <el-option
                v-for="item in productOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="运输条款" prop="transitClause" required>
            <el-select v-model="ruleForm.transitClause" filterable placeholder="请选择">
              <el-option
                v-for="item in transitClauseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款方式" prop="paymentMethod" required>
            <el-select v-model="ruleForm.paymentMethod" filterable placeholder="请选择">
              <el-option
                v-for="item in paymentMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务性质" prop="businessType" required>
            <el-select v-model="ruleForm.businessType" filterable placeholder="请选择">
              <el-option
                v-for="item in businessTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="销项税率" prop="vatOutput">
              <el-input v-model="ruleForm.vatOutput" auto-complete="off" @input="formatToFloat('vatOutput')" style="width:217px">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票类型" prop="invoiceType" required>
            <el-select v-model="ruleForm.invoiceType" filterable placeholder="请选择">
              <el-option
                v-for="item in invoiceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算币种" prop="currencyCode" required>
            <el-select v-model="ruleForm.currencyCode" filterable placeholder="请选择">
              <el-option
                v-for="item in currencyCodeOptions"
                :key="item.currency_code"
                :label="item.currency_code"
                :value="item.currency_code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="责任销售" prop="salesId" required>
            <el-select v-model="ruleForm.salesId" filterable placeholder="请选择" @change="setSalesName">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任客服" prop="servicerId" required>
            <el-select v-model="ruleForm.servicerId" filterable placeholder="请选择" @change="setServicerName">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售经理" prop="salesManagerId" required >
              <el-select v-model="ruleForm.salesManagerId" filterable placeholder="请选择" @change="setManagerName">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="提供货要求" prop="warehouseNote" >
              <el-input v-model="ruleForm.warehouseNote" auto-complete="off" maxlength="200" show-word-limit>
              </el-input>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="制单要求" prop="awbNote" >
              <el-input type="textarea" v-model="ruleForm.awbNote" auto-complete="off" maxlength="500" show-word-limit>
              </el-input>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <save ref="addMission" v-if="save" :visible.sync="save" ></save>
  </el-dialog>
</template>
<script>
import save from './af_coopProject_select'
  export default {
   props: {
      visible: {
        type: Boolean,
        default: false
      },
      frow: Object
    },
    data() {
      var checkNumber2 = (rule, value, callback) => { 
        let regE =/^[1-9]\d{0,7}$/;
        if (!value) {
          callback();
        }
        if (regE.test(value) ) {
          callback();
        }else {
          callback(new Error('整数最大8位'));
        }
      };
      return {
        save: false,
        options:[],
        useroptions:[],
        productOptions:[],
        transitClauseOptions:[],
        paymentMethodOptions:[],
        businessTypeOptions:[],
        invoiceTypeOptions:[],
        currencyCodeOptions:[],
        ruleForm: {
          isStop:0,
          isLock:0,
          businessScope: '',
          coopId:'',
          coopName:'',
          isOverseas:0,
          isHeadquarters:0,
          projectCode:'',
          projectName:'',
          businessProduct:'代理制',
          transitClause:'A2A',
          paymentMethod:'PP',
          businessType:'',
          vatOutput:0,
          invoiceType:'',
          currencyCode:'CNY',
          salesName:'',
          salesId:'',
          servicerName:'',
          servicerId:'',
          salesManagerName:'',
          salesManagerId:'',
          warehouseNote:'',
          awbNote:''
        },
        rules: {
          businessScope: [
            { required: true, message: '请选择业务范畴', trigger: ['blur', 'change']  }
          ],
          isOverseas: [
            { required: true, message: '请选择海外项目', trigger: ['blur', 'change']  }
          ],
          isHeadquarters: [
            { required: true, message: '请选择公司项目', trigger: ['blur', 'change']  }
          ],
          projectCode: [
            { required: true, message: '请输入助记码', trigger: ['blur', 'change']  }
          ],
          projectName: [
            { required: true, message: '请输入项目名称', trigger: ['blur', 'change']  }
          ],
          businessProduct: [
            { required: true, message: '请选择服务产品', trigger: ['blur', 'change']  }
          ],
          transitClause: [
            { required: true, message: '请选择运输条款', trigger: ['blur', 'change']  }
          ],
          paymentMethod: [
            { required: true, message: '请选择付款方式', trigger: ['blur', 'change']  }
          ],
          businessType: [
            { required: true, message: '请选择业务性质', trigger: ['blur', 'change']  }
          ],
          invoiceType: [
            { required: true, message: '请选择开票类型', trigger: ['blur', 'change']  }
          ],
          currencyCode: [
            { required: true, message: '请选择结算币种', trigger: ['blur', 'change']  }
          ],
          vatOutput:[
            { validator: checkNumber2, trigger: ['blur', 'change'] }
          ],
          salesId: [
            { required: true, message: '请选择责任销售', trigger: ['blur', 'change']  }
          ],
          servicerId: [
            { required: true, message: '请选择责任客服', trigger: ['blur', 'change']  }
          ],
          salesManagerId: [
            { required: true, message: '请选择销售经理', trigger: ['blur', 'change']  }
          ]
        }

      };
    },
    components: {
      'save': save
    },
    inject:['queryList'],
    provide() {
      return {
        setValue: this.setValue
      }
    },
    created: function(){
      this.$axios.get('/hrs/dept/selectUser').then(function(response) {
          this.useroptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=业务范畴').then(function(response) {
          this.options=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
          this.productOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=运输条款').then(function(response) {
          this.transitClauseOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=付款方式').then(function(response) {
          this.paymentMethodOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=业务性质').then(function(response) {
          this.businessTypeOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=发票类型').then(function(response) {
          this.invoiceTypeOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
          this.currencyCodeOptions=response.data.data;
       }.bind(this)
      );

    },
    methods: {
      setManagerName(vId){
        let obj = {};
        obj = this.useroptions.find((item)=>{
            return item.value === vId;
        });
        this.ruleForm.salesManagerName=obj.label;
      },
      setServicerName(vId){
        let obj = {};
        obj = this.useroptions.find((item)=>{
            return item.value === vId;
        });
        this.ruleForm.servicerName=obj.label;
      },
      setSalesName(vId){
        let obj = {};
        obj = this.useroptions.find((item)=>{
            return item.value === vId;
        });
        this.ruleForm.salesName=obj.label;
      },
      gotoSelectPage() {
        this.save = true;
      },
      setValue(rrow) {
        this.ruleForm.coopId=rrow.coopIdV;
        this.ruleForm.projectCode=rrow.coopMnemonicV;
        this.ruleForm.projectName=rrow.shortNameV+'- 议价';
        this.ruleForm.coopName=rrow.coopNameV;
        if(rrow.coopTypeV=='海外代理'){
          this.ruleForm.isOverseas=1;
        }else{
          this.ruleForm.isOverseas=0;
        }
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
          message: '操作失败，'+info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.$axios.post2('/afbase/coopProject/doSave', this.ruleForm)
              .then(function(response) {
                
                if(response.data.code==0){
                  
                  this.openSuccess();
                  this.queryList();
                  this.handleClose();                 
                }else{
                  this.openError(response.data.messageInfo);
                }
                
             }.bind(this)
            ).catch(function (error) {
              let errorinfo = error.response.data.messageInfo;
                  //唯一性错误
                  if(errorinfo.indexOf('IDU_coop_project_name')>-1){
                    this.openError('项目名称不可重复');
                  }else{
                    this.openError(errorinfo);
                  }
            }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
       

        

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        // this.$refs.tree.setCheckedKeys([]);
      },
      formatToFloat(item) {
        if(item == 'vatOutput') {
          this.ruleForm.vatOutput = this.ruleForm.vatOutput.replace(/[^123456789.]/g, "");
          var t = this.ruleForm.vatOutput.split('.');
          if(t.length > 1) {
            this.ruleForm.vatOutput = t[0];
          }
        } 
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      }
    }
  }
</script>
<style type="text/css">
</style>
