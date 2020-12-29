<template>
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div class="orderEditPage" style="width: 1280px;">
			<el-form v-loading="vLoad" :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">海运进口订单&nbsp;-&nbsp;复制</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="orderCode">
							<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:240px;margin-right: 15px;" @input="ruleForm.orderCode=ruleForm.orderCode.toUpperCase()">
								<template slot="prepend">业务单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="customerName">
							<el-input class="widthWithFourWithXing" readOnly v-model="ruleForm.customerName" style="width:623px;margin-right: 15px;">
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
							<el-input class="widthWithFourWithXing" style="width:227px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>销售/客服</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.salesId" filterable placeholder="请选择" @change="setSalesName" style="width:130px;margin-right: -5px;">
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
						<el-form-item prop="customerNumber">
							<el-input class="widthWithFourWithXing" v-model="ruleForm.customerNumber" @input="ruleForm.customerNumber=ruleForm.customerNumber.toUpperCase()" clearable maxlength="30" auto-complete="off" style="width:240px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>客户单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="mblNumber">
							<el-input v-model="ruleForm.mblNumber" @input="ruleForm.mblNumber=ruleForm.mblNumber.toUpperCase()" auto-complete="off" maxlength="20" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>主提单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="hblNumber">
							<el-input v-model="ruleForm.hblNumber" @input="ruleForm.hblNumber=ruleForm.hblNumber.toUpperCase()" auto-complete="off" maxlength="40" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>分提单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item>
              <el-input class="widthWorkGroup" auto-complete="off" style="width:338px;" clearable>
                <template slot="prepend">
                  <span>工作组</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.workgroupId" placeholder="请选择工作组" style="width:240px;margin-right: -5px;" clearable>
                  <el-option v-for="item in workgroups" :key="item.workgroupId" :label="item.workgroupName" :value="item.workgroupId">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
					<!--<el-col class="elementWidth">
						<el-form-item prop="servicerId">
							<el-input class="widthWithFourWithXing" style="width:340px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>责任客服</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.servicerId" clearable filterable placeholder="请选择" @change="setServicerName" style="width:243px;margin-right: -5px;">
									<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>-->
				</el-row>
				<div style="padding:0px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" clearable auto-complete="off" style="width:240px;margin-right: 15px;">
								<template slot="prepend">
									<span>船名</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.shipName" :filter-method="changeShipName" clearable filterable placeholder="请选择" style="width:143px;margin-right: -5px;">
									<el-option v-for="(item,index) in shipInfos" :key="index" :label="item.shipNameEn" :value="item.shipNameEn">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" v-model="ruleForm.shipVoyageNumber" maxlength="50" auto-complete="off" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>船次</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="expectArrival">
							<el-input class="widthWithFourWithXing" style="width:300px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>到港日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.expectArrival" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择到港日期" style="width: 203px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:340px;">
								<template slot="prepend">运输条款</template>
								<el-select slot="suffix" v-model="ruleForm.transitClause" clearable placeholder="请选择" style="width:243px;margin-right: -5px;">
									<el-option v-for="(item,index) in transitClauses" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="departureStation">
							<el-input class="widthWithThreeWithXing" auto-complete="off" style="width:240px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>起运港</span>
								</template>
                <el-select slot="suffix"  clearable  remote :filter-method="changeDepartureStation" filterable  :loading="loading" v-model="ruleForm.departureStation"
                           @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()"
                           placeholder="请输入关键词" style="width:143px;margin-right: -5px;" >
                  <el-option v-for="item in departureStations" :key="item.portCode" :value="item.portCode" :label="item.portNameEn">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.portCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.portNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.portNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
								<!--<el-select slot="suffix" v-model="ruleForm.departureStation" @visible-change="blurDepartureStation" :filter-method="changeDepartureStation" clearable filterable placeholder="请选择" style="width:143px;margin-right: -5px;">
									<el-option v-for="(item,index) in departureStations" :key="index" :label="item.portNameEn" :value="item.portCode">
										<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
									</el-option>
								</el-select>-->
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" auto-complete="off" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>中转港</span>
								</template>
                <el-select slot="suffix"  clearable remote :filter-method="changeTransitStation" filterable  :loading="loading" v-model="ruleForm.transitStation"
                           @input="ruleForm.transitStation = ruleForm.transitStation.toUpperCase()"
                           placeholder="请输入关键词" style="width:202px;margin-right: -5px;" >
                  <el-option v-for="item in transitStations" :key="item.portCode" :value="item.portCode" :label="item.portNameEn">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.portCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.portNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.portNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
			<!--					<el-select slot="suffix" v-model="ruleForm.transitStation" @visible-change="blurTransitStation" :filter-method="changeTransitStation" clearable filterable placeholder="请选择" style="width:202px;margin-right: -5px;">
									<el-option v-for="(item,index) in transitStations" :key="index" :label="item.portNameEn" :value="item.portCode">
										<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
									</el-option>
								</el-select>-->
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="arrivalStation">
							<el-input class="widthWithThreeWithXing" clearable auto-complete="off" style="width:299px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>目的港</span>
								</template>
                <el-select slot="suffix"  clearable remote :filter-method="changeArrivalStation" filterable  :loading="loading" v-model="ruleForm.arrivalStation"
                           @input="ruleForm.arrivalStation = ruleForm.arrivalStation.toUpperCase()"
                           placeholder="请输入关键词" style="width:202px;margin-right: -5px;" >
                  <el-option v-for="item in arrivalStations" :key="item.portCode" :value="item.portCode" :label="item.portNameEn">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.portCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.portNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.portNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
								<!--<el-select slot="suffix" v-model="ruleForm.arrivalStation" @visible-change="blurArrivalStation" :filter-method="changeArrivalStation" clearable filterable placeholder="请选择" style="width:202px;margin-right: -5px;">
									<el-option v-for="(item,index) in arrivalStations" :key="index" :label="item.portNameEn" :value="item.portCode">
										<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
									</el-option>
								</el-select>-->
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:340px;">
								<template slot="prepend">放货方式</template>
								<el-select slot="suffix" v-model="ruleForm.dischargingMethod" clearable placeholder="请选择" style="width:243px;margin-right: -5px;">
									<el-option v-for="(item,index) in dischargingMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="containerMethod">
							<el-input style="width:240px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>装箱方式</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.containerMethod" clearable placeholder="请选择" style="width:143px;margin-right: -5px;">
									<el-option v-for="(item,index) in containerMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.containerList" auto-complete="off" style="width:623px;margin-right: 15px;" readOnly>
								<template slot="prepend">
									<span>集装箱量</span>
								</template>
								<el-button slot="append" @click="editContainerList" icon="el-icon-edit"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.containerNumber" auto-complete="off" style="width:340px;" readOnly>
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
							<el-input maxlength="6" class="widthWithTree" @input="formatToFloat('planPieces')" v-model="ruleForm.planPieces" auto-complete="off" style="width:240px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<span>件数</span>
								</template>
								<el-select slot="append" v-model="ruleForm.packageType" clearable placeholder="包装" style="width:75px;">
									<el-option v-for="(item,index) in packageTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithTwo" @input="formatToFloat('planWeight')" @change="formatDecimalPlaces('planWeight')" v-model="ruleForm.planWeight" auto-complete="off" style="width:299px;margin-right: 15px;" clearable>
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
							<el-input class="widthWithTwo" @input="formatToFloat('planVolume')" @change="formatDecimalPlaces('planVolume')" v-model="ruleForm.planVolume" auto-complete="off" style="width:299px;margin-right: 15px;" clearable>
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
							<el-input class="widthWithThree" @input="formatToFloat('planChargeWeight')" @change="formatDecimalPlaces('planChargeWeight')" v-model="ruleForm.planChargeWeight" auto-complete="off" style="width:340px;" clearable>
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
							<el-input v-model="ruleForm.orderRemark" auto-complete="off" style="width:1253px;" show-word-limit maxlength="300" clearable>
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
					<span>收发货人</span>
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
									<el-input type="textarea" v-model="ruleForm.shipper.scPrintRemark" auto-complete="off" :rows="5" disabled style="width:520px">
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
									<el-input type="textarea" v-model="ruleForm.consignee.scPrintRemark" auto-complete="off" :rows="5" disabled style="width:520px">
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
									<el-input type="textarea" show-word-limit maxlength="100" v-model="ruleForm.notifierRemark" @input="ruleForm.notifierRemark=ruleForm.notifierRemark.toUpperCase()" auto-complete="off" :rows="5" style="width:520px">
									</el-input>
								</el-form-item>
							</el-row>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>起运港代理</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input type="textarea" show-word-limit maxlength="100" v-model="ruleForm.departureStationAgent" @input="ruleForm.departureStationAgent=ruleForm.departureStationAgent.toUpperCase()" auto-complete="off" :rows="5" style="width:520px">
									</el-input>
								</el-form-item>
							</el-row>
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
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="ruleForm.goodsNameCn" auto-complete="off" style="width:775px;" show-word-limit maxlength="200" clearable>
									<template slot="prepend">
										<span>中文品名</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlagOperation">
						<el-tabs style="width: 1100px;height:280px;margin-left: 50px;" type="border-card" v-model="activeOperationName">
							<el-tab-pane name="first">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.changeOrderService" @change="changeActiveOperationName('HD')"></el-checkbox>换单服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;margin-right: 15px;">
												<template slot="prepend">
													<span>换单日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.changeOrderService" slot="suffix" v-model="ruleForm.changeOrderDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择换单日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.changeOrderService" v-model="ruleForm.changeOrderAgent" auto-complete="off" style="width:730px;" show-word-limit maxlength="200" clearable>
												<template slot="prepend">
													<span>换单代理</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>换单备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.changeOrderService" type="textarea" show-word-limit maxlength="100" v-model="ruleForm.changeOrderRemark" auto-complete="off" :rows="5" style="width: 1055px;">
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
											<el-input :disabled="!ruleForm.warehouseService" v-model="ruleForm.warehouseOperator" auto-complete="off" style="width:405px;margin-right: 15px;" clearable>
												<template slot="prepend">
													<span>操作公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;margin-right: 15px;">
												<template slot="prepend">
													<span>入库日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.warehouseService" slot="suffix" v-model="ruleForm.inboundDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择入库日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;">
												<template slot="prepend">
													<span>出库日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.warehouseService" slot="suffix" v-model="ruleForm.outboundDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择出库日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.warehouseService" v-model="ruleForm.damageRemark" auto-complete="off" style="width:1055px;" clearable>
												<template slot="prepend">
													<span>破损记录</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>操作备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.warehouseService" type="textarea" show-word-limit maxlength="100" v-model="ruleForm.operationRemark" auto-complete="off" :rows="3" style="width: 1055px;">
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
											<el-input :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsClearanceCompany" auto-complete="off" style="width:405px;margin-right: 15px;" clearable>
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
											<el-input :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsInspectionRemark" auto-complete="off" style="width:1055px;" clearable>
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
											<el-input :disabled="!ruleForm.customsClearanceService" type="textarea" show-word-limit maxlength="100" v-model="ruleForm.customsDeclaresRemark" auto-complete="off" :rows="3" style="width: 1055px;">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane name="fourth">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.deliveryService" @change="changeActiveOperationName('PS')"></el-checkbox>派送服务
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.deliveryService" v-model="ruleForm.deliveryCompany" auto-complete="off" style="width:300px;margin-right: 15px;" clearable>
												<template slot="prepend">
													<span>卡车公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.deliveryService" class="widthWithFourWithXG" v-model="ruleForm.deliveryDriver" auto-complete="off" style="width:730px;" clearable>
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
											<el-input :disabled="!ruleForm.deliveryService" class="widthWithFive" v-model="ruleForm.deliverySigner" auto-complete="off" style="width:300px;margin-right: 15px;" clearable>
												<template slot="prepend">
													<span>收货人信息</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.deliveryService" v-model="ruleForm.deliveryAddress" auto-complete="off" style="width:730px;" clearable>
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
														<el-input :disabled="!ruleForm.deliveryService" type="textarea" show-word-limit maxlength="100" v-model="ruleForm.deliveryRemark" auto-complete="off" :rows="3" style="width: 730px;">
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
			<shipperConsignee ref="addMission" v-if="shipperConsigneeVisible" :visible.sync="shipperConsigneeVisible" :frow="ffrow"></shipperConsignee>
			<container ref="addMission" v-if="containerVisible" :visible.sync="containerVisible" :frow="ffrow"></container>
		</div>
	</el-dialog>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
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
				// let regE = /^[0-9]*[0-9][0-9]*$/g;
				let regE = /^[1-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位大于0的整数'));
				} else {
					callback();
				}
			};
			var checkNumber2 = (rule, value, callback) => {
				// let regE = /^[0-9]*[0-9][0-9]*$/g;
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
				seaPorts: [],
				departureStations: [],
				transitStations: [],
				arrivalStations: [],
				dischargingMethods: [],
				containerMethods: [],
				packageTypes: [],
				goodsTypes: [],
				customsDeclaresTypes: [],
				deliveryMethods: [],
				shipInfos: [],
				shipInfoAll: [],
				shipperConsigneeVisible: false,
				customerSelectVisible: false,
				containerVisible: false,
				showFlagConAndShipper: false,
				showFlagOperation: false,
				ffrow: {
					awbFromType: ''
				},
				activeOperationName: 'first',
				loading: false,
				vLoad: false,
				ifFullscreen: false,
				style: {},
        orderSiDigitsWeight:3,
        orderSiDigitsVolume:3,
        orderSiDigitsChargeWeight:3,
				ruleForm: {
					changeOrderService: false,
					warehouseService: false,
					customsClearanceService: false,
					deliveryService: false,
					warehouseOperator: '',
					inboundDate: '',
					outboundDate: '',
					damageRemark: '',
					operationRemark: '',
					customsClearanceCompany: '',
					customsInspectionDate: '',
					customsClearanceDate: '',
					customsInspectionRemark: '',
					customsDeclaresRemark: '',
					deliveryCompany: '',
					deliveryDriver: '',
					deliverySigner: '',
					deliveryAddress: '',
					deliveryDate: '',
					deliverySignDate: '',
					deliveryRemark: '',

					orderCode: '',
					customerName: '',
					coopId: '',
					customerNumber: '',
					salesId: '',
					salesName: '',
					servicerId: '',
					servicerName: '',
					mblNumber: '',
					hblNumber: '',
					shipName: '',
					shipVoyageNumber: '',
					expectArrival: '',
					transitClause: '',
					departureStation: '',
					arrivalStation: '',
					transitStation: '',
					dischargingMethod: '',
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
					departureStationAgent: '',
					containerList: '',
					goodsType: '',
					goodsNameCn: '',
					changeOrderDate: '',
					changeOrderAgent: '',
					changeOrderRemark: '',
          workgroupId: '',
				},
				rules: {
					customerName: [{
						required: true,
						message: '请选择客户',
						trigger: ['blur', 'change']
					}],
					customerNumber: [{
						required: true,
						message: '请录入客户单号',
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
					expectArrival: [{
						required: true,
						message: '请选择到港日期',
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
			'shipperConsignee': ShipperConsignee
		},
		provide() {
			return {
				setValue: this.setValue,
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
				this.ffrow.containerDetails = this.ruleForm.containerDetails
			},
			containerCallback(row) {
				this.ruleForm.containerList = row.val
				this.ruleForm.containerNumber = row.total
				this.ruleForm.containerDetails = row.containerDetails
			},
			selectCustomer() {
				this.ffrow.businessScope = 'SI'
				this.customerSelectVisible = true
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
				this.ruleForm.changeOrderDate = ''
				this.ruleForm.changeOrderRemark = ''
				this.ruleForm.changeOrderAgent = ''
			},
			setcheck2NULL() {
				this.ruleForm.warehouseOperator = ''
				this.ruleForm.inboundDate = ''
				this.ruleForm.outboundDate = ''
				this.ruleForm.damageRemark = ''
				this.ruleForm.operationRemark = ''
			},
			setcheck3NULL() {
				this.ruleForm.customsClearanceCompany = ''
				this.ruleForm.customsInspectionDate = ''
				this.ruleForm.customsClearanceDate = ''
				this.ruleForm.customsDeclaresRemark = ''
				this.ruleForm.customsInspectionRemark = ''
			},
			setcheck4NULL() {
				this.ruleForm.deliveryCompany = ''
				this.ruleForm.deliveryDriver = ''
				this.ruleForm.deliverySigner = ''
				this.ruleForm.deliveryAddress = ''
				this.ruleForm.deliveryDate = ''
				this.ruleForm.deliverySignDate = ''
				this.ruleForm.deliveryRemark = ''
			},
			changeActiveOperationName(val) {
				if (val == 'HD') {
					if (!this.ruleForm.changeOrderService) {
						//清空
						this.setcheck1NULL();

					}
					this.activeOperationName = 'first'
				} else if (val == 'KN') {
					if (!this.ruleForm.warehouseService) {
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
				} else if (val == 'PS') {
					if (!this.ruleForm.deliveryService) {
						//清空
						this.setcheck4NULL();

					}
					this.activeOperationName = 'fourth'
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
				if (this.ruleForm.packageType == '') {
					this.openError('请选择包装')
					return
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.post2('/sc/scOrder/si', this.ruleForm)
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
					}
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
          if(obj){
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
          }
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
      formatDecimalPlaces(item) {
         if (item == 'planWeight') {
           if (this.ruleForm.planWeight) {
             let t = this.ruleForm.planWeight.split('.');
             if (t.length > 1) {
               if (t[1].length < this.orderSiDigitsWeight) {
                 this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderSiDigitsWeight - t[1].length);
               }else{
            this.ruleForm.planWeight =parseFloat(t[0] + "." + t[1]).toFixed(this.orderSiDigitsWeight);
          }
             } else {
               if (this.orderSiDigitsWeight !== 0) {
                 this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderSiDigitsWeight);
               }
             }
           }
         } else if (item == 'planVolume') {
           if (this.ruleForm.planVolume) {
             let t = this.ruleForm.planVolume.split('.');
             if (t.length > 1) {
               if (t[1].length < this.orderSiDigitsVolume) {
                 this.ruleForm.planVolume = t[0] + "." + t[1] + "000".substr(0, this.orderSiDigitsVolume - t[1].length);
               }else{
            this.ruleForm.planVolume =parseFloat(t[0] + "." + t[1]).toFixed(this.orderSiDigitsVolume);
          }
             } else {
               if (this.orderSiDigitsVolume !== 0) {
                 this.ruleForm.planVolume = t[0] + "." + "000".substr(0, this.orderSiDigitsVolume);
               }
             }
           }
         }else if(item == 'planChargeWeight'){
            if (this.ruleForm.planChargeWeight) {
            	let t = this.ruleForm.planChargeWeight.split('.');
            	if (t.length > 1) {
            		if (t[1].length < this.orderSiDigitsChargeWeight) {
            			this.ruleForm.planChargeWeight = t[0] + "." + t[1] + "000".substr(0, this.orderSiDigitsChargeWeight - t[1].length);
            		}else{
                   this.ruleForm.planChargeWeight =parseFloat(t[0] + "." + t[1]).toFixed(this.orderSiDigitsChargeWeight);
                }
            	} else {
            		if (this.orderSiDigitsChargeWeight !== 0) {
            			this.ruleForm.planChargeWeight = t[0] + "." + "000".substr(0, this.orderSiDigitsChargeWeight);
            		}
            	}
            }
          }
      },
			formatToFloat(prop) {
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
        if ( prop == 'planChargeWeight') {
          if (this.orderSiDigitsChargeWeight === 0) {
            this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789]/g, "");
          } else {
            this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789.]/g, "");
          }
          let t = this.ruleForm.planChargeWeight.split('.');
          if (t.length > 1) {
            this.ruleForm.planChargeWeight = t[0] + "." + t[1].substr(0, this.orderSiDigitsChargeWeight);
          }
        }else if(prop == 'planVolume'){
          if (this.orderSiDigitsVolume === 0) {
            this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789]/g, "");
          } else {
            this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
          }
          let t = this.ruleForm.planVolume.split('.');
          if (t.length > 1) {
            this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderSiDigitsVolume);
          }
        }else if(prop == 'planWeight'){
          if (this.orderSiDigitsWeight === 0) {
            this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
          } else {
            this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
          }
          let t = this.ruleForm.planWeight.split('.');
          if (t.length > 1) {
            this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderSiDigitsWeight);
          }
        } else if (prop == 'planPieces') {
        	this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
        	if (this.ruleForm[prop].startsWith("0")) {
        		this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
        	}
        }
			},
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.$axios.get('/hrs/permission/' + 294).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
			}.bind(this));

      //工作组
      this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=SI').then(function(response) {
          this.workgroups = response.data.data;
      }.bind(this));

			this.$axios.get('/sc/vScCategory/运输条款').then((response) => {
				this.transitClauses = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/放货方式').then((response) => {
				this.dischargingMethods = response.data.data;
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
					this.ruleForm.goodsNameCn = '';
					this.ruleForm.changeOrderService = false;
					this.ruleForm.warehouseService = false;
					this.ruleForm.customsClearanceService = false;
					this.ruleForm.deliveryService = false;
					this.setcheck1NULL();
					this.setcheck2NULL();
					this.setcheck3NULL();
					this.setcheck4NULL();
/*					this.$axios.get('/sc/portMaintenance').then((resp) => {
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

      this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces").then((response) => {
        if (response.data.code == 0) {
          if (response.data.data.orderSiDigitsWeight != null) {
            this.orderSiDigitsWeight = response.data.data.orderSiDigitsWeight
          }
          if (response.data.data.orderSiDigitsVolume != null) {
            this.orderSiDigitsVolume = response.data.data.orderSiDigitsVolume
          }
          if (response.data.data.orderSiDigitsChargeWeight != null) {
            this.orderSiDigitsChargeWeight = response.data.data.orderSiDigitsChargeWeight
          }
        } else {
          this.openError(response.data.messageInfo)
        }
      });
		}
	}
</script>
<style>
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
</style>
