<template>
  <el-dialog title="新增角色"
              width="600px"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="hrsRoleSave">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="roleName">
            <el-input v-model="ruleForm.roleName" auto-complete="off" style="width: 200px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>角色名称</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px" prop="roleStatus">
            <el-input style="width:170px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>是否生效</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.roleStatus" placeholder="请选择" style="width:93px;margin-right: -5px;" >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 15px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag2">立即创建</el-button>
          <el-button size="small" type="primary" @click="resetForm('ruleForm')" plain>重置</el-button>
          <el-button size="small" type="primary" @click="selectAll()" plain>全选</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="选择角色权限" label-width="105px">
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-tree :data="permissionData" @node-click="checkNodes2" default-expand-all show-checkbox node-key="id" :default-expanded-keys="expandedKeys" :default-checked-keys="checkedData"  ref="tree" highlight-current  :check-strictly="checkstrictly" :props="defaultProps"  :expand-on-click-node="false" >

          </el-tree>
        </el-col>
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
      return {
        disabledFlag2: false,
        ruleForm: {
          roleName: '',
          roleStatus: 'true'
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: ['blur', 'change']  },
            { min: 1, max: 40, message: '长度不超过 40', trigger: ['blur', 'change']  }
          ],

        },

        // tree的基础数据
        permissionData: [],
        expandedKeys: [],
        checkedData: [],
        checkstrictly: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        }

      };
    },
    inject:['queryList'],
    created: function(){
       this.initData();
    },
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            // let params=this.ruleForm;
            // let params ="{\"roleName\":\""+this.ruleForm.roleName+"\",\"roleStatus\":true}";
            // let params ="{\"roleName\":12,\"roleStatus\":true}";
            if(this.ruleForm.roleStatus == 'true'){
                let permissionIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())+"";
                permissionIds = permissionIds.replace('[', '').replace(']', '');
                this.ruleForm.permissionIds = permissionIds;
            }else{
            }
            let params=JSON.stringify(this.ruleForm);
            this.disabledFlag2 = true;
            this.$axios.post2('/hrs/role/save',
              params)
              .then(function(response) {

                if(response.data.code==0){

                  this.openSuccess();
                  this.queryList();
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
              if(errorinfo.indexOf('Duplicate entry')>-1){
                if(errorinfo.indexOf('IDU_hrs_role_name')>-1)
                  this.openError('角色名称不可重复');
              }else{
                this.openError(errorinfo);
              }
            }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs.tree.setCheckedKeys([]);
      },

      selectAll(){
          this.$axios.get('/hrs/permission/roletreeForSelectAll').then(function(response) {
              console.log(response.data.data);
              this.$refs.tree.setCheckedKeys(response.data);
          }.bind(this)).catch(function(error) {
              console.log(error);
          });
      },

      //获取全部权限
      initData(){
        this.$axios.get('/hrs/permission/roletree').then(function(response) {
            console.log(response.data.data);
            this.permissionData = response.data.data;
            /*this.permissionData.forEach((row) => {
                if(row.parentId === -1) {
                    this.expandedKeys.push(row.id)
                }
            })*/
        }.bind(this)).catch(function(error) {
            console.log(error);
        });
      },
      /**
     * 初始化权限数据
     */
    initPermissionData() {
      var moduleChildren = []
      // 对所有模块进行循环
      this.allModuleList.forEach(module => {
        var tempModuleChildren = {}
        // 定义模块名称（一级菜单），取后台请求到的模块名称
        tempModuleChildren.title = module.title
        // 默认展开
        tempModuleChildren.expand = true
        var permissionChildern = []
        // 循环当前登入用户的所有权限
        this.userPermissionList.forEach(permission => {
          if (permission.permissionModuleId === module.id) {
            // 如果moduleid相等，说明该权限是当前module下的权限
            var permissionId = permission.permissionId
            var tempPermissionChildern = {}
            // 定义权限名称（二级菜单），取后台请求到的权限名称
            tempPermissionChildern.title = permission.permissionTitle
            // 默认展开
            tempPermissionChildern.expand = true
            // 这里是关键，定义是否要选中，默认不选中
            var checked = false
            // 对当前需要分配的角色的权限进行循环
            this.multiPermissionList.forEach(multi => {
              if (multi.permissionId === permissionId) {
                // 如果权限id和当前循环的权限id相等，则说明角色有该权限，设置选中
                checked = true
              }
            })
            // 这里很重要，把权限id设置给当前二级菜单
            tempPermissionChildern.permissionId = permissionId
            tempPermissionChildern.checked = checked
            permissionChildern.push(tempPermissionChildern)
          }
        })
        tempModuleChildren.children = permissionChildern
        moduleChildren.push(tempModuleChildren)
      })
      this.permissionData[0].children = moduleChildren
      this.spinShow = false
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      checkNodes2(data, node) {
          // this.childNodesChange(node);
          this.checkNodes();
          this.parentNodesChange(node);

      },
      childNodesChange(node) {
          let len = node.childNodes.length;
          for(let i = 0; i < len; i++) {
              node.childNodes[i].checked = false;
              this.childNodesChange(node.childNodes[i]);
          }
      },
      parentNodesChange(node) {
          if(node.parent) {
              for(let key in node) {
                  if(key == "parent") {
                      var checkFlag = false;
                      let len = node.parent.childNodes.length;
                      for(let i = 0; i < len; i++) {

                          if(node.parent.childNodes[i].checked) {
                              checkFlag = true;
                              break;
                          }
                      }
                      node[key].checked = checkFlag;
                      this.parentNodesChange(node[key]);
                  }
              }
          }
      },
      checkNodes() {
          if(this.$refs.tree.getCurrentNode().disabled) {
              return;
          }
          var nodes = this.$refs.tree.getCurrentNode().children.concat(this.$refs.tree.getCurrentNode());
          var keys = this.$refs.tree.getCheckedKeys();

          var reslutKeys = [];
          var reslutNodes = [];
          var flag = 0;
          for(var i = 0; i < nodes.length; i++) {
              var node = nodes[i];
              if(node.disabled) {

              } else {
                  reslutNodes.push(node);
              }
              for(var j = 0; j < keys.length; j++) {
                  if(node.id == keys[j]) {
                      flag = flag + 1;
                      break;
                  }
              }
          }

          if(flag != reslutNodes.length) {
              //勾选
              reslutKeys = keys;
              for(var i = 0; i < nodes.length; i++) {
                  if(nodes[i].disabled) {

                  } else {
                      reslutKeys.push(nodes[i].id);
                  }

              }
          } else {
              //取消勾选
              //alert(reslutKeys);
              for(var j = 0; j < keys.length; j++) {
                  var flag2 = 0;
                  for(var i = 0; i < nodes.length; i++) {
                      if(nodes[i].id === keys[j]) {
                          flag2 = 1;
                          break;
                      }
                  }
                  if(flag2 == 0) {
                      reslutKeys.push(keys[j]);
                  }
              }
          }

          this.$refs.tree.setCheckedKeys(reslutKeys);
          // this.$refs.tree.setCheckedNodes(this.$refs.tree.getCheckedNodes().concat(this.$refs.tree.getCurrentNode().children).concat(this.$refs.tree.getCurrentNode()));
      },
    }
  }
</script>
<style type="text/css">

  .hrsRoleSave .el-input__icon {
    line-height: 30px !important;
  }

  .hrsRoleSave .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsRoleSave .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
