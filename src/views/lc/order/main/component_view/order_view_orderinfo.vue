<template>
	<div v-loading="vLoad" class="lcOrderEditPage">
		<el-form disabled :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
							<template slot="prepend">陆运订单</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="coopName">
						<el-input class="widthWithFourWithXing" readOnly v-model="ruleForm.coopName" style="width:615px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>客户名称</span>
							</template>
							<el-button slot="append" @click="selectCustomer" icon="el-icon-search"></el-button>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item prop="salesId">
						<el-input class="widthWithFourWithXing" style="width:295px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>责任销售</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.salesId" clearable filterable placeholder="请选择" @change="setSalesName" style="width:198px;margin-right: -5px;">
								<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
									<span style="float: left">{{ item.label }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="customerNumber">
						<el-input class="widthWithFourWithXing" v-model="ruleForm.customerNumber" clearable maxlength="30" auto-complete="off" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>客户单号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.orderCodeAssociated" auto-complete="off" maxlength="50" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
								<span>关联单号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item>
            <el-input auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
              <template slot="prepend">
                <span>工作组</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.workgroupId" placeholder="请选择工作组" style="width:212px;margin-right: -5px;" clearable>
                <el-option v-for="item in workgroups" :key="item.workgroupId" :label="item.workgroupName" :value="item.workgroupId">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item prop="servicerId">
						<el-input class="widthWithFourWithXing" style="width:295px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>责任客服</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.servicerId" clearable filterable placeholder="请选择" @change="setServicerName" style="width:198px;margin-right: -5px;">
								<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
									<span style="float: left">{{ item.label }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<div style="padding:0px 0px 20px 0px">
				<HR color="#eee" size="5">
				</HR>
			</div>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="shippingMethod">
						<el-input auto-complete="off" class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>运输方式</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.shippingMethod" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
								<el-option v-for="(item,index) in shippingMethods" :key="index" :label="item.paramText" :value="item.paramText">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="departureStation">
						<el-input class="widthWithFourWithXing" auto-complete="off" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>始发城市</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.departureStation" @visible-change="blurDepartureStation" :filter-method="changeDepartureStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
								<el-option v-for="item,index in departureStations" :key="index" :label="item.cityNameCn" :value="item.cityCode">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="showWordLimit" v-model="ruleForm.departureAddress" auto-complete="off" style="width:615px;" show-word-limit maxlength="200" clearable>
							<template slot="prepend">
								<span>始发地址</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="drivingTime">
						<el-input class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>用车时间</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.drivingTime" clearable type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择用车日期" style="width: 198px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="arrivalStation">
						<el-input class="widthWithFourWithXing" clearable auto-complete="off" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>目的城市</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.arrivalStation" :filter-method="changeArrivalStation" @visible-change="blurArrivalStation" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
								<el-option v-for="item,index in arrivalStations" :key="index" :label="item.cityNameCn" :value="item.cityCode">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="showWordLimit" v-model="ruleForm.arrivalAddress" auto-complete="off" style="width:615px;" show-word-limit maxlength="200" clearable>
							<template slot="prepend">
								<span>目的地址</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input maxlength="6" @input="formatToFloat('planPieces')" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
								<span>预报件数</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input @input="formatToFloat('planWeight')" v-model="ruleForm.planWeight" @change="setPlanChargeWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
								<span>预报毛重</span>
							</template>
							<template slot="append">
								<span>KG</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input @input="formatToFloat('planVolume')" @change="setPlanChargeWeight" v-model="ruleForm.planVolume" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
								<span>预报体积</span>
							</template>
							<template slot="append">
								<span>CBM</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="planChargeWeight">
						<el-input class="widthWithFourWithXing" @input="formatToFloat('planChargeWeight')" v-model="ruleForm.planChargeWeight" auto-complete="off" style="width:295px;" clearable>
							<template slot="prepend">
								<font style="color: red;">*</font>
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
					<el-form-item>
						<el-input v-model="ruleForm.planDimensions" auto-complete="off" style="width:935px;margin-right: 15px;" readOnly>
							<template slot="prepend">
								<span>预报尺寸</span>
							</template>
							<el-button slot="append" @click="editSize" icon="el-icon-edit"></el-button>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input readOnly v-model="ruleForm.planDensity" auto-complete="off" style="width:295px;">
							<template slot="prepend">
								<span>预报密度</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.orderCodeVl" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<span>派车单号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithThree" v-model="ruleForm.driverNumber" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<span>车牌号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.driverName" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<span>司机姓名</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.driverTel" style="width:295px;">
							<template slot="prepend">
								<span>司机电话</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="showWordLimit" v-model="ruleForm.orderRemark" auto-complete="off" style="width:1253px;" show-word-limit maxlength="300" clearable>
							<template slot="prepend">
								<span>订单备注</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<div style="padding:0px 0px 10px 0px">
				<HR color="#eee" size="5">
				</HR>
			</div>
			<div style="padding:0px 0px 0px 30px">
				<span>价格信息</span>
				<a style="color: #409EFF;font-size: 12px;cursor: pointer;" v-if=showFlag v-on:click="showFlag=false">收起<i class="el-icon-arrow-down"></i></a>
				<a style="color: #409EFF;font-size: 12px;cursor: pointer;" v-if=!showFlag v-on:click="showFlag=true">展开<i class="el-icon-arrow-up"></i></a>
				<el-row v-show="showFlag" style="margin-top: 20px;">
					<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
						<el-form-item>
							<el-input auto-complete="off" style="width:200px;">
								<template slot="prepend">
									<span>运费卖价</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.freightCurrecnyCode" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
									<el-option v-for="item in currencyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</el-input>
							<el-input v-model="freightPriceAmount" auto-complete="off" @input="formatToFloat('freightPriceAmount')" maxlength="13" style="width:105px;margin-left: -5px;margin-right: 15px;" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" style="width:205px;margin-right: 15px;">
								<template slot="prepend">
									<span>卖价形式</span>
								</template>
								<el-select slot="suffix" v-model="freightPriceType" placeholder="请选择" style="width:108px;margin-right: -5px;">
									<el-option label="单价" value="单价"></el-option>
									<el-option label="总价" value="总价"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" style="margin-left: 50px;">
						<el-form-item prop="goodsType">
							<el-input class="widthWithFourWithXing" style="width:265px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>货物类型</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.goodsType" clearable placeholder="请选择货物类型" style="width:168px;margin-right: -5px;">
									<el-option v-for="item,index in goodsTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth afOrderLinkTwoInput" style="margin-left: 50px;">
						<el-form-item prop="msrCurrecnyCode">
							<el-input auto-complete="off" style="width:200px;">
								<template slot="prepend">
									<span>运费成本</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.msrCurrecnyCode" placeholder="请选择" style="width:103px;margin-right: -5px;" clearable>
									<el-option v-for="item in msrCurrecnyCodeOptions" :key="item.currency_code" :label="item.currency_code" :value="item.currency_code">
									</el-option>
								</el-select>
							</el-input>
							<el-input v-model="msrPriceAmount" auto-complete="off" @input="formatToFloat('msrPriceAmount')" maxlength="13" style="width:105px;margin-left: -5px;margin-right: 15px;" clearable>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" style="width:205px;margin-right: 15px;">
								<template slot="prepend">
									<span>成本形式</span>
								</template>
								<el-select slot="suffix" v-model="msrPriceType" placeholder="请选择" style="width:108px;margin-right: -5px;">
									<el-option label="单价" value="单价"></el-option>
									<el-option label="总价" value="总价"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" style="margin-left: 50px;">
						<el-form-item prop="batteryType">
							<el-input class="widthWithFourWithXing" style="width:266px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>电池情况</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.batteryType" clearable placeholder="请选择电池情况" style="width:169px;margin-right: -5px;">
									<el-option v-for="item,index in batteryTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth" style="margin-left: 50px;">
						<el-form-item>
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>价格备注</el-button>
							</el-row>
							<el-input class="showWordLimit" type="textarea" :rows="3" show-word-limit maxlength="500" v-model="ruleForm.priceRemark" auto-complete="off" style="width:535px">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth" style="margin-left: 15px;">
						<el-form-item>
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>货物品名</el-button>
							</el-row>
							<el-input class="showWordLimit" type="textarea" :rows="3" show-word-limit maxlength="500" v-model="ruleForm.goodsNameCn" auto-complete="off" style="width:535px">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
			<div style="padding:10px 0px 10px 0px">
				<HR color="#eee" size="5">
				</HR>
			</div>
		</el-form>
		<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="ffrow"></customerSelect>
		<size ref="addMission" v-if="sizeVisible" :visible.sync="sizeVisible" :frow="ffrow"></size>
	</div>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
	import Size from '@/views/public/size_edit'
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
        workgroups: [],
				useroptions: [],
				batteryTypes: [],
				departureStations: [],
				arrivalStations: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions: [],
				goodsTypes: [],
				shippingMethods: [],
				airportOptionsAll: [],
				customerSelectVisible: false,
				sizeVisible: false,
				showFlag: false,
				ffrow: {},
				loading: false,
				vLoad: false,
				freightPriceAmount: '',
				freightPriceType: '单价',
				msrPriceAmount: '',
				msrPriceType: '单价',
				ruleForm: {
					orderCode: '',
					coopName: '',
					coopId: '',
					customerNumber: '',
					orderCodeAssociated: '',
					salesId: '',
					salesName: '',
					servicerId: '',
					servicerName: '',
					shippingMethod: '',
					drivingTime: '',
					departureStation: '',
					arrivalStation: '',
					departureAddress: '',
					arrivalAddress: '',
					planPieces: '0',
					planWeight: '0',
					planVolume: '0',
					planChargeWeight: '0',
					planDimensions: '',
					planDensity: '',
					orderCodeVl: '',
					driverNumber: '',
					driverName: '',
					driverTel: '',
					orderRemark: '',
					freightCurrecnyCode: 'CNY',
					freightUnitprice: '',
					freightAmount: '',
					msrCurrecnyCode: 'CNY',
					msrUnitprice: '',
					msrAmount: '',
					orderRemark: '',
					goodsType: '',
					batteryType: '',
					priceRemark: '',
					goodsNameCn: '',
          workgroupId: '',
				},
				rules: {
					coopName: [{
						required: true,
						message: '请选择客户',
						trigger: ['blur', 'change']
					}],
					departureStation: [{
						required: true,
						message: '请输入始发港',
						trigger: ['blur', 'change']
					}],
					arrivalStation: [{
						required: true,
						message: '请输入目的港',
						trigger: ['blur', 'change']
					}],
					drivingTime: [{
						required: true,
						message: '请选择用车日期',
						trigger: ['blur', 'change']
					}],
					shippingMethod: [{
						required: true,
						message: '请选择运输方式',
						trigger: ['blur', 'change']
					}],
					salesId: [{
						required: true,
						message: '请选择责任销售',
						trigger: ['blur', 'change']
					}],
					customerNumber: [{
						required: true,
						message: '请录入客户单号',
						trigger: ['blur', 'change']
					}],
					servicerId: [{
						required: true,
						message: '请选择责任客服',
						trigger: ['blur', 'change']
					}],
					planChargeWeight: [{
						required: true,
						message: '请录入预报计重',
						trigger: ['blur', 'change']
					}],
					goodsType: [{
						required: true,
						message: '请选择货物类型',
						trigger: ['blur', 'change']
					}],
					batteryType: [{
						required: true,
						message: '请选择电池情况',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['findByPage'],
		components: {
			customerSelect: CustomerSelect,
			size: Size
		},
		provide() {
			return {
				setValue: this.setCoop,
				sizeEditCallBack: this.sizeEditCallBack
			}
		},
		methods: {
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
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
			selectCustomer() {
				this.ffrow.businessScope = 'LC'
				this.customerSelectVisible = true
			},
			changeDepartureStation(val) {
				if (val) {
					this.ruleForm.departureStation = val.toUpperCase()
					this.departureStations = this.airportOptionsAll.filter(port => port.cityCode.indexOf(val.toUpperCase()) > -1 || port.cityNameCn.indexOf(val.toUpperCase()) > -1).slice(0, 20)
				} else {
					this.ruleForm.departureStation = ''
					this.departureStations = this.airportOptionsAll.slice(0, 20)
				}
			},
			changeArrivalStation(val) {
				if (val) {
					this.ruleForm.arrivalStation = val.toUpperCase()
					this.arrivalStations = this.airportOptionsAll.filter(port => port.cityCode.indexOf(val.toUpperCase()) > -1 || port.cityNameCn.indexOf(val.toUpperCase()) > -1).slice(0, 20)
				} else {
					this.ruleForm.arrivalStation = ''
					this.arrivalStations = this.airportOptionsAll.slice(0, 20)
				}
			},
			blurDepartureStation(param) {
				if (!param) {
					if (!this.airportOptionsAll.some(port => port.cityCode == this.ruleForm.departureStation)) {
						this.ruleForm.departureStation = ''
						this.departureStations = this.airportOptionsAll.slice(0, 20)
					}
				}
			},
			blurArrivalStation(param) {
				if (!param) {
					if (!this.airportOptionsAll.some(port => port.cityCode == this.ruleForm.arrivalStation)) {
						this.ruleForm.arrivalStation = ''
						this.arrivalStations = this.airportOptionsAll.slice(0, 20)
					}
				}
			},
			setCoop(row) {
				this.ruleForm.coopId = row.coopId;
				this.ruleForm.coopName = row.coopName;
				//更新责任销售
				this.$axios.get('/prm/coop/' + row.coopId).then((response) => {
					if (response.data.code == 0 && response.data.data != null && response.data.data.transactor_id != null) {
						this.ruleForm.salesId = response.data.data.transactor_id
						this.setSalesName(response.data.data.transactor_id)
					} else {
						let userId = window.localStorage.getItem('userId')
						if (userId != null && userId !== '') {
							this.ruleForm.salesId = parseInt(userId)
							this.setSalesName(parseInt(userId))
						}
					}
				})
			},
			submitForm(formName) {
				if (this.freightPriceType == '单价') {
					this.ruleForm.freightUnitprice = this.freightPriceAmount
					this.ruleForm.freightAmount = null
				} else if (this.freightPriceType == '总价') {
					this.ruleForm.freightAmount = this.freightPriceAmount
					this.ruleForm.freightUnitprice = null
				}

				if (this.msrPriceType == '单价') {
					this.ruleForm.msrUnitprice = this.msrPriceAmount
					this.ruleForm.msrAmount = null
				} else if (this.msrPriceType == '总价') {
					this.ruleForm.msrAmount = this.msrPriceAmount
					this.ruleForm.msrUnitprice = null
				}

				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.put('/sc/lcOrder', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									if (localStorage.getItem("orderSaveClosePage") && localStorage.getItem("orderSaveClosePage") == 'true') {
										this.handleClose();
									} else {
										this.findByPage()
									}
									this.openSuccess("保存成功")
								} else {
									this.openError(response.data.messageInfo)
								}
								this.loading = false
							}).catch((error) => {
								this.openError(error.response.data.messageInfo)
								this.loading = false
							});
					}
				});
			},
			setSalesName(vId) {
				if (vId) {
					this.ruleForm.salesName = this.useroptions.find((item) => {
						return item.value === vId
					}).label3
				} else {
					this.ruleForm.salesName = ''
				}
			},
			setServicerName(vId) {
				if (vId) {
					this.ruleForm.servicerName = this.useroptions.find((item) => {
						return item.value === vId
					}).label3
				} else {
					this.ruleForm.servicerName = ''
				}
			},

			formatToFloat(prop) {
				if (prop == 'planWeight' || prop == 'planVolume' || prop == 'planChargeWeight') {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789.]/g, "");
					let t = this.ruleForm[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							this.ruleForm[prop] = "0." + t[1].substr(0, 3);
						} else {
							this.ruleForm[prop] = t[0].substr(0, 7) + "." + t[1].substr(0, 3);
						}
					} else if (this.ruleForm[prop].startsWith("0")) {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
					} else {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 7)
					}
				} else if (prop == 'planPieces') {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
					if (this.ruleForm[prop].startsWith("0")) {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
					}
				} else if (prop == 'freightPriceAmount') {
					this.freightPriceAmount = this.freightPriceAmount.replace(/[^0123456789.]/g, "");
					let t = this.freightPriceAmount.split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							this.freightPriceAmount = "0." + t[1].substr(0, 2);
						} else {
							this.freightPriceAmount = t[0].substr(0, 7) + "." + t[1].substr(0, 2);
						}
					} else if (this.freightPriceAmount.startsWith("0")) {
						this.freightPriceAmount = this.freightPriceAmount.substr(0, 1)
					} else {
						this.freightPriceAmount = this.freightPriceAmount.substr(0, 7)
					}
				} else if (prop == 'msrPriceAmount') {
					this.msrPriceAmount = this.msrPriceAmount.replace(/[^0123456789.]/g, "");
					let t = this.msrPriceAmount.split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							this.msrPriceAmount = "0." + t[1].substr(0, 2);
						} else {
							this.msrPriceAmount = t[0].substr(0, 7) + "." + t[1].substr(0, 2);
						}
					} else if (this.msrPriceAmount.startsWith("0")) {
						this.msrPriceAmount = this.msrPriceAmount.substr(0, 1)
					} else {
						this.msrPriceAmount = this.msrPriceAmount.substr(0, 7)
					}
				}
			},
			editSize() {
				this.ffrow.planDimensions = this.ruleForm.planDimensions;
				this.ffrow.position = '陆运订单'
				this.sizeVisible = true;
			},
			sizeEditCallBack(row) {
				this.ruleForm.planDimensions = row.value
				this.ruleForm.planPieces = row.pieces
				this.ruleForm.planVolume = row.volume / 1000000
				this.setPlanChargeWeight()
				this.ruleForm.planVolume = (row.volume / 1000000).toFixed(3);
			},
			setPlanChargeWeight() {
				let planChargeWeight = this.ruleForm.planVolume * 1000000 / 6000;
				if (this.ruleForm.planWeight > planChargeWeight) {
					if ((this.ruleForm.planWeight + "").split(".").length > 1) {
						this.ruleForm.planChargeWeight = parseFloat(this.ruleForm.planWeight + "").toFixed(3);
					} else {
						this.ruleForm.planChargeWeight = parseInt(this.ruleForm.planWeight + "").toFixed(3);
					}
				} else {
					this.ruleForm.planChargeWeight = planChargeWeight.toFixed(3);
				}
				if (this.ruleForm.planVolume != null && this.ruleForm.planVolume !== '' && parseFloat(this.ruleForm.planVolume + '') != 0 && this.ruleForm.planWeight != null && this.ruleForm.planWeight !== '') {
					this.ruleForm.planDensity = parseFloat(this.ruleForm.planWeight + '') / parseFloat(this.ruleForm.planVolume + '') + ''
					this.ruleForm.planDensity = this.ruleForm.planDensity.split('.')[0]
				} else {
					this.ruleForm.planDensity = ''
				}
			},
			view() {
				this.vLoad = true
				this.$axios.get('/sc/lcOrder/' + this.frow.orderId).then((response) => {
					if (response.data.code == 0) {
						this.ruleForm = response.data.data
						if (this.ruleForm.freightUnitprice) {
							this.freightPriceType = "单价"
							this.freightPriceAmount = this.ruleForm.freightUnitprice
						}
						if (this.ruleForm.freightAmount) {
							this.freightPriceType = "总价"
							this.freightPriceAmount = this.ruleForm.freightAmount
						}
						if (this.ruleForm.msrUnitprice) {
							this.msrPriceType = "单价"
							this.msrPriceAmount = this.ruleForm.msrUnitprice
						}
						if (this.ruleForm.msrAmount) {
							this.msrPriceType = "总价"
							this.msrPriceAmount = this.ruleForm.msrAmount
						}

						this.$axios.get('/afbase/airport/city').then((response) => {
							this.airportOptionsAll = response.data.data;
							this.departureStations = this.airportOptionsAll.slice(0, 20);
							this.arrivalStations = this.airportOptionsAll.slice(0, 20);
							if (this.ruleForm.departureStation && !this.departureStations.some(city => city.cityCode == this.ruleForm.departureStation)) {
								this.departureStations = this.departureStations.concat(this.airportOptionsAll.filter(city => city.cityCode == this.ruleForm.departureStation))
							}
							if (this.ruleForm.arrivalStation && !this.arrivalStations.some(city => city.cityCode == this.ruleForm.arrivalStation)) {
								this.arrivalStations = this.arrivalStations.concat(this.airportOptionsAll.filter(city => city.cityCode == this.ruleForm.arrivalStation))
							}
							this.vLoad = false
						})
					} else {
						this.vLoad = false
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.vLoad = false
					this.openError(error.response.data.messageInfo)
				})
			}
		},
		created() {
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
			}.bind(this));
      //工作组
      this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=LC').then(function(response) {
          this.workgroups = response.data.data;
      }.bind(this));
			this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
				this.currencyCodeOptions = response.data.data;
				this.msrCurrecnyCodeOptions = response.data.data;
			}.bind(this));
			this.$axios.get('/sc/vLcCategory/运输方式').then((response) => {
				this.shippingMethods = response.data.data;
			})
			this.$axios.get('/sc/vLcCategory/电池情况').then((response) => {
				this.batteryTypes = response.data.data;
			})
			this.$axios.get('/sc/vLcCategory/货物类型').then((response) => {
				this.goodsTypes = response.data.data;
			})

			this.view()
		},
    mounted: function () {
        if(this.ruleForm.workgroupId){
            this.setWorkgroup(parseInt(this.ruleForm.workgroupId))
        }
    },
	}
</script>
<style>
	.lcOrderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.lcOrderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.afOrderLinkTwoInput .el-form-item__content {
		line-height: 30px !important;
	}
</style>
