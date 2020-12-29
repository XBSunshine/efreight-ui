<template>
	<div style="background: #f2f2f2;">
		<el-row style="margin-top: 20px;">
			<el-col :span="18" style="margin-left: 20px;">
				<p style="font-size: 20px;font-weight: 600;">今日</p>
				<p style="font-size: 15px;">{{currTime}}欢迎回到efreight云平台</p>
			</el-col>
			<el-col :span="5">
				<el-col :span="8">
					<p style="font-weight:bold;font-size: 18px;color: blue;">18</p>
					<p style="font-size: 15px;">待入仓</p>
				</el-col>
				<el-col :span="8">
					<p style="font-weight:bold;font-size: 18px;color: blue;">4</p>
					<p style="font-size: 15px;">待发送</p>
				</el-col>
				<el-col :span="8">
					<p style="font-weight:bold;font-size: 18px;color: blue;">2</p>
					<p style="font-size: 15px;">待离港</p>
				</el-col>
			</el-col>
		</el-row>
		<el-row style="margin-top: 30px;height: 550px;">
			<el-col :span="17" style="background: white;height: 100%;margin-left: 15px;">
				<el-row style="margin: 10px;">
					<el-col :span="2">
						<font style="font-weight:bold;font-size: 15px;">我的常用</font>
					</el-col>
					<el-col :offset="20" :span="2">
						<el-button type="primary" size="small" @click="showedit">编辑</el-button>
					</el-col>
				</el-row>
				<el-row style="margin-left: 10px;margin-top: 20px;" v-if="hrsApplications.length!=0">HRS</el-row>
				<el-row style="margin-left: 10px;margin-top: 20px;" v-if="hrsApplications.length!=0">
					<el-col :span="4" v-for="app in hrsApplications" :key="app.id">
						<router-link :to="app.applicationPath" style="color: #409EFF;">
							<i :class="app.icon"></i>
							<el-button type="text" style="color: #409EFF;">
								{{app.applicationName}}
							</el-button>
						</router-link>
					</el-col>
				</el-row>
				<!--<el-row style="margin-left: 10px;margin-top: 20px;" v-if="hrsApplications.length>6">
					<el-col :span="4" v-for="app in hrsApplications.slice(6,12)" :key="app.id">
						<router-link :to='app.applicationPath'>
							<i :class="app.icon" style="color: #409EFF;"></i>
							<el-button type="text" style="color: #409EFF;">
								{{app.applicationName}}
							</el-button>
						</router-link>
					</el-col>
				</el-row>-->
				<el-row style="margin-left: 10px;margin-top: 20px;" v-if="prmApplications.length!=0">PRM</el-row>
				<el-row style="margin-left: 10px;margin-top: 20px;" v-if="prmApplications.length!=0">
					<el-col :span="4" v-for="app in prmApplications" :key="app.id">
						<router-link :to="app.applicationPath" style="color: #e6a23c;">
							<i :class="app.icon"></i>
							<el-button type="text" style="color: #e6a23c;">
								{{app.applicationName}}
							</el-button>
						</router-link>
					</el-col>
				</el-row>
				<el-row style="margin-left: 10px;margin-top: 20px;" v-if="afApplications.length!=0">AF</el-row>
				<el-row style="margin-left: 10px;margin-top: 20px;" v-if="afApplications.length!=0">
					<el-col :span="4" v-for="app in afApplications" :key="app.id">
						<router-link :to="app.applicationPath" style="color: #67c23a;">
							<i :class="app.icon"></i>
							<el-button type="text" style="color: #67c23a;">
								{{app.applicationName}}
							</el-button>
						</router-link>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="6" style="margin-left: 20px;width:25%;height: 100%;">
				<el-row style="background: white;height: 50%;">
					<el-col :span="24">
						<el-row style="margin: 10px;">
							<font style="font-weight:bold;font-size: 15px;">公告通知</font>
						</el-row>
						<el-row style="margin: 10px;">
							<div id="noticeId" style="overflow-y:auto;height:202px;" @mouseover="stopNoticeInterval" @mouseout="startNoticeInterval">
								<el-collapse accordion>
									<el-collapse-item :key="item.noticeId" v-for="item in noticeData" :title="item.noticeTitle+'  -发布时间：'+item.createTime">
										<div style="color: #909399;">{{item.noticeText}}</div>
									</el-collapse-item>
								</el-collapse>
							</div>
						</el-row>
					</el-col>
				</el-row>
				<el-row style="margin-top: 20px;background: white;height: 46.3%;">
					<el-col :span="24">
						<el-row style="margin: 10px;">
							<font style="font-weight:bold;font-size: 15px;">版本更新</font>
						</el-row>
						<el-row style="margin: 10px;">
							<div id="versionId" style="overflow-y:auto;height:210px;" @mouseover="stopVersionInterval" @mouseout="startVersionInterval">
								<el-collapse accordion @change="versionChange">
									<el-collapse-item :key="item.versionId" v-for="item in versionData" :name="item.versionId" :title="item.versionText+'  -更新时间：'+item.versionDate">
										<div style="color: #909399;">更新记录：</div>
										<div style="color: #909399;" v-for="(record,index) in versionRecords">{{index+1}}.更新记录类型：{{record.updateType}},更新记录内容：{{record.updateText}}</div>
									</el-collapse-item>
								</el-collapse>
							</div>
						</el-row>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<el-row style="background: white;margin-top: 20px;margin-left: 15px;width: 97.5%; height:300px;">
			<el-col :span="11" style="height:100%;">
				<div id="columnStatistics" style="width: 90%;height:100%;"></div>
			</el-col>
			<el-col :span="2" style="height:100%;" align="center">
				<el-divider direction="vertical"></el-divider>
			</el-col>
			<el-col :span="11" style="height:100%;">
				<div id="pancakeStatistics" style="width: 90%;height:100%;"></div>
			</el-col>
		</el-row>
		<page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible"></page-edit>
	</div>
