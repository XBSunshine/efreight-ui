<template>
	<el-dialog title="单证制作 - 分单详情" top="1vh" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<form>
			<div id="form-container" class="awb_body">
				<div id="form-main">
					<div id="form-title" class="horizontal">
						<div id="mawb_carriercode" class="horizontal" v-show="false">
							<input :disabled="true" v-model="ruleForm.awbNumberPrefix" type="text" class="TextBox" id="mawbcodePrefix" name="mawbcodePrefix" readonly="readonly"></input>
						</div>
						<div id="mawb_departurecode" class="horizontal">
							<sub class="required">*</sub>
							<input :disabled="true" v-model="ruleForm.departureStation" type="text" class="TextBox" name="departure_code" id="departure_code">
						</div>
						<div id="mawb_suffixcode" class="horizontal" v-show="false">
							<input :disabled="true" v-model="ruleForm.awbNumberSuffix" type="text" class="TextBox" id="mawbcodeSuffix" name="mawbcodeSuffix" readonly="readonly">
						</div>
						<div class="horizontal" style="position: relative;left: 300px;top: 5px;">
							<span class="label">HAWB Number<sub class="required">*</sub></span>
							<input disabled="disabled" v-model="ruleForm.hawbNumber" style="width: 150px;" type="text" class="TextBox" id="hawbNumber" name="hawbNumber" maxlength="50">
						</div>
						<el-button style="margin-left: 500px;" type="primary" size="small" @click="printG">格打</el-button>
						<el-button style="margin-left: 5px;" type="primary" size="small" @click="printT">套打</el-button>
						<el-button style="margin-left: 5px;" type="primary" size="small" @click="sendHawb" v-if="sendHawbFlag">发送分单</el-button>
					</div>
					<div id="form-inner">
						<div id="form-left">
							<div id="shipper">
								<div id="shipper-head">
									<span class="label">Shipper's Name and Address<sub class="required">*</sub></span>
									<div id="account-div">
										<span class="label">Shipper's Account Number</span>
									</div>
								</div>
								<textarea :disabled="true" v-model="ruleForm.shipperAddress" id="ConsignorParty_show" name="ConsignorParty_show" rows="4" cols="61"></textarea>
							</div>
							<div id="consignee">
								<div id="consignee-head">
									<span class="label">Consignee's Name and Address<sub class="required">*</sub></span>
									<div id="account-div">
										<span class="label">Consignee's Account Number</span>
									</div>
								</div>
								<textarea :disabled="true" v-model="ruleForm.consigneeAddress" id="ConsigneeParty_show" name="ConsigneeParty_show" rows="4" cols="61" @dblclick="showShipperAndConsignee(1)"></textarea>
							</div>
							<div id="forwarder">
								<div id="forwarder-head">
									<span class="label">Issuing Carrier's Agent Name and City<sub class="required">*</sub></span>
								</div>
								<textarea :disabled="true" v-model="ruleForm.issueAgentName" id="forwarder_p" name="forwarder_p" rows="4" cols="61"></textarea>
							</div>
							<div id="agent">
								<div id="agent-iatacode">
									<span class="label">Agent's IATA Code<sub class="required">*</sub></span>
									<input :disabled="true" v-model="ruleForm.agentIataCode" type="text" id="iatacode" name="iatacode" class="TextBox">
								</div>
								<div id="accoutno">
									<span class="label">Account No.</span>
									<input :disabled="true" v-model="ruleForm.accountNo" type="text" id="accoutno_i" name="accoutno_i" class="TextBox">
								</div>
							</div>
							<div id="airport-departure">
								<span class="label">Airport of Departure (addr. Of First Carrier) and Requested Routing<sub class="required">*</sub></span>
								<input :disabled="true" v-model="ruleForm.departureStationName" type="text" id="departure_name" name="departure_name" class="TextBox">
								<span id="airportname"></span>
							</div>
							<div id="routing">
								<div id="first-to">
									<span class="label">To<sub class="required">*</sub></span>
									<input :disabled="true" v-model="ruleForm.arrivalStation" type="text" id="mawb_to1" name="mawb_to1" class="TextBox" maxlength="4">
								</div>
								<div id="first-carrier">
									<span class="label">By First Carrier<sub class="required">*</sub></span>
									<input :disabled="true" v-model="ruleForm.mawb_by1" type="text" id="mawb_by1" name="mawb_by1" class="TextBox" readonly="readonly" maxlength="2">
								</div>
								<div id="second-to">
									<span class="label">to</span>
									<input :disabled="true" v-model="ruleForm.transitStation" type="text" id="mawb_to2" name="mawb_to2" class="TextBox" maxlength="4">
								</div>
								<div id="second-carrier">
									<span class="label">by</span>
									<input :disabled="true" v-model="ruleForm.transitStationBy" type="text" id="mawb_by2" name="mawb_by2" class="TextBox" maxlength="2">
								</div>
								<div id="third-to">
									<span class="label">to</span>
									<input :disabled="true" v-model="ruleForm.transitStation2" type="text" id="mawb_to3" name="mawb_to3" class="TextBox" maxlength="4">
								</div>
								<div id="third-carrier">
									<span class="label">by</span>
									<input :disabled="true" v-model="ruleForm.transitStationBy2" type="text" id="mawb_by3" name="mawb_by3" class="TextBox" maxlength="2">
								</div>
							</div>
							<div id="flight">
								<div id="airport-destination">
									<span class="label">Airport of Destination<sub class="required">*</sub></span>
									<input :disabled="true" v-model="ruleForm.arrivalStationName" type="text" id="destination_code" name="destination_code" class="TextBox" style="display: none;">
									<input :disabled="true" v-model="ruleForm.arrivalStationName" type="text" id="destination_name" name="destination_name" class="TextBox" maxlength="30">
								</div>
								<div id="flight-detail">
									<div id="head-label">
										<span class="label">Requested Flight/Date<sub class="required">*</sub></span>
									</div>
									<div id="input-div">

										<div id="first-flight">
											<input :disabled="true" v-model="ruleForm.flightNumber" type="text" id="flightno" name="flightno" class="TextBox" style="font-size: smaller;width: 44px;" />
											<input :disabled="true" v-model="ruleForm.flightDate" type="text" id="flightdate" name="flightdate" class="TextBox" style="font-size: smaller;width: 84px;" />
										</div>
										<div id="second-flight">
											<input :disabled="true" v-model="ruleForm.flightNumber2" type="text" id="flightno2" name="flightno2" class="TextBox" style="font-size: smaller;width: 44px;">
											<input :disabled="true" v-model="ruleForm.flightDate2" type="text" id="flightdate2" name="flightdate2" class="TextBox" style="font-size: smaller;width: 84px;">
										</div>

									</div>
								</div>
							</div>
						</div>
						<div id="form-right">
							<div id="mawb">
								<div>
									<span class="label">House Air Waybill</span>
									<span id="showprex" class="awb_code">{{ruleForm.hawbNumber}}</span>
									<span id="showcode" class="code"></span>
								</div>
								<textarea :disabled="true" v-model="ruleForm.carrierName" id="associatedparty_textarea" name="associatedparty_textarea"></textarea>
								<span id="validity">Copies 1, 2 and 3 of this House Air Waybill are originals and have the same validity</span>
							</div>
							<div id="mawb-memo">
								<div>It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE HEREOF. ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE. THE SHIPPER’S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER’S LIMITATION OF LIABILITY. Shipper may increase such limitation of liability by declaring a higher value for carriage and paying a supplemental charge if required.
								</div>
							</div>
							<div id="accounting">
								<div id="information">
									<span class="label">Accounting Information</span>
									<textarea :disabled="true" v-model="ruleForm.accountingInformation" id="Accounting" name="Accounting" rows="4" cols="61"></textarea>
								</div>
								<div id="reference">
									<div id="reference-number">
										<span class="label">Reference Number</span>
									</div>
									<div id="optional-shipping-information">
										<span class="label">Optional Shipping Information</span>
									</div>
								</div>
								<div id="payment">
									<div id="currency">
										<span class="label">Currency</span>
										<input :disabled="true" v-model="ruleForm.awbCurrency" type="text" id="currencyid" name="currencyid" class="TextBox" maxlength="3">
									</div>
									<div id="chgscode">
										<span class="label">CHGS Code</span>
									</div>
									<div id="WT-VAL">
										<span class="label">WT/VAL</span>
										<div id="PPD">
											<span class="label">PPD</span>
											<input :disabled="true" v-model="ruleForm.payMethod" type="radio" id="radio_WTVAL" name="radio_WTVAL" value="PP" checked="checked">
										</div>
										<div id="COLL">
											<span class="label">COLL</span>
											<input :disabled="true" v-model="ruleForm.payMethod" type="radio" id="radio_WTVAL" name="radio_WTVAL" value="CC">
										</div>
									</div>
									<div id="other">
										<span class="label">Other</span>
										<div id="PPD">
											<span class="label">PPD</span>
											<input :disabled="true" v-model="ruleForm.payMethodOther" type="radio" id="radio_mawb_otherppcc" name="radio_mawb_otherppcc" value="PP" checked="checked">
										</div>
										<div id="COLL">
											<span class="label">COLL</span>
											<input :disabled="true" v-model="ruleForm.payMethodOther" type="radio" id="radio_mawb_otherppcc" name="radio_mawb_otherppcc" value="CC">
										</div>
									</div>
									<div id="declared-value-for-carriage">
										<span class="label">Declared Value for Carriage</span>
										<input :disabled="true" v-model="ruleForm.declaredValueOfCarriage" type="text" id="mawb_carriagevalue" name="mawb_carriagevalue" class="TextBox" maxlength="18">
									</div>
									<div id="declared-value-for-customs">
										<span class="label">Declared Value for Customs</span>
										<input :disabled="true" v-model="ruleForm.declaredValueOfCustoms" type="text" id="mawb_customsvalue" name="mawb_customsvalue" class="TextBox" maxlength="18">
									</div>
									<div id="insurance">
										<span class="label">Amount of Insurance</span>
										<input :disabled="true" v-model="ruleForm.amountOfInsurance" type="text" id="mawb_insuranceamount" name="mawb_insuranceamount" class="TextBox" maxlength="18">
									</div>
									<div id="insurance-memo">
										<span class="label">
									INSURANCE: If Carrier offers insurance, and such insurance is requested in accordance with the conditions thereof, indicate amount to be insured in figures in box marked 'Amount of insurance'
								</span>
									</div>
								</div>
							</div>
						</div>
						<div id="form">
							<div id="handling">
								<div id="handling-information" class="horizontal">
									<span class="label">Handling Information</span>
									<textarea :disabled="true" v-model="ruleForm.handingInformation" id="handling_information_textarea" name="handling_information_textarea" rows="4" cols="61"></textarea>
								</div>
								<div id="notify" class="horizontal">
									<span class="label" style="">Notify</span>
									<textarea :disabled="true" v-model="ruleForm.notify_textarea" id="notify_textarea" name="notify_textarea" style="display: none;"></textarea>
								</div>
								<div id="special-handlingcode">
									<span class="label">Special Handling Code (separate the code by space)</span>
									<input :disabled="true" v-model="ruleForm.handingInformationSpecialHandlingCode" tyep="text" id="tx_Mawb_handlinginfo_code" name="tx_Mawb_handlinginfo_code" class="TextBox">
								</div>
							</div>
							<div id="item-detail">
								<div id="item-head">
									<div id="pieces" class="horizontal">
										<span class="label">No. of Pieces RCP<sub class="required">*</sub></span>
									</div>
									<div id="gross-weight" class="horizontal">
										<span class="label">Gross Weight<sub class="required">*</sub></span>
									</div>

									<div id="kg-lb" class="horizontal">
										<span class="label">Kg lb</span>
									</div>

									<div class="space horizontal"></div>

									<div id="rate-class" class="horizontal">
										<span class="label">Rate Class<sub class="required">*</sub>
									<select :disabled="true" v-model="ruleForm.rateClass" id="rate_class" name="rate_class" style="margin: 0 0 0 0px; border: 0px; overflow: hidden; background-color: #e8f0fe; ">
									<option value="M">M</option>
									<option value="N">N</option>
									<option value="Q">Q</option>
									<option value="C">C</option>
									<option value="S">Z</option>
									<option value="R">R</option>
									</select>
								</span>
										<span id="commodity-item" class="label">Commodity Item No.</span>
									</div>

									<div class="space horizontal"></div>

									<div id="chargeable-weight" class="horizontal">
										<span class="label">Chargeable Weight<sub class="required">*</sub></span>
									</div>

									<div class="space horizontal"></div>

									<div id="rate-charge" class="horizontal">
										<span class="label">Rate/Charge<sub class="required">*</sub></span>
									</div>

									<div class="space horizontal"></div>

									<div id="total" class="horizontal">
										<span class="label">Total</span>
									</div>

									<div class="space horizontal"></div>

									<div id="goods" class="horizontal">
										<span class="label">Nature and Quantity of Goods (incl. Dimensions or Volume)<sub class="required">*</sub><input :disabled="true" v-model="ruleForm.slac" id="slac" class="slac" name="slac" maxlength="5" style="width: 50px;display: none;" ></span>

									</div>
								</div>
								<div id="item-body">
									<div id="item-record">
										<div id="pieces" class="horizontal">
											<input :disabled="true" v-model="ruleForm.awbPieces" id="piecequantity" name="piecequantity" class="TextBox" maxlength="8">
										</div>
										<div id="gross-weight" class="horizontal">
											<input :disabled="true" v-model="ruleForm.awbGrossWeight" id="grossweight" name="grossweight" class="TextBox">
										</div>
										<div id="kg-lb" class="horizontal">
											<input :disabled="true" v-model="ruleForm.sel_wci_unit" name="sel_wci_unit" class="TextBox nohelp" id="sel_wci_unit" style="display: none;">K
										</div>
										<div class="space horizontal"></div>
										<div id="rate-class" class="horizontal">
											<div id="rate" class="horizontal">&nbsp;</div>
											<div id="commodity-item" class="horizontal">
												<input :disabled="true" v-model="ruleForm.commodityItemNo" name="commodityitemcode" class="TextBox" id="commodityitemcode">
											</div>
										</div>
										<div class="space horizontal"></div>
										<div id="chargeable-weight" class="horizontal">
											<input :disabled="true" v-model="ruleForm.awbChargeWeight" id="chargeableweight" name="chargeableweight" class="TextBox">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-charge" class="horizontal">
											<input :disabled="true" v-model="ruleForm.rateCharge" id="rateCharge" name="rateCharge" class="TextBox">
										</div>
										<div class="space horizontal"></div>
										<div id="total" class="horizontal">
											<input :disabled="true" v-model="ruleForm.freightCombined" name="AppliedAmount" class="TextBox" id="AppliedAmount">
										</div>
										<div class="space horizontal"></div>
										<div id="goods" class="horizontal">
											<textarea :disabled="true" v-model="ruleForm.goodsDescription" id="GoodsDescription" name="GoodsDescription" rows="4" cols="61"></textarea>
										</div>
									</div>
									<div id="item-record">
										<div id="pieces" class="horizontal">
										</div>
										<div id="gross-weight" class="horizontal">
										</div>
										<div id="kg-lb" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-class" class="horizontal">
											<div id="rate" class="horizontal">&nbsp;</div>
											<div id="commodity-item" class="horizontal" style=" padding-top: 10px; text-align: left;">&nbsp;&nbsp;MARK</div>
										</div>
										<div class="space horizontal"></div>
										<div id="chargeable-weight" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-charge" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="total" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<!--div id="goods" class="horizontal">
									
								</div-->
									</div>
									<div id="item-record">
										<div id="pieces" class="horizontal">
										</div>
										<div id="gross-weight" class="horizontal">
										</div>
										<div id="kg-lb" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-class" class="horizontal">
											<div id="rate" class="horizontal">
											</div>
											<div id="commodity-item" class="horizontal">
												<textarea :disabled="true" v-model="ruleForm.remarkMark" id="RemarkMark" name="RemarkMark" rows="4" cols="61"></textarea>
											</div>
										</div>
										<div class="space_empty horizontal"></div>
										<div id="chargeable-weight" class="horizontal">
										</div>
										<div class="space_empty horizontal"></div>
										<div id="rate-charge" class="horizontal">
										</div>
										<div class="space_empty horizontal"></div>
										<div id="total" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="goods" class="horizontal">
											<textarea :disabled="true" v-model="ruleForm.awbSizes" id="GoodsSize" name="GoodsSize" rows="4" cols="61" readonly="readonly"></textarea>
										</div>
									</div>
									<div id="item-record">
										<div id="pieces" class="horizontal">SLAC
										</div>
										<div id="gross-weight" class="horizontal">
										</div>
										<div id="kg-lb" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-class" class="horizontal">
											<div id="rate" class="horizontal">
											</div>
											<div id="commodity-item" class="horizontal">
											</div>
										</div>
										<div class="space_empty horizontal"></div>
										<div id="chargeable-weight" class="horizontal">
										</div>
										<div class="space_empty horizontal"></div>
										<div id="rate-charge" class="horizontal">
										</div>
										<div class="space_empty horizontal"></div>
										<div id="total" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<!--div id="goods" class="horizontal">
								</div-->
									</div>
									<div id="item-summary">
										<div id="pieces" class="horizontal">
											<input :disabled="true" v-model="ruleForm.awbPiecesSlac" id="TotalPieceQuantity" name="TotalPieceQuantity" class="TextBox">
										</div>
										<div id="gross-weight" class="horizontal">
											<input :disabled="true" v-model="ruleForm.TotalGrossWeight" id="TotalGrossWeight" name="TotalGrossWeight" class="TextBox" style="display: none;">
										</div>
										<div id="kg-lb" class="horizontal">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-class" class="horizontal">
											<div id="rate" class="horizontal"></div>
											<div id="commodity-item" class="horizontal">

											</div>
										</div>
										<div class="space horizontal"></div>
										<div id="chargeable-weight" class="horizontal">
											<input :disabled="true" v-model="ruleForm.TotalChargeableWeight" id="TotalChargeableWeight" name="TotalChargeableWeight" class="TextBox" style="display: none;">
										</div>
										<div class="space horizontal"></div>
										<div id="rate-charge" class="horizontal">

										</div>
										<div class="space horizontal"></div>
										<div id="total" class="horizontal">
											<input :disabled="true" v-model="ruleForm.WeightTotalChargeAmount" name="WeightTotalChargeAmount" class="TextBox" style="display: none;">
										</div>
										<div class="space horizontal"></div>
										<div id="goods" class="horizontal" style="text-align: right;">
											Vol.(M3)<input :disabled="true" v-model="ruleForm.awbVolume" id="AwbVolume" name="AwbVolume" class="TextBox" maxlength="8">
										</div>
									</div>
								</div>
							</div>
							<div id="summary">
								<div id="left" class="horizontal">
									<div id="weight-charge" class="horizontal">
										<span id="prepaid" class="label horizontal">Prepaid</span>
										<span id="weightcharge" class="label horizontal">Weight Charge</span>
										<span id="collect" class="label horizontal">Collect</span>
										<div id="prepaid-input">
											<input :disabled="true" v-model="ruleForm.prepaidWeightCharge" id="mawb_weightprepaid" name="mawb_weightprepaid" class="TextBox">
										</div>
										<div id="collect-input">
											<input :disabled="true" v-model="ruleForm.collectWeightCharge" id="mawb_weightcollect" name="mawb_weightcollect" class="TextBox">
										</div>
									</div>
									<div id="valuation-charge">
										<span class="label horizontal">Valuation Charge</span>
										<div id="prepaid-input">
											<input :disabled="true" v-model="ruleForm.prepaidValuationCharge" id="prepaid_valuation_charge" name="prepaid_valuation_charge" class="TextBox">
										</div>
										<div id="collect-input">
											<input :disabled="true" v-model="ruleForm.collectValuationCharge" id="collect_valuation_charge" name="collect_valuation_charge" class="TextBox">
										</div>
									</div>
									<div id="tax">
										<span class="label horizontal">Tax</span>
										<div id="prepaid-input">
											<input :disabled="true" v-model="ruleForm.prepaidTax" id="prepaid_tax" name="prepaid_tax" class="TextBox">
										</div>
										<div id="collect-input">
											<input :disabled="true" v-model="ruleForm.collectTax" id="collect_tax" name="collect_tax" class="TextBox">
										</div>
									</div>

									<div id="total-other-charges-due-agent">
										<span class="label horizontal">Total Other Charges Due Agent</span>
										<div id="prepaid-input">
											<input :disabled="true" v-model="ruleForm.prepaidTotalOtherChargeDueAgent" name="mawb_agentotherprepaid" id="mawb_agentotherprepaid" class="TextBox">
										</div>
										<div id="collect-input">
											<input :disabled="true" v-model="ruleForm.collectTotalOtherChargeDueAgent" name="mawb_agentothercollect" id="mawb_agentothercollect" class="TextBox">
										</div>
									</div>
									<div id="total-other-charges-due-carrier">
										<span class="label horizontal">Total Other Charges Due Carrier</span>
										<div id="prepaid-input" class="horizontal">
											<input :disabled="true" v-model="ruleForm.prepaidTotalOtherChargeDueCarrier" name="mawb_carrierotherprepaid" id="mawb_carrierotherprepaid" class="TextBox">
										</div>
										<div id="collect-input">
											<input :disabled="true" v-model="ruleForm.collectTotalOtherChargeDueCarrier" name="mawb_carrierothercollect" id="mawb_carrierothercollect" class="TextBox">
										</div>
									</div>
									<div id="total-space">
									</div>
									<div id="total">
										<span class="label horizontal">Total Prepaid</span>
										<div class="whitespace horizontal">
										</div>
										<span class="label horizontal">Total Collect</span>
										<div id="prepaid-input">
											<input :disabled="true" v-model="ruleForm.totalPrepaid" name="mawb_totalprepaid" id="mawb_totalprepaid" class="TextBox">
										</div>
										<div id="collect-input">
											<input :disabled="true" v-model="ruleForm.totalCollect" name="mawb_totalcollect" id="mawb_totalcollect" class="TextBox">
										</div>
									</div>
									<div id="currency-rates">
										<span class="label horizontal">Currency Conversion Rates</span>
										<div class="whitespace horizontal"></div>
										<span class="label horizontal">CC Charges In Dest. Currency</span>

										<div id="prepaid-input">
										</div>
										<div id="collect-input">
										</div>
									</div>
								</div>
								<div id="right" class="horizontal">
									<div id="other-charges" class="horizontal">
										<span class="label">Other Charges</span>
										<textarea :disabled="true" v-model="ruleForm.otherCharges" name="otherCharges" id="otherCharges" rows="3" cols="61" readonly="readonly"></textarea>
									</div>
									<div id="signature-of-agent">
										<span class="label">Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations.</span>
										<div id="signature-input">
											<input :disabled="true" v-model="ruleForm.shipperSignature" name="input_signature_of_shipper_or_his_agent" type="text" id="input_signature_of_shipper_or_his_agent" class="TextBox">
											<span id="signature-of-shipper-or-his-agent" class="label">Signature of shipper or his Agent</span>
										</div>
										<div id="signature-input-statement">
											<input :disabled="true" v-model="ruleForm.signatureofShipperorhisAgent" name="signature_of_shipper_or_his_agent_statement" type="text" id="signature_of_shipper_or_his_agent_statement" class="TextBox">
										</div>
										<div id="executed-on-date" class="horizontal">
											<input :disabled="true" v-model="ruleForm.awbDate" type="text" name="input_executed_on_date" id="input_executed_on_date" class="TextBox">
											<span class="label">Executed on (Date)</span>
										</div>
										<div id="at-place" class="horizontal">
											<input :disabled="true" v-model="ruleForm.executedAt" name="input_at_place" type="text" id="input_at_place" class="TextBox">
											<span class="label">at (Place)</span>
										</div>
										<div id="signature-of-issuing-carrier-or-its-agent" class="horizontal ">
											<input :disabled="true" v-model="ruleForm.carrierSignature" name="Signatory" type="text" class="TextBox" id="Signatory">
											<span class="label">Signature of Issuing Carrier or its Agent</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</el-dialog>
