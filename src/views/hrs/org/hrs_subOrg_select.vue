<template>
  <el-dialog  title="签约公司 - 选择" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <div class="templateEditPage">
      <el-form :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
        <el-row class="elementWidth">
          <el-col class="elementWidth">
            <el-form-item label="公司名称" label-width="85px">
              <el-input v-model="query.orgName" auto-complete="off" style="width: 280px;" @input="query.orgName=query.orgName.toUpperCase()" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 38px;">
              <el-button type="primary" size="small" v-on:click="loadSubOrg">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div style="margin-bottom: 10px">
            <el-table :data="subOrgData" @selection-change="handleSelectionChange"  height="400" ref="multipleTable" >
              <el-table-column type="selection" align="center" width="55"></el-table-column>
              <el-table-column prop="orgCode" label="代码" width="120"> </el-table-column>
              <el-table-column prop="orgName" label="签约公司名称"> </el-table-column>
            </el-table>
          </div>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col class="elementWidth">
            <el-button type="primary" size="small" @click="confirmSelected" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">确认</el-button>
            <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" @click="doCancel1">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

  </el-dialog>
</template>

<script>
  export default {
    name: "hrs_subOrg_select",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      frow: Object
    },
    data(){
      return {
        subOrgData: [],
        selectionSubOrg: [],
        query: {
            orgName: '',
            orgId: ''
        },
        ruleForm: {
            orgId: '',
            selectionSubOrgs: []
        },
      }
    },
    inject: ['loadConfigServices'],
    methods: {
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
      loadSubOrg(){
        let that = this;
        that.query.orgId = that.frow.orgId
        this.$axios.get2("/hrs/org/selectSubOrg",that.query).then(function(response){
          if(response.data && response.data.code == 0){
            this.subOrgData = response.data.data;
          }else{
            this.openError(response.data.message || "数据加载失败");
          }
        }.bind(this)).catch(function(error){
          console.error(error);
        }).then(function(){
        }.bind(this));
      },
      handleSelectionChange(val){
        this.selectionSubOrg = val;
      },
      confirmSelected(){
        if(this.selectionSubOrg.length === 0){
            this.openError("请至少选择一个签约公司")
            return;
        }
        this.ruleForm.selectionSubOrgs = this.selectionSubOrg;
        this.ruleForm.orgId = this.frow.orgId;
        this.$axios.post2("/hrs/org/saveSubOrg", this.ruleForm)
            .then(function(response){
                if(response.data && response.data.code == 0){
                    this.openSuccess();
                    this.handleClose();
                    this.loadConfigServices(this.frow.orgId);
                }else{
                    this.openError(response.data.messageInfo)
                }
            }.bind(this))
            .catch(function(error){
                this.openError(error.response.data.messageInfo)
            }.bind(this))
      },
      doCancel1(){
          this.loadConfigServices(this.frow.orgId);
          this.handleClose();
      },
    },
    created() {
      this.loadSubOrg();
    },

  }
</script>

<style scoped>

</style>
