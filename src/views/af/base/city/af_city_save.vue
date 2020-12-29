<template>
	<el-dialog title="城市 - 新增" width="750px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-left: 10px;" class="afCitySave-ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityCode">
            <el-input v-model="ruleForm.cityCode" auto-complete="off" clearable style="width: 200px;" @input="ruleForm.cityCode = ruleForm.cityCode.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>城市代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityNameCn">
            <el-input v-model="ruleForm.cityNameCn" auto-complete="off" clearable style="width: 490px;" @input="ruleForm.cityNameCn = ruleForm.cityNameCn.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>城市中文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityTelCode">
            <el-input class="widthFour" v-model="ruleForm.cityTelCode" auto-complete="off" clearable style="width: 200px;">
              <template slot="prepend">
                <span>电话区号</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityNameEn">
            <el-input v-model="ruleForm.cityNameEn" auto-complete="off" clearable style="width: 490px;" @input="ruleForm.cityNameEn = ruleForm.cityNameEn.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>城市英文名称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="nationCode">
            <el-input class="widthFour" v-model="ruleForm.nationCode" auto-complete="off" clearable style="width: 200px;" @input="ruleForm.nationCode = ruleForm.nationCode.toUpperCase()">
              <template slot="prepend">
                <span>国家代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item>
            <el-col class="elementWidth">
              <el-form-item label-width="10px" prop="apLongitude">
                <el-input class="widthSix" v-model="ruleForm.apLongitude" auto-complete="off" clearable style="width: 210px;">
                  <template slot="prepend">
                    <span>城市 经度 纬度</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px" prop="apLatitude">
                <el-input v-model="ruleForm.apLatitude" auto-complete="off" clearable style="width: 110px;">
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="timeZone">
            <el-input v-model="ruleForm.timeZone" auto-complete="off" clearable style="width: 150px;">
              <template slot="prepend">
                <span>时区</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-form-item label-width="10px">
					<el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" size="small">保存</el-button>
					<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
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
			return {
				loading: false,
				ruleForm: {
					cityCode: '',
					cityNameCn: '',
					cityNameEn: '',
					nationCode: '',
					apLongitude: '',
					apLatitude: '',
          cityTelCode: '',
          timeZone: '',
				},
				rules: {
					cityCode: [{
						required: true,
						message: '请输入城市代码',
						trigger: ['blur', 'change']
					}, {
						max: 5,
						message: '长度不超过5',
						trigger: ['blur', 'change']
					}],
					cityNameCn: [{
						required: true,
						message: '请输入城市中文名称',
						trigger: ['blur', 'change']
					}, {
						max: 200,
						message: '长度不超过200',
						trigger: ['blur', 'change']
					}],
					cityNameEn: [{
						required: true,
						message: '请输入城市英文名称',
						trigger: ['blur', 'change']
					}, {
						max: 200,
						message: '长度不超过200',
						trigger: ['blur', 'change']
					}],
					nationCode: [{
						max: 5,
						message: '长度不超过5',
						trigger: ['blur', 'change']
					}],
					timeZone: [{
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					apLongitude: [{
						max: 80,
						message: '长度不超过80',
						trigger: ['blur', 'change']
					}],
					apLatitude: [{
						max: 80,
						message: '长度不超过80',
						trigger: ['blur', 'change']
					}],
          cityTelCode: [{
              max: 5,
              message: '长度不超过5',
              trigger: ['blur', 'change']
          }],
				}
			}
		},
		methods: {
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2("/afbase/city/doSave", params)
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
								this.openError(response.data.messageInfo || "");
							}.bind(this))
					} else {
						return false;
					}
				});
			}
		},
		created() {

		}
	}
</script>
<style type="text/css">

  .afCitySave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afCitySave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afCitySave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .afCitySave-ruleForm .widthFour .el-input-group__prepend {
    padding: 0 11px;
  }

  .afCitySave-ruleForm .widthTwo .el-input-group__prepend {
    padding: 0 40px;
  }

  .afCitySave-ruleForm .widthSix .el-input-group__prepend {
    padding: 0 7px;
  }

</style>
