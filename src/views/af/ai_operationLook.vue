<template>
	<div class="warp-main">
		<div class="aircraftListPage">
			<el-form :inline="false" :model="query" label-width="20px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.awbNumber" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">运单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.departureStation" auto-complete="off" clearable style="width:152px;" @input="query.departureStation=query.departureStation.toUpperCase()">
								<template slot="prepend">始发港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.arrivalStation" auto-complete="off" clearable style="width:152px;" @input="query.arrivalStation=query.arrivalStation.toUpperCase()">
								<template slot="prepend">目的港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">到港日期</template>
								<el-date-picker slot="suffix" v-model="query.startdate" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.enddate" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.orderCode" auto-complete="off" clearable style="width:210px;" @input="query.orderCode=query.orderCode.toUpperCase()">
								<template slot="prepend">订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-button type="primary" size="small" @click="checkQueryList">查询</el-button>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :data="data" stripe border>
				<!-- <el-table-column type="selection" align="center" width="60" fixed> </el-table-column>
				@selection-change="handleSelectionChange" -->
        		
			    <!--<el-table-column label="操作" align="center" fixed width="45">->
					<!-<template slot-scope="scope" v-if="scope.row.syscode!=''||scope.row.hwbnumber==''">
					<template slot-scope="scope" >
						<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="add" v-if="scope.row.hwbnumber==''">新增分单</el-dropdown-item>
								<el-dropdown-item command="edit" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare!='1' && scope.row.istallydeclare!='1'">修改分单</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare!='1' && scope.row.istallydeclare!='1'">删除分单</el-dropdown-item>
								<el-dropdown-item command="declare1" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare!='1'">申报原始</el-dropdown-item>
								<el-dropdown-item command="declare2" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare=='1' && scope.row.istallydeclare!='1'">申报理货</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
			   	</el-table-column>-->
				<!-- header-align="center" -->
				<el-table-column prop="orderCode" label="订单号"  width="120" align="center"></el-table-column>
				<el-table-column prop="mawbCode" label="主单号"  width="120" align="center"></el-table-column>
				<el-table-column prop="hawbCode" label="分单号"  width="120" align="center"></el-table-column>
				<el-table-column prop="pieces" label="件数"  width="120" align="center"></el-table-column>
				<el-table-column prop="weight" label="重量" width="100" align="center"></el-table-column>
				<el-table-column prop="volume" label="体积" width="100" align="center"></el-table-column>
				<el-table-column prop="departure" label="始发港" width="90" align="center"></el-table-column>
				<el-table-column prop="destination" label="目的港" width="90" align="center"></el-table-column>
				<el-table-column prop="goodEname" label="英文品名"  width="260" align="center" ></el-table-column>
				<el-table-column prop="mft1201Status" label="原始状态" width="90" align="center"></el-table-column>
				<el-table-column prop="mft5201Status" label="理货状态" width="90" align="center"></el-table-column>
				<el-table-column prop="mft6202Recv" label="分拨申请" width="90" align="center"></el-table-column>
				<el-table-column prop="mft3202Status" label="分拨运抵" width="90" align="center"></el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<saveOperationLookSingle ref="addMission" v-if="saveOperationLookSingle" :visible.sync="saveOperationLookSingle" :frow="frow"></saveOperationLookSingle>
	</div>
</template>
<script>
import saveOperationLookSingle from './ai_operation_look/ai_operation_look_single_save'
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
				loading: false,
				bbccFlag:false,
				saveOperationLookSingle:false,
				data: [],
				multipleSelection: [],
        		currRow: '',
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
					startdate: '',
					enddate: '',
					arrivalStation: '',
					departureStation: '',
					awbNumber: ''
				},

			}
		},
    components: {
    	'saveOperationLookSingle': saveOperationLookSingle,
    },
    provide() {
    	return {
    		queryList: this.queryList
    	}
    },
	created: function() {
      
    },
		methods: {
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'add') {
					this.showsave(this.currRow)
				} else if (command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				}else if(command == 'declare1') {
					this.doDeclare(this.currRow,"MT1201")
				}else if(command == 'declare2') {
					this.doDeclare(this.currRow,"MT5201")
				}
			},
			showsave(rrow) {
				this.frow=rrow;
				this.saveOperationLookSingle = true;
				
			},
			showedit(rrow) {
				this.frow=rrow;
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
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			showAuditPage(row){
				this.frow=row;
				this.manual=true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			doDelete(rrow) {
				this.$confirm('此操作将删除分单, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
					}).then(() => {

						this.$axios.post2("/afbase/fhl/doDelete", rrow)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList();
								} else {
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.openError(response.data.messageInfo || "");
							}.bind(this))
		            	
		            }).catch(() => {});
			},
			doDeclare(rrow,messageType) {
				this.$confirm('此操作将申报分单, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
					}).then(() => {
						rrow.messageType=messageType;
						this.$axios.post2("/afbase/fhl/doDeclare", rrow)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList();
								} else {
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.openError(response.data.messageInfo || "");
							}.bind(this))
		            	
		            }).catch(() => {});
			},
			queryList() {
				let params={
                  'current': this.pageConf.pageCode,
                  'size': this.pageConf.pageSize,
                  'flightDateBegin':this.query.startdate,
                  'flightDateEnd':this.query.enddate,
                  'departureStation':this.query.departureStation,
                  'arrivalStation':this.query.arrivalStation,
				  'awbNumber':this.query.awbNumber,
				  'orderCode':this.query.orderCode
                }
                this.$axios.post('/afbase/aiOperationLook/queryLookList',params)
                .then(function(response) {
                	if (response.data.code == 1) {
                      this.openError(response.data.messageInfo)
                      return
					}
                    this.data=response.data.data.records;
                    this.pageConf.totalPage=response.data.data.total;
                 }.bind(this)
                );

			},
			queryList2(current) {
				this.$axios.get2('/afbase/bgsDatacollection/collectPage?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
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
			checkQueryList(){
				this.pageConf.pageCode=1;
				this.queryList();
			},
			formatter_awbnumber(row, column) {
				if (row.awbnumber) {
     				return row.awbnumber.substring(0,3)+'-'+row.awbnumber.substring(3);
				}
			},
			formatter_Status(row, column) {
				if (1==row.isediawb) {
     				return "是";
				}else{
					return "否";
				}
			},
			formatter_dataStatus(row, column) {
		        if (0===row.dataStatus) {
     				return "";
				} else if(1===row.dataStatus){
					return "待核查";
				}else if(10===row.dataStatus){
					return "核查通过";
				}else if(-10===row.dataStatus){
					return "核查不通过";
				}else if(20===row.dataStatus){
					return "完成出重";
				}else if(-20===row.dataStatus){
					return "出重异常";
				}else if(30===row.dataStatus){
					return "完成收单";
				}else {
					return "收单异常";
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
			getDateTime2() {
				let theDate = new Date()
				theDate.setDate(theDate.getDate()+1);
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
