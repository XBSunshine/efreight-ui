<template>
	<el-dialog :title="scTypeName+' 新增'" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm shipper-consignee-save">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="scType" >
            <el-input style="width: 188px">
              <template slot="prepend">类型</template>
              <el-select slot="suffix" v-model="ruleForm.scType" placeholder="" @change="changescType" style="width: 91px;margin-right: -5px;">
                <el-option label="发货人" value="0"></el-option>
                <el-option label="收货人" value="1"></el-option>
              </el-select>
            </el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="isValid" >
            <el-input style="width: 176px">
              <template slot="prepend">是否生效</template>
              <el-select slot="suffix" v-model="ruleForm.isValid" placeholder="" style="width: 80px;margin-right: -5px">
                <el-option label="是" :value=true></el-option>
                <el-option label="否" :value=false></el-option>
              </el-select>
            </el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="scName" >
						<el-input v-model="ruleForm.scName" auto-complete="off" maxlength="100" style="width: 496px;" @change="ruleForm.scName=strTrim(ruleForm.scName).toUpperCase()">
              <template slot="prepend">名称</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="scAddress" >
						<el-input v-model="ruleForm.scAddress" auto-complete="off" maxlength="150" style="width: 496px;" @change="ruleForm.scAddress=strTrim(ruleForm.scAddress).toUpperCase()">
              <template slot="prepend">地址</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item>
            <div class="el-input el-input-group el-input-group--prepend">
              <div class="el-input-group__prepend">代码</div>
              <el-col>
                <el-form-item prop="scCodeType" class="ef-unset-line-height">
                  <el-select v-model="ruleForm.scCodeType" filterable style="width: 200px" >
                    <el-option v-for="(scCodeType,index) in scCodeTypes" :key="index" :label="scCodeType.paramText" :value="scCodeType.edicode1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth" style="margin-left: 10px">
          <el-col>
            <el-form-item prop="scCode" class="ef-unset-line-height" style="width: 188px" >
              <el-input v-model="ruleForm.scCode" auto-complete="off" placeholder="" maxlength="50" @change="ruleForm.scCode=strTrim(ruleForm.scCode).toUpperCase()">
              </el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
				<el-col class="elementWidth">
					<el-form-item prop="aeoCode" >
						<el-input v-model="ruleForm.aeoCode" auto-complete="off" style="width: 496px;" @change="ruleForm.aeoCode=strTrim(ruleForm.aeoCode).toUpperCase()">
              <template slot="prepend">AEO编码</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="nationCode" >
						<el-input v-model="ruleForm.nationCode" @input="ruleForm.nationCode = ruleForm.nationCode.toUpperCase()" auto-complete="off" style="width: 230px;" @change="searchNationalName">
              <template slot="prepend">国家代码</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item  prop="stateCode" >
						<el-input v-model="ruleForm.stateCode" auto-complete="off" maxlength="10" style="width: 230px;" @change="ruleForm.stateCode=strTrim(ruleForm.stateCode).toUpperCase()">
              <template slot="prepend">省份</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="" prop="cityName" >
						<el-input v-model="ruleForm.cityCode" @input="ruleForm.cityCode = ruleForm.cityCode.toUpperCase()" auto-complete="off" maxlength="30" style="width: 230px;" @change="searchCityName">
              <template slot="prepend">城市代码</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="postCode" >
						<el-input v-model="ruleForm.postCode" auto-complete="off" maxlength="20" style="width: 230px;" @change="ruleForm.postCode=strTrim(ruleForm.postCode).toUpperCase()">
              <template slot="prepend">邮编</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="" prop="telNumber" >
						<el-input v-model="ruleForm.telNumber" auto-complete="off" maxlength="30" style="width: 230px;" @change="ruleForm.telNumber=strTrim(ruleForm.telNumber).toUpperCase()">
              <template slot="prepend">电话</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="faxNumber" >
						<el-input v-model="ruleForm.faxNumber" auto-complete="off" maxlength="30" style="width: 230px;" @change="ruleForm.faxNumber=strTrim(ruleForm.faxNumber).toUpperCase()">
              <template slot="prepend">传真</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
          <el-col class="elementWidth" style="margin-top: -10px">
            <el-form-item prop="scPrintRemark" label="Print" class="ef-display" >
              <el-input :rows="5" type="textarea" v-model="ruleForm.scPrintRemark" style="width: 370px; display: inline-flex" @change="ruleForm.scPrintRemark=strTrim(ruleForm.scPrintRemark).toUpperCase()">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 0px">
            <el-form-item label-width="15px">
              <el-button size="small" type="primary" @click="synchronization">同步</el-button>
            </el-form-item>
          </el-col>
			</el-row>
			<el-row>
          <el-form-item style="margin-left: 38px;">
            <el-button :loading="loading" size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag2">保存</el-button>
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
			return {
				scTypeName: '',
				scCodeTypes: [],
				loading: false,
        disabledFlag2:false,
        cityNameEn: '',
        nationNameEn: '',
				ruleForm: {
					isValid: true,
					//scMnemonic: '',
					scType: '',
					scName: '',
					scAddress: '',
					scCodeType: '',
					scCode: '',
					aeoCode: '',
					nationCode: '',
					stateCode: '',
					cityName: '',
          cityCode: '',
					postCode: '',
					telNumber: '',
					faxNumber: '',
					scPrintRemark: ''
				},
				rules: {
					scType: [{
						required: true,
						message: '请输选择类型',
						trigger: ['blur', 'change']
					}],
					isValid: [{
						required: true,
						message: '请输选择是否有效',
						trigger: ['blur', 'change']
					}],
					// scCodeType: [{
					// 	required: true,
					// 	message: '请输选择代码类型',
					// 	trigger: ['blur', 'change']
					// }],
					// scCode: [{
					// 	required: true,
					// 	message: '请输入代码',
					// 	trigger: ['blur', 'change']
					// }],
					scName: [{
						required: true,
						message: '请输入名称',
						trigger: ['blur', 'change']
					}],
					scPrintRemark: [{
						required: true,
						message: '请输入Print',
						trigger: ['blur', 'change']
					},{
            min: 1,
            max: 2000,
            message: 'Print长度不超过 2000',
            trigger: ['blur', 'change']
          }
          ],
					// scAddress: [{
					// 	required: true,
					// 	message: '请输入地址',
					// 	trigger: ['blur', 'change']
					// }],
					nationCode: [
					// {
					// 	required: true,
					// 	message: '请输入国家代码',
					// 	trigger: ['blur', 'change']
					// },
					 {
						min: 2,
						message: '请输入两位字符',
						trigger: ['blur', 'change']
					}, {
						max: 2,
						message: '请输入两位字符',
						trigger: ['blur', 'change']
					}],
          aeoCode: [
            {
              min: 0,
              max: 50,
              message: 'AEO编码长度不超过 50',
              trigger: ['blur', 'change']
            }
          ],
					// telNumber: [{
					// 	required: true,
					// 	message: '请输入电话',
					// 	trigger: ['blur', 'change']
					// }],
					// scPrintRemark: [{
					// 	required: true,
					// 	message: '请输入Print',
					// 	trigger: ['blur', 'change']
					// }]
				}
			};
		},
		inject: ['queryList'],
		created: function() {
			this.$axios.get2('/afbase/category/params', {
				categoryName: "收发货人代码"
			}).then(function(response) {
				this.scCodeTypes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
		},
		methods: {
      searchCityName(){
          if(this.ruleForm.cityCode){
              this.$axios.get2('/afbase/shipperConsignee/searchCityName', {
                  cityCode: this.ruleForm.cityCode
              }).then(function(response) {
                  this.cityNameEn = response.data.data;
              }.bind(this)).catch(function(error) {
                  console.log(error);
              })
          }else{
              this.cityNameEn = ''
          }
      },
      searchNationalName(){
          if(this.ruleForm.nationCode){
              this.$axios.get2('/afbase/shipperConsignee/searchNationalName', {
                  nationCode: this.ruleForm.nationCode
              }).then(function(response) {
                  this.nationNameEn = response.data.data;
              }.bind(this)).catch(function(error) {
                  console.log(error);
              })
          }else{
              this.nationNameEn = ''
          }
      },
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
            this.disabledFlag2 = true;
						this.$axios.post2('/afbase/shipperConsignee', this.ruleForm)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess("保存成功！");
									this.queryList();
									this.handleClose();
								} else {
                  this.disabledFlag2 = false;
									this.openError(response.data.messageInfo);
								}
								this.loading = false
							}.bind(this)).catch(function(error) {
								this.loading = false
                this.disabledFlag2 = false;
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo)
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			synchronization() {
        let result = ''
        if(this.ruleForm.scName) {
          result += this.ruleForm.scName + '\n'
        }
        if(this.ruleForm.scAddress) {
          if(result == '') {
            result += this.ruleForm.scAddress + '\n'
          } else {
            result += this.ruleForm.scAddress + '\n'
          }
        }
        if(this.cityNameEn) {
            if(result == '') {
                result += this.cityNameEn+','
            } else {
                result += this.cityNameEn+','
            }
        }
        if(this.ruleForm.stateCode) {
            if(result == '') {
                result += this.ruleForm.stateCode+','
            } else {
                result += this.ruleForm.stateCode+','
            }
        }
        if(this.ruleForm.postCode) {
            if(result == '') {
                result += this.ruleForm.postCode+','
            } else {
                result += this.ruleForm.postCode+','
            }
        }
        if(this.nationNameEn) {
            if(result == '') {
                result += this.nationNameEn
            } else {
                result += this.nationNameEn
            }
        }
        if(result.substring(result.length-1,result.length) == ',' || result.substring(result.length-1,result.length) == '\n'){
            result = result.substring(0,result.length-1);
        }

        let result1 = ''
        if(this.ruleForm.telNumber  && this.ruleForm.faxNumber ) {
            result1 += '\n' + this.ruleForm.telNumber+','+this.ruleForm.faxNumber
        }else if(this.ruleForm.telNumber  && this.ruleForm.faxNumber == '') {
            result1 += '\n' + this.ruleForm.telNumber
        }else if(this.ruleForm.telNumber == '' && this.ruleForm.faxNumber ){
            result1 += '\n' + this.ruleForm.faxNumber
        }
        result +=result1;
        /*if(this.ruleForm.telNumber != '') {
          if(result == '') {
            result += this.ruleForm.telNumber+','
          } else {
            result += '\n' + this.ruleForm.telNumber+','
          }
        }
        if(this.ruleForm.faxNumber != '') {
          if(result == '') {
            result += this.ruleForm.faxNumber
          } else {
            result += this.ruleForm.faxNumber
          }
        }*/
        if(result.substring(0,1) == '\n'){
            result = result.substring(1,result.length);
        }
        if(result.substring(result.length-1,result.length) == ',' || result.substring(result.length-1,result.length) == '\n'){
            result = result.substring(0,result.length-1);
        }
        this.ruleForm.scPrintRemark = result.toUpperCase()
      },
			synchronization2() {
				let result = ''
				if(this.ruleForm.scName != '') {
					result += this.ruleForm.scName + '\n'
				}
				if(this.ruleForm.scAddress != '') {
					if(result == '') {
						result += this.ruleForm.scAddress + '\n'
					} else {
						result += this.ruleForm.scAddress + '\n'
					}
				}
        if(this.ruleForm.cityCode != '') {
            if(result == '') {
                result += this.ruleForm.cityCode+','
            } else {
                result += this.ruleForm.cityCode+','
            }
        }
        if(this.ruleForm.stateCode != '') {
            if(result == '') {
                result += this.ruleForm.stateCode+','
            } else {
                result += this.ruleForm.stateCode+','
            }
        }
        if(this.ruleForm.postCode != '') {
            if(result == '') {
                result += this.ruleForm.postCode+','
            } else {
                result += this.ruleForm.postCode+','
            }
        }
        if(this.ruleForm.nationCode != '') {
            if(result == '') {
                result += this.ruleForm.nationCode
            } else {
                result += this.ruleForm.nationCode
            }
        }
        if(result.substring(result.length-1,result.length) == ',' || result.substring(result.length-1,result.length) == '\n'){
            result = result.substring(0,result.length-1);
        }

        let result1 = ''
        if(this.ruleForm.telNumber != '' && this.ruleForm.faxNumber != '') {
            result1 += '\n' + this.ruleForm.telNumber+','+this.ruleForm.faxNumber
        }else if(this.ruleForm.telNumber != '' && this.ruleForm.faxNumber == '') {
            result1 += '\n' + this.ruleForm.telNumber
        }else if(this.ruleForm.telNumber == '' && this.ruleForm.faxNumber != ''){
            result1 += '\n' + this.ruleForm.faxNumber
        }
        result +=result1;
				/*if(this.ruleForm.telNumber != '') {
					if(result == '') {
						result += this.ruleForm.telNumber+','
					} else {
						result += '\n' + this.ruleForm.telNumber+','
					}
				}
				if(this.ruleForm.faxNumber != '') {
					if(result == '') {
						result += this.ruleForm.faxNumber
					} else {
						result += this.ruleForm.faxNumber
					}
				}*/
        if(result.substring(0,1) == '\n'){
            result = result.substring(1,result.length);
        }
        if(result.substring(result.length-1,result.length) == ',' || result.substring(result.length-1,result.length) == '\n'){
            result = result.substring(0,result.length-1);
        }
				this.ruleForm.scPrintRemark = result
			},
			changescType() {
				if(this.ruleForm.scType == '0') {
					this.scTypeName = '发货人 -'
				} else if(this.ruleForm.scType == '1') {
					this.scTypeName = '收货人 -'
				}
			}
		}
	}
</script>
<style type="text/css" >
  .shipper-consignee-save .ef-unset-line-height .el-form-item__content {
    line-height: 30px !important;
  }
  .shipper-consignee-save .ef-unset-line-height .el-input__icon{
    line-height: 30px !important;
  }

  .shipper-consignee-save .el-input__icon {
    line-height: 30px !important;
  }
  .shipper-consignee-save .el-input-group__prepend{
    width: 97px;
    text-align: center;
  }
  .shipper-consignee-save .elementWidth{
    margin-left: 38px;
  }
  .shipper-consignee-save .ef-display .el-form-item__content{
    display: inline-flex;
  }
</style>
