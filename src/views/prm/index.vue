<template>
	<div class="warp-main">
		<div style="height:150px;background: -webkit-gradient(linear,left top, right top,from(white),to(#bddafd));">
			<span style="font-size:60px;font-style: italic;color:blue;">欢迎使用 PRM 商务客商资料管理系统</span>
		</div>
		<!--<el-button type="primary" icon="el-icon-edit" @click="clickShow">欢迎使用 PRM 商务客商资料管理系统</el-button>-->

		<el-carousel :interval="2000" type="card" height="360px">
			<el-carousel-item v-for="src in srcs" :key="src">
				<h3 class="medium"><el-image :src="src" fit="fill"></el-image></h3>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				srcs: [
					'http://tom.t.efreight.cn/img/air.jpg',
					'http://tom.t.efreight.cn/img/air1.jpg',
					'http://tom.t.efreight.cn/img/air2.jpg',
					'http://tom.t.efreight.cn/img/air3.jpg',
					'http://tom.t.efreight.cn/img/air4.jpg',
					'http://tom.t.efreight.cn/img/air5.jpg'
				]
			}
		}
	}
</script>
<style>
	.el-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}
</style>
