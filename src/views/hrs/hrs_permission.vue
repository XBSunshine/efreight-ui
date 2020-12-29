<template>
	<div class="warp-main">
		<el-row v-loading="loading" element-loading-text="拼命加载中">
			<el-col  class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" label-width="120px" class="demo-ruleForm">
					<el-row>
						<el-form-item class="pull-right">
							<el-button type="primary" size="small" v-on:click="showsave">新增模块</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-col>
		</el-row>
		<el-table :data="data1" style="width: 100%;margin-bottom: 20px;" row-key="id" :expand-row-keys="expandRowKeys" border :tree-props="{children: 'children'}">
			<el-table-column label="操作" width="60" fixed="left" align="center" type="index">
				<template slot-scope="scope">
					<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="savechild">新建</el-dropdown-item>
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
							<!--<el-dropdown-item command="delete">删除</el-dropdown-item>-->
              <el-dropdown-item command="allocation">分发权限</el-dropdown-item>
              <el-dropdown-item command="recycle">收回权限</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称" width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled1=='true' && scope.row.adminDefault=='true'" style="color:red"><s>{{ formatter33(scope.row) }}</s></span>
          <span v-if="scope.row.disabled1=='true' && scope.row.adminDefault=='false'" style="color:red"><s>{{ formatter33(scope.row) }}</s></span>
          <span v-if="scope.row.disabled1=='false' && scope.row.adminDefault=='true'" style="color:blue">{{ formatter33(scope.row) }}</span>
          <span v-if="scope.row.disabled1=='false' && scope.row.adminDefault=='false'">{{ formatter33(scope.row) }}</span>
        </template>
			</el-table-column>
			<el-table-column prop="path" label="Path" width="250">
			</el-table-column>
			<el-table-column prop="url" label="URL" width="250">
			</el-table-column>
			<el-table-column prop="code" label="权限" width="250">
			</el-table-column>
			<el-table-column prop="sort" label="排序号" width="60">
			</el-table-column>
      <el-table-column></el-table-column>
		</el-table>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
		<savechildVisibleTag ref="addMission" v-if="savechildVisible" :visible.sync="savechildVisible" :frow="frow"></savechildVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
    <allocationTag ref="addMission" v-if="allocationVisible" :visible.sync="allocationVisible" :frow="frow"></allocationTag>
    <recycleTag ref="addMission" v-if="recycleVisible" :visible.sync="recycleVisible" :frow="frow"></recycleTag>
	</div>
</template>
<script>
	import saveVisibleVue from './permission/hrs_permission_save'
	import savechildVisibleVue from './permission/hrs_permission_savechild'
	import editVisibleVue from './permission/hrs_permission_edit'
  import allocationVue from './permission/hrs_permission_allocation'
  import recycleVue from './permission/hrs_permission_recycle'
	export default {
		data() {
			return {

				/*表数据*/
				data1: [],
				expandRowKeys: [],
				loading: false,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 130], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					coop_name: '',
					business_scope: '',
					agreement_type: '',
					begin_date: '',
					end_date: '',
					serial_number: '',
					signing_dept_name: '',
					incharge_name: '',
					agreement_status: '',
					org_id: '',
					dept_id: ''
				},
				saveVisible: false,
				savechildVisible: false,
				editVisible: false,
        allocationVisible: false,
        recycleVisible: false,
				frow: {},
				currRow: ''
			}
		},
		mounted() {

		},
		components: {
			'saveVisibleTag': saveVisibleVue,
			'savechildVisibleTag': savechildVisibleVue,
			'editVisibleTag': editVisibleVue,
      'allocationTag': allocationVue,
      "recycleTag": recycleVue
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
      formatter33(row, column) {
          return row.name;
      },
			showsave() {
				this.saveVisible = true;
			},
			showsavechild(row) {
				this.frow = row;
				this.savechildVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			findByPage() {
				let params = {

				}
				this.$axios.get('/hrs/permission/tree', params)
					.then((response) => {
						this.data1 = response.data.data;
						this.data1.forEach((row) => {
							if(row.parentId === -1) {
								this.expandRowKeys.push(row.id + '')
							}
						})
					});
			},
			doDelete(row) {

				this.$axios.deletes('/hrs/permission/' + row.id)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
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
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'savechild') {
					this.showsavechild(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				} else if(command == "allocation"){
				  this.allocation(this.currRow);
        } else if(command == "recycle"){
          this.recycle(this.currRow);
        }
			},

      allocation(currRow) {
        this.frow = currRow;
        this.allocationVisible = true;
      },
      recycle(currRow) {
        this.frow = currRow;
        this.recycleVisible  = true;
      }
    },
		created() {
			this.findByPage();
		}
	}
</script>
