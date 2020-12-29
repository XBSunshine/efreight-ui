<template>
	<div class="warp-main">
		<el-button type="primary" icon="el-icon-edit" @click="clickShow">欢迎使用 CSS 清结算管理系统</el-button>
		<div class="block">
			<el-steps :active="active" finish-status="success" @click="next">
				<el-step title="步骤 1" icon="el-icon-edit"></el-step>
				<el-step title="步骤 2" icon="el-icon-upload"></el-step>
				<el-step title="步骤 3" icon="el-icon-picture"></el-step>
			</el-steps>
			<el-button style="margin-top: 12px;" @click="next">下一步</el-button>
		</div>
		<div class="block">
			<el-timeline>
				<el-timeline-item timestamp="2018/4/12" placement="top">
					<el-card>
						<h4>更新 Github 模板</h4>
						<p>王小虎 提交于 2018/4/12 20:46</p>
					</el-card>
				</el-timeline-item>
				<el-timeline-item timestamp="2018/4/3" placement="top">
					<el-card>
						<h4>更新 Github 模板</h4>
						<p>王小虎 提交于 2018/4/3 20:46</p>
					</el-card>
				</el-timeline-item>
				<el-timeline-item timestamp="2018/4/2" placement="top">
					<el-card>
						<h4>更新 Github 模板</h4>
						<p>王小虎 提交于 2018/4/2 20:46</p>
					</el-card>
				</el-timeline-item>
			</el-timeline>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				message: 'Hello Vue',
				active: 0
			};
		},
		methods: {
			clickShow: function() {
				alert('显示');
			},
			next() {
				if(this.active++ > 2) this.active = 0;
			}
		}
	}
</script>