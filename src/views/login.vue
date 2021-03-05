<template>
	<div class="body-bg">
		<el-form ref="AccountForm" :model="account" :rules="rules" class="login-container">
			<div class="header-content">
				<div class="logo-part">
					<img src="../assets/logo.png" width="30" height="30">
					<span>EF物流生态云应用平台 </span>
				</div>
			</div>
			<!--<h3 class="title">欢迎登录</h3>-->
			<!--		<el-form-item prop="logintype">
				<el-select v-model="account.logintype" style="width: 96%;" placeholder="请选择登录方式">
					<el-option label="用户名" value="0"></el-option>
					<el-option label="手机号" value="1"></el-option>
					<el-option label="邮箱" value="2"></el-option>
				</el-select>
				<i style="color: red;">*</i>
			</el-form-item>-->
			<!--<el-form-item prop="orgid">
				<el-input @keyup.native.enter="enterLogin('orgid')" prefix-icon="iconfont el-icon-myqiye" style="width: 96%;" type="text" v-model="account.orgid" auto-complete="off" placeholder="请录入企业编码">
				</el-input>
				<i style="color: red;">*</i>
			</el-form-item>-->
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="手机号登录">
					<el-form-item prop="username" name="0">
						<el-select v-model="account.phoneArea" placeholder="" style="width: 75px;">
							<el-option v-for="item in phoneAreas" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-input @keyup.native.enter="enterLogin('username')" prefix-icon="iconfont el-icon-myuser" style="width: 68%;" type="text" v-model="account.username" auto-complete="off" placeholder="请录入手机号">
						</el-input>
						<i style="color: red;">*</i>
					</el-form-item>
					<el-form-item prop="pwd">
						<el-input @keyup.native.enter="enterLogin('pwd')" prefix-icon="iconfont el-icon-mymima" style="width: 96%;" type="password" v-model="account.pwd" :autofocus="pwdFocus" auto-complete="off" placeholder="请录入密码">
						</el-input>
						<i style="color: red;">*</i>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width:96%;" @click.native.prevent="handleLoginPhone" :disabled="allowLogin" :loading="loading">登录</el-button>
					</el-form-item>
					<div>
						<el-link href="http://account.efreight.cn" target="_self" style="font-size:13px;color: #409EFF;">个人用户注册</el-link>
						<el-link href="http://account.efreight.cn/reset" target="_self" style="font-size:13px;color: #409EFF; margin-left: 135px;">忘记密码</el-link>
					</div>
					<div style="margin-top: 10px;"><span style="font-size:12px;color:#909399;">推荐分辨率：1366*768 </span></div>
					<div><span style="font-size:12px;color:#909399;">推荐浏览器：360浏览器(极速模式) 、Chrome</span></div>
				</el-tab-pane>
				<el-tab-pane label="邮箱登录" name="1">
					<el-form-item prop="username">
						<el-input @keyup.native.enter="enterLogin('username')" autofocus="true" prefix-icon="iconfont el-icon-myuser" style="width: 96%;" type="text" v-model="account.username" auto-complete="off" placeholder="请录入邮箱">
						</el-input>
						<i style="color: red;">*</i>
					</el-form-item>
					<el-form-item prop="pwd">
						<el-input @keyup.native.enter="enterLogin('pwd')" prefix-icon="iconfont el-icon-mymima" style="width: 96%;" type="password" v-model="account.pwd" :autofocus="pwdFocus" auto-complete="off" placeholder="请录入密码">
						</el-input>
						<i style="color: red;">*</i>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width:96%;" @click.native.prevent="handleLoginEmail" :disabled="allowLogin" :loading="loading">登录</el-button>
					</el-form-item>
					<div>
						<el-link href="http://account.efreight.cn" target="_self" style="font-size:13px;color: #409EFF;">个人用户注册</el-link>
						<el-link href="http://account.efreight.cn/reset" target="_self" style="font-size:13px;color: #409EFF; margin-left: 135px;">忘记密码</el-link>
					</div>
					<div style="margin-top: 10px;"><span style="font-size:12px;color:#909399;">推荐分辨率：1366*768 </span></div>
					<div><span style="font-size:12px;color:#909399;">推荐浏览器：360浏览器(极速模式) 、Chrome</span></div>

				</el-tab-pane>
				<el-tab-pane label="管理员登录" name="2">
					<el-form-item prop="username">
						<el-input @keyup.native.enter="enterLogin('username')" autofocus="true" prefix-icon="iconfont el-icon-myuser" style="width: 96%;" type="text" v-model="account.username" auto-complete="off" placeholder="请录入账号">
						</el-input>
						<i style="color: red;">*</i>
					</el-form-item>
					<el-form-item prop="pwd">
						<el-input @keyup.native.enter="enterLogin('pwd')" prefix-icon="iconfont el-icon-mymima" style="width: 96%;" type="password" v-model="account.pwd" :autofocus="pwdFocus" auto-complete="off" placeholder="请录入密码">
						</el-input>
						<i style="color: red;">*</i>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width:96%;" @click.native.prevent="handleLoginAdmin" :disabled="allowLogin" :loading="loading">登录</el-button>
					</el-form-item>
					<div>
						<el-link href="http://account.efreight.cn" target="_self" style="font-size:13px;color: #409EFF;">个人用户注册</el-link>
						<el-link href="http://account.efreight.cn/reset" target="_self" style="font-size:13px;color: #409EFF; margin-left: 135px;">忘记密码</el-link>
					</div>
					<div style="margin-top: 10px;"><span style="font-size:12px;color:#909399;">推荐分辨率：1366*768 </span></div>
					<div><span style="font-size:12px;color:#909399;">推荐浏览器：360浏览器(极速模式) 、Chrome</span></div>
				</el-tab-pane>
			</el-tabs>

			<!--<div class="extra-text">
				<a href="javascript:void(0);" class="forget-pwd" title="找回密码">忘记密码?</a>
			</div>-->
		</el-form>
		<!--<div class="background-foot"></div>-->
	</div>
