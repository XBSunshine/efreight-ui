<template>
	<div class="warp-main">
		<div>
			<el-form :model="query"  class="afAirport-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.apCode" auto-complete="off" @input="query.apCode=query.apCode.toUpperCase()" clearable style="width: 180px;">
                <template slot="prepend">机场代码</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.apNameCn" auto-complete="off" clearable style="width: 360px;">
                <template slot="prepend">机场名称</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.cityNameCn" auto-complete="off" clearable style="width: 180px;">
                <template slot="prepend">城市</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.nationNameCn" auto-complete="off" clearable style="width: 180px;">
                <template slot="prepend">国家</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" @click="queryList" size="small">查询</el-button>
							<el-button style="margin-left: 4px;" v-if="this.permission.sys_base_airport_add.isShow" type="primary" @click="showSave" size="small">新增</el-button>
						</el-form-item>
					</el-col>
					<!--<el-col :span="5" style="text-align: center; margin-right: -12px;">
              <el-button type="primary" @click="queryList" size="medium">查询</el-button>
              <el-button v-if="this.permission.sys_base_airport_add.isShow" type="primary"  @click="showSave" size="medium">新建</el-button>
            </el-col>-->
					<!-- <el-col :span="4">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/afbase/airport/importData"
              :http-request="uploadFile"
              :limit="1"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false">
              <el-button slot="trigger" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传.xlsx/.xls文件，且不超过500kb</div>
            </el-upload>
          </el-col> -->
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>
				<el-table-column label="操作" align="center" fixed width="50" v-if="this.permission.sys_base_airport_edit.isShow">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column fixed prop="apCode" align="center" label="机场代码" width="80"></el-table-column>
				<el-table-column fixed prop="apNameCn" align="left" label="机场中文名称" min-width="250" header-align="center"></el-table-column>
				<el-table-column prop="apNameEn" align="left" label="机场英文名称" min-width="250" header-align="center"></el-table-column>
				<el-table-column prop="cityCode" align="center" label="城市代码" width="70"></el-table-column>
				<el-table-column prop="cityNameCn" align="left" label="城市中文名称" min-width="250" header-align="center"></el-table-column>
				<el-table-column prop="cityNameEn" align="left" label="城市英文名称" min-width="250" header-align="center"></el-table-column>

				<el-table-column prop="nationCode" align="center" label="国家代码" width="70"></el-table-column>
				<el-table-column prop="nationNameCn" align="left" label="国家中文名称" min-width="200" header-align="center"></el-table-column>
				<el-table-column prop="nationNameEn" align="left" label="国家英文名称" min-width="200" header-align="center"></el-table-column>

				<!-- <el-table-column prop="routingGroupName" label="航线分区" width="90"></el-table-column> -->
				<el-table-column prop="routingName" align="center" label="航线" min-width="100"></el-table-column>

				<!--<el-table-column prop="timeZone" align="center" label="时区" width="80"></el-table-column>
				<el-table-column label="坐标" align="center" :formatter="formatStatus2" width="100"></el-table-column>-->
				<!-- <el-table-column prop="apLongitude" label="经度" width="80"></el-table-column>
        <el-table-column prop="apLatitude" label="纬度" width="80"></el-table-column> -->
				<!--<el-table-column prop="apStatus" align="center" label="生效状态" :formatter="formatStatus" width="70"></el-table-column>-->
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="fRow"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :fRow="fRow"></editVisibleTag>

	</div>
</template>
<script>
	import saveVisibleTag from './airport/af_airport_save';
	import editVisibleTag from './airport/af_airport_edit';

	export default {
		data() {
			return {
				loading: false,
				data1: [],
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
				fileList: [],
				query: {
					apCode: '',
					apNameCn: '',
					cityNameCn: '',
					nationNameCn: ''
				},
				saveVisible: false,
				editVisible: false,
				fRow: {},
				permission: {
					sys_base_airport_add: {
						isShow: false
					},
					sys_base_airport_edit: {
						isShow: false
					},
				},
			}
		},
		created: function() {
			this.loadPermission(this.permission);
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
			'saveVisibleTag': saveVisibleTag,
			'editVisibleTag': editVisibleTag
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
			queryList() {
				if(this.query.apCode.trim() || this.query.apNameCn.trim() || this.query.cityNameCn.trim() || this.query.nationNameCn.trim()) {
					let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
						"&apCode=" + this.query.apCode + "&apNameCn=" + this.query.apNameCn +
						"&cityNameCn=" + this.query.cityNameCn + "&nationNameCn=" + this.query.nationNameCn;
					let that = this;
					this.$axios.get('/afbase/airport/page?' + param).then(function(response) {
						that.data1 = response.data.data.records;
						that.pageConf.totalPage = response.data.data.total;
						if(that.data1.length == 0) {
							let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
							that.queryList2(current);
						}
					}).catch(function(error) {
						console.log(error);
					});
				} else {
					this.data1 = [];
					this.pageConf.totalPage = 0;
					// this.openError('请输入查询条件');
					this.$message.error('查询失败，请输入查询条件！');
				}

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&apCode=" + this.query.apCode + "&apNameCn=" + this.query.apNameCn +
					"&cityNameCn=" + this.query.cityNameCn + "&nationNameCn=" + this.query.nationNameCn;
				let that = this;
				this.$axios.get('/afbase/airport/page?' + param).then(function(response) {
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
			formatStatus(row, column) {
				return row.apStatus == true ? "生效" : row.apStatus == false ? "失效" : "";
			},
			formatStatus2(row, column) {
				if(row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}

			},
			// 上传文件
			uploadFile(item) {
				console.log(item)
				const fileObj = item.file

				// FormData 对象
				const form = new FormData()
				// 文件对象
				form.append('file', fileObj)
				form.append('comId', this.comId)
				console.log(JSON.stringify(form))
				// let formTwo = JSON.stringify(form)

				// EnterAPI.iExcel(form).then(response => {
				//   console.log('MediaAPI.upload')
				//   console.log(response)
				//   this.$message.info('文件：' + fileObj.name + '上传成功')
				// })
				this.$axios.post2('/afbase/airport/importData', form)
					.then(function(response) {
						//this.$message.info('文件正在导入请耐心等待' + fileObj.name + '上传成功');
						this.$message.info('文件正在导入请耐心等待');
					}.bind(this)).catch(function(error) {

					}.bind(this));
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			showSave() {
				this.saveVisible = true;
			},
			handleCommand(command) {
				if("edit" == command) {
					this.editVisible = true;
				}
			},
			handleChange(row) {
				this.fRow = row;
			}
		}
	}
</script>
<style type="text/css">

  .afAirport-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afAirport-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afAirport-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
