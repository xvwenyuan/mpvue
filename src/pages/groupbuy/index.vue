<template>
  <div class="groupbuy">
    <ul>
      <li v-for="item in goodsList" :key="item.groupgoods_id" @click="goGroupDetail(item)">
        <img :src="item.groupgoods_url" alt="">
        <p class="desc">{{item.groupgoods_desc}}</p>
        <p class="price">拼团价格:￥<span class="groupPrice">{{item.groupgoods_groupbuyprice/100}}</span><span class="originalPrice">原价:￥{{item.groupgoods_originalprice/100}}</span></p>
        <p class="sale">已拼{{item.groupgoods_sale}}件</p>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  data () {
    return {
      goodsList:[]
    }
  },
  mounted(){
    this.$http.get('/groupgoods').then(res => {
    this.goodsList = res.data;
  }
  )
  },
  onPullDownRefresh() {
    this.$http.get("/groupgoods").then(res => {
      this.goodsList = res.data;
      wx.stopPullDownRefresh();
    });
  },
  methods:{
    goGroupDetail(detailData){
      wx.navigateTo({
        url:'/pages/groupdetail/main?goodsData='+JSON.stringify(detailData)
      })
    }
  }
}

    
</script>

<style scoped lang="scss">
ul {
  display: flex;
  flex-wrap: wrap;
  background-color: #f3f3f3;

  li {
    width: 45.7%;
    padding: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    margin: 10rpx 7.5rpx;
    background-color: #fff;
    img {
      width: 300rpx;
      height: 300rpx;
    }
    p.desc{
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    p.price{
      span.groupPrice{
        font-size: 28rpx;
        color: #f00;
        font-weight: bold;
      }
      span.originalPrice{
        color: #9c9c9c;
        text-decoration: line-through;
      }
    }
    p.sale{
      color:#555
    }

  }

}
</style>
