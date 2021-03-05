<template>
	<div class="warp-main css_report_income_statement">
		<el-form :inline="false" :model="query" label-width="10px">
			<div ref="css_report_income_statement_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:209px;">
								<template slot="prepend">开始日期</template>
								<el-date-picker slot="suffix" style="width: 140px;margin-right: -5px;" v-model="query.start" type="date" value-format="yyyy-MM-dd" placeholder="请录入日期">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:209px;">
								<template slot="prepend">结束日期</template>
								<el-date-picker slot="suffix" style="width: 140px;margin-right: -5px;" v-model="query.end" type="date" value-format="yyyy-MM-dd" placeholder="请录入日期">
								</el-date-picker>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-checkbox v-model="query.voucherDateChecked">凭证日期</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-checkbox v-model="query.lockDateChecked">锁账日期</el-checkbox>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
              <el-button type="text" size="mini" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
              <el-button type="text" size="mini" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" @click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 3px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelSure">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row v-show="showFlag">
          <el-col class="elementWidth">
          	<el-form-item label-width="10px">
          		<el-input style="width:510px;">
          			<template slot="prepend">分公司&emsp;</template>
          			<el-select slot="suffix" v-model="query.otherOrg" filterable placeholder="请选择"  style="width: 442px;margin-right: -5px">
          				<el-option v-for="item in otherOrgs" :key="item.orgId" :label="item.orgName" :value="item.orgId">
          				</el-option>
          			</el-select>
          		</el-input>
          	</el-form-item>
          </el-col>
        </el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" :max-height="tableHeight" stripe :data="data" border :cell-style="addCellStayle">
			<el-table-column prop="项目" label="项目" width="450" align="left" header-align="center"></el-table-column>
			<el-table-column prop="本月金额" label="本月金额" width="150" align="right" header-align="center" :formatter="formatter"></el-table-column>
			<el-table-column prop="本年累计金额" label="本年累计金额" width="150" align="right" header-align="center" :formatter="formatter"></el-table-column>
			<el-table-column></el-table-column>
		</el-table>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				tableHeight: "750px",
				loading: false,
				data: [],
        otherOrgs:[],
        showFlag:false,
				query: {
					start: this.getDate(0),
					end: this.getDate(1),
					voucherDateChecked: true,
					lockDateChecked: false,
          otherOrg:-1
				}
			}
		},
		created() {
      let param ={
         checkJt:'jt'
      }
      //分公司集合
      this.$axios.get2('/hrs/org/getOrgChild',param).then((response) => {
      	  if(response.data.data&&response.data.data.length>0){
            this.otherOrgs=response.data.data;
            this.otherOrgs.unshift(
            {
              orgId:-1,
              orgName:'全部'
            }
            );
          }else{
             this.otherOrgs.unshift(
             {
               orgId:-1,
               orgName:'全部'
             }
             );
          }
      })
    },
		methods: {
      showFlagSearch(){
             this.showFlag = !this.showFlag;
             this.setHeight();
      },
			setHeight() {
				this.$nextTick(() => {
					let css_report_income_statement_header = this.$refs.css_report_income_statement_header.offsetHeight;
					let heightS = window.innerHeight - 92 - css_report_income_statement_header;
					this.tableHeight = heightS + "px";
				});
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			queryList() {
				if(this.query.start==null||this.query.end==null){
					this.openError("开始日期和结束日期不能为空")
					return
				}
				if (this.query.start.substr(0, 4) !== this.query.end.substr(0, 4)) {
					this.openError("开始日期和结束日期必须在同一年度")
					return
				}
				if (this.query.lockDateChecked == false && this.query.voucherDateChecked == false) {
					this.openError("凭证日期和锁账日期至少勾选一个")
					return
				}
				this.setHeight();
				this.loading = true
				this.$axios.get2('/afbase/cssReportIncomeStatement', this.query).then((response) => {
					this.data = response.data.data;
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
			exportExcelSure() {
				if (this.data.length == 0) {
					this.openError("查询结果没有数据，不允许导出");
					return;
				}
				this.$axios.post3('/afbase/cssReportIncomeStatement/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '损益表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			getDate(flag) {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				if (flag == 0) {
          if (_month === 0) {
              _year = parseInt(_year) - 1;
              _month = 12;
          }
          if (_month < 10) {
              _month = "0" + _month;
          }
					return _year + "-" + _month + "-01"
				} else if (flag == 1) {
          if (_month < 10) {
              _month = "0" + _month;
          }
					let oneDay = 24 * 60 * 60 * 1000
					let lastDate = new Date(new Date(_year, _month, 1).getTime() - oneDay)
					_month = lastDate.getMonth() + 1
					if (_month < 10) {
						_month = "0" + _month;
					}
					let _day = lastDate.getDate()
					return _year + "-" + _month + "-" + _day
				}
			},
			addCellStayle(data) {
				let k = '';
				if (data.column.property === "本月金额" && data.row['本月金额'] < 0) {
					k = "color:red;"
				}else if(data.column.property === "本年累计金额" && data.row['本年累计金额'] < 0){
					k = "color:red;"
				}
				return k;
			},
			formatter(row, column) {
					if (row[column.property]) {
						return row[column.property].toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
					} else {
						return "0.00"
					}
			}
		}
	}
</script>
<style>
	.css_report_income_statement .el-table .cell {
		white-space: pre-wrap !important;
	}

	.css_report_income_statement .el-input__icon {
		line-height: 30px !important;
	}

	.css_report_income_statement .el-form-item__content {
		line-height: 30px !important;
	}

	.css_report_income_statement .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
