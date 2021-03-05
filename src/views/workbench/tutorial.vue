<template>
  <div class="tutorial">
    <div class="list_body" >
      <ul class="list" v-for="item in tutorials" :key="item.id">
        <div class="list_top"><span class="systemMark"></span> {{item.title}}</div>
        <!--        <div slot="header" class="clearfix"><span class="systemMark"></span> <h3 style="display: inline">{{item.title}}</h3> </div>-->
        <li v-for="video in item.videos" :key="video.id" @click="playVideo(video.url)">
          <div class="title">{{video.title}}</div>
        </li>
      </ul>
    </div>
    <el-dialog title="视频播放" :visible.sync="videoPlayVisible" width="800px" :before-close="handleClose">
      <video id="tutorialVideo" :src="currentPlayUrl" width="780px" controls="controls"></video>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .tutorial .mark{
    display: inline;
    background-color: #479BFF;
    border: 2px solid #479BFF;
    margin-right: 10px;
  }
  .tutorial .el-row{
    padding: 10px;
  }
  .tutorial .video-cover{
    width:202px;
    height: 132px;
    background-image: url('../../assets/images/tutorial_cover.png');
  }
  .tutorial .list{
    clear: both;
    height: 142px;
    width: 100%; margin: 10px 0px 10px 0px;
    list-style: none; padding: 0;
  }
  .tutorial .list_top{
    clear: both; font-weight: bold; border-left: 5px solid #4282e4; padding-left: 8px; height:20px; line-height: 20px;
  }
  .tutorial .list_body{
    clear: both;
    padding: 20px;
    width: 100%;
    padding-bottom: 25px;;
  }
  .tutorial .list li{
    float: left;
    margin: 5px 5px 5px 0px;
    width:202px;
    height: 133px;
    background-image: url('../../assets/images/tutorial_cover.png');
    list-style: none;
    cursor:pointer
  }
  .tutorial .list li .title{
    text-align: center;
    margin-top: 90px;
    width: 100%;
    clear: both;
    color: #FFF;
    font-size: 13px;
  }
</style>
<script type="text/javascript">
  import video_cover from '../../assets/images/tutorial_cover.png';

  export default {
    data(){
      return {
        tutorials: [
          {
              id: 1,
              title: '组织结构管理',
              videos: [
                  {id: 14, title:'公司配置', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1597110241835_025.mp4'},
                  {id: 11, title:'部门管理', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1585652524168_016.mp4'},
                  {id: 12, title:'角色管理', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1585652544617_017.mp4'},
                  {id: 13, title:'用户管理', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1585652570494_018.mp4'},
                  {id: 16, title:'工作组管理', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210301114439.mp4'},
                  {id: 17, title:'日志管理', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210301114825.mp4'},
                  {id: 15, title:'个人信息配置', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1597110012645_022-200801.mp4'},
              ]
          },
          {
              id: 6,
              title: '客商资料管理',
              videos: [
                  {id: 61, title:'客商资料', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210303141422.mp4'},
                  {id: 62, title:'发货人', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210303141507.mp4'},
                  {id: 63, title:'询盘代理', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210303141522.mp4'},
                  {id: 64, title:'协作公司', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210303141535.mp4'},
              ]
          },
          {
              id: 2,
              title: '基础数据维护-公共信息',
              videos: [
                  {id: 21, title:'币种汇率', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1585652608702_019.mp4'},
                  {id: 22, title:'服务类别', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1585652627927_020.mp4'},
                  {id: 25, title:'科目维护', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302093230.mp4'},
              ]
          },
          {
              id: 7,
              title: '基础数据维护-空运信息',
              videos: [
                  {id: 71, title:'主单号管理', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1585652650046_021.mp4'},
                  {id: 72, title:'货站仓库', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1588929987175_023.mp4'},
                  {id: 73, title:'附加费', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302093801.mp4'},
                  {id: 74, title:'TACT', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302093832.mp4'},
                  {id: 75, title:'公布价', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302133953.mp4'},
              ]
          },
          {
              id: 8,
              title: '基础数据维护-海运信息',
              videos: [
                  {id: 81, title:'船名信息', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302143158.mp4'},
                  {id: 82, title:'堆场仓库', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302143001.mp4'},
              ]
          },
          {
              id: 9,
              title: '基础数据维护-铁路信息',
              videos: [
                  {id: 91, title:'铁路产品', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302143440.mp4'},
                  {id: 92, title:'堆场仓库', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302143918.mp4'},
              ]
          },
          {
              id: 10,
              title: '基础数据维护-陆运信息',
              videos: [
                  {id: 101, title:'车辆信息', cover: video_cover, url: 'http://doc.yctop.com/org/config/cfd5b05a-d54e-11ea-9d24-00163e307fbb/template_debit_note_pdf_ch_210302144057.mp4'},
              ]
          },
          {
            id: 3,
            title: '订单操作管理-空运出口',
            videos: [
              {id: 31, title:'订单创建', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948803702_001.mp4'},
              {id: 32, title:'操作出重', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948320388_002.mp4'},
              {id: 33, title:'附件上传', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1588930026825_003.mp4'},
              {id: 34, title:'打印单据', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948362098_004.mp4'},
              {id: 35, title:'单证制作', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948379724_005.mp4'},
              {id: 36, title:'二维码分享', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1597109978188_006-200801.mp4'},
              {id: 37, title:'费用录入', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948864738_014.mp4'},
              {id: 38, title:'制作账单', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948507511_015.mp4'},
              {id: 39, title:'特殊处理', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948411363_007.mp4'},
            ]
          },
          {
            id: 4,
            title: '财务结算管理',
            videos: [
              {id:41, title:'收入对账', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1591342025041_008.mp4'},
              {id:42, title:'成本对账', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948443507_009.mp4'},
              {id:43, title:'财务锁账', cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1597110038216_024.mp4'},
            ]
          },
          {
            id: 5,
            title: '报表统计分析',
            videos: [
              {id:51, title:"结算报告", cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948844868_010.mp4'},
              {id:52, title:"应收账龄", cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948466684_011.mp4'},
              {id:53, title:"应付账龄", cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948478943_012.mp4'},
              {id:54, title:"成本查询", cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948489467_013.mp4'},
              {id:55, title:"客户贡献度", cover: video_cover, url: 'http://doc.yctop.com/BillTemplate_ch_1597110258279_026.mp4'},
            ]
          },
        ],
        playerOptions: {
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948803702_001.mp4'
          }],
          poster: video_cover,
        },
        videoPlayVisible: false,
        currentPlayUrl: '',

      }
    },
    methods: {
      handleClose(){
        this.videoPlayVisible = false;
        let video = document.getElementById("tutorialVideo");
        if(video){
          video.pause();
        }
      },
      playVideo(src){
        if(src){
          this.currentPlayUrl = src;
          this.videoPlayVisible = true;
        }
      }
    }
  }
</script>
