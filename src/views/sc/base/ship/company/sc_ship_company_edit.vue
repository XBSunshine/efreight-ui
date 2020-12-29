<template>
  <el-dialog title="航司信息 - 修改" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
    <div class="sc_ship_company_save">
      <el-form v-loading="vLoad" :model="ruleForm" :rules="rules"  ref="ruleForm"  style="margin-left: 10px;">
        <el-form-item prop="shipCompanyCode">
          <el-input v-model="ruleForm.shipCompanyCode" @input="ruleForm.shipCompanyCode = ruleForm.shipCompanyCode.toUpperCase()">
            <template slot="prepend"> <span style="color:red">*</span> 船司代码 </template>
          </el-input>
        </el-form-item>
        <el-form-item  prop="shipCompanyNameCn">
          <el-input v-model="ruleForm.shipCompanyNameCn">
            <template slot="prepend"> <span style="color:red">*</span> 船司中文名称 </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="shipCompanyNameEn">
          <el-input v-model="ruleForm.shipCompanyNameEn" @input="ruleForm.shipCompanyNameEn = ruleForm.shipCompanyNameEn.replace(/[\u4e00-\u9fa5]/ig,'')">
            <template slot="prepend"> <span style="color:red">*</span> 船司英文名称 </template>
          </el-input>
        </el-form-item>
        <el-form-item  prop="isValid">
          <el-input style="width: 350px">
            <template slot="prepend"><span style="color:red">*</span>是否有效</template>
            <el-select slot="suffix" v-model="ruleForm.isValid" placeholder="是否有效" style="margin-right: -5px">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" size="small" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
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
    inject: ["queryList"],
    data(){
      return {
        vLoad: false,
        loading: false,
        ruleForm: {
          shipCompanyId:'',
          shipCompanyCode: '',
          shipCompanyNameCn: '',
          shipCompanyNameEn: '',
          isValid:'true',
        },
        rules: {
          shipCompanyCode: [
            { required: true, message: '请输入航司代码', trigger: 'blur' },
            {  max: 10, message: '最大10字符', trigger: 'blur' }
          ],
          shipCompanyNameCn: [
            { required: true, message: '请输入船司中文名称', trigger: 'blur' },
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          shipCompanyNameEn: [
            { required: true, message: '请输入船司英文名称', trigger: 'blur' },
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          isValid: [
            { required: true, message: '请选择是否有效', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      handleClose(){
        this.$emit('update:visible', false);
      },
      openError(info) {
        this.$notify({
          title: '',
          message: '操作失败，' + info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            console.log(this.ruleForm);
            this.$axios.post2("/sc/shipCompany/edit", this.ruleForm)
              .then(function(response){
                if(response.data.code == 0){
                  this.$emit('update:visible', false);
                  this.queryList();
                }else{
                  this.loading = false;
                  this.openError(response.data.messageInfo || '操作失败');
                }
              }.bind(this))
              .catch(function(error){
                this.loading = false;
                this.openError(error)
              }.bind(this))

          } else {
            return false;
          }
        });
      }
    },
    created() {
      for(let key in this.ruleForm){
        this.ruleForm[key] = (this.frow[key] || '').toString();
      }
    }
  }
</script>

<style scoped>

</style>
