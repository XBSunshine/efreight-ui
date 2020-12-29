<template>
	<div class="warp-main">
		<div class="aircraftListPage">
			<el-form :inline="true" :model="query" class="demo-ruleForm" label-width="20px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.aircraftType" auto-complete="off" clearable style="width:150px;margin-left: 20px;">
								<template slot="prepend">机型</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:180px;">
								<template slot="prepend">宽体/窄体</template>
								<el-select slot="suffix" clearable v-model="query.aircraftTypePc" filterable placeholder="请选择" style="width:107px;margin-right: -5px;">
									<el-option label="宽体" value="宽体"></el-option>
									<el-option label="窄体" value="窄体"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-button type="primary" size="small" @click="queryList">查询</el-button>
              <el-button type="primary" size="small" v-if="this.permission.sys_base_aircraft_add.isShow" @click="addAirCraft">新增</el-button>
							<!-- <el-button style="margin-left: 4px;" type="primary" v-on:click="addFlightAndDetail" size="small" v-if="permission.sys_base_flight_add.isShow">新增</el-button> -->
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :data="data" stripe border>
        <el-table-column v-if="this.permission.sys_base_aircraft_edit.isShow" label="操作" align="center" fixed width="45">
        	<template slot-scope="scope">
            <el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" >编辑</el-dropdown-item>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
				<el-table-column prop="aircraftType" label="飞机类型"  width="80" align="center"></el-table-column>
				<el-table-column prop="aircraftTypeNameEn" label="飞机类型英文名称" header-align="center" width="300"></el-table-column>
				<el-table-column prop="powerType" label="动力类型" width="120" align="center"></el-table-column>
				<el-table-column prop="aircraftTypePc" label="宽体/窄体" width="120" align="center"></el-table-column>
				<el-table-column prop="fullLoadRangeMiles" label="满载航距（英里）" width="150" align="center"></el-table-column>
				<el-table-column prop="cruiseSpeedMiles" label="巡航速率（英里）" width="150" align="center"></el-table-column>
				<el-table-column></el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    <saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="fRow"></saveVisibleTag>
    <editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :fRow="fRow"></editVisibleTag>
	</div>
</template>
<script>

  import saveVisibleTag from './aircraft/af_aircraft_save.vue'
  import editVisibleTag from './aircraft/af_aircraft_edit'

	export default {
		data() {
			return {
				loading: false,
        saveVisible: false,
        editVisible: false,
				data: [],
        fRow: {},
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
				query: {
					aircraftType: '',
					aircraftTypePc: ''
				},
        permission: {
        	sys_base_aircraft_add: {
        		isShow: false
        	},
        	sys_base_aircraft_edit: {
        		isShow: false
        	},
        }
			}
		},
    components: {
    	'saveVisibleTag': saveVisibleTag,
    	'editVisibleTag': editVisibleTag
    },
    provide() {
    	return {
    		queryList: this.queryList
    	}
    },
		created: function() {
      this.loadPermission(this.permission);
    },
		methods: {

      addAirCraft(){
        this.saveVisible = true;
      },
			handleCommand(command) {
				if (command == 'edit') {
					this.editVisible = true;
				} else if (command == 'delete') {
					this.handleDelete(this.currRow)
				}
			},
      handleChange(row) {
      	this.fRow = row;
      },
			handleDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/flight/' + row.flightId)
						.then(function(response) {
							if (response.data.code == 0) {
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
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
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
			queryList() {
				this.loading = true
				this.$axios.get2('/afbase/aircraft?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					if (response.data.code == 0) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if (this.data.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.queryList2(current);
						} else {
							this.loading = false
						}
					} else {
						this.loading = false
						this.openError(response.data.messageInfo)
					}

				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
					this.loading = false
					console.log(error);
				});

			},
			queryList2(current) {
				this.$axios.get2('/afbase/aircraft?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					that.data = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
					this.loading = false
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

			getDateTime() {
				let theDate = new Date()
				var _year = theDate.getFullYear()
				var _month = theDate.getMonth()
				_month++
				var _date = theDate.getDate()
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date
			}
			//---------------------

		}
	}
</script>
<style>
	.aircraftListPage .el-input__icon {
		line-height: 30px !important;
	}

	.aircraftListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.aircraftListPage .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
