<!-- 分割組件 -->
<template>
    <div class="ratingselect">
        <div class="rating-type">            
            <span  @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<em class="count">{{ratings.length}}</em></span>
            <span  @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<em class="count">{{positives.length}}</em></span>
            <span  @click="select(1,$event)"class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<em class="count">{{negatives.length}}</em></span>
        </div>
        <div class="switch" @click="toggleContent" :class="{'on':onlyContent}">
            <span class="iconfont icon-duigou"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
const POSTIVE = 0;
const NEGATIVE =1;
const ALL = 2;

export default {
    props:{
        ratings:{
            type:Array,
            default(){
                return []
            }
        },
        //选择类型  POSTIVE 是正面， NEGATIVE 是负面  ALL 是所有
        selectType:{
            type:Number,
            default:ALL
        },
        //是否读取内容
        onlyContent:{
            type:Boolean,
            default:false
        },
        //描述
        desc:{
            type:Object,
            default(){
                return {
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                }
            }
        }
    },
    computed:{
        //用filter方法过滤ratings下rateType==0的对象 rateType==0代表正面评价
        positives(){
            return this.ratings.filter(function(v,i,a){
                return v.rateType === POSTIVE
            })
        },
        negatives(){
            return this.ratings.filter(function(v,i,a){
                return v.rateType === NEGATIVE
            })
        }
    },
    methods:{
        select(type,event){
            if(!event._constructed){
                return 
             }
             this.selectType = type;

             //派发事件，通知父组件food.vue
             this.$dispatch('ratingType.select',type)

        },
       toggleContent(event){
                if(!event._constructed){
                    return 
                }
                
                this.onlyContent = !this.onlyContent;
                this.$dispatch('content.toggle',this.onlyContent)
            }
    }
}
</script>
<style>
.ratingselect{}
.ratingselect .rating-type{padding:18px 0;margin:0 18px; font-size: 0}
.ratingselect .rating-type .block{display: inline-block; padding: 8px 12px; font-size: 14px;border-radius: 2px;
 margin-right: 8px; color: rgb(77,85,93);}
 .ratingselect .rating-type .block.active{color: #fff}
 .ratingselect .rating-type .block.positive{background: rgba(0,160,220,0.2)}
  .ratingselect .rating-type .block.positive.active{background: rgb(0,160,220)}
  .ratingselect .rating-type .block.negative{background: rgba(77,85,93,0.2)}
  .ratingselect .rating-type .block.negative.active{background: rgb(77,85,93)}
.ratingselect .rating-type .block em{font-size: 8px; margin-left: 2px; line-height: 16px;}

.switch{padding:12px 18px; line-height: 24px; font-size: 12px; color: rgb(147,153,159); border-bottom: 1px solid #ccc;}
.iconfont.icon-duigou{font-size: 24px;margin-right: 4px;}
.switch.on .icon-duigou{color: #00c850}
.switch .text{}
</style>
