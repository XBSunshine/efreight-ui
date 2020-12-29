<template>
	<el-dialog title="版本管理 - 版本更新记录 - 编辑" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-row>
			<el-form :model="form" ref="form" class="demo-ruleForm version-record-edit">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item  prop="versionId" :rules="[{required: true,message: '请录入版本号',trigger: ['blur', 'change']}]" label-width="10px">
              <el-input v-model="form.versionId" disabled style="width: 250px;">
                <template slot="prepend"><span style="color:red">*</span>版本号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item :rules="[{required: true,message: '请选择更新记录类型',trigger: ['blur', 'change']}]" label-width="10px">
              <el-input style="width: 280px">
                <template slot="prepend"><span style="color:red">*</span>更新记录类型</template>
                <el-select slot="suffix" v-model="form.updateType" filterable placeholder="请选择" style="width: 148px; margin-right: -5px">
                  <el-option v-for="item in updateTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item prop="permissionId" :rules="[{required: true,message: '请选择权限',trigger: ['blur', 'change']}]" label-width="10px">
              <el-input style="width: 250px">
                <template slot="prepend"><span style="color:red">*</span>权限</template>
                <el-select slot="suffix" v-model="form.permissionId" filterable placeholder="请选择" style="width: 145px; margin-right: -5px">
                  <el-option v-for="item in permissions" :key="item.permissionId" :label="item.permissionName" :value="item.permissionId">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label="更新记录内容" prop="updateText" :rules="[{required: true,message: '请录入更新记录内容',trigger: ['blur', 'change']}]" label-width="115px">
              <el-input type="textarea" placeholder="请输入内容" v-model="form.updateText" maxlength="100" show-word-limit style="width: 437px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 15px;">
              <el-button size="small" type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
		</el-row>
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
				form: {
					recordId: '',
					versionId: '',
					updateType: '',
					permissionId: '',
					updateText: ''
				},
				updateTypes: [{
					label: "新增",
					value: "新增"
				}, {
					label: "需求变更",
					value: "需求变更"
				}, {
					label: "BUG",
					value: "BUG"
				}, {
					label: "性能优化",
					value: "性能优化"
				}],
				permissions: [{
					permission_id: 1,
					permission_name: '用户新建'
				}]
			};
		},
		created() {
			this.findPermissionList()
			this.form.versionId = this.frow.versionId
			this.form.recordId = this.frow.recordId
		},
		mounted() {
			this.$axios.get('/hrs/version/child/' + this.form.recordId)
				.then(function(response) {
					if(response.data.code == 0) {
						this.form.updateType = response.data.data.updateType
						this.form.permissionId = response.data.data.permissionId
						this.form.updateText = response.data.data.updateText
					}
				}.bind(this));
		},
		inject: ['findByPage'],
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
			submitForm() {
				if(this.form.versionId == '') {
					this.openError("版本号不能为空")
				} else if(this.form.updateType == '') {
					this.openError("更新记录类型不能为空")
				} else if(this.form.permissionId == '') {
					this.openError("权限不能为空")
				} else if(this.form.updateText == '') {
					this.openError("更新记录内容不能为空")
				} else {
					this.$axios.put('/hrs/version/child', this.form)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
								this.handleClose();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.message;
							this.openError(errorinfo);
						}.bind(this));
				}
			}, // 关闭
			findPermissionList() {
				this.$axios.get('/hrs/permission/permissionList')
					.then(function(response) {
						if(response.data.code == 0) {
							this.permissions = response.data.data;
						}
					}.bind(this));
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
  .version-record-edit .el-input-group__prepend{
    width: 105px;
    text-align: center;
  }
  .version-record-edit .el-input__icon{
    line-height: 30px !important;
  }
</style>
