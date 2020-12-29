<template>
	<div class="warp-main hrs-notice">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" class="demo-ruleForm">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item >
								<el-input v-model="query.noticeTitle" auto-complete="off" clearable clearable style="width: 250px;">
                  <template slot="prepend">主题</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth" style="margin-left: 10px">
							<el-form-item>
                <el-input style="width: 167px">
                  <template slot="prepend">类型</template>
                  <el-select slot="suffix" v-model="query.noticeType" placeholder="" clearable style="width: 100px; margin-right: -5px">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="系统更新" value="XTGX"></el-option>
                    <el-option label="系统维护" value="XTWH"></el-option>
                    <el-option label="活动推广" value="HDTG"></el-option>
                  </el-select>
                </el-input>
							</el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 41px; margin-top: -6px">
                <el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave">新建</el-button>
              </el-form-item>
            </el-col>
					</el-row>
				</el-form>
			</el-col>
			<el-table v-loading="loading" :data="data" border>
        <el-table-column label="操作" width="60" align="center" fixed="left">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="delete" >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
				<el-table-column prop="noticeTitle" label="主题" align="left"></el-table-column>
				<el-table-column prop="noticeDate" label="公告日期" align="center" width="90"></el-table-column>
				<el-table-column prop="noticeType" label="公告类型" :formatter="formatNoticeType" align="center" width="80"></el-table-column>
				<el-table-column prop="pushType" label="推送级别" :formatter="formatPushType" align="center"></el-table-column>
				<el-table-column label="内容" width="500" align="left">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p style="width: 500px;">{{ scope.row.noticeText }}</p>
							<div slot="reference" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width: 50%;display: inline-block;">
								<span>{{ scope.row.noticeText }}</span>
							</div>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</el-row>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>
<script>
	import save from './notice/hrs_notice_save'
	import edit from './notice/hrs_notice_edit'
	export default {
		data() {
			return {
				/*表数据*/
				data: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50] //分页选项
				},
				query: {
					noticeTitle: '',
					noticeType: ''
				},
				saveVisible: false,
				editVisible: false,
				frow: {},
        currRow: '',
				showFlag: false,
				loading: false,
        addButtonFlag: false,
			}
		},
		components: {
			'save': save,
			'edit': edit
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
      handleCommand(command) {
          if(command == 'delete') {
              this.doDelete(this.currRow)
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
			findByPage() {
				this.loading = true
				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&noticeTitle=" + this.query.noticeTitle +
					"&noticeType=" + this.query.noticeType;
				this.$axios.get('/hrs/notice/page?' + param)
					.then(function(response) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));
			},
			findByPage2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&noticeTitle=" + this.query.noticeTitle +
					"&noticeType=" + this.query.noticeType;
				this.$axios.get('/hrs/notice/page?' + param)
					.then(function(response) {
						this.loading = false
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			doDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/hrs/notice/' + row.noticeId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
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
			},
			formatNoticeType(row, column) {
				return row.noticeType == "XTGX" ? "系统更新" : row.noticeType == "XTWH" ? "系统维护" : row.noticeType == "HDTG" ? "活动推广" : "-";
			},
			formatPushType(row, column) {
				return row.pushType == 1 ? "全部用户" : row.pushType == 2 ? "全部管理员" : row.pushType == 3 ? "签约公司全部用户" : "-";
			}
		},
		created() {
      let buttonInfo = window.localStorage.getItem('buttonInfo')
      if (buttonInfo.indexOf('sys_notice_add')>-1) {
          this.addButtonFlag=true;
      }
			this.findByPage();
		}
	}
</script>
<style type="text/css">
  .hrs-notice .el-input__icon{
    line-height: 30px !important;
  }
</style>
