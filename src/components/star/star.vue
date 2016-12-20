<template>
   <div class="star" :class="starType">
        <!-- 循环星星，星星的每个CLASS不同，itemClass是单独的样式：on half off, star-item是一样的样式 track-by="$index不加会有警告 -->
       <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by="$index"></span>
   </div>
</template>
<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';
export default{
    props:{
        size:{
            type:Number
        },
        score:{
            type:Number
        }
    },
    computed:{
        starType(){
            return 'star-'+this.size
        },
        itemClasses(){            
            var result = [];
            //四舍五入 小数位数大于0.5的 取完后会有小数保留，反之只保留整数
            let score = Math.floor(this.score*2)/2;
           
            //是否有小数,如果scrore是小数 % 1后就不是0
            var hasDecimal = score % 1 !== 0 ;
           // console.log(hasDecimal)
            //整数有多少分，也就是有几个全星星
            let integer = Math.floor(score);
            //console.info(integer)

            //先把整的星星放进去
            for(let i=0; i<integer; i++)
            {
               
                result.push(CLS_ON);
            }
           // console.log(result)
            
            //如果有小数，就放进去一个半星，半星最多有一个
            if(hasDecimal){
                result.push(CLS_HALF)
            }

            //如果不足5颗星，补足黑色星星
            while(result.length<LENGTH)
            {
                result.push(CLS_OFF);
            }
            
            return result;
        }
    }
}
</script>
<style>
.star{font-size: 0}
.star .star-item{display: inline-block; background-repeat: no-repeat;}
.star .star-item:last-child{margin-right: 0}
.star-48 .star-item{ width: 20px; height: 20px; margin-right: 22px; background-size: 20px 20px;}
.star-48 .star-item.on{background-image:url("star48_on@3x.png");}
.star-48 .star-item.half{background-image:url("star48_half@3x.png");}
.star-48 .star-item.off{background-image:url("star48_off@3x.png");}
.star-36 .star-item{}
.star-24 .star-item{}
</style>
