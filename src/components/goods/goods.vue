<template>
    <div class="goods">

    	<!-- v-el:为 DOM 元素注册一个索引，方便通过所属实例的 $els 访问这个元素 -->。
        <div class="menuWrapper" v-el:menu-wrapper>
            <ul>
                <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex===$index}" 
                @click="selectMenu($index,$event)">
                    <span>
                    	<span v-show="item.type>0" class="icon" :class="classMap[item.type]">aaa</span> {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foodsWrapper" v-el:foods-wrapper>
        	<ul>
        		<li v-for="item in goods" class="food-list food-list-hook">
        			<h1 class="title">{{item.name}}</h1>
        			<ul>
        				<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
        					<div class="icon">
        						<img width="57" height="57" :src="food.icon">
        					</div>
        					<div class="content">
        						<h2 class="name">{{food.name}}</h2>
        						<p class="desc">{{food.description}}</p>
        						<div class="extra">
        							<span class="count">月售{{food.sellCount}}份</span>
        							<span>好评率{{food.rating}}%</span>
        						</div>
        						<div class="price">
        							<span class="now">￥{{food.price}}</span>
        							<span class="old" v-show="food.oldPrice">原价：￥{{food.oldPrice}}</span>
        						</div>
        						<div class="cartcontrol-wrapper">
        							<!-- 控制数量小按钮 -->
        							<cartcontrol :food="food"></cartcontrol>
        						</div>
        					</div>

        				</li>
        			</ul>
        		</li>
        	</ul>
        </div>
        <!-- 传入配送费和起送费 -->
        <!-- select-foods是一个计算属性，他里面是所有在子组件cartControl里选中的食物的集合 -->
       <!--  cartControl组件中通过+，-按钮改变本地模拟的数据，在goods.vue里取出改变的数据再传递给shopCart这个组件 -->
        <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
   <!-- 商品详情 -->
    <food :food="selectedFood" v-ref:food></food>
</template>
<script>
import Bscroll from "better-scroll";
import shopcart from 'components/shopCart/shopCart';
import cartcontrol from 'components/cartControl/cartControl';
import food from 'components/food/food';

const ERR_OK = 0;
export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: [],
            //右侧列表每个区域的高度，滚动监听用
            listHeight:[],
            scrollY:0,
            selectedFood:{}
        }
    },

    computed:{
    	//算scrollY在哪两个区块间
    	currentIndex(){    
    			
    		for(let i=0; i<this.listHeight.length; i++)
    		{
    			let height1 = this.listHeight[i];
    			let height2 = this.listHeight[i+1];
    			//!height2 表示 如果落到最后一个那么i+1是undefined
    			if(!height2 || (this.scrollY >= height1 && this.scrollY < height2))
    			{
    				
    				return i;
    			}
    		}
    		return 0 ;
    	},
    	selectFoods(){
    		//找到所有被选择的food
    		let foods=[];
    		/*观察data.json的结构 先循环所有的goods列表，再循环里边的所有foods，如果在cartControl子组件中被选中了,那里边的food中的count必然已经被创造，再将这个foods数组传递给shopCart组件的selectFoods*/

    		this.goods.forEach(function(good){
    			good.foods.forEach(function(food){
    				if(food.count){
    					foods.push(food)
    				}
    			})
    		})
    		return foods;
    	}
    },
    created() {

        this.classMap = ['d0', 'd1', 'd2'],
        this.$http.get('/api/goods').then((response) => {
            //response.body写法 查看vue-resource的 API
            response = response.body;
            if (response.errno === ERR_OK) {
                this.goods = response.data;
               // console.log(this.goods)
               //商品列表是动态加载的 需要使用nextTick方法  $nextTick不同的是回调的 this 自动绑定到调用它的实例上。
                this.$nextTick(()=>{
                	 this._initScroll();
                	 //计算右侧高度，滚动监听
                	 this._calculateHeight();
                })
            }
        });
    },


    methods:{
    	_initScroll() {
    		//better-scroll接受两个参数，第一个是DOM对象,用v-el绑定，注意转换为驼峰写法
    		this.menuScroll = new Bscroll(this.$els.menuWrapper,{
    			click:true    //使左侧菜单可以点击，否则better-scroll会阻止
    		});
    		this.foodsScroll = new Bscroll(this.$els.foodsWrapper,{
    			click:true ,   
    			probeType:3  //scroll在滚动的时候能实时输出滚动的位置
    		});
    		//右侧在滚动的时候，实时改变scrollY的值,这里必须用es6写法 其他写法无效
    		this.foodsScroll.on('scroll',(pos)=>{
    			this.scrollY = Math.abs(Math.round(pos.y));
    			//console.log(this.scrollY)
    		})
    	},
    	_calculateHeight(){
    		//获得每个区块的高度
    		let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
    		let height = 0;
    		this.listHeight.push(height);
    		for(let i=0; i<foodList.length;i++)
    		{
    			//高度的累增的， 这样创造一个数组
    			height = height + foodList[i].clientHeight;
    			this.listHeight.push(height);
    			//console.log(this.listHeight)
    		}
    	},
    	selectMenu(index,event){
    		//这个是better-scroll的一个问题， event._constructed 如果是自定义的点击事件，为true ,而windows不认识为undefined,解决在pc端重复点击的问题
    		if(!event._constructed){
    			return 
    		}

    		let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
    		let el = foodList[index];
    		//better-scroll滚动特定位置的接口
    		this.foodsScroll.scrollToElement(el,300)
    	},
    	_drop(target){
    		 this.$refs.shopCart.drop(target)
    	},

    	selectFood(food,event){
    		if(!event._constructed){
    			return 
    		}
    		this.selectedFood = food;
    		//调用子组件的方法
    		this.$refs.food.show(); 
    	}
    },
    components:{
    	shopcart,cartcontrol,food
    },
    //接受子组件派发过来的事件
    events:{
    	//target为cartControl .$dispatch派发过来的参数 
    	'cart.add':function(target){
    	//	this._drop(target)
    	}
    }
}
</script>
<style>
.d0 {
    color: blue
}