</template>

<script>
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
				sendHawbFlag: false,
				ruleForm: {
					awbId: '',
					awbUuid: '',
					awbNumber: '',
					awbNumberPrefix: '', //mawbcodePrefix: '1',
					departureStation: '', //departure_code: '2',
					awbNumberSuffix: '', //mawbcodeSuffix: '3',
					shipperAddress: '', //ConsignorParty_show: '4',
					consigneeAddress: '', //ConsigneeParty_show: '5',
					issueAgentName: '', //forwarder_p: '6',
					agentIataCode: '', //iatacode: '7',
					accountNo: '', //accoutno_i: '8',
					departureStationName: '', //departure_name: '9',
					mawb_by1: '', //航班号前两位
					transitStation: '', //mawb_to2: '12',
					transitStationBy: '', //mawb_by2: '13',
					transitStation2: '', //mawb_to3: '14',
					transitStationBy2: '', //mawb_by3: '15',
					arrivalStationName: '', //destination_code: '16',
					arrivalStation: '', //destination_name: '17', //mawb_to1: '10',
					flightNumber: '', //flightno: '18',
					flightDate: '', //flightdate: '19',
					flightNumber2: '', //flightno2: '20',
					flightDate2: '', //flightdate2: '21',
					carrierName: '', //associatedparty_textarea: '22',
					accountingInformation: '', //Accounting: '23',
					awbCurrency: '', //currencyid: '24',
					payMethod: '', //radio_WTVAL: 'P',
					payMethodOther: '', //radio_mawb_otherppcc: 'C',
					declaredValueOfCarriage: '', //mawb_carriagevalue: '27',
					declaredValueOfCustoms: '', //mawb_customsvalue: '28',
					amountOfInsurance: '', //mawb_insuranceamount: '29',
					handingInformation: '', //handling_information_textarea: '30',
					notify_textarea: '31',
					handingInformationSpecialHandlingCode: '', //tx_Mawb_handlinginfo_code: '32',
					rateClass: '', //rate_class: 'Q',
					slac: '34',
					awbPieces: '', //piecequantity: '35',
					awbGrossWeight: '', //grossweight: '36',
					sel_wci_unit: '37',
					commodityItemNo: '', //commodityitemcode: '38',
					awbChargeWeight: '', //chargeableweight: '39',
					rateCharge: '',
					freightCombined: '', //AppliedAmount: '41',
					goodsDescription: '', //GoodsDescription: '42',
					remarkMark: '', //RemarkMark: '43',
					awbSizes: '', //GoodsSize
					awbPrintSizeList: [],
					awbPiecesSlac: '', //TotalPieceQuantity: '45',
					TotalGrossWeight: '46',
					TotalChargeableWeight: '47',
					WeightTotalChargeAmount: '48',
					awbVolume: '', //AwbVolume: '49',
					prepaidWeightCharge: '', //mawb_weightprepaid: '50',
					collectWeightCharge: '', //mawb_weightcollect: '51',
					prepaidValuationCharge: '', //prepaid_valuation_charge: '52',
					collectValuationCharge: '', //collect_valuation_charge: '53',
					prepaidTax: '', //prepaid_tax: '54',
					collectTax: '', //collect_tax: '55',
					prepaidTotalOtherChargeDueAgent: '', //mawb_agentotherprepaid: '56',
					collectTotalOtherChargeDueAgent: '', //mawb_agentothercollect: '57',
					prepaidTotalOtherChargeDueCarrier: '', //mawb_carrierotherprepaid: '58',
					collectTotalOtherChargeDueCarrier: '', //mawb_carrierothercollect: '59',
					totalPrepaid: '', //mawb_totalprepaid: '60',
					totalCollect: '', //mawb_totalcollect: '61',
					otherFee: '', //otherCharges: '62',
					otherCharges: '',
					awbPrintChargesOtherList: [],
					shipperSignature: '', //input_signature_of_shipper_or_his_agent: '63',
					signatureofShipperorhisAgent: '', //signature_of_shipper_or_his_agent_statement: '64',
					awbDate: '', //input_executed_on_date: '65',
					executedAt: '', //input_at_place: '66',
					carrierSignature: '' //Signatory: '67'
				}
			};
		},
		created: function() {
			this.$axios.get2('/afbase/awbPrint/view', {
				awbPrintId: this.frow.awbPrintId
			}).then((response) => {
				this.ruleForm = response.data.data
				this.init()
			}).catch((error) => {
				console.log(error);
			});

			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('af_button_awbPrint_sendHawb') > -1) {
				this.sendHawbFlag = true;
			}
		},
		methods: {
			init() {
				if(this.frow.flightNumber != null && this.frow.flightNumber != '') {
					if(this.frow.flightNumber.length < 3) {
						this.ruleForm.mawb_by1 = this.frow.flightNumber
					} else {
						this.ruleForm.mawb_by1 = this.frow.flightNumber.substr(0, 2)
					}
				}
				let result = ''
				if(this.ruleForm.otherFee != null && this.ruleForm.otherFee != '') {
					this.ruleForm.otherFee.split('\n').forEach((fee) => {
						if(result == '') {
							result = fee.split('*')[0] + ':' + fee.split('*')[3]
						} else {
							result += '\n' + fee.split('*')[0] + ':' + fee.split('*')[3]
						}
					})
				}

				this.ruleForm.otherCharges = result
			},
			printG() {
				this.$axios.post2('/afbase/awbPrint/downloadHAWB', {
						awbPrintType: 'PRINT_HAWB',
						awbUuid: this.ruleForm.awbUuid,
						awbPrintId: this.ruleForm.awbPrintId,
						printType: '2'
					})
					.then(function(response) {
						window.open(response.data.data)
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this));
			},
			printT() {
				this.$axios.post2('/afbase/awbPrint/downloadHAWB', {
						awbPrintType: 'PRINT_HAWB',
						awbUuid: this.ruleForm.awbUuid,
						awbPrintId: this.ruleForm.awbPrintId,
						printType: '1'
					})
					.then(function(response) {
						window.open(response.data.data)
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this));
			},
			sendHawb() {
				this.$message({
					message: '发送功能正在研发中，暂时无法使用，敬请期待',
					type: 'warning'
				});
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style scoped="scoped">
	/*-----------------------------------------------------------------------------------------------------------------------
emawb.css by YES@2013-09-20
--------------------------------------------------------------------------------------------------------------------------*/
	
	input[type=date]::-webkit-inner-spin-button {
		visibility: hidden;
	}
	
	input[type="date"]::-webkit-calendar-picker-indicator {
		width: 5px;
	}
	
	input[type="date"]::-webkit-clear-button {
		display: none;
	}
	
	div,
	span,
	textarea {
		box-sizing: content-box;
	}
	
	.awb_body {
		background-color: #FFF;
		height: auto;
		font-family: Tahoma;
		font: 12px Tahoma;
		color: #777;
		width: 1050px;
		margin-left: auto;
		margin-right: auto;
	}
	
	.awb_body textarea {
		outline: none;
		padding: 2px;
		margin: 0px;
		resize: none;
		background-color: #e8f0fe;
		color: #000000;
	}
	
	.TextBox {
		border: 0px none;
		outline: none;
		height: 18px;
		border-bottom: 1px dotted #9ecf0a;
		background-color: #e8f0fe;
	}
	
	.required {
		color: #fc5b4d;
		font-size: 12px;
		/*padding: 0 2px;*/
	}
	
	.button-flatestyle {
		width: 80px;
	}
	
	.button-flatestyle a {
		width: 75px;
		border-right: 0px solid #3582b9;
		margin: 0 10px;
		padding: 0;
		text-shadow: none;
	}
	
	.button-flatestyle.green a {
		background-color: #7fc71a;
	}
	
	.button-flatestyle.green a:hover {
		background-color: #71b017;
		color: #f2fce4;
		text-shadow: none;
	}
	
	.button-flatestyle a.btdisable {
		background-color: #EEE;
		color: #DDD;
		text-shadow: none;
	}
	
	.minitip-content {
		font-size: 11px;
		padding: 8px 10px;
		color: #fff;
		background-color: #3C3C3C;
		border: 1px solid rgba(255, 255, 255, 0.25);
		text-shadow: 0 0 2px #000;
		box-shadow: 0 0 3px #555;
		border-radius: 5px;
	}
	
	.TextBox_Help {
		display: none;
		clear: both;
		float: left;
		border-top: 6px solid #26b064;
		position: absolute;
		min-width: 500px;
		min-height: 30px;
		line-height: 30px;
		background-color: #2f373d;
		color: #bac3c9;
		padding: 0 5px;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
		box-sizing: content-box;
		z-index: 999999;
	}
	
	.TextBox_Help #prompt-left {
		width: 100%;
		height: 30px;
		margin-top: 1px;
		background-color: #45515a;
		line-height: 28px;
	}
	
	.TextBox_Help #prompt-left a {
		line-height: 26px;
	}
	
	.TextBox_Help .label {
		margin-left: 5px;
	}
	
	.TextBox_Help span.key {
		margin-left: 15px;
		color: #5faddd;
		cursor: pointer;
	}
	
	.TextBox_Help span.value {
		margin-left: 0px;
		cursor: pointer;
	}
	
	.TextBox_Help span.close {
		float: right;
		margin-right: 5px;
		cursor: pointer;
	}
	
	.horizontal {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		margin: 0;
		padding: 0;
		margin-right: -3px;
	}
	
	#form-header {
		display: block;
		width: 100%;
		height: 48px;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		background-color: #FFF;
	}
	
	#form-header-inner {
		width: 1000px;
		margin: 0 auto;
	}
	
	#form-title {
		margin-top: 15px;
		margin-left: 0;
	}
	
	#form-title div#mawb_carriercode {
		height: 30px;
	}
	
	#form-title div#mawb_departurecode {
		border-left: 1px solid #BBB;
		height: 30px;
	}
	
	#form-title div#mawb_suffixcode {
		border-left: 1px solid #BBB;
		height: 30px;
	}
	
	#form-title div#mawb_carriercode .TextBox,
	#form-title div#mawb_departurecode .TextBox {
		width: 30px;
		height: 18px;
		border-bottom: 1px dotted #DDD;
		text-align: center;
	}
	
	#form-title div#mawb_suffixcode .TextBox {
		width: 80px;
		border-bottom: 1px dotted #DDD;
		text-align: center;
		height: 18px;
	}
	
	#form-title .smallfont {
		display: block;
		font-size: 8px;
	}
	
	#form-action {
		margin-right: -12px;
	}
	
	#form-prompt {}
	
	#form-container {
		width: 1020px;
		height: auto;
		background-color: #FFF;
		margin-bottom: 10px;
	}
	
	#form-main {
		height: auto;
		border: none;
		margin-left: 0px;
		margin-right: 0px;
		padding-right: 0px;
		background-color: #FFF;
	}
	
	#form-inner {
		border: none;
		height: auto;
	}
	
	.box {
		border: 1px solid #BBB;
	}
	
	#form-left {
		display: inline-block;
		*display: inline;
		_zoom: 1;
		width: 430px;
	}
	
	#form-right {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 570px;
		vertical-align: top;
		margin-left: -4px;
	}
	
	#shipper {
		border: 1px solid #BBB;
		border-right: 0px;
	}
	
	#shipper span,
	#consignee span {
		display: block;
		text-align: center;
	}
	
	#shipper-head,
	#consignee-head {
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#shipper-head .label,
	#consignee-head .label {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 184px;
		line-height: 24px;
		text-align: left;
		margin-left: 10px;
	}
	
	#shipper-head #account-div,
	#consignee-head #account-div {
		display: inline-block;
		width: 229px;
		height: 65px;
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#shipper-head #account-div .label,
	#consignee-head #account-div .label {
		width: 165px;
		line-height: 24px;
		text-align: left;
	}
	
	#shipper textarea,
	#consignee textarea {
		border: none;
		width: 95%;
		height: 84px;
		padding: 10px;
		overflow-y: visible;
	}
	
	#shipper .TextBox,
	#consignee .TextBox {
		height: 25px;
		border-bottom: 1px dotted #DDD;
	}
	
	#shipper .TextBox:last-child,
	#consignee .TextBox:last-child {
		margin-bottom: 7px;
	}
	
	#consignee {
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#forwarder {
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#forwarder #forwarder-head span {
		line-height: 24px;
		margin-left: 10px;
	}
	
	#forwarder #forwarder-head {
		height: 24px;
	}
	
	#forwarder textarea {
		border: none;
		width: 95%;
		height: 50px;
		padding: 10px;
		overflow-y: visible;
	}
	
	#agent {
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#agent #agent-iatacode {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 49%;
		border-right: 1px solid #BBB;
	}
	
	#agent #accoutno {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 49.6%;
	}
	
	#agent #agent-iatacode .label,
	#agent #accoutno .label {
		margin-left: 10px;
		line-height: 24px;
		height: 24px;
		display: block;
	}
	
	#agent #agent-iatacode .TextBox,
	#agent #accoutno .TextBox {
		width: 100%;
		border-bottom: 1px dotted #DDD;
		margin-bottom: 7px;
		text-align: center;
		background-color: #e8f0fe;
	}
	
	#airport-departure {
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		height: 69px;
	}
	
	#airport-departure .label {
		margin-left: 10px;
		line-height: 24px;
		height: 24px;
		display: block;
	}
	
	#airport-departure .TextBox {
		width: 100%;
		border-bottom: 1px dotted #DDD;
		background-color: #e8f0fe;
		text-align: center;
		margin-top: 7px;
	}
	
	#airport-departure span#airportname {
		width: 300px;
		margin-left: 10px;
		padding-bottom: 5px;
		border-bottom: 1px dotted #DDD;
	}
	
	#routing {
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#routing #first-to,
	#routing #second-to,
	#routing #second-carrier,
	#routing #third-to,
	#routing #third-carrier {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 12%;
	}
	
	#routing #first-carrier,
	#routing #second-to,
	#routing #second-carrier,
	#routing #third-to,
	#routing #third-carrier {
		border-left: 1px solid #BBB;
	}
	
	#routing #first-carrier {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 33.86%;
	}
	
	#routing .label {
		display: block;
		margin-left: 10px;
		line-height: 24px;
		height: 24px;
	}
	
	#routing .TextBox {
		width: 100%;
		height: 23px;
		border-bottom: 1px dotted #DDD;
		margin-bottom: 7px;
		text-align: center;
		background-color: #e8f0fe;
	}
	
	#flight {
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#flight .label {
		display: block;
		margin-left: 10px;
		line-height: 24px;
		height: 24px;
	}
	
	#flight #airport-destination {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 33%;
	}
	
	#flight #airport-destination .TextBox {
		text-align: center;
	}
	
	#flight #flight-detail {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		border-left: 1px solid #BBB;
	}
	
	#flight #flight-detail #head-label {
		display: block;
	}
	
	#flight #flight-detail #input-div {
		display: block;
	}
	
	#flight #flight-detail #head-label {
		padding-left: 38px;
		padding-right: 38px;
	}
	
	#flight #flight-detail #head-label .label {
		padding-left: 30px;
		padding-right: 30px;
		line-height: 24px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#flight #flight-detail #input-div #first-flight,
	#flight #flight-detail #input-div #second-flight {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 49%;
	}
	
	#flight #flight-detail #input-div #first-flight {
		border-right: 1px solid #BBB;
	}
	
	#flight .TextBox {
		height: 25px;
		width: 95%;
		border-bottom: 1px dotted #DDD;
		margin-bottom: 7px;
		text-align: center;
	}
	
	#flight #destination_name {
		text-align: left;
		padding-left: 5px;
		/*width: 70px;*/
	}
	
	#flight #destination_code {
		text-align: left;
		padding-left: 5px;
		width: 30px;
	}
	
	#flight #flight-detail #input-div #flightno,
	#flight #flight-detail #input-div #flightdate {
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#flight #flight-detail #input-div #flightno,
	#flight #flight-detail #input-div #flightno2 {
		width: 50px;
	}
	
	#flight #flight-detail #input-div #flightdate,
	#flight #flight-detail #input-div #flightdate2 {
		width: 70px;
	}
	
	#mawb {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 100%;
		height: 172px;
		border: 1px solid #BBB;
	}
	
	#mawb .awb_code {
		display: inline-block;
		_zoom: 1;
		padding: 10px 10px 10px 10px;
		font-size: 32px;
		color: #97c803;
		/*margin-left: 207px;*/
		margin-bottom: 7px;
	}
	
	#mawb #associatedparty_textarea {
		width: 95%;
		height: 58px;
		overflow-y: visible;
		border: none;
		clear: both;
		padding: 10px;
	}
	
	#mawb .code {
		_zoom: 1;
		padding: 10px 10px 18px 10px;
		font-size: 32px;
		color: #97c803;
		margin-bottom: 59px;
	}
	
	#mawb .label {
		margin-top: 15px;
		margin-left: 10px;
		font-size: 16px;
		font-weight: bold;
		display: inline-block;
		padding: 10px 10px 18px 10px;
		margin-bottom: 7px;
	}
	
	#mawb #validity {
		display: block;
		width: 560px;
		padding-left: 10px;
		padding-top: 5px;
		border-top: 1px solid #BBB;
	}
	
	#mawb-memo {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 100%;
		height: 172px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
	}
	
	#mawb-memo div {
		padding: 10px;
		color: #AAA;
		font-size: 12px;
	}
	
	#accounting {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 100%;
		height: 338px;
		border-top: 1px solid #BBB;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#accounting #information {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 100%;
		height: 149px;
		border-bottom: 1px solid #BBB;
	}
	
	#accounting #information .label {
		display: block;
		margin-left: 10px;
		line-height: 24px;
	}
	
	#accounting textarea {
		border: none;
		width: 95%;
		height: 98px;
		padding: 10px;
		overflow-y: visible;
	}
	
	#accounting #reference {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 100%;
		height: 69px;
		border-bottom: 1px solid #BBB;
	}
	
	#accounting #reference .label {
		display: block;
		margin-left: 10px;
		line-height: 24px;
	}
	
	#accounting #reference #reference-number {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 150px;
	}
	
	#accounting #reference #optional-shipping-information {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 290px;
	}
	
	#accounting #reference #optional-shipping-information .label {
		width: 200px;
		padding-left: 30px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#accounting #payment #currency,
	#accounting #payment #chgscode,
	#accounting #payment #WT-VAL,
	#accounting #payment #other,
	#accounting #payment #declared-value-for-carriage,
	#accounting #payment #declared-value-for-customs {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		height: 57px;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#accounting #payment #declared-value-for-customs {
		border-right: none;
		width: 161px;
	}
	
	#declared-value-for-carriage .TextBox,
	#declared-value-for-customs .TextBox,
	#insurance .TextBox,
	#currency .TextBox {
		height: 22px;
		border-bottom: 1px dotted #DDD;
		margin-bottom: 7px;
		text-align: center;
		background-color: #e8f0fe;
	}
	
	#accounting #payment .label {
		padding-left: 3px;
		line-height: 18px;
	}
	
	#accounting #payment #currency {
		width: 65px;
		text-align: center;
		vertical-align: top;
	}
	
	#accounting #payment #currency .label {
		line-height: 25px;
	}
	
	#accounting #payment #chgscode {
		width: 41px;
		text-align: center;
		margin-left: -3px;
		vertical-align: top;
	}
	
	#accounting #payment #PPD,
	#accounting #payment #COLL {
		width: 36px;
		height: 38px;
		border-right: 1px solid #BBB;
		float: left;
	}
	
	#COLL {
		float: left;
	}
	
	#accounting #payment #COLL {
		margin-left: -3px;
		border-right: none;
	}
	
	#accounting #payment #WT-VAL,
	#accounting #payment #other {
		width: 71px;
		margin-left: 0px;
	}
	
	#accounting #payment #declared-value-for-carriage,
	#accounting #payment #declared-value-for-customs {
		width: 150px;
		vertical-align: top;
		margin-left: 0px;
	}
	
	#accounting #payment #declared-value-for-carriage .label,
	#accounting #payment #declared-value-for-customs .label {
		line-height: 25px;
		letter-spacing: -1px;
	}
	
	#accounting #payment #WT-VAL .label,
	#accounting #payment #other .label {
		display: block;
		border-bottom: 1px solid #BBB;
		text-align: center;
	}
	
	#accounting #payment #insurance {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 184px;
		height: 59px;
		vertical-align: top;
		border-right: 1px solid #BBB;
		margin-bottom: -1px;
	}
	
	#accounting #payment #insurance .label {
		display: block;
		margin-left: 5px;
		line-height: 25px;
	}
	
	#accounting #payment #insurance-memo {
		display: inline-block;
		_zoom: 1;
		*display: inline;
		width: 380px;
		margin-bottom: -1px;
		letter-spacing: -1px;
	}
	
	#accounting #payment #insurance-memo .label {
		display: block;
		padding: 2px;
	}
	
	#handling {
		display: block;
		width: 999px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#handling .label {
		display: block;
		margin-left: 10px;
		line-height: 25px;
	}
	
	#handling-information {
		vertical-align: top;
	}
	
	#handling-information textarea {
		display: block;
		width: 580px;
		border: none;
		height: 50px;
		padding: 5px 10px;
		overflow-y: visible;
	}
	
	#notify textarea {
		width: 363px;
		height: 50px;
		margin-left: 10px;
		padding: 5px 10px;
		overflow-y: visible;
		border: none;
	}
	
	#special-handlingcode .TextBox {
		width: 985px;
		text-align: left;
		height: 25px;
		line-height: 25px;
		margin-bottom: 7px;
		border-bottom: 1px dotted #DDD;
	}
	
	#item-detail {
		width: 1000px;
	}
	
	#item-detail #item-head {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
	}
	
	#item-detail #item-head #pieces,
	#item-detail #item-head #gross-weight,
	#item-detail #item-head #kg-lb,
	#item-detail #item-head #chargeable-weight,
	#item-detail #item-head #rate-charge,
	#item-detail #item-head #total,
	#item-detail #item-head #goods {
		border-bottom: 1px solid #BBB;
	}
	
	#item-detail #item-head .space {
		border-bottom: 1px solid #999;
	}
	
	#item-detail #pieces {
		width: 68px;
		height: 42px;
		text-align: center;
		vertical-align: top;
	}
	
	#item-detail #pieces .label {
		display: block;
		/*margin-top: 8px;*/
	}
	
	#item-detail #gross-weight {
		width: 78px;
		height: 42px;
		text-align: center;
		vertical-align: top;
		border-left: 1px solid #BBB;
	}
	
	#gross-weight .TextBox,
	#commodity-item .TextBox,
	#rate-charge .TextBox,
	#total .TextBox,
	#pieces .TextBox {
		height: 20px;
		width: 96%;
	}
	
	#kg-lb #sel_wci_unit {
		margin-left: 5px;
	}
	
	#kg-lb .TextBox {
		height: 25px;
		width: 16px;
	}
	
	#chargeable-weight .TextBox {
		height: 25px;
		width: 96%;
	}
	
	#rate .TextBox {
		height: 25px;
	}
	
	#item-detail #gross-weight .label {
		display: block;
		margin-top: 15px;
	}
	
	#item-detail #kg-lb {
		width: 20px;
		height: 42px;
		text-align: center;
		vertical-align: top;
		border-left: 1px solid #BBB;
		overflow: hidden;
	}
	
	#item-detail #kg-lb .label {
		display: block;
		margin-top: 8px;
	}
	
	.space {
		width: 5px;
		height: 42px;
		background-color: #999;
		vertical-align: top;
	}
	
	.space_empty {
		width: 5px;
		height: 42px;
		background-color: #999;
		vertical-align: top;
		background: rgba(0, 0, 0, 0);
		/* r:red g:green b:blue a:alpha(半透明):0-1,1是不透明，0是全透明 */
	}
	
	#item-detail #rate-class {
		width: 135px;
		height: 42px;
		text-align: center;
		vertical-align: top;
	}
	
	#item-detail #rate-class .label {
		display: block;
		margin-top: 0px;
	}
	
	#item-detail #rate-class #RemarkMark {
		border: none;
		height: 30px;
		padding: 10px;
		width: 380px;
		overflow-y: visible;
	}
	
	#item-detail #rate-class #commodity-item.label {
		display: inline-block;
		margin-left: 18px;
		margin-bottom: 0px;
		margin-top: 3px;
		width: 110px;
		height: 12px;
		padding: 3px;
		border-left: 1px solid #BBB;
		border-top: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		letter-spacing: -1px;
	}
	
	#item-detail #chargeable-weight {
		width: 110px;
		height: 42px;
		text-align: center;
		vertical-align: top;
	}
	
	#item-detail #chargeable-weight .label {
		display: block;
		margin-top: 15px;
	}
	
	#item-detail #rate-charge {
		width: 80px;
		height: 42px;
		text-align: center;
		vertical-align: top;
	}
	
	#item-detail #rate-charge .label {
		display: block;
		margin-top: 15px;
	}
	
	#item-detail #total {
		width: 90px;
		height: 42px;
		text-align: center;
		vertical-align: top;
	}
	
	#item-detail #total .label {
		display: block;
		margin-top: 15px;
	}
	
	#item-detail #goods {
		width: 380px;
		height: 42px;
		text-align: center;
		vertical-align: top;
	}
	
	#goods textarea {
		border: none;
		width: 95%;
		height: 30px;
		padding: 10px;
		overflow-y: visible;
		cursor: pointer;
	}
	
	#item-detail #goods .label {
		display: block;
		margin-top: 15px;
		letter-spacing: -1px;
	}
	
	#item-detail #item-body {
		height: 162px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#item-detail #item-body #item-record,
	#item-detail #item-body #item-summary {
		height: 30px;
	}
	
	#item-detail #item-body #item-record #rate-class #rate,
	#item-detail #item-body #item-summary #rate-class #rate {
		width: 9px;
		height: inherit;
	}
	
	#item-detail #item-body #item-record #rate-class #commodity-item,
	#item-detail #item-body #item-summary #rate-class #commodity-item {
		width: 110px;
		height: inherit;
		border-left: 1px solid #BBB;
	}
	
	#item-detail #item-body #item-summary #pieces,
	#item-detail #item-body #item-summary #gross-weight,
	#item-detail #item-body #item-summary #total {
		border-top: 1px solid #BBB;
	}
	
	#item-detail #item-body #item-summary #total input {
		width: 89px;
	}
	
	#item-detail #item-body #item-record #total input {
		width: 89px;
	}
	
	#summary {
		width: 1001px;
	}
	
	#summary .horizontal {
		vertical-align: top;
	}
	
	#summary #weight-charge {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #weight-charge .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 12px;
	}
	
	#summary #weight-charge #weightcharge.label {
		margin: 0 45px;
		padding: 3px 27px;
	}
	
	#summary #weight-charge #prepaid.label {
		border-left: none;
		width: 50px;
	}
	
	#summary #weight-charge #collect.label {
		border-right: none;
		width: 50px;
	}
	
	#summary #weight-charge #prepaid-input {
		width: 190px;
		border-right: 1px solid #BBB;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#summary #valuation-charge {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #valuation-charge #prepaid-input {
		width: 190px;
		border-right: 1px solid #BBB;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#summary #valuation-charge .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 18px;
		margin: 0 120px;
		width: 100px;
	}
	
	#summary #tax {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #tax .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 58px;
		margin: 0 120px;
	}
	
	#summary #tax #prepaid-input {
		width: 190px;
		height: 30px;
		border-right: 1px solid #BBB;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#collect-input {
		width: 185px;
		height: 30px;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#prepaid-input input {
		width: 175px;
		height: 20px;
		text-align: center;
	}
	
	#prepaid-input span {
		width: 1px;
		height: 20px;
	}
	
	#collect-input input {
		width: 175px;
		height: 20px;
		text-align: center;
	}
	
	#summary #total-other-charges-due-agent {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #total-other-charges-due-agent .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 20px;
		margin: 0 88px;
		width: 180px;
	}
	
	#summary #total-other-charges-due-agent #prepaid-input {
		width: 190px;
		height: 30px;
		border-right: 1px solid #BBB;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#summary #total-other-charges-due-carrier {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #total-other-charges-due-carrier .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 20px;
		margin: 0 88px;
		width: 180px;
	}
	
	#summary #total-other-charges-due-carrier #prepaid-input {
		width: 190px;
		height: 30px;
		border-right: 1px solid #BBB;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#summary #total-space {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
		background-color: #EEE;
	}
	
	#summary #total {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #total .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 28px;
		margin: 0 0 0 29px;
		width: 73px;
	}
	
	#summary #total .whitespace {
		width: 27px;
		height: 22px;
		border-right: 1px solid #BBB;
	}
	
	#summary #total #prepaid-input {
		width: 190px;
		height: 30px;
		border-right: 1px solid #BBB;
		display: inline-block;
		_zoom: 1;
		*display: inline;
	}
	
	#summary #currency-rates {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #currency-rates .label {
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		padding: 3px 0px;
		margin: 0 0 0 6px;
		width: 176px;
		text-align: center;
	}
	
	#summary #currency-rates .whitespace {
		width: 3px;
		height: 22px;
		border-right: 1px solid #BBB;
	}
	
	#summary #currency-rates #prepaid-input {
		width: 190px;
		height: 30px;
		border-right: 1px solid #BBB;
	}
	
	#summary #carriers-use-at-destination {
		width: 381px;
		height: 50px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		vertical-align: top;
	}
	
	#summary #other-charges {
		width: 617px;
		height: 152px;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#summary #other-charges .label {
		display: block;
		margin-left: 10px;
		line-height: 24px;
	}
	
	#summary #signature-of-agent {
		width: 617px;
		height: 254px;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#summary #signature-of-agent .label {
		display: block;
		margin-left: 10px;
		line-height: 16px;
	}
	
	#summary #signature-of-agent #signature-input {
		width: 617px;
		border-bottom: 1px solid #BBB;
		margin-top: 10px;
	}
	
	#summary #signature-of-agent #signature-input .label {
		width: 612px;
		display: block;
		margin: 4px 0;
		text-align: center;
	}
	
	#summary #signature-of-agent #signature-input-statement {
		width: 617px;
		margin-top: 32px;
	}
	
	#summary #signature-of-agent #signature-input-statement .label {
		width: 612px;
		display: block;
		margin: 4px 0;
		text-align: center;
	}
	
	#summary #signature-of-agent .TextBox {
		width: 590px;
		margin: 0 11px;
		border-bottom: 1px dotted #DDD;
	}
	
	#summary #signature-of-agent #executed-on-date {
		width: 150px;
		margin: 28px 5px 0 5px;
	}
	
	#summary #signature-of-agent #executed-on-date .label {
		margin: 4px 0;
		text-align: center;
	}
	
	#summary #executed-on-date .TextBox {
		width: 150px;
		border-bottom: 1px dotted #DDD;
	}
	
	#summary #at-place {
		width: 150px;
		margin: 28px 5px 0 5px;
	}
	
	#summary #signature-of-agent #at-place .label {
		margin: 4px 0;
		text-align: center;
	}
	
	#summary #at-place .TextBox {
		width: 150px;
		border-bottom: 1px dotted #DDD;
	}
	
	#summary #signature-of-issuing-carrier-or-its-agent {
		width: 230px;
		margin: 28px 5px 0 5px;
	}
	
	#summary #signature-of-issuing-carrier-or-its-agent .TextBox {
		width: 230px;
		border-bottom: 1px dotted #DDD;
	}
	
	#summary #signature-of-agent #signature-of-issuing-carrier-or-its-agent .label {
		margin: 4px 0;
		text-align: center;
	}
	/*--------------------------------------------------------------*/
	
	#departure,
	#destination {
		width: 245px;
		height: auto;
		float: left;
	}
	
	#departure span,
	#destination span {
		display: block;
		text-align: center;
	}
	
	#departure .TextBox,
	#destination .TextBox {
		width: 95%;
		height: 25px;
		border-bottom: 1px dotted #DDD;
		margin-bottom: 7px;
		text-align: center;
	}
	
	#charges,
	#payment {
		width: 100%;
		height: auto;
	}
	
	#charges #cc,
	#charges #pp {
		width: auto;
		display: block;
	}
	
	#charges #cc span,
	#charges #pp span {
		width: 120px;
		float: left;
		text-align: right;
	}
	
	#charges #cc .TextBox,
	#charges #pp .TextBox {
		width: 300px;
		height: 21px;
		text-align: center;
		border-bottom: 1px dotted #DDD;
		margin-top: 3px;
	}
	
	#charges #pp .TextBox {
		margin-bottom: 7px;
	}
	
	#payment #credit,
	#payment #cash {
		width: auto;
		display: block;
	}
	
	#payment #credit span,
	#payment #cash span {
		width: 120px;
		float: left;
		text-align: right;
	}
	
	#payment #credit .TextBox,
	#payment #cash .TextBox {
		width: 300px;
		height: 21px;
		text-align: right;
		border-bottom: 1px dotted #DDD;
		margin-top: 3px;
	}
	
	#payment #cash .TextBox {
		margin-bottom: 7px;
	}
	
	#charges input,
	#payment input {
		width: 90%;
	}
	
	#alsonotify span {
		display: block;
		text-align: center;
	}
	
	#alsonotify textarea {
		border: none;
		width: 93%;
		height: 30px;
		padding: 10px;
		overflow-y: visible;
	}
	
	#alsonotify .TextBox {
		width: 98%;
		height: 25px;
		border-bottom: 1px dotted #DDD;
	}
	
	#alsonotify .TextBox:last-child {
		margin-bottom: 7px;
	}
	
	#addtionalclause {
		margin-top: 15px;
		margin-bottom: 41px;
	}
	
	#addtionalclause span {
		display: block;
		text-align: center;
	}
	
	#addtionalclause p {
		margin-top: 3px;
		margin-left: 12px;
		margin-right: 9px;
		color: #999;
		display: block;
	}
	
	#destination {
		border-left: 1px solid #BBB;
		margin-left: -1px;
	}
	
	#declaredvalue {
		width: 418px;
		float: left;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#declaredvalue-shipper {
		width: 217px;
		float: left;
	}
	
	#declaredvalue-shipper .TextBox,
	#documents .TextBox {
		width: 95%;
		height: 40px;
		text-align: center;
		border-bottom: 1px dotted #CCC;
	}
	
	#declaredvalue-carriage {
		width: 200px;
		height: 30px;
		float: left;
		border-left: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#declaredvalue-customs {
		width: 200px;
		height: 30px;
		float: right;
		border-left: 1px solid #BBB;
	}
	
	#documents {
		width: 270px;
		float: left;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#handlinginformation {
		width: 890px;
		height: 75px;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
		float: left;
	}
	
	#handlinginformation .TextBox {
		width: 99%;
		height: 25px;
		border-bottom: 1px dotted #CCC;
	}
	
	#packages {
		width: 80px;
		float: left;
		border-left: 1px solid #BBB;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	/*#grossweight {
