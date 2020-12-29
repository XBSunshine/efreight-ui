<template>
	<div class="warp-main">
		<div class="orderListPage3" style="margin-left: 10px">
			<el-form :inline="true" :model="query" class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
						<el-input v-model="query.shipCompanyCode" @input="query.shipCompanyCode = query.shipCompanyCode.toUpperCase()" auto-complete="off" clearable style="width:300px;">
							<template slot="prepend">船司代码</template>
						</el-input>
					</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.shipCompanyNameCn" auto-complete="off" clearable style="width:500px;">
								<template slot="prepend">船司名称</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							 <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" @click="showsave" v-if="permission.sc_ship_company_save.isShow">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>
        <el-table-column fixed="left" align="center" label="操作" width="60" v-if="permission.sc_ship_company_edit.isShow">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" v-if="permission.sc_ship_company_edit.isShow">编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
				<el-table-column prop="shipCompanyCode" align="left" label="船司代码" width="260"></el-table-column>
				<el-table-column prop="shipCompanyNameCn" align="left" label="船司中文名称" width="500"></el-table-column>
		    <el-table-column prop="shipCompanyNameEn" align="left" label="船司英文名称" width="500"></el-table-column>
      </el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    <ship-company-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"> </ship-company-save>
    <ship-company-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"> </ship-company-edit>
	</div>
</template>
<script>
  import ShipCompanySave from './ship/company/sc_ship_company_save'
  import ShipCompanyEdit from './ship/company/sc_ship_company_edit'

	export default {
    components: {
      'ship-company-save': ShipCompanySave,
      'ship-company-edit': ShipCompanyEdit
    },
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
					pageOption: [10, 50, 100], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				frow: {},
				query: {
					shipCompanyCode: '',
					shipCompanyNameCn: ''
				},
        saveVisible: false,
        editVisible: false,
        permission: {
          sc_ship_company_save: {
            isShow: false
          },
          sc_ship_company_edit: {
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
			queryList() {
			    this.loading = true;
				this.$axios.get2("/sc/shipCompany?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
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
				this.$axios.get2("/sc/shipCompany?size=" + this.pageConf.pageSize + "&current=" + current, this.query).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
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
      handleCommand(command) {
        if("edit" == command) {
          this.showEdit(this.currRow)
        }
      },
      showEdit(row){
			  this.frow = row;
			  this.editVisible = true;
      }
		}
	}
</script>
<style>
.orderListPage3 .el-form-item__content {
		line-height: 30px !important;
	}

</style>
