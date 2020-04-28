import { LocationInterface, AddressInterface } from "./location.model";
import { CartInterface } from "./cart.model";
import { PaymentMethod, PaymentStatus } from "./payment.model";
import { AccountInterface } from './account.model';
import { MerchantInterface } from './merchant.model';
export const OrderType = {
  FOOD_DELIVERY: "F",
  MOBILE_PLAN_SETUP: "MS",
  MOBILE_PLAN_MONTHLY: "MM",
  GROCERY: "G"
};

export const OrderStatus = {
  BAD: "B", // client return, compansate
  DELETED: "D", // cancellation
  TEMP: "T", // generate a temp order for electronic order
  NEW: "N",
  LOADED: "L", // The driver took the food from Merchant
  DONE: "F", // Finish delivery
  MERCHANT_CHECKED: "MC" // VIEWED BY MERCHANT
};

export interface OrderItemInterface {
  productId: string;
  productName?: string;
  merchantId?: string;
  merchantName?: string;
  price?: number;
  cost?: number;
  quantity: number;
}

export interface OrderInterface {
  _id?: string;
  code?: string;
  clientId?: string;
  clientName?: string;
  clientPhoneNumber?: string;
  merchantId?: string;
  merchantName?: string;
  driverId?: string;
  driverName?: string;

  type?: string; // in db
  status?: string;
  paymentStatus?: string;

  pickupTime?: string;
  deliverDate?: string; // eg. 2025-01-03
  deliverTime?: string; // eg. 14:00:01

  note?: string;
  // address?: string;       // should not in db
  location?: LocationInterface;

  items?: OrderItemInterface[];
  tax?: number;
  tips?: number;
  deliveryAddress?: AddressInterface;
  deliveryCost?: number;
  deliveryDiscount?: number;
  overRangeCharge?: number;
  groupDiscount?: number;
  total?: number;
  paymentMethod?: string;
  chargeId?: string; // stripe chargeId
  transactionId?: string;
  payable?: number; // total - balance
  price?: number;
  cost?: number;

  defaultPickupTime?: string;
  dateType?: string; // 'today', 'tomorrow'
  delivered?: Date; // obsoleted
  created?: string; // obsoleted
  modified?: string; // obsoleted
}

export interface OrderSummaryInterface {
  price: number;
  cost: number;
  tips: number;
  tax: number;
  overRangeCharge: number;
  deliveryCost: number;
  deliveryDiscount: number;
  groupDiscount: number;
  total: number;
}

// cart items grouped by merchantId , date and time
export interface CartItemGroupInterface {
  merchantId: string;
  date: string;
  time: string;
  items: Array<{
    productId: string;
    price: number;
    quantity: number;
    cost?: number;
    taxRate?: number;
  }>;
}

export interface ChargeInterface extends OrderSummaryInterface {
  payable: number;
  balance: number;
}

export function getChargeItems(cart: CartInterface): Array<any> {
  return cart.items.map((cartItem) => {
    return {
      ...cartItem.delivery,
      ...cartItem.product,
      quantity: cartItem.quantity
    };
  });
}

export function getChargeFromCartItemGroup(
  cartItemGroup: CartItemGroupInterface,
  overRangeCharge: number
) {
  let price = 0;
  let cost = 0;
  let tax = 0;

  cartItemGroup.items.map((x) => {
    price += x.price * x.quantity;
    cost += x.cost * x.quantity;
    tax += Math.ceil(x.price * x.quantity * x.taxRate) / 100;
  });

  const tips = 0;
  const groupDiscount = 0;
  const overRangeTotal = Math.round(overRangeCharge * 100) / 100;

  return {
    price,
    cost,
    tips,
    tax,
    overRangeCharge: overRangeTotal,
    deliveryCost: 0, // merchant.deliveryCost,
    deliveryDiscount: 0, // merchant.deliveryCost,
    groupDiscount, // groupDiscount,
    total: price + tax + tips - groupDiscount + overRangeTotal
  };
}

