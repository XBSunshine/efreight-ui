<template>
  <el-dialog title="TACT - 编辑" width="90%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
    <el-form :disabled="loading" :inline="true" :model="ruleForm" :rules="rules" :close-on-press-escape="false" ref="ruleForm" label-width="85px" style="margin-left: 10px;">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="航司两字码" prop="carrierCode">
            <el-input style="width: 80px;" v-model="ruleForm.carrierCode" @input="ruleForm.carrierCode=ruleForm.carrierCode.toUpperCase()"  auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="生效日期" required prop="beginDate">
            <el-date-picker style="width: 135px;" v-model="ruleForm.beginDate" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期"> </el-date-picker>
            <span>-</span>
          </el-form-item>
          <el-form-item prop="endDate">
            <el-date-picker style="width: 135px;" v-model="ruleForm.endDate" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期"> </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="始发港" prop="departureStation" required>
            <el-input style="width: 80px;" v-model="ruleForm.departureStation" @input="ruleForm.departureStation=ruleForm.departureStation.toUpperCase()"  auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="目的港" prop="arrivalStation">
            <el-input style="width: 80px;" v-model="ruleForm.arrivalStation" @input="ruleForm.arrivalStation=ruleForm.arrivalStation.toUpperCase()" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="M" prop="tactM">
            <el-input style="width: 80px;" v-model="ruleForm.tactM" @input="formatToFloat('tactM')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="N" prop="tactN">
            <el-input style="width: 80px;" v-model="ruleForm.tactN" @input="formatToFloat('tactN')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="45+" prop="tact45">
            <el-input style="width: 80px;" v-model="ruleForm.tact45" @input="formatToFloat('tact45')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="100+" prop="tact100">
            <el-input style="width: 80px;" v-model="ruleForm.tact100" @input="formatToFloat('tact100')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="300+" prop="tact300">
            <el-input style="width: 80px;" v-model="ruleForm.tact300" @input="formatToFloat('tact300')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="500+" prop="tact500">
            <el-input style="width: 80px;" v-model="ruleForm.tact500" @input="formatToFloat('tact500')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="700+" prop="tact700">
            <el-input style="width: 80px;" v-model="ruleForm.tact700" @input="formatToFloat('tact700')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="1000+" prop="tact1000">
            <el-input style="width: 80px;" v-model="ruleForm.tact1000" @input="formatToFloat('tact1000')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="2000+" prop="tact2000">
            <el-input style="width: 80px;" v-model="ruleForm.tact2000" @input="formatToFloat('tact2000')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="3000+" prop="tact3000">
            <el-input style="width: 80px;" v-model="ruleForm.tact3000" @input="formatToFloat('tact3000')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="5000+" prop="tact5000">
            <el-input style="width: 80px;" v-model="ruleForm.tact5000" @input="formatToFloat('tact5000')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">修改</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
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
            fRow: Object
        },
        data(){
            return {
                loading: false,
                //表单字段
                ruleForm: {
                    tactId: -1,
                    carrierCode: "",
                    departureStation: "",
                    arrivalStation: "",
                    beginDate: "",
                    endDate: "",
                    tactM: "",
                    tactN: "",
                    tact45: "",
                    tact100: "",
                    tact300: "",
                    tact500: "",
                    tact700: "",
                    tact1000: "",
                    tact2000: "",
                    tact3000: "",
                    tact5000: "",
                },
                //验证规则
                rules: {
                    carrierCode: [{
                        max: 2,
                        message: '长度不超过2',
                        trigger: ['blur', 'change']
                    }],
                    departureStation: [{
                        required: true,
                        message: '请输入始发港',
                        trigger: ['blur', 'change']
                    },{
                        max: 4,
                        message: '长度不超过4',
                        trigger: ['blur', 'change']
                    }],
                    beginDate: [{
                        required: true,
                        message: '请输入生效日期',
                        trigger: ['blur', 'change']
                    }]
                }
            }
        },
        inject: ['queryList'],
        methods: {
            //关闭
            handleClose(){
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
            submitForm(formName){
                this.$refs[formName].validate((valid) =>{
                    if(valid){
                        this.loading = true;
                        let params = this.ruleForm;
                        this.$axios.post2("/afbase/tact/doUpdate", params)
                            .then(function(response){
                                if(response.data.code == 0){
                                    this.loading = false;
                                    this.openSuccess();
                                    this.handleClose();
                                    this.queryList();
                                }else{
                                    this.loading = false;
                                    this.openError(response.data.messageInfo || "");
                                }
                            }.bind(this))
                            .catch(function(error){
                                this.loading = false;
                                this.openError(error.response.data.messageInfo || "");
                            }.bind(this));
                    }else{
                        console.log("error submit!");
                        return false;
                    }
                })
            },
            resetForm(){
                this.init();
            },
            formatToFloat(item){
                if(!item){return}
                this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789.]/g, "");
                let t = this.ruleForm[item].split('.');
                if(t.length > 1) {
                    this.ruleForm[item] = t[0] + "." + t[1].substr(0, 2);
                }
            },
            init(){
                let tactId = this.fRow.tactId;
                this.$axios.get("/afbase/tact/" + tactId)
                    .then((response)=>{
                        if(response.data.code == 0 && response.data.data){
                            let data = response.data.data;
                            for (let ruleFormKey in this.ruleForm) {
                                this.ruleForm[ruleFormKey] = data[ruleFormKey] || "";
                            }
                        }else{
                            this.openError("数据加载失败");
                        }
                    })
            }
        },
        created() {
            this.init();
        }
    }
</script>
