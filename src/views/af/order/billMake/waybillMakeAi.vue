<template>
	<el-dialog title="单证制作 - 运单制作" :fullscreen="true" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<div style="width: 1330px;margin: 0 auto;">
			<el-row>
				<el-col :span="4">
					<ul style="margin-top: 53px;">
						<!--<li style="margin-left: 30px;margin-bottom: 20px;">
							<span style="font-size: 16px;">主单：</span>
						</li>
						<li style="margin-left: 30px;margin-bottom: 20px;">
							<span v-if="!mawbChecked" style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="viewMawb">{{awbNumber?awbNumber:orderCode}}</span>
							<span v-else style="cursor: pointer;font-size: 15px;color: #409EFF;background-color: #7ed2df;" @click="viewMawb">{{awbNumber?awbNumber:orderCode}}</span>
						</li>-->
						<li style="margin-left: 0px;margin-bottom: 20px;">
							<!--<i class="iconfont el-icon-myyuanquanjiahao" style="cursor: pointer;font-size: 15px;color: #409EFF;" @click="addHawb"></i>-->
							<span style="font-size: 16px;margin-left: 10px;">分单：</span>
             <!-- <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="mini" :disabled="getHawbInfoFlag" v-on:click="getHawbInfo">获取分单信息</el-button>-->
						</li>
						<li v-for="(item,index) in data" :key="index" style="margin-left: 0px;margin-bottom: 20px;">
							<i class="iconfont el-icon-myjianhao" @click="doDelete(item.awbPrintId)" style="cursor: pointer;font-size: 15px;color: #409EFF;"></i>
							<span v-if="!item.checked" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 10px;" @click="viewHawb(item.awbPrintId)">{{item.hawbNumber}}</span>
							<span v-if="item.checked" style="cursor: pointer;font-size: 15px;color: #409EFF;margin-left: 10px;background-color: #7ed2df;" @click="viewHawb(item.awbPrintId)">{{item.hawbNumber}}</span>
						</li>
					</ul>
				</el-col>
				<el-col :span="20">
					<el-tabs v-model="activeName" type="border-card">
						<el-tab-pane :label="componentName" name="component">
							<component :is="component" :frow="ffrow"></component>
						</el-tab-pane>
					</el-tabs>
				</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>
