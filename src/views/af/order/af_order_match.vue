<template>
  <el-dialog title="出口订单——单货匹配" width="90%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
      <div>
      <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-row>
          <el-col :span="8">
            <el-form-item label="主单号" prop="awbNumber" >
                <el-input v-model="ruleForm.awbNumber" auto-complete="off" disabled >
                </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="付费重量" prop="awbCostChargeWeight" required>
                <el-input v-model="ruleForm.awbCostChargeWeight" auto-complete="off"  @input="formatToFloat('awbCostChargeWeight')" @change="setPriceValue3">
                </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成本" prop="priceType" required>
                <el-select v-model="ruleForm.priceType"  placeholder="请选择" style="width:90px" @change="setPriceValue3">
                  <el-option label="单价" value="单价"></el-option>
                  <el-option label="总价" value="总价"></el-option>               
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="priceValue" >
                <el-input v-model="ruleForm.priceValue" auto-complete="off" @input="formatToFloat('priceValue')" maxlength="13" style="width:130px" @change="setPriceValue3">
                </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运单来源" prop="awbFromName" >
                <el-input v-model="ruleForm.awbFromName" auto-complete="off" disabled >
                </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主单卖价" prop="priceValue5" >
                <el-input v-model="ruleForm.priceValue5" auto-complete="off" disabled >
                </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主单成本" prop="priceValue3" >
                <el-input v-model="ruleForm.priceValue3" auto-complete="off" disabled style="width:235px">
                </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="data1" >
        <el-table-column type="expand" fixed width="40">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="件数（预/实）:">
                    <span>{{ props.row.planPieces+"/"+props.row.confirmPieces }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="毛重（预/实）:">
                    <span>{{ props.row.planWeight+"/"+props.row.confirmWeight }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="体积（预/实）:">
                    <span>{{ props.row.planVolume +"/"+props.row.confirmVolume}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="计费重量（预/实）:">
                    <span>{{ props.row.planChargeWeight+"/"+props.row.confirmChargeWeight }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="orderCode" label="订单号" width="150px"></el-table-column>
        <el-table-column align="center" prop="coopName" label="客户名称" ></el-table-column>
      <el-table-column align="center" label="收费重量" width="150px">
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.incomeChargeWeight" @input="formatToFloat2('incomeChargeWeight',scope.row)" maxlength="13" @change="setData3"></el-input>
          </template>
      </el-table-column>
      <el-table-column align="center" label="卖价类型" width="100px">
          <template slot-scope="scope">
              <el-select v-model="scope.row.priceType2"  placeholder="请选择" style="width:90px" @change="setData3">
                  <el-option label="单价" value="单价"></el-option>
                  <el-option label="总价" value="总价"></el-option>               
              </el-select>
          </template>
      </el-table-column>
      <el-table-column align="center" label="币种" width="100px">
          <template slot-scope="scope">
              <el-select v-model="scope.row.currecnyCode" filterable placeholder="选择" @change="setIncomeExchangeRate(scope.row)">
                <el-option
                  v-for="item in currencyCodeOptions"
                  :key="item.currency_code"
                  :label="item.currency_code"
                  :value="item.currency_code">
                </el-option>
              </el-select>
          </template>
      </el-table-column>
       <el-table-column align="center" label="卖价" width="150px">
          <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.priceValue2" @input="formatToFloat2('priceValue2',scope.row)" maxlength="13" @change="setData3"></el-input>
          </template>
      </el-table-column>
     <el-table-column align="center" prop="priceValue4" label="卖价合计（本币）" ></el-table-column>
        
      </el-table>
      
      <div align="center">   
        <el-button type="primary" size="medium" @click="doOrderMatch('ruleForm')">确定</el-button>
        <el-button type="primary" size="medium" v-on:click="handleClose" >取消</el-button>
      </div>
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
        ruleForm: {
          awbNumber:'',
          awbFromName: '',
          awbCostChargeWeight:'',
          priceType:'单价',
          priceValue:'',
          priceValue3:'',
          awbMsrUnitprice:'',
          awbMsrAmount:'',
        },
        rules: {
          awbCostChargeWeight: [
            { required: true, message: '请输入付费重量', trigger: ['blur', 'change'] }
          ],
          priceType: [
            { required: true, message: '请选择成本类型', trigger: ['blur', 'change'] }
          ],
          priceValue: [
            { required: true, message: '请输入成本', trigger: ['blur', 'change'] }
          ],
        },
        data1: [],
        currencyCodeOptions:[],
        ffrow:{
          coopFlag:''
        },

      }
    },
 
    inject:['findByPage'],

    created: function(){

      this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
      this.currencyCodeOptions=response.data.data;
      // this.data1[0].incomeCurrency='CNY';
       }.bind(this)
      );
      // this.queryList();
      this.$axios.get('/afbase/aforder/getOrderMatch/' + this.frow.awbUuid)
      .then(function(response) {
        this.ruleForm = response.data.data;
        this.data1=response.data.data.orders;
        this.setData();
        this.setData2();
        this.setData3();
      }.bind(this));
    },

    methods: {
      setIncomeExchangeRate(row){
        let obj = {};
        obj = this.currencyCodeOptions.find((item)=>{
            return item.currency_code === row.currecnyCode;
        });
        row.currencyRate=obj.currency_rate;
        this.setData3();
      },
      setPriceValue3(){
        if (this.ruleForm.priceValue==='' ||this.ruleForm.priceValue==null||this.ruleForm.awbCostChargeWeight==='' ||this.ruleForm.awbCostChargeWeight==null) {
          return;
        }
        if (this.ruleForm.priceType=='单价') {
          this.ruleForm.priceValue3=(this.ruleForm.priceValue*this.ruleForm.awbCostChargeWeight).toFixed(2);
        }else{
          this.ruleForm.priceValue3=this.ruleForm.priceValue;
        }
      },
      setData2(){
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].confirmChargeWeight===''||this.data1[i].confirmChargeWeight==null) { 
          }else{
            if (this.ruleForm.awbCostChargeWeight===''||this.ruleForm.awbCostChargeWeight==null) {
              this.ruleForm.awbCostChargeWeight=this.data1[i].confirmChargeWeight;
            }else{
              this.ruleForm.awbCostChargeWeight=this.ruleForm.awbCostChargeWeight+this.data1[i].confirmChargeWeight;
            }   
          }
        } 
      },
      setData3(){       
        let priceValue5=0;
        for (var i = 0; i < this.data1.length; i++) {
          let currencyRate=this.data1[i].currencyRate;
          if (currencyRate===''||currencyRate==null) {
            currencyRate=0;
            this.data1[i].currecnyCode='';
          }
          if (this.data1[i].priceType2=='单价') {
            this.data1[i].priceValue4=(currencyRate*this.data1[i].incomeChargeWeight*this.data1[i].priceValue2).toFixed(2);
          }else{
            this.data1[i].priceValue4=(1*currencyRate*this.data1[i].priceValue2).toFixed(2);
          }
          priceValue5=parseFloat(priceValue5)+parseFloat(this.data1[i].priceValue4);
        } 
        this.ruleForm.priceValue5=priceValue5.toFixed(2);
      },
      setData(){
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].incomeChargeWeight===''||this.data1[i].incomeChargeWeight==null) {
            this.data1[i].incomeChargeWeight=this.data1[i].confirmChargeWeight
          }

          if (this.data1[i].freightUnitprice) {
            this.data1[i].priceType2="单价";
            this.data1[i].priceValue2=this.data1[i].freightUnitprice;
          }else{
            this.data1[i].priceType2="总价";
            this.data1[i].priceValue2=this.data1[i].freightAmount;
          }
        }

      },
      doOrderMatch(formName){
        let doFlag=0;
        let doFlag2=0;
        let orderCode="";
        for (var i = 0; i < this.data1.length; i++) {
          if (this.data1[i].incomeChargeWeight===''||this.data1[i].incomeChargeWeight==null ||
            this.data1[i].currecnyCode===''||this.data1[i].currecnyCode==null ||
            this.data1[i].priceValue2===''||this.data1[i].priceValue2==null
            
            ) {
            doFlag=1;
            orderCode=this.data1[i].orderCode;
            break;
          }
          if (this.data1[i].confirmPieces===''||this.data1[i].confirmPieces==null) {
            doFlag2=2;
            orderCode=this.data1[i].orderCode;
            break;
          }
        }
        if (doFlag==1) {
          this.openError("订单号"+orderCode+"，录入项必须填全");
          return;
        }
        if (doFlag2==2) {
          this.openError("订单号"+orderCode+"，未出重");
          return;
        }
          this.$refs[formName].validate((valid) => {
          if (valid) { 
            // if (this.ruleForm.priceType=='单价') {
            //   this.ruleForm.freightUnitprice=this.ruleForm.priceValue;
            // }else{
            //   this.ruleForm.freightAmount=this.ruleForm.priceValue;
            // }
            if (this.ruleForm.priceType=='单价') {
              this.ruleForm.awbMsrUnitprice=this.ruleForm.priceValue;
            }else{
              this.ruleForm.awbMsrAmount=this.ruleForm.priceValue;
            }
            this.ruleForm.orders=this.data1;
            this.$axios.post2('/afbase/aforder/doOrderMatch', this.ruleForm)
              .then(function(response) {
                
                if(response.data.code==0){
                  
                  this.openSuccess();
                  this.findByPage();
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
      
      formatToFloat(item) {
        if(item == 'awbCostChargeWeight') {
          this.ruleForm.awbCostChargeWeight = this.ruleForm.awbCostChargeWeight.replace(/[^0123456789.]/g, "");
          let t = this.ruleForm.awbCostChargeWeight.split('.');
          if(t.length > 1) {
            this.ruleForm.awbCostChargeWeight = t[0] + "." + t[1].substr(0, 1);
          }
        }else if(item == 'priceValue') {
          // this.$forceUpdate();
          this.ruleForm.priceValue = this.ruleForm.priceValue.replace(/[^0123456789.]/g, "");
          let t = this.ruleForm.priceValue.split('.');
          if(t.length > 1) {
            this.ruleForm.priceValue = t[0] + "." + t[1].substr(0, 2);
          }
        }
      },
      formatToFloat2(item,row) {
        if(item == 'incomeChargeWeight') {
          row[item] = row[item].replace(/[^0123456789.]/g, "");
          let t = row[item].split('.');
          if(t.length > 1) {
            row[item] = t[0] + "." + t[1].substr(0, 1);
          }
        }else if(item == 'priceValue2') {
          // this.$forceUpdate();
          row[item] = row[item].replace(/[^0123456789.]/g, "");
          let t = row[item].split('.');
          if(t.length > 1) {
            row[item] = t[0] + "." + t[1].substr(0, 2);
          }
        }
      },
      

  handleClose() {
    this.$emit('update:visible', false);
  }

//--------------------- 

    }
  }
</script>