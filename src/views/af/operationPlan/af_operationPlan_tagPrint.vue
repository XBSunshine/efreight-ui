<template>
	<el-dialog title="操作计划 - 标签打印" :width="width" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="ruleForm" :inline="false" ref="ruleForm" label-width="80px" class="demo-ruleForm">
			<div v-if="!oneOrMany">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="主单号" prop="awbNumber">
							<el-input v-model="ruleForm.awbNumber" auto-complete="off" disabled style="width: 125px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="件数" prop="pieces">
							<el-input style="width: 80px;" v-model="ruleForm.pieces" auto-complete="off" disabled>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
				<el-col class="elementWidth">
						<el-form-item label="分运单号" prop="hawbNumber">
							<el-select class="hawbNumber" style="width: 550px;" v-model="ruleForm.hawbNumber" multiple placeholder="请选择" @change="sychronizePieces">
								<el-option v-for="item in hawbNumbers" :key="item.slId" :label="item.hawbNumber +' ('+item.planPieces+'pcs)'" :value="item.slId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col class="elementWidth">
						<el-form-item label="打印范围">
							<el-input style="width: 60px;" v-model="ruleForm.printStart" auto-complete="off"  @input="checkInt('printStart')">
							</el-input>
							<span>-</span>
							<el-input style="width: 60px;" v-model="ruleForm.printEnd" auto-complete="off"  @input="checkInt('printEnd')">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label="打印模板" prop="model">
							<el-select v-model="ruleForm.model" placeholder="请选择" style="width: 150px;">
								<el-option label="100mm*80mm" value="100mm*80mm"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label-width="10px">
							<el-button size="small" type="primary" @click="print">打印</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
			<div v-else>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="打印模板" prop="model">
							<el-select v-model="ruleForm.model" placeholder="请选择" style="width: 150px;">
								<el-option label="100mm*80mm" value="100mm*80mm"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button size="small" type="primary" @click="printMany">打印</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
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
				oneOrMany: false,
				hawbNumbers: [],
        mawbPieces:"",
				piecesHawb: '',
				width: '650px',
				ruleForm: {
					awbNumber: '',
					hawbNumber: [],
					pieces: '',
					printStart: '1',
					printEnd: '',
					model: '100mm*80mm'
				}
			}
		},
		created: function() {
			if(this.frow.data.length === 1) {
			  let orderUUID = this.frow.data[0].orderUuid;
			  //主单件数
				this.$axios.get('/afbase/aforder/queryOrderByOrderUuid/' + orderUUID)
					.then((response) => {
					  let data = response.data.data;
					  this.mawbPieces = data['confirmPieces'] || data['planPieces'];
            //分单信息
            this.$axios.get('/afbase/operationPlan/findShipperLetter/hawb/' + orderUUID)
              .then((response) => {
                this.hawbNumbers = response.data.data;
                this.init()
              });
					});

			} else {
				this.oneOrMany = true;
				this.width = '350px'
			}

		},

		methods: {
			init() {
				this.ruleForm.awbNumber = this.frow.data[0].awbNumber
				let hawbPieces = ""
				this.hawbNumbers.forEach((hawbNumber) => {
					if(hawbNumber.planPieces != null) {
						if(hawbPieces === "") {
							hawbPieces = parseInt(hawbNumber.planPieces)
						} else {
							hawbPieces += parseInt(hawbNumber.planPieces)
						}
					}
					this.ruleForm.hawbNumber.push(hawbNumber.slId)
				});
				this.ruleForm.pieces = hawbPieces + "/" + this.mawbPieces;
				this.piecesHawb = hawbPieces
				this.ruleForm.printEnd = (hawbPieces || this.mawbPieces);
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
			print() {
				if(this.ruleForm.model == null || this.ruleForm.model === '') {
					this.openError("请选择打印模板")
					return
				}
        this.checkPrint();
				if(this.ruleForm.hawbNumber.length == 0) {
					this.$confirm('分单个数为0个, 默认打印主单标签, 确定打印么？', '注意', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
            let printScope = this.ruleForm.printStart + '-' + this.ruleForm.printEnd
						this.openPostWindow("/afbase/operationPlan/printTagNew", window.localStorage.getItem("orgId"), printScope, this.frow.data[0].orderUuid, "",this.frow.pageName)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消打印'
						});
					});
				} else {
					let slIds = ''
					this.ruleForm.hawbNumber.forEach((i) => {
						if(slIds == '') {
							slIds = i
						} else {
							slIds += ',' +i
						}
					})

					let printScope = this.ruleForm.printStart + '-' + this.ruleForm.printEnd
					this.openPostWindow("/afbase/operationPlan/printTagNew", window.localStorage.getItem("orgId"), printScope, this.frow.data[0].orderUuid, slIds,this.frow.pageName)
				}
			},
			printMany() {
				if(this.ruleForm.model == null || this.ruleForm.model === '') {
					this.openError("请选择打印模板")
					return
				}
				let orderUuids = ''
				this.frow.data.forEach((item) => {
					if(orderUuids == '') {
						orderUuids = item.orderUuid
					} else {
						orderUuids += ',' + item.orderUuid
					}
				})
        this.openPostWindow("/afbase/operationPlan/printTagMany", window.localStorage.getItem("orgId"), null, orderUuids, null,'操作计划')
			},
			openPostWindow(url, orgId, printScope, orderUuid, slIds, pageName) {
        let param={
            // orgId:window.localStorage.getItem("orgId"),
            printScope:printScope,
            orderUuid:orderUuid,
            slIds:slIds,
            pageName:pageName,
        };
        this.$axios.get2(url,param).then((response) => {
        	window.open(response.data.data)
        }).catch(function(error) {
        	console.log(error);
        });

			},
			checkInt(prop) {
				if(prop == 'printEnd') {
					this.ruleForm.printEnd = this.ruleForm.printEnd.replace(/[^0123456789]/g, "")
					if(this.ruleForm.printEnd.startsWith('0')) {
						this.ruleForm.printEnd = this.ruleForm.printEnd.substring(1, this.ruleForm.printEnd.length)
					}
				} else if(prop == 'printStart') {
					this.ruleForm.printStart = this.ruleForm.printStart.replace(/[^0123456789]/g, "")
					if(this.ruleForm.printStart.startsWith('0')) {
						this.ruleForm.printStart = this.ruleForm.printStart.substring(1, this.ruleForm.printEnd.length)
					}
				}
			},
			sychronizePieces() {
				let hawbPieces = ''
				this.ruleForm.hawbNumber.forEach((slId) => {
					this.hawbNumbers.forEach((hawb) => {
						if(hawb.slId == slId) {

							if(hawb.planPieces != null) {
								if(hawbPieces == '') {
									hawbPieces = parseInt(hawb.planPieces);
								} else {
									hawbPieces += parseInt(hawb.planPieces);
								}
							}
            }
          })
        });
        this.ruleForm.pieces = hawbPieces + "/" + this.mawbPieces;
        this.piecesHawb = hawbPieces;
        this.ruleForm.printEnd = (hawbPieces || this.mawbPieces);

      },
      handleClose() {
        this.$emit('update:visible', false);
      },
      checkPrint() {
        if (this.ruleForm.printStart == null || this.ruleForm.printStart === '' || this.ruleForm.printEnd == null || this.ruleForm.printEnd === '') {
          this.openError("请录入打印范围")
          throw '请录入打印范围';
        }
        if ((this.ruleForm.printStart + '').startsWith('0')) {
          this.openError("打印范围起始格式有误")
          throw '打印范围起始格式有误'
        }
        if ((this.ruleForm.printEnd + '').startsWith('0')) {
          this.openError("打印范围结束格式有误")
          throw '打印范围结束格式有误'
        }
        if (parseInt(this.ruleForm.printStart) > parseInt(this.ruleForm.printEnd)) {
          this.openError("打印范围起始不能大于结束")
          throw '打印范围起始不能大于结束'
        }

        if (parseInt(this.ruleForm.printEnd) > parseInt(this.piecesHawb || this.mawbPieces)) {
          this.openError("打印范围结束不能超过分单总件数")
          throw "打印范围结束不能超过分单总件数";
        }
      }

    }
	}
</script>
<style type="text/css">
.demo-ruleForm .hawbNumber .el-select__tags{
  white-space: nowrap;
  overflow: hidden;
  flex-wrap: nowrap !important;
}
</style>
