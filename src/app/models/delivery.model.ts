export interface DeliveryDateTimeInterface {
  date: string;
  time: string;
  margin?: number;
}

export function areEqualDeliveryDateTime(
  one: DeliveryDateTimeInterface,
  other: DeliveryDateTimeInterface
) {
  return one.date === other.date && one.time === other.time;
}
