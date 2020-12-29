<template>
  <el-dialog title="签约公司 - 分公司设置" width="500px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <div class="templateEditPage">
      <el-form :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
        <el-row class="elementWidth">
          <el-form-item label-width="20px">
            <el-input auto-complete="off" v-model="this.frow.orgName" clearable style="width: 450px;" disabled>
              <template slot="prepend">公司名称(中文)</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div style="margin-bottom: 10px">
            <el-table :data="configServices" :header-cell-style="{background:'oldlace'}"  height="360px">
              <el-table-column  width="40" align="center" >
                <template slot="header" slot-scope="scope">
                  <i class="iconfont el-icon-myyuanquanjiahao" @click="showSubOrg" style="cursor: pointer;size: b5;color: #409EFF;"></i>
                </template>
                <template slot-scope="scope" >
                  <i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
                </template>
              </el-table-column>
              <el-table-column prop="orgCode" label="代码" width="150"></el-table-column>
              <el-table-column prop="orgName" label="分公司名称" width="260"></el-table-column>
            </el-table>
          </div>
        </el-row>
        <el-row>
          <el-form-item label-width="10px">
            <el-button  type="primary" size="small" @click="doCancel" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <subOrgListTag ref="addMission" v-if="subOrgListVisible" :visible.sync="subOrgListVisible" :frow="frow"></subOrgListTag>
  </el-dialog>
</template>

<script>
    import subOrgListTag from "./hrs_subOrg_select"
    export default {
      name: "hrs_subOrg_config",
      props: {
        visible: {
          type: Boolean,
          default: false
        },
        frow: Object
      },
      components: {
          "subOrgListTag": subOrgListTag
      },
      data(){
        return {
          loading: false,
          configServices: [],
          deleteRows: {},
          subOrgListVisible: false,
        }
      },
      provide(){
          return {
              loadConfigServices: this.loadConfigServices,
          }
      },
      inject: ['queryList'],
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
         * 加载企业分公司配置信息
         */
        loadConfigServices(orgId){
          this.$axios.get('/hrs/org/listSubOrg/'+orgId).then(function(response) {
            this.configServices = response.data.data;
          }.bind(this)).catch(function(error) {
            console.log(error);
          })
        },
        showSubOrg(){
            this.subOrgListVisible = true;
        },
        doDelete(index, rrow) {
            this.$confirm('请确认，是否移除该分公司？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$axios.deletes('/hrs/org/deleteSubOrg/' + rrow.orgId + '/' + this.configServices.length)
                    .then(function(response) {
                        if(response.data.code == 0) {
                            this.openSuccess();
                            this.loadConfigServices(this.frow.orgId);
                        } else {
                            this.openError(response.data.messageInfo);
                        }
                    }.bind(this));
            }).catch(() => {

            });
        },
        doCancel(){
            this.queryList();
            this.handleClose();
        },
      },
      created() {
        this.loadConfigServices(this.frow.orgId);
      },
    }
</script>

<style scoped>

</style>
