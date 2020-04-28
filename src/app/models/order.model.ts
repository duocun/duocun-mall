import { LocationInterface, AddressInterface } from "./location.model";
import { CartInterface } from "./cart.model";

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

export function getChargeItems(cart: CartInterface): Array<any> {
  return cart.items.map((cartItem) => {
    return {
      ...cartItem.delivery,
      ...cartItem.product,
      quantity: cartItem.quantity
    };
  });
}

export function getOrderGroups(cart: CartInterface) {
  const orders = [];
  cart.items.forEach((cartItem) => {
    const order = orders.find(
      (o) =>
        o.date === cartItem.delivery.date && o.time === cartItem.delivery.time
    );
    if (order) {
      order.items.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.price,
        cost: cartItem.cost,
        taxRate: cartItem.product.taxRate
      });
    } else {
      orders.push({
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
  return orders;
}

export function getOrderSummary(
  orderGroups: Array<any>,
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
