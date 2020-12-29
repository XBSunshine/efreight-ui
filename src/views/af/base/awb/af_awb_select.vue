<template>
	<el-dialog title="运单管理 - 新增 - 选择" width="750px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-form :inline="false" :model="query"  class="afAwbSelect-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item prop="coopMnemonicV" label-width="15px">
              <el-input v-model="query.coopMnemonicV"  @input="query.coopMnemonicV=query.coopMnemonicV.toUpperCase()" style="width:150px;margin-right: 15px;" auto-complete="off" clearable>
                <template slot="prepend">
                  <span>代码</span>
                </template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item prop="coopNameV" label-width="15px">
              <el-input v-model="query.coopNameV"  clearable style="width:230px;margin-right: 15px;" auto-complete="off">
                <template slot="prepend">
                  <span>中文全称</span>
                </template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col style="margin-left: 20px;" class="elementWidth">
						<el-form-item>
							<el-button size="small" type="primary" @click="queryList">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" height="400px">
				<el-table-column prop="coopCodeV" label="代码" width="120"></el-table-column>
				<!--<el-table-column prop="coopMnemonicV" label="助记码" width="120"></el-table-column>-->
				<el-table-column prop="coopNameV" label="中文全称"></el-table-column>

				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doSelect(scope.row)">选择</el-button>

					</template>
				</el-table-column>
				<!-- :formatter="formatter1" -->
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
	</el-dialog>
</template>
<script>
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
				data1: [],
				options: [],
				options2: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
					coopMnemonicV: '',
					coopNameV: '',
					awbFromType: ''
				},
				saveVisible: false
			}
		},

		inject: ['setValue'],
		created: function() {
			if(this.frow.awbFromType == "航空公司") {
				this.query.awbFromType = "'干线承运人'";
			} else {
				this.query.awbFromType = "'" + this.frow.awbFromType + "'";
			}

			this.queryList();
		},

		methods: {
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			doSelect(rrow) {
				this.setValue(rrow);
				this.handleClose();
			},
			queryList() {

				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&coopMnemonicV=" + this.query.coopMnemonicV + "&coopNameV=" + this.query.coopNameV +
					"&awbFromType=" + this.query.awbFromType;
				let that = this;
				this.$axios.get('/afbase/awb/selectpage?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
					if(that.data1.length == 0) {
						let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
						that.queryList2(current);
					}
				}).catch(function(error) {
					console.log(error);
				});

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&coopMnemonicV=" + this.query.coopMnemonicV + "&coopNameV=" + this.query.coopNameV +
					"&awbFromType=" + this.query.awbFromType;
				let that = this;
				this.$axios.get('/afbase/awb/selectpage?' + param).then(function(response) {
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

			formatter1(row, column) {
				return row.awbFromType + ' - ' + row.awbFromName;
			},
			formatter2(row, column) {
				if(row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

			//---------------------

		}
	}
</script>
<style type="text/css">

  .afAwbSelect-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afAwbSelect-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afAwbSelect-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
