<template>
    <div class="shopCart" style="clear:both">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                       <i class="iconfont icon-gouwuche"></i>
                    </div>
                    <div class="number" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price">{{totalPrice}}元</div>
                <div class="desc">另需配送费{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="{'goBuy':totalPrice>minPrice}">
                    {{payDesc}}
                </div>
            </div>
        </div>
       <!--  动画小球 -->
        <div class="ball-container">
            <div class="ball" v-for="ball in balls" v-show="ball.show" transition="drop"></div>
            <div class="inner"></div>
        </div>

        <div class="shopcart-list" v-show="listShow" transition="fold">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" v-el:list-content>
                <ul>
                    <li class="food" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

    </div>
    <div class="list-mask" v-show="listShow" transition="fade" @click="hideList"></div>
</template>
<script>
    import cartcontrol from 'components/cartControl/cartControl';
    import Bscroll from "better-scroll";
    export default {
        data(){
            return{
                balls:[
                    {show:false},
                    {show:false},
                    {show:false},
                    {show:false},
                    {show:false}
                ],
                //购物车是否收起展开
                fold:true
            }
        },
        props:{
            //selectFoods是goods.vue商品列表页面传过来的一个选择所有商品的单价，数量的数组
            selectFoods:{
                type:Array,
                default(){
                    //打开注释改变状态
                    return [
                       /* {
                            price:10,
                            count:3
                        },
                        {
                            price:5,
                            count:2
                        }*/
                    ]
                }
            },
            deliveryPrice:{
                type:Number,
                default:0  //组件没传过来值得话有个默认值
            },
            minPrice:{
                type:Number,
                default:0  //组件没传过来值得话有个默认值
            }
        },
        //根据传来的selectFoods数组计算里面所有单价*数量的和
        computed:{
            totalPrice(){
                let total = 0;
                this.selectFoods.forEach(function(food){
                    total += food.price * food.count;
                })
                return total
            },
            //选择商品的总和
            totalCount(){
                let count = 0;
                this.selectFoods.forEach(function(food){
                    count +=food.count;
                })
                return count;
            },
            payDesc(){
                if(this.totalPrice === 0){
                    return '￥'+this.minPrice+'元起送'
                }
                else if(this.totalPrice < this.minPrice)
                {
                    var diff = this.minPrice - this.totalPrice
                    return '还需'+diff+'元起送'
                }
                else
                {
                    return '去结算'
                }
            },
            listShow(){
                //如果没有选中任何食物
                if(!this.totalCount)
                {   
                    this.fold = true 
                    return false;
                }
                let show = !this.fold;
                //也必须应用到better-scroll,要不他下边的没有点击事件
                if(show){
                    this.$nextTick(function(){
                        if(!this.scroll){
                            this.scroll = new Bscroll(this.$els.listContent,{
                                click:true
                            });
                        }
                        else
                        {
                            this.scroll.refresh();
                        }
                        
                    })
                }

                return show
            }
        },
        methods:{
            drop(el){

            },
            toggleList(){
                if(!this.totalCount){
                    return
                }
                //隐藏层做切换
                this.fold = !this.fold
            },
            empty(){
                this.selectFoods.forEach(function(food){
                    food.count = 0
                })
            },
            hideList(){
                this.fold = true
            },
            pay(){
              /*  如果可以去结算了 就不触发关闭弹层的方法了*/
              if(this.totalPrice<this.minPrice)
              {
                return
              }
              else
              {
                alert("需要支付"+this.totalPrice)
              }
            }
        },
         components:{
            cartcontrol
        }
    }
</script>
<style>
    .shopCart{position: fixed; left: 0; bottom:0; z-index: 50; width: 100%; height: 48px;}
    .shopCart .content{display: flex; background-color: #141227; }
    /*子元素display:inline-block会有间隙，父元素设置font-size: 0*/
    .shopCart .content .content-left{flex:1;font-size: 0}
    .shopCart .content .content-right{flex:0 0 105px;}

    .shopCart .content .content-left .logo-wrapper{display: inline-block;position: relative; top: -10px;background-color: #141227;
        ;margin:0 12px; padding: 6px; width: 56px; height: 56px; box-sizing: border-box;border-radius: 50%}
    .shopCart .content .content-left .logo-wrapper .logo{border-radius: 50%}
    .shopCart .content .content-left .price{display: inline-block; vertical-align: top; line-height: 24px;margin-top:12px;box-sizing: border-box; padding-right: 12px;border-right: 1px solid #ccc; font-size: 16px; font-weight: 700; color: #fff
    }
    .shopCart .content .content-left .desc{display: inline-block; vertical-align: top; line-height: 24px; margin: 12px 0 0 12px; font-size: 14px; color: #fff}
    .shopCart .content .content-left .logo-wrapper .icon-gouwuche{font-size: 16px; font-weight: 700; color:#fff; font-size: 38px;}
    .pay{height: 48px; line-height: 48px; text-align: center; font-size: 12px; color: #fff; background: #2b333b}
    .number{position: absolute; top: 0; right: 0; width: 24px; height: 16px; line-height: 16px; text-align: center; border-radius: 50%; font-size: 9px; color: #fff; background-color: red; box-shadow: 0 4px 8px 0}
    .logo.highlight{background: rgb(0,160,220);}

    .goBuy{background: green ; color: #fff;}

    /*小球动画*/
    .ball-container .ball{position: fixed; left: 32px; bottom:22px; z-index: 200}
    .ball-container .ball.drop-transition{transition: all 0.4s}
    .ball-container .ball.drop-transition .inner{width: 16px; height: 16px;border-radius: 50%; background: blue; transition: all 0.4s}
    .shopcart-list{position: absolute;top: 0; left: 0; z-index: -1; width: 100%;}

    /*translate第二个参数-100%代表在y轴上让他向上移动整个自身高度*/
    .fold-transition{transition: all .5s; transform: translate3d(0,-100%,0);}

    .fold-enter,.fold-leave{ transform: translate3d(0,0,0); z-index: 100}

    .list-header{height: 40px; line-height: 40px; padding: 0 18px; background: #f3f5f7;border-bottom: 1px solid #666; overflow:hidden;}
    .list-header .title{float:left;}
    .list-header .empty{ float: right; }
    .list-content{padding:0 18px; max-height: 217px;background: #fff; overflow-y:scroll;}
    .food{position: relative;}

    .list-mask{position: fixed;top:0; left: 0; width: 100%; height: 100%; z-index:40;}

    /*结束的状态*/
    .list-mask.fade-transition{opacity: 1 ; background: rgba(7,17,27,0.6); transition: all .5s}

    /*初始的状态*/
    .list-mask.fade-transition.fade-enter,.list-mask.fade-transition.fade-leave{
        opacity: 0;
        background: rgba(7,17,27,0);
    }
</style>
