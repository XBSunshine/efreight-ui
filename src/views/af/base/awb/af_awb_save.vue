<template>
	<el-dialog title="" width="700px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" class="afAwbSave-ruleForm" style="margin-left: 15px;">
			<div style="margin-top: -15px;margin-bottom: 20px;">
				<span style="font-size: 18px;margin-bottom: 20px;">主单号管理&nbsp;-&nbsp;新增</span>
				<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
				</el-link>
			</div>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="awb3" label-width="15px">
            <el-input v-model="ruleForm.awb3" @change="ruleForm.awb3=strTrim(ruleForm.awb3)" style="width:180px;margin-right: 15px;" auto-complete="off" :disabled="disabledFlag">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>起始主运单号</span>
              </template>
            </el-input>
            -
          </el-form-item>
          <el-form-item prop="awb8" label-width="15px">
            <el-input v-model="ruleForm.awb8" @change="ruleForm.awb8=strTrim(ruleForm.awb8)" style="width:100px;margin-right: 15px;" auto-complete="off" :disabled="disabledFlag">
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="awbcount" label-width="15px">
            <el-input v-model="ruleForm.awbcount" @change="ruleForm.awbcount=strTrim(ruleForm.awbcount)" style="width:130px;margin-right: 15px;" auto-complete="off" :disabled="disabledFlag">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>数量</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="departureStation" label-width="15px">
            <el-input v-model="ruleForm.departureStation"  @input="ruleForm.departureStation=ruleForm.departureStation.toUpperCase()" @change="ruleForm.departureStation=strTrim(ruleForm.departureStation)" style="width:130px;margin-right: 15px;" auto-complete="off" :disabled="disabledFlag">
              <template slot="prepend">
                <span>始发港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>

			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="awbFromType" label-width="10px">
            <el-input style="width:189px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>运单来源</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.awbFromType" filterable placeholder="请选择" clearable style="width: 110px;margin-right: -5px" @change="awbFromTypeChange" :disabled="disabledFlag">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="awbFromName">
            <el-input  readOnly v-model="ruleForm.awbFromName" style="width:428px;margin-right: 15px;" @change="ruleForm.awbFromName=strTrim(ruleForm.awbFromName)" :disabled=true>
              <el-button slot="append" @click="gotoSelectPage('ruleForm')" :disabled="disabledFlag" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>

				</el-col>
			</el-row>
			<el-row>
				<el-button type="primary" size="small" @click="getAwbList('ruleForm')" :disabled="disabledFlag">生成总运单号</el-button>
			</el-row>
			<el-row style="margin-top: 5px;">

				<el-table :data="data1" height="250px" style="width: 630px;">
					<el-table-column prop="number" label="序号" align="center" width="160"></el-table-column>
					<el-table-column prop="awbNumber" align="center" label="总运单号" width="470"></el-table-column>
				</el-table>

			</el-row>
			<el-row>
				<el-form-item style="height: 40px;">
					<el-button type="primary" size="small" @click="submitForm('ruleForm')" :disabled="!disabledFlag">保存主单</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<save ref="addMission" v-if="save" :visible.sync="save" :frow="ffrow"></save>
	</el-dialog>
