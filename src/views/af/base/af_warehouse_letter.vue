<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" label-width="80px" class="afWarehouseLetter-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.apCode" auto-complete="off" @input="query.apCode=query.apCode.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">机场代码</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.shipperTemplateName" auto-complete="off" style="width: 260px;" clearable>
                <template slot="prepend">托书名称</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:160px;">
                <template slot="prepend">是否有效</template>
                <el-select slot="suffix" v-model="query.isValid" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" size="small" @click="queryList">查询</el-button>
							<el-button style="margin-left: 4px;" type="primary" size="small" v-on:click="showsave">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>

				<el-table-column prop="apCode" align="center" label="机场代码" width="80"></el-table-column>
				<el-table-column prop="shipperTemplateName" label="托书名称" width="280"></el-table-column>
				<el-table-column align="center" label="是否有效" width="80">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isValid"></i>
					</template>
				</el-table-column>
				<el-table-column prop="showName" label="模板名称" width="280"></el-table-column>

				<el-table-column fixed="left" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
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
	import save from './warehouseletter/af_warehouse_letter_save'
	import edit from './warehouseletter/af_warehouse_letter_edit'
	export default {
		data() {
			return {
				loading: false,
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
				fileList: [],
				saveVisible: false,
				editVisible: false,
				frow: {},
				query: {
					apCode: '',
					shipperTemplateName: '',
					isValid: 1
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
					this.showedit()
				}
			},
			handleChange(row) {
				this.frow = row;
			},
			showsave() {
				this.saveVisible = true;
			},
			showedit() {
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
				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&apCode=" + this.query.apCode + "&shipperTemplateName=" + this.query.shipperTemplateName + "&isValid=" + this.query.isValid;
				let that = this;
				this.$axios.get('/afbase/warehouseLetter/page?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					if(that.data1.length == 0) {
						let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
						that.queryList2(current);
					}
				}).catch(function(error) {
					console.log(error);
				});

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&apCode=" + this.query.apCode + "&shipperTemplateName=" + this.query.shipperTemplateName + "&isValid=" + this.query.isValid;
				let that = this;
				this.$axios.get('/afbase/warehouseLetter/page?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
					console.log(error);
				});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},

			formatStatus(row, column) {
				return row.apStatus == true ? "生效" : row.apStatus == false ? "失效" : "";
			},
			formatStatus2(row, column) {
				if(row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}

			}

		}
	}
</script>
<style type="text/css">

  .afWarehouseLetter-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afWarehouseLetter-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afWarehouseLetter-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
