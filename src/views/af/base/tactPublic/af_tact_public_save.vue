<template>
	<el-dialog title="TACT公布价" width="1030px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" :close-on-press-escape="false" ref="ruleForm" style="margin-left: 10px;" class="afTactSave">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="productName">
            <el-input class="elinputDiv" v-model="ruleForm.productName" auto-complete="off" @input="ruleForm.productName = ruleForm.productName">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>产品名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="beginDate">
            <el-input class="elinputDiv">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>生效日期</span>
              </template>
              <el-date-picker slot="suffix" class="elInputChild" v-model="ruleForm.beginDate" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                              placeholder="选择日期">
              </el-date-picker>
            </el-input>
          </el-form-item>
				</el-col>
       <el-col class="elementWidth">
          <el-form-item prop="endDate">
            <el-input class="elinputDiv">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>失效日期</span>
              </template>
              <el-date-picker slot="suffix" class="elInputChild" v-model="ruleForm.endDate" clearable type="date" value-format="yyyy-MM-dd 23:59:59"
                              placeholder="选择日期">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="departureStation">
            <el-input class="elinputDiv mySpan" v-model="ruleForm.departureStation" clearable auto-complete="off" @input="ruleForm.departureStation = ruleForm.departureStation.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>始发港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="transitStation">
            <el-input class="elinputDiv threeSpan" v-model="ruleForm.transitStation" clearable auto-complete="off" @input="ruleForm.transitStation = ruleForm.transitStation.toUpperCase()">
              <template slot="prepend">
                <span>中转港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="arrivalStation">
            <el-input class="elinputDiv mySpan" v-model="ruleForm.arrivalStation" auto-complete="off" @input="ruleForm.arrivalStation = ruleForm.arrivalStation.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>目的港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="densityClass">
            <el-input class="elinputDiv fourSpan" v-model="ruleForm.densityClass" auto-complete="off" @input="ruleForm.densityClass = ruleForm.densityClass">
              <template slot="prepend">
                <span>密度等级</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="carrierCode">
            <el-input class="elinputDiv carrierCodeSpan" v-model="ruleForm.carrierCode" auto-complete="off" @input="ruleForm.carrierCode = ruleForm.carrierCode.toUpperCase()">
              <template slot="prepend">
                <span>航司</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="goodsType">
            <el-input class="elinputDiv fourSpan" v-model="ruleForm.goodsType" auto-complete="off">
              <template slot="prepend">
                <span>货物类型</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="tactM">
            <el-input class="widthOne oneSpan" v-model="ruleForm.tactM" clearable auto-complete="off" @input="formatToFloat('tactM')">
              <template slot="prepend">
                <span>M</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tactN">
            <el-input class="widthOne oneSpan" v-model="ruleForm.tactN" clearable auto-complete="off" @input="formatToFloat('tactN')">
              <template slot="prepend">
                <span>N</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact45">
            <el-input class="widthOne my45Span" v-model="ruleForm.tact45" clearable auto-complete="off" @input="formatToFloat('tact45')">
              <template slot="prepend">
                <span>45+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact100">
            <el-input class="widthOne twoSpan" v-model="ruleForm.tact100" clearable auto-complete="off" @input="formatToFloat('tact100')">
              <template slot="prepend">
                <span>100+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="tact300">
            <el-input class="widthOne twoSpan" v-model="ruleForm.tact300" clearable auto-complete="off" @input="formatToFloat('tact300')">
              <template slot="prepend">
                <span>300+</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="tact500">
            <el-input class="widthOne" v-model="ruleForm.tact500" clearable auto-complete="off" @input="formatToFloat('tact500')">
              <template slot="prepend">
                <span>500+</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="tact700">
            <el-input class="widthOne threeSpan" v-model="ruleForm.tact700" clearable auto-complete="off" @input="formatToFloat('tact700')">
              <template slot="prepend">
                <span>700+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact1000">
            <el-input class="widthOne" v-model="ruleForm.tact1000" clearable auto-complete="off" @input="formatToFloat('tact1000')">
              <template slot="prepend">
                <span>1000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact2000">
            <el-input class="widthOne" v-model="ruleForm.tact2000" clearable auto-complete="off" @input="formatToFloat('tact2000')">
              <template slot="prepend">
                <span>2000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact3000">
            <el-input class="widthOne" v-model="ruleForm.tact3000" clearable auto-complete="off" @input="formatToFloat('tact3000')">
              <template slot="prepend">
                <span>3000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="tact5000">
            <el-input class="widthOne" v-model="ruleForm.tact5000" clearable auto-complete="off" @input="formatToFloat('tact5000')">
              <template slot="prepend">
                <span>5000+</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-row>
              <el-button type="text" style="color: #909399;margin-left: 10px;" disabled>备注</el-button>
            </el-row>
            <el-input type="textarea" :rows="3" show-word-limit maxlength="500" v-model="ruleForm.tactRemark" auto-complete="off" style="width:919px;margin-left: 10px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row style="text-align: left">
					<el-form-item label-width="15px">
						<el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
						<el-button size="small" @click="resetForm()">重置</el-button>
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
			let checkEndDate = (rule, value, callback) => {
				if(value !== '' && value != null) {
					if(this.ruleForm.beginDate !== '' && this.ruleForm.beginDate != null) {
						let beginDate = new Date(this.ruleForm.beginDate)
						let endDate = new Date(this.ruleForm.endDate)
						//					endDate.setHours(0)
						//					endDate.setMinutes(0)
						//					endDate.setSeconds(0)
						if(beginDate.getTime() > endDate.getTime()) {
							callback('结束时间不能小于开始时间');
						} else {
							callback();
						}
					} else {
						callback();
					}
				} else {
					callback();
				}
			}
			let checkStartDate = (rule, value, callback) => {
				if(value !== '' && value != null) {
					if(this.ruleForm.endDate !== '' && this.ruleForm.endDate != null) {
						let beginDate = new Date(this.ruleForm.beginDate)
						let endDate = new Date(this.ruleForm.endDate)
						//					endDate.setHours(0)
						//					endDate.setMinutes(0)
						//					endDate.setSeconds(0)
						if(beginDate.getTime() > endDate.getTime()) {
							callback('开始时间不能大于结束时间');
						} else {
							callback();
						}
					} else {
						callback();
					}
				} else {
					callback();
				}
			}

      var checkNumber = (rule, value, callback) => {
        let regE =/^[0-9]\d{0,7}$/;
        let regE2=/^\d{1,8}([\.]\d{0,2})$/
        if (!value || regE.test(value) || regE2.test(value)) {
          callback();
        }else {
          callback(new Error('整数最大8位，小数最大2位'));
        }
      };

			return {
				loading: false,
				//表单字段
        tabType:'adeleteTactdd',
				ruleForm: {
          publishPriceId: "",
          productName: "",
					carrierCode: "",
					departureStation: "",
					arrivalStation: "",
          transitStation: "",
          densityClass: "",
          goodsType: "",
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
          productName: [{
            required: true,
            message: '请输入产品名称',
            trigger: ['blur', 'change']
          }, {
						max: 200,
						message: '长度不超过200',
						trigger: ['blur', 'change']
					}],
          carrierCode: [{
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
          beginDate: [{
            required: true,
            message: '请输入生效日期',
            trigger: ['blur', 'change']
          }, {
            validator: checkStartDate,
            trigger: ['blur', 'change']
          }],
          endDate: [{
            required: true,
            message: '请输入失效日期',
            trigger: ['blur', 'change']
          }, {
            validator: checkEndDate,
            trigger: ['blur', 'change']
          }],
					departureStation: [{
						required: true,
						message: '请输入始发港',
						trigger: ['blur', 'change']
					}, {
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
					transitStation: [{
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
					arrivalStation: [{
						required: true,
						message: '请输入目的港',
						trigger: ['blur', 'change']
					}, {
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
					densityClass: [{
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
					goodsType: [{
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
          tactM: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tactN: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact45: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact100: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact300: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact500: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact700: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact1000: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact2000: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact3000: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tact5000: [{
              validator: checkNumber,
              trigger: ['blur', 'change']
            }],
          tactRemark: [{
            max: 500,
            message: '长度不超过500',
            trigger: ['blur', 'change']
            }]
				}
			}
		},
		inject: ['queryList'],
    created() {
      this.ruleForm.beginDate = this.$parent.getDateTime(new Date());
      this.init();
    },
		methods: {
      init(){
        this.$nextTick(()=>{
          this.$refs['ruleForm'].resetFields();
        })
        // if(!tabType){
        //   $('.el-dialog__title').text('TACT公布价 - 新增');
        // }else if(tabType=='copy'){
        //   $('.el-dialog__title').text('TACT公布价 - 复制');
        // }else{
        //   $('.el-dialog__title').text('TACT公布价 - 编辑');
        // }
        let tactId = this.frow.publishPriceId;
        let tabType = this.frow.tabType;
        if(!!tactId) {
          this.$axios.get("/afbase/tactPublic/" + tactId)
            .then((response)=>{
              if(response.data.code == 0 && response.data.data){
                let data = response.data.data;
                for (let ruleFormKey in this.ruleForm) {
                  this.ruleForm[ruleFormKey] = data[ruleFormKey] || "";
                }
                if(tabType == 'copy'){
                  this.ruleForm.publishPriceId = '';
                }
              }else{
                this.openError("数据加载失败");
              }
            })
        }
      },
			//关闭
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
						this.$axios.post2("/afbase/tactPublic/doSave", params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.loading = false;
									this.openSuccess();
                  this.$parent.queryList();
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
			resetForm() {
        this.$nextTick(()=>{
          this.$refs['ruleForm'].resetFields();
        })
			},
			formatToFloat(item) {
				if(!item) {
					return
        }
        this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789.]/g, "");
        let t = this.ruleForm[item].split('.');
        if (t.length > 1) {
          this.ruleForm[item] = t[0] + "." + t[1].substr(0, 2);
        }
      }
    }
  }
</script>
<style type="text/css" scoped>

.afTactSave .el-input__icon {
  line-height: 30px !important;
}

.afTactSave .el-form-item__content {
  line-height: 30px !important;
}

.afTactSave .el-input-group__prepend {
    padding: 0 6px;
  }
  .widthOne{
    width: 140px !important;
    margin-left: 15px;
  }
  .widthOne .el-input-group__prepend {
    padding: 0 13px;
  }
  .elinputDiv{
    width: 295px !important;
    margin-left: 15px;
  }
  .elinputDiv .elInputChild {
    width: 216px !important;
    margin-right: -5px;
  }

  .oneSpan .el-input-group__prepend{
    padding: 0 28px;
  }
  .twoSpan .el-input-group__prepend{
    padding: 0 17px;
  }
  .threeSpan .el-input-group__prepend{
    padding: 0 18px;
  }
  .fourSpan .el-input-group__prepend{
    padding: 0 11px;
  }
  .mySpan .el-input-group__prepend{
    padding: 0 13px;
  }
  .my45Span .el-input-group__prepend{
    padding: 0 21px;
  }
  .carrierCodeSpan .el-input-group__prepend{
    padding: 0 25px;
  }

</style>
