<template>
<el-dialog title="状态详情" width="1100px" :visible.sync="visible" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
	<div class="af_order_class">
    <el-table :data="trackData" height="480" tooltip-effect="dark" ref="multipleTable" >
      <el-table-column align="center" prop="awbNumber" width="360" label="提单号" :formatter="formatter_column"></el-table-column>
      <el-table-column align="center" prop="eventTime" width="180" label="回执时间"></el-table-column>
      <el-table-column align="center" prop="quantity" width="180" label="件重" :formatter="formatter_column"></el-table-column>
      <el-table-column align="left" header-align="center" prop="remark" width="360" label="回执内容"></el-table-column>
    </el-table>
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
        trackData:[]
			}
		},
   provide() {
   	return {
   		handleClose: this.handleClose,
   	}
   },
    created() {
		  let param = {};
		  param['awbNumber'] = this.frow.awbNumber;
		  param['hawbNumber'] = this.frow.hawbNumber;
      this.$axios.get2('/afbase/aforder/getOperationLookTrackList', param) .then(function(response) {
        if (0 == response.data.code) {
          this.trackData = response.data.data;
        } else {
          this.openError(response.data.messageInfo || "数据获取失败");
        }
      }.bind(this)).catch(function(error) {
        console.error(error);
        this.openError("访问失败")
      }.bind(this))
    },
	methods: {
    // 关闭
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
    },
    formatter_column(data, column) {
      let tempString = '';
      switch (column.property) {
        case "awbNumber":
          tempString = data[column.property] + (data['hawbNumber'] ? "_"+ data['hawbNumber'] : '');
          break;
        case "quantity":
          let quantity = data[column.property], grossWeight = data['grossWeight'];
          tempString = (( quantity == 0 || quantity ) ? quantity : '-') + " / " + ((grossWeight == 0 || grossWeight) ? grossWeight : '-');
          break;
        default:
          break;
      }
      return tempString;
    }
  }
	}
</script>

