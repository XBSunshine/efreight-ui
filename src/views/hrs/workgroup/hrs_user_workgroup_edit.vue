<template>
  <div>

  <el-dialog  title="工作组 - 修改" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" class="user_workgroup_save">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:188px;">
              <template slot="prepend">业务范畴</template>
              <el-select slot="suffix" v-model="ruleForm.businessScope" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                <el-option v-for="(item,index) in businessScope" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="workgroupName">
            <el-input v-model="ruleForm.workgroupName" auto-complete="off" style="width: 400px;" clearable  clearable show-word-limit maxlength="20">
              <template slot="prepend"><span style="color:red">*</span>组名称</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 31px; margin-top: -7px">
            <el-button type="primary" size="small" @click="saveWorkgroup" >保存</el-button>
            <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" @click="cleanUser" >清空组员</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col style="margin-top: -20px">
          <el-form-item class="elementWidth" style="margin-left: 9px; margin-right: 9px">
            <el-button type="text" disabled>工作组备注</el-button>
            <el-input type="textarea" v-model="ruleForm.workgroupRemark" maxlength="500" show-word-limit>
              <template slot="prepend">工作组备注</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div style="margin:0px 10px 10px 10px;">
            <el-table :data="userData" :header-cell-style="{background:'oldlace'}" max-height="300px">
              <el-table-column  width="40" align="center"  >
                <template slot="header" slot-scope="scope">
                  <i class="iconfont el-icon-myyuanquanjiahao" @click="showUser" style="cursor: pointer;size: b5;color: #409EFF;"></i>
                </template>
                <template slot-scope="scope" >
                  <i class="iconfont el-icon-myjianhao" @click="deleteUser(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="姓名"> </el-table-column>
              <el-table-column prop="userEmail" show-overflow-tooltip label="邮件"> </el-table-column>
              <el-table-column prop="phoneNumber" label="手机号" width="150"></el-table-column>
              <el-table-column prop="jobPosition" label="岗位" width="100"></el-table-column>
              <el-table-column prop="deptName" label="部门"> </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
    <userListTag ref="addMission" v-if="userListVisible" :visible.sync="userListVisible" :fillData.sync="userData"></userListTag>
  </div>
</template>

<script>
    import userListTag from "./hrs_user_list_popup"
    export default {
      name: "hrs_user_workgroup_edit",
      props: {
        visible: {
          type: Boolean,
          default: false
        },
        frow: Object
      },
      components: {
        "userListTag": userListTag
      },
      data(){
        return {
          loading: false,
          businessScope: [],
          userData: [],
          userListVisible: false,
          ruleForm: {
            workgroupId: '',
            businessScope: '',
            workgroupName: '',
            workgroupRemark: '',
            userIds: []
          },
          rules: {
            name: [
              { required: true, message: '请输入组名称', trigger: ['blur', 'change'] }
            ]
          }
        }
      },
      provide(){
        return {
          fillUserData: this.fillUserData,
        }
      },
      inject: ['queryWorkgroup'],
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
        loadBusinessScope(){
          this.$axios.get2('/afbase/service/businessScope' ).then((response) => {
            if(response.data.code == '0'){
              this.businessScope = response.data.data;
              if(this.params && this.params[0]){
                this.query.businessScope = this.params[0].paramText || "";
              }
            }
          }).catch(function(error) {
            console.error(error);
          });
        },
        saveWorkgroup(){
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              this.loading = true;
              this.ruleForm.userIds = this.getSelectedUserIds();
              this.$axios.post2("/hrs/userWorkgroup/edit", this.ruleForm)
              .then(function(response){
                this.loading = false;
                if(response.data && response.data.code == 0){
                  this.openSuccess();
                  this.handleClose();
                  this.queryWorkgroup();
                }else{
                  this.openError(response.data.messageInfo)
                }
              }.bind(this))
              .catch(function(error){
                this.loading = false;
                if(error.response.data.messageInfo.indexOf('hrs_user_workgroup.SY.02') > 0){
                  this.openError("组名称不能重复");
                }else{
                  this.openError(error.response.data.messageInfo)
                }
              }.bind(this))
            }else{
              return false;
            }
          })
        },
        getSelectedUserIds(){
          let ids = [];
          this.userData.forEach((item)=>{
            if(item['userId']){
              ids.push(item['userId']);
            }
          })
          return ids;
        },
        cleanUser(){
          this.userData = [];
        },
        showUser(){
          this.userListVisible = true;
        },
        deleteUser(index, row){
          this.userData.splice(index, 1);
        },
        /**
         * 填充用户数据
         * @param data
         */
        fillUserData(data){
          this.userData = data;
        },
        loadWorkgroupDetail(){
          let workgroupId = this.frow['workgroupId'];
          this.$axios.get("/hrs/userWorkgroup/"+workgroupId)
          .then(function(response){
            if(response.data && response.data.code == 0){
              for(let key in this.ruleForm){
                this.ruleForm[key] = response.data.data[key] || '';
              }
              this.userData = response.data.data['userList'];
            }else{
              this.openError(response.data.messageInfo || "数据加载失败");
            }
          }.bind(this))
          .catch(function(error){
            console.error(error);
            this.openError("数据加载失败");
          }.bind(this))
        }
      },
      created() {
        this.loadBusinessScope();
        this.loadWorkgroupDetail();
      }
    }
</script>

<style >
  .user_workgroup_save .el-input__icon {
    line-height: 30px !important;
  }
</style>
