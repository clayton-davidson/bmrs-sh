import { Customer, CustomerOrder, ProcessedCustomerData } from "./schemas/customers";

export const processCustomerData = (
  orders: CustomerOrder[],
  customer: Customer
): ProcessedCustomerData => {
  if (!orders || orders.length === 0) {
    return {
      ...customer,
      tonsOrderedPastYear: 0,
      tonsShippedPastYear: 0,
      fulfillmentRate: "0",
      breakdownBySection: [],
      orderEntries: [],
    };
  }

  const tonsOrderedPastYear = Number(
    orders
      .reduce((sum: number, order: CustomerOrder) => sum + (order.TONS || 0), 0)
      .toFixed(2)
  );

  const tonsShippedPastYear = Number(
    orders
      .reduce(
        (sum: number, order: CustomerOrder) => sum + (order.TONSSHIPPED || 0),
        0
      )
      .toFixed(2)
  );

  const fulfillmentRate =
    tonsOrderedPastYear > 0
      ? ((tonsShippedPastYear / tonsOrderedPastYear) * 100).toFixed(1)
      : "0";

  const breakdownBySection = Object.values(
    orders.reduce((acc: Record<string, any>, order: CustomerOrder) => {
      const product = order.PRODUCT || "Unknown";
      const key = `${product}-${order.CUSTOMER}`;

      if (!acc[key]) {
        acc[key] = {
          product: product,
          customer: order.CUSTOMER,
          tons: 0,
          bundlesOrdered: 0,
        };
      }

      acc[key].tons += order.TONS || 0;
      acc[key].bundlesOrdered += order.BUNDLESORDERED || 0;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b.tons - a.tons);

  const orderEntries = Object.values(
    orders.reduce((acc: Record<string, any>, order: CustomerOrder) => {
      if (!order.ORDERDATE) return acc;

      try {
        const orderDate = new Date(order.ORDERDATE);
        if (isNaN(orderDate.getTime())) return acc;

        const key = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;

        if (!acc[key]) {
          acc[key] = {
            orderDate: new Date(
              orderDate.getFullYear(),
              orderDate.getMonth(),
              1
            ),
            tons: 0,
          };
        }

        acc[key].tons += order.TONS || 0;
        return acc;
      } catch (error) {
        return acc;
      }
    }, {})
  ).sort((a: any, b: any) => a.orderDate - b.orderDate);

  return {
    ...customer,
    tonsOrderedPastYear,
    tonsShippedPastYear,
    fulfillmentRate,
    breakdownBySection,
    orderEntries,
  };
};


export const getFulfillmentRateColor = (rate: number): string => {
  if (rate >= 95) return "text-green-600";
  if (rate >= 80) return "text-amber-500";
  return "text-red-500";
};
    
/**
 * Formats date strings safely
 */
export const formatCustomDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (error) {
    return dateString || "N/A";
  }
};
