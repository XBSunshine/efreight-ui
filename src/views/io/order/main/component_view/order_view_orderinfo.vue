<template>
	<div v-loading="vLoad" class="ioOrderEditPage">
		<el-form disabled :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.orderCode" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
							<template slot="prepend">业务单号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFourWithXing" readOnly v-model="ruleForm.coopName" style="width:615px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>客户名称</span>
							</template>
							<el-button slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="widthWithFourWithXing" style="width:187px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>销售/客服</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.salesId" clearable filterable placeholder="请选择" @change="setSalesName" style="width:90px;margin-right: -5px;">
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
                <span>客</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.servicerId" clearable filterable placeholder="请选择" @change="setServicerName" style="width:102px;margin-right: -5px;">
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
					<el-form-item>
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
					<el-form-item>
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
					<el-form-item>
						<el-input class="widthWithFourWithXing" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>货物类型</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.goodsType" clearable placeholder="请选择货物类型" style="width:198px;margin-right: -5px;">
								<el-option v-for="(item,index) in goodsTypes" :key="index" :label="item.paramText" :value="item.paramText">
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
					<el-form-item>
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
					<el-form-item>
						<el-input maxlength="6" class="widthWithTwoWithXing" v-model="ruleForm.planPieces" auto-complete="off" style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>件数</span>
							</template>
							<el-select slot="append" v-model="ruleForm.packageType" placeholder="包装" style="width:85px;">
								<el-option v-for="(item,index) in packageTypes" :key="index" :label="item.paramText" :value="item.paramText">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input maxlength="7" class="widthWithTwoWithXing" v-model="ruleForm.planWeight" auto-complete="off" style="width:295px;margin-right: 15px;">
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
					<el-form-item>
						<el-input maxlength="7" class="widthWithTwoWithXing" v-model="ruleForm.planVolume" auto-complete="off" style="width:295px;margin-right: 15px;">
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
					<el-form-item>
						<el-input maxlength="12" class="widthWithTwoWithXing" v-model="ruleForm.planChargeWeight" auto-complete="off" style="width:295px;">
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
            <el-input v-model="ruleForm.containerList" auto-complete="off" style="width:1253px;margin-right: 15px;"
                      readOnly>
              <template slot="prepend">
                <span>集装箱量</span>
              </template>
              <el-button slot="append" disabled icon="el-icon-edit"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item>
            <el-input class="showWordLimit" v-model="ruleForm.orderRemark" auto-complete="off" style="width:1253px;"
                      show-word-limit maxlength="300">
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
		</el-form>
	</div>
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
        workgroups: [],
				useroptions: [],
				packageTypes: [],
				goodsTypes: [],
				businessMethods: [],
				showFlag: false,
				ffrow: {},
				loading: false,
				vLoad: false,

				ruleForm: {
          containerList: '',
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
				}
			}
		},
		inject: ['findByPage'],
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
			view() {
				this.vLoad = true
				this.$axios.get('/sc/ioOrder/' + this.frow.orderId).then((response) => {
					if (response.data.code == 0) {
						this.ruleForm = response.data.data
					} else {
						this.openError(response.data.messageInfo)
					}
					this.vLoad = false
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
      this.$axios.get('/hrs/userWorkgroup/selectWorkgroup?businessScope=IO').then(function(response) {
          this.workgroups = response.data.data;
      }.bind(this));
			this.$axios.get('/sc/vIoCategory/业务分类').then((response) => {
				this.businessMethods = response.data.data;
			})
			this.$axios.get('/sc/vIoCategory/包装类型').then((response) => {
				this.packageTypes = response.data.data;

			})
			this.$axios.get('/sc/vIoCategory/货物类型').then((response) => {
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
	.ioOrderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.ioOrderEditPage .el-form-item__error {
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
