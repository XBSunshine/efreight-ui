<template>
	<el-dialog title="订单追踪" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
		<div class="orderTrack">
			<el-row>
				<el-card>
					<el-row type="flex" justify="center">
						<el-col :span="7">
							<h6 class="font-style"> {{orderTrack.number}} </h6>
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
									<el-col :span="16">
										<div class="order-track-text-center">
											<span>{{orderTrack.planWeight}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>

							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">体积</div>
									</el-col>
									<el-col :span="16" class="">
										<div class="order-track-text-center">
											<span>{{orderTrack.planVolume}}</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row class="order-track-border">
									<el-col :span="8" class="order-track-border-right">
										<div class="order-track-text-center">计费重量</div>
									</el-col>
									<el-col :span="16" class="order-track-border-right">
										<div class="order-track-text-center">
											<span>{{orderTrack.planChargeWeight}}</span>
										</div>
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
										<div class="order-track-text-center">中文品名</div>
									</el-col>
									<el-col :span="21">
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
                  <el-button type="text" @click="handlerMore" style="padding: unset">外部网站</el-button>
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

            <el-row :gutter="20">
              <template v-for="manifest in this.manifestTracks">
                <el-col :span="8" style="margin:5px 0px" v-if="manifest.masterFlag">
                  <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                           body-style="padding-bottom:0px">
                    <el-row style="margin-bottom: unset">
                      <el-col :span="24" class="order-track-text-left">主运单号：<span
                        class="el-cs-001">{{ manifest.orderNo }}</span></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="order-track-text-left">件重信息：<span
                        class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                    </el-row>
                    <el-row>
                      <el-card shadow="never" body-style="padding:10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">主单原始</el-col>
                          <el-col :span="2" v-if="manifest.originalTime"><i
                            class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{ manifest.originalTime }}
                          </el-col>
                        </el-row>
                      </el-card>
                      <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">主单理货</el-col>
                          <el-col :span="2" v-if="manifest.tallyTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{manifest.tallyTime}}</el-col>
                        </el-row>
                      </el-card>
                      <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">分拨申请</el-col>
                          <el-col :span="2" v-if="manifest.applyTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{manifest.applyTime}}</el-col>
                        </el-row>
                      </el-card>
                      <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">分拨运抵</el-col>
                          <el-col :span="2" v-if="manifest.arriveTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{manifest.arriveTime}}</el-col>
                        </el-row>
                      </el-card>
                      <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">主单放行</el-col>
                          <el-col :span="2" v-if="manifest.passedTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{manifest.passedTime}}</el-col>
                        </el-row>
                      </el-card>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="8" style="margin:5px 0px" v-else>
                  <el-card shadow="never" style="background-color: #EBEEF5" class="order-track-manifest-card"
                           body-style="padding-bottom:0px">
                    <el-row style="margin-bottom: unset">
                      <el-col :span="24" class="order-track-text-left">分运单号：<span
                        class="el-cs-001">{{ manifest.orderNo }}</span></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="order-track-text-left">件重信息：<span
                        class="el-cs-001">{{ manifest.pieceWeightInfo }}</span></el-col>
                    </el-row>
                    <el-row>
                      <el-card shadow="never" body-style="padding:10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">分单原始</el-col>
                          <el-col :span="2" v-if="manifest.originalTime"><i
                            class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{ manifest.originalTime }}
                          </el-col>
                        </el-row>
                      </el-card>
                      <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">分单理货</el-col>
                          <el-col :span="2" v-if="manifest.tallyTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{manifest.tallyTime}}</el-col>
                        </el-row>
                      </el-card>
                      <el-card shadow="never" body-style="padding:10px" style="margin-top: 10px">
                        <el-row style="margin-bottom: 0px">
                          <el-col :span="8" style="color: #c0c1be; text-align: left">分单放行</el-col>
                          <el-col :span="2" v-if="manifest.passedTime"><i class="el-icon-s-flag order-track-manifest-card-color"></i></el-col>
                          <el-col :span="12" class="order-track-manifest-card-color">{{manifest.passedTime}}</el-col>
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
							<template v-if="this.attFiles.length > 0">
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
							</template>
							<template v-else>
								<el-card>
									<div>当前订单没有可显示的相关文件</div>
								</el-card>
							</template>
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
				<el-col :span="24" style="text-align: center">
					<a href="http://www.efreight.cn/" target="_blank">
						<el-image :src="qr001" style="width: 140px;"></el-image>
					</a>
				</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>
<script>
	import {
		orderDisplayRule
	} from "../../../../common/order/orderDisplayRule";
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
					attachments: [], //附近信息
					routeTracks: [], //轨迹信息
					goodsType: '', //货物类型
					hawbNumber: '', //分单号
					inboundDate: '', //入库日期
					outboundDate: '', //出库日期
					inspectionDate: '', //查验日期
					clearanceDate: '', //放行日期

				},
				attImages: [], //附件图片
				attFiles: [], //附件文件
				imagePreviewList: [], //预览图片
				qr001: qr001,
				//侧面二维码
				clipboardText: '',
        showListTrackManifest: false,
        manifestTracks: [],
      }
		},
		inject: ['awbSubmit'],
		methods: {
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
				orderDisplayRule.checkPieces();
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
			callAwbSubmit() {
				this.awbSubmit({
					"orderUuid": this.orderTrack.orderUUID
				})
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
				let awbNumber = this.orderTrack.awbNumber;
				if (awbNumber) {
					let url = 'http://www.mawb.cn/zh-cn/AirCargoTrack/?mawbno=' + awbNumber;
					window.open(url);
				}
			},
			qrCodeCallBack(imgDataBase64) {
				this.drawBorderQR(this.frow.awbNumber || this.frow.orderCode, 120, 140, imgDataBase64);
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
      handlerManifestMore() {
        this.showListTrackManifest = !this.showListTrackManifest;
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
      }
		},
		created() {
			this.$axios.get('/afbase/aforder/orderTrack/' + this.frow.orderUuid).then(function(response) {
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
			}.bind(this)).catch(function(error) {
				console.error(error);
				this.openError("访问失败")
			}.bind(this));
			//整理侧边二维码
			let scope = this.$route.path.substring(1, 3) || 'un';
			let url = location.origin + "/#/externalOrderTrack?o=" + scope + (this.frow.orderUuid || "") + "&code=" + (this.frow.awbNumber || this.frow.orderCode)
			this.clipboardText = url;
		}

	}
</script>
<style>
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

  .orderTrackExternal .order-track-manifest-card-color {
    color: #66b1ff;
  }

  .orderTrack .order-track-text-left {
    text-align: left;
  }

  .orderTrack .el-cs-001 {
    font-size: 16px;
    font-weight: bold;
  }
</style>
