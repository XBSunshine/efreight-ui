<template>
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div class="orderEditPage" style="width: 1280px;">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">空运进口订单 - 新增</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" prop="orderCode">
							<el-input v-model="ruleForm.orderCode" disabled style="width:240px;margin-right: 15px;">
								<template slot="prepend">业务单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="coopName">
							<el-input v-model="ruleForm.coopName" style="width:623px;margin-right: 15px;" readOnly class="widthWithFive">
								<template slot="prepend"><b style="color:red">*</b>客户名称</template>
								<el-button slot="append" icon="el-icon-search" @click="gotoSelectPage('ruleForm')"></el-button>
							</el-input>

						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="salesId">
							<el-input style="width:227px;">
								<template slot="prepend">销售/客服</template>
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
						<el-form-item label="" prop="customerNumber">
							<el-input v-model="ruleForm.customerNumber" @input="ruleForm.customerNumber=ruleForm.customerNumber.toUpperCase()" auto-complete="off" maxlength="40" style="width:240px;margin-right: 15px;" clearable>
								<template slot="prepend">客户单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="awbNumber">
							<el-input class="widthWithThreeWithXing" v-model="ruleForm.awbNumber" auto-complete="off" maxlength="12" @input="formatToFloat('awbNumber')" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend"><b style="color:red">*</b>主单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="hawbNumber">
							<el-input class="widthWithThree" v-model="ruleForm.hawbNumber" @input="ruleForm.hawbNumber=ruleForm.hawbNumber.toUpperCase()" auto-complete="off" maxlength="40" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">分单号</template>
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
<!--					<el-col class="elementWidth">
						<el-form-item label="" prop="servicerId">
							<el-input style="width:340px;">
								<template slot="prepend">责任客服</template>

								<el-select slot="suffix" v-model="ruleForm.servicerId" filterable placeholder="请选择" @change="setServicerName" style="width:243px;margin-right: -5px;">
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
            <el-form-item prop="departureStation">
              <el-input class="widthWithThree" style="width: 240px;margin-right: 15px;">
                <template slot="prepend">
                  <span>始发港</span>
                </template>
                <el-select slot="suffix" clearable  @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()" remote :filter-method="searchAirport" filterable v-model="ruleForm.departureStation"
                           @keydown.native="keydownEvent"
                           placeholder="请输入关键词" style="width:143px;margin-right: -5px;">
                  <el-option v-for="(item, index) in airportList" :key="item.apCode" :value="item.apCode">
                    <el-row :id="item.apCode">
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
              <el-input class="widthWithThree" style="width: 299px;margin-right: 15px;">
                <template slot="prepend">
                  <span>目的港</span>
                </template>
                <el-select slot="suffix"  @input="ruleForm.arrivalStation = ruleForm.arrivalStation.toUpperCase()"  remote :filter-method="searchAirport" filterable v-model="ruleForm.arrivalStation"
                           @keydown.native="currentSelectKey='arrivalStation'"
                           placeholder="请输入关键词" style="width:204px;margin-right: -5px;" >
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
						<el-form-item label="" prop="expectFlight">
							<el-input class="widthWithThree" v-model="ruleForm.expectFlight" @change="ruleForm.expectFlight=strTrim(ruleForm.expectFlight).toUpperCase()" maxlength="10" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">航班号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="expectArrival">
							<el-input style="width:340px;">
								<template slot="prepend"><b style="color:red">*</b>到港日期</template>
								<el-date-picker slot="suffix" v-model="ruleForm.expectArrival" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 243px; margin-right:-5px">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>



				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" prop="planPieces">
							<el-input v-model="ruleForm.planPieces" @change="ruleForm.planPieces=strTrim(ruleForm.planPieces)" @input="formatToFloat('planPieces')" auto-complete="off" style="width:240px;margin-right: 15px;" clearable maxlength="10">
								<template slot="prepend">分单件数</template>

								<el-select slot="append" v-model="ruleForm.packageType" filterable placeholder="请选择" style="width:75px">
									<el-option v-for="item in packageTypeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="planWeight">
							<el-input v-model="ruleForm.planWeight" @change="formatDecimalPlaces('planWeight')" @input="formatToFloat('planWeight')" auto-complete="off" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">分单毛重</template>
								<template slot="append">KG</template>
							</el-input>

						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="planVolume">
							<el-input v-model="ruleForm.planVolume" @change="formatDecimalPlaces('planVolume')" @input="formatToFloat('planVolume')" auto-complete="off" style="width:299px;margin-right: 15px;" clearable>
								<template slot="prepend">分单体积</template>
								<template slot="append">CBM</template>
							</el-input>

						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" prop="planChargeWeight">
							<el-input class="widthWithFive2" v-model="ruleForm.planChargeWeight" @change="formatDecimalPlaces('planChargeWeight')" @input="formatToFloat('planChargeWeight')" auto-complete="off" style="width:340px" clearable>
								<template slot="prepend"><b style="color:red">*</b>分单计重</template>
								<template slot="append">KG</template>
							</el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" prop="orderRemark">
							<el-input class="showWordLimit" v-model="ruleForm.orderRemark" @change="ruleForm.orderRemark=strTrim(ruleForm.orderRemark)" auto-complete="off" style="width:1254px" show-word-limit maxlength="200" clearable>
								<template slot="prepend">订单备注</template>

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
								<el-button @click="gotoShipperConsigneePage(0)" icon="el-icon-edit" type="text">编辑</el-button>
							</el-row>
							<el-row>
								<el-form-item>
									<el-input type="textarea" v-model="ruleForm.afOrderShipperConsignee2.scPrintRemark" auto-complete="off" :rows="5" disabled style="width:520px">
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
									<el-input type="textarea" v-model="ruleForm.afOrderShipperConsignee1.scPrintRemark" auto-complete="off" :rows="5" disabled style="width:520px">
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
									<el-input type="textarea" show-word-limit maxlength="500" v-model="ruleForm.notifierRemark" @input="ruleForm.notifierRemark=ruleForm.notifierRemark.toUpperCase()" auto-complete="off" :rows="5" style="width:520px">
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
									<el-input type="textarea" show-word-limit maxlength="500" v-model="ruleForm.departureAgent" @input="ruleForm.departureAgent=ruleForm.departureAgent.toUpperCase()" auto-complete="off" :rows="5" style="width:520px">
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
					<el-button type="text" size="small" v-if=showFlag2 v-on:click="showFlag2=false">收起<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" size="small" v-if=!showFlag2 v-on:click="showFlag2=true">展开<i class="el-icon-arrow-up"></i></el-button>


					<el-row v-show="showFlag2">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item label="" prop="goodsType">
								<el-input style="width:300px;margin-right: 15px;">
									<template slot="prepend">货物类型</template>
									<el-select slot="suffix" v-model="ruleForm.goodsType" filterable placeholder="请选择" style="width: 203px;margin-right: -5px;">
										<el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="" prop="goodsNameCn">
								<el-input class="showWordLimit" v-model="ruleForm.goodsNameCn" @change="ruleForm.goodsNameCn=strTrim(ruleForm.goodsNameCn).toUpperCase()" auto-complete="off" style="width:775px" clearable show-word-limit maxlength="200">
									<template slot="prepend">中文品名</template>

								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag2">
						<el-col class="elementWidth" style="margin-left: 50px;">
							<el-form-item label="" prop="cargoFlowType">
								<el-input style="width:300px;margin-right: 15px;">
									<template slot="prepend">货物流向</template>

									<el-select slot="suffix" v-model="ruleForm.cargoFlowType" filterable placeholder="请选择" style="width:203px; margin-right:-5px">
										<el-option v-for="item in cargoFlowTypeOptions" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="" prop="cargoFlowRemark">
								<el-input class="showWordLimit" v-model="ruleForm.cargoFlowRemark" @change="ruleForm.cargoFlowRemark=strTrim(ruleForm.cargoFlowRemark)" auto-complete="off" style="width:775px" clearable show-word-limit maxlength="200">
									<template slot="prepend">流向备注</template>

								</el-input>
							</el-form-item>
						</el-col>
					</el-row>


					<el-row v-show="showFlag2">
						<el-tabs style="width: 1100px;height:280px;margin-left: 50px;" type="border-card" v-model="activeOperationName">
							<el-tab-pane name="first">
								<span slot="label" style="color: #909399;">
									<el-checkbox style="margin-right: 5px;" v-model="ruleForm.switchAwbService" @change="changeActiveOperationName('HD')"></el-checkbox>外库调单
								</span>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input style="width:300px;margin-right: 15px;">
												<template slot="prepend">
													<span>调单日期</span>
												</template>
												<el-date-picker :disabled="!ruleForm.switchAwbService" slot="suffix" v-model="ruleForm.switchAwbDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 203px;margin-right: -5px;">
												</el-date-picker>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.switchAwbService" v-model="ruleForm.switchAwbAddress" auto-complete="off" style="width:730px;" show-word-limit maxlength="200" clearable>
												<template slot="prepend">
													<span>调单地址</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-button type="text" style="margin-left: 20px;margin-top: -20px;" disabled>调单备注</el-button>
								</el-row>
								<el-row>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.switchAwbService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.switchAwbRemark" auto-complete="off" :rows="5" style="width: 1055px;">
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
											<el-input class="showWordLimit" :disabled="!ruleForm.warehouseService" v-model="ruleForm.warehouseOperator" auto-complete="off" style="width:405px;margin-right: 15px;" show-word-limit maxlength="200" clearable>
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
											<el-input class="showWordLimit" :disabled="!ruleForm.warehouseService" v-model="ruleForm.damageRemark" auto-complete="off" style="width:1055px;" show-word-limit maxlength="200" clearable>
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
											<el-input :disabled="!ruleForm.warehouseService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.operationRemark" auto-complete="off" :rows="3" style="width: 1055px;">
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
											<el-input class="showWordLimit" :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsClearanceCompany" auto-complete="off" style="width:405px;margin-right: 15px;" show-word-limit maxlength="200" clearable>
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
												<el-date-picker :disabled="!ruleForm.customsClearanceService" slot="suffix" v-model="ruleForm.customsInspectionDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 203px;margin-right: -5px;">
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
											<el-input class="showWordLimit" :disabled="!ruleForm.customsClearanceService" v-model="ruleForm.customsInspectionRemark" auto-complete="off" style="width:1055px;" show-word-limit maxlength="200" clearable>
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
											<el-input :disabled="!ruleForm.customsClearanceService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.customsDeclaresRemark" auto-complete="off" :rows="3" style="width: 1055px;">
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
											<el-input class="showWordLimit" :disabled="!ruleForm.deliveryService" v-model="ruleForm.deliveryCompany" auto-complete="off" style="width:300px;margin-right: 15px;" show-word-limit maxlength="200" clearable>
												<template slot="prepend">
													<span>卡车公司</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input :disabled="!ruleForm.deliveryService" class="widthWithFourWithXG showWordLimit" v-model="ruleForm.deliveryDriver" @input="ruleForm.deliveryDriver=ruleForm.deliveryDriver.toUpperCase()" auto-complete="off" style="width:730px;" show-word-limit maxlength="200" clearable>
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
											<el-input :disabled="!ruleForm.deliveryService" class="widthWithFive showWordLimit" v-model="ruleForm.deliverySigner" auto-complete="off" style="width:300px;margin-right: 15px;" show-word-limit maxlength="200" clearable>
												<template slot="prepend">
													<span>收货人信息</span>
												</template>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col class="elementWidth">
										<el-form-item>
											<el-input class="showWordLimit" :disabled="!ruleForm.deliveryService" v-model="ruleForm.deliveryAddress" auto-complete="off" style="width:730px;" show-word-limit maxlength="200" clearable>
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
														<el-input :disabled="!ruleForm.deliveryService" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.deliveryRemark" auto-complete="off" :rows="3" style="width: 730px;">
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
						<el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-row>
			</el-form>
			<save ref="addMission" v-if="save" :visible.sync="save" :frow="ffrow"></save>
			<shipperConsignee2 ref="addMission" v-if="shipperConsignee2" :visible.sync="shipperConsignee2" :frow="ffrow"></shipperConsignee2>
		</div>

	</el-dialog>
