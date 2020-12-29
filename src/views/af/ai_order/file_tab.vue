<template>
	<div>
		<el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="uploadOrderFiles" v-if="viewFlag">附件上传</el-button>
		<el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="uploadBatchOrderFiles" v-if="viewFlag">批量上传</el-button>
    <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="shareOrderFiles" v-if="shareFlag">协作传输</el-button>
		<div>
			<el-table v-loading="orderFiles.loading" :data="orderFiles.data" border>
				<el-table-column align="center" label="操作" width="60" type="index" v-if="viewFlag">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item></el-dropdown-item>
								<el-dropdown-item command="delete" v-if="">删除</el-dropdown-item>
								<el-dropdown-item command="showFile" v-if="scope.row.isDisplay=='0'">显示</el-dropdown-item>
								<el-dropdown-item command="unShowFile" v-if="scope.row.isDisplay=='1'">不显示</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column prop="fileType" label="附件类型" width="100" align="center"></el-table-column>
				<el-table-column prop="createTime" label="上传日期" width="120" align="center"></el-table-column>
				<el-table-column align="center" label="是否对外显示" width="100">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isDisplay=='1'"></i>
					</template>
				</el-table-column>
				<el-table-column label="文件名称" width="380" align="left" header-align="center">
					<template slot-scope="scope">
						<span style="cursor: pointer;" @click="orderFileView(scope.row)">{{scope.row.fileName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="fileRemark" label="备注" align="left" header-align="center"></el-table-column>
			</el-table>
			<orderFilesSave ref="addMission" v-if="orderFiles.saveVisible" :visible.sync="orderFiles.saveVisible" :frow="orderFiles.frow"></orderFilesSave>
			<batchOrderFilesSave ref="addMission" v-if="orderFiles.saveBatchVisible" :visible.sync="orderFiles.saveBatchVisible" :frow="orderFiles.frow"></batchOrderFilesSave>
      <shareOrderFiles ref="addMission" v-if="shareVisible" :visible.sync="shareVisible" :frow="orderFiles.frow"></shareOrderFiles>
		</div>
	</div>
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
	//订单附件
	import OrderFilesSave from '../order/orderFiles/af_order_file_save'
	import BatchOrderFilesSave from '../order/orderFiles/af_order_file_batch_save'
  import ShareOrderFiles from '@/views/af/order/share/share_files'

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
        shareFlag:false,
        shareVisible:false,
				helpDocumentUrl: '',
				firstUrl: '',
				fourthUrl: '',
				secondUrl: '',
				fifthUrl: '',
				viewFlag: true,
				finishButtonFlag: false,
				cancelButtonFlag: false,
				editButtonFlag: false,
				editButtonFlag2: false,
				letterButtonFlag: false,
				letterButtonFlag2: false,
				servicesButtonFlag: false,
				weighttagButtonFlag: false,
				weighttagButtonFlag2: false,
				logtagButtonFlag: false,
				activeName: 'first',
				currRow: '',
				currRow2: '',
				data1: [],
				options2: [],
				selections: [],
				contactsOptions: [],
				useroptions: [],
				productOptions: [],
				transitClauseOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				arrivalMethodOptions: [],
				customsDeclaresTypeOptions: [],
				cargoFlowTypeOptions: [],
				departureWarehouseOptions: [],
				departureStorehouseOptions: [],
				packageTypeOptions: [],
				paymentMethodOptions: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions: [],
				codeOptions: [],
				showFlag1: false,
				showFlag2: false,
				showFlag3: false,
				checkFlag1: false,
				checkFlag2: false,
				checkFlag3: false,
				checkFlag4: false,
				shipperConsignee2: false,
				showFlagConAndShipper: false,
				save: false,
				save2: false,
				saveawb: false,
				saveIncome: false,
				editIncome: false,
				billIncome: false,
				billEditIncome: false,
				orderDate: false,
				billSelectIncome: false,
				saveCost: false,
				editCost: false,
				printVisible: false,
				printMoreVisible: false,
				operationMore: false,
				billSendVisible: false,
				selectSendOrPrint: false,
				billSendListVisible: false,
				editVisible: false,
				disabledFlag: false,
				priceValueFlag: false,
				disabledFlag2: false,
				disabledFlag3: false,
				letterFlag: true,
				ffrow: {
					selections: [],
					awbFromType: ''
				},
				planVolume1: '',

				//inbound---出重开始-----
				inbound: {
					loading: false,
					buttonLoading: false,
					data: [],
					sizeVisible: false,
					uploadViewVisible: false,
					uploadVisible: false,
					ffrow: '',
					actionPath: 'http://up-z1.qiniu.com',
					accept: "image/jpeg,image/gif,image/png,image/bmp",
					token: '',
					currRow: '',
					ifInbound: false,
					inboundAfterFlag: false,
					inboundButtonFlag: false,
					deleteInboundButtonFlag: false
				},
				//inbound---出重结束-----
				//附件开始-----
				orderFiles: {
					saveVisible: false,
					saveBatchVisible: false,
					frow: {},
					data: [],
					loading: false
				}
				//附件结束-----
			};
		},
		inject: ['findByPage'],
		components: {
			'orderFilesSave': OrderFilesSave,
			'batchOrderFilesSave': BatchOrderFilesSave,
      'shareOrderFiles' : ShareOrderFiles
		},
		provide() {
			return {
				queryOrderFiles: this.queryOrderFiles,
				showSelectSendOrPrint: this.showSelectSendOrPrint,
        shareFiles:this.shareFiles,
			}
		},
		methods: {
      shareOrderFiles(){
        this.orderFiles.frow.orderId = this.frow.orderId;
        this.orderFiles.frow.businessScope = this.frow.businessScope;
        this.shareVisible = true;
      },
      shareFiles(array){
        //协议传输
        if(array.length>0){
          let param = {
            orderId:this.frow.orderId,
           listOrderFilesId:array
          }
          this.$axios.post2('/afbase/afOrderShare/shareOrderFiles', param).then(function(response){
             if(0 == response.data.code){
               this.inboundSuccess('协作传输成功');
             }else{
               this.openError(response.data.messageInfo || "协作传输失败");
             }
           }.bind(this)).catch(function(){
             this.openError("协作传输失败，请稍后再试");
           }.bind(this))

        }
      },
			handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'delete') {
					this.deleteOrderFiles(this.currRow)
				} else if (command == 'showFile') {
					this.showFile(this.currRow)
				} else if (command == 'unShowFile') {
					this.unShowFile(this.currRow)
				}
			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			inboundSuccess(info) {
				this.$notify({
					title: '',
					message: info,
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


			//订单附件
			uploadOrderFiles() {
				this.orderFiles.frow = this.frow
				this.orderFiles.saveVisible = true
			},
			uploadBatchOrderFiles() {
				this.orderFiles.frow = this.frow
				this.orderFiles.saveBatchVisible = true
			},
			deleteOrderFiles(row) {
				this.$prompt('您将删除' + row.fileName + '附件,此操作不可恢复 , 是否继续?', '提示', {
					showInput: false,
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: 'warn',
					center: true
				}).then(() => {
					let params = {
						orderFileId: row.orderFileId,
						businessScope: row.businessScope
					}
					this.$axios.post2('/afbase/orderFiles/doDelete', params).then((response) => {
						if (response.data.code == '0') {
							this.openSuccess("删除成功！")
							this.queryOrderFiles();
						} else {
							this.openError("删除失败：" + response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError("删除失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			showFile(row) {
				let params = {
					orderFileId: row.orderFileId,
					businessScope: row.businessScope,
					isDisplay: 1
				}
				this.$axios.post2('/afbase/orderFiles/showFile', params).then((response) => {
					if (response.data.code == '0') {
						this.openSuccess("更新成功！")
						this.queryOrderFiles();
					} else {
						this.openError("更新失败：" + response.data.messageInfo)
					}
				}).catch((error) => {
					this.openError("更新失败：" + error.response.data.messageInfo)
				});

			},
			unShowFile(row) {
				let params = {
					orderFileId: row.orderFileId,
					businessScope: row.businessScope,
					isDisplay: 0
				}
				this.$axios.post2('/afbase/orderFiles/showFile', params).then((response) => {
					if (response.data.code == '0') {
						this.openSuccess("更新成功！")
						this.queryOrderFiles();
					} else {
						this.openError("更新失败：" + response.data.messageInfo)
					}
				}).catch((error) => {
					this.openError("更新失败：" + error.response.data.messageInfo)
				});

			},
			queryOrderFiles() {
				let params = {
					orderId: this.frow.orderId,
					businessScope: this.frow.businessScope
				}
				this.orderFiles.loading = true
				this.$axios.post2("/afbase/orderFiles/getList", params)
					.then((response) => {
						if (response.data.code == '0') {
							this.orderFiles.data = response.data.data
						} else {
							this.openError(response.data.messageInfo)
						}
						this.orderFiles.loading = false
					}).catch((error) => {
						this.openError(error.response.data.messageInfo)
						this.orderFiles.loading = false
					});
			},
			orderFileView(row) {
				window.open(row.fileUrl)
			}
		},
		created() {
      //判断是否有协议传输按钮
      if(this.frow.businessScope=='AE'){
        this.$axios.get2('/afbase/afOrderShare/check/'+this.frow.orderId+'/电子单证/null').then((response)=> {
          if(response.data.data){
           this.shareFlag = true;
          }
        }).catch((error)=> {
        	console.log(error);
        });
      }

			this.viewFlag = this.frow.viewFlag;
			//查询订单附件
			this.queryOrderFiles()
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.inbound.token = response.data.data;
				}.bind(this));
		}
	}
</script>