</template>
<script>
	export default {
		data() {
			var validateAccount = (rules, value, callback) => {
				this.validateCorrect();
				if (value === '') {
					callback(new Error(this.ruleMsg));
				} else {
					if (this.account.username !== '') {
						this.account.username = value;
					}
					callback();
				}
			};
			var validatePwd = (rules, value, callback) => {
				this.validateCorrect();
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.account.pwd !== '') {
						this.account.pwd = value;
					}
					callback();
				}
			};
			/*var validateorgid = (rules, value, callback) => {
				this.validateCorrect();
				if(value === '') {
					callback(new Error('请输入企业编码'));
				} else {
					if(this.account.orgid !== '') {
						this.account.orgid = value;
					}
					callback();
				}
			};*/
			var validateType = (rules, value, callback) => {
				this.validateCorrect();
				if (value === '') {
					callback(new Error('请选择登陆方式'));
				} else {
					if (this.account.logintype !== '') {
						this.account.logintype = value;
					}
					callback();
				}
			};
			return {
				data1: [],
				ruleMsg: "",
				activeName: "0",
				phoneAreas: [{
						name: "大陆",
						id: "0086"
					}, {
						name: "香港",
						id: "00852"
					},
					{
						name: "澳门",
						id: "00853"
					},
					{
						name: "台湾",
						id: "00886"
					}
				],
				loading: false,
				account: {
					username: '',
					pwd: '',
					//orgid: '',
					logintype: '0',
					phoneArea: '0086'
				},
				rules: {
					logintype: [{
						required: true,
						validator: validateType,
						trigger: 'change'
					}],
					username: [{
						required: true,
						validator: validateAccount,
						trigger: 'change'
					}],
					useremail: [{
						required: true,
						validator: validateAccount,
						trigger: 'change'
					}],
					pwd: [{
						required: true,
						validator: validatePwd,
						trigger: 'change'
					}],
					/*orgid: [{
						required: true,
						validator: validateorgid,
						trigger: 'change'
					}],*/
				},
				pwdFocus: false,
				allowLogin: true,
				checked: true,
				browserFlag: true
			};
		},
		created() {
			let browserInfo = navigator.userAgent.toLowerCase();
			//特殊排除webkit(谷歌内核) 其他浏览器 edge/搜狗/qq/UC/遨游/opera
			if (browserInfo.indexOf("chrome") < 0 || browserInfo.indexOf("edge") >= 0 || browserInfo.indexOf("se") >= 0 ||
				browserInfo.indexOf("qqbrowser") >= 0 || browserInfo.indexOf("ubrowser") >= 0 || browserInfo.indexOf("maxthon") >= 0 ||
				browserInfo.indexOf("opr") >= 0) {
				this.browserFlag = false;
			}
			let reg_user = JSON.parse(window.localStorage.getItem('register-user'));
			if (reg_user) {
				this.account.username = reg_user.username;
				this.account.pwd = '';
				this.pwdFocus = true;
			}
			let token = window.localStorage.getItem('access_token')
			if (token) {
				this.$router.push({
					path: '/'
				});
			}

			let logintype = window.localStorage.getItem('logintype');
			if (logintype) {
				this.activeName = logintype;
				if (this.activeName === '0') {
					this.ruleMsg = "请输入手机号";
				}
				if (this.activeName === '1') {
					this.ruleMsg = "请输入邮箱";
				}
				if (this.activeName === '2') {
					this.ruleMsg = "请输入管理员账号";
				}
			} else {
				this.ruleMsg = "请输入手机号";
			}

		},
		methods: {
			handleClick(tab, event) {
				if (tab.name === '1') {
					this.ruleMsg = "请输入邮箱";
					this.$refs.AccountForm.validateField('username');
				} else if (tab.name === '2') {
					this.ruleMsg = "请输入管理员账号";
					this.$refs.AccountForm.validateField('username');
				} else {
					this.ruleMsg = "请输入手机号";
					this.$refs.AccountForm.validateField('username');
				}
			},
			handleLoginPhone() { //手机号登录
				let that = this;
				let authori = 'ZWZyZWlnaHQ6ZWZyZWlnaHQ=';
        this.loading = true;
				//手机号登录  根据手机号以及区号匹配用户信息 如果匹配 获取对应的签约公司编码
				this.$axios.get2('/hrs/user/searchLoginNameAndOrgCode', {
					phoneNumber: this.account.username,
					internationalCountryCode: this.account.phoneArea
				}).then(function(response) {
					if (response.data.code == '0') {
						this.data1 = response.data.data;
						if (this.data1.length == 0) {
							this.$notify.error({
								title: '错误',
								message: '手机号不存在'
							});
							this.loading = false
							return;
						} else if (this.data1[0].orgCode == null || this.data1[0].orgCode == '') {
							this.$notify.error({
								title: '错误',
								message: '用户不存在'
							});
							this.loading = false
							return;
						} else {
							let params = {
								username: '0' + '|' + this.data1[0].loginName + '|' + this.data1[0].orgCode,
								password: this.account.pwd,
								grant_type: 'password',
								client_id: 'efreight',
								client_secret: 'efreight',
                loginType: '手机号登录'
							};
							this.$axios.post(
									'/auth/oauth/token',
									params, {
										headers: {
											isToken: false,
											Authorization: 'Basic ' + authori
										}

									})
								.then(function(response) {
									localStorage.setItem('logintype', 0);
									localStorage.setItem('browserFlag', this.browserFlag);
									localStorage.setItem('orgCode', this.data1[0].orgCode);
									localStorage.setItem('orgName', this.data1[0].orgName);
									localStorage.setItem('orgVersion', this.data1[0].orgVersion);
									localStorage.setItem('orgType', this.data1[0].orgType);
									localStorage.setItem('userEmail', this.data1[0].userEmail);
                  localStorage.setItem('stopDate', this.data1[0].stopDate);
                  localStorage.setItem('orgUuid', this.data1[0].orgUuid);
                  localStorage.setItem('adminRole', "unAdmin");
									localStorage.setItem('username', response.data.userName);
									localStorage.setItem('nickname', response.data.userCname);
									localStorage.setItem('phoneNumber', response.data.phoneNumber);
									localStorage.setItem('access_token', response.data.access_token);
									localStorage.setItem('token_type', response.data.token_type);
									localStorage.setItem('refresh_token', response.data.refresh_token);
									localStorage.setItem('expires_in', response.data.expires_in);
									localStorage.setItem('scope', response.data.scope);
									localStorage.setItem('license', response.data.license);
									localStorage.setItem('deptId', response.data.deptId);
									localStorage.setItem('userId', response.data.userId);
									localStorage.setItem('orgId', response.data.orgId);
									localStorage.setItem('loginRole', "ordinaryUser"); //标记是以普通用户角色登录
									localStorage.setItem('orderEditNewPage', response.data.orderEditNewPage)
									localStorage.setItem('orderSaveClosePage', response.data.orderSaveClosePage)
									localStorage.setItem('orderFinanceLockView', this.data1[0].orderFinanceLockView)
                  localStorage.setItem('userWorkgroupDetailList', this.data1[0].userWorkgroupDetailList)//当前用户所属工作组集合
                  localStorage.setItem('orderPermission', this.data1[0].orderPermission)//当前用户订单权限
                  localStorage.setItem('rountingSign', this.data1[0].rountingSign)//航线签单
                  localStorage.setItem('rountingSignBusinessProduct', this.data1[0].rountingSignBusinessProduct)//航线签单-服务产品
									//获取当前用户的菜单,，放到localStorage中
									that.getButtonInfo();
									that.getUserMenu();
								}.bind(this)).catch(function(error) {
									that.$message.error("登录失败: " + error.response.data.messagInfo);
									that.loading = false;
								});
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '用户不存在'
						});
					}
				}.bind(this)).catch(function(error) {
					console.log(error)
				});

			},
			//邮箱登录
			handleLoginEmail() {
				let that = this;
				let authori = 'ZWZyZWlnaHQ6ZWZyZWlnaHQ=';
				/*let emailReg = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
				if(emailReg.test(this.account.username)) {
					this.account.logintype = "2";
				} else {
					this.account.logintype = "0";
				}*/
				//如果录入的内容 包含@ 和 . 则 认为是邮箱
				this.loading = true;
				//邮箱登录 查找对应用户 登录名，且获取 用户的 签约公司 编码；进行登录
				this.$axios.get2('/hrs/user/searchLoginNameAndOrgCode', {
					userEmail: this.account.username.toLowerCase(),
				}).then(function(response) {
					if (response.data.code == '0') {
						this.data1 = response.data.data;
						if (this.data1.length == 0) {
							this.$notify.error({
								title: '错误',
								message: '邮箱不存在'
							});
							this.loading = false
							return;
						} else if (this.data1[0].orgCode == null || this.data1[0].orgCode == '') {
							this.$notify.error({
								title: '错误',
								message: '用户不存在'
							});
							this.loading = false
							return;
						} else {
							let params = {
								username: '0' + '|' + this.data1[0].loginName + '|' + this.data1[0].orgCode,
								password: this.account.pwd,
								grant_type: 'password',
								client_id: 'efreight',
								client_secret: 'efreight',
                loginType: '邮箱登录'
							};
							this.$axios.post(
									'/auth/oauth/token',
									params, {
										headers: {
											isToken: false,
											Authorization: 'Basic ' + authori
										}

									})
								.then(function(response) {
									localStorage.setItem('logintype', 1);
									localStorage.setItem('browserFlag', this.browserFlag);
									localStorage.setItem('orgCode', this.data1[0].orgCode);
									localStorage.setItem('orgName', this.data1[0].orgName);
									localStorage.setItem('orgVersion', this.data1[0].orgVersion);
									localStorage.setItem('orgType', this.data1[0].orgType);
									localStorage.setItem('userEmail', this.data1[0].userEmail);
                  localStorage.setItem('stopDate', this.data1[0].stopDate);
                  localStorage.setItem('orgUuid', this.data1[0].orgUuid);
                  localStorage.setItem('adminRole', "unAdmin");
									localStorage.setItem('username', response.data.userName);
									localStorage.setItem('nickname', response.data.userCname);
									localStorage.setItem('phoneNumber', response.data.phoneNumber);
									localStorage.setItem('access_token', response.data.access_token);
									localStorage.setItem('token_type', response.data.token_type);
									localStorage.setItem('refresh_token', response.data.refresh_token);
									localStorage.setItem('expires_in', response.data.expires_in);
									localStorage.setItem('scope', response.data.scope);
									localStorage.setItem('license', response.data.license);
									localStorage.setItem('deptId', response.data.deptId);
									localStorage.setItem('userId', response.data.userId);
									localStorage.setItem('orgId', response.data.orgId);
									localStorage.setItem('loginRole', "ordinaryUser"); //标记是以普通用户角色登录
									localStorage.setItem('orderEditNewPage', response.data.orderEditNewPage)
									localStorage.setItem('orderSaveClosePage', response.data.orderSaveClosePage)
									localStorage.setItem('orderFinanceLockView', this.data1[0].orderFinanceLockView)
                  localStorage.setItem('userWorkgroupDetailList', this.data1[0].userWorkgroupDetailList)//当前用户所属工作组集合
                  localStorage.setItem('orderPermission', this.data1[0].orderPermission)//当前用户订单权限
                  localStorage.setItem('rountingSign', this.data1[0].rountingSign)//航线签单
                  localStorage.setItem('rountingSignBusinessProduct', this.data1[0].rountingSignBusinessProduct)//航线签单-服务产品
									//获取当前用户的菜单,，放到localStorage中
									that.getUserMenu();
									that.getButtonInfo();
									//that.getUserAllMenu();//得到除了超级管理员拥有的所有菜单
								}.bind(this)).catch(function(error) {
									that.$message.error("登录失败: " + error.response.data.messagInfo);
									that.loading = false;
								});
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '用户不存在'
						});
					}
				}.bind(this)).catch(function(error) {
					console.log(error)
				});
			},
			handleLoginAdmin() { //管理员登录
				let that = this;
				let authori = 'ZWZyZWlnaHQ6ZWZyZWlnaHQ=';
        this.loading = true;
				//管理员登录，查询 isadmin=1 的 登录名，如果匹配 获取对应的签约公司编码
				this.$axios.get2('/hrs/user/searchLoginNameAndOrgCode', {
					loginName: this.account.username,
				}).then(function(response) {
					if (response.data.code == '0') {
						this.data1 = response.data.data;
						if (this.data1.length == 0) {
							this.$notify.error({
								title: '错误',
								message: '用户不存在'
							});
							this.loading = false
							return;
						} else if (this.data1[0].orgCode == null || this.data1[0].orgCode == '') {
							this.$notify.error({
								title: '错误',
								message: '用户不存在'
							});
							this.loading = false
							return;
						} else {
							let params = {
								username: '0' + '|' + this.account.username + '|' + this.data1[0].orgCode,
								password: this.account.pwd,
								grant_type: 'password',
								client_id: 'efreight',
								client_secret: 'efreight',
                loginType: '管理员登录'
							};
							this.$axios.post(
									'/auth/oauth/token',
									params, {
										headers: {
											isToken: false,
											Authorization: 'Basic ' + authori
										}

									})
								.then(function(response) {
									localStorage.setItem('logintype', 2);
									localStorage.setItem('browserFlag', this.browserFlag);
									localStorage.setItem('orgCode', this.data1[0].orgCode);
									localStorage.setItem('orgName', this.data1[0].orgName);
									localStorage.setItem('orgVersion', this.data1[0].orgVersion);
									localStorage.setItem('orgType', this.data1[0].orgType);
									localStorage.setItem('userEmail', this.data1[0].userEmail);
                  localStorage.setItem('stopDate', this.data1[0].stopDate);
									localStorage.setItem('adminRole', this.data1[0].adminRole); //标记是超级管理员还是签约公司管理员
                  localStorage.setItem('orgUuid', this.data1[0].orgUuid);
                  localStorage.setItem('username', response.data.userName);
									localStorage.setItem('nickname', response.data.userCname);
									localStorage.setItem('phoneNumber', response.data.phoneNumber);
									localStorage.setItem('access_token', response.data.access_token);
									localStorage.setItem('token_type', response.data.token_type);
									localStorage.setItem('refresh_token', response.data.refresh_token);
									localStorage.setItem('expires_in', response.data.expires_in);
									localStorage.setItem('scope', response.data.scope);
									localStorage.setItem('license', response.data.license);
									localStorage.setItem('deptId', response.data.deptId);
									localStorage.setItem('userId', response.data.userId);
									localStorage.setItem('orgId', response.data.orgId);
									localStorage.setItem('loginRole', "admin"); //标记是以管理员角色登录
									localStorage.setItem('orderEditNewPage', response.data.orderEditNewPage)
									localStorage.setItem('orderSaveClosePage', response.data.orderSaveClosePage)
									localStorage.setItem('orderFinanceLockView', this.data1[0].orderFinanceLockView)
                  localStorage.setItem('userWorkgroupDetailList', this.data1[0].userWorkgroupDetailList)//当前用户所属工作组集合
                  localStorage.setItem('orderPermission', this.data1[0].orderPermission)//当前用户订单权限
                  localStorage.setItem('rountingSign', this.data1[0].rountingSign)//航线签单
                  localStorage.setItem('rountingSignBusinessProduct', this.data1[0].rountingSignBusinessProduct)//航线签单-服务产品
									//获取当前用户的菜单,，放到localStorage中
									that.getButtonInfo();
									that.getUserMenuForAdmin();
								}.bind(this)).catch(function(error) {
									that.$message.error("登录失败: " + error.response.data.messagInfo);
									that.loading = false;
								});
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '用户不存在'
						});
					}
				}.bind(this)).catch(function(error) {
					console.log(error)
				});

			},
			validateCorrect() {
				//if(this.account.orgid.trim().length > 0 && this.account.pwd.trim().length > 0 && this.account.username.trim().length > 0 && this.account.logintype.trim().length > 0) {
				if (this.account.pwd.trim().length > 0 && this.account.username.trim().length > 0 && this.account.logintype.trim().length > 0) {
					this.allowLogin = false;
				} else {
					this.allowLogin = true;
				}
			},
			//获取按钮权限
			getButtonInfo() {
				this.$axios.get('/hrs/permission/getButtonInfo')
					.then(function(response) {
						let buttonInfo = response.data.data;
						localStorage.setItem('buttonInfo', JSON.stringify(buttonInfo));
					}.bind(this)).catch(function(error) {
						console.log(error);
					}).finally(function() {
						this.loading = false;
					}.bind(this));
			},
			//获取菜单
			getUserMenu() {
				let user = window.localStorage.getItem('access_token')
				if (!user) {
					this.loading = false;
					next({
						path: '/login'
					})

				} else {
					this.$axios.get('/hrs/permission/getAllPermissionAndHave')
						.then(function(response) {
							let menu = response.data.data;

              let param ={
                 checkJt:''
              }
              //处理是否满足集团分析报表
              this.$axios.get2('/hrs/org/getOrgChild',param).then((response) => {
              	  if(response.data.data&&response.data.data.length>0){
                  }else{
                    let index = '';
                    if(menu&&menu.length>0){
                       for(let i=0;i<menu.length;i++){
                           if(menu[i].name=='集团分析报表'){
                               index = i;
                           }
                       }
                       if(index){
                         this.$delete(menu,index);
                       }
                    }
                  }
                  // console.log(menu);
                  localStorage.setItem('menuinfo', JSON.stringify(menu));
                  this.$router.push({
                  	path: '/'
                  });
              })
							//							road.$emit('goto', '/');
						}.bind(this)).catch(function(error) {
							console.log(error);
						}).finally(function() {
							this.loading = false;
						}.bind(this));

					/*this.$axios.get('/hrs/permission')
					    .then(function(response) {
					        console.log(response);
					        let menu = response.data.data;
					        localStorage.setItem('menuinfo1', JSON.stringify(menu));
					        this.$router.push({
					            path: '/'
					        });
					        //							road.$emit('goto', '/');
					    }.bind(this)).catch(function(error) {
					    console.log(error);
					}).finally(function() {
					    this.loading = false;
					}.bind(this));*/
				}
			},
			//获取菜单
			getUserMenuForAdmin() {
				let user = window.localStorage.getItem('access_token')
				if (!user) {
					this.loading = false;
					next({
						path: '/login'
					})

				} else {
					this.$axios.get('/hrs/permission')
						.then(function(response) {
							let menu = response.data.data;
							localStorage.setItem('menuinfo', JSON.stringify(menu));
							this.$router.push({
								path: '/'
							});
							//							road.$emit('goto', '/');
						}.bind(this)).catch(function(error) {
							console.log(error);
						}).finally(function() {
							this.loading = false;
						}.bind(this));
				}
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			enterLogin(val) {
				this.$refs.AccountForm.validate((flag) => {
					if (flag) {
						this.handleLogin()
					}
				})
			}
		}
	}
