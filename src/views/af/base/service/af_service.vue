<template>
	<div class="warp-main">
		<div>
			<el-form :inline='true' label-width="80px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="业务范畴">
							<el-select v-model="query.businessScope" placeholder="请选择" @change="getPage" style="width: 80px;">
								<el-option v-for="(item,index) in params" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :indent="30" row-key="serviceId" :tree-props="{children: 'services'}" stripe :data="data1" style="width: 100%;" border>
				<el-table-column header-align="center" label="服务类别" width="320">
					<template slot-scope="scope">
						<span>{{ scope.row.serviceNameCn }}&nbsp;</span>
						<span v-if="scope.row.serviceNameEn!=null&&scope.row.serviceNameEn!=''"><{{ scope.row.serviceNameEn }}></span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="serviceMnemonic" label="助记码">
				</el-table-column>
				<el-table-column align="center" label="默认应收" width="70">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.defaultIncome"></i>
					</template>
				</el-table-column>
				<el-table-column align="left" prop="incomeChargeStandard" label="收费标准" >
				    <template slot-scope="scope">
						<span v-if="scope.row.incomeCurrency!='CNY'" style="color: red;">{{scope.row.incomeCurrency}}</span><span v-else>{{scope.row.incomeCurrency}}</span> {{scope.row.incomeUnitPriceStr}} <span v-if="scope.row.incomeChargeStandard">/</span> {{scope.row.incomeChargeStandard}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="默认应付" width="70">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.defaultCost"></i>
					</template>
				</el-table-column>
				<el-table-column align="left" prop="costChargeStandard" label="付费标准" >
				   <template slot-scope="scope">
				   		<span v-if="scope.row.costCurrency!='CNY'" style="color: red;">{{scope.row.costCurrency}}</span><span v-else>{{scope.row.costCurrency}}</span> {{scope.row.costUnitPriceStr}} <span v-if="scope.row.costChargeStandard">/</span> {{scope.row.costChargeStandard}}
					</template>
				</el-table-column>
				<el-table-column align="left" prop="serviceRemark" label="备注" min-width="200">
				</el-table-column>
				<el-table-column fixed="left" label="操作" align="center" width="50" type="index">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)" v-if="!(!scope.row.parent&&scope.row.isSys)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="permission.sys_base_service_edit.isShow && !scope.row.parent&&!scope.row.isSys">编辑</el-dropdown-item>
                <el-dropdown-item command="delete" v-if="permission.sys_base_service_delete.isShow && !scope.row.parent&&!scope.row.isSys">删除</el-dropdown-item>
								<el-dropdown-item command="save" v-if="permission.sys_base_service_add.isShow && scope.row.parent">新增服务</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>

<script>
	import Save from './af_service_save'
	import Edit from './af_service_edit'
	export default {
		data() {
			return {
				data1: [],
				params: [],
				query: {
					businessScope: ''
				},
				currRow: '',
				saveVisible: false,
				editVisible: false,
				loading: false,
				frow: '',
        permission: {
            sys_base_service_add: {isShow: false},
            sys_base_service_edit: {isShow: false},
            sys_base_service_delete: {isShow: false},
        }
			}
		},
		created() {
			this.init();
			this.loadPermission(this.permission);
		},
		components: {
			'save': Save,
			'edit': Edit
		},
		provide() {
			return {
				getPage: this.getPage
			}
		},
		methods: {
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'save') {
					if(this.query.businessScope == '') {
						this.openError("请选择业务范畴才能操作", "操作")
						return
					}
					this.showsave(this.currRow)
				}else if(command == "delete"){
				  this.deleteService(this.currRow['serviceId']);
        }
			},
      deleteService(id){
        this.$confirm('是否确认删除该服务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios.deletes('/afbase/service/delete/' + id)
            .then(function(response) {
              if(response.data.code == 0) {
                this.openSuccess();
                this.getPage();
              } else {
                this.openError(response.data.messageInfo);
              }
            }.bind(this));
        }).catch((e) => {

        });
      },
			handleChange(command) {
				this.currRow = command
			},
			showsave(row) {
				this.frow = row;
				this.frow.businessScope = this.query.businessScope
				this.saveVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			handleSizeChange(val) {
				this.getPage();
			},
			handleCurrentChange(val) {
				this.getPage();
			},
			getPage() {
				this.loading = true;
				this.$axios.get2('/afbase/service', this.query).then(function(response) {
					if(response.data.code == '0') {
						this.data1 = response.data.data;
					} else {
						this.openError(response.data.messageInfo, "查询");
					}
					this.loading = false
				}.bind(this)).catch(function(error) {
					this.loading = false
					console.log(error);
				});
			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info, flag) {
				this.$notify({
					title: '',
					message: flag + '失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			formatter111(row, column) {
				// if(row.incomeCurrency == 1) {
				// 	return "(收)" + row.serviceName;
				// } else if(row.sstype == 2) {
				// 	return "(付)" + row.serviceName;
				// } else {
					
				// }
				let str='';
				if (row.incomeCurrency) {
					str=str+row.incomeCurrency+" "
				}
				if (row.incomeUnitPrice) {
					str=str+row.incomeUnitPrice+" "
				}
				if (row.incomeChargeStandard) {
					str=str+'/ '+row.incomeChargeStandard
				}
				row.formatter111 = str;
				console.log(row);
				return str;
				
			},
			formatter222(row, column) {
				// if(row.sstype == 1) {
				// 	return "(收)" + row.serviceName;
				// } else if(row.sstype == 2) {
				// 	return "(付)" + row.serviceName;
				// } else {
				// 	return "";
				// }
				let str='';
				if (row.costCurrency) {
					str=str+row.costCurrency
				}
				if (row.costUnitPrice) {
					str=str+row.costUnitPrice
				}
				if (row.costChargeStandard) {
					str=str+'/'+row.costChargeStandard
				}
				return str;
			},
			init() {
				this.$axios.get2('/afbase/service/businessScope' ).then((response) => {
					if(response.data.code == '0'){
						this.params = response.data.data;
						if(this.params && this.params[0]){
                this.query.businessScope = this.params[0].paramText || "";
            }
					} else {
						this.openError(response.data.messageInfo, "查询业务范畴")
					}
				}).catch(function(error) {
					console.log(error);
				}).then(()=>{
				    this.getPage();
        });
/*
				this.$axios.get2('/afbase/service/start').then((response) => {
					if(response.data.code == '0') {
						this.data1 = response.data.data;
					} else {
						this.openError(response.data.messageInfo, "查询")
					}
				}).catch(function(error) {
					console.log(error);
				});
*/
			}
		}
	}
</script>
<style scoped="scoped">

</style>
