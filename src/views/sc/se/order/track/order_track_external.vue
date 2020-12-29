<template>
	<div class="orderTrackExternal" style="position: relative;top: 0px;">
		<el-row>
			<el-card>
				<el-row type="flex" justify="center">
					<el-col :sm="7" :xs="24">
						<h6 class="font-style-header"> {{orderTrack.number}} </h6>
					</el-col>
				</el-row>
				<el-row type="flex" justify="center" style="margin-bottom: 0px">
					<el-col :sm="7" :xs="7"> <i class="el-icon-myhaiyunjinkou iconfont"></i> </el-col>
				</el-row>
				<el-row type="flex" justify="center">
					<el-col :sm="4" :xs="10" class="font-style port-right"> {{orderTrack.departureStation}} </el-col>
					<el-col :sm="5" :xs="4">
						<el-divider></el-divider>
					</el-col>
					<el-col :sm="3" :xs="10" class="font-style port-left"> {{orderTrack.arrivalStation}} </el-col>
				</el-row>
				<el-row type="flex" justify="center" :gutter="1" style="height: 20px;">
					<el-col :sm="4" :xs="12"> {{orderTrack.shipInfo}} </el-col>
					<el-col :sm="2" :xs="8"> {{orderTrack.expectDeparture}} </el-col>
				</el-row>
				<div style="text-align: center" id="order-qr-code-view">
					<vue-qr :text="clipboardText" :callback="qrCodeCallBack" :margin="5" :size="100" style="display: none"></vue-qr>
				</div>
			</el-card>
		</el-row>
		<el-row>
			<el-collapse v-model="collapseActiveNames">
				<el-collapse-item title="订单信息" name="orderInfo" class='item-title'>
					<!-- 大设备 -->
					<div class="hidden-sm-and-down">
						<el-row :gutter="20">
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">合约号</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.customerNumber}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">主提单号</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.mlbNumber}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="12">
								<el-row class="order-track-border">
									<el-col :span="4" style="width: 16%" class="order-track-border-right">
										<div class="order-track-text-center">货物品名</div>
									</el-col>
									<el-col :span="4" class="order-track-border-right">
										<div class="order-track-text-center">
											<span>{{orderTrack.goodsType}}</span>
										</div>
									</el-col>
									<el-col :span="16">
										{{orderTrack.goodsNameCn}}
									</el-col>
								</el-row>
							</el-col>
						</el-row>

						<el-row :gutter="20">
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">装箱方式</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.containerMethod}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="12">
								<el-row class="order-track-border">
									<el-col :span="8" style="width: 16%" class="order-track-border-right">
										<div class="order-track-text-center">集装箱量</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.containerList}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">标箱数量</div>
									</el-col>
									<el-col :span="10" class="order-track-border-right">
										<div class="order-track-text-center">
											<span>{{orderTrack.containerNumber}}</span>
										</div>
									</el-col>
									<el-col :span="6" class="order-track-text-center order-track-border-left">
										<span>KG</span>
									</el-col>
								</el-row>
							</el-col>
						</el-row>

						<el-row :gutter="20">
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">件数</div>
									</el-col>
									<el-col :span="6" class="order-track-border-right">
										<div class="order-track-text-center">
											<span>{{orderTrack.planPieces}}</span>
										</div>
									</el-col>
									<el-col :span="10" class="order-track-text-center">
										<span>{{orderTrack.packageType ? orderTrack.packageType : "-" }}</span>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">毛重</div>
									</el-col>
									<el-col :span="10">
										<div class="order-track-text-center">
											<span>{{orderTrack.planWeight}}</span>
										</div>
									</el-col>
									<el-col :span="6" class="order-track-text-center order-track-border-left">
										<span>KG</span>
									</el-col>
								</el-row>
							</el-col>

							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">体积</div>
									</el-col>
									<el-col :span="10" class="">
										<div class="order-track-text-center">
											<span>{{orderTrack.planVolume}}</span>
										</div>
									</el-col>
									<el-col :span="6" class="order-track-text-center order-track-border-left">
										<span>CBM</span>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">计费吨</div>
									</el-col>
									<el-col :span="10" class="order-track-border-right">
										<div class="order-track-text-center">
											<span>{{orderTrack.planChargeWeight}}</span>
										</div>
									</el-col>
									<el-col :span="6" class="order-track-text-center order-track-border-left">
										<span>TON</span>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>

					<!-- 小设备 -->
					<div class="hidden-md-and-up">
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">合约号</div>
							</el-col>
							<el-col :xs="19">
								<div class="order-track-text-center">
									{{orderTrack.containerNumber}}
								</div>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">主提单号</div>
							</el-col>
							<el-col :xs="19">
								<div class="order-track-text-center">
									{{orderTrack.mlbNumber}}
								</div>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">货物品名</div>
							</el-col>
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center"> {{orderTrack.goodsType}} </div>
							</el-col>
							<el-col :xs="14">
								<div class="order-track-text-center"> {{orderTrack.goodsNameCn}} </div>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">装箱方式</div>
							</el-col>
							<el-col :xs="19">
								<div class="order-track-text-center"> {{orderTrack.containerMethod}} </div>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">集装箱量</div>
							</el-col>
							<el-col :xs="19">
								<div class="order-track-text-center"> {{orderTrack.containerList}} </div>
							</el-col>
						</el-row>


						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">标箱数量</div>
							</el-col>
							<el-col :xs="12" class="order-track-border-right">
								<div class="order-track-text-center">
									<el-row :gutter="1" style="margin-bottom: unset">
										<el-col :xs="11" class="order-track-text-right">{{orderTrack.containerNumber}}</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :xs="7" class="order-track-text-center" style="white-space: nowrap">
								<span>TEU</span>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">件数</div>
							</el-col>
							<el-col :xs="12" class="order-track-border-right">
								<div class="order-track-text-center">
									<el-row :gutter="1" style="margin-bottom: unset">
										<el-col :xs="11" class="order-track-text-right">{{orderTrack.planPieces}}</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :xs="7" class="order-track-text-center" style="white-space: nowrap">
								<span>{{orderTrack.packageType ? orderTrack.packageType : "-" }}</span>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">毛重</div>
							</el-col>
							<el-col :xs="12" class="order-track-border-right">
								<div class="order-track-text-center">
									<el-row :gutter="1" style="margin-bottom: unset">
										<el-col :xs="11" class="order-track-text-right">{{orderTrack.planWeight}}</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :xs="7" class="order-track-text-center" style="white-space: nowrap">
								<span>KG</span>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">体积</div>
							</el-col>
							<el-col :xs="12" class="order-track-border-right">
								<div class="order-track-text-center">
									<el-row :gutter="1" style="margin-bottom: unset">
										<el-col :xs="11" class="order-track-text-right">{{orderTrack.planVolume}}</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :xs="7" class="order-track-text-center" style="white-space: nowrap">
								<span>CBM</span>
							</el-col>
						</el-row>
						<el-row class="order-track-border">
							<el-col :xs="5" class="order-track-border-right">
								<div class="order-track-text-center">计费吨</div>
							</el-col>
							<el-col :xs="12" class="order-track-border-right">
								<div class="order-track-text-center">
									<el-row :gutter="1" style="margin-bottom: unset">
										<el-col :xs="11" class="order-track-text-right">{{orderTrack.planChargeWeight}}</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :xs="7" class="order-track-text-center" style="white-space: nowrap">
								<span>TON</span>
							</el-col>
						</el-row>
					</div>

				</el-collapse-item>
				<el-collapse-item title="轨迹信息" name="trackInfo">
					<el-card>
						<el-row>
							<el-col :sm="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
								<el-button type="text" @click="handlerMore" style="padding: unset">MORE</el-button>
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
									<el-col :xs="6" :sm="6">{{formatCargoInfo(routeTrack)}} </el-col>
								</el-row>
							</div>
						</div>
						<template v-else>
							当前订单没有可显示的轨迹信息
						</template>
					</el-card>
				</el-collapse-item>
				<el-collapse-item title="舱单信息" name="shippingBillInfo">
					<el-card>
						<template>
							当前订单没有可显示的舱单信息
						</template>
					</el-card>
				</el-collapse-item>
				<el-collapse-item title="相关文件" name="attachment">
					<el-row :gutter="10" v-if="this.attFiles.length > 0">
						<el-col v-for="attachment in this.attFiles" :key="attachment.orderFileId" :xs="8" :sm="8" :md="6" :lg="3" :xl="3">
							<el-card class="box-card">
								<a :href="attachment.fileUrl" @click.prevent="jumpToUrl(attachment)">
									<i class="el-icon-document"></i>
									<div class="file-name">{{ attachment.fileName }}</div>
								</a>
							</el-card>
						</el-col>
					</el-row>
					<el-card v-else>
						<div>当前订单没有可显示的相关文件</div>
					</el-card>
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

	.orderTrackExternal .font-style-header {
		font-size: 24px;
		font-weight: bold;
	}

	/*大于或等于768*/
	@media only screen and (min-width: 768px) {
		.orderTrackExternal .font-style {
			font-size: 24px;
			font-weight: bold;
		}
	}

	/*小设备*/
	@media only screen and (max-width: 768px) {
		.orderTrackExternal .font-style {
			font-size: 16px;
			font-weight: bold;
			margin-top: 5px;
		}

		.orderTrackExternal .port-left {
			text-align: left;
			margin-left: 10px;
		}

		.orderTrackExternal .port-right {
			text-align: right;
			margin-right: 10px;
		}
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
</style>
<script>
	import qr001 from "@/assets/images/qr001.png";

	export default {
		data() {
			return {
				collapseActiveNames: ['orderInfo'],
				orderTrack: {
					shipInfo: '',
					number: '',
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
					goodsType: '', //货物类型
					hawbNumber: '', //分单号
					inboundDate: '', //入库日期
					outboundDate: '', //出库日期
					inspectionDate: '', //查验日期
					clearanceDate: '', //放行日期
				},
				query: {
					o: "",
					g: "",
				},
				attImages: [], //附件图片
				attFiles: [], //附件文件
				qr001: qr001,
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
				let params = this.buildParams();
				this.$axios.post('/sc/external/order/awbSubmit' + params)
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
      }
		},
		created() {
			let orderUUID = this.$route.query['o'];

			if (!orderUUID) {
				this.openError("未获取到查询相关信息");
				return;
			}
			//整理二维码
			let url = location.origin + "/#/externalOrderTrack?o=" + orderUUID + "&code=" + this.$route.query.code
			this.clipboardText = url;

			this.query.o = orderUUID;
			let params = this.buildParams();
			this.$axios.get('/sc/external/order/orderTrack' + params).then(function(response) {
				if (0 == response.data.code) {
					this.orderTrack = response.data.data;
					if (!this.orderTrack['awbNumber']) {
						this.orderTrack['awbNumber'] = this.orderTrack['customerNumber'];
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

					if (this.orderTrack.mlbNumber) {
						this.orderTrack.number = this.orderTrack.mlbNumber;
					} else {
						this.orderTrack.number = this.orderTrack.orderCode;
					}
					if (this.orderTrack.shipName && this.orderTrack.shipVoyageNumber) {
						this.orderTrack.shipInfo = this.orderTrack.shipName + " / " + this.orderTrack.shipVoyageNumber;
					} else {
						this.orderTrack.shipInfo = this.orderTrack.shipName || this.orderTrack.shipVoyageNumber;
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
				} else {
					this.openError(response.data.messageInfo || "数据获取失败");
				}
			}.bind(this));
		}

	}
</script>
