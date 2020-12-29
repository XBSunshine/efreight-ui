<template>
	<el-dialog title="" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top: -80px;" show-close append-to-body>
		<div class="orderEditPage" style="width: 1280px;">
			<div style="margin-top: -15px;margin-bottom: 20px;margin-left: 15px;">
				<span style="font-size: large;margin-bottom: 20px;">编辑舱单</span>
				<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
				</el-link>
			</div>
			<el-container>
				<el-main style="overflow:hidden">
					<el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
						<el-row type="flex" justify="end" :gutter="100">
							<el-col class="elementWidth" style="margin-bottom: 10px;">
								<font style="color: #409EFF;">提示：发送运抵、理货必填项（红色星号<font style="color: red;">*</font>）</font>
							</el-col>
						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" v-model="ruleForm.awbNumber" disabled style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>主运单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" v-model="ruleForm.hawbNumber" disabled clearable auto-complete="off" maxlength="12" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>分运单号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThreeWithXing" clearable @change="ruleForm.expectFlight=strTrim(ruleForm.expectFlight).toUpperCase()" v-model="ruleForm.expectFlight" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>航班号</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" style="width:250px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>航班日期</span>
										</template>
										<el-date-picker slot="suffix" v-model="ruleForm.expectDeparture" type="date" value-format="yyyy-MM-dd" style="width: 153px;margin-right: -5px;">
										</el-date-picker>
									</el-input>
								</el-form-item>
							</el-col>

						</el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThreeWithXing" v-model="ruleForm.departureStation" clearable @change="ruleForm.departureStation=strTrim(ruleForm.departureStation).toUpperCase()" auto-complete="off" maxlength="4" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>始发港</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThreeWithXing" v-model="ruleForm.arrivalStation" clearable @change="ruleForm.arrivalStation=strTrim(ruleForm.arrivalStation).toUpperCase()" auto-complete="off" maxlength="4" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>目的港</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithThree" v-model="ruleForm.unloadingLocationCode" maxlength="4" clearable @change="ruleForm.unloadingLocationCode=strTrim(ruleForm.unloadingLocationCode).toUpperCase()" auto-complete="off" style="width: 250px;margin-right: 10px;">
										<template slot="prepend">
                      <font style="color: red;">*</font>
											<span>卸货地代码</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithFourWithXing" style="width:250px;">
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>卸货日期</span>
										</template>
										<el-date-picker slot="suffix" v-model="ruleForm.unloadingLocationDate" clearable type="date" value-format="yyyy-MM-dd" format="yyyyMMdd" placeholder="选择卸货日期" style="width: 153px;margin-right: -5px;">
										</el-date-picker>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
              <el-col class="elementWidth">
                <el-form-item>
                  <el-input class="widthWithFourWithXing" auto-complete="off" style="width: 250px; margin-right: 10px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>海关代码</span>
                    </template>
                    <el-select slot="suffix" v-model="ruleForm.customsStatusCode" placeholder="请选择" style="width:152px;margin-right: -5px;" clearable>
                      <el-option v-for="item in codeOptions" :key="index" :label="item.label" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item>
                  <el-input class="widthWithFourWithXing" style="width: 250px; margin-right: 10px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>装载开始时间</span>
                    </template>
                    <el-date-picker slot="suffix" v-model="ruleForm.actualDatetime" clearable type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyyMMddHHmmss" style="width: 134px;margin-right: -5px;">
                    </el-date-picker>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item>
                  <el-input class="widthWithFourWithXing" style="width:250px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>装载完成时间</span>
                    </template>
                    <el-date-picker slot="suffix" v-model="ruleForm.completedDatetime" clearable type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyyMMddHHmmss" style="width: 134px;margin-right: -5px;">
                    </el-date-picker>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithTwoWithXing" @change="ruleForm.planPieces=strTrim(ruleForm.planPieces)" @input="formatToFloat('planPieces')" maxlength="8" v-model="ruleForm.planPieces" auto-complete="off" style="width:250px;margin-right: 10px;" clearable>
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>件数</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item>
									<el-input class="widthWithTwoWithXing" @input="formatToFloat('planWeight')" @change="formatDecimalPlaces('planWeight')" maxlength="10" v-model="ruleForm.planWeight" auto-complete="off" style="width:250px;margin-right: 10px;" clearable>
										<template slot="prepend">
											<font style="color: red;">*</font>
											<span>毛重</span>
										</template>
										<template slot="append">
											<span>KG</span>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
              <el-button type="text" style="margin-left: 20px;" disabled>
                <font style="color: red;">*</font>货物描述
              </el-button>
            </el-row>
            <el-row>
              <el-form-item>
                <el-input type="textarea" v-model="ruleForm.goodsNameEn"  clearable @change="ruleForm.goodsNameEn=strTrim(ruleForm.goodsNameEn).toUpperCase()" auto-complete="off" :rows="5" style="width:520px">

                </el-input>
              </el-form-item>
            </el-row>

						<el-row>
							<el-form-item>
								<el-button type="primary" size="small" @click="submitForm">保存</el-button>
								<el-button type="primary" size="small" @click="submitAndSendForm">保存并发送</el-button>
							</el-form-item>
						</el-row>
					</el-form>
				</el-main>
			</el-container>
			<size ref="addMission" v-if="sizeVisible" :visible.sync="sizeVisible" :frow="ffrow"></size>
		</div>

	</el-dialog>
