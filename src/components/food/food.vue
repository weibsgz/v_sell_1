<!-- 商品详情页 -->
<template>
    <div v-show="showFlag" class="_food" transition="move" v-el:food>
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image">
                <span class="arrow" @click="hide"> back</span>
            </div>
            <div class="_content">
                <h1 class="food-title">{{food.name}}</h1>
                <div class="food-detail">
                    <span class="sell-count">
                      月售{{food.sellCount}}份
                  </span>
                    <span class="rating">
                      好评率{{food.rating}}%
                  </span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">原价：￥{{food.oldPrice}}</span>
                </div>
                 <div class="food-cartControl-wrapper">
                     <cartcontrol :food="food"></cartcontrol>
                 </div>
                <div @click.stop.prevent="addFirst(food,$event)" class="food-buy" v-show="!food.count || food.count === 0">
                    加入購物車
                </div>
            </div>
           <split  v-show="food.info"></split>
           <div class="info" v-show="food.info">
               <div class="info-title">商品信息</div>
               <div class="info-text">
                   {{food.info}}
               </div>
           </div>
           <split  v-show="food.info"></split>
           <div class="rating">
               <h1 class="rating-title">商品評價</h1>
               <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" 
               :ratings="food.ratings"></ratingselect>
               <!-- 评价列表 -->
               <div class="rating-wrapper">
                   <ul v-show="food.ratings && food.ratings.length">
                   <!-- v-show绑定一个函数根据TAB标签过滤内容 -->
                       <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                           <div class="user">
                               <div class="name">{{rating.username}}</div>
                               <img class="avatar" width="12" height="12" :src="rating.avatar">
                           </div>
                           <div class="time">
                               {{rating.rateTime | formatDate}}
                           </div>
                           <p class="rating-text">
                                <!-- 赞或踩 -->
                               <span class="iconfont" :class="{'icon-noun154796cc':rating.rateType === 0,'icon-cai':rating.rateType === 1}">
                                   {{rating.text}}
                               </span>

                           </p>
                       </li>
                   </ul>
                   <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
               </div>
           </div>
        </div>
    </div>
</template>
<script>
import Bscroll from "better-scroll";
import cartcontrol from 'components/cartControl/cartControl'
import Vue from 'vue'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
/*带花括号因为 导出的是 fucntion  export function,这样可以导出多个funciton 比如 {formatDate,formatDate2}*/
import {formatDate} from 'common/js/date'

const POSTIVE = 0;
const NEGATIVE =1;
const ALL = 2;

export default {
    data() {
            return {
                showFlag: false,
                selectType:ALL,
                onlyContent:true,
                desc:{
                    all:'全部',
                    positive:'推荐',
                    negative:'吐槽'
                }
            }
        },
        props: {
            food: {
                type: Object
            }
        },
        filters:{
            /*在js/data.js中创建方法*/
            formatDate(time){
                let date = new Date(time)
                return formatDate(date,'yy-MM-dd hh:mm')
            }
        },
        methods: {
            show() {
                this.showFlag = true;

                /*初始化ratingselect组件*/
                this.selectType = ALL;
                this.onlyContent = true;

                this.$nextTick(function(){
                    if(!this.scroll){
                        this.scroll = new Bscroll(this.$els.food,{
                            click:true
                        })
                    }
                    else{
                        this.scroll.refresh();
                    }
                })

            },
            hide() {
                this.showFlag = false;
            },
            addFirst(food,event){
                if(!event._constructed){
                    return 
                 }
                 Vue.set(food,'count',1)
            },
            needShow(type,text){
                if(this.onlyContent && !text)
                {
                    return false;
                }
                if(this.selectType === ALL){
                    return true
                }
                else{
                    return type === this.selectType
                }
            }
        },
        /*监听子组件ratingselect.vue 派发过来的事件,否则点击子组件的TAB不能影响父组件needShow()函数*/
        events:{
            'ratingType.select'(type){
                this.selectType = type;
                this.$nextTick(function(){
                    this.scroll.refresh();
                })
                
            },
            'content.toggle'(onlyContent){
                this.onlyContent = onlyContent
                this.$nextTick(function(){
                    this.scroll.refresh();
                })
            }
        },
        components:{
            cartcontrol,split,ratingselect
        },
}
</script>
<style>
._food {
    position: fixed;
    background: #fff;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
}

.move-transition {
    transition: all .3s linear;
    transform: translate3d(0, 0, 0);
}

.move-enter,
.move-leave {
    transform: translate3d(100%, 0, 0);
}

.image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%
}

.image-header img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%
}

.arrow {
    position: absolute;
    left: 5px;
    top: 10px;
    color: #fff;
    font-size: 30px;
}

._content{padding: 18px;position: relative;}
._content .food-title{line-height: 14px; margin-bottom: 8px; font-size: 14px; font-weight: 700}
._content .food-detail{ margin-bottom: 18px;height: 10px; line-height: 10px; font-size: 0; }
._content .food-detail .sell-count , ._content .food-detail .rating{font-size: 10px; color: #999;}
._content .food-detail .sell-count{margin-right: 10px;} ._content .price{font-weight: 700;line-height: 24px;}
._content .price .now{ color: red; font-size: 14px; margin-right: 8px;}
._content .price .old{text-decoration: line-through; font-size: 10px; color: #666;}

.food-cartControl-wrapper{position: absolute; right: 12px; bottom:12px;}

 .food-buy{position: absolute;right: 18px; bottom:12px; z-index: 10; line-height: 24px;height: 24px; padding: 0 12px; box-sizing: border-box; font-size: 10px; border-radius: 12px;
color: #fff; background: rgb(0,160,220);}

.info{ padding: 18px; }
.info .info-title{ line-height: 14px; margin-bottom: 6px; font-size: 14px; color: rgb(7,17,27); }
.info .info-text{line-height: 24px; padding: 0 8px; font-size: 12px; color:rgb(77,85,93);}

.rating{padding-top:18px;}
.rating-title{line-height: 14px; margin-left: 18px; font-size: 14px; color: rgb(7,17,27); }

.rating-wrapper{padding: 0 18px;}
.rating-wrapper .rating-item{position: relative; padding: 16px 0;}
.rating-wrapper .rating-item .user{position: absolute; right: 0; top: 16px; font-size: 0; line-height: 12px;}
.rating-wrapper .rating-item .user .name{font-size: 10px; color: #666; display: inline-block; vertical-align: top;margin-right: 6px;}
.rating-wrapper .rating-item .user .avatar{border-radius: 50%; display: inline-block;}
.rating-wrapper .rating-item .time{font-size: 10px; line-height: 10px; color: #666; margin-bottom: 6px;}
.rating-text{line-height: 16px; font-size: 12px;color: rgb(7,17,27);}
.icon-noun154796cc,.icon-cai{line-height: 24px;font-size: 12px; margin-right: 4px;}
.icon-noun154796cc{color: rgb(0,160,220)}
.icon-cai{color: rgb(147,153,159)}
</style>
