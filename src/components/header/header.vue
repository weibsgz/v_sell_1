<template>
    <div class="header">
   <!--  因为是DATA.JSON中的路径 需要异步请求返回 所以用v-bind:src -->
   <!--  子组件中的接受父组件的名字叫seller ，这个seller里边的的值是异步的数据，这里seller.avatar的seller是props的名字不是值 
   props如果接受的是叫 msg 那么子组件中所有的调用就应该是msg.avatar,msg.name-->
      <img :src="seller.avatar" width="100" height="100">
      <span>{{seller.name}}</span>    <span @click="showDetail">点我出蒙层</span>
      <!-- 如果不加这个V-IF 控制台里会报错，因为异步加载原因 -->
      <div v-if="seller.supports" :class="classMap[seller.supports[0].type]">
          {{seller.supports[0].description}} / {{seller.supports.length}}个
      </div>
      <!-- 组件中用到的图放在组件文件夹下，方便复用 -->
      <img src="brand@2x.png">
      <!-- 详情蒙层 -->
      <div v-show="detailShow" class="detail" transition="fade">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
              <h1>{{seller.name}}</h1>          
              <star :size="48" :score="seller.score"></star>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="supports" v-if="seller.supports">
                  <li v-for="item in seller.supports" class="supports-item">
                      {{item.description}}
                  </li>
              </ul>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">X</div>
      </div>
    </div>
</template>

<script>
import star from 'components/star/star'

export default{
  props:{
    //props接受父组件传递来的props,父组件中定义了<v-head :seller>
    seller:{
      type:Object
    }
  },
  data(){
    return {
      detailShow:false
    }
  },
  methods:{
    showDetail:function(){
      this.detailShow = true;
    },
    hideDetail:function(){
      this.detailShow = false;
    }
  },
  created(){
    this.classMap = ['d0','d1','d2']
  },
  components: {
      star
    }
}
</script>

<style>
   .dsaf{color:blue;}
   .d0{color: blue}
   .d1{color:red;}
   .d2{color:yellow;}
   .detail{position: fixed;z-index: 100;width: 100%; height: 100%;overflow:auto;background: rgba(7,17,27,0.8);top: 0; left: 0;transition: all 0.5s;backdrop-filter:blur(10px);
   }
   /*动画结束的状态*/
   .detail.fade-transition{
    opacity: 1;
    background: rgba(7,17,27,0.8);
   }
   /*动画开始的状态*/
   .detail.fade-enter,.detail.fade-leave{
    opacity: 0;
    background: rgba(7,17,27,0);
   }

   .detail-wrapper{min-height: 100% ; width: 100%}
   .detail-wrapper .detail-main{margin-top: 64px; padding-bottom: 64px; text-align: center; color: #fff;}
   .detail-wrapper .detail-main p{text-align: center;}
   .detail-close{position: relative; width: 32px; height: 32px; margin:-64px auto 0 auto; clear: both; font-size: 32px;}

   .title{ display:flex;width: 80%; margin:28px auto 24px auto;}
   .title .line{flex: 1;position: relative;top:-6px;border-bottom: 1px solid rgba(255,255,255,0.2)}
   .title .text{padding:0 12px; font-size: 14px;font-weight: 700;}
</style>