</script>
<style scoped>
	.body-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow-y: auto;
		background-color: #80c2fe;
		background-image: url(../assets/login_background.jpg);
		background-repeat: no-repeat;
		background-position: 100% 100%;
		background-size: contain;
	}

	.background-foot {
		background-image: url(../assets/login_background.jpg);
		width: 100%;
		height: 145px;
	}

	.header-content {
		top: 0;
		width: 370px;
		height: 68px;
		padding: 20px 40px;
		border-bottom: 1px solid #ddd;
		/*box-shadow: 0 0 2px #80c2fe;*/
		/*background: linear-gradient(left, #137DFA, #479BFF);*/
		background: -webkit-gradient(linear, left top, right top, from(#137DFA), to(#479BFF));
		margin: 0px 0px 25px -48px;
	}

	.header-content .logo-part {
		font-size: 20px;
		color: white;
	}

	.header-content .logo-part img {
		vertical-align: middle;
	}

	.login-container {
		/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		margin: 130px auto auto;
		width: 370px;
		height: 415px;
		padding: 0px 40px 5px 48px;
		background: #fff;
		/*border: 1px solid #eaeaea;*/
		box-shadow: 0 0 25px #80c2fe;
		background: -ms-linear-gradient(top, #ace, #00C1DE);
		/* IE 10 */
		background: -moz-linear-gradient(top, #ace, #00C1DE);
		/*火狐*/
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE));
		/*谷歌*/
		background: -webkit-linear-gradient(top, #ace, #00C1DE);
		/*Safari5.1 Chrome 10+*/
		background: -o-linear-gradient(top, #ace, #00C1DE);
		/*Opera 11.10+*/
	}

	.login-container .title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}

	.login-container .remember {
		margin: 0px 0px 35px 0px;
	}

	.extra-text {
		position: relative;
		margin-bottom: 5px;
		padding-left: 205px;
	}

	.extra-text a {
		font-size: 12px;
		color: #aaa;
	}

	.extra-text a:hover {
		color: #29e;
	}

	.extra-text .reg-text {
		position: absolute;
		top: 4px;
		right: 2px;
	}

	.el-form-item {
		margin-bottom: 20px;
	}
</style>
