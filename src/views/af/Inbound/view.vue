<template>
	<el-dialog title="操作出重 - 详情" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-table border v-loading="loading" :data="data">
			<el-table-column align="center" prop="orderCode" label="主单号/订单号" width="125"></el-table-column>
			<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
			<el-table-column align="center" prop="orderSize" label="货物尺寸" :formatter="orderSizeFormat"></el-table-column>
			<el-table-column align="center" prop="inboundPieces" label="入库件数" width="90"></el-table-column>
			<el-table-column align="center" prop="inboundGrossWeight" label="入库毛重" width="130">
			</el-table-column>
			<el-table-column align="center" prop="inboundVolume" label="入库体积" width="110">
			</el-table-column>
			<el-table-column align="center" prop="inboundVolumeWeight" label="体积重量" width="130">
			</el-table-column>
			<el-table-column align="center" prop="inboundChargeWeight" label="计费重量" width="130">
			</el-table-column>
			<el-table-column label="操作" align="center" width="80">
				<template slot-scope="scope">
					<!--<ul class="el-upload-list el-upload-list--text" v-if="scope.row.orderFileUrl!=null">
						<li class="el-upload-list__item is-success">
							<a class="el-upload-list__item-name">
								<i class="el-icon-document"></i> {{scope.row.orderFileName}}
							</a>
						</li>
					</ul>
					<span v-else-if="!(scope.$index==0&&scope.row.ifAwb)">未上传</span>-->
					<el-button style="padding: 7px 6px;" size="mini" type="primary" @click="uploadFile(scope.row)" v-if="!(scope.$index==0&&scope.row.ifAwb)">查看图片</el-button>
				</template>
			</el-table-column>
		</el-table>
		<upload ref="addMission" v-if="uploadVisible" :visible.sync="uploadVisible" :frow="ffrow"></upload>
	</el-dialog>
</template>
<script>
	import upload from './inbound_upload_view'
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
				uploadVisible: false,
				loading: false
			};
		},
		created() {
			if(this.frow.awbNumber == null || this.frow.awbNumber == '') {
				this.loading = true
				this.$axios.get2("/afbase/inbound/detail", {
						number: this.frow.orderCode,
						flag: 'order'
					})
					.then(function(response) {
						if(response.data.code == 0) {
							this.data = response.data.data
						} else {
							this.openError(response.data.messageInfo)
						}
						this.loading = false
					}.bind(this));
			} else {
				this.loading = true
				this.$axios.get2("/afbase/inbound/detail", {
						number: this.frow.awbId,
						flag: 'awb'
					})
					.then(function(response) {
						if(response.data.code == 0) {
							this.data = response.data.data
						} else {
							this.openError(response.data.messageInfo)
						}
						this.loading = false
					}.bind(this));
			}
		},
		components: {
			'upload': upload
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
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			orderSizeFormat(row, column) {
				if(row[column.property]) {
					return(row[column.property]).replace(/;/g, ";\n");
				} else {
					return ""
				}
			},
			uploadFile(row) {
				this.ffrow = row
				this.uploadVisible = true
			}
		}
	}
</script>
<style type="text/css">

</style>