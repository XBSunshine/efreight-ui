<template>
	<el-dialog :title="'公司名片 - '+titleName " width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;" append-to-body>
        <div>
        	<div style="padding:0px 10px 0px 10px">
        		<span style="font-size: 16px;color:rgb(19, 125, 250);"><span style="font-size: 20px;color:rgb(19, 125, 250);">></span> 公司简介</span>
        	</div>
        	<div style="padding:15px 10px 10px 30px">
            <span style="font-size: 14px;" v-html="companyProfile"></span>
          </div>

          <div style="padding:0px 10px 0px 10px">
            <span style="font-size: 16px;color:rgb(19, 125, 250);"><span style="font-size: 20px;color:rgb(19, 125, 250);">></span> 优势介绍</span>
          </div>
          <div style="padding:15px 10px 10px 30px">
            <span style="font-size: 14px;" v-html="companyAdvantage"></span>
          </div>

          <div style="padding:0px 10px 0px 10px">
            <span style="font-size: 16px;color:rgb(19, 125, 250);"><span style="font-size: 20px;color:rgb(19, 125, 250);">></span> 联系方式</span>
          </div>
          <div style="padding:15px 10px 10px 30px">
            <span style="font-size: 14px;" v-html="companyContactInfo"></span>
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
          companyProfile: '',
          companyAdvantage: '',
          companyContactInfo: '',
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

			},
		},
		created() {
        this.titleName = (this.frow.orgName || "");
        this.companyProfile = (this.frow.companyProfile || "").replace(/\n/g, '<br>');
        this.companyAdvantage = (this.frow.companyAdvantage || "").replace(/\n/g, '<br>');
        this.companyContactInfo = (this.frow.companyContactInfo || "").replace(/\n/g, '<br>');
		}
	}
</script>
