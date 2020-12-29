<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" class="afFlight-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.flightNumber" auto-complete="off" @input="query.flightNumber=query.flightNumber.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">航班号</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.departureStation" auto-complete="off" @input="query.departureStation=query.departureStation.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">始发港</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.arrivalStation" auto-complete="off" @input="query.arrivalStation=query.arrivalStation.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">目的港</template>
              </el-input>
              <el-checkbox v-model="query.isTrue">是否同城</el-checkbox>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:210px;">
                <template slot="prepend">航班日期</template>
                <el-date-picker slot="suffix" style="width: 140px;margin-right: -5px;" v-model="query.flightDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择航班">
                </el-date-picker>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item style="margin-left: 20px;">
							<el-button type="primary" size="small" @click="queryList">查询</el-button>
							<el-button style="margin-left: 4px;" type="primary" v-on:click="addFlightAndDetail" size="small" v-if="permission.sys_base_flight_add.isShow">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :data="data1" row-key="id" :tree-props="{children: 'flightDetails'}" border>
				<el-table-column align="center" fixed label="操作" width="60" type="index" v-if="operation.isShow">
					<template slot-scope="scope">
						<el-dropdown v-if="scope.row.isSign=='0'" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="permission.sys_base_flight_edit.isShow && scope.row.isSign=='0'">编辑</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="permission.sys_base_flight_del.isShow && scope.row.isSign=='0'">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column prop="flightNumber" fixed label="航班号" width="120"></el-table-column>
				<el-table-column prop="weekNum" fixed label="航次" width="120"></el-table-column>
				<el-table-column prop="departureStation" label="始发港"></el-table-column>
				<el-table-column prop="transitStation" label="中转港"></el-table-column>
				<el-table-column prop="arrivalStation" label="目的港"></el-table-column>
				<el-table-column prop="aircraftTypeRemark" label="机型"></el-table-column>
				<el-table-column prop="aircraftTypePc" label="客机/货机"></el-table-column>
				<el-table-column prop="aircraftTypeBn" label="宽体/窄体"></el-table-column>
				<el-table-column prop="cutoffTime" label="截单时间"></el-table-column>
				<el-table-column prop="takeoffTime" label="起飞时间"></el-table-column>
				<el-table-column prop="arrivalTime" label="到达时间"></el-table-column>

			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<add ref="addMission" v-if="addVisible" :visible.sync="addVisible"></add>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>
<script>
	import add from './flight/af_flight_add.vue'
	import edit from './flight/af_flight_edit.vue'
	export default {
		data() {
			return {
				loading: false,
				data1: [],
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
				addVisible: false,
				editVisible: false,
				frow: {},
				query: {
					flightNumber: '',
					departureStation: '',
					arrivalStation: '',
					isTrue: true,
					flightDate: this.getDateTime()
				},
				permission: {
					sys_base_flight_add: {
						isShow: false
					},
					sys_base_flight_edit: {
						isShow: false
					},
					sys_base_flight_del: {
						isShow: false
					},
				},
        operation: {
            isShow: true
        }
			}
		},
		components: {
			'edit': edit,
			'add': add
		},
		created: function() {
			this.loadPermission(this.permission);
			if (this.permission.sys_base_flight_edit.isShow == false && this.permission.sys_base_flight_del.isShow == false) {
				this.operation.isShow = false
			}
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		methods: {
			addFlightAndDetail() {
				this.addVisible = true;
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'delete') {
					this.handleDelete(this.currRow)
				}
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
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
			handleChange(command) {
				this.currRow = command
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
				if (this.query.flightDate == null) {
					this.query.flightDate = "";
				}
				if (this.query.flightNumber.trim() || this.query.departureStation.trim() || this.query.arrivalStation.trim() || this.query.flightDate.trim()) {
					let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
						"&flightNumber=" + this.query.flightNumber + "&departureStation=" + this.query.departureStation
						//let param ="flightNumber="+this.query.flightNumber+"&departureStation="+this.query.departureStation
						+
						"&arrivalStation=" + this.query.arrivalStation + "&isTrue=" + this.query.isTrue + "&flightDate=" + this.query.flightDate;
					let that = this;
					this.loading = true
					this.$axios.get('/afbase/flight/getFlightListPage?' + param).then(function(response) {
						that.data1 = response.data.data.records;
						that.pageConf.totalPage = response.data.data.total;
						if (that.data1.length == 0) {
							let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
							that.queryList2(current);
						} else {
							that.loading = false
						}
					}).catch(function(error) {
						that.loading = false
						console.log(error);
					});
				} else {
					this.data1 = [];
					this.pageConf.totalPage = 0;
					// this.openError('请输入查询条件');
					this.$message.error('查询失败，请输入查询条件！');
				}

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&flightNumber=" + this.query.flightNumber + "&departureStation=" + this.query.departureStation +
					"&arrivalStation=" + this.query.arrivalStation + "&isTrue=" + this.query.isTrue + "&flightDate=" + this.query.flightDate;
				let that = this;
				this.$axios.get('/afbase/flight/getFlightListPage?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					that.loading = false
				}).catch(function(error) {
					that.loading = false
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
				if (row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}

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
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			}
			//---------------------

		}
	}
</script>
<style type="text/css">

  .afFlight-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afFlight-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afFlight-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
