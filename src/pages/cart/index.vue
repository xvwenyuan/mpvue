<template>
  <div id="cartPage">
    <div class="cartTop">
      <div class="editCart" v-if="isEdit" @click="handleEdit">编辑</div>
      <div class="editCart" v-else @click="handleEdit">完成</div>
    </div>
    <div class="fillTop"></div>
    <ul v-if="cartData.length!==0">
      <li class="goods" v-for="item in cartData" :key="item.goods_id">
        <checkbox-group :data-id="item.goods_id" @change="handleChange">
          <checkbox :checked="item.checked"></checkbox>
        </checkbox-group>
        <image class="img" :src="item.goods_url" />
        <div class="goodsInfo">
          <div class="desc">{{item.goods_desc}}</div>
          <div class="numTool">
            <div class="price">￥{{item.goods_price/100}}</div>
            <div class="tool">
              <div
                class="minus"
                @click="goodsNumChange"
                :data-id="item.goods_id"
                :data-operate="-1"
              >-</div>
              <div class="goodsNum">{{item.num}}</div>
              <div class="add" @click="goodsNumChange" :data-id="item.goods_id" :data-operate="1">+</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="blank">
      购物车空空如也，还不赶快填满！！！！
      <image src="/static/others/spare.gif" />
    </div>
    <div class="fill"></div>
    <div class="total">
      <div class="all">
        <span class="allSelect">全选</span>
        <checkbox-group @change="handleAllCheck">
          <checkbox :checked="allChecked"></checkbox>
        </checkbox-group>
      </div>
      <div class="sum" v-if="isEdit">
        <div class="header">
          合计：
          <span class="price">￥{{totalPrice}}</span>
        </div>
        <div class="footer">免运费</div>
      </div>
      <div class="sum" v-else></div>
      <div class="pay" v-if="isEdit" @click="goPay">结算({{totalNum}})</div>
      <div class="pay" v-else @click="handleRemove">删除({{totalNum}})</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartData: [],
      allChecked: true,
      totalPrice: 0,
      totalNum: 0,
      isEdit: true
    };
  },
  methods: {
    handleChange(e) {
      const goods_id = e.currentTarget.dataset.id;
      let cart = this.cartData;
      let index = cart.findIndex(v => goods_id === v.goods_id);
      cart[index].checked = !cart[index].checked;
      this.reCompute(cart);
    },
    goodsNumChange(e) {
      let id = e.currentTarget.dataset.id;
      let operate = e.currentTarget.dataset.operate;
      let cart = this.cartData;
      let index = cart.findIndex(v => v.goods_id === id);
      if (operate === -1 && cart[index].num === 1) {
        wx.showModal({
          title: "提示",
          content: "是否该删除商品？",
          success: res => {
            if (res.confirm) {
              console.log("用户点击确定");
              cart.splice(index, 1);
              this.reCompute(cart);
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        cart[index].num += operate;
        this.reCompute(cart);
      }
    },
    reCompute(cart) {
      this.cartData = cart;
      wx.setStorageSync("cart", cart);
      let totalPrice = 0;
      let totalNum = 0;
      let allChecked = true;
      this.cartData = wx.getStorageSync("cart") || [];
      this.cartData.forEach(v => {
        if (v.checked) {
          totalPrice += v.goods_price / 100.0 * v.num;
          totalNum += v.num;
        } else {
          allChecked = false;
        }
      });
      this.totalPrice = totalPrice.toFixed(2);
      this.totalNum = totalNum;
      this.allChecked = this.cartData.length ? allChecked : false;
    },
    handleAllCheck() {
      this.allChecked = !this.allChecked;
      let cart = this.cartData;
      cart.forEach(v => (v.checked = this.allChecked));
      this.reCompute(cart);
    },
    handleEdit() {
      this.isEdit = !this.isEdit;
    },
    handleRemove() {
      let cart = this.cartData;
      console.log("this获取的：", cart);
      let arr = cart.filter(v => v.checked == true);
      console.log("选中的要删除的：", arr);
      cart = cart.filter(v => v.checked == false);
      console.log("未选中的：", cart);
      if (arr.length != 0) {
        wx.showModal({
          title: "提示",
          content: "是否删除商品？",
          success: res => {
            if (res.confirm) {
              this.reCompute(cart);
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    },
    goPay() {
      if (!this.totalNum) {
        wx.showToast({
          title: "你还没有选购商品",
          icon: "none",
          image: "",
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        });
        return;
      }
      if (wx.getStorageSync("userInfo")) {
        let selectGoods = this.cartData.filter(v => v.checked);
        selectGoods.unshift({type:1});
        wx.navigateTo({
          url: "../pay/main?payGoods="+JSON.stringify(selectGoods)
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "success",
          duration: 2000
        });
        setTimeout(() => {
          wx.switchTab({
            url: '../my/main'
          });
        }, 2000);
      }
    }
  },
  onShow() {
    this.isEdit = true;
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    const cart = wx.getStorageSync("cart") || [];
    this.reCompute(cart);
  }
};
</script>

<style lang="scss">
page {
  background-color: #f3f3f3;
}
div#cartPage {
  div.cartTop {
    position: fixed;
    top: 0;
    background-color: #fff;
    width: 100%;
    height: 50rpx;
    border-bottom: 1rpx solid #ccc;
    div.editCart {
      font-size: 30rpx;
      line-height: 50rpx;
      height: 40rpx;
      float: right;
      margin-right: 60rpx;
    }
  }
  div.fillTop {
    width: 100%;
    height: 50rpx;
  }
  ul {
    li.goods {
      border-radius: 20rpx;
      width: 90%;
      background: #fff;
      padding: 10rpx;
      justify-content: center;
      align-items: center;
      margin: 20rpx auto;
      height: 200rpx;
      display: flex;
      checkbox-group {
        flex: 1;
        width: 50rpx;
        checkbox {
          width: 50rpx;
          margin-left: 10rpx;
        }
      }

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
          justify-content: space-between;
          div.price {
            color: #f40;
            font-weight: bold;
          }
          div.tool {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 50rpx;
            width: 150rpx;
            border: 2rpx solid #ccc;
            border-radius: 30rpx;
            div.minus {
              width: 40rpx;
              height: 40rpx;
              background-color: #f3f3f3;
              text-align: center;
              border-radius: 50%;
              line-height: 35rpx;
              font-weight: bold;
            }
            div.goodsNum {
              width: 40rpx;
              height: 40rpx;
              font-weight: bold;
              line-height: 40rpx;
              text-align: center;
            }
            div.add {
              width: 40rpx;
              height: 40rpx;
              background-color: #f3f3f3;
              text-align: center;
              border-radius: 50%;
              line-height: 35rpx;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  div.blank {
    font-weight: bold;
    image {
      width: 100%;
    }
  }
  div.fill {
    width: 100%;
    height: 100rpx;
  }
  div.total {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    .all {
      display: flex;
      .allSelect {
        height: 50rpx;
        line-height: 50rpx;
        font-size: 28rpx;
        color: #333;
        margin-right: 10rpx;
      }
      checkbox-group {
        height: 50rpx;
        width: 50rpx;
        checkbox {
          width: 50rpx;
          height: 50rpx;
        }
      }
    }

    .sum {
      div.header {
        span.price {
          font-size: 34rpx;
          color: #f40;
          font-weight: bold;
        }
      }
      div.footer {
        background-color: #fff;
        color: #f40;
        font-size: 20rpx;
        border: 1px solid #fff;
        display: inline-block;
        line-height: 30rpx;
        height: 30rpx;
        border-radius: 5rpx;
        margin-left: 130rpx;
        padding: 5rpx;
        border: 2rpx solid #f40;
      }
    }
    div.pay {
      width: 220rpx;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #f40;
      text-align: center;
      line-height: 100rpx;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>
