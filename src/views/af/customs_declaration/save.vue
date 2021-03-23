<template>
	<el-dialog :title="'报关单制作 - ' + titleName + ' - ' + manageType" fullscreen :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<!-- width="1310px"  style="top: -80px;" -->
		<div style="width: 1310px;margin: 0 auto;">
			<el-button :loading="buttonLoading" type="primary" size="mini" @click="submitForm('ruleForm')">保存</el-button>
			<el-button :loading="buttonLoading" type="primary" size="mini" @click="submitFormAndExport('ruleForm')">保存并导出</el-button>
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="80px" style="margin-top: 20px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="awbNumber" label="主运单号" label-width="110px">
							<el-input v-model="ruleForm.awbNumber" auto-complete="off" clearable style="width:195px;" maxlength="20">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="分运单号" label-width="110px">
							<el-input v-model="ruleForm.hawbNumber" auto-complete="off" clearable style="width:195px;" maxlength="40">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="预录入编号" label-width="110px">
							<el-input v-model="ruleForm.customsNumberPreEntry" auto-complete="off" clearable style="width:195px;" maxlength="30">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="海关编号" label-width="110px">
							<el-input v-model="ruleForm.customsNumber" auto-complete="off" clearable style="width:195px;" maxlength="30">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth table_col_top table_col_left">
						<el-form-item :label="sender" label-width="105px" style="margin-top: 10px;">
							<el-input v-model="ruleForm.shipperName" auto-complete="off" clearable style="width:150px;" disabled>
							</el-input>
							<el-button type="primary" size="mini" @click="gotoShipperConsigneePage(0)">选择</el-button>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item :label="outerType" style="margin-top: 10px;">
							<el-select v-model="ruleForm.ciqQreaCode" filterable remote placeholder="请输入关键词" @visible-change="ciqQreaCodeVisibleChange" :remote-method="ciqQreaCodeRemoteMethod" :loading="ciqQreaCodeLoading" style="width:150px;" clearable>
								<el-option v-for="item in ciqQreaCodesTemp" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
									<span style="float: left;">{{item.ediCode1}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<span style="float: right;">{{item.paramText}}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item :label="eventDateLabel" style="margin-top: 10px;">
							<el-date-picker v-model="ruleForm.exportImportDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择出口日期" style="width: 150px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="申报日期" style="margin-top: 10px;">
							<el-date-picker v-model="ruleForm.declareDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择申报日期" style="width: 150px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top table_col_right">
						<el-form-item label="备案号" style="margin-top: 10px;">
							<el-input v-model="ruleForm.manualNumber" auto-complete="off" clearable style="width:150px;" maxlength="30">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_top table_col_left">
						<el-form-item :label="receiver" label-width="105px" style="margin-top: 10px;">
							<el-input v-model="ruleForm.consigneeName" auto-complete="off" clearable style="width:150px;" disabled>
							</el-input>
							<el-button type="primary" size="mini" @click="gotoShipperConsigneePage(1)">选择</el-button>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="运输方式" style="margin-top: 10px;" prop="transportMode">
							<el-select v-model="ruleForm.transportMode" filterable remote placeholder="请输入关键词" style="width:150px;" clearable>
								<el-option v-for="item in transportModes" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="运输工具" style="margin-top: 10px;">
							<el-input v-model="ruleForm.transportName" auto-complete="off" clearable style="width:150px;" maxlength="30">
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth table_col_top" v-if="isLoading">
						<el-form-item label="提运单号" style="margin-top: 10px;">
							<el-input :value="ruleForm.awbNumber+(ruleForm.hawbNumber?('_'+ruleForm.hawbNumber):'')" auto-complete="off" clearable style="width:150px;" disabled>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth table_col_top table_col_right" v-else style="width: 482px;">
            <el-form-item label="提运单号" style="margin-top: 10px;">
              <el-input :value="ruleForm.awbNumber+(ruleForm.hawbNumber?('_'+ruleForm.hawbNumber):'')" auto-complete="off" clearable style="width:390px;" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth table_col_top table_col_right" style="margin-left: -7px;" v-if="isLoading">
            <el-form-item label="货物存放地点" label-width="96px" style="margin-top: 10px;">
              <el-select style="width:150px;margin-left: -9px" v-model="ruleForm.warehouseId" filterable remote placeholder="请输入关键词" @visible-change="warehouseVisibleChange" :remote-method="warehouseRemoteMethod" :loading="warehouseLoading" clearable>
                <el-option v-for="item in warehousesTemp" :key="item.warehouseId" :label="item.warehouseNameCn" :value="item.warehouseId">
                  <span style="float: left;">{{item.warehouseCode}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span style="float: right;">{{item.warehouseNameCn}}  {{item.apCode}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
				</el-row>

				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_top table_col_left">
						<el-form-item label="生产销售单位" label-width="105px" style="margin-top: 10px;">
							<el-input v-model="ruleForm.salesConsumptionName" auto-complete="off" clearable style="width:150px;" disabled>
							</el-input>
							<el-button type="primary" size="mini" @click="gotoSalesConsumption">选择</el-button>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="监管方式" style="margin-top: 10px;" prop="tradeMode">
							<el-select v-model="ruleForm.tradeMode" filterable remote placeholder="请输入关键词" @visible-change="tradeModeVisibleChange" :remote-method="tradeModeRemoteMethod" :loading="tradeModeLoading" style="width:150px;" clearable>
								<el-option v-for="item in tradeModesTemp" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="征免性质" style="margin-top: 10px;" prop="cutMode">
							<el-select v-model="ruleForm.cutMode" filterable remote placeholder="请输入关键词" @visible-change="cutModeVisibleChange" :remote-method="cutModeRemoteMethod" :loading="cutModeLoading" style="width:150px;" clearable>
								<el-option v-for="item in cutModesTemp" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top" v-if="isLoading">
						<el-form-item label="许可证号" style="margin-top: 10px;">
							<el-input v-model="ruleForm.licenseNumber" auto-complete="off" clearable style="width:150px;" maxlength="20">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top table_col_right" v-else style="width: 482px;">
						<el-form-item label="许可证号" style="margin-top: 10px;">
							<el-input v-model="ruleForm.licenseNumber" auto-complete="off" clearable style="width:390px;" maxlength="20">
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth table_col_top table_col_right" style="margin-left: -16px;" v-if="isLoading">
            <el-form-item label="启运港" label-width="96px" style="margin-top: 10px;">
              <el-select v-model="ruleForm.portDepartureArrival" filterable remote placeholder="请输入关键词" @visible-change="portDepartureArrivalVisibleChange" :remote-method="portDepartureArrivalRemoteMethod" :loading="portDepartureArrivalLoading" style="width:150px;" clearable>
                <el-option v-for="item in portDepartureArrivalsTemp" :key="item.nationCodeThree" :label="item.nationNameCn" :value="item.nationCodeThree">
                  <span style="float: left;">{{item.nationCodeThree}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span style="float: right;">{{item.nationNameCn}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_top table_col_left">
						<el-form-item label="合同协议号" label-width="105px" style="margin-top: 10px;">
							<el-input v-model="ruleForm.contractNumber" auto-complete="off" clearable style="width:210px;" maxlength="50">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="贸易国" style="margin-top: 10px;">
							<el-select v-model="ruleForm.countryTrade" filterable remote placeholder="请输入关键词" @visible-change="countryTradeVisibleChange" :remote-method="countryTradeRemoteMethod" :loading="countryTradeLoading" style="width:150px;" clearable>
								<el-option v-for="item in countryTradesTemp" :key="item.nationCodeThree" :label="item.nationNameCn" :value="item.nationCodeThree">
									<span style="float: left;">{{item.nationCodeThree}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<span style="float: right;">{{item.nationNameCn}}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item :label="arriverCountry" style="margin-top: 10px;">
							<el-select v-model="ruleForm.countryDepartureArrival" filterable remote placeholder="请输入关键词" @visible-change="countryDepartureArrivalVisibleChange" :remote-method="countryDepartureArrivalRemoteMethod" :loading="countryDepartureArrivalLoading" style="width:150px;" clearable>
								<el-option v-for="item in countryDepartureArrivalsTemp" :key="item.nationCodeThree" :label="item.nationNameCn" :value="item.nationCodeThree">
									<span style="float: left;">{{item.nationCodeThree}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<span style="float: right;">{{item.nationNameCn}}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item :label="transPort" style="margin-top: 10px;">
							<el-select v-model="ruleForm.countryDepartureArrival1" filterable remote placeholder="请输入关键词" @visible-change="countryDepartureArrival1VisibleChange" :remote-method="countryDepartureArrival1RemoteMethod" :loading="countryDepartureArrival1Loading" style="width:150px;" clearable>
								<el-option v-for="item in countryDepartureArrival1sTemp" :key="item.nationCodeThree" :label="item.nationNameCn" :value="item.nationCodeThree">
									<span style="float: left;">{{item.nationCodeThree}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<span style="float: right;">{{item.nationNameCn}}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top table_col_right">
						<el-form-item :label="departPortLabel" style="margin-top: 10px;">
							<el-select v-model="ruleForm.exportImportPort" filterable remote placeholder="请输入关键词" @visible-change="exportImportPortVisibleChange" :remote-method="exportImportPortRemoteMethod" :loading="exportImportPortLoading" style="width:150px;" clearable>
								<el-option v-for="item in exportImportPortsTemp" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
									<span style="float: left;">{{item.ediCode1}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<span style="float: right;">{{item.paramText}}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_top table_col_left">
						<el-form-item label="包装种类" label-width="105px" style="margin-top: 10px;">
							<el-select v-model="ruleForm.packageType" filterable remote placeholder="请输入关键词" style="width:210px;" clearable>
								<el-option v-for="item in packageTypes" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="件数" style="margin-top: 10px;">
							<el-input v-model="ruleForm.pieces" auto-complete="off" @input="checkInt(ruleForm,'pieces')" clearable style="width:150px;" maxlength="8">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="净重(千克)" style="margin-top: 10px;">
							<el-input v-model="ruleForm.netWeight" auto-complete="off" @input="checkFloat(ruleForm,'netWeight')" clearable style="width:150px;" maxlength="14">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top">
						<el-form-item label="运费" style="margin-top: 10px;">
							<el-input v-model="ruleForm.feeRate" auto-complete="off" @input="checkFloat(ruleForm,'feeRate')" clearable style="width:150px;" maxlength="14">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_top table_col_right">
						<el-form-item label="保费(%)" style="margin-top: 10px;">
							<el-input v-model="ruleForm.insurRate" @input="checkFloat(ruleForm,'insurRate')" auto-complete="off" clearable style="width:150px;" maxlength="14">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_left">
						<el-form-item label="毛重(千克)" label-width="405px" style="margin-top: -10px;">
							<el-input v-model="ruleForm.grossWeight" @input="checkFloat(ruleForm,'grossWeight')" auto-complete="off" clearable style="width:150px;" maxlength="14">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="成交方式" style="margin-top: -10px;">
							<el-select v-model="ruleForm.transMode" filterable remote placeholder="请输入关键词" style="width:150px;" clearable>
								<el-option v-for="item in transModes" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="币制" style="margin-top: -10px;">
							<el-select v-model="ruleForm.feeCurrency" filterable remote placeholder="请输入关键词" style="width:150px;" clearable>
								<el-option v-for="item in feeCurrencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_right">
						<el-form-item label="杂费" style="margin-top: -10px;">
							<el-input v-model="ruleForm.otherRate" @input="checkFloat(ruleForm,'otherRate')" auto-complete="off" clearable style="width:150px;" maxlength="14">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_top table_col_left table_col_right">
						<el-form-item label="随附单证" label-width="105px" style="margin-top: 10px;">
							<el-select v-model="edocCodes" multiple remote filterable reserve-keyword placeholder="请输入关键词" style="width:1170px;" clearable>
								<el-option v-for="item in edocCodeList" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_top table_col_left table_col_right">
						<el-form-item label="标记唛码及备注" label-width="80px" style="margin-top: 10px;margin-left: 25px;">
							<el-input type="textarea" :rows="3" maxlength="500" v-model="ruleForm.marksNotes" auto-complete="off" style="width:1170px;">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col customers_declaration">
						<div style="margin-top: 10px;margin-left: 20px;margin-bottom: 10px;">金额合计： {{total}}</div>
						<el-table :data="ruleForm.detailList" stripe border style="width:1285px;" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
							<el-table-column align="center" width="50">
								<template slot="header">
									<i class="iconfont el-icon-myyuanquanjiahao" @click="addDetail" style="cursor: pointer;size: b5;color: #409EFF;"></i>
								</template>
								<template slot-scope="scope">
									<i class="iconfont el-icon-myjianhao" @click="deleteDetail(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
								</template>
							</el-table-column>
							<el-table-column align="center" label="项号" width="75">
								<template slot-scope="scope">
									<el-input style="margin-top: 0px;" size="small" v-model="scope.row.itemNumber" maxlength="5"></el-input>
								</template>
							</el-table-column>
							<el-table-column align="center" label="商品编号/规格型号" width="450">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.productCode" filterable remote :remote-method="productNameRemoteMethod" @visible-change="productNameVisibleChange" @focus="productNameFocus(scope.row)" @clear="productNameClear(scope.row)" @change="productNameChange" :loading="productNameLoading" placeholder="商品编号" style="width:355px;" clearable>
										<el-option v-for="item in scope.row.products" :key="item.tariffId" :label="item.productName" :value="item.productCode">
											<span style="float: left;">{{item.productCode}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
											<span style="float: right;">{{item.productName}}</span>
										</el-option>
									</el-select>
									<el-button type="primary" size="mini" @click="clickSpecificationModel(scope.row)" :disabled="!scope.row.productCode">申报要素</el-button>
									<el-input style="margin-top: 5px;" class="textarea" type="textarea" v-model="scope.row.specificationModel" disabled>
									</el-input>
								</template>
							</el-table-column>
							<el-table-column align="center" label="数量" width="120">
								<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.quantity1" @input="checkFloat(scope.row,'quantity1')" placeholder="成交数量" clearable maxlength="14">
									</el-input>
									<el-input style="margin-top: 5px;" size="small" v-model="scope.row.quantity2" @input="checkFloat(scope.row,'quantity2')" placeholder="法定数量1" clearable maxlength="14">
									</el-input>
									<el-input style="margin-top: 5px;" size="small" v-model="scope.row.quantity3" @input="checkFloat(scope.row,'quantity3')" placeholder="法定数量2" clearable maxlength="14">
									</el-input>
								</template>
							</el-table-column>
							<el-table-column align="center" label="单位" width="100">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.unit1" filterable remote placeholder="成交单位" @visible-change="unit1VisibleChange" :remote-method="unit1RemoteMethod" :loading="listLoading" @focus="productNameFocus(scope.row)" clearable>
										<el-option v-for="item in scope.row.unit1s" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
										</el-option>
									</el-select>
									<el-select style="margin-top: 5px;" size="small" v-model="scope.row.unit2" filterable remote placeholder="法定单位1" @visible-change="unit2VisibleChange" :remote-method="unit2RemoteMethod" @focus="productNameFocus(scope.row)" :loading="listLoading" clearable>
										<el-option v-for="item in scope.row.unit2s" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
										</el-option>
									</el-select>
									<el-select style="margin-top: 5px;" size="small" v-model="scope.row.unit3" filterable remote placeholder="法定单位2" @visible-change="unit3VisibleChange" :remote-method="unit3RemoteMethod" @focus="productNameFocus(scope.row)" :loading="listLoading" clearable>
										<el-option v-for="item in scope.row.unit3s" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column align="center" label="币制/单价/总价" width="110">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.currency" filterable remote placeholder="币制" clearable>
										<el-option v-for="item in feeCurrencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
										</el-option>
									</el-select>
									<el-input style="margin-top: 5px;" size="small" v-model="scope.row.declPrice" @input="checkFloat(scope.row,'declPrice')" clearable placeholder="单价" maxlength="14"></el-input>
									<el-input style="margin-top: 5px;" size="small" v-model="scope.row.declTotal" @input="checkFloat(scope.row,'declTotal')" @change="calculateTotal" clearable placeholder="总价" maxlength="14"></el-input>
								</template>
							</el-table-column>
							<el-table-column align="center" label="原产国" width="95">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.countryOrigin" filterable remote placeholder="请输入" @visible-change="countryOriginVisibleChange" :remote-method="countryOriginRemoteMethod" :loading="listLoading" @focus="productNameFocus(scope.row)" clearable>
										<el-option v-for="item in scope.row.countryOrigins" :key="item.nationCodeThree" :label="item.nationNameCn" :value="item.nationCodeThree">
											<span style="float: left;">{{item.nationCodeThree}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
											<span style="float: right;">{{item.nationNameCn}}</span>
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column align="center" label="最终目的国" width="95">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.countryDestination" filterable remote placeholder="请输入" @visible-change="countryDestinationVisibleChange" :remote-method="countryDestinationRemoteMethod" :loading="listLoading" @focus="productNameFocus(scope.row)" clearable>
										<el-option v-for="item in scope.row.countryDestinations" :key="item.nationCodeThree" :label="item.nationNameCn" :value="item.nationCodeThree">
											<span style="float: left;">{{item.nationCodeThree}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
											<span style="float: right;">{{item.nationNameCn}}</span>
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column align="center" label="境内目的地" width="95">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.districtCode" filterable remote placeholder="请输入" @visible-change="districtCodeVisibleChange" :remote-method="districtCodeRemoteMethod" :loading="listLoading" @focus="productNameFocus(scope.row)" clearable>
										<el-option v-for="item in scope.row.districtCodes" :key="item.areaCode" :label="item.areaNameCn" :value="item.areaCode">
											<span style="float: left;">{{item.areaCode}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
											<span style="float: right;">{{item.areaNameCn}}</span>
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column align="center" label="征免">
								<template slot-scope="scope">
									<el-select size="small" v-model="scope.row.cutMode" filterable remote placeholder="请输入" clearable>
										<el-option v-for="item in cutModeDetails" :key="item.ediCode1" :label="item.paramText" :value="item.ediCode1">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_bottom table_col_left table_col_right" style="width: 1289px;">
						<el-checkbox style="margin-top: 10px;margin-bottom: 10px;margin-left: 20px;" v-model="ruleForm.specFlag1">特殊关系确认</el-checkbox>
						<el-checkbox style="margin-top: 10px;margin-bottom: 10px;" v-model="ruleForm.specFlag2">价格影响确认</el-checkbox>
						<el-checkbox style="margin-top: 10px;margin-bottom: 10px;" v-model="ruleForm.specFlag3">支付特权使用费确认</el-checkbox>
						<el-checkbox style="margin-top: 10px;margin-bottom: 10px;" v-model="ruleForm.specFlag4">自提自缴</el-checkbox>
					</el-col>
				</el-row>
				<el-row style="margin-top: 0px;">
					<el-col class="elementWidth table_col_left">
						<el-form-item label="报关人员" style="margin-top: 10px;" label-width="105px">
							<el-input v-model="ruleForm.customsDeclarer" auto-complete="off" clearable style="width:150px;" maxlength="50">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="报关人员证号" style="margin-top: 10px;" label-width="100px">
							<el-input v-model="ruleForm.customsDeclarerCertificateNumber" auto-complete="off" clearable style="width:150px;" maxlength="50">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_right" style="width: 762px;">
						<el-form-item label="电话" style="margin-top: 10px;" label-width="60px">
							<el-input v-model="ruleForm.customsDeclarerPhoneNumber" auto-complete="off" clearable style="width:150px;" maxlength="50">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth table_col_left table_col_right table_col_bottom" style="width: 1289px;">
						<el-form-item label="申报单位" style="margin-top: -10px;" label-width="105px">
							<el-input v-model="ruleForm.customsAgentCode" placeholder="申报单位代码" auto-complete="off" clearable style="width:150px;" maxlength="50">
							</el-input>
							<el-input v-model="ruleForm.customsAgentName" placeholder="申报单位名称" auto-complete="off" clearable style="width:476px;" maxlength="200">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<shipperConsignee ref="addMission" v-if="shipperAndConsigneeVisible" :visible.sync="shipperAndConsigneeVisible" :frow="ffrow"></shipperConsignee>
		<specificationModel ref="addMission" v-if="specificationModelVisible" :visible.sync="specificationModelVisible" :frow="ffrow"></specificationModel>
	</el-dialog>
</template>
<script>
	import SpecificationModel from '@/views/af/customs_declaration/specificationModel'
	import ShipperConsignee from '@/views/public/shipper_consignee_select'
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
        isLoading: false,
        titleName: '出口',
        sender: '境内发货人',
        receiver: '境外收货人',
        outerType: '出境关别',
        arriverCountry: '运抵国',
        transPort: '指运港',
        departPortLabel: '离境口岸',
        eventDateLabel: '出口日期',
        manageType: '新增',
				data: [],
				ciqQreaCodes: [],
				ciqQreaCodesTemp: [],
				transportModes: [],
				tradeModes: [],
				tradeModesTemp: [],
				cutModeDetails: [],
        warehouses: [],
        warehousesTemp: [],
				cutModes: [],
				cutModesTemp: [],
				countrys: [],
        portDepartureArrivalsTemp: [],
				countryTradesTemp: [],
				exportImportPorts: [],
				exportImportPortsTemp: [],
				packageTypes: [],
				transModes: [],
				feeCurrencys: [],
				edocCodes: [],
				edocCodeList: [],
				productsInit: [],
				units: [],
				districtCodes: [],
				countryDepartureArrivalsTemp: [],
				countryDepartureArrival1sTemp: [],
				shipperAndConsigneeVisible: false,
				specificationModelVisible: false,
				ciqQreaCodeLoading: false,
				tradeModeLoading: false,
				cutModeLoading: false,
				warehouseLoading: false,
				countryTradeLoading: false,
				exportImportPortLoading: false,
        portDepartureArrivalLoading: false,
				countryDepartureArrival1Loading: false,
				countryDepartureArrivalLoading: false,
				productNameLoading: false,
				listLoading: false,
				buttonLoading: false,
				ffrow: {},
				ruleForm: {
          customsDeclarationId: '',
					businessScope: 'AE',
					awbNumber: '',
					hawbNumber: '',
					customsNumberPreEntry: '',
					customsNumber: '',
					shipperName: '',
					shipperCode: '',
					consigneeCode: '',
					consigneeName: '',
					ciqQreaCode: '',
					exportImportDate: '',
					declareDate: '',
					manualNumber: '',
					transportMode: '',
					transportName: '',
					salesConsumptionCode: '',
					salesConsumptionName: '',
					tradeMode: '',
					cutMode: '',
          warehouseId: '',
					licenseNumber: '',
					contractNumber: '',
					countryTrade: '',
          portDepartureArrival: '',
					countryDepartureArrival: '',
					countryDepartureArrival1: '',
					exportImportPort: '',
					packageType: '',
					pieces: '',
					grossWeight: '',
					netWeight: '',
					transMode: '',
					feeCurrency: '',
					edocCode: '',
					marksNotes: '',
					specFlag1: false,
					specFlag2: false,
					specFlag3: false,
					specFlag4: false,
					customsDeclarer: '',
					customsDeclarerCertificateNumber: '',
					customsDeclarerPhoneNumber: '',
					customsAgentCode: '',
					customsAgentName: '',
					detailList: []
				},
				total: '0.00000',
				rules: {
					awbNumber: [{
						required: true,
						message: '请输入主运单号',
						trigger: ['blur', 'change']
					}],
					transportMode: [{
						required: true,
						message: '请输入运输方式',
						trigger: ['blur', 'change']
					}],
					tradeMode: [{
						required: true,
						message: '请输入监管方式',
						trigger: ['blur', 'change']
					}],
					cutMode: [{
						required: true,
						message: '请输入征免性质',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		components: {
			specificationModel: SpecificationModel,
			shipperConsignee: ShipperConsignee
		},
		provide() {
			return {
				setShipperConsigneeValue2: this.shipperConsigneeCallback,
				specificationModelCallBack: this.specificationModelCallBack
			}
		},
		methods: {
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "")
				if (row[prop].startsWith('0')) {
					row[prop] = '0'
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if (t.length > 1) {
					if (prop == 'declPrice' || prop == 'declTotal') {
						row[prop] = t[0] + "." + t[1].substr(0, 4)
					} else {
						row[prop] = t[0] + "." + t[1].substr(0, 5)
					}
				} else {
					if (row[prop].startsWith('0')) {
						row[prop] = '0'
					}
				}
			},
			headerCellStyle({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return 'background:#FDF5E6'
			},
			cellStyle({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return 'vertical-align: top;'
			},
			calculateTotal() {
				let total = 0.0
				this.ruleForm.detailList.forEach(item => {
					if (item.declTotal) {
						total += parseFloat(item.declTotal + '')
					}
				})
				this.total = total.toFixed(5).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
				this.total = this.total.substring(0, this.total.lastIndexOf(',')) + this.total.substring(this.total.lastIndexOf(',') + 1)
			},
			addDetail() {
				this.ruleForm.detailList.push({
					itemNumber: '',
					productCode: '',
					productName: '',
					products: [],
					specificationModel: '',
					quantity1: '',
					unit1: '',
					unit1s: [],
					quantity2: '',
					unit2: '',
					unit2s: [],
					quantity3: '',
					unit3: '',
					unit3s: [],
					currency: this.ruleForm.feeCurrency,
					declPrice: '',
					declTotal: '',
					countryOrigin: '',
					countryOrigins: [],
					countryDestination: '',
					countryDestinations: [],
					districtCode: '',
					districtCodes: [],
					cutMode: '',
          warehouseId: ''
				})
			},
			deleteDetail(index, row) {
				this.ruleForm.detailList.splice(index, 1)
				this.calculateTotal()
			},
			clickSpecificationModel(row) {
				this.frow.currRow = row
				this.ffrow.product = row.products.find(item => item.productCode == row.productCode)
				this.ffrow.elements = row.specificationModel
				this.specificationModelVisible = true
			},
			specificationModelCallBack(row) {
				this.frow.currRow.specificationModel = row.val
			},
			shipperConsigneeCallback(row) {
				if (this.frow.isSalesConsumption) {
					this.ruleForm.salesConsumptionName = row.scName
					this.ruleForm.salesConsumptionCode = row.scCode
				} else {
					if (row.scType === 1) {
						this.ruleForm.consigneeName = row.scName
						this.ruleForm.consigneeCode = row.scCode
					} else {
						this.ruleForm.shipperName = row.scName
						this.ruleForm.shipperCode = row.scCode
					}
				}
			},
			gotoShipperConsigneePage(scType) {
				this.frow.isSalesConsumption = false
				this.ffrow.scType = scType
				if (scType === 1) {
					this.ffrow.rowBean = {
						scType: 1,
						scName: this.ruleForm.consigneeName,
						scCode: this.ruleForm.consigneeCode,
						scPrintRemark: ''
					}
				} else {
					this.ffrow.rowBean = {
						scType: 0,
						scName: this.ruleForm.shipperName,
						scCode: this.ruleForm.shipperCode,
						scPrintRemark: ''
					}
				}

				this.shipperAndConsigneeVisible = true
			},
			gotoSalesConsumption() {
				this.frow.isSalesConsumption = true
				this.ffrow.scType = 0
        if(this.frow.businessScope=='AI'){
          this.ffrow.scType = 1
        }
				this.ffrow.rowBean = {
					scType:  this.ffrow.scType,
					scName: this.ruleForm.salesConsumptionName,
					scCode: this.ruleForm.salesConsumptionCode,
					scPrintRemark: ''
				}
				this.shipperAndConsigneeVisible = true
			},
			ciqQreaCodeRemoteMethod(query) {
				if (query) {
					this.ciqQreaCodeLoading = true;
					setTimeout(() => {
						this.ciqQreaCodeLoading = false;
						this.ciqQreaCodesTemp = this.ciqQreaCodes.filter(item => {
							return item.paramText.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.ediCode1.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.ciqQreaCodesTemp = this.ciqQreaCodes.slice(0, 10)
				}
			},
			ciqQreaCodeVisibleChange(flag) {
				if (flag) {
					this.ciqQreaCodesTemp = this.ciqQreaCodes.slice(0, 10)
					if (this.ruleForm.ciqQreaCode && !this.ciqQreaCodesTemp.some(item => item.ediCode1 == this.ruleForm.ciqQreaCode)) {
						this.ciqQreaCodesTemp = this.ciqQreaCodesTemp.concat(this.ciqQreaCodes.filter(item => item.ediCode1 == this.ruleForm.ciqQreaCode))
					}
				}
			},
			tradeModeRemoteMethod(query) {
				if (query) {
					this.tradeModeLoading = true;
					setTimeout(() => {
						this.tradeModeLoading = false;
						this.tradeModesTemp = this.tradeModes.filter(item => {
							return item.paramText.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.tradeModesTemp = this.tradeModes.slice(0, 10)
				}
			},
			tradeModeVisibleChange(flag) {
				if (flag) {
					this.tradeModesTemp = this.tradeModes.slice(0, 10)
					if (this.ruleForm.tradeMode && !this.tradeModesTemp.some(item => item.ediCode1 == this.ruleForm.tradeMode)) {
						this.tradeModesTemp = this.tradeModesTemp.concat(this.tradeModes.filter(item => item.ediCode1 == this.ruleForm.tradeMode))
					}
				}
			},
			cutModeRemoteMethod(query) {
				if (query) {
					this.cutModeLoading = true;
					setTimeout(() => {
						this.cutModeLoading = false;
						this.cutModesTemp = this.cutModes.filter(item => {
							return item.paramText.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.cutModesTemp = this.cutModes.slice(0, 10)
				}
			},
			warehouseRemoteMethod(query) {
				if (query) {
					this.warehouseLoading = true;
					setTimeout(() => {
						this.warehouseLoading = false;
						this.warehousesTemp = this.warehouses.filter(item => {
							return item.warehouseNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1
                || item.warehouseCode.toLowerCase().indexOf(query.toLowerCase()) > -1
                || item.apCode.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.warehousesTemp = this.warehouses.slice(0, 10)
				}
			},
			cutModeVisibleChange(flag) {
				if (flag) {
					this.cutModesTemp = this.cutModes.slice(0, 10)
					if (this.ruleForm.cutMode && !this.cutModesTemp.some(item => item.ediCode1 == this.ruleForm.cutMode)) {
						this.cutModesTemp = this.cutModesTemp.concat(this.cutModes.filter(item => item.ediCode1 == this.ruleForm.cutMode))
					}
				}
			},
			warehouseVisibleChange(flag) {
				if (flag) {
					this.warehousesTemp = this.warehouses.slice(0, 10)
					if (this.ruleForm.warehouseId && !this.warehousesTemp.some(item => item.warehouseId == this.ruleForm.warehouseId)) {
						this.warehousesTemp = this.warehousesTemp.concat(this.warehouses.filter(item => item.warehouseId == this.ruleForm.warehouseId))
					}
				}
			},
			countryTradeRemoteMethod(query) {
				if (query) {
					this.countryTradeLoading = true;
					setTimeout(() => {
						this.countryTradeLoading = false;
						this.countryTradesTemp = this.countrys.filter(item => {
							return item.nationNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.nationCodeThree.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.countryTradesTemp = this.countrys.slice(0, 10)
				}
			},
			countryTradeVisibleChange(flag) {
				if (flag) {
					this.countryTradesTemp = this.countrys.slice(0, 10)
					if (this.ruleForm.countryTrade && !this.countryTradesTemp.some(item => item.nationCodeThree == this.ruleForm.countryTrade)) {
						this.countryTradesTemp = this.countryTradesTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryTrade))
					}
				}
			},
			portDepartureArrivalRemoteMethod(query) {
				if (query) {
					this.portDepartureArrivalLoading = true;
					setTimeout(() => {
						this.portDepartureArrivalLoading = false;
						this.portDepartureArrivalsTemp = this.countrys.filter(item => {
							return item.nationNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.nationCodeThree.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.portDepartureArrivalsTemp = this.countrys.slice(0, 10)
				}
			},
			portDepartureArrivalVisibleChange(flag) {
				if (flag) {
					this.portDepartureArrivalsTemp = this.countrys.slice(0, 10)
					if (this.ruleForm.portDepartureArrival && !this.portDepartureArrivalsTemp.some(item => item.nationCodeThree == this.ruleForm.portDepartureArrival)) {
						this.portDepartureArrivalsTemp = this.portDepartureArrivalsTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.portDepartureArrival))
					}
				}
			},
			countryDepartureArrival1RemoteMethod(query) {
				if (query) {
					this.countryDepartureArrival1Loading = true;
					setTimeout(() => {
						this.countryDepartureArrival1Loading = false;
						this.countryDepartureArrival1sTemp = this.countrys.filter(item => {
							return item.nationNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.nationCodeThree.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.countryDepartureArrival1sTemp = this.countrys.slice(0, 10)
				}
			},
			countryDepartureArrival1VisibleChange(flag) {
				if (flag) {
					this.countryDepartureArrival1sTemp = this.countrys.slice(0, 10)
					if (this.ruleForm.countryDepartureArrival1 && !this.countryDepartureArrival1sTemp.some(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival1)) {
						this.countryDepartureArrival1sTemp = this.countryDepartureArrival1sTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival1))
					}
				}
			},
			countryDepartureArrivalRemoteMethod(query) {
				if (query) {
					this.countryDepartureArrivalLoading = true;
					setTimeout(() => {
						this.countryDepartureArrivalLoading = false;
						this.countryDepartureArrivalsTemp = this.countrys.filter(item => {
							return item.nationNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.nationCodeThree.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.countryDepartureArrivalsTemp = this.countrys.slice(0, 10)
				}
			},
			countryDepartureArrivalVisibleChange(flag) {
				if (flag) {
					this.countryDepartureArrivalsTemp = this.countrys.slice(0, 10)
					if (this.ruleForm.countryDepartureArrival && !this.countryDepartureArrivalsTemp.some(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival)) {
						this.countryDepartureArrivalsTemp = this.countryDepartureArrivalsTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival))
					}
				}
			},
			exportImportPortRemoteMethod(query) {
				if (query) {
					this.exportImportPortLoading = true;
					setTimeout(() => {
						this.exportImportPortLoading = false;
						this.exportImportPortsTemp = this.exportImportPorts.filter(item => {
							return item.paramText.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.ediCode1.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.exportImportPortsTemp = this.exportImportPorts.slice(0, 10)
				}
			},
			exportImportPortVisibleChange(flag) {
				if (flag) {
					this.exportImportPortsTemp = this.exportImportPorts.slice(0, 10)
					if (this.ruleForm.exportImportPort && !this.exportImportPortsTemp.some(item => item.ediCode1 == this.ruleForm.exportImportPort)) {
						this.exportImportPortsTemp = this.exportImportPortsTemp.concat(this.exportImportPorts.filter(item => item.ediCode1 == this.ruleForm.exportImportPort))
					}
				}
			},
			productNameRemoteMethod(query) {
				if (query) {
					this.productNameLoading = true;
					setTimeout(() => {
						this.$axios.get('/afbase/tariff/' + query)
							.then((response) => {
								this.frow.currRow.products = response.data.data
								this.productNameLoading = false
							})
					}, 200)
				} else {
					this.frow.currRow.products = this.productsInit.concat([])
				}
			},
			productNameVisibleChange(flag) {
				if (flag) {
					if (this.frow.currRow.productCode && !this.productsInit.some(item => item.productCode == this.frow.currRow.productCode)) {
						this.productNameLoading = true
						this.$axios.get('/afbase/tariff/view/' + this.frow.currRow.productCode)
							.then((response) => {
								this.frow.currRow.products = this.productsInit.concat([])
								this.frow.currRow.products.push(response.data.data)
								this.productNameLoading = false
							})
					} else {
						this.frow.currRow.products = this.productsInit.concat([])
					}
				}
			},
			productNameFocus(row) {
				this.frow.currRow = row
			},
			productNameChange(val) {
				if (val) {
					let product = this.frow.currRow.products.filter(item => item.productCode == val)[0]
					this.frow.currRow.productName = product.productName
					this.frow.currRow.unit1 = product.legalFirstUnitCode
					this.frow.currRow.unit2 = product.legalFirstUnitCode
					this.frow.currRow.unit3 = product.secondUnitCode
					if (this.frow.currRow.unit1 && !this.frow.currRow.unit1s.some(item => item.unitCode == this.frow.currRow.unit1)) {
						this.frow.currRow.unit1s = this.frow.currRow.unit1s.concat(this.units.filter(item => item.unitCode == this.frow.currRow.unit1))
					}
					if (this.frow.currRow.unit2 && !this.frow.currRow.unit2s.some(item => item.unitCode == this.frow.currRow.unit2)) {
						this.frow.currRow.unit2s = this.frow.currRow.unit2s.concat(this.units.filter(item => item.unitCode == this.frow.currRow.unit2))
					}
					if (this.frow.currRow.unit3 && !this.frow.currRow.unit3s.some(item => item.unitCode == this.frow.currRow.unit3)) {
						this.frow.currRow.unit3s = this.frow.currRow.unit3s.concat(this.units.filter(item => item.unitCode == this.frow.currRow.unit3))
					}
					this.frow.currRow.specificationModel = product.elements.split('$').map(item => item.split(':')[1] + ':').join('|')
				}
			},
			productNameClear(row) {
				row.productName = ''
				row.unit1 = ''
				row.unit2 = ''
				row.unit3 = ''
				row.specificationModel = ''
			},
			unit1RemoteMethod(query) {
				if (query) {
					this.listLoading = true;
					setTimeout(() => {
						this.listLoading = false;
						this.frow.currRow.unit1s = this.units.filter(item => {
							return item.unitName.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.frow.currRow.unit1s = this.units.slice(0, 10)
				}
			},
			unit1VisibleChange(flag) {
				if (flag) {
					this.frow.currRow.unit1s = this.units.slice(0, 10)
					if (this.frow.currRow.unit1 && !this.frow.currRow.unit1s.some(item => item.unitCode == this.frow.currRow.unit1)) {
						this.frow.currRow.unit1s = this.frow.currRow.unit1s.concat(this.units.filter(item => item.unitCode == this.frow.currRow.unit1))
					}
				}
			},
			unit2RemoteMethod(query) {
				if (query) {
					this.listLoading = true;
					setTimeout(() => {
						this.listLoading = false;
						this.frow.currRow.unit2s = this.units.filter(item => {
							return item.unitName.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.frow.currRow.unit2s = this.units.slice(0, 10)
				}
			},
			unit2VisibleChange(flag) {
				if (flag) {
					this.frow.currRow.unit2s = this.units.slice(0, 10)
					if (this.frow.currRow.unit2 && !this.frow.currRow.unit2s.some(item => item.unitCode == this.frow.currRow.unit2)) {
						this.frow.currRow.unit2s = this.frow.currRow.unit2s.concat(this.units.filter(item => item.unitCode == this.frow.currRow.unit2))
					}
				}
			},
			unit3RemoteMethod(query) {
				if (query) {
					this.listLoading = true;
					setTimeout(() => {
						this.listLoading = false;
						this.frow.currRow.unit3s = this.units.filter(item => {
							return item.unitName.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.frow.currRow.unit3s = this.units.slice(0, 10)
				}
			},
			unit3VisibleChange(flag) {
				if (flag) {
					this.frow.currRow.unit3s = this.units.slice(0, 10)
					if (this.frow.currRow.unit3 && !this.frow.currRow.unit3s.some(item => item.unitCode == this.frow.currRow.unit3)) {
						this.frow.currRow.unit3s = this.frow.currRow.unit3s.concat(this.units.filter(item => item.unitCode == this.frow.currRow.unit3))
					}
				}
			},

			countryOriginRemoteMethod(query) {
				if (query) {
					this.listLoading = true;
					setTimeout(() => {
						this.listLoading = false;
						this.frow.currRow.countryOrigins = this.countrys.filter(item => {
							return item.nationNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.nationCodeThree.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.frow.currRow.countryOrigins = this.countrys.slice(0, 10)
				}
			},
			countryOriginVisibleChange(flag) {
				if (flag) {
					this.frow.currRow.countryOrigins = this.countrys.slice(0, 10)
					if (this.frow.currRow.countryOrigin && !this.frow.currRow.countryOrigins.some(item => item.nationCodeThree == this.frow.currRow.countryOrigin)) {
						this.frow.currRow.countryOrigins = this.frow.currRow.countryOrigins.concat(this.countrys.filter(item => item.nationCodeThree == this.frow.currRow.countryOrigin))
					}
				}
			},
			countryDestinationRemoteMethod(query) {
				if (query) {
					this.listLoading = true;
					setTimeout(() => {
						this.listLoading = false;
						this.frow.currRow.countryDestinations = this.countrys.filter(item => {
							return item.nationNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.nationCodeThree.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.frow.currRow.countryDestinations = this.countrys.slice(0, 10)
				}
			},
			countryDestinationVisibleChange(flag) {
				if (flag) {
					this.frow.currRow.countryDestinations = this.countrys.slice(0, 10)
					if (this.frow.currRow.countryDestination && !this.frow.currRow.countryDestinations.some(item => item.nationCodeThree == this.frow.currRow.countryDestination)) {
						this.frow.currRow.countryDestinations = this.frow.currRow.countryDestinations.concat(this.countrys.filter(item => item.nationCodeThree == this.frow.currRow.countryDestination))
					}
				}
			},
			districtCodeRemoteMethod(query) {
				if (query) {
					this.listLoading = true;
					setTimeout(() => {
						this.listLoading = false;
						this.frow.currRow.districtCodes = this.districtCodes.filter(item => {
							return item.areaNameCn.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.areaCode.toLowerCase().indexOf(query.toLowerCase()) > -1
						}).slice(0, 10)
					}, 200)
				} else {
					this.frow.currRow.districtCodes = this.districtCodes.slice(0, 10)
				}
			},
			districtCodeVisibleChange(flag) {
				if (flag) {
					this.frow.currRow.districtCodes = this.districtCodes.slice(0, 10)
					if (this.frow.currRow.districtCode && !this.frow.currRow.districtCodes.some(item => item.areaCode == this.frow.currRow.districtCode)) {
						this.frow.currRow.districtCodes = this.frow.currRow.districtCodes.concat(this.districtCodes.filter(item => item.areaCode == this.frow.currRow.districtCode))
					}
				}
			},
			submitForm(formName) {
				this.buttonLoading = true
				this.ruleForm.edocCode = this.edocCodes.join()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/afbase/customsDeclaration', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.openSuccess('保存成功')
									window.opener.queryList()
									this.handleClose()
								} else {
									this.openError(response.data.messageInfo)
									this.buttonLoading = false
								}
							}).catch((error) => {
								this.buttonLoading = false
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							})
					} else {
						this.buttonLoading = false
						return false
					}
				})
			},
			submitFormAndExport(formName) {
				this.buttonLoading = true
				this.ruleForm.edocCode = this.edocCodes.join()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/afbase/customsDeclaration', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.openSuccess('保存成功，请等待下载...')
									window.opener.queryList();
									this.exportExcel(response.data.data);
								} else {
									this.openError(response.data.messageInfo);
									this.buttonLoading = false;
								}
							}).catch((error) => {
								this.buttonLoading = false;
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							})
					} else {
						this.buttonLoading = false
						return false
					}
				})
			},
    view(id) {
      this.pageLoading = true
      this.$axios.get('/afbase/customsDeclaration/view/' + id)
        .then((response) => {
          if (response.data.code == 0) {
            this.ruleForm = response.data.data
            if (this.ruleForm.edocCode) {
              this.edocCodes = this.ruleForm.edocCode.split(',')
            }
            this.$axios.get('/afbase/customsDeclarationDetail/' + id)
              .then((response2) => {
                this.ruleForm.detailList = response2.data.data
                this.calculateTotal()
              })
            if (this.ciqQreaCodesTemp.length > 0 && this.ruleForm.ciqQreaCode && !this.ciqQreaCodesTemp.some(item => item.ediCode1 == this.ruleForm.ciqQreaCode)) {
              this.ciqQreaCodesTemp = this.ciqQreaCodesTemp.concat(this.ciqQreaCodes.filter(item => item.ediCode1 == this.ruleForm.ciqQreaCode))
            }
            if (this.tradeModesTemp.length > 0 && this.ruleForm.tradeMode && !this.tradeModesTemp.some(item => item.ediCode1 == this.ruleForm.tradeMode)) {
              this.tradeModesTemp = this.tradeModesTemp.concat(this.tradeModes.filter(item => item.ediCode1 == this.ruleForm.tradeMode))
            }
            if (this.warehousesTemp.length > 0 && this.ruleForm.cutMode && !this.warehousesTemp.some(item => item.warehouseId == this.ruleForm.warehouseId)) {
              this.warehousesTemp = this.warehousesTemp.concat(this.warehouses.filter(item => item.warehouseId == this.ruleForm.warehouseId))
            }
            if (this.cutModesTemp.length > 0 && this.ruleForm.cutMode && !this.cutModesTemp.some(item => item.ediCode1 == this.ruleForm.cutMode)) {
              this.cutModesTemp = this.cutModesTemp.concat(this.cutModes.filter(item => item.ediCode1 == this.ruleForm.cutMode))
            }
            if (this.countryTradesTemp.length > 0 && this.ruleForm.countryTrade && !this.countryTradesTemp.some(item => item.nationCodeThree == this.ruleForm.countryTrade)) {
              this.countryTradesTemp = this.countryTradesTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryTrade))
            }
            if (this.portDepartureArrivalsTemp.length > 0 && this.ruleForm.portDepartureArrival && !this.portDepartureArrivalsTemp.some(item => item.nationCodeThree == this.ruleForm.portDepartureArrival)) {
              this.portDepartureArrivalsTemp = this.portDepartureArrivalsTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.portDepartureArrival))
            }
            if (this.countryDepartureArrivalsTemp.length > 0 && this.ruleForm.countryDepartureArrival && !this.countryDepartureArrivalsTemp.some(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival)) {
              this.countryDepartureArrivalsTemp = this.countryDepartureArrivalsTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival))
            }
            if (this.countryDepartureArrival1sTemp.length > 0 && this.ruleForm.countryDepartureArrival1 && !this.countryDepartureArrival1sTemp.some(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival1)) {
              this.countryDepartureArrival1sTemp = this.countryDepartureArrival1sTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival1))
            }
            if (this.exportImportPortsTemp.length > 0 && this.ruleForm.exportImportPort && !this.exportImportPortsTemp.some(item => item.ediCode1 == this.ruleForm.exportImportPort)) {
              this.exportImportPortsTemp = this.exportImportPortsTemp.concat(this.exportImportPorts.filter(item => item.ediCode1 == this.ruleForm.exportImportPort))
            }
          } else {
            this.openError(response.data.messageInfo);
          }
          this.pageLoading = false
        }).catch((error) => {
        this.pageLoading = false
        let errorinfo = error.response.data.messageInfo;
        this.openError(errorinfo);
      })

    },
			getCurrDateAndCurrMonthLastDay() {
				//获取当前日期
				let date = new Date();
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if (months < 10) {
					months = '0' + months
				}
				if (days < 10) {
					days = '0' + days
				}
				let datas = date.getFullYear() + '-' + months + '-' + days;
				return datas
			},
			exportExcel(customsDeclarationId) {
				this.$axios.post3('/afbase/customsDeclaration/exportExcel/' + customsDeclarationId)
					.then((response) => {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '空运'+this.titleName+'报关单_'+this.ruleForm.awbNumber+(this.ruleForm.hawbNumber?('_'+this.ruleForm.hawbNumber):'') + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
						this.handleClose()
					}).catch((error) => {
						this.buttonLoading = false
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			handleClose() {
				setTimeout(() => {
					let userAgent = navigator.userAgent;
					if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
						window.open('', '_self').close()
					} else {
						window.opener = null;
						window.open("about:blank", "_self");
						window.close();
					}
				}, 2000)
			},
			init() {
				//出境关别
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/19')
					.then((response) => {
						this.ciqQreaCodes = response.data.data
						this.ciqQreaCodesTemp = this.ciqQreaCodes.slice(0, 10)
            if (this.ruleForm.customsDeclarationId && this.ruleForm.ciqQreaCode && !this.ciqQreaCodesTemp.some(item => item.ediCode1 == this.ruleForm.ciqQreaCode)) {
              this.ciqQreaCodesTemp = this.ciqQreaCodesTemp.concat(this.ciqQreaCodes.filter(item => item.ediCode1 == this.ruleForm.ciqQreaCode))
            }
					})
				//运输方式
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/20')
					.then((response) => {
						this.transportModes = response.data.data
						if (!this.ruleForm.customsDeclarationId && this.transportModes && this.transportModes.length > 0) {
							this.ruleForm.transportMode = this.transportModes[0].ediCode1
						}
					})
				//监管方式
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/21')
					.then((response) => {
						this.tradeModes = response.data.data
						this.tradeModesTemp = this.tradeModes.slice(0, 10)
            if(this.ruleForm.customsDeclarationId){
              if (this.ruleForm.tradeMode && !this.tradeModesTemp.some(item => item.ediCode1 == this.ruleForm.tradeMode)) {
                this.tradeModesTemp = this.tradeModesTemp.concat(this.tradeModes.filter(item => item.ediCode1 == this.ruleForm.tradeMode))
              }
            }else{
              if (this.tradeModesTemp && this.tradeModesTemp.length > 0) {
                this.ruleForm.tradeMode = this.tradeModesTemp[0].ediCode1
              }
            }

					})
				//征免性质
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/22')
					.then((response) => {
						this.cutModes = response.data.data
						this.cutModesTemp = this.cutModes.slice(0, 10)
            if(this.ruleForm.customsDeclarationId){
              if (this.ruleForm.cutMode && !this.cutModesTemp.some(item => item.ediCode1 == this.ruleForm.cutMode)) {
                this.cutModesTemp = this.cutModesTemp.concat(this.cutModes.filter(item => item.ediCode1 == this.ruleForm.cutMode))
              }
            }else{
              if (this.cutModesTemp && this.cutModesTemp.length > 0) {
                this.ruleForm.cutMode = this.cutModesTemp[0].ediCode1
              }
            }

					})
        //货物存放地点
        this.$axios.get('/afbase/warehouse/getWarehouseListByQuery/'+this.frow.businessScope)
          .then((response) => {
            this.warehouses = response.data.data
            this.warehousesTemp = this.warehouses.slice(0, 10)
            if(this.ruleForm.customsDeclarationId){
              if (this.ruleForm.warehouseId && !this.warehousesTemp.some(item => item.warehouseId == this.ruleForm.warehouseId)) {
                this.warehousesTemp = this.warehousesTemp.concat(this.warehouses.filter(item => item.warehouseId == this.ruleForm.warehouseId))
              }
            // }else{
            //   if (this.warehousesTemp && this.warehousesTemp.length > 0) {
            //     this.ruleForm.warehouseId = this.warehousesTemp[0].warehouseId
            //   }
            }
          })
				//贸易国
				//运抵国
				//指运港
				this.$axios.get('/afbase/airport/queryNationWithNationCodeThreeIsNotNull')
					.then((response) => {
						this.countrys = response.data.data
						this.countryTradesTemp = this.countrys.slice(0, 10)
						this.countryDepartureArrivalsTemp = this.countrys.slice(0, 10)
						this.countryDepartureArrival1sTemp = this.countrys.slice(0, 10)
						this.portDepartureArrivalsTemp = this.countrys.slice(0, 10)
            if(this.ruleForm.customsDeclarationId){
              if (this.ruleForm.countryTrade && !this.countryTradesTemp.some(item => item.nationCodeThree == this.ruleForm.countryTrade)) {
                this.countryTradesTemp = this.countryTradesTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryTrade))
              }
              if (this.ruleForm.countryDepartureArrival && !this.countryDepartureArrivalsTemp.some(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival)) {
                this.countryDepartureArrivalsTemp = this.countryDepartureArrivalsTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival))
              }
              if (this.ruleForm.countryDepartureArrival1 && !this.countryDepartureArrival1sTemp.some(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival1)) {
                this.countryDepartureArrival1sTemp = this.countryDepartureArrival1sTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.countryDepartureArrival1))
              }
              if (this.ruleForm.portDepartureArrival && !this.portDepartureArrivalsTemp.some(item => item.nationCodeThree == this.ruleForm.portDepartureArrival)) {
                this.portDepartureArrivalsTemp = this.portDepartureArrivalsTemp.concat(this.countrys.filter(item => item.nationCodeThree == this.ruleForm.portDepartureArrival))
              }
            }
					})
				//离境口岸
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/29')
					.then((response) => {
						this.exportImportPorts = response.data.data
						this.exportImportPortsTemp = this.exportImportPorts.slice(0, 10)
            if (this.ruleForm.customsDeclarationId && this.ruleForm.exportImportPort && !this.exportImportPortsTemp.some(item => item.ediCode1 == this.ruleForm.exportImportPort)) {
              this.exportImportPortsTemp = this.exportImportPortsTemp.concat(this.exportImportPorts.filter(item => item.ediCode1 == this.ruleForm.exportImportPort))
            }
					})
				//包装种类
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/24')
					.then((response) => {
						this.packageTypes = response.data.data
					})
				//成交方式
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/25')
					.then((response) => {
						this.transModes = response.data.data
					})
				//附件单证
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/26')
					.then((response) => {
						this.edocCodeList = response.data.data
					})
				//币制
				this.$axios.get('/afbase/vCurrencyRate')
					.then((response) => {
						this.feeCurrencys = response.data.data
					})
				//明细列表产品数据源
				this.$axios.get('/afbase/tariff/null')
					.then((response) => {
						this.productsInit = response.data.data
					})
				//明细列表单位数据源
				this.$axios.get('/afbase/tariffUnit')
					.then((response) => {
						this.units = response.data.data
					})
				//明细列表境内目的地数据源
				this.$axios.get('/afbase/prmCategoryEciq')
					.then((response) => {
						this.districtCodes = response.data.data
					})
				//明细列表征免性质数据源
				this.$axios.get('/afbase/category/queryCategoryByCategoryType/27')
					.then((response) => {
						this.cutModeDetails = response.data.data
					})
			}
		},
		created() {
			this.init();
      this.ruleForm.businessScope = this.frow.businessScope;
			if(this.frow.businessScope=='AI'){
			  this.isLoading = true;
        this.titleName = "进口";
        this.sender = "境外发货人";
        this.receiver = "境内收货人";
        this.outerType = "进境关别";
        this.arriverCountry = "启运国";
        this.transPort = "经停港";
        this.departPortLabel = "入境口岸";
        this.eventDateLabel = "进口日期";
      }
			if(this.frow.customsDeclarationId){
			  this.manageType = '编辑';
        this.view(this.frow.customsDeclarationId)
      }
		}
	}
</script>
<style type="text/css">
	.table_col {
		border: 2px solid #DCDFE6;
	}
	.table_col_left {
		border-left: 2px solid #DCDFE6;
	}

	.table_col_top {
		border-top: 2px solid #DCDFE6;
	}

	.table_col_right {
		border-right: 2px solid #DCDFE6;
	}

	.table_col_bottom {
		border-bottom: 2px solid #DCDFE6;
	}

	.customers_declaration .el-input__icon {
		line-height: 30px !important;
	}

	.textarea textarea {
		height: 65px;
	}
</style>
