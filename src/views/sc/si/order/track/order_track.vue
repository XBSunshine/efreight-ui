<template>
	<el-dialog title="订单追踪" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
		<div class="se_order_track">
			<el-row>
				<el-card>
					<el-row type="flex" justify="center">
						<el-col :span="7">
							<h6 class="font-style"> {{orderTrack.number}} </h6>
						</el-col>
					</el-row>
					<el-row type="flex" justify="center" style="margin-bottom: 0px">
						<el-col :span="7"> <i class="el-icon-myhaiyunjinkou iconfont"></i> </el-col>
					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="6" class="font-style"> {{orderTrack.departureStation}} </el-col>
						<el-col :span="5">
							<el-divider></el-divider>
						</el-col>
						<el-col :span="6" class="font-style"> {{orderTrack.arrivalStation}} </el-col>
					</el-row>
					<el-row type="flex" justify="center" :gutter="1" style="height: 20px;">
						<el-col :span="4"> {{orderTrack.shipInfo}} </el-col>
						<el-col :span="2"> {{orderTrack.expectDeparture}} </el-col>
					</el-row>
					<div style="text-align: center;float: right;margin-top: -130px;" id="order-qr-code-view">
						<vue-qr :text="clipboardText" :callback="qrCodeCallBack" :margin="5" :size="100" style="display: none"></vue-qr>
					</div>
				</el-card>
			</el-row>
			<el-row>
				<el-collapse v-model="collapseActiveNames">
					<el-collapse-item title="订单信息" name="orderInfo" class='item-title'>
						<el-row :gutter="20">
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">客户单号</div>
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
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">分提单号</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.hlbNumber}}</span>
										</div>
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
										<span>TEU</span>
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

						<el-row :gutter="20">
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">货物类型</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.goodsType}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="18">
								<el-row class="order-track-border">
									<el-col :span="3" style="width: 10.5%" class="order-track-border-right">
										<div class="order-track-text-center">货物品名</div>
									</el-col>
									<el-col :span="19">
										<div class="order-track-text-center">
											<span>{{orderTrack.goodsNameCn}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
						</el-row>

						<el-row :gutter="20">
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">入库日期</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.inboundDate}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">出库日期</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.outboundDate}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">查验日期</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.inspectionDate}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">放行日期</div>
									</el-col>
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.clearanceDate}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
						</el-row>

					</el-collapse-item>
					<el-collapse-item title="轨迹信息" name="trackInfo">
						<el-card>
							<el-row>
								<el-col :span="24" style="text-align: right" v-if="this.orderTrack.awbNumber">
									<el-button type="text" @click="handlerMore" style="padding: unset">MORE</el-button>
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
						<el-card>
							<template>
								当前订单没有可显示的舱单信息
							</template>
						</el-card>
					</el-collapse-item>
					<el-collapse-item title="相关文件" name="attachment">
						<el-row :gutter="10" v-if="this.attFiles.length > 0">
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
				<el-col :span="24" style="text-align: center">
					<a href="http://www.efreight.cn/" target="_blank">
						<el-image :src="qr001" style="width: 140px;"></el-image>
					</a>
				</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>
<style>
	.se_order_track .el-row {
		margin-bottom: 10px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.se_order_track .font-style {
		font-size: 24px;
		font-weight: bold;
	}

	.se_order_track .el-collapse-item__header {
		background-color: #66b1ff;
		border-radius: 5px;
		padding-left: 10px;
	}

	.se_order_track #att_images .el-image__inner {
		height: 300px;
	}

	.se_order_track .el-collapse-item__header {
		height: 30px;
		color: #fff
	}

	.se_order_track .el-collapse-item {
		margin-bottom: 10px;
	}

	.se_order_track .el-collapse-item__content {
		padding-left: 10px;
		padding-top: 10px;
	}

	.se_order_track .el-collapse {
		border-bottom: unset;
	}

	.se_order_track .el-card__body {
		text-align: center;
	}

	.se_order_track .el-divider--horizontal {
		margin: 12px 0;
	}

	.se_order_track .el-icon-myjinkou {
		color: #409EFF;
		font-weight: bold;
	}

	.se_order_track .el-icon-document {
		font-size: 64px;
		color: #409EFF;
	}

	.se_order_track .file-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.se_order_track .order-track-text-right {
		text-align: right;
	}

	.se_order_track .order-track-text-left {
		text-align: left;
	}

	.se_order_track .order-track-text-center {
		text-align: center;
	}

	.se_order_track .order-track-border {
		border: 1px solid #EBEEF5;
		margin-bottom: unset;
	}

	.se_order_track .order-track-border-right {
		border-right: 1px solid #EBEEF5
	}

	.se_order_track .order-track-border-left {
		border-left: 1px solid #EBEEF5
	}

	.se_order_track .tab-more-btn {
		position: absolute;
		top: 0px;
		left: 45%;
	}

	.se_order_track .el-collapse-item__content {
		padding-bottom: 4px;
	}
</style>
<script>
	import qr001 from "@/assets/images/qr001.png";

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
				collapseActiveNames: ['orderInfo'],
				orderTrack: {
					shipInfo: '',
					number: '',
					orderId: "",
					orderUUID: '',
					orderCode: '',
					mlbNumber: '',
					hlbNumber: '',
					expectDeparture: '',
					departureStation: '',
					arrivalStation: '',
					goodsNameCn: "",
					planPieces: '',
					packageType: '',
					planWeight: '',
					weightUnit: 'KG',
					planVolume: '',
					volumeUnknown: 'CMB',
					planChargeWeight: '',
					chargeWeightUnit: 'KG',
					attachments: [], //附近信息
					routeTracks: [], //轨迹信息
					goodsType: '', //货物类型
					inboundDate: '', //入库日期
					outboundDate: '', //出库日期
					inspectionDate: '', //查验日期
					clearanceDate: '', //放行日期
					shipName: '',
					shipVoyageNumber: '',
					customerNumber: '',
					containerMethod: '',
					containerList: '',
					containerNumber: '',

				},
				attImages: [], //附件图片
				attFiles: [], //附件文件
				imagePreviewList: [], //预览图片
				qr001: qr001,
				//侧面二维码
				clipboardText: ''
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
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
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
			handlerMore() {
				let awbNumber = this.orderTrack.mlbNumber;
				if (awbNumber) {
					let url = 'http://www.mawb.cn/zh-cn/AirCargoTrack/?mawbno=' + awbNumber;
					window.open(url);
				}
			},
			qrCodeCallBack(imgDataBase64) {
				this.drawBorderQR(this.frow.mblNumber || this.frow.orderCode, 120, 140, imgDataBase64);
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
			this.$axios.get('/sc/scOrder/orderTrack/' + this.frow.orderUuid).then(function(response) {
				if (0 == response.data.code) {
					this.orderTrack = response.data.data;
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
			}.bind(this)).catch(function(error) {
				console.error(error);
				this.openError("访问失败")
			}.bind(this));
			//整理侧边二维码
			let scope = this.$route.path.substring(1, 3) || 'un';
			let url = location.origin + "/#/externalOrderTrack?o=" + scope + (this.frow.orderUuid || "") + "&code=" + (this.frow.mblNumber || this.frow.orderCode)
			this.clipboardText = url;
		}

	}
</script>
