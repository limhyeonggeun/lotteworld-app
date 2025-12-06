export const makeOrderId = () => `mid_${Date.now()}`;
export const makeTicketNo = () => {
  const r = () => Math.floor(1000 + Math.random() * 9000);
  return `${r()}-${r()}-${r()}-${r()}`;
};