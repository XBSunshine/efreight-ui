<template>
	<el-dialog title="货物追踪" fullscreen width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :before-close="handleClose">
		<div class="orderTrack">
			<el-container>
				<el-aside>
					<el-row>
						<el-col>
              <el-form ref="ruleForm" :model="ruleForm" :rules="queryRules">
                <el-form-item>
                  <template>
                    <el-radio v-model="ruleForm.businessScope" label="AE" @change="changeBusinessScope">空运出口</el-radio>
                    <el-radio v-model="ruleForm.businessScope" label="AI" @change="changeBusinessScope">空运进口</el-radio>
                  </template>
                </el-form-item>
                <el-form-item prop="awbNumber">
                  <el-input v-model="ruleForm.awbNumber" auto-complete="off" clearable style="width:240px;" @blur="formatAwbNumber(ruleForm.awbNumber)" placeholder="请输入主运单号">
                    <template slot="prepend">主单号</template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="ruleForm.hawbNumber" auto-complete="off" :disabled="inputDisabled" clearable maxlength="20" style="width:240px;" placeholder="请输入分运单号">
                    <template slot="prepend">分单号</template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button :loading="buttonLoading" type="primary" size="mini" @click="cargoTrackQuery">查询</el-button>
                  <el-button :loading="buttonLoading" type="primary" size="mini" @click="cleanQuery">清空</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row v-if="orgAdditionalService" style="margin-bottom: 20px">
            <el-col :span="7">空运订阅量：</el-col>
            <el-col :span="17" v-html="orgAdditionalService"></el-col>
          </el-row>
          <el-row>
            <el-col>
              <font>我的历史订阅</font>
            </el-col>
          </el-row>
          <el-row>
            <el-row v-for="(item,index) in awbSubscriptionList" :key="index">
              <el-col class="elementWidth" style="margin-left: 20px;">
                <font style="color: rgb(64, 158, 255);cursor: pointer;" @click="historyQuery(item)">{{item.awbNumber}}{{item.hawbNumber
                  ? "_"+item.hawbNumber : ""}}</font>
              </el-col>
              <el-col style="margin-left: 10px;" class="elementWidth">
                <a href="javascript:void(0)" @click="deleteAwbSubscription(item.awbSubscriptionId)">x</a>
              </el-col>
						</el-row>
					</el-row>
				</el-aside>
				<el-main v-loading="loading">
					<template v-if="ifShow&&!awbNumberIfBindAFOrderFlag">
						<el-row style="font-size: 24px;font-weight: bold;color: #303133;text-align: center;">{{orderTrack.awbNumber}}</el-row>
						<el-collapse v-model="collapseActiveNames">
							<el-collapse-item title="轨迹信息" name="trackInfo">
								<el-card>
									<el-row>
										<el-col :span="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
                      <el-button type="text" @click="handlerMore" style="padding: unset;">外部网站</el-button>
                    </el-col>
									</el-row>
									<template v-if="this.orderTrack.routeTracks.length > 0">
										<el-row :gutter="1" v-for="routeTrack in this.orderTrack.routeTracks" :key="routeTrack.trackAwbId">
											<el-col :span="4" style="text-align: left">{{routeTrack.flightStatusName}} {{routeTrack.flightStatusCode}}</el-col>
											<el-col :span="4" style="text-align: left"> {{routeTrack.remark || '-'}} </el-col>
											<el-col :span="4" style="text-align: left">{{routeTrack.flightNum || '-'}}</el-col>
											<el-col :span="4" style="text-align: left;">{{routeTrack.eventTime || "- "}}</el-col>
											<el-col :span="4" style="text-align: left">{{formatCargoInfo(routeTrack)}}</el-col>
										</el-row>
									</template>
									<template v-else>
										当前订单没有可显示的轨迹信息
									</template>
								</el-card>
							</el-collapse-item>
							<el-collapse-item title="舱单信息" name="shippingBillInfo">
								<el-row>
									<el-col :span="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
										<el-button type="text" @click="handlerManifestMore" style="padding: unset; padding-right: 20px">MORE</el-button>
									</el-col>
								</el-row>
                <!-- AE舱单信息 -->
								<el-row :gutter="20" v-if="this.ruleForm.businessScope == 'AE'">
									<template v-for="manifest in this.manifestTracks">
                    <template v-if="manifest.masterFlag">
                      <el-col :span="8" style="margin: 5px 0px;">
                        <el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
                          <el-card shadow="never" body-style="padding: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :span="8" style="color: #c0c1be; text-align: left">主单预配</el-col>
                              <el-col :span="2" v-if="manifest.provisionTime"><i
                                class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :span="12" class="order-track-manifest-card-color">{{manifest.provisionTime}}
                              </el-col>
                            </el-row>
                          </el-card>
                        </el-card>
											</el-col>
											<el-col :span="8" style="margin: 5px 0px;">
												<el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
													<el-card shadow="never" body-style="padding: 10px">
														<el-row style="margin-bottom: 0px">
															<el-col :span="8" style="color: #c0c1be; text-align: left">主单运抵</el-col>
															<el-col :span="2" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
															<el-col :span="12" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
														</el-row>
													</el-card>
												</el-card>
											</el-col>
											<el-col :span="8" style="margin: 5px 0px;">
												<el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
                          <el-card shadow="never" body-style="padding: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :span="8" style="color: #c0c1be; text-align: left">主单放行</el-col>
                              <el-col :span="2" v-if="manifest.passedTime"><i
                                class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :span="12" class="order-track-manifest-card-color">{{manifest.passedTime}}
                              </el-col>
                            </el-row>
                          </el-card>
                        </el-card>
                      </el-col>
                    </template>
                    <el-col :span="8" style="margin:5px 0px" v-if="!manifest.masterFlag">
                      <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                               body-style="padding-bottom:0px">
                        <el-row style="margin-bottom: unset">
                          <el-col :span="24" class="order-track-text-left">分运单号：<span
                            class="el-cs-001">{{ manifest.hawbNumber }}</span></el-col>
                        </el-row>
                        <el-row style="margin-bottom: unset">
                          <el-col :span="24" class="order-track-text-left">报关单号：<span
                            class="el-cs-001">{{ manifest.declarationNumber }}</span></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" class="order-track-text-left">件重信息：<span
                            class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                        </el-row>
                        <el-row>
                          <el-card shadow="never" body-style="padding:10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :span="8" style="color: #c0c1be; text-align: left">分单预配</el-col>
                              <el-col :span="2" v-if="manifest.provisionTime"><i
                                class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :span="12" class="order-track-manifest-card-color">{{ manifest.provisionTime }}
                              </el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
															<el-col :span="8" style="color: #c0c1be; text-align: left">分单运抵</el-col>
															<el-col :span="2" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
															<el-col :span="12" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
														</el-row>
													</el-card>
													<el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :span="8" style="color: #c0c1be; text-align: left">分单放行</el-col>
                              <el-col :span="2" v-if="manifest.passedTime"><i
                                class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :span="12" class="order-track-manifest-card-color">{{manifest.passedTime}}
                              </el-col>
                            </el-row>
													</el-card>
												</el-row>
											</el-card>
										</el-col>
									</template>
								</el-row>
                <!-- AI舱单信息 -->
                <el-row :gutter="20" v-else>
                  <template v-for="manifest in this.manifestTracks">
                    <el-col :md="8" :sm="12" style="margin:5px 0px" v-if="manifest.masterFlag">
                      <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                               body-style="padding-bottom:0px">
                        <el-row style="margin-bottom: unset">
                          <el-col :md="24" class="order-track-text-left">主运单号：<span
                            class="el-cs-001">{{ manifest.orderNo }}</span></el-col>
                        </el-row>
                        <el-row>
                          <el-col :md="24" class="order-track-text-left">件重信息：<span
                            class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                        </el-row>
                        <el-row>
                          <el-card shadow="never" body-style="padding:10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left"
                                      class="order-track-custom-width1">主单原始
                              </el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.originalTime" class="order-track-custom-width2"><i
                                class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8"
                                      class="order-track-manifest-card-color order-track-custom-width3">
                                {{ manifest.originalTime }}
                              </el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">主单理货</el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.tallyTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.tallyTime}}</el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分拨申请</el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.applyTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.applyTime}}</el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分拨运抵</el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.arriveTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.arriveTime}}</el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">主单放行</el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.passedTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.passedTime}}</el-col>
                            </el-row>
                          </el-card>
                        </el-row>
                      </el-card>
                    </el-col>
                    <el-col :md="8" :sm="12" style="margin:5px 0px" v-else>
                      <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                               body-style="padding-bottom:0px">
                        <el-row style="margin-bottom: unset">
                          <el-col :md="24" class="order-track-text-left">分运单号：<span
                            class="el-cs-001">{{ manifest.orderNo }}</span></el-col>
                        </el-row>
                        <el-row>
                          <el-col :md="24" class="order-track-text-left">件重信息：<span
                            class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                        </el-row>
                        <el-row>
                          <el-card shadow="never" body-style="padding:10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left"
                                      class="order-track-custom-width1">分单原始
                              </el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.originalTime" class="order-track-custom-width2"><i
                                class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8"
                                      class="order-track-manifest-card-color order-track-custom-width3">
                                {{ manifest.originalTime }}
                              </el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分单理货</el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.tallyTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.tallyTime}}</el-col>
                            </el-row>
                          </el-card>
                          <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                            <el-row style="margin-bottom: 0px">
                              <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分单放行</el-col>
                              <el-col :md="2" :xs="6" v-if="manifest.passedTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                              <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.passedTime}}</el-col>
                            </el-row>
                          </el-card>
                        </el-row>
                      </el-card>
                    </el-col>
                  </template>
                </el-row>
                <el-row v-if="showListTrackManifest">
                  <el-card>
                    <template v-if="this.orderTrack.trackManifest.length > 0">
                      <el-row :gutter="1" v-for="manifest in orderTrack.trackManifest" :key="manifest.trackManifestId">
                        <el-col :span="4" style="text-align: left">{{manifest.eventTime || '-'}}</el-col>
                        <el-col :span="14" style="text-align: left"> {{manifest.remark || '-'}} </el-col>
                        <el-col :span="6" style="text-align: left"> {{ manifest.productInfo}} </el-col>
                      </el-row>
                    </template>
                    <template v-else>
                      当前订单没有可显示的舱单信息
                    </template>
                  </el-card>
                </el-row>
							</el-collapse-item>
						</el-collapse>
					</template>
					<template v-else-if="ifShow&&awbNumberIfBindAFOrderFlag">
						<el-row>
							<el-card>
								<el-row type="flex" justify="center">
									<el-col :span="7">
										<h6 class="font-style"> {{orderTrack.awbNumber || orderTrack.customerNumber}} </h6>
									</el-col>
								</el-row>
								<el-row type="flex" justify="center" style="margin-bottom: 0px">
									<el-col :span="7"> <i class="el-icon-myjinkou iconfont"></i> </el-col>
								</el-row>
								<el-row type="flex" justify="center">
									<el-col :span="2" class="font-style"> {{orderTrack.departureStation}} </el-col>
									<el-col :span="5">
										<el-divider></el-divider>
									</el-col>
									<el-col :span="2" class="font-style"> {{orderTrack.arrivalStation}} </el-col>
								</el-row>
								<el-row type="flex" justify="center" :gutter="1" style="height: 20px;">
									<el-col :span="2"> {{orderTrack.expectFlight}} </el-col>
									<el-col :span="2"> {{orderTrack.expectDeparture}} </el-col>
								</el-row>

								<vue-qr :text="clipboardText" :callback="qrCodeCallBack" :margin="5" :size="100" style="display: none"></vue-qr>
								<div style="text-align: center;float: right;margin-top: -130px;" id="order-qr-code-view">
								</div>
							</el-card>
						</el-row>
						<el-row>
							<el-collapse v-model="collapseActiveNames">
								<el-collapse-item title="订单信息" name="orderInfo" class='item-title'>
									<el-row :gutter="20">
										<el-col :span="12">
											<div style="padding: 0px 20px;">
												中文品名
											</div>
										</el-col>
										<el-col :span="12">
											<div style="padding: 0px 20px">
												英文品名
											</div>
										</el-col>
									</el-row>
									<el-row :gutter="20">
										<el-col :span="12">
											<el-card shadow="never">
												<div style="text-align: left;">
													{{orderTrack.goodsNameCn}}
												</div>
											</el-card>
										</el-col>
										<el-col :span="12">
											<el-card shadow="never">
												<div style="text-align: left">
													{{orderTrack.goodsNameEn}}
												</div>
											</el-card>
										</el-col>
									</el-row>

									<el-row :gutter="20">
										<el-col :span="12">
											<el-row class="order-track-border">
												<el-col :span="4" class="order-track-border-right">
													<div class="order-track-text-center">件数</div>
												</el-col>
												<el-col :span="10" class="order-track-border-right">
													<div class="order-track-text-center">
														<div v-if="this.checkPieces(orderTrack.planPieces, orderTrack.confirmPieces)" style="color:red">
															<span>{{this.getNumber0(orderTrack.planPieces)}}</span>
															<span> / </span>
															<span>{{this.getNumber0(orderTrack.confirmPieces)}}</span>
														</div>
														<div v-else>
															<span>{{this.getNumber0(orderTrack.planPieces)}}</span>
															<span>/</span>
															<span>{{this.getNumber0(orderTrack.confirmPieces)}}</span>
														</div>
													</div>
												</el-col>
												<el-col :span="10" class="order-track-text-center">
													<span>{{orderTrack.packageType ? orderTrack.packageType : "-" }}</span>
												</el-col>
											</el-row>
										</el-col>
										<el-col :span="12">
											<el-row class="order-track-border">
												<el-col :span="4" class="order-track-border-right">
													<div class="order-track-text-center">毛重</div>
												</el-col>
												<el-col :span="10" class="order-track-border-right">
													<div class="order-track-text-center">
														<div v-if="this.checkFlag(orderTrack.planWeight, orderTrack.confirmWeight)" style="color:red">
															<span>{{ this.getNumber1(orderTrack.planWeight)}}</span>
															<span> / </span>
															<span>{{ this.getNumber0(orderTrack.confirmWeight)}}</span>
														</div>
														<div v-else>
															<span>{{ this.getNumber1(orderTrack.planWeight)}}</span>
															<span> / </span>
															<span>{{ this.getNumber0(orderTrack.confirmWeight)}}</span>
														</div>
													</div>
												</el-col>
												<el-col :span="10" class="order-track-text-center">
													<span>KG</span>
												</el-col>
											</el-row>
										</el-col>
									</el-row>

									<el-row :gutter="20">
										<el-col :span="12">
											<el-row class="order-track-border">
												<el-col :span="4" class="order-track-border-right">
													<div class="order-track-text-center">体积</div>
												</el-col>
												<el-col :span="10" class="order-track-border-right">
													<div class="order-track-text-center">
														<div v-if="this.volumeFlag(orderTrack.planVolume, orderTrack.confirmVolume)" style="color:red">
															<span>{{ this.getNumber3(orderTrack.planVolume)}}</span>
															<span> / </span>
															<span>{{this.getNumber3(orderTrack.confirmVolume)}}</span>
														</div>
														<div v-else>
															<span>{{ this.getNumber3(orderTrack.planVolume)}}</span>
															<span> / </span>
															<span>{{this.getNumber3(orderTrack.confirmVolume)}}</span>
														</div>
													</div>
												</el-col>
												<el-col :span="10" class="order-track-text-center">
													<span>CBM</span>
												</el-col>
											</el-row>
										</el-col>
										<el-col :span="12">
											<el-row class="order-track-border">
												<el-col :span="4" class="order-track-border-right">
													<div class="order-track-text-center">计费重量</div>
												</el-col>
												<el-col :span="10" class="order-track-border-right">
													<div class="order-track-text-center">
														<div v-if="this.checkFlag(orderTrack.planChargeWeight, orderTrack.confirmChargeWeight)" style="color:red">
															<span>{{ this.getNumber3(orderTrack.planChargeWeight)}}</span>
															<span> / </span>
															<span>{{this.getNumber3(orderTrack.confirmChargeWeight)}}</span>
														</div>
														<div v-else>
															<span>{{ this.getNumber3(orderTrack.planChargeWeight)}}</span>
															<span> / </span>
															<span>{{this.getNumber3(orderTrack.confirmChargeWeight)}}</span>
														</div>
													</div>
												</el-col>
												<el-col :span="10" class="order-track-text-center">
													<span>KG</span>
												</el-col>
											</el-row>
										</el-col>
									</el-row>

								</el-collapse-item>
								<el-collapse-item title="轨迹信息" name="trackInfo">
									<el-card>
										<el-row>
                      <el-col :span="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
                        <el-button type="text" @click="handlerMore" style="padding: unset;">外部网站</el-button>
                      </el-col>
										</el-row>
										<template v-if="this.orderTrack.routeTracks.length > 0">
											<el-row :gutter="1" v-for="routeTrack in this.orderTrack.routeTracks" :key="routeTrack.trackAwbId">
												<el-col :span="4" style="text-align: left">{{routeTrack.flightStatusName}} {{routeTrack.flightStatusCode}}</el-col>
												<el-col :span="4" style="text-align: left"> {{routeTrack.remark || '-'}} </el-col>
												<el-col :span="4" style="text-align: left">{{routeTrack.flightNum || '-'}}</el-col>
												<el-col :span="4" style="text-align: left;">{{routeTrack.eventTime || "- "}}</el-col>
                        <el-col :span="4" style="text-align: left">{{formatCargoInfo(routeTrack)}}</el-col>
											</el-row>
										</template>
										<template v-else>
											当前订单没有可显示的轨迹信息
										</template>
									</el-card>
								</el-collapse-item>
								<el-collapse-item title="舱单信息" name="shippingBillInfo">
									<el-row>
										<el-col :span="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
											<el-button type="text" @click="handlerManifestMore" style="padding: unset; padding-right: 20px">MORE</el-button>
										</el-col>
									</el-row>
                  <!-- AE舱单信息 -->
									<el-row :gutter="20" v-if="this.ruleForm.businessScope == 'AE'">
                    <template v-for="manifest in this.manifestTracks">
                      <template v-if="manifest.masterFlag">
                        <el-col :span="8" style="margin: 5px 0px;">
                          <el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
                            <el-card shadow="never" body-style="padding: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :span="8" style="color: #c0c1be; text-align: left">主单预配</el-col>
                                <el-col :span="2" v-if="manifest.provisionTime"><i
                                  class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :span="12" class="order-track-manifest-card-color">{{manifest.provisionTime}}
                                </el-col>
                              </el-row>
                            </el-card>
                          </el-card>
												</el-col>
												<el-col :span="8" style="margin: 5px 0px;">
													<el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
														<el-card shadow="never" body-style="padding: 10px">
															<el-row style="margin-bottom: 0px">
																<el-col :span="8" style="color: #c0c1be; text-align: left">主单运抵</el-col>
																<el-col :span="2" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
																<el-col :span="12" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
															</el-row>
														</el-card>
													</el-card>
												</el-col>
												<el-col :span="8" style="margin: 5px 0px;">
													<el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
                            <el-card shadow="never" body-style="padding: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :span="8" style="color: #c0c1be; text-align: left">主单放行</el-col>
                                <el-col :span="2" v-if="manifest.passedTime"><i
                                  class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :span="12" class="order-track-manifest-card-color">{{manifest.passedTime}}
                                </el-col>
                              </el-row>
                            </el-card>
                          </el-card>
                        </el-col>
                      </template>
                      <el-col :span="8" style="margin:5px 0px" v-if="!manifest.masterFlag ">
                        <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                                 body-style="padding-bottom:0px">
                          <el-row style="margin-bottom: unset">
                            <el-col :span="24" class="order-track-text-left">分运单号：<span
                              class="el-cs-001">{{ manifest.hawbNumber }}</span></el-col>
                          </el-row>
                          <el-row style="margin-bottom: unset">
                            <el-col :span="24" class="order-track-text-left">报关单号：<span
                              class="el-cs-001">{{ manifest.declarationNumber }}</span></el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="24" class="order-track-text-left">件重信息：<span
                              class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                          </el-row>
                          <el-row>
                            <el-card shadow="never" body-style="padding:10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :span="8" style="color: #c0c1be; text-align: left">分单预配</el-col>
                                <el-col :span="2" v-if="manifest.provisionTime"><i
                                  class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :span="12" class="order-track-manifest-card-color">
                                  {{ manifest.provisionTime }}
                                </el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
																<el-col :span="8" style="color: #c0c1be; text-align: left">分单运抵</el-col>
																<el-col :span="2" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
																<el-col :span="12" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
															</el-row>
														</el-card>
														<el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :span="8" style="color: #c0c1be; text-align: left">分单放行</el-col>
                                <el-col :span="2" v-if="manifest.passedTime"><i
                                  class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :span="12" class="order-track-manifest-card-color">{{manifest.passedTime}}
                                </el-col>
                              </el-row>
														</el-card>
													</el-row>
												</el-card>
											</el-col>
										</template>
									</el-row>

                  <!-- AI舱单信息 -->
                  <el-row :gutter="20" v-else>
                    <template v-for="manifest in this.manifestTracks">
                      <el-col :md="8" :sm="12" style="margin:5px 0px" v-if="manifest.masterFlag">
                        <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                                 body-style="padding-bottom:0px">
                          <el-row style="margin-bottom: unset">
                            <el-col :md="24" class="order-track-text-left">主运单号：<span
                              class="el-cs-001">{{ manifest.orderNo }}</span></el-col>
                          </el-row>
                          <el-row>
                            <el-col :md="24" class="order-track-text-left">件重信息：<span
                              class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                          </el-row>
                          <el-row>
                            <el-card shadow="never" body-style="padding:10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left"
                                        class="order-track-custom-width1">主单原始
                                </el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.originalTime" class="order-track-custom-width2">
                                  <i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8"
                                        class="order-track-manifest-card-color order-track-custom-width3">
                                  {{ manifest.originalTime }}
                                </el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">主单理货</el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.tallyTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.tallyTime}}</el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分拨申请</el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.applyTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.applyTime}}</el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分拨运抵</el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.arriveTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.arriveTime}}</el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">主单放行</el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.passedTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.passedTime}}</el-col>
                              </el-row>
                            </el-card>
                          </el-row>
                        </el-card>
                      </el-col>
                      <el-col :md="8" :sm="12" style="margin:5px 0px" v-else>
                        <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                                 body-style="padding-bottom:0px">
                          <el-row style="margin-bottom: unset">
                            <el-col :md="24" class="order-track-text-left">分运单号：<span
                              class="el-cs-001">{{ manifest.orderNo }}</span></el-col>
                          </el-row>
                          <el-row>
                            <el-col :md="24" class="order-track-text-left">件重信息：<span
                              class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                          </el-row>
                          <el-row>
                            <el-card shadow="never" body-style="padding:10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left"
                                        class="order-track-custom-width1">分单原始
                                </el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.originalTime" class="order-track-custom-width2">
                                  <i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8"
                                        class="order-track-manifest-card-color order-track-custom-width3">
                                  {{ manifest.originalTime }}
                                </el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分单理货</el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.tallyTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.tallyTime}}</el-col>
                              </el-row>
                            </el-card>
                            <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                              <el-row style="margin-bottom: 0px">
                                <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left" class="order-track-custom-width1">分单放行</el-col>
                                <el-col :md="2" :xs="6" v-if="manifest.passedTime" class="order-track-custom-width2"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                                <el-col :md="12" :xs="8" class="order-track-manifest-card-color order-track-custom-width3">{{manifest.passedTime}}</el-col>
                              </el-row>
                            </el-card>
                          </el-row>
                        </el-card>
                      </el-col>
                    </template>
                  </el-row>
									<el-row v-if="showListTrackManifest">
                    <el-card>
                      <template v-if="this.orderTrack.trackManifest.length > 0">
                        <el-row :gutter="1" v-for="manifest in orderTrack.trackManifest" :key="manifest.trackManifestId">
                          <el-col :span="4" style="text-align: left">{{manifest.eventTime || '-'}}</el-col>
                          <el-col :span="14" style="text-align: left"> {{manifest.remark || '-'}} </el-col>
                          <el-col :span="6" style="text-align: left"> {{ manifest.productInfo}} </el-col>
                        </el-row>
                      </template>
                      <template v-else>
                        当前订单没有可显示的舱单信息
                      </template>
                    </el-card>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="相关文件" name="attachment">
									<el-row :gutter="10">
										<el-col v-for="attachment in this.attFiles" :key="attachment.orderFileId" :span="3">
											<el-tooltip placement="top">
												<div slot="content">文件名：{{attachment.fileName}}<br />备注信息：{{attachment.fileRemark}}</div>
												<el-card class="box-card">
													<a :href="attachment.fileUrl" @click.prevent="jumpToUrl(attachment)">
														<i class="el-icon-document"></i>
														<div class="file-name">{{ attachment.fileName }}</div>
													</a>
												</el-card>
											</el-tooltip>
										</el-col>
										<el-col :span="3" v-if="showDeliveryNoticeForWarehouse">
											<el-card class="box-card">
												<a href="javascript:void(0)" @click.prevent="callDeliveryNotice('warehouse')">
													<i class="el-icon-document"></i>
													<div class="file-name">送货通知-交货货站</div>
												</a>
											</el-card>
										</el-col>
										<el-col :span="3" v-if="showDeliveryNoticeForStorehouse">
											<el-card class="box-card">
												<a href="javascript:void(0)" @click.prevent="callDeliveryNotice('storehouse')">
													<i class="el-icon-document"></i>
													<div class="file-name">送货通知-普货库房</div>
												</a>
											</el-card>
										</el-col>
										<el-col :span="3" v-if="showAwbPrint">
											<el-tooltip placement="top">
												<div slot="content">主单：{{frow.awbNumber}}</div>
												<el-card class="box-card">
													<a href="javascript:void(0)" @click.prevent="callAwbPrint">
														<i class="el-icon-document"></i>
														<div class="file-name">主单：{{frow.awbNumber}}</div>
													</a>
												</el-card>
											</el-tooltip>
										</el-col>
										<template v-if="showHawbPrint">
											<el-col v-for="(hawbPrint,index) in this.hawbPrintList" :key="index" :span="3">
												<el-tooltip placement="top">
													<div slot="content">分单：{{ hawbPrint.hawbNumber }}</div>
													<el-card class="box-card">
														<a href="javascript:void(0)" @click.prevent="callHawbPrint(hawbPrint)">
															<i class="el-icon-document"></i>
															<div class="file-name">分单：{{ hawbPrint.hawbNumber }}</div>
														</a>
													</el-card>
												</el-tooltip>
											</el-col>
										</template>
                    <template v-if="this.ruleForm.businessScope == 'AE'">
                      <el-col :span="3" v-show="this.orderTrack.awbNumber">
                        <el-card class="box-card">
                          <a href="javascript:void(0)" @click.prevent="callAwbSubmit">
                            <i class="el-icon-document"></i>
                            <div class="file-name">运单确认件</div>
                          </a>
                        </el-card>
                      </el-col>
                    </template>
                    <template v-else>
                      <el-card v-if="this.attFiles.length == 0">
                        <div>当前订单没有可显示的相关文件</div>
                      </el-card>
                    </template>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="相关图片" name="images">
									<el-row>
										<el-card class="box-card" v-if="this.attImages.length > 0  " id="att_images">
											<div>
												<el-carousel indicator-position="outside" :autoplay="false">
													<el-carousel-item v-for="item in this.attImages" :key="item.orderFiled">
														<el-image :src="item.fileUrl" @click="viewImage(item.fileUrl)" fit="contain"></el-image>
													</el-carousel-item>
												</el-carousel>
											</div>
										</el-card>
										<el-card v-else>
											<div> 当前订单没有可显示的图片 </div>
										</el-card>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</el-row>
						<el-row type="flex" :gutter="20">
							<el-col :span="24" style="text-align: center">
								<a href="http://www.efreight.cn/" target="_blank">
									<el-image :src="qr001" style="width: 140px;"></el-image>
								</a>
							</el-col>
						</el-row>
					</template>
					<template v-else>
						<el-row style="font-size: 24px;font-weight: bold;color: #303133;text-align: center;"></el-row>
						<el-collapse v-model="collapseActiveNames">
							<el-collapse-item title="轨迹信息" name="trackInfo">
								<el-card>
									<el-row>
                    <el-col :span="24" style="text-align: right">
                      <el-button type="text" @click="handlerMore" style="padding: unset;">外部网站</el-button>
                    </el-col>
									</el-row>
									当前订单没有可显示的轨迹信息
								</el-card>
							</el-collapse-item>
							<el-collapse-item title="舱单信息" name="shippingBillInfo">
								<el-row>
									<el-card>
										当前订单没有可显示的舱单信息
									</el-card>
								</el-row>
							</el-collapse-item>
						</el-collapse>
					</template>
				</el-main>
			</el-container>
		</div>
	</el-dialog>