width: 130px;

float: left;
border-right: 1px solid #BBB;
border-bottom: 1px solid #BBB;
}*/
	
	#rateclass {
		width: 90px;
		float: left;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	/*#chargeableweight {
width: 160px;

float: left;
border-right: 1px solid #BBB;
border-bottom: 1px solid #BBB;
}*/
	
	#ratecharge {
		width: 100px;
		float: left;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#goods-edit {
		width: 325px;
		float: left;
		border-right: 1px solid #BBB;
		border-bottom: 1px solid #BBB;
	}
	
	#declaredvalue,
	#insurance,
	#documents {
		height: 90px;
	}
	
	#declaredvalue-carriage,
	#declaredvalue-customs {
		height: 45px;
	}
	
	#packages,
	#rateclass,
	#grossweight,
	#chargeableweight,
	#ratecharge,
	#goods {
		height: 100px;
	}
	
	#rate input {
		margin-left: 0px;
	}
	
	#packages .TextBox,
	#rateclass .TextBox,
	#grossweight .TextBox,
	#chargeableweight .TextBox,
	#ratecharge .TextBox,
	#goods .TextBox {
		width: 92%;
		height: 25px;
		border-bottom: 1px dotted #CCC;
		text-align: center;
	}
	
	#packages .TextBox {
		width: 90%;
	}
	
	#goods .TextBox {
		width: 96%;
		text-align: left;
	}
	
	#goods #AwbVolume {
		width: 20%;
		text-align: left;
		text-align: center;
	}
	
	#form-footer {
		width: 100%;
		float: left;
		margin-top: 10px;
	}
	
	#form-footer span {
		display: block;
	}
	
	#signatureofconstituent {
		width: 400px;
		float: left;
		margin-left: 30px;
		margin-top: 30px;
	}
	
	#signatureofagent {
		width: 400px;
		float: left;
		margin-top: 30px;
	}
	
	.shipperletter-div span {
		display: block;
		text-align: center;
	}
	
	.shipperletter-div span:first-child {
		margin-top: 5px;
	}
	
	.smallfont {
		font-size: 8px;
		font-weight: lighter;
	}
	/*********************************************************************************/
	
	#customer-info {
		width: 447px;
	}
	
	.city {
		width: 230px;
	}
	
	.city input {
		width: 120px;
	}
	
	.country {
		width: 230px;
	}
	
	.country input {
		width: 120px;
	}
	
	#service-action a {
		margin-left: 5px;
	}
	
	#service-summary {
		width: 250px;
		height: 47px;
		float: right;
	}
	
	#service-summary .currency {
		float: right;
		margin-top: 20px;
		font-weight: 700;
		font-size: 12px;
		color: #CCC;
	}
	
	#service-summary .amount {
		float: right;
		margin-left: 5px;
		margin-right: 5px;
		font-size: 30px;
		color: #777;
	}
	
	#service-quotation {
		float: left;
		width: 96%;
		border: 1px solid #DDD;
		border-radius: 3px;
		padding: 1px;
		margin-left: 10px;
		margin-right: 1px;
		margin-top: 5px;
		margin-bottom: 20px;
	}
	
	#service-quotation-editor {
		display: none;
		width: 850px;
		border: 1px solid #DDD;
		border-radius: 3px;
		padding: 1px;
	}
	
	#service-quotation table,
	#service-quotation-editor table {
		width: 100%;
		background: #F6F6F6;
		border-radius: 2px;
	}
	
	#service-quotation tr,
	#service-quotation-editor tr {
		border-bottom: 1px solid #DDD;
		height: 36px;
		line-height: 36px;
	}
	
	#service-quotation tr:last-child,
	#service-quotation-editor tr:last-child {
		border-bottom: none;
		background: #F3F3F3;
	}
	
	#service-quotation thead tr,
	#service-quotation-editor tr:last-child {
		height: 36px;
		line-height: 36px;
	}
	
	#service-quotation thead tr:last-child,
	#service-quotation-editor thead tr:last-child {
		border-bottom: 1px solid #DDD;
	}
	
	#service-quotation thead td,
	#service-quotation-editor thead td {
		font-weight: 700;
		font-size: 14px;
		color: #0f81b0;
		background: -webkit-gradient(linear, 0 0, 0 100%, from(#cff3cc), to(#F0F0F0));
		background: -moz-linear-gradient(top, #cff3cc, #F0F0F0);
		background-color: #EEE;
	}
	
	#service-quotation th,
	#service-quotation td,
	#service-quotation-editor th,
	#service-quotation-editor td {
		padding-left: 9px;
	}
	
	#service-quotation td input,
	#service-quotation-editor td input {
		height: 20px;
		line-height: 20px;
		border: 1px solid #DDD;
		border-radius: 3px;
		margin-right: 3px;
	}
	
	#service-request {
		width: 193px;
		float: left;
	}
	
	#departure-time,
	#destination-time {
		display: block;
		float: left;
		width: 187px;
	}
	
	#departure-time a,
	#destination-time a {
		display: block;
		float: right;
		width: 16px;
		height: 16px;
		margin-top: 5px;
		margin-right: 8px;
		background: #FFF url(/Transformer/images/calendar.png) no-repeat 0 0;
	}
	
	#departure-time input,
	#destination-time input {}
	
	#service-request input {
		width: 80px;
	}
	
	#cargo {
		width: 100%;
		float: left;
	}
	
	#cargo-detail {
		width: 185px;
		height: 139px;
		float: right;
		margin-top: -106px;
		margin-right: 2px;
	}
	
	#total-pieces {
		width: 230px;
		float: left;
	}
	
	#cargo-summary span {
		width: 55px;
		margin-top: 5px;
		float: left;
	}
	
	#cargo-summary span:last-child {
		width: 20px;
		float: right;
	}
	
	#cargo-summary input {
		text-align: right;
	}
	
	#cargo-summary textarea {
		border: none;
		margin-top: 8px;
		margin-left: 8px;
		/*edit by haihan 防止因为margin导致的ie下覆盖外边框*/
		width: 169px;
	}
	
	#total-pieces input,
	#total-chargeable-weight input,
	#total-gross-weight input,
	#total-volume input {
		width: 120px;
		float: left;
	}
	
	#total-chargeable-weight {
		width: 230px;
		float: left;
	}
	
	.unit {
		margin-top: 7px;
		margin-left: 3px;
		float: left;
		color: #999;
	}
	
	#total-volume .unit {
		margin-top: 1px;
	}
	
	#total-gross-weight {
		width: 230px;
		float: left;
	}
	
	#total-volume {
		width: 230px;
		float: left;
	}
	
	#shipper-info {
		width: 447px;
		float: left;
	}
	
	#customer-info input,
	#shipper-info input,
	#consignee-info input,
	#freightforwarder-info input {
		width: 350px;
	}
	
	#consignee-info {
		width: 447px;
		float: left;
	}
	
	#freightforwarder-info {
		width: 447px;
		float: left;
	}
	
	#service-orderno {
		width: 150px;
		margin-top: 8px;
		margin-left: 12px;
		float: left;
	}
	
	.service-product {
		width: 180px;
		text-align: left;
	}
	
	.service-price {
		width: 100px;
		text-align: center;
	}
	
	.service-amount {
		width: 100px;
		text-align: center;
	}
	
	.service-totalprice {
		width: 120px;
		text-align: center;
	}
	
	.service-memo {
		text-align: center;
	}
	
	input[id=单价] {
		width: 50px;
		text-align: right;
	}
	
	input[id=数量] {
		width: 50px;
		text-align: right;
	}
	
	input[id=小计] {
		width: 70px;
		text-align: right;
	}
	
	input[id=备注] {
		width: 220px;
		text-align: left;
	}
	
	input[id=订单编码] {
		width: 230px;
		font-size: 24px;
		color: #DE5A03;
		border-bottom: 1px dotted #CCC;
		outline: 0px solid #EEE;
		background-color: #f7f7f7;
	}
	
	td[id=总计] {
		text-align: right;
	}
	
	#service-orderno span {
		font-size: 24px;
		color: #DE5A03;
	}
	
	#service-action {
		width: 100px;
		height: 30px;
		margin-top: 8px;
		margin-left: 2px;
		float: left;
	}
	
	#service-action img {
		width: 24px;
		height: 24px;
		margin-top: 5px;
		float: left;
	}
	
	#chooseContype {
		display: none;
		position: absolute;
		width: 600px;
		border-radius: 3px;
		border-width: 1px;
		border-color: #DDD;
		border-style: solid;
		float: left;
	}
	
	.detail-editor {
		width: 785px;
		height: 360px;
		background-color: #F0F0F0;
		margin-top: 2px;
		margin-left: 2px;
	}
	
	.detail-editor .editor-tilte {
		width: 95%;
		float: left;
		font-size: 18px;
		color: #DE5A03;
		margin-top: 8px;
		margin-left: 10px;
	}
	
	.detail-editor .split-horizontal {
		margin-top: 5px;
	}
	
	.detail-editor #editor-div {
		width: 580px;
		height: 402px;
	}
	
	.detail-editor #quickselector {
		width: 200px;
		height: 405px;
		border-left: 2px solid #FFF;
		vertical-align: top;
		font-family: 'verb_light';
		overflow-y: auto;
	}
	
	.detail-editor #quickselector .favorite-head {
		display: inline-block;
		padding: 10px 0 0 12px;
		font-size: 14px;
		/*font-weight: bold;*/
		cursor: pointer;
	}
	
	.detail-editor #quickselector .favorite-head .editaction {
		font-size: 12px;
		color: #97c803;
		margin-left: 20px;
	}
	
	.detail-editor #quickselector .favorite-item {
		width: 180px;
		height: 56px;
		background-color: #FFF;
		margin: 7px 7px;
		padding: 0px 3px 0px 3px;
		border-bottom: 1px solid #CCC;
		cursor: pointer;
	}
	
	.detail-editor #quickselector .favorite-item #deleteaction {
		display: none;
		position: relative;
		top: 16px;
		left: 160px;
		color: #DE5A03;
		cursor: pointer;
	}
	
	.detail-editor #quickselector .favorite-item #deleteaction .IconFont {
		color: #DE5A03;
	}
	
	.detail-editor #quickselector .favorite-item:hover {
		width: 175px;
		color: #000000;
		background-color: #dff2fb;
		border-left: 5px solid #000000;
		padding: 0px 3px 0px 3px;
	}
	
	.detail-editor #quickselector .favorite-item span.IconFont {
		font-size: 12px;
		color: #000000;
		padding: 2px 5px;
		vertical-align: top;
	}
	
	.detail-editor #quickselector .favorite-item span.favarite-name {
		width: 150px;
	}
	
	.detail-editor .company,
	.detail-editor .address {
		width: 550px;
		float: left;
		margin-left: 10px;
	}
	
	.detail-editor .company input,
	.detail-editor .address input {
		width: 85%;
	}
	
	.detail-editor .contactname,
	.detail-editor .fax,
	.detail-editor .city,
	.detail-editor .pobox,
	.detail-editor .state,
	.detail-editor .countrycode,
	.detail-editor .telnumber,
	.email {
		width: 266px;
		float: left;
		margin-left: 10px;
	}
	
	.detail-editor .fax input,
	.detail-editor .city input,
	.detail-editor .pobox input,
	.detail-editor .state input,
	.detail-editor .telnumber input,
	.detail-editor .email input {
		width: 62%;
	}
	
	.detail-editor .contactname input {
		width: 50%;
	}
	
	.detail-editor .countrycode #Country {
		width: 40%;
		text-align: right;
	}
	
	.detail-editor .countrycode #CountryCode {
		width: 10%;
	}
	
	#package-detail-editor {
		width: 600px;
	}
	
	#package-detail-editor .editor-tilte {
		height: 32px;
	}
	
	#package-detail-editor input {
		width: 50px;
		padding: 0 5px;
		text-align: right;
	}
	
	#package-detail-editor table tfoot tr:first-child {
		border-top: 1px solid #DDD;
	}
	
	#othercharges-detail-editor {
		width: 560px;
	}
	
	#othercharges-detail-editor .tips {
		font-size: 12px;
		float: right;
		margin-top: 5px;
		color: #888;
	}
	
	#othercharges-detail-editor input {
		padding: 0 5px;
		text-align: right;
	}
	
	#othercharges-detail-editor .reason {
		width: 50px;
		text-align: center;
	}
	
	#othercharges-detail-editor .showname {
		width: 60px;
		text-align: center;
	}
	
	#othercharges-detail-editor .reason input {
		text-align: left;
	}
	
	#othercharges-detail-editor .showname input {
		width: 30px;
		text-align: center;
	}
	
	#othercharges-detail-editor .Amount input {
		width: 60px;
		text-align: right;
	}
	
	#othercharges-detail-editor .UnitPrice {
		width: 50px;
		text-align: center;
	}
	
	#othercharges-detail-editor .UnitPrice input {
		width: 50px;
		text-align: right;
	}
	
	#othercharges-detail-editor .Amount {
		width: 60px;
		text-align: center;
	}
	
	.add-action {
		cursor: pointer;
		padding: 0 8px;
		color: #97c803;
		font-size: 14px;
	}
	
	.remove-action {
		cursor: pointer;
		font-size: 14px;
		color: #000000;
	}
	
	.disabledBtn {
		width: 110px;
		height: 36px;
		line-height: 36px;
		font-size: 16px;
		margin: 15px 10px 0px 5px;
		text-align: center;
		background: -webkit-gradient(linear, 0 0, 0 100%, from(#E2E2E2), to(#E2E2E2));
		background-color: #E2E2E2;
		color: #0876C3;
		text-shadow: #A8A8A8 -1px -1px;
		box-shadow: inset 1px 1px #E2E2E2, #999 0 1px 3px;
		border: 1px solid #B9B9B9;
		border-radius: 3px;
		cursor: pointer;
	}
	
	.detail-editor .reason {
		width: 100px;
	}
	
	.detail-editor .reason input {
		width: 100px;
	}
	
	.detail-editor .showname,
	.detail-editor .Weight,
	.detail-editor .UnitPrice {
		width: 50px;
	}
	
	.detail-editor .showname input,
	.detail-editor .Weight input,
	.detail-editor .UnitPrice input {
		width: 50px;
	}
	
	#other-charges textarea {
		border: none;
		width: 95%;
		height: 90px;
		padding: 10px;
		overflow-y: visible;
		cursor: pointer;
	}
	
	#query-inner .queryleft {
		float: left;
		width: 290px;
		margin-top: 50px;
	}
	
	#query-inner .queryright {
		float: right;
		width: 300px;
	}
	
	.detail-editor .print {
		width: 548px;
		float: left;
		height: 88px;
		margin-left: 10px;
		margin-bottom: 5px;
	}
	
	.detail-editor .print span {
		width: 62px;
		vertical-align: top;
		padding-top: 5px;
	}
	
	.detail-editor .print textarea {
		border: none;
		margin-top: 3px;
		margin-left: 3px;
		width: 453px;
		height: 75px;
		padding-left: 10px;
		border-bottom: 1px solid #EEE;
		background-color: #F2F2F2;
		border-radius: 2px;
	}
	
	.editprint {
		height: 410px;
	}
	
	.detail-editor .action-div {
		float: left;
		width: 548px;
		height: 21px;
		padding: 5px 0px;
	}
	
	.detail-editor .action-div .action-item {
		padding: 0 5px;
	}
	
	.detail-editor .action-div .action-item:hover {
		color: #DE5A03;
	}
	
	.detail-editor .action-div span.IconFont {
		margin-left: 15px;
		margin-right: 5px;
		color: #97c803;
	}
	
	.detail-editor .action-div span.actionLabel {
		color: #596573;
	}
	
	.detail-editor .action-div span.actionLabel:hover {
		color: #DE5A03;
		cursor: pointer;
	}
	
	.button-flatestyle a.bterror {
		background-color: red;
	}
	
	.button-flatestyle a.btsuccess {
		background-color: green;
	}
	/* -------------------------------------------------------------------------------------------------
     login form style 20130505
--------------------------------------------------------------------------------------------------*/
	
	.login-form {
		margin-left: auto;
		margin-right: auto;
		padding: 0;
		display: none;
		width: 580px;
	}
	
	.login-form .form-main {
		background-color: #FFF;
		padding: 5px 3px;
	}
	
	.login-form .form-inner {
		margin-top: 25px;
		float: left;
	}
	
	.login-form .form-prompt {
		background-color: #EFEDE1;
		color: #777;
		height: 40px;
		border-radius: 3px;
		text-align: left;
	}
	
	.login-form .prompt-icon {
		font-size: 20px;
		color: #0AA7D6;
		float: left;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 10px;
	}
	
	.login-form .prompt-left {
		float: left;
		font-size: 16px;
	}
	
	.login-form .prompt-left .Title {
		float: left;
		margin-top: 13px;
	}
	
	.login-form .prompt-right {
		float: right;
		margin-right: 20px;
		margin-top: 10px;
		font-size: 16px;
	}
	
	.login-form .form-prompt a {
		color: white;
		font-size: 14px;
		cursor: auto;
	}
	
	.login-form .Login-TextBox-wrap {
		margin-top: 15px;
		margin-left: 5px;
		text-align: left;
		font-size: 16px;
		background-color: white;
		float: left;
	}
	
	.login-form .Login-TextBox-wrap span.label {
		margin-top: 10px;
		margin-left: 15px;
		margin-right: 15px;
		color: #0AA7D6;
		float: left;
	}
	
	.login-form .Login-TextBox-wrap span {
		margin-left: 15px;
		margin-right: 15px;
		color: #0AA7D6;
		float: left;
	}
	
	.login-form .Login-TextBox-wrap .Login-TextBox {
		width: 350px;
		margin-top: 0px;
		padding-left: 4px;
		padding-top: 1px;
		padding-bottom: 1px;
		border-radius: 3px;
		background-color: #F3F3F0;
		float: left;
	}
	
	.login-form .Login-TextBox-wrap .Login-InputBox {
		width: 339px;
		vertical-align: middle;
		_margin-top: 2px;
		border: none;
		font-size: 16px;
		color: #555;
		background-color: #FFF;
		border-top: 1px solid #DDD;
		border-left: 1px solid #DDD;
		border-right: 1px solid #EEE;
		border-bottom: 1px solid #EEE;
		border-radius: 2px;
		outline: 0px solid #EEE;
		padding: 6px 0 6px 5px;
		margin-top: 3px;
		margin-bottom: 3px;
	}
	
	.login-form .Login-submit .Login-button {
		width: 150px;
		height: 36px;
		line-height: 36px;
		font-size: 16px;
		margin: 15px 0px 20px 216px;
		text-align: center;
		background: -webkit-gradient(linear, 0 0, 0 100%, from(#239BEE), to(#0183DD));
		background: -moz-linear-gradient(top, #239BEE, #0183DD);
		background-color: #0183DD;
		color: white;
		text-shadow: #0876C3 -1px -1px;
		box-shadow: inset 1px 1px #87C9F7, #999 0 1px 3px;
		border: 1px solid #0183DD;
		border-radius: 3px;
		cursor: pointer;
	}
	
	.login-form .Login-submit .Login-button:hover {
		text-decoration: none;
		background: -webkit-gradient(linear, 0 0, 0 100%, from(#DCF0FF), to(#B6E0FD));
		background: -moz-linear-gradient(top, #DCF0FF, #B6E0FD);
		background-color: #B6E0FD;
		box-shadow: inset 1px 1px #EBF7FF, #999 0 1px 3px;
		border-color: #B6E0FD;
		color: #0876C3;
		text-shadow: white 1px 1px;
	}
	
	.login-form .Login-user,
	.login-form .Login-code,
	.login-form .Login-password {
		margin-left: 20px;
		margin-top: 15px;
		float: left;
	}
	
	.login-form .Login-password .Login-InputBox {
		/** width:200px;**/
	}
	
	.login-form .Login-mandatory {
		border: 1px solid #F60;
		outline: 0px solid #666;
		-moz-box-shadow: 1px 1px 3px #F60;
		-webkit-box-shadow: 0 0 3px #F60;
	}
	
	.login-form .Login-password .Login-TextBox span {
		font-size: 13px;
		float: right;
		color: #9BCB5E;
		margin-top: 13px;
		margin-bottom: 0;
		margin-left: 0;
		margin-right: 35px;
	}
	
	.login-form .Login-ErrorMessage-wrap {
		display: block;
		width: 350px;
		height: 25px;
		float: left;
		margin-left: 75px;
	}
	
	.login-form .Login-ErrorMessage {
		display: none;
		float: left;
		padding-top: 5px;
	}
	
	.login-form .Login-user .Login-ErrorMessage span,
	.login-form .Login-code .Login-ErrorMessage span,
	.login-form .Login-password .Login-ErrorMessage span {
		background: none;
		color: #f66;
		font-size: 14px;
		font-weight: bold;
		margin-top: 3px;
		margin-left: 0;
		margin-right: 5px;
		float: left;
	}
	
	.login-form .Login-message {
		display: block;
		width: 330px;
		height: 25px;
		background: none;
		color: #f66;
		font-size: 14px;
		font-weight: bold;
		padding: 3px 0 0 5px;
		border-radius: 3px;
		border: none;
	}
	/* -------------------------------------------------------------------------------------------------
     login style
--------------------------------------------------------------------------------------------------*/
	
	.login-wrap {
		float: left;
		width: 150px;
		text-align: left;
		margin-left: 18px;
	}
	
	.login-wrap .login a,
	.login-wrap .register a {
		color: #009ce6;
		font-size: 13px;
		float: left;
		cursor: pointer;
	}
	
	.login-wrap .register a {
		margin-right: 15px;
	}
	
	.login-wrap .login a:hover {
		color: #e28c24;
		float: left;
	}
	
	.login-wrap .accountimg {
		float: left;
		margin-top: 1px;
		display: none;
	}
	
	.login-wrap .accountname {
		float: left;
		cursor: pointer;
		display: none;
	}
	
	.login-wrap .accountname .name:hover {
		color: #ee9526;
	}
	
	.login-wrap .accountname .name {
		float: left;
		color: #009ce6;
		font-size: 13px;
	}
	
	.login-wrap .accountname .IconFont {
		color: #009ce6;
		margin-left: 5px;
		vertical-align: bottom;
	}
	
	.login-wrap .accountname .IconFont:hover {
		color: #ee9526;
	}
	
	.login-wrap .logout {
		display: none;
	}
	
	.login-wrap .logout a {
		float: left;
		margin-left: 10px;
		width: 30px;
		color: #777;
	}
	
	.login-wrap .logout a:hover {
		color: #ee9526;
	}
	/* -------------------------------------------------------------------------------------------------
    account style
--------------------------------------------------------------------------------------------------*/
	
	.account-menu {
		position: absolute;
		left: 1000px;
		top: 62px;
		z-index: 120;
		overflow-x: hidden;
		overflow-y: hidden;
		width: 150px;
		background-color: #F0F0F0;
		border-bottom: 1px solid #BBB;
		display: none;
	}
	
	.account-menu .account-menulist {
		margin: 0;
		min-height: 277px;
		padding: 0;
	}
	
	.account-menu .account-menulist a {
		border-bottom: 1px dotted #CCC;
		color: #555;
		background-color: #F0F0F0;
		cursor: pointer;
		height: 22px;
		line-height: 22px;
		min-height: 22px;
		overflow: hidden;
		padding: 5px 9px 5px 12px;
		text-align: left;
		text-decoration: none;
		display: block;
	}
	
	.account-menu .account-menulist a:last-child {
		border-bottom: none;
	}
	
	.account-menu .account-menulist span {
		float: left;
		margin: 0;
		overflow: hidden;
		padding: 0;
		text-align: left;
		white-space: nowrap;
		width: 110px;
	}
	
	.account-menu .account-menulist a:hover {
		background: #009ce6 0 0;
		border-left: 5px solid #ffa400;
		color: #fff;
	}
	
	.errormsg {
		border-bottom: 1px dotted red !important;
		color: red;
	}
	
	.page-link {
		padding: 1px 1px 1px;
	}
	
	.page-current {
		padding: 1px 1px 1px;
	}
	
	.page-prev {
		padding: 7px 1px 1px;
	}
	
	.page-next {
		padding: 7px 1px 1px;
	}
	
	.arrow-next {
		margin: 0px;
		padding: 0px;
	}
	
	.arrow-prev {
		margin: 0px;
		padding: 0px;
	}
	
	.paginationc {
		margin-top: -20px;
		border-radius: 4px;
		position: relative;
		border: 1px solid #D7D7D7;
		margin-bottom: 50px;
		zoom: 1;
		margin: 0;
		padding: 0;
		border: 0;
		outline: 0;
		font-size: 100%;
		content: '.';
		display: block;
		clear: both;
	}
</style>