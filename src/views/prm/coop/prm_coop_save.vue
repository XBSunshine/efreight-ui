<template>
	<el-dialog title="客商资料 - 新增" width="830px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="orderListPage">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="coop_code" label-width="15px">
            <el-input class="" v-model="ruleForm.coop_code" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.coop_code = toFormatCoopCodeValue(ruleForm.coop_code)">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>客商资料代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="coop_type" label-width="15px">
            <el-input class="" auto-complete="off" style="width:370px;margin-right: 15px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>客商资料类型</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.coop_type" filterable placeholder="请选择" style="width:263px;margin-right: -5px;" clearable>
                <el-option v-for="item in coopTypeOptions" :key="item.code" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="coopCodeThree" label-width="15px">
            <el-input class="widthFive" v-model="ruleForm.coopCodeThree" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.coopCodeThree = toUpperCaseValue(ruleForm.coopCodeThree)">
              <template slot="prepend">
                <span>客商三字码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="financialCode" label-width="15px">
            <el-input class="widthFour" v-model="ruleForm.financialCode" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>财务代码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="social_credit_code" label-width="15px">
            <el-input class="widthSix" v-model="ruleForm.social_credit_code" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>社会信用代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="transactor_id" label-width="15px">
            <el-input class="widthThree1" style="width:370px;;margin-right: 15px;">
              <template slot="prepend">
                <span>负责人</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.transactor_id" filterable placeholder="请选择" style="width:291px;margin-right: -5px;" clearable>
                <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label4 }}</span>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="coop_name" label-width="15px">
            <el-input class="" v-model="ruleForm.coop_name" style="width:370px;margin-right: 15px;" auto-complete="off" @blur="setCoopEname(ruleForm.coop_name)">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>中文全称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="coop_ename" label-width="15px">
            <el-input class="" v-model="ruleForm.coop_ename" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>英文全称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="bank_name" label-width="15px">
            <el-input class="widthThree1" v-model="ruleForm.bank_name" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>开户行</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="bank_number" label-width="15px">
            <el-input class="widthFour" v-model="ruleForm.bank_number" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>银行账号</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="phone_number" label-width="15px">
            <el-input class="widthTwo" v-model="ruleForm.phone_number" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>电话</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="coop_address" label-width="15px">
            <el-input class="widthTwo" v-model="ruleForm.coop_address" style="width:370px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>地址</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="coop_remark" label-width="15px">
            <el-input class="widthTwo" v-model="ruleForm.coop_remark" style="width:770px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>备注</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
      <div style="padding:15px 0px 10px 15px;width: 785px">
        <HR color="#eee" size="5">
        </HR>
      </div>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="iataCode" label-width="15px">
            <el-input v-model="ruleForm.iataCode" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.iataCode = toUpperCaseValue(ruleForm.iataCode)">
              <template slot="prepend">
                <span>IATA Code</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="cataCertifiedSalesAgents" label-width="15px">
            <el-input v-model="ruleForm.cataCertifiedSalesAgents" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.cataCertifiedSalesAgents = toUpperCaseValue(ruleForm.cataCertifiedSalesAgents)">
              <template slot="prepend">
                <span>航协铜牌代码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag2">立即创建</el-button>
					<el-button size="small" type="primary" @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-row>
		</el-form>
	</el-dialog>