</template>
<script>
	import {
		orderDisplayRule
	} from "../../../common/order/orderDisplayRule"
	import qr001 from "@/assets/images/qr001.png"
	export default {
		props: {
			visible: {
				type: Boolean,
				default: true
			}
		},
		data() {
		  const validateAwbNumber = (rule, value, callback) => {
        if ((value || "").trim().length == 0) {
          callback(new Error("请输入主运单号"));
          return
        }

        let awbNumber = this.ruleForm.awbNumber.replace(/[ ]/g, '').replace(/-/g, '')
        let regx = /^[0-9]{11}$/
        if (!regx.test(awbNumber)) {
          callback(new Error("运单号格式有误"));
          return;
        }

        awbNumber = this.formatAwbNumber(awbNumber);
        //验证规则
        let subNumber = awbNumber.split('-')[1];
        if (parseInt(subNumber.substring(0, 7)) % 7 != parseInt(subNumber.charAt(7))) {
          callback(new Error("主单号格式错误。"));
          return;
        }

        this.ruleForm.awbNumber = awbNumber;
        callback();
      };

			return {
				frow: Object,
				loading: false,
				buttonLoading: false,
				collapseActiveNames: ['trackInfo', 'shippingBillInfo'],
				ruleForm: {
					awbNumber: '',
          businessScope: 'AE',
          hawbNumber: '',
				},
				manifestTracks: [],
				awbSubscriptionList: [],
				showListTrackManifest: false,
				ifShow: false,
				awbNumberIfBindAFOrderFlag: false,
				orderTrack: {
					orderId: "",
          orderCode: '',
					orderUUID: '',
					awbNumber: '',
					expectFlight: '',
					expectDeparture: '',
					departureStation: '',
					arrivalStation: '',
					goodsNameCn: "",
					goodsNameEn: "",
					planPieces: '',
					confirmPieces: '',
					packageType: '',
					planWeight: '',
					confirmWeight: '',
					weightUnit: 'KG',
					planVolume: '',
					confirmVolume: '',
					volumeUnknown: 'CMB',
					planChargeWeight: '',
					confirmChargeWeight: '',
					chargeWeightUnit: 'KG',
					attachments: [], //附近信息
					routeTracks: [], //轨迹信息
					trackManifest: [], //舱单信息
				},
				attImages: [], //附件图片
				attFiles: [], //附件文件
				imagePreviewList: [], //预览图片
				qr001: qr001,
				hawbPrintList: [],
				showAwbPrint: false,
				showHawbPrint: false,
				showDeliveryNoticeForWarehouse: false,
				showDeliveryNoticeForStorehouse: false,
        //侧面二维码
        clipboardText: '',
        message: null,
        queryRules: {
          awbNumber: {
            validator: validateAwbNumber,
            trigger: ['blur']
          },
        },
        inputDisabled: true,
        orgAdditionalService: '',
        isFirstSubscribe: false,
      }
		},
		methods: {
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      jumpToUrl(item) {
        let fileUrl = item['fileUrl'] || "";
        if (fileUrl) {
          window.open(fileUrl);
        } else {
          this.openError("未获取到附件地址");
        }
      },
      openSuccess(info) {
        this.$notify({
          title: '',
          message: info,
          type: 'success',
          position: 'bottom-right'
        });
      },
      openError(info) {
        this.$notify({
          title: '',
          message: info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      viewImage(src) {
        if (src) {
          window.open(src);
        }
      },
      getNumber0(data) {
        return data ? data.toFixed(0).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '-';
      },
      getNumber1(data) {
        return data ? data.toFixed(1).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '-';
      },
      getNumber3(data) {
        return data ? data.toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '-';
      },
      checkPieces(plan, confirm) {
        return orderDisplayRule.checkPieces(plan, confirm);
      },
      checkFlag(plan, confirm) {
        return orderDisplayRule.checkFlag(plan, confirm);
      },
      volumeFlag(plan, confirm) {
        return orderDisplayRule.volumeFlag(plan, confirm);
      },
      handlerMore() {
        let awbNumber = this.orderTrack.awbNumber.split("_")[0];
        let url = ''
        if (awbNumber) {
          url = 'http://www.mawb.cn/zh-cn/AirCargoTrack/?mawbno=' + awbNumber;
        } else {
          url = 'http://www.mawb.cn/zh-cn/AirCargoTrack'
        }
        window.open(url);
      },
      handlerManifestMore() {
        this.showListTrackManifest = !this.showListTrackManifest;
      },
      resolveWaybillNumber(info) {
        let match = (info || "").match(/^报关单号：(\d+)/g);
        return (match && match.length >= 1) ? match[0].replace("报关单号：", "") : "";
      },
      callAwbSubmit() {
        this.$axios.post('/afbase/aforder/awbSubmit/' + this.orderTrack.orderUUID)
          .then(function (response) {
            window.open(response.data.data)
          }.bind(this)).catch(function (error) {
          let errorinfo = error.response.data.messageInfo;
          this.openError(errorinfo)
        }.bind(this));
      },
      qrCodeCallBack(imgDataBase64) {
        let text = "";
        switch (this.ruleForm.businessScope) {
          case "AE":
            text = (this.ruleForm.awbNumber || this.orderTrack.orderCode);
            break;
          case "AI":
            text = this.ruleForm.awbNumber + (this.ruleForm.hawbNumber ? " / " + this.ruleForm.hawbNumber : '');
            break;
          default:
            text = this.ruleForm.awbNumber;
            break;
        }
        this.drawBorderQR(text, 120, 140, imgDataBase64);
      },
      drawBorderQR(text, width, height, imgDataBase64) {
        let canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        //背景色
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //边框
        ctx.strokeStyle = "#409eff";
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        //添加图片
        let img = new Image();
        img.src = imgDataBase64;
        img.onload = () => {
          ctx.drawImage(img, 10, 10);
          //添加文字
          let fontSize = text.length > 12 ? '12px' : '14px';
          ctx.font = fontSize + ' Microsoft YaHei';
          ctx.textAlign = "center";
          ctx.fillStyle = "#000000";
          ctx.fillText(text, canvas.width / 2, 130);

          let htmlImg = document.createElement("img");
          htmlImg.id = "order-qr-img";
          htmlImg.src = canvas.toDataURL();
          document.getElementById("order-qr-code-view").innerHTML = ""
          document.getElementById("order-qr-code-view").appendChild(htmlImg)
        }
      },
      findList() {
        this.$axios.get('/afbase/awbSubscription/' + this.ruleForm.businessScope).then((response) => {
          if (response.data.code == 0) {
            let tmp = response.data.data;
            this.awbSubscriptionList = tmp;
          } else {
            this.openError(response.data.messageInfo);
          }
        }).catch((error) => {
          console.error(error);
          this.openError(error.response.data.messageInfo)
        })
      },
      deleteAwbSubscription(id) {
        this.$axios.deletes('/afbase/awbSubscription/' + id).then((response) => {
          if (response.data.code == 0) {
            this.openSuccess("删除成功")
            this.findList()
          } else {
            this.openError(response.data.messageInfo);
          }
        }).catch((error) => {
          console.error(error);
          this.openError(error.response.data.messageInfo)
        })
      },
      callAwbPrint() {
        this.$axios.post2('/afbase/awbPrint/downloadAWB', {
          awbPrintType: 'PRINT_MAWB',
          orderUuid: this.frow.orderUuid,
          printType: '2'
        })
          .then(function (response) {
            window.open(response.data.data)
          }.bind(this)).catch(function (error) {
          let errorinfo = error.response.data.messageInfo;
          this.openError(errorinfo)
        }.bind(this))
      },
      callHawbPrint(row) {
        let awbPrintType = '';
        if (this.frow.businessScope == 'AI') {
          awbPrintType = 'PRINT_HAWB_AI'
        } else {
          awbPrintType = 'PRINT_HAWB'
        }
        this.$axios.post2('/afbase/awbPrint/downloadHAWB', {
          awbPrintType: 'PRINT_HAWB',
          orderUuid: this.frow.orderUuid,
          awbPrintId: row.awbPrintId,
          printType: '2'
        })
          .then(function (response) {
            window.open(response.data.data)
          }.bind(this)).catch(function (error) {
          let errorinfo = error.response.data.messageInfo;
          this.openError(errorinfo)
        }.bind(this))
      },
      callDeliveryNotice(flag) {
        let url = location.origin + "/#/externalOrderDeliveryNotice?o=af" + (this.frow['orderUuid'] || "") + "&flag=" + flag
        window.open(url)
      },
      init() {
        //判断送货通知是否可见
        this.$axios.get("/afbase/aforder/checkOrderDeliveryNotice/" + this.frow['orderUuid'] + "/warehouse").then((response) => {
          if (response.data.code == 0 && this.frow.outfieldService) {
            this.showDeliveryNoticeForWarehouse = true
          }
        })
        this.$axios.get("/afbase/aforder/checkOrderDeliveryNotice/" + this.frow['orderUuid'] + "/storehouse").then((response) => {
          if (response.data.code == 0 && this.frow.warehouseService) {
            this.showDeliveryNoticeForStorehouse = true
          }
        })
        //判断主单打印是否可见
        this.$axios.get('/afbase/awbPrint/viewByOrderUuid/' + this.frow.orderUuid).then((response) => {
          if (response.data.code == 0 && response.data.data) {
            this.showAwbPrint = true
          }
        })
        //判断分单打印是否可件
        this.$axios.get('/afbase/awbPrint/hawbListByOrderUuid/' + this.frow.orderUuid).then((response) => {
          if (response.data.code == 0 && response.data.data) {
            this.hawbPrintList = response.data.data
            this.showHawbPrint = true
          }
        })
      },
      cleanQuery() {
        this.ruleForm.awbNumber = '';
        this.ruleForm.hawbNumber = '';
      },
      queryTrack() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$axios.get2("/afbase/aforder/cargoTracking/", this.ruleForm)
              .then(function (response) {
                this.loading = false;
                this.message.close()
                if (0 == response.data.code) {
                  this.orderTrack = response.data.data;

                  let hawbNumber = (this.orderTrack.hawbNumber || '');
                  this.orderTrack.awbNumber = hawbNumber.length > 0 ? this.orderTrack.awbNumber + "_" + hawbNumber : this.orderTrack.awbNumber;

                  this.collapseActiveNames = [];
                  this.ifShow = true;
                  if (this.orderTrack.orderId) {
                    this.collapseActiveNames.push("orderInfo");
                    this.awbNumberIfBindAFOrderFlag = true;
                    this.clipboardText =  location.origin + "/#/externalOrderTrack?o=" + this.ruleForm.businessScope == 'AE' ? 'af': 'ai' + this.orderTrack.orderUUID;
                  } else {
                    this.awbNumberIfBindAFOrderFlag = false;
                  }
                  this.cleanData();
                  let attachments = (this.orderTrack.attachments || []);
                  for (let i = 0; i < attachments.length; i++) {
                    let item = attachments[i],
                      fileType = item['fileType'];
                    if ("照片" == fileType) {
                      this.attImages.push(item);
                    } else if ("文件" == fileType) {
                      this.attFiles.push(item);
                    }
                  }

                  if (this.orderTrack.hawbNumber && this.orderTrack.awbNumber) {
                    this.orderTrack.number = this.orderTrack.awbNumber + "_" + this.orderTrack.hawbNumber;
                  } else {
                    this.orderTrack.number = this.orderTrack.awbNumber || this.orderTrack.hawbNumber;
                  }

                  if (this.orderTrack.routeTracks.length > 0) {
                    this.collapseActiveNames.push("trackInfo");
                  }
                  if (this.orderTrack.awbNumber && this.attFiles.length > 0) {
                    this.collapseActiveNames.push("attachment");
                  }
                  if (this.attImages.length > 0) {
                    this.collapseActiveNames.push("images");
                  }
                  if (this.orderTrack.trackManifest.length > 0) {
                    this.collapseActiveNames.push("shippingBillInfo");
                  }
                  this.manifestTracks = this.orderTrack.manifestList;
                  if (this.manifestTracks.length == 0) {
                    this.showListTrackManifest = true
                  }
                  this.buildProductInfo();
                } else {
                  this.openError(response.data.messageInfo || "数据获取失败");
                }
              }.bind(this));
          }
        });
      },
      cleanData() {
        this.attFiles = [];
        this.attImages = [];
      },
      changeBusinessScope(value) {
        if ("AE" == value) {
          this.inputDisabled = true;
        } else if ("AI" == value) {
          this.inputDisabled = false;
        }
        this.ruleForm.hawbNumber = "";
        this.ruleForm.awbNumber = "";
        this.findList();
      },
      cargoTrackQuery(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.query();
          }
        });
      },
      /**
       * 查询数据+订阅数据
       */
      query() {
          this.$axios.get("/afbase/aforder/checkCargoTrackingQuery/" + this.ruleForm.awbNumber)
            .then(function(response){
              if(response.data.code == 0){
                let data = response.data.data;
                let msg1 = "您查询的运单号是首次查询，系统已订阅该运单的货物轨迹，请稍后再尝试查询。",
                  msg2 = "您录入的运单号所属航司暂不支持轨迹追踪。",
                msg = '';
                if(data['awbRoute'] == 0 && data['carrierTracklist'] == 0){
                  msg = msg2;
                }else if(data["awbRoute"] == 0){
                  msg = msg1;
                }else if(data['carrierTracklist'] == 0){
                  msg = msg2;
                }else{
                  msg = '';
                }
                if(msg){
                  this.showMessage(msg);
                }
              }
            }.bind(this))
          .then(function(){
              try{
                this.$axios.post2('/afbase/awbSubscription/cargoTrackingSubscribe', this.ruleForm)
                  .then(function(response){
                    if(response.data.code == 0) {
                      this.isFirstSubscribe = response.data.data;
                      this.findList();
                      this.queryTrack();
                      this.loadOrgAdditionService();
                    }else {
                      if(response.data.messageInfo.indexOf("空运订阅量") > 0){
                        this.confirmContacts(response.data.messageInfo);
                      }else{
                        this.openError(response.data.messageInfo);
                      }
                    }
                  }.bind(this));
              } catch (e) {
                console.warn("数据订阅失败");
              }
          }.bind(this));
      },
      confirmContacts(message){
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        }).then(function () {
          if (this.message) {
            this.message.close()
          }
          this.$router.push("/contactUs");
        }.bind(this))
      },
      /**
       * 历史查询
       * @param data
       */
      historyQuery(data) {
        let scope = data['businessScope'];
        this.changeBusinessScope(scope);
        this.ruleForm.awbNumber = data['awbNumber'];
        this.ruleForm.hawbNumber = data['hawbNumber'];
        this.ruleForm.businessScope = scope;
        this.queryTrack();
      },
      formatAwbNumber(value){
        let tmp = (value || "");
        if(tmp.length == 0 || tmp.indexOf("-") > 0){
          return tmp;
        }
       return tmp.substring(0, 3) + "-" + tmp.substring(3, tmp.length);
      },
      formatCargoInfo(row){
        let str = "";
        if(row.quantity && row.grossWeight){
          str = row.quantity + " Pcs / "+ row.grossWeight + " Kg";
        }else if(row.quantity){
          str = row.quantity + " Pcs";
        }else{
          str = row.grossWeight + " Kg";
        }
        return str;
      },
      showMessage(message, offset){
        if(!message){
          return;
        }
        this.$message({
          message: message,
          type: 'error',
          center: true,
          offset: (offset || 30),
          customClass: 'messageClass'
        })

      },
      buildProductInfo(){
        this.orderTrack.trackManifest.forEach((item) => {
          let quantity = item['quantity'] || "",
            grossWeight = item['grossWeight'] || "";
          if (quantity.length > 0) {
            quantity += " Pcs";
          }
          if (grossWeight.length > 0) {
            grossWeight += " Kg";
          }

          let productInfo = "";
          if (quantity.length > 0 && grossWeight.length > 0) {
            productInfo = (quantity + " / " + grossWeight);
          } else {
            productInfo = quantity.length > 0 ? quantity : grossWeight;
          }
          item['productInfo'] = productInfo;
        });
      },
      /**
       * 加载企业附加服务信息
       */
      loadOrgAdditionService() {
        let orgId = window.localStorage.getItem("orgId");
        this.$axios.get("/hrs/orgServiceMealConfig/remaining/" + orgId + "/TRACK_AE_AI").then(function (response) {
          if (response.data.code == 0 && response.data.data) {
            let item = response.data.data;
            let dic = {"MONTH": '月'};
            let used = item['serviceNumberUsed'], total = item['serviceNumberMax']
            if (used >= total) {
              used = '<span style="color: red">' + total + '</span>'
            }
            this.orgAdditionalService = used + " / " + total + " (" + dic[item['serviceCycle']] + ")";
          }
        }.bind(this)).catch(function (error) {
          console.error(error);
        })
      },
    },
    created() {
      this.findList();
      this.loadOrgAdditionService();
      this.$nextTick(() => {
        this.message = this.$message({
          message: '请输入主运单号，或点击左侧历史订阅查询追踪信息',
          type: 'success',
          center: true,
          duration: 0,
          offset: 30,
          customClass: 'messageClass'
        })
      });
		}
	}
