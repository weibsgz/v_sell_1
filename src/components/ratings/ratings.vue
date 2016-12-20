<template>
    <div class="ratings" v-el:ratings>
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="scroe">{{seller.score}}</h1>
                    <div class="rating-title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="scroe-wrapper">
                        <span class="o-title">服务态度</span>
                        <star :size="48" :score="seller.serviceScore"></star>
                        <span class="scroe">{{seller.serviceScore}}</span>
                    </div>
                    <div class="scroe-wrapper">
                        <span class="o-title">商品评分</span>
                        <star :size="48" :score="seller.foodScore"></star>
                        <span class="scroe">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="delivery-title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                    <div style="clear:both"></div>
                </div>
            </div>
            <split></split>
            <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
            <div class="rating-wrapper">
            	<ul>
            		<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
            			<div class="avatar">
            				<img :src="rating.avatar" width="28" height="28">
            			</div>
            			<div class="content">
            				<h1 class="name">{{rating.username}}</h1>
            				<div class="star-wrapper">
            					<star :size="48" :score="rating.score"></star>
            					<span class="delivery" v-show="rating.deliveryTime">
            						{{rating.deliveryTime}}
            					</span>
            				</div>
            				<p class="r-text">
            					{{rating.text}}
            				</p>
            				<div class="recommend" v-show="rating.recommend && rating.recommend.length">
            					<span class="iconfont icon-noun154796cc"></span>
            					<span class="item" v-for="item in rating.recommend">{{item}}</span>	
            				</div>
            				<div class="time">
            					{{rating.rateTime | formatDate}}
            				</div>
            			</div>
            		</li>
            	</ul>
            </div>
        </div>
    </div>
</template>
<script>
import star from 'components/star/star'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
/*带花括号因为 导出的是 fucntion  export function,这样可以导出多个funciton 比如 {formatDate,formatDate2}*/
import {formatDate} from 'common/js/date'
import Bscroll from "better-scroll";
const POSTIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
const ERR_OK = 0;

export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            ratings: [],
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    methods:{
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
    created() {
    	  this.$http.get('/api/ratings').then((response) => {
            //response.body写法 查看vue-resource的 API
            response = response.body;
            if (response.errno === ERR_OK) {
                this.ratings = response.data;                  
    			this.$nextTick(()=>{
                	this.scroll = new Bscroll(this.$els.ratings,{
    					click:true    //使左侧菜单可以点击，否则better-scroll会阻止
    				});  
                })           
            }
        });
    },
    filters:{
            /*在js/data.js中创建方法*/
            formatDate(time){
                let date = new Date(time)
                return formatDate(date,'yy-MM-dd hh:mm')
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
    components: {
        star,
        ratingselect,
        split,
        Bscroll
    }

}
</script>
<style>
.ratings {
    position: absolute;
    top: 190px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
}

.overview {
    display: flex;
    padding: 18px 0;
}

.overview .overview-left {
    flex: 0 0 137px;
    width: 137px;
    border-right: 1px solid #ccc;
    text-align: center;
    padding: 6px 0;
}

.overview .overview-right {
    flex: 1;
    padding-left: 24px;
}

.overview h1.scroe {
    color: orange;
    line-height: 28px;
    font-size: 24px;
    margin-bottom: 6px;
}

.overview .rating-title {
    line-height: 12px;
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
    margin-left: 0
}

.overview .rank {
    color: #ccc;
    line-height: 10px;
    font-size: 10px;
}

.scroe-wrapper {
    line-height: 18px;
    margin-bottom: 8px;
    font-size: 0;
}

.scroe-wrapper .o-title {
    font-size: 12px;
    color: #666;
    display: inline-block;
    vertical-align: top;
}

.scroe-wrapper .star {
    display: inline-block;
    vertical-align: top;
}

.scroe-wrapper .scroe {
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
    color: orange;
}

.delivery-wrapper {
    font-size: 0;
}

.delivery-wrapper .delivery-title {
    font-size: 12px;
}

.delivery-wrapper .delivery {
    font-size: 12px;
    color: #999;
}

@media only screen and (max-width:320px) {
    .overview .overview-left {
        flex: 0 0 120px;
        width: 120px;
    }
}

.rating-wrapper{padding: 0 18px;}
.rating-wrapper .rating-item{display: flex; padding: 18px 0; border-bottom: 1px solid #ccc;}
.rating-wrapper .rating-item .avatar{flex: 0 0 28px; width: 28px; margin-right: 12px; }
.rating-wrapper .rating-item .avatar img{border-radius: 50%;}
.rating-wrapper .rating-item .content{flex: 1; position: relative;}
.rating-wrapper .rating-item .content .name{line-height: 12px; font-size: 10px; color: #666;margin-bottom: 4px;}
.rating-wrapper .rating-item .content .star-wrapper{margin-bottom: 6px; font-size: 0;}
.rating-wrapper .rating-item .content .star-wrapper .star{display: inline-block; vertical-align: top; margin-right: 6px;}

.rating-wrapper .rating-item .content .star-wrapper .delivery{display: inline-block; vertical-align: top; font-size: 10px; line-height: 12px;}

.content .r-text{margin-bottom:8px;line-height: 18px; color: #666; font-size: 12px;}
.content .recommand{line-height: 16px;}
.iconfont.icon-noun154796cc{ display: inline-block; margin:0 8px 4px 0; font-size: 12px; }
.content .recommend .item{padding: 0 6px; border-radius: 1px; border:1px solid #ccc;margin:0 8px 4px 0; font-size: 12px; }

.content .time{position: absolute; right: 0 ; top: 0; line-height: 12px; font-size: 10px; 
	color: #666;}
</style>
