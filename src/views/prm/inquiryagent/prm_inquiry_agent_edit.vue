<template>
	<el-dialog title="询盘代理 - 修改" width="995px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<div class="orderEditPage">
			<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" prop="inquiryAgentName">
							<el-input v-model="ruleForm.inquiryAgentName" style="width:630px;margin-right: 10px;" readOnly class="widthWithFive2">
								<template slot="prepend"><b style="color:red">*</b>询盘代理</template>
								<el-button slot="append" icon="el-icon-search" @click="gotoSelectPage('ruleForm')"></el-button>
							</el-input>

						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="inquiryAgentNameShort">
							<el-input class="widthWithFive2" v-model="ruleForm.inquiryAgentNameShort" auto-complete="off" style="width:305px;" maxlength="100" clearable>
								<template slot="prepend">
									<span><b style="color:red">*</b>简称</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" style="width:305px;margin-right: 10px;" clearable>
								<template slot="prepend">
									<span>优势航司</span>
								</template>
                <el-select slot="suffix" remote :filter-method="searchCarrier" @input="toDoUpperCase1" filterable :loading="loading" v-model="ruleForm.carrierCodes" multiple placeholder="请选择" style="width:210px;margin-right: -5px;">
                  <el-option v-for="item in carrierList" :key="item.carrierCode"  :value="item.carrierCode">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.carrierCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.carrierPrefix}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.carrierNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:305px;margin-right: 10px;">
								<template slot="prepend">签约类型</template>
								<el-select slot="suffix" clearable v-model="ruleForm.contractType" style="width:208px;margin-right: -5px;">
									<el-option v-for="item in contractTypeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree2" auto-complete="off" style="width:305px;" clearable>
								<template slot="prepend">
									<span>始发港</span>
								</template>
                <el-select slot="suffix"  @input="toDoUpperCase2"  remote :filter-method="searchAirport" filterable  :loading="loading" v-model="ruleForm.departureStations"
                           multiple  placeholder="请输入关键词" style="width:210px;margin-right: -5px;" >
                  <el-option v-for="item in airportList" :key="item.apCode" :value="item.apCode">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.apCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.apNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.apNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree2" auto-complete="off" style="width:305px;margin-right: 10px;" clearable>
								<template slot="prepend">
									<span>目的港</span>
								</template>
                <el-select slot="suffix" @input="toDoUpperCase3"  remote :filter-method="searchAirport"  filterable  :loading="loading" v-model="ruleForm.arrivalStations"
                           multiple  placeholder="请输入关键词" style="width:210px;margin-right: -5px;">
                  <el-option v-for="item in airportList" :key="item.apCode" :value="item.apCode">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.apCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.apNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.apNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="widthWithThree2" auto-complete="off" style="width:305px;margin-right: 10px;" clearable>
								<template slot="prepend">
									<span>目的国</span>
								</template>
                <el-select slot="suffix" remote :filter-method="searchAirportCountry" @input="toDoUpperCase4" filterable  :loading="loading" v-model="ruleForm.nationCodeArrivals" multiple placeholder="请选择" style="width:210px;margin-right: -5px;">
                  <el-option v-for="item in airportCountryList" :key="item.nationCode" :label="item.nationCode" :value="item.nationCode">
                    <el-row>
                      <el-col :span="2" style="width: unset;margin-right: 10px">{{item.nationCode}}</el-col>
                      <el-col :span="10" style="overflow-x: hidden; width: unset; margin-right: 10px">{{item.nationNameEn}}</el-col>
                      <el-col :span="12" style="text-align: right;overflow-x: hidden; width: unset; float: right">{{item.nationNameCn}}</el-col>
                    </el-row>
                  </el-option>
                </el-select>

							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input class="widthWithTwo2" style="width:305px;">
								<template slot="prepend">航线</template>
								<el-select slot="suffix" clearable v-model="ruleForm.routingName" style="width:210px;margin-right: -5px;">
									<el-option v-for="item in routingNameOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item prop="orderContacts">
							<el-input class="widthWithFive3" auto-complete="off" style="width:305px;margin-right: 10px;" clearable>
								<template slot="prepend">
									<span><b style="color:red">*</b>订舱联系人</span>
								</template>
								<el-select slot="suffix" v-model="ruleForm.orderContacts" multiple placeholder="请选择" style="width:210px;margin-right: -5px;">
									<el-option v-for="item in contactsOptions" :key="item.contacts_id" :label="item.contacts_name" :value="item.contacts_id">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
						<el-form-item class="orderEditPage33">

							<el-button type="primary" style="padding: 7px 5px; margin-left:-20px;margin-right: 10px;" @click="gotoSavePage" size="mini">新增</el-button>

						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:180px;">
								<template slot="prepend">是否有效</template>
								<el-select slot="suffix" v-model="ruleForm.isValid" clearable placeholder="请选择" style="width:83px;margin-right: -5px;">
									<el-option label="是" :value="1">
									</el-option>
									<el-option label="否" :value="0">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input class="showWordLimit widthWithTwo3" v-model="ruleForm.remark" @change="ruleForm.remark=strTrim(ruleForm.remark)" auto-complete="off" style="width:955px" clearable show-word-limit maxlength="200">
								<template slot="prepend">
									<span>备注</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item>
						<el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag2">保存</el-button>
					</el-form-item>
				</el-row>
				<save ref="addMission" v-if="save" :visible.sync="save"></save>
				<save2 ref="addMission" v-if="save2" :visible.sync="save2" :frow="ffrow"></save2>
			</el-form>
		</div>
	</el-dialog>