<script>
	const mawbSave = resolve => require(['@/views/af/order/billMake/waybillMake/af_mawbPrint_save.vue'], resolve)
	const hawbSave = resolve => require(['@/views/af/order/billMake/waybillMake/af_hawbPrint_save.vue'], resolve)
	const mawbEdit = resolve => require(['@/views/af/order/billMake/waybillMake/af_mawbPrint_edit.vue'], resolve)
	const hawbEdit = resolve => require(['@/views/af/order/billMake/waybillMake/af_hawbPrint_edit.vue'], resolve)
	import laydate from "../../../../../static/laydate/laydate.js"
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		provide() {
			return {
				callbackforInit: this.callback
			}
		},
		data() {
			return {
				data: [],
				activeName: 'component',
				componentName: '',
				component: null,
				mawbChecked: false,
				ffrow: {},
				awbNumber: '',
				orderCode: '',
				orderUuid: '',
				flightNumber: '',
        getHawbInfoFlag: false,
			}
		},
		created() {
			this.awbNumber = this.frow.waybillMake.awbNumber
			this.orderUuid = this.frow.waybillMake.orderUuid
			this.orderCode = this.frow.waybillMake.orderCode
			this.flightNumber = this.frow.waybillMake.flightNumber
      this.hawbNumber = this.frow.waybillMake.hawbNumber
			this.ffrow.laydate = laydate
			//this.queryMawb()
			this.queryHawb()
		},
		methods: {
      getHawbInfo(){
          this.$axios.get('/afbase/awbPrint/hawbListByOrderUuid/' + this.orderUuid).then((response) => {
              if(response.data.code == 0) {
                  this.data = response.data.data
                  if(this.data.length == 0){
                      this.getHawbInfoFlag = false
                      //获取分单信息并保存
                      this.$axios.get('/afbase/awbPrint/getHawbInfo/' + this.orderUuid).then((response) => {
                          if(response.data.code == 0) {
                              this.queryHawb()
                          } else {
                              this.openError(response.data.messageInfo)
                          }
                      }).catch((error) => {
                          console.log(error);
                          this.openError(error.response.data.messageInfo)
                      })

                  }else{
                      this.openError("当前业务已经保存过分单，不能再次获取分单信息了")
                      return;
                      this.getHawbInfoFlag = true
                  }
              } else {
                  this.openError(response.data.messageInfo)
              }
          }).catch((error) => {
              console.log(error);
              this.openError(error.response.data.messageInfo)
          })
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
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			changeActiveName(name) {
				this.mawbSaveFlag = false
				this.hawbSaveFlag = false
				this.mawbEditFlag = false
				this.hawbEditFlag = false
				if(name == 'mawbSave') {
					this.mawbSaveFlag = true
				} else if(name == 'hawbSave') {
					this.hawbSaveFlag = true
				} else if(name == 'mawbEdit') {
					this.mawbEditFlag = true
				} else if(name == 'hawbEdit') {
					this.hawbEditFlag = true
				}
			},
			callback(flag, id) {
				if(flag == 'mawb') {
					this.viewMawb()
				} else if(flag == 'hawb') {
					if(id == null) {
						if(!this.mawbChecked) {
							this.queryHawb(this.ffrow.awbPrintId)
						}
					} else {
						this.queryHawb(id)
					}
				}
			},

			queryMawb() {
				this.$axios.get('/afbase/awbPrint/viewByOrderUuid/' + this.orderUuid).then((response) => {
					if(response.data.code == 0) {
						if(response.data.data != null) {
							//已制作主单
							this.ffrow.awbPrintIdCopy = response.data.data.awbPrintId
							this.ffrow.awbNumber = this.awbNumber
							this.component = null
							this.$nextTick(() => {
								this.component = mawbEdit
								this.componentName = '主单编辑'
							})
						} else {
							//未制主单
							this.ffrow.orderUuid = this.orderUuid
							this.ffrow.awbNumber = this.awbNumber
							this.ffrow.flightNumber = this.flightNumber
							this.component = mawbSave
							this.componentName = '主单制作'
						}
					} else {
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					console.log(error);
					this.openError(error.response.data.messageInfo)
				})
			},
			queryHawb(flag) {
				this.$axios.get('/afbase/awbPrint/hawbListByOrderUuid/' + this.orderUuid).then((response) => {
					if(response.data.code == 0) {
						this.data = response.data.data
            if(this.data.length == 0){
                this.ffrow.orderUuid = this.orderUuid
                this.ffrow.awbNumber = this.awbNumber
                this.ffrow.flightNumber = this.flightNumber
                this.ffrow.hawbNumber = this.hawbNumber
                this.ffrow.bussinessScope = 'AI'
                this.component = hawbSave
                this.componentName = '分单制作'
            }else{
                this.ffrow.awbPrintId = response.data.data[0].awbPrintId
                this.ffrow.awbNumber = this.awbNumber
                //this.component = hawbEdit
               // this.componentName = '分单编辑'
                this.component = null
                this.$nextTick(() => {
                    this.component = hawbEdit
                    this.componentName = '分单编辑'
                })
            }
						/*if(flag) {
							this.data.forEach((row) => {
								if(row.awbPrintId == flag) {
									row.checked = true
									this.viewHawb(flag)
								} else {
									row.checked = false
								}
							})
						}*/
					} else {
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					console.log(error);
					this.openError(error.response.data.messageInfo)
				})
			},
			viewMawb() {
				this.queryMawb()
				this.mawbChecked = true
				this.data.forEach((row) => {
					row.checked = false
				})
			},
			viewHawb(id) {
				this.data.forEach((row) => {
					if(row.awbPrintId == id) {
						row.checked = true
					} else {
						row.checked = false
					}
				})
				this.mawbChecked = false
				this.ffrow.awbNumber = this.awbNumber
				this.ffrow.awbPrintId = id
				this.component = null
				this.$nextTick(() => {
					this.component = hawbEdit
					this.componentName = '分单编辑'
				})
			},
			addHawb() {
				this.mawbChecked = false
				this.data.forEach((row) => {
					row.checked = false
				})
				this.ffrow.orderUuid = this.orderUuid
				this.ffrow.awbNumber = this.awbNumber
				this.ffrow.flightNumber = this.flightNumber
				this.component = hawbSave
				this.componentName = '分单制作'
			},
			doDelete(id) {
				this.$confirm('此操作不可恢复，确定要删除么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/awbPrint/hawb/' + id)
						.then((response) => {
							if(response.data.code == 0) {
								if(this.ffrow.awbPrintId == id) {
									this.queryHawb()
									//this.viewMawb()
								} else if(!this.mawbChecked) {
									this.queryHawb(this.ffrow.awbPrintId)
								} else {
									this.queryHawb()
								}
								this.openSuccess("删除成功")
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}).catch(() => {

				});
			}
		}
	}
</script>
<style type="text/css">

</style>
