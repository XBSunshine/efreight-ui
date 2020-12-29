<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" class="afWarehouse-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:165px;">
                <template slot="prepend">业务范畴</template>
                <el-select slot="suffix" v-model="query.businessScope" filterable placeholder="请选择" style="width:96px;margin-right: -5px;">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.apCode" auto-complete="off" @input="query.apCode=query.apCode.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">机场代码</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.warehouseNameCn" auto-complete="off" @input="query.warehouseNameCn=query.warehouseNameCn.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">货站</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item style="margin-left: 20px;">
							<el-button type="primary" size="small" @click="queryList">查询</el-button>
							<el-button style="margin-left: 4px;" type="primary" size="small" v-on:click="showsave" v-show="permission.sys_base_warehouse_add.isShow">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>
				<el-table-column prop="businessScope" align="center" label="业务范畴" width="80"></el-table-column>
				<el-table-column prop="apCode" align="center" label="机场代码" width="80"></el-table-column>
				<el-table-column prop="warehouseCode" align="center" label="货站代码" width="120"></el-table-column>
				<el-table-column prop="warehouseNameCn" align="left" label="货站名称" width="300" header-align="center"></el-table-column>
				<el-table-column prop="customsSupervision" align="center" label="监管等级" width="120"></el-table-column>
				<el-table-column prop="customsCode" align="center" label="海关编码" width="200"></el-table-column>
        <el-table-column prop="shipperTemplateName" align="center" label="交货托书模板" width="200"></el-table-column>
				<el-table-column fixed="left" align="center" label="操作" width="60" >
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="permission.sys_base_warehouse_edit.isShow">编辑</el-dropdown-item>
                <el-dropdown-item command="delete" v-if="permission.sys_base_warehouse_delete.isShow">删除</el-dropdown-item>
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
	import save from './warehouse/af_warehouse_save'
	import edit from './warehouse/af_warehouse_edit'
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
					pageOption: [10, 50, 100], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				fileList: [],
				saveVisible: false,
				editVisible: false,
				frow: {},
				query: {
					businessScope: 'AE',
					apCode: '',
					warehouseCode: '',
					warehouseNameCn: ''
				},
				permission: {
					sys_base_warehouse_add: { isShow: false },
					sys_base_warehouse_edit: { isShow: false },
          sys_base_warehouse_delete: { isShow: false },
				}
			}
		},
		created: function() {
			this.$axios.get('/afbase/awb/selectCategory?category=业务范畴').then(function(response) {
				this.options = response.data.data;
				if(this.options && this.options[0]) {
					this.query.businessScope = this.options[0].value || "";
				}
			}.bind(this));
			this.loadPermission(this.permission);

      this.queryList();
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
				  this.deleteWarehouse(this.frow);
        }
			},
			handleChange(row) {
				this.frow = row;
			},
			showsave() {
				if(this.query.businessScope.trim() == '') {
					this.openError("请选择业务范畴")
					return
				}
				this.frow.businessScope = this.query.businessScope;
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
      openSuccess(info) {
        this.$notify({
          title: '',
          message: '操作成功',
          type: 'success',
          position: 'bottom-right'
        });
      },
			queryList() {
				if(this.query.businessScope.trim() == '') {
					this.openError("请选择业务范畴", "查询")
					return
				}
				// if (this.query.apCode.trim()||this.query.warehouseCode.trim()||this.query.warehouseNameCn.trim()) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&apCode=" + this.query.apCode + "&businessScope=" + this.query.businessScope +
					"&warehouseCode=" + this.query.warehouseCode + "&warehouseNameCn=" + this.query.warehouseNameCn;
				let that = this;
				this.$axios.get('/afbase/warehouse/page?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					if(that.data1.length == 0) {
						let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
						that.queryList2(current);
					}
				}).catch(function(error) {
					console.log(error);
				});
				// } else{
				//   this.data1 =[];
				//   this.pageConf.totalPage=0;
				//    this.$message.error('查询失败，请输入查询条件！');
				// }

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&apCode=" + this.query.apCode + "&businessScope=" + this.query.businessScope +
					"&warehouseCode=" + this.query.warehouseCode + "&warehouseNameCn=" + this.query.warehouseNameCn;
				let that = this;
				this.$axios.get('/afbase/warehouse/page?' + param).then(function(response) {
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
			},
      deleteWarehouse(row){
        this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios.deletes('/afbase/warehouse/' + row.warehouseId)
            .then(function(response) {
              if(response.data.code == 0) {
                this.openSuccess();
                this.queryList();
              } else {
                this.openError(response.data.messageInfo || "未知错误");
              }
            }.bind(this));
        }).catch(() => {
        });
      }
		}
	}
</script>

<style type="text/css">

  .afWarehouse-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afWarehouse-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afWarehouse-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
