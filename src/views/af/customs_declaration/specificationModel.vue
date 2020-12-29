<template>
	<el-dialog class="specificationModel" title="申报要素" width="505px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="20px">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input class="productCodeStyle" v-model="ruleForm.productCode" auto-complete="off" clearable style="width:480px;" disabled @click.native="viewTariffDetail">
							<template slot="prepend">商品编码</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.productName" auto-complete="off" clearable style="width:480px;" disabled>
							<template slot="prepend">商品名称</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="ruleForm.unit" auto-complete="off" clearable style="width:480px;" disabled>
							<template slot="prepend">计量单位</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="data" style="width: 480px;">
			<el-table-column label="申报要素" align="center" width="180">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.title" clearable></el-input>
				</template>
			</el-table-column>
			<el-table-column label="内容" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.content" clearable></el-input>
				</template>
			</el-table-column>
			<el-table-column fixed width="60" align="center">
				<template slot="header">
					<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				</template>
				<template slot-scope="scope">
					<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-left: 10px;margin-bottom: 10px;margin-top: 10px;">
			<el-button type="primary" size="small" @click="empty" plain style="background: #FFFFFF;color: #409EFF;">清空</el-button>
			<el-button type="primary" size="small" @click="doSelect">确定</el-button>
		</div>
		<tariffDetail ref="addMission" v-if="tariffDetailVisible" :visible.sync="tariffDetailVisible" :frow="ffrow"></tariffDetail>
	</el-dialog>
</template>
<script>
	import TariffDetail from '../af_tariff_details_view'
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
				tariffDetailVisible: false,
				ffrow:{},
				ruleForm: {
					productCode: '',
					productName: '',
					unit: ''
				},
				data: []
			}
		},
		components: {
			tariffDetail: TariffDetail
		},
		inject: ['specificationModelCallBack'],
		created: function() {
			this.ruleForm.productCode = this.frow.product.productCode
			this.ruleForm.productName = this.frow.product.productName
			if (this.frow.product.legalFirstUnitCode && this.frow.product.secondUnitCode) {
				this.ruleForm.unit = this.frow.product.legalFirstUnitCode + ' ' + this.frow.product.legalFirstUnit + ' / ' + this.frow.product.secondUnitCode + ' ' + this.frow.product.secondUnit
			} else if (this.frow.product.legalFirstUnitCode) {
				this.ruleForm.unit = this.frow.product.legalFirstUnitCode + ' ' + this.frow.product.legalFirstUnit
			} else if (this.frow.product.secondUnitCode) {
				this.ruleForm.unit = this.frow.product.secondUnitCode + ' ' + this.frow.product.secondUnit
			}
			if (this.frow.elements) {
				this.data = this.frow.elements.split('|').map(element => {
					return {
						title: element.split(':')[0],
						content: element.split(':')[1]
					}
				})
			}
		},
		methods: {
			viewTariffDetail(){
				this.ffrow = this.frow.product
				this.tariffDetailVisible = true
			},
			doSelect() {
				let specificationModel = ''
				this.data.forEach(row => {
					row.title = row.title.replace(/:/g, '').replace(/[|]/g, '')
					row.content = row.content.replace(/:/g, '').replace(/[|]/g, '')
					if (row.title || row.content) {
						if (specificationModel) {
							specificationModel += '|' + row.title + ':' + row.content
						} else {
							specificationModel += row.title + ':' + row.content
						}
					}
				})
				this.specificationModelCallBack({
					val: specificationModel
				})
				this.handleClose();
			},
			doDelete(index, rrow) {
				this.data.splice(index, 1)
			},
			doAdd() {
				this.data.push({
					title: '',
					content: ''
				})
			},
			empty() {
				this.data = []
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			}
		}
	}
</script>
<style>
	.specificationModel .el-input__icon {
		line-height: 30px !important;
	}

	.productCodeStyle input {
		color: blue !important;
		cursor: pointer !important;
	}
</style>
