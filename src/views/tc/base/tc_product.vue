<template>
	<div class="warp-main">
		<div class="tc_product">
			<el-form :inline="false" :model="query" label-width="10px">
				<el-row>
          <el-col class="elementWidth">
          	<el-form-item>
          		<el-input style="width:160px;">
          			<template slot="prepend"><font style="color: red;">*</font>业务范畴</template>
          			<el-select slot="suffix" v-model="query.businessScope" disabled placeholder="请选择" style="width:94px;margin-right: -5px;">
                  <el-option label="TE" value="TE"></el-option>
          			</el-select>
          		</el-input>
          	</el-form-item>
          </el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:160px;">
								<template slot="prepend">产品类型</template>
								<el-select slot="suffix" v-model="query.productType" placeholder="请选择" style="width:94px;margin-right: -5px;" >
					        <el-option  v-for="item in productTypes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.productName"  auto-complete="off" clearable style="width:300px;">
								<template slot="prepend">产品名称</template>
							</el-input>
						</el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.bookingAgentName"  auto-complete="off" clearable style="width:200px;">
                <template slot="prepend">订舱代理</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="20px">
              <el-button type="text" size="small" v-if="showFlag" v-on:click="showFlag=false">收起</el-button>
              <el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlag=true">展开</el-button>
              <el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" >新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="showFlag">
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input v-model="query.departureStation" @input="query.departureStation=query.departureStation.toUpperCase()" auto-complete="off" clearable style="width:200px;">
              <template slot="prepend">起运地</template>
              <!-- @input="query.departureStation = query.departureStation.toUpperCase()" -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input v-model="query.exitPort" @input="query.exitPort=query.exitPort.toUpperCase()" auto-complete="off" clearable style="width:200px;">
              <template slot="prepend">出境口岸</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input v-model="query.transitStation"  @input="query.transitStation=query.transitStation.toUpperCase()" auto-complete="off" clearable style="width:219px;">
              <template slot="prepend">中转地</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input v-model="query.arrivalStation"  @input="query.arrivalStation=query.arrivalStation.toUpperCase()" auto-complete="off" clearable style="width:200px;">
              <template slot="prepend">目的地</template>
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border>
        <el-table-column fixed="left" align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <!-- v-if="permission.sc_port_maintenance_edit.isShow" -->
                <el-dropdown-item command="edit" >编辑</el-dropdown-item>
                <el-dropdown-item command="delete" >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
				<el-table-column prop="businessScope" align="center" label="业务范畴" width="80"></el-table-column>
				<el-table-column prop="productName" align="left" label="产品名称" width="300"></el-table-column>
        <el-table-column prop="bookingAgentName" align="left" label="订舱代理" width="300"></el-table-column>
		    <el-table-column prop="productType" align="center" label="产品类型" width="120"></el-table-column>
        <el-table-column prop="containerMethod" align="center" label="装箱方式" width="100"></el-table-column>

        <el-table-column prop="departureStation" align="center" label="起运地" width="80"></el-table-column>
        <el-table-column prop="exitPort" align="center" label="出境口岸" width="80"></el-table-column>
        <el-table-column prop="transitStation" align="center" label="中转地" width="80"></el-table-column>
        <el-table-column prop="arrivalStation" align="center" label="目的地" width="80"></el-table-column>
        <el-table-column prop="transitDays" align="center" label="转运天数" width="120"></el-table-column>

        <el-table-column prop="freightPrice" align="center" label="默认卖价" width="200">
          <template slot-scope="scope">
          	 <span v-if="scope.row.freightPrice!=null">{{scope.row.freightType}}:{{scope.row.freightPrice}} (<span v-if="scope.row.freightCurrecnyCode!='CNY'" style="color: red;">{{scope.row.freightCurrecnyCode}}</span>
          	<span v-else>{{scope.row.freightCurrecnyCode}}</span>)</span>
            <span else></span>
          </template>
        </el-table-column>
        <el-table-column prop="msrPrice" align="center" label="默认成本" width="200">
          <template slot-scope="scope">
          	<span v-if="scope.row.msrPrice!=null">{{scope.row.msrType}}:{{scope.row.msrPrice}} (<span v-if="scope.row.msrCurrecnyCode!='CNY'" style="color: red;">{{scope.row.msrCurrecnyCode}}</span>
          	<span v-else>{{scope.row.msrCurrecnyCode}}</span>)</span>
            <span else></span>
          </template>
        </el-table-column>

      </el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
    <tc-product-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></tc-product-save>
    <tc-product-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></tc-product-edit>
	</div>
</template>
<script>
  import Save from './product/tc_product_save';
  import Edit from './product/tc_product_edit';

	export default {
	  components: {
	    'tc-product-save': Save,
      'tc-product-edit': Edit,
    },
		data() {
			return {
				loading: false,
				addButtonFlag:true,
        showFlag:false,
				data1: [],
        productTypes:[],
				options: [],
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
				frow: {},
				query: {
					businessScope: 'TE',
					productType: '',
          productName:'',
          bookingAgentName: '',
          departureStation: '',
          exitPort:'',
          transitStation:'',
          arrivalStation:''
				},
        saveVisible: false,
        editVisible: false,
        // permission: {
        //   sc_port_maintenance_save: {
        //     isShow: false,
        //   },
        //   sc_port_maintenance_edit: {
        //     isShow: false,
        //   },
        // }
			}
		},
		created: function() {
	    // this.loadPermission(this.permission);
      this.$axios.get('/sc/tcCategory/产品类型').then((response) => {
      this.productTypes = response.data.data;
      })
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		methods: {
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
        this.frow.businessScope = this.query.businessScope;
				this.editVisible = true;
			},
			queryList() {
        if(!this.query.businessScope){
            this.openError("业务范畴不能为空");
            return false;
        }
			  this.loading = true;
				this.$axios.get2("/sc/tcProduct/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query).then((response)=> {
					this.data1 = response.data.data.records;
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
				this.$axios.get2("/sc/tcProduct/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
					console.log(error);
				});
			},
      deleteProduct(row){
          this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$axios.deletes('/sc/tcProduct/' + row.productId)
              .then(function(response) {
                if(response.data.code == 0) {
                  this.openSuccess();
                  this.queryList();
                } else {
                  this.openError(response.data.messageInfo || "未知错误");
                }
              }.bind(this));
          }).catch(() => {
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
      handleCommand(command) {
        if("edit" == command) {
          this.showedit(this.currRow)
        }else{
           this.deleteProduct(this.currRow)
        }
      },
		}
	}
</script>
<style>
  .tc_product {
    margin-left: 10px;
  }
  .tc_product .el-form-item__content {
		line-height: 30px !important;
	}
  .tc_product .el-input-group__prepend{
    width: 66px;
    text-align: center;
    padding: unset;
  }
  .tc_product .el-input__icon {
    line-height: 30px !important;
  }

</style>
