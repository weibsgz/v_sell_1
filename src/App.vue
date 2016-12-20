<template>
    <div>
       <!--  :seller 绑定这个叫seller的props到子组件,里面的值是 data中的seller,注意他把异步回调中data中的seller全传递给子组件了，子组件就可以通过父组件命名的seller.某某去调用数据了 -->
        <v-header :seller="seller"></v-header>
        <div class="tab">
            <div class="tab-item">
                <a v-link="{ path: '/goods' }">商品</a>
            </div>
            <div class="tab-item">
                <a v-link="{ path: '/ratings' }">评论</a>
            </div>
            <div class="tab-item">
                <a v-link="{ path: '/seller' }">商家</a>
            </div>
        </div>
        <!-- 路由渲染层把SELLER传到各个路由下 -->
        <router-view :seller="seller" keep-alive></router-view>
        
    </div>
</template>
<script>
import Hello from './components/Hello'
import header from './components/header/header'
 import {urlParse} from 'common/js/util';
 import Vue from 'vue'
const ERR_OK = 0;
export default {
    data(){
      return {
        //立即执行函数，直接取URL中的客户id
        seller:{
            id:function(){
                let queryParam = urlParse();
                //http://localhost:8080/?id=12345&a=b#!/goods
                console.log(queryParam)
                return queryParam.id
            }()
        }
      }
    },
    created() {
      //这里面MOCK数据的配置在build/dev-server.js中
      this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
        //response.body写法 查看vue-resource的 API
        response = response.body;
        if (response.errno === ERR_OK) {
           // this.seller = response.data;
            //如果直接请求回来的数据赋值seller 会覆盖掉 seller.id这个后来追加的东西
            //所以用es6 提供的Object.assign来给对象扩展属性
           // Vue.set() 
            this.seller = Object.assign({},this.seller,response.data)
            console.log(this.seller.id)
        }
      });
    },
    components: {
        Hello,
        "v-header": header
    }

}
</script>
<style>
html {
    height: 100%;
}

 .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
}

 .tab .tab-item {
    flex: 1;
    text-align: center;
}

.tab .tab-item  a.v-link-active{
   color: red
} 
</style>
