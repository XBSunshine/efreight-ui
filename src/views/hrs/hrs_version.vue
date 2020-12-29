<template>
	<div class="warp-main hrs-version">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" class="demo-ruleForm">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item>
								<el-input v-model="query.versionCode" auto-complete="off" placeholder="" clearable style="width: 200px;">
                  <template slot="prepend">版本编码</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 10px">
							<el-form-item>
                <div class="el-input el-input-group el-input-group--prepend">
                  <div class="el-input-group__prepend">更新版本时间</div>
                  <el-date-picker v-model="query.versionDateStart" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" clearable style="width: 200px;">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-model="query.versionDateEnd" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" clearable style="width: 200px;">
                  </el-date-picker>
                </div>
							</el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 41px;">
                <el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave">新增</el-button>
              </el-form-item>
            </el-col>
					</el-row>
				</el-form>
			</el-col>
			<el-table :data="data" border>
				<el-table-column prop="versionId" width="70" label="版本号" align="center"></el-table-column>
				<el-table-column prop="versionCode" width="90" label="版本编码" align="center"></el-table-column>
				<el-table-column prop="versionDate" width="150" label="更新版本时间" align="center"></el-table-column>
				<el-table-column prop="versionText" label="更新内容" align="left" width="150"></el-table-column>
				<el-table-column label="操作" width="60" align="center" fixed="left">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item></el-dropdown-item>
								<el-dropdown-item command="edit" >编辑</el-dropdown-item>
								<el-dropdown-item command="record" >记录</el-dropdown-item>
								<el-dropdown-item command="delete" >删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
        <el-table-column></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</el-row>
		<save ref="addMission" v-if="save" :visible.sync="save"></save>
		<edit ref="addMission" v-if="edit" :visible.sync="edit" :frow="frow"></edit>
		<record ref="addMission" v-if="record" :visible.sync="record" :frow="frow"></record>
	</div>
</template>
<script>
	import save from './version/hrs_version_save'
	import edit from './version/hrs_version_edit'
	import record from './version/hrs_version_record'
	export default {
		data() {

			return {
				/*表数据*/
				data: [],
				loading: false,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50] //分页选项
				},
				query: {
					versionCode: '',
					versionDateStart: '',
					versionDateEnd: ''
				},
				save: false,
				edit: false,
				record: false,
				frow: {},
				showFlag: false,
				currRow: '',
        addButtonFlag: false,
        editButtonFlag: false,
        recordButtonFlag: false,
        deleteButtonFlag: false,
			}
		},
		components: {
			'save': save,
			'edit': edit,
			'record': record
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'record') {
					this.showrecord(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			showsave() {
				this.save = true;
			},
			showedit(row) {
				this.frow = row;
				this.edit = true;
			},
			showrecord(row) {
				this.frow = row;
				this.record = true;
			},
			findByPage() {
				let param = {
					"current": this.pageConf.pageCode,
					"size": this.pageConf.pageSize,
					"versionCode": this.query.versionCode,
					"versionDateStart": this.query.versionDateStart,
					"versionDateEnd": this.query.versionDateEnd
				};
				this.$axios.get2('/hrs/version', param).then(function(response) {
					if(response.data.code == 0) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						}
					} else {
						this.openError(response.data.messageInfo);
					}
				}.bind(this)).catch(function(error) {
					this.openError(error.response.data.message);
				}.bind(this));
			},
			findByPage2(current) {
				let param = {
					"current": current,
					"size": this.pageConf.pageSize,
					"versionCode": this.query.versionCode,
					"versionDateStart": this.query.versionDateStart,
					"versionDateEnd": this.query.versionDateEnd
				};
				this.$axios.get2('/hrs/version', param).then(function(response) {
					if(response.data.code == 0) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;

					} else {
						this.openError(response.data.messageInfo);
					}
				}.bind(this)).catch(function(error) {
					this.openError(error.response.data.message);
				}.bind(this));
			},
			doDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/hrs/version/' + row.versionId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this))
						.catch(function(error) {
							this.openError(error.response.data.messageInfo);
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
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
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
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
		created() {
      let buttonInfo = window.localStorage.getItem('buttonInfo')
      if (buttonInfo.indexOf('sys_version_add')>-1) {
          this.addButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_version_edit')>-1) {
          this.editButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_version_record')>-1) {
          this.recordButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_version_del')>-1) {
          this.deleteButtonFlag=true;
      }
			this.findByPage();
		}
	}
</script>
<style type="text/css">
  .hrs-version .el-input__icon{
    line-height: 30px !important;
  }
  .hrs-version .el-form-item__content{
    line-height: 30px
  }
</style>
