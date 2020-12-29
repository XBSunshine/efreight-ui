<template>
	<el-dialog title="TACT - 复制新增" width="730px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" :close-on-press-escape="false" ref="ruleForm" label-width="85px" style="margin-left: 10px;" class="afTactCopy">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="carrierCode" label-width="15px">
            <el-input class="" v-model="ruleForm.carrierCode" clearable style="width:320px;margin-right: 15px;" auto-complete="off" @input="ruleForm.carrierCode = ruleForm.carrierCode.toUpperCase()">
              <template slot="prepend">
                <span>航司两字码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="beginDate" label-width="15px">
            <el-input style="width:320px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>生效日期</span>
              </template>
              <el-date-picker slot="suffix" style="width: 242px;margin-right: -5px;" v-model="ruleForm.beginDate" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                              placeholder="选择日期">
              </el-date-picker>
            </el-input>
           <!-- &nbsp;&nbsp;&nbsp;- -->
          </el-form-item>
        </el-col>
       <!-- <el-col class="elementWidth">
          <el-form-item prop="endDate" label-width="15px">
            <el-input style="width:146px;">
              <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="ruleForm.endDate" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                              placeholder="选择日期">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col> -->
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="departureStation" label-width="15px">
            <el-input class="widthThreeXing" v-model="ruleForm.departureStation" clearable style="width:320px;margin-right: 15px;" auto-complete="off" @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>始发港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="arrivalStation" label-width="15px">
            <el-input class="widthThree1" v-model="ruleForm.arrivalStation" clearable style="width:320px;margin-right: 15px;" auto-complete="off" @input="ruleForm.arrivalStation = ruleForm.arrivalStation.toUpperCase()">
              <template slot="prepend">
                <span>目的港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="tactM" label-width="15px">
            <el-input class="widthOne" v-model="ruleForm.tactM" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tactM')">
              <template slot="prepend">
                <span>M</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tactN" label-width="15px">
            <el-input class="widthOne" v-model="ruleForm.tactN" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tactN')">
              <template slot="prepend">
                <span>N</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact45" label-width="15px">
            <el-input class="widthTwo" v-model="ruleForm.tact45" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact45')">
              <template slot="prepend">
                <span>45+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact100" label-width="15px">
            <el-input class="widthThree" v-model="ruleForm.tact100" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact100')">
              <template slot="prepend">
                <span>100+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="tact300" label-width="15px">
            <el-input class="widthThree" v-model="ruleForm.tact300" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact300')">
              <template slot="prepend">
                <span>300+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact500" label-width="15px">
            <el-input class="widthThree" v-model="ruleForm.tact500" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact500')">
              <template slot="prepend">
                <span>500+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact700" label-width="15px">
            <el-input class="widthThree" v-model="ruleForm.tact700" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact700')">
              <template slot="prepend">
                <span>700+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact1000" label-width="15px">
            <el-input class="" v-model="ruleForm.tact1000" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact1000')">
              <template slot="prepend">
                <span>1000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="tact2000" label-width="15px">
            <el-input class="" v-model="ruleForm.tact2000" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact2000')">
              <template slot="prepend">
                <span>2000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact3000" label-width="15px">
            <el-input class="" v-model="ruleForm.tact3000" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact3000')">
              <template slot="prepend">
                <span>3000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact5000" label-width="15px">
            <el-input class="" v-model="ruleForm.tact5000" clearable style="width:145px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('tact5000')">
              <template slot="prepend">
                <span>5000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col style="margin-left: -50px;">
          <el-form-item>
            <el-row>
              <el-button type="text" style="margin-left: -20px;color: #909399" disabled>备注</el-button>
            </el-row>
            <el-input type="textarea" :rows="3" show-word-limit maxlength="500" v-model="ruleForm.tactRemark" auto-complete="off" style="width:668px;margin-left: -20px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row style="text-align: left">
          <el-form-item label-width="15px">
            <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
            <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
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
			// let checkEndDate = (rule, value, callback) => {
			// 	if(value !== '' && value != null) {
			// 		if(this.ruleForm.beginDate !== '' && this.ruleForm.beginDate != null) {
			// 			let beginDate = new Date(this.ruleForm.beginDate)
			// 			let endDate = new Date(this.ruleForm.endDate)
			// 			//					endDate.setHours(0)
			// 			//					endDate.setMinutes(0)
			// 			//					endDate.setSeconds(0)
			// 			if(beginDate.getTime() > endDate.getTime()) {
			// 				callback('结束时间不能小于开始时间');
			// 			} else {
			// 				callback();
			// 			}
			// 		} else {
			// 			callback();
			// 		}
			// 	} else {
			// 		callback();
			// 	}
			// }
			// let checkStartDate = (rule, value, callback) => {
			// 	if(value !== '' && value != null) {
			// 		if(this.ruleForm.endDate !== '' && this.ruleForm.endDate != null) {
			// 			let beginDate = new Date(this.ruleForm.beginDate)
			// 			let endDate = new Date(this.ruleForm.endDate)
			// 			//					endDate.setHours(0)
			// 			//					endDate.setMinutes(0)
			// 			//					endDate.setSeconds(0)
			// 			if(beginDate.getTime() > endDate.getTime()) {
			// 				callback('开始时间不能大于结束时间');
			// 			} else {
			// 				callback();
			// 			}
			// 		} else {
			// 			callback();
			// 		}
			// 	} else {
			// 		callback();
			// 	}
			// }
			return {
				loading: false,
				//表单字段
				ruleForm: {
					carrierCode: "",
					departureStation: "",
					arrivalStation: "",
					beginDate: "",
					endDate: "",
					tactM: "",
					tactN: "",
					tact45: "",
					tact100: "",
					tact300: "",
					tact500: "",
					tact700: "",
					tact1000: "",
					tact2000: "",
					tact3000: "",
					tact5000: "",
          tactRemark:""
				},
				//验证规则
				rules: {
					carrierCode: [{
						max: 2,
						message: '长度不超过2',
						trigger: ['blur', 'change']
					}],
					departureStation: [{
						required: true,
						message: '请输入始发港',
						trigger: ['blur', 'change']
					}, {
						max: 4,
						message: '长度不超过4',
						trigger: ['blur', 'change']
					}],
					beginDate: [{
						required: true,
						message: '请输入生效日期',
						trigger: ['blur', 'change']
					}
     //      , {
					// 	validator: checkStartDate,
					// 	trigger: ['blur', 'change']
					// }
          ]
     //      ,
					// endDate: [{
					// 	validator: checkEndDate,
					// 	trigger: ['blur', 'change']
					// }]
				}
			}
		},
		inject: ['queryList'],
		created() {
			this.ruleForm.carrierCode = this.frow.carrierCode
			this.ruleForm.departureStation = this.frow.departureStation
			this.ruleForm.arrivalStation = this.frow.arrivalStation
      this.ruleForm.beginDate = this.getDateTime(new Date());
			// this.ruleForm.endDate = this.frow.endDate
			this.ruleForm.tactM = this.frow.tactM
			this.ruleForm.tactN = this.frow.tactN
			this.ruleForm.tact45 = this.frow.tact45
			this.ruleForm.tact100 = this.frow.tact100
			this.ruleForm.tact300 = this.frow.tact300
			this.ruleForm.tact500 = this.frow.tact500
			this.ruleForm.tact700 = this.frow.tact700
			this.ruleForm.tact1000 = this.frow.tact1000
			this.ruleForm.tact2000 = this.frow.tact2000
			this.ruleForm.tact3000 = this.frow.tact3000
			this.ruleForm.tact5000 = this.frow.tact5000
		},
		methods: {
      getDateTime(theDate) {
      	let _year = theDate.getFullYear();
      	let _month = theDate.getMonth();
        _month = _month+1;
        let _day = theDate.getDate();
      	if (_month < 10) {
      		_month = "0" + _month;
      	}
        if(_day<10){
          _day = "0" + _day;
        }
      	return _year + "-" + _month + "-"+_day+" 00:00:00";
      },
			handleClose() {
				this.$emit("update:visible", false);
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2("/afbase/tact/doSave", params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.loading = false;
									this.openSuccess();
									this.handleClose();
								} else {
									this.loading = false;
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.loading = false;
								this.openError(error.response.data.messageInfo || "");
							}.bind(this));
					} else {
						console.log("error submit!");
						return false;
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			formatToFloat(item) {
				if(!item) {
					return
				}
				this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789.]/g, "");
				let t = this.ruleForm[item].split('.');
				if(t.length > 1) {
					this.ruleForm[item] = t[0] + "." + t[1].substr(0, 2);
				}
			}
		}
	}
</script>

<style type="text/css">

  .afTactCopy .el-input__icon {
    line-height: 30px !important;
  }

  .afTactCopy .el-form-item__content {
    line-height: 30px !important;
  }

  .afTactCopy .el-input-group__prepend {
    padding: 0 6px;
  }

  .afTactCopy .widthOne .el-input-group__prepend {
    padding: 0 20px;
  }

  .afTactCopy .widthThree .el-input-group__prepend {
    padding: 0 10px;
  }

  .afTactCopy .widthTwo .el-input-group__prepend {
    padding: 0 14px;
  }

  .afTactCopy .widthThreeXing .el-input-group__prepend {
    padding: 0 15px;
  }

  .afTactCopy .widthThree1 .el-input-group__prepend {
    padding: 0 18px;
  }

</style>
