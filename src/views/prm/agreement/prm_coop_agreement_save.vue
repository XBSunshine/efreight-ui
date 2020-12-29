<template>
  <el-dialog title="客户协议 - 新增" width="650px"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="客户名称" prop="coop_id" required label-width="85px">
            <el-select v-model="ruleForm.coop_id" filterable placeholder="" @change="changeValue" style="width: 270px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="合同类型" prop="agreement_type" required label-width="95px">
              <el-select v-model="ruleForm.agreement_type" placeholder="" @change="selectChange" style="width: 118px;">
                <el-option label="商务合作类" value="商务合作类"></el-option>
                <el-option label="人力行政类" value="人力行政类"></el-option>
                <el-option label="IT研发类" value="IT研发类"></el-option>
                <el-option label="财务管理类" value="财务管理类"></el-option>
                <el-option label="法务审计类" value="法务审计类"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="业务范畴" prop="business_scope" required v-if=showFlag label-width="85px">
            <el-input v-model="ruleForm.business_scope" auto-complete="off" v-show="false"></el-input>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="合同模板" prop="template" required label-width="85px">
              <el-select v-model="ruleForm.template" placeholder="" style="width: 150px;">
                <el-option label="制式模板" value="制式模板"></el-option>
                <el-option label="我方模板" value="我方模板"></el-option>
                <el-option label="对方模板" value="对方模板"></el-option>
                <el-option label="特殊审批" value="特殊审批"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="合同编号" prop="serial_number" required label-width="185px">
              <el-input v-model="ruleForm.serial_number" @change="ruleForm.serial_number=strTrim(ruleForm.serial_number)" auto-complete="off" style="width: 150px;">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="开始日期" prop="begin_date" required label-width="85px">
            <el-date-picker v-model="ruleForm.begin_date"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 150px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="截止日期" prop="end_date" required label-width="185px">
              <el-date-picker v-model="ruleForm.end_date"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 150px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="结算周期" prop="settlement_period" required label-width="85px">
            <el-select v-model="ruleForm.settlement_period" placeholder="" style="width: 150px;">
              <el-option label="预付" value="预付"></el-option>
              <el-option label="现结" value="现结"></el-option>
              <el-option label="票结" value="票结"></el-option>
              <el-option label="月结" value="月结"></el-option>
              <el-option label="季结" value="季结"></el-option>
              <el-option label="年结" value="年结"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="经办人" prop="incharge_id" required label-width="185px">
            <el-select v-model="ruleForm.incharge_id" filterable placeholder="" style="width: 150px;">
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
        <el-col class="elementWidth">
          <el-form-item label="账期标准" prop="payment_standard" label-width="85px">
            <el-select v-model="ruleForm.payment_standard" placeholder="" style="width: 150px;">
              <el-option label="业务日期" value="业务日期"></el-option>
              <el-option label="账单日期" value="账单日期"></el-option>
              <el-option label="发票日期" value="发票日期"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="结算周期备注" prop="settlement_remark" label-width="185px">
              <el-input v-model="ruleForm.settlement_remark" @change="ruleForm.settlement_remark=strTrim(ruleForm.settlement_remark)" auto-complete="off" style="width: 150px;">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="合同账期" prop="payment_period" label-width="85px">
              <el-input v-model="ruleForm.payment_period" @change="ruleForm.payment_period=strTrim(ruleForm.payment_period)" auto-complete="off" style="width: 150px;">
              </el-input>(天)
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="合同额度" prop="total_amount" label-width="163px">
              <el-input v-model="ruleForm.total_amount" auto-complete="off" style="width: 150px;">
              </el-input>(万元)
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="合同备注" prop="agreement_remark" label-width="85px">
              <el-input v-model="ruleForm.agreement_remark" @change="ruleForm.agreement_remark=strTrim(ruleForm.agreement_remark)" auto-complete="off" style="width: 487px;">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 15px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag2">立即创建</el-button>
          <el-button size="small" type="primary" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
  // const cityOptions = ['EF','AE','AI','SE','SI','TE','TI'];
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var checkNumber = (rule, value, callback) => {
        let regE =/^[0-9]\d{0,7}$/;
        let regE2=/^\d{1,8}([\.]\d{0,2})$/
        if (regE.test(value) || regE2.test(value)) {
          callback();
        }else {
          callback(new Error('整数最大8位，小数最大2位'));
        }
      };
      var checkNumber2 = (rule, value, callback) => {
        let regE =/^[0-9]\d{0,7}$/;
        if (regE.test(value) || value == '' || value == null) {
          callback();
        }else {
          callback(new Error('整数最大8位'));
        }
      };
      return {
        disabledFlag2: false,
        ruleForm: {
          coop_id: '',
          coop_name: '',
          agreement_type: '',
          template: '我方模板',
          serial_number: '',
          begin_date: '',
          end_date: '',
          incharge_id: '',
          business_scope: '',
          settlement_period: '',
          settlement_remark: '',
          signing_dept_id: '0',
          payment_standard: '',
          payment_period: '',
          total_amount: '',
          agreement_remark: ''
        },
        pickerOptions0: {
           disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
           }
         },
        rules: {
          coop_id: [
            { required: true, message: '请选择合同伙伴', trigger: ['blur', 'change'] }
          ],
          agreement_type: [
            { required: true, message: '请选择合同类型', trigger: ['blur', 'change'] },
            { min: 1, max: 20, message: '长度不超过 20', trigger: ['blur', 'change'] }
          ],
          template: [
            { required: true, message: '请选择合同模板', trigger: ['blur', 'change'] },
            { min: 1, max: 20, message: '长度不超过 20', trigger: ['blur', 'change'] }
          ],
          settlement_period: [
            { required: true, message: '请选择结算周期', trigger: ['blur', 'change'] },
            { min: 1, max: 20, message: '长度不超过 20', trigger: ['blur', 'change'] }
          ],
          payment_standard: [
            { message: '请选择账期标准', trigger: ['blur', 'change'] },
            { min: 1, max: 40, message: '长度不超过 40', trigger: ['blur', 'change'] }
          ],
          business_scope: [
            { required: true, message: '请选择业务范畴', trigger: ['blur', 'change'] },
            { min: 1, max: 20, message: '长度不超过 20', trigger: ['blur', 'change'] }
          ],
          serial_number: [
            { required: true, message: '请输入合同编号', trigger: ['blur', 'change'] },
            { min: 1, max: 40, message: '长度不超过 40', trigger: ['blur', 'change'] }
          ],
          begin_date: [
            { required: true, message: '请输入开始日期', trigger: ['blur', 'change'] }
          ],
          end_date: [
            { required: true, message: '请输入截止日期', trigger: ['blur', 'change'] }
          ],
          incharge_id: [
            { required: true, message: '请输入经办人', trigger: ['blur', 'change'] },
            { type: 'number', message: '必须为数字值', trigger: ['blur', 'change']}
          ],
          settlement_remark: [
//          { required: true, message: '请输入结算周期备注', trigger: ['blur', 'change'] },
            { min: 0, max: 200, message: '长度不超过 200', trigger: ['blur', 'change'] }
          ],
          payment_period: [
            { message: '请输入合同账期', trigger: ['blur', 'change'] },
            { validator: checkNumber2, trigger: ['blur', 'change'] }
          ],
          total_amount: [
            { message: '请输入合同额度', trigger: ['blur', 'change'] },
            { validator: checkNumber2, trigger: ['blur', 'change'] }
          ],
          agreement_remark: [
//          { required: true, message: '请输入合同备注', trigger: ['blur', 'change'] },
            {max: 200, message: '长度不超过 200', trigger: ['blur', 'change'] }
          ]
          // ,
          // signing_dept_id: [
          //   { required: true, message: '请输入签约主体', trigger: ['blur', 'change'] },
          //   { type: 'number', message: '必须为数字值', trigger: ['blur', 'change']}
          // ]
        },
        showFlag: false,
        checkAll: false,
        checkedCities: [],
        cities: [],
        isIndeterminate: false,
        options:[],
        useroptions:[]
        // ,
        // deptoptions:[]
      };
    },
    inject:['findByPage'],
    methods: {
      selectChange(){
        this.checkedCities=[];
        if (this.ruleForm.agreement_type=="商务合作类") {
          this.showFlag=true;
          if (window.localStorage.getItem("orgCode").toUpperCase()=="EFTBJS") {
                this.checkedCities=['EF'];
                this.ruleForm.business_scope=this.checkedCities.toString();
          }
        }else{
          this.showFlag=false;
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
      changeValue(value) {
          let obj = {};
          obj = this.options.find((item)=>{
              return item.value === value;
          });
          this.ruleForm.coop_name=obj.label;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.begin_date>this.ruleForm.end_date) {
              this.openError('截止日期不能小于开始日期');
              return;
            }
            this.disabledFlag2 = true;
            let params=this.ruleForm;
            this.$axios.post('/prm/coopagreement/doSave', params)
              .then(function(response) {
                if(response.data.code==200){
                  this.openSuccess();
                  this.findByPage();
                  this.handleClose();
                }else{
                  let errorinfo = response.data.messageInfo;
                  if(errorinfo.indexOf('IDU_prm_serial_number')>-1){
                      this.openError('合同编号不可重复');
                      this.disabledFlag2 = false;
                  } else{
                      this.openError(response.data.messageInfo);
                      this.disabledFlag2 = false;
                  }
                }
             }.bind(this)
            );
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.checkedCities=[];
        this.$refs[formName].resetFields();
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.cities : [];
        this.ruleForm.business_scope=this.checkedCities.toString();
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        this.ruleForm.business_scope=this.checkedCities.toString();
      }
    },
    mounted: function () {
      if (window.localStorage.getItem("orgCode").toUpperCase()=="EFTBJS") {
        this.cities=['EF','AE','AI','SE','SI','TE','TI'];
      }else{
        this.cities=['AE','AI','SE','SI','TE','TI'];
      }
    },
    created(){
      this.$axios.post('/prm/coopagreement/queryListForChoose')
      .then(function(response) {
          this.options=response.data.data.dataList;
       }.bind(this)
      );
      this.$axios.get('/hrs/dept/selectUser')
      .then(function(response) {
          this.useroptions=response.data.data;
       }.bind(this)
      );
      //
      // this.$axios.post('/prm/coopagreement/selectUser')
      // .then(function(response) {
      //     this.useroptions=response.data.data.dataList;
      //  }.bind(this)
      // );
      //
      // this.$axios.post('/prm/coopagreement/selectDept')
      // .then(function(response) {
      //     this.deptoptions=response.data.data.dataList;
      //  }.bind(this)
      // );
    }
  }
</script>
<style type="text/css">
</style>
