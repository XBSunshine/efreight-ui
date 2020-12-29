<template>
	<el-dialog title="公告 - 新建" width="580px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm notice-save" >
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="noticeTitle">
						<el-input v-model="ruleForm.noticeTitle" auto-complete="off">
              <template slot="prepend"><span style="color:red">*</span>主题</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" style="margin-left: 10px">
					<el-form-item prop="noticeDate" >
            <el-input style="width: 237px">
              <template slot="prepend"><span style="color:red">*</span>公告时间</template>
              <el-date-picker slot="suffix" v-model="ruleForm.noticeDate" style="width: 135px;margin-right: -5px" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
            </el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="内容" prop="noticeText" label-width="74px">
						<el-input type="textarea" v-model="ruleForm.noticeText" maxlength="100" show-word-limit auto-complete="off" clearable style="width: 450px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="noticeType">
            <el-input style="width: 237px">
              <template slot="prepend"><span style="color:red">*</span>公告类型</template>
              <el-select slot="suffix" v-model="ruleForm.noticeType" placeholder="" style="width: 135px; margin-right: -5px">
                <el-option label="系统更新" value="XTGX"></el-option>
                <el-option label="系统维护" value="XTWH"></el-option>
                <el-option label="活动推广" value="HDTG"></el-option>
              </el-select>
            </el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth" style="margin-left: 10px">
					<el-form-item prop="pushType" >
            <el-input style="width: 277px">
              <template slot="prepend"><span style="color:red">*</span>推送级别</template>
              <el-select slot="suffix" v-model="ruleForm.pushType" placeholder="" @change="changePushType" style="width: 174px; margin-right: -5px">
                <el-option label="全部用户" value="1"></el-option>
                <el-option label="全部管理员" value="2"></el-option>
                <el-option label="签约公司全部用户" value="3"></el-option>
              </el-select>
            </el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item  prop="pushOrg" v-if="isShowPushOrg">
            <el-input style="width: 520px">
              <template slot="prepend"><span style="color:red">*</span>组织机构</template>
              <el-select slot="suffix" v-model="ruleForm.pushOrg" filterable placeholder="" style="width: 417px;margin-right: -5px">
                <el-option v-for="org in orgs" :key="org.orgId" :label="org.orgName" :value="org.orgId">
                </el-option>
              </el-select>
            </el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">保存</el-button>
					<el-button size="small" type="primary" @click="confirmSubmitFormAndSend('ruleForm')" plain>保存并发送邮件</el-button>
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
			var checkNumber = (rule, value, callback) => {
				if(value) {
					setTimeout(() => {
						if(!Number.isInteger(value)) {
							callback(new Error('请输入数字值'));
						} else {
							if(value < 0) {
								callback(new Error('必须大于0'));
							} else {
								callback();
							}
						}
					}, 1000);
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					noticeId: '',
					noticeTitle: '',
					noticeDate: this.getCurrDateAndCurrMonthLastDay()[0],
					noticeText: '',
					noticeFile: '',
					noticeType: '',
					pushType: '',
					pushOrg: ''
				},
				rules: {
					noticeTitle: [{
						required: true,
						message: '请录入主题',
						trigger: ['blur', 'change']
					}, {
						max: 50,
						message: '最大长度为50',
						trigger: ['blur', 'change']
					}],
					noticeDate: [{
						required: true,
						message: '请录入公告日期',
						trigger: ['blur', 'change']
					}],
					noticeText: [{
						required: true,
						message: '请录入公告内容',
						trigger: ['blur', 'change']
					}],
					noticeType: [{
						required: true,
						message: '请选择公告类型',
						trigger: ['blur', 'change']
					}],
					pushType: [{
						required: true,
						message: '请选择推送级别',
						trigger: ['blur', 'change']
					}],
					pushOrg: [{
						required: true,
						message: '请选择组织机构',
						trigger: ['blur', 'change']
					}]
				},
				isShowPushOrg: false,
				orgs: []
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
						if(this.ruleForm.pushType == '3' && this.ruleForm.pushOrg == '') {
							this.openError("当前推送级别为签约公司全部用户，组织机构为必填项");
							return;
						}
						this.ruleForm.sendFlag = 'save'
						let params = this.ruleForm;
						this.$axios.post2('/hrs/notice', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
      submitFormAndSend(formName) {
			    if(this.ruleForm.pushType != '2'){
              this.openError("只有推送级别为全部管理员才可以保存并发送");
			        return;
          }
          this.$refs[formName].validate((valid) => {
              if(valid) {
                  if(this.ruleForm.pushType == '3' && this.ruleForm.pushOrg == '') {
                      this.openError("当前推送级别为签约公司全部用户，组织机构为必填项");
                      return;
                  }
                  this.ruleForm.sendFlag = 'saveAndSend'
                  let params = this.ruleForm;
                  this.$axios.post2('/hrs/notice', params)
                      .then(function(response) {
                          if(response.data.code == 0) {
                              this.openSuccess();
                              this.findByPage();
                              this.handleClose();
                          } else {
                              this.openError(response.data.messageInfo);
                          }

							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
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
			changePushType() {
				if(this.ruleForm.pushType == '3') {
					this.isShowPushOrg = true
				} else {
					this.isShowPushOrg = false;
					this.ruleForm.pushOrg = '';
				}
			},
      getCurrDateAndCurrMonthLastDay() {
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
          let datas = date.getFullYear() + '-' + months + '-' + days;

          //获取当月最后一天
          let currentMonth = date.getMonth();
          let nextMonth = ++currentMonth;
          let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
          let oneDay = 1000 * 60 * 60 * 24;
          let lastTime = new Date(nextMonthFirstDay - oneDay);
          let month = parseInt(lastTime.getMonth() + 1);
          let day = lastTime.getDate();
          if(month < 10) {
              month = '0' + month
          }
          if(day < 10) {
              day = '0' + day
          }
          //当月最后一天
          let data = date.getFullYear() + '-' + month + '-' + day + " 23:59:59";
          let result = []
          result.push(datas)
          result.push(data)
          return result
      },
      confirmSubmitFormAndSend(formName){
        this.$confirm('请确认是否保存并发送邮件？', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.submitFormAndSend(formName);
        }).catch(() => {});

      },
		},
		created() {
			this.$axios.get('/hrs/org')
				.then(function(response) {
					this.orgs = response.data.data;
				}.bind(this));
		},

	}
</script>
<style type="text/css">
  .notice-save .el-input__icon{
    line-height: 30px !important;
  }
  .notice-save .el-form-item__content{
    line-height: 0px;
  }
  .notice-save .el-textarea .el-input__count{
    bottom:26px;
  }
</style>
