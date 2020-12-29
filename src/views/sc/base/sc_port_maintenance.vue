<template>
	<div class="warp-main">
		<div class="sc-port-maintenance">
			<el-form :inline="true" :model="query" class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
						<el-input v-model="query.portCode" @input="query.portCode = query.portCode.toUpperCase()" auto-complete="off" clearable style="width:200px;">
							<template slot="prepend">港口代码</template>
						</el-input>
					</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.portNameCn" @input="query.portNameCn = query.portNameCn.toUpperCase()"  auto-complete="off" clearable style="width:300px;">
								<template slot="prepend">港口名称</template>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.cityCode" @input="query.cityCode = query.cityCode.toUpperCase()" auto-complete="off" clearable style="width:200px;">
                <template slot="prepend">城市</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.countryCode" @input="query.countryCode = query.countryCode.toUpperCase()" auto-complete="off" clearable style="width:200px;">
                <template slot="prepend">国家</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="20px">
              <el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" v-if="permission.sc_port_maintenance_save.isShow">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>
        <el-table-column fixed="left" align="center" label="操作" width="60" v-if="permission.sc_port_maintenance_edit.isShow">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" v-if="permission.sc_port_maintenance_edit.isShow">编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
				<el-table-column prop="portCode" align="left" label="港口代码" width="120"></el-table-column>
				<el-table-column prop="portNameCn" align="left" label="港口中文名称" width="400"></el-table-column>
        <el-table-column prop="portNameEn" align="left" label="港口英文名称" width="300"></el-table-column>
		    <el-table-column prop="cityCode" align="left" label="城市代码" width="120"></el-table-column>
        <el-table-column prop="cityNameCn" align="left" label="城市中文名称" width="300"></el-table-column>
        <el-table-column prop="cityNameEn" align="left" label="城市英文名称" width="200"></el-table-column>
        <el-table-column prop="countryCode" align="left" label="国家代码" width="120"></el-table-column>
        <el-table-column prop="countryNameCn" align="left" label="国家中文名称" width="300"></el-table-column>
        <el-table-column prop="countryNameEn" align="left" label="国家英文名称" width="200"></el-table-column>
        <el-table-column prop="routingName" align="left" label="航线" width="200"></el-table-column>

      </el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    <port-maintenance-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></port-maintenance-save>
    <port-maintenance-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></port-maintenance-edit>
	</div>
</template>
<script>
  import PortMaintenanceSave from './port/maintenance/sc_port_maintenance_save';
  import PortMaintenanceEdit from './port/maintenance/sc_port_maintenance_edit';

	export default {
	  components: {
	    'port-maintenance-save': PortMaintenanceSave,
      'port-maintenance-edit': PortMaintenanceEdit,
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
					portCode: '',
					portNameCn: '',
          cityCode:'',
          countryCode: '',
          routingName: '',
				},
        saveVisible: false,
        editVisible: false,
        permission: {
          sc_port_maintenance_save: {
            isShow: false,
          },
          sc_port_maintenance_edit: {
            isShow: false,
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
			  let queryFlag = false;
        for (let queryKey in this.query) {
          if(this.query[queryKey]){
            queryFlag = true;
            break;
          }
        }
        if(!queryFlag){
          this.openError("查询条件 必须录入一项");
          return;
        }
			  this.loading = true;
				this.$axios.get2("/sc/portMaintenance/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
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
				this.$axios.get2("/sc/portMaintenance/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query).then((response)=> {
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
          this.showedit(this.currRow)
        }
      },
		}
	}
</script>
<style>
  .sc-port-maintenance {
    margin-left: 10px;
  }
  .sc-port-maintenance .el-form-item__content {
		line-height: 30px !important;
	}
  .sc-port-maintenance .el-input-group__prepend{
    width: 66px;
    text-align: center;
    padding: unset;
  }
  .sc-port-maintenance .el-input__icon {
    line-height: 30px !important;
  }

</style>
