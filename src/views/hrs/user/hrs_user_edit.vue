<template>
	<el-dialog title="用户管理 - 编辑" width="730px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose"  append-to-body>
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" class="hrsUserEdit-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<!--<el-form-item label="所属部门" prop="deptId" required label-width="85px">
						<el-select v-model="ruleForm.deptId" filterable placeholder="" style="width: 376px;">
							<el-option v-for="item in deptoptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>-->

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
					<!--<el-form-item label="角色" prop="roleIds" label-width="85px">
						<el-select v-model="ruleForm.roleIds" multiple placeholder="" style="width: 135px;">
							<el-option v-for="item in options" :key="item.roleId" :label="item.roleName" :value="item.roleId">
							</el-option>
						</el-select>
					</el-form-item>-->

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
          <!--<el-form-item label="姓名" prop="userName" required label-width="85px">
            <el-input v-model="ruleForm.userName" auto-complete="off" style="width: 150px;">
            </el-input>
            <el-select v-model="ruleForm.userSex" placeholder="" style="width: 63px;">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>-->

          <el-form-item prop="userName" label-width="15px">
            <el-input class="widthTwo" v-model.trim="ruleForm.userName" @input="ruleForm.userName = ruleForm.userName.replace(' ', '')" auto-complete="off" style="width:200px;margin-right: 15px;">
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
          <!--<el-form-item label="英文名" prop="userEname" required label-width="245px">
            <el-input v-model="ruleForm.userEname" auto-complete="off" style="width: 135px;">
            </el-input>
          </el-form-item>-->

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
					<!--<el-form-item label="邮箱" prop="userEmail" required label-width="85px">
						<el-input v-model="ruleForm.userEmail"  auto-complete="off" style="width: 376px;">
						</el-input>
					</el-form-item>-->

          <el-form-item prop="userEmail" label-width="15px">
            <el-input class="widthTwo" v-model="ruleForm.userEmail" style="width:295px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>邮箱</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <!--<el-form-item label="入职日期" prop="hireDate" required label-width="85px">
            <el-date-picker v-model="ruleForm.hireDate" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" style="width: 135px;">
            </el-date-picker>
          </el-form-item>-->

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
          <!--<el-form-item label="证件类型" prop="idType" label-width="85px">
            <el-select v-model="ruleForm.idType" placeholder="" style="width: 140px;">
              <el-option label="身份证" value="身份证"></el-option>
              <el-option label="护照" value="护照"></el-option>
              <el-option label="港澳台通行证" value="港澳台通行证"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>-->

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
          <!--<el-form-item label="出生日期" prop="userBirthday" label-width="85px">
            <el-date-picker v-model="ruleForm.userBirthday" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" style="width: 135px;">
            </el-date-picker>
          </el-form-item>-->

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
        <!--<el-col class="elementWidth">
          <el-form-item label="手机号" prop="phoneNumber" required label-width="85px">
             <el-select v-model="ruleForm.internationalCountryCode" placeholder="" style="width: 80px;">
				<el-option v-for="item in internationalCountryCodes" :key="item.edicode1" :label="item.paramText" :value="item.edicode1">
				</el-option>
			 </el-select>
            <el-input v-model="ruleForm.phoneNumber" auto-complete="off" style="width: 150px;">
            </el-input>
          </el-form-item>
        </el-col>-->
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
          <!--<el-form-item label="岗位" prop="jobPosition" label-width="55px">
            <el-input v-model="ruleForm.jobPosition" auto-complete="off" style="width: 130px;">
            </el-input>
          </el-form-item>-->

          <el-form-item prop="jobPosition" label-width="15px">
            <el-input class="widthTwo1" v-model="ruleForm.jobPosition" style="width:245px;margin-right: 15px;" auto-complete="off">
              <template slot="prepend">
                <span>岗位</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!--<el-col class="elementWidth">
          <el-form-item label="劳务类型" prop="employmentType" required label-width="85px">
            <el-select v-model="ruleForm.employmentType" placeholder="" style="width: 90px;">
              <el-option label="全职" value="全职"></el-option>
              <el-option label="兼职" value="兼职"></el-option>
              <el-option label="外包" value="外包"></el-option>
              <el-option label="实习" value="实习"></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
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
					<!--<el-form-item label="离职原因" label-width="85px">
						<el-input v-model="ruleForm.leaveReason" disabled style="width: 376px;">
						</el-input>
					</el-form-item>-->

          <el-form-item prop="leaveReason" label-width="15px">
            <el-input class="widthFour" v-model="ruleForm.leaveReason" style="width:405px;margin-right: 15px;" auto-complete="off" disabled>
              <template slot="prepend">
                <span>离职原因</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <!--<el-form-item label="离职日期" label-width="85px">
            <el-date-picker v-model="ruleForm.leaveDate" disabled type="date" value-format="yyyy-MM-dd 00:00:00" style="width: 135px;">
            </el-date-picker>
          </el-form-item>-->

          <el-form-item prop="leaveDate" label-width="2px">
            <el-input class="widthFour" style="width:245px;">
              <template slot="prepend">
                <span>离职日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="ruleForm.leaveDate" disabled type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="" style="width: 171px;margin-right: -5px;">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<!--<el-form-item label="黑名单原因" label-width="85px">
						<el-input v-model="ruleForm.blacklistReason" disabled style="width: 376px;">
						</el-input>
					</el-form-item>-->

          <el-form-item prop="blacklistReason" label-width="15px">
            <el-input class="widthFive" v-model="ruleForm.blacklistReason" style="width:405px;margin-right: 15px;" auto-complete="off" disabled>
              <template slot="prepend">
                <span>黑名单原因</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <!--<el-form-item label="黑名单日期" label-width="85px">
            <el-date-picker v-model="ruleForm.blacklistDate" disabled type="date" value-format="yyyy-MM-dd 00:00:00" style="width: 135px;">
            </el-date-picker>
          </el-form-item>-->

          <el-form-item prop="blacklistDate" label-width="2px">
            <el-input class="widthFive" style="width:245px;">
              <template slot="prepend">
                <span>黑名单日期</span>
              </template>
              <el-date-picker slot="suffix" v-model="ruleForm.blacklistDate" disabled type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="" style="width: 170px;margin-right: -5px;">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<!--<el-row>
				<el-col class="elementWidth">
					<el-form-item label="兼职" label-width="85px">
						<el-collapse>
							<el-collapse-item v-if="userDepts.length>0" :key="index" v-for="(dept,index) in userDepts" :title="'部门：'+dept.deptName+'&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;岗位：'+dept.jobPosition" disabled>
							</el-collapse-item>
							<el-collapse-item title="无" disabled v-if="userDepts.length==0"></el-collapse-item>
						</el-collapse>
					</el-form-item>
				</el-col>
			</el-row>-->
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
						<el-input type="textarea" :rows="2" v-model="ruleForm.userRemarks" auto-complete="off" style="width: 595px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
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
			},
			frow: Object
		},
		data() {
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
			let identityCardCheckFlag = false;
			var checkIdentityNumber = (rule, value, callback) => {
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
							//						if(this.ruleForm.userBirthday == '' || this.ruleForm.userBirthday == null) {
							this.ruleForm.userBirthday = birthday
							//						}
							//						if(this.ruleForm.userSex == '') {
							this.ruleForm.userSex = sex
							//						}
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
			return {
				ruleForm: {
					deptId: '',
					userId: '',
					loginName: '',
					//jobNumber: '',
					userEmail: '',
					phoneNumber: '',
					userName: '',
					userEname: '',
					idType: '',
					idNumber: '',
					userSex: '',
					userBirthday: '',
					hireDate: '',
					employmentType: '',
					userResume: '',
					userFamily: '',
					userRemarks: '',
					jobPosition: '',
					userStatus: '',
					leaveDate: '',
					leaveReason: '',
					blacklistDate: '',
					blacklistReason: '',
					internationalCountryCode:'',
					roleIds: [],
          orderPermission: ''
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
          phoneNumber: [
              /*{
                  validator: checkPhoneNumber,
                  trigger: ['blur', 'change']
              }*/
              {
							required: true,
							message: '请输入手机号',
							trigger: ['blur', 'change']
			},
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
							validator: checkIdentityNumber,
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
							message: '长度不超过 40',
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
				userDepts: [],
				//				ifLoginName: false,
				//				ifRoleIds: false,
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
        localStorage.setItem('orderPermission', this.ruleForm.orderPermission)//当前用户订单权限
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true
            this.ruleForm.userEmail = this.ruleForm.userEmail.toLowerCase();
						let params = this.ruleForm;
						this.$axios.put('/hrs/user/edit', params)
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
				this.init();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			init() {
				this.$axios.get('/hrs/role/list')
					.then(function(response) {
						this.options = response.data.data;
					}.bind(this));
				//
				this.$axios.post('/prm/coopagreement/selectDept')
					.then(function(response) {
						this.deptoptions = response.data.data.dataList;
						this.checkfDeptValid()
					}.bind(this));
				this.$axios.get('/hrs/user/' + this.frow.userId)
					.then(function(response) {
						if(response.data.code == 0) {
							this.ruleForm.deptId = response.data.data.deptId;
							this.ruleForm.userId = response.data.data.userId;
							this.ruleForm.loginName = response.data.data.loginName;
							//this.ruleForm.jobNumber = response.data.data.jobNumber;
							this.ruleForm.userEmail = response.data.data.userEmail;
							this.ruleForm.phoneNumber = response.data.data.phoneNumber;
							this.ruleForm.userName = response.data.data.userName;
							this.ruleForm.userEname = response.data.data.userEname;
							this.ruleForm.idType = response.data.data.idType;
							this.ruleForm.idNumber = response.data.data.idNumber;
							this.ruleForm.userSex = response.data.data.userSex;
							this.ruleForm.userBirthday = response.data.data.userBirthday;
							this.ruleForm.hireDate = response.data.data.hireDate;
							this.ruleForm.employmentType = response.data.data.employmentType;
							this.ruleForm.userResume = response.data.data.userResume;
							this.ruleForm.userFamily = response.data.data.userFamily;
							this.ruleForm.userRemarks = response.data.data.userRemarks;
							this.ruleForm.jobPosition = response.data.data.jobPosition;
							this.ruleForm.userStatus = response.data.data.userStatus;
							this.ruleForm.roleIds = response.data.data.roleIds;
							this.ruleForm.leaveDate = response.data.data.leaveDate;
							this.ruleForm.leaveReason = response.data.data.leaveReason;
							this.ruleForm.blacklistDate = response.data.data.blacklistDate;
							this.ruleForm.blacklistReason = response.data.data.blacklistReason;
							this.ruleForm.internationalCountryCode = response.data.data.internationalCountryCode;
              this.ruleForm.orderPermission = response.data.data.orderPermission+'';
							//							if(this.ruleForm.loginName != null && this.ruleForm.loginName != '') {
							//								this.ifLoginName = true
							//								this.ifRoleIds = true
							//							}
							this.checkfDeptValid()
						}
					}.bind(this));
				//查找兼职部门
				this.$axios.get('/hrs/userDept/partTimeJob/' + this.frow.userId)
					.then(function(response) {
						this.userDepts = response.data.data;
					}.bind(this));

			 //国际电话区域
			this.$axios.get('/hrs/org/listCategory/国际电话区号')
				.then(function(response) {
					this.internationalCountryCodes = response.data.data;
				}.bind(this));

			},
			checkfDeptValid() {
				if(this.deptoptions != null && this.deptoptions.length > 0 && this.ruleForm.deptId != null && this.ruleForm.deptId !== '') {
					let flag = false
					try {
						this.deptoptions.forEach((dept) => {
							if(dept.value == this.ruleForm.deptId) {
								flag = true
								throw new Error("finish")
							}
						})
					} catch(e) {
						if(e.message == 'finish') {
							console.log('finish')
						}
					}
					if(!flag) {
						this.ruleForm.deptId = null
					}
				}
			}
		},
		created() {
			this.init();
		}
	}
</script>
<style type="text/css">

  .hrsUserEdit-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .hrsUserEdit-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsUserEdit-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .hrsUserEdit-ruleForm .widthTwo .el-input-group__prepend {
    padding: 0 20px;
  }

  .hrsUserEdit-ruleForm .widthFour .el-input-group__prepend {
    padding: 0 12px;
  }

  .hrsUserEdit-ruleForm .widthThree .el-input-group__prepend {
    padding: 0 13px;
  }

  .hrsUserEdit-ruleForm .widthTwo1 .el-input-group__prepend {
    padding: 0 25px;
  }

  .hrsUserEdit-ruleForm .widthTwo2 .el-input-group__prepend {
    padding: 0 20px;
  }

  .hrsUserEdit-ruleForm .textareaColor .el-form-item__label {
    color: #909399;
  }

  .hrsUserEdit-ruleForm .widthFive .el-input-group__prepend {
    padding: 0 5px;
  }
</style>
