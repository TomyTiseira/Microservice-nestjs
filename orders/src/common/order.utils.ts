export function mergeItems(items: { productId: number; quantity: number }[]) {
  return Object.values(
    items.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = { ...item };
      } else {
        acc[item.productId].quantity += item.quantity;
      }
      return acc;
    }, {} as Record<number, { productId: number; quantity: number }>)
  );
}
