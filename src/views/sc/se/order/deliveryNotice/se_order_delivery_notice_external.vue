<template>
	<div class="se-order-delivery-notice-external">
		<el-row type="flex" justify="center" align="center" v-if="map.center.lat && map.center.lng">
			<el-col :sm="12" :xs="23">
				<div v-if="showImage">
					<el-image :src="orgLogo" style="width: 200px" />
				</div>
				<div style="float: right;">
					<vue-qr :text="clipboardText" :size="150"></vue-qr>
				</div>
				<div style="text-align: center;margin: 0 auto;width: 100px;">
					<h3 style="font-size: 18px;">送货通知</h3>
				</div>
				<div class="delivery-notice-content">
					<p>
						尊敬的客户，您好：
					</p>
					<div class="left-shift-two-word">
						<p>
							贵司委托我司出运至<span class="delivery-notice-underline">{{orderDeliveryNotice.arrivalStation}}</span>
						</p>
						<p>箱型：<span class="delivery-notice-underline">{{orderDeliveryNotice.containerList}}</span></p>
						<p>件数：<span class="delivery-notice-underline">{{orderDeliveryNotice.planPieces}}</span></p>
						<p>毛重：<span class="delivery-notice-underline">{{orderDeliveryNotice.planWeight}} KG</span></p>
						<p>体积：<span class="delivery-notice-underline">{{orderDeliveryNotice.planVolume}} CMB</span></p>
						<p>
							进仓编号为<span class="delivery-notice-underline">{{orderDeliveryNotice.orderCode}}</span>
						</p>
						<p>现告知订舱，入货资料：</p>
						<p class='margin-left'>VES/VOY(船名航次)：<span class="delivery-notice-underline">{{orderDeliveryNotice.shipName}} / {{orderDeliveryNotice.shipVoyageNumber}}</span></p>
						<p class='margin-left'>MBL NO(主提单号)：<span class="delivery-notice-underline">{{orderDeliveryNotice.mblNumber}}</span></p>
						<p class='margin-left'>HBL NO(提单号)：<span class="delivery-notice-underline">{{orderDeliveryNotice.hblNumber}}</span></p>
						<p class='margin-left'>VESSEL SCHEDULE(船期)：</p>
						<p>入货地点：<span class="delivery-notice-underline">{{orderDeliveryNotice.containerLoadAddressCn}}</span></p>
						<p>
							接货联系人：
						</p>
						<p class="delivery-notice-underline margin-left">
							{{orderDeliveryNotice.warehouseContactRemark}}
						</p>
						<p :class="phone_number">
							<span>{{orderDeliveryNotice.userName}}</span>&emsp;
							<span>{{orderDeliveryNotice.phoneNumber}}</span>
						</p>
						<p>截单日(截单信息包括箱封号，准确件重尺)：<span class="delivery-notice-underline">{{orderDeliveryNotice.documentOffDate}}</span></p>
						<p>截关日(包括通关时间)：<span class="delivery-notice-underline">{{orderDeliveryNotice.customsClosingDate}}</span></p>
						<p>
							导航关键字：<span class="delivery-notice-underline">{{orderDeliveryNotice.warehouseAddressGps}}</span>
						</p>
					</div>
				</div>
				<div style="margin:0 auto;width: 100px;text-align: center;">
					<el-button @click="jumpToMap()" size="medium" type="primary" style="font-size:18px;">导航</el-button>
				</div>
				<div style="margin-top: 24px">
					<div>
						<baidu-map :center="map.center" @ready="handlerBaiduMap" :zoom="map.zoom" style="width: 100%;height: 333px" :scroll-wheel-zoom="true">
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
				mapUrlTmpl: '',
				mapUrl: '',
				orgLogo: '',
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

				},
				orderDeliveryNoticeClass: {

				},
				content: {
					imgUrl: '',
					address: '',
					phone: '',
					introduction: '',
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

			let orderUUID = this.$route.query['o'];
			if (!orderUUID) {
				this.openError("未获取到查询相关信息");
				return;
			}
			orderUUID = orderUUID.substring(2);
			this.$axios.get("/sc/external/order/orderDeliveryNotice?o=" + orderUUID)
				.then(function(response) {
					console.log(response.data.data);
					if (0 == response.data.code) {
						this.orderDeliveryNotice = response.data.data;
						//设置图片是否显示
						// if(this.orderDeliveryNotice.orgLogo && this.orderDeliveryNotice.orgLogo.length > 0) {
						//   this.orgLogo = this.orderDeliveryNotice.orgLogo;
						//   this.showImage = true;
						// }
						this.mapUrlTmpl = "http://api.map.baidu.com/marker?zoom=14&output=html&location=" + this.orderDeliveryNotice.warehouseLatitude + "," + this.orderDeliveryNotice.warehouseLongitude + "&title=" + this.orderDeliveryNotice.warehouseAddressGps + "&content=-";
						this.mapUrl = encodeURI(this.mapUrlTmpl);

						this.map.center.lat = this.orderDeliveryNotice.warehouseLatitude;
						this.map.center.lng = this.orderDeliveryNotice.warehouseLongitude;

						this.clipboardText = JSON.stringify({
							orderUUID: orderUUID,
							businessScope: 'SE',
							orgUuid: this.orderDeliveryNotice.orgUuid
						})
					} else {
						this.openError(response.data.messageInfo || "数据获取失败");
					}
				}.bind(this))
		}
	}
</script>
<style>
	.se-order-delivery-notice-external .left-shift-two-word {
		text-indent: 2em;
		letter-spacing: 2px;
	}

	/*大于或等于768*/
	@media(min-width: 768px) {
		.se-order-delivery-notice-external .delivery-notice-content {
			line-height: 30px;
		}
	}

	/*小设备*/
	@media(max-width: 768px) {
		.se-order-delivery-notice-external .delivery-notice-content {
			line-height: 24px;
		}

		.se-order-delivery-notice-external {
			margin-top: -55px;
		}

		.se-order-delivery-notice-external .el-image__inner {
			margin-bottom: 20px;
		}

	}

	.se-order-delivery-notice-external .delivery-notice-underline {
		text-decoration: underline;
		padding: 0px 5px;
		font-weight: bold;
	}

	.se-order-delivery-notice-external .delivery-notice-underline-empty {
		letter-spacing: 0px;
	}

	.se-order-delivery-notice-external .margin-left {
		text-indent: 0;
		margin-left: 45px;
	}
</style>
