<template>
	<div>
		<div style="font-size: 18px;margin-bottom: 35px;">参数新建</div>
		<el-form ref="form" :model="form" label-width="80px" :inline='true'>
			<el-form-item label="参数类型序号" label-width="108px">
				<el-input style="width: 400px;" v-model="form.categoryId" :disabled='true'></el-input>
			</el-form-item>
			<el-form-item label="参数类型名称" label-width="108px">
				<el-select v-model="form.categoryId" placeholder="请选择参数类型" @change="changeCategoryName">
					<el-option :label="select.categoryName" :value="select.categoryId" :key="select.categoryId" v-for="select in selectList"></el-option>
				</el-select>
				<el-button type="primary" @click="addCategory">添加参数类型</el-button>
			</el-form-item>
			<el-form-item label="参数类型序号" label-width="108px" v-show="isShow">
				<el-input style="width: 400px;" v-model="selectSingle.categoryId"></el-input>
			</el-form-item>
			<el-form-item label="参数类型名称" label-width="108px" v-show="isShow">
				<el-input style="width: 400px;" v-model="selectSingle.categoryName"></el-input>
				<el-button type="primary" @click="createCategory">新建参数类型</el-button>
			</el-form-item>
			<el-form-item label="参数序号" label-width="108px">
				<el-input style="width: 400px;" v-model="form.paramId"></el-input>
			</el-form-item>
			<el-form-item label="参数名称" label-width="108px">
				<el-input style="width: 400px;" v-model="form.paramName"></el-input>
			</el-form-item>
			<el-form-item label="是否生效" label-width="108px">
				<el-select v-model="form.isVolid" placeholder="请选择状态">
					<el-option label="生效" value="1"></el-option>
					<el-option label="失效" value="0"></el-option>
				</el-select>
			</el-form-item>
			<div>
				<el-form-item label="备足" label-width="108px">
					<el-input type="textarea" v-model="form.remark" rows=3 style="width: 925px;"></el-input>
				</el-form-item>
			</div>
			<div style="margin-left: 430px;">
				<el-form-item>
					<el-button type="primary" @click="createParam">立即创建</el-button>
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
				},
				isShow: false,
				selectSingle: {
					categoryId: "",
					categoryName: ""
				},
				selectList: []
			}
		},
		created() {
			this.$axios.post('/prm/category/findCategoryList').then(function(response) {
				console.log(response)
				this.selectList = response.data
			}.bind(this)).catch(function(error) {
				console.log(error)
			});
		},
		methods: {
			createCategory() {
				var categoryId = this.selectSingle.categoryId
				var categoryName = this.selectSingle.categoryName
				this.selectSingle = {
					categoryId: "",
					categoryName: ""
				}
				if(categoryId.trim() == '' || categoryName.trim() == '') {
					this.$notify.error({
						title: '错误',
						message: '参数类型信息不能为空'
					});
					this.isShow = false
					return
				}

				for(var i = 0; i < this.selectList.length; i++) {
					if(this.selectList[i].categoryId == categoryId) {
						this.$notify.error({
							title: '错误',
							message: '参数类型序号不能重复'
						});
						this.isShow = false
						return
					}
				}
				this.selectList.push({
					categoryId: categoryId,
					categoryName: categoryName
				})

				this.isShow = false
			},
			createParam() {
				this.$axios.post('/prm/category/createParam', this.$qs.stringify({
					categoryName: this.form.categoryName,
					categoryId: this.form.categoryId,
					paramId: this.form.paramId,
					paramName: this.form.paramName,
					isVolid: this.form.isVolid,
					remark: this.form.remark
				}), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then((response) => {
					console.log(response)
					if(response.status == '200') {
						this.$notify({
							title: '成功',
							message: '创建成功     2s后跳转列表页面...',
							type: 'success'
						});
						setTimeout(() => {
							this.$router.push({
								path: "/prm_category"
							})
						}, 2000);
					}
				}).catch((error) => {
					this.$notify.error({
						title: '错误',
						message: error.response.data.message
					});
				});
			},
			addCategory() {
				this.isShow = true
			},
			changeCategoryName() {
				for(var i = 0; i < this.selectList.length; i++) {
					if(this.selectList[i].categoryId == this.form.categoryId) {
						this.form.categoryName = this.selectList[i].categoryName
						break
					}
				}
			}
		}
	}
</script>