.d1 {
    color: red;
}

.d2 {
    color: yellow;
}

.goods {
    position: absolute;
    width: 100%;
    top: 190px;
    bottom: 46px;
    display: flex;
    overflow: hidden;
}

.goods .menuWrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7
}

.goods .menuWrapper .menu-item{
	display: table;
	width: 56px;
	height: 54px;
	line-height: 14px;
}

.goods .menuWrapper .menu-item 
.goods .foodsWrapper {
    flex: 1;
}

.foodsWrapper .title{padding-left:14px; height: 26px; line-height: 26px; border-left: 2px solid #d9ddd1; font-size: 12px;color: rgba(147,153,159); background: #f3f5f7; width: 100%; margin:0;}
.food-item{display: flex;margin:18px; position: relative;}

.food-item .icon{flex:0 0 57px; margin-right: 10px;}
.food-item .content{ flex: 1 }
.food-item .content .name{ font-size: 14px; margin:2px 0 8px 0; height: 14px; line-height: 14px; color: rgb(7,17,27);}
.food-item .content .desc{margin-bottom: 8px; line-height: 10px; font-size: 10px; color: rgb(147,153,159)}
.food-item .content .extra{font-size: 10px; line-height: 10px;color: rgb(147,153,159)}
.food-item .content .extra .count{margin-right: 12px;}

.food-item .content .price{font-weight: 700;line-height: 24px;}
.food-item .content .price .now{ color: red; font-size: 14px; margin-right: 8px;}
.food-item .content .price .old{text-decoration: line-through; font-size: 10px; color: #666;}

.menu-item.current{position: relative;margin-top: -1px; z-index: 10;background-color: #fff; font-weight: 700}

.cartcontrol-wrapper{position: absolute; right: 0; bottom:0;}
</style>
