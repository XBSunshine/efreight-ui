<template>
	<div class="warp-main">

		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.inquiryAgentName" auto-complete="off" clearable style="width:240px;">
							<template slot="prepend">询盘代理</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input class="widthWithThree" v-model="query.departureStation" auto-complete="off" clearable style="width:180px;" @input="query.departureStation=query.departureStation.toUpperCase()">
							<template slot="prepend">始发港</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input class="widthWithThree" v-model="query.arrivalStation" auto-complete="off" clearable style="width:180px;" @input="query.arrivalStation=query.arrivalStation.toUpperCase()">
							<template slot="prepend">目的港</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.inquiryAgentNameShort" auto-complete="off" clearable style="width:200px;">
							<template slot="prepend">简称</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave">新增</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
					<el-form-item label="" label-width="10px">
						<el-input style="width:240px;">
							<template slot="prepend">签约类型</template>
							<el-select slot="suffix" clearable v-model="query.contractType" style="width:171px;margin-right: -5px;">
								<el-option v-for="item in contractTypeOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.carrierCode" @input="query.carrierCode=query.carrierCode.toUpperCase()" auto-complete="off" clearable style="width:180px;">
							<template slot="prepend">优势航司</template>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input style="width:180px;">
							<template slot="prepend">是否有效</template>
							<el-select slot="suffix" v-model="query.isValid" clearable placeholder="请选择" style="width:111px;margin-right: -5px;">
								<el-option label="是" value="1">
								</el-option>
								<el-option label="否" value="0">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="248px">
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<el-table v-loading="loading" :data="data" border stripe @header-dragend="cellWidth">
			<el-table-column label="操作" width="60" fixed="left" align="center">
				<template slot-scope="scope">
					<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item></el-dropdown-item>
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">
				<el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
				</el-table-column>
			</template>
			<el-table-column></el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>

		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
	</div>
</template>
<script>
	import saveVisibleVue from './inquiryagent/prm_inquiry_agent_save'
	import editVisibleVue from './inquiryagent/prm_inquiry_agent_edit'
	import setVisibleVue from './inquiryagent/prm_inquiry_agent_setting'
	import columns from './inquiryagent/prm_inquiry_agent_column.json'

	export default {
		data() {
			return {

				/*表数据*/
				showFlag: false,
				contractTypeOptions: [],
				cities: [],
				data: [],
				tableColumns: [],
				loading: false,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {

					}
				},
				query: {
					inquiryAgentName: '',
					inquiryAgentNameShort: '',
					departureStation: '',
					arrivalStation: '',
					carrierCode: '',
					contractType: '',
					isValid: '1',
					columnStrs: ''
				},
				saveVisible: false,
				editVisible: false,
				setVisible: false,
				frow: {}
			}
		},
		created() {
			this.$axios.get('/afbase/awb/selectCategory?category=签约类型').then(function(response) {
				this.contractTypeOptions = response.data.data;
			}.bind(this));
			this.findByPage();
		},

		components: {
			'saveVisibleTag': saveVisibleVue,
			'editVisibleTag': editVisibleVue,
			'setVisibleTag':  setVisibleVue
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'stop') {

				}
			},
			handleChange(command) {
				this.currRow = command
			},
			showsave() {
				this.saveVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			setting() {
				this.setVisible = true;
			},
			findByPage() {
        //从数据库查询设置信息
        let pageName = '客商资料管理/询盘代理';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let inquiry_agent_list_column = response.data.data;
                if(inquiry_agent_list_column && inquiry_agent_list_column.length>0){
                    this.tableColumns = this.sortBykey(inquiry_agent_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.inquiryAgent, 'index');
                }
                let params = {
                    'currentPage': this.pageConf.pageCode,
                    'pageSize': this.pageConf.pageSize,
                    'inquiryAgentName': this.query.inquiryAgentName,
                    'inquiryAgentNameShort': this.query.inquiryAgentNameShort,
                    'departureStation': this.query.departureStation,
                    'arrivalStation': this.query.arrivalStation,
                    'carrierCode': this.query.carrierCode,
                    'contractType': this.query.contractType,
                    'isValid': this.query.isValid
                }
                this.loading = true
                this.$axios.post('/prm/inquiryAgent/queryList', params)
                    .then((response) => {
                        this.data = response.data.data.dataList;
                        this.pageConf.totalPage = response.data.data.totalNum;
                        this.loading = false
                    });
            }.bind(this));

	/*			let userId = window.localStorage.getItem('userId');
				let inquiry_agent_column = window.localStorage.getItem(userId + '_prm_inquiry_agent_column');
				if (inquiry_agent_column) {
					let arrayC = JSON.parse(inquiry_agent_column)
					if (arrayC && arrayC.length > 0) {
						this.tableColumns = this.sortBykey(arrayC, 'index');
					}
				} else {
					this.tableColumns = this.sortBykey(columns.inquiryAgent, 'index');
				}

				let params = {
					'currentPage': this.pageConf.pageCode,
					'pageSize': this.pageConf.pageSize,
					'inquiryAgentName': this.query.inquiryAgentName,
					'inquiryAgentNameShort': this.query.inquiryAgentNameShort,
					'departureStation': this.query.departureStation,
					'arrivalStation': this.query.arrivalStation,
					'carrierCode': this.query.carrierCode,
					'contractType': this.query.contractType,
					'isValid': this.query.isValid
				}
				this.loading = true
				this.$axios.post('/prm/inquiryAgent/queryList', params)
					.then((response) => {
						this.data = response.data.data.dataList;
						this.pageConf.totalPage = response.data.data.totalNum;
						this.loading = false
					});*/
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
          this.query.columnStrs = JSON.stringify(this.tableColumns)
					this.exportExcelSure();
				}).catch(() => {
          let excelList = this.sortBykey(columns.inquiryAgent, 'index')
          this.query.columnStrs = JSON.stringify(excelList)
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/prm/inquiryAgent/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '询盘代理' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			cellWidth(newWidth, oldWidth, column, event){
			  let strColumn =  JSON.stringify(this.tableColumns);
			  let userId = window.localStorage.getItem('userId');
			  let  arrayC  = JSON.parse(strColumn);
			  if (arrayC && arrayC.length > 0) {
			     arrayC.forEach(function(item,index){
			        if(column.label==item.label){
			          item.width = newWidth;
			        }
			     });
			     arrayC = this.sortBykey(arrayC, 'index');
			     localStorage.setItem(userId + '_inquiry_agent_list_column_width',JSON.stringify(arrayC))
			  }
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			}
		},

	}
</script>
<style type="text/css">
	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

</style>
