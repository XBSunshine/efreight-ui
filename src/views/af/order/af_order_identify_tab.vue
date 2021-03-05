<template>
	<div class="identify-container" id="identify">
        <!-- <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="newIdentify">新建鉴定</el-button> -->
        <el-table border highlight-current-row ref="identify" v-loading="identify.loading" :data="identify.data" :row-class-name="identifyTableRowClassName" @row-click="selectIdentify">
            <el-table-column align="center" prop="carrierId" label="承运人" width="100" ></el-table-column>
            <el-table-column align="center" prop="agentHandlerName" label="操作人中文姓名" width="*"></el-table-column>
            <el-table-column align="center" prop="status" label="状态" width="120" :formatter="formatterStatus"></el-table-column>
            <el-table-column align="center" prop="declareDate" label="申报时间" width="150"></el-table-column>
            <el-table-column align="center" prop="auditStatus" label="审核状态" width="150" :formatter="formatterAuditStatus"></el-table-column>
            <el-table-column align="center" prop="auditName" label="审核人" width="150"></el-table-column>
            <el-table-column align="center" prop="auditDate" label="审核时间" width="150"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope" v-if="frow.viewFlag&&frow.finishFlag">
                    <el-button @click.native.stop="deleteClick(scope.row)" v-if="scope.row.followDelete" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

		<el-form :rules="identifyRules" :inline="true" ref="identifyForm" label-width="100px" class="identify-form" :model="identifyForm">
			<el-form-item label="承运人">
				<el-input :disabled="isdisabled" v-model="identifyForm.carrierId" maxlength="2" @input="identifyForm.carrierId=identifyForm.carrierId.toUpperCase()" auto-complete="off">
				</el-input>
			</el-form-item>
			<el-form-item prop="agentHandlerName" label="操作人中文姓名" label-width="200">
				<el-input :disabled="isdisabled" v-model="identifyForm.agentHandlerName" maxlength="32" auto-complete="off">
				</el-input>
			</el-form-item>
			<el-form-item v-if="frow.viewFlag&&frow.finishFlag">
				<el-button :disabled="isdisabled" v-if="followSave" type="primary" size="mini" @click="onSave">暂存</el-button>
				<el-button :disabled="isdisabled" v-if="followSend" type="primary" size="mini" @click="onSend">发送</el-button>
				<el-button v-if="followSendDelete" type="primary" size="mini" @click="onSendDelete">发送删除申请</el-button>
				<el-button :disabled="isdisabled" type="primary" size="mini" @click="add">新建</el-button>

				<span class="upload-title-explain">(格式：jpg/jpeg/bmp/png/gif/pdf/excel/word，大小不超过5M)</span>
			</el-form-item>

			<el-table border :data="identifyForm.afOrderIdentifyDetailList" :row-class-name="identifyTableRowClassName">
				<el-table-column align="center" width="90" v-if="frow.viewFlag&&frow.finishFlag">
					<template slot="header" slot-scope="scope">
						<i class="iconfont el-icon-myyuanquanjiahao" @click="addafOrderIdentifyDetail(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" @click="removeafOrderIdentifyDetail(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>

				<el-table-column :render-header="renderHeader" label="报告编号" width="180" prop="reportIssueNo">
					<template slot-scope="scope">
						<el-input :disabled="isdisabled" maxlength="50" size="small" v-model="scope.row.reportIssueNo"></el-input>
					</template>
				</el-table-column>
				<el-table-column :render-header="renderHeader" label="鉴定机构" width="180" prop="reportIssueOrgan">
					<template slot-scope="scope">
						<el-select :disabled="isdisabled" v-model="scope.row.reportIssueOrgan" placeholder="请选择鉴定机构">
							<el-option label="上海化工" value="上海化工"></el-option>
							<el-option label="南京理工" value="南京理工"></el-option>
							<el-option label="计量" value="计量"></el-option>
							<el-option label="北京迪捷姆" value="北京迪捷姆"></el-option>
							<el-option label="信诺递捷" value="信诺递捷"></el-option>
							<el-option label="广州测试中心" value="广州测试中心"></el-option>
							<el-option label="上海海关" value="上海海关"></el-option>
							<el-option label="常州检测中心" value="常州检测中心"></el-option>
							<el-option label="其他" value="其他"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column :render-header="renderHeader" label="签发日期" width="240" prop="reportIssueDate">
					<template slot-scope="scope">
						<el-date-picker :disabled="isdisabled" v-model="scope.row.reportIssueDate" type="date" placeholder="选择日期" 
								value-format="yyyy-MM-dd"></el-date-picker>
					</template>
				</el-table-column>
				<el-table-column label="委托单位" width="180" prop="reportApplicant">
					<template slot-scope="scope">
						<el-input :disabled="isdisabled" maxlength="70" size="small" v-model="scope.row.reportApplicant"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="中文品名" width="*" >
					<template slot-scope="scope">
						<el-input :disabled="isdisabled" maxlength="255" size="small" v-model="scope.row.reportGoodsCnname"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="英文品名" width="*" >
					<template slot-scope="scope">
						<el-input :disabled="isdisabled" maxlength="255" size="small" v-model="scope.row.reportGoodsEnname"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="上传附件" width="120" >
					<template slot-scope="scope">
						<div v-if="scope.row.reportImgUrl">
							<span class="el-upload-list__item-preview el-upload-icon" >
								<i class="el-icon-zoom-in" v-if="checkImage(scope.row.reportImgUrl)" @click="handlePictureCardPreview(scope.row.reportImgUrl)"></i>
								<i class="el-icon-download" @click="handleDownload(scope.row.reportImgUrl)"></i>
								<i class="el-icon-delete" v-if="frow.viewFlag&&frow.finishFlag" @click="handleRemove(scope.row)"></i>
							</span>							
						</div>						
						<el-upload :disabled="uploadDisabled" v-else :action="actionPath" :accept="acceptFileFormat" list-type="picture" :auto-upload="true"
							:show-file-list="false" :data="uptoken" :before-upload="beforeUpload" :on-remove="handleRemove" 
							:on-success="function(res,file,fileList){ return handleSuccess(res,file,fileList,scope.row)}" :limit="1">
							<i slot="default" class="el-icon-plus" v-if="frow.viewFlag&&frow.finishFlag"></i>							
						</el-upload>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog :visible.sync="dialogVisible" :center="true" :modal="false">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>

		</el-form>
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
		font-size: 12px;
	}
	#identify .el-upload-icon{
		font-size: 16px;
		cursor: pointer;
		margin: 0px 5px;
	}
	#identify .el-upload-list_item_containter{
		height: 100%;
	}
	#identify .el-icon-plus{
		font-size: 16px;
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
import data from '@/assets/Carrier.json'
	//鉴定证书
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
				isdisabled:false,
				uploadDisabled:false,
				followSave:true,
				followSend:true,
				followSendDelete:false,
				isFollowUpload:true,
                identify: {
					loading: false,
					data: [],
					ffrow: '',
					currRow: '',
					token:''
                },
				identifyForm:{
					orderIdentifyId:'',
					orgId:'',
					orderId:'',
					agentHandlerName:'',
					awbNumber:'',
					carrierId:'',
					cargoTerminal:'NKG',
					reportImgUrls:'',
					createId:'',
					creatorName:'',
					createDate:'',
					declareId:'',
					declareName:'',
					declareDate:'',
					status:'',
					auditId:'',
					auditName:'',
					auditDate:'',
					auditStatus:'',
					originalSyscode:'',
					afOrderIdentifyDetailList:[{
						Id:'',
						masterid:'',
						reportIssueNo:'',
						reportIssueOrgan:'',
						reportIssueDate:'',
						reportApplicant:'',
						reportGoodsCnname:'',
						reportGoodsEnname:'',
						reportImgUrl:''
					}]
				},
				identifyRules:{
					carrierId: [{
						required: true,
						message: "请输入承运人",
						trigger: ["blur", "change"],
					},{
						min: 1,
						max: 2,
						message: "长度不超过 2",
						trigger: ["blur", "change"],
					}],
					agentHandlerName: [{
						required: true,
						message: "请输入操作人中文姓名",
						trigger: ["blur", "change"],
					},{
						min: 1,
						max: 32,
						message: "长度不超过 32",
						trigger: ["blur", "change"],
					}],
					reportIssueNo: [{
						required: true,
						message: "请输入报告编号",
						trigger: ["blur", "change"],
					},{
						min: 1,
						max: 50,
						message: "长度不超过 50",
						trigger: ["blur", "change"],
					}],
					reportIssueOrgan: [{
						required: true,
						message: "请选择鉴定机构",
						trigger: ["blur", "change"],
					}],
					reportIssueDate: [{
						required: true,
						message: "请输入签发日期",
						trigger: ["blur", "change"],
					}],
					reportApplicant: [{
						required: true,
						message: "请输入委托单位",
						trigger: ["blur", "change"],
					},{
						min: 1,
						max: 70,
						message: "长度不超过 70",
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
				fileUrl:'',
				fileName:'',
			};
		},
		inject: ['findByPage'],
		components: {

		},
		provide() {
			// return {
			// 	sizeCallback: this.sizeCallback,
			// 	queryInboundList: this.queryInboundList
			// }
		},
		methods: {
			// showOperateButton(index,row){
			// 	if(!identifyForm) return true;
			// 	if(identifyForm.status=='send'||identifyForm.status=='delete'){
			// 		return false;
			// 	}
			// 	return true;
			// },
			checkImage(filename){
				
				if(filename&&(filename.indexOf('.jpg')>=0||filename.indexOf('.bmp')>=0||filename.indexOf('.jpeg')>=0
						||filename.indexOf('.gif')>=0||filename.indexOf('.png')>=0)){
					return true;
				}else if(filename&&(filename.indexOf('.pdf')>=0||filename.indexOf('.doc')>=0||filename.indexOf('.docx')>=0
						||filename.indexOf('.xls')>=0||filename.indexOf('.xlsx')>=0)){
					return false;
				}
				return false;
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
			add:function(){
				this.identifyForm.orderIdentifyId='';
				this.identifyForm.declareId='',
				this.identifyForm.declareName='',
				this.identifyForm.declareDate='',
				this.identifyForm.reportImgUrls='',
				this.identifyForm.status='',
				this.identifyForm.auditId='',
				this.identifyForm.auditId='',
				this.identifyForm.auditName='',
				this.identifyForm.auditDate='',
				this.identifyForm.auditStatus='',
				this.identifyForm.originalSyscode='',
				this.identifyForm.afOrderIdentifyDetailList=[{
					Id:'',
					masterid:'',
					reportIssueNo:'',
					reportIssueOrgan:'',
					reportIssueDate:'',
					reportApplicant:'',
					reportGoodsCnname:'',
					reportGoodsEnname:'',
					reportImgUrl:''
				}];
				this.fileUrl='';
				this.fileName='';
				this.setButtonStatus('','');
			},
			//删除暂存
			deleteClick(row){
				if(row.status=='save'||row.status=='delete'){
					let that = this;
					let params = {
						pageName: this.frow.pageName
					}
					that.$axios.post("/afbase/identify/delete/" + row.orderIdentifyId+"/"+this.frow.pageName).then(function(response) {
						if (response.data.code == 0) {
							that.openSuccess();
							that.queryIdentifyList();
							that.add();
							//刷新日志tab
							that.frow.updateLogTab=true;
							//刷新电子单证tab
							that.frow.updateState=true;
						}else {
							that.openError(response.data.messageInfo);
						}
					}.bind(this))
					.catch(function (error) {
						let errorinfo = error.message;
						this.openError(errorinfo);
					}.bind(this));
					
				}else{
					this.openAlert('对不起，只有状态为暂存或删除的鉴定信息才能被清除！');
				}
			},
			onSave(){
				this.commonSave('save');
			},
			onSend(){
				this.commonSave('send');
			},
			//暂存和发送
			commonSave(status){
				let that = this;
				// that.identifyForm.reportImgUrls = that.handlerUrls();
				that.identifyForm.status= status;
				if(!that.identifyForm.orderId){
					that.identifyForm.orderId = that.frow.orderId;
				}
				if(!that.identifyForm.awbNumber){
					that.identifyForm.awbNumber = that.frow.awbNumber;
				}
				// if(!that.identifyForm.reportImgUrls){
				// 	that.openError('请上传文件信息');
				// 	return false;
				// }
				if(!that.identifyForm.afOrderIdentifyDetailList||that.identifyForm.afOrderIdentifyDetailList.length==0){
					that.openError('请填写鉴定详细信息');
					return false;
				}
				var hasPicture = false;
				for(var i in that.identifyForm.afOrderIdentifyDetailList){
					let detail = that.identifyForm.afOrderIdentifyDetailList[i];
					if(detail.reportImgUrl){
						hasPicture = true;
						break;
					}
				}

				if(!hasPicture){
					that.openError('请上传鉴定信息的附件');
					return false;
				}

				if(!status) status='save';
				this.$refs['identifyForm'].validate((valid) => {
					that.identifyForm.pageName=this.frow.pageName;
					if (valid) {
						that.$axios.post2("/afbase/identify/"+(status=='send'?'declare':'save'), that.identifyForm)
						.then(function(response) {
							if (response.data.code == 0) {
								that.openSuccess();
								that.queryIdentifyList();
								that.add();
								//发送操作需刷新日志tab
								that.frow.updateLogTab=true;
								//刷新电子单证tab
								that.frow.updateState=true;
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
			//删除申请
			onSendDelete(){
				let that = this;
				this.$axios.post2("/afbase/identify/deldeclare/" + that.identifyForm.orderIdentifyId+"/"+this.frow.pageName).then(function(response) {
					if (response.data.code == 0) {
						that.openSuccess();
						that.queryIdentifyList();
						that.add();
						//刷新日志tab
						this.frow.updateLogTab=true;
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
				newRow.reportImgUrl='';
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
					row.reportImgUrl='';
					return;
				}
				this.identifyForm.afOrderIdentifyDetailList.splice(index,1); 
			},
			selectIdentify(row, column, event){
				this.identifyForm = JSON.parse(JSON.stringify(row));			
				this.setButtonStatus(row.status,row.auditStatus);
				row.currentRowIndex = row.index;
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
			queryIdentifyList() {
				this.identify.loading = true;
				let that = this;
				this.$axios.get2("/afbase/identify/querylist", {
					orderId: this.frow.orderId
				}).then(function(response) {
					if (response.data.code == 0) {
						that.identify.loading = false;
						that.identify.data = response.data.data;
						for(var i=0;that.identify.data&&i<that.identify.data.length;i++){
							let identifyItem = that.identify.data[i];
							if(identifyItem.status=='send'||identifyItem.aditstatus=='send'){
								identifyItem.followDelete = false;
							}else{
								identifyItem.followDelete  = true;
							}
						}
                    }
                });
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
			
			handlePictureCardPreview(fileurl) {
				//JPG,.JPEG,.BMP,.PNG,.GIF
				
				let type ='';
				let url = fileurl;
				let suffix = url.substring(url.lastIndexOf('.')+1);
				if(!suffix){
					suffix = '';
				} 
				if(suffix.toLowerCase()=='jpg'||suffix.toLowerCase()=='bmp'||suffix.toLowerCase()=='jpeg'||suffix.toLowerCase()=='gif'||suffix.toLowerCase()=='png'){
					type = "image/" + suffix.toLowerCase();
				}

				if(type=="image/jpg" ||type=="image/jpeg"
					||type=="image/bmp"||type=="image/png"
					||type=="image/gif"){
					this.dialogImageUrl = fileurl;
					this.dialogVisible = true;
				}else{
					window.open(fileurl);
				}
			},
			handleDownload(fileurl) {
				window.open(fileurl);

			},
			beforeUpload(file) {
				if(!this.frow.viewFlag){
					this.$message.error('查看操作不能上传附件!');
					return false;
				}
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				if (month < 10) {
					month = '0' + month
				}
				let orguuid = '';
				if(window.localStorage.getItem('orgUuid')){
					orguuid = window.localStorage.getItem('orgUuid') + "/";
				}
				this.uptoken.key =  "org/" + year.toString().substring(2) + month + "/" + orguuid +
						"orderIdentify_" + this.frow.departureStation +"_"+ this.hexMD5(new Date().getTime()) + '_' 
						+ file.name.replace(/_/g,'').replace(/&/g,'');
				
				const isLt1M = file.size < 5 * 1024 * 1024;
				if (!isLt1M) {
					this.$message.error('上传模板大小不能超过 5MB!');
				}
				if (isLt1M) {

					this.fileUrl = "http://doc.efreight.cn/" + this.uptoken.key
					this.fileName = file.name.substring(0, file.name.lastIndexOf('.'));
				}
				return isLt1M;
			},
			handleSuccess(response, file, fileList,row) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.fileUrl = "http://doc.efreight.cn/" + response.key;
				file.url = this.fileUrl;
				row.reportImgUrl = this.fileUrl;
			},
			handleRemove(row) {
				row.reportImgUrl='';
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
			queryCarrierId(){
				if(this.frow.awbNumber!=null&&this.frow.awbNumber!=''){
					var num = this.frow.awbNumber.split('-')[0];
					this.identifyForm.carrierId=data[num];
				}else{
					// this.isdisabled = true;
					// this.uploadDisabled = true;
				}
			}
		},
		created() {
			if (!this.frow.pageName) {
				this.frow.pageName='AE订单';
			}
			this.queryIdentifyList();
			this.identifyForm.orderId = this.frow.orderId;
			this.identifyForm.awbNumber =this.frow.awbNumber;
			let flightNo = this.frow.flightDateBegin;
			if(flightNo && flightNo.length>2){
				this.identifyForm.carrierId = this.frow.flightDateBegin.substring(0,2);
			}
			this.isdisabled = !this.frow.viewFlag;
			this.uploadDisabled = !this.frow.viewFlag;
			this.queryCarrierId();
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.uptoken.token = response.data.data;
					if (this.uptoken.token == null || this.uptoken.token == '') {
						this.$message.error('因缺失token，无法上传文件，故无法新增附件')
					}
				}.bind(this));
		}
	}
</script>
