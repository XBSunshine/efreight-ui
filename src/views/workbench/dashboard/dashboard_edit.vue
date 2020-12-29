<template>
	<el-dialog title="选择我的常用" width="35%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-row>
			<el-col :span="6">
				<el-button type="primary" @click="submitApplication">保存</el-button>
			</el-col>
			<el-col :span="11">
				<el-tree :data="permissionData" :default-expanded-keys="checkedData" show-checkbox node-key="id" ref="tree" highlight-current :default-checked-keys="checkedData" :props="defaultProps">
				</el-tree>
			</el-col>
		</el-row>
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
				permissionData: [],
				checkedData: [],
				defaultCheckedKeys: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		inject: ['findApplication'],
		created() {
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			submitApplication() {
				console.log(this.$refs.tree.getCheckedKeys() + "")
				console.log(this.$refs.tree.getCheckedKeys())
				let params = {
					applicationIds: this.$refs.tree.getCheckedKeys() + ""
				}
				this.$axios.post2('/hrs/home', params)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findApplication();
							this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this));
			},
			//权限列表
			initData() {
				//获取全部菜单权限
				this.$axios.get('/hrs/permission/listForMyApplication').then(function(response) {
					this.permissionData = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				});
				
				//获取选中的菜单
				this.$axios.get('/hrs/home/check').then(function(response) {
					this.checkedData = response.data.data;
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

</style>