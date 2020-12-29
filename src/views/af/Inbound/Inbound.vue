<template>
	<el-dialog title="操作出重 - 出重" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-table border v-loading="loading" :data="data">
			<el-table-column align="center" prop="orderCode" label="主单号/订单号" width="125"></el-table-column>
			<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
			<el-table-column align="center" prop="orderSize" label="货物尺寸" :formatter="orderSizeFormat"></el-table-column>
			<el-table-column align="center" label="编辑" width="80">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-button style="padding: 7px 6px;" :disabled="inboundAfterFlag" @click="editSize(scope.row)" size="mini" type="primary" v-show="scope.$index!=0||!scope.row.ifAwb">编辑尺寸</el-button>
					</div>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="inboundPieces" label="入库件数" width="90"></el-table-column>
			<el-table-column align="center" label="入库毛重" width="130">
				<template slot-scope="scope">
					<el-input :disabled="inboundAfterFlag" v-if="scope.$index!=0||!scope.row.ifAwb" @input="checkFloat(scope.row,'inboundGrossWeight')" @change="sumGrossWeight(scope.row)" size="small" v-model="scope.row.inboundGrossWeight"></el-input>
					<span v-else>{{scope.row.inboundGrossWeight}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="入库体积" width="110">
				<template slot-scope="scope">
					<el-input :disabled="inboundAfterFlag" v-if="scope.$index==0&&scope.row.ifAwb" @input="checkFloat(scope.row,'inboundVolume')" @change="countVolumeWeightAndChargeWeight" size="small" v-model="scope.row.inboundVolume"></el-input>
					<span v-else>{{scope.row.inboundVolume}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="体积重量" width="120">
				<template slot-scope="scope">
					<span>{{scope.row.inboundVolumeWeight}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="计费重量" width="130">
				<template slot-scope="scope">
					<el-input :disabled="inboundAfterFlag" v-if="scope.$index==0" @input="checkFloat(scope.row,'inboundChargeWeight')" size="small" v-model="scope.row.inboundChargeWeight"></el-input>
					<span v-else>{{scope.row.inboundChargeWeight}}</span>
				</template>
			</el-table-column>
			<el-table-column v-if="inboundAfterFlag" label="操作" align="center" width="80">
				<template slot-scope="scope">
					<el-button style="padding: 7px 6px;" v-if="!(scope.$index==0&&scope.row.ifAwb)" size="mini" type="primary" @click="uploadFile(scope.row)">上传图片</el-button>
					<!--<el-upload v-if="!(scope.$index==0&&scope.row.ifAwb)&&scope.row.orderFileUrl==null" :action="actionPath" :accept="accept" :limit=1 :data="{token:token,key:scope.row.orderCode+'-'+new Date().getTime()}" :on-success="uploadSuccess" :show-file-list=false>
						<el-button size="small" type="primary" @click="clickUploadButton(scope.row)">上传图片</el-button>
					</el-upload>
					<ul class="el-upload-list el-upload-list--text" v-if="scope.row.orderFileUrl!=null">
						<li class="el-upload-list__item is-success">
							<a class="el-upload-list__item-name">
								<i class="el-icon-document"></i> {{scope.row.orderFileName}}
							</a>
							<label class="el-upload-list__item-status-label">
								<i class="el-icon-upload-success el-icon-circle-check"></i>
							</label>
							<i class="el-icon-close" @click="handleRemove(scope.row)"></i>
						</li>
					</ul>-->
				</template>
			</el-table-column>
		</el-table>
		<el-row style="margin-top: 20px;">
			<el-col class="elementWidth" v-if="!inboundAfterFlag">
				<el-button size="small" type="primary" @click="submitForm">保存</el-button>
			</el-col>
			<el-col class="elementWidth" v-if="!inboundAfterFlag">
				<el-button style="margin-left: 10px;" size="small" type="primary" @click="handleClose">取消</el-button>
			</el-col>
			<el-col class="elementWidth" v-if="inboundAfterFlag">
				<el-button size="small" type="primary" @click="completeInbound">完成出重</el-button>
			</el-col>
		</el-row>
		<size ref="addMission" v-if="sizeVisible" :visible.sync="sizeVisible" :frow="ffrow"></size>
		<upload ref="addMission" v-if="uploadVisible" :visible.sync="uploadVisible" :frow="ffrow"></upload>
	</el-dialog>
</template>
<script>
	import Size from './edit_size'
	import upload from './inbound_upload'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			//只能录入数字和字母
			let checkNumberCharacter = (rule, value, callback) => {
				if(value) {
					if(value.replace(/[A-Za-z0-9]/g, "").length != 0) {
						callback(new Error('请输入数字和字母'));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			return {
				data: [],
				loading: false,
				sizeVisible: false,
				uploadVisible: false,
				ffrow: '',
				actionPath: 'http://up-z1.qiniu.com',
				accept: "image/jpeg,image/gif,image/png,image/bmp",
				token: '',
				currRow: '',
				inboundAfterFlag: false,
				inboundId: ''
			};
		},
		inject: ['findByPage'],
		created() {
			this.loadData("init")
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.token = response.data.data;
				}.bind(this));
		},
		components: {
			'size': Size,
			'upload': upload
		},

		provide() {
			return {
				sizeCallback: this.sizeCallback
			}
		},
		methods: {
			loadData(val) {
				if(this.frow.awbNumber == null || this.frow.awbNumber == '') {
					this.loading = true
					this.$axios.get2("/afbase/inbound/inbound", {
							number: this.frow.orderCode,
							flag: 'order'
						})
						.then(function(response) {
							if(response.data.code == 0) {
								this.data = response.data.data
								this.ifOrderHaveSizeValCountOther()
								if(val == 'saveInboundAfter') {
									this.openSuccess('已保存')
									this.inboundAfterFlag = true
								}
							} else {
								this.openError(response.data.messageInfo)
							}
							this.loading = false
						}.bind(this));
				} else {
					this.loading = true
					this.$axios.get2("/afbase/inbound/inbound", {
							number: this.frow.awbId,
							flag: 'awb'
						})
						.then(function(response) {
							if(response.data.code == 0) {
								this.data = response.data.data
								this.ifOrderHaveSizeValCountOther()
								this.init()
								if(val == 'saveInboundAfter') {
									this.openSuccess('已保存')
									this.inboundAfterFlag = true
								}
							} else {
								this.openError(response.data.messageInfo)
							}
							this.loading = false
						}.bind(this));
				}
			},
			init() {
				//计算总计
				let sumSizeData = {}
				let sumSize = null
				let sumPieces = null
				let sumVolume = null
				let sumVolumeWeight = null
				for(var i = 1; i < this.data.length; i++) {
					if(this.data[i].inboundPieces != null) {
						if(sumPieces == null) {
							sumPieces = parseInt(this.data[i].inboundPieces)
						} else {
							sumPieces += parseInt(this.data[i].inboundPieces)
						}
					}
					if(this.data[i].inboundVolume != null) {
						if(sumVolume == null) {
							sumVolume = parseFloat(this.data[i].inboundVolume)
						} else {
							sumVolume += parseFloat(this.data[i].inboundVolume)
						}
					}
					if(this.data[i].inboundVolumeWeight != null) {
						if(sumVolumeWeight == null) {
							sumVolumeWeight = parseFloat(this.data[i].inboundVolumeWeight)
						} else {
							sumVolumeWeight += parseFloat(this.data[i].inboundVolumeWeight)
						}
					}
					if(this.data[i].orderSize != null && this.data[i].orderSize !== '') {
						let sizeList = this.data[i].orderSize.split(';')
						sizeList.forEach((size) => {
							let key = size.split('*')[0] + "*" + size.split('*')[1] + "*" + size.split('*')[2]
							let val = parseInt(size.split('*')[3])
							if(sumSizeData[key] == null) {
								sumSizeData[key] = val
							} else {
								sumSizeData[key] += val
							}
						})
					}

				}

				for(let prop in sumSizeData) {
					if(sumSize == null) {
						sumSize = prop + "*" + sumSizeData[prop]
					} else {
						sumSize += ";" + prop + "*" + sumSizeData[prop]
					}
				}
				this.data[0].inboundPieces = sumPieces
				if(sumVolume != null) {
					this.data[0].inboundVolume = sumVolume.toFixed(3)
				}
				if(sumVolumeWeight != null) {
					this.data[0].inboundVolumeWeight = sumVolumeWeight.toFixed(1)
				}
				this.data[0].orderSize = sumSize

				let sumGrossWeight = null
				for(var i = 1; i < this.data.length; i++) {
					if(this.data[i].inboundGrossWeight != null) {
						if(sumGrossWeight == null) {
							sumGrossWeight = parseFloat(this.data[i].inboundGrossWeight)
						} else {
							sumGrossWeight += parseFloat(this.data[i].inboundGrossWeight)
						}
					}
				}
				if(sumGrossWeight != null) {
					sumGrossWeight = sumGrossWeight.toFixed(1)
				}
				this.data[0].inboundGrossWeight = sumGrossWeight

				this.countChargeWeight()
			},
			sizeCallback(val) {
				this.ffrow.orderSize = val
				if(val != '') {
					//当前行自动赋值
					let pieces = null
					let volume = null
					let volumeWeight = null

					val.split(';').forEach((size) => {
						if(pieces == null) {
							pieces = parseInt(size.split('*')[3])
						} else {
							pieces += parseInt(size.split('*')[3])
						}
						if(volume == null) {
							volume = parseInt(size.split('*')[3]) * parseFloat(size.split('*')[0]) * parseFloat(size.split('*')[1]) * parseFloat(size.split('*')[2])
						} else {
							volume += parseInt(size.split('*')[3]) * parseFloat(size.split('*')[0]) * parseFloat(size.split('*')[1]) * parseFloat(size.split('*')[2])
						}
					})
					if(volume == null || volume === '') {
						volumeWeight = 0
					} else {
						volume = (volume / 1000000).toFixed(3)
						volumeWeight = (volume * 1000000 / 6000).toFixed(1)
					}

					this.ffrow.inboundPieces = pieces
					this.ffrow.inboundVolume = volume
					this.ffrow.inboundVolumeWeight = volumeWeight
					this.countOrderChargeWeight(this.ffrow)
				} else {
					this.ffrow.inboundPieces = null
					this.ffrow.inboundVolume = null
					this.ffrow.inboundVolumeWeight = null
				}
				if(this.ffrow.ifAwb) {
					//计算总计
					let sumSizeData = {}
					let sumSize = null
					let sumPieces = null
					let sumVolume = null
					let sumVolumeWeight = null
					for(var i = 1; i < this.data.length; i++) {
						if(this.data[i].inboundPieces != null && this.data[i].inboundPieces !== '') {
							if(sumPieces == null) {
								sumPieces = parseInt(this.data[i].inboundPieces)
							} else {
								sumPieces += parseInt(this.data[i].inboundPieces)
							}
						}
						if(this.data[i].inboundVolume != null && this.data[i].inboundVolume !== '') {
							if(sumVolume == null) {
								sumVolume = parseFloat(this.data[i].inboundVolume)
							} else {
								sumVolume += parseFloat(this.data[i].inboundVolume)
							}
						}
						if(this.data[i].inboundVolumeWeight != null && this.data[i].inboundVolumeWeight !== '') {
							if(sumVolumeWeight == null) {
								sumVolumeWeight = parseFloat(this.data[i].inboundVolumeWeight)
							} else {
								sumVolumeWeight += parseFloat(this.data[i].inboundVolumeWeight)
							}
						}
						if(this.data[i].orderSize != null && this.data[i].orderSize !== '') {
							let sizeList = this.data[i].orderSize.split(';')
							sizeList.forEach((size) => {
								let key = size.split('*')[0] + "*" + size.split('*')[1] + "*" + size.split('*')[2]
								let val = parseInt(size.split('*')[3])
								if(sumSizeData[key] == null) {
									sumSizeData[key] = val
								} else {
									sumSizeData[key] += val
								}
							})
						}

					}

					for(let prop in sumSizeData) {
						if(sumSize == null) {
							sumSize = prop + "*" + sumSizeData[prop]
						} else {
							sumSize += ";" + prop + "*" + sumSizeData[prop]
						}
					}
					this.data[0].inboundPieces = sumPieces
					if(sumVolume != null) {
						this.data[0].inboundVolume = sumVolume.toFixed(3)
					} else {
						this.data[0].inboundVolume = 0
					}
					if(sumVolumeWeight != null) {
						this.data[0].inboundVolumeWeight = sumVolumeWeight.toFixed(1)
					} else {
						this.data[0].inboundVolumeWeight = 0
					}
					this.data[0].orderSize = sumSize

				}
				this.countChargeWeight()

			},
			ifOrderHaveSizeValCountOther() {
				this.data.forEach((item) => {
					this.ffrow = item
					if(item.orderSize != null && item.orderSize != '' && item.orderPieces == null) {
						this.sizeCallback(item.orderSize)
					}
				})
			},
			editSize(row) {
				this.ffrow = row;
				this.sizeVisible = true;
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: '操作成功, ' + info,
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
			submitForm() {
				let BreakException = {}
				try {
					this.data.forEach((item) => {
						if(item.orderSize === '' || item.orderSize == null) {
							this.openError("尺寸不能为空")
							throw BreakException;
						}
						if(item.inboundGrossWeight === '' || item.inboundGrossWeight == null) {
							this.openError("毛重不能为空")
							throw BreakException;
						}
						if(item.inboundChargeWeight === '' || item.inboundChargeWeight == null) {
							this.openError("计费重量不能为空")
							throw BreakException;
						}
					})
				} catch(e) {
					return
				}

				let params = {
					data: this.data
				};
				this.$axios.post2('/afbase/inbound/saveInbound', params)
					.then(function(response) {
						if(response.data.code == 0) {
							this.loadData('saveInboundAfter')
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					}.bind(this));
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 关闭
			handleClose() {
				if(this.inboundAfterFlag) {
					this.$confirm('你确定上传完照片文件完成出重么?', '注意', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						this.openSuccess('出重完成')
						this.findByPage()
						this.$emit('update:visible', false)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
				} else {
					this.$emit('update:visible', false)
				}

			},
			orderSizeFormat(row, column) {
				if(row[column.property]) {
					return(row[column.property]).replace(/;/g, ";\n");
				} else {
					return ""
				}
			},
			checkFloat(row, prop) {
				if(prop == 'inboundChargeWeight' || prop == 'inboundGrossWeight') {
					row[prop] = row[prop].replace(/[^0123456789.]/g, "");
					let t = row[prop].split('.');
					if(t.length > 1) {
						if(t[0] == '') {
							row[prop] = "0." + t[1].substr(0, 1);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, 1);
						}
					}
				} else if(prop == 'inboundVolume') {
					row[prop] = row[prop].replace(/[^0123456789.]/g, "");
					let t = row[prop].split('.');
					if(t.length > 1) {
						if(t[0] == '') {
							row[prop] = "0." + t[1].substr(0, 3);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, 3);
						}
					}
				}
			},
			sumGrossWeight(row) {
				if(row.ifAwb) {
					let sumGrossWeight = null
					for(var i = 1; i < this.data.length; i++) {
						if(this.data[i].inboundGrossWeight != null && this.data[i].inboundGrossWeight !== '') {
							if(sumGrossWeight == null) {
								sumGrossWeight = parseFloat(this.data[i].inboundGrossWeight)
							} else {
								sumGrossWeight += parseFloat(this.data[i].inboundGrossWeight)
							}
						}
					}
					if(sumGrossWeight != null) {
						sumGrossWeight = sumGrossWeight.toFixed(1)
					}
					this.data[0].inboundGrossWeight = sumGrossWeight

					//计算订单计费重量
					this.countOrderChargeWeight(row)
				}
				this.countChargeWeight()

			},
			countChargeWeight() {
				if(this.data[0].inboundGrossWeight != null && this.data[0].inboundGrossWeight !== '' && this.data[0].inboundVolumeWeight != null && this.data[0].inboundVolumeWeight !== '') {
					if(parseFloat(this.data[0].inboundGrossWeight) > parseFloat(this.data[0].inboundVolumeWeight)) {
						this.data[0].inboundChargeWeight = parseFloat(this.data[0].inboundGrossWeight).toFixed(1)
					} else {
						this.data[0].inboundChargeWeight = parseFloat(this.data[0].inboundVolumeWeight).toFixed(1)
					}
					let arr = (this.data[0].inboundChargeWeight + "").split(".");
					if(parseInt(arr[1]) > 0 && parseInt(arr[1]) < 5) {
						this.data[0].inboundChargeWeight = arr[0] + ".5"
					} else if(parseInt(arr[1]) > 5 && parseInt(arr[1]) < 10) {
						this.data[0].inboundChargeWeight = (parseInt(arr[0]) + 1) + ".0"
					}
				} else {
					this.data[0].inboundChargeWeight = null
				}
			},
			countVolumeWeightAndChargeWeight() {
				if(this.data[0].inboundVolume != null && this.data[0].inboundVolume !== '') {
					this.data[0].inboundVolumeWeight = (parseFloat(this.data[0].inboundVolume) * 1000000 / 6000).toFixed(1)
				} else {
					this.data[0].inboundVolumeWeight = null
				}
				this.countChargeWeight()
			},
			countOrderChargeWeight(row) {
				if(row.inboundGrossWeight != null && row.inboundGrossWeight !== '' && row.inboundVolumeWeight != null && row.inboundVolumeWeight !== '') {
					if(parseFloat(row.inboundGrossWeight) > parseFloat(row.inboundVolumeWeight)) {
						row.inboundChargeWeight = row.inboundGrossWeight
					} else {
						row.inboundChargeWeight = row.inboundVolumeWeight
					}

					let arr = (row.inboundChargeWeight + "").split(".");
					if(parseInt(arr[1]) > 0 && parseInt(arr[1]) < 5) {
						row.inboundChargeWeight = arr[0] + ".5"
					} else if(parseInt(arr[1]) > 5 && parseInt(arr[1]) < 10) {
						row.inboundChargeWeight = (parseInt(arr[0]) + 1) + ".0"
					}
				} else {
					row.inboundChargeWeight = null
				}
			},
			handleRemove(row) {
				row.orderFileName = null
				row.orderFileUrl = null
			},
			uploadSuccess(response, file, fileList) { //上传成功后在图片框显示图片
				this.currRow.orderFileUrl = "http://doc.yctop.com/" + response.key;
				this.currRow.orderFileName = file.name
			},
			clickUploadButton(row) {
				this.currRow = row
			},
			uploadFile(row) {
				this.ffrow = row
				this.uploadVisible = true
			},
			completeInbound() {
				this.handleClose()
			}
		}
	}
</script>
<style type="text/css">

</style>