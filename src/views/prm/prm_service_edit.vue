<template>
	<el-dialog :title="scTypeName+' - 编辑'" width="370px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item :label="serName" prop="serviceName" label-width="85px">
						<el-input v-model="ruleForm.serviceName" auto-complete="off" style="width:217px">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item :label="serCode" prop="serviceCode" label-width="85px">
						<el-input v-model="ruleForm.serviceCode" auto-complete="off" disabled style="width:217px">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="elementWidth">
        <el-form-item label="是否有效" prop="isValid" required label-width="85px">
          <el-select v-model="ruleForm.isValid" style="width:100px">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="备注" prop="remark" label-width="85px">
            <el-input v-model="ruleForm.remark" auto-complete="off" style="width:217px" type="textarea"
                      :autosize="{ minRows: 1, maxRows: 2}">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
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
          serName: '',
          serCode: '',
				scCodeTypes: [],
				loading: false,
        disabledFlag2: false,
				ruleForm: {
					isValid: '',
          serviceName: '',
          serviceCode: '',
          serviceCodeGroup: '',
          serviceId: '',
            remark: '',
				},
				rules: {
            serviceName: [{
						required: true,
						message: '请输入服务名称',
						trigger: ['blur', 'change']
					},
          {
              max: 50,
              message: '请输入最多50个字符',
              trigger: ['blur', 'change']
          }
          ],
					isValid: [{
						required: true,
						message: '请选择是否有效',
						trigger: ['blur', 'change']
					}],
            serviceCode: [{
						required: true,
						message: '请输入服务编码',
						trigger: ['blur', 'change']
					}],
          remark: [{
              max: 100,
              message: '备注最多100个字符',
              trigger: ['blur', 'change']
          }
          ],
				}
			};
		},
		inject: ['searchBillServiceList'],
		created: function() {
			  this.ruleForm.serviceName=this.frow.serviceName;
        this.ruleForm.serviceCode=this.frow.serviceCode;
        this.ruleForm.isValid=""+this.frow.isValid;
        this.ruleForm.serviceId=this.frow.serviceId;
        this.ruleForm.remark=this.frow.remark;
        if(this.frow.serviceCode.length==3){//组编辑
            this.scTypeName = '服务类别';
            this.serName = '服务类别';
            this.serCode = '类别编码'
        }else{//组员编辑
            this.scTypeName = '服务项目';
            this.serName = '服务名称';
            this.serCode = '服务编码'
        }
		},
		methods: {
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
          if(this.frow.serviceCode.length==3){//组编辑
              this.$axios.post('/prm/coopBill/isHaveServiceClass', this.ruleForm)
                  .then(function(response) {
                      if(response.data.code == 0) {
                          this.openError("服务类别已存在");
                          return;
                      }else{
                          this.$refs[formName].validate((valid) => {
                              if(valid) {
                                  this.disabledFlag2 = true;
                                  this.$axios.post('/prm/coopBill/editService', this.ruleForm)
                                      .then(function(response) {
                                          if(response.data.code == 0) {
                                              this.openSuccess("保存成功！");
                                              this.searchBillServiceList();
                                              this.handleClose();
                                          } else {
                                              this.openError(response.data.messageInfo);
                                          }
                                      }.bind(this)).catch(function(error) {
                                      let errorinfo = error.response.data.messageInfo;
                                      this.openError(errorinfo)
                                  }.bind(this));
                              } else {
                                  console.log('error submit!!');
                                  return false;
                              }
                          });
                      }
                  }.bind(this)).catch(function(error) {
                  let errorinfo = error.response.data.messageInfo;
                  this.openError(errorinfo)
              }.bind(this));
          }else{//组员编辑
              this.$axios.post('/prm/coopBill/isHaveServiceProject', this.ruleForm)
                  .then(function(response) {
                      if(response.data.code == 0) {
                          this.openError("服务名称已存在");
                          return;
                      }else{
                          this.$refs[formName].validate((valid) => {
                              if(valid) {
                                  this.disabledFlag2 = true;
                                  this.$axios.post('/prm/coopBill/editService', this.ruleForm)
                                      .then(function(response) {
                                          if(response.data.code == 0) {
                                              this.openSuccess("保存成功！");
                                              this.searchBillServiceList();
                                              this.handleClose();
                                          } else {
                                              this.openError(response.data.messageInfo);
                                          }
                                      }.bind(this)).catch(function(error) {
                                      let errorinfo = error.response.data.messageInfo;
                                      this.openError(errorinfo)
                                  }.bind(this));
                              } else {
                                  console.log('error submit!!');
                                  return false;
                              }
                          });
                      }
                  }.bind(this)).catch(function(error) {
                  let errorinfo = error.response.data.messageInfo;
                  this.openError(errorinfo)
              }.bind(this));
          }

		/*		this.$refs[formName].validate((valid) => {
					if(valid) {
					//	this.loading = true
						this.$axios.post('/prm/coopBill/editService', this.ruleForm)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess("保存成功！");
									this.searchBillServiceList();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}
								//this.loading = false
							}.bind(this)).catch(function(error) {
								//this.loading = false
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo)
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});*/

			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
		}
	}
</script>
<style type="text/css" scoped="scoped">

</style>
