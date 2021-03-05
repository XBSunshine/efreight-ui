<template>
  <el-dialog
    title=""
    :fullscreen="ifFullscreen"
    width="1300px"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :style="style"
    :show-close="!ifFullscreen"
    :append-to-body="ifFromInquiry"
  >
    <div class="orderEditPage" style="width: 1280px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        :inline="true"
        ref="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
        style="margin-left: 10px"
      >
        <div style="margin-top: -15px; margin-bottom: 20px">
          <span style="font-size: large; margin-bottom: 20px"
            >空运操作订单 - 新增</span
          >
          <el-link
            :href="helpDocumentUrl"
            target="_blank"
            :underline="false"
            type="primary"
            icon="el-icon-question"
            style="top: -3px"
            v-if="helpDocumentUrl"
          >
          </el-link>
        </div>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="orderCode">
              <el-input
                v-model="ruleForm.orderCode"
                auto-complete="off"
                disabled
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">业务单号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="awbNumber">
              <el-input
                v-model="ruleForm.awbNumber"
                 @change="changeAwbNumber"
                clearable
                maxlength="12"
                @input="formatToFloat('awbNumber')"

                auto-complete="off"
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">
                  <span>主运单号</span>
                </template>
                <el-button
                  slot="append"
                  @click="awbNumberSelect"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="padding: 0px 0px 20px 0px">
          <HR color="#eee" size="5" />
        </div>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="departureStation">
              <el-input
                class="widthWithThreeWithXing"
                @change="sychronizeWareAndStore"
                v-model="ruleForm.departureStation"
                clearable
                auto-complete="off"
                maxlength="4"
                style="width: 295px; margin-right: 15px"



              >
                <template slot="prepend">
                  <font style="color: red">*</font>
                  <span>始发港</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="arrivalStation">
              <el-input
                class="widthWithThreeWithXing arrivalStationForAESave"
                v-model="ruleForm.arrivalStation"
                clearable
                @input="
                  ruleForm.arrivalStation = strTrim(
                    ruleForm.arrivalStation
                  ).toUpperCase()
                "
                auto-complete="off"
                maxlength="4"
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">
                  <font style="color: red">*</font>
                  <span>目的港</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="expectFlight">
              <el-input
                class="widthWithThree"
                v-model="ruleForm.expectFlight"
                clearable
                @change="
                  ruleForm.expectFlight = strTrim(
                    ruleForm.expectFlight
                  ).toUpperCase()
                "
                maxlength="8"
                auto-complete="off"
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">
                  <span>航班号</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="expectDeparture">
              <el-input
                class="widthWithFourWithXing expectDepartureForAESave"
                style="width: 295px"
              >
                <template slot="prepend">
                  <font style="color: red">*</font>
                  <span>航班日期</span>
                </template>
                <el-date-picker
                  slot="suffix"
                  v-model="ruleForm.expectDeparture"
                  clearable
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择航班日期"
                  style="width: 198px; margin-right: -5px"
                >
                </el-date-picker>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="transitStation">
              <el-input
                class="widthWithThreeWithXing"
                v-model="ruleForm.transitStation"
                clearable
                @input="
                  ruleForm.transitStation = strTrim(
                    ruleForm.transitStation
                  ).toUpperCase()
                "
                auto-complete="off"
                maxlength="4"
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">
                  <span>中转港1</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="transitStation2">
              <el-input
                class="widthWithThreeWithXing"
                v-model="ruleForm.transitStation2"
                clearable
                @change="
                  ruleForm.transitStation2 = strTrim(
                    ruleForm.transitStation2
                  ).toUpperCase()
                "
                auto-complete="off"
                maxlength="4"
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">
                  <span>中转港2</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="goodsSourceCode">
              <el-input
                class="widthWithThree"
                v-model="ruleForm.goodsSourceCode"
                clearable
                @change="
                  ruleForm.goodsSourceCode = strTrim(
                    ruleForm.goodsSourceCode
                  ).toUpperCase()
                "
                auto-complete="off"
                maxlength="5"
                style="width: 295px; margin-right: 15px"
              >
                <template slot="prepend">
                  <span>货源地</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="planPieces">
              <el-input
                class="widthWithFourWithXing"
                @change="ruleForm.planPieces = strTrim(ruleForm.planPieces)"
                @input="formatToFloat('planPieces')"
                maxlength="8"
                v-model="ruleForm.planPieces"
                auto-complete="off"
                style="width: 295px; margin-right: 15px"
                clearable
              >
                <template slot="prepend">
                  <font style="color: red">*</font>
                  <span>预报件数</span>
                </template>
                <el-select
                  slot="append"
                  v-model="ruleForm.packageType"
                  clearable
                  placeholder="包装"
                  style="width: 85px"
                >
                  <el-option
                    v-for="item in packageTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="planWeight">
              <el-input
                class="widthWithFourWithXing"
                @input="formatToFloat('planWeight')"
                @change="
                  setPlanChargeWeight();
                  formatDecimalPlaces('planWeight');
                "
                maxlength="10"
                v-model="ruleForm.planWeight"
                auto-complete="off"
                style="width: 295px; margin-right: 15px"
                clearable
              >
                <template slot="prepend">
                  <font style="color: red">*</font>
                  <span>预报毛重</span>
                </template>
                <template slot="append">
                  <span>KG</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item prop="planVolume">
              <el-input
                class="widthWithFourWithXing"
                @input="formatToFloat('planVolume')"
                maxlength="10"
                @change="
                  setPlanChargeWeight();
                  formatDecimalPlaces('planVolume');
                "
                v-model="ruleForm.planVolume"
                auto-complete="off"
                style="width: 295px; margin-right: 15px"
                clearable
              >
                <template slot="prepend">
                  <font style="color: red">*</font>
                  <span>预报体积</span>
                </template>
                <template slot="append">
                  <span>CBM</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item>
              <el-input
                readOnly
                v-model="ruleForm.planChargeWeight"
                auto-complete="off"
                style="width: 295px"
              >
                <template slot="prepend">
                  <span>预报计重</span>
                </template>
                <template slot="append">
                  <span>KG</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="planDimensions">
              <el-input
                v-model="ruleForm.planDimensions"
                auto-complete="off"
                style="width: 935px; margin-right: 15px"
                readOnly
              >
                <template slot="prepend">
                  <span>预报尺寸</span>
                </template>
                <el-button
                  slot="append"
                  @click="gotoSizePage"
                  icon="el-icon-edit"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item>
              <el-input
                readOnly
                v-model="ruleForm.planDensity"
                auto-complete="off"
                style="width: 295px"
              >
                <template slot="prepend">
                  <span>预报密度</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="orderRemark">
              <el-input
                class="showWordLimit"
                v-model="ruleForm.orderRemark"
                @change="ruleForm.orderRemark = strTrim(ruleForm.orderRemark)"
                auto-complete="off"
                style="width: 1255px"
                clearable
                show-word-limit
                maxlength="200"
              >
                <template slot="prepend">
                  <span>订单备注</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="padding: 0px 0px 10px 0px; display: none">
          <HR color="#eee" size="5" />
        </div>
        <div style="padding: 0px 0px 0px 30px; display: none">
          <span>价格信息</span>
          <el-button
            type="text"
            size="small"
            v-if="showFlag3"
            v-on:click="showFlag3 = false"
            >收起<i class="el-icon-arrow-down"></i
          ></el-button>
          <el-button
            type="text"
            size="small"
            v-if="!showFlag3"
            v-on:click="showFlag3 = true"
            >展开<i class="el-icon-arrow-up"></i
          ></el-button>
          <el-row v-show="showFlag3" style="margin-top: 20px">
            <el-col
              class="elementWidth afOrderLinkTwoInput"
              style="margin-left: 50px"
            >
              <el-form-item prop="currecnyCode">
                <el-input auto-complete="off" style="width: 200px">
                  <template slot="prepend">
                    <span>运费卖价</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.currecnyCode"
                    placeholder="请选择"
                    style="width: 103px; margin-right: -5px"
                    clearable
                  >
                    <el-option
                      v-for="item in currencyCodeOptions"
                      :key="item.currency_code"
                      :label="item.currency_code"
                      :value="item.currency_code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
                <el-input
                  v-model="ruleForm.priceValue"
                  auto-complete="off"
                  @input="formatToFloat('priceValue')"
                  maxlength="13"
                  style="width: 105px; margin-left: -5px; margin-right: 15px"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  auto-complete="off"
                  style="width: 200px; margin-right: 15px"
                >
                  <template slot="prepend">
                    <span>卖价形式</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.priceType"
                    placeholder="请选择"
                    style="width: 103px; margin-right: -5px"
                    clearable
                  >
                    <el-option label="单价" value="单价"></el-option>
                    <el-option label="总价" value="总价"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  class="showWordLimit"
                  v-model="ruleForm.freightProfitRatioRemark"
                  auto-complete="off"
                  style="width: 547px"
                  clearable
                  show-word-limit
                  maxlength="200"
                >
                  <template slot="prepend">
                    <span>客户分泡</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag3">
            <el-col
              class="elementWidth afOrderLinkTwoInput"
              style="margin-left: 50px"
            >
              <el-form-item prop="msrCurrecnyCode">
                <el-input auto-complete="off" style="width: 200px">
                  <template slot="prepend">
                    <span>运费成本</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.msrCurrecnyCode"
                    placeholder="请选择"
                    style="width: 103px; margin-right: -5px"
                    clearable
                  >
                    <el-option
                      v-for="item in msrCurrecnyCodeOptions"
                      :key="item.currency_code"
                      :label="item.currency_code"
                      :value="item.currency_code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
                <el-input
                  v-model="ruleForm.priceValue2"
                  auto-complete="off"
                  @input="formatToFloat('priceValue2')"
                  maxlength="13"
                  style="width: 105px; margin-left: -5px; margin-right: 15px"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  auto-complete="off"
                  style="width: 200px; margin-right: 15px"
                >
                  <template slot="prepend">
                    <span>成本形式</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.priceType2"
                    placeholder="请选择"
                    style="width: 103px; margin-right: -5px"
                    clearable
                  >
                    <el-option label="单价" value="单价"></el-option>
                    <el-option label="总价" value="总价"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  class="showWordLimit"
                  v-model="ruleForm.msrProfitRatioRemark"
                  auto-complete="off"
                  style="width: 547px"
                  clearable
                  show-word-limit
                  maxlength="200"
                >
                  <template slot="prepend">
                    <span>成本分泡</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag3">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item>
                <el-input
                  auto-complete="off"
                  style="width: 200px; margin-right: 15px"
                >
                  <template slot="prepend">
                    <span>运费支付</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.paymentMethod"
                    placeholder="请选择"
                    style="width: 103px; margin-right: -5px"
                    clearable
                  >
                    <el-option label="PP" value="PP"></el-option>
                    <el-option label="CC" value="CC"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth" style="margin-left: 104px">
              <el-form-item>
                <el-input auto-complete="off" style="width: 200px">
                  <template slot="prepend">
                    <span>杂费支付</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.paymentMethodOther"
                    placeholder="请选择"
                    style="width: 103px; margin-right: -5px"
                    clearable
                  >
                    <el-option label="PP" value="PP"></el-option>
                    <el-option label="CC" value="CC"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag3">
            <el-col style="margin-left: 50px">
              <el-form-item>
                <el-row>
                  <el-button type="text" style="margin-left: 20px" disabled
                    >价格备注</el-button
                  >
                </el-row>
                <el-input
                  class="showWordLimit"
                  type="textarea"
                  :rows="3"
                  show-word-limit
                  maxlength="500"
                  v-model="ruleForm.priceRemark"
                  auto-complete="off"
                  style="width: 1102px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
        <div style="padding: 0px 0px 0px 30px">
          <span v-if="ruleForm.hawbQuantity == 0">制单信息(直单)</span>
          <span v-else>制单信息({{ ruleForm.hawbQuantity }}分)</span>
          <el-button
            type="text"
            size="small"
            v-if="showFlag1"
            v-on:click="showFlag1 = false"
            >收起<i class="el-icon-arrow-down"></i
          ></el-button>
          <el-button
            type="text"
            size="small"
            v-if="!showFlag1"
            v-on:click="showFlag1 = true"
            >展开<i class="el-icon-arrow-up"></i
          ></el-button>
          <el-row v-show="showFlag1">
            <el-row>
              <el-col class="elementWidth" style="margin-left: 50px">
                <el-button type="text" style="margin-left: 20px; color: #409eff"
                  >主运单信息</el-button
                >
                <el-button
                  @click="shipperLetterEdit()"
                  icon="el-icon-edit"
                  type="text"
                  >编辑</el-button
                >
              </el-col>
            </el-row>
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-row>
                <el-button type="text" style="margin-left: 20px" disabled
                  >发货人信息</el-button
                >
                <el-button
                  @click="gotoShipperConsigneePage(0)"
                  icon="el-icon-edit"
                  type="text"
                  >编辑</el-button
                >
              </el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    type="textarea"
                    v-model="ruleForm.afOrderShipperConsignee2.scPrintRemark"
                    @input="
                      ruleForm.afOrderShipperConsignee2.scPrintRemark = ruleForm.afOrderShipperConsignee2.scPrintRemark.toUpperCase()
                    "
                    auto-complete="off"
                    :rows="5"
                    disabled
                    style="width: 520px"
                  >
                  </el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-row>
                <el-button type="text" style="margin-left: 20px" disabled
                  >收货人信息</el-button
                >
                <el-button
                  @click="gotoShipperConsigneePage(1)"
                  icon="el-icon-edit"
                  type="text"
                  >编辑</el-button
                >
              </el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    type="textarea"
                    v-model="ruleForm.afOrderShipperConsignee1.scPrintRemark"
                    @input="
                      ruleForm.afOrderShipperConsignee1.scPrintRemark = ruleForm.afOrderShipperConsignee1.scPrintRemark.toUpperCase()
                    "
                    auto-complete="off"
                    :rows="5"
                    disabled
                    style="width: 520px"
                  >
                  </el-input>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-show="showFlag1">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-row>
                <el-button type="text" style="margin-left: 20px" disabled
                  >通知人信息</el-button
                >
              </el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    class="showWordLimit"
                    type="textarea"
                    show-word-limit
                    maxlength="500"
                    v-model="ruleForm.notifierRemark"
                    auto-complete="off"
                    :rows="5"
                    style="width: 520px"
                    @input="
                      ruleForm.notifierRemark = ruleForm.notifierRemark.toUpperCase()
                    "
                  >
                  </el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-row>
                <el-button type="text" style="margin-left: 20px" disabled
                  >目的港代理</el-button
                >
              </el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    type="textarea"
                    class="showWordLimit"
                    show-word-limit
                    maxlength="500"
                    v-model="ruleForm.arrivalAgent"
                    auto-complete="off"
                    :rows="5"
                    style="width: 520px"
                    @input="
                      ruleForm.arrivalAgent = ruleForm.arrivalAgent.toUpperCase()
                    "
                  >
                  </el-input>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-show="showFlag1">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item prop="goodsNameCn">
                <el-row>
                  <el-button type="text" style="margin-left: 20px" disabled
                    >中文品名</el-button
                  >
                </el-row>
                <el-input
                  class="showWordLimit"
                  type="textarea"
                  v-model="ruleForm.goodsNameCn"
                  @change="
                    ruleForm.goodsNameCn = strTrim(
                      ruleForm.goodsNameCn
                    ).toUpperCase()
                  "
                  auto-complete="off"
                  :rows="3"
                  maxlength="500"
                  style="width: 540px"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 12px">
                <el-row>
                  <el-button type="text" style="margin-left: 20px" disabled
                    >英文品名</el-button
                  >
                  <el-checkbox
                    style="margin-left: 36px"
                    v-model="ruleForm.isConsol"
                    @change="changeIsConsol"
                    >CONSOL</el-checkbox
                  >
                </el-row>
                <el-input
                  class="showWordLimit"
                  type="textarea"
                  v-model="ruleForm.goodsNameEn"
                  @change="
                    ruleForm.goodsNameEn = strTrim(
                      ruleForm.goodsNameEn
                    ).toUpperCase()
                  "
                  auto-complete="off"
                  :rows="3"
                  maxlength="500"
                  style="width: 540px"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag1">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item prop="shippingMarks">
                <el-row>
                  <el-button type="text" style="margin-left: 20px" disabled
                    >唛头信息</el-button
                  >
                </el-row>
                <el-input
                  class="showWordLimit"
                  type="textarea"
                  v-model="ruleForm.shippingMarks"
                  auto-complete="off"
                  :rows="3"
                  maxlength="500"
                  style="width: 540px"
                  show-word-limit
                  @input="
                    ruleForm.shippingMarks = ruleForm.shippingMarks.toUpperCase()
                  "
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth" style="margin-left: 12px">
              <el-form-item prop="handlingInfo">
                <el-row>
                  <el-button type="text" style="margin-left: 20px" disabled
                    >Handling&nbsp;Info</el-button
                  >
                  <el-checkbox
                    style="margin-left: 10px"
                    v-model="ruleForm.isNoSolidWood"
                    @change="changeIsNoSolidWood"
                    >非木</el-checkbox
                  >
                  <el-checkbox style="margin-left: 10px;" v-model="ruleForm.isCelsiusRequire" @change="changeIsCelsiusRequire">温度要求</el-checkbox>
                </el-row>
                <el-input
                  class="showWordLimit"
                  type="textarea"
                  v-model="ruleForm.handlingInfo"
                  auto-complete="off"
                  :rows="3"
                  maxlength="500"
                  style="width: 540px"
                  show-word-limit
                  @input="
                    ruleForm.handlingInfo = ruleForm.handlingInfo.toUpperCase()
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag1">
            <el-row>
              <el-col class="elementWidth" style="margin-left: 50px">
                <el-button type="text" style="margin-left: 20px; color: #409eff"
                  >分单信息</el-button
                >
                <el-button
                  @click="shipperLetterEdit()"
                  icon="el-icon-edit"
                  type="text"
                  >编辑</el-button
                >
              </el-col>
            </el-row>
            <el-col
              class="elementWidth"
              style="margin-left: 50px; margin-top: 20px"
            >
              <el-table
                :data="ruleForm.shipperLetters"
                stripe
                border
                style="width: 1103px"
              >
                <el-table-column align="center" width="90">
                  <template slot="header">
                    <i
                      class="iconfont el-icon-myyuanquanjiahao"
                      @click="addHawb"
                      style="cursor: pointer; size: b5; color: #409eff"
                    ></i>
                  </template>
                  <template slot-scope="scope">
                    <i
                      class="iconfont el-icon-myjianhao"
                      @click="deleteHawb(scope.$index, scope.row)"
                      style="cursor: pointer; size: b5; color: #409eff"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="分运单号" width="150">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.hawbNumber"
                      @input="
                        scope.row.hawbNumber = scope.row.hawbNumber.toUpperCase()
                      "
                      maxlength="12"
                      clearable
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="分单品名">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.goodsNameCn"
                      clearable
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="件数" width="130">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.planPieces"
                      @input="checkInt(scope.row, 'planPieces')"
                      clearable
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="毛重" width="160">
                  <template slot-scope="scope">
                    <el-input
                      class="widthWithKG"
                      size="small"
                      v-model="scope.row.planWeight"
                      @input="checkFloat(scope.row, 'planWeight')"
                      clearable
                    >
                      <i slot="append">KG</i>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="分单目的港" width="130">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.arrivalStation"
                      @change="scope.row.arrivalStation = strTrim(scope.row.arrivalStation).toUpperCase().substr(0, 3)"
                      clearable
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="shipperLetterEdit(scope.$index)"
                      >详情</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
        <div style="padding: 0px 0px 0px 30px">
          <span>操作详情</span>
          <el-button
            type="text"
            size="small"
            v-if="showFlag2"
            v-on:click="showFlag2 = false"
            >收起<i class="el-icon-arrow-down"></i>
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="!showFlag2"
            v-on:click="showFlag2 = true"
            >展开<i class="el-icon-arrow-up"></i>
          </el-button>
          <el-row v-show="showFlag2" style="margin-top: 5px">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item prop="goodsType">
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>货物类型</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.goodsType"
                    clearable
                    placeholder="请选择货物类型"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in goodsTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="specialHandleCodeM3">
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span></span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.specialHandleCodeM3"
                    clearable
                    placeholder="特货请选择特殊货物代码"
                    style="width: 268px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in spshTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="businessType">
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>业务模式</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.businessType"
                    clearable
                    placeholder="请选择业务模式"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in businessTypeOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>

            <el-form-item>
              <el-col class="elementWidth" v-if="customsCodeFlag">
                <el-form-item prop="transPortMode">
                  <el-input style="width: 268px">
                    <template slot="prepend">
                      <font style="color: red">*</font>
                      <span>运输方式</span>
                    </template>
                    <el-select
                      slot="suffix"
                      v-model="ruleForm.transPortMode"
                      clearable
                      placeholder="请选择运输方式"
                      style="width: 171px; margin-right: -5px"
                    >
                      <el-option
                        v-for="item in transPortModeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" v-show="!customsCodeFlag">
                <el-form-item>
                  <el-input style="width: 268px">
                    <template slot="prepend">
                      <span>运输方式</span>
                    </template>
                    <el-select
                      slot="suffix"
                      v-model="ruleForm.transPortMode"
                      clearable
                      placeholder="请选择运输方式"
                      style="width: 171px; margin-right: -5px"
                    >
                      <el-option
                        v-for="item in transPortModeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row v-show="showFlag2">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item prop="tranFlag">
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>出口类型</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.tranFlag"
                    placeholder="请选择出口类型"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in tranFlagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item >
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>货物性质</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.cargoType"
                    clearable
                    placeholder="请选择货物性质"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in cargoTypeOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="batteryType">
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>电池情况</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.batteryType"
                    clearable
                    placeholder="请选择电池情况"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in batteryTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="customsStatusCode">
                <el-input class="widthWithSix2" style="width: 268px">
                  <template slot="prepend">
                    <span>货物海关代码</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.customsStatusCode"
                    clearable
                    placeholder="请选择海关代码"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in codeOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag2">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item prop="packSize">
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>包裹大小</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.packSize"
                    clearable
                    placeholder="请选择包裹大小"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in packSizeOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="dangerousType">
                <el-input
                  style="width: 268px"
                  @input="
                    ruleForm.dangerousType = ruleForm.dangerousType.toUpperCase()
                  "
                  v-model="ruleForm.dangerousType"
                  auto-complete="off"
                  clearable
                  maxlength="40"
                >
                  <template slot="prepend">
                    <span>危品类项</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  v-if="
                    this.buildUpCompanyOptions.length > 0 &&
                    this.ruleForm.departureStation
                  "
                  style="width: 268px"
                  clearable
                  placeholder="请输入"
                >
                  <template slot="prepend">
                    <span>打板代理</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.buildUpCompany"
                    clearable
                    placeholder="请选择"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in buildUpCompanyOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
                <el-input
                  v-model="ruleForm.buildUpCompany"
                  v-else
                  style="width: 268px"
                  clearable
                  placeholder="请输入"
                >
                  <template slot="prepend">
                    <span>打板代理</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input class="widthWithSix2" style="width: 268px">
                  <template slot="prepend">
                    <span>入区预约时间</span>
                  </template>
                  <el-date-picker
                    slot="suffix"
                    v-model="ruleForm.outfieldDeliveryArriveTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择时间"
                    style="width: 171px; margin-right: -5px"
                  >
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag2">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item>
                <el-input
                  v-if="
                    this.outfieldDeliveryHandlingCompanyOptions.length > 0 &&
                    this.ruleForm.departureStation
                  "
                  style="width: 268px"
                  clearable
                  placeholder="请输入"
                >
                  <template slot="prepend">
                    <span>搬运公司</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.outfieldDeliveryHandlingCompany"
                    clearable
                    placeholder="请选择"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in outfieldDeliveryHandlingCompanyOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
                <el-input
                  v-model="ruleForm.outfieldDeliveryHandlingCompany"
                  v-else
                  style="width: 268px"
                  clearable
                  placeholder="请输入"
                >
                  <template slot="prepend">
                    <span>搬运公司</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth" >
              <el-form-item>
                <el-input
                  v-if="
                    this.wareNameOptions.length > 0 &&
                    this.ruleForm.departureStation
                  "
                  style="width: 268px"
                  clearable
                  placeholder="请输入"
                >
                  <template slot="prepend">
                    <span>入仓公司</span>
                  </template>
                  <el-select
                    slot="suffix"
                    v-model="ruleForm.wareName"
                    clearable
                    placeholder="请选择"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in wareNameOptions"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-input>
                <el-input
                  v-model="ruleForm.wareName"
                  v-else
                  style="width: 268px"
                  clearable
                  placeholder="请输入"
                >
                  <template slot="prepend">
                    <span>入仓公司</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  style="width: 268px"
                  v-model="ruleForm.mainOrderUnit"
                  auto-complete="off"
                  clearable
                  maxlength="32"
                >
                  <template slot="prepend">
                    <span>主货单位</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>到货日期</span>
                  </template>
                  <el-date-picker
                    slot="suffix"
                    v-model="ruleForm.receiptDate"
                    clearable
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择到货日期"
                    style="width: 171px; margin-right: -5px"
                  >
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag2">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item>
                <el-input style="width: 268px">
                  <template slot="prepend">
                    <span>交货货站</span>
                  </template>
                  <el-select
                    slot="suffix"
                    clearable
                    v-model="ruleForm.departureWarehouseId"
                    placeholder="请选择"
                    style="width: 171px; margin-right: -5px"
                  >
                    <el-option
                      v-for="item in departureWarehouseOptions"
                      :key="item.warehouseId"
                      :label="item.warehouseNameCn"
                      :value="item.warehouseId"
                    >
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item>
                <el-input
                  v-model="ruleForm.transitCode"
                  auto-complete="off"
                  style="width: 268px"
                >
                  <template slot="prepend">
                    <span>转关单号</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth" v-if="customsCodeFlag">
              <el-form-item prop="customsCode">
                <el-input
                  class="widthWithSix2"
                  v-model="ruleForm.customsCode"
                  auto-complete="off"
                  clearable
                  maxlength="4"
                  style="width: 268px"
                >
                  <template slot="prepend">
                    <font style="color: red">*</font>
                    <span>离境地海关代码</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth" v-show="!customsCodeFlag">
              <el-form-item>
                <el-input
                  class="widthWithSix2"
                  v-model="ruleForm.customsCode"
                  auto-complete="off"
                  clearable
                  maxlength="4"
                  style="width: 268px"
                >
                  <template slot="prepend">
                    <span>离境地海关代码</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="specialPackage">
                <el-input style="width:266px;margin-right: 15px;">
                  <template slot="prepend">
                    <span>特货包装</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.specialPackage" clearable placeholder="请选择特货包装" style="width:169px;margin-right: -5px;">
                    <el-option v-for="item in specialPackageOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag2">
            <el-col class="elementWidth" style="margin-left: 50px">
              <el-form-item prop="celsiusRequire">
                <el-input style="width:268px;">
                  <template slot="prepend">
                    <span>温度要求</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.celsiusRequire" clearable placeholder="请选择温度要求" style="width:171px;margin-right: -5px;">
                    <el-option v-for="item in celsiusRequireOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth">
              <el-form-item>
                <el-input auto-complete="off" style="width:268px;" class="widthWithThermometer">
                  <template slot="prepend">
                    <span>温度计</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.thermometer" placeholder="请选择" style="width:171px;margin-right: -5px;" clearable>
                    <el-option label="有" value="1"></el-option>
                    <el-option label="无" value="0"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth ">
              <el-form-item prop="palletMaterial">
                <el-input style="width:268px;margin-right: 15px;">
                  <template slot="prepend">
                    <span>托盘材质</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.palletMaterial" clearable placeholder="请选择托盘材质" style="width:171px;margin-right: -5px;">
                    <el-option v-for="item in palletMaterialOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <el-row>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="small"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
      <save
        ref="addMission"
        v-if="save"
        :visible.sync="save"
        :frow="ffrow"
      ></save>
      <save2
        ref="addMission"
        v-if="save2"
        :visible.sync="save2"
        :frow="ffrow"
      ></save2>
      <saveawb
        ref="addMission"
        v-if="saveawb"
        :visible.sync="saveawb"
        :frow="ffrow"
      ></saveawb>
      <shipperConsignee2
        ref="addMission"
        v-if="shipperConsignee2"
        :visible.sync="shipperConsignee2"
        :frow="ffrow"
      ></shipperConsignee2>
      <awbNumber
        ref="addMission"
        v-if="awbNumberVisible"
        :visible.sync="awbNumberVisible"
        :frow="ffrow"
      ></awbNumber>
      <shipperLetter
        ref="addMission"
        v-if="shipperLetterVisible"
        :visible.sync="shipperLetterVisible"
        :frow="ffrow"
        @shipperLetterCallback="shipperLetterCallback"
      ></shipperLetter>
    </div>
  </el-dialog>
