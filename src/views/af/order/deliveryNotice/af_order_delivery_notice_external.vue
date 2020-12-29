<template>
	<div class="order-delivery-notice-external">
		<el-row type="flex" justify="center" align="center" v-if="map.center.lat && map.center.lng">
			<el-col :sm="12" :xs="23">
				<div v-if="showImage">
					<el-image :src="orderDeliveryNotice.logoUrl" style="width: 200px;" />
				</div>
				<div style="float: right;">
					<vue-qr :text="clipboardText" :size="150"></vue-qr>
				</div>
				<div style="text-align:center;margin: 0 auto;width: 100px;">
					<h3 style="font-size: 18px;">送货通知</h3>
				</div>
				<div class="delivery-notice-content">
					<p>
						尊敬的客户，您好：
					</p>
					<div class="left-shift-two-word">
						<p>
							贵司预定的出口至<span :class="orderDeliveryNoticeClass.arrivalStation">{{orderDeliveryNotice.arrivalStation}}</span>的货物
							<span :class="orderDeliveryNoticeClass.planPieces">{{orderDeliveryNotice.planPieces}}</span>托盘/
							<span :class="orderDeliveryNoticeClass.planWeight">{{orderDeliveryNotice.planWeight}}</span>公斤/
							<span :class="orderDeliveryNoticeClass.planVolume">{{orderDeliveryNotice.planVolume}}</span>立方
						</p>
						<p>
							进仓编号为<span :class="orderDeliveryNoticeClass.inboundNumber">{{orderDeliveryNotice.inboundNumber}}</span>，主运单号为<span :class="orderDeliveryNoticeClass.awbNumber">{{orderDeliveryNotice.awbNumber}}</span>
						</p>
						<p>
							请安排于<span :class="orderDeliveryNoticeClass.inboundDate">{{orderDeliveryNotice.inboundDate}}</span>送至<span :class="orderDeliveryNoticeClass.sendTo">{{orderDeliveryNotice.sendTo}}</span>
						</p>
						<p>
							接货联系人：
						</p>
						<p :class="orderDeliveryNoticeClass.consignee" v-html="orderDeliveryNotice.consignee">
						</p>
						<p :class="phone_number">
							<span>{{orderDeliveryNotice.salesName}}</span>&emsp;
							<span>{{orderDeliveryNotice.phoneNumber}}</span>
						</p>
						<p>
							导航关键字：<span :class="orderDeliveryNoticeClass.address">{{orderDeliveryNotice.address}}</span>
						</p>
					</div>
				</div>
				<div style="margin:0 auto;width: 100px;text-align: center;">
					<el-button @click="jumpToMap()" size="medium" type="primary" style="font-size:18px;">导航</el-button>
				</div>
				<div style="margin-top: 24px">
					<div>
						<baidu-map :center="map.center" @ready="handlerBaiduMap" :zoom="map.zoom" style="width: auto;height: 333px" :scroll-wheel-zoom="true">
							<bm-marker :position="map.center" :dragging="false"> </bm-marker>
							<bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
						</baidu-map>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row type="flex" justify="center" align="center" v-else>
			<el-col :sm="12" :xs="23">
				<div style="text-align: center; padding: 40px">
					<h3>您好，送货通知已失效。</h3>
				</div>
			</el-col>
		</el-row>
		<el-row type="flex" :gutter="20" style="margin-top: 24px">
			<el-col :sm="24" style="text-align: center">
				<a href="http://www.efreight.cn/" target="_blank">
					<el-image :src="qr001" style="width: 140px;"></el-image>
				</a>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import BMap from 'vue-baidu-map'
	import qr001 from "@/assets/images/qr001.png";
	export default {
		data() {
			return {
				phone_number: 'delivery-notice-underline margin-left',
				showImage: false,
				mapUrlTmpl: 'http://api.map.baidu.com/marker?zoom=14&output=html&location={addressLatitude},{addressLongitude}&title={sendTo}&content=-',
				mapUrl: '',
				consignee: '',
				qr001: qr001,
				clipboardText: '',
				infoWindow: {
					show: true,
				},
				map: {
					center: {
						lng: 0,
						lat: 0
					},
					zoom: 14,
					keywords: '',
					BMap: ''
				},
				orderDeliveryNotice: {
					logoUrl: '',
					arrivalStation: '',
					planPieces: '',
					packageType: '',
					planWeight: '',
					planVolume: '',
					inboundNumber: '',
					awbNumber: '',
					inboundDate: '',
					receiptDate: '',
					sendTo: '',
					consignee: '',
					address: '',
					addressLongitude: '',
					addressLatitude: '',
				},

				orderDeliveryNoticeClass: {
					arrivalStation: '',
					planPieces: '',
					packageType: '',
					planWeight: '',
					planVolume: '',
					inboundNumber: '',
					awbNumber: '',
					inboundDate: '',
					receiptDate: '',
					sendTo: '',
					consignee: '',
					address: '',
					addressLongitude: '',
					addressLatitude: '',
				},
				content: {
					imgUrl: 'https://imgm.gmw.cn/attachement/jpg/site215/20200422/8716828619089071241.jpg',
					address: '北京卡地亚槈',
					phone: '12342342',
					introduction: '去你大爷的',
				}

			}
		},
		methods: {
			handlerBaiduMap({
				BMap,
				map
			}) {
				this.map.BMap = BMap;
				this.map.zoom = 14;
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			jumpToMap() {
				if (this._isMobile()) {
					window.location.href = this.mapUrl;
				} else {
					window.open(this.mapUrl);
				}
			},
			_isMobile() {
				let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
				return flag;
			},

		},
		created() {

			let orderUUID = this.$route.query['o']
			let flag = this.$route.query['flag']
			if (!orderUUID) {
				this.openError("未获取到查询相关信息");
				return;
			}
			orderUUID = orderUUID.substring(2);
			this.$axios.get("/afbase/external/order/orderDeliveryNotice?o=" + orderUUID + "&flag=" + flag)
				.then(function(response) {
					if (0 == response.data.code) {
						this.orderDeliveryNotice = response.data.data;
						//设置图片是否显示
						// if (this.orderDeliveryNotice.logoUrl && this.orderDeliveryNotice.logoUrl.length > 0) {
						// 	this.showImage = true;
						// }
						//转换Url地址
						for (let key in this.orderDeliveryNotice) {
							let reg = new RegExp("{" + key + "}", 'g');
							this.mapUrlTmpl = this.mapUrlTmpl.replace(reg, this.orderDeliveryNotice[key]);
						}
						this.mapUrl = encodeURI(this.mapUrlTmpl);

						this.map.center.lat = this.orderDeliveryNotice.addressLatitude;
						this.map.center.lng = this.orderDeliveryNotice.addressLongitude;

						this.clipboardText = JSON.stringify({
							orderUUID: orderUUID,
							businessScope: 'AE',
							orgUuid: this.orderDeliveryNotice.orgUuid
						})
						for (let orderDeliveryNoticeKey in this.orderDeliveryNotice) {
							if ((this.orderDeliveryNotice[orderDeliveryNoticeKey] || "").toString().length > 0) {
								this.orderDeliveryNoticeClass[orderDeliveryNoticeKey] = "delivery-notice-underline";
							} else {
								this.orderDeliveryNoticeClass[orderDeliveryNoticeKey] = "delivery-notice-underline-empty";
								this.orderDeliveryNotice[orderDeliveryNoticeKey] = '________';
							}
						}
						if (this.orderDeliveryNotice.consignee != "________") {
							this.orderDeliveryNoticeClass.consignee += " margin-left";
							//接收人换行
							this.orderDeliveryNotice.consignee = (this.orderDeliveryNotice.consignee || "").replace("\n", '<br />');
						}
					} else {
						this.openError(response.data.messageInfo || "数据获取失败");
					}
				}.bind(this))
		}
	}
</script>
<style>
	.order-delivery-notice-external .left-shift-two-word {
		text-indent: 2em;
		letter-spacing: 2px;
	}

	/*大于或等于768*/
	@media(min-width: 768px) {
		.order-delivery-notice-external .delivery-notice-content {
			line-height: 30px;
		}
	}

	/*小设备*/
	@media(max-width: 768px) {
		.order-delivery-notice-external .delivery-notice-content {
			line-height: 24px;
		}

		.order-delivery-notice-external {
			margin-top: -55px;
		}

		.order-delivery-notice-external .el-image__inner {
			margin-bottom: 20px;
		}
	}

	.order-delivery-notice-external .delivery-notice-underline {
		text-decoration: underline;
		padding: 0px 5px;
		font-weight: bold;
	}

	.order-delivery-notice-external .delivery-notice-underline-empty {
		letter-spacing: 0px;
	}

	.order-delivery-notice-external .margin-left {
		text-indent: 0;
		margin-left: 45px;
	}
</style>
