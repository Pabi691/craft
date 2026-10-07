// SPHOORA leads the shop. The CRM returns categories in its own order, with
// Tea last, so any list that shows every category is re-ordered here: the tea
// categories first, then the weaves, each keeping its CRM order otherwise.
export const TEA_SLUGS = ['tea', 'connoisseurs-choice', 'signature-collection', 'signature-blends'];

export const isTeaCategory = (cat) => TEA_SLUGS.includes(cat?.slug);

// Array.prototype.sort is stable, so non-tea categories keep their order.
export const teaFirst = (cats = []) => [...cats].sort((a, b) => isTeaCategory(b) - isTeaCategory(a));
