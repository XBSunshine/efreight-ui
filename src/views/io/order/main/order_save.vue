<template>
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
		<div class="ioOrderEditPage" style="width: 1280px;">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">其他业务订单&nbsp;-&nbsp;新增</span>
					<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
					</el-link>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
								<template slot="prepend">业务单号</template>
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
							<el-input class="widthWithFourWithXing" style="width:187px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>销售/客服</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.salesId" filterable placeholder="请选择" @change="setSalesName" style="width:90px;margin-right: -5px;">
									<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
										<span style="float: left">{{ item.label }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item prop="servicerId">
              <el-input style="width:80px;">
                <template slot="prepend">
                  <span>&nbsp;&nbsp;&nbsp;</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.servicerId" filterable placeholder="请选择" @change="setServicerName" style="width:102px;margin-right: -5px;">
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
						<el-form-item>
							<el-input class="widthWithFour" v-model="ruleForm.customerNumber" clearable maxlength="30" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>客户单号</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="businessMethod">
							<el-input auto-complete="off" class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>业务分类</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.businessMethod" clearable filterable placeholder="请选择" style="width:198px;margin-right: -5px;">
									<el-option v-for="(item,index) in businessMethods" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
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
              <el-input class="widthWorkGroup" auto-complete="off" style="width:298px;" clearable>
                <template slot="prepend">
                  <span>工作组</span>
                </template>
                <el-select slot="suffix" v-model="ruleForm.workgroupId" placeholder="请选择工作组" style="width:200px;margin-right: -5px;" clearable>
                  <el-option v-for="item in workgroups" :key="item.workgroupId" :label="item.workgroupName" :value="item.workgroupId">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
					<!--<el-col class="elementWidth">
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
					</el-col>-->
				</el-row>
				<div style="padding:0px 0px 20px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="goodsType">
							<el-input class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>货物类型</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.goodsType" clearable placeholder="请选择货物类型" style="width:198px;margin-right: -5px;">
									<el-option v-for="item,index in goodsTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" v-model="ruleForm.departureStation" clearable maxlength="30" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>起运地</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree" v-model="ruleForm.arrivalStation" clearable maxlength="30" auto-complete="off" style="width:295px;margin-right: 15px;">
								<template slot="prepend">
									<span>目的地</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="businessDate">
							<el-input class="widthWithFourWithXing" style="width:295px">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>业务日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="ruleForm.businessDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择业务日期" style="width: 198px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="planPieces">
							<el-input maxlength="6" class="widthWithTwoWithXing" @input="formatToFloat('planPieces')" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>件数</span>
								</template>
								<el-select slot="append" v-model="ruleForm.packageType" clearable placeholder="包装" style="width:85px;">
									<el-option v-for="(item,index) in packageTypes" :key="index" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="planWeight">
							<el-input maxlength="7" class="widthWithTwoWithXing" @input="formatToFloat('planWeight')" v-model="ruleForm.planWeight" @change="setPlanChargeWeight();formatDecimalPlaces('planWeight')" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
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
					<el-col class="elementWidth">
						<el-form-item prop="planVolume">
							<el-input maxlength="7" class="widthWithTwoWithXing" @input="formatToFloat('planVolume')" @change="setPlanChargeWeight();formatDecimalPlaces('planVolume')" v-model="ruleForm.planVolume" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>体积</span>
								</template>
								<template slot="append">
									<span>CBM</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="planChargeWeight">
							<el-input maxlength="12" class="widthWithTwoWithXing" @input="formatToFloat('planChargeWeight')" @change="formatDecimalPlaces('planChargeWeight')" v-model="ruleForm.planChargeWeight" auto-complete="off" style="width:295px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>计重</span>
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
				<el-row>
					<el-col class="elementWidth">
						<el-row>
							<el-button type="text" style="margin-left: 20px;" disabled>发货人信息</el-button>
							<el-button @click="editShipperConsignee('shipper')" icon="el-icon-edit" type="text">编辑</el-button>
						</el-row>
						<el-row>
							<el-form-item>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.shipper.scPrintRemark" @input="ruleForm.shipper.scPrintRemark = ruleForm.shipper.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:615px" show-word-limit maxlength="500">
								</el-input>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col class="elementWidth" style="margin-left: 15px;">
						<el-row>
							<el-button type="text" style="margin-left: 20px;" disabled>收货人信息</el-button>
							<el-button @click="editShipperConsignee('consignee')" icon="el-icon-edit" type="text">编辑</el-button>
						</el-row>
						<el-row>
							<el-form-item>
								<el-input class="showWordLimit" type="textarea" v-model="ruleForm.consignee.scPrintRemark" @input="ruleForm.consignee.scPrintRemark = ruleForm.consignee.scPrintRemark.toUpperCase()" auto-complete="off" :rows="5" disabled style="width:615px" show-word-limit maxlength="500">
								</el-input>
							</el-form-item>
						</el-row>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>中文品名</el-button>
							</el-row>
							<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameCn" @change="ruleForm.goodsNameCn=strTrim(ruleForm.goodsNameCn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 615px;" show-word-limit></el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item style="margin-left: 15px;">
							<el-row>
								<el-button type="text" style="margin-left: 20px;" disabled>英文品名</el-button>
							</el-row>
							<el-input class="showWordLimit" type="textarea" v-model="ruleForm.goodsNameEn" @change="ruleForm.goodsNameEn=strTrim(ruleForm.goodsNameEn).toUpperCase()" auto-complete="off" :rows="3" maxlength="500" style="width: 615px;" show-word-limit></el-input>
						</el-form-item>
					</el-col>

				</el-row>
				<div style="padding:10px 0px 10px 0px">
					<HR color="#eee" size="5">
					</HR>
				</div>
				<el-row>
					<el-form-item>
						<el-button :loading="loading" type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-row>
			</el-form>
			<customerSelect ref="addMission" v-if="customerSelectVisible" :visible.sync="customerSelectVisible" :frow="ffrow"></customerSelect>
			<shipperConsignee ref="addMission" v-if="shipperConsigneeVisible" :visible.sync="shipperConsigneeVisible" :frow="ffrow"></shipperConsignee>
		</div>
	</el-dialog>
</template>
<script>
	import CustomerSelect from '@/views/public/customer_select'
	import ShipperConsignee from '../other/order_shipperConsignee_select'
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
				helpDocumentUrl: '',
				useroptions: [],
				packageTypes: [],
				goodsTypes: [],
				businessMethods: [],
				customerSelectVisible: false,
				shipperConsigneeVisible: false,
				showFlag: false,
				ffrow: {},
				loading: false,
				ifFullscreen: false,
				style: {},
				orderIoDigitsWeight: 1,
				orderIoDigitsVolume: 3,
				orderIoDigitsChargeWeight: 2,
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
					businessMethod: '',
					businessDate: '',
					departureStation: '',
					arrivalStation: '',
					planPieces: '0',
					planWeight: '0',
					planVolume: '0',
					planChargeWeight: '0',
					orderRemark: '',
					goodsType: '',
					packageType: '',
					goodsNameCn: '',
					goodsNameEn: '',
					consignee: {
						scPrintRemark: ''
					},
					shipper: {
						scPrintRemark: ''
					},
          workgroupId: '',
				},
				rules: {
					coopName: [{
						required: true,
						message: '请选择客户',
						trigger: ['blur', 'change']
					}],
					businessDate: [{
						required: true,
						message: '请选择业务日期',
						trigger: ['blur', 'change']
					}],
					businessMethod: [{
						required: true,
						message: '请选择业务分类',
						trigger: ['blur', 'change']
					}],
					salesId: [{
						required: true,
						message: '请选择责任销售',
						trigger: ['blur', 'change']
					}],
					servicerId: [{
						required: true,
						message: '请选择责任客服',
						trigger: ['blur', 'change']
					}],
					planPieces: [{
						required: true,
						message: '请录入件数',
						trigger: ['blur', 'change']
					}],
					planWeight: [{
						required: true,
						message: '请录入毛重',
						trigger: ['blur', 'change']
					}],
					planVolume: [{
						required: true,
						message: '请录入体积',
						trigger: ['blur', 'change']
					}],
					planChargeWeight: [{
						required: true,
						message: '请录入计重',
						trigger: ['blur', 'change']
					}],
					goodsType: [{
						required: true,
						message: '请选择货物类型',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['findByPage'],
		components: {
			customerSelect: CustomerSelect,
			shipperConsignee: ShipperConsignee
		},
		provide() {
			return {
				setValue: this.setCoop,
				shipperConsigneeCallback: this.shipperConsigneeCallback
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
				this.ffrow.businessScope = 'IO'
				this.customerSelectVisible = true
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
				if (this.ruleForm.packageType == '') {
					this.openError('请选择包装')
					return
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.$axios.post2('/sc/ioOrder', this.ruleForm)
							.then((response) => {
								if (response.data.code == 0) {
									this.findByPage()
									this.openSuccess("保存成功")
									this.handleClose()
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
			// 关闭
			handleClose() {
				if (this.ifFullscreen) {
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
				} else {
					this.$emit('update:visible', false);
				}
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
          let obj = {};
          obj = this.useroptions.find((item) => {
              return item.value === vId;
          });
          if(obj){
              this.ruleForm.servicerName = obj.label3;
              //查询当前客服所在的工作组
              this.$axios.get('/hrs/userWorkgroup/selectWorkgroupByServicerId?servicerId='+this.ruleForm.servicerId).then(function(response) {
                  let userWorkgroupDetailList1 = response.data.data;
                  if(userWorkgroupDetailList1 != null && userWorkgroupDetailList1.length > 0){
                      this.setWorkgroup(parseInt(userWorkgroupDetailList1[0]))
                  }else{
                      this.ruleForm.workgroupId = ''
                  }
                  this.$forceUpdate();
              }.bind(this));
          }
			},
      setWorkgroup(vId) {
          let obj = {};
          obj = this.workgroups.find((item) => {
              return item.workgroupId === vId;
          });
          if(obj){
              this.ruleForm.workgroupId = obj.workgroupId;
          }else{
              this.ruleForm.workgroupId = ''
          }
      },
			formatDecimalPlaces(item) {
				if (item == 'planWeight') {
					if (this.ruleForm.planWeight) {
						let t = this.ruleForm.planWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderIoDigitsWeight) {
								this.ruleForm.planWeight = t[0] + "." + t[1] + "000".substr(0, this.orderIoDigitsWeight - t[1].length);
							} else {
								this.ruleForm.planWeight = parseFloat(t[0] + "." + t[1]).toFixed(this.orderIoDigitsWeight);
							}
						} else {
							if (this.orderIoDigitsWeight !== 0) {
								this.ruleForm.planWeight = t[0] + "." + "000".substr(0, this.orderIoDigitsWeight);
							}
						}
					}
				} else if (item == 'planVolume') {
					if (this.ruleForm.planVolume) {
						let t = this.ruleForm.planVolume.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderIoDigitsVolume) {
								this.ruleForm.planVolume = t[0] + "." + t[1] + "000".substr(0, this.orderIoDigitsVolume - t[1].length);
							} else {
								this.ruleForm.planVolume = parseFloat(t[0] + "." + t[1]).toFixed(this.orderIoDigitsVolume);
							}
						} else {
							if (this.orderIoDigitsVolume !== 0) {
								this.ruleForm.planVolume = t[0] + "." + "000".substr(0, this.orderIoDigitsVolume);
							}
						}
					}
				} else if (item == 'planChargeWeight') {
					if (this.ruleForm.planChargeWeight) {
						let t = this.ruleForm.planChargeWeight.split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderIoDigitsChargeWeight) {
								this.ruleForm.planChargeWeight = t[0] + "." + t[1] + "000".substr(0, this.orderIoDigitsChargeWeight - t[1].length);
							} else {
								this.ruleForm.planChargeWeight = parseFloat(t[0] + "." + t[1]).toFixed(this.orderIoDigitsChargeWeight);
							}
						} else {
							if (this.orderIoDigitsChargeWeight !== 0) {
								this.ruleForm.planChargeWeight = t[0] + "." + "000".substr(0, this.orderIoDigitsChargeWeight);
							}
						}
					}
				}
			},
			formatToFloat(prop) {
				if (prop == 'planChargeWeight') {
					if (this.orderIoDigitsChargeWeight === 0) {
						this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planChargeWeight = this.ruleForm.planChargeWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planChargeWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planChargeWeight = t[0] + "." + t[1].substr(0, this.orderIoDigitsChargeWeight);
					}
				} else if (prop == 'planVolume') {
					if (this.orderIoDigitsVolume === 0) {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planVolume = this.ruleForm.planVolume.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planVolume.split('.');
					if (t.length > 1) {
						this.ruleForm.planVolume = t[0] + "." + t[1].substr(0, this.orderIoDigitsVolume);
					}
				} else if (prop == 'planWeight') {
					if (this.orderIoDigitsWeight === 0) {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789]/g, "");
					} else {
						this.ruleForm.planWeight = this.ruleForm.planWeight.replace(/[^0123456789.]/g, "");
					}
					let t = this.ruleForm.planWeight.split('.');
					if (t.length > 1) {
						this.ruleForm.planWeight = t[0] + "." + t[1].substr(0, this.orderIoDigitsWeight);
					}
				} else if (prop == 'planPieces') {
					this.ruleForm[prop] = this.ruleForm[prop].replace(/[^0123456789]/g, "");
					if (this.ruleForm[prop].startsWith("0")) {
						this.ruleForm[prop] = this.ruleForm[prop].substr(0, 1)
					}
				}
			},
			setPlanChargeWeight() {
				let planChargeWeight = this.ruleForm.planVolume * 1000000 / 6000;
				if (this.ruleForm.planWeight > planChargeWeight) {
					if ((this.ruleForm.planWeight + "").split(".").length > 1) {
						this.ruleForm.planChargeWeight = parseFloat(this.ruleForm.planWeight + "").toFixed(this.orderIoDigitsWeight);
						this.ruleForm.planWeight = parseFloat(this.ruleForm.planWeight + "").toFixed(this.orderIoDigitsWeight);
					} else {
						this.ruleForm.planChargeWeight = parseInt(this.ruleForm.planWeight + "").toFixed(this.orderIoDigitsWeight);
						this.ruleForm.planWeight = parseInt(this.ruleForm.planWeight + "").toFixed(this.orderIoDigitsWeight);
					}
				} else {
					this.ruleForm.planChargeWeight = planChargeWeight.toFixed(this.orderIoDigitsChargeWeight);
					if (this.ruleForm.planWeight) {
						if (((this.ruleForm.planWeight + "").split(".").length > 1)) {
							this.ruleForm.planWeight = parseFloat(this.ruleForm.planWeight + "").toFixed(this.orderIoDigitsWeight);
						} else {
							this.ruleForm.planWeight = parseInt(this.ruleForm.planWeight + "").toFixed(this.orderIoDigitsWeight);
						}
					}
				}
			},
			editShipperConsignee(flag) {
				if (flag == 'shipper') {
					this.ffrow.shipperConsignee = this.ruleForm.shipper
				} else if (flag == 'consignee') {
					this.ffrow.shipperConsignee = this.ruleForm.consignee
				}
				this.ffrow.scType = flag
				this.shipperConsigneeVisible = true;
			},
			shipperConsigneeCallback(rrow) {
				if (rrow.scType === 1) {
					this.ruleForm.consignee.scType = 1;
					this.ruleForm.consignee.scName = rrow.scName;
					this.ruleForm.consignee.scMnemonic = rrow.scMnemonic;
					this.ruleForm.consignee.scAddress = rrow.scAddress;
					this.ruleForm.consignee.scCode = rrow.scCode;
					this.ruleForm.consignee.scCodeType = rrow.scCodeType;
					this.ruleForm.consignee.aeoCode = rrow.aeoCode;
					this.ruleForm.consignee.nationCode = rrow.nationCode;
					this.ruleForm.consignee.stateCode = rrow.stateCode;
					this.ruleForm.consignee.cityCode = rrow.cityCode;
					this.ruleForm.consignee.cityName = rrow.cityName;
					this.ruleForm.consignee.postCode = rrow.postCode;
					this.ruleForm.consignee.telNumber = rrow.telNumber;
					this.ruleForm.consignee.faxNumber = rrow.faxNumber;
					this.ruleForm.consignee.scPrintRemark = rrow.scPrintRemark;
				} else {
					this.ruleForm.shipper.scType = 0;
					this.ruleForm.shipper.scName = rrow.scName;
					this.ruleForm.shipper.scMnemonic = rrow.scMnemonic;
					this.ruleForm.shipper.scAddress = rrow.scAddress;
					this.ruleForm.shipper.scCode = rrow.scCode;
					this.ruleForm.shipper.scCodeType = rrow.scCodeType;
					this.ruleForm.shipper.aeoCode = rrow.aeoCode;
					this.ruleForm.shipper.nationCode = rrow.nationCode;
					this.ruleForm.shipper.stateCode = rrow.stateCode;
					this.ruleForm.shipper.cityCode = rrow.cityCode;
					this.ruleForm.shipper.cityName = rrow.cityName;
					this.ruleForm.shipper.postCode = rrow.postCode;
					this.ruleForm.shipper.telNumber = rrow.telNumber;
					this.ruleForm.shipper.faxNumber = rrow.faxNumber;
					this.ruleForm.shipper.scPrintRemark = rrow.scPrintRemark;
				}

			}
		},
		created() {
			this.ifFullscreen = this.frow.ifFullscreen
			if (this.ifFullscreen) {
				this.style.top = '0px'
			} else {
				this.style.top = '-80px'
			}
			this.$axios.get('/hrs/permission/' + 469).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get('/hrs/dept/selectUser').then(function(response) {
				this.useroptions = response.data.data;
				if (this.useroptions != null && this.useroptions.length > 0) {
					let userId = window.localStorage.getItem('userId')
					if (userId != null && userId !== '') {
						this.ruleForm.salesId = parseInt(userId)
						this.setSalesName(parseInt(userId))
						this.ruleForm.servicerId = parseInt(userId)
						this.setServicerName(parseInt(userId))
					}
				}
			}.bind(this));
      //工作组
      this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=IO').then(function(response) {
          this.workgroups = response.data.data;
          let userWorkgroupDetailList = window.localStorage.getItem('userWorkgroupDetailList')
          if(userWorkgroupDetailList != null && userWorkgroupDetailList.length > 0){
              this.setWorkgroup(parseInt(userWorkgroupDetailList[0]))
          }
      }.bind(this));
			this.$axios.get('/afbase/aforder/selectCoop').then(function(response) {
				if (response.data.code == 0 && response.data.data.records.length === 1) {
					this.setCoop(response.data.data.records[0]);
				}
			}.bind(this));
			this.$axios.get('/sc/vIoCategory/业务分类').then((response) => {
				this.businessMethods = response.data.data;
			})
			this.$axios.get('/sc/vIoCategory/包装类型').then((response) => {
				this.packageTypes = response.data.data;
				if (this.packageTypes.length != 0) {
					this.ruleForm.packageType = "纸箱"
				}
			})
			this.$axios.get('/sc/vIoCategory/货物类型').then((response) => {
				this.goodsTypes = response.data.data;
			})
			//查询签约公司默认配置信息
			this.$axios.get('/hrs/org/getOrgOrderConfig/IO').then((response) => {
				if (response.data.code == 0 && response.data.data) {
					this.ruleForm.goodsType = response.data.data.goodsType
					if (!this.ruleForm.goodsType) {
						this.ruleForm.goodsType = '普货'
					}
					this.ruleForm.businessMethod = response.data.data.businessMethod
					if (!this.ruleForm.businessMethod) {
						this.ruleForm.businessMethod = '其他'
					}
				} else {
					this.ruleForm.goodsType = '普货'
					this.ruleForm.businessMethod = '其他'
				}
			}).catch((error) => {
				this.ruleForm.goodsType = '普货'
				this.ruleForm.businessMethod = '其他'
			})
			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces").then((response) => {
				if (response.data.code == 0) {
					if (response.data.data.orderIoDigitsWeight != null) {
						this.orderIoDigitsWeight = response.data.data.orderIoDigitsWeight
					}
					if (response.data.data.orderIoDigitsVolume != null) {
						this.orderIoDigitsVolume = response.data.data.orderIoDigitsVolume
					}
					if (response.data.data.orderIoDigitsChargeWeight != null) {
						this.orderIoDigitsChargeWeight = response.data.data.orderIoDigitsChargeWeight
					}
				} else {
					this.openError(response.data.messageInfo)
				}
			});

		}
	}
</script>
<style>
	.ioOrderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.ioOrderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

  .ioOrderEditPage .el-form-item__content {
    line-height: 40px !important;
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

  .ioOrderEditPage .widthWorkGroup .el-input-group__prepend {
    padding: 0 32px;
  }
</style>
