<template>
  <div id="assemble">
    <div class="body">
      <div class="goodsInfo">
        <image :src="captainArray.groupgoods_url" class="img" />
        <div class="desc">
          <div class="text">
            <div class="descri">{{captainArray.groupgoods_desc}}</div>
          </div>
          <span class="peopleGroup">{{person}}人团</span>
          <div class="origPrice">￥{{oriPrice}}</div>
          <div class="price">￥{{groupPrice}}</div>
        </div>
      </div>
      <div class="user">
        <div class="userName">
          <span class="name">{{captainArray.nick_name}}</span>发现的好东西,快来参加拼团吧！
        </div>
        <div class="time">
          <span class="text1">还差</span>
          <span class="text2">{{needPerson}}</span>
          <span class="text3">人</span>
          <span class="text4">距结束</span>
          <count-Down :endDate="endTime"></count-Down>
        </div>
        <div class="radius">
          <div class="userGroup">
            <div class="user1">
              <image :src="captainArray.image" />
              <div class="caption">团长</div>
              <div class="nickName">{{captainArray.nick_name}}</div>
            </div>
            <div class="user2" v-for="item in personArray" :key="item">
              <image :src="memberArray[item].image" v-if="memberArray[item]" />
              <div class="invite" v-else>?</div>
              <div class="nickName" v-if="memberArray[item]">{{memberArray[item].nick_name}}</div>
              <div class="nickName" v-else>待邀请</div>
            </div>
          </div>
          <div class="userGroup"></div>
        </div>
      </div>
      <button class="inviteFriend" open-type="share" v-if="isMember">邀请好友</button>
      <button
        class="payGroup"
        v-if="isVisit"
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
      >支付￥{{groupPrice}}元参与拼团</button>
      <div class="inviteFriend" v-if="isSuccess">拼团成功</div>
    </div>
    <div class="process">
      <div class="content">
        <div class="top">
          <div class="left">拼团流程</div>
          <div class="right">详细说明></div>
        </div>
        <div class="groupPics">
          <div class="pics">
            <image src="/static/asssemble/begin.png" />
            <div>团长开团</div>
          </div>
          <div class="pics">
            <image src="/static/asssemble/invite.png" />
            <div>邀请好友</div>
          </div>
          <div class="pics">
            <image src="/static/asssemble/success.png" />
            <div>拼团成功</div>
          </div>
          <div class="pics">
            <image src="/static/asssemble/wait.png" />
            <div>等待发货</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countDown from "../../components/countDown";
