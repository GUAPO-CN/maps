<template>
  <div class="tmx-bm-overlay">
    <div
      v-if="infoWindowOpts.type === 'cluster'"
      class="tmx-bm-overlay-cluster"
    >
      <div
        v-if="infoWindowOpts.info&&infoWindowOpts.info.title"
        class="title"
      >
        {{ infoWindowOpts.info.title }}:
      </div>
      <div
        v-if="infoWindowOpts.info&&infoWindowOpts.info.number"
        class="number"
      >
        {{ infoWindowOpts.info.number }}
      </div>
      <div
        v-if="infoWindowOpts.info&&infoWindowOpts.info.list&&infoWindowOpts.info.list.length>0"
        class="list"
      >
        <div
          v-for="(item) in infoWindowOpts.info.list"
          :key="item.status"
          class="li"
        >
          <span :class="'icon '+ item.icon"></span>
          <span class="status">{{ item.status }}:</span>
          <span class="content">{{ item.content }}</span>
        </div>
      </div>
    </div>
    <div
      v-else-if="infoWindowOpts.type === 'marker'"
      class="tmx-bm-overlay-marker"
    >
      <div
        class="list"
      >
        <div class="li">
          <span class="status">Alias:</span>
          <span class="content">{{ infoWindowOpts.info.Alias ? infoWindowOpts.info.Alias : '--' }}</span>
        </div>
        <div class="li">
          <span class="status">SN:</span>
          <span class="content sn-color">{{ infoWindowOpts.info.SN ? infoWindowOpts.info.SN : '--' }}</span>
        </div>
        <div class="li">
          <span class="status">Status:</span>
          <span class="content">{{ infoWindowOpts.info.Status ? infoWindowOpts.info.Status : '--' }}</span>
        </div>
      </div>
      <div
        v-if="infoWindowOpts.info&&infoWindowOpts.info.localtion"
        class="localtion"
      >
        <Icon
          type="md-pin"
          size="14"
        />
        {{ infoWindowOpts.info.localtion }}
      </div>
    </div>
    <div
      v-else-if="infoWindowOpts.type === 'path'"
      class="tmx-bm-overlay-path"
    >
      <div
        class="list"
      >
        <div class="li">
          <span class="status">Time:</span>
          <span class="content">{{ infoWindowOpts.info.Time ? infoWindowOpts.info.Time : '--' }}</span>
        </div>
      </div>
      <div
        v-if="infoWindowOpts.info&&infoWindowOpts.info.localtion"
        class="localtion"
      >
        <Icon
          type="md-pin"
          size="14"
        />
        {{ infoWindowOpts.info.localtion }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InfoTemplate',
  props: {
    infoWindowOpts: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
}
</script>
<style lang="less">
.tmx-bm-overlay{
  .tmx-bm-overlay-cluster,.tmx-bm-overlay-marker,.tmx-bm-overlay-path{
    width:255px;
    background:rgba(255,255,255,1);
    box-shadow:0px 12px 48px 16px rgba(0,0,0,0.03),0px 9px 28px 0px rgba(0,0,0,0.05),0px 6px 16px -8px rgba(0,0,0,0.08);
    border-radius:4px;
    padding: 8px 12px;
    .title{
      height:14px;
      font-size:12px;
      font-family:SFProText-Regular,SFProText;
      font-weight:400;
      color:rgba(151,156,168,1);
      line-height:14px;
    }
    .number{
      height:21px;
      font-size:18px;
      font-family:SFProText-Semibold,SFProText;
      font-weight:600;
      color:rgba(70,76,91,1);
      line-height:21px;
      margin: 4px 0;
    }
    .list{
      .li{
        height: 20px;
        line-height: 20px;
        .icon{
          display: inline-block;
          width:8px;
          height:8px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .status{
          height:14px;
          font-size:12px;
          font-family:SFProText-Medium,SFProText;
          font-weight:500;
          color:#979CA8;
          line-height:14px;
          padding-right: 8px;
        }
        .content{
          height:14px;
          font-size:12px;
          font-family:SFProText-Regular,SFProText;
          font-weight:400;
          color:#464C5B;
          line-height:14px;
        }
        .sn-color{
          color: #2D8CF0;
        }
      }
    }
    .localtion{
      height:20px;
      line-height:20px;
      font-size:12px;
      font-family:SFProText-Regular,SFProText;
      font-weight:400;
      color:#464C5B;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .tmx-bm-overlay-cluster::after,.tmx-bm-overlay-marker::after,.tmx-bm-overlay-path::after{
    position: absolute;
    content: '';
    border-style: solid;
    border-width: 10px 10px 0;
    border-color: white transparent transparent;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
  }
  .standby-icon{
    background: #2D8CF0;
  }
  .online-icon{
    background: #19BE6B;
  }
  .offline-icon{
    background: #ED4014;
  }
  .disable-icon{
    background: #C5C8CE;
  }
}
</style>
