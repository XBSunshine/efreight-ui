<template>
  <div id="panel">
    <el-row>
      <!-- 左侧内容 -->
      <el-col :span="17" >
        <el-row>
          <el-col :span="16">
            <el-row >
              <el-col>
                <el-card class="box-card" id="panel-search-card">
                  <div slot="header" class="clearfix">
                    <span class="tab-title">在线询价</span>
                    <el-button style="float: right; padding: 3px 0; color: #277FFF" type="text" @click="moreDiscount" >更多优惠航线 ></el-button>
                  </div>
                  <el-form ref="ruleForm" :model="ruleForm" :inline="true">
                    <el-form-item style="width: 30%">
                      <el-input v-model="ruleForm.f" placeholder="始发港三字码" @input="ruleForm.f = ruleForm.f.toUpperCase()" maxlength="3"></el-input>
                    </el-form-item>
                    <el-form-item style="width: 30%">
                      <el-input  v-model="ruleForm.t" placeholder="目的港三字码" @input="ruleForm.t = ruleForm.t.toUpperCase()" maxlength="3"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align: center">
                      <el-button size="small" style="color: #FFF; background-color: #277FFF; border:unset" @click="queryBookingSpace">查询订舱</el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-col>
            </el-row>
            <el-row class="padding-top">
              <el-card class="box-card" id="panel-tool-card">
                <div slot="header" class="clearfix"><span class="tab-title">快捷工具</span> </div>
                <el-row :gutter="0">
                  <el-col :md="4" :style="'width: 20%;' + image.style" v-for="image in toolImage" :key="image.id">
                    <div  class="panel-tool" @click="jumpTo(image.jumpUri)">
                      <el-image :src="image.image" style=" width: 100%; text-align: center;"></el-image>
                      <div :style="'text-align: center; color: #666; font-weight: '+image.fontWeight">{{image.name}}</div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="8" class="padding-left">
            <el-card class="box-card" id="panel-frequent-used-card">
              <div slot="header" class="clearfix"> <span class="tab-title">最常使用</span> </div>
              <div>
                <div v-for="item in topAccess" :key="item.recordId" class="frequent_used" :style="frequentUsedStyle" @click="jumpTo(item.path)" >
                  <el-row>
                    <el-col :span="16"><div class="spot"></div>{{item.permissionName}}</el-col>
                    <el-col :span="8" align="right" class="access_time">{{item.accessTime}}</el-col>
                  </el-row>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 统计表格 -->
        <el-row class="padding-top">
          <el-col>
            <div>
              <el-tabs type="border-card" id="panel-charts-tabs" class="panel-charts" @tab-click="handlerTabClick" :before-leave="handlerBeforeLeave" v-model="actionTab">
                <el-tab-pane :label="tabItem.label" v-for="tabItem in tabDIC" :key="tabItem.key" :name="tabItem.key">
                  <div :id="tabItem.key" style="width: 100%; " class="panel-charts-content"></div>
                </el-tab-pane>
              </el-tabs>
              <el-button type="text" class="tab-more-btn" @click="handlerMore">更多</el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="7" class="padding-left">
        <el-row>
          <el-card class="box-card" id="panel-system-notify">
            <div slot="header" class="clearfix"><span class="tab-title">公告</span></div>
            <div v-for="notice in this.systemNotices" :key="notice.noticeId" class="system_notify">
              <span>{{notice.noticeTitle}}</span>
              <el-tag v-if="notice.noticeType == 'XTGX'">更新</el-tag>
              <el-tag v-if="notice.noticeType == 'HDTG'" type="warning">推广</el-tag>
              <el-tag v-if="notice.noticeType == 'XTWH'" type="danger">维护</el-tag>
            </div>
          </el-card>
        </el-row>
        <el-row class="padding-top">
          <el-image :src="activity.image"  class="activity-image" @click="jumpTo('/investigate')">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </el-row>
        <el-row class="padding-top">
          <el-card class="box-card" style="">
            <div slot="header" class="clearfix"><span class="tab-title">使用帮助</span></div>
            <el-row>
              <el-col :span="12" v-for="help in this.systemHelp" :key="help.id" class="system_help">
                <a href="javascript:void(0)" >
                  <span v-if="help.name == '查看全部'" style="color: #277FFF" @click="jumpTo('/tutorial')">{{help.name}}</span>
                  <span v-else-if="help.name == '在线询报价'" style="color:#c0c4cc">{{help.name}}</span>
                  <span v-else-if="help.name == '送货地图导航'" style="color:#c0c4cc">{{help.name}}</span>
                  <span v-else-if="help.name == '经营分析表'" style="color:#c0c4cc">{{help.name}}</span>
                  <span v-else style="color:#666" @click="playVideo(help.url)">{{help.name}}</span>
                </a>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <div class="system_other_title tab-title">其他帮助</div>
            <el-row style="margin-top: 10px">
              <el-col :span="12">
                <div class="system_other_item" @click="guide">
                  <el-image :src="icons.i001" class="system_other_icon"></el-image><span>新手引导</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="system_other_item" @click="openUserMan">
                  <el-image :src="icons.i002" class="system_other_icon"></el-image><span>用户手册</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog title="视频播放" :visible.sync="videoPlayVisible" width="800px" :before-close="handleClose">
      <video id="tutorialVideo" :src="currentPlayUrl" width="780px" controls="controls"></video>
    </el-dialog>
    <!-- 第一次弹出内容 -->
    <div id="ef-start-step" v-if="introConfig.start.visible">
      <div class="introjs-overlay" style="top: 0px; bottom: 0px; left: 0px; right: 0px; position: fixed; opacity: 0.8;"></div>
      <div class="ef-start-step" style="height: 380px;margin-top: -80px;margin-left: -30px">
        <div style="display: flex">
          <div>
            <div class="ef-start-step-title">生态云</div>
            <el-image :src="introConfig.start.image" style="width: 280px;margin-bottom: -3px;" />
            <div class="ef-start-step-title-bottom">EF物流生态云应用平台</div>
          </div>
          <div style="width: 80%; padding: 40px">
            <div class="ef-start-step-close" @click="introConfig.start.visible=false"> <i class="el-icon el-icon-close"></i> </div>
            <div style="text-align: center">
              <h1>欢迎使用生态云</h1>
            </div>
            <el-divider style="margin: 30px 0px">EF物流生态云应用平台</el-divider>
            <div style=" font-weight: bold; line-height: 26px;">
              <p>
                尊敬的客户您好：<br />
                欢迎和感谢您选用翌飞生态云。<br />
                我是您的专属领航员翌飞小云。<br />
                请您将安全带系好，调直座椅靠背、收起小桌板，<br />将遮光板保持在打开状态。准备起飞！<br />
                祝您旅途愉快！<br />
              </p>
            </div>
            <div style="text-align: center; margin-top: 10px">
              <el-button type="primary" round @click="step">开始</el-button>
              <el-button type="" round @click="blankStep" style="color: #409EFF; border-color: #409EFF">不再显示</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style type="text/css">
  #panel {
    background-color: #f7f7f7;
  }
  #panel .padding-left {
    padding-left: calc(2vh);
  }
  #panel .padding-top {
    padding-top: calc(2vh);
  }
  #panel .el-card__header{
    padding: calc(2vh) calc(2vh) 0;
    border-bottom: unset;
  }
  #panel .tab-title {
    font-size:16px;
    font-weight:500;
    color:rgba(74,74,74,1);
  }
  #panel .el-card__body{
    padding: calc(2vh);
  }
  #panel .panel-tool .el-image .el-image__inner{
    width: 36px;
    height: 36px;
  }

  #panel .frequent_used{
    padding: calc(0.9vh) calc(1.9vh);
    border-radius:4px;
    border:1px solid #EEEEEE;
    margin-bottom: calc(1.4vh);
    cursor: pointer;
  }

  #panel .frequent_used:hover{
    border-color: #277FFF;
  }
  #panel .frequent_used:last-child{
    margin-bottom: unset;
  }
  #panel .panel-tool{
    cursor: pointer;
  }
  #panel .activity-image{
    margin-left: 1px;
    cursor: pointer;
  }
  /*大于或等于1400px*/
  @media only screen and (min-width: 1400px){
    #panel .panel-tool{
      padding: calc(0.8vh);
    }
    #panel .panel-charts{
      height: calc(48vh);
    }
    #panel .activity-image{
      height: unset;
    }
    #panel #panel-frequent-used-card{
      min-height: calc(39.5vh);
    }
    #panel #panel-system-notify{
      min-height: calc(30.5vh);
    }
    #panel .system_notify{
      margin-bottom: calc(2vh);
    }
    #panel .system_help{
      margin-bottom: calc(2vh);
    }
  }
  /*小于1400px*/
  @media only screen and (max-width: 1400px) and (min-width: 1000px){
    #panel .panel-charts{
      height: calc(37.5vh);
    }
    #panel .activity-image{
      height: 170px;
    }
    #panel #panel-frequent-used-card{
      min-height: calc(47.5vh);
    }
    #panel #panel-system-notify{
      min-height: calc(21vh);
    }
    #panel .system_notify{
      margin-bottom: calc(1vh);
    }
    #panel .system_help{
      margin-bottom: calc(1vh);
    }
  }
  #panel .panel-charts-content{
    #height: calc(100% - 60px);
    #height: 143px;
  }
  #panel .spot {
    width: 6px;
    height: 6px;
    background: rgba(39,127,255,1);
    border-radius: 6px;
    display: inline-block;
    margin-right: 10px;
    margin-top: -55px;
    position: relative;
    top: -2px;
    font-size:14px;
    font-weight:400;
    color:rgba(74,74,74,1);
  }
  #panel .access_time{
    font-size:12px;
    font-weight:400;
    color:rgba(153,153,153,1);
  }
  #panel .system_notify{
    font-size:14px;
    font-weight:400;
    color:rgba(74,74,74,1);
    text-overflow: ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  #panel .system_notify:last-child{
    margin-bottom: unset;
  }
  #panel .el-tag{
    display: unset;
    padding: 2px 5px;
    line-height: 17px;
    height: 17px;
  }

  #panel .tab-more-btn {
    position: absolute;
    top: calc(2vh);
    right: calc(3vw);
    color: #999999;
  }

  #panel .el-form-item{
    margin-bottom: unset;
  }

  #panel .system_help{
    font-size:14px;
    color:rgba(102,102,102,1);
  }

  #panel .system_other_title{
    line-height:22px;
  }
  #panel .system_other_item{
    font-size:14px;
    font-weight:400;
    color: #277FFF;
    line-height: 17px;
    cursor: pointer;
  }
  #panel .system_other_icon{
    position: relative;
    top: 4px
  }
  #panel .el-divider--horizontal{
    margin: 12px 0px;
  }
  #panel .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover, .el-tabs--border-card{
    -webkit-box-shadow: unset;
    box-shadow: unset;
  }
  #panel .el-tabs--border-card{
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
  }
  #panel .system_help a:hover{
    text-decoration: underline;
    text-decoration-color: #666;
  }
