<template>
  <el-dialog title="铁路产品 - 编辑" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
    <div class="tc_product_save">
      <el-form v-loading="vLoad" :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="10px" style="margin-right: 10px;">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="productType" label-width="10px">
              <el-input class="" auto-complete="off" style="width:256px;">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>产品类型</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.productType" placeholder="请选择" style="width:150px;margin-right: -5px;">
                      <el-option  v-for="item in productTypes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="productName">
              <el-input v-model="ruleForm.productName" clearable show-word-limit maxlength="100" >
                <template slot="prepend"> <font style="color:red">*</font>产品名称</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="productType" label-width="10px">
              <el-input class="" auto-complete="off" style="width:256px;">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>装箱方式</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.containerMethod" placeholder="请选择" style="width:150px;margin-right: -5px;">
                      <el-option  v-for="item in containerMethods" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
           	<el-form-item prop="bookingAgentName">
           		<el-input class="widthWithFourWithXing" readOnly v-model="ruleForm.bookingAgentName" >
           			<template slot="prepend">
           				<!-- <font style="color: red;">*</font>  booking_agent_id -->
           				<span>订舱代理</span>
           			</template>
                <!--  -->
           			<el-button slot="append" style="color:#009CE6" icon="el-icon-search" @click="selectCustomer">查询</el-button>
           		</el-input>
           	</el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="departureStation">
              <el-input v-model="ruleForm.departureStation"  clearable show-word-limit  @input="ruleForm.departureStation=ruleForm.departureStation.toUpperCase()"    maxlength="20" >
                <template slot="prepend">起运地</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="exitPort">
              <el-input v-model="ruleForm.exitPort"  @input="ruleForm.exitPort=ruleForm.exitPort.toUpperCase()"  clearable show-word-limit maxlength="20">
                <template slot="prepend">出境口岸</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="transitStation">
              <el-input v-model="ruleForm.transitStation" @input="ruleForm.transitStation=ruleForm.transitStation.toUpperCase()" clearable show-word-limit maxlength="20" >
                <template slot="prepend">中转地</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="arrivalStation">
              <el-input v-model="ruleForm.arrivalStation" @input="ruleForm.arrivalStation=ruleForm.arrivalStation.toUpperCase()" clearable show-word-limit maxlength="20" >
                <template slot="prepend">目的地</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <el-form-item label="" prop="freightPrice">
              <el-input v-model="ruleForm.freightPrice" @input="formatToFloat('freightPrice')"  auto-complete="off" style="width:302px;">
                <template slot="prepend">默认卖价</template>
                <el-select slot="append" v-model="ruleForm.freightCurrecnyCode" filterable placeholder="请选择" style="width:80px">
                  <el-option v-for="item in currecnyCodes" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="freightType" label-width="10px">
              <el-input class="" auto-complete="off" style="width:214px;">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>卖价形式</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.freightType" placeholder="请选择" style="width:112px;margin-right: -5px;">
                      <el-option  label="单价" value="单价"></el-option>
                      <el-option  label="总价" value="总价"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" prop="msrPrice">
              <el-input v-model="ruleForm.msrPrice"   @input="formatToFloat('msrPrice')" auto-complete="off" style="width:302px;">
                <template slot="prepend">默认成本</template>
                <el-select slot="append" v-model="ruleForm.msrCurrecnyCode" filterable placeholder="请选择" style="width:80px">
                  <el-option v-for="item in currecnyCodes" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="msrType" label-width="10px">
              <el-input class="" auto-complete="off" style="width:214px;">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>成本形式</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.msrType" placeholder="请选择" style="width:112px;margin-right: -5px;">
                      <el-option  label="单价" value="单价"></el-option>
                      <el-option  label="总价" value="总价"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="transitDays">
              <el-input v-model="ruleForm.transitDays" show-word-limit  @input="formatToInt('transitDays')" >
                <!-- @input="toUpperCase('routingName', ruleForm.routingName)" -->
                <template slot="prepend">转运天数</template>
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="productRemark">
              <el-input v-model="ruleForm.productRemark" show-word-limit maxlength="500">
                <!-- @input="toUpperCase('routingName', ruleForm.routingName)" -->
                <template slot="prepend">备注信息</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :loading="loading" size="small" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
      <customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="ffrow"></customerSelect>
    </div>
  </el-dialog>
</template>

