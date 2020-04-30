<template>
  <div class="time">
    <span class="text5">{{countDown}}</span>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      now: moment()
    };
  },
  props:['endDate'],
  methods: {
    PrefixInteger(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    }
  },
  mounted() {
    //定时更新当前时间
    setInterval(() => {
      this.now = moment();
    }, 1000);
    //数字前补 0
    // num传入的数字，n需要的字符长度
  },
  computed: {
    //计算属性，返回剩余时间
    countDown() {
        let m1 = this.now;
        let m2 = moment(this.endDate);
        var du = moment.duration(m2 - m1, "ms"),
          hours = du.get("hours"),
          mins = du.get("minutes"),
          ss = du.get("seconds");
        if (hours <= 0 && mins <= 0 && ss <= 0) {
          return "已结束";
        } else {
          return (
            this.PrefixInteger(hours, 2) +
            ":" +
            this.PrefixInteger(mins, 2) +
            ":" +
            this.PrefixInteger(ss, 2)
          );
        }
   
    }
  }
};
</script>

<style lang="scss" scoped>
div.time {
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  .text5 {
    color: #f00;
  }
}
</style>