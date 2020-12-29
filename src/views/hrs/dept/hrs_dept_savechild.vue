<template>
  <el-dialog title="部门管理 - 新建子部门" width="640px"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="hrsDeptSaveChild">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="deptName" label-width="15px">
            <el-input class="" v-model="ruleForm.deptName" style="width:280px;margin-right: 15px;" auto-complete="off" @blur="changeShortName()" @change="ruleForm.deptName=strTrim(ruleForm.deptName)">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>部门名称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="shortName" label-width="15px">
            <el-input class="" v-model="ruleForm.shortName" style="width:250px;margin-right: 15px;" auto-complete="off" @change="ruleForm.shortName=strTrim(ruleForm.shortName)">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>部门简称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="fullName" label-width="15px">
            <el-input class="" v-model="ruleForm.fullName=this.frow.fullName+'/'+ruleForm.shortName" style="width:280px;margin-right: 15px;" auto-complete="off" @change="ruleForm.fullName=strTrim(ruleForm.fullName)" :disabled="true">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>显示名称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="managerId" label-width="15px">
            <el-input class="widthThree2" style="width:250px;;margin-right: 15px;">
              <template slot="prepend">
                <span>负责人</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.managerId" filterable placeholder="请选择" style="width:170px;margin-right: -5px;" clearable>
                <el-option
                  v-for="item in useroptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="11">
          <el-form-item label="是否利润中心" prop="isProfitunit" >
              <el-select v-model="ruleForm.isProfitunit" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="11">
          <el-form-item label="部门人数" prop="budgetHc" required>
              <el-input v-model.number="ruleForm.budgetHc" auto-complete="off">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否末端利润中心" prop="isFinalProfitunit" required>
              <el-select v-model="ruleForm.isFinalProfitunit" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- <el-row>
        <el-col :span="11">
          <el-form-item label="是否生效" prop="deptStatus" required>
              <el-select v-model="ruleForm.deptStatus" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-form-item style="margin-left: 15px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag2">立即创建</el-button>
          <el-button size="small" type="primary" @click="resetForm('ruleForm')">重置</el-button>
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
      var checkNumber = (rule, value, callback) => {
        if (value) {
          setTimeout(() => {
            if (!Number.isInteger(value)) {
              callback(new Error('请输入数字值'));
            } else {
              if (value < 0) {
                callback(new Error('必须大于0'));
              }else if(value > 99999999){
                callback(new Error('最大长度为8位'));
              }else {
                callback();
              }
            }
          }, 1000);
        }else{
          callback();
        }
      };
      var checkNumber2 = (rule, value, callback) => {
        // let regE = /^[0-9]*[0-9][0-9]*$/g;
        let regE =/^[0-9]\d{2}$/;
        if(!regE.test(value)) {
          callback(new Error('请输入3位数字'));
        } else {
          callback();
        }
      };
      return {
        disabledFlag2: false,
        ruleForm: {
          deptName: '',
          deptCode: '',
          deptCode2: '',
          shortName: '',
          fullName: '',
          managerId: '',
          budgetHc: '',
          isProfitunit: '',
          isFinalProfitunit: '',
          deptStatus: true
        },
        rules: {
          deptName: [
            { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] },
            { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change'] }
          ],
          // deptCode2: [
          //   { required: true, message: '请输入部门编号', trigger: ['blur', 'change'] },
          //   { validator: checkNumber2, trigger: ['blur', 'change'] }
          // ],
          shortName: [
            { required: true, message: '请输入部门简称', trigger: ['blur', 'change'] },
            { min: 1, max: 40, message: '长度不超过 40', trigger: ['blur', 'change'] }
          ],
          fullName: [
            { required: true, message: '请输入显示名称', trigger: ['blur', 'change'] },
            { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change'] }
          ],
          managerId: [
            { validator: checkNumber, trigger: ['blur', 'change'] }
          ],
          budgetHc: [
            { required: true, message: '请输入部门人数', trigger: ['blur', 'change'] },
            { validator: checkNumber, trigger: ['blur', 'change'] }
          ],
          isFinalProfitunit: [
            { required: true, message: '请选择是否末端利润中心', trigger: ['blur', 'change'] }
          ],
          deptStatus: [
            { required: true, message: '请选择是否生效', trigger: ['blur', 'change'] }
          ]
        },
        options:[],
        useroptions:[],
        father_deptCode: ''
      };
    },
    inject:['findByPage'],
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
      changeShortName(){
        if(!this.ruleForm.shortName){
            this.ruleForm.shortName = this.ruleForm.deptName;
        }
      },
      submitForm(formName) {
        if (this.father_deptCode.length+this.ruleForm.deptCode2.length>15) {
          this.openError("部门层级最多5级");
          return;
        }
        if (this.ruleForm.deptName.indexOf("/")>-1) {
          this.openError("部门名称不能包含/");
          return;
        }
        this.$refs[formName].validate((valid) => {
          this.ruleForm.budgetHc=0;
          this.ruleForm.isFinalProfitunit=false;
          if (valid) {
            let params=this.ruleForm;
           // params.deptCode = this.father_deptCode+this.ruleForm.deptCode2;
            params.deptCode = this.father_deptCode;
            params.isProfitunit=this.ruleForm.isFinalProfitunit;
            this.disabledFlag2 = true;
            this.$axios.post2('/hrs/dept', params)
              .then(function(response) {
                if(response.data.code==0){
                  this.openSuccess();
                  this.findByPage();
                  this.handleClose();
                }else{
                  this.openError(response.data.messageInfo);
                  this.disabledFlag2 = false;
                }

             }.bind(this)
            ).catch(function (error) {
             let errorinfo = error.response.data.messageInfo;
             this.disabledFlag2 = false;
                  //唯一性错误
                    if(errorinfo.indexOf('IDU_hrs_dept_code')>-1)
                      this.openError('部门编号不可重复');
                    else if(errorinfo.indexOf("Data too long for column 'dept_code'")>-1)
                     this.openError('部门层级不能超过5层');
                    else
                      this.openError(errorinfo);
            }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
      this.father_deptCode=this.frow.deptCode;
      this.$axios.get('/hrs/dept/selectUser?deptId='+this.frow.deptId)
      .then(function(response) {
          this.useroptions=response.data.data;
       }.bind(this)
      );
    }
  }
</script>
<style type="text/css">

  .hrsDeptSaveChild .el-input__icon {
    line-height: 30px !important;
  }

  .hrsDeptSaveChild .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsDeptSaveChild .el-input-group__prepend {
    padding: 0 6px;
  }

  .hrsDeptSaveChild .widthThree2 .el-input-group__prepend {
    padding: 0 20px;
  }

</style>
