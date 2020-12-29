<template>
	<div class="warp-main">
		<el-row>
			<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :model="query" class="hrsUser">
					<el-row>
						<el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.userName" auto-complete="off" style="width: 180px;" clearable>
                  <template slot="prepend">姓名</template>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.userEmail" auto-complete="off" style="width: 160px;" clearable>
                  <template slot="prepend">邮箱</template>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.phoneNumber" auto-complete="off" style="width: 160px;" clearable>
                  <template slot="prepend">手机</template>
                </el-input>
              </el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 31px;">
                <el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave" v-if="showsaveButtonFlag" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">新增</el-button>
                <el-button type="primary" size="small" v-on:click="exportAddressExcel" v-if="exportAddressExcelButtonFlag" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">导出通讯录</el-button>
              </el-form-item>
            </el-col>
					</el-row>
					<el-row v-show=showFlag>
						<el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:180px;">
                  <template slot="prepend">是否黑名单</template>
                  <el-select slot="suffix" v-model="query.ifBlack" placeholder="请选择" style="width:97px;margin-right: -5px;" clearable>
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:160px;">
                  <template slot="prepend">是否离职</template>
                  <el-select slot="suffix" v-model="query.ifLeave" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item label-width="10px" prop="employmentType">
                <el-input style="width:160px;">
                  <template slot="prepend">劳务类型</template>
                  <el-select slot="suffix" v-model="query.employmentType" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                    <el-option label="全职" value="全职"></el-option>
                    <el-option label="兼职" value="兼职"></el-option>
                    <el-option label="外包" value="外包"></el-option>
                    <el-option label="实习" value="实习"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="39px">
                <el-button style="margin-left: 24px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
                <el-button style="margin-left: 3px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel" v-if="exportExcelButtonFlag">导出</el-button>
              </el-form-item>
            </el-col>
					</el-row>
					<el-row v-show=showFlag>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input class="widthFour" style="width:230px;">
                  <template slot="prepend">
                    <span>出生日期</span>
                  </template>
                  <el-date-picker slot="suffix" style="width: 147px;margin-right: -5px;" v-model="query.userBirthdayStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
                &nbsp;&nbsp;&nbsp;-
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="15px">
                <el-input style="width:146px;">
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.userBirthdayEnd" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:215px;">
                  <template slot="prepend">
                    <span>入职日期</span>
                  </template>
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.hireDateStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
                &nbsp;&nbsp;&nbsp;-
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="15px">
                <el-input style="width:146px;">
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.hireDateEnd" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show=showFlag>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:230px;">
                  <template slot="prepend">
                    <span>黑名单日期</span>
                  </template>
                  <el-date-picker slot="suffix" style="width: 147px;margin-right: -5px;" v-model="query.blacklistDateStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
                &nbsp;&nbsp;&nbsp;-
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="15px">
                <el-input style="width:146px;">
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.blacklistDateEnd" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:215px;">
                  <template slot="prepend">
                    <span>离职日期</span>
                  </template>
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.leaveDateStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
                &nbsp;&nbsp;&nbsp;-
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="15px">
                <el-input style="width:146px;">
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.leaveDateEnd" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
					</el-row>
          <el-row v-show=showFlag>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input class="widthFour" style="width:230px;">
                  <template slot="prepend">
                    <span>修改时间</span>
                  </template>
                  <el-date-picker slot="suffix" style="width: 147px;margin-right: -5px;" v-model="query.editTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
                &nbsp;&nbsp;&nbsp;-
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="15px">
                <el-input style="width:146px;">
                  <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.editTimeEnd" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
				</el-form>
			</el-col>
			<el-table v-loading="loading" height="540" :data="data1" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column label="操作" align="center" width="50" :fixed="fixed">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item></el-dropdown-item>
								<el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
								<el-dropdown-item command="leave" :disabled="scope.row.leaveDate!=null" v-if="leaveButtonFlag">离职</el-dropdown-item>
								<el-dropdown-item command="resume" :disabled="scope.row.leaveDate==null" v-if="resumeButtonFlag">复职</el-dropdown-item>
								<el-dropdown-item command="black" v-if="blackButtonFlag">黑名单</el-dropdown-item>
								<!--<el-dropdown-item command="dept" :disabled="scope.row.leaveDate!=null" v-if="deptButtonFlag">兼职</el-dropdown-item>-->
								<!--<el-dropdown-item command="delete">删除</el-dropdown-item>-->
								<el-dropdown-item divided command="resetPass" v-if="resetPassButtonFlag">重置密码</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<!--<el-table-column align="center" label="工号" width="150" :fixed="fixed">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.jobNumber}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.jobNumber}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.jobNumber}}</span>
					</template>
				</el-table-column>-->
        <template v-for="(item,index) in tableColumns">
          <el-table-column v-if="item.label=='姓名'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.userName}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.userName}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column align="center" label="是否生效" width="100">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.userStatus=='1'"></i>
            </template>
          </el-table-column>-->
          <el-table-column v-if="item.label=='英文名'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.userEname}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.userEname}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.userEname}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='邮箱'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.userEmail}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.userEmail}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.userEmail}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='电话'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.phoneNumber}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.phoneNumber}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.phoneNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='部门'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.deptName}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.deptName}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.deptName}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='岗位'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.jobPosition}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.jobPosition}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.jobPosition}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='角色'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.roleName}}</s></span>
              <span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.roleName}}</span>
              <span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.roleName}}</span>
            </template>
          </el-table-column>
        </template>
				<!--<el-table-column prop="userBirthday" label="出生日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="hireDate" label="入职日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="employmentType" label="劳务类型"></el-table-column>
				<el-table-column prop="leaveDate" label="离职日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="blacklistDate" label="黑名单日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="editTime" label="修改时间"></el-table-column>
				<el-table-column prop="userStatus" label="是否生效" :formatter="formatStatus"></el-table-column>-->
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</el-row>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		<leave ref="addMission" v-if="leaveVisible" :visible.sync="leaveVisible" :frow="frow"></leave>
		<black ref="addMission" v-if="blackVisible" :visible.sync="blackVisible" :frow="frow"></black>
		<dept ref="addMission" v-if="deptVisible" :visible.sync="deptVisible" :frow="frow"></dept>
	</div>
