<template>
	<div>
		<div style="font-size: 18px;margin-bottom: 35px;">参数编辑</div>
		<el-form ref="form" :model="form" label-width="80px" :inline='true'>
			<el-form-item label="参数类型序号" label-width="108px">
				<el-input style="width: 400px;" v-model="form.categoryId" :disabled='true'></el-input>
			</el-form-item>
			<el-form-item label="参数类型名称" label-width="108px">
				<el-input style="width: 400px;" v-model="form.categoryName" :disabled='true'></el-input>
			</el-form-item>
			<el-form-item label="参数序号" label-width="108px">
				<el-input style="width: 400px;" v-model="form.paramId" :disabled='true'></el-input>
			</el-form-item>
			<el-form-item label="参数名称" label-width="108px">
				<el-input style="width: 400px;" v-model="form.paramName"></el-input>
			</el-form-item>
			<el-form-item label="是否生效" label-width="108px">
				<el-select v-model="form.isVolid" placeholder="请选择状态">
					<el-option label="生效" :value="1"></el-option>
					<el-option label="失效" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<div>
				<el-form-item label="备足" label-width="108px">
					<el-input type="textarea" v-model="form.remark" rows=3 style="width: 925px;"></el-input>
				</el-form-item>
			</div>
			<div style="margin-left: 430px;">
				<el-form-item>
					<el-button type="primary" @click="modifyCategory">立即修改</el-button>
					<router-link to="/prm_category">
						<el-button>返回</el-button>
					</router-link>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				form: {
					categoryName: '',
					categoryId: '',
					paramId: '',
					paramName: '',
					isVolid: '',
					remark: ''
				}
			}
		},
		created() {
			let categoryId = this.$route.query.categoryId
			let paramId = this.$route.query.paramId
			this.$axios.post('/prm/category/findParamCriteria', {
				paramId: paramId,
				categoryId: categoryId
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(response) {
				if(response.status == '200') {
					this.form.categoryName = response.data.categoryName
					this.form.categoryId = response.data.categoryId
					this.form.paramId = response.data.paramId
					this.form.paramName = response.data.paramName
					this.form.isVolid = response.data.isVolid
					this.form.remark = response.data.remark
				}
			}.bind(this)).catch(function(error) {
				console.log(error)
			});
		},
		methods: {
			modifyCategory() {
				this.$axios.post('/prm/category/modifyParam', {
					categoryName: this.form.categoryName,
					categoryId: this.form.categoryId,
					paramId: this.form.paramId,
					paramName: this.form.paramName,
					isVolid: this.form.isVolid,
					remark: this.form.remark
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(response) {
					if(response.status == '200') {
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success'
						});
					}
				}.bind(this)).catch(function(error) {
					this.$notify.error({
						title: '错误',
						message: error.response.data.message
					});
				});
			}
		}
	}
</script>