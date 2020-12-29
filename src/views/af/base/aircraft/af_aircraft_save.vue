<template>
	<el-dialog title="机型 - 新增" width="660px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-left: 10px;" class="afAircraftSave-ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="aircraftType">
            <el-input v-model="ruleForm.aircraftType" auto-complete="off" @input="ruleForm.aircraftType=ruleForm.aircraftType.toUpperCase()" clearable style="width: 280px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>飞机类型</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="aircraftTypeNameEn">
            <el-input v-model="ruleForm.aircraftTypeNameEn" auto-complete="off" clearable style="width: 320px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>飞机类型英文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="powerType">
            <el-input v-model="ruleForm.powerType" auto-complete="off" clearable style="width: 280px;" >
              <template slot="prepend">
                <span>动&nbsp;力&nbsp;类&thinsp;型</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
            <el-form-item label-width="10px" prop="aircraftTypePc">
              <el-input class="widthFour" style="width:320px;">
                <template slot="prepend">&emsp;宽&nbsp;体&nbsp;/&nbsp;窄&nbsp;体&emsp;&nbsp;&thinsp;</template>
                <el-select slot="suffix" v-model="ruleForm.aircraftTypePc" placeholder="请选择" style="width:187px;margin-right: -5px;" clearable>
                  <el-option label="宽体" key="宽体" value="宽体"></el-option>
                  <el-option label="窄体" key="窄体" value="窄体"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="fullLoadRangeMiles">
            <el-input v-model="ruleForm.fullLoadRangeMiles" auto-complete="off" clearable style="width: 280px;" >
              <template slot="prepend">
                <span>满载航距（英里）</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cruiseSpeedMiles">
            <el-input v-model="ruleForm.cruiseSpeedMiles" auto-complete="off" clearable style="width: 320px;">
              <template slot="prepend">
                <span>巡航速率（英里）&nbsp;&thinsp;</span>
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
          aircraftType:'',
          aircraftTypeNameEn:'',
          powerType:'',
          aircraftTypePc:'窄体',
          fullLoadRangeMiles:'',
          cruiseSpeedMiles:''
				},
				rules: {
					aircraftType: [{
						required: true,
						message: '飞机类型必填',
						trigger: ['blur', 'change']
					}, {
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					aircraftTypeNameEn: [{
						required: true,
						message: '飞机类型英文名称必填',
						trigger: ['blur', 'change']
					}, {
						max: 100,
						message: '长度不超过100',
						trigger: ['blur', 'change']
					}],
          powerType:[{
          	max: 50,
          	message: '长度不超过50',
          	trigger: ['blur', 'change']
          }],
          fullLoadRangeMiles:[{
          	max: 20,
          	message: '长度不超过20',
          	trigger: ['blur', 'change']
          }],
          cruiseSpeedMiles:[{
          	max: 20,
          	message: '长度不超过20',
          	trigger: ['blur', 'change']
          }]
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
						this.$axios.post2("/afbase/aircraft/add", params)
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

  .afAircraftSave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afAircraftSave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afAircraftSave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .afAircraftSave-ruleForm .widthFour .el-input-group__prepend {
    padding: 0 11px;
  }

  .afAircraftSave-ruleForm .widthTwo .el-input-group__prepend {
    padding: 0 40px;
  }

</style>