</template>
<script>
	import saveVisibleVue from './user/hrs_user_save'
	import editVisibleVue from './user/hrs_user_edit'
	import Leave from './user/hrs_user_leave'
	import Black from './user/hrs_user_black'
	import Dept from './user/hrs_user_dept'
  import columns from './user/hrs_user_column.json'
  import setVisibleVue from './user/hrs_user_setting'
	export default {
		data() {
			return {

				/*表数据*/
				data1: [],
        tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					userName: '',
					employmentType: '',
					userEmail: '',
					phoneNumber: '',
					userBirthdayStart: '',
					userBirthdayEnd: '',
					hireDateStart: '',
					hireDateEnd: '',
					leaveDateStart: '',
					leaveDateEnd: '',
					blacklistDateStart: '',
					blacklistDateEnd: '',
					editTimeStart: '',
					editTimeEnd: '',
					deptCode: '',
					//userStatus: true,
					ifBlack: false,
					ifLeave: false
				},
				saveVisible: false,
				editVisible: false,
				leaveVisible: false,
				blackVisible: false,
				deptVisible: false,
				showFlag: false,
        setVisible: false,
				frow: {},
				currRow: '',
				loading: false,
				cssSpan: 8,
				fixed: false,
				exportExcelButtonFlag: false,
				showsaveButtonFlag: false,
				editButtonFlag: false,
				leaveButtonFlag: false,
				resumeButtonFlag: false,
				blackButtonFlag: false,
				deptButtonFlag: false,
				resetPassButtonFlag: false,
        exportAddressExcelButtonFlag: false,
			}
		},
		created() {
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('sys_user_export') > -1) {
				this.exportExcelButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_add') > -1) {
				this.showsaveButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_edit') > -1) {
				this.editButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_leave') > -1) {
				this.leaveButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_resume') > -1) {
				this.resumeButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_black') > -1) {
				this.blackButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_parttime') > -1) {
				this.deptButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_resetpass') > -1) {
				this.resetPassButtonFlag = true;
			}
      if(buttonInfo.indexOf('sys_user_export_address') > -1) {
          this.exportAddressExcelButtonFlag = true;
      }
			if(this.$route.query.deptCode) {
				this.query.deptCode = this.$route.query.deptCode;
			} else {
				this.query.deptCode = "";
			}
			this.query.userStatus = true;
			this.findByPage();

			this.computedSpan();
      //从数据库查询设置信息
      let pageName = '组织机构管理/用户管理';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let hrs_user_list_column = response.data.data;
              if(hrs_user_list_column && hrs_user_list_column.length>0){
                  this.tableColumns = this.sortBykey(hrs_user_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.info, 'index');
              }
          }.bind(this));
		},
		mounted() {
			let that = this;
			window.onresize = () => {
				that.computedSpan();
			}
		},
		components: {
      'setVisibleTag': setVisibleVue,
			'saveVisibleTag': saveVisibleVue,
			'editVisibleTag': editVisibleVue,
			'black': Black,
			'leave': Leave,
			'dept': Dept,
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
      setting() {
          this.setVisible = true;
      },
      cellWidth(newWidth, oldWidth, column, event) {
          let strColumn = JSON.stringify(this.tableColumns);
          let userId = window.localStorage.getItem('userId');
          let arrayC = JSON.parse(strColumn);
          if (arrayC && arrayC.length > 0) {
              arrayC.forEach(function(item, index) {
                  if (column.label == item.label) {
                      item.width = newWidth;
                  }
              });
              arrayC = this.sortBykey(arrayC, 'index');
              localStorage.setItem(userId + '_hrs_user_list_column_width', JSON.stringify(arrayC))
          }
      },
      //标题样式
      addPullRightClass({
                            row,
                            column,
                            rowIndex,
                            columnIndex
                        }) {

      },
      //标题 stly
      addCellStayle(data) {
          return "";
      },
      sortBykey(ary, key) {
          return ary.sort(function(a, b) {
              let x = a[key]
              let y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
          })
      },
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'leave') {
					this.showleave(this.currRow)
				} else if(command == 'resume') {
					this.resume(this.currRow)
				} else if(command == 'black') {
					this.showblack(this.currRow)
				} else if(command == 'dept') {
					this.showdept(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				} else if(command == 'resetPass') {
					this.resetPassward(this.currRow)
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
			showleave(row) {
				this.frow = row;
				this.leaveVisible = true;
			},
			showblack(row) {
				this.frow = row;
				this.blackVisible = true;
			},
			showdept(row) {
				this.frow = row;
				this.deptVisible = true;
			},
			resume(row) {
				this.$axios.put('/hrs/user/resume/' + row.userId)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}
					}.bind(this));

			},
			findByPage() {
        //从数据库查询设置信息
        let pageName = '组织机构管理/用户管理';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let hrs_user_list_column = response.data.data;
                if(hrs_user_list_column && hrs_user_list_column.length>0){
                    this.tableColumns = this.sortBykey(hrs_user_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
                this.loading = true
                this.$axios.get2("/hrs/user/getUserList?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
                    .then(function(response) {
                        this.data1 = response.data.data.records;
                        this.pageConf.totalPage = response.data.data.total;
                        if(this.data1.length == 0) {
                            let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                            this.findByPage2(current);
                        } else {
                            this.loading = false
                        }
                    }.bind(this));
            }.bind(this));

				/*this.loading = true
				this.$axios.get2("/hrs/user/getUserList?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));*/
			},
			findByPage2(current) {
				this.$axios.get2("/hrs/user/getUserList?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
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
					this.$axios.deletes('/hrs/user/' + row.userId)
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
			exportExcel() {
          this.$confirm('是否根据结果字段导出数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              this.query.columnStrs = JSON.stringify(this.tableColumns)
              this.exportExcelSure()
          }).catch(() => {
              //let excelList = this.sortBykey(columns.info, 'index')
              this.query.columnStrs = '';
              this.exportExcelSure();
          });

			},
      exportExcelSure() {
          if(this.data1.length == 0){
              this.openError("查询结果没有数据，不允许导出");
              return;
          }
          this.$axios.post3('/hrs/user/exportExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '用户列表' + '.xls'; // 下载后文件名
                  document.body.appendChild(downloadElement);
                  downloadElement.click(); // 点击下载
                  document.body.removeChild(downloadElement); // 下载完成移除元素
                  window.URL.revokeObjectURL(href); // 释放掉blob对象
              }.bind(this));
      },
      exportAddressExcel() {
          if(this.data1.length == 0){
              this.openError("查询结果没有数据，不允许导出");
              return;
          }
          this.$axios.post3('/hrs/user/exportAddressExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '通讯录列表' + '.xls'; // 下载后文件名
                  document.body.appendChild(downloadElement);
                  downloadElement.click(); // 点击下载
                  document.body.removeChild(downloadElement); // 下载完成移除元素
                  window.URL.revokeObjectURL(href); // 释放掉blob对象
              }.bind(this));

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
			formatStatus(row, column) {
				return row.userStatus == true ? "生效" : row.userStatus == false ? "失效" : "";
			},
			formatIsFinalProfitunit(row, column) {
				return row.isFinalProfitunit == true ? "是" : row.isFinalProfitunit == false ? "否" : "";
			},
			formatDate(row, column) {
				if(row[column.property]) {
					return(row[column.property]).substr(0, 10)
				} else {
					return ""
				}

			},
			resetPassward(row) {
				this.$confirm('你确定要重置密码么, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/hrs/user/resetPassward/' + row.userId).then((response) => {
						if(response.data.code == 0) {
							this.$notify({
								title: '成功',
								message: '重置成功,请查看您的邮件',
								type: 'success'
							});
						} else {
							this.$notify({
								title: '失败',
								message: '重置失败,原因：' + response.data.messageInfo,
								type: 'error'
							});
						}
					}).catch((error) => {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							this.$notify.error({
								title: '错误',
								message: error.response.data.messageInfo
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			computedSpan() {
				this.cssSpan = window.screen.width == 1360 ? 9 : 8;
				this.fixed = window.screen.width == 1360 ? true : false;
			}
		},

	}
</script>
<style type="text/css">

  .hrsUser .el-input__icon {
    line-height: 30px !important;
  }

  .hrsUser .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsUser .el-input-group__prepend {
    padding: 0 6px;
  }

  .hrsUser .widthFour .el-input-group__prepend {
    padding: 0 13px;
  }

</style>
