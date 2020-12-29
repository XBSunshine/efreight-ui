<template>
  <el-dialog style="top:-80px;" title="附件 - 协作传输" width="800px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
        <el-table ref="multipleTable"  :data="data" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55"></el-table-column>
         <el-table-column prop="fileType" label="附件类型" width="100" align="center"></el-table-column>
         <el-table-column prop="createTime" label="上传日期" width="120" align="center"></el-table-column>
         <el-table-column align="center" label="是否对外显示" width="100">
         	<template slot-scope="scope">
         		<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isDisplay=='1'"></i>
         	</template>
         </el-table-column>
         <el-table-column label="文件名称" width="300" align="left" header-align="center">
         	<template slot-scope="scope">
         		<span style="cursor: pointer;" @click="orderFileView(scope.row)">{{scope.row.fileName}}</span>
         	</template>
         </el-table-column>
         <el-table-column prop="fileRemark" label="备注" align="left" header-align="center"></el-table-column>
        </el-table>
	</div>
  <div style="margin-top: 20px">
      <el-button type="primary" @click="sure()">确定</el-button>
   </div>
  	</el-dialog>
</template>
<style>
	.el-table .warning-row2 {
		background: oldlace;
		color: #409EFF;
		font-weight: bold !important;
	}

	.el-table .warning-row1 {
		background: oldlace;
		font-weight: bold !important;
	}

	.el-table .warning-row0 {
		color: #409EFF;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}
</style>
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
        data: [],
        multipleSelection: []
			};
		},
		inject: ['shareFiles'],
		methods: {
      sure(){
        let id=[];
        if(this.multipleSelection.length>0){
          this.multipleSelection.forEach(team=>{
              id.push(team.orderFileId);
          });
        }
         this.shareFiles(id)
         this.handleClose();
      },
		  handleSelectionChange(val) {
		        this.multipleSelection = val;
		  },
			queryOrderFiles() {
				let params = {
					orderId: this.frow.orderId,
					businessScope: this.frow.businessScope,
          isDisplay:1
				}
				this.$axios.post2("/afbase/orderFiles/getListByWhere", params)
					.then((response) => {
						if (response.data.code == '0') {
							this.data = response.data.data
						} else {
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
					});
			},
			orderFileView(row) {
				window.open(row.fileUrl)
			},
      // 关闭
      handleClose() {
      	this.$emit('update:visible', false);
      }
		},
		created() {
			//查询订单附件
			this.queryOrderFiles()
		},
		mounted: function() {
			// this.$axios.get('/hrs/org/getUpToken')
			// 	.then(function(response) {
			// 		this.inbound.token = response.data.data;
			// 	}.bind(this));
		}
	}
</script>