</template>
<script>
import save from "@/views/public/customer_select";
import save2 from "@/views/public/size_edit";
import saveawb from "./af_order_awb_save";
import shipperConsignee2 from "@/views/public/shipper_consignee_select";
import AwbNumber from "@/views/public/awbNumber_select";
import shipperLetter from "./shipperLetter/af_order_shipper_letter";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    frow: Object,
  },
  data() {
    var checkNumber1 = (rule, value, callback) => {
      let regE = /^[1-9]\d{0,7}$/;
      if (!regE.test(value)) {
        callback(new Error("请输入1-8位大于0的整数"));
      } else {
        callback();
      }
    };

    const validateAirport = (rule, value, callback) => {
      if ((value || "").length == 0) {
        return callback();
      }
      let params = {
        apCode: value,
      };
      this.$axios.post2("/afbase/airport/checkCode", params).then(
        function (response) {
          if (response.data.data.length == 0) {
            callback(new Error(rule.message || "数据信息不存在，请确认"));
          } else {
            callback();
          }
        }.bind(this)
      );
    };

    const validateGoodsSourceCode = (rule, value, callback) => {
      if ((value || "").length == 0) {
        return callback();
      }
      let params = {
        cityCode: value,
      };
      this.$axios
        .get2("/afbase/airport/getAirport", params)
        .then(function (response) {
          if (
            !response.data.data ||
            "{}" == JSON.stringify(response.data.data)
          ) {
            callback(new Error(rule.message || "数据信息不存在，请确认"));
          } else {
            callback();
          }
        });
    };
    return {
      customsCodeFlag: false,
      ifFromInquiry: false,
      loading: false,
      helpDocumentUrl: "",
      data1: [],
      options2: [],
      contactsOptions: [],
      useroptions: [],
      productOptions: [],
      transitClauseOptions: [],
      goodsTypeOptions: [],
      goodsTypeOptions1: [],
      goodsTypeOptions2: [
        {
          value: "YJ-南京E邮宝",
          label: "YJ-南京E邮宝",
        },
        {
          value: "YJ-南京邮件小包",
          label: "YJ-南京邮件小包",
        },
        {
          value: "YJ-苏州邮件小包",
          label: "YJ-苏州邮件小包",
        },
        {
          value: "服装类",
          label: "服装类",
        },
        {
          value: "机械配件",
          label: "机械配件",
        },
        {
          value: "电子产品",
          label: "电子产品",
        },
        {
          value: "食品",
          label: "食品",
        },
        {
          value: "动植物类",
          label: "动植物类",
        },
        {
          value: "化工产品",
          label: "化工产品",
        },
        {
          value: "生物制剂",
          label: "生物制剂",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      tranFlagOptions: [
        {
          value: "0",
          label: "本关",
        },
        {
          value: "1",
          label: "转关",
        },
        {
          value: "2",
          label: "大通关",
        },
      ],
      spshTypeOptions: [
        { value: "ASH", label: "骨灰" },
        { value: "AVH", label: "活体动物200KG以上" },
        { value: "AVI", label: "活体动物200KG以下" },
        { value: "BIG", label: "超大货物" },
        { value: "COL", label: "冷藏货物" },
        { value: "DGR", label: "危险品" },
        { value: "EAT", label: "食品" },
        { value: "ELI", label: "非限制性锂离子电池" },
        { value: "ELM", label: "非限制性锂金属电池" },
        { value: "FRZ", label: "冷冻货物" },
        { value: "GUN", label: "枪支" },
        { value: "HEA", label: "超重货物" },
        { value: "HUI", label: "尸体、棺材（200KG以下含200KG）" },
        { value: "HUM", label: "尸体、棺材" },
        { value: "HWH", label: "恒温" },
        { value: "LOX", label: "小龙虾" },
        { value: "NOR", label: "普通货物" },
        { value: "PEF", label: "鲜花植物" },
        { value: "PEM", label: "肉类" },
        { value: "DEP", label: "水果和蔬菜" },
        { value: "DER", label: "鲜活腐蚀货物" },
        { value: "PES", label: "水产品" },
        { value: "PIL", label: "药品" },
        { value: "PPH", label: "温度要求15-25度" },
        { value: "PPL", label: "温度要求5-11度" },
        { value: "PPM", label: "温度要求12-18度" },
        { value: "RCM", label: "易腐蚀" },
        { value: "SWY", label: "鲜活三文鱼" },
        { value: "VAL", label: "贵重物品" },
        { value: "XLI", label: "国航锂离子电池" },
        { value: "XLM", label: "国航锂金属电池" },
        { value: "YKT", label: "广州盈润货物快递" },
      ],
      customsDeclarationOptions: [
        {
          value: "1",
          label: "提前报关",
        },
        {
          value: "2",
          label: "ATA",
        },
        {
          value: "3",
          label: "外交信贷",
        },
        {
          value: "4",
          label: "BC",
        },
        {
          value: "5",
          label: "快件",
        },
        {
          value: "N",
          label: "非提前报关",
        },
      ],
      transPortModeOptions: [
        { value: "3", label: "公路" },
        { value: "4", label: "空运" },
      ],

      businessTypeOptions: [],
      appraisalCompanyOptions: [],
      batteryTypeOptions: [],
      specialPackageOptions: [],
        celsiusRequireOptions: [],
        palletMaterialOptions: [],
      cargoTypeOptions:[],
      departureWarehouseOptions: [],
      departureStorehouseOptions: [],
      packageTypeOptions: [],
      packageTypeOptions1: [],
      packageTypeOptions2: [],
      buildUpCompanyOptions: [],
      buildUpCompanyOptions1: [],
      packSizeOptions:[],

      outfieldDeliveryHandlingCompanyOptions: [],
      outfieldDeliveryHandlingCompanyOptions1: [],
      wareNameOptions:[],
      wareNameOptions1:[],
      paymentMethodOptions: [],
      currencyCodeOptions: [],
      msrCurrecnyCodeOptions: [],
      codeOptions: [],
      showFlag1: false,
      showFlag2: false,
      showFlag4: false,
      showFlag3: false,
      save: false,
      save2: false,
      saveawb: false,
      shipperConsignee2: false,
      awbNumberVisible: false,
      shipperLetterVisible: false,
      disabledFlag: false,
      priceValueFlag: false,
      hawbQuantityIfExpand: false,
      ifFullscreen: false,
      style: {},
      activeOperationName: "first",
      ffrow: {
        awbFromType: "",
      },
      orderAeDigitsWeight: 1,
      orderAeDigitsVolume: 3,
      orderAeDigitsChargeWeight: 2,
      ruleForm: {
        pickUpDeliveryService: false,
        pickUpDeliveryCompany: "",
        pickUpAddress: "",
        pickUpDeliveryDate: "",
        pickUpDeliveryAddress: "",
        pickUpDeliveryRemark: "",
        pickUpTruckNumber: "",
        pickUpDriver: "",
        pickUpDriverTel: "",

        warehouseService: false,
        warehouseOperator: "",
        inboundDate: "",
        outboundDate: "",
        damageRemark: "",
        operationRemark: "",

        outfieldService: false,
        outfieldDeliveryCompany: "",
        outfieldTruckNumber: "",
        outfieldDriver: "",
        receiptDate: "",
        buildUpCompany: "",
        outfieldRemark: "",

        outfieldDeliveryDrieverLicense: "",
        outfieldDeliveryDriverTel: "",
        outfieldDeliveryArriveTime: "",
        outfieldDeliveryHandlingCompany: "",
        wareName:"",
        transitCode: "",

        customsClearanceService: false,
        customsClearanceCompany: "",
        customsInspectionDate: "",
        customsClearanceDate: "",
        customsInspectionRemark: "",
        customsDeclaresRemark: "",

        arrivalCustomsClearanceService: false,
        arrivalCustomsClearanceCompany: "",
        arrivalCustomsInspectionDate: "",
        arrivalCustomsClearanceDate: "",
        arrivalCustomsInspectionRemark: "",
        arrivalCustomsDeclaresRemark: "",

        deliveryService: false,
        deliveryCompany: "",
        deliveryDriver: "",
        deliverySigner: "",
        deliveryAddress: "",
        deliveryDate: "",
        deliverySignDate: "",
        deliveryRemark: "",
        businessType: "ANR",
        tranFlag: "0",
        transPortMode: "4",
        orderCode: "",
        projectId: "",
        projectName: "",
        salesName: "",
        servicerName: "",
        coopId: "",
        coopName: "",
        servicerId: "",
        salesId: "",
        awbNumber: "",
        orderContacts: [],
        customerNumber: "",
        isConsol: false,
        isNoSolidWood: false,
        isCelsiusRequire: false,
        isCelsiusRequire: false,
        hawbFlag: "直单",
        hawbQuantity: 0,
        departureStation: "",
        transitStation: "",
        transitStation2: "",
        arrivalStation: "",
        expectFlight: "",
        expectDeparture: "",
        expectArrival: "",
        businessProduct: "",

        goodsType: "",
        goodsNameCn: "",
        goodsNameEn: "",
        cargoType:"",
        batteryType: "",
        departureWarehouseId: "",
        departureStorehouseId: "",
        planPieces: "0",
        packageType: "",
        planWeight: "0",
        planChargeWeight: "0",
        planVolume: "0",
        planDimensions: "",
        planDensity: "",
        currecnyCode: "CNY",
        msrCurrecnyCode: "CNY",
        priceType: "单价",
        priceValue: "",
        freightUnitprice: "",
        freightAmount: "",
        shipperLetters: [],
        priceType2: "单价",
        priceValue2: "",
        msrUnitprice: "",
        msrAmount: "",
        appraisalNote: "",
        airborneDocument: "",
        shippingMarks: "",
        handlingInfo: "",
        customsStatusCode: "",
        orderRemark: "",
        freightProfitRatioRemark: "",
        msrProfitRatioRemark: "",
        priceRemark: "",
        notifierRemark: "",
        arrivalAgent: "",
        appraisalCompany: "",
        dangerousType: "",
        specialPackage: '',
        palletMaterial: '',
        celsiusRequire: '',
        thermometer: '',
        paymentMethod: "PP",
        paymentMethodOther: "PP",
        undgCode: "",
        undgContactName: "",
        undgContactCommunicationType: "TE",
        undgContactCommunicationNo: "",
        loadingDate: "",
        specialHandleCodeM3: "",
        partialShipment: false,
        afOrderShipperConsignee1: {
          scType: 1,
          scName: "",
          scPrintRemark: "",
        },
        afOrderShipperConsignee2: {
          scType: 0,
          scName: "",
          scPrintRemark: "",
        },
        orderInquiryId: "",
        orderInquiryQuotationId: "",
        orderInquiryRowUuid: "",
        goodsSourceCode: "",
      },
      rules: {
        departureStation: [
          {
            required: true,
            message: "请输入始发港",
            trigger: ["blur", "change"],
          },
          {
            min: 3,
            message: "最小长度为 3",
            trigger: ["blur", "change"],
          },
        ],
        arrivalStation: [
          {
            required: true,
            message: "请输入目的港",
            trigger: ["blur", "change"],
          },
          {
            min: 3,
            message: "最小长度为 3",
            trigger: ["blur", "change"],
          },
        ],
        expectDeparture: [
          {
            required: true,
            message: "请选择航班日期",
            trigger: ["blur", "change"],
          },
        ],
        planPieces: [
          {
            required: true,
            message: "请输入预报件数",
            trigger: ["blur", "change"],
          },
        ],
        planWeight: [
          {
            required: true,
            message: "请输入预报毛重",
            trigger: ["blur", "change"],
          },
        ],
        planVolume: [
          {
            required: true,
            message: "请输入预报体积",
            trigger: ["blur", "change"],
          },
        ],
        orderRemark: [
          {
            min: 0,
            max: 500,
            message: "订单备注长度为 500",
            trigger: ["blur", "change"],
          },
        ],
        expectFlight: [
          {
            min: 2,
            max: 8,
            message: "航班号长度为2~8位",
            trigger: ["blur", "change"],
          },
        ],
        transitStation: [
          {
            message: "中转港1不存在，请确认",
            validator: validateAirport,
            trigger: "blur",
          },
        ],
        transitStation2: [
          {
            message: "中转港2不存在，请确认",
            validator: validateAirport,
            trigger: "blur",
          },
        ],
        goodsSourceCode: [
          {
            message: "货源地不存在，请确认",
            validator: validateGoodsSourceCode,
            trigger: "blur",
          },
        ],
        customsCode: [
          {
            required: true,
            message: "请输入离境海关代码",
            trigger: ["blur", "change"],
          },
        ],
        transPortMode: [
          {
            required: true,
            message: "请选择运输方式",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  inject: ["findByPage", "continueOperation"],
  components: {
    save: save,
    save2: save2,
    saveawb: saveawb,
    shipperConsignee2: shipperConsignee2,
    awbNumber: AwbNumber,
    shipperLetter,
  },
  provide() {
    return {
      setValue: this.setValue,
      setCustomer: this.setCustomer,
      sizeEditCallBack: this.sizeEditCallBack,
      submitForm2: this.submitForm3,
      setShipperConsigneeValue2: this.setShipperConsigneeValue2,
      awbNumberSelectCallBack: this.awbNumberSelectCallBack,
    };
  },
  methods: {
    openSuccess() {
      this.$notify({
        title: "",
        message: "操作成功",
        type: "success",
        position: "bottom-right",
      });
    },
    openError(info) {
      this.$notify({
        title: "",
        message: "操作失败，" + info,
        type: "error",
        position: "bottom-right",
      });
    },
    awbFromTypeChange() {
      this.ruleForm.awbFromId = "";
      this.ruleForm.awbFromName = "";
    },
    selectCustomer() {
      this.ffrow.businessScope = "AE";
      this.save = true;
    },
    awbNumberSelect() {
      this.ffrow.awbNumber = this.ruleForm.awbNumber;
      this.ffrow.departureStation = this.ruleForm.departureStation;
      this.awbNumberVisible = true;
    },
    awbNumberSelectCallBack(val) {
      this.ruleForm.awbNumber = val.awbNumber;
      if (this.ruleForm.departureStation == "") {
        this.ruleForm.departureStation = val.departureStation;
      }
      //根据始发地更新货物类型的字典 根据始发地更换打板代理
      this.sychronizeWareAndStore();
      //更新分单信息里的主单号
      this.changeAwbNumber();
    },
    changeAwbNumber() {
      this.ruleForm.shipperLetters.forEach((shipperLetter) => {
        shipperLetter.awbNumber = this.ruleForm.awbNumber;
      });
    },
    gotoSizePage() {
      this.ffrow.planDimensions = this.ruleForm.planDimensions;
      this.ffrow.position = "空运出口订单";
      this.save2 = true;
    },
    queryContactsList(coopId) {
      let params = {
        coopId: coopId,
      };
      this.$axios.get2("/prm/coop/queryContactsIsValid", params).then(
        function (response) {
          this.contactsOptions = response.data.data;
          if (this.contactsOptions != null && this.contactsOptions.length > 0) {
            this.ruleForm.orderContacts.push(
              this.contactsOptions[0].contacts_id
            );
            // alert(this.ruleForm.orderContacts);
          }
        }.bind(this)
      );
    },
    setValue(rrow) {
      this.ruleForm.orderContacts = [];
      this.ruleForm.coopId = rrow.coopId;
      this.ruleForm.coopName = rrow.coopName;
      //更新联系人
      // alert(this.ruleForm.coopName);
      this.queryContactsList(rrow.coopId);
    },
    setCustomer(coop) {
      this.ruleForm.coopName = coop.coopName;
    },
    sizeEditCallBack(row) {
      this.ruleForm.planDimensions = row.value;
      this.ruleForm.planPieces = row.pieces;
      this.ruleForm.planVolume = row.volume / 1000000;
      this.setPlanChargeWeight();
      this.ruleForm.planVolume = (row.volume / 1000000).toFixed(
        this.orderAeDigitsVolume
      );
    },
    setPlanChargeWeight() {
      // debugger;
      //alert("预报计重")
      let planChargeWeight = (this.ruleForm.planVolume * 1000000) / 6000;
      if (this.ruleForm.planWeight > planChargeWeight) {
        if ((this.ruleForm.planWeight + "").split(".").length > 1) {
          this.ruleForm.planChargeWeight = parseFloat(
            this.ruleForm.planWeight + ""
          ).toFixed(this.orderAeDigitsChargeWeight);
        } else {
          this.ruleForm.planChargeWeight = parseInt(
            this.ruleForm.planWeight + ""
          ).toFixed(this.orderAeDigitsChargeWeight);
        }
      } else {
        this.ruleForm.planChargeWeight = planChargeWeight.toFixed(
          this.orderAeDigitsChargeWeight
        );
      }
      if (
        this.ruleForm.planVolume != null &&
        this.ruleForm.planVolume !== "" &&
        parseFloat(this.ruleForm.planVolume + "") != 0 &&
        this.ruleForm.planWeight != null &&
        this.ruleForm.planWeight !== ""
      ) {
        this.ruleForm.planDensity =
          parseFloat(this.ruleForm.planWeight + "") /
            parseFloat(this.ruleForm.planVolume + "") +
          "";
        this.ruleForm.planDensity = this.ruleForm.planDensity.split(".")[0];
      } else {
        this.ruleForm.planDensity = "";
      }
    },
    gotoShipperConsigneePage(scType) {
      this.ffrow.scType = scType;
      if (scType === 1) {
        this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee1;
      } else {
        this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee2;
      }

      this.shipperConsignee2 = true;
    },
    setShipperConsigneeValue2(rrow) {
      if (rrow.scType === 1) {
        this.ruleForm.afOrderShipperConsignee1.scType = 1;
        this.ruleForm.afOrderShipperConsignee1.scName = rrow.scName;
        this.ruleForm.afOrderShipperConsignee1.scMnemonic = rrow.scMnemonic;
        this.ruleForm.afOrderShipperConsignee1.scAddress = rrow.scAddress;
        this.ruleForm.afOrderShipperConsignee1.scCode = rrow.scCode;
        this.ruleForm.afOrderShipperConsignee1.scCodeType = rrow.scCodeType;
        this.ruleForm.afOrderShipperConsignee1.aeoCode = rrow.aeoCode;
        this.ruleForm.afOrderShipperConsignee1.nationCode = rrow.nationCode;
        this.ruleForm.afOrderShipperConsignee1.stateCode = rrow.stateCode;
        this.ruleForm.afOrderShipperConsignee1.cityCode = rrow.cityCode;
        this.ruleForm.afOrderShipperConsignee1.cityName = rrow.cityName;
        this.ruleForm.afOrderShipperConsignee1.postCode = rrow.postCode;
        this.ruleForm.afOrderShipperConsignee1.telNumber = rrow.telNumber;
        this.ruleForm.afOrderShipperConsignee1.faxNumber = rrow.faxNumber;
        this.ruleForm.afOrderShipperConsignee1.scPrintRemark =
          rrow.scPrintRemark;
      } else {
        this.ruleForm.afOrderShipperConsignee2.scType = 0;
        this.ruleForm.afOrderShipperConsignee2.scName = rrow.scName;
        this.ruleForm.afOrderShipperConsignee2.scMnemonic = rrow.scMnemonic;
        this.ruleForm.afOrderShipperConsignee2.scAddress = rrow.scAddress;
        this.ruleForm.afOrderShipperConsignee2.scCode = rrow.scCode;
        this.ruleForm.afOrderShipperConsignee2.scCodeType = rrow.scCodeType;
        this.ruleForm.afOrderShipperConsignee2.aeoCode = rrow.aeoCode;
        this.ruleForm.afOrderShipperConsignee2.nationCode = rrow.nationCode;
        this.ruleForm.afOrderShipperConsignee2.stateCode = rrow.stateCode;
        this.ruleForm.afOrderShipperConsignee2.cityCode = rrow.cityCode;
        this.ruleForm.afOrderShipperConsignee2.cityName = rrow.cityName;
        this.ruleForm.afOrderShipperConsignee2.postCode = rrow.postCode;
        this.ruleForm.afOrderShipperConsignee2.telNumber = rrow.telNumber;
        this.ruleForm.afOrderShipperConsignee2.faxNumber = rrow.faxNumber;
        this.ruleForm.afOrderShipperConsignee2.scPrintRemark =
          rrow.scPrintRemark;
      }
    },
    checkAwbNumber() {
      if (
        this.ruleForm.awbNumber.length != 0 &&
        this.ruleForm.awbNumber.length != 11 &&
        this.ruleForm.awbNumber.length != 12
      ) {
        this.openError("主单号为十一位或十二位");
        return;
      } else if (
        this.ruleForm.awbNumber.length != 0 &&
        this.ruleForm.awbNumber.length == 12
      ) {
        //11位（3+8）数字第四位为-
        let awbNumber1 = this.ruleForm.awbNumber.substring(0, 3);
        let awbNumber2 = this.ruleForm.awbNumber.substring(3, 4);
        let awbNumber3 = this.ruleForm.awbNumber.substring(4, 12);
        let regE = /^[0-9]\d{0,2}$/;
        if (!regE.test(awbNumber1)) {
          this.openError("主单号前三位为数字，请重新输入");
          return;
        }
        let regE1 = /^[0-9]\d{0,7}$/;
        if (!regE1.test(awbNumber3)) {
          this.openError("主单号后八位为数字，请重新输入");
          return;
        }
        if (awbNumber2 != "-") {
          this.openError("主单号第四位为-，请重新输入");
          return;
        }
      } else if (
        this.ruleForm.awbNumber.length != 0 &&
        this.ruleForm.awbNumber.length == 11
      ) {
        //11位（3+8）数字
        let awbNumber1 = this.ruleForm.awbNumber;
        let regE = /^[0-9]\d{0,10}$/;
        if (!regE.test(awbNumber1)) {
          this.openError("主单号为11位数字，请重新输入");
          return;
        }
        this.ruleForm.awbNumber =
          this.ruleForm.awbNumber.substring(0, 3) +
          "-" +
          this.ruleForm.awbNumber.substring(3, 11);
      }
      let awb7 = this.ruleForm.awbNumber.substring(4, 11) % 7;
      let awb1 = this.ruleForm.awbNumber.substring(11);
      if (awb7 != awb1) {
        this.openError("主单号不符合规则");
        return;
      }
    },
    submitForm(formName) {
      if (!this.ruleForm.customsCode && this.customsCodeFlag) {
        this.showFlag2 = true;
      }
      if (!this.ruleForm.transPortMode && this.customsCodeFlag) {
        this.showFlag2 = true;
      }
      if (!this.ruleForm.packageType) {
        this.openError("请选择包装");
        return;
      }
      if (this.ruleForm.departureStation.trim().toUpperCase() == "NKG") {
        if (!this.ruleForm.goodsType) {
          this.openError("请选择货物类型");
          return;
        }
      }
      let sumPieces = 0;
      let sumWeight = 0.0;
      let messageInfo = "";
      this.ruleForm.shipperLetters.forEach((row) => {
        if (row.planPieces) {
          sumPieces += parseInt(row.planPieces + "");
        }
        if (row.planWeight) {
          sumWeight += parseFloat(row.planWeight + "");
        }
      });
      if (sumPieces !== 0 && sumPieces != this.ruleForm.planPieces) {
        messageInfo =
          "分单 件数 之和 (" +
          sumPieces +
          "件) 与 主单件数之和（" +
          (this.ruleForm.planPieces === "" ? 0 : this.ruleForm.planPieces) +
          "件） 不一致，是否继续？";
      }
      if (sumWeight !== 0.0 && sumWeight != this.ruleForm.planWeight) {
        messageInfo =
          "分单 毛重 之和 (" +
          sumWeight +
          "KG) 与 主单毛重之和（" +
          (this.ruleForm.planWeight === "" ? 0 : this.ruleForm.planWeight) +
          "KG） 不一致，是否继续？";
      }
      if (messageInfo) {
        this.$confirm(messageInfo, "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
          center: true,
        })
          .then(() => {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                let codeFlag1 = 1;
                let codeFlag2 = 1;
                let params = {
                  apCode: this.ruleForm.arrivalStation,
                };
                this.loading = true;
                this.$axios
                  .post2("/afbase/airport/checkCode", params)
                  .then(
                    function (response) {
                      if (response.data.data.length > 0) {
                      } else {
                        codeFlag2 = 0;
                      }
                      if (this.ruleForm.departureStation) {
                        let params2 = {
                          apCode: this.ruleForm.departureStation,
                        };
                        this.$axios
                          .post2("/afbase/airport/checkCode", params2)
                          .then(
                            function (response) {
                              if (response.data.data.length > 0) {
                              } else {
                                codeFlag1 = 0;
                              }
                              this.doSubmit(codeFlag1, codeFlag2, formName);
                            }.bind(this)
                          )
                          .catch((error) => {
                            this.loading = false;
                          });
                      } else {
                        this.doSubmit(codeFlag1, codeFlag2, formName);
                      }
                    }.bind(this)
                  )
                  .catch((error) => {
                    this.loading = false;
                  });
              }
            });
          })
          .catch(() => {});
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let codeFlag1 = 1;
            let codeFlag2 = 1;
            let params = {
              apCode: this.ruleForm.arrivalStation,
            };
            this.loading = true;
            this.$axios
              .post2("/afbase/airport/checkCode", params)
              .then(
                function (response) {
                  if (response.data.data.length > 0) {
                  } else {
                    codeFlag2 = 0;
                  }
                  if (this.ruleForm.departureStation) {
                    let params2 = {
                      apCode: this.ruleForm.departureStation,
                    };
                    this.$axios
                      .post2("/afbase/airport/checkCode", params2)
                      .then(
                        function (response) {
                          if (response.data.data.length > 0) {
                          } else {
                            codeFlag1 = 0;
                          }
                          this.doSubmit(codeFlag1, codeFlag2, formName);
                        }.bind(this)
                      )
                      .catch((error) => {
                        this.loading = false;
                      });
                  } else {
                    this.doSubmit(codeFlag1, codeFlag2, formName);
                  }
                }.bind(this)
              )
              .catch((error) => {
                this.loading = false;
              });
          }
        });
      }
    },
    doSubmit(codeFlag1, codeFlag2, formName) {
      if (codeFlag1 == 1 && codeFlag2 == 1) {
        this.submitForm3(formName);
      } else {
        let info = "";
        if (codeFlag1 != 1) {
          info = info + "始发港";
        }
        if (codeFlag2 != 1) {
          info = info + "目的港";
        }

        this.openError(info + "不存在,请确认");
        this.loading = false;
      }
    },
    submitForm3(formName) {
      if (this.ruleForm.priceValue != null && this.ruleForm.priceValue !== "") {
        if (
          this.ruleForm.currecnyCode == null ||
          this.ruleForm.currecnyCode === ""
        ) {
          this.openError("卖价币种不能为空");
          this.loading = false;
          return;
        }
      }
      if (
        this.ruleForm.awbNumber.length != 0 &&
        this.ruleForm.awbNumber.length != 11 &&
        this.ruleForm.awbNumber.length != 12
      ) {
        this.openError("主单号为十一位或十二位");
        this.loading = false;
        return;
      } else if (
        this.ruleForm.awbNumber.length != 0 &&
        this.ruleForm.awbNumber.length == 12
      ) {
        //11位（3+8）数字第四位为-
        let awbNumber1 = this.ruleForm.awbNumber.substring(0, 3);
        let awbNumber2 = this.ruleForm.awbNumber.substring(3, 4);
        let awbNumber3 = this.ruleForm.awbNumber.substring(4, 12);
        let regE = /^[0-9]\d{0,2}$/;
        if (!regE.test(awbNumber1)) {
          this.openError("主单号前三位为数字，请重新输入");
          this.loading = false;
          return;
        }
        let regE1 = /^[0-9]\d{0,7}$/;
        if (!regE1.test(awbNumber3)) {
          this.openError("主单号后八位为数字，请重新输入");
          this.loading = false;
          return;
        }
        if (awbNumber2 != "-") {
          this.openError("主单号第四位为-，请重新输入");
          this.loading = false;
          return;
        }
      } else if (
        this.ruleForm.awbNumber.length != 0 &&
        this.ruleForm.awbNumber.length == 11
      ) {
        //11位（3+8）数字
        let awbNumber1 = this.ruleForm.awbNumber;
        let regE = /^[0-9]\d{0,10}$/;
        if (!regE.test(awbNumber1)) {
          this.openError("主单号为11位数字，请重新输入");
          this.loading = false;
          return;
        }
        this.ruleForm.awbNumber =
          this.ruleForm.awbNumber.substring(0, 3) +
          "-" +
          this.ruleForm.awbNumber.substring(3, 11);
      }
      let awb7 = this.ruleForm.awbNumber.substring(4, 11) % 7;
      let awb1 = this.ruleForm.awbNumber.substring(11);
      if (awb7 != awb1) {
        this.openError("主单号不符合规则");
        this.loading = false;
        return;
      }
      //预报毛重长度限制
      if (this.ruleForm.planWeight != null && this.ruleForm.planWeight != "") {
        this.ruleForm.planWeight = this.ruleForm.planWeight + "";
        let t = this.ruleForm.planWeight.split(".");
        if (t.length > 1) {
          if (t[0].length > 9) {
            this.openError("预报毛重超限");
            this.loading = false;
            return;
          }
        } else if (this.ruleForm.planWeight.length > 9) {
          this.openError("预报毛重超限");
          this.loading = false;
          return;
        }
      }
      //预报计重长度限制
      if (
        this.ruleForm.planChargeWeight != null &&
        this.ruleForm.planChargeWeight != ""
      ) {
        this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight + "";
        let t = this.ruleForm.planChargeWeight.split(".");
        if (t.length > 1) {
          if (t[0].length > 8) {
            this.openError("预报计重超限");
            this.loading = false;
            return;
          }
        } else if (this.ruleForm.planChargeWeight.length > 8) {
          this.openError("预报计重超限");
          this.loading = false;
          return;
        }
      }
      //预报体积长度限制
      if (this.ruleForm.planVolume != null && this.ruleForm.planVolume != "") {
        this.ruleForm.planVolume = this.ruleForm.planVolume + "";
        let t = this.ruleForm.planVolume.split(".");
        if (t.length > 1) {
          if (t[0].length > 7) {
            this.openError("预报计重超限");
            this.loading = false;
            return;
          }
        } else if (this.ruleForm.planVolume.length > 7) {
          this.openError("预报计重超限");
          this.loading = false;
          return;
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.priceType == "单价") {
            this.ruleForm.freightUnitprice = this.ruleForm.priceValue;
          } else {
            this.ruleForm.freightAmount = this.ruleForm.priceValue;
          }
          if (this.ruleForm.priceType2 == "单价") {
            this.ruleForm.msrUnitprice = this.ruleForm.priceValue2;
          } else {
            this.ruleForm.msrAmount = this.ruleForm.priceValue2;
          }

          this.$axios
            .post2("/afbase/afoporder/doSave", this.ruleForm)
            .then(
              function (response) {
                if (response.data.code == 0) {
                  this.openSuccess();
                  this.findByPage();
                  if (this.ifFromInquiry) {
                    this.continueOperation();
                  }
                  this.handleClose();
                } else {
                  if (response.data.messageInfo.indexOf("主单号不存在") > -1) {
                    this.ffrow.awbNumber = this.ruleForm.awbNumber;
                    this.ffrow.businessProduct = this.ruleForm.businessProduct;
                    this.ffrow.coopId = this.ruleForm.coopId;
                    this.ffrow.coopName = this.ruleForm.coopName;
                    let params = {
                      awb3: this.ruleForm.awbNumber.substring(0, 3),
                      awb8: this.ruleForm.awbNumber.substring(4),
                      awbcount: 1,
                      departureStation: "",
                      awbFromType: "",
                      awbFromId: "",
                      awbFromName: "",
                    };
                    this.$axios
                      .post2("/afbase/awb/checkAwbList", params)
                      .then(
                        function (response2) {
                          if (response2.data.code == 0) {
                            this.saveawb = true;
                          } else {
                            let errorinfo = response2.data.messageInfo;
                            if (errorinfo.indexOf("是否继续保存") > -1) {
                              this.saveawb = true;
                            } else {
                              this.openError(errorinfo);
                            }
                          }
                          this.loading = false;
                        }.bind(this)
                      )
                      .catch(
                        function (error2) {
                          let errorinfo = error2.response.data.messageInfo;
                          this.openError(errorinfo);
                          this.loading = false;
                        }.bind(this)
                      );
                  } else {
                    this.loading = false;
                    this.openError(response.data.messageInfo);
                  }
                }
              }.bind(this)
            )
            .catch(
              function (error) {
                let errorinfo = error.response.data.messageInfo;
                this.openError(errorinfo);
                this.loading = false;
                //唯一性错误
              }.bind(this)
            );
        } else {
          this.loading = false;
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.checkedCities = [];
      this.$refs[formName].resetFields();
    },
    // 关闭
    handleClose() {
      if (this.ifFullscreen) {
        setTimeout(() => {
          let userAgent = navigator.userAgent;
          if (
            userAgent.indexOf("Firefox") != -1 ||
            userAgent.indexOf("Chrome") != -1
          ) {
            window.open("", "_self").close();
          } else {
            window.opener = null;
            window.open("about:blank", "_self");
            window.close();
          }
        }, 2000);
      } else {
        this.$emit("update:visible", false);
      }
    },
    setHawbQuantity() {
      if (this.ruleForm.hawbFlag == 1) {
        this.ruleForm.hawbQuantity = 0;
      } else {
        this.ruleForm.hawbQuantity = 1;
      }
    },
    clickHawbQuantity() {
      this.hawbQuantityIfExpand = !this.hawbQuantityIfExpand;
    },
    setSalesName(vId) {
      let obj = {};
      obj = this.useroptions.find((item) => {
        return item.value === vId;
      });
      this.ruleForm.salesName = obj.label3;
      // alert(this.ruleForm.salesName);
    },
    setServicerName(vId) {
      let obj = {};
      obj = this.useroptions.find((item) => {
        return item.value === vId;
      });
      this.ruleForm.servicerName = obj.label3;
      // alert(this.ruleForm.servicerName);
    },

    formatToFloat(item) {
      if (item == "awbNumber") {
        this.ruleForm.awbNumber = this.ruleForm.awbNumber.replace(
          /[^0123456789.-]/g,
          ""
        );
        var t = this.ruleForm.awbNumber.split(".");
        if (t.length > 1) {
          this.ruleForm.awbNumber = t[0];
        }
      } else if (item == "planWeight") {
        if (this.orderAeDigitsWeight === 0) {
          this.ruleForm.planWeight = this.ruleForm.planWeight.replace(
            /[^0123456789]/g,
            ""
          );
        } else {
          this.ruleForm.planWeight = this.ruleForm.planWeight.replace(
            /[^0123456789.]/g,
            ""
          );
        }
        let t = this.ruleForm.planWeight.split(".");
        if (t.length > 1) {
          this.ruleForm.planWeight =
            t[0] + "." + t[1].substr(0, this.orderAeDigitsWeight);
        }
      } else if (item == "planVolume") {
        if (this.orderAeDigitsVolume === 0) {
          this.ruleForm.planVolume = this.ruleForm.planVolume.replace(
            /[^0123456789]/g,
            ""
          );
        } else {
          this.ruleForm.planVolume = this.ruleForm.planVolume.replace(
            /[^0123456789.]/g,
            ""
          );
        }
        let t = this.ruleForm.planVolume.split(".");
        if (t.length > 1) {
          this.ruleForm.planVolume =
            t[0] + "." + t[1].substr(0, this.orderAeDigitsVolume);
        }
      } else if (item == "priceValue") {
        this.ruleForm.priceValue = this.ruleForm.priceValue.replace(
          /[^0123456789.]/g,
          ""
        );
        let t = this.ruleForm.priceValue.split(".");
        if (t.length > 1) {
          this.ruleForm.priceValue = t[0] + "." + t[1].substr(0, 2);
        }
      } else if (item == "priceValue2") {
        this.ruleForm.priceValue2 = this.ruleForm.priceValue2.replace(
          /[^0123456789.]/g,
          ""
        );
        let t = this.ruleForm.priceValue2.split(".");
        if (t.length > 1) {
          this.ruleForm.priceValue2 = t[0] + "." + t[1].substr(0, 2);
        }
      } else if (item == "planPieces") {
        this.ruleForm.planPieces = this.ruleForm.planPieces.replace(
          /[^0123456789]/g,
          ""
        );
      }
    },
    formatDecimalPlaces(item) {

      if (item == "planWeight") {
        if (this.ruleForm.planWeight) {
          let t = this.ruleForm.planWeight.split(".");
          if (t.length > 1) {
            if (t[1].length < this.orderAeDigitsWeight) {
              this.ruleForm.planWeight =
                t[0] +
                "." +
                t[1] +
                "000".substr(0, this.orderAeDigitsWeight - t[1].length);
            }
          } else {
            if (this.orderAeDigitsWeight !== 0) {
              this.ruleForm.planWeight =
                t[0] + "." + "000".substr(0, this.orderAeDigitsWeight);
            }
          }
        }
      } else if (item == "planVolume") {
        if (this.ruleForm.planVolume) {
          let t = this.ruleForm.planVolume.split(".");
          if (t.length > 1) {
            if (t[1].length < this.orderAeDigitsVolume) {
              this.ruleForm.planVolume =
                t[0] +
                "." +
                t[1] +
                "000".substr(0, this.orderAeDigitsVolume - t[1].length);
            }
          } else {
            if (this.orderAeDigitsVolume !== 0) {
              this.ruleForm.planVolume =
                t[0] + "." + "000".substr(0, this.orderAeDigitsVolume);
            }
          }
        }
      }
    },
    checkInt(row, prop) {
      row[prop] = row[prop].replace(/[^0123456789]/g, "");
      if (row[prop].startsWith("0")) {
        row[prop] = "0";
      }
    },
    checkFloat(row, prop) {
      row[prop] = row[prop].replace(/[^0123456789.]/g, "");
      let t = row[prop].split(".");
      if (t.length > 1) {
        row[prop] = t[0] + "." + t[1].substr(0, 1);
      } else {
        if (row[prop].startsWith("0")) {
          row[prop] = "0";
        }
      }
    },
    setWarehouseName(val) {
      let obj = {};
      obj = this.departureWarehouseOptions.find((item) => {
        return item.value === val;
      });
      this.ruleForm.departureWarehouseName = obj.label;
    },
    setStorehouseName(val) {
      let obj = {};
      obj = this.departureStorehouseOptions.find((item) => {
        return item.value === val;
      });
      this.ruleForm.departureStorehouseName = obj.label;
    },
    checkFlag() {
      var params = { apCode: "", cityCode: "" };
      if (this.ruleForm.transitStation) {
        params = {
          apCode: this.ruleForm.departureStation,
          cityCode: this.ruleForm.transitStation,
        };
      } else {
        params = {
          apCode: this.ruleForm.departureStation,
          cityCode: this.ruleForm.arrivalStation,
        };
      }
      this.$axios.post2("/afbase/airport/checkFlag", params).then(
        function (response) {
          this.customsCodeFlag = response.data.data;
        }.bind(this)
      );
      this.$refs["ruleForm"].clearValidate();
    },
    setPackageTypeOptions(departureStation) {
      if (this.ruleForm.departureStation) {
        this.$axios
          .get("/afbase/awb/selectCategoryPro/包装类型/"+departureStation)
          .then(
            function (response) {
              this.packageTypeOptions2 = response.data.data;

              if (this.packageTypeOptions2.length > 0) {
                this.packageTypeOptions = this.packageTypeOptions2;
              } else {
                this.packageTypeOptions = this.packageTypeOptions1;
              }
              this.ruleForm.packageType = this.packageTypeOptions[0].value;
            }.bind(this)
          );
      } else {
        this.ruleForm.packageType = "";
        this.packageTypeOptions = [];
      }
    },
    setBuildUpCompanyOptions(departureStation) {
      if (this.ruleForm.departureStation) {
        this.$axios
          .get("/afbase/awb/selectCategoryPro/打板代理/"+departureStation)
          .then(
            function (response) {
              this.buildUpCompanyOptions1 = response.data.data;
              if (this.buildUpCompanyOptions1.length > 0) {
                this.buildUpCompanyOptions = this.buildUpCompanyOptions1;
                //alert(this.buildUpCompanyOptions[0].code);
              } else {
                this.buildUpCompanyOptions = [];
              }
            }.bind(this)
          );
      }
    },
    setgoodsTypeOptions(departureStation) {

      if (this.ruleForm.departureStation.trim().toUpperCase()=='CAN') {
        this.$axios
          .get("/afbase/awb/selectCategoryPro/货物类型/"+departureStation)
          .then(
            function (response) {
              this.goodsTypeOptions1 = response.data.data;
              if (this.goodsTypeOptions1.length > 0) {
                this.goodsTypeOptions = this.goodsTypeOptions1;
              }
            }.bind(this)
          );
      }
    },
    setOutfieldDeliveryHandlingCompanyOptions(departureStation) {
      if (this.ruleForm.departureStation) {
        this.$axios
          .get("/afbase/awb/selectCategoryPro/搬运公司/"+departureStation)
          .then(
            function (response) {
              this.outfieldDeliveryHandlingCompanyOptions1 = response.data.data;
              //debugger;
              if (this.outfieldDeliveryHandlingCompanyOptions1.length > 0) {
                this.outfieldDeliveryHandlingCompanyOptions = this.outfieldDeliveryHandlingCompanyOptions1;
              } else {
                this.outfieldDeliveryHandlingCompanyOptions = [];
              }
            }.bind(this)
          );
      }
    },
    setwareHouseCpmpanyOptions(departureStation) {

      if (this.ruleForm.departureStation) {
        this.$axios
          .get("/afbase/awb/selectCategoryPro/入仓公司/"+departureStation)
          .then(
            function (response) {
              this.wareNameOptions1 = response.data.data;
              //debugger;
              if (this.wareNameOptions1.length > 0) {
                this.wareNameOptions = this.wareNameOptions1;
              } else {
                this.wareNameOptions = [];
              }
            }.bind(this)
          );
      }
    },

    sychronizeWareAndStore() {
      // debugger;
      // alert("始发港");

      this.setPackageTypeOptions(this.ruleForm.departureStation);
      this.setBuildUpCompanyOptions(this.ruleForm.departureStation);
      this.setOutfieldDeliveryHandlingCompanyOptions(this.ruleForm.departureStation);

      this.setgoodsTypeOptions(this.ruleForm.departureStation);
      this.setwareHouseCpmpanyOptions(this.ruleForm.departureStation);
      if (this.ruleForm.departureStation) {

        this.ruleForm.goodsType = "";
        this.ruleForm.buildUpCompany = "";
        this.ruleForm.outfieldDeliveryHandlingCompany = "";
        this.ruleForm.wareName="";
        if (this.ruleForm.departureStation.trim().toUpperCase() == "NKG") {
          this.goodsTypeOptions = this.goodsTypeOptions2;
        }else if(this.ruleForm.departureStation.trim().toUpperCase() == "CAN"){
            this.goodsTypeOptions=this.goodsTypeOptions1;
        }else {
          this.$axios.get("/afbase/awb/selectCategory?category=货物类型").then(
              function (response) {
                this.goodsTypeOptions = response.data.data;
            }.bind(this)
          );
        }
      } else {
        this.ruleForm.goodsType = "";
        this.goodsTypeOptions = [];
      }
      if (
        this.ruleForm.departureStation != null &&
        this.ruleForm.departureStation !== ""
      ) {
        this.ruleForm.departureStation = this.ruleForm.departureStation
          .trim()
          .toUpperCase();
        this.$axios
          .get(
            "/afbase/warehouse/getByDeparture?type=货站&departureStation=" +
              this.ruleForm.departureStation
          )
          .then(
            function (response) {
              this.ruleForm.departureWarehouseId = "";
              this.departureWarehouseOptions = response.data.data;
            }.bind(this)
          );
      }
      // this.checkFlag();
    },
    addHawb() {
      this.ruleForm.shipperLetters.push({
        hawbChecked: false,
        awbNumber: this.ruleForm.awbNumber || this.ruleForm.orderCode,
        hawbNumber: "",
        departureStation: this.ruleForm.departureStation,
        transitStation: this.ruleForm.transitStation,
        arrivalStation: this.ruleForm.arrivalStation,
        expectFlight: this.ruleForm.expectFlight,
        expectDeparture: this.ruleForm.expectDeparture,
        loadingDate: "",
        planPieces: "",
        planWeight: "",
        planVolume: "",
        customsStatusCode: this.ruleForm.customsStatusCode,
        planDimensions: "",
        partialShipment: false,
        paymentMethod: "PP",
        undgCode: "",
        undgContactName: "",
        undgContactCommunicationType: "TE",
        undgContactCommunicationNo: "",
        afOrderShipperConsignee1: {
          scType: 1,
          scName: "",
          scPrintRemark: "",
        },
        afOrderShipperConsignee2: {
          scType: 0,
          scName: "",
          scPrintRemark: "",
        },
        goodsNameCn: "",
        goodsNameEn: "",
        shippingMarks: "",
        handlingInfo: "",
      });
      this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length;
      if (this.ruleForm.hawbQuantity + "" == "0") {
        this.ruleForm.hawbFlag = "直单";
      } else {
        this.ruleForm.hawbFlag = "分单";
      }
    },
    deleteHawb(index, row) {
      this.ruleForm.shipperLetters.splice(index, 1);
      this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length;
      if (this.ruleForm.hawbQuantity + "" == "0") {
        this.ruleForm.hawbFlag = "直单";
      } else {
        this.ruleForm.hawbFlag = "分单";
      }
    },
    changeActiveOperationName(val) {
      if (val == "TH") {
        if (!this.ruleForm.pickUpDeliveryService) {
          this.$confirm("本票业务不再为客户提供提货服务", "提示", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          })
            .then(() => {
              //清空
              this.ruleForm.pickUpDeliveryCompany = "";
              this.ruleForm.pickUpAddress = "";
              this.ruleForm.pickUpDeliveryDate = "";
              this.ruleForm.pickUpDeliveryAddress = "";
              this.ruleForm.pickUpDeliveryRemark = "";
              this.ruleForm.pickUpTruckNumber = "";
              this.ruleForm.pickUpDriver = "";
              this.ruleForm.pickUpDriverTel = "";
            })
            .catch(() => {
              this.ruleForm.pickUpDeliveryService = true;
            });
        }
        this.activeOperationName = "first";
      } else if (val == "KN") {
        if (!this.ruleForm.warehouseService) {
          this.$confirm("本票业务不再为客户提供库内操作", "提示", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          })
            .then(() => {
              //清空
              this.ruleForm.departureStorehouseId = "";
              this.ruleForm.warehouseOperator = "";
              this.ruleForm.inboundDate = "";
              this.ruleForm.outboundDate = "";
              this.ruleForm.damageRemark = "";
              this.ruleForm.operationRemark = "";
            })
            .catch(() => {
              this.ruleForm.warehouseService = true;
            });
        }
        this.activeOperationName = "second";
      } else if (val == "WC") {
        if (!this.ruleForm.outfieldService) {
          this.$confirm("本票业务不再为客户提供外场操作", "提示", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          })
            .then(() => {
              //清空
              this.ruleForm.departureWarehouseId = "";
              this.ruleForm.outfieldDeliveryCompany = "";
              this.ruleForm.outfieldTruckNumber = "";
              this.ruleForm.outfieldDriver = "";
              this.ruleForm.receiptDate = "";
              this.ruleForm.buildUpCompany = "";
              this.ruleForm.outfieldRemark = "";

              this.ruleForm.outfieldDeliveryDrieverLicense = "";
              this.ruleForm.outfieldDeliveryDriverTel = "";
              this.ruleForm.outfieldDeliveryArriveTime = "";
              this.ruleForm.outfieldDeliveryHandlingCompany = "";
              this.ruleForm.transitCode = "";
            })
            .catch(() => {
              this.ruleForm.outfieldService = true;
            });
        }
        this.activeOperationName = "third";
      } else if (val == "BG") {
        if (!this.ruleForm.customsClearanceService) {
          this.$confirm("本票业务不再为客户提供报关服务", "提示", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          })
            .then(() => {
              //清空
              this.ruleForm.customsClearanceCompany = "";
              this.ruleForm.customsInspectionDate = "";
              this.ruleForm.customsClearanceDate = "";
              this.ruleForm.customsInspectionRemark = "";
              this.ruleForm.customsDeclaresRemark = "";
            })
            .catch(() => {
              ruleForm.customsClearanceService = true;
            });
        }
        this.activeOperationName = "fourth";
      } else if (val == "QG") {
        if (!this.ruleForm.arrivalCustomsClearanceService) {
          this.$confirm("本票业务不再为客户提供目的港清关", "提示", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          }).then(() => {
              //清空
              this.ruleForm.arrivalCustomsClearanceCompany = "";
              this.ruleForm.arrivalCustomsInspectionDate = "";
              this.ruleForm.arrivalCustomsClearanceDate = "";
              this.ruleForm.arrivalCustomsInspectionRemark = "";
              this.ruleForm.arrivalCustomsDeclaresRemark = "";
            }).catch(() => {
              this.ruleForm.arrivalCustomsClearanceService = true;
            });
        }
        this.activeOperationName = "fifth";
      } else if (val == "PS") {
        if (!this.ruleForm.deliveryService) {
          this.$confirm("本票业务不再为客户提供目的港派送", "提示", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          })
            .then(() => {
              //清空
              this.ruleForm.deliveryCompany = "";
              this.ruleForm.deliveryDriver = "";
              this.ruleForm.deliverySigner = "";
              this.ruleForm.deliveryAddress = "";
              this.ruleForm.deliveryDate = "";
              this.ruleForm.deliverySignDate = "";
              this.ruleForm.deliveryRemark = "";
            })
            .catch(() => {
              this.ruleForm.deliveryService = true;
            });
        }
        this.activeOperationName = "sixth";
      }
    },
    shipperLetterEdit(index) {
      if (index || index === 0) {
        this.ffrow.mawbChecked = false;
        this.ffrow.index = index;
      } else {
        this.ffrow.mawbChecked = true;
        this.ffrow.index = -1;
      }
      this.ffrow.shipperLetter = {
        awbNumber: this.ruleForm.awbNumber || this.ruleForm.orderCode,
        hawbNumber: "",
        departureStation: this.ruleForm.departureStation,
        transitStation: this.ruleForm.transitStation,
        arrivalStation: this.ruleForm.arrivalStation,
        expectFlight: this.ruleForm.expectFlight,
        expectDeparture: this.ruleForm.expectDeparture,
        loadingDate: this.ruleForm.loadingDate,
        planPieces: this.ruleForm.planPieces,
        planWeight: this.ruleForm.planWeight,
        planVolume: this.ruleForm.planVolume,
        customsStatusCode: this.ruleForm.customsStatusCode,
        planDimensions: this.ruleForm.planDimensions,
        partialShipment: this.ruleForm.partialShipment,
        paymentMethod: this.ruleForm.paymentMethod,
        undgCode: this.ruleForm.undgCode,
        undgContactName: this.ruleForm.undgContactName,
        undgContactCommunicationType: this.ruleForm
          .undgContactCommunicationType,
        undgContactCommunicationNo: this.ruleForm.undgContactCommunicationNo,
        afOrderShipperConsignee1: this.ruleForm.afOrderShipperConsignee1,
        afOrderShipperConsignee2: this.ruleForm.afOrderShipperConsignee2,
        goodsNameCn: this.ruleForm.goodsNameCn,
        goodsNameEn: this.ruleForm.goodsNameEn,
        shippingMarks: this.ruleForm.shippingMarks,
        handlingInfo: this.ruleForm.handlingInfo,
      };

      this.ffrow.hawbList = JSON.parse(
        JSON.stringify(this.ruleForm.shipperLetters)
      );
      this.shipperLetterVisible = true;
    },
    shipperLetterCallback({ orderInfo, hawbList }) {
      this.ruleForm.departureStation = orderInfo.departureStation;
      this.ruleForm.transitStation = orderInfo.transitStation;
      this.ruleForm.arrivalStation = orderInfo.arrivalStation;
      this.ruleForm.expectFlight = orderInfo.expectFlight;
      this.ruleForm.expectDeparture = orderInfo.expectDeparture;
      this.ruleForm.planPieces = orderInfo.planPieces;
      this.ruleForm.planWeight = orderInfo.planWeight;
      this.ruleForm.planVolume = orderInfo.planVolume;
      this.ruleForm.customsStatusCode = orderInfo.customsStatusCode;
      this.ruleForm.planDimensions = orderInfo.planDimensions;
      this.ruleForm.paymentMethod = orderInfo.paymentMethod;
      this.ruleForm.undgCode = orderInfo.undgCode;
      this.ruleForm.undgContactName = orderInfo.undgContactName;
      this.ruleForm.undgContactCommunicationType =
        orderInfo.undgContactCommunicationType;
      this.ruleForm.undgContactCommunicationNo =
        orderInfo.undgContactCommunicationNo;
      this.ruleForm.afOrderShipperConsignee1 =
        orderInfo.afOrderShipperConsignee1;
      this.ruleForm.afOrderShipperConsignee2 =
        orderInfo.afOrderShipperConsignee2;
      this.ruleForm.goodsNameCn = orderInfo.goodsNameCn;
      this.ruleForm.goodsNameEn = orderInfo.goodsNameEn;
      this.ruleForm.shippingMarks = orderInfo.shippingMarks;
      this.ruleForm.handlingInfo = orderInfo.handlingInfo;
      this.ruleForm.loadingDate = orderInfo.loadingDate;
      this.ruleForm.partialShipment = orderInfo.partialShipment;

      this.ruleForm.shipperLetters = hawbList;
      this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length;
      if (this.ruleForm.hawbQuantity + "" == "0") {
        this.ruleForm.hawbFlag = "直单";
      } else {
        this.ruleForm.hawbFlag = "分单";
      }
      this.setPlanChargeWeight();
      this.shipperLetterVisible = false;
    },
    changeIsConsol(val) {
      if (val) {
        this.ruleForm.goodsNameEn = "CONSOL AS PER ATTACHED MANIFEST";
      } else {
        this.ruleForm.goodsNameEn = this.ruleForm.goodsNameEn.replace(
          /CONSOL AS PER ATTACHED MANIFEST/g,
          ""
        );
      }
    },
    changeIsNoSolidWood(val) {
      if (val) {
        this.ruleForm.handlingInfo = "NO SOLID WOOD PACKING MATERIAL USED";
      } else {
        this.ruleForm.handlingInfo = this.ruleForm.handlingInfo.replace(
          /NO SOLID WOOD PACKING MATERIAL USED/g,
          ""
        );
      }
    },
    changeIsCelsiusRequire(val) {
        if (val) {
            if(this.ruleForm.handlingInfo){
                if(this.ruleForm.celsiusRequire){
                    this.ruleForm.handlingInfo = this.ruleForm.handlingInfo + ' ' + this.ruleForm.celsiusRequire
                }
            }else{
                if(this.ruleForm.celsiusRequire){
                    this.ruleForm.handlingInfo = this.ruleForm.celsiusRequire
                }
            }
        } else {
            this.ruleForm.handlingInfo = this.ruleForm.handlingInfo.replace(this.ruleForm.celsiusRequire, '')
        }
      },
  },
  created() {

    if (this.frow.ifFromInquiry) {

      this.ifFromInquiry = true;
      this.ruleForm.expectFlight = this.frow.inquiry.flightNumber;
      this.ruleForm.departureStation = this.frow.inquiry.departureStation;
      this.ruleForm.transitStation = this.frow.inquiry.transitStation;
      this.ruleForm.arrivalStation = this.frow.inquiry.arrivalStation;
      this.ruleForm.expectDeparture = this.frow.inquiry.expectDeparture;

      this.ruleForm.goodsNameCn = this.frow.inquiry.goodsNameCn;
      this.ruleForm.batteryType = this.frow.inquiry.batteryType;
      this.ruleForm.planPieces = this.frow.inquiry.planPieces;
      this.ruleForm.planWeight = this.frow.inquiry.planWeight;
      this.ruleForm.planVolume = this.frow.inquiry.planVolume;
      this.ruleForm.planDimensions = this.frow.inquiry.planDimensions;
      this.ruleForm.priceValue2 = this.frow.inquiry.price;
      this.ruleForm.priceType2 = this.frow.inquiry.priceType;
      this.ruleForm.orderInquiryQuotationId = this.frow.inquiry.orderInquiryQuotationId;
      this.ruleForm.orderInquiryId = this.frow.inquiry.orderInquiryId;
      this.ruleForm.orderInquiryRowUuid = this.frow.inquiry.rowUuid;
      this.ruleForm.priceRemark = this.frow.inquiry.remark;
      this.sychronizeWareAndStore();
      this.setPlanChargeWeight();
    }
    this.ifFullscreen = this.frow.ifFullscreen;
    if (this.ifFullscreen) {
      this.style.top = "0px";
    } else {
      this.style.top = "-80px";
    }
    this.$axios.get("/hrs/permission/" + 159).then(
      function (response) {
        if (response.data.code == 0) {
          this.helpDocumentUrl = response.data.data.helpDocumentUrl;
        }
      }.bind(this)
    );
    // this.$axios.get('/afbase/aforder/selectCoop').then(function(response) {
    // 	if (response.data.code == 0 && response.data.data.records.length === 1) {
    // 		this.setValue(response.data.data.records[0]);
    // 	}
    // }.bind(this));
    //获取第一个客商资料未默认
    this.$axios
      .get("afbase/aforder/getCoopList", {
        businessScope: "AE",
        size: 10000,
        current: 1,
      })
      .then(
        function (response) {
          if (response.data.data.records.length > 0) {
            this.setValue(response.data.data.records[0]);
          } else {
            this.setValue(null);
          }
        }.bind(this)
      );
    this.$axios.get("/afbase/aforder/selectCompany").then(
      function (response) {
        this.appraisalCompanyOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/hrs/dept/selectUser").then(
      function (response) {
        this.useroptions = response.data.data;
        if (this.useroptions != null && this.useroptions.length > 0) {
          let userId = window.localStorage.getItem("userId");
          if (userId != null && userId !== "") {
            this.ruleForm.salesId = parseInt(userId);
            this.setSalesName(parseInt(userId));
            this.ruleForm.servicerId = parseInt(userId);
            this.setServicerName(parseInt(userId));
          }
        }
      }.bind(this)
    );
   this.$axios.get("/afbase/awb/selectCategory?category=出口产品").then(
      function (response) {
        this.productOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/afbase/awb/selectCategory?category=运输条款").then(
      function (response) {
        this.transitClauseOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/afbase/awb/selectCategory?category=电池情况").then(
      function (response) {
        this.batteryTypeOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get('/afbase/awb/selectCategory?category=特货包装').then(function(response) {
          this.specialPackageOptions = response.data.data;
      }.bind(this));
      this.$axios.get('/afbase/awb/selectCategory?category=温度要求').then(function(response) {
          this.celsiusRequireOptions = response.data.data;
      }.bind(this));
      this.$axios.get('/afbase/awb/selectCategory?category=托盘材质').then(function(response) {
          this.palletMaterialOptions = response.data.data;
      }.bind(this));
    this.$axios.get("/afbase/awb/selectCategory?category=包裹大小").then(
      function (response) {
        this.packSizeOptions = response.data.data;
      }.bind(this)
    );
     this.$axios.get("/afbase/awb/selectCategory?category=货物性质").then(
      function (response) {
        debugger;
        this.cargoTypeOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/afbase/awb/selectCategory?category=业务模式").then(
      function (response) {
        this.businessTypeOptions = response.data.data;
      }.bind(this)
    );

    this.$axios.get("/afbase/awb/selectCategory?category=包装类型").then(
      function (response) {
        this.packageTypeOptions1 = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/afbase/awb/selectCategory?category=付款方式").then(
      function (response) {
        this.paymentMethodOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/afbase/coopProject/selectCurrency").then(
      function (response) {
        this.currencyCodeOptions = response.data.data;
        this.msrCurrecnyCodeOptions = response.data.data;
        if (this.currencyCodeOptions && this.currencyCodeOptions[0]) {
          if ("CNY" != this.currencyCodeOptions[0].currency_code) {
            this.ruleForm.currencyCode = this.currencyCodeOptions[0].currency_code;
            this.ruleForm.msrCurrecnyCode = this.msrCurrecnyCodeOptions[0].currency_code;
          }
        }
      }.bind(this)
    );
    this.$axios.get("/afbase/awb/selectCategory?category=货物海关代码").then(
      function (response) {
        this.codeOptions = response.data.data;
      }.bind(this)
    );
    this.$axios.get("/afbase/warehouse/库房").then((response) => {
      this.departureStorehouseOptions = response.data.data;
    });
    //查询签约公司默认配置信息
    this.$axios
      .get("/hrs/org/getOrgOrderConfig/AE")
      .then((response) => {
        if (response.data.code == 0 && response.data.data) {
          // if (!this.frow.ifFromInquiry) {
          //   this.ruleForm.goodsType = response.data.data.goodsType;

          // }
          this.ruleForm.businessProduct = "代理制";
          // if (!this.ruleForm.businessProduct) {
          // 	this.ruleForm.businessProduct = '代理制'
          // }
          // alert(	this.ruleForm.businessProduct);
          if (!this.frow.ifFromInquiry) {
            this.ruleForm.batteryType = response.data.data.batteryType;
            if (!this.ruleForm.batteryType) {
              this.ruleForm.batteryType = "不含电池";
            }
          }
          this.ruleForm.customsStatusCode =
            response.data.data.customsStatusCode;
          if (!this.ruleForm.customsStatusCode) {
            this.ruleForm.customsStatusCode = "001";
          }
        } else {
          if (!this.frow.ifFromInquiry) {
            // this.ruleForm.goodsType = '普货'
          }
          this.ruleForm.businessProduct = "代理制";
          if (!this.ruleForm.batteryType) {
            this.ruleForm.batteryType = "不含电池";
          }
          this.ruleForm.customsStatusCode = "001";
        }
      })
      .catch((error) => {
        if (!this.frow.ifFromInquiry) {
          // this.ruleForm.goodsType = '普货'
        }
        this.ruleForm.businessProduct = "代理制";
        if (!this.ruleForm.batteryType) {
          this.ruleForm.batteryType = "不含电池";
        }
        this.ruleForm.customsStatusCode = "001";
      });

    //查询用户设置小数位
    this.$axios
      .get("/hrs/user/getUserAboutKeepDecimalPlaces")
      .then((response) => {
        if (response.data.code == 0) {
          if (response.data.data.orderAeDigitsWeight != null) {
            this.orderAeDigitsWeight = response.data.data.orderAeDigitsWeight;
          }
          if (response.data.data.orderAeDigitsVolume != null) {
            this.orderAeDigitsVolume = response.data.data.orderAeDigitsVolume;
          }
          if (response.data.data.orderAeDigitsChargeWeight != null) {
            this.orderAeDigitsChargeWeight =
              response.data.data.orderAeDigitsChargeWeight;
          }
        } else {
          this.openError(response.data.messageInfo);
        }
      });
  },
};
</script>
<style>
.orderEditPage .el-divider--horizontal {
  height: 3px;
  margin: 10px 0;
  background-color: #eee;
}
.orderEditPage .el-input__icon {
  line-height: 30px !important;
}

.orderEditPage .el-form-item__error {
  margin-top: -5px;
  margin-left: 150px;
}

.afOrderLinkTwoInput .el-form-item__content {
  line-height: 30px !important;
}

.widthWithKG .el-input-group__append {
  padding: 0 10px;
}

.widthWithKG .el-input__inner {
  line-height: 29px !important;
}

.showWordLimit .el-input__inner {
  padding-right: 80px !important;
}

.showWordLimit .el-textarea__inner {
  padding-right: 50px;
}

.hawbQuantity .el-input-group__prepend {
  background-color: #409eff;
  color: #fff;
  border: 1px solid #409eff;
}

.arrivalStationForAESave .el-input-group__prepend {
  background-color: #fee1e3;
}

.expectDepartureForAESave .el-input-group__prepend {
  background-color: #fee1e3;
}
</style>
