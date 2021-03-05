<template>
 <el-container>
   <el-main >
    <!-- <div v-if="shareFlag">
      <el-row>
          <el-col  align="center">
            <p><span style="font-size:22px;margin-top:50%">当前分享已创建协作订单</span></p>
          </el-col>
      </el-row>
    </div> -->
    <div v-if="!timeFlag&&!shareFlag">
      <el-row>
          <el-col  align="center">
            <p><span style="font-size:22px;margin-top:50%">当前分享已超时，请联系原分享人</span></p>
          </el-col>
      </el-row>
    </div>
    <div v-if='timeFlag&&!shareFlag' class="orderEditPage" style="width: 1280px;">
    <el-form class="demo-ruleForm" >

    		<div style="margin-top: -15px;margin-bottom: 20px;">
    			<span style="font-size: large;margin-bottom: 20px;">订单信息</span>
    		</div>
        <div style="padding:10px 0px 10px 0px">
        	<HR color="#eee" size="5">
        	</HR>
        </div>
        <div style="padding:0px 0px 0px 30px">
        <span v-if="checkSharefields('订单信息')">订单信息</span>
    		<el-row style="margin-top: 20px;">
    			<el-col class="elementWidth" v-if="checkSharefields('主运单号')">
            <el-form-item>
    					<el-input v-model="orderInfo.awbNumber" disabled  auto-complete="off" style="width:295px;margin-right: 15px;">
    						<template slot="prepend">
    							<span>主运单号</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>

    			<el-col class="elementWidth" v-if="checkSharefields('客户单号')">
            <el-form-item>
    					<el-input v-model="orderInfo.customerNumber"  disabled auto-complete="off" style="width:295px;margin-right: 15px;" >
    						<template slot="prepend">
    							<span>客户单号</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
          </el-row>
          <el-row>
          <el-col class="elementWidth" v-if="checkSharefields('始发港')">
            <el-form-item>
              <el-input class="widthWithThree" disabled v-model="orderInfo.departureStation" auto-complete="off"  style="width: 295px;margin-right: 15px;">
                <template slot="prepend">
                  <span>始发港</span>
                </template>
              </el-input>
              </el-form-item>
          </el-col>
          <el-col class="elementWidth" v-if="checkSharefields('目的港')">
            <el-form-item>
              <el-input class="widthWithThreeWithXing arrivalStationForAESave" disabled v-model="orderInfo.arrivalStation"  auto-complete="off" maxlength="4" style="width: 295px;margin-right: 15px;">
                <template slot="prepend">
                  <span>目的港</span>
                </template>
              </el-input>
              </el-form-item>
          </el-col>
    			<el-col class="elementWidth" v-if="checkSharefields('航班号')">
            <el-form-item>
    					<el-input class="widthWithThree" disabled v-model="orderInfo.expectFlight"   auto-complete="off" style="width: 295px;margin-right: 15px;">
    						<template slot="prepend">
    							<span>航班号</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
    			<el-col class="elementWidth" v-if="checkSharefields('航班日期')">
            <el-form-item>
    					<el-input class="widthWithFourWithXing" disabled v-model="orderInfo.expectDeparture" style="width:295px;margin-right: 15px;">
    						<template slot="prepend">
    							<span>航班日期&nbsp;&nbsp;</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
    		</el-row>
        <el-row>
          <el-col class="elementWidth" v-if="checkSharefields('中转港1')">
            <el-form-item>
          		<el-input class="widthWithThreeWithXing" disabled v-model="orderInfo.transitStation"  auto-complete="off" maxlength="4" style="width: 295px;margin-right: 15px;">
          			<template slot="prepend">
          				<span>中转港1</span>
          			</template>
          		</el-input>
              </el-form-item>
          </el-col>
          <el-col class="elementWidth" v-if="checkSharefields('中转港2')">
            <el-form-item>
          		<el-input class="widthWithThreeWithXing" disabled v-model="orderInfo.transitStation2"  auto-complete="off"  style="width: 295px;margin-right: 15px;">
          			<template slot="prepend">
          				<span>中转港2</span>
          			</template>
          		</el-input>
              </el-form-item>
          </el-col>
          <el-col class="elementWidth" v-if="checkSharefields('货源地')">
            <el-form-item>
          		<el-input disabled v-model="orderInfo.goodsSourceCode" auto-complete="off" style="width:295px;margin-right: 15px;">
          			<template slot="prepend">
          				<span>货源地&emsp;</span>
          			</template>
          		</el-input>
              </el-form-item>
          </el-col>
        </el-row>
    		<el-row>
    			<el-col class="elementWidth" v-if="checkSharefields('预报件数')">
            <el-form-item>
    					<el-input class="widthWithFourWithXing" disabled  v-model="orderInfo.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
    						<template slot="prepend">
    							<span>预报件数&nbsp;&nbsp;</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
    			<el-col class="elementWidth" v-if="checkSharefields('预报毛重')">
            <el-form-item>
    					<el-input class="widthWithFourWithXing" disabled v-model="orderInfo.planWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
    						<template slot="prepend">
    							<span>预报毛重</span>
    						</template>
    						<template slot="append">
    							<span>KG</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
    			<el-col class="elementWidth" v-if="checkSharefields('预报体积')">
            <el-form-item>
    					<el-input class="widthWithFourWithXing" disabled v-model="orderInfo.planVolume" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
    						<template slot="prepend">
    							<span>预报体积&nbsp;&nbsp;</span>
    						</template>
    						<template slot="append">
    							<span>CBM</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>

    			<el-col class="elementWidth" v-if="checkSharefields('预报计重')">
            <el-form-item>
    					<el-input disabled v-model="orderInfo.planChargeWeight" auto-complete="off" style="width:295px;">
    						<template slot="prepend">
    							<span>预报计重</span>
    						</template>
    						<template slot="append">
    							<span>KG</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
    		</el-row>
    		<el-row>
          <el-col class="elementWidth" v-if="checkSharefields('包装')">
            <el-form-item>
          		<el-input disabled v-model="orderInfo.packageType" auto-complete="off" style="width:295px;margin-right: 15px;">
          			<template slot="prepend">
          				<span>包装&emsp;&emsp;</span>
          			</template>
          		</el-input>
              </el-form-item>
          </el-col>
    			<el-col class="elementWidth" v-if="checkSharefields('预报尺寸')">
            <el-form-item>
    					<el-input v-model="orderInfo.planDimensions" auto-complete="off" style="width:915px;margin-right: 15px;" disabled>
    						<template slot="prepend">
    							<span>预报尺寸</span>
    						</template>
    					</el-input>
              </el-form-item>
    			</el-col>
    			<!-- <el-col class="elementWidth" v-if="checkSharefields('预报密度')">
    					<el-input disabled v-model="orderInfo.planDensity" auto-complete="off" style="width:295px;margin-right: 15px;">
    						<template slot="prepend">
    							<span>预报密度</span>
    						</template>
    					</el-input>
    			</el-col> -->
    		</el-row>
        </div>

    		<div v-if="checkSharefields('制单信息')" style="padding:10px 0px 10px 0px">
    			<HR color="#eee" size="5">
    			</HR>
    		</div>
    		<div style="padding:0px 0px 0px 30px" v-if="checkSharefields('制单信息')">
    			<span v-if="orderInfo.hawbQuantity==0">制单信息(直单)</span>
    			<span v-else>制单信息({{orderInfo.hawbQuantity}}分)</span>
            <el-row  v-if="checkSharefields('主单信息')">
    				<el-row>
    					<el-col class="elementWidth" style="margin-left: 50px;">
    						<el-button type="text" style="margin-left: 20px;color:#409EFF">主运单信息</el-button>
    					</el-col>
    				</el-row>
    				<el-col class="elementWidth" style="margin-left: 50px;">
    					<el-row>
    						<el-button type="text" style="margin-left: 20px;" disabled>发货人信息</el-button>
    					</el-row>
    					<el-row>
    							<el-input type="textarea" v-model="orderInfo.afOrderShipperConsignee2.scPrintRemark"  auto-complete="off" :rows="5" disabled style="width:520px">
    							</el-input>
    					</el-row>
    				</el-col>
    				<el-col class="elementWidth" style="margin-left: 50px;">
    					<el-row>
    						<el-button type="text" style="margin-left: 20px;" disabled>收货人信息</el-button>
    					</el-row>
    					<el-row>
    							<el-input type="textarea" v-model="orderInfo.afOrderShipperConsignee1.scPrintRemark"  auto-complete="off" :rows="5" disabled style="width:520px">
    							</el-input>
    					</el-row>
    				</el-col>
    			</el-row>

    			<el-row v-if="checkSharefields('主单信息')">
    				<el-col class="elementWidth" style="margin-left: 50px;">
    						<el-row>
    							<el-button type="text" style="margin-left: 20px;" disabled>中文品名</el-button>
    						</el-row>
    						<el-input class="showWordLimit" type="textarea" v-model="orderInfo.goodsNameCn"  auto-complete="off" :rows="3"  style="width: 520px;" show-word-limit disabled></el-input>
    				</el-col>
    				<el-col class="elementWidth" style="margin-left: 50px;">
    						<el-row>
    							<el-button type="text" style="margin-left: 20px;" disabled>英文品名</el-button>
    						</el-row>
    						<el-input class="showWordLimit" type="textarea" v-model="orderInfo.goodsNameEn" auto-complete="off" :rows="3" maxlength="500" style="width: 520px;" show-word-limit disabled></el-input>
    				</el-col>

    			</el-row>

    			<el-row v-if="checkSharefields('主单信息')">
    				<el-col class="elementWidth" style="margin-left: 50px;">
    						<el-row>
    							<el-button type="text" style="margin-left: 20px;" disabled>唛头信息</el-button>
    						</el-row>
    						<el-input class="showWordLimit" type="textarea" v-model="orderInfo.shippingMarks" auto-complete="off" :rows="3" maxlength="500" style="width: 520px;" show-word-limit disabled></el-input>
    				</el-col>

    				<el-col class="elementWidth" style="margin-left: 50px;">
    						<el-row>
    							<el-button type="text" style="margin-left: 20px;" disabled>Handling&nbsp;Info</el-button>
                  <el-checkbox style="margin-left: 10px;" v-model="orderInfo.isNoSolidWood" disabled>非木</el-checkbox>
                  <el-checkbox style="margin-left: 10px;" v-model="orderInfo.isCelsiusRequire" disabled>温度要求</el-checkbox>
    						</el-row>
    						<el-input class="showWordLimit" type="textarea" v-model="orderInfo.handlingInfo" auto-complete="off" :rows="3" maxlength="500" style="width: 520px;" show-word-limit disabled></el-input>
    				</el-col>
    			</el-row>
    			<el-row v-if="checkSharefields('全部分单信息')">
    				<el-row>
    					<el-col class="elementWidth" style="margin-left: 50px;">
    						<el-button type="text" style="margin-left: 20px;color:#409EFF">分单信息</el-button>
    					</el-col>
    				</el-row>
    				<el-col class="elementWidth" style="margin-left: 50px;margin-top: 20px;">
    					<el-table :data="orderInfo.shipperLetters" stripe border style="width:1103px">
    						<el-table-column align="center" label="分运单号" width="150">
    							<template slot-scope="scope">
    								<el-input size="small" v-model="scope.row.hawbNumber" maxlength="12" disabled></el-input>
    							</template>
    						</el-table-column>
    						<el-table-column align="center" label="分单品名">
    							<template slot-scope="scope">
    								<el-input size="small" v-model="scope.row.goodsNameCn" disabled></el-input>
    							</template>
    						</el-table-column>
    						<el-table-column align="center" label="件数" width="130">
    							<template slot-scope="scope">
    								<el-input size="small" v-model="scope.row.planPieces" disabled>
    								</el-input>
    							</template>
    						</el-table-column>
    						<el-table-column align="center" label="毛重" width="160">
    							<template slot-scope="scope">
    								<el-input class="widthWithKG" size="small" v-model="scope.row.planWeight" disabled>
    									<i slot="append">KG</i>
    								</el-input>
    							</template>
    						</el-table-column>
    						<el-table-column align="center" label="分单目的港" width="130">
    							<template slot-scope="scope">
    								<el-input size="small" v-model="scope.row.arrivalStation" disabled></el-input>
    							</template>
    						</el-table-column>

    					</el-table>
    				</el-col>
    			</el-row>
    		</div>
    		<div v-if="checkSharefields('操作详情')" style="padding:10px 0px 10px 0px">
    			<HR color="#eee" size="5">
    			</HR>
    		</div>
    		<div style="padding:0px 0px 0px 30px" v-if="checkSharefields('操作详情')">
    			<span>操作详情</span>
    			<el-row  style="margin-top: 20px;">
    				<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;margin-right: 15px;" v-if="checkSharefields('货物类型')">
              <el-form-item>
    						<el-input style="width:265px;" v-model="orderInfo.goodsType" disabled>
    							<template slot="prepend">
    								<span>货物类型</span>
    							</template>
    						</el-input>
                </el-form-item>
    				</el-col>
    				<el-col class="elementWidth" v-if="checkSharefields('电池情况')">
              <el-form-item>
    						<el-input style="width:266px;margin-right: 15px;" v-model="orderInfo.batteryType" disabled>
    							<template slot="prepend">
    								<span>电池情况</span>
    							</template>

    						</el-input>
                </el-form-item>
    				</el-col>
    				<el-col class="elementWidth" v-if="checkSharefields('海关代码')">
              <el-form-item>
    						<el-input style="width:266px;margin-right: 15px;" v-model="orderInfo.customsStatusCode" disabled>
    							<template slot="prepend">
    								<span>海关代码</span>
    							</template>

    						</el-input>
                </el-form-item>
    				</el-col>
    				<el-col class="elementWidth" v-if="checkSharefields('随机文件')">
              <el-form-item>
    						<el-input class="showWordLimit" v-model="orderInfo.airborneDocument" auto-complete="off" style="width:272px;margin-right: 15px;"  show-word-limit disabled>
    							<template slot="prepend">
    								<span>随机文件</span>
    							</template>
    						</el-input>
                </el-form-item>
    				</el-col>
    			</el-row>
    			<el-row >
  <!--  				<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;" v-if="checkSharefields('鉴定单位')">
              <el-form-item>
    						<el-input class="showWordLimit"  v-model="orderInfo.appraisalCompany" auto-complete="off" style="width:265px;margin-right: 15px;"  show-word-limit disabled>
    							<template slot="prepend">
    								<span>鉴定单位</span>
    							</template>
    						</el-input>
                </el-form-item>
    				</el-col>-->
    				<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;" v-if="checkSharefields('危品类项')">
               <el-form-item>
    						<el-input class="showWordLimit" v-model="orderInfo.dangerousType" auto-complete="off" style="width:266px;margin-right: 15px;"  show-word-limit disabled>
    							<template slot="prepend">
    								<span>危品类项</span>
    							</template>
    						</el-input>
                </el-form-item>
    				</el-col>

            <el-col class="elementWidth">
              <el-form-item prop="specialPackage">
                <el-input style="width:266px;margin-right: 15px;" v-model="orderInfo.specialPackage" disabled>
                  <template slot="prepend">
                    <span>特货包装</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth">
              <el-form-item prop="celsiusRequire">
                <el-input style="width:266px;margin-right: 15px;" v-model="orderInfo.celsiusRequire" disabled>
                  <template slot="prepend">
                    <span>温度要求</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth">
              <el-form-item>
                <el-input auto-complete="off" style="width:272px;" class="widthWithThermometer" v-model="orderInfo.thermometer" disabled>
                  <template slot="prepend">
                    <span>温度计</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

    				<!--<el-col class="elementWidth" v-if="checkSharefields('鉴定号')">
              <el-form-item>
    						<el-input class="widthWithThree showWordLimit" v-model="orderInfo.appraisalNote"  auto-complete="off" style="width:552px;margin-right: 15px;"  show-word-limit disabled>
    							<template slot="prepend">
    								<span>鉴定号</span>
    							</template>
    						</el-input>
                </el-form-item>
    				</el-col>-->
    			</el-row>
          <el-row>
            <el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
              <el-form-item prop="palletMaterial">
                <el-input style="width:266px;margin-right: 15px;" v-model="orderInfo.palletMaterial" disabled>
                  <template slot="prepend">
                    <span>托盘材质</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
    		</div>
        </el-form>
         <shareOrderSave ref="addMission" v-if="shareOrderSaveVisible" :visible.sync="shareOrderSaveVisible" :frow="frow"></shareOrderSave>
    </div>
   </el-main>
 </el-container>
