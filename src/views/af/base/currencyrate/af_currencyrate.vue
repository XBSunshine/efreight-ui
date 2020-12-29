<template>
	<div class="warp-main">
		<div>
			<el-form :inline="true" :model="query" class="currency-rate-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="60px">
							<el-input @input="query.currencyCode=query.currencyCode.toUpperCase()" maxLength="3" v-model="query.currencyCode" style="width: 130px;" clearable auto-complete="off">
                <template slot="prepend"> 币种 </template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
              <el-input style="width: 210px">
                <template slot="prepend">日期</template>
                <el-date-picker slot="suffix" v-model="query.createTime" style="width: 170px;margin-right: -5px" format="yyyy-MM-dd" type="date" value-format="yyyy-MM-dd 00:00:00" clearable placeholder="选择日期">
                </el-date-picker>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item style="margin-left: 20px;">
							<el-button type="primary" size="small" @click="findPage">查询</el-button>
							<el-button style="margin-left: 4px;" type="success" size="small" @click="showsave" v-show="this.permission.sys_base_currencyrate_add.isShow">新增汇率</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" v-loading="loading" border>
				<el-table-column align="center" prop="currencyCode" label="币种" width="80"></el-table-column>
				<el-table-column align="center" prop="currencyRate" label="汇率" width="80" :formatter="currencyRateFormatter"></el-table-column>
				<el-table-column align="center" prop="beginDate" :formatter="formatDate1" width="150" label="生效日期"></el-table-column>
				<el-table-column align="center" prop="endDate" :formatter="formatDate1" width="150" label="失效日期"></el-table-column>
				<el-table-column align="center" prop="creatorName" label="创建人" width="300"></el-table-column>
				<el-table-column align="center" prop="createTime" :formatter="formatDate2" width="180" label="创建时间"></el-table-column>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
	</div>
</template>

<script>
	import saveVisibleVue from './af_currencyrate_save'
	export default {
		name: 'currencyrate',
		data() {
			return {
				data1: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 30], //分页选项
					handleCurrentChange: function() {}
				},
				fileList: [],
				saveVisible: false,
				editVisible: false,
				loading: false,
				currRow: '',
				frow: {},
				query: {
					currencyCode: '',
					createTime: ''
				},
				permission: {
					sys_base_currencyrate_add: {
						isShow: false
					}
				}
			}
		},
		created() {
			this.findPage();
			this.query.createTime = this.getDateTime(new Date()) + " 00:00:00";
			this.loadPermission(this.permission);
		},
		provide() {
			return {
				findPage: this.findPage
			}
		},
		components: {
			'saveVisibleTag': saveVisibleVue
		},
		methods: {
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				}
			},
			formatDate1(row, column) {
				if(row[column.property]) {
					return(row[column.property]).substr(0, 10)
				} else {
					if(column.property == 'endDate') {
						return "2099-12-31"
					} else {
						return ""
					}
				}

			},
			formatDate2(row, column) {
				if(row[column.property]) {
					return(row[column.property]).substr(0, 16)
				} else {
					return ""
				}
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			showsave() {
				this.saveVisible = true;
			},
			findPage() {
				this.loading = true
				this.$axios.get2('/afbase/currencyrate?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));
			},
			findPage2(current) {
				this.$axios.get2('/afbase/currencyrate?current=' + current + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			handleSizeChange() {
				this.findPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findPage();
			},
			getDateTime(theDate) {
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
				_month = _month + 1;
				if(_month < 10) {
					_month = "0" + _month;
				}
				if(_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date;
			},
			currencyRateFormatter(row, prop) {
				if(row[prop.property] != null && row[prop.property] !== '') {
					return parseFloat(row[prop.property] + '').toFixed(3)
				} else {
					return ''
				}
			}
		}
	}
</script>

<style>
  .currency-rate-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .currency-rate-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .currency-rate-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }
  .currency-rate-ruleForm {
    padding: 0px 15px;
  }
</style>
