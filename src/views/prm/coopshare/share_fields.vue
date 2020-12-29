<template>
	<div class="warp-main">
    <el-dialog title="协作公司-绑定设置" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<div ref="af_debit_note_bill_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:200px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope"  :disabled="true" style="width:131px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
			<el-table
			    :data="tableData"
			    style="width: 100%;margin-bottom: 20px;"
			    row-key="code"
			    border
			    default-expand-all
			    :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @header-click='checkAll'>
			    <el-table-column prop="name" label="数据项" width="180"></el-table-column>
			    <el-table-column prop="isShare" label="分享" align="center" width="180">
             <template slot-scope="scope">
                <input type="checkbox"  @click='shareChange(scope.row)' :checked="scope.row.isShare==1?true:false" ></input>
             </template>
          </el-table-column>
			    <el-table-column prop="isSubscribe" align="center" label="订阅">
            <!-- <el-checkbox :checked="scope.row.isSubscribe==1?false:true"></el-checkbox> -->
            <template slot-scope="scope">
            <input type="checkbox"   @click='subscribeChange(scope.row)' :checked="scope.row.isSubscribe==1?true:false"></input>
           </template>
          </el-table-column>
			  </el-table>

		<!-- <div ref="af_debit_note_bill_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div> -->
    <el-button type="primary" size="small" @click="submitBut" >保存</el-button>
    <el-button type="primary" size="small" @click="handleClose" >取消</el-button>
  </el-dialog>
	</div>
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
        hasChildren:true,
        tableData: [],
        businessCodes:[{
          paramRanking:'AE',
          paramText:'AE',
        }],
        checkAllFlag:false,
				query: {
					businessScope: 'AE',
          subList:[],
          coopId:this.frow.coopId
				}

			}
		},
		created: function() {
       this.queryList();

		},
		mounted() {
		},

		methods: {
      checkAll(column, event){
         this.checkAllFlag = !this.checkAllFlag;
         if(this.tableData&&this.tableData.length>0){
           this.tableData.forEach(a=>{
            if(this.checkAllFlag && column.label=='分享'){
               a.isShare = 1;
            }
            if(!this.checkAllFlag&&column.label=='分享'){
               a.isShare = 0;
            }
            if(this.checkAllFlag&&column.label=='订阅'){
               a.isSubscribe = 1;
            }
            if(!this.checkAllFlag&&column.label=='订阅'){
               a.isSubscribe = 0;
            }
            if(a.children&&a.children.length>0){
              a.children.forEach(b=>{
                  if(this.checkAllFlag&&column.label=='分享'){
                     b.isShare = 1;
                  }
                  if(!this.checkAllFlag&&column.label=='分享'){
                     b.isShare = 0;
                  }
                  if(this.checkAllFlag&&column.label=='订阅'){
                     b.isSubscribe = 1;
                  }
                  if(!this.checkAllFlag&&column.label=='订阅'){
                     b.isSubscribe = 0;
                  }
              });
            }
           });
         }
      },

      handleClose() {
        this.$emit('update:visible', false);
      },
      queryList(){
        //查询请求的ORG信息
        this.$axios.get('/prm/coopShare/sharefields/'+this.query.businessScope+'/'+ this.frow.coopId).then((response) => {
            // if(response.data.data.length > 0) {
                this.tableData = response.data.data;
            // }
        }).catch((error) => {
            console.log(error);
        });
      },
      //订阅
      subscribeChange(row){
          if(row.pcode){
              //子集
              if(row.isSubscribe==1){
                 row.isSubscribe = 0;
              }else{
                 row.isSubscribe = 1;
              }
              this.tableData.forEach(a=>{
                let flag = false;
                 if(a.code==row.pcode){
                   //逻辑如果选中 把父节点选中  如果取消 判断父节点 是否有子节点 如果有不动，如果没有 取消父节点
                   if(row.isSubscribe==1){
                      a.isSubscribe=1;
                      return false;
                   }else{
                     if(a.children.length>0){
                        a.children.forEach(b=>{
                           if(b.code!=row.code&&b.isSubscribe==1){
                             flag = true;
                             return false;
                           }
                        });
                     }
                     if(!flag){
                       a.isSubscribe=0;
                     }
                   }

                 }
              });
          }else{
              //父级
              if(row.isSubscribe==1){
                 row.isSubscribe = 0;
              }else{
                 row.isSubscribe = 1;
              }
                this.tableData.forEach(a=>{
                   if(a.code==row.code){
                     if(a.children.length>0){
                        a.children.forEach(b=>{
                           b.isSubscribe = row.isSubscribe;
                        });
                     }
                   }
                });
          }
      },
      //分享
      shareChange(row){
         if(row.pcode){
             //子集
             if(row.isShare==1){
                row.isShare = 0;
             }else{
                row.isShare = 1;
             }
             this.tableData.forEach(a=>{
               let flag = false;
                if(a.code==row.pcode){
                  //逻辑如果选中 把父节点选中  如果取消 判断父节点 是否有子节点 如果有不动，如果没有 取消父节点
                  if(row.isShare==1){
                     a.isShare=1;
                     return false;
                  }else{
                    if(a.children.length>0){
                       a.children.forEach(b=>{
                          if(b.code!=row.code&&b.isShare==1){
                            flag = true;
                            return false;
                          }
                       });
                    }
                    if(!flag){
                      a.isShare=0;
                    }
                  }

                }
             });
         }else{
             //父级
             if(row.isShare==1){
                row.isShare = 0;
             }else{
                row.isShare = 1;
             }
               this.tableData.forEach(a=>{
                  if(a.code==row.code){
                    if(a.children.length>0){
                       a.children.forEach(b=>{
                          b.isShare = row.isShare;
                       });
                    }
                  }
               });
         }
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
                message: '操作成功',
                type: 'success',
                position: 'bottom-right'
            });
        },
      submitBut(){
         this.tableData.forEach(a=>{
            if(a.isShare==1||a.isSubscribe==1){
              let aJson = {
                name:a.name,
                isShare:a.isShare,
                isSubscribe:a.isSubscribe
              }
              this.query.subList.push(aJson);
              if(a.children.length>0){
                 a.children.forEach(b=>{
                    if(b.isShare==1||b.isSubscribe==1){
                      let bJson = {
                        name:b.name,
                        isShare:b.isShare,
                        isSubscribe:b.isSubscribe
                      }
                      this.query.subList.push(bJson);
                    }
                 });
              }
            }
         });
         this.$axios.post2('/prm/coopShare/saveShareFields', this.query)
           .then(function(response){
             if(0 == response.data.code){
                this.openSuccess();
                this.query.subList=[];
                this.handleClose();
             }else{
               this.openError(response.data.messageInfo || "保存失败");
               this.query.subList=[];
             }
           }.bind(this))
           .catch(function(){
             this.query.subList=[];
             this.openError("保存失败，请稍后再试");
           }.bind(this))

      }

   }
  }
</script>
<style type="text/css">
	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

</style>
