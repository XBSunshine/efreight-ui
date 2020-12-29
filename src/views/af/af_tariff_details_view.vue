<template>
	<el-dialog title="商品税则 - 详情" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;" append-to-body>
        <div>
        	<div style="padding:0px 10px 0px 10px">
        		<span style="font-size: 16px;color: #303133;">基本信息</span>
        	</div>
        	<div style="padding:5px 10px 10px 10px">
	          <el-table  :data="data1" :show-header='false' border>
	            <el-table-column prop="code" label="编码" width="200" align="left"></el-table-column>
	            <el-table-column prop="name" label="描述"  align="left"></el-table-column>
	          </el-table>
          	</div>
          	<div style="padding:0px 10px 0px 10px">
        		<span style="font-size: 16px;color: #303133;">税率信息</span>
        	</div>
        	<div style="padding:5px 10px 10px 10px">
	          <el-table  :data="data2" :show-header='false' border>
	            <el-table-column prop="code" label="编码" width="200" align="left"></el-table-column>
	            <el-table-column prop="name" label="描述"  align="left"></el-table-column>
	          </el-table>
          	</div>
          	<div style="padding:0px 10px 0px 10px">
          		<el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary"><span style="font-size: 16px;color:rgb(19, 125, 250);"><u>申报要素?</u></span></el-link>
        		
        	</div>
        	<div style="padding:5px 10px 10px 10px">
	          <el-table  :data="data3" :show-header='false' border>
	            <el-table-column prop="code" label="编码" width="200" align="right"></el-table-column>
	            <el-table-column prop="name" label="描述"  align="left"></el-table-column>
	          </el-table>
          	</div>
          	<div style="padding:0px 10px 0px 10px">
        		<span style="font-size: 16px;color: #303133;">监管条件</span>
        	</div>
        	<div style="padding:5px 10px 10px 10px">
	          <el-table  :data="data4" :show-header='false' border>
	            <el-table-column prop="code" label="编码" width="200" align="right"></el-table-column>
	            <el-table-column prop="name" label="描述"  align="left"></el-table-column>
	          </el-table>
          	</div>
          	<div style="padding:0px 10px 0px 10px">
        		<span style="font-size: 16px;color: #303133;">检验检疫类别</span>
        	</div>
        	<div style="padding:5px 10px 10px 10px">
	          <el-table  :data="data5" :show-header='false' border>
	            <el-table-column prop="code" label="编码" width="200" align="right"></el-table-column>
	            <el-table-column prop="name" label="描述"  align="left"></el-table-column>
	          </el-table>
          	</div>
          	<div style="padding:0px 10px 0px 10px">
        		<span style="font-size: 16px;color: #303133;">CIQ代码(13位海关编码)</span>
        	</div>
        	<div style="padding:5px 10px 10px 10px">
	          <el-table  :data="data6" :show-header='false' border>
	            <el-table-column prop="ciqCode" label="编码" width="200" align="right"></el-table-column>
	            <el-table-column prop="ciqName" label="描述"  align="left"></el-table-column>
	          </el-table>
          	</div>
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
				helpDocumentUrl: '',
				data1: [],
				data2: [],
				data3: [],
				data4: [],
				data5: [],
				data6: [],
				ffrow: {	
				},
				
			};
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
			handleClick(tab, event) {
				//	         console.log(tab, event);
				// this.checkVue(tab.name)
			},
			
			
		},
		created() {
			this.$axios.get('/hrs/permission/' + 381).then(function(response) {
				if (response.data.code == 0) {
					this.helpDocumentUrl = response.data.data.helpDocumentUrl;
				}
			}.bind(this));
			this.$axios.get2('/afbase/tariff/getCIQ',{productCode:this.frow.productCode}).then(function(response) {
				this.data6 = response.data.data;
			}.bind(this));
			//
			this.data1.push({code:'商品编码',name:this.frow.productCode});
			this.data1.push({code:'商品名称',name:this.frow.productName});
			//
			let unitStr=this.frow.legalFirstUnitCode+' '+this.frow.legalFirstUnit;
		         if (this.frow.secondUnit && this.frow.secondUnit!='无') {
		         	unitStr=unitStr+' / '+this.frow.secondUnitCode+' '+this.frow.secondUnit
		         }
			this.data2.push({code:'计量单位',name:unitStr});
			this.data2.push({code:'出口税率',name:this.frow.exportTariff});
			this.data2.push({code:'出口退税税率',name:this.frow.exportRebateRate});
			this.data2.push({code:'出口暂定税率',name:this.frow.temporaryExportTaxRate});
			this.data2.push({code:'增值税率',name:this.frow.vatRates});
			this.data2.push({code:'最惠国进口税率',name:this.frow.preferentialImportTariff});
			this.data2.push({code:'进口暂定税率',name:this.frow.temporaryImportTaxRate});
			this.data2.push({code:'进口普通税率',name:this.frow.importTariff});
			this.data2.push({code:'消费税率',name:this.frow.consumptionTax});
			//
			let elements=this.frow.elements.split("$");
			for (var i = 0; i < elements.length; i++) {
				let str=elements[i].split(":");
				this.data3.push({code:str[0],name:str[1]});
			}
			//
			let regulatoryConditionRemark=this.frow.regulatoryConditionRemark.split("$");
			for (var i = 0; i < regulatoryConditionRemark.length; i++) {
				let str=regulatoryConditionRemark[i].split(":");
				this.data4.push({code:str[0],name:str[1]});
			}
			//
			let testCategoryRemark=this.frow.testCategoryRemark.split("$");
			for (var i = 0; i < testCategoryRemark.length; i++) {
				let str=testCategoryRemark[i].split(":");
				this.data5.push({code:str[0],name:str[1]});
			}
		}
	}
</script>
