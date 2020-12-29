<template>
	<el-dialog title="配置权限" width="35%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
        <el-form-item style="margin-left: 15px;">
				    <el-button size="small" type="primary" @click="submitPermission">提交</el-button>
            <el-select v-model="targetOrgId" >
              <el-option v-for="item in options" :key="item.orgId" :label="item.orgName" :value="item.orgId"> </el-option>
            </el-select>
            <el-button size="small" type="primary" @click="loadPermission">加载权限</el-button>
            <el-button size="small" type="primary" @click="resetForm('ruleForm')" plain>重置</el-button>
            <el-button size="small" type="primary" @click="selectAll()" plain>全选</el-button>
        </el-form-item>
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
					roleStatus: [{
						required: true,
						message: '请输入签约公司风控邮箱',
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
		created: function() {
			this.orgId = this.frow.orgId;
			this.roleId = this.frow.roleId;
			this.initData();
      //加载企业数据
      this.$axios.get('/hrs/org/getOrgList')
        .then(function(response) {
          console.log(response);
          this.options = response.data.data;
        }.bind(this));

    },
		mounted: function() {

			this.initData2();

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
			submitPermission() {

				//let permissionIds = this.$refs.tree.getCheckedKeys() + ',' +
				//this.$refs.tree.getHalfCheckedKeys();
				//permissionIds = permissionIds.replace('[', '').replace(']', '');
				console.log(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()));
				//树 优化
				let permissionIds = '['+this.$refs.tree.getCheckedKeys()+']';
				this.$axios.post2('/hrs/org/org-permission', {
						orgId: this.orgId,
						permissionIds: permissionIds,
						roleId: this.roleId
					})
					.then(function(response) {

						if(response.data.code == 0) {
							this.openSuccess();
							this.handleClose();
						} else {
							this.openError(response.data.data.messageInfo);

						}
					}.bind(this)).catch(function(error) {
						this.openError(response.data.data.messageInfo);
					}.bind(this));

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
        this.$refs.tree.setCheckedKeys([]);
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},

			//Permission----------------------------------------------
			//权限列表
			initData() {
				//获取全部权限
				this.$axios.get('/hrs/permission/treec/'+ this.orgId).then(function(response) {
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
      loadPermission(){
			  //取消所有选中
        this.$refs.tree.setCheckedKeys([]);
        this.$axios.get('/hrs/permission/org-tree/' + this.targetOrgId).then(function(response) {
          this.checkedData = response.data;
        }.bind(this)).catch(function(error) {
          console.log(error);
        });

      },
      selectAll(){
          this.$axios.get('/hrs/permission/treecForSelectAll/'+ this.orgId).then(function(response) {
              this.$refs.tree.setCheckedKeys(response.data);
          }.bind(this)).catch(function(error) {
              console.log(error);
          });
      },
		}
	}
</script>