</template>
<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			let numberAndCharacterValidator = (rule, value, callback) => {
				if(!value) {
					return callback();
				}
				let regE = /^[0-9-_a-zA-Z]*$/g;
				if(!regE.test(value)) {
					callback(new Error('请输入字母，下划线，减号或数字'));
				} else {
					callback();
				}
			};
			return {
        useroptions: [],
        coopTypeOptions:[],
        disabledFlag2:false,
				ruleForm: {
					coop_code: '',
					coop_type: '',
					coop_mnemonic: '',
					coop_name: '',
					short_name: '',
					coop_ename: '',
					short_ename: '',
					social_credit_code: '',
					bank_name: '',
					bank_number: '',
					phone_number: '',
					coop_address: '',
					coop_remark: '',
					coop_status: '1',
					blackwhite_valid: '1',
          transactor_id: '',
          coopCodeThree: '',
          iataCode: '',
          cataCertifiedSalesAgents: '',
          financialCode: '',
				},
				rules: {
					coop_code: [{
							required: true,
							message: '请输入客商资料代码',
							trigger: ['blur', 'change']
						},
						{
							min: 6,
							max: 6,
							message: '长度为 6',
							trigger: ['blur', 'change']
						}, {
							validator: numberAndCharacterValidator,
							trigger: ['blur', 'change']
						}
					],
					coop_type: [{
						required: true,
						message: '请选择客商资料类型',
						trigger: ['blur', 'change']
					}],
					coop_name: [{
							required: true,
							message: '请输入中文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					coop_ename: [{
							required: true,
							message: '请输入英文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					social_credit_code: [
						{
							min: 0,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],
					bank_name: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					bank_number: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					phone_number: [{
						min: 0,
						max: 20,
						message: '长度不超过 20',
						trigger: ['blur', 'change']
					}],
					coop_address: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					coop_remark: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					lock_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					blacklist_reason: [{
						min: 0,
						max: 4000,
						message: '长度不超过 4000',
						trigger: ['blur', 'change']
					}],
					whitelist_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
          iataCode: [{
              min: 0,
              max: 15,
              message: '长度不超过 15',
              trigger: ['blur', 'change']
          }],
          cataCertifiedSalesAgents: [{
              min: 0,
              max: 20,
              message: '长度不超过 20',
              trigger: ['blur', 'change']
          }],
          financialCode: [{
              min: 0,
              max: 20,
              message: '长度不超过 20',
              trigger: ['blur', 'change']
          }],
				}
			};
		},
		inject: ['queryCoopList','continueOperation'],
    created() {
        this.$axios.get('/hrs/dept/selectUser')
            .then(function(response) {
                this.useroptions = response.data.data;
                if(this.useroptions.length == 1){
                    this.ruleForm.transactor_id = this.useroptions[0].value;
                }
            }.bind(this));
        this.$axios.get('/afbase/awb/selectVCategory?category=合作伙伴分类').then(function(response) {
			this.coopTypeOptions = response.data.data;
		}.bind(this));
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
			submitForm(formName) {
        if(this.ruleForm.coopCodeThree && this.ruleForm.coopCodeThree.length !== 3){
            this.openError("客商三字码长度为三位");
            return;
        }
				this.$refs[formName].validate((valid) => {
					if(valid) {
					  //查询社会信用代码是否已经存在
              if(this.ruleForm.social_credit_code){
                  this.$axios.post('/prm/coop/isHaveSocialCreditCode', this.ruleForm)
                      .then(function(response) {
                          if(response.data.code == 0) {//存在
                              let currthis = this
                              currthis.$confirm('社会信用代码 与 其他客商资料社会信用代码重复，是否继续？', '提示', {
                                  confirmButtonText: '确定',
                                  cancelButtonText: '取消',
                                  type: 'warning',
                                  center: true
                              }).then(() => {
                                  this.disabledFlag2 = true;
                                  this.ruleForm.coop_mnemonic = this.ruleForm.coop_code;
                                  this.ruleForm.short_name = this.ruleForm.coop_name;
                                  this.ruleForm.short_ename = this.ruleForm.coop_ename;
                                  let params = this.ruleForm;
                                  this.$axios.post('/prm/coop/saveCoop',
                                      params)
                                      .then(function(response) {
                                          if(response.data.code == 200) {
                                              this.openSuccess();
                                              this.queryCoopList();
                                              this.continueOperation(response.data.data.coop_id);
                                              this.handleClose();
                                          } else {
                                              let errorinfo = response.data.messageInfo;
                                              this.openError(errorinfo);
                                              this.disabledFlag2 = false;
                                          }
                                      }.bind(this)).catch(function(error) {
                                      if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
                                          this.openError(error.response.data.messageInfo);
                                      }
                                  }.bind(this));
                              }).catch(() => {
                                  currthis.$message({
                                      type: 'info',
                                      message: '已取消'
                                  });
                              });
                          }else{
                              this.disabledFlag2 = true;
                              this.ruleForm.coop_mnemonic = this.ruleForm.coop_code;
                              this.ruleForm.short_name = this.ruleForm.coop_name;
                              this.ruleForm.short_ename = this.ruleForm.coop_ename;
                              let params = this.ruleForm;
                              this.$axios.post('/prm/coop/saveCoop',
                                  params)
                                  .then(function(response) {
                                      if(response.data.code == 200) {
                                          this.openSuccess();
                                          this.queryCoopList();
                                          this.continueOperation(response.data.data.coop_id);
                                          this.handleClose();
                                      } else {
                                          let errorinfo = response.data.messageInfo;
                                          this.openError(errorinfo);
                                          this.disabledFlag2 = false;
                                      }
                                  }.bind(this)).catch(function(error) {
                                  if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
                                      this.openError(error.response.data.messageInfo);
                                  }
                              }.bind(this));
                          }
                      }.bind(this)).catch(function(error) {
                      let errorinfo = error.response.data.messageInfo;
                      this.openError(errorinfo)
                  }.bind(this));
              }else{
                  this.disabledFlag2 = true;
                  this.ruleForm.coop_mnemonic = this.ruleForm.coop_code;
                  this.ruleForm.short_name = this.ruleForm.coop_name;
                  this.ruleForm.short_ename = this.ruleForm.coop_ename;
                  let params = this.ruleForm;
                  this.$axios.post('/prm/coop/saveCoop',
                      params)
                      .then(function(response) {
                          if(response.data.code == 200) {
                              this.openSuccess();
                              this.queryCoopList();
                              this.continueOperation(response.data.data.coop_id);
                              this.handleClose();
                          } else {
                              let errorinfo = response.data.messageInfo;
                              this.openError(errorinfo);
                              this.disabledFlag2 = false;
                          }
                      }.bind(this)).catch(function(error) {
                      if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
                          this.openError(error.response.data.messageInfo);
                      }
                  }.bind(this));
              }
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			toFormatCoopCodeValue(val) {
				return val.toUpperCase();
			},
      setCoopMnemonic(val) {
          if(this.ruleForm.coop_mnemonic){

          }else{
              this.ruleForm.coop_mnemonic = val
          }
      },
      setCoopEname(val) {
          if(this.ruleForm.coop_ename){

          }else{
              this.ruleForm.coop_ename = val
          }
      },
      setShortEname(val) {
          if(this.ruleForm.short_ename){

          }else{
              this.ruleForm.short_ename = val
          }
      },
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
      strTrim(val){
          return val.replace(/\s*/g,"").toUpperCase();
      }
		}
	}
</script>
<style type="text/css">

  .orderListPage .el-input__icon {
    line-height: 30px !important;
  }

  .orderListPage .el-form-item__content {
    line-height: 30px !important;
  }

  .orderListPage .widthSix .el-input-group__prepend {
    padding: 0 11px !important;
  }

  .orderListPage .widthThree2 .el-input-group__prepend {
    padding: 0 38px;
  }

  .orderListPage .widthThree1 .el-input-group__prepend {
    padding: 0 18px;
  }

  .orderListPage .widthTwo .el-input-group__prepend {
    padding: 0 25px;
  }

  .orderListPage .widthFour .el-input-group__prepend {
    padding: 0 11px;
  }

  .orderListPage .widthFive .el-input-group__prepend {
    padding: 0 18px;
  }
</style>
