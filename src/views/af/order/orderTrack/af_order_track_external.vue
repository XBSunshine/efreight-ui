<template>
	<div class="orderTrackExternal" style="position: relative;top: 0px;">
		<el-row>
			<el-card>
				<el-row type="flex" justify="center">
					<el-col :sm="7" :xs="24">
						<h6 class="font-style"> {{orderTrack.awbNumber || orderTrack.customerNumber}} </h6>
					</el-col>
				</el-row>
				<el-row type="flex" justify="center" style="margin-bottom: 0px">
					<el-col :sm="7" :xs="7"> <i class="el-icon-myjinkou iconfont"></i> </el-col>
				</el-row>
				<el-row type="flex" justify="center">
					<el-col :sm="2" :xs="4" class="font-style"> {{orderTrack.departureStation}} </el-col>
					<el-col :sm="5" :xs="10">
						<el-divider></el-divider>
					</el-col>
					<el-col :sm="2" :xs="4" class="font-style"> {{orderTrack.arrivalStation}} </el-col>
				</el-row>
				<el-row type="flex" justify="center" :gutter="1">
					<el-col :sm="2" :xs="4"> {{orderTrack.expectFlight}} </el-col>
					<el-col :sm="2" :xs="4"> {{orderTrack.expectDeparture}} </el-col>
				</el-row>
				<el-row type="flex" justify="center">
					<el-col :sm="7" :xs="24">
						<div style="text-align: center" id="order-qr-code-view">
							<vue-qr :text="clipboardText" :callback="qrCodeCallBack" :margin="5" :size="100" style="display: none"></vue-qr>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</el-row>
		<el-row>
			<el-collapse v-model="collapseActiveNames">
				<el-collapse-item title="订单信息" name="orderInfo" class='item-title'>
					<!-- 大设备 -->
					<div class="hidden-sm-and-down">
						<el-row :gutter="20">
							<el-col :sm="12" :xs="12">
								<div style="padding: 0px 20px;">
									中文品名
								</div>
							</el-col>
							<el-col :sm="12" :xs="12">
								<div style="padding: 0px 20px">
									英文品名
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :sm="12" :xs="12">
								<el-card shadow="never">
									<div style="text-align: left;">
										{{orderTrack.goodsNameCn}}
									</div>
								</el-card>
							</el-col>
							<el-col :sm="12" :xs="12">
								<el-card shadow="never">
									<div style="text-align: left">
										{{orderTrack.goodsNameEn}}
									</div>
								</el-card>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :sm="12" :xs="24">
								<el-row class="order-track-border" style="margin-bottom: unset">
									<el-col :sm="4" :xs="5" class="order-track-border-right">
										<div class="order-track-text-center">件数</div>
									</el-col>
									<el-col :sm="10" :xs="12" class="order-track-border-right">
										<div class="order-track-text-center">
											<el-row :gutter="1" v-if="this.checkPieces(orderTrack.planPieces, orderTrack.confirmPieces)" style="color:red; margin-bottom: unset">
												<el-col :sm="11" :xs="11" class="order-track-text-right">{{this.getNumber0(orderTrack.planPieces)}}</el-col>
												<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
												<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber0(orderTrack.confirmPieces)}}</el-col>
											</el-row>
											<el-row :gutter="1" v-else style="margin-bottom: unset">
												<el-col :sm="11" :xs="11" class="order-track-text-right">{{this.getNumber0(orderTrack.planPieces)}}</el-col>
												<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
												<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber0(orderTrack.confirmPieces)}}</el-col>
											</el-row>
										</div>
									</el-col>
									<el-col :sm="10" :xs="7" class="order-track-text-center" style="white-space: nowrap">
										<span>{{orderTrack.packageType ? orderTrack.packageType : "-" }}</span>
									</el-col>
								</el-row>
							</el-col>
							<el-col :sm="12" :xs="24">
								<el-row class="order-track-border" style="margin-bottom: unset">
									<el-col :sm="4" :xs="5" class="order-track-border-right">
										<div class="order-track-text-center">毛重</div>
									</el-col>
									<el-col :sm="10" :xs="12" class="order-track-border-right">
										<el-row :gutter="1" v-if="this.checkFlag(orderTrack.planWeight, orderTrack.confirmWeight)" style="color:red; margin-bottom: unset">
											<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber1(orderTrack.planWeight)}}</el-col>
											<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
											<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber1(orderTrack.confirmWeight)}}</el-col>
										</el-row>
										<el-row :gutter="1" v-else style="margin-bottom: unset">
											<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber1(orderTrack.planWeight)}}</el-col>
											<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
											<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber1(orderTrack.confirmWeight)}}</el-col>
										</el-row>
									</el-col>
									<el-col :sm="10" :xs="7" class="order-track-text-center">
										<span>KG</span>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :sm="12" :xs="24">
								<el-row class="order-track-border" style="margin-bottom: unset">
									<el-col :sm="4" :xs="5" class="order-track-border-right">
										<div class="order-track-text-center">体积</div>
									</el-col>
									<el-col :sm="10" :xs="12" class="order-track-border-right">
										<el-row :gutter="1" v-if="this.volumeFlag(orderTrack.planVolume, orderTrack.confirmVolume)" style="color:red; margin-bottom: unset">
											<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planVolume)}}</el-col>
											<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
											<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmVolume)}}</el-col>
										</el-row>
										<el-row :gutter="1" v-else style="margin-bottom: unset">
											<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planVolume)}}</el-col>
											<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
											<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmVolume)}}</el-col>
										</el-row>
									</el-col>
									<el-col :sm="10" :xs="7" class="order-track-text-center">
										<span>CBM</span>
									</el-col>
								</el-row>
							</el-col>
							<el-col :sm="12" :xs="24">
								<el-row class="order-track-border" style="margin-bottom: unset">
									<el-col :sm="4" :xs="5" class="order-track-border-right">
										<div class="order-track-text-center">计费重量</div>
									</el-col>
									<el-col :sm="10" :xs="12" class="order-track-border-right">
										<el-row :gutter="1" v-if="this.checkFlag(orderTrack.planChargeWeight, orderTrack.confirmChargeWeight)" style="color:red; margin-bottom: unset">
											<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planChargeWeight)}}</el-col>
											<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
											<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmChargeWeight)}}</el-col>
										</el-row>
										<el-row :gutter="1" v-else style="margin-bottom: unset">
											<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planChargeWeight)}}</el-col>
											<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
											<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmChargeWeight)}}</el-col>
										</el-row>
									</el-col>
									<el-col :sm="10" :xs="7" class="order-track-text-center">
										<span>KG</span>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>

					<!-- 小设备 -->
					<div class="hidden-md-and-up">
						<el-row>
							<el-col :xs="24">
								<div style="padding: 0px 20px;">
									中文品名
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :xs="24">
								<el-card shadow="never">
									<div style="text-align: left;">
										{{orderTrack.goodsNameCn}}
									</div>
								</el-card>
							</el-col>
						</el-row>
						<el-row>
							<el-col :xs="24">
								<div style="padding: 0px 20px">
									英文品名
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :xs="24">
								<el-card shadow="never">
									<div style="text-align: left">
										{{orderTrack.goodsNameEn}}
									</div>
								</el-card>
							</el-col>
						</el-row>
						<!-- 件数 -->
						<el-row class="order-track-border">
							<el-col :sm="4" :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">件数</div>
							</el-col>
							<el-col :sm="10" :xs="12" class="order-track-border-right">
								<div class="order-track-text-center">
									<el-row :gutter="1" v-if="this.checkPieces(orderTrack.planPieces, orderTrack.confirmPieces)" style="color:red; margin-bottom: unset">
										<el-col :sm="11" :xs="11" class="order-track-text-right">{{this.getNumber0(orderTrack.planPieces)}}</el-col>
										<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
										<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber0(orderTrack.confirmPieces)}}</el-col>
									</el-row>
									<el-row :gutter="1" v-else style="margin-bottom: unset">
										<el-col :sm="11" :xs="11" class="order-track-text-right">{{this.getNumber0(orderTrack.planPieces)}}</el-col>
										<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
										<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber0(orderTrack.confirmPieces)}}</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :sm="10" :xs="7" class="order-track-text-center" style="white-space: nowrap">
								<span>{{orderTrack.packageType ? orderTrack.packageType : "-" }}</span>
							</el-col>
						</el-row>

						<!-- 毛重 -->
						<el-row class="order-track-border">
							<el-col :sm="4" :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">毛重</div>
							</el-col>
							<el-col :sm="10" :xs="12" class="order-track-border-right">
								<el-row :gutter="1" v-if="this.checkFlag(orderTrack.planWeight, orderTrack.confirmWeight)" style="color:red; margin-bottom: unset">
									<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber1(orderTrack.planWeight)}}</el-col>
									<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
									<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber1(orderTrack.confirmWeight)}}</el-col>
								</el-row>
								<el-row :gutter="1" v-else style="margin-bottom: unset">
									<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber1(orderTrack.planWeight)}}</el-col>
									<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
									<el-col :sm="11" :xs="11" class="order-track-text-left">{{this.getNumber1(orderTrack.confirmWeight)}}</el-col>
								</el-row>
							</el-col>
							<el-col :sm="10" :xs="7" class="order-track-text-center">
								<span>KG</span>
							</el-col>
						</el-row>

						<!-- 体积 -->
						<el-row class="order-track-border">
							<el-col :sm="4" :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">体积</div>
							</el-col>
							<el-col :sm="10" :xs="12" class="order-track-border-right">
								<el-row :gutter="1" v-if="this.volumeFlag(orderTrack.planVolume, orderTrack.confirmVolume)" style="color:red; margin-bottom: unset">
									<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planVolume)}}</el-col>
									<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
									<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmVolume)}}</el-col>
								</el-row>
								<el-row :gutter="1" v-else style="margin-bottom: unset">
									<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planVolume)}}</el-col>
									<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
									<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmVolume)}}</el-col>
								</el-row>
							</el-col>
							<el-col :sm="10" :xs="7" class="order-track-text-center">
								<span>CBM</span>
							</el-col>
						</el-row>

						<!-- 计费重量 -->
						<el-row class="order-track-border">
							<el-col :sm="4" :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">计费重量</div>
							</el-col>
							<el-col :sm="10" :xs="12" class="order-track-border-right">
								<el-row :gutter="1" v-if="this.checkFlag(orderTrack.planChargeWeight, orderTrack.confirmChargeWeight)" style="color:red; margin-bottom: unset">
									<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planChargeWeight)}}</el-col>
									<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
									<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmChargeWeight)}}</el-col>
								</el-row>
								<el-row :gutter="1" v-else style="margin-bottom: unset">
									<el-col :sm="11" :xs="11" class="order-track-text-right">{{ this.getNumber3(orderTrack.planChargeWeight)}}</el-col>
									<el-col :sm="2" :xs="2" class="order-track-text-center">/</el-col>
									<el-col :sm="11" :xs="11">{{this.getNumber3(orderTrack.confirmChargeWeight)}}</el-col>
								</el-row>
							</el-col>
							<el-col :sm="10" :xs="7" class="order-track-text-center">
								<span>KG</span>
							</el-col>
						</el-row>
					</div>

				</el-collapse-item>
				<el-collapse-item title="轨迹信息" name="trackInfo">
					<el-card>
						<el-row>
							<el-col :sm="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
                <el-button type="text" @click="handlerMore" style="padding: unset">外部网站</el-button>
              </el-col>
						</el-row>
						<div v-if="this.orderTrack.routeTracks.length > 0">
							<div class="hidden-sm-and-down">
								<el-row :gutter="1" v-for="routeTrack in this.orderTrack.routeTracks" :key="routeTrack.trackAwbId">
									<el-col :md="4" :lg="4" :xl="4" style="text-align: left">{{routeTrack.flightStatusName}} {{routeTrack.flightStatusCode}}</el-col>
									<el-col :md="4" :lg="4" :xl="4" style="text-align: left"> {{routeTrack.remark || '-'}} </el-col>
									<el-col :md="4" :lg="4" :xl="4" style="text-align: left">{{routeTrack.flightNum || '-'}}</el-col>
									<el-col :md="4" :lg="4" :xl="4" style="text-align: left;">{{routeTrack.eventTime || "- "}}</el-col>
                  <el-col :md="4" :lg="4" :xl="4" style="text-align: left">{{formatCargoInfo(routeTrack)}}</el-col>
								</el-row>
							</div>
							<div class="hidden-md-and-up" style="overflow-x: scroll">
								<el-row :gutter="1" v-for="routeTrack in this.orderTrack.routeTracks" :key="routeTrack.trackAwbId" style="min-width: 550px">
									<el-col :xs="4" :sm="4">{{routeTrack.flightStatusName}} {{routeTrack.flightStatusCode}}</el-col>
									<el-col :xs="3" :sm="3" :offset="1" style="text-align: left">{{routeTrack.remark || '-'}}</el-col>
									<el-col :xs="4" :sm="4">{{routeTrack.flightNum || '-'}}</el-col>
									<el-col :xs="5" :sm="5">{{routeTrack.eventTime || '-'}}</el-col>
									<el-col :xs="6" :sm="6">{{formatCargoInfo(routeTrack)}}</el-col>
								</el-row>
							</div>
						</div>
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

					<el-row :gutter="20">
						<template v-for="manifest in this.manifestTracks">
              <template v-if="manifest.masterFlag">
                <el-col :md="8" :xs="24" style="margin: 5px 0px;">
                  <el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
                    <el-card shadow="never" body-style="padding: 10px">
                      <el-row style="margin-bottom: 0px">
                        <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left">主单预配</el-col>
                        <el-col :md="2" :xs="6" v-if="manifest.provisionTime"><i
                          class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                        <el-col :md="12" :xs="8" class="order-track-manifest-card-color">{{manifest.provisionTime}}
                        </el-col>
                      </el-row>
                    </el-card>
                  </el-card>
								</el-col>
								<el-col :md="8" :xs="24" style="margin: 5px 0px;">
									<el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
										<el-card shadow="never" body-style="padding: 10px">
											<el-row style="margin-bottom: 0px">
												<el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left">主单运抵</el-col>
												<el-col :md="2" :xs="6" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
												<el-col :md="12" :xs="8" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
											</el-row>
										</el-card>
									</el-card>
								</el-col>
								<el-col :md="8" :xs="24" style="margin: 5px 0px;">
									<el-card shadow="never" body-style="padding:10px 18px;" style="background-color: #EBEEF5">
                    <el-card shadow="never" body-style="padding: 10px">
                      <el-row style="margin-bottom: 0px">
                        <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left">主单放行</el-col>
                        <el-col :md="2" :xs="6" v-if="manifest.passedTime"><i
                          class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                        <el-col :md="12" :xs="8" class="order-track-manifest-card-color">{{manifest.passedTime}}
                        </el-col>
                      </el-row>
                    </el-card>
                  </el-card>
                </el-col>
              </template>
              <el-col :md="8" :sm="12" style="margin:5px 0px" v-if="!manifest.masterFlag">
                <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                         body-style="padding-bottom:0px">
                  <el-row style="margin-bottom: unset">
                    <el-col :md="24" class="order-track-text-left">分运单号：<span
                      class="el-cs-001">{{ manifest.hawbNumber }}</span></el-col>
                  </el-row>
                  <el-row style="margin-bottom: unset">
                    <el-col :md="24" class="order-track-text-left">报关单号：<span
                      class="el-cs-001">{{ manifest.declarationNumber }}</span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="order-track-text-left">件重信息：<span
                      class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                  </el-row>
                  <el-row>
                    <el-card shadow="never" body-style="padding:10px">
                      <el-row style="margin-bottom: 0px">
                        <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left">分单预配</el-col>
                        <el-col :md="2" :xs="6" v-if="manifest.provisionTime"><i
                          class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                        <el-col :md="12" :xs="8" class="order-track-manifest-card-color">{{ manifest.provisionTime }}
                        </el-col>
                      </el-row>
                    </el-card>
                    <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                      <el-row style="margin-bottom: 0px">
												<el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left">分单运抵</el-col>
												<el-col :md="2" :xs="6" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
												<el-col :md="12" :xs="8" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
											</el-row>
										</el-card>
										<el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                      <el-row style="margin-bottom: 0px">
                        <el-col :md="8" :xs="8" style="color: #c0c1be; text-align: left">分单放行</el-col>
                        <el-col :md="2" :xs="6" v-if="manifest.passedTime"><i
                          class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                        <el-col :md="12" :xs="8" class="order-track-manifest-card-color">{{manifest.passedTime}}
                        </el-col>
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
									<el-col :sm="8" :xs="10" style="text-align: left">{{manifest.eventTime}}</el-col>
									<el-col :sm="10" :xs="14" style="text-align: left"> {{manifest.remark || '-'}} </el-col>
									<div class="hidden-md-and-up">
										<el-col :xs="22" :sm="22" style="text-align: right"> {{ manifest.productInfo}} </el-col>
									</div>
									<div class="hidden-sm-and-down">
										<el-col style="text-align: left"> {{ manifest.productInfo}} </el-col>
									</div>
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
						<el-col v-for="attachment in this.attFiles" :key="attachment.orderFileId" :xs="8" :sm="8" :md="6" :lg="3" :xl="3">
							<el-tooltip placement="top">
								<div slot="content">{{ attachment.fileName }}</div>
								<el-card class="box-card">
									<a :href="attachment.fileUrl" @click.prevent="jumpToUrl(attachment)">
										<i class="el-icon-document"></i>
										<div class="file-name">{{ attachment.fileName }}</div>
									</a>
								</el-card>
							</el-tooltip>
						</el-col>
						<el-col :xs="8" :sm="8" :md="6" :lg="3" :xl="3" v-if="showDeliveryNoticeForWarehouse">
							<el-card class="box-card">
								<a href="javascript:void(0)" @click.prevent="callDeliveryNotice('warehouse')">
									<i class="el-icon-document"></i>
									<div class="file-name">送货通知-交货货站</div>
								</a>
							</el-card>
						</el-col>
						<el-col :xs="8" :sm="8" :md="6" :lg="3" :xl="3" v-if="showDeliveryNoticeForStorehouse">
							<el-card class="box-card">
								<a href="javascript:void(0)" @click.prevent="callDeliveryNotice('storehouse')">
									<i class="el-icon-document"></i>
									<div class="file-name">送货通知-普货库房</div>
								</a>
							</el-card>
						</el-col>
						<el-col :xs="8" :sm="8" :md="6" :lg="3" :xl="3" v-if="showAwbPrint">
							<el-tooltip placement="top">
								<div slot="content">主单：{{awbNumber}}</div>
								<el-card class="box-card">
									<a href="javascript:void(0)" @click.prevent="callAwbPrint">
										<i class="el-icon-document"></i>
										<div class="file-name">主单：{{awbNumber}}</div>
									</a>
								</el-card>
							</el-tooltip>
						</el-col>
						<template v-if="showHawbPrint">
							<el-col v-for="(hawbPrint,index) in hawbPrintList" :key="index" :xs="8" :sm="8" :md="6" :lg="3" :xl="3">
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

						<el-col :xs="8" :sm="8" :md="6" :lg="3" :xl="3" v-show="this.orderTrack.awbNumber">
							<el-card class="box-card">
								<a href="javascript:void(0)" @click.prevent="callAwbSubmit">
									<i class="el-icon-document"></i>
									<div class="file-name">运单确认件</div>
								</a>
							</el-card>
						</el-col>
						<el-card v-if="this.orderTrack.awbNumber.length == 0 && this.attFiles.length == 0&&!showDeliveryNoticeForWarehouse&&!showDeliveryNoticeForStorehouse&&!showAwbPrint&&!showHawbPrint">
							<div>当前订单没有可显示的相关文件</div>
						</el-card>
					</el-row>
				</el-collapse-item>
				<el-collapse-item title="相关图片" name="images">
					<el-row>
						<el-card class="box-card" v-if="this.attImages.length > 0" id="att_images">
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
			<el-col :sm="24" style="text-align: center">
				<a href="http://www.efreight.cn/" target="_blank">
					<el-image :src="qr001" style="width: 140px;"></el-image>
				</a>
			</el-col>
		</el-row>

	</div>
