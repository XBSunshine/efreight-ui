<template>
	<div class="warp-main">
		<div class="sc-port-maintenance">
			<el-form :inline="true" :model="query" class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:185px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:119px;margin-right: -5px;" @change="businessScopeChange">
									<el-option v-for="item in businessScopeList" :key="item.edicode1" :label="item.edicode1" :value="item.edicode1">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				<!-- 	<el-col class="elementWidth">
						<el-form-item label-width="15px">
							<el-input v-model="query.warehouseCode" @input="query.warehouseCode = query.warehouseCode.toUpperCase()"  auto-complete="off" clearable style="width:280px;">
								<template slot="prepend">堆场/仓库代码</template>
							</el-input>
						</el-form-item>
					</el-col> -->
         <el-col class="elementWidth">
         	<el-form-item label-width="15px">
         		<el-input v-model="query.warehouseNameCn" @input="query.warehouseNameCn = query.warehouseNameCn.toUpperCase()"  auto-complete="off" clearable style="width:280px;">
         			<template slot="prepend">堆场/仓库</template>
         		</el-input>
         	</el-form-item>
         </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="20px">
              <el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" >新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data" border>
        <el-table-column fixed="left" align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
			  <el-table-column prop="businessScope" align="left" label="业务范畴" width="120"></el-table-column>
        <el-table-column prop="portNameEn" align="left" label="港口英文名称" width="300"></el-table-column>
		    <el-table-column prop="warehouseCode" align="left" label="堆场/仓库代码" width="120"></el-table-column>
        <el-table-column prop="warehouseNameCn" align="left" label="堆场/仓库名称" width="300"></el-table-column>
        <el-table-column prop="customsSupervision" align="left" label="堆场类型" width="120"></el-table-column>
        <el-table-column prop="customsCode" align="left" label="海关编码" width="120"></el-table-column>
        <el-table-column prop="operateName" align="left" label="操作人" width="300" :formatter="operateName"></el-table-column>
        <el-table-column prop="operateTime" align="left" label="操作时间" width="200"></el-table-column>

      </el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    <sc-warehouse-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></sc-warehouse-save>
     <sc-warehouse-edit nce-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></sc-warehouse-edit>
	</div>
</template>
<script>
  import ScWarehouseSave from './warehouse/sc_warehouse_save.vue';
  import ScWarehouseEdit from './warehouse/sc_warehouse_edit.vue';

	export default {
	  components: {
	    'sc-warehouse-save': ScWarehouseSave,
      'sc-warehouse-edit': ScWarehouseEdit,
    },
		data() {
			return {
				loading: false,
				addButtonFlag:true,
				data: [],
        businessScopeList: [],
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
				frow: {},
				query: {
					businessScope: 'SE',
					warehouseCode: '',
          warehouseNameCn:'',
				},
        saveVisible: false,
        editVisible: false,
			}
		},
		created: function() {
      //业务范畴
      this.$axios.get('/sc/vScCategory/业务范畴').then(function(response) {
      	this.businessScopeList = response.data.data;
      }.bind(this));
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		methods: {
      operateName(row, column){
        return row.operateName.split(" ")[0];
      },openSuccess() {
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
			handleChange(row) {
				this.frow = row;
				this.currRow = row;
			},
			showsave() {
        this.frow.businessScope = this.query.businessScope;
				this.saveVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			queryList() {

			  this.loading = true;
				this.$axios.get2("/sc/scWarehouse/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if(this.data1.length == 0) {
						let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						that.queryList2(current);
					}else{
				     	this.loading = false;
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			queryList2(current) {
				this.$axios.get2("/sc/scWarehouse/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query).then((response)=> {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
					console.log(error);
				});
			},
      deleteW(row){
        this.$confirm('你确定要删除么？', '提示', {
        	distinguishCancelAndClose: true,
        	cancelButtonText: '否',
        	confirmButtonText: '是',
        	type: 'warning',
        	center: true
        }).then(() => {
           let param = {
              warehouseId:row.warehouseId
           }
            this.$axios.post2('/sc/scWarehouse/delete', param)
            	.then(function(response) {
            		if (response.data.code == 0) {
            			this.openSuccess();
            			this.queryList();
            		} else {
            			this.openError(response.data.messageInfo);
            		}
            	}.bind(this)).catch(function(error) {
            		let errorinfo = error.response.data.messageInfo;
            		//唯一性错误
            		this.openError(errorinfo);
            	}.bind(this));
        }).catch(() => {

				})
      },
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
      handleCommand(command) {
        if("edit" == command) {
          this.showedit(this.currRow)
        }else if("delete" == command){
          this.deleteW(this.currRow)
        }
      },
      businessScopeChange() {
      	this.data = [];
      },
		}
	}
</script>
<style>
  .sc-port-maintenance {
    margin-left: 10px;
  }
  .sc-port-maintenance .el-form-item__content {
		line-height: 30px !important;
	}
  .sc-port-maintenance .el-input-group__prepend{
    width: 66px;
    text-align: center;
    padding: unset;
  }
  .sc-port-maintenance .el-input__icon {
    line-height: 30px !important;
  }

</style>
