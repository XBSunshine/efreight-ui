<template>
	<div class="warp-main">
		<div class="orderListPage3" style="margin-left: 10px">
			<el-form :inline="true" :model="query" class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
						<el-input v-model="query.shipName" auto-complete="off" clearable style="width:210px;">
							<template slot="prepend">船名</template>
						</el-input>
					</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
						<el-input style="width:190px;">
							<template slot="prepend">是否有效</template>
							<el-select slot="suffix" v-model="query.isValidStr" clearable placeholder="" style="width:98px;margin-right: -5px;">
								<el-option label="是" value="1">
								</el-option>
								<el-option label="否" value="0">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" v-if="addButtonFlag">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>
				<el-table-column prop="shipNameEn" align="center" label="船名(英文)" width="500"></el-table-column>
				<el-table-column prop="shipNameCn" align="center" label="船名(中文)" width="500"></el-table-column>
				<el-table-column prop="isValid" align="center" label="是否有效" width="120">
				<template slot-scope="scope">
                    <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isValid"></i>
                </template>
				</el-table-column>
				<el-table-column fixed="left" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<page-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow">
		</page-save>
		<page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow">
		</page-edit>
	</div>
</template>
<script>
	import save from './scOrderShipInfo/sc_order_ship_info_save'
	import edit from './scOrderShipInfo/sc_order_ship_info_edit'
	export default {
		data() {
			return {
				loading: false,
				addButtonFlag:true,
				data1: [],
				options: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				saveVisible: false,
				editVisible: false,
				frow: {},
				query: {
					shipName: '',
					isValidStr: ''
				},
				permission: {
					sys_base_warehouse_add: {
						isShow: false
					},
					sys_base_warehouse_edit: {
						isShow: false
					},
				}
			}
		},
		created: function() {
			this.loadPermission(this.permission);
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
			'page-save': save,
			'page-edit': edit
		},
		methods: {
			handleCommand(command) {
				if("edit" == command) {
					this.showedit(this.frow)
				}else if("delete" == command){
				    this.delete(this.currRow);
				}
			},
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
			handleChange(row) {
				this.frow = row;
				this.currRow = row;
			},
			showsave() {
				this.saveVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			queryList() {
			    this.loading = true;
				this.$axios.get2("/sc/orderShipInfo/pageList?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if(this.data1.length == 0) {
						let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						that.queryList2(current);
					}else{
				     	this.loading = false;
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			queryList2(current) {
				this.$axios.get2("/sc/orderShipInfo/pageList?size=" + this.pageConf.pageSize + "&current=" + current, this.query).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
					console.log(error);
				});
			},
			delete(row){
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.$axios.put('/sc/orderShipInfo/delete/' + row.shipInfoId)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList2(1);
								} else {
									this.openError(response.data.messageInfo);
								}
							}.bind(this));
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			}
		}
	}
</script>
<style>
.orderListPage3 .el-form-item__content {
		line-height: 30px !important;
	}

</style>