</template>
<script>
	import save from './prm_inquiry_agent_select'
	import save2 from './prm_coop_contact_save2'
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
        loading: false,
        airportList: [],
        initAirportList: [],
        airportCountryList: [],
        carrierList: [],
				disabledFlag2: false,
				ruleForm: {
					inquiryId: '',
					businessScope: '',
					inquiryAgentId: '',
					inquiryAgentName: '',
					inquiryAgentNameShort: '',
					carrierCode: '',
					carrierCodes: [],
					contractType: '',
					departureStation: '',
					departureStations: [],
					arrivalStation: '',
					arrivalStations: [],
					nationCodeArrival: '',
					nationCodeArrivals: [],
					routingName: '',
					bookingContactsId: '',
					orderContacts: [],
					remark: '',
					isValid: '1'
				},
				rules: {
					inquiryAgentName: [{
						required: true,
						message: '请选择询盘代理',
						trigger: ['blur', 'change']
					}],
					inquiryAgentNameShort: [{
						required: true,
						message: '请输入代理简称',
						trigger: ['blur', 'change']
					}],
					orderContacts: [{
						required: true,
						message: '请选择订舱联系人',
						trigger: ['blur', 'change']
					}],
				},
				showFlag: false,
				checkAll: false,
				checkedCities: [],
				cities: [],
				isIndeterminate: false,
				save: false,
				save2: false,
				contractTypeOptions: [],
				carrierCodeOptions: [],
				carrierCodeOptionsAll: [],
				airportOptions: [],
				nationOptions: [],
				nationOptionsAll: [],
				contactsOptions: [],
				routingNameOptions: [],
				ffrow: {},
			};
		},
		inject: ['findByPage'],
		components: {
			'save': save,
			'save2': save2
		},
		provide() {
			return {
				setValue: this.setValue,
				setValue2: this.setValue2,
				queryContactsList2: this.queryContactsList2
			}
		},
		methods: {
			gotoSavePage() {
				if (this.ruleForm.inquiryAgentId) {
					this.ffrow.coop_id = this.ruleForm.inquiryAgentId;
					this.save2 = true;
				} else {
					this.openError("请选择询盘代理");
				}

			},
			gotoSelectPage() {
				this.save = true;
			},
			setValue(rrow) {
				this.ruleForm.orderContacts = [];
				this.ruleForm.inquiryAgentId = rrow.coopId;
				this.ruleForm.inquiryAgentName = rrow.coopName;
				this.ruleForm.inquiryAgentNameShort = rrow.coopName;
				this.queryContactsList2(rrow.coopId)
			},
			setValue2(coopId) {
				this.ruleForm.orderContacts.push(coopId);

				this.queryContactsList2(this.ruleForm.inquiryAgentId)
			},
			queryContactsList2(inquiryAgentId) {
				let params = {
					inquiryAgentId: inquiryAgentId
				}
				this.$axios.post('/prm/inquiryAgent/selectContacts',
						params)
					.then(function(response) {
						this.contactsOptions = response.data.data.dataList;
						if (this.contactsOptions != null && this.contactsOptions.length == 1) {
							this.ruleForm.orderContacts.push(this.contactsOptions[0].contacts_id)
						}
					}.bind(this));
			},
			queryContactsList3(inquiryAgentId) {
				let params = {
					inquiryAgentId: inquiryAgentId
				}
				this.$axios.post('/prm/inquiryAgent/selectContacts',
						params)
					.then(function(response) {
						this.contactsOptions = response.data.data.dataList;
					}.bind(this));
			},
			selectChange() {
				this.checkedCities = [];
				if (this.ruleForm.agreement_type == "商务合作类") {
					this.showFlag = true;
					if (window.localStorage.getItem("orgCode").toUpperCase() == "EFTBJS") {
						this.checkedCities = ['EF'];
						this.ruleForm.business_scope = this.checkedCities.toString();
					}
				} else {
					this.showFlag = false;
				}
			},
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
			changeValue(value) {
				let obj = {};
				obj = this.options.find((item) => {
					return item.value === value;
				});
				this.ruleForm.coop_name = obj.label;
			},
			toDoUpperCase1() {
				if (this.ruleForm.carrierCodes.length > 0) {
					this.ruleForm.carrierCodes[this.ruleForm.carrierCodes.length - 1] = this.ruleForm.carrierCodes[this.ruleForm.carrierCodes
						.length - 1].toUpperCase()
				}
			},
			toDoUpperCase2() {
				if (this.ruleForm.departureStations.length > 0) {
					this.ruleForm.departureStations[this.ruleForm.departureStations.length - 1] = this.ruleForm.departureStations[this
						.ruleForm.departureStations.length - 1].toUpperCase()
				}
			},
			toDoUpperCase3() {
				if (this.ruleForm.arrivalStations.length > 0) {
					this.ruleForm.arrivalStations[this.ruleForm.arrivalStations.length - 1] = this.ruleForm.arrivalStations[this.ruleForm
						.arrivalStations.length - 1].toUpperCase()
				}
			},
			toDoUpperCase4() {
				if (this.ruleForm.nationCodeArrivals.length > 0) {
					this.ruleForm.nationCodeArrivals[this.ruleForm.nationCodeArrivals.length - 1] = this.ruleForm.nationCodeArrivals[
						this.ruleForm.nationCodeArrivals.length - 1].toUpperCase()
				}
			},
			changeNationCodeArrivals(val) {
				if (val) {
					this.nationOptions = this.nationOptionsAll.filter(nation => nation.nationCode.indexOf(val.toUpperCase()) > -1 || nation.nationEname.indexOf(
						val.toUpperCase()) > -1 || nation.nationName.indexOf(
						val.toUpperCase()) > -1).slice(0, 30)
				} else {
					this.nationOptions = this.nationOptionsAll.slice(0, 30)
				}
			},
			changeCarrierCodes(val) {
				if (val) {
					this.carrierCodeOptions = this.carrierCodeOptionsAll.filter(nation => nation.carrierCode.indexOf(val.toUpperCase()) > -1 || nation.carrierName.indexOf(
						val.toUpperCase()) > -1).slice(0, 30)
				} else {
					this.carrierCodeOptions = this.carrierCodeOptionsAll.slice(0, 30)
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.ruleForm.arrivalStations.length == 0 && this.ruleForm.nationCodeArrivals.length == 0 && this.ruleForm.routingName ==
							'') {
							this.openError("目的港，目的国，航线不能都为空");
							return;
						}
						this.disabledFlag2 = true;
						let params = this.ruleForm;
						this.$axios.post('/prm/inquiryAgent/doEdit', params)
							.then(function(response) {
								if (response.data.code == 200) {
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									let errorinfo = response.data.messageInfo;
									if (errorinfo.indexOf('IDU_prm_serial_number') > -1) {
										this.openError('合同编号不可重复');
										this.disabledFlag2 = false;
									} else {
										this.openError(response.data.messageInfo);
										this.disabledFlag2 = false;
									}
								}
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},

			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
      /**
       * 搜索港口信息
       */
      searchAirport(val){
        this.search("/afbase/airport/search/", val, function(data){
          this.airportList = data;
        }.bind(this))
      },
      /**
       * 搜索目的国
       * @param val
       */
      searchAirportCountry(val){
			  this.search("/afbase/airport/searchCountry/", val, function(data){
			    this.airportCountryList = data;
        }.bind(this))
      },
      /**
       * 搜索航司
       * @param val
       */
      searchCarrier(val){
        this.search("/afbase/carrier/search/", val, function(data){
          this.carrierList = data;
        }.bind(this))
      },

      search(url, val, callback){
			  if(!callback){
			    callback = function(data){};
        }
        if((val || '').trim().length == 0){
          callback([]);
          return;
        }
        val = val.toUpperCase();
        this.loading = true;
        this.$axios.get(url+val).then(function(response){
          this.loading = false;
          callback(response.data.data || []);
        }.bind(this));

      }

		},
		created() {
			this.$axios.get('/afbase/awb/selectCategory?category=签约类型').then(function(response) {
				this.contractTypeOptions = response.data.data;
			}.bind(this));

			this.$axios.get('/afbase/awb/selectCategory?category=航线').then(function(response) {
				this.routingNameOptions = response.data.data;
			}.bind(this));

      this.$axios.get("/afbase/airport/search/A").then(function(response){
        this.initAirportList = response.data.data || [];
        this.initAirportList.forEach((item)=>{
          this.airportList.push(item);
        })
      }.bind(this));


			this.queryContactsList3(this.frow.inquiryAgentId)
			this.$axios.post('/prm/inquiryAgent/queryById', {
					inquiryId: this.frow.inquiryId
				})
				.then((response) => {
					let code = response.data.code;
					if (code == 200) {
						this.ruleForm = response.data.data;
						if (this.ruleForm.arrivalStations == null) {
							this.ruleForm.arrivalStations = []
						}
						if (this.ruleForm.nationCodeArrivals == null) {
							this.ruleForm.nationCodeArrivals = []
						}
						if (this.ruleForm.routingName == null) {
							this.ruleForm.routingName = ''
						}

						// this.ruleForm.coop_status = response.data.data.coop_status + '';
						// this.ruleForm.blackwhite_valid = response.data.data.blackwhite_valid + '';
					}

					// this.data1=response.data.data.dataList;

				});
		}
	}
</script>
<style>
	.widthWithFive .el-input-group__prepend {
		padding: 0 15px;
	}

	.widthWithFive2 .el-input-group__prepend {
		padding: 0 17px;
	}

	.widthWithFive3 .el-input-group__prepend {
		padding: 0 9px;
	}

	.widthWithThree2 .el-input-group__prepend {
		padding: 0 27px;
	}

	.widthWithThreeWithXing .el-input-group__prepend {
		padding: 0 22px;
	}

	.widthWithTwo2 .el-input-group__prepend {
		padding: 0 33px;
	}

	.widthWithTwo3 .el-input-group__prepend {
		padding: 0 34px;
	}

	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.showWordLimit .el-input__inner {
		padding-right: 80px !important;
	}

	.showWordLimit .el-textarea__inner {
		padding-right: 50px;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}

	.orderEditPage33 .el-form-item__content {
		line-height: 30px !important;
	}
</style>