</template>
<script>
	import save from '@/views/public/customer_select'
	import shipperConsignee2 from '@/views/public/shipper_consignee_select'
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
				let regE = /^[0-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位整数'));
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
        airportList: [],
        currentSelectKey: '',
        workgroups: [],
				helpDocumentUrl: '',
				data1: [],
				options2: [],
				contactsOptions: [],
				useroptions: [],
				productOptions: [],
				transitClauseOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				arrivalMethodOptions: [],
				customsDeclaresTypeOptions: [],
				cargoFlowTypeOptions: [],
				departureWarehouseOptions: [],
				departureStorehouseOptions: [],
				packageTypeOptions: [],
				paymentMethodOptions: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions: [],
				codeOptions: [],
				showFlag1: false,
				showFlag2: false,
				showFlag3: false,
				checkFlag1: false,
				checkFlag2: false,
				checkFlag3: false,
				checkFlag4: false,
				save: false,
				showFlagConAndShipper: false,
				shipperConsignee2: false,
				disabledFlag: false,
				priceValueFlag: false,
				ffrow: {
					awbFromType: ''
				},
				planVolume1: '',
				activeOperationName: 'first',
				ifFullscreen: false,
				style: {},
				orderAiDigitsWeight: 1,
				orderAiDigitsVolume: 3,
				orderAiDigitsChargeWeight: 2,
				ruleForm: {
					orderCode: '',
					projectId: '',
					projectName: '',
					salesName: '',
					servicerName: '',
					coopId: '',
					coopName: '',
					servicerId: '',
					salesId: '',
					// salesManagerName:'',
					awbNumber: '',
					hawbNumber: '',
					orderContacts: [],
					customerNumber: '',
					isConsol: 0,
					hawbFlag: 1,
					hawbQuantity: 0,
					departureStation: '',
					transitStation: '',
					arrivalStation: '',
					expectFlight: '',
					expectDeparture: '',
					expectArrival: '',
					businessProduct: '',
					//					transitClause: '',
					receiptDate: '',
					goodsType: '',
					goodsNameCn: '',
					batteryType: '',
					arrivalMethod: '',
					departureWarehouseId: '',
					// departureWarehouseName:'',
					departureStorehouseId: '',
					// departureStorehouseName:'',
					planPieces: '',
					packageType: '',
					planWeight: '',
					planChargeWeight: '',
					planVolume: '',
					planDimensions: '',
					//					paymentMethod: 'PP',
					currecnyCode: 'CNY',
					msrCurrecnyCode: 'CNY',
					priceType: '单价',
					priceValue: '',
					freightUnitprice: '',
					freightAmount: '',

					priceType2: '单价',
					priceValue2: '',
					msrUnitprice: '',
					msrAmount: '',
					appraisalNote: '',
					shippingMarks: '',
					handlingInfo: '',
					customsStatusCode: '',
					operationRemark: '',
					orderRemark: '',
					cargoFlowType: '',
					cargoFlowRemark: '',

					notifierRemark: '',
					departureAgent: '',
					//外库服务
					switchAwbService: false,
					switchAwbDate: '',
					switchAwbAddress: '',
					switchAwbRemark: '',
					//库内服务
					warehouseService: false,
					warehouseOperator: '',
					inboundDate: '',
					outboundDate: '',
					damageRemark: '',
					//报关服务
					customsClearanceService: false,
					customsDeclaresType: '',
					customsClearanceCompany: '',
					customsInspectionDate: '',
					customsClearanceDate: '',
					customsInspectionRemark: '',
					customsDeclaresRemark: '',
					//派送服务
					deliveryService: false,
					deliveryCompany: '',
					deliveryDriver: '',
					deliverySigner: '',
					deliveryAddress: '',
					deliveryDate: '',
					deliverySignDate: '',
					deliveryRemark: '',

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
          workgroupId: '',
				},
				rules: {

					coopName: [{
						required: true,
						message: '请选择客户名称',
						trigger: ['blur', 'change']
					}],
					awbNumber: [{
						required: true,
						message: '请输入主单号',
						trigger: ['blur', 'change']
					}],
					// orderContacts: [{
					// 	required: true,
					// 	message: '请选择客户联系人',
					// 	trigger: ['blur', 'change']
					// }],
					hawbQuantity: [{
						validator: checkNumber2,
						trigger: ['blur', 'change']
					}],
					departureStation: [{
						min: 3,
						message: '最小长度为 3',
						trigger: ['blur', 'change']
					}],
					arrivalStation: [{
						min: 3,
						message: '最小长度为 3',
						trigger: ['blur', 'change']
					}],
					//					expectFlight: [{
					//						required: true,
					//						message: '请输入预订航班',
					//						trigger: ['blur', 'change']
					//					}],
					expectArrival: [{
						required: true,
						message: '请选择日期',
						trigger: ['blur', 'change']
					}],
					// receiptDate: [{
					// 	required: true,
					// 	message: '请选择预计到货日期',
					// 	trigger: ['blur', 'change']
					// }],
					// businessProduct: [{
					// 	required: true,
					// 	message: '请选择服务产品',
					// 	trigger: ['blur', 'change']
					// }],
					//					transitClause: [{
					//						required: true,
					//						message: '请选择运输条款',
					//						trigger: ['blur', 'change']
					//					}],
					// goodsType: [{
					// 	required: true,
					// 	message: '请选择货物类型',
					// 	trigger: ['blur', 'change']
					// }],
					// goodsNameCn: [{
					// 	required: true,
					// 	message: '请输入中文品名',
					// 	trigger: ['blur', 'change']
					// }],
					// batteryType: [{
					// 	required: true,
					// 	message: '请选择电池情况',
					// 	trigger: ['blur', 'change']
					// }],
					// appraisalNote:[
					//   { required: true, message: '请输入鉴定情况', trigger: ['blur', 'change'] }
					// ],
					arrivalMethod: [{
						required: true,
						message: '请选择到货方式',
						trigger: ['blur', 'change']
					}],
					// departureWarehouseId: [{
					// 	required: true,
					// 	message: '请选择货站',
					// 	trigger: ['blur', 'change']
					// }],
					// planPieces: [
					// 	{
					// 		validator: checkNumber1,
					// 		trigger: ['blur', 'change']
					// 	}
					// ],
					packageType: [{
						required: true,
						message: '请选择包装类型',
						trigger: ['blur', 'change']
					}],
					// planWeight: [{
					// 	required: true,
					// 	message: '请输入预报毛重',
					// 	trigger: ['blur', 'change']
					// }],
					// planVolume: [{
					// 	required: true,
					// 	message: '请输入预报体积',
					// 	trigger: ['blur', 'change']
					// }],
					planChargeWeight: [{
						required: true,
						message: '请输入分单计重',
						trigger: ['blur', 'change']
					}],

					orderRemark: [{
						min: 0,
						max: 500,
						message: '订单备注长度为 500',
						trigger: ['blur', 'change']
					}]
					//					,
					//					paymentMethod: [{
					//						required: true,
					//						message: '请选择付款方式',
					//						trigger: ['blur', 'change']
					//					}]
					//					,
					//					currecnyCode: [{
					//						required: true,
					//						message: '请选择运费币种',
					//						trigger: ['blur', 'change']
					//					}],
					//					priceType: [{
					//						required: true,
					//						message: '请选择运价类型',
					//						trigger: ['blur', 'change']
					//					}],
					//					priceType2: [{
					//						required: true,
					//						message: '请选择成本类型',
					//						trigger: ['blur', 'change']
					//					}],
					//					priceValue: [{
					//						required: true,
					//						message: '请输入运价',
					//						trigger: ['blur', 'change']
					//					}],
					//					priceValue2: [{
					//						required: true,
					//						message: '请输入成本',
					//						trigger: ['blur', 'change']
					//					}]
				}
			};
		},
		inject: ['findByPage', 'continueOperation'],
		components: {
			'save': save,
			'shipperConsignee2': shipperConsignee2,
		},
		provide() {
			return {
				setValue: this.setValue,
				setValue2: this.setValue2,
				submitForm2: this.submitForm3,
				setShipperConsigneeValue2: this.setShipperConsigneeValue2,
			}
		},
		methods: {
      searchAirport(val){
          this.search("/afbase/airport/search/", val, function(data){
              this.airportList = data;
          }.bind(this));

      },
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
              this.$set(this.ruleForm, this.currentSelectKey, val);
              this.$forceUpdate();
          }
          this.loading = true;
          this.$axios.get(url+val).then(function(response){
              this.loading = false;
              callback(response.data.data || []);
          }.bind(this));
      },
      keydownEvent(){
          this.currentSelectKey='departureStation';
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			checkChange1() {
				let flag = false;
				if (this.ruleForm.switchAwbService == true) {
					flag = true;
				}
				this.ruleForm.switchAwbService = flag;
				this.ruleForm.warehouseService = false;
				this.ruleForm.customsClearanceService = false;
				this.ruleForm.deliveryService = false;
				this.checkFlag1 = flag;
				this.checkFlag2 = false;
				this.checkFlag3 = false;
				this.checkFlag4 = false;
			},
			checkChange2() {
				let flag = false;
				if (this.ruleForm.warehouseService == true) {
					flag = true;
				}
				this.ruleForm.switchAwbService = false;
				this.ruleForm.warehouseService = flag;
				this.ruleForm.customsClearanceService = false;
				this.ruleForm.deliveryService = false;
				this.checkFlag2 = flag;
				this.checkFlag1 = false;
				this.checkFlag3 = false;
				this.checkFlag4 = false;
			},
			checkChange3() {
				let flag = false;
				if (this.ruleForm.customsClearanceService == true) {
					flag = true;
				}
				this.ruleForm.switchAwbService = false;
				this.ruleForm.warehouseService = false;
				this.ruleForm.customsClearanceService = flag;
				this.ruleForm.deliveryService = false;
				this.checkFlag3 = flag;
				this.checkFlag1 = false;
				this.checkFlag2 = false;
				this.checkFlag4 = false;
			},
			checkChange4() {
				let flag = false;
				if (this.ruleForm.deliveryService == true) {
					flag = true;
				}
				this.ruleForm.switchAwbService = false;
				this.ruleForm.warehouseService = false;
				this.ruleForm.customsClearanceService = false;
				this.ruleForm.deliveryService = flag;
				this.checkFlag4 = flag;
				this.checkFlag1 = false;
				this.checkFlag2 = false;
				this.checkFlag3 = false;
			},
			awbFromTypeChange() {
				this.ruleForm.awbFromId = '';
				this.ruleForm.awbFromName = '';
			},
			gotoSelectPage() {
				this.ffrow.businessScope = 'AI'
				this.save = true;
			},
			gotoSizePage() {
				// this.ruleForm.planDimensions="1*2*3*4;5*6*7*8";
				// this.ruleForm.planDimensions="";
				this.ffrow.planDimensions = this.ruleForm.planDimensions;
				this.save2 = true;
			},
			setValueold(rrow) {
				this.ruleForm.orderContacts = [];
				this.ruleForm.projectId = rrow.projectId;
				this.ruleForm.projectName = rrow.projectName;
				this.ruleForm.salesName = rrow.salesName;
				this.ruleForm.servicerName = rrow.servicerName;
				this.ruleForm.businessProduct = rrow.businessProduct;
				this.ruleForm.transitClause = rrow.transitClause;
				let param = "size=" + 10 + "&current=" + 1 + "&projectId=" + this.ruleForm.projectId;
				this.$axios.get('/afbase/coopProjectContacts/page?' + param).then(function(response) {
					this.contactsOptions = response.data.data.records;
				}.bind(this));
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
				// this.queryContactsList(rrow.coopId)
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
			setValue2(rrow, pieces, volume) {
				this.ruleForm.planDimensions = rrow;
				this.ruleForm.planPieces = pieces;
				this.ruleForm.planVolume = (volume / 1000000).toFixed(3);
				this.planVolume1 = volume;
				this.setPlanChargeWeight1();
			},
			setPlanChargeWeight() {
				let planChargeWeight = this.ruleForm.planVolume * 1000000 / 6000;
				if (this.ruleForm.planWeight > planChargeWeight) {
					this.ruleForm.planChargeWeight = this.ruleForm.planWeight;
				} else {
					this.ruleForm.planChargeWeight = planChargeWeight.toFixed(1);
				}
			},
			setPlanChargeWeight1() {
				let planChargeWeight = this.planVolume1 / 6000;
				if (this.ruleForm.planWeight > planChargeWeight) {
					this.ruleForm.planChargeWeight = this.ruleForm.planWeight;
				} else {
					this.ruleForm.planChargeWeight = planChargeWeight.toFixed(1);
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
			setcheck1NULL() {
				this.ruleForm.switchAwbDate = '';
				this.ruleForm.switchAwbAddress = '';
				this.ruleForm.switchAwbRemark = '';
			},
			setcheck2NULL() {
				this.ruleForm.warehouseOperator = '';
				this.ruleForm.inboundDate = '';
				this.ruleForm.outboundDate = '';
				this.ruleForm.damageRemark = '';
				this.ruleForm.operationRemark = '';
			},
			setcheck3NULL() {
				this.ruleForm.customsClearanceCompany = '';
				this.ruleForm.customsInspectionDate = '';
				this.ruleForm.customsClearanceDate = '';
				this.ruleForm.customsInspectionRemark = '';
				this.ruleForm.customsDeclaresRemark = '';
			},
			setcheck4NULL() {
				this.ruleForm.deliveryCompany = '';
				this.ruleForm.deliveryDriver = '';
				this.ruleForm.deliverySigner = '';
				this.ruleForm.deliveryAddress = '';
				this.ruleForm.deliveryDate = '';
				this.ruleForm.deliverySignDate = '';
				this.ruleForm.deliveryRemark = '';
			},
			changeActiveOperationName(val) {
				if (val == 'HD') {
					if (!this.ruleForm.switchAwbService) {
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
			submitForm(formName) {
				if (this.ruleForm.hawbNumber.length > 12) {
					this.$confirm('分单号大于12位，确定继续么？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.$refs[formName].validate((valid) => {
							let carrierPrefix = this.ruleForm.awbNumber.substring(0, 3);
							if (valid) {
								let codeFlag1 = 1;
								let codeFlag2 = 1;
								let codeFlag3 = 1;
								let params = {
									apCode: this.ruleForm.departureStation
								};
								this.loading = true
								this.$axios.post2('/afbase/airport/checkCode', params)
									.then(function(response) {
										if (response.data.data.length > 0) {

										} else {
											if (this.ruleForm.departureStation) {
												codeFlag1 = 0
											} else {
												codeFlag1 = 1
											}

										}

										let params2 = {
											apCode: this.ruleForm.arrivalStation
										};
										this.$axios.post2('/afbase/airport/checkCode', params2)
											.then(function(response) {
												if (response.data.data.length > 0) {

												} else {
													if (this.ruleForm.arrivalStation) {
														codeFlag2 = 0
													} else {
														codeFlag2 = 1
													}

												}
												let params3 = {
													carrierPrefix: carrierPrefix
												};
												this.$axios.post2('/afbase/carrier/check3Code', params3)
													.then(function(response) {
														if (response.data.data.length > 0) {

														} else {
															codeFlag3 = 0
														}
														this.doSubmit(codeFlag1, codeFlag2, codeFlag3, formName);

													}.bind(this));
											}.bind(this)).catch((error) => {
												this.loading = false
											})
									}.bind(this)).catch((error) => {
										this.loading = false
									})

							}
						});
					}).catch(() => {});
				} else {
					this.$refs[formName].validate((valid) => {
						let carrierPrefix = this.ruleForm.awbNumber.substring(0, 3);
						if (valid) {
							let codeFlag1 = 1;
							let codeFlag2 = 1;
							let codeFlag3 = 1;
							let params = {
								apCode: this.ruleForm.departureStation
							};
							this.loading = true
							this.$axios.post2('/afbase/airport/checkCode', params)
								.then(function(response) {
									if (response.data.data.length > 0) {

									} else {
										if (this.ruleForm.departureStation) {
											codeFlag1 = 0
										} else {
											codeFlag1 = 1
										}

									}

									let params2 = {
										apCode: this.ruleForm.arrivalStation
									};
									this.$axios.post2('/afbase/airport/checkCode', params2)
										.then(function(response) {
											if (response.data.data.length > 0) {

											} else {
												if (this.ruleForm.arrivalStation) {
													codeFlag2 = 0
												} else {
													codeFlag2 = 1
												}

											}
											let params3 = {
												carrierPrefix: carrierPrefix
											};
											this.$axios.post2('/afbase/carrier/check3Code', params3)
												.then(function(response) {
													if (response.data.data.length > 0) {

													} else {
														codeFlag3 = 0
													}
													this.doSubmit(codeFlag1, codeFlag2, codeFlag3, formName);

												}.bind(this));
										}.bind(this)).catch((error) => {
											this.loading = false
										})
								}.bind(this)).catch((error) => {
									this.loading = false
								})

						}
					});
				}
			},
			doSubmit(codeFlag1, codeFlag2, codeFlag3, formName) {

				if (codeFlag1 == 1 && codeFlag2 == 1 && codeFlag3 == 1) {
					this.submitForm3(formName);
				} else {
					let info = "";
					if (codeFlag1 != 1) {
						info = info + "始发港"
						this.openError("始发港不存在");
						return;
					}
					if (codeFlag2 != 1) {
						info = info + "目的港"
						this.openError("目的港不存在");
						return;
					}
					if (codeFlag3 != 1) {
						info = info + this.ruleForm.awbNumber.substring(0, 3) + "航司三字码"
					}
					this.$confirm(info + '不存在，是否继续保存?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.submitForm3(formName);
					}).catch(() => {
						this.loading = false
					});
				}
			},
			submitForm3(formName) {

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
				// let awb7 = this.ruleForm.awbNumber.substring(4, 11) % 7;
				// let awb1 = this.ruleForm.awbNumber.substring(11);
				// if(awb7 != awb1) {
				//     this.openError("主单号不符合规则");
				//     return;
				// }

				if (this.ruleForm.receiptDate === '') {
					this.ruleForm.receiptDate = null;
				}
				if (this.ruleForm.switchAwbDate === '') {
					this.ruleForm.switchAwbDate = null;
				}
				if (this.ruleForm.inboundDate === '') {
					this.ruleForm.inboundDate = null;
				}
				if (this.ruleForm.outboundDate === '') {
					this.ruleForm.outboundDate = null;
				}
				if (this.ruleForm.customsInspectionDate === '') {
					this.ruleForm.customsInspectionDate = null;
				}
				if (this.ruleForm.customsClearanceDate === '') {
					this.ruleForm.customsClearanceDate = null;
				}
				if (this.ruleForm.deliveryDate === '') {
					this.ruleForm.deliveryDate = null;
				}
				if (this.ruleForm.deliverySignDate === '') {
					this.ruleForm.deliverySignDate = null;
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/afbase/aforder/doSaveAI', this.ruleForm)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
									// this.continueOperation(response.data.data);
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;

								this.openError(errorinfo);

							}.bind(this));
					} else {
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
			setHawbFlag() {
				if (this.ruleForm.isConsol === 0) {
					this.ruleForm.hawbFlag = 1;
				} else {
					this.ruleForm.hawbFlag = 0;
				}
				this.sethawbQuantity();
			},
			sethawbQuantity() {
				if (this.ruleForm.hawbFlag == 1) {
					this.ruleForm.hawbQuantity = 0;
				} else {
					this.ruleForm.hawbQuantity = 1;
				}
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
			businessProductChange() {
				// if(this.ruleForm.businessProduct == "代操作") {
				// 	this.ruleForm.priceValue = '';
				// 	this.ruleForm.priceValue2 = '';
				// 	this.priceValueFlag = true;
				// } else {
				// 	this.priceValueFlag = false;
				// }
			},
			formatDecimalPlaces(item) {
				if (item == 'planWeight') {
					if (this.ruleForm.planWeight) {
						let t = this.ruleForm.planWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAiDigitsWeight) {
								this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderAiDigitsWeight - t[1].length);
							} else {
								this.ruleForm.planWeight = parseFloat(t[0] + "." + t[1]).toFixed(this.orderAiDigitsWeight);
							}
						} else {
							if (this.orderAiDigitsWeight !== 0) {
								this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderAiDigitsWeight);
							}
						}
					}
				} else if (item == 'planVolume') {
					if (this.ruleForm.planVolume) {
						let t = this.ruleForm.planVolume.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAiDigitsVolume) {
								this.ruleForm.planVolume = t[0] + "." + t[1] + "000".substr(0, this.orderAiDigitsVolume - t[1].length);
							} else {
								this.ruleForm.planVolume = parseFloat(t[0] + "." + t[1]).toFixed(this.orderAiDigitsVolume);
							}
						} else {
							if (this.orderAiDigitsVolume !== 0) {
								this.ruleForm.planVolume = t[0] + "." + "000".substr(0, this.orderAiDigitsVolume);
							}
						}
					}
				} else if (item == 'planChargeWeight') {
					if (this.ruleForm.planChargeWeight) {
						let t = this.ruleForm.planChargeWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAiDigitsChargeWeight) {
								this.ruleForm.planChargeWeight = t[0] + "." + t[1] + "000".substr(0, this.orderAiDigitsChargeWeight - t[1].length);
							} else {
								this.ruleForm.planChargeWeight = parseFloat(t[0] + "." + t[1]).toFixed(this.orderAiDigitsChargeWeight);
							}
						} else {
							if (this.orderAiDigitsChargeWeight !== 0) {
								this.ruleForm.planChargeWeight = t[0] + "." + "000".substr(0, this.orderAiDigitsChargeWeight);
							}
						}
					}
				}
			},
			formatToFloat(item) {
				if (item == 'awbNumber') {
					this.ruleForm.awbNumber = this.ruleForm.awbNumber.replace(/[^0123456789.-]/g, "");
					// this.ruleForm.awbNumber = this.ruleForm.awbNumber.replace(/[^123456789-.]/g, "");
					var t = this.ruleForm.awbNumber.split('.');
					if (t.length > 1) {
						this.ruleForm.awbNumber = t[0];
					}
				} else if (item == 'planWeight') {
					if (this.orderAiDigitsWeight === 0) {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderAiDigitsWeight);
					}
					// let value = this.ruleForm.planWeight
					// value = value.replace(/^0*(0\.|[1-9])/, "$1");
					// value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					// value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
					// value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
					// value = value
					// 	.replace(".", "$#$")
					// 	.replace(/\./g, "")
					// 	.replace("$#$", ".");
					// value = value.replace(/^(\-)*(\d*)\.(\d).*$/, "$1$2.$3"); //只能输入两个小数
					// value =
					// 	value.indexOf(".") > 0 ?
					// 	value.split(".")[0].substring(0, 10) + "." + value.split(".")[1] :
					// 	value.substring(0, 10);
					// this.ruleForm.planWeight = value;
				} else if (item == 'planChargeWeight') {

					if (this.orderAiDigitsChargeWeight === 0) {
						this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planChargeWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planChargeWeight = t[0] + "." + t[1].substr(0, this.orderAiDigitsChargeWeight);
					}

					// let value = this.ruleForm.planChargeWeight
					// value = value.replace(/^0*(0\.|[1-9])/, "$1");
					// value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					// value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
					// value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
					// value = value
					// 	.replace(".", "$#$")
					// 	.replace(/\./g, "")
					// 	.replace("$#$", ".");
					// value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
					// value =
					// 	value.indexOf(".") > 0 ?
					// 	value.split(".")[0].substring(0, 10) + "." + value.split(".")[1] :
					// 	value.substring(0, 10);
					// this.ruleForm.planChargeWeight = value;

				} else if (item == 'planVolume') {
					if (this.orderAiDigitsVolume === 0) {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderAiDigitsVolume);
					}
					// let value = this.ruleForm.planVolume
					// value = value.replace(/^0*(0\.|[1-9])/, "$1");
					// value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					// value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
					// value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
					// value = value
					// 	.replace(".", "$#$")
					// 	.replace(/\./g, "")
					// 	.replace("$#$", ".");
					// value = value.replace(/^(\-)*(\d*)\.(\d\d\d).*$/, "$1$2.$3"); //只能输入两个小数
					// value =
					// 	value.indexOf(".") > 0 ?
					// 	value.split(".")[0].substring(0, 10) + "." + value.split(".")[1] :
					// 	value.substring(0, 10);
					// this.ruleForm.planVolume = value;
				} else if (item == 'priceValue') {
					this.ruleForm.priceValue = this.ruleForm.priceValue.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.priceValue.split('.');
					if (t.length > 1) {
						this.ruleForm.priceValue = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'priceValue2') {
					this.ruleForm.priceValue2 = this.ruleForm.priceValue2.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.priceValue2.split('.');
					if (t.length > 1) {
						this.ruleForm.priceValue2 = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'planPieces') {
					this.ruleForm.planPieces = this.ruleForm.planPieces.replace(/[^0123456789]/g, "");
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
			sychronizeWareAndStore() {
				this.ruleForm.departureWarehouseId = '';
				this.ruleForm.departureStorehouseId = '';
				if (this.ruleForm.departureStation != null && this.ruleForm.departureStation !== '') {
					this.ruleForm.departureStation = this.ruleForm.departureStation.trim().toUpperCase()
					this.$axios.get('/afbase/warehouse/getByDeparture?type=货站&departureStation=' + this.ruleForm.departureStation).then(function(response) {
						this.departureWarehouseOptions = response.data.data;
					}.bind(this));
					this.$axios.get('/afbase/warehouse/getByDeparture?type=库房&departureStation=' + this.ruleForm.departureStation).then(function(response) {
						this.departureStorehouseOptions = response.data.data;
					}.bind(this));
				}
			}
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.$axios.get('/hrs/permission/' + 279).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/afbase/aforder/selectCoop').then(function(response) {
				if (response.data.code == 0 && response.data.data.records.length === 1) {
					this.setValue(response.data.data.records[0]);
				}
			}.bind(this));
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
        if (!this.frow.orderId) {//不是复制新增
            if (this.useroptions != null && this.useroptions.length > 0) {
                let userId = window.localStorage.getItem('userId')
                if (userId != null && userId !== '') {
                    this.ruleForm.salesId = parseInt(userId)
                    this.setSalesName(parseInt(userId))
                    this.ruleForm.servicerId = parseInt(userId)
                    this.setServicerName(parseInt(userId))
                }
            }
        }
			}.bind(this));
      //工作组
      this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=AI').then(function(response) {
          this.workgroups = response.data.data;
          let userWorkgroupDetailList = window.localStorage.getItem('userWorkgroupDetailList')
          if(userWorkgroupDetailList != null && userWorkgroupDetailList.length > 0){
              this.setWorkgroup(parseInt(userWorkgroupDetailList[0]))
          }
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
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=电池情况').then(function(response) {
				this.batteryTypeOptions = response.data.data;
				this.ruleForm.batteryType = this.batteryTypeOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=送货方式').then(function(response) {
				this.arrivalMethodOptions = response.data.data;
				this.ruleForm.arrivalMethod = this.arrivalMethodOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=货物流向').then(function(response) {
				this.cargoFlowTypeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=报关类型').then(function(response) {
				this.customsDeclaresTypeOptions = response.data.data;
				this.ruleForm.customsDeclaresType = this.customsDeclaresTypeOptions[0].value;
			}.bind(this));

			this.$axios.get('/afbase/awb/selectCategory?category=包装类型').then(function(response) {
				this.packageTypeOptions = response.data.data;
				this.ruleForm.planPieces = 0;
				this.ruleForm.packageType = this.packageTypeOptions[0].value;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=付款方式').then(function(response) {
				this.paymentMethodOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				this.msrCurrecnyCodeOptions = response.data.data;
				if (this.currencyCodeOptions && this.currencyCodeOptions[0]) {
					if ('CNY' != this.currencyCodeOptions[0].currency_code) {
						this.ruleForm.currencyCode = this.currencyCodeOptions[0].currency_code;
						this.ruleForm.msrCurrecnyCode = this.msrCurrecnyCodeOptions[0].currency_code;
					}

				}
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=货物海关代码').then(function(response) {
				this.codeOptions = response.data.data;
				this.ruleForm.customsStatusCode = this.codeOptions[0].value;
			}.bind(this));

			if (this.frow.orderId) {
				//新增复制
				this.$axios.get('/afbase/aforder/view/' + this.frow.orderId)
					.then(function(response) {
						this.ruleForm = response.data.data;
						if (this.ruleForm.switchAwbService == true) {
							this.activeOperationName = 'first'
						} else if (this.ruleForm.warehouseService == true) {
							this.activeOperationName = 'second'
						} else if (this.ruleForm.customsClearanceService == true) {
							this.activeOperationName = 'third'
						} else if (this.ruleForm.deliveryService == true) {
							this.activeOperationName = 'fourth'
						}
						this.ruleForm.orderId = '';
						this.ruleForm.orderCode = '';
						this.ruleForm.goodsType = '普货';
						this.ruleForm.cargoFlowType = '我司监管库';
						this.ruleForm.goodsNameCn = '';
						this.ruleForm.cargoFlowRemark = '';
						this.ruleForm.switchAwbService = false;
						this.ruleForm.warehouseService = false;
						this.ruleForm.customsClearanceService = false;
						this.ruleForm.deliveryService = false;
						this.setcheck1NULL();
						this.setcheck2NULL();
						this.setcheck3NULL();
						this.setcheck4NULL();
					}.bind(this));
			} else {
				//新增
				//查询签约公司默认配置信息
				this.$axios.get('/hrs/org/getOrgOrderConfig/AI').then((response) => {
					if (response.data.code == 0 && response.data.data) {
						this.ruleForm.goodsType = response.data.data.goodsType
						if (!this.ruleForm.goodsType) {
							this.ruleForm.goodsType = '普货'
						}
						this.ruleForm.cargoFlowType = response.data.data.cargoFlowType
						if (!this.ruleForm.cargoFlowType) {
							this.ruleForm.cargoFlowType = '我司监管库'
						}
					} else {
						this.ruleForm.goodsType = '普货'
						this.ruleForm.cargoFlowType = '我司监管库'
					}
				}).catch((error) => {
					this.ruleForm.goodsType = '普货'
					this.ruleForm.cargoFlowType = '我司监管库'
				})
			}

			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces")
				.then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.orderAiDigitsWeight != null) {
							this.orderAiDigitsWeight = response.data.data.orderAiDigitsWeight
						}
						if (response.data.data.orderAiDigitsVolume != null) {
							this.orderAiDigitsVolume = response.data.data.orderAiDigitsVolume
						}
						if (response.data.data.orderAiDigitsChargeWeight != null) {
							this.orderAiDigitsChargeWeight = response.data.data.orderAiDigitsChargeWeight
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
		padding: 0 15px;
	}

	.widthWithFive2 .el-input-group__prepend {
		padding: 0 16px;
	}

	.widthWithFive3 .el-input-group__prepend {
		padding: 0 13px;
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

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

  .widthWorkGroup .el-input-group__prepend {
    padding: 0 32px;
  }
</style>