</template>
<style>
	.orderTrackExternal .el-row {
		margin-bottom: 10px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.orderTrackExternal .order-track-margin-bottom {
		margin-bottom: 10px;
	}

	.orderTrackExternal .font-style {
		font-size: 24px;
		font-weight: bold;
	}

	.orderTrackExternal .el-collapse-item__header {
		background-color: #66b1ff;
		border-radius: 5px;
		padding-left: 10px;
	}

	.orderTrackExternal .el-collapse-item__header {
		height: 30px;
		color: #fff;
	}

	.orderTrackExternal #att_images .el-image__inner {
		height: 300px;
	}

	.orderTrackExternal .el-collapse-item {
		margin-bottom: 10px;
	}

	.orderTrackExternal .el-collapse-item__content {
		padding-left: 10px;
		padding-top: 10px;
		padding-right: 10px;
	}

	.orderTrackExternal .el-collapse {
		border-bottom: unset;
	}

	.orderTrackExternal .el-card__body {
		text-align: center;
	}

	.orderTrackExternal .el-divider--horizontal {
		margin: 13px 0;
	}

	.orderTrackExternal .el-icon-myjinkou {
		color: #409EFF;
		font-weight: bold;
	}

	.orderTrackExternal .el-icon-document {
		font-size: 64px;
		color: #409EFF;
	}

	.orderTrackExternal .file-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.orderTrackExternal .order-track-text-right {
		text-align: right;
	}

	.orderTrackExternal .order-track-text-left {
		text-align: left;
	}

	.orderTrackExternal .order-track-text-center {
		text-align: center;
	}

	.orderTrackExternal {
		margin-top: -60px
	}

	.orderTrackExternal .order-track-border {
		border: 1px solid #EBEEF5;
	}

	.orderTrackExternal .order-track-border-right {
		border-right: 1px solid #EBEEF5
	}

	.orderTrackExternal .order-track-border-left {
		border-left: 1px solid #EBEEF5
	}

	.orderTrackExternal .tab-more-btn {
		position: absolute;
		top: 0px;
    left: 45%;
  }

  .orderTrackExternal .el-collapse-item__content {
    padding-bottom: 4px;
  }

  .orderTrackExternal .order-track-manifest-card-color {
    color: #66b1ff;
  }

  .orderTrackExternal .el-cs-001 {
    font-size: 16px;
    font-weight: bold;
  }
