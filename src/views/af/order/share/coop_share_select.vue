<template>
	<el-dialog title="协作公司 - 选择" width="750px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose"  show-close>
		<div class="customerSelectPage">
			<el-form :inline="false" :model="query" class="demo-ruleForm">

				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.coopName" @input="query.coopName=toUpperCaseValue(query.coopName)" clearable auto-complete="off" style="width: 250px;">
								<template slot="prepend">
									<span>客户</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" size="small" icon="el-icon-search" @click="queryList">搜索</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table border :data="data1">
				<el-table-column prop="coopCode" label="代码" width="100" align="center"></el-table-column>
				<el-table-column prop="coopName" label="客户名称" header-align="center"></el-table-column>
        <el-table-column prop="isShare" label="协作公司" width="70" align="center">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isShare==1"></i>
          </template>
        </el-table-column>
        <el-table-column  prop="coopOrgId" label="是否绑定" width="70" align="center">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.coopOrgId!=null"></i>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="绑定公司" width="200"></el-table-column>
				<el-table-column fixed label="操作" width="60" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doSelect(scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-bottom: 10px;">
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
					coopName: ''
				},
				saveVisible: false
			}
		},

		inject: ['setShareValue'],
		created: function() {

			this.queryList();
		},

		methods: {
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
      openErrorTwo(info) {
      	this.$notify({
      		title: '',
      		message:info,
      		type: 'error',
      		position: 'bottom-right'
      	});
      },
			doSelect(rrow) {
        if(!rrow.shareOrgId){
          let row = this.frow;
          row.coopId = rrow.coopId;
          row.coopName = rrow.coopName;
          row.coopOrgId = rrow.shareOrgId;
          row.coopOrgCoopId = rrow.shareCoopId
          this.setShareValue(row);
          this.handleClose();
        }else{
          //检查 是否已经正常接收了此订单数据  是的话不能在此分享
          this.$axios.get2('/afbase/afOrderShare/afOrderShare/'+this.frow.orderId+'/'+rrow.coopId+'/'+rrow.shareOrgId).then((response)=> {
            if(response.data.data){
              //A创建订单1 协作给>B， 创建订单2， B又把2订单 协作给->A 创建了订单3,
              //协作的订单，不得再次协作给 协作过的签约公司；
              let orgIdOper = window.localStorage.getItem('orgId');
              this.$axios.get2('/afbase/afOrderShare/afOrderShareInfo/'+orgIdOper+'/'+rrow.coopId+'/'+this.frow.orderId+'/in').then((response)=> {
                if(response.data.data!=null&&response.data.data.orderShareId){
                   this.openErrorTwo('协作的订单，不得再次协作给 协作过的签约公司');
                   return false;
                }else{
                  let row = this.frow;
                  row.coopId = rrow.coopId;
                  row.coopName = rrow.coopName;
                  row.coopOrgId = rrow.shareOrgId;
                  row.coopOrgCoopId = rrow.shareCoopId
                  this.setShareValue(row);
                  this.handleClose();
               }
              }).catch((error)=> {
                console.log(error);
              });
              // console.log(this.frow);
            }else{
               this.openErrorTwo(rrow.coopName+'已经正常接收了此订单数据，无法再次分享');
            }
          }).catch((error)=> {
          	console.log(error);
          });
        }
			},
			queryList() {
				this.$axios.get2('/afbase/afOrderShare/page/coopList?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, {
					coopName:this.query.coopName
				}).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if (this.data1.length == 0) {
						let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						this.queryList2(current);
					}
				}).catch((error)=> {
					console.log(error);
				});

			},
			queryList2(current) {
				this.$axios.get2('/afbase/afOrderShare/page/coopList?size=' + this.pageConf.pageSize + '&current=' + current, {
					coopName:this.query.coopName
				}).then((response)=> {
					this.data1 = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
				}).catch((error)=> {
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
				if (row.apLongitude && row.apLatitude) {
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
	.customerSelectPage .el-form-item__content {
		line-height: 30px !important;
	}
</style>