</style>

<script>

  import Echarts from 'echarts';
  import t001 from "../../assets/images/tool/t001.png";
  import t002 from "../../assets/images/tool/t002.png";
  import t003 from "../../assets/images/tool/t003.png";
  import t004 from "../../assets/images/tool/t004.png";
  import t005 from "../../assets/images/tool/t005.png";
  import t006 from "../../assets/images/tool/t006.png";
  import t007 from "../../assets/images/tool/t007.png";
  import t008 from "../../assets/images/tool/t008.png";
  import t009 from "../../assets/images/tool/t009.png";
  import t010 from "../../assets/images/tool/t010.png";
  import a001 from "../../assets/images/activity/a001.png";
  import i001 from "../../assets/images/icon/i001.png";
  import i002 from "../../assets/images/icon/i002.png";
  import step0 from "../../assets/images/step/step0.png";

  import IntroJs from 'intro.js';
  import 'intro.js/introjs.css';
  import '../../assets/css/instro.css';

    export default {
      name: "panel_new.vue",
      data(){
        return {
          is1360: false,
          showNoticeCount: 3,
          ruleForm: {
            f: "",
            t: "",
          },
          tabDIC: [
            { label: "空运出口", key: "AE" },
            { label: "空运进口", key: "AI" },
            { label: "海运出口", key: "SE" },
            { label: "海运进口", key: "SI" },
            { label: "铁路出口", key: "TE" },
            { label: "陆运运输", key: "LC" },
            { label: "其它业务", key: "IO" },
          ],
          config: {
            "AE": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF', '#F9970E'],
              legend: {
                data: ['票数', '计重(吨)'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
            "AI": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF', '#F9970E'],
              legend: {
                data: ['票数', '计重(吨)'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
            "SE": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF', '#F9970E', '#d293e1'],
              legend: {
                data: ['票数', '计费(吨)', '标箱量'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
            "SI": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF', '#F9970E', '#d293e1'],
              legend: {
                data: ['票数', '计费(吨)', '标箱量'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
            "TE": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF', '#F9970E', '#d293e1'],
              legend: {
                data: ['票数', '计费(吨)', '标箱量'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
            "LC": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF', '#F9970E'],
              legend: {
                data: ['票数', '计费(吨)'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
            "IO": {
              tooltip: {
                formatter: function(params) {
                  return params['seriesName'] + "：" + params['value'];
                }
              },
              color: ['#277FFF'],
              legend: {
                data: ['票数'],
                left: 'right'
              },
              xAxis: {
                data: []
              },
              yAxis: {},
              series: [],
              grid: {
                top: 30,
                bottom: 20,
              },
            },
          },
          chart: null,
          actionTab: 'AE',
          tableColumn: [
            // {label: '', prop: 'type', align: 'left'},
          ],
          cacheAriTableData: [],
          cacheSeaTableData: [],
          cacheDataDIC: {},
          tableData: [
            // { type:"票数", num_1: 12, num_2: 13, num_3: 14, num_4: 15, num_5: 15, num_6: 16, num_0: 17, },
          ],
          chartWidth: 0,
          defaultDataTemplate: {
            'A': [{
              "org_id": -1,
              "num_5": "0",
              "num_6": "0",
              "num_0": "0",
              "type": "票数",
              "num_1": "0",
              "num_2": "0",
              "num_3": "0",
              "num_4": "0"
            },
              {
                "org_id": -1,
                "num_5": "0.0",
                "num_6": "0.0",
                "num_0": "0.0",
                "type": "货量(吨)",
                "num_1": "0.0",
                "num_2": "0.0",
                "num_3": "0.0",
                "num_4": "0.0"
              }
            ],
            'S': [{
              "org_id": -1,
              "num_5": "0",
              "num_6": "0",
              "num_0": "0",
              "type": "票数",
              "num_1": "0",
              "num_2": "0",
              "num_3": "0",
              "num_4": "0"
            },
              {
                "org_id": -1,
                "num_5": "0.0",
                "num_6": "0.0",
                "num_0": "0.0",
                "type": "计费(吨)",
                "num_1": "0.0",
                "num_2": "0.0",
                "num_3": "0.0",
                "num_4": "0.0"
              },
              {
                "org_id": -1,
                "num_5": "0",
                "num_6": "0",
                "num_0": "0",
                "type": "标箱量",
                "num_1": "0",
                "num_2": "0",
                "num_3": "0",
                "num_4": "0"
              }
            ],
            'T': [{
              "org_id": -1,
              "num_5": "0",
              "num_6": "0",
              "num_0": "0",
              "type": "票数",
              "num_1": "0",
              "num_2": "0",
              "num_3": "0",
              "num_4": "0"
            },
              {
                "org_id": -1,
                "num_5": "0.0",
                "num_6": "0.0",
                "num_0": "0.0",
                "type": "计费(吨)",
                "num_1": "0.0",
                "num_2": "0.0",
                "num_3": "0.0",
                "num_4": "0.0"
              },
              {
                "org_id": -1,
                "num_5": "0",
                "num_6": "0",
                "num_0": "0",
                "type": "标箱量",
                "num_1": "0",
                "num_2": "0",
                "num_3": "0",
                "num_4": "0"
              }
            ],
            'L': [{
              "org_id": -1,
              "num_5": "0",
              "num_6": "0",
              "num_0": "0",
              "type": "票数",
              "num_1": "0",
              "num_2": "0",
              "num_3": "0",
              "num_4": "0"
            },
              {
                "org_id": -1,
                "num_5": "0.0",
                "num_6": "0.0",
                "num_0": "0.0",
                "type": "计费(吨)",
                "num_1": "0.0",
                "num_2": "0.0",
                "num_3": "0.0",
                "num_4": "0.0"
              },
            ],
            'I': [{
              "org_id": -1,
              "num_5": "0",
              "num_6": "0",
              "num_0": "0",
              "type": "票数",
              "num_1": "0",
              "num_2": "0",
              "num_3": "0",
              "num_4": "0"
            },
            ],

          },
          toolImage: [
            { id: 9, name: "货物追踪", image: t009, style:'', jumpUri: '/cargoTracking', },
            { id: 10, name: "我的询价", image: t010, style:'', jumpUri: '/af_order_inquiry', },
            { id: 1, name: "机场查询", image: t001, style:'', jumpUri: '/af_airport', },
            { id: 3, name: "TACT查询", image: t003, style:'', jumpUri: '/af_tact', },
            { id: 8, name: "税则查询", image: t008, style:'', jumpUri: '/af_tariff_details', },

            { id: 2, name: "航司查询", image: t002, style:'margin-top: 10px', jumpUri: '/af_carrier', },
            { id: 6, name: "海港查询", image: t006, style:'margin-top: 10px', jumpUri: '/sc_port_maintenance', },
            { id: 7, name: "船司查询", image: t007, style:'margin-top: 10px', jumpUri: '/sc_ship_company', },
            { id: 4, name: "航班信息", image: t004, style:'margin-top: 10px', jumpUri: '/af_flight', },
            { id: 5, name: "飞机机型", image: t005, style:'margin-top: 10px', jumpUri: '/af_aircraft', },
          ],
          topAccess: [],
          systemNotices: [],
          activity: {
            image: a001,
            link: '/investigate',
          },
          systemHelp: [
            {id: 1, name: '在线询报价', url: ''},
            {id: 2, name: '二维码分享', url: 'http://doc.yctop.com/BillTemplate_ch_1597109978188_006-200801.mp4'},
            {id: 3, name: '送货地图导航', url: ''},
            {id: 4, name: '应收账龄表', url: 'http://doc.yctop.com/BillTemplate_ch_ti_1584948466684_011.mp4'},
            {id: 5, name: '经营分析表', url: ''},
            {id: 6, name: '查看全部', url: ''},
          ],
          icons: {
            i001: i001,
            i002: i002,
          },
          introConfig: {
            option: {
              showStepNumbers: false,
              exitOnEsc: false,
              exitOnOverlayClick: false,
              tooltipClass: 'ef-intro-tooltip-class',
              highlightClass: 'ef-intro-highlight-class',
              prevLabel: "上一步",
              nextLabel: "下一步",
              skipLabel: "跳过",
              doneLabel: "结束",
              steps: []
            },
            //按顺序展示
            steps: [
              {
                element: '#panel-search-card',
                title: '在线查询',
                content: '在这里你可以查询全国出口空运价格，一键查询不求人。',
                position: 'right',
                parse: true
              },
              {
                element: '#panel-tool-card',
                title: '快捷工具',
                content: '超多货代助手小工具，让您的工作更便利高效。',
                position: 'right',
                parse: true
              },
              {
                element: '',
                title: '了解更多',
                content: '想要了解生态云的更多操作，请<a href="{helpDocUrl}" target="_blank" download="生态云系统手册">下载</a>生态云系统使用手册',
                parse: true
              },
            ],
            introTemplate: '<div><div class="ef-intro-tip-title">{title}</div><button type="button" onclick="exitIntro()" class="ef-intro-tip-close"><i class="el-dialog__close el-icon el-icon-close"></i></button></div><div class="ef-intro-tip-content">{content}</div>',
            start: {
              image: step0,
              visible: false,
            },
            helpDocUrl: '',
          },
          finishIntroKey: '',
          videoPlayVisible: false,
          currentPlayUrl: '',
          frequentUsedStyle: '',

        }
      },
      methods: {
        queryBookingSpace() {
          this.closeMenu();
          this.$router.query = this.ruleForm;
          let param = "?f=" + this.ruleForm.f + "&t=" + this.ruleForm.t;
          this.$router.push("/panelSearch" + param);
        },
        jumpTo(url) {
          if (url) {
            if (url == '/cargoTracking') {
              //记录访问信息
              let param ={
                  "id": 0,
                  "name": '货物追踪',
                  "path": '/cargoTracking'
              };
              this.$axios.post("/hrs/userAccessRecord/recordMenu", param);
              let routeUrl = this.$router.resolve({
                path: url
              });
              window.open(routeUrl.href, '_blank');
            } else {
              this.$router.push(url); //用go刷新
            }
          } else {
            this.openError("功能暂未开放，敬请期待。");
          }
        },
        //加载最近访问数据
        loadTopAccess() {
          this.$axios.get("/hrs/userAccessRecord/topAccess/6").then(function(response) {
            if (response.data.code == 0) {
              this.topAccess = response.data.data || [];
            } else {
              this.openError(response.data.messageInfo || '加载数据失败');
            }
          }.bind(this))
            .catch(function(error) {
              this.openError("加载最近访问数据失败");
            }.bind)
        },
        /**
         * 加载系统公告
         */
        loadSystemNotices() {
          this.$axios.get2('/hrs/notice').then(function(response) {
            if (0 == response.data.code) {
              this.systemNotices = response.data.data;
              let srcLen = this.systemNotices.length;
              if (srcLen > this.showNoticeCount) {
                for (let i = 0; i < srcLen - this.showNoticeCount; i++) {
                  this.systemNotices.pop();
                }
              }
            } else {
              this.openError(response.data.messageInfo || '加载系统公告');
            }
          }.bind(this))
            .catch(function(e) {
              console.error(e);
            })
        },
        handlerTabClick(tab) {
          let key = tab['name'];
          this.cacheActionTab(key);
          this.setDataToPage(key);
          //重置尺寸
          this.chart.resize({
            width: this.chartWidth,
          })
        },
        //离开时销毁echarts
        handlerBeforeLeave(activeName, oldActiveName) {
          if (this.chart) {
            try {
              this.chart.dispose();
            } catch (e) {
              console.error(e)
            }
          }
          this.chartWidth = document.getElementById(oldActiveName).clientWidth;
        },
        handlerMore() {
          let param={
             businessScope:this.actionTab,
             orderUnit:'天',
             flightDateStart:this.getDateTime(new Date()),
             flightDateEnd:this.getDateTime2(new Date())
          }
          this.$router.push('/css_report_business_analysis?o='+this.base64Encode(JSON.stringify(param)));

          // this.$router.push("/css_report_business_analysis");
        },
        //加载数据
        loadData(key) {
          this.$axios.get2('/afbase/aforder/statistics').then(function(response) {
            if (0 == response.data.code) {
              let data = response.data.data;
              this.buildDataToCacheData(data);
              if (key) {
                this.setDataToPage(key);
              }
            } else {
              this.openError(response.data.messageInfo || '空运订单数据');
            }
          }.bind(this))
            .catch(function(e) {
              console.error(e);
            })
        },
        //构建数据到cacheData中
        buildDataToCacheData(data) {
          for (let index in data) {
            let item = data[index],
              scope = item['business_scope'];
            let collection = this.cacheDataDIC[scope];
            if (!collection) {
              collection = [];
              this.cacheDataDIC[scope] = collection;
            }
            collection.push(item);
          }
        },
        //设置数据到页面中
        setDataToPage(key) {
          if (!key) {
            throw "The method [setAirDataToPage] Not found key!";
          }
          let data = this.cacheDataDIC[key] || [];
          if (data.length == 0) {
            data = this.getDefaultData(key);
          }
          this.buildTable(data);
          this.buildCharOption(key, data);
          this.drawEchars(key);
        },
        getDefaultData(key) {
          key = key || "";
          return this.defaultDataTemplate[key.substring(0, 1)] || [];
        },
        //表格数据
        buildTable(data) {
          let numColumn = this.buildTableColumn(data);
          let columns = [{
            label: '',
            prop: 'type'
          }];
          numColumn.forEach((column) => {
            columns.push(column);
          });
          this.tableColumn = columns;
          this.tableData = data;
        },
        //统计图数据
        buildCharOption(key, data) {
          let series = this.buildSeries(data);
          let xAxis_data = this.buildXAxis(data);
          this.config[key].series = series;
          this.config[key].xAxis.data = xAxis_data;
        },
        //构建统计图数据
        buildSeries(data) {
          let series = [];
          for (let index in data) {
            let series_item = {
                type: 'bar'
              },
              item = data[index];
            let series_data = this.getSeriesData(item);
            series_item['name'] = item['type'];
            series_item['data'] = series_data;
            series.push(series_item);
          }
          return series;
        },
        getSeriesData(item) {
          let keys = this.getSortNumKey(item);
          let data = [];
          for (let index in keys) {
            let key = keys[index];
            data.push(item[key]);
          }
          return data;
        },
        getSortNumKey(item) {
          let keys = [];
          for (let key in item) {
            if (key.indexOf("num") > -1) {
              keys.push(key);
            }
          }
          keys = keys.sort(function(e1, e2) {
            return e2.localeCompare(e1)
          });
          return keys;
        },
        buildTableColumn(data) {
          if (data.length == 0) {
            return [];
          }
          let item = data[0];
          let keys = this.getSortNumKey(item);
          //根据num_1,num_2 .....来构建表格列
          let nowTime = new Date().getTime();
          let numTableColumn = [];
          keys.forEach((key) => {
            let dayInterval = key.split("_")[1];
            let intervalTime = nowTime - (dayInterval * 24 * 60 * 60 * 1000);
            let dateLabel = this.getCurrentIntervalDate(intervalTime);
            numTableColumn.push({
              label: dateLabel,
              prop: key
            });
          });
          return numTableColumn;
        },
        //获取当前日期的间隔日期
        getCurrentIntervalDate(time) {
          let datetime = new Date(time);
          let y = datetime.getFullYear();
          let mon = datetime.getMonth() + 1;
          if (mon < 10) {
            mon = "0" + mon;
          }
          let d = datetime.getDate();
          if (d < 10) {
            d = "0" + d;
          }
          return mon + "-" + d;
        },
        buildXAxis(data) {
          let columns = this.buildTableColumn(data);
          let labels = [];
          columns.forEach((item) => {
            let label = item['label'].replace(/-/g, '/');
            labels.push(label);
          });
          return labels;
        },
        cacheActionTab(key) {
          localStorage.setItem("EF_h_a_t", key);
        },
        getCacheActionTab() {
          return localStorage.getItem("EF_h_a_t");
        },
        drawEchars(key) {
          if (!key) {
            this.openError("未获取到KEY");
            return;
          }
          let option = this.config[key];
          this.chart = Echarts.init(document.getElementById(key));
          this.chart.setOption(option);
          let divHeight = this.is1360 ? window.screen.height * 0.22 : window.screen.height * 0.35;
          this.chart.resize({height: divHeight});
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
        openUserMan(){
          window.open(this.introConfig.helpDocUrl, "_blank");
        },
        loadHelpDoc() {
          this.$axios.get("/hrs/permission/helpDoc/新手指引").then(function(response) {
            if (response.data.code == 0) {
              this.introConfig.helpDocUrl = response.data.data['helpDocUrl'];
            }
          }.bind(this))
        },
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
        },
        accessTime(item){
          let accessTime = new Date(item.editTime || item.createTime);
          let month = accessTime.getMonth() + 1, date = accessTime.getDate();
          return (month <10 ? "0"+month : month) + "/" + (date < 10 ? "0" + date : date);
        },
        guide() {
          this.introConfig.start.visible = true;
        },
        step() {
          this.introConfig.start.visible = false;
          let option = this.introConfig.option;
          option.steps = this.buildIntroSteps();
          let url = this.introConfig.helpDocUrl || "";
          option.steps.forEach((item) => {
            item['intro'] = item['intro'].replace("{helpDocUrl}", url);
          });
          IntroJs().setOptions(option)
            .onafterchange(function(targetElement) {
              if ("" == targetElement.id) {
                let nexBtn = document.getElementsByClassName("introjs-nextbutton")[0];
                nexBtn.innerHTML = "立即体验";
                nexBtn.addEventListener("click", function() {
                  if (window.finishIntroKey) {
                    window.localStorage.setItem(window.finishIntroKey, "true");
                  }
                  IntroJs().exit();
                });
              }
            })
            .oncomplete(function() {
              this.exit();
            })
            .start();
        },
        buildIntroSteps() {
          let steps = [],
            template = this.introConfig.introTemplate;
          this.introConfig.steps.forEach((item) => {
            let tmp_dic = {};
            if (item.element) {
              tmp_dic['element'] = item.element;
            }
            if (item.position) {
              tmp_dic['position'] = item.position;
            }
            tmp_dic['intro'] = template.replace("{title}", item.title).replace("{content}", item.content);
            steps.push(tmp_dic);
          })
          return steps;
        },
        isFinishIntro() {
          return window.localStorage.getItem(this.finishIntroKey);
        },
        finishIntro() {
          return window.localStorage.setItem(this.finishIntroKey, "true");
        },
        buildFinishIntroKey() {
          let userId = window.localStorage.getItem("userId"),
            orgId = window.localStorage.getItem("orgId");
          if (userId && orgId) {
            let Base64 = require("js-base64").Base64;
            this.finishIntroKey = "EF-guide-" + Base64.encode(userId + ":" + orgId);
            window.finishIntroKey = this.finishIntroKey;
          }
        },
        blankStep() {
          this.finishIntro();
          this.introConfig.start.visible = false;
          IntroJs().exit();
        },
        moreDiscount(){
          this.closeMenu();
          this.jumpTo("/panelSearch");
        },
        /**
         * 关闭左侧菜单
         */
        closeMenu(){
          let menuComponent = this.$parent.$children[0];
          menuComponent.collapsed = true;
        },
        getDateTime(theDate) {
        	theDate.setDate(theDate.getDate() - 6);
        	let _year = theDate.getFullYear();
        	let _month = theDate.getMonth();
        	var _date = theDate.getDate();
        	_month = _month + 1;
        	if (_month < 10) {
        		_month = "0" + _month;
        	}
        	if (_date < 10) {
        		_date = "0" + _date;
        	}
        	// return _year + "-01-01";
        	return _year + '-' + _month + '-' + _date;
        },
        getDateTime2(theDate) {
        	let _year = theDate.getFullYear();
        	let _month = theDate.getMonth();
        	var _date = theDate.getDate();
        	_month = _month + 1;
        	if (_month < 10) {
        		_month = "0" + _month;
        	}
        	if (_date < 10) {
        		_date = "0" + _date;
        	}
        	// return _year + "-12-31";
        	return _year + '-' + _month + '-' + _date;
        },
        base64Encode(input) {
        	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/+="
        	let output = "";
        	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        	let i = 0;
        	input = this.utf8Encode(input);
        	while (i < input.length) {
        		chr1 = input.charCodeAt(i++);
        		chr2 = input.charCodeAt(i++);
        		chr3 = input.charCodeAt(i++);
        		enc1 = chr1 >> 2;
        		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        		enc4 = chr3 & 63;
        		if (isNaN(chr2)) {
        			enc3 = enc4 = 64;
        		} else if (isNaN(chr3)) {
        			enc4 = 64;
        		}
        		output = output +
        			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        	}
        	return output;
        },
        utf8Encode(string) {
        	string = string.replace(/\r\n/g, "\n");
        	let utftext = "";
        	for (let n = 0; n < string.length; n++) {
        		let c = string.charCodeAt(n);
        		if (c < 128) {
        			utftext += String.fromCharCode(c);
        		} else if ((c > 127) && (c < 2048)) {
        			utftext += String.fromCharCode((c >> 6) | 192);
        			utftext += String.fromCharCode((c & 63) | 128);
        		} else {
        			utftext += String.fromCharCode((c >> 12) | 224);
        			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        			utftext += String.fromCharCode((c & 63) | 128);
        		}

        	}
        	return utftext;
        },

      },
      created() {
        this.is1360 = (window.screen.width == 1360 || window.screen.width == 1366) ? true : false;
        if(!this.is1360) {
          this.showNoticeCount = 6;
        }
        if(window.screen.width < 768){
          this.frequentUsedStyle = "padding: 4px 8px";
          console.log(this.frequentUsedStyle);
        }
        //构建新手指引缓存key
        this.buildFinishIntroKey();
        //最近访问
        this.loadTopAccess();
        //系统公告
        this.loadSystemNotices();
        //帮助文档
        this.loadHelpDoc();
        //引导X按键关闭事件
        window.exitIntro = function() {
          IntroJs().exit();
        }
      },
      mounted() {
        //加载统计数据
        this.actionTab = this.getCacheActionTab() || this.actionTab;
        this.loadData(this.actionTab);
        //弹出新手指引
        if (!this.isFinishIntro()) {
          this.guide();
        }
      }
    }
</script>

<style scoped>

</style>
