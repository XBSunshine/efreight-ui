//订单查询列表与订单轨迹页面 显示规则
export const orderDisplayRule = {
  /**
   * 如果 实际 与 预计 误差 超过 3% ,  或 相差 100kg；则标红
   * @param plan 预计
   * @param confirm 实际
   * @return {boolean}
   */
  checkFlag(plan, confirm) {
    if (confirm != null) {
      let planUp = this.multiply(plan, 1.03);
      let planDown = this.multiply(plan, 0.97);
      let plan1 = plan + 100;
      let plan2 = plan - 100;
      if ((confirm > planUp) || (confirm < planDown) || (confirm < plan2) || (confirm > plan1)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  /**
   * 实际件数 和 预计件数 不等， 则 标红；
   * @param planPieces
   * @param confirmPieces
   */
  checkPieces(planPieces, confirmPieces){
    return confirmPieces != null && planPieces != confirmPieces;
  },
  /**
   * 如果 实际体积 与 预计体积 误差 超过 10%，则标红
   * @param planVolume
   * @param confirmVolume
   * @return {boolean}
   */
  volumeFlag(planVolume, confirmVolume) {
    if (confirmVolume != null) {
      let planVolumeUp = this.multiply(planVolume, 1.10);
      let planVolumeDown = this.multiply(planVolume, 0.90);
      if ((confirmVolume > planVolumeUp) || (confirmVolume < planVolumeDown)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  multiply(num1, num2) { //解决js乘法运算的小数问题
    let m = 0,
      s1 = num1 + "",
      s2 = num2 + "";
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
};
