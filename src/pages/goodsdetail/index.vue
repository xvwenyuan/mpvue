<template>
  <div id="goodsdetail">
    <div class="img">
      <image :src="goodsData.goods_detailurl" />
    </div>
    <div class="price">￥{{price}}</div>
    <div class="desc">
      <p class="goodsDesc">{{goodsData.goods_desc}}</p>

      <div class="collect" @click="handleCollect">
        <image
          :src="!isCollect?'/static/goodsdetail/collect.png':'/static/goodsdetail/collect-active.png'"
        />
        <div>收藏</div>
      </div>
      <div class="share">
        <button open-type="share" plain="true" type="primary" style="width:50rpx height:50rpx">
          <image src="/static/groupdetail/share.png" />
        </button>
        <div>分享</div>
      </div>
    </div>
    <div
      class="address"
      @click="goEditAddress"
    >送至 {{region[0]}}{{region[1]}}{{region[2]}} {{detailAddress}} <span class="open">></span></div>
    <div class="fillblank"></div>
    <div class="buy">
      <div class="left" @click="toHome">
        <img src="/static/goodsdetail/home.png" />
        <div>首页</div>
      </div>
      <div class="right" @click="toCart">
        <image src="/static/goodsdetail/cart.png" />
        <div>购物车</div>
      </div>
      <div class="add" @click="handleAddCart">加入购物车</div>
      <div class="imbuy" @click="toPayHandle">立即购买</div>
    </div>
  </div>
</template>

<script>
/**
加入购物车逻辑
1.绑定点击事件
2.事件里获取缓存中的的购物车数组(数组格式)
3.判断数组中是否有当前商品对象
4.若有则当前商品num++
5.若无num为1,push加入数组中
6.把数组放回缓存中
7.弹出提示框

 */
export default {
  data() {
    return {
      goodsData: {},
      region: [],
      detailAddress: "",
      isCollect: false
    };
  },
  mounted() {
    this.goodsData = JSON.parse(this.$mp.query.goodsData);
  },
  computed: {
    price() {
      return (this.goodsData.goods_price / 100).toFixed(2);
    }
  },
  methods: {
    handleAddCart() {
      let cart = wx.getStorageSync("cart") || [];
      let index = cart.findIndex(v => v.goods_id === this.goodsData.goods_id);
      if (index === -1) {
        this.goodsData.num = 1;
        this.goodsData.checked = true;
        cart.push(this.goodsData);
      } else {
        cart[index].num++;
      }
      wx.setStorageSync("cart", cart);
      wx.showToast({
        title: "添加成功",
        icon: "success",
        duration: 1500,
        mask: true, //防止用户疯狂点击
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
    },
    toCart() {
      wx.switchTab({
        url: "../cart/main"
      });
    },
    toHome() {
      wx.switchTab({
        url: "../home/main"
      });
    },
    goEditAddress() {
      wx.navigateTo({
        url: "../address/main"
      });
    },
    handleCollect(){
      this.isCollect = !this.isCollect

    },
    toPayHandle() {
      if (wx.getStorageSync("userInfo")) {
        let goodsData = this.goodsData;
        let goodsDataArray = [goodsData];
        goodsDataArray.unshift({ type: 2 });
        wx.navigateTo({
          url: "../pay/main?payGoods=" + JSON.stringify(goodsDataArray)
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "success",
          duration: 2000
        });
        setTimeout(() => {
          wx.switchTab({
            url: "../my/main"
          });
        }, 2000);
      }
    }
  },
  onShareAppMessage() {
    return {
      title: this.goodsData.goods_name,
      path: "/pages/goodsdetail/main"
    };
  },
  onShow() {
    this.region = wx.getStorageSync("address") || [];
    this.detailAddress = wx.getStorageSync("detailAddress") || "";
  }
};
</script>

<style scoped lang="scss">
#goodsdetail {
  background-color: #f3f3f3;
  .img {
    width: 100%;
    image {
      width: 100%;
    }
  }
  .price {
    width: 100%;
    height: 80rpx;
    background-color: #f40;
    color: #fff;
    font-weight: bold;
    font-size: 40rpx;
    line-height: 80rpx;
    padding-left: 40rpx;
  }
  div.desc {
    margin: 20rpx 0;
    background-color: #fff;
    padding: 10rpx;
    display: flex;
    p {
      font-size: 30rpx;
      font-weight: bold;
    }
    div.collect {
      div {
        font-size: 24rpx;
      }
      image {
        margin: 10rpx 0 5rpx 0;
        width: 50rpx;
        height: 50rpx;
      }
    }
    div.share {
      margin: 0 20rpx;
      button[plain] {
        border: 0;
        padding: 0;
        margin: 0;
        width: 50rpx;
        height: 70rpx;
        image {
          width: 50rpx;
          height: 50rpx;
        }
      }
      div {
        font-size: 24rpx;
        margin: 5rpx 0;
      }
    }
  }
  .address {
    margin: 10rpx 0 0 10rpx 0;
    height: 50rpx;
    width: 100%;
    background-color: #fff;
    padding: 4rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    span.open {
      position: absolute;
      right: 20rpx;
    }
  }
  .fillblank{
    width: 100%;
    height: 700rpx;
  }
  .buy {
    background-color: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 100rpx;
    display: flex;
    .right,
    .left {
      font-size: 20rpx;
      height: 100rpx;
      width: 15%;
      border-top: 2rpx solid #aaa;
      border-bottom: 2rpx solid #aaa;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      image {
        width: 36rpx;
        height: 36rpx;
        margin-left: 38rpx;
      }
      div {
        text-align: center;
      }
    }
    .add {
      width: 35%;
      background-color: #f70;
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      color: #fff;
    }
    .imbuy {
      width: 35%;
      background-color: #f00;
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      color: #fff;
    }
  }
}
</style>
