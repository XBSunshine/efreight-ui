<template>
	<el-dialog title="新建下级客商资料" width="54%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<div>
			<el-table :data="data1" style="width: 100%;margin-bottom: 20px;" row-key="coop_id" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="操作" width="60" type="index">
          <template slot-scope="scope">
            <el-button @click="move(scope.row)" type="text" size="small" v-show="scope.row.group_type=='group'">移动</el-button>
          </template>
        </el-table-column>
				<el-table-column type="selection" width="60"></el-table-column>
				<el-table-column prop="coop_code" label="客商资料代码" sortable width="400"></el-table-column>
				<el-table-column prop="coop_type" label="客商资料类型" width="120"></el-table-column>
				<el-table-column prop="coop_name" label="客商资料名称" width="250"></el-table-column>
				<el-table-column prop="social_credit_code" label="社会信用代码" width="120"></el-table-column>
			</el-table>
		</div>
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
				data1: []
			};
		},
		created: function() {
			this.queryCoopTree();
		},
		inject: ['queryCoopList'],
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
			queryCoopTree() {

				let params = {
					black_valid: '0',
					coop_status: '1'
				}
				this.$axios.post('/prm/coop/queryCoopTree', params).then((response) => {
					this.data1 = response.data.data;
				}).catch(err => {
					// console.log(err)
				})

			},
			move(row) {
				let params = {
					subCoopCode: row.coop_code + '',
					coopCode: this.frow.coop_code + ''
				}
				this.$axios.post('/prm/coop/move',
						params)
					.then(function(response) {
						if(response.data.code == 200) {
							this.openSuccess();
							this.queryCoopList();
							this.handleClose();
						} else {
							let errorinfo = response.data.messageInfo;
							//唯一性错误
							if(errorinfo.indexOf('Duplicate entry') > -1) {
								if(errorinfo.indexOf('IDU_prm_coop_code') > -1)
									this.openError('客商资料代码不可重复');
								else if(errorinfo.indexOf('IDU_prm_coop_name') > -1)
									this.openError('客商资料中文名称不可重复');
								else if(errorinfo.indexOf('IDU_prm_short_name') > -1)
									this.openError('客商资料中文简称不可重复');
								else if(errorinfo.indexOf('IDU_prm_coop_ename') > -1)
									this.openError('客商资料英文全称不可重复');
								else if(errorinfo.indexOf('IDU_prm_short_ename') > -1)
									this.openError('客商资料英文简称不可重复');
								else if(errorinfo.indexOf('IDU_prm_social_credit_code') > -1)
									this.openError('客商资料社会信用代码不可重复');
								else
									this.openError(errorinfo);
							} else {
								this.openError(errorinfo);
							}
						}

					}.bind(this)).catch(function(error) {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							this.openError(error.response.data.messageInfo);
						}
					}.bind(this));
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
