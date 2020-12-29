<template>
	<el-dialog title="签约模板 - 新增" width="60%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="模板名称" prop="orgName" required label-width="85px">
            <el-input v-model="ruleForm.orgName" auto-complete="off" style="width:150px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="用户数量" prop="orgUserCount" required label-width="85px">
            <el-input v-model="ruleForm.orgUserCount" auto-complete="off" style="width:100px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="是否启用" label-width="85px" required>
            <el-select v-model="ruleForm.orgStatus" placeholder="" style="width: 65px;">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="15px">
             <el-button size="small" type="primary" @click="submitPermission('ruleForm')">确定</el-button>
             <el-button size="small" type="primary" @click="resetForm('ruleForm')" plain>重置</el-button>
             <el-button size="small" type="primary" @click="selectAll()" plain>全选</el-button>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col>

					<el-tree
					:data="permissionData"
					show-checkbox
					default-expand-all
					node-key="id"
					ref="tree"
					highlight-current
					:default-checked-keys="checkedData"
					:check-strictly="checkstrictly"
					:props="defaultProps"
					:expand-on-click-node="false"
					@node-click="checkNodes2"

					>
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
      let numberValidator = (rule, value, callback) => {
          if(!value) {
              return callback();
          }
          let regE = /^[0-9]*[1-9][0-9]*$/g;
          if(!regE.test(value)) {
              callback(new Error('请输入正整数'));
          } else {
              callback();
          }
      };
			return {
				ruleForm: {
            orgName: '',
            orgUserCount: 1,
            orgStatus: '1'
				},
				rules: {
            orgName: [{
							required: true,
							message: '请输入模板名称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '模板名称长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
          orgUserCount: [{
						required: true,
						message: '请输入用户数量',
						trigger: ['blur', 'change']
					},
          {
              validator: numberValidator,
              trigger: ['blur', 'change']
          }
          ],
          orgStatus: [{
              required: true,
              message: '请选择是否启用',
              trigger: ['blur', 'change']
          }]
				},
				orgId: '',
				roleId: '',
				checkedData: [],
				checkstrictly: true,
				permissionData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
        options: [],
        targetOrgId: '',
			};
		},
    inject: ['findByPage'],
		created: function() {
			//this.orgId = this.frow.orgId;
			//this.roleId = this.frow.roleId;
			this.initData();
    },
		mounted: function() {

			//this.initData2();

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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			submitPermission(formName) {

				let permissionIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())+"";
				//permissionIds = permissionIds.replace('[', '').replace(']', '');
				//let permissionIds = '['+this.$refs.tree.getCheckedKeys()+']';

        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$axios.post2('/hrs/org/saveSignTemplateAndPermission', {
                    orgName: this.ruleForm.orgName,
                    orgUserCount: this.ruleForm.orgUserCount,
                    orgStatus: this.ruleForm.orgStatus,
                    permissionIds: permissionIds,
                })
                    .then(function(response) {

                        if(response.data.code == 0) {
                            this.openSuccess();
                            this.findByPage();
                            this.handleClose();
                        } else {
                            let errorinfo = response.data.messageInfo;
                            if(errorinfo.indexOf('IDU_hrs_org_org_name') > -1)
                                this.openError('签约模板名称不可重复');
                            if(errorinfo.indexOf('IDU_hrs_org_org_ename') > -1)
                                this.openError('签约模板名称不可重复');
                            else
                                this.openError(errorinfo);
                        }
                    }.bind(this)).catch(function(error) {
                    this.openError(response.data.data.messageInfo);
                }.bind(this));
            }else {
                console.log('error submit!!');
                return false;
            }
        });
			},
      resetForm(formName) {
          this.ruleForm.orgName = '';
          this.ruleForm.orgUserCount = 1;
          this.ruleForm.orgStatus = '1';
          this.$refs.tree.setCheckedKeys([]);
      },

      selectAll(){
          this.$axios.get('/hrs/permission/tree1ForSelectAll').then(function(response) {
              this.$refs.tree.setCheckedKeys(response.data);
          }.bind(this)).catch(function(error) {
              console.log(error);
          });
      },
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},

			//Permission----------------------------------------------
			//权限列表
			initData() {
				//获取全部权限
				this.$axios.get('/hrs/permission/tree1').then(function(response) {
					this.permissionData = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				});
			},
			initData2() {

				//获取当前角色权限
				this.$axios.get('/hrs/permission/org-tree/' + this.orgId).then(function(response) {

					this.checkedData = response.data;

				}.bind(this)).catch(function(error) {
					console.log(error);
				});

			},
			checkNodes2(data, node) {

				// this.childNodesChange(node);
				this.checkNodes();
        		this.parentNodesChange(node);

			},
			childNodesChange(node){
		        let len = node.childNodes.length;
		        for(let i = 0; i < len; i++){
		          node.childNodes[i].checked = false;
		          this.childNodesChange(node.childNodes[i]);
		        }
		      },
		      parentNodesChange(node){
	            if(node.parent){
	              for(let key in node){
	                if(key == "parent"){

	                    var checkFlag=false;
	                    let len = node.parent.childNodes.length;
	                    for(let i = 0; i < len; i++){

	                      if (node.parent.childNodes[i].checked) {
	                        checkFlag=true;
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
			handleClick(tab, event) {
			},
		}
	}
</script>