import moment from "moment"
export default {
  data() {
    return {
      person: 0,
      personArray: [],
      time: 0,
      actId: 0,
      info: [],
      myOpenId: "",
      captainArray: [],
      memberArray: [],
      isMember: false,
      isVisit: true,
      memberNum: 0,
      isSuccess: false,
      endTime:0
    };
  },
  components: {
    countDown
  },
  methods: {
    handleGetUserInfo(res) {
      if (res.mp.detail.userInfo) {
        let userInfo = res.mp.detail.userInfo;
        userInfo.openId = this.myOpenId;
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
      let goodsPayData = [
        { type: 5 },
        {
          openId: this.myOpenId,
          actId: this.captainArray.act_no,
          goods_id: this.captainArray.groupgoods_id,
          num: 1,
          goods_name: this.captainArray.groupgoods_desc,
          goods_price: this.captainArray.groupgoods_groupbuyprice,
          goods_url: this.captainArray.groupgoods_url,
          goods_desc: this.captainArray.groupgoods_desc
        }
      ];
      wx.navigateTo({
        url: "../pay/main?payGoods=" + JSON.stringify(goodsPayData)
      });
    },
    async getSet() {
      try {
        const res = await this.$http.get("/groupset");
        this.person = res.data[0].person;
        this.time = res.data[0].time;
        this.personArray = [];
        for (let i = 0; i < this.person - 1; i++) {
          this.personArray.push(i);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getInfo() {
      this.actId = this.$mp.query.actId;
      this.info = [];
      try {
        const res = await this.$http.post("/groupinfo", { actNo: this.actId });
        for (let prop in res.data) {
          this.info.push(res.data[prop]);
        }
        let obj = {};
        this.info.map(item => {
          //去重
          obj[item.open_id] = item;
        });
        this.info = Object.values(obj);
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    oriPrice() {
      return (this.captainArray.groupgoods_originalprice / 100).toFixed(2);
    },
    groupPrice() {
      return (this.captainArray.groupgoods_groupbuyprice / 100).toFixed(2);
    },
    needPerson() {
      return this.person - this.memberNum;
    }
  },
  onShareAppMessage() {
    return {
      title: this.captainArray.nick_name + "邀请快来拼团!",
      path: "/pages/assemble/main?actId=" + this.captainArray.act_no
    };
  },
  onPullDownRefresh() {
    wx.redirectTo({
      url: "../assemble/main?actId=" + this.captainArray.act_no
    });
    wx.stopPullDownRefresh();
  },
  async onShow() {
    this.isMember = false;
    this.isVisit = true;
    this.isSuccess = false;
    if (!this.myOpenId) {
      wx.login({
        success: result => {
          this.$http.get(`/login?jsCode=${result.code}`).then(res => {
            this.myOpenId = res.data;
          });
        }
      });
    }
    this.myOpenId = wx.getStorageSync("userInfo").openId || "";
    this.getSet();
    await this.getInfo();
    this.memberNum = this.info.length; //团人数
    this.captainArray = this.info.filter(v => v.captain)[0]; //团长数组
    this.memberArray = this.info.filter(v => !v.captain); //团员数组
    this.endTime = parseInt(this.captainArray.date)+parseInt(this.time*60*60*1000);
    this.isMember = this.info.some(v => v.open_id === this.myOpenId);
    this.isVisit = !this.isMember;
    console.log(this.memberNum, this.person);
    if (this.memberNum == this.person) {
      this.isSuccess = true;
      this.isMember = false;
      this.isVisit = false;
      this.$http.post('/success',{
        actId:this.captainArray.act_no
      })
    }
  }
};
</script>

<style lang="scss">
page {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #fd0, #f00);
  #assemble {
    .body {
      border-radius: 30rpx;
      background-color: #fff;
      width: 88%;
      margin: 0 auto;
      padding: 20rpx;
      .goodsInfo {
        border-bottom: 2rpx solid #ccc;
        display: flex;
        .img {
          flex: 2;
          height: 300rpx;
          margin: 10rpx;
        }
        .desc {
          margin: 10rpx;
          flex: 3;
          .text {
            .descri {
              font-size: 28rpx;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
          .peopleGroup {
            color: #f40;
            font-size: 20rpx;
            border: 1px solid #f40;
            line-height: 30rpx;
            height: 30rpx;
            border-radius: 5rpx;
            text-align: center;
            display: inline-block;
            width: 100rpx;
            margin: 10rpx;
          }
          .origPrice {
            color: #999;
            text-decoration: line-through;
            margin: 10rpx;
          }
          .price {
            color: #f10;
            font-size: 50rpx;
            font-weight: 1000;
            margin-top: 30rpx;
          }
        }
      }
      div.user {
        div.userName {
          font-size: 30rpx;
          margin: 10rpx;
          span.name {
          }
        }

        div.time {
          font-size: 28rpx;
          display: flex;
          justify-content: center;
          .text1 {
          }
          .text2 {
            color: #f00;
          }
          .text3 {
            margin-right: 30rpx;
          }
          .text4 {
            margin-right: 20rpx;
          }
        }
        div.radius {
          div.userGroup {
            margin: 30rpx 0;
            display: flex;
            justify-content: center;
            div.user1 {
              position: relative;
              width: 18%;
              display: flex;
              flex-direction: column;
              align-items: center;
              image {
                height: 100rpx;
                width: 100rpx;
                border-radius: 50%;
              }
              div.caption {
                width: 80rpx;
                height: 32rpx;
                line-height: 32rpx;
                color: #fff;
                border-radius: 18rpx;
                background-color: #f00;
                position: absolute;
                font-size: 24rpx;
                text-align: center;
                top: 70rpx;
              }
              div.nickName {
                font-size: 24rpx;
                width: 100rpx;
                height: 32rpx;
                color: #000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            div.user2 {
              width: 18%;
              display: flex;
              flex-direction: column;
              align-items: center;
              .invite {
                height: 100rpx;
                width: 100rpx;
                border-radius: 50%;
                background-color: #ddd;
                line-height: 100rpx;
                text-align: center;
                border: 1rpx dashed #999;
                color: #999;
                font-size: 40rpx;
                box-sizing: border-box;
              }
              image {
                height: 100rpx;
                width: 100rpx;
                border-radius: 50%;
              }
              div.nickName {
                font-size: 24rpx;
                width: 100rpx;
                height: 32rpx;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
              }
            }
          }
        }
      }
      button.inviteFriend {
        color: #fff;
        width: 600rpx;
        text-align: center;
        line-height: 100rpx;
        height: 100rpx;
        background-color: #f00;
        font-weight: bold;
        border-radius: 10rpx;
        margin: 100rpx auto;
      }

      button.payGroup {
        color: #fff;
        width: 600rpx;
        text-align: center;
        line-height: 100rpx;
        height: 100rpx;
        background-color: #f00;
        font-weight: bold;
        border-radius: 10rpx;
        margin: 100rpx auto;
      }
      div.inviteFriend {
        color: #fff;
        width: 600rpx;
        text-align: center;
        line-height: 100rpx;
        height: 100rpx;
        background-color: #f00;
        font-weight: bold;
        border-radius: 10rpx;
        margin: 100rpx auto;
      }
    }
    div.process {
      margin-top: 105rpx;
      padding: 80rpx 0;
      width: 100%;
      height: 100%;
      background-color: #f3f3f3;
      div.content {
        width: 88%;
        padding: 30rpx;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 30rpx;
        div.top {
          display: flex;
          justify-content: space-between;
          div.left {
          }

          div.right {
          }
        }
        div.groupPics {
          display: flex;
          margin-top: 40rpx;
          div.pics {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            image {
              width: 100rpx;
              height: 100rpx;
            }

            div {
            }
          }
        }
      }
    }
  }
}
</style>