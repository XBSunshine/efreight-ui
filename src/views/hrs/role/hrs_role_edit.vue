<template>
	<el-dialog title="修改角色" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="hrsRoleEdit">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="roleName">
            <el-input v-model="ruleForm.roleName" auto-complete="off" style="width: 200px;" :disabled="true">
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
          <!--<el-button size="small" type="primary" @click="submitForm('ruleForm')">修改</el-button>
					<el-button size="small" type="primary" @click="submitPermission()">提交权限</el-button>-->
          <el-button size="small" type="primary" @click="saveForm()" :loading="loading">保存</el-button>
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
					<el-tree :data="permissionData" @node-click="checkNodes2" default-expand-all show-checkbox node-key="id" :default-checked-keys="checkedData"  ref="tree" highlight-current  :check-strictly="checkstrictly" :props="defaultProps"  :expand-on-click-node="false" >

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
			},
			frow: Object
		},
		data() {
			return {
				ruleForm: {
					roleName: '',
					roleStatus: 'true'
				},
				rules: {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
				},
        loading: false,
				permissionData: [],
				expandedKeys: [],
				checkedData: [],
				checkstrictly: true,
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				roleId: ''

			};
		},
		inject: ['queryList'],
		created: function() {
			this.roleId = this.frow.roleId;
			this.$axios.get('/hrs/role/' + this.roleId).then(function(response) {
				console.log(response);
				this.ruleForm = response.data.data;
				this.ruleForm.roleStatus = this.ruleForm.roleStatus + '';
			}.bind(this)).catch(function(error) {
				console.log(error);
			});
			this.initData();
		},
    mounted: function() {
        this.initData2();
    },
		methods: {
		handleCheckChange(data, checked, indeterminate){},
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
							//  if (node.childNodes.length>0) {

							//   var checkFlag=false;
							//   let len = node.childNodes.length;
							//   for(let i = 0; i < len; i++){
							//     alert(node.childNodes[i].checked);
							//     if (node.childNodes[i].checked) {
							//       checkFlag=true;

							//     }
							//   }
							//   node[key].checked = checkFlag;
							// }else{

							var checkFlag = false;
							let len = node.parent.childNodes.length;
							for(let i = 0; i < len; i++) {

								if(node.parent.childNodes[i].checked) {
									checkFlag = true;
									break;
								}
							}
							node[key].checked = checkFlag;

							// }
							// alert(node.childNodes.length);
							// node[key].checked = true;
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

				// var keys2=this.$refs.tree.getCheckedKeys();
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

      saveForm(){
          if(this.ruleForm.roleStatus == 'true'){
            this.loading = true
            this.submitForm('ruleForm');
            this.submitPermission();
          }else{
            this.loading = true
            this.submitForm('ruleForm');
            this.queryList();
            this.openSuccess();
            this.handleClose();
          }
      },

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let params = JSON.stringify(this.ruleForm);
						this.$axios.put('/hrs/role/edit',
								params)
							.then(function(response) {
                this.loading = false;
								if(response.data.code == 0) {
									//遍历选中的菜单：

									//this.openSuccess();
									//this.queryList();
									//this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this)).catch(function(error) {
              this.loading = false;
              let errorinfo = error.response.data.messageInfo;
								//唯一性错误
								if(errorinfo.indexOf('Duplicate entry') > -1) {
									if(errorinfo.indexOf('IDU_hrs_role_name') > -1)
										this.openError('角色名称不可重复');
								} else {
									this.openError(errorinfo);
								}
							}.bind(this));
					} else {
            this.loading = false;
            console.log('error submit!!');
						return false;
					}
				});

			},
			resetForm(formName) {
				this.ruleForm.roleStatus = 'true';
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
			submitPermission() {
				let permissionIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())+"";
				//console.log(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()));
				permissionIds = permissionIds.replace('[', '').replace(']', '');
				// permissionIds = permissionIds.substring(1,permissionIds.length-1);
				//console.log("哈哈哈"+permissionIds);
				let params = {
					roleId: this.roleId,
					orgId: window.localStorage.getItem('orgId'),
					permissionIds: permissionIds
				}
				this.$axios.put('/hrs/role/menu',
						params)
					.then(function(response) {
						if(response.data.code == 0) {
                this.loading = false
                this.openSuccess();
                this.queryList();
                this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
                this.loading = false
						}

					}.bind(this));
			},
			//权限列表
			initData() {
				//获取全部权限
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
      initData2() {
          //获取当前角色权限
          this.$axios.get('/hrs/permission/treeR/' + this.roleId).then(function(response) {
              console.log(response.data);
              //alert(response.data.length);
              // this.checkedData=response.data;
              // let checks = response.data+'';
              // checks= '[{"id": '+checks.replace(',','}, {"id": ').replace('[','').replace(']','')+'}]';
              // console.log(checks);
              // let checksjson = JSON.stringify(checks);
              // console.log(checksjson);
              // this.$refs.tree.setCheckedNodes(response.data);
              this.$refs.tree.setCheckedKeys(response.data);
              // this.checkstrictly=false;
          }.bind(this)).catch(function(error) {
              console.log(error);
          });
      },

			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">

  .hrsRoleEdit .el-input__icon {
    line-height: 30px !important;
  }

  .hrsRoleEdit .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsRoleEdit .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
