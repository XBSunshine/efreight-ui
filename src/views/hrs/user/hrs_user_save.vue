<template>
	<el-dialog title="用户管理 - 新增" width="730px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" class="hrsUserSave-ruleForm" ref="ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="deptId" label-width="15px">
            <el-input style="width:295px;;margin-right: 15px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>所属部门</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.deptId" filterable placeholder="请选择" style="width:215px;margin-right: -5px;">
                <el-option v-for="item in deptoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="roleIds" label-width="15px">
            <el-input class="widthTwo1" style="width:340px;">
              <template slot="prepend">
                <span>角色</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.roleIds" multiple placeholder="请选择" style="width:261px;margin-right: -5px;">
                <el-option v-for="item in options" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item prop="userName" label-width="15px">
            <el-input class="widthTwo" v-model.trim="ruleForm.userName" @input="ruleForm.userName = ruleForm.userName.replace(' ', '')"  auto-complete="off" style="width:200px;margin-right: 15px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>姓名</span>
              </template>
              <!--<el-select slot="append" v-model="ruleForm.userSex" placeholder="性别" style="width:85px;" clearable>
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>-->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="userSex" style="margin-left: -10px;">
            <el-select v-model="ruleForm.userSex" placeholder="性别" style="width:89px;" clearable>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="userEname" label-width="30px">
            <el-input class="widthThree" v-model="ruleForm.userEname" style="width:340px;" auto-complete="off">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>英文名</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="userEmail" label-width="15px">
            <el-input class="widthTwo" v-model="ruleForm.userEmail" style="width:295px;margin-right: 15px;" auto-complete="off" @change="sychronizeEname">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>邮箱</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="hireDate" label-width="15px">
            <el-input class="" style="width:340px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>入职日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="ruleForm.hireDate" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" style="width: 260px;margin-right: -5px;">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="idType">
            <el-input class="widthFour" style="width:200px;">
              <template slot="prepend">证件类型</template>
              <el-select slot="suffix" v-model="ruleForm.idType" placeholder="请选择" style="width:120px;margin-right: -5px;">
                <el-option label="身份证" value="身份证"></el-option>
                <el-option label="护照" value="护照"></el-option>
                <el-option label="港澳台通行证" value="港澳台通行证"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="idNumber" label-width="5px">
            <el-input v-model="ruleForm.idNumber" auto-complete="off" style="width: 200px;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="userBirthday" label-width="15px">
            <el-input class="widthFour" style="width:245px;">
              <template slot="prepend">
                <span>出生日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="ruleForm.userBirthday" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" style="width: 166px;margin-right: -5px;">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="internationalCountryCode">
            <el-input class="widthThree" style="width:200px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>手机号</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.internationalCountryCode" placeholder="请选择" style="width:120px;margin-right: -5px;">
                <el-option v-for="item in internationalCountryCodes" :key="item.edicode1" :label="item.paramText" :value="item.edicode1">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="phoneNumber" label-width="5px">
            <el-input v-model="ruleForm.phoneNumber" auto-complete="off" style="width: 200px;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="jobPosition" label-width="15px">
            <el-input class="widthTwo1" v-model="ruleForm.jobPosition" style="width:245px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>岗位</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="employmentType">
            <el-input style="width:200px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>劳务类型</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.employmentType" placeholder="请选择" style="width:120px;margin-right: -5px;">
                <el-option label="全职" value="全职"></el-option>
                <el-option label="兼职" value="兼职"></el-option>
                <el-option label="外包" value="外包"></el-option>
                <el-option label="实习" value="实习"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="orderPermission">
            <el-input style="width:245px;margin-left: 205px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>订单权限</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.orderPermission" placeholder="请选择" style="width:165px;margin-right: -5px;">
                <el-option label="全部" value="0"></el-option>
                <el-option label="个人" value="1"></el-option>
                <el-option label="工作组" value="2"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="履历信息" prop="userResume" label-width="85px" class="textareaColor">
            <el-input type="textarea" :rows="2" v-model="ruleForm.userResume" auto-complete="off" style="width: 595px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="家庭信息" prop="userFamily" label-width="85px" class="textareaColor">
						<el-input type="textarea" :rows="2" v-model="ruleForm.userFamily" auto-complete="off" style="width: 595px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="备注信息" prop="userRemarks" label-width="85px" class="textareaColor">
						<el-input type="textarea" :rows="2" auto-complete="off" v-model="ruleForm.userRemarks" style="width: 595px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
          <el-form-item style="margin-left: 15px;">
            <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">立即创建</el-button>
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
			let identityCardCheckFlag = false;
			var identityCardCheck = (rule, value, callback) => {
				if(value != null && value != '') {
					if(this.ruleForm.idType == '身份证') {
						let regx = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						if(regx.test(value)) {
							identityCardCheckFlag = true
							let birthdayYear = value.substr(6, 4)
							let birthdayMon = value.substr(10, 2)
							let birthdayDay = value.substr(12, 2)
							let birthday = birthdayYear + "-" + birthdayMon + "-" + birthdayDay + " 00:00:00"
							let code = value.substr(14, 3)
							let sex = "";
							if(parseInt(code) % 2 == 0) {
								sex = "女"
							} else {
								sex = "男"
							}
							if(this.ruleForm.userBirthday == '' || this.ruleForm.userBirthday == null) {
								this.ruleForm.userBirthday = birthday
							}
							if(this.ruleForm.userSex == '') {
								this.ruleForm.userSex = sex
							}
							callback();
						} else {
							identityCardCheckFlag = false
							callback(new Error('身份证格式有误'));
						}
					} else {
						identityCardCheckFlag = false
						callback();
					}
				} else {
					callback()
				}
			};
			var birthdayCheck = (rule, value, callback) => {
				if(value != null && value != '') {
					if(this.ruleForm.idNumber != '' && identityCardCheckFlag && this.ruleForm.idType == '身份证') {
						let birthdayYear = this.ruleForm.idNumber.substr(6, 4)
						let birthdayMon = this.ruleForm.idNumber.substr(10, 2)
						let birthdayDay = this.ruleForm.idNumber.substr(12, 2)
						let birthday = birthdayYear + "-" + birthdayMon + "-" + birthdayDay + " 00:00:00"
						if(value != birthday) {
							callback("出生日期与身份证不相符");
						} else {
							callback();
						}
					} else {
						callback();
					}
				} else {
					callback()
				}
			};

			var sexCheck = (rule, value, callback) => {
				if(value != null && value != '') {
					if(this.ruleForm.idNumber != '' && identityCardCheckFlag && this.ruleForm.idType == '身份证') {
						let code = this.ruleForm.idNumber.substr(14, 3)
						if(parseInt(code) % 2 == 0) {
							if(value == "女") {
								callback();
							} else {
								callback("性别与身份证不相符");
							}
						} else {
							if(value == "男") {
								callback();
							} else {
								callback("性别与身份证不相符");
							}
						}
					} else {
						callback();
					}
				} else {
					callback()
				}
			};
			var checkPhoneNumber = (rule, value, callback) => {
			    if(value != null && value != ''){
              if(value.length < 11) {
                  callback("手机号号格式有误");
              } else {
                  let validStr = value.substr(value.length - 11, 11);
                  let regx = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                  if(regx.test(validStr)) {
                      callback();
                  } else {
                      callback("手机号号格式有误");
                  }
              }
          }else {
              callback()
          }
			};
			return {
				ruleForm: {
					deptId: '',
					//loginName: '',
					//jobNumber: '',
					userEmail: '',
					phoneNumber: '',
					userName: '',
					userEname: '',
					idType: '身份证',
					idNumber: '',
					userSex: '',
					userBirthday: '',
					hireDate: this.getCurrDate(),
					employmentType: '全职',
					userResume: '',
					userFamily: '',
					userRemarks: '',
					internationalCountryCode:'',
					jobPosition: '职员',
					//userStatus: 'true',
					roleIds: [],
          orderPermission: '0'
				},
				internationalCountryCodes:[],
				rules: {
					deptId: [{
						required: true,
						message: '请选择部门',
						trigger: ['blur', 'change']
					}],
					/*jobNumber: [{
							required: true,
							message: '请输入工号',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],*/
					userEmail: [{
							required: true,
							message: '请输入邮箱',
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					phoneNumber: [{
							required: true,
							message: '请输入手机号',
							trigger: ['blur', 'change']
						},
						/*{
							validator: checkPhoneNumber,
							trigger: ['blur', 'change']
						}*/
            {
                min: 0,
                max: 30,
                message: '手机号长度不超过 30',
                trigger: ['blur', 'change']
            }
					],
					userName: [{
							required: true,
							message: '请输入姓名',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					userEname: [{
							required: true,
							message: '请输入英文名',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					//					idType: [{
					//						required: true,
					//						message: '请选择证件类型',
					//						trigger: ['blur', 'change']
					//					}],
					idNumber: [
						//					{
						//							required: true,
						//							message: '请输入证件号码',
						//							trigger: ['blur', 'change']
						//						},
						{
							max: 20,
							message: '最大长度为20',
							trigger: ['blur', 'change']
						},
						{
							validator: identityCardCheck,
							trigger: ['blur', 'change']
						}
					],
					userSex: [
						//					{
						//						required: true,
						//						message: '请选择性别',
						//						trigger: ['blur', 'change']
						//					},
						{
							validator: sexCheck,
							trigger: ['blur', 'change']
						}
					],
					userBirthday: [
						//					{
						//						required: true,
						//						message: '请输入出生日期',
						//						trigger: ['blur', 'change']
						//					},
						{
							validator: birthdayCheck,
							trigger: ['blur', 'change']
						}
					],
					hireDate: [{
						required: true,
						message: '请输入雇佣日期',
						trigger: ['blur', 'change']
					}],
					employmentType: [{
						required: true,
						message: '请选择劳务类型',
						trigger: ['blur', 'change']
					}],
					jobPosition: [
						{
							min: 1,
							max: 40,
							message: '岗位长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					userResume: [{
						min: 0,
						max: 2000,
						message: '长度不超过 2000',
						trigger: ['blur', 'change']
					}],
					userFamily: [{
						min: 0,
						max: 2000,
						message: '长度不超过 2000',
						trigger: ['blur', 'change']
					}],
					userRemarks: [{
						min: 0,
						max: 2000,
						message: '长度不超过 2000',
						trigger: ['blur', 'change']
					}]
				},
				options: [],
				deptoptions: [],
				//				ifLoginName: false,
				loading: false
			};
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true
            this.ruleForm.userEmail = this.ruleForm.userEmail.toLowerCase();
						let params = this.ruleForm;
						this.$axios.post2('/hrs/user/saveUser', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.loading = false
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									this.loading = false
									//唯一性错误
									let errorinfo = response.data.messageInfo;
									if(errorinfo.indexOf('IDU_hrs_login_name') > -1)
										this.openError('邮箱不可重复');
									else if(errorinfo.indexOf('IDU_hrs_user_email1') > -1)
										this.openError('邮箱不可重复');
									else if(errorinfo.indexOf('IDU_hrs_phone_number') > -1)
										this.openError('手机号不可重复');
									else if(errorinfo.indexOf('IDU_hrs_id_number') > -1)
										this.openError('证件号码不可重复');
									else if(errorinfo.indexOf('IDU_hrs_job_number') > -1)
										this.openError('邮箱不可重复');
                  else if(errorinfo.indexOf('用户数量已经达到最大值') > -1)
                      this.openError(errorinfo);
									else
										this.openError(errorinfo);
								}

							}.bind(this)).catch(function(error) {
								this.loading = false
								if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
									this.openError(error.response.data.messageInfo);
								}
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.checkedCities = [];
				this.$refs[formName].resetFields();
				//				this.ifLoginName = false
				this.ruleForm.loginName = ''
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			changeRoleId() {
				if(this.ruleForm.roleIds != null && this.ruleForm.roleIds.length > 0) {
					this.ifLoginName = true
					if(this.ruleForm.loginName == '') {
						this.ruleForm.loginName = this.ruleForm.jobNumber
					}
				} else {
					this.ifLoginName = false
					this.ruleForm.loginName = ''
				}
			},
			sychronizeEname() {
				this.$refs['ruleForm'].validateField('userEmail', (valid) => {
					if(valid == '') {
						if(this.ruleForm.userEname == '') {
							this.ruleForm.userEname = this.ruleForm.userEmail.split("@")[0]
						}
					}
				})
			},
			getCurrDate() {
				//获取当前日期
				let date = new Date();
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if(months < 10) {
					months = '0' + months
				}
				if(days < 10) {
					days = '0' + days
				}
				return date.getFullYear() + '-' + months + '-' + days + " 00:00:00";
			}
		},
		created() {
			this.$axios.get('/hrs/role/list')
				.then(function(response) {
					this.options = response.data.data;
				}.bind(this));
			//
			this.$axios.post('/prm/coopagreement/selectDept')
				.then(function(response) {
					this.deptoptions = response.data.data.dataList;
				}.bind(this));

				//国际电话区域
			this.$axios.get('/hrs/org/listCategory/国际电话区号')
				.then(function(response) {
					this.internationalCountryCodes = response.data.data;
					if(this.internationalCountryCodes != null && this.internationalCountryCodes.length > 0) {
						this.ruleForm.internationalCountryCode = this.internationalCountryCodes[0].edicode1;
					}
				}.bind(this));

		},
		watch: {
			'ruleForm.jobNumber': function(val) {
				//				if(this.ifLoginName) {
				this.ruleForm.loginName = this.ruleForm.jobNumber
				//				}
			}
		}
	}
</script>
<style type="text/css">

  .hrsUserSave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .hrsUserSave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsUserSave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .hrsUserSave-ruleForm .widthTwo .el-input-group__prepend {
    padding: 0 20px;
  }

  .hrsUserSave-ruleForm .widthFour .el-input-group__prepend {
    padding: 0 12px;
  }

  .hrsUserSave-ruleForm .widthThree .el-input-group__prepend {
    padding: 0 13px;
  }

  .hrsUserSave-ruleForm .widthTwo1 .el-input-group__prepend {
    padding: 0 25px;
  }

  .hrsUserSave-ruleForm .widthTwo2 .el-input-group__prepend {
    padding: 0 20px;
  }

  .hrsUserSave-ruleForm .textareaColor .el-form-item__label {
    color: #909399;
  }
</style>