</template>
<script>
  import ShareOrderSave  from '@/views/af/order/share/order_share_save.vue'
  export default {
    data() {
      return {
        defInfoOrg:{
          goodsType:'',
          batteryType:'',
          customsStatusCode:'',
          businessProduct:''
        },
        query: {
          customerName:'',
          coopId:'',
          coopName:'',
          orgUuid:'',
          orgCoopid:'',
          userId:'',
          userName:''
        },
        sharefields:'',
        sharefieldsTwo:'',
        datastr:'',
        orgName:'',
        dataEnd:'',
        orgId:'',
        frow:{},
        orderInfo:{
          afOrderShipperConsignee1: {
          	scPrintRemark: ''
          },
          afOrderShipperConsignee2: {
          	scPrintRemark: ''
          }
        },
        timeFlag:true,
        shareFlag:false,
        shareOrderSaveVisible:false
      }
    },
    components: {
      'shareOrderSave':ShareOrderSave
    },
    // provide() {
    // 	return {

    // },
    created: function(){
     let a = this.$route.query.o;
	 // console.log(this.base64Decode(a));
     this.frow = JSON.parse(this.base64Decode(a).trim());
     this.frow.orderId=parseInt(this.frow.orderId|0);
     this.frow.orderOrgId=parseInt(this.frow.orderOrgId|0);
     this.frow.shareCoopId=parseInt(this.frow.shareCoopId|0);
     this.frow.shareOrgId=parseInt(this.frow.shareOrgId|0);
     this.frow.coopOrgCoopId=parseInt(this.frow.coopOrgCoopId|0);
      // console.log(this.frow);
     let orgId =  window.localStorage.getItem('orgId');
     this.datastr =this.frow.shareOrderEditTime;
     let date = new Date(parseInt(this.frow.shareOrderEditTime)+24*60*60*1000);
     this.dataEnd = this.formatDate(date,'yyyy-MM-dd')+" 23:59:59";
     let dateEndLong = Number(new Date(this.dataEnd));
     if(Number(new Date())>=dateEndLong){
         //如果超出时间  则提示
         this.timeFlag = false;
     }else{
         //查询协作订单 af_order_share
         this.$axios.get2('/afbase/afOrderShare/afOrderShareInfo/'+this.frow.orderOrgId+'/'+ this.frow.shareCoopId+'/'+this.frow.orderId).then((response) => {
             let r = response.data.data;
             if(!r){
                this.setOrderInfo();
             }else if(r.shareOrderId){
               if(this.frow.shareOrgId == orgId){
                  this.setOrderInfo();
               }else{
                  // this.jumpToNewPage("/noPermission");
                  this.$router.push('/noPermission');
               }
               // this.shareFlag = true;
               return false;
             }else{
                   if(this.frow.shareOrgId == orgId){
                     //协作单绑定签约公司等于当前登录的签约公司  查询跳转订单新建
                      this.frow.msrCurrecnyCode = null;
                      this.frow.ifFullscreen = true;
                      this.shareOrderSaveVisible = true;
                   }else{
                     // this.setOrderInfo();
                     this.$router.push('/noPermission');
                   }
             }
         }).catch((error) => {
             console.log(error);
         });
     }
      // hh:mm
    },
    methods: {
      // jumpToNewPage(path) {
      	// let routeUrl = this.$router.resolve({
      	// 	path: path
      	// });
      	// window.open(routeUrl.href, '_blank');
        // this.$router.push('');
      // },
      setOrderInfo(){
        //查询签约公司默认配置信息
        this.$axios.get('/hrs/org/getOrgOrderConfig/AE').then((response) => {
        	if (response.data.code == 0 && response.data.data) {
        		this.defInfoOrg.businessProduct = response.data.data.businessProduct
        		if (!this.defInfoOrg.businessProduct) {
        			this.defInfoOrg.businessProduct = '代理制'
        		}
            this.defInfoOrg.goodsType = response.data.data.goodsType
            if (!this.defInfoOrg.goodsType) {
            	this.defInfoOrg.goodsType = '普货'
            }
            this.defInfoOrg.batteryType = response.data.data.batteryType
            if (!this.defInfoOrg.batteryType) {
            	this.defInfoOrg.batteryType = '不含电池'
            }
            this.defInfoOrg.customsStatusCode = response.data.data.customsStatusCode
            if (!this.defInfoOrg.customsStatusCode) {
            	this.defInfoOrg.customsStatusCode = '001'
            }
        	} else {
        		  this.defInfoOrg.businessProduct = '代理制'
              this.defInfoOrg.goodsType = '普货'
              this.defInfoOrg.batteryType = '不含电池'
              this.defInfoOrg.customsStatusCode = '001'
        	}
        }).catch((error) => {
        	this.defInfoOrg.businessProduct = '代理制'
          this.defInfoOrg.goodsType = '普货'
          this.defInfoOrg.batteryType = '不含电池'
          this.defInfoOrg.customsStatusCode = '001'
        })
          // 查看协作单信息
          //查询协作订单 字段 分享
          this.$axios.get2('/afbase/afOrderShare/shareFields/'+this.frow.orderOrgId+'/'+ this.frow.shareCoopId).then((response) => {
              let r = response.data.data;
              if(r!=null&&r.length>0){
                this.sharefields = r.toString();
              }
          }).catch((error) => {
              console.log(error);
          });
          //查询协作订单 字段 订阅
          // this.$axios.get2('/afbase/afOrderShare/shareFieldsTwo/'+this.frow.shareOrgId+'/'+ this.frow.coopOrgCoopId).then((response) => {
          //     let r = response.data.data;
          //     if(r!=null&&r.length>0){
          //       this.sharefieldsTwo = r.toString();
          //     }
          // }).catch((error) => {
          //     console.log(error);
          // });
          //查询订单信息
          this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
           .then(function(response) {
            this.orderInfo = response.data.data;
            this.initOrderInfo();
            // console.log(this.orderInfo);
           }.bind(this))
      },
      initOrderInfo(){
         if(!this.checkSharefields('货物类型')){
           this.orderInfo.goodsType = this.defInfoOrg.goodsType;
         }
         if(!this.checkSharefields('电池情况')){
           this.orderInfo.batteryType = this.defInfoOrg.batteryType;
         }
         if(!this.checkSharefields('海关代码')){
           this.orderInfo.customsStatusCode = this.defInfoOrg.customsStatusCode;
         }
        this.orderInfo.businessProduct= this.defInfoOrg.businessProduct;
        if (this.orderInfo.thermometer === 0) {
            this.orderInfo.thermometer = '无';
        } else if(this.orderInfo.thermometer === 1) {
            this.orderInfo.thermometer = '有';
        }

      },
      checkSharefields(param){
        // &&this.sharefieldsTwo.indexOf(param)>-1
         if(this.sharefields.indexOf(param)>-1){
            return true;
         }else{
           return false;
         }
      },
      submitShare(){
       if(!this.query.coopId ){
           this.openError("请选择客商资料");
           return false;
       }
       let orgIdOper = window.localStorage.getItem('orgId');
       if(this.orgId == orgIdOper){
          this.openError("分享和协作公司不能为同一签约公司");
          return false;
       }
       let dateNum = parseInt(this.datastr)+10*60*1000;
       let date2 = Number(new Date());
       if(date2>=dateNum){
           this.openError("本次请求地址 于"+dateNum+"前有效，已超时失效");
           return false;
       }
       //去绑定

       this.$axios.post2('/prm/coopShare/coopShareBind', this.query)
         .then(function(response){
           if(0 == response.data.code){
              this.openSuccess();
           }else{
             this.openError(response.data.messageInfo || "绑定失败");
           }
         }.bind(this))
         .catch(function(){
           this.openError("绑定失败，请稍后再试");
         }.bind(this))

     },
      formatDate (date, fmt) {
          if (/(y+)/.test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          }
          let o = {
              'M+': date.getMonth() + 1,
              'd+': date.getDate(),
              'h+': date.getHours(),
              'm+': date.getMinutes(),
              's+': date.getSeconds()
          };

          for (let k in o) {
              if (new RegExp(`(${k})`).test(fmt)) {
                  let str = o[k] + '';
                  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
              }
          }
          return fmt;
      },
      padLeftZero(str){
        return ('00' + str).substr(str.length);
      },
      base64Decode(input) {
      	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      	let output = "";
      	let chr1, chr2, chr3;
      	let enc1, enc2, enc3, enc4;
      	let i = 0;
      	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      	while (i < input.length) {
      		enc1 = _keyStr.indexOf(input.charAt(i++));
      		enc2 = _keyStr.indexOf(input.charAt(i++));
      		enc3 = _keyStr.indexOf(input.charAt(i++));
      		enc4 = _keyStr.indexOf(input.charAt(i++));
      		chr1 = (enc1 << 2) | (enc2 >> 4);
      		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      		chr3 = ((enc3 & 3) << 6) | enc4;
      		output = output + String.fromCharCode(chr1);
      		if (enc3 != 64) {
      			output = output + String.fromCharCode(chr2);
      		}
      		if (enc4 != 64) {
      			output = output + String.fromCharCode(chr3);
      		}
      	}
      	output = this.utf8Decode(output);
      	return output;
      },
      utf8Decode(utftext) {
      	let string = "";
      	let i = 0
      	let c = 0
      	let c1 = 0
      	let c2 = 0
      	while (i < utftext.length) {
      		c = utftext.charCodeAt(i);
      		if (c < 128) {
      			string += String.fromCharCode(c);
      			i++;
      		} else if ((c > 191) && (c < 224)) {
      			c1 = utftext.charCodeAt(i + 1);
      			string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      			i += 2;
      		} else {
      			c1 = utftext.charCodeAt(i + 1);
      			c2 = utftext.charCodeAt(i + 2);
      			string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      			i += 3;
      		}
      	}
      	return string;
      }
    }
  }
</script>
<style>
	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.afOrderLinkTwoInput .el-form-item__content {
		line-height: 30px !important;
	}

	.widthWithKG .el-input-group__append {
		padding: 0 10px;
	}

	.widthWithKG .el-input__inner {
		line-height: 29px !important;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.hawbQuantity .el-input-group__prepend {
		background-color: #409EFF;
		color: #FFF;
		border: 1px solid #409EFF;
	}


</style>