</template>
<style>
	.el-divider--vertical {
		height: 100% !important
	}
	
	.el-collapse-item__header {
		line-height: 20px !important
	}
</style>
<script>
	import edit from './dashboard/dashboard_edit'
	import echarts from 'echarts'
	export default {
		name: 'dashboard',
		data() {
			return {
				chartColumn: null,
				chartBar: null,
				versionData: [],
				noticeData: [],
				versionRecords: [],
				prmApplications: [],
				hrsApplications: [],
				afApplications: [],
				noticeInterval: null,
				versionInterval: null,
				currTimeInterval: null,
				editVisible: false,
				currTime: ""
			}
		},
		components: {
			'page-edit': edit
		},
		provide() {
			return {
				findApplication: this.findApplication
			}
		},
		methods: {
			showedit() {
				this.editVisible = true;
			},
			drawChart() {
				// 基于准备好的dom，初始化echarts实例
				let myChart1 = this.$echarts.init(document.getElementById("columnStatistics"));
				let myChart2 = this.$echarts.init(document.getElementById("pancakeStatistics"));

				let colors = ['#5793f3', '#d14a61', '#675bba'];

				let option1 = {
					color: colors,

					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						}
					},
					grid: {
						right: '20%'
					},
					toolbox: {
						feature: {
							dataView: {
								show: true,
								readOnly: false
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					legend: {
						data: ['蒸发量', '降水量', '平均温度']
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
						},
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					}],
					yAxis: [{
							type: 'value',
							name: '蒸发量',
							min: 0,
							max: 250,
							position: 'right',
							axisLine: {
								lineStyle: {
									color: colors[0]
								}
							},
							axisLabel: {
								formatter: '{value} ml'
							}
						},
						{
							type: 'value',
							name: '降水量',
							min: 0,
							max: 250,
							position: 'right',
							offset: 80,
							axisLine: {
								lineStyle: {
									color: colors[1]
								}
							},
							axisLabel: {
								formatter: '{value} ml'
							}
						},
						{
							type: 'value',
							name: '温度',
							min: 0,
							max: 25,
							position: 'left',
							axisLine: {
								lineStyle: {
									color: colors[2]
								}
							},
							axisLabel: {
								formatter: '{value} °C'
							}
						}
					],
					series: [{
							name: '蒸发量',
							type: 'bar',
							data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
						},
						{
							name: '降水量',
							type: 'bar',
							yAxisIndex: 1,
							data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
						},
						{
							name: '平均温度',
							type: 'line',
							yAxisIndex: 2,
							data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
						}
					]
				};
				let option2 = {
					title: {
						text: '南丁格尔玫瑰图',
						subtext: '纯属虚构',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						x: 'center',
						y: 'bottom',
						data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
					},
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: true
							},
							dataView: {
								show: true,
								readOnly: false
							},
							magicType: {
								show: true,
								type: ['pie', 'funnel']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: true,
					series: [{
							name: '半径模式',
							type: 'pie',
							radius: [20, 110],
							center: ['25%', '50%'],
							roseType: 'radius',
							label: {
								normal: {
									show: false
								},
								emphasis: {
									show: true
								}
							},
							lableLine: {
								normal: {
									show: false
								},
								emphasis: {
									show: true
								}
							},
							data: [{
									value: 10,
									name: 'rose1'
								},
								{
									value: 5,
									name: 'rose2'
								},
								{
									value: 15,
									name: 'rose3'
								},
								{
									value: 25,
									name: 'rose4'
								},
								{
									value: 20,
									name: 'rose5'
								},
								{
									value: 35,
									name: 'rose6'
								},
								{
									value: 30,
									name: 'rose7'
								},
								{
									value: 40,
									name: 'rose8'
								}
							]
						},
						{
							name: '面积模式',
							type: 'pie',
							radius: [30, 110],
							center: ['75%', '50%'],
							roseType: 'area',
							data: [{
									value: 10,
									name: 'rose1'
								},
								{
									value: 5,
									name: 'rose2'
								},
								{
									value: 15,
									name: 'rose3'
								},
								{
									value: 25,
									name: 'rose4'
								},
								{
									value: 20,
									name: 'rose5'
								},
								{
									value: 35,
									name: 'rose6'
								},
								{
									value: 30,
									name: 'rose7'
								},
								{
									value: 40,
									name: 'rose8'
								}
							]
						}
					]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart1.setOption(option1);
				myChart2.setOption(option2);

			},
			currTimeShow() {
				var myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1;
				let day = myDate.getDate();
				let dayOfWeek = this.getWeek(myDate.getDay());
				let hour = myDate.getHours();
				let minutes = myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes();
				let second = myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();
				this.currTime = year + "年" + month + "月" + day + "日  " + hour + ":" + minutes + ":" + second + " 星期" + dayOfWeek + "，"
			},
			getWeek(dayOfWeek) {
				let day;
				switch(dayOfWeek) {
					case 0:
						day = "日";
						break;
					case 1:
						day = "一";
						break;
					case 2:
						day = "二";
						break;
					case 3:
						day = "三";
						break;
					case 4:
						day = "四";
						break;
					case 5:
						day = "五";
						break;
					case 6:
						day = "六";
						break;
				}
				return day;
			},
			resetStart(element) {
				element.scrollTop += 2
				let viewHeight = element.clientHeight;
				let contentHeight = element.scrollHeight;
				let scrollHeight = element.scrollTop;
				if(contentHeight - viewHeight <= scrollHeight + 2) {
					element.scrollTop = 0;
				}
			},
			startNoticeInterval() {
				this.noticeInterval = setInterval(() => {
					let element = document.getElementById("noticeId");
					this.resetStart(element);
				}, 150);
			},
			stopNoticeInterval() {
				clearInterval(this.noticeInterval)
			},
			startVersionInterval() {
				this.versionInterval = setInterval(() => {
					let element = document.getElementById("versionId");
					this.resetStart(element);
				}, 150);
			},
			stopVersionInterval() {
				clearInterval(this.versionInterval)
			},
			startCurrTimeInterval() {
				this.currTimeInterval = setInterval(() => {
					this.currTimeShow();
				}, 1000);
			},
			stopCurrTimeInterval() {
				clearInterval(this.currTimeInterval)
			},
			init() {
				this.$axios.get("/hrs/notice").then((response) => {
					if(response.data.code == 0) {
						this.noticeData = response.data.data;
					}
				}).catch((error) => {})
				this.$axios.get("/hrs/version/list").then((response) => {
					if(response.data.code == 0) {
						this.versionData = response.data.data;
					}
				}).catch((error) => {})
				this.findApplication();
			},
			findApplication() {
				this.$axios.get("/hrs/home?type=af").then((response) => {
					if(response.data.code == 0) {
						this.afApplications = response.data.data;
					}
				}).catch((error) => {})
				this.$axios.get("/hrs/home?type=prm").then((response) => {
					if(response.data.code == 0) {
						this.prmApplications = response.data.data;
					}
				}).catch((error) => {})
				this.$axios.get("/hrs/home?type=hrs").then((response) => {
					if(response.data.code == 0) {
						this.hrsApplications = response.data.data;
					}
				}).catch((error) => {})
			},
			versionChange(id) {
				console.log(id)
				this.versionRecords = []
				if(id) {
					this.$axios.get("/hrs/version/recordlist/" + id).then((response) => {
						if(response.data.code == 0) {
							this.versionRecords = response.data.data;
						}
					}).catch((error) => {})
				}
			}
		},
		mounted() {
			this.init();
			this.drawChart();
			this.startNoticeInterval();
			this.startVersionInterval();
			this.startCurrTimeInterval();
		},
		destroyed() {
			this.stopNoticeInterval()
			this.stopVersionInterval()
			this.stopCurrTimeInterval()
		}
	}
</script>