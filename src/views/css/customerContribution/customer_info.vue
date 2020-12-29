<template>
	<div class="warp-main customer-info" v-loading="loading">
		<div ref="css_business_analysis_header">
			<el-form :inline="false" :model="query" label-width="10px" >
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="18px">查询条件
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="15px">
							<el-input style="width:181px;">
								<template slot="prepend">
									<font style="color: red;">*</font>业务范畴
								</template>
								<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:106px;margin-right: -5px;" @change="businessScopeChange">
									<!-- @change="businessScopeChange" -->
									<el-option v-for="item in businessCodes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">
									<font style="color: red;">*</font>统计周期
								</template>
								<el-date-picker slot="suffix" v-model="query.startDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="起" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.endDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="止" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:180px;" v-model="query.dep" @input="query.dep=toUpperCaseValue(query.dep)" auto-complete="off" clearable>
								<template slot="prepend">{{depName}}</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:180px;" v-model="query.arr" @input="query.arr=toUpperCaseValue(query.arr)" auto-complete="off" clearable>
								<template slot="prepend">{{arrName}}</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false;setHeight()">收起</el-button>
							<el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true;setHeight()">展开</el-button>
							<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 12px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="15px">
							<el-input style="width:180px;">
								<template slot="prepend">
									<font style="color: red;">*</font>统计口径
								</template>
								<el-select slot="suffix" v-model="query.countType" filterable placeholder="请选择" style="width: 106px;margin-right: -5px">
									<el-option v-if="query.businessScope=='AE'||query.businessScope=='SE'" label="开航日期" value="开航日期"></el-option>
									<el-option v-if="query.businessScope=='AI'||query.businessScope=='SI'" label="到港日期" value="到港日期"></el-option>
									<el-option v-if="query.businessScope=='TE'" label="发车日期" value="发车日期"></el-option>
									<el-option v-if="query.businessScope=='LC'" label="用车日期" value="用车日期"></el-option>
									<el-option v-if="query.businessScope=='IO'" label="业务日期" value="业务日期"></el-option>
									<el-option label="财务日期" value="财务日期"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithFourWithXing" v-model="query.customerName" style="width:358px">
								<template slot="prepend">
									<!-- <font style="color: red;">*</font> -->
									<span>客户名称</span>
								</template>
								<el-button slot="append" @click="selectCustomer" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>


					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:175px;">
								<template slot="prepend">财务锁账</template>
								<el-select slot="suffix" v-model="query.orderStatus" filterable placeholder="请选择" clearable style="width: 106px;margin-right: -5px">
									<el-option label="是" value="是"></el-option>
									<el-option label="否" value="否"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:189px;">
								<template slot="prepend">货物类型</template>
								<el-select slot="suffix" v-model="query.goodsType" filterable placeholder="请选择" clearable style="width: 120px;margin-right: -5px">
									<el-option v-if="!goodsTypeFlag" v-for="item in goodsTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
									<el-option v-if="goodsTypeFlag" v-for="item in goodsTypes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="40px">
							<!-- v-on:click="setting" -->
							<!-- v-on:click="exportExcel" -->
							<el-button style="margin-left: 7px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setColumn">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelCount">导出汇总</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出明细</el-button>
						</el-form-item>

					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="15px">
							<el-input style="width:216px;">
								<template slot="prepend">供应商类型</template>
								<el-select slot="suffix" v-model="query.coopType" filterable placeholder="请选择" style="width:133px;margin-right: -5px;" clearable>
									<el-option v-for="item in coopTypeOptions" :key="item.code" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithFourWithXing" v-model="query.supplierName" style="width:322px;margin-right: 0px;">
								<template slot="prepend">
									<span>供应商名称</span>
								</template>
								<el-button slot="append" @click="selectSupplier" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth" v-if="query.businessScope=='AE'">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">服务产品</template>
								<el-select slot="suffix" v-model="query.businessProduct" filterable placeholder="请选择" clearable style="width: 111px;margin-right: -5px">
									<el-option v-for="item in businessProducts" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope!='AE'&&query.businessScope!='AI'&&query.businessScope!='LC'&&query.businessScope!='IO'">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">
									<font style="color: red;">*</font>装箱方式
								</template>
								<el-select slot="suffix" v-model="query.containerMethod" filterable placeholder="请选择" style="width: 106px;margin-right: -5px">
									<el-option v-for="item in containerMethods" :key="item.paramText" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope=='TE' || query.businessScope=='LC'||query.businessScope=='IO'">
						<el-form-item label-width="5px">
							<el-checkbox style="float: right;margin-right: 5px;margin-bottom: 5px;" @change="setConstituteFlag" v-model="query.showConstituteFlag">显示毛利构成</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row v-show="showFlag">
					<el-col class="elementWidth" v-if="query.businessScope!='LC'&&query.businessScope!='IO'&&query.businessScope!='TE'">
						<el-form-item label-width="10px">
							<el-input style="width:160px;">
								<template slot="prepend">航线</template>
								<el-select slot="suffix" v-model="chooseRoutingNamesList" multiple filterable placeholder="请选择" clearable style="width:120px;margin-right: -5px;">
									<el-option v-for="(item,index) in routingNames" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope!='LC'&&query.businessScope!='IO'&&query.businessScope!='TE'">
						<el-form-item>
							<el-input class="widthWithFourWithXing" v-model="query.country" @input="query.country=toUpperCaseValue(query.country)" style="width:150px;margin-right: 5px;">
								<template slot="prepend">
									<span>国家</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope=='AE'||query.businessScope=='AI'">
						<el-form-item label-width="10px">
							<el-input style="width:120px;">
								<template slot="prepend">分区</template>
								<el-select slot="suffix" v-model="query.area" filterable placeholder="请选择" clearable style="width: 80px;margin-right: -5px">
									<el-option v-for="item in areas" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" v-if="query.businessScope!='TE' && query.businessScope!='LC'&&query.businessScope!='IO'">
						<el-form-item label-width="5px">
							<el-checkbox style="float: right;margin-right: 5px;margin-bottom: 5px;" @change="setConstituteFlag" v-model="query.showConstituteFlag">显示毛利构成</el-checkbox>
						</el-form-item>
					</el-col>

				</el-row>
			</el-form>
		</div>
		<p style="margin-left: 18px">统计信息</p>
		<div style="margin-left: 18px" v-loading="in_load_flag">
			<!--  -->
			<el-tabs style="margin-left: 18px;margin-top:15px" type="card" :value="activeName" @tab-click="handleCount">
				<el-tab-pane label="分析" name="countOne">
					<el-tabs style="width:1200px;" :stretch='true' class="tab-tilte" @tab-click="handleClick">
						<el-tab-pane>
							<span slot="label">
								<p>票数</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.poll}}</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.pollTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.pollTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.pollTwo)}}票</span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="piaoMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>票数</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='票数'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[1]>=0" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[1]<0" :color="customColor" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[1]>=0">{{item[1]}}</span><span v-else style="color:red">{{item[1]}}</span>票</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[1]>=0" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[1]<0" :color="customColor" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[1]>=0">{{item[1]}}</span><span v-else style="color:red">{{item[1]}}</span>票</el-col>
													</el-row>
													<!-- <p></p> -->
												</div>
												<div v-if="data.poll<=0&&tapType=='dep' && titleName=='票数'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="piaoMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>票数</h1>
												</p>
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='票数'" v-for="(item,index) in rawData">

													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[1]>=0" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[1]<0" :color="customColor" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[1]>=0">{{item[1]}}</span><span v-else style="color:red">{{item[1]}}</span>票</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[1]>=0" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[1]<0" :color="customColor" :percentage="formatPer(item[1],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[1]>=0">{{item[1]}}</span><span v-else style="color:red">{{item[1]}}</span>票</el-col>
													</el-row>
												</div>
												<div v-if="data.poll<=0&&tapType=='arr' && titleName=='票数'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>
						<el-tab-pane>
							<span slot="label">
								<p>{{titleNameTwo}}</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.planChargeWeight}}</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.planChargeWeightTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.planChargeWeightTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.planChargeWeightTwo)}}<span v-if="(query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE')&&query.containerMethod=='整箱'">箱</span><span v-else>吨</span></span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="huoliangMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:auto; height: 500px;">
												<p>
													<h1>{{titleNameTwo}}</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='货量'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[2]>=0" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[2]<0" :color="customColor" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[2]>=0">{{item[2]}}</span><span v-else style="color:red">{{item[2]}}</span><span v-if="titleNameTwo!='箱量(TEU)'">吨</span></el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[2]>=0" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[2]<0" :color="customColor" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[2]>=0">{{item[2]}}</span><span v-else style="color:red">{{item[2]}}</span><span v-if="titleNameTwo!='箱量(TEU)'">吨</span></el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='dep' && titleName=='货量'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="huoliangMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:auto; height: 500px;">
												<p>
													<h1>{{titleNameTwo}}</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='货量'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[2]>=0" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[2]<0" :color="customColor" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[2]>=0">{{item[2]}}</span><span v-else style="color:red">{{item[2]}}</span><span v-if="titleNameTwo!='箱量(TEU)'">吨</span></el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[2]>=0" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[2]<0" :color="customColor" :percentage="formatPer(item[2],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[2]>=0">{{item[2]}}</span><span v-else style="color:red">{{item[2]}}</span><span v-if="titleNameTwo!='箱量(TEU)'">吨</span></el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='arr' && titleName=='货量'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>


						<el-tab-pane label="收入(万元)">
							<span slot="label">
								<p>收入(万元)</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.incomeFunctionalAmountCount}}</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.incomeFunctionalAmountCountTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.incomeFunctionalAmountCountTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.incomeFunctionalAmountCountTwo)}}万</span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="shouruMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>收入(万元)</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='收入'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[3]>=0" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[3]<0" :color="customColor" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[3]>=0">{{item[3]}}</span><span v-else style="color:red">{{item[3]}}</span>万元</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[3]>=0" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[3]<0" :color="customColor" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[3]>=0">{{item[3]}}</span><span v-else style="color:red">{{item[3]}}</span>万元</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='dep' && titleName=='收入'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="shouruMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>收入(万元)</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='收入'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[3]>=0" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[3]<0" :color="customColor" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[3]>=0">{{item[3]}}</span><span v-else style="color:red">{{item[3]}}</span>万元</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[3]>=0" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[3]<0" :color="customColor" :percentage="formatPer(item[3],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[3]>=0">{{item[3]}}</span><span v-else style="color:red">{{item[3]}}</span>万元</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='arr' && titleName=='收入'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>

						</el-tab-pane>

						<el-tab-pane label="成本(万元)">
							<span slot="label">
								<p>成本(万元)</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.costFunctionalAmountCount}}</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.costFunctionalAmountCountTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.costFunctionalAmountCountTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.costFunctionalAmountCountTwo)}}万</span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="chengbenMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>成本(万元)</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='成本'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[7]>=0" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[7]<0" :color="customColor" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[7]>=0">{{item[7]}}</span><span v-else style="color:red">{{item[7]}}</span>万元</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[7]>=0" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[7]<0" :color="customColor" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[7]>=0">{{item[7]}}</span><span v-else style="color:red">{{item[7]}}</span>万元</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='dep' && titleName=='成本'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="chengbenMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>成本(万元)</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='成本'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[7]>=0" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
																<el-progress v-if="item[7]<0" :color="customColor" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[7]>=0">{{item[7]}}</span><span v-else style="color:red">{{item[7]}}</span>万元</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[7]>=0" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
															<el-progress v-if="item[7]<0" :color="customColor" :percentage="formatPer(item[7],data.poll)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[7]>=0">{{item[7]}}</span><span v-else style="color:red">{{item[7]}}</span>万元</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='arr' && titleName=='成本'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>

						<el-tab-pane label="毛利(万元)">
							<span slot="label">
								<p>毛利(万元)</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.grossProfit}}</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.grossProfitTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.grossProfitTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.grossProfitTwo)}}万</span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="maoliMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>毛利(万元)</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='毛利'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[4]>=0" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
																<el-progress v-else :color="customColor" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[4]>=0">{{item[4]}}</span><span v-else style="color:red">{{item[4]}}</span>万元</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[4]>=0" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
															<el-progress v-else :color="customColor" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[4]>=0">{{item[4]}}</span><span v-else style="color:red">{{item[4]}}</span>万元</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='dep' && titleName=='毛利'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>


								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="maoliMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>毛利(万元)</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='毛利'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC' ||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[4]>=0" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
																<el-progress v-else :color="customColor" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[4]>=0">{{item[4]}}</span><span v-else style="color:red">{{item[4]}}</span>万元</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[4]>=0" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
															<el-progress v-else :color="customColor" :percentage="formatPer(item[4],data.grossProfit)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[4]>=0">{{item[4]}}</span><span v-else style="color:red">{{item[4]}}</span>万元</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='arr' && titleName=='毛利'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>

						</el-tab-pane>
						<el-tab-pane label="毛利率">
							<span slot="label">
								<p>毛利率</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.grossProfitMargin}}%</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.grossProfitMarginTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.grossProfitMarginTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.grossProfitMarginTwo)}}%</span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="maolilvMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>毛利率</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='毛利率'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC' ||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[6]>=0" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
																<el-progress v-else :color="customColor" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[6]>=0">{{item[6]}}</span><span v-else style="color:red">{{item[6]}}</span>%</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[6]>=0" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
															<el-progress v-else :color="customColor" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[6]>=0">{{item[6]}}</span><span v-else style="color:red">{{item[6]}}</span>%</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='dep' && titleName=='毛利率'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>


								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="maolilvMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>毛利率</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='毛利率'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC' ||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[6]>=0" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
																<el-progress v-else :color="customColor" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[6]>=0">{{item[6]}}</span><span v-else style="color:red">{{item[6]}}</span>%</el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[6]>=0" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
															<el-progress v-else :color="customColor" :percentage="formatPer(item[6],data.grossProfit)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[6]>=0">{{item[6]}}</span><span v-else style="color:red">{{item[6]}}</span>%</el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='arr' && titleName=='毛利率'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>

						</el-tab-pane>
						<el-tab-pane label="单位毛利">
							<span slot="label">
								<p>单位毛利</p>
								<p style="margin-top: -18px;"><span style="font-size:25px; color:blue; ">{{data.unitGrossProfit}}</span></p>
								<p style="margin-top: -18px;"><i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="data.unitGrossProfitTwo>0"></i><i class="el-icon-bottom-right" style="color:red" v-else-if="data.unitGrossProfitTwo<0"></i><i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(data.unitGrossProfitTwo)}}</span></p>
							</span>
							<el-tabs type="border-card" :value="tapType" @tab-click="handleClickTwo">
								<el-tab-pane :label="depName" name="dep">
									<el-row>
										<el-col :span="16">
											<div id="danweimaoliMapOne" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>单位毛利</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='dep' && titleName=='单位毛利'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC' ||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[5]>=0" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
																<el-progress v-else :color="customColor" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[5]>=0">{{item[5]}}</span><span v-else style="color:red">{{item[5]}}</span></el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[5]>=0" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
															<el-progress v-else :color="customColor" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[5]>=0">{{item[5]}}</span><span v-else style="color:red">{{item[5]}}</span></el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='dep' && titleName=='单位毛利'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>


								</el-tab-pane>
								<el-tab-pane :label="arrName" name="arr">
									<el-row>
										<el-col :span="16">
											<div id="danweimaoliMapTwo" style="width:700px; height: 500px;"></div>
										</el-col>
										<el-col :span="8">
											<div style="width:500px; height: 500px;">
												<p>
													<h1>单位毛利</h1>
												</p>
												<!-- 循环 -->
												<div style="margin-top: 10px;" v-if="rawData!=null&&tapType=='arr' && titleName=='单位毛利'" v-for="(item,index) in rawData">
													<el-row v-if="query.businessScope=='SE'||query.businessScope=='SI'||query.businessScope=='TE'||query.businessScope=='LC'||query.businessScope=='IO'">
														<el-row>
															<el-col :span="24">{{item[0]}}:</el-col>
														</el-row>
														<el-row>
															<el-col :span="12">
																<el-progress v-if="item[5]>=0" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
																<el-progress v-else :color="customColor" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
															</el-col>
															<el-col :span="12"><span v-if="item[5]>=0">{{item[5]}}</span><span v-else style="color:red">{{item[5]}}</span></el-col>
														</el-row>
													</el-row>
													<el-row v-if="query.businessScope=='AE'||query.businessScope=='AI'">
														<el-col :span="4">{{item[0]}}:</el-col>
														<el-col :span="12">
															<el-progress v-if="item[5]>=0" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
															<el-progress v-else :color="customColor" :percentage="formatPer(item[5],data.grossProfit)" :format="formatPiao"></el-progress>
														</el-col>
														<el-col :span="8"><span v-if="item[5]>=0">{{item[5]}}</span><span v-else style="color:red">{{item[5]}}</span></el-col>
													</el-row>
												</div>
												<div v-if="rawData!=null&&rawData.length==0&&tapType=='arr' && titleName=='单位毛利'">
													<el-row style="margin-left: 70px;margin-top: 40px;">暂无数据</el-row>
												</div>
											</div>
										</el-col>
									</el-row>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>
					</el-tabs>
				</el-tab-pane>
				<el-tab-pane label="汇总" name="countTwo">
					<el-table border v-loading="loading" :max-height="tableHeight" :data="data.mapCount" stripe @header-dragend="cellWidth">

						<el-table-column align="left" prop="arr" :label="count_name" width="100" header-align="center">
							<template slot-scope="scope">
								<!-- <span v-if="checkdata(scope.row.main_routing_cost)" style="color: red;">{{scope.row.main_routing_cost}}</span> -->
								<!-- <span v-else>{{scope.row.main_routing_cost}}</span> -->
								<span>{{scope.row.arr}}</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="piao" label="票数" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.piao}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="piaoTwo" label="票数(同期)" width="100" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.piaoTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.piaoTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.piaoTwo)}}
									</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="weight" :label="count_jz_name" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.weight}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="weightTwo" :label="count_jz_name_t" width="130" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.weightTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.weightTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.weightTwo)}}
									</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="shouru" label="收入(万元)" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.shouru}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="shouruTwo" label="收入(万元)(同期)" width="130" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.shouruTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.shouruTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.shouruTwo)}}
									</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="chengben" label="成本(万元)" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.chengben}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="chengbenTwo" label="成本(万元)(同期)" width="130" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.chengbenTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.chengbenTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.chengbenTwo)}}
									</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="maoli" label="毛利(万元)" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.maoli}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="maoliTwo" label="毛利(万元)(同期)" width="130" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.maoliTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.maoliTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.maoliTwo)}}
									</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="danweimaoli" label="单位毛利" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.danweimaoli}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="danweimaoliTwo" label="单位毛利(同期)" width="130" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.danweimaoliTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.danweimaoliTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.danweimaoliTwo)}}
									</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column align="right" prop="maolilv" label="毛利率" width="100" header-align="center">
							<template slot-scope="scope">
								<span>{{scope.row.maolilv}}%</span>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="maolilvTwo" label="毛利率(同期)" width="130" header-align="center">
							<template slot-scope="scope">
								<span>
									<i class="el-icon-top-right" style="color:rgb(105, 197, 60)" v-if="scope.row.maolilvTwo>0"></i>
									<i class="el-icon-bottom-right" style="color:red" v-else-if="scope.row.maolilvTwo<0"></i>
									<i class="el-icon-right" v-else></i><span style="font-size:4px;">{{formatPull(scope.row.maolilvTwo)}}%
									</span>
								</span>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="明细" name="countThree">
					<el-table border v-loading="loading" :max-height="tableHeight" :data="dataTable" stripe @header-dragend="cellWidth">
						<el-table-column align="center" label="序号" width="60">
							<template slot-scope="scope">
								<span>{{scope.$index+1}}</span>
							</template>
						</el-table-column>
						<template v-for="(item,index) in tableColumns">
							<el-table-column v-if="item.prop=='business_scope'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align"></el-table-column>
							<el-table-column v-if="item.prop=='order_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
								<template slot-scope="scope">
									<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
								</template>
							</el-table-column>
							<el-table-column v-if="item.prop=='awb_number'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
								<template slot-scope="scope">
									<span v-if="query.businessScope == 'AE'">{{scope.row.awb_number}}</span>
									<span v-if="query.businessScope == 'AI'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
									<span v-if="query.businessScope == 'SE'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
									<span v-if="query.businessScope == 'SI'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
									<span v-if="query.businessScope == 'TE'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
									<span v-if="query.businessScope == 'LC'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
									<span v-if="query.businessScope == 'IO'">{{returnAwb(scope.row,'awb_number','hawb_number')}}</span>
								</template>
							</el-table-column>
							<el-table-column v-if="item.prop=='customer_number'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='coop_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='coop_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='business_product'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='sales_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterName"></el-table-column>
							<el-table-column v-if="item.prop=='servicer_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterName"></el-table-column>
							<el-table-column v-if="item.prop=='expect_flight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='expect_departure'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='expect_arrival'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='departure_station'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='arrival_station'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='goods_source_code'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='routing_name'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='goods_type'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='awb_from'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='plan_charge_weight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
							<el-table-column v-if="item.prop=='income_functional_amount_count'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="income_functional_amount_count"></el-table-column>
							<el-table-column v-if="item.prop=='cost_functional_amount_count'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="cost_functional_amount_count"></el-table-column>
							<el-table-column v-if="item.prop=='gross_profit'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="gross_profit"></el-table-column>
							<el-table-column v-if="item.prop=='unit_cost_amount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="unit_formatter_amount"></el-table-column>
							<el-table-column v-if="item.prop=='unit_gross_profit'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="unit_formatter_gross"></el-table-column>
							<el-table-column v-if="item.prop=='gross_profit_margin'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="gross_profit_margin"></el-table-column>
							<!-- <el-table-column v-if="item.prop=='functional_amount_writeoff'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column> -->
							<!-- <el-table-column v-if="item.prop=='functional_amount_no_writeoff'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="functional_amount_no_writeoff"></el-table-column> -->
						</template>

						<el-table-column align="center" label="毛利构成" width="100" v-if="constituteFlag">
							<el-table-column align="right" prop="main_routing_income" label="干线收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.main_routing_income)" style="color: red;">{{scope.row.main_routing_income}}</span>
									<span v-else>{{scope.row.main_routing_income}}</span>
									<!-- <span>{{scope.row.main_routing_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="main_routing_cost" label="干线成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.main_routing_cost)" style="color: red;">{{scope.row.main_routing_cost}}</span>
									<span v-else>{{scope.row.main_routing_cost}}</span>
									<!-- <span >{{scope.row.main_routing_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="main_routing" label="干线毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.main_routing)" style="color: red;">{{scope.row.main_routing}}</span>
									<span v-else>{{scope.row.main_routing}}</span>
									<!-- <span>{{scope.row.main_routing}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="feeder_income" label="支线收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.feeder_income)" style="color: red;">{{scope.row.feeder_income}}</span>
									<span v-else>{{scope.row.feeder_income}}</span>
									<!-- <span>{{scope.row.feeder_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="feeder_cost" label="支线成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.feeder_cost)" style="color: red;">{{scope.row.feeder_cost}}</span>
									<span v-else>{{scope.row.feeder_cost}}</span>
									<!-- <span>{{scope.row.feeder_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="feeder" label="支线毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.feeder)" style="color: red;">{{scope.row.feeder}}</span>
									<span v-else>{{scope.row.feeder}}</span>
									<!-- <span >{{scope.row.feeder}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="operation_income" label="操作收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.operation_income)" style="color: red;">{{scope.row.operation_income}}</span>
									<span v-else>{{scope.row.operation_income}}</span>
									<!-- <span>{{scope.row.operation_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="operation_cost" label="操作成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.operation_cost)" style="color: red;">{{scope.row.operation_cost}}</span>
									<span v-else>{{scope.row.operation_cost}}</span>
									<!-- <span >{{scope.row.operation_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="operation" label="操作毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.operation)" style="color: red;">{{scope.row.operation}}</span>
									<span v-else>{{scope.row.operation}}</span>
									<!-- <span>{{scope.row.operation}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="packaging_income" label="包装收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.packaging_income)" style="color: red;">{{scope.row.packaging_income}}</span>
									<span v-else>{{scope.row.packaging_income}}</span>
									<!-- <span>{{scope.row.packaging_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="packaging_cost" label="包装成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.packaging_cost)" style="color: red;">{{scope.row.packaging_cost}}</span>
									<span v-else>{{scope.row.packaging_cost}}</span>
									<!-- <span>{{scope.row.packaging_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="packaging" label="包装毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.packaging)" style="color: red;">{{scope.row.packaging}}</span>
									<span v-else>{{scope.row.packaging}}</span>
									<!-- <span>{{scope.row.packaging}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="storage_income" label="仓储收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.storage_income)" style="color: red;">{{scope.row.storage_income}}</span>
									<span v-else>{{scope.row.storage_income}}</span>
									<!-- <span>{{scope.row.storage_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="storage_cost" label="仓储成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.storage_cost)" style="color: red;">{{scope.row.storage_cost}}</span>
									<span v-else>{{scope.row.storage_cost}}</span>
									<!-- <span >{{scope.row.storage_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="storage" label="仓储毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.storage)" style="color: red;">{{scope.row.storage}}</span>
									<span v-else>{{scope.row.storage}}</span>
									<!-- <span>{{scope.row.storage}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="postage_income" label="快递收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.postage_income)" style="color: red;">{{scope.row.postage_income}}</span>
									<span v-else>{{scope.row.postage_income}}</span>
									<!-- <span >{{scope.row.postage_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="postage_cost" label="快递成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.postage_cost)" style="color: red;">{{scope.row.postage_cost}}</span>
									<span v-else>{{scope.row.postage_cost}}</span>
									<!-- <span>{{scope.row.postage_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="postage" label="快递毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.postage)" style="color: red;">{{scope.row.postage}}</span>
									<span v-else>{{scope.row.postage}}</span>
									<!-- <span >{{scope.row.postage}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="clearance_income" label="关检收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.clearance_income)" style="color: red;">{{scope.row.clearance_income}}</span>
									<span v-else>{{scope.row.clearance_income}}</span>
									<!-- <span >{{scope.row.clearance_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="clearance_cost" label="关检成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.clearance_cost)" style="color: red;">{{scope.row.clearance_cost}}</span>
									<span v-else>{{scope.row.clearance_cost}}</span>
									<!-- <span >{{scope.row.clearance_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="clearance" label="关检毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.clearance)" style="color: red;">{{scope.row.clearance}}</span>
									<span v-else>{{scope.row.clearance}}</span>
									<!-- <span >{{scope.row.clearance}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="exchange_income" label="数据收入" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.exchange_income)" style="color: red;">{{scope.row.exchange_income}}</span>
									<span v-else>{{scope.row.exchange_income}}</span>
									<!-- <span >{{scope.row.exchange_income}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="exchange_cost" label="数据成本" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.exchange_cost)" style="color: red;">{{scope.row.exchange_cost}}</span>
									<span v-else>{{scope.row.exchange_cost}}</span>
									<!-- <span >{{scope.row.exchange_cost}}</span> -->
								</template>
							</el-table-column>
							<el-table-column align="right" prop="exchange" label="数据毛利" width="100">
								<template slot-scope="scope">
									<span v-if="checkdata(scope.row.exchange)" style="color: red;">{{scope.row.exchange}}</span>
									<span v-else>{{scope.row.exchange}}</span>
									<!-- <span >{{scope.row.exchange}}</span> -->
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
		<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="frow"></customerSelect>
		<supplierSelect ref="addMission" v-if="supplierSelectVisible" :visible.sync="supplierSelectVisible" :frow="frow"></supplierSelect>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="frow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="frow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="frow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="frow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="frow"></viewVisibleTagTE>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="frow"></viewVisibleTagLC>
		<viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="frow"></viewVisibleTagIO>
		<setColumnTag ref="addMission" v-if="setColumnFlag" :visible.sync="setColumnFlag" :frow="frow"></setColumnTag>
	</div>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
	import SupplierSelect from './selectSupplier'
	import Echarts from 'echarts';
	import worldJson from './world.json';
	import viewVisibleVueAE from '../../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../../sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '../../sc/si/order/main/order_view.vue'
	import viewVisibleVueTE from '../../tc/te/order/main/order_view.vue'
	import viewVisibleVueLC from '../../lc/order/main/order_view.vue'
	import viewVisibleVueIO from '../../io/order/main/order_view.vue'
	import setColumnVue from './customer_info_setting.vue'
	import columns from './detail_column.json'

	export default {
		data() {
			return {
				customColor: '#ff0c18',
				customerSelectVisible: false,
				supplierSelectVisible: false,
				in_load_flag: true,
				businessCodes: [],
				dataTable: [],
				column: [],
				tableColumns: [],
				/*表数据*/
				data: {},
				busFlag: true,
				goodsTypeFlag: false,
				showListView: false,
				containerMethodFlag: true,
				containerMethods: [],
				businessProducts: [],
				goodsTypes: [],
				coopTypeOptions: [],
				chooseRoutingNamesList: [],
				routingNames: [],
				areas: [],
				pollFlag: true,
				huoLiangFlag: false,
				shouRuFlag: false,
				chengBenFlag: false,
				maoLiFlag: false,
				unitMaoLiFlag: false,
				maoLiLvFlag: false,
				titleName: '票数',
				titleNameTwo: '计重(吨)',
				tapType: 'arr',
				activeName: 'countOne',
				frow: {},
				depName: '始发港',
				arrName: '目的港',
				count_name: '',
				count_jz_name: '',
				count_jz_name_t: '',
				query: {
					businessScope: 'AE',
					coopName: '',
					orderStatus: '',
					startDate: '',
					endDate: '',
					businessProduct: '',
					containerMethod: '整箱',
					countType: '开航日期',
					goodsType: '',
					isAllUserFlag: false,
					isAllUser: '',
					endDateType: 'DAY',
					coopId: '',
					customerName: '',
					coopType: '',
					chooseRoutingNames: '',
					area: '',
					supplierName: '',
					country: '',
					showConstituteFlag: true
				},
				loading: false,
				showFlag: false,
				option: {},
				chartColumn: null,
				geoCoordMap: {

				},
				schema: [
					"Cities"
				],
				rawData: [

				],
				dataNum: 2,
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				constituteFlag: false,
				setColumnFlag: false,
				tableHeight: '700px'

			}
		},
		components: {
			'customerSelect': CustomerSelect,
			'viewVisibleTagAE': viewVisibleVueAE,
			'viewVisibleTagAI': viewVisibleVueAI,
			'viewVisibleTagSE': viewVisibleVueSE,
			'viewVisibleTagSI': viewVisibleVueSI,
			'viewVisibleTagTE': viewVisibleVueTE,
			'viewVisibleTagLC': viewVisibleVueLC,
			'viewVisibleTagIO': viewVisibleVueIO,
			'setColumnTag': setColumnVue,
			'supplierSelect': SupplierSelect
		},
		provide() {
			return {
				setValue: this.setValue,
				querCach: this.querCach,
				findByPage: this.findByPage,
				setValueSupplier: this.setValueSupplier
			}
		},
		created() {
			Echarts.registerMap('world', worldJson);
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//服务产品
			this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
				this.businessProducts = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectVCategory?category=合作伙伴分类').then(function(response) {
				this.coopTypeOptions = response.data.data;
			}.bind(this));
			this.query.startDate = this.getDateDay01(new Date());
			this.query.endDate = this.getDateInfo(new Date());
			if (this.$route.query.flag) {
				if (this.$route.query.name == 'view') {
					this.query = JSON.parse(this.base64Decode(this.$route.query.frow))
				} else if (this.$route.query.name == 'more') {
					this.query = JSON.parse(this.base64Decode(this.$route.query.frow))
					// console.log(this.query.businessScope);
				} else if (this.$route.query.name == 'supplier_procurement') {
					let param = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.query.orderStatus = param.isLock == 'true' ? '是' : param.isLock == 'false' ? '否' : ''
					this.query.startDate = param.statisticalPeriodStart
					this.query.endDate = param.statisticalPeriodEnd
					this.query.containerMethod = param.containerMethod
					this.query.countType = param.statisticalPeriodType
					this.query.goodsType = param.goodsType
					this.query.coopType = param.supplierType
					this.query.supplierName = param.coopName
					this.query.businessScope = param.businessScope
					this.query.isAllUser = '是'
				}
				let menuComponent = this.$parent.$children[0];
				menuComponent.collapsed = true;
			}
			this.businessScopeChange();
			this.findByPage();
			this.query.showConstituteFlag = false;
		},
		mounted() {
			this.arf();
		},
		methods: {
			querCach() {
				this.findByPage();
			},
			handleCount(tab, event) {
				if (tab.index == '0') {
					this.activeName = 'countOne';
				} else if (tab.index == '1') {
					this.activeName = 'countTwo';
					this.setHeight()
				} else {
					this.activeName = 'countThree';
					this.setHeight()
				}
			},
			formatPull(a) {
				if (a < 0) {
					return a * -1;
				} else {
					return a;
				}
			},
			setValue(row) {
				this.query.coopId = row.coopId;
				this.query.customerName = row.coopName;
			},
			setValueSupplier(row) {
				this.query.supplierName = row.coopName;
			},
			selectCustomer() {
				this.frow.businessScope = this.query.businessScope;
				this.customerSelectVisible = true
			},
			selectSupplier() {
				this.frow.businessScope = this.query.businessScope;
				this.supplierSelectVisible = true
			},
			formatPiao(percentage) {
				return '';
			},
			formatPer(a, b) {
				if (a && b) {
					if (a < 0) {
						a = a * -1;
					}
					if (b < 0) {
						b = b * -1;
					}
				}
				if (this.titleName == '毛利率') {
					return a > 100 ? 100 : a;
				} else {
					if (a && b) {
						if (a == 0) {
							return 0;
						}
						if (b == 0) {
							b = 1;
						}
						return parseFloat((a * 100 / b).toFixed(2)) > 100 ? 100 : parseFloat((a * 100 / b).toFixed(2));
					} else {
						return 0;
					}
				}

			},
			getDateDay(theDate) {
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				// _month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				return _year + "-" + _month + "-01";
			},
			getDateDay01(theDate) {
				let _year = theDate.getFullYear();
				return _year + "-01-01";
			},
			getDateInfo(theDate) {
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _day = theDate.getDate();
				_month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_day < 10) {
					_day = "0" + _day;
				}
				return _year + "-" + _month + "-" + _day;
			},
			handleClick(tab, event) {
				if (tab.index == '0') {
					this.pollFlag = true;
					this.huoLiangFlag = false;
					this.shouRuFlag = false;
					this.maoLiFlag = false;
					this.unitMaoLiFlag = false;
					this.maoLiLvFlag = false;
					this.chengBenFlag = false;
					this.titleName = '票数';
					this.dataNum = 2;
				} else if (tab.index == '1') {
					this.pollFlag = false;
					this.huoLiangFlag = true;
					this.shouRuFlag = false;
					this.maoLiFlag = false;
					this.unitMaoLiFlag = false;
					this.maoLiLvFlag = false;
					this.chengBenFlag = false;
					this.titleName = '货量';
					this.dataNum = 3;

				} else if (tab.index == '2') {
					this.pollFlag = false;
					this.huoLiangFlag = false;
					this.shouRuFlag = true;
					this.maoLiFlag = false;
					this.unitMaoLiFlag = false;
					this.maoLiLvFlag = false;
					this.chengBenFlag = false;
					this.titleName = '收入';
					this.dataNum = 4;
				} else if (tab.index == '3') {
					this.pollFlag = false;
					this.huoLiangFlag = false;
					this.shouRuFlag = false;
					this.maoLiFlag = false;
					this.unitMaoLiFlag = false;
					this.maoLiLvFlag = false;
					this.chengBenFlag = true;
					this.titleName = '成本';
					this.dataNum = 8;
				} else if (tab.index == '4') {
					this.pollFlag = false;
					this.huoLiangFlag = false;
					this.shouRuFlag = false;
					this.maoLiFlag = true;
					this.unitMaoLiFlag = false;
					this.maoLiLvFlag = false;
					this.chengBenFlag = false;
					this.titleName = '毛利';
					this.dataNum = 5;
				} else if (tab.index == '6') {
					this.pollFlag = false;
					this.huoLiangFlag = false;
					this.shouRuFlag = false;
					this.maoLiFlag = false;
					this.unitMaoLiFlag = true;
					this.maoLiLvFlag = false;
					this.chengBenFlag = false;
					this.titleName = '单位毛利';
					this.dataNum = 6;
				} else if (tab.index == '5') {
					this.pollFlag = false;
					this.huoLiangFlag = false;
					this.shouRuFlag = false;
					this.maoLiFlag = false;
					this.unitMaoLiFlag = false;
					this.maoLiLvFlag = true;
					this.chengBenFlag = false;
					this.titleName = '毛利率';
					this.dataNum = 7;
				}
				if (!this.tapType) {
					this.tapType = 'arr';
				}
				this.selectTab(this.tapType);

			},
			handleClickTwo(tab, event) {
				if (tab.index == '0') {
					this.selectTab('dep');
				} else {
					this.selectTab('arr');
				}
			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			selectTab(a) {
				if (a == 'dep') {
					this.tapType = 'dep';
					this.rawData = this.data.mapDep;
					this.geoCoordMap = this.data.mapDepL;
				} else {
					this.tapType = 'arr';
					this.rawData = this.data.mapArr;
					this.geoCoordMap = this.data.mapArrL;
				}
				// console.log(this.geoCoordMap);
				// this.$nextTick(()=>{
				this.arf();
				// });
			},
			businessScopeChange() {
				if (this.query.businessScope == 'AE') {
					this.busFlag = true;
				} else {
					this.busFlag = false;
				}
				if (this.query.countType && this.query.countType != '财务日期') {
					if (this.query.businessScope == 'AE' || this.query.businessScope == 'SE') {
						this.query.countType = '开航日期'
					}
					if (this.query.businessScope == 'AI' || this.query.businessScope == 'SI') {
						this.query.countType = '到港日期'
					}
					if (this.query.businessScope == 'TE') {
						this.query.countType = '发车日期'
					}
					if (this.query.businessScope == 'LC') {
						this.query.countType = '用车日期'
					}
					if (this.query.businessScope == 'IO') {
						this.query.countType = '业务日期'
					}
				}
				if (this.query.businessScope.startsWith('A')) {
					//货物类型
					this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					}.bind(this));
					this.goodsTypeFlag = false;
					// this.busFlag=true;
					this.containerMethodFlag = true;
					this.titleNameTwo = '计重(吨)';
					this.count_name = '航线';
					this.count_jz_name = '计重(吨)';
					this.$axios.get('/afbase/vAfCategory/航线').then((response) => {
						this.routingNames = response.data.data;
					});
					//分区
					this.$axios.get('/afbase/vAfCategory/分区').then((response) => {
						this.areas = response.data.data;
					});
				}
				if (this.query.businessScope.startsWith('S')) {
					this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					//装箱方式
					this.$axios.get('/sc/vScCategory/装箱方式').then((response) => {
						this.containerMethods = response.data.data;
					})
					this.count_name = '航线';
					this.goodsTypeFlag = true;
					this.busFlag = false;
					if (this.query.containerMethod != '整箱') {
						this.containerMethodFlag = true;
						this.titleNameTwo = '计费吨';
						this.count_jz_name = '计费(吨)';
					} else {
						this.titleNameTwo = '箱量(TEU)';
						this.count_jz_name = '箱量(TEU)';
						this.containerMethodFlag = false;
					}
					this.$axios.get('/afbase/vAfCategory/sc/航线').then((response) => {
						this.routingNames = response.data.data;
					});
				}
				if (this.query.businessScope == 'TE') {
					this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					this.$axios.get('/sc/tcCategory/装箱方式').then((response) => {
						this.containerMethods = response.data.data;
					})
					this.goodsTypeFlag = true;
					this.busFlag = false;
					this.count_name = '目的地';
					if (this.query.containerMethod != '整箱') {
						this.containerMethodFlag = true;
						this.titleNameTwo = '计费吨';
						this.count_jz_name = '计费(吨)';
					} else {
						this.titleNameTwo = '箱量(TEU)';
						this.count_jz_name = '箱量(TEU)';
						this.containerMethodFlag = false;
					}
				}
				if (this.query.businessScope == 'LC') {
					this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
						this.goodsType = '';
					});
					this.goodsTypeFlag = true;
					this.busFlag = false;
					this.containerMethodFlag = true;
					this.titleNameTwo = '计重(吨)';
					this.count_jz_name = '计重(吨)';
					this.count_name = '目的地';
				}
				if (this.query.businessScope == 'IO') {
					this.$axios.get('/sc/vIoCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
					})
					this.goodsTypeFlag = true;
					this.busFlag = false;
					this.containerMethodFlag = true;
					this.titleNameTwo = '计重(吨)';
					this.count_jz_name = '计重(吨)';
					this.count_name = '目的地';
				}
				if (this.query.businessScope != 'TE' && this.query.businessScope != 'LC' && this.query.businessScope != 'IO') {
					this.depName = '始发港';
					this.arrName = '目的港';
				}
				if (this.query.businessScope == 'TE' || this.query.businessScope == 'IO') {
					this.depName = '起运地';
					this.arrName = '目的地';
				}
				if (this.query.businessScope == 'LC') {
					this.depName = '始发城市';
					this.arrName = '目的城市';
				}
				this.count_jz_name_t = this.count_jz_name + "(同期)";
			},
			// queryInfo(){
			//   this.loading = true
			//   let url = '';
			//   if(this.query.businessScope.startsWith('A')){
			//      url = '/afbase/customerContribution/af/detail';
			//   }else{
			//     url = '/afbase/customerContribution/sc/detail';
			//   }
			//   this.$axios.get2(url, this.query).then(function(response) {
			//   	this.data = response.data.data;
			//   	this.loading = false
			//   }.bind(this)).catch(function(error) {
			//   	this.loading = false
			//   })
			// },
			findByPage() {
				this.in_load_flag = true;
				// console.log(this.query.chooseRoutingNames);
				// let param={
				//   businessScope: 'AE',
				//   orderStatus: '',
				//   startDate: '2020-06-01',
				//   endDate: '2020-07-08',
				//   businessProduct: '',
				//   containerMethod: '整箱',
				//   countType: '开航日期',
				//   goodsType: '',
				//   isAllUserFlag: false,
				//   isAllUser: '是',
				//   coopId: 23,
				//   endDateType: 'DAY'
				// }
				let pageName = '报表统计分析/客户贡献度分析/列表明细';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName).then(function(response) {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						this.tableColumns = this.sortBykey(af_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.info, 'index');
					}
					this.setLabel(this.tableColumns)
					// this.queryInfo();
				}.bind(this));

				if (!this.query.startDate || !this.query.endDate) {
					this.in_load_flag = false;
					this.openError("请先选择统计周期起止时间");
					return false;
				}

				if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T')) {
					if (this.query.containerMethod != '整箱') {
						this.titleNameTwo = '计费吨';
						this.count_jz_name = '计费(吨)';
					} else {
						this.titleNameTwo = '箱量(TEU)';
						this.count_jz_name = '箱量(TEU)';
					}
				} else {
					this.titleNameTwo = '计重(吨)';
					this.count_jz_name = '计重(吨)';
				}
				this.count_jz_name_t = this.count_jz_name + "(同期)";
				this.query.endDateType = 'DAY';
				if (!this.query.customerName) {
					this.query.coopId = '';
				}
				if (this.chooseRoutingNamesList) {
					this.query.chooseRoutingNames = this.chooseRoutingNamesList.join();
				}
				// console.log(new Date());
				this.$axios.get2('/afbase/customerContribution/customer/detail?', this.query)
					.then((response) => {
						if (response.data.code == 0) {
							// console.log(new Date());
							this.data = response.data.data;
							// if(response.data.data.customer_info_list){
							//   this.dataTable = response.data.data.customer_info_list;
							// }else{
							//   this.dataTable = [];
							// }
							// console.log(this.dataTable);
							this.loading = false
							this.in_load_flag = false;
							this.selectTab(this.tapType);
						} else {
							this.loading = false
							this.in_load_flag = false;
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.loading = false
						this.in_load_flag = false;
						this.openError(error.response.data.messageInfo)
					})

				//取明细
				let url = '';
				if (this.query.businessScope.startsWith('A')) {
					url = '/afbase/customerContribution/af/detail';
				} else {
					url = '/afbase/customerContribution/sc/detail';
				}
				this.$axios.get2(url, this.query).then(function(response) {
					this.dataTable = response.data.data;
				}.bind(this)).catch(function(error) {})

			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			arf() {
				if (this.pollFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("piaoMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("piaoMapTwo"));
					}
				} else if (this.huoLiangFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("huoliangMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("huoliangMapTwo"));
					}
				} else if (this.shouRuFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("shouruMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("shouruMapTwo"));
					}
				} else if (this.chengBenFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("chengbenMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("chengbenMapTwo"));
					}
				} else if (this.maoLiFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("maoliMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("maoliMapTwo"));
					}
				} else if (this.unitMaoLiFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("danweimaoliMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("danweimaoliMapTwo"));
					}
				} else if (this.maoLiLvFlag) {
					if (this.tapType == 'dep') {
						this.chartColumn = Echarts.init(document.getElementById("maolilvMapOne"));
					} else {
						this.chartColumn = Echarts.init(document.getElementById("maolilvMapTwo"));
					}
				}
				this.configOption();
				this.chartColumn.setOption(this.option);
			},
			makeMapData(rawData) {
				let mapData = [];
				for (let i = 0; i < rawData.length; i++) {
					let geoCoord = this.geoCoordMap[rawData[i][0]];
					if (geoCoord) {
						mapData.push({
							name: rawData[i][0],
							value: geoCoord.concat(rawData[i].slice(1))
						});
					}
				}
				return mapData;
			},
			configOption() {
				let that = this;
				this.option = {
					backgroundColor: Echarts.graphic.RadialGradient(0.5, 0.5, 0.4, [
						//   {
						//     offset: 0,
						//     color: '#778899'
						// },
						{
							offset: 0,
							color: '#b8d8fe'
						}
					]),
					title: {
						text: '',
						subtext: '',
						sublink: 'https://www.macrofocus.com/public/products/infoscope/datasets/pricesandearnings/',
						left: 'center',
						top: 5,
						itemGap: 0,
						textStyle: {
							color: 'black'
						},
						z: 200
					},
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							// var value = (params.value + '').split('.');
							// value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
							if (params.seriesName == '票数') {
								return params.seriesName + '<br/>' + params.name + ' : ' + params.value[2];
							} else if (params.seriesName == '货量') {
								return that.titleNameTwo + '<br/>' + params.name + ' : ' + params.value[3];
							} else if (params.seriesName == '收入') {
								return params.seriesName + '<br/>' + params.name + ' : ' + params.value[4];
							} else if (params.seriesName == '成本') {
								return params.seriesName + '<br/>' + params.name + ' : ' + params.value[8];
							} else if (params.seriesName == '毛利') {
								return params.seriesName + '<br/>' + params.name + ' : ' + params.value[5];
							} else if (params.seriesName == '单位毛利') {
								return params.seriesName + '<br/>' + params.name + ' : ' + params.value[6];
							} else if (params.seriesName == '毛利率') {
								return params.seriesName + '<br/>' + params.name + ' : ' + params.value[7];
							}
						}
					},
					// brush: {
					//     geoIndex: 0,
					//     brushLink: 'all',
					//     inBrush: {
					//         opacity: 1,
					//         symbolSize: 14
					//     },
					//     outOfBrush: {
					//         color: '#000',
					//         opacity: 0.2
					//     },
					//     z: 10
					// },
					geo: {
						map: 'world',
						silent: true,
						// emphasis: {
						//     label: {
						//         show: false,
						//         areaColor: '#55557f'
						//     }
						// },
						itemStyle: {
							borderWidth: 0.2,
							borderColor: '#b8d8fe',
							areaColor: '#b8d8fe'
						},
						left: '2%',
						top: 20,
						bottom: '40%',
						right: '2%',
						roam: true
					},
					series: [{
						name: this.titleName,
						type: 'scatter',
						coordinateSystem: 'geo',
						// symbolSize: 10,
						data: this.makeMapData(this.rawData),
						activeOpacity: 1,
						label: {
							formatter: '{b}',
							position: 'right',
							show: false
						},
						// symbolSize: 10,
						symbolSize: function(data) {
							// return Math.max(5, data[that.dataNum]/10);
							// console.log(data[that.dataNum]);
							if (data && data.length > 0) {
								let num = data[that.dataNum];
								if (num < 10) {
									num = 10;
								}
								if (num > 20) {
									num = 20;
								}
								return num;
							} else {
								return 5;
							}
						},
						itemStyle: {
							borderColor: '#1848f2',
							color: '#1848f2',
						},
						// emphasis: {
						//     label: {
						//         show: true
						//     }
						// }
					}]
				}
			},
			base64Decode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
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
			setLabel(tableColumns) {
				let indexDelete = [];
				try {
					tableColumns.forEach((column, index) => {
						if (column.prop == 'awb_number') {
							if (this.query.businessScope == 'TE') {
								column.label = "运单号码";
							} else if (this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
								// column.label = "客户单号";
								indexDelete.push(index);
							} else {
								column.label = "主单号";
							}
						}
						//服务产品
						if (column.prop == 'business_product') {
							if (this.query.businessScope != 'AE') {
								indexDelete.push(index);
							}
						}
						//航班号
						if (column.prop == 'expect_flight') {
							if (this.query.businessScope.startsWith('A')) {
								column.label = "航班号";
							} else if (this.query.businessScope.startsWith('S')) {
								column.label = "船次号";
							} else {
								indexDelete.push(index);
							}
						}
						if (column.prop == 'expect_departure' || column.prop == 'expect_arrival') {
							if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('A')) {
								if (this.query.businessScope.endsWith('E')) {
									column.label = "开航日期";
								} else {
									column.label = "到港日期";
									column.prop = 'expect_arrival';
									// indexDelete.push(index);
								}
							} else if (this.query.businessScope == 'TE') {
								column.label = "发车日期";
							} else if (this.query.businessScope == 'LC') {
								column.label = "用车日期";
							} else if (this.query.businessScope == 'IO') {
								column.label = "业务日期";
							}
						}
						//运单来源
						if (column.prop == 'awb_from') {
							if (this.query.businessScope == 'AE') {
								column.label = "运单来源";
							} else if (this.query.businessScope == 'TE') {
								column.label = "订舱代理";
							} else {
								indexDelete.push(index);
							}
						}
						//航线
						if (column.prop == 'routing_name') {
							if (this.query.businessScope == "TE" || this.query.businessScope == "LC" || this.query.businessScope == "IO") {
								indexDelete.push(index);
							}
						}
						//货源地
						if (column.prop == 'goods_source_code') {
							if (this.query.businessScope != "AE") {
								indexDelete.push(index);
							}
						}
						//计重
						if (column.prop == 'plan_charge_weight') {
							if (this.query.businessScope.startsWith('A') || this.query.businessScope == 'LC' || this.query.businessScope == "IO") {
								column.label = "计重";
							} else {
								if (this.query.containerMethod == '整箱') {
									column.label = "箱量";
								} else {
									column.label = "计费吨";
								}

							}
						}
						//件数
						if (column.prop == 'pieces') {
							if (this.query.businessScope.startsWith('A') || this.query.businessScope == 'LC' || this.query.businessScope == "IO") {
								column.label = "件数";
							} else {
								column.label = "标箱数量";
							}
						}
					});
					if (indexDelete.length > 0) {
						indexDelete.sort(function(a, b) {
							return a - b;
						});
						for (let i = 0; i < indexDelete.length; i++) {
							this.$delete(tableColumns, indexDelete[i] - i);
						}
					}
				} catch (e) {}
			},
			gross_profit_margin(row, column) {
				if (!row.gross_profit_margin || row.gross_profit == 0) {
					return "0.00%";
				} else {
					return row.gross_profit_margin + '%';
				}
			},
			unit_formatter_gross(row, column) {
				if (row.plan_charge_weight == 0 || row.unit_gross_profit == 0) {
					return '0.0';
				} else {
					return row.unit_gross_profit;
				}
			},
			unit_formatter_amount(row, column) {
				if (row.plan_charge_weight == 0 || row.unit_cost_amount == 0) {
					return '0.0';
				} else {
					return row.unit_cost_amount;
				}
			},
			formatterName(row, column) {
				if (column.label == '责任销售') {
					if (row.sales_name) {
						return row.sales_name.split(' ')[0];
					}
				}
				if (column.label == '责任客服') {
					if (row.servicer_name) {
						return row.servicer_name.split(' ')[0];
					}
				}
			},
			returnAwb(row, a, b) {
				if (row[a] && row[b]) {
					return row[a] + '_' + row[b];
				} else {
					if (row[a]) {
						return row[a];
					}
					if (row[b]) {
						return row[b];
					}
				}
			},
			cellClick(row) {
				this.showView(row);
			},
			income_functional_amount_count(row) {
				// console.log(row.income_functional_amount_count);
				return row.income_functional_amount_count.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			cost_functional_amount_count(row) {
				return row.cost_functional_amount_count.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			functional_amount_no_writeoff(row) {
				return row.functional_amount_no_writeoff.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			gross_profit(row) {
				return row.gross_profit.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			showView(row) {
				row.businessScope = row.business_scope;
				this.frow = row;
				this.frow.orderUuid = row.order_uuid;
				this.frow.orderId = row.order_id;
				this.frow.orderCode = row.order_code;
				this.frow.viewFlag = false;
				if (row.businessScope === 'AE') {
					this.frow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow, '/af_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleAE = true;
					}
				}
				if (row.businessScope === 'AI') {
					this.frow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('edit', this.frow, '/ai_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleAI = true;
					}
				}
				if (row.businessScope === 'SE') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/se_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleSE = true;
					}
				}
				if (row.businessScope === 'SI') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/si_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleSI = true;
					}
				}
				if (row.businessScope === 'TE') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/te_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleTE = true;
					}
				}
				if (row.businessScope === 'LC') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/lc_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleLC = true;
					}
				}

				if (row.businessScope === 'IO') {
					this.frow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.frow.ifFullscreen = true
						this.jumpToNewPage('view', this.frow, '/io_order')
					} else {
						this.frow.ifFullscreen = false
						this.viewVisibleIO = true;
					}
				}

			},
			jumpToNewPage(name, frow, path) {
				let param = {
					flag: true,
					name: name,
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: path,
					query: param
				});
				window.open(routeUrl.href, '_blank');
			},
			base64Encode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
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
			exportExcelSure() {
				let param = this.query;
				param.columnStrs = this.query.columnStrs;
				param.showConstituteFlag = this.query.showConstituteFlag;
				if (this.chooseRoutingNamesList) {
					param.chooseRoutingNames = this.chooseRoutingNamesList.join();
				}
				this.$axios.post3('/afbase/customerContribution/exportExcelDetail', param)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '航线运营分析表明细' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					});
				this.query.columnStrs = "";
			},
			exportExcelCount() {
				this.query.columnStrs = "";
				this.$confirm('导出统计较慢，请点击确定后等待导出？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.post3('/afbase/customerContribution/exportExcelCount', this.query)
						.then((response) => {
							var blob = new Blob([response.data], {
								type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
							});
							var downloadElement = document.createElement('a');
							var href = window.URL.createObjectURL(blob); // 创建下载的链接
							downloadElement.href = href;
							downloadElement.download = '航线运营分析表统计' + '.xls'; // 下载后文件名
							document.body.appendChild(downloadElement);
							downloadElement.click(); // 点击下载
							document.body.removeChild(downloadElement); // 下载完成移除元素
							window.URL.revokeObjectURL(href); // 释放掉blob对象
						});
				}).catch(() => {

				});
			},
			sortBykey(ary, key) {
				return JSON.parse(JSON.stringify(ary)).sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(columns.info);
				let userId = window.localStorage.getItem('userId');
				let arrayC = JSON.parse(strColumn);
				if (arrayC && arrayC.length > 0) {
					try {
						arrayC.forEach((item, index) => {
							if (column.label == item.label) {
								item.width = newWidth
								throw Error('end')
							}
						})
					} catch (e) {
						//TODO handle the exception
					}
					arrayC = this.sortBykey(arrayC, 'index')
					localStorage.setItem(userId + '_customer_contribution_list_info_column_width', JSON.stringify(arrayC))
				}
			},
			checkdata(str) {
				if (!str) {
					return false;
				}
				if (str.indexOf('-') > -1) {
					return true;
				} else {
					return false;
				}
				// return false;
			},
			setConstituteFlag() {
				if (this.query.showConstituteFlag == true) {
					this.constituteFlag = true;
				} else {
					this.constituteFlag = false;
				}
			},
			setColumn() {
				this.frow.businessScope = this.query.businessScope;
				this.frow.containerMethod = this.query.containerMethod;
				this.setColumnFlag = true;
			},
			exportExcel() {
				if (this.data.length == 0) {
					this.openError("列表为空，不允许导出")
					return;
				}
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.query.columnStrs = JSON.stringify(this.tableColumns);
					this.exportExcelSure();
				}).catch(() => {
					let excelList = this.sortBykey(columns.info, 'index');
					this.setLabel(excelList);
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});
			},
			setHeight() {
				this.$nextTick(() => {
					let heightS = window.innerHeight - 190 - this.$refs.css_business_analysis_header.offsetHeight;
					this.tableHeight = heightS + "px";
					console.log(this.tableHeight)
				});
			},
		}
	}
</script>
<style>
	.customer-info .el-input__icon {
		line-height: 30px !important;
	}

	.customer-info .el-form-item__content {
		line-height: 30px !important;
	}

	.customer-info .el-input-group__prepend {
		padding: 0 6px;
	}

	.customer-info .el-tabs__item {
		height: auto !important;
	}

	.tab-tilte .el-tabs__item.is-active {
		color: red !important;
		background-color: #fef0f0 !important;
	}
</style>
