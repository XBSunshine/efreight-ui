<template>
	<el-dialog title="账单模板 - 查看" width="760px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="center">
			<el-row>
        <el-col class="elementWidth">
          <el-form-item label="服务编码" prop="serviceId" v-show="false">
            <el-input v-model="ruleForm.serviceId"></el-input>
          </el-form-item>
          <el-form-item label="收费项目" prop="settlementModName" :rules="[{required: true,message: '请录入收费项目',trigger: 'change'}]" label-width="110px">
            <el-input style="width: 342px" v-model="ruleForm.settlementModName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="IT编码" prop="itCode" label-width="110px">
            <el-input style="width:152px;" v-model="ruleForm.itCode" disabled></el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="客户名称" label-width="110px">
            <el-input style="width: 605px;" v-model="ruleForm.coopName" :disabled=true></el-input>
            <el-input v-model="ruleForm.coopId" v-show="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="结算周期" prop="settlementPeriod" label-width="110px">
						<el-select v-model="ruleForm.settlementPeriod" style="width: 125px;" @change="changeSettlementPeriod" disabled>
              <el-option label="按月" value="0"></el-option>
              <el-option label="按季度" value="2"></el-option>
              <el-option label="按半年" value="3"></el-option>
              <el-option label="按年" value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="计费模式" prop="settlementType" label-width="115px">
						<el-select style="width: 125px;" v-model="ruleForm.settlementType" @change="changeSettlementType" disabled>
							<el-option
			                v-for="item in typeOptions"
			                :key="item.value"
			                :label="item.label"
			                :value="item.value">
			              </el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="结算方式" prop="paymentMethod" :rules="[{required: true,message: '请选择结算方式',trigger: 'change'}]" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.paymentMethod" disabled>
              <el-option label="预付" value="预付"></el-option>
              <el-option label="到付" value="到付"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="发送账单月份" prop="settlementModBillMonth" :rules="[{required: true,message: '请录入发送账单月份',trigger: 'change'}]" label-width="110px">
            <el-input style="width: 97%" v-model="ruleForm.settlementModBillMonth" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="生效日期" label-width="150px">
            <el-date-picker style="width: 120px;" v-model="ruleForm.beginDate" type="month" value-format="yyyy-MM" placeholder="开始日期" disabled>
            </el-date-picker>
            <span>-</span>
            <el-date-picker style="width: 120px;" v-model="ruleForm.endDate" type="month" value-format="yyyy-MM" placeholder="结束日期" disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label-width="110px" v-if="settlementTypeShow" prop="unitPrice" label="单价" :rules="[{required: true,message: '请录入单价',trigger: 'change'}]">
						<el-input style="width: 125px;" v-model="ruleForm.unitPrice" @input="formatToFloat('unitPrice')" disabled></el-input>
					</el-form-item>
					<el-form-item v-else label="单价" prop="unitPrice" label-width="110px">
						<el-input style="width: 125px;" v-model="ruleForm.unitPrice" @input="formatToFloat('unitPrice')" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item v-show="settlementTypeShow" prop="receiveCharge" label="应收金额" label-width="115px">
						<el-input style="width: 125px;" v-model="ruleForm.receiveCharge" @input="formatToFloat('receiveCharge')" disabled></el-input>
					</el-form-item>
					<el-form-item label-width="115px" v-if="!settlementTypeShow" prop="receiveCharge" label="应收金额" :rules="[{
						required: true,
						message: '请录入应收金额',
						trigger: 'change'
						}]">
						<el-input style="width: 125px;" v-model="ruleForm.receiveCharge" @input="formatToFloat('receiveCharge')" disabled></el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="115px" v-if="settlementTypeShow" label="包量金额" prop="minCharge" :rules="[{
						required: true,
						message: '请录入包量金额',
						trigger: 'change'
					}]">
            <el-input style="width: 125px;" v-model="ruleForm.minCharge" @input="formatToFloat('minCharge')" disabled></el-input>
          </el-form-item>
          <el-form-item v-else label="包量金额" prop="minCharge" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.minCharge" @input="formatToFloat('minCharge')" disabled></el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item v-show="settlementTypeShow" label="基础数量" label-width="110px">
            <el-input style="width: 125px;" v-model="ruleForm.baseQuantity" @input="formatToFloat('baseQuantity')" disabled></el-input>
          </el-form-item>
          <el-form-item label-width="110px" v-if="!settlementTypeShow" prop="baseQuantity" label="基础数量">
            <el-input style="width: 125px;" v-model="ruleForm.baseQuantity" @input="formatToFloat('baseQuantity')" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item v-if="settlementTypeShow" prop="unitPriceExcessive" label="单价(超量)" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.unitPriceExcessive" @input="formatToFloat('unitPriceExcessive')" disabled></el-input>
          </el-form-item>
          <el-form-item v-else label="单价(超量)" prop="unitPriceExcessive" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.unitPriceExcessive" @input="formatToFloat('unitPriceExcessive')" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="115px" v-if="settlementTypeShow" label="最大金额" prop="maxCharge" :rules="[{
						required: true,
						message: '请录入最大金额',
						trigger: 'change'
					}]">
            <el-input style="width: 125px;" v-model="ruleForm.maxCharge" @input="formatToFloat('maxCharge')" disabled></el-input>
          </el-form-item>
          <el-form-item v-else label="最大金额" prop="maxCharge" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.maxCharge" @input="formatToFloat('maxCharge')" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="口岸" prop="departureStation" label-width="110px">
            <el-input style="width: 125px" v-model="ruleForm.departureStation" @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="进出港类型" prop="arrivalDeparturType" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.arrivalDeparturType" disabled placeholder="">
              <el-option label="进港" value="进港"></el-option>
              <el-option label="出港" value="出港"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="航班性质" prop="aircraftClassification" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.aircraftClassification" filterable placeholder="" disabled>
              <el-option v-for="item in flightoptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="填充确认人" prop="quantityConfirmId" label-width="110px">
            <el-select style="width: 125px;" v-model="ruleForm.quantityConfirmId" filterable disabled>
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="销售确认人" prop="billConfirmId" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.billConfirmId" filterable disabled>
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="总部确认人" prop="headOfficeConfirmId" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.headOfficeConfirmId" filterable disabled>
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item label="发送明细" prop="needEmail" label-width="110px">
            <el-select v-model="ruleForm.needEmail" style="width: 125px;" disabled>
              <el-option label="是" :value='1'></el-option>
              <el-option label="否" :value='0'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item v-if="!billConfirmContactsMust" label="客户联系人" prop="billConfirmContacts" label-width="115px">
						<el-select style="width: 365px;" v-model="ruleForm.billConfirmContacts" filterable placeholder="请选择" multiple disabled>
							<el-option v-for="item in contactoptions" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.contacts_id" :disabled="item.contacts_status!='1'">
                <span style="float: left">{{ item.contacts_name }}</span>
                <span style="float: left"><</span>
                <span style="float: left">{{ item.email }}</span>
                <span style="float: left">></span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-else label="客户联系人" prop="billConfirmContacts" label-width="115px">
						<el-select style="width: 365px;" v-model="ruleForm.billConfirmContacts" filterable placeholder="请选择" multiple disabled>
							<el-option v-for="item in contactoptions" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.contacts_id" :disabled="item.contacts_status!='1'">
								<span style="float: left">{{ item.contacts_name }}</span>
                <span style="float: left"><</span>
								<span style="float: left">{{ item.email }}</span>
                <span style="float: left">></span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="协同销售人" prop="salesCollaborativeId" label-width="110px">
            <el-select style="width: 125px;" v-model="ruleForm.salesCollaborativeId" filterable placeholder="" disabled>
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="区域负责人" prop="regionalHeadId" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.regionalHeadId" filterable placeholder="" disabled>
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="首次收费月份" label-width="110px" prop="startChargeTime">
            <el-date-picker v-model="ruleForm.startChargeTime" type="month" value-format="yyyy-MM-dd" placeholder="" style="width: 125px;" disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="reviewItNeed" label-width="33px">
            <el-checkbox v-model="ruleForm.reviewItNeed" disabled>需IT审核</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="备注" prop="remark" label-width="110px">
            <el-input style="width: 605px" v-model="ruleForm.remark" type="textarea"
                      :autosize="{ minRows: 1, maxRows: 2}" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
		</el-form>
		<agreement ref="addMission" v-if="agreementVisible" :visible.sync="agreementVisible"></agreement>
    <contactVisible ref="addMission" v-if="contactVisible" :visible.sync="contactVisible" :inputName="ruleForm.coopId"></contactVisible>
    <serviceVisibleTag ref="addMission" v-if="serviceVisible" :visible.sync="serviceVisible" :frow="ffrow"></serviceVisibleTag>
	</el-dialog>
