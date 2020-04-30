<template>
  <div id="tabs">
    <div class="title">
      <div
        class="title-item"
        @click="changeAct"
        v-for="(item,index) in content"
        :key="index"
        :class="{active:item.isAct}"
        :data-index="index"
        :data-type="item.type"
      >{{item.name}}</div>
    </div>
    <ul v-if="isShow">
      <li class="goods" v-for="item in my" :key="item.act_no" @click="toGroup($event,item.act_no)">
        <image class="img" :src="item. groupgoods_url" />
        <div class="goodsInfo">
          <div class="desc">{{item.groupgoods_desc}}</div>
          <div class="numTool">
            <div class="price">￥{{item.groupgoods_groupbuyprice/100}}</div>
            <div class="goodsNum">X 1</div>
          </div>
        </div>
      </li>
    </ul>
    <ul v-else>
      <li
        class="goods"
        v-for="item in join"
        :key="item.act_no"
        @click="toGroup($event,item.act_no)"
      >
        <image class="img" :src="item. groupgoods_url" />
        <div class="goodsInfo">
          <div class="desc">{{item.groupgoods_desc}}</div>
          <div class="numTool">
            <div class="price">￥{{(item.groupgoods_groupbuyprice)/100}}</div>
            <div class="goodsNum">X 1</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        { name: "我的团", isAct: true, type: 1 },
        { name: "所参团", isAct: false, type: 0 }
      ],
      my: [],
      join: [],
      isShow: true
    };
  },
  methods: {
    changeAct(e) {
      const index = e.mp.currentTarget.dataset.index;
      const type = e.mp.currentTarget.dataset.type;
      let list = this.content;
      list.forEach(
        (v, i) => (i === index ? (v.isAct = true) : (v.isAct = false))
      );
      if (type) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      // this.$http.post("/myGroup", {
      //   openId: openId,
      //   type: type
      // });
    },
    toGroup(e, id) {
      wx.navigateTo({
        url: "../assemble/main?actId=" + id
      });
    }
  },
  async onLoad() {
    let openId = wx.getStorageSync("userInfo").openId;
    this.$http
      .post("/myGroup", {
        openId: openId,
        type: 1
      })
      .then(res => {
        this.my = res.data;
      });
    const joinRes = await this.$http.post("/myGroup", {
      openId: openId,
      type: 0
    });
    this.join = joinRes.data;
  }
};
</script>

<style lang="scss" scoped>
#tabs {
  .title {
    box-shadow: 0 2rpx 10rpx 0 #ccc;
    display: flex;
    padding: 10rpx 10rpx 0rpx 10rpx;
    background-color: #fff;
    .title-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10rpx;
      font-size: 36rpx;
    }
    .active {
      border-bottom: 8rpx solid #f00;
    }
  }
  ul {
    li.goods {
      box-shadow: 0 2rpx 10rpx 0 #ccc;
      border-radius: 20rpx;
      width: 90%;
      background: #fff;
      padding: 10rpx;
      justify-content: center;
      align-items: center;
      margin: 20rpx auto;
      height: 200rpx;
      display: flex;
      image.img {
        flex: 3;
        width: 80%;
        height: 80%;
      }
      div.goodsInfo {
        flex: 5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10rpx;
        div.desc {
          font-size: 28rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 40rpx;
        }
        div.numTool {
          display: flex;
          justify-content: space-around;
          div.price {
            color: #f40;
            font-weight: bold;
          }
          div.goodsNum {
            font-weight: bold;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>