<script>
  import CustomerSelect from '@/views/public/customer_select'
    export default {
      props: {
        visible: {
          type: Boolean,
          default: false
        },
        frow: Object
      },
      inject: ["queryList"],
      data(){
        return {
          vLoad: false,
          loading: false,
          productTypes:[],
          currecnyCodes:[],
          containerMethods:[],
          customerSelectVisible:false,
          ffrow:{},
          ruleForm: {
            productId:'',
            businessScope:'',
            productType: '',
            productName: '',
            bookingAgentId: '',
            bookingAgentName: '',
            freightPrice: '',
            freightType: '单价',
            freightCurrecnyCode: 'CNY',
            msrPrice: '',
            msrType: '单价',
            msrCurrecnyCode: 'CNY',
            arrivalStation: '',
            departureStation: '',
            exitPport: '',
            transitStation:'',
            transitDays:'',
            productRemark:'',
            containerMethod:''
          },
          rules: {
            productType: [
              { required: true, message: '请选择产品类型', trigger: 'blur' }
            ],
            productName: [
              { required: true, message: '请输入产品名称', trigger: 'blur' },
              {  max: 100, message: '最大100字符', trigger: 'blur' }
            ],
            containerMethod: [
              { required: true, message: '请选择装箱方式', trigger: 'blur' }
            ]

          }
        }
      },
      provide() {
      	return {
      		setValue: this.setValue
      	}
      },
      components: {
      	'customerSelect': CustomerSelect
      },
      methods: {
        formatToFloat(item) {
          if (item == 'msrPrice') {
            this.ruleForm.msrPrice = this.ruleForm.msrPrice.replace(/[^0123456789.]/g, "");
            let t = this.ruleForm.msrPrice.split('.');
            if (t.length > 1) {
              this.ruleForm.msrPrice = t[0] + "." + t[1].substr(0, 2);
            }
          }else{
            this.ruleForm.freightPrice = this.ruleForm.freightPrice.replace(/[^0123456789.]/g, "");
            let t = this.ruleForm.freightPrice.split('.');
            if (t.length > 1) {
              this.ruleForm.freightPrice = t[0] + "." + t[1].substr(0, 2);
            }
          }

         },
         formatToInt(item){
           this.ruleForm.transitDays = this.ruleForm.transitDays.replace(/[^0-9]/g,'');
           let  flag = new RegExp("^[1-9]([0-9])*$").test(this.ruleForm.transitDays);
            if(!flag){
               this.ruleForm.transitDays = '';
            }
         },
        setValue(row){
          this.ruleForm.bookingAgentId = row.coopId;
          this.ruleForm.bookingAgentName = row.coopName;
        },
        selectCustomer() {
        	this.ffrow.businessScope = this.frow.businessScope;
        	this.customerSelectVisible = true
        },
        handleClose(){
          this.$emit('update:visible', false);
        },
        openError(info) {
          this.$notify({
            title: '',
            message: '操作失败，' + info,
            type: 'error',
            position: 'bottom-right'
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
        submitForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.loading = true;
              this.$axios.post2("/sc/tcProduct/modify", this.ruleForm)
                .then(function(response){
                  if(response.data.code == 0){
                    this.queryList();
                    this.openSuccess();
                    this.$emit('update:visible', false);
                  }else{
                    this.loading = false;
                    this.openError(response.data.messageInfo || '操作失败');
                  }
                }.bind(this))
                .catch(function(error){
                  this.loading = false;
                  this.openError(error)
                }.bind(this))

            } else {
              return false;
            }
          });
        }

      },
      created() {
         this.ruleForm.productId = this.frow.productId;
         this.$axios.get('/sc/tcProduct/view/'+this.ruleForm.productId).then((response) => {
            this.ruleForm = response.data.data;
            if(!this.ruleForm.freightType){
              this.ruleForm.freightType = '单价';
            }
            if(!this.ruleForm.msrType){
              this.ruleForm.msrType = '单价';
            }
         })

         this.$axios.get('/sc/tcCategory/装箱方式').then((response) => {
          this.containerMethods = response.data.data;
         })
         this.$axios.get('/sc/tcCategory/产品类型').then((response) => {
          this.productTypes = response.data.data;
         })
         this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
           this.currecnyCodes = response.data.data;
           if (this.freightCurrecnyCode && this.currecnyCodes[0]) {
             if ('CNY' != this.currecnyCodes[0].currency_code) {
               this.ruleForm.freightCurrecnyCode = this.currecnyCodes[0].currency_code;
               this.ruleForm.msrCurrecnyCode = this.currecnyCodes[0].currency_code;
             }
           }
         }.bind(this));
      }
    }
</script>

<style type="text/css" >
  .tc_product_save .el-input__icon {
    line-height: 30px !important;
  }
  .tc_product_save .el-input-group__prepend{
    width: 105px;
    text-align: left;
  }
</style>
