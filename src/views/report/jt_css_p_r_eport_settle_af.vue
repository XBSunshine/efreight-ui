<template>
	<div class="warp-main">
		<el-row class="css_P_form">
			<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query">
					<div ref="css_settle_header">
						<el-row>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:190px;">
										<template slot="prepend">业务范畴</template>
										<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:121px;margin-right: -5px;" @change="businessScopeChange">
											<el-option v-for="item in options" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.coopName" clearable auto-complete="off" style="width:390px;" maxlength="50" show-word-limit>
										<template slot="prepend">客&emsp;&emsp;户</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:210px;">
										<template slot="prepend">{{flightDateName}}</template>
										<el-date-picker slot="suffix" style="width: 141px;margin-right: -5px;" v-model="query.flightDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 140px" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束">
									</el-date-picker>
								</el-form-item>
							</el-col>

							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-button type="text" size="medium" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
									<el-button type="text" size="medium" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
									<el-button type="primary" size="small" v-on:click="querySettleList" style="margin-left: 8px;padding-left: 8px;padding-right: 8px;">查询</el-button>
									<!-- <el-button type="primary" size="mini" @click="exportExcel" v-if="exportButtonFlag">导出</el-button> -->
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth" v-if="query.businessScope!='LC'&&query.businessScope!='IO'">
								<el-form-item label-width="10px">
									<el-input v-model="query.awbNumber" clearable auto-complete="off" style="width:190px;">
										<template v-if="query.businessScope!='TE'" slot="prepend">主&nbsp;&nbsp;单&nbsp;&thinsp;号</template>
										<template v-if="query.businessScope=='TE'" slot="prepend">运&nbsp;&nbsp;单&nbsp;&thinsp;号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.orderCode" clearable auto-complete="off" style="width:190px;">
										<template slot="prepend">订&nbsp;&nbsp;单&nbsp;&thinsp;号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.customerNumber" clearable auto-complete="off" style="width:190px;">
										<template slot="prepend">客户单号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:210px;">
										<template slot="prepend">财务日期</template>
										<el-date-picker slot="suffix" style="width: 141px;margin-right: -5px;" v-model="query.financialDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
										</el-date-picker>
									</el-input>
									<span>-</span>
									<el-date-picker style="width: 140px" v-model="query.financialDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item v-if="query.businessScope!='LC'&&query.businessScope!='IO'" label-width="39px">
									<el-button style="margin-left: 13px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
								</el-form-item>
								<el-form-item v-if="query.businessScope=='LC'||query.businessScope=='IO'" label-width="239px">
									<el-button style="margin-left: 7px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
									<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.departureStation" @input="query.departureStation=toUpperCaseValue(query.departureStation)" clearable auto-complete="off" style="width:189px;" maxlength="4" show-word-limit>
										<template v-if="query.businessScope!='TE' && query.businessScope!='LC'&& query.businessScope!='IO'" slot="prepend">始&nbsp;&nbsp;发&nbsp;&thinsp;港</template>
										<template v-if="query.businessScope=='TE'||query.businessScope=='IO'" slot="prepend">起&nbsp;&nbsp;运&nbsp;&thinsp;地</template>
										<template v-if="query.businessScope=='LC'" slot="prepend">始发城市</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.arrivalStation" @input="query.arrivalStation=toUpperCaseValue(query.arrivalStation)" clearable auto-complete="off" style="width:189px;" maxlength="4" show-word-limit>
										<template v-if="query.businessScope!='TE' && query.businessScope!='LC'&& query.businessScope!='IO'" slot="prepend">目&nbsp;&nbsp;的&nbsp;&thinsp;港</template>
										<template v-if="query.businessScope=='TE'||query.businessScope=='IO'" slot="prepend">目&nbsp;&nbsp;的&nbsp;&thinsp;地</template>
										<template v-if="query.businessScope=='LC'" slot="prepend">目的城市</template>
									</el-input>
								</el-form-item>
							</el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" v-if="query.businessScope=='AE'">
                  <el-input v-model="query.transitStation" @input="query.transitStation=toUpperCaseValue(query.transitStation)" clearable auto-complete="off" maxlength="4" style="width:170px;" show-word-limit>
                    <template slot="prepend">中转港&emsp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px" v-if="query.businessScope=='AE'">
									<el-input v-model="query.goodsSourceCode" @input="query.goodsSourceCode=toUpperCaseValue(query.goodsSourceCode)" clearable auto-complete="off" maxlength="4" style="width:170px;" show-word-limit>
										<template slot="prepend">货源地&emsp;</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item v-if="query.businessScope=='AE'||query.businessScope=='AI'" label-width="10px">
									<el-input v-model="query.expectFlight" clearable auto-complete="off" @input="query.expectFlight=toUpperCaseValue(query.expectFlight)" style="width:150px;">
										<template slot="prepend">航&nbsp;&nbsp;班&nbsp;&thinsp;号</template>
									</el-input>
								</el-form-item>
								<el-form-item v-if="query.businessScope=='SE'||query.businessScope=='SI'" label-width="10px">
									<el-input v-model="query.shipVoyageNumber" clearable auto-complete="off" @input="query.shipVoyageNumber=toUpperCaseValue(query.shipVoyageNumber)" style="width:189px;">
										<template slot="prepend">船&nbsp;&nbsp;次&nbsp;&thinsp;号</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px" v-if="query.businessScope!='TE'  && query.businessScope!='LC'&& query.businessScope!='IO'">
									<el-input style="width:189px;">
										<template slot="prepend">航&emsp;&emsp;线</template>
										<el-select slot="suffix" v-model="chooseRoutingNames" multiple filterable placeholder="请选择" clearable style="width:120px;margin-right: -5px;">
											<el-option v-for="(item,index) in routingNames" :key="index" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
								<el-form-item label-width="10px" v-if="query.businessScope=='TE'">
									<el-input v-model="query.exitPort" @input="query.exitPort=toUpperCaseValue(query.exitPort)" clearable auto-complete="off" style="width:189px;" maxlength="4" show-word-limit>
										<template slot="prepend">出境口岸</template>
									</el-input>
								</el-form-item>
								<el-form-item label-width="10px" v-if="query.businessScope=='LC'">
									<el-input style="width:189px;">
										<template slot="prepend">运输方式</template>
										<el-select slot="suffix" v-model="query.shippingMethod" filterable placeholder="请选择" clearable style="width:120px;margin-right: -5px;">
											<el-option v-for="(item,index) in shippingMethods" :key="index" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
								<el-form-item label-width="10px" v-if="query.businessScope=='IO'">
									<el-input style="width:189px;">
										<template slot="prepend">业务分类</template>
										<el-select slot="suffix" v-model="query.businessMethod" filterable placeholder="请选择" clearable style="width:120px;margin-right: -5px;">
											<el-option v-for="(item,index) in businessMethods" :key="index" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
						<!-- 	<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:255px;">
										<template slot="prepend">销售部门</template>
										<el-select slot="suffix" clearable v-model="query.salesDep" placeholder="请选择" style="width:186px;margin-right: -5px;">
											<el-option v-for="item in deptoptions" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col> -->
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.salesName" clearable auto-complete="off" style="width:189px">
										<template slot="prepend">责任销售</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input v-model="query.servicerName" clearable auto-complete="off" style="width:189px;">
										<template slot="prepend">责任客服</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="query.businessScope=='AE'">
								<el-form-item label-width="10px">
									<el-input style="width:189px;">
										<template slot="prepend">运单来源</template>
										<el-select slot="suffix" v-model="query.awbFromType" filterable placeholder="请选择" clearable style="width: 120px;margin-right: -5px">
											<el-option v-for="item in awbFroms" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="query.businessScope=='AE'">
								<el-form-item label-width="10px">
									<el-input v-model="query.awbFromName" clearable auto-complete="off" style="width:189px;" maxlength="50" show-word-limit>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="query.businessScope=='SE' || query.businessScope=='TE'">
								<el-form-item label-width="10px">
									<el-input v-model="query.awbFromName" clearable auto-complete="off" style="width:299px;" maxlength="50" show-word-limit>
										<template slot="prepend">订舱代理</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="showFlag">
							<el-col class="elementWidth" v-if="businessScopeFlag2 && query.businessScope!='TE' && query.businessScope!='LC'&& query.businessScope!='IO' && query.businessScope!='AI'">
								<el-form-item label-width="10px">
									<el-input style="width:255px;">
										<template slot="prepend">服务产品</template>
										<el-select slot="suffix" v-model="query.businessProduct" filterable placeholder="请选择" clearable style="width: 186px;margin-right: -5px">
											<el-option v-for="item in businessProducts" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="businessScopeFlag2 && query.businessScope!='LC'&& query.businessScope!='IO'">
								<el-form-item label-width="10px">
									<el-input style="width:189px;">
										<template slot="prepend">货物类型</template>
										<el-select slot="suffix" v-model="query.goodsType" filterable placeholder="请选择" clearable style="width: 120px;margin-right: -5px">
											<el-option v-for="item in goodsTypes" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth" v-if="!businessScopeFlag2 && query.businessScope!='LC'&& query.businessScope!='IO'">
								<el-form-item label-width="10px">
									<el-input style="width:175px;">
										<template slot="prepend">货物类型</template>
										<el-select slot="suffix" v-model="query.goodsType" filterable placeholder="请选择" clearable style="width: 106px;margin-right: -5px">
											<el-option v-for="item in goodsTypes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:189px;">
										<template slot="prepend">毛利状况</template>
										<el-select slot="suffix" v-model="query.grossProfitStr" filterable clearable placeholder="请选择" style="width: 120px;margin-right: -5px">
											<el-option v-for="item in grossProfitStrs" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-input style="width:189px;">
										<template slot="prepend">财务锁账</template>
										<el-select slot="suffix" v-model="query.orderStatus" placeholder="请选择" clearable style="width: 120px;margin-right: -5px">
											<el-option label="已锁账" value="已锁账">
											</el-option>
											<el-option label="未锁账" value="未锁账">
											</el-option>
										</el-select>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label-width="10px">
									<el-checkbox @change="setConstituteFlag" v-model="query.showConstituteFlag">显示毛利构成</el-checkbox>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row v-show="showFlag">
              <el-col class="elementWidth" v-if="checkJtFlag">
              	<el-form-item label-width="10px">
              		<el-input style="width:454px;">
              			<template slot="prepend">分公司&emsp;</template>
              			<el-select slot="suffix" v-model="query.otherOrg" filterable placeholder="请选择"  style="width: 386px;margin-right: -5px">
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
			<el-table v-loading="loading" :indent="8" :data="data1" show-summary class="table_settle" highlight-current-row :summary-method="getSummaries" stripe border :max-height="tableH" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">

				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.prop=='orderCode'" :prop="item.prop" :key="index" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<!-- <template slot-scope="scope">
							<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
						</template> -->
					</el-table-column>
					<el-table-column v-if="item.prop=='awbNumber' && (flagAE||flagAI||flagSE||flagSI)" :prop="item.prop" :key="index" label="主单号" :width="item.width" :align="item.align" :sortable="item.sortable">
						<!-- <template slot-scope="scope">
							<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
						</template> -->
					</el-table-column>
					<el-table-column v-if="item.prop=='awbNumber' && flagTE" :prop="item.prop" :key="index" label="运单号码" :width="item.width" :align="item.align" :sortable="item.sortable">
						<!-- <template slot-scope="scope">
							<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
						</template> -->
					</el-table-column>
					<el-table-column v-if="item.prop=='awbNumber' && (flagLC||flagIO)" :prop="item.prop" :key="index" label="客户单号" :width="item.width" :align="item.align" :sortable="item.sortable">
						<!-- <template slot-scope="scope">
							<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
						</template> -->
					</el-table-column>
          	<el-table-column v-if="item.prop=='customerNumber'&& !flagLC&&!flagIO" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='businessScope'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='order_status'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='income_status'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='cost_status'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='coopCode'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='coopName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='businessProduct' && flagAE" :key="index" :prop="item.prop" label="服务产品" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='businessProduct' && flagTE" :key="index" :prop="item.prop" label="产品类型" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='businessProduct' && flagLC" :key="index" :prop="item.prop" label="运输方式" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='businessProduct' && flagIO" :key="index" :prop="item.prop" label="业务分类" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='departureStation' && (flagAE||flagAI||flagSE||flagSI)" :key="index" :prop="item.prop" label="始发港" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='departureStation' && (flagTE||flagIO)" :key="index" :prop="item.prop" label="起运地" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='departureStation' && flagLC" :key="index" :prop="item.prop" label="始发城市" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='arrivalStation' && (flagAE||flagAI||flagSE||flagSI)" :key="index" :prop="item.prop" label="目的港" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='arrivalStation' &&  (flagTE||flagIO)" :key="index" :prop="item.prop" label="目的地" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='arrivalStation' && flagLC" :key="index" :prop="item.prop" label="目的城市" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.prop=='transitStation' && flagAE" :key="index" :prop="item.prop" label="中转港1" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.prop=='transitStation2' && flagAE" :key="index" :prop="item.prop" label="中转港2" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='goodsSourceCode' && flagAE" :key="index" :prop="item.prop" label="货源地" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='routingName' && (flagAE||flagAI||flagSE||flagSI)" :key="index" :prop="item.prop" label="航线" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectFlight' && (flagAE||flagAI)" :key="index" :prop="item.prop" label="航班号" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectFlight' && (flagSE||flagSI)" :key="index" :prop="item.prop" label="船次号" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectDeparture' && (flagAE||flagSE)" :key="index" :prop="item.prop" label="开航日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectDeparture' && (flagAI||flagSI)" :key="index" :prop="item.prop" label="到港日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectDeparture' && flagTE" :key="index" :prop="item.prop" label="发车日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectDeparture' && flagLC" :key="index" :prop="item.prop" label="用车日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='expectDeparture' && flagIO" :key="index" :prop="item.prop" label="业务日期" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='salesName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='servicerName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='goodsType' && (flagAE||flagAI||flagSE||flagSI||flagTE)" :key="index" :prop="item.prop" label="货物类型" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='pieces' && (flagAE||flagAI||flagLC||flagIO)" :key="index" :prop="item.prop" label="件数" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortPieces"></el-table-column>
					<el-table-column v-if="item.prop=='pieces' && (flagSE||flagSI||flagTE)" :key="index" :prop="item.prop" label="标箱数量" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortPieces"></el-table-column>
					<el-table-column v-if="item.prop=='weight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortWeight"></el-table-column>
					<el-table-column v-if="item.prop=='volume'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVolume"></el-table-column>
					<el-table-column v-if="item.prop=='chargeWeight' && (flagAE||flagAI||flagLC||flagIO)" :key="index" :prop="item.prop" label="计重" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortChargeWeight"></el-table-column>
					<el-table-column v-if="item.prop=='chargeWeight' && (flagSE||flagSI||flagTE)" :key="index" :prop="item.prop" label="计费吨" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortChargeWeight"></el-table-column>
					<el-table-column v-if="item.prop=='incomeFunctionalAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortIncomeFunctionalAmount"></el-table-column>
					<el-table-column v-if="item.prop=='costFunctionalAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortCostFunctionalAmount"></el-table-column>
					<el-table-column v-if="item.prop=='grossProfit'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortGrossProfit"></el-table-column>
					<el-table-column v-if="item.prop=='grossProfitWeight' && (flagAE||flagAI)" :key="index" :prop="item.prop" label="单公斤毛利" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortGrossProfitWeight"></el-table-column>
					<el-table-column v-if="item.prop=='grossProfitWeight' && (flagSE||flagSI||flagTE||flagLC||flagIO)" :key="index" :prop="item.prop" label="单位毛利" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortGrossProfitWeight"></el-table-column>
					<el-table-column v-if="item.prop=='mainRoutingGrossProfitWeight' && (flagAE||flagAI)" :key="index" :prop="item.prop" label="干线单公斤毛利" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortMainRoutingGrossProfitWeight"></el-table-column>
					<el-table-column v-if="item.prop=='mainRoutingGrossProfitWeight' && (flagSE||flagSI||flagTE||flagLC||flagIO)" :key="index" :prop="item.prop" label="干线单位毛利" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable" :sort-method="sortMainRoutingGrossProfitWeight"></el-table-column>
					<el-table-column v-if="item.prop=='financialDate'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='supplierCode' && (flagAE||flagAI)" :key="index" :prop="item.prop" label="供应商代码" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='supplierCode' && (flagSE||flagTE)" :key="index" :prop="item.prop" label="订舱代理编码" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='awbFrom' && flagAE" :key="index" :prop="item.prop" label="运单来源" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='awbFrom' && (flagSE||flagTE)" :key="index" :prop="item.prop" label="订舱代理" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable"></el-table-column>
					<el-table-column v-if="item.prop=='deptName'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" header-align="center" :sortable="item.sortable"></el-table-column>

					<!--					<el-table-column v-if="item.prop=='pieces'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortPieces">
					</el-table-column>
					<el-table-column v-if="item.prop=='weight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortWeight">
					</el-table-column>
					<el-table-column v-if="item.prop=='volume'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVolume">
					</el-table-column>
					<el-table-column v-if="item.prop=='chargeWeight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortChargeWeight">
					</el-table-column>
					<el-table-column v-if="item.prop=='incomeFunctionalAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortIncomeFunctionalAmount">
					</el-table-column>
					<el-table-column v-if="item.prop=='costFunctionalAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortCostFunctionalAmount">
					</el-table-column>
					<el-table-column v-if="item.prop=='grossProfit'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortGrossProfit">
					</el-table-column>
					<el-table-column v-if="item.prop=='grossProfitWeight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortGrossProfitWeight">
					</el-table-column>
					<el-table-column v-if="item.prop=='mainRoutingGrossProfitWeight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortMainRoutingGrossProfitWeight">
					</el-table-column>
					<el-table-column v-if="item.prop!='orderCode'&&item.prop!='awbNumber'&&item.prop!='incomeFunctionalAmount'&&item.prop!='pieces'&&item.prop!='weight'&&item.prop!='volume'&&item.prop!='chargeWeight'&&item.prop!='costFunctionalAmount'&&item.prop!='grossProfit'&&item.prop!='grossProfitWeight'&&item.prop!='mainRoutingGrossProfitWeight'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
					</el-table-column>-->
				</template>

				<el-table-column align="center" label="毛利构成" width="100" v-if="constituteFlag">
					<el-table-column align="right" prop="main_routing_income" label="干线收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.main_routing_income)" style="color: red;">{{scope.row.main_routing_income}}</span>
							<span v-else>{{scope.row.main_routing_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="main_routing_cost" label="干线成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.main_routing_cost)" style="color: red;">{{scope.row.main_routing_cost}}</span>
							<span v-else>{{scope.row.main_routing_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="main_routing" label="干线毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.main_routing)" style="color: red;">{{scope.row.main_routing}}</span>
							<span v-else>{{scope.row.main_routing}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="feeder_income" label="支线收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.feeder_income)" style="color: red;">{{scope.row.feeder_income}}</span>
							<span v-else>{{scope.row.feeder_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="feeder_cost" label="支线成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.feeder_cost)" style="color: red;">{{scope.row.feeder_cost}}</span>
							<span v-else>{{scope.row.feeder_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="feeder" label="支线毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.feeder)" style="color: red;">{{scope.row.feeder}}</span>
							<span v-else>{{scope.row.feeder}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="operation_income" label="操作收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.operation_income)" style="color: red;">{{scope.row.operation_income}}</span>
							<span v-else>{{scope.row.operation_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="operation_cost" label="操作成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.operation_cost)" style="color: red;">{{scope.row.operation_cost}}</span>
							<span v-else>{{scope.row.operation_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="operation" label="操作毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.operation)" style="color: red;">{{scope.row.operation}}</span>
							<span v-else>{{scope.row.operation}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="packaging_income" label="包装收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.packaging_income)" style="color: red;">{{scope.row.packaging_income}}</span>
							<span v-else>{{scope.row.packaging_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="packaging_cost" label="包装成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.packaging_cost)" style="color: red;">{{scope.row.packaging_cost}}</span>
							<span v-else>{{scope.row.packaging_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="packaging" label="包装毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.packaging)" style="color: red;">{{scope.row.packaging}}</span>
							<span v-else>{{scope.row.packaging}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="storage_income" label="仓储收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.storage_income)" style="color: red;">{{scope.row.storage_income}}</span>
							<span v-else>{{scope.row.storage_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="storage_cost" label="仓储成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.storage_cost)" style="color: red;">{{scope.row.storage_cost}}</span>
							<span v-else>{{scope.row.storage_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="storage" label="仓储毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.storage)" style="color: red;">{{scope.row.storage}}</span>
							<span v-else>{{scope.row.storage}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="postage_income" label="快递收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.postage_income)" style="color: red;">{{scope.row.postage_income}}</span>
							<span v-else>{{scope.row.postage_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="postage_cost" label="快递成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.postage_cost)" style="color: red;">{{scope.row.postage_cost}}</span>
							<span v-else>{{scope.row.postage_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="postage" label="快递毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.postage)" style="color: red;">{{scope.row.postage}}</span>
							<span v-else>{{scope.row.postage}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="clearance_income" label="关检收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.clearance_income)" style="color: red;">{{scope.row.clearance_income}}</span>
							<span v-else>{{scope.row.clearance_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="clearance_cost" label="关检成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.clearance_cost)" style="color: red;">{{scope.row.clearance_cost}}</span>
							<span v-else>{{scope.row.clearance_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="clearance" label="关检毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.clearance)" style="color: red;">{{scope.row.clearance}}</span>
							<span v-else>{{scope.row.clearance}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="exchange_income" label="数据收入" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.exchange_income)" style="color: red;">{{scope.row.exchange_income}}</span>
							<span v-else>{{scope.row.exchange_income}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="exchange_cost" label="数据成本" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.exchange_cost)" style="color: red;">{{scope.row.exchange_cost}}</span>
							<span v-else>{{scope.row.exchange_cost}}</span>
						</template>
					</el-table-column>
					<el-table-column align="right" prop="exchange" label="数据毛利" width="100" header-align="center">
						<template slot-scope="scope">
							<span v-if="checkdata(scope.row.exchange)" style="color: red;">{{scope.row.exchange}}</span>
							<span v-else>{{scope.row.exchange}}</span>
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<!-- <el-col :span="24" class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</el-col>-->
		</el-row>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
		<trackVisibleTag ref="addMission" v-if="trackVisible" :visible.sync="trackVisible" :frow="frow"></trackVisibleTag>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="frow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="frow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="frow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="frow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="frow"></viewVisibleTagTE>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="frow"></viewVisibleTagLC>
		<viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="frow"></viewVisibleTagIO>
	</div>
</template>
<script>
	import setVisibleVue from '.././af/css_p_r_eport_settle_af/column_setting'
	import trackVisibleVue from '.././af/order/orderTrack/af_order_track'
	import viewVisibleVueAE from '.././af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '.././af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '.././sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '.././sc/si/order/main/order_view.vue'
	import viewVisibleVueTE from '.././tc/te/order/main/order_view.vue'
	import viewVisibleVueLC from '.././lc/order/main/order_view.vue'
	import viewVisibleVueIO from '.././io/order/main/order_view.vue'

	import columns from '.././af/css_p_r_eport_settle_af/css_p_r_eport_settle_af_column.json'

	export default {
		data() {
			return {
				tableH: "750px",
				loading: false,
				showFlag: false,
				businessScopeFlag: true,
				businessScopeFlagSE: false,
				businessScopeFlag2: true,
				exportButtonFlag: false,
				financialDateFlag: false,
        checkJtFlag:false,
				trackVisible: false,
				viewVisible: false,
				constituteFlag: false,
				flightDateName: '开航日期',
				options: [],
        otherOrgs:[],
				awbFroms: [],
				businessProducts: [],
				goodsTypes: [],
				routingNames: [],
				chooseRoutingNames: [],
				businessScopeStr: '',
				tableColumns: [],
				shippingMethods: [],
				businessMethods: [],
				grossProfitStrs: [{
						code: '1',
						label: '全部',
						value: ''
					},
					{
						code: '2',
						label: '盈利',
						value: '1'
					},
					{
						code: '3',
						label: '亏损',
						value: '0'
					}
				],
				data1: [],
				deptoptions: [],
				data2: {
					a: "",
					b: "",
					c: "",
					d: "",
					e: "",
					f: "",
					g: "",
					h: "",
					i: "",
					j: "",
					k: "",
					l: "",
					m: ""
				},
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					goodsType: "",
					businessProduct: "",
					arrivalStation: "",
					departureStation: "",
          transitStation: "",
					financialDate: "",
					awbFromName: "",
					awbFromType: "",
					orderStatus: "已锁账",
					financialDateStart: "",
					financialDateEnd: "",
					grossProfitStr: "",
					flightDateStart: "",
					flightDateEnd: "",
					coopName: "",
					businessScope: "AE",
					routingName: "",
					awbNumber: "",
					orderCode: "",
					salesName: "",
					servicerName: "",
					expectFlight: "",
					shipVoyageNumber: "",
					salesDep: "",
					columnStrs: '',
					showConstituteFlag: false,
					goodsSourceCode: '',
					exitPort: '',
					shippingMethod: '',
					businessMethod: '',
          orderPermission: '',
          reportType: '',
          otherOrg:-1,
				},
				setVisible: false,
				frow: {},
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				flagAE: false,
				flagAI: false,
				flagSE: false,
				flagSI: false,
				flagTE: false,
				flagLC: false,
				flagIO: false
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'trackVisibleTag': trackVisibleVue,
			'viewVisibleTagAE': viewVisibleVueAE,
			'viewVisibleTagAI': viewVisibleVueAI,
			'viewVisibleTagSE': viewVisibleVueSE,
			'viewVisibleTagSI': viewVisibleVueSI,
			'viewVisibleTagTE': viewVisibleVueTE,
			'viewVisibleTagLC': viewVisibleVueLC,
			'viewVisibleTagIO': viewVisibleVueIO
		},
		provide() {
			return {
				awbSubmit: this.awbSubmit,
				findByPage: this.querySettleList
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
        this.checkJtFlag = true;

			if (this.query.businessScope == 'AE') {
				this.flagAE = true;
			} else {
				this.flagAE = false;
			}
			if (this.query.businessScope == 'AI') {
				this.flagAI = true;
			} else {
				this.flagAI = false;
			}
			if (this.query.businessScope == 'SE') {
				this.flagSE = true;
			} else {
				this.flagSE = false;
			}
			if (this.query.businessScope == 'SI') {
				this.flagSI = true;
			} else {
				this.flagSI = false;
			}
			if (this.query.businessScope == 'TE') {
				this.flagTE = true;
			} else {
				this.flagTE = false;
			}
			if (this.query.businessScope == 'LC') {
				this.flagLC = true;
			} else {
				this.flagLC = false;
			}
			if (this.query.businessScope == 'IO') {
				this.flagIO = true;
			} else {
				this.flagIO = false;
			}
			this.businessScopeStr = this.query.businessScope;
			//从数据库查询设置信息
			let pageName = '报表统计分析/结算报表';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let css_p_r_eport_settle_af_list_column = response.data.data;
					if (css_p_r_eport_settle_af_list_column && css_p_r_eport_settle_af_list_column.length > 0) {
						let arrayC = css_p_r_eport_settle_af_list_column
						if (arrayC && arrayC.length > 0) {
							this.tableColumns = this.sortBykey(arrayC, 'index');
						}
					} else {
						let strTwo = JSON.stringify(columns.cssPREportSettleAf);
						this.tableColumns = this.sortBykey(JSON.parse(strTwo), 'index');
					}
					//this.tableColumns = this.setLabel(this.tableColumns);
				}.bind(this));
			this.query.flightDateStart = this.getDateTime(new Date());
			//毛利状况
			if (this.grossProfitStrs) {
				this.query.grossProfitStr = this.grossProfitStrs[0].value || "";
			}
			//业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.options = response.data.data;

			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//运单来源
			this.$axios.get('/afbase/awb/selectCategory?category=运单所属').then(function(response) {
				this.awbFroms = response.data.data;
			}.bind(this));

			//航线查询
			this.$axios.get('/afbase/vAfCategory/航线').then((response) => {
				this.routingNames = response.data.data;
			});
			//服务产品
			this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
				this.businessProducts = response.data.data;
				if (this.businessProducts && this.businessProducts[0]) {
					// this.query.businessProduct = this.businessProducts[0].value;
				}
			}.bind(this));
			//货物类型
			this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
				this.goodsTypes = response.data.data;
				if (this.goodsTypes && this.goodsTypes[0]) {
					// this.query.goodsType = this.goodsTypes[0].value;
				}
			}.bind(this));

			//部门
			this.$axios.post('/prm/coopagreement/selectDept').then(function(response) {
				this.deptoptions = response.data.data.dataList;
			}.bind(this));

			this.$axios.get('/sc/vLcCategory/运输方式').then((response) => {
				this.shippingMethods = response.data.data;
			})

			this.$axios.get('/sc/vIoCategory/业务分类').then((response) => {
				this.businessMethods = response.data.data;
			})
			this.loadPermission(this.permission);
		},
		mounted() {
			this.setHeight();
		},
		methods: {
			sortIncomeFunctionalAmount(a, b) {
				return a.incomeFunctionalAmount.replace(/,/g, "") - b.incomeFunctionalAmount.replace(/,/g, "")
			},
			sortPieces(a, b) {
				return a.pieces.replace(/,/g, "") - b.pieces.replace(/,/g, "")
			},
			sortWeight(a, b) {
				return a.weight.replace(/,/g, "") - b.weight.replace(/,/g, "")
			},
			sortVolume(a, b) {
				return a.volume.replace(/,/g, "") - b.volume.replace(/,/g, "")
			},
			sortChargeWeight(a, b) {
				return a.chargeWeight.replace(/,/g, "") - b.chargeWeight.replace(/,/g, "")
			},
			sortCostFunctionalAmount(a, b) {
				return a.costFunctionalAmount.replace(/,/g, "") - b.costFunctionalAmount.replace(/,/g, "")
			},
			sortGrossProfit(a, b) {
				return a.grossProfit.replace(/,/g, "") - b.grossProfit.replace(/,/g, "")
			},
			sortGrossProfitWeight(a, b) {
				return a.grossProfitWeight.replace(/,/g, "") - b.grossProfitWeight.replace(/,/g, "")
			},
			sortMainRoutingGrossProfitWeight(a, b) {
				return a.mainRoutingGrossProfitWeight.replace(/,/g, "") - b.mainRoutingGrossProfitWeight.replace(/,/g, "")
			},
			setLabel(tableColumns) {
				let indexDelete = [];
				tableColumns.forEach((column, index) => {
					//主单号
					if (column.prop == 'awbNumber') {
						if (this.query.businessScope == 'TE') {
							column.label = "运单号码";
						} else if (this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
							column.label = "客户单号";
						}
					}
          if(column.prop == 'customerNumber'){
             if(this.query.businessScope == 'LC' || this.query.businessScope == 'IO'){
               indexDelete.push(index);
             }
          }
					//服务产品
					if (column.prop == 'businessProduct') {
						if (this.query.businessScope.startsWith('S') || this.query.businessScope == 'AI') {
							indexDelete.push(index);
						} else if (this.query.businessScope == 'TE') {
							column.label = "产品类型";
						} else if (this.query.businessScope == 'LC') {
							column.label = "运输方式";
						} else if (this.query.businessScope == 'IO') {
							column.label = "业务分类";
						} else {
							column.label = "服务产品";
						}
					}
					//始发地
					if (column.prop == 'departureStation') {
						if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('A')) {
							column.label = "始发港";
						} else if (this.query.businessScope == 'TE' || this.query.businessScope == 'IO') {
							column.label = "起运地";
						} else if (this.query.businessScope == 'LC') {
							column.label = "始发城市";
						}
					}
					//目的地
					if (column.prop == 'arrivalStation') {
						if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('A')) {
							column.label = "目的港";
						} else if (this.query.businessScope == 'TE' || this.query.businessScope == 'IO') {
							column.label = "目的地";
						} else if (this.query.businessScope == 'LC') {
							column.label = "目的城市";
						}
					}
          //中转港1或者中转港2
          if (column.prop == 'transitStation' || column.prop == 'transitStation2') {
              if (this.query.businessScope != "AE") {
                  indexDelete.push(index);
              }
          }
          //货源地
          if (column.prop == 'goodsSourceCode') {
              if (this.query.businessScope != "AE") {
                  indexDelete.push(index);
              }
          }
					//货源地
					if (column.prop == 'goodsSourceCode') {
						if (this.query.businessScope != "AE") {
							indexDelete.push(index);
						}
					}
					//航线
					if (column.prop == 'routingName') {
						if (this.query.businessScope == "TE" || this.query.businessScope == "LC" || this.query.businessScope == "IO") {
							indexDelete.push(index);
						}
					}
					//货物类型
					if (column.prop == 'goodsType') {
						if (this.query.businessScope == 'LC' || this.query.businessScope == "IO") {
							indexDelete.push(index);
						}
					}
					//开航日期
					if (column.prop == 'expectDeparture') {
						if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('A')) {
							if (this.query.businessScope.endsWith('E')) {
								column.label = "开航日期";
							} else {
								column.label = "到港日期";
							}
						} else if (this.query.businessScope == 'TE') {
							column.label = "发车日期";
						} else if (this.query.businessScope == 'LC') {
							column.label = "用车日期";
						} else if (this.query.businessScope == 'IO') {
							column.label = "业务日期";
						}
					}
					//供应商代码
					if (column.prop == 'supplierCode') {
						if (this.query.businessScope == "SI" || this.query.businessScope == "LC" || this.query.businessScope == "IO") {
							indexDelete.push(index);
						} else if (this.query.businessScope == "TE" || this.query.businessScope == "SE") {
							column.label = "订舱代理编码";
						} else if (this.query.businessScope.startsWith('A')) {
							column.label = "供应商代码";
						}
						// this.$delete(arrayC, i);
					}
					//运单来源
					if (column.prop == 'awbFrom') {
						if (this.query.businessScope == 'AE') {
							column.label = "运单来源";
						} else if (this.query.businessScope == 'SE' || this.query.businessScope == 'TE') {
							column.label = "订舱代理";
						} else {
							indexDelete.push(index);
						}
					}
					//航班号
					if (column.prop == 'expectFlight') {
						if (this.query.businessScope.startsWith('A')) {
							column.label = "航班号";
						} else if (this.query.businessScope.startsWith('S')) {
							column.label = "船次号";
						} else {
							indexDelete.push(index);
						}
					}
					//单位毛利
					if (column.prop == 'grossProfitWeight') {
						if (this.query.businessScope.startsWith('A')) {
							column.label = "单公斤毛利";
						} else {
							column.label = "单位毛利";
						}
					}
					//干线单位毛利
					if (column.prop == 'mainRoutingGrossProfitWeight') {
						if (this.query.businessScope.startsWith('A')) {
							column.label = "干线单公斤毛利";
						} else {
							column.label = "干线单位毛利";
						}
					}
					//件数
					if (column.prop == 'pieces') {
						if (this.query.businessScope.startsWith('A') || this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
							column.label = "件数";
						} else {
							column.label = "标箱数量";
						}
					}
					//计重
					if (column.prop == 'chargeWeight') {
						if (this.query.businessScope.startsWith('A') || this.query.businessScope == 'LC' || this.query.businessScope == 'IO') {
							column.label = "计重";
						} else {
							column.label = "计费吨";
						}
					}
				})
				if (indexDelete.length > 0) {
					indexDelete.sort(function(a, b) {
						return a - b;
					});
					for (let i = 0; i < indexDelete.length; i++) {
						this.$delete(tableColumns, indexDelete[i] - i);
					}
				}
				return tableColumns;
			},
			setConstituteFlag() {
				if (this.query.showConstituteFlag == true) {
					this.constituteFlag = true;
				} else {
					this.constituteFlag = false;
				}
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let css_settle_header = this.$refs.css_settle_header.offsetHeight;
					let heightS = window.innerHeight - 92 - css_settle_header;
					this.tableH = heightS + "px";
				});
			},
			cellWidth(newWidth, oldWidth, column, event) {
				if (column.label == '干线成本' || column.label == '干线收入' || column.label == '干线毛利' || column.label == '支线收入' || column.label == '支线成本' || column.label == '支线毛利' ||
					column.label == '操作收入' || column.label == '操作成本' || column.label == '操作毛利' || column.label == '包装收入' || column.label == '包装成本' || column.label == '包装毛利' ||
					column.label == '仓储收入' || column.label == '仓储成本' || column.label == '仓储毛利' || column.label == '快递收入' || column.label == '快递成本' || column.label == '快递毛利' ||
					column.label == '关检收入' || column.label == '关检成本' || column.label == '关检毛利' || column.label == '数据收入' || column.label == '数据成本' || column.label == '数据毛利') {
					return false;
				}
				let strColumn = JSON.stringify(this.tableColumns);
				let userId = window.localStorage.getItem('userId');
				let arrayC = JSON.parse(strColumn);
				if (arrayC && arrayC.length > 0) {
					arrayC.forEach(function(item, index) {
						if (column.label == item.label) {
							item.width = newWidth;
						}
					});
					arrayC = this.sortBykey(arrayC, 'index');
					/*if (this.constituteFlag) {
						arrayC.push({
							"label": "毛利构成",
							"prop": "constitute",
							"flag": "true",
							"index": 999,
							"width": 999,
							"align": "center",
							"sortable": false
						})
					}*/
					localStorage.setItem(userId + '_css_p_r_eport_settle_af_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.frow.businessScope = this.query.businessScope;
				this.setVisible = true;
			},
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (column.property === "awbNumber" || column.property === "orderCode") {
					return "awbNumber"
				} else {
					return ""
				}
			},
			//标题 style
			addCellStayle(data) {
				if (this.checkdata(data.row.grossProfit)) {
					let k = '';
					k = "color:red;"
					return k;
				} else {
					return "";
				}
			},
			formatter_column(row, column) {
				return row[column.property];
			},

			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			handlerCellClick(row, column, cell, event) {
				if ("订单号" == column['label']) {
					this.showView(row);
				} else if ("主单号" == column['label']) {
					if (row.awbNumber && row.businessScope == 'AE') {
						this.showTrack(row);
					}
				}
			},
			cellClick(row, label) {
				if ("订单号" == label) {
					this.showView(row);
				} else if ("主单号" == label) {
					if (row.awbNumber && row.businessScope == 'AE') {
						this.showTrack(row);
					}
				}
			},
			showTrack(row) {
				this.frow = row;
				this.frow.orderUuid = row.order_uuid;
				this.frow.activeName = 'editTab';
				this.trackVisible = true;
			},
			showView(row) {
				this.frow = row;
				this.frow.orderUuid = row.order_uuid;
				this.frow.orderId = row.order_id;
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
			awbSubmit(row) {},
			businessScopeChange() {
				this.data1 = []
				this.data2 = []
				this.query.routingName = ''
				this.chooseRoutingNames = []
				this.businessScopeStr = this.query.businessScope;
				if (this.query.businessScope == 'AE' || this.query.businessScope == 'SE') {
					this.businessScopeFlag = true;
					if (this.query.businessScope == 'SE') {
						this.businessScopeFlagSE = true;
					} else {
						this.businessScopeFlagSE = false;
					}
					this.flightDateName = '开航日期';
				} else {
					this.businessScopeFlag = false;
					if (this.query.businessScope.endsWith('I')) {
						this.flightDateName = '到港日期';
					} else if (this.query.businessScope == 'TE') {
						this.flightDateName = '发车日期';
					} else if (this.query.businessScope == 'IO') {
						this.flightDateName = '业务日期';
					} else {
						this.flightDateName = '用车日期';
					}

				}
				if (this.query.businessScope == 'AE' || this.query.businessScope == 'AI') {
					this.businessScopeFlag2 = true;
					this.$axios.get('/afbase/vAfCategory/航线').then((response) => {
						this.routingNames = response.data.data;
					});
				} else {
					this.businessScopeFlag2 = false;
					this.$axios.get('/afbase/vAfCategory/sc/航线').then((response) => {
						this.routingNames = response.data.data;
					});
				}
				if (this.query.businessScope.startsWith('S') || this.query.businessScope.startsWith('T')) {
					this.$axios.get('/sc/vScCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
					})
				} else if (this.query.businessScope.startsWith('L')) {
					this.$axios.get('/sc/vLcCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
					})
				} else if (this.query.businessScope == "IO") {
					this.$axios.get('/sc/vIoCategory/货物类型').then((response) => {
						this.goodsTypes = response.data.data;
					})
				} else {
					//货物类型
					this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
						this.goodsTypes = response.data.data;
					}.bind(this));
				}

			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			getSummaries(param) {
				const sums = [];
				sums[0] = '总计';
				let loaclJsonArray = param.columns;
				if (loaclJsonArray) {
					for (let i = 0; i < loaclJsonArray.length; i++) {
						if (this.data2) {
							if (loaclJsonArray[i].property === "orderCode") {
								sums[i] = this.data2.n; //订单
							}
							if (loaclJsonArray[i].property === "pieces") {
								sums[i] = this.data2.a; //件数
							}
							if (loaclJsonArray[i].property === "weight") {
								sums[i] = this.data2.o; //重量
							}
							if (loaclJsonArray[i].property === "chargeWeight") {
								sums[i] = this.data2.b;
							}
							if (loaclJsonArray[i].property === "incomeFunctionalAmount") {
								sums[i] = this.data2.c;
							}
							if (loaclJsonArray[i].property === "costFunctionalAmount") {
								sums[i] = this.data2.d;
							}
							if (loaclJsonArray[i].property === "grossProfit") {
								sums[i] = this.data2.e;
							}
							if (loaclJsonArray[i].property === "main_routing_income") {
								sums[i] = this.data2.f1;
							}
							if (loaclJsonArray[i].property === "main_routing_cost") {
								sums[i] = this.data2.f2;
							}
							if (loaclJsonArray[i].property === "main_routing") {
								sums[i] = this.data2.f;
							}
							if (loaclJsonArray[i].property === "feeder_income") {
								sums[i] = this.data2.g1;
							}
							if (loaclJsonArray[i].property === "feeder_cost") {
								sums[i] = this.data2.g2;
							}
							if (loaclJsonArray[i].property === "feeder") {
								sums[i] = this.data2.g;
							}
							if (loaclJsonArray[i].property === "operation_income") {
								sums[i] = this.data2.h1;
							}
							if (loaclJsonArray[i].property === "operation_cost") {
								sums[i] = this.data2.h2;
							}
							if (loaclJsonArray[i].property === "operation") {
								sums[i] = this.data2.h;
							}
							if (loaclJsonArray[i].property === "packaging_income") {
								sums[i] = this.data2.i1;
							}
							if (loaclJsonArray[i].property === "packaging_cost") {
								sums[i] = this.data2.i2;
							}
							if (loaclJsonArray[i].property === "packaging") {
								sums[i] = this.data2.i;
							}
							if (loaclJsonArray[i].property === "storage_income") {
								sums[i] = this.data2.j1;
							}
							if (loaclJsonArray[i].property === "storage_cost") {
								sums[i] = this.data2.j2;
							}
							if (loaclJsonArray[i].property === "storage") {
								sums[i] = this.data2.j;
							}
							if (loaclJsonArray[i].property === "postage_income") {
								sums[i] = this.data2.k1;
							}
							if (loaclJsonArray[i].property === "postage_cost") {
								sums[i] = this.data2.k2;
							}
							if (loaclJsonArray[i].property === "postage") {
								sums[i] = this.data2.k;
							}
							if (loaclJsonArray[i].property === "clearance_income") {
								sums[i] = this.data2.l1;
							}
							if (loaclJsonArray[i].property === "clearance_cost") {
								sums[i] = this.data2.l2;
							}
							if (loaclJsonArray[i].property === "clearance") {
								sums[i] = this.data2.l;
							}
							if (loaclJsonArray[i].property === "exchange_income") {
								sums[i] = this.data2.m1;
							}
							if (loaclJsonArray[i].property === "exchange_cost") {
								sums[i] = this.data2.m2;
							}
							if (loaclJsonArray[i].property === "exchange") {
								sums[i] = this.data2.m;
							}
						}
					}
				}
				return sums;
			},

			querySettleList() {
				if (this.query.businessScope == 'AE') {
					this.flagAE = true;
				} else {
					this.flagAE = false;
				}
				if (this.query.businessScope == 'AI') {
					this.flagAI = true;
				} else {
					this.flagAI = false;
				}
				if (this.query.businessScope == 'SE') {
					this.flagSE = true;
				} else {
					this.flagSE = false;
				}
				if (this.query.businessScope == 'SI') {
					this.flagSI = true;
				} else {
					this.flagSI = false;
				}
				if (this.query.businessScope == 'TE') {
					this.flagTE = true;
				} else {
					this.flagTE = false;
				}
				if (this.query.businessScope == 'LC') {
					this.flagLC = true;
				} else {
					this.flagLC = false;
				}
				if (this.query.businessScope == 'IO') {
					this.flagIO = true;
				} else {
					this.flagIO = false;
				}
        let orderPermission = window.localStorage.getItem('orderPermission');//当前用户的订单权限
        this.query.orderPermission = orderPermission;
				this.query.columnStrs = '';
				this.setHeight();
				//从数据库查询设置信息
				let pageName = '报表统计分析/结算报表';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let css_p_r_eport_settle_af_list_column = response.data.data;
						if (css_p_r_eport_settle_af_list_column && css_p_r_eport_settle_af_list_column.length > 0) {
							let arrayC = css_p_r_eport_settle_af_list_column
							if (arrayC && arrayC.length > 0) {
								this.tableColumns = this.sortBykey(arrayC, 'index');
							}
						} else {
							let str = JSON.stringify(columns.cssPREportSettleAf);
							let indexDelete = [];
							this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
						}
						//this.tableColumns = this.setLabel(this.tableColumns);
						this.loading = true
						if (this.query.financialDateStart || this.query.financialDateEnd) {
							this.financialDateFlag = true;
						} else {
							this.financialDateFlag = false;
						}
						this.query.routingName = this.chooseRoutingNames.join()
						this.$axios.post('/afbase/cssPReportSettleAf/page', this.query).then((response) => {
							this.loading = false
							this.data1 = response.data.data.resultOne;
							this.data2.a = response.data.data.resultTwo.pieces;
							this.data2.b = response.data.data.resultTwo.chargeWeight;
							this.data2.c = response.data.data.resultTwo.incomeFunctionalAmount;
							this.data2.d = response.data.data.resultTwo.costFunctionalAmount;
							this.data2.e = response.data.data.resultTwo.grossProfit;
							this.data2.f1 = response.data.data.resultTwo.main_routing_income;
							this.data2.f2 = response.data.data.resultTwo.main_routing_cost;
							this.data2.f = response.data.data.resultTwo.main_routing;
							this.data2.g1 = response.data.data.resultTwo.feeder_income;
							this.data2.g2 = response.data.data.resultTwo.feeder_cost;
							this.data2.g = response.data.data.resultTwo.feeder;
							this.data2.h1 = response.data.data.resultTwo.operation_income;
							this.data2.h2 = response.data.data.resultTwo.operation_cost;
							this.data2.h = response.data.data.resultTwo.operation;
							this.data2.i1 = response.data.data.resultTwo.packaging_income;
							this.data2.i2 = response.data.data.resultTwo.packaging_cost;
							this.data2.i = response.data.data.resultTwo.packaging;
							this.data2.j1 = response.data.data.resultTwo.storage_income;
							this.data2.j2 = response.data.data.resultTwo.storage_cost;
							this.data2.j = response.data.data.resultTwo.storage;
							this.data2.k1 = response.data.data.resultTwo.postage_income;
							this.data2.k2 = response.data.data.resultTwo.postage_cost;
							this.data2.k = response.data.data.resultTwo.postage;
							this.data2.l1 = response.data.data.resultTwo.clearance_income;
							this.data2.l2 = response.data.data.resultTwo.clearance_cost;
							this.data2.l = response.data.data.resultTwo.clearance;
							this.data2.m1 = response.data.data.resultTwo.exchange_income;
							this.data2.m2 = response.data.data.resultTwo.exchange_cost;
							this.data2.m = response.data.data.resultTwo.exchange;
							this.data2.n = "共" + response.data.data.resultTwo.order_sum + "票";
							this.data2.o = response.data.data.resultTwo.weight

						}).catch(err => {})
					}.bind(this));
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
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				// _month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				return _year + "-" + _month + "-01";
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
			exportExcel() {
				if (this.data1 && this.data1.length > 0) {

				} else {
					this.openError("请先搜索是否有数据，在进行导出");
					return false;
				}
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.query.columnStrs = JSON.stringify(this.sortBykey(this.setLabel(JSON.parse(JSON.stringify(this.tableColumns)))))
					this.exportExcelSure();
				}).catch(() => {
					this.query.columnStrs = JSON.stringify(this.sortBykey(this.setLabel(columns.cssPREportSettleAf)))
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				if (this.query.financialDateStart || this.query.financialDateEnd) {
					this.financialDateFlag = true;
				} else {
					this.financialDateFlag = false;
				}
				this.query.routingName = this.chooseRoutingNames.join()
				//let arrayList = this.setLabel(JSON.parse(this.query.columnStrs));
				let arrayList = JSON.parse(this.query.columnStrs);
				this.query.columnStrs = JSON.stringify(arrayList);
        this.query.reportType = 'settle';
				this.$axios.post3('/afbase/cssPReportSettleAf/exportExcel', this.query)
					.then((response) => {
						// console.log(response);
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '结算报表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}).catch(err => {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					})
				this.query.columnStrs = '';
			}

		}
	}
</script>
<style>
	.css_P_form .el-input__icon {
		line-height: 30px !important;
	}

	.css_P_form .el-form-item__content {
		line-height: 30px !important;
	}

	.css_P_form .el-input-group__prepend {
		padding: 0 6px;
	}

	.css_P_form .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	/*	.css_P_form .el-checkbox__inner {
		background-color: #FFF !important;
	}*/

	.css_P_form .el-button {
		margin-top: -5px !important
	}

	/* .awbNumber { */
		/* text-decoration: underline; */
	/* } */
</style>