</template>
<script>
	import size from '@/views/public/size_edit'
	export default {
	  name:'shipperLetter',
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			var checkNumber1 = (rule, value, callback) => {
				let regE = /^[1-9]\d{0,7}$/;
				if (!regE.test(value)) {
					callback(new Error('请输入1-8位大于0的整数'));
				} else {
					callback();
				}
			}
			var checkNumber3 = (rule, value, callback) => {
				let regE = /^[0-9]\d{0,3}$/;
				if (!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if (value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			}
			return {
				helpDocumentUrl: '',
				codeOptions: [],
				sizeVisible: false,
				disabledFlag: false,
				ifHawbNumberMake: false,
				ifHaveAwbNumberMake: false,
				ffrow: {},
				orderAeDigitsWeight: 1,
				orderAeDigitsVolume: 3,
				orderAeDigitsChargeWeight: 2,
				ruleForm: {
				  slId:'',
          orderId:'',
          orderUuid:'',
					awbNumber: '',
					hawbNumber: '',
					departureStation: '',
					arrivalStation: '',
					expectFlight: '',
					expectDeparture: '',
					planPieces: '',
					planWeight: '',
					customsStatusCode: '',
          actualDatetime:'',
          completedDatetime:'',
          unloadingLocationDate:'',
          unloadingLocationCode:'',
					goodsNameEn: '',
				}
			}
		},
		inject: ['findByPage', 'continueOperation'],
		components: {
			size,
		},
		provide() {
			return {
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
			gotoSizePage() {
				this.ffrow.planDimensions = this.ruleForm.planDimensions;
				this.ffrow.position = '舱单信息'
				this.sizeVisible = true;
			},
			sizeEditCallBack(row) {
				this.ruleForm.planDimensions = row.value
				this.ruleForm.planPieces = row.pieces
				this.ruleForm.planVolume = (row.volume / 1000000).toFixed(this.orderAeDigitsVolume);
			},
			gotoShipperConsigneePage(scType) {
				this.ffrow.scType = scType;
				if (scType === 1) {
					this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee1
				} else {
					this.ffrow.rowBean = this.ruleForm.afOrderShipperConsignee2
				}

			},
      submitForm() {
        this.$emit("shipperLetterCallback", {
          orderInfo: this.ruleForm
        })
        this.$emit("doSave")
      },
      submitAndSendForm() {
        //校验装载时间并提示
        if (this.ruleForm.loadingDate&&this.getDateObj(this.ruleForm.loadingDate).getTime() < this.getCurrDateObj().getTime()) {
          this.$confirm('您录入的装载时间过早，如果继续发送有可能进入风险分析（海关罚款5W以下），继续提交点确认，返回修改点取消（建议装载时间在发送时间至少加4小时）', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.doSaveForOperateLook()
          }).catch(() => {})
        } else {
          this.doSaveForOperateLook()
        }
      },
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			formatToFloat(item) {
				if (item == 'awbNumber') {
					this.ruleForm.awbNumber = this.ruleForm.awbNumber.replace(/[^0123456789.-]/g, "");
					var t = this.ruleForm.awbNumber.split('.');
					if (t.length > 1) {
						this.ruleForm.awbNumber = t[0];
					}
				} else if (item == 'planWeight') {
					if (this.orderAeDigitsWeight === 0) {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderAeDigitsWeight);
					}
				} else if (item == 'planPieces') {
					this.ruleForm.planPieces = this.ruleForm.planPieces.replace(/[^0123456789]/g, "");
				}
			},
			formatDecimalPlaces(item) {
				if (item == 'planWeight') {
					if (this.ruleForm.planWeight) {
						let t = this.ruleForm.planWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsWeight) {
								this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsWeight - t[1].length);
							}
						} else {
							if (this.orderAeDigitsWeight !== 0) {
								this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderAeDigitsWeight);
							}
						}
					}
				}
			},
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				var _hour = theDate.getHours()
				_month = _month + 1
				_hour = _hour + 4
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				if (_hour < 10) {
					_hour = "0" + _hour;
				}
				return _year + "-" + _month + "-" + _date + " " + _hour + ":00:00"
			},
			getDateObj(dateStr) {
				//yyyy-MM-dd HH:00:00
				let theDate = new Date(dateStr.substr(0, 4), dateStr.substr(5, 2), dateStr.substr(8, 2), dateStr.substr(11, 2), 0, 0)
				let _year = theDate.getFullYear()
				let _month = theDate.getMonth()
				let _date = theDate.getDate()
				let _hour = theDate.getHours()
				_month = _month - 1
				return new Date(_year, _month, _date, _hour, 0, 0)
			},
			getCurrDateObj() {
				let theDate = new Date()
				let _year = theDate.getFullYear()
				let _month = theDate.getMonth()
				let _date = theDate.getDate()
				let _hour = theDate.getHours()
				_hour = _hour + 4
				return new Date(_year, _month, _date, _hour, 0, 0)
			}
		},
    created() {
      this.ruleForm = this.frow.shipperLetter

			this.$axios.get('/hrs/permission/' + 159).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=货物海关代码').then(function(response) {
				this.codeOptions = response.data.data;
			}.bind(this));
			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces")
				.then((response) => {
					if (response.data.code == 0) {
						if (response.data.data.orderAeDigitsWeight != null) {
							this.orderAeDigitsWeight = response.data.data.orderAeDigitsWeight
						}
						if (response.data.data.orderAeDigitsVolume != null) {
							this.orderAeDigitsVolume = response.data.data.orderAeDigitsVolume
						}
						if (response.data.data.orderAeDigitsChargeWeight != null) {
							this.orderAeDigitsChargeWeight = response.data.data.orderAeDigitsChargeWeight
						}
					} else {
						this.openError(response.data.messageInfo)
					}
				});
		}
	}
</script>
<style>
	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
</style>
