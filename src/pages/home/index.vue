<template>
  <div id="home">
    <div class="swiper">
      <swiper indicator-dots autoplay circular>
        <swiper-item>
          <img src="/static/slide/boyshirt.jpg" alt />
        </swiper-item>
        <swiper-item>
          <img src="/static/slide/girlclothes.jpg" alt />
        </swiper-item>
        <swiper-item>
          <img src="/static/slide/medical.jpg" alt />
        </swiper-item>
        <swiper-item src="/static/slide/food.jpg">
          <img src="/static/slide/food.jpg" alt />
        </swiper-item>
      </swiper>
    </div>
    <ul>
      <li v-for="data in goodsList" :key="data.goods_id" @click="goDetail(data)">
        <img :src="data.goods_url" />
        <p>{{data.goods_desc}}</p>
      </li>
    </ul>
    <!-- <ul>
      <li v-for="data in goodsList" :key="data.goods_id">
        <img :src="data.goods_url">
          <p>{{data.goods_name}}</p>  
      </li>
    </ul>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: []
    };
  },
  mounted() {
    this.$http.get("/goods").then(res => {
    this.goodsList = res.data;
    });
  },
  onPullDownRefresh() {
    this.$http.get("/goods").then(res => {
      this.goodsList = res.data;
      wx.stopPullDownRefresh();
    });
  },
  methods: {
    goDetail(detailData) {
      wx.navigateTo({
        url: "/pages/goodsdetail/main?goodsData=" + JSON.stringify(detailData)
      });
    }
  }
};
</script>

<style scoped lang="scss">
swiper-item {
  img {
    width: 750rpx;
  }
}
ul {
  display: flex;
  flex-wrap: wrap;
  background-color: #f3f3f3;

  li {
    padding: 20rpx;
    width: 43%;
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
  }
}
</style>
