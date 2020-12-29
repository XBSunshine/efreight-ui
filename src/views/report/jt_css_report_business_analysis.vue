<template>
	<div class="warp-main" style="background-color:#f1f1f1">
		<el-row v-loading="loading" element-loading-text="拼命加载中">
			<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" class="orderListPage">
					<div>
						<el-row style="left:-10px;">
							<el-col class="elementWidth">
								<el-form-item label="" label-width="10px">
									<el-input style="width:172px;">
										<template slot="prepend">业务范畴</template>
										<el-select slot="suffix" v-model="query.businessScope" @change="businessScopeChange" style="width:103px;margin-right: -5px;">
											<el-option v-for="item in options" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:177px;">
										<template slot="prepend">统计单位</template>
										<el-select slot="suffix" v-model="query.orderUnit" placeholder="请选择" style="width:108px;margin-right: -5px;" @change="filedChange">
											<el-option label="天" value="天"></el-option>
											<el-option label="周" value="周"></el-option>
											<el-option label="月" value="月"></el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:208px;">
										<template slot="prepend">统计周期</template>
										<el-date-picker slot="suffix" v-model="query.flightDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 139px;margin-right: -5px;" @change="filedChange">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker v-model="query.flightDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;" @change="filedChange">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
									<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
									<el-button type="primary" size="small" v-on:click="querySettleList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row v-show="showFlag" style="left:-10px;">
							<el-col class="elementWidth">
								<el-form-item label="" label-width="10px">
									<el-input style="width:172px;">
										<template slot="prepend">统计口径</template>
										<el-select slot="suffix" v-model="query.caliber" style="width:103px;margin-right: -5px;">
											<el-option v-for="item in calibers" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:177px;">
										<template slot="prepend">财务锁账</template>
										<el-select slot="suffix" clearable v-model="query.orderStatus" placeholder="请选择" style="width:108px;margin-right: -5px;">
											<el-option label="已锁账" value="财务锁账"></el-option>
											<el-option label="未锁账" value="未锁账"></el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="query.businessScope=='AE'">
								<el-form-item label="" label-width="10px">
									<el-input style="width:172px;">
										<template slot="prepend">服务产品</template>
										<el-select slot="suffix" clearable v-model="query.businessProduct" style="width:103px;margin-right: -5px;">
											<el-option v-for="item in businessProducts" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="query.businessScope=='SE'||query.businessScope=='SI' ||query.businessScope=='TE'">
								<el-form-item label="" label-width="10px">
									<el-input style="width:172px;">
										<template slot="prepend">装箱方式</template>
										<el-select slot="suffix" v-model="query.containerMethod" style="width:103px;margin-right: -5px;">
											<el-option v-for="(item,index) in containerMethods" :key="index" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="query.businessScope=='AE'">
								<el-form-item label="" label-width="10px">
									<el-input style="width:172px;">
										<template slot="prepend">运单来源</template>
										<el-select slot="suffix" clearable v-model="query.awbFromType" style="width:103px;margin-right: -5px;">
											<el-option v-for="item in awbFroms" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>

						</el-row>
            <el-row v-show="showFlag">
              <el-col class="elementWidth">
              	<el-form-item label-width="10px">
              		<el-input style="width:510px;">
              			<template slot="prepend">分公司&emsp;</template>
              			<el-select slot="suffix" v-model="query.otherOrg" filterable placeholder="请选择"  style="width: 442px;margin-right: -5px">
              				<el-option v-for="item in otherOrgs" :key="item.orgId" :label="item.orgName" :value="item.orgId">
              				</el-option>
              			</el-select>
              		</el-input>
              	</el-form-item>
              </el-col>
            </el-row>

          </div>
				</el-form>
			</el-col>
		</el-row>

		<el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-left: 10px;margin-top: 7px; background-color:#FFFFFF;width:1135px">
			<el-tab-pane label="图表" name="editTab">

				<!-- <el-card >
              <template v-if="this.is1360">
                <div id="chartArea" style="margin-left: -5%;width: 100%; height: 270px;" ></div>
              </template>
              <template v-else> -->
				<div id="chartArea" style="background-color:#FFFFFF;width: 100%; height:270px;top: -5px;"></div>
				<!-- </template>
            </el-card> -->

			</el-tab-pane>
			<el-tab-pane label="数据" name="fileTab">

				<el-table :data="data1" max-height="700px" :header-cell-style="{background:'#FAFAFA'}">
					<el-table-column fixed width="120">
						<template slot="header" slot-scope="scope">
						</template>
						<template slot-scope="scope" style="margin-left: 10px">
							<span>&nbsp;&nbsp;{{scope.row.name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="totalNum" label="合计" width="120"></el-table-column>
					<el-table-column align="center" width="120" v-for="(key,index) in filedMap" :key="index">
						<template slot="header" slot-scope="scope">
							<span v-if="query.orderUnit=='天'">{{key.value}}<br></span>
							<span>{{key.key}}</span>
						</template>
						<template slot-scope="scope">
							<span>{{scope.row[key.key]}}</span>
						</template>
					</el-table-column>
				</el-table>

			</el-tab-pane>
		</el-tabs>



		<!-- <el-row style="margin-top: 5px" :gutter="5">
        <el-col :span="24"> -->

		<!-- </el-col>
      </el-row> -->
		<el-row style="margin-top: 8px;">
			<el-col class="elementWidth" style="margin-left: 10px;">
				<el-row>
					<span style="margin-left: 10px;"> TOP5&nbsp;&nbsp;客户</span>
					<el-button @click="showMessage('KH')" type="text" style="margin-left: 10px;">MORE</el-button>
				</el-row>
				<el-row style="margin-top: 8px;">
					<el-table :data="data3" max-height="700px" :header-cell-style="{background:'#FAFAFA'}">
						<el-table-column width="230">
							<template slot="header" slot-scope="scope">
								<span>&nbsp;&nbsp;客户</span>
							</template>
							<template slot-scope="scope">
								<span>&nbsp;&nbsp;{{scope.row.coopName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="orderValue" label="票数" width="130"></el-table-column>
						<el-table-column prop="totalWeight" label="标箱量" width="175" v-if="query.containerMethod=='整箱'"></el-table-column>
						<el-table-column prop="totalWeight" label="计重（吨）" width="175" v-else></el-table-column>
						<el-table-column prop="incomeAmount" label="收入(万元)" width="170"></el-table-column>
						<!-- <el-table-column prop="costAmount" label="毛利↓"  width="170"></el-table-column> -->
						<el-table-column width="170">
							<template slot="header" slot-scope="scope">
								<span style="color:#409EFF">毛利(万元)</span>
								<span style="color:#409EFF">↓</span>
							</template>
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount.split('/')[0].indexOf('-')>-1" style="color:red">{{scope.row.costAmount.split('/')[0]}}</span>
								<span v-else>{{scope.row.costAmount.split('/')[0]}}</span>
								<span>/</span>
								<span v-if="scope.row.costAmount.split('/')[1].indexOf('-')>-1" style="color:red">{{scope.row.costAmount.split('/')[1]}}</span>
								<span v-else>{{scope.row.costAmount.split('/')[1]}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="incomeAmount2" label="单公斤毛利" width="130" v-if="query.businessScope=='AE'||query.businessScope=='AI' ||query.businessScope=='LC'">
							<template slot-scope="scope">
								<span v-if="scope.row.incomeAmount2.indexOf('-')>-1" style="color:red">{{scope.row.incomeAmount2}}</span>
								<span v-else>{{scope.row.incomeAmount2}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="incomeAmount2" label="单位毛利" width="130" v-if="query.businessScope=='SE'||query.businessScope=='SI' ||query.businessScope=='TE'">
							<template slot-scope="scope">
								<span v-if="scope.row.incomeAmount2.indexOf('-')>-1" style="color:red">{{scope.row.incomeAmount2}}</span>
								<span v-else>{{scope.row.incomeAmount2}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="costAmount2" label="毛利率" width="130">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount2.indexOf('-')>-1" style="color:red">{{scope.row.costAmount2}}</span>
								<span v-else>{{scope.row.costAmount2}}</span>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-col>

		</el-row>
		<el-row style="margin-top: 8px;">
			<el-col class="elementWidth" style="margin-left: 10px;">
				<el-row>
					<span style="margin-left: 10px;"> TOP5&nbsp;&nbsp;供应商</span>
					<el-button @click="showMessage('GYS')" type="text" style="margin-left: 10px;">MORE</el-button>
				</el-row>
				<el-row style="margin-top: 8px;">
					<el-table :data="data4" max-height="700px" :header-cell-style="{background:'#FAFAFA'}">
						<el-table-column width="230">
							<template slot="header" slot-scope="scope">
								<span>&nbsp;&nbsp;供应商</span>
							</template>
							<template slot-scope="scope">
								<span>&nbsp;&nbsp;{{scope.row.coopName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="orderValue" label="票数" width="93"></el-table-column>
						<el-table-column prop="totalWeight" label="标箱量" width="100" v-if="query.containerMethod=='整箱'"></el-table-column>
						<el-table-column prop="totalWeight" label="计重（吨）" width="100" v-else></el-table-column>
						<el-table-column width="100">
							<template slot="header" slot-scope="scope">
								<span style="color:#409EFF">成本(万元)</span>
								<span style="color:#409EFF">↓</span>
							</template>
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount.indexOf('-')>-1" style="color:red">{{scope.row.costAmount}}</span>
								<span v-else>{{scope.row.costAmount}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="costAmount2" label="单公斤成本" width="100" v-if="query.businessScope=='AE'||query.businessScope=='AI' ||query.businessScope=='LC'">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount2.indexOf('-')>-1" style="color:red">{{scope.row.costAmount2}}</span>
								<span v-else>{{scope.row.costAmount2}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="costAmount2" label="单位毛利" width="100" v-if="query.businessScope=='SE'||query.businessScope=='SI' ||query.businessScope=='TE'">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount2.indexOf('-')>-1" style="color:red">{{scope.row.costAmount2}}</span>
								<span v-else>{{scope.row.costAmount2}}</span>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-col>
			<el-col class="elementWidth" style="margin-left: 20px;">
				<el-row>
					<span style="margin-left: 10px;"> TOP5&nbsp;&nbsp;航线</span>
					<el-button @click="showMessage('HX')" type="text" style="margin-left: 10px;">MORE</el-button>
				</el-row>
				<el-row style="margin-top: 8px;">
					<el-table :data="data5" max-height="700px" :header-cell-style="{background:'#FAFAFA'}">
						<el-table-column width="90">
							<template slot="header" slot-scope="scope">
								<span>&nbsp;&nbsp;航线</span>
							</template>
							<template slot-scope="scope">
								<span>&nbsp;&nbsp;{{scope.row.coopName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="orderValue" label="票数" width="90"></el-table-column>
						<el-table-column width="110" v-if="query.containerMethod=='整箱'">
							<template slot="header" slot-scope="scope">
								<span style="color:#409EFF">标箱量</span>
								<span style="color:#409EFF">↓</span>
							</template>
							<template slot-scope="scope">
								<span>{{scope.row.totalWeight}}</span>
							</template>
						</el-table-column>
						<el-table-column width="110" v-else>
							<template slot="header" slot-scope="scope">
								<span style="color:#409EFF">计重(吨)</span>
								<span style="color:#409EFF">↓</span>
							</template>
							<template slot-scope="scope">
								<span>{{scope.row.totalWeight}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="costAmount" label="成本(万元)" width="100">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount.indexOf('-')>-1" style="color:red">{{scope.row.costAmount}}</span>
								<span v-else>{{scope.row.costAmount}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="costAmount2" label="单公斤成本" width="100" v-if="query.businessScope=='AE'||query.businessScope=='AI' ||query.businessScope=='LC'">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount2.indexOf('-')>-1" style="color:red">{{scope.row.costAmount2}}</span>
								<span v-else>{{scope.row.costAmount2}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="costAmount2" label="单位毛利" width="100" v-if="query.businessScope=='SE'||query.businessScope=='SI' ||query.businessScope=='TE'">
							<template slot-scope="scope">
								<span v-if="scope.row.costAmount2.indexOf('-')>-1" style="color:red">{{scope.row.costAmount2}}</span>
								<span v-else>{{scope.row.costAmount2}}</span>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-col>

		</el-row>

	</div>
</template>
<script>
	import Echarts from 'echarts';
	export default {
		data() {
			return {
				activeName: 'editTab',
				editTab: '',
				fileTab: '',
				tableColumn: [
					// {label: '', prop: 'type', align: 'left'},
				],
				config: {
					"AE": {
						tooltip: {
							formatter: function(params) {
								return params['seriesName'] + "：" + params['value'];
							}
						},
						color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
						legend: {
							data: ['票数', '计重（吨）', '收入（万元）', '毛利（万元）'],
							left: 'right'
						},
						xAxis: {
							data: []
						},
						// yAxis: {},
						yAxis: [{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							},
							{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								splitLine: {
									show: false //是否显示分隔线。
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							}

						],
						series: [],
						grid: {
							top: 30,
							bottom: 20,
						},
					},
					"AI": {
						tooltip: {
							formatter: function(params) {
								return params['seriesName'] + "：" + params['value'];
							}
						},
						color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
						legend: {
							data: ['票数', '计重（吨）', '收入（万元）', '毛利（万元）'],
							left: 'right'
						},
						xAxis: {
							data: []
						},
						yAxis: [{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							},
							{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								splitLine: {
									show: false //是否显示分隔线。
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							}

						],
						series: [],
						grid: {
							top: 30,
							bottom: 20,
						},
					},
					"SE": {
						tooltip: {
							formatter: function(params) {
								return params['seriesName'] + "：" + params['value'];
							}
						},
						color: ['#73a4de', '#f0c686', '#00c686', '#d293e1', '#2093f1'],
						legend: {
							data: ['票数', '计重（吨）', '标箱数量', '收入（万元）', '毛利（万元）'],
							left: 'right'
						},
						xAxis: {
							data: []
						},
						yAxis: [{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							},
							{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								splitLine: {
									show: false //是否显示分隔线。
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							}

						],
						series: [],
						grid: {
							top: 30,
							bottom: 20,
						},
					},
					"SI": {
						tooltip: {
							formatter: function(params) {
								return params['seriesName'] + "：" + params['value'];
							}
						},
						color: ['#73a4de', '#f0c686', '#00c686', '#d293e1', '#2093f1'],
						legend: {
							data: ['票数', '计重（吨）', '标箱数量', '收入（万元）', '毛利（万元）'],
							left: 'right'
						},
						xAxis: {
							data: []
						},
						yAxis: [{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							},
							{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								splitLine: {
									show: false //是否显示分隔线。
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							}

						],
						series: [],
						grid: {
							top: 30,
							bottom: 20,
						},
					},
          "TE": {
              tooltip: {
                  formatter: function(params) {
                      return params['seriesName'] + "：" + params['value'];
                  }
              },
              color: ['#73a4de', '#f0c686', '#00c686', '#d293e1', '#2093f1'],
              legend: {
                  data: ['票数', '计重（吨）', '标箱数量', '收入（万元）', '毛利（万元）'],
                  left: 'right'
              },
              xAxis: {
                  data: []
              },
              yAxis: [{
                  type: 'value',
                  name: "",
                  nameLocation: "center",
                  nameGap: 35,
                  nameRotate: 0,
                  nameTextStyle: {
                      fontSize: 16,
                  },
                  //默认以千分位显示，不想用的可以在这加一段
                  axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                      show: true,
                      showMinLabel: true,
                      showMaxLabel: true,
                      formatter: function(value) {
                          return value;
                      }
                  }
              },
                  {
                      type: 'value',
                      name: "",
                      nameLocation: "center",
                      nameGap: 35,
                      nameRotate: 0,
                      nameTextStyle: {
                          fontSize: 16,
                      },
                      splitLine: {
                          show: false //是否显示分隔线。
                      },
                      //默认以千分位显示，不想用的可以在这加一段
                      axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                          show: true,
                          showMinLabel: true,
                          showMaxLabel: true,
                          formatter: function(value) {
                              return value;
                          }
                      }
                  }

              ],
              series: [],
              grid: {
                  top: 30,
                  bottom: 20,
              },
          },
					"SEE": {
						tooltip: {
							formatter: function(params) {
								return params['seriesName'] + "：" + params['value'];
							}
						},
						color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
						legend: {
							data: ['票数', '标箱数量', '收入（万元）', '毛利（万元）'],
							left: 'right'
						},
						xAxis: {
							data: []
						},
						yAxis: [{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							},
							{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								splitLine: {
									show: false //是否显示分隔线。
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							}

						],
						series: [],
						grid: {
							top: 30,
							bottom: 20,
						},
					},
					"SIE": {
						tooltip: {
							formatter: function(params) {
								return params['seriesName'] + "：" + params['value'];
							}
						},
						color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
						legend: {
							data: ['票数', '标箱数量', '收入（万元）', '毛利（万元）'],
							left: 'right'
						},
						xAxis: {
							data: []
						},
						yAxis: [{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							},
							{
								type: 'value',
								name: "",
								nameLocation: "center",
								nameGap: 35,
								nameRotate: 0,
								nameTextStyle: {
									fontSize: 16,
								},
								splitLine: {
									show: false //是否显示分隔线。
								},
								//默认以千分位显示，不想用的可以在这加一段
								axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
									show: true,
									showMinLabel: true,
									showMaxLabel: true,
									formatter: function(value) {
										return value;
									}
								}
							}

						],
						series: [],
						grid: {
							top: 30,
							bottom: 20,
						},
					},
          "TEE": {
              tooltip: {
                  formatter: function(params) {
                      return params['seriesName'] + "：" + params['value'];
                  }
              },
              color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
              legend: {
                  data: ['票数', '标箱数量', '收入（万元）', '毛利（万元）'],
                  left: 'right'
              },
              xAxis: {
                  data: []
              },
              yAxis: [{
                  type: 'value',
                  name: "",
                  nameLocation: "center",
                  nameGap: 35,
                  nameRotate: 0,
                  nameTextStyle: {
                      fontSize: 16,
                  },
                  //默认以千分位显示，不想用的可以在这加一段
                  axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                      show: true,
                      showMinLabel: true,
                      showMaxLabel: true,
                      formatter: function(value) {
                          return value;
                      }
                  }
              },
                  {
                      type: 'value',
                      name: "",
                      nameLocation: "center",
                      nameGap: 35,
                      nameRotate: 0,
                      nameTextStyle: {
                          fontSize: 16,
                      },
                      splitLine: {
                          show: false //是否显示分隔线。
                      },
                      //默认以千分位显示，不想用的可以在这加一段
                      axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                          show: true,
                          showMinLabel: true,
                          showMaxLabel: true,
                          formatter: function(value) {
                              return value;
                          }
                      }
                  }

              ],
              series: [],
              grid: {
                  top: 30,
                  bottom: 20,
              },
          },
          "LC": {
              tooltip: {
                  formatter: function(params) {
                      return params['seriesName'] + "：" + params['value'];
                  }
              },
              color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
              legend: {
                  data: ['票数', '计重（吨）', '收入（万元）', '毛利（万元）'],
                  left: 'right'
              },
              xAxis: {
                  data: []
              },
              // yAxis: {},
              yAxis: [{
                  type: 'value',
                  name: "",
                  nameLocation: "center",
                  nameGap: 35,
                  nameRotate: 0,
                  nameTextStyle: {
                      fontSize: 16,
                  },
                  //默认以千分位显示，不想用的可以在这加一段
                  axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                      show: true,
                      showMinLabel: true,
                      showMaxLabel: true,
                      formatter: function(value) {
                          return value;
                      }
                  }
              },
                  {
                      type: 'value',
                      name: "",
                      nameLocation: "center",
                      nameGap: 35,
                      nameRotate: 0,
                      nameTextStyle: {
                          fontSize: 16,
                      },
                      splitLine: {
                          show: false //是否显示分隔线。
                      },
                      //默认以千分位显示，不想用的可以在这加一段
                      axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                          show: true,
                          showMinLabel: true,
                          showMaxLabel: true,
                          formatter: function(value) {
                              return value;
                          }
                      }
                  }

              ],
              series: [],
              grid: {
                  top: 30,
                  bottom: 20,
              },
          },
          "IO": {
              tooltip: {
                  formatter: function(params) {
                      return params['seriesName'] + "：" + params['value'];
                  }
              },
              color: ['#73a4de', '#f0c686', '#d293e1', '#2093f1'],
              legend: {
                  data: ['票数', '计重（吨）', '收入（万元）', '毛利（万元）'],
                  left: 'right'
              },
              xAxis: {
                  data: []
              },
              // yAxis: {},
              yAxis: [{
                  type: 'value',
                  name: "",
                  nameLocation: "center",
                  nameGap: 35,
                  nameRotate: 0,
                  nameTextStyle: {
                      fontSize: 16,
                  },
                  //默认以千分位显示，不想用的可以在这加一段
                  axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                      show: true,
                      showMinLabel: true,
                      showMaxLabel: true,
                      formatter: function(value) {
                          return value;
                      }
                  }
              },
                  {
                      type: 'value',
                      name: "",
                      nameLocation: "center",
                      nameGap: 35,
                      nameRotate: 0,
                      nameTextStyle: {
                          fontSize: 16,
                      },
                      splitLine: {
                          show: false //是否显示分隔线。
                      },
                      //默认以千分位显示，不想用的可以在这加一段
                      axisLabel: { //调整左侧Y轴刻度， 直接按对应数据显示
                          show: true,
                          showMinLabel: true,
                          showMaxLabel: true,
                          formatter: function(value) {
                              return value;
                          }
                      }
                  }

              ],
              series: [],
              grid: {
                  top: 30,
                  bottom: 20,
              },
          },
				},
				is1360: false,
				chart: null,
				loading: false,
				showFlag: false,
				businessScopeFlag: true,
				businessScopeFlag2: true,
				exportButtonFlag: false,
				financialDateFlag: false,
				trackVisible: false,
				viewVisible: false,
				queryFlag1: true,
				queryFlag2: true,
				queryFlag3: true,
				queryFlag4: true,
				options: [],
				awbFroms: [],
				businessProducts: [],
				containerMethods: [],
        otherOrgs:[],
				goodsTypes: [],
				routingNames: [],
				calibers: [{
						label: '开航日期',
						value: '开航日'
					},
					{
						label: '财务日期',
						value: '财务日'
					}
				],
				filedMap: [],
				data1: [],
				data2: [],
				data3: [],
				data4: [],
				data5: [],
				query: {
					businessScope: "AE",
					orderUnit: "月",
					flightDateStart: "",
					flightDateEnd: "",

					caliber: "开航日",
					orderStatus: "",
					businessProduct: "",
					containerMethod: "",
					awbFromType: "",
          otherOrg:-1
				}
			}
		},

		created: function() {
      let param ={
         checkJt:'jt'
      }
      //分公司集合
      this.$axios.get2('/hrs/org/getOrgChild',param).then((response) => {
      	  if(response.data.data&&response.data.data.length>0){
            this.otherOrgs=response.data.data;
            this.otherOrgs.unshift(
            {
              orgId:-1,
              orgName:'全部'
            }
            );
          }else{
             this.otherOrgs.unshift(
             {
               orgId:-1,
               orgName:'全部'
             }
             );
          }
      })
			// this.checkVue(this.activeName);
			this.is1360 = (window.screen.width == 1360 || window.screen.width == 1366) ? true : false;

     let a = this.$route.query.o;
      if(a){
        let b = JSON.parse(this.base64Decode(a));
        this.query.flightDateStart = b.flightDateStart;
        this.query.flightDateEnd = b.flightDateEnd;
        this.query.businessScope = b.businessScope;
        this.query.orderUnit = b.orderUnit;
        this.businessScopeChange();
      }else{
        this.query.flightDateStart = this.getDateTime(new Date());
        this.query.flightDateEnd = this.getDateTime2(new Date());
      }
			let date1 = new Date(this.query.flightDateStart);
			let date2 = new Date(this.query.flightDateEnd);
      this.filedChange();
			// alert(date1.toDateString().split(" ")[1]);
/*			for (let i = date1; date1 <= date2;) {
				let month = date1.getMonth() + 1;
				let day = date1.getDate();
				let days = this.getDays(date1.getDay());
				if (month < 10) {
					month = "0" + month;
				}
				if (day < 10) {
					day = "0" + day;
				}
				let year = date1.getFullYear();

				 this.filedMap.push({key:year+"/"+month});
				 console.log(this.filedMap)
				/!*this.filedMap.push({
					key: (date1.toDateString().split(" ")[1]).toUpperCase() + " " + day,
					value: days
				});*!/
				date1.setDate(date1.getDate() + 1);
			}*/
			// let year = new Date().getFullYear();
			// this.filedMap=[
			//   {
			//     key:year+'-01'
			//   },
			//   {
			//     key:year+'-02'
			//   },
			//   {
			//     key:year+'-03'
			//   },
			//   {
			//     key:year+'-04'
			//   },
			//   {
			//     key:year+'-05'
			//   },
			//   {
			//     key:year+'-06'
			//   },
			//   {
			//     key:year+'-07'
			//   },
			//   {
			//     key:year+'-08'
			//   },
			//   {
			//     key:year+'-09'
			//   },
			//   {
			//     key:year+'-10'
			//   },
			//   {
			//     key:year+'-11'
			//   },
			//   {
			//     key:year+'-12'
			//   }
			//   ]
			//业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.options = response.data.data;

			}.bind(this)).catch(function(error) {

			})
			//运单来源
			this.$axios.get('/afbase/awb/selectCategory?category=运单所属').then(function(response) {
				this.awbFroms = response.data.data;
			}.bind(this));

			//服务产品
			this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
				this.businessProducts = response.data.data;
			}.bind(this));
			this.$axios.get('/sc/vScCategory/装箱方式').then((response) => {
				this.containerMethods = response.data.data;
			})
      if(a){
         //如果是首页跳转进来的 默认查询数据
         this.querySettleList();
      }
		},

		methods: {
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openError1(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			showMessage(val) {
        //赋值条件
        let param = {
          orderStatus: this.query.orderStatus,
          businessProduct:this.query.businessProduct,
          containerMethod:this.query.containerMethod,
          countType:this.query.caliber+'期',
          businessScope: this.query.businessScope,
          startDate: this.query.flightDateStart,
          endDate:this.query.flightDateEnd
        }
				if (val == 'KH') {
           this.$router.push('/jt_css_p_report_customer_contribution?o='+this.base64Encode(JSON.stringify(param)))
				}else if(val == 'GYS'){
           this.$router.push('/jt_css_report_supplier_procurement?o='+this.base64Encode(JSON.stringify(param)))
        }else if(val == 'HX'){
          if(this.query.orderStatus){
             param.orderStatus = this.query.orderStatus=='已锁账'?'是':'否';
          }
           param.endDateType = 'DAY';
           param.coopId = null;
           param.customerName = null;
           this.$router.push('/jt_customer_info_menu?name=more&flag=true&frow='+this.base64Encode(JSON.stringify(param)))
        } else {
					this.openError1("功能暂未开通，敬请期待");
				}
			},
			filedChange() {
				if (!this.query.flightDateStart) {
					this.openError("请选择开始日期");
				}
				if (!this.query.flightDateEnd) {
					this.openError("请选择结束日期");
				}
				this.filedMap = [];
				this.data1 = [];
				let date1 = new Date(this.query.flightDateStart);
				let date2 = new Date(this.query.flightDateEnd);
				if (date1 > date2) {
					this.openError("开始日期必须小于结束日期");
					this.queryFlag1 = false;
					return;
				} else {
					this.queryFlag1 = true;
				}
				if (this.query.orderUnit == "月") {
					let flag = 0
					let date3 = new Date(this.query.flightDateStart);
					for (let i = date3; date3 <= date2;) {
						flag = flag + 1;
						date3.setMonth(date3.getMonth() + 1);
					}
					if (flag > 12) {
						this.openError("按月统计不能超过12个月");
						this.queryFlag2 = false;
						return;
					} else {
						this.queryFlag2 = true;
					}

					for (let i = date1; date1 <= date2;) {
						let month = date1.getMonth() + 1;
						if (month < 10) {
							month = "0" + month;
						}
						let year = date1.getFullYear();
						let flag = 0;
						for (let j = 0; j < this.filedMap.length; j++) {
							if ((year + "/" + month) == this.filedMap[j].key) {
								flag = 1;
								break;
							}
						}
						if (flag == 0) {
							this.filedMap.push({
								key: year + "/" + month
							});
						}
						// this.filedMap.push({key:year+"-"+month});
						// date1.setMonth(date1.getMonth()+1);
						date1.setDate(date1.getDate() + 1);
					}
				} else if (this.query.orderUnit == "天") {
					let flag = 0
					let date3 = new Date(this.query.flightDateStart);
					for (let i = date3; date3 <= date2;) {
						flag = flag + 1;
						date3.setDate(date3.getDate() + 1);
					}
					if (flag > 31) {
						this.openError("按天统计不能超过31天");
						this.queryFlag3 = false;
						return;
					} else {
						this.queryFlag3 = true;
					}
					for (let i = date1; date1 <= date2;) {
						let month = date1.getMonth() + 1;
						let day = date1.getDate();
						let days = this.getDays(date1.getDay());
						if (month < 10) {
							month = "0" + month;
						}
						if (day < 10) {
							day = "0" + day;
						}
						let year = date1.getFullYear();
						// this.filedMap.push({key:year+"/"+month+"/"+day,value:days});
						this.filedMap.push({
							key: (date1.toDateString().split(" ")[1]).toUpperCase() + " " + day,
							value: days
						});
						date1.setDate(date1.getDate() + 1);
					}
				} else {
					for (let i = date1; date1 <= date2;) {
						let weekday = this.getYearWeek(date1.getFullYear(), date1.getMonth() + 1, date1.getDate());
						if (weekday < 10) {
							weekday = "0" + weekday;
						}
						let year = date1.getFullYear();
						let flag = 0;
						for (let j = 0; j < this.filedMap.length; j++) {
							if ((year + " week" + weekday + "") == this.filedMap[j].key) {
								flag = 1;
								break;
							}
						}
						if (flag == 0) {
							this.filedMap.push({
								key: year + " week" + weekday + ""
							});
						}

						date1.setDate(date1.getDate() + 1);
					}
					let datef = new Date(this.query.flightDateStart);
					datef.setFullYear(datef.getFullYear() + 1);
					datef.setDate(datef.getDate() - 1);
					// if (this.filedMap.length>53) {
					if (datef < date2) {
						this.openError("按周统计不能超过1年");
						this.filedMap = [];
						this.queryFlag4 = false;
						return;
					} else {
						this.queryFlag4 = true;
					}
				}
				// for (let i = 0; i < this.filedMap.length; i++) {
				//   console.log(this.filedMap[i].key);
				// }
				let temp = this.filedMap
				this.filedMap = []
				this.$nextTick(() => {
					this.filedMap = temp
				})
			},
			getYearWeek(year, month, date) {
				/*
				    dateNow是当前日期
				    dateFirst是当年第一天
				    dataNumber是当前日期是今年第多少天
				    用dataNumber + 当前年的第一天的周差距的和在除以7就是本年第几周
				*/
				let dateNow = new Date(year, parseInt(month) - 1, date);
				let dateFirst = new Date(year, 0, 1);
				let dataNumber = Math.round((dateNow.valueOf() - dateFirst.valueOf()) / 86400000);
				return Math.ceil((dataNumber + ((dateFirst.getDay() + 1) - 1)) / 7);
			},
			businessScopeChange() {

				if (this.query.businessScope == 'AE' || this.query.businessScope == 'SE') {
					this.calibers = [{
							label: '开航日期',
							value: '开航日'
						},
						{
							label: '财务日期',
							value: '财务日'
						}
					]
					this.query.caliber = '开航日';
				} else if(this.query.businessScope == 'AI' || this.query.businessScope == 'SI'){
					this.calibers = [{
							label: '到港日期',
							value: '到港日'
						},
						{
							label: '财务日期',
							value: '财务日'
						}
					]
					this.query.caliber = '到港日';
				} else if(this.query.businessScope == 'TE'){
            this.calibers = [{
                label: '发车日期',
                value: '发车日'
            },
                {
                    label: '财务日期',
                    value: '财务日'
                }
            ]
            this.query.caliber = '发车日';
        } else if(this.query.businessScope == 'LC'){
            this.calibers = [{
                label: '用车日期',
                value: '用车日'
            },
                {
                    label: '财务日期',
                    value: '财务日'
                }
            ]
            this.query.caliber = '用车日';
        }else if(this.query.businessScope == 'IO'){
          this.calibers = [{
              label: '业务日期',
              value: '业务日'
          },
              {
                  label: '财务日期',
                  value: '财务日'
              }
          ]
          this.query.caliber = '业务日';
        }
				if (this.query.businessScope == 'SI' || this.query.businessScope == 'SE' || this.query.businessScope == 'TE') {
					this.query.containerMethod = "整箱";
				} else {
					this.query.containerMethod = "";
				}

			},
			chartDispose() {
				if (this.chart) {
					try {
						this.chart.dispose();
					} catch (e) {
						console.error(e)
					}
				}
			},
			//加载数据
			drawEchars(key) {
				if (!key) {
					this.openError("未获取到KEY");
					return;
				}

				let option = this.config[key];
				this.chart = Echarts.init(document.getElementById("chartArea"));
				this.chart.setOption(option);
			},
			loadData(key) {
				if (key) {
					this.setDataToPage(key);
				}
			},
			setfiledMap() {
				// for (let j = 0; j < this.filedMap.length; j++) {
				//   //alert(this.filedMap[j].key);
				// }
				for (var i = 0; i < this.data2.length; i++) {
					if ("毛利（万元）" == this.data2[i].name) {
						// Map dataM=new Map(this.data2[i]);
						for (let j = 0; j < this.filedMap.length; j++) {
							// alert(this.filedMap[j].key);
							// alert(this.data2[i].hasOwnProperty(this.filedMap[j].key))
							if (!this.data2[i].hasOwnProperty(this.filedMap[j].key)) {
								// Object.defineProperty(this.data2[i],this.filedMap[j].key,'0');
								this.data2[i][this.filedMap[j].key] = 0
							}
						}
					}
				}
			},
			setDataToPage(key) {
				if (!key) {
					throw "The method [setAirDataToPage] Not found key!";
				}
				// let data = this.cacheDataDIC[key] || [];
				// if(data.length == 0){
				//   data = this.getDefaultData(key);
				// }
				let data = this.data2;
				this.setfiledMap();
				// this.buildTable(data);

				if ((key == 'SE' || key == 'SI' || key == 'TE') && this.query.containerMethod == '整箱') {
					// if (key=='SE') {
					key = key + "E"
					this.buildCharOption(key, data);
					this.drawEchars(key);
					// }else{
					//   this.drawEchars("SIE");
					// }

				} else {
					this.buildCharOption(key, data);
					this.drawEchars(key);
				}

			},
			//表格数据
			buildTable(data) {
				let numColumn = this.buildTableColumn(data);
				let columns = [{
					label: '',
					prop: 'type'
				}];
				numColumn.forEach((column) => {
					columns.push(column);
				});
				this.tableColumn = columns;
				this.tableData = data;
			},
			//统计图数据
			buildCharOption(key, data) {
				let series = this.buildSeries(data);
				let xAxis_data = this.buildXAxis(data);
				// let xAxis_data = this.filedMap;
				this.config[key].series = series;
				this.config[key].xAxis.data = xAxis_data;
			},
			//构建统计图数据
			buildSeries(data) {
				let series = [];
				for (let index in data) {
					let item = data[index];
					// let series_item = {type: 'line'}, item = data[index];
					// let series_data = this.getSeriesData(item);
					// series_item['name'] = item['name'];
					// series_item['data'] = series_data;
					// series_item['smooth'] = true;
					if ("毛利（万元）" == item['name']) {

						let series_item = {
							type: 'line'
						};
						let series_data = this.getSeriesData(item);
						series_item['name'] = item['name'];
						series_item['data'] = series_data;
						// series_item['smooth'] = true;
						series_item['yAxisIndex'] = 1;
						// series_item['splitLine'] = {show:false};
						// series_item['position'] = 'right';
						// series_item['xAxisIndex'] = 1;
						series.push(series_item);
					} else {
						let series_item = {
							type: 'bar'
						};
						let series_data = this.getSeriesData(item);
						series_item['name'] = item['name'];
						series_item['data'] = series_data;
						// series_item['smooth'] = true;
						// series_item['xAxisIndex'] = 1;
						series_item['yAxisIndex'] = 0;
						series.push(series_item);
					}



				}
				return series;
			},
			getSeriesData(item) {
				let keys = this.getSortNumKey(item);
				let data = [];
				for (let index in keys) {
					let key = keys[index];
					data.push(item[key]);
				}
				return data;
			},
			getSortNumKey(item) {
				let keys = [];
				// for(let key in this.filedMap){
				//   if((key.key).indexOf("-") > -1){
				//     keys.push(key.key);
				//   }
				// }
				for (let j = 0; j < this.filedMap.length; j++) {
					if ((this.filedMap[j].key).indexOf("/") > -1) {
						keys.push(this.filedMap[j].key);
					}
					if ((this.filedMap[j].key).indexOf(" ") > -1) {
						keys.push(this.filedMap[j].key);
					}
				}
				// keys = keys.sort(function(e1,e2){return e2.localeCompare(e1)});
				// console.log(keys);
				return keys;
			},
			buildXAxis(data) {
				let columns = this.buildTableColumn(data);
				let labels = [];
				columns.forEach((item) => {
					// let label = item['label'].replace(/-/g, '/');
					let label = item['label'];
					labels.push(label);
				});
				return labels;
			},
			buildTableColumn(data) {
				if (data.length == 0) {
					return [];
				}
				let item = data[0];
				let keys = this.getSortNumKey(item);
				//根据num_1,num_2 .....来构建表格列
				let nowTime = new Date().getTime();
				let numTableColumn = [];
				keys.forEach((key) => {
					// let dayInterval = key.split("_")[1];
					// let intervalTime = nowTime - (dayInterval * 24 * 60 * 60 * 1000);
					// let dateLabel = this.getCurrentIntervalDate(intervalTime);
					let dateLabel = key;
					numTableColumn.push({
						label: dateLabel,
						prop: key
					});
				});
				return numTableColumn;
			},
			querySettleList() {
				if (!this.query.flightDateStart) {
					this.openError("请选择开始日期");
					return;
				}
				if (!this.query.flightDateEnd) {
					this.openError("请选择结束日期");
					return;
				}
				if (this.queryFlag1 == false) {
					this.openError("开始日期必须小于结束日期");
					return;
				}
				if (this.query.orderUnit == "月") {
					if (this.queryFlag2 == false) {
						this.openError("按月统计不能超过12个月");
						return;
					}
				} else if (this.query.orderUnit == "天") {
					if (this.queryFlag3 == false) {
						this.openError("按天统计不能超过31天");
						return;
					}
				} else {
					if (this.queryFlag4 == false) {
						this.openError("按周统计不能超过1年");
						return;
					}
				}

				this.chartDispose();
				// this.query.filedMap=this.filedMap;
				this.$axios.post('/afbase/cssReportBusinessAnalysis/page', this.query).then((response) => {
					this.data1 = response.data.data;
				}).catch(err => {})

				this.$axios.post('/afbase/cssReportBusinessAnalysis/getList2', this.query).then((response) => {
					this.data2 = response.data.data;
					this.loadData(this.query.businessScope);
				}).catch(err => {})

          this.$axios.post('/afbase/cssReportBusinessAnalysis/getList3', this.query).then((response) => {
            this.data3 = response.data.data;
          }).catch(err => {})

          this.$axios.post('/afbase/cssReportBusinessAnalysis/getList4', this.query).then((response) => {
            this.data4 = response.data.data;
          }).catch(err => {})

          this.$axios.post('/afbase/cssReportBusinessAnalysis/getList5', this.query).then((response) => {
            this.data5 = response.data.data;
          }).catch(err => {})
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.querySettleList();
			},
			//当前页改变时触发的函数
			handleCurrentChange(val) {
				this.querySettleList();
			},
			getDateTime(theDate) {
				theDate.setDate(theDate.getDate() - 6);
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-01-01";
				// return _year + "-" + _month + "-" + _date;
			},
			getDateTime2(theDate) {
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				// return _year + "-12-31";
				return _year + "-" + _month + "-" + _date;
			},
			handleClick(tab, event) {
				// this.checkVue(tab.name)
				// alert(1);
				// this.loadData(this.query.businessScope);
				if (tab.name == 'editTab') {
					this.querySettleList2();
				}
			},
			querySettleList2() {
				if (!this.query.flightDateStart) {
					this.openError("请选择开始日期");
					return;
				}
				if (!this.query.flightDateEnd) {
					this.openError("请选择结束日期");
					return;
				}
				if (this.queryFlag1 == false) {
					this.openError("开始日期必须小于结束日期");
					return;
				}
				if (this.query.orderUnit == "月") {
					if (this.queryFlag2 == false) {
						this.openError("按月统计不能超过12个月");
						return;
					}
				} else if (this.query.orderUnit == "天") {
					if (this.queryFlag3 == false) {
						this.openError("按天统计不能超过31天");
						return;
					}
				} else {
					if (this.queryFlag4 == false) {
						this.openError("按周统计不能超过1年");
						return;
					}
				}

				this.chartDispose();


				this.$axios.post('/afbase/cssReportBusinessAnalysis/getList2', this.query).then((response) => {
					this.data2 = response.data.data;
					this.loadData(this.query.businessScope);
				}).catch(err => {})

			},
			getDays(theDate) {
				let days = "";
				switch (theDate) {
					case 1:
						days = '星期一';
						break;
					case 2:
						days = '星期二';
						break;
					case 3:
						days = '星期三';
						break;
					case 4:
						days = '星期四';
						break;
					case 5:
						days = '星期五';
						break;
					case 6:
						days = '星期六';
						break;
					case 0:
						days = '星期日';
						break;
				}
				return days;
			},
      base64Encode(input) {
      	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/="
      	let output = "";
      	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      	let i = 0;
      	input = this.utf8Encode(input);
      	while (i < input.length) {
      		chr1 = input.charCodeAt(i++);
      		chr2 = input.charCodeAt(i++);
      		chr3 = input.charCodeAt(i++);
      		enc1 = chr1 >> 2;
      		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      		enc4 = chr3 & 63;
      		if (isNaN(chr2)) {
      			enc3 = enc4 = 64;
      		} else if (isNaN(chr3)) {
      			enc4 = 64;
      		}
      		output = output +
      			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
      	}
      	return output;
      },
      utf8Encode(string) {
      	string = string.replace(/\r\n/g, "\n");
      	let utftext = "";
      	for (let n = 0; n < string.length; n++) {
      		let c = string.charCodeAt(n);
      		if (c < 128) {
      			utftext += String.fromCharCode(c);
      		} else if ((c > 127) && (c < 2048)) {
      			utftext += String.fromCharCode((c >> 6) | 192);
      			utftext += String.fromCharCode((c & 63) | 128);
      		} else {
      			utftext += String.fromCharCode((c >> 12) | 224);
      			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      			utftext += String.fromCharCode((c & 63) | 128);
      		}

      	}
      	return utftext;
      },
      base64Decode(input) {
      	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/+="
      	let output = "";
      	let chr1, chr2, chr3;
      	let enc1, enc2, enc3, enc4;
      	let i = 0;
      	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      	while (i < input.length) {
      		enc1 = _keyStr.indexOf(input.charAt(i++));
      		enc2 = _keyStr.indexOf(input.charAt(i++));
      		enc3 = _keyStr.indexOf(input.charAt(i++));
      		enc4 = _keyStr.indexOf(input.charAt(i++));
      		chr1 = (enc1 << 2) | (enc2 >> 4);
      		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      		chr3 = ((enc3 & 3) << 6) | enc4;
      		output = output + String.fromCharCode(chr1);
      		if (enc3 != 64) {
      			output = output + String.fromCharCode(chr2);
      		}
      		if (enc4 != 64) {
      			output = output + String.fromCharCode(chr3);
      		}
      	}
      	output = this.utf8Decode(output);
      	return output;
      },
      utf8Decode(utftext) {
      	let string = "";
      	let i = 0
      	let c = 0
      	let c1 = 0
      	let c2 = 0
      	while (i < utftext.length) {
      		c = utftext.charCodeAt(i);
      		if (c < 128) {
      			string += String.fromCharCode(c);
      			i++;
      		} else if ((c > 191) && (c < 224)) {
      			c1 = utftext.charCodeAt(i + 1);
      			string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      			i += 2;
      		} else {
      			c1 = utftext.charCodeAt(i + 1);
      			c2 = utftext.charCodeAt(i + 2);
      			string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      			i += 3;
      		}
      	}
      	return string;
      },

		}
	}
</script>
<style type="text/css">
	.btn-custom-cancel {
		/*float: right;
    margin-left: 10px;*/
		background-color: red;
		color: white;
	}

	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.afOrderListPageCheckBox .el-checkbox__inner {
		background-color: #FFF !important;
	}

	/* .afOrderListPageCheckBox {
    margin-right: 0px !important;
  } */

	.AEOrderList .el-table__expanded-cell {
		padding: 5px 85px !important;
	}

	#tab-editTab {
		padding-left: 9px !important;
		padding-right: 8px !important;
	}

	#tab-fileTab {
		padding-left: 8px !important;
		padding-right: 9px !important;
	}
</style>
