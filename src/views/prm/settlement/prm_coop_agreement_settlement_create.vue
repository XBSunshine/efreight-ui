<template>
	<el-dialog title="账单模板 - 新增" width="760px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form label-position="center" ref="ruleForm" :model="ruleForm" :rules="rules">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label="服务编码" prop="serviceId" v-show="false">
            <el-input v-model="ruleForm.serviceId"></el-input>
          </el-form-item>
					<el-form-item label="收费项目" prop="settlementModName" :rules="[{required: true,message: '请选择收费项目',trigger: 'change'}]" label-width="110px">
						<el-input style="width: 265px;" v-model="ruleForm.settlementModName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
					   <el-button type="primary" size="small" @click="showservice">选择</el-button>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="IT编码" prop="itCode" label-width="110px">
            <el-input style="width:152px;" v-model="ruleForm.itCode" @input="ruleForm.itCode=strTrim(ruleForm.itCode)"></el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="客户Id" prop="coopId" v-show="false">
            <el-input v-model="ruleForm.coopId"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="coopName" label-width="110px">
            <el-input style="width:605px;" v-model="ruleForm.coopName" :disabled=true></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="结算周期" prop="settlementPeriod" label-width="110px">
						<el-select style="width: 125px;" v-model="ruleForm.settlementPeriod" @change="changeSettlementPeriod">
              <el-option label="按月" :value="0"></el-option>
              <el-option label="按季度" :value="2"></el-option>
              <el-option label="按半年" :value="3"></el-option>
              <el-option label="按年" :value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="计费模式" prop="settlementType" label-width="115px">
						<el-select style="width: 125px;" v-model="ruleForm.settlementType" @change="changeSettlementType">
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
            <el-select style="width: 125px;" v-model="ruleForm.paymentMethod">
              <el-option label="预付" value="预付"></el-option>
              <el-option label="到付" value="到付"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="发送账单月份" prop="settlementModBillMonth" :rules="[{required: true,message: '请录入发送账单月份',trigger: 'change'}]" label-width="110px">
            <el-input style="width: 97%" v-model="ruleForm.settlementModBillMonth" placeholder="请输入发送账单月份" :disabled="settlementModBillMonthFlag"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="生效日期" label-width="150px">
            <el-date-picker style="width: 120px;" v-model="ruleForm.beginDate" type="month" value-format="yyyy-MM" placeholder="开始日期">
            </el-date-picker>
            <span>-</span>
            <el-date-picker style="width: 120px;" v-model="ruleForm.endDate" type="month" value-format="yyyy-MM" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="110px" v-if="settlementTypeShow" prop="unitPrice" label="单价" :rules="[{required: true,message: '请录入单价',trigger: 'change'}]">
            <el-input style="width: 125px;" v-model="ruleForm.unitPrice" @input="formatToFloat('unitPrice')" :disabled="disabledFlag2"></el-input>
          </el-form-item>
          <el-form-item v-else label="单价" prop="unitPrice" label-width="110px">
            <el-input style="width: 125px;" v-model="ruleForm.unitPrice" @input="formatToFloat('unitPrice')" :disabled="disabledFlag2"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item v-show="settlementTypeShow" label="应收金额" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.receiveCharge" @input="formatToFloat('receiveCharge')" :disabled="disabledFlag1"></el-input>
          </el-form-item>
          <el-form-item label-width="115px" v-if="!settlementTypeShow" prop="receiveCharge" label="应收金额" :rules="[{
						required: true,
						message: '请录入应收金额',
						trigger: 'change'
						}]">
            <el-input style="width: 125px;" v-model="ruleForm.receiveCharge" @input="formatToFloat('receiveCharge')"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="115px" v-if="settlementTypeShow" label="包量金额" prop="minCharge" :rules="[{
						required: true,
						message: '请录入包量金额',
						trigger: 'change'
					}]">
            <el-input style="width: 125px;" v-model="ruleForm.minCharge" @input="formatToFloat('minCharge')" @change="changeMinCharge"></el-input>
          </el-form-item>
          <el-form-item v-else label="包量金额" prop="minCharge" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.minCharge" @input="formatToFloat('minCharge')" :disabled="disabledFlag" @change="changeMinCharge"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item v-show="settlementTypeShow" label="基础数量" label-width="110px">
            <el-input style="width: 125px;" v-model="ruleForm.baseQuantity"></el-input>
          </el-form-item>
          <el-form-item v-if="!settlementTypeShow" prop="baseQuantity" label="基础数量" label-width="110px">
            <el-input style="width: 125px;" v-model="ruleForm.baseQuantity" :disabled="disabledFlag"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item v-if="settlementTypeShow" prop="unitPriceExcessive" label="单价(超量)" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.unitPriceExcessive" @input="formatToFloat('unitPriceExcessive')"></el-input>
          </el-form-item>
          <el-form-item v-else label="单价(超量)" prop="unitPriceExcessive" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.unitPriceExcessive" @input="formatToFloat('unitPriceExcessive')" :disabled="disabledFlag"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="115px" v-if="settlementTypeShow" label="最大金额" prop="maxCharge" :rules="[{
						required: true,
						message: '请录入最大金额',
						trigger: 'change'
					}]">
            <el-input style="width: 125px;" v-model="ruleForm.maxCharge" @input="formatToFloat('maxCharge')"></el-input>
          </el-form-item>
          <el-form-item v-else label="最大金额" prop="maxCharge" label-width="115px">
            <el-input style="width: 125px;" v-model="ruleForm.maxCharge" @input="formatToFloat('maxCharge')" :disabled="disabledFlag"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="口岸" prop="departureStation" label-width="110px">
            <el-input style="width: 125px" v-model="ruleForm.departureStation" @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="进出港类型" prop="arrivalDeparturType" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.arrivalDeparturType" clearable>
              <el-option label="进港" value="进港"></el-option>
              <el-option label="出港" value="出港"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="航班性质" prop="aircraftClassification" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.aircraftClassification" filterable placeholder="请选择" clearable>
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
						<el-select style="width: 125px;" v-model="ruleForm.quantityConfirmId" filterable placeholder="请选择">
							<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
								<span style="float: left">{{ item.label }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="销售确认人" prop="billConfirmId" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.billConfirmId" filterable placeholder="请选择">
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="总部确认人" prop="headOfficeConfirmId" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.headOfficeConfirmId" filterable placeholder="请选择">
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
            <el-select style="width: 125px;" v-model="ruleForm.needEmail">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item v-if="!billConfirmContactsMust" label="客户联系人" prop="billConfirmContacts" label-width="115px">
						<el-select style="width: 290px;" v-model="ruleForm.billConfirmContacts" filterable placeholder="请选择" multiple>
							<el-option v-for="item in contactoptions" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.contacts_id" :disabled="item.contacts_status!='1'">
                <span style="float: left">{{ item.contacts_name }}</span>
                <span style="float: left"><</span>
                <span style="float: left">{{ item.email }}</span>
                <span style="float: left">></span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户联系人" prop="billConfirmContacts" label-width="115px">
						<el-select style="width: 290px;" v-model="ruleForm.billConfirmContacts" filterable placeholder="请选择" multiple>
							<el-option v-for="item in contactoptions" :key="item.contacts_id" :label="`${item.contacts_name}<${item.email}>`" :value="item.contacts_id" :disabled="item.contacts_status!='1'">
                <span style="float: left">{{ item.contacts_name }}</span>
                <span style="float: left"><</span>
                <span style="float: left">{{ item.email }}</span>
                <span style="float: left">></span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
             <el-button type="primary" size="small" @click="addContactAgreement">新增</el-button>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="协同销售人" prop="salesCollaborativeId" label-width="110px">
            <el-select style="width: 125px;" v-model="ruleForm.salesCollaborativeId" filterable placeholder="请选择" clearable>
              <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="区域负责人" prop="regionalHeadId" label-width="115px">
            <el-select style="width: 125px;" v-model="ruleForm.regionalHeadId" filterable placeholder="请选择" clearable>
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
            <el-date-picker v-model="ruleForm.startChargeTime" type="month" value-format="yyyy-MM-dd" placeholder="选择月份" style="width: 125px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="reviewItNeed" label-width="33px">
            <el-checkbox v-model="ruleForm.reviewItNeed">需IT审核</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="备注" prop="remark" label-width="110px">
            <el-input style="width: 605px" v-model="ruleForm.remark" type="textarea"
                      :autosize="{ minRows: 1, maxRows: 2}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
				    	<el-button :loading="loading" size="small" type="primary" @click="createCoopAgreementSettlement('ruleForm')" style="margin-right: 20px;">立即创建</el-button>
            <el-button size="small" type="primary" @click="resetForm('ruleForm')" style="margin-right: 20px;">重置</el-button>
          </el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<agreement ref="addMission" v-if="agreementVisible" :visible.sync="agreementVisible" :frow="ffrow"></agreement>
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
          settlementId: '',
					coopId: '',
					coopName: '',
					settlementPeriod: 0,
					settlementType: '1',
					unitPrice: '',
					receiveCharge: '',
					quantityConfirmDays: '',
					quantityConfirmId: '',
					minCharge: 0,
					billConfirmDays: '',
					billConfirmId: '',
					billConfirmContacts: '',
					needEmail: "1",
					maxCharge: 0,
          settlementModName: '',
          paymentMethod: '到付',
          beginDate: '',
          endDate: '',
          settlementModBillMonth: '',
          headOfficeConfirmId: '',
          unitPriceExcessive: '',
          baseQuantity: '',
          departureStation: '',
          aircraftClassification: '',
          serviceId: '',
          remark: '',
          arrivalDeparturType: '',
          itCode: '',
          salesCollaborativeId: '',
          regionalHeadId: '',
          reviewItNeed: false,
          startChargeTime: '',
				},
        disabledFlag:false,
        disabledFlag2: false,
        disabledFlag1:false,
        settlementModBillMonthFlag:true,
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
					quantityConfirmId: [{
							required: true,
							message: '请录入填充确认人',
							trigger: 'change'
						},
						{
							validator: numberValidator,
							trigger: 'change'
						}
					],
					billConfirmId: [{
							required: true,
							message: '请录入销售确认人',
							trigger: 'change'
						},
						{
							validator: numberValidator,
							trigger: 'change'
						}
					],
            headOfficeConfirmId: [{
                required: true,
                message: '请录入总部确认人',
                trigger: 'change'
            },
                {
                    validator: numberValidator,
                    trigger: 'change'
                }
            ],
					billConfirmContacts: [{
							required: true,
							message: '请录入客户对账联系人',
							trigger: 'blur'
						}
					],
					needEmail: [{
						required: true,
						message: '请选择是否发送明细',
						trigger: 'change'
					}],
          paymentMethod: [{
              required: true,
              message: '请选择是结算方式',
              trigger: 'change'
          }],
          beginDate: [{
              required: true,
              message: '请选择开始日期',
              trigger: 'change'
          }],
          settlementModBillMonth: [{
              required: true,
              message: '请输入发送账单月份',
              trigger: 'change'
          }],
          departureStation: [
              {
                  min: 0,
                  max: 20,
                  message: '口岸长度不超过 20',
                  trigger: ['blur', 'change']
              }],
          /*arrivalStation: [
              {
                  min: 0,
                  max: 20,
                  message: '目的港长度不超过 20',
                  trigger: ['blur', 'change']
              }],*/
            remark: [
              {
                  min: 0,
                  max: 500,
                  message: '备注长度不超过 500',
                  trigger: ['blur', 'change']
              }],
				},
				isShow: false,
				selectSingle: {
					categoryId: "",
					categoryName: ""
				},
				typeOptions:[
					{"label":"按量计费","value":'1'},
					{"label":"包月计费","value":'0'}
				],
				selectList: [],
				useroptions: [],
				contactoptions: [],
        flightoptions: [],
				settlementTypeShow: true,
				agreementVisible: false,
        contactVisible:false,
				loading: false,
				billConfirmContactsMust: false,
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
      this.ruleForm.coopId=this.frow.coopId;
        if(this.frow.coopId) {
            this.billConfirmContactsMust = true
            this.queryContactsList(this.frow.coopId)
        }
      this.ruleForm.coopName=this.frow.coopName;
      this.ruleForm.itCode=this.frow.coopCode;
      this.ruleForm.settlementId=this.frow.settlementId;
			this.$axios.get('/hrs/dept/selectUser')
				.then(function(response) {
					this.useroptions = response.data.data;
            let userId = window.localStorage.getItem('userId');
            if (userId != null && userId !== '') {
                this.ruleForm.salesCollaborativeId = parseInt(userId)
                this.ruleForm.regionalHeadId = parseInt(userId)
            }
				}.bind(this));
      this.ruleForm.receiveCharge = '';
      this.disabledFlag1 = true;
      //设置生效日期的开始日期
      /*let date = new Date(new Date().setDate(1)-86400000);
      let month = date.getMonth()+3;
      month = month<10 ? "0"+month : ""+month;
      this.ruleForm.beginDate=date.getFullYear() + "-" + month;*/
      //发送月份默认为=1,2,3,4,5,6,7,8,9,10,11,12
      this.ruleForm.settlementModBillMonth='1,2,3,4,5,6,7,8,9,10,11,12';
      //查询航班性质
      this.$axios.get2('/prm/coopAgreementSettlement/selectFlightOptions')
          .then(function(response) {
              this.flightoptions = response.data.data;
          }.bind(this));

		},
		methods: {
      showservice(){
          this.serviceVisible = true;
      },
      setServiceValue(rrow){
          this.ruleForm.settlementModName=rrow.serviceName;
          this.ruleForm.serviceId=rrow.serviceId;
      },
			createCoopAgreementSettlement(formName) {
        //计费模式=按量 AND 最小金额 >0,基础数量 必填（且大于0），单价(超量) 必填 （且大于0）
        if(this.ruleForm.settlementType == '1' && parseFloat(this.ruleForm.minCharge) > 0){
            if(this.ruleForm.baseQuantity =='' || parseFloat(this.ruleForm.baseQuantity) <=0){
                this.openError("基础数量必填且大于0");
                return;
            }
            if(this.ruleForm.unitPriceExcessive =='' || parseFloat(this.ruleForm.unitPriceExcessive) <=0){
                this.openError("单价(超量)必填且大于0");
                return;
            }
        }
        //如果填写了基础数量则只能为正整数
        if (this.ruleForm.baseQuantity) {
            if(this.ruleForm.baseQuantity!='0'){
                let regE = /^[0-9]*[1-9][0-9]*$/g;
                if(!regE.test(this.ruleForm.baseQuantity)) {
                    this.openError("基础数量只能为正整数");
                    return;
                }
            }
        }
        //验证发送账单月份是否符合规则
        if (this.ruleForm.settlementPeriod=='1') {//结算周期按年

            let month=this.ruleForm.settlementModBillMonth;
            let regE =/^(?:1[0-2]|[1-9])$/;
            if(!regE.test(month)) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
        }else if(this.ruleForm.settlementPeriod=='2'){//结算周期按季度

            //let regE= /^[^,](([1-9,])(?!\2))+[^,]$/;
            let month=this.ruleForm.settlementModBillMonth;
            /*if(!regE.test(month)) {
                alert("只允许录入整数和英文逗号，且不能以逗号开头和结尾，逗号不能连续");
                return;
            }*/
            if(month.indexOf(',,') > -1){
                this.openError("逗号不能连续");
                return;
            }
            if(month.substring(0,1) == ','){
                this.openError("发送账单月份不能以逗号开头");
                return;
            }
            if(month.substring(month.length-1,month.length) == ','){
                this.openError("发送账单月份不能以逗号结尾");
                return;
            }
            let months=month.split(",");
            if(months.length!=4){
                this.openError("发送账单月份只能录入4组数字");
                return;
            }
            if(months[0]==months[1] || months[0]==months[2] || months[0]==months[3] || months[0]==months[4] || months[1]==months[2] || months[1]==months[3] || months[2]==months[3]){
                this.openError("录入发送账单月份不能重复");
                return;
            }
            let regE =/^(?:1[0-2]|[1-9])$/;
            if(!regE.test(months[0])) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
            if(!regE.test(months[1])) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
            if(!regE.test(months[2])) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
            if(!regE.test(months[3])) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
        }else if(this.ruleForm.settlementPeriod=='3'){//结算周期按半年
            //let regE= /^[^,](([1-9,])(?!\2))+[^,]$/;
            let month=this.ruleForm.settlementModBillMonth;
            /*if(!regE.test(month)) {
                alert("只允许录入整数和英文逗号，且不能以逗号开头和结尾，逗号不能连续");
                return;
            }*/
            if(month.indexOf(',,') > -1){
                this.openError("逗号不能连续");
                return;
            }
            if(month.substring(0,1) == ','){
                this.openError("发送账单月份不能以逗号开头");
                return;
            }
            if(month.substring(month.length-1,month.length) == ','){
                this.openError("发送账单月份不能以逗号结尾");
                return;
            }
            let months=month.split(",");
            if(months.length!=2){
                this.openError("发送账单月份只能录入2组数字");
                return;
            }
            if(months[0]==months[1]){
                this.openError("录入发送账单月份不能重复");
                return;
            }
            let regE =/^(?:1[0-2]|[1-9])$/;
            if(!regE.test(months[0])) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
            if(!regE.test(months[1])) {
                this.openError("发送账单月份只能为1-12的数字");
                return;
            }
        }
				this.$refs[formName].validate((valid) => {
					if(valid) {
              let currthis = this
              currthis.$confirm('是否继续新增？', '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'warning',
                  center: true
              }).then(() => {
                  currthis.$axios.post('/prm/coopAgreementSettlement/createCoopAgreementSettlement', {
                      coopId: this.ruleForm.coopId,
                      settlementPeriod: this.ruleForm.settlementPeriod,
                      settlementType: this.ruleForm.settlementType,
                      unitPrice: this.ruleForm.unitPrice,
                      receiveCharge: this.ruleForm.receiveCharge,
                      quantityConfirmDays: 0,
                      quantityConfirmId: this.ruleForm.quantityConfirmId,
                      minCharge: this.ruleForm.minCharge,
                      billConfirmDays: 0,
                      billConfirmId: this.ruleForm.billConfirmId,
                      billConfirmContacts: this.ruleForm.billConfirmContacts,
                      needEmail: this.ruleForm.needEmail,
                      maxCharge: this.ruleForm.maxCharge,
                      settlementModName: this.ruleForm.settlementModName,
                      paymentMethod: this.ruleForm.paymentMethod,
                      beginDate: this.ruleForm.beginDate,
                      endDate: this.ruleForm.endDate,
                      settlementModBillMonth: this.ruleForm.settlementModBillMonth,
                      headOfficeConfirmId: this.ruleForm.headOfficeConfirmId,
                      unitPriceExcessive: this.ruleForm.unitPriceExcessive,
                      baseQuantity: this.ruleForm.baseQuantity,
                      settlementId1: this.ruleForm.settlementId,
                      departureStation: this.ruleForm.departureStation,
                      aircraftClassification: this.ruleForm.aircraftClassification,
                      serviceId: this.ruleForm.serviceId,
                      remark: this.ruleForm.remark,
                      arrivalDeparturType: this.ruleForm.arrivalDeparturType,
                      itCode: this.ruleForm.itCode,
                      salesCollaborativeId: this.ruleForm.salesCollaborativeId,
                      regionalHeadId: this.ruleForm.regionalHeadId,
                      reviewItNeed: this.ruleForm.reviewItNeed,
                      startChargeTime: this.ruleForm.startChargeTime,
                  }).then((response) => {
                      if(response.status == '200') {
                          this.$notify({
                              title: '成功',
                              message: '创建成功',
                              type: 'success'
                          });
                      } else {
                          currthis.$notify.error({
                              title: '错误',
                              message: response.data.messageInfo
                          });
                      }
                  }).catch((error) => {
                      currthis.$notify.error({
                          title: '错误',
                          message: error.response.data.messageInfo
                      });
                  });
              }).catch(() => {
                  this.handleClose()
                  this.$axios.post('/prm/coopAgreementSettlement/createCoopAgreementSettlement', {
                      coopId: this.ruleForm.coopId,
                      settlementPeriod: this.ruleForm.settlementPeriod,
                      settlementType: this.ruleForm.settlementType,
                      unitPrice: this.ruleForm.unitPrice,
                      receiveCharge: this.ruleForm.receiveCharge,
                      quantityConfirmDays: 0,
                      quantityConfirmId: this.ruleForm.quantityConfirmId,
                      minCharge: this.ruleForm.minCharge,
                      billConfirmDays: 0,
                      billConfirmId: this.ruleForm.billConfirmId,
                      billConfirmContacts: this.ruleForm.billConfirmContacts,
                      needEmail: this.ruleForm.needEmail,
                      maxCharge: this.ruleForm.maxCharge,
                      settlementModName: this.ruleForm.settlementModName,
                      paymentMethod: this.ruleForm.paymentMethod,
                      beginDate: this.ruleForm.beginDate,
                      endDate: this.ruleForm.endDate,
                      settlementModBillMonth: this.ruleForm.settlementModBillMonth,
                      headOfficeConfirmId: this.ruleForm.headOfficeConfirmId,
                      unitPriceExcessive: this.ruleForm.unitPriceExcessive,
                      baseQuantity: this.ruleForm.baseQuantity,
                      settlementId1: this.ruleForm.settlementId,
                      departureStation: this.ruleForm.departureStation,
                      aircraftClassification: this.ruleForm.aircraftClassification,
                      serviceId: this.ruleForm.serviceId,
                      remark: this.ruleForm.remark,
                      arrivalDeparturType: this.ruleForm.arrivalDeparturType,
                      itCode: this.ruleForm.itCode,
                      salesCollaborativeId: this.ruleForm.salesCollaborativeId,
                      regionalHeadId: this.ruleForm.regionalHeadId,
                      reviewItNeed: this.ruleForm.reviewItNeed,
                      startChargeTime: this.ruleForm.startChargeTime,
                  }).then((response) => {
                      console.log(response)
                      if(response.status == '200') {
                          this.$notify({
                              title: '成功',
                              message: '创建成功',
                              type: 'success'
                          });
                          this.loading = false
                          this.findCoopAgreementSettlementListCriteria()
                      } else {
                          this.loading = false
                      }
                  }).catch((error) => {
                      this.loading = false
                      this.$notify.error({
                          title: '错误',
                          message: error.response.data.messageInfo
                      });
                  });
              });
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.changeSettlementType();
			},
			formatToFloat(item) {
				if(item == 'unitPrice') {
					this.ruleForm.unitPrice = this.ruleForm.unitPrice.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.unitPrice.split('.');
					if(t.length > 1) {
						this.ruleForm.unitPrice = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'receiveCharge') {
					this.ruleForm.receiveCharge = this.ruleForm.receiveCharge.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.receiveCharge.split('.');
					if(t.length > 1) {
						this.ruleForm.receiveCharge = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'minCharge') {
					this.ruleForm.minCharge = this.ruleForm.minCharge.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.minCharge.split('.');
					if(t.length > 1) {
						this.ruleForm.minCharge = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'maxCharge') {
					this.ruleForm.maxCharge = this.ruleForm.maxCharge.replace(/[^0123456789.]/g, "");
					let t = this.ruleForm.maxCharge.split('.');
					if(t.length > 1) {
						this.ruleForm.maxCharge = t[0] + "." + t[1].substr(0, 2);
					}
				} else if(item == 'unitPriceExcessive') {
            this.ruleForm.unitPriceExcessive = this.ruleForm.unitPriceExcessive.replace(/[^0123456789.]/g, "");
            let t = this.ruleForm.unitPriceExcessive.split('.');
            if(t.length > 1) {
                this.ruleForm.unitPriceExcessive = t[0] + "." + t[1].substr(0, 2);
            }
        }
			},
			changeSettlementType() {
				this.$refs['ruleForm'].clearValidate();
				if(this.ruleForm.settlementType == '1') {//按量
				  this.ruleForm.receiveCharge = '';
          this.disabledFlag1 = true;
					this.settlementTypeShow = true;
          this.ruleForm.minCharge = '0';
          this.ruleForm.maxCharge = '0';
          if(parseFloat(this.ruleForm.minCharge) > 0){
              this.ruleForm.unitPrice = '0';
              this.disabledFlag2 = true;
          }else{
              this.disabledFlag2 = false;
          }
				} else {
          this.ruleForm.unitPrice = '';
          this.ruleForm.minCharge = '';
				  this.ruleForm.maxCharge = '';
          this.ruleForm.unitPriceExcessive = '';
          this.ruleForm.baseQuantity = '';
          this.disabledFlag = true;
          this.disabledFlag2 = true;
					this.settlementTypeShow = false
				}
			},
      changeMinCharge(){
          if(this.ruleForm.settlementType == '1' && parseFloat(this.ruleForm.minCharge) > 0) {
              this.ruleForm.unitPrice = '0';
              this.disabledFlag2 = true;
          }else if(this.ruleForm.settlementType != '1' && parseFloat(this.ruleForm.minCharge) >= 0){
              this.ruleForm.minCharge = '';
              this.disabledFlag2 = true;
          }else if(this.ruleForm.settlementType == '1' && parseFloat(this.ruleForm.minCharge) == 0){
              this.ruleForm.minCharge = '0';
              this.disabledFlag2 = false;
          }
      },
			changeSettlementPeriod(){
				if (this.ruleForm.settlementPeriod=='1') {//结算周期按年
					this.typeOptions=[
						{"label":"按量计费","value":'1'},
						{"label":"包年计费","value":'2'}
					]
					this.ruleForm.settlementType='1';
            this.settlementModBillMonthFlag=false;
            this.ruleForm.settlementModBillMonth='1';
				}else if(this.ruleForm.settlementPeriod=='0'){//结算周期按月
					this.typeOptions=[
						{"label":"按量计费","value":'1'},
						{"label":"包月计费","value":'0'}
					]
					this.ruleForm.settlementType='1';
            this.settlementModBillMonthFlag=true;
            this.ruleForm.settlementModBillMonth='1,2,3,4,5,6,7,8,9,10,11,12';
				}else if(this.ruleForm.settlementPeriod=='2'){//结算周期按季度
            this.typeOptions=[
                {"label":"按量计费","value":'1'},
                {"label":"包季度计费","value":'4'}
            ]
            this.ruleForm.settlementType='1';
            this.settlementModBillMonthFlag=false;
            this.ruleForm.settlementModBillMonth='1,4,7,10';
        }else if(this.ruleForm.settlementPeriod=='3'){//结算周期按半年
            this.typeOptions=[
                {"label":"按量计费","value":'1'},
                {"label":"包半年计费","value":'3'}
            ]
            this.ruleForm.settlementType='1';
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
			callback(coopId, coopName, agreementId) {
				this.ruleForm.coopId = coopId
				this.ruleForm.coopName = coopName
				//this.ruleForm.agreementId = agreementId
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

			    if(this.ruleForm.coopId == ''){
              this.openError('请先选择客户');
              return;
          }
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
      strTrim(val){
          return val.replace(/\s*/g,"");
      }
		}
	}
</script>
