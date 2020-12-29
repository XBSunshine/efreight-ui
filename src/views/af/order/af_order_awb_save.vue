<template>
  <el-dialog title="主单号管理 - 新建" width="55%"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose" append-to-body>
    <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="110px" class="demo-ruleForm" style="margin-left: 10px;">
      <el-row >
        <el-col :span="22">
          <el-form-item label="主运单号" prop="awb3" required>
              <el-input v-model="ruleForm.awb3" @change="ruleForm.awb3=strTrim(ruleForm.awb3)" auto-complete="off" style="width:110px;text-align: right;" disabled>
              </el-input>  -

          </el-form-item>

          <el-form-item label="" prop="awb8" required >

              <el-input v-model="ruleForm.awb8" @change="ruleForm.awb8=strTrim(ruleForm.awb8)" auto-complete="off" style="width:208px;text-align: right;" disabled>
              </el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="运单来源" prop="awbFromType" required>
              <el-select v-model="ruleForm.awbFromType" filterable placeholder="请选择" clearable @change="awbFromTypeChange" style="width:110px" :disabled="disabledFlag">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="awbFromName" >
              <el-input v-model="ruleForm.awbFromName" @change="ruleForm.awbFromName=strTrim(ruleForm.awbFromName)" auto-complete="off" style="width:220px" :disabled=true>
              </el-input>
          </el-form-item>
          <el-form-item style="margin-left: -10px;width: 26px;">
          <el-button type="primary" size="small" style="padding: 7px 7px;" @click="gotoSelectPage('ruleForm')" :disabled="disabledFlag">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('ruleForm')" >立即创建</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <save ref="addMission" v-if="save" :visible.sync="save" :frow="ffrow"></save>
  </el-dialog>
</template>
<script>
import save from './af_order_awb_select'
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
        let regE =/^[0-9]\d{2}$/;
        if(!regE.test(value)) {
          callback(new Error('请输入3位数字'));
        } else {
          callback();
        }
      };
      var checkNumber2 = (rule, value, callback) => {
        // let regE = /^[0-9]*[0-9][0-9]*$/g;
        let regE =/^[0-9]\d{7}$/;
        if(!regE.test(value)) {
          callback(new Error('请输入8位数字'));
        } else {
          callback();
        }
      };
      var checkNumber3 = (rule, value, callback) => {
        // let regE = /^[0-9]*[0-9][0-9]*$/g;
        let regE =/^[0-9]\d{0,3}$/;
        if(!regE.test(value)) {
          callback(new Error('最大4位数字'));
        } else if(value<=0){
          callback(new Error('必须大于0'));
        }else {
          callback();
        }
      };
      return {
        helpDocumentUrl:'',
        data1:[],
        options2:[],
        save: false,
        disabledFlag:false,
        ffrow:{
          awbFromType:''
        },
        ruleForm: {
          awb3: '',
          awb8: '',
          awbcount: 1,
          departureStation: '',
          awbFromType: '',
          awbFromId: '',
          awbFromName: ''
        },
        rules: {
          awb3: [
            { required: true, message: '请输入三字码', trigger: ['blur', 'change'] },
            { min: 3, max: 3, message: '长度为 3', trigger: ['blur', 'change'] },
            { validator: checkNumber1, trigger: ['blur', 'change'] }

          ],
          awb8: [
            { required: true, message: '请输入主单号', trigger: ['blur', 'change'] },
            { min: 8, max: 8, message: '长度为 8', trigger: ['blur', 'change'] },
            { validator: checkNumber2, trigger: ['blur', 'change'] }
          ],
          awbcount: [
            { required: true, message: '请输入数量', trigger: ['blur', 'change'] },
            { validator: checkNumber3, trigger: ['blur', 'change'] }
          ],
          awbFromType: [
            { required: true, message: '请选择运单来源', trigger: ['blur', 'change'] }
          ],
          awbFromName: [
            { required: true, message: '请选择运单来源公司', trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    inject: ['submitForm2'],
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
          message: '操作失败，'+info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      awbFromTypeChange(){
        this.ruleForm.awbFromId='';
        this.ruleForm.awbFromName='';
      },
      gotoSelectPage() {
        if (!this.ruleForm.awbFromType) {
          this.openError('请选择运单来源');
          return;
        }
        this.ffrow.awbFromType = this.ruleForm.awbFromType;
        this.save = true;
      },
      setValue(rrow) {
        this.ruleForm.awbFromId=rrow.coopIdV;
        this.ruleForm.awbFromName=rrow.coopNameV;
      },
      getAwbList(formName) {
        let awb7=this.ruleForm.awb8.substring(0, 7)%7;
        let awb1=this.ruleForm.awb8.substring(7);
        if (awb7!=awb1) {
          this.openError("起始主单号不符合规则");
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post2('/afbase/awb/getAwbList', this.ruleForm)
              .then(function(response) {
                if(response.data.code==0){
                  this.data1 = response.data.data;
                  this.disabledFlag =true;
                }else{
                  this.openError(response.data.messageInfo);
                }

             }.bind(this)
            ).catch(function (error) {
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
        let awb7=this.ruleForm.awb8.substring(0, 7)%7;
        let awb1=this.ruleForm.awb8.substring(7);
        if (awb7!=awb1) {
          this.openError("起始主单号不符合规则");
          return;
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params=this.ruleForm;
            this.$axios.post2('/afbase/awb/checkAwbList', params)
              .then(function(response) {
                if(response.data.code==0){
                  //   this.$confirm('是否继续保存?', '提示', {
                  //   confirmButtonText: '确定',
                  //   cancelButtonText: '取消',
                  //   type: 'warning',
                  //   center: true
                  // }).then(() => {
                    this.doSave();
                  // }).catch(() => {

                  // });

                }else{
                  let errorinfo = response.data.messageInfo;
                  if (errorinfo.indexOf('是否继续保存')>-1) {
                     this.$confirm(errorinfo+'?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      center: true
                    }).then(() => {
                      this.doSave();
                    }).catch(() => {

                    });
                  }else{
                    this.openError(errorinfo);
                  }

                }

             }.bind(this)
            ).catch(function (error) {
              let errorinfo = error.response.data.messageInfo;
              this.openError(errorinfo);
            }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      doSave(){
        let params=this.ruleForm;
        this.$axios.post2('/afbase/awb', params)
          .then(function(response) {
            if(response.data.code==0){
              // this.openSuccess();
              this.submitForm2('ruleForm');
              this.handleClose();
            }else{
              this.openError(response.data.messageInfo);
            }
         }.bind(this)
        ).catch(function (error) {
         let errorinfo = error.response.data.messageInfo;

                  this.openError(errorinfo);
        }.bind(this));
      },
      resetForm(formName) {
        this.checkedCities=[];
        this.$refs[formName].resetFields();
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      }
    },
    created(){
      this.ruleForm.awb3=this.frow.awbNumber.substring(0,3);
      this.ruleForm.awb8=this.frow.awbNumber.substring(4);
      this.$axios.get('/afbase/awb/selectCategory?category=运单所属').then(function(response) {
          this.options2=response.data.data;
       }.bind(this));
      if(this.frow.businessProduct == '代操作'){
          this.ruleForm.awbFromType = '互为代理'
          this.ruleForm.awbFromId = this.frow.coopId
          this.ruleForm.awbFromName = this.frow.coopName
      }
      // if(this.frow.shareOrderSave){
      //   this.ruleForm.awbFromType = '互为代理'
      //   this.ruleForm.awbFromId = this.frow.coopId
      //   this.ruleForm.awbFromName = this.frow.coopName
      // }
    }
  }
</script>
<style type="text/css">
</style>
