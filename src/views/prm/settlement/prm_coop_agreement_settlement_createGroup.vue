<template>
	<el-dialog title="账单客户 - 新增" width="690px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form label-position="center" ref="ruleForm" :model="ruleForm" :rules="rules">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="客户Id" prop="coopId" v-show="false" required>
						<el-input v-model="ruleForm.coopId"></el-input>
					</el-form-item>
					<el-form-item label="客户名称" prop="coopName" required label-width="95px">
						<el-input style="width: 240px;" v-model="ruleForm.coopName" :disabled=true></el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 20px;">
					   <el-button type="primary" size="small" @click="chooseAgreement">选择</el-button>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="分组名称" prop="settlementModName" label-width="105px">
            <el-input style="width: 143px;" v-model="ruleForm.settlementModName" clearable >
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="95px" v-if="settlementTypeShow" label="最小金额" prop="minCharge" :rules="[{
						required: true,
						message: '请录入最小金额',
						trigger: 'change'
					}]">
            <el-input style="width: 120px;" v-model="ruleForm.minCharge" @input="formatToFloat('minCharge')"></el-input>
          </el-form-item>
          <el-form-item v-else label="最小金额" prop="minCharge" label-width="95px">
            <el-input style="width: 120px;" v-model="ruleForm.minCharge" @input="formatToFloat('minCharge')" :disabled="disabledFlag"></el-input>
          </el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="86px" v-if="settlementTypeShow" label="最大金额" prop="maxCharge" :rules="[{
						required: true,
						message: '请录入最大金额',
						trigger: 'change'
					}]">
						<el-input style="width: 120px;" v-model="ruleForm.maxCharge" @input="formatToFloat('maxCharge')"></el-input>
					</el-form-item>
					<el-form-item v-else label="最大金额" prop="maxCharge" label-width="86px">
						<el-input style="width: 120px;" v-model="ruleForm.maxCharge" @input="formatToFloat('maxCharge')" :disabled="disabledFlag"></el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label="账单责任人" prop="transactorId" required label-width="96px">
            <el-select style="width: 143px;" v-model="ruleForm.transactorId" filterable placeholder="请选择">
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
          <el-form-item label="业务区域" prop="billTemplate" required label-width="95px">
            <el-select style="width: 120px;" v-model="ruleForm.billTemplate">
              <el-option label="华北" value="BJS"></el-option>
              <el-option label="华南" value="CAN"></el-option>
              <el-option label="华东" value="SHA"></el-option>
              <el-option label="西北" value="XIY"></el-option>
              <el-option label="总部" value="EFT"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="生效日期" label-width="87px">
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
          <el-form-item label="开票客户名称" prop="invoiceTitle" required label-width="123px">
            <el-input style="width: 538px;" v-model="ruleForm.invoiceTitle"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="发票票种" prop="invoiceType" label-width="95px">
            <el-select style="width: 120px;" v-model="ruleForm.invoiceType" clearable>
              <el-option label="电子票" value="电子票"></el-option>
              <el-option label="专票" value="专票"></el-option>
              <el-option label="普票" value="普票"></el-option>
              <el-option label="不开票" value="不开票"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="电子发票接收邮箱" prop="invoiceReceiveEmails" label-width="140px">
            <el-select style="width: 230px;" v-model="ruleForm.invoiceReceiveEmails" filterable placeholder="请选择" clearable>
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
          <el-form-item label="开票备注" prop="invoiceRemark" label-width="95px">
            <el-input style="width: 566px;" v-model="ruleForm.invoiceRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
					   <el-button :loading="loading" size="small" type="primary" @click="createCoopAgreementSettlement('ruleForm')" style="margin-right: 120px;" :disabled="disabledFlag2">保存</el-button>
          </el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<agreement ref="addMission" v-if="agreementVisible" :visible.sync="agreementVisible"></agreement>
    <contactVisible ref="addMission" v-if="contactVisible" :visible.sync="contactVisible" :inputName="ruleForm.coopId"></contactVisible>
	</el-dialog>
