<template>
  <el-dialog title="海港信息 - 编辑" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
    <div class="sc_port_maintenance_edit">
      <el-form v-loading="vLoad" :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="10px" style="margin-right: 10px;">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="portCode">
              <el-input v-model="ruleForm.portCode"  show-word-limit maxlength="10" @input="ruleForm.portCode = ruleForm.portCode.toUpperCase()">
                <template slot="prepend"> <font style="color:red">*</font>港口代码</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item  prop="portNameCn">
              <el-input v-model="ruleForm.portNameCn" clearable show-word-limit maxlength="100">
                <template slot="prepend">港口中文名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="portNameEn">
              <el-input v-model="ruleForm.portNameEn" clearable show-word-limit maxlength="100" @input="limitChineseString('portNameEn', ruleForm.portNameEn)">
                <template slot="prepend"> <font style="color:red">*</font>港口英文名称</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="cityCode">
              <el-input v-model="ruleForm.cityCode" show-word-limit maxlength="10" >
                <template slot="prepend">城市代码</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="cityNameCn">
              <el-input v-model="ruleForm.cityNameCn" clearable show-word-limit maxlength="100">
                <template slot="prepend">城市中文名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="cityNameEn">
              <el-input v-model="ruleForm.cityNameEn" clearable show-word-limit maxlength="100" @input="limitChineseString('cityNameEn', ruleForm.cityNameEn)">
                <template slot="prepend">城市英文名称</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="countryCode">
              <el-input v-model="ruleForm.countryCode" show-word-limit maxlength="10" >
                <template slot="prepend">国家代码</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="countryNameCn">
              <el-input v-model="ruleForm.countryNameCn" clearable show-word-limit maxlength="100">
                <template slot="prepend">国家中文名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="countryNameEn">
              <el-input v-model="ruleForm.countryNameEn" clearable show-word-limit maxlength="100" @input="limitChineseString('countryNameEn', ruleForm.countryNameEn)">
                <template slot="prepend">国家英文名称</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="timeZone">
              <el-input v-model="ruleForm.timeZone" @input="toUpperCase('timeZone', ruleForm.timeZone)">
                <template slot="prepend">时区</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="portLongitude">
              <el-input v-model="ruleForm.portLongitude">
                <template slot="prepend">经度</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="portLatitude">
              <el-input v-model="ruleForm.portLatitude">
                <template slot="prepend">纬度</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="15">
            <el-form-item prop="routingName">
              <el-input v-model="ruleForm.routingName" show-word-limit maxlength="50" @input="toUpperCase('routingName', ruleForm.routingName)">
                <template slot="prepend"> 航线 </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="isValid">
              <el-input  style="width: 390px">
                <template slot="prepend"> <font style="color:red">*</font> 是否有效 </template>
                <el-select slot="suffix" v-model="ruleForm.isValid" placeholder="是否有效" style="width: 256px;margin-right: -5px">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" :loading="loading" size="small" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "sc_port_maintenance_edit",
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
          portId: '',
          portCode: '',
          portNameCn: '',
          portNameEn: '',
          cityCode: '',
          cityNameCn: '',
          cityNameEn: '',
          countryCode: '',
          countryNameCn: '',
          countryNameEn: '',
          routingName: '',
          timeZone: '',
          portLongitude: '',
          portLatitude: '',
          isValid:'true',
        },
        rules: {
          portCode: [
            { required: true, message: '请输入港口代码', trigger: 'blur' },
            {  max: 10, message: '最大10字符', trigger: 'blur' }
          ],
          portNameCn: [
            { required: false, message: '请输入港口中文名称', trigger: 'blur' },
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          portNameEn: [
            { required: true, message: '请输入港口英文名称', trigger: 'blur' },
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          routingName: [
            {  max: 50, message: '最大50字符', trigger: 'blur' }
          ],
          isValid: [
            { required: true, message: '请选择是否有效', trigger: 'blur' },
          ],
          cityCode: [
            {  max: 10, message: '最大10字符', trigger: 'blur' }
          ],
          cityNameCn: [
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          cityNamEn: [
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          countryCode: [
            {  max: 10, message: '最大10字符', trigger: 'blur' }
          ],
          countryNameCn: [
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
          countryNamEn: [
            {  max: 100, message: '最大100字符', trigger: 'blur' }
          ],
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
            this.$axios.post2("/sc/portMaintenance/edit", this.ruleForm)
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
      },
      limitChineseString(ruleFormKey, value){
        if(ruleFormKey && value){
          this.ruleForm[ruleFormKey] = value.replace(/[\u4e00-\u9fa5]/ig,'').toUpperCase();
        }
      },
      toUpperCase(ruleFormKey, value){
        if(ruleFormKey && value){
          this.ruleForm[ruleFormKey] = value.toUpperCase();
        }
      }
    },
    created() {
      for(let key in this.ruleForm){
        this.ruleForm[key] = (this.frow[key] || '').toString();
      }
    }
  }
</script>

<style type="text/css">
  .sc_port_maintenance_edit .el-input__icon {
    line-height: 30px !important;
  }
  .sc_port_maintenance_edit .el-input-group__prepend{
    width: 134px;
    text-align: center;
  }
</style>