</style>
<script>
	import {
		orderDisplayRule
	} from "../../../../common/order/orderDisplayRule";
	import qr001 from "@/assets/images/qr001.png";

	export default {
		data() {
			return {
				collapseActiveNames: ['orderInfo', 'attachment', 'images'],
				orderTrack: {
					orderId: "",
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
					attachments: [],
					routeTracks: [], //轨迹信息
				},
				query: {
					o: "",
					g: "",
				},
				attImages: [], //附件图片
				attFiles: [], //附件文件
				qr001: qr001,
				manifestTracks: [],
				showListTrackManifest: false,
				hawbPrintList: [],
				awbNumber: '',
				showAwbPrint: false,
				showHawbPrint: false,
				showDeliveryNoticeForWarehouse: false,
				showDeliveryNoticeForStorehouse: false,
				orderUUID: '',
				//侧面二维码
				clipboardText: ''
			}
		},
		methods: {
			jumpToUrl(item) {
				let fileUrl = item['fileUrl'] || "";
				if (!fileUrl) {
					this.openError("未获取到附件地址");
					return;
				}
				this.jumpURL(fileUrl);
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			callAwbSubmit() {
				this.$axios.post('/afbase/external/order/awbSubmit?o=' + this.query.o.substring(2))
					.then(function(response) {
						let url = response.data.data;
						if (this._isMobile()) {
							window.location.href = url;
						} else {
							window.open(url);
						}
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this));

			},
			viewImage(src) {
				this.jumpURL(src);
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
			buildParams() {
				let params = "?";
				for (let key in this.query) {
					let value = (this.query[key] || "").trim();
					if (key && value) {
						params += (key + "=" + value + "&");
					}
				}
				return params.substring(0, params.length - 1);
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
			_isMobile() {
				let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
				return flag;
			},
			handlerMore() {
				let awbNumber = this.orderTrack.awbNumber;
				if (awbNumber) {
					let url = 'http://www.mawb.cn/zh-cn/AirCargoTrack/?mawbno=' + awbNumber;
					this.jumpURL(url);
				}
			},
			jumpURL(url) {
				if (!url) {
					return
				};
				if (this._isMobile()) {
					window.location.href = url;
				} else {
					window.open(url);
				}
			},
			handlerManifestMore() {
				this.showListTrackManifest = !this.showListTrackManifest;
			},
			resolveWaybillNumber: function(info) {
				let match = (info || "").match(/^报关单号：(\d+)/g);
				return (match && match.length >= 1) ? match[0].replace("报关单号：", "") : "";
			},
			qrCodeCallBack(imgDataBase64) {
				this.drawBorderQR(this.$route.query.code, 120, 140, imgDataBase64);
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
					document.getElementById("order-qr-code-view").append(htmlImg);
				}
			},
			callAwbPrint() {
				this.$axios.post2('/afbase/external/downloadAWB', {
						awbPrintType: 'PRINT_MAWB',
						orderUuid: this.orderUUID,
						printType: '2'
					})
					.then(function(response) {
						if (this._isMobile()) {
							window.location.href = response.data.data
						} else {
							window.open(response.data.data);
						}
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this))
			},
			callHawbPrint(row) {
				this.$axios.post2('/afbase/external/downloadHAWB', {
						awbPrintType: 'PRINT_HAWB',
						orderUuid: this.orderUUID,
						awbPrintId: row.awbPrintId,
						printType: '2'
					})
					.then(function(response) {
						if (this._isMobile()) {
							window.location.href = response.data.data
						} else {
							window.open(response.data.data);
						}
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this))
			},
			callDeliveryNotice(flag) {
				let url = location.origin + "/#/externalOrderDeliveryNotice?o=af" + (this.orderUUID || "")+"&flag="+flag
				window.open(url)
			},
			init() {
				//判断送货通知是否可见
				this.$axios.get("/afbase/external/checkOrderDeliveryNotice/" + this.orderUUID + "/warehouse").then((response) => {
					this.$axios.get("/afbase/external/viewAFOrderByOrderUuid/" + this.orderUUID).then((resp) => {
						if (response.data.code == 0 && resp.data.code == 0 &&resp.data.data.outfieldService) {
							this.showDeliveryNoticeForWarehouse = true
						}
					})
				})
				this.$axios.get("/afbase/external/checkOrderDeliveryNotice/" + this.orderUUID + "/storehouse").then((response) => {
					this.$axios.get("/afbase/external/viewAFOrderByOrderUuid/" + this.orderUUID).then((resp) => {
						if (response.data.code == 0 && resp.data.code == 0 && resp.data.data.warehouseService) {
							this.showDeliveryNoticeForStorehouse = true
						}
					})
				})
				//判断主单打印是否可见
				this.$axios.get('/afbase/external/viewByOrderUuid/' + this.orderUUID).then((response) => {
					if (response.data.code == 0 && response.data.data) {
						this.awbNumber = response.data.data.awbNumber
						this.showAwbPrint = true
					}
				})
				//判断分单打印是否可件
				this.$axios.get('/afbase/external/hawbListByOrderUuid/' + this.orderUUID).then((response) => {
					if (response.data.code == 0 && response.data.data) {
						this.hawbPrintList = response.data.data
						this.showHawbPrint = true
					}
				})
			},
      formatCargoInfo(row) {
        let str = "";
        if (row.quantity && row.grossWeight) {
          str = row.quantity + " Pcs / " + row.grossWeight + " Kg";
        } else if (row.quantity) {
          str = row.quantity + " Pcs";
        } else {
          str = row.grossWeight + " Kg";
        }
        return str;
      },
    },
		created() {
			let orderUUID = this.$route.query['o'];

			if (!orderUUID) {
				this.openError("未获取到查询相关信息");
				return;
			}
			this.orderUUID = orderUUID.substring(2)
			//整理二维码
			let url = location.origin + "/#/externalOrderTrack?o=" + orderUUID + "&code=" + this.$route.query.code
			this.clipboardText = url;

			this.query.o = orderUUID;
			let params = this.buildParams();
			this.$axios.get('/afbase/external/order/orderTrack' + params).then(function(response) {
				if (0 == response.data.code) {
					this.orderTrack = response.data.data;
					if (this.orderTrack.routeTracks.length > 0) {
						this.collapseActiveNames.push("trackInfo");
					}

					if (this.orderTrack.trackManifest.length > 0) {
						this.collapseActiveNames.push("shippingBillInfo");
					}
					let attachments = this.orderTrack.attachments;
					for (let i = 0; i < attachments.length; i++) {
						let item = attachments[i],
							fileType = item['fileType'];
						if ("照片" == fileType) {
							this.attImages.push(item);
						} else if ("文件" == fileType) {
							this.attFiles.push(item);
						}
					}
					//构建productInfo字段
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

          this.manifestTracks = this.orderTrack.manifestList;
          if (this.manifestTracks.length == 0) {
            this.showListTrackManifest = true
          }
        } else {
					this.openError(response.data.messageInfo || "数据获取失败");
				}
			}.bind(this));
			this.init()
		}

	}
</script>