</template>
<script>
	import Agreement from './prm_coop_agreement_settlement_agreement'
  import contactVisible from './prm_coop_addContact'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			}
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
        useroptions: [],
				ruleForm: {
					coopId: '',
					coopName: '',
					minCharge: 0,
					maxCharge: 0,
          beginDate: '',
          endDate: '',
          billTemplate: '',
          settlementModName: '',
          transactorId: '',
          userName: '',
          invoiceTitle: '',
          invoiceType: '',
          invoiceReceiveEmails: '',
          invoiceRemark: '',

				},
        disabledFlag:false,
        disabledFlag1:false,
        disabledFlag2: false,
        settlementModBillMonthFlag:true,
				rules: {
          beginDate: [{
              required: true,
              message: '请选择开始日期',
              trigger: ['blur', 'change']
          }],
          coopName: [{
              required: true,
              message: '请选择客户',
              trigger: 'change'
          }],
          billTemplate: [{
              required: true,
              message: '请选择业务区域',
              trigger: 'change'
          }],
          settlementModName: [{
              required: true,
              message: '请输入分组名称',
              trigger: ['blur', 'change']
          },{
              min: 1,
              max: 50,
              message: '分组名称长度不超过 50',
              trigger: ['blur', 'change']
          }],
          transactorId: [{
              required: true,
              message: '账单责任人不能为空',
              trigger: 'change'
          }],
          invoiceTitle: [{
              required: true,
              message: '请输入开票客户名称',
              trigger: ['blur', 'change']
          },{
              min: 1,
              max: 100,
              message: '开票客户名称长度不超过 100',
              trigger: ['blur', 'change']
          }],
				},
				isShow: false,
				selectList: [],
				contactoptions: [],
				settlementTypeShow: true,
				agreementVisible: false,
        contactVisible:false,
				loading: false,
				billConfirmContactsMust: false
			}
		},
		provide() {
			return {
				callback: this.callback,
          callback1: this.callback1,
			}
		},
		components: {
			'agreement': Agreement,
      'contactVisible': contactVisible
		},
		inject: ['findCoopAgreementSettlementListCriteria'],
		created() {
      this.disabledFlag1 = true;
      //设置生效日期的开始日期
      let date = new Date(new Date().setDate(1)-86400000);
      let month = date.getMonth()+2;
      month = month<10 ? "0"+month : ""+month;
      if(month>12){
          this.ruleForm.beginDate=(date.getFullYear()+1) + "-" + "0"+(month-12);
      }else{
          this.ruleForm.beginDate=date.getFullYear() + "-" + month;
      }
      this.$axios.get('/hrs/dept/selectUser')
          .then(function(response) {
              this.useroptions = response.data.data;
          }.bind(this));
		},
		methods: {
			createCoopAgreementSettlement(formName) {
        if(this.ruleForm.beginDate==null || this.ruleForm.beginDate==''){
            this.openError('请选择开始日期');
            return;
        }
				this.$refs[formName].validate((valid) => {
					if(valid) {
            this.disabledFlag2 = true;
						this.loading = true
						this.$axios.post('/prm/coopAgreementSettlement/createCoopAgreementSettlementGroup', {
							coopId: this.ruleForm.coopId,
							minCharge: this.ruleForm.minCharge,
							maxCharge: this.ruleForm.maxCharge,
              beginDate: this.ruleForm.beginDate,
              endDate: this.ruleForm.endDate,
              billTemplate: this.ruleForm.billTemplate,
              settlementModName: this.ruleForm.settlementModName,
              transactorId: this.ruleForm.transactorId,
              invoiceTitle: this.ruleForm.invoiceTitle,
              invoiceType: this.ruleForm.invoiceType,
              invoiceReceiveEmails: this.ruleForm.invoiceReceiveEmails,
              invoiceRemark: this.ruleForm.invoiceRemark

						}, {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then((response) => {
							console.log(response)
							if(response.status == '200') {
								this.$notify({
									title: '成功',
									message: '创建成功     1s后跳转列表页面...',
									type: 'success'
								});
								setTimeout(() => {
									this.loading = false
									this.findCoopAgreementSettlementListCriteria()
									this.handleClose()
								}, 1500);
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
			callback(coopId, coopName,transactor_id,user_name) {
				this.ruleForm.coopId = coopId
				this.ruleForm.coopName = coopName
        this.ruleForm.transactorId = transactor_id
        this.ruleForm.invoiceTitle = coopName
				this.billConfirmContactsMust = true
				this.ruleForm.billConfirmContacts = ''
        this.ruleForm.invoiceReceiveEmails = ''
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
		}
	}
</script>
