<template>
  <div class="root">
    <div class="headers">
      <img :src="userInfo.avatarUrl?userInfo.avatarUrl:'/static/my/headimg.png'" />
      <button
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
      >{{userInfo.nickName?userInfo.nickName:'登录'}}</button>
    </div>
    <div class="content">
      <div class="order">
        <div class="all">
          <span class="my">我的订单</span>
          <span class="find">查看全部 ></span>
        </div>
      </div>
      <ul class="one">
        <li>
          <img src="/static/my/pay.png" alt />
          <p>待付款</p>
        </li>
        <li>
          <img src="/static/my/receive.png" alt />
          <p>待收货</p>
        </li>
        <li>
          <img src="/static/my/finish.png" alt />
          <p>已完成</p>
        </li>
        <li>
          <img src="/static/my/assess.png" alt />
          <p>待评价</p>
        </li>
      </ul>
    </div>
    <ul class="two">
      <li @click="toMyGroup">
        <img src="/static/my/groupbuy.png" alt />
        <p>我的团购</p>
      </li>
      <li>
        <img src="/static/my/coupon.png" alt />
        <p>优惠券</p>
      </li>
      <li>
        <img src="/static/my/collect.png" alt />
        <p>商品收藏</p>
      </li>
      <li>
        <img src="/static/my/history.png" alt />
        <p>浏览历史</p>
      </li>
      <li>
        <img src="/static/my/drawback.png" alt />
        <p>退款售后</p>
      </li>
    </ul>
    <div
      class="address"
      @click="toAddress"
    >地址：{{region[0]}}{{region[1]}}{{region[2]}} {{detailAddress}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      openId: "",
      region: [],
      detailAddress: ""
    };
  },
  methods: {
    handleGetUserInfo(res) {
      if (res.mp.detail.userInfo) {
        let userInfo = res.mp.detail.userInfo;
        userInfo.openId = this.openId;
        this.userInfo = userInfo;
        wx.setStorageSync("userInfo", userInfo);
        this.$http.post("/user", {
          openId: userInfo.openId,
          nickName: userInfo.nickName,
          image: userInfo.avatarUrl,
          gender: userInfo.gender,
          city: userInfo.city,
          province: userInfo.province
        });
      }
    },
    toAddress() {
      wx.navigateTo({
        url: "../address/main"
      });
    },
    toMyGroup(){
      wx.navigateTo({
        url: '../mygroup/main'
      });
    }
  },
  mounted() {
    if (!this.openId) {
      wx.login({
        success: result => {
          this.$http.get(`/login?jsCode=${result.code}`).then(res => {
            this.openId = res.data;
          });
        }
      });
    }
    this.userInfo = wx.getStorageSync("userInfo") || {};
  },
  onShow() {
    this.region = wx.getStorageSync("address") || [];
    this.detailAddress = wx.getStorageSync("detailAddress") || "";
  }
};
</script>

<style scoped lang="scss">
.root {
  .headers {
    height: 200rpx;
    margin-bottom: 20rpx;
    background-color: #fd0;
    img {
      height: 100rpx;
      width: 100rpx;
      margin: 50rpx 20rpx;
      border-radius: 50%;
    }
    button {
      display: inline-block;
      height: 80rpx;
      margin: 60rpx 10rpx;
      max-width: 400rpx;
      line-height: 80rpx;
      font-size: 26rpx;
      background-color: #fd0;
    }
    button::after {
      border: none;
    }
  }
  .content {
    border: 2rpx solid #ccc;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 10rpx 0 #ccc;
    margin: 30rpx auto;
    width: 680rpx;
    padding: 20rpx;
    .order {
      margin-bottom: 40rpx;
      .all {
        display: flex;
        margin: 0 auto;
        justify-content: space-between;
        font-size: 30rpx;
        .my {
          font-weight: bold;
        }
        .find {
          color: #555;
          font-size: 26rpx;
        }
      }
    }
    ul.one {
      display: flex;
      justify-content: space-between;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }
  }
  ul.two {
    display: flex;
    justify-content: space-between;
    border: 2rpx solid #ccc;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 10rpx 0 #ccc;
    margin: 30rpx auto;
    width: 680rpx;
    padding: 20rpx;
    font-size: 26rpx;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  .address {
    border: 2rpx solid #ccc;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 10rpx 0 #ccc;
    margin: 30rpx auto;
    width: 680rpx;
    padding: 20rpx;
    font-size: 26rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
