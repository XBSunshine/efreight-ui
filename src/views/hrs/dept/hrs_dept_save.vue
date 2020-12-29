<template>
  <el-dialog title="部门管理——新建" width="75%"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <el-row>
        <el-col :span="11">
          <el-form-item label="部门名称" prop="deptName" required>
              <el-input v-model="ruleForm.deptName" @change="ruleForm.deptName=strTrim(ruleForm.deptName)" auto-complete="off">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="部门编号" prop="deptCode" required>
              <el-input v-model="ruleForm.deptCode" @change="ruleForm.deptCode=strTrim(ruleForm.deptCode)" auto-complete="off">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="部门全称" prop="fullName" required>
              <el-input v-model="ruleForm.fullName" @blur="changeShortName()" @change="ruleForm.fullName=strTrim(ruleForm.fullName)" auto-complete="off">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="部门简称" prop="shortName" required>
              <el-input v-model="ruleForm.shortName" @change="ruleForm.shortName=strTrim(ruleForm.shortName)" auto-complete="off">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="负责人" prop="managerId" >
            <el-select v-model="ruleForm.managerId" filterable placeholder="请选择">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="部门人数" prop="budgetHc" >
              <el-input v-model.number="ruleForm.budgetHc" auto-complete="off">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否利润中心" prop="isProfitunit" >
              <el-select v-model="ruleForm.isProfitunit" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否末端利润中心" prop="isFinalProfitunit" required>
              <el-select v-model="ruleForm.isFinalProfitunit" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否生效" prop="deptStatus" required>
              <el-select v-model="ruleForm.deptStatus" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
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
      var checkNumber = (rule, value, callback) => {
        if (value) {
          setTimeout(() => {
            if (!Number.isInteger(value)) {
              callback(new Error('请输入数字值'));
            } else {
              if (value < 0) {
                callback(new Error('必须大于0'));
              } else {
                callback();
              }
            }
          }, 1000);
        }else{
          callback();
        }
      };
      return {
        ruleForm: {
          deptName: '',
          deptCode: '',
          shortName: '',
          fullName: '',
          managerId: '',
          budgetHc: '',
          isProfitunit: '',
          isFinalProfitunit: '',
          deptStatus: '',
          has_children:''
        },
        rules: {
          deptName: [
            { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] },
            { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change'] }
          ],
          deptCode: [
            { required: true, message: '请输入部门编号', trigger: ['blur', 'change'] },
            { min: 3, max: 3, message: '长度为 3', trigger: ['blur', 'change']  }
          ],
          shortName: [
            { required: true, message: '请输入部门简称', trigger: ['blur', 'change'] },
            { min: 1, max: 40, message: '长度不超过 40', trigger: ['blur', 'change'] }
          ],
          fullName: [
            { required: true, message: '请输入部门全称', trigger: ['blur', 'change'] },
            { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change'] }
          ],
          managerId: [
            { validator: checkNumber, trigger: ['blur', 'change'] }
          ],
          budgetHc: [
            { validator: checkNumber, trigger: ['blur', 'change'] }
          ],
          isFinalProfitunit: [
            { required: true, message: '请选择是否末端利润中心', trigger: ['blur', 'change'] }
          ],
          deptStatus: [
            { required: true, message: '请选择是否生效', trigger: ['blur', 'change'] }
          ]
        },
        useroptions:[],
        options:[]
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
            this.ruleForm.shortName = this.ruleForm.fullName;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params=this.ruleForm;
            this.$axios.post2('/hrs/dept', params)
              .then(function(response) {
                if(response.data.code==0){
                  this.openSuccess();
                  this.findByPage();
                  this.handleClose();
                }else{
                  this.openError(response.data.messageInfo);
                }

             }.bind(this)
            );
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
      this.$axios.get('/hrs/dept/selectUser')
      .then(function(response) {
          this.useroptions=response.data.data;
       }.bind(this)
      );
    }
  }
</script>
<style type="text/css">
</style>
