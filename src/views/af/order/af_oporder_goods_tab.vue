<template>
	<div class="identify-container" id="identify">
		<el-form :rules="identifyRules" :inline="true" ref="identifyForm" label-width="100px" class="orderListPage" :model="identifyForm" :disabled="!frow.viewFlag">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item >
						<el-input class="widthWithFourWithXing" clearable v-model="identifyForm.goodsCnnames"  auto-complete="off" maxlength="512" style="width: 295px;margin-right: 15px;" >
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>中文品名</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="goodsEnnames">
						<el-input clearable v-model="identifyForm.goodsEnnames"  auto-complete="off" maxlength="512" style="width: 295px;margin-right: 15px;" >
							<template slot="prepend">
								<span>英文品名</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="quantity">
						<el-input clearable v-model="identifyForm.quantity"  auto-complete="off" maxlength="11" style="width: 295px;margin-right: 15px;" @input="formatToFloat('quantity')">
							<template slot="prepend">
								<span>件数</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				
			</el-row>
			<el-row>
				<!-- <el-col class="elementWidth">
					<el-form-item prop="cargoType">
						<el-input clearable v-model="identifyForm.cargoType"  auto-complete="off" maxlength="512" style="width: 295px;margin-right: 15px;" >
							<template slot="prepend">
								<span>货物类型</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col> -->
				<el-col class="elementWidth">
					<el-form-item prop="goodsType">
						<el-input style="width:295px;margin-right: 15px;">
							<template slot="prepend">
								<span>货物类型</span>
							</template>
							<el-select slot="suffix" v-model="identifyForm.cargoType" clearable placeholder="请选择货物类型" style="width:226px;margin-right: -5px;">
								<el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="reportIssueNo">
						<el-input clearable v-model="identifyForm.reportIssueNo"  auto-complete="off" maxlength="256" style="width: 295px;margin-right: 15px;" >
							<template slot="prepend">
								<span>鉴定编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item v-if="frow.viewFlag">
						<el-button  type="primary" size="mini" @click="onSave" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">保存</el-button>
						<el-button type="primary" size="mini" @click="setNull" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">重置</el-button>
						<el-button type="primary" size="mini" v-on:click="doBatchImport" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">EXCEL导入</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div style="padding:0px 0px 20px 0px">
			<HR color="#eee" size="5">
			</HR>
		</div>
		<el-form :inline="true" :model="query" label-width="100px" class="orderListPage">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item >
							<el-input v-model="query.goodsCnnames" auto-complete="off" clearable style="width:295px;">
								<template slot="prepend">中文品名</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item >
							<el-button type="primary" size="mini" v-on:click="querylist" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="mini" v-on:click="sendGoodsName" v-if="frow.viewFlag">发送品名清单</el-button>
						</el-form-item>
					</el-col>
		</el-row>
			
		</el-form>
        <el-table border highlight-current-row ref="identify" v-loading="identify.loading" :data="identify.data" :row-class-name="identifyTableRowClassName" @row-click="selectIdentify">
            <el-table-column align="center" prop="goodsCnnames" label="中文品名" ></el-table-column>
            <el-table-column align="center" prop="goodsEnnames" label="英文品名"></el-table-column>
            
            <el-table-column align="center" prop="cargoType" label="货物类型" width="150"></el-table-column>
            
            <el-table-column align="center" prop="quantity" label="件数" width="150"></el-table-column>
            <el-table-column align="center" prop="reportIssueNo" label="鉴定编号" ></el-table-column>
            <el-table-column align="center" label="操作" width="100" v-if="frow.viewFlag">
                <template slot-scope="scope" >
                    <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

		 <batchImport ref="addMission" v-if="batchImport" :visible.sync="batchImport" :frow="ffrow"></batchImport>
	</div>
</template>
<style>
	.identify-container{
		margin-bottom: 20px;
	}
	#identify .el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	#identify .el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}
	#identify .identify-form{
		margin-top: 30px;
	}
	#identify .upload-title-container{
		margin-bottom: 20px;
	}
	#identify .upload-title{
		font-size: 14px;
	}
	#identify .upload-title-explain{
		font-size: 13px;
	}
	#identify .el-upload-list_item_containter{
		height: 100%;
	}
	#identify .filename{
		text-align: center;
		vertical-align: middle;
	}
	#identify .filename span{
		font-size: 13px;
		margin: auto 1px;
	}
	/* #identify .el-table__body tr.current-row>td{
		background-color: #FDF5E6!important;
	} */