export function getCartItemGroups(cart: CartInterface) {
  const groups = [];
  cart.items.forEach((cartItem) => {
    const group = groups.find(
      (o) =>
        o.date === cartItem.delivery.date &&
        o.time === cartItem.delivery.time &&
        o.merchantId === cartItem.product.merchantId
    );
    if (group) {
      group.items.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.price,
        cost: cartItem.cost,
        taxRate: cartItem.product.taxRate
      });
    } else {
      groups.push({
        merchantId: cartItem.product.merchantId,
        date: cartItem.delivery.date,
        time: cartItem.delivery.time,
        items: [
          {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            cost: cartItem.cost,
            taxRate: cartItem.product.taxRate
          }
        ]
      });
    }
  });
  return groups;
}

export function createOrder(
  account: AccountInterface,
  merchant: MerchantInterface,
  items: Array<any>,
  location: LocationInterface,
  deliverDate: string,
  deliverTime: string,
  charge,
  note: string,
  paymentMethod: string,
  lang: string
): OrderInterface {
  // const sCreated = moment().toISOString();
  // const { deliverDate, deliverTime } = this.getDeliveryDateTimeByPhase(sCreated, merchant.phases, delivery.dateType);
  const status =
    paymentMethod === PaymentMethod.CREDIT_CARD ||
    paymentMethod === PaymentMethod.WECHAT
      ? OrderStatus.TEMP
      : OrderStatus.NEW; // prepay need Driver to confirm finished

  const paymentStatus =
    paymentMethod === PaymentMethod.PREPAY
      ? PaymentStatus.PAID
      : PaymentStatus.UNPAID;

  const order = {
    clientId: account._id,
    clientName: account.username,
    merchantId: merchant._id,
    merchantName: lang === "zh" ? merchant.name : merchant.nameEN,
    items,
    location,
    pickupTime: "10:00",
    deliverDate,
    deliverTime,
    type: OrderType.GROCERY,
    status,
    paymentStatus,
    paymentMethod,
    note,
    price: Math.round(charge.price * 100) / 100,
    cost: Math.round(charge.cost * 100) / 100,
    deliveryCost: Math.round(charge.deliveryCost * 100) / 100,
    deliveryDiscount: Math.round(charge.deliveryCost * 100) / 100,
    groupDiscount: Math.round(charge.groupDiscount * 100) / 100,
    overRangeCharge: Math.round(charge.overRangeCharge * 100) / 100,
    total: Math.round(charge.total * 100) / 100,
    tax: Math.round(charge.tax * 100) / 100,
    tips: Math.round(charge.tips * 100) / 100,
    defaultPickupTime: account.pickup ? account.pickup : ""
  };

  return order;
}

export function getOrderSummary(
  orderGroups: Array<CartItemGroupInterface>,
  overRangeCharge: number
): OrderSummaryInterface {
  let totalPrice = 0;
  let totalCost = 0;
  let totalTax = 0;
  // eslint-disable-next-line prefer-const
  let totalTips = 0;
  let totalOverRangeCharge = 0;
  let total = 0;
  // eslint-disable-next-line prefer-const
  let tips = 0;
  // eslint-disable-next-line prefer-const
  let groupDiscount = 0;
  if (orderGroups && orderGroups.length) {
    orderGroups.forEach((order) => {
      let price = 0;
      let cost = 0;
      let tax = 0;
      order.items.forEach((orderItem) => {
        price += orderItem.price * orderItem.quantity;
        cost += orderItem.cost * orderItem.quantity;
        tax +=
          Math.ceil(orderItem.price * orderItem.quantity * orderItem.taxRate) /
          100;
      });
      const subTotal = price + tax + tips - groupDiscount + overRangeCharge;
      totalPrice += price;
      totalCost += cost;
      totalTax += tax;
      totalOverRangeCharge += overRangeCharge;
      total += subTotal;
    });
    return {
      price: totalPrice,
      cost: totalCost,
      tips: totalTips,
      tax: totalTax,
      overRangeCharge: totalOverRangeCharge,
      deliveryCost: 0,
      deliveryDiscount: 0,
      groupDiscount,
      total
    };
  }
}
