<template>
    <div class="seller" v-el:seller>
        <div class="seller-content">
            <div class="overview">
                <h1 class="seller-title">{{seller.name}}</h1>
                <div class="desc">
                    <star :size="48" :score="seller.score"></star>
                    <span class="seller-text">
            			{{seller.ratingCount}}
            		</span>
                    <span class="seller-text">
            			月售{{seller.sellCount}}单
            		</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite">
                	<span class="iconfont icon-xin" :class="{'active':favorite}"></span>
                	<span class="xin-text">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin">
                <h1 class="oo-title">活动与公告</h1>
                <div class="content-wrapper">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
            </div>
            <ul v-if="seller.supports" class="supports">
                <li class="support-item border-1px" v-for="item in seller.supports">
                    <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
                    <span class="text">{{seller.supports[$index].description}}</span>
                </li>
            </ul>
            <split></split>
            <div class="pics">
                <div class="pic-title">商家实景</div>
                <div class="pic-wrapper" v-el:pic-wrapper>
                    <ul class="pic-list" v-el:pic-list>
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info">
                <h1 class="info-title">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import star from 'components/star/star'
import split from 'components/split/split'
import Bscroll from "better-scroll";
import {saveToLocal, loadFromLocal} from 'common/js/store';

export default {
    props: {
        seller: {
            type: Object
        }
    },
    data(){
    	return {
    		favorite: (() => {
	          return loadFromLocal(this.seller.id, 'favorite', false);
	        })()
    	}
    },
    computed:{
    	favoriteText(){
    		return this.favorite?'已收藏':'收藏'
    	}
    },
    //有可能ready里初始化better-scorll的时候并不能获得DOM(异步)，所以要WATCH
    watch: {
        'seller' () {
            this._initScroll();
            this._initPics();
        }
    },
    //better-scroll需要dom加载后生效  created并不是加载后的方法  ready是
    ready() {
        this._initScroll();
        this._initPics();
    },

    created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
        _initScroll() {
            if (!this.scroll) {
                this.scroll = new Bscroll(this.$els.seller, {
                    click: true
                })
            } else {
                this.scroll.refresh();
            }
        },
        _initPics() {
            //如果有实景图片 给ul设置宽度 每个li的宽度是120 ，减去最后一个没有margin
            if (this.seller.pics) {
                let picWidth = 120;
                let margin = 6;
                let width = (picWidth + margin) * this.seller.pics.length - margin;

                this.$els.picList.style.width = width + 'px';
                if (!this.picScroll) {
                    this.$nextTick(function() {
                        this.picScroll = new Bscroll(this.$els.picWrapper, {
                            scrollX: true,
                            //外层可以竖向滚动
                            eventPassThrough: 'vertical'
                        })
                    })
                } else {
                    this.picScroll.refresh();
                }
            }
        },
        toggleFavorite(event){
        	//在better-scroll里都加这个
        	if(!event._constructed){
                    return 
             }
             this.favorite = !this.favorite
             saveToLocal(this.seller.id, 'favorite', this.favorite);

        }
    },
    components: {
        star,
        split,
        Bscroll
    }
}
</script>
<style>
.seller {
    position: absolute;
    top: 190px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
}

.seller .overview {
    padding: 18px;
    display: block;
    position: relative;
}

.seller .seller-title {
    margin-bottom: 8px;
    line-height: 14px;
    color: #666;
    font-size: 14px;
}

.seller .overview .desc {
    padding-bottom: 18px;
    line-height: 18px;
    font-size: 0;
}

.seller .overview .desc .star {
    display: inline-block;
    margin-right: 8px;
    vertical-align: top;
}

.seller .overview .desc .seller-text {
    display: inline-block;
    margin-right: 12px;
    vertical-align: top;
    font-size: 10px;
    color: #ccc;
}

.seller .overview .remark {
    display: flex;
    margin-top: 18px
}

.seller .overview .remark .block {
    flex: 1;
    text-align: center;
    border-right: 1px solid #ccc;
}

.seller .overview .remark .block:last-child {
    border: none;
}

.seller .overview .remark .block h2 {
    margin-bottom: 4px;
    line-height: 10px;
    font-size: 10px;
    color: #999;
}

.seller .overview .remark .block .content {
    line-height: 24px;
    font-size: 10px;
}

.seller .overview .remark .block .content .stress {
    font-size: 24px;
}

.bulletin {
    padding: 18px 18px 0 18px;
}

.bulletin .oo-title {
    margin-bottom: 8px;
    line-height: 14px;
    color: #666;
    font-size: 14px;
}

.bulletin .content-wrapper {
    padding: 0 12px 16px 12px;
    border-bottom: 1px solid #ccc;
}

.bulletin .content-wrapper .content {
    line-height: 24px;
    font-size: 12px;
}

.supports .support-item {
    padding: 16px 12px;
    font-size: 0
}

.supports .support-item .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat
}

.supports .support-item .icon.decrease {
    background: url('decrease_4@2x.png') no-repeat;
}

.supports .support-item .icon.discount {
    background: url('discount_4@2x.png') no-repeat;
}

.supports .support-item .icon.guarantee {
    background: url('guarantee_4@2x.png') no-repeat;
}

.supports .support-item .icon.invoice {
    background: url('invoice_4@2x.png') no-repeat;
}

.supports .support-item .icon.special {
    background: url('special_4@2x.png') no-repeat;
}

.supports .support-item .text {
    display: inline-block;
    margin-right: 12px;
    line-height: 18px;
    vertical-align: top;
    font-size: 10px;
    color: rgb(77, 85, 93)
}

.pics {
    padding: 18px;
}

.pics .pic-title {
    margin-bottom: 12px;
    line-height: 14px;
    color: #666;
    font-size: 14px;
}

.pic-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
}


/*超出不折行*/

.pic-wrapper .pic-list {
    font-size: 0
}

.pic-wrapper .pic-list .pic-item {
    display: inline-block;
    margin-right: 6px;
    width: 120px;
    height: 90px;
}

.pic-wrapper .pic-list .pic-item:last-child {
    margin-right: 0
}

.info {
    padding: 18px 18px 0 18px;
}

.info .info-title {
    padding-bottom: 8px;
    line-height: 14px;
    color: #666;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
}

.info .info-item {
    padding: 16px 12px;
    line-height: 16px;
    border-bottom: 1px solid #ccc;
    color: #666;
    font-size: 12px;
}

.info .info-item:last-child {
    border-bottom: none;
}

.favorite{
	position: absolute; top: 18px; right: 18px; text-align: center; width: 50px;
}
.favorite .icon-xin{ color: #ccc; display: block; font-size: 24px; line-height: 24px; margin-bottom: 4px;}
.favorite .icon-xin.active{color: red}
.favorite .xin-text{font-size: 10px; line-height: 10px; color: #666;}
</style>
