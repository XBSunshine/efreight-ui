<template>
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div class="orderEditPage" style="width: 1280px;">
			<el-form v-loading="vLoad" :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">海运出口订单&nbsp;-&nbsp;复制</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
								<template slot="prepend">业务单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="customerName">
							<el-input class="widthWithFourWithXing" readOnly v-model="ruleForm.customerName" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>客户名称</span>
								</template>
								<el-button slot="append" @click="selectCustomer" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWorkGroup" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>工作组</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.workgroupId" placeholder="请选择工作组" style="width:197px;margin-right: -5px;" clearable>
									<el-option v-for="item in workgroups" :key="item.workgroupId" :label="item.workgroupName" :value="item.workgroupId">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="salesId">
							<el-input class="widthWithFourWithXing" style="width:187px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>销售/客服</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.salesId" filterable placeholder="请选择" @change="setSalesName" style="width:90px;margin-right: -5px;">
									<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="servicerId">
							<el-input style="width:80px;">
								<template slot="prepend">
									<span>&nbsp;&nbsp;&nbsp;</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.servicerId" filterable placeholder="请选择" @change="setServicerName" style="width:102px;margin-right: -5px;">
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
						<el-form-item>
							<el-input v-model="ruleForm.mblNumber" @input="ruleForm.mblNumber=ruleForm.mblNumber.toUpperCase()" auto-complete="off" maxlength="20" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>主提单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.hblNumber" @input="ruleForm.hblNumber=ruleForm.hblNumber.toUpperCase()" auto-complete="off" maxlength="40" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>分提单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.bookingNumber" @input="ruleForm.bookingNumber=ruleForm.bookingNumber.toUpperCase()" clearable maxlength="40" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>订仓编号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" v-model="ruleForm.customerNumber" @input="ruleForm.customerNumber=ruleForm.customerNumber.toUpperCase()" clearable maxlength="30" auto-complete="off" style="width:298px;">
								<template slot="prepend">
									<span>合约号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<!--<el-col class="elementWidth">
						<el-form-item prop="servicerId">
							<el-input class="widthWithFourWithXing" style="width:295px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>责任客服</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.servicerId" clearable filterable placeholder="请选择" @change="setServicerName" style="width:198px;margin-right: -5px;">
									<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>-->
				</el-row>
				<div style="padding:0px 0px 20px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="departureStation">
							<el-input class="widthWithThreeWithXing" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>起运港</span>
								</template>
                <el-select slot="suffix"  clearable  remote :filter-method="changeDepartureStation" filterable  :loading="loading" v-model="ruleForm.departureStation"
                           @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()"
                           placeholder="请输入关键词" style="width:198px;margin-right: -5px;" >
                  <el-option v-for="item in departureStations" :key="item.portCode" :value="item.portCode" :label="item.portNameEn">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.portCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.portNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.portNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>

								<!--<el-select slot="suffix" v-model="ruleForm.departureStation" @visible-change="blurDepartureStation" :filter-method="changeDepartureStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in departureStations" :key="index" :label="item.portNameEn" :value="item.portCode">
										<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
									</el-option>
								</el-select>-->
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>中转港</span>
								</template>
                <el-select slot="suffix"  clearable remote :filter-method="changeTransitStation" filterable  :loading="loading" v-model="ruleForm.transitStation"
                           @input="ruleForm.transitStation = ruleForm.transitStation.toUpperCase()"
                           placeholder="请输入关键词" style="width:198px;margin-right: -5px;" >
                  <el-option v-for="item in transitStations" :key="item.portCode" :value="item.portCode" :label="item.portNameEn">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.portCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.portNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.portNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>

								<!--<el-select slot="suffix" v-model="ruleForm.transitStation" @visible-change="blurTransitStation" :filter-method="changeTransitStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in transitStations" :key="index" :label="item.portNameEn" :value="item.portCode">
										<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
									</el-option>
								</el-select>-->
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="arrivalStation">
							<el-input class="widthWithThreeWithXing" clearable auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>目的港</span>
								</template>
                <el-select slot="suffix"  clearable remote :filter-method="changeArrivalStation" filterable  :loading="loading" v-model="ruleForm.arrivalStation"
                           @input="ruleForm.arrivalStation = ruleForm.arrivalStation.toUpperCase()"
                           placeholder="请输入关键词" style="width:198px;margin-right: -5px;" >
                  <el-option v-for="item in arrivalStations" :key="item.portCode" :value="item.portCode" :label="item.portNameEn">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.portCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.portNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.portNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
								<!--<el-select slot="suffix" v-model="ruleForm.arrivalStation" @visible-change="blurArrivalStation" :filter-method="changeArrivalStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in arrivalStations" :key="index" :label="item.portNameEn" :value="item.portCode">
										<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
									</el-option>
								</el-select>-->
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;">
								<template slot="prepend">运输条款</template>
								<el-select slot="suffix" v-model="ruleForm.transitClause" clearable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in transitClauses" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" readOnly v-model="ruleForm.carrierName" style="width:615px;margin-right: 15px;">
								<template slot="prepend">
									<span>船公司</span>
								</template>
								<el-button slot="append" @click="selectCarrierId" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithFour" readOnly v-model="ruleForm.bookingAgentName" style="width:615px;">
								<template slot="prepend">
									<span>订舱代理</span>
								</template>
								<el-button slot="append" @click="selectBookingAgentId" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" clearable auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>船名</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.shipName" :filter-method="changeShipName" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in shipInfos" :key="index" :label="item.shipNameEn" :value="item.shipNameEn">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" v-model="ruleForm.shipVoyageNumber" maxlength="50" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>船次</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;margin-right: 15px;">
								<template slot="prepend">运费条款</template>
								<el-select slot="suffix" v-model="ruleForm.paymentMethod" clearable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in paymentMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" v-model="ruleForm.placePayment" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">
									<span>付款地</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>截单日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.documentOffDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择截单日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>截关日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.customsClosingDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择截关日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="expectDeparture">
							<el-input class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>离港日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.expectDeparture" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择离港日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;">
								<template slot="prepend">
									<span>抵港日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.expectArrival" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择抵港日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="billingType">
							<el-input class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>提单类型</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.billingType" clearable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in billingTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>出单类型</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.billingMethod" clearable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in billingMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithSix" v-model="ruleForm.originalsNumber" maxlength="6" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>正/副本份数</span>
								</template>
								<el-input slot="suffix" v-model="ruleForm.copyNumber" maxlength="6" auto-complete="off" style="width:95px;margin-right: -5px;" clearable>
								</el-input>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;">
								<template slot="prepend">
									<span>签发日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.issueDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择签发日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="containerMethod">
							<el-input class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>装箱方式</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.containerMethod" clearable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in containerMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.containerList" auto-complete="off" style="width:615px;margin-right: 15px;" readOnly>
								<template slot="prepend">
									<span>集装箱量</span>
								</template>
								<el-button slot="append" @click="editContainerList" icon="el-icon-edit"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.containerNumber" auto-complete="off" style="width:295px;" readOnly>
								<template slot="prepend">
									<span>标箱数量</span>
								</template>
								<template slot="append">
									<span>TEU</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input maxlength="6" class="widthWithTwo" @input="formatToFloat('planPieces')" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>件数</span>
								</template>
								<el-select slot="append" v-model="ruleForm.packageType" clearable placeholder="包装" style="width:85px;">
									<el-option v-for="(item,index) in packageTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" @input="formatToFloat('planWeight')" @change="formatDecimalPlaces('planWeight')" v-model="ruleForm.planWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>毛重</span>
								</template>
								<template slot="append">
									<span>KG</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" @input="formatToFloat('planVolume')" @change="formatDecimalPlaces('planVolume')" v-model="ruleForm.planVolume" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>体积</span>
								</template>
								<template slot="append">
									<span>CBM</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" @input="formatToFloat('planChargeWeight')" @change="formatDecimalPlaces('planChargeWeight')" v-model="ruleForm.planChargeWeight" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">
									<span>计费吨</span>
								</template>
								<template slot="append">
									<span>TON</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="showWordLimit" v-model="ruleForm.orderRemark" auto-complete="off" style="width:1253px;" show-word-limit maxlength="200" clearable>
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
					<span>制单信息</span>
					<el-button type="text" size="small" v-if=showFlagConAndShipper v-on:click="showFlagConAndShipper=false">收起<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" size="small" v-if=!showFlagConAndShipper v-on:click="showFlagConAndShipper=true">展开<i class="el-icon-arrow-up"></i></el-button>
					<el-row v-show="showFlagConAndShipper">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>发货人信息</el-button>
								<el-button @click="editShipperConsignee('shipper')" icon="el-icon-edit" type="text">编辑</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.shipper.scPrintRemark" @input="ruleForm.shipper.scPrintRemark = ruleForm.shipper.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:520px" show-word-limit maxlength="500">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>收货人信息</el-button>
								<el-button @click="editShipperConsignee('consignee')" icon="el-icon-edit" type="text">编辑</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.consignee.scPrintRemark" @input="ruleForm.consignee.scPrintRemark = ruleForm.consignee.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:520px" show-word-limit maxlength="500">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
					</el-row>
					<el-row v-show="showFlagConAndShipper">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>通知人信息</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.notifierRemark" @input="ruleForm.notifierRemark=ruleForm.notifierRemark.toUpperCase()" auto-complete="off" :rows="5" style="width:520px" show-word-limit maxlength="500">
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
									<el-input class="showWordLimit" type="textarea" v-model="ruleForm.arrivalAgent" @input="ruleForm.arrivalAgent=ruleForm.arrivalAgent.toUpperCase()" auto-complete="off" :rows="5" style="width:520px" show-word-limit maxlength="500">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
					</el-row>
					<el-row v-show="showFlagConAndShipper">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item>
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>中文品名</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameCn" @change="ruleForm.goodsNameCn=strTrim(ruleForm.goodsNameCn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 535px;" show-word-limit></el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item style="margin-left: 15px;">
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>英文品名</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameEn" @change="ruleForm.goodsNameEn=strTrim(ruleForm.goodsNameEn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 540px;" show-word-limit></el-input>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row v-show="showFlagConAndShipper">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item>
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>唛头信息</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.shippingMarks" auto-complete="off" :rows="3" maxlength="500" style="width: 535px;" show-word-limit @input="ruleForm.shippingMarks = ruleForm.shippingMarks.toUpperCase()"></el-input>
							</el-form-item>
						</el-col>

						<el-col class="elementWidth" style="margin-left: 15px;">
							<el-form-item>
								<el-row>
									<el-button type="text" style="margin-left: 20px;" disabled>制单备注</el-button>
								</el-row>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.waybillRemark" auto-complete="off" :rows="3" maxlength="500" style="width: 540px;" show-word-limit @input="ruleForm.waybillRemark = ruleForm.waybillRemark.toUpperCase()"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div style="padding:10px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<div style="padding:0px 0px 0px 30px">
					<span>操作详情</span>
					<el-button type="text" size="small" v-if=showFlagOperation v-on:click="showFlagOperation=false">收起<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" size="small" v-if=!showFlagOperation v-on:click="showFlagOperation=true">展开<i class="el-icon-arrow-up"></i></el-button>

					<el-row v-show="showFlagOperation" style="margin-top: 10px;">
						<el-col class="elementWidth">
							<el-form-item prop="goodsType">
								<el-input class="widthWithFourWithXing" auto-complete="off" style="width:300px;margin-right: 15px;margin-left: 50px;">
									<template slot="prepend">
										<font style="color: red;">*</font>
										<span>货物类型</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.goodsType" placeholder="请选择" style="width:203px;margin-right: -5px;" clearable>
										<el-option v-for="(item,index) in goodsTypes" :key="index" :label="item.paramText" :value="item.paramText">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlagOperation">
						<el-tabs style="width: 1100px;height:280px;margin-left: 50px;" type="border-card" v-model="activeOperationName">
							<el-tab-pane name="first">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.containerPickupService" @change="changeActiveOperationName('TG')"></el-checkbox>提柜服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerPickupService" v-model="ruleForm.trailersCompany" auto-complete="off" style="width:300px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>拖车公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.containerPickupService" class="widthWithFourWithXG showWordLimit" v-model="ruleForm.trailersDriver" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
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
											<el-input style="width:300px;margin-right: 15px;">
												<template slot="prepend">
													<span>提柜日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.containerPickupService" slot="suffix" v-model="ruleForm.containerPickupDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择送货日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerPickupService" v-model="ruleForm.containerPickupAddress" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>提柜地址</span>
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
													<span>送柜日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.containerPickupService" slot="suffix" v-model="ruleForm.containerArrivalDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择送货日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerPickupService" v-model="ruleForm.containerArrivalAddress" auto-complete="off" style="width:730px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>送柜地址</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerPickupService" v-model="ruleForm.containerPickupRemark" auto-complete="off" style="width:1055px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>提柜备注</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="second">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.containerLoadService" @change="changeActiveOperationName('ZX')"></el-checkbox>装箱服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerLoadService" v-model="ruleForm.containerLoadCompany" auto-complete="off" style="width:335px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>装箱代理</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:335px;margin-right: 15px;">
												<template slot="prepend">
													<span>装箱日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.containerLoadService" slot="suffix" v-model="ruleForm.containerLoadDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择装箱日期" style="width: 238px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerLoadService" v-model="ruleForm.containerLoadWarehouse" auto-complete="off" style="width:335px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>仓库名称</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerLoadService" v-model="ruleForm.containerLoadAddressCn" auto-complete="off" style="width:1055px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>仓库地址</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>装箱备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.containerLoadService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.containerLoadRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="third">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.customsClearanceService" @change="changeActiveOperationName('BG')"></el-checkbox>报关服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsClearanceCompany" auto-complete="off" style="width:405px;margin-right: 15px;" clearable show-word-limit maxlength="200">
												<template slot="prepend">
													<span>报关代理</span>
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
												<el-date-picker :disabled="!ruleForm.customsClearanceService" slot="suffix" v-model="ruleForm.customsInspectionDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择查验日期" style="width: 203px;margin-right: -5px;">
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
												<el-date-picker :disabled="!ruleForm.customsClearanceService" slot="suffix" v-model="ruleForm.customsClearanceDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择放行日期" style="width: 203px;margin-right: -5px;">
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
							<el-tab-pane name="fourth">
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
							<el-tab-pane name="fifth">
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
			<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="ffrow"></customerSelect>
			<bookingAgentIdSelect ref="addMission" v-if="bookingAgentIdSelectVisible" :visible.sync="bookingAgentIdSelectVisible" :frow="ffrow"></bookingAgentIdSelect>
			<carrierIdSelect ref="addMission" v-if="carrierIdSelectVisible" :visible.sync="carrierIdSelectVisible" :frow="ffrow"></carrierIdSelect>
			<shipperConsignee ref="addMission" v-if="shipperConsigneeVisible" :visible.sync="shipperConsigneeVisible" :frow="ffrow"></shipperConsignee>
			<container ref="addMission" v-if="containerVisible" :visible.sync="containerVisible" :frow="ffrow"></container>
		</div>
	</el-dialog>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
	import BookingAgentIdSelect from '../public/order_bookingAgent_select'
	import CarrierIdSelect from '../public/order_carrier_select'
	import ShipperConsignee from '../public/order_shipperConsignee_select'
	import Container from '../public/order_container_edit'
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
			var checkNumber2 = (rule, value, callback) => {
				if (this.ruleForm.hawbFlag == '1') {
					callback();
				}
				let regE = /^[1-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位数字'));
				} else {
					callback();
				}
			};
			var checkNumber3 = (rule, value, callback) => {
				// let regE = /^[0-9]*[0-9][0-9]*$/g;
				let regE = /^[0-9]\d{0,3}$/;
				if (!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if (value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			};
			return {
				helpDocumentUrl: '',
				workgroups: [],
				useroptions: [],
				transitClauses: [],
				paymentMethods: [],
				billingMethods: [],
				billingTypes: [],
				seaPorts: [],
				departureStations: [],
				transitStations: [],
				arrivalStations: [],
				containerMethods: [],
				packageTypes: [],
				goodsTypes: [],
				customsDeclaresTypes: [],
				deliveryMethods: [],
				shipInfos: [],
				shipInfoAll: [],
				shipperConsigneeVisible: false,
				customerSelectVisible: false,
				carrierIdSelectVisible: false,
				bookingAgentIdSelectVisible: false,
				containerVisible: false,
				showFlagConAndShipper: false,
				showFlagOperation: false,
				ffrow: {},
				activeOperationName: 'first',
				loading: false,
				vLoad: false,
				ifFullscreen: false,
				style: {},
				orderSeDigitsWeight: 3,
				orderSeDigitsVolume: 3,
				orderSeDigitsChargeWeight: 3,
				ruleForm: {
					deliveryService: false,
					deliveryCompany: '',
					deliveryDriver: '',
					deliverySigner: '',
					deliveryAddress: '',
					deliveryDate: '',
					deliverySignDate: '',
					deliveryRemark: '',

					arrivalCustomsClearanceService: false,
					arrivalCustomsClearanceCompany: '',
					arrivalCustomsInspectionDate: '',
					arrivalCustomsClearanceDate: '',
					arrivalCustomsInspectionRemark: '',
					arrivalCustomsDeclaresRemark: '',

					customsClearanceService: false,
					customsClearanceCompany: '',
					customsInspectionDate: '',
					customsClearanceDate: '',
					customsInspectionRemark: '',
					customsDeclaresRemark: '',

					containerLoadService: false,
					containerLoadCompany: '',
					containerLoadDate: '',
					containerLoadWarehouse: '',
					containerLoadAddressCn: '',
					containerLoadRemark: '',

					containerPickupService: false,
					trailersCompany: '',
					trailersDriver: '',
					containerPickupDate: '',
					containerPickupAddress: '',
					containerArrivalDate: '',
					containerArrivalAddress: '',
					containerPickupRemark: '',

					bookingAgentName: '',
					carrierName: '',
					orderCode: '',
					customerName: '',
					coopId: '',
					customerNumber: '',
					salesId: '',
					salesName: '',
					servicerId: '',
					servicerName: '',
					bookingNumber: '',
					mblNumber: '',
					hblNumber: '',
					shipName: '',
					carrierId: '',
					bookingAgentId: '',
					shipVoyageNumber: '',
					customsClosingDate: '',
					documentOffDate: '',
					expectArrival: '',
					billingType: '',
					billingMethod: '',
					originalsNumber: '',
					copyNumber: '',
					issueDate: '',
					expectDeparture: '',
					placePayment: '',
					transitClause: '',
					paymentMethod: '',
					departureStation: '',
					arrivalStation: '',
					transitStation: '',
					containerMethod: '',
					containerNumber: '',
					planPieces: '0',
					packageType: '',
					planWeight: '0',
					planVolume: '0',
					planChargeWeight: '0',
					orderRemark: '',
					consignee: {
						scPrintRemark: ''
					},
					shipper: {
						scPrintRemark: ''
					},
					containerDetails: [],
					notifierRemark: '',
					arrivalAgent: '',
					containerList: '',
					goodsType: '',
					waybillRemark: '',
					shippingMarks: '',
					goodsNameEn: '',
					goodsNameCn: '',
					workgroupId: '',
				},
				rules: {
					customerName: [{
						required: true,
						message: '请选择客户',
						trigger: ['blur', 'change']
					}],
					departureStation: [{
						required: true,
						message: '请输入始发港',
						trigger: ['blur', 'change']
					}],
					arrivalStation: [{
						required: true,
						message: '请输入目的港',
						trigger: ['blur', 'change']
					}],
					expectDeparture: [{
						required: true,
						message: '请选择离港日期',
						trigger: ['blur', 'change']
					}],
					containerMethod: [{
						required: true,
						message: '请选择装箱方式',
						trigger: ['blur', 'change']
					}],
					salesId: [{
						required: true,
						message: '请选择责任销售',
						trigger: ['blur', 'change']
					}],
					billingType: [{
						required: true,
						message: '请选择提单类型',
						trigger: ['blur', 'change']
					}],
					servicerId: [{
						required: true,
						message: '请选择责任客服',
						trigger: ['blur', 'change']
					}],
					packageType: [{
						required: true,
						message: '请选择包装类型',
						trigger: ['blur', 'change']
					}],
					goodsType: [{
						required: true,
						message: '请选择货物类型',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['findByPage'],
		components: {
			'customerSelect': CustomerSelect,
			'container': Container,
			'CarrierIdSelect': CarrierIdSelect,
			'bookingAgentIdSelect': BookingAgentIdSelect,
			'shipperConsignee': ShipperConsignee
		},
		provide() {
			return {
				setValue: this.setValue,
				bookingAgentCallBack: this.bookingAgentCallBack,
				carrierCallBack: this.carrierCallBack,
				containerCallback: this.containerCallback,
				shipperConsigneeCallback: this.shipperConsigneeCallback
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
			editContainerList() {
				this.containerVisible = true
				let temp = JSON.stringify(this.ruleForm.containerDetails)
				this.ffrow.containerDetails = JSON.parse(temp)
				this.ffrow.planPieces = this.ruleForm.planPieces
				this.ffrow.planWeight = this.ruleForm.planWeight
				this.ffrow.planVolume = this.ruleForm.planVolume

			},
			containerCallback(row) {
				if (row.flag == 'replace') {
					this.ruleForm.planPieces = row.totalPieces
					if (row.totalVolume) {
						let t = row.totalVolume.split('.');
						if (t.length > 1) {
							this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderSeDigitsVolume);
						} else {
							this.ruleForm.planVolume = parseFloat(row.totalVolume).toFixed(this.orderSeDigitsVolume);
						}
					}
					if (row.totalWeight) {
						let t = row.totalWeight.split('.');
						if (t.length > 1) {
							this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderSeDigitsWeight);
						} else {
							this.ruleForm.planWeight = parseFloat(row.totalWeight).toFixed(this.orderSeDigitsWeight);
						}
					}
				}
				this.ruleForm.containerList = row.val
				this.ruleForm.containerNumber = row.total
				this.ruleForm.containerDetails = row.containerDetails
			},
			selectCustomer() {
				this.ffrow.businessScope = 'SE'
				this.customerSelectVisible = true
			},
			selectCarrierId() {
				this.carrierIdSelectVisible = true
			},
			selectBookingAgentId() {
				this.bookingAgentIdSelectVisible = true
			},
			changeShipName(val) {
				if (val) {
					this.shipInfos = this.shipInfoAll.filter(ship => ship.shipNameEn.indexOf(val) > -1).slice(0, 10)
				} else {
					this.shipInfos = this.shipInfoAll.slice(0, 10)
				}
				this.ruleForm.shipName = val
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
          this.loading = true;
          this.$axios.get(url+val).then(function(response){
              this.loading = false;
              callback(response.data.data || []);
          }.bind(this));
      },
			changeDepartureStation(val) {
        this.departureStations = [];
        this.search("/sc/portMaintenance/search/", val, function(data){
            this.departureStations = data;
        }.bind(this));
				/*if (val) {
					this.departureStations = this.seaPorts.filter(port => port.portNameEn.indexOf(val.toUpperCase()) > -1 || (port.portNameCn != null && port.portNameCn != '' && port.portNameCn.indexOf(val) > -1)).slice(0, 10)
					this.ruleForm.departureStation = val.toUpperCase()
				} else {
					this.ruleForm.departureStation = ''
					this.departureStations = this.seaPorts.slice(0, 10)
				}*/
			},
			blurDepartureStation(param) {
				if (!param) {
					if (!this.seaPorts.some(port => port.portCode == this.ruleForm.departureStation)) {
						this.ruleForm.departureStation = ''
						this.departureStations = this.seaPorts.slice(0, 10)
					}
				}
			},
			changeTransitStation(val) {
        this.transitStations = [];
        this.search("/sc/portMaintenance/search/", val, function(data){
            this.transitStations = data;
        }.bind(this));
				/*if (val) {
					this.transitStations = this.seaPorts.filter(port => port.portNameEn.indexOf(val.toUpperCase()) > -1 || (port.portNameCn != null && port.portNameCn != '' && port.portNameCn.indexOf(val) > -1)).slice(0, 10)
					this.ruleForm.transitStation = val.toUpperCase()
				} else {
					this.ruleForm.transitStation = ''
					this.transitStations = this.seaPorts.slice(0, 10)
				}*/
			},
			blurTransitStation(param) {
				if (!param) {
					if (!this.seaPorts.some(port => port.portCode == this.ruleForm.transitStation)) {
						this.ruleForm.transitStation = ''
						this.transitStations = this.seaPorts.slice(0, 10)
					}
				}
			},
			blurArrivalStation(param) {
				if (!param) {
					if (!this.seaPorts.some(port => port.portCode == this.ruleForm.arrivalStation)) {
						this.ruleForm.arrivalStation = ''
						this.arrivalStations = this.seaPorts.slice(0, 10)
					}
				}
			},
			changeArrivalStation(val) {
        this.arrivalStations = [];
        this.search("/sc/portMaintenance/search/", val, function(data){
            this.arrivalStations = data;
        }.bind(this));
				/*if (val) {
					this.arrivalStations = this.seaPorts.filter(port => port.portNameEn.indexOf(val.toUpperCase()) > -1 || (port.portNameCn != null && port.portNameCn != '' && port.portNameCn.indexOf(val) > -1)).slice(0, 10)
					this.ruleForm.arrivalStation = val.toUpperCase()
				} else {
					this.ruleForm.arrivalStation = ''
					this.arrivalStations = this.seaPorts.slice(0, 10)
				}*/
			},
			setValue(row) {
				this.ruleForm.coopId = row.coopId;
				this.ruleForm.customerName = row.coopName;
				//更新责任销售
				this.$axios.get('/prm/coop/' + row.coopId).then((response) => {
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
			bookingAgentCallBack(row) {
				this.ruleForm.bookingAgentName = row.coopName
				this.ruleForm.bookingAgentId = row.coopId;
			},
			carrierCallBack(row) {
				this.ruleForm.carrierName = row.shipCompanyNameCn
				this.ruleForm.carrierId = row.shipCompanyId;
			},
			editShipperConsignee(flag) {
				if (flag == 'shipper') {
					this.ffrow.shipperConsignee = this.ruleForm.shipper
				} else if (flag == 'consignee') {
					this.ffrow.shipperConsignee = this.ruleForm.consignee
				}
				this.ffrow.scType = flag
				this.shipperConsigneeVisible = true;
			},
			shipperConsigneeCallback(rrow) {
				if (rrow.scType === 1) {
					this.ruleForm.consignee.scType = 1;
					this.ruleForm.consignee.scName = rrow.scName;
					this.ruleForm.consignee.scMnemonic = rrow.scMnemonic;
					this.ruleForm.consignee.scAddress = rrow.scAddress;
					this.ruleForm.consignee.scCode = rrow.scCode;
					this.ruleForm.consignee.scCodeType = rrow.scCodeType;
					this.ruleForm.consignee.aeoCode = rrow.aeoCode;
					this.ruleForm.consignee.nationCode = rrow.nationCode;
					this.ruleForm.consignee.stateCode = rrow.stateCode;
					this.ruleForm.consignee.cityCode = rrow.cityCode;
					this.ruleForm.consignee.cityName = rrow.cityName;
					this.ruleForm.consignee.postCode = rrow.postCode;
					this.ruleForm.consignee.telNumber = rrow.telNumber;
					this.ruleForm.consignee.faxNumber = rrow.faxNumber;
					this.ruleForm.consignee.scPrintRemark = rrow.scPrintRemark;
				} else {
					this.ruleForm.shipper.scType = 0;
					this.ruleForm.shipper.scName = rrow.scName;
					this.ruleForm.shipper.scMnemonic = rrow.scMnemonic;
					this.ruleForm.shipper.scAddress = rrow.scAddress;
					this.ruleForm.shipper.scCode = rrow.scCode;
					this.ruleForm.shipper.scCodeType = rrow.scCodeType;
					this.ruleForm.shipper.aeoCode = rrow.aeoCode;
					this.ruleForm.shipper.nationCode = rrow.nationCode;
					this.ruleForm.shipper.stateCode = rrow.stateCode;
					this.ruleForm.shipper.cityCode = rrow.cityCode;
					this.ruleForm.shipper.cityName = rrow.cityName;
					this.ruleForm.shipper.postCode = rrow.postCode;
					this.ruleForm.shipper.telNumber = rrow.telNumber;
					this.ruleForm.shipper.faxNumber = rrow.faxNumber;
					this.ruleForm.shipper.scPrintRemark = rrow.scPrintRemark;
				}

			},
			setcheck1NULL() {
				this.ruleForm.trailersCompany = ''
				this.ruleForm.trailersDriver = ''
				this.ruleForm.containerPickupDate = ''
				this.ruleForm.containerPickupAddress = ''
				this.ruleForm.containerArrivalDate = ''
				this.ruleForm.containerArrivalAddress = ''
				this.ruleForm.containerPickupRemark = ''
			},
			setcheck2NULL() {
				this.ruleForm.containerLoadCompany = ''
				this.ruleForm.containerLoadDate = ''
				this.ruleForm.containerLoadWarehouse = ''
				this.ruleForm.containerLoadAddressCn = ''
				this.ruleForm.containerLoadRemark = ''
			},
			setcheck3NULL() {
				this.ruleForm.customsClearanceCompany = ''
				this.ruleForm.customsInspectionDate = ''
				this.ruleForm.customsClearanceDate = ''
				this.ruleForm.customsDeclaresRemark = ''
				this.ruleForm.customsInspectionRemark = ''
			},
			setcheck4NULL() {
				this.ruleForm.arrivalCustomsClearanceCompany = ''
				this.ruleForm.arrivalCustomsInspectionDate = ''
				this.ruleForm.arrivalCustomsClearanceDate = ''
				this.ruleForm.arrivalCustomsInspectionRemark = ''
				this.ruleForm.arrivalCustomsDeclaresRemark = ''
			},
			setcheck5NULL() {
				this.ruleForm.deliveryCompany = ''
				this.ruleForm.deliveryDriver = ''
				this.ruleForm.deliverySigner = ''
				this.ruleForm.deliveryAddress = ''
				this.ruleForm.deliveryDate = ''
				this.ruleForm.deliverySignDate = ''
				this.ruleForm.deliveryRemark = ''
			},
			changeActiveOperationName(val) {
				if (val == 'TG') {
					if (!this.ruleForm.containerPickupService) {
						//清空
						this.setcheck1NULL();
					}
					this.activeOperationName = 'first'
				} else if (val == 'ZX') {
					if (!this.ruleForm.containerLoadService) {
						//清空
						this.setcheck2NULL();

					}
					this.activeOperationName = 'second'
				} else if (val == 'BG') {
					if (!this.ruleForm.customsClearanceService) {
						//清空
						this.setcheck3NULL();

					}
					this.activeOperationName = 'third'
				} else if (val == 'QG') {
					if (!this.ruleForm.arrivalCustomsClearanceService) {
						//清空
						this.setcheck4NULL();

					}
					this.activeOperationName = 'fourth'

				} else if (val == 'PS') {
					if (!this.ruleForm.deliveryService) {
						//清空
						this.setcheck5NULL();

					}
					this.activeOperationName = 'fifth'
				}
			},

			submitForm(formName) {
				if (this.ruleForm.packageType == '') {
					this.openError('请选择包装')
					return
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$confirm('是否 复制费用？', '提示', {
							confirmButtonText: '是',
							cancelButtonText: '否',
							type: 'warning',
							center: true
						}).then(() => {
							this.ruleForm.amountFlag = 1;
							this.ruleForm.amountFlagOrderId = this.frow.orderId;
							this.submitSure();
						}).catch(() => {
							this.ruleForm.amountFlag = '';
							this.ruleForm.amountFlagOrderId = '';
							this.submitSure();
						});
					}
				});
			},
			submitSure() {
				this.loading = true
				this.$axios.post2('/sc/scOrder/se', this.ruleForm)
					.then((response) => {
						if (response.data.code == 0) {
							this.findByPage()
							this.openSuccess("保存成功")
							this.handleClose()
						} else {
							this.openError(response.data.messageInfo)
						}
						this.loading = false
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
						this.loading = false
					});
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
			setSalesName(vId) {
				if (vId) {
					this.ruleForm.salesName = this.useroptions.find((item) => {
						return item.value === vId
					}).label3
				} else {
					this.ruleForm.salesName = ''
				}
			},
			setServicerName(vId) {
				let obj = {};
				obj = this.useroptions.find((item) => {
					return item.value === vId;
				});
				this.ruleForm.servicerName = obj.label3;
				//查询当前客服所在的工作组
				this.$axios.get('/hrs/userWorkgroup/selectWorkgroupByServicerId?servicerId=' + this.ruleForm.servicerId).then(function(response) {
					let userWorkgroupDetailList1 = response.data.data;
					if (userWorkgroupDetailList1 != null && userWorkgroupDetailList1.length > 0) {
						this.setWorkgroup(parseInt(userWorkgroupDetailList1[0]))
					} else {
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
				if (obj) {
					this.ruleForm.workgroupId = obj.workgroupId;
				} else {
					this.ruleForm.workgroupId = ''
				}
			},
			formatDecimalPlaces(item) {
				if (item == 'planWeight') {
					if (this.ruleForm.planWeight) {
						let t = this.ruleForm.planWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderSeDigitsWeight) {
								this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderSeDigitsWeight - t[1].length);
							} else {
								this.ruleForm.planWeight = parseFloat(t[0] + "." + t[1]).toFixed(this.orderSeDigitsWeight);
							}
						} else {
							if (this.orderSeDigitsWeight !== 0) {
								this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderSeDigitsWeight);
							}
						}
					}
				} else if (item == 'planVolume') {
					if (this.ruleForm.planVolume) {
						let t = this.ruleForm.planVolume.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderSeDigitsVolume) {
								this.ruleForm.planVolume = t[0] + "." + t[1] + "000".substr(0, this.orderSeDigitsVolume - t[1].length);
							} else {
								this.ruleForm.planVolume = parseFloat(t[0] + "." + t[1]).toFixed(this.orderSeDigitsVolume);
							}
						} else {
							if (this.orderSeDigitsVolume !== 0) {
								this.ruleForm.planVolume = t[0] + "." + "000".substr(0, this.orderSeDigitsVolume);
							}
						}
					}
				} else if (item == 'planChargeWeight') {
					if (this.ruleForm.planChargeWeight) {
						let t = this.ruleForm.planChargeWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderSeDigitsChargeWeight) {
								this.ruleForm.planChargeWeight = t[0] + "." + t[1] + "000".substr(0, this.orderSeDigitsChargeWeight - t[1].length);
							} else {
								this.ruleForm.planChargeWeight = parseFloat(t[0] + "." + t[1]).toFixed(this.orderSeDigitsChargeWeight);
							}
						} else {
							if (this.orderSeDigitsChargeWeight !== 0) {
								this.ruleForm.planChargeWeight = t[0] + "." + "000".substr(0, this.orderSeDigitsChargeWeight);
							}
						}
					}
				}
			},
			formatToFloat(prop) {
				if (prop == 'planChargeWeight') {
					if (this.orderSeDigitsChargeWeight === 0) {
						this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planChargeWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planChargeWeight = t[0] + "." + t[1].substr(0, this.orderSeDigitsChargeWeight);
					}
				} else if (prop == 'planVolume') {
					if (this.orderSeDigitsVolume === 0) {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderSeDigitsVolume);
					}
				} else if (prop == 'planWeight') {
					if (this.orderSeDigitsWeight === 0) {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderSeDigitsWeight);
					}
				} else if (prop == 'planPieces') {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
					if (this.ruleForm[prop].startsWith("0")) {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
					}
				}
				// if (prop == 'planWeight' || prop == 'planVolume' || prop == 'planChargeWeight') {
				// 	this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789.]/g, "");
				// 	let t = this.ruleForm[prop].split('.');
				// 	if (t.length > 1) {
				// 		if (t[0] == '') {
				// 			this.ruleForm[prop] = "0." + t[1].substr(0, 3);
				// 		} else {
				// 			this.ruleForm[prop] = t[0].substr(0, 7) + "." + t[1].substr(0, 3);
				// 		}
				// 	} else if (this.ruleForm[prop].startsWith("0")) {
				// 		this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
				// 	} else {
				// 		this.ruleForm[prop] = this.ruleForm[prop].substr(0, 7)
				// 	}
				// } else if (prop == 'planPieces') {
				// 	this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
				// 	if (this.ruleForm[prop].startsWith("0")) {
				// 		this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
				// 	}
				// }
			},
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.$axios.get('/hrs/permission/' + 305).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
			}.bind(this));

			//工作组
			this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=SE').then(function(response) {
				this.workgroups = response.data.data;
			}.bind(this));

			this.$axios.get('/sc/vScCategory/运输条款').then((response) => {
				this.transitClauses = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/提单类型').then((response) => {
				this.billingTypes = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/出单类型').then((response) => {
				this.billingMethods = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/运费条款').then((response) => {
				this.paymentMethods = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/装箱方式').then((response) => {
				this.containerMethods = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/包装类型').then((response) => {
				this.packageTypes = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
				this.goodsTypes = response.data.data;
			})

			this.$axios.get('/sc/orderShipInfo').then((response) => {
				this.shipInfoAll = response.data.data;
				this.shipInfos = this.shipInfoAll.slice(0, 10)
			})
			this.vLoad = true
			this.$axios.get('/sc/scOrder/' + this.frow.orderId).then((response) => {
				if (response.data.code == 0) {
					this.ruleForm = response.data.data;
          let ds = {
              portCode: this.ruleForm.departureStation,
              portNameEn: this.ruleForm.departureStationNameEn,
              portNameCn: this.ruleForm.departureStationNameCn
          };
          this.departureStations = [];
          this.departureStations.push(ds);
          let as = {
              portCode: this.ruleForm.arrivalStation,
              portNameEn: this.ruleForm.arrivalStationNameEn,
              portNameCn: this.ruleForm.arrivalStationNameCn
          };
          this.arrivalStations = [];
          this.arrivalStations.push(as);
          let ts = {
              portCode: this.ruleForm.transitStation,
              portNameEn: this.ruleForm.transitStationNameEn,
              portNameCn: this.ruleForm.transitStationNameCn
          };
          this.transitStations = [];
          if(ts){
              this.transitStations.push(ts);
          }
					this.ruleForm.goodsType = '普货';
					// this.ruleForm.goodsNameCn = '';
					// this.ruleForm.goodsNameEn = '';
					// this.ruleForm.shippingMarks = '';
					// this.ruleForm.waybillRemark = '';
					this.ruleForm.deliveryService = false;
					this.ruleForm.arrivalCustomsClearanceService = false;
					this.ruleForm.customsClearanceService = false;
					this.ruleForm.containerLoadService = false;
					this.ruleForm.containerPickupService = false;
					this.ruleForm.bookingNumber = ""
					this.setcheck1NULL();
					this.setcheck2NULL();
					this.setcheck3NULL();
					this.setcheck4NULL();
					this.setcheck5NULL();
			/*		this.$axios.get('/sc/portMaintenance').then((resp) => {
						this.seaPorts = resp.data.data;
						this.departureStations = this.seaPorts.slice(0, 10)
						this.transitStations = this.seaPorts.slice(0, 10)
						this.arrivalStations = this.seaPorts.slice(0, 10)
						if (this.ruleForm.departureStation) {
							if (this.departureStations.every(port => port.portCode != this.ruleForm.departureStation)) {
								this.departureStations = this.departureStations.concat(this.seaPorts.filter(port => port.portCode == this.ruleForm.departureStation))
							}
						}
						if (this.ruleForm.transitStation) {
							if (this.transitStations.every(port => port.portCode != this.ruleForm.transitStation)) {
								this.transitStations = this.transitStations.concat(this.seaPorts.filter(port => port.portCode == this.ruleForm.transitStation))
							}
						}
						if (this.ruleForm.arrivalStation) {
							if (this.arrivalStations.every(port => port.portCode != this.ruleForm.arrivalStation)) {
								this.arrivalStations = this.arrivalStations.concat(this.seaPorts.filter(port => port.portCode == this.ruleForm.arrivalStation))
							}
						}
						this.vLoad = false
					})*/
          this.vLoad = false
				} else {
					this.vLoad = false
					this.openError(response.data.messageInfo)
				}
			}).catch((error) => {
				this.vLoad = false
				this.openError(error.response.data.messageInfo)
			})
			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces").then((response) => {
				if (response.data.code == 0) {
					if (response.data.data.orderSeDigitsWeight != null) {
						this.orderSeDigitsWeight = response.data.data.orderSeDigitsWeight
					}
					if (response.data.data.orderSeDigitsVolume != null) {
						this.orderSeDigitsVolume = response.data.data.orderSeDigitsVolume
					}
					if (response.data.data.orderSeDigitsChargeWeight != null) {
						this.orderSeDigitsChargeWeight = response.data.data.orderSeDigitsChargeWeight
					}
				} else {
					this.openError(response.data.messageInfo)
				}
			});

		}
	}
</script>
<style>
	.widthWithSix .el-input-group__prepend {
		padding: 0 11px;
	}

	.widthWithFive .el-input-group__prepend {
		padding: 0 13px;
	}

	.widthWithFourWithXing .el-input-group__prepend {
		padding: 0 15px;
	}

	.widthWithFourWithXG .el-input-group__prepend {
		padding: 0 18px;
	}

	.widthWithThree .el-input-group__prepend {
		padding: 0 27px;
	}

	.widthWithThreeWithXing .el-input-group__prepend {
		padding: 0 22px;
	}

	.widthWithTwo .el-input-group__prepend {
		padding: 0 34px;
	}

	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}
</style>
