<template>
	<!-- <el-dialog title="" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;"> -->
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div class="orderEditPage" style="width: 1280px;">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">出口订单&nbsp;-&nbsp;复制新增</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="orderCode">
							<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
								<template slot="prepend">业务单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="coopName">
							<el-input class="widthWithFourWithXing arrivalStationForAESave" readOnly v-model="ruleForm.coopName" style="width:615px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>客户名称</span>
								</template>
								<el-button slot="append" @click="selectCustomer" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>

					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="salesId">
							<el-input class="widthWithFourWithXing" style="width:295px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>责任销售</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.salesId" filterable placeholder="请选择" @change="setSalesName" style="width:198px;margin-right: -5px;">
									<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
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
						<el-form-item prop="awbNumber">
							<el-input v-model="ruleForm.awbNumber" clearable maxlength="12" @input="formatToFloat('awbNumber')" @change="changeAwbNumber" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>主运单号</span>
								</template>
								<el-button slot="append" @click="awbNumberSelect" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item prop="customerNumber">
							<el-input v-model="ruleForm.customerNumber" @change="ruleForm.customerNumber=strTrim(ruleForm.customerNumber).toUpperCase()" auto-complete="off" maxlength="20" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>客户单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<!--<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>客户联系人</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.orderContacts" multiple placeholder="请选择联系人" style="width:198px;margin-right: -5px;">
									<el-option v-for="item in contactsOptions" :key="item.contacts_id" :label="item.contacts_name" :value="item.contacts_id">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>-->
          <el-col class="elementWidth">
            <el-form-item>
              <el-input auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
                <template slot="prepend">
                  <span>工作组</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.workgroupId" placeholder="请选择工作组" style="width:212px;margin-right: -5px;" clearable>
                  <el-option v-for="item in workgroups" :key="item.workgroupId" :label="item.workgroupName" :value="item.workgroupId">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item prop="servicerId">
							<el-input class="widthWithFourWithXing" style="width:295px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>责任客服</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.servicerId" filterable placeholder="请选择" @change="setServicerName" style="width:198px;margin-right: -5px;">
									<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<div style="padding:0px 0px 20px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="departureStation">
							<el-input class="widthWithThree"  style="width: 295px;margin-right: 15px;">
								<template slot="prepend">
									<span>始发港</span>
								</template>
                <el-select slot="suffix"  clearable   remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm.departureStation"
                           @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()"
                           @keydown.native="keydownEvent"
                           placeholder="请输入关键词" style="width:210px;margin-right: -5px;" >
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
						<el-form-item prop="arrivalStation">
							<el-input class="widthWithThreeWithXing arrivalStationForAESave" style="width: 295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>目的港</span>
								</template>

                <el-select slot="suffix"   remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm.arrivalStation"
                           @input="ruleForm.arrivalStation = ruleForm.arrivalStation.toUpperCase()"
                           @keydown.native="currentSelectKey='arrivalStation'"
                           placeholder="请输入关键词" style="width:210px;margin-right: -5px;" >
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
						<el-form-item prop="expectFlight">
							<el-input class="widthWithThree" v-model="ruleForm.expectFlight" clearable @change="ruleForm.expectFlight=strTrim(ruleForm.expectFlight).toUpperCase()" maxlength="8" auto-complete="off" style="width: 295px;margin-right: 15px;">
								<template slot="prepend">
									<span>航班号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="expectDeparture">
							<el-input class="widthWithFourWithXing expectDepartureForAESave" style="width:295px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>航班日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.expectDeparture" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择航班日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="transitStation">
							<el-input class="widthWithThreeWithXing"  style="width: 295px;margin-right: 15px;">
								<template slot="prepend">
									<span>中转港1</span>
								</template>
                <el-select slot="suffix" clearable  remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm.transitStation"
                           @input="ruleForm.transitStation = ruleForm.transitStation.toUpperCase()"
                           @keydown.native="currentSelectKey='transitStation'"
                           placeholder="请输入关键词" style="width:210px;margin-right: -5px;" >
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
						<el-form-item prop="transitStation2">
							<el-input class="widthWithThreeWithXing"  style="width: 295px;margin-right: 15px;">
								<template slot="prepend">
									<span>中转港2</span>
								</template>
                <el-select slot="suffix" clearable  remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm.transitStation2"
                           @input="ruleForm.transitStation2 = ruleForm.transitStation2.toUpperCase()"
                           @keydown.native="currentSelectKey='transitStation2'"
                           placeholder="请输入关键词" style="width:210px;margin-right: -5px;" >
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
						<el-form-item prop="goodsSourceCode">
							<el-input class="widthWithThree" style="width: 295px;margin-right: 15px;">
								<template slot="prepend">
									<span>货源地</span>
								</template>
                <el-select slot="suffix" clearable   remote :filter-method="searchCity" filterable  :loading="loading" v-model="ruleForm.goodsSourceCode"
                           @input="ruleForm.goodsSourceCode = ruleForm.goodsSourceCode.toUpperCase()"
                           @keydown.native="currentSelectKey='goodsSourceCode'"
                           placeholder="请输入关键词" style="width:210px;margin-right: -5px;" >
                  <el-option v-for="item in cityList" :key="item.cityCode" :value="item.cityCode">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.cityCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.cityNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.nationNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="businessProduct">
							<el-input auto-complete="off" style="width:295px;">
								<template slot="prepend">
									<span>服务产品</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.businessProduct" filterable placeholder="请选择" style="width:198px;margin-right: -5px;" clearable>
									<el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="planPieces">
							<el-input class="widthWithFourWithXing" @change="ruleForm.planPieces=strTrim(ruleForm.planPieces)" @input="formatToFloat('planPieces')" maxlength="8" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>预报件数</span>
								</template>
								<el-select slot="append" v-model="ruleForm.packageType" clearable placeholder="包装" style="width:85px;">
									<el-option v-for="item in packageTypeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="planWeight">
							<el-input class="widthWithFourWithXing" @input="formatToFloat('planWeight')" @change="setPlanChargeWeight();formatDecimalPlaces('planWeight')" maxlength="10" v-model="ruleForm.planWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>预报毛重</span>
								</template>
								<template slot="append">
									<span>KG</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="planVolume">
							<el-input class="widthWithFourWithXing" @input="formatToFloat('planVolume')" maxlength="10" @change="setPlanChargeWeight();formatDecimalPlaces('planVolume')" v-model="ruleForm.planVolume" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>预报体积</span>
								</template>
								<template slot="append">
									<span>CBM</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item prop="planChargeWeight">
							<el-input readOnly v-model="ruleForm.planChargeWeight" auto-complete="off" style="width:295px;">
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
					<el-col class="elementWidth">
						<el-form-item prop="planDimensions">
							<el-input v-model="ruleForm.planDimensions" auto-complete="off" style="width:935px;margin-right: 15px;" readOnly>
								<template slot="prepend">
									<span>预报尺寸</span>
								</template>
								<el-button slot="append" @click="gotoSizePage" icon="el-icon-edit"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input readOnly v-model="ruleForm.planDensity" auto-complete="off" style="width:295px;">
								<template slot="prepend">
									<span>预报密度</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="orderRemark">
							<el-input class="showWordLimit" v-model="ruleForm.orderRemark" @change="ruleForm.orderRemark=strTrim(ruleForm.orderRemark)" auto-complete="off" style="width:1255px" clearable show-word-limit maxlength="200">
								<template slot="prepend">
									<span>订单备注</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div style="padding:0px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<div style="padding:0px 0px 0px 30px">
					<span>价格信息</span>
					<el-button type="text" size="small" v-if=showFlag3 v-on:click="showFlag3=false">收起<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" size="small" v-if=!showFlag3 v-on:click="showFlag3=true">展开<i class="el-icon-arrow-up"></i></el-button>
					<el-row v-show="showFlag3" style="margin-top: 20px;">
						<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
							<el-form-item prop="currecnyCode">
								<el-input auto-complete="off" style="width:200px;">
									<template slot="prepend">
										<span>运费卖价</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.currecnyCode" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
										<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
										</el-option>
									</el-select>
								</el-input>
								<el-input v-model="ruleForm.priceValue" auto-complete="off" @input="formatToFloat('priceValue')" maxlength="13" style="width:105px;margin-left: -5px;margin-right: 15px;" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input auto-complete="off" style="width:200px;margin-right: 15px;">
									<template slot="prepend">
										<span>卖价形式</span>
									</template>
									<el-select slot="suffix" v-model="priceType" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
										<el-option label="单价" value="单价"></el-option>
										<el-option label="总价" value="总价"></el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="showWordLimit" v-model="ruleForm.freightProfitRatioRemark" auto-complete="off" style="width:547px" clearable show-word-limit maxlength="200">
									<template slot="prepend">
										<span>客户分泡</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag3">
						<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
							<el-form-item prop="msrCurrecnyCode">
								<el-input auto-complete="off" style="width:200px;">
									<template slot="prepend">
										<span>运费成本</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.msrCurrecnyCode" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
										<el-option v-for="item in msrCurrecnyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
										</el-option>
									</el-select>
								</el-input>
								<el-input v-model="ruleForm.priceValue2" auto-complete="off" @input="formatToFloat('priceValue2')" maxlength="13" style="width:105px;margin-left: -5px;margin-right: 15px;" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input auto-complete="off" style="width:200px;margin-right: 15px;">
									<template slot="prepend">
										<span>成本形式</span>
									</template>
									<el-select slot="suffix" v-model="priceType2" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
										<el-option label="单价" value="单价"></el-option>
										<el-option label="总价" value="总价"></el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="showWordLimit" v-model="ruleForm.msrProfitRatioRemark" auto-complete="off" style="width:547px" clearable show-word-limit maxlength="200">
									<template slot="prepend">
										<span>成本分泡</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag3">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item>
								<el-input auto-complete="off" style="width:200px;margin-right: 15px;">
									<template slot="prepend">
										<span>运费支付</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.paymentMethod" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
										<el-option label="PP" value="PP"></el-option>
										<el-option label="CC" value="CC"></el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 104px;">
							<el-form-item>
								<el-input auto-complete="off" style="width:200px;">
									<template slot="prepend">
										<span>杂费支付</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.paymentMethodOther" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
										<el-option label="PP" value="PP"></el-option>
										<el-option label="CC" value="CC"></el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag3">
						<el-col style="margin-left: 50px;">
							<el-form-item>
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>价格备注</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" :rows="3" show-word-limit maxlength="500" v-model="ruleForm.priceRemark" auto-complete="off" style="width:1102px">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div style="padding:10px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<div style="padding:0px 0px 0px 30px">
					<span v-if="ruleForm.hawbQuantity==0">制单信息(直单)</span>
					<span v-else>制单信息({{ruleForm.hawbQuantity}}分)</span>
					<el-button type="text" size="small" v-if=showFlag1 v-on:click="showFlag1=false">收起<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" size="small" v-if=!showFlag1 v-on:click="showFlag1=true">展开<i class="el-icon-arrow-up"></i></el-button>
					<el-row v-show="showFlag1">
						<el-row>
							<el-col class="elementWidth" style="margin-left: 50px;">
								<el-button type="text" style="margin-left: 20px;color:#409EFF">主运单信息</el-button>
								<el-button @click="shipperLetterEdit()" icon="el-icon-edit" type="text">编辑</el-button>
							</el-col>
						</el-row>
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>发货人信息</el-button>
								<el-button @click="gotoShipperConsigneePage(0)" icon="el-icon-edit" type="text">编辑</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input type="textarea" v-model="ruleForm.afOrderShipperConsignee2.scPrintRemark" @input="ruleForm.afOrderShipperConsignee2.scPrintRemark = ruleForm.afOrderShipperConsignee2.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:520px">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>收货人信息</el-button>
								<el-button @click="gotoShipperConsigneePage(1)" icon="el-icon-edit" type="text">编辑</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input type="textarea" v-model="ruleForm.afOrderShipperConsignee1.scPrintRemark" @input="ruleForm.afOrderShipperConsignee1.scPrintRemark = ruleForm.afOrderShipperConsignee1.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:520px">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
					</el-row>
					<el-row v-show="showFlag1">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>通知人信息</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input class="showWordLimit" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.notifierRemark" auto-complete="off" :rows="5" style="width:520px" @input="ruleForm.notifierRemark = ruleForm.notifierRemark.toUpperCase()">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>目的港代理</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input type="textarea" class="showWordLimit" show-word-limit maxlength="500" v-model="ruleForm.arrivalAgent" auto-complete="off" :rows="5" style="width:520px" @input="ruleForm.arrivalAgent = ruleForm.arrivalAgent.toUpperCase()">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
					</el-row>
					<el-row v-show="showFlag1">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item prop="goodsNameCn">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>中文品名</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameCn" @change="ruleForm.goodsNameCn=strTrim(ruleForm.goodsNameCn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 540px;" show-word-limit></el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item prop="goodsNameEn" style="margin-left: 12px;">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>英文品名</el-button>
									<el-checkbox style="margin-left: 36px;" v-model="ruleForm.isConsol" @change="changeIsConsol">CONSOL</el-checkbox>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameEn" @change="ruleForm.goodsNameEn=strTrim(ruleForm.goodsNameEn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 540px;" show-word-limit></el-input>
							</el-form-item>
						</el-col>

					</el-row>

					<el-row v-show="showFlag1">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item prop="shippingMarks">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>唛头信息</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.shippingMarks" auto-complete="off" :rows="3" maxlength="500" style="width: 540px;" show-word-limit @input="ruleForm.shippingMarks = ruleForm.shippingMarks.toUpperCase()"></el-input>
							</el-form-item>
						</el-col>

						<el-col class="elementWidth" style="margin-left: 12px;">
							<el-form-item prop="handlingInfo">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>Handling&nbsp;Info</el-button>
									<el-checkbox style="margin-left: 10px;" v-model="ruleForm.isNoSolidWood" @change="changeIsNoSolidWood">非木</el-checkbox>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.handlingInfo" auto-complete="off" :rows="3" maxlength="500" style="width: 540px;" show-word-limit @input="ruleForm.handlingInfo = ruleForm.handlingInfo.toUpperCase()"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag1">
						<el-row>
							<el-col class="elementWidth" style="margin-left: 50px;">
								<el-button type="text" style="margin-left: 20px;color:#409EFF">分单信息</el-button>
								<el-button @click="shipperLetterEdit()" icon="el-icon-edit" type="text">编辑</el-button>
							</el-col>
						</el-row>
						<el-col class="elementWidth" style="margin-left: 50px;margin-top: 20px;">
							<el-table :data="ruleForm.shipperLetters" stripe border style="width:1103px">
								<el-table-column align="center" width="90">
									<template slot="header" slot-scope="scope">
										<i class="iconfont el-icon-myyuanquanjiahao" @click="addHawb" style="cursor: pointer;size: b5;color: #409EFF;"></i>
									</template>
									<template slot-scope="scope">
										<i class="iconfont el-icon-myjianhao" @click="deleteHawb(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
									</template>
								</el-table-column>
								<el-table-column align="center" label="分运单号" width="150">
									<template slot-scope="scope">
										<el-input size="small" v-model="scope.row.hawbNumber" maxlength="12" @input="scope.row.hawbNumber=scope.row.hawbNumber.toUpperCase()" clearable></el-input>
									</template>
								</el-table-column>
								<el-table-column align="center" label="分单品名">
									<template slot-scope="scope">
										<el-input size="small" v-model="scope.row.goodsNameCn" clearable></el-input>
									</template>
								</el-table-column>
								<el-table-column align="center" label="件数" width="130">
									<template slot-scope="scope">
										<el-input size="small" v-model="scope.row.planPieces" @input="checkInt(scope.row,'planPieces')" clearable>
										</el-input>
									</template>
								</el-table-column>
								<el-table-column align="center" label="毛重" width="160">
									<template slot-scope="scope">
										<el-input class="widthWithKG" size="small" v-model="scope.row.planWeight" @input="checkFloat(scope.row,'planWeight')" clearable>
											<i slot="append">KG</i>
										</el-input>
									</template>
								</el-table-column>
								<el-table-column align="center" label="分单目的港" width="130">
									<template slot-scope="scope">
										<el-input size="small" v-model="scope.row.arrivalStation" @change="scope.row.arrivalStation=strTrim(scope.row.arrivalStation).toUpperCase().substr(0,3)" clearable></el-input>
									</template>
								</el-table-column>
								<el-table-column align="center" width="80">
									<template slot-scope="scope">
										<el-button type="primary" size="mini" @click="shipperLetterEdit(scope.$index)">详情</el-button>
									</template>
								</el-table-column>

							</el-table>
						</el-col>
					</el-row>
				</div>
				<div style="padding:10px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<div style="padding:0px 0px 0px 30px">
					<span>操作详情</span>
					<el-button type="text" size="small" v-if=showFlag2 v-on:click="showFlag2=false">收起<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" size="small" v-if=!showFlag2 v-on:click="showFlag2=true">展开<i class="el-icon-arrow-up"></i></el-button>
					<el-row v-show="showFlag2" style="margin-top: 20px;">
						<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
							<el-form-item prop="goodsType">
								<el-input style="width:265px;">
									<template slot="prepend">
										<span>货物类型</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.goodsType" clearable placeholder="请选择货物类型" style="width:168px;margin-right: -5px;">
										<el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item prop="batteryType">
								<el-input style="width:266px;margin-right: 15px;">
									<template slot="prepend">
										<span>电池情况</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.batteryType" clearable placeholder="请选择电池情况" style="width:169px;margin-right: -5px;">
										<el-option v-for="item in batteryTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item prop="customsStatusCode">
								<el-input style="width:255px;">
									<template slot="prepend">
										<span>海关代码</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.customsStatusCode" clearable placeholder="请选择海关代码" style="width:158px;margin-right: -5px;">
										<el-option v-for="item in codeOptions" :key="item.code" :label="item.label" :value="item.code">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="showWordLimit" v-model="ruleForm.airborneDocument" auto-complete="off" style="width:272px;margin-right: 15px;" clearable show-word-limit maxlength="200">
									<template slot="prepend">
										<span>随机文件</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag2">
						<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
							<el-form-item prop="appraisalCompany">
								<el-input class="showWordLimit" @input="ruleForm.appraisalCompany = ruleForm.appraisalCompany.toUpperCase()" v-model="ruleForm.appraisalCompany" auto-complete="off" style="width:265px;" clearable show-word-limit maxlength="200">
									<template slot="prepend">
										<span>鉴定单位</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item prop="dangerousType">

								<el-input class="showWordLimit" @input="ruleForm.dangerousType = ruleForm.dangerousType.toUpperCase()" v-model="ruleForm.dangerousType" auto-complete="off" style="width:266px;margin-right: 15px;" clearable show-word-limit maxlength="40">
									<template slot="prepend">
										<span>危品类项</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>

						<el-col class="elementWidth">
							<el-form-item>
								<el-input class="widthWithThree showWordLimit" @input="ruleForm.appraisalNote = ruleForm.appraisalNote.toUpperCase()" v-model="ruleForm.appraisalNote" auto-complete="off" style="width:537px;margin-right: 15px;" clearable show-word-limit maxlength="200">
									<template slot="prepend">
										<span>鉴定号</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag2" style="margin-top: 20px;">
						<el-tabs style="width: 1103px;height:280px;margin-left: 50px;" type="border-card" v-model="activeOperationName">
							<el-tab-pane name="first">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.pickUpDeliveryService" @change="changeActiveOperationName('TH')"></el-checkbox>提货服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.pickUpDeliveryService" v-model="ruleForm.pickUpDeliveryCompany" auto-complete="off" style="width:300px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>提货公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.pickUpDeliveryService" v-model="ruleForm.pickUpAddress" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>提货地址</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;margin-right: 15px;">
												<template slot="prepend">
													<span>提货日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.pickUpDeliveryService" slot="suffix" v-model="ruleForm.pickUpDeliveryDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择送货日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.pickUpDeliveryService" v-model="ruleForm.pickUpDeliveryAddress" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>送货地址</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>提货备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.pickUpDeliveryService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.pickUpDeliveryRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="second">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.warehouseService" @change="changeActiveOperationName('KN')"></el-checkbox>库内操作
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;margin-right: 15px;">
												<template slot="prepend">
													<span>普货库房</span>
												</template>
												<el-select :disabled="!ruleForm.warehouseService" slot="suffix" v-model="ruleForm.departureStorehouseId" placeholder="请选择" clearable style="width: 238px;margin-right: -5px;height: 30px;">
													<el-option v-for="item in departureStorehouseOptions" :key="item.warehouseId" :label="item.warehouseNameCn" :value="item.warehouseId">
													</el-option>
												</el-select>
											</el-input>
										</el-form-item>
									</el-col>

									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.warehouseService" v-model="ruleForm.warehouseOperator" auto-complete="off" style="width:335px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>操作公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;">
												<template slot="prepend">
													<span>入库日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.warehouseService" slot="suffix" v-model="ruleForm.inboundDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择入库日期" style="width: 238px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.warehouseService" v-model="ruleForm.damageRemark" auto-complete="off" style="width:695px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>破损记录</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;">
												<template slot="prepend">
													<span>出库日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.warehouseService" slot="suffix" v-model="ruleForm.outboundDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择出库日期" style="width: 238px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>库内操作备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.warehouseService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.operationRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="third">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.outfieldService" @change="changeActiveOperationName('WC')"></el-checkbox>外场操作
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.outfieldService" v-model="ruleForm.outfieldDeliveryCompany" auto-complete="off" style="width:335px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>送货公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" @input="ruleForm.outfieldTruckNumber = ruleForm.outfieldTruckNumber.toUpperCase()" :disabled="!ruleForm.outfieldService" v-model="ruleForm.outfieldTruckNumber" auto-complete="off" style="width:335px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>车牌号码</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.outfieldService" v-model="ruleForm.outfieldDriver" auto-complete="off" style="width:335px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>司机信息</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;margin-right: 15px;">
												<template slot="prepend">
													<span>到货日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.outfieldService" slot="suffix" v-model="ruleForm.receiptDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择到货日期" style="width: 238px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;margin-right: 15px;">
												<template slot="prepend">
													<span>交货货站</span>
												</template>
												<el-select :disabled="!ruleForm.outfieldService" slot="suffix" v-model="ruleForm.departureWarehouseId" filterable placeholder="请选择" clearable style="width: 238px;margin-right: -5px;"
                                   @focus="sychronizeWareAndStore('update')"
                        >
													<el-option v-for="item in departureWarehouseOptions" :key="item.warehouseId" :label="item.warehouseNameCn" :value="item.warehouseId">
													</el-option>
												</el-select>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.outfieldService" v-model="ruleForm.buildUpCompany" auto-complete="off" style="width:335px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>打板代理</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>外场操作备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.outfieldService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.outfieldRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="fourth">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.customsClearanceService" @change="changeActiveOperationName('BG')"></el-checkbox>报关服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsClearanceCompany" auto-complete="off" style="width:335px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>报关代理</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;margin-right: 15px;">
												<template slot="prepend">
													<span>查验日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.customsClearanceService" slot="suffix" v-model="ruleForm.customsInspectionDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择查验日期" style="width: 238px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;">
												<template slot="prepend">
													<span>放行日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.customsClearanceService" slot="suffix" v-model="ruleForm.customsClearanceDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择放行日期" style="width: 238px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsInspectionRemark" auto-complete="off" style="width:1055px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>查验记录</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>报关备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.customsClearanceService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.customsDeclaresRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="fifth">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.arrivalCustomsClearanceService" @change="changeActiveOperationName('QG')"></el-checkbox>目的港清关
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.arrivalCustomsClearanceService" v-model="ruleForm.arrivalCustomsClearanceCompany" auto-complete="off" style="width:405px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>清关代理</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;margin-right: 15px;">
												<template slot="prepend">
													<span>查验日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.arrivalCustomsClearanceService" slot="suffix" v-model="ruleForm.arrivalCustomsInspectionDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择查验日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;">
												<template slot="prepend">
													<span>放行日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.arrivalCustomsClearanceService" slot="suffix" v-model="ruleForm.arrivalCustomsClearanceDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择放行日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.arrivalCustomsClearanceService" v-model="ruleForm.arrivalCustomsInspectionRemark" auto-complete="off" style="width:1055px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>查验记录</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>清关备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.arrivalCustomsClearanceService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.arrivalCustomsDeclaresRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="sixth">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.deliveryService" @change="changeActiveOperationName('PS')"></el-checkbox>目的港派送
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.deliveryService" v-model="ruleForm.deliveryCompany" auto-complete="off" style="width:300px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>卡车公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.deliveryService" class="widthWithFourWithXG showWordLimit" v-model="ruleForm.deliveryDriver" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>车辆/司机</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.deliveryService" class="widthWithFive showWordLimit" v-model="ruleForm.deliverySigner" auto-complete="off" style="width:300px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>收货人信息</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.deliveryService" v-model="ruleForm.deliveryAddress" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>送货地址</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-row>
											<el-col class="elementWidth">
												<el-form-item>
													<el-input style="width:300px;">
														<template slot="prepend">
															<span>送货日期</span>
														</template>
														<el-date-picker :disabled="!ruleForm.deliveryService" slot="suffix" v-model="ruleForm.deliveryDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择送货日期" style="width: 203px;margin-right: -5px;">
														</el-date-picker>
													</el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row>
											<el-col class="elementWidth">
												<el-form-item>
													<el-input style="width:300px;">
														<template slot="prepend">
															<span>签收日期</span>
														</template>
														<el-date-picker :disabled="!ruleForm.deliveryService" slot="suffix" v-model="ruleForm.deliverySignDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择签收日期" style="width: 203px;margin-right: -5px;">
														</el-date-picker>
													</el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row></el-row>
									</el-col>
									<el-col class="elementWidth">
										<div style="position: relative;left: 15px;top: -11px;">
											<el-row>
												<el-button type="text" style="margin-left: 20px;margin-top: -20px;margin-bottom:-10px;" disabled>送货备注</el-button>
											</el-row>
											<el-row>
												<el-col class="elementWidth">
													<el-form-item>
														<el-input class="showWordLimit" :disabled="!ruleForm.deliveryService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.deliveryRemark" auto-complete="off" :rows="3" style="width: 730px;">
														</el-input>
													</el-form-item>
												</el-col>
											</el-row>
										</div>
									</el-col>
								</el-row>
							</el-tab-pane>
						</el-tabs>
					</el-row>
				</div>
				<div style="padding:10px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>

				<el-row>
					<el-form-item>
						<el-button :loading="loading" type="primary" size="small" @click="submitForm('ruleForm')">复制</el-button>
					</el-form-item>
				</el-row>
			</el-form>
			<save ref="addMission" v-if="save" :visible.sync="save" :frow="ffrow"></save>
			<save2 ref="addMission" v-if="save2" :visible.sync="save2" :frow="ffrow"></save2>
			<saveawb ref="addMission" v-if="saveawb" :visible.sync="saveawb" :frow="ffrow"></saveawb>
			<shipperConsignee2 ref="addMission" v-if="shipperConsignee2" :visible.sync="shipperConsignee2" :frow="ffrow"></shipperConsignee2>
			<awbNumber ref="addMission" v-if="awbNumberVisible" :visible.sync="awbNumberVisible" :frow="ffrow"></awbNumber>
			<shipperLetter ref="addMission" v-if="shipperLetterVisible" :visible.sync="shipperLetterVisible" :frow="ffrow" @shipperLetterCallback="shipperLetterCallback"></shipperLetter>
		</div>

	</el-dialog>
</template>
<script>
	import save from '@/views/public/customer_select'
	import save2 from '@/views/public/size_edit'
	import saveawb from './af_order_awb_save'
	import shipperConsignee2 from '@/views/public/shipper_consignee_select'
	import AwbNumber from '@/views/public/awbNumber_select'
	import shipperLetter from './shipperLetter/af_order_shipper_letter'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			var checkNumber1 = (rule, value, callback) => {
				let regE = /^[1-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位大于0的整数'));
				} else {
					callback();
				}
			};
			var checkNumber3 = (rule, value, callback) => {
				let regE = /^[0-9]\d{0,3}$/;
				if (!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if (value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			};
			const validateAirport = (rule, value, callback) => {
				if ((value || "").length == 0) {
					return callback();
				}
				let params = {
					apCode: value
				};
				this.$axios.post2('/afbase/airport/checkCode', params)
					.then(function(response) {
						if (response.data.data.length == 0) {
							callback(new Error(rule.message || '港口信息不存在，请确认'));
						} else {
							callback();
						}
					});
			};
			const validateGoodsSourceCode = (rule, value, callback) => {
				if ((value || "").length == 0) {
					return callback();
				}
				let params = {
					cityCode: value
				};
				this.$axios.get2('/afbase/airport/getAirport', params)
					.then(function(response) {
						if (!response.data.data || "{}" == JSON.stringify(response.data.data)) {
							callback(new Error(rule.message || '数据信息不存在，请确认'));
						} else {
							callback();
						}
					});
			};
			return {
				loading: false,
				helpDocumentUrl: '',
				data1: [],
				options2: [],
				contactsOptions: [],
				useroptions: [],
				productOptions: [],
				transitClauseOptions: [],
				goodsTypeOptions: [],
				appraisalCompanyOptions: [],
				batteryTypeOptions: [],
				departureWarehouseOptions: [],
				departureStorehouseOptions: [],
				packageTypeOptions: [],
				paymentMethodOptions: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions: [],
				codeOptions: [],
        workgroups: [],
				showFlag1: false,
				showFlag2: false,
				showFlag4: false,
				showFlag3: false,
				save: false,
				save2: false,
				saveawb: false,
				shipperConsignee2: false,
				awbNumberVisible: false,
				shipperLetterVisible: false,
				disabledFlag: false,
				priceValueFlag: false,
				hawbQuantityIfExpand: false,
				ifFullscreen: false,
				style: {},
				activeOperationName: 'first',
				ffrow: {
					awbFromType: ''
				},
				priceType2: "单价",
				priceType: "单价",
				orderAeDigitsWeight: 1,
				orderAeDigitsVolume: 3,
				orderAeDigitsChargeWeight: 2,
				ruleForm: {
					pickUpDeliveryService: false,
					pickUpDeliveryCompany: '',
					pickUpAddress: '',
					pickUpDeliveryDate: '',
					pickUpDeliveryAddress: '',
					pickUpDeliveryRemark: '',

					warehouseService: false,
					warehouseOperator: '',
					inboundDate: '',
					outboundDate: '',
					damageRemark: '',
					operationRemark: '',

					outfieldService: false,
					outfieldDeliveryCompany: '',
					outfieldTruckNumber: '',
					outfieldDriver: '',
					receiptDate: '',
					buildUpCompany: '',
					outfieldRemark: '',

					customsClearanceService: false,
					customsClearanceCompany: '',
					customsInspectionDate: '',
					customsClearanceDate: '',
					customsInspectionRemark: '',
					customsDeclaresRemark: '',

					arrivalCustomsClearanceService: false,
					arrivalCustomsClearanceCompany: '',
					arrivalCustomsInspectionDate: '',
					arrivalCustomsClearanceDate: '',
					arrivalCustomsInspectionRemark: '',
					arrivalCustomsDeclaresRemark: '',

					deliveryService: false,
					deliveryCompany: '',
					deliveryDriver: '',
					deliverySigner: '',
					deliveryAddress: '',
					deliveryDate: '',
					deliverySignDate: '',
					deliveryRemark: '',
					orderCode: '',
					projectId: '',
					projectName: '',
					salesName: '',
					servicerName: '',
					coopId: '',
					coopName: '',
					servicerId: '',
					salesId: '',
					awbNumber: '',
					orderContacts: [],
					customerNumber: '',
					isConsol: false,
					isNoSolidWood: false,
					hawbFlag: '直单',
					hawbQuantity: 0,
					departureStation: '',
					transitStation: '',
					transitStation2: '',
					arrivalStation: '',
					expectFlight: '',
					expectDeparture: '',
					expectArrival: '',
					businessProduct: '',

					goodsType: '普货',
					goodsNameCn: '',
					goodsNameEn: '',
					batteryType: '',
					departureWarehouseId: '',
					departureStorehouseId: '',
					planPieces: '0',
					packageType: '',
					planWeight: '0',
					planChargeWeight: '0',
					planVolume: '0',
					planDimensions: '',
					planDensity: '',
					currecnyCode: 'CNY',
					msrCurrecnyCode: this.frow.msrCurrecnyCode,
					priceValue: '',
					freightUnitprice: '',
					freightAmount: '',
					shipperLetters: [],
					priceValue2: '',
					msrUnitprice: '',
					msrAmount: '',
					appraisalNote: '',
					airborneDocument: '',
					shippingMarks: '',
					handlingInfo: '',
					customsStatusCode: '',
					orderRemark: '',
					freightProfitRatioRemark: '',
					msrProfitRatioRemark: '',
					priceRemark: '',
					notifierRemark: '',
					arrivalAgent: '',
					appraisalCompany: '',
					dangerousType: '',
					paymentMethod: 'PP',
					paymentMethodOther: 'PP',
					undgCode: '',
					undgContactName: '',
					undgContactCommunicationType: 'TE',
					undgContactCommunicationNo: '',
					loadingDate: '',
					partialShipment: false,
					afOrderShipperConsignee1: {
						scType: 1,
						scName: '',
						scPrintRemark: ''
					},
					afOrderShipperConsignee2: {
						scType: 0,
						scName: '',
						scPrintRemark: ''
					},
					goodsSourceCode: '',
          workgroupId: '',

				},
				rules: {

					coopName: [{
						required: true,
						message: '请选择客户名称',
						trigger: ['blur', 'change']
					}],
					arrivalStation: [{
						required: true,
						message: '请输入目的港',
						trigger: ['blur', 'change']
					}],
					expectDeparture: [{
						required: true,
						message: '请选择航班日期',
						trigger: ['blur', 'change']
					}],
					planPieces: [{
						required: true,
						message: '请输入预报件数',
						trigger: ['blur', 'change']
					}],
					planWeight: [{
						required: true,
						message: '请输入预报毛重',
						trigger: ['blur', 'change']
					}],
					planVolume: [{
						required: true,
						message: '请输入预报体积',
						trigger: ['blur', 'change']
					}],
					orderRemark: [{
						min: 0,
						max: 500,
						message: '订单备注长度为 500',
						trigger: ['blur', 'change']
					}],
					expectFlight: [{
						min: 2,
						max: 8,
						message: '航班号长度为2~8位',
						trigger: ['blur', 'change']
					}],
					transitStation: [{
						message: '中转港1不存在，请确认',
						validator: validateAirport,
						trigger: 'blur'
					}],
					transitStation2: [{
						message: '中转港2不存在，请确认',
						validator: validateAirport,
						trigger: 'blur'
					}],
					goodsSourceCode: [{
						message: '货源地不存在，请确认',
						validator: validateGoodsSourceCode,
						trigger: 'blur'
					}]
				},
        airportList: [],
        cityList: [],
        currentSelectKey: '',
			};
		},
		inject: ['findByPage', 'continueOperation'],
		components: {
			'save': save,
			'save2': save2,
			'saveawb': saveawb,
			'shipperConsignee2': shipperConsignee2,
			'awbNumber': AwbNumber,
			shipperLetter
		},
		provide() {
			return {
				setValue: this.setValue,
				sizeEditCallBack: this.sizeEditCallBack,
				submitForm2: this.submitForm3,
				setShipperConsigneeValue2: this.setShipperConsigneeValue2,
				awbNumberSelectCallBack: this.awbNumberSelectCallBack
			}
		},
		methods: {
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			awbFromTypeChange() {
				this.ruleForm.awbFromId = '';
				this.ruleForm.awbFromName = '';
			},
			selectCustomer() {
				this.ffrow.businessScope = 'AE'
				this.save = true;
			},
			awbNumberSelect() {
				this.ffrow.awbNumber = this.ruleForm.awbNumber
				this.ffrow.departureStation = this.ruleForm.departureStation
				this.awbNumberVisible = true;
			},
			awbNumberSelectCallBack(val) {
				this.ruleForm.awbNumber = val.awbNumber
				if (this.ruleForm.departureStation == '') {
					this.ruleForm.departureStation = val.departureStation
				}
				//更新分单信息里的主单号
				this.changeAwbNumber()
			},
			changeAwbNumber() {
				this.ruleForm.shipperLetters.forEach(shipperLetter => {
					shipperLetter.awbNumber = this.ruleForm.awbNumber
				})
			},
			gotoSizePage() {
				this.ffrow.planDimensions = this.ruleForm.planDimensions;
				this.ffrow.position = '空运出口订单'
				this.save2 = true;
			},
			queryContactsList(coopId) {
				let params = {
					coopId: coopId
				}
				this.$axios.get2('/prm/coop/queryContactsIsValid',
						params)
					.then(function(response) {
						this.contactsOptions = response.data.data;
						if (this.contactsOptions != null && this.contactsOptions.length > 0) {
							this.ruleForm.orderContacts.push(this.contactsOptions[0].contacts_id)
						}
					}.bind(this));
			},
			setValue(rrow) {
				this.ruleForm.orderContacts = [];
				this.ruleForm.coopId = rrow.coopId;
				this.ruleForm.coopName = rrow.coopName;
				this.queryContactsList(rrow.coopId)
				//更新责任销售
				this.$axios.get('/prm/coop/' + rrow.coopId).then((response) => {
					if (response.data.code == 0 && response.data.data != null && response.data.data.transactor_id != null) {
						this.ruleForm.salesId = response.data.data.transactor_id
						this.setSalesName(response.data.data.transactor_id)
					} else {
						let userId = window.localStorage.getItem('userId')
						if (userId != null && userId !== '') {
							this.ruleForm.salesId = parseInt(userId)
							this.setSalesName(parseInt(userId))
						}
					}
				})
			},
			sizeEditCallBack(row) {
				this.ruleForm.planDimensions = row.value
				this.ruleForm.planPieces = row.pieces
				this.ruleForm.planVolume = row.volume / 1000000
				this.setPlanChargeWeight()
				this.ruleForm.planVolume = (row.volume / 1000000).toFixed(this.orderAeDigitsVolume);
			},
			setPlanChargeWeight() {
				let planChargeWeight = this.ruleForm.planVolume * 1000000 / 6000;
				if (this.ruleForm.planWeight > planChargeWeight) {
					this.ruleForm.planChargeWeight = parseFloat(this.ruleForm.planWeight + "").toFixed(this.orderAeDigitsChargeWeight)
				} else {
					this.ruleForm.planChargeWeight = planChargeWeight.toFixed(this.orderAeDigitsChargeWeight);
				}
				if (this.ruleForm.planVolume != null && this.ruleForm.planVolume !== '' && parseFloat(this.ruleForm.planVolume + '') != 0 && this.ruleForm.planWeight != null && this.ruleForm.planWeight !== '') {
					this.ruleForm.planDensity = parseFloat(this.ruleForm.planWeight + '') / parseFloat(this.ruleForm.planVolume + '') + ''
					this.ruleForm.planDensity = this.ruleForm.planDensity.split('.')[0]
				} else {
					this.ruleForm.planDensity = ''
				}
			},
			gotoShipperConsigneePage(scType) {
				this.ffrow.scType = scType;
				if (scType === 1) {
					this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee1;
				} else {
					this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee2;
				}

				this.shipperConsignee2 = true;
			},
			setShipperConsigneeValue2(rrow) {
				if (rrow.scType === 1) {
					this.ruleForm.afOrderShipperConsignee1.scType = 1;
					this.ruleForm.afOrderShipperConsignee1.scName = rrow.scName;
					this.ruleForm.afOrderShipperConsignee1.scMnemonic = rrow.scMnemonic;
					this.ruleForm.afOrderShipperConsignee1.scAddress = rrow.scAddress;
					this.ruleForm.afOrderShipperConsignee1.scCode = rrow.scCode;
					this.ruleForm.afOrderShipperConsignee1.scCodeType = rrow.scCodeType;
					this.ruleForm.afOrderShipperConsignee1.aeoCode = rrow.aeoCode;
					this.ruleForm.afOrderShipperConsignee1.nationCode = rrow.nationCode;
					this.ruleForm.afOrderShipperConsignee1.stateCode = rrow.stateCode;
					this.ruleForm.afOrderShipperConsignee1.cityCode = rrow.cityCode;
					this.ruleForm.afOrderShipperConsignee1.cityName = rrow.cityName;
					this.ruleForm.afOrderShipperConsignee1.postCode = rrow.postCode;
					this.ruleForm.afOrderShipperConsignee1.telNumber = rrow.telNumber;
					this.ruleForm.afOrderShipperConsignee1.faxNumber = rrow.faxNumber;
					this.ruleForm.afOrderShipperConsignee1.scPrintRemark = rrow.scPrintRemark;
				} else {
					this.ruleForm.afOrderShipperConsignee2.scType = 0;
					this.ruleForm.afOrderShipperConsignee2.scName = rrow.scName;
					this.ruleForm.afOrderShipperConsignee2.scMnemonic = rrow.scMnemonic;
					this.ruleForm.afOrderShipperConsignee2.scAddress = rrow.scAddress;
					this.ruleForm.afOrderShipperConsignee2.scCode = rrow.scCode;
					this.ruleForm.afOrderShipperConsignee2.scCodeType = rrow.scCodeType;
					this.ruleForm.afOrderShipperConsignee2.aeoCode = rrow.aeoCode;
					this.ruleForm.afOrderShipperConsignee2.nationCode = rrow.nationCode;
					this.ruleForm.afOrderShipperConsignee2.stateCode = rrow.stateCode;
					this.ruleForm.afOrderShipperConsignee2.cityCode = rrow.cityCode;
					this.ruleForm.afOrderShipperConsignee2.cityName = rrow.cityName;
					this.ruleForm.afOrderShipperConsignee2.postCode = rrow.postCode;
					this.ruleForm.afOrderShipperConsignee2.telNumber = rrow.telNumber;
					this.ruleForm.afOrderShipperConsignee2.faxNumber = rrow.faxNumber;
					this.ruleForm.afOrderShipperConsignee2.scPrintRemark = rrow.scPrintRemark;
				}

			},
			checkAwbNumber() {
				if (this.ruleForm.awbNumber.length != 0 && (this.ruleForm.awbNumber.length != 11 && this.ruleForm.awbNumber.length != 12)) {
					this.openError("主单号为十一位或十二位");
					return;
				} else if (this.ruleForm.awbNumber.length != 0 && this.ruleForm.awbNumber.length == 12) {
					//11位（3+8）数字第四位为-
					let awbNumber1 = this.ruleForm.awbNumber.substring(0, 3);
					let awbNumber2 = this.ruleForm.awbNumber.substring(3, 4);
					let awbNumber3 = this.ruleForm.awbNumber.substring(4, 12);
					let regE = /^[0-9]\d{0,2}$/;
					if (!regE.test(awbNumber1)) {
						this.openError("主单号前三位为数字，请重新输入");
						return;
					}
					let regE1 = /^[0-9]\d{0,7}$/;
					if (!regE1.test(awbNumber3)) {
						this.openError("主单号后八位为数字，请重新输入");
						return;
					}
					if (awbNumber2 != '-') {
						this.openError("主单号第四位为-，请重新输入");
						return;
					}
				} else if (this.ruleForm.awbNumber.length != 0 && this.ruleForm.awbNumber.length == 11) {
					//11位（3+8）数字
					let awbNumber1 = this.ruleForm.awbNumber;
					let regE = /^[0-9]\d{0,10}$/;
					if (!regE.test(awbNumber1)) {
						this.openError("主单号为11位数字，请重新输入");
						return;
					}
					this.ruleForm.awbNumber = this.ruleForm.awbNumber.substring(0, 3) + '-' + this.ruleForm.awbNumber.substring(3, 11);
				}
				let awb7 = this.ruleForm.awbNumber.substring(4, 11) % 7;
				let awb1 = this.ruleForm.awbNumber.substring(11);
				if (awb7 != awb1) {
					this.openError("主单号不符合规则");
					return;
				}
			},
			submitForm(formName) {
				if (!this.ruleForm.packageType) {
					this.openError('请选择包装')
					return
				}
				let sumPieces = 0
				let sumWeight = 0.0
				let messageInfo = ''
				this.ruleForm.shipperLetters.forEach(row => {
					if (row.planPieces) {
						sumPieces += parseInt(row.planPieces + '')
					}
					if (row.planWeight) {
						sumWeight += parseFloat(row.planWeight + '')
					}
				})
				if (sumPieces !== 0 && sumPieces != this.ruleForm.planPieces) {
					messageInfo = '分单 件数 之和 (' + sumPieces + '件) 与 主单件数之和（' + (this.ruleForm.planPieces === "" ? 0 : this.ruleForm.planPieces) + '件） 不一致，是否继续？'
				}
				if (sumWeight !== 0.0 && sumWeight != this.ruleForm.planWeight) {
					messageInfo = '分单 毛重 之和 (' + sumWeight + 'KG) 与 主单毛重之和（' + (this.ruleForm.planWeight === "" ? 0 : this.ruleForm.planWeight) + 'KG） 不一致，是否继续？'
				}
				if (messageInfo) {
					this.$confirm(messageInfo, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.$refs[formName].validate((valid) => {
							if (valid) {
								let codeFlag1 = 1;
								let codeFlag2 = 1;
								let params = {
									apCode: this.ruleForm.arrivalStation,
								};
								this.loading = true
								this.$axios.post2('/afbase/airport/checkCode', params)
									.then(function(response) {
										if (response.data.data.length > 0) {

										} else {
											codeFlag2 = 0
										}
										if (this.ruleForm.departureStation) {
											let params2 = {
												apCode: this.ruleForm.departureStation
											};
											this.$axios.post2('/afbase/airport/checkCode', params2)
												.then(function(response) {
													if (response.data.data.length > 0) {

													} else {
														codeFlag1 = 0
													}
													this.doSubmit(codeFlag1, codeFlag2, formName);
												}.bind(this)).catch((error) => {
													this.loading = false
												})
										} else {
											this.doSubmit(codeFlag1, codeFlag2, formName)
										}
									}.bind(this)).catch((error) => {
										this.loading = false
									})
							}
						})
					}).catch(() => {

					});
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let codeFlag1 = 1;
							let codeFlag2 = 1;
							let params = {
								apCode: this.ruleForm.arrivalStation,
							};
							this.loading = true
							this.$axios.post2('/afbase/airport/checkCode', params)
								.then(function(response) {
									if (response.data.data.length > 0) {

									} else {
										codeFlag2 = 0
									}
									if (this.ruleForm.departureStation) {
										let params2 = {
											apCode: this.ruleForm.departureStation
										};
										this.$axios.post2('/afbase/airport/checkCode', params2)
											.then(function(response) {
												if (response.data.data.length > 0) {

												} else {
													codeFlag1 = 0
												}
												this.doSubmit(codeFlag1, codeFlag2, formName);
											}.bind(this)).catch((error) => {
												this.loading = false
											})
									} else {
										this.doSubmit(codeFlag1, codeFlag2, formName)
									}
								}.bind(this)).catch((error) => {
									this.loading = false
								})
						}
					})
				}

			},
			doSubmit(codeFlag1, codeFlag2, formName) {
				if (codeFlag1 == 1 && codeFlag2 == 1) {
					this.submitForm3(formName);
				} else {
					let info = "";
					if (codeFlag1 != 1) {
						info = info + "始发港"
					}
					if (codeFlag2 != 1) {
						info = info + "目的港"
					}
					// this.$confirm(info + '不存在，是否继续保存?', '提示', {
					// 	confirmButtonText: '确定',
					// 	cancelButtonText: '取消',
					// 	type: 'warning',
					// 	center: true
					// }).then(() => {
					// 	this.submitForm3(formName);
					// }).catch(() => {
					// 	this.loading = false
					// });
					this.openError(info + '不存在,请确认')
					this.loading = false
				}
			},
			submitForm3(formName) {
				if (this.ruleForm.priceValue != null && this.ruleForm.priceValue !== '') {
					if (this.ruleForm.currecnyCode == null || this.ruleForm.currecnyCode === '') {
						this.openError("卖价币种不能为空")
						this.loading = false
						return
					}
				}
				if (this.ruleForm.awbNumber.length != 0 && (this.ruleForm.awbNumber.length != 11 && this.ruleForm.awbNumber.length !=
						12)) {
					this.openError("主单号为十一位或十二位");
					this.loading = false
					return;
				} else if (this.ruleForm.awbNumber.length != 0 && this.ruleForm.awbNumber.length == 12) {
					//11位（3+8）数字第四位为-
					let awbNumber1 = this.ruleForm.awbNumber.substring(0, 3);
					let awbNumber2 = this.ruleForm.awbNumber.substring(3, 4);
					let awbNumber3 = this.ruleForm.awbNumber.substring(4, 12);
					let regE = /^[0-9]\d{0,2}$/;
					if (!regE.test(awbNumber1)) {
						this.openError("主单号前三位为数字，请重新输入");
						this.loading = false
						return;
					}
					let regE1 = /^[0-9]\d{0,7}$/;
					if (!regE1.test(awbNumber3)) {
						this.openError("主单号后八位为数字，请重新输入");
						this.loading = false
						return;
					}
					if (awbNumber2 != '-') {
						this.openError("主单号第四位为-，请重新输入");
						this.loading = false
						return;
					}
				} else if (this.ruleForm.awbNumber.length != 0 && this.ruleForm.awbNumber.length == 11) {
					//11位（3+8）数字
					let awbNumber1 = this.ruleForm.awbNumber;
					let regE = /^[0-9]\d{0,10}$/;
					if (!regE.test(awbNumber1)) {
						this.openError("主单号为11位数字，请重新输入");
						this.loading = false
						return;
					}
					this.ruleForm.awbNumber = this.ruleForm.awbNumber.substring(0, 3) + '-' + this.ruleForm.awbNumber.substring(3, 11);
				}
				let awb7 = this.ruleForm.awbNumber.substring(4, 11) % 7;
				let awb1 = this.ruleForm.awbNumber.substring(11);
				if (awb7 != awb1) {
					this.openError("主单号不符合规则");
					this.loading = false
					return;
				}
				//预报毛重长度限制
				if (this.ruleForm.planWeight != null && this.ruleForm.planWeight != '') {
					this.ruleForm.planWeight = this.ruleForm.planWeight + '';
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						if (t[0].length > 9) {
							this.openError("预报毛重超限");
							this.loading = false
							return;
						}
					} else if (this.ruleForm.planWeight.length > 9) {
						this.openError("预报毛重超限");
						this.loading = false
						return;
					}
				}
				//预报计重长度限制
				if (this.ruleForm.planChargeWeight != null && this.ruleForm.planChargeWeight != '') {
					this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight + '';
					let t = this.ruleForm.planChargeWeight.split('.');
					if (t.length > 1) {
						if (t[0].length > 8) {
							this.openError("预报计重超限");
							this.loading = false
							return;
						}
					} else if (this.ruleForm.planChargeWeight.length > 8) {
						this.openError("预报计重超限");
						this.loading = false
						return;
					}
				}
				//预报体积长度限制
				if (this.ruleForm.planVolume != null && this.ruleForm.planVolume != '') {
					this.ruleForm.planVolume = this.ruleForm.planVolume + '';
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						if (t[0].length > 7) {
							this.openError("预报计重超限");
							this.loading = false
							return;
						}
					} else if (this.ruleForm.planVolume.length > 7) {
						this.openError("预报计重超限");
						this.loading = false
						return;
					}
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.priceType == '单价') {
							this.ruleForm.freightUnitprice = this.ruleForm.priceValue;
						} else {
							this.ruleForm.freightAmount = this.ruleForm.priceValue;
						}
						if (this.priceType2 == '单价') {
							this.ruleForm.msrUnitprice = this.ruleForm.priceValue2;
						} else {
							this.ruleForm.msrAmount = this.ruleForm.priceValue2;
						}
						this.$axios.post2('/afbase/aforder/doSave', this.ruleForm)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									if (response.data.messageInfo.indexOf('主单号不存在') > -1) {
										this.ffrow.awbNumber = this.ruleForm.awbNumber;
										this.ffrow.businessProduct = this.ruleForm.businessProduct;
										this.ffrow.coopId = this.ruleForm.coopId;
										this.ffrow.coopName = this.ruleForm.coopName;
										let params = {
											awb3: this.ruleForm.awbNumber.substring(0, 3),
											awb8: this.ruleForm.awbNumber.substring(4),
											awbcount: 1,
											departureStation: '',
											awbFromType: '',
											awbFromId: '',
											awbFromName: ''
										}
										this.$axios.post2('/afbase/awb/checkAwbList', params)
											.then(function(response2) {
												if (response2.data.code == 0) {
													this.saveawb = true;
												} else {
													let errorinfo = response2.data.messageInfo;
													if (errorinfo.indexOf('是否继续保存') > -1) {
														this.saveawb = true;
													} else {
														this.openError(errorinfo);
													}
												}
												this.loading = false
											}.bind(this)).catch(function(error2) {
												let errorinfo = error2.response.data.messageInfo;
												this.openError(errorinfo);
												this.loading = false
											}.bind(this));

									} else {
										this.loading = false
										this.openError(response.data.messageInfo);
									}
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
								this.loading = false
								//唯一性错误

							}.bind(this));
					} else {
						this.loading = false
						console.log('error submit!!');
						return false;
					}
				});
			},

			resetForm(formName) {
				this.checkedCities = [];
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				if (this.ifFullscreen) {
					setTimeout(() => {
						let userAgent = navigator.userAgent;
						if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
							window.open('', '_self').close()
						} else {
							window.opener = null;
							window.open("about:blank", "_self");
							window.close();
						}
					}, 2000)
				} else {
					this.$emit('update:visible', false);
				}

			},
			sethawbQuantity() {
				if (this.ruleForm.hawbFlag == 1) {
					this.ruleForm.hawbQuantity = 0;
				} else {
					this.ruleForm.hawbQuantity = 1;
				}
			},
			clickHawbQuantity() {
				this.hawbQuantityIfExpand = !this.hawbQuantityIfExpand
			},
			setSalesName(vId) {
				let obj = {};
				obj = this.useroptions.find((item) => {
					return item.value === vId;
				});
				this.ruleForm.salesName = obj.label3;
			},
			setServicerName(vId) {
				let obj = {};
				obj = this.useroptions.find((item) => {
					return item.value === vId;
				});
				this.ruleForm.servicerName = obj.label3;
        //查询当前客服所在的工作组
        this.$axios.get('/hrs/userWorkgroup/selectWorkgroupByServicerId?servicerId='+this.ruleForm.servicerId).then(function(response) {
            let userWorkgroupDetailList1 = response.data.data;
            if(userWorkgroupDetailList1 != null && userWorkgroupDetailList1.length > 0){
                this.setWorkgroup(parseInt(userWorkgroupDetailList1[0]))
            }else{
                this.ruleForm.workgroupId = ''
            }
            this.$forceUpdate();
        }.bind(this));
			},
      setWorkgroup(vId) {
          let obj = {};
          obj = this.workgroups.find((item) => {
              return item.workgroupId === vId;
          });
          if(obj){
              this.ruleForm.workgroupId = obj.workgroupId;
          }else{
              this.ruleForm.workgroupId = ''
          }
      },

			formatToFloat(item) {
				if (item == 'awbNumber') {
					this.ruleForm.awbNumber = this.ruleForm.awbNumber.replace(/[^0123456789.-]/g, "");
					var t = this.ruleForm.awbNumber.split('.');
					if (t.length > 1) {
						this.ruleForm.awbNumber = t[0];
					}
				} else if (item == 'planWeight') {
					if (this.orderAeDigitsWeight === 0) {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderAeDigitsWeight);
					}
				} else if (item == 'planVolume') {
					if (this.orderAeDigitsVolume === 0) {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderAeDigitsVolume);
					}
				} else if (item == 'priceValue') {
					this.$forceUpdate();
					this.ruleForm.priceValue = this.ruleForm.priceValue.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.priceValue.split('.');
					if (t.length > 1) {
						this.ruleForm.priceValue = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'priceValue2') {
					this.$forceUpdate();
					this.ruleForm.priceValue2 = this.ruleForm.priceValue2.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.priceValue2.split('.');
					if (t.length > 1) {
						this.ruleForm.priceValue2 = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'planPieces') {
					this.ruleForm.planPieces = this.ruleForm.planPieces.replace(/[^0123456789]/g, "");
				}
			},
			formatDecimalPlaces(item) {
				if (item == 'planWeight') {
					if (this.ruleForm.planWeight) {
						let t = this.ruleForm.planWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsWeight) {
								this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsWeight - t[1].length);
							}
						} else {
							if (this.orderAeDigitsWeight !== 0) {
								this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderAeDigitsWeight);
							}
						}
					}
				} else if (item == 'planVolume') {
					if (this.ruleForm.planVolume) {
						let t = this.ruleForm.planVolume.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsVolume) {
								this.ruleForm.planVolume = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsVolume - t[1].length);
							}
						} else {
							if (this.orderAeDigitsVolume !== 0) {
								this.ruleForm.planVolume = t[0] + "." + "000".substr(0, this.orderAeDigitsVolume);
							}
						}
					}
				}
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "")
				if (row[prop].startsWith('0')) {
					row[prop] = '0'
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if (t.length > 1) {
					row[prop] = t[0] + "." + t[1].substr(0, 1);
				} else {
					if (row[prop].startsWith('0')) {
						row[prop] = '0'
					}
				}
			},
			setWarehouseName(val) {
				let obj = {};
				obj = this.departureWarehouseOptions.find((item) => {
					return item.value === val;
				});
				this.ruleForm.departureWarehouseName = obj.label;
			},
			setStorehouseName(val) {
				let obj = {};
				obj = this.departureStorehouseOptions.find((item) => {
					return item.value === val;
				});
				this.ruleForm.departureStorehouseName = obj.label;
			},

			sychronizeWareAndStore(flag) {
				if (this.ruleForm.departureStation != null && this.ruleForm.departureStation !== '') {
					this.ruleForm.departureStation = this.ruleForm.departureStation.trim().toUpperCase()
					this.$axios.get('/afbase/warehouse/getByDeparture?type=货站&departureStation=' + this.ruleForm.departureStation).then(
						function(response) {
							if (flag == 'update') {
								this.ruleForm.departureWarehouseId = ''
							}
							this.departureWarehouseOptions = response.data.data;
						}.bind(this));
					// this.$axios.get('/afbase/warehouse/getByDeparture?type=库房&departureStation=' + this.ruleForm.departureStation).then(
					// 	function(response) {
					// 		if (flag == 'update') {
					// 			this.ruleForm.departureStorehouseId = ''
					// 		}
					// 		this.departureStorehouseOptions = response.data.data;
					// 	}.bind(this));
				}
			},
			addHawb() {
				this.ruleForm.shipperLetters.push({
					hawbChecked: false,
					awbNumber: this.ruleForm.awbNumber || this.ruleForm.orderCode,
					hawbNumber: '',
					departureStation: this.ruleForm.departureStation,
					transitStation: this.ruleForm.transitStation,
					arrivalStation: this.ruleForm.arrivalStation,
					expectFlight: this.ruleForm.expectFlight,
					expectDeparture: this.ruleForm.expectDeparture,
					loadingDate: '',
					planPieces: '',
					planWeight: '',
					planVolume: '',
					customsStatusCode: this.ruleForm.customsStatusCode,
					planDimensions: '',
					partialShipment: false,
					paymentMethod: 'PP',
					undgCode: '',
					undgContactName: '',
					undgContactCommunicationType: 'TE',
					undgContactCommunicationNo: '',
					afOrderShipperConsignee1: {
						scType: 1,
						scName: '',
						scPrintRemark: ''
					},
					afOrderShipperConsignee2: {
						scType: 0,
						scName: '',
						scPrintRemark: ''
					},
					goodsNameCn: '',
					goodsNameEn: '',
					shippingMarks: '',
					handlingInfo: ''
				})
				this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length
				if (this.ruleForm.hawbQuantity + '' == '0') {
					this.ruleForm.hawbFlag = "直单"
				} else {
					this.ruleForm.hawbFlag = "分单"
				}
			},
			deleteHawb(index, row) {
				this.ruleForm.shipperLetters.splice(index, 1)
				this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length
				if (this.ruleForm.hawbQuantity + '' == '0') {
					this.ruleForm.hawbFlag = "直单"
				} else {
					this.ruleForm.hawbFlag = "分单"
				}
			},
			setcheck1NULL() {
				this.ruleForm.pickUpDeliveryCompany = ''
				this.ruleForm.pickUpAddress = ''
				this.ruleForm.pickUpDeliveryDate = ''
				this.ruleForm.pickUpDeliveryAddress = ''
				this.ruleForm.pickUpDeliveryRemark = ''
			},
			setcheck2NULL() {
				this.ruleForm.warehouseOperator = ''
				this.ruleForm.inboundDate = ''
				this.ruleForm.outboundDate = ''
				this.ruleForm.damageRemark = ''
				this.ruleForm.operationRemark = ''
			},
			setcheck3NULL() {
				this.ruleForm.outfieldDeliveryCompany = ''
				this.ruleForm.outfieldTruckNumber = ''
				this.ruleForm.outfieldDriver = ''
				this.ruleForm.receiptDate = ''
				this.ruleForm.buildUpCompany = ''
				this.ruleForm.outfieldRemark = ''
			},
			setcheck4NULL() {
				this.ruleForm.customsClearanceCompany = ''
				this.ruleForm.customsInspectionDate = ''
				this.ruleForm.customsClearanceDate = ''
				this.ruleForm.customsInspectionRemark = ''
				this.ruleForm.customsDeclaresRemark = ''
			},
			setcheck5NULL() {
				this.ruleForm.arrivalCustomsClearanceCompany = ''
				this.ruleForm.arrivalCustomsInspectionDate = ''
				this.ruleForm.arrivalCustomsClearanceDate = ''
				this.ruleForm.arrivalCustomsInspectionRemark = ''
				this.ruleForm.arrivalCustomsDeclaresRemark = ''
			},
			setcheck6NULL() {
				this.ruleForm.deliveryCompany = ''
				this.ruleForm.deliveryDriver = ''
				this.ruleForm.deliverySigner = ''
				this.ruleForm.deliveryAddress = ''
				this.ruleForm.deliveryDate = ''
				this.ruleForm.deliverySignDate = ''
				this.ruleForm.deliveryRemark = ''
			},
			changeActiveOperationName(val) {
				if (val == 'TH') {
					if (!this.ruleForm.pickUpDeliveryService) {
						this.$confirm('本票业务不再为客户提供提货服务', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning',
							center: true
						}).then(() => {
							//清空
							this.setcheck1NULL();

						}).catch(() => {
							this.ruleForm.pickUpDeliveryService = true
						});
					}
					this.activeOperationName = 'first'
				} else if (val == 'KN') {
					if (!this.ruleForm.warehouseService) {
						this.$confirm('本票业务不再为客户提供库内操作', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning',
							center: true
						}).then(() => {
							//清空
							this.setcheck2NULL();

						}).catch(() => {
							this.ruleForm.warehouseService = true
						});
					}
					this.activeOperationName = 'second'
				} else if (val == 'WC') {
					if (!this.ruleForm.outfieldService) {
						this.$confirm('本票业务不再为客户提供外场操作', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning',
							center: true
						}).then(() => {
							//清空
							this.setcheck3NULL();

						}).catch(() => {
							this.ruleForm.outfieldService = true
						});
					}
					this.activeOperationName = 'third'
				} else if (val == 'BG') {
					if (!this.ruleForm.customsClearanceService) {
						this.$confirm('本票业务不再为客户提供报关服务', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning',
							center: true
						}).then(() => {
							//清空
							this.setcheck4NULL();

						}).catch(() => {
							ruleForm.customsClearanceService = true
						});
					}
					this.activeOperationName = 'fourth'

				} else if (val == 'QG') {
					if (!this.ruleForm.arrivalCustomsClearanceService) {
						this.$confirm('本票业务不再为客户提供目的港清关', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning',
							center: true
						}).then(() => {
							//清空
							this.setcheck5NULL();

						}).catch(() => {
							this.ruleForm.arrivalCustomsClearanceService = true
						});
					}
					this.activeOperationName = 'fifth'
				} else if (val == 'PS') {
					if (!this.ruleForm.deliveryService) {
						this.$confirm('本票业务不再为客户提供目的港派送', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning',
							center: true
						}).then(() => {
							//清空
							this.setcheck6NULL();

						}).catch(() => {
							this.ruleForm.deliveryService = true
						});
					}
					this.activeOperationName = 'sixth'
				}
			},
			shipperLetterEdit(index) {
				if (index || index === 0) {
					this.ffrow.mawbChecked = false
					this.ffrow.index = index
				} else {
					this.ffrow.mawbChecked = true
					this.ffrow.index = -1
				}
				this.ffrow.shipperLetter = {
					awbNumber: this.ruleForm.awbNumber || this.ruleForm.orderCode,
					hawbNumber: '',
					departureStation: this.ruleForm.departureStation,
					transitStation: this.ruleForm.transitStation,
					arrivalStation: this.ruleForm.arrivalStation,
					expectFlight: this.ruleForm.expectFlight,
					expectDeparture: this.ruleForm.expectDeparture,
					loadingDate: this.ruleForm.loadingDate,
					planPieces: this.ruleForm.planPieces,
					planWeight: this.ruleForm.planWeight,
					planVolume: this.ruleForm.planVolume,
					customsStatusCode: this.ruleForm.customsStatusCode,
					planDimensions: this.ruleForm.planDimensions,
					partialShipment: this.ruleForm.partialShipment,
					paymentMethod: this.ruleForm.paymentMethod,
					undgCode: this.ruleForm.undgCode,
					undgContactName: this.ruleForm.undgContactName,
					undgContactCommunicationType: this.ruleForm.undgContactCommunicationType,
					undgContactCommunicationNo: this.ruleForm.undgContactCommunicationNo,
					afOrderShipperConsignee1: this.ruleForm.afOrderShipperConsignee1,
					afOrderShipperConsignee2: this.ruleForm.afOrderShipperConsignee2,
					goodsNameCn: this.ruleForm.goodsNameCn,
					goodsNameEn: this.ruleForm.goodsNameEn,
					shippingMarks: this.ruleForm.shippingMarks,
					handlingInfo: this.ruleForm.handlingInfo
				}

				this.ffrow.hawbList = JSON.parse(JSON.stringify(this.ruleForm.shipperLetters))
				this.shipperLetterVisible = true
			},
			shipperLetterCallback({
				orderInfo,
				hawbList
			}) {
				this.ruleForm.departureStation = orderInfo.departureStation
				this.ruleForm.transitStation = orderInfo.transitStation
				this.ruleForm.arrivalStation = orderInfo.arrivalStation
				this.ruleForm.expectFlight = orderInfo.expectFlight
				this.ruleForm.expectDeparture = orderInfo.expectDeparture
				this.ruleForm.planPieces = orderInfo.planPieces
				this.ruleForm.planWeight = orderInfo.planWeight
				this.ruleForm.planVolume = orderInfo.planVolume
				this.ruleForm.customsStatusCode = orderInfo.customsStatusCode
				this.ruleForm.planDimensions = orderInfo.planDimensions
				this.ruleForm.paymentMethod = orderInfo.paymentMethod
				this.ruleForm.undgCode = orderInfo.undgCode
				this.ruleForm.undgContactName = orderInfo.undgContactName
				this.ruleForm.undgContactCommunicationType = orderInfo.undgContactCommunicationType
				this.ruleForm.undgContactCommunicationNo = orderInfo.undgContactCommunicationNo
				this.ruleForm.afOrderShipperConsignee1 = orderInfo.afOrderShipperConsignee1
				this.ruleForm.afOrderShipperConsignee2 = orderInfo.afOrderShipperConsignee2
				this.ruleForm.goodsNameCn = orderInfo.goodsNameCn
				this.ruleForm.goodsNameEn = orderInfo.goodsNameEn
				this.ruleForm.shippingMarks = orderInfo.shippingMarks
				this.ruleForm.handlingInfo = orderInfo.handlingInfo
				this.ruleForm.loadingDate = orderInfo.loadingDate
				this.ruleForm.partialShipment = orderInfo.partialShipment

				this.ruleForm.shipperLetters = hawbList
				this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length
				if (this.ruleForm.hawbQuantity + '' == '0') {
					this.ruleForm.hawbFlag = "直单"
				} else {
					this.ruleForm.hawbFlag = "分单"
				}
				this.setPlanChargeWeight()
				this.shipperLetterVisible = false
			},
			changeIsConsol(val) {
				if (val) {
					this.ruleForm.goodsNameEn = 'CONSOLIDATION AS PER ATTACHED MANIFEST'
				} else {
					this.ruleForm.goodsNameEn = this.ruleForm.goodsNameEn.replace(/CONSOLIDATION AS PER ATTACHED MANIFEST/g, '')
				}
			},
			changeIsNoSolidWood(val) {
				if (val) {
					this.ruleForm.handlingInfo = 'NO SOLID WOOD PACKING MATERIAL USED'
				} else {
					this.ruleForm.handlingInfo = this.ruleForm.handlingInfo.replace(/NO SOLID WOOD PACKING MATERIAL USED/g, '')
				}
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
          this.ruleForm[this.currentSelectKey] = val;
        }
        this.loading = true;
        this.$axios.get(url+val).then(function(response){
          this.loading = false;
          callback(response.data.data || []);
        }.bind(this));
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
       * 搜索货源地信息
       * @param val 关键字
       */
      searchCity(val){
        this.search("/afbase/airport/searchCity/", val, function(data){
          this.cityList = data;
        }.bind(this));
      },
      fillValue(key, event){
        let value = event.target.value;
        if(value){
          this.ruleForm[key] = value.toUpperCase();
        }
      },
      keydownEvent(){
        this.currentSelectKey='departureStation';
        this.ruleForm.departureWarehouseId = '';
      }
    },
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.$axios.get('/hrs/permission/' + 159).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
			}.bind(this));
      //工作组
      this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=AE').then(function(response) {
          this.workgroups = response.data.data;
      }.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
				this.productOptions = response.data.data;
				this.ruleForm.businessProduct = this.productOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=运输条款').then(function(response) {
				this.transitClauseOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
				this.goodsTypeOptions = response.data.data;
				this.ruleForm.goodsType = this.goodsTypeOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=电池情况').then(function(response) {
				this.batteryTypeOptions = response.data.data;
				this.ruleForm.batteryType = this.batteryTypeOptions[0].value;
			}.bind(this));

			this.$axios.get('/afbase/awb/selectCategory?category=包装类型').then(function(response) {
				this.packageTypeOptions = response.data.data;
				this.ruleForm.packageType = this.packageTypeOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=付款方式').then(function(response) {
				this.paymentMethodOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				this.msrCurrecnyCodeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=货物海关代码').then(function(response) {
				this.codeOptions = response.data.data;
				this.ruleForm.customsStatusCode = this.codeOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/warehouse/库房').then((response) => {
				this.departureStorehouseOptions = response.data.data
			})
			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces")
				.then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.orderAeDigitsWeight != null) {
							this.orderAeDigitsWeight = response.data.data.orderAeDigitsWeight
						}
						if (response.data.data.orderAeDigitsVolume != null) {
							this.orderAeDigitsVolume = response.data.data.orderAeDigitsVolume
						}
						if (response.data.data.orderAeDigitsChargeWeight != null) {
							this.orderAeDigitsChargeWeight = response.data.data.orderAeDigitsChargeWeight
						}
					} else {
						this.openError(response.data.messageInfo)
					}
				});
			this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
				.then(function(response) {

					this.ruleForm = response.data.data;
					if (!this.ruleForm.msrCurrecnyCode) {
						this.ruleForm.msrCurrecnyCode = 'CNY'
					}
					if (this.ruleForm.freightAmount != null && this.ruleForm.freightAmount != '') {
						this.priceType = '总价'
						this.ruleForm.priceValue = this.ruleForm.freightAmount
					} else {
						this.priceType = '单价'
						this.ruleForm.priceValue = this.ruleForm.freightUnitprice
					}
					if (this.ruleForm.msrAmount != null && this.ruleForm.msrAmount != '') {
						this.priceType2 = '总价'
						this.ruleForm.priceValue2 = this.ruleForm.msrAmount
					} else {
						this.priceType2 = '单价'
						this.ruleForm.priceValue2 = this.ruleForm.msrUnitprice
					}
					//需要清空字段
					this.ruleForm.hawbFlag = '直单'
					this.ruleForm.shipperLetters = []
					this.ruleForm.hawbQuantity = '0'
					this.ruleForm.freightUnitprice = ''
					this.ruleForm.freightAmount = ''
					this.ruleForm.msrUnitprice = ''
					this.ruleForm.msrAmount = ''
					this.ruleForm.awbId = ''
					this.ruleForm.awbUuid = ''
					this.ruleForm.awbNumber = ''
					this.ruleForm.customerNumber = ''
					this.ruleForm.orderCode = ''
					this.ruleForm.expectDeparture = ''
					this.ruleForm.pickUpDeliveryDate = ''
					this.ruleForm.inboundDate = ''
					this.ruleForm.damageRemark = ''
					this.ruleForm.outboundDate = ''
					this.ruleForm.receiptDate = ''
					this.ruleForm.customsInspectionDate = ''
					this.ruleForm.customsClearanceDate = ''
					this.ruleForm.customsInspectionRemark = ''
					this.ruleForm.arrivalCustomsInspectionDate = ''
					this.ruleForm.arrivalCustomsClearanceDate = ''
					this.ruleForm.arrivalCustomsInspectionRemark = ''
					this.ruleForm.deliveryDate = ''
					this.ruleForm.deliverySignDate = ''
					this.ruleForm.planDensity = ''
					this.ruleForm.planPieces = '0'
					this.ruleForm.planVolume = '0'
					this.ruleForm.planWeight = '0'
					this.ruleForm.planChargeWeight = '0'
					this.ruleForm.confirmDensity = ''
					this.ruleForm.confirmPieces = ''
					this.ruleForm.confirmVolume = ''
					this.ruleForm.confirmWeight = ''
					this.ruleForm.confirmChargeWeight = ''

					this.ruleForm.goodsType = '普货';
					this.ruleForm.batteryType = '不含电池';
					this.ruleForm.customsStatusCode = '001';
					this.ruleForm.airborneDocument = '';
					this.ruleForm.appraisalCompany = '';
					this.ruleForm.dangerousType = '';
					this.ruleForm.appraisalNote = '';
					this.ruleForm.pickUpDeliveryService = false;
					this.ruleForm.warehouseService = false;
					this.ruleForm.outfieldService = false;
					this.ruleForm.customsClearanceService = false;
					this.ruleForm.arrivalCustomsClearanceService = false;
					this.ruleForm.deliveryService = false;
          this.ruleForm.orderInquiryId = '';
					this.setcheck1NULL();
					this.setcheck2NULL();
					this.setcheck3NULL();
					this.setcheck4NULL();
					this.setcheck5NULL();
					this.setcheck6NULL();

					this.sychronizeWareAndStore('init')
					let params = {
						coopId: this.ruleForm.coopId
					};
					this.$axios.get2('/prm/coop/queryContactsIsValid',
							params)
						.then(function(response) {
							this.contactsOptions = response.data.data;
						}.bind(this))
				}.bind(this))
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

	.arrivalStationForAESave .el-input-group__prepend {
		background-color: #fee1e3;
	}

	.expectDepartureForAESave .el-input-group__prepend {
		background-color: #fee1e3;
	}
</style>
