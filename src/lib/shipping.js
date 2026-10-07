// Delivery charges. Free within West Bengal, a flat charge elsewhere in
// India, and free anywhere once the order is big enough — so a small
// interstate order carries its own cost, and the charge gives a reason to add
// a second pack rather than abandon the bag.
//
// The server checks the same numbers in create_order (WebAppController), so
// keep the two in step.
export const HOME_STATE = 'West Bengal';
export const OUTSTATION_CHARGE = 40;
export const FREE_ABOVE = 999;

const flatten = (state) => String(state ?? '').toLowerCase().replace(/[^a-z]/g, '');

// "West Bengal", "west bengal", "WB", "W.B." all count as home.
export const isHomeState = (state) => {
  const s = flatten(state);
  return s === flatten(HOME_STATE) || s === 'wb';
};

// `orderValue` is the amount after any discount, before delivery.
export const deliveryCharge = (state, orderValue) => {
  if (isHomeState(state)) return 0;
  if (Number(orderValue) >= FREE_ABOVE) return 0;
  return OUTSTATION_CHARGE;
};

// How much more would make delivery free — null when it already is, or when
// the address is in the home state and always free.
export const amountToFreeDelivery = (state, orderValue) => {
  if (isHomeState(state)) return null;
  const gap = FREE_ABOVE - Number(orderValue || 0);
  return gap > 0 ? Math.ceil(gap) : null;
};
