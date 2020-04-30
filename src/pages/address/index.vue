<template>
  <div id="address">
    <div class="address">
      <div class="name">
        <div class="name_title">姓名</div>
        <input type="text" placeholder="收货人姓名" v-model="name" />
      </div>
      <div class="tel">
        <div class="tel_title">电话</div>
        <input type="text" placeholder="收货人电话" v-model="tel" />
      </div>
      <div class="sectionAddress">
        <div class="section__title">地区</div>
        <picker mode="region" @change="regionChange" :value="region">
          <div class="picker" :style="{color:selectColor}">{{region[0]}}/{{region[1]}}/{{region[2]}}</div>
        </picker>
      </div>
      <div class="detailAddress">
        <div class="detail_title">详细地址</div>
        <input type="text" id="input" placeholder="街道门牌、楼层、房间号等详细信息" v-model="detailAddress" />
      </div>
    </div>
    <button class="save" @click="saveAndReturn">保存并返回</button>
    <button class="cancel" @click="cancelHandle">取消</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      region: [],
      selectColor: "#999",
      detailAddress: "",
      tel: "",
      name: ""
    };
  },
  methods: {
    regionChange: function(e) {
      this.region = e.mp.detail.value;
      console.log(e.mp.detail.value);
      this.selectColor = "#000";
    },
    saveAndReturn() {
      let region = this.region;
      let detailAddress = this.detailAddress;
      let name = this.name;
      let tel = this.tel;
      wx.setStorageSync("address", region);
      wx.setStorageSync("detailAddress", detailAddress);
      wx.setStorageSync("name", name);
      wx.setStorageSync("tel", tel);
      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 1500,
        mask: true, //防止用户疯狂点击
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1000);
    },
    cancelHandle() {
      wx.navigateBack({
        delta: 1
      });
    }
  },
  onShow() {
    let addressData = wx.getStorageSync("address") || [];
    let detailAddressData = wx.getStorageSync("detailAddress") || "";
    let name = wx.getStorageSync("name") || "";
    let tel = wx.getStorageSync("tel") || "";
    if (addressData.length === 0) {
      this.region = ["选择省", "市", "区"];
    } else {
      this.region = addressData;
      this.selectColor = "#000";
    }
    if (detailAddressData) {
      this.detailAddress = detailAddressData;
    } else {
      this.detailAddress = "";
    }
    if (name) {
      this.name = name;
    } else {
      this.name = "";
    }
    if (tel) {
      this.tel = tel;
    } else {
      this.tel = "";
    }
  }
};
</script>
<style scope lang="scss">
page {
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
  #address {
    .address {
      background-color: #fff;
      margin: 20rpx;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      .name {
        display: flex;
        margin: 20rpx 0 20rpx 20rpx;
        border-bottom: 1rpx solid #eee;
        padding-bottom: 30rpx;
        .name_title {
          margin-right: 20rpx;
        }
        input {
          width: 600rpx;
        }
      }
      .tel {
        margin: 20rpx 0 20rpx 20rpx;
        display: flex;
        border-bottom: 1rpx solid #eee;
        padding-bottom: 30rpx;
        .tel_title {
          margin-right: 20rpx;
        }
        input {
          width: 600rpx;
        }
      }
      .sectionAddress {
        margin: 20rpx 0 20rpx 20rpx;
        display: flex;
        border-bottom: 1rpx solid #eee;
        padding-bottom: 30rpx;
        .section__title {
          margin-right: 20rpx;
        }
        picker {
          width: 600rpx;
        }
      }
      .detailAddress {
        display: flex;
        margin: 20rpx 0 20rpx 20rpx;
        .detail_title {
          margin-right: 20rpx;
        }
        input {
          font-size: 28rpx;
          margin: 0;
          padding: 0;
          width: 540rpx;
        }
      }
    }
    .save {
      background-color: #f22;
      margin: 20rpx;
      border-radius: 30rpx;
    }
    .cancel {
      background-color: #fff;
      margin: 20rpx;
      border-radius: 30rpx;
    }
  }
}
</style>