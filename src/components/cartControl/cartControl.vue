<template>
 
  <div class="cartcontrol">
      <div class="cart-decrease" v-show="food.count>0" transition="move">
          <i class="iconfont icon-jianhao" @click.stop.prevent="decreaseCart"></i>
      </div>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add" >
          <i class="iconfont icon-jiahao" @click.stop.prevent="addCart"></i>
      </div>
  </div>
</template>
<script>
    import Vue from 'vue'
    export default {
       props:{
        food:{
            type:Object
        }
       },
       created(){
           // console.log(this.food)

       },
       methods:{
          addCart(event){
            //这个是better-scroll的一个问题， event._constructed 如果是自定义的点击事件，为true ,而windows不认识为undefined,解决在pc端重复点击的问题
            if(!event._constructed){
              return 
            }
            if(!this.food.count) //第一次点击按钮的时候
            {
              //this.food .count = 1    //因为data里没有count这个属性，所有直接赋值无效
              Vue.set(this.food,'count',1)
            }
            else
            {
              this.food.count++;
            }
            //小球动画 ，事件派发到父组件
           // thisselectFoods('cart.add',event.target)
          },
          decreaseCart(event){
             if(!event._constructed){
              return 
             }
              if(this.food.count) //第一次点击按钮的时候
              {
                this.food.count--;
              }
          }
       }
    }
</script>
<style>
    .cartcontrol{ font-size: 0 }
    .cartcontrol .cart-decrease{display: inline-block; padding: 6px; font-size: 24px; line-height: 24px; color: rgb(0,160,220);} 
    .cartcontrol .cart-count{display: inline-block;font-size: 10px; line-height: 12px;text-align: center; color: #666; margin-top: 15px; width: 12px;}
    .cartcontrol .cart-add{display: inline-block;padding: 6px;font-size: 24px; line-height: 24px;color: rgb(0,160,220);}
    /*动画效果*/
    .cart-decrease{transition: all .4s linear}
    .icon-jianhao{display:inline-block;transition: all .4s linear; transform: rotate(0deg);}
    /*动画完成时候的状态*/
    .move-transition{opacity: 1 ; transform: translate3d(0,0,0);}

    
    /*动画运行的状态*/
    .move-enter,.move-leave{opacity:0;transform: translate3d(24px,0,0);}
    .move-enter .icon-jianhao,.move-leave .icon-jianhao{transform: rotate(360deg);}
</style>
