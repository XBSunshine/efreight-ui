<template>
	<el-dialog title="机场 - 新增" width="750px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-left: 10px;" class="afAirportSave-ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="apCode">
            <el-input v-model="ruleForm.apCode" auto-complete="off" @input="ruleForm.apCode=ruleForm.apCode.toUpperCase()" clearable style="width: 180px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>机场代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="apNameCn">
            <el-input v-model="ruleForm.apNameCn" auto-complete="off" clearable style="width: 250px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>机场中文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="apNameEn">
            <el-input v-model="ruleForm.apNameEn" auto-complete="off" clearable style="width: 250px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>机场英文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityCode">
            <el-input v-model="ruleForm.cityCode" auto-complete="off" clearable style="width: 180px;" @input="ruleForm.cityCode = ruleForm.cityCode.toUpperCase()" @change="getAirport">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>城市代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityNameCn">
            <el-input v-model="ruleForm.cityNameCn" auto-complete="off" clearable style="width: 250px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>城市中文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="cityNameEn">
            <el-input v-model="ruleForm.cityNameEn" auto-complete="off" clearable style="width: 250px;">
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
            <el-input v-model="ruleForm.nationCode" auto-complete="off" clearable style="width: 180px;" @input="ruleForm.nationCode = ruleForm.nationCode.toUpperCase()">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>国家代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="nationNameCn">
            <el-input v-model="ruleForm.nationNameCn" auto-complete="off" clearable style="width: 250px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>国家中文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="nationNameEn">
            <el-input v-model="ruleForm.nationNameEn" auto-complete="off" clearable style="width: 250px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>国家英文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="nationCodeThree">
            <el-input class="widthFive" v-model="ruleForm.nationCodeThree" auto-complete="off" clearable style="width: 180px;" @input="ruleForm.nationCodeThree = ruleForm.nationCodeThree.toUpperCase()" maxlength="3">
              <template slot="prepend">
                <span>国家三字码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="nationCodeNumber">
            <el-input class="widthFive1" v-model="ruleForm.nationCodeNumber" auto-complete="off" clearable style="width: 250px;" @input="ruleForm.nationCodeNumber = ruleForm.nationCodeNumber.toUpperCase()" maxlength="3">
              <template slot="prepend">
                <span>国家数字码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="nationCodeCoo">
            <el-input class="widthFour1" v-model="ruleForm.nationCodeCoo" auto-complete="off" clearable style="width: 250px;" @input="ruleForm.nationCodeCoo = ruleForm.nationCodeCoo.toUpperCase()" maxlength="3">
              <template slot="prepend">
                <span>国别代码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="routingGroupName" label-width="10px">
            <el-input class="widthFour" style="width:179px;">
              <template slot="prepend">
                <span>航线分区</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.routingGroupName" filterable placeholder="请选择" clearable style="width: 100px;margin-right: -5px">
                <el-option v-for="item in routingGroupNames" :key="item.id" :label="item.paramText" :value="item.paramText">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="routingName" label-width="10px">
            <el-input class="widthTwo" style="width:250px;">
              <template slot="prepend">
                <span>航线</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.routingName" filterable placeholder="请选择" clearable style="width: 141px;margin-right: -5px">
                <el-option v-for="item in routingNames" :key="item.id" :label="item.paramText" :value="item.paramText">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="timeZone">
            <el-input class="widthTwo" v-model="ruleForm.timeZone" auto-complete="off" clearable style="width: 250px;">
              <template slot="prepend">
                <span>时区</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-col class="elementWidth">
              <el-form-item label-width="10px" prop="apLongitude">
                <el-input v-model="ruleForm.apLongitude" auto-complete="off" clearable style="width: 180px;">
                  <template slot="prepend">
                    <span>经度  : 纬度</span>
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
          <el-form-item label-width="10px" prop="apStatus">
            <el-input class="widthFour" style="width:149px;">
              <template slot="prepend">是否有效</template>
              <el-select slot="suffix" v-model="ruleForm.apStatus" placeholder="请选择" style="width:70px;margin-right: -5px;" clearable>
                <el-option label="是" key="1" value="true"></el-option>
                <el-option label="否" key="0" value="false"></el-option>
              </el-select>
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
				routingGroupNames: [],
				routingNames: [],
				ruleForm: {
					apCode: '',
					apNameCn: '',
					apNameEn: '',
					cityCode: '',
					cityNameCn: '',
					cityNameEn: '',
					nationCode: '',
					nationNameCn: '',
					nationNameEn: '',
					routingGroupName: '',
					routingName: '',
					timeZone: '',
					apLongitude: '',
					apLatitude: '',
					apStatus: "true",
          nationCodeThree: '',
          nationCodeNumber: '',
          nationCodeCoo: '',
        },
				rules: {
					apCode: [{
						required: true,
						message: '请输入机场代码',
						trigger: ['blur', 'change']
					}, {
						max: 4,
						message: '长度不超过4',
						trigger: ['blur', 'change']
					}],
					apNameCn: [{
						required: true,
						message: '请输入机场英文名称',
						trigger: ['blur', 'change']
					}, {
						max: 100,
						message: '长度不超过100',
						trigger: ['blur', 'change']
					}],
					apNameEn: [{
						required: true,
						message: '请输入机场中文名称',
						trigger: ['blur', 'change']
					}, {
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
					cityCode: [{
						required: true,
						message: '请输入城市代码',
						trigger: ['blur', 'change']
					}, {
						max: 4,
						message: '长度不超过4',
						trigger: ['blur', 'change']
					}],
					cityNameCn: [{
						required: true,
						message: '请输入城市中文名称',
						trigger: ['blur', 'change']
					}, {
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					cityNameEn: [{
						required: true,
						message: '请输入城市英文名称',
						trigger: ['blur', 'change']
					}, {
						max: 50,
						message: '长度不超过50',
						trigger: ['blur', 'change']
					}],
					nationCode: [{
						required: true,
						message: '请输入国家代码',
						trigger: ['blur', 'change']
					}, {
						max: 2,
						message: '长度不超过2',
						trigger: ['blur', 'change']
					}],
					nationNameCn: [{
						required: true,
						message: '请输入国家中文名称',
						trigger: ['blur', 'change']
					}, {
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					nationNameEn: [{
						required: true,
						message: '请输入国家英文名称',
						trigger: ['blur', 'change']
					}, {
						max: 100,
						message: '长度不超过100',
						trigger: ['blur', 'change']
					}],
					timeZone: [{
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					apLongitude: [{
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					apLatitude: [{
						max: 20,
						message: '长度不超过20',
						trigger: ['blur', 'change']
					}],
					apStatus: [{
						required: true,
						message: '请选择是否有效',
						trigger: ['blur', 'change']
					}],
				}
			}
		},
		methods: {
			getAirport() {
				if(!this.ruleForm.cityCode) {
					return
				}
				this.$axios.get2("/afbase/airport/getAirport", {
						"cityCode": this.ruleForm.cityCode
					})
					.then((response) => {
						if(response.data.data) {
							this.ruleForm.nationCode = response.data.data.nationCode;
							this.ruleForm.nationNameEn = response.data.data.nationNameEn;
							this.ruleForm.nationNameCn = response.data.data.nationNameCn;
							this.ruleForm.cityNameEn = response.data.data.cityNameEn;
							this.ruleForm.cityNameCn = response.data.data.cityNameCn;
							this.ruleForm.routingGroupName = response.data.data.routingGroupName;
							this.ruleForm.routingName = response.data.data.routingName;
							this.ruleForm.timeZone = response.data.data.timeZone;
							this.ruleForm.apLongitude = response.data.data.apLongitude;
							this.ruleForm.apLatitude = response.data.data.apLatitude;
						}
					}).then(() => {});
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			init() {
				//加载航线分区
				this.$axios.get2("/afbase/category/params", {
						"categoryName": "分区"
					})
					.then(function(response) {
						this.routingGroupNames = response.data.data || [];
					}.bind(this))
        this.changeRouting1();
			},
			changeRouting1(val) {
				/*if(!val) {
					return
				}*/
				this.ruleForm.routingName = "";
				this.$axios.get2("/afbase/category/find", {
						"categoryName": "航线"
					})
					.then(function(response) {
						this.routingNames = response.data.data;
					}.bind(this))
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2("/afbase/airport/doSave", params)
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
			this.init();
		}
	}
</script>
<style type="text/css">

  .afAirportSave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afAirportSave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afAirportSave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .afAirportSave-ruleForm .widthFour .el-input-group__prepend {
    padding: 0 11px;
  }

  .afAirportSave-ruleForm .widthFour1 .el-input-group__prepend {
    padding: 0 25px;
  }

  .afAirportSave-ruleForm .widthTwo .el-input-group__prepend {
    padding: 0 40px;
  }

  .afAirportSave-ruleForm .widthFive .el-input-group__prepend {
    padding: 0 4px;
  }

  .afAirportSave-ruleForm .widthFive1 .el-input-group__prepend {
    padding: 0 18px;
  }

</style>
