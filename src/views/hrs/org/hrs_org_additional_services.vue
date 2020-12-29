<template>
  <el-dialog title="附加服务" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <div class="templateEditPage">
      <el-form :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
        <el-row class="elementWidth">
          <el-form-item label-width="20px">
            <el-input auto-complete="off" v-model="this.frow.orgName" clearable style="width: 730px;" disabled>
              <template slot="prepend">公司名称(中文)</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div style="margin-bottom: 10px">
            <el-table :data="configServices" :header-cell-style="{background:'oldlace'}"  >
              <el-table-column  width="40" align="center" >
                <template slot="header" slot-scope="scope">
                  <i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
                </template>
                <template slot-scope="scope" >
                  <i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
                </template>
              </el-table-column>
              <el-table-column label="服务类型" width="195" >
                <template slot-scope="scope">
                  <el-select :default-first-option=true v-model="scope.row.serviceType"  placeholder="请选择服务" style="width:185px" @change="changeEditOp(scope.row)">
                    <el-option v-for="(item, index) in serviceOptions" :key="index" :label="item.paramText" :value="item.ediCode1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="周期标准" width="100">
                <template slot-scope="scope">
                  <el-select :default-first-option=true v-model="scope.row.serviceCycle" placeholder="请选择服务" style="width:100px" @change="changeEditOp(scope.row)">
                    <el-option v-for="(item, index) in cycleTypeOptions" :key="index" :label="item.paramText" :value="item.ediCode1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="套餐量" width="80px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.serviceNumberMax"
                            @input="scope.row.serviceNumberMax = scope.row.serviceNumberMax.replace(/\D/g, '')"
                            @change="changeEditOp(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="已用量" width="80px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.serviceNumberUsed" v-if="scope.row.serviceNumberUsed" disabled></el-input>
                  <el-input v-model="scope.row.serviceNumberUsed" v-else disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注" width="250px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" maxlength="200"
                            @change="changeEditOp(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-row>
        <el-row>
          <el-form-item label-width="10px">
            <el-button  type="primary" size="small" @click="doSubmit" :disabled="loading" :loading="loading">保存模板</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
    export default {
      name: "hrs_org_additional_services",
      props: {
        visible: {
          type: Boolean,
          default: false
        },
        frow: Object
      },
      data(){
        return {
          loading: false,
          configServices: [],
          serviceOptions: [],
          cycleTypeOptions: [],
          deleteRows: {},
        }
      },
      methods : {
        handleClose() {
          this.$emit('update:visible', false);
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
        /**
         * 加载服务类型
         */
        loadService(){
          this.$axios.get2('/afbase/category/paramsNew', {
            categoryName: "签约公司附加服务标准"
          }).then(function(response) {
            this.serviceOptions = response.data.data;
          }.bind(this)).catch(function(error) {
            console.log(error);
          })
        },
        /**
         * 加载周期类型
         */
        loadCycleType(){
          this.$axios.get2('/afbase/category/paramsNew', {
            categoryName: "签约公司附加服务周期"
          }).then(function(response) {
            this.cycleTypeOptions = response.data.data;
          }.bind(this)).catch(function(error) {
            console.log(error);
          })
        },
        /**
         * 加载企业服务配置信息
         */
        loadConfigServices(orgId){
          this.$axios.get('/hrs/orgServiceMealConfig/list/'+orgId).then(function(response) {
            this.configServices = response.data.data;
          }.bind(this)).catch(function(error) {
            console.log(error);
          })
        },
        doAdd(){
          let j = {
            op: 'add',
            serviceType: '',
            serviceCycle: '',
            serviceNumberMax: 20,
            serviceNumberUsed: 0,
            remark: '',
          };
          this.configServices.push(j);
        },
        doDelete(index, rrow) {
          console.log(index);
          let id = rrow['orgServiceMealConfigId'];
          if(id){
            this.deleteRows[id] = rrow;
          }
          this.configServices.splice(index, 1);
          console.log(this.deleteRows);
        },
        doSubmit(){
          this.loading = true;
          if(!this.checkFields()){
            this.loading = false;
            return;
          }
          //设置企业ID
          let orgId = this.frow.orgId;
          this.configServices.forEach((item)=>{
            item['orgId'] = orgId;
          });
          //添加删除数据
          for (let id in this.deleteRows) {
            let item = this.deleteRows[id];
            item['op'] = "delete";
            this.configServices.push(item);
          }

          this.$axios.post2("/hrs/orgServiceMealConfig/process", this.configServices).then(function(response){
            if(response.data.code == 0){
              this.openSuccess();
              this.handleClose();
            }else{
              this.loading = false;
              this.openError(response.data.message || '操作失败');
            }
          }.bind(this))
          .catch(function(error){
            this.loading = false;
            if(error.response.data.messageInfo.indexOf("hrs_org_service_meal_config.SY.01") > 0){
              this.openError("服务类型不能重复");
            }else{
              this.openError(error.response.data.messageInfo || '操作失败');
            }
          }.bind(this));
        },
        checkFields(){
          for (let i = 0; i < this.configServices.length; i++) {
            let item = this.configServices[i];
            if((item.serviceType || "").length == 0){
              this.openError("请选择服务类型");
              return false;
            }
            if((item.serviceCycle || "").length == 0){
              this.openError("请选择周期标准");
              return false;
            }
            if(item.serviceNumberMax <= 0){
              this.openError("套餐量不能小于0");
              return false;
            }
          }
          return true;
        },
        changeEditOp(row){
          if(row && row['orgServiceMealConfigId']){
            row['op'] = 'edit';
          }
        }
      },
      created() {
        this.loadService();
        this.loadCycleType();
        this.loadConfigServices(this.frow.orgId);
      },
      mounted() {

      }
    }
</script>

<style scoped>

</style>
