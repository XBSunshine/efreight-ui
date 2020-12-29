<template>
  <el-dialog title="科目代码 - 新增" width="510px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <el-form :disabled="loading" :model="ruleForm" :rules="rules" class="financialAccountSave-ruleForm" ref="ruleForm">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="financialAccountCodeParent" label-width="15px">
            <el-input v-model.trim="ruleForm.financialAccountCodeParent" auto-complete="off" style="width:300px;margin-right: -5px;" disabled>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>科目代码</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" prop="financialAccountCode" label-width="4px">
            <el-input v-model="ruleForm.financialAccountCode" auto-complete="off" style="width: 150px;" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="financialAccountName" label-width="15px">
            <el-input v-model="ruleForm.financialAccountName" style="width:449px;margin-right: 15px;" auto-complete="off" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>科目名称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="manageMode">
            <el-input class="widthFour" style="width:200px;">
              <template slot="prepend">管理模式</template>
              <el-select slot="suffix" v-model="ruleForm.manageMode" placeholder="请选择" style="width:120px;margin-right: -5px;" clearable @change="changeManageMode">
                <el-option label="子科目" value="子科目"></el-option>
                <el-option label="辅助账" value="辅助账"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="subsidiaryAccount">
            <el-input style="width:234px;">
              <template slot="prepend">辅助账设置</template>
              <el-select slot="suffix" v-model="ruleForm.subsidiaryAccount" placeholder="请选择" style="width:154px;margin-right: -5px;" clearable disabled>
                <el-option label="往来单位" value="往来单位"></el-option>
               <!-- <el-option label="人员" value="人员"></el-option>
                <el-option label="部门" value="部门"></el-option>-->
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="isValid">
            <el-input class="widthFour" style="width:200px;">
              <template slot="prepend">是否启用</template>
              <el-select slot="suffix" v-model="ruleForm.isValid" placeholder="请选择" style="width:120px;margin-right: -5px;">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="科目备注" prop="accountRemark" label-width="85px" class="textareaColor">
            <el-input type="textarea" :rows="2" v-model="ruleForm.accountRemark" auto-complete="off" style="width: 380px;" clearable maxlength="200" show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 15px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
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
            let financialAccountCodeCheck = (rule, value, callback) => {
                if (value.length > 30) {
                    return callback(new Error('最大输入30位'));
                }
                let regE = /^(0|[0-9]\d*)$/;
                if (!regE.test(value)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    financialAccountCodeParent: '',
                    financialAccountCode: '',
                    financialAccountName: '',
                    manageMode: '',
                    subsidiaryAccount: '',
                    accountRemark: '',
                    isValid: '1',
                    idParent: '',
                },
                //subsidiaryAccountFlag: true,
                //subFlag: true,
                rules: {
                    financialAccountCode: [{
                        required: true,
                        message: '请输入科目代码',
                        trigger: ['blur', 'change']
                    },
                    {
                        validator: financialAccountCodeCheck,
                        trigger: ['blur', 'change']
                    }
                    ],
                    financialAccountName: [{
                        required: true,
                        message: '请输入科目名称',
                        trigger: ['blur', 'change']
                    },
                    {
                        min: 1,
                        max: 100,
                        message: '长度不超过 100',
                        trigger: ['blur', 'change']
                    }
                    ],
                },
                loading: false
            };
        },
        inject: ['getPage'],
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
                        this.loading = true
                        let params = this.ruleForm;
                        this.$axios.post2('/afbase/financialAccount', params)
                            .then(function(response) {
                                if(response.data.code == 0) {
                                    this.loading = false
                                    this.openSuccess();
                                    this.getPage();
                                    this.handleClose();
                                } else {
                                    this.loading = false
                                    //唯一性错误
                                    let errorinfo = response.data.messageInfo;
                                    if(errorinfo.indexOf('css_code') > -1)
                                        this.openError('科目代码不可重复');
                                    else
                                        this.openError(errorinfo);
                                }

                            }.bind(this)).catch(function(error) {
                            this.loading = false
                            if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
                                this.openError(error.response.data.messageInfo);
                            }
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
            changeManageMode() {
                if(this.ruleForm.manageMode === '辅助账') {
                    //this.subsidiaryAccountFlag = false;
                    this.ruleForm.subsidiaryAccount = '往来单位'
                }else {
                    //this.subsidiaryAccountFlag = true;
                    this.ruleForm.subsidiaryAccount = ''
                }
            },
        },
        created() {
            this.ruleForm.financialAccountCodeParent = this.frow.financialAccountCode;
            this.ruleForm.financialAccountName = this.frow.financialAccountName;
            this.ruleForm.idParent = this.frow.id//保存父级的id，保存时根据父级ID查询父级信息，同步到子级
            /*if(this.frow.financialAccountClass01 === 1){
                this.subFlag = true;
            }else{
                this.subFlag = false;
            }*/
        },
    }
</script>
<style type="text/css">

  .financialAccountSave-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .financialAccountSave-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .financialAccountSave-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .financialAccountSave-ruleForm .widthTwo .el-input-group__prepend {
    padding: 0 20px;
  }

  .financialAccountSave-ruleForm .widthFour .el-input-group__prepend {
    padding: 0 12px;
  }

  .financialAccountSave-ruleForm .widthThree .el-input-group__prepend {
    padding: 0 13px;
  }

  .financialAccountSave-ruleForm .widthTwo1 .el-input-group__prepend {
    padding: 0 25px;
  }

  .financialAccountSave-ruleForm .widthTwo2 .el-input-group__prepend {
    padding: 0 20px;
  }

  .financialAccountSave-ruleForm .textareaColor .el-form-item__label {
    color: #909399;
  }
</style>
