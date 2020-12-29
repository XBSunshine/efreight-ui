<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="10px" class="baseTruckQueryArea">
			<div ref="lc_base_truck_query_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.truckNumber" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">车牌号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.driverName" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">司机姓名</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.length" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">车长</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.ton" auto-complete="off" clearable style="width:200px;">
								<template slot="prepend">吨位</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 4px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showSave" v-show="permission.sys_base_truck_add.isShow">新增</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="exportData" v-show="permission.sys_base_truck_export.isShow">导出</el-button>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" :data="data" border>
			<el-table-column label="操作" align="center" fixed width="60">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="edit" v-show="permission.sys_base_truck_edit.isShow">修改</el-dropdown-item>
							<el-dropdown-item command="delete" v-show="permission.sys_base_truck_delete.isShow">删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<template v-for="(item, index) in columns.columns">
				<el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter">
				</el-table-column>
			</template>
		</el-table>
		<div class="pagination" ref="vl_order_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>
<style>
	.baseTruckQueryArea .el-input__icon {
		line-height: 30px !important;
	}
</style>
<script>
	import columns from './lc_base_truck_column.json'
	import save from './lc_base_truck_save'
	import edit from './lc_base_truck_edit'

	export default {
		data() {
			return {
				query: {
					truckNumber: '',
					driverName: '',
					length: '',
					ton: '',
				},
				loading: false,
				data: [],
				columns: columns,
				pageConf: {
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50] //分页选项
				},
				currRow: Object,
				saveVisible: false,
				editVisible: false,
				frow: Object,
				permission: {
					sys_base_truck_add: {
						isShow: false
					},
					sys_base_truck_edit: {
						isShow: false
					},
					sys_base_truck_delete: {
						isShow: false
					},
					sys_base_truck_export: {
						isShow: false
					},
				}
			}
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		components: {
			'save': save,
			'edit': edit,
		},
		methods: {
			findByPage() {
				this.loading = true
				this.$axios.get2("/sc/lcTruck/listPage?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then((response) => {
						this.loading = false
						if (response.data.code == 0) {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
						} else {
							this.openError(response.data.messageInfo || "查询失败");
						}
					}).catch((error) => {
						this.loading = false
						this.openError(error.response.data.messageInfo || "查询失败")
					})

			},
			showSave() {
				this.saveVisible = true;
			},
			showEdit(row) {
				console.log(row);
				this.editVisible = true;
				this.frow = row;
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showEdit(this.currRow)
				} else if (command == 'delete') {
					this.deleteData(this.currRow);
				}
			},
			handleChange(row) {
				this.currRow = row;
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			},
			deleteData(row) {
				let id = row.truckId;
				if (!id) {
					this.openError("删除失败!未获取到数据!");
					return;
				}
				this.$confirm('是否确认删除车辆?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/sc/lcTruck/' + id)
						.then(function(response) {
							if (response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
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
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			exportData() {
				this.$axios.post3('/sc/lcTruck/export', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '陆运车辆信息' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			formatter(row, column) {
				if (column.property == "operator") {
					return row[column.property].split(" ")[0]
				} else {
					return row[column.property]
				}
			}
		},
		created() {
			this.loadPermission(this.permission);
		}
	}
</script>
