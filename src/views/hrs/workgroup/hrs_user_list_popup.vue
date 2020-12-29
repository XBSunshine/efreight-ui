<template>
  <el-dialog  title="用户 - 选择" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <el-table :data="userData" @selection-change="handleSelectionChange"  height="400" ref="multipleTable" >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="userName" label="姓名"> </el-table-column>
      <el-table-column prop="userEmail" show-overflow-tooltip label="邮件"> </el-table-column>
      <el-table-column prop="phoneNumber" label="手机号" width="150"> </el-table-column>
      <el-table-column prop="jobPosition" label="岗位" width="100"> </el-table-column>
      <el-table-column prop="deptName" label="部门"> </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col class="elementWidth">
        <el-button type="primary" size="small" @click="confirmSelected" >确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    name: "hrs_user_list_popup",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      fillData: {
        type: Array,
        default: [],
      },
    },
    data(){
      return {
        userData: [],
        selectionUser: [],
      }
    },
    inject: ['fillUserData'],
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
      loadUser(){
        this.$axios.get("/hrs/userWorkgroup/listUser").then(function(response){
          if(response.data && response.data.code == 0){
            this.userData = response.data.data;
          }else{
            this.openError(response.data.message || "数据加载失败");
          }
        }.bind(this)).catch(function(error){
          console.error(error);
        }).then(function(){
          this.toggleSelection();
        }.bind(this));
      },
      handleSelectionChange(val){
        this.selectionUser = val;
      },
      confirmSelected(){
        this.handleClose();
        this.fillUserData(this.selectionUser);
      },
      toggleSelection(){
        let dic = {};
        this.fillData.forEach(row => {
          dic[row['userId']] = row;
        })
        this.userData.forEach(row =>{
          if(dic[row['userId']]){
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        })
      }
    },
    created() {
      this.loadUser();
    },

  }
</script>

<style scoped>

</style>
