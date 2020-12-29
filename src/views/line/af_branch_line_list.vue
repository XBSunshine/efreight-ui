<template>
	<div class="warp-main">
		<div class="aircraftListPage">
			<el-form :inline="false" :model="query" label-width="20px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-input v-model="query.awbnumber" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">主单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-input v-model="query.hwbnumber" auto-complete="off" clearable style="width:210px;" @input="query.hwbnumber = query.hwbnumber.toUpperCase()">
								<template slot="prepend">分单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">开始日期</template>
								<el-date-picker slot="suffix" v-model="query.begindate" clearable type="date" value-format="yyyy-MM-dd"
								 placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.enddate" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束"
							 style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-button type="primary" size="small" @click="queryList">查询</el-button>
							<el-button type="primary" size="small" @click="doMerge" :loading="loading2">合并</el-button>
          					
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :data="data" stripe border @selection-change="handleSelectionChange">
				<el-table-column type="selection" align="center" width="45" fixed> </el-table-column>
				
        		<!-- header-align="center" -->
			    <el-table-column label="操作" align="center" fixed width="45">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="split">支线拆分</el-dropdown-item>
							<el-dropdown-item command="reset">支线重置</el-dropdown-item>
							
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			   </el-table-column>
			   <el-table-column prop="awbnumber" label="主单号"  width="110" align="center"></el-table-column>
				<el-table-column prop="hwbnumber" label="分单号"  width="110" align="center"></el-table-column>
				<el-table-column prop="rearchid" label="运抵编码"  width="160" align="center"></el-table-column>
				<el-table-column prop="flightdate" label="航班日期" width="90" align="center"></el-table-column>
				<el-table-column prop="flightno" label="航班号"  width="90" align="center"></el-table-column>

				<el-table-column prop="totalpiecequantity" label="件数" width="80" align="center"></el-table-column>
				<el-table-column prop="totalgrossweight" label="重量" width="100" align="center"></el-table-column>
				<el-table-column prop="totalvolumnamount" label="体积" width="100" align="center"></el-table-column>
				<el-table-column prop="goodsname" label="品名"  align="center"></el-table-column>
				<el-table-column prop="departure" label="始发港" width="70" align="center"></el-table-column>
				<el-table-column prop="destination" label="目的港" width="70" align="center"></el-table-column>
				<el-table-column prop="cneecity" label="收货城市" width="100" align="center"></el-table-column>
				<el-table-column prop="cneecountry" label="国家代码" width="70" align="center"></el-table-column>
				<el-table-column prop="response" label="回执" ></el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<splitVisible ref="addMission" v-if="splitVisible" :visible.sync="splitVisible" :frow="frow"></splitVisible>
		<resetVisible ref="addMission" v-if="resetVisible" :visible.sync="resetVisible" :frow="frow"></resetVisible>
	</div>
</template>
<script>
import splitVisible from './af_branch_line_split'
import resetVisible from './af_branch_line_reset'
	export default {
		data() {
			return {
				loading: false,
				loading2: false,
				bbccFlag:false,
        		splitVisible: false,
        		resetVisible: false,
				data: [],
				multipleSelection: [],
        		frow: {},
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
					begindate: '',
					enddate: '',
					hwbnumber: '',
					awbnumber: ''
				},

			}
		},
    components: {
    	'splitVisible': splitVisible,
    	'resetVisible': resetVisible
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
				if (command == 'reset') {
					this.showreset(this.currRow)
				} else if (command == 'split') {
					this.showsplit(this.currRow)
				} 
			},
			showreset(rrow) {
				this.frow=rrow;
				this.resetVisible = true;
				
			},
			showsplit(rrow) {
				this.frow=rrow;
				this.splitVisible = true;	
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
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			doMerge(){

				if(this.multipleSelection.length<2){
					this.openError("请选择两个或两个以上合并项");
					return;
				}
				var awbnumber=this.multipleSelection[0].awbnumber;
				var hwbnumber=this.multipleSelection[0].hwbnumber;

				var flag=1;
				for (var i = 0; i < this.multipleSelection.length-1; i++) {
					awbnumber=this.multipleSelection[i].awbnumber
					hwbnumber=this.multipleSelection[i].hwbnumber
					for (var j = i+1; j < this.multipleSelection.length; j++) {
						if (awbnumber!=this.multipleSelection[j].awbnumber||hwbnumber!=this.multipleSelection[j].hwbnumber) {
							flag=0;
						}	

					}
				}
				if (flag==0) {
					this.openError("请选择相同的主单和分单");
					return;
				}

				var rearchid='';
				for (var i = 0; i < this.multipleSelection.length; i++) {
					if (rearchid.length==0) {
						rearchid=this.multipleSelection[i].rearchid
					}else{
						rearchid=rearchid+","+this.multipleSelection[i].rearchid
					}
				}

				this.$confirm('此操作将合并, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
					}).then(() => {
						let params={
		                  'hwbnumber':hwbnumber,
		                  'awbnumber':awbnumber,
		                  'rearchid':rearchid
		                }
		                this.loading2 = true
						this.$axios.post2("/afbase/fhl/doMerge", params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList();
									this.loading2 = false
								} else {
									this.loading2 = false
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.loading2 = false
								this.openError(response.data.messageInfo || "");
							}.bind(this))
		            	
		            }).catch(() => {});
			},
			
			queryList() {
				let params={
                  'currentPage': this.pageConf.pageCode,
                  'pageSize': this.pageConf.pageSize,
                  'begindate':this.query.begindate,
                  'enddate':this.query.enddate,
                  'hwbnumber':this.query.hwbnumber,
                  'awbnumber':this.query.awbnumber,
                }
                this.$axios.post('/afbase/fhl/queryLineList',params)
                .then(function(response) {
                	if (response.data.code == 1) {
                      this.openError(response.data.messageInfo)
                      return
                    }
                    this.data=response.data.data.dataList;
                    this.pageConf.totalPage=response.data.data.totalNum;
                 }.bind(this)
                );

			},
		
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
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
