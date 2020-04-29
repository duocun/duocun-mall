import { OrderType } from "./order.model";

export const TransactionAction = {
  DECLINE_CREDIT_CARD: { code: "DC", name: "decline credit card payment" },
  PAY_DRIVER_CASH: { code: "PDCH", name: "client pay driver cash" }, // 'client pay cash', 'pay cash'
  PAY_BY_CARD: { code: "PC", name: "client pay by card" }, // 'pay by card'
  PAY_BY_WECHAT: { code: "PW", name: "client pay by wechat" }, // 'pay by wechat'

  PAY_MERCHANT_CASH: { code: "PMCH", name: "driver pay merchant cash" }, // pay merchant
  PAY_MERCHANT_BY_CARD: { code: "PMC", name: "driver pay merchant by card" }, // pay merchant by card
  PAY_MERCHANT_BY_WECHAT: {
    code: "PMW",
    name: "driver pay merchant by wechat"
  }, // pay merchant by wechat

  PAY_SALARY: { code: "PS", name: "pay salary" },
  PAY_OFFICE_RENT: { code: "POR", name: "pay office rent" },

  ORDER_FROM_MERCHANT: { code: "OFM", name: "duocun order from merchant" },
  ORDER_FROM_DUOCUN: { code: "OFD", name: "client order from duocun" },
  CANCEL_ORDER_FROM_MERCHANT: {
    code: "CFM",
    name: "duocun cancel order from merchant"
  },
  CANCEL_ORDER_FROM_DUOCUN: {
    code: "CFD",
    name: "client cancel order from duocun"
  },

  REFUND_EXPENSE: { code: "RE", name: "refund expense" },
  REFUND_CLIENT: { code: "RC", name: "refund client" },
  ADD_CREDIT_BY_CARD: { code: "ACC", name: "client add credit by card" },
  ADD_CREDIT_BY_WECHAT: { code: "ACW", name: "client add credit by WECHATPAY" },
  ADD_CREDIT_BY_CASH: { code: "ACCH", name: "client add credit by cash" },
  TRANSFER: { code: "T", name: "transfer" },
  BUY_MATERIAL: { code: "BM", name: "buy material" }, // buy drinks
  BUY_EQUIPMENT: { code: "BE", name: "buy equipment" },
  BUY_ADVERTISEMENT: { code: "BA", name: "buy advertisement" },
  OTHER_EXPENSE: { code: "OE", name: "other expense" },
  TEST: { code: "TEST", name: "test" }
};

export interface TransactionInterface {
  _id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  actionCode: string;
  paymentId: string;
  delivered: string;
  fromBalance: number;
  toBalance: number;
  created: string;
  modified: string;
  orderType?: string;
  note?: string;
  description?: string; // this field is appended in client side
}

export function getTransactionDescription(
  t: TransactionInterface,
  clientId: string
): string {
  if (t.actionCode === TransactionAction.CANCEL_ORDER_FROM_DUOCUN.code) {
    // 'client cancel order from duocun') {
    const toName = t.toName ? t.toName : "";
    return (this.lang === "en" ? "Cancel" : "取消") + toName;
  } else if (t.actionCode === TransactionAction.PAY_BY_CARD.code) {
    // 'pay by card') {
    return this.lang === "en" ? "by bank card" : "银行卡付款";
  } else if (t.actionCode === TransactionAction.DECLINE_CREDIT_CARD.code) {
    // 'bank card pay fail') {
    return this.lang === "en" ? "bank card pay fail" : "银行卡付款失败";
  } else if (t.actionCode === TransactionAction.PAY_BY_WECHAT.code) {
    // 'pay by wechat') {
    return this.lang === "en" ? "wechat pay" : "微信付款";
  } else if (t.actionCode === TransactionAction.ADD_CREDIT_BY_CASH.code) {
    // 'client add credit by cash') {
    return this.lang === "en" ? "add credit" : "现金充值";
  } else if (t.actionCode === TransactionAction.ADD_CREDIT_BY_CARD.code) {
    // 'client add credit by card') {
    return this.lang === "en" ? "add credit" : "信用卡充值";
  } else if (t.actionCode === TransactionAction.ADD_CREDIT_BY_WECHAT.code) {
    // 'client add credit by WECHATPAY') {
    return this.lang === "en" ? "add credit" : "微信充值";
  } else {
    const fromId = t.fromId ? t.fromId : "";
    const toName = t.toName ? t.toName : "";
    const fromName = t.fromName ? t.fromName : "";
    const name = fromId === clientId ? toName : fromName;
    if (t.orderType === OrderType.MOBILE_PLAN_MONTHLY) {
      return name + (this.lang === "en" ? " Phone monthly fee" : " 电话月费");
    } else if (t.orderType === OrderType.MOBILE_PLAN_SETUP) {
      return name + (this.lang === "en" ? " Phone setup fee" : " 电话安装费");
    } else {
      return name + " " + (t.note ? t.note : ""); // fix me
    }
  }
}