</style>
<script>
	import batchImport from './af_oporder_goods_import'
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
				batchImport:false,
				isdisabled:false,
				followSave:true,
				followSend:true,
				followSendDelete:false,
				isFollowUpload:true,
				ffrow: {},
				goodsTypeOptions: [{
					value: 'YJ-南京E邮宝',
          			label: 'YJ-南京E邮宝'
				},{
					value: 'YJ-南京邮件小包',
          			label: 'YJ-南京邮件小包'
				},{
					value: 'YJ-苏州邮件小包',
          			label: 'YJ-苏州邮件小包'
				},{
					value: '服装类',
          			label: '服装类'
				},{
					value: '机械配件',
          			label: '机械配件'
				},{
					value: '电子产品',
          			label: '电子产品'
				},{
					value: '食品',
          			label: '食品'
				},{
					value: '动植物类',
          			label: '动植物类'
				},{
					value: '化工产品',
          			label: '化工产品'
				},{
					value: '生物制剂',
          			label: '生物制剂'
				},{
					value: '其他',
          			label: '其他'
				}],
				tranFlagOptions:[{
					value: '0',
          			label: '本关'
				},{
					value: '1',
					label: '转关'
				},{
					value: '2',
          			label: '大通关'
				}],
                identify: {
					loading: false,
					data: [],
					ffrow: '',
					currRow: '',
					token:''
                },
                query: {
					
					goodsCnnames:''
                },
				identifyForm:{
					id:'',
					goodsCnnames:'',
					goodsEnnames:'',
					cargoType:'',
					quantity:'',
					reportIssueNo:'',
					orderId:'',
					orgId:'',
					orgCode:'',
					orgName:'',

					creatorId:'',
					creatorName:'',
					createTime:'',
					editorId:'',
					editTime:'',
					editorName:'',
	
				},
				identifyRules:{
					
					goodsCnnames: [{
						required: true,
						message: "请输入中文品名",
						trigger: ["blur", "change"],
					}]
					
      			},
				actionPath: 'http://up-z1.qiniu.com',
				acceptFileFormat: ".PDF,.DOC,.DOCX,.XLS,.XLSX,.JPG,.JPEG,.BMP,.PNG,.GIF",
				uptoken: {
					token: '',
					key: ""
				},
				dialogImageUrl: '',
				dialogVisible: false,
				filelist:[],
				fileUrl:'',
				fileName:'',
			};
		},
		inject: ['findByPage'],
		components: {
			'batchImport': batchImport
		},
		provide() {
			return {
				querylist: this.querylist
			}
		},
		methods: {
			doBatchImport() {
				this.ffrow.orderId = this.frow.orderId
		        this.batchImport = true;
		    },
			renderHeader(cerateElement, { column }) {
				return cerateElement("div", [
					cerateElement("span", column.label),
					cerateElement("span", {
					domProps: {
						innerHTML: "*"
					},
					style: {
						color: "#F56C6C",
						fontSize: "14px",
						fontWeight: "normal",
						marginLeft: "5px"
					}
					})
				]);
			},
			getFileName(fileFullName){
				return fileFullName.substring(fileFullName.lastIndexOf('_')+1);
			},
			setNull(){
				this.identifyForm={
					id:'',
					goodsCnnames:'',
					goodsEnnames:'',
					cargoType:'',
					quantity:'',
					reportIssueNo:'',
					orderId:this.frow.orderId,
					orgId:'',
					orgCode:'',
					orgName:'',

					creatorId:'',
					creatorName:'',
					createTime:'',
					editorId:'',
					editTime:'',
					editorName:'',
	
				}
			},
			deleteClick(row){
					let that = this;
					let params = {
						id: row.id
					}
					that.$axios.post2("/afbase/goodsName/doDelete",params).then(function(response) {
						if (response.data.code == 0) {
							that.openSuccess();
							that.querylist();
							that.setNull();
						}else {
							that.openError(response.data.messageInfo);
						}
					}.bind(this))
					.catch(function (error) {
						let errorinfo = error.message;
						this.openError(errorinfo);
					}.bind(this));
				
			},
			onSave(){
				this.commonSave('save');
			},
			onSend(){
				this.commonSave('send');
			},
			commonSave(status){
				if (this.identifyForm.goodsCnnames.trim().length<=0) {
					this.openError("请输入中文品名");
					return;
				}
				let that = this;
				let urlStr="doSave";
				if(that.identifyForm.id){
					urlStr="doUpdate";
				}	
				this.$refs['identifyForm'].validate((valid) => {
					if (valid) {
						that.$axios.post2("/afbase/goodsName/"+urlStr, that.identifyForm)
						.then(function(response) {
							if (response.data.code == 0) {
								that.openSuccess();
								that.querylist();
								
							}else {
								that.openError(response.data.messageInfo);
							}
						}.bind(this))
						.catch(function (error) {
							let errorinfo = error.message;
							this.openError(errorinfo);
						}.bind(this));

					} else {
						that.openError('检验不通过');
						console.log('error submit!!');
						return false;
					}
				});
			},
			onSendDelete(){
				let that = this;
				this.$axios.post2("/afbase/identify/deldeclare/" + that.identifyForm.orderIdentifyId).then(function(response) {
					if (response.data.code == 0) {
						that.openSuccess();
						that.querylist();
						
					}
				});
			},
			addafOrderIdentifyDetail(index,row){
				let newRow = Object.assign({},row);
				newRow.reportIssueNo='';
				newRow.reportIssueOrgan='';
				newRow.reportIssueDate='';
				newRow.reportApplicant='';
				newRow.reportGoodsCnname='';
				newRow.reportGoodsEnname='';
				this.identifyForm.afOrderIdentifyDetailList.push(newRow);
			},
			removeafOrderIdentifyDetail(index,row){
				if(this.identifyForm.afOrderIdentifyDetailList.length==1){
					row.reportIssueNo='';
					row.reportIssueOrgan='';
					row.reportIssueDate='';
					row.reportApplicant='';
					row.reportGoodsCnname='';
					row.reportGoodsEnname='';
					return;
				}
				this.identifyForm.afOrderIdentifyDetailList.splice(index,1); 
			},
			selectIdentify(row, column, event){
				
				this.identifyForm = JSON.parse(JSON.stringify(row));
				
				this.$refs.identify.setCurrentRow(row);
			},
			selectedHighlight(row, rowIndex){
				if ((this.currentRowIndex) === rowIndex ) {
					return {
						"background-color": "rgb(250, 195, 100)"
					};
				}
			},
			tableRowClassName(row, rowIndex){
				row.index = rowIndex;
			},
			setButtonStatus(status,aditstatus){
				if(!status||status=='save'){
					this.followSave=true;
					this.followSend=true;
					this.followSendDelete=false;
				}else if(status=='send'){
					this.followSave=false;
					this.followSend=false;
					this.followSendDelete=(aditstatus=='send');
				}else if(status=='delete'){
					this.followSave=false;
					this.followSend=false;
					this.followSendDelete=false;
				}else{
					this.followSave=true;
					this.followSend=true;
					this.followSendDelete=false;
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
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openAlert(info) {
				this.$notify({
					title: '提示',
					message: info,
					type: 'info',
					position: 'bottom-right'
				});
			},
            identifyTableRowClassName({row,rowIndex}) {
				return ''
			},
			querylist() {
				this.identify.loading = true;
				let that = this;
				this.$axios.get2("/afbase/goodsName/querylist", {
					orderId: this.frow.orderId,
					goodsCnnames: this.query.goodsCnnames
				}).then(function(response) {
					if (response.data.code == 0) {
						that.identify.loading = false;
						that.identify.data = response.data.data;
                    }
                });
			},
			sendGoodsName(){
				if (!this.frow.awbNumber) {
					this.openError("未配主单号，不能发送");
					return;
				}
				this.$axios.post("/afbase/send/doSendGoodsName/"+this.frow.orderId+"/"+this.frow.orderUuid+"/"+this.frow.awbNumber).then(function (response) {
		            if (response.data.code == 0) {
		                if(response.data.data.status=='success'){
		                  this.openSuccess('发送成功');
			            }else{
			                  this.openError(response.data.data.message);
			            }
		            } else {
		                this.openError(response.data.messageInfo || "发送失败!");
		            }
	            }.bind(this));
			},
			formatterStatus(row, column, cellValue, index){
				if(row.status=="save"){
					return "暂存";
				}else if(row.status=="send"){
					return "已申报";
				}else if(row.status=="delete"){
					return "删除";
				}
				return "";
			},
			formatterAuditStatus(row, column, cellValue, index){
				if(row.auditStatus=="send"){
					return "已审核";
				}else if(row.auditStatus=="delete"){
					return "删除";
				}
				return "";
			},
			
			handlePictureCardPreview(file) {
				//JPG,.JPEG,.BMP,.PNG,.GIF
				let type = file.raw&&file.raw.type?file.raw.type.toLowerCase():'';
				if(!type){
					let url = file.url;
					let suffix = url.substring(url.lastIndexOf('.')+1);
					if(!suffix){
						suffix = '';
					} 
					if(suffix.toLowerCase()=='jpg'||suffix.toLowerCase()=='bmp'||suffix.toLowerCase()=='jpeg'||suffix.toLowerCase()=='gif')
					{
						type = "image/" + suffix.toLowerCase();
					}
				}
				if(type=="image/jpg" ||type=="image/jpeg"
					||type=="image/bmp"||type=="image/png"
					||type=="image/gif"){
					this.dialogImageUrl = file.url;
					this.dialogVisible = true;
				}else{
					window.open(file.url);
				}
			},
			handleDownload(file) {
				// console.log(file);
				window.open(file.url);

			},
			handlerUrls(){
				let urls = '';
				for(var i=0;i<this.filelist.length;i++){
					if(i==0){
						urls = this.filelist[i].url;
					}else{
						urls += ';' + this.filelist[i].url;
					}
				}
				return urls;
			},
			beforeUpload(file) {
				if(!this.frow.viewFlag){
					this.$message.error('查看操作不能上传附件!');
					return false;
				}
				if(this.filelist.length>=10){
					this.$message.error('上传文件最多只能上传10个!');
					return false;
				}
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				if (month < 10) {
					month = '0' + month
				}
				this.uptoken.key = "OrderIdentify_attachment_" + year.toString().substring(2) + month + "_" 
						+ this.hexMD5(new Date().getTime()) + '_' + file.name.replaceAll(/_/g,'');
				const isLt1M = file.size < 1 * 1024 * 1024;
				if (!isLt1M) {
					this.$message.error('上传模板大小不能超过 1MB!');
				}
				if (isLt1M) {

					this.fileUrl = "http://doc.yctop.com/" + this.uptoken.key
					this.fileName = file.name.substring(0, file.name.lastIndexOf('.'));
				}
				return isLt1M;
			},
			handleSuccess(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.fileUrl = "http://doc.yctop.com/" + response.key;
				file.url = this.fileUrl;
				this.filelist.push(file);
				// if(this.filelist.length>10){
				// 	this.isFollowUpload = false;
				// }else{
				// 	this.isFollowUpload = true;
				// }
			},
			handleRemove(file, fileList) {
				this.fileUrl = '';
				this.fileName = '';
				for(var i=0;i<this.filelist.length;i++){
					let tempFile = this.filelist[i];
					if(tempFile.url==file.url){
						this.filelist.splice(i,1);
						return;
					}
				}
			},
			//MD5
			safeAdd(x, y) {
				let lsw = (x & 0xffff) + (y & 0xffff)
				let msw = (x >> 16) + (y >> 16) + (lsw >> 16)
				return (msw << 16) | (lsw & 0xffff)
			},

			bitRotateLeft(num, cnt) {
				return (num << cnt) | (num >>> (32 - cnt))
			},

			md5cmn(q, a, b, x, s, t) {
				return this.safeAdd(this.bitRotateLeft(this.safeAdd(this.safeAdd(a, q), this.safeAdd(x, t)), s), b)
			},

			md5ff(a, b, c, d, x, s, t) {
				return this.md5cmn((b & c) | (~b & d), a, b, x, s, t)
			},

			md5gg(a, b, c, d, x, s, t) {
				return this.md5cmn((b & d) | (c & ~d), a, b, x, s, t)
			},

			md5hh(a, b, c, d, x, s, t) {
				return this.md5cmn(b ^ c ^ d, a, b, x, s, t)
			},

			md5ii(a, b, c, d, x, s, t) {
				return this.md5cmn(c ^ (b | ~d), a, b, x, s, t)
			},

			binlMD5(x, len) {
				/* append padding */
				x[len >> 5] |= 0x80 << (len % 32)
				x[((len + 64) >>> 9 << 4) + 14] = len

				let i
				let olda
				let oldb
				let oldc
				let oldd
				let a = 1732584193
				let b = -271733879
				let c = -1732584194
				let d = 271733878

				for (i = 0; i < x.length; i += 16) {
					olda = a
					oldb = b
					oldc = c
					oldd = d

					a = this.md5ff(a, b, c, d, x[i], 7, -680876936)
					d = this.md5ff(d, a, b, c, x[i + 1], 12, -389564586)
					c = this.md5ff(c, d, a, b, x[i + 2], 17, 606105819)
					b = this.md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
					a = this.md5ff(a, b, c, d, x[i + 4], 7, -176418897)
					d = this.md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
					c = this.md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
					b = this.md5ff(b, c, d, a, x[i + 7], 22, -45705983)
					a = this.md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
					d = this.md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
					c = this.md5ff(c, d, a, b, x[i + 10], 17, -42063)
					b = this.md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
					a = this.md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
					d = this.md5ff(d, a, b, c, x[i + 13], 12, -40341101)
					c = this.md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
					b = this.md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

					a = this.md5gg(a, b, c, d, x[i + 1], 5, -165796510)
					d = this.md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
					c = this.md5gg(c, d, a, b, x[i + 11], 14, 643717713)
					b = this.md5gg(b, c, d, a, x[i], 20, -373897302)
					a = this.md5gg(a, b, c, d, x[i + 5], 5, -701558691)
					d = this.md5gg(d, a, b, c, x[i + 10], 9, 38016083)
					c = this.md5gg(c, d, a, b, x[i + 15], 14, -660478335)
					b = this.md5gg(b, c, d, a, x[i + 4], 20, -405537848)
					a = this.md5gg(a, b, c, d, x[i + 9], 5, 568446438)
					d = this.md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
					c = this.md5gg(c, d, a, b, x[i + 3], 14, -187363961)
					b = this.md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
					a = this.md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
					d = this.md5gg(d, a, b, c, x[i + 2], 9, -51403784)
					c = this.md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
					b = this.md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

					a = this.md5hh(a, b, c, d, x[i + 5], 4, -378558)
					d = this.md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
					c = this.md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
					b = this.md5hh(b, c, d, a, x[i + 14], 23, -35309556)
					a = this.md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
					d = this.md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
					c = this.md5hh(c, d, a, b, x[i + 7], 16, -155497632)
					b = this.md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
					a = this.md5hh(a, b, c, d, x[i + 13], 4, 681279174)
					d = this.md5hh(d, a, b, c, x[i], 11, -358537222)
					c = this.md5hh(c, d, a, b, x[i + 3], 16, -722521979)
					b = this.md5hh(b, c, d, a, x[i + 6], 23, 76029189)
					a = this.md5hh(a, b, c, d, x[i + 9], 4, -640364487)
					d = this.md5hh(d, a, b, c, x[i + 12], 11, -421815835)
					c = this.md5hh(c, d, a, b, x[i + 15], 16, 530742520)
					b = this.md5hh(b, c, d, a, x[i + 2], 23, -995338651)

					a = this.md5ii(a, b, c, d, x[i], 6, -198630844)
					d = this.md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
					c = this.md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
					b = this.md5ii(b, c, d, a, x[i + 5], 21, -57434055)
					a = this.md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
					d = this.md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
					c = this.md5ii(c, d, a, b, x[i + 10], 15, -1051523)
					b = this.md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
					a = this.md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
					d = this.md5ii(d, a, b, c, x[i + 15], 10, -30611744)
					c = this.md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
					b = this.md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
					a = this.md5ii(a, b, c, d, x[i + 4], 6, -145523070)
					d = this.md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
					c = this.md5ii(c, d, a, b, x[i + 2], 15, 718787259)
					b = this.md5ii(b, c, d, a, x[i + 9], 21, -343485551)

					a = this.safeAdd(a, olda)
					b = this.safeAdd(b, oldb)
					c = this.safeAdd(c, oldc)
					d = this.safeAdd(d, oldd)
				}
				return [a, b, c, d]
			},

			binl2rstr(input) {
				let i
				let output = ''
				let length32 = input.length * 32
				for (i = 0; i < length32; i += 8) {
					output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
				}
				return output
			},

			rstr2binl(input) {
				let i
				let output = []
				output[(input.length >> 2) - 1] = undefined
				for (i = 0; i < output.length; i += 1) {
					output[i] = 0
				}
				let length8 = input.length * 8
				for (i = 0; i < length8; i += 8) {
					output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
				}
				return output
			},

			rstrMD5(s) {
				return this.binl2rstr(this.binlMD5(this.rstr2binl(s), s.length * 8))
			},

			rstr2hex(input) {
				var hexTab = '0123456789abcdef'
				var output = ''
				var x
				var i
				for (i = 0; i < input.length; i += 1) {
					x = input.charCodeAt(i)
					output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
				}
				return output
			},

			str2rstrUTF8(input) {
				return unescape(encodeURIComponent(input))
			},

			hexMD5(s) {
				return this.rstr2hex(this.rawMD5(s))
			},
			rawMD5(s) {
				return this.rstrMD5(this.str2rstrUTF8(s))
			},
			formatToFloat(item) {
				if (item == 'quantity') {
					this.identifyForm.quantity = this.identifyForm.quantity.replace(/[^0123456789]/g, "");
				}
			},
		},
		created() {
			
			this.identifyForm.orderId = this.frow.orderId;
			this.querylist();
			
			
			
		}
	}
</script>
