<template>
	<el-dialog title="客户项目——新建——选择联系人" width="45%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>

      <div>
      <el-table :data="data1" height="400px">
          <el-table-column prop="contacts_type" label="类型" width="80"></el-table-column>
          <el-table-column prop="contacts_name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="phone_number" label="电话" width="120"></el-table-column>
          <el-table-column prop="email" label="邮件" ></el-table-column>
          <el-table-column prop="dept_name" label="部门" width="100"></el-table-column>
          <el-table-column prop="job_position" label="职务" width="100"></el-table-column>
          <el-table-column prop="tel_number" label="固话" width="100"></el-table-column>
        <el-table-column  label="操作" width="60">
        	<template slot-scope="scope">
            <el-button type="text" size="small" v-on:click="doSelect(scope.row)" >选择</el-button>
            
          </template>
        </el-table-column>
        <!-- :formatter="formatter1" -->
      </el-table>
      </div>
      <div>
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageConf.pageCode"
          :page-sizes="pageConf.pageOption"
          :page-size.sync="pageConf.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageConf.totalPage">
        </el-pagination>
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
        loading: false,
        data1: [],
        options:[],
        options2:[],
        pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录数
            totalPage: 0, //总记录数
            pageOption: [10, 50, 100]
        },
        query: {
          coopMnemonicV: '',
          coopNameV: '',
          awbFromType: ''
        },
        saveVisible:false
      }
    },
   
    inject:['setUserValue'],
    created: function(){
     //  alert(this.frow.coopId);
    	// this.query.awbFromType="'互为代理','外部客户','海外代理'";
     
      this.queryList();
    },

    methods: {
      openError(info) {
        this.$notify({
          title: '',
          message: '操作失败，'+info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      doSelect(rrow){
        this.setUserValue(rrow);
        this.handleClose();
      } ,
      queryList(){
          let params = {
          currentPage: this.pageConf.pageCode,
          pageSize: this.pageConf.pageSize,
          coop_id: this.frow.coopId
        }
        this.$axios.post('/prm/coop/queryCoopContactsList',
            params)
          .then(function(response) {
            let code = response.data.code;
            this.data1 = response.data.data.dataList;
            this.pageConf.totalPage = response.data.data.totalNum;

          }.bind(this));
             
        
      },
      queryList2(current){   
      let param = "size="+this.pageConf.pageSize+"&current="+current
          +"&coopMnemonicV="+this.query.coopMnemonicV+"&coopNameV="+this.query.coopNameV
          +"&awbFromType="+this.query.awbFromType;
        let that  = this;
        this.$axios.get('/afbase/awb/selectpage?'+param).then(function(response){
            that.data1 = response.data.data.records;
            that.pageConf.totalPage=response.data.data.total;
        }).catch(function (error) {
          console.log(error);
        });
      },
      //pageSize改变时触发的函数
      handleSizeChange() {
        this.queryList();
      },
      //当前页改变时触发的函数
      handleCurrentChange() {
        this.queryList();
      },
      
      formatter1(row, column){
          return row.awbFromType+' - '+row.awbFromName;
      },
      formatter2(row, column){
        if (row.apLongitude&&row.apLatitude) {
          return row.apLongitude+","+row.apLatitude;
        }else{
          return "";
        }
      },
	handleClose() {
		this.$emit('update:visible', false);
	}

//--------------------- 

    }
  }
</script>
<style type="text/css">

</style>