</template>
<script>
	import save from './af_awb_select'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			var checkNumber1 = (rule, value, callback) => {
				// let regE = /^[0-9]*[0-9][0-9]*$/g;
				let regE = /^[0-9]\d{2}$/;
				if(!regE.test(value)) {
					callback(new Error('请输入3位数字'));
				} else {
					callback();
				}
			};
			var checkNumber2 = (rule, value, callback) => {
				// let regE = /^[0-9]*[0-9][0-9]*$/g;
				let regE = /^[0-9]\d{7}$/;
				if(!regE.test(value)) {
					callback(new Error('请输入8位数字'));
				} else {
					callback();
				}
			};
			var checkNumber3 = (rule, value, callback) => {
				// let regE = /^[0-9]*[0-9][0-9]*$/g;
				let regE = /^[0-9]\d{0,3}$/;
				if(!regE.test(value)) {
					callback(new Error('最大4位数字'));
				} else if(value <= 0) {
					callback(new Error('必须大于0'));
				} else {
					callback();
				}
			};
			return {
				helpDocumentUrl: '',
				data1: [],
				options2: [],
				save: false,
				disabledFlag: false,
				ffrow: {
					awbFromType: ''
				},
				ruleForm: {
					awb3: '',
					awb8: '',
					awbcount: '',
					departureStation: '',
					awbFromType: '',
					awbFromId: '',
					awbFromName: ''
				},
				rules: {
					awb3: [{
							required: true,
							message: '请输入三字码',
							trigger: ['blur', 'change']
						},
						{
							min: 3,
							max: 3,
							message: '长度为 3',
							trigger: ['blur', 'change']
						},
						{
							validator: checkNumber1,
							trigger: ['blur', 'change']
						}

					],
					awb8: [{
							required: true,
							message: '请输入主单号',
							trigger: ['blur', 'change']
						},
						{
							min: 8,
							max: 8,
							message: '长度为 8',
							trigger: ['blur', 'change']
						},
						{
							validator: checkNumber2,
							trigger: ['blur', 'change']
						}
					],
					awbcount: [{
							required: true,
							message: '请输入数量',
							trigger: ['blur', 'change']
						},
						{
							validator: checkNumber3,
							trigger: ['blur', 'change']
						}
					],
					awbFromType: [{
						required: true,
						message: '请选择运单来源',
						trigger: ['blur', 'change']
					}],
					awbFromName: [{
						required: true,
						message: '请选择运单来源公司',
						trigger: ['blur', 'change']
					}]
				}
			};
		},
		inject: ['queryList'],
		components: {
			'save': save
		},
		provide() {
			return {
				setValue: this.setValue
			}
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
			awbFromTypeChange() {
				this.ruleForm.awbFromId = '';
				this.ruleForm.awbFromName = '';
			},
			gotoSelectPage() {
				if(!this.ruleForm.awbFromType) {
					this.openError('请选择运单来源');
					return;
				}
				this.ffrow.awbFromType = this.ruleForm.awbFromType;
				this.save = true;
			},
			setValue(rrow) {
				this.ruleForm.awbFromId = rrow.coopIdV;
				this.ruleForm.awbFromName = rrow.coopNameV;
			},
			getAwbList(formName) {
				let awb7 = this.ruleForm.awb8.substring(0, 7) % 7;
				let awb1 = this.ruleForm.awb8.substring(7);
				if(awb7 != awb1) {
					this.openError("起始主单号不符合规则");
					return;
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$axios.post2('/afbase/awb/getAwbList', this.ruleForm)
							.then(function(response) {
								if(response.data.code == 0) {
									this.data1 = response.data.data;
									this.disabledFlag = true;
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
			submitForm(formName) {
				let awb7 = this.ruleForm.awb8.substring(0, 7) % 7;
				let awb1 = this.ruleForm.awb8.substring(7);
				if(awb7 != awb1) {
					this.openError("起始主单号不符合规则");
					return;
				}

				this.$refs[formName].validate((valid) => {
					if(valid) {
						let params = this.ruleForm;
						this.$axios.post2('/afbase/awb/checkAwbList', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.$confirm('是否继续保存?', '提示', {
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
										center: true
									}).then(() => {
										this.doSave();
									}).catch(() => {

									});

								} else {
									let errorinfo = response.data.messageInfo;
									if(errorinfo.indexOf('是否继续保存') > -1) {
										this.$confirm(errorinfo + '?', '提示', {
											confirmButtonText: '确定',
											cancelButtonText: '取消',
											type: 'warning',
											center: true
										}).then(() => {
											this.doSave();
										}).catch(() => {

										});
									} else {
										this.openError(errorinfo);
									}

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
			doSave() {
				let params = this.ruleForm;
				this.$axios.post2('/afbase/awb', params)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.queryList();
							this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;

						this.openError(errorinfo);
					}.bind(this));
			},
			resetForm(formName) {
				this.checkedCities = [];
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		},
		created() {
			this.$axios.get('/hrs/permission/' + 128)
				.then(function(response) {
					if(response.data.code == 0) {
						this.helpDocumentUrl = response.data.data.helpDocumentUrl;
					}
				}.bind(this));

			this.$axios.get('/afbase/awb/selectCategory?category=运单所属').then(function(response) {
				this.options2 = response.data.data;
			}.bind(this));
		}
	}
</script>
<style type="text/css">

  .afAwbSave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afAwbSave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afAwbSave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