</template>
<script>
	import Agreement from './prm_coop_agreement_settlement_agreement'
  import contactVisible from './prm_coop_addContact'
  import serviceVisibleVue from './prm_coop_agreement_settlement_service_select'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			let floatValidator = (rule, value, callback) => {
				if(!value) {
					return callback();
				}
				let regE = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				if(!regE.test(value)) {
					callback(new Error('请输入数值,整数或小数'));
				} else {
					callback();
				}
			};
			let numberValidator = (rule, value, callback) => {
				if(!value) {
					return callback();
				}
				let regE = /^[0-9]*[1-9][0-9]*$/g;
				if(!regE.test(value)) {
					callback(new Error('请输入正整数'));
				} else {
					callback();
				}
			};

			return {
				ruleForm: {
					coopId: '',
					coopName: '',
					settlementPeriod: '',
					settlementType: '',
					unitPrice: '',
					receiveCharge: '',
					quantityConfirmDays: '',
					quantityConfirmId: '',
					minCharge: '',
					billConfirmDays: '',
					billConfirmId: '',
					billConfirmContacts: '',
					needEmail: '',
					maxCharge: '',
          settlementModName: '',
          paymentMethod: '',
          beginDate: '',
          endDate: '',
          settlementModBillMonth: '',
          headOfficeConfirmId: '',
          unitPriceExcessive: '',
          baseQuantity: '',
          departureStation: '',
          arrivalStation: '',
          serviceId: '',
          remark: '',
          arrivalDeparturType: '',
          itCode: '',
          salesCollaborativeId: '',
          regionalHeadId: '',
          reviewItNeed: '',
          startChargeTime: '',
				},
				rules: {
          settlementModName: [{
              required: true,
              trigger: 'change'
          },
          {
              min: 1,
              max: 20,
              message: '长度不超过 20',
              trigger: ['blur', 'change']
          }],
					settlementPeriod: [{
						required: true,
						message: '请选择结算周期',
						trigger: 'change'
					}],
					settlementType: [{
						required: true,
						message: '请选择计费模式',
						trigger: 'change'
					}],
					quantityConfirmDays: [{
							required: true,
							message: '请录入数据填充工作日',
							trigger: 'change'
						},
						{
							validator: numberValidator,
							trigger: 'change'
						}
					],
					quantityConfirmId: [{
							required: true,
							message: '请录入数据填充责任人',
							trigger: 'change'
						},
						{
							validator: numberValidator,
							trigger: 'change'
						}
					],
					billConfirmDays: [{
							required: true,
							message: '请录入账单确认工作日',
							trigger: 'change'
						},
						{
							validator: numberValidator,
							trigger: 'change'
						}
					],
					billConfirmId: [{
							required: true,
							message: '请录入账单确认责任人',
							trigger: 'change'
						},
						{
							validator: numberValidator,
							trigger: 'change'
						}
					],
					needEmail: [{
						required: true,
						message: '请选择是否发送明细',
						trigger: 'change'
					}],
          paymentMethod: [{
              required: true,
              message: '请选择结算方式',
              trigger: 'change'
          }],
          beginDate: [{
              required: true,
              message: '请选择开始日期',
              trigger: 'change'
          }],
          departureStation: [{
                  min: 0,
                  max: 20,
                  message: '始发港长度不超过 20',
                  trigger: ['blur', 'change']
          }],
          arrivalStation: [{
              min: 0,
              max: 20,
              message: '目的港长度不超过 20',
              trigger: ['blur', 'change']
          }],
          remark: [
              {
                  min: 0,
                  max: 500,
                  message: '备注长度不超过 500',
                  trigger: ['blur', 'change']
              }],
				},
				typeOptions:[
					{"label":"按量计费","value":'1'},
					{"label":"包月计费","value":'0'}
				],
				show: false,
				useroptions: [],
				contactoptions: [],
        flightoptions: [],
				settlementTypeShow: true,
				agreementVisible: false,
        contactVisible:false,
				ifChooseAgreement: false,
				billConfirmContactsMust: false,
        settlementModBillMonthFlag: false,
        disabledFlag1: false,
          serviceVisible: false,
			}
		},
		provide() {
			return {
				callback: this.callback,
        callback1: this.callback1,
          setServiceValue: this.setServiceValue
			}
		},
		components: {
			'agreement': Agreement,
      'contactVisible': contactVisible,
        'serviceVisibleTag': serviceVisibleVue
		},
		inject: ['findCoopAgreementSettlementListCriteria'],
		created() {
			this.$axios.get('/hrs/dept/selectUser')
				.then(function(response) {
					this.useroptions = response.data.data;
				}.bind(this));
			if(this.frow.coopId) {
				this.billConfirmContactsMust = true
				this.queryContactsList(this.frow.coopId)
			}
      //查询航班性质
      this.$axios.get2('/prm/coopAgreementSettlement/selectFlightOptions')
          .then(function(response) {
              this.flightoptions = response.data.data;
          }.bind(this));

			this.$axios.post('/prm/coopAgreementSettlement/findCoopAgreementSettlementCriteria', {
				settlementId: this.frow.settlementId
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(response) {
				if(response.status == '200') {
					this.ruleForm.settlementId = response.data.settlementId
					this.ruleForm.settlementModName = response.data.settlementModName
					this.ruleForm.coopId = response.data.coopId
					this.ruleForm.coopName = this.frow.coopName
					this.ruleForm.settlementPeriod = response.data.settlementPeriod
					if (this.ruleForm.settlementPeriod=='1') {
						this.typeOptions=[
							{"label":"按量计费","value":'1'},
							{"label":"包年计费","value":'2'}
						]
					}else if(this.ruleForm.settlementPeriod=='0'){
              this.typeOptions=[
                  {"label":"按量计费","value":'1'},
                  {"label":"包月计费","value":'0'}
              ]
              this.settlementModBillMonthFlag=true;
          }else if(this.ruleForm.settlementPeriod=='2'){
              this.typeOptions=[
                  {"label":"按量计费","value":'1'},
                  {"label":"包季度计费","value":'4'}
              ]
					}else if(this.ruleForm.settlementPeriod=='3'){
              this.typeOptions=[
                  {"label":"按量计费","value":'1'},
                  {"label":"包半年计费","value":'3'}
              ]
          }
					this.ruleForm.settlementType = response.data.settlementType
					this.ruleForm.unitPrice = response.data.unitPrice
					this.ruleForm.receiveCharge = response.data.receiveCharge
					this.ruleForm.quantityConfirmDays = response.data.quantityConfirmDays
					this.ruleForm.quantityConfirmId = response.data.quantityConfirmId
					this.ruleForm.minCharge = response.data.minCharge
					this.ruleForm.billConfirmDays = response.data.billConfirmDays
					this.ruleForm.billConfirmId = response.data.billConfirmId
					this.ruleForm.billConfirmContacts = response.data.billConfirmContacts
					this.ruleForm.needEmail = response.data.needEmail
					this.ruleForm.maxCharge = response.data.maxCharge
          this.ruleForm.paymentMethod = response.data.paymentMethod
          this.ruleForm.beginDate = response.data.beginDate
          this.ruleForm.endDate = response.data.endDate
          this.ruleForm.settlementModBillMonth = response.data.settlementModBillMonth
          this.ruleForm.headOfficeConfirmId = response.data.headOfficeConfirmId
          this.ruleForm.unitPriceExcessive = response.data.unitPriceExcessive
          this.ruleForm.baseQuantity = response.data.baseQuantity
          this.ruleForm.departureStation = response.data.departureStation
          this.ruleForm.aircraftClassification = response.data.aircraftClassification
          this.ruleForm.serviceId = response.data.serviceId
          this.ruleForm.remark = response.data.remark
          this.ruleForm.arrivalDeparturType = response.data.arrivalDeparturType
          this.ruleForm.itCode = response.data.itCode
          this.ruleForm.salesCollaborativeId = response.data.salesCollaborativeId
          this.ruleForm.regionalHeadId = response.data.regionalHeadId
          this.ruleForm.startChargeTime = response.data.startChargeTime
          if(response.data.reviewItNeed1 != null && response.data.reviewItNeed1 == 1){
              this.ruleForm.reviewItNeed = true
          }else{
              this.ruleForm.reviewItNeed = false
          }
					this.changeSettlementType()
				}
			}.bind(this)).catch(function(error) {
				console.log(error)
			});
		},
		methods: {
        showservice(){
            this.serviceVisible = true;
        },
        setServiceValue(rrow){
            this.ruleForm.settlementModName=rrow.serviceName;
            this.ruleForm.serviceId=rrow.serviceId;
        },
			modifyCoopAgreementSettlement(formName) {
        //验证发送账单月份是否符合规则
        if (this.ruleForm.settlementPeriod=='1') {//结算周期按年

            let month=this.ruleForm.settlementModBillMonth;
            let regE =/^(?:1[0-2]|[1-9])$/;
            if(!regE.test(month)) {
                alert("发送账单月份只能为1-12的数字");
                return;
            }
        }else if(this.ruleForm.settlementPeriod=='2'){//结算周期按季度

            let regE= /^[^,](([1-9,])(?!\2))+[^,]$/;
            let month=this.ruleForm.settlementModBillMonth;
            if(!regE.test(month)) {
                alert("只允许录入整数和英文逗号，且不能以逗号开头和结尾，逗号不能连续");
                return;
            }
            let months=month.split(",");
            if(months.length!=4){
                alert("发送账单月份只能录入4组数字");
                return;
            }
            if(months[0]==months[1] || months[0]==months[2] || months[0]==months[3] || months[0]==months[4] || months[1]==months[2] || months[1]==months[3] || months[2]==months[3]){
                alert("录入发送账单月份不能重复");
                return;
            }
        }else if(this.ruleForm.settlementPeriod=='3'){//结算周期按半年
            let regE= /^[^,](([1-9,])(?!\2))+[^,]$/;
            let month=this.ruleForm.settlementModBillMonth;
            if(!regE.test(month)) {
                alert("只允许录入整数和英文逗号，且不能以逗号开头和结尾，逗号不能连续");
                return;
            }
            let months=month.split(",");
            if(months.length!=2){
                alert("发送账单月份只能录入2组数字");
                return;
            }
            if(months[0]==months[1]){
                alert("录入发送账单月份不能重复");
                return;
            }
        }
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$axios.post('/prm/coopAgreementSettlement/modifyCoopAgreementSettlement', {
							settlementId: this.ruleForm.settlementId,
							settlementModName: this.ruleForm.settlementModName,
							coopId: this.ruleForm.coopId,
							settlementPeriod: this.ruleForm.settlementPeriod,
							settlementType: this.ruleForm.settlementType,
							unitPrice: this.ruleForm.unitPrice,
							receiveCharge: this.ruleForm.receiveCharge,
							quantityConfirmDays: this.ruleForm.quantityConfirmDays,
							quantityConfirmId: this.ruleForm.quantityConfirmId,
							minCharge: this.ruleForm.minCharge,
							billConfirmDays: this.ruleForm.billConfirmDays,
							billConfirmId: this.ruleForm.billConfirmId,
							billConfirmContacts: this.ruleForm.billConfirmContacts,
							needEmail: this.ruleForm.needEmail,
							maxCharge: this.ruleForm.maxCharge,
              paymentMethod: this.ruleForm.paymentMethod,
              beginDate: this.ruleForm.beginDate,
              endDate: this.ruleForm.endDate,
              settlementModBillMonth: this.ruleForm.settlementModBillMonth,
              headOfficeConfirmId: this.ruleForm.headOfficeConfirmId,
              unitPriceExcessive: this.ruleForm.unitPriceExcessive,
              baseQuantity: this.ruleForm.baseQuantity,
              departureStation: this.ruleForm.departureStation,
              arrivalStation: this.ruleForm.arrivalStation,
              serviceId: this.ruleForm.serviceId,
              remark: this.ruleForm.remark,
						}, {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then((response) => {
							if(response.status == '200') {
								this.$notify({
									title: '成功',
									message: '修改成功,1s后跳回列表...',
									type: 'success'
								});
								setTimeout(() => {
									this.findCoopAgreementSettlementListCriteria()
									this.handleClose()
								}, 1500);
							}
						}).catch((error) => {
							this.$notify.error({
								title: '错误',
								message: error.response.data.messageInfo
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			formatToFloat(item) {
				if(item == 'unitPrice') {
					this.ruleForm.unitPrice = this.ruleForm.unitPrice.replace(/[^0123456789.]/g, "");
					var t = this.ruleForm.unitPrice.split('.');
					if(t.length > 1) {
						this.ruleForm.unitPrice = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'receiveCharge') {
					this.ruleForm.receiveCharge = this.ruleForm.receiveCharge.replace(/[^0123456789.]/g, "");
					var t = this.ruleForm.receiveCharge.split('.');
					if(t.length > 1) {
						this.ruleForm.receiveCharge = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'minCharge') {
					this.ruleForm.minCharge = this.ruleForm.minCharge.replace(/[^0123456789.]/g, "");
					var t = this.ruleForm.minCharge.split('.');
					if(t.length > 1) {
						this.ruleForm.minCharge = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'maxCharge') {
					this.ruleForm.maxCharge = this.ruleForm.maxCharge.replace(/[^0123456789.]/g, "");
					var t = this.ruleForm.maxCharge.split('.');
					if(t.length > 1) {
						this.ruleForm.maxCharge = t[0] + "." + t[1].substr(0, 2);
					}
				}
			},
			changeSettlementType() {
				this.$refs['ruleForm'].clearValidate();
				if(this.ruleForm.settlementType == '1') {
          this.ruleForm.receiveCharge = '';
          this.disabledFlag1 = true;
					this.settlementTypeShow = true
				} else {
          this.ruleForm.unitPrice = '';
          this.ruleForm.minCharge = '';
          this.ruleForm.maxCharge = '';
          this.ruleForm.unitPriceExcessive = '';
          this.ruleForm.baseQuantity = '';
          this.disabledFlag = true;
					this.settlementTypeShow = false
				}
			},
			changeSettlementPeriod(){
				if (this.ruleForm.settlementPeriod=='1') {//结算周期按年
					this.typeOptions=[
						{"label":"按量计费","value":'1'},
						{"label":"包年计费","value":'2'}
					]
					this.ruleForm.settlementType='';
            this.settlementModBillMonthFlag=false;
            this.ruleForm.settlementModBillMonth='1';
				}else if(this.ruleForm.settlementPeriod=='0'){//结算周期按月
					this.typeOptions=[
						{"label":"按量计费","value":'1'},
						{"label":"包月计费","value":'0'}
					]
					this.ruleForm.settlementType='';
            this.settlementModBillMonthFlag=true;
            this.ruleForm.settlementModBillMonth='1,2,3,4,5,6,7,8,9,10,11,12';
				}else if(this.ruleForm.settlementPeriod=='2'){//结算周期按季度
            this.typeOptions=[
                {"label":"按量计费","value":'1'},
                {"label":"包季度计费","value":'4'}
            ]
            this.ruleForm.settlementType='';
            this.settlementModBillMonthFlag=false;
            this.ruleForm.settlementModBillMonth='1,4,7,10';
        }else if(this.ruleForm.settlementPeriod=='3'){//结算周期按半年
            this.typeOptions=[
                {"label":"按量计费","value":'1'},
                {"label":"包半年计费","value":'3'}
            ]
            this.ruleForm.settlementType='';
            this.settlementModBillMonthFlag=false;
            this.ruleForm.settlementModBillMonth='1,7';
        }
				this.changeSettlementType();
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			//查询联系人
			queryContactsList(coopId) {
				let params = {
					coopId: coopId
				}
				this.$axios.get2('/prm/coop/queryContactsIsValid',
						params)
					.then(function(response) {
						this.contactoptions = response.data.data;
					}.bind(this));
			},
			callback(coopId, coopName) {
				this.ruleForm.coopId = coopId
				this.ruleForm.coopName = coopName
				this.billConfirmContactsMust = true
				this.ruleForm.billConfirmContacts = ''
				this.queryContactsList(coopId)
			},
      callback1(coopId,contacts_id) {
          this.queryContactsList(coopId)
          var filelists = [];
          if(this.ruleForm.billConfirmContacts){
              filelists=this.ruleForm.billConfirmContacts;
          }
          filelists.push(contacts_id);
          this.ruleForm.billConfirmContacts=filelists;
      },
			cancelVisible() {
				this.agreementVisible = false;
        this.contactVisible = false;
			},
			chooseAgreement() {
				this.agreementVisible = true;
			},
      addContactAgreement() {
          this.contactVisible = true;
      },
      openError(info) {
          this.$notify({
              title: '',
              message: info,
              type: 'warning',
              position: 'bottom-right'
          });
      },
		}
	}
</script>
