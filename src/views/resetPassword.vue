<template>
	<div class="body-bg">
		<el-form ref="AccountForm" :model="account" :rules="rules" class="login-container">
			<div class="header-content">
				<div class="logo-part">
					<img src="../assets/logo.png" width="30" height="30">
					<span>EF物流生态云应用平台 </span>
				</div>
			</div>
			<el-form-item>
				<el-input prefix-icon="iconfont el-icon-myuser" style="width: 96%;" disabled v-model="account.username">
				</el-input>
			</el-form-item>
			<el-form-item prop="oldPassword">
				<el-input @keyup.native.enter="submit('AccountForm')" prefix-icon="iconfont el-icon-myyuanmimajiumima" style="width: 96%;" type="password" v-model="account.oldPassword" :autofocus="pwdFocus" auto-complete="off" placeholder="请录入原密码">
				</el-input>
				<i style="color: red;">*</i>
			</el-form-item>
			<el-form-item prop="newPassword1">
				<el-input @keyup.native.enter="submit('AccountForm')" prefix-icon="iconfont el-icon-myxinmima1" style="width: 96%;" type="password" v-model="account.newPassword1" :autofocus="pwdFocus" auto-complete="off" placeholder="请录入新密码">
				</el-input>
				<i style="color: red;">*</i>
			</el-form-item>
			<el-form-item prop="newPassword2">
				<el-input @keyup.native.enter="submit('AccountForm')" prefix-icon="iconfont el-icon-myquerenmima" style="width: 96%;" type="password" v-model="account.newPassword2" :autofocus="pwdFocus" auto-complete="off" placeholder="请确定新密码">
				</el-input>
				<i style="color: red;">*</i>
			</el-form-item>
			<el-form-item>
				<el-button :loading="loading" type="primary" style="width:45%;" @click.native.prevent="submit('AccountForm')">修改密码</el-button>
				<el-button type="primary" style="width:45%;" @click="goBack">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		name: 'resetPassword',
		data() {

			var validateNewPwd = (rules, value, callback) => {
				let regx = /^[a-zA-Z\d]+$/;
				if(regx.test(value)) {
					callback();
				} else {
					callback("请录入数字或者字母");
				}
			};
			return {
				account: {
					username: window.localStorage.getItem('username').split('_')[1] || '',
					oldPassword: '',
					newPassword1: '',
					newPassword2: ''
				},
				rules: {
					oldPassword: [{
						required: true,
						message: "请输入原密码",
						trigger: 'change'
					}],
					newPassword1: [{
						required: true,
						message: "请输入新密码",
						trigger: 'change'
					}, {
						validator: validateNewPwd,
						trigger: 'change'
					}, {
						min: 6,
						max: 10,
						message: '请录入6-10位',
						trigger: 'change'
					}],
					newPassword2: [{
						required: true,
						message: "请确定新密码",
						trigger: 'change'
					}, {
						validator: validateNewPwd,
						trigger: 'change'
					}, {
						min: 6,
						max: 10,
						message: '请录入6-10位',
						trigger: 'change'
					}]
				},
				pwdFocus: false,
				loading: false
			};
		},
		created() {

		},
		methods: {
			submit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.account.newPassword1 != this.account.newPassword2) {
							this.$message.error("新密码与确认密码不一致");
							return
						}
						this.loading = true
						let params = {
							userId: localStorage.getItem('userId'),
							oldPassword: this.account.oldPassword,
							newPassword: this.account.newPassword1
						}
						this.$axios.post2('/hrs/user/modifyPassward', params)
							.then((response) => {
								if(response.data.code == '0') {
									this.loginOut();
								} else {
									this.loading = false
									this.$message.error("修改失败: " + response.data.messageInfo);
								}
							}).catch((error) => {
								this.loading = false
								this.$message.error("修改失败: " + error.response.data.messageInfo);
							});
					}
				});
			},
			goBack() {
				window.history.go(-1);
			},
			loginOut() {
				this.$axios.deletes('/auth/token/logout')
					.then((response) => {
						if(response.data.code == '0') {
							localStorage.removeItem('logintype');
							localStorage.removeItem('orgCode');
							localStorage.removeItem('username');
							localStorage.removeItem('token_type');
							localStorage.removeItem('access_token');
							localStorage.removeItem('license');
							localStorage.removeItem('scope');
							localStorage.removeItem('refresh_token');
							localStorage.removeItem('expires_in');
							localStorage.removeItem('deptId');
							localStorage.removeItem('userId');
							localStorage.removeItem('orgId');
							localStorage.removeItem('menuinfo');
              let source = window.localStorage.getItem('source');
              if(source&&source=='ef'){
                localStorage.removeItem('source');
              }
							this.$message.success("修改成功，请重新登录");
							setTimeout(() => {
								this.loading = false
								this.$router.push("/login");
							}, 1000)
						} else {
							this.loading = false
							this.$message.error("修改失败: " + response.data.messageInfo);
						}
					}).catch((error) => {
						this.loading = false
						this.$message.error("修改失败: " + error.response.data.messageInfo);
					});

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
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		margin: 130px auto auto;
		width: 370px;
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