</script>
<style>
	.messageClass {
		margin-left: 100px;
	}

	.orderTrack .el-row {
		margin-bottom: 10px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.orderTrack .font-style {
		font-size: 24px;
		font-weight: bold;
	}

	.orderTrack .el-collapse-item__header {
		background-color: #66b1ff;
		border-radius: 5px;
		padding-left: 10px;
	}

	.orderTrack #att_images .el-image__inner {
		height: 300px;
	}

	.orderTrack .el-collapse-item__header {
		height: 30px;
		color: #fff
	}

	.orderTrack .el-collapse-item {
		margin-bottom: 10px;
	}

	.orderTrack .el-collapse-item__content {
		padding-left: 10px;
		padding-top: 10px;
	}

	.orderTrack .el-collapse {
		border-bottom: unset;
	}

	.orderTrack .el-card__body {
		text-align: center;
	}

	.orderTrack .el-divider--horizontal {
		margin: 12px 0;
	}

	.orderTrack .el-icon-myjinkou {
		color: #409EFF;
		font-weight: bold;
	}

	.orderTrack .el-icon-document {
		font-size: 64px;
		color: #409EFF;
	}

	.orderTrack .file-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.orderTrack .order-track-text-right {
		text-align: right;
	}

	.orderTrack .order-track-text-left {
		text-align: left;
	}

	.orderTrack .order-track-text-center {
		text-align: center;
	}

	.orderTrack .order-track-border {
		border: 1px solid #EBEEF5;
		margin-bottom: unset;
	}

	.orderTrack .order-track-border-right {
		border-right: 1px solid #EBEEF5
	}

	.orderTrack .tab-more-btn {
		position: absolute;
		top: 0px;
		left: 45%;
	}

	.orderTrack .el-collapse-item__content {
		padding-bottom: 4px;
	}

	.orderTrack .order-track-manifest-card {
		background-color: #EBEEF5;
	}

	.orderTrack .order-track-manifest-card-color {
		color: #66b1ff;
	}
  .orderTrack .el-input__icon {
    line-height: 30px !important;
  }

  .orderTrack .order-track-custom-width1 {
    width: 24%;
  }

  .orderTrack .order-track-custom-width2 {
    width: 20%;
  }

  .orderTrack .order-track-custom-width3 {
    width: 56%;
  }

  .orderTrack .el-cs-001 {
    font-size: 16px;
    font-weight: bold;
  }
</style>
