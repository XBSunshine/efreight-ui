<template>
  <el-dialog :title="titleName" width="1094px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" >
    <div class="rountingSign">
    <el-form :model="ruleForm2" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.awbNumber"  disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">主运单号</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.awbFromName" disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">订单来源</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:251px;margin-right: 5px;">
              <template slot="prepend">服务产品</template>
             <el-select slot="suffix" clearable  v-model="ruleForm2.businessProduct" placeholder="" style="width:184px; margin-right: -5px;">
               <el-option  v-for="item in businessProductList" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.clickName" disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">操作节点</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.departureStation"  disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">始发港</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="arrivalStation">
            <el-input   style="width: 251px;margin-right: 5px;">
            	<template slot="prepend">
            		<font style="color: red;">*</font>
            		<span>目的港</span>
            	</template>
              <el-select slot="suffix"    remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm2.arrivalStation"
                         @input="ruleForm2.arrivalStation = ruleForm2.arrivalStation.toUpperCase()"
                         @keydown.native="currentSelectKey='arrivalStation'"
                         placeholder="请输入关键词" style="width:188px;margin-right: -5px;" >
                <el-option v-for="item in airportList" :key="item.apCode" :value="item.apCode">
                  <el-row>
                    <el-col :span="2" style="width: unset;margin-right: 10px">{{item.apCode}}</el-col>
                    <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.apNameEn}}</el-col>
                    <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.apNameCn}}</el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.expectFlight"  style="width:251px;margin-right: 5px;">
              <template slot="prepend">航班号</template>
            </el-input>
          </el-form-item>
        </el-col>
       <el-col class="elementWidth">
         <el-form-item label=""  prop="expectDeparture">
           <el-input style="width:251px;margin-right: 5px;">
             <template slot="prepend"><font style="color: red;">*</font>航班日期</template>
             <el-date-picker slot="suffix" style="width: 180px;margin-right: -5px;"  v-model="ruleForm2.expectDeparture" type="date" value-format="yyyy-MM-dd" placeholder="">
             </el-date-picker>
           </el-input>
         </el-form-item>
       </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input  style="width: 251px;margin-right: 5px;">
            	<template slot="prepend">
            		<span>中转港1</span>
            	</template>

              <el-select slot="suffix"  clearable  remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm2.transitStation"
                         @input="ruleForm2.transitStation = ruleForm2.transitStation.toUpperCase()"
                         @keydown.native="currentSelectKey='transitStation'"
                         placeholder="请输入关键词" style="width:188px;margin-right: -5px;" >
                <el-option v-for="item in airportList" :key="item.apCode" :value="item.apCode">
                  <el-row>
                    <el-col :span="2" style="width: unset;margin-right: 10px">{{item.apCode}}</el-col>
                    <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.apNameEn}}</el-col>
                    <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.apNameCn}}</el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input  style="width: 251px;margin-right: 5px;">
            	<template slot="prepend">
            		<span>中转港2</span>
            	</template>

              <el-select slot="suffix" clearable  remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm2.transitStation2"
                         @input="ruleForm2.transitStation2 = ruleForm2.transitStation2.toUpperCase()"
                         @keydown.native="currentSelectKey='transitStation2'"
                         placeholder="请输入关键词" style="width:188px;margin-right: -5px;" >
                <el-option v-for="item in airportList" :key="item.apCode" :value="item.apCode">
                  <el-row>
                    <el-col :span="2" style="width: unset;margin-right: 10px">{{item.apCode}}</el-col>
                    <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.apNameEn}}</el-col>
                    <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.apNameCn}}</el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="height: 45px;margin-top: -20px;">
        <el-divider style="margin-top: 1px;"></el-divider>
      </el-row>

      <el-row style="margin-left: 20px;">
          <el-col  style="width: 30px;">&emsp;&emsp;</el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">预报</span></el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">实际</span></el-col>
          <el-col  style="width: 20px;">&emsp;&emsp;</el-col>

          <el-col  style="width: 30px;">&emsp;&emsp;</el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">预报</span></el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">实际</span></el-col>
          <el-col  style="width: 20px;">&emsp;&emsp;</el-col>

          <el-col  style="width: 30px;">&emsp;&emsp;</el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">预报</span></el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">实际</span></el-col>
          <el-col  style="width: 20px;">&emsp;&emsp;</el-col>

          <el-col  style="width: 30px;">&emsp;&emsp;</el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">预报</span></el-col>
          <el-col  style="width: 100px;"><span style="margin-left:26px">实际</span></el-col>
          <el-col  style="width: 20px;">&emsp;&emsp;</el-col>


      </el-row>
      <el-row style="margin-left: 20px;">
        <!--件数-->
          <el-col class="elementWidth"  style="width: 30px;margin-top: 10px;">件数</el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-model="ruleForm2.planPieces"  disabled style="width:100x;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-if="ruleForm2.confirmPieces&&ruleForm2.confirmPieces!=ruleForm2.planPieces" v-model="ruleForm2.confirmPieces" class="checkparam" disabled style="width:100px; margin-right: 5px;">
              </el-input>
              <el-input v-else v-model="ruleForm2.confirmPieces" disabled style="width:100px;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 20px;">&emsp;&emsp;</el-col>
         <!--毛重-->
          <el-col class="elementWidth"  style="width: 30px;margin-top: 10px;">毛重</el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-model="ruleForm2.planWeight" disabled style="width:100x;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-if="ruleForm2.confirmWeight&&ruleForm2.confirmWeight!=ruleForm2.planWeight" v-model="ruleForm2.confirmWeight" class="checkparam" disabled style="width:100px;margin-right: 5px;">
              </el-input>
              <el-input v-else v-model="ruleForm2.confirmWeight" disabled style="width:100px;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 20px;">&emsp;&emsp;</el-col>
         <!--密度-->
          <el-col class="elementWidth"  style="width: 30px;margin-top: 10px;">密度</el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-model="ruleForm2.planDensity" disabled style="width:100x;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-if="ruleForm2.confirmDensity&&ruleForm2.confirmDensity!=ruleForm2.planDensity" v-model="ruleForm2.confirmDensity" class="checkparam" disabled style="width:100px;margin-right: 5px;">
              </el-input>
              <el-input v-else v-model="ruleForm2.confirmDensity" disabled style="width:100px;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 20px;">&emsp;&emsp;</el-col>
          <!--计重-->
          <el-col class="elementWidth"  style="width: 30px;margin-top: 10px;">计重</el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-model="ruleForm2.planChargeWeight" disabled style="width:100x;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 100px;">
            <el-form-item label="" >
              <el-input v-if="ruleForm2.confirmChargeWeight&&ruleForm2.confirmChargeWeight!=ruleForm2.planChargeWeight" v-model="ruleForm2.confirmChargeWeight" class="checkparam" disabled style="width:100px;margin-right: 5px;">
              </el-input>
              <el-input v-else v-model="ruleForm2.confirmChargeWeight" disabled style="width:100px;margin-right: 5px;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="width: 20px;">&emsp;&emsp;</el-col>
      </el-row>

      <el-row style="height: 45px;margin-top: -20px;">
        <el-divider style="margin-top: 1px;"></el-divider>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" prop="msrUnitprice">
            <el-input v-model="ruleForm2.msrUnitprice" @input="formatToFloat('msrUnitprice')"  style="width:251px;margin-right: 5px;">
              <template slot="prepend"><font style="color: red;">*</font>MSR单价</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="incomeWeight">
            <el-input v-model="ruleForm2.incomeWeight" @input="formatToFloat('incomeWeight')" style="width:253px;">
              <template slot="prepend"><font style="color: red;">*</font>收费重量</template>
              <el-button slot="append" >KG</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.msrFunctionalAmount" disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">MSR金额</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
        	<el-form-item label-width="10px" prop="routingPersonId">
        		<el-input style="width:251px;">
        			<template slot="prepend"><font style="color: red;">*</font>航线负责人</template>
        			<el-select slot="suffix" v-model="ruleForm2.routingPersonId"  @change="setRoutingPersonName" style="width:170px;margin-right: -5px;" >
                <el-option v-for="item in orgUserList" :key="item.value" :label="item.label" :value="item.value">
                	<span style="float: left">{{ item.label }}</span>
                	<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
                </el-option>
        			</el-select>
        		</el-input>
        	</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="" prop="costUnitPrice">
            <el-input v-model="ruleForm2.costUnitPrice"  @input="formatToFloat('costUnitPrice')" style="width:251px;margin-right: 5px;">
              <template slot="prepend"><font style="color: red;">*</font>成本单价</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="costQuantity">
            <el-input v-model="ruleForm2.costQuantity" @input="formatToFloat('costQuantity')" style="width:253px;">
              <template slot="prepend"><font style="color: red;">*</font>付费重量</template>
              <el-button slot="append" >KG</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" >
            <el-input v-model="ruleForm2.costAmount" disabled style="width:251px;margin-right: 5px;">
              <template slot="prepend">成本金额</template>
            </el-input>
          </el-form-item>
        </el-col>
       <el-col class="elementWidth">
         <el-form-item label="" >
           <el-input v-model="ruleForm2.flightAmount" disabled style="width:251px;margin-right: 5px;">
             <template slot="prepend">航线利润</template>
           </el-input>
         </el-form-item>
       </el-col>
      </el-row>

      <el-row style="margin-top: 15px;">
        <!-- style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" -->
        <el-button type="primary"  size="small" v-on:click="submit('ruleForm')" >确定</el-button>
        <el-button type="primary"  size="small" v-on:click="cancel()" >取消</el-button>
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
        titleName:'航线签单-新增',
        businessProductList:[],
        airportList: [],
        currentSelectKey: '',
        loading:false,
        orderInfo:{},
        operType:'',
        currencyRate:'',
        ruleForm2: {
         	  awbNumber:'',
         	  awbFromName:'',
         	  businessProduct:'',
         	  clickName:'',
         	  departureStation:'',
         	  arrivalStation:'',
         	  expectFlight:'',
         	  expectDeparture:'',
         	  transitStation:'',
         	  transitStation2:'',
         	  planPieces:'',
         	  confirmPieces:'',
         	  planWeight:'',
         	  confirmWeight:'',
         	  planDensity:'',
         	  confirmDensity:'',
         	  planChargeWeight:'',
         	  confirmChargeWeight:'',
         	  msrUnitprice:'',
         	  incomeWeight:'',
         	  msrFunctionalAmount:'',
         	  routingPersonName:'',
            routingPersonId:null,
         	  costUnitPrice:'',
         	  costQuantity:'',
         	  costAmount:'',
         	  flightAmount:'',
            orderId:'',
            rountingSignId:''
        },
        rules: {
        	expectDeparture: [{
        		required: true,
        		message: '请选择航班日期',
        		trigger: ['blur', 'change']
        	}],
          arrivalStation: [{
          	required: true,
          	message: '请选择目的港',
          	trigger: ['blur', 'change']
          }],
          msrUnitprice: [{
          	required: true,
          	message: '请录入MSR单价',
          	trigger: ['blur', 'change']
          }],
          incomeWeight: [{
          	required: true,
          	message: '请录入收费重量',
          	trigger: ['blur', 'change']
          }],
          costUnitPrice: [{
          	required: true,
          	message: '请录入成本单价',
          	trigger: ['blur', 'change']
          }],
          costQuantity: [{
          	required: true,
          	message: '请录入付费重量',
          	trigger: ['blur', 'change']
          }],
          routingPersonId:[{
          	required: true,
          	message: '请选择航线负责人',
          	trigger: ['blur', 'change']
          }],
        }
      }
    },
    inject: ['findByPage'],
    created: function(){
      this.$axios.get('/afbase/awb/selectCategory?category=航线签单').then(function(response) {
      	this.businessProductList = response.data.data;
      }.bind(this));

      this.$axios.get('/hrs/dept/selectUser').then(function(response) {
      	this.orgUserList = response.data.data;
        let userId = window.localStorage.getItem('userId')
        if(!this.ruleForm2.routingPersonName||this.ruleForm2.routingPersonName==''){
          this.ruleForm2.routingPersonId =  parseInt(userId);
          this.setRoutingPersonName( parseInt(userId));
        }
      }.bind(this));

      this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
      	.then(function(response) {
      		this.orderInfo = response.data.data;
          this.$axios.get('/afbase/vCurrencyRate/'+this.orderInfo.msrCurrecnyCode)
          	.then(function(response) {
              this.currencyRate = response.data.data.currencyRate;
              this.orderCopy(this.orderInfo);
          	}.bind(this));
      	}.bind(this));
    },

    methods: {
          orderCopy(order){
             this.ruleForm2.awbNumber = order.awbNumber;
             this.ruleForm2.awbFromName = order.awbFromName;
             this.ruleForm2.awbFromId = order.awbFromId;
             this.ruleForm2.businessProduct = order.businessProduct;
             this.ruleForm2.clickName = order.orderStatus;
             if(order.incomeRecorded){
                 this.ruleForm2.clickName = this.ruleForm2.clickName+",收入完成";
             }
             if(order.costRecorded){
                this.ruleForm2.clickName = this.ruleForm2.clickName+",成本完成";
             }
             this.ruleForm2.departureStation= order.departureStation;
             this.ruleForm2.arrivalStation= order.arrivalStation;
             this.ruleForm2.expectFlight= order.expectFlight;
             this.ruleForm2.expectDeparture= order.expectDeparture;
             this.ruleForm2.transitStation= order.transitStation;
             this.ruleForm2.transitStation2= order.transitStation2;
             this.ruleForm2.planPieces= order.planPieces;
             this.ruleForm2.confirmPieces= order.confirmPieces;
             this.ruleForm2.planWeight= order.planWeight;
             this.ruleForm2.confirmWeight= order.confirmWeight;
             this.ruleForm2.planDensity= order.planDensity;
             this.ruleForm2.confirmDensity= order.confirmDensity;
             this.ruleForm2.planChargeWeight= order.planChargeWeight;
             this.ruleForm2.confirmChargeWeight= order.confirmChargeWeight;
             if(order.confirmChargeWeight){
                this.ruleForm2.incomeWeight=order.confirmChargeWeight;
                this.ruleForm2.costQuantity=order.confirmChargeWeight;
             }else{
               this.ruleForm2.incomeWeight=order.planChargeWeight;
               this.ruleForm2.costQuantity=order.planChargeWeight;
             }
             this.ruleForm2.orderId = order.orderId;
             this.$axios.get('/afbase/rountingsign/view/' + this.frow.orderId+'/AE')
               .then(function(response) {
                 if(response.data.data){
                   this.signInfo = response.data.data;
                   this.signCopy(this.signInfo);
                 }else{
                    if(this.orderInfo.msrUnitprice&&this.currencyRate){
                       this.ruleForm2.msrUnitprice = (this.orderInfo.msrUnitprice*this.currencyRate).toFixed(2);
                       this.formatToFloat('msrUnitprice');
                    }
                 }
               }.bind(this));
          },
          signCopy(sign){
            if(sign.signState==1){
               this.ruleForm2.msrUnitprice =(sign.msrUnitprice||0).toFixed(2);
            }else{
              if(this.orderInfo.msrUnitprice&&this.currencyRate){
                 this.ruleForm2.msrUnitprice = (this.orderInfo.msrUnitprice*this.currencyRate).toFixed(2);
              }
            }
            this.ruleForm2.costUnitPrice = (sign.cuUnitprice||0).toFixed(2);
            this.formatToFloat('msrUnitprice');
            this.formatToFloat('costUnitPrice');
            // this.ruleForm2.incomeWeight =sign.incomeWeight;
            // this.ruleForm2.msrFunctionalAmount=sign.msrFunctionalAmount;
            if(sign.routingPersonName){
            this.ruleForm2.routingPersonName=sign.routingPersonName;
            this.ruleForm2.routingPersonId=sign.routingPersonId;
            }
            this.ruleForm2.rountingSignId=sign.rountingSignId;
          },
          submit(formName){
            this.$refs[formName].validate((valid) => {
            	if (valid) {
            		this.loading = true
            		this.$axios.post2('/afbase/rountingsign/modify', this.ruleForm2)
            			.then((response) => {
            				if (response.data.code == 0) {
            					this.openSuccess("提交成功")
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
          cancel(){
            this.findByPage();
            this.handleClose()
          },
          setRoutingPersonName(vId){
            let obj = {};
            obj = this.orgUserList.find((item) => {
              return item.value === vId;
            });
            this.ruleForm2.routingPersonName = obj.label3;
            this.ruleForm2.routingPersonId = obj.value;
          },
           /**
             * 搜索港口信息
             * @param val 关键字
             */
            searchAirport(val){
              this.search("/afbase/airport/search/", val, function(data){
                this.airportList = data;
              }.bind(this));
            },
      	   /**
             * 通用搜索方法
             * @param url 请求地址
             * @param val 请求参数
             * @param callback 回调函数
             */
            search(url, val, callback){
              if(!callback){
                callback = function(data){};
              }
              if((val || '').trim().length == 0){
                callback([]);
                return;
              }
              val = val.toUpperCase();
              if(this.currentSelectKey){
                this.ruleForm2[this.currentSelectKey] = val;
              }
              this.loading = true;
              this.$axios.get(url+val).then(function(response){
                this.loading = false;
                callback(response.data.data || []);
              }.bind(this));
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
        	this.ruleForm2[a] = this.ruleForm2[a].replace(/[^0123456789.]/g, "");
          if(this.ruleForm2[a].indexOf(".")>-1){
            let t = this.ruleForm2[a].split('.');
            if (t.length > 1) {
              if(a=='costQuantity'||a=='incomeWeight'){
                this.ruleForm2[a] = t[0] + "." + t[1].substr(0,3);
              }else{
                this.ruleForm2[a] = t[0] + "." + t[1].substr(0,2);
              }

            }
          }

        if(a=='msrUnitprice'){
            if(this.ruleForm2.incomeWeight){
                this.ruleForm2.msrFunctionalAmount = (this.ruleForm2.msrUnitprice*this.ruleForm2.incomeWeight).toFixed(2);
                if(this.ruleForm2.costAmount){
                  this.ruleForm2.flightAmount = (this.ruleForm2.msrFunctionalAmount - this.ruleForm2.costAmount).toFixed(2);
                }
            }
        }else if(a=='incomeWeight'){
          if(this.ruleForm2.msrUnitprice){
              this.ruleForm2.msrFunctionalAmount = (this.ruleForm2.msrUnitprice*this.ruleForm2.incomeWeight).toFixed(2);
              if(this.ruleForm2.costAmount){
                this.ruleForm2.flightAmount = (this.ruleForm2.msrFunctionalAmount - this.ruleForm2.costAmount).toFixed(2);
              }
          }
        }else if(a=='costUnitPrice'){
          if(this.ruleForm2.costQuantity){
              this.ruleForm2.costAmount = (this.ruleForm2.costUnitPrice*this.ruleForm2.costQuantity).toFixed(2);
              if(this.ruleForm2.msrFunctionalAmount){
                this.ruleForm2.flightAmount = (this.ruleForm2.msrFunctionalAmount - this.ruleForm2.costAmount).toFixed(2);
              }
          }
        }else if(a=='costQuantity'){
          if(this.ruleForm2.costUnitPrice){
              this.ruleForm2.costAmount = (this.ruleForm2.costUnitPrice*this.ruleForm2.costQuantity).toFixed(2);
              if(this.ruleForm2.msrFunctionalAmount){
                this.ruleForm2.flightAmount = (this.ruleForm2.msrFunctionalAmount - this.ruleForm2.costAmount).toFixed(2);
              }
          }
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
      handleChange(command,index) {
				this.currRow = command
			},
			handleCommand(command) {
			},
    }
  }
</script>
<style type="text/css">
	.rountingSign .el-input__icon {
		line-height: 30px !important;
	}

	.rountingSign .el-form-item__content {
		line-height: 40px !important;
	}

	.rountingSign .el-input-group__prepend {
		padding: 0 6px;
	}

	.rountingSign .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.rountingSign .el-button {
		margin-top: -5px !important
	}
  .rountingSign .showWordLimit .el-input__inner {
  	padding-right: 80px !important;
  }
  .rountingSign .checkparam .el-input__inner {
  	border-color: red !important;
  }

  .rountingSign .showWordLimit .el-textarea__inner {
  	padding-right: 50px;
  }
</style>
