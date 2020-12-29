<template>
	<iframe id="iframeView" :src="src" frameBorder="0" width="100%" ref="iframe"></iframe>
</template>
<style type="text/css">

</style>
<script type="text/javascript">
	export default {
		data() {
			return {
				src: ''
			}
		},
		methods: {
			calculateHeight: function() {
				let height = document.getElementsByClassName("content-container")[0].clientHeight - 20 - 4;
				let iframe = document.getElementById("iframeView");
				iframe.height = height + 'px';
			},
			receiveMessage(event) {
				if (!!event.data && event.data.key == 'create-yctop-order') {
					//判断当前签约公司是否已配置四个友舱分公司数据信息
					this.$axios.get("/afbase/orderInquiry/getFourYCWhenInquiry").then((response)=>{
						if(response.data.code==0&&response.data.data){
							this.$router.push({
								path: '/af_order_inquiry',
								query: {
									flag: true,
									name: 'saveCallBackForYC',
									departure: event.data.departure,
									destination: event.data.destination,
									grossWeight: event.data.grossWeight,
									pieces: event.data.pieces,
									volume: event.data.volume,
									flightDate: event.data.flightDate,
									airline: event.data.airline
								}
							})
						}else{
							this.$confirm('您好，是否创建询盘代理 “友舱分公司” ？', '提示', {
								confirmButtonText: '是',
								cancelButtonText: '否',
								type: 'warning',
								center: true
							}).then(() => {
								this.$axios.post('/afbase/orderInquiry/createFourYCWhenInquiry').then((response)=>{
									if(response.data.code==0){
										this.openSuccess("保存成功！")
										this.$router.push({
											path: '/af_order_inquiry',
											query: {
												flag: true,
												name: 'saveCallBackForYC',
												departure: event.data.departure,
												destination: event.data.destination,
												grossWeight: event.data.grossWeight,
												pieces: event.data.pieces,
												volume: event.data.volume,
												flightDate: event.data.flightDate,
												airline: event.data.airline
											}
										})
									}else{
										this.openError(response.data.messageInfo)
									}
								}).catch((error)=>{
									this.openError(error.response.data.messageInfo)
								})
							}).catch(() => {
								this.$router.push({
									path: '/af_order_inquiry',
									query: {
										flag: true,
										name: 'saveCallBackForYC',
										departure: event.data.departure,
										destination: event.data.destination,
										grossWeight: event.data.grossWeight,
										pieces: event.data.pieces,
										volume: event.data.volume,
										flightDate: event.data.flightDate,
										airline: event.data.airline
									}
								})
							})
						}
					})
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
			}
		},
		mounted() {
			window.addEventListener("message", this.receiveMessage, false)
			let t = this.$route.query['t'] || "",
				f = this.$route.query['f'] || "";
			if (window.location.host == 'tom.efreight.cn') {
				this.src = 'http://new.yctop.com/product/query?yunModel=true&departure=' + f + "&destination=" + t
			} else {
				this.src = 'http://dev.yctop.com/product/query?yunModel=true&departure=' + f + "&destination=" + t
			}
			this.calculateHeight();
			window.onresize = function() {
				let iframe = document.getElementById("iframeView");
				if (iframe != null && iframe != undefined) {
					let height = document.getElementsByClassName("content-container")[0].clientHeight - 20 - 4;
					iframe.height = height + 'px';
				}
			}
		},
		destroyed() {
			window.removeEventListener("message", this.receiveMessage, false)
		}
	}
</script>
