export interface DeliveryDateTimeInterface {
  date: string;
  time: string;
}
export function areEqualDeliveryDateTime(
  one: DeliveryDateTimeInterface,
  other: DeliveryDateTimeInterface
) {
  return one.date === other.date && one.time === other.time;